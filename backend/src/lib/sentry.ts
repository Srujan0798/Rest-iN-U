// Sentry Error Monitoring Integration
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { Express, Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { logger } from '../utils/logger';

// Extend Express Request type for Sentry
declare global {
  namespace Express {
    interface Request {
      sentry?: typeof Sentry;
    }
  }
}

/**
 * Initialize Sentry for the backend application
 * Call this before any other middleware
 */
export function initSentry(): void {
  const dsn = process.env.SENTRY_DSN;

  if (!dsn) {
    logger.warn('Sentry DSN not configured. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn,
    environment: config.env,
    release: process.env.SENTRY_RELEASE || `restinu-backend@${process.env.npm_package_version || '1.0.0'}`,

    // Performance Monitoring
    tracesSampleRate: config.env === 'production' ? 0.1 : 1.0,

    // Profiling (optional, requires @sentry/profiling-node)
    profilesSampleRate: config.env === 'production' ? 0.1 : 1.0,

    integrations: [
      // Enable profiling
      nodeProfilingIntegration(),
    ],

    // Filter sensitive data
    beforeSend(event, hint) {
      // Filter out sensitive headers
      if (event.request?.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
        delete event.request.headers['x-api-key'];
      }

      // Filter out sensitive data from body
      if (event.request?.data) {
        const data = typeof event.request.data === 'string'
          ? JSON.parse(event.request.data)
          : event.request.data;

        if (data.password) data.password = '[REDACTED]';
        if (data.passwordHash) data.passwordHash = '[REDACTED]';
        if (data.refreshToken) data.refreshToken = '[REDACTED]';
        if (data.accessToken) data.accessToken = '[REDACTED]';
        if (data.creditCard) data.creditCard = '[REDACTED]';
        if (data.ssn) data.ssn = '[REDACTED]';

        event.request.data = JSON.stringify(data);
      }

      return event;
    },

    // Ignore certain errors
    ignoreErrors: [
      // Network errors
      'Network Error',
      'NetworkError',
      'Failed to fetch',
      // Common browser errors
      'ResizeObserver loop limit exceeded',
      // Rate limiting
      'Too many requests',
      // Common validation errors
      'ValidationError',
    ],

    // Breadcrumb configuration
    beforeBreadcrumb(breadcrumb) {
      // Filter out noisy breadcrumbs
      if (breadcrumb.category === 'console' && breadcrumb.level === 'debug') {
        return null;
      }
      return breadcrumb;
    },
  });

  logger.info('Sentry initialized successfully');
}

/**
 * Sentry request handler middleware
 * Add this after body parsing middleware
 */
export function sentryRequestHandler() {
  return Sentry.Handlers.requestHandler({
    // Include user info in error reports
    user: ['id', 'email', 'userType'],
    // Include request data
    request: ['headers', 'method', 'url', 'query_string'],
  });
}

/**
 * Sentry tracing handler middleware
 * Add this before route handlers
 */
export function sentryTracingHandler() {
  return Sentry.Handlers.tracingHandler();
}

/**
 * Sentry error handler middleware
 * Add this after all routes but before your error handler
 */
export function sentryErrorHandler() {
  return Sentry.Handlers.errorHandler({
    shouldHandleError(error: Error) {
      // Report all 4xx and 5xx errors
      const statusCode = (error as any).statusCode || (error as any).status || 500;
      return statusCode >= 400;
    },
  });
}

/**
 * Set user context for Sentry
 * Call this after authentication middleware
 */
export function setSentryUser(user: { id: string; email: string; userType: string; agentId?: string }) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    userType: user.userType,
    agentId: user.agentId,
  });
}

/**
 * Clear Sentry user context
 * Call this on logout
 */
export function clearSentryUser() {
  Sentry.setUser(null);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  category: string,
  level: 'debug' | 'info' | 'warning' | 'error' = 'info',
  data?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
  });
}

/**
 * Capture exception with context
 */
export function captureException(
  error: Error,
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, any>;
    user?: { id: string; email?: string };
  }
) {
  Sentry.withScope((scope) => {
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    if (context?.user) {
      scope.setUser(context.user);
    }

    Sentry.captureException(error);
  });
}

/**
 * Capture message with context
 */
export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, any>;
  }
) {
  Sentry.withScope((scope) => {
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    Sentry.captureMessage(message, level);
  });
}

/**
 * Start a new Sentry transaction for performance monitoring
 */
export function startTransaction(
  name: string,
  op: string,
  data?: Record<string, any>
) {
  return Sentry.startSpan({
    name,
    op,
    attributes: data,
  }, () => {});
}

/**
 * Flush Sentry events before process exits
 */
export async function flushSentry(timeout: number = 2000): Promise<boolean> {
  return Sentry.flush(timeout);
}

// Export Sentry for direct access if needed
export { Sentry };
