
'use server';
/**
 * @fileOverview AI agent to suggest ingredients as the user types.
 * This flow is currently NOT USED in the application after feature removal.
 *
 * - suggestIngredients - A function that handles ingredient suggestion.
 * - SuggestIngredientsInput - The input type for the suggestIngredients function.
 * - SuggestIngredientsOutput - The return type for the suggestIngredients function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestIngredientsInputSchema = z.object({
  currentText: z.string().describe("The current text typed by the user in the ingredients input field. This could be a partial ingredient name or a list of ingredients."),
  existingIngredients: z.array(z.string()).optional().describe("An optional list of ingredients already added by the user, to avoid suggesting duplicates if possible.")
});
export type SuggestIngredientsInput = z.infer<typeof SuggestIngredientsInputSchema>;

const SuggestIngredientsOutputSchema = z.object({
  suggestions: z.array(z.string()).max(5).describe('An array of 3-5 relevant Indian ingredient suggestions based on the current text. Suggestions should be concise ingredient names.')
});
export type SuggestIngredientsOutput = z.infer<typeof SuggestIngredientsOutputSchema>;

export async function suggestIngredients(input: SuggestIngredientsInput): Promise<SuggestIngredientsOutput> {
  return ingredientSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ingredientSuggestionsPrompt',
  input: {schema: SuggestIngredientsInputSchema},
  output: {schema: SuggestIngredientsOutputSchema},
  prompt: `You are an Indian culinary assistant helping a user list ingredients.
User is currently typing: "{{currentText}}"
{{#if existingIngredients.length}}
User has already added: {{#each existingIngredients}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}. Try not to repeat these if it makes sense.
{{/if}}

Based on the current text, suggest 3-5 common Indian ingredient names that would naturally complete or follow.
Focus on single, common ingredient names. For example, if user types "onions, toma", suggest "tomatoes", "ginger", "garlic".
If user types "rice", suggest "turmeric powder", "cumin seeds", "ghee".
If the current text is very short, like "o", suggest common ingredients starting with 'o' like "onion", "oil".
Return only a JSON array of strings for the suggestions.
IMPORTANT: Your entire response MUST be a single, valid JSON object that conforms to the output schema. Do not include any text or explanations outside of this JSON object.
Example 'suggestions': ["Tomatoes", "Ginger", "Garlic Powder"]
`
});

const ingredientSuggestionsFlow = ai.defineFlow(
  {
    name: 'ingredientSuggestionsFlow',
    inputSchema: SuggestIngredientsInputSchema,
    outputSchema: SuggestIngredientsOutputSchema,
  },
  async (input) => {
    // Basic check to avoid calling LLM for very short/empty strings if desired, though prompt handles it.
    if (input.currentText.trim().length < 1 && (!input.existingIngredients || input.existingIngredients.length === 0)) {
      return { suggestions: [] };
    }

    const {output} = await prompt(input);
    if (!output) {
      console.error('ingredientSuggestionsFlow: LLM output was null or did not match schema for input:', JSON.stringify(input));
      return { suggestions: [] };
    }
    // Filter out suggestions that might be too similar to what's already typed if the currentText is a full word
    // This is a basic client-side like filter, LLM should ideally handle this.
    const lastTypedWord = input.currentText.split(/[\s,]+/).pop()?.toLowerCase() || "";
    if (lastTypedWord.length > 2) { // Only filter if last typed word is somewhat substantial
        output.suggestions = output.suggestions.filter(sugg => sugg.toLowerCase() !== lastTypedWord);
    }

    return output;
  }
);

    