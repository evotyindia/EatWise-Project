
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { LoaderCircle, FileText, ArrowLeft, MessageCircle, Send, Globe, Share2, Copy, Check, Save as SaveIcon, AlertTriangle, CheckCircle2, Pencil } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounce";
import { LabelReportDisplay } from "@/components/common/LabelReportDisplay";
import { RecipeDisplay } from "@/components/common/RecipeDisplay";
import { NutritionReportDisplay } from "@/components/common/NutritionReportDisplay";
import { contextAwareAIChat } from "@/ai/flows/context-aware-ai-chat";
import type { GenerateHealthReportOutput } from "@/ai/flows/generate-health-report";
import type { GetDetailedRecipeOutput } from "@/ai/flows/get-detailed-recipe";
import type { AnalyzeNutritionOutput } from "@/ai/flows/nutrition-analysis";
import type { ContextAwareAIChatInput, ChatMessage } from "@/ai/flows/context-aware-ai-chat";
import { getReportById, updateReportPublicStatus, updateReportSlug, type Report, isSlugAvailableForUser, updateReportDetails } from "@/services/reportService";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function IndividualSavedItemPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [report, setReport] = useState<Report<any> | null>(null);
  const [currentUser, setCurrentUser] = useState<{ uid: string, username: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [editableSlug, setEditableSlug] = useState("");
  const debouncedSlug = useDebounce(editableSlug, 500);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugStatus, setSlugStatus] = useState<"idle" | "available" | "taken" | "invalid">("idle");
  const [isSavingSlug, setIsSavingSlug] = useState(false);

  // New state for editable report details
  const [editableTitle, setEditableTitle] = useState("");
  const [editableProductName, setEditableProductName] = useState("");
  const [isDetailsDirty, setIsDetailsDirty] = useState(false);
  const [isSavingDetails, setIsSavingDetails] = useState(false);

  // Effect to initialize editable fields and reset dirty state when report loads
  useEffect(() => {
    if (report) {
      setEditableTitle(report.title);
      setEditableProductName(report.userInput?.productName || report.userInput?.foodItemDescription || "");
      if (report.publicSlug) {
        setEditableSlug(report.publicSlug);
      }
      setIsDetailsDirty(false); // Reset dirty state on new report load
    }
  }, [report]);

  // Effect to check if details have changed
  useEffect(() => {
    if (!report) return;
    const titleChanged = editableTitle !== report.title;
    const productNameChanged = editableProductName !== (report.userInput?.productName || report.userInput?.foodItemDescription || "");
    setIsDetailsDirty(titleChanged || productNameChanged);
  }, [editableTitle, editableProductName, report]);


  useEffect(() => {
    const checkSlug = async () => {
      if (!currentUser || !report || debouncedSlug === report.publicSlug) {
        setSlugStatus("idle");
        return;
      }

      if (debouncedSlug.length < 3 || debouncedSlug.length > 15 || !/^[a-zA-Z0-9-]+$/.test(debouncedSlug)) {
        setSlugStatus("invalid");
        return;
      }

      setIsCheckingSlug(true);
      const available = await isSlugAvailableForUser(currentUser.uid, debouncedSlug, report.id);
      setSlugStatus(available ? "available" : "taken");
      setIsCheckingSlug(false);
    };
    checkSlug();
  }, [debouncedSlug, currentUser, report]);

  const handleDetailsSave = async () => {
    if (!report || !isDetailsDirty) return;
    setIsSavingDetails(true);
    try {
      const finalTitle = editableTitle.trim() || `Label_Not_Found.()🦋`;
      const finalProductName = editableProductName.trim();

      const updatedReport = await updateReportDetails(report.id, finalTitle, finalProductName);
      setReport(updatedReport); // Update local state with the full returned report
      toast({ title: "Details Updated!", description: "Your changes have been saved." });
      setIsDetailsDirty(false); // Reset dirty state
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Could not update report details.", variant: "destructive" });
    }
    setIsSavingDetails(false);
  };

  const handleSlugChange = async () => {
    if (!report || slugStatus !== 'available') {
      toast({ title: "Cannot Save Slug", description: "The new slug is invalid or already taken.", variant: "destructive" });
      return;
    }
    setIsSavingSlug(true);
    try {
      await updateReportSlug(report.id, debouncedSlug);
      setReport(prev => prev ? { ...prev, publicSlug: debouncedSlug } : null);
      toast({ title: "Link Updated!", description: "Your custom share link has been saved." });
      setSlugStatus("idle");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Could not update the link.", variant: "destructive" });
    }
    setIsSavingSlug(false);
  };

  const handlePublicToggle = async (isPublic: boolean) => {
    if (!report) return;
    try {
      const updatedReport = await updateReportPublicStatus(report.id, isPublic);
      setReport(updatedReport);
      toast({
        title: `Report is now ${isPublic ? 'Public' : 'Private'}`,
        description: isPublic ? "Anyone with the link can now view this report." : "This report is no longer publicly accessible.",
        variant: "success",
      });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Could not update public status.", variant: "destructive" });
    }
  };

  const getPublicUrl = () => {
    if (typeof window === 'undefined' || !currentUser?.username || !report?.publicSlug) return "";
    return `${window.location.origin}/${currentUser.username}/${report.publicSlug}`;
  };

  const handleCopyLink = async () => {
    const url = getPublicUrl();
    if (!url) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        toast({ title: "Link Copied!", description: "The public link has been copied to your clipboard." });
        setTimeout(() => setIsCopied(false), 2000);
      } else {
        // Fallback for when Clipboard API is not available
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed"; // Avoid scrolling to bottom
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand('copy');
          if (successful) {
            setIsCopied(true);
            toast({ title: "Link Copied!", description: "The public link has been copied to your clipboard." });
            setTimeout(() => setIsCopied(false), 2000);
          } else {
            throw new Error("Fallback copy failed.");
          }
        } catch (err) {
          throw new Error("Copy failed.");
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      console.error("Copy failed:", err);
      toast({ title: "Copy Failed", description: "Could not copy link. Please copy it manually.", variant: "destructive" });
    }
  };

  const handleShare = async () => {
    const url = getPublicUrl();
    if (!url) return;

    // Ensure text isn't too long for some share targets
    const summaryText = report?.summary ? report.summary.slice(0, 300) + (report.summary.length > 300 ? "..." : "") : "";

    const shareData = {
      title: `EatWise Report: ${report?.title || 'Health Analysis'}`,
      text: `Check out this health report I generated with EatWise India: ${summaryText}`,
      url: url,
    };

    try {
      // Check for support and ensure we are in a secure context (HTTPS) or localhost
      if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback for when Web Share API is not available (e.g. non-HTTPS mobile dev)
        await handleCopyLink();
        toast({
          title: "Sharing Unavailable",
          description: "Optimized sharing requires HTTPS. Link copied to clipboard instead.",
          duration: 3000
        });
      }
    } catch (error: any) {
      // Ignore user cancellation
      if (error.name === 'AbortError') {
        return;
      }

      console.error("Share failed:", error);
      // Only fallback to copy if it wasn't a cancellation
      await handleCopyLink();
    }
  };

  const getChatContext = (report: Report<any>): Omit<ContextAwareAIChatInput, 'userQuestion' | 'chatHistory'> => {
    switch (report.type) {
      case 'label':
        const labelData = report.data as GenerateHealthReportOutput;
        return {
          contextType: "labelAnalysis",
          labelContext: {
            productName: report.userInput?.productName || labelData.productType || "the product",
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
            foodItemDescription: report.userInput?.foodItemDescription || (report.userInput.nutritionDataUri ? "Scanned food item" : "Manually entered data"),
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
          const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
          if (loggedInUser.uid !== authUser.uid) {
            setError("Authentication mismatch.");
            setIsLoading(false);
            return;
          }
          setCurrentUser({ uid: authUser.uid, username: loggedInUser.username });

          const foundReport = await getReportById(id);
          if (foundReport) {
            if (foundReport.uid === authUser.uid) {
              setReport(foundReport);
              initiateChatWithWelcome(foundReport);
            } else {
              setError("You do not have permission to view this item.");
            }
          } else {
            setError("Saved item not found. It may have been deleted or the link is incorrect.");
          }
        } catch (e) {
          console.error("Failed to load report from Firestore:", e);
          setError("An error occurred while trying to load the saved item.");
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
    if (scrollAreaViewportRef.current) {
      requestAnimationFrame(() => {
        const scrollContainer = scrollAreaViewportRef.current;
        if (scrollContainer) {
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

  const getSlugStatusIndicator = () => {
    if (isCheckingSlug) return <LoaderCircle className="h-5 w-5 text-muted-foreground animate-spin" />;
    if (debouncedSlug === report?.publicSlug) return null;
    if (slugStatus === 'available') return <CheckCircle2 className="h-5 w-5 text-success" />;
    if (slugStatus === 'taken' || slugStatus === 'invalid') return <AlertTriangle className="h-5 w-5 text-destructive" />;
    return null;
  };

  const getSlugStatusMessage = () => {
    if (debouncedSlug === report?.publicSlug) return null;
    if (slugStatus === 'invalid') return <p className="text-xs text-destructive mt-1">Use 3-15 characters: letters, numbers, and hyphens only.</p>;
    if (slugStatus === 'taken') return <p className="text-xs text-destructive mt-1">This link ending is already taken.</p>;
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <LoaderCircle className="w-16 h-16 text-accent animate-spin mb-4" />
        <h1 className="text-2xl font-bold">Loading Saved Item...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
        <FileText className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive">Error Loading Item</h1>
        <p className="mt-2 text-lg text-muted-foreground">{error}</p>
        <Button asChild className="mt-8">
          <Link href="/saved">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Saved Items
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/saved">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Saved Items
            </Link>
          </Button>
        </div>

        {report && (
          <Card className="bg-secondary/50 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Pencil className="h-5 w-5 text-primary" /> Report Details</CardTitle>
              <CardDescription>You can edit the title and product name for this report.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="report-title">Report Title</Label>
                <Input
                  id="report-title"
                  value={editableTitle}
                  onChange={(e) => setEditableTitle(e.target.value)}
                  className="mt-1"
                />
              </div>
              {report.type !== 'recipe' && (
                <div>
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input
                    id="product-name"
                    value={editableProductName}
                    onChange={(e) => setEditableProductName(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}
              <Button onClick={handleDetailsSave} disabled={!isDetailsDirty || isSavingDetails}>
                {isSavingDetails ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <SaveIcon className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        )}

        {report && (
          <Card className="bg-secondary/50 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /> Sharing Settings</CardTitle>
              <CardDescription>Manage the visibility and sharing options for this report.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="public-toggle-switch"
                      checked={report.isPublic}
                      onCheckedChange={() => { }}
                    />
                    <Label htmlFor="public-toggle-switch" className="cursor-pointer">
                      {report.isPublic ? 'Report is Public' : 'Report is Private'}
                    </Label>
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Change Report Visibility?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {report.isPublic
                        ? "Making this report private will disable the public link. Anyone who has the link will no longer be able to view it."
                        : "Making this report public will generate a shareable link. Anyone with this link will be able to view the report and its chat history, without needing to log in."
                      }
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handlePublicToggle(!report.isPublic)}>
                      {`Yes, Make ${report.isPublic ? 'Private' : 'Public'}`}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {report.isPublic && currentUser?.username && (
                <div className="space-y-3 pt-2 animate-fade-in-up">
                  <div>
                    <Label htmlFor="public-link">Your public link</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex w-full flex-wrap items-center rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-background px-4 py-2">
                        <span className="text-sm text-muted-foreground break-all">{typeof window !== 'undefined' ? `${window.location.origin}/${currentUser.username}/` : `.../${currentUser.username}/`}</span>
                        <div className="flex-1 relative min-w-[150px]">
                          <Input
                            id="public-link"
                            value={editableSlug}
                            onChange={(e) => setEditableSlug(e.target.value)}
                            maxLength={15}
                            className="border-0 bg-transparent h-auto p-0 pr-8 focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-1">
                            {getSlugStatusIndicator()}
                          </div>
                        </div>
                      </div>

                      <Button onClick={handleSlugChange} disabled={slugStatus !== 'available' || isSavingSlug} size="icon">
                        <SaveIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    {getSlugStatusMessage()}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={handleCopyLink} variant="outline" className="flex-1">
                      {isCopied ? <Check className="mr-2 h-4 w-4 text-success" /> : <Copy className="mr-2 h-4 w-4" />}
                      {isCopied ? 'Link Copied!' : 'Copy Link'}
                    </Button>
                    <Button onClick={handleShare} className="flex-1">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Report
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {renderReport()}

        {report && (
          <Card>
            <CardHeader>
              <CardTitle className="font-semibold text-xl flex items-center"><MessageCircle className="mr-2 h-5 w-5" /> Chat with AI Advisor</CardTitle>
              <CardDescription className="text-sm text-muted-foreground pt-1">Ask follow-up questions about this saved report.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[250px] w-full" viewportRef={scrollAreaViewportRef}>
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
        )}
      </div>
    </div>
  );
}
