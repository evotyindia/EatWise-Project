
import { getDynamicPostBySlug } from "@/lib/dynamic-blog";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, Tag, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { Article, BreadcrumbList, WithContext } from 'schema-dts';
import Script from 'next/script';

export const dynamic = "force-dynamic";

// ... existing imports ...

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://eatwise.evotyindia.me';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}


export async function generateMetadata({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const post = await getDynamicPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The blog post you are looking for could not be found."
    };
  }

  const imageUrl = post.coverImage && (post.coverImage.startsWith('http')
    ? post.coverImage
    : `${BASE_URL}${post.coverImage.startsWith('/') ? post.coverImage : `/${post.coverImage}`}`);

  return {
    title: `${post.title} | EatWise India Blogs`,
    description: post.excerpt,
    alternates: {
      canonical: `${BASE_URL}/blogs/${post.slug}`,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `${BASE_URL}/blogs/${post.slug}`,
      publishedTime: post.date ? new Date(post.date).toISOString() : new Date().toISOString(),
      authors: [`${BASE_URL}/#organization`],
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 1200,
          height: 675,
          alt: post.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: imageUrl ? [imageUrl] : [],
    }
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const post = await getDynamicPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const imageUrl = post.coverImage && (post.coverImage.startsWith('http')
    ? post.coverImage
    : `${BASE_URL}${post.coverImage.startsWith('/') ? post.coverImage : `/${post.coverImage}`}`);

  const articleStructuredData: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blogs/${post.slug}`,
    },
    headline: post.title,
    description: post.excerpt,
    image: imageUrl || `${BASE_URL}/img/logo_512x512.png`,
    datePublished: post.date ? new Date(post.date).toISOString() : new Date().toISOString(),
    dateModified: post.date ? new Date(post.date).toISOString() : new Date().toISOString(),
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

  const breadcrumbStructuredData: WithContext<BreadcrumbList> = {
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
        </div>

        <Separator className="my-8" />

        {post.coverImage && (
          <div className="mb-8 relative w-full h-[400px] rounded-lg overflow-hidden shadow-md">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div
          className="prose prose-lg dark:prose-invert max-w-none break-words overflow-hidden 
          prose-headings:font-bold prose-headings:tracking-tight 
          prose-h1:text-4xl prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-6 
          prose-h3:text-2xl 
          prose-p:leading-7 prose-p:text-muted-foreground/90
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
          prose-img:rounded-xl prose-img:shadow-lg prose-img:my-10 prose-img:border
          prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/30 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-8 prose-blockquote:rounded-r-lg prose-blockquote:italic
          prose-ul:my-6 prose-li:my-2
          "
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
