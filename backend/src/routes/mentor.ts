import { Router, Request, Response } from 'express'
import { requireMentor, requireSuperAdmin } from '../middleware/auth'
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
  registerMentor,
  getApplications,
  approveApplication,
  rejectApplication,
  changePassword,
  getAnalytics,
} from '../controllers/mentorController'

export const mentorRouter = Router()

mentorRouter.post('/register', registerMentor)

mentorRouter.use(requireMentor)

mentorRouter.get('/applications', requireSuperAdmin, getApplications)
mentorRouter.patch('/applications/:id/approve', requireSuperAdmin, approveApplication)
mentorRouter.patch('/applications/:id/reject', requireSuperAdmin, rejectApplication)
mentorRouter.post('/me/password', changePassword)

mentorRouter.get('/mentees', getAllMentees)
mentorRouter.post('/mentees', createMentee)
mentorRouter.get('/mentees/:id', getMentee)
mentorRouter.get('/submissions', getAllSubmissions)
mentorRouter.post('/submissions/:id/feedback', addFeedback)
mentorRouter.get('/stats', getCohortStats)
mentorRouter.get('/analytics', getAnalytics)
mentorRouter.get('/codes', getAccessCodes)
mentorRouter.patch('/mentees/:id', updateMentee)
mentorRouter.get('/liaison-officers', getAllLiaisonOfficers)
mentorRouter.post('/liaison-officers', createLiaisonOfficer)
mentorRouter.patch('/mentees/:id/assign', assignMenteeToOfficer)
mentorRouter.patch('/mentees/:id/deactivate', deactivateMentee)
mentorRouter.patch('/liaison-officers/:id/deactivate', deactivateLiaisonOfficer)
