
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChefHat } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Auth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      navigate('/');
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signUp(email, password);
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-recipe-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-8 px-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto p-3 bg-recipe-primary/10 rounded-full mb-2">
              <ChefHat className="h-8 w-8 text-recipe-primary" />
            </div>
            <CardTitle className="text-2xl">Recipe Realm</CardTitle>
            <CardDescription>Sign in to manage your recipes and meal plans</CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Button variant="link" className="px-0 h-auto font-normal text-xs">
                        Forgot password?
                      </Button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col gap-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-recipe-primary hover:bg-recipe-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 6 characters long.
                    </p>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col gap-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-recipe-primary hover:bg-recipe-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating account...' : 'Create Account'}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    By signing up, you agree to our Terms and Privacy Policy.
                  </p>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Recipe Realm AI Chef. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Auth;
