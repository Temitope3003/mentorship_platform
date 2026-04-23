import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../models/prisma';
import {
  scoreAssessment,
  rankDomains,
  generateAccessCode,
} from '../services/assessmentService';
import { analyseGoalAlignment } from '../services/goalAnalysisService';

export async function startSession(req: Request, res: Response) {
  try {
    const { name, email, statedGoal } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const sessionToken = uuidv4();

    const session = await prisma.assessmentSession.create({
      data: {
        sessionToken,
        name,
        email,
        statedGoal: statedGoal || null,
        expiresAt,
      },
    });

    return res.status(201).json({
      sessionToken: session.sessionToken,
      message: 'Session started. Complete the assessment to get your results.',
    });
  } catch (error) {
    console.error('Start session error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function saveAnswers(req: Request, res: Response) {
  try {
    const token = String(req.params.token);
    const { answers, statedGoal } = req.body;

    const session = await prisma.assessmentSession.findUnique({
      where: { sessionToken: token },
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.completed) {
      return res.status(400).json({ error: 'Session already completed' });
    }

    if (new Date() > session.expiresAt) {
      return res.status(400).json({ error: 'Session has expired' });
    }

    await prisma.assessmentSession.update({
      where: { sessionToken: token },
      data: {
        answers: answers || session.answers,
        statedGoal: statedGoal || session.statedGoal,
      },
    });

    return res.json({ message: 'Answers saved' });
  } catch (error) {
    console.error('Save answers error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function completeAssessment(req: Request, res: Response) {
  try {
    const token = String(req.params.token);
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers are required' });
    }

    const session = await prisma.assessmentSession.findUnique({
      where: { sessionToken: token },
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.completed) {
      return res.status(400).json({ error: 'Session already completed' });
    }

    if (!session.name || !session.email) {
      return res
        .status(400)
        .json({ error: 'Session is missing name or email' });
    }

    // Score the answers
    const scores = scoreAssessment(answers);
    const ranked = rankDomains(scores);
    const topMatch = ranked[0].domain;
    const secondMatch = ranked[1].domain;

    // Run AI goal analysis if a goal was provided
    let analysis = null;
    if (session.statedGoal) {
      analysis = await analyseGoalAlignment(
        session.statedGoal,
        topMatch,
        secondMatch,
        scores
      );
    }

    // Generate unique access code
    const existingCodes = await prisma.mentee.findMany({
      select: { accessCode: true },
    });
    const codes = existingCodes.map((m) => m.accessCode);
    const accessCode = generateAccessCode(session.name, codes);

    // Create the mentee record
    const mentee = await prisma.mentee.create({
      data: {
        name: session.name,
        email: session.email,
        accessCode,
        domainTrack: topMatch,
        statedGoal: session.statedGoal,
        goalDomain: analysis?.goalDomain || null,
        alignmentStatus: analysis?.alignmentStatus || null,
        topMatch,
        secondMatch,
        allScores: scores,
        mentorNote: analysis?.mentorNote || null,
        onboardedAt: new Date(),
      },
    });

    // Mark session complete
    await prisma.assessmentSession.update({
      where: { sessionToken: token },
      data: {
        completed: true,
        menteeId: mentee.id,
        answers,
      },
    });

    return res.status(201).json({
      success: true,
      mentee: {
        id: mentee.id,
        name: mentee.name,
        email: mentee.email,
        accessCode: mentee.accessCode,
        domainTrack: mentee.domainTrack,
      },
      scores,
      ranked,
      topMatch,
      secondMatch,
      analysis,
    });
  } catch (error) {
    console.error('Complete assessment error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getResults(req: Request, res: Response) {
  try {
    const token = String(req.params.token);

    const session = await prisma.assessmentSession.findUnique({
      where: { sessionToken: token },
    });

    if (!session || !session.completed || !session.menteeId) {
      return res.status(404).json({ error: 'Results not found' });
    }

    const mentee = await prisma.mentee.findUnique({
      where: { id: session.menteeId },
    });

    if (!mentee) {
      return res.status(404).json({ error: 'Mentee not found' });
    }

    return res.json({
      mentee: {
        id: mentee.id,
        name: mentee.name,
        email: mentee.email,
        accessCode: mentee.accessCode,
        domainTrack: mentee.domainTrack,
        topMatch: mentee.topMatch,
        secondMatch: mentee.secondMatch,
        alignmentStatus: mentee.alignmentStatus,
        allScores: mentee.allScores,
        mentorNote: mentee.mentorNote,
      },
    });
  } catch (error) {
    console.error('Get results error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}