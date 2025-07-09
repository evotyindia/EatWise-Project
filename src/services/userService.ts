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
       if (error.code === 'auth/email-already-in-use') {
           return { success: false, message: "An account with this email already exists." };
       }
       return { success: false, message: "Could not create user profile in database." };
    }
}


// Get a user profile from Firestore by their UID and sync their verification status
export async function getAndSyncUser(uid: string): Promise<User | null> {
    const userProfile = await getUserByUid(uid);

    if (userProfile && !userProfile.emailVerified) {
        try {
            const userDocRef = doc(db, 'users', userProfile.id);
            await updateDoc(userDocRef, { emailVerified: true });
            userProfile.emailVerified = true; 
        } catch (error) {
            console.error("Error syncing verification status:", error);
        }
    }
    
    return userProfile;
}

// Get user from Firestore by UID
export async function getUserByUid(uid: string): Promise<User | null> {
    const q = query(collection(db, "users"), where("uid", "==", uid), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() } as User;
}

// This function securely sets the username using a transaction.
export async function setUsername(uid: string, userId: string, newUsername: string): Promise<void> {
    const sanitizedUsername = newUsername.toLowerCase();
    
    const userDocRef = doc(db, "users", userId);
    // Create a new reference to a "usernames" collection document.
    // The document ID is the username itself, enforcing uniqueness at the document ID level.
    const usernameDocRef = doc(db, "usernames", sanitizedUsername);

    try {
        await runTransaction(db, async (transaction) => {
            // 1. Check if the username document already exists.
            const usernameDoc = await transaction.get(usernameDocRef);
            if (usernameDoc.exists()) {
                // If it exists, the username is taken. Abort the transaction.
                throw new Error("This username is already taken. Please choose another one.");
            }

            // 2. If the username is available, create the username document to reserve it.
            // The document stores the UID of the user who owns it.
            transaction.set(usernameDocRef, { uid: uid });

            // 3. Update the user's profile in the 'users' collection with the new username.
            transaction.update(userDocRef, { username: sanitizedUsername });
        });
    } catch (error: any) {
        console.error("Error setting username:", error);
        // Re-throw specific, user-friendly errors to be displayed in a toast.
        if (error.message.includes("already taken")) {
            throw error;
        }
        throw new Error("Could not set your username due to a server error.");
    }
}


// Update a user's general details in Firestore (excluding username).
export async function updateUser(userId: string, dataToUpdate: Partial<Omit<User, 'id' | 'uid' | 'email' | 'emailVerified' | 'username'>>): Promise<void> {
    const userDocRef = doc(db, 'users', userId);
    try {
        await updateDoc(userDocRef, dataToUpdate);
    } catch (error) {
        console.error("Error updating user details:", error);
        throw new Error("Could not update your profile details.");
    }
}

// Delete a user from Firestore and their username reservation
export async function deleteUser(userId: string, username: string): Promise<void> {
    const userDocRef = doc(db, 'users', userId);
    const usernameDocRef = doc(db, "usernames", username);
    
    try {
        const batch = writeBatch(db);
        batch.delete(userDocRef);
        // Only attempt to delete the username document if a username was actually set.
        if (username) {
             batch.delete(usernameDocRef);
        }
        await batch.commit();
    } catch (error) {
        console.error("Error deleting user from Firestore: ", error);
        throw new Error("Could not delete user account from the database.");
    }
}

// Get user by ID (Firestore doc ID) - Not currently used but good to have.
export async function getUserById(userId: string): Promise<User | null> {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as User;
    }
    return null;
}
