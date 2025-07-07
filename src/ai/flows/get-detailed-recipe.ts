
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
  input: {schema: GetDetailedRecipeInputSchema},
  output: {schema: GetDetailedRecipeOutputSchema},
  prompt: `You are an expert Indian chef and nutritionist. Generate a detailed, delicious, and healthy recipe for the dish: "{{dishName}}".

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

Your task is to provide a complete and easy-to-follow recipe. Pay close attention to the following details:
1.  **Recipe Title**: Full title for "{{dishName}}".
2.  **Description**: A brief 2-3 sentence description, highlighting its healthiness, taste, and key features.
3.  **Servings, Prep & Cook Time**: Provide a practical servings description based on the household size, along with estimated prep and cook times.
4.  **Adjusted Ingredients List**:
    *   List all necessary ingredients with quantities *carefully and realistically adjusted* to be sufficient for the specified household.
    *   Your primary source of ingredients MUST be the 'availableIngredients' list provided by the user.
    *   If, and only if, *essential* common Indian pantry staples (e.g., cooking oil, salt, turmeric powder) are *missing* from the user's list BUT are *absolutely critical*, you may add a maximum of 2-3 such items.
    *   **Crucially, use the 'notes' field to distinguish between mandatory and optional items.** For example: "Essential for this dish; add if available" for staples, or "optional, for extra flavor" for things like kasuri methi or cream.
5.  **Step-by-Step Instructions**:
    *   Provide clear, sequential cooking instructions. Each step should be a separate string in the array.
    *   Where applicable, indicate optional steps, for example, by starting a step with "(Optional)".
    *   Incorporate professional cooking tips to enhance flavor and texture while maintaining healthiness (e.g., "Sauté onions until translucent, not brown, for a sweeter base.").
6.  **Health Notes**: Provide specific advice or modifications based on 'diseaseConcerns'. If no concerns, give general health benefits or tips for making it even healthier (e.g., "For a heart-healthy version, use only 1 tsp of oil and add a tablespoon of ground flaxseed.").
7.  **Storage or Serving Tips**: (Optional) Any useful tips on how to serve or store the dish.

IMPORTANT:
*   The recipe must be healthy and suitable for an Indian palate, tailoring spice levels for the household (e.g., milder for kids/seniors).
*   If 'gluten_free' is a concern, ensure all ingredients and instructions align (e.g., specify gluten-free asafoetida if used).
*   Your entire response MUST be a single, valid JSON object that conforms to the output schema. Do not include any text or explanations outside of this JSON object.
`,
});

const getDetailedRecipeFlow = ai.defineFlow(
  {
    name: 'getDetailedRecipeFlow',
    inputSchema: GetDetailedRecipeInputSchema,
    outputSchema: GetDetailedRecipeOutputSchema,
  },
  async (input) => {
    const processedInput = {...input};
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
