import 'dotenv/config';

export const env = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-production',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-do-not-use',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  ACCESS_TOKEN_EXPIRES: '15m',
  REFRESH_TOKEN_EXPIRES_MS: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
} as const;

// Validate required env vars
const requiredEnvVars: (keyof typeof env)[] = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
for (const key of requiredEnvVars) {
  if (typeof env[key] === 'string' && env[key].includes('fallback') && env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}
