'use server';
/**
 * @fileOverview This file defines a Genkit flow for context-aware AI chat about food labels.
 *
 * - contextAwareAIChat - A function that handles the chat process.
 * - ContextAwareAIChatInput - The input type for the contextAwareAIChat function.
 * - ContextAwareAIChatOutput - The return type for the contextAwareAIChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContextAwareAIChatInputSchema = z.object({
  productName: z.string().describe('The name of the food product.'),
  ingredients: z.string().describe('The list of ingredients in the food product.'),
  healthReport: z.string().describe('The AI-generated health report for the food product.'),
  userQuestion: z.string().describe('The user question about the food product and health report.'),
});
export type ContextAwareAIChatInput = z.infer<typeof ContextAwareAIChatInputSchema>;

const ContextAwareAIChatOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the user question, based on the product context and health report.'),
});
export type ContextAwareAIChatOutput = z.infer<typeof ContextAwareAIChatOutputSchema>;

export async function contextAwareAIChat(input: ContextAwareAIChatInput): Promise<ContextAwareAIChatOutput> {
  return contextAwareAIChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contextAwareAIChatPrompt',
  input: {schema: ContextAwareAIChatInputSchema},
  output: {schema: ContextAwareAIChatOutputSchema},
  prompt: `You are a helpful AI assistant that provides information about food products based on their ingredients and health reports.

  You are provided with the following information about a food product:
  Product Name: {{productName}}
  Ingredients: {{ingredients}}
  Health Report: {{healthReport}}

  A user has the following question:
  {{userQuestion}}

  Answer the user's question based on the provided information. Be specific and provide clear explanations.
  If you do not know the answer, respond that you are unable to answer due to a lack of information.
  Do not generate any disclaimers or safety warnings.
  Avoid weasel words, focus on being helpful and specific.
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
    return output!;
  }
);
