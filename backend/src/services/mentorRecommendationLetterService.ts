import { buildMentorRecommendationLetterDocument } from '../pdf/mentorRecommendationLetterTemplate'

interface MentorRecommendationLetterPdfData {
  mentorName: string
  letterContent: string
}

export async function generateMentorRecommendationLetterPdf(data: MentorRecommendationLetterPdfData): Promise<Buffer> {
  // @react-pdf/renderer is ESM-only; the backend compiles to CommonJS, so it must be
  // loaded via dynamic import() rather than a static import, or `require()` crashes in production.
  const reactPdf = await import('@react-pdf/renderer')
  const { renderToBuffer } = reactPdf

  const issuedDateFormatted = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const element = buildMentorRecommendationLetterDocument(reactPdf, {
    mentorName: data.mentorName,
    letterContent: data.letterContent,
    issuedDateFormatted,
  })

  return renderToBuffer(element as any)
}
