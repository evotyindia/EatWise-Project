
import { RecipeForm } from "./recipe-form";
import { CookingPot } from "lucide-react";

export default function RecipesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-center mb-8 text-center">
        <CookingPot className="w-16 h-16 text-accent mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">Recipe Suggestions</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
          Enter the ingredients you have at home, select any health concerns, and our AI chef will suggest healthy Indian meal ideas.
        </p>
      </div>
      <RecipeForm />
    </div>
  );
}
