
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserByUid, type User } from "@/services/userService";
import { UsernameSetupDialog } from "./UsernameSetupDialog";

export function AuthManager({ children }: { children: React.ReactNode }) {
    const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser && authUser.emailVerified) {
                // If user is authenticated and verified, check their profile
                try {
                    const userProfile = await getUserByUid(authUser.uid);
                    if (userProfile) {
                        setCurrentUser(userProfile);
                        // If they don't have a username, open the modal
                        if (!userProfile.username) {
                            setIsUsernameModalOpen(true);
                        }
                    }
                } catch(e) {
                    console.error("AuthManager: Failed to get user profile", e);
                }
            } else {
                // If user logs out or is not verified, reset state
                setCurrentUser(null);
                setIsUsernameModalOpen(false);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const handleUsernameSet = (newUsername: string) => {
        if (currentUser) {
            const updatedUser = { ...currentUser, username: newUsername };
            setCurrentUser(updatedUser);
            // Also update localStorage to reflect the change immediately
            localStorage.setItem("loggedInUser", JSON.stringify({ id: updatedUser.id, email: updatedUser.email, uid: updatedUser.uid, username: updatedUser.username }));
        }
        setIsUsernameModalOpen(false);
    };

    return (
        <>
            {children}
            {currentUser && !currentUser.username && (
                <UsernameSetupDialog
                    isOpen={isUsernameModalOpen}
                    onOpenChange={setIsUsernameModalOpen}
                    onUsernameSet={handleUsernameSet}
                    user={currentUser}
                />
            )}
        </>
    );
}
