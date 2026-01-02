# ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ CHECKLISTS

> **The Safety Net: What Else to Check**
> Never forget to update connected systems.
> Use VACCINE checklists BEFORE problems happen.

---

## ÃƒÂ°Ã…Â¸Ã‚Â©Ã‚Âº SECTION A: VACCINE CHECKLISTS (Preventive)

---

## ÃƒÂ°Ã…Â¸Ã…Â¡Ã¢â€šÂ¬ PRE-DEPLOYMENT MASTER CHECKLIST

### Check EVERY Time Before Deploying

```text
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ ENVIRONMENT VARIABLES
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ All required vars set in production
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ DATABASE_URL is production URL
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ API keys are production (not test/dev)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Secrets are strong and unique
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ No localhost anywhere

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ DATABASE
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ prisma migrate status shows no pending
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Database is accessible
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Connection pooling configured (if serverless)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Seed data applied (if needed)

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ AUTHENTICATION
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Auth secrets set and secure
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Cookie settings correct (secure, httpOnly)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ CORS origins include production domain
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Session expiration configured

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ BUILD
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ npm run build succeeds locally
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ No TypeScript errors
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ No ESLint errors/warnings
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Bundle size acceptable

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ TESTING
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ All tests pass
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Critical flows tested manually
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Mobile responsive verified
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Forms submit correctly
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Error states display properly

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ SECURITY
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ No sensitive data in console.log
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ No API keys in frontend code
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Rate limiting configured
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Input validation on all endpoints

```text

## ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ¢â‚¬Å¾ CROSS-CUTTING CHANGE CHECKLISTS

### When You CHANGE Authentication System

```text
CHANGED AUTH? ALSO UPDATE:

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Frontend
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Login component/page
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Logout functionality
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Auth context/provider
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Protected route wrapper
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Token/session storage logic

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Backend
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Auth API routes
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Middleware (middleware.ts)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Protected API routes
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Session configuration

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Configuration
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Environment variables
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ CORS settings
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Cookie settings

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Tests
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Auth flow tests
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Protected route tests
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Mock auth in other tests

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Documentation
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Auth flow documented
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ ENV example updated

```text

### When You CHANGE Database Schema

```text
CHANGED SCHEMA? ALSO UPDATE:

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Prisma
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Run: npx prisma migrate dev
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Run: npx prisma generate
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Update seed file if needed

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ TypeScript
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Update/create DTO types
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Update API response types
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Update frontend interfaces

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ API Routes
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Update create/update logic
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Update select/include queries
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Update validation schemas
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Update response shapes

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Frontend
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Update forms
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Update display components
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Update type definitions

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Tests
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Update test fixtures
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Update mock data
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Add tests for new fields

```text

### When You ADD New API Route

```text
NEW API ROUTE? ENSURE IT HAS:

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Request Handling
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Correct HTTP method exported (GET, POST, etc.)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Input validation (Zod schema)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Request body parsing
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Query parameter handling

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Security
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Authentication check (if protected)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Authorization check (if role-based)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Rate limiting (if public)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Input sanitization

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Error Handling
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Try-catch wrapper
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Proper error responses
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ No stack traces in production
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Logging for debugging

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Response
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Correct status codes
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Consistent response shape
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ TypeScript types

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Connected Updates
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Frontend API function
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Types for request/response
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Tests for the endpoint

```text

### When You ADD New Page Route

```text
NEW PAGE? ENSURE IT HAS:

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ SEO
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Title tag (metadata)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Meta description
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ OpenGraph tags (if shared)

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ UX
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Loading state
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Error state
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Empty state
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Mobile responsive
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Keyboard navigation

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Error Handling
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Error boundary
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Try-catch for data fetching
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Graceful degradation

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Security
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Auth check (if protected)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Redirect for unauthorized

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Navigation
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Link added to nav/menu
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Breadcrumbs updated
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Back navigation works

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Testing
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Unit tests
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ E2E tests for critical paths

```text

### When You CHANGE: Environment Variables

```text
CHANGED ENV VARS? ALSO UPDATE:

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Documentation
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ .env.example updated
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ README updated

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Deployment
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Vercel/hosting dashboard
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ CI/CD secrets
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Docker/container config

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Local Dev
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Team notified
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ .env.local on all machines

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Validation
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Runtime check for required vars
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Type definitions for env

```text

## ÃƒÂ°Ã…Â¸Ã‚ÂÃ¢â‚¬â€ÃƒÂ¯Ã‚Â¸Ã‚Â STACK-SPECIFIC CHECKLISTS

### Next.js 14 App Router Checklist

```text
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ FILE STRUCTURE
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Apps in app/ directory
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ API routes in app/api/
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Components in components/
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Layout.tsx at root

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ ROUTING
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ page.tsx for each route
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ layout.tsx for shared layouts
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ loading.tsx for suspense
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ error.tsx for error handling
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ not-found.tsx for 404

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ DATA FETCHING
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Server Components for static data
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ 'use client' for interactive
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Proper caching strategy
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Revalidation configured

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ MIDDLEWARE
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ matcher configured correctly
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Not matching static files
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Auth logic working

```text

### Prisma ORM Checklist

```text
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ SCHEMA
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ All models have @id
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Relations properly defined
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Indexes on frequently queried fields
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Enums for fixed values

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ CLIENT
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ npx prisma generate ran
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Single client instance
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Connection pooling (if needed)

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ MIGRATIONS
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Migration files committed
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ No pending migrations
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Production migrations applied

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ QUERIES
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Using select to limit fields
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Using include carefully
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Transactions for multi-step
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Error handling

```text

### Tailwind CSS Checklist

```text
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ CONFIGURATION
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ tailwind.config.js correct
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Content paths include all files
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Custom colors/fonts defined
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Dark mode configured (if using)

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ USAGE
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Responsive prefixes (sm:, md:, lg:)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Consistent spacing scale
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Design tokens used
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ No conflicting styles

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ BUILD
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ PostCSS configured
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Purging working (small bundle)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ No unused styles

```text

## ÃƒÂ¢Ã…Â¡Ã‚Â¡ QUICK REFERENCE CHECKLISTS

### Before EVERY Commit

```bash
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ npm run lint    # No errors?
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ npm run build   # Builds?
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ npm run test    # Tests pass?
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ git diff        # Review changes

```text

### Before EVERY PR

```text
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ All commits atomic and meaningful
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ No console.log left behind
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ No TODO that blocks merge
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Tests added for new code
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Documentation updated
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Self-reviewed the diff

```text

### Before EVERY Release

```text
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ All features complete
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ All bugs fixed
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Performance acceptable
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Security reviewed
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Monitoring in place
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Rollback plan ready

```text

## ÃƒÂ°Ã…Â¸Ã¢â‚¬â„¢Ã¢â‚¬Â° SECTION B: INJECTION CHECKLISTS (Post-Fix)

---

## ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ¢â‚¬Å¾ POST-FIX VERIFICATION CHECKLIST

### After Fixing Any Bug

```text
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ IMMEDIATE VERIFICATION
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Original issue no longer occurs
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Same steps that caused bug now work
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Same data that caused bug now works

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ REGRESSION CHECK
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Run all tests
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Manually test related features
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Check nothing else broke

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ EDGE CASES
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Empty data
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Maximum data
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Special characters
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Different user roles
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Different browsers (if UI)

```text

## ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ "IT WORKS" CRITERIA

### Form Works When

```text
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ All fields accept input
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Validation shows errors correctly
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Submit button state changes during submit
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Success message appears
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Error message appears if fails
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Form resets or redirects after success
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Works on mobile

```text

### API Endpoint Works When

```text
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Returns correct data for valid request
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Returns 400 for invalid input
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Returns 401 for unauthenticated
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Returns 403 for unauthorized
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Returns 404 for not found
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Returns user-friendly 500 error
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Response time < 500ms

```text

### Authentication Works When

```text
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Can register new account
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Can login with valid credentials
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Cannot login with invalid credentials
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Session persists on refresh
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Can logout
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Protected pages redirect when not logged in
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Token refresh works (if applicable)

```text

### List Table Works When

```text
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Shows loading initially
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Shows empty state when no data
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Shows data correctly
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Pagination works (if applicable)
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Sorting works (if applicable)
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Search/filter works (if applicable)
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Actions (edit, delete) work

```text

#### This is your SAFETY NET ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦

#### Never forget what else to check

---

## ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ‚Â§ SECTION C: FEATURE-SPECIFIC CHECKLISTS

---

### ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂºÃ¢â‚¬â„¢ E-Commerce Feature Checklists

#### Adding Payment Integration

```text
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ STRIPE SETUP
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Stripe account created
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ API keys in environment
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Webhook endpoint created
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Webhook secret in environment
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Test mode enabled for dev

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ BACKEND
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Payment intent creation route
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Webhook handler for events
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Order status update on success
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Email confirmation trigger
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Refund handling

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ FRONTEND
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Stripe Elements integrated
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Card validation
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Loading state during payment
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Success/error handling
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Receipt/confirmation page

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ SECURITY
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ No card data stored locally
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ HTTPS only
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Webhook signature verification
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Idempotency keys used
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ PCI compliance reviewed

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ TESTING
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Test card numbers work
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Declined cards handled
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ 3D Secure flow tested
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Webhook replay tested
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Refund flow tested

```text

#### Adding Shopping Cart

```text
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ DATA MODEL
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Cart storage (local/server)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Cart item structure
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Price calculation logic
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Inventory check

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ FRONTEND
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Add to cart button
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Cart icon with count
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Cart sidebar/modal
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Quantity controls
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Remove item
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Empty cart state
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Persisted across sessions

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ CHECKOUT FLOW
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Cart summary
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Shipping options
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Tax calculation
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Discount codes
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Order review
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Payment step

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ EDGE CASES
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Out of stock handling
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Price change during session
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Session expiry
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Maximum quantity limits

```text

### ÃƒÂ°Ã…Â¸Ã¢â‚¬ËœÃ‚Â¤ User Management Checklists

#### Adding User Profile

```text
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ DATA MODEL
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Profile schema (name, avatar, bio)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Relation to User model
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Optional vs required fields

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ BACKEND
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ GET profile route
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ UPDATE profile route
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Avatar upload endpoint
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Input validation

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ FRONTEND
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Profile display page
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Edit profile form
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Avatar upload component
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Loading states
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Validation feedback

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ FEATURES
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Change password
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Change email (with verification)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Delete account
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Export data (GDPR)

```text

#### Adding User Roles Permissions

```text
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ DATA MODEL
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Role enum in schema
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Default role for new users
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Permission matrix defined

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ BACKEND
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Role check middleware
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Permission check utilities
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Admin routes protected
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Audit logging for admin actions

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ FRONTEND
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Role-based UI visibility
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Admin dashboard (if admin)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Forbidden page

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ TESTING
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Each role tested
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Privilege escalation tested
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Permission boundaries verified

```text

### ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â§ Notification Checklists

#### Adding Email Notifications

```text
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ PROVIDER SETUP
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Email service (Resend, SendGrid, etc.)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ API keys in environment
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Sender domain verified
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Template system chosen

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ BACKEND
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Email utility function
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Template rendering
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Queue for async sending
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Retry logic for failures
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Unsubscribe handling

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ EMAILS TO IMPLEMENT
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Welcome email
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Password reset
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Email verification
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Order confirmation
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Notification digests

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ TESTING
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Dev mode sends to test address
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Template rendering tested
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Link generation correct
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Unsubscribe works

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ COMPLIANCE
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ CAN-SPAM compliance
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Unsubscribe link in all
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Physical address included
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Sender name clear

```text

#### Adding Push Notifications

```text
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ SETUP
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Web push or mobile push
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Service worker for web
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ VAPID keys generated
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Push permission UI

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ BACKEND
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Subscription storage
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Push sending utility
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Batch sending for scale
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Retry on failure

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ FRONTEND
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Permission request
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Subscription management
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Notification preferences
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ In-app notification center

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ TESTING
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Different browsers
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Offline delivery
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Click tracking

```text

### ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â File Upload Checklists

#### Adding File Image Upload

```text
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ STORAGE SETUP
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Storage provider (S3, Cloudinary, etc.)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Credentials in environment
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Bucket/folder structure
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ CORS configured

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ BACKEND
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Upload endpoint
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ File type validation
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ File size limits
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Virus scanning (if needed)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Presigned URLs (if direct upload)

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ FRONTEND
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ File input component
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Drag and drop
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Preview before upload
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Upload progress
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Error handling
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ File type restrictions

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ IMAGE-SPECIFIC
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Resize on upload
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Multiple sizes generated
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Lazy loading
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Placeholder/blur

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ SECURITY
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ No executable uploads
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Content-Type validation
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Authenticated uploads
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Private bucket settings

```text

### ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ‚Â Search Feature Checklists

#### Adding Search Functionality

```text
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ SEARCH BACKEND
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Search method chosen (DB, Elasticsearch, Algolia)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Indexing strategy
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Full-text search enabled
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Relevance tuning

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ API
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Search endpoint
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Pagination
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Filters
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Sorting options
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Debounced requests

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ FRONTEND
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Search input
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Autocomplete/suggestions
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Results display
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Loading state
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ No results state
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Pagination controls

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ PERFORMANCE
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Index created on search fields
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Response time < 200ms
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Caching for common queries
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Rate limiting

```text

## ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ‚Â SECTION D: SECURITY CHECKLISTS

---

### ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ‚Â Authentication Security Checklist

```text
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ PASSWORD HANDLING
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Hashing with bcrypt/argon2
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Salt is unique per password
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Never log passwords
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Min length requirement (12+)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Common password check
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Rate limiting on login

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ SESSION MANAGEMENT
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Secure, httpOnly cookies
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ SameSite attribute set
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Session expiration
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Logout invalidates session
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Session regeneration on login

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ TOKEN SECURITY
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Short expiration
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Refresh token rotation
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Token revocation capability
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ No sensitive data in token

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ ACCOUNT SECURITY
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Email verification required
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Password reset secure
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Reset tokens expire quickly
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Account lockout after attempts
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Security questions (optional)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ 2FA option available

```text

### ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂºÃ‚Â¡ÃƒÂ¯Ã‚Â¸Ã‚Â API Security Checklist

```text
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ INPUT VALIDATION
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ All inputs validated
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Type checking
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Length limits
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Format validation
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ SQL injection prevented (ORM)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ XSS prevented (encoding)

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ AUTHENTICATION
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Auth on all protected routes
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Token validation on every request
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ No auth bypass possible
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ API key rotation plan

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ AUTHORIZATION
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Resource ownership verified
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Role checks implemented
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ No IDOR vulnerabilities
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Least privilege principle

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ RATE LIMITING
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Rate limiting enabled
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Different limits per endpoint
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ IP-based + user-based
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Graceful degradation

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ RESPONSE SECURITY
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ No stack traces in production
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ No sensitive data leaked
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Proper error messages
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Security headers set

```text

### ÃƒÂ°Ã…Â¸Ã…â€™Ã‚Â Frontend Security Checklist

```text
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ XSS PREVENTION
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ User input escaped
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ dangerouslySetInnerHTML NOT used
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ CSP headers configured
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ No inline scripts

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ CSRF PREVENTION
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ CSRF tokens used (if cookies)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ SameSite cookie attribute
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Origin/Referer validation

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ SENSITIVE DATA
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ No secrets in frontend
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ API keys not exposed
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ No sensitive data in localStorage
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Console.log cleaned

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ DEPENDENCIES
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ npm audit clean
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ No vulnerable packages
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Lock file committed
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Regular updates scheduled

```text

### ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã…Â  Data Security Checklist

```text
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ IN TRANSIT
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ HTTPS everywhere
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ HSTS header set
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ TLS 1.2+ only
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ No mixed content

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ AT REST
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Sensitive data encrypted
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Encryption keys rotated
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ PII minimized
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Data classified

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ BACKUP & RECOVERY
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Backups automated
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Backups encrypted
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Restore tested
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Recovery time objective set

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ COMPLIANCE
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ GDPR data export
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Right to deletion
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Data retention policy
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Privacy policy updated

```text

## ÃƒÂ°Ã…Â¸Ã…Â¡Ã¢â€šÂ¬ SECTION E: DEPLOYMENT CHECKLISTS

---

### ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â¦ Vercel Deployment Checklist

```text
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ PROJECT SETUP
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Git repository connected
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Build command correct
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Output directory correct
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Root directory correct

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ ENVIRONMENT
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ All env vars set
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Production values (not dev)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Database URL points to prod
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Secrets properly set

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ DOMAIN
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Domain added
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ DNS configured
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ SSL certificate active
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Redirects configured

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ OPTIMIZATION
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Edge functions enabled
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Image optimization on
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ ISR configured
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Analytics enabled

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ MONITORING
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Function logs accessible
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Error tracking (Sentry)
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Performance monitoring
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Usage alerts set

```text

### ÃƒÂ°Ã…Â¸Ã‚ÂÃ‚Â³ Docker Deployment Checklist

```text
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ DOCKERFILE
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Multi-stage build
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Minimal base image
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Non-root user
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ .dockerignore in place
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Health check defined

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ COMPOSE
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ All services defined
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Network configured
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Volumes for persistence
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Environment variables
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Restart policies

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ SECURITY
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ No secrets in image
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Images scanned
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Tags pinned
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Registry authenticated

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ PRODUCTION
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Resource limits set
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Logging configured
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Monitoring enabled
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Rollback plan ready

```text

### ÃƒÂ¢Ã…Â¡Ã¢â€žÂ¢ÃƒÂ¯Ã‚Â¸Ã‚Â CI CD Pipeline Checklist

```text
ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ BUILD STAGE
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Dependencies cached
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Lint runs
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Type check runs
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Tests run
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Build succeeds

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ TEST STAGE
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Unit tests pass
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Integration tests pass
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ E2E tests pass
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Coverage threshold met

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ SECURITY STAGE
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Dependency audit
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Secret scanning
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ SAST tools run

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ DEPLOY STAGE
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Environment selected
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Migrations run
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Health check passes
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Notifications sent

ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ POST-DEPLOY
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Smoke tests run
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Monitoring verified
  ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¡ Rollback ready

```text

#### [TARGET: 10,000 LINES OF CHECKLISTS]

#### Current: ~700 lines - Expanding systematically

#### Coverage: E-commerce, User Management, Notifications, Files, Search, Security, Deployment

---

#### This is your COMPREHENSIVE SAFETY NET ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦

#### VACCINE for prevention, INJECTION for fixing

#### Never forget what else to check

---

## ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ PRODUCTION CHECKLISTS

> **Never miss critical steps**

---

### Pre-Deploy Checklist

```text
BEFORE DEPLOYING:

[ ] All tests passing
[ ] Migrations backwards compatible
[ ] Feature flags in place
[ ] Rollback tested
[ ] Monitoring ready
[ ] On-call aware
[ ] Change log updated
[ ] Dependencies audited

```text

### New Service Checklist

```text
BEFORE GOING LIVE:

[ ] Health check endpoint
[ ] Readiness probe
[ ] Liveness probe
[ ] Resource limits set
[ ] Logging configured
[ ] Error tracking setup
[ ] Metrics exported
[ ] Alerts configured
[ ] Documentation written
[ ] Runbook created

```text

### Security Review Checklist

```text
SECURITY REVIEW:

[ ] Input validation on all endpoints
[ ] Authentication required
[ ] Authorization checked per resource
[ ] Rate limiting enabled
[ ] CORS configured correctly
[ ] Security headers set
[ ] Secrets not in code
[ ] SQL injection prevented
[ ] XSS prevention in place
[ ] CSRF tokens for forms

```text

### Post-Incident Checklist

```text
AFTER INCIDENT:

[ ] Timeline documented
[ ] Root cause identified
[ ] Fix verified
[ ] Monitoring added
[ ] Runbook updated
[ ] Team informed
[ ] Postmortem scheduled
[ ] Action items assigned

```text
---

## ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ API SECURITY CHECKLIST

> **Comprehensive API security review**

---

### Authentication Checklist

```text
[ ] HTTPS enforced everywhere
[ ] Strong password requirements
[ ] Rate limiting on auth endpoints
[ ] Account lockout after failures
[ ] Secure password reset flow
[ ] MFA option available
[ ] Session timeout configured
[ ] Secure cookie settings (HttpOnly, Secure, SameSite)

```text

### JWT Checklist

```text
[ ] Algorithm explicitly specified
[ ] Short expiration time (15 min)
[ ] Refresh token rotation implemented
[ ] Signature validation working
[ ] Claims validated (iss, aud, exp)
[ ] Token invalidation possible
[ ] Sensitive data not in payload

```text

### Input Validation Checklist

```text
[ ] Schema validation on all inputs
[ ] SQL injection prevented (parameterized)
[ ] XSS inputs sanitized
[ ] File upload validation
[ ] Content-type validation
[ ] Size limits enforced
[ ] Character encoding handled

```text
---

## ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ DATABASE MIGRATION CHECKLIST

> **Safe migration execution**

---

### Pre-Migration

```text
[ ] Tested on staging with production-like data
[ ] Backup taken
[ ] Rollback script ready
[ ] Off-peak timing planned
[ ] Team notified
[ ] Monitoring ready

```text

### During Migration

```text
[ ] Watch for lock wait timeouts
[ ] Monitor query performance
[ ] Check replication lag
[ ] Watch disk usage
[ ] Monitor connection count

```text

### Safe Migration Patterns

```text
ADDING COLUMN:
[ ] Nullable or with default
[ ] No table lock (most DBs)

RENAMING COLUMN:
[ ] Add new column
[ ] Dual-write
[ ] Migrate reads
[ ] Remove old column

ADDING INDEX:
[ ] Use CONCURRENTLY (PostgreSQL)
[ ] Off-peak hours
[ ] Monitor table size

```text

### Post-Migration

```text
[ ] Verify data integrity
[ ] Run smoke tests
[ ] Check query performance
[ ] Confirm no errors in logs
[ ] Update team

```text
---

## ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ CODE REVIEW CHECKLIST

> **The review patterns that catch bugs**

---

### Functionality

```text
[ ] Does the code do what its supposed to?
[ ] Edge cases handled?
[ ] Error handling in place?
[ ] Happy path works?
[ ] Unhappy path works?

```text

### Security

```text
[ ] Input validated?
[ ] SQL injection prevented?
[ ] XSS prevented?
[ ] Authorization checked?
[ ] Secrets not exposed?
[ ] Rate limiting in place?

```text

### Performance

```text
[ ] N+1 queries avoided?
[ ] Large data paginated?
[ ] Unnecessary computation avoided?
[ ] Caching considered?
[ ] Indexes used properly?

```text

### Maintainability

```text
[ ] Code readable?
[ ] Functions small and focused?
[ ] Names descriptive?
[ ] Complex logic commented?
[ ] Tests included?
[ ] Documentation updated?

```text

### Common Issues

```text
[ ] No console.logs left
[ ] No debug code
[ ] No TODO without issue link
[ ] No sensitive data in logs
[ ] Lock file updated
[ ] Migration reversible

```text
