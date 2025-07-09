
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
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
import { KeyRound, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await sendPasswordResetEmail(auth, values.email);
      setIsSubmitted(true);
      toast({
        title: "Password Reset Email Sent",
        description: `If an account exists for ${values.email}, a reset link has been sent. Please check your inbox.`,
        variant: "success",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      // Don't reveal if the email exists or not for security reasons.
      // So, show a success-like message even on error.
      setIsSubmitted(true);
       toast({
        title: "Password Reset Email Sent",
        description: `If an account exists for ${values.email}, a reset link has been sent. Please check your inbox.`,
        variant: "success",
      });
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <KeyRound className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>Forgot Your Password?</CardTitle>
          <CardDescription>
            {isSubmitted
              ? "Check your email for the reset link."
              : "No problem. Enter your email address below and we'll send you a link to reset it."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="text-center">
              <p className="text-muted-foreground mb-6">
                The link will be valid for a limited time. If you don't see the email, please check your spam folder.
              </p>
            </div>
          ) : (
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
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
              </Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
