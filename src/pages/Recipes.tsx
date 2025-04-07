
import React, { useState } from 'react';
import { mockRecipes, mockTags } from '@/lib/mockData';
import { Recipe } from '@/lib/types';
import Navbar from '@/components/Navbar';
import RecipeCard from '@/components/RecipeCard';
import RecipeForm from '@/components/RecipeForm';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleFavoriteToggle = (id: string, isFavorite: boolean) => {
    setRecipes(prev => 
      prev.map(recipe => 
        recipe.id === id ? { ...recipe, isFavorite } : recipe
      )
    );
  };
  
  const handleSaveRecipe = (recipeData: Partial<Recipe>) => {
    const newRecipe: Recipe = {
      ...recipeData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isFavorite: false,
      ingredients: recipeData.ingredients || [],
      instructions: recipeData.instructions || [],
      tags: recipeData.tags || [],
      title: recipeData.title || 'Untitled Recipe',
      description: recipeData.description || '',
      imageUrl: recipeData.imageUrl || 'https://images.unsplash.com/photo-1546069901-5ec6a79120b0?q=80&w=1000',
      prepTime: recipeData.prepTime || 0,
      cookTime: recipeData.cookTime || 0,
      servings: recipeData.servings || 1,
    };
    
    setRecipes(prev => [...prev, newRecipe]);
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

        {filteredRecipes.length > 0 ? (
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
            <p className="text-xl text-muted-foreground">No recipes found. Try adjusting your filters.</p>
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
