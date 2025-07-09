
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, doc, getDoc, deleteDoc, writeBatch } from 'firebase/firestore';

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
}

// Create a new report in Firestore
export async function createReport(reportData: Omit<Report<any>, 'id'>): Promise<string> {
    try {
        const reportsCollection = collection(db, 'reports');
        const docRef = await addDoc(reportsCollection, reportData);
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
            throw new Error("You do not have permission to view this history. Please check Firestore rules.");
        }
        console.error("Error fetching reports by user UID: ", error);
        throw new Error("Could not fetch reports.");
    }
}

// Get a single report by its document ID
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
            throw new Error("You do not have permission to clear this history. Please check Firestore rules.");
        }
        console.error("Error deleting user's reports: ", error);
        throw new Error("Could not clear user history.");
    }
}

    