
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
  prompt: `You are an expert Indian chef and nutritionist. Generate a detailed, healthy recipe for the dish: "{{dishName}}".

User's Available Ingredients: {{availableIngredients}}
Household Composition:
- Adults (18-60): {{householdComposition.adults}}
- Seniors (60+): {{householdComposition.seniors}}
- Kids (2-17): {{householdComposition.kids}}
The total number of people is {{sum householdComposition.adults householdComposition.seniors householdComposition.kids}}.

{{#if diseaseConcerns.length}}
Health Considerations/Dietary Restrictions: {{#each diseaseConcerns}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
{{else}}
Health Considerations/Dietary Restrictions: Focus on general healthy preparation (user may have selected 'none' or no specific concerns).
{{/if}}

Your task is to provide a complete recipe with the following details:
1.  **Recipe Title**: Full title for "{{dishName}}".
2.  **Description**: A brief 2-3 sentence description.
3.  **Servings Description**: Clearly state who it serves based on 'householdComposition'. Crucially, ensure the quantities are genuinely sufficient and practical for this number of people. Indicate if portions are generous or average.
4.  **Prep Time**: Estimated preparation time.
5.  **Cook Time**: Estimated cooking time.
6.  **Adjusted Ingredients**:
    *   List all necessary ingredients with quantities *carefully and realistically adjusted* to be sufficient for the specified 'householdComposition'.
    *   Your primary source of ingredients MUST be the 'availableIngredients' list provided by the user.
    *   If, and only if, *essential* common Indian pantry staples (e.g., cooking oil, salt, turmeric powder, cumin seeds, mustard seeds, asafoetida) are *missing* from 'availableIngredients' BUT are *absolutely critical* for preparing "{{dishName}}", you may include a maximum of 2-3 such staples.
    *   For these *added essential staples*, the 'notes' field for the ingredient MUST clearly state something like "Essential staple: add if available" or "Commonly used: add if you have it". Do NOT add optional flavor enhancers unless they are in the user's list.
    *   For each ingredient, provide its name, quantity (e.g., "1 cup", "200g", "1 medium onion"), and any prep notes (e.g., "finely chopped", "soaked").
7.  **Instructions**: Clear, step-by-step cooking instructions.
8.  **Health Notes**: Provide specific advice or modifications based on 'diseaseConcerns'. If no concerns, give general health benefits or tips for making it even healthier. For example, suggest alternative grains, low-sodium options, or cooking methods.
9.  **Storage or Serving Tips**: (Optional) Any useful tips.

IMPORTANT:
*   The recipe must be healthy and suitable for an Indian palate.
*   Pay close attention to the 'diseaseConcerns' and 'householdComposition' to tailor the recipe (e.g. spiciness for kids/seniors, ingredient choices for diabetics like using less sugar/specific carbs). Quantities must be appropriate.
*   If 'gluten_free' is a concern, ensure all ingredients and instructions align (e.g., specify gluten-free asafoetida if used, suggest gluten-free flour alternatives).
*   If 'dairy_free' is a concern, suggest dairy-free alternatives (e.g., plant-based milk/yogurt, oil instead of ghee).
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
    
    // Helper function for sum (Handlebars doesn't have complex math built-in)
    // This won't be directly available to the prompt template unless you register it as a helper with Genkit/Handlebars,
    // so I'll adjust the prompt to just show individual counts. The AI should infer the total.
    // However, if Genkit supports simple arithmetic in prompts, this could be useful.
    // For now, I'm removing this as it's not standard Handlebars and likely not available.
    // processedInput.totalPeople = (processedInput.householdComposition.adults || 0) + 
    //                             (processedInput.householdComposition.seniors || 0) + 
    //                             (processedInput.householdComposition.kids || 0);


    const {output} = await prompt(processedInput);
    if (!output) {
      console.error('getDetailedRecipeFlow: LLM output was null or did not match schema for input:', JSON.stringify(processedInput));
      const household = input.householdComposition;
      const servingsText = `Serves ${household.adults} adult(s), ${household.seniors} senior(s), ${household.kids} kid(s) (approx).`;
      return {
        recipeTitle: `Error generating recipe for ${input.dishName}`,
        description: "Could not generate recipe details at this time. The AI was unable to produce a valid recipe. Please check your inputs or try again.",
        servingsDescription: servingsText,
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

