import { Request, Response } from 'express'
import { prisma } from '../models/prisma'
import { getCurriculumForDomain, getWeekForDomain } from '../utils/curriculum'
import { sendConfirmationEmail } from '../emails/confirmationEmail'
import { sendMenteePauseResumeAlertEmail } from '../emails/menteePauseResumeAlertEmail'
import { getCurrentWeek } from '../utils/menteeStatus'
import { changeMenteeTrack, TrackChangeError } from '../services/menteeTrackService'
import { sendPaymentClaimAlertEmail } from '../emails/paymentClaimAlertEmail'
import { sendMenteeRequestAlertEmail } from '../emails/menteeRequestAlertEmail'
import { generateCertificatePdf } from '../services/certificateService'
import { getMenteeChatReply } from '../services/chatbotService'

const CHAT_DAILY_LIMIT = 20

interface AuthRequest extends Request {
  menteeId?: string
}

async function notifyAboutPaymentClaim(mentee: {
  name: string
  domainTrack: string
  liaisonOfficerId: string | null
  paymentReference: string | null
  pendingPaymentPlan: string | null
}) {
  try {
    const recipients: { name: string; email: string }[] = []

    if (mentee.liaisonOfficerId) {
      const officer = await prisma.liaisonOfficer.findUnique({ where: { id: mentee.liaisonOfficerId } })
      if (officer) recipients.push({ name: officer.name, email: officer.email })
    }

    const mentors = await prisma.mentor.findMany({
      where: { status: 'APPROVED' },
      select: { name: true, email: true },
    })
    recipients.push(...mentors)

    await Promise.all(
      recipients.map((r) =>
        sendPaymentClaimAlertEmail({
          recipientName: r.name,
          recipientEmail: r.email,
          menteeName: mentee.name,
          menteeTrack: mentee.domainTrack,
          paymentReference: mentee.paymentReference || '',
          plan: mentee.pendingPaymentPlan || '',
        }).catch((err) => console.error('Payment claim email error:', err.message))
      )
    )
  } catch (err: any) {
    console.error('Payment claim notification error:', err.message)
  }
}

async function notifyAboutMenteeRequest(
  mentee: { name: string; domainTrack: string; liaisonOfficerId: string | null },
  requestType: 'certificate' | 'recommendation-letter'
) {
  try {
    const recipients: { name: string; email: string }[] = []

    if (mentee.liaisonOfficerId) {
      const officer = await prisma.liaisonOfficer.findUnique({ where: { id: mentee.liaisonOfficerId } })
      if (officer) recipients.push({ name: officer.name, email: officer.email })
    }

    const mentors = await prisma.mentor.findMany({
      where: { status: 'APPROVED' },
      select: { name: true, email: true },
    })
    recipients.push(...mentors)

    await Promise.all(
      recipients.map((r) =>
        sendMenteeRequestAlertEmail({
          recipientName: r.name,
          recipientEmail: r.email,
          menteeName: mentee.name,
          menteeTrack: mentee.domainTrack,
          requestType,
        }).catch((err) => console.error('Mentee request email error:', err.message))
      )
    )
  } catch (err: any) {
    console.error('Mentee request notification error:', err.message)
  }
}

async function notifyAboutPauseResume(
  mentee: { name: string; domainTrack: string; liaisonOfficerId: string | null },
  action: 'paused' | 'resumed',
  reason: string | null
) {
  try {
    const recipients: { name: string; email: string }[] = []

    if (mentee.liaisonOfficerId) {
      const officer = await prisma.liaisonOfficer.findUnique({ where: { id: mentee.liaisonOfficerId } })
      if (officer) recipients.push({ name: officer.name, email: officer.email })
    }

    const mentors = await prisma.mentor.findMany({
      where: { status: 'APPROVED' },
      select: { name: true, email: true },
    })
    recipients.push(...mentors)

    await Promise.all(
      recipients.map((r) =>
        sendMenteePauseResumeAlertEmail({
          recipientName: r.name,
          recipientEmail: r.email,
          menteeName: mentee.name,
          menteeTrack: mentee.domainTrack,
          action,
          reason,
        }).catch((err) => console.error('Pause/resume notification email error:', err.message))
      )
    )
  } catch (err: any) {
    console.error('Pause/resume notification error:', err.message)
  }
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

    if (!mentee.hasStarted) {
      return res.json({
        hasStarted: false,
        isPaused: false,
        domain: mentee.domainTrack,
        currentWeek: null,
        totalWeeks: 48,
        weeks: [],
      })
    }

    const currentWeek = getCurrentWeek(mentee)!
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
      hasStarted: true,
      isPaused: mentee.isPaused,
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

    if (!mentee.hasStarted) {
      return res.status(400).json({ error: 'You need to start your journey before submitting work' })
    }
    if (mentee.isPaused) {
      return res.status(400).json({ error: 'Your journey is paused. Resume to continue submitting work.' })
    }

    const currentWeek = getCurrentWeek(mentee)!
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

    const planFields = {
      plan: mentee.plan,
      planExpiresAt: mentee.planExpiresAt,
      pendingPaymentPlan: mentee.pendingPaymentPlan,
      paymentReference: mentee.paymentReference,
      pendingPaymentSubmittedAt: mentee.pendingPaymentSubmittedAt,
      hasReceivedCertificate: mentee.hasReceivedCertificate,
      certificateIssuedAt: mentee.certificateIssuedAt,
    }

    if (!mentee.hasStarted) {
      return res.json({
        hasStarted: false,
        isPaused: false,
        currentWeek: null,
        weeksSubmitted: 0,
        weeksRemaining: 48,
        completionPct: 0,
        streakCount: 0,
        currentPhase: null,
        phaseProgress: 0,
        domain: mentee.domainTrack,
        ...planFields,
      })
    }

    const submissions = await prisma.weeklySubmission.findMany({
      where: { menteeId: req.menteeId },
      orderBy: { weekNumber: 'asc' },
    })

    const currentWeek = getCurrentWeek(mentee)!
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
      hasStarted: true,
      isPaused: mentee.isPaused,
      pausedAt: mentee.pausedAt,
      pauseReason: mentee.pauseReason,
      pauseCount: mentee.pauseCount,
      currentWeek,
      weeksSubmitted: submissions.length,
      weeksRemaining: 48 - submissions.length,
      completionPct,
      streakCount: streak,
      currentPhase: phaseNames[phaseNum - 1],
      phaseProgress: Math.max(0, phaseProgress),
      domain: mentee.domainTrack,
      ...planFields,
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

    const updated = await changeMenteeTrack(menteeId, domain)

    return res.json({ message: 'Track updated successfully', mentee: updated })
  } catch (error) {
    if (error instanceof TrackChangeError) {
      return res.status(error.status).json({ error: error.message })
    }
    console.error('Update track error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function startJourney(req: AuthRequest, res: Response) {
  try {
    const mentee = await prisma.mentee.findUnique({ where: { id: req.menteeId } })
    if (!mentee) return res.status(404).json({ error: 'Mentee not found' })

    if (mentee.hasStarted) {
      return res.status(400).json({ error: 'You have already started your journey' })
    }

    const updated = await prisma.mentee.update({
      where: { id: req.menteeId },
      data: { hasStarted: true, startDate: new Date() },
    })

    return res.json({ message: 'Your journey has started. Week 1 begins now.', mentee: updated })
  } catch (error) {
    console.error('Start journey error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function pauseJourney(req: AuthRequest, res: Response) {
  try {
    const { reason } = req.body
    const mentee = await prisma.mentee.findUnique({ where: { id: req.menteeId } })
    if (!mentee) return res.status(404).json({ error: 'Mentee not found' })

    if (!mentee.hasStarted) {
      return res.status(400).json({ error: 'You need to start your journey before you can pause it' })
    }
    if (mentee.isPaused) {
      return res.status(400).json({ error: 'Your journey is already paused' })
    }
    if (mentee.pauseCount >= 2) {
      return res.status(400).json({ error: 'You have used both of your available pauses' })
    }

    const updated = await prisma.mentee.update({
      where: { id: req.menteeId },
      data: {
        isPaused: true,
        pausedAt: new Date(),
        pauseCount: { increment: 1 },
        pauseReason: reason?.trim() || null,
      },
    })

    notifyAboutPauseResume(updated, 'paused', updated.pauseReason)

    return res.json({ message: 'Your journey has been paused. Take the time you need.', mentee: updated })
  } catch (error) {
    console.error('Pause journey error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function resumeJourney(req: AuthRequest, res: Response) {
  try {
    const mentee = await prisma.mentee.findUnique({ where: { id: req.menteeId } })
    if (!mentee) return res.status(404).json({ error: 'Mentee not found' })

    if (!mentee.isPaused) {
      return res.status(400).json({ error: 'Your journey is not currently paused' })
    }

    const pausedDays = mentee.pausedAt
      ? Math.ceil((Date.now() - new Date(mentee.pausedAt).getTime()) / (24 * 60 * 60 * 1000))
      : 0

    const updated = await prisma.mentee.update({
      where: { id: req.menteeId },
      data: {
        isPaused: false,
        pausedAt: null,
        totalPausedDays: { increment: pausedDays },
      },
    })

    notifyAboutPauseResume(updated, 'resumed', null)

    return res.json({ message: 'Welcome back. Your journey has resumed.', mentee: updated })
  } catch (error) {
    console.error('Resume journey error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function submitPayment(req: AuthRequest, res: Response) {
  try {
    const { paymentReference, pendingPaymentPlan } = req.body

    if (!paymentReference || !paymentReference.trim()) {
      return res.status(400).json({ error: 'Payment reference is required' })
    }
    if (pendingPaymentPlan !== 'MONTHLY' && pendingPaymentPlan !== 'YEARLY') {
      return res.status(400).json({ error: 'Plan must be MONTHLY or YEARLY' })
    }

    const mentee = await prisma.mentee.findUnique({ where: { id: req.menteeId } })
    if (!mentee) return res.status(404).json({ error: 'Mentee not found' })

    const daysUntilExpiry = mentee.planExpiresAt
      ? Math.ceil((new Date(mentee.planExpiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
      : null
    const isRenewalWindow = daysUntilExpiry !== null && daysUntilExpiry <= 7

    if (mentee.plan === 'PREMIUM' && !isRenewalWindow) {
      return res.status(400).json({ error: 'You already have an active premium plan' })
    }
    if (mentee.pendingPaymentPlan) {
      return res.status(400).json({ error: 'You already have a payment claim awaiting confirmation' })
    }

    const updated = await prisma.mentee.update({
      where: { id: req.menteeId },
      data: {
        paymentReference: paymentReference.trim(),
        pendingPaymentPlan,
        pendingPaymentSubmittedAt: new Date(),
      },
    })

    notifyAboutPaymentClaim(updated).catch((err) => console.error('Payment claim notification error:', err.message))

    return res.json({
      message: 'Payment submitted. Awaiting confirmation from your mentor or liaison officer.',
      mentee: updated,
    })
  } catch (error) {
    console.error('Submit payment error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getCertificate(req: AuthRequest, res: Response) {
  try {
    const mentee = await prisma.mentee.findUnique({ where: { id: req.menteeId } })
    if (!mentee) return res.status(404).json({ error: 'Mentee not found' })

    if (!mentee.hasReceivedCertificate || !mentee.certificateCode) {
      return res.status(404).json({ error: 'No certificate has been issued yet' })
    }

    const pdfBuffer = await generateCertificatePdf({
      menteeName: mentee.name,
      domainTrack: mentee.domainTrack,
      completionDate: mentee.certificateIssuedAt || new Date(),
      certificateCode: mentee.certificateCode,
    })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="BuildInTech-Certificate-${mentee.certificateCode}.pdf"`)
    return res.send(pdfBuffer)
  } catch (error) {
    console.error('Get certificate error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function requestCertificate(req: AuthRequest, res: Response) {
  try {
    const mentee = await prisma.mentee.findUnique({
      where: { id: req.menteeId },
      include: { submissions: { select: { id: true } } },
    })
    if (!mentee) return res.status(404).json({ error: 'Mentee not found' })

    if (mentee.hasReceivedCertificate) {
      return res.status(400).json({ error: 'You already have a certificate. Download it from your dashboard.' })
    }
    if (!mentee.hasStarted || mentee.submissions.length < 48) {
      return res.status(400).json({ error: 'You need to complete all 48 weeks before requesting your certificate' })
    }

    notifyAboutMenteeRequest(mentee, 'certificate').catch((err) =>
      console.error('Certificate request notification error:', err.message)
    )

    return res.json({ message: 'Your mentor has been notified. Your certificate will be issued shortly.' })
  } catch (error) {
    console.error('Request certificate error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function requestRecommendationLetter(req: AuthRequest, res: Response) {
  try {
    const mentee = await prisma.mentee.findUnique({
      where: { id: req.menteeId },
      include: { submissions: { select: { id: true } } },
    })
    if (!mentee) return res.status(404).json({ error: 'Mentee not found' })

    if (mentee.plan !== 'PREMIUM') {
      return res.status(403).json({ error: 'Recommendation letters are a premium-only benefit' })
    }
    if (!mentee.hasStarted || mentee.submissions.length < 48) {
      return res.status(400).json({ error: 'You need to complete all 48 weeks before requesting a recommendation letter' })
    }

    notifyAboutMenteeRequest(mentee, 'recommendation-letter').catch((err) =>
      console.error('Recommendation letter request notification error:', err.message)
    )

    return res.json({ message: 'Your mentor has been notified and will write your recommendation letter soon.' })
  } catch (error) {
    console.error('Request recommendation letter error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function chatWithBot(req: AuthRequest, res: Response) {
  try {
    const { message } = req.body

    if (!message || !String(message).trim()) {
      return res.status(400).json({ error: 'Message is required' })
    }
    if (String(message).trim().length > 2000) {
      return res.status(400).json({ error: 'Message is too long' })
    }

    const mentee = await prisma.mentee.findUnique({ where: { id: req.menteeId } })
    if (!mentee) return res.status(404).json({ error: 'Mentee not found' })

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const todayCount = await prisma.chatMessage.count({
      where: { menteeId: req.menteeId, role: 'user', createdAt: { gte: todayStart } },
    })

    if (todayCount >= CHAT_DAILY_LIMIT) {
      return res.status(429).json({ error: "You've reached today's chat limit. It resets at midnight." })
    }

    await prisma.chatMessage.create({
      data: { menteeId: req.menteeId!, role: 'user', content: String(message).trim() },
    })

    const recentMessages = await prisma.chatMessage.findMany({
      where: { menteeId: req.menteeId },
      orderBy: { createdAt: 'desc' },
      take: 6,
    })
    const historyChronological = recentMessages.reverse()

    const currentWeek = mentee.hasStarted ? getCurrentWeek(mentee) : null

    const reply = await getMenteeChatReply({
      domainTrack: mentee.domainTrack,
      currentWeek,
      history: historyChronological.map((m) => ({ role: m.role, content: m.content })),
    })

    await prisma.chatMessage.create({
      data: { menteeId: req.menteeId!, role: 'assistant', content: reply },
    })

    return res.json({
      reply,
      messagesRemainingToday: Math.max(0, CHAT_DAILY_LIMIT - 1 - todayCount),
    })
  } catch (error) {
    console.error('Mentee chat error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getChatHistory(req: AuthRequest, res: Response) {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { menteeId: req.menteeId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const todayCount = await prisma.chatMessage.count({
      where: { menteeId: req.menteeId, role: 'user', createdAt: { gte: todayStart } },
    })

    return res.json({
      messages: messages.reverse(),
      messagesRemainingToday: Math.max(0, CHAT_DAILY_LIMIT - todayCount),
    })
  } catch (error) {
    console.error('Get chat history error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function clearChatHistory(req: AuthRequest, res: Response) {
  try {
    await prisma.chatMessage.deleteMany({ where: { menteeId: req.menteeId } })
    return res.json({ message: 'Chat history cleared' })
  } catch (error) {
    console.error('Clear chat history error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getJobListings(req: AuthRequest, res: Response) {
  try {
    const mentee = await prisma.mentee.findUnique({ where: { id: req.menteeId } })
    if (!mentee) return res.status(404).json({ error: 'Mentee not found' })

    const domainTrack = mentee.domainTrack
    const isPremium = mentee.plan === 'PREMIUM'

    const totalAvailable = await prisma.jobListing.count({ where: { domainTrack } })

    const listings = await prisma.jobListing.findMany({
      where: { domainTrack },
      orderBy: [{ postedAt: 'desc' }, { fetchedAt: 'desc' }],
      take: isPremium ? 50 : 5,
    })

    return res.json({
      listings,
      totalAvailable,
      isPremium,
      domainTrack,
    })
  } catch (error) {
    console.error('Get job listings error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getIncomeOpportunities(_req: AuthRequest, res: Response) {
  try {
    const opportunities = await prisma.incomeOpportunity.findMany({
      where: { status: 'APPROVED' },
      orderBy: { proposedAt: 'asc' },
    })
    return res.json({ opportunities })
  } catch (error) {
    console.error('Get income opportunities error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}