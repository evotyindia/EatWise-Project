"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RecipeForm } from "./recipe-form";
import { CookingPot, LoaderCircle } from "lucide-react";
import type { NextPage } from 'next';
import { useToast } from "@/hooks/use-toast";

const RecipesPage: NextPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to access the Recipe Finder.",
        variant: "destructive",
      });
      router.replace('/login');
    } else {
      setIsCheckingAuth(false);
    }
  }, [router, toast]);

  if (isCheckingAuth) {
    return (
      <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <LoaderCircle className="w-16 h-16 text-accent animate-spin mb-4" />
        <h1 className="text-2xl font-bold tracking-tight">Checking authentication...</h1>
        <p className="mt-2 text-lg text-muted-foreground">Please wait.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 animate-fade-in-up opacity-0" style={{animationFillMode: 'forwards'}}>
      <div className="flex flex-col items-center mb-8 text-center">
        <CookingPot className="w-16 h-16 text-accent mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">AI Recipe Finder</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
         Unlock delicious and healthy Indian meals with the ingredients you already have. Our AI chef is ready to inspire you.
        </p>
      </div>
      <RecipeForm />
    </div>
  );
}
export default RecipesPage;
