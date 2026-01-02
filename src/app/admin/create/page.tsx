"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { createBlogPost, DynamicBlogPost } from "@/lib/dynamic-blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Keep for excerpt
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Loader2, Save, Upload, Image as ImageIcon, Sparkles, Wand2, Copy, Check } from "lucide-react";
import Link from "next/link";
import { generateBlogAction } from "@/app/actions/generate-blog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
// import { storage } from "@/lib/firebase";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import dynamic from 'next/dynamic';
import ImageCropper from "@/components/admin/image-cropper";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false }) as any;
import 'react-quill-new/dist/quill.snow.css';

export default function CreateBlogPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

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
        tags: ""
    });

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        setFormData(prev => ({ ...prev, title, slug }));
    };

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // STRICT CHECK: Prevent duplicate submissions
        if (loading) return;

        setLoading(true);

        try {
            const cleanSlug = formData.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

            const newPost: Omit<DynamicBlogPost, "id"> = {
                ...formData,
                slug: cleanSlug,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
                date: new Date().toISOString()
            };

            await createBlogPost(newPost);

            alert("Blog post published successfully!");
            router.push("/admin");
        } catch (error) {
            console.error("Failed to publish:", error);
            alert("Failed to publish blog post. Check console.");
            setLoading(false); // Only reset loading on error so they can retry. 
            // On success, we navigate away, so no need to reset (and resetting allows double click before nav).
        }
    };

    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
    }), []);

    // AI Generation State
    const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
    const [aiLink, setAiLink] = useState(""); // Not used, maybe topic
    const [aiTopic, setAiTopic] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImagePrompt, setGeneratedImagePrompt] = useState("");
    const [hasCopiedPrompt, setHasCopiedPrompt] = useState(false);

    const handleGenerateContent = async () => {
        if (!aiTopic.trim()) return;
        setIsGenerating(true);
        try {
            const result = await generateBlogAction(aiTopic);
            if (result.success && result.data) {
                const data = result.data;
                setFormData(prev => ({
                    ...prev,
                    title: data.title,
                    slug: data.slug,
                    excerpt: data.excerpt,
                    content: data.content,
                    category: data.category,
                    readTime: data.readTime,
                    tags: data.tags.join(", "),
                }));
                setGeneratedImagePrompt(data.imagePrompt);
                setIsAiDialogOpen(false);
                setAiTopic("");
                alert("AI Content Generated! Review the fields and generate your image using the prompt provided.");
            } else {
                alert("Failed to generate content: " + result.error);
            }
        } catch (error) {
            console.error("AI Gen Error:", error);
            alert("An unknown error occurred.");
        } finally {
            setIsGenerating(false);
        }
    };

    const copyImagePrompt = () => {
        if (!generatedImagePrompt) return;
        navigator.clipboard.writeText(generatedImagePrompt);
        setHasCopiedPrompt(true);
        setTimeout(() => setHasCopiedPrompt(false), 2000);
    };

    // Helper to trigger file input click
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

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
                        <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
                        <p className="text-muted-foreground">Draft and publish a new article.</p>
                    </div>
                </div>

                <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                            <Sparkles className="mr-2 h-4 w-4" /> Generate with AI
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>AI Blog Generator</DialogTitle>
                            <DialogDescription>
                                Enter a topic, and our AI will write the full article, metadata, and provide an image generation prompt for you.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                            <div className="space-y-2">
                                <Label>Blog Topic</Label>
                                <Input
                                    placeholder="e.g. Benefits of Turmeric Milk at night"
                                    value={aiTopic}
                                    onChange={(e) => setAiTopic(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAiDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleGenerateContent} disabled={!aiTopic.trim() || isGenerating}>
                                {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Writing...</> : <><Wand2 className="mr-2 h-4 w-4" /> Generate</>}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* AI Image Prompt Display Area */}
            {generatedImagePrompt && (
                <div className="bg-muted/50 border border-purple-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold flex items-center text-purple-700">
                            <ImageIcon className="mr-2 h-4 w-4" /> AI Image Prompt (For Midjourney/DALL-E)
                        </h3>
                        <Button variant="outline" size="sm" onClick={copyImagePrompt}>
                            {hasCopiedPrompt ? <><Check className="mr-2 h-3 w-3" /> Copied</> : <><Copy className="mr-2 h-3 w-3" /> Copy Prompt</>}
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground bg-background p-3 rounded border font-mono whitespace-pre-wrap break-words">
                        {generatedImagePrompt}
                    </p>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Post Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., The Ultimate Guide to Millets"
                                    value={formData.title}
                                    onChange={handleTitleChange}
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
                                <Label htmlFor="excerpt">Excerpt</Label>
                                <Textarea
                                    id="excerpt"
                                    placeholder="Short summary for the card preview..."
                                    className="h-20"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">Full Content</Label>
                                <div className="min-h-[400px] mb-12">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.content}
                                        onChange={(content: string) => setFormData({ ...formData, content })}
                                        modules={modules}
                                        className="h-[350px]"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Publishing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button onClick={handleSubmit} className="w-full" disabled={loading || uploading}>
                                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...</> : <><Save className="mr-2 h-4 w-4" /> Publish Now</>}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
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
                                <div className="flex items-center gap-2 my-2">
                                    <div className="h-px bg-border flex-1"></div>
                                    <span className="text-xs text-muted-foreground">OR</span>
                                    <div className="h-px bg-border flex-1"></div>
                                </div>
                                <Input
                                    placeholder="Paste Image URL"
                                    value={formData.coverImage}
                                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
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
