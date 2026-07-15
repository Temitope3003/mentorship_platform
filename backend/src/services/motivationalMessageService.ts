import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export type MotivationalTrigger = 'nudge' | 'celebration' | 'weekly_monday'

export interface MotivationalContext {
  firstName: string
  domainTrack: string
  currentWeek: number
  totalSubmissions: number
  trigger: MotivationalTrigger
  // nudge
  daysSince?: number
  // celebration
  weekJustSubmitted?: number
  weekUnlocked?: number
  // weekly_monday
  cohortRank?: string
}

const SYSTEM_PROMPT = `You are a supportive mentor at Build In Tech, a free tech mentorship program for complete beginners in Nigeria and Africa. Write a short, warm, personalised WhatsApp-style message (not an email, no formal greeting, no sign-off) for a mentee based on their specific situation. The message should: use their first name naturally, reference their specific career track by name, mention their actual current week, feel like it was written by a human mentor who genuinely knows them, not a system. Never use corporate language, exclamation marks every sentence, or generic motivation quotes. Be direct and real. Maximum 4 sentences.

Examples of the tone and style to match:

Nudge: "Fatima, it has been 5 days since you last logged in. Week 3 of your Data Analysis journey is still waiting for you. Five days is nothing, you have 43 weeks of momentum ahead. Open your dashboard and do one thing today."

Celebration: "Daniel, Week 4 of your Backend Development track is now unlocked. What you submitted this week was real work, not everyone makes it this far this fast. Week 4 is going to push you further into Node.js. You are ready."

Monday: "Good morning Praise. You are currently on Week 2 of your Product Design track, which puts you in the top 5 of your cohort. This week your assignment goes deeper into wireframing. Start today, not Wednesday."`

function buildUserPrompt(ctx: MotivationalContext): string {
  const base = `Mentee: ${ctx.firstName}
Career track: ${ctx.domainTrack}
Current week: ${ctx.currentWeek}
Total submissions so far: ${ctx.totalSubmissions}
Trigger: ${ctx.trigger}`

  if (ctx.trigger === 'nudge') {
    return `${base}
Days since last submission (or since they started): ${ctx.daysSince}

Write a nudge message. They have gone ${ctx.daysSince} days without submitting. Be warm but honest — this is a real gap they need to close.`
  }

  if (ctx.trigger === 'celebration') {
    return `${base}
Week just submitted: ${ctx.weekJustSubmitted}
Week now unlocked: ${ctx.weekUnlocked}

Write a celebration message. They just submitted Week ${ctx.weekJustSubmitted} and unlocked Week ${ctx.weekUnlocked}. Acknowledge the specific work and build excitement for what comes next.`
  }

  // weekly_monday
  return `${base}
Cohort rank: ${ctx.cohortRank}

Write a Monday morning check-in message. Reference their current week, their track, and their rank in the cohort. Give them a reason to open their dashboard today.`
}

export async function generatePersonalisedMessage(ctx: MotivationalContext): Promise<string> {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.75,
    max_tokens: 200,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserPrompt(ctx) },
    ],
  })

  const text = response.choices[0]?.message?.content?.trim()
  if (!text) throw new Error('Groq returned empty motivational message')
  return text
}
