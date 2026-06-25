import React from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import { CertificateDocument } from '../pdf/certificateTemplate'

interface CertificatePdfData {
  menteeName: string
  domainTrack: string
  completionDate: Date
  certificateCode: string
}

export async function generateCertificatePdf(data: CertificatePdfData): Promise<Buffer> {
  const completionDateFormatted = data.completionDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const element = React.createElement(CertificateDocument, {
    menteeName: data.menteeName,
    domainTrack: data.domainTrack,
    completionDateFormatted,
    certificateCode: data.certificateCode,
  })

  return renderToBuffer(element as any)
}
