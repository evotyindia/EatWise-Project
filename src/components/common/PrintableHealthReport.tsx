
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
    page: { padding: '15mm', fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '1.5', color: '#333333', width: '210mm', boxSizing: 'border-box', minHeight: '297mm', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' },
    pageContent: { flexGrow: 1 },
    companyHeader: { textAlign: 'right', fontSize: '10pt', color: '#555555', marginBottom: '10mm', borderBottom: '1px solid #eeeeee', paddingBottom: '5mm' },
    reportTitle: { textAlign: 'center', fontSize: '20pt', fontWeight: 'bold', color: '#004466', marginBottom: '8mm' },
    productName: { textAlign: 'center', fontSize: '14pt', fontWeight: 'bold', marginBottom: '12mm', color: '#222222' },
    section: { marginBottom: '8mm', padding: '5mm', border: '1px solid #e0e0e0', borderRadius: '5px', backgroundColor: '#fdfdfd' },
    sectionTitle: { fontSize: '13pt', fontWeight: 'bold', color: '#004466', marginTop: '0', marginBottom: '6mm', borderBottom: '2px solid #005a87', paddingBottom: '3mm' },
    subSectionTitle: { fontSize: '11pt', fontWeight: 'bold', color: '#333333', marginTop: '6mm', marginBottom: '4mm' },
    ratingBlockContainer: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6mm', marginBottom: '8mm' },
    ratingBlock: { border: '1px solid #cccccc', padding: '5mm', borderRadius: '4px', backgroundColor: '#f9f9f9', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    ratingTitle: { fontWeight: 'bold', marginBottom: '3mm', fontSize: '10pt', color: '#333333' },
    ratingValue: { fontSize: '10pt', color: '#111111' },
    list: { listStyleType: 'disc', paddingLeft: '6mm', margin: '0 0 4mm 0' },
    listItem: { marginBottom: '2.5mm', paddingLeft: '2mm' },
    concernsListItem: { marginBottom: '2.5mm', paddingLeft: '2mm', color: '#c0392b' },
    chatContainer: { marginTop: '8mm', borderTop: '1px solid #dddddd', paddingTop: '5mm' },
    chatMessage: { marginBottom: '4mm', padding: '4mm', borderRadius: '4px', border: '1px solid #f0f0f0', backgroundColor: '#f9f9f9' },
    chatUser: { fontWeight: 'bold', color: '#005a87', display: 'block', marginBottom: '1mm' },
    chatAssistant: { color: '#444444', display: 'block' },
    footer: { marginTop: 'auto', paddingTop: '8mm', borderTop: '1px solid #cccccc', fontSize: '9pt', textAlign: 'center', color: '#777777', width: 'calc(100% - 30mm)', marginLeft: '15mm', marginRight: '15mm', boxSizing: 'border-box' }
  };

  const renderListItems = (text?: string, isConcern?: boolean): JSX.Element[] | JSX.Element => {
    if (!text || text.trim().toLowerCase() === 'n/a' || text.trim() === '') {
      return <li style={styles.listItem}>Not specified / Applicable.</li>;
    }
    return text.split(/\s*[-\*]\s*/g).filter(s => s.trim()).map((item, index) => (
      <li key={index} style={isConcern ? styles.concernsListItem : styles.listItem}>{item.trim()}</li>
    ));
  };
  
  const getRatingDisplay = (ratingInfo?: { rating: number; justification?: string | null }, title?: string) => {
    if (!ratingInfo || ratingInfo.rating === undefined) return <div style={styles.ratingValue}>N/A</div>;
    let text = `${ratingInfo.rating} / 5 stars`;
    if (ratingInfo.justification && ratingInfo.justification.trim() && ratingInfo.justification.trim().toLowerCase() !== 'n/a') {
        text += ` - ${ratingInfo.justification.trim()}`;
    }
    return <div style={styles.ratingValue}>{text}</div>;
  };


  return (
    <div style={styles.page}>
      <div style={styles.pageContent}>
        <div style={styles.companyHeader}>EatWise India</div>
        <div style={styles.reportTitle}>AI Health Report</div>
        { (report.productType || productNameContext) && 
          <div style={styles.productName}>Product: {report.productType || productNameContext || "Not Specified"}</div>
        }

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Overall Ratings</div>
          <div style={styles.ratingBlockContainer}>
            <div style={styles.ratingBlock}>
              <div style={styles.ratingTitle}>Health Rating:</div>
              <div style={styles.ratingValue}>{report.healthRating} / 5 stars</div>
            </div>
            {report.processingLevelRating && (
              <div style={styles.ratingBlock}>
                <div style={styles.ratingTitle}>Processing Level:</div>
                {getRatingDisplay(report.processingLevelRating)}
              </div>
            )}
            {report.sugarContentRating && (
              <div style={styles.ratingBlock}>
                <div style={styles.ratingTitle}>Sugar Content:</div>
                {getRatingDisplay(report.sugarContentRating)}
              </div>
            )}
            {report.nutrientDensityRating && (
               <div style={styles.ratingBlock}>
                <div style={styles.ratingTitle}>Nutrient Density:</div>
                {getRatingDisplay(report.nutrientDensityRating)}
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
              <ul style={styles.list}>{renderListItems(report.detailedAnalysis.potentialConcerns, true)}</ul>
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
          <div style={{...styles.section, ...styles.chatContainer}}>
            <div style={styles.sectionTitle}>Chat History</div>
            {chatHistory.map((msg, index) => (
              <div key={index} style={styles.chatMessage}>
                <span style={styles.chatUser}>{msg.role === 'user' ? 'Your Question:' : 'AI Advisor Response:'}</span>
                <span style={msg.role === 'user' ? {color: '#555555'} : styles.chatAssistant }>{msg.content}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={styles.footer}>
        Generated on {new Date().toLocaleDateString('en-GB')} by EatWise India. This report is AI-generated and for informational purposes only.
      </div>
    </div>
  );
};
