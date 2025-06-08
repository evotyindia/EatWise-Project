
import type React from 'react';
import type { GetDetailedRecipeOutput, GetDetailedRecipeInput } from '@/ai/flows/get-detailed-recipe';
import type { ChatMessage } from '@/ai/flows/context-aware-ai-chat'; // Ensure this path is correct

interface PrintableDetailedRecipeProps {
  recipe: GetDetailedRecipeOutput;
  userInput: Pick<GetDetailedRecipeInput, 'availableIngredients' | 'diseaseConcerns' | 'householdComposition'>;
  chatHistory?: ChatMessage[];
}

export const PrintableDetailedRecipe: React.FC<PrintableDetailedRecipeProps> = ({ recipe, userInput, chatHistory }) => {
  const styles: { [key: string]: React.CSSProperties } = {
    pdfContainer: { width: '210mm', boxSizing: 'border-box', backgroundColor: '#ffffff', color: '#333333', fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '1.4' },
    
    // About Page Styles
    aboutPage: { padding: '15mm', minHeight: '277mm', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', borderBottom: '1px solid #e0e0e0' },
    logoContainer: { marginBottom: '20px' },
    logoSvg: { width: '150px', height: 'auto' },
    aboutTitle: { fontSize: '22pt', fontWeight: 'bold', color: '#0f172a', marginBottom: '10mm' },
    aboutText: { fontSize: '10pt', marginBottom: '5mm', maxWidth: '170mm', textAlign: 'justify', color: '#4A5568' },
    disclaimerText: { fontSize: '9pt', fontStyle: 'italic', marginTop: '8mm', maxWidth: '170mm', textAlign: 'center', color: '#718096' },
    aboutPageFooter: { fontSize: '8pt', color: '#A0AEC0', marginTop: 'auto', paddingTop: '10mm' },

    // Report Page Styles
    reportPage: { padding: '15mm', boxSizing: 'border-box' },
    reportHeader: { textAlign: 'center', marginBottom: '10mm' },
    recipeMainTitle: { fontSize: '20pt', fontWeight: 'bold', color: '#0f172a', marginBottom: '2mm' },
    recipeDescription: { fontSize: '10pt', fontStyle: 'italic', color: '#4A5568', marginBottom: '8mm', maxWidth: '180mm', margin: '0 auto 8mm auto' },

    section: { marginBottom: '7mm', padding: '5mm', border: '1px solid #E2E8F0', borderRadius: '6px', backgroundColor: '#F7FAFC' },
    sectionTitle: { fontSize: '14pt', fontWeight: 'bold', color: '#1A202C', marginTop: '0', marginBottom: '5mm', borderBottom: '2px solid #10b981', paddingBottom: '3mm' },
    
    infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '5mm', marginBottom: '7mm', fontSize: '9pt' },
    infoItem: { padding: '3mm', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '4px' },
    infoLabel: { fontWeight: 'bold', color: '#4A5568', display: 'block', marginBottom: '1mm' },
    infoValue: { color: '#1A202C'},

    ingredientList: { listStyleType: 'none', paddingLeft: '0', margin: '0 0 3mm 0' },
    ingredientItem: { marginBottom: '2mm', padding: '2mm 0', borderBottom: '1px dotted #E2E8F0' },
    ingredientName: { fontWeight: 'bold' },
    ingredientNotes: { fontSize: '8.5pt', color: '#718096', marginLeft: '5px'},
    
    instructionList: { listStyleType: 'decimal', paddingLeft: '5mm', margin: '0 0 3mm 0' },
    instructionItem: { marginBottom: '3mm', paddingLeft: '2mm', color: '#2D3748' },
    
    healthNotesSection: { marginTop: '5mm', padding: '4mm', backgroundColor: '#E6FFFA', borderLeft: '3px solid #10b981', borderRadius: '4px' }, // Accent bg
    healthNotesText: { fontSize: '9.5pt', color: '#2D3748', whiteSpace: 'pre-line' as 'pre-line'},

    userInputSection: { marginBottom: '7mm', padding: '5mm', border: '1px dashed #CBD5E0', borderRadius: '6px', backgroundColor: '#F0F8FF' },
    userInputTitle: { fontSize: '11pt', fontWeight: 'bold', color: '#0f172a', marginBottom: '3mm' },
    userInputText: { fontSize: '9pt', color: '#2D3748' },
    
    chatContainer: { marginTop: '7mm', borderTop: '1px solid #E2E8F0', paddingTop: '5mm' },
    chatMessage: { marginBottom: '3mm', padding: '3mm', borderRadius: '4px', border: '1px solid #F0F0F0', backgroundColor: '#FFFFFF' },
    chatUser: { fontWeight: 'bold', color: '#0f172a', display: 'block', marginBottom: '1mm', fontSize: '9pt' },
    chatAssistant: { color: '#2D3748', display: 'block', fontSize: '9pt' },
  };

  return (
    <div style={styles.pdfContainer}>
      {/* About Page */}
      <div style={styles.aboutPage} className="pdf-page">
        <div style={styles.logoContainer}>
          <svg style={styles.logoSvg} viewBox="0 0 180 60" xmlns="http://www.w3.org/2000/svg">
            <rect width="180" height="60" rx="8" ry="8" fill="#E6FFFA" />
            <path d="M30 35 Q40 15 50 35 T70 35 M50 15 V35" stroke="#10b981" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <text x="80" y="32" fontFamily="Poppins, Arial, sans-serif" fontSize="20" fontWeight="bold" fill="#0f172a">EatWise</text>
            <text x="82" y="48" fontFamily="Inter, Arial, sans-serif" fontSize="10" fill="#0f172a">India</text>
          </svg>
        </div>
        <h1 style={styles.aboutTitle}>AI Recipe by EatWise India</h1>
        <p style={styles.aboutText}>
          Welcome to EatWise India! We're passionate about helping you discover healthy and delicious Indian recipes tailored to your needs. 
          Our AI chef crafts recipes based on the ingredients you have and your dietary preferences.
        </p>
        <p style={styles.aboutText}>
          This document contains a detailed recipe generated by our AI. We strive to provide accurate and helpful cooking guidance.
        </p>
        <p style={styles.disclaimerText}>
          <strong>Disclaimer:</strong> This AI-generated recipe is for informational and inspirational purposes only. Nutritional information can vary. 
          Always ensure ingredients are suitable for your specific health conditions and allergies. Consult a healthcare professional or registered dietitian for personalized dietary advice. 
          Adjust seasoning and cooking times to your preference.
        </p>
        <div style={styles.aboutPageFooter}>EatWise India - Cooking Healthy, Made Easy. Generated on: {new Date().toLocaleDateString('en-GB')}</div>
      </div>

      {/* Recipe Content Page */}
      <div style={styles.reportPage} className="pdf-page">
        <div style={styles.reportHeader}>
             <div style={styles.logoContainer}>
              <svg style={{...styles.logoSvg, width: '100px'}} viewBox="0 0 180 60" xmlns="http://www.w3.org/2000/svg">
                <rect width="180" height="60" rx="8" ry="8" fill="#E6FFFA" />
                <path d="M30 35 Q40 15 50 35 T70 35 M50 15 V35" stroke="#10b981" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                <text x="80" y="32" fontFamily="Poppins, Arial, sans-serif" fontSize="20" fontWeight="bold" fill="#0f172a">EatWise</text>
                <text x="82" y="48" fontFamily="Inter, Arial, sans-serif" fontSize="10" fill="#0f172a">India</text>
              </svg>
            </div>
          <div style={styles.recipeMainTitle}>{recipe.recipeTitle}</div>
          {recipe.description && <div style={styles.recipeDescription}>{recipe.description}</div>}
        </div>

        <div style={styles.infoGrid}>
          {recipe.prepTime && <div style={styles.infoItem}><span style={styles.infoLabel}>Prep Time:</span> <span style={styles.infoValue}>{recipe.prepTime}</span></div>}
          {recipe.cookTime && <div style={styles.infoItem}><span style={styles.infoLabel}>Cook Time:</span> <span style={styles.infoValue}>{recipe.cookTime}</span></div>}
          {recipe.servingsDescription && <div style={styles.infoItem}><span style={styles.infoLabel}>Serves:</span> <span style={styles.infoValue}>{recipe.servingsDescription}</span></div>}
        </div>

        <div style={styles.userInputSection}>
            <div style={styles.userInputTitle}>Based on Your Inputs:</div>
            <p style={styles.userInputText}><strong>Available Ingredients:</strong> {userInput.availableIngredients}</p>
            <p style={styles.userInputText}><strong>Household:</strong> {userInput.householdComposition.adults} Adult(s), {userInput.householdComposition.seniors} Senior(s), {userInput.householdComposition.kids} Kid(s)</p>
            {userInput.diseaseConcerns && userInput.diseaseConcerns.length > 0 && userInput.diseaseConcerns[0] !== 'none' && (
                <p style={styles.userInputText}><strong>Health Considerations:</strong> {userInput.diseaseConcerns.join(', ').replace(/_/g, ' ')}</p>
            )}
        </div>
        
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Ingredients</div>
          <ul style={styles.ingredientList}>
            {recipe.adjustedIngredients.map((ing, index) => (
              <li key={index} style={styles.ingredientItem}>
                <span style={styles.ingredientName}>{ing.quantity} {ing.name}</span>
                {ing.notes && <span style={styles.ingredientNotes}>({ing.notes})</span>}
              </li>
            ))}
          </ul>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Instructions</div>
          <ol style={styles.instructionList}>
            {recipe.instructions.map((step, index) => (
              <li key={index} style={styles.instructionItem}>{step}</li>
            ))}
          </ol>
        </div>

        {recipe.healthNotes && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Health & Dietary Notes</div>
            <div style={styles.healthNotesSection}>
                <p style={styles.healthNotesText}>{recipe.healthNotes}</p>
            </div>
          </div>
        )}
        
        {recipe.storageOrServingTips && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Storage & Serving Tips</div>
            <p style={{...styles.paragraph, whiteSpace: 'pre-line', color: '#2D3748'}}>{recipe.storageOrServingTips}</p>
          </div>
        )}

        {chatHistory && chatHistory.length > 0 && (
          <div style={{...styles.section, ...styles.chatContainer}} className="pdf-page-break-before">
            <div style={styles.sectionTitle}>Chat Highlights</div>
            {chatHistory.slice(-6).map((msg, index) => ( // Show last few messages
              <div key={index} style={styles.chatMessage}>
                <span style={styles.chatUser}>{msg.role === 'user' ? 'Your Question:' : 'AI Chef Response:'}</span>
                <span style={msg.role === 'user' ? {color: '#555555'} : styles.chatAssistant }>{msg.content}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
