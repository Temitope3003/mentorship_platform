import { Request, Response } from 'express'
import { prisma } from '../models/prisma'
import { sendFeedbackEmail } from '../emails/feedbackEmail'
import { sendMentorAlertEmail } from '../emails/mentorAlertEmail'
import { generateAccessCode } from '../services/assessmentService'
import { sendWelcomeEmail } from '../emails/welcomeEmail'

interface AuthRequest extends Request {
  mentorId?: string
}

function getCurrentWeek(startDate: Date): number {
  const diffMs = Date.now() - new Date(startDate).getTime()
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1
  return Math.max(1, Math.min(48, diffWeeks))
}

export async function getAllMentees(req: AuthRequest, res: Response) {
  try {
    const mentees = await prisma.mentee.findMany({
      where: { isActive: true },
      include: { submissions: { select: { weekNumber: true } } },
      orderBy: { createdAt: 'desc' },
    })

    const result = mentees.map(m => ({
      id: m.id,
      name: m.name,
      email: m.email,
      accessCode: m.accessCode,
      domainTrack: m.domainTrack,
      currentWeek: getCurrentWeek(m.startDate),
      submissionsCount: m.submissions.length,
      isActive: m.isActive,
      startDate: m.startDate,
      topMatch: m.topMatch,
      alignmentStatus: m.alignmentStatus,
    }))

    return res.json(result)
  } catch (error) {
    console.error('Get all mentees error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getMentee(req: AuthRequest, res: Response) {
  try {
    const mentee = await prisma.mentee.findUnique({
      where: { id: String(req.params.id) },
      include: {
        submissions: { orderBy: { weekNumber: 'asc' } },
      },
    })
    if (!mentee) return res.status(404).json({ error: 'Mentee not found' })
    return res.json(mentee)
  } catch (error) {
    console.error('Get mentee error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function createMentee(req: AuthRequest, res: Response) {
  try {
    const { name, email, domain } = req.body
    if (!name || !email || !domain) {
      return res.status(400).json({ error: 'Name, email, and domain are required' })
    }

    const existing = await prisma.mentee.findUnique({ where: { email } })
    if (existing) return res.status(400).json({ error: 'A mentee with this email already exists' })

    const existingCodes = await prisma.mentee.findMany({ select: { accessCode: true } })
    const codes = existingCodes.map(m => m.accessCode)
    const accessCode = generateAccessCode(name, codes)

    const mentee = await prisma.mentee.create({
      data: { name, email, accessCode, domainTrack: domain, topMatch: domain, isActive: true },
    })

    sendWelcomeEmail({
      name: mentee.name,
      email: mentee.email,
      accessCode: mentee.accessCode,
      topMatch: mentee.domainTrack,
      secondMatch: mentee.domainTrack,
    }).catch(err => console.error('Welcome email error:', err.message))

    return res.status(201).json(mentee)
  } catch (error) {
    console.error('Create mentee error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getAllSubmissions(req: AuthRequest, res: Response) {
  try {
    const submissions = await prisma.weeklySubmission.findMany({
      include: { mentee: { select: { name: true, email: true, domainTrack: true } } },
      orderBy: { submittedAt: 'desc' },
    })
    return res.json(submissions)
  } catch (error) {
    console.error('Get all submissions error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function addFeedback(req: AuthRequest, res: Response) {
  try {
    const { feedback } = req.body
    const submissionId = String(req.params.id)

    if (!feedback || feedback.trim().length < 10) {
      return res.status(400).json({ error: 'Feedback must be at least 10 characters' })
    }

    const submission = await prisma.weeklySubmission.update({
      where: { id: submissionId },
      data: { mentorFeedback: feedback.trim(), feedbackAt: new Date() },
      include: { mentee: true },
    })

    sendFeedbackEmail({
      name: submission.mentee.name,
      email: submission.mentee.email,
      weekNumber: submission.weekNumber,
      feedback: feedback.trim(),
    }).catch(err => console.error('Feedback email error:', err.message))

    return res.json(submission)
  } catch (error) {
    console.error('Add feedback error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getCohortStats(req: AuthRequest, res: Response) {
  try {
    const mentees = await prisma.mentee.findMany({
      where: { isActive: true },
      include: { submissions: { select: { weekNumber: true, submittedAt: true } } },
    })

    const totalMentees = mentees.length
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const submissionsThisWeek = mentees.reduce((sum, m) => {
      return sum + m.submissions.filter(s => s.submittedAt > oneWeekAgo).length
    }, 0)

    const atRisk = mentees.filter(m => {
      const currentWeek = getCurrentWeek(m.startDate)
      const lastSubmitted = m.submissions.length > 0
        ? Math.max(...m.submissions.map(s => s.weekNumber))
        : 0
      return currentWeek - lastSubmitted >= 2
    }).length

    const engagementRate = totalMentees > 0
      ? Math.round((submissionsThisWeek / totalMentees) * 100)
      : 0

    return res.json({
      totalMentees,
      submissionsThisWeek,
      engagementRate,
      atRisk,
    })
  } catch (error) {
    console.error('Get cohort stats error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getAccessCodes(req: AuthRequest, res: Response) {
  try {
    const mentees = await prisma.mentee.findMany({
      where: { isActive: true },
      select: { id: true, name: true, email: true, accessCode: true, domainTrack: true },
      orderBy: { createdAt: 'desc' },
    })
    return res.json(mentees)
  } catch (error) {
    console.error('Get access codes error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function updateMentee(req: AuthRequest, res: Response) {
  try {
    const domain = Array.isArray(req.body.domain) ? req.body.domain[0] : req.body.domain
    if (!domain) return res.status(400).json({ error: 'Domain is required' })

    const mentee = await prisma.mentee.update({
      where: { id: String(req.params.id) },
      data: {
        domainTrack: domain as string,
        topMatch: domain as string,
      },
    })
    return res.json(mentee)
  } catch (error) {
    console.error('Update mentee error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}