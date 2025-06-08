
import {genkit} from 'genkit';
import {vertexAI} from '@genkit-ai/vertexai'; // Use Vertex AI plugin

export const ai = genkit({
  plugins: [
    vertexAI({
      location: 'us-central1', // Specify a default location for Vertex AI
      // You can also specify projectId here if needed, though it's often picked up from the environment
      // projectId: 'your-google-cloud-project-id', 
    }),
  ],
  model: 'vertexai/gemini-1.5-pro-latest', // Use Vertex AI model prefix and Pro model
});
