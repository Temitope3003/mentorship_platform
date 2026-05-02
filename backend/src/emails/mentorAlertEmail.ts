import { sendEmail } from './sender'

interface MentorAlertEmailData {
  mentorEmail: string
  menteeName: string
  menteeEmail: string
  accessCode: string
  topMatch: string
  secondMatch: string
  alignmentStatus: string | null
  alignmentSummary: string | null
  warningText: string | null
  mentorNote: string | null
  statedGoal: string | null
}

export async function sendMentorAlertEmail(data: MentorAlertEmailData) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#faf7f2;font-family:Arial,sans-serif;color:#1a1208;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:#5b4fcf;border-radius:16px 16px 0 0;padding:32px 40px;">
      <h1 style="margin:0;color:white;font-size:22px;font-weight:800;">
        New Mentee: ${data.menteeName}
      </h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">
        Tech Mentorship Program — Mentor Alert
      </p>
    </div>

    <div style="background:white;border-radius:0 0 16px 16px;padding:40px;border:1px solid #e2d9cc;border-top:none;">

      <p style="margin:0 0 24px;color:#4a3f2f;font-size:15px;line-height:1.7;">
        A new mentee has completed their career assessment. Here is their full profile for your first 1-on-1.
      </p>

      <!-- mentee details -->
      <div style="background:#faf7f2;border-radius:12px;padding:24px;margin-bottom:20px;border:1px solid #e2d9cc;">
        <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#9a8e7e;">Mentee Details</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-bottom:8px;font-size:13px;color:#9a8e7e;width:120px;">Name</td>
            <td style="padding-bottom:8px;font-size:14px;color:#1a1208;font-weight:600;">${data.menteeName}</td>
          </tr>
          <tr>
            <td style="padding-bottom:8px;font-size:13px;color:#9a8e7e;">Email</td>
            <td style="padding-bottom:8px;font-size:14px;color:#1a1208;">${data.menteeEmail}</td>
          </tr>
          <tr>
            <td style="padding-bottom:8px;font-size:13px;color:#9a8e7e;">Access Code</td>
            <td style="padding-bottom:8px;font-size:14px;color:#1a1208;font-family:monospace;font-weight:700;">${data.accessCode}</td>
          </tr>
          <tr>
            <td style="padding-bottom:8px;font-size:13px;color:#9a8e7e;">Top Match</td>
            <td style="padding-bottom:8px;font-size:14px;color:#d4622a;font-weight:600;">${data.topMatch}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#9a8e7e;">2nd Match</td>
            <td style="font-size:14px;color:#1a1208;">${data.secondMatch}</td>
          </tr>
        </table>
      </div>

      <!-- stated goal -->
      ${data.statedGoal ? `
      <div style="background:#faf7f2;border-radius:12px;padding:20px;margin-bottom:20px;border:1px solid #e2d9cc;">
        <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#9a8e7e;">Their Stated Goal</p>
        <p style="margin:0;font-size:14px;color:#4a3f2f;line-height:1.65;font-style:italic;">"${data.statedGoal}"</p>
      </div>` : ''}

      <!-- alignment -->
      ${data.alignmentStatus ? `
      <div style="background:${data.alignmentStatus === 'match' ? '#f0fdf9' : '#fffbeb'};border:1px solid ${data.alignmentStatus === 'match' ? '#99f6e4' : '#fcd34d'};border-radius:12px;padding:20px;margin-bottom:20px;">
        <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${data.alignmentStatus === 'match' ? '#1a7a6e' : '#d97706'};">
          ${data.alignmentStatus === 'match' ? '✓ Goal and Aptitude Align' : '⚠ Goal and Aptitude Do Not Fully Match'}
        </p>
        ${data.alignmentSummary ? `<p style="margin:0;font-size:14px;color:#4a3f2f;line-height:1.65;">${data.alignmentSummary}</p>` : ''}
      </div>` : ''}

      ${data.warningText ? `
      <div style="background:#fff8f0;border-left:4px solid #d4622a;border-radius:0 12px 12px 0;padding:18px 20px;margin-bottom:20px;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#d4622a;">Gap Analysis</p>
        <p style="margin:0;font-size:14px;color:#4a3f2f;line-height:1.65;">${data.warningText}</p>
      </div>` : ''}

      <!-- mentor note -->
      ${data.mentorNote ? `
      <div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#5b4fcf;">
          🚩 Your 1-on-1 Talking Point
        </p>
        <p style="margin:0;font-size:14px;color:#4a3f2f;line-height:1.65;">${data.mentorNote}</p>
      </div>` : ''}

      <div style="border-top:1px solid #e2d9cc;padding-top:20px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#9a8e7e;">Tech Mentorship Program — Mentor Dashboard</p>
      </div>

    </div>
  </div>
</body>
</html>`

  await sendEmail({
    to: data.mentorEmail,
    subject: `New mentee: ${data.menteeName} just completed their assessment`,
    html,
  })

  console.log(`Mentor alert email sent to ${data.mentorEmail}`)
}