import { Request, Response } from 'express'
import { prisma } from '../models/prisma'

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
