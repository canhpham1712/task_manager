import { PrismaClient } from '@prisma/client';
import { env } from '../config/env';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    datasources: {
      db: {
        url: env.DATABASE_URL,
      },
    },
  });

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Enable WAL mode for better concurrent reads
prisma.$queryRawUnsafe('PRAGMA journal_mode=WAL;').catch(() => {
  // Ignore if already set
});

// Set pool size to 1 for SQLite
prisma.$queryRawUnsafe('PRAGMA busy_timeout=5000;').catch(() => {});

export default prisma;
