import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface AnalyticsEvent {
    type: "view" | "click" | "engagement";
    page: string;
    targetId?: string; // e.g., blog-slug
    meta?: any;
}

export async function recordEvent(event: AnalyticsEvent) {
    try {
        console.log("Analytics: Recording event", event); // DEBUG
        const col = collection(db, "analytics");
        await addDoc(col, {
            ...event,
            timestamp: serverTimestamp(),
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
        });
        console.log("Analytics: Event recorded successfully"); // DEBUG
    } catch (error) {
        console.error("Failed to record analytics event:", error);
    }
}
