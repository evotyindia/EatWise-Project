
import type React from 'react';
import type { AnalyzeNutritionOutput, AnalyzeNutritionInput } from '@/ai/flows/nutrition-analysis'; 

interface PrintableNutritionReportProps {
  analysisResult: AnalyzeNutritionOutput;
  userInput?: AnalyzeNutritionInput; 
}

export const PrintableNutritionReport: React.FC<PrintableNutritionReportProps> = ({ analysisResult, userInput }) => {
  const styles: { [key: string]: React.CSSProperties } = {
    page: { padding: '15mm', fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '1.5', color: '#333333', width: '210mm', boxSizing: 'border-box', minHeight: '297mm', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' },
    pageContent: { flexGrow: 1 },
    companyHeader: { textAlign: 'right', fontSize: '10pt', color: '#555555', marginBottom: '10mm', borderBottom: '1px solid #eeeeee', paddingBottom: '5mm' },
    reportTitle: { textAlign: 'center', fontSize: '20pt', fontWeight: 'bold', color: '#004466', marginBottom: '12mm' },
    section: { marginBottom: '8mm', padding: '5mm', border: '1px solid #e0e0e0', borderRadius: '5px', backgroundColor: '#fdfdfd' },
    sectionTitle: { fontSize: '13pt', fontWeight: 'bold', color: '#004466', marginTop: '0', marginBottom: '6mm', borderBottom: '2px solid #005a87', paddingBottom: '3mm' },
    subSectionTitle: { fontSize: '11pt', fontWeight: 'bold', color: '#333333', marginTop: '6mm', marginBottom: '4mm' },
    paragraph: { marginBottom: '4mm', textAlign: 'justify' as 'justify', whiteSpace: 'pre-wrap' as 'pre-wrap', paddingLeft: '2mm', paddingRight: '2mm' },
    ratingBlock: { border: '1px solid #cccccc', padding: '5mm', borderRadius: '4px', marginBottom: '6mm', backgroundColor: '#f9f9f9', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    ratingTitle: { fontWeight: 'bold', marginBottom: '3mm', fontSize: '10pt', color: '#333333' },
    ratingValue: { fontSize: '10pt', color: '#111111' },
    inputDataSection: { marginBottom: '8mm', padding: '6mm', border: '1px dashed #cccccc', borderRadius: '5px', backgroundColor: '#f7f7f7' },
    inputDataTitle: { fontSize: '11pt', fontWeight: 'bold', color: '#444444', marginBottom: '4mm' },
    inputDataGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3mm 6mm' },
    inputDataItem: { fontSize: '9pt', color: '#333333', paddingBottom: '1mm' },
    footer: { marginTop: 'auto', paddingTop: '8mm', borderTop: '1px solid #cccccc', fontSize: '9pt', textAlign: 'center', color: '#777777', width: 'calc(100% - 30mm)', marginLeft: '15mm', marginRight: '15mm', boxSizing: 'border-box' }
  };

  const renderUserInput = () => {
    if (!userInput || Object.keys(userInput).filter(key => key !== 'nutritionDataUri' && userInput[key as keyof AnalyzeNutritionInput] !== undefined && userInput[key as keyof AnalyzeNutritionInput] !== null && userInput[key as keyof AnalyzeNutritionInput] !== "").length === 0) {
      if (userInput?.nutritionDataUri) {
        return (
          <div style={styles.inputDataSection}>
            <div style={styles.inputDataTitle}>Nutritional Data Provided:</div>
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
        <div style={styles.inputDataTitle}>Nutritional Data Provided:</div>
        {userInput.servingSize && <div style={{...styles.inputDataItem, gridColumn: '1 / -1', marginBottom: '3mm'}}><strong>Serving Size:</strong> {userInput.servingSize}</div>}
        <div style={styles.inputDataGrid}>
          {nutrients.map(key => {
            const value = userInput[key];
            if (value !== undefined && value !== null && value !== "") {
              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              return <div style={styles.inputDataItem} key={key}><strong>{label}:</strong> {String(value)} {unitMap[key] || ''}</div>;
            }
            return null;
          }).filter(Boolean)}
        </div>
         {userInput.nutritionDataUri && <div style={{...styles.inputDataItem, marginTop: '4mm'}}><br/><strong>Note:</strong> Analysis may also include data extracted from an uploaded image.</div>}
      </div>
    );
  };
  
  const renderAnalysisParagraph = (content?: string) => {
    if (!content) return <p style={styles.paragraph}>N/A</p>;
    // Split by newline for paragraphs, then by bullet points for lists within paragraphs
    return content.split('\n').map((paragraph, pIndex) => {
      if (paragraph.trim().match(/^[\*\-]\s/)) { // Looks like a list
        return (
          <ul key={pIndex} style={{...styles.list, paddingLeft: '10mm', marginBottom: '3mm'}}>
            {paragraph.split(/\s*[\*\-]\s*/g).filter(s => s.trim()).map((item, iIndex) => (
              <li key={iIndex} style={{marginBottom: '1mm'}}>{item.trim()}</li>
            ))}
          </ul>
        );
      }
      return <p key={pIndex} style={styles.paragraph}>{paragraph.trim()}</p>;
    });
  };
  const stylesList = { listStyleType: 'disc', paddingLeft: '6mm', margin: '0 0 4mm 0' };
  const stylesListItem = { marginBottom: '2.5mm', paddingLeft: '2mm' };

  const renderFormattedAnalysis = (text?: string): JSX.Element | JSX.Element[] | null => {
    if (!text || text.trim().toLowerCase() === 'n/a' || text.trim() === '') {
      return <p style={styles.paragraph}>Not specified / Applicable.</p>;
    }
    // Split into paragraphs by double newlines, then handle bullets within each paragraph
    return text.split(/\n\s*\n/).map((paragraphBlock, blockIndex) => {
      const lines = paragraphBlock.split('\n').filter(line => line.trim() !== '');
      const listItems = lines.filter(line => line.trim().match(/^(\*|-)\s+/));
      const regularLines = lines.filter(line => !line.trim().match(/^(\*|-)\s+/));

      return (
        <div key={blockIndex} style={{ marginBottom: '3mm' }}>
          {regularLines.map((line, lineIndex) => (
            <p key={`p-${lineIndex}`} style={styles.paragraph}>{line.trim()}</p>
          ))}
          {listItems.length > 0 && (
            <ul style={stylesList}>
              {listItems.map((item, itemIndex) => (
                <li key={`li-${itemIndex}`} style={stylesListItem}>
                  {item.trim().replace(/^(\*|-)\s*/, '')}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    });
  };


  return (
    <div style={styles.page}>
      <div style={styles.pageContent}>
        <div style={styles.companyHeader}>EatWise India</div>
        <div style={styles.reportTitle}>AI Nutrition Analysis</div>

        {renderUserInput()}
        
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Overall Assessment</div>
          <div style={styles.ratingBlock}>
            <div style={styles.ratingTitle}>Nutrition Density Rating:</div>
            <div style={styles.ratingValue}>{analysisResult.nutritionDensityRating} / 5 stars</div>
          </div>
          <div style={styles.subSectionTitle}>Overall Analysis:</div>
          {renderFormattedAnalysis(analysisResult.overallAnalysis)}
        </div>

        {analysisResult.macronutrientBalance && (
          <div style={styles.section}>
            <div style={styles.subSectionTitle}>Macronutrient Balance:</div>
            {renderFormattedAnalysis(analysisResult.macronutrientBalance)}
          </div>
        )}
        {analysisResult.micronutrientHighlights && (
          <div style={styles.section}>
            <div style={styles.subSectionTitle}>Micronutrient Highlights:</div>
            {renderFormattedAnalysis(analysisResult.micronutrientHighlights)}
          </div>
        )}
        {analysisResult.processingLevelAssessment && (
          <div style={styles.section}>
            <div style={styles.subSectionTitle}>Processing Level Assessment:</div>
            {renderFormattedAnalysis(analysisResult.processingLevelAssessment)}
          </div>
        )}
        
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Dietary Suitability</div>
          {renderFormattedAnalysis(analysisResult.dietarySuitability)}
        </div>

        {analysisResult.servingSizeContext && (
          <div style={styles.section}>
            <div style={styles.subSectionTitle}>Comments on Serving Size:</div>
            {renderFormattedAnalysis(analysisResult.servingSizeContext)}
          </div>
        )}
      </div>
      <div style={styles.footer}>
        Generated on {new Date().toLocaleDateString('en-GB')} by EatWise India. <br/>
        Disclaimer: This AI analysis is for informational purposes only and not a substitute for professional medical or dietary advice.
      </div>
    </div>
  );
};
