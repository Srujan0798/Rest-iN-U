import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ============================================================================
// Route Configuration
// ============================================================================

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/settings',
  '/favorites',
  '/messages',
  '/documents',
  '/subscriptions',
];

// Routes that should redirect authenticated users away
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

// Admin-only routes
const ADMIN_ROUTES = ['/dashboard/admin'];

// Agent-only routes
const AGENT_ROUTES = ['/dashboard/agent'];

// API routes that don't need CSRF protection
const CSRF_EXEMPT_ROUTES = ['/api/webhooks'];

// ============================================================================
// Middleware Function
// ============================================================================

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // ============================================================================
  // Security Headers
  // ============================================================================

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
  );

  // Content Security Policy (adjust as needed)
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com https://js.stripe.com https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https: http:",
    "connect-src 'self' https://api.stripe.com https://maps.googleapis.com wss: https:",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://www.google.com https://app.docusign.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');

  // Only set CSP in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Content-Security-Policy', csp);
  }

  // Strict Transport Security (HTTPS)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // ============================================================================
  // Authentication Check
  // ============================================================================

  // Get auth token from cookies
  const accessToken = request.cookies.get('access_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  const isAuthenticated = !!accessToken;

  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname.startsWith(route)
  );

  // Check if route is auth route (login, register, etc.)
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Check if route is admin-only
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  // Check if route is agent-only
  const isAgentRoute = AGENT_ROUTES.some((route) => pathname.startsWith(route));

  // ============================================================================
  // Route Redirects
  // ============================================================================

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth routes
  if (isAuthRoute && isAuthenticated) {
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/dashboard';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // Check admin access
  if (isAdminRoute && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Check agent access
  if (isAgentRoute && userRole !== 'agent' && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ============================================================================
  // Locale Detection & Redirect
  // ============================================================================

  // Skip locale detection for API routes and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return response;
  }

  // Get preferred locale from cookie or accept-language header
  const localeCookie = request.cookies.get('locale')?.value;
  const acceptLanguage = request.headers.get('accept-language');
  const preferredLocale = localeCookie || acceptLanguage?.split(',')[0]?.split('-')[0] || 'en';

  // Set locale in response cookie if not set
  if (!localeCookie) {
    response.cookies.set('locale', preferredLocale, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }

  // ============================================================================
  // Rate Limiting Headers
  // ============================================================================

  // Add client IP to headers for rate limiting
  const clientIp = request.ip || request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  response.headers.set('X-Client-IP', clientIp);

  // ============================================================================
  // Feature Flags
  // ============================================================================

  // Pass feature flags to the request
  const featureFlags = {
    blockchain: process.env.NEXT_PUBLIC_ENABLE_BLOCKCHAIN === 'true',
    videoCall: process.env.NEXT_PUBLIC_ENABLE_VIDEO_CALL === 'true',
    docusign: process.env.NEXT_PUBLIC_ENABLE_DOCUSIGN === 'true',
    vastuAnalysis: process.env.NEXT_PUBLIC_ENABLE_VASTU_ANALYSIS === 'true',
  };

  response.headers.set('X-Feature-Flags', JSON.stringify(featureFlags));

  return response;
}

// ============================================================================
// Matcher Configuration
// ============================================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
