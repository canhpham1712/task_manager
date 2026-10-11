import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '../lib/prisma';
import { env } from '../config/env';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AppError, ConflictError, UnauthorizedError } from '../utils/errors';

export async function register(email: string, password: string, name: string) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ConflictError('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const tokenId = crypto.randomUUID();
  const refreshToken = signRefreshToken(user.id, tokenId);
  const accessToken = signAccessToken(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_EXPIRES_MS),
    },
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const tokenId = crypto.randomUUID();
  const refreshToken = signRefreshToken(user.id, tokenId);
  const accessToken = signAccessToken(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_EXPIRES_MS),
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    },
    accessToken,
    refreshToken,
  };
}

export async function refreshAccessToken(token: string) {
  try {
    const payload = verifyRefreshToken(token);

    if (payload.type !== 'refresh') {
      throw new UnauthorizedError('Invalid token type');
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      if (storedToken) {
        await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      }
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Rotate refresh token
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    const newTokenId = crypto.randomUUID();
    const newRefreshToken = signRefreshToken(payload.userId, newTokenId);
    const newAccessToken = signAccessToken(payload.userId);

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: payload.userId,
        expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_EXPIRES_MS),
      },
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new UnauthorizedError('Invalid refresh token');
  }
}

export async function logout(refreshToken: string) {
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
