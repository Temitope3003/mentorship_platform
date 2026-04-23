import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      menteeId?: string;
      mentorId?: string;
    }
  }
}

export {};