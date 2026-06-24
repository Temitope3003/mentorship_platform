import { sendEmail } from './sender'

interface MentorApplicationAlertData {
  name: string
  email: string
  applicationNote: string | null
}

export async function sendMentorApplicationAlertEmail(data: MentorApplicationAlertData) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F9F7F1;font-family:Arial,sans-serif;color:#0F1F3D;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:#0F1F3D;border-radius:16px 16px 0 0;padding:32px 40px;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;">
        New Mentor Application
      </h1>
      <p style="margin:8px 0 0;color:#C9A84C;font-size:14px;">
        Build In Tech — Mentor Review Queue
      </p>
    </div>

    <div style="background:#ffffff;border-radius:0 0 16px 16px;padding:40px;border:1px solid #E8E4D9;border-top:none;">

      <p style="margin:0 0 24px;color:#4A4A4A;font-size:15px;line-height:1.7;">
        Someone has applied to become a mentor. Review and respond from the Applications tab on the mentor dashboard.
      </p>

      <div style="background:#F9F7F1;border-radius:12px;padding:24px;margin-bottom:20px;border:1px solid #E8E4D9;">
        <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8A8070;">Applicant Details</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-bottom:8px;font-size:13px;color:#8A8070;width:100px;">Name</td>
            <td style="padding-bottom:8px;font-size:14px;color:#0F1F3D;font-weight:600;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding-bottom:8px;font-size:13px;color:#8A8070;">Email</td>
            <td style="padding-bottom:8px;font-size:14px;color:#0F1F3D;">${data.email}</td>
          </tr>
        </table>
      </div>

      ${data.applicationNote ? `
      <div style="background:#FBF7EC;border:1px solid #DFC97A;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#7A5C1E;">Why they want to mentor</p>
        <p style="margin:0;font-size:14px;color:#4A4A4A;line-height:1.65;font-style:italic;">"${data.applicationNote}"</p>
      </div>` : ''}

      <a href="${process.env.FRONTEND_URL}/mentor/login"
         style="display:inline-block;background:#C9A84C;color:#0F1F3D;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:700;">
        Review Applications →
      </a>

      <div style="border-top:1px solid #E8E4D9;padding-top:20px;margin-top:28px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#8A8070;">Build In Tech — Mentor Applications</p>
      </div>

    </div>
  </div>
</body>
</html>`

  await sendEmail({
    to: 'temitope@buildintech.xyz',
    subject: `New mentor application: ${data.name}`,
    html,
  })

  console.log(`Mentor application alert email sent for ${data.email}`)
}
