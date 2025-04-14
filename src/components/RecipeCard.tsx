
import React from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from '@/lib/types';
import { Clock, Utensils, Heart, ChefHat, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Avatar } from '@/components/ui/avatar';

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
    <div className={cn("recipe-card relative group", className)}>
      <Link to={`/recipes/${recipe.id}`} className="block">
        <div className="relative overflow-hidden">
          <img 
            src={recipe.imageUrl || '/placeholder.svg'} 
            alt={recipe.title} 
            className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-70" />
          
          {/* Tags overlay at bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-wrap gap-1">
            {recipe.tags.slice(0, 2).map(tag => (
              <span 
                key={tag.id} 
                className="tag-pill text-white text-xs py-0.5 px-2"
                style={{ 
                  backgroundColor: tag.color || '#FF6B35',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                {tag.name}
              </span>
            ))}
            {recipe.tags.length > 2 && (
              <span className="tag-pill bg-black/50 text-white text-xs py-0.5 px-2">
                +{recipe.tags.length - 2}
              </span>
            )}
          </div>
          
          {onFavoriteToggle && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute top-2 right-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-transform duration-300 hover:scale-110",
                recipe.isFavorite ? "text-recipe-red shadow-sm" : "text-muted-foreground"
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onFavoriteToggle(recipe.id, !recipe.isFavorite);
              }}
            >
              <Heart
                className={cn("h-5 w-5 transition-all", 
                  recipe.isFavorite ? "fill-recipe-red scale-110" : "scale-100")}
              />
            </Button>
          )}
        </div>
        
        <div className="p-4 relative">
          <h3 className="font-bold text-lg mb-1 line-clamp-1 transition-colors duration-300 group-hover:text-recipe-primary">{recipe.title}</h3>
          
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {recipe.description}
          </p>
          
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center text-muted-foreground text-xs gap-3">
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1 text-recipe-primary/70" /> 
                <span>{totalTime} min</span>
              </span>
              
              <span className="flex items-center">
                <Utensils className="h-3 w-3 mr-1 text-recipe-primary/70" />
                <span>{recipe.servings} servings</span>
              </span>
            </div>
          </div>
          
          <div className="flex items-center pt-2 mt-2 border-t border-gray-100">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex items-center cursor-pointer">
                  <Avatar className="h-6 w-6 mr-2">
                    <ChefHat className="h-4 w-4 text-recipe-primary" />
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    Chef
                  </span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-60">
                <div className="flex justify-between space-x-4">
                  <Avatar>
                    <User className="h-4 w-4" />
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">Recipe Author</h4>
                    <p className="text-xs text-muted-foreground">
                      View more recipes by this chef
                    </p>
                    <div className="flex items-center pt-2">
                      <span className="text-xs text-muted-foreground mr-2">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {new Date(recipe.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            
            <div className="ml-auto">
              <Link to={`/recipes/${recipe.id}`} className="block">
                <span className="text-xs px-2 py-1 rounded-full bg-recipe-primary/10 text-recipe-primary font-medium transition-colors duration-300 hover:bg-recipe-primary/20">
                  View Recipe
                </span>
              </Link>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RecipeCard;
