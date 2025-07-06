
import type React from 'react';
import type { GenerateHealthReportOutput } from '@/ai/flows/generate-health-report';
import type { ChatMessage } from '@/ai/flows/context-aware-ai-chat';

interface PrintableHealthReportProps {
  report: GenerateHealthReportOutput;
  chatHistory?: ChatMessage[];
  productNameContext?: string;
}

export const PrintableHealthReport: React.FC<PrintableHealthReportProps> = ({ report, chatHistory, productNameContext }) => {
  const styles: { [key: string]: React.CSSProperties } = {
    pdfContainer: { width: '800px', boxSizing: 'border-box', backgroundColor: '#ffffff', color: '#0f172a', fontFamily: 'Inter, Arial, sans-serif', fontSize: '12pt', lineHeight: '1.5' },
    header: { textAlign: 'center', paddingBottom: '15px', borderBottom: '2px solid #10b981', marginBottom: '20px' },
    logoText: { fontFamily: 'Poppins, Arial, sans-serif', fontSize: '24pt', fontWeight: 'bold', color: '#0f172a', margin: 0 },
    subLogoText: { fontSize: '12pt', color: '#0f172a', margin: 0 },
    reportTitle: { fontFamily: 'Poppins, Arial, sans-serif', fontSize: '28pt', fontWeight: 'bold', textAlign: 'center', color: '#0f172a', marginBottom: '5px' },
    productName: { fontSize: '14pt', textAlign: 'center', color: '#555', marginBottom: '20px' },
    section: { marginBottom: '25px' },
    sectionTitle: { fontFamily: 'Poppins, Arial, sans-serif', fontSize: '18pt', fontWeight: 'bold', color: '#0f172a', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginBottom: '15px' },
    ratingGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '20px' },
    ratingBox: { backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', textAlign: 'center' },
    ratingLabel: { fontWeight: 'bold', display: 'block', fontSize: '11pt', color: '#555' },
    ratingValue: { fontSize: '16pt', fontWeight: 'bold' },
    summaryBox: { backgroundColor: '#e6fffa', borderLeft: '4px solid #10b981', padding: '15px', borderRadius: '5px' },
    concernsBox: { backgroundColor: '#fff5f5', borderLeft: '4px solid #e53e3e', padding: '15px', borderRadius: '5px' },
    positivesBox: { backgroundColor: '#f0fff4', borderLeft: '4px solid #38a169', padding: '15px', borderRadius: '5px' },
    alternativesBox: { backgroundColor: '#ebf8ff', borderLeft: '4px solid #3182ce', padding: '15px', borderRadius: '5px' },
    list: { listStyleType: "'\\2022'", paddingLeft: '20px' },
    listItem: { marginBottom: '8px' },
    chatSection: { marginTop: '30px', borderTop: '1px solid #ddd', paddingTop: '20px' },
    chatMessage: { marginBottom: '10px', padding: '10px', borderRadius: '5px' },
    userMsg: { backgroundColor: '#e2e8f0' },
    aiMsg: { backgroundColor: '#f0f9ff' },
  };
  
  const renderListItems = (text?: string): JSX.Element[] | JSX.Element => {
    if (!text || text.trim().toLowerCase() === 'n/a' || text.trim() === '') {
      return <li>Not specified / Not applicable.</li>;
    }
    const items = text.split(/\n/g).map(s => s.trim().replace(/^(\*|-)\s*/, '')).filter(s => s.trim());
    return items.map((item, index) => (
      <li key={index} style={styles.listItem}>{item.trim()}</li>
    ));
  };

  return (
    <div style={styles.pdfContainer}>
      <div style={styles.header}>
        <p style={styles.logoText}>EatWise <span style={styles.subLogoText}>India</span></p>
      </div>
      
      <h1 style={styles.reportTitle}>AI Health Report</h1>
      <p style={styles.productName}>For: {report.productType || productNameContext || "Unnamed Product"}</p>
      
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>At a Glance</h2>
        <div style={styles.ratingGrid}>
          <div style={styles.ratingBox}>
            <span style={styles.ratingLabel}>Health Rating</span>
            <span style={styles.ratingValue}>{report.healthRating} / 5</span>
          </div>
          <div style={styles.ratingBox}>
            <span style={styles.ratingLabel}>Nutrient Density</span>
            <span style={styles.ratingValue}>{report.nutrientDensityRating?.rating || 'N/A'} / 5</span>
          </div>
          <div style={styles.ratingBox}>
            <span style={styles.ratingLabel}>Processing Level</span>
            <span style={styles.ratingValue}>{report.processingLevelRating?.rating || 'N/A'} / 5</span>
          </div>
          <div style={styles.ratingBox}>
            <span style={styles.ratingLabel}>Sugar Content</span>
            <span style={styles.ratingValue}>{report.sugarContentRating?.rating || 'N/A'} / 5</span>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Summary</h2>
        <div style={styles.summaryBox}>
          <ul style={styles.list}>{renderListItems(report.detailedAnalysis.summary)}</ul>
        </div>
      </div>
      
      {renderListItems(report.detailedAnalysis.positiveAspects) && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Positive Aspects</h2>
          <div style={styles.positivesBox}>
            <ul style={styles.list}>{renderListItems(report.detailedAnalysis.positiveAspects)}</ul>
          </div>
        </div>
      )}

      {renderListItems(report.detailedAnalysis.potentialConcerns) && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Potential Concerns</h2>
          <div style={styles.concernsBox}>
            <ul style={styles.list}>{renderListItems(report.detailedAnalysis.potentialConcerns)}</ul>
          </div>
        </div>
      )}

      {renderListItems(report.alternatives) && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Healthier Indian Alternatives</h2>
          <div style={styles.alternativesBox}>
            <ul style={styles.list}>{renderListItems(report.alternatives)}</ul>
          </div>
        </div>
      )}

      {chatHistory && chatHistory.length > 0 && (
          <div style={styles.chatSection}>
              <h2 style={styles.sectionTitle}>Chat Highlights</h2>
              {chatHistory.slice(-4).map((msg, index) => (
                  <div key={index} style={{...styles.chatMessage, ...(msg.role === 'user' ? styles.userMsg : styles.aiMsg)}}>
                      <strong>{msg.role === 'user' ? 'You:' : 'AI Advisor:'}</strong> {msg.content}
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};
