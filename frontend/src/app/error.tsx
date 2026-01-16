'use client';

// Route-level Error Boundary with Sentry Integration
// This component catches errors in pages and reports them to Sentry

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Report the error to Sentry with additional context
    Sentry.captureException(error, {
      tags: {
        errorBoundary: 'route',
      },
      extra: {
        digest: error.digest,
      },
    });
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Something went wrong
          </h2>
          <p className="mt-2 text-gray-600">
            We encountered an unexpected error. Our team has been notified.
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-gray-400">
              Reference: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>

          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <Home className="h-4 w-4" />
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
