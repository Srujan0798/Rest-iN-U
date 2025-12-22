// Prisma Client Singleton
import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: [
            { level: 'query', emit: 'event' },
            { level: 'error', emit: 'stdout' },
            { level: 'info', emit: 'stdout' },
            { level: 'warn', emit: 'stdout' },
        ],
    });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

// Log queries in development
prisma.$on('query' as never, (e: any) => {
    if (process.env.NODE_ENV === 'development') {
        logger.debug(`Query: ${e.query}`);
        logger.debug(`Duration: ${e.duration}ms`);
    }
});

// Prisma Middleware for audit logging
prisma.$use(async (params, next) => {
    const start = Date.now();
    const result = await next(params);
    const duration = Date.now() - start;

    if (duration > 1000) {
        logger.warn(`Slow query detected: ${params.model}.${params.action} took ${duration}ms`);
    }

    return result;
});

export default prisma;
