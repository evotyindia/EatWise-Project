
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, doc, getDoc, deleteDoc, writeBatch, updateDoc } from 'firebase/firestore';

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
  isPublic?: boolean; // New field for public sharing
}

// Create a new report in Firestore
export async function createReport(reportData: Omit<Report<any>, 'id'>): Promise<string> {
    try {
        const reportsCollection = collection(db, 'reports');
        const docRef = await addDoc(reportsCollection, { ...reportData, isPublic: false }); // Ensure isPublic is false on creation
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
            throw new Error("You do not have permission to view bookmarks. Please check Firestore rules.");
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

// Get a single PUBLIC report by its document ID (for public access)
export async function getPublicReportById(reportId: string): Promise<Report | null> {
    try {
        const reportDocRef = doc(db, 'reports', reportId);
        const reportDoc = await getDoc(reportDocRef);

        if (reportDoc.exists()) {
            const reportData = reportDoc.data() as Report;
            if (reportData.isPublic) {
                return { id: reportDoc.id, ...reportData };
            }
        }
        return null; // Return null if not public or doesn't exist
    } catch (error: any) {
        // This is a critical change. Firestore security rules for public access might deny reads
        // for unauthenticated users on the general collection. Instead of throwing, we treat it as "not found".
        if (error.code === 'permission-denied') {
            console.warn("Permission denied while fetching public report. This likely means the Firestore rules are correctly preventing a collection scan, and the document is not public or does not exist.");
            return null;
        }
        console.error("Error fetching public report by ID:", error);
        // We re-throw for other unexpected errors so it can be caught by the page.
        throw new Error("An unexpected error occurred while fetching the report.");
    }
}


// Update a report's public status
export async function updateReportPublicStatus(reportId: string, isPublic: boolean): Promise<void> {
    try {
        const reportDocRef = doc(db, 'reports', reportId);
        await updateDoc(reportDocRef, { isPublic });
    } catch (error: any) {
        if (error.code === 'permission-denied') {
            console.error("Firestore Permission Denied on updateReportPublicStatus:", error.message);
            throw new Error("You do not have permission to change this report's status.");
        }
        console.error("Error updating report status:", error);
        throw new Error("Could not update the report's public status.");
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
            throw new Error("You do not have permission to clear bookmarks. Please check Firestore rules.");
        }
        console.error("Error deleting user's reports: ", error);
        throw new Error("Could not clear user bookmarks.");
    }
}
