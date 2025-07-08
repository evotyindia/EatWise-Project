
"use client";

import type { GenerateHealthReportInput, GenerateHealthReportOutput } from "@/ai/flows/generate-health-report";
import { generateHealthReport } from "@/ai/flows/generate-health-report";
<<<<<<< HEAD
import type { ContextAwareAIChatInput, ContextAwareAIChatOutput, ChatMessage } from "@/ai/flows/context-aware-ai-chat"; // Updated import
import { contextAwareAIChat } from "@/ai/flows/context-aware-ai-chat";

import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, Sparkles, MessageCircle, Send, Download, Zap, HeartPulse, Wheat, Info } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react"; // Added useEffect
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
=======
import type { ContextAwareAIChatInput, ContextAwareAIChatOutput, ChatMessage } from "@/ai/flows/context-aware-ai-chat";
import { contextAwareAIChat } from "@/ai/flows/context-aware-ai-chat";

import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, Sparkles, MessageCircle, Send, Zap, HeartPulse, Wheat, Info, FileText, Microscope, ShieldCheck, ShieldAlert, ClipboardList, UserCheck, Lightbulb, CookingPot } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
>>>>>>> finalprotest
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
import { Label } from "@/components/ui/label";
<<<<<<< HEAD
import { PrintableHealthReport } from '@/components/common/PrintableHealthReport';

=======
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
>>>>>>> finalprotest

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
<<<<<<< HEAD
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);
=======
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
>>>>>>> finalprotest

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
<<<<<<< HEAD
      manualForm.reset(); 
=======
      manualForm.reset();
>>>>>>> finalprotest
      setReport(null);
      setChatHistory([]);
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
        initiateChatWithWelcome("labelAnalysis", {
          productName: result.productType || input.productName || "the product",
          ingredients: input.ingredients || (input.photoDataUri ? "from scanned image" : "N/A"),
<<<<<<< HEAD
          healthReportSummary: result.detailedAnalysis.summary
        });
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast({ title: "Error", description: "Failed to generate report. Please try again.", variant: "destructive" });
=======
          healthReportSummary: result.summary
        });
      }
    } catch (error: any) {
      console.error("Error generating report:", error);
      toast({ title: "Analysis Failed", description: error.message || "An unknown error occurred.", variant: "destructive" });
>>>>>>> finalprotest
    }
    setIsLoading(false);
    setIsProcessingImage(false);
    setIsProcessingManually(false);
  };

  const onManualSubmit: SubmitHandler<ManualInputFormValues> = async (data) => {
    if (imageFile) {
<<<<<<< HEAD
        setImageFile(null);
        setUploadedImage(null);
        toast({ title: "Manual Submission", description: "Analyzing manually entered data. Uploaded image was cleared." });
=======
      setImageFile(null);
      setUploadedImage(null);
      toast({ title: "Manual Submission", description: "Analyzing manually entered data. Uploaded image was cleared." });
>>>>>>> finalprotest
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
<<<<<<< HEAD
    manualForm.reset(); 
    const photoDataUri = await fileToDataUri(imageFile);
    await generateReportSharedLogic({ photoDataUri }, 'image');
  };
  
  const initiateChatWithWelcome = async (contextType: "labelAnalysis" | "recipe" | "nutritionAnalysis" | "general", contextData: any) => {
    setIsChatLoading(true);
    setChatHistory([]);
    const input: ContextAwareAIChatInput = {
        userQuestion: "INIT_CHAT_WELCOME", 
        contextType: contextType,
        labelContext: contextType === "labelAnalysis" ? contextData : undefined,
    };
    try {
        const aiResponse = await contextAwareAIChat(input);
        setChatHistory([{ role: "assistant", content: aiResponse.answer }]);
    } catch (error) {
        console.error("Chat init error:", error);
        setChatHistory([{ role: "assistant", content: "Hello! How can I assist you with this analysis report today?" }]);
=======
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
>>>>>>> finalprotest
    }
    setIsChatLoading(false);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !report) return;

    const userMessage: ChatMessage = { role: "user", content: chatInput };
<<<<<<< HEAD
    const newChatHistory = [...chatHistory, userMessage];
    setChatHistory(newChatHistory);
=======
    setChatHistory(prev => [...prev, userMessage]);
>>>>>>> finalprotest
    setChatInput("");
    setIsChatLoading(true);

    try {
      const chatContextInput: ContextAwareAIChatInput = {
        userQuestion: userMessage.content,
<<<<<<< HEAD
        chatHistory: chatHistory.slice(-5), 
=======
        chatHistory: chatHistory.slice(-5),
>>>>>>> finalprotest
        contextType: "labelAnalysis",
        labelContext: {
          productName: report.productType || manualForm.getValues("productName") || "N/A",
          ingredients: manualForm.getValues("ingredients") || "Ingredients extracted from image scan.",
<<<<<<< HEAD
          healthReportSummary: `Overall Rating: ${report.healthRating}/5. Summary: ${report.detailedAnalysis.summary}.`,
=======
          healthReportSummary: `Overall Rating: ${report.healthRating}/5. Summary: ${report.summary}.`,
>>>>>>> finalprotest
        },
      };
      const aiResponse = await contextAwareAIChat(chatContextInput);
      setChatHistory((prev) => [...prev, { role: "assistant", content: aiResponse.answer }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatHistory((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't process that. Please try again." }]);
      toast({ title: "Chat Error", description: "Could not get AI response.", variant: "destructive" });
    }
    setIsChatLoading(false);
  };
<<<<<<< HEAD
  
  useEffect(() => {
    if (chatScrollAreaRef.current) {
      chatScrollAreaRef.current.scrollTop = chatScrollAreaRef.current.scrollHeight;
    }
  }, [chatHistory]);


  const handleDownloadReport = async () => {
    if (!report) return;
    setIsPdfDownloading(true);

    const tempDiv = document.createElement('div');
    tempDiv.id = 'pdf-render-source-analyzer-form-' + Date.now(); 
    tempDiv.style.position = 'absolute'; tempDiv.style.left = '-9999px'; tempDiv.style.top = '0px';
    tempDiv.style.width = '210mm'; tempDiv.style.backgroundColor = 'white'; tempDiv.style.padding = '0'; tempDiv.style.margin = '0';
    document.body.appendChild(tempDiv);

    const root = createRoot(tempDiv);
    root.render(
      <PrintableHealthReport
        report={report}
        chatHistory={chatHistory}
        productNameContext={manualForm.getValues("productName")}
      />
    );
    
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
      const safeProductName = (report.productType || manualForm.getValues("productName") || 'food-label').replace(/[^a-z0-9]/gi, '_').toLowerCase();
      pdf.save(`${safeProductName}_health_report.pdf`);
      toast({ title: "Report Downloaded", description: "The PDF health report has been saved." });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({ title: "PDF Error", description: "Could not generate PDF report. " + (error as Error).message, variant: "destructive" });
    } finally {
      root.unmount(); 
      if (document.body.contains(tempDiv)) {
        document.body.removeChild(tempDiv);
      }
      setIsPdfDownloading(false);
    }
  };

 const renderFormattedText = (text?: string): JSX.Element | null => {
    if (!text || text.trim() === "" || text.trim().toLowerCase() === "n/a") return null;
=======

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatHistory.length > 1) {
      scrollToBottom();
    }
  }, [chatHistory]);

  const renderFormattedText = (text?: string): JSX.Element | null => {
    if (!text || text.trim() === "" || text.trim().toLowerCase() === "n/a" || text.trim().toLowerCase().includes("no significant")) return null;
>>>>>>> finalprotest

    const lines = text.split('\n').map(line => line.trim()).filter(line => line !== "");
    if (lines.length === 0) return null;

<<<<<<< HEAD
    const hasBullets = lines.some(line => line.startsWith('* ') || line.startsWith('- '));

    if (hasBullets) {
        return (
            <ul className="list-none space-y-1 text-sm leading-relaxed">
                {lines.map((line, index) => (
                    <li key={index} className="flex items-start">
                        <span className="mr-2 mt-1 text-primary">&#8226;</span>
                        <span>{line.replace(/^(\*|-)\s*/, '')}</span>
                    </li>
                ))}
            </ul>
        );
    } else {
        return (
            <div className="text-sm leading-relaxed space-y-1">
                {lines.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
        );
    }
};


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl"><UploadCloud className="mr-2 h-6 w-6" /> Input Food Label Data</CardTitle>
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
            <Button type="button" onClick={onImageSubmit} disabled={isLoading || !imageFile} className="mt-4 w-full">
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
                <FormItem><HookFormLabel>Ingredients List</HookFormLabel><FormControl><Textarea placeholder="e.g., Wheat flour, Palm oil, Salt, Sugar..." {...field} rows={4}/></FormControl><FormDescription>Enter ingredients separated by commas.</FormDescription><FormMessage /></FormItem>
              )} />
              <FormField control={manualForm.control} name="nutritionFacts" render={({ field }) => (
                <FormItem><HookFormLabel>Nutrition Facts (Optional)</HookFormLabel><FormControl><Textarea placeholder="e.g., Energy: 450kcal, Protein: 8g..." {...field} rows={3}/></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" disabled={isLoading} className="w-full">
                 {isProcessingManually ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Analyze Manually
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
                <p className="text-sm text-muted-foreground mt-1">Our AI is carefully analyzing the data. This may take a few moments, especially for images.</p>
            </div>
        </Card>
      )}

      {report && (
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center text-2xl"><Sparkles className="mr-2 h-6 w-6 text-primary" /> AI Health Report</CardTitle>
              <Button onClick={handleDownloadReport} variant="outline" size="sm" disabled={isPdfDownloading}>
                {isPdfDownloading ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />} Download PDF
              </Button>
            </div>
            {report.productType && (<CardDescription>Product Type: <span className="font-semibold">{report.productType}</span></CardDescription>)}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Alert variant="default" className="bg-muted/60">
                <HeartPulse className="h-5 w-5 text-red-500" />
                <AlertTitle className="font-semibold">Overall Health Rating</AlertTitle>
                <AlertDescription className="flex items-center gap-1 flex-wrap">
                    <StarRating rating={report.healthRating} /> 
                    <span>({report.healthRating}/5). <i className="text-xs">Higher stars = better health.</i></span>
                </AlertDescription>
              </Alert>
               {report.processingLevelRating?.rating !== undefined && (
                <Alert variant="default" className="bg-muted/60">
                    <Zap className="h-5 w-5 text-purple-500" />
                    <AlertTitle className="font-semibold">Processing Level</AlertTitle>
                    <AlertDescription className="flex items-center gap-1 flex-wrap">
                        <StarRating rating={report.processingLevelRating.rating} /> 
                        <span>({report.processingLevelRating.rating}/5). <i className="text-xs">Generally, less processed (fewer stars) is better.</i></span>
                    </AlertDescription>
                    {report.processingLevelRating.justification && <p className="text-xs text-muted-foreground mt-1 pl-7">{report.processingLevelRating.justification}</p>}
                </Alert>
               )}
               {report.sugarContentRating?.rating !== undefined && (
                <Alert variant="default" className="bg-muted/60">
                    <Wheat className="h-5 w-5 text-amber-600" /> 
                    <AlertTitle className="font-semibold">Sugar Content</AlertTitle>
                    <AlertDescription className="flex items-center gap-1 flex-wrap">
                        <StarRating rating={report.sugarContentRating.rating} /> 
                        <span>({report.sugarContentRating.rating}/5). <i className="text-xs">Generally, lower sugar (fewer stars) is better.</i></span>
                    </AlertDescription>
                    {report.sugarContentRating.justification && <p className="text-xs text-muted-foreground mt-1 pl-7">{report.sugarContentRating.justification}</p>}
                </Alert>
               )}
               {report.nutrientDensityRating?.rating !== undefined && (
                <Alert variant="default" className="bg-muted/60">
                    <Sparkles className="h-5 w-5 text-green-500" />
                    <AlertTitle className="font-semibold">Nutrient Density</AlertTitle>
                    <AlertDescription className="flex items-center gap-1 flex-wrap">
                        <StarRating rating={report.nutrientDensityRating.rating} /> 
                        <span>({report.nutrientDensityRating.rating}/5). <i className="text-xs">Higher stars = more nutrient dense.</i></span>
                    </AlertDescription>
                    {report.nutrientDensityRating.justification && <p className="text-xs text-muted-foreground mt-1 pl-7">{report.nutrientDensityRating.justification}</p>}
                </Alert>
               )}
            </div>
            <Separator />
            <div>
                <Alert variant="default" className="bg-background">
                    <Info className="h-4 w-4 text-primary" />
                     <AlertTitle className="font-semibold text-lg mb-1">Summary:</AlertTitle>
                    <AlertDescription>{renderFormattedText(report.detailedAnalysis.summary)}</AlertDescription>
                </Alert>
            </div>
            
            {renderFormattedText(report.detailedAnalysis.positiveAspects) && (
                <div>
                    <Alert variant="default" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
                        <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertTitle className="font-semibold text-lg mb-1 text-green-700 dark:text-green-300">Positive Aspects:</AlertTitle>
                        <AlertDescription className="text-green-700 dark:text-green-300">{renderFormattedText(report.detailedAnalysis.positiveAspects)}</AlertDescription>
                    </Alert>
                </div>
            )}
            
            {renderFormattedText(report.detailedAnalysis.potentialConcerns) && (
                <div>
                    <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
                        <Info className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <AlertTitle className="font-semibold text-lg mb-1 text-red-700 dark:text-red-300">Potential Concerns:</AlertTitle>
                        <AlertDescription className="text-red-700 dark:text-red-300">{renderFormattedText(report.detailedAnalysis.potentialConcerns)}</AlertDescription>
                    </Alert>
                </div>
            )}
            
            {renderFormattedText(report.detailedAnalysis.keyNutrientsBreakdown) && (
                <div>
                    <Alert variant="default" className="bg-background">
                        <Info className="h-4 w-4 text-primary" />
                        <AlertTitle className="font-semibold text-lg mb-1">Key Nutrients Breakdown:</AlertTitle>
                        <AlertDescription>{renderFormattedText(report.detailedAnalysis.keyNutrientsBreakdown)}</AlertDescription>
                    </Alert>
                </div>
            )}

            {renderFormattedText(report.alternatives) && (
                <div>
                    <Alert variant="default" className="bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-700">
                        <Info className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                        <AlertTitle className="font-semibold text-lg mb-1 text-sky-700 dark:text-sky-300">Healthier Indian Alternatives:</AlertTitle>
                        <AlertDescription className="text-sky-700 dark:text-sky-300">{renderFormattedText(report.alternatives)}</AlertDescription>
                    </Alert>
                </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-start pt-4 border-t">
            <Separator className="my-4"/>
            <h3 className="font-semibold text-xl mb-2 flex items-center"><MessageCircle className="mr-2 h-5 w-5"/> Chat with AI Advisor</h3>
            <p className="text-sm text-muted-foreground mb-4">Ask questions about this report. For example: "Can kids eat this daily?"</p>
            <ScrollArea className="h-[200px] w-full rounded-md border p-3 mb-4 bg-muted/50" ref={chatScrollAreaRef}>
              {chatHistory.map((msg, index) => (
                <div key={index} className={`mb-2 p-2.5 rounded-lg text-sm shadow-sm max-w-[85%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-accent text-accent-foreground mr-auto'}`}>
                  <span className="font-semibold capitalize">{msg.role === 'user' ? 'You' : 'AI Advisor'}: </span>{msg.content}
                </div>
              ))}
               {isChatLoading && <div className="text-sm text-muted-foreground p-2">AI Advisor is typing...</div>}
            </ScrollArea>
            <form onSubmit={handleChatSubmit} className="w-full flex gap-2">
              <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask a question..." disabled={isChatLoading} className="bg-background" />
              <Button type="submit" disabled={isChatLoading || !chatInput.trim()}><Send className="h-4 w-4" /></Button>
            </form>
          </CardFooter>
        </Card>
      )}
       {!isLoading && !report && (
        <Card className="lg:col-span-1 flex items-center justify-center h-full min-h-[300px] bg-muted/30">
            <div className="text-center p-8"><Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" /><p className="text-lg font-semibold text-muted-foreground">Your AI report will appear here.</p><p className="text-sm text-muted-foreground">Submit a food label to get started.</p></div>
        </Card>
      )}
=======
    return (
      <ul className="list-none space-y-1 text-sm leading-relaxed">
        {lines.map((line, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-2 mt-1 text-accent">&#8226;</span>
            <span className="break-words">{line.replace(/^(\*|-)\s*/, '')}</span>
          </li>
        ))}
      </ul>
    );
  };

  const riskBadgeVariantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    High: 'destructive',
    Medium: 'secondary',
    Low: 'default',
    Neutral: 'outline',
  };

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
          <Card className="animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center text-2xl"><FileText className="mr-2 h-6 w-6 text-primary" /> AI Health Report</CardTitle>
                  {report.productType && (<CardDescription>Product Type: <span className="font-semibold">{report.productType}</span></CardDescription>)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Alert variant="default" className="bg-muted/60">
                  <HeartPulse className="h-5 w-5 text-accent" />
                  <AlertTitle className="font-semibold flex justify-between items-center">
                    <span>Overall Health Rating</span>
                    <span className="text-xs font-normal text-muted-foreground">(Higher is better)</span>
                  </AlertTitle>
                  <AlertDescription className="flex items-center gap-1 flex-wrap mt-1">
                    <StarRating rating={report.healthRating} variant="good" />
                    <span>({report.healthRating}/5)</span>
                  </AlertDescription>
                </Alert>

                {report.processingLevelRating?.rating !== undefined && (
                  <Alert variant="default" className="bg-muted/60">
                    <Zap className="h-5 w-5 text-accent" />
                    <AlertTitle className="font-semibold flex justify-between items-center">
                      <span>Processing Level</span>
                      <span className="text-xs font-normal text-muted-foreground">(Lower is better)</span>
                    </AlertTitle>
                    <AlertDescription className="flex items-center gap-1 flex-wrap mt-1">
                      <StarRating rating={report.processingLevelRating.rating} variant="bad" />
                      <span>({report.processingLevelRating.rating}/5)</span>
                    </AlertDescription>
                  </Alert>
                )}

                {report.sugarContentRating?.rating !== undefined && (
                  <Alert variant="default" className="bg-muted/60">
                    <Wheat className="h-5 w-5 text-accent" />
                    <AlertTitle className="font-semibold flex justify-between items-center">
                      <span>Sugar Content</span>
                      <span className="text-xs font-normal text-muted-foreground">(Lower is better)</span>
                    </AlertTitle>
                    <AlertDescription className="flex items-center gap-1 flex-wrap mt-1">
                      <StarRating rating={report.sugarContentRating.rating} variant="bad" />
                      <span>({report.sugarContentRating.rating}/5)</span>
                    </AlertDescription>
                  </Alert>
                )}

                {report.nutrientDensityRating?.rating !== undefined && (
                  <Alert variant="default" className="bg-muted/60">
                    <Sparkles className="h-5 w-5 text-accent" />
                     <AlertTitle className="font-semibold flex justify-between items-center">
                      <span>Nutrient Density</span>
                      <span className="text-xs font-normal text-muted-foreground">(Higher is better)</span>
                    </AlertTitle>
                    <AlertDescription className="flex items-center gap-1 flex-wrap mt-1">
                      <StarRating rating={report.nutrientDensityRating.rating} variant="good" />
                      <span>({report.nutrientDensityRating.rating}/5)</span>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <Separator />

              <Alert variant="default" className="bg-background/30">
                <Info className="h-4 w-4 text-primary" />
                <AlertTitle className="font-semibold text-lg mb-1">Summary</AlertTitle>
                <AlertDescription>{report.summary}</AlertDescription>
              </Alert>

              {renderFormattedText(report.greenFlags) && (
                <Alert variant="success">
                  <ShieldCheck className="h-4 w-4" />
                  <AlertTitle className="font-semibold text-lg mb-1">Green Flags</AlertTitle>
                  <AlertDescription>{renderFormattedText(report.greenFlags)}</AlertDescription>
                </Alert>
              )}

              {renderFormattedText(report.redFlags) && (
                <Alert variant="destructive">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertTitle className="font-semibold text-lg mb-1">Red Flags</AlertTitle>
                  <AlertDescription>{renderFormattedText(report.redFlags)}</AlertDescription>
                </Alert>
              )}

              <Accordion type="single" collapsible className="w-full" defaultValue="detailed-analysis">
                <AccordionItem value="detailed-analysis">
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                    <div className="flex items-center">
                      <ClipboardList className="mr-2 h-5 w-5 text-primary" />
                      <span>Detailed Nutritional Breakdown</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                      <div className="p-3 rounded-md border bg-muted/50">
                          <h4 className="font-semibold mb-1">Processing Level</h4>
                          <p className="text-sm text-muted-foreground">{report.detailedAnalysis.processingLevel}</p>
                      </div>
                      <div className="p-3 rounded-md border bg-muted/50">
                          <h4 className="font-semibold mb-1">Macronutrient Profile</h4>
                          <p className="text-sm text-muted-foreground">{report.detailedAnalysis.macronutrientProfile}</p>
                      </div>
                      <div className="p-3 rounded-md border bg-muted/50">
                          <h4 className="font-semibold mb-1">Sugar Analysis</h4>
                          <p className="text-sm text-muted-foreground">{report.detailedAnalysis.sugarAnalysis}</p>
                      </div>
                      {renderFormattedText(report.detailedAnalysis.micronutrientHighlights) && (
                          <div className="p-3 rounded-md border bg-muted/50">
                              <h4 className="font-semibold mb-1">Micronutrient Highlights</h4>
                              <div className="text-sm text-muted-foreground">{renderFormattedText(report.detailedAnalysis.micronutrientHighlights)}</div>
                          </div>
                      )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Alert variant="default" className="bg-secondary/70">
                <UserCheck className="h-4 w-4 text-primary" />
                <AlertTitle className="font-semibold text-lg mb-1">Best Suited For</AlertTitle>
                <AlertDescription>{report.bestSuitedFor}</AlertDescription>
              </Alert>

              {renderFormattedText(report.consumptionTips) && (
                  <Alert variant="default" className="bg-secondary/70">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    <AlertTitle className="font-semibold text-lg mb-1">Healthy Consumption Tips</AlertTitle>
                    <AlertDescription>{renderFormattedText(report.consumptionTips)}</AlertDescription>
                  </Alert>
              )}

              <Alert variant="default" className="bg-secondary/70">
                <CookingPot className="h-4 w-4 text-primary" />
                <AlertTitle className="font-semibold text-lg mb-1">Role in an Indian Diet</AlertTitle>
                <AlertDescription>{report.indianDietContext}</AlertDescription>
              </Alert>

              {renderFormattedText(report.healthierAlternatives) && (
                <Alert variant="default" className="bg-secondary">
                  <Info className="h-4 w-4 text-primary" />
                  <AlertTitle className="font-semibold text-lg mb-1">Healthier Indian Alternatives</AlertTitle>
                  <AlertDescription>{renderFormattedText(report.healthierAlternatives)}</AlertDescription>
                </Alert>
              )}

              {report.ingredientDeepDive && report.ingredientDeepDive.length > 0 && (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="ingredient-breakdown">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center">
                        <Microscope className="mr-2 h-5 w-5 text-primary" />
                        <span>Ingredient Deep Dive</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Accordion type="single" collapsible className="w-full">
                        {report.ingredientDeepDive.map((item, index) => (
                          <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger>
                              <div className="flex items-center justify-between w-full pr-2">
                                <span className="font-medium">{item.ingredientName}</span>
                                <Badge variant={riskBadgeVariantMap[item.riskLevel] || 'outline'}>{item.riskLevel}</Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-2 px-1">
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                              <p className="text-xs"><strong className="font-semibold">Justification:</strong> {item.riskReason}</p>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-start pt-4 border-t">
              <h3 className="font-semibold text-xl mb-2 flex items-center"><MessageCircle className="mr-2 h-5 w-5" /> Chat with AI Advisor</h3>
              <p className="text-sm text-muted-foreground mb-4">Ask questions about this report.</p>
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
            </CardFooter>
          </Card>
        )}
        {!isLoading && !report && (
          <Card className="flex items-center justify-center h-full min-h-[300px] bg-muted/30">
            <div className="text-center p-8"><Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" /><p className="text-lg font-semibold text-muted-foreground">Your AI report will appear here.</p><p className="text-sm text-muted-foreground mt-1">Submit a food label to get started.</p></div>
          </Card>
        )}
      </div>
>>>>>>> finalprotest
    </div>
  );
}
