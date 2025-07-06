
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
    if (data.foodItemDescription === "IGNORE_VALIDATION_FOR_IMAGE_SUBMIT_INTERNAL_MARKER") return true;
    return coreNutrientFields.some(field => 
        data[field] !== undefined && data[field] !== null && String(data[field]).trim() !== ""
    );
}, { 
    message: "For manual entry, please provide at least one nutritional value (e.g., calories, fat) if no image is uploaded.",
    path: ["calories"], 
});


type NutritionInputFormValues = z.infer<typeof nutritionInputSchema>;

export function NutritionForm() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeNutritionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isProcessingManually, setIsProcessingManually] = useState(false);
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);
  const [currentInputDataForPdf, setCurrentInputDataForPdf] = useState<AnalyzeNutritionInput | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isSubmittingImage, setIsSubmittingImage] = useState(false); 

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
      form.clearErrors(); 
    }
  };

  const generateAnalysisSharedLogic = async (inputForAI: AnalyzeNutritionInput, inputForPdfAndContext: AnalyzeNutritionInput, processingType: 'image' | 'manual') => {
    setIsLoading(true);
    if (processingType === 'image') setIsProcessingImage(true);
    if (processingType === 'manual') setIsProcessingManually(true);

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
    setIsProcessingImage(false);
    setIsProcessingManually(false);
  };

  const onManualSubmit: SubmitHandler<NutritionInputFormValues> = async (data) => {
    if (imageFile) {
        toast({ title: "Manual Analysis Prioritized", description: "Processing manually entered data. Uploaded image is ignored for this submission."});
    }
    const analysisInput: AnalyzeNutritionInput = { ...data, nutritionDataUri: undefined }; 
    await generateAnalysisSharedLogic(analysisInput, data, 'manual'); 
  };
  
  const onImageSubmit = async () => {
    if (!imageFile) {
      toast({ title: "No Image", description: "Please upload an image first.", variant: "destructive" });
      return;
    }
    setIsSubmittingImage(true); 
    form.clearErrors(); 
    
    const nutritionDataUri = await fileToDataUri(imageFile);
    
    const aiInputFromFormData: AnalyzeNutritionInput = {
      ...form.getValues(), 
      foodItemDescription: form.getValues("foodItemDescription") || "IGNORE_VALIDATION_FOR_IMAGE_SUBMIT_INTERNAL_MARKER",
      nutritionDataUri
    };
    coreNutrientFields.forEach(field => {
      if (aiInputFromFormData[field] === undefined || String(aiInputFromFormData[field]).trim() === "") {
        delete aiInputFromFormData[field];
      }
    });

    const inputForPdfAndContext: AnalyzeNutritionInput = { 
        servingSize: form.getValues("servingSize"), 
        foodItemDescription: form.getValues("foodItemDescription") || "Scanned Food Item", 
        nutritionDataUri: "Image Uploaded" 
    }; 
    await generateAnalysisSharedLogic(aiInputFromFormData, inputForPdfAndContext, 'image');
    setIsSubmittingImage(false);
  };

  const initiateChatWithWelcome = async (contextType: "nutritionAnalysis", contextData: any) => {
    setIsChatLoading(true);
    setChatHistory([]);
    const input: ContextAwareAIChatInput = {
        userQuestion: "INIT_CHAT_WELCOME",
        contextType: contextType,
        nutritionContext: {
          ...contextData,
          foodItemDescription: contextData.foodItemDescription?.replace("IGNORE_VALIDATION_FOR_IMAGE_SUBMIT_INTERNAL_MARKER", "").trim() || "Scanned food item"
        },
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
          foodItemDescription: currentInputDataForPdf?.foodItemDescription?.replace("IGNORE_VALIDATION_FOR_IMAGE_SUBMIT_INTERNAL_MARKER", "").trim() || (currentInputDataForPdf?.nutritionDataUri === "Image Uploaded" ? "Scanned food item" : "Manually entered data")
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
    const elementToPrint = pdfRef.current;
    if (!elementToPrint) {
        toast({ title: "Error", description: "Could not find report content to print.", variant: "destructive" });
        return;
    }
    setIsPdfDownloading(true);
    
    try {
        const canvas = await html2canvas(elementToPrint, {
            scale: 2,
            useCORS: true,
            backgroundColor: null, 
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        
        const pdfPageWidth = pdf.internal.pageSize.getWidth();
        const pdfPageHeight = pdf.internal.pageSize.getHeight();
        const imgProps = pdf.getImageProperties(imgData);
        const imgAspectRatio = imgProps.width / imgProps.height;
        const scaledImgHeight = pdfPageWidth / imgAspectRatio;

        let heightLeft = scaledImgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfPageWidth, scaledImgHeight);
        heightLeft -= pdfPageHeight;

        while (heightLeft > 0) {
            position = heightLeft - scaledImgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfPageWidth, scaledImgHeight);
            heightLeft -= pdfPageHeight;
        }

        const safeFoodItemName = (currentInputDataForPdf?.foodItemDescription || 'nutrition-data').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        pdf.save(`${safeFoodItemName}_analysis_report.pdf`);
        toast({ title: "Report Downloaded", description: "The PDF analysis has been saved." });

    } catch (error) {
        console.error("Error generating PDF:", error);
        toast({ title: "PDF Error", description: "Could not generate PDF report. " + (error instanceof Error ? error.message : ""), variant: "destructive" });
    } finally {
        setIsPdfDownloading(false);
    }
  };

const renderFormattedAnalysisText = (text?: string): JSX.Element | null => {
    if (!text || text.trim().toLowerCase() === 'n/a' || text.trim() === '') {
      return <p className="text-sm">Not specified / Not applicable.</p>;
    }
    const lines = text.split('\n').filter(s => s.trim() !== "");
    if (lines.length === 0) return null;

    return (
        <ul className="list-none space-y-1 text-sm">
            {lines.map((line, index) => {
                const trimmedLine = line.trim();
                const content = trimmedLine.replace(/^(\*|-)\s*/, '');
                if (!content) return null;
                return (
                    <li key={index} className="flex items-start">
                        <span className="mr-2 mt-1 text-accent">&#8226;</span>
                        <span className="break-words">{content}</span>
                    </li>
                );
            }).filter(Boolean)}
        </ul>
    );
};


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl"><UploadCloud className="mr-2 h-6 w-6" /> Input Nutritional Data</CardTitle>
          <CardDescription>Upload an image of the nutrition table or enter values manually for a detailed AI analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onManualSubmit)} className="space-y-4">
                <FormField control={form.control} name="foodItemDescription" render={({ field }) => (
                  <FormItem><HookFormLabel>Food Item Name/Description (Optional)</HookFormLabel><FormControl><Input placeholder="e.g., Packaged Biscuits, Homemade Dal" {...field} value={field.value?.replace("IGNORE_VALIDATION_FOR_IMAGE_SUBMIT_INTERNAL_MARKER","")}/></FormControl><FormDescription>Helps AI provide more specific context.</FormDescription><FormMessage /></FormItem>
                )} />
               <FormField control={form.control} name="servingSize" render={({ field }) => (
                  <FormItem><HookFormLabel>Serving Size (Important)</HookFormLabel><FormControl><Input placeholder="e.g., 1 cup (240ml), 30g" {...field} /></FormControl><FormDescription>Context for both image and manual analysis.</FormDescription><FormMessage /></FormItem>
                )} />
              <Separator />
              <div>
                <Label htmlFor="nutrition-image-upload" className="font-semibold">Upload Nutrition Table Image</Label>
                <Input id="nutrition-image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="mt-1 file:text-primary file:font-semibold hover:file:bg-primary/10" />
                {uploadedImage && (
                  <div className="mt-4 relative border rounded-md p-2">
                    <Image src={uploadedImage} alt="Uploaded nutrition table" width={300} height={200} className="rounded-md object-contain mx-auto" data-ai-hint="nutrition facts" />
                    <Button type="button" onClick={() => { setUploadedImage(null); setImageFile(null); form.clearErrors(); }} variant="ghost" size="sm" className="absolute top-1 right-1 text-xs">Clear</Button>
                  </div>
                )}
                <Button type="button" onClick={onImageSubmit} disabled={isLoading || !imageFile} className="mt-4 w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  {isProcessingImage ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Analyze Image Data
                </Button>
              </div>

              <div className="flex items-center my-6"><div className="flex-grow border-t"></div><span className="mx-4 text-sm font-semibold text-muted-foreground">OR ENTER MANUALLY</span><div className="flex-grow border-t"></div></div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
                <FormField control={form.control} name="calories" render={({ field }) => (<FormItem><HookFormLabel>Calories (kcal)</HookFormLabel><FormControl><Input type="number" placeholder="250" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="fat" render={({ field }) => (<FormItem><HookFormLabel>Total Fat (g)</HookFormLabel><FormControl><Input type="number" placeholder="10" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="protein" render={({ field }) => (<FormItem><HookFormLabel>Protein (g)</HookFormLabel><FormControl><Input type="number" placeholder="5" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="carbohydrates" render={({ field }) => (<FormItem><HookFormLabel>Total Carbs (g)</HookFormLabel><FormControl><Input type="number" placeholder="30" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="sugar" render={({ field }) => (<FormItem><HookFormLabel>Total Sugars (g)</HookFormLabel><FormControl><Input type="number" placeholder="15" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="sodium" render={({ field }) => (<FormItem><HookFormLabel>Sodium (mg)</HookFormLabel><FormControl><Input type="number" placeholder="500" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              {form.formState.errors.calories && !imageFile && !isSubmittingImage && <FormMessage>{form.formState.errors.calories.message}</FormMessage>}
              <Button type="submit" disabled={isLoading} className="w-full mt-6">
                {isProcessingManually ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Analyze Manual Data
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && !analysisResult && (
         <Card className="flex items-center justify-center h-full min-h-[300px]">
            <div className="text-center">
                <Sparkles className="mx-auto h-12 w-12 text-accent animate-spin mb-4" />
                <p className="text-lg font-semibold">Generating Analysis...</p>
                <p className="text-sm text-muted-foreground mt-1">The AI is performing a detailed nutritional breakdown.</p>
            </div>
        </Card>
      )}

      {analysisResult && (
        <>
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
            <div ref={pdfRef} style={{ width: '800px', padding: '20px', backgroundColor: 'white' }}>
              <PrintableNutritionReport analysisResult={analysisResult} userInput={currentInputDataForPdf || undefined} />
            </div>
        </div>
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="flex items-center text-2xl"><FileText className="mr-2 h-6 w-6 text-accent" /> AI Nutrition Analysis</CardTitle>
                    <CardDescription>
                        Understanding your food&apos;s nutritional profile
                        {currentInputDataForPdf?.foodItemDescription ? ` for: ${currentInputDataForPdf.foodItemDescription.replace("IGNORE_VALIDATION_FOR_IMAGE_SUBMIT_INTERNAL_MARKER", "").trim()}` : "."}
                    </CardDescription>
                </div>
              <Button type="button" onClick={handleDownloadReport} variant="outline" size="sm" disabled={isPdfDownloading}>
                 {isPdfDownloading ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />} PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="default" className="bg-background">
                <Sparkles className="h-4 w-4 text-primary" />
                <div>
                    <AlertTitle className="font-bold">Nutrition Density Rating</AlertTitle>
                    <AlertDescription className="flex items-center gap-2"><StarRating rating={analysisResult.nutritionDensityRating} /> ({analysisResult.nutritionDensityRating}/5)</AlertDescription>
                </div>
            </Alert>
            <Separator />
            <Alert variant="default" className="bg-background">
                <Sparkles className="h-4 w-4 text-primary" />
                <div>
                    <AlertTitle className="font-bold">Overall Analysis:</AlertTitle>
                    <AlertDescription>{renderFormattedAnalysisText(analysisResult.overallAnalysis)}</AlertDescription>
                </div>
            </Alert>
            <Alert variant="default" className="bg-background">
                <Sparkles className="h-4 w-4 text-primary" />
                <div>
                    <AlertTitle className="font-bold">Dietary Suitability:</AlertTitle>
                    <AlertDescription>{renderFormattedAnalysisText(analysisResult.dietarySuitability)}</AlertDescription>
                </div>
            </Alert>
          </CardContent>
           <CardFooter className="flex flex-col items-start pt-4 border-t">
                <h3 className="font-semibold text-xl mb-2 flex items-center"><MessageCircle className="mr-2 h-5 w-5"/> Chat about this Analysis</h3>
                <p className="text-sm text-muted-foreground mb-3">Ask about specific nutrients, comparisons, etc.</p>
                <ScrollArea className="h-[200px] w-full rounded-md border p-3 mb-3 bg-muted/50">
                  {chatHistory.map((msg, index) => (
                    <div key={index} className={`mb-2 p-2.5 rounded-lg text-sm shadow-sm max-w-[85%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-secondary text-secondary-foreground mr-auto'}`}>
                      <span className="font-semibold capitalize">{msg.role === 'user' ? 'You' : 'AI Advisor'}: </span>{msg.content}
                    </div>
                  ))}
                  {isChatLoading && <div className="text-sm text-muted-foreground p-2">AI Advisor is typing...</div>}
                </ScrollArea>
                <form onSubmit={handleChatSubmit} className="w-full flex gap-2">
                  <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask a question..." disabled={isChatLoading} className="bg-background"/>
                  <Button type="submit" disabled={isChatLoading || !chatInput.trim()}><Send className="h-4 w-4" /></Button>
                </form>
            </CardFooter>
        </Card>
        </>
      )}
       {!isLoading && !analysisResult && (
        <Card className="flex items-center justify-center h-full min-h-[300px] bg-muted/30">
            <div className="text-center p-8"><FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" /><p className="text-lg font-semibold text-muted-foreground">Your nutrition analysis will appear here.</p><p className="text-sm text-muted-foreground mt-1">Submit nutritional data to get started.</p></div>
        </Card>
      )}
    </div>
  );
}
