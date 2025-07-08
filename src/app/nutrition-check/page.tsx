
import { NutritionForm } from "./nutrition-form";
import { BarChart3 } from "lucide-react";
import type { NextPage, Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "AI Nutrition Analyzer | EatWise India",
    description: "Analyze nutritional information from food labels or manual input. Get AI insights on balance, suitability, and density rating with EatWise India.",
    alternates: {
      canonical: `${BASE_URL}/nutrition-check`,
    },
  };
}

const NutritionCheckPage: NextPage = () => {
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
