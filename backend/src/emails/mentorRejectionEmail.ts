import { sendEmail } from './sender'

interface MentorRejectionEmailData {
  name: string
  email: string
}

export async function sendMentorRejectionEmail(data: MentorRejectionEmailData) {
  const firstName = data.name.split(' ')[0]

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F9F7F1;font-family:Arial,sans-serif;color:#0F1F3D;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <div style="background:#0F1F3D;border-radius:16px 16px 0 0;padding:36px 40px;">
      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;">
        Update on your mentor application
      </h1>
    </div>

    <div style="background:#ffffff;border-radius:0 0 16px 16px;padding:40px;border:1px solid #E8E4D9;border-top:none;">

      <p style="margin:0 0 20px;color:#4A4A4A;font-size:15px;line-height:1.7;">
        Hi ${firstName},
      </p>

      <p style="margin:0 0 20px;color:#4A4A4A;font-size:15px;line-height:1.7;">
        Thank you for your interest in mentoring with Build In Tech. After reviewing your application, we are not able to move forward with onboarding you as a mentor at this time.
      </p>

      <p style="margin:0 0 28px;color:#4A4A4A;font-size:15px;line-height:1.7;">
        This is not a reflection of your skills or experience. We receive more applications than we currently have mentee capacity for, and we encourage you to apply again in the future as the program grows.
      </p>

      <div style="border-top:1px solid #E8E4D9;padding-top:20px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#8A8070;">Build In Tech — Free AI Mentorship Platform</p>
      </div>

    </div>
  </div>
</body>
</html>`

  await sendEmail({
    to: data.email,
    subject: 'Update on your Build In Tech mentor application',
    html,
    from: 'Build In Tech <noreply@buildintech.xyz>',
  })

  console.log(`Mentor rejection email sent to ${data.email}`)
}
