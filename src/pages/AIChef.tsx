
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, Search, ArrowRight, Loader2 } from 'lucide-react';
import { getRecipeSuggestions } from '@/lib/gemini-api';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from "@/components/ui/textarea";

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
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="bg-recipe-primary hover:bg-recipe-primary/90 py-6"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
              </Button>
            </form>
          </div>
          
          {/* AI Response Section */}
          {response && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-4">Recipe Suggestions</h2>
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="whitespace-pre-wrap">
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
          
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Popular Prompts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.map((suggestion, index) => (
                <Card 
                  key={index} 
                  className="hover:shadow-md transition-shadow cursor-pointer" 
                  onClick={() => setQuery(suggestion)}
                >
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
