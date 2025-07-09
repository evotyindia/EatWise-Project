
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc, getDoc, limit } from 'firebase/firestore';

export interface User {
    id: string; // This will be the Firestore document ID
    name: string;
    username: string;
    email: string;
    phone?: string;
    password?: string; // Note: Storing passwords in plaintext is insecure. Use Firebase Auth in a real app.
}

// Check for existing user by email or username
async function checkExistingUser(email?: string, username?: string): Promise<boolean> {
    const usersCollection = collection(db, 'users');
    let q;
    if (email) {
        q = query(usersCollection, where("email", "==", email.toLowerCase()), limit(1));
    } else if (username) {
        q = query(usersCollection, where("username", "==", username.toLowerCase()), limit(1));
    } else {
        return false;
    }
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
}

// Create a new user
export async function createUser(userData: Omit<User, 'id'>): Promise<string> {
    // Check if email or username already exists
    const emailExists = await checkExistingUser(userData.email);
    if (emailExists) {
        throw new Error("An account with this email already exists.");
    }
    const usernameExists = await checkExistingUser(undefined, userData.username);
    if (usernameExists) {
        throw new Error("This username is already taken.");
    }

    try {
        const usersCollection = collection(db, 'users');
        // Ensure email and username are stored in lowercase for consistency
        const docRef = await addDoc(usersCollection, {
            ...userData,
            email: userData.email.toLowerCase(),
            username: userData.username.toLowerCase(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error creating user in Firestore: ", error);
        throw new Error("Could not create user account.");
    }
}

// Get user by email or username (for login)
export async function getUserByEmailOrUsername(identifier: string): Promise<User | null> {
    const lowercasedIdentifier = identifier.toLowerCase();
    const usersCollection = collection(db, 'users');
    
    // Check if identifier is an email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lowercasedIdentifier);
    
    const q = isEmail
      ? query(usersCollection, where("email", "==", lowercasedIdentifier), limit(1))
      : query(usersCollection, where("username", "==", lowercasedIdentifier), limit(1));

    try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return null;
        }
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() } as User;
    } catch (error) {
        console.error("Error fetching user: ", error);
        throw new Error("Database error while fetching user.");
    }
}

// Get user by email only
export async function getUserByEmail(email: string): Promise<User | null> {
     try {
        const q = query(collection(db, "users"), where("email", "==", email.toLowerCase()), limit(1));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return null;
        }
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() } as User;
    } catch (error) {
        console.error("Error fetching user by email: ", error);
        throw new Error("Could not retrieve user data.");
    }
}

// Get user by ID
export async function getUserById(userId: string): Promise<User | null> {
     try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
             return { id: userDoc.id, ...userDoc.data() } as User;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user by ID: ", error);
        throw new Error("Could not retrieve user data.");
    }
}


// Update a user's details
export async function updateUser(userId: string, dataToUpdate: Partial<Omit<User, 'id'>>): Promise<void> {
    
    if (dataToUpdate.email) {
        const emailExists = await checkExistingUser(dataToUpdate.email);
        const currentUser = await getUserById(userId);
        if (emailExists && currentUser?.email !== dataToUpdate.email.toLowerCase()) {
            throw new Error("This email address is already in use.");
        }
        dataToUpdate.email = dataToUpdate.email.toLowerCase();
    }
    if (dataToUpdate.username) {
        const usernameExists = await checkExistingUser(undefined, dataToUpdate.username);
        const currentUser = await getUserById(userId);
        if (usernameExists && currentUser?.username !== dataToUpdate.username.toLowerCase()) {
            throw new Error("This username is already taken.");
        }
        dataToUpdate.username = dataToUpdate.username.toLowerCase();
    }

    try {
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, dataToUpdate);
    } catch (error) {
        console.error("Error updating user: ", error);
        throw new Error("Could not update user details.");
    }
}

// Delete a user
export async function deleteUser(userId: string): Promise<void> {
    try {
        const userDocRef = doc(db, 'users', userId);
        await deleteDoc(userDocRef);
    } catch (error) {
        console.error("Error deleting user: ", error);
        throw new Error("Could not delete user account.");
    }
}
