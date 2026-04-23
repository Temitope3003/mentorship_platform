import { Router, Request, Response } from 'express';
import { requireMentor } from '../middleware/auth';

interface AuthRequest extends Request {
  mentorId?: string;
}

export const mentorRouter = Router();

mentorRouter.use(requireMentor);

mentorRouter.get('/me', (req: AuthRequest, res: Response) => {
  res.json({
    message: 'Mentor route working',
    mentorId: req.mentorId,
  });
});