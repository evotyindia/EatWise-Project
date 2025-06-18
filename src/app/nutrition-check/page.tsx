
import { NutritionForm } from "./nutrition-form";
import { BarChart3, PieChart } from "lucide-react";
import type { NextPage, Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://eatwise.evotyindia.me';

export const metadata: Metadata = {
  title: "AI Nutrition Analyzer | EatWise India",
  description: "Analyze nutritional information from food labels or manual input. Get AI insights on balance, suitability, and density rating with EatWise India.",
  alternates: {
    canonical: `${BASE_URL}/nutrition-check`,
  },
};

const NutritionCheckPage: NextPage = () => {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="p-4 bg-primary/10 rounded-full mb-5 inline-block">
            <BarChart3 className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-primary">Nutrition Analyzer</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
          Upload an image of nutritional information or enter values manually. Get an AI analysis of how balanced the item is, suitability suggestions, and an overall nutrition density rating.
        </p>
      </div>
      <NutritionForm />
      <div className="mt-12 p-6 bg-accent/10 rounded-xl border border-accent/20">
        <div className="flex items-center text-accent mb-3">
          <PieChart className="w-6 h-6 mr-2" />
          <h2 className="text-xl font-semibold">Understanding Your Analysis</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Provide nutritional data (calories, fat, protein, etc.) either by uploading an image of a nutrition table or by manual entry. 
          Our AI evaluates macronutrient balance, micronutrient highlights (if available), dietary suitability for different needs, and gives a nutrition density score from 1 (low) to 5 (high). 
          This helps you understand the quality of the food item. Remember to consider serving sizes.
        </p>
      </div>
    </div>
  );
}

export default NutritionCheckPage;

