
import { blogPosts } from "./blog-data";
import { createBlogPost, getDynamicPostBySlug } from "./dynamic-blog";

export async function migrateStaticBlogs() {
    let migratedCount = 0;
    let errors = 0;

    for (const post of blogPosts) {
        try {
            // Check if already exists to avoid duplicates/overwrites
            const existing = await getDynamicPostBySlug(post.slug);
            if (existing) {
                console.log(`Skipping ${post.slug} (already exists)`);
                continue;
            }

            // Create new dynamic post from static data
            await createBlogPost({
                title: post.title,
                slug: post.slug,
                excerpt: post.preview,
                content: post.content,
                coverImage: post.featuredImage,
                category: post.category,
                readTime: "5 min read", // Default as it is not in static data
                author: "EatWise Team",
                tags: [post.dataAiHint], // Use hint as a tag
                date: post.date // Keep original date
            });
            migratedCount++;
        } catch (e) {
            console.error(`Failed to migrate ${post.slug}:`, e);
            errors++;
        }
    }

    return { migratedCount, errors };
}
