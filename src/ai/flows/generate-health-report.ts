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
  summary: z.string().describe("A concise, 2-3 sentence executive summary of the product's health profile, highlighting the most critical takeaways for the user."),

  greenFlags: z.string().describe("A detailed bullet-point list of all significant positive aspects, with a brief explanation for each. Be specific and encouraging. If none, state 'No significant positive aspects were identified.'"),
  redFlags: z.string().describe("A detailed bullet-point list of all significant health concerns. Explain why each is a concern in simple terms. If none, state 'No significant health concerns were identified.'"),
  
  detailedAnalysis: z.object({
    processingLevel: z.string().describe("Assessment of the food's processing level (e.g., 'Unprocessed', 'Minimally Processed', 'Ultra-Processed') and a detailed but simple explanation of why, referencing the ingredients if possible."),
    macronutrientProfile: z.string().describe("Detailed analysis of the balance and quality of protein, carbs, and fats (e.g., source of protein, refined vs complex carbs). Explain the implications for energy and satiety."),
    micronutrientHighlights: z.string().describe("Detailed bullet-point comments on noteworthy vitamins or minerals, explaining their benefits. If none, state 'No significant micronutrients to highlight.'"),
    sugarAnalysis: z.string().describe("A very specific and detailed analysis of the sugar content, distinguishing between natural and added sugars if possible. Comment on its level relative to daily recommendations."),
  }).describe("A deeper dive into specific nutritional components."),
  
  bestSuitedFor: z.string().describe("Provides specific recommendations for consumer types or occasions for this product (e.g., 'Best as an occasional treat for children', 'Not recommended for individuals with diabetes due to high sugar content.')."),
  consumptionTips: z.string().describe("Actionable bullet-point tips for healthier consumption. E.g., '* Pair with a source of protein like yogurt to balance the meal.', '* Limit portion size to two biscuits.'. If none, state 'No specific consumption tips.'"),
  indianDietContext: z.string().describe("A detailed explanation of how this product fits into a typical balanced Indian diet. E.g., 'This can be a convenient alternative to a traditional fried snack like samosa, but it lacks the fiber and nutrients of a meal like dal-roti and should not replace it.'"),
  
  healthierAlternatives: z.string().describe('A detailed bullet-point list of 2-3 healthier Indian alternatives, with clear reasons why they are better options.'),
  ingredientDeepDive: z.array(IngredientDeepDiveItemSchema).describe("An extremely detailed analysis of the top 5-7 most impactful ingredients, both good and bad. Provide a clear description, risk level, and justification for each."),

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
  system: `You are an expert AI nutritionist for an Indian audience. Your task is to generate a comprehensive, clear, and highly detailed health report for a food product. Use bullet points for all lists to ensure scannability. Your entire response MUST be a single, valid JSON object that conforms to the output schema. Do not include any text or explanations outside of this JSON object. If the provided information is insufficient for a complete analysis (e.g., blurry photo, cannot read ingredients), you MUST respond with a structured error. Set 'healthRating' to 1, 'summary' to 'Sorry, the provided information is unclear...', and all other fields to 'N/A' or sensible defaults that indicate an error. Ensure the output strictly adheres to the JSON schema.`,
  prompt: `Analyze the following food product based on the provided information. Be extremely thorough and detailed in your explanations for each section.

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
  3.  **Summary**: A detailed 2-3 sentence executive summary of the product's health profile and your main recommendation.
  4.  **Green Flags** (as bullet points): A detailed list of all significant positive aspects. For each, explain *why* it's a good thing (e.g., '* Rich in Whole Grains: Provides sustained energy and fiber, which is good for digestion.'). If none, state "No significant positive aspects were identified."
  5.  **Red Flags** (as bullet points): A detailed list of all significant health concerns. For each, explain *why* it's a concern in simple terms (e.g., '* High in Sodium: Exceeds 20% of the recommended daily intake in one serving, which can contribute to high blood pressure over time.'). If none, state "No significant health concerns were identified."
  6.  **Detailed Analysis**:
      *   **Processing Level**: Assess the processing level and provide a detailed but simple explanation of why, referencing ingredients if possible.
      *   **Macronutrient Profile**: Provide a detailed analysis of the macronutrient balance and quality. Discuss implications for energy, satiety, and health.
      *   **Micronutrient Highlights** (as bullet points): Detail any noteworthy vitamins or minerals and explain their benefits. If none, state "No significant micronutrients to highlight."
      *   **Sugar Analysis**: Give a very specific and detailed analysis of the sugar content, comparing it to daily recommended limits if possible.
  7.  **Best Suited For**: Provide specific recommendations for consumer types or occasions.
  8.  **Consumption Tips** (as bullet points): Provide actionable, insightful tips for healthier consumption.
  9.  **Indian Diet Context**: Give a detailed explanation of how this product fits into a balanced Indian diet.
  10. **Healthier Alternatives** (as bullet points): Suggest 2-3 healthier Indian alternatives with clear, compelling reasons why they are better.
  11. **Ingredient-by-Ingredient Deep Dive**: Analyze the top 5-7 most impactful ingredients. For each, provide a 'description', a 'riskLevel' ('Low', 'Medium', 'High', 'Neutral'), and a very clear 'riskReason'. Populate this into the 'ingredientDeepDive' array.
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
        throw new Error("The AI returned an empty or invalid report. Please try again.");
      }
      return output;
    } catch (error: any) {
        console.error(`An error occurred in generateHealthReportFlow:`, error);
        const errorMessage = error.message || 'An unexpected error occurred.';
        if (errorMessage.toLowerCase().includes('api key')) {
            throw new Error('The AI service is not configured. This is likely because the GOOGLE_API_KEY is missing from your .env file.');
        }
        if (errorMessage.toLowerCase().includes('safety')) {
            throw new Error('The AI response was blocked due to safety settings. Please modify your input and try again.');
        }
        throw new Error(errorMessage);
    }
  }
);
