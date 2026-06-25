import React from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import { RecommendationLetterDocument } from '../pdf/recommendationLetterTemplate'

interface RecommendationLetterPdfData {
  menteeName: string
  domainTrack: string
  completionDate: Date
  letterContent: string
}

export async function generateRecommendationLetterPdf(data: RecommendationLetterPdfData): Promise<Buffer> {
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

  const element = React.createElement(RecommendationLetterDocument, {
    menteeName: data.menteeName,
    domainTrack: data.domainTrack,
    completionDateFormatted,
    letterContent: data.letterContent,
    issuedDateFormatted,
  })

  return renderToBuffer(element as any)
}
