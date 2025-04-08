import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import RecipeCard from '@/components/RecipeCard';
import MealPlanner from '@/components/MealPlanner';
import GroceryList from '@/components/GroceryList';
import RecipeForm from '@/components/RecipeForm';
import { Recipe } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Plus, 
  ChefHat, 
  Calendar, 
  ShoppingCart, 
  Search, 
  FolderOpen,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    fetchRecipes();
  }, []);
  
  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      
      // Fetch recent or featured recipes
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);
      
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
        description: "Failed to load featured recipes."
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
  
  return (
    <div className="min-h-screen bg-recipe-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-recipe-primary text-white py-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Recipe Realm AI Chef
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Organize your family recipes, plan meals, and simplify grocery shopping - all in one place.
            </p>
            <div className="flex justify-center gap-4">
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white text-recipe-primary hover:bg-white/90">
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
              <Button variant="outline" className="border-white hover:bg-white/20" asChild>
                <Link to="/recipes">
                  <Search className="h-4 w-4 mr-2" /> Explore Recipes
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="py-12 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Quick Access</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="hover-scale">
                <CardHeader className="text-center">
                  <div className="mx-auto p-3 bg-recipe-primary/10 rounded-full mb-2">
                    <FolderOpen className="h-6 w-6 text-recipe-primary" />
                  </div>
                  <CardTitle>Recipe Library</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="mb-4 text-sm text-muted-foreground">
                    Browse and organize all your recipes with custom tags.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/recipes">View Library</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover-scale">
                <CardHeader className="text-center">
                  <div className="mx-auto p-3 bg-recipe-primary/10 rounded-full mb-2">
                    <Calendar className="h-6 w-6 text-recipe-primary" />
                  </div>
                  <CardTitle>Meal Planner</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="mb-4 text-sm text-muted-foreground">
                    Plan your meals for the week with an interactive calendar.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/meal-planner">Plan Meals</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover-scale">
                <CardHeader className="text-center">
                  <div className="mx-auto p-3 bg-recipe-primary/10 rounded-full mb-2">
                    <ShoppingCart className="h-6 w-6 text-recipe-primary" />
                  </div>
                  <CardTitle>Grocery List</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="mb-4 text-sm text-muted-foreground">
                    Generate shopping lists from your planned meals.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/grocery-list">View List</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover-scale">
                <CardHeader className="text-center">
                  <div className="mx-auto p-3 bg-recipe-primary/10 rounded-full mb-2">
                    <ChefHat className="h-6 w-6 text-recipe-primary" />
                  </div>
                  <CardTitle>AI Chef</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="mb-4 text-sm text-muted-foreground">
                    Get AI-powered recipe suggestions and meal ideas.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/ai-chef">Ask AI Chef</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Featured Tabs */}
        <div className="py-8 px-4 bg-muted/30">
          <div className="container mx-auto">
            <Tabs defaultValue="recipes" className="w-full">
              <div className="flex justify-between items-center mb-6">
                <TabsList>
                  <TabsTrigger value="recipes">Featured Recipes</TabsTrigger>
                  <TabsTrigger value="planner">Meal Planner</TabsTrigger>
                  <TabsTrigger value="grocery">Grocery List</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="recipes" className="animate-fade-in">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-recipe-primary" />
                    <span className="ml-2">Loading recipes...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recipes.map(recipe => (
                      <RecipeCard 
                        key={recipe.id} 
                        recipe={recipe} 
                        onFavoriteToggle={handleFavoriteToggle}
                      />
                    ))}
                    <div className="flex items-center justify-center">
                      <Button asChild className="bg-recipe-primary hover:bg-recipe-primary/90">
                        <Link to="/recipes">
                          View All Recipes
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="planner" className="animate-fade-in">
                <div>
                  <MealPlanner />
                  <div className="flex justify-center mt-6">
                    <Button asChild className="bg-recipe-primary hover:bg-recipe-primary/90">
                      <Link to="/meal-planner">
                        Open Full Meal Planner
                      </Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="grocery" className="animate-fade-in">
                <div>
                  <GroceryList />
                  <div className="flex justify-center mt-6">
                    <Button asChild className="bg-recipe-primary hover:bg-recipe-primary/90">
                      <Link to="/grocery-list">
                        Open Full Grocery List
                      </Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Recipe Realm AI Chef. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
