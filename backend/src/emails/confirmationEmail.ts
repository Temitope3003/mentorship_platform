import { sendEmail } from './sender'

interface ConfirmationEmailData {
  name: string
  email: string
  weekNumber: number
  summary: string
  domain: string
}

export async function sendConfirmationEmail(data: ConfirmationEmailData) {
  const firstName = data.name.split(' ')[0]
  const dashboardUrl = `${process.env.FRONTEND_URL}/dashboard`

  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#faf7f2;font-family:Arial,sans-serif;color:#1a1208;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:white;border-radius:16px;padding:40px;border:1px solid #e2d9cc;">

      <div style="margin-bottom:24px;">
        <span style="background:#f0fdf9;border:1px solid #99f6e4;color:#1a7a6e;padding:6px 14px;border-radius:100px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">
          Week ${data.weekNumber} Submitted
        </span>
      </div>

      <h1 style="margin:0 0 14px;font-size:24px;font-weight:800;color:#1a1208;">
        Week ${data.weekNumber} received — keep going, ${firstName}
      </h1>

      <p style="margin:0 0 24px;color:#4a3f2f;font-size:15px;line-height:1.7;">
        Your Week ${data.weekNumber} submission has been received. Nice work staying consistent.
      </p>

      <div style="background:#faf7f2;border-radius:12px;padding:20px;margin-bottom:28px;border:1px solid #e2d9cc;">
        <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#9a8e7e;">
          What you submitted
        </p>
        <p style="margin:0;font-size:14px;color:#4a3f2f;line-height:1.6;">
          ${data.summary.length > 160 ? data.summary.substring(0, 160) + '...' : data.summary}
        </p>
      </div>

      <a href="${dashboardUrl}"
         style="display:inline-block;background:#d4622a;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:14px;font-weight:600;margin-bottom:24px;">
        View Dashboard →
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
    subject: `Week ${data.weekNumber} received — keep going, ${firstName}`,
    html,
  })

  console.log(`Confirmation email sent to ${data.email} for week ${data.weekNumber}`)
}