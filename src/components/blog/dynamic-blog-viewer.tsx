"use client";

import { useEffect, useState } from "react";
import { getDynamicPostBySlug, DynamicBlogPost } from "@/lib/dynamic-blog"; // Need to add this function
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, Tag, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function DynamicBlogViewer({ slug }: { slug: string }) {
    const [post, setPost] = useState<DynamicBlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                // We need to implement getDynamicPostBySlug in dynamic-blog.ts
                // For now, doing a manual query in the lib function
                const { getDynamicPostBySlug } = await import("@/lib/dynamic-blog");
                const data = await getDynamicPostBySlug(slug);
                if (data) {
                    setPost(data);
                } else {
                    setError(true);
                }
            } catch (e) {
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading article...</p>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
                <p className="text-muted-foreground mb-8">We couldn't find the article you're looking for.</p>
                <Button asChild>
                    <Link href="/blogs">Back to Blogs</Link>
                </Button>
            </div>
        );
    }

    return (
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
                className="prose prose-lg dark:prose-invert max-w-none 
                     prose-headings:font-headline prose-headings:text-primary dark:prose-headings:text-primary
                     prose-p:text-foreground/90 dark:prose-p:text-foreground/80
                     prose-a:text-accent hover:prose-a:text-accent/80 dark:prose-a:text-accent dark:hover:prose-a:text-accent/80
                     prose-strong:text-foreground dark:prose-strong:text-foreground
                     prose-ul:list-disc prose-ul:pl-6 prose-li:marker:text-accent
                     prose-ol:list-decimal prose-ol:pl-6 prose-li:marker:text-accent"
                dangerouslySetInnerHTML={{ __html: post.content }} // Note: in real app, use a markdown parser like react-markdown
            />

            <Separator className="my-12" />

            <div className="text-center">
                <Button asChild className="transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
                    <Link href="/analyze">Analyze Your Food Label Now</Link>
                </Button>
            </div>
        </article>
    );
}
