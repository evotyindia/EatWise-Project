
"use client";

import type { GetRecipeSuggestionsInput, GetRecipeSuggestionsOutput } from "@/ai/flows/recipe-suggestions";
import { getRecipeSuggestions } from "@/ai/flows/recipe-suggestions";
import { DiseaseEnum, HouseholdCompositionSchema, type Disease } from "@/ai/types/recipe-shared-types"; 
import type { GetDetailedRecipeInput, GetDetailedRecipeOutput } from "@/ai/flows/get-detailed-recipe";
import { getDetailedRecipe } from "@/ai/flows/get-detailed-recipe";
import type { ContextAwareAIChatInput, ChatMessage } from "@/ai/flows/context-aware-ai-chat";
import { contextAwareAIChat } from "@/ai/flows/context-aware-ai-chat";
import { RecipeDisplay } from "@/components/common/RecipeDisplay";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lightbulb, Sparkles, ChefHat, WheatIcon, HeartCrack, Scale, User, UserCog, Baby, Send, MessageCircle, PlusCircle, ArrowRight, Search, Carrot, Leaf, Flame, Save, Soup } from "lucide-react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";


const diseaseOptions: { id: Disease; label: string; icon: React.ElementType }[] = [
  { id: "diabetes", label: "Diabetes", icon: Scale },
  { id: "high_blood_pressure", label: "High BP", icon: HeartCrack },
  { id: "heart_condition", label: "Heart Condition", icon: HeartCrack },
  { id: "gluten_free", label: "Gluten-Free", icon: WheatIcon },
  { id: "dairy_free", label: "Dairy-Free", icon: WheatIcon },
];

const recipePageInputSchema = z.object({
  ingredients: z.string().min(3, "Please enter at least one ingredient (min 3 chars)."),
  userSuggestions: z.string().optional(),
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

const categorizedIngredients = [
    { 
        category: "Vegetables (Sabziyan)", 
        items: ["Onion (Pyaaz)", "Tomato (Tamatar)", "Potato (Aloo)", "Garlic (Lehsun)", "Ginger (Adrak)", "Green Chili (Hari Mirch)", "Lemon (Nimbu)", "Carrot (Gajar)", "Capsicum (Shimla Mirch)", "Cauliflower (Gobi)", "Cabbage (Patta Gobi)", "Peas (Matar)", "Brinjal (Baingan)", "Okra (Bhindi)", "Cucumber (Kheera)", "Radish (Mooli)", "Beetroot (Chukandar)", "Bottle Gourd (Lauki)", "Ridge Gourd (Turai)", "Bitter Gourd (Karela)", "Pumpkin (Kaddu)", "Sweet Potato (Shakarkandi)", "French Beans", "Cluster Beans (Gawar)", "Drumstick (Sahjan)", "Pointed Gourd (Parwal)", "Tinda (Apple Gourd)", "Colocasia (Arbi)", "Yam (Jimikand)", "Raw Banana (Kachha Kela)", "Raw Papaya (Kachha Papita)", "Mushroom (Khumb)", "Corn (Bhutta)", "Baby Corn", "Bell Peppers (Red/Yellow)", "Turnip (Shalgam)", "Jackfruit (Kathal)", "Green Papaya"] 
    },
    { 
        category: "Leafy Greens (Hari Sabziyan)", 
        items: ["Spinach (Palak)", "Coriander Leaves (Dhaniya)", "Mint Leaves (Pudina)", "Fenugreek Leaves (Methi)", "Mustard Greens (Sarson ka Saag)", "Dill Leaves (Suva)", "Curry Leaves (Kadi Patta)", "Amaranth Leaves (Chaulai)", "Spring Onion (Hari Pyaaz)", "Bathua (Chenopodium)", "Gongura (Sorrel Leaves)"]
    },
    { 
        category: "Spices (Masale) - Ground", 
        items: ["Salt (Namak)", "Turmeric Powder (Haldi)", "Red Chili Powder (Lal Mirch)", "Coriander Powder (Dhaniya)", "Cumin Powder (Jeera)", "Garam Masala", "Black Pepper Powder (Kali Mirch)", "Chaat Masala", "Amchur (Dry Mango Powder)", "Asafoetida (Hing)", "Kashmiri Red Chili", "Kitchen King Masala", "Sambar Masala", "Pav Bhaji Masala", "Chana Masala", "Dry Ginger Powder (Saunth)", "Black Salt (Kala Namak)", "Kasuri Methi (Dried Fenugreek)", "Cinnamon Powder", "Cardamom Powder", "Nutmeg Powder"] 
    },
    { 
        category: "Spices (Masale) - Whole", 
        items: ["Cumin Seeds (Jeera)", "Mustard Seeds (Rai/Sarson)", "Cloves (Laung)", "Cinnamon (Dalchini)", "Green Cardamom (Elaichi)", "Black Cardamom (Badi Elaichi)", "Bay Leaf (Tej Patta)", "Black Peppercorns (Kali Mirch)", "Fenugreek Seeds (Methi Dana)", "Fennel Seeds (Saunf)", "Carom Seeds (Ajwain)", "Dry Red Chilies (Sukhi Lal Mirch)", "Star Anise (Chakra Phool)", "Nutmeg (Jaiphal)", "Mace (Javitri)", "Poppy Seeds (Khas Khas)", "Sesame Seeds (Til)", "Saffron (Kesar)", "Caraway Seeds (Shahi Jeera)"] 
    },
    { 
        category: "Dals & Legumes (Dal aur Phaliyan)", 
        items: ["Toor Dal (Arhar)", "Moong Dal (Split)", "Moong Dal (Whole/Sabut)", "Masoor Dal (Red Lentil)", "Urad Dal (Split/Whole)", "Chana Dal (Bengal Gram)", "Kabuli Chana (Chickpeas)", "Kala Chana (Black Chickpeas)", "Rajma (Kidney Beans)", "Lobia (Black-eyed Peas)", "Soya Beans", "Moth Beans (Matki)", "Horse Gram (Kulthi)", "Green Peas (Dry)", "White Peas (Safed Vatana)"] 
    },
    { 
        category: "Grains & Flours (Anaaj aur Aata)", 
        items: ["Basmati Rice", "Sona Masoori Rice", "Brown Rice", "Poha (Flattened Rice)", "Murmura (Puffed Rice)", "Wheat Flour (Atta)", "Maida (All-purpose Flour)", "Besan (Gram Flour)", "Suji (Semolina/Rava)", "Rice Flour (Chawal ka Atta)", "Corn Flour (Makki ka Atta)", "Ragi Flour (Finger Millet)", "Jowar Flour (Sorghum)", "Bajra Flour (Pearl Millet)", "Oats", "Quinoa", "Sabudana (Tapioca Pearls)", "Bread (White/Brown)", "Vermicelli (Seviyan)", "Barley (Jau)", "Millet (Kodo/Foxtail)"] 
    },
    { 
        category: "Dairy & Alternatives", 
        items: ["Milk (Doodh)", "Curd (Yogurt/Dahi)", "Paneer (Cottage Cheese)", "Ghee", "Butter (Makhan)", "Cream (Malai)", "Khoya (Mawa)", "Cheese", "Condensed Milk", "Buttermilk (Chaas)", "Tofu", "Soy Milk", "Almond Milk", "Coconut Milk", "Cashew Cream"] 
    },
    { 
        category: "Nuts & Dried Fruits (Mewe)", 
        items: ["Almonds (Badam)", "Cashews (Kaju)", "Walnuts (Akhrot)", "Pistachios (Pista)", "Peanuts (Moongphali)", "Raisins (Kishmish)", "Dates (Khajoor)", "Dried Figs (Anjeer)", "Dry Coconut (Nariyal)", "Fox Nuts (Makhana)", "Apricots (Khumani)"] 
    },
    { 
        category: "Oils & Fats (Tel)", 
        items: ["Mustard Oil", "Sunflower Oil", "Groundnut Oil", "Coconut Oil", "Sesame Oil (Til ka Tel)", "Vegetable Oil", "Olive Oil", "Vanaspati"] 
    },
    { 
        category: "Sweeteners (Mithas)", 
        items: ["Sugar (Cheeni)", "Jaggery (Gud)", "Honey (Shahad)", "Brown Sugar", "Stevia", "Palm Sugar"]
    },
    { 
        category: "Pantry Staples, Pastes & Condiments", 
        items: ["Tamarind (Imli)", "Vinegar (Sirka)", "Soy Sauce", "Green Chili Sauce", "Red Chili Sauce", "Tomato Ketchup", "Papad", "Pickle (Achar)", "Baking Soda", "Baking Powder", "Yeast", "Rose Water", "Kewra Water", "Ginger-Garlic Paste", "Tamarind Paste", "Mustard Paste"]
    }
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
  const resultsRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState("");


  const { toast } = useToast();

  const form = useForm<RecipePageFormValues>({
    resolver: zodResolver(recipePageInputSchema),
    defaultValues: {
      ingredients: "",
      userSuggestions: "",
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
  
  const filteredIngredients = useMemo(() => {
    if (!searchTerm) {
        return categorizedIngredients;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return categorizedIngredients
        .map(category => {
            const filteredItems = category.items.filter(item =>
                item.toLowerCase().includes(lowercasedFilter)
            );
            if (category.category.toLowerCase().includes(lowercasedFilter)) {
                return category;
            }
            if (filteredItems.length > 0) {
                return { ...category, items: filteredItems };
            }
            return null;
        })
        .filter((c): c is NonNullable<typeof c> => c !== null);
  }, [searchTerm]);

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
        userSuggestions: data.userSuggestions,
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
    } catch (error: any) {
      console.error("Error getting dish suggestions:", error);
      toast({ title: "Suggestion Failed", description: error.message || "Could not get dish suggestions.", variant: "destructive" });
    }
    setIsLoadingSuggestions(false);
  };

  const handleSelectDish = async (dishName: string) => {
    if (!currentFormInputs) return;

    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

    setIsLoadingRecipe(true);
    setDetailedRecipe(null);
    setChatHistory([]); 

    try {
      const diseases = currentFormInputs.diseaseConcerns?.length ? currentFormInputs.diseaseConcerns : [DiseaseEnum.enum.none];
      const input: GetDetailedRecipeInput = {
        dishName,
        availableIngredients: currentFormInputs.ingredients,
        userSuggestions: currentFormInputs.userSuggestions,
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
    } catch (error: any) {
      console.error("Error getting detailed recipe:", error);
      toast({ title: "Recipe Failed", description: error.message || "Could not generate the detailed recipe.", variant: "destructive" });
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
    } catch (error: any) {
        console.error("Chat init error:", error);
        toast({ title: "Chat Init Failed", description: error.message || "Could not start AI chat.", variant: "destructive" });
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
    } catch (error: any) {
      console.error("Chat error:", error);
      toast({ title: "Chat Error", description: error.message || "Could not get AI response.", variant: "destructive" });
      setChatHistory(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't process that. Please try again." }]);
    }
    setIsChatLoading(false);
  };

  const handleSaveRecipe = () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    if (!loggedInUser.email) {
      toast({ title: "Login Required", description: "You must be logged in to save recipes.", variant: "destructive" });
      return;
    }
    if (!detailedRecipe || !currentFormInputs) {
      toast({ title: "No Recipe", description: "Generate a recipe before saving.", variant: "destructive" });
      return;
    }

    const newReport = {
      id: crypto.randomUUID(),
      userId: loggedInUser.email,
      type: 'recipe' as const,
      title: reportTitle.trim() || detailedRecipe.recipeTitle,
      summary: detailedRecipe.description,
      createdAt: new Date().toISOString(),
      data: detailedRecipe,
      userInput: currentFormInputs
    };

    const allUserReports = JSON.parse(localStorage.getItem("userReports") || "{}");
    if (!allUserReports[loggedInUser.email]) {
      allUserReports[loggedInUser.email] = [];
    }
    allUserReports[loggedInUser.email].push(newReport);
    localStorage.setItem("userReports", JSON.stringify(allUserReports));

    toast({ title: "Recipe Saved", description: "The recipe has been saved to your history." });
    setIsSaveDialogOpen(false);
    setReportTitle("");
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatHistory.length > 1) {
      scrollToBottom();
    }
  }, [chatHistory]);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-4 lg:sticky lg:top-24">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl"><ChefHat className="mr-2 h-6 w-6 text-primary" /> Find a Recipe</CardTitle>
            <CardDescription>Tell us what you have and any health needs.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onGetSuggestionsSubmit)} className="space-y-6">
                <FormField control={form.control} name="ingredients" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Available Ingredients</FormLabel>
                    <FormControl><Textarea placeholder="e.g., Onions, Tomatoes, Paneer, Rice..." {...field} rows={4} className="bg-background/50" /></FormControl>
                    <FormDescription>Type your ingredients separated by commas.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <div className="space-y-2">
                    <Dialog>
                      <DialogTrigger asChild>
                          <Button variant="outline" className="w-full justify-center text-muted-foreground font-medium border-2 border-dashed hover:border-solid hover:bg-accent/10 hover:text-accent transition-all duration-300 ease-in-out group">
                              <PlusCircle className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                              Browse &amp; Add Common Ingredients
                          </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Add Common Ingredients</DialogTitle>
                            <DialogDescription>
                              Click to add or remove ingredients from your list. Use the search to filter.
                            </DialogDescription>
                          </DialogHeader>
                           <div className="relative mt-2 mb-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search for ingredients..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                          <ScrollArea className="h-[400px] -mx-6 px-6">
                              <div className="space-y-4">
                                  {filteredIngredients.length > 0 ? filteredIngredients.map(category => (
                                      <div key={category.category}>
                                          <h4 className="font-semibold mb-2 text-primary">{category.category}</h4>
                                          <div className="flex flex-wrap gap-2">
                                              {category.items.map(ingredient => {
                                                  const isSelected = (watchedIngredients || "").split(/, ?/).map(i => i.trim()).includes(ingredient);
                                                  return (
                                                      <Button
                                                          key={ingredient}
                                                          type="button"
                                                          variant={isSelected ? 'default' : 'outline'}
                                                          size="sm"
                                                          className={cn(
                                                              "rounded-full h-auto px-3 py-1.5 text-xs font-medium transition-colors duration-200 ease-in-out",
                                                              isSelected 
                                                                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                                                  : "hover:bg-muted/70"
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
                                  )) : <p className="text-center text-muted-foreground py-4">No ingredients found for &quot;{searchTerm}&quot;.</p>}
                              </div>
                          </ScrollArea>
                          <DialogFooter>
                              <DialogClose asChild>
                                  <Button type="button">Done</Button>
                              </DialogClose>
                          </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <p className="text-[13px] text-muted-foreground text-center">Click the button above to quickly select from a categorized list of common Indian ingredients.</p>
                </div>

                <FormField
                  control={form.control}
                  name="userSuggestions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Any Specific Requests? (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'Make it extra spicy', 'use less oil', 'I prefer a gravy dish', 'quick 30-minute meal'..."
                          {...field}
                          rows={3}
                          className="bg-background/50"
                        />
                      </FormControl>
                      <FormDescription>Let the AI chef know your preferences.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4 rounded-lg border p-4">
                  <div>
                    <FormLabel className="font-semibold text-base">Health &amp; Household</FormLabel>
                    <FormDescription className="text-xs">Select dietary needs and household size for tailored recipes.</FormDescription>
                  </div>

                  <div className="space-y-3">
                    <FormLabel className="font-medium text-sm">Health Considerations</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {diseaseOptions.map((item) => (
                        <FormField key={item.id} control={form.control} name="diseaseConcerns" render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md hover:bg-muted/50 transition-colors has-[:checked]:bg-muted/80">
                            <FormControl><Checkbox checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id));
                              }} /></FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer flex items-center gap-1.5 w-full"><item.icon className="h-4 w-4 text-muted-foreground" />{item.label}</FormLabel>
                          </FormItem>
                        )} />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                     <FormLabel className="font-medium text-sm">Household Size</FormLabel>
                    <div className="grid grid-cols-3 gap-3">
                      <FormField control={form.control} name="householdComposition.adults" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs flex items-center gap-1"><User className="h-3 w-3" />Adults</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="householdComposition.seniors" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs flex items-center gap-1"><UserCog className="h-3 w-3" />Seniors</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="householdComposition.kids" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs flex items-center gap-1"><Baby className="h-3 w-3" />Kids</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                    {form.formState.errors.householdComposition && <FormMessage className="col-span-3">{form.formState.errors.householdComposition.message}</FormMessage>}
                  </div>
                </div>
                
                <Button type="submit" disabled={isLoadingSuggestions} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-6 !">
                  {isLoadingSuggestions ? "Finding Ideas..." : "Get Dish Ideas"}
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>


      <div ref={resultsRef} className="lg:col-span-8 space-y-8">
        {isLoadingSuggestions && (
          <Card className="flex flex-col items-center justify-center min-h-[400px] text-center overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Finding Recipe Ideas...</CardTitle>
              <CardDescription>Our AI chef is checking the pantry and getting creative!</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-8">
              <div className="relative flex items-center justify-center w-48 h-48">
                <Soup className="w-28 h-28 text-primary animate-simmer" />
                <div className="absolute inset-0">
                    <Leaf className="absolute top-4 left-10 w-8 h-8 text-green-500 animate-toss" style={{ animationDelay: '0s' }}/>
                    <Carrot className="absolute top-8 right-8 w-8 h-8 text-orange-500 animate-toss" style={{ animationDelay: '0.5s' }}/>
                    <Flame className="absolute top-12 left-4 w-8 h-8 text-red-500 animate-toss" style={{ animationDelay: '1s' }}/>
                </div>
              </div>
            </CardContent>
             <CardFooter>
              <p className="text-sm text-muted-foreground">Looking for delicious combinations...</p>
            </CardFooter>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {dishSuggestions.suggestions.map((dish, index) => (
                     <Card 
                        key={index}
                        as="button"
                        disabled={isLoadingRecipe}
                        onClick={() => handleSelectDish(dish)}
                        className="text-left p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <h3 className="font-semibold text-lg flex items-center">
                          <ChefHat className="mr-2 h-5 w-5 text-primary group-hover:text-accent transition-colors"/>
                          {dish}
                        </h3>
                        <p className="text-sm font-semibold text-accent mt-4 flex items-center gap-1 group-hover:underline">
                          View Full Recipe <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </p>
                    </Card>
                  ))}
                </div>
              ) : <p className="text-muted-foreground">No specific dish suggestions found. Try adjusting your ingredients or health concerns.</p>}
            </CardContent>
          </Card>
        )}

        {isLoadingRecipe && (
          <Card className="flex flex-col items-center justify-center min-h-[400px] text-center overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Crafting Your Perfect Recipe...</CardTitle>
              <CardDescription>Our AI chef is preheating the oven and mixing the ingredients!</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-8">
              <div className="relative flex items-center justify-center w-48 h-48">
                <Soup className="w-28 h-28 text-primary animate-simmer" />
                <div className="absolute inset-0">
                    <Leaf className="absolute top-4 left-10 w-8 h-8 text-green-500 animate-toss" style={{ animationDelay: '0s' }}/>
                    <Carrot className="absolute top-8 right-8 w-8 h-8 text-orange-500 animate-toss" style={{ animationDelay: '0.5s' }}/>
                    <Flame className="absolute top-12 left-4 w-8 h-8 text-red-500 animate-toss" style={{ animationDelay: '1s' }}/>
                </div>
              </div>
            </CardContent>
             <CardFooter>
              <p className="text-sm text-muted-foreground">This may take a moment...</p>
            </CardFooter>
          </Card>
        )}
        
        {detailedRecipe && (
          <div className="space-y-8 animate-fade-in-up opacity-0" style={{animationFillMode: 'forwards'}}>
             <div className="flex justify-end">
                <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setReportTitle(detailedRecipe.recipeTitle)}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Recipe
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save Recipe</DialogTitle>
                      <DialogDescription>Give your recipe a name to easily find it later.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="report-name" className="text-right">Name</Label>
                        <Input id="report-name" value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" onClick={handleSaveRecipe}>Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
            </div>
            
            <RecipeDisplay recipe={detailedRecipe} />

            <Card>
              <CardHeader>
                <h3 className="font-semibold text-xl flex items-center"><MessageCircle className="mr-2 h-5 w-5"/> Chat about this Recipe</h3>
                <p className="text-sm text-muted-foreground pt-1">Ask about substitutions, techniques, or nutrition.</p>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>
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
