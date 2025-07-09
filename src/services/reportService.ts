
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, doc, getDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import type { GenerateHealthReportOutput } from "@/ai/flows/generate-health-report";
import type { GetDetailedRecipeOutput } from "@/ai/flows/get-detailed-recipe";
import type { AnalyzeNutritionOutput } from "@/ai/flows/nutrition-analysis";
import { getUserById } from './userService';

// Define a unified report structure for state management
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
export async function createReport(reportData: Omit<Report<any>, 'id'>) {
    try {
        const reportsCollection = collection(db, 'reports');
        const docRef = await addDoc(reportsCollection, reportData);
        return docRef.id;
    } catch (error) {
        console.error("Error creating report in Firestore: ", error);
        throw new Error("Could not save the report.");
    }
}

// Get all reports for a specific user
export async function getReportsByUserId(uid: string): Promise<Report[]> {
    try {
        const reports: Report[] = [];
        const q = query(collection(db, "reports"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            reports.push({ id: doc.id, ...doc.data() } as Report);
        });
        return reports;
    } catch (error) {
        console.error("Error fetching reports by user ID: ", error);
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
    } catch (error) {
        console.error("Error fetching report by ID: ", error);
        throw new Error("Could not fetch the specified report.");
    }
}


// Delete a single report by its ID
export async function deleteReport(reportId: string): Promise<void> {
    try {
        const reportDocRef = doc(db, 'reports', reportId);
        await deleteDoc(reportDocRef);
    } catch (error) {
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
    } catch (error) {
        console.error("Error deleting user's reports: ", error);
        throw new Error("Could not clear user history.");
    }
}
