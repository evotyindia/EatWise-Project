
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { LogIn } from "lucide-react";
import { useEffect, Suspense, useState } from "react";
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getAndSyncUser, getUserByUsername, getUserByUid } from "@/services/userService";

const formSchema = z.object({
  identifier: z.string().min(3, { message: "Please enter a valid email or username." }),
  password: z.string().min(1, { message: "Password is required." }),
});

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [redirectUrl, setRedirectUrl] = useState("/");

  useEffect(() => {
    const searchRedirect = searchParams.get("redirect");
    const localRedirect = localStorage.getItem("loginRedirect");
    setRedirectUrl(searchRedirect || localRedirect || "/");

    const isVerified = searchParams.get("verified");
    if(isVerified) {
      toast({
        title: "Email Verified!",
        description: "You can now log in to your account.",
        variant: "success",
      });
      localStorage.removeItem("loginRedirect");
    }
  }, [searchParams, toast]);
  

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  
  const isEmail = (str: string) => /\S+@\S+\.\S+/.test(str);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    form.clearErrors();
    
    let userEmail: string | undefined;

    try {
        // If the identifier is NOT an email, assume it's a username and fetch the corresponding user profile to get the email.
        if (!isEmail(values.identifier)) {
            const userByUsername = await getUserByUsername(values.identifier);
            if (userByUsername) {
                userEmail = userByUsername.email;
            }
        } else {
            // If it IS an email, use it directly.
            userEmail = values.identifier;
        }

        // If after checking, we still don't have an email, the user doesn't exist or the username was wrong.
        if (!userEmail) {
            toast({
                title: "Account Not Found",
                description: `No account found for ${values.identifier}. Would you like to sign up?`,
                variant: "destructive",
                action: (
                  <Link href={`/signup?email=${isEmail(values.identifier) ? encodeURIComponent(values.identifier) : ''}`}>
                    <Button variant="secondary" size="sm">Sign Up</Button>
                  </Link>
                ),
            });
            return;
        }


      const userCredential = await signInWithEmailAndPassword(auth, userEmail.toLowerCase(), values.password);
      const authUser = userCredential.user;

      if (!authUser.emailVerified) {
        await sendEmailVerification(authUser).catch(e => console.error("Failed to resend verification email:", e));
        toast({
          title: "Email Not Verified",
          description: "We've sent another verification link to your inbox. Please check your email (and spam folder) to continue.",
          variant: "destructive",
        });
        await auth.signOut();
        return;
      }
      
      const userProfile = await getAndSyncUser(authUser.uid);

      if (!userProfile) {
        await auth.signOut();
        throw new Error("Your user profile could not be found. Please contact support or try signing up again.");
      }

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
      let errorTitle = "Login Failed";
      let errorAction;

      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
         errorTitle = "Account Not Found";
         errorMessage = `No account found for ${values.identifier}. Would you like to sign up?`;
         errorAction = (
           <Link href={`/signup?email=${isEmail(values.identifier) ? encodeURIComponent(values.identifier) : ''}`}>
             <Button variant="secondary" size="sm">Sign Up</Button>
           </Link>
         );
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        errorMessage = "Email/Username or password was incorrect. Please try again.";
      }
      if (error.message.includes("Your user profile could not be found")) {
        errorMessage = error.message;
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
        action: errorAction,
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
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Username</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="you@example.com or your_username" 
                        {...field} 
                      />
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
                    <div className="flex justify-between items-center">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-primary hover:underline"
                        tabIndex={-1}
                      >
                        Forgot Password?
                      </Link>
                    </div>
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
        </CardContent>
        <CardFooter className="mt-6 text-center text-sm">
            <p className="mx-auto">
                Don't have an account?{" "}
                <Link href="/signup" className="underline text-primary">
                Sign up
                </Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}


export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <LogIn className="w-12 h-12 animate-pulse text-primary" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    )
}
