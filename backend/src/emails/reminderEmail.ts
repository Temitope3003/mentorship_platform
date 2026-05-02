import { sendEmail } from './sender'

interface ReminderEmailData {
  name: string
  email: string
  weekNumber: number
  weekTitle: string
  isFinal?: boolean
}

export async function sendReminderEmail(data: ReminderEmailData) {
  const firstName = data.name.split(' ')[0]
  const dashboardUrl = `${process.env.FRONTEND_URL}/dashboard`
  const isFinal = data.isFinal || false

  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#faf7f2;font-family:Arial,sans-serif;color:#1a1208;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:white;border-radius:16px;padding:40px;border:1px solid #e2d9cc;">

      <h1 style="margin:0 0 14px;font-size:24px;font-weight:800;color:#1a1208;">
        ${isFinal
          ? `Last chance — Week ${data.weekNumber} ends today, ${firstName}`
          : `Week ${data.weekNumber} is waiting for you, ${firstName}`
        }
      </h1>

      <p style="margin:0 0 24px;color:#4a3f2f;font-size:15px;line-height:1.7;">
        ${isFinal
          ? `You have not submitted Week ${data.weekNumber} yet and the week is ending. Even a rough draft counts. The goal is consistency, not perfection.`
          : `Just a quick check-in. You have not submitted your Week ${data.weekNumber} assignment yet.`
        }
      </p>

      <div style="background:#faf7f2;border-radius:12px;padding:20px;margin-bottom:28px;border:1px solid #e2d9cc;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#9a8e7e;">
          This week's assignment
        </p>
        <p style="margin:0;font-size:15px;font-weight:600;color:#1a1208;">
          ${data.weekTitle}
        </p>
      </div>

      <a href="${dashboardUrl}"
         style="display:inline-block;background:#d4622a;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:14px;font-weight:600;margin-bottom:24px;">
        Submit Now →
      </a>

      <div style="border-top:1px solid #e2d9cc;padding-top:20px;">
        <p style="margin:0;font-size:12px;color:#9a8e7e;text-align:center;">
          MLOps Mentorship Program
        </p>
      </div>

    </div>
  </div>
</body>
</html>`

  await sendEmail({
    to: data.email,
    subject: isFinal
      ? `Last chance — Week ${data.weekNumber} ends today, ${firstName}`
      : `Week ${data.weekNumber} is waiting for you, ${firstName}`,
    html,
  })

  console.log(`Reminder email sent to ${data.email} for week ${data.weekNumber}`)
}