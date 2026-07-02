import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailAttachment {
  filename: string
  content: Buffer
}

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  from?: string
  attachments?: SendEmailAttachment[]
}

export async function sendEmail({ to, subject, html, from, attachments }: SendEmailOptions) {
  const result = await resend.emails.send({
    from: from || `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to,
    subject,
    html,
    ...(attachments ? { attachments } : {}),
  })

  // Resend's SDK resolves with { data, error } even on failure — it never rejects.
  // Without this throw, callers' .catch() handlers never fire and failures go silent.
  if (result.error) {
    throw new Error(`Resend error sending "${subject}" to ${to}: ${result.error.message}`)
  }

  return result
}