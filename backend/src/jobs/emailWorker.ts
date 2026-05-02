import { Worker, Job } from 'bullmq'
import IORedis from 'ioredis'
import { connection } from './emailQueue'
import { prisma } from '../models/prisma'
import { sendWelcomeEmail } from '../emails/welcomeEmail'
import { sendConfirmationEmail } from '../emails/confirmationEmail'
import { sendReminderEmail } from '../emails/reminderEmail'
import { sendFeedbackEmail } from '../emails/feedbackEmail'

type EmailJobData = {
  menteeId?: string
  name: string
  email: string
  subject?: string
  weekNumber?: number
  weekTitle?: string
  summary?: string
  accessCode?: string
  topMatch?: string
  secondMatch?: string
  alignmentStatus?: string
  mentorNote?: string
  feedback?: string
  isFinal?: boolean
  domain?: string
}

const emailHandlers: Record<string, (data: EmailJobData) => Promise<void>> = {
  welcome: async (data) => {
    await sendWelcomeEmail({
      name: data.name,
      email: data.email,
      accessCode: data.accessCode!,
      topMatch: data.topMatch!,
      secondMatch: data.secondMatch!,
      alignmentStatus: data.alignmentStatus,
      mentorNote: data.mentorNote,
    })
  },
  confirmation: async (data) => {
    await sendConfirmationEmail({
      name: data.name,
      email: data.email,
      weekNumber: data.weekNumber!,
      summary: data.summary!,
      domain: data.domain!,
    })
  },
  reminder: async (data) => {
    await sendReminderEmail({
      name: data.name,
      email: data.email,
      weekNumber: data.weekNumber!,
      weekTitle: data.weekTitle!,
      isFinal: data.isFinal,
    })
  },
  feedback: async (data) => {
    await sendFeedbackEmail({
      name: data.name,
      email: data.email,
      weekNumber: data.weekNumber!,
      feedback: data.feedback!,
    })
  },
}

export const emailWorker = new Worker(
  'emails',
  async (job: Job<EmailJobData>) => {
    const handler = emailHandlers[job.name]
    if (!handler) throw new Error(`Unknown email type: ${job.name}`)

    await handler(job.data)

    if (job.data.menteeId) {
      await prisma.emailLog.create({
        data: {
          menteeId: job.data.menteeId,
          emailType: job.name,
          recipient: job.data.email,
          subject: job.data.subject || job.name,
          status: 'sent',
          sentAt: new Date(),
        },
      })
    }
  },
  {
    connection: new IORedis({
      host: '127.0.0.1',
      port: 6379,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    }),
  }
)

emailWorker.on('completed', (job) => {
  console.log(`Email job ${job.id} (${job.name}) completed`)
})

emailWorker.on('failed', async (job, err) => {
  console.error(`Email job ${job?.id} (${job?.name}) failed:`, err.message)
  if (job?.data.menteeId) {
    await prisma.emailLog.create({
      data: {
        menteeId: job.data.menteeId,
        emailType: job.name || 'unknown',
        recipient: job.data.email,
        subject: job.data.subject || job.name || 'unknown',
        status: 'failed',
        errorMsg: err.message,
      },
    })
  }
})