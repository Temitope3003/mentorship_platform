import { Router } from 'express';
import {
  startSession,
  saveAnswers,
  completeAssessment,
  getResults,
} from '../controllers/assessmentController';

export const assessmentRouter = Router();

assessmentRouter.post('/start', startSession);
assessmentRouter.put('/:token/answers', saveAnswers);
assessmentRouter.post('/:token/complete', completeAssessment);
assessmentRouter.get('/:token/results', getResults);