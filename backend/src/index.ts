import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { authRouter } from './routes/auth'
import { assessmentRouter } from './routes/assessment'
import { menteeRouter } from './routes/mentee'
import { mentorRouter } from './routes/mentor'
import { liaisonRouter } from './routes/liaison'
require('./jobs/scheduler')

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet())
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://buildintech.xyz',
      'https://www.buildintech.xyz',
      'http://localhost:3000',
      'http://localhost:5173'
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);   // Allow the request
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10kb' }))

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Tech Mentorship API is running',
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/assessment', assessmentRouter)
app.use('/api/v1/mentee', menteeRouter)
app.use('/api/v1/mentor', mentorRouter)

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})

app.use('/api/v1/liaison', liaisonRouter)