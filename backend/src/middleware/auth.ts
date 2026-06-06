import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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