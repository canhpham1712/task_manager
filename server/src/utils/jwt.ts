import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AccessTokenPayload {
  userId: string;
  type: 'access';
}

export interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
  type: 'refresh';
}

export function signAccessToken(userId: string): string {
  const payload: AccessTokenPayload = { userId, type: 'access' };
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.ACCESS_TOKEN_EXPIRES });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
}

export function signRefreshToken(userId: string, tokenId: string): string {
  const payload: RefreshTokenPayload = { userId, tokenId, type: 'refresh' };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
}
