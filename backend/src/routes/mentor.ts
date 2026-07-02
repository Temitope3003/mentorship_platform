import { Router, Request, Response } from 'express'
import { requireMentor, requireSuperAdmin, requireMentorOrLiaison } from '../middleware/auth'
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
  getPendingPayments,
  confirmPayment,
  rejectPayment,
  issueCertificate,
  issueRecommendationLetter,
  getMyMentorProfile,
  getApprovedMentors,
  issueMentorCertificate,
  getMyMentorCertificate,
  issueMentorRecommendationLetter,
  chatWithMentorBot,
  getMentorChatHistory,
  refreshJobs,
  getPendingIncomeOpportunities,
  approveIncomeOpportunity,
  rejectIncomeOpportunity,
  updateIncomeOpportunity,
} from '../controllers/mentorController'

export const mentorRouter = Router()

mentorRouter.post('/register', registerMentor)

// Dual-auth routes (mentor OR liaison officer) — must stay before the blanket requireMentor below
mentorRouter.get('/pending-payments', requireMentorOrLiaison, getPendingPayments)
mentorRouter.patch('/mentees/:id/confirm-payment', requireMentorOrLiaison, confirmPayment)
mentorRouter.patch('/mentees/:id/reject-payment', requireMentorOrLiaison, rejectPayment)

mentorRouter.use(requireMentor)

mentorRouter.get('/applications', requireSuperAdmin, getApplications)
mentorRouter.patch('/applications/:id/approve', requireSuperAdmin, approveApplication)
mentorRouter.patch('/applications/:id/reject', requireSuperAdmin, rejectApplication)
mentorRouter.post('/me/password', changePassword)
mentorRouter.get('/me', getMyMentorProfile)
mentorRouter.get('/me/certificate', getMyMentorCertificate)
mentorRouter.post('/me/chat', chatWithMentorBot)
mentorRouter.get('/me/chat/history', getMentorChatHistory)

mentorRouter.get('/approved', requireSuperAdmin, getApprovedMentors)
mentorRouter.post('/applications/:id/issue-certificate', requireSuperAdmin, issueMentorCertificate)
mentorRouter.post('/applications/:id/issue-recommendation-letter', requireSuperAdmin, issueMentorRecommendationLetter)

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
mentorRouter.post('/mentees/:id/issue-certificate', issueCertificate)
mentorRouter.post('/mentees/:id/issue-recommendation-letter', issueRecommendationLetter)
mentorRouter.post('/jobs/refresh', requireSuperAdmin, refreshJobs)
mentorRouter.get('/income-opportunities/pending', requireSuperAdmin, getPendingIncomeOpportunities)
mentorRouter.patch('/income-opportunities/:id/approve', requireSuperAdmin, approveIncomeOpportunity)
mentorRouter.patch('/income-opportunities/:id/reject', requireSuperAdmin, rejectIncomeOpportunity)
mentorRouter.patch('/income-opportunities/:id', requireSuperAdmin, updateIncomeOpportunity)
