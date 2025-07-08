
import { RecipeForm } from "./recipe-form";
import { CookingPot } from "lucide-react";
<<<<<<< HEAD
import type { NextPage, Metadata } from 'next';

const BASE_URL = 'https://eatwise.evotyindia.me';

export const metadata: Metadata = {
  title: "AI Recipe Suggestions | EatWise India",
  description: "Get healthy Indian meal ideas and AI-generated recipes based on ingredients you have. Perfect for quick meal planning with EatWise India.",
  alternates: {
    canonical: `${BASE_URL}/recipes`,
  },
};

const RecipesPage: NextPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col items-center mb-8">
        <CookingPot className="w-16 h-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-center">Recipe Suggestions</h1>
        <p className="mt-2 text-lg text-muted-foreground text-center max-w-2xl">
          Enter the ingredients you have at home, and our AI chef will suggest healthy Indian meal ideas and a quick meal plan.
=======

export default function RecipesPage() {
  return (
    <div className="container mx-auto py-8 animate-fade-in-up opacity-0" style={{animationFillMode: 'forwards'}}>
      <div className="flex flex-col items-center mb-8 text-center">
        <CookingPot className="w-16 h-16 text-accent mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">AI Recipe Finder</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
         Unlock delicious and healthy Indian meals with the ingredients you already have. Our AI chef is ready to inspire you.
>>>>>>> finalprotest
        </p>
      </div>
      <RecipeForm />
    </div>
  );
}
<<<<<<< HEAD
export default RecipesPage;
=======
>>>>>>> finalprotest
