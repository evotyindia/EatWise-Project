
"use client";

import type { GenerateHealthReportInput, GenerateHealthReportOutput } from "@/ai/flows/generate-health-report";
import { generateHealthReport } from "@/ai/flows/generate-health-report";
import type { ContextAwareAIChatInput, ContextAwareAIChatOutput, ChatMessage } from "@/ai/flows/context-aware-ai-chat";
import { contextAwareAIChat } from "@/ai/flows/context-aware-ai-chat";

import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, Sparkles, MessageCircle, Send, Zap, HeartPulse, Wheat, Info, FileText, Microscope, ShieldCheck, ShieldAlert, ClipboardList, UserCheck, Lightbulb, CookingPot } from "lucide-react";
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
import { StarRating } from "@/components/common/star-rating";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatHistory.length > 1) {
      scrollToBottom();
    }
  }, [chatHistory]);

  const renderFormattedText = (text?: string): JSX.Element | null => {
    if (!text || text.trim() === "" || text.trim().toLowerCase() === "n/a" || text.trim().toLowerCase().includes("no significant")) return null;

    const lines = text.split('\n').map(line => line.trim()).filter(line => line !== "");
    if (lines.length === 0) return null;

    return (
      <ul className="space-y-1.5 text-sm leading-relaxed">
        {lines.map((line, index) => {
          const content = line.replace(/^(\*|-)\s*/, '');
          if (!content) return null;
          return (
            <li key={index} className="flex items-start">
              <span className="mr-3 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              <span className="break-words">{content}</span>
            </li>
          );
        })}
      </ul>
    );
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
                    <AlertTitle className="font-semibold">Overall Health Rating</AlertTitle>
                    <AlertDescription>
                      <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-2">
                          <div className="flex items-center gap-2">
                              <StarRating rating={report.healthRating} variant="good" />
                              <span className="font-medium text-sm">({report.healthRating}/5)</span>
                          </div>
                          <span className="text-xs text-muted-foreground ml-auto">(Higher is better)</span>
                      </div>
                    </AlertDescription>
                  </Alert>

                  {report.processingLevelRating?.rating !== undefined && (
                    <Alert variant="default" className="bg-muted/60">
                      <Zap className="h-5 w-5 text-accent" />
                      <AlertTitle className="font-semibold">Processing Level</AlertTitle>
                      <AlertDescription>
                        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-2">
                            <div className="flex items-center gap-2">
                                <StarRating rating={report.processingLevelRating.rating} variant="bad" />
                                <span className="font-medium text-sm">({report.processingLevelRating.rating}/5)</span>
                            </div>
                            <span className="text-xs text-muted-foreground ml-auto">(Lower is better)</span>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {report.sugarContentRating?.rating !== undefined && (
                    <Alert variant="default" className="bg-muted/60">
                      <Wheat className="h-5 w-5 text-accent" />
                      <AlertTitle className="font-semibold">Sugar Content</AlertTitle>
                      <AlertDescription>
                        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-2">
                            <div className="flex items-center gap-2">
                                <StarRating rating={report.sugarContentRating.rating} variant="bad" />
                                <span className="font-medium text-sm">({report.sugarContentRating.rating}/5)</span>
                            </div>
                            <span className="text-xs text-muted-foreground ml-auto">(Lower is better)</span>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {report.nutrientDensityRating?.rating !== undefined && (
                    <Alert variant="default" className="bg-muted/60">
                      <Sparkles className="h-5 w-5 text-accent" />
                       <AlertTitle className="font-semibold">Nutrient Density</AlertTitle>
                       <AlertDescription>
                          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-2">
                              <div className="flex items-center gap-2">
                                  <StarRating rating={report.nutrientDensityRating.rating} variant="good" />
                                  <span className="font-medium text-sm">({report.nutrientDensityRating.rating}/5)</span>
                              </div>
                              <span className="text-xs text-muted-foreground ml-auto">(Higher is better)</span>
                          </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                <Separator />

                <Alert variant="default" className="bg-background/30">
                  <AlertTitle className="font-semibold text-lg mb-1 flex items-center">
                    <Info className="h-5 w-5 mr-2 text-primary" />
                    <span>Summary</span>
                  </AlertTitle>
                  <AlertDescription className="pl-7">{report.summary}</AlertDescription>
                </Alert>

                {renderFormattedText(report.greenFlags) && (
                  <Alert variant="success">
                    <AlertTitle className="font-semibold text-lg mb-1 flex items-center">
                      <ShieldCheck className="h-5 w-5 mr-2" />
                      <span>Green Flags</span>
                    </AlertTitle>
                    <AlertDescription className="pl-7">
                      {renderFormattedText(report.greenFlags)}
                    </AlertDescription>
                  </Alert>
                )}

                {renderFormattedText(report.redFlags) && (
                  <Alert variant="destructive">
                    <AlertTitle className="font-semibold text-lg mb-1 flex items-center">
                      <ShieldAlert className="h-5 w-5 mr-2" />
                      <span>Red Flags</span>
                    </AlertTitle>
                    <AlertDescription className="pl-7">
                      {renderFormattedText(report.redFlags)}
                    </AlertDescription>
                  </Alert>
                )}

                <Accordion type="single" collapsible className="w-full">
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
                  <AlertTitle className="font-semibold text-lg mb-1 flex items-center">
                    <UserCheck className="h-5 w-5 mr-2 text-primary" />
                    <span>Best Suited For</span>
                  </AlertTitle>
                  <AlertDescription className="pl-7">{report.bestSuitedFor}</AlertDescription>
                </Alert>

                {renderFormattedText(report.consumptionTips) && (
                    <Alert variant="default" className="bg-secondary/70">
                      <AlertTitle className="font-semibold text-lg mb-1 flex items-center">
                        <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                        <span>Healthy Consumption Tips</span>
                      </AlertTitle>
                      <AlertDescription className="pl-7">{renderFormattedText(report.consumptionTips)}</AlertDescription>
                    </Alert>
                )}

                <Alert variant="default" className="bg-secondary/70">
                  <AlertTitle className="font-semibold text-lg mb-1 flex items-center">
                    <CookingPot className="h-5 w-5 mr-2 text-primary" />
                    <span>Role in an Indian Diet</span>
                  </AlertTitle>
                  <AlertDescription className="pl-7">{report.indianDietContext}</AlertDescription>
                </Alert>

                {renderFormattedText(report.healthierAlternatives) && (
                  <Alert variant="default" className="bg-secondary">
                    <AlertTitle className="font-semibold text-lg mb-1 flex items-center">
                      <Info className="h-5 w-5 mr-2 text-primary" />
                      <span>Healthier Indian Alternatives</span>
                    </AlertTitle>
                    <AlertDescription className="pl-7">{renderFormattedText(report.healthierAlternatives)}</AlertDescription>
                  </Alert>
                )}

                {report.ingredientDeepDive && report.ingredientDeepDive.length > 0 && (
                  <div className="w-full pt-2">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Microscope className="mr-2 h-5 w-5 text-primary" />
                      <span>Ingredient Deep Dive</span>
                    </h3>
                    <div className="rounded-lg border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-1/4">Ingredient</TableHead>
                            <TableHead className="w-1/5">Risk Level</TableHead>
                            <TableHead>Explanation</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {report.ingredientDeepDive.map((item, index) => {
                            const riskColorClass = {
                              'High': 'text-destructive',
                              'Medium': 'text-orange-500 dark:text-orange-400',
                              'Low': 'text-success',
                              'Neutral': 'text-muted-foreground',
                            }[item.riskLevel] || 'text-muted-foreground';

                            return (
                              <TableRow key={index} className="bg-background">
                                <TableCell className="font-semibold">{item.ingredientName}</TableCell>
                                <TableCell className={cn("font-bold", riskColorClass)}>
                                  {item.riskLevel}
                                </TableCell>
                                <TableCell>
                                  <p className="text-sm font-medium">{item.description}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {item.riskReason}
                                  </p>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
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
      </div>
    </div>
  );
}
