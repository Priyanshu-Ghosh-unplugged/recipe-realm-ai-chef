
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Recipe, RecipeInstruction, Ingredient, Tag } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, Clock, Utensils, Heart, Edit, ChefHat, MessageSquare, 
  PanelRight, List, ShoppingBag, Printer
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRecipeDetails();
    }
  }, [id]);

  const fetchRecipeDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      // First check if the recipe exists in Supabase
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      // If we couldn't find it in Supabase or got an error, try to find it in mock data
      if (recipeError || !recipeData) {
        // Import mock data
        const { mockRecipes } = await import('@/lib/mockData');
        const mockRecipe = mockRecipes.find(r => r.id === id);
        
        if (mockRecipe) {
          setRecipe(mockRecipe);
          setLoading(false);
          return;
        }
        
        // If we couldn't find the recipe in mock data either, show an error
        if (recipeError) throw recipeError;
        throw new Error("Recipe not found");
      }

      // Check if user is owner
      if (user && recipeData.user_id === user.id) {
        setIsOwner(true);
      }

      // Fetch ingredients
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .select(`
          id,
          amount,
          unit,
          ingredients(id, name)
        `)
        .eq('recipe_id', id);

      if (ingredientsError) throw ingredientsError;

      // Fetch instructions
      const { data: instructionsData, error: instructionsError } = await supabase
        .from('recipe_instructions')
        .select('*')
        .eq('recipe_id', id)
        .order('step', { ascending: true });

      if (instructionsError) throw instructionsError;

      // Fetch tags
      const { data: tagsData, error: tagsError } = await supabase
        .from('recipe_tags')
        .select(`
          tags(id, name, color)
        `)
        .eq('recipe_id', id);

      if (tagsError) throw tagsError;

      // Format the recipe with related data
      const formattedRecipe: Recipe = {
        ...recipeData,
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
        ingredients: ingredientsData.map((item: any) => ({
          id: item.id,
          name: item.ingredients?.name || '',
          amount: item.amount,
          unit: item.unit || ''
        })),
        instructions: instructionsData.map((instruction: RecipeInstruction) => ({
          id: instruction.id,
          step: instruction.step,
          text: instruction.text
        })),
        tags: tagsData.map((tagItem: any) => ({
          id: tagItem.tags.id,
          name: tagItem.tags.name,
          color: tagItem.tags.color
        }))
      };

      setRecipe(formattedRecipe);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load recipe details"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!recipe || !user) return;

    try {
      const newFavoriteStatus = !recipe.isFavorite;

      const { error } = await supabase
        .from('recipes')
        .update({ is_favorite: newFavoriteStatus })
        .eq('id', recipe.id);

      if (error) throw error;

      setRecipe(prev => {
        if (!prev) return null;
        return { ...prev, isFavorite: newFavoriteStatus };
      });

      toast({
        title: newFavoriteStatus ? "Added to favorites" : "Removed from favorites",
        description: newFavoriteStatus 
          ? "Recipe has been added to your favorites" 
          : "Recipe has been removed from your favorites"
      });
    } catch (error) {
      console.error('Error updating favorite status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update favorite status"
      });
    }
  };

  const handleAddToGroceryList = () => {
    // This would open a modal to select or create a grocery list
    // For now, just show a toast
    toast({
      title: "Feature coming soon",
      description: "Adding ingredients to grocery list will be available soon"
    });
  };

  const handleAddToMealPlan = () => {
    // This would open a modal to add to meal plan
    // For now, just show a toast
    toast({
      title: "Feature coming soon",
      description: "Adding to meal plan will be available soon"
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-recipe-background">
        <Navbar />
        <div className="container mx-auto py-10 px-4 flex justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-4xl">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-56 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-recipe-background">
        <Navbar />
        <div className="container mx-auto py-10 px-4 text-center">
          <div className="p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Recipe not found</h2>
            <p className="text-muted-foreground mb-6">We couldn't find the recipe you're looking for. It may have been deleted or you might have followed an invalid link.</p>
            <Button asChild>
              <Link to="/recipes">Back to Recipes</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-recipe-background">
      <Navbar />
      
      <div className="container mx-auto py-6 px-4">
        <div className="max-w-5xl mx-auto mb-6">
          {/* Back button and actions */}
          <div className="flex justify-between items-center mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            
            <div className="flex gap-2">
              {user && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleFavorite}
                  className={recipe.isFavorite ? "text-rose-500" : ""}
                >
                  <Heart className={`h-4 w-4 mr-1 ${recipe.isFavorite ? "fill-current" : ""}`} />
                  {recipe.isFavorite ? "Favorited" : "Favorite"}
                </Button>
              )}
              
              {isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link to={`/recipes/edit/${recipe.id}`}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Link>
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4 mr-1" /> Print
              </Button>
            </div>
          </div>
          
          {/* Recipe header with enhanced styling */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="relative h-64 md:h-80 bg-gradient-to-r from-recipe-saffron to-recipe-chili overflow-hidden">
              <img 
                src={recipe.imageUrl || '/placeholder.svg'} 
                alt={recipe.title}
                className="w-full h-full object-cover opacity-90 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{recipe.title}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.tags.map(tag => (
                    <span 
                      key={tag.id} 
                      className="px-3 py-1 rounded-full text-xs font-medium animate-fade-in"
                      style={{ 
                        backgroundColor: tag.color || '#e2e8f0', 
                        color: getContrastColor(tag.color || '#e2e8f0') 
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Recipe meta info */}
            <div className="p-8">
              <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-6 border-b pb-6">
                <div className="flex items-center">
                  <div className="bg-recipe-primary/10 p-2 rounded-full mr-2">
                    <Clock className="h-5 w-5 text-recipe-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Prep Time</p>
                    <p className="font-semibold">{recipe.prepTime} min</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-recipe-chili/10 p-2 rounded-full mr-2">
                    <ChefHat className="h-5 w-5 text-recipe-chili" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cook Time</p>
                    <p className="font-semibold">{recipe.cookTime} min</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-recipe-turmeric/10 p-2 rounded-full mr-2">
                    <Utensils className="h-5 w-5 text-recipe-curry" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Servings</p>
                    <p className="font-semibold">{recipe.servings}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                {recipe.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  className="flex items-center bg-gradient-to-r from-recipe-primary to-recipe-accent hover:brightness-110 transition-all"
                  onClick={handleAddToGroceryList}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Grocery List
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center border-recipe-primary text-recipe-primary hover:bg-recipe-primary/5"
                  onClick={handleAddToMealPlan}
                >
                  <PanelRight className="h-4 w-4 mr-2" />
                  Add to Meal Plan
                </Button>
              </div>
            </div>
          </div>
          
          {/* Recipe content tabs with enhanced styling */}
          <Tabs defaultValue="ingredients" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="ingredients" className="flex items-center gap-2 py-3">
                <List className="h-4 w-4" />
                <span>Ingredients</span>
              </TabsTrigger>
              <TabsTrigger value="instructions" className="flex items-center gap-2 py-3">
                <MessageSquare className="h-4 w-4" />
                <span>Instructions</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="ingredients" className="mt-2 animate-fade-in">
              <Card className="border-0 shadow-md overflow-hidden">
                <CardContent className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Ingredients for {recipe.servings} servings</h3>
                      <ul className="space-y-3">
                        {recipe.ingredients.map((ingredient, index) => (
                          <li key={ingredient.id || index} className="flex items-start group transition-all hover:bg-recipe-background rounded p-1 -ml-1">
                            <span className="h-2 w-2 rounded-full bg-recipe-primary mt-2 mr-2 group-hover:bg-recipe-saffron transition-colors"></span>
                            <span>
                              <strong>{ingredient.amount} {ingredient.unit}</strong> {ingredient.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-recipe-background p-6 rounded-lg">
                      <h3 className="text-lg font-medium mb-4">Adjust Servings</h3>
                      <p className="text-gray-600 mb-6">
                        Need to make this recipe for more or fewer people? Adjust the servings to recalculate the ingredients.
                      </p>
                      <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" className="h-10 w-10 rounded-full p-0">-</Button>
                        <span className="text-xl font-medium">{recipe.servings}</span>
                        <Button variant="outline" size="sm" className="h-10 w-10 rounded-full p-0">+</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="instructions" className="mt-2 animate-fade-in">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-lg font-medium mb-6">Step by Step Instructions</h3>
                  <div className="space-y-8">
                    {recipe.instructions
                      .sort((a, b) => a.step - b.step)
                      .map((instruction) => (
                      <div key={instruction.id} className="flex group">
                        <div className="mr-6 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-recipe-primary to-recipe-accent flex items-center justify-center text-white font-medium group-hover:scale-110 transition-transform">
                            {instruction.step}
                          </div>
                        </div>
                        <div className="pt-1">
                          <p className="text-gray-700">{instruction.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// Helper function to determine text color based on background color
function getContrastColor(hexColor: string) {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate luminance (perceived brightness)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export default RecipeDetail;
