
import type React from 'react';
import type { GetRecipeSuggestionsOutput } from '@/ai/flows/recipe-suggestions';

interface PrintableRecipeSuggestionsProps {
  suggestions: GetRecipeSuggestionsOutput;
  ingredientsProvided: string;
}

export const PrintableRecipeSuggestions: React.FC<PrintableRecipeSuggestionsProps> = ({ suggestions, ingredientsProvided }) => {
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
    paragraph: { marginBottom: '4mm', textAlign: 'left' as 'left', whiteSpace: 'pre-wrap' as 'pre-wrap', paddingLeft: '2mm', paddingRight: '2mm' },
    list: { listStyleType: 'none', paddingLeft: '0', margin: '0 0 5mm 0' }, // Changed from disc for meal ideas
    listItem: { marginBottom: '3mm', paddingLeft: '2mm' }, // Base list item
    recipeIdea: { border: '1px solid #dddddd', padding: '10px', borderRadius: '8px', backgroundColor: '#f0f4f8', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '10px' },
    recipeTitle: { fontSize: '12pt', fontWeight: 'bold', color: '#005a87', marginBottom: '5px'},
    mealPlanListItem: { listStyleType: 'disc', marginLeft: '20px', marginBottom: '3px'} // Specific for meal plan bullets
  };
  
  const renderMealPlan = (text?: string) => {
    if (!text || text.trim().toLowerCase() === 'n/a') return <p style={styles.paragraph}>Not specified.</p>;
    // Split by newline, then check for bullet points
    return text.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine.match(/^(\*|-)\s/)) { // If it starts with a bullet
        return <li key={index} style={styles.mealPlanListItem}>{trimmedLine.substring(trimmedLine.indexOf(' ') + 1)}</li>;
      }
      if(trimmedLine) { // Regular paragraph line
        return <p key={index} style={{...styles.paragraph, marginBottom: '5px'}}>{trimmedLine}</p>;
      }
      return null;
    }).filter(Boolean); // Remove null entries from blank lines
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
          The recipe suggestions and meal plans provided in this report are AI-generated based on the ingredients you listed. 
          They are intended as inspiration and for informational purposes. Please adjust portion sizes and ingredients to your dietary needs and preferences. 
          Always ensure food safety and consult with a nutritionist for personalized dietary advice.
        </p>
        <div style={styles.aboutPageFooter}>EatWise India - Your Partner in Healthy Eating</div>
      </div>

      <div style={styles.reportPage}>
        <div style={styles.reportTitle}>AI Recipe Suggestions</div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Ingredients You Provided:</div>
          <p style={styles.paragraph}>{ingredientsProvided || 'N/A'}</p>
        </div>

        {suggestions.suggestions && suggestions.suggestions.length > 0 && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Meal Ideas</div>
            <ul style={styles.list}>
              {suggestions.suggestions.map((idea, index) => (
                <li key={index} style={styles.recipeIdea}>
                  <div style={styles.recipeTitle}>{index + 1}. {idea}</div>
                  {/* Placeholder for potential brief description if AI provides it later */}
                </li>
              ))}
            </ul>
          </div>
        )}

        {suggestions.mealPlan && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Quick Meal Plan Suggestion</div>
            <div style={{paddingLeft: '2mm', paddingRight: '2mm'}}>
                 {Array.isArray(renderMealPlan(suggestions.mealPlan)) ? <ul>{renderMealPlan(suggestions.mealPlan)}</ul> : renderMealPlan(suggestions.mealPlan)}
            </div>
          </div>
        )}

        {(!suggestions.suggestions || suggestions.suggestions.length === 0) && !suggestions.mealPlan && (
          <div style={styles.section}>
            <p style={styles.paragraph}>No specific suggestions could be generated with the provided ingredients. Please try with a different or more extensive set of ingredients.</p>
          </div>
        )}
      </div>
    </div>
  );
};
