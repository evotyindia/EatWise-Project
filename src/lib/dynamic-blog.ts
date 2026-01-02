import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, where, Timestamp, limit } from "firebase/firestore";

export interface DynamicBlogPost {
    id?: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string; // Markdown
    coverImage: string;
    date: string; // ISO String
    author: string;
    category: string;
    tags: string[];
    readTime: string;
}

const POSTS_COLLECTION = "posts";

// --- CLIENT SIDE (Admin) ---

export async function createBlogPost(post: Omit<DynamicBlogPost, "id">) {
    try {
        const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
            ...post,
            createdAt: Timestamp.now()
        });
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
}

export async function getAllDynamicPosts(): Promise<DynamicBlogPost[]> {
    try {
        const q = query(collection(db, POSTS_COLLECTION), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as DynamicBlogPost));
    } catch (error) {
        console.error("Error fetching dynamic posts:", error);
        return [];
    }
}

export async function getDynamicPostBySlug(slug: string): Promise<DynamicBlogPost | null> {
    try {
        const q = query(collection(db, POSTS_COLLECTION), where("slug", "==", slug), limit(1));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return null;
        }
        const doc = querySnapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data()
        } as DynamicBlogPost;
    } catch (error) {
        console.error("Error fetching dynamic post by slug:", error);
        return null;
    }
}

import { doc, updateDoc } from "firebase/firestore";

export async function updateBlogPost(id: string, post: Partial<DynamicBlogPost>) {
    try {
        const docRef = doc(db, POSTS_COLLECTION, id);
        await updateDoc(docRef, {
            ...post
        });
        console.log("Document updated with ID: ", id);
    } catch (e) {
        console.error("Error updating document: ", e);
        throw e;
    }
}

import { deleteDoc } from "firebase/firestore";

export async function deleteBlogPost(id: string) {
    try {
        const docRef = doc(db, POSTS_COLLECTION, id);
        await deleteDoc(docRef);
        console.log("Document deleted with ID: ", id);
    } catch (e) {
        console.error("Error deleting document: ", e);
        throw e;
    }
}
