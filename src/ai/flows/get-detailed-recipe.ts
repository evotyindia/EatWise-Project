
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
  notes: z.string().optional().describe("Specific preparation notes, e.g., 'finely chopped', 'soaked overnight', 'optional', or 'Essential staple: add if available'.")
});

const GetDetailedRecipeOutputSchema = z.object({
  recipeTitle: z.string().describe("The full title of the recipe, e.g., 'Healthy Palak Paneer'."),
  description: z.string().optional().describe("A brief 2-3 sentence description of the dish, highlighting its healthiness or key features."),
  servingsDescription: z.string().describe("A description of how many people the recipe serves, reflecting the household composition (e.g., 'Serves 2 adults, 1 senior, and 1 child'). State if quantities are generous or average."),
  prepTime: z.string().optional().describe("Estimated preparation time, e.g., '15 minutes'."),
  cookTime: z.string().optional().describe("Estimated cooking time, e.g., '30 minutes'."),
  adjustedIngredients: z.array(IngredientDetailSchema).describe("List of ingredients with quantities adjusted for the household and preparation notes. Focus on using the 'availableIngredients' provided by the user primarily. If essential common pantry staples are missing but absolutely necessary, they can be added with a clear note."),
  instructions: z.array(z.string()).describe("Step-by-step cooking instructions. Each step as a separate string in the array."),
  healthNotes: z.string().optional().describe("Specific health considerations, tips, or modifications for this recipe based on the provided 'diseaseConcerns' (e.g., 'For diabetes, ensure to use minimal oil and monitor carbohydrate content. This recipe uses whole grains which is beneficial.'). If no specific concerns, provide general health benefits."),
  storageOrServingTips: z.string().optional().describe("Tips for storing leftovers or creative serving suggestions.")
});
export type GetDetailedRecipeOutput = z.infer<typeof GetDetailedRecipeOutputSchema>;

export async function getDetailedRecipe(input: GetDetailedRecipeInput): Promise<GetDetailedRecipeOutput> {
  return getDetailedRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getDetailedRecipePrompt',
  input: {schema: InternalGetDetailedRecipeInputSchema}, // Use internal schema
  output: {schema: GetDetailedRecipeOutputSchema},
  prompt: `You are an expert Indian chef and nutritionist generating a recipe for "{{dishName}}".
Your most important task is to meticulously scale the recipe for a household of **{{totalPeople}} people**.

**Household Details:**
- Total People: {{totalPeople}}
- Adults (18-60): {{householdComposition.adults}}
- Seniors (60+): {{householdComposition.seniors}}
- Kids (2-17): {{householdComposition.kids}}

**User's Available Ingredients:** {{availableIngredients}}

{{#if diseaseConcerns.length}}
**Health Considerations:** {{#each diseaseConcerns}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
{{else}}
**Health Considerations:** General healthy preparation.
{{/if}}

**STRICT RECIPE GENERATION RULES:**

1.  **QUANTITY SCALING (MANDATORY):**
    *   You MUST accurately scale all ingredient quantities for the **{{totalPeople}}-person** household.
    *   Assume a standard recipe serves 2 people. Your baseline for calculation must be a 2-person recipe.
    *   **Example:** If the household has 4 people, ingredients must be doubled. If it has 1 person, ingredients must be halved. This is a critical, non-negotiable instruction. Failure to scale correctly will result in an incorrect recipe.

2.  **TIME SCALING (MANDATORY):**
    *   Prep and cook times MUST be realistically adjusted for the calculated ingredient quantities. Cooking for more people takes longer. Provide practical estimates.

3.  **SERVINGS DESCRIPTION (MANDATORY):**
    *   The 'servingsDescription' field MUST *exactly* reflect the household composition (e.g., "Serves 2 adults, 1 senior, and 1 child").

4.  **INGREDIENTS LIST:**
    *   Prioritize using the 'availableIngredients' from the user.
    *   Only add *absolutely essential* Indian pantry staples (e.g., cooking oil, salt, turmeric) if they are missing. In the 'notes' field for these items, you must write: "Essential staple: add if available".
    *   Common Indian spices for flavor (e.g., garam masala, cumin powder) MUST be listed with the note "Optional, for flavor".

5.  **INSTRUCTIONS:**
    *   Provide clear, step-by-step instructions.
    *   Clearly label optional steps, for instance, by starting a step with "(Optional)".
    *   Include professional cooking tips (e.g., "Sauté onions until translucent, not brown, for a sweeter base.").

6.  **HEALTH NOTES:**
    *   Provide specific advice tailored to the 'diseaseConcerns'. If none, give general health benefits.

7.  **OUTPUT FORMAT:**
    *   Use common Indian names for ingredients (e.g., 'Palak' for Spinach).
    *   Tailor spice levels for the household (milder for kids/seniors).
    *   Your entire response MUST be a single, valid JSON object conforming to the output schema. No extra text.
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

    const processedInput = {...input, totalPeople};
    if (processedInput.diseaseConcerns && processedInput.diseaseConcerns.length === 1 && processedInput.diseaseConcerns[0] === 'none') {
      processedInput.diseaseConcerns = [];
    }

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
