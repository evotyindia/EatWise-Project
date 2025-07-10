
"use client";
import React from "react";
import type { AnalyzeNutritionOutput, AnalyzeNutritionInput } from "@/ai/flows/nutrition-analysis";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StarRating } from "@/components/common/star-rating";
import { cn } from "@/lib/utils";
import { FileText, Sparkles, Info, Microscope, ChevronDown } from "lucide-react";

interface NutritionReportDisplayProps {
  analysisResult: AnalyzeNutritionOutput;
  userInput?: AnalyzeNutritionInput;
}

export const NutritionReportDisplay: React.FC<NutritionReportDisplayProps> = ({ analysisResult, userInput }) => {
  const renderFormattedAnalysisText = (text?: string): JSX.Element | null => {
      if (!text || text.trim().toLowerCase() === 'n/a' || text.trim() === '' || text.trim().toLowerCase().includes('no significant')) {
        return <p className="text-sm text-muted-foreground">Not specified / Not applicable.</p>;
      }
      const lines = text.split('\n').filter(s => s.trim() !== "");
      if (lines.length === 0) return null;
      const processMarkdown = (lineContent: string) => lineContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      const listItems = lines.map((line, index) => {
          const contentWithoutMarker = line.replace(/^(\*|-)\s*/, '');
          if (!contentWithoutMarker) return null;
          const processedContent = processMarkdown(contentWithoutMarker);
          return (
              <li key={index} className="flex items-start">
                  <span className="mr-3 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span className="break-words" dangerouslySetInnerHTML={{ __html: processedContent }} />
              </li>
          );
      }).filter(Boolean);
      return <ul className="space-y-1.5 text-sm leading-relaxed">{listItems}</ul>;
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center text-2xl"><FileText className="mr-2 h-6 w-6 text-primary" /> AI Nutrition Analysis</CardTitle>
            <CardDescription>
              Understanding your food&apos;s nutritional profile
              {userInput?.foodItemDescription ? ` for: ${userInput.foodItemDescription.replace("IGNORE_VALIDATION_FOR_IMAGE_SUBMIT_INTERNAL_MARKER", "").trim()}` : "."}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="default" className="bg-muted/60"><Sparkles className="h-5 w-5 text-accent" /><AlertTitle className="font-semibold flex justify-between items-center"><span>Nutrient Density Rating</span><span className="text-xs font-normal text-muted-foreground">(Higher is better)</span></AlertTitle><AlertDescription className="flex items-center gap-1 flex-wrap mt-1"><StarRating rating={analysisResult.nutritionDensityRating} variant="good" /> ({analysisResult.nutritionDensityRating}/5)</AlertDescription></Alert>
        <Separator />
        <Alert><Info className="h-4 w-4" /><AlertTitle className="font-semibold">Overall Analysis</AlertTitle><AlertDescription>{renderFormattedAnalysisText(analysisResult.overallAnalysis)}</AlertDescription></Alert>
        <Separator />
        <div>
          <h3 className="font-semibold text-xl flex items-center mb-4"><FileText className="mr-2 h-5 w-5 text-primary" />Detailed Nutritional Insights</h3>
          <div className="space-y-4">
            <Alert><Info className="h-4 w-4" /><AlertTitle className="font-semibold">Dietary Suitability</AlertTitle><AlertDescription>{renderFormattedAnalysisText(analysisResult.dietarySuitability)}</AlertDescription></Alert>
            <Alert><Info className="h-4 w-4" /><AlertTitle className="font-semibold">Macronutrient Balance</AlertTitle><AlertDescription>{renderFormattedAnalysisText(analysisResult.macronutrientBalance)}</AlertDescription></Alert>
            <Alert><Info className="h-4 w-4" /><AlertTitle className="font-semibold">Micronutrient Highlights</AlertTitle><AlertDescription>{renderFormattedAnalysisText(analysisResult.micronutrientHighlights)}</AlertDescription></Alert>
            <Alert><Info className="h-4 w-4" /><AlertTitle className="font-semibold">Processing Level Assessment</AlertTitle><AlertDescription>{renderFormattedAnalysisText(analysisResult.processingLevelAssessment)}</AlertDescription></Alert>
            <Alert><Info className="h-4 w-4" /><AlertTitle className="font-semibold">Serving Size Context</AlertTitle><AlertDescription>{renderFormattedAnalysisText(analysisResult.servingSizeContext)}</AlertDescription></Alert>
          </div>
        </div>
        <Accordion type="single" collapsible className="w-full border-t pt-6">
          <AccordionItem value="nutrient-breakdown" className="border-b-0">
            <AccordionTrigger className="text-xl font-semibold hover:no-underline bg-muted/50 border px-4 py-3 rounded-lg hover:bg-muted/80">
                <div className="flex items-center"><Microscope className="mr-2 h-5 w-5 text-primary" /><span>Nutrient-by-Nutrient Breakdown</span></div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              {analysisResult.nutrientAnalysisTable && analysisResult.nutrientAnalysisTable.length > 0 ? (
                <div>
                  {/* Desktop Table */}
                  <Table className="hidden md:table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Nutrient</TableHead>
                        <TableHead className="font-semibold">Amount</TableHead>
                        <TableHead className="font-semibold">Verdict</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analysisResult.nutrientAnalysisTable.map((item, index) => {
                        const verdict = (item.verdict || "").toLowerCase(); 
                        const colorClass = verdict.includes('good') || verdict.includes('low') ? 'text-success' : verdict.includes('high') ? 'text-destructive' : verdict.includes('okay') ? 'text-orange-500 dark:text-orange-400' : 'text-muted-foreground'; 
                        return (
                          <TableRow key={index} className="bg-background">
                            <TableCell className="font-semibold">{item.nutrient}</TableCell>
                            <TableCell>{item.value}</TableCell>
                            <TableCell>
                              <div className={cn("font-bold", colorClass)}>{item.verdict}</div>
                              <p className="text-xs text-muted-foreground mt-1">{item.comment}</p>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  {/* Mobile Card List */}
                  <div className="grid grid-cols-1 gap-4 md:hidden">
                      {analysisResult.nutrientAnalysisTable.map((item, index) => {
                           const verdict = (item.verdict || "").toLowerCase(); 
                           const colorClass = verdict.includes('good') || verdict.includes('low') ? 'text-success' : verdict.includes('high') ? 'text-destructive' : verdict.includes('okay') ? 'text-orange-500 dark:text-orange-400' : 'text-muted-foreground'; 
                          return (
                          <div key={index} className="rounded-lg border bg-background p-4 space-y-2">
                              <h4 className="font-bold">{item.nutrient}</h4>
                              <p><strong className="text-sm">Amount: </strong>{item.value}</p>
                              <div><strong className="text-sm">Verdict: </strong><span className={cn("font-bold", colorClass)}>{item.verdict}</span></div>
                              <p className="text-xs text-muted-foreground">{item.comment}</p>
                          </div>
                      )})}
                  </div>
                </div>
              ) : (<p className="text-sm text-muted-foreground text-center py-4">No specific nutrient data was available for breakdown.</p>)}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
