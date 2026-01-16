// Sentry Error Monitoring for Frontend
import * as Sentry from '@sentry/nextjs';

/**
 * Initialize Sentry for client-side error tracking
 */
export function initSentryClient() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

  if (!dsn) {
    console.warn('Sentry DSN not configured. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || `restinu-frontend@${process.env.npm_package_version || '1.0.0'}`,

    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Session Replay
    replaysSessionSampleRate: 0.1, // Sample 10% of sessions
    replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors

    // Integrations
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
      Sentry.browserTracingIntegration(),
    ],

    // Filter sensitive data
    beforeSend(event) {
      // Filter out auth tokens from URLs
      if (event.request?.url) {
        event.request.url = event.request.url.replace(/token=[^&]+/, 'token=[REDACTED]');
      }

      // Remove sensitive headers
      if (event.request?.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
      }

      return event;
    },

    // Ignore certain errors
    ignoreErrors: [
      // Browser-specific errors
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      // Network errors
      'Network Error',
      'NetworkError when attempting to fetch resource',
      'Failed to fetch',
      'Load failed',
      // Cancelled requests
      'AbortError',
      'The operation was aborted',
      // User-triggered navigation
      'Navigation cancelled',
      // Third-party script errors
      'Script error',
      // Browser extensions
      /__firefox__/,
      /extensions\//i,
      // Common validation errors that shouldn't be tracked
      /validation error/i,
    ],

    // Deny URLs from third-party scripts
    denyUrls: [
      /extensions\//i,
      /^chrome:\/\//i,
      /^moz-extension:\/\//i,
      // Common analytics and tracking
      /google-analytics\.com/i,
      /googletagmanager\.com/i,
      /facebook\.net/i,
      /hotjar\.com/i,
    ],
  });
}

/**
 * Set user context for Sentry
 */
export function setSentryUser(user: {
  id: string;
  email?: string;
  userType?: string;
}) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    userType: user.userType,
  });
}

/**
 * Clear Sentry user context (on logout)
 */
export function clearSentryUser() {
  Sentry.setUser(null);
}

/**
 * Capture exception with context
 */
export function captureException(
  error: Error,
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, any>;
    level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
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

    if (context?.level) {
      scope.setLevel(context.level);
    }

    Sentry.captureException(error);
  });
}

/**
 * Capture message with context
 */
export function captureMessage(
  message: string,
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info',
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
 * Start a transaction for performance monitoring
 */
export function startTransaction(name: string, op: string) {
  return Sentry.startSpan({ name, op }, () => {});
}

// Export Sentry for direct access
export { Sentry };
