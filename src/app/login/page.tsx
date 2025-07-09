
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
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useEffect, Suspense, useState } from "react";
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getAndSyncUser, getUserByUsername } from "@/services/userService";

const formSchema = z.object({
  identifier: z.string().min(3, { message: "Please enter a valid email or username." }),
  password: z.string().min(1, { message: "Password is required." }),
});

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [redirectUrl, setRedirectUrl] = useState("/");
  const [showPassword, setShowPassword] = useState(false);
  const isEmail = (str: string) => /\S+@\S+\.\S+/.test(str);

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let userEmail: string | undefined;

    try {
      if (isEmail(values.identifier)) {
        userEmail = values.identifier;
      } else {
        const userByUsername = await getUserByUsername(values.identifier);
        if (userByUsername) {
          userEmail = userByUsername.email;
        } else {
            // If username lookup fails, it's a non-existent account for sure.
            // This case handles a specific username that doesn't exist.
            toast({
                title: "Account Not Found",
                description: "No account found with that email or username. Please check your details or sign up.",
                variant: "destructive",
                action: (
                  <Button variant="secondary" size="sm" asChild>
                      <Link href="/signup">Sign Up</Link>
                  </Button>
                ),
            });
            return;
        }
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, userEmail, values.password);
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
        throw new Error("Your user profile could not be found in our database. Please contact support or try signing up again.");
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
      console.error("Login process error:", error);
      
      // The most common error for bad password or non-existent email is 'auth/invalid-credential'.
      if (error.code === 'auth/invalid-credential') {
        toast({
          title: "Incorrect Credentials",
          description: "The email/username or password you entered was incorrect. Please try again.",
          variant: "destructive",
           action: (
              <Button variant="secondary" size="sm" asChild>
                  <Link href="/forgot-password">Forgot Password?</Link>
              </Button>
            ),
        });
      } else if (error.message.includes("Your user profile could not be found")) {
         toast({ title: "Login Failed", description: error.message, variant: "destructive" });
      } else {
         toast({
          title: "Login Failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
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
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="pr-12"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute inset-y-0 right-0 h-full px-3 text-muted-foreground hover:bg-transparent hover:text-foreground transition-transform duration-200 ease-in-out hover:scale-110 active:scale-95"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                      </Button>
                    </div>
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
                <Link href="/signup" className="underline text-primary font-semibold">
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
