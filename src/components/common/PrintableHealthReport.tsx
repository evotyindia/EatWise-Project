
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
    aboutPage: { padding: '15mm', minHeight: '277mm', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', borderBottom: '1px solid #e0e0e0' },
    logoPlaceholder: { marginBottom: '20px' },
    aboutTitle: { fontSize: '24pt', fontWeight: 'bold', color: '#003366', marginBottom: '15px' },
    aboutText: { fontSize: '11pt', marginBottom: '10px', maxWidth: '170mm', textAlign: 'justify' },
    aboutPageFooter: { fontSize: '9pt', color: '#777777', marginTop: 'auto', paddingTop: '10mm' },
    
    reportPage: { padding: '15mm' },
    reportTitle: { textAlign: 'center', fontSize: '20pt', fontWeight: 'bold', color: '#003366', marginBottom: '8mm' },
    productName: { textAlign: 'center', fontSize: '14pt', fontWeight: 'bold', marginBottom: '10mm', color: '#222222' },
    section: { marginBottom: '8mm', padding: '5mm', border: '1px solid #e0e0e0', borderRadius: '5px', backgroundColor: '#f9f9f9' },
    sectionTitle: { fontSize: '14pt', fontWeight: 'bold', color: '#004466', marginTop: '0', marginBottom: '6mm', borderBottom: '2px solid #005a87', paddingBottom: '3mm' },
    subSectionTitle: { fontSize: '12pt', fontWeight: 'bold', color: '#333333', marginTop: '6mm', marginBottom: '4mm' },
    ratingBlockContainer: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6mm', marginBottom: '8mm' },
    ratingBlock: { border: '1px solid #cccccc', padding: '5mm', borderRadius: '4px', backgroundColor: '#f7f7f7', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    ratingTitle: { fontWeight: 'bold', marginBottom: '3mm', fontSize: '11pt', color: '#333333' },
    ratingValue: { fontSize: '10pt', color: '#111111' },
    list: { listStyleType: 'disc', paddingLeft: '6mm', margin: '0 0 4mm 0' },
    listItem: { marginBottom: '2.5mm', paddingLeft: '2mm' },
    concernsListItem: { marginBottom: '2.5mm', paddingLeft: '2mm', color: '#c0392b' },
    chatContainer: { marginTop: '8mm', borderTop: '1px solid #dddddd', paddingTop: '5mm' },
    chatMessage: { marginBottom: '4mm', padding: '4mm', borderRadius: '4px', border: '1px solid #f0f0f0', backgroundColor: '#f9f9f9' },
    chatUser: { fontWeight: 'bold', color: '#005a87', display: 'block', marginBottom: '1mm' },
    chatAssistant: { color: '#444444', display: 'block' },
  };

  const renderListItems = (text?: string, isConcern?: boolean): JSX.Element[] | JSX.Element => {
    if (!text || text.trim().toLowerCase() === 'n/a' || text.trim() === '') {
      return <li style={styles.listItem}>Not specified / Applicable.</li>;
    }
    return text.split(/\s*[-\*]\s*/g).filter(s => s.trim()).map((item, index) => (
      <li key={index} style={isConcern ? styles.concernsListItem : styles.listItem}>{item.trim()}</li>
    ));
  };
  
  const getRatingDisplay = (ratingInfo?: { rating: number; justification?: string | null }) => {
    if (!ratingInfo || ratingInfo.rating === undefined) return <div style={styles.ratingValue}>N/A</div>;
    let text = `${ratingInfo.rating} / 5 stars`;
    if (ratingInfo.justification && ratingInfo.justification.trim() && ratingInfo.justification.trim().toLowerCase() !== 'n/a') {
        text += ` - ${ratingInfo.justification.trim()}`;
    }
    return <div style={styles.ratingValue}>{text}</div>;
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
          This report is generated by our advanced AI system to offer insights and suggestions based on the information you provide.
          It is intended for informational purposes only and should not be considered a substitute for professional medical or nutritional advice. 
          Always consult with a qualified healthcare provider or nutritionist for any health concerns or before making any significant dietary changes.
        </p>
        <div style={styles.aboutPageFooter}>EatWise India - Your Partner in Healthy Eating</div>
      </div>

      <div style={styles.reportPage}>
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

          {report.detailedAnalysis.positiveAspects && report.detailedAnalysis.positiveAspects.toLowerCase() !== 'n/a' && (
            <>
              <div style={styles.subSectionTitle}>Positive Aspects:</div>
              <ul style={styles.list}>{renderListItems(report.detailedAnalysis.positiveAspects)}</ul>
            </>
          )}
          {report.detailedAnalysis.potentialConcerns && report.detailedAnalysis.potentialConcerns.toLowerCase() !== 'n/a' && (
            <>
              <div style={{...styles.subSectionTitle, color: '#c0392b'}}>Potential Concerns:</div>
              <ul style={styles.list}>{renderListItems(report.detailedAnalysis.potentialConcerns, true)}</ul>
            </>
          )}
          {report.detailedAnalysis.keyNutrientsBreakdown && report.detailedAnalysis.keyNutrientsBreakdown.toLowerCase() !== 'n/a' && (
            <>
              <div style={styles.subSectionTitle}>Key Nutrients Breakdown:</div>
              <ul style={styles.list}>{renderListItems(report.detailedAnalysis.keyNutrientsBreakdown)}</ul>
            </>
          )}
        </div>
        
        {report.alternatives && report.alternatives.toLowerCase() !== 'n/a' && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Healthier Indian Alternatives</div>
            <ul style={styles.list}>{renderListItems(report.alternatives)}</ul>
          </div>
        )}

        {chatHistory && chatHistory.length > 0 && (
          <div style={{...styles.section, ...styles.chatContainer}}>
            <div style={styles.sectionTitle}>Chat History Digest</div>
            {chatHistory.map((msg, index) => (
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
