"use client";

import { useEffect, useState } from "react";
import { getAllDynamicPosts, DynamicBlogPost } from "@/lib/dynamic-blog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { migrateStaticBlogs } from "@/lib/migration";
import { Edit, RefreshCw } from "lucide-react";

export default function AdminDashboard() {
    const [posts, setPosts] = useState<DynamicBlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [migrating, setMigrating] = useState(false);

    async function fetchPosts() {
        setLoading(true);
        const data = await getAllDynamicPosts();
        setPosts(data);
        setLoading(false);
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleMigrate = async () => {
        if (!confirm("This will import all static blogs into the database. Existing database entries with same slug will be skipped. Proceed?")) return;

        setMigrating(true);
        try {
            const result = await migrateStaticBlogs();
            alert(`Migration Complete!\nImported: ${result.migratedCount}\nSkipped/Errors: ${result.errors}`);
            await fetchPosts(); // Refresh list
        } catch (e) {
            console.error(e);
            alert("Migration failed.");
        } finally {
            setMigrating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Manage your blog posts and content.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleMigrate} disabled={migrating}>
                        {migrating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                        Migrate Legacy Blogs
                    </Button>
                    <Button asChild>
                        <Link href="/admin/create"><Plus className="mr-2 h-4 w-4" /> Create New Post</Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{posts.length}</div>
                    </CardContent>
                </Card>
                {/* Placeholders for future stats */}
            </div>

            <div className="border rounded-lg bg-card">
                <div className="p-4 border-b">
                    <h2 className="font-semibold">Recent Posts</h2>
                </div>
                <div className="divide-y">
                    {posts.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            No posts yet. Click "Create New Post" or "Migrate Legacy Blogs" to get started.
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div key={post.id || post.slug} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                <div className="space-y-1">
                                    <h3 className="font-medium hover:underline cursor-pointer"><Link href={`/blogs/${post.slug}`} target="_blank">{post.title}</Link></h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                                        <span className="flex items-center"><Calendar className="mr-1 h-3 w-3" /> {new Date(post.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/admin/edit/${post.slug}`}>
                                            <Edit className="h-3 w-3 mr-1" /> Edit
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
