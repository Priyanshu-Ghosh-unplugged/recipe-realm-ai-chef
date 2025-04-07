
import { Recipe, Tag, MealPlan, GroceryList } from './types';

export const mockTags: Tag[] = [
  { id: '1', name: 'Breakfast', color: '#FFD166' },
  { id: '2', name: 'Lunch', color: '#06D6A0' },
  { id: '3', name: 'Dinner', color: '#118AB2' },
  { id: '4', name: 'Dessert', color: '#EF476F' },
  { id: '5', name: 'Vegetarian', color: '#4CB944' },
  { id: '6', name: 'Quick & Easy', color: '#FF6B35' },
  { id: '7', name: 'Family Favorite', color: '#9E0059' },
  { id: '8', name: 'Healthy', color: '#06D6A0' },
];

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Grandma\'s Apple Pie',
    description: 'A classic family recipe passed down for generations. Sweet, tart apples in a flaky crust.',
    imageUrl: 'https://images.unsplash.com/photo-1621743478914-cc8a68d76208?q=80&w=1000',
    prepTime: 30,
    cookTime: 45,
    servings: 8,
    ingredients: [
      { id: '1-1', name: 'Apples', amount: '6', unit: 'large' },
      { id: '1-2', name: 'Sugar', amount: '3/4', unit: 'cup' },
      { id: '1-3', name: 'Cinnamon', amount: '1', unit: 'tsp' },
      { id: '1-4', name: 'Pie Crust', amount: '2', unit: '' },
    ],
    instructions: [
      { id: '1-1', step: 1, text: 'Preheat oven to 425°F.' },
      { id: '1-2', step: 2, text: 'Peel and slice apples.' },
      { id: '1-3', step: 3, text: 'Mix apples with sugar and cinnamon.' },
      { id: '1-4', step: 4, text: 'Place in pie crust, add top crust.' },
      { id: '1-5', step: 5, text: 'Bake for 45 minutes until golden.' },
    ],
    tags: [{ id: '4', name: 'Dessert', color: '#EF476F' }, { id: '7', name: 'Family Favorite', color: '#9E0059' }],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
    isFavorite: true,
  },
  {
    id: '2',
    title: 'Mom\'s Lasagna',
    description: 'Layers of pasta, ricotta cheese, and homemade meat sauce. A comfort food classic.',
    imageUrl: 'https://images.unsplash.com/photo-1619895092538-128341789043?q=80&w=1000',
    prepTime: 45,
    cookTime: 60,
    servings: 8,
    ingredients: [
      { id: '2-1', name: 'Lasagna Noodles', amount: '12', unit: 'sheets' },
      { id: '2-2', name: 'Ground Beef', amount: '1', unit: 'lb' },
      { id: '2-3', name: 'Ricotta Cheese', amount: '15', unit: 'oz' },
      { id: '2-4', name: 'Mozzarella Cheese', amount: '2', unit: 'cups' },
    ],
    instructions: [
      { id: '2-1', step: 1, text: 'Brown meat and make sauce.' },
      { id: '2-2', step: 2, text: 'Cook noodles until al dente.' },
      { id: '2-3', step: 3, text: 'Layer sauce, noodles, and cheese.' },
      { id: '2-4', step: 4, text: 'Bake at 375°F for 45 minutes.' },
    ],
    tags: [{ id: '3', name: 'Dinner', color: '#118AB2' }, { id: '7', name: 'Family Favorite', color: '#9E0059' }],
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-03-05'),
    isFavorite: true,
  },
  {
    id: '3',
    title: 'Avocado Toast',
    description: 'Simple and nutritious breakfast ready in minutes.',
    imageUrl: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?q=80&w=1000',
    prepTime: 5,
    cookTime: 5,
    servings: 1,
    ingredients: [
      { id: '3-1', name: 'Bread', amount: '1', unit: 'slice' },
      { id: '3-2', name: 'Avocado', amount: '1/2', unit: '' },
      { id: '3-3', name: 'Salt', amount: '1', unit: 'pinch' },
      { id: '3-4', name: 'Red Pepper Flakes', amount: '1/4', unit: 'tsp' },
    ],
    instructions: [
      { id: '3-1', step: 1, text: 'Toast bread.' },
      { id: '3-2', step: 2, text: 'Mash avocado and spread on toast.' },
      { id: '3-3', step: 3, text: 'Sprinkle with salt and red pepper flakes.' },
    ],
    tags: [{ id: '1', name: 'Breakfast', color: '#FFD166' }, { id: '5', name: 'Vegetarian', color: '#4CB944' }, { id: '6', name: 'Quick & Easy', color: '#FF6B35' }],
    createdAt: new Date('2023-04-03'),
    updatedAt: new Date('2023-04-03'),
    isFavorite: false,
  },
  {
    id: '4',
    title: 'Quinoa Salad',
    description: 'Light and refreshing salad packed with vegetables and protein.',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-5ec6a79120b0?q=80&w=1000',
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    ingredients: [
      { id: '4-1', name: 'Quinoa', amount: '1', unit: 'cup' },
      { id: '4-2', name: 'Cucumber', amount: '1', unit: 'medium' },
      { id: '4-3', name: 'Cherry Tomatoes', amount: '1', unit: 'cup' },
      { id: '4-4', name: 'Feta Cheese', amount: '1/2', unit: 'cup' },
      { id: '4-5', name: 'Olive Oil', amount: '2', unit: 'tbsp' },
    ],
    instructions: [
      { id: '4-1', step: 1, text: 'Cook quinoa according to package directions.' },
      { id: '4-2', step: 2, text: 'Chop vegetables and combine with cooled quinoa.' },
      { id: '4-3', step: 3, text: 'Add feta cheese and drizzle with olive oil.' },
      { id: '4-4', step: 4, text: 'Season with salt and pepper to taste.' },
    ],
    tags: [{ id: '2', name: 'Lunch', color: '#06D6A0' }, { id: '5', name: 'Vegetarian', color: '#4CB944' }, { id: '8', name: 'Healthy', color: '#06D6A0' }],
    createdAt: new Date('2023-03-22'),
    updatedAt: new Date('2023-03-25'),
    isFavorite: false,
  },
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const dayAfterTomorrow = new Date(today);
dayAfterTomorrow.setDate(today.getDate() + 2);

export const mockMealPlans: MealPlan[] = [
  {
    id: '1',
    date: today,
    recipeId: '3',
    mealType: 'breakfast',
  },
  {
    id: '2',
    date: today,
    recipeId: '2',
    mealType: 'dinner',
  },
  {
    id: '3',
    date: tomorrow,
    recipeId: '4',
    mealType: 'lunch',
  },
  {
    id: '4',
    date: dayAfterTomorrow,
    recipeId: '1',
    mealType: 'dessert',
  },
];

export const mockGroceryList: GroceryList = {
  id: '1',
  name: 'Weekly Shopping',
  items: [
    { id: '1', name: 'Apples', amount: '6', unit: 'large', checked: false, recipeId: '1' },
    { id: '2', name: 'Ground Beef', amount: '1', unit: 'lb', checked: true, recipeId: '2' },
    { id: '3', name: 'Avocado', amount: '2', unit: '', checked: false, recipeId: '3' },
    { id: '4', name: 'Quinoa', amount: '1', unit: 'cup', checked: false, recipeId: '4' },
    { id: '5', name: 'Milk', amount: '1', unit: 'gallon', checked: false },
  ],
  createdAt: new Date(),
};
