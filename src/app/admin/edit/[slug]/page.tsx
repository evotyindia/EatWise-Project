"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { getDynamicPostBySlug, updateBlogPost, deleteBlogPost, DynamicBlogPost } from "@/lib/dynamic-blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2, Save, Upload, Trash2, Eye, CalendarDays, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import dynamic from 'next/dynamic';
import ImageCropper from "@/components/admin/image-cropper";

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false }) as any;
import 'react-quill-new/dist/quill.snow.css';

export default function EditBlogPage() {
    const router = useRouter();
    const params = useParams(); // Get slug from URL
    const slug = params.slug as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [postId, setPostId] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [cropFile, setCropFile] = useState<File | null>(null);
    const [isCropperOpen, setIsCropperOpen] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        coverImage: "",
        category: "Nutrition",
        readTime: "5 min read",
        author: "EatWise Team",
        tags: "",
        metaTitle: "",
        metaDescription: "",
        canonicalUrl: ""
    });

    useEffect(() => {
        async function loadPost() {
            if (!slug) return;
            try {
                const post = await getDynamicPostBySlug(slug);
                if (post) {
                    setPostId(post.id || null);
                    setFormData({
                        title: post.title,
                        slug: post.slug,
                        excerpt: post.excerpt,
                        content: post.content,
                        coverImage: post.coverImage,
                        category: post.category,
                        readTime: post.readTime,
                        author: post.author,
                        tags: post.tags.join(', '),
                        metaTitle: post.metaTitle || "",
                        metaDescription: post.metaDescription || "",
                        canonicalUrl: post.canonicalUrl || ""
                    });
                } else {
                    alert("Post not found");
                    router.push("/admin");
                }
            } catch (error) {
                console.error("Error loading post:", error);
            } finally {
                setLoading(false);
            }
        }
        loadPost();
    }, [slug, router]);

    // Handle initial file selection -> Open Cropper
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCropFile(file);
            setIsCropperOpen(true);
        }
        // Reset input so same file can be selected again if cancelled
        if (e.target) e.target.value = '';
    };

    // Called when cropping is done -> Upload to R2
    const handleCropComplete = async (croppedBlob: Blob) => {
        setUploading(true);
        setUploadProgress(0);

        try {
            // Convert blob to file for name/type
            const file = new File([croppedBlob], cropFile?.name || "image.jpg", { type: "image/jpeg" });

            // 1. Get Presigned URL
            const res = await fetch("/api/upload", {
                method: "POST",
                body: JSON.stringify({ filename: file.name, filetype: file.type }),
            });

            if (!res.ok) throw new Error("Failed to get upload URL");
            const { uploadUrl, fileKey } = await res.json();

            // 2. Upload to R2
            const upload = await fetch(uploadUrl, {
                method: "PUT",
                body: file,
                headers: { "Content-Type": file.type },
            });

            if (!upload.ok) throw new Error("Upload to Cloudflare failed");

            // 3. Construct Public URL
            const publicDomain = process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN || "https://pub-2ed7858c5208451892931a2386221544.r2.dev";
            const imageUrl = `${publicDomain}/${fileKey}`;

            setFormData(prev => ({ ...prev, coverImage: imageUrl }));
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Image upload failed.");
        } finally {
            setUploading(false);
            setCropFile(null);
        }
    };

    const handleDelete = async () => {
        if (!postId) return;
        if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;

        setDeleting(true);
        try {
            await deleteBlogPost(postId);
            alert("Post deleted successfully.");
            router.push("/admin");
        } catch (error) {
            console.error(error);
            alert("Failed to delete post.");
            setDeleting(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (saving || !postId) return;

        setSaving(true);

        try {
            const cleanSlug = formData.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

            const updatedPost: Partial<DynamicBlogPost> = {
                ...formData,
                slug: cleanSlug,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
                // date: keep original date
            };

            await updateBlogPost(postId, updatedPost);

            alert("Blog post updated successfully!");
            router.refresh();
            // router.push("/admin"); // Optional: stay on page to keep editing
            setSaving(false);
        } catch (error) {
            console.error("Failed to update:", error);
            alert("Failed to update blog post.");
            setSaving(false);
        }
    };

    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
            // Advanced Video/HTML embeds would require custom handlers
        ],
    }), []);

    // Helper to trigger file input click
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading post...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12 w-full max-w-full">
            <ImageCropper
                file={cropFile}
                isOpen={isCropperOpen}
                onClose={() => setIsCropperOpen(false)}
                onCropComplete={handleCropComplete}
            />

            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
                        <p className="text-muted-foreground">Editing: {formData.title}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/blogs/${formData.slug}`} target="_blank">
                        <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" /> Live View
                        </Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
                        {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Trash2 className="h-4 w-4 mr-2" /> Delete Post</>}
                    </Button>
                    <Button onClick={handleSubmit} size="sm" disabled={saving || uploading}>
                        {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Update Post</>}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
                <div className="space-y-6">
                    <Tabs defaultValue="content" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="content">Content</TabsTrigger>
                            <TabsTrigger value="seo">SEO & Metadata</TabsTrigger>
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                        </TabsList>

                        <TabsContent value="content" className="space-y-6 pt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Main Content</CardTitle>
                                    <CardDescription>Write your blog post content here.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Post Title</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="slug">Slug (URL)</Label>
                                        <Input
                                            id="slug"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground">URL: /blogs/{formData.slug}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="excerpt">Excerpt / Summary</Label>
                                        <Textarea
                                            id="excerpt"
                                            className="h-20"
                                            value={formData.excerpt}
                                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="content">Full Body</Label>
                                        <div className="min-h-[500px] mb-12">
                                            <ReactQuill
                                                theme="snow"
                                                value={formData.content}
                                                onChange={(content: string) => setFormData(prev => ({ ...prev, content }))}
                                                modules={modules}
                                                className="h-[450px]"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="seo" className="space-y-6 pt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>SEO Optimization</CardTitle>
                                    <CardDescription>Configure how this post appears in search results.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="metaTitle">Meta Title (Optional)</Label>
                                        <Input
                                            id="metaTitle"
                                            placeholder="Defaults to Post Title"
                                            value={formData.metaTitle}
                                            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                        />
                                        <p className="text-xs text-muted-foreground">Recommend 50-60 characters.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="metaDescription">Meta Description (Optional)</Label>
                                        <Textarea
                                            id="metaDescription"
                                            placeholder="Defaults to Excerpt"
                                            value={formData.metaDescription}
                                            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                            className="h-24"
                                        />
                                        <p className="text-xs text-muted-foreground">Recommend 150-160 characters.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="canonicalUrl">Canonical URL (Optional)</Label>
                                        <Input
                                            id="canonicalUrl"
                                            placeholder="https://..."
                                            value={formData.canonicalUrl}
                                            onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="preview" className="pt-4">
                            <Card className="bg-background border shadow-sm">
                                <CardContent className="p-0">
                                    {/* Simulated Blog Post Container - Adjusted padding to match live site exactly */}
                                    <div className="mx-auto max-w-3xl py-8 px-4 md:px-6">
                                        <div className="mb-8">
                                            {/* Header Mockup */}
                                            <Button variant="outline" size="sm" className="mb-6 pointer-events-none opacity-50">
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Back to Blogs
                                            </Button>

                                            <h1 className="text-4xl font-bold tracking-tight mb-3">{formData.title || "Untitled Post"}</h1>

                                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                                                <div className="flex items-center">
                                                    <CalendarDays className="mr-1.5 h-4 w-4" />
                                                    <span>{new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Tag className="mr-1.5 h-4 w-4" />
                                                    <Badge variant="secondary">{formData.category}</Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator className="my-8" />

                                        {formData.coverImage && (
                                            <div className="mb-8 relative w-full h-[400px] rounded-lg overflow-hidden shadow-md">
                                                {/* Use img for preview to avoid Next/Image config issues with blob/base64 */}
                                                <img
                                                    src={formData.coverImage}
                                                    alt="Cover Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}

                                        <div
                                            className="prose prose-lg dark:prose-invert max-w-none break-words overflow-hidden"
                                            dangerouslySetInnerHTML={{ __html: formData.content || "<p>Start writing...</p>" }}
                                        />

                                        <Separator className="my-12" />

                                        <div className="text-center">
                                            <Button className="pointer-events-none">
                                                Analyze Your Food Label Now
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Post Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Cover Image</Label>
                                <div
                                    className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer relative"
                                    onClick={triggerFileInput}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden" // Hiding and triggering via Ref to fix click issues
                                        onChange={handleFileSelect}
                                        disabled={uploading}
                                    />
                                    {uploading ? (
                                        <div className="flex flex-col items-center py-2">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                                            <p className="text-sm text-muted-foreground w-full">Uploading... {Math.round(uploadProgress)}%</p>
                                        </div>
                                    ) : formData.coverImage ? (
                                        <div className="relative w-full aspect-video rounded-md overflow-hidden">
                                            <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <span className="text-white text-sm font-medium">Click to Change & Crop</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center py-4">
                                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                            <p className="text-sm font-medium">Click to upload image</p>
                                            <p className="text-xs text-muted-foreground">or drag and drop</p>
                                        </div>
                                    )}
                                </div>
                                <Input
                                    placeholder="Paste Image URL"
                                    value={formData.coverImage}
                                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                                    className="mt-2"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Nutrition">Nutrition</SelectItem>
                                        <SelectItem value="Ayurveda">Ayurveda</SelectItem>
                                        <SelectItem value="Recipes">Recipes</SelectItem>
                                        <SelectItem value="Wellness">Wellness</SelectItem>
                                        <SelectItem value="Guides">Guides</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags</Label>
                                <Input
                                    id="tags"
                                    placeholder="healthy, vegan, quick"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="readTime">Read Time</Label>
                                <Input
                                    id="readTime"
                                    placeholder="e.g. 5 min read"
                                    value={formData.readTime}
                                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
