import { buildMentorCertificateDocument } from '../pdf/mentorCertificateTemplate'

interface MentorCertificatePdfData {
  mentorName: string
  issuedDate: Date
  certificateCode: string
}

export async function generateMentorCertificatePdf(data: MentorCertificatePdfData): Promise<Buffer> {
  // @react-pdf/renderer is ESM-only; the backend compiles to CommonJS, so it must be
  // loaded via dynamic import() rather than a static import, or `require()` crashes in production.
  const reactPdf = await import('@react-pdf/renderer')
  const { renderToBuffer } = reactPdf

  const issuedDateFormatted = data.issuedDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const element = buildMentorCertificateDocument(reactPdf, {
    mentorName: data.mentorName,
    issuedDateFormatted,
    certificateCode: data.certificateCode,
  })

  return renderToBuffer(element as any)
}
