
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc, getDoc, limit } from 'firebase/firestore';

export interface User {
    id: string; // This will be the Firestore document ID
    uid: string; // This will be the Firebase Auth user ID
    name: string;
    username: string;
    email: string;
    phone?: string;
    emailVerified: boolean;
}

// Check for existing user by username in Firestore
async function isUsernameTaken(username: string): Promise<boolean> {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where("username", "==", username.toLowerCase()), limit(1));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
}

// Create a new user profile in Firestore
// This is called from the client after Firebase Auth has created the user.
export async function createUserInFirestore(uid: string, name: string, email: string, phone: string | undefined): Promise<{ success: boolean, message?: string }> {
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
    } catch (error) {
        console.error("Error creating user profile in Firestore: ", error);
        return { success: false, message: "Could not create user profile in database." };
    }
}


// Get a user profile from Firestore by their UID and sync their verification status
// This is called from the client after a successful login.
export async function getAndSyncUser(uid: string): Promise<User | null> {
    const userProfile = await getUserByUid(uid);

    if (userProfile && !userProfile.emailVerified) {
        try {
            // The client is authenticated when calling this server action, so this update is allowed by Firestore rules.
            const userDocRef = doc(db, 'users', userProfile.id);
            await updateDoc(userDocRef, { emailVerified: true });
            userProfile.emailVerified = true; // Update in-memory object before returning
        } catch (error) {
            console.error("Error syncing verification status:", error);
            // We don't throw an error here, as the primary goal is to fetch the user.
            // The sync can be re-attempted on the next login.
        }
    }
    
    return userProfile;
}

// Get user from Firestore by UID
async function getUserByUid(uid: string): Promise<User | null> {
    const q = query(collection(db, "users"), where("uid", "==", uid), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() } as User;
}

// Get user by email only
export async function getUserByEmail(email: string): Promise<User | null> {
    const q = query(collection(db, "users"), where("email", "==", email.toLowerCase()), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() } as User;
}

// Get user by ID (Firestore doc ID)
export async function getUserById(userId: string): Promise<User | null> {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as User;
    }
    return null;
}

// Update a user's details in Firestore, including setting the username for the first time.
export async function updateUser(userId: string, dataToUpdate: Partial<Omit<User, 'id' | 'uid' | 'email' | 'emailVerified'>> & { username?: string }): Promise<void> {
    const userDocRef = doc(db, 'users', userId);

    // If a username is part of the update, it's the first time it's being set.
    // We must check for uniqueness.
    if (dataToUpdate.username) {
        const newUsername = dataToUpdate.username.toLowerCase();
        
        const usernameTaken = await isUsernameTaken(newUsername);
        if (usernameTaken) {
            throw new Error("This username is already taken. Please choose another one.");
        }
        
        dataToUpdate.username = newUsername;
    }
    
    try {
        await updateDoc(userDocRef, dataToUpdate);
    } catch (error) {
        console.error("Error updating user: ", error);
        throw new Error("Could not update user details.");
    }
}

// Delete a user from Firestore
export async function deleteUser(userId: string): Promise<void> {
    try {
        const userDocRef = doc(db, 'users', userId);
        await deleteDoc(userDocRef);
    } catch (error) {
        console.error("Error deleting user from Firestore: ", error);
        throw new Error("Could not delete user account from the database.");
    }
}
