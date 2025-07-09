"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
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
import { UserCog, LogOut, ShieldCheck, Phone, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";

// Schema for updating personal details
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }).optional().or(z.literal('')),
});

// Schema for updating password
const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required." }),
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match",
  path: ["confirmPassword"],
});


export default function AccountPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Fetch user data on mount
  useEffect(() => {
    const loggedInUserEmail = JSON.parse(localStorage.getItem("loggedInUser") || "{}").email;
    if (!loggedInUserEmail) {
      toast({ title: "Login Required", description: "Please log in to view your account.", variant: "destructive" });
      router.replace('/login');
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: any) => u.email === loggedInUserEmail);
    if (user) {
      setCurrentUser(user);
    }
  }, [router, toast]);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    },
  });
  
  // Set form values once user data is loaded
  useEffect(() => {
    if (currentUser) {
      profileForm.reset({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
      });
    }
  }, [currentUser, profileForm]);

  function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    try {
      let users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex((u: any) => u.email === currentUser.email);

      if (userIndex === -1) throw new Error("User not found.");

      // Check if the new email already exists (and isn't the current user's email)
      if (values.email !== currentUser.email && users.some((u: any) => u.email === values.email)) {
        toast({ title: "Update Failed", description: "This email address is already in use.", variant: "destructive" });
        return;
      }

      // Update user details
      const updatedUser = {
        ...users[userIndex],
        name: values.name,
        email: values.email,
        phone: values.phone,
      };
      users[userIndex] = updatedUser;
      
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("loggedInUser", JSON.stringify({ email: updatedUser.email })); // Update loggedInUser in case email changed
      setCurrentUser(updatedUser); // Update local state

      toast({ title: "Profile Updated", description: "Your details have been successfully saved." });
    } catch (error) {
      console.error("Profile update error:", error);
      toast({ title: "An Error Occurred", description: "Could not update your profile.", variant: "destructive" });
    }
  }

  function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    try {
        if (currentUser.password !== values.currentPassword) {
            passwordForm.setError("currentPassword", { type: "manual", message: "Incorrect current password." });
            return;
        }

        let users = JSON.parse(localStorage.getItem("users") || "[]");
        const userIndex = users.findIndex((u: any) => u.email === currentUser.email);
        if (userIndex === -1) throw new Error("User not found.");

        users[userIndex].password = values.newPassword;
        localStorage.setItem("users", JSON.stringify(users));

        toast({ title: "Password Changed", description: "Your password has been successfully updated." });
        passwordForm.reset();

    } catch (error) {
         console.error("Password update error:", error);
         toast({ title: "An Error Occurred", description: "Could not change your password.", variant: "destructive" });
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    window.location.href = "/";
  };
  
  if (!currentUser) {
    return null; // Or a loading spinner
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 animate-fade-in-up opacity-0" style={{animationFillMode: 'forwards'}}>
      <div className="flex flex-col items-center mb-8">
        <UserCog className="w-16 h-16 text-accent mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">Your Account</h1>
        <p className="mt-2 text-lg text-muted-foreground">Manage your profile details and security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Profile Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><User className="mr-2 h-5 w-5 text-primary" /> Profile Details</CardTitle>
            <CardDescription>Update your personal information here.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                 <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="Your Name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={profileForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl><Input type="tel" placeholder="9876543210" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={profileForm.formState.isSubmitting}>
                  {profileForm.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-primary" /> Change Password</CardTitle>
            <CardDescription>Update your login password.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
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
                  {passwordForm.formState.isSubmitting ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <Separator className="my-12 max-w-4xl mx-auto" />
      
      <div className="text-center">
        <Button variant="destructive" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Log Out
        </Button>
      </div>

    </div>
  );
}
