
import React, { useState } from 'react';
import { mockGroceryList, mockRecipes } from '@/lib/mockData';
import { GroceryItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Plus, Trash2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const GroceryList: React.FC = () => {
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>(mockGroceryList.items);
  const [newItem, setNewItem] = useState({ name: '', amount: '', unit: '' });

  const handleCheck = (id: string) => {
    setGroceryItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };
  
  const addItem = () => {
    if (newItem.name) {
      const item: GroceryItem = {
        id: Date.now().toString(),
        name: newItem.name,
        amount: newItem.amount || '1',
        unit: newItem.unit || '',
        checked: false,
      };
      
      setGroceryItems(prev => [...prev, item]);
      setNewItem({ name: '', amount: '', unit: '' });
    }
  };
  
  const removeItem = (id: string) => {
    setGroceryItems(prev => prev.filter(item => item.id !== id));
  };
  
  const getRecipeForItem = (recipeId?: string) => {
    if (!recipeId) return null;
    return mockRecipes.find(recipe => recipe.id === recipeId);
  };
  
  const uncheckedItems = groceryItems.filter(item => !item.checked);
  const checkedItems = groceryItems.filter(item => item.checked);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-recipe-primary" />
          Grocery List
        </h2>
        
        <div>
          <Button variant="outline">
            Share List
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-4">{mockGroceryList.name}</h3>
        
        {/* Add new item form */}
        <div className="flex gap-2 mb-6">
          <div className="flex-1">
            <Input
              value={newItem.name}
              onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Add an item..."
              className="w-full"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addItem();
                }
              }}
            />
          </div>
          <div className="w-20">
            <Input
              value={newItem.amount}
              onChange={(e) => setNewItem(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="Qty"
            />
          </div>
          <div className="w-20">
            <Input
              value={newItem.unit}
              onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
              placeholder="Unit"
            />
          </div>
          <Button onClick={addItem}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        
        {/* Unchecked items */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">TO BUY</h4>
          {uncheckedItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">No items to buy</p>
          ) : (
            <ul className="space-y-2">
              {uncheckedItems.map(item => {
                const recipe = getRecipeForItem(item.recipeId);
                return (
                  <li 
                    key={item.id} 
                    className="flex items-center justify-between p-2 border-b"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        className="w-5 h-5 rounded-full border border-muted-foreground flex items-center justify-center"
                        onClick={() => handleCheck(item.id)}
                      >
                        {item.checked && <Check className="h-3 w-3" />}
                      </button>
                      
                      <div>
                        <div className="font-medium">
                          {item.amount} {item.unit} {item.name}
                        </div>
                        {recipe && (
                          <div className="text-xs text-muted-foreground">
                            For: {recipe.title}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        
        {/* Checked items */}
        {checkedItems.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">PURCHASED</h4>
            <ul className="space-y-2">
              {checkedItems.map(item => (
                <li 
                  key={item.id} 
                  className="flex items-center justify-between p-2 border-b"
                >
                  <div className="flex items-center gap-3">
                    <button
                      className="w-5 h-5 rounded-full bg-recipe-primary flex items-center justify-center"
                      onClick={() => handleCheck(item.id)}
                    >
                      <Check className="h-3 w-3 text-white" />
                    </button>
                    
                    <div>
                      <div className={cn("font-medium line-through text-muted-foreground")}>
                        {item.amount} {item.unit} {item.name}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroceryList;
