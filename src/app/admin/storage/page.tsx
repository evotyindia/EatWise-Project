"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, AlertTriangle, CheckCircle, ExternalLink, RefreshCw } from "lucide-react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface R2Object {
    key: string;
    lastModified: string;
    size: number;
    url: string;
    isUsed?: boolean;
    usedIn?: string[]; // Titles of posts utilizing this image
}

export default function StoragePage() {
    const [images, setImages] = useState<R2Object[]>([]);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [selectedImage, setSelectedImage] = useState<R2Object | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    const fetchData = async () => {
        setLoading(true);
        setAnalyzing(true);
        try {
            // 1. Fetch Images from R2 API
            const res = await fetch("/api/admin/storage");
            const data = await res.json();

            if (data.error) throw new Error(data.error);

            let fetchedImages: R2Object[] = data.objects || [];

            // 2. Fetch All Blog Posts from Firestore to check usage
            const postsSnapshot = await getDocs(collection(db, "posts"));
            const usageMap = new Map<string, string[]>();

            postsSnapshot.forEach(doc => {
                const post = doc.data();
                const postTitle = post.title || "Untitled Post";
                const content = JSON.stringify(post); // Naive but effective string dump to find URL occurrences

                fetchedImages.forEach(img => {
                    // Check if image URL is present in the post data
                    // We check both the full URL and the Key (in case relative paths were stored differently)
                    if (content.includes(img.url) || content.includes(img.key)) {
                        const existing = usageMap.get(img.key) || [];
                        existing.push(postTitle);
                        usageMap.set(img.key, existing);
                    }
                });
            });

            // 3. Mark images as Used/Unused
            fetchedImages = fetchedImages.map(img => ({
                ...img,
                isUsed: usageMap.has(img.key),
                usedIn: usageMap.get(img.key) || []
            }));

            setImages(fetchedImages);

        } catch (error) {
            console.error("Error fetching storage data:", error);
            alert("Failed to load storage data.");
        } finally {
            setLoading(false);
            setAnalyzing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteClick = (img: R2Object) => {
        setSelectedImage(img);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedImage) return;
        setDeleting(true);
        try {
            const res = await fetch("/api/admin/storage", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: selectedImage.key })
            });

            if (!res.ok) throw new Error("Failed to delete");

            // Remove from local state
            setImages(prev => prev.filter(i => i.key !== selectedImage.key));
            setDeleteDialogOpen(false);
            setSelectedImage(null);
        } catch (error) {
            console.error(error);
            alert("Failed to delete image.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Storage Management</h1>
                    <p className="text-muted-foreground">Manage Cloudflare R2 Bucket images. Analyze usage to clean up unused files.</p>
                </div>
                <Button onClick={fetchData} disabled={loading || analyzing}>
                    {(loading || analyzing) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    Refresh Analysis
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((img) => (
                        <Card key={img.key} className="overflow-hidden group">
                            <div className="relative aspect-square bg-muted">
                                <img
                                    src={img.url}
                                    alt={img.key}
                                    className="object-cover w-full h-full"
                                    loading="lazy"
                                />
                                {img.isUsed ? (
                                    <div className="absolute top-2 right-2">
                                        <Badge className="bg-green-500 hover:bg-green-600">
                                            <CheckCircle className="w-3 h-3 mr-1" /> Used
                                        </Badge>
                                    </div>
                                ) : (
                                    <div className="absolute top-2 right-2">
                                        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-200">
                                            Unused
                                        </Badge>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button size="icon" variant="outline" className="h-8 w-8 text-white border-white/50 hover:bg-white/20" asChild>
                                        <a href={img.url} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        className="h-8 w-8"
                                        onClick={() => handleDeleteClick(img)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <CardContent className="p-3 text-xs space-y-1">
                                <div className="font-medium truncate" title={img.key}>{img.key.split('-').slice(1).join('-') || img.key}</div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>{formatBytes(img.size)}</span>
                                    <span>{new Date(img.lastModified).toLocaleDateString()}</span>
                                </div>
                                {img.isUsed && (
                                    <div className="pt-2 border-t mt-2">
                                        <p className="font-semibold text-muted-foreground mb-1">Used in {img.usedIn?.length} post(s):</p>
                                        <ul className="list-disc list-inside text-muted-foreground truncate">
                                            {img.usedIn?.slice(0, 2).map((title, i) => (
                                                <li key={i} className="truncate">{title}</li>
                                            ))}
                                            {(img.usedIn?.length || 0) > 2 && <li>+{(img.usedIn?.length || 0) - 2} more</li>}
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="h-5 w-5" /> Confirm Deletion
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this image? This action cannot be undone.
                        </DialogDescription>
                        <div className="mt-4 p-4 bg-muted rounded-md text-sm font-mono break-all">
                            {selectedImage?.key}
                        </div>
                    </DialogHeader>

                    {selectedImage?.isUsed && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md flex gap-3 text-red-800 text-sm">
                            <AlertTriangle className="h-5 w-5 shrink-0" />
                            <div>
                                <p className="font-bold">Warning: This image is currently in use!</p>
                                <p>Deleting it will break images in the following posts: </p>
                                <ul className="list-disc list-inside mt-1">
                                    {selectedImage.usedIn?.map(t => <li key={t}>{t}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
                            {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                            Delete Permanently
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
