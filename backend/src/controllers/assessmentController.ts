import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../models/prisma';
import {
  scoreAssessment,
  rankDomains,
  generateAccessCode,
} from '../services/assessmentService';
import { analyseGoalAlignment } from '../services/goalAnalysisService';
import { sendWelcomeEmail } from '../emails/welcomeEmail';
import { sendMentorAlertEmail } from '../emails/mentorAlertEmail';
import { DOMAINS } from '../utils/questionData';
import { getCurriculumForDomain } from '../utils/curriculum';
import { DOMAIN_PREVIEW_DETAILS } from '../utils/domainDetails';
import { changeMenteeTrack, TrackChangeError } from '../services/menteeTrackService';

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

    // Check if mentee with this email already exists
    const existingMentee = await prisma.mentee.findUnique({
      where: { email: session.email },
    });

    let mentee;

    if (existingMentee) {
      mentee = await prisma.mentee.update({
        where: { email: session.email },
        data: {
          name: session.name,
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

    } else {
      const existingCodes = await prisma.mentee.findMany({
        select: { accessCode: true },
      });
      const codes = existingCodes.map((m) => m.accessCode);
      const accessCode = generateAccessCode(session.name, codes);

      mentee = await prisma.mentee.create({
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
    }

    // Send welcome email to mentee (non-blocking)
    const topDomains = ranked.slice(0, 4).map((r) => ({
      domain: r.domain,
      score: r.score,
      tagline: DOMAIN_PREVIEW_DETAILS[r.domain]?.tagline || '',
    }));

    sendWelcomeEmail({
      name: mentee.name,
      email: mentee.email,
      accessCode: mentee.accessCode,
      topMatch: mentee.topMatch!,
      secondMatch: mentee.secondMatch!,
      topDomains,
      alignmentStatus: mentee.alignmentStatus || undefined,
      alignmentSummary: analysis?.alignmentSummary || undefined,
      warningText: analysis?.warningText || undefined,
      choiceContext: analysis?.choiceContext || undefined,
    }).catch((err) => console.error('Welcome email error:', err.message));

    // Send mentor alert email (non-blocking)
    sendMentorAlertEmail({
      mentorEmail: 'ajaotemitope5@gmail.com',
      menteeName: mentee.name,
      menteeEmail: mentee.email,
      accessCode: mentee.accessCode,
      topMatch: mentee.topMatch!,
      secondMatch: mentee.secondMatch!,
      alignmentStatus: mentee.alignmentStatus || null,
      alignmentSummary: analysis?.alignmentSummary || null,
      warningText: analysis?.warningText || null,
      mentorNote: analysis?.mentorNote || null,
      statedGoal: mentee.statedGoal || null,
    }).catch((err) => console.error('Mentor alert email error:', err.message));

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

export async function getRoadmapPreview(req: Request, res: Response) {
  try {
    const domain = decodeURIComponent(String(req.params.domain));

    const domainEntry = DOMAINS.find((d) => d.name === domain);
    if (!domainEntry) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    const details = DOMAIN_PREVIEW_DETAILS[domain];
    const curriculum = getCurriculumForDomain(domain);

    const VISIBLE_WEEKS = 4;
    const TOTAL_WEEKS = 48;

    const visibleWeeks = curriculum
      .filter((w) => w.week <= VISIBLE_WEEKS)
      .map((w) => ({
        week: w.week,
        phase: w.phase,
        title: w.title,
        task: w.task,
      }));

    const lockedWeeks = curriculum
      .filter((w) => w.week > VISIBLE_WEEKS)
      .map((w) => ({
        week: w.week,
        phase: w.phase,
        title: w.title,
      }));

    return res.json({
      domain: domainEntry.name,
      color: domainEntry.color,
      icon: domainEntry.icon,
      tagline: details?.tagline || '',
      salaryNigeria: details?.salaryNigeria || '',
      salaryGlobal: details?.salaryGlobal || '',
      totalWeeks: TOTAL_WEEKS,
      lockedWeeksCount: lockedWeeks.length,
      visibleWeeks,
      lockedWeeks,
    });
  } catch (error) {
    console.error('Get roadmap preview error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function chooseTrack(req: Request, res: Response) {
  try {
    const token = String(req.params.token);
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    const isValidDomain = DOMAINS.some((d) => d.name === domain);
    if (!isValidDomain) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    const session = await prisma.assessmentSession.findUnique({
      where: { sessionToken: token },
    });

    if (!session || !session.completed || !session.menteeId) {
      return res.status(404).json({ error: 'Results not found' });
    }

    const updated = await changeMenteeTrack(session.menteeId, domain);

    return res.json({
      message: 'Track updated successfully',
      mentee: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        accessCode: updated.accessCode,
        domainTrack: updated.domainTrack,
      },
    });
  } catch (error) {
    if (error instanceof TrackChangeError) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error('Choose track error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}