import { Request, Response } from 'express'
import { prisma } from '../models/prisma'

export async function submitContactForm(req: Request, res: Response) {
  try {
    const { name, email, subject, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required' })
    }
    if (!email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required' })
    }

    const { sendEmail } = await import('../emails/sender.js')
    await sendEmail({
      to: 'hello@buildintech.xyz',
      subject: `Contact form: ${subject || 'General enquiry'} — from ${name}`,
      html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f9f7f1;font-family:Arial,sans-serif;color:#0F1F3D;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="background:white;border-radius:12px;padding:32px;border:1px solid #E8E4D9;">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#C9A84C;margin-bottom:16px;">Build In Tech — Contact Form</div>
      <h2 style="margin:0 0 20px;font-size:18px;color:#0F1F3D;">New message from ${name}</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr><td style="padding:8px 0;font-size:12px;font-weight:700;color:#8A8070;width:100px;text-transform:uppercase;letter-spacing:0.06em;">Name</td><td style="padding:8px 0;font-size:14px;color:#0F1F3D;">${name}</td></tr>
        <tr><td style="padding:8px 0;font-size:12px;font-weight:700;color:#8A8070;text-transform:uppercase;letter-spacing:0.06em;">Email</td><td style="padding:8px 0;font-size:14px;color:#0F1F3D;"><a href="mailto:${email}" style="color:#C9A84C;">${email}</a></td></tr>
        <tr><td style="padding:8px 0;font-size:12px;font-weight:700;color:#8A8070;text-transform:uppercase;letter-spacing:0.06em;">Subject</td><td style="padding:8px 0;font-size:14px;color:#0F1F3D;">${subject || 'General enquiry'}</td></tr>
      </table>
      <div style="background:#F9F7F1;border-radius:8px;padding:20px;border:1px solid #E8E4D9;">
        <div style="font-size:11px;font-weight:700;color:#8A8070;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;">Message</div>
        <p style="margin:0;font-size:14px;color:#0F1F3D;line-height:1.7;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
      </div>
    </div>
  </div>
</body>
</html>`,
    })

    return res.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return res.status(500).json({ error: 'Failed to send message. Please try again.' })
  }
}

export async function captureAssessmentLead(req: Request, res: Response) {
  try {
    const { email, firstName, phoneNumber } = req.body

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required' })
    }

    const lead = await prisma.leadCapture.create({
      data: {
        email: email.trim().toLowerCase(),
        firstName: firstName?.trim() || null,
        phoneNumber: phoneNumber?.trim() || null,
      },
    })

    return res.status(201).json({ leadId: lead.id })
  } catch (error) {
    console.error('Lead capture error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
