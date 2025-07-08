
"use client";

import type { AnalyzeNutritionInput, AnalyzeNutritionOutput } from "@/ai/flows/nutrition-analysis";
import { analyzeNutrition } from "@/ai/flows/nutrition-analysis";
import type { ContextAwareAIChatInput, ChatMessage } from "@/ai/flows/context-aware-ai-chat";
import { contextAwareAIChat } from "@/ai/flows/context-aware-ai-chat";

import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, Sparkles, FileText, MessageCircle, Send, Info } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


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
  const [currentInputContext, setCurrentInputContext] = useState<AnalyzeNutritionInput | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
      setCurrentInputContext(null); 
      setChatHistory([]);
      form.clearErrors(); 
    }
  };

  const generateAnalysisSharedLogic = async (inputForAI: AnalyzeNutritionInput, inputForContext: AnalyzeNutritionInput, processingType: 'image' | 'manual') => {
    setIsLoading(true);
    if (processingType === 'image') setIsProcessingImage(true);
    if (processingType === 'manual') setIsProcessingManually(true);

    setAnalysisResult(null);
    setCurrentInputContext(inputForContext); 
    setChatHistory([]);
    try {
      const result = await analyzeNutrition(inputForAI);
      setAnalysisResult(result);
      toast({ title: "Analysis Complete", description: "Nutritional insights generated." });
      if (result) {
        initiateChatWithWelcome("nutritionAnalysis", {
          nutritionReportSummary: result.overallAnalysis,
          foodItemDescription: inputForContext.foodItemDescription || (inputForAI.nutritionDataUri ? "Scanned food item" : "Manually entered data")
        });
      }
    } catch (error: any) {
      console.error("Error analyzing nutrition:", error);
      toast({ title: "Analysis Failed", description: error.message || "An unknown error occurred.", variant: "destructive" });
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

    const inputForContext: AnalyzeNutritionInput = { 
        servingSize: form.getValues("servingSize"), 
        foodItemDescription: form.getValues("foodItemDescription") || "Scanned Food Item", 
        nutritionDataUri: "Image Uploaded" 
    }; 
    await generateAnalysisSharedLogic(aiInputFromFormData, inputForContext, 'image');
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
    } catch (error: any) {
        console.error("Chat init error:", error);
        toast({ title: "Chat Init Failed", description: error.message || "Could not start AI chat.", variant: "destructive" });
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
          foodItemDescription: currentInputContext?.foodItemDescription?.replace("IGNORE_VALIDATION_FOR_IMAGE_SUBMIT_INTERNAL_MARKER", "").trim() || (currentInputContext?.nutritionDataUri === "Image Uploaded" ? "Scanned food item" : "Manually entered data")
        },
      };
      const aiResponse = await contextAwareAIChat(chatContextInput);
      setChatHistory((prev) => [...prev, { role: "assistant", content: aiResponse.answer }]);
    } catch (error: any) {
      console.error("Chat error:", error);
      setChatHistory((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't process that." }]);
      toast({ title: "Chat Error", description: error.message || "Could not get AI response.", variant: "destructive" });
    }
    setIsChatLoading(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Only scroll if the chat has started, not on the initial welcome message.
    if (chatHistory.length > 1) {
      scrollToBottom();
    }
  }, [chatHistory]);

const renderFormattedAnalysisText = (text?: string): JSX.Element | null => {
    if (!text || text.trim().toLowerCase() === 'n/a' || text.trim() === '') {
      return <p className="text-sm text-muted-foreground">Not specified / Not applicable.</p>;
    }
    const lines = text.split('\n').filter(s => s.trim() !== "");
    if (lines.length === 0) return null;

    return (
        <ul className="list-none space-y-1 text-sm leading-relaxed">
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
      <Card>
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
        <Card className="animate-fade-in-up opacity-0" style={{animationFillMode: 'forwards'}}>
          <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="flex items-center text-2xl"><FileText className="mr-2 h-6 w-6 text-primary" /> AI Nutrition Analysis</CardTitle>
                    <CardDescription>
                        Understanding your food&apos;s nutritional profile
                        {currentInputContext?.foodItemDescription ? ` for: ${currentInputContext.foodItemDescription.replace("IGNORE_VALIDATION_FOR_IMAGE_SUBMIT_INTERNAL_MARKER", "").trim()}` : "."}
                    </CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="default" className="bg-muted/60">
                <Sparkles className="h-5 w-5 text-accent" />
                <AlertTitle className="font-semibold flex justify-between items-center">
                  <span>Nutrient Density Rating</span>
                  <span className="text-xs font-normal text-muted-foreground">(Higher is better)</span>
                </AlertTitle>
                <AlertDescription className="flex items-center gap-1 flex-wrap mt-1">
                    <StarRating rating={analysisResult.nutritionDensityRating} variant="good" /> ({analysisResult.nutritionDensityRating}/5)
                </AlertDescription>
            </Alert>
            <Separator />

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle className="font-semibold">Overall Analysis</AlertTitle>
              <AlertDescription>{renderFormattedAnalysisText(analysisResult.overallAnalysis)}</AlertDescription>
            </Alert>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="nutrition-details">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">More Details</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle className="font-semibold">Dietary Suitability</AlertTitle>
                    <AlertDescription>{renderFormattedAnalysisText(analysisResult.dietarySuitability)}</AlertDescription>
                  </Alert>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle className="font-semibold">Macronutrient Balance</AlertTitle>
                    <AlertDescription>{renderFormattedAnalysisText(analysisResult.macronutrientBalance)}</AlertDescription>
                  </Alert>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle className="font-semibold">Micronutrient Highlights</AlertTitle>
                    <AlertDescription>{renderFormattedAnalysisText(analysisResult.micronutrientHighlights)}</AlertDescription>
                  </Alert>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle className="font-semibold">Processing Level</AlertTitle>
                    <AlertDescription>{renderFormattedAnalysisText(analysisResult.processingLevelAssessment)}</AlertDescription>
                  </Alert>
                   <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle className="font-semibold">Serving Size Context</AlertTitle>
                    <AlertDescription>{renderFormattedAnalysisText(analysisResult.servingSizeContext)}</AlertDescription>
                  </Alert>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
                  <div ref={messagesEndRef} />
                </ScrollArea>
                <form onSubmit={handleChatSubmit} className="w-full flex gap-2">
                  <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask a question..." disabled={isChatLoading} className="bg-background"/>
                  <Button type="submit" disabled={isChatLoading || !chatInput.trim()}><Send className="h-4 w-4" /></Button>
                </form>
            </CardFooter>
        </Card>
      )}
       {!isLoading && !analysisResult && (
        <Card className="flex items-center justify-center h-full min-h-[300px] bg-muted/30">
            <div className="text-center p-8"><FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" /><p className="text-lg font-semibold text-muted-foreground">Your nutrition analysis will appear here.</p><p className="text-sm text-muted-foreground mt-1">Submit nutritional data to get started.</p></div>
        </Card>
      )}
    </div>
  );
}
