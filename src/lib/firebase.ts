// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// IMPORTANT: Add these values to your .env file
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Check if all necessary environment variables are defined.
// This provides a clear error message if the .env file is not set up correctly.
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  let errorMessage = "Firebase configuration is missing or incomplete. ";
  errorMessage += "Please ensure all NEXT_PUBLIC_FIREBASE_* variables are set in your .env file. ";
  errorMessage += "If you have just set them, you may need to restart the development server.";

  // Throwing an error is more direct and stops execution, preventing cryptic downstream errors.
  throw new Error(errorMessage);
}

import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

const googleProvider = new GoogleAuthProvider();
export { app, db, auth, storage, analytics, googleProvider };
