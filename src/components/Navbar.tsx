
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChefHat, Menu, Search } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm py-3 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-recipe-primary" />
            <span className="text-xl font-bold text-recipe-text">Recipe Realm</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-recipe-text hover:text-recipe-primary transition-colors">
            Home
          </Link>
          <Link to="/recipes" className="text-recipe-text hover:text-recipe-primary transition-colors">
            Recipes
          </Link>
          <Link to="/meal-planner" className="text-recipe-text hover:text-recipe-primary transition-colors">
            Meal Planner
          </Link>
          <Link to="/grocery-list" className="text-recipe-text hover:text-recipe-primary transition-colors">
            Grocery List
          </Link>
          <Link to="/ai-chef" className="text-recipe-text hover:text-recipe-primary transition-colors">
            AI Chef
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/recipes">
            <Button variant="ghost" size="icon" className="text-recipe-text">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 pt-8">
                <Link to="/" className="text-lg font-medium py-2 px-4 hover:bg-muted rounded-md transition-colors">
                  Home
                </Link>
                <Link to="/recipes" className="text-lg font-medium py-2 px-4 hover:bg-muted rounded-md transition-colors">
                  Recipes
                </Link>
                <Link to="/meal-planner" className="text-lg font-medium py-2 px-4 hover:bg-muted rounded-md transition-colors">
                  Meal Planner
                </Link>
                <Link to="/grocery-list" className="text-lg font-medium py-2 px-4 hover:bg-muted rounded-md transition-colors">
                  Grocery List
                </Link>
                <Link to="/ai-chef" className="text-lg font-medium py-2 px-4 hover:bg-muted rounded-md transition-colors">
                  AI Chef
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
