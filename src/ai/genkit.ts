
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai'; // Use Google AI plugin
import { enableFirebaseTelemetry } from '@genkit-ai/firebase';

enableFirebaseTelemetry();

export const ai = genkit({
  plugins: [
    googleAI(), // This will look for GOOGLE_API_KEY in your environment
  ],
  model: 'googleai/gemini-2.0-flash', // Default model
});
