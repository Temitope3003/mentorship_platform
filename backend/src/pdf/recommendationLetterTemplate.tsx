import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'

const NAVY = '#0F1F3D'
const GOLD = '#C9A84C'

const styles = StyleSheet.create({
  page: { backgroundColor: '#ffffff', padding: 50, fontFamily: 'Helvetica' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  logoMark: {
    width: 24, height: 24, backgroundColor: GOLD, borderRadius: 5,
    alignItems: 'center', justifyContent: 'center', marginRight: 8,
  },
  logoMarkText: { fontFamily: 'Times-Bold', fontSize: 13, color: NAVY },
  logoText: { fontFamily: 'Times-Bold', fontSize: 15, color: NAVY },
  headerLine: { height: 2, backgroundColor: GOLD, marginTop: 10, marginBottom: 28 },
  date: { fontSize: 10, color: '#6B6B6B', marginBottom: 22 },
  title: { fontFamily: 'Times-Bold', fontSize: 16, color: NAVY, marginBottom: 16 },
  meta: { fontSize: 10, color: '#6B6B6B', marginBottom: 4 },
  paragraph: { fontSize: 11, color: '#1A1A1A', lineHeight: 1.6, marginBottom: 12, textAlign: 'justify' },
  signatureArea: { marginTop: 32 },
  signatureLine: { width: 160, height: 1, backgroundColor: GOLD, marginBottom: 8 },
  signatureName: { fontFamily: 'Times-Bold', fontSize: 12, color: NAVY },
  signatureTitle: { fontSize: 10, color: '#6B6B6B', marginTop: 2 },
  footer: {
    position: 'absolute', bottom: 30, left: 50, right: 50,
    fontSize: 8, color: '#B0A898', textAlign: 'center',
  },
})

interface RecommendationLetterDocumentProps {
  menteeName: string
  domainTrack: string
  completionDateFormatted: string
  letterContent: string
  issuedDateFormatted: string
}

export function RecommendationLetterDocument({
  menteeName,
  domainTrack,
  completionDateFormatted,
  letterContent,
  issuedDateFormatted,
}: RecommendationLetterDocumentProps) {
  const paragraphs = letterContent.split('\n').filter((p) => p.trim().length > 0)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View style={styles.logoMark}>
            <Text style={styles.logoMarkText}>B</Text>
          </View>
          <Text style={styles.logoText}>Build In Tech</Text>
        </View>
        <View style={styles.headerLine} />

        <Text style={styles.date}>{issuedDateFormatted}</Text>
        <Text style={styles.title}>Letter of Recommendation</Text>
        <Text style={styles.meta}>Candidate: {menteeName}</Text>
        <Text style={styles.meta}>Track: {domainTrack}</Text>
        <Text style={[styles.meta, { marginBottom: 18 }]}>Program completed: {completionDateFormatted}</Text>

        {paragraphs.map((p, i) => (
          <Text key={i} style={styles.paragraph}>{p}</Text>
        ))}

        <View style={styles.signatureArea}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureName}>Temitope Ajao</Text>
          <Text style={styles.signatureTitle}>Founder &amp; Mentor, Build In Tech</Text>
        </View>

        <Text style={styles.footer}>Build In Tech — buildintech.xyz</Text>
      </Page>
    </Document>
  )
}
