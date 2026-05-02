import { Router, Request, Response } from 'express'
import { requireMentor } from '../middleware/auth'
import {
  getAllMentees,
  getMentee,
  createMentee,
  getAllSubmissions,
  addFeedback,
  getCohortStats,
  getAccessCodes,
} from '../controllers/mentorController'

export const mentorRouter = Router()

mentorRouter.use(requireMentor)

mentorRouter.get('/mentees', getAllMentees)
mentorRouter.post('/mentees', createMentee)
mentorRouter.get('/mentees/:id', getMentee)
mentorRouter.get('/submissions', getAllSubmissions)
mentorRouter.post('/submissions/:id/feedback', addFeedback)
mentorRouter.get('/stats', getCohortStats)
mentorRouter.get('/codes', getAccessCodes)