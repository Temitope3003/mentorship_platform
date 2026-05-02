import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { authRouter } from './routes/auth'
import { assessmentRouter } from './routes/assessment'
import { menteeRouter } from './routes/mentee'
import { mentorRouter } from './routes/mentor'

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(express.json({ limit: '10kb' }))

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'MLOps Mentorship API is running',
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/assessment', assessmentRouter)
app.use('/api/v1/mentee', menteeRouter)
app.use('/api/v1/mentor', mentorRouter)

// TEMPORARY TEST ROUTE - remove after testing
app.get('/test-email', async (req, res) => {
  try {
    const { sendWelcomeEmail } = await import('./emails/welcomeEmail')
    await sendWelcomeEmail({
      name: 'Temitope',
      email: 'ajaotemitope5@gmail.com',
      accessCode: 'TEMITO-6749',
      topMatch: 'Software Engineering',
      secondMatch: 'AI & Machine Learning',
      alignmentStatus: 'partial',
    })
    res.json({ success: true, message: 'Email sent directly' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})