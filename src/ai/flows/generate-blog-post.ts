
import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const generateBlogPost = ai.defineFlow(
    {
        name: 'generateBlogPost',
        inputSchema: z.object({
            topic: z.string().describe('The main topic or title idea for the blog post'),
            tone: z.string().optional().describe('Tone of the article (e.g., specific, informative, casual)'),
        }),
        outputSchema: z.object({
            title: z.string(),
            slug: z.string(),
            excerpt: z.string(),
            content: z.string(),
            category: z.string(),
            tags: z.array(z.string()),
            readTime: z.string(),
            imagePrompt: z.string(),
        }),
    },
    async (input) => {
        const prompt = `
      You are an expert content writer for "EatWise India", a health and nutrition platform. 
      Write a comprehensive, engaging, and SEO-friendly blog post about: "${input.topic}".
      ${input.tone ? `Tone: ${input.tone}` : 'Tone: Informative, encouraging, and easy to understand for an Indian audience.'}

      The output MUST be a JSON object with these exact fields:
      - title: A catchy, SEO-optimized title.
      - slug: A URL-friendly slug (kebab-case).
      - excerpt: A short, engaging summary (max 2 sentences) for the blog card.
      - category: One relevant category (e.g., Nutrition, Ayurveda, Recipes, Wellness, Guides).
      - tags: An array of 5-8 relevant SEO tags.
      - readTime: Estimated read time (e.g., "5 min read").
      - content: The full blog post in HTML format. 
        * Use <h2> for main headings, <h3> for subheadings.
        * Use <p> for paragraphs.
        * Use <ul>/<li> for lists.
        * Do NOT use <h1>, Markdown, or code blocks. 
        * Include specific, actionable advice relevant to Indian diet/lifestyle.
      - imagePrompt: A highly detailed, standalone prompt to generate a photorealistic cover image using an AI like Midjourney or DALL-E 3. 
        * Specify subject, lighting (e.g., cinematic, natural golden hour), style (photorealistic, 8k resolution, highly detailed), and composition.
        * Aspect ratio should be mentioned as 16:9.
        * Example: "A top-down photorealistic shot of a traditional Indian thali with vibrant colors, steam rising from fresh dal, golden lighting, 8k resolution, cinematic composition --ar 16:9"
    `;

        const result = await ai.generate({
            prompt: prompt,
            output: {
                format: 'json',
                schema: z.object({
                    title: z.string(),
                    slug: z.string(),
                    excerpt: z.string(),
                    content: z.string(),
                    category: z.string(),
                    tags: z.array(z.string()),
                    readTime: z.string(),
                    imagePrompt: z.string(),
                }),
            },
        });

        if (!result.output) {
            throw new Error('Failed to generate blog post');
        }

        return result.output;
    }
);
