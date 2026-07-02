import { prisma } from '../models/prisma'

const DOMAIN_KEYWORDS: Record<string, string[]> = {
  'AI & Machine Learning': [
    'machine learning', 'ml engineer', 'ai engineer', 'deep learning', 'nlp',
    'computer vision', 'pytorch', 'tensorflow', 'llm', 'artificial intelligence',
    'large language model', 'generative ai', 'ai/ml', 'data modeling',
  ],
  'Data Analysis': [
    'data analyst', 'business analyst', 'bi analyst', 'power bi', 'tableau',
    'sql analyst', 'data visualization', 'analytics engineer', 'reporting analyst',
    'business intelligence',
  ],
  'Data Science & Engineering': [
    'data scientist', 'data engineer', 'etl', 'spark', 'hadoop', 'dbt',
    'data warehouse', 'data platform', 'data pipeline', 'databricks', 'snowflake',
  ],
  'Full Stack Engineering': [
    'full stack', 'fullstack', 'full-stack engineer', 'full-stack developer',
  ],
  'Frontend Development': [
    'frontend', 'front-end', 'react developer', 'vue developer', 'angular developer',
    'ui developer', 'javascript developer', 'next.js developer', 'typescript developer',
    'svelte', 'web developer',
  ],
  'Backend Development': [
    'backend', 'back-end', 'node.js developer', 'python developer', 'django',
    'fastapi', 'spring boot', 'golang', 'ruby on rails', 'api developer',
    'server-side', 'php developer', 'laravel', '.net developer', 'java developer',
  ],
  'Cloud & Infrastructure': [
    'cloud engineer', 'devops', 'aws', 'azure', 'gcp', 'kubernetes', 'terraform',
    'site reliability', 'sre', 'platform engineer', 'infrastructure engineer',
    'cloud architect', 'docker', 'linux engineer',
  ],
  'Cybersecurity': [
    'security engineer', 'cybersecurity', 'penetration tester', 'pentest',
    'security analyst', 'soc analyst', 'vulnerability', 'appsec',
    'information security', 'infosec', 'security operations',
  ],
  'Product, Design & UX': [
    'product designer', 'ux designer', 'ui designer', 'product manager',
    'ux researcher', 'figma', 'user experience', 'user interface design',
    'visual designer', 'interaction designer',
  ],
  'Emerging Tech': [
    'blockchain developer', 'web3', 'solidity', 'smart contract', 'defi',
    'vr developer', 'ar developer', 'xr developer', 'metaverse',
  ],
  'Virtual Assistant': [
    'virtual assistant', 'executive assistant', 'administrative assistant',
    'remote assistant', 'online assistant', 'personal assistant',
  ],
  'AI Automation & No-Code': [
    'automation engineer', 'rpa developer', 'no-code', 'low-code', 'zapier',
    'make.com', 'n8n', 'workflow automation', 'airtable developer',
    'process automation',
  ],
  'DevRel & Technical Writing': [
    'developer relations', 'devrel', 'developer advocate', 'technical writer',
    'documentation', 'developer evangelist', 'developer experience', 'devex',
    'technical content', 'api documentation',
  ],
  'Mobile Development': [
    'ios developer', 'android developer', 'react native', 'flutter developer',
    'mobile developer', 'swift developer', 'kotlin developer', 'swiftui',
    'mobile engineer',
  ],
  'DevSecOps': [
    'devsecops', 'security devops', 'secure sdlc', 'sast', 'dast',
    'container security', 'cloud security engineer', 'appsec engineer',
  ],
}

function assignDomainTrack(title: string, tags: string[], description: string): string | null {
  const haystack = `${title} ${tags.join(' ')} ${description}`.toLowerCase()
  let best: string | null = null
  let bestScore = 0

  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    let score = 0
    for (const kw of keywords) {
      if (haystack.includes(kw)) score++
    }
    if (score > bestScore) {
      bestScore = score
      best = domain
    }
  }

  return bestScore >= 1 ? best : null
}

async function fetchRemoteOK(): Promise<number> {
  const res = await fetch('https://remoteok.com/api', {
    headers: { 'User-Agent': 'BuildInTech-JobFetcher/1.0' },
  })
  if (!res.ok) throw new Error(`RemoteOK returned ${res.status}`)
  const data = (await res.json()) as any[]

  let added = 0
  for (const job of data) {
    if (!job.id || !job.position || !job.company || !job.url) continue

    const tags: string[] = Array.isArray(job.tags) ? job.tags : []
    const description: string = job.description || ''
    const domainTrack = assignDomainTrack(job.position, tags, description)
    if (!domainTrack) continue

    const externalId = `remoteok_${job.id}`
    await prisma.jobListing.upsert({
      where: { externalId },
      update: {},
      create: {
        externalId,
        title: job.position,
        company: job.company,
        location: null,
        isRemote: true,
        url: job.url,
        source: 'RemoteOK',
        domainTrack,
        postedAt: job.date ? new Date(job.date) : null,
      },
    })
    added++
  }
  return added
}

async function fetchArbeitnow(): Promise<number> {
  const res = await fetch('https://www.arbeitnow.com/api/job-board-api', {
    headers: { 'User-Agent': 'BuildInTech-JobFetcher/1.0' },
  })
  if (!res.ok) throw new Error(`Arbeitnow returned ${res.status}`)
  const body = (await res.json()) as { data: any[] }

  let added = 0
  for (const job of body.data || []) {
    if (!job.slug || !job.title || !job.company_name || !job.url) continue

    const tags: string[] = Array.isArray(job.tags) ? job.tags : []
    const description: string = job.description || ''
    const domainTrack = assignDomainTrack(job.title, tags, description)
    if (!domainTrack) continue

    const externalId = `arbeitnow_${job.slug}`
    await prisma.jobListing.upsert({
      where: { externalId },
      update: {},
      create: {
        externalId,
        title: job.title,
        company: job.company_name,
        location: job.location || null,
        isRemote: job.remote === true,
        url: job.url,
        source: 'Arbeitnow',
        domainTrack,
        postedAt: job.created_at ? new Date(job.created_at * 1000) : null,
      },
    })
    added++
  }
  return added
}

export async function fetchAndStoreJobs(): Promise<{ added: number; errors: string[] }> {
  const errors: string[] = []
  let added = 0

  try {
    added += await fetchRemoteOK()
  } catch (err: any) {
    errors.push(`RemoteOK: ${err.message}`)
  }

  try {
    added += await fetchArbeitnow()
  } catch (err: any) {
    errors.push(`Arbeitnow: ${err.message}`)
  }

  return { added, errors }
}
