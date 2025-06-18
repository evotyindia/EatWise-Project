
import { RecipeForm } from "./recipe-form";
import { CookingPot, Utensils } from "lucide-react";
import type { NextPage, Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://eatwise.evotyindia.me';

export const metadata: Metadata = {
  title: "AI Recipe Suggestions | EatWise India",
  description: "Get healthy Indian meal ideas and AI-generated recipes based on ingredients you have. Perfect for quick meal planning with EatWise India.",
  alternates: {
    canonical: `${BASE_URL}/recipes`,
  },
};

const RecipesPage: NextPage = () => {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="p-4 bg-primary/10 rounded-full mb-5 inline-block">
            <CookingPot className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-primary">Recipe Suggestions</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
          Enter the ingredients you have at home, and our AI chef will suggest healthy Indian meal ideas and detailed recipes, considering your household and health preferences.
        </p>
      </div>
      <RecipeForm />
      <div className="mt-12 p-6 bg-accent/10 rounded-xl border border-accent/20">
        <div className="flex items-center text-accent mb-3">
          <Utensils className="w-6 h-6 mr-2" />
          <h2 className="text-xl font-semibold">How It Works</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          List your available ingredients, specify any dietary concerns (like diabetes or gluten-free) and your household size. 
          Our AI will first suggest a few dish names. Click on a dish to get a detailed recipe including ingredients, step-by-step instructions, and health notes. 
          You can then chat with our AI chef about substitutions or cooking techniques for the selected recipe.
        </p>
      </div>
    </div>
  );
}
export default RecipesPage;

