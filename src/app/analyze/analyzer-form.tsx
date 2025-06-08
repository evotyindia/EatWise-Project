
"use client";

import type { GenerateHealthReportInput, GenerateHealthReportOutput } from "@/ai/flows/generate-health-report";
import { generateHealthReport } from "@/ai/flows/generate-health-report";
import type { ContextAwareAIChatInput, ContextAwareAIChatOutput } from "@/ai/flows/context-aware-ai-chat";
import { contextAwareAIChat } from "@/ai/flows/context-aware-ai-chat";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, Sparkles, MessageCircle, Send, Download, Zap, HeartPulse, Wheat } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef } from "react";
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

export interface ChatMessage { // Exporting for PrintableReport
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
  const pdfSourceRef = useRef<HTMLDivElement | null>(null);


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
        ingredients: manualForm.getValues("ingredients") || "Ingredients extracted from image scan.",
        healthReport: `Overall Rating: ${report.healthRating}/5. Summary: ${report.detailedAnalysis.summary}. Positive Aspects: ${report.detailedAnalysis.positiveAspects || 'N/A'}. Potential Concerns: ${report.detailedAnalysis.potentialConcerns || 'N/A'}. Key Nutrients: ${report.detailedAnalysis.keyNutrientsBreakdown || 'N/A'}. Processing: ${report.processingLevelRating || 'N/A'}/5. Sugar: ${report.sugarContentRating || 'N/A'}/5. Nutrient Density: ${report.nutrientDensityRating || 'N/A'}/5.`,
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

  const handleDownloadReport = async () => {
    if (!report) return;
    setIsLoading(true);

    const tempDiv = document.createElement('div');
    tempDiv.id = 'pdf-render-source-analyzer';
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0px';
    tempDiv.style.width = '210mm'; // Standard A4 width for layout consistency
    tempDiv.style.backgroundColor = 'white'; // Ensure background for canvas capture
    document.body.appendChild(tempDiv);

    const root = createRoot(tempDiv);
    root.render(
      <PrintableHealthReport
        report={report}
        chatHistory={chatHistory}
        productNameContext={manualForm.getValues("productName")}
      />
    );

    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for rendering

    try {
      const canvas = await html2canvas(tempDiv, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        width: tempDiv.scrollWidth,
        height: tempDiv.scrollHeight,
        windowWidth: tempDiv.scrollWidth,
        windowHeight: tempDiv.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const canvasWidthMM = (canvas.width / 2) * 0.264583; // Convert px (at scale 2) to mm
      const canvasHeightMM = (canvas.height / 2) * 0.264583;

      const ratio = canvasWidthMM / canvasHeightMM;
      let imgActualHeight = pdfWidth / ratio;
      let imgActualWidth = pdfWidth;

      if (imgActualHeight < pdfHeight) { // Content fits on one page (scaled to width)
         imgActualHeight = canvasHeightMM < pdfHeight ? canvasHeightMM : pdfHeight; // Use actual height if smaller than page
         imgActualWidth = imgActualHeight * ratio;
      }


      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgActualWidth, imgActualHeight);

      let heightLeft = canvasHeightMM - imgActualHeight;


      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgActualWidth, canvasHeightMM); // Use full canvas height for subsequent pages source
        heightLeft -= pdfHeight;
      }

      // Add page numbers
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(100);
        pdf.text(`Page ${i} of ${pageCount}`, pdfWidth - 25, pdfHeight - 10, {align: 'right'});
      }


      const safeProductName = (report.productType || manualForm.getValues("productName") || 'food-label').replace(/[^a-z0-9]/gi, '_').toLowerCase();
      pdf.save(`${safeProductName}_health_report.pdf`);
      toast({ title: "Report Downloaded", description: "The PDF health report has been saved." });

    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({ title: "PDF Error", description: "Could not generate PDF report. " + (error as Error).message, variant: "destructive" });
    } finally {
      root.unmount();
      document.body.removeChild(tempDiv);
      setIsLoading(false);
    }
  };

  const renderFormattedText = (text?: string) => {
    if (!text) return null;
    return (
      <ul className="list-disc list-inside space-y-1 text-sm leading-relaxed">
        {text.split(/\s*[-\*]\s*/g).filter(s => s.trim()).map((item, index) => (
          <li key={index}>{item.trim()}</li>
        ))}
      </ul>
    );
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
              <Button type="submit" disabled={isLoading || manualForm.formState.isSubmitting} className="w-full">
                {isLoading && manualForm.formState.isSubmitting ? "Analyzing Manually..." : "Analyze Manually"}
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
       <div id="pdf-source-analyzer-wrapper" ref={pdfSourceRef} style={{ position: 'absolute', left: '-9999px', top: '0px', width: '210mm', backgroundColor: 'white' }}>
        {/* This div is used as a mount point for PDF rendering */}
      </div>


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
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center text-2xl">
                <Sparkles className="mr-2 h-6 w-6 text-accent" /> AI Health Report
              </CardTitle>
              <Button onClick={handleDownloadReport} variant="outline" size="sm" disabled={isLoading}>
                {isLoading ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                 Download PDF
              </Button>
            </div>
            {report.productType && (
              <CardDescription>Product Type: <span className="font-semibold">{report.productType}</span></CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Alert variant="default" className="bg-background">
                <HeartPulse className="h-5 w-5" />
                <AlertTitle className="font-semibold">Overall Health Rating</AlertTitle>
                <AlertDescription className="flex items-center gap-2">
                  <StarRating rating={report.healthRating} /> ({report.healthRating}/5)
                </AlertDescription>
              </Alert>
               {report.processingLevelRating && (
                 <Alert variant="default" className="bg-background">
                   <Zap className="h-5 w-5" />
                   <AlertTitle className="font-semibold">Processing Level</AlertTitle>
                   <AlertDescription className="flex items-center gap-2">
                     <StarRating rating={report.processingLevelRating} /> ({report.processingLevelRating}/5)
                   </AlertDescription>
                    <p className="text-xs text-muted-foreground mt-1">{report.detailedAnalysis.summary?.split('Processing Level Rating:')[1]?.split('Sugar Content Rating:')[0]?.trim()}</p>
                 </Alert>
               )}
               {report.sugarContentRating && (
                 <Alert variant="default" className="bg-background">
                    <Wheat className="h-5 w-5" /> {/* Placeholder for sugar icon */}
                    <AlertTitle className="font-semibold">Sugar Content</AlertTitle>
                   <AlertDescription className="flex items-center gap-2">
                     <StarRating rating={report.sugarContentRating} /> ({report.sugarContentRating}/5)
                   </AlertDescription>
                    <p className="text-xs text-muted-foreground mt-1">{report.detailedAnalysis.summary?.split('Sugar Content Rating:')[1]?.split('Nutrient Density Rating:')[0]?.trim()}</p>
                 </Alert>
               )}
               {report.nutrientDensityRating && (
                 <Alert variant="default" className="bg-background">
                   <Sparkles className="h-5 w-5" />
                   <AlertTitle className="font-semibold">Nutrient Density</AlertTitle>
                   <AlertDescription className="flex items-center gap-2">
                     <StarRating rating={report.nutrientDensityRating} /> ({report.nutrientDensityRating}/5)
                   </AlertDescription>
                    <p className="text-xs text-muted-foreground mt-1">{report.detailedAnalysis.summary?.split('Nutrient Density Rating:')[1]?.trim()}</p>
                 </Alert>
               )}
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-1">Summary:</h3>
              <Alert variant="default" className="bg-background">
                <Sparkles className="h-4 w-4" />
                <AlertDescription>
                  {renderFormattedText(report.detailedAnalysis.summary)}
                </AlertDescription>
              </Alert>
            </div>

            {report.detailedAnalysis.positiveAspects && (
               <div>
                <h3 className="font-semibold text-lg mb-1">Positive Aspects:</h3>
                 <Alert variant="default" className="bg-background">
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                     {renderFormattedText(report.detailedAnalysis.positiveAspects)}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {report.detailedAnalysis.potentialConcerns && (
               <div>
                <h3 className="font-semibold text-lg mb-1">Potential Concerns:</h3>
                 <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
                  <Sparkles className="h-4 w-4 text-red-500 dark:text-red-400" />
                  <AlertDescription className="text-red-700 dark:text-red-300">
                     {renderFormattedText(report.detailedAnalysis.potentialConcerns)}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {report.detailedAnalysis.keyNutrientsBreakdown && (
               <div>
                <h3 className="font-semibold text-lg mb-1">Key Nutrients Breakdown:</h3>
                 <Alert variant="default" className="bg-background">
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                    {renderFormattedText(report.detailedAnalysis.keyNutrientsBreakdown)}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {report.alternatives && (
               <div>
                <h3 className="font-semibold text-lg mb-1">Healthier Indian Alternatives:</h3>
                 <Alert variant="default" className="bg-background">
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                     {renderFormattedText(report.alternatives)}
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <Separator className="my-4"/>
            <h3 className="font-semibold text-xl mb-2 flex items-center"><MessageCircle className="mr-2 h-5 w-5"/> Chat with AI</h3>
            <p className="text-sm text-muted-foreground mb-4">Ask questions about this report. For example: "Can kids eat this daily?"</p>
            <ScrollArea className="h-[200px] w-full rounded-md border p-3 mb-4 bg-muted">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`mb-2 p-2.5 rounded-lg text-sm shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-accent text-accent-foreground mr-auto'}`} style={{maxWidth: '80%'}}>
                  <span className="font-semibold capitalize">{msg.role === 'user' ? 'You' : 'AI Advisor'}: </span>{msg.content}
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
                className="bg-background"
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
