import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'MLOps Mentorship API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});