"use client";

import { useEffect, useState } from "react";
import { getAllDynamicPosts, DynamicBlogPost } from "@/lib/dynamic-blog";
import { Button } from "@/components/ui/button";
import { Plus, Search, Calendar, FileText, BarChart3, Users, ArrowUpRight, Loader2, RefreshCw, MoreVertical, Edit, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { migrateStaticBlogs } from "@/lib/migration";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminDashboard() {
    const [posts, setPosts] = useState<DynamicBlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [migrating, setMigrating] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    async function fetchPosts() {
        setLoading(true);
        const data = await getAllDynamicPosts();
        // Sort by date descending
        data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ... inside component ...

    const [stats, setStats] = useState([
        { title: "Total Posts", value: "0", icon: FileText, description: "All published articles", trend: "" },
        { title: "Total Views", value: "0", icon: Users, description: "Live page views", trend: "" },
        { title: "Engagement", value: "0%", icon: BarChart3, description: "Avg. engagement", trend: "" },
    ]);

    async function fetchStats() {
        try {
            // 1. Total Posts
            // (Already have posts.length, but let's be robust)

            // 2. Total Views from Analytics Collection
            // 2. Total Views from Analytics Collection
            console.log("Dashboard: Fetching view count..."); // DEBUG
            const coll = collection(db, "analytics");
            const q = query(coll, where("type", "==", "view"));
            const snapshot = await getCountFromServer(q);
            const views = snapshot.data().count;
            console.log("Dashboard: View count fetched:", views); // DEBUG

            setStats([
                {
                    title: "Total Posts",
                    // ... existing
                    value: posts.length.toString(),
                    icon: FileText,
                    description: "All published articles",
                    trend: "+1 this week"
                },
                {
                    title: "Total Views",
                    value: views.toString(),
                    icon: Users,
                    description: "Live page views",
                    trend: "Real-time"
                },
                {
                    title: "Engagement",
                    value: "N/A",
                    icon: BarChart3,
                    description: "Coming soon",
                    trend: ""
                },
            ]);
        } catch (e: any) {
            console.error("Failed to fetch stats ERROR:", e);
            if (e.code === 'permission-denied') {
                console.error("PERMISSION DENIED: Check firestore.rules and logged-in user email.");
            }
        }
    }

    useEffect(() => {
        if (posts.length > 0) {
            fetchStats();
        }
    }, [posts]);

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back! Here&apos;s an overview of your blog content.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleMigrate} disabled={migrating}>
                        {migrating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                        Migrate Legacy
                    </Button>
                    <Link href="/admin/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Create Post
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((stat, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{loading ? "..." : stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                                {stat.trend && <span className="text-green-500 ml-1 font-medium">{stat.trend}</span>}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Content Section */}
            <Card className="col-span-4">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Recent Posts</CardTitle>
                            <CardDescription>
                                Manage your blog posts. You have {posts.length} total posts.
                            </CardDescription>
                        </div>
                        <div className="relative w-64 hidden md:block">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search posts..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* Mobile Search */}
                    <div className="md:hidden mt-4 relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search posts..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin mb-2" />
                            <p>Loading posts...</p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead className="hidden md:table-cell">Date</TableHead>
                                        <TableHead className="hidden md:table-cell">Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPosts.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">
                                                No results found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredPosts.map((post) => (
                                            <TableRow key={post.id || post.slug}>
                                                <TableCell className="font-medium">
                                                    <Link href={`/blogs/${post.slug}`} className="hover:underline flex items-center gap-2" target="_blank">
                                                        {post.title}
                                                        <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-50" />
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">{post.category}</Badge>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell text-muted-foreground">
                                                    <div className="flex items-center">
                                                        <Calendar className="mr-2 h-3 w-3" />
                                                        {new Date(post.date).toLocaleDateString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Published</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/edit/${post.slug}`} className="cursor-pointer">
                                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/blogs/${post.slug}`} target="_blank" className="cursor-pointer">
                                                                    <Eye className="mr-2 h-4 w-4" /> View Live
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
