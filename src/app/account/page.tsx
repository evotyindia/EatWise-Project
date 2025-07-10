
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
import { UserCog, LogOut, ShieldCheck, User, Trash2, Ban, AtSign, LoaderCircle } from "lucide-react";
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
import { type User as UserType, updateUser, deleteUser, getUserByUid } from "@/services/userService";
import { deleteReportsByUserId } from "@/services/reportService";
import { getAuth, deleteUser as deleteAuthUser, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { UsernameSetupDialog } from "@/components/common/UsernameSetupDialog";

// Schema for updating personal details
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }).optional().or(z.literal('')),
});

export default function AccountPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          const userProfile = await getUserByUid(authUser.uid);
          if (userProfile) {
            setCurrentUser(userProfile);
             if (!userProfile.username) {
              setIsUsernameModalOpen(true);
            }
          } else {
            handleLogout(true);
            router.replace('/login');
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          toast({ title: "Error", description: "Could not load your account details.", variant: "destructive" });
          router.replace('/');
        } finally {
          setIsLoading(false);
        }
      } else {
        router.replace('/login');
      }
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { name: "", phone: "" },
  });

  useEffect(() => {
    if (currentUser) {
      profileForm.reset({
        name: currentUser.name || "",
        phone: currentUser.phone || "",
      });
    }
  }, [currentUser, profileForm]);

  const handleUsernameSet = (newUsername: string) => {
    if (currentUser) {
        const updatedUser = { ...currentUser, username: newUsername.toLowerCase() };
        setCurrentUser(updatedUser);
        localStorage.setItem("loggedInUser", JSON.stringify({ id: updatedUser.id, email: updatedUser.email, uid: updatedUser.uid, username: updatedUser.username }));
    }
    setIsUsernameModalOpen(false);
    toast({ title: "Username Set!", description: "Your unique username has been saved." });
  };

  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
     if (!currentUser?.id) return;
    try {
      const updatedData: Partial<Omit<UserType, 'id' | 'uid' | 'email' | 'username' | 'emailVerified'>> = { name: values.name, phone: values.phone };
      await updateUser(currentUser.id, updatedData);

      const updatedUser = { ...currentUser, ...updatedData };
      setCurrentUser(updatedUser);
      toast({ title: "Profile Updated", description: "Your details have been successfully saved." });
    } catch (error) {
      console.error("Profile update error:", error);
      toast({ title: "An Error Occurred", description: (error as Error).message || "Could not update your profile.", variant: "destructive" });
    }
  }

  const handleClearSavedItems = async () => {
    if (!currentUser?.uid) return;
    try {
      await deleteReportsByUserId(currentUser.uid);
      toast({ title: "Saved Items Cleared", description: "All your saved reports have been deleted." });
    } catch (error) {
      toast({ title: "Error", description: "Could not clear saved items.", variant: "destructive" });
    }
  }

  const handleDeleteAccount = async () => {
    if (!currentUser?.id) return;

    const auth = getAuth();
    const authUser = auth.currentUser;

    if (!authUser || authUser.uid !== currentUser.uid) {
      toast({ title: "Error", description: "Authentication mismatch. Please log out and log back in.", variant: "destructive" });
      return;
    }

    try {
      // Step 1: Delete all associated reports from Firestore
      await deleteReportsByUserId(currentUser.uid);

      // Step 2: Delete user record from Firestore and their username reservation
      await deleteUser(currentUser.id, currentUser.username || '');
      
      // Step 3: Delete user from Firebase Authentication
      await deleteAuthUser(authUser);
      
      handleLogout(true);
      toast({ title: "Account Deleted", description: "Your account and all data have been permanently deleted." });

    } catch (error: any) {
      console.error("Account deletion error:", error);
      if (error.code === 'auth/requires-recent-login') {
        toast({
          title: "Re-authentication Required",
          description: "For security, please log out and log back in before deleting your account.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Error", description: (error as Error).message || "Could not delete account. Please try again.", variant: "destructive" });
      }
    }
  }

  const handleLogout = (isDeletion = false) => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loginRedirect");
    auth.signOut();
    if (!isDeletion) {
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
    }
    router.push('/');
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser) {
    return (
        <div className="container mx-auto py-12 px-4 md:px-6 text-center">
            <h1 className="text-2xl font-bold">User not found.</h1>
            <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
    );
  }
  
  if (!currentUser.username) {
     return (
        <div className="container mx-auto py-12 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-8rem)]">
             {currentUser && (
                <UsernameSetupDialog
                    isOpen={isUsernameModalOpen}
                    onOpenChange={setIsUsernameModalOpen}
                    onUsernameSet={handleUsernameSet}
                    user={currentUser}
                    forceOpen={true} // Keep it open on this page until set
                />
            )}
        </div>
     )
  }

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
                <div className="space-y-2">
                    <FormLabel>Email Address</FormLabel>
                    <Input value={currentUser.email} readOnly disabled />
                    <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                </div>
                 <FormField control={profileForm.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your Name" {...field} /></FormControl><FormMessage /></FormItem>
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
            <CardTitle className="flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-primary" /> Security</CardTitle>
            <CardDescription>Security settings for your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="p-4 rounded-lg bg-muted border">
                <p className="font-semibold">Password Management</p>
                 <p className="text-sm text-muted-foreground">To change your password, please use the "Forgot Password" link on the login page. This ensures your account remains secure.</p>
             </div>
             <div className="p-4 rounded-lg bg-muted border">
                <p className="font-semibold">Email Verification Status</p>
                 <p className="text-sm text-muted-foreground">Your email is <span className={currentUser.emailVerified ? "font-bold text-success" : "font-bold text-destructive"}>{currentUser.emailVerified ? "Verified" : "Not Verified"}</span>.</p>
             </div>
          </CardContent>
        </Card>
      </div>
      
      <Separator className="my-12 max-w-4xl mx-auto" />

      <Card className="max-w-4xl mx-auto border-destructive/50">
        <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>These actions are irreversible. Please proceed with caution.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold">Clear All Saved Items</p>
              <p className="text-sm text-muted-foreground">This will permanently delete all your saved reports and analyses.</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto flex-shrink-0">
                  <Trash2 className="mr-2 h-4 w-4" /> Clear Saved Items
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete all your saved items. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleClearSavedItems}>Yes, Clear Saved Items</AlertDialogAction></AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <Separator />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold">Delete My Account</p>
              <p className="text-sm text-muted-foreground">This will permanently delete your account and all associated data.</p>
            </div>
            <AlertDialog onOpenChange={(isOpen) => { if (!isOpen) setDeleteConfirmation(""); }}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto flex-shrink-0">
                  <Ban className="mr-2 h-4 w-4" /> Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action is permanent and cannot be undone. To confirm, please type <strong className="text-foreground">{currentUser.username}/CONFIRM</strong> below.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Input 
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder={`Type ${currentUser.username}/CONFIRM`}
                  className="my-2"
                />
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-destructive hover:bg-destructive/90" 
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmation !== `${currentUser.username}/CONFIRM`}
                  >
                    Yes, Delete My Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
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
