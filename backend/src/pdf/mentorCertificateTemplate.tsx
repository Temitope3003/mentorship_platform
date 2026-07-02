const NAVY = '#0F1F3D'
const GOLD = '#C9A84C'
const CREAM = '#F9F7F1'

interface MentorCertificateDocumentProps {
  mentorName: string
  issuedDateFormatted: string
  certificateCode: string
}

// `reactPdf` is the namespace object resolved from a dynamic `import('@react-pdf/renderer')`.
// It must never be statically imported here — @react-pdf/renderer is ESM-only and the backend
// compiles to CommonJS, so a static import would crash at require() time in production.
export function buildMentorCertificateDocument(reactPdf: any, props: MentorCertificateDocumentProps) {
  const { Document, Page, View, Text, StyleSheet } = reactPdf
  const { mentorName, issuedDateFormatted, certificateCode } = props

  const styles = StyleSheet.create({
    page: {
      backgroundColor: CREAM,
    },
    outerBorder: {
      flex: 1,
      margin: 22,
      borderWidth: 3,
      borderStyle: 'solid',
      borderColor: NAVY,
      padding: 6,
    },
    innerBorder: {
      flex: 1,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: GOLD,
      padding: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 26 },
    logoMark: {
      width: 28, height: 28, backgroundColor: GOLD, borderRadius: 6,
      alignItems: 'center', justifyContent: 'center', marginRight: 9,
    },
    logoMarkText: { fontFamily: 'Times-Bold', fontSize: 15, color: NAVY },
    logoText: { fontFamily: 'Times-Bold', fontSize: 17, color: NAVY },
    heading: {
      fontFamily: 'Times-Bold', fontSize: 26, color: GOLD,
      letterSpacing: 3, marginBottom: 20, textAlign: 'center',
    },
    certifiesText: { fontFamily: 'Helvetica', fontSize: 12, color: '#4A4A4A', marginBottom: 12 },
    mentorName: {
      fontFamily: 'Times-BoldItalic', fontSize: 32, color: NAVY, marginBottom: 8, textAlign: 'center',
    },
    goldLine: { width: 220, height: 1.5, backgroundColor: GOLD, marginBottom: 20 },
    completionText: { fontFamily: 'Helvetica', fontSize: 13, color: NAVY, textAlign: 'center', marginBottom: 6, maxWidth: 440 },
    subtext: { fontFamily: 'Helvetica-Oblique', fontSize: 10, color: '#6B6B6B', textAlign: 'center', marginBottom: 24 },
    dateText: { fontFamily: 'Helvetica', fontSize: 11, color: '#4A4A4A', marginBottom: 36 },
    signatureArea: { alignItems: 'center' },
    signatureLine: { width: 170, height: 1, backgroundColor: GOLD, marginBottom: 8 },
    signatureName: { fontFamily: 'Times-Bold', fontSize: 13, color: NAVY },
    signatureTitle: { fontFamily: 'Helvetica', fontSize: 10, color: '#6B6B6B', marginTop: 2 },
    codeCorner: {
      position: 'absolute', bottom: 16, right: 30,
      fontFamily: 'Helvetica', fontSize: 8, color: '#8A8070',
    },
  })

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.outerBorder}>
          <View style={styles.innerBorder}>
            <View style={styles.logoRow}>
              <View style={styles.logoMark}>
                <Text style={styles.logoMarkText}>B</Text>
              </View>
              <Text style={styles.logoText}>BuildInTech</Text>
            </View>

            <Text style={styles.heading}>CERTIFICATE OF MENTORSHIP</Text>
            <Text style={styles.certifiesText}>This certifies that</Text>
            <Text style={styles.mentorName}>{mentorName}</Text>
            <View style={styles.goldLine} />
            <Text style={styles.completionText}>
              has served as a dedicated mentor with Build In Tech, guiding aspiring tech professionals through their career journey
            </Text>
            <Text style={styles.subtext}>In recognition of their contribution as a volunteer mentor</Text>
            <Text style={styles.dateText}>Issued on {issuedDateFormatted}</Text>

            <View style={styles.signatureArea}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>Temitope Ajao</Text>
              <Text style={styles.signatureTitle}>Founder, Build In Tech</Text>
            </View>
          </View>
        </View>

        <Text style={styles.codeCorner}>{certificateCode}</Text>
      </Page>
    </Document>
  )
}
