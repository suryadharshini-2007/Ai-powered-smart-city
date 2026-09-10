import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export function verifyAuthToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Optional or permissive in demo prototype
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    // Verify token or assign mock user for demo
    req.user = {
      id: 'usr-001',
      email: 'overseer@aeroagri.city',
      role: 'City Architect',
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}
