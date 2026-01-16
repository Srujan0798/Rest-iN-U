/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // Use environment variable to control strictness
    // Set STRICT_BUILD=true in production CI/CD to enforce
    eslint: {
        ignoreDuringBuilds: process.env.STRICT_BUILD !== 'true',
    },
    typescript: {
        ignoreBuildErrors: process.env.STRICT_BUILD !== 'true',
    },
    images: {
        domains: ['localhost', 'dharmarealty.com', 's3.amazonaws.com'],
        unoptimized: process.env.NODE_ENV === 'development',
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/:path*`,
            },
        ];
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
        ];
    },
    experimental: {
        serverComponentsExternalPackages: [],
    },
};

module.exports = nextConfig;
