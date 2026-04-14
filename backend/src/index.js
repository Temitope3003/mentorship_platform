require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');
const { emailQueue } = require('./config/queue');
const authMiddleware = require('./middleware/auth');

const app = express();
const prisma = new PrismaClient();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(rateLimit({ windowMs: 60_000, max: 100 }));

// === ROUTES (exactly as spec) ===
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/assessment', require('./routes/assessment'));
app.use('/api/v1/mentee', authMiddleware('mentee'), require('./routes/mentee'));
app.use('/api/v1/mentor', authMiddleware('mentor'), require('./routes/mentor'));

// Health
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  await emailQueue.close();
  process.exit(0);
});