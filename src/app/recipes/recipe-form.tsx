
"use client";

import type { GetRecipeSuggestionsInput, GetRecipeSuggestionsOutput } from "@/ai/flows/recipe-suggestions";
import { getRecipeSuggestions } from "@/ai/flows/recipe-suggestions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lightbulb, Sparkles, Download, ChefHat, Utensils, Flower as SpicesIcon, Leaf, WheatIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription as UIAlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { PrintableRecipeSuggestions } from "@/components/common/PrintableRecipeSuggestions";


const recipeInputSchema = z.object({
  ingredients: z.string().min(1, "Please enter at least one ingredient."),
});

type RecipeInputFormValues = z.infer<typeof recipeInputSchema>;

const ingredientCategories = [
  {
    name: "Vegetables",
    icon: <Leaf className="mr-2 h-4 w-4" />,
    items: ["Onion", "Tomato", "Potato", "Spinach", "Carrot", "Capsicum", "Ginger", "Garlic", "Cauliflower", "Peas", "Beans", "Ladyfinger"]
  },
  {
    name: "Spices",
    icon: <SpicesIcon className="mr-2 h-4 w-4" />,
    items: ["Turmeric", "Cumin Powder", "Coriander Powder", "Garam Masala", "Chili Powder", "Mustard Seeds", "Asafoetida (Hing)"]
  },
  {
    name: "Dals & Legumes",
    icon: <Utensils className="mr-2 h-4 w-4" />,
    items: ["Moong Dal", "Toor Dal", "Chana Dal", "Masoor Dal", "Rajma (Kidney Beans)", "Chickpeas (Chole)"]
  },
  {
    name: "Grains & Flours",
    icon: <WheatIcon className="mr-2 h-4 w-4" />,
    items: ["Rice", "Wheat Flour (Atta)", "Besan (Gram Flour)", "Suji (Semolina)", "Poha (Flattened Rice)"]
  },
  {
    name: "Dairy & Paneer",
    icon: <ChefHat className="mr-2 h-4 w-4" />,
    items: ["Paneer (Indian Cheese)", "Curd (Yogurt)", "Milk", "Ghee"]
  }
];

export function RecipeForm() {
  const [suggestions, setSuggestions] = useState<GetRecipeSuggestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const form = useForm<RecipeInputFormValues>({
    resolver: zodResolver(recipeInputSchema),
    defaultValues: {
      ingredients: "",
    },
  });

  const addIngredient = (ingredient: string) => {
    const currentIngredients = form.getValues("ingredients");
    const newIngredients = currentIngredients ? `${currentIngredients}, ${ingredient}` : ingredient;
    form.setValue("ingredients", newIngredients, { shouldValidate: true });
  };

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

  const handleDownloadSuggestionsPdf = async () => {
    if (!suggestions) return;
    setIsDownloading(true);

    const tempDiv = document.createElement('div');
    tempDiv.id = 'pdf-render-source-recipes';
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0px';
    tempDiv.style.width = '210mm'; 
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.padding = '0';
    tempDiv.style.margin = '0';
    document.body.appendChild(tempDiv);
    
    const root = createRoot(tempDiv);
    root.render(
      <PrintableRecipeSuggestions
        suggestions={suggestions}
        ingredientsProvided={form.getValues("ingredients")}
      />
    );

    await new Promise(resolve => setTimeout(resolve, 1500)); 

    try {
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: tempDiv.scrollWidth,
        height: tempDiv.scrollHeight,
        windowWidth: tempDiv.scrollWidth,
        windowHeight: tempDiv.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgAspectRatio = imgProps.width / imgProps.height;
      const scaledImgHeight = pdfPageWidth / imgAspectRatio;
      let numPages = Math.ceil(scaledImgHeight / pdfPageHeight);
      if (numPages === 0) numPages = 1;
      
      for (let i = 0; i < numPages; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'PNG', 0, - (i * pdfPageHeight), pdfPageWidth, scaledImgHeight);
      }
      
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(100);
        const footerText = `Page ${i} of ${totalPages} | Generated by EatWise India on ${new Date().toLocaleDateString('en-GB')}`;
        pdf.text(footerText, pdfPageWidth / 2, pdfPageHeight - 10, { align: 'center' });
      }

      pdf.save('recipe_suggestions_report.pdf');
      toast({ title: "Suggestions PDF Downloaded", description: "The recipe ideas PDF has been saved." });

    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({ title: "PDF Error", description: "Could not generate PDF report. " + (error as Error).message, variant: "destructive" });
    } finally {
      root.unmount();
      document.body.removeChild(tempDiv);
      setIsDownloading(false);
    }
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="md:col-span-1 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Lightbulb className="mr-2 h-6 w-6" /> Your Ingredients
          </CardTitle>
          <CardDescription>List what you have, or use shortcuts below.</CardDescription>
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
                        className="bg-background"
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
          <Separator className="my-6"/>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Ingredient Shortcuts</h3>
            {ingredientCategories.map(category => (
              <div key={category.name}>
                <h4 className="text-sm font-semibold mb-2 flex items-center">{category.icon} {category.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {category.items.map(item => (
                    <Button key={item} variant="outline" size="sm" onClick={() => addIngredient(item)} className="text-xs">
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
                <ChefHat className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-semibold text-muted-foreground">Recipe ideas will appear here.</p>
                <p className="text-sm text-muted-foreground">Enter your ingredients to get started.</p>
            </div>
        </Card>
        )}
        {suggestions && (
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl flex items-center">
                  <Sparkles className="mr-2 h-6 w-6 text-accent" /> AI Recipe Suggestions
                </CardTitle>
                <Button onClick={handleDownloadSuggestionsPdf} variant="outline" size="sm" disabled={isDownloading}>
                  {isDownloading ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                  Download PDF
                </Button>
              </div>
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
