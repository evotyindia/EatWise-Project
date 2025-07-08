
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
<<<<<<< HEAD
=======
  userSuggestions: z.string().optional().describe("Any specific user requests that should be reflected in the detailed recipe."),
>>>>>>> finalprotest
  diseaseConcerns: z.array(DiseaseEnum).optional().describe("List of health conditions or dietary restrictions (e.g., diabetes, gluten_free). 'none' means no specific dietary disease concern."),
  householdComposition: HouseholdCompositionSchema.describe("Composition of the household for portioning (adults, seniors, kids).")
});
export type GetDetailedRecipeInput = z.infer<typeof GetDetailedRecipeInputSchema>;

<<<<<<< HEAD
const IngredientDetailSchema = z.object({
  name: z.string().describe("Name of the ingredient, e.g., 'Onion', 'Spinach'."),
  quantity: z.string().describe("Quantity with unit, e.g., '1 large', '200g', '1 cup', '2 tsp'."),
  notes: z.string().optional().describe("Specific preparation notes, e.g., 'finely chopped', 'soaked overnight', 'optional', or 'Essential staple: add if available'.")
=======
// INTERNAL SCHEMA: Add total people for easier prompt logic
const InternalGetDetailedRecipeInputSchema = GetDetailedRecipeInputSchema.extend({
  totalPeople: z.number().describe("The total number of people in the household.")
});

const IngredientDetailSchema = z.object({
  name: z.string().describe("Name of the ingredient, e.g., 'Onion', 'Spinach'."),
  quantity: z.string().describe("Quantity with unit, e.g., '1 large', '200g', '1 cup', '2 tsp'."),
  notes: z.string().describe("Specific preparation notes, e.g., 'finely chopped', 'soaked overnight', 'optional', or 'Essential staple: add if available'.")
>>>>>>> finalprotest
});

const GetDetailedRecipeOutputSchema = z.object({
  recipeTitle: z.string().describe("The full title of the recipe, e.g., 'Healthy Palak Paneer'."),
<<<<<<< HEAD
  description: z.string().optional().describe("A brief 2-3 sentence description of the dish, highlighting its healthiness or key features."),
  servingsDescription: z.string().describe("A description of how many people the recipe serves, reflecting the household composition (e.g., 'Serves 2 adults, 1 senior, and 1 child'). State if quantities are generous or average."),
  prepTime: z.string().optional().describe("Estimated preparation time, e.g., '15 minutes'."),
  cookTime: z.string().optional().describe("Estimated cooking time, e.g., '30 minutes'."),
  adjustedIngredients: z.array(IngredientDetailSchema).describe("List of ingredients with quantities adjusted for the household and preparation notes. Focus on using the 'availableIngredients' provided by the user primarily. If essential common pantry staples are missing but absolutely necessary, they can be added with a clear note."),
  instructions: z.array(z.string()).describe("Step-by-step cooking instructions. Each step as a separate string in the array."),
  healthNotes: z.string().optional().describe("Specific health considerations, tips, or modifications for this recipe based on the provided 'diseaseConcerns' (e.g., 'For diabetes, ensure to use minimal oil and monitor carbohydrate content. This recipe uses whole grains which is beneficial.'). If no specific concerns, provide general health benefits."),
  storageOrServingTips: z.string().optional().describe("Tips for storing leftovers or creative serving suggestions.")
=======
  description: z.string().describe("A brief 2-3 sentence description of the dish, highlighting its healthiness or key features."),
  servingsDescription: z.string().describe("A description of how many people the recipe serves, reflecting the household composition (e.g., 'Serves 2 adults, 1 senior, and 1 child'). State if quantities are generous or average."),
  prepTime: z.string().describe("Estimated preparation time, e.g., '15 minutes'."),
  cookTime: z.string().describe("Estimated cooking time, e.g., '30 minutes'."),
  adjustedIngredients: z.array(IngredientDetailSchema).describe("List of ingredients with quantities adjusted for the household and preparation notes. Focus on using the 'availableIngredients' provided by the user primarily. If essential common pantry staples are missing but absolutely necessary, they can be added with a clear note."),
  instructions: z.array(z.string()).describe("Step-by-step cooking instructions. Each step as a separate string in the array."),
  healthNotes: z.string().describe("Specific health considerations, tips, or modifications for this recipe based on the provided 'diseaseConcerns' (e.g., 'For diabetes, ensure to use minimal oil and monitor carbohydrate content. This recipe uses whole grains which is beneficial.'). If no specific concerns, provide general health benefits."),
  storageOrServingTips: z.string().describe("Tips for storing leftovers or creative serving suggestions.")
>>>>>>> finalprotest
});
export type GetDetailedRecipeOutput = z.infer<typeof GetDetailedRecipeOutputSchema>;

export async function getDetailedRecipe(input: GetDetailedRecipeInput): Promise<GetDetailedRecipeOutput> {
  return getDetailedRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getDetailedRecipePrompt',
<<<<<<< HEAD
  input: {schema: GetDetailedRecipeInputSchema},
  output: {schema: GetDetailedRecipeOutputSchema},
  prompt: `You are an expert Indian chef and nutritionist. Generate a detailed, healthy recipe for the dish: "{{dishName}}".

User's Available Ingredients: {{availableIngredients}}
Household Composition:
- Adults (18-60): {{householdComposition.adults}}
- Seniors (60+): {{householdComposition.seniors}}
- Kids (2-17): {{householdComposition.kids}}

{{#if diseaseConcerns.length}}
Health Considerations/Dietary Restrictions: {{#each diseaseConcerns}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
{{else}}
Health Considerations/Dietary Restrictions: Focus on general healthy preparation (user may have selected 'none' or no specific concerns).
{{/if}}

Your task is to provide a complete recipe with the following details:
1.  **Recipe Title**: Full title for "{{dishName}}".
2.  **Description**: A brief 2-3 sentence description.
3.  **Servings Description**: Clearly state who it serves based on 'householdComposition'. Crucially, ensure the quantities are genuinely sufficient and practical for this number of people. Indicate if portions are generous or average. (e.g., "Serves 2 adults, 1 senior, and 1 child. Portions are average.").
4.  **Prep Time**: Estimated preparation time.
5.  **Cook Time**: Estimated cooking time.
6.  **Adjusted Ingredients**:
    *   List all necessary ingredients with quantities *carefully and realistically adjusted* to be sufficient for the specified 'householdComposition'. Quantities must be practical and sufficient for the number of people indicated.
    *   Your primary source of ingredients MUST be the 'availableIngredients' list provided by the user.
    *   If, and only if, *essential* common Indian pantry staples (e.g., cooking oil, salt, turmeric powder, cumin seeds, mustard seeds, asafoetida) are *missing* from 'availableIngredients' BUT are *absolutely critical* for preparing "{{dishName}}", you may include a maximum of 2-3 such staples.
    *   For these *added essential staples*, the 'notes' field for the ingredient MUST clearly state something like "Essential for this dish; add if available" or "Commonly used staple, recommended for authenticity". Do NOT add optional flavor enhancers unless they are in the user's list.
    *   For each ingredient, provide its name, quantity (e.g., "1 cup", "200g", "1 medium onion"), and any prep notes (e.g., "finely chopped", "soaked").
7.  **Instructions**: Clear, step-by-step cooking instructions.
8.  **Health Notes**: Provide specific advice or modifications based on 'diseaseConcerns'. If no concerns, give general health benefits or tips for making it even healthier. For example, suggest alternative grains, low-sodium options, or cooking methods.
9.  **Storage or Serving Tips**: (Optional) Any useful tips.

IMPORTANT:
*   The recipe must be healthy and suitable for an Indian palate.
*   Pay close attention to the 'diseaseConcerns' and 'householdComposition' to tailor the recipe (e.g. spiciness for kids/seniors, ingredient choices for diabetics like using less sugar/specific carbs). Quantities must be appropriate and sufficient.
*   If 'gluten_free' is a concern, ensure all ingredients and instructions align (e.g., specify gluten-free asafoetida if used, suggest gluten-free flour alternatives).
*   If 'dairy_free' is a concern, suggest dairy-free alternatives (e.g., plant-based milk/yogurt, oil instead of ghee).
*   Your entire response MUST be a single, valid JSON object that conforms to the output schema. Do not include any text or explanations outside of this JSON object.
=======
  input: {schema: InternalGetDetailedRecipeInputSchema}, // Use internal schema
  output: {schema: GetDetailedRecipeOutputSchema},
  system: `You are a recipe generation engine. Your ONLY purpose is to generate a JSON object matching the output schema. Adhere to all instructions precisely. Your entire response MUST be a single, valid JSON object that conforms to the output schema. No extra text or explanations.`,
  prompt: `
  TASK: Generate a detailed Indian recipe for "{{dishName}}".

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
  4.  **Instructions:** Provide clear, step-by-step instructions with professional cooking tips. Label optional steps clearly (e.g., start with "(Optional)").
  5.  **Health Notes:** Provide specific advice tailored to the 'diseaseConcerns' and 'userSuggestions'. If none, give a general health benefit.
  6.  **Language:** Use common Indian names for ingredients (e.g., 'Palak' for Spinach).
  
  Now, generate the JSON output based on these strict instructions.
>>>>>>> finalprotest
`,
});

const getDetailedRecipeFlow = ai.defineFlow(
  {
    name: 'getDetailedRecipeFlow',
<<<<<<< HEAD
    inputSchema: GetDetailedRecipeInputSchema,
    outputSchema: GetDetailedRecipeOutputSchema,
  },
  async (input) => {
    const processedInput = {...input};
=======
    inputSchema: GetDetailedRecipeInputSchema, // External API uses original schema
    outputSchema: GetDetailedRecipeOutputSchema,
  },
  async (input) => {
    // Calculate total people before calling the prompt
    const totalPeople = input.householdComposition.adults + input.householdComposition.seniors + input.householdComposition.kids;

    const processedInput: InternalGetDetailedRecipeInputSchema = {...input, totalPeople};
>>>>>>> finalprotest
    if (processedInput.diseaseConcerns && processedInput.diseaseConcerns.length === 1 && processedInput.diseaseConcerns[0] === 'none') {
      processedInput.diseaseConcerns = [];
    }

<<<<<<< HEAD
    const {output} = await prompt(processedInput);
    if (!output) {
      console.error('getDetailedRecipeFlow: LLM output was null or did not match schema for input:', JSON.stringify(processedInput));
      const household = input.householdComposition;
      const servingsText = `Serves ${household.adults} adult(s), ${household.seniors} senior(s), ${household.kids} kid(s) (approx).`;
      return {
        recipeTitle: `Error generating recipe for ${input.dishName}`,
        description: "Could not generate recipe details at this time. The AI was unable to produce a valid recipe. Please check your inputs or try again.",
        servingsDescription: servingsText, // Ensure this reflects the input household
        adjustedIngredients: [{name: "Error", quantity: "N/A", notes: "Could not retrieve ingredients due to an AI processing error."}],
        instructions: ["Failed to generate instructions. Please try again later."],
        healthNotes: "Health notes could not be generated.",
        storageOrServingTips: undefined,
        prepTime: undefined,
        cookTime: undefined
      };
    }
    return output;
  }
);

=======
    try {
        const {output} = await prompt(processedInput);
        if (!output) {
          throw new Error("The AI returned an empty or invalid recipe. Please try again.");
        }
        return output;
    } catch (error: any) {
        const errorMessage = error.message?.toLowerCase() || '';
        if (errorMessage.includes('api key not found') || errorMessage.includes('permission denied')) {
            console.error("Authentication error in getDetailedRecipeFlow:", error);
            throw new Error("Authentication Error: The AI service API key is missing or invalid. Please check your server environment variables.");
        }
        
        console.error("An API error occurred in getDetailedRecipeFlow:", error);
        throw new Error("Failed to generate the recipe. The AI service may be temporarily unavailable.");
    }
  }
);
>>>>>>> finalprotest
