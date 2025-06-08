
import type React from 'react';
import type { AnalyzeNutritionOutput, AnalyzeNutritionInput } from '@/ai/flows/nutrition-analysis'; // Added AnalyzeNutritionInput

interface PrintableNutritionReportProps {
  analysisResult: AnalyzeNutritionOutput;
  userInput?: AnalyzeNutritionInput; // Changed to AnalyzeNutritionInput for more comprehensive data
}

export const PrintableNutritionReport: React.FC<PrintableNutritionReportProps> = ({ analysisResult, userInput }) => {
  const styles: { [key: string]: React.CSSProperties } = {
    page: { padding: '20mm', fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '1.4', color: '#333333', width: '210mm', boxSizing: 'border-box', minHeight: '297mm', display: 'flex', flexDirection: 'column' },
    pageContent: { flexGrow: 1 },
    companyHeader: { textAlign: 'right', fontSize: '9pt', color: '#777777', marginBottom: '15mm' },
    reportTitle: { textAlign: 'center', fontSize: '18pt', fontWeight: 'bold', color: '#005a87', marginBottom: '15mm', textTransform: 'uppercase' },
    section: { marginBottom: '10mm' },
    sectionTitle: { fontSize: '12pt', fontWeight: 'bold', color: '#005a87', marginTop: '0', marginBottom: '5mm', borderBottom: '1px solid #cccccc', paddingBottom: '2mm' },
    subSectionTitle: { fontSize: '11pt', fontWeight: 'bold', color: '#333333', marginTop: '5mm', marginBottom: '3mm' },
    paragraph: { marginBottom: '4mm', textAlign: 'justify' as 'justify' },
    ratingBlock: { border: '1px solid #dddddd', padding: '4mm', borderRadius: '4px', marginBottom: '5mm', backgroundColor: '#f9f9f9' },
    ratingTitle: { fontWeight: 'bold', marginBottom: '2mm', fontSize: '10pt', color: '#333333' },
    ratingValue: { fontSize: '10pt', color: '#333333' },
    inputDataSection: { marginBottom: '10mm', border: '1px dashed #cccccc', padding: '5mm', backgroundColor: '#fdfdfd' },
    inputDataTitle: { fontSize: '10pt', fontWeight: 'bold', color: '#555555', marginBottom: '3mm' },
    inputDataItem: { fontSize: '9pt', color: '#444444' },
    footer: { marginTop: 'auto', paddingTop: '5mm', borderTop: '1px solid #cccccc', fontSize: '8pt', textAlign: 'center', color: '#777777', width: '100%' }
  };

  const renderUserInput = () => {
    if (!userInput || Object.keys(userInput).filter(key => key !== 'nutritionDataUri' && userInput[key as keyof AnalyzeNutritionInput] !== undefined).length === 0) return null;
    
    const nutrients: (keyof AnalyzeNutritionInput)[] = [
      'calories', 'fat', 'saturatedFat', 'transFat', 'cholesterol', 'sodium', 
      'carbohydrates', 'fiber', 'sugar', 'addedSugar', 'protein', 'vitaminD', 
      'calcium', 'iron', 'potassium', 'vitaminC'
    ];
    const unitMap: Partial<Record<keyof AnalyzeNutritionInput, string>> = {
      calories: 'kcal', fat: 'g', saturatedFat: 'g', transFat: 'g', cholesterol: 'mg', sodium: 'mg',
      carbohydrates: 'g', fiber: 'g', sugar: 'g', addedSugar: 'g', protein: 'g', vitaminD: 'mcg/IU',
      calcium: 'mg', iron: 'mg', potassium: 'mg', vitaminC: 'mg'
    };

    return (
      <div style={styles.inputDataSection}>
        <div style={styles.inputDataTitle}>Nutritional Data Provided:</div>
        {userInput.servingSize && <div style={styles.inputDataItem}><strong>Serving Size:</strong> {userInput.servingSize}</div>}
        {nutrients.map(key => {
          const value = userInput[key];
          if (value !== undefined && value !== null) {
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            return <div style={styles.inputDataItem} key={key}><strong>{label}:</strong> {value} {unitMap[key] || ''}</div>;
          }
          return null;
        })}
         {userInput.nutritionDataUri && <div style={styles.inputDataItem}><br/><strong>Note:</strong> Analysis may also include data extracted from an uploaded image.</div>}
      </div>
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.pageContent}>
        <div style={styles.companyHeader}>Swasth Bharat Advisor</div>
        <div style={styles.reportTitle}>AI Nutrition Analysis</div>

        {renderUserInput()}
        
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Overall Assessment</div>
          <div style={styles.ratingBlock}>
            <div style={styles.ratingTitle}>Nutrition Density Rating:</div>
            <div style={styles.ratingValue}>{analysisResult.nutritionDensityRating} / 5 stars</div>
          </div>
          <div style={styles.subSectionTitle}>Overall Analysis:</div>
          <p style={styles.paragraph}>{analysisResult.overallAnalysis}</p>
        </div>

        {analysisResult.macronutrientBalance && (
          <div style={styles.section}>
            <div style={styles.subSectionTitle}>Macronutrient Balance:</div>
            <p style={styles.paragraph}>{analysisResult.macronutrientBalance}</p>
          </div>
        )}
        {analysisResult.micronutrientHighlights && (
          <div style={styles.section}>
            <div style={styles.subSectionTitle}>Micronutrient Highlights:</div>
            <p style={styles.paragraph}>{analysisResult.micronutrientHighlights}</p>
          </div>
        )}
        {analysisResult.processingLevelAssessment && (
          <div style={styles.section}>
            <div style={styles.subSectionTitle}>Processing Level Assessment:</div>
            <p style={styles.paragraph}>{analysisResult.processingLevelAssessment}</p>
          </div>
        )}
        
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Dietary Suitability</div>
          <p style={styles.paragraph}>{analysisResult.dietarySuitability}</p>
        </div>

        {analysisResult.servingSizeContext && (
          <div style={styles.section}>
            <div style={styles.subSectionTitle}>Comments on Serving Size:</div>
            <p style={styles.paragraph}>{analysisResult.servingSizeContext}</p>
          </div>
        )}
      </div>
      <div style={styles.footer}>
        Generated on {new Date().toLocaleDateString()} by Swasth Bharat Advisor. <br/>
        Disclaimer: This AI analysis is for informational purposes only and not a substitute for professional medical or dietary advice.
      </div>
    </div>
  );
};
