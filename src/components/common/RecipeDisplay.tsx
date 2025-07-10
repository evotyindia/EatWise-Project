
"use client";
import React from "react";
import type { GetDetailedRecipeOutput } from "@/ai/flows/get-detailed-recipe";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Clock, Soup, Users, ListChecks, BookOpen, Lightbulb, Check, BarChart3 } from "lucide-react";

interface RecipeDisplayProps {
  recipe: GetDetailedRecipeOutput;
}

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe }) => {
  const breakdown = recipe.nutritionalBreakdown;

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
        
        {breakdown && (
            <div className="w-full border-t pt-6">
                 <h3 className="font-semibold text-xl mb-3 flex items-center gap-2"><BarChart3 className="mr-1 h-5 w-5 text-primary" />Detailed Nutritional Breakdown</h3>
                 {/* Desktop Table */}
                 <Table className="hidden md:table mt-2 text-sm">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-semibold">Nutrient</TableHead>
                            <TableHead className="font-semibold text-center">For a Kid <span className="block text-xs font-normal text-muted-foreground">({breakdown.kid.servingSize})</span></TableHead>
                            <TableHead className="font-semibold text-center">For an Adult <span className="block text-xs font-normal text-muted-foreground">({breakdown.adult.servingSize})</span></TableHead>
                            <TableHead className="font-semibold text-center">Average Serving <span className="block text-xs font-normal text-muted-foreground">({breakdown.average.servingSize})</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow><TableCell>Calories</TableCell><TableCell className="text-center">{breakdown.kid.nutrients.calories}</TableCell><TableCell className="text-center">{breakdown.adult.nutrients.calories}</TableCell><TableCell className="text-center">{breakdown.average.nutrients.calories}</TableCell></TableRow>
                        <TableRow><TableCell>Protein</TableCell><TableCell className="text-center">{breakdown.kid.nutrients.protein}</TableCell><TableCell className="text-center">{breakdown.adult.nutrients.protein}</TableCell><TableCell className="text-center">{breakdown.average.nutrients.protein}</TableCell></TableRow>
                        <TableRow><TableCell>Carbohydrates</TableCell><TableCell className="text-center">{breakdown.kid.nutrients.carbs}</TableCell><TableCell className="text-center">{breakdown.adult.nutrients.carbs}</TableCell><TableCell className="text-center">{breakdown.average.nutrients.carbs}</TableCell></TableRow>
                        <TableRow><TableCell>Fat</TableCell><TableCell className="text-center">{breakdown.kid.nutrients.fat}</TableCell><TableCell className="text-center">{breakdown.adult.nutrients.fat}</TableCell><TableCell className="text-center">{breakdown.average.nutrients.fat}</TableCell></TableRow>
                    </TableBody>
                </Table>
                 {/* Mobile Card List */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                    {(Object.keys(breakdown.average.nutrients) as Array<keyof typeof breakdown.average.nutrients>).map((nutrient) => (
                    <div key={nutrient} className="rounded-lg border bg-background p-4">
                        <h4 className="font-bold capitalize">{nutrient}</h4>
                        <div className="mt-2 space-y-1 text-sm">
                            <p><strong className="w-20 inline-block">Kid:</strong> {breakdown.kid.nutrients[nutrient]}</p>
                            <p><strong className="w-20 inline-block">Adult:</strong> {breakdown.adult.nutrients[nutrient]}</p>
                            <p><strong className="w-20 inline-block">Average:</strong> {breakdown.average.nutrients[nutrient]}</p>
                        </div>
                    </div>
                    ))}
                </div>
                 <p className="text-xs text-muted-foreground mt-3 text-center">Note: These are estimated values per serving and can vary based on specific ingredients and cooking methods.</p>
            </div>
        )}

        <Alert variant="success"><Lightbulb className="h-5 w-5" /><AlertTitle>Health Notes &amp; Tips</AlertTitle><AlertDescription className="whitespace-pre-line text-sm">{recipe.healthNotes}</AlertDescription></Alert>
        <Alert><Lightbulb className="h-5 w-5" /><AlertTitle>Storage &amp; Serving Tips</AlertTitle><AlertDescription className="whitespace-pre-line text-sm">{recipe.storageOrServingTips}</AlertDescription></Alert>
      </CardContent>
    </Card>
  );
};
