import { Request, Response } from 'express'
import { prisma } from '../models/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

interface AuthRequest extends Request {
  liaisonId?: string
}

function getCurrentWeek(startDate: Date): number {
  const diffMs = Date.now() - new Date(startDate).getTime()
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1
  return Math.max(1, Math.min(48, diffWeeks))
}

export async function loginLiaison(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const officer = await prisma.liaisonOfficer.findUnique({ where: { email } })
    if (!officer) return res.status(401).json({ error: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, officer.passwordHash)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

    if (!officer.isActive) return res.status(403).json({ error: 'Account is inactive' })

    const token = jwt.sign(
      { liaisonId: officer.id },
      process.env.JWT_SECRET as string,
      { expiresIn: '8h' }
    )

    return res.json({
      token,
      officer: { id: officer.id, name: officer.name, email: officer.email },
    })
  } catch (error) {
    console.error('Liaison login error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getLiaisonDashboard(req: AuthRequest, res: Response) {
  try {
    const officer = await prisma.liaisonOfficer.findUnique({
      where: { id: req.liaisonId },
      include: {
        mentees: {
          where: { isActive: true },
          include: {
            submissions: { select: { weekNumber: true, submittedAt: true } },
          },
        },
      },
    })

    if (!officer) return res.status(404).json({ error: 'Officer not found' })

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const submitted = officer.mentees.filter(m =>
      m.submissions.some(s => new Date(s.submittedAt) > oneWeekAgo)
    )

    const notSubmitted = officer.mentees.filter(m =>
      !m.submissions.some(s => new Date(s.submittedAt) > oneWeekAgo)
    )

    const atRisk = officer.mentees.filter(m => {
      const currentWeek = getCurrentWeek(m.startDate)
      const lastSubmitted = m.submissions.length > 0
        ? Math.max(...m.submissions.map(s => s.weekNumber))
        : 0
      return currentWeek - lastSubmitted >= 2
    })

    return res.json({
      officer: { id: officer.id, name: officer.name, email: officer.email },
      summary: {
        total: officer.mentees.length,
        submittedCount: submitted.length,
        notSubmittedCount: notSubmitted.length,
        atRiskCount: atRisk.length,
        engagementRate: officer.mentees.length > 0
          ? Math.round((submitted.length / officer.mentees.length) * 100)
          : 0,
      },
      submitted: submitted.map(m => ({
        id: m.id,
        name: m.name,
        email: m.email,
        accessCode: m.accessCode,
        domainTrack: m.domainTrack,
        currentWeek: getCurrentWeek(m.startDate),
        lastSubmission: m.submissions
          .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0],
      })),
      notSubmitted: notSubmitted.map(m => ({
        id: m.id,
        name: m.name,
        email: m.email,
        accessCode: m.accessCode,
        domainTrack: m.domainTrack,
        currentWeek: getCurrentWeek(m.startDate),
        lastSubmittedWeek: m.submissions.length > 0
          ? Math.max(...m.submissions.map(s => s.weekNumber))
          : 0,
      })),
      atRisk: atRisk.map(m => ({
        id: m.id,
        name: m.name,
        email: m.email,
        accessCode: m.accessCode,
        domainTrack: m.domainTrack,
        currentWeek: getCurrentWeek(m.startDate),
        lastSubmittedWeek: m.submissions.length > 0
          ? Math.max(...m.submissions.map(s => s.weekNumber))
          : 0,
        weeksBehind: getCurrentWeek(m.startDate) - (m.submissions.length > 0
          ? Math.max(...m.submissions.map(s => s.weekNumber))
          : 0),
      })),
    })
  } catch (error) {
    console.error('Liaison dashboard error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getLiaisonMentees(req: AuthRequest, res: Response) {
  try {
    const mentees = await prisma.mentee.findMany({
      where: { liaisonOfficerId: req.liaisonId, isActive: true },
      include: {
        submissions: { select: { weekNumber: true, submittedAt: true } },
      },
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
      lastSubmittedWeek: m.submissions.length > 0
        ? Math.max(...m.submissions.map(s => s.weekNumber))
        : 0,
      startDate: m.startDate,
      notes: m.liaisonNotes,
    }))

    return res.json(result)
  } catch (error) {
    console.error('Liaison mentees error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function updateMenteeNotes(req: AuthRequest, res: Response) {
  try {
    const { notes } = req.body
    const mentee = await prisma.mentee.findFirst({
      where: { id: String(req.params.id), liaisonOfficerId: req.liaisonId },
    })

    if (!mentee) return res.status(404).json({ error: 'Mentee not found' })

    const updated = await prisma.mentee.update({
      where: { id: String(req.params.id) },
      data: { liaisonNotes: notes },
    })

    return res.json(updated)
  } catch (error) {
    console.error('Update notes error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function sendCheckin(req: AuthRequest, res: Response) {
  try {
    const mentee = await prisma.mentee.findFirst({
      where: { id: String(req.params.id), liaisonOfficerId: req.liaisonId },
    })

    if (!mentee) return res.status(404).json({ error: 'Mentee not found' })

    const officer = await prisma.liaisonOfficer.findUnique({
      where: { id: req.liaisonId },
    })

    const { sendEmail } = await import('../emails/sender')
    await sendEmail({
      to: mentee.email,
      subject: `Checking in on your progress — ${mentee.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #d4622a;">Hey ${mentee.name},</h2>
          <p>This is ${officer?.name} from the Build In Tech mentorship team.</p>
          <p>I noticed you have not submitted your weekly work recently and I just wanted to check in. How are you getting on with your ${mentee.domainTrack} curriculum?</p>
          <p>If you are stuck on anything, behind on time, or just need some encouragement, please reply to this email. That is what we are here for.</p>
          <p>Remember your dashboard is always available at <a href="https://buildintech.xyz/login">buildintech.xyz/login</a> using your access code <strong>${mentee.accessCode}</strong>.</p>
          <p>We believe in you. Keep going.</p>
          <br/>
          <p>${officer?.name}<br/>Build In Tech Liaison Officer</p>
        </div>
      `,
    })

    return res.json({ message: 'Check-in email sent successfully' })
  } catch (error) {
    console.error('Send checkin error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}