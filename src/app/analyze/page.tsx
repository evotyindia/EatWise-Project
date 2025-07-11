
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnalyzerForm } from "@/app/analyze/analyzer-form";
import { ScanLine, LoaderCircle } from "lucide-react";
import type { NextPage, Metadata } from 'next';

// Note: Metadata export is for static analysis and won't be dynamic here.
// For dynamic metadata, you'd use the generateMetadata function.
export const metadata: Metadata = {
  title: "AI Food Label Analyzer",
  description: "Upload a food label image or enter ingredients to get an instant AI health report. Understand what's in your food, get a health rating, and find healthier Indian alternatives.",
};

const AnalyzePage: NextPage = () => {
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
        <ScanLine className="w-16 h-16 text-accent mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">Food Label Analyzer</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
          Upload an image of a food label or manually enter details to get an AI-powered health report, ingredient analysis, and healthier Indian alternatives.
        </p>
      </div>
      <AnalyzerForm />
    </div>
  );
}
export default AnalyzePage;
