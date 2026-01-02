
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai'; // Use Google AI plugin

export const ai = genkit({
  plugins: [
    googleAI(), // This will look for GOOGLE_API_KEY in your environment
  ],
  model: 'googleai/gemini-2.5-flash', // Default model
});

