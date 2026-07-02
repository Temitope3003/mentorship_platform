import Groq from 'groq-sdk'
import { prisma } from '../models/prisma'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SEED_OPPORTUNITIES = [
  {
    name: 'Prolific',
    description: 'Paid research studies for verified participants. Reliable but modest pay — good for a few hours of income weekly while you build your skills.',
    url: 'https://www.prolific.com',
    category: 'Research Studies',
  },
  {
    name: 'Upwork',
    description: 'Freelance gigs that match your growing skills. Better long-term income than surveys once you have a small portfolio to show.',
    url: 'https://www.upwork.com',
    category: 'Freelance Work',
  },
  {
    name: 'Fiverr',
    description: 'Create gigs offering small services related to your track. Low barrier to entry for landing your first paid work.',
    url: 'https://www.fiverr.com',
    category: 'Freelance Work',
  },
  {
    name: 'UserTesting',
    description: 'Get paid for usability feedback on websites and apps. A good fit as you become more tech-literate — studies pay $10–$60 per session.',
    url: 'https://www.usertesting.com',
    category: 'Usability Testing',
  },
]

export async function seedDefaultOpportunities(): Promise<void> {
  for (const opp of SEED_OPPORTUNITIES) {
    const exists = await prisma.incomeOpportunity.findFirst({
      where: { url: opp.url },
    })
    if (!exists) {
      await prisma.incomeOpportunity.create({
        data: { ...opp, status: 'APPROVED', reviewedBy: 'system' },
      })
    }
  }
}

export async function researchAndProposeOpportunities(): Promise<number> {
  const prompt = `You are researching legitimate income opportunities for tech beginners, particularly in Nigeria and Africa, but open to global remote platforms.

Research and propose 3 to 5 platforms where beginners can earn money through paid research studies, micro-tasks, data labeling, freelance gigs, or remote hourly work.

RULES:
- Only include legitimate platforms. No pyramid schemes, MLM, or anything requiring upfront payment.
- Include honest, realistic income expectations in the description (e.g., "$3-$10/hr" or "₦5,000–₦20,000 per project"). Do not oversell it.
- Focus on platforms accessible from Africa or with global remote options.
- Consider platforms like: Clickworker, Appen, Remotasks, Braintrust, Turing, PeoplePerHour, Toptal, Scale AI, Outlier, DataAnnotation.tech

Respond ONLY with a JSON array, no markdown, no extra text:
[
  {
    "name": "Platform Name",
    "description": "1-2 honest sentences with realistic income expectations.",
    "url": "https://platform.com",
    "category": "one of: Research Studies, Data Labeling, Freelance Work, Remote Work, Usability Testing, Micro-tasks"
  }
]`

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
    max_tokens: 1200,
  })

  const text = completion.choices[0]?.message?.content || ''
  const clean = text.replace(/```json|```/g, '').trim()

  let proposals: { name: string; description: string; url: string; category: string }[]
  try {
    proposals = JSON.parse(clean)
  } catch {
    throw new Error(`Failed to parse Groq income research response: ${clean.slice(0, 200)}`)
  }

  let added = 0
  for (const p of proposals) {
    if (!p.name || !p.url) continue

    const exists = await prisma.incomeOpportunity.findFirst({
      where: { OR: [{ url: p.url }, { name: p.name }] },
    })
    if (exists) continue

    await prisma.incomeOpportunity.create({
      data: {
        name: p.name,
        description: p.description,
        url: p.url,
        category: p.category || 'Other',
        status: 'PENDING',
      },
    })
    added++
  }
  return added
}
