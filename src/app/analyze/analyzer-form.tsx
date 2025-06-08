
"use client";

import type { GenerateHealthReportInput, GenerateHealthReportOutput } from "@/ai/flows/generate-health-report";
import { generateHealthReport } from "@/ai/flows/generate-health-report";
import type { ContextAwareAIChatInput, ContextAwareAIChatOutput, ChatMessage } from "@/ai/flows/context-aware-ai-chat"; // Updated import
import { contextAwareAIChat } from "@/ai/flows/context-aware-ai-chat";

import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, Sparkles, MessageCircle, Send, Download, Zap, HeartPulse, Wheat } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react"; // Added useEffect
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);

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

  const generateReportSharedLogic = async (input: GenerateHealthReportInput) => {
    setIsLoading(true);
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
  };

  const onManualSubmit: SubmitHandler<ManualInputFormValues> = async (data) => {
    if (imageFile) {
        // Clear image if manual submission is chosen to avoid confusion
        // Or inform user image is ignored
        setImageFile(null);
        setUploadedImage(null);
        toast({ title: "Manual Submission", description: "Analyzing manually entered data. Uploaded image was cleared." });
    }
    await generateReportSharedLogic({
      productName: data.productName,
      ingredients: data.ingredients,
      nutritionFacts: data.nutritionFacts,
    });
  };

  const onImageSubmit = async () => {
    if (!imageFile) {
      toast({ title: "No Image", description: "Please upload an image first.", variant: "destructive" });
      return;
    }
    manualForm.reset(); // Clear manual form fields/errors if image is submitted
    const photoDataUri = await fileToDataUri(imageFile);
    await generateReportSharedLogic({ photoDataUri });
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
          productName: report.productType || manualForm.getValues("productName") || "N/A",
          ingredients: manualForm.getValues("ingredients") || "Ingredients extracted from image scan.",
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
    tempDiv.id = 'pdf-render-source-analyzer-form'; 
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
      root.unmount(); document.body.removeChild(tempDiv); setIsPdfDownloading(false);
    }
  };

  const renderFormattedText = (text?: string): JSX.Element | null => {
    if (!text || text.trim() === "") return null;
    const lines = text.split('\n').filter(s => s.trim() !== "");
    const hasBullets = lines.some(line => line.trim().match(/^(\*|-)\s/));

    if (hasBullets) {
        return (
            <ul className="list-disc list-inside space-y-1 text-sm leading-relaxed">
                {lines.map((line, index) => (
                    <li key={index}>{line.replace(/^(\*|-)\s*/, '').trim()}</li>
                ))}
            </ul>
        );
    } else if (lines.length > 0) {
        return (
            <div className="text-sm leading-relaxed space-y-1">
                {lines.map((paragraph, index) => (
                    <p key={index}>{paragraph.trim()}</p>
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
              {isLoading && !manualForm.formState.isSubmitting && imageFile ? "Analyzing Image..." : "Analyze Image"} <Sparkles className="ml-2 h-4 w-4" />
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
              <Button type="submit" disabled={isLoading || manualForm.formState.isSubmitting} className="w-full">
                {isLoading && manualForm.formState.isSubmitting ? "Analyzing Manually..." : "Analyze Manually"} <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && !report && (
        <Card className="lg:col-span-1 flex items-center justify-center h-full min-h-[300px]">
            <div className="text-center"><Sparkles className="mx-auto h-12 w-12 text-primary animate-spin mb-4" /><p className="text-lg font-semibold">Generating AI Report...</p><p className="text-sm text-muted-foreground">Please wait a moment.</p></div>
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
              <Alert variant="default" className="bg-muted/60"><HeartPulse className="h-5 w-5 text-red-500" /><AlertTitle className="font-semibold">Overall Health Rating</AlertTitle><AlertDescription className="flex items-center gap-2"><StarRating rating={report.healthRating} /> ({report.healthRating}/5)</AlertDescription></Alert>
               {report.processingLevelRating?.rating && (<Alert variant="default" className="bg-muted/60"><Zap className="h-5 w-5 text-purple-500" /><AlertTitle className="font-semibold">Processing Level</AlertTitle><AlertDescription className="flex items-center gap-2"><StarRating rating={report.processingLevelRating.rating} /> ({report.processingLevelRating.rating}/5)</AlertDescription>{report.processingLevelRating.justification && <p className="text-xs text-muted-foreground mt-1">{report.processingLevelRating.justification}</p>}</Alert>)}
               {report.sugarContentRating?.rating && (<Alert variant="default" className="bg-muted/60"><Wheat className="h-5 w-5 text-amber-600" /> <AlertTitle className="font-semibold">Sugar Content</AlertTitle><AlertDescription className="flex items-center gap-2"><StarRating rating={report.sugarContentRating.rating} /> ({report.sugarContentRating.rating}/5)</AlertDescription>{report.sugarContentRating.justification && <p className="text-xs text-muted-foreground mt-1">{report.sugarContentRating.justification}</p>}</Alert>)}
               {report.nutrientDensityRating?.rating && (<Alert variant="default" className="bg-muted/60"><Sparkles className="h-5 w-5 text-green-500" /><AlertTitle className="font-semibold">Nutrient Density</AlertTitle><AlertDescription className="flex items-center gap-2"><StarRating rating={report.nutrientDensityRating.rating} /> ({report.nutrientDensityRating.rating}/5)</AlertDescription>{report.nutrientDensityRating.justification && <p className="text-xs text-muted-foreground mt-1">{report.nutrientDensityRating.justification}</p>}</Alert>)}
            </div>
            <Separator />
            <div><h3 className="font-semibold text-lg mb-1">Summary:</h3><Alert variant="default" className="bg-background"><Sparkles className="h-4 w-4 text-primary" /><AlertDescription>{renderFormattedText(report.detailedAnalysis.summary)}</AlertDescription></Alert></div>
            {report.detailedAnalysis.positiveAspects && (<div><h3 className="font-semibold text-lg mb-1">Positive Aspects:</h3><Alert variant="default" className="bg-background"><Sparkles className="h-4 w-4 text-primary" /><AlertDescription>{renderFormattedText(report.detailedAnalysis.positiveAspects)}</AlertDescription></Alert></div>)}
            {report.detailedAnalysis.potentialConcerns && (<div><h3 className="font-semibold text-lg mb-1">Potential Concerns:</h3><Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700"><Sparkles className="h-4 w-4 text-red-500 dark:text-red-400" /><AlertDescription className="text-red-700 dark:text-red-300">{renderFormattedText(report.detailedAnalysis.potentialConcerns)}</AlertDescription></Alert></div>)}
            {report.detailedAnalysis.keyNutrientsBreakdown && (<div><h3 className="font-semibold text-lg mb-1">Key Nutrients Breakdown:</h3><Alert variant="default" className="bg-background"><Sparkles className="h-4 w-4 text-primary" /><AlertDescription>{renderFormattedText(report.detailedAnalysis.keyNutrientsBreakdown)}</AlertDescription></Alert></div>)}
            {report.alternatives && (<div><h3 className="font-semibold text-lg mb-1">Healthier Indian Alternatives:</h3><Alert variant="default" className="bg-background"><Sparkles className="h-4 w-4 text-primary" /><AlertDescription>{renderFormattedText(report.alternatives)}</AlertDescription></Alert></div>)}
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
    </div>
  );
}
