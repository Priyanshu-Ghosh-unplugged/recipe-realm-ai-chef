
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChefHat, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/recipes', label: 'Recipes' },
    { path: '/meal-planner', label: 'Meal Planner' },
    { path: '/grocery-list', label: 'Grocery List' },
    { path: '/ai-chef', label: 'AI Chef' },
  ];

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <ChefHat className="h-6 w-6 text-recipe-primary mr-2" />
            <span className="font-bold text-xl">Recipe Realm</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-recipe-primary ${
                  isActive(item.path) ? 'text-recipe-primary' : 'text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  asChild
                >
                  <Link to="/profile">
                    <User className="h-4 w-4" />
                    <span className="hidden lg:inline">Profile</span>
                  </Link>
                </Button>
                <Button 
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden lg:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Button asChild size="sm" className="bg-recipe-primary hover:bg-recipe-primary/90">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
          
          <button className="md:hidden" onClick={toggleMenu}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4 border-t">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-recipe-primary ${
                  isActive(item.path) ? 'text-recipe-primary' : 'text-foreground'
                }`}
                onClick={toggleMenu}
              >
                {item.label}
              </Link>
            ))}
            
            {user ? (
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Link 
                  to="/profile"
                  className="flex items-center gap-2 text-sm"
                  onClick={toggleMenu}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <button 
                  className="flex items-center gap-2 text-sm text-left"
                  onClick={() => {
                    signOut();
                    toggleMenu();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Button asChild size="sm" className="bg-recipe-primary hover:bg-recipe-primary/90 w-full mt-2">
                <Link to="/auth" onClick={toggleMenu}>Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
