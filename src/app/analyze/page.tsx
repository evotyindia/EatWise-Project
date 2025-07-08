
import { AnalyzerForm } from "@/app/analyze/analyzer-form";
import { ScanLine } from "lucide-react";
<<<<<<< HEAD
import type { NextPage, Metadata } from 'next';

const BASE_URL = 'https://eatwise.evotyindia.me';

export const metadata: Metadata = {
  title: "AI Food Label Analyzer | EatWise India",
  description: "Upload a food label image or enter ingredients to get an AI health report, analysis, and healthier Indian alternatives with EatWise India.",
  alternates: {
    canonical: `${BASE_URL}/analyze`,
  },
};

const AnalyzePage: NextPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col items-center mb-8">
        <ScanLine className="w-16 h-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-center">Food Label Analyzer</h1>
        <p className="mt-2 text-lg text-muted-foreground text-center max-w-2xl">
=======

export default function AnalyzePage() {
  return (
    <div className="container mx-auto py-8 animate-fade-in-up opacity-0" style={{animationFillMode: 'forwards'}}>
      <div className="flex flex-col items-center mb-8 text-center">
        <ScanLine className="w-16 h-16 text-accent mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">Food Label Analyzer</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
>>>>>>> finalprotest
          Upload an image of a food label or manually enter details to get an AI-powered health report, ingredient analysis, and healthier Indian alternatives.
        </p>
      </div>
      <AnalyzerForm />
    </div>
  );
}
<<<<<<< HEAD
export default AnalyzePage;
=======
>>>>>>> finalprotest
