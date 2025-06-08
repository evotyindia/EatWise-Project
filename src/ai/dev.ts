
import { config } from 'dotenv';
config();

import '@/ai/flows/context-aware-ai-chat.ts';
import '@/ai/flows/generate-health-report.ts';
import '@/ai/flows/recipe-suggestions.ts';
import '@/ai/flows/nutrition-analysis.ts';
import '@/ai/flows/get-detailed-recipe.ts'; // Added new flow
