import { prisma } from '../models/prisma'

export class TrackChangeError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

/**
 * Shared track-change logic used by both the authenticated mentee dashboard
 * (PATCH /mentee/me/track) and the unauthenticated assessment-results flow
 * (PATCH /assessment/:token/track). Only the caller's way of resolving a
 * menteeId differs — this rule is identical either way: a track can only be
 * changed before the mentee has submitted any work.
 */
export async function changeMenteeTrack(menteeId: string, domain: string) {
  const mentee = await prisma.mentee.findUnique({
    where: { id: menteeId },
    include: { submissions: { select: { id: true }, take: 1 } },
  })

  if (!mentee) {
    throw new TrackChangeError(404, 'Mentee not found')
  }

  if (mentee.submissions.length > 0) {
    throw new TrackChangeError(403, 'Track cannot be changed after you have started submitting work')
  }

  return prisma.mentee.update({
    where: { id: menteeId },
    data: { domainTrack: domain, topMatch: domain },
  })
}
