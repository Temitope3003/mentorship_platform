import { Request, Response } from 'express'
import { prisma } from '../models/prisma'
import { getCurriculumForDomain, getWeekForDomain } from '../utils/curriculum'
import { sendConfirmationEmail } from '../emails/confirmationEmail'

interface AuthRequest extends Request {
  menteeId?: string
}

function getCurrentWeek(startDate: Date): number {
  const diffMs = Date.now() - new Date(startDate).getTime()
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1
  return Math.max(1, Math.min(48, diffWeeks))
}

export async function getProfile(req: AuthRequest, res: Response) {
  try {
    const mentee = await prisma.mentee.findUnique({
      where: { id: req.menteeId },
    })
    if (!mentee) return res.status(404).json({ error: 'Mentee not found' })
    return res.json(mentee)
  } catch (error) {
    console.error('Get profile error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getRoadmap(req: AuthRequest, res: Response) {
  try {
    const mentee = await prisma.mentee.findUnique({
      where: { id: req.menteeId },
    })
    if (!mentee) return res.status(404).json({ error: 'Mentee not found' })

    const currentWeek = getCurrentWeek(mentee.startDate)
    const curriculum = getCurriculumForDomain(mentee.domainTrack)

    const submissions = await prisma.weeklySubmission.findMany({
      where: { menteeId: req.menteeId },
      select: { weekNumber: true },
    })
    const submittedWeeks = submissions.map(s => s.weekNumber)

    const weeks = curriculum.map(week => ({
      ...week,
      isSubmitted: submittedWeeks.includes(week.week),
      isCurrent: week.week === currentWeek,
      isLocked: week.week > currentWeek,
    }))

    return res.json({
      domain: mentee.domainTrack,
      currentWeek,
      totalWeeks: 48,
      weeks,
    })
  } catch (error) {
    console.error('Get roadmap error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getSubmissions(req: AuthRequest, res: Response) {
  try {
    const submissions = await prisma.weeklySubmission.findMany({
      where: { menteeId: req.menteeId },
      orderBy: { weekNumber: 'asc' },
    })
    return res.json(submissions)
  } catch (error) {
    console.error('Get submissions error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function createSubmission(req: AuthRequest, res: Response) {
  try {
    const { weekNumber, summary, workDone, link } = req.body

    if (!summary || summary.trim().length < 20) {
      return res.status(400).json({ error: 'Summary is required and must be at least 20 characters' })
    }
    if (!workDone || workDone.trim().length < 20) {
      return res.status(400).json({ error: 'Work done is required and must be at least 20 characters' })
    }
    if (!weekNumber || weekNumber < 1 || weekNumber > 48) {
      return res.status(400).json({ error: 'Week number must be between 1 and 48' })
    }

    const mentee = await prisma.mentee.findUnique({
      where: { id: req.menteeId },
    })
    if (!mentee) return res.status(404).json({ error: 'Mentee not found' })

    const currentWeek = getCurrentWeek(mentee.startDate)
    if (weekNumber > currentWeek) {
      return res.status(400).json({ error: 'You cannot submit a future week' })
    }

    if (link && link.trim()) {
      try { new URL(link) } catch {
        return res.status(400).json({ error: 'Link must be a valid URL' })
      }
    }

    const submission = await prisma.weeklySubmission.upsert({
      where: { menteeId_weekNumber: { menteeId: req.menteeId!, weekNumber } },
      update: { summary: summary.trim(), workDone: workDone.trim(), link: link?.trim() || null },
      create: { menteeId: req.menteeId!, weekNumber, summary: summary.trim(), workDone: workDone.trim(), link: link?.trim() || null },
    })

    sendConfirmationEmail({
      name: mentee.name,
      email: mentee.email,
      weekNumber,
      summary: summary.trim(),
      domain: mentee.domainTrack,
    }).catch(err => console.error('Confirmation email error:', err.message))

    return res.status(201).json(submission)
  } catch (error) {
    console.error('Create submission error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getStats(req: AuthRequest, res: Response) {
  try {
    const mentee = await prisma.mentee.findUnique({
      where: { id: req.menteeId },
    })
    if (!mentee) return res.status(404).json({ error: 'Mentee not found' })

    const submissions = await prisma.weeklySubmission.findMany({
      where: { menteeId: req.menteeId },
      orderBy: { weekNumber: 'asc' },
    })

    const currentWeek = getCurrentWeek(mentee.startDate)
    const submittedWeeks = submissions.map(s => s.weekNumber)
    const completionPct = Math.round((submissions.length / 48) * 100)

    let streak = 0
    for (let w = currentWeek; w >= 1; w--) {
      if (submittedWeeks.includes(w)) streak++
      else break
    }

    const phaseNum = currentWeek <= 12 ? 1 : currentWeek <= 24 ? 2 : currentWeek <= 36 ? 3 : 4
    const phaseNames = ['Phase 1: Foundations', 'Phase 2: Core Skills', 'Phase 3: Advanced Application', 'Phase 4: Job Readiness']
    const phaseStart = (phaseNum - 1) * 12 + 1
    const phaseProgress = Math.round(((currentWeek - phaseStart) / 12) * 100)

    return res.json({
      currentWeek,
      weeksSubmitted: submissions.length,
      weeksRemaining: 48 - submissions.length,
      completionPct,
      streakCount: streak,
      currentPhase: phaseNames[phaseNum - 1],
      phaseProgress: Math.max(0, phaseProgress),
      domain: mentee.domainTrack,
    })
  } catch (error) {
    console.error('Get stats error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function updateTrack(req: Request, res: Response) {
  try {
    const menteeId = (req as any).menteeId
    const { domain } = req.body

    if (!domain) return res.status(400).json({ error: 'Domain is required' })

    const mentee = await prisma.mentee.findUnique({
      where: { id: menteeId },
      include: { submissions: { select: { id: true }, take: 1 } },
    })

    if (!mentee) return res.status(404).json({ error: 'Mentee not found' })

    if (mentee.submissions.length > 0) {
      return res.status(403).json({ error: 'Track cannot be changed after you have started submitting work' })
    }

    const updated = await prisma.mentee.update({
      where: { id: menteeId },
      data: { domainTrack: domain, topMatch: domain },
    })

    return res.json({ message: 'Track updated successfully', mentee: updated })
  } catch (error) {
    console.error('Update track error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}