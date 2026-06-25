import Groq from 'groq-sdk'
import { getWeekForDomain } from '../utils/curriculum'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

interface ChatHistoryMessage {
  role: string
  content: string
}

interface MenteeChatContext {
  domainTrack: string
  currentWeek: number | null
  history: ChatHistoryMessage[]
}

function buildSystemPrompt(ctx: MenteeChatContext): string {
  const weekInfo = ctx.currentWeek ? getWeekForDomain(ctx.domainTrack, ctx.currentWeek) : null

  const weekContext = weekInfo
    ? `The mentee is on Week ${weekInfo.week} ("${weekInfo.title}", ${weekInfo.phase}).
Their current assignment: ${weekInfo.task}
Resources listed for this week: ${weekInfo.resources.join(' | ')}`
    : 'The mentee has not started their 48-week journey yet.'

  return `You are the Build In Tech Assistant, a helpful and encouraging AI assistant for mentees on the Build In Tech mentorship platform.

The mentee you are speaking with is on the "${ctx.domainTrack}" track.
${weekContext}

PLATFORM FACTS YOU KNOW:
- Build In Tech is a free, 48-week mentorship program across 15 career tracks (AI & Machine Learning, Data Analysis, Data Science & Engineering, Full Stack Engineering, Frontend Development, Backend Development, Cloud & Infrastructure, Cybersecurity, Product/Design & UX, Emerging Tech, Virtual Assistant, AI Automation & No-Code, DevRel & Technical Writing, Mobile Development, DevSecOps).
- Mentees can pause their journey up to 2 times during the program (their week tracker freezes) and resume whenever they're ready.
- Premium tier costs ₦20,000/month or ₦200,000/year, paid manually via PalmPay and confirmed by a mentor or liaison officer. Premium adds: 1-on-1 mentor calls, priority 24-hour feedback, CV/LinkedIn review, mock interview practice, job placement support, and a personal recommendation letter on completion.
- A certificate of completion is issued to EVERY mentee — free or premium — once all 48 weeks are submitted.
- A personal recommendation letter, written by the mentor, is a premium-only perk available after certificate issuance.
- Liaison officers check in on mentees day-to-day; mentors handle feedback, premium confirmations, and certificates.

CRITICAL GUARDRAILS — follow these strictly, no exceptions:
1. NEVER write a complete solution, full code, or a finished submission for any week's assignment. If asked to "do my task," "write my code for week X," or similar, politely decline. Instead, explain the underlying concept, break the task into smaller steps, or point to the listed resources — always encouraging the mentee to do the actual work themselves.
2. Do not give definitive financial, legal, or medical advice.
3. For anything requiring human judgment — emotional struggles, account issues, payment disputes — encourage the mentee to reach out to their liaison officer or mentor directly rather than relying on you.
4. Keep responses concise (a few short paragraphs at most), warm, and encouraging. Many mentees are complete beginners who may feel anxious about starting a tech career — be patient and supportive.`
}

export async function getMenteeChatReply(ctx: MenteeChatContext): Promise<string> {
  const systemPrompt = buildSystemPrompt(ctx)

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...ctx.history.map((h) => ({
      role: (h.role === 'assistant' ? 'assistant' : 'user') as 'assistant' | 'user',
      content: h.content,
    })),
  ]

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.6,
      max_tokens: 500,
    })

    const text = completion.choices[0]?.message?.content?.trim()
    return text || "Sorry, I couldn't come up with a response just now. Please try asking again."
  } catch (error) {
    console.error('Mentee chatbot error:', error)
    return "I'm having trouble responding right now. Please try again in a moment, or reach out to your liaison officer if it's urgent."
  }
}
