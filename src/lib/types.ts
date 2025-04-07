
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
