
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai'; // Reverted to googleAI

export const ai = genkit({
  plugins: [googleAI()], // Reverted to googleAI plugin
  model: 'googleai/gemini-1.5-flash-latest', // Using googleai prefix
});
