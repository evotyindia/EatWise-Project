
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { NutritionForm } from "./nutrition-form";
import { BarChart3, LoaderCircle } from "lucide-react";
import type { NextPage } from 'next';

const NutritionCheckPage: NextPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
      router.replace(`/login?redirect=${pathname}`);
    } else {
      setIsCheckingAuth(false);
    }
  }, [router, pathname]);

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
        <BarChart3 className="w-16 h-16 text-accent mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">Nutrition Analyzer</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
          Upload a nutrition table image or enter values manually. Get an AI analysis of the item&apos;s balance, suitability, and an overall nutrition density rating.
        </p>
      </div>
      <NutritionForm />
    </div>
  );
}

export default NutritionCheckPage;
