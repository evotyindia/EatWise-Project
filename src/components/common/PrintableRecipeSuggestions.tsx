
import type React from 'react';
import type { GetRecipeSuggestionsOutput } from '@/ai/flows/recipe-suggestions';

interface PrintableRecipeSuggestionsProps {
  suggestions: GetRecipeSuggestionsOutput;
  ingredientsProvided: string;
}

export const PrintableRecipeSuggestions: React.FC<PrintableRecipeSuggestionsProps> = ({ suggestions, ingredientsProvided }) => {
  const styles: { [key: string]: React.CSSProperties } = {
    page: { padding: '15mm', fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '1.5', color: '#333333', width: '210mm', boxSizing: 'border-box', minHeight: '297mm', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' },
    pageContent: { flexGrow: 1 },
    companyHeader: { textAlign: 'right', fontSize: '10pt', color: '#555555', marginBottom: '10mm', borderBottom: '1px solid #eeeeee', paddingBottom: '5mm' },
    reportTitle: { textAlign: 'center', fontSize: '20pt', fontWeight: 'bold', color: '#004466', marginBottom: '12mm' },
    section: { marginBottom: '8mm', padding: '5mm', border: '1px solid #e0e0e0', borderRadius: '5px', backgroundColor: '#fdfdfd' },
    sectionTitle: { fontSize: '13pt', fontWeight: 'bold', color: '#004466', marginTop: '0', marginBottom: '6mm', borderBottom: '2px solid #005a87', paddingBottom: '3mm' },
    paragraph: { marginBottom: '4mm', textAlign: 'left' as 'left', whiteSpace: 'pre-wrap' as 'pre-wrap', paddingLeft: '2mm', paddingRight: '2mm' },
    list: { listStyleType: 'disc', paddingLeft: '8mm', margin: '0 0 5mm 0' },
    listItem: { marginBottom: '3mm', paddingLeft: '2mm' },
    recipeIdeaContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '5mm'},
    recipeIdea: { border: '1px solid #dddddd', padding: '4mm', borderRadius: '4px', backgroundColor: '#f9f9f9', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    recipeTitle: { fontSize: '10pt', fontWeight: 'bold', color: '#333333', marginBottom: '2mm', textAlign: 'center' as 'center'},
    footer: { marginTop: 'auto', paddingTop: '8mm', borderTop: '1px solid #cccccc', fontSize: '9pt', textAlign: 'center', color: '#777777', width: 'calc(100% - 30mm)', marginLeft: '15mm', marginRight: '15mm', boxSizing: 'border-box' }
  };
  
  const renderMealPlan = (text?: string) => {
    if (!text) return null;
    // Basic formatting for meal plan: preserve newlines and attempt to make bullet points look like list items
    return text.split('\n').map((line, index) => {
      if (line.trim().match(/^(\*|-)\s/)) {
        return <li key={index} style={{...styles.listItem, listStyleType: 'none', paddingLeft: '0', marginLeft: '5mm', textIndent: '-5mm' }}>{line.trim()}</li>;
      }
      return <p key={index} style={{...styles.paragraph, marginBottom: '2mm'}}>{line.trim()}</p>;
    });
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
            <div style={styles.recipeIdeaContainer}>
              {suggestions.suggestions.map((idea, index) => (
                <div key={index} style={styles.recipeIdea}>
                  <div style={styles.recipeTitle}>{index + 1}. {idea}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {suggestions.mealPlan && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Quick Meal Plan Suggestion</div>
            <div style={{paddingLeft: '2mm', paddingRight: '2mm'}}>{renderMealPlan(suggestions.mealPlan)}</div>
          </div>
        )}

        {(!suggestions.suggestions || suggestions.suggestions.length === 0) && !suggestions.mealPlan && (
          <p style={styles.paragraph}>No specific suggestions could be generated with the provided ingredients. Please try with a different set of ingredients.</p>
        )}
      </div>
      <div style={styles.footer}>
        Generated on {new Date().toLocaleDateString('en-GB')} by Swasth Bharat Advisor. <br/>
        Disclaimer: These are AI-generated suggestions. Adjust recipes to your taste and dietary needs.
      </div>
    </div>
  );
};
