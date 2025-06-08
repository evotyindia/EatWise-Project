
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
    page: { padding: '20mm', fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '1.4', color: '#333333', width: '210mm', boxSizing: 'border-box', minHeight: '297mm', display: 'flex', flexDirection: 'column' },
    pageContent: { flexGrow: 1 },
    companyHeader: { textAlign: 'right', fontSize: '9pt', color: '#777777', marginBottom: '15mm' },
    reportTitle: { textAlign: 'center', fontSize: '18pt', fontWeight: 'bold', color: '#005a87', marginBottom: '10mm', textTransform: 'uppercase' },
    productName: { textAlign: 'center', fontSize: '14pt', fontWeight: 'bold', marginBottom: '15mm', color: '#333333' },
    section: { marginBottom: '10mm' },
    sectionTitle: { fontSize: '12pt', fontWeight: 'bold', color: '#005a87', marginTop: '0', marginBottom: '5mm', borderBottom: '1px solid #cccccc', paddingBottom: '2mm' },
    subSectionTitle: { fontSize: '11pt', fontWeight: 'bold', color: '#333333', marginTop: '5mm', marginBottom: '3mm' },
    ratingBlockContainer: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5mm', marginBottom: '10mm' },
    ratingBlock: { border: '1px solid #dddddd', padding: '4mm', borderRadius: '4px', backgroundColor: '#f9f9f9' },
    ratingTitle: { fontWeight: 'bold', marginBottom: '2mm', fontSize: '10pt', color: '#333333' },
    ratingValue: { fontSize: '10pt', color: '#333333' },
    list: { listStyleType: 'disc', paddingLeft: '5mm', margin: '0 0 5mm 0' },
    listItem: { marginBottom: '2mm' },
    chatMessage: { marginBottom: '3mm', padding: '3mm', borderRadius: '4px', border: '1px solid #eeeeee' },
    chatUser: { fontWeight: 'bold', color: '#005a87' },
    chatAssistant: { fontStyle: 'italic', color: '#555555', marginTop: '1mm' },
    footer: { marginTop: 'auto', paddingTop: '5mm', borderTop: '1px solid #cccccc', fontSize: '8pt', textAlign: 'center', color: '#777777', width: '100%' }
  };

  const renderListItems = (text?: string): JSX.Element[] | JSX.Element => {
    if (!text) return <li style={styles.listItem}>N/A</li>;
    return text.split(/\s*[-\*]\s*/g).filter(s => s.trim()).map((item, index) => (
      <li key={index} style={styles.listItem}>{item.trim()}</li>
    ));
  };
  
  const getRatingText = (rating?: number, justification?: string) => {
    if (rating === undefined) return 'N/A';
    let text = `${rating} / 5 stars`;
    if (justification && justification.trim() !== '-' && justification.trim().toLowerCase() !== 'n/a') {
      text += ` - ${justification.trim()}`;
    }
    return text;
  };

  return (
    <div style={styles.page}>
      <div style={styles.pageContent}>
        <div style={styles.companyHeader}>Swasth Bharat Advisor</div>
        <div style={styles.reportTitle}>AI Health Report</div>
        { (report.productType || productNameContext) && 
          <div style={styles.productName}>Product: {report.productType || productNameContext}</div>
        }

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Overall Ratings</div>
          <div style={styles.ratingBlockContainer}>
            <div style={styles.ratingBlock}>
              <div style={styles.ratingTitle}>Health Rating:</div>
              <div style={styles.ratingValue}>{report.healthRating} / 5 stars</div>
            </div>
            {report.processingLevelRating !== undefined && (
              <div style={styles.ratingBlock}>
                <div style={styles.ratingTitle}>Processing Level:</div>
                <div style={styles.ratingValue}>{getRatingText(report.processingLevelRating, report.detailedAnalysis.summary?.split('Processing Level Rating:')[1]?.split('Sugar Content Rating:')[0]?.trim().replace(/^-/, '').trim())}</div>
              </div>
            )}
            {report.sugarContentRating !== undefined && (
              <div style={styles.ratingBlock}>
                <div style={styles.ratingTitle}>Sugar Content:</div>
                <div style={styles.ratingValue}>{getRatingText(report.sugarContentRating, report.detailedAnalysis.summary?.split('Sugar Content Rating:')[1]?.split('Nutrient Density Rating:')[0]?.trim().replace(/^-/, '').trim())}</div>
              </div>
            )}
            {report.nutrientDensityRating !== undefined && (
               <div style={styles.ratingBlock}>
                <div style={styles.ratingTitle}>Nutrient Density:</div>
                <div style={styles.ratingValue}>{getRatingText(report.nutrientDensityRating, report.detailedAnalysis.summary?.split('Nutrient Density Rating:')[1]?.trim().replace(/^-/, '').trim())}</div>
              </div>
            )}
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Detailed Analysis</div>
          <div style={styles.subSectionTitle}>Summary:</div>
          <ul style={styles.list}>{renderListItems(report.detailedAnalysis.summary)}</ul>

          {report.detailedAnalysis.positiveAspects && (
            <>
              <div style={styles.subSectionTitle}>Positive Aspects:</div>
              <ul style={styles.list}>{renderListItems(report.detailedAnalysis.positiveAspects)}</ul>
            </>
          )}
          {report.detailedAnalysis.potentialConcerns && (
            <>
              <div style={{...styles.subSectionTitle, color: '#c0392b'}}>Potential Concerns:</div>
              <ul style={{...styles.list, color: '#c0392b'}}>{renderListItems(report.detailedAnalysis.potentialConcerns)}</ul>
            </>
          )}
          {report.detailedAnalysis.keyNutrientsBreakdown && (
            <>
              <div style={styles.subSectionTitle}>Key Nutrients Breakdown:</div>
              <ul style={styles.list}>{renderListItems(report.detailedAnalysis.keyNutrientsBreakdown)}</ul>
            </>
          )}
        </div>
        
        {report.alternatives && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Healthier Indian Alternatives</div>
            <ul style={styles.list}>{renderListItems(report.alternatives)}</ul>
          </div>
        )}

        {chatHistory && chatHistory.length > 0 && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Chat History</div>
            {chatHistory.map((msg, index) => (
              <div key={index} style={styles.chatMessage}>
                <div style={styles.chatUser}>{msg.role === 'user' ? 'You:' : 'AI Advisor:'}</div>
                <div style={msg.role === 'user' ? {color: '#555555', marginTop: '1mm'} : styles.chatAssistant }>{msg.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={styles.footer}>
        Generated on {new Date().toLocaleDateString()} by Swasth Bharat Advisor. This report is AI-generated and for informational purposes only.
      </div>
    </div>
  );
};
