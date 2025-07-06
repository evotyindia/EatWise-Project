
'use server';

/**
 * @fileOverview A food health report generator AI agent.
 *
 * - generateHealthReport - A function that handles the health report generation process.
 * - GenerateHealthReportInput - The input type for the generateHealthReport function.
 * - GenerateHealthReportOutput - The return type for the generateHealth-report function.
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

const IngredientAnalysisItemSchema = z.object({
  ingredientName: z.string().describe("The name of the ingredient."),
  description: z.string().describe("A brief explanation of what this ingredient is, its purpose in the food, and any health effects (positive or negative)."),
  riskLevel: z.enum(['Low', 'Medium', 'High', 'Neutral']).describe("A risk assessment for the ingredient. 'Low' for generally safe/healthy, 'Medium' for 'consume in moderation' or if it's controversial, 'High' for ingredients with known significant health risks (like trans fats, certain artificial additives), 'Neutral' for common safe items like salt, water."),
  riskReason: z.string().describe("A concise justification for the assigned risk level.")
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
  }).describe("A concise breakdown of the health report."),
  alternatives: z.string().describe('A list of 2-3 healthier Indian alternatives, with brief reasons why they are better. Use bullet points.'),
  productType: z.string().optional().describe('The product type (e.g., Snack, Beverage, Ready-to-eat meal).'),
  processingLevelRating: RatingObjectSchema.optional().describe('Rating (1-5) and justification for food processing level (1=unprocessed, 5=ultra-processed).'),
  sugarContentRating: RatingObjectSchema.optional().describe('Rating (1-5) and justification for sugar content (1=low, 5=high).'),
  nutrientDensityRating: RatingObjectSchema.optional().describe('Rating (1-5) and justification for nutrient density (1=low, 5=high).'),
  ingredientAnalysis: z.array(IngredientAnalysisItemSchema).optional().describe("A brief analysis of each key ingredient.")
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
  prompt: `You are an expert AI nutritionist for an Indian audience. Your goal is to generate a clear, concise, and easy-to-understand health report. Use bullet points for lists to make the information scannable.

  Analyze the following food product based on the provided information.

  {{#if productName}}
  Product Name: {{productName}}
  {{/if}}

  {{#if ingredients}}
  Ingredients (provided): {{ingredients}}
  {{else if photoDataUri}}
  Ingredients: Please extract the ingredients from the provided photo.
  {{else}}
  Ingredients: Not provided.
  {{/if}}

  {{#if nutritionFacts}}
  Nutrition Facts: {{nutritionFacts}}
  {{/if}}

  {{~#if photoDataUri}}
  Photo: {{media url=photoDataUri}}
  {{/if}}
  
  If information is unclear (e.g., blurry photo, cannot extract ingredients):
  - Set 'healthRating' to 1.
  - Set 'detailedAnalysis.summary' to 'Sorry, the provided information is unclear or insufficient for a complete analysis. Please try again with a clearer image or more details.'.
  - Set other fields to 'N/A' or provide sensible defaults that indicate an error.
  - Ensure the output strictly adheres to the JSON schema.

  For a successful analysis, provide the following in a concise manner:
  1.  **Product Type**: Identify the product type (e.g., Snack, Beverage).
  2.  **Overall Health Rating**: Assign a health rating from 1 (least healthy) to 5 (most healthy).
  3.  **Detailed Analysis** (use bullet points starting with '*' or '-'):
      *   **Summary**: A concise summary of the product's healthiness in bullet points.
      *   **Positive Aspects**: Key positive aspects. If none, state so.
      *   **Potential Concerns**: Potential health concerns. If none, state so.
      *   **Key Nutrients Breakdown**: Brief, noteworthy comments on key nutrients.
  4.  **Healthier Indian Alternatives**: Suggest 2-3 healthier Indian alternatives with brief reasons. Use bullet points.
  5.  **Additional Ratings**: Provide ratings (1-5) and a short justification for:
      *   **Processing Level**: (1=unprocessed, 5=ultra-processed).
      *   **Sugar Content**: (1=low, 5=high).
      *   **Nutrient Density**: (1=low, 5=high).
  6.  **Ingredient-by-Ingredient Analysis**:
      *   For each major ingredient, provide a brief 'description', its 'riskLevel' ('Low', 'Medium', 'High', 'Neutral'), and a concise 'riskReason'.
      *   Keep the descriptions brief.
      *   Populate this into the 'ingredientAnalysis' array.

  Present all lists as bullet points.

  IMPORTANT: Your entire response MUST be a single, valid JSON object that conforms to the output schema. Do not include any text or explanations outside of this JSON object.
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
    if (!output) {
      console.error('generateHealthReportFlow: LLM output was null or did not match schema for input:', JSON.stringify(input));
      return {
        healthRating: 1,
        detailedAnalysis: {
          summary: "An error occurred while analyzing the product. The AI could not generate a valid report based on the provided input. Please try again or ensure the input is clear.",
          positiveAspects: "N/A",
          potentialConcerns: "N/A",
          keyNutrientsBreakdown: "N/A",
        },
        alternatives: "N/A",
        productType: "Unknown",
        processingLevelRating: { rating: 1, justification: "Error in analysis" },
        sugarContentRating: { rating: 1, justification: "Error in analysis" },
        nutrientDensityRating: { rating: 1, justification: "Error in analysis" },
        ingredientAnalysis: [],
      };
    }
    return output;
  }
);
