
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LoaderCircle, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Re-using the display logic by copying it into viewer components
import { LabelReportDisplay } from "@/components/common/LabelReportDisplay";
import { RecipeDisplay } from "@/components/common/RecipeDisplay";
import { NutritionReportDisplay } from "@/components/common/NutritionReportDisplay";

import type { GenerateHealthReportOutput } from "@/ai/flows/generate-health-report";
import type { GetDetailedRecipeOutput } from "@/ai/flows/get-detailed-recipe";
import type { AnalyzeNutritionOutput } from "@/ai/flows/nutrition-analysis";

// Define a unified report structure for state management
interface Report<T> {
  id: string;
  userId: string;
  type: 'label' | 'recipe' | 'nutrition';
  title: string;
  summary: string;
  createdAt: string;
  data: T; // The full AI output
  userInput: any; // The original input to the AI flow
}

export default function IndividualHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [report, setReport] = useState<Report<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      try {
        const allUserReports = JSON.parse(localStorage.getItem("userReports") || "{}");
        let foundReport: Report<any> | null = null;

        // Search through all users' reports to find the one with the matching ID
        for (const userEmail in allUserReports) {
          const userReports = allUserReports[userEmail] as Report<any>[];
          const matched = userReports.find(r => r.id === id);
          if (matched) {
            foundReport = matched;
            break;
          }
        }

        if (foundReport) {
          setReport(foundReport);
        } else {
          setError("Report not found. It may have been deleted or the link is incorrect.");
        }
      } catch (e) {
        console.error("Failed to load report from local storage:", e);
        setError("An error occurred while trying to load the report.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [id]);
  
  const renderReport = () => {
    if (!report) return null;
    
    switch (report.type) {
      case 'label':
        return <LabelReportDisplay report={report.data as GenerateHealthReportOutput} />;
      case 'recipe':
        return <RecipeDisplay recipe={report.data as GetDetailedRecipeOutput} />;
      case 'nutrition':
        return <NutritionReportDisplay analysisResult={report.data as AnalyzeNutritionOutput} userInput={report.userInput} />;
      default:
        return <p>Unknown report type.</p>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <LoaderCircle className="w-16 h-16 text-accent animate-spin mb-4" />
        <h1 className="text-2xl font-bold">Loading Report...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
        <FileText className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive">Error Loading Report</h1>
        <p className="mt-2 text-lg text-muted-foreground">{error}</p>
        <Button asChild className="mt-8">
          <Link href="/history">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
            <Button asChild variant="outline">
                <Link href="/history">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to All History
                </Link>
            </Button>
        </div>
        {renderReport()}
      </div>
    </div>
  );
}
