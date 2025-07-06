
import { NutritionForm } from "./nutrition-form";
import { BarChart3 } from "lucide-react";

export default function NutritionCheckPage() {
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
