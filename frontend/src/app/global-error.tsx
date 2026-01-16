'use client';

// Global Error Boundary with Sentry Integration
// This component catches errors in the root layout and reports them to Sentry

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Report the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full space-y-8 text-center">
            <div>
              <h1 className="text-6xl font-bold text-gray-900">Oops!</h1>
              <h2 className="mt-4 text-2xl font-semibold text-gray-700">
                Something went wrong
              </h2>
              <p className="mt-2 text-gray-600">
                We apologize for the inconvenience. Our team has been notified and is working on a fix.
              </p>
              {error.digest && (
                <p className="mt-2 text-sm text-gray-500">
                  Error ID: {error.digest}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <button
                onClick={() => reset()}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Try Again
              </button>

              <a
                href="/"
                className="block w-full text-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Return to Home
              </a>
            </div>

            <p className="text-sm text-gray-500">
              If this problem persists, please{' '}
              <a href="mailto:support@restinu.com" className="text-indigo-600 hover:text-indigo-500">
                contact support
              </a>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
