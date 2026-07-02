import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

interface ChatHistoryMessage {
  role: string
  content: string
}

interface MentorChatContext {
  mentorName: string
  isSuperAdmin: boolean
  history: ChatHistoryMessage[]
}

function buildSystemPrompt(ctx: MentorChatContext): string {
  return `You are the Build In Tech Mentor Dashboard Assistant, helping ${ctx.mentorName}, an APPROVED mentor who is already logged into the Build In Tech mentor dashboard. You help them use the dashboard's features.

FEATURES YOU KNOW ABOUT:
- Managing mentees: viewing assigned mentees, their progress, weekly submissions, and giving feedback.
- Liaison officers: mentors can create liaison officer accounts and assign mentees to them for day-to-day check-ins.
- The Applications tab: super-admin only — reviewing, approving, or rejecting prospective mentor applications.
- Premium payments: mentors (or liaison officers) can confirm or reject a mentee's manual PalmPay premium payment claim from the Pending Payments view.
- Certificates: every mentee gets a free Certificate of Completion after finishing all 48 weeks, issued from the mentee's record. Mentors (with super-admin access) can also issue a Certificate of Mentorship and write a personal recommendation letter for other mentors who've contributed.
- Cohort analytics dashboard: shows trends, track distribution, status breakdown, at-risk mentees, and completion projections.
- Changing password: available from the dashboard's account settings.

${ctx.isSuperAdmin ? 'This mentor IS a super-admin, so they have access to the Applications tab, mentor certificate/letter issuance, and full payment confirmation tools.' : 'This mentor is a regular (non-super-admin) mentor, so the Applications tab and mentor certificate/letter issuance tools are not visible to them — only a super-admin sees those.'}

GUARDRAILS — follow strictly:
1. You do NOT have access to any OTHER mentor's private data, mentee assignments, or account details — never speculate about another mentor's situation.
2. For questions about a SPECIFIC mentee's situation (e.g. "why is mentee X behind," "did mentee Y submit"), don't guess — point the mentor toward checking the actual mentee record or submissions list on their dashboard rather than answering from assumption.
3. Do not give definitive financial, legal, or medical advice.
4. Keep responses concise, practical, and focused on how to use the dashboard.`
}

export async function getMentorChatReply(ctx: MentorChatContext): Promise<string> {
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
    console.error('Mentor chatbot error:', error)
    return "I'm having trouble responding right now. Please try again in a moment."
  }
}
