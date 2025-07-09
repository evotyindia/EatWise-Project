
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { applyActionCode, checkActionCode, confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoaderCircle, CircleCheck, AlertTriangle, KeyRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const passwordResetSchema = z.object({
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

type PasswordResetFormValues = z.infer<typeof passwordResetSchema>;

function AuthActionHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();

    const [status, setStatus] = useState<"loading" | "success" | "error" | "resetting">("loading");
    const [message, setMessage] = useState("Processing your request, please wait...");
    const [mode, setMode] = useState<string | null>(null);
    const [oobCode, setOobCode] = useState<string | null>(null);

    const passwordForm = useForm<PasswordResetFormValues>({
        resolver: zodResolver(passwordResetSchema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    useEffect(() => {
        const modeParam = searchParams.get('mode');
        const codeParam = searchParams.get('oobCode');

        setMode(modeParam);
        setOobCode(codeParam);

        if (!modeParam || !codeParam) {
            setStatus("error");
            setMessage("Invalid link. The link is missing required information.");
            return;
        }

        if (modeParam === 'verifyEmail') {
            handleVerifyEmail(codeParam);
        } else if (modeParam === 'resetPassword') {
            handleCheckPasswordReset(codeParam);
        } else {
            setStatus("error");
            setMessage("Unsupported action. The link is not a valid verification or password reset link.");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const handleVerifyEmail = async (code: string) => {
        try {
            await checkActionCode(auth, code);
            await applyActionCode(auth, code);
            setStatus("success");
            setMessage("Success! Your email has been verified. You can now log in to your account.");
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

    const handleCheckPasswordReset = async (code: string) => {
        try {
            await verifyPasswordResetCode(auth, code);
            setStatus("resetting");
            setMessage("Your code is valid. Please enter your new password.");
        } catch (error: any) {
            setStatus("error");
            if (error.code === 'auth/invalid-action-code') {
                setMessage("This password reset link is invalid or has expired. Please request a new one from the 'Forgot Password' page.");
            } else {
                setMessage("An error occurred. Please try again later.");
            }
            console.error("Password reset check error:", error);
        }
    };

    const onPasswordResetSubmit = async (values: PasswordResetFormValues) => {
        if (!oobCode) return;
        try {
            await confirmPasswordReset(auth, oobCode, values.password);
            setStatus("success");
            setMessage("Your password has been successfully reset. You can now log in with your new password.");
            toast({
                title: "Password Reset Successful",
                variant: "success"
            });
        } catch (error: any) {
            setStatus("error");
            if (error.code === 'auth/invalid-action-code') {
                setMessage("This password reset link is invalid or has expired. Please request a new one.");
            } else {
                setMessage("Failed to reset password. Please try again.");
            }
            console.error("Password reset confirmation error:", error);
        }
    };

    const statusInfo = {
        loading: { icon: <LoaderCircle className="w-16 h-16 text-primary animate-spin" />, title: "Processing..." },
        success: { icon: <CircleCheck className="w-16 h-16 text-success" />, title: "Action Successful!" },
        error: { icon: <AlertTriangle className="w-16 h-16 text-destructive" />, title: "Action Failed" },
        resetting: { icon: <KeyRound className="w-16 h-16 text-primary" />, title: "Reset Your Password" },
    };

    return (
        <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">{statusInfo[status].icon}</div>
                    <CardTitle>{statusInfo[status].title}</CardTitle>
                    <CardDescription className="text-base">{message}</CardDescription>
                </CardHeader>
                <CardContent>
                    {status === 'resetting' && (
                        <Form {...passwordForm}>
                            <form onSubmit={passwordForm.handleSubmit(onPasswordResetSubmit)} className="space-y-4 text-left">
                                <FormField
                                    control={passwordForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={passwordForm.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm New Password</FormLabel>
                                            <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={passwordForm.formState.isSubmitting}>
                                    {passwordForm.formState.isSubmitting ? "Resetting..." : "Reset Password"}
                                </Button>
                            </form>
                        </Form>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    {status === 'success' && (
                       <Button asChild>
                           <Link href="/login">Go to Login</Link>
                       </Button>
                    )}
                     {status === 'error' && (
                        <Button asChild variant="secondary">
                            <Link href="/">Return to Homepage</Link>
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
