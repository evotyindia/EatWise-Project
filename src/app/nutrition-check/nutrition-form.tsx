
"use client";

import type { AnalyzeNutritionInput, AnalyzeNutritionOutput } from "@/ai/flows/nutrition-analysis";
import { analyzeNutrition } from "@/ai/flows/nutrition-analysis";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, Sparkles, FileText } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { fileToDataUri } from "@/lib/utils";
import { StarRating } from "@/components/common/star-rating";
import { Alert, AlertDescription } from "@/components/ui/alert";

const nutritionInputSchema = z.object({
  calories: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Must be a number" }).nonnegative("Cannot be negative").optional()
  ),
  fat: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Must be a number" }).nonnegative("Cannot be negative").optional()
  ),
  sugar: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Must be a number" }).nonnegative("Cannot be negative").optional()
  ),
  protein: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Must be a number" }).nonnegative("Cannot be negative").optional()
  ),
}).refine(data => data.calories !== undefined || data.fat !== undefined || data.sugar !== undefined || data.protein !== undefined, {
  message: "At least one nutritional value must be provided for manual entry.",
  path: ["calories"], // Show error near one field for simplicity
});


type NutritionInputFormValues = z.infer<typeof nutritionInputSchema>;

export function NutritionForm() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeNutritionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<NutritionInputFormValues>({
    resolver: zodResolver(nutritionInputSchema),
    defaultValues: {
      calories: undefined,
      fat: undefined,
      sugar: undefined,
      protein: undefined,
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.reset(); // Clear manual form
      setAnalysisResult(null);
    }
  };

  const onManualSubmit: SubmitHandler<NutritionInputFormValues> = async (data) => {
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const input: AnalyzeNutritionInput = { ...data };
      const result = await analyzeNutrition(input);
      setAnalysisResult(result);
      toast({ title: "Analysis Complete", description: "Nutritional insights generated." });
    } catch (error) {
      console.error("Error analyzing nutrition:", error);
      toast({
        title: "Error",
        description: "Failed to analyze nutrition. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };
  
  const onImageSubmit = async () => {
    if (!imageFile) {
      toast({ title: "No Image", description: "Please upload an image first.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const nutritionDataUri = await fileToDataUri(imageFile);
      const input: AnalyzeNutritionInput = { nutritionDataUri };
      const result = await analyzeNutrition(input);
      setAnalysisResult(result);
      toast({ title: "Analysis Complete", description: "Nutritional insights from image generated." });
    } catch (error) {
      console.error("Error analyzing nutrition from image:", error);
      toast({
        title: "Error",
        description: "Failed to analyze nutrition from image. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <UploadCloud className="mr-2 h-6 w-6" /> Input Nutritional Data
          </CardTitle>
          <CardDescription>Upload an image of the nutrition table or enter values manually.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <FormLabel htmlFor="nutrition-image-upload">Upload Nutrition Table Image</FormLabel>
            <Input id="nutrition-image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="mt-1 file:text-primary file:font-semibold hover:file:bg-primary/10" />
            {uploadedImage && (
              <div className="mt-4 relative border rounded-md p-2">
                <Image src={uploadedImage} alt="Uploaded nutrition table" width={300} height={200} className="rounded-md object-contain mx-auto" data-ai-hint="nutrition facts" />
                <Button onClick={() => { setUploadedImage(null); setImageFile(null); }} variant="ghost" size="sm" className="absolute top-1 right-1 text-xs">Clear</Button>
              </div>
            )}
             <Button onClick={onImageSubmit} disabled={isLoading || !imageFile} className="mt-4 w-full">
              {isLoading && !form.formState.isSubmitting ? "Analyzing Image..." : "Analyze Image"}
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-muted-foreground/30"></div>
            <span className="mx-4 text-sm text-muted-foreground">OR</span>
            <div className="flex-grow border-t border-muted-foreground/30"></div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onManualSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="calories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calories (kcal)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 250" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fat (g)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sugar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sugar (g)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 15" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="protein"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Protein (g)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {form.formState.errors.root && <FormMessage>{form.formState.errors.root.message}</FormMessage>}
              <Button type="submit" disabled={isLoading && form.formState.isSubmitting} className="w-full">
                {isLoading && form.formState.isSubmitting ? "Analyzing Manually..." : "Analyze Manually"}
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && !analysisResult && (
         <Card className="lg:col-span-1 flex items-center justify-center h-full min-h-[300px]">
            <div className="text-center">
                <Sparkles className="mx-auto h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-lg font-semibold">Generating Nutrition Analysis...</p>
                <p className="text-sm text-muted-foreground">Please wait a moment.</p>
            </div>
        </Card>
      )}

      {analysisResult && (
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <FileText className="mr-2 h-6 w-6 text-accent" /> AI Nutrition Analysis
            </CardTitle>
            <CardDescription>Understanding your food's nutritional profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">Nutritional Balance:</h3>
              <Alert variant="default" className="bg-background">
                 <Sparkles className="h-4 w-4" />
                <AlertDescription className="whitespace-pre-wrap text-sm leading-relaxed">
                  {analysisResult.analysis}
                </AlertDescription>
              </Alert>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Recommendations:</h3>
               <Alert variant="default" className="bg-background">
                 <Sparkles className="h-4 w-4" />
                <AlertDescription className="whitespace-pre-wrap text-sm leading-relaxed">
                  {analysisResult.recommendations}
                </AlertDescription>
              </Alert>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <span className="font-semibold text-lg">Nutrition Density Rating:</span>
              <StarRating rating={analysisResult.nutritionDensityRating} />
              <span>({analysisResult.nutritionDensityRating}/5)</span>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              This AI analysis is for informational purposes only and not a substitute for professional medical or dietary advice.
            </p>
          </CardFooter>
        </Card>
      )}
       {!isLoading && !analysisResult && (
        <Card className="lg:col-span-1 flex items-center justify-center h-full min-h-[300px] bg-muted/30">
            <div className="text-center p-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-semibold text-muted-foreground">Your nutrition analysis will appear here.</p>
                <p className="text-sm text-muted-foreground">Submit nutritional data to get started.</p>
            </div>
        </Card>
      )}
    </div>
  );
}
