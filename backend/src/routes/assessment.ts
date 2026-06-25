import { Router } from 'express';
import {
  startSession,
  saveAnswers,
  completeAssessment,
  getResults,
  getRoadmapPreview,
  chooseTrack,
} from '../controllers/assessmentController';

export const assessmentRouter = Router();

assessmentRouter.post('/start', startSession);
assessmentRouter.get('/roadmap-preview/:domain', getRoadmapPreview);
assessmentRouter.put('/:token/answers', saveAnswers);
assessmentRouter.post('/:token/complete', completeAssessment);
assessmentRouter.get('/:token/results', getResults);
assessmentRouter.patch('/:token/track', chooseTrack);