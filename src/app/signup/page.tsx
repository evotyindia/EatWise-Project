
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
import { UserPlus, LoaderCircle, Eye, EyeOff } from "lucide-react";
import { Suspense, useState, useEffect } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createUserInFirestore } from "@/services/userService";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid 10-digit phone number." }).optional().or(z.literal('')),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailFromQuery = searchParams.get('email');
  const redirectUrl = searchParams.get('redirect');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: emailFromQuery || "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email.toLowerCase(), values.password);
      const user = userCredential.user;

      await createUserInFirestore(user.uid, values.name, values.email, values.phone);

      await sendEmailVerification(user);

      if (redirectUrl) {
        localStorage.setItem("loginRedirect", redirectUrl);
      }
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);

    } catch (error: any) {
      let errorMessage = "Could not create your account. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "An account with this email already exists.";
        toast({
          title: "Account Exists",
          description: errorMessage,
          variant: "destructive",
          action: (
            <Button variant="secondary" size="sm" asChild>
              <Link href="/login">Log In</Link>
            </Button>
          ),
        });
      } else {
        toast({
          title: "Signup Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
      console.error("Signup error:", error);
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <UserPlus className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Enter your details to sign up.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="9876543210" {...field} />
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
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
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Signing up..." : "Sign Up"}
              </Button>
            </form>
          </Form>

          {/* Google Sign Up UI removed */}

        </CardContent>
        <CardFooter className="mt-6 text-center text-sm">
          <p className="mx-auto">
            Already have an account?{" "}
            <Link href="/login" className="underline text-primary font-semibold">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}


export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
      </div>
    }>
      <SignupContent />
    </Suspense>
  )
}
