import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Build In Tech'
const DEFAULT_IMAGE = 'https://buildintech.xyz/og-image.svg'
const BASE_URL = 'https://buildintech.xyz'

interface PageMetaProps {
  title: string
  description: string
  path?: string
  image?: string
}

export function PageMeta({ title, description, path = '', image = DEFAULT_IMAGE }: PageMetaProps) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`
  const url = `${BASE_URL}${path}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  )
}
