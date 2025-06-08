
import {genkit} from 'genkit';
import {vertexAI} from '@genkit-ai/vertexai'; // Corrected import

export const ai = genkit({
  plugins: [vertexAI({location: 'us-central1'})], // Specify a location for Vertex AI
  model: 'vertexai/gemini-1.5-flash-latest', 
});

