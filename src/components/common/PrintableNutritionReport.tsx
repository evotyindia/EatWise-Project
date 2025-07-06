
import type React from 'react';
import type { AnalyzeNutritionOutput, AnalyzeNutritionInput } from '@/ai/flows/nutrition-analysis'; 

interface PrintableNutritionReportProps {
  analysisResult: AnalyzeNutritionOutput;
  userInput?: AnalyzeNutritionInput; 
}

export const PrintableNutritionReport: React.FC<PrintableNutritionReportProps> = ({ analysisResult, userInput }) => {
  const styles: { [key: string]: React.CSSProperties } = {
    pdfContainer: { width: '800px', boxSizing: 'border-box', backgroundColor: '#ffffff', color: '#0f172a', fontFamily: 'Inter, Arial, sans-serif', fontSize: '12pt', lineHeight: '1.5' },
    header: { textAlign: 'center', paddingBottom: '15px', borderBottom: '2px solid #10b981', marginBottom: '20px' },
    logoText: { fontFamily: 'Poppins, Arial, sans-serif', fontSize: '24pt', fontWeight: 'bold', color: '#0f172a', margin: 0 },
    subLogoText: { fontSize: '12pt', color: '#0f172a', margin: 0 },
    reportTitle: { fontFamily: 'Poppins, Arial, sans-serif', fontSize: '28pt', fontWeight: 'bold', textAlign: 'center', color: '#0f172a', marginBottom: '5px' },
    foodItemName: { fontSize: '14pt', textAlign: 'center', color: '#555', marginBottom: '20px' },
    section: { marginBottom: '25px' },
    sectionTitle: { fontFamily: 'Poppins, Arial, sans-serif', fontSize: '18pt', fontWeight: 'bold', color: '#0f172a', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginBottom: '15px' },
    ratingBox: { backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px' },
    ratingLabel: { fontWeight: 'bold', display: 'block', fontSize: '12pt', color: '#555' },
    ratingValue: { fontSize: '20pt', fontWeight: 'bold' },
    analysisBox: { backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' },
    list: { listStyleType: "'\\2022'", paddingLeft: '20px' },
    listItem: { marginBottom: '8px' },
    userInputSection: { backgroundColor: '#ebf8ff', border: '1px dashed #90cdf4', padding: '15px', borderRadius: '8px', fontSize: '10pt' },
    inputDataItem: { paddingBottom: '3px' },
    inputDataGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 20px' },
  };
  
  const renderListItems = (text?: string): JSX.Element[] | JSX.Element => {
    if (!text || text.trim().toLowerCase() === 'n/a' || text.trim() === '') {
      return <li>Not specified / Not applicable.</li>;
    }
    const items = text.split(/\n/g).map(s => s.trim().replace(/^(\*|-)\s*/, '')).filter(s => s.trim());
    return items.map((item, index) => (
      <li key={index} style={styles.listItem}>{item.trim()}</li>
    ));
  };
  
  const renderUserInput = () => {
    if (!userInput) return null;

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
    const hasManualData = nutrients.some(key => userInput[key] !== undefined && userInput[key] !== null && String(userInput[key]).trim() !== "");

    return (
      <div style={styles.userInputSection}>
        <p><strong>Based on your inputs:</strong></p>
        {userInput.foodItemDescription && <p style={styles.inputDataItem}><strong>Food Item:</strong> {userInput.foodItemDescription}</p>}
        {userInput.servingSize && <p style={styles.inputDataItem}><strong>Serving Size:</strong> {userInput.servingSize}</p>}
        {userInput.nutritionDataUri === "Image Uploaded" && <p style={styles.inputDataItem}><strong>Data Source:</strong> Image Upload + Manual Inputs</p>}
        {hasManualData && (
          <div style={{marginTop: '10px'}}>
            <strong>Manual Values Provided:</strong>
            <div style={styles.inputDataGrid}>
              {nutrients.map(key => {
                const value = userInput[key];
                if (value !== undefined && value !== null && String(value).trim() !== "") {
                  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  return <div style={styles.inputDataItem} key={key}><strong>{label}:</strong> {String(value)} {unitMap[key] || ''}</div>;
                }
                return null;
              }).filter(Boolean)}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={styles.pdfContainer}>
      <div style={styles.header}>
        <p style={styles.logoText}>EatWise <span style={styles.subLogoText}>India</span></p>
      </div>
      
      <h1 style={styles.reportTitle}>AI Nutrition Analysis</h1>
      {userInput?.foodItemDescription && <p style={styles.foodItemName}>For: {userInput.foodItemDescription}</p>}
      
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Key Metrics</h2>
        <div style={styles.ratingBox}>
            <span style={styles.ratingLabel}>Nutrition Density Rating</span>
            <span style={styles.ratingValue}>{analysisResult.nutritionDensityRating} / 5</span>
        </div>
      </div>
      
      {userInput && (
        <div style={styles.section}>
            {renderUserInput()}
        </div>
      )}
      
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Overall Analysis</h2>
        <div style={styles.analysisBox}>
          <ul style={styles.list}>{renderListItems(analysisResult.overallAnalysis)}</ul>
        </div>
      </div>
      
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Dietary Suitability</h2>
        <div style={styles.analysisBox}>
          <ul style={styles.list}>{renderListItems(analysisResult.dietarySuitability)}</ul>
        </div>
      </div>
    </div>
  );
};
