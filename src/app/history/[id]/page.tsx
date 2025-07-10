

"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { LoaderCircle, FileText, ArrowLeft, MessageCircle, Send } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

// Re-using the display logic by copying it into viewer components
import { LabelReportDisplay } from "@/components/common/LabelReportDisplay";
import { RecipeDisplay } from "@/components/common/RecipeDisplay";
import { NutritionReportDisplay } from "@/components/common/NutritionReportDisplay";

import { contextAwareAIChat } from "@/ai/flows/context-aware-ai-chat";
import type { GenerateHealthReportOutput } from "@/ai/flows/generate-health-report";
import type { GetDetailedRecipeOutput } from "@/ai/flows/get-detailed-recipe";
import type { AnalyzeNutritionOutput } from "@/ai/flows/nutrition-analysis";
import type { ContextAwareAIChatInput, ChatMessage } from "@/ai/flows/context-aware-ai-chat";
import { getReportById, type Report } from "@/services/reportService";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";


export default function IndividualHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [report, setReport] = useState<Report<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const getChatContext = (report: Report<any>): Omit<ContextAwareAIChatInput, 'userQuestion' | 'chatHistory'> => {
    switch (report.type) {
      case 'label':
        const labelData = report.data as GenerateHealthReportOutput;
        return {
          contextType: "labelAnalysis",
          labelContext: {
            productName: labelData.productType || report.userInput.productName || "the product",
            ingredients: report.userInput.ingredients || (report.userInput.photoDataUri ? "from scanned image" : "N/A"),
            healthReportSummary: labelData.summary,
          },
        };
      case 'recipe':
        const recipeData = report.data as GetDetailedRecipeOutput;
        return {
          contextType: "recipe",
          recipeContext: {
            dishName: recipeData.recipeTitle,
            recipeIngredients: recipeData.adjustedIngredients.map(i => `${i.quantity} ${i.name}`).join(', '),
            recipeInstructions: recipeData.instructions.join('; '),
            currentRecipeHealthNotes: recipeData.healthNotes,
          },
        };
      case 'nutrition':
        const nutritionData = report.data as AnalyzeNutritionOutput;
        return {
          contextType: "nutritionAnalysis",
          nutritionContext: {
            nutritionReportSummary: nutritionData.overallAnalysis,
            foodItemDescription: report.userInput.foodItemDescription || (report.userInput.nutritionDataUri ? "Scanned food item" : "Manually entered data"),
          },
        };
      default:
        return { contextType: "general", generalContext: { topic: "General query about a saved report." } };
    }
  };

  const initiateChatWithWelcome = async (reportToInit: Report<any>) => {
    setIsChatLoading(true);
    setChatHistory([]);
    const context = getChatContext(reportToInit);
    const input: ContextAwareAIChatInput = {
      ...context,
      userQuestion: "INIT_CHAT_WELCOME",
    };
    try {
      const aiResponse = await contextAwareAIChat(input);
      setChatHistory([{ role: "assistant", content: aiResponse.answer }]);
    } catch (error: any) {
      console.error("Chat init error:", error);
      toast({ title: "Chat Error", description: "Could not initialize AI chat.", variant: "destructive" });
      setChatHistory([{ role: "assistant", content: "Hello! How can I assist you with this report?" }]);
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
      const context = getChatContext(report);
      const chatContextInput: ContextAwareAIChatInput = {
        ...context,
        userQuestion: userMessage.content,
        chatHistory: chatHistory.slice(-5),
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

  useEffect(() => {
    if (!id) return;
    
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
        if (authUser) {
            try {
                const foundReport = await getReportById(id);
                if (foundReport) {
                    // Authorization check: does this report's UID match the logged-in user's UID?
                    if (foundReport.uid === authUser.uid) {
                         setReport(foundReport);
                         initiateChatWithWelcome(foundReport);
                    } else {
                         setError("You do not have permission to view this report.");
                    }
                } else {
                    setError("Report not found. It may have been deleted or the link is incorrect.");
                }
            } catch (e) {
                console.error("Failed to load report from Firestore:", e);
                setError("An error occurred while trying to load the report.");
            } finally {
                setIsLoading(false);
            }
        } else {
            router.replace('/login');
        }
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, router]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatHistory.length > 1) {
      scrollToBottom();
    }
  }, [chatHistory]);

  const renderReport = () => {
    if (!report) return null;
    
    switch (report.type) {
      case 'label':
        return <LabelReportDisplay report={report.data as GenerateHealthReportOutput} />;
      case 'recipe':
        return <RecipeDisplay recipe={report.data as GetDetailedRecipeOutput} />;
      case 'nutrition':
        return <NutritionReportDisplay analysisResult={report.data as AnalyzeNutritionOutput} userInput={report.userInput} />;
      default:
        return <p>Unknown report type.</p>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <LoaderCircle className="w-16 h-16 text-accent animate-spin mb-4" />
        <h1 className="text-2xl font-bold">Loading Report...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
        <FileText className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive">Error Loading Report</h1>
        <p className="mt-2 text-lg text-muted-foreground">{error}</p>
        <Button asChild className="mt-8">
          <Link href="/history">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="mb-6">
            <Button asChild variant="outline">
                <Link href="/history">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to All History
                </Link>
            </Button>
        </div>
        {renderReport()}

        {report && (
           <Card>
              <CardHeader>
                  <CardTitle className="font-semibold text-xl flex items-center"><MessageCircle className="mr-2 h-5 w-5" /> Chat with AI Advisor</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground pt-1">Ask follow-up questions about this saved report.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[250px] w-full rounded-md border p-3 mb-4 bg-muted/50">
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
        )}
      </div>
    </div>
  );
}

    
