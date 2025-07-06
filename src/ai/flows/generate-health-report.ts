
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
  }).describe("A more detailed breakdown of the health report."),
  alternatives: z.string().describe('A list of 2-3 healthier Indian alternatives, with brief reasons why they are better. Use bullet points.'),
  productType: z.string().optional().describe('The product type (e.g., Snack, Beverage, Ready-to-eat meal).'),
  processingLevelRating: RatingObjectSchema.optional().describe('Rating (1-5) and justification for food processing level (1=unprocessed, 5=ultra-processed).'),
  sugarContentRating: RatingObjectSchema.optional().describe('Rating (1-5) and justification for sugar content (1=low, 5=high).'),
  nutrientDensityRating: RatingObjectSchema.optional().describe('Rating (1-5) and justification for nutrient density (1=low, 5=high).'),
  ingredientAnalysis: z.array(IngredientAnalysisItemSchema).optional().describe("A detailed breakdown of each major ingredient identified, especially processed or chemical ones.")
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
  Ingredients: Please extract the ingredients from the provided photo. If the photo is unclear for ingredient extraction, state that in your analysis by populating the 'summary' field appropriately.
  {{else}}
  Ingredients: Not provided. Analysis might be limited if no photo is available either. Populate the 'summary' field to reflect this.
  {{/if}}

  {{#if nutritionFacts}}
  Nutrition Facts: {{nutritionFacts}}
  {{/if}}

  {{~#if photoDataUri}}
  Photo: {{media url=photoDataUri}}
  {{/if}}

  Generate a detailed health report. Ensure all output fields are addressed and strictly adhere to the JSON schema.

  If you are unsure about the product due to lack of clear information (e.g., blurry photo, missing ingredients, or inability to extract from photo):
  - Set 'healthRating' to 1.
  - Set 'detailedAnalysis.summary' to 'Sorry, I am not sure about this product. The provided information (e.g., photo, ingredients list) may be unclear or insufficient for a complete analysis. Please try uploading a clearer label or provide more details.'.
  - Set 'detailedAnalysis.positiveAspects', 'detailedAnalysis.potentialConcerns', and 'detailedAnalysis.keyNutrientsBreakdown' to 'N/A due to unclear input.'.
  - Set 'alternatives' to 'N/A due to unclear input.'.
  - Omit 'ingredientAnalysis' or provide an empty array [].
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
  6.  **Ingredient-by-Ingredient Analysis**: This is a crucial new section. For each major ingredient identified, provide a detailed analysis. Focus especially on additives, preservatives, sweeteners, and processed items. For very common/simple ingredients like Water or Salt, a brief neutral entry is fine.
      *   Create an object for each ingredient with fields: 'ingredientName', 'description', 'riskLevel' ('Low', 'Medium', 'High', 'Neutral'), and 'riskReason'.
      *   The 'description' should explain what the ingredient is and its purpose.
      *   'riskLevel' should be based on current nutritional science for an average consumer.
      *   'riskReason' must concisely justify the risk level.
      *   Populate this into the 'ingredientAnalysis' array. If no ingredients can be clearly identified, this can be an empty array.

  Present all lists (summary, positive aspects, potential concerns, key nutrients breakdown, alternatives) as bullet points using '*' or '-' as prefixes where specified.

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
