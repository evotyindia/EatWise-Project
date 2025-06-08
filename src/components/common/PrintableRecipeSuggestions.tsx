
import type React from 'react';
import type { GetRecipeSuggestionsOutput } from '@/ai/flows/recipe-suggestions';

interface PrintableRecipeSuggestionsProps {
  suggestions: GetRecipeSuggestionsOutput;
  ingredientsProvided: string;
}

export const PrintableRecipeSuggestions: React.FC<PrintableRecipeSuggestionsProps> = ({ suggestions, ingredientsProvided }) => {
  const styles: { [key: string]: React.CSSProperties } = {
    page: { padding: '20mm', fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '1.4', color: '#333333', width: '210mm', boxSizing: 'border-box', minHeight: '297mm', display: 'flex', flexDirection: 'column' },
    pageContent: { flexGrow: 1 },
    companyHeader: { textAlign: 'right', fontSize: '9pt', color: '#777777', marginBottom: '15mm' },
    reportTitle: { textAlign: 'center', fontSize: '18pt', fontWeight: 'bold', color: '#005a87', marginBottom: '15mm', textTransform: 'uppercase' },
    section: { marginBottom: '10mm' },
    sectionTitle: { fontSize: '12pt', fontWeight: 'bold', color: '#005a87', marginTop: '0', marginBottom: '5mm', borderBottom: '1px solid #cccccc', paddingBottom: '2mm' },
    subSectionTitle: { fontSize: '11pt', fontWeight: 'bold', color: '#333333', marginTop: '5mm', marginBottom: '3mm' },
    paragraph: { marginBottom: '4mm', textAlign: 'justify' as 'justify', whiteSpace: 'pre-wrap' as 'pre-wrap' },
    list: { listStyleType: 'disc', paddingLeft: '5mm', margin: '0 0 5mm 0' },
    listItem: { marginBottom: '2mm' },
    recipeIdea: { border: '1px solid #dddddd', padding: '4mm', borderRadius: '4px', marginBottom: '4mm', backgroundColor: '#f9f9f9' },
    recipeTitle: { fontSize: '10pt', fontWeight: 'bold', color: '#333333', marginBottom: '2mm'},
    footer: { marginTop: 'auto', paddingTop: '5mm', borderTop: '1px solid #cccccc', fontSize: '8pt', textAlign: 'center', color: '#777777', width: '100%' }
  };

  return (
    <div style={styles.page}>
      <div style={styles.pageContent}>
        <div style={styles.companyHeader}>Swasth Bharat Advisor</div>
        <div style={styles.reportTitle}>AI Recipe Suggestions</div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Ingredients Provided</div>
          <p style={styles.paragraph}>{ingredientsProvided || 'N/A'}</p>
        </div>

        {suggestions.suggestions && suggestions.suggestions.length > 0 && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Meal Ideas</div>
            {suggestions.suggestions.map((idea, index) => (
              <div key={index} style={styles.recipeIdea}>
                <div style={styles.recipeTitle}>{index + 1}. {idea}</div>
              </div>
            ))}
          </div>
        )}

        {suggestions.mealPlan && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Quick Meal Plan</div>
            <p style={styles.paragraph}>{suggestions.mealPlan}</p>
          </div>
        )}

        {(!suggestions.suggestions || suggestions.suggestions.length === 0) && !suggestions.mealPlan && (
          <p style={styles.paragraph}>No specific suggestions could be generated with the provided ingredients. Please try with a different set of ingredients.</p>
        )}
      </div>
      <div style={styles.footer}>
        Generated on {new Date().toLocaleDateString()} by Swasth Bharat Advisor. <br/>
        Disclaimer: These are AI-generated suggestions. Adjust recipes to your taste and dietary needs.
      </div>
    </div>
  );
};
