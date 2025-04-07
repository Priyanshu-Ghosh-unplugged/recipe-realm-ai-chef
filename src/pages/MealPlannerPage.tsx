
import React from 'react';
import Navbar from '@/components/Navbar';
import MealPlanner from '@/components/MealPlanner';

const MealPlannerPage = () => {
  return (
    <div className="min-h-screen bg-recipe-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <MealPlanner />
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Recipe Realm AI Chef. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MealPlannerPage;
