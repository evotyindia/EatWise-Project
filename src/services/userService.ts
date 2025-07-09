
'use server';

import { db, auth } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc, getDoc, limit } from 'firebase/firestore';
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
async function checkExistingUsername(username: string): Promise<boolean> {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where("username", "==", username.toLowerCase()), limit(1));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
}

// Create a new user in Firebase Auth and Firestore
export async function createUser(userData: Omit<User, 'id' | 'uid' | 'emailVerified'> & { password?: string }): Promise<void> {
    if (!userData.password) {
        throw new Error("Password is required to create a user.");
    }

    const usernameExists = await checkExistingUsername(userData.username);
    if (usernameExists) {
        throw new Error("This username is already taken.");
    }
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email.toLowerCase(), userData.password);
        const user = userCredential.user;

        await sendEmailVerification(user);

        const usersCollection = collection(db, 'users');
        await addDoc(usersCollection, {
            uid: user.uid,
            name: userData.name,
            username: userData.username.toLowerCase(),
            email: userData.email.toLowerCase(),
            phone: userData.phone || '',
            emailVerified: false,
        });

    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            throw new Error("An account with this email already exists.");
        }
        console.error("Error creating user: ", error);
        throw new Error("Could not create user account. Please try again.");
    }
}

// Sign in user with email and password
export async function signInUser(email: string, password: string): Promise<User> {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
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

// Get user from Firestore by username
async function getUserByUsername(username: string): Promise<User | null> {
    const q = query(collection(db, "users"), where("username", "==", username.toLowerCase()), limit(1));
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

// Update a user's details in Firestore
export async function updateUser(userId: string, dataToUpdate: Partial<Omit<User, 'id' | 'uid' | 'email' | 'emailVerified'>> & { username?: string }): Promise<void> {
    if (dataToUpdate.username) {
        const usernameExists = await checkExistingUsername(dataToUpdate.username);
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

// Delete a user from Firestore
export async function deleteUser(userId: string): Promise<void> {
    try {
        const userDocRef = doc(db, 'users', userId);
        await deleteDoc(userDocRef);
        // IMPORTANT: This only deletes the user from Firestore.
        // In a production app, you must also delete the user from Firebase Authentication.
        // This is a client-side operation that requires re-authentication for security.
        // This function should be called AFTER the user is deleted from Auth on the client.
    } catch (error) {
        console.error("Error deleting user from Firestore: ", error);
        throw new Error("Could not delete user account from the database.");
    }
}
