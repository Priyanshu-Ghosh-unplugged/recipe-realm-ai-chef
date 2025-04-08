
import React from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from '@/lib/types';
import { Clock, Utensils, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
  onFavoriteToggle?: (id: string, isFavorite: boolean) => void;
  className?: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onFavoriteToggle,
  className
}) => {
  const totalTime = recipe.prepTime + recipe.cookTime;
  
  return (
    <div className={cn("recipe-card hover-scale", className)}>
      <Link to={`/recipes/${recipe.id}`} className="block">
        <div className="relative">
          <img 
            src={recipe.imageUrl} 
            alt={recipe.title} 
            className="w-full h-48 object-cover"
          />
          {onFavoriteToggle && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute top-2 right-2 rounded-full bg-white/80 backdrop-blur-sm",
                recipe.isFavorite ? "text-rose-500" : "text-muted-foreground"
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onFavoriteToggle(recipe.id, !recipe.isFavorite);
              }}
            >
              <Heart
                className={cn("h-5 w-5", recipe.isFavorite ? "fill-current" : "")}
              />
            </Button>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1 line-clamp-1">{recipe.title}</h3>
          
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {recipe.description}
          </p>
          
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center text-muted-foreground text-xs">
              <Clock className="h-3 w-3 mr-1" /> 
              <span>{totalTime} min</span>
            </div>
            
            <div className="flex items-center text-muted-foreground text-xs">
              <Utensils className="h-3 w-3 mr-1" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>
          
          <div className="flex flex-wrap">
            {recipe.tags.map(tag => (
              <span 
                key={tag.id} 
                className="tag-pill"
                style={{ backgroundColor: tag.color || undefined }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RecipeCard;
