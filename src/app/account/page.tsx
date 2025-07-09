
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
import { UserCog, LogOut, ShieldCheck, User, Trash2, Ban, AtSign } from "lucide-react";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


// Schema for setting username for the first time
const usernameFormSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }).regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores." }),
});

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
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => {
    const loggedInUserEmail = JSON.parse(localStorage.getItem("loggedInUser") || "{}").email;
    if (!loggedInUserEmail) {
      router.replace('/login');
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: any) => u.email === loggedInUserEmail);
    if (user) {
      setCurrentUser(user);
    } else {
      router.replace('/login');
    }
  }, [router]);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });
  
  const usernameForm = useForm<z.infer<typeof usernameFormSchema>>({
    resolver: zodResolver(usernameFormSchema),
    defaultValues: { username: "" },
  });

  useEffect(() => {
    if (currentUser) {
      profileForm.reset({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
      });
    }
  }, [currentUser, profileForm]);

  function onUsernameSubmit(values: z.infer<typeof usernameFormSchema>) {
    try {
      let users = JSON.parse(localStorage.getItem("users") || "[]");
      const usernameExists = users.some((u: any) => u.username?.toLowerCase() === values.username.toLowerCase());
      if (usernameExists) {
        usernameForm.setError("username", { type: "manual", message: "This username is already taken." });
        return;
      }
      const userIndex = users.findIndex((u: any) => u.email === currentUser.email);
      if (userIndex === -1) throw new Error("User not found.");

      users[userIndex].username = values.username;
      localStorage.setItem("users", JSON.stringify(users));
      setCurrentUser(users[userIndex]);
      toast({ title: "Username Set!", description: "Your unique username has been saved." });
    } catch (error) {
       console.error("Username update error:", error);
       toast({ title: "An Error Occurred", description: "Could not set your username.", variant: "destructive" });
    }
  }

  function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    try {
      let users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex((u: any) => u.email === currentUser.email);
      if (userIndex === -1) throw new Error("User not found.");
      if (values.email !== currentUser.email && users.some((u: any) => u.email === values.email)) {
        toast({ title: "Update Failed", description: "This email address is already in use.", variant: "destructive" });
        return;
      }
      const updatedUser = { ...users[userIndex], name: values.name, email: values.email, phone: values.phone };
      users[userIndex] = updatedUser;
      
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("loggedInUser", JSON.stringify({ email: updatedUser.email }));
      setCurrentUser(updatedUser);
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

  const handleClearHistory = () => {
    try {
      let allReports = JSON.parse(localStorage.getItem("userReports") || "{}");
      if(allReports[currentUser.email]) {
        delete allReports[currentUser.email];
        localStorage.setItem("userReports", JSON.stringify(allReports));
        toast({ title: "History Cleared", description: "All your saved reports have been deleted." });
      } else {
        toast({ title: "No History Found", description: "There was no history to clear." });
      }
    } catch (error) {
      toast({ title: "Error", description: "Could not clear history.", variant: "destructive" });
    }
  }

  const handleDeleteAccount = () => {
    try {
      // Clear history first
      handleClearHistory();
      // Remove user
      let users = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = users.filter((u: any) => u.email !== currentUser.email);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      // Log out
      handleLogout(true);
      toast({ title: "Account Deleted", description: "Your account has been permanently deleted." });
    } catch (error) {
      toast({ title: "Error", description: "Could not delete account.", variant: "destructive" });
    }
  }

  const handleLogout = (isDeletion = false) => {
    localStorage.removeItem("loggedInUser");
    if (!isDeletion) {
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
    }
    window.location.href = "/";
  };
  
  if (!currentUser) {
    return null;
  }

  // One-time username setup view
  if (!currentUser.username) {
    return (
       <div className="container mx-auto py-12 px-4 md:px-6 animate-fade-in-up flex justify-center items-center min-h-[calc(100vh-8rem)]">
         <Card className="w-full max-w-lg">
           <CardHeader>
             <CardTitle className="flex items-center"><AtSign className="mr-2 h-6 w-6 text-primary" /> Set Your Username</CardTitle>
             <CardDescription>Choose a unique username for your account. This can only be set once.</CardDescription>
           </CardHeader>
           <CardContent>
             <Form {...usernameForm}>
               <form onSubmit={usernameForm.handleSubmit(onUsernameSubmit)} className="space-y-6">
                  <FormField
                     control={usernameForm.control}
                     name="username"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Username</FormLabel>
                         <FormControl><Input placeholder="your_unique_username" {...field} /></FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                 <Button type="submit" className="w-full" disabled={usernameForm.formState.isSubmitting}>
                   {usernameForm.formState.isSubmitting ? "Saving..." : "Save Username"}
                 </Button>
               </form>
             </Form>
           </CardContent>
         </Card>
       </div>
    );
  }

  // Regular account settings view
  return (
    <div className="container mx-auto py-12 px-4 md:px-6 animate-fade-in-up">
      <div className="flex flex-col items-center mb-8">
        <UserCog className="w-16 h-16 text-accent mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">Your Account</h1>
        <p className="mt-2 text-lg text-muted-foreground">Manage your profile details and security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><User className="mr-2 h-5 w-5 text-primary" /> Profile Details</CardTitle>
            <CardDescription>Update your personal information here.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <FormLabel>Username</FormLabel>
                    <Input value={`@${currentUser.username}`} readOnly disabled />
                    <p className="text-xs text-muted-foreground">Username cannot be changed.</p>
                </div>
                 <FormField control={profileForm.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your Name" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                <FormField control={profileForm.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                 <FormField control={profileForm.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone Number (Optional)</FormLabel><FormControl><Input type="tel" placeholder="9876543210" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                <Button type="submit" className="w-full" disabled={profileForm.formState.isSubmitting}>
                  {profileForm.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-primary" /> Change Password</CardTitle>
            <CardDescription>Update your login password.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => (
                    <FormItem><FormLabel>Current Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (
                    <FormItem><FormLabel>New Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                <FormField control={passwordForm.control} name="confirmPassword" render={({ field }) => (
                    <FormItem><FormLabel>Confirm New Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                <Button type="submit" className="w-full" disabled={passwordForm.formState.isSubmitting}>
                  {passwordForm.formState.isSubmitting ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <Separator className="my-12 max-w-4xl mx-auto" />

      <Card className="max-w-4xl mx-auto border-destructive/50">
        <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>These actions are irreversible. Please proceed with caution.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
            <div>
                <p className="font-semibold">Clear All History</p>
                <p className="text-sm text-muted-foreground">This will permanently delete all your saved reports.</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild><Button variant="outline"><Trash2 className="mr-2 h-4 w-4" /> Clear History</Button></AlertDialogTrigger>
              <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete all your saved reports. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                  <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleClearHistory}>Yes, Clear History</AlertDialogAction></AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </CardContent>
        <Separator className="max-w-4xl mx-auto" />
        <CardContent className="pt-6 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
            <div>
                <p className="font-semibold">Delete My Account</p>
                <p className="text-sm text-muted-foreground">This will permanently delete your account and all associated data.</p>
            </div>
            <AlertDialog onOpenChange={(isOpen) => { if (!isOpen) setDeleteConfirmation(""); }}>
              <AlertDialogTrigger asChild><Button variant="destructive"><Ban className="mr-2 h-4 w-4" /> Delete Account</Button></AlertDialogTrigger>
              <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action is permanent. To confirm, please type <strong className="text-foreground">@{currentUser.username}</strong> or <strong className="text-foreground">CONFIRM</strong> below.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Input 
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder={`Type @${currentUser.username} or CONFIRM`}
                    className="my-2"
                  />
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      className="bg-destructive hover:bg-destructive/90" 
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirmation !== `@${currentUser.username}` && deleteConfirmation.toUpperCase() !== "CONFIRM"}
                    >
                      Yes, Delete My Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </CardContent>
      </Card>
      
      <Separator className="my-12 max-w-4xl mx-auto" />
      
      <div className="text-center">
        <Button variant="outline" onClick={() => handleLogout(false)}>
          <LogOut className="mr-2 h-4 w-4" /> Log Out
        </Button>
      </div>

    </div>
  );
}
