import { sendEmail } from './sender'

interface CertificateIssuedEmailData {
  name: string
  email: string
  domainTrack: string
  pdfBuffer: Buffer
}

export async function sendCertificateIssuedEmail(data: CertificateIssuedEmailData) {
  const firstName = data.name.split(' ')[0]

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F9F7F1;font-family:Arial,sans-serif;color:#0F1F3D;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <div style="background:#0F1F3D;border-radius:16px 16px 0 0;padding:36px 40px;">
      <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;">
        Congratulations, ${firstName}!
      </h1>
      <p style="margin:8px 0 0;color:#C9A84C;font-size:14px;">
        Your certificate of completion is ready
      </p>
    </div>

    <div style="background:#ffffff;border-radius:0 0 16px 16px;padding:40px;border:1px solid #E8E4D9;border-top:none;">

      <p style="margin:0 0 20px;color:#4A4A4A;font-size:15px;line-height:1.7;">
        You have officially completed the ${data.domainTrack} program — a full 48-week mentorship journey. That is no small feat, and we're proud of the work you put in.
      </p>

      <p style="margin:0 0 24px;color:#4A4A4A;font-size:15px;line-height:1.7;">
        Your Certificate of Completion is attached to this email as a PDF. You can also download it again anytime from your dashboard.
      </p>

      <a href="${process.env.FRONTEND_URL}/login"
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
    subject: 'Your Build In Tech Certificate of Completion',
    html,
    attachments: [
      {
        filename: 'BuildInTech-Certificate-of-Completion.pdf',
        content: data.pdfBuffer,
      },
    ],
  })
}
