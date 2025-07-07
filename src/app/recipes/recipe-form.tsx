
"use client";

import type { GetRecipeSuggestionsInput, GetRecipeSuggestionsOutput } from "@/ai/flows/recipe-suggestions";
import { getRecipeSuggestions } from "@/ai/flows/recipe-suggestions";
import { DiseaseEnum, HouseholdCompositionSchema, type Disease } from "@/ai/types/recipe-shared-types"; 
import type { GetDetailedRecipeInput, GetDetailedRecipeOutput } from "@/ai/flows/get-detailed-recipe";
import { getDetailedRecipe } from "@/ai/flows/get-detailed-recipe";
import type { ContextAwareAIChatInput, ChatMessage } from "@/ai/flows/context-aware-ai-chat";
import { contextAwareAIChat } from "@/ai/flows/context-aware-ai-chat";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lightbulb, Sparkles, ChefHat, WheatIcon, HeartCrack, Scale, User, UserCog, Baby, Send, MessageCircle, FileText, MinusCircle, Check, Clock, Soup, Users } from "lucide-react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";


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

const quickAddIngredients = [
    "Onion", "Tomato", "Potato", "Spinach", "Carrot", "Capsicum", "Ginger", "Garlic", "Cauliflower", "Peas", "Coriander Leaves", "Green Chili", "Lemon",
    "Turmeric Powder", "Cumin Powder", "Coriander Powder", "Garam Masala", "Red Chili Powder", "Mustard Seeds", "Salt",
    "Moong Dal", "Toor Dal", "Chana Dal", "Masoor Dal", "Rajma", "Chickpeas (Chole)",
    "Rice", "Wheat Flour (Atta)", "Besan (Gram Flour)", "Suji (Semolina)",
    "Paneer", "Curd (Yogurt)", "Milk", "Ghee", "Cooking Oil"
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

  const watchedIngredients = form.watch("ingredients");

  const toggleIngredient = (ingredient: string) => {
    const currentIngredients = form.getValues("ingredients");
    const ingredientsSet = new Set(currentIngredients.split(/, ?/).filter(i => i.trim() !== ""));
    if (ingredientsSet.has(ingredient)) {
      ingredientsSet.delete(ingredient);
    } else {
      ingredientsSet.add(ingredient);
    }
    form.setValue("ingredients", Array.from(ingredientsSet).join(", "), { shouldValidate: true, shouldDirty: true });
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <Card className="lg:col-span-1 sticky top-20">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl"><ChefHat className="mr-2 h-6 w-6 text-primary" /> Recipe Finder</CardTitle>
          <CardDescription>Tell us what you have and any health needs.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onGetSuggestionsSubmit)} className="space-y-6">
              <FormField control={form.control} name="ingredients" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Available Ingredients</FormLabel>
                  <FormControl><Textarea placeholder="e.g., Onions, Tomatoes, Paneer, Rice..." {...field} rows={4} className="bg-background/50" /></FormControl>
                  <FormDescription>Separate ingredients with commas.</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              
              <div className="space-y-2">
                  <FormLabel>Or tap to add common ingredients:</FormLabel>
                  <div className="flex flex-wrap gap-2">
                      {quickAddIngredients.map(ingredient => {
                          const isSelected = (watchedIngredients || "").split(/, ?/).includes(ingredient);
                          return (
                              <Button
                                  key={ingredient}
                                  type="button"
                                  variant={isSelected ? 'default' : 'outline'}
                                  size="sm"
                                  className={cn(
                                      "rounded-full h-auto px-3 py-1 text-xs font-medium transition-all duration-200 ease-in-out hover:scale-105 active:scale-100",
                                      isSelected && "bg-accent text-accent-foreground shadow"
                                  )}
                                  onClick={() => toggleIngredient(ingredient)}
                              >
                                  {isSelected && <Check className="mr-1.5 h-3 w-3" />}
                                  {ingredient}
                              </Button>
                          );
                      })}
                  </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="font-semibold">Health & Household Options</AccordionTrigger>
                  <AccordionContent className="space-y-6 pt-4">
                    <div>
                      <FormLabel>Health Considerations (Optional)</FormLabel>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {diseaseOptions.map((item) => (
                          <FormField key={item.id} control={form.control} name="diseaseConcerns" render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md hover:bg-muted/50 transition-colors">
                              <FormControl><Checkbox checked={field.value?.includes(item.id)} 
                                onCheckedChange={(checked) => {
                                  return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id));
                                }} /></FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer flex items-center gap-1.5"><item.icon className="h-4 w-4 text-muted-foreground"/>{item.label}</FormLabel>
                            </FormItem>
                          )} />
                        ))}
                      </div>
                    </div>

                    <div>
                      <FormLabel>Household Size (for portioning)</FormLabel>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        <FormField control={form.control} name="householdComposition.adults" render={({ field }) => (
                          <FormItem><FormLabel className="text-xs flex items-center gap-1"><User className="h-3 w-3"/>Adults</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="householdComposition.seniors" render={({ field }) => (
                          <FormItem><FormLabel className="text-xs flex items-center gap-1"><UserCog className="h-3 w-3"/>Seniors</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="householdComposition.kids" render={({ field }) => (
                          <FormItem><FormLabel className="text-xs flex items-center gap-1"><Baby className="h-3 w-3"/>Kids</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </div>
                      {form.formState.errors.householdComposition && <FormMessage className="col-span-3">{form.formState.errors.householdComposition.message}</FormMessage>}
                    </div>
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
        {isLoadingSuggestions && (
          <Card>
            <CardHeader><CardTitle>Finding recipe ideas...</CardTitle><CardDescription>Our AI chef is checking the pantry.</CardDescription></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
            </CardContent>
          </Card>
        )}
        
        {dishSuggestions && !detailedRecipe && !isLoadingRecipe && (
          <Card className="animate-fade-in-up opacity-0" style={{animationFillMode: 'forwards'}}>
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-accent"/> Suggested Dishes</CardTitle>
              {dishSuggestions.initialContextualGuidance && <CardDescription>{dishSuggestions.initialContextualGuidance}</CardDescription>}
            </CardHeader>
            <CardContent>
              {dishSuggestions.suggestions.length > 0 && !dishSuggestions.suggestions[0].toLowerCase().includes("sorry") ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dishSuggestions.suggestions.map((dish, index) => (
                    <button
                      key={index}
                      disabled={isLoadingRecipe}
                      onClick={() => handleSelectDish(dish)}
                      className="text-left p-4 border rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <h3 className="font-semibold text-lg flex items-center">
                          <ChefHat className="mr-2 h-5 w-5 text-primary group-hover:text-accent transition-colors"/>
                          {dish}
                        </h3>
                        <p className="text-sm font-semibold text-accent mt-4 group-hover:underline">
                          View Full Recipe &rarr;
                        </p>
                    </button>
                  ))}
                </div>
              ) : <p className="text-muted-foreground">No specific dish suggestions found. Try adjusting your ingredients or health concerns.</p>}
            </CardContent>
          </Card>
        )}

        {isLoadingRecipe && (
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-12 rounded-md" />
                <Skeleton className="h-12 rounded-md" />
                <Skeleton className="h-12 rounded-md" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Skeleton className="h-6 w-1/3 mb-4 rounded-md" />
                  <Skeleton className="h-28 w-full rounded-md" />
                </div>
                <div>
                  <Skeleton className="h-6 w-1/3 mb-4 rounded-md" />
                  <Skeleton className="h-40 w-full rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {detailedRecipe && (
          <Card className="transition-shadow animate-fade-in-up opacity-0" style={{animationFillMode: 'forwards'}}>
            <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center"><FileText className="mr-3 h-7 w-7 text-primary"/> {detailedRecipe.recipeTitle}</CardTitle>
                {detailedRecipe.description && <CardDescription className="mt-1 text-base">{detailedRecipe.description}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm p-4 bg-muted/60 rounded-lg border">
                <div className="flex items-center gap-2"><Clock className="h-5 w-5 text-accent"/><div><div className="font-semibold">Prep Time</div><div>{detailedRecipe.prepTime || 'N/A'}</div></div></div>
                <div className="flex items-center gap-2"><Soup className="h-5 w-5 text-accent"/><div><div className="font-semibold">Cook Time</div><div>{detailedRecipe.cookTime || 'N/A'}</div></div></div>
                <div className="flex items-center gap-2"><Users className="h-5 w-5 text-accent"/><div><div className="font-semibold">Servings</div><div>{detailedRecipe.servingsDescription}</div></div></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-x-8 gap-y-6 pt-4">
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-xl mb-3 border-b pb-2">Ingredients</h3>
                    <ul className="space-y-2 text-sm">
                      {detailedRecipe.adjustedIngredients.map((ing, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-1 shrink-0" />
                          <div>
                            <span className="font-medium">{ing.name}</span>: <span>{ing.quantity}</span>
                            {ing.notes && <div className="text-xs text-muted-foreground">({ing.notes})</div>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="md:col-span-3">
                    <h3 className="font-semibold text-xl mb-3 border-b pb-2">Instructions</h3>
                    <ol className="list-decimal list-outside space-y-3 text-sm pl-5">
                      {detailedRecipe.instructions.map((step, i) => <li key={i} className="pl-1 leading-relaxed">{step}</li>)}
                    </ol>
                  </div>
              </div>
              {detailedRecipe.healthNotes && (
                <Alert variant="default" className="bg-sky-500/10 border-sky-500/20">
                    <Lightbulb className="h-5 w-5 text-sky-600" />
                    <AlertTitle className="font-semibold text-sky-800 dark:text-sky-300">Health Notes & Tips</AlertTitle>
                    <AlertDescription className="text-sky-700/90 dark:text-sky-300/90 whitespace-pre-line text-sm">
                      {detailedRecipe.healthNotes}
                    </AlertDescription>
                  </Alert>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-start pt-4 border-t mt-4">
                <h3 className="font-semibold text-xl mb-2 flex items-center"><MessageCircle className="mr-2 h-5 w-5"/> Chat about this Recipe</h3>
                <p className="text-sm text-muted-foreground mb-4">Ask about substitutions, techniques, or nutrition.</p>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4 mb-4 bg-muted/50">
                  {chatHistory.map((msg, index) => (
                    <div key={index} className={`mb-3 p-3 rounded-lg text-sm shadow-sm max-w-[85%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-secondary text-secondary-foreground mr-auto'}`}>
                      <span className="font-semibold capitalize block mb-1">{msg.role === 'user' ? 'You' : 'AI Chef'}:</span>
                      <span>{msg.content}</span>
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
          <Card className="flex items-center justify-center h-full min-h-[400px] bg-muted/30 border-2 border-dashed">
            <div className="text-center p-8">
                <ChefHat className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-xl font-semibold text-muted-foreground">Your recipe ideas will appear here!</p>
                <p className="text-md text-muted-foreground mt-2 max-w-sm mx-auto">Enter your ingredients on the left and let our AI chef whip up some healthy meal suggestions for you.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

    