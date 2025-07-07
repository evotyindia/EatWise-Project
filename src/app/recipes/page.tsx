
import { RecipeForm } from "./recipe-form";
import { CookingPot } from "lucide-react";

export default function RecipesPage() {
  return (
    <div className="container mx-auto py-8 animate-fade-in-up opacity-0" style={{animationFillMode: 'forwards'}}>
      <div className="flex flex-col items-center mb-8 text-center">
        <CookingPot className="w-16 h-16 text-accent mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">AI Recipe Finder</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
         Unlock delicious and healthy Indian meals with the ingredients you already have. Our AI chef is ready to inspire you.
        </p>
      </div>
      <RecipeForm />
    </div>
  );
}
