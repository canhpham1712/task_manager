import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { UnauthorizedError } from '../utils/errors';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function authenticate(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    if (payload.type !== 'access') {
      throw new UnauthorizedError('Invalid token type');
    }

    req.userId = payload.userId;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
      return;
    }
    next(new UnauthorizedError('Invalid or expired token'));
  }
}
