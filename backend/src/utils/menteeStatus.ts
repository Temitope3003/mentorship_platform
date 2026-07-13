export interface MenteeTimeline {
  hasStarted: boolean
  isPaused: boolean
  startDate: Date
}

export type MenteeStatusLabel = 'NOT_STARTED' | 'PAUSED' | 'AT_RISK' | 'ON_TRACK'

export function getCurrentWeek(
  mentee: { hasStarted: boolean },
  submissions: { weekNumber: number }[]
): number | null {
  if (!mentee.hasStarted) return null
  if (submissions.length === 0) return 1
  const highest = Math.max(...submissions.map(s => s.weekNumber))
  return Math.min(48, highest + 1)
}

export function getDaysSinceLastSubmission(
  mentee: MenteeTimeline,
  submissions: { weekNumber: number; submittedAt: Date }[]
): number {
  if (!mentee.hasStarted || mentee.isPaused) return 0
  const referenceDate = submissions.length > 0
    ? submissions.reduce((d, s) => (new Date(s.submittedAt) > d ? new Date(s.submittedAt) : d), new Date(0))
    : new Date(mentee.startDate)
  return Math.floor((Date.now() - referenceDate.getTime()) / (24 * 60 * 60 * 1000))
}

export function getMenteeStatusLabel(
  mentee: MenteeTimeline,
  submissions: { weekNumber: number; submittedAt: Date }[]
): MenteeStatusLabel {
  if (!mentee.hasStarted) return 'NOT_STARTED'
  if (mentee.isPaused) return 'PAUSED'
  return getDaysSinceLastSubmission(mentee, submissions) >= 10 ? 'AT_RISK' : 'ON_TRACK'
}
