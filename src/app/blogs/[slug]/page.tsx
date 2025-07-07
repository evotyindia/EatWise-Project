
import { getBlogPostBySlug, blogPosts } from "@/lib/blog-data";
import Link from "next/link"; 
import { notFound } from "next/navigation";
import { CalendarDays, Tag, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) {
    return { title: "Post Not Found" };
  }
  return {
    title: `${post.title} | EatWise India Blog`,
    description: post.preview,
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto max-w-3xl py-8">
      <div className="mb-8">
        <Button variant="outline" asChild size="sm" className="mb-6 group">
          <Link href="/blogs">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Blog
          </Link>
        </Button>
        <h1 className="text-4xl font-bold tracking-tight mb-3 text-primary">{post.title}</h1>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <CalendarDays className="mr-1.5 h-4 w-4" />
            <span>{new Date(post.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center">
            <Tag className="mr-1.5 h-4 w-4" />
            <Badge variant="secondary">{post.category}</Badge>
          </div>
        </div>
      </div>
      
      <Separator className="my-8" />

      <div
        className="prose prose-lg dark:prose-invert max-w-none 
                   prose-headings:font-headline prose-headings:text-primary
                   prose-p:text-foreground/90
                   prose-a:text-accent hover:prose-a:text-accent/80
                   prose-strong:text-foreground
                   prose-ul:list-disc prose-ul:pl-6 prose-li:marker:text-accent
                   prose-ol:list-decimal prose-ol:pl-6 prose-li:marker:text-accent"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      <Separator className="my-12" />

      <div className="text-center">
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href="/analyze">Analyze Your Food Label Now</Link>
        </Button>
      </div>
    </article>
  );
}

    