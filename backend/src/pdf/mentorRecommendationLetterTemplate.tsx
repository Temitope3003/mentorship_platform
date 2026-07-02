const NAVY = '#0F1F3D'
const GOLD = '#C9A84C'

interface MentorRecommendationLetterDocumentProps {
  mentorName: string
  letterContent: string
  issuedDateFormatted: string
}

// `reactPdf` is the namespace object resolved from a dynamic `import('@react-pdf/renderer')`.
// It must never be statically imported here — @react-pdf/renderer is ESM-only and the backend
// compiles to CommonJS, so a static import would crash at require() time in production.
export function buildMentorRecommendationLetterDocument(reactPdf: any, props: MentorRecommendationLetterDocumentProps) {
  const { Document, Page, View, Text, StyleSheet } = reactPdf
  const { mentorName, letterContent, issuedDateFormatted } = props

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

  const paragraphs = letterContent.split('\n').filter((p: string) => p.trim().length > 0)

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
        <Text style={styles.meta}>Mentor: {mentorName}</Text>
        <Text style={[styles.meta, { marginBottom: 18 }]}>Role: Volunteer Mentor, Build In Tech</Text>

        {paragraphs.map((p: string, i: number) => (
          <Text key={i} style={styles.paragraph}>{p}</Text>
        ))}

        <View style={styles.signatureArea}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureName}>Temitope Ajao</Text>
          <Text style={styles.signatureTitle}>Founder, Build In Tech</Text>
        </View>
      </Page>
    </Document>
  )
}
