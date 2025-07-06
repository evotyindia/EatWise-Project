
import type React from 'react';
import type { GetDetailedRecipeOutput, GetDetailedRecipeInput } from '@/ai/flows/get-detailed-recipe';

interface PrintableDetailedRecipeProps {
  recipe: GetDetailedRecipeOutput;
  userInput?: Pick<GetDetailedRecipeInput, 'availableIngredients' | 'diseaseConcerns' | 'householdComposition'>;
}

export const PrintableDetailedRecipe: React.FC<PrintableDetailedRecipeProps> = ({ recipe, userInput }) => {
  const styles: { [key: string]: React.CSSProperties } = {
    pdfContainer: { width: '800px', boxSizing: 'border-box', backgroundColor: '#ffffff', color: '#0f172a', fontFamily: 'Inter, Arial, sans-serif', fontSize: '12pt', lineHeight: '1.5' },
    header: { textAlign: 'center', paddingBottom: '15px', borderBottom: '2px solid #10b981', marginBottom: '20px' },
    logoText: { fontFamily: 'Poppins, Arial, sans-serif', fontSize: '24pt', fontWeight: 'bold', color: '#0f172a', margin: 0 },
    subLogoText: { fontSize: '12pt', color: '#0f172a', margin: 0 },
    recipeTitle: { fontFamily: 'Poppins, Arial, sans-serif', fontSize: '28pt', fontWeight: 'bold', textAlign: 'center', color: '#0f172a', marginBottom: '10px' },
    recipeDescription: { fontSize: '11pt', fontStyle: 'italic', color: '#555', textAlign: 'center', marginBottom: '20px' },
    section: { marginBottom: '25px' },
    sectionTitle: { fontFamily: 'Poppins, Arial, sans-serif', fontSize: '18pt', fontWeight: 'bold', color: '#0f172a', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginBottom: '15px' },
    infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' },
    infoItem: { textAlign: 'center' },
    infoLabel: { fontWeight: 'bold', display: 'block', fontSize: '10pt', color: '#555' },
    infoValue: { fontSize: '11pt' },
    columns: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
    ingredientList: { listStyleType: 'none', padding: 0 },
    ingredientItem: { marginBottom: '8px', borderBottom: '1px dotted #ccc', paddingBottom: '8px' },
    instructionList: { listStylePosition: 'outside', paddingLeft: '20px' },
    instructionItem: { marginBottom: '10px' },
    notes: { backgroundColor: '#e6fffa', borderLeft: '4px solid #10b981', padding: '15px', borderRadius: '5px', fontSize: '11pt' },
  };

  return (
    <div style={styles.pdfContainer}>
      <div style={styles.header}>
        <p style={styles.logoText}>EatWise <span style={styles.subLogoText}>India</span></p>
      </div>

      <h1 style={styles.recipeTitle}>{recipe.recipeTitle}</h1>
      {recipe.description && <p style={styles.recipeDescription}>{recipe.description}</p>}

      <div style={styles.infoGrid}>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Prep Time</span>
          <span style={styles.infoValue}>{recipe.prepTime || 'N/A'}</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Cook Time</span>
          <span style={styles.infoValue}>{recipe.cookTime || 'N/A'}</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Servings</span>
          <span style={styles.infoValue}>{recipe.servingsDescription}</span>
        </div>
      </div>
      
      {userInput && (
        <div style={{ ...styles.section, backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '8px', fontSize: '10pt' }}>
            <p><strong>Based on your inputs:</strong></p>
            <ul style={{paddingLeft: '20px'}}>
                <li><strong>Ingredients:</strong> {userInput.availableIngredients}</li>
                <li><strong>Household:</strong> {userInput.householdComposition.adults} Adults, {userInput.householdComposition.seniors} Seniors, {userInput.householdComposition.kids} Kids</li>
                {userInput.diseaseConcerns && userInput.diseaseConcerns.length > 0 && userInput.diseaseConcerns[0] !== 'none' && (
                    <li><strong>Health Concerns:</strong> {userInput.diseaseConcerns.join(', ').replace(/_/g, ' ')}</li>
                )}
            </ul>
        </div>
      )}

      <div style={styles.columns}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Ingredients</h2>
          <ul style={styles.ingredientList}>
            {recipe.adjustedIngredients.map((ing, i) => (
              <li key={i} style={styles.ingredientItem}>
                <strong>{ing.quantity}</strong> {ing.name}
                {ing.notes && <span style={{ fontSize: '10pt', color: '#777' }}> ({ing.notes})</span>}
              </li>
            ))}
          </ul>
        </div>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Instructions</h2>
          <ol style={styles.instructionList}>
            {recipe.instructions.map((step, i) => <li key={i} style={styles.instructionItem}>{step}</li>)}
          </ol>
        </div>
      </div>

      {recipe.healthNotes && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Health Notes</h2>
          <div style={styles.notes}>
            <p style={{ margin: 0 }}>{recipe.healthNotes}</p>
          </div>
        </div>
      )}

       {recipe.storageOrServingTips && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Storage & Serving Tips</h2>
          <p>{recipe.storageOrServingTips}</p>
        </div>
      )}
    </div>
  );
};
