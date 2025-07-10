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

const NutrientAnalysisItemSchema = z.object({
    nutrient: z.string().describe("The name of the nutrient (e.g., 'Saturated Fat', 'Sodium', 'Dietary Fiber')."),
    value: z.string().describe("The value and unit of the nutrient as provided (e.g., '10g', '500mg')."),
    verdict: z.enum(['Good', 'Okay', 'High', 'Very High', 'Low']).describe("A simple verdict on the nutrient's level. Use 'Good' for beneficial nutrients like fiber/protein, 'Low' for things that should be low like sugar/sodium, 'Okay' for moderate amounts, and 'High' or 'Very High' for excessive amounts."),
    comment: z.string().describe("A brief, simple explanation for the verdict (e.g., 'Excellent source of fiber', 'This is very high and exceeds 25% of the daily recommended limit.')."),
});

const AnalyzeNutritionOutputSchema = z.object({
  overallAnalysis: z.string().describe('A detailed summary of the most important nutritional aspects and how balanced the item is. Use bullet points for key highlights or takeaways.'),
  macronutrientBalance: z.string().describe("Detailed bullet points on the balance and quality of macronutrients (carbohydrates, protein, fat), explaining their impact on health. If not enough data, state it."),
  micronutrientHighlights: z.string().describe("Detailed bullet points on significant micronutrients (vitamins/minerals) identified, their levels (high/low/adequate), and potential impact. If none, state so."),
  dietarySuitability: z
    .string()
    .describe(
      'Provide specific, actionable advice on what kind of person or dietary pattern this item is suitable or unsuitable for (e.g., "May be suitable for athletes needing quick energy", "Less suitable for individuals watching sodium intake", "Good for children if portion controlled"). Mention specific conditions like diabetes, heart health if relevant based on data.'
    ),
  nutritionDensityRating: z
    .number().min(1).max(5)
    .describe('Rate the overall nutrition density from 1 (low) to 5 (high), considering beneficial nutrients vs. calories and less desirable components.'),
  processingLevelAssessment: z.string().describe("A brief assessment of the food's likely processing level (e.g., unprocessed, minimally processed, processed, ultra-processed) if inferable from the data, and its implications."),
  servingSizeContext: z.string().describe("Detailed comment on how the serving size impacts the nutritional assessment, including whether the serving size is realistic for typical consumption. If not provided, state that context is missing."),
  nutrientAnalysisTable: z.array(NutrientAnalysisItemSchema).describe("A detailed breakdown of each provided nutrient, with a verdict and comment on its health impact."),
});
export type AnalyzeNutritionOutput = z.infer<typeof AnalyzeNutritionOutputSchema>;

export async function analyzeNutrition(input: AnalyzeNutritionInput): Promise<AnalyzeNutritionOutput> {
  return analyzeNutritionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeNutritionPrompt',
  input: {schema: AnalyzeNutritionInputSchema},
  output: {
    schema: AnalyzeNutritionOutputSchema,
    format: 'json',
  },
  system: `You are an expert nutritionist for an Indian audience. Your task is to analyze the nutritional information provided and return a structured JSON object.
Your analysis must be extremely detailed, clear, and easy to understand. Use bullet points generously for better clarity.
Your entire response MUST be a single, valid JSON object that conforms to the output schema. Do not include any text outside this object.`,
  prompt: `Analyze the nutritional information below. For context, base your analysis and verdicts on a standard 2000 kcal diet where applicable (e.g., for Sodium, Sugar).

  {{#if servingSize}}Serving Size: {{servingSize}}{{/if}}
  {{#if nutritionDataUri}}
  Nutritional Information Table (from image): {{media url=nutritionDataUri}}
  (Prioritize the specific values provided below if there's a conflict. Use the image for overall context or missing values.)
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
  {{#if vitaminD}}Vitamin D: {{vitaminD}} (unit as provided){{/if}}
  {{#if calcium}}Calcium: {{calcium}}mg{{/if}}
  {{#if iron}}Iron: {{iron}}mg{{/if}}
  {{#if potassium}}Potassium: {{potassium}}mg{{/if}}
  {{#if vitaminC}}Vitamin C: {{vitaminC}}mg{{/if}}

  Now, generate the following extremely detailed report:

  1.  **Nutrition Density Rating**: Rate from 1 (low density) to 5 (high density).
  2.  **Overall Analysis**: A detailed summary of the key takeaways. Use bullet points.
  3.  **Macronutrient Balance**: Provide a detailed, bullet-point analysis of the macronutrient balance (carbohydrates, protein, fat). Discuss the quality of each (e.g., complex vs. simple carbs, source of protein) and its impact on energy levels, satiety, and overall health. Be specific.
  4.  **Micronutrient Highlights**: Create a detailed bullet-point list of any significant micronutrients (vitamins/minerals) present. For each, explain its importance and comment on whether the amount is high, low, or adequate. If none are noteworthy, state that clearly.
  5.  **Dietary Suitability**: Give highly specific, actionable advice on who this food is best suited for (e.g., 'An excellent post-workout recovery snack for athletes due to its carb-protein ratio') and who should avoid it (e.g., 'Not recommended for individuals with hypertension because of the high sodium content'). Mention specific dietary patterns like Keto, low-carb, or heart-healthy diets if applicable.
  6.  **Processing Level Assessment**: Based on the provided nutrient data, infer the likely level of processing (e.g., unprocessed, minimally processed, processed, ultra-processed). Provide a detailed explanation for your assessment and discuss the health implications.
  7.  **Serving Size Context**: Provide a detailed and critical analysis of the serving size. Is it realistic for how a person would typically consume this food? Explain how consuming a more realistic portion would change the nutritional impact (e.g., 'The label's serving size is only 3 biscuits, but most people eat the whole packet, which would quadruple the sugar and sodium intake.').
  8.  **Nutrient Analysis Table**: For EACH nutrient with a value provided above, create an entry in the 'nutrientAnalysisTable' array.
      - **Nutrient:** Name of the nutrient (e.g., 'Sodium').
      - **Value:** The value and unit (e.g., '500mg').
      - **Verdict:** Your assessment. Use 'High' or 'Very High' for values that are a significant portion of daily limits (e.g., Sodium > 400mg, Added Sugar > 10g). Use 'Good' for high fiber or protein. Use 'Low' for low amounts of sugar, sodium, etc. Use 'Okay' for moderate values.
      - **Comment:** A short, clear justification for your verdict. Example: "This is high, representing over 20% of the daily recommended intake."
  
  Be specific and provide actionable insights. If data is insufficient for a particular aspect, state that clearly.
`,
});

const analyzeNutritionFlow = ai.defineFlow(
  {
    name: 'analyzeNutritionFlow',
    inputSchema: AnalyzeNutritionInputSchema,
    outputSchema: AnalyzeNutritionOutputSchema,
  },
  async (input) => {
    try {
        const {output} = await prompt(input);
        if (!output) {
          throw new Error("The AI returned an empty or invalid analysis. Please try again.");
        }
        return output;
    } catch (error: any) {
        console.error(`An error occurred in analyzeNutritionFlow:`, error);
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
