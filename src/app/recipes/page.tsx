
import { RecipeForm } from "./recipe-form";
import { CookingPot } from "lucide-react";
import {NextPage} from 'next';

const RecipesPage: NextPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col items-center mb-8">
        <CookingPot className="w-16 h-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-center">Recipe Suggestions</h1>
        <p className="mt-2 text-lg text-muted-foreground text-center max-w-2xl">
          Enter the ingredients you have at home, and our AI chef will suggest healthy Indian meal ideas and a quick meal plan.
        </p>
      </div>
      <RecipeForm />
    </div>
  );
}
export default RecipesPage;
