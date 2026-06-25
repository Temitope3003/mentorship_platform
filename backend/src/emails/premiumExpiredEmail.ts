import { sendEmail } from './sender'

interface PremiumExpiredEmailData {
  name: string
  email: string
}

export async function sendPremiumExpiredEmail(data: PremiumExpiredEmailData) {
  const firstName = data.name.split(' ')[0]

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F9F7F1;font-family:Arial,sans-serif;color:#0F1F3D;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <div style="background:#0F1F3D;border-radius:16px 16px 0 0;padding:36px 40px;">
      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;">
        Your Premium plan has expired
      </h1>
    </div>

    <div style="background:#ffffff;border-radius:0 0 16px 16px;padding:40px;border:1px solid #E8E4D9;border-top:none;">

      <p style="margin:0 0 20px;color:#4A4A4A;font-size:15px;line-height:1.7;">
        Hi ${firstName},
      </p>

      <p style="margin:0 0 24px;color:#4A4A4A;font-size:15px;line-height:1.7;">
        Your Build In Tech Premium plan has expired and your account has reverted to the Free tier. You still have full access to the curriculum, your certificate of completion, and liaison support — you just won't have 1-on-1 mentor calls, priority feedback, and the other Premium perks until you renew.
      </p>

      <div style="background:#F9F7F1;border-radius:12px;padding:24px;margin-bottom:24px;border:1px solid #E8E4D9;">
        <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#8A8070;">
          Renew via PalmPay
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-bottom:8px;font-size:13px;color:#8A8070;width:120px;">Account Number</td>
            <td style="padding-bottom:8px;font-size:15px;color:#0F1F3D;font-weight:700;font-family:monospace;">8146424841</td>
          </tr>
          <tr>
            <td style="padding-bottom:8px;font-size:13px;color:#8A8070;">Account Name</td>
            <td style="padding-bottom:8px;font-size:14px;color:#0F1F3D;font-weight:600;">Ajao Temitope E.</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#8A8070;">Pricing</td>
            <td style="font-size:14px;color:#0F1F3D;">₦20,000/month or ₦200,000/year</td>
          </tr>
        </table>
      </div>

      <a href="${process.env.FRONTEND_URL}/login"
         style="display:inline-block;background:#C9A84C;color:#0F1F3D;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:700;">
        Renew My Premium Plan →
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
    subject: 'Your Build In Tech Premium plan has expired',
    html,
  })
}
