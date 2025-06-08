
"use client";

import type { GenerateHealthReportInput, GenerateHealthReportOutput } from "@/ai/flows/generate-health-report";
import { generateHealthReport } from "@/ai/flows/generate-health-report";
import type { ContextAwareAIChatInput, ContextAwareAIChatOutput } from "@/ai/flows/context-aware-ai-chat";
import { contextAwareAIChat } from "@/ai/flows/context-aware-ai-chat";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, Sparkles, MessageCircle, Send } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel as HookFormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { fileToDataUri } from "@/lib/utils";
import { StarRating } from "@/components/common/star-rating";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label"; // Import the basic Label component

const manualInputSchema = z.object({
  productName: z.string().optional(),
  ingredients: z.string().min(1, "Ingredients list is required for manual input."),
  nutritionFacts: z.string().optional(),
});

type ManualInputFormValues = z.infer<typeof manualInputSchema>;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function AnalyzerForm() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [report, setReport] = useState<GenerateHealthReportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  const { toast } = useToast();

  const manualForm = useForm<ManualInputFormValues>({
    resolver: zodResolver(manualInputSchema),
    defaultValues: {
      productName: "",
      ingredients: "",
      nutritionFacts: "",
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
      // Clear manual form if image is uploaded
      manualForm.reset();
      setReport(null);
      setChatHistory([]);
    }
  };

  const onManualSubmit: SubmitHandler<ManualInputFormValues> = async (data) => {
    setIsLoading(true);
    setReport(null);
    setChatHistory([]);
    try {
      const input: GenerateHealthReportInput = {
        productName: data.productName,
        ingredients: data.ingredients,
        nutritionFacts: data.nutritionFacts,
      };
      const result = await generateHealthReport(input);
      setReport(result);
      toast({ title: "Report Generated", description: "AI analysis complete." });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
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
    setReport(null);
    setChatHistory([]);
    try {
      const photoDataUri = await fileToDataUri(imageFile);
      const input: GenerateHealthReportInput = {
        photoDataUri,
        // You could potentially extract product name via OCR too, or leave it for Gemini
      };
      const result = await generateHealthReport(input);
      setReport(result);
      toast({ title: "Report Generated", description: "AI analysis from image complete." });
    } catch (error) {
      console.error("Error generating report from image:", error);
      toast({
        title: "Error",
        description: "Failed to generate report from image. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !report) return;

    const userMessage: ChatMessage = { role: "user", content: chatInput };
    setChatHistory((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const chatContext: ContextAwareAIChatInput = {
        productName: report.productType || manualForm.getValues("productName") || "N/A",
        ingredients: manualForm.getValues("ingredients") || "From Image Scan", // Need a better way if only image
        healthReport: report.report,
        userQuestion: userMessage.content,
      };
      const aiResponse = await contextAwareAIChat(chatContext);
      setChatHistory((prev) => [...prev, { role: "assistant", content: aiResponse.answer }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatHistory((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't process that. Please try again." }]);
      toast({ title: "Chat Error", description: "Could not get AI response.", variant: "destructive" });
    }
    setIsChatLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <UploadCloud className="mr-2 h-6 w-6" /> Input Food Label Data
          </CardTitle>
          <CardDescription>Upload an image of the food label or enter details manually.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="image-upload">Upload Label Image</Label>
            <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="mt-1 file:text-primary file:font-semibold hover:file:bg-primary/10" />
            {uploadedImage && (
              <div className="mt-4 relative border rounded-md p-2">
                <Image src={uploadedImage} alt="Uploaded label" width={300} height={200} className="rounded-md object-contain mx-auto" data-ai-hint="food label"/>
                <Button onClick={() => { setUploadedImage(null); setImageFile(null); }} variant="ghost" size="sm" className="absolute top-1 right-1 text-xs">Clear</Button>
              </div>
            )}
            <Button onClick={onImageSubmit} disabled={isLoading || !imageFile} className="mt-4 w-full">
              {isLoading && !manualForm.formState.isSubmitting ? "Analyzing Image..." : "Analyze Image"}
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-muted-foreground/30"></div>
            <span className="mx-4 text-sm text-muted-foreground">OR</span>
            <div className="flex-grow border-t border-muted-foreground/30"></div>
          </div>

          <Form {...manualForm}>
            <form onSubmit={manualForm.handleSubmit(onManualSubmit)} className="space-y-4">
              <FormField
                control={manualForm.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <HookFormLabel>Product Name (Optional)</HookFormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Instant Noodles" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={manualForm.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem>
                    <HookFormLabel>Ingredients List</HookFormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Wheat flour, Palm oil, Salt, Sugar..." {...field} rows={4}/>
                    </FormControl>
                    <FormDescription>Enter ingredients separated by commas.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={manualForm.control}
                name="nutritionFacts"
                render={({ field }) => (
                  <FormItem>
                    <HookFormLabel>Nutrition Facts (Optional)</HookFormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Energy: 450kcal, Protein: 8g..." {...field} rows={3}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading && manualForm.formState.isSubmitting} className="w-full">
                {isLoading && manualForm.formState.isSubmitting ? "Analyzing Manually..." : "Analyze Manually"}
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && !report && (
        <Card className="lg:col-span-1 flex items-center justify-center h-full min-h-[300px]">
            <div className="text-center">
                <Sparkles className="mx-auto h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-lg font-semibold">Generating AI Report...</p>
                <p className="text-sm text-muted-foreground">Please wait a moment.</p>
            </div>
        </Card>
      )}

      {report && (
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Sparkles className="mr-2 h-6 w-6 text-accent" /> AI Health Report
            </CardTitle>
            {report.productType && (
              <CardDescription>Product Type: <span className="font-semibold">{report.productType}</span></CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">Health Rating:</span>
              <StarRating rating={report.healthRating} />
              <span>({report.healthRating}/5)</span>
            </div>
            
            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-1">Detailed Analysis:</h3>
              <Alert variant="default" className="bg-background">
                <Sparkles className="h-4 w-4" />
                <AlertDescription className="whitespace-pre-wrap text-sm leading-relaxed">
                  {report.report}
                </AlertDescription>
              </Alert>
            </div>

            {report.alternatives && (
               <div>
                <h3 className="font-semibold text-lg mb-1">Healthier Indian Alternatives:</h3>
                 <Alert variant="default" className="bg-background">
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription className="whitespace-pre-wrap text-sm leading-relaxed">
                    {report.alternatives}
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <Separator className="my-4"/>
            <h3 className="font-semibold text-xl mb-2 flex items-center"><MessageCircle className="mr-2 h-5 w-5"/> Chat with AI</h3>
            <p className="text-sm text-muted-foreground mb-4">Ask questions about this report. For example: "Can kids eat this daily?"</p>
            <ScrollArea className="h-[200px] w-full rounded-md border p-3 mb-4 bg-muted/30">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`mb-2 p-2 rounded-lg text-sm ${msg.role === 'user' ? 'bg-primary/10 text-primary-foreground ml-auto' : 'bg-accent/10 text-accent-foreground mr-auto'}`} style={{maxWidth: '80%'}}>
                  <span className="font-semibold capitalize">{msg.role}: </span>{msg.content}
                </div>
              ))}
               {isChatLoading && <div className="text-sm text-muted-foreground p-2">AI is typing...</div>}
            </ScrollArea>
            <form onSubmit={handleChatSubmit} className="w-full flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={isChatLoading}
              />
              <Button type="submit" disabled={isChatLoading || !chatInput.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
       {!isLoading && !report && (
        <Card className="lg:col-span-1 flex items-center justify-center h-full min-h-[300px] bg-muted/30">
            <div className="text-center p-8">
                <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-semibold text-muted-foreground">Your AI report will appear here.</p>
                <p className="text-sm text-muted-foreground">Submit a food label to get started.</p>
            </div>
        </Card>
      )}
    </div>
  );
}
