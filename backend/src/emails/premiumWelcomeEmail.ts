import { sendEmail } from './sender'

interface PremiumWelcomeEmailData {
  name: string
  email: string
  plan: string
  planExpiresAt: Date
}

export async function sendPremiumWelcomeEmail(data: PremiumWelcomeEmailData) {
  const firstName = data.name.split(' ')[0]
  const planLabel = data.plan === 'YEARLY' ? 'Yearly' : 'Monthly'
  const expiresFormatted = data.planExpiresAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F9F7F1;font-family:Arial,sans-serif;color:#0F1F3D;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <div style="background:#0F1F3D;border-radius:16px 16px 0 0;padding:36px 40px;">
      <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;">
        Welcome to Premium, ${firstName}
      </h1>
      <p style="margin:8px 0 0;color:#C9A84C;font-size:14px;">
        Your payment has been confirmed
      </p>
    </div>

    <div style="background:#ffffff;border-radius:0 0 16px 16px;padding:40px;border:1px solid #E8E4D9;border-top:none;">

      <p style="margin:0 0 24px;color:#4A4A4A;font-size:15px;line-height:1.7;">
        Your ${planLabel} Premium plan is now active. Here is everything that just unlocked for you.
      </p>

      <div style="background:#F9F7F1;border-radius:12px;padding:24px;margin-bottom:24px;border:1px solid #E8E4D9;">
        <p style="margin:0 0 14px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#8A8070;">
          Your Premium Benefits
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${[
            '1-on-1 mentor calls',
            'Priority 24-hour feedback on submissions',
            'CV and LinkedIn profile review',
            'Mock interview practice',
            'Job placement support',
            'A personal recommendation letter on completion',
          ].map((step) => `
          <tr>
            <td width="24" valign="top" style="padding-bottom:10px;">
              <span style="color:#C9A84C;font-size:14px;">✓</span>
            </td>
            <td valign="top" style="padding-bottom:10px;">
              <p style="margin:0;font-size:14px;color:#1A1A1A;line-height:1.5;">${step}</p>
            </td>
          </tr>`).join('')}
        </table>
      </div>

      <div style="background:#FBF7EC;border:1px solid #DFC97A;border-radius:12px;padding:18px 20px;margin-bottom:24px;">
        <p style="margin:0;font-size:13px;color:#7A5C1E;">
          Your plan is active until <strong>${expiresFormatted}</strong>. We will email you a reminder before it expires.
        </p>
      </div>

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
    subject: 'Welcome to Build In Tech Premium',
    html,
  })
}
