
'use server';

import { db, auth } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc, getDoc, limit, runTransaction } from 'firebase/firestore';
import { 
    createUserWithEmailAndPassword, 
    sendEmailVerification,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';

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
// This function is now designed to be called by an authenticated user.
async function isUsernameTaken(username: string): Promise<boolean> {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where("username", "==", username.toLowerCase()), limit(1));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
}

// Create a new user in Firebase Auth and Firestore
export async function createUser(userData: Omit<User, 'id' | 'uid' | 'emailVerified' | 'username'> & { password?: string }): Promise<{ success: boolean, message?: string }> {
    if (!userData.password) {
        return { success: false, message: "Password is required to create a user." };
    }
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email.toLowerCase(), userData.password);
        const user = userCredential.user;

        await sendEmailVerification(user);

        const usersCollection = collection(db, 'users');
        await addDoc(usersCollection, {
            uid: user.uid,
            name: userData.name,
            username: '', // Username is set later
            email: userData.email.toLowerCase(),
            phone: userData.phone || '',
            emailVerified: user.emailVerified, // Store initial state
        });
        
        return { success: true };

    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            return { success: false, message: "An account with this email already exists." };
        }
        console.error("Error creating user: ", error);
        return { success: false, message: "Could not create user account. Please try again." };
    }
}

// Sign in user with email and password
export async function signInUser(email: string, password: string): Promise<User> {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email.toLowerCase(), password);
        const user = userCredential.user;

        const userProfile = await getUserByUid(user.uid);
        if (!userProfile) {
            // This case is unlikely if signup is working, but it's good practice to handle.
            await signOut(auth);
            throw new Error("Could not find user profile data. Please contact support.");
        }

        // Sync verification status from Auth to Firestore if it's not already synced.
        if (user.emailVerified && !userProfile.emailVerified) {
            const userDocRef = doc(db, 'users', userProfile.id);
            await updateDoc(userDocRef, { emailVerified: true });
            // Update the in-memory object so we don't have to fetch it again.
            userProfile.emailVerified = true;
        }

        // Now, perform the definitive check on the (possibly updated) profile.
        if (!userProfile.emailVerified) {
            await signOut(auth); // Sign out to prevent leaving them in a partially logged-in state.
            await sendEmailVerification(user).catch(e => console.error("Failed to resend verification email:", e));
            throw new Error("Your email is not verified. We've sent another verification link to your inbox. Please check your email (and spam folder) to continue.");
        }
        
        return userProfile;
    } catch (error: any) {
        if (error.code === 'auth/invalid-credential') {
            throw new Error("Invalid email or password.");
        }
        // Re-throw our specific "not verified" error so the UI can catch it.
        if (error.message.includes("Your email is not verified")) {
            throw error;
        }
        console.error("Error signing in: ", error);
        throw new Error("An error occurred during login. Please try again.");
    }
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
        
        // This is safe now because we're only updating one user's info.
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
        // Deleting from Firebase Auth is handled on the client-side for security.
    } catch (error) {
        console.error("Error deleting user from Firestore: ", error);
        throw new Error("Could not delete user account from the database.");
    }
}
