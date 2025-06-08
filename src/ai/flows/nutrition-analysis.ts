'use server';

/**
 * @fileOverview Nutrition analysis AI agent.
 *
 * - analyzeNutrition - A function that handles the nutrition analysis process.
 * - AnalyzeNutritionInput - The input type for the analyzeNutrition function.
 * - AnalyzeNutritionOutput - The return type for the analyzeNutrition function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeNutritionInputSchema = z.object({
  nutritionDataUri: z
    .string()
    .describe(
      "A nutritional information table, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
    .optional(),
  calories: z.number().describe('The number of calories.').optional(),
  fat: z.number().describe('The amount of fat in grams.').optional(),
  sugar: z.number().describe('The amount of sugar in grams.').optional(),
  protein: z.number().describe('The amount of protein in grams.').optional(),
});
export type AnalyzeNutritionInput = z.infer<typeof AnalyzeNutritionInputSchema>;

const AnalyzeNutritionOutputSchema = z.object({
  analysis: z.string().describe('Analysis of how balanced the item is.'),
  recommendations: z
    .string()
    .describe(
      'Suggests what kind of person can consume it (child, diabetic, etc.).'
    ),
  nutritionDensityRating: z
    .number()
    .describe('Rate the overall nutrition density from 1 to 5.'),
});
export type AnalyzeNutritionOutput = z.infer<typeof AnalyzeNutritionOutputSchema>;

export async function analyzeNutrition(input: AnalyzeNutritionInput): Promise<AnalyzeNutritionOutput> {
  return analyzeNutritionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeNutritionPrompt',
  input: {schema: AnalyzeNutritionInputSchema},
  output: {schema: AnalyzeNutritionOutputSchema},
  prompt: `You are a nutrition expert. Analyze the nutritional information provided and rate the nutritional density of the food from 1 to 5. Also, provide recommendations on who can consume it.

Here is the nutritional information:

{{#if nutritionDataUri}}
Nutritional Information Table: {{media url=nutritionDataUri}}
{{/if}}

{{#if calories}}
Calories: {{{calories}}}
{{/if}}

{{#if fat}}
Fat: {{{fat}}}g
{{/if}}

{{#if sugar}}
Sugar: {{{sugar}}}g
{{/if}}

{{#if protein}}
Protein: {{{protein}}}g
{{/if}}`,
});

const analyzeNutritionFlow = ai.defineFlow(
  {
    name: 'analyzeNutritionFlow',
    inputSchema: AnalyzeNutritionInputSchema,
    outputSchema: AnalyzeNutritionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
