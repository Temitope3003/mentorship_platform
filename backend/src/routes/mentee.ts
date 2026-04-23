import { Router, Request, Response } from 'express';
import { requireMentee } from '../middleware/auth';

interface AuthRequest extends Request {
  menteeId?: string;
}

export const menteeRouter = Router();

menteeRouter.use(requireMentee);

menteeRouter.get('/me', (req: AuthRequest, res: Response) => {
  res.json({
    message: 'Mentee route working',
    menteeId: req.menteeId,
  });
});