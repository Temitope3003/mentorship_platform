import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import {
  publicChat,
  getPublicChatHistory,
  clearPublicChatHistory,
  mentorApplicantChat,
  getMentorApplicantChatHistory,
} from '../controllers/publicChatController'

export const publicRouter = Router()

const chatRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "You've reached the chat limit for now. Try again in an hour, or take the free assessment to get started!" },
})

const mentorChatRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "You've reached the chat limit for now. Try again in an hour." },
})

publicRouter.post('/chat', chatRateLimiter, publicChat)
publicRouter.get('/chat/history/:sessionId', getPublicChatHistory)
publicRouter.delete('/chat/history/:sessionId', clearPublicChatHistory)

publicRouter.post('/mentor-chat', mentorChatRateLimiter, mentorApplicantChat)
publicRouter.get('/mentor-chat/history/:sessionId', getMentorApplicantChatHistory)
