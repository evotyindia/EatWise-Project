
"use client";
import React from "react";
import type { GetDetailedRecipeOutput } from "@/ai/flows/get-detailed-recipe";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, Clock, Soup, Users, ListChecks, BookOpen, Lightbulb, Check } from "lucide-react";

interface RecipeDisplayProps {
  recipe: GetDetailedRecipeOutput;
}

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold flex items-center"><FileText className="mr-3 h-7 w-7 text-primary"/> {recipe.recipeTitle}</CardTitle>
        {recipe.description && <CardDescription className="mt-1 text-base">{recipe.description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm p-4 bg-muted/60 rounded-lg border">
          <div className="flex items-center gap-2"><Clock className="h-5 w-5 text-accent"/><div><div className="font-semibold">Prep Time</div><div>{recipe.prepTime}</div></div></div>
          <div className="flex items-center gap-2"><Soup className="h-5 w-5 text-accent"/><div><div className="font-semibold">Cook Time</div><div>{recipe.cookTime}</div></div></div>
          <div className="flex items-center gap-2"><Users className="h-5 w-5 text-accent"/><div><div className="font-semibold">Servings</div><div>{recipe.servingsDescription}</div></div></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-8 gap-y-6 pt-4">
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-xl mb-3 border-b pb-2 flex items-center gap-2"><ListChecks /> Ingredients</h3>
            <ul className="space-y-2.5 text-sm">
              {recipe.adjustedIngredients.map((ing, i) => (
                <li key={i} className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-2.5 mt-1 shrink-0" />
                  <div>
                    <span className="font-medium">{ing.name}</span>: <span>{ing.quantity}</span>
                    <div className="text-xs text-muted-foreground">({ing.notes})</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3">
            <h3 className="font-semibold text-xl mb-3 border-b pb-2 flex items-center gap-2"><BookOpen /> Instructions</h3>
            <ol className="list-decimal list-outside space-y-3.5 text-sm pl-5 marker:text-primary marker:font-semibold">
              {recipe.instructions.map((step, i) => <li key={i} className="pl-2 leading-relaxed">{step}</li>)}
            </ol>
          </div>
        </div>
        <Alert variant="success"><Lightbulb className="h-5 w-5" /><AlertTitle>Health Notes &amp; Tips</AlertTitle><AlertDescription className="whitespace-pre-line text-sm">{recipe.healthNotes}</AlertDescription></Alert>
        <Alert><Lightbulb className="h-5 w-5" /><AlertTitle>Storage &amp; Serving Tips</AlertTitle><AlertDescription className="whitespace-pre-line text-sm">{recipe.storageOrServingTips}</AlertDescription></Alert>
      </CardContent>
    </Card>
  );
};
