
"use client";

import type { GetRecipeSuggestionsInput, GetRecipeSuggestionsOutput } from "@/ai/flows/recipe-suggestions";
import { getRecipeSuggestions } from "@/ai/flows/recipe-suggestions";
import { DiseaseEnum, HouseholdCompositionSchema, type Disease, type HouseholdComposition } from "@/ai/types/recipe-shared-types"; 

import type { GetDetailedRecipeInput, GetDetailedRecipeOutput } from "@/ai/flows/get-detailed-recipe";
import { getDetailedRecipe } from "@/ai/flows/get-detailed-recipe";
import type { ContextAwareAIChatInput, ContextAwareAIChatOutput, ChatMessage } from "@/ai/flows/context-aware-ai-chat";
import { contextAwareAIChat } from "@/ai/flows/context-aware-ai-chat";


import { zodResolver } from "@hookform/resolvers/zod";
import { Lightbulb, Sparkles, Download, ChefHat, Utensils, Leaf, Wheat, HeartCrack, Scale, User, UserCog, Baby, Send, MessageCircle, FileText, Milk, Cookie, MinusCircle, PlusCircle, CheckCircle, Search, ListPlus } from "lucide-react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useForm, type SubmitHandler, Controller, FormProvider } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PrintableDetailedRecipe } from "@/components/common/PrintableDetailedRecipe";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";


const diseaseOptions: { id: Disease; label: string; icon: React.ElementType }[] = [
  { id: "diabetes", label: "Diabetes", icon: Scale },
  { id: "high_blood_pressure", label: "High BP", icon: HeartCrack },
  { id: "heart_condition", label: "Heart Condition", icon: HeartCrack },
  { id: "gluten_free", label: "Gluten-Free", icon: Wheat },
  { id: "dairy_free", label: "Dairy-Free", icon: MinusCircle },
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
  { name: "Vegetables", icon: Leaf, items: ["Onion", "Tomato", "Potato", "Spinach", "Carrot", "Capsicum", "Ginger", "Garlic", "Cauliflower", "Peas", "Beans", "Ladyfinger (Okra)", "Cabbage", "Mushroom", "Broccoli", "Cucumber", "Radish", "Beetroot", "Coriander Leaves", "Mint Leaves", "Green Chili", "Lemon", "Bottle Gourd (Lauki)", "Ridge Gourd (Turai)", "Brinjal (Eggplant)", "Sweet Potato"] },
  { name: "Spices & Herbs", icon: Sparkles, items: ["Turmeric Powder", "Cumin Powder", "Coriander Powder", "Garam Masala", "Red Chili Powder", "Mustard Seeds", "Asafoetida (Hing)", "Fenugreek Seeds (Methi)", "Cumin Seeds (Jeera)", "Black Pepper", "Cardamom (Elaichi)", "Cloves (Laung)", "Cinnamon (Dalchini)", "Bay Leaf (Tej Patta)", "Salt", "Kasuri Methi (Dry Fenugreek)", "Curry Leaves", "Saffron (Kesar)"] },
  { name: "Dals & Legumes", icon: Utensils, items: ["Moong Dal (Yellow Lentil)", "Toor Dal (Arhar/Pigeon Pea)", "Chana Dal (Split Chickpea)", "Masoor Dal (Red Lentil)", "Rajma (Kidney Beans)", "Chickpeas (Chole/Kabuli Chana)", "Black Eyed Peas (Lobia)", "Urad Dal (Black Gram)", "Green Gram (Sabut Moong)", "Black Chickpeas (Kala Chana)"] },
  { name: "Grains & Flours", icon: Wheat, items: ["Rice (Basmati)", "Rice (Sona Masoori/Regular)", "Wheat Flour (Atta)", "Besan (Gram Flour)", "Suji (Semolina/Rava)", "Poha (Flattened Rice)", "Maida (All-purpose flour)", "Ragi Flour (Finger Millet)", "Jowar Flour (Sorghum)", "Bajra Flour (Pearl Millet)", "Bread (Whole Wheat/White)", "Oats", "Quinoa"] },
  { name: "Dairy & Fats", icon: Milk, items: ["Paneer (Indian Cheese)", "Curd (Yogurt/Dahi)", "Milk", "Ghee (Clarified Butter)", "Butter", "Cooking Oil (Sunflower)", "Cooking Oil (Mustard)", "Cooking Oil (Groundnut)", "Olive Oil", "Coconut Oil", "Cream (Malai)", "Cheese (Processed/Cheddar)"] },
  { name: "Sweeteners, Nuts & Seeds", icon: Cookie, items: ["Sugar", "Jaggery (Gur)", "Honey", "Almonds (Badam)", "Cashews (Kaju)", "Raisins (Kishmish)", "Walnuts (Akhrot)", "Peanuts (Moongphali)", "Pistachios (Pista)", "Coconut (Fresh/Dry)", "Poppy Seeds (Khas Khas)", "Sesame Seeds (Til)", "Flax Seeds (Alsi)", "Chia Seeds"] }
];

export function RecipeForm() {
  const [dishSuggestions, setDishSuggestions] = useState<GetRecipeSuggestionsOutput | null>(null);
  const [detailedRecipe, setDetailedRecipe] = useState<GetDetailedRecipeOutput | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [currentFormInputs, setCurrentFormInputs] = useState<RecipePageFormValues | null>(null);
  
  const [selectedQuickAddIngredients, setSelectedQuickAddIngredients] = useState<Set<string>>(new Set());
  const [isIngredientPickerDialogOpen, setIsIngredientPickerDialogOpen] = useState(false);

  const ingredientsTextareaRef = useRef<HTMLTextAreaElement>(null);

  const { toast } = useToast();
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);

  const formMethods = useForm<RecipePageFormValues>({
    resolver: zodResolver(recipePageInputSchema),
    defaultValues: {
      ingredients: "",
      diseaseConcerns: [],
      householdComposition: { adults: "1", seniors: "0", kids: "0" },
    },
  });
  const { control, handleSubmit, setValue, getValues, watch, formState: { errors }, reset, clearErrors } = formMethods;


  const ingredientsValueFromForm = watch("ingredients");

  useEffect(() => {
    const currentTextareaVal = ingredientsValueFromForm || "";
    const ingredientsFromTextarea = new Set(
      currentTextareaVal.split(',').map(ing => ing.trim().toLowerCase()).filter(Boolean)
    );
  
    setSelectedQuickAddIngredients(prevSet => {
      const currentSetArray = Array.from(prevSet);
      const newSetArray = Array.from(ingredientsFromTextarea);
  
      if (currentSetArray.length === newSetArray.length && currentSetArray.every(item => newSetArray.includes(item))) {
        return prevSet; 
      }
      return ingredientsFromTextarea;
    });
  }, [ingredientsValueFromForm]);


  useEffect(() => {
    const ingredientsArray = Array.from(selectedQuickAddIngredients).map(ing => 
      ing.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') 
    );
    const newTextareaValue = ingredientsArray.join(', ');
    const currentFormValue = getValues("ingredients");

    if (newTextareaValue !== currentFormValue) {
      setValue("ingredients", newTextareaValue, { shouldValidate: true, shouldDirty: true });
    }
  }, [selectedQuickAddIngredients, setValue, getValues]);


  const toggleIngredientInDialog = (ingredient: string) => {
    const ingredientLower = ingredient.toLowerCase();
    setSelectedQuickAddIngredients(prevSet => {
      const newSet = new Set(prevSet);
      if (newSet.has(ingredientLower)) {
        newSet.delete(ingredientLower);
      } else {
        newSet.add(ingredientLower);
      }
      return newSet;
    });
  };

  const onGetSuggestionsSubmit: SubmitHandler<RecipePageFormValues> = async (data) => {
    setIsLoadingSuggestions(true);
    setDishSuggestions(null);
    setDetailedRecipe(null);
    setChatHistory([]);
    setCurrentFormInputs(data); 
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
    setChatHistory([]); 

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
    setChatHistory([]); 
    const input: ContextAwareAIChatInput = {
        userQuestion: "INIT_CHAT_WELCOME",
        contextType: contextType,
        recipeContext: contextType === "recipe" ? contextData : undefined,
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
        chatHistory: chatHistory.slice(-5),
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
    setIsPdfDownloading(true);

    const tempDiv = document.createElement('div');
    tempDiv.id = 'pdf-render-source-detailed-recipe-' + Date.now();
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
      pdf.save(`${detailedRecipe.recipeTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_recipe.pdf`);
      toast({ title: "Recipe PDF Downloaded", description: "The recipe PDF has been saved." });
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="md:col-span-1 shadow-lg hover:shadow-xl transition-shadow rounded-xl min-w-0">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary"><ChefHat className="mr-2 h-7 w-7" /> Recipe Finder</CardTitle>
          <CardDescription>Tell us what you have and any health needs. We'll suggest some healthy Indian dishes!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...formMethods}>
            <form onSubmit={handleSubmit(onGetSuggestionsSubmit)} className="space-y-6">
            <FormField control={control} name="ingredients" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-foreground/90">Available Ingredients</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Onions, Tomatoes, Paneer, Rice..."
                      {...field}
                      ref={ingredientsTextareaRef}
                      rows={4}
                      className="bg-background"
                    />
                  </FormControl>
                  <FormDescription>Type your ingredients, or use the button below to browse common items.</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex justify-center">
                <Dialog open={isIngredientPickerDialogOpen} onOpenChange={setIsIngredientPickerDialogOpen}>
                  <DialogTrigger asChild>
                     <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full md:w-auto whitespace-normal h-auto min-h-10 text-center"
                      >
                        <ListPlus className="mr-2 h-4 w-4 shrink-0" />
                        <span>Browse & Add Common Ingredients</span>
                      </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] rounded-xl">
                    <DialogHeader>
                      <DialogTitle className="text-primary">Select Common Ingredients</DialogTitle>
                      <DialogDescription>
                        Tap ingredients to add or remove them from your list. Selected items will appear in the textarea above.
                      </DialogDescription>
                    </DialogHeader>
                      <ScrollArea className="max-h-[60vh] py-4">
                        <Accordion type="multiple" className="w-full" defaultValue={ingredientCategories.map((_, index) => `category-${index}`)}>
                          {ingredientCategories.map((category, index) => {
                            const CategoryIcon = category.icon;
                            return (
                              <AccordionItem value={`category-${index}`} key={category.name} className="border-border">
                                <AccordionTrigger className="text-base font-semibold py-3 hover:no-underline [&[data-state=open]>svg]:text-primary text-foreground/90">
                                  <div className="flex items-center">
                                    <CategoryIcon className="mr-2 h-5 w-5 text-primary/80" /> {category.name}
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="flex flex-wrap gap-2 p-2 bg-muted/30 rounded-md">
                                    {category.items.map(item => {
                                      const isSelected = selectedQuickAddIngredients.has(item.toLowerCase());
                                      return (
                                        <Button
                                          key={item}
                                          type="button"
                                          variant={isSelected ? "default" : "outline"}
                                          onClick={() => toggleIngredientInDialog(item)}
                                          className={cn(
                                            "px-3 py-1.5 text-sm h-auto rounded-full",
                                            "transition-all duration-150 ease-in-out",
                                            "flex items-center active:scale-95",
                                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-background",
                                            isSelected && "bg-primary text-primary-foreground hover:bg-primary/90 border-primary font-semibold",
                                            !isSelected && "border-input bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
                                          )}
                                        >
                                          {isSelected ? <CheckCircle className="mr-1.5 h-4 w-4" /> : <PlusCircle className="mr-1.5 h-4 w-4 opacity-70" />}
                                          {item}
                                        </Button>
                                      );
                                    })}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            );
                          })}
                        </Accordion>
                      </ScrollArea>
                    <DialogFooter className="pt-4">
                      <DialogClose asChild>
                        <Button type="button" className="bg-primary hover:bg-primary/90 text-primary-foreground">Done</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Separator className="my-6 border-border" />

              <div>
                <FormLabel className="font-semibold text-foreground/90">Health Considerations (Optional)</FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {diseaseOptions.map((item) => (
                    <FormField key={item.id} control={control} name="diseaseConcerns" render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2.5 border rounded-md hover:bg-muted/50 transition-colors bg-card">
                        <FormControl><Checkbox checked={field.value?.includes(item.id)} 
                          onCheckedChange={(checked) => {
                            return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id));
                          }} /></FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer flex items-center text-foreground/80"><item.icon className="mr-1.5 h-4 w-4 text-primary/70"/>{item.label}</FormLabel>
                      </FormItem>
                    )} />
                  ))}
                </div>
              </div>

              <div>
                <FormLabel className="font-semibold text-foreground/90">Household Size (for portioning)</FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                  <FormField control={control} name="householdComposition.adults" render={({ field }) => (
                    <FormItem><FormLabel className="text-xs flex items-center text-muted-foreground"><User className="mr-1 h-3 w-3"/>Adults (18-60)</FormLabel><FormControl><Input type="number" min="0" {...field} className="bg-background" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={control} name="householdComposition.seniors" render={({ field }) => (
                    <FormItem><FormLabel className="text-xs flex items-center text-muted-foreground"><UserCog className="mr-1 h-3 w-3"/>Seniors (60+)</FormLabel><FormControl><Input type="number" min="0" {...field} className="bg-background" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={control} name="householdComposition.kids" render={({ field }) => (
                    <FormItem><FormLabel className="text-xs flex items-center text-muted-foreground"><Baby className="mr-1 h-3 w-3"/>Kids (2-17)</FormLabel><FormControl><Input type="number" min="0" {...field} className="bg-background" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                 {errors.householdComposition && <FormMessage>{(errors.householdComposition as any).message || errors.householdComposition.adults?.message || errors.householdComposition.seniors?.message || errors.householdComposition.kids?.message}</FormMessage>}
              </div>

              <Button type="submit" disabled={isLoadingSuggestions} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base py-2.5">
                {isLoadingSuggestions ? "Finding Ideas..." : "Get Dish Ideas"}
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="md:col-span-2 space-y-8 min-w-0">
        {isLoadingSuggestions && ( <Card className="flex items-center justify-center h-64 rounded-xl shadow-lg"><Sparkles className="h-12 w-12 text-primary animate-spin" /><p className="ml-3 text-lg text-muted-foreground">Finding dish ideas...</p></Card> )}
        
        {dishSuggestions && !detailedRecipe && (
          <Card className="shadow-lg rounded-xl min-w-0">
            <CardHeader>
              <CardTitle className="text-xl flex items-center text-primary"><Lightbulb className="mr-2 h-6 w-6"/> Suggested Dishes</CardTitle>
              {dishSuggestions.initialContextualGuidance && <CardDescription>{dishSuggestions.initialContextualGuidance}</CardDescription>}
            </CardHeader>
            <CardContent>
              {dishSuggestions.suggestions.length > 0 ? (
                <ul className="space-y-2">
                  {dishSuggestions.suggestions.map((dish, index) => (
                    <li key={index}>
                      <Button variant="link" onClick={() => handleSelectDish(dish)} className="text-lg p-0 h-auto hover:text-accent font-medium" disabled={isLoadingRecipe}>
                        {dish}
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-muted-foreground">No specific dish suggestions found. Try adjusting your ingredients or health concerns.</p>}
            </CardContent>
          </Card>
        )}

        {isLoadingRecipe && ( <Card className="flex items-center justify-center h-64 rounded-xl shadow-lg"><Sparkles className="h-12 w-12 text-primary animate-spin" /><p className="ml-3 text-lg text-muted-foreground">Generating detailed recipe...</p></Card> )}

        {detailedRecipe && (
          <Card className="shadow-xl hover:shadow-2xl transition-shadow rounded-xl min-w-0">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl flex items-center text-primary"><FileText className="mr-2 h-7 w-7"/> {detailedRecipe.recipeTitle}</CardTitle>
                <Button onClick={handleDownloadRecipePdf} variant="outline" size="sm" disabled={isPdfDownloading} className="hover:bg-primary/5 hover:text-primary">
                  {isPdfDownloading ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />} Download PDF
                </Button>
              </div>
              {detailedRecipe.description && <CardDescription className="mt-1 break-words">{detailedRecipe.description}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm bg-muted/50 p-3 rounded-lg border border-border">
                {detailedRecipe.prepTime && <div className="font-medium"><strong className="text-foreground/80 block">Prep Time:</strong> {detailedRecipe.prepTime}</div>}
                {detailedRecipe.cookTime && <div className="font-medium"><strong className="text-foreground/80 block">Cook Time:</strong> {detailedRecipe.cookTime}</div>}
                <div className="font-medium"><strong className="text-foreground/80 block">Serves:</strong> <span className="break-all">{detailedRecipe.servingsDescription}</span></div>
              </div>
              <Separator className="border-border"/>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground/90">Ingredients:</h3>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-foreground/80 marker:text-primary">
                  {detailedRecipe.adjustedIngredients.map((ing, i) => (
                    <li key={i} className="break-words"><strong>{ing.quantity}</strong> {ing.name}{ing.notes ? <span className="text-muted-foreground text-xs"> ({ing.notes})</span> : ""}</li>
                  ))}
                </ul>
              </div>
              <Separator className="border-border"/>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground/90">Instructions:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-foreground/80 marker:text-primary marker:font-semibold">
                  {detailedRecipe.instructions.map((step, i) => <li key={i} className="pl-1 break-words">{step}</li>)}
                </ol>
              </div>
              {detailedRecipe.healthNotes && (
                <> <Separator className="border-border"/> <div className="p-3 bg-primary/5 rounded-lg border border-primary/20"><h3 className="font-semibold text-lg mb-1.5 text-primary">Health Notes:</h3><p className="text-sm text-primary/80 whitespace-pre-line break-words">{detailedRecipe.healthNotes}</p></div></>
              )}
              {detailedRecipe.storageOrServingTips && (
                <> <Separator className="border-border"/> <div className="p-3 bg-accent/10 rounded-lg border border-accent/20"><h3 className="font-semibold text-lg mb-1.5 text-accent">Storage & Serving Tips:</h3><p className="text-sm text-muted-foreground whitespace-pre-line break-words">{detailedRecipe.storageOrServingTips}</p></div></>
              )}
            </CardContent>
             <CardFooter className="flex flex-col items-start pt-5 border-t border-border">
                <h3 className="font-semibold text-xl mb-2 flex items-center text-primary"><MessageCircle className="mr-2 h-5 w-5"/> Chat about this Recipe</h3>
                <p className="text-sm text-muted-foreground mb-4">Ask about substitutions, techniques, or nutrition.</p>
                <ScrollArea className="h-[220px] w-full rounded-md border border-border bg-muted/40 p-3 mb-4 shadow-inner" ref={chatScrollAreaRef}>
                  {chatHistory.map((msg, index) => (
                    <div key={index} className={`mb-2.5 p-3 rounded-lg text-sm shadow-sm max-w-[90%] break-words ${msg.role === 'user' ? 'bg-primary text-primary-foreground ml-auto rounded-br-none' : 'bg-accent text-accent-foreground mr-auto rounded-bl-none'}`}>
                      <span className="font-semibold capitalize block mb-0.5">{msg.role === 'user' ? 'You' : 'AI Chef'}: </span>{msg.content}
                    </div>
                  ))}
                  {isChatLoading && <div className="text-sm text-muted-foreground p-2.5 flex items-center"><Sparkles className="h-4 w-4 mr-2 animate-pulse" /> AI Chef is typing...</div>}
                </ScrollArea>
                <form onSubmit={handleSubmit(handleChatSubmit)} className="w-full flex gap-2">
                  <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask a question..." disabled={isChatLoading} className="bg-background flex-grow"/>
                  <Button type="submit" disabled={isChatLoading || !chatInput.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground"><Send className="h-4 w-4" /></Button>
                </form>
            </CardFooter>
          </Card>
        )}
        
        {!isLoadingSuggestions && !dishSuggestions && !detailedRecipe && !isLoadingRecipe &&(
           <Card className="flex items-center justify-center h-full min-h-[300px] bg-muted/30 md:col-span-2 rounded-xl border-2 border-dashed border-border min-w-0">
            <div className="text-center p-8">
                <ChefHat className="mx-auto h-16 w-16 text-muted-foreground/70 mb-5" />
                <p className="text-xl font-semibold text-muted-foreground">Let's find some recipes!</p>
                <p className="text-md text-muted-foreground/80 mt-1">Enter your ingredients and preferences to get started.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
