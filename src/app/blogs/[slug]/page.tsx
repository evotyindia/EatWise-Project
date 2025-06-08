import { getBlogPostBySlug, blogPosts } from "@/lib/blog-data";
import Image from "next/image";
import { Link } from "@/navigation"; // Will now use standard next/link
import { notFound } from "next/navigation";
import { CalendarDays, Tag, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
// import { locales } from '@/i18n'; // Removed

interface BlogPostPageProps {
  params: {
    slug: string;
    // locale: string; // Removed locale
  };
}

export async function generateStaticParams() {
  // const params = []; // Simplified
  // for (const locale of locales) { // Removed locale iteration
  //   for (const post of blogPosts) {
  //     params.push({ locale, slug: post.slug });
  //   }
  // }
  // return params;
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
    title: `${post.title} | Swasth Bharat Advisor Blog`,
    description: post.preview,
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto max-w-3xl py-8 px-4 md:px-6">
      <div className="mb-8">
        <Button variant="outline" asChild size="sm" className="mb-6 group">
          <Link href="/blogs">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Blog
          </Link>
        </Button>
        <h1 className="text-4xl font-bold tracking-tight mb-3">{post.title}</h1>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <CalendarDays className="mr-1.5 h-4 w-4" />
            {/* Using 'en-IN' as a default locale for date formatting */}
            <span>{new Date(post.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center">
            <Tag className="mr-1.5 h-4 w-4" />
            <Badge variant="secondary">{post.category}</Badge>
          </div>
        </div>
        <Image
          src={post.featuredImage}
          alt={post.title}
          width={1200}
          height={675}
          className="w-full rounded-lg shadow-md mb-8 object-cover aspect-video"
          priority
          data-ai-hint={post.dataAiHint}
        />
      </div>
      
      <Separator className="my-8" />

      <div
        className="prose prose-lg dark:prose-invert max-w-none 
                   prose-headings:font-headline prose-headings:text-primary dark:prose-headings:text-primary-foreground/90
                   prose-p:text-foreground/90 dark:prose-p:text-foreground/80
                   prose-a:text-accent hover:prose-a:text-accent/80 dark:prose-a:text-accent dark:hover:prose-a:text-accent/80
                   prose-strong:text-foreground dark:prose-strong:text-primary-foreground/90
                   prose-ul:list-disc prose-ul:pl-6 prose-li:marker:text-accent
                   prose-ol:list-decimal prose-ol:pl-6 prose-li:marker:text-accent"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      <Separator className="my-12" />

      <div className="text-center">
        <Button asChild>
          <Link href="/analyze">Analyze Your Food Label Now</Link>
        </Button>
      </div>
    </article>
  );
}
