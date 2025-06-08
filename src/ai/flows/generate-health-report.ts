
'use server';

/**
 * @fileOverview A food health report generator AI agent.
 *
 * - generateHealthReport - A function that handles the health report generation process.
 * - GenerateHealthReportInput - The input type for the generateHealthReport function.
 * - GenerateHealthReportOutput - The return type for the generateHealthReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHealthReportInputSchema = z.object({
  ingredients: z
    .string()
    .optional()
    .describe('The list of ingredients of the food product. If not provided, extract from photoDataUri if available.'),
  productName: z.string().optional().describe('The name of the food product.'),
  nutritionFacts: z.string().optional().describe('The nutrition facts of the food product.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of a food label, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateHealthReportInput = z.infer<typeof GenerateHealthReportInputSchema>;

const RatingObjectSchema = z.object({
  rating: z.number().min(1).max(5).describe('The numerical rating from 1 to 5 stars.'),
  justification: z.string().optional().describe('A short justification for the rating.'),
});

const GenerateHealthReportOutputSchema = z.object({
  healthRating: z
    .number()
    .min(1)
    .max(5)
    .describe('The overall health rating of the food product, from 1 to 5 stars.'),
  detailedAnalysis: z.object({
    summary: z.string().describe("A concise summary of the product's healthiness, ideally in bullet points."),
    positiveAspects: z.string().optional().describe("Key positive aspects of the product, if any. Be specific, e.g., 'Good source of fiber', 'Low in added sugar'. Use bullet points."),
    potentialConcerns: z.string().optional().describe("Potential health concerns or ingredients to watch out for. Be specific, e.g., 'High in sodium', 'Contains artificial sweeteners'. Use bullet points."),
    keyNutrientsBreakdown: z.string().optional().describe("Brief breakdown or comments on key nutrients like protein, fats, carbs, or specific vitamins/minerals if identifiable and noteworthy. Use bullet points.")
  }).describe("A more detailed breakdown of the health report."),
  alternatives: z.string().describe('A list of 2-3 healthier Indian alternatives, with brief reasons why they are better. Use bullet points.'),
  productType: z.string().optional().describe('The product type (e.g., Snack, Beverage, Ready-to-eat meal).'),
  processingLevelRating: RatingObjectSchema.optional().describe('Rating (1-5) and justification for food processing level (1=unprocessed, 5=ultra-processed).'),
  sugarContentRating: RatingObjectSchema.optional().describe('Rating (1-5) and justification for sugar content (1=low, 5=high).'),
  nutrientDensityRating: RatingObjectSchema.optional().describe('Rating (1-5) and justification for nutrient density (1=low, 5=high).')
});
export type GenerateHealthReportOutput = z.infer<typeof GenerateHealthReportOutputSchema>;

export async function generateHealthReport(
  input: GenerateHealthReportInput
): Promise<GenerateHealthReportOutput> {
  return generateHealthReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHealthReportPrompt',
  input: {schema: GenerateHealthReportInputSchema},
  output: {schema: GenerateHealthReportOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing food products and generating detailed health reports for an Indian audience.

  Analyze the following food product based on the provided information (product name, ingredients list, nutrition facts, and/or a photo of the label).

  {{#if productName}}
  Product Name: {{productName}}
  {{/if}}

  {{#if ingredients}}
  Ingredients (provided): {{ingredients}}
  {{else if photoDataUri}}
  Ingredients: Please extract the ingredients from the provided photo. If the photo is unclear for ingredient extraction, state that in your analysis.
  {{else}}
  Ingredients: Not provided. Analysis might be limited if no photo is available either.
  {{/if}}

  {{#if nutritionFacts}}
  Nutrition Facts: {{nutritionFacts}}
  {{/if}}

  {{~#if photoDataUri}}
  Photo: {{media url=photoDataUri}}
  {{/if}}

  Generate a detailed health report. Ensure all output fields are addressed:
  1.  **Product Type**: Identify the type of product (e.g., Snack, Beverage, Breakfast Cereal).
  2.  **Overall Health Rating**: Assign an overall health rating (number) from 1 (least healthy) to 5 (most healthy) stars.
  3.  **Detailed Analysis** (use bullet points for each sub-section of detailedAnalysis):
      *   **Summary**: Provide a concise overall summary of the product's healthiness.
      *   **Positive Aspects**: List any key positive aspects (e.g., "Good source of whole grains", "Low in saturated fat"). If none, state that.
      *   **Potential Concerns**: List potential health concerns or ingredients to watch out for (e.g., "High sodium content", "Contains palm oil", "Added sugars are high"). If none, state that.
      *   **Key Nutrients Breakdown**: Briefly comment on key nutrients if identifiable and noteworthy (e.g., "Provides Xg of protein per serving", "Mainly refined carbohydrates").
  4.  **Healthier Indian Alternatives** (use bullet points): Suggest 2-3 healthier Indian alternatives, explaining briefly why they are better choices.
  5.  **Additional Ratings**: For each of the following, provide an object with a 'rating' (number 1-5) and a 'justification' (string):
      *   **Processing Level Rating**: (1=unprocessed to 5=ultra-processed). Justification should be short.
      *   **Sugar Content Rating**: (1=low to 5=high). Justification should be short.
      *   **Nutrient Density Rating**: (1=low to 5=high). Justification should be short.

  If you are unsure about the product due to lack of clear information (e.g., blurry photo, missing ingredients), respond gently, for example: 'Sorry, I’m not sure about this product. Please upload a clearer label or check another item.'
  Present lists (summary, positive aspects, potential concerns, key nutrients breakdown, alternatives) as bullet points using '*' or '-' as prefixes.
`,
});

const generateHealthReportFlow = ai.defineFlow(
  {
    name: 'generateHealthReportFlow',
    inputSchema: GenerateHealthReportInputSchema,
    outputSchema: GenerateHealthReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
