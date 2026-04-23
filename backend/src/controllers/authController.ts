import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../models/prisma';

interface AuthRequest extends Request {
  menteeId?: string;
  mentorId?: string;
}

export async function loginMentee(req: Request, res: Response) {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Access code is required' });
    }

    const mentee = await prisma.mentee.findFirst({
      where: {
        accessCode: code.toUpperCase().trim(),
        isActive: true,
      },
    });

    if (!mentee) {
      return res.status(401).json({
        error: 'Access code not found. Please check with your mentor.',
      });
    }

    const token = jwt.sign(
      {
        sub: mentee.id,
        role: 'mentee',
        domain: mentee.domainTrack,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' } as any
    );

    return res.json({
      token,
      mentee: {
        id: mentee.id,
        name: mentee.name,
        email: mentee.email,
        domain: mentee.domainTrack,
        startDate: mentee.startDate,
      },
    });
  } catch (error) {
    console.error('Mentee login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function loginMentor(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
      });
    }

    const mentor = await prisma.mentor.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!mentor) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordValid = await bcrypt.compare(
      password,
      mentor.passwordHash
    );

    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        sub: mentor.id,
        role: 'mentor',
      },
      process.env.JWT_SECRET!,
      { expiresIn: '8h' } as any
    );

    return res.json({
      token,
      mentor: {
        id: mentor.id,
        name: mentor.name,
        email: mentor.email,
      },
    });
  } catch (error) {
    console.error('Mentor login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  try {
    const mentee = await prisma.mentee.findUnique({
      where: { id: req.menteeId },
      select: {
        id: true,
        name: true,
        email: true,
        domainTrack: true,
        topMatch: true,
        secondMatch: true,
        alignmentStatus: true,
        startDate: true,
        isActive: true,
      },
    });

    if (!mentee) {
      return res.status(404).json({ error: 'Mentee not found' });
    }

    return res.json(mentee);
  } catch (error) {
    console.error('Get me error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}