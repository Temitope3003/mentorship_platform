import { sendEmail } from './sender'

interface PauseResumeAlertData {
  recipientName: string
  recipientEmail: string
  menteeName: string
  menteeTrack: string
  action: 'paused' | 'resumed'
  reason?: string | null
}

export async function sendMenteePauseResumeAlertEmail(data: PauseResumeAlertData) {
  const isPause = data.action === 'paused'
  const recipientFirstName = data.recipientName.split(' ')[0]

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F9F7F1;font-family:Arial,sans-serif;color:#0F1F3D;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:#0F1F3D;border-radius:16px 16px 0 0;padding:32px 40px;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;">
        ${isPause ? 'Mentee Paused Their Journey' : 'Mentee Resumed Their Journey'}
      </h1>
      <p style="margin:8px 0 0;color:#C9A84C;font-size:14px;">
        Build In Tech — Program Update
      </p>
    </div>

    <div style="background:#ffffff;border-radius:0 0 16px 16px;padding:40px;border:1px solid #E8E4D9;border-top:none;">

      <p style="margin:0 0 24px;color:#4A4A4A;font-size:15px;line-height:1.7;">
        Hi ${recipientFirstName}, ${isPause
          ? 'a mentee you support has paused their mentorship journey.'
          : 'a mentee you support has resumed their mentorship journey after a pause.'}
      </p>

      <div style="background:#F9F7F1;border-radius:12px;padding:24px;margin-bottom:20px;border:1px solid #E8E4D9;">
        <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8A8070;">Mentee Details</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-bottom:8px;font-size:13px;color:#8A8070;width:100px;">Name</td>
            <td style="padding-bottom:8px;font-size:14px;color:#0F1F3D;font-weight:600;">${data.menteeName}</td>
          </tr>
          <tr>
            <td style="padding-bottom:8px;font-size:13px;color:#8A8070;">Track</td>
            <td style="padding-bottom:8px;font-size:14px;color:#0F1F3D;">${data.menteeTrack}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#8A8070;">Status</td>
            <td style="font-size:14px;color:${isPause ? '#b45309' : '#15803d'};font-weight:600;">${isPause ? 'Paused' : 'Active again'}</td>
          </tr>
        </table>
      </div>

      ${data.reason ? `
      <div style="background:#FBF7EC;border:1px solid #DFC97A;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#7A5C1E;">Reason given</p>
        <p style="margin:0;font-size:14px;color:#4A4A4A;line-height:1.65;font-style:italic;">"${data.reason}"</p>
      </div>` : ''}

      <p style="margin:0;font-size:13px;color:#8A8070;line-height:1.7;">
        ${isPause
          ? 'No action is needed from you right now. Reminders and at-risk checks are paused for this mentee until they resume.'
          : 'This mentee is now back on the active roster and reminders will resume as normal.'}
      </p>

      <div style="border-top:1px solid #E8E4D9;padding-top:20px;margin-top:28px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#8A8070;">Build In Tech — Mentorship Program</p>
      </div>

    </div>
  </div>
</body>
</html>`

  await sendEmail({
    to: data.recipientEmail,
    subject: isPause
      ? `${data.menteeName} has paused their mentorship journey`
      : `${data.menteeName} has resumed their mentorship journey`,
    html,
  })
}
