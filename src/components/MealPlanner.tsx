
import React, { useState } from 'react';
import { mockMealPlans, mockRecipes } from '@/lib/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { ChefHat, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addDays, startOfWeek } from 'date-fns';

const MealPlanner: React.FC = () => {
  const [startDate, setStartDate] = useState(() => startOfWeek(new Date()));
  
  const dayNames = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startDate, i);
    return {
      name: format(date, 'EEEE'),
      date: date,
      dateString: format(date, 'MMM d')
    };
  });
  
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert'];
  
  // Function to find meal for specific date and meal type
  const findMeal = (date: Date, mealType: string) => {
    const meal = mockMealPlans.find(plan => 
      plan.mealType === mealType && 
      format(plan.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    
    if (meal) {
      return mockRecipes.find(recipe => recipe.id === meal.recipeId);
    }
    return null;
  };
  
  const previousWeek = () => {
    setStartDate(prev => addDays(prev, -7));
  };
  
  const nextWeek = () => {
    setStartDate(prev => addDays(prev, 7));
  };
  
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6 text-recipe-primary" />
          Meal Planner
        </h2>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={previousWeek}>Previous Week</Button>
          <span className="px-3">{format(startDate, 'MMM d')} - {format(addDays(startDate, 6), 'MMM d')}</span>
          <Button variant="outline" onClick={nextWeek}>Next Week</Button>
        </div>
      </div>
      
      {/* Weekly calendar */}
      <div className="grid grid-cols-8 gap-2 overflow-x-auto">
        {/* First column - meal times */}
        <div className="col-span-1 pt-10">
          {mealTypes.map(mealType => (
            <div key={mealType} className="h-32 flex items-center justify-center p-2">
              <p className="font-medium capitalize text-sm">{mealType}</p>
            </div>
          ))}
        </div>
        
        {/* Days of the week */}
        {dayNames.map((day, dayIndex) => (
          <div key={dayIndex} className="col-span-1">
            <div className="text-center p-2 font-semibold border-b">
              <div>{day.name}</div>
              <div className="text-sm text-muted-foreground">{day.dateString}</div>
            </div>
            
            {mealTypes.map(mealType => {
              const recipe = findMeal(day.date, mealType);
              return (
                <div key={`${dayIndex}-${mealType}`} className="h-32 border border-dashed rounded-md m-1 p-2">
                  {recipe ? (
                    <div className="h-full flex flex-col">
                      <div className="text-xs font-semibold mb-1 truncate">{recipe.title}</div>
                      {recipe.imageUrl && (
                        <div className="flex-1 overflow-hidden rounded-md">
                          <img
                            src={recipe.imageUrl}
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Plus className="h-3 w-3 mr-1" /> Add
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Upcoming Meals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockMealPlans.slice(0, 3).map(meal => {
            const recipe = mockRecipes.find(r => r.id === meal.recipeId);
            if (!recipe) return null;
            
            return (
              <Card key={meal.id} className="overflow-hidden">
                <div className="h-32 overflow-hidden">
                  <img 
                    src={recipe.imageUrl} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{recipe.title}</h4>
                      <p className="text-sm text-muted-foreground capitalize">
                        {meal.mealType} · {format(meal.date, 'MMM d')}
                      </p>
                    </div>
                    <ChefHat className="h-5 w-5 text-recipe-primary" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;
