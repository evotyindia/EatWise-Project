
import { getBlogPostBySlug, blogPosts } from "@/lib/blog-data";
import Image from "next/image";
import { Link } from "@/navigation"; 
import { notFound } from "next/navigation";
import { CalendarDays, Tag, ArrowLeft, Edit3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { Article, BreadcrumbList } from 'schema-dts';
import Script from 'next/script';
import { Card, CardContent } from "@/components/ui/card";

const BASE_URL = 'https://eatwise.evotyindia.me';

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
    return { 
      title: "Post Not Found",
      description: "The blog post you are looking for could not be found." 
    };
  }
  return {
    title: `${post.title} | EatWise India Blogs`,
    description: post.preview,
    alternates: {
      canonical: `${BASE_URL}/blogs/${post.slug}`,
    },
    openGraph: { 
      type: 'article',
      title: post.title,
      description: post.preview,
      url: `${BASE_URL}/blogs/${post.slug}`,
      publishedTime: new Date(post.date).toISOString(),
      authors: [`${BASE_URL}/#organization`], 
      images: [
        {
          url: `${BASE_URL}${post.featuredImage.startsWith('/') ? post.featuredImage : '/' + post.featuredImage}`,
          width: 1200, 
          height: 675,
          alt: post.title,
        }
      ]
    },
    twitter: { 
        card: 'summary_large_image',
        title: post.title,
        description: post.preview,
        images: [`${BASE_URL}${post.featuredImage.startsWith('/') ? post.featuredImage : '/' + post.featuredImage}`],
    }
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const articleStructuredData: Article = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blogs/${post.slug}`,
    },
    headline: post.title,
    description: post.preview,
    image: `${BASE_URL}${post.featuredImage.startsWith('/') ? post.featuredImage : '/' + post.featuredImage}`,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(), 
    author: {
      "@type": "Organization", 
      name: "EatWise India Team",
      url: BASE_URL, 
    },
    publisher: {
      "@type": "Organization",
      name: "EatWise India",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/img/logo_200x60.png`,
        width: "200",
        height: "60"
      },
    },
  };

  const breadcrumbStructuredData: BreadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": BASE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blogs", 
        "item": `${BASE_URL}/blogs`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title
        
      }
    ]
  };

  return (
    <>
      <Script
        id="article-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <article className="container mx-auto max-w-3xl py-10 px-4 md:px-0"> {/* Removed horizontal padding for wider content on md+ */}
        <div className="mb-8">
          <Button variant="outline" asChild size="sm" className="mb-8 group transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 hover:bg-accent/10 hover:text-accent border-accent/50 text-accent">
            <Link href="/blogs">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Back to Blogs
            </Link>
          </Button>
          <Badge variant="secondary" className="mb-3 text-sm bg-accent/10 text-accent hover:bg-accent/20 py-1 px-3">
            <Tag className="mr-1.5 h-3.5 w-3.5" />{post.category}
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-primary">{post.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center">
              <CalendarDays className="mr-1.5 h-4 w-4 text-primary/70" />
              <span>Published on {new Date(post.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center">
                <Edit3 className="mr-1.5 h-4 w-4 text-primary/70" />
                <span>By EatWise India Team</span>
            </div>
          </div>
          <Card className="overflow-hidden shadow-xl rounded-xl mb-8 border-border">
            <Image
              src={post.featuredImage}
              alt={post.title} 
              width={1200}
              height={675}
              className="w-full object-cover aspect-video transition-transform duration-300 hover:scale-105"
              priority
              data-ai-hint={post.dataAiHint}
            />
          </Card>
        </div>
        
        <Separator className="my-10 border-border" />

        <div
          className="prose prose-lg dark:prose-invert max-w-none 
                     prose-headings:font-headline prose-headings:text-primary dark:prose-headings:text-primary-foreground/90 prose-headings:mb-4 prose-headings:mt-10 prose-headings:pb-1 prose-headings:border-b prose-headings:border-primary/20
                     prose-p:text-foreground/90 dark:prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-5
                     prose-a:text-accent hover:prose-a:text-accent/80 dark:prose-a:text-accent dark:hover:prose-a:text-accent/80 prose-a:font-medium prose-a:underline-offset-2 prose-a:underline
                     prose-strong:text-foreground dark:prose-strong:text-primary-foreground/90 font-medium
                     prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2 prose-li:marker:text-primary prose-li:mb-1.5
                     prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2 prose-li:marker:text-primary prose-li:mb-1.5
                     prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:rounded-r-md"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        <Separator className="my-12 border-border" />

        <Card className="p-6 bg-primary/5 border-primary/20 rounded-xl text-center shadow-lg">
            <h3 className="text-xl font-semibold text-primary mb-3">Ready to Eat Wiser?</h3>
            <p className="text-muted-foreground mb-4">
                Apply what you've learned! Analyze your next meal's label or find a healthy recipe.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 text-base">
                    <Link href="/analyze">Analyze Your Food Label</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-primary border-primary hover:bg-primary/10 hover:text-primary transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 text-base">
                    <Link href="/recipes">Get Recipe Ideas</Link>
                </Button>
            </div>
        </Card>
      </article>
    </>
  );
}
