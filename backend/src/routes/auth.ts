import { Router } from 'express';
import {
  loginMentee,
  loginMentor,
  getMe,
} from '../controllers/authController';
import { requireMentee } from '../middleware/auth';

export const authRouter = Router();

authRouter.post('/mentee/login', loginMentee);
authRouter.post('/mentor/login', loginMentor);
authRouter.get('/me', requireMentee, getMe);