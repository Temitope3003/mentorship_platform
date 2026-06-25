import { Router, Request, Response } from 'express'
import { requireMentee } from '../middleware/auth'
import {
  getProfile,
  getRoadmap,
  getSubmissions,
  createSubmission,
  getStats,
  updateTrack,
  startJourney,
  pauseJourney,
  resumeJourney,
  submitPayment,
  getCertificate,
  requestCertificate,
  requestRecommendationLetter,
  chatWithBot,
  getChatHistory,
  clearChatHistory,
} from '../controllers/menteeController'



interface AuthRequest extends Request {
  menteeId?: string
}

export const menteeRouter = Router()

menteeRouter.use(requireMentee)

menteeRouter.get('/me', getProfile)
menteeRouter.get('/me/roadmap', getRoadmap)
menteeRouter.get('/me/submissions', getSubmissions)
menteeRouter.post('/me/submissions', createSubmission)
menteeRouter.get('/me/stats', getStats)
menteeRouter.patch('/me/track', updateTrack)
menteeRouter.post('/me/start', startJourney)
menteeRouter.post('/me/pause', pauseJourney)
menteeRouter.post('/me/resume', resumeJourney)
menteeRouter.post('/me/submit-payment', submitPayment)
menteeRouter.get('/me/certificate', getCertificate)
menteeRouter.post('/me/request-certificate', requestCertificate)
menteeRouter.post('/me/request-recommendation-letter', requestRecommendationLetter)
menteeRouter.post('/me/chat', chatWithBot)
menteeRouter.get('/me/chat/history', getChatHistory)
menteeRouter.delete('/me/chat/history', clearChatHistory)