
"use client";

import type { GenerateHealthReportInput, GenerateHealthReportOutput } from "@/ai/flows/generate-health-report";
import { generateHealthReport } from "@/ai/flows/generate-health-report";
import type { ContextAwareAIChatInput, ContextAwareAIChatOutput, ChatMessage } from "@/ai/flows/context-aware-ai-chat";
import { contextAwareAIChat } from "@/ai/flows/context-aware-ai-chat";
import { LabelReportDisplay } from "@/components/common/LabelReportDisplay";

import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, Sparkles, MessageCircle, Send, Save } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel as HookFormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn, fileToDataUri } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getUserByEmail } from "@/services/userService";
import { createReport } from "@/services/reportService";

const manualInputSchema = z.object({
  productName: z.string().optional(),
  ingredients: z.string().min(1, "Ingredients list is required for manual input."),
  nutritionFacts: z.string().optional(),
});

type ManualInputFormValues = z.infer<typeof manualInputSchema>;

export function AnalyzerForm() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [report, setReport] = useState<GenerateHealthReportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isProcessingManually, setIsProcessingManually] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState("");

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
      manualForm.reset();
      setReport(null);
      setChatHistory([]);
    }
  };

  const handleSaveReport = async () => {
    const loggedInUserEmail = JSON.parse(localStorage.getItem("loggedInUser") || "{}").email;
    if (!loggedInUserEmail) {
      toast({ title: "Login Required", description: "You must be logged in to save reports.", variant: "destructive" });
      return;
    }
    if (!report) {
      toast({ title: "No Report", description: "Generate a report before saving.", variant: "destructive" });
      return;
    }

    try {
      const user = await getUserByEmail(loggedInUserEmail);
      if (!user?.id) {
        toast({ title: "User Not Found", description: "Could not find your user account to save the report.", variant: "destructive" });
        return;
      }
      
      const newReportData = {
        userId: user.id,
        type: 'label' as const,
        title: reportTitle.trim() || report.productType || manualForm.getValues("productName") || "Untitled Label Report",
        summary: report.summary,
        createdAt: new Date().toISOString(),
        data: report,
        userInput: { ...manualForm.getValues(), photoDataUri: uploadedImage ? "Image Uploaded" : undefined }
      };

      await createReport(newReportData);

      toast({ title: "Report Saved", description: "The health report has been saved to your history." });
      setIsSaveDialogOpen(false);
      setReportTitle("");

    } catch(error) {
        console.error("Failed to save report:", error);
        toast({ title: "Save Failed", description: "Could not save the report to the database.", variant: "destructive" });
    }
  };


  const generateReportSharedLogic = async (input: GenerateHealthReportInput, processingType: 'image' | 'manual') => {
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    
    setIsLoading(true);
    if (processingType === 'image') setIsProcessingImage(true);
    if (processingType === 'manual') setIsProcessingManually(true);
    setReport(null);
    setChatHistory([]);
    try {
      const result = await generateHealthReport(input);
      setReport(result);
      toast({ title: "Report Generated", description: "AI analysis complete." });
      if (result) {
        initiateChatWithWelcome("labelAnalysis", {
          productName: result.productType || input.productName || "the product",
          ingredients: input.ingredients || (input.photoDataUri ? "from scanned image" : "N/A"),
          healthReportSummary: result.summary
        });
      }
    } catch (error: any) {
      console.error("Error generating report:", error);
      toast({ title: "Analysis Failed", description: error.message || "An unknown error occurred.", variant: "destructive" });
    }
    setIsLoading(false);
    setIsProcessingImage(false);
    setIsProcessingManually(false);
  };

  const onManualSubmit: SubmitHandler<ManualInputFormValues> = async (data) => {
    if (imageFile) {
      setImageFile(null);
      setUploadedImage(null);
      toast({ title: "Manual Submission", description: "Analyzing manually entered data. Uploaded image was cleared." });
    }
    await generateReportSharedLogic({
      productName: data.productName,
      ingredients: data.ingredients,
      nutritionFacts: data.nutritionFacts,
    }, 'manual');
  };

  const onImageSubmit = async () => {
    if (!imageFile) {
      toast({ title: "No Image", description: "Please upload an image first.", variant: "destructive" });
      return;
    }
    manualForm.reset();
    const photoDataUri = await fileToDataUri(imageFile);
    await generateReportSharedLogic({ photoDataUri }, 'image');
  };

  const initiateChatWithWelcome = async (contextType: "labelAnalysis", contextData: any) => {
    setIsChatLoading(true);
    setChatHistory([]);
    const input: ContextAwareAIChatInput = {
      userQuestion: "INIT_CHAT_WELCOME",
      contextType: contextType,
      labelContext: contextData,
    };
    try {
      const aiResponse = await contextAwareAIChat(input);
      setChatHistory([{ role: "assistant", content: aiResponse.answer }]);
    } catch (error) {
      console.error("Chat init error:", error);
      setChatHistory([{ role: "assistant", content: "Hello! How can I assist you with this analysis report today?" }]);
    }
    setIsChatLoading(false);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !report) return;

    const userMessage: ChatMessage = { role: "user", content: chatInput };
    setChatHistory(prev => [...prev, userMessage]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const chatContextInput: ContextAwareAIChatInput = {
        userQuestion: userMessage.content,
        chatHistory: chatHistory.slice(-5),
        contextType: "labelAnalysis",
        labelContext: {
          productName: report.productType || manualForm.getValues("productName") || "N/A",
          ingredients: manualForm.getValues("ingredients") || "Ingredients extracted from image scan.",
          healthReportSummary: `Overall Rating: ${report.healthRating}/5. Summary: ${report.summary}.`,
        },
      };
      const aiResponse = await contextAwareAIChat(chatContextInput);
      setChatHistory((prev) => [...prev, { role: "assistant", content: aiResponse.answer }]);
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMessage = (error as Error).message || "Sorry, I couldn't process that. Please try again.";
      setChatHistory((prev) => [...prev, { role: "assistant", content: errorMessage }]);
      toast({ title: "Chat Error", description: "Could not get AI response.", variant: "destructive" });
    }
    setIsChatLoading(false);
  };

  const scrollToBottom = () => {
    if (chatHistory.length > 1) { // Only scroll after the first user message
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl"><UploadCloud className="mr-2 h-6 w-6 text-primary" /> Input Food Label Data</CardTitle>
            <CardDescription>Upload an image of the food label or enter details manually.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="image-upload">Upload Label Image</Label>
              <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="mt-1 file:text-primary file:font-semibold hover:file:bg-primary/10" />
              {uploadedImage && (
                <div className="mt-4 relative border rounded-md p-2">
                  <Image src={uploadedImage} alt="Uploaded label" width={300} height={200} className="rounded-md object-contain mx-auto" data-ai-hint="food label" />
                  <Button onClick={() => { setUploadedImage(null); setImageFile(null); }} variant="ghost" size="sm" className="absolute top-1 right-1 text-xs">Clear</Button>
                </div>
              )}
              <Button type="button" onClick={onImageSubmit} disabled={isLoading || !imageFile} className="mt-4 w-full bg-accent text-accent-foreground hover:bg-accent/90">
                {isProcessingImage ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Analyze Image
              </Button>
            </div>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-muted-foreground/30"></div><span className="mx-4 text-sm text-muted-foreground">OR</span><div className="flex-grow border-t border-muted-foreground/30"></div>
            </div>

            <Form {...manualForm}>
              <form onSubmit={manualForm.handleSubmit(onManualSubmit)} className="space-y-4">
                <FormField control={manualForm.control} name="productName" render={({ field }) => (
                  <FormItem><HookFormLabel>Product Name (Optional)</HookFormLabel><FormControl><Input placeholder="e.g., Instant Noodles" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={manualForm.control} name="ingredients" render={({ field }) => (
                  <FormItem><HookFormLabel>Ingredients List</HookFormLabel><FormControl><Textarea placeholder="e.g., Wheat flour, Palm oil, Salt, Sugar..." {...field} rows={4} /></FormControl><FormDescription>Enter ingredients separated by commas.</FormDescription><FormMessage /></FormItem>
                )} />
                <FormField control={manualForm.control} name="nutritionFacts" render={({ field }) => (
                  <FormItem><HookFormLabel>Nutrition Facts (Optional)</HookFormLabel><FormControl><Textarea placeholder="e.g., Energy: 450kcal, Protein: 8g..." {...field} rows={3} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isProcessingManually ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Analyze Manually
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div ref={resultsRef}>
          {isLoading && !report && (
            <Card className="flex items-center justify-center h-full min-h-[300px]">
              <div className="text-center">
                <Sparkles className="mx-auto h-12 w-12 text-accent animate-spin mb-4" />
                <p className="text-lg font-semibold">Generating AI Report...</p>
                <p className="text-sm text-muted-foreground mt-1">Our AI is carefully analyzing the data. This may take a few moments.</p>
              </div>
            </Card>
          )}

          {report && (
            <div className="animate-fade-in-up opacity-0 space-y-8" style={{ animationFillMode: 'forwards' }}>
              <div className="flex justify-end">
                  <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => setReportTitle(report.productType || manualForm.getValues("productName") || '')}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Report
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save Report</DialogTitle>
                        <DialogDescription>Give your report a name to easily find it later in your history.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="report-name" className="text-right">Name</Label>
                          <Input id="report-name" value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} className="col-span-3" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" onClick={handleSaveReport}>Save</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
              </div>

              <LabelReportDisplay report={report} />

              <Card>
                <CardHeader>
                    <h3 className="font-semibold text-xl flex items-center"><MessageCircle className="mr-2 h-5 w-5" /> Chat with AI Advisor</h3>
                    <p className="text-sm text-muted-foreground pt-1">Ask questions about this report.</p>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-3 mb-4 bg-muted/50">
                    {chatHistory.map((msg, index) => (
                      <div key={index} className={`mb-2 p-2.5 rounded-lg text-sm shadow-sm max-w-[85%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-secondary text-secondary-foreground mr-auto'}`}>
                        <span className="font-semibold capitalize">{msg.role === 'user' ? 'You' : 'AI Advisor'}: </span>{msg.content}
                      </div>
                    ))}
                    {isChatLoading && <div className="text-sm text-muted-foreground p-2">AI Advisor is typing...</div>}
                    <div ref={messagesEndRef} />
                  </ScrollArea>
                  <form onSubmit={handleChatSubmit} className="w-full flex gap-2">
                    <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask a question..." disabled={isChatLoading} className="bg-background/50" />
                    <Button type="submit" disabled={isChatLoading || !chatInput.trim()}><Send className="h-4 w-4" /></Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
          {!isLoading && !report && (
            <Card className="flex items-center justify-center h-full min-h-[300px] bg-muted/30">
              <div className="text-center p-8"><Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" /><p className="text-lg font-semibold text-muted-foreground">Your AI report will appear here.</p><p className="text-sm text-muted-foreground mt-1">Submit a food label to get started.</p></div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
