'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
            <div className="text-center px-4">
                <div className="text-8xl mb-6">⚠️</div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops!</h1>
                <h2 className="text-xl text-gray-600 mb-6">Something went wrong</h2>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                    Don't worry, even the most aligned Vastu homes have occasional hiccups.
                    Let's get you back on track.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

