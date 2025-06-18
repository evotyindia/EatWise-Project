
"use client";

import type { GenerateHealthReportInput, GenerateHealthReportOutput } from "@/ai/flows/generate-health-report";
import { generateHealthReport } from "@/ai/flows/generate-health-report";
import type { ContextAwareAIChatInput, ContextAwareAIChatOutput, ChatMessage } from "@/ai/flows/context-aware-ai-chat";
import { contextAwareAIChat } from "@/ai/flows/context-aware-ai-chat";

import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, Sparkles, MessageCircle, Send, Download, Zap, HeartPulse, Wheat, Info, FileText, AlertOctagon, CheckCircle2, GitFork } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "@/components/ui/button";
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
import { PrintableHealthReport } from '@/components/common/PrintableHealthReport';


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
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();

  const formMethods = useForm<ManualInputFormValues>({
    resolver: zodResolver(manualInputSchema),
    defaultValues: {
      productName: "",
      ingredients: "",
      nutritionFacts: "",
    },
  });
  const { control, handleSubmit, reset: manualFormReset, getValues: getManualFormValues } = formMethods;


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      manualFormReset(); 
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
          healthReportSummary: result.detailedAnalysis.summary
        });
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast({ title: "Error", description: "Failed to generate report. Please try again.", variant: "destructive" });
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
    manualFormReset(); 
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
    }
    setIsChatLoading(false);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !report) return;

    const userMessage: ChatMessage = { role: "user", content: chatInput };
    const newChatHistory = [...chatHistory, userMessage];
    setChatHistory(newChatHistory);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const chatContextInput: ContextAwareAIChatInput = {
        userQuestion: userMessage.content,
        chatHistory: chatHistory.slice(-5), 
        contextType: "labelAnalysis",
        labelContext: {
          productName: report.productType || getManualFormValues("productName") || "N/A",
          ingredients: getManualFormValues("ingredients") || "Ingredients extracted from image scan.",
          healthReportSummary: `Overall Rating: ${report.healthRating}/5. Summary: ${report.detailedAnalysis.summary}.`,
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
        productNameContext={getManualFormValues("productName")}
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
      const safeProductName = (report.productType || getManualFormValues("productName") || 'food-label').replace(/[^a-z0-9]/gi, '_').toLowerCase();
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

    const lines = text.split('\n').map(line => line.trim()).filter(line => line !== "");
    if (lines.length === 0) return null;

    const hasBullets = lines.some(line => line.startsWith('* ') || line.startsWith('- '));

    if (hasBullets) {
        return (
            <ul className="list-none space-y-1.5 text-sm leading-relaxed">
                {lines.map((line, index) => (
                    <li key={index} className="flex items-start">
                        <span className="mr-2.5 mt-1 text-primary">&#8226;</span>
                        <span>{line.replace(/^(\*|-)\s*/, '')}</span>
                    </li>
                ))}
            </ul>
        );
    } else {
        return (
            <div className="text-sm leading-relaxed space-y-1.5">
                {lines.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
        );
    }
};


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="shadow-lg hover:shadow-xl transition-shadow rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary"><UploadCloud className="mr-2 h-7 w-7" /> Input Food Label Data</CardTitle>
          <CardDescription>Upload an image of the food label or enter details manually for AI analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="image-upload-main" className="font-semibold text-foreground/90 block mb-1">Upload Label Image</Label>
             <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Label
                  htmlFor="image-upload"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "cursor-pointer flex-grow w-full sm:w-auto justify-center truncate text-sm"
                  )}
                >
                  <UploadCloud className="mr-2 h-4 w-4" />
                  <span className="truncate max-w-[150px] sm:max-w-xs">
                     {imageFile ? imageFile.name : "Choose File"}
                  </span>
                </Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                />
                <Button
                  type="button"
                  onClick={onImageSubmit}
                  disabled={isLoading || !imageFile}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-base py-2.5 w-full sm:w-auto shrink-0"
                >
                  {isProcessingImage ? <Sparkles className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                  Analyze Image
                </Button>
              </div>
            {uploadedImage && (
              <div className="mt-4 relative border border-border rounded-lg p-2 shadow-inner bg-muted/30">
                <Image src={uploadedImage} alt="Uploaded label" width={300} height={200} className="rounded-md object-contain mx-auto" data-ai-hint="food label"/>
                <Button onClick={() => { setUploadedImage(null); setImageFile(null); }} variant="ghost" size="sm" className="absolute top-1 right-1 text-xs hover:bg-destructive/10 hover:text-destructive">Clear</Button>
              </div>
            )}
          </div>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-border"></div><span className="mx-4 text-sm text-muted-foreground font-medium">OR</span><div className="flex-grow border-t border-border"></div>
          </div>

          <Form {...formMethods}>
            <form onSubmit={handleSubmit(onManualSubmit)} className="space-y-5">
              <FormField control={control} name="productName" render={({ field }) => (
                <FormItem><HookFormLabel className="font-semibold text-foreground/90">Product Name (Optional)</HookFormLabel><FormControl><Input placeholder="e.g., Instant Noodles, Whole Wheat Biscuits" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={control} name="ingredients" render={({ field }) => (
                <FormItem><HookFormLabel className="font-semibold text-foreground/90">Ingredients List</HookFormLabel><FormControl><Textarea placeholder="e.g., Wheat flour, Palm oil, Salt, Sugar, Spices..." {...field} rows={4}/></FormControl><FormDescription>Enter ingredients separated by commas.</FormDescription><FormMessage /></FormItem>
              )} />
              <FormField control={control} name="nutritionFacts" render={({ field }) => (
                <FormItem><HookFormLabel className="font-semibold text-foreground/90">Nutrition Facts (Optional)</HookFormLabel><FormControl><Textarea placeholder="e.g., Energy: 450kcal per 100g, Protein: 8g, Fat: 20g..." {...field} rows={3}/></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base py-2.5">
                 {isProcessingManually ? <Sparkles className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                Analyze Manually
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && !report && (
        <Card className="lg:col-span-1 flex items-center justify-center h-full min-h-[300px] rounded-xl shadow-lg bg-card">
            <div className="text-center p-6">
                <Sparkles className="mx-auto h-16 w-16 text-primary animate-pulse mb-5" />
                <p className="text-xl font-semibold text-primary">Generating AI Report...</p>
                <p className="text-sm text-muted-foreground mt-2">Our AI is carefully analyzing the data. This may take a few moments, especially for images. Please wait.</p>
            </div>
        </Card>
      )}

      {report && (
        <Card className="shadow-xl hover:shadow-2xl transition-shadow rounded-xl">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center text-2xl text-primary"><FileText className="mr-2 h-7 w-7" /> AI Health Report</CardTitle>
                {report.productType && (<CardDescription className="mt-1">Product Type: <span className="font-semibold text-foreground">{report.productType}</span></CardDescription>)}
              </div>
              <Button onClick={handleDownloadReport} variant="outline" size="sm" disabled={isPdfDownloading} className="ml-auto hover:bg-primary/5 hover:text-primary">
                {isPdfDownloading ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />} Download PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Alert variant="default" className="bg-muted/50 rounded-lg border-primary/30">
                <HeartPulse className="h-5 w-5 text-red-500" />
                <AlertTitle className="font-semibold text-primary">Overall Health Rating</AlertTitle>
                <AlertDescription className="flex items-center gap-1 flex-wrap">
                    <StarRating rating={report.healthRating} size={22} /> 
                    <span className="text-sm">({report.healthRating}/5 Stars). <i className="text-xs text-muted-foreground">Higher stars = better health.</i></span>
                </AlertDescription>
              </Alert>
               {report.processingLevelRating?.rating !== undefined && (
                <Alert variant="default" className="bg-muted/50 rounded-lg border-border">
                    <Zap className="h-5 w-5 text-purple-500" />
                    <AlertTitle className="font-semibold text-purple-600 dark:text-purple-400">Processing Level</AlertTitle>
                    <AlertDescription className="flex items-center gap-1 flex-wrap">
                        <StarRating rating={report.processingLevelRating.rating} size={22}/> 
                        <span className="text-sm">({report.processingLevelRating.rating}/5). <i className="text-xs text-muted-foreground">Generally, less processed (fewer stars) is better.</i></span>
                    </AlertDescription>
                    {report.processingLevelRating.justification && <p className="text-xs text-muted-foreground mt-1 pl-7">{report.processingLevelRating.justification}</p>}
                </Alert>
               )}
               {report.sugarContentRating?.rating !== undefined && (
                <Alert variant="default" className="bg-muted/50 rounded-lg border-border">
                    <Wheat className="h-5 w-5 text-amber-600" /> 
                    <AlertTitle className="font-semibold text-amber-700 dark:text-amber-500">Sugar Content</AlertTitle>
                    <AlertDescription className="flex items-center gap-1 flex-wrap">
                        <StarRating rating={report.sugarContentRating.rating} size={22}/> 
                        <span className="text-sm">({report.sugarContentRating.rating}/5). <i className="text-xs text-muted-foreground">Generally, lower sugar (fewer stars) is better.</i></span>
                    </AlertDescription>
                    {report.sugarContentRating.justification && <p className="text-xs text-muted-foreground mt-1 pl-7">{report.sugarContentRating.justification}</p>}
                </Alert>
               )}
               {report.nutrientDensityRating?.rating !== undefined && (
                <Alert variant="default" className="bg-muted/50 rounded-lg border-border">
                    <Sparkles className="h-5 w-5 text-green-500" />
                    <AlertTitle className="font-semibold text-green-600 dark:text-green-400">Nutrient Density</AlertTitle>
                    <AlertDescription className="flex items-center gap-1 flex-wrap">
                        <StarRating rating={report.nutrientDensityRating.rating} size={22}/> 
                        <span className="text-sm">({report.nutrientDensityRating.rating}/5). <i className="text-xs text-muted-foreground">Higher stars = more nutrient dense.</i></span>
                    </AlertDescription>
                    {report.nutrientDensityRating.justification && <p className="text-xs text-muted-foreground mt-1 pl-7">{report.nutrientDensityRating.justification}</p>}
                </Alert>
               )}
            </div>
            <Separator />
            <Alert variant="default" className="bg-card rounded-lg border-border shadow-sm">
                <Info className="h-5 w-5 text-accent" />
                 <AlertTitle className="font-semibold text-lg mb-1.5 text-accent-foreground">Summary:</AlertTitle>
                <AlertDescription className="text-foreground/80">{renderFormattedText(report.detailedAnalysis.summary)}</AlertDescription>
            </Alert>
            
            {renderFormattedText(report.detailedAnalysis.positiveAspects) && (
                <Alert variant="default" className="bg-green-50 dark:bg-green-900/30 border-green-500/30 rounded-lg shadow-sm">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <AlertTitle className="font-semibold text-lg mb-1.5 text-green-700 dark:text-green-300">Positive Aspects:</AlertTitle>
                    <AlertDescription className="text-green-800 dark:text-green-300/90">{renderFormattedText(report.detailedAnalysis.positiveAspects)}</AlertDescription>
                </Alert>
            )}
            
            {renderFormattedText(report.detailedAnalysis.potentialConcerns) && (
                <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/30 border-red-500/40 rounded-lg shadow-sm">
                    <AlertOctagon className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <AlertTitle className="font-semibold text-lg mb-1.5 text-red-700 dark:text-red-300">Potential Concerns:</AlertTitle>
                    <AlertDescription className="text-red-800 dark:text-red-300/90">{renderFormattedText(report.detailedAnalysis.potentialConcerns)}</AlertDescription>
                </Alert>
            )}
            
            {renderFormattedText(report.detailedAnalysis.keyNutrientsBreakdown) && (
                 <Alert variant="default" className="bg-card rounded-lg border-border shadow-sm">
                    <Info className="h-5 w-5 text-accent" />
                    <AlertTitle className="font-semibold text-lg mb-1.5 text-accent-foreground">Key Nutrients Breakdown:</AlertTitle>
                    <AlertDescription className="text-foreground/80">{renderFormattedText(report.detailedAnalysis.keyNutrientsBreakdown)}</AlertDescription>
                </Alert>
            )}

            {renderFormattedText(report.alternatives) && (
                <Alert variant="default" className="bg-sky-50 dark:bg-sky-900/30 border-sky-500/30 rounded-lg shadow-sm">
                    <GitFork className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                    <AlertTitle className="font-semibold text-lg mb-1.5 text-sky-700 dark:text-sky-300">Healthier Indian Alternatives:</AlertTitle>
                    <AlertDescription className="text-sky-800 dark:text-sky-300/90">{renderFormattedText(report.alternatives)}</AlertDescription>
                </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-start pt-5 border-t border-border">
            <h3 className="font-semibold text-xl mb-2 flex items-center text-primary"><MessageCircle className="mr-2 h-5 w-5"/> Chat with AI Advisor</h3>
            <p className="text-sm text-muted-foreground mb-4">Ask questions about this report. For example: "Can kids eat this daily?" or "Suggest a low-sodium alternative."</p>
            <ScrollArea className="h-[220px] w-full rounded-md border border-border bg-muted/40 p-3 mb-4 shadow-inner" ref={chatScrollAreaRef}>
              {chatHistory.map((msg, index) => (
                <div key={index} className={`mb-2.5 p-3 rounded-lg text-sm shadow-sm max-w-[90%] break-words ${msg.role === 'user' ? 'bg-primary text-primary-foreground ml-auto rounded-br-none' : 'bg-accent text-accent-foreground mr-auto rounded-bl-none'}`}>
                  <span className="font-semibold capitalize block mb-0.5">{msg.role === 'user' ? 'You' : 'AI Advisor'}:</span>{msg.content}
                </div>
              ))}
               {isChatLoading && <div className="text-sm text-muted-foreground p-2.5 flex items-center"><Sparkles className="h-4 w-4 mr-2 animate-pulse" /> AI Advisor is typing...</div>}
            </ScrollArea>
            <form onSubmit={handleChatSubmit} className="w-full flex gap-2">
              <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask a question..." disabled={isChatLoading || !report} className="bg-background flex-grow" />
              <Button type="submit" disabled={isChatLoading || !chatInput.trim() || !report} className="bg-primary hover:bg-primary/90 text-primary-foreground"><Send className="h-4 w-4" /></Button>
            </form>
          </CardFooter>
        </Card>
      )}
       {!isLoading && !report && (
        <Card className="lg:col-span-1 flex items-center justify-center h-full min-h-[300px] bg-muted/20 rounded-xl border-2 border-dashed border-border">
            <div className="text-center p-8"><Sparkles className="mx-auto h-16 w-16 text-muted-foreground/70 mb-5" /><p className="text-xl font-semibold text-muted-foreground">Your AI report will appear here.</p><p className="text-sm text-muted-foreground/80 mt-1">Submit a food label to get started.</p></div>
        </Card>
      )}
    </div>
  );
}
