import { Router } from 'express'
import {
  loginLiaison,
  getLiaisonDashboard,
  getLiaisonMentees,
  updateMenteeNotes,
  sendCheckin,
} from '../controllers/liaisonController'
import { requireLiaison } from '../middleware/auth'

export const liaisonRouter = Router()

liaisonRouter.post('/login', loginLiaison)
liaisonRouter.get('/dashboard', requireLiaison, getLiaisonDashboard)
liaisonRouter.get('/mentees', requireLiaison, getLiaisonMentees)
liaisonRouter.patch('/mentees/:id/notes', requireLiaison, updateMenteeNotes)
liaisonRouter.post('/mentees/:id/checkin', requireLiaison, sendCheckin)