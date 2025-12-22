Dharma Realty - Deployment Guide
This guide covers deploying the Dharma Realty platform to production environments.
Table of Contents
Architecture Overview
Prerequisites
Frontend Deployment (Vercel)
Backend Deployment (Railway/AWS)
Database Setup (Supabase/Neon)
Redis Setup (Upstash)
File Storage (AWS S3/Cloudinary)
Blockchain Deployment
Environment Configuration
CI/CD Pipeline
Monitoring & Logging
Security Checklist

Architecture Overview
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                           CDN (Cloudflare)                       â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                 â”‚
         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
         â”‚                       â”‚                       â”‚
         â–¼                       â–¼                       â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚    Frontend     â”‚   â”‚     Backend     â”‚   â”‚   File Storage  â”‚
â”‚    (Vercel)     â”‚   â”‚    (Railway)    â”‚   â”‚    (AWS S3)     â”‚
â”‚                 â”‚   â”‚                 â”‚   â”‚                 â”‚
â”‚   Next.js 14    â”‚â”€â”€â–¶â”‚   Express API   â”‚â”€â”€â–¶â”‚   Images/Docs   â”‚
â”‚   React 18      â”‚   â”‚   Socket.io     â”‚   â”‚                 â”‚
â”‚   Tailwind      â”‚   â”‚   BullMQ        â”‚   â”‚                 â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                               â”‚
         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
         â”‚                     â”‚                     â”‚
         â–¼                     â–¼                     â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚   PostgreSQL    â”‚   â”‚     Redis       â”‚   â”‚   Blockchain    â”‚
â”‚   (Supabase)    â”‚   â”‚   (Upstash)     â”‚   â”‚   (Polygon)     â”‚
â”‚                 â”‚   â”‚                 â”‚   â”‚                 â”‚
â”‚   Primary DB    â”‚   â”‚   Cache/Queue   â”‚   â”‚   Contracts     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜


Prerequisites
Node.js 18+ and pnpm
Docker (for local testing)
Accounts on: Vercel, Railway, Supabase, Upstash
Domain name configured with DNS
SSL certificates (auto-managed by Vercel/Railway)

Frontend Deployment (Vercel)
Step 1: Connect Repository
Go to vercel.com
Import your GitHub repository
Select the frontend directory as the root
Step 2: Configure Build Settings
Framework Preset: Next.js
Build Command: pnpm build
Output Directory: .next
Install Command: pnpm install

Step 3: Environment Variables
Add these in Vercel Dashboard â†’ Settings â†’ Environment Variables:
## API
NEXT_PUBLIC_API_URL=https://api.dharmarealty.com
NEXT_PUBLIC_WS_URL=wss://api.dharmarealty.com

## Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...

## Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

## DocuSign
NEXT_PUBLIC_DOCUSIGN_INTEGRATION_KEY=...

## Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_MIXPANEL_TOKEN=...
NEXT_PUBLIC_SENTRY_DSN=https://...

## Features
NEXT_PUBLIC_ENABLE_BLOCKCHAIN=true
NEXT_PUBLIC_ENABLE_VIDEO_CALL=true
NEXT_PUBLIC_ENABLE_VASTU_ANALYSIS=true

Step 4: Domain Configuration
Add your domain in Vercel Dashboard â†’ Domains
Configure DNS:
 A     @     76.76.21.21CNAME www   cname.vercel-dns.com


Step 5: Deploy
Deployments are automatic on push to main branch.

Backend Deployment
Option A: Railway
Step 1: Create Project
Go to railway.app
Create new project from GitHub
Select the backend directory
Step 2: Configure Service
Build Command: pnpm build
Start Command: pnpm start

Step 3: Environment Variables
## Server
NODE_ENV=production
PORT=4000

## Database
DATABASE_URL=postgresql://...

## Redis
REDIS_URL=redis://...

## JWT
JWT_SECRET=your-production-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

## CORS
CORS_ORIGIN=https://dharmarealty.com

## Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

## DocuSign
DOCUSIGN_INTEGRATION_KEY=...
DOCUSIGN_ACCOUNT_ID=...
DOCUSIGN_PRIVATE_KEY=...

## Twilio
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_API_KEY_SID=...
TWILIO_API_KEY_SECRET=...

## AWS
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=ap-south-1
AWS_S3_BUCKET=dharma-uploads

## Email
SENDGRID_API_KEY=SG...
EMAIL_FROM=noreply@dharmarealty.com

Step 4: Add Domain
Configure custom domain in Railway dashboard.
Option B: AWS ECS
See AWS Deployment Guide for ECS setup.

Database Setup
Option A: Supabase
Create project at supabase.com
Get connection string from Settings â†’ Database
Run migrations:
 DATABASE_URL="postgresql://..." npx prisma migrate deploy


Option B: Neon
Create project at neon.tech
Copy connection string
Run migrations
Database Optimization
-- Create indexes for common queries
CREATE INDEX CONCURRENTLY idx_properties_city_status 
ON "Property"(city, status) WHERE status = 'available';

CREATE INDEX CONCURRENTLY idx_properties_location 
ON "Property" USING GIST (
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
);

-- Enable connection pooling
-- Use connection string with ?pgbouncer=true for serverless


Redis Setup
Upstash
Create database at upstash.com
Copy Redis URL (TLS enabled)
Configure in backend environment
Configuration
// Use these settings for production
const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});


File Storage
AWS S3
Create S3 bucket (ap-south-1 for India)


Configure CORS:

 {
  "CORSRules": [
    {
      "AllowedOrigins": ["https://dharmarealty.com"],
      "AllowedMethods": ["GET", "PUT", "POST"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3600
    }
  ]
}


Create CloudFront distribution for CDN


Configure bucket policy for public read (images only)


Alternative: Cloudinary
For image optimization and transformation:
CLOUDINARY_CLOUD_NAME=dharma
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...


Blockchain Deployment
Polygon Mainnet
Configure Hardhat for Polygon:

 // hardhat.config.js
module.exports = {
  networks: {
    polygon: {
      url: process.env.POLYGON_RPC_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
      gasPrice: 50000000000, // 50 gwei
    },
  },
};


Deploy contracts:

 npx hardhat run scripts/deploy.js --network polygon


Verify on PolygonScan:

 npx hardhat verify --network polygon <CONTRACT_ADDRESS>


Update frontend with contract addresses



Environment Configuration
Production Checklist
[ ] All secrets are unique and strong
[ ] JWT secrets are at least 32 characters
[ ] Database connection uses SSL
[ ] Redis connection uses TLS
[ ] CORS is properly configured
[ ] Rate limiting is enabled
[ ] API keys are production keys (not test)
Secrets Management
For production, use:
Vercel Environment Variables (frontend)
Railway Environment Variables (backend)
AWS Secrets Manager (for sensitive keys)

CI/CD Pipeline
The GitHub Actions workflow (.github/workflows/ci-cd.yml) handles:
On PR: Lint, test, build check, preview deploy
On main push: Full test suite, build, deploy to production
Required Secrets
Add to GitHub repository settings:
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
RAILWAY_TOKEN
STRIPE_PUBLISHABLE_KEY
GOOGLE_MAPS_API_KEY
SENTRY_AUTH_TOKEN
SLACK_WEBHOOK_URL
SNYK_TOKEN
SONAR_TOKEN


Monitoring & Logging
Sentry (Error Tracking)
// Already configured in middleware.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});

Logging (Backend)
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty', // Remove in production
  },
});

Uptime Monitoring
Use Better Uptime or UptimeRobot
Monitor: API health, WebSocket, Database

Security Checklist
Before Launch
[ ] All environment variables are set
[ ] HTTPS is enforced (HSTS)
[ ] CSP headers are configured
[ ] Rate limiting is enabled
[ ] SQL injection prevention (Prisma)
[ ] XSS prevention (React)
[ ] CSRF tokens for forms
[ ] Input validation (Zod)
[ ] Authentication is working
[ ] Authorization rules tested
[ ] File upload validation
[ ] Secrets are not in code
[ ] Dependencies are updated
[ ] Security headers set
[ ] Error messages don't leak info
Ongoing
[ ] Regular dependency updates (Dependabot)
[ ] Security vulnerability scanning
[ ] Access log monitoring
[ ] Backup verification
[ ] SSL certificate renewal (auto)

Rollback Procedure
Frontend (Vercel)
Go to Vercel Dashboard â†’ Deployments
Find the last working deployment
Click "..." â†’ "Promote to Production"
Backend (Railway)
Go to Railway Dashboard â†’ Deployments
Click on previous deployment
Click "Redeploy"
Database
## Revert last migration
npx prisma migrate resolve --rolled-back <migration_name>

## Or restore from backup
pg_restore -d dharma_prod backup.dump


Support
For deployment issues:
Check logs in Vercel/Railway dashboards
Review Sentry for errors
Contact: devops@dharmarealty.com

Last updated: December 2024
