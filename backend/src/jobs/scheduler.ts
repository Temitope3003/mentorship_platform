import cron from 'node-cron'
import { prisma } from '../models/prisma'
import { sendReminderEmail } from '../emails/reminderEmail'
import { sendWelcomeEmail } from '../emails/welcomeEmail'
import { getCurriculumForDomain } from '../utils/curriculum'
import { getCurrentWeek, getMenteeStatusLabel, getDaysSinceLastSubmission } from '../utils/menteeStatus'
import { sendPremiumExpiredEmail } from '../emails/premiumExpiredEmail'

// ─────────────────────────────────────────────
// JOB 1: Day 3 Gentle Reminder
// Runs every day at 9am — fires if 3 days have passed since last submission
// ─────────────────────────────────────────────
cron.schedule('0 9 * * *', async () => {
  console.log('[Scheduler] Running day 3 reminder check...')
  try {
    const mentees = await prisma.mentee.findMany({
      where: { isActive: true },
      include: { submissions: { select: { weekNumber: true, submittedAt: true } } },
    })

    for (const mentee of mentees) {
      if (!mentee.hasStarted || mentee.isPaused) continue

      const daysSince = getDaysSinceLastSubmission(mentee, mentee.submissions)
      if (daysSince !== 3) continue

      const currentWeek = getCurrentWeek(mentee, mentee.submissions)!
      const weekData = getCurriculumForDomain(mentee.domainTrack).find(w => w.week === currentWeek)

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
  } catch (error) {
    console.error('[Scheduler] Day 3 reminder error:', error)
  }
})

// ─────────────────────────────────────────────
// JOB 2: Day 6 Final Reminder
// Runs every day at 6pm — fires if 6 days have passed since last submission
// ─────────────────────────────────────────────
cron.schedule('0 18 * * *', async () => {
  console.log('[Scheduler] Running day 6 final reminder check...')
  try {
    const mentees = await prisma.mentee.findMany({
      where: { isActive: true },
      include: { submissions: { select: { weekNumber: true, submittedAt: true } } },
    })

    for (const mentee of mentees) {
      if (!mentee.hasStarted || mentee.isPaused) continue

      const daysSince = getDaysSinceLastSubmission(mentee, mentee.submissions)
      if (daysSince !== 6) continue

      const currentWeek = getCurrentWeek(mentee, mentee.submissions)!
      const weekData = getCurriculumForDomain(mentee.domainTrack).find(w => w.week === currentWeek)

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
          subject: `Last chance — submit Week ${currentWeek} today`,
          status: 'sent',
          sentAt: new Date(),
        },
      })

      console.log(`[Scheduler] Day 6 final reminder sent to ${mentee.email}`)
    }
  } catch (error) {
    console.error('[Scheduler] Day 6 reminder error:', error)
  }
})

// ─────────────────────────────────────────────
// JOB 3: At-Risk Check
// Runs every Monday at 8am
// Identifies mentees 10+ days without a submission and sends a check-in email
// ─────────────────────────────────────────────
cron.schedule('0 8 * * 1', async () => {
  console.log('[Scheduler] Running at-risk check...')
  try {
    const mentees = await prisma.mentee.findMany({
      where: { isActive: true },
      include: {
        submissions: {
          select: { weekNumber: true, submittedAt: true },
          orderBy: { submittedAt: 'desc' },
          take: 1,
        },
      },
    })

    for (const mentee of mentees) {
      if (!mentee.hasStarted || mentee.isPaused) continue

      const daysSince = getDaysSinceLastSubmission(mentee, mentee.submissions)

      if (daysSince >= 10) {
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
            daysSince,
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

          console.log(`[Scheduler] Check-in sent to ${mentee.email} (${daysSince} days since last submission)`)
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
      if (!mentee.hasStarted) continue

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

async function sendCheckinEmail(data: {
  name: string
  email: string
  daysSince: number
}) {
  const { sendEmail } = await import('../emails/sender.js')
  const firstName = data.name.split(' ')[0]
  const dashboardUrl = `${process.env.FRONTEND_URL}/dashboard`

  await sendEmail({
    to: data.email,
    subject: `Checking in on you, ${firstName}`,
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f9f7f1;font-family:Arial,sans-serif;color:#0F1F3D;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="background:white;border-radius:16px;padding:40px;border:1px solid #E8E4D9;">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#C9A84C;margin-bottom:16px;">Build In Tech</div>
      <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#0F1F3D;font-family:Georgia,serif;">
        Checking in on you, ${firstName}
      </h1>
      <p style="margin:0 0 16px;color:#4A3F2F;font-size:15px;line-height:1.7;">
        It has been ${data.daysSince} day${data.daysSince === 1 ? '' : 's'} since your last submission. That is okay — life happens.
      </p>
      <p style="margin:0 0 24px;color:#4A3F2F;font-size:15px;line-height:1.7;">
        The best next step is to submit something small — even a brief summary of what you have been working on counts. Your progress is waiting for you.
      </p>
      <a href="${dashboardUrl}"
         style="display:inline-block;background:#C9A84C;color:#0F1F3D;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:14px;font-weight:700;margin-bottom:24px;">
        Back to My Dashboard →
      </a>
      <div style="border-top:1px solid #E8E4D9;padding-top:20px;margin-top:8px;">
        <p style="margin:0;font-size:12px;color:#9A8E7E;">Build In Tech — we are rooting for you.</p>
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
  const { sendEmail } = await import('../emails/sender.js')
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

// Every Monday at 7am send weekly report to liaison officers
cron.schedule('0 7 * * 1', async () => {
  try {
    const officers = await prisma.liaisonOfficer.findMany({
      where: { isActive: true },
      include: {
        mentees: {
          where: { isActive: true },
          include: {
            submissions: {
              select: { weekNumber: true, submittedAt: true },
            },
          },
        },
      },
    })

    for (const officer of officers) {
      if (officer.mentees.length === 0) continue

      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

      const notStarted = officer.mentees.filter(m => !m.hasStarted)
      const paused = officer.mentees.filter(m => m.hasStarted && m.isPaused)
      const activeMentees = officer.mentees.filter(m => m.hasStarted && !m.isPaused)

      const submitted = activeMentees.filter(m =>
        m.submissions.some(s => new Date(s.submittedAt) > oneWeekAgo)
      )

      const notSubmitted = activeMentees.filter(m =>
        !m.submissions.some(s => new Date(s.submittedAt) > oneWeekAgo)
      )

      const atRisk = activeMentees.filter(m => getMenteeStatusLabel(m, m.submissions) === 'AT_RISK')

      const { sendEmail } = await import('../emails/sender.js')
      await sendEmail({
        to: officer.email,
        subject: `Weekly Mentee Report — ${new Date().toDateString()}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #d4622a;">Weekly Report — Build In Tech</h2>
            <p>Hi ${officer.name}, here is your mentee summary for this week.</p>

            <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; margin: 16px 0; border-radius: 4px;">
              <h3 style="margin: 0 0 8px; color: #166534;">✅ Submitted This Week (${submitted.length})</h3>
              ${submitted.length === 0 ? '<p style="color: #666;">None yet</p>' :
                submitted.map(m => `<p style="margin: 4px 0;"><strong>${m.name}</strong> — ${m.domainTrack} — ${m.accessCode}</p>`).join('')
              }
            </div>

            <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; margin: 16px 0; border-radius: 4px;">
              <h3 style="margin: 0 0 8px; color: #92400e;">⚠️ Not Submitted Yet (${notSubmitted.length})</h3>
              ${notSubmitted.length === 0 ? '<p style="color: #666;">Everyone submitted this week!</p>' :
                notSubmitted.map(m => `<p style="margin: 4px 0;"><strong>${m.name}</strong> — ${m.domainTrack} — ${m.accessCode}</p>`).join('')
              }
            </div>

            <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 16px 0; border-radius: 4px;">
              <h3 style="margin: 0 0 8px; color: #991b1b;">🚨 Needs Urgent Help (${atRisk.length})</h3>
              ${atRisk.length === 0 ? '<p style="color: #666;">No one is at risk this week.</p>' :
                atRisk.map(m => {
                  const days = getDaysSinceLastSubmission(m, m.submissions)
                  return `<p style="margin: 4px 0;"><strong>${m.name}</strong> — ${m.domainTrack} — ${days} day${days === 1 ? '' : 's'} inactive</p>`
                }).join('')
              }
            </div>

            ${notStarted.length > 0 || paused.length > 0 ? `
            <div style="background: #f1f5f9; border-left: 4px solid #64748b; padding: 16px; margin: 16px 0; border-radius: 4px;">
              <h3 style="margin: 0 0 8px; color: #334155;">⏸️ Not Started or Paused (${notStarted.length + paused.length})</h3>
              ${[...notStarted.map(m => `<p style="margin: 4px 0;"><strong>${m.name}</strong> — ${m.domainTrack} — Not started</p>`),
                 ...paused.map(m => `<p style="margin: 4px 0;"><strong>${m.name}</strong> — ${m.domainTrack} — Paused</p>`)].join('')}
            </div>` : ''}

            <div style="background: #f1f5f9; padding: 16px; border-radius: 4px; margin-top: 16px;">
              <h3 style="margin: 0 0 8px;">📊 Summary</h3>
              <p style="margin: 4px 0;">Total mentees: <strong>${officer.mentees.length}</strong></p>
              <p style="margin: 4px 0;">Submitted: <strong>${submitted.length}</strong></p>
              <p style="margin: 4px 0;">Not submitted: <strong>${notSubmitted.length}</strong></p>
              <p style="margin: 4px 0;">At risk: <strong>${atRisk.length}</strong></p>
              <p style="margin: 4px 0;">Not started or paused: <strong>${notStarted.length + paused.length}</strong></p>
              <p style="margin: 4px 0;">Engagement rate: <strong>${activeMentees.length > 0 ? Math.round((submitted.length / activeMentees.length) * 100) : 0}%</strong></p>
            </div>

            <p style="margin-top: 24px;">Log in to your dashboard at <a href="https://buildintech.xyz/liaison/login">buildintech.xyz/liaison/login</a> to send check-in messages.</p>

            <p>Build In Tech Mentorship Team</p>
          </div>
        `,
      })
    }
    console.log('[Scheduler] Liaison weekly reports sent')
  } catch (error) {
    console.error('[Scheduler] Liaison report error:', error)
  }
})

// Keep Supabase awake by pinging every 4 days
cron.schedule('0 8 */4 * *', async () => {
  try {
    await prisma.mentor.count()
    console.log('[Scheduler] Supabase keep-alive ping sent')
  } catch (error) {
    console.error('[Scheduler] Keep-alive ping failed:', error)
  }
})

// ─────────────────────────────────────────────
// JOB: Premium Expiry Check
// Runs every day at 6am server time — reverts expired Premium mentees to Free
// ─────────────────────────────────────────────
cron.schedule('0 6 * * *', async () => {
  console.log('[Scheduler] Running premium expiry check...')
  try {
    const expired = await prisma.mentee.findMany({
      where: { plan: 'PREMIUM', planExpiresAt: { lt: new Date() } },
    })

    for (const mentee of expired) {
      await prisma.mentee.update({
        where: { id: mentee.id },
        data: { plan: 'FREE', planExpiresAt: null },
      })

      await sendPremiumExpiredEmail({ name: mentee.name, email: mentee.email }).catch(err =>
        console.error('Premium expired email error:', err.message)
      )

      console.log(`[Scheduler] Premium expired for ${mentee.email}, reverted to FREE`)
    }
  } catch (error) {
    console.error('[Scheduler] Premium expiry check error:', error)
  }
})

// ─────────────────────────────────────────────
// JOB: Daily job fetch
// Runs every day at 2am server time
// Fetches new listings from RemoteOK and Arbeitnow, upserts by externalId
// ─────────────────────────────────────────────
cron.schedule('0 2 * * *', async () => {
  console.log('[Scheduler] Running daily job fetch...')
  try {
    const { fetchAndStoreJobs } = await import('../services/jobFetchService.js')
    const result = await fetchAndStoreJobs()
    console.log(`[Scheduler] Job fetch complete — ${result.added} new listings added`)
    if (result.errors.length) console.warn('[Scheduler] Job fetch errors:', result.errors)
  } catch (error) {
    console.error('[Scheduler] Job fetch error:', error)
  }
})

// ─────────────────────────────────────────────
// JOB: Weekly income opportunity research
// Runs every Sunday at 3am — Groq researches new platforms, inserts as PENDING
// ─────────────────────────────────────────────
cron.schedule('0 3 * * 0', async () => {
  console.log('[Scheduler] Running weekly income opportunity research...')
  try {
    const { researchAndProposeOpportunities } = await import('../services/incomeResearchService.js')
    const added = await researchAndProposeOpportunities()
    console.log(`[Scheduler] Income research complete — ${added} new proposals added`)
  } catch (error) {
    console.error('[Scheduler] Income research error:', error)
  }
})

// Seed default income opportunities on startup (idempotent — skips if already present)
;(async () => {
  try {
    const { seedDefaultOpportunities } = await import('../services/incomeResearchService.js')
    await seedDefaultOpportunities()
    console.log('[Scheduler] Default income opportunities seeded')
  } catch (error) {
    console.error('[Scheduler] Seed error:', error)
  }
})()

// ─────────────────────────────────────────────
// JOB: Abandoned lead follow-up
// Runs daily at 10am — emails leads who started but never completed (>24h, not yet sent)
// ─────────────────────────────────────────────
cron.schedule('0 10 * * *', async () => {
  console.log('[Scheduler] Running abandoned lead follow-up...')
  try {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const leads = await prisma.leadCapture.findMany({
      where: {
        completedAt: null,
        followUpSent: false,
        startedAt: { lt: cutoff },
      },
    })

    const { sendEmail } = await import('../emails/sender.js')

    for (const lead of leads) {
      const firstName = lead.firstName || 'there'
      const assessmentUrl = `${process.env.FRONTEND_URL}/assessment`

      await sendEmail({
        to: lead.email,
        subject: 'You left your results behind',
        html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f9f7f1;font-family:Arial,sans-serif;color:#0F1F3D;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="background:white;border-radius:16px;padding:40px;border:1px solid #E8E4D9;">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#C9A84C;margin-bottom:16px;">Build In Tech</div>
      <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#0F1F3D;font-family:Georgia,serif;">
        Hi ${firstName}, your results are waiting
      </h1>
      <p style="margin:0 0 16px;color:#4A3F2F;font-size:15px;line-height:1.7;">
        You started the Tech Career Assessment but didn't quite finish it. Your personalised domain match and 48-week roadmap are just a few questions away.
      </p>
      <p style="margin:0 0 24px;color:#4A3F2F;font-size:15px;line-height:1.7;">
        It takes about 8 minutes. No account needed — just complete the quiz and see your match instantly.
      </p>
      <a href="${assessmentUrl}"
         style="display:inline-block;background:#C9A84C;color:#0F1F3D;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:14px;font-weight:700;">
        Complete My Assessment →
      </a>
      <div style="border-top:1px solid #E8E4D9;padding-top:20px;margin-top:32px;">
        <p style="margin:0;font-size:12px;color:#9A8E7E;">Build In Tech — Your tech career starts here.</p>
      </div>
    </div>
  </div>
</body>
</html>`,
      })

      await prisma.leadCapture.update({
        where: { id: lead.id },
        data: { followUpSent: true },
      })

      console.log(`[Scheduler] Abandoned lead follow-up sent to ${lead.email}`)
    }
  } catch (error) {
    console.error('[Scheduler] Abandoned lead follow-up error:', error)
  }
})

// ─────────────────────────────────────────────
// JOB: Completed-but-no-account follow-up
// Runs daily at 10am — emails leads who completed assessment but never created a mentee account (>48h)
// ─────────────────────────────────────────────
cron.schedule('0 10 * * *', async () => {
  console.log('[Scheduler] Running completed-no-account follow-up...')
  try {
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000)
    const leads = await prisma.leadCapture.findMany({
      where: {
        completedAt: { not: null, lt: cutoff },
        followUpSent: false,
      },
    })

    const emails = leads.map(l => l.email)
    const existingMentees = emails.length > 0
      ? await prisma.mentee.findMany({ where: { email: { in: emails } }, select: { email: true } })
      : []
    const menteeEmailSet = new Set(existingMentees.map(m => m.email))

    const leadsWithoutAccounts = leads.filter(l => !menteeEmailSet.has(l.email))

    const { sendEmail } = await import('../emails/sender.js')

    for (const lead of leadsWithoutAccounts) {
      const firstName = lead.firstName || 'there'
      const assessmentUrl = `${process.env.FRONTEND_URL}/assessment`

      await sendEmail({
        to: lead.email,
        subject: 'Your tech career match is ready — next step inside',
        html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f9f7f1;font-family:Arial,sans-serif;color:#0F1F3D;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="background:white;border-radius:16px;padding:40px;border:1px solid #E8E4D9;">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#C9A84C;margin-bottom:16px;">Build In Tech</div>
      <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#0F1F3D;font-family:Georgia,serif;">
        Hi ${firstName}, ready to start your roadmap?
      </h1>
      <p style="margin:0 0 16px;color:#4A3F2F;font-size:15px;line-height:1.7;">
        You completed the assessment and got your domain match. The next step is to begin your 48-week personalised roadmap inside the platform.
      </p>
      <p style="margin:0 0 24px;color:#4A3F2F;font-size:15px;line-height:1.7;">
        Your access code was sent to this email after you completed the quiz. Use it to log in and start Week 1 of your journey today.
      </p>
      <a href="${assessmentUrl}"
         style="display:inline-block;background:#C9A84C;color:#0F1F3D;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:14px;font-weight:700;">
        Get Back to My Results →
      </a>
      <div style="border-top:1px solid #E8E4D9;padding-top:20px;margin-top:32px;">
        <p style="margin:0;font-size:12px;color:#9A8E7E;">Build In Tech — Your tech career starts here.</p>
      </div>
    </div>
  </div>
</body>
</html>`,
      })

      await prisma.leadCapture.update({
        where: { id: lead.id },
        data: { followUpSent: true },
      })

      console.log(`[Scheduler] Completed-no-account follow-up sent to ${lead.email}`)
    }
  } catch (error) {
    console.error('[Scheduler] Completed-no-account follow-up error:', error)
  }
})

console.log('[Scheduler] All cron jobs registered')