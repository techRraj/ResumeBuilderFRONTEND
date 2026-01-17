// src/components/templates/pdf/TemplateMinimalPDF.jsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const MinimalPDF = ({ data, theme = '#2563eb' }) => {
  const s = str => str || '';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: theme }]}>{s(data.name)}</Text>
          <Text style={styles.title}>{s(data.title)}</Text>
          <Text style={styles.contact}>
            {s(data.email)} • {s(data.phone)} • {s(data.location)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme }]}>Summary</Text>
          <Text>{s(data.summary)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme }]}>Experience</Text>
          {data.experience?.map((exp, i) => (
            <View key={i} style={styles.item}>
              <Text style={styles.itemHeader}>
                {s(exp.role)} at {s(exp.company)}
              </Text>
              <Text style={styles.duration}>{s(exp.duration)}</Text>
              <Text>{s(exp.description)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme }]}>Skills</Text>
          <View style={styles.skills}>
            {data.skills?.map((skill, i) => (
              <Text key={i} style={[styles.skillBadge, { backgroundColor: `${theme}20`, color: theme }]}>
                {s(skill)}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme }]}>Education</Text>
          {data.education?.map((edu, i) => (
            <View key={i} style={styles.item}>
              <Text style={styles.itemHeader}>{s(edu.degree)}</Text>
              <Text>{s(edu.institute)} • {s(edu.year)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme }]}>Projects</Text>
          {data.projects?.map((proj, i) => (
            <View key={i} style={styles.item}>
              <Text style={styles.itemHeader}>{s(proj.name)}</Text>
              <Text style={{ fontStyle: 'italic' }}>{s(proj.tech)}</Text>
              <Text>{s(proj.desc)}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: '30mm 25mm',
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.5,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  contact: {
    fontSize: 10,
    marginTop: 6,
    color: '#666',
  },
  section: {
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  item: {
    marginBottom: 10,
  },
  itemHeader: {
    fontWeight: 'bold',
  },
  duration: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  skillBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default MinimalPDF;