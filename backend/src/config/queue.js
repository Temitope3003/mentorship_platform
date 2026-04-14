const { Queue, Worker } = require('bullmq');
const Redis = require('ioredis');
const { Resend } = require('resend');

const redis = new Redis(process.env.REDIS_URL);
const resend = new Resend(process.env.RESEND_API_KEY);

const emailQueue = new Queue('emails', { connection: redis });

const emailWorker = new Worker('emails', async (job) => {
  const { to, subject, html, menteeId, emailType } = job.data;
  const { data, error } = await resend.emails.send({ from: process.env.FROM_EMAIL, to, subject, html });
  // log to DB
  await prisma.emailLog.create({ data: { menteeId, emailType, recipient: to, subject, status: error ? 'failed' : 'sent', providerId: data?.id } });
}, { connection: redis });

module.exports = { emailQueue };