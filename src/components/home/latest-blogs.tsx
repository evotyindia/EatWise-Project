"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, BookOpen } from "lucide-react";
import { getAllDynamicPosts, DynamicBlogPost } from "@/lib/dynamic-blog";

export default function LatestBlogs() {
    const [posts, setPosts] = useState<DynamicBlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const allPosts = await getAllDynamicPosts();
                // Take top 3
                setPosts(allPosts.slice(0, 3));
            } catch (err) {
                console.error("Failed to fetch latest blogs", err);
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, []);

    if (loading) {
        return <div className="py-12 text-center">Loading latest updates...</div>;
    }

    if (posts.length === 0) return null;

    return (
        <section id="from-the-blog" aria-labelledby="blog-heading" className="w-full py-12 md:py-24 lg:py-32 bg-muted/20">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out">
                    <BookOpen className="mx-auto h-12 w-12 text-accent mb-4" />
                    <h2 id="blog-heading" className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        From Our Blog
                    </h2>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
                        Get the latest insights on nutrition, healthy recipes, and wellness tips.
                    </p>
                </div>
                <div className="grid gap-8 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-12 duration-500 ease-out">
                    {posts.map((post) => (
                        <Card key={post.slug} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            {post.coverImage && (
                                <div className="relative w-full h-48">
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                            )}
                            <CardContent className="p-6 flex-grow">
                                <p className="text-sm text-accent font-medium mb-1">{post.category}</p>
                                <Link href={`/blogs/${post.slug}`}>
                                    <CardTitle className="text-xl font-semibold hover:text-primary transition-colors line-clamp-2">
                                        {post.title}
                                    </CardTitle>
                                </Link>
                                <CardDescription className="mt-2 text-sm line-clamp-3">{post.excerpt}</CardDescription>
                            </CardContent>
                            <CardFooter className="p-6 pt-0">
                                <Button variant="link" asChild className="px-0 text-primary group transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
                                    <Link href={`/blogs/${post.slug}`}>
                                        Read More <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom-16 duration-500 ease-out">
                    <Button asChild size="lg" variant="outline" className="transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
                        <Link href="/blogs">View All Articles</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
