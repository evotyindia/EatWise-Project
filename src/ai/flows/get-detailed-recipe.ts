
'use server';
/**
 * @fileOverview AI agent to generate a detailed recipe for a selected dish.
 *
 * - getDetailedRecipe - A function that handles the detailed recipe generation.
 * - GetDetailedRecipeInput - The input type for the getDetailedRecipe function.
 * - GetDetailedRecipeOutput - The return type for the getDetailedRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { DiseaseEnum, HouseholdCompositionSchema } from '@/ai/types/recipe-shared-types';

const GetDetailedRecipeInputSchema = z.object({
  dishName: z.string().describe("The name of the dish selected by the user."),
  availableIngredients: z.string().describe("The original list of ingredients the user has available, comma-separated."),
  userSuggestions: z.string().optional().describe("Any specific user requests that should be reflected in the detailed recipe."),
  diseaseConcerns: z.array(DiseaseEnum).optional().describe("List of health conditions or dietary restrictions (e.g., diabetes, gluten_free). 'none' means no specific dietary disease concern."),
  householdComposition: HouseholdCompositionSchema.describe("Composition of the household for portioning (adults, seniors, kids).")
});
export type GetDetailedRecipeInput = z.infer<typeof GetDetailedRecipeInputSchema>;

// INTERNAL SCHEMA: Add total people for easier prompt logic
const InternalGetDetailedRecipeInputSchema = GetDetailedRecipeInputSchema.extend({
  totalPeople: z.number().describe("The total number of people in the household.")
});

const IngredientDetailSchema = z.object({
  name: z.string().describe("Name of the ingredient, e.g., 'Onion', 'Spinach'."),
  quantity: z.string().describe("Quantity with unit, e.g., '1 large', '200g', '1 cup', '2 tsp'."),
  notes: z.string().describe("Specific preparation notes, e.g., 'finely chopped', 'soaked overnight', 'optional', or 'Essential staple: add if available'.")
});

const GetDetailedRecipeOutputSchema = z.object({
  recipeTitle: z.string().describe("The full title of the recipe, e.g., 'Healthy Palak Paneer'."),
  description: z.string().describe("A brief 2-3 sentence description of the dish, highlighting its healthiness or key features."),
  servingsDescription: z.string().describe("A description of how many people the recipe serves, reflecting the household composition (e.g., 'Serves 2 adults, 1 senior, and 1 child'). State if quantities are generous or average."),
  prepTime: z.string().describe("Estimated preparation time, e.g., '15 minutes'."),
  cookTime: z.string().describe("Estimated cooking time, e.g., '30 minutes'."),
  adjustedIngredients: z.array(IngredientDetailSchema).describe("List of ingredients with quantities adjusted for the household and preparation notes. Focus on using the 'availableIngredients' provided by the user primarily. If essential common pantry staples are missing but absolutely necessary, they can be added with a clear note."),
  instructions: z.array(z.string()).describe("Step-by-step cooking instructions. Each step as a separate string in the array."),
  healthNotes: z.string().describe("Specific health considerations, tips, or modifications for this recipe based on the provided 'diseaseConcerns' (e.g., 'For diabetes, ensure to use minimal oil and monitor carbohydrate content. This recipe uses whole grains which is beneficial.'). If no specific concerns, provide general health benefits."),
  storageOrServingTips: z.string().describe("Tips for storing leftovers or creative serving suggestions.")
});
export type GetDetailedRecipeOutput = z.infer<typeof GetDetailedRecipeOutputSchema>;

export async function getDetailedRecipe(input: GetDetailedRecipeInput): Promise<GetDetailedRecipeOutput> {
  return getDetailedRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getDetailedRecipePrompt',
  input: {schema: InternalGetDetailedRecipeInputSchema}, // Use internal schema
  output: {schema: GetDetailedRecipeOutputSchema},
  config: { output: { format: 'json' } }, // Enforce JSON output
  system: `You are a recipe generation engine. Your ONLY purpose is to generate a JSON object matching the output schema. Adhere to all instructions precisely. Your entire response MUST be a single, valid JSON object that conforms to the output schema. No extra text or explanations.`,
  prompt: `
  TASK: Generate a detailed, delicious, and healthy Indian recipe for "{{dishName}}".

  **CULINARY PHILOSOPHY: The Art of Indian Flavors**
  You are an expert Indian chef. Your goal is not just to list steps, but to teach the user how to create a dish with deep, authentic flavor. Emphasize these core techniques in your instructions:
  - **Tadka (Tempering):** Explain how to bloom whole spices in hot oil or ghee to release their essential oils.
  - **Bhunao (Sautéing):** Stress the importance of sautéing the onion-ginger-garlic paste until golden brown and the tomatoes until they release oil. This is the foundation of flavor.
  - **Layering Spices:** Instruct the user to add powdered spices after the base is sautéed and cook them for a minute to remove their raw taste.
  - **Finishing Touches:** Suggest finishing the dish with a sprinkle of garam masala, fresh coriander, or a squeeze of lemon to brighten the flavors.
  - **Health-conscious cooking:** While prioritizing taste, use healthy techniques. Advise on using minimal oil without compromising flavor and incorporating vegetables creatively.

  **CRITICAL MANDATE: RECIPE SCALING**
  This is your most important instruction. All ingredient quantities and times MUST be scaled for a household of **{{totalPeople}} people**.
  - Household Composition: {{householdComposition.adults}} Adults, {{householdComposition.seniors}} Seniors, {{householdComposition.kids}} Kids.
  - Your baseline for calculation is a standard 2-person recipe.
  - You must calculate a scaling multiplier: **Multiplier = {{totalPeople}} / 2**.
  - Example: If a 2-person recipe needs 1 cup of dal, a 4-person household (Multiplier=2) requires 2 cups of dal. A 1-person household (Multiplier=0.5) requires 1/2 cup of dal.
  - This scaling is **NON-NEGOTIABLE**. Failure to scale every single ingredient quantity and the cooking times correctly means you have failed the entire task.

  **USER-PROVIDED CONTEXT:**
  - Available Ingredients: {{availableIngredients}}
  {{#if diseaseConcerns.length}}
  - Health Concerns: {{#each diseaseConcerns}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
  {{else}}
  - Health Concerns: General healthy preparation.
  {{/if}}
  {{#if userSuggestions}}
  - User's Special Request: "{{userSuggestions}}"
  {{/if}}

  **ADDITIONAL RULES:**
  1.  **User Request Adherence:** You MUST strictly follow the "User's Special Request". If the user asks for "spicy", add more chilies. If they ask for "less oil", reduce the oil quantity. If they ask for a "quick meal", prioritize simple steps and reflect this in prep/cook times. This instruction is as important as recipe scaling.
  2.  **Servings Description:** The 'servingsDescription' field MUST *exactly* match the household composition (e.g., "Serves 2 adults, 1 senior, and 1 child").
  3.  **Ingredient Sourcing & Notes:**
      *   Prioritize using the 'availableIngredients'.
      *   Only add *absolutely essential* Indian pantry staples (e.g., cooking oil, salt, turmeric) if they are missing. In the 'notes' for these, you MUST write: "Essential staple: add if available".
      *   Common Indian spices for flavor (e.g., garam masala, cumin powder) are NOT essential. If you suggest them, the 'notes' field MUST say: "Optional, for flavor".
  4.  **Instructions:** Provide clear, step-by-step instructions that embody the **CULINARY PHILOSOPHY**. Include professional cooking tips within the steps (e.g., "Sauté the onions until they are translucent and light golden at the edges; this develops their sweetness."). Label optional steps clearly.
  5.  **Health Notes:** Provide specific advice tailored to the 'diseaseConcerns' and 'userSuggestions'. If none, give a general health benefit.
  6.  **Language:** Use common Indian names for ingredients (e.g., 'Palak' for Spinach).
  
  Now, generate the JSON output based on these strict instructions.
`,
});

const getDetailedRecipeFlow = ai.defineFlow(
  {
    name: 'getDetailedRecipeFlow',
    inputSchema: GetDetailedRecipeInputSchema, // External API uses original schema
    outputSchema: GetDetailedRecipeOutputSchema,
  },
  async (input) => {
    // Calculate total people before calling the prompt
    const totalPeople = input.householdComposition.adults + input.householdComposition.seniors + input.householdComposition.kids;

    const processedInput: InternalGetDetailedRecipeInputSchema = {...input, totalPeople};
    if (processedInput.diseaseConcerns && processedInput.diseaseConcerns.length === 1 && processedInput.diseaseConcerns[0] === 'none') {
      processedInput.diseaseConcerns = [];
    }

    try {
        const {output} = await prompt(processedInput);
        if (!output) {
          throw new Error("The AI returned an empty or invalid recipe. Please try again.");
        }
        return output;
    } catch (error: any) {
        // Log the full, detailed error to the server console (Vercel logs) for debugging.
        console.error(`An error occurred in getDetailedRecipeFlow:`, error);

        // Provide a clear error message for common deployment/server issues.
        if (error.message?.toLowerCase().includes('api key') || /5\d\d/.test(error.message)) {
            throw new Error('AI service configuration error or service is temporarily unavailable. Please check API key and try again later.');
        }

        // For other errors (like safety blocks), re-throw the original message for better client-side feedback.
        throw new Error(error.message || 'An unexpected error occurred while communicating with the AI service.');
    }
  }
);
