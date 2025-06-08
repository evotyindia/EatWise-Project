import { NutritionForm } from "./nutrition-form"; // Path might need adjustment
import { BarChart3 } from "lucide-react";
import {NextPage} from 'next';

interface NutritionCheckPageProps {
  params: { locale: string };
}

const NutritionCheckPage: NextPage<NutritionCheckPageProps> = ({ params: { locale } }) => {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col items-center mb-8">
        <BarChart3 className="w-16 h-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-center">Nutrition Analyzer</h1> {/* Placeholder text */}
        <p className="mt-2 text-lg text-muted-foreground text-center max-w-2xl">
          Upload an image of nutritional information or enter values manually. Get an AI analysis of how balanced the item is, suitability suggestions, and an overall nutrition density rating. {/* Placeholder text */}
        </p>
      </div>
      <NutritionForm />
    </div>
  );
}

export default NutritionCheckPage;