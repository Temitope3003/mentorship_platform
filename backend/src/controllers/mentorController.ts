import { Request, Response } from 'express'
import { prisma } from '../models/prisma'
import { sendFeedbackEmail } from '../emails/feedbackEmail'
import { sendMentorAlertEmail } from '../emails/mentorAlertEmail'
import { generateAccessCode } from '../services/assessmentService'
import { sendWelcomeEmail } from '../emails/welcomeEmail'
import { sendMentorApplicationAlertEmail } from '../emails/mentorApplicationAlertEmail'
import { sendMentorApprovalEmail } from '../emails/mentorApprovalEmail'
import { sendMentorRejectionEmail } from '../emails/mentorRejectionEmail'
import { getCurrentWeek, getMenteeStatusLabel, getWeeksBehind } from '../utils/menteeStatus'
import { DOMAINS } from '../utils/questionData'
import bcrypt from 'bcryptjs'
import { generateCertificateCode } from '../utils/certificateCode'
import { generateCertificatePdf } from '../services/certificateService'
import { generateRecommendationLetterPdf } from '../services/recommendationLetterService'
import { sendPremiumWelcomeEmail } from '../emails/premiumWelcomeEmail'
import { sendPaymentRejectedEmail } from '../emails/paymentRejectedEmail'
import { sendCertificateIssuedEmail } from '../emails/certificateIssuedEmail'
import { sendRecommendationLetterEmail } from '../emails/recommendationLetterEmail'

interface AuthRequest extends Request {
  mentorId?: string
}

interface MentorOrLiaisonRequest extends Request {
  mentorId?: string
  liaisonId?: string
}

export async function getAllMentees(req: AuthRequest, res: Response) {
  try {
    const mentees = await prisma.mentee.findMany({
      where: { isActive: true },
      include: { submissions: { select: { weekNumber: true } } },
      orderBy: { createdAt: 'desc' },
    })

    const result = mentees.map(m => {
      const lastSubmittedWeek = m.submissions.length > 0
        ? Math.max(...m.submissions.map(s => s.weekNumber))
        : 0
      return {
        id: m.id,
        name: m.name,
        email: m.email,
        accessCode: m.accessCode,
        domainTrack: m.domainTrack,
        currentWeek: getCurrentWeek(m),
        submissionsCount: m.submissions.length,
        isActive: m.isActive,
        startDate: m.startDate,
        topMatch: m.topMatch,
        alignmentStatus: m.alignmentStatus,
        hasStarted: m.hasStarted,
        isPaused: m.isPaused,
        pausedAt: m.pausedAt,
        pauseReason: m.pauseReason,
        status: getMenteeStatusLabel(m, lastSubmittedWeek),
        weeksBehind: getWeeksBehind(m, lastSubmittedWeek),
        liaisonOfficerId: m.liaisonOfficerId,
        plan: m.plan,
        planExpiresAt: m.planExpiresAt,
        pendingPaymentPlan: m.pendingPaymentPlan,
        hasReceivedCertificate: m.hasReceivedCertificate,
      }
    })

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
      const lastSubmitted = m.submissions.length > 0
        ? Math.max(...m.submissions.map(s => s.weekNumber))
        : 0
      return getMenteeStatusLabel(m, lastSubmitted) === 'AT_RISK'
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

export async function createLiaisonOfficer(req: AuthRequest, res: Response) {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' })
    }

    const existing = await prisma.liaisonOfficer.findUnique({ where: { email } })
    if (existing) return res.status(400).json({ error: 'An officer with this email already exists' })

    const passwordHash = await bcrypt.hash(password, 12)
    const officer = await prisma.liaisonOfficer.create({
      data: { name, email, passwordHash },
    })

    return res.status(201).json({
      id: officer.id,
      name: officer.name,
      email: officer.email,
      isActive: officer.isActive,
      createdAt: officer.createdAt,
    })
  } catch (error) {
    console.error('Create liaison officer error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getAllLiaisonOfficers(req: AuthRequest, res: Response) {
  try {
    const officers = await prisma.liaisonOfficer.findMany({
      include: {
        mentees: {
          where: { isActive: true },
          select: { id: true, name: true, domainTrack: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return res.json(officers.map(o => ({
      id: o.id,
      name: o.name,
      email: o.email,
      isActive: o.isActive,
      menteeCount: o.mentees.length,
      mentees: o.mentees,
    })))
  } catch (error) {
    console.error('Get liaison officers error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function assignMenteeToOfficer(req: AuthRequest, res: Response) {
  try {
    const { officerId } = req.body
    const mentee = await prisma.mentee.update({
      where: { id: String(req.params.id) },
      data: { liaisonOfficerId: officerId || null },
    })
    return res.json(mentee)
  } catch (error) {
    console.error('Assign mentee error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function deactivateMentee(req: AuthRequest, res: Response) {
  try {
    const mentee = await prisma.mentee.update({
      where: { id: String(req.params.id) },
      data: { isActive: false },
    })
    return res.json({ message: 'Mentee deactivated', mentee })
  } catch (error) {
    console.error('Deactivate mentee error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function deactivateLiaisonOfficer(req: AuthRequest, res: Response) {
  try {
    const officer = await prisma.liaisonOfficer.update({
      where: { id: String(req.params.id) },
      data: { isActive: false },
    })
    return res.json({ message: 'Liaison officer deactivated', officer })
  } catch (error) {
    console.error('Deactivate liaison officer error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function registerMentor(req: Request, res: Response) {
  try {
    const { name, email, password, applicationNote } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' })
    }

    if (String(password).length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }

    const normalizedEmail = String(email).toLowerCase().trim()
    const existing = await prisma.mentor.findUnique({ where: { email: normalizedEmail } })
    if (existing) {
      return res.status(400).json({ error: 'A mentor account with this email already exists' })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const mentor = await prisma.mentor.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        applicationNote: applicationNote || null,
        status: 'PENDING',
      },
    })

    sendMentorApplicationAlertEmail({
      name: mentor.name,
      email: mentor.email,
      applicationNote: mentor.applicationNote,
    }).catch(err => console.error('Mentor application alert email error:', err.message))

    return res.status(201).json({
      message: 'Your application has been submitted and is under review. We will email you once a decision has been made.',
    })
  } catch (error) {
    console.error('Register mentor error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getApplications(req: AuthRequest, res: Response) {
  try {
    const applications = await prisma.mentor.findMany({
      where: { status: 'PENDING' },
      select: {
        id: true,
        name: true,
        email: true,
        applicationNote: true,
        appliedAt: true,
      },
      orderBy: { appliedAt: 'asc' },
    })
    return res.json(applications)
  } catch (error) {
    console.error('Get applications error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function approveApplication(req: AuthRequest, res: Response) {
  try {
    const mentor = await prisma.mentor.update({
      where: { id: String(req.params.id) },
      data: { status: 'APPROVED', reviewedAt: new Date() },
    })

    sendMentorApprovalEmail({
      name: mentor.name,
      email: mentor.email,
    }).catch(err => console.error('Mentor approval email error:', err.message))

    return res.json({ message: 'Application approved', mentor: { id: mentor.id, name: mentor.name, email: mentor.email, status: mentor.status } })
  } catch (error) {
    console.error('Approve application error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function rejectApplication(req: AuthRequest, res: Response) {
  try {
    const mentor = await prisma.mentor.update({
      where: { id: String(req.params.id) },
      data: { status: 'REJECTED', reviewedAt: new Date() },
    })

    sendMentorRejectionEmail({
      name: mentor.name,
      email: mentor.email,
    }).catch(err => console.error('Mentor rejection email error:', err.message))

    return res.json({ message: 'Application rejected', mentor: { id: mentor.id, name: mentor.name, email: mentor.email, status: mentor.status } })
  } catch (error) {
    console.error('Reject application error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function changePassword(req: AuthRequest, res: Response) {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' })
    }

    if (String(newPassword).length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' })
    }

    const mentor = await prisma.mentor.findUnique({ where: { id: req.mentorId } })
    if (!mentor) return res.status(404).json({ error: 'Mentor not found' })

    const passwordValid = await bcrypt.compare(currentPassword, mentor.passwordHash)
    if (!passwordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    const passwordHash = await bcrypt.hash(newPassword, 12)
    await prisma.mentor.update({
      where: { id: mentor.id },
      data: { passwordHash },
    })

    return res.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getAnalytics(req: AuthRequest, res: Response) {
  try {
    const mentees = await prisma.mentee.findMany({
      where: { isActive: true },
      include: { submissions: { select: { weekNumber: true, submittedAt: true } } },
    })

    // ── 1. SUBMISSION TRENDS: last 12 rolling weeks ──────────────────────────
    const WEEKS_BACK = 12
    const now = Date.now()
    const submissionTrends: { weekLabel: string; count: number }[] = []
    for (let i = WEEKS_BACK - 1; i >= 0; i--) {
      const weekStart = new Date(now - i * 7 * 24 * 60 * 60 * 1000)
      weekStart.setHours(0, 0, 0, 0)
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
      const count = mentees.reduce((sum, m) => {
        return sum + m.submissions.filter(s => {
          const d = new Date(s.submittedAt)
          return d >= weekStart && d < weekEnd
        }).length
      }, 0)
      submissionTrends.push({
        weekLabel: weekStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        count,
      })
    }

    // ── 2. TRACK DISTRIBUTION: all 15 tracks, zero-filled ────────────────────
    const trackCounts: Record<string, number> = {}
    DOMAINS.forEach(d => { trackCounts[d.name] = 0 })
    mentees.forEach(m => {
      trackCounts[m.domainTrack] = (trackCounts[m.domainTrack] || 0) + 1
    })
    const trackDistribution = Object.entries(trackCounts).map(([track, count]) => ({ track, count }))

    // ── 3. STATUS BREAKDOWN + per-mentee status (reused below) ──────────────
    const statusBreakdown = { NOT_STARTED: 0, ON_TRACK: 0, AT_RISK: 0, PAUSED: 0 }
    const menteeStatuses = mentees.map(m => {
      const lastSubmittedWeek = m.submissions.length > 0
        ? Math.max(...m.submissions.map(s => s.weekNumber))
        : 0
      const status = getMenteeStatusLabel(m, lastSubmittedWeek)
      statusBreakdown[status]++
      return { mentee: m, status, lastSubmittedWeek }
    })

    // ── 4. AT-RISK LIST ───────────────────────────────────────────────────────
    const atRiskList = menteeStatuses
      .filter(x => x.status === 'AT_RISK')
      .map(x => ({
        id: x.mentee.id,
        name: x.mentee.name,
        track: x.mentee.domainTrack,
        weeksBehind: getWeeksBehind(x.mentee, x.lastSubmittedWeek),
      }))
      .sort((a, b) => b.weeksBehind - a.weeksBehind)

    // ── 5. COMPLETION RATE PROJECTION ────────────────────────────────────────
    const eligible = menteeStatuses.filter(x => x.mentee.hasStarted && !x.mentee.isPaused)
    let completionProjection: {
      eligibleCount: number
      averageCompletionPct: number
      projectedCompletionDate: string | null
      message: string | null
    }

    if (eligible.length === 0) {
      completionProjection = {
        eligibleCount: 0,
        averageCompletionPct: 0,
        projectedCompletionDate: null,
        message: 'Not enough data yet',
      }
    } else {
      const avgWeeksCompleted = eligible.reduce((sum, x) => sum + x.lastSubmittedWeek, 0) / eligible.length
      const averageCompletionPct = Math.round((avgWeeksCompleted / 48) * 100)

      const avgPace = eligible.reduce((sum, x) => {
        const wk = getCurrentWeek(x.mentee) ?? 1
        return sum + x.lastSubmittedWeek / wk
      }, 0) / eligible.length

      if (avgPace <= 0 || avgWeeksCompleted <= 0) {
        completionProjection = {
          eligibleCount: eligible.length,
          averageCompletionPct,
          projectedCompletionDate: null,
          message: 'Not enough submission history yet to project a completion date',
        }
      } else {
        const remainingWeeks = Math.ceil((48 - avgWeeksCompleted) / avgPace)
        const projectedDate = new Date(now + Math.max(0, remainingWeeks) * 7 * 24 * 60 * 60 * 1000)
        completionProjection = {
          eligibleCount: eligible.length,
          averageCompletionPct,
          projectedCompletionDate: projectedDate.toISOString(),
          message: null,
        }
      }
    }

    // ── 6. SUMMARY STATS ROW ──────────────────────────────────────────────────
    const totalMentees = mentees.length
    const startedMentees = mentees.filter(m => m.hasStarted).length
    const totalSubmissions = mentees.reduce((sum, m) => sum + m.submissions.length, 0)
    const avgWeeksCompleted = totalMentees > 0
      ? Math.round((totalSubmissions / totalMentees) * 10) / 10
      : 0
    const overallCompletionRate = totalMentees > 0
      ? Math.round((totalSubmissions / (totalMentees * 48)) * 100)
      : 0

    return res.json({
      summary: {
        totalMentees,
        startedMentees,
        avgWeeksCompleted,
        overallCompletionRate,
      },
      submissionTrends,
      trackDistribution,
      statusBreakdown,
      atRiskList,
      completionProjection,
    })
  } catch (error) {
    console.error('Get analytics error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getPendingPayments(req: MentorOrLiaisonRequest, res: Response) {
  try {
    const where: any = { pendingPaymentPlan: { not: null } }
    if (req.liaisonId && !req.mentorId) {
      where.liaisonOfficerId = req.liaisonId
    }

    const mentees = await prisma.mentee.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        domainTrack: true,
        pendingPaymentPlan: true,
        paymentReference: true,
        pendingPaymentSubmittedAt: true,
        liaisonOfficerId: true,
      },
      orderBy: { pendingPaymentSubmittedAt: 'asc' },
    })

    return res.json(mentees)
  } catch (error) {
    console.error('Get pending payments error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function confirmPayment(req: MentorOrLiaisonRequest, res: Response) {
  try {
    const menteeId = String(req.params.id)
    const mentee = await prisma.mentee.findUnique({ where: { id: menteeId } })
    if (!mentee) return res.status(404).json({ error: 'Mentee not found' })

    if (req.liaisonId && !req.mentorId && mentee.liaisonOfficerId !== req.liaisonId) {
      return res.status(403).json({ error: 'You can only confirm payments for your assigned mentees' })
    }
    if (!mentee.pendingPaymentPlan) {
      return res.status(400).json({ error: 'This mentee has no pending payment to confirm' })
    }

    let confirmerName = 'Build In Tech Team'
    if (req.mentorId) {
      const mentor = await prisma.mentor.findUnique({ where: { id: req.mentorId } })
      confirmerName = mentor?.name || confirmerName
    } else if (req.liaisonId) {
      const officer = await prisma.liaisonOfficer.findUnique({ where: { id: req.liaisonId } })
      confirmerName = officer?.name || confirmerName
    }

    const now = new Date()
    const durationMs = mentee.pendingPaymentPlan === 'YEARLY'
      ? 365 * 24 * 60 * 60 * 1000
      : 30 * 24 * 60 * 60 * 1000
    const base = mentee.planExpiresAt && new Date(mentee.planExpiresAt) > now
      ? new Date(mentee.planExpiresAt)
      : now
    const planExpiresAt = new Date(base.getTime() + durationMs)
    const confirmedPlan = mentee.pendingPaymentPlan

    const updated = await prisma.mentee.update({
      where: { id: menteeId },
      data: {
        plan: 'PREMIUM',
        planExpiresAt,
        premiumActivatedBy: confirmerName,
        premiumActivatedAt: now,
        pendingPaymentPlan: null,
        paymentReference: null,
        pendingPaymentSubmittedAt: null,
      },
    })

    sendPremiumWelcomeEmail({
      name: updated.name,
      email: updated.email,
      plan: confirmedPlan,
      planExpiresAt,
    }).catch(err => console.error('Premium welcome email error:', err.message))

    return res.json({ message: 'Payment confirmed. Mentee upgraded to Premium.', mentee: updated })
  } catch (error) {
    console.error('Confirm payment error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function rejectPayment(req: MentorOrLiaisonRequest, res: Response) {
  try {
    const menteeId = String(req.params.id)
    const mentee = await prisma.mentee.findUnique({ where: { id: menteeId } })
    if (!mentee) return res.status(404).json({ error: 'Mentee not found' })

    if (req.liaisonId && !req.mentorId && mentee.liaisonOfficerId !== req.liaisonId) {
      return res.status(403).json({ error: 'You can only manage payments for your assigned mentees' })
    }
    if (!mentee.pendingPaymentPlan) {
      return res.status(400).json({ error: 'This mentee has no pending payment to reject' })
    }

    const updated = await prisma.mentee.update({
      where: { id: menteeId },
      data: { pendingPaymentPlan: null, paymentReference: null, pendingPaymentSubmittedAt: null },
    })

    sendPaymentRejectedEmail({ name: updated.name, email: updated.email }).catch(err =>
      console.error('Payment rejected email error:', err.message)
    )

    return res.json({ message: 'Payment claim rejected', mentee: updated })
  } catch (error) {
    console.error('Reject payment error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function issueCertificate(req: AuthRequest, res: Response) {
  try {
    const menteeId = String(req.params.id)
    const mentee = await prisma.mentee.findUnique({
      where: { id: menteeId },
      include: { submissions: { select: { id: true } } },
    })
    if (!mentee) return res.status(404).json({ error: 'Mentee not found' })

    if (!mentee.hasStarted || mentee.submissions.length < 48) {
      return res.status(400).json({ error: 'Mentee must complete all 48 weeks before a certificate can be issued' })
    }

    const certificateCode = mentee.certificateCode || generateCertificateCode()
    const certificateIssuedAt = mentee.certificateIssuedAt || new Date()

    const pdfBuffer = await generateCertificatePdf({
      menteeName: mentee.name,
      domainTrack: mentee.domainTrack,
      completionDate: certificateIssuedAt,
      certificateCode,
    })

    if (!mentee.hasReceivedCertificate) {
      await prisma.mentee.update({
        where: { id: menteeId },
        data: { hasReceivedCertificate: true, certificateIssuedAt, certificateCode },
      })

      sendCertificateIssuedEmail({
        name: mentee.name,
        email: mentee.email,
        domainTrack: mentee.domainTrack,
        pdfBuffer,
      }).catch(err => console.error('Certificate issued email error:', err.message))
    }

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="BuildInTech-Certificate-${certificateCode}.pdf"`)
    return res.send(pdfBuffer)
  } catch (error) {
    console.error('Issue certificate error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function issueRecommendationLetter(req: AuthRequest, res: Response) {
  try {
    const menteeId = String(req.params.id)
    const { letterContent } = req.body

    if (!letterContent || letterContent.trim().length < 50) {
      return res.status(400).json({ error: 'Letter content must be at least 50 characters' })
    }

    const mentee = await prisma.mentee.findUnique({
      where: { id: menteeId },
      include: { submissions: { select: { id: true } } },
    })
    if (!mentee) return res.status(404).json({ error: 'Mentee not found' })

    if (mentee.plan !== 'PREMIUM') {
      return res.status(403).json({ error: 'Recommendation letters are a premium-only benefit' })
    }
    if (!mentee.hasStarted || mentee.submissions.length < 48) {
      return res.status(400).json({ error: 'Mentee must complete all 48 weeks before a recommendation letter can be issued' })
    }

    const pdfBuffer = await generateRecommendationLetterPdf({
      menteeName: mentee.name,
      domainTrack: mentee.domainTrack,
      completionDate: mentee.certificateIssuedAt || new Date(),
      letterContent: letterContent.trim(),
    })

    sendRecommendationLetterEmail({
      name: mentee.name,
      email: mentee.email,
      pdfBuffer,
    }).catch(err => console.error('Recommendation letter email error:', err.message))

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="BuildInTech-Recommendation-${mentee.name.replace(/\s+/g, '-')}.pdf"`)
    return res.send(pdfBuffer)
  } catch (error) {
    console.error('Issue recommendation letter error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}