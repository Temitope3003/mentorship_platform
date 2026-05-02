import { Router, Request, Response } from 'express'
import { requireMentee } from '../middleware/auth'
import {
  getProfile,
  getRoadmap,
  getSubmissions,
  createSubmission,
  getStats,
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