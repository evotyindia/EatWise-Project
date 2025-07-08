
"use client";

import type { GetRecipeSuggestionsInput, GetRecipeSuggestionsOutput } from "@/ai/flows/recipe-suggestions";
import { getRecipeSuggestions } from "@/ai/flows/recipe-suggestions";
<<<<<<< HEAD
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
=======
import { DiseaseEnum, HouseholdCompositionSchema, type Disease } from "@/ai/types/recipe-shared-types"; 
import type { GetDetailedRecipeInput, GetDetailedRecipeOutput } from "@/ai/flows/get-detailed-recipe";
import { getDetailedRecipe } from "@/ai/flows/get-detailed-recipe";
import type { ContextAwareAIChatInput, ChatMessage } from "@/ai/flows/context-aware-ai-chat";
import { contextAwareAIChat } from "@/ai/flows/context-aware-ai-chat";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lightbulb, Sparkles, ChefHat, WheatIcon, HeartCrack, Scale, User, UserCog, Baby, Send, MessageCircle, FileText, Check, Clock, Soup, Users, PlusCircle, BookOpen, ListChecks, ArrowRight, Search } from "lucide-react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
>>>>>>> finalprotest
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
<<<<<<< HEAD
import { Alert, AlertDescription as UIAlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PrintableDetailedRecipe } from "@/components/common/PrintableDetailedRecipe";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
=======
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
>>>>>>> finalprotest


const diseaseOptions: { id: Disease; label: string; icon: React.ElementType }[] = [
  { id: "diabetes", label: "Diabetes", icon: Scale },
  { id: "high_blood_pressure", label: "High BP", icon: HeartCrack },
  { id: "heart_condition", label: "Heart Condition", icon: HeartCrack },
  { id: "gluten_free", label: "Gluten-Free", icon: WheatIcon },
<<<<<<< HEAD
  { id: "dairy_free", label: "Dairy-Free", icon: MinusCircle },
=======
  { id: "dairy_free", label: "Dairy-Free", icon: WheatIcon },
>>>>>>> finalprotest
];

const recipePageInputSchema = z.object({
  ingredients: z.string().min(3, "Please enter at least one ingredient (min 3 chars)."),
<<<<<<< HEAD
=======
  userSuggestions: z.string().optional(),
>>>>>>> finalprotest
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

<<<<<<< HEAD
const ingredientCategories = [
  { name: "Vegetables", icon: <Leaf className="text-green-500" />, items: ["Onion", "Tomato", "Potato", "Spinach", "Carrot", "Capsicum", "Ginger", "Garlic", "Cauliflower", "Peas", "Beans", "Ladyfinger (Okra)", "Cabbage", "Mushroom", "Broccoli", "Cucumber", "Radish", "Beetroot", "Coriander Leaves", "Mint Leaves", "Green Chili", "Lemon", "Bottle Gourd (Lauki)", "Ridge Gourd (Turai)", "Brinjal (Eggplant)", "Sweet Potato"] },
  { name: "Spices & Herbs", icon: <Sparkles className="text-yellow-500" />, items: ["Turmeric Powder", "Cumin Powder", "Coriander Powder", "Garam Masala", "Red Chili Powder", "Mustard Seeds", "Asafoetida (Hing)", "Fenugreek Seeds (Methi)", "Cumin Seeds (Jeera)", "Black Pepper", "Cardamom (Elaichi)", "Cloves (Laung)", "Cinnamon (Dalchini)", "Bay Leaf (Tej Patta)", "Salt", "Kasuri Methi (Dry Fenugreek)", "Curry Leaves", "Saffron (Kesar)"] },
  { name: "Dals & Legumes", icon: <Utensils className="text-orange-500" />, items: ["Moong Dal (Yellow Lentil)", "Toor Dal (Arhar/Pigeon Pea)", "Chana Dal (Split Chickpea)", "Masoor Dal (Red Lentil)", "Rajma (Kidney Beans)", "Chickpeas (Chole/Kabuli Chana)", "Black Eyed Peas (Lobia)", "Urad Dal (Black Gram)", "Green Gram (Sabut Moong)", "Black Chickpeas (Kala Chana)"] },
  { name: "Grains & Flours", icon: <WheatIcon className="text-amber-700" />, items: ["Rice (Basmati)", "Rice (Sona Masoori/Regular)", "Wheat Flour (Atta)", "Besan (Gram Flour)", "Suji (Semolina/Rava)", "Poha (Flattened Rice)", "Maida (All-purpose flour)", "Ragi Flour (Finger Millet)", "Jowar Flour (Sorghum)", "Bajra Flour (Pearl Millet)", "Bread (Whole Wheat/White)", "Oats", "Quinoa"] },
  { name: "Dairy & Fats", icon: <Milk className="text-blue-400" />, items: ["Paneer (Indian Cheese)", "Curd (Yogurt/Dahi)", "Milk", "Ghee (Clarified Butter)", "Butter", "Cooking Oil (Sunflower)", "Cooking Oil (Mustard)", "Cooking Oil (Groundnut)", "Olive Oil", "Coconut Oil", "Cream (Malai)", "Cheese (Processed/Cheddar)"] },
  { name: "Sweeteners, Nuts & Seeds", icon: <Cookie className="text-yellow-700" />, items: ["Sugar", "Jaggery (Gur)", "Honey", "Almonds (Badam)", "Cashews (Kaju)", "Raisins (Kishmish)", "Walnuts (Akhrot)", "Peanuts (Moongphali)", "Pistachios (Pista)", "Coconut (Fresh/Dry)", "Poppy Seeds (Khas Khas)", "Sesame Seeds (Til)", "Flax Seeds (Alsi)", "Chia Seeds"] }
=======
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
>>>>>>> finalprotest
];

export function RecipeForm() {
  const [dishSuggestions, setDishSuggestions] = useState<GetRecipeSuggestionsOutput | null>(null);
  const [detailedRecipe, setDetailedRecipe] = useState<GetDetailedRecipeOutput | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
<<<<<<< HEAD
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);
=======
>>>>>>> finalprotest
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [currentFormInputs, setCurrentFormInputs] = useState<RecipePageFormValues | null>(null);
<<<<<<< HEAD

  const { toast } = useToast();
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);
=======
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");


  const { toast } = useToast();
>>>>>>> finalprotest

  const form = useForm<RecipePageFormValues>({
    resolver: zodResolver(recipePageInputSchema),
    defaultValues: {
      ingredients: "",
<<<<<<< HEAD
=======
      userSuggestions: "",
>>>>>>> finalprotest
      diseaseConcerns: [],
      householdComposition: { adults: "1", seniors: "0", kids: "0" },
    },
  });

<<<<<<< HEAD
  const addIngredientToForm = (ingredient: string) => {
    const currentIngredients = form.getValues("ingredients");
    const newIngredients = currentIngredients ? `${currentIngredients}, ${ingredient}` : ingredient;
    form.setValue("ingredients", newIngredients, { shouldValidate: true });
  };
=======
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
>>>>>>> finalprotest

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
<<<<<<< HEAD
=======
        userSuggestions: data.userSuggestions,
>>>>>>> finalprotest
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
<<<<<<< HEAD
    } catch (error) {
      console.error("Error getting dish suggestions:", error);
      toast({ title: "Error", description: "Failed to get dish suggestions. Please try again.", variant: "destructive" });
=======
    } catch (error: any) {
      console.error("Error getting dish suggestions:", error);
      toast({ title: "Suggestion Failed", description: error.message || "Could not get dish suggestions.", variant: "destructive" });
>>>>>>> finalprotest
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
<<<<<<< HEAD
=======
        userSuggestions: currentFormInputs.userSuggestions,
>>>>>>> finalprotest
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
<<<<<<< HEAD
    } catch (error) {
      console.error("Error getting detailed recipe:", error);
      toast({ title: "Error", description: "Failed to get detailed recipe. Please try again.", variant: "destructive" });
=======
    } catch (error: any) {
      console.error("Error getting detailed recipe:", error);
      toast({ title: "Recipe Failed", description: error.message || "Could not generate the detailed recipe.", variant: "destructive" });
>>>>>>> finalprotest
    }
    setIsLoadingRecipe(false);
  };
  
<<<<<<< HEAD
  const initiateChatWithWelcome = async (contextType: "recipe" | "labelAnalysis" | "nutritionAnalysis" | "general", contextData: any) => {
=======
  const initiateChatWithWelcome = async (contextType: "recipe", contextData: any) => {
>>>>>>> finalprotest
    setIsChatLoading(true);
    setChatHistory([]); 
    const input: ContextAwareAIChatInput = {
        userQuestion: "INIT_CHAT_WELCOME",
        contextType: contextType,
<<<<<<< HEAD
        recipeContext: contextType === "recipe" ? contextData : undefined,
=======
        recipeContext: contextData,
>>>>>>> finalprotest
    };
    try {
        const aiResponse = await contextAwareAIChat(input);
        setChatHistory([{ role: "assistant", content: aiResponse.answer }]);
<<<<<<< HEAD
    } catch (error) {
        console.error("Chat init error:", error);
=======
    } catch (error: any) {
        console.error("Chat init error:", error);
        toast({ title: "Chat Init Failed", description: error.message || "Could not start AI chat.", variant: "destructive" });
>>>>>>> finalprotest
        setChatHistory([{ role: "assistant", content: "Hello! How can I help you today?" }]);
    }
    setIsChatLoading(false);
  };

<<<<<<< HEAD

=======
>>>>>>> finalprotest
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !detailedRecipe) return;

    const userMessage: ChatMessage = { role: "user", content: chatInput };
<<<<<<< HEAD
    const newChatHistory = [...chatHistory, userMessage];
    setChatHistory(newChatHistory);
=======
    setChatHistory(prev => [...prev, userMessage]);
>>>>>>> finalprotest
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
<<<<<<< HEAD
    } catch (error) {
      console.error("Chat error:", error);
      setChatHistory(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't process that. Please try again." }]);
      toast({ title: "Chat Error", description: "Could not get AI response.", variant: "destructive" });
=======
    } catch (error: any) {
      console.error("Chat error:", error);
      toast({ title: "Chat Error", description: error.message || "Could not get AI response.", variant: "destructive" });
      setChatHistory(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't process that. Please try again." }]);
>>>>>>> finalprotest
    }
    setIsChatLoading(false);
  };
  
<<<<<<< HEAD
  useEffect(() => {
    if (chatScrollAreaRef.current) {
      chatScrollAreaRef.current.scrollTop = chatScrollAreaRef.current.scrollHeight;
=======
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatHistory.length > 1) {
      scrollToBottom();
>>>>>>> finalprotest
    }
  }, [chatHistory]);


<<<<<<< HEAD
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
          <h3 className="text-md font-medium mb-3 sticky top-0 bg-card py-1 z-10">Quick Add Common Ingredients:</h3>
          <ScrollArea className="h-80 pr-3"> {/* Changed max-h-80 to h-80 for fixed height */}
            <Accordion type="multiple" className="w-full">
              {ingredientCategories.map((category, index) => (
                <AccordionItem value={`category-${index}`} key={category.name}>
                  <AccordionTrigger className="text-sm font-semibold py-2 hover:no-underline [&[data-state=open]>svg]:text-primary">
                    <div className="flex items-center">{React.cloneElement(category.icon, { className: cn(category.icon.props.className, "mr-2 h-4 w-4") })} {category.name}</div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-1.5 pt-1 pb-3">
                      {category.items.map(item => (
                        <Button 
                          key={item} 
                          variant="outline" 
                          size="sm" 
                          onClick={() => addIngredientToForm(item)} 
                          className="text-xs px-2 py-1 h-auto rounded-full hover:bg-primary/10 hover:border-primary transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95"
                        >
                          {item}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="md:col-span-2 space-y-8">
        {isLoadingSuggestions && ( <Card className="flex items-center justify-center h-64"><Sparkles className="h-12 w-12 text-primary animate-spin" /><p className="ml-3">Finding dish ideas...</p></Card> )}
        
        {dishSuggestions && !detailedRecipe && (
          <Card className="shadow-lg">
=======
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


      <div className="lg:col-span-8 space-y-8">
        {isLoadingSuggestions && (
          <Card>
            <CardHeader><CardTitle>Finding recipe ideas...</CardTitle><CardDescription>Our AI chef is checking the pantry.</CardDescription></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <Skeleton className="h-28 rounded-lg" />
              <Skeleton className="h-28 rounded-lg" />
              <Skeleton className="h-28 rounded-lg" />
              <Skeleton className="h-28 rounded-lg" />
              <Skeleton className="h-28 rounded-lg" />
              <Skeleton className="h-28 rounded-lg" />
              <Skeleton className="h-28 rounded-lg" />
              <Skeleton className="h-28 rounded-lg" />
            </CardContent>
          </Card>
        )}
        
        {dishSuggestions && !detailedRecipe && !isLoadingRecipe && (
          <Card className="animate-fade-in-up opacity-0" style={{animationFillMode: 'forwards'}}>
>>>>>>> finalprotest
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-accent"/> Suggested Dishes</CardTitle>
              {dishSuggestions.initialContextualGuidance && <CardDescription>{dishSuggestions.initialContextualGuidance}</CardDescription>}
            </CardHeader>
            <CardContent>
<<<<<<< HEAD
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
=======
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
>>>>>>> finalprotest
            </CardContent>
          </Card>
        )}

<<<<<<< HEAD
        {isLoadingRecipe && ( <Card className="flex items-center justify-center h-64"><Sparkles className="h-12 w-12 text-primary animate-spin" /><p className="ml-3">Generating detailed recipe...</p></Card> )}

        {detailedRecipe && (
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl flex items-center"><FileText className="mr-2 h-6 w-6 text-primary"/> {detailedRecipe.recipeTitle}</CardTitle>
                <Button onClick={handleDownloadRecipePdf} variant="outline" size="sm" disabled={isPdfDownloading}>
                  {isPdfDownloading ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />} Download PDF
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
=======
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
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                  <Skeleton className="h-6 w-1/3 mb-4 rounded-md" />
                  <Skeleton className="h-40 w-full rounded-md" />
                </div>
                <div className="lg:col-span-3">
                  <Skeleton className="h-6 w-1/3 mb-4 rounded-md" />
                  <Skeleton className="h-56 w-full rounded-md" />
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
                <div className="flex items-center gap-2"><Clock className="h-5 w-5 text-accent"/><div><div className="font-semibold">Prep Time</div><div>{detailedRecipe.prepTime}</div></div></div>
                <div className="flex items-center gap-2"><Soup className="h-5 w-5 text-accent"/><div><div className="font-semibold">Cook Time</div><div>{detailedRecipe.cookTime}</div></div></div>
                <div className="flex items-center gap-2"><Users className="h-5 w-5 text-accent"/><div><div className="font-semibold">Servings</div><div>{detailedRecipe.servingsDescription}</div></div></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-8 gap-y-6 pt-4">
                  <div className="lg:col-span-2">
                    <h3 className="font-semibold text-xl mb-3 border-b pb-2 flex items-center gap-2"><ListChecks /> Ingredients</h3>
                    <ul className="space-y-2.5 text-sm">
                      {detailedRecipe.adjustedIngredients.map((ing, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2.5 mt-1 shrink-0" />
                          <div>
                            <span className="font-medium">{ing.name}</span>: <span>{ing.quantity}</span>
                            <div className="text-xs text-muted-foreground">({ing.notes})</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="lg:col-span-3">
                    <h3 className="font-semibold text-xl mb-3 border-b pb-2 flex items-center gap-2"><BookOpen /> Instructions</h3>
                    <ol className="list-decimal list-outside space-y-3.5 text-sm pl-5 marker:text-primary marker:font-semibold">
                      {detailedRecipe.instructions.map((step, i) => <li key={i} className="pl-2 leading-relaxed">{step}</li>)}
                    </ol>
                  </div>
              </div>
              <Alert variant="success">
                <Lightbulb className="h-5 w-5" />
                <AlertTitle>Health Notes &amp; Tips</AlertTitle>
                <AlertDescription className="whitespace-pre-line text-sm">
                  {detailedRecipe.healthNotes}
                </AlertDescription>
              </Alert>
              <Alert>
                  <Lightbulb className="h-5 w-5" />
                  <AlertTitle>Storage &amp; Serving Tips</AlertTitle>
                  <AlertDescription className="whitespace-pre-line text-sm">
                    {detailedRecipe.storageOrServingTips}
                  </AlertDescription>
              </Alert>
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
>>>>>>> finalprotest
                  <Button type="submit" disabled={isChatLoading || !chatInput.trim()}><Send className="h-4 w-4" /></Button>
                </form>
            </CardFooter>
          </Card>
        )}
        
        {!isLoadingSuggestions && !dishSuggestions && !detailedRecipe && !isLoadingRecipe &&(
<<<<<<< HEAD
           <Card className="flex items-center justify-center h-full min-h-[300px] bg-muted/30 md:col-span-2">
            <div className="text-center p-8">
                <ChefHat className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-xl font-semibold text-muted-foreground">Let's find some recipes!</p>
                <p className="text-md text-muted-foreground">Enter your ingredients and preferences to get started.</p>
=======
          <Card className="flex items-center justify-center h-full min-h-[400px] bg-muted/30 border-2 border-dashed">
            <div className="text-center p-8">
                <ChefHat className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-xl font-semibold text-muted-foreground">Your recipe ideas will appear here!</p>
                <p className="text-md text-muted-foreground mt-2 max-w-sm mx-auto">Enter your ingredients on the left and let our AI chef whip up some healthy meal suggestions for you.</p>
>>>>>>> finalprotest
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
<<<<<<< HEAD

    
=======
>>>>>>> finalprotest
