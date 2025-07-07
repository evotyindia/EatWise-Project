
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
  suggestions: z.array(z.string()).describe('An array of 2-5 healthy Indian dish names that can be made with the ingredients, considering health concerns and household composition.'),
  initialContextualGuidance: z.string().optional().describe("A brief message to the user after suggestions are shown, e.g., 'Here are some ideas. Click one for a detailed recipe.'")
});
export type GetRecipeSuggestionsOutput = z.infer<typeof GetRecipeSuggestionsOutputSchema>;

export async function getRecipeSuggestions(input: GetRecipeSuggestionsInput): Promise<GetRecipeSuggestionsOutput> {
  return getRecipeSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getRecipeSuggestionsPrompt',
  input: {schema: GetRecipeSuggestionsInputSchema},
  output: {schema: GetRecipeSuggestionsOutputSchema},
  prompt: `You are a personal chef specializing in healthy Indian cuisine.
A user has provided the following:
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

Based on all the available information, suggest 2-5 healthy Indian dish NAMES.
These should be just the names of the dishes, not full recipes.
The dishes should be practical to make with the listed ingredients. Prioritize using the provided ingredients.
Suggest diverse options if possible (e.g., a dal, a sabzi, a rice dish).

Provide a brief, encouraging message as 'initialContextualGuidance', like "Here are some healthy dish ideas based on your inputs. Click a dish to see its detailed recipe."

IMPORTANT: Your entire response MUST be a single, valid JSON object that conforms to the output schema. Do not include any text or explanations outside of this JSON object.
Ensure the 'suggestions' array contains only the names of the dishes as strings.
Example 'suggestions': ["Palak Dal", "Aloo Gobi", "Vegetable Pulao"]
`,
});

const getRecipeSuggestionsFlow = ai.defineFlow(
  {
    name: 'getRecipeSuggestionsFlow',
    inputSchema: GetRecipeSuggestionsInputSchema,
    outputSchema: GetRecipeSuggestionsOutputSchema,
  },
  async input => {
    // Ensure 'none' is handled correctly if it's the only item
    if (input.diseaseConcerns && input.diseaseConcerns.length === 1 && input.diseaseConcerns[0] === 'none') {
      input.diseaseConcerns = []; // Treat as no specific disease concerns for the prompt
    }
    const {output} = await prompt(input);
    if (!output) {
      console.error('getRecipeSuggestionsFlow: LLM output was null or did not match schema for input:', JSON.stringify(input));
      return {
        suggestions: ["Sorry, I couldn't come up with recipe ideas at this moment. Please check your ingredients or try again later."],
        initialContextualGuidance: "There was an issue generating suggestions."
      };
    }
    return output;
  }
);
