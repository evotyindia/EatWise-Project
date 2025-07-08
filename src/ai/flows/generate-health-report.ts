
'use server';

/**
 * @fileOverview A food health report generator AI agent.
 *
 * - generateHealthReport - A function that handles the health report generation process.
 * - GenerateHealthReportInput - The input type for the generateHealthReport function.
<<<<<<< HEAD
 * - GenerateHealthReportOutput - The return type for the generateHealthReport function.
=======
 * - GenerateHealthReportOutput - The return type for the generateHealth-report function.
>>>>>>> finalprotest
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
<<<<<<< HEAD
  justification: z.string().optional().describe('A short justification for the rating.'),
=======
  justification: z.string().describe('A short justification for the rating.'),
});

const IngredientDeepDiveItemSchema = z.object({
  ingredientName: z.string().describe("The name of the ingredient."),
  description: z.string().describe("A brief explanation of what this ingredient is, its purpose in the food, and any health effects (positive or negative)."),
  riskLevel: z.enum(['Low', 'Medium', 'High', 'Neutral']).describe("A risk assessment for the ingredient. 'Low' for generally safe/healthy, 'Medium' for 'consume in moderation' or if it's controversial, 'High' for ingredients with known significant health risks (like trans fats, certain artificial additives), 'Neutral' for common safe items like salt, water."),
  riskReason: z.string().describe("A concise justification for the assigned risk level.")
>>>>>>> finalprotest
});

const GenerateHealthReportOutputSchema = z.object({
  healthRating: z
    .number()
    .min(1)
    .max(5)
    .describe('The overall health rating of the food product, from 1 to 5 stars.'),
<<<<<<< HEAD
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
=======
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
>>>>>>> finalprotest
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
<<<<<<< HEAD
  prompt: `You are an AI assistant specialized in analyzing food products and generating detailed health reports for an Indian audience.

  Analyze the following food product based on the provided information (product name, ingredients list, nutrition facts, and/or a photo of the label).
=======
  system: `You are an expert AI nutritionist for an Indian audience. Your task is to generate a comprehensive, clear, and easy-to-understand health report for a food product. Use bullet points for all lists to ensure scannability.
Your entire response MUST be a single, valid JSON object that conforms to the output schema. Do not include any text or explanations outside of this JSON object.
If the provided information is insufficient for a complete analysis (e.g., blurry photo, cannot read ingredients), you MUST respond with a structured error. Set 'healthRating' to 1, 'summary' to 'Sorry, the provided information is unclear...', and all other fields to 'N/A' or sensible defaults that indicate an error. Ensure the output strictly adheres to the JSON schema.`,
  prompt: `Analyze the following food product based on the provided information.
>>>>>>> finalprotest

  {{#if productName}}
  Product Name: {{productName}}
  {{/if}}

  {{#if ingredients}}
  Ingredients (provided): {{ingredients}}
  {{else if photoDataUri}}
<<<<<<< HEAD
  Ingredients: Please extract the ingredients from the provided photo. If the photo is unclear for ingredient extraction, state that in your analysis by populating the 'summary' field appropriately.
  {{else}}
  Ingredients: Not provided. Analysis might be limited if no photo is available either. Populate the 'summary' field to reflect this.
=======
  Ingredients: Please extract the ingredients from the provided photo.
  {{else}}
  Ingredients: Not provided.
>>>>>>> finalprotest
  {{/if}}

  {{#if nutritionFacts}}
  Nutrition Facts: {{nutritionFacts}}
  {{/if}}

  {{~#if photoDataUri}}
  Photo: {{media url=photoDataUri}}
  {{/if}}
<<<<<<< HEAD

  Generate a detailed health report. Ensure all output fields are addressed and strictly adhere to the JSON schema.

  If you are unsure about the product due to lack of clear information (e.g., blurry photo, missing ingredients, or inability to extract from photo):
  - Set 'healthRating' to 1.
  - Set 'detailedAnalysis.summary' to 'Sorry, I am not sure about this product. The provided information (e.g., photo, ingredients list) may be unclear or insufficient for a complete analysis. Please try uploading a clearer label or provide more details.'.
  - Set 'detailedAnalysis.positiveAspects', 'detailedAnalysis.potentialConcerns', and 'detailedAnalysis.keyNutrientsBreakdown' to 'N/A due to unclear input.'.
  - Set 'alternatives' to 'N/A due to unclear input.'.
  - For 'processingLevelRating', 'sugarContentRating', and 'nutrientDensityRating': set their 'rating' to 1 and 'justification' to 'Analysis not possible due to unclear input.'. If the entire rating object is optional and cannot be formed, omit it if the schema allows, otherwise provide default values as specified.
  - Set 'productType' to 'Unknown due to unclear input.'.
  Ensure the output strictly adheres to the defined JSON schema even in this case. Do not output any text outside of the JSON structure.

  For successful analysis:
  1.  **Product Type**: Identify the type of product (e.g., Snack, Beverage, Breakfast Cereal).
  2.  **Overall Health Rating**: Assign an overall health rating (number) from 1 (least healthy) to 5 (most healthy) stars.
  3.  **Detailed Analysis** (use bullet points starting with '*' or '-' for each sub-section of detailedAnalysis):
      *   **Summary**: Provide a concise overall summary of the product's healthiness.
      *   **Positive Aspects**: List any key positive aspects (e.g., "Good source of whole grains", "Low in saturated fat"). If none, state that or return "N/A".
      *   **Potential Concerns**: List potential health concerns or ingredients to watch out for (e.g., "High sodium content", "Contains palm oil", "Added sugars are high"). If none, state that or return "N/A".
      *   **Key Nutrients Breakdown**: Briefly comment on key nutrients if identifiable and noteworthy (e.g., "Provides Xg of protein per serving", "Mainly refined carbohydrates"). If none, return "N/A".
  4.  **Healthier Indian Alternatives** (use bullet points starting with '*' or '-'): Suggest 2-3 healthier Indian alternatives, explaining briefly why they are better choices.
  5.  **Additional Ratings**: For each of the following, provide an object with a 'rating' (number 1-5) and a 'justification' (string). If a rating cannot be determined, and the field is optional, it can be omitted. Otherwise, provide a default rating of 1 and justification 'Cannot be determined'.
      *   **Processing Level Rating**: (1=unprocessed to 5=ultra-processed). Justification should be short.
      *   **Sugar Content Rating**: (1=low to 5=high). Justification should be short.
      *   **Nutrient Density Rating**: (1=low to 5=high). Justification should be short.
  
  Present all lists (summary, positive aspects, potential concerns, key nutrients breakdown, alternatives) as bullet points using '*' or '-' as prefixes where specified.

  IMPORTANT: Your entire response MUST be a single, valid JSON object that conforms to the output schema. Do not include any text or explanations outside of this JSON object.
=======
  
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
>>>>>>> finalprotest
`,
});

const generateHealthReportFlow = ai.defineFlow(
  {
    name: 'generateHealthReportFlow',
    inputSchema: GenerateHealthReportInputSchema,
    outputSchema: GenerateHealthReportOutputSchema,
  },
<<<<<<< HEAD
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
      };
    }
    return output;
=======
  async (input) => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        throw new Error("An error occurred while analyzing the product. The AI could not generate a valid report based on the provided input. Please try again or ensure the input is clear.");
      }
      return output;
    } catch (error: any) {
        const errorMessage = error.message?.toLowerCase() || '';
        if (errorMessage.includes('api key not found') || errorMessage.includes('permission denied')) {
            console.error("Authentication error in generateHealthReportFlow:", error);
            throw new Error("Authentication Error: The AI service API key is missing or invalid. Please check your server environment variables.");
        }

        const isApiError = (error.cause as any)?.status >= 500;
        const finalErrorMessage = isApiError
            ? "The AI service is currently busy or unavailable. This is a temporary issue. Please try again in a few moments."
            : error.message || "An unexpected error occurred during report generation.";
        
        console.error(`An error occurred in generateHealthReportFlow: ${finalErrorMessage}`, error);

        // For frontend, we will throw the error to be caught and displayed in a toast
        throw new Error(finalErrorMessage);
    }
>>>>>>> finalprotest
  }
);
