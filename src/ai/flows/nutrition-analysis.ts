
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
  calories: z.number().describe('The number of calories (kcal).').optional(),
  fat: z.number().describe('The amount of total fat in grams.').optional(),
  saturatedFat: z.number().describe('The amount of saturated fat in grams.').optional(),
  transFat: z.number().describe('The amount of trans fat in grams.').optional(),
  cholesterol: z.number().describe('The amount of cholesterol in milligrams.').optional(),
  sodium: z.number().describe('The amount of sodium in milligrams.').optional(),
  carbohydrates: z.number().describe('The amount of total carbohydrates in grams.').optional(),
  fiber: z.number().describe('The amount of dietary fiber in grams.').optional(),
  sugar: z.number().describe('The amount of total sugars in grams.').optional(),
  addedSugar: z.number().describe('The amount of added sugars in grams.').optional(),
  protein: z.number().describe('The amount of protein in grams.').optional(),
  vitaminD: z.number().describe('The amount of Vitamin D in micrograms or IU. Specify unit.').optional(),
  calcium: z.number().describe('The amount of Calcium in milligrams.').optional(),
  iron: z.number().describe('The amount of Iron in milligrams.').optional(),
  potassium: z.number().describe('The amount of Potassium in milligrams.').optional(),
  vitaminC: z.number().describe('The amount of Vitamin C in milligrams.').optional(),
  servingSize: z.string().optional().describe('The serving size information, e.g., "1 cup (240ml)" or "30g".')
});
export type AnalyzeNutritionInput = z.infer<typeof AnalyzeNutritionInputSchema>;

const AnalyzeNutritionOutputSchema = z.object({
  overallAnalysis: z.string().describe('A concise summary of the most important nutritional aspects and how balanced the item is. Use bullet points for key highlights or takeaways.'),
  macronutrientBalance: z.string().optional().describe("Brief bullet points on the balance and quality of macronutrients (carbohydrates, protein, fat)."),
  micronutrientHighlights: z.string().optional().describe("Bullet points on significant micronutrients (vitamins/minerals) identified, their levels (high/low/adequate), and potential impact."),
  dietarySuitability: z
    .string()
    .describe(
      'Suggests what kind of person or dietary pattern this item might be suitable or unsuitable for (e.g., "May be suitable for athletes needing quick energy", "Less suitable for individuals watching sodium intake", "Good for children if portion controlled"). Mention specific conditions like diabetes, heart health if relevant based on data. Keep advice actionable and clear.'
    ),
  nutritionDensityRating: z
    .number().min(1).max(5)
    .describe('Rate the overall nutrition density from 1 (low) to 5 (high), considering beneficial nutrients vs. calories and less desirable components.'),
  processingLevelAssessment: z.string().optional().describe("A brief assessment of the food's likely processing level (e.g., unprocessed, minimally processed, processed, ultra-processed) if inferable from the data, and its implications."),
  servingSizeContext: z.string().optional().describe("Brief comment on how the serving size impacts the nutritional assessment, if serving size is provided.")
});
export type AnalyzeNutritionOutput = z.infer<typeof AnalyzeNutritionOutputSchema>;

export async function analyzeNutrition(input: AnalyzeNutritionInput): Promise<AnalyzeNutritionOutput> {
  return analyzeNutritionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeNutritionPrompt',
  input: {schema: AnalyzeNutritionInputSchema},
  output: {schema: AnalyzeNutritionOutputSchema},
  prompt: `You are an expert nutritionist. Analyze the nutritional information provided for a food item.
  Your analysis should be detailed yet simple to understand. Use short, clear points, especially bullet points, for better clarity.

  Here is the nutritional information. If a field is not provided, it means the data is unavailable.
  Focus your analysis on the provided data.

  {{#if servingSize}}Serving Size: {{servingSize}}{{/if}}
  {{#if nutritionDataUri}}
  Nutritional Information Table (from image): {{media url=nutritionDataUri}}
  (If specific values are also provided below, prioritize them. Use the image for overall context or missing values.)
  {{/if}}

  {{#if calories}}Calories: {{calories}} kcal{{/if}}
  {{#if fat}}Total Fat: {{fat}}g{{/if}}
  {{#if saturatedFat}}Saturated Fat: {{saturatedFat}}g{{/if}}
  {{#if transFat}}Trans Fat: {{transFat}}g{{/if}}
  {{#if cholesterol}}Cholesterol: {{cholesterol}}mg{{/if}}
  {{#if sodium}}Sodium: {{sodium}}mg{{/if}}
  {{#if carbohydrates}}Total Carbohydrates: {{carbohydrates}}g{{/if}}
  {{#if fiber}}Dietary Fiber: {{fiber}}g{{/if}}
  {{#if sugar}}Total Sugars: {{sugar}}g{{/if}}
  {{#if addedSugar}}Added Sugars: {{addedSugar}}g{{/if}}
  {{#if protein}}Protein: {{protein}}g{{/if}}
  {{#if vitaminD}}Vitamin D: {{vitaminD}} (unit as provided or infer if possible){{/if}}
  {{#if calcium}}Calcium: {{calcium}}mg{{/if}}
  {{#if iron}}Iron: {{iron}}mg{{/if}}
  {{#if potassium}}Potassium: {{potassium}}mg{{/if}}
  {{#if vitaminC}}Vitamin C: {{vitaminC}}mg{{/if}}

  Based on the available data, provide:
  1.  **Nutrition Density Rating**: Rate the overall nutrition density from 1 (low) to 5 (high).
  2.  **Overall Analysis**: Provide a concise summary of the most important nutritional aspects and how balanced the item is. Use bullet points for key highlights or takeaways.
  3.  **Macronutrient Balance**: Provide brief bullet points on the balance and quality of macronutrients.
  4.  **Micronutrient Highlights**: Use bullet points to mention significant micronutrients and their levels.
  5.  **Dietary Suitability**: Suggest who can consume it (e.g., child, diabetic, athlete) and any contraindications. Keep advice actionable.
  6.  **Processing Level Assessment**: If inferable, provide a brief assessment of its processing level.
  7.  **Serving Size Context**: If serving size is provided, provide a brief comment on its impact.

  Be specific and provide actionable insights. If data is insufficient for a particular aspect, state that.
  Present information clearly, using bullet points (e.g. starting with * or -) where specified in the output schema descriptions.
`,
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
