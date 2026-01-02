
// THIS FILE IS DEPRECATED.
// All blogs are now served dynamically from Firebase Firestore.
// See: src/lib/dynamic-blog.ts

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  preview: string;
  content: string;
  featuredImage: string;
  dataAiHint: string;
}

export const blogPosts: BlogPost[] = [];

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return undefined;
}

export const getBlogCategories = (): string[] => {
  return [];
}
