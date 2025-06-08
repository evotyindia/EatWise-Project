
"use client";

import type { GetRecipeSuggestionsInput, GetRecipeSuggestionsOutput } from "@/ai/flows/recipe-suggestions";
import { getRecipeSuggestions } from "@/ai/flows/recipe-suggestions";
import { DiseaseEnum, HouseholdCompositionSchema, type Disease, type HouseholdComposition } from "@/ai/types/recipe-shared-types"; 

import type { GetDetailedRecipeInput, GetDetailedRecipeOutput } from "@/ai/flows/get-detailed-recipe";
import { getDetailedRecipe } from "@/ai/flows/get-detailed-recipe";
import type { ContextAwareAIChatInput, ContextAwareAIChatOutput, ChatMessage } from "@/ai/flows/context-aware-ai-chat";
import { contextAwareAIChat } from "@/ai/flows/context-aware-ai-chat";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lightbulb, Sparkles, Download, ChefHat, Utensils, Leaf, WheatIcon, HeartCrack, Scale, User, UserCog, Baby, Send, MessageCircle, FileText, Milk, Cookie, MinusCircle, PlusCircle } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription as UIAlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PrintableDetailedRecipe } from "@/components/common/PrintableDetailedRecipe";

const diseaseOptions: { id: Disease; label: string; icon: React.ElementType }[] = [
  { id: "diabetes", label: "Diabetes", icon: Scale },
  { id: "high_blood_pressure", label: "High BP", icon: HeartCrack },
  { id: "heart_condition", label: "Heart Condition", icon: HeartCrack },
  { id: "gluten_free", label: "Gluten-Free", icon: WheatIcon },
  { id: "dairy_free", label: "Dairy-Free", icon: MinusCircle }, // Using MinusCircle for dairy-free
];

const recipePageInputSchema = z.object({
  ingredients: z.string().min(3, "Please enter at least one ingredient (min 3 chars)."),
  diseaseConcerns: z.array(DiseaseEnum).optional(),
  householdComposition: HouseholdCompositionSchema.extend({
    adults: z.string().transform(v => Number(v) || 0).refine(v => v >=0, "Must be 0 or more"),
    seniors: z.string().transform(v => Number(v) || 0).refine(v => v >=0, "Must be 0 or more"),
    kids: z.string().transform(v => Number(v) || 0).refine(v => v >=0, "Must be 0 or more"),
  }).refine(data => (data.adults || 0) + (data.seniors || 0) + (data.kids || 0) > 0, {
    message: "At least one person must be in the household.",
    path: ["adults"], 
  })
});

type RecipePageFormValues = z.infer<typeof recipePageInputSchema>;

const ingredientCategories = [
  { name: "Vegetables", icon: <Leaf className="mr-2 h-4 w-4 text-green-500" />, items: ["Onion", "Tomato", "Potato", "Spinach", "Carrot", "Capsicum", "Ginger", "Garlic", "Cauliflower", "Peas", "Beans", "Ladyfinger", "Cabbage", "Mushroom", "Broccoli", "Cucumber", "Radish", "Beetroot", "Coriander Leaves", "Mint Leaves", "Green Chili"] },
  { name: "Spices", icon: <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />, items: ["Turmeric Powder", "Cumin Powder", "Coriander Powder", "Garam Masala", "Chili Powder", "Mustard Seeds", "Asafoetida (Hing)", "Fenugreek Seeds", "Cumin Seeds", "Black Pepper", "Cardamom", "Cloves", "Cinnamon", "Bay Leaf", "Salt"] },
  { name: "Dals & Legumes", icon: <Utensils className="mr-2 h-4 w-4 text-orange-500" />, items: ["Moong Dal", "Toor Dal (Arhar)", "Chana Dal", "Masoor Dal", "Rajma (Kidney Beans)", "Chickpeas (Chole/Kabuli Chana)", "Black Eyed Peas (Lobia)", "Urad Dal", "Green Gram (Sabut Moong)"] },
  { name: "Grains & Flours", icon: <WheatIcon className="mr-2 h-4 w-4 text-amber-700" />, items: ["Rice (Basmati)", "Rice (Sona Masoori)", "Wheat Flour (Atta)", "Besan (Gram Flour)", "Suji (Semolina)", "Poha (Flattened Rice)", "Maida (All-purpose flour)", "Ragi Flour", "Jowar Flour", "Bajra Flour", "Bread"] },
  { name: "Dairy & Fats", icon: <Milk className="mr-2 h-4 w-4 text-blue-400" />, items: ["Paneer (Indian Cheese)", "Curd (Yogurt)", "Milk", "Ghee", "Butter", "Cooking Oil (Sunflower)", "Cooking Oil (Mustard)", "Cooking Oil (Groundnut)", "Olive Oil", "Cream (Malai)"] },
  { name: "Sweeteners & Nuts", icon: <Cookie className="mr-2 h-4 w-4 text-yellow-700" />, items: ["Sugar", "Jaggery (Gur)", "Honey", "Almonds", "Cashews", "Raisins", "Walnuts", "Peanuts"] }
];

export function RecipeForm() {
  const [dishSuggestions, setDishSuggestions] = useState<GetRecipeSuggestionsOutput | null>(null);
  const [detailedRecipe, setDetailedRecipe] = useState<GetDetailedRecipeOutput | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [currentFormInputs, setCurrentFormInputs] = useState<RecipePageFormValues | null>(null);

  const { toast } = useToast();
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<RecipePageFormValues>({
    resolver: zodResolver(recipePageInputSchema),
    defaultValues: {
      ingredients: "",
      diseaseConcerns: [],
      householdComposition: { adults: "1", seniors: "0", kids: "0" },
    },
  });

  const addIngredientToForm = (ingredient: string) => {
    const currentIngredients = form.getValues("ingredients");
    const newIngredients = currentIngredients ? `${currentIngredients}, ${ingredient}` : ingredient;
    form.setValue("ingredients", newIngredients, { shouldValidate: true });
  };

  const onGetSuggestionsSubmit: SubmitHandler<RecipePageFormValues> = async (data) => {
    setIsLoadingSuggestions(true);
    setDishSuggestions(null);
    setDetailedRecipe(null);
    setChatHistory([]);
    setCurrentFormInputs(data); // Save form inputs for fetching detailed recipe later
    try {
      const diseases = data.diseaseConcerns?.length ? data.diseaseConcerns : [DiseaseEnum.enum.none];
      const input: GetRecipeSuggestionsInput = {
        ingredients: data.ingredients,
        diseaseConcerns: diseases,
        householdComposition: {
          adults: Number(data.householdComposition.adults),
          seniors: Number(data.householdComposition.seniors),
          kids: Number(data.householdComposition.kids),
        }
      };
      const result = await getRecipeSuggestions(input);
      setDishSuggestions(result);
      toast({ title: "Dish Ideas Ready!", description: result.initialContextualGuidance || "Click a dish for its recipe." });
    } catch (error) {
      console.error("Error getting dish suggestions:", error);
      toast({ title: "Error", description: "Failed to get dish suggestions. Please try again.", variant: "destructive" });
    }
    setIsLoadingSuggestions(false);
  };

  const handleSelectDish = async (dishName: string) => {
    if (!currentFormInputs) return;
    setIsLoadingRecipe(true);
    setDetailedRecipe(null);
    setChatHistory([]); // Reset chat for new recipe

    try {
      const diseases = currentFormInputs.diseaseConcerns?.length ? currentFormInputs.diseaseConcerns : [DiseaseEnum.enum.none];
      const input: GetDetailedRecipeInput = {
        dishName,
        availableIngredients: currentFormInputs.ingredients,
        diseaseConcerns: diseases,
        householdComposition: {
          adults: Number(currentFormInputs.householdComposition.adults),
          seniors: Number(currentFormInputs.householdComposition.seniors),
          kids: Number(currentFormInputs.householdComposition.kids),
        }
      };
      const result = await getDetailedRecipe(input);
      setDetailedRecipe(result);
      toast({ title: `Recipe for ${result.recipeTitle} Generated!`, description: "Scroll down to view the recipe and chat." });
      // Initiate chat with a welcome message
      if (result) {
        initiateChatWithWelcome("recipe", { dishName: result.recipeTitle, recipeIngredients: result.adjustedIngredients.map(i => `${i.quantity} ${i.name}`).join(', '), currentRecipeHealthNotes: result.healthNotes });
      }
    } catch (error) {
      console.error("Error getting detailed recipe:", error);
      toast({ title: "Error", description: "Failed to get detailed recipe. Please try again.", variant: "destructive" });
    }
    setIsLoadingRecipe(false);
  };
  
  const initiateChatWithWelcome = async (contextType: "recipe" | "labelAnalysis" | "nutritionAnalysis" | "general", contextData: any) => {
    setIsChatLoading(true);
    setChatHistory([]); // Clear previous history
    const input: ContextAwareAIChatInput = {
        userQuestion: "INIT_CHAT_WELCOME",
        contextType: contextType,
        recipeContext: contextType === "recipe" ? contextData : undefined,
        // Add other contexts as needed
    };
    try {
        const aiResponse = await contextAwareAIChat(input);
        setChatHistory([{ role: "assistant", content: aiResponse.answer }]);
    } catch (error) {
        console.error("Chat init error:", error);
        setChatHistory([{ role: "assistant", content: "Hello! How can I help you today?" }]);
    }
    setIsChatLoading(false);
  };


  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !detailedRecipe) return;

    const userMessage: ChatMessage = { role: "user", content: chatInput };
    const newChatHistory = [...chatHistory, userMessage];
    setChatHistory(newChatHistory);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const chatContextInput: ContextAwareAIChatInput = {
        userQuestion: userMessage.content,
        chatHistory: chatHistory.slice(-5), // Send last 5 messages for context
        contextType: "recipe",
        recipeContext: {
          dishName: detailedRecipe.recipeTitle,
          recipeIngredients: detailedRecipe.adjustedIngredients.map(i => `${i.quantity} ${i.name} (${i.notes || ''})`).join('; '),
          recipeInstructions: detailedRecipe.instructions.join('\\n'),
          currentRecipeHealthNotes: detailedRecipe.healthNotes
        },
      };
      const aiResponse = await contextAwareAIChat(chatContextInput);
      setChatHistory(prev => [...prev, { role: "assistant", content: aiResponse.answer }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatHistory(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't process that. Please try again." }]);
      toast({ title: "Chat Error", description: "Could not get AI response.", variant: "destructive" });
    }
    setIsChatLoading(false);
  };
  
  useEffect(() => {
    if (chatScrollAreaRef.current) {
      chatScrollAreaRef.current.scrollTop = chatScrollAreaRef.current.scrollHeight;
    }
  }, [chatHistory]);


  const handleDownloadRecipePdf = async () => {
    if (!detailedRecipe || !currentFormInputs) return;
    setIsDownloading(true);

    const tempDiv = document.createElement('div');
    tempDiv.id = 'pdf-render-source-detailed-recipe'; // Unique ID
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0px';
    tempDiv.style.width = '210mm'; 
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.padding = '0';
    tempDiv.style.margin = '0';
    document.body.appendChild(tempDiv);
    
    const root = createRoot(tempDiv);
    root.render(
      <PrintableDetailedRecipe
        recipe={detailedRecipe}
        userInput={{
            availableIngredients: currentFormInputs.ingredients,
            diseaseConcerns: currentFormInputs.diseaseConcerns || [],
            householdComposition: {
                adults: Number(currentFormInputs.householdComposition.adults),
                seniors: Number(currentFormInputs.householdComposition.seniors),
                kids: Number(currentFormInputs.householdComposition.kids)
            }
        }}
        chatHistory={chatHistory}
      />
    );

    await new Promise(resolve => setTimeout(resolve, 1500)); 

    try {
      const canvas = await html2canvas(tempDiv, {
        scale: 2, useCORS: true, logging: false, width: tempDiv.scrollWidth, height: tempDiv.scrollHeight, windowWidth: tempDiv.scrollWidth, windowHeight: tempDiv.scrollHeight,
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
      pdf.save(`${detailedRecipe.recipeTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_recipe.pdf`);
      toast({ title: "Recipe PDF Downloaded", description: "The recipe PDF has been saved." });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({ title: "PDF Error", description: "Could not generate PDF report. " + (error as Error).message, variant: "destructive" });
    } finally {
      root.unmount(); document.body.removeChild(tempDiv); setIsDownloading(false);
    }
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="md:col-span-1 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl"><ChefHat className="mr-2 h-6 w-6" /> Recipe Finder</CardTitle>
          <CardDescription>Tell us what you have and any health needs.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onGetSuggestionsSubmit)} className="space-y-6">
              <FormField control={form.control} name="ingredients" render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Ingredients</FormLabel>
                  <FormControl><Textarea placeholder="e.g., Onions, Tomatoes, Paneer, Rice..." {...field} rows={4} className="bg-background" /></FormControl>
                  <FormDescription>Separate ingredients with commas.</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

              <div>
                <FormLabel>Health Considerations (Optional)</FormLabel>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {diseaseOptions.map((item) => (
                    <FormField key={item.id} control={form.control} name="diseaseConcerns" render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 space-y-0 p-2 border rounded-md hover:bg-muted/50">
                        <FormControl><Checkbox checked={field.value?.includes(item.id)} 
                          onCheckedChange={(checked) => {
                            return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id));
                          }} /></FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer flex items-center"><item.icon className="mr-1.5 h-4 w-4 text-muted-foreground"/>{item.label}</FormLabel>
                      </FormItem>
                    )} />
                  ))}
                </div>
              </div>

              <div>
                <FormLabel>Household Size (for portioning)</FormLabel>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  <FormField control={form.control} name="householdComposition.adults" render={({ field }) => (
                    <FormItem><FormLabel className="text-xs flex items-center"><User className="mr-1 h-3 w-3"/>Adults (18-60)</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="householdComposition.seniors" render={({ field }) => (
                    <FormItem><FormLabel className="text-xs flex items-center"><UserCog className="mr-1 h-3 w-3"/>Seniors (60+)</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="householdComposition.kids" render={({ field }) => (
                    <FormItem><FormLabel className="text-xs flex items-center"><Baby className="mr-1 h-3 w-3"/>Kids (2-17)</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                 {form.formState.errors.householdComposition && <FormMessage>{form.formState.errors.householdComposition.message}</FormMessage>}
              </div>

              <Button type="submit" disabled={isLoadingSuggestions} className="w-full">
                {isLoadingSuggestions ? "Finding Ideas..." : "Get Dish Ideas"}
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
          <Separator className="my-6"/>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            <h3 className="text-md font-medium sticky top-0 bg-card py-1">Quick Add Common Ingredients:</h3>
            {ingredientCategories.map(category => ( 
              <div key={category.name}>
                <h4 className="text-sm font-semibold mb-1.5 flex items-center">{category.icon} {category.name}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {category.items.map(item => <Button key={item} variant="outline" size="sm" onClick={() => addIngredientToForm(item)} className="text-xs px-2 py-1 h-auto">{item}</Button>)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-2 space-y-8">
        {isLoadingSuggestions && ( <Card className="flex items-center justify-center h-64"><Sparkles className="h-12 w-12 text-primary animate-spin" /><p className="ml-3">Finding dish ideas...</p></Card> )}
        
        {dishSuggestions && !detailedRecipe && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-accent"/> Suggested Dishes</CardTitle>
              {dishSuggestions.initialContextualGuidance && <CardDescription>{dishSuggestions.initialContextualGuidance}</CardDescription>}
            </CardHeader>
            <CardContent>
              {dishSuggestions.suggestions.length > 0 ? (
                <ul className="space-y-2">
                  {dishSuggestions.suggestions.map((dish, index) => (
                    <li key={index}>
                      <Button variant="link" onClick={() => handleSelectDish(dish)} className="text-lg p-0 h-auto hover:text-primary" disabled={isLoadingRecipe}>
                        {dish}
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : <p>No specific dish suggestions found. Try adjusting your ingredients or health concerns.</p>}
            </CardContent>
          </Card>
        )}

        {isLoadingRecipe && ( <Card className="flex items-center justify-center h-64"><Sparkles className="h-12 w-12 text-primary animate-spin" /><p className="ml-3">Generating detailed recipe...</p></Card> )}

        {detailedRecipe && (
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl flex items-center"><FileText className="mr-2 h-6 w-6 text-primary"/> {detailedRecipe.recipeTitle}</CardTitle>
                <Button onClick={handleDownloadRecipePdf} variant="outline" size="sm" disabled={isDownloading}>
                  {isDownloading ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />} Download PDF
                </Button>
              </div>
              {detailedRecipe.description && <CardDescription>{detailedRecipe.description}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                {detailedRecipe.prepTime && <div><strong>Prep:</strong> {detailedRecipe.prepTime}</div>}
                {detailedRecipe.cookTime && <div><strong>Cook:</strong> {detailedRecipe.cookTime}</div>}
                <div><strong>Serves:</strong> {detailedRecipe.servingsDescription}</div>
              </div>
              <Separator/>
              <div>
                <h3 className="font-semibold text-lg mb-2">Ingredients:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {detailedRecipe.adjustedIngredients.map((ing, i) => (
                    <li key={i}><strong>{ing.quantity}</strong> {ing.name}{ing.notes ? <span className="text-muted-foreground text-xs"> ({ing.notes})</span> : ""}</li>
                  ))}
                </ul>
              </div>
              <Separator/>
              <div>
                <h3 className="font-semibold text-lg mb-2">Instructions:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  {detailedRecipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                </ol>
              </div>
              {detailedRecipe.healthNotes && (
                <> <Separator/> <div><h3 className="font-semibold text-lg mb-2">Health Notes:</h3><p className="text-sm text-muted-foreground whitespace-pre-line">{detailedRecipe.healthNotes}</p></div></>
              )}
              {detailedRecipe.storageOrServingTips && (
                <> <Separator/> <div><h3 className="font-semibold text-lg mb-2">Tips:</h3><p className="text-sm text-muted-foreground whitespace-pre-line">{detailedRecipe.storageOrServingTips}</p></div></>
              )}
            </CardContent>
             <CardFooter className="flex flex-col items-start pt-4 border-t">
                <h3 className="font-semibold text-xl mb-2 flex items-center"><MessageCircle className="mr-2 h-5 w-5"/> Chat about this Recipe</h3>
                <p className="text-sm text-muted-foreground mb-3">Ask about substitutions, techniques, or nutrition.</p>
                <ScrollArea className="h-[200px] w-full rounded-md border p-3 mb-3 bg-muted/50" ref={chatScrollAreaRef}>
                  {chatHistory.map((msg, index) => (
                    <div key={index} className={`mb-2 p-2.5 rounded-lg text-sm shadow-sm max-w-[85%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-accent text-accent-foreground mr-auto'}`}>
                      <span className="font-semibold capitalize">{msg.role === 'user' ? 'You' : 'AI Chef'}: </span>{msg.content}
                    </div>
                  ))}
                  {isChatLoading && <div className="text-sm text-muted-foreground p-2">AI Chef is typing...</div>}
                </ScrollArea>
                <form onSubmit={handleChatSubmit} className="w-full flex gap-2">
                  <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask a question..." disabled={isChatLoading} className="bg-background"/>
                  <Button type="submit" disabled={isChatLoading || !chatInput.trim()}><Send className="h-4 w-4" /></Button>
                </form>
            </CardFooter>
          </Card>
        )}
        
        {/* Placeholder for initial state or when no specific results are loaded */}
        {!isLoadingSuggestions && !dishSuggestions && !detailedRecipe && !isLoadingRecipe &&(
           <Card className="flex items-center justify-center h-full min-h-[300px] bg-muted/30 md:col-span-2">
            <div className="text-center p-8">
                <ChefHat className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-xl font-semibold text-muted-foreground">Let's find some recipes!</p>
                <p className="text-md text-muted-foreground">Enter your ingredients and preferences to get started.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

    