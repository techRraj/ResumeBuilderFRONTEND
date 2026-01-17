// src/components/templates/web/TemplateModernDev.jsx
import React from 'react';

const safeText = (text) => {
  if (text === null || text === undefined) return '';
  return String(text).trim();
};

export default function TemplateModernDev({ data, theme }) {
  const personal = data?.personal || {};
  const experience = Array.isArray(data?.experience) ? data.experience : [];
  const education = Array.isArray(data?.education) ? data.education : [];
  const skills = Array.isArray(data?.skills) ? data.skills.filter(s => s && s.trim()) : [];
  const primaryColor = theme?.primary || '#2563eb';

  const styles = {
    container: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontSize: '10pt',
      lineHeight: '1.5',
      color: '#1e293b',
      backgroundColor: '#ffffff',
    },
    header: {
      marginBottom: '20px',
      paddingBottom: '15px',
      borderBottom: `2px solid ${primaryColor}`,
    },
    name: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#0f172a',
      marginBottom: '6px',
      letterSpacing: '0.5px',
    },
    title: {
      fontSize: '13px',
      fontWeight: '700',
      color: primaryColor,
      marginBottom: '8px',
    },
    contactRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      fontSize: '9px',
      color: '#475569',
      marginTop: '8px',
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    summarySection: {
      marginBottom: '16px',
    },
    sectionTitle: {
      fontSize: '12px',
      fontWeight: '700',
      color: primaryColor,
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '10px',
      borderBottom: '1.5px solid #cbd5e1',
      paddingBottom: '4px',
    },
    summaryText: {
      fontSize: '10px',
      lineHeight: '1.6',
      color: '#334155',
      textAlign: 'justify',
    },
    twoColumnContainer: {
      display: 'flex',
      gap: '20px',
    },
    leftColumn: {
      flex: '0 0 65%',
    },
    rightColumn: {
      flex: '0 0 35%',
    },
    section: {
      marginBottom: '16px',
    },
    experienceItem: {
      marginBottom: '14px',
    },
    experienceRole: {
      fontSize: '11px',
      fontWeight: '700',
      color: '#0f172a',
      marginBottom: '3px',
    },
    experienceCompany: {
      fontSize: '10px',
      fontStyle: 'italic',
      color: '#475569',
      marginBottom: '2px',
    },
    experienceDuration: {
      fontSize: '9px',
      color: '#64748b',
      marginBottom: '6px',
    },
    experienceDescription: {
      fontSize: '10px',
      lineHeight: '1.6',
      color: '#334155',
      textAlign: 'justify',
    },
    educationItem: {
      marginBottom: '12px',
    },
    educationDegree: {
      fontSize: '10px',
      fontWeight: '700',
      color: '#0f172a',
      marginBottom: '3px',
    },
    educationInstitute: {
      fontSize: '9px',
      color: '#475569',
      marginBottom: '2px',
    },
    educationYear: {
      fontSize: '9px',
      color: '#64748b',
    },
    skillsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
      marginTop: '4px',
    },
    skillBadge: {
      backgroundColor: '#dbeafe',
      color: '#1e40af',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '9px',
      fontWeight: '700',
      display: 'inline-block',
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.name}>{safeText(personal.name) || 'Your Name'}</div>
        <div style={styles.title}>{safeText(personal.title) || 'Professional Title'}</div>
        <div style={styles.contactRow}>
          {personal.email && (
            <div style={styles.contactItem}>
              <span>✉</span>
              <span>{safeText(personal.email)}</span>
            </div>
          )}
          {personal.phone && (
            <div style={styles.contactItem}>
              <span>☎</span>
              <span>{safeText(personal.phone)}</span>
            </div>
          )}
          {personal.location && (
            <div style={styles.contactItem}>
              <span>📍</span>
              <span>{safeText(personal.location)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {personal.summary && (
        <div style={styles.summarySection}>
          <div style={styles.sectionTitle}>Professional Summary</div>
          <div style={styles.summaryText}>{safeText(personal.summary)}</div>
        </div>
      )}

      {/* Two Column Layout */}
      <div style={styles.twoColumnContainer}>
        {/* Left Column - Experience */}
        <div style={styles.leftColumn}>
          {experience.length > 0 && (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>Work Experience</div>
              {experience.map((exp, index) => (
                <div key={index} style={styles.experienceItem}>
                  <div style={styles.experienceRole}>
                    {safeText(exp.role) || 'Position Title'}
                  </div>
                  <div style={styles.experienceCompany}>
                    {safeText(exp.company)}
                  </div>
                  <div style={styles.experienceDuration}>
                    {safeText(exp.duration)}
                  </div>
                  {exp.description && (
                    <div style={styles.experienceDescription}>
                      {safeText(exp.description)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Skills & Education */}
        <div style={styles.rightColumn}>
          {/* Skills */}
          {skills.length > 0 && (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>Skills</div>
              <div style={styles.skillsContainer}>
                {skills.map((skill, index) => (
                  <span key={index} style={styles.skillBadge}>
                    {safeText(skill)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>Education</div>
              {education.map((edu, index) => (
                <div key={index} style={styles.educationItem}>
                  <div style={styles.educationDegree}>
                    {safeText(edu.degree) || 'Degree'}
                  </div>
                  <div style={styles.educationInstitute}>
                    {safeText(edu.institute)}
                  </div>
                  <div style={styles.educationYear}>
                    {safeText(edu.year)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}