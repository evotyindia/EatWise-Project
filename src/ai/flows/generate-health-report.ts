
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
  justification: z.string().describe('A short justification for the rating.'),
});

const IngredientDeepDiveItemSchema = z.object({
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
  summary: z.string().describe("A one-sentence executive summary of the product's health profile. E.g., 'A high-sugar snack with some fiber, best for occasional consumption.'"),

  greenFlags: z.string().describe("A bullet-point list of 2-4 key positive aspects. Be specific. E.g., '* Good source of fiber', '* Made with whole grains'. If none, state 'No significant positive aspects found.'"),
  redFlags: z.string().describe("A bullet-point list of 2-4 key health concerns to be aware of. Be specific. E.g., '* High in Sodium', '* Contains artificial sweeteners'. If none, state 'No significant health concerns found.'"),
  
  detailedAnalysis: z.object({
    processingLevel: z.string().describe("Assessment of the food's processing level (e.g., 'Unprocessed', 'Minimally Processed', 'Ultra-Processed') and a brief explanation of why."),
    macronutrientProfile: z.string().describe("Analysis of the balance of protein, carbs, and fats. E.g., 'High in refined carbohydrates and fats, with very little protein.'"),
    micronutrientHighlights: z.string().describe("Bullet-point comments on noteworthy vitamins or minerals, if identifiable and noteworthy. E.g., '* Good source of Calcium and Vitamin D.'. If none, state 'No significant micronutrients to highlight.'"),
    sugarAnalysis: z.string().describe("A specific analysis of the sugar content, distinguishing between natural and added sugars if possible. Comment on its level."),
  }).describe("A deeper dive into specific nutritional components."),
  
  bestSuitedFor: z.string().describe("Describes the ideal consumer or occasion for this product. E.g., 'Best as an occasional treat for children', 'Not recommended for individuals with diabetes.'"),
  consumptionTips: z.string().describe("Actionable bullet-point tips for healthier consumption. E.g., '* Pair with a source of protein like yogurt to balance the meal.', '* Limit portion size to two biscuits.'. If none, state 'No specific consumption tips.'"),
  indianDietContext: z.string().describe("A brief explanation of how this product fits into a typical balanced Indian diet. E.g., 'This can be a convenient alternative to a traditional fried snack but should not replace a main meal like dal-roti.'"),
  
  healthierAlternatives: z.string().describe('A bullet-point list of 2-3 healthier Indian alternatives, with brief reasons why they are better.'),
  ingredientDeepDive: z.array(IngredientDeepDiveItemSchema).describe("A detailed analysis of each key ingredient, its purpose, and health implications. If ingredients are not available or unclear, this should be an empty array."),

  productType: z.string().describe('The product type (e.g., Snack, Beverage, Ready-to-eat meal).'),
  processingLevelRating: RatingObjectSchema.describe('Rating (1-5) and justification for food processing level (1=unprocessed, 5=ultra-processed).'),
  sugarContentRating: RatingObjectSchema.describe('Rating (1-5) and justification for sugar content (1=low, 5=high).'),
  nutrientDensityRating: RatingObjectSchema.describe('Rating (1-5) and justification for nutrient density (1=low, 5=high).')
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
  output: {
    schema: GenerateHealthReportOutputSchema,
    format: 'json',
  },
  system: `You are an expert AI nutritionist for an Indian audience. Your task is to generate a comprehensive, clear, and easy-to-understand health report for a food product. Use bullet points for all lists to ensure scannability.
Your entire response MUST be a single, valid JSON object that conforms to the output schema. Do not include any text or explanations outside of this JSON object.
If the provided information is insufficient for a complete analysis (e.g., blurry photo, cannot read ingredients), you MUST respond with a structured error. Set 'healthRating' to 1, 'summary' to 'Sorry, the provided information is unclear...', and all other fields to 'N/A' or sensible defaults that indicate an error. Ensure the output strictly adheres to the JSON schema.`,
  prompt: `Analyze the following food product based on the provided information.

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
  
  Generate the following detailed report. Be concise but thorough.

  1.  **Product Type**: Identify the product type (e.g., Snack, Beverage, Ready-to-eat meal).
  2.  **Overall Health Rating**: Assign a health rating from 1 (least healthy) to 5 (most healthy).
  3.  **Summary**: A one-sentence executive summary of the product's health profile.
  4.  **Green Flags** (as bullet points): 2-4 key positive aspects. If none, state "No significant positive aspects found."
  5.  **Red Flags** (as bullet points): 2-4 key health concerns. If none, state "No significant health concerns found."
  6.  **Detailed Analysis**:
      *   **Processing Level**: Assess the processing level (e.g., 'Ultra-Processed') and briefly explain why.
      *   **Macronutrient Profile**: Analyze the balance of protein, carbs, and fats.
      *   **Micronutrient Highlights** (as bullet points): Mention any noteworthy vitamins or minerals. If none, state "No significant micronutrients to highlight."
      *   **Sugar Analysis**: Specifically analyze the sugar content.
  7.  **Best Suited For**: Describe the ideal consumer or occasion for this product.
  8.  **Consumption Tips** (as bullet points): Provide actionable tips for healthier consumption. If none, state "No specific consumption tips."
  9.  **Indian Diet Context**: Explain how this product fits into a balanced Indian diet.
  10. **Healthier Alternatives** (as bullet points): Suggest 2-3 healthier Indian alternatives with brief reasons.
  11. **Ingredient-by-Ingredient Deep Dive**: For each major ingredient, provide a 'description', 'riskLevel' ('Low', 'Medium', 'High', 'Neutral'), and a concise 'riskReason'. Populate this into the 'ingredientDeepDive' array.
  12. **Numerical Ratings**: Provide ratings (1-5) and a short justification for Processing Level, Sugar Content, and Nutrient Density.

  Present all lists as bullet points starting with '*'.
`,
});

const generateHealthReportFlow = ai.defineFlow(
  {
    name: 'generateHealthReportFlow',
    inputSchema: GenerateHealthReportInputSchema,
    outputSchema: GenerateHealthReportOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        throw new Error("An error occurred while analyzing the product. The AI could not generate a valid report based on the provided input. Please try again or ensure the input is clear.");
      }
      return output;
    } catch (error: any) {
        // Log the full, detailed error to the server console (Vercel logs) for debugging.
        console.error(`An error occurred in generateHealthReportFlow:`, error);

        // Provide a clear error message for common deployment/server issues.
        if (error.message?.toLowerCase().includes('api key') || /5\d\d/.test(error.message)) {
            throw new Error('AI service configuration error or service is temporarily unavailable. Please check API key and try again later.');
        }

        // For other errors (like safety blocks), re-throw the original message for better client-side feedback.
        throw new Error(error.message || 'An unexpected error occurred while communicating with the AI service.');
    }
  }
);
