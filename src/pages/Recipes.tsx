
import React, { useState, useEffect } from 'react';
import { mockTags } from '@/lib/mockData';
import { Recipe, Tag } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import RecipeCard from '@/components/RecipeCard';
import RecipeForm from '@/components/RecipeForm';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Filter, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const Recipes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, [user]);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all recipes (we'll add RLS policies later to restrict to user's own recipes)
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*');
      
      if (recipesError) throw recipesError;
      
      // Build complete recipe objects
      const completeRecipes: Recipe[] = [];
      
      for (const recipeData of recipesData) {
        try {
          // Fetch ingredients
          const { data: ingredientsData } = await supabase
            .from('recipe_ingredients')
            .select(`
              id,
              amount,
              unit,
              ingredients(id, name)
            `)
            .eq('recipe_id', recipeData.id);
          
          // Fetch instructions
          const { data: instructionsData } = await supabase
            .from('recipe_instructions')
            .select('*')
            .eq('recipe_id', recipeData.id)
            .order('step', { ascending: true });
          
          // Fetch tags
          const { data: tagsData } = await supabase
            .from('recipe_tags')
            .select(`
              tags(id, name, color)
            `)
            .eq('recipe_id', recipeData.id);
          
          // Format the recipe with related data
          const recipe: Recipe = {
            id: recipeData.id,
            title: recipeData.title,
            description: recipeData.description || '',
            imageUrl: recipeData.image_url || '',
            prepTime: recipeData.prep_time || 0,
            cookTime: recipeData.cook_time || 0,
            servings: recipeData.servings || 1,
            createdAt: new Date(recipeData.created_at),
            updatedAt: new Date(recipeData.updated_at),
            isFavorite: recipeData.is_favorite || false,
            ingredients: (ingredientsData || []).map((item: any) => ({
              id: item.id,
              name: item.ingredients?.name || '',
              amount: item.amount,
              unit: item.unit || ''
            })),
            instructions: (instructionsData || []).map((instruction: any) => ({
              id: instruction.id,
              step: instruction.step,
              text: instruction.text
            })),
            tags: (tagsData || []).map((tagItem: any) => ({
              id: tagItem.tags.id,
              name: tagItem.tags.name,
              color: tagItem.tags.color
            }))
          };
          
          completeRecipes.push(recipe);
        } catch (error) {
          console.error('Error fetching recipe details:', error);
        }
      }
      
      setRecipes(completeRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load recipes. Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoriteToggle = async (id: string, isFavorite: boolean) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to favorite recipes",
      });
      return;
    }
    
    try {
      // Update the database
      const { error } = await supabase
        .from('recipes')
        .update({ is_favorite: isFavorite })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setRecipes(prev => 
        prev.map(recipe => 
          recipe.id === id ? { ...recipe, isFavorite } : recipe
        )
      );
    } catch (error) {
      console.error('Error updating favorite status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update favorite status"
      });
    }
  };
  
  const handleSaveRecipe = (recipeData: Partial<Recipe>) => {
    // RecipeForm now handles the Supabase save operation
    // Just refresh the recipes list and close the form
    fetchRecipes();
    setIsFormOpen(false);
  };

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = searchQuery === '' || 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      recipe.tags.some(tag => selectedTags.includes(tag.id));
    
    return matchesSearch && matchesTags;
  });

  return (
    <div className="min-h-screen bg-recipe-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Recipe Library</h1>
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-recipe-primary hover:bg-recipe-primary/90">
                <Plus className="h-4 w-4 mr-2" /> Add Recipe
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <ScrollArea className="max-h-[80vh]">
                <RecipeForm 
                  onSave={handleSaveRecipe}
                  onCancel={() => setIsFormOpen(false)}
                />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                className="pl-10" 
                placeholder="Search recipes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Button variant="outline" className="w-full">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Filter by Tags</h3>
          <div className="flex flex-wrap gap-2">
            {mockTags.map(tag => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`tag-pill cursor-pointer ${
                  selectedTags.includes(tag.id) 
                    ? 'bg-recipe-primary text-white' 
                    : ''
                }`}
                style={{ backgroundColor: selectedTags.includes(tag.id) ? tag.color : undefined }}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-recipe-primary" />
            <span className="ml-2">Loading recipes...</span>
          </div>
        ) : filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRecipes.map(recipe => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No recipes found. Try adjusting your filters or add a new recipe.</p>
            <Button onClick={() => { setSearchQuery(''); setSelectedTags([]); }} variant="link" className="mt-2">
              Clear all filters
            </Button>
          </div>
        )}
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Recipe Realm AI Chef. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Recipes;
