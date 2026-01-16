// Sentry client-side configuration for Next.js
// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a user loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Session Replay
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  replaysSessionSampleRate: 0.1, // This sets the sample rate to be 10%.

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Ignore certain errors that are not actionable
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
    'Network Error',
    'NetworkError',
    'Failed to fetch',
    'Load failed',
    'AbortError',
    'The operation was aborted',
    'Navigation cancelled',
    'Script error',
    /__firefox__/,
    /extensions\//i,
    // Wallet connection errors (common in Web3)
    'User rejected the request',
    'User denied account authorization',
    'MetaMask not installed',
  ],

  // Filter out third-party errors
  denyUrls: [
    /extensions\//i,
    /^chrome:\/\//i,
    /^moz-extension:\/\//i,
    /google-analytics\.com/i,
    /googletagmanager\.com/i,
    /facebook\.net/i,
    /hotjar\.com/i,
  ],

  // Filter sensitive data before sending
  beforeSend(event) {
    // Remove auth tokens from URLs
    if (event.request?.url) {
      event.request.url = event.request.url.replace(/token=[^&]+/g, 'token=[REDACTED]');
      event.request.url = event.request.url.replace(/apiKey=[^&]+/g, 'apiKey=[REDACTED]');
    }

    // Remove sensitive headers
    if (event.request?.headers) {
      delete event.request.headers.authorization;
      delete event.request.headers.cookie;
    }

    return event;
  },
});
