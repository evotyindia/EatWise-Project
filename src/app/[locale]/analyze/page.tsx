import { AnalyzerForm } from "./analyzer-form"; // Path might need adjustment based on actual location
import { ScanLine } from "lucide-react";
import {NextPage} from 'next';

interface AnalyzePageProps {
  params: { locale: string };
}

const AnalyzePage: NextPage<AnalyzePageProps> = ({ params: { locale } }) => {
  // Here you could use `useTranslations` if this page had directly translatable text
  // const t = useTranslations('AnalyzePage');

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col items-center mb-8">
        <ScanLine className="w-16 h-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-center">Food Label Analyzer</h1> {/* Placeholder text */}
        <p className="mt-2 text-lg text-muted-foreground text-center max-w-2xl">
          Upload an image of a food label or manually enter details to get an AI-powered health report, ingredient analysis, and healthier Indian alternatives. {/* Placeholder text */}
        </p>
      </div>
      <AnalyzerForm />
    </div>
  );
}
export default AnalyzePage;