
import { AnalyzerForm } from "@/app/analyze/analyzer-form";
import { ScanLine, Lightbulb } from "lucide-react";
import type { NextPage, Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://eatwise.evotyindia.me';

export const metadata: Metadata = {
  title: "AI Food Label Analyzer | EatWise India",
  description: "Upload a food label image or enter ingredients to get an AI health report, analysis, and healthier Indian alternatives with EatWise India.",
  alternates: {
    canonical: `${BASE_URL}/analyze`,
  },
};

const AnalyzePage: NextPage = () => {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="p-4 bg-primary/10 rounded-full mb-5 inline-block">
            <ScanLine className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-primary">Food Label Analyzer</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
          Upload an image of a food label or manually enter details to get an AI-powered health report, ingredient analysis, and healthier Indian alternatives.
        </p>
      </div>
      <AnalyzerForm />
       <div className="mt-12 p-6 bg-accent/10 rounded-xl border border-accent/20">
        <div className="flex items-center text-accent mb-3">
          <Lightbulb className="w-6 h-6 mr-2" />
          <h2 className="text-xl font-semibold">Understanding Your Report</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Our AI analyzes ingredients for potential health impacts, assesses nutrient balance (if data is available), and provides an overall health rating from 1 (least healthy) to 5 (most healthy). 
          We also suggest healthier Indian alternatives. Use the chat feature to ask specific questions about the report. This tool is for informational purposes and not a substitute for professional dietary advice.
        </p>
      </div>
    </div>
  );
}
export default AnalyzePage;

