import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { env } from '../config/env';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  // AppError - known application errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
    });
    return;
  }

  // Prisma known errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        res.status(409).json({
          success: false,
          error: {
            code: 'CONFLICT',
            message: `A record with this ${err.meta?.target} already exists`,
          },
        });
        return;
      case 'P2025':
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Record not found',
          },
        });
        return;
      default:
        break;
    }
  }

  // Unknown error
  const statusCode = 500;
  const message = env.NODE_ENV === 'production' ? 'Internal server error' : err.message;

  console.error('[Error]', err);

  res.status(statusCode).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message,
    },
  });
}
