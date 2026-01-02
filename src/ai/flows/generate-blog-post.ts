
import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const generateBlogPost = ai.defineFlow(
    {
        name: 'generateBlogPost',
        inputSchema: z.object({
            topic: z.string().describe('The main topic of the blog post'),
            keywords: z.array(z.string()).optional().describe('Optional keywords to include'),
        }),
        outputSchema: z.object({
            title: z.string(),
            slug: z.string(),
            category: z.string(),
            content: z.string(),
            preview: z.string(),
            dataAiHint: z.string(),
        }),
    },
    async (input) => {
        const prompt = `
      Write a comprehensive, engaging, and SEO-friendly blog post about "${input.topic}".
      ${input.keywords ? `Keywords to include: ${input.keywords.join(', ')}.` : ''}

      The output must be a JSON object with the following fields:
      - title: A catchy title.
      - slug: A URL-friendly slug (kebab-case).
      - category: A relevant category (e.g., Healthy Eating, Nutrition Basics, Healthy Living).
      - content: The full blog post content in HTML format. Use <h2> for headings, <p> for paragraphs, and <ul>/<li> for lists. Do NOT use <h1> or markdown. Include specific, actionable advice relevant to an Indian audience if applicable.
      - preview: A short, 2-sentence summary for the blog card.
      - dataAiHint: A short 2-3 word hint for an AI image generator (e.g., "healthy food", "yoga").

      Make the tone informative, encouraging, and easy to understand.
    `;

        const result = await ai.generate({
            prompt: prompt,
            output: {
                format: 'json',
                schema: z.object({
                    title: z.string(),
                    slug: z.string(),
                    category: z.string(),
                    content: z.string(),
                    preview: z.string(),
                    dataAiHint: z.string(),
                }),
            },
        });

        if (!result.output) {
            throw new Error('Failed to generate blog post');
        }

        return result.output;
    }
);
