import { DOMAINS, QUESTIONS } from '../utils/questionData'

export function scoreAssessment(answers: (number | number[])[]): Record<string, number> {
  const scores: Record<string, number> = {}
  DOMAINS.forEach(d => { scores[d.name] = 0 })

  answers.forEach((answer, questionIndex) => {
    const question = QUESTIONS[questionIndex]
    if (!question) return

    const selectedIndices = Array.isArray(answer) ? answer : [answer]
    selectedIndices.forEach(index => {
      const option = question.options[index]
      if (!option) return
      Object.entries(option.scores).forEach(([domain, score]) => {
        if (scores[domain] !== undefined) {
          scores[domain] += score
        }
      })
    })
  })

  return scores
}

export function rankDomains(scores: Record<string, number>): { domain: string; score: number }[] {
  return Object.entries(scores)
    .map(([domain, score]) => ({ domain, score }))
    .sort((a, b) => b.score - a.score)
}

export function generateAccessCode(name: string, existingCodes: string[]): string {
  const prefix = name.replace(/[^a-zA-Z]/g, '').substring(0, 6).toUpperCase()
  let code = ''
  do {
    const num = Math.floor(1000 + Math.random() * 9000)
    code = `${prefix}-${num}`
  } while (existingCodes.includes(code))
  return code
}