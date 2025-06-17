
import { NutritionForm } from "./nutrition-form";
import { BarChart3 } from "lucide-react";
import type { NextPage, Metadata } from 'next';

const BASE_URL = 'https://eatwise.evotyindia.me';

export const metadata: Metadata = {
  title: "AI Nutrition Analyzer | EatWise India",
  description: "Analyze nutritional information from food labels or manual input. Get AI insights on balance, suitability, and density rating with EatWise India.",
  alternates: {
    canonical: `${BASE_URL}/nutrition-check`,
  },
};

const NutritionCheckPage: NextPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col items-center mb-8">
        <BarChart3 className="w-16 h-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-center">Nutrition Analyzer</h1>
        <p className="mt-2 text-lg text-muted-foreground text-center max-w-2xl">
          Upload an image of nutritional information or enter values manually. Get an AI analysis of how balanced the item is, suitability suggestions, and an overall nutrition density rating.
        </p>
      </div>
      <NutritionForm />
    </div>
  );
}

export default NutritionCheckPage;
