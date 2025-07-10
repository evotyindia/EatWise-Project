
"use client";
import React from "react";
import type { GenerateHealthReportOutput } from "@/ai/flows/generate-health-report";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StarRating } from "@/components/common/star-rating";
import { cn } from "@/lib/utils";
import { FileText, HeartPulse, Zap, Wheat, Sparkles, Info, ShieldCheck, ShieldAlert, ClipboardList, UserCheck, Lightbulb, CookingPot, Microscope } from "lucide-react";

interface LabelReportDisplayProps {
  report: GenerateHealthReportOutput;
}

export const LabelReportDisplay: React.FC<LabelReportDisplayProps> = ({ report }) => {
  const renderFormattedText = (text?: string): JSX.Element | null => {
    if (!text || text.trim() === "" || text.trim().toLowerCase() === "n/a" || text.trim().toLowerCase().includes("no significant")) return null;
    const lines = text.split('\n').map(line => line.trim()).filter(line => line !== "");
    if (lines.length === 0) return null;
    const processMarkdown = (lineContent: string) => lineContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return (
      <ul className="space-y-1.5 text-sm leading-relaxed">
        {lines.map((line, index) => {
          const contentWithoutMarker = line.replace(/^(\*|-)\s*/, '');
          if (!contentWithoutMarker) return null;
          const processedContent = processMarkdown(contentWithoutMarker);
          return (
            <li key={index} className="flex items-start">
              <span className="mr-3 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              <span className="break-words" dangerouslySetInnerHTML={{ __html: processedContent }} />
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center text-2xl"><FileText className="mr-2 h-6 w-6 text-primary" /> AI Health Report</CardTitle>
            {report.productType && (<CardDescription>Product Type: <span className="font-semibold">{report.productType}</span></CardDescription>)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Alert variant="default" className="bg-muted/60"><HeartPulse className="h-5 w-5 text-accent" /><AlertTitle className="font-semibold">Overall Health Rating</AlertTitle><AlertDescription><div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-2"><div className="flex items-center gap-2"><StarRating rating={report.healthRating} variant="good" /><span className="font-medium text-sm">({report.healthRating}/5)</span></div><span className="text-xs text-muted-foreground ml-auto">(Higher is better)</span></div></AlertDescription></Alert>
          {report.processingLevelRating?.rating !== undefined && (<Alert variant="default" className="bg-muted/60"><Zap className="h-5 w-5 text-accent" /><AlertTitle className="font-semibold">Processing Level</AlertTitle><AlertDescription><div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-2"><div className="flex items-center gap-2"><StarRating rating={report.processingLevelRating.rating} variant="bad" /><span className="font-medium text-sm">({report.processingLevelRating.rating}/5)</span></div><span className="text-xs text-muted-foreground ml-auto">(Lower is better)</span></div></AlertDescription></Alert>)}
          {report.sugarContentRating?.rating !== undefined && (<Alert variant="default" className="bg-muted/60"><Wheat className="h-5 w-5 text-accent" /><AlertTitle className="font-semibold">Sugar Content</AlertTitle><AlertDescription><div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-2"><div className="flex items-center gap-2"><StarRating rating={report.sugarContentRating.rating} variant="bad" /><span className="font-medium text-sm">({report.sugarContentRating.rating}/5)</span></div><span className="text-xs text-muted-foreground ml-auto">(Lower is better)</span></div></AlertDescription></Alert>)}
          {report.nutrientDensityRating?.rating !== undefined && (<Alert variant="default" className="bg-muted/60"><Sparkles className="h-5 w-5 text-accent" /><AlertTitle className="font-semibold">Nutrient Density</AlertTitle><AlertDescription><div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-2"><div className="flex items-center gap-2"><StarRating rating={report.nutrientDensityRating.rating} variant="good" /><span className="font-medium text-sm">({report.nutrientDensityRating.rating}/5)</span></div><span className="text-xs text-muted-foreground ml-auto">(Higher is better)</span></div></AlertDescription></Alert>)}
        </div>
        <Separator />
        <Alert variant="default" className="bg-background/30"><AlertTitle className="font-semibold text-lg mb-1 flex items-center"><Info className="h-5 w-5 mr-2 text-primary" /><span>Summary</span></AlertTitle><AlertDescription className="pl-7">{report.summary}</AlertDescription></Alert>
        <Alert variant="success"><AlertTitle className="font-semibold text-lg mb-1 flex items-center"><ShieldCheck className="h-5 w-5 mr-2" /><span>Green Flags</span></AlertTitle><AlertDescription className="pl-7">{renderFormattedText(report.greenFlags) || <p className="text-sm">{report.greenFlags}</p>}</AlertDescription></Alert>
        <Alert variant="destructive"><AlertTitle className="font-semibold text-lg mb-1 flex items-center"><ShieldAlert className="h-5 w-5 mr-2" /><span>Red Flags</span></AlertTitle><AlertDescription className="pl-7">{renderFormattedText(report.redFlags) || <p className="text-sm">{report.redFlags}</p>}</AlertDescription></Alert>
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="detailed-analysis">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline bg-muted/50 border px-4 py-3 rounded-lg hover:bg-muted/80">
                <div className="flex items-center"><ClipboardList className="mr-2 h-5 w-5 text-primary" /><span>Detailed Nutritional Breakdown</span></div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="p-3 rounded-md border bg-muted/50"><h4 className="font-semibold mb-1">Processing Level</h4><p className="text-sm text-muted-foreground">{report.detailedAnalysis.processingLevel}</p></div>
              <div className="p-3 rounded-md border bg-muted/50"><h4 className="font-semibold mb-1">Macronutrient Profile</h4><p className="text-sm text-muted-foreground">{report.detailedAnalysis.macronutrientProfile}</p></div>
              <div className="p-3 rounded-md border bg-muted/50"><h4 className="font-semibold mb-1">Sugar Analysis</h4><p className="text-sm text-muted-foreground">{report.detailedAnalysis.sugarAnalysis}</p></div>
              {renderFormattedText(report.detailedAnalysis.micronutrientHighlights) && (<div className="p-3 rounded-md border bg-muted/50"><h4 className="font-semibold mb-1">Micronutrient Highlights</h4><div className="text-sm text-muted-foreground">{renderFormattedText(report.detailedAnalysis.micronutrientHighlights)}</div></div>)}
            </AccordionContent>
          </AccordionItem>
          {report.ingredientDeepDive && report.ingredientDeepDive.length > 0 && (
            <AccordionItem value="ingredient-deep-dive">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline bg-muted/50 border px-4 py-3 rounded-lg hover:bg-muted/80">
                    <div className="flex items-center"><Microscope className="mr-2 h-5 w-5 text-primary" /><span>Ingredient Deep Dive</span></div>
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                    <Table className="hidden md:table">
                        <TableHeader><TableRow><TableHead className="w-1/4 font-bold">Ingredient</TableHead><TableHead className="w-1/5 font-bold">Risk Level</TableHead><TableHead className="font-bold">Explanation</TableHead></TableRow></TableHeader>
                        <TableBody>{report.ingredientDeepDive.map((item, index) => {const riskColorClass = {'High': 'text-destructive','Medium': 'text-orange-500 dark:text-orange-400','Low': 'text-success','Neutral': 'text-muted-foreground',}[item.riskLevel] || 'text-muted-foreground'; return (<TableRow key={index} className="bg-background"><TableCell className="font-semibold">{item.ingredientName}</TableCell><TableCell className={cn("font-bold", riskColorClass)}>{item.riskLevel}</TableCell><TableCell><p className="text-sm font-medium">{item.description}</p><p className="text-xs text-muted-foreground mt-1">{item.riskReason}</p></TableCell></TableRow>);})}</TableBody>
                    </Table>
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {report.ingredientDeepDive.map((item, index) => {
                            const riskColorClass = {'High': 'text-destructive','Medium': 'text-orange-500 dark:text-orange-400','Low': 'text-success','Neutral': 'text-muted-foreground',}[item.riskLevel] || 'text-muted-foreground';
                            return (
                            <div key={index} className="rounded-lg border bg-background p-4 shadow-sm">
                                <h4 className="font-bold text-base text-primary mb-2">{item.ingredientName}</h4>
                                <div className="grid grid-cols-[auto,1fr] items-baseline gap-x-2 text-sm">
                                    <span className="font-semibold text-muted-foreground text-right">Risk Level:</span>
                                    <span className={cn("font-bold", riskColorClass)}>{item.riskLevel}</span>
                                </div>
                                <Separator className="my-2" />
                                <div>
                                    <p className="text-sm leading-relaxed">{item.description}</p>
                                    <p className="text-xs text-muted-foreground mt-2">{item.riskReason}</p>
                                </div>
                            </div>
                        )})}
                    </div>
                </AccordionContent>
            </AccordionItem>
         )}
        </Accordion>
        <Separator />
        <Alert variant="default" className="bg-secondary/70"><AlertTitle className="font-semibold text-lg mb-1 flex items-center"><UserCheck className="h-5 w-5 mr-2 text-primary" /><span>Best Suited For</span></AlertTitle><AlertDescription className="pl-7">{report.bestSuitedFor}</AlertDescription></Alert>
        {renderFormattedText(report.consumptionTips) && (<Alert variant="default" className="bg-secondary/70"><AlertTitle className="font-semibold text-lg mb-1 flex items-center"><Lightbulb className="h-5 w-5 mr-2 text-primary" /><span>Healthy Consumption Tips</span></AlertTitle><AlertDescription className="pl-7">{renderFormattedText(report.consumptionTips)}</AlertDescription></Alert>)}
        <Alert variant="default" className="bg-secondary/70"><AlertTitle className="font-semibold text-lg mb-1 flex items-center"><CookingPot className="h-5 w-5 mr-2 text-primary" /><span>Role in an Indian Diet</span></AlertTitle><AlertDescription className="pl-7">{report.indianDietContext}</AlertDescription></Alert>
        {renderFormattedText(report.healthierAlternatives) && (<Alert variant="default" className="bg-secondary"><AlertTitle className="font-semibold text-lg mb-1 flex items-center"><Info className="h-5 w-5 mr-2 text-primary" /><span>Healthier Indian Alternatives</span></AlertTitle><AlertDescription className="pl-7">{renderFormattedText(report.healthierAlternatives)}</AlertDescription></Alert>)}
      </CardContent>
    </Card>
  );
};
