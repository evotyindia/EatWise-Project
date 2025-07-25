
"use client";

import type { GenerateHealthReportInput, GenerateHealthReportOutput } from "@/ai/flows/generate-health-report";
import { generateHealthReport } from "@/ai/flows/generate-health-report";
import type { ContextAwareAIChatInput, ContextAwareAIChatOutput, ChatMessage } from "@/ai/flows/context-aware-ai-chat";
import { contextAwareAIChat } from "@/ai/flows/context-aware-ai-chat";
import { LabelReportDisplay } from "@/components/common/LabelReportDisplay";

import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, Sparkles, MessageCircle, Send, Save, ArrowRight, ShieldAlert, ScanSearch, Check } from "lucide-react";
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
import { createReport } from "@/services/reportService";
import { auth } from "@/lib/firebase";
import Link from "next/link";

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
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
  const saveButtonRef = useRef<HTMLDivElement>(null);

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [reportTitleForSave, setReportTitleForSave] = useState("");
  const [productNameForSave, setProductNameForSave] = useState("");


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
    const authUser = auth.currentUser;
    if (!authUser) {
      toast({ title: "Login Required", description: "You must be logged in to save reports.", variant: "destructive" });
      return;
    }
    if (!report) {
      toast({ title: "No Report", description: "Generate a report before saving.", variant: "destructive" });
      return;
    }

    try {
      const finalReportTitle = reportTitleForSave.trim() || `Label Analysis: ${productNameForSave.trim() || new Date().toLocaleString()}`;
      const finalProductName = productNameForSave.trim();
      
      const newReportData = {
        uid: authUser.uid,
        type: 'label' as const,
        title: finalReportTitle,
        summary: report.summary,
        createdAt: new Date().toISOString(),
        data: report,
        userInput: { 
          ...manualForm.getValues(),
          productName: finalProductName,
          photoDataUri: uploadedImage ? "Image Uploaded" : undefined 
        }
      };

      await createReport(newReportData);

      toast({ 
        title: "Report Saved!", 
        description: "You can find all your saved items on the 'Saved' page.",
        variant: "success",
        action: (
          <Button asChild variant="secondary" size="sm">
            <Link href="/saved">View Saved Items <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        )
      });
      setIsSaveDialogOpen(false);
      setProductNameForSave("");
      setReportTitleForSave("");


    } catch(error) {
        console.error("Failed to save report:", error);
        toast({ title: "Save Failed", description: (error as Error).message || "Could not save the report.", variant: "destructive" });
    }
  };


  const generateReportSharedLogic = async (input: GenerateHealthReportInput, processingType: 'image' | 'manual') => {
    
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
        setTimeout(() => saveButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
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
    if (scrollAreaViewportRef.current) {
      requestAnimationFrame(() => {
        const scrollContainer = scrollAreaViewportRef.current;
        if(scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      });
    }
  };

  useEffect(() => {
    if (chatHistory.length > 1) {
      scrollToBottom();
    }
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

        <div>
          {isLoading && !report && (
            <Card className="flex flex-col items-center justify-center h-full min-h-[400px] text-center overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Generating AI Report...</CardTitle>
                    <CardDescription>Our AI is carefully analyzing the data. This may take a few moments.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-8">
                    <div className="relative flex items-center justify-center w-48 h-48">
                        <ScanSearch className="w-28 h-28 text-primary animate-pulse" />
                        <div className="absolute inset-0">
                            <ShieldAlert className="absolute top-4 left-10 w-8 h-8 text-destructive/70 animate-toss" style={{ animationDelay: '0s' }}/>
                            <Sparkles className="absolute top-8 right-8 w-8 h-8 text-accent/70 animate-toss" style={{ animationDelay: '0.5s' }}/>
                            <Check className="absolute top-12 left-4 w-8 h-8 text-success/70 animate-toss" style={{ animationDelay: '1s' }}/>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-muted-foreground">Scanning for insights...</p>
                </CardFooter>
            </Card>
          )}

          {report && (
            <div className="animate-fade-in-up opacity-0 space-y-8" style={{ animationFillMode: 'forwards' }}>
              <div ref={saveButtonRef} className="flex justify-end">
                  <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => {
                          const detectedName = report.productType || manualForm.getValues("productName") || '';
                          setReportTitleForSave(detectedName ? `Analysis for ${detectedName}` : 'Food Label Analysis');
                          setProductNameForSave(detectedName);
                      }}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Report
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save Report</DialogTitle>
                        <DialogDescription>Give your report a title and confirm the product name to easily find it later.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="report-title" className="text-right">Report Title</Label>
                          <Input id="report-title" value={reportTitleForSave} onChange={(e) => setReportTitleForSave(e.target.value)} className="col-span-3" placeholder="e.g., Evening Snack Analysis" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="product-name" className="text-right">Product Name</Label>
                          <Input id="product-name" value={productNameForSave} onChange={(e) => setProductNameForSave(e.target.value)} className="col-span-3" placeholder="e.g., Maggi Noodles" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" onClick={handleSaveReport}>Save Report</Button>
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
                  <ScrollArea className="h-[200px] w-full" viewportRef={scrollAreaViewportRef}>
                    <div className="space-y-3 p-3">
                      {chatHistory.map((msg, index) => (
                        <div key={index} className={`p-2.5 rounded-lg text-sm shadow-sm max-w-[85%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-secondary text-secondary-foreground mr-auto'}`}>
                          <span className="font-semibold capitalize">{msg.role === 'user' ? 'You' : 'AI Advisor'}: </span>{msg.content}
                        </div>
                      ))}
                      {isChatLoading && <div className="text-sm text-muted-foreground p-2">AI Advisor is typing...</div>}
                    </div>
                  </ScrollArea>
                  <form onSubmit={handleChatSubmit} className="w-full flex gap-2 mt-4">
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
