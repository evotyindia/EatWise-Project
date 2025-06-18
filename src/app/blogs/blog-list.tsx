
"use client";

import type { BlogPost } from "@/lib/blog-data";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Filter, Tag } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface BlogListProps {
  initialPosts: BlogPost[];
  categories: string[];
}

export function BlogList({ initialPosts, categories }: BlogListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "All") {
      return initialPosts;
    }
    return initialPosts.filter(post => post.category === selectedCategory);
  }, [initialPosts, selectedCategory]);

  return (
    <div>
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-card border border-border rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold text-primary">Latest Articles</h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48 md:w-56 transition-all duration-300 ease-in-out hover:border-primary focus:ring-primary text-base py-2.5 rounded-lg">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              {categories.map(category => (
                <SelectItem key={category} value={category} className="text-base py-2">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredPosts.length === 0 && (
        <p className="text-center text-muted-foreground py-10 text-lg">No articles found for this category. Try selecting 'All Categories'.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <Card key={post.slug} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-border rounded-xl hover:border-primary/50 min-w-0">
            <CardHeader className="p-0">
              <Link href={`/blogs/${post.slug}`} aria-label={post.title} className="block overflow-hidden rounded-t-xl">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  width={600}
                  height={350} 
                  className="w-full h-52 object-cover transition-transform duration-300 hover:scale-105"
                  data-ai-hint={post.dataAiHint}
                />
              </Link>
            </CardHeader>
            <CardContent className="p-6 flex-grow">
              <Badge variant="secondary" className="mb-2 text-sm bg-accent/10 text-accent hover:bg-accent/20">
                <Tag className="mr-1.5 h-3.5 w-3.5" />{post.category}
              </Badge>
              <Link href={`/blogs/${post.slug}`}>
                <CardTitle className="text-xl font-semibold hover:text-primary transition-colors leading-tight">
                  {post.title}
                </CardTitle>
              </Link>
              <CardDescription className="mt-2 text-sm line-clamp-3 text-muted-foreground">{post.preview}</CardDescription>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button variant="link" asChild className="px-0 text-primary group transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 font-semibold">
                <Link href={`/blogs/${post.slug}`}>
                  Read More <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
