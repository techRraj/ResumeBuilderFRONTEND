// src/Components/ui/MinimalPDF.js
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 12 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  text: { marginBottom: 10 },
});

export default function MinimalPDF({ name = 'Rajkumar Chourasiya' }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.title}>Resume</Text>
          <Text style={styles.text}>Name: {name}</Text>
          <Text style={styles.text}>✅ PDF works — no errors!</Text>
        </View>
      </Page>
    </Document>
  );
}