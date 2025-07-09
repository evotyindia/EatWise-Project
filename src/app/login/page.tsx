
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, LoaderCircle } from "lucide-react";
import { useEffect, Suspense, useState } from "react";
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getAndSyncUser, createUserInFirestore } from "@/services/userService";


const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [redirectUrl, setRedirectUrl] = useState("/");
  const isVerified = searchParams.get("verified");

  useEffect(() => {
    // This effect runs only on the client, so localStorage is available.
    const searchRedirect = searchParams.get("redirect");
    const localRedirect = localStorage.getItem("loginRedirect");
    setRedirectUrl(searchRedirect || localRedirect || "/");

    if(isVerified) {
      toast({
        title: "Email Verified!",
        description: "You can now log in to your account.",
        variant: "success",
      });
      // Clear the redirect from local storage if it exists, so it's only used once
      localStorage.removeItem("loginRedirect");
    }
  }, [isVerified, searchParams, toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    form.clearErrors();
    try {
      // Step 1: Sign in on the client using Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, values.email.toLowerCase(), values.password);
      const authUser = userCredential.user;

      // Step 2: Check if the user's email is verified in Firebase Auth
      if (!authUser.emailVerified) {
        await sendEmailVerification(authUser).catch(e => console.error("Failed to resend verification email:", e));
        toast({
          title: "Email Not Verified",
          description: "We've sent another verification link to your inbox. Please check your email (and spam folder) to continue.",
          variant: "destructive",
        });
        await auth.signOut(); // Log them out so they can't proceed
        return;
      }
      
      // Step 3: Get user profile from Firestore and sync verification status
      let userProfile = await getAndSyncUser(authUser.uid);

      // Gracefully handle cases where the user exists in Auth but not in Firestore
      if (!userProfile) {
        console.warn(`User profile not found for UID: ${authUser.uid}. Attempting to create a fallback profile.`);
        const defaultName = authUser.email?.split('@')[0] || 'New User';
        const creationResult = await createUserInFirestore(authUser.uid, defaultName, authUser.email || '', undefined);

        if (creationResult.success) {
          userProfile = await getAndSyncUser(authUser.uid); // Try again
        }
        
        if (!userProfile) {
           // If it still fails after attempting to create, there's a more serious issue.
           throw new Error("There was an issue accessing your user profile. Please contact support.");
        }
      }

      // If we have a user profile (either found or created), proceed with login
      localStorage.setItem("loggedInUser", JSON.stringify({ id: userProfile.id, email: userProfile.email, uid: userProfile.uid, username: userProfile.username }));
      toast({
        title: "Login Successful",
        description: "Welcome back!",
        variant: "success",
      });
      window.location.href = redirectUrl;
      localStorage.removeItem("loginRedirect");

    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "An error occurred during login. Please try again.";
      if (error.code === 'auth/invalid-credential') {
          errorMessage = "Invalid email or password.";
      }
      // Use the custom error message if it's one we threw
      if (error.message.includes("accessing your user profile")) {
        errorMessage = error.message;
      }
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
           <div className="flex justify-center mb-4">
            <LogIn className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>Welcome Back!</CardTitle>
          <CardDescription>Log in to your account to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                 {form.formState.isSubmitting ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="underline text-primary">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    )
}
