
import { getBlogPostBySlug, blogPosts } from "@/lib/blog-data";
import Image from "next/image";
import { Link } from "@/navigation"; 
import { notFound } from "next/navigation";
import { CalendarDays, Tag, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { Article, BreadcrumbList } from 'schema-dts';
import Script from 'next/script';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.example.com';

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
      <article className="container mx-auto max-w-3xl py-8 px-4 md:px-6">
        <div className="mb-8">
          <Button variant="outline" asChild size="sm" className="mb-6 group transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
            <Link href="/blogs">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Back to Blogs
            </Link>
          </Button>
          <h1 className="text-4xl font-bold tracking-tight mb-3">{post.title}</h1>
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
          <div className="overflow-hidden rounded-lg shadow-md mb-8">
            <Image
              src={post.featuredImage}
              alt={post.title} 
              width={1200}
              height={675}
              className="w-full object-cover aspect-video transition-transform duration-300 hover:scale-105"
              priority
              data-ai-hint={post.dataAiHint}
            />
          </div>
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
          <Button asChild className="transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
            <Link href="/analyze">Analyze Your Food Label Now</Link>
          </Button>
        </div>
      </article>
    </>
  );
}
