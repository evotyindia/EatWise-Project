'use server';
/**
 * @fileOverview Recipe suggestion AI agent that suggests 2-3 healthy Indian meal ideas based on user-entered ingredients.
 *
 * - getRecipeSuggestions - A function that handles the recipe suggestion process.
 * - GetRecipeSuggestionsInput - The input type for the getRecipeSuggestions function.
 * - GetRecipeSuggestionsOutput - The return type for the getRecipeSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetRecipeSuggestionsInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma-separated list of ingredients the user has at home.'),
});
export type GetRecipeSuggestionsInput = z.infer<typeof GetRecipeSuggestionsInputSchema>;

const GetRecipeSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of 2-3 healthy Indian meal ideas.'),
  mealPlan: z
    .string()
    .optional()
    .describe('An optional quick meal plan with timing suggestions.'),
});
export type GetRecipeSuggestionsOutput = z.infer<typeof GetRecipeSuggestionsOutputSchema>;

export async function getRecipeSuggestions(input: GetRecipeSuggestionsInput): Promise<GetRecipeSuggestionsOutput> {
  return getRecipeSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getRecipeSuggestionsPrompt',
  input: {schema: GetRecipeSuggestionsInputSchema},
  output: {schema: GetRecipeSuggestionsOutputSchema},
  prompt: `You are a personal chef specializing in healthy Indian cuisine. A user will provide you with a list of ingredients they have at home, and you will suggest 2-3 healthy Indian meal ideas using those ingredients. If possible, suggest a quick meal plan with timing suggestions.

Ingredients: {{{ingredients}}}`,
});

const getRecipeSuggestionsFlow = ai.defineFlow(
  {
    name: 'getRecipeSuggestionsFlow',
    inputSchema: GetRecipeSuggestionsInputSchema,
    outputSchema: GetRecipeSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
