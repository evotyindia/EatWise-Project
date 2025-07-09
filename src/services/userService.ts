
'use client';

import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc, getDoc, limit, runTransaction, writeBatch } from 'firebase/firestore';

export interface User {
    id: string; // This will be the Firestore document ID
    uid: string; // This will be the Firebase Auth user ID
    name: string;
    username: string;
    email: string;
    phone?: string;
    emailVerified: boolean;
}

// Create a new user profile in Firestore
export async function createUserInFirestore(uid: string, name: string, email: string, phone: string | undefined): Promise<{ success: boolean; message?: string; }> {
    try {
        const usersCollection = collection(db, 'users');
        await addDoc(usersCollection, {
            uid: uid,
            name: name,
            username: '', // Username is set later on the account page
            email: email.toLowerCase(),
            phone: phone || '',
            emailVerified: false, // Email is not verified at the point of creation
        });
        return { success: true };
    } catch (error: any) {
       console.error("Error creating user profile in Firestore: ", error);
       if (error.code === 'permission-denied') {
            return { success: false, message: "Permission denied. Please check Firestore rules for user creation." };
       }
       if (error.code === 'auth/email-already-in-use') {
           return { success: false, message: "An account with this email already exists." };
       }
       return { success: false, message: "Could not create user profile in database." };
    }
}


// Get a user profile from Firestore by their UID and sync their verification status
export async function getAndSyncUser(uid: string): Promise<User | null> {
    try {
        const userProfile = await getUserByUid(uid);
    
        if (userProfile && !userProfile.emailVerified) {
            try {
                const userDocRef = doc(db, 'users', userProfile.id);
                await updateDoc(userDocRef, { emailVerified: true });
                userProfile.emailVerified = true; 
            } catch (error) {
                console.error("Error syncing verification status:", error);
                 // Don't rethrow, just log. The main goal is to get the user profile.
            }
        }
        
        return userProfile;
    } catch (error: any) {
        if (error.code === 'permission-denied') {
            console.error("Firestore Permission Denied on getAndSyncUser:", error.message);
            throw new Error("You do not have permission to access user data.");
        }
        console.error("Error getting user profile:", error);
        throw new Error("Could not retrieve user profile.");
    }
}

// Get user from Firestore by UID
export async function getUserByUid(uid: string): Promise<User | null> {
    try {
        const q = query(collection(db, "users"), where("uid", "==", uid), limit(1));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return null;
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() } as User;
    } catch (error: any) {
        if (error.code === 'permission-denied') {
            console.error("Firestore Permission Denied on getUserByUid:", error.message);
            throw new Error("You do not have permission to query user data.");
        }
        console.error("Error fetching user by UID:", error);
        throw new Error("Could not fetch user by UID.");
    }
}

// This function securely sets the username using a transaction.
export async function setUsername(uid: string, userId: string, newUsername: string): Promise<{success: boolean, message?: string}> {
    const sanitizedUsername = newUsername.toLowerCase();
    const userDocRef = doc(db, "users", userId);
    const usernameDocRef = doc(db, "usernames", sanitizedUsername);

    try {
        await runTransaction(db, async (transaction) => {
            const usernameDoc = await transaction.get(usernameDocRef);
            if (usernameDoc.exists()) {
                throw new Error("This username is already taken. Please choose another one.");
            }
            transaction.set(usernameDocRef, { uid: uid });
            transaction.update(userDocRef, { username: sanitizedUsername });
        });
        return { success: true };
    } catch (error: any) {
        console.error("Error in setUsername transaction:", error);
        if (error.code === 'permission-denied') {
             return { success: false, message: "Permission denied while setting username. Please check Firestore rules." };
        }
        return { success: false, message: error.message || "Could not set your username due to a server error." };
    }
}


// Update a user's general details in Firestore (excluding username).
export async function updateUser(userId: string, dataToUpdate: Partial<Omit<User, 'id' | 'uid' | 'email' | 'emailVerified' | 'username'>>): Promise<void> {
    const userDocRef = doc(db, 'users', userId);
    try {
        await updateDoc(userDocRef, dataToUpdate);
    } catch (error: any) {
        if (error.code === 'permission-denied') {
             console.error("Firestore Permission Denied on updateUser:", error.message);
             throw new Error("You do not have permission to update this profile.");
        }
        console.error("Error updating user details:", error);
        throw new Error("Could not update your profile details.");
    }
}

// Delete a user from Firestore and their username reservation
export async function deleteUser(userId: string, username: string): Promise<void> {
    const userDocRef = doc(db, 'users', userId);
    
    try {
        const batch = writeBatch(db);

        // Queue deletion of the main user document
        batch.delete(userDocRef);

        // If a username was set, queue deletion of its reservation document as well.
        if (username) {
            const usernameDocRef = doc(db, "usernames", username);
            batch.delete(usernameDocRef);
        }
        
        await batch.commit();
    } catch (error: any) {
        if (error.code === 'permission-denied') {
             console.error("Firestore Permission Denied on deleteUser:", error.message);
             throw new Error("You do not have permission to delete this account.");
        }
        console.error("Error deleting user from Firestore: ", error);
        throw new Error("Could not delete user account from the database.");
    }
}

// Get user by ID (Firestore doc ID) - Not currently used but good to have.
export async function getUserById(userId: string): Promise<User | null> {
    const userDocRef = doc(db, 'users', userId);
    try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            return { id: userDoc.id, ...userDoc.data() } as User;
        }
        return null;
    } catch(error: any) {
        if (error.code === 'permission-denied') {
             console.error("Firestore Permission Denied on getUserById:", error.message);
             throw new Error("You do not have permission to get this user's data.");
        }
        console.error("Error getting user by ID:", error);
        throw new Error("Could not retrieve user by ID.");
    }
}

    