import { sendEmail } from './sender'

interface TopDomainBreakdown {
  domain: string
  score: number
  tagline: string
}

interface WelcomeEmailData {
  name: string
  email: string
  accessCode: string
  topMatch: string
  secondMatch: string
  topDomains?: TopDomainBreakdown[]
  alignmentStatus?: string | null
  mentorNote?: string | null
  alignmentSummary?: string | null
  warningText?: string | null
  choiceContext?: string | null
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  const firstName = data.name.split(' ')[0]
  const isConflict =
    data.alignmentStatus === 'conflict' ||
    data.alignmentStatus === 'partial'
  const isMatch = data.alignmentStatus === 'match'
  const dashboardUrl = `${process.env.FRONTEND_URL}/login`

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf7f2;font-family:Arial,sans-serif;color:#1a1208;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <!-- header -->
    <div style="background:#d4622a;border-radius:16px 16px 0 0;padding:36px 40px;">
      <h1 style="margin:0;color:white;font-size:26px;font-weight:800;">
        Welcome to the Program, ${firstName}
      </h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">
        Tech Mentorship Program
      </p>
    </div>

    <!-- body -->
    <div style="background:white;border-radius:0 0 16px 16px;padding:40px;border:1px solid #e2d9cc;border-top:none;">

      <p style="margin:0 0 28px;color:#4a3f2f;font-size:15px;line-height:1.7;">
        You have completed your career assessment. Here is a full breakdown of your results${data.alignmentStatus ? ', your AI-powered goal analysis,' : ''} and your access code.
      </p>

      <!-- career match -->
      <div style="background:#faf7f2;border-radius:12px;padding:24px;margin-bottom:24px;border:1px solid #e2d9cc;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#9a8e7e;">
          Your Top Career Match
        </p>
        <p style="margin:0;font-size:22px;font-weight:700;color:#d4622a;">
          ${data.topMatch}
        </p>
      </div>

      <!-- full results breakdown -->
      ${data.topDomains && data.topDomains.length > 0 ? `
      <div style="margin-bottom:24px;">
        <p style="margin:0 0 14px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#9a8e7e;">
          Your Full Results Breakdown
        </p>
        <div style="background:#faf7f2;border-radius:12px;padding:8px 20px;border:1px solid #e2d9cc;">
          ${data.topDomains.map((d, i) => {
            const topScore = data.topDomains![0].score || 1
            const pct = Math.max(6, Math.round((d.score / topScore) * 100))
            return `
          <div style="padding:16px 0;${i < data.topDomains!.length - 1 ? 'border-bottom:1px solid #e2d9cc;' : ''}">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:4px;">
              <tr>
                <td align="left">
                  <p style="margin:0;font-size:14px;font-weight:700;color:#1a1208;">
                    ${i + 1}. ${d.domain}
                  </p>
                </td>
                <td align="right">
                  <p style="margin:0;font-size:11px;color:#9a8e7e;font-family:monospace;white-space:nowrap;">
                    ${d.score} pts
                  </p>
                </td>
              </tr>
            </table>
            <div style="height:6px;border-radius:99px;background:#e2d9cc;overflow:hidden;margin-bottom:6px;">
              <div style="height:100%;border-radius:99px;background:${i === 0 ? '#d4622a' : '#c9bba3'};width:${pct}%;"></div>
            </div>
            ${d.tagline ? `<p style="margin:0;font-size:12.5px;color:#6b5d4a;line-height:1.5;">${d.tagline}</p>` : ''}
          </div>`
          }).join('')}
        </div>
      </div>
      ` : ''}

      <!-- AI ANALYSIS SECTION -->
      ${data.alignmentStatus ? `
      <div style="margin-bottom:24px;">
        <p style="margin:0 0 14px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#9a8e7e;">
          AI Goal Analysis
        </p>

        <!-- alignment status banner -->
        <div style="background:${isMatch ? '#f0fdf9' : '#fffbeb'};border:1px solid ${isMatch ? '#99f6e4' : '#fcd34d'};border-radius:12px;padding:18px 20px;margin-bottom:14px;">
          <p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${isMatch ? '#1a7a6e' : '#d97706'};">
            ${isMatch ? '✓ Goal and Aptitude Align' : '⚠ Goal and Aptitude Do Not Fully Match'}
          </p>
          ${data.alignmentSummary ? `
          <p style="margin:0;font-size:14px;color:#4a3f2f;line-height:1.65;">
            ${data.alignmentSummary}
          </p>` : ''}
        </div>

        ${data.warningText ? `
        <!-- conflict explanation -->
        <div style="background:#fff8f0;border-left:4px solid #d4622a;border-radius:0 12px 12px 0;padding:18px 20px;margin-bottom:14px;">
          <p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#d4622a;">
            Understanding the Gap
          </p>
          <p style="margin:0;font-size:14px;color:#4a3f2f;line-height:1.65;">
            ${data.warningText}
          </p>
        </div>` : ''}

        ${data.choiceContext ? `
        <!-- choice context -->
        <div style="background:#faf7f2;border-radius:12px;padding:16px 20px;margin-bottom:14px;border:1px solid #e2d9cc;">
          <p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#9a8e7e;">
            Your Two Paths
          </p>
          <p style="margin:0;font-size:14px;color:#4a3f2f;line-height:1.65;">
            ${data.choiceContext}
          </p>
        </div>` : ''}

      </div>
      ` : ''}

      <!-- access code -->
      <div style="background:#f0fdf9;border:1px solid #99f6e4;border-radius:12px;padding:28px;margin-bottom:28px;text-align:center;">
        <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#1a7a6e;">
          Your Access Code
        </p>
        <p style="margin:0 0 14px;font-size:32px;font-weight:700;letter-spacing:0.2em;color:#1a1208;font-family:monospace;">
          ${data.accessCode}
        </p>
        <p style="margin:0 0 20px;font-size:13px;color:#9a8e7e;">
          Use this code to log into your weekly learning dashboard
        </p>
        <a href="${dashboardUrl}"
           style="display:inline-block;background:#d4622a;color:white;padding:14px 32px;border-radius:12px;text-decoration:none;font-size:15px;font-weight:600;">
          Access My Dashboard →
        </a>
      </div>

      <!-- what happens next -->
      <div style="margin-bottom:28px;">
        <p style="margin:0 0 16px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#9a8e7e;">
          What happens next
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${[
            'Log in with your access code at the link above',
            'View your Week 1 assignment for the ' + data.topMatch + ' track',
            'Complete the assignment and submit your summary by end of the week',
            'Expect a 1-on-1 with your mentor in the next 7 days',
          ].map((step, i) => `
          <tr>
            <td width="32" valign="top" style="padding-bottom:12px;">
              <span style="display:inline-block;width:24px;height:24px;background:#d4622a;border-radius:50%;font-size:11px;font-weight:700;color:white;text-align:center;line-height:24px;">${i + 1}</span>
            </td>
            <td valign="top" style="padding-bottom:12px;padding-left:8px;">
              <p style="margin:0;font-size:14px;color:#4a3f2f;line-height:1.5;">${step}</p>
            </td>
          </tr>`).join('')}
        </table>
      </div>

      <!-- footer -->
      <div style="border-top:1px solid #e2d9cc;padding-top:20px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#9a8e7e;">
          Tech Mentorship Program — Free. Always.
        </p>
      </div>

    </div>
  </div>
</body>
</html>`

  await sendEmail({
    to: data.email,
    subject: `Welcome to the Program, ${firstName} — your results and access code are inside`,
    html,
  })

  console.log(`Welcome email sent to ${data.email}`)
}