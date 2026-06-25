import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../models/prisma';

interface AuthRequest extends Request {
  menteeId?: string;
  mentorId?: string;
}

export function requireMentee(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as any;

    if (decoded.role !== 'mentee') {
      return res.status(403).json({ error: 'Access denied' });
    }

    req.menteeId = decoded.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireMentor(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as any;

    if (decoded.role !== 'mentor') {
      return res.status(403).json({ error: 'Access denied' });
    }

    req.mentorId = decoded.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export async function requireSuperAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.mentorId) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const mentor = await prisma.mentor.findUnique({
      where: { id: req.mentorId },
      select: { isSuperAdmin: true },
    });

    if (!mentor || !mentor.isSuperAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Accepts either a mentor token or a liaison officer token. Sets req.mentorId
 * or req.liaisonId accordingly so the controller can branch on scope
 * (mentors see everything, liaison officers see only their assigned mentees).
 */
export function requireMentorOrLiaison(
  req: AuthRequest & { liaisonId?: string },
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role === 'mentor') {
      req.mentorId = decoded.sub;
      return next();
    }

    if (decoded.liaisonId) {
      req.liaisonId = decoded.liaisonId;
      return next();
    }

    return res.status(403).json({ error: 'Access denied' });
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export async function requireLiaison(req: any, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any

    if (!decoded.liaisonId) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    req.liaisonId = decoded.liaisonId
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}