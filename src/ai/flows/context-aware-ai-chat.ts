
'use server';
/**
 * @fileOverview This file defines a Genkit flow for context-aware AI chat.
 * The chat can be about food label analysis, recipes, or nutrition facts.
 *
 * - contextAwareAIChat - A function that handles the chat process.
 * - ContextAwareAIChatInput - The input type for the contextAwareAIChat function.
 * - ContextAwareAIChatOutput - The return type for the contextAwareAIChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string()
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

const LabelAnalysisContextSchema = z.object({
  productName: z.string().optional().describe('The name of the food product.'),
  ingredients: z.string().optional().describe('The list of ingredients in the food product.'),
  healthReportSummary: z.string().describe('A summary of the AI-generated health report for the food product.')
}).describe("Context for chat related to food label analysis.");

const RecipeContextSchema = z.object({
  dishName: z.string().describe("Name of the recipe being discussed."),
  recipeIngredients: z.string().optional().describe("Ingredients list for the recipe (comma-separated or as a block)."),
  recipeInstructions: z.string().optional().describe("Cooking instructions for the recipe (can be a summary or key steps)."),
  currentRecipeHealthNotes: z.string().optional().describe("Health notes provided with the current recipe."),
}).describe("Context for chat related to a specific recipe.");

const NutritionAnalysisContextSchema = z.object({
  nutritionReportSummary: z.string().describe("Summary of the nutrition analysis provided to the user."),
  foodItemDescription: z.string().optional().describe("Brief description of the food item whose nutrition is being analyzed.")
}).describe("Context for chat related to nutrition facts analysis.");

const GeneralChatContextSchema = z.object({
  topic: z.string().optional().describe("General topic if not specific to a page feature, e.g., 'general health query'.")
}).describe("Context for general queries not tied to a specific app feature shown on page.");


const ContextAwareAIChatInputSchema = z.object({
  userQuestion: z.string().describe('The user question. Can be "INIT_CHAT" to request a welcome message.'),
  chatHistory: z.array(ChatMessageSchema).max(10).optional().describe("Previous messages in the conversation for context (max 10). Last message is newest."),
  contextType: z.enum(["labelAnalysis", "recipe", "nutritionAnalysis", "general"]),
  labelContext: LabelAnalysisContextSchema.optional(),
  recipeContext: RecipeContextSchema.optional(),
  nutritionContext: NutritionAnalysisContextSchema.optional(),
  generalContext: GeneralChatContextSchema.optional()
}).refine(data => {
  if (data.contextType === "labelAnalysis") return !!data.labelContext;
  if (data.contextType === "recipe") return !!data.recipeContext;
  if (data.contextType === "nutritionAnalysis") return !!data.nutritionContext;
  return true; // generalContext is optional
}, {
  message: "Context object must be provided corresponding to contextType if not 'general'.",
  path: ["labelContext", "recipeContext", "nutritionContext"],
});
export type ContextAwareAIChatInput = z.infer<typeof ContextAwareAIChatInputSchema>;

const ContextAwareAIChatOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the user question, based on the provided context.'),
  // suggestedFollowUpQuestions: z.array(z.string()).optional().describe("A few suggested follow-up questions if appropriate.")
});
export type ContextAwareAIChatOutput = z.infer<typeof ContextAwareAIChatOutputSchema>;

export async function contextAwareAIChat(input: ContextAwareAIChatInput): Promise<ContextAwareAIChatOutput> {
  return contextAwareAIChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contextAwareAIChatPrompt',
  input: {schema: ContextAwareAIChatInputSchema},
  output: {schema: ContextAwareAIChatOutputSchema},
  prompt: `You are "EatWise AI Advisor", a friendly and knowledgeable AI assistant for Swasth Bharat Advisor, an app helping users with Indian food choices.
Your responses should be helpful, concise, and directly address the user's question based on the provided context and chat history.
Do not generate any disclaimers or safety warnings unless specifically asked about safety. Avoid weasel words.
Maintain a supportive and encouraging tone. Your persona is an expert nutritionist and chef.

Previous conversation:
{{#if chatHistory}}
  {{#each chatHistory}}
    {{#if (eq role "user")}}User: {{content}}{{/if}}
    {{#if (eq role "assistant")}}AI Advisor: {{content}}{{/if}}
  {{/each}}
{{else}}
This is the beginning of our conversation.
{{/if}}

Current User Question: {{userQuestion}}

{{#if (eq userQuestion "INIT_CHAT_WELCOME")}}
  Please provide a welcoming message suitable for the current context.
  For example, if it's about a recipe, say something like "Hello! I'm here to help with the '{{recipeContext.dishName}}' recipe. What would you like to know? You can ask about ingredient substitutions, cooking techniques, or nutritional aspects."
  If it's about a food label, "Hi there! I see you're looking at '{{labelContext.productName}}'. I can help answer questions about its health report or ingredients. What's on your mind?"
  If it's general, "Welcome to EatWise Advisor! How can I help you with your nutrition or healthy eating questions today?"
  Tailor the welcome message.
{{/if}}

Context:
{{#if (eq contextType "labelAnalysis")}}
  You are assisting with a food label analysis report.
  Product Name: {{labelContext.productName}}
  Ingredients: {{labelContext.ingredients}}
  Health Report Summary: {{labelContext.healthReportSummary}}
  Focus your answers on these details.
{{else if (eq contextType "recipe")}}
  You are assisting with a recipe.
  Dish Name: {{recipeContext.dishName}}
  {{#if recipeContext.recipeIngredients}}Ingredients for the recipe: {{recipeContext.recipeIngredients}}{{/if}}
  {{#if recipeContext.recipeInstructions}}Instructions: {{recipeContext.recipeInstructions}}{{/if}}
  {{#if recipeContext.currentRecipeHealthNotes}}Health Notes for this recipe: {{recipeContext.currentRecipeHealthNotes}}{{/if}}
  Answer questions about this recipe, like substitutions, steps clarification, or nutritional aspects.
{{else if (eq contextType "nutritionAnalysis")}}
  You are assisting with a nutrition facts analysis.
  {{#if nutritionContext.foodItemDescription}}Food Item: {{nutritionContext.foodItemDescription}}{{/if}}
  Nutrition Report Summary: {{nutritionContext.nutritionReportSummary}}
  Answer questions about this nutrition report.
{{else if (eq contextType "general")}}
  You are assisting with a general query.
  {{#if generalContext.topic}}Topic: {{generalContext.topic}}{{/if}}
  Provide general nutritional advice or healthy eating tips.
{{/if}}

Based on the chat history and the current context, provide a helpful and concise answer to the user's question.
If the question is unclear or outside your scope (Indian food, nutrition, provided context), politely state that you cannot help with that specific query.

IMPORTANT: Your entire response MUST be a single, valid JSON object that conforms to the output schema. Do not include any text or explanations outside of this JSON object.
`,
});

const contextAwareAIChatFlow = ai.defineFlow(
  {
    name: 'contextAwareAIChatFlow',
    inputSchema: ContextAwareAIChatInputSchema,
    outputSchema: ContextAwareAIChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      console.error('contextAwareAIChatFlow: LLM output was null or did not match schema for input:', JSON.stringify(input));
      return {
        answer: "I'm sorry, I encountered an issue and couldn't process your question right now. Please try again."
      };
    }
    return output;
  }
);
