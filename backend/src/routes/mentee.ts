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