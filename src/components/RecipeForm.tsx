import React, { useState } from 'react';
import { Recipe, Ingredient, RecipeInstruction, Tag } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus } from 'lucide-react';
import TagInput from './TagInput';
import { mockTags } from '@/lib/mockData';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface RecipeFormProps {
  initialRecipe?: Partial<Recipe>;
  onSave: (recipe: Partial<Recipe>) => void;
  onCancel: () => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({
  initialRecipe,
  onSave,
  onCancel
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  const [recipe, setRecipe] = useState<Partial<Recipe>>(initialRecipe || {
    title: '',
    description: '',
    imageUrl: '',
    prepTime: 0,
    cookTime: 0,
    servings: 1,
    ingredients: [],
    instructions: [],
    tags: [],
  });

  const [newIngredient, setNewIngredient] = useState<Partial<Ingredient>>({
    name: '',
    amount: '',
    unit: ''
  });

  const [newInstruction, setNewInstruction] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecipe(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = parseInt(value);
    if (!isNaN(numberValue) && numberValue >= 0) {
      setRecipe(prev => ({ ...prev, [name]: numberValue }));
    }
  };

  const handleIngredientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewIngredient(prev => ({ ...prev, [name]: value }));
  };

  const addIngredient = () => {
    if (newIngredient.name && newIngredient.amount) {
      const ingredient: Ingredient = {
        id: Date.now().toString(),
        name: newIngredient.name || '',
        amount: newIngredient.amount || '',
        unit: newIngredient.unit || '',
      };
      
      setRecipe(prev => ({
        ...prev,
        ingredients: [...(prev.ingredients || []), ingredient]
      }));
      
      setNewIngredient({ name: '', amount: '', unit: '' });
    }
  };

  const removeIngredient = (id: string) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients?.filter(ingredient => ingredient.id !== id) || []
    }));
  };

  const addInstruction = () => {
    if (newInstruction.trim()) {
      const instruction: RecipeInstruction = {
        id: Date.now().toString(),
        step: (recipe.instructions?.length || 0) + 1,
        text: newInstruction,
      };
      
      setRecipe(prev => ({
        ...prev,
        instructions: [...(prev.instructions || []), instruction]
      }));
      
      setNewInstruction('');
    }
  };

  const removeInstruction = (id: string) => {
    const updatedInstructions = recipe.instructions?.filter(instruction => instruction.id !== id) || [];
    
    const reordered = updatedInstructions.map((instruction, index) => ({
      ...instruction,
      step: index + 1,
    }));
    
    setRecipe(prev => ({
      ...prev,
      instructions: reordered
    }));
  };

  const handleTagSelect = (tag: Tag) => {
    setRecipe(prev => ({
      ...prev,
      tags: [...(prev.tags || []), tag]
    }));
  };

  const handleTagRemove = (tagId: string) => {
    setRecipe(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag.id !== tagId) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to save recipes."
      });
      return;
    }
    
    if (!recipe.title) {
      toast({
        variant: "destructive",
        title: "Recipe title required",
        description: "Please provide a title for your recipe."
      });
      return;
    }

    try {
      setIsSaving(true);
      
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          title: recipe.title,
          description: recipe.description || '',
          image_url: recipe.imageUrl || 'https://images.unsplash.com/photo-1546069901-5ec6a79120b0?q=80&w=1000',
          prep_time: recipe.prepTime || 0,
          cook_time: recipe.cookTime || 0,
          servings: recipe.servings || 1,
          user_id: user.id,
          is_favorite: false
        })
        .select('id')
        .single();
      
      if (recipeError) throw recipeError;
      
      const recipeId = recipeData.id;
      
      if (recipe.ingredients && recipe.ingredients.length > 0) {
        for (const ingredient of recipe.ingredients) {
          let ingredientId: string;
          
          const { data: existingIngredient } = await supabase
            .from('ingredients')
            .select('id')
            .eq('name', ingredient.name)
            .maybeSingle();
          
          if (existingIngredient) {
            ingredientId = existingIngredient.id;
          } else {
            const { data: newIngredient, error: ingredientError } = await supabase
              .from('ingredients')
              .insert({ name: ingredient.name })
              .select('id')
              .single();
              
            if (ingredientError) throw ingredientError;
            ingredientId = newIngredient.id;
          }
          
          await supabase.from('recipe_ingredients').insert({
            recipe_id: recipeId,
            ingredient_id: ingredientId,
            amount: ingredient.amount,
            unit: ingredient.unit
          });
        }
      }
      
      if (recipe.instructions && recipe.instructions.length > 0) {
        const instructions = recipe.instructions.map(instruction => ({
          recipe_id: recipeId,
          step: instruction.step,
          text: instruction.text
        }));
        
        const { error: instructionsError } = await supabase
          .from('recipe_instructions')
          .insert(instructions);
          
        if (instructionsError) throw instructionsError;
      }
      
      if (recipe.tags && recipe.tags.length > 0) {
        const recipeTags = recipe.tags.map(tag => ({
          recipe_id: recipeId,
          tag_id: tag.id
        }));
        
        const { error: tagsError } = await supabase
          .from('recipe_tags')
          .insert(recipeTags);
          
        if (tagsError) throw tagsError;
      }
      
      toast({
        title: "Recipe saved",
        description: "Your recipe has been saved successfully."
      });
      
      const savedRecipe: Recipe = {
        ...recipe,
        id: recipeId,
        createdAt: new Date(),
        updatedAt: new Date(),
        isFavorite: false,
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
        tags: recipe.tags || [],
        title: recipe.title || 'Untitled Recipe',
      };
      
      onSave(savedRecipe);
      
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        variant: "destructive",
        title: "Error saving recipe",
        description: "There was an error saving your recipe. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{initialRecipe ? 'Edit Recipe' : 'Add New Recipe'}</h2>
        
        <div>
          <label className="block text-sm font-medium mb-1">Recipe Title</label>
          <Input
            name="title"
            value={recipe.title || ''}
            onChange={handleInputChange}
            placeholder="Enter recipe title"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            name="description"
            value={recipe.description || ''}
            onChange={handleInputChange}
            placeholder="Enter recipe description"
            rows={3}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <Input
            name="imageUrl"
            value={recipe.imageUrl || ''}
            onChange={handleInputChange}
            placeholder="Enter image URL"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Prep Time (min)</label>
            <Input
              name="prepTime"
              type="number"
              min="0"
              value={recipe.prepTime || 0}
              onChange={handleNumberInputChange}
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cook Time (min)</label>
            <Input
              name="cookTime"
              type="number"
              min="0"
              value={recipe.cookTime || 0}
              onChange={handleNumberInputChange}
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Servings</label>
            <Input
              name="servings"
              type="number"
              min="1"
              value={recipe.servings || 1}
              onChange={handleNumberInputChange}
              placeholder="1"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <TagInput
            availableTags={mockTags}
            selectedTags={recipe.tags || []}
            onTagSelect={handleTagSelect}
            onTagRemove={handleTagRemove}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-3">Ingredients</label>
          <div className="space-y-3">
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <div className="space-y-2">
                {recipe.ingredients.map((ingredient) => (
                  <div key={ingredient.id} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                    <div className="flex-1">
                      <span className="font-medium">{ingredient.amount} {ingredient.unit}</span> {ingredient.name}
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeIngredient(ingredient.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-xs text-muted-foreground mb-1">Name</label>
                <Input
                  value={newIngredient.name || ''}
                  name="name"
                  onChange={handleIngredientChange}
                  placeholder="Ingredient name"
                />
              </div>
              <div className="w-24">
                <label className="block text-xs text-muted-foreground mb-1">Amount</label>
                <Input
                  value={newIngredient.amount || ''}
                  name="amount"
                  onChange={handleIngredientChange}
                  placeholder="1"
                />
              </div>
              <div className="w-24">
                <label className="block text-xs text-muted-foreground mb-1">Unit</label>
                <Input
                  value={newIngredient.unit || ''}
                  name="unit"
                  onChange={handleIngredientChange}
                  placeholder="cup"
                />
              </div>
              <Button 
                type="button" 
                onClick={addIngredient}
                className="bg-recipe-primary hover:bg-recipe-primary/90"
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-3">Instructions</label>
          <div className="space-y-3">
            {recipe.instructions && recipe.instructions.length > 0 && (
              <div className="space-y-2">
                {recipe.instructions.map((instruction) => (
                  <div key={instruction.id} className="flex items-start gap-2 p-2 bg-muted rounded-md">
                    <div className="bg-recipe-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                      {instruction.step}
                    </div>
                    <div className="flex-1">
                      {instruction.text}
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeInstruction(instruction.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-start gap-2">
              <Textarea
                value={newInstruction}
                onChange={(e) => setNewInstruction(e.target.value)}
                placeholder="Enter instruction step"
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={addInstruction}
                className="bg-recipe-primary hover:bg-recipe-primary/90"
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-recipe-primary hover:bg-recipe-primary/90"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Recipe'}
        </Button>
      </div>
    </form>
  );
};

export default RecipeForm;
