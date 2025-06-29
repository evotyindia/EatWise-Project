
import type React from 'react';
import type { GenerateHealthReportOutput } from '@/ai/flows/generate-health-report';
import type { ChatMessage } from '@/app/analyze/analyzer-form';

interface PrintableHealthReportProps {
  report: GenerateHealthReportOutput;
  chatHistory?: ChatMessage[];
  productNameContext?: string;
}

export const PrintableHealthReport: React.FC<PrintableHealthReportProps> = ({ report, chatHistory, productNameContext }) => {
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
    productName: { fontSize: '14pt', fontWeight: 'bold', marginBottom: '8mm', color: '#2D3748' },
    
    section: { marginBottom: '7mm', padding: '5mm', border: '1px solid #E2E8F0', borderRadius: '6px', backgroundColor: '#F7FAFC' },
    sectionTitle: { fontSize: '14pt', fontWeight: 'bold', color: '#1A202C', marginTop: '0', marginBottom: '5mm', borderBottom: '2px solid #10b981', paddingBottom: '3mm' },
    subSectionTitle: { fontSize: '12pt', fontWeight: 'bold', color: '#2D3748', marginTop: '5mm', marginBottom: '4mm' },
    
    ratingBlockContainer: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5mm', marginBottom: '7mm' },
    ratingBlock: { border: '1px solid #CBD5E0', padding: '4mm', borderRadius: '4px', backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' },
    ratingTitle: { fontWeight: 'bold', marginBottom: '2mm', fontSize: '10pt', color: '#4A5568' },
    ratingValue: { fontSize: '10pt', color: '#1A202C', display: 'flex', alignItems: 'center', flexWrap: 'wrap' as 'wrap', gap: '2px' },
    ratingValueWithJustification: { display: 'flex', flexDirection: 'column', gap: '1mm'},
    justificationText: { fontSize: '8.5pt', color: '#718096', marginLeft: '0px', fontStyle: 'italic' }, // No left margin if on new line
    star: { color: '#FBBF24', marginRight: '1px', fontSize: '12pt' },
    scaleDescriptionText: { fontSize: '8.5pt', color: '#5A6578', marginLeft: '3px', fontStyle: 'italic' },
    
    listContainer: { paddingLeft: '0', margin: '0' },
    listItem: { display: 'flex', alignItems: 'flex-start', marginBottom: '2mm', color: '#4A5568' },
    concernsListItem: { display: 'flex', alignItems: 'flex-start', marginBottom: '2mm', color: '#c0392b' }, 
    bullet: { marginRight: '2.5mm', minWidth: '2.5mm', textAlign: 'left', lineHeight: '1.4', paddingTop: '0.5mm' },
    listItemText: { flex: 1, textAlign: 'justify' as 'justify'},
    
    chatContainer: { marginTop: '7mm', borderTop: '1px solid #E2E8F0', paddingTop: '5mm' },
    chatMessage: { marginBottom: '3mm', padding: '3mm', borderRadius: '4px', border: '1px solid #F0F0F0', backgroundColor: '#FFFFFF' },
    chatUser: { fontWeight: 'bold', color: '#0f172a', display: 'block', marginBottom: '1mm', fontSize: '9pt' },
    chatAssistant: { color: '#2D3748', display: 'block', fontSize: '9pt' },
  };

  const renderStars = (rating: number, maxRating = 5) => {
    const stars = [];
    const roundedRating = Math.round(rating);
    for (let i = 0; i < maxRating; i++) {
      stars.push(<span key={i} style={{...styles.star, opacity: i < roundedRating ? 1 : 0.3}}>★</span>);
    }
    return <>{stars} ({rating}/{maxRating})</>;
  };
  
  const getRatingDisplay = (ratingInfo?: { rating: number; justification?: string | null }, scaleDescriptionText?: string) => {
    if (!ratingInfo || ratingInfo.rating === undefined) return <div style={styles.ratingValue}>N/A</div>;
    
    let starsJsx = renderStars(ratingInfo.rating);
    // For scaleDescriptionText, render it with <span> and apply the italic style directly here
    let scaleDescJsx = scaleDescriptionText ? <span style={{...styles.scaleDescriptionText, fontStyle: 'italic'}}>{scaleDescriptionText}</span> : null;
    
    let ratingLine = <>{starsJsx} {scaleDescJsx}</>;

    if (ratingInfo.justification && ratingInfo.justification.trim() && ratingInfo.justification.trim().toLowerCase() !== 'n/a') {
        return (
          <div style={styles.ratingValueWithJustification}>
            <div style={styles.ratingValue}>{ratingLine}</div>
            <div style={styles.justificationText}>Justification: {ratingInfo.justification.trim()}</div>
          </div>
        );
    }
    return <div style={styles.ratingValue}>{ratingLine}</div>;
  };

  const renderListItems = (text?: string, isConcern?: boolean): JSX.Element[] | JSX.Element => {
    if (!text || text.trim().toLowerCase() === 'n/a' || text.trim() === '') {
      return (
        <div style={isConcern ? styles.concernsListItem : styles.listItem}>
          <span style={styles.bullet}>•</span>
          <span style={styles.listItemText}>Not specified / Not applicable.</span>
        </div>
      );
    }
    const items = text.split(/\n/g).map(s => s.trim().replace(/^(\*|-)\s*/, '')).filter(s => s.trim());
    return items.map((item, index) => (
      <div key={index} style={isConcern ? styles.concernsListItem : styles.listItem}>
        <span style={styles.bullet}>•</span>
        <span style={styles.listItemText}>{item.trim()}</span>
      </div>
    ));
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
          <h1 style={styles.aboutTitle}>AI Health Report by EatWise India</h1>
          
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
              This report offers an AI-generated analysis of the food product based on the information you provided (either via image scan or manual text input). 
              It aims to highlight key nutritional aspects, potential concerns, and suggest healthier Indian alternatives. 
              Use it as a guide to understand your food better and make conscious decisions about what you consume. Pay attention to the rating scales: for some (like health rating), higher stars are better, while for others (like processing level or sugar), lower levels (and thus potentially fewer stars if the scale is direct) might be preferred. The report provides context for each.
            </p>
          </div>
        </div>
        
        <div>
          <p style={styles.disclaimerText}>
            <strong>Disclaimer:</strong> This report is for informational purposes only and is not a substitute for professional medical or nutritional advice. 
            Always consult with a qualified healthcare provider or registered dietitian for any health concerns or before making significant dietary changes. 
            The AI's analysis is based on the data provided and general nutritional knowledge; it does not consider individual health conditions beyond what might be inferred from general product information. 
            EatWise India is not liable for any decisions made based on this report.
          </p>
          <div style={styles.aboutPageFooter}>EatWise India - Your Partner in Healthy Eating. Generated on: {new Date().toLocaleDateString('en-GB')}</div>
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
          <div style={styles.reportTitle}>AI Health Report</div>
          { (report.productType || productNameContext) && 
            <div style={styles.productName}>Product: {report.productType || productNameContext || "Not Specified"}</div>
          }
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Overall Ratings</div>
          <div style={styles.ratingBlockContainer}>
            <div style={styles.ratingBlock}>
                <div style={styles.ratingTitle}>Health Rating:</div>
                {getRatingDisplay({rating: report.healthRating}, `Higher stars = better health.`)}
            </div>
            {report.processingLevelRating && 
                <div style={styles.ratingBlock}>
                    <div style={styles.ratingTitle}>Processing Level:</div>
                    {getRatingDisplay(report.processingLevelRating, `Generally, less processed (fewer stars) is better.`)}
                </div>
            }
            {report.sugarContentRating && 
                <div style={styles.ratingBlock}>
                    <div style={styles.ratingTitle}>Sugar Content:</div>
                    {getRatingDisplay(report.sugarContentRating, `Generally, lower sugar (fewer stars) is better.`)}
                </div>
            }
            {report.nutrientDensityRating && 
                <div style={styles.ratingBlock}>
                    <div style={styles.ratingTitle}>Nutrient Density:</div>
                    {getRatingDisplay(report.nutrientDensityRating, `Higher stars = more nutrient dense.`)}
                </div>
            }
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Detailed Analysis</div>
          <div style={styles.subSectionTitle}>Summary:</div>
          <div style={styles.listContainer}>{renderListItems(report.detailedAnalysis.summary)}</div>

          {(report.detailedAnalysis.positiveAspects && report.detailedAnalysis.positiveAspects.toLowerCase() !== 'n/a' && report.detailedAnalysis.positiveAspects.trim() !== '') && (
            <><div style={styles.subSectionTitle}>Positive Aspects:</div><div style={styles.listContainer}>{renderListItems(report.detailedAnalysis.positiveAspects)}</div></>
          )}
          {(report.detailedAnalysis.potentialConcerns && report.detailedAnalysis.potentialConcerns.toLowerCase() !== 'n/a' && report.detailedAnalysis.potentialConcerns.trim() !== '') && (
            <><div style={{...styles.subSectionTitle, color: '#c0392b'}}>Potential Concerns:</div><div style={styles.listContainer}>{renderListItems(report.detailedAnalysis.potentialConcerns, true)}</div></>
          )}
          {(report.detailedAnalysis.keyNutrientsBreakdown && report.detailedAnalysis.keyNutrientsBreakdown.toLowerCase() !== 'n/a' && report.detailedAnalysis.keyNutrientsBreakdown.trim() !== '') && (
            <><div style={styles.subSectionTitle}>Key Nutrients Breakdown:</div><div style={styles.listContainer}>{renderListItems(report.detailedAnalysis.keyNutrientsBreakdown)}</div></>
          )}
        </div>
        
        {(report.alternatives && report.alternatives.toLowerCase() !== 'n/a' && report.alternatives.trim() !== '') && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Healthier Indian Alternatives</div>
            <div style={styles.listContainer}>{renderListItems(report.alternatives)}</div>
          </div>
        )}

        {chatHistory && chatHistory.length > 0 && (
          <div style={{...styles.section, ...styles.chatContainer}} className="pdf-page-break-before">
            <div style={styles.sectionTitle}>Chat History Digest</div>
            {chatHistory.slice(-5).map((msg, index) => ( 
              <div key={index} style={styles.chatMessage}>
                <span style={styles.chatUser}>{msg.role === 'user' ? 'Your Question:' : 'AI Advisor Response:'}</span>
                <span style={msg.role === 'user' ? {color: '#555555'} : styles.chatAssistant }>{msg.content}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
