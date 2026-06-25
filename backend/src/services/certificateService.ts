import { buildCertificateDocument } from '../pdf/certificateTemplate'

interface CertificatePdfData {
  menteeName: string
  domainTrack: string
  completionDate: Date
  certificateCode: string
}

export async function generateCertificatePdf(data: CertificatePdfData): Promise<Buffer> {
  // @react-pdf/renderer is ESM-only; the backend compiles to CommonJS, so it must be
  // loaded via dynamic import() rather than a static import, or `require()` crashes in production.
  const reactPdf = await import('@react-pdf/renderer')
  const { renderToBuffer } = reactPdf

  const completionDateFormatted = data.completionDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const element = buildCertificateDocument(reactPdf, {
    menteeName: data.menteeName,
    domainTrack: data.domainTrack,
    completionDateFormatted,
    certificateCode: data.certificateCode,
  })

  return renderToBuffer(element as any)
}
