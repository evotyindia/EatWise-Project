
import { AnalyzerForm } from "@/app/analyze/analyzer-form";
import { ScanLine } from "lucide-react";

export default function AnalyzePage() {
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
