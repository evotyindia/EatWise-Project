
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { setUsername, checkUsernameExists, type User } from "@/services/userService";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoaderCircle, CheckCircle2, XCircle, AtSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


interface UsernameSetupDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUsernameSet: (username: string) => void;
  user: User;
  forceOpen?: boolean;
}

const usernameFormSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }).regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores." }),
});

export function UsernameSetupDialog({ isOpen, onOpenChange, onUsernameSet, user, forceOpen = false }: UsernameSetupDialogProps) {
  const { toast } = useToast();
  const [usernameToCheck, setUsernameToCheck] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "available" | "taken" | "invalid">("idle");
  const debouncedUsername = useDebounce(usernameToCheck, 500);

  const form = useForm<z.infer<typeof usernameFormSchema>>({
    resolver: zodResolver(usernameFormSchema),
    defaultValues: { username: "" },
  });

  useEffect(() => {
    const checkUser = async () => {
      if (debouncedUsername.length < 3 || !/^[a-zA-Z0-9_]+$/.test(debouncedUsername)) {
        setUsernameStatus(debouncedUsername.length > 0 ? "invalid" : "idle");
        setIsCheckingUsername(false);
        return;
      }
      setIsCheckingUsername(true);
      try {
        const exists = await checkUsernameExists(debouncedUsername);
        setUsernameStatus(exists ? "taken" : "available");
      } catch (error) {
        console.error("Username check error:", error);
        setUsernameStatus("idle");
      }
      setIsCheckingUsername(false);
    };

    if (debouncedUsername) {
      checkUser();
    } else {
      setUsernameStatus("idle");
    }
  }, [debouncedUsername]);

  async function onUsernameSubmit(values: z.infer<typeof usernameFormSchema>) {
    if (usernameStatus !== 'available') {
      toast({ title: "Username Invalid", description: "Please choose an available username.", variant: "destructive"});
      return;
    }

    const result = await setUsername(user.uid, user.id, values.username);

    if (result.success) {
      onUsernameSet(values.username);
    } else {
      toast({ title: "An Error Occurred", description: result.message || "Could not set your username.", variant: "destructive" });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={forceOpen ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => { if(forceOpen) e.preventDefault(); }}>
        <DialogHeader>
          <DialogTitle className="flex items-center"><AtSign className="mr-2 h-6 w-6 text-primary" /> Set Your Username</DialogTitle>
          <DialogDescription>
            Choose a unique username for your account. This is a one-time action and cannot be changed later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onUsernameSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        placeholder="your_unique_username" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          setUsernameToCheck(e.target.value);
                        }}
                      />
                    </FormControl>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {isCheckingUsername && <LoaderCircle className="h-5 w-5 text-muted-foreground animate-spin" />}
                      {!isCheckingUsername && usernameStatus === 'available' && <CheckCircle2 className="h-5 w-5 text-success" />}
                      {!isCheckingUsername && usernameStatus === 'taken' && <XCircle className="h-5 w-5 text-destructive" />}
                      {!isCheckingUsername && usernameStatus === 'invalid' && <XCircle className="h-5 w-5 text-destructive" />}
                    </div>
                  </div>
                  {usernameStatus === 'taken' && <p className="text-sm font-medium text-destructive">This username is already taken.</p>}
                  {usernameStatus === 'invalid' && debouncedUsername.length > 0 && <p className="text-sm font-medium text-destructive">Must be at least 3 characters; use only letters, numbers, or underscores.</p>}
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                 <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || usernameStatus !== 'available'}>
                    {form.formState.isSubmitting ? "Saving..." : "Save Username"}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
