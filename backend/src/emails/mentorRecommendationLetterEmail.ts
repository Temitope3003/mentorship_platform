import { sendEmail } from './sender'

interface MentorRecommendationLetterEmailData {
  name: string
  email: string
  pdfBuffer: Buffer
}

export async function sendMentorRecommendationLetterEmail(data: MentorRecommendationLetterEmailData) {
  const firstName = data.name.split(' ')[0]

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F9F7F1;font-family:Arial,sans-serif;color:#0F1F3D;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <div style="background:#0F1F3D;border-radius:16px 16px 0 0;padding:36px 40px;">
      <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;">
        Your recommendation letter, ${firstName}
      </h1>
      <p style="margin:8px 0 0;color:#C9A84C;font-size:14px;">
        Personally written for you by the founder
      </p>
    </div>

    <div style="background:#ffffff;border-radius:0 0 16px 16px;padding:40px;border:1px solid #E8E4D9;border-top:none;">

      <p style="margin:0 0 20px;color:#4A4A4A;font-size:15px;line-height:1.7;">
        Thank you for your contribution as a mentor with Build In Tech. A personal letter of recommendation is attached to this email as a PDF — feel free to use it in job applications, LinkedIn, or anywhere it adds weight to your story.
      </p>

      <a href="${process.env.FRONTEND_URL}/mentor/login"
         style="display:inline-block;background:#C9A84C;color:#0F1F3D;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:700;">
        Go to My Dashboard →
      </a>

      <div style="border-top:1px solid #E8E4D9;padding-top:20px;margin-top:28px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#8A8070;">Build In Tech — Free AI Mentorship Platform</p>
      </div>

    </div>
  </div>
</body>
</html>`

  await sendEmail({
    to: data.email,
    subject: 'Your personal letter of recommendation from Build In Tech',
    html,
    attachments: [
      {
        filename: 'BuildInTech-Recommendation-Letter.pdf',
        content: data.pdfBuffer,
      },
    ],
  })
}
