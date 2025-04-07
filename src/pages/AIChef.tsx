
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, Search, ArrowRight } from 'lucide-react';

const AIChef = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([
    'Quick dinner ideas with chicken',
    'Vegetarian pasta recipes',
    'Healthy breakfast ideas',
    'Desserts under 30 minutes'
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an AI service
    console.log('Submitted query:', query);
    // Reset the query after submission
    setQuery('');
    // Add the query to suggestions (simulating AI behavior)
    if (query.trim()) {
      setSuggestions(prev => [query, ...prev.slice(0, 3)]);
    }
  };
  
  return (
    <div className="min-h-screen bg-recipe-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex p-4 bg-recipe-primary/10 rounded-full mb-4">
              <ChefHat className="h-12 w-12 text-recipe-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">AI Chef Assistant</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Get AI-powered recipe suggestions, meal ideas, and cooking tips
            </p>
            
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input 
                  className="pl-10 py-6 text-lg" 
                  placeholder="Ask me anything about cooking..." 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button type="submit" className="bg-recipe-primary hover:bg-recipe-primary/90 py-6">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </form>
          </div>
          
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Popular Prompts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.map((suggestion, index) => (
                <Card key={index} className="hover-scale cursor-pointer" onClick={() => setQuery(suggestion)}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <span>{suggestion}</span>
                    <ArrowRight className="h-4 w-4 text-recipe-primary" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">What Can AI Chef Do?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recipe Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Get recipe ideas based on ingredients you already have at home
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Meal Planning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Create balanced meal plans based on your dietary preferences
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cooking Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Learn cooking techniques and get advice on food preparation
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Recipe Realm AI Chef. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AIChef;
