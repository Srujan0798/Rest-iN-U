// Error Handler Middleware
import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';

// Custom error class
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly code?: string;
    public readonly details?: unknown;

    constructor(
        message: string,
        statusCode: number = 500,
        isOperational: boolean = true,
        code?: string,
        details?: unknown
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.code = code;
        this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Common error types
export class BadRequestError extends AppError {
    constructor(message: string = 'Bad request', details?: unknown) {
        super(message, 400, true, 'BAD_REQUEST', details);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401, true, 'UNAUTHORIZED');
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden') {
        super(message, 403, true, 'FORBIDDEN');
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 404, true, 'NOT_FOUND');
    }
}

export class ConflictError extends AppError {
    constructor(message: string = 'Resource already exists') {
        super(message, 409, true, 'CONFLICT');
    }
}

export class ValidationError extends AppError {
    constructor(message: string = 'Validation failed', details?: unknown) {
        super(message, 422, true, 'VALIDATION_ERROR', details);
    }
}

export class TooManyRequestsError extends AppError {
    constructor(message: string = 'Too many requests') {
        super(message, 429, true, 'TOO_MANY_REQUESTS');
    }
}

export class InternalServerError extends AppError {
    constructor(message: string = 'Internal server error') {
        super(message, 500, false, 'INTERNAL_SERVER_ERROR');
    }
}

// Error response interface
interface ErrorResponse {
    success: false;
    error: {
        message: string;
        code?: string;
        details?: unknown;
        stack?: string;
    };
}

// 404 Not Found handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    const error = new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`);
    next(error);
};

// Main error handler
export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    let statusCode = 500;
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';
    let details: unknown = undefined;

    // Handle AppError
    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
        code = error.code || code;
        details = error.details;
    }

    // Handle Zod validation errors
    if (error instanceof ZodError) {
        statusCode = 422;
        message = 'Validation failed';
        code = 'VALIDATION_ERROR';
        details = error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
        }));
    }

    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002':
                statusCode = 409;
                message = 'A record with this value already exists';
                code = 'DUPLICATE_ENTRY';
                details = { field: error.meta?.target };
                break;
            case 'P2025':
                statusCode = 404;
                message = 'Record not found';
                code = 'NOT_FOUND';
                break;
            case 'P2003':
                statusCode = 400;
                message = 'Foreign key constraint failed';
                code = 'FOREIGN_KEY_ERROR';
                break;
            default:
                message = 'Database error';
                code = 'DATABASE_ERROR';
        }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = 'Invalid data provided';
        code = 'VALIDATION_ERROR';
    }

    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
        code = 'INVALID_TOKEN';
    }

    if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
        code = 'TOKEN_EXPIRED';
    }

    // Log error
    const logData = {
        method: req.method,
        url: req.originalUrl,
        statusCode,
        message,
        code,
        userId: (req as any).user?.id,
        ip: req.ip,
        userAgent: req.get('user-agent'),
    };

    if (statusCode >= 500) {
        logger.error('Server error:', { ...logData, stack: error.stack });
    } else if (statusCode >= 400) {
        logger.warn('Client error:', logData);
    }

    // Build response
    const response: ErrorResponse = {
        success: false,
        error: {
            message,
            code,
            details,
        },
    };

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development' && error.stack) {
        response.error.stack = error.stack;
    }

    res.status(statusCode).json(response);
};

// Async handler wrapper to catch errors
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
