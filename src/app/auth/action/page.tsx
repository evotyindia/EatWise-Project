
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { applyActionCode, checkActionCode } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { markEmailAsVerified } from "@/services/userService";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoaderCircle, CircleCheck, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

function AuthActionHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your email, please wait...");

    useEffect(() => {
        const mode = searchParams.get('mode');
        const oobCode = searchParams.get('oobCode');

        if (mode !== 'verifyEmail' || !oobCode) {
            setStatus("error");
            setMessage("Invalid verification link. Please try signing up again.");
            return;
        }

        const handleVerifyEmail = async (code: string) => {
            try {
                // Check if the code is valid and get user info
                const actionCodeInfo = await checkActionCode(auth, code);
                const email = actionCodeInfo.data.email;

                if (!email) {
                    throw new Error("Invalid action code. No email found.");
                }

                // Apply the action code to verify the email
                await applyActionCode(auth, code);

                // Update the user's status in Firestore
                await markEmailAsVerified(email);
                
                setStatus("success");
                setMessage(`Success! Your email ${email} has been verified.`);

                // Redirect to login after a short delay
                setTimeout(() => {
                    const redirectUrl = localStorage.getItem("loginRedirect") || "/";
                    router.push(`/login?verified=true&redirect=${encodeURIComponent(redirectUrl)}`);
                }, 3000);

            } catch (error: any) {
                setStatus("error");
                if (error.code === 'auth/invalid-action-code') {
                    setMessage("This verification link is invalid or has expired. Please try signing up again.");
                } else {
                    setMessage("An error occurred during verification. Please try again later.");
                }
                console.error("Email verification error:", error);
            }
        };

        handleVerifyEmail(oobCode);
    }, [searchParams, router]);

    const statusInfo = {
        loading: { icon: <LoaderCircle className="w-16 h-16 text-primary animate-spin" />, title: "Verifying..." },
        success: { icon: <CircleCheck className="w-16 h-16 text-success" />, title: "Verification Successful!" },
        error: { icon: <AlertTriangle className="w-16 h-16 text-destructive" />, title: "Verification Failed" },
    };

    return (
        <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">{statusInfo[status].icon}</div>
                    <CardTitle>{statusInfo[status].title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-base">{message}</CardDescription>
                </CardContent>
                <CardFooter className="flex justify-center">
                    {status === 'success' && (
                        <Button asChild>
                            <Link href="/login">Proceed to Login</Link>
                        </Button>
                    )}
                     {status === 'error' && (
                        <Button asChild variant="destructive">
                            <Link href="/signup">Return to Signup</Link>
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}


export default function AuthActionPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
            </div>
        }>
            <AuthActionHandler />
        </Suspense>
    )
}
