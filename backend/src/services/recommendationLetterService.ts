import { buildRecommendationLetterDocument } from '../pdf/recommendationLetterTemplate'

interface RecommendationLetterPdfData {
  menteeName: string
  domainTrack: string
  completionDate: Date
  letterContent: string
}

export async function generateRecommendationLetterPdf(data: RecommendationLetterPdfData): Promise<Buffer> {
  // @react-pdf/renderer is ESM-only; the backend compiles to CommonJS, so it must be
  // loaded via dynamic import() rather than a static import, or `require()` crashes in production.
  const reactPdf = await import('@react-pdf/renderer')
  const { renderToBuffer } = reactPdf

  const completionDateFormatted = data.completionDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const issuedDateFormatted = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const element = buildRecommendationLetterDocument(reactPdf, {
    menteeName: data.menteeName,
    domainTrack: data.domainTrack,
    completionDateFormatted,
    letterContent: data.letterContent,
    issuedDateFormatted,
  })

  return renderToBuffer(element as any)
}
