
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
import { LogIn } from "lucide-react";
import { signInUser } from "@/services/userService";
import { useEffect } from "react";

const formSchema = z.object({
  identifier: z.string().min(1, { message: "Email or Username is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const redirectUrl = searchParams.get("redirect") || localStorage.getItem("loginRedirect") || "/";
  const isVerified = searchParams.get("verified");

  useEffect(() => {
    if(isVerified) {
      toast({
        title: "Email Verified!",
        description: "You can now log in to your account.",
        variant: "success",
      });
      // Clear the redirect from local storage if it exists, so it's only used once
      localStorage.removeItem("loginRedirect");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVerified]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const user = await signInUser(values.identifier, values.password);

      if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify({ id: user.id, email: user.email }));
        toast({
          title: "Login Successful",
          description: "Welcome back!",
          variant: "success",
        });
        window.location.href = redirectUrl;
        localStorage.removeItem("loginRedirect");
      } else {
        // This case should not be reached if signInUser throws an error, but as a fallback
        throw new Error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: (error as Error).message || "Could not log you in. Please try again.",
        variant: "destructive",
      });
      // Graceful redirect to signup if account not found
      if ((error as Error).message.includes("Account not found")) {
        const isEmail = z.string().email().safeParse(values.identifier).success;
        const redirectQuery = redirectUrl ? `&redirect=${encodeURIComponent(redirectUrl)}` : '';
        const signupUrl = `/signup?${isEmail ? `email=${encodeURIComponent(values.identifier)}` : ''}${redirectQuery}`;
        
        router.push(signupUrl);
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
                      <Input placeholder="your_username or you@example.com" {...field} />
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
