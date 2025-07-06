"use client";

import type { GetRecipeSuggestionsInput, GetRecipeSuggestionsOutput } from "@/ai/flows/recipe-suggestions";
import { getRecipeSuggestions } from "@/ai/flows/recipe-suggestions";
import { DiseaseEnum, HouseholdCompositionSchema, type Disease } from "@/ai/types/recipe-shared-types"; 
import type { GetDetailedRecipeInput, GetDetailedRecipeOutput } from "@/ai/flows/get-detailed-recipe";
import { getDetailedRecipe } from "@/ai/flows/get-detailed-recipe";
import type { ContextAwareAIChatInput, ChatMessage } from "@/ai/flows/context-aware-ai-chat";
import { contextAwareAIChat } from "@/ai/flows/context-aware-ai-chat";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lightbulb, Sparkles, ChefHat, Utensils, Leaf, WheatIcon, HeartCrack, Scale, User, UserCog, Baby, Send, MessageCircle, FileText, Milk, MinusCircle } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";


const diseaseOptions: { id: Disease; label: string; icon: React.ElementType }[] = [
  { id: "diabetes", label: "Diabetes", icon: Scale },
  { id: "high_blood_pressure", label: "High BP", icon: HeartCrack },
  { id: "heart_condition", label: "Heart Condition", icon: HeartCrack },
  { id: "gluten_free", label: "Gluten-Free", icon: WheatIcon },
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
    { name: "Vegetables", icon: <Leaf className="text-green-500" />, items: ["Onion", "Tomato", "Potato", "Spinach", "Carrot", "Capsicum", "Ginger", "Garlic", "Cauliflower", "Peas", "Coriander Leaves", "Green Chili", "Lemon"] },
    { name: "Spices & Herbs", icon: <Sparkles className="text-yellow-500" />, items: ["Turmeric Powder", "Cumin Powder", "Coriander Powder", "Garam Masala", "Red Chili Powder", "Mustard Seeds", "Salt"] },
    { name: "Dals & Legumes", icon: <Utensils className="text-orange-500" />, items: ["Moong Dal", "Toor Dal", "Chana Dal", "Masoor Dal", "Rajma", "Chickpeas (Chole)"] },
    { name: "Grains & Flours", icon: <WheatIcon className="text-amber-700" />, items: ["Rice", "Wheat Flour (Atta)", "Besan (Gram Flour)", "Suji (Semolina)"] },
    { name: "Dairy & Fats", icon: <Milk className="text-blue-400" />, items: ["Paneer", "Curd (Yogurt)", "Milk", "Ghee", "Cooking Oil"] },
];

export function RecipeForm() {
  const [dishSuggestions, setDishSuggestions] = useState<GetRecipeSuggestionsOutput | null>(null);
  const [detailedRecipe, setDetailedRecipe] = useState<GetDetailedRecipeOutput | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [currentFormInputs, setCurrentFormInputs] = useState<RecipePageFormValues | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();

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
    const ingredientsSet = new Set(currentIngredients.split(/, ?/).filter(i => i.trim() !== ""));
    ingredientsSet.add(ingredient);
    form.setValue("ingredients", Array.from(ingredientsSet).join(", "), { shouldValidate: true });
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
  
  const initiateChatWithWelcome = async (contextType: "recipe", contextData: any) => {
    setIsChatLoading(true);
    setChatHistory([]); 
    const input: ContextAwareAIChatInput = {
        userQuestion: "INIT_CHAT_WELCOME",
        contextType: contextType,
        recipeContext: contextData,
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
    setChatHistory(prev => [...prev, userMessage]);
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
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);


  return (
    <>
      <div className="hidden">
        {/* This div is for holding elements that should not affect layout, like print components. */}
      </div>
    
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl"><ChefHat className="mr-2 h-6 w-6 text-primary" /> Recipe Finder</CardTitle>
            <CardDescription>Tell us what you have and any health needs.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onGetSuggestionsSubmit)} className="space-y-6">
                <FormField control={form.control} name="ingredients" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Ingredients</FormLabel>
                    <FormControl><Textarea placeholder="e.g., Onions, Tomatoes, Paneer, Rice..." {...field} rows={4} className="bg-background/50" /></FormControl>
                    <FormDescription>Separate ingredients with commas.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Health & Household Options</AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      <div>
                        <FormLabel>Health Considerations (Optional)</FormLabel>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {diseaseOptions.map((item) => (
                            <FormField key={item.id} control={form.control} name="diseaseConcerns" render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md hover:bg-muted/50">
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
                            <FormItem><FormLabel className="text-xs flex items-center"><User className="mr-1 h-3 w-3"/>Adults</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="householdComposition.seniors" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs flex items-center"><UserCog className="mr-1 h-3 w-3"/>Seniors</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="householdComposition.kids" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs flex items-center"><Baby className="mr-1 h-3 w-3"/>Kids</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                        </div>
                        {form.formState.errors.householdComposition && <FormMessage className="col-span-3">{form.formState.errors.householdComposition.message}</FormMessage>}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Quick Add Ingredients</AccordionTrigger>
                    <AccordionContent className="pt-2">
                      <ScrollArea className="h-60">
                          <div className="space-y-4 pr-3">
                          {ingredientCategories.map((category) => (
                              <div key={category.name}>
                              <h4 className="text-sm font-semibold flex items-center mb-2">{React.cloneElement(category.icon, { className: cn(category.icon.props.className, "mr-2 h-4 w-4") })} {category.name}</h4>
                              <div className="flex flex-wrap gap-1.5">
                                  {category.items.map(item => (
                                  <Button 
                                      key={item} 
                                      type="button"
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => addIngredientToForm(item)} 
                                      className="text-xs px-2 py-1 h-auto rounded-full"
                                  >
                                      {item}
                                  </Button>
                                  ))}
                              </div>
                              </div>
                          ))}
                          </div>
                      </ScrollArea>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Button type="submit" disabled={isLoadingSuggestions} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  {isLoadingSuggestions ? "Finding Ideas..." : "Get Dish Ideas"}
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-8">
          {isLoadingSuggestions && ( <Card className="flex items-center justify-center h-64"><Sparkles className="h-12 w-12 text-accent animate-spin" /><p className="ml-3 text-lg">Finding dish ideas...</p></Card> )}
          
          {dishSuggestions && !detailedRecipe && (
            <Card className="animate-fade-in-up opacity-0" style={{animationFillMode: 'forwards'}}>
              <CardHeader>
                <CardTitle className="text-xl flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-accent"/> Suggested Dishes</CardTitle>
                {dishSuggestions.initialContextualGuidance && <CardDescription>{dishSuggestions.initialContextualGuidance}</CardDescription>}
              </CardHeader>
              <CardContent>
                {dishSuggestions.suggestions.length > 0 && !dishSuggestions.suggestions[0].toLowerCase().includes("sorry") ? (
                  <div className="flex flex-wrap gap-3">
                    {dishSuggestions.suggestions.map((dish, index) => (
                      <Button key={index} variant="secondary" onClick={() => handleSelectDish(dish)} className="text-md" disabled={isLoadingRecipe}>
                        {isLoadingRecipe ? 'Loading...' : dish}
                      </Button>
                    ))}
                  </div>
                ) : <p>No specific dish suggestions found. Try adjusting your ingredients or health concerns.</p>}
              </CardContent>
            </Card>
          )}

          {isLoadingRecipe && ( <Card className="flex items-center justify-center h-96"><Sparkles className="h-12 w-12 text-accent animate-spin" /><p className="ml-3 text-lg">Generating detailed recipe...</p></Card> )}
          
          {detailedRecipe && (
            <Card className="transition-shadow animate-fade-in-up opacity-0" style={{animationFillMode: 'forwards'}}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                      <CardTitle className="text-2xl flex items-center"><FileText className="mr-2 h-6 w-6 text-primary"/> {detailedRecipe.recipeTitle}</CardTitle>
                      {detailedRecipe.description && <CardDescription className="mt-1">{detailedRecipe.description}</CardDescription>}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm p-3 bg-muted/60 rounded-lg">
                  {detailedRecipe.prepTime && <div><strong>Prep:</strong> {detailedRecipe.prepTime}</div>}
                  {detailedRecipe.cookTime && <div><strong>Cook:</strong> {detailedRecipe.cookTime}</div>}
                  <div className="col-span-2 sm:col-span-1"><strong>Serves:</strong> {detailedRecipe.servingsDescription}</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Ingredients:</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {detailedRecipe.adjustedIngredients.map((ing, i) => (
                          <li key={i}><strong>{ing.quantity}</strong> {ing.name}{ing.notes ? <span className="text-muted-foreground text-xs"> ({ing.notes})</span> : ""}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Instructions:</h3>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        {detailedRecipe.instructions.map((step, i) => <li key={i} className="pl-2">{step}</li>)}
                      </ol>
                    </div>
                </div>
                {detailedRecipe.healthNotes && (
                  <> <Separator/> <div><h3 className="font-semibold text-lg mb-2">Health Notes:</h3><p className="text-sm text-muted-foreground whitespace-pre-line">{detailedRecipe.healthNotes}</p></div></>
                )}
              </CardContent>
              <CardFooter className="flex flex-col items-start pt-4 border-t border-white/10">
                  <h3 className="font-semibold text-xl mb-2 flex items-center"><MessageCircle className="mr-2 h-5 w-5"/> Chat about this Recipe</h3>
                  <p className="text-sm text-muted-foreground mb-3">Ask about substitutions, techniques, or nutrition.</p>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-3 mb-3 bg-muted/50">
                    {chatHistory.map((msg, index) => (
                      <div key={index} className={`mb-2 p-2.5 rounded-lg text-sm shadow-sm max-w-[85%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-secondary text-secondary-foreground mr-auto'}`}>
                        <span className="font-semibold capitalize">{msg.role === 'user' ? 'You' : 'AI Chef'}: </span>{msg.content}
                      </div>
                    ))}
                    {isChatLoading && <div className="text-sm text-muted-foreground p-2">AI Chef is typing...</div>}
                    <div ref={messagesEndRef} />
                  </ScrollArea>
                  <form onSubmit={handleChatSubmit} className="w-full flex gap-2">
                    <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask a question..." disabled={isChatLoading} className="bg-background/50"/>
                    <Button type="submit" disabled={isChatLoading || !chatInput.trim()}><Send className="h-4 w-4" /></Button>
                  </form>
              </CardFooter>
            </Card>
          )}
          
          {!isLoadingSuggestions && !dishSuggestions && !detailedRecipe && !isLoadingRecipe &&(
            <Card className="flex items-center justify-center h-full min-h-[300px] bg-muted/30 md:col-span-2">
              <div className="text-center p-8">
                  <ChefHat className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-xl font-semibold text-muted-foreground">Let&apos;s find some recipes!</p>
                  <p className="text-md text-muted-foreground mt-1">Enter your ingredients to get started.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
