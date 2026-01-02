
"use client";

import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserByUid, type User } from "@/services/userService";
import { UsernameSetupDialog } from "./UsernameSetupDialog";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
    currentUser: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Start as true to show loading state initially
    const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser && authUser.emailVerified) {
                try {
                    const userProfile = await getUserByUid(authUser.uid);
                    if (userProfile) {
                        setCurrentUser(userProfile);
                        setIsLoggedIn(true);
                        if (!userProfile.username) {
                            setIsUsernameModalOpen(true);
                        }
                    } else {
                        // Edge case: Auth user exists but no profile in DB
                        // Do NOT sign out. Allow Firebase Auth user to persist (e.g. for Admin).
                        console.warn("AuthManager: User authenticated but no profile found in DB.");
                        // await signOut(auth); 
                        setCurrentUser(null);
                        setIsLoggedIn(false); // Valid Auth, but not "App Logged In"
                    }
                } catch (e) {
                    console.error("AuthManager: Failed to get user profile", e);
                    // await signOut(auth); // Log out on error
                    setCurrentUser(null);
                    setIsLoggedIn(false);
                }
            } else {
                // User is not logged in, not verified, or has logged out
                setCurrentUser(null);
                setIsLoggedIn(false);
                setIsUsernameModalOpen(false);
            }
            setIsLoading(false); // Stop loading once auth state is determined
        });
        return () => unsubscribe();
    }, []);

    const handleUsernameSet = (newUsername: string) => {
        if (currentUser) {
            const updatedUser = { ...currentUser, username: newUsername };
            setCurrentUser(updatedUser);
            // Local storage is still useful for non-critical UI updates
            localStorage.setItem("loggedInUser", JSON.stringify({ id: updatedUser.id, email: updatedUser.email, uid: updatedUser.uid, username: updatedUser.username }));
        }
        setIsUsernameModalOpen(false);
    };

    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("loginRedirect");
            setCurrentUser(null);
            setIsLoggedIn(false);
            toast({ title: "Logged Out", description: "You have been successfully logged out." });
            // Full page reload to ensure all state is cleared
            window.location.href = "/";
        } catch (error) {
            console.error("Logout failed:", error);
            toast({ title: "Logout Error", description: "Could not log you out. Please try again.", variant: "destructive" });
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, isLoggedIn, isLoading, logout }}>
            {children}
            {currentUser && !currentUser.username && (
                <UsernameSetupDialog
                    isOpen={isUsernameModalOpen}
                    onOpenChange={setIsUsernameModalOpen}
                    onUsernameSet={handleUsernameSet}
                    user={currentUser}
                />
            )}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
