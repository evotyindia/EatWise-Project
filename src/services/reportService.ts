
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, doc, getDoc, deleteDoc, writeBatch, updateDoc, limit } from 'firebase/firestore';

// This is now a CLIENT-SIDE service. It should NOT have 'use server'.
// The Firebase SDK on the client will automatically handle user authentication.

export interface Report<T = any> {
  id: string; // Firestore document ID
  uid: string; // Firebase Auth User ID
  type: 'label' | 'recipe' | 'nutrition';
  title: string;
  summary: string;
  createdAt: string; // ISO string
  data: T; // The full AI output
  userInput: any; // The original input to the AI flow
  isPublic?: boolean;
  publicSlug?: string | null; // e.g., "my-favorite-recipe"
}

// Create a new report in Firestore
export async function createReport(reportData: Omit<Report<any>, 'id' | 'isPublic' | 'publicSlug'>): Promise<string> {
    try {
        const reportsCollection = collection(db, 'reports');
        const docRef = await addDoc(reportsCollection, { 
            ...reportData, 
            isPublic: false,
            publicSlug: null 
        });
        return docRef.id;
    } catch (error: any) {
        if (error.code === 'permission-denied') {
            console.error("Firestore Permission Denied on createReport:", error.message);
            throw new Error("You do not have permission to save reports. Please check Firestore rules.");
        }
        console.error("Error creating report in Firestore: ", error);
        throw new Error("Could not save the report.");
    }
}

// Get all reports for a specific user by their Auth UID
export async function getReportsByUid(uid: string): Promise<Report[]> {
    try {
        const reports: Report[] = [];
        const q = query(collection(db, "reports"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            reports.push({ id: doc.id, ...doc.data() } as Report);
        });
        return reports;
    } catch (error: any) {
        if (error.code === 'permission-denied') {
            console.error("Firestore Permission Denied on getReportsByUid:", error.message);
            throw new Error("You do not have permission to view saved items. Please check Firestore rules.");
        }
        console.error("Error fetching reports by user UID: ", error);
        throw new Error("Could not fetch reports.");
    }
}

// Get a single report by its document ID (for authenticated users)
export async function getReportById(reportId: string): Promise<Report | null> {
    try {
        const reportDocRef = doc(db, 'reports', reportId);
        const reportDoc = await getDoc(reportDocRef);

        if (reportDoc.exists()) {
            return {
                id: reportDoc.id,
                ...reportDoc.data(),
            } as Report;
        } else {
            return null;
        }
    } catch (error: any) {
        if (error.code === 'permission-denied') {
            console.error("Firestore Permission Denied on getReportById:", error.message);
            throw new Error("You do not have permission to view this report. Please check Firestore rules.");
        }
        console.error("Error fetching report by ID: ", error);
        throw new Error("Could not fetch the specified report.");
    }
}

// Get a single PUBLIC report by username and slug
export async function getPublicReportBySlug(username: string, slug: string): Promise<Report | null> {
    const sanitizedUsername = username.toLowerCase();
    const sanitizedSlug = slug.toLowerCase();

    try {
        const usernameDocRef = doc(db, "usernames", sanitizedUsername);
        const usernameDoc = await getDoc(usernameDocRef);

        if (!usernameDoc.exists()) {
            return null; // User not found
        }
        const { uid } = usernameDoc.data();
        
        const q = query(
            collection(db, "reports"), 
            where("uid", "==", uid), 
            where("publicSlug", "==", sanitizedSlug),
            where("isPublic", "==", true),
            limit(1)
        );

        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            return null;
        }
        
        const reportDoc = querySnapshot.docs[0];
        return { id: reportDoc.id, ...reportDoc.data() } as Report;

    } catch (error: any) {
        console.error("Error fetching public report by slug:", error);
        throw new Error("An unexpected error occurred while fetching the report.");
    }
}


// Update a report's public status and generate a slug if it's the first time
export async function updateReportPublicStatus(reportId: string, isPublic: boolean): Promise<Report> {
    const reportDocRef = doc(db, 'reports', reportId);
    try {
        const reportDoc = await getDoc(reportDocRef);
        if (!reportDoc.exists()) throw new Error("Report not found.");

        const currentData = reportDoc.data() as Report;
        let newSlug = currentData.publicSlug;
        
        if (isPublic && !currentData.publicSlug) {
            // Generate a short random slug if it doesn't exist
            newSlug = Math.random().toString(36).substring(2, 9);
        }

        await updateDoc(reportDocRef, { isPublic, publicSlug: newSlug });
        return { ...currentData, id: reportId, isPublic, publicSlug: newSlug };

    } catch (error: any) {
        console.error("Error updating report status:", error);
        throw new Error("Could not update the report's public status.");
    }
}


// Check if a slug is available for a given user
export async function isSlugAvailableForUser(uid: string, slug: string, currentReportId: string): Promise<boolean> {
    const sanitizedSlug = slug.toLowerCase();
    const q = query(
        collection(db, "reports"), 
        where("uid", "==", uid), 
        where("publicSlug", "==", sanitizedSlug)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return true; // No reports with this slug for this user
    }
    // If a report was found, check if it's the one we're currently editing
    const foundReportId = querySnapshot.docs[0].id;
    return foundReportId === currentReportId;
}

// Update a report's public slug
export async function updateReportSlug(reportId: string, newSlug: string): Promise<void> {
    const reportDocRef = doc(db, 'reports', reportId);
    await updateDoc(reportDocRef, { publicSlug: newSlug.toLowerCase() });
}

// NEW FUNCTION: Update report title and product name
export async function updateReportDetails(reportId: string, newTitle: string, newProductName: string): Promise<Report> {
    const reportDocRef = doc(db, 'reports', reportId);
    try {
        const reportDoc = await getDoc(reportDocRef);
        if (!reportDoc.exists()) {
            throw new Error("Report not found.");
        }
        const currentData = reportDoc.data() as Omit<Report, 'id'>;

        // Create the updated userInput object
        const updatedUserInput = { ...currentData.userInput };
        if (currentData.type === 'label' || currentData.type === 'nutrition') {
            updatedUserInput.productName = newProductName;
            // Also update foodItemDescription if it exists for nutrition reports
            if ('foodItemDescription' in updatedUserInput) {
                updatedUserInput.foodItemDescription = newProductName;
            }
        }

        await updateDoc(reportDocRef, {
            title: newTitle,
            userInput: updatedUserInput
        });

        // Return the full updated report object for local state update
        return {
            ...currentData,
            id: reportId,
            title: newTitle,
            userInput: updatedUserInput
        };

    } catch (error: any) {
        console.error("Error updating report details:", error);
        throw new Error("Could not update the report details.");
    }
}


// Delete a single report by its ID
export async function deleteReport(reportId: string): Promise<void> {
    try {
        const reportDocRef = doc(db, 'reports', reportId);
        await deleteDoc(reportDocRef);
    } catch (error: any) {
         if (error.code === 'permission-denied') {
            console.error("Firestore Permission Denied on deleteReport:", error.message);
            throw new Error("You do not have permission to delete this report. Please check Firestore rules.");
        }
        console.error("Error deleting report: ", error);
        throw new Error("Could not delete the report.");
    }
}

// Delete all reports for a specific user
export async function deleteReportsByUserId(uid: string): Promise<void> {
    try {
        const q = query(collection(db, "reports"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            return; // No reports to delete
        }
        
        const batch = writeBatch(db);
        querySnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        await batch.commit();
    } catch (error: any) {
        if (error.code === 'permission-denied') {
            console.error("Firestore Permission Denied on deleteReportsByUserId:", error.message);
            throw new Error("You do not have permission to clear saved items. Please check Firestore rules.");
        }
        console.error("Error deleting user's reports: ", error);
        throw new Error("Could not clear user saved items.");
    }
}
