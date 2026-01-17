// src/components/templates/pdf/ModernDevPDF.jsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: '30pt',
    color: '#1e293b',
    backgroundColor: '#ffffff',
  },
  container: {
    flexDirection: 'row',
    gap: 20,
  },
  
  // Sidebar (Left - 35%)
  sidebar: {
    width: '35%',
    backgroundColor: '#f8fafc',
    padding: '20pt',
    borderRadius: 8,
  },
  
  // Main Content (Right - 65%)
  main: {
    width: '65%',
    paddingLeft: 10,
  },
  
  // Header in Sidebar
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: '2pt solid #2563eb',
  },
  name: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 6,
  },
  title: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
    marginBottom: 10,
  },
  contact: {
    fontSize: 8,
    color: '#475569',
    lineHeight: 1.6,
  },
  contactItem: {
    marginBottom: 4,
  },
  
  // Section Styles
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    paddingBottom: 4,
    borderBottom: '1pt solid #cbd5e1',
  },
  
  // Summary
  summaryText: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#334155',
    textAlign: 'justify',
  },
  
  // Skills with Progress Bar
  skillsList: {
    gap: 8,
  },
  skillItem: {
    marginBottom: 10,
  },
  skillName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  skillBar: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  skillBarFill: {
    height: '100%',
    backgroundColor: '#2563eb',
  },
  
  // Education Items
  item: {
    marginBottom: 12,
  },
  itemHeader: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 3,
  },
  itemSub: {
    fontSize: 9,
    color: '#475569',
    marginBottom: 2,
  },
  itemYear: {
    fontSize: 8,
    color: '#64748b',
  },
  
  // Experience Items (Main Section)
  experienceItem: {
    marginBottom: 14,
  },
  experienceRole: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 3,
  },
  experienceCompany: {
    fontSize: 9,
    fontFamily: 'Helvetica-Oblique',
    color: '#475569',
    marginBottom: 6,
  },
  experienceDescription: {
    fontSize: 9,
    lineHeight: 1.6,
    color: '#334155',
    textAlign: 'justify',
  },
  
  // Projects
  projectItem: {
    marginBottom: 12,
  },
  projectName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 3,
  },
  projectTech: {
    fontSize: 8,
    fontFamily: 'Helvetica-Oblique',
    color: '#64748b',
    marginBottom: 4,
  },
  projectDesc: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#334155',
  },
});

const safeText = (text) => {
  if (text === null || text === undefined) return '';
  return String(text).trim();
};

export default function ModernDevPDF({ data }) {
  const personal = data?.personal || {};
  const experience = Array.isArray(data?.experience) ? data.experience : [];
  const education = Array.isArray(data?.education) ? data.education : [];
  const skills = Array.isArray(data?.skills) ? data.skills : [];
  const projects = Array.isArray(data?.projects) ? data.projects : [];

  // Normalize skills
  const skillList = skills.map(s => 
    typeof s === 'string' 
      ? { name: s, level: 85 } 
      : { name: s.name || s, level: s.level || 85 }
  ).filter(s => s.name);

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {safeText(personal.name) || 'Your Name'}
          </Text>
        
          <Text style={styles.title}>
            {safeText(personal.title) || 'Professional Title'}
          </Text>
          <View style={styles.contact}>
            {personal.email && (
              <Text style={styles.contactItem}>✉ {safeText(personal.email)}</Text>
            )}
            {personal.phone && (
              <Text style={styles.contactItem}>📞 {safeText(personal.phone)}</Text>
            )}
            {personal.location && (
              <Text style={styles.contactItem}>📍 {safeText(personal.location)}</Text>
            )}
          </View>
        </View>

        {/* Summary */}
        {personal.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.summaryText}>{safeText(personal.summary)}</Text>
          </View>
        )}

        {/* Skills */}
        {skillList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsList}>
              {skillList.map((skill, index) => (
                <View key={index} style={styles.skillItem}>
                  <View style={styles.skillName}>
                    <Text>{skill.name}</Text>
                    <Text>{skill.level}%</Text>
                  </View>
                  <View style={styles.skillBar}>
                    <View 
                      style={[
                        styles.skillBarFill, 
                        { width: `${skill.level}%` }
                      ]} 
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, index) => (
              <View key={index} style={styles.item}>
                <Text style={styles.itemHeader}>
                  {safeText(edu.degree) || 'Degree'}
                </Text>
                <Text style={styles.itemSub}>
                  {safeText(edu.institute)}
                </Text>
                <Text style={styles.itemYear}>
                  {safeText(edu.year)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Main Content */}
      <View style={styles.main}>
        {/* Experience */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.experienceRole}>
                  {safeText(exp.role) || 'Position Title'}
                </Text>
                <Text style={styles.experienceCompany}>
                  {safeText(exp.company)} • {safeText(exp.duration)}
                </Text>
                {exp.description && (
                  <Text style={styles.experienceDescription}>
                    {safeText(exp.description)}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((proj, index) => (
              <View key={index} style={styles.projectItem}>
                <Text style={styles.projectName}>
                  {safeText(proj.name) || 'Project Name'}
                </Text>
                <Text style={styles.projectTech}>
                  {safeText(proj.tech)}
                </Text>
                {proj.desc && (
                  <Text style={styles.projectDesc}>
                    {safeText(proj.desc)}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}