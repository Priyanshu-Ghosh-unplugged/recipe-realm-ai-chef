import { Database } from "@/integrations/supabase/types";

// Original types (keep for compatibility with existing code)
export type Tag = {
  id: string;
  name: string;
  color?: string;
};

export type Ingredient = {
  id: string;
  name: string;
  amount: string;
  unit: string;
};

export type RecipeInstruction = {
  id: string;
  step: number;
  text: string;
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: RecipeInstruction[];
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
};

export type MealPlan = {
  id: string;
  date: Date;
  recipeId: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert';
};

export type GroceryItem = {
  id: string;
  name: string;
  amount: string;
  unit: string;
  checked: boolean;
  recipeId?: string;
};

export type GroceryList = {
  id: string;
  name: string;
  items: GroceryItem[];
  createdAt: Date;
};

// Supabase types (for API integration)
export type SupabaseRecipe = Database['public']['Tables']['recipes']['Row'];
export type SupabaseRecipeIngredient = Database['public']['Tables']['recipe_ingredients']['Row'];
export type SupabaseRecipeInstruction = Database['public']['Tables']['recipe_instructions']['Row'];
export type SupabaseIngredient = Database['public']['Tables']['ingredients']['Row'];
export type SupabaseMealPlan = Database['public']['Tables']['meal_plans']['Row'];
export type SupabaseGroceryList = Database['public']['Tables']['grocery_lists']['Row'];
export type SupabaseGroceryItem = Database['public']['Tables']['grocery_items']['Row'];
export type SupabaseTag = Database['public']['Tables']['tags']['Row'];
export type SupabaseProfile = Database['public']['Tables']['profiles']['Row'];
