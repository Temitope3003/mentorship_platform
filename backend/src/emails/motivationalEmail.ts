import { sendEmail } from './sender'
import type { MotivationalTrigger } from '../services/motivationalMessageService'

interface MotivationalEmailData {
  to: string
  firstName: string
  currentWeek: number
  trigger: MotivationalTrigger
  message: string
}

function getSubject(firstName: string, currentWeek: number, trigger: MotivationalTrigger): string {
  if (trigger === 'nudge') return `Week ${currentWeek} is waiting for you`
  if (trigger === 'celebration') return `Hey ${firstName} 👋`
  return `Good morning, ${firstName}`
}

export async function sendMotivationalEmail(data: MotivationalEmailData): Promise<void> {
  const subject = getSubject(data.firstName, data.currentWeek, data.trigger)
  const dashboardUrl = `${process.env.FRONTEND_URL}/dashboard`

  const messageLines = data.message
    .split(/\n+/)
    .filter(l => l.trim())
    .map(l => `<p style="margin:0 0 14px;color:#2C1F0F;font-size:15px;line-height:1.75;">${l.trim()}</p>`)
    .join('')

  await sendEmail({
    to: data.to,
    from: `Build In Tech <noreply@buildintech.xyz>`,
    subject,
    html: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#F9F7F1;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#2C1F0F;">
  <div style="max-width:520px;margin:0 auto;padding:36px 20px 48px;">

    <div style="margin-bottom:28px;">
      <span style="font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#C9A84C;">
        Build In Tech
      </span>
    </div>

    <div style="background:#fff;border-radius:14px;padding:36px 32px 28px;border:1px solid #EBE7DC;">

      ${messageLines}

      <div style="margin-top:24px;padding-top:20px;border-top:1px solid #EBE7DC;">
        <a
          href="${dashboardUrl}"
          style="display:inline-block;color:#C9A84C;font-size:13px;font-weight:600;text-decoration:none;letter-spacing:0.02em;"
        >
          Open my dashboard →
        </a>
      </div>

    </div>

  </div>
</body>
</html>`,
  })
}
