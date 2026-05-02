import { Queue } from 'bullmq'
import IORedis from 'ioredis'

export const connection = new IORedis({
  host: '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
})

export const emailQueue = new Queue('emails', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: { count: 200 },
    removeOnFail: { count: 100 },
  },
})