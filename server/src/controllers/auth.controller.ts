import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../middlewares/auth';
import * as authService from '../services/auth.service';
import { env } from '../config/env';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const result = await authService.register(email, password, name);

  // Set refresh token in httpOnly cookie
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: env.REFRESH_TOKEN_EXPIRES_MS,
    path: '/api/v1/auth',
  });

  res.status(201).json({
    success: true,
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: env.REFRESH_TOKEN_EXPIRES_MS,
    path: '/api/v1/auth',
  });

  res.json({
    success: true,
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'No refresh token provided' },
    });
    return;
  }

  const result = await authService.refreshAccessToken(token);

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: env.REFRESH_TOKEN_EXPIRES_MS,
    path: '/api/v1/auth',
  });

  res.json({
    success: true,
    data: {
      accessToken: result.accessToken,
    },
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    await authService.logout(token);
  }

  res.clearCookie('refreshToken', { path: '/api/v1/auth' });

  res.json({
    success: true,
    data: { message: 'Logged out successfully' },
  });
});

export const getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await authService.getMe(req.userId!);
  res.json({
    success: true,
    data: user,
  });
});
