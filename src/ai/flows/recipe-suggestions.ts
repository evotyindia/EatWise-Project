
'use server';
/**
 * @fileOverview Recipe suggestion AI agent that suggests healthy Indian meal ideas based on user-entered ingredients, health concerns, and household size.
 *
 * - getRecipeSuggestions - A function that handles the recipe suggestion process.
 * - GetRecipeSuggestionsInput - The input type for the getRecipeSuggestions function.
 * - GetRecipeSuggestionsOutput - The return type for the getRecipeSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { DiseaseEnum, HouseholdCompositionSchema, type Disease, type HouseholdComposition } from '@/ai/types/recipe-shared-types';

const GetRecipeSuggestionsInputSchema = z.object({
  ingredients: z.string().min(1, "Please provide some ingredients.").describe('A comma-separated list of ingredients the user has.'),
  userSuggestions: z.string().optional().describe("Any specific user requests, like 'make it spicy', 'quick meal', etc."),
  diseaseConcerns: z.array(DiseaseEnum).optional().describe("List of health conditions or dietary restrictions to consider. 'none' means no specific dietary disease concern."),
  householdComposition: HouseholdCompositionSchema.optional().describe("Details about the household members for portion suggestions and suitability.")
});
export type GetRecipeSuggestionsInput = z.infer<typeof GetRecipeSuggestionsInputSchema>;

const GetRecipeSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of up to 8 healthy Indian dish names that can be made with the ingredients, considering health concerns and household composition.'),
  initialContextualGuidance: z.string().describe("A brief message to the user after suggestions are shown, e.g., 'Here are some ideas. Click one for a detailed recipe.'")
});
export type GetRecipeSuggestionsOutput = z.infer<typeof GetRecipeSuggestionsOutputSchema>;

export async function getRecipeSuggestions(input: GetRecipeSuggestionsInput): Promise<GetRecipeSuggestionsOutput> {
  return getRecipeSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getRecipeSuggestionsPrompt',
  input: {schema: GetRecipeSuggestionsInputSchema},
  output: {schema: GetRecipeSuggestionsOutputSchema},
  system: `You are a personal chef specializing in healthy Indian cuisine. Your job is to suggest dish names based on user inputs.
Your entire response MUST be a single, valid JSON object that conforms to the output schema. Do not include any text or explanations outside of this JSON object.
Ensure the 'suggestions' array contains only the names of the dishes as strings. Example 'suggestions': ["Palak Dal", "Aloo Gobi", "Vegetable Pulao"]`,
  prompt: `A user has provided the following:
Ingredients: {{ingredients}}

{{#if diseaseConcerns.length}}
Health Considerations/Dietary Restrictions: {{#each diseaseConcerns}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
{{else}}
Health Considerations/Dietary Restrictions: General healthy options. (User may have selected 'none' or did not specify particular concerns).
{{/if}}

{{#if householdComposition}}
Household Composition:
- Adults (18-60): {{householdComposition.adults}}
- Seniors (60+): {{householdComposition.seniors}}
- Kids (2-17): {{householdComposition.kids}}
Consider this for suitability of dishes (e.g., less spicy for kids/seniors, softer foods for seniors if appropriate).
{{/if}}

{{#if userSuggestions}}
User's Special Request: {{userSuggestions}}
Please try to accommodate this request in your suggestions. For example, if they ask for a "quick meal", suggest dishes that are fast to cook.
{{/if}}

Based on all the available information, suggest up to 8 healthy Indian dish NAMES.
These should be just the names of the dishes, not full recipes.
The dishes should be practical to make with the listed ingredients. Prioritize using the provided ingredients.
Suggest diverse options if possible (e.g., a dal, a sabzi, a rice dish).

Provide a brief, encouraging message as 'initialContextualGuidance', like "Here are some healthy dish ideas based on your inputs. Click a dish to see its detailed recipe."

**IMPORTANT:** If you cannot find any reasonable suggestions with the provided ingredients, you MUST return an empty array for 'suggestions' and set 'initialContextualGuidance' to a helpful message explaining that no dishes could be found and suggesting the user add more common ingredients. For example: "Sorry, I couldn't find any specific recipes with only these ingredients. Try adding some common items like onions, tomatoes, or basic spices for better results."
`,
});

const getRecipeSuggestionsFlow = ai.defineFlow(
  {
    name: 'getRecipeSuggestionsFlow',
    inputSchema: GetRecipeSuggestionsInputSchema,
    outputSchema: GetRecipeSuggestionsOutputSchema,
  },
  async (input) => {
    // Ensure 'none' is handled correctly if it's the only item
    if (input.diseaseConcerns && input.diseaseConcerns.length === 1 && input.diseaseConcerns[0] === 'none') {
      input.diseaseConcerns = []; // Treat as no specific disease concerns for the prompt
    }

    try {
        const {output} = await prompt(input);
        if (!output) {
          throw new Error("The AI returned no suggestions. Please try again.");
        }
        return output;
    } catch (error: any) {
        // Log the full, detailed error to the server console (Vercel logs) for debugging.
        console.error(`An error occurred in getRecipeSuggestionsFlow:`, error);

        // Provide a clear error message for common deployment/server issues.
        if (error.message?.toLowerCase().includes('api key') || /5\d\d/.test(error.message)) {
            throw new Error('AI service configuration error or service is temporarily unavailable. Please check API key and try again later.');
        }

        // For other errors (like safety blocks), re-throw the original message for better client-side feedback.
        throw new Error(error.message || 'An unexpected error occurred while communicating with the AI service.');
    }
  }
);
