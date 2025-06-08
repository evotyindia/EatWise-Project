
import type React from 'react';
import type { GenerateHealthReportOutput } from '@/ai/flows/generate-health-report';
import type { ChatMessage } from '@/app/analyze/analyzer-form'; // Assuming ChatMessage type is exported or moved

interface PrintableHealthReportProps {
  report: GenerateHealthReportOutput;
  chatHistory?: ChatMessage[];
  productNameContext?: string;
}

export const PrintableHealthReport: React.FC<PrintableHealthReportProps> = ({ report, chatHistory, productNameContext }) => {
  const styles: { [key: string]: React.CSSProperties } = {
    page: { padding: '40px', fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '1.5', color: '#333', width: '210mm', boxSizing: 'border-box' },
    companyHeader: { textAlign: 'center', fontSize: '16pt', fontWeight: 'bold', marginBottom: '10px', color: '#0f172a' },
    reportTitle: { textAlign: 'center', fontSize: '14pt', fontWeight: 'bold', marginBottom: '20px', color: '#10b981' },
    productName: { textAlign: 'center', fontSize: '12pt', fontWeight: 'bold', marginBottom: '20px' },
    sectionTitle: { fontSize: '12pt', fontWeight: 'bold', marginTop: '20px', marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '5px', color: '#0f172a' },
    ratingBlock: { border: '1px solid #eee', padding: '10px', borderRadius: '5px', marginBottom: '10px', backgroundColor: '#f9f9f9' },
    ratingTitle: { fontWeight: 'bold', marginBottom: '3px'},
    ratingValue: { fontSize: '10pt' },
    ratingJustification: { fontSize: '9pt', color: '#555', marginTop: '3px' },
    listItem: { marginBottom: '4px', paddingLeft: '15px', textIndent: '-15px' },
    chatUser: { fontWeight: 'bold', marginTop: '8px', marginBottom: '2px' },
    chatAI: { marginTop: '2px', marginBottom: '8px', paddingLeft: '10px', borderLeft: '2px solid #e0e0e0' },
    footer: { marginTop: '30px', paddingTop: '10px', borderTop: '1px solid #ccc', fontSize: '8pt', textAlign: 'center' as 'center', color: '#777'}
  };

  const renderListItems = (text?: string) => {
    if (!text) return <div style={styles.listItem}>N/A</div>;
    return text.split(/\s*[-\*]\s*/g).filter(s => s.trim()).map((item, index) => (
      <div key={index} style={styles.listItem}>• {item.trim()}</div>
    ));
  };
  
  const getRatingText = (rating?: number, justification?: string) => {
    if (rating === undefined) return 'N/A';
    let text = `${rating}/5 stars`;
    if (justification) {
      text += ` - ${justification}`;
    }
    return text;
  }

  return (
    <div style={styles.page}>
      <div style={styles.companyHeader}>Swasth Bharat Advisor</div>
      <div style={styles.reportTitle}>AI Health Report</div>
      { (report.productType || productNameContext) && 
        <div style={styles.productName}>For: {report.productType || productNameContext}</div>
      }

      <div style={styles.sectionTitle}>Overall Ratings</div>
      <div style={styles.ratingBlock}>
        <div style={styles.ratingTitle}>Health Rating:</div>
        <div style={styles.ratingValue}>{report.healthRating}/5 stars</div>
      </div>
      {report.processingLevelRating !== undefined && (
        <div style={styles.ratingBlock}>
          <div style={styles.ratingTitle}>Processing Level:</div>
          <div style={styles.ratingValue}>{getRatingText(report.processingLevelRating, report.detailedAnalysis.summary?.split('Processing Level Rating:')[1]?.split('Sugar Content Rating:')[0]?.trim())}</div>
        </div>
      )}
      {report.sugarContentRating !== undefined && (
        <div style={styles.ratingBlock}>
          <div style={styles.ratingTitle}>Sugar Content:</div>
          <div style={styles.ratingValue}>{getRatingText(report.sugarContentRating, report.detailedAnalysis.summary?.split('Sugar Content Rating:')[1]?.split('Nutrient Density Rating:')[0]?.trim())}</div>
        </div>
      )}
      {report.nutrientDensityRating !== undefined && (
         <div style={styles.ratingBlock}>
          <div style={styles.ratingTitle}>Nutrient Density:</div>
          <div style={styles.ratingValue}>{getRatingText(report.nutrientDensityRating, report.detailedAnalysis.summary?.split('Nutrient Density Rating:')[1]?.trim())}</div>
        </div>
      )}

      <div style={styles.sectionTitle}>Detailed Analysis</div>
      <div style={styles.ratingTitle}>Summary:</div>
      {renderListItems(report.detailedAnalysis.summary)}

      {report.detailedAnalysis.positiveAspects && (
        <>
          <div style={{...styles.ratingTitle, marginTop: '10px'}}>Positive Aspects:</div>
          {renderListItems(report.detailedAnalysis.positiveAspects)}
        </>
      )}
      {report.detailedAnalysis.potentialConcerns && (
        <>
          <div style={{...styles.ratingTitle, marginTop: '10px', color: '#d9534f'}}>Potential Concerns:</div>
          {renderListItems(report.detailedAnalysis.potentialConcerns)}
        </>
      )}
      {report.detailedAnalysis.keyNutrientsBreakdown && (
        <>
          <div style={{...styles.ratingTitle, marginTop: '10px'}}>Key Nutrients Breakdown:</div>
          {renderListItems(report.detailedAnalysis.keyNutrientsBreakdown)}
        </>
      )}
      
      {report.alternatives && (
        <>
          <div style={styles.sectionTitle}>Healthier Indian Alternatives</div>
          {renderListItems(report.alternatives)}
        </>
      )}

      {chatHistory && chatHistory.length > 0 && (
        <>
          <div style={styles.sectionTitle}>Chat History</div>
          {chatHistory.map((msg, index) => (
            <div key={index}>
              <div style={styles.chatUser}>{msg.role === 'user' ? 'You:' : 'AI Advisor:'}</div>
              <div style={msg.role === 'user' ? {} : styles.chatAI }>{msg.content}</div>
            </div>
          ))}
        </>
      )}
      <div style={styles.footer}>
        Generated by Swasth Bharat Advisor | Page <span className="pageNumber"></span> of <span className="totalPages"></span>
      </div>
    </div>
  );
};
