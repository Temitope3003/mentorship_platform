import { sendEmail } from './sender'

interface MentorApprovalEmailData {
  name: string
  email: string
}

export async function sendMentorApprovalEmail(data: MentorApprovalEmailData) {
  const firstName = data.name.split(' ')[0]
  const loginUrl = `${process.env.FRONTEND_URL}/mentor/login`

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F9F7F1;font-family:Arial,sans-serif;color:#0F1F3D;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <div style="background:#0F1F3D;border-radius:16px 16px 0 0;padding:36px 40px;">
      <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;">
        Welcome aboard, ${firstName}
      </h1>
      <p style="margin:8px 0 0;color:#C9A84C;font-size:14px;">
        Your mentor application has been approved
      </p>
    </div>

    <div style="background:#ffffff;border-radius:0 0 16px 16px;padding:40px;border:1px solid #E8E4D9;border-top:none;">

      <p style="margin:0 0 28px;color:#4A4A4A;font-size:15px;line-height:1.7;">
        Great news — your application to mentor with Build In Tech has been reviewed and approved. You can now log in to your mentor dashboard and start supporting mentees.
      </p>

      <div style="background:#F9F7F1;border-radius:12px;padding:28px;margin-bottom:28px;text-align:center;border:1px solid #E8E4D9;">
        <p style="margin:0 0 16px;font-size:13px;color:#8A8070;">Your account is ready</p>
        <a href="${loginUrl}"
           style="display:inline-block;background:#C9A84C;color:#0F1F3D;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:15px;font-weight:700;">
          Log In to My Dashboard →
        </a>
        <p style="margin:16px 0 0;font-size:12px;color:#8A8070;">Use the email and password you registered with.</p>
      </div>

      <div style="margin-bottom:8px;">
        <p style="margin:0 0 16px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#8A8070;">
          What you can do from your dashboard
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${[
            'View and manage all assigned mentees',
            'Review weekly submissions and leave feedback',
            'Track program-wide engagement and at-risk mentees',
            'Add new mentees and manage liaison officers',
          ].map((step, i) => `
          <tr>
            <td width="32" valign="top" style="padding-bottom:12px;">
              <span style="display:inline-block;width:24px;height:24px;background:#0F1F3D;border-radius:50%;font-size:11px;font-weight:700;color:#C9A84C;text-align:center;line-height:24px;">${i + 1}</span>
            </td>
            <td valign="top" style="padding-bottom:12px;padding-left:8px;">
              <p style="margin:0;font-size:14px;color:#4A4A4A;line-height:1.5;">${step}</p>
            </td>
          </tr>`).join('')}
        </table>
      </div>

      <div style="border-top:1px solid #E8E4D9;padding-top:20px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#8A8070;">Build In Tech — Free AI Mentorship Platform</p>
      </div>

    </div>
  </div>
</body>
</html>`

  await sendEmail({
    to: data.email,
    subject: 'Your Build In Tech mentor application has been approved',
    html,
    from: 'Build In Tech <noreply@buildintech.xyz>',
  })

  console.log(`Mentor approval email sent to ${data.email}`)
}
