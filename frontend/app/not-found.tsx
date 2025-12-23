'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
            <div className="text-center px-4">
                <div className="text-8xl mb-6">🏠</div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <h2 className="text-xl text-gray-600 mb-6">Page Not Found</h2>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                    The page you're looking for doesn't exist or has been moved.
                    Perhaps it's in a parallel universe with better Vastu?
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition"
                    >
                        Go Home
                    </Link>
                    <Link
                        href="/search"
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
                    >
                        Search Properties
                    </Link>
                </div>
            </div>
        </div>
    );
}

