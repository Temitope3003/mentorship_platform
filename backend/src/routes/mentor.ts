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
  updateMentee,
  createLiaisonOfficer,
  getAllLiaisonOfficers,
  assignMenteeToOfficer,
  deactivateMentee,
  deactivateLiaisonOfficer,
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
mentorRouter.patch('/mentees/:id', updateMentee)
mentorRouter.get('/liaison-officers', getAllLiaisonOfficers)
mentorRouter.post('/liaison-officers', createLiaisonOfficer)
mentorRouter.patch('/mentees/:id/assign', assignMenteeToOfficer)
mentorRouter.patch('/mentees/:id/deactivate', deactivateMentee)
mentorRouter.patch('/liaison-officers/:id/deactivate', deactivateLiaisonOfficer)
