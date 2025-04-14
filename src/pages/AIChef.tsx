
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, Search, ArrowRight, Loader2, Sparkles, Book, Clock, Utensils } from 'lucide-react';
import { getRecipeSuggestions } from '@/lib/gemini-api';
import { useToast } from '@/hooks/use-toast';

const AIChef = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<string[]>([
    'Quick dinner ideas with chicken',
    'Vegetarian pasta recipes',
    'Healthy breakfast ideas',
    'Desserts under 30 minutes'
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({
        title: "Empty query",
        description: "Please enter a recipe query to get suggestions",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setResponse(null);
    
    try {
      toast({
        title: "Generating recipes",
        description: "Our AI chef is cooking up some ideas for you...",
      });
      
      // Call the Gemini API
      const geminiResponse = await getRecipeSuggestions(query);
      
      // Update the response state with the text from Gemini
      setResponse(geminiResponse.text);
      
      // Add the query to suggestions (only if we don't already have it)
      if (query.trim() && !suggestions.includes(query)) {
        setSuggestions(prev => [query, ...prev.slice(0, 3)]);
      }
    } catch (error) {
      console.error('Error in AI Chef:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get recipe suggestions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-recipe-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex p-4 bg-gradient-to-br from-recipe-yellow/30 to-recipe-primary/30 rounded-full mb-6 relative overflow-hidden hover-glow">
              <ChefHat className="h-12 w-12 text-recipe-primary relative z-10 animate-pulse-soft" />
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm -z-0"></div>
              <div className="absolute -inset-[100%] bg-recipe-primary/10 animate-rotate-center rounded-full -z-10"></div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 relative">
              <span className="text-gradient">AI Chef Assistant</span>
              <Sparkles className="absolute -right-8 top-0 h-5 w-5 text-recipe-yellow animate-pulse-soft" />
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Get AI-powered recipe suggestions using Gemini 2.0 Flash Thinking
            </p>
            
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-2xl mx-auto group">
              <div className="relative flex-1 transition-all duration-300 group-focus-within:shadow-md rounded-l-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 transition-colors group-focus-within:text-recipe-primary" />
                <Input 
                  className="pl-10 py-6 text-lg border-2 border-r-0 border-transparent focus:border-recipe-primary/40 rounded-r-none transition-all duration-300 focus:ring-0 focus:outline-none focus:shadow-input" 
                  placeholder="Ask me anything about cooking..." 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="bg-recipe-primary hover:bg-recipe-primary/90 py-6 rounded-l-none text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-md disabled:hover:translate-y-0"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
              </Button>
            </form>
          </div>
          
          {/* AI Response Section */}
          {isLoading && (
            <div className="flex justify-center items-center py-12 animate-fade-in">
              <div className="text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-recipe-primary/10 rounded-full animate-pulse"></div>
                  <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-recipe-primary relative" />
                </div>
                <p className="text-lg">Our AI chef is cooking up some ideas for you...</p>
              </div>
            </div>
          )}
          
          {response && !isLoading && (
            <div className="mb-12 animate-fade-in">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-recipe-yellow" />
                Recipe Suggestions
              </h2>
              <Card className="mb-8 hover:shadow-lg transition-all duration-300 border border-recipe-primary/10">
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    {response.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <div className="mb-12 animate-slide-in">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Book className="h-5 w-5 mr-2 text-recipe-primary" />
              Popular Prompts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.map((suggestion, index) => (
                <Card 
                  key={index} 
                  className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-transparent hover:border-recipe-primary/20 group" 
                  onClick={() => setQuery(suggestion)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <span className="group-hover:text-recipe-primary transition-colors duration-300">{suggestion}</span>
                    <ArrowRight className="h-4 w-4 text-recipe-primary transform transition-transform duration-300 group-hover:translate-x-1" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="animate-slide-in">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ChefHat className="h-5 w-5 mr-2 text-recipe-primary" />
              What Can AI Chef Do?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-recipe-primary/20 group">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center group-hover:text-recipe-primary transition-colors">
                    <Book className="h-5 w-5 mr-2 text-recipe-accent group-hover:text-recipe-primary transition-colors" />
                    Recipe Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground group-hover:text-gray-700 transition-colors">
                    Get recipe ideas based on ingredients you already have at home
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-recipe-primary/20 group">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center group-hover:text-recipe-primary transition-colors">
                    <Clock className="h-5 w-5 mr-2 text-recipe-accent group-hover:text-recipe-primary transition-colors" />
                    Meal Planning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground group-hover:text-gray-700 transition-colors">
                    Create balanced meal plans based on your dietary preferences
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-recipe-primary/20 group">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center group-hover:text-recipe-primary transition-colors">
                    <Utensils className="h-5 w-5 mr-2 text-recipe-accent group-hover:text-recipe-primary transition-colors" />
                    Cooking Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground group-hover:text-gray-700 transition-colors">
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
