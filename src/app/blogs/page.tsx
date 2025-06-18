
import { BlogList } from "./blog-list";
import { BookOpen, Feather } from "lucide-react";
import { blogPosts, getBlogCategories } from "@/lib/blog-data";
import type { NextPage, Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://eatwise.evotyindia.me';

export const metadata: Metadata = {
  title: "Nutrition & Wellness Blogs | EatWise India",
  description: "Explore articles and insights on healthy eating, understanding food labels, and Indian nutrition with the EatWise India Blogs.",
  alternates: {
    canonical: `${BASE_URL}/blogs`,
  },
};

const BlogPage: NextPage = () => {
  const categories = getBlogCategories();

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="p-4 bg-primary/10 rounded-full mb-5 inline-block">
            <BookOpen className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-primary">Nutrition & Wellness Blogs</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
          Articles and insights on healthy eating, understanding food labels, and Indian nutrition. Your go-to resource for staying informed and inspired on your wellness journey.
        </p>
      </div>
      <BlogList initialPosts={blogPosts} categories={categories} />
      <div className="mt-12 p-6 bg-accent/10 rounded-xl border border-accent/20 text-center">
        <div className="flex items-center justify-center text-accent mb-3">
          <Feather className="w-6 h-6 mr-2" />
          <h2 className="text-xl font-semibold">Stay Curious, Stay Healthy</h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Our blog is regularly updated with new articles. Explore different categories to find topics that interest you, from decoding food labels to healthy recipes and kid's nutrition.
        </p>
      </div>
    </div>
  );
}
export default BlogPage;

