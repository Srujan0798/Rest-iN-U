import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import crypto from 'crypto';

// Helmet Configuration with strict CSP
export const securityHeaders = helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:', 's3.amazonaws.com'],
      connectSrc: ["'self'", 'https:', 'wss:'],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
});

// CSRF Protection (Double Submit Cookie Pattern)
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Skip CSRF for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      // Set CSRF token cookie if not present
      if (!req.cookies?.['XSRF-TOKEN']) {
          const token = crypto.randomBytes(32).toString('hex');
          res.cookie('XSRF-TOKEN', token, {
              httpOnly: false, // Accessible by JS so client can read and send in header
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
              path: '/'
          });
      }
      return next();
  }

  // Verify CSRF token for mutations
  const tokenFromHeader = req.headers['x-xsrf-token'] || req.headers['x-csrf-token'];
  const tokenFromCookie = req.cookies?.['XSRF-TOKEN'];

  if (!tokenFromCookie || !tokenFromHeader || tokenFromCookie !== tokenFromHeader) {
      return res.status(403).json({
          success: false,
          error: 'CSRF token validation failed'
      });
  }

  next();
};
