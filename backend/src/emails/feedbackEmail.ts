import { sendEmail } from './sender'

interface FeedbackEmailData {
  name: string
  email: string
  weekNumber: number
  feedback: string
}

export async function sendFeedbackEmail(data: FeedbackEmailData) {
  const firstName = data.name.split(' ')[0]
  const dashboardUrl = `${process.env.FRONTEND_URL}/dashboard`

  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#faf7f2;font-family:Arial,sans-serif;color:#1a1208;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:white;border-radius:16px;padding:40px;border:1px solid #e2d9cc;">

      <h1 style="margin:0 0 14px;font-size:24px;font-weight:800;color:#1a1208;">
        Your mentor left feedback on Week ${data.weekNumber}
      </h1>

      <p style="margin:0 0 24px;color:#4a3f2f;font-size:15px;line-height:1.7;">
        Hi ${firstName}, your mentor reviewed your Week ${data.weekNumber} submission and left feedback for you.
      </p>

      <div style="background:#faf7f2;border-left:4px solid #d4622a;border-radius:0 12px 12px 0;padding:20px 24px;margin-bottom:28px;">
        <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#d4622a;">
          Mentor Feedback
        </p>
        <p style="margin:0;font-size:15px;color:#1a1208;line-height:1.7;">
          ${data.feedback}
        </p>
      </div>

      <a href="${dashboardUrl}"
         style="display:inline-block;background:#d4622a;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:14px;font-weight:600;margin-bottom:24px;">
        View Full Submission →
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
    subject: `Your mentor left feedback on Week ${data.weekNumber}, ${firstName}`,
    html,
  })

  console.log(`Feedback email sent to ${data.email} for week ${data.weekNumber}`)
}