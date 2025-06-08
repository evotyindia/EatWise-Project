
import { BlogList } from "./blog-list";
import { BookOpen } from "lucide-react";
import { blogPosts, getBlogCategories } from "@/lib/blog-data";
import {NextPage} from 'next';

const BlogPage: NextPage = () => {
  const categories = getBlogCategories();

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col items-center mb-12">
        <BookOpen className="w-16 h-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-center">Nutrition & Wellness Blog</h1>
        <p className="mt-2 text-lg text-muted-foreground text-center max-w-2xl">
          Articles and insights on healthy eating, understanding food labels, and Indian nutrition.
        </p>
      </div>
      <BlogList initialPosts={blogPosts} categories={categories} />
    </div>
  );
}
export default BlogPage;
