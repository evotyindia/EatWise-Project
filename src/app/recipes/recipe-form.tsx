
"use client";

import type { GetRecipeSuggestionsInput, GetRecipeSuggestionsOutput } from "@/ai/flows/recipe-suggestions";
import { getRecipeSuggestions } from "@/ai/flows/recipe-suggestions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lightbulb, Sparkles } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription as UIAlertDescription } from "@/components/ui/alert"; // Renamed to avoid conflict

const recipeInputSchema = z.object({
  ingredients: z.string().min(1, "Please enter at least one ingredient."),
});

type RecipeInputFormValues = z.infer<typeof recipeInputSchema>;

export function RecipeForm() {
  const [suggestions, setSuggestions] = useState<GetRecipeSuggestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<RecipeInputFormValues>({
    resolver: zodResolver(recipeInputSchema),
    defaultValues: {
      ingredients: "",
    },
  });

  const onSubmit: SubmitHandler<RecipeInputFormValues> = async (data) => {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const input: GetRecipeSuggestionsInput = {
        ingredients: data.ingredients,
      };
      const result = await getRecipeSuggestions(input);
      setSuggestions(result);
      toast({ title: "Recipes Suggested!", description: "AI chef has cooked up some ideas." });
    } catch (error) {
      console.error("Error getting recipe suggestions:", error);
      toast({
        title: "Error",
        description: "Failed to get recipe suggestions. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="md:col-span-1 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Lightbulb className="mr-2 h-6 w-6" /> Your Ingredients
          </CardTitle>
          <CardDescription>List what you have, and we'll find recipes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Ingredients</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Onions, Tomatoes, Paneer, Rice, Spinach..."
                        {...field}
                        rows={5}
                      />
                    </FormControl>
                    <FormDescription>Separate ingredients with commas.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Getting Ideas..." : "Suggest Recipes"}
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="md:col-span-2">
        {isLoading && (
          <Card className="flex items-center justify-center h-full min-h-[300px]">
            <div className="text-center">
              <Sparkles className="mx-auto h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-lg font-semibold">Our AI Chef is thinking...</p>
              <p className="text-sm text-muted-foreground">Whipping up some delicious ideas!</p>
            </div>
          </Card>
        )}
        {!isLoading && !suggestions && (
           <Card className="flex items-center justify-center h-full min-h-[300px] bg-muted/30">
            <div className="text-center p-8">
                <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-semibold text-muted-foreground">Recipe ideas will appear here.</p>
                <p className="text-sm text-muted-foreground">Enter your ingredients to get started.</p>
            </div>
        </Card>
        )}
        {suggestions && (
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Sparkles className="mr-2 h-6 w-6 text-accent" /> AI Recipe Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {suggestions.suggestions.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Meal Ideas:</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suggestions.suggestions.map((idea, index) => (
                      <li key={index} className="p-4 border rounded-lg bg-background hover:shadow-md transition-shadow">
                        <Image 
                          src={`https://placehold.co/300x200.png`}
                          alt={idea}
                          width={300}
                          height={200}
                          className="w-full h-auto rounded-md mb-2 object-cover"
                          data-ai-hint="indian food dish"
                        />
                        <p className="font-medium text-center">{idea}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                 <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <UIAlertDescription>
                    No specific meal ideas generated with the provided ingredients. Try adding more common Indian staples.
                  </UIAlertDescription>
                </Alert>
              )}

              {suggestions.mealPlan && (
                <div>
                  <h3 className="text-xl font-semibold mt-6 mb-2">Quick Meal Plan:</h3>
                  <Alert variant="default" className="bg-background">
                     <Lightbulb className="h-4 w-4" />
                    <UIAlertDescription className="whitespace-pre-wrap text-sm leading-relaxed">
                      {suggestions.mealPlan}
                    </UIAlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                These are AI-generated suggestions. Adjust recipes to your taste and dietary needs.
              </p>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
