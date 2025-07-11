
import { BlogList } from "./blog-list";
import { BookOpen } from "lucide-react";
import type { NextPage, Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: "Nutrition & Healthy Eating Blogs",
  description: "Explore articles on Indian nutrition, decoding food labels, healthy recipes, and wellness tips from the EatWise India experts.",
  alternates: {
    canonical: `${BASE_URL}/blogs`,
  },
};

const BlogPage: NextPage = () => {
  return (
    <div className="container mx-auto py-8 animate-fade-in-up opacity-0" style={{animationFillMode: 'forwards'}}>
      <div className="flex flex-col items-center mb-12 text-center">
        <BookOpen className="w-16 h-16 text-accent mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">Nutrition & Wellness Blog</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
          Articles and insights on healthy eating, understanding food labels, and Indian nutrition.
        </p>
      </div>
      <BlogList />
    </div>
  );
}
export default BlogPage;
