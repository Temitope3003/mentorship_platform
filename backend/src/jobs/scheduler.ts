import cron from 'node-cron'
import { prisma } from '../models/prisma'
import { sendReminderEmail } from '../emails/reminderEmail'
import { sendWelcomeEmail } from '../emails/welcomeEmail'
import { getCurriculumForDomain } from '../utils/curriculum'

function getCurrentWeek(startDate: Date): number {
  const diffMs = Date.now() - new Date(startDate).getTime()
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1
  return Math.max(1, Math.min(48, diffWeeks))
}

function getDayInCurrentWeek(startDate: Date): number {
  const diffMs = Date.now() - new Date(startDate).getTime()
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000))
  return (diffDays % 7) + 1
}

// ─────────────────────────────────────────────
// JOB 1: Day 3 Gentle Reminder
// Runs every day at 9am server time
// Sends a reminder if mentee has not submitted by day 3 of current week
// ─────────────────────────────────────────────
cron.schedule('0 9 * * *', async () => {
  console.log('[Scheduler] Running day 3 reminder check...')
  try {
    const mentees = await prisma.mentee.findMany({
      where: { isActive: true },
    })

    for (const mentee of mentees) {
      const currentWeek = getCurrentWeek(mentee.startDate)
      const dayInWeek = getDayInCurrentWeek(mentee.startDate)

      if (dayInWeek !== 3) continue

      const submission = await prisma.weeklySubmission.findUnique({
        where: { menteeId_weekNumber: { menteeId: mentee.id, weekNumber: currentWeek } },
      })

      if (!submission) {
        const weekData = getCurriculumForDomain(mentee.domainTrack)
          .find(w => w.week === currentWeek)

        await sendReminderEmail({
          name: mentee.name,
          email: mentee.email,
          weekNumber: currentWeek,
          weekTitle: weekData?.title || `Week ${currentWeek}`,
          isFinal: false,
        })

        await prisma.emailLog.create({
          data: {
            menteeId: mentee.id,
            emailType: 'reminder',
            recipient: mentee.email,
            subject: `Week ${currentWeek} is waiting for you`,
            status: 'sent',
            sentAt: new Date(),
          },
        })

        console.log(`[Scheduler] Day 3 reminder sent to ${mentee.email}`)
      }
    }
  } catch (error) {
    console.error('[Scheduler] Day 3 reminder error:', error)
  }
})

// ─────────────────────────────────────────────
// JOB 2: Day 6 Final Reminder
// Runs every day at 6pm server time
// Sends a final urgent reminder if still no submission by day 6
// ─────────────────────────────────────────────
cron.schedule('0 18 * * *', async () => {
  console.log('[Scheduler] Running day 6 final reminder check...')
  try {
    const mentees = await prisma.mentee.findMany({
      where: { isActive: true },
    })

    for (const mentee of mentees) {
      const currentWeek = getCurrentWeek(mentee.startDate)
      const dayInWeek = getDayInCurrentWeek(mentee.startDate)

      if (dayInWeek !== 6) continue

      const submission = await prisma.weeklySubmission.findUnique({
        where: { menteeId_weekNumber: { menteeId: mentee.id, weekNumber: currentWeek } },
      })

      if (!submission) {
        const weekData = getCurriculumForDomain(mentee.domainTrack)
          .find(w => w.week === currentWeek)

        await sendReminderEmail({
          name: mentee.name,
          email: mentee.email,
          weekNumber: currentWeek,
          weekTitle: weekData?.title || `Week ${currentWeek}`,
          isFinal: true,
        })

        await prisma.emailLog.create({
          data: {
            menteeId: mentee.id,
            emailType: 'finalReminder',
            recipient: mentee.email,
            subject: `Last chance — Week ${currentWeek} ends today`,
            status: 'sent',
            sentAt: new Date(),
          },
        })

        console.log(`[Scheduler] Day 6 final reminder sent to ${mentee.email}`)
      }
    }
  } catch (error) {
    console.error('[Scheduler] Day 6 reminder error:', error)
  }
})

// ─────────────────────────────────────────────
// JOB 3: At-Risk Check
// Runs every Monday at 8am
// Identifies mentees 2+ weeks behind and sends a check-in email
// ─────────────────────────────────────────────
cron.schedule('0 8 * * 1', async () => {
  console.log('[Scheduler] Running at-risk check...')
  try {
    const mentees = await prisma.mentee.findMany({
      where: { isActive: true },
      include: {
        submissions: {
          orderBy: { weekNumber: 'desc' },
          take: 1,
        },
      },
    })

    for (const mentee of mentees) {
      const currentWeek = getCurrentWeek(mentee.startDate)
      const lastSubmitted = mentee.submissions[0]?.weekNumber || 0
      const weeksBehind = currentWeek - lastSubmitted

      if (weeksBehind >= 2) {
        const alreadySentThisWeek = await prisma.emailLog.findFirst({
          where: {
            menteeId: mentee.id,
            emailType: 'checkin',
            sentAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          },
        })

        if (!alreadySentThisWeek) {
          await sendCheckinEmail({
            name: mentee.name,
            email: mentee.email,
            weeksBehind,
            currentWeek,
          })

          await prisma.emailLog.create({
            data: {
              menteeId: mentee.id,
              emailType: 'checkin',
              recipient: mentee.email,
              subject: `Checking in — we miss you`,
              status: 'sent',
              sentAt: new Date(),
            },
          })

          console.log(`[Scheduler] Check-in sent to ${mentee.email} (${weeksBehind} weeks behind)`)
        }
      }
    }
  } catch (error) {
    console.error('[Scheduler] At-risk check error:', error)
  }
})

// ─────────────────────────────────────────────
// JOB 4: Phase Completion Check
// Runs every day at midnight
// Sends phase completion emails when mentees reach week 12, 24, 36, or 48
// ─────────────────────────────────────────────
cron.schedule('0 0 * * *', async () => {
  console.log('[Scheduler] Running phase completion check...')
  try {
    const milestones = [
      { week: 12, phase: 1, name: 'Foundations' },
      { week: 24, phase: 2, name: 'Core Skills' },
      { week: 36, phase: 3, name: 'Advanced Application' },
      { week: 48, phase: 4, name: 'Job Readiness' },
    ]

    const mentees = await prisma.mentee.findMany({
      where: { isActive: true },
      include: { submissions: { select: { weekNumber: true } } },
    })

    for (const mentee of mentees) {
      for (const milestone of milestones) {
        const hasJustCompleted = mentee.submissions.some(
          s => s.weekNumber === milestone.week
        )
        const totalSubmissions = mentee.submissions.length

        if (hasJustCompleted && totalSubmissions === milestone.week) {
          const alreadySent = await prisma.emailLog.findFirst({
            where: {
              menteeId: mentee.id,
              emailType: `phase${milestone.phase}Complete`,
            },
          })

          if (!alreadySent) {
            await sendPhaseCompleteEmail({
              name: mentee.name,
              email: mentee.email,
              phase: milestone.phase,
              phaseName: milestone.name,
              domain: mentee.domainTrack,
              weeksCompleted: milestone.week,
            })

            await prisma.emailLog.create({
              data: {
                menteeId: mentee.id,
                emailType: `phase${milestone.phase}Complete`,
                recipient: mentee.email,
                subject: `Phase ${milestone.phase} complete`,
                status: 'sent',
                sentAt: new Date(),
              },
            })

            console.log(`[Scheduler] Phase ${milestone.phase} completion email sent to ${mentee.email}`)
          }
        }
      }
    }
  } catch (error) {
    console.error('[Scheduler] Phase completion error:', error)
  }
})

// placeholder functions - implemented in next step
async function sendCheckinEmail(data: {
  name: string
  email: string
  weeksBehind: number
  currentWeek: number
}) {
  const { sendEmail } = await import('../emails/sender')
  const firstName = data.name.split(' ')[0]
  const dashboardUrl = `${process.env.FRONTEND_URL}/dashboard`

  await sendEmail({
    to: data.email,
    subject: `Checking in on you, ${firstName}`,
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#faf7f2;font-family:Arial,sans-serif;color:#1a1208;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:white;border-radius:16px;padding:40px;border:1px solid #e2d9cc;">
      <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#1a1208;">
        Checking in on you, ${firstName}
      </h1>
      <p style="margin:0 0 16px;color:#4a3f2f;font-size:15px;line-height:1.7;">
        You have not submitted for ${data.weeksBehind} weeks. That is okay. Life happens.
      </p>
      <p style="margin:0 0 24px;color:#4a3f2f;font-size:15px;line-height:1.7;">
        You are currently on Week ${data.currentWeek}. The best thing you can do right now is submit something small for the most recent week you missed. Even a brief summary counts.
      </p>
      <a href="${dashboardUrl}"
         style="display:inline-block;background:#d4622a;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:14px;font-weight:600;margin-bottom:24px;">
        Back to My Dashboard →
      </a>
      <div style="border-top:1px solid #e2d9cc;padding-top:20px;">
        <p style="margin:0;font-size:13px;color:#9a8e7e;">
          Tech Mentorship Program — we are rooting for you.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`,
  })
}

async function sendPhaseCompleteEmail(data: {
  name: string
  email: string
  phase: number
  phaseName: string
  domain: string
  weeksCompleted: number
}) {
  const { sendEmail } = await import('../emails/sender')
  const firstName = data.name.split(' ')[0]
  const dashboardUrl = `${process.env.FRONTEND_URL}/dashboard`
  const nextPhase = data.phase + 1
  const phaseNames = ['', 'Foundations', 'Core Skills', 'Advanced Application', 'Job Readiness']

  await sendEmail({
    to: data.email,
    subject: `Phase ${data.phase} complete — ${firstName}, this is real progress`,
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#faf7f2;font-family:Arial,sans-serif;color:#1a1208;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:#d4622a;border-radius:16px 16px 0 0;padding:36px 40px;">
      <h1 style="margin:0;color:white;font-size:26px;font-weight:800;">
        Phase ${data.phase} Complete 🎉
      </h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">
        ${data.phaseName} — ${data.weeksCompleted} weeks done
      </p>
    </div>
    <div style="background:white;border-radius:0 0 16px 16px;padding:40px;border:1px solid #e2d9cc;border-top:none;">
      <p style="margin:0 0 20px;color:#4a3f2f;font-size:15px;line-height:1.7;">
        Hi ${firstName}, you just completed Phase ${data.phase} of your ${data.domain} roadmap.
        That is ${data.weeksCompleted} weeks of consistent work. This is real progress.
      </p>
      <div style="background:#faf7f2;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #e2d9cc;">
        <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#9a8e7e;">
          Phase ${data.phase} Complete
        </p>
        <p style="margin:0 0 4px;font-size:16px;font-weight:600;color:#1a1208;">${data.phaseName}</p>
        <p style="margin:0;font-size:13px;color:#9a8e7e;">${data.weeksCompleted} weeks submitted</p>
      </div>
      ${data.phase < 4 ? `
      <div style="background:#f0fdf9;border:1px solid #99f6e4;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#1a7a6e;">
          Up next
        </p>
        <p style="margin:0;font-size:15px;font-weight:600;color:#1a1208;">Phase ${nextPhase}: ${phaseNames[nextPhase]}</p>
      </div>` : `
      <div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#5b4fcf;">
          🎓 Program Complete
        </p>
        <p style="margin:0;font-size:15px;color:#4a3f2f;line-height:1.6;">
          You have completed the full 48-week program. Your mentor will be in touch about your next steps.
        </p>
      </div>`}
      <a href="${dashboardUrl}"
         style="display:inline-block;background:#d4622a;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:14px;font-weight:600;">
        Continue to Phase ${Math.min(nextPhase, 4)} →
      </a>
    </div>
  </div>
</body>
</html>`,
  })
}

// Keep Supabase awake by pinging every 4 days
cron.schedule('0 8 */4 * *', async () => {
  try {
    await prisma.mentor.count()
    console.log('[Scheduler] Supabase keep-alive ping sent')
  } catch (error) {
    console.error('[Scheduler] Keep-alive ping failed:', error)
  }
})

console.log('[Scheduler] All cron jobs registered')