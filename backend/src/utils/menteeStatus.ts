export interface MenteeTimeline {
  hasStarted: boolean
  startDate: Date
  isPaused: boolean
  pausedAt: Date | null
  totalPausedDays: number
}

export type MenteeStatusLabel = 'NOT_STARTED' | 'PAUSED' | 'AT_RISK' | 'ON_TRACK'

/**
 * Returns null for a mentee who has not started — hasStarted is always the source
 * of truth, regardless of startDate or any existing submissions.
 */
export function getCurrentWeek(mentee: MenteeTimeline): number | null {
  if (!mentee.hasStarted) return null

  const now = Date.now()
  const ongoingPauseMs = mentee.isPaused && mentee.pausedAt
    ? now - new Date(mentee.pausedAt).getTime()
    : 0
  const totalPausedMs = mentee.totalPausedDays * 24 * 60 * 60 * 1000 + ongoingPauseMs

  const diffMs = now - new Date(mentee.startDate).getTime() - totalPausedMs
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1
  return Math.max(1, Math.min(48, diffWeeks))
}

export function getMenteeStatusLabel(mentee: MenteeTimeline, lastSubmittedWeek: number): MenteeStatusLabel {
  if (!mentee.hasStarted) return 'NOT_STARTED'
  if (mentee.isPaused) return 'PAUSED'
  const currentWeek = getCurrentWeek(mentee) ?? 1
  return currentWeek - lastSubmittedWeek >= 2 ? 'AT_RISK' : 'ON_TRACK'
}

/** Weeks behind only applies to mentees who have started and are not paused. */
export function getWeeksBehind(mentee: MenteeTimeline, lastSubmittedWeek: number): number {
  if (!mentee.hasStarted || mentee.isPaused) return 0
  const currentWeek = getCurrentWeek(mentee) ?? 1
  return Math.max(0, currentWeek - lastSubmittedWeek)
}
