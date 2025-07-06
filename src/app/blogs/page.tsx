
import { BlogList } from "./blog-list";
import { BookOpen } from "lucide-react";

export default function BlogPage() {
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
