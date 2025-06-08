
"use client";

import type { AnalyzeNutritionInput, AnalyzeNutritionOutput } from "@/ai/flows/nutrition-analysis";
import { analyzeNutrition } from "@/ai/flows/nutrition-analysis";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, Sparkles, FileText, Download } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel as HookFormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { fileToDataUri } from "@/lib/utils";
import { StarRating } from "@/components/common/star-rating";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const numberPreprocess = (val: unknown) => (val === "" || val === null || val === undefined ? undefined : Number(val));

const nutritionInputSchema = z.object({
  calories: z.preprocess(numberPreprocess, z.number({ invalid_type_error: "Must be a number" }).nonnegative("Cannot be negative").optional()),
  fat: z.preprocess(numberPreprocess, z.number({ invalid_type_error: "Must be a number" }).nonnegative("Cannot be negative").optional()),
  saturatedFat: z.preprocess(numberPreprocess, z.number({ invalid_type_error: "Must be a number" }).nonnegative("Cannot be negative").optional()),
  transFat: z.preprocess(numberPreprocess, z.number({ invalid_type_error: "Must be a number" }).nonnegative("Cannot be negative").optional()),
  cholesterol: z.preprocess(numberPreprocess, z.number({ invalid_type_error: "Must be a number" }).nonnegative("Cannot be negative").optional()),
  sodium: z.preprocess(numberPreprocess, z.number({ invalid_type_error: "Must be a number" }).nonnegative("Cannot be negative").optional()),
  carbohydrates: z.preprocess(numberPreprocess, z.number({ invalid_type_error: "Must be a number" }).nonnegative("Cannot be negative").optional()),
  fiber: z.preprocess(numberPreprocess, z.number({ invalid_type_error: "Must be a number" }).nonnegative("Cannot be negative").optional()),
  sugar: z.preprocess(numberPreprocess, z.number({ invalid_type_error: "Must be a number" }).nonnegative("Cannot be negative").optional()),
  addedSugar: z.preprocess(numberPreprocess, z.number({ invalid_type_error: "Must be a number" }).nonnegative("Cannot be negative").optional()),
  protein: z.preprocess(numberPreprocess, z.number({ invalid_type_error: "Must be a number" }).nonnegative("Cannot be negative").optional()),
  vitaminD: z.preprocess(numberPreprocess, z.number({ invalid_type_error: "Must be a number" }).nonnegative("Cannot be negative").optional()),
  calcium: z.preprocess(numberPreprocess, z.number({ invalid_type_error: "Must be a number" }).nonnegative("Cannot be negative").optional()),
  iron: z.preprocess(numberPreprocess, z.number({ invalid_type_error: "Must be a number" }).nonnegative("Cannot be negative").optional()),
  potassium: z.preprocess(numberPreprocess, z.number({ invalid_type_error: "Must be a number" }).nonnegative("Cannot be negative").optional()),
  vitaminC: z.preprocess(numberPreprocess, z.number({ invalid_type_error: "Must be a number" }).nonnegative("Cannot be negative").optional()),
  servingSize: z.string().optional(),
}).refine(data => Object.values(data).some(val => val !== undefined && val !== "") || (data.calories !== undefined && data.calories !== null), { // Adjusted refine condition
  message: "At least one nutritional value or serving size must be provided for manual entry if no image is uploaded.",
  path: ["calories"], 
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
      calories: undefined, fat: undefined, saturatedFat: undefined, transFat: undefined,
      cholesterol: undefined, sodium: undefined, carbohydrates: undefined, fiber: undefined,
      sugar: undefined, addedSugar: undefined, protein: undefined, vitaminD: undefined,
      calcium: undefined, iron: undefined, potassium: undefined, vitaminC: undefined, servingSize: ""
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
      form.reset(); 
      setAnalysisResult(null);
    }
  };

  const onManualSubmit: SubmitHandler<NutritionInputFormValues> = async (data) => {
    setIsLoading(true);
    setAnalysisResult(null);
    // Clear image if manual submit is chosen
    setImageFile(null); 
    setUploadedImage(null);
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
    form.reset(); // Clear manual form fields when image is submitted
    try {
      const nutritionDataUri = await fileToDataUri(imageFile);
      const input: AnalyzeNutritionInput = { nutritionDataUri };
      // Add serving size if available from form, even with image
      if (form.getValues("servingSize")) {
        input.servingSize = form.getValues("servingSize");
      }
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

  const handleDownloadReport = () => {
    if (!analysisResult) return;
    let content = `AI Nutrition Analysis\n`;
    content += `=========================\n`;
    content += `Nutrition Density Rating: ${analysisResult.nutritionDensityRating}/5\n\n`;
    
    content += `Overall Analysis:\n${analysisResult.overallAnalysis}\n\n`;
    if (analysisResult.macronutrientBalance) content += `Macronutrient Balance:\n${analysisResult.macronutrientBalance}\n\n`;
    if (analysisResult.micronutrientHighlights) content += `Micronutrient Highlights:\n${analysisResult.micronutrientHighlights}\n\n`;
    if (analysisResult.processingLevelAssessment) content += `Processing Level Assessment:\n${analysisResult.processingLevelAssessment}\n\n`;
    content += `Dietary Suitability:\n${analysisResult.dietarySuitability}\n\n`;
    if (analysisResult.servingSizeContext) content += `Serving Size Context:\n${analysisResult.servingSizeContext}\n\n`;

    content += `Disclaimer: This AI analysis is for informational purposes only and not a substitute for professional medical or dietary advice.`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'nutrition-analysis-report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast({ title: "Report Downloaded", description: "The nutrition analysis report has been saved." });
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onManualSubmit)} className="space-y-4">
               <FormField
                control={form.control}
                name="servingSize"
                render={({ field }) => (
                  <FormItem>
                    <HookFormLabel>Serving Size (Optional)</HookFormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1 cup (240ml), 30g" {...field} />
                    </FormControl>
                    <FormDescription>Important for accurate per-serving analysis.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator />
              <div>
                <Label htmlFor="nutrition-image-upload">Upload Nutrition Table Image (Optional)</Label>
                <Input id="nutrition-image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="mt-1 file:text-primary file:font-semibold hover:file:bg-primary/10" />
                {uploadedImage && (
                  <div className="mt-4 relative border rounded-md p-2">
                    <Image src={uploadedImage} alt="Uploaded nutrition table" width={300} height={200} className="rounded-md object-contain mx-auto" data-ai-hint="nutrition facts" />
                    <Button onClick={() => { setUploadedImage(null); setImageFile(null); }} variant="ghost" size="sm" className="absolute top-1 right-1 text-xs">Clear</Button>
                  </div>
                )}
                <Button onClick={onImageSubmit} disabled={isLoading || !imageFile} className="mt-4 w-full">
                  {isLoading && !form.formState.isSubmitting ? "Analyzing Image..." : "Analyze Image with Serving Size"}
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-muted-foreground/30"></div>
                <span className="mx-4 text-sm text-muted-foreground">OR ENTER MANUALLY</span>
                <div className="flex-grow border-t border-muted-foreground/30"></div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="calories" render={({ field }) => (<FormItem><HookFormLabel>Calories (kcal)</HookFormLabel><FormControl><Input type="number" placeholder="e.g., 250" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="fat" render={({ field }) => (<FormItem><HookFormLabel>Total Fat (g)</HookFormLabel><FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="saturatedFat" render={({ field }) => (<FormItem><HookFormLabel>Saturated Fat (g)</HookFormLabel><FormControl><Input type="number" placeholder="e.g., 3" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="transFat" render={({ field }) => (<FormItem><HookFormLabel>Trans Fat (g)</HookFormLabel><FormControl><Input type="number" placeholder="e.g., 0" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="cholesterol" render={({ field }) => (<FormItem><HookFormLabel>Cholesterol (mg)</HookFormLabel><FormControl><Input type="number" placeholder="e.g., 5" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="sodium" render={({ field }) => (<FormItem><HookFormLabel>Sodium (mg)</HookFormLabel><FormControl><Input type="number" placeholder="e.g., 500" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="carbohydrates" render={({ field }) => (<FormItem><HookFormLabel>Total Carbs (g)</HookFormLabel><FormControl><Input type="number" placeholder="e.g., 30" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="fiber" render={({ field }) => (<FormItem><HookFormLabel>Fiber (g)</HookFormLabel><FormControl><Input type="number" placeholder="e.g., 4" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="sugar" render={({ field }) => (<FormItem><HookFormLabel>Total Sugars (g)</HookFormLabel><FormControl><Input type="number" placeholder="e.g., 15" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="addedSugar" render={({ field }) => (<FormItem><HookFormLabel>Added Sugars (g)</HookFormLabel><FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="protein" render={({ field }) => (<FormItem><HookFormLabel>Protein (g)</HookFormLabel><FormControl><Input type="number" placeholder="e.g., 5" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="vitaminD" render={({ field }) => (<FormItem><HookFormLabel>Vitamin D (mcg/IU)</HookFormLabel><FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="calcium" render={({ field }) => (<FormItem><HookFormLabel>Calcium (mg)</HookFormLabel><FormControl><Input type="number" placeholder="e.g., 200" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="iron" render={({ field }) => (<FormItem><HookFormLabel>Iron (mg)</HookFormLabel><FormControl><Input type="number" placeholder="e.g., 2" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="potassium" render={({ field }) => (<FormItem><HookFormLabel>Potassium (mg)</HookFormLabel><FormControl><Input type="number" placeholder="e.g., 300" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="vitaminC" render={({ field }) => (<FormItem><HookFormLabel>Vitamin C (mg)</HookFormLabel><FormControl><Input type="number" placeholder="e.g., 60" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              {form.formState.errors.root && <FormMessage>{form.formState.errors.root.message}</FormMessage>}
              {form.formState.errors.calories && !Object.values(form.getValues()).filter(v => v !== undefined && v !== "").length && <FormMessage>At least one value is required for manual entry.</FormMessage>}
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
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center text-2xl">
                <FileText className="mr-2 h-6 w-6 text-accent" /> AI Nutrition Analysis
              </CardTitle>
              <Button onClick={handleDownloadReport} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>
            <CardDescription>Understanding your food's nutritional profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">Overall Analysis:</h3>
              <Alert variant="default" className="bg-background">
                 <Sparkles className="h-4 w-4" />
                <AlertDescription className="whitespace-pre-wrap text-sm leading-relaxed">
                  {analysisResult.overallAnalysis}
                </AlertDescription>
              </Alert>
            </div>
             {analysisResult.macronutrientBalance && (
              <div>
                <h3 className="font-semibold text-lg mb-1">Macronutrient Balance:</h3>
                <Alert variant="default" className="bg-background"><Sparkles className="h-4 w-4" /><AlertDescription className="whitespace-pre-wrap text-sm leading-relaxed">{analysisResult.macronutrientBalance}</AlertDescription></Alert>
              </div>
            )}
            {analysisResult.micronutrientHighlights && (
              <div>
                <h3 className="font-semibold text-lg mb-1">Micronutrient Highlights:</h3>
                <Alert variant="default" className="bg-background"><Sparkles className="h-4 w-4" /><AlertDescription className="whitespace-pre-wrap text-sm leading-relaxed">{analysisResult.micronutrientHighlights}</AlertDescription></Alert>
              </div>
            )}
             {analysisResult.processingLevelAssessment && (
              <div>
                <h3 className="font-semibold text-lg mb-1">Processing Level Assessment:</h3>
                <Alert variant="default" className="bg-background"><Sparkles className="h-4 w-4" /><AlertDescription className="whitespace-pre-wrap text-sm leading-relaxed">{analysisResult.processingLevelAssessment}</AlertDescription></Alert>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg mb-1">Dietary Suitability:</h3>
               <Alert variant="default" className="bg-background">
                 <Sparkles className="h-4 w-4" />
                <AlertDescription className="whitespace-pre-wrap text-sm leading-relaxed">
                  {analysisResult.dietarySuitability}
                </AlertDescription>
              </Alert>
            </div>
             {analysisResult.servingSizeContext && (
              <div>
                <h3 className="font-semibold text-lg mb-1">Serving Size Context:</h3>
                <Alert variant="default" className="bg-background"><Sparkles className="h-4 w-4" /><AlertDescription className="whitespace-pre-wrap text-sm leading-relaxed">{analysisResult.servingSizeContext}</AlertDescription></Alert>
              </div>
            )}
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
