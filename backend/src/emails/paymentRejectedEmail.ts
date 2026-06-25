import { sendEmail } from './sender'

interface PaymentRejectedEmailData {
  name: string
  email: string
}

export async function sendPaymentRejectedEmail(data: PaymentRejectedEmailData) {
  const firstName = data.name.split(' ')[0]

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F9F7F1;font-family:Arial,sans-serif;color:#0F1F3D;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <div style="background:#0F1F3D;border-radius:16px 16px 0 0;padding:36px 40px;">
      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;">
        We could not confirm your payment
      </h1>
    </div>

    <div style="background:#ffffff;border-radius:0 0 16px 16px;padding:40px;border:1px solid #E8E4D9;border-top:none;">

      <p style="margin:0 0 20px;color:#4A4A4A;font-size:15px;line-height:1.7;">
        Hi ${firstName},
      </p>

      <p style="margin:0 0 20px;color:#4A4A4A;font-size:15px;line-height:1.7;">
        Your mentor or liaison officer was unable to confirm the payment reference you submitted for Build In Tech Premium. This is usually because the reference did not match, or the transaction could not be found on our PalmPay account.
      </p>

      <div style="background:#FBF7EC;border:1px solid #DFC97A;border-radius:12px;padding:18px 20px;margin-bottom:24px;">
        <p style="margin:0;font-size:13px;color:#7A5C1E;line-height:1.65;">
          Please double-check your PalmPay transaction details and submit your payment reference again from your dashboard. If you believe this is a mistake, reply to this email and we will help sort it out.
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
    subject: 'Action needed: confirm your Build In Tech Premium payment details',
    html,
  })
}
