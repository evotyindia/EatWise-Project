
"use client";

import type { AnalyzeNutritionInput, AnalyzeNutritionOutput } from "@/ai/flows/nutrition-analysis";
import { analyzeNutrition } from "@/ai/flows/nutrition-analysis";
import type { ContextAwareAIChatInput, ChatMessage } from "@/ai/flows/context-aware-ai-chat";
import { contextAwareAIChat } from "@/ai/flows/context-aware-ai-chat";

import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, Sparkles, FileText, Download, MessageCircle, Send } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel as HookFormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { fileToDataUri } from "@/lib/utils";
import { StarRating } from "@/components/common/star-rating";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PrintableNutritionReport } from "@/components/common/PrintableNutritionReport";
import { ScrollArea } from "@/components/ui/scroll-area";


const numberPreprocess = (val: unknown) => (val === "" || val === null || val === undefined ? undefined : Number(val));

const coreNutrientFields = [
  'calories', 'fat', 'saturatedFat', 'transFat', 'cholesterol', 'sodium',
  'carbohydrates', 'fiber', 'sugar', 'addedSugar', 'protein', 'vitaminD',
  'calcium', 'iron', 'potassium', 'vitaminC'
] as const; 


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
  foodItemDescription: z.string().optional().describe("Optional: name or description of the food item, e.g., 'Homemade Dal Makhani' or 'Store-bought cookies'.")
}).refine(data => {
  // This refinement applies for manual form submission:
  // At least one of the core nutrient values must be provided.
  return coreNutrientFields.some(field => 
    data[field] !== undefined && data[field] !== null && String(data[field]).trim() !== ""
  );
}, { 
  message: "For manual entry, at least one nutritional value (e.g., calories, fat) must be provided.",
  path: ["calories"], // Attach error to a common field for display
});


type NutritionInputFormValues = z.infer<typeof nutritionInputSchema>;

export function NutritionForm() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeNutritionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);
  const [currentInputDataForPdf, setCurrentInputDataForPdf] = useState<AnalyzeNutritionInput | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();

  const form = useForm<NutritionInputFormValues>({
    resolver: zodResolver(nutritionInputSchema),
    defaultValues: {
      calories: undefined, fat: undefined, saturatedFat: undefined, transFat: undefined,
      cholesterol: undefined, sodium: undefined, carbohydrates: undefined, fiber: undefined,
      sugar: undefined, addedSugar: undefined, protein: undefined, vitaminD: undefined,
      calcium: undefined, iron: undefined, potassium: undefined, vitaminC: undefined, servingSize: "",
      foodItemDescription: ""
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
      setAnalysisResult(null);
      setCurrentInputDataForPdf(null); 
      setChatHistory([]);
      form.clearErrors(); // Clear all form errors when a new image is selected
    }
  };

  const generateAnalysisSharedLogic = async (inputForAI: AnalyzeNutritionInput, inputForPdfAndContext: AnalyzeNutritionInput) => {
    setIsLoading(true);
    setAnalysisResult(null);
    setCurrentInputDataForPdf(inputForPdfAndContext); 
    setChatHistory([]);
    try {
      const result = await analyzeNutrition(inputForAI);
      setAnalysisResult(result);
      toast({ title: "Analysis Complete", description: "Nutritional insights generated." });
      if (result) {
        initiateChatWithWelcome("nutritionAnalysis", {
          nutritionReportSummary: result.overallAnalysis,
          foodItemDescription: inputForPdfAndContext.foodItemDescription || (inputForAI.nutritionDataUri ? "Scanned food item" : "Manually entered data")
        });
      }
    } catch (error) {
      console.error("Error analyzing nutrition:", error);
      toast({ title: "Error", description: "Failed to analyze nutrition. Please try again.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const onManualSubmit: SubmitHandler<NutritionInputFormValues> = async (data) => {
    if (imageFile) {
        // If user clicks "Analyze Manual Data" but an image is uploaded, prioritize manual.
        // Or, you could force them to clear the image. For now, this path means manual.
        toast({ title: "Manual Analysis", description: "Processing manually entered data. Uploaded image is ignored for this submission."});
    }
    const analysisInput: AnalyzeNutritionInput = { ...data, nutritionDataUri: undefined }; // Ensure no image data is sent
    await generateAnalysisSharedLogic(analysisInput, data); // Pass original 'data' for PDF context
  };
  
  const onImageSubmit = async () => {
    if (!imageFile) {
      toast({ title: "No Image", description: "Please upload an image first.", variant: "destructive" });
      return;
    }
    // Clear any validation errors from manual form parts, as image takes precedence.
    form.clearErrors(); 
    
    const nutritionDataUri = await fileToDataUri(imageFile);
    const analysisInputForAI: AnalyzeNutritionInput = { 
        nutritionDataUri, 
        servingSize: form.getValues("servingSize"), 
        foodItemDescription: form.getValues("foodItemDescription") 
    };
    // For PDF and chat context, mark that an image was used.
    const inputForPdf: AnalyzeNutritionInput = { 
        servingSize: form.getValues("servingSize"), 
        foodItemDescription: form.getValues("foodItemDescription"), 
        nutritionDataUri: "Image Uploaded" // Marker for PDF
    }; 
    await generateAnalysisSharedLogic(analysisInputForAI, inputForPdf);
  };

  const initiateChatWithWelcome = async (contextType: "nutritionAnalysis", contextData: any) => {
    setIsChatLoading(true);
    setChatHistory([]);
    const input: ContextAwareAIChatInput = {
        userQuestion: "INIT_CHAT_WELCOME",
        contextType: contextType,
        nutritionContext: contextData,
    };
    try {
        const aiResponse = await contextAwareAIChat(input);
        setChatHistory([{ role: "assistant", content: aiResponse.answer }]);
    } catch (error) {
        console.error("Chat init error:", error);
        setChatHistory([{ role: "assistant", content: "Hello! Ask me anything about this nutrition report." }]);
    }
    setIsChatLoading(false);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !analysisResult) return;

    const userMessage: ChatMessage = { role: "user", content: chatInput };
    setChatHistory(prev => [...prev, userMessage]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const chatContextInput: ContextAwareAIChatInput = {
        userQuestion: userMessage.content,
        chatHistory: chatHistory.slice(-5),
        contextType: "nutritionAnalysis",
        nutritionContext: {
          nutritionReportSummary: analysisResult.overallAnalysis,
          foodItemDescription: currentInputDataForPdf?.foodItemDescription || (currentInputDataForPdf?.nutritionDataUri === "Image Uploaded" ? "Scanned food item" : "Manually entered data")
        },
      };
      const aiResponse = await contextAwareAIChat(chatContextInput);
      setChatHistory((prev) => [...prev, { role: "assistant", content: aiResponse.answer }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatHistory((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't process that." }]);
      toast({ title: "Chat Error", variant: "destructive" });
    }
    setIsChatLoading(false);
  };

  useEffect(() => {
    if (chatScrollAreaRef.current) {
      chatScrollAreaRef.current.scrollTop = chatScrollAreaRef.current.scrollHeight;
    }
  }, [chatHistory]);


  const handleDownloadReport = async () => {
    if (!analysisResult) return;
    setIsPdfDownloading(true);

    const tempDiv = document.createElement('div');
    tempDiv.id = 'pdf-render-source-nutrition-form'; // Unique ID
    tempDiv.style.position = 'absolute'; tempDiv.style.left = '-9999px'; tempDiv.style.top = '0px';
    tempDiv.style.width = '210mm'; tempDiv.style.backgroundColor = 'white'; tempDiv.style.padding = '0'; tempDiv.style.margin = '0';
    document.body.appendChild(tempDiv);

    const root = createRoot(tempDiv);
    
    const pdfInputData = currentInputDataForPdf?.nutritionDataUri === "Image Uploaded" 
        ? currentInputDataForPdf 
        : { ...form.getValues(), nutritionDataUri: imageFile ? "Image Uploaded" : undefined };

    root.render( <PrintableNutritionReport analysisResult={analysisResult} userInput={pdfInputData} /> );
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const canvas = await html2canvas(tempDiv, {
        scale: 2, useCORS: true, logging: false, 
        width: tempDiv.scrollWidth, height: tempDiv.scrollHeight, 
        windowWidth: tempDiv.scrollWidth, windowHeight: tempDiv.scrollHeight,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgAspectRatio = imgProps.width / imgProps.height;
      const scaledImgHeight = pdfPageWidth / imgAspectRatio;
      let numPages = Math.ceil(scaledImgHeight / pdfPageHeight);
      if (numPages === 0) numPages = 1;

      for (let i = 0; i < numPages; i++) {
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, - (i * pdfPageHeight), pdfPageWidth, scaledImgHeight);
      }
      
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i); pdf.setFontSize(8); pdf.setTextColor(100);
        const footerText = `Page ${i} of ${totalPages} | Generated by EatWise India on ${new Date().toLocaleDateString('en-GB')}`;
        pdf.text(footerText, pdfPageWidth / 2, pdfPageHeight - 10, { align: 'center' });
      }
      const safeFoodItemName = (pdfInputData?.foodItemDescription || 'nutrition-data').replace(/[^a-z0-9]/gi, '_').toLowerCase();
      pdf.save(`${safeFoodItemName}_analysis_report.pdf`);
      toast({ title: "Report Downloaded", description: "The PDF nutrition analysis has been saved." });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({ title: "PDF Error", description: "Could not generate PDF report. " + (error as Error).message, variant: "destructive" });
    } finally {
      root.unmount(); document.body.removeChild(tempDiv); setIsPdfDownloading(false);
    }
  };

  const renderFormattedAnalysisText = (text?: string): JSX.Element | null => {
    if (!text) return null;

    const lines = text.split('\n');
    const listItems: string[] = [];
    const paragraphItems: string[] = [];
    let hasBullets = false;

    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.match(/^(\*|-)\s/)) {
            listItems.push(trimmedLine.substring(trimmedLine.indexOf(' ') + 1));
            hasBullets = true;
        } else if (trimmedLine) {
            paragraphItems.push(trimmedLine);
        }
    });

    if (hasBullets) {
        return (
            <ul className="list-disc list-inside space-y-1 text-sm leading-relaxed">
                {listItems.map((item, index) => <li key={`bullet-${index}`}>{item}</li>)}
                {paragraphItems.map((item, index) => <li key={`para-li-${index}`} className="list-none ml-[-1em] mt-1">{item}</li>)}
            </ul>
        );
    } else if (paragraphItems.length > 0) {
        return (
            <div className="text-sm leading-relaxed space-y-1">
                {paragraphItems.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
        );
    }
    return null;
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl"><UploadCloud className="mr-2 h-6 w-6" /> Input Nutritional Data</CardTitle>
          <CardDescription>Upload an image of the nutrition table or enter values manually. Provide serving size and item name for better context.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onManualSubmit)} className="space-y-4">
                <FormField control={form.control} name="foodItemDescription" render={({ field }) => (
                  <FormItem><HookFormLabel>Food Item Name/Description (Optional)</HookFormLabel><FormControl><Input placeholder="e.g., Packaged Biscuits, Homemade Dal" {...field} /></FormControl><FormDescription>Helps AI provide more specific context in chat and PDF.</FormDescription><FormMessage /></FormItem>
                )} />
               <FormField control={form.control} name="servingSize" render={({ field }) => (
                  <FormItem><HookFormLabel>Serving Size (Important for Context)</HookFormLabel><FormControl><Input placeholder="e.g., 1 cup (240ml), 30g, 1 packet" {...field} /></FormControl><FormDescription>Used for both image and manual analysis to provide context.</FormDescription><FormMessage /></FormItem>
                )} />
              <Separator />
              <div>
                <Label htmlFor="nutrition-image-upload" className="font-semibold">Upload Nutrition Table Image (Optional)</Label>
                <Input id="nutrition-image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="mt-1 file:text-primary file:font-semibold hover:file:bg-primary/10" />
                {uploadedImage && (
                  <div className="mt-4 relative border rounded-md p-2">
                    <Image src={uploadedImage} alt="Uploaded nutrition table" width={300} height={200} className="rounded-md object-contain mx-auto" data-ai-hint="nutrition facts" />
                    <Button type="button" onClick={() => { setUploadedImage(null); setImageFile(null); form.clearErrors(); }} variant="ghost" size="sm" className="absolute top-1 right-1 text-xs">Clear</Button>
                  </div>
                )}
                <Button type="button" onClick={onImageSubmit} disabled={isLoading || !imageFile} className="mt-4 w-full">
                  {isLoading && !form.formState.isSubmitting && imageFile ? "Analyzing Image..." : "Analyze Image Data"} <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center my-6"><div className="flex-grow border-t border-muted-foreground/30"></div><span className="mx-4 text-sm font-semibold text-muted-foreground">OR ENTER MANUALLY BELOW</span><div className="flex-grow border-t border-muted-foreground/30"></div></div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
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
              {form.formState.errors.calories && !imageFile && <FormMessage>{form.formState.errors.calories.message}</FormMessage>}
              <Button type="submit" disabled={isLoading || form.formState.isSubmitting} className="w-full mt-6">
                {isLoading && form.formState.isSubmitting ? "Analyzing Manually..." : "Analyze Manual Data"} <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && !analysisResult && (
         <Card className="lg:col-span-1 flex items-center justify-center h-full min-h-[300px]">
            <div className="text-center"><Sparkles className="mx-auto h-12 w-12 text-primary animate-spin mb-4" /><p className="text-lg font-semibold">Generating Nutrition Analysis...</p><p className="text-sm text-muted-foreground">Please wait a moment.</p></div>
        </Card>
      )}

      {analysisResult && (
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center text-2xl"><FileText className="mr-2 h-6 w-6 text-accent" /> AI Nutrition Analysis</CardTitle>
              <Button type="button" onClick={handleDownloadReport} variant="outline" size="sm" disabled={isPdfDownloading}>
                 {isPdfDownloading ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />} Download PDF
              </Button>
            </div>
            <CardDescription>Understanding your food's nutritional profile{currentInputDataForPdf?.foodItemDescription ? ` for: ${currentInputDataForPdf.foodItemDescription}` : ""}.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="default" className="bg-background"><AlertTitle className="font-bold">Overall Analysis:</AlertTitle><Sparkles className="h-4 w-4 text-primary" /><AlertDescription>{renderFormattedAnalysisText(analysisResult.overallAnalysis)}</AlertDescription></Alert>
             {analysisResult.macronutrientBalance && (<Alert variant="default" className="bg-background"><AlertTitle className="font-bold">Macronutrient Balance:</AlertTitle><Sparkles className="h-4 w-4 text-primary" /><AlertDescription>{renderFormattedAnalysisText(analysisResult.macronutrientBalance)}</AlertDescription></Alert>)}
            {analysisResult.micronutrientHighlights && (<Alert variant="default" className="bg-background"><AlertTitle className="font-bold">Micronutrient Highlights:</AlertTitle><Sparkles className="h-4 w-4 text-primary" /><AlertDescription>{renderFormattedAnalysisText(analysisResult.micronutrientHighlights)}</AlertDescription></Alert>)}
             {analysisResult.processingLevelAssessment && (<Alert variant="default" className="bg-background"><AlertTitle className="font-bold">Processing Level Assessment:</AlertTitle><Sparkles className="h-4 w-4 text-primary" /><AlertDescription>{renderFormattedAnalysisText(analysisResult.processingLevelAssessment)}</AlertDescription></Alert>)}
            <Alert variant="default" className="bg-background"><AlertTitle className="font-bold">Dietary Suitability:</AlertTitle><Sparkles className="h-4 w-4 text-primary" /><AlertDescription>{renderFormattedAnalysisText(analysisResult.dietarySuitability)}</AlertDescription></Alert>
             {analysisResult.servingSizeContext && (<Alert variant="default" className="bg-background"><AlertTitle className="font-bold">Serving Size Context:</AlertTitle><Sparkles className="h-4 w-4 text-primary" /><AlertDescription>{renderFormattedAnalysisText(analysisResult.servingSizeContext)}</AlertDescription></Alert>)}
            <div className="flex items-center space-x-2 pt-2"><span className="font-semibold text-lg">Nutrition Density Rating:</span><StarRating rating={analysisResult.nutritionDensityRating} /><span>({analysisResult.nutritionDensityRating}/5)</span></div>
          </CardContent>
           <CardFooter className="flex flex-col items-start pt-4 border-t">
                <h3 className="font-semibold text-xl mb-2 flex items-center"><MessageCircle className="mr-2 h-5 w-5"/> Chat about this Analysis</h3>
                <p className="text-sm text-muted-foreground mb-3">Ask about specific nutrients, comparisons, etc.</p>
                <ScrollArea className="h-[200px] w-full rounded-md border p-3 mb-3 bg-muted/50" ref={chatScrollAreaRef}>
                  {chatHistory.map((msg, index) => (
                    <div key={index} className={`mb-2 p-2.5 rounded-lg text-sm shadow-sm max-w-[85%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-accent text-accent-foreground mr-auto'}`}>
                      <span className="font-semibold capitalize">{msg.role === 'user' ? 'You' : 'AI Advisor'}: </span>{msg.content}
                    </div>
                  ))}
                  {isChatLoading && <div className="text-sm text-muted-foreground p-2">AI Advisor is typing...</div>}
                </ScrollArea>
                <form onSubmit={handleChatSubmit} className="w-full flex gap-2">
                  <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask a question..." disabled={isChatLoading} className="bg-background"/>
                  <Button type="submit" disabled={isChatLoading || !chatInput.trim()}><Send className="h-4 w-4" /></Button>
                </form>
                 <p className="text-xs text-muted-foreground mt-4">
                    This AI analysis is for informational purposes only and not a substitute for professional medical or dietary advice.
                </p>
            </CardFooter>
        </Card>
      )}
       {!isLoading && !analysisResult && (
        <Card className="lg:col-span-1 flex items-center justify-center h-full min-h-[300px] bg-muted/30">
            <div className="text-center p-8"><FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" /><p className="text-lg font-semibold text-muted-foreground">Your nutrition analysis will appear here.</p><p className="text-sm text-muted-foreground">Submit nutritional data to get started.</p></div>
        </Card>
      )}
    </div>
  );
}
