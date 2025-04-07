
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import RecipeCard from '@/components/RecipeCard';
import MealPlanner from '@/components/MealPlanner';
import GroceryList from '@/components/GroceryList';
import RecipeForm from '@/components/RecipeForm';
import { mockRecipes, mockTags } from '@/lib/mockData';
import { Recipe } from '@/lib/types';
import { 
  Plus, 
  ChefHat, 
  Calendar, 
  ShoppingCart, 
  Search, 
  FolderOpen, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);
  
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
              <Button variant="outline" className="border-white hover:bg-white/20">
                <Search className="h-4 w-4 mr-2" /> Explore Recipes
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
                  <Button variant="outline" className="w-full">
                    View Library
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
                  <Button variant="outline" className="w-full">
                    Plan Meals
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
                  <Button variant="outline" className="w-full">
                    View List
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
                  <Button variant="outline" className="w-full">
                    Ask AI Chef
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recipes.map(recipe => (
                    <RecipeCard 
                      key={recipe.id} 
                      recipe={recipe} 
                      onFavoriteToggle={handleFavoriteToggle}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="planner" className="animate-fade-in">
                <MealPlanner />
              </TabsContent>
              
              <TabsContent value="grocery" className="animate-fade-in">
                <GroceryList />
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
