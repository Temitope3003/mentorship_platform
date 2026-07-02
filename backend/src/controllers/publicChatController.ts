import { Request, Response } from 'express'
import { prisma } from '../models/prisma'
import { getPublicChatReply } from '../services/publicChatbotService'
import { getMentorApplicantChatReply } from '../services/mentorApplicantChatbotService'

const PUBLIC_CHAT_HISTORY_LIMIT = 30
const PUBLIC_CHAT_CONTEXT_WINDOW = 6

export async function publicChat(req: Request, res: Response) {
  try {
    const { message, sessionId } = req.body

    if (!message || !String(message).trim()) {
      return res.status(400).json({ error: 'Message is required' })
    }
    if (String(message).trim().length > 2000) {
      return res.status(400).json({ error: 'Message is too long' })
    }
    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({ error: 'sessionId is required' })
    }

    await prisma.publicChatMessage.create({
      data: { sessionId, context: 'visitor', role: 'user', content: String(message).trim() },
    })

    const recentMessages = await prisma.publicChatMessage.findMany({
      where: { sessionId, context: 'visitor' },
      orderBy: { createdAt: 'desc' },
      take: PUBLIC_CHAT_CONTEXT_WINDOW,
    })
    const historyChronological = recentMessages.reverse()

    const reply = await getPublicChatReply(historyChronological.map((m) => ({ role: m.role, content: m.content })))

    await prisma.publicChatMessage.create({
      data: { sessionId, context: 'visitor', role: 'assistant', content: reply },
    })

    return res.json({ reply })
  } catch (error) {
    console.error('Public chat error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getPublicChatHistory(req: Request, res: Response) {
  try {
    const sessionId = String(req.params.sessionId)

    const messages = await prisma.publicChatMessage.findMany({
      where: { sessionId, context: 'visitor' },
      orderBy: { createdAt: 'desc' },
      take: PUBLIC_CHAT_HISTORY_LIMIT,
    })

    return res.json(messages.reverse())
  } catch (error) {
    console.error('Get public chat history error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function clearPublicChatHistory(req: Request, res: Response) {
  try {
    const sessionId = String(req.params.sessionId)
    await prisma.publicChatMessage.deleteMany({ where: { sessionId, context: 'visitor' } })
    return res.json({ message: 'Chat history cleared' })
  } catch (error) {
    console.error('Clear public chat history error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function mentorApplicantChat(req: Request, res: Response) {
  try {
    const { message, sessionId } = req.body

    if (!message || !String(message).trim()) {
      return res.status(400).json({ error: 'Message is required' })
    }
    if (String(message).trim().length > 2000) {
      return res.status(400).json({ error: 'Message is too long' })
    }
    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({ error: 'sessionId is required' })
    }

    await prisma.publicChatMessage.create({
      data: { sessionId, context: 'mentor_applicant', role: 'user', content: String(message).trim() },
    })

    const recentMessages = await prisma.publicChatMessage.findMany({
      where: { sessionId, context: 'mentor_applicant' },
      orderBy: { createdAt: 'desc' },
      take: PUBLIC_CHAT_CONTEXT_WINDOW,
    })
    const historyChronological = recentMessages.reverse()

    const reply = await getMentorApplicantChatReply(historyChronological.map((m) => ({ role: m.role, content: m.content })))

    await prisma.publicChatMessage.create({
      data: { sessionId, context: 'mentor_applicant', role: 'assistant', content: reply },
    })

    return res.json({ reply })
  } catch (error) {
    console.error('Mentor applicant chat error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getMentorApplicantChatHistory(req: Request, res: Response) {
  try {
    const sessionId = String(req.params.sessionId)

    const messages = await prisma.publicChatMessage.findMany({
      where: { sessionId, context: 'mentor_applicant' },
      orderBy: { createdAt: 'desc' },
      take: PUBLIC_CHAT_HISTORY_LIMIT,
    })

    return res.json(messages.reverse())
  } catch (error) {
    console.error('Get mentor applicant chat history error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
