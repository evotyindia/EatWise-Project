
import type React from 'react';
import type { AnalyzeNutritionOutput, AnalyzeNutritionInput } from '@/ai/flows/nutrition-analysis'; 

interface PrintableNutritionReportProps {
  analysisResult: AnalyzeNutritionOutput;
  userInput?: AnalyzeNutritionInput; 
}

export const PrintableNutritionReport: React.FC<PrintableNutritionReportProps> = ({ analysisResult, userInput }) => {
  const styles: { [key: string]: React.CSSProperties } = {
    pdfContainer: { width: '210mm', boxSizing: 'border-box', backgroundColor: '#ffffff', color: '#333333', fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '1.4' },
    
    aboutPage: { padding: '15mm', minHeight: '277mm', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center', borderBottom: '1px solid #e0e0e0', boxSizing: 'border-box' },
    logoContainer: { marginBottom: '10mm' },
    logoSvg: { width: '150px', height: 'auto' },
    aboutTitle: { fontSize: '22pt', fontWeight: 'bold', color: '#0f172a', marginBottom: '8mm' },
    aboutSection: { marginBottom: '6mm', maxWidth: '170mm', textAlign: 'justify' },
    aboutSectionTitle: { fontSize: '12pt', fontWeight: 'bold', color: '#1A202C', marginBottom: '3mm', textAlign: 'center' },
    aboutText: { fontSize: '10pt', color: '#4A5568', marginBottom: '4mm' },
    disclaimerText: { fontSize: '9pt', fontStyle: 'italic', color: '#718096', marginTop: 'auto', paddingTop: '8mm' },
    aboutPageFooter: { fontSize: '8pt', color: '#A0AEC0', marginTop: '5mm', borderTop: '1px solid #eee', paddingTop: '5mm', width: '100%' },

    reportPage: { padding: '15mm', boxSizing: 'border-box', minHeight: '277mm' },
    reportHeader: { textAlign: 'center', marginBottom: '10mm', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    reportHeaderLogo: { width: '100px', height: 'auto', marginBottom: '5mm'},
    reportTitle: { fontSize: '20pt', fontWeight: 'bold', color: '#0f172a', marginBottom: '2mm' },
    foodItemName: { fontSize: '14pt', fontWeight: 'normal', marginBottom: '8mm', color: '#2D3748' },

    section: { marginBottom: '7mm', padding: '5mm', border: '1px solid #E2E8F0', borderRadius: '6px', backgroundColor: '#F7FAFC' },
    sectionTitle: { fontSize: '14pt', fontWeight: 'bold', color: '#1A202C', marginTop: '0', marginBottom: '5mm', borderBottom: '2px solid #10b981', paddingBottom: '3mm' },
    subSectionTitle: { fontSize: '12pt', fontWeight: 'bold', color: '#2D3748', marginTop: '5mm', marginBottom: '4mm' }, // Increased marginBottom
    
    paragraph: { marginBottom: '4mm', textAlign: 'justify' as 'justify', whiteSpace: 'pre-wrap' as 'pre-wrap', paddingLeft: '2mm', paddingRight: '2mm', color: '#4A5568'},
    
    ratingBlock: { border: '1px solid #CBD5E0', padding: '4mm', borderRadius: '4px', marginBottom: '6mm', backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' },
    ratingTitle: { fontWeight: 'bold', marginBottom: '2mm', fontSize: '10pt', color: '#4A5568' },
    ratingValue: { fontSize: '10pt', color: '#1A202C', display: 'flex', alignItems: 'center' },
    star: { color: '#FBBF24', marginRight: '1px', fontSize: '12pt' },
    
    inputDataSection: { marginBottom: '7mm', padding: '5mm', border: '1px dashed #CBD5E0', borderRadius: '6px', backgroundColor: '#F0F8FF' },
    inputDataTitle: { fontSize: '12pt', fontWeight: 'bold', color: '#0f172a', marginBottom: '4mm' },
    inputDataGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5mm 7mm' },
    inputDataItem: { fontSize: '9pt', color: '#2D3748', paddingBottom: '1.5mm' },
    
    listContainer: { paddingLeft: '0', margin: '0' }, // Removed default padding
    listItem: { display: 'flex', alignItems: 'flex-start', marginBottom: '2mm', color: '#4A5568' },
    bullet: { marginRight: '2.5mm', minWidth: '2.5mm', textAlign: 'left', lineHeight: '1.4' },
    listItemText: { flex: 1, textAlign: 'justify' as 'justify' },
  };

  const renderStars = (rating: number, maxRating = 5) => {
    const stars = [];
    const roundedRating = Math.round(rating);
    for (let i = 0; i < maxRating; i++) {
      stars.push(<span key={i} style={{...styles.star, opacity: i < roundedRating ? 1 : 0.3}}>★</span>);
    }
    return <>{stars} ({rating}/{maxRating})</>;
  };

  const renderUserInput = () => {
    if (!userInput || Object.keys(userInput).filter(key => key !== 'nutritionDataUri' && key !== 'foodItemDescription' && userInput[key as keyof AnalyzeNutritionInput] !== undefined && userInput[key as keyof AnalyzeNutritionInput] !== null && String(userInput[key as keyof AnalyzeNutritionInput]).trim() !== "").length === 0) {
      if (userInput?.nutritionDataUri && userInput.nutritionDataUri === "Image Uploaded") { // Check for marker
        return (
          <div style={styles.inputDataSection}>
            <div style={styles.inputDataTitle}>Nutritional Data Source:</div>
            <div style={styles.inputDataItem}>Data primarily extracted from an uploaded image.</div>
            {userInput.servingSize && <div style={styles.inputDataItem}><strong>Serving Size (from input):</strong> {userInput.servingSize}</div>}
            {userInput.foodItemDescription && <div style={styles.inputDataItem}><strong>Food Item:</strong> {userInput.foodItemDescription}</div>}
          </div>
        );
      }
      return <div style={styles.inputDataSection}><div style={styles.inputDataTitle}>Input Data:</div><p style={styles.paragraph}>No specific manual data was entered for this analysis, or data was primarily from an image.</p></div>;
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
        {userInput.foodItemDescription && <div style={{...styles.inputDataItem, gridColumn: '1 / -1', marginBottom: '3mm', fontWeight: 'bold'}}>Food Item: {userInput.foodItemDescription}</div>}
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
         {userInput.nutritionDataUri === "Image Uploaded" && <div style={{...styles.inputDataItem, gridColumn: '1 / -1', marginTop: '4mm', fontStyle: 'italic', color: '#666'}}>Note: Analysis may also incorporate data extracted from an uploaded image.</div>}
      </div>
    );
  };
  
  const renderFormattedAnalysisText = (text?: string): JSX.Element[] | JSX.Element | null => {
    if (!text || text.trim().toLowerCase() === 'n/a' || text.trim() === '') {
      return (
         <div style={styles.listItem}>
           <span style={styles.bullet}>•</span>
           <span style={styles.listItemText}>Not specified / Not applicable.</span>
         </div>
      );
    }
    const elements: JSX.Element[] = [];
    text.split('\n').forEach((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine.match(/^(\*|-)\s/)) {
        elements.push(
          <div key={`item-${index}`} style={styles.listItem}>
            <span style={styles.bullet}>•</span>
            <span style={styles.listItemText}>{trimmedLine.substring(trimmedLine.indexOf(' ') + 1)}</span>
          </div>
        );
      } else if (trimmedLine) {
        // For non-bullet lines, render them as paragraphs but within the list context if needed
        elements.push(
          <div key={`para-${index}`} style={{...styles.listItem, alignItems: 'baseline' }}>
            <span style={{...styles.bullet, opacity: 0}}>{/* Invisible bullet for alignment */}•</span>
            <span style={{...styles.listItemText, textAlign: 'justify' as 'justify'}}>{trimmedLine}</span>
          </div>
        );
      }
    });
    return elements.length > 0 ? <>{elements}</> : null;
  };


  return (
    <div style={styles.pdfContainer}>
      <div style={styles.aboutPage} className="pdf-page">
        <div>
          <div style={styles.logoContainer}>
            <svg style={styles.logoSvg} viewBox="0 0 180 60" xmlns="http://www.w3.org/2000/svg">
              <rect width="180" height="60" rx="8" ry="8" fill="#E6FFFA" />
              <path d="M30 35 Q40 15 50 35 T70 35 M50 15 V35" stroke="#10b981" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
              <text x="80" y="32" fontFamily="Poppins, Arial, sans-serif" fontSize="20" fontWeight="bold" fill="#0f172a">EatWise</text>
              <text x="82" y="48" fontFamily="Inter, Arial, sans-serif" fontSize="10" fill="#0f172a">India</text>
            </svg>
          </div>
          <h1 style={styles.aboutTitle}>AI Nutrition Analysis by EatWise India</h1>
          
          <div style={styles.aboutSection}>
            <div style={styles.aboutSectionTitle}>Our Mission & Vision</div>
            <p style={styles.aboutText}>
              EatWise India is dedicated to empowering individuals across India to make informed and healthier food choices. 
              Our mission is to demystify nutrition labels, highlight the benefits of traditional Indian ingredients, 
              and provide accessible AI-powered tools to foster a greater understanding of food. We envision a healthier India, 
              where everyone has the knowledge to eat wisely and live well.
            </p>
          </div>

          <div style={styles.aboutSection}>
            <div style={styles.aboutSectionTitle}>How to Use This Report</div>
            <p style={styles.aboutText}>
              This report details the AI analysis of the nutritional data you provided, offering an assessment of macronutrients, 
              micronutrients, overall nutritional density, and dietary suitability. Use it to evaluate the nutritional balance of 
              the item and how it fits into your dietary goals. The analysis is based on the data you entered or was extracted from an uploaded image.
            </p>
          </div>
        </div>

        <div>
          <p style={styles.disclaimerText}>
            <strong>Disclaimer:</strong> This analysis is for informational purposes only and should not replace advice from a qualified healthcare professional or registered dietitian. 
            Individual nutritional needs vary. Consult an expert for personalized dietary guidance. The AI's analysis is based on the data provided and general nutritional knowledge. 
            EatWise India is not liable for any decisions made based on this report.
          </p>
          <div style={styles.aboutPageFooter}>EatWise India - Understanding Your Nutrition. Generated on: {new Date().toLocaleDateString('en-GB')}</div>
        </div>
      </div>
      
      <div style={styles.reportPage} className="pdf-page">
        <div style={styles.reportHeader}>
             <svg style={styles.reportHeaderLogo} viewBox="0 0 180 60" xmlns="http://www.w3.org/2000/svg">
                <rect width="180" height="60" rx="8" ry="8" fill="#E6FFFA" />
                <path d="M30 35 Q40 15 50 35 T70 35 M50 15 V35" stroke="#10b981" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                <text x="80" y="32" fontFamily="Poppins, Arial, sans-serif" fontSize="20" fontWeight="bold" fill="#0f172a">EatWise</text>
                <text x="82" y="48" fontFamily="Inter, Arial, sans-serif" fontSize="10" fill="#0f172a">India</text>
              </svg>
            <div style={styles.reportTitle}>AI Nutrition Analysis</div>
            {userInput?.foodItemDescription && <div style={styles.foodItemName}>For: {userInput.foodItemDescription}</div>}
        </div>
        
        {renderUserInput()}
        
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Overall Assessment</div>
          <div style={styles.ratingBlock}>
            <div style={styles.ratingTitle}>Nutrition Density Rating:</div>
            <div style={styles.ratingValue}>{renderStars(analysisResult.nutritionDensityRating)}</div>
          </div>
          <div style={styles.subSectionTitle}>Overall Analysis:</div>
          <div style={styles.listContainer}>{renderFormattedAnalysisText(analysisResult.overallAnalysis)}</div>
        </div>

        {analysisResult.macronutrientBalance && (
          <div style={styles.section}>
            <div style={styles.subSectionTitle}>Macronutrient Balance:</div>
            <div style={styles.listContainer}>{renderFormattedAnalysisText(analysisResult.macronutrientBalance)}</div>
          </div>
        )}
        {analysisResult.micronutrientHighlights && (
          <div style={styles.section}>
            <div style={styles.subSectionTitle}>Micronutrient Highlights:</div>
            <div style={styles.listContainer}>{renderFormattedAnalysisText(analysisResult.micronutrientHighlights)}</div>
          </div>
        )}
        {analysisResult.processingLevelAssessment && (
          <div style={styles.section}>
            <div style={styles.subSectionTitle}>Processing Level Assessment:</div>
            <div style={styles.listContainer}>{renderFormattedAnalysisText(analysisResult.processingLevelAssessment)}</div>
          </div>
        )}
        
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Dietary Suitability</div>
          <div style={styles.listContainer}>{renderFormattedAnalysisText(analysisResult.dietarySuitability)}</div>
        </div>

        {analysisResult.servingSizeContext && (
          <div style={styles.section}>
            <div style={styles.subSectionTitle}>Comments on Serving Size:</div>
            <div style={styles.listContainer}>{renderFormattedAnalysisText(analysisResult.servingSizeContext)}</div>
          </div>
        )}
      </div>
    </div>
  );
};

    