
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
import { LogIn, LoaderCircle, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, Suspense, useState } from "react";
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getAndSyncUser, getUserByUsername, checkUserExists } from "@/services/userService";
import { useDebounce } from "@/hooks/use-debounce";


const formSchema = z.object({
  identifier: z.string().min(3, { message: "Please enter a valid email or username." }),
  password: z.string().min(1, { message: "Password is required." }),
});

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [redirectUrl, setRedirectUrl] = useState("/");
  const [identifierToCheck, setIdentifierToCheck] = useState("");
  const [isCheckingIdentifier, setIsCheckingIdentifier] = useState(false);
  const [identifierStatus, setIdentifierStatus] = useState<"idle" | "exists" | "not_found">("idle");
  const debouncedIdentifier = useDebounce(identifierToCheck, 500);

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
  
  // Effect for debounced identifier check
  useEffect(() => {
    const checkIdentifier = async () => {
      if (debouncedIdentifier.length < 3) {
        setIdentifierStatus("idle");
        return;
      }
      setIsCheckingIdentifier(true);
      try {
        const exists = await checkUserExists(debouncedIdentifier);
        setIdentifierStatus(exists ? "exists" : "not_found");
      } catch (error) {
        console.error("Identifier check error:", error);
        setIdentifierStatus("idle"); // Fallback on error
      }
      setIsCheckingIdentifier(false);
    };

    if (debouncedIdentifier) {
      checkIdentifier();
    } else {
      setIdentifierStatus("idle");
    }
  }, [debouncedIdentifier]);

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
    
    let userEmail = values.identifier;
    
    try {
      // If identifier is not an email, assume it's a username and fetch the email
      if (!isEmail(values.identifier)) {
        const userProfile = await getUserByUsername(values.identifier);
        if (!userProfile) {
          toast({ title: "Login Failed", description: "User with this username not found.", variant: "destructive" });
          return;
        }
        userEmail = userProfile.email;
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
      if (error.code === 'auth/invalid-credential') {
        errorMessage = "Email/Username or password was incorrect. Please try again.";
      }
      if (error.message.includes("Your user profile could not be found")) {
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
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Username</FormLabel>
                    <div className="relative">
                        <FormControl>
                          <Input 
                            placeholder="you@example.com or your_username" 
                            {...field} 
                            onChange={(e) => {
                                field.onChange(e);
                                setIdentifierToCheck(e.target.value);
                            }}
                          />
                        </FormControl>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {isCheckingIdentifier && <LoaderCircle className="h-5 w-5 text-muted-foreground animate-spin" />}
                            {!isCheckingIdentifier && identifierStatus === 'exists' && <CheckCircle2 className="h-5 w-5 text-success" />}
                            {!isCheckingIdentifier && identifierStatus === 'not_found' && <XCircle className="h-5 w-5 text-destructive" />}
                        </div>
                    </div>
                     {identifierStatus === 'not_found' && debouncedIdentifier.length > 0 && (
                        <p className="text-sm font-medium text-destructive">
                            Account not found.{" "}
                            <Link href={`/signup?email=${isEmail(debouncedIdentifier) ? encodeURIComponent(debouncedIdentifier) : ''}`} className="underline">
                                Sign up?
                            </Link>
                        </p>
                    )}
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
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || identifierStatus === 'not_found'}>
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
                <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    )
}
