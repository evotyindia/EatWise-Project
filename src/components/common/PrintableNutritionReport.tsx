
import type React from 'react';
import type { AnalyzeNutritionOutput, AnalyzeNutritionInput } from '@/ai/flows/nutrition-analysis'; 

interface PrintableNutritionReportProps {
  analysisResult: AnalyzeNutritionOutput;
  userInput?: AnalyzeNutritionInput; 
}

export const PrintableNutritionReport: React.FC<PrintableNutritionReportProps> = ({ analysisResult, userInput }) => {
  const styles: { [key: string]: React.CSSProperties } = {
    pdfContainer: { width: '210mm', boxSizing: 'border-box', backgroundColor: '#ffffff', color: '#333333', fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '1.4' },
    aboutPage: { padding: '15mm', minHeight: '277mm', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', borderBottom: '1px solid #e0e0e0' },
    logoPlaceholder: { marginBottom: '20px' },
    aboutTitle: { fontSize: '24pt', fontWeight: 'bold', color: '#003366', marginBottom: '15px' },
    aboutText: { fontSize: '11pt', marginBottom: '10px', maxWidth: '170mm', textAlign: 'justify' },
    aboutPageFooter: { fontSize: '9pt', color: '#777777', marginTop: 'auto', paddingTop: '10mm' },

    reportPage: { padding: '15mm' },
    reportTitle: { textAlign: 'center', fontSize: '20pt', fontWeight: 'bold', color: '#003366', marginBottom: '10mm' },
    section: { marginBottom: '8mm', padding: '5mm', border: '1px solid #e0e0e0', borderRadius: '5px', backgroundColor: '#f9f9f9' },
    sectionTitle: { fontSize: '14pt', fontWeight: 'bold', color: '#004466', marginTop: '0', marginBottom: '6mm', borderBottom: '2px solid #005a87', paddingBottom: '3mm' },
    subSectionTitle: { fontSize: '12pt', fontWeight: 'bold', color: '#333333', marginTop: '6mm', marginBottom: '4mm' },
    paragraph: { marginBottom: '4mm', textAlign: 'justify' as 'justify', whiteSpace: 'pre-wrap' as 'pre-wrap', paddingLeft: '2mm', paddingRight: '2mm' },
    ratingBlock: { border: '1px solid #cccccc', padding: '5mm', borderRadius: '4px', marginBottom: '6mm', backgroundColor: '#f7f7f7', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    ratingTitle: { fontWeight: 'bold', marginBottom: '3mm', fontSize: '11pt', color: '#333333' },
    ratingValue: { fontSize: '10pt', color: '#111111' },
    inputDataSection: { marginBottom: '8mm', padding: '6mm', border: '1px dashed #cccccc', borderRadius: '5px', backgroundColor: '#f0f4f8' },
    inputDataTitle: { fontSize: '12pt', fontWeight: 'bold', color: '#004466', marginBottom: '4mm' },
    inputDataGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3mm 8mm' },
    inputDataItem: { fontSize: '10pt', color: '#333333', paddingBottom: '2mm' },
    list: { listStyleType: 'disc', paddingLeft: '8mm', margin: '0 0 4mm 0' },
    listItem: { marginBottom: '2.5mm', paddingLeft: '2mm' },
  };

  const renderUserInput = () => {
    if (!userInput || Object.keys(userInput).filter(key => key !== 'nutritionDataUri' && userInput[key as keyof AnalyzeNutritionInput] !== undefined && userInput[key as keyof AnalyzeNutritionInput] !== null && userInput[key as keyof AnalyzeNutritionInput] !== "").length === 0) {
      if (userInput?.nutritionDataUri) {
        return (
          <div style={styles.inputDataSection}>
            <div style={styles.inputDataTitle}>Nutritional Data Source:</div>
            <div style={styles.inputDataItem}>Data primarily extracted from an uploaded image.</div>
            {userInput.servingSize && <div style={styles.inputDataItem}><strong>Serving Size (from input):</strong> {userInput.servingSize}</div>}
          </div>
        );
      }
      return null;
    }
    
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
        <div style={styles.inputDataTitle}>Provided Nutritional Data:</div>
        {userInput.servingSize && <div style={{...styles.inputDataItem, gridColumn: '1 / -1', marginBottom: '3mm', fontWeight: 'bold'}}>Serving Size: {userInput.servingSize}</div>}
        <div style={styles.inputDataGrid}>
          {nutrients.map(key => {
            const value = userInput[key];
            if (value !== undefined && value !== null && String(value).trim() !== "") {
              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              return <div style={styles.inputDataItem} key={key}><strong style={{color: '#555'}}>{label}:</strong> {String(value)} {unitMap[key] || ''}</div>;
            }
            return null;
          }).filter(Boolean)}
        </div>
         {userInput.nutritionDataUri && <div style={{...styles.inputDataItem, marginTop: '4mm', fontStyle: 'italic', color: '#666'}}><br/>Note: Analysis may also incorporate data extracted from an uploaded image.</div>}
      </div>
    );
  };
  
  const renderFormattedAnalysis = (text?: string): JSX.Element | JSX.Element[] | null => {
    if (!text || text.trim().toLowerCase() === 'n/a' || text.trim() === '') {
      return <p style={styles.paragraph}>Not specified / Applicable.</p>;
    }
    return text.split(/\n\s*\n|\s*[\*\-]\s*/gm).filter(line => line.trim() !== '').map((line, index, arr) => {
        // Check if the original line started with a bullet point by looking ahead or checking context
        const originalLineStartsWithBullet = text.includes(`* ${line.trim()}`) || text.includes(`- ${line.trim()}`);

        if (originalLineStartsWithBullet && arr.length > 1) { // Render as list item if it was a bullet and there are multiple items
             return <li key={index} style={styles.listItem}>{line.trim()}</li>;
        }
        return <p key={index} style={{ ...styles.paragraph, ...(arr.length === 1 && originalLineStartsWithBullet && { listStyleType: 'disc', marginLeft: '20px' }) }}>{line.trim()}</p>;
    });
};

  return (
    <div style={styles.pdfContainer}>
      <div style={styles.aboutPage}>
        <div style={styles.logoPlaceholder}>
          <svg width="180" height="60" viewBox="0 0 180 60" xmlns="http://www.w3.org/2000/svg">
            <rect width="180" height="60" rx="5" ry="5" fill="#e8f5e9" />
            <path d="M30 30 Q45 10 60 30 T90 30" stroke="#10b981" strokeWidth="3" fill="none" />
            <text x="100" y="35" fontFamily="Poppins, Arial, sans-serif" fontSize="20" fontWeight="bold" fill="#0f172a">EatWise</text>
            <text x="102" y="50" fontFamily="Inter, Arial, sans-serif" fontSize="10" fill="#0f172a">India</text>
          </svg>
        </div>
        <h1 style={styles.aboutTitle}>About EatWise India</h1>
        <p style={styles.aboutText}>
          EatWise India is dedicated to empowering individuals across India to make informed and healthier food choices. 
          Our mission is to demystify nutrition labels, highlight the benefits of traditional Indian ingredients, 
          and provide accessible AI-powered tools to foster a greater understanding of food.
        </p>
        <p style={styles.aboutText}>
          This report is generated by our advanced AI system to offer insights and suggestions based on the information you provide.
          It is intended for informational purposes only and should not be considered a substitute for professional medical or nutritional advice. 
          Always consult with a qualified healthcare provider or nutritionist for any health concerns or before making any significant dietary changes.
        </p>
        <div style={styles.aboutPageFooter}>EatWise India - Your Partner in Healthy Eating</div>
      </div>

      <div style={styles.reportPage}>
        <div style={styles.reportTitle}>AI Nutrition Analysis</div>
        
        {renderUserInput()}
        
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Overall Assessment</div>
          <div style={styles.ratingBlock}>
            <div style={styles.ratingTitle}>Nutrition Density Rating:</div>
            <div style={styles.ratingValue}>{analysisResult.nutritionDensityRating} / 5 stars</div>
          </div>
          <div style={styles.subSectionTitle}>Overall Analysis:</div>
          <div>{renderFormattedAnalysis(analysisResult.overallAnalysis)}</div>
        </div>

        {analysisResult.macronutrientBalance && (
          <div style={styles.section}>
            <div style={styles.subSectionTitle}>Macronutrient Balance:</div>
            <div>{renderFormattedAnalysis(analysisResult.macronutrientBalance)}</div>
          </div>
        )}
        {analysisResult.micronutrientHighlights && (
          <div style={styles.section}>
            <div style={styles.subSectionTitle}>Micronutrient Highlights:</div>
            <div>{renderFormattedAnalysis(analysisResult.micronutrientHighlights)}</div>
          </div>
        )}
        {analysisResult.processingLevelAssessment && (
          <div style={styles.section}>
            <div style={styles.subSectionTitle}>Processing Level Assessment:</div>
            <div>{renderFormattedAnalysis(analysisResult.processingLevelAssessment)}</div>
          </div>
        )}
        
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Dietary Suitability</div>
          <div>{renderFormattedAnalysis(analysisResult.dietarySuitability)}</div>
        </div>

        {analysisResult.servingSizeContext && (
          <div style={styles.section}>
            <div style={styles.subSectionTitle}>Comments on Serving Size:</div>
            <div>{renderFormattedAnalysis(analysisResult.servingSizeContext)}</div>
          </div>
        )}
      </div>
    </div>
  );
};
