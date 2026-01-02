"use server";

import { generateBlogPost } from "@/ai/flows/generate-blog-post";

export async function generateBlogAction(topic: string) {
    try {
        // In Genkit v1+, defined flows are directly callable async functions.
        const result = await generateBlogPost({ topic });
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error generating blog:", error);
        return { success: false, error: error.message };
    }
}
