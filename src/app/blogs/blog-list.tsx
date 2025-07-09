
"use client";

import { blogPosts, getBlogCategories, type BlogPost } from "@/lib/blog-data";
import Link from "next/link";
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function BlogList() {
  const allPosts = blogPosts;
  const allCategories = getBlogCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "All") {
      return allPosts;
    }
    return allPosts.filter(post => post.category === selectedCategory);
  }, [allPosts, selectedCategory]);

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold">Latest Articles</h2>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px] transition-transform duration-300 ease-in-out hover:scale-105">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {allCategories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredPosts.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No articles found for this category.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <Card key={post.slug} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 flex-grow">
              <p className="text-sm text-accent font-medium mb-1">{post.category}</p>
              <Link href={`/blogs/${post.slug}`}>
                <CardTitle className="text-xl font-semibold hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
              </Link>
              <CardDescription className="mt-2 text-sm line-clamp-3">{post.preview}</CardDescription>
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
    </div>
  );
}
