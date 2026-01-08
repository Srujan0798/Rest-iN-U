# 🧠 BRAIN ACTIVATION SYSTEM

## Table of Contents

- [Table of Contents](#table-of-contents)
- [🩺 SECTION A: VACCINE (PREVENTIVE CHECKS)](#-section-a-vaccine-preventive-checks)
- [Use these BEFORE deployment to catch issues early](#use-these-before-deployment-to-catch-issues-early)
- [🔍 PRE-DEPLOYMENT MASTER CHECKLIST](#-pre-deployment-master-checklist)
- [Before EVERY Deployment, Run Through This](#before-every-deployment-run-through-this)
- [🔗 CROSS-CUTTING CONCERN CHECKLISTS](#-cross-cutting-concern-checklists)
- [When You CHANGE Authentication](#when-you-change-authentication)
- [When You CHANGE Database Schema](#when-you-change-database-schema)
- [When You ADD a New API Route](#when-you-add-a-new-api-route)
- [When You ADD a New Page](#when-you-add-a-new-page)
- [When You CHANGE Environment Variables](#when-you-change-environment-variables)
- [🧪 PRE-COMMIT QUICK CHECK](#-pre-commit-quick-check)
- [Before EVERY Commit](#before-every-commit)
- [Run this checklist](#run-this-checklist)
- [📋 NEXT.JS + PRISMA SPECIFIC VACCINE](#-nextjs--prisma-specific-vaccine)
- [Before Deploying Next.js App](#before-deploying-nextjs-app)
- [💉 SECTION B: INJECTION (DEBUG & FIX)](#-section-b-injection-debug--fix)
- [Use these AFTER errors appear to diagnose and fix](#use-these-after-errors-appear-to-diagnose-and-fix)
- [🌳 DECISION TREE: APP NOT LOADING](#-decision-tree-app-not-loading)
- [🌳 DECISION TREE: API NOT WORKING](#-decision-tree-api-not-working)
- [🌳 DECISION TREE: DATABASE ERROR](#-decision-tree-database-error)
- [🌳 DECISION TREE: BUILD FAILING](#-decision-tree-build-failing)
- [📊 ROOT CAUSE MAPPING: SYMPTOM → CAUSE → FIX](#-root-cause-mapping-symptom--cause--fix)
- [Component Not Rendering](#component-not-rendering)
- [API Returning Wrong Data](#api-returning-wrong-data)
- [Authentication Issues](#authentication-issues)
- [✅ SECTION C: VERIFICATION PROTOCOLS](#-section-c-verification-protocols)
- [After EVERY fix, verify it actually works](#after-every-fix-verify-it-actually-works)
- [🔄 POST-FIX VERIFICATION CHECKLIST](#-post-fix-verification-checklist)
- [After Fixing ANY Bug](#after-fixing-any-bug)
- [🎯 "IT WORKS" CRITERIA BY FEATURE TYPE](#-it-works-criteria-by-feature-type)
- [For a Form](#for-a-form)
- [For an API Endpoint](#for-an-api-endpoint)
- [For Authentication](#for-authentication)
- [For a List/Table](#for-a-listtable)
- [🗺️ SECTION D: DEPENDENCY MAPS](#-section-d-dependency-maps)
- [How everything connects in Next.js + Prisma stack](#how-everything-connects-in-nextjs--prisma-stack)
- [📦 FULL STACK FLOW](#-full-stack-flow)
- [🔗 FILE DEPENDENCY MAP](#-file-dependency-map)
- [🔄 DATA FLOW PATTERNS](#-data-flow-patterns)
- [Reading Data (GET)](#reading-data-get)
- [Creating Data (POST)](#creating-data-post)
- [Updating Data (PUT/PATCH)](#updating-data-putpatch)
- [Deleting Data (DELETE)](#deleting-data-delete)
- [⚠️ COMMON BREAK POINTS](#-common-break-points)
  - [CONTINUED: MORE BRAIN ACTIVATION PATTERNS](#continued-more-brain-activation-patterns)
  - [This is your VACCINE 🩺 + INJECTION 💉 system](#this-is-your-vaccine---injection--system)
  - [Both preventive AND reactive approaches](#both-preventive-and-reactive-approaches)

## 🩺 SECTION A: VACCINE (PREVENTIVE CHECKS)

## Use these BEFORE deployment to catch issues early

---

## 🔍 PRE-DEPLOYMENT MASTER CHECKLIST

## Before EVERY Deployment, Run Through This

    â-¡ ENVIRONMENT
    â-¡ All required env variables set
    â-¡ Production URLs (not localhost)
    â-¡ API keys are production keys (not test)
    â-¡ Database URL points to production DB
    â-¡ Secret keys are strong and unique
    
    â-¡ DATABASE
    â-¡ Migrations are up to date (prisma migrate status)
    â-¡ No pending migrations
    â-¡ Seed data applied if needed
    â-¡ Connection pooling configured
    â-¡ Database accessible from production server
    
    â-¡ AUTHENTICATION
    â-¡ Session secrets set
    â-¡ JWT expiration configured
    â-¡ OAuth callback URLs updated for production
    â-¡ CORS origins include production domain
    â-¡ Secure cookies enabled (https only)
    
    â-¡ API
    â-¡ All endpoints tested manually
    â-¡ Error responses are user-friendly (not stack traces)
    â-¡ Rate limiting configured
    â-¡ Input validation on all endpoints
    â-¡ Authentication required where needed
    
    â-¡ FRONTEND
    â-¡ No console.log statements in production
    â-¡ Error boundaries in place
    â-¡ Loading states for all async operations
    â-¡ 404 and error pages exist
    â-¡ SEO meta tags set
    
    â-¡ BUILD
    â-¡ Production build succeeds (npm run build)
    â-¡ No TypeScript errors
    â-¡ No ESLint errors
    â-¡ Bundle size acceptable
    â-¡ Static assets optimized
    
    â-¡ TESTING
    â-¡ All tests pass
    â-¡ Critical user flows tested manually
    â-¡ Mobile responsive checked
    â-¡ Cross-browser tested (if needed)
    

---

## 🔗 CROSS-CUTTING CONCERN CHECKLISTS

## When You CHANGE Authentication

    Changed auth? Also update:
    â-¡ middleware.ts (protect routes)
    â-¡ API routes (auth checks)
    â-¡ Frontend auth context
    â-¡ Login/logout flows
    â-¡ Session configuration
    â-¡ Tests for auth
    â-¡ Documentation
    

## When You CHANGE Database Schema

    Changed schema? Also update:
    â-¡ Run prisma migrate dev
    â-¡ Update TypeScript types
    â-¡ Update API responses
    â-¡ Update frontend interfaces
    â-¡ Update seed data
    â-¡ Update tests
    â-¡ Update documentation
    

## When You ADD a New API Route

    New API route? Also add:
    â-¡ Input validation (Zod schema)
    â-¡ Error handling (try-catch)
    â-¡ Authentication check (if needed)
    â-¡ Rate limiting (if public)
    â-¡ TypeScript types for request/response
    â-¡ Tests for the endpoint
    â-¡ Frontend API call function
    

## When You ADD a New Page

    New page? Also add:
    â-¡ SEO meta tags
    â-¡ Loading state
    â-¡ Error boundary
    â-¡ Mobile responsive design
    â-¡ Authentication check (if protected)
    â-¡ Navigation link
    â-¡ Tests for page
    

## When You CHANGE Environment Variables

    Changed env? Also update:
    â-¡ .env.example file
    â-¡ Production environment (Vercel/hosting)
    â-¡ CI/CD secrets
    â-¡ Documentation
    â-¡ Team notification
    

---

## 🧪 PRE-COMMIT QUICK CHECK

## Before EVERY Commit

    
    ## Run this checklist
    
    1. npm run lint  # No linting errors?
    
    1. npm run typecheck  # No TypeScript errors?
    
    1. npm run test  # All tests pass?
    
    1. npm run build  # Build succeeds?
    
    1. git diff --staged  # Review changes one more time
    

---

## 📋 NEXT.JS + PRISMA SPECIFIC VACCINE

## Before Deploying Next.js App

    â-¡ NEXT.JS CHECKS
    â-¡ next.config.js has production settings
    â-¡ Image domains configured
    â-¡ API routes have proper error handling
    â-¡ Static generation working for static pages
    â-¡ ISR configured correctly (if using)
    â-¡ Middleware not blocking needed routes
    
    â-¡ PRISMA CHECKS
    â-¡ DATABASE_URL set in production
    â-¡ prisma generate ran successfully
    â-¡ Prisma Client included in dependencies
    â-¡ Connection pooling for serverless (if Vercel)
    â-¡ Schema and DB are in sync
    
    â-¡ VERCEL SPECIFIC (if using)
    â-¡ Environment variables set in Vercel dashboard
    â-¡ Build command is correct
    â-¡ Output directory correct
    â-¡ Serverless function timeout checked
    â-¡ Edge functions configured (if using)
    

---

## 💉 SECTION B: INJECTION (DEBUG & FIX)

## Use these AFTER errors appear to diagnose and fix

---

## 🌳 DECISION TREE: APP NOT LOADING

    App not loading / White screen / Infinite loading?
    │
    ├── Check browser console for errors
    │ │
    │ ├── JavaScript error visible?
    │ │   ├── "Cannot read properties of undefined"
    │ │   │   └── DATA BUG: Check state initialization
    │ │   │  → useState([]) not useState()
    │ │   │  → Check API response shape
    │ │   │
    │ │   ├── "Hydration mismatch"
    │ │   │   └── SSR/CLIENT MISMATCH
    │ │   │  → Check Date/time usage
    │ │   │  → Check window/localStorage usage
    │ │   │  → Wrap in useEffect
    │ │   │
    │ │   └── Other error
    │ │  └── Google the exact error message
    │ │
    │ └── No error visible
    │ │
    │ ├── Check Network tab
    │ │   ├── API call failing?
    │ │   │   └── Go to API DEBUG tree
    │ │   │
    │ │   └── All calls successful?
    │ │  └── Check for infinite loading loop
    │ │  → Look for useEffect without deps
    │ │  → Look for state update in render
    │ │
    │ └── Network tab empty?
    │ └── Check if page is even reached
    │ → Check routing
    │ → Check middleware blocking
    

---

## 🌳 DECISION TREE: API NOT WORKING

    API returning error / not responding?
    │
    ├── Check what status code
    │ │
    │ ├── 500 Internal Server Error
    │ │   └── SERVER-SIDE BUG
    │ │  → Check server logs
    │ │  → Check for unhandled exceptions
    │ │  → Database connection issue?
    │ │  → Environment variables missing?
    │ │
    │ ├── 404 Not Found
    │ │   └── ROUTE DOESN'T EXIST
    │ │  → Correct file path? (app/api/x/route.ts)
    │ │  → Exported correct HTTP method? (GET, POST)
    │ │  → Dynamic route param correct? ([id])
    │ │
    │ ├── 401 Unauthorized
    │ │   └── AUTH ISSUE
    │ │  → Token missing/expired?
    │ │  → Session cookie not sent?
    │ │  → Middleware blocking?
    │ │
    │ ├── 403 Forbidden
    │ │   └── PERMISSION ISSUE
    │ │  → User doesn't have required role?
    │ │  → Resource belongs to different user?
    │ │
    │ ├── 400 Bad Request
    │ │   └── CLIENT SENDING BAD DATA
    │ │  → Check request body shape
    │ │  → Missing required fields?
    │ │  → Wrong data types?
    │ │
    │ └── CORS Error
    │ └── CORS MISCONFIGURATION
    │ → Add CORS headers to API
    │ → Check allowed origins
    │ → Handle OPTIONS preflight
    

---

## 🌳 DECISION TREE: DATABASE ERROR

    Database error / Query failing?
    │
    ├── Check error message
    │ │
    │ ├── "Can't reach database server"
    │ │   └── CONNECTION ISSUE
    │ │  → Is database running?
    │ │  → DATABASE_URL correct?
    │ │  → Firewall blocking?
    │ │  → In Docker? Use container name, not localhost
    │ │
    │ ├── "Foreign key constraint failed"
    │ │   └── REFERENTIAL INTEGRITY
    │ │  → Referenced record doesn't exist
    │ │  → Deleting record that's referenced
    │ │  → Check ID being passed
    │ │
    │ ├── "Unique constraint failed"
    │ │   └── DUPLICATE VALUE
    │ │  → Record with same unique field exists
    │ │  → Use upsert instead of create
    │ │  → Check for existing before creating
    │ │
    │ ├── "Column does not exist"
    │ │   └── SCHEMA MISMATCH
    │ │  → Run prisma migrate dev
    │ │  → Run prisma generate
    │ │  → Schema and DB out of sync
    │ │
    │ └── "Record not found"
    │ └── QUERY RETURNED NULL
    │ → ID doesn't exist in DB
    │ → Use findUnique with proper checks
    │ → Handle null case in code
    

---

## 🌳 DECISION TREE: BUILD FAILING

    Build failing / TypeScript errors / ESLint errors?
    │
    ├── TypeScript error
    │ │
    │ ├── "Property does not exist"
    │ │   └── TYPE MISMATCH
    │ │  → Object doesn't have that property
    │ │  → Check type definition
    │ │  → Use optional chaining: obj?.property
    │ │
    │ ├── "Argument of type X is not assignable"
    │ │   └── PASSING WRONG TYPE
    │ │  → Check function signature
    │ │  → Check what type is expected
    │ │  → Convert/transform the data
    │ │
    │ ├── "Cannot find module"
    │ │   └── IMPORT ISSUE
    │ │  → Package not installed?
    │ │  → Path alias not configured?
    │ │  → Typo in import path?
    │ │
    │ └── Other TS error
    │ └── Read error message carefully
    │ → Line number tells you where
    │ → Fix that specific issue
    │
    ├── ESLint error
    │ │
    │ ├── "React Hook useEffect has missing dependency"
    │ │   └── DEPENDENCY ARRAY INCOMPLETE
    │ │  → Add missing dependency
    │ │  → Or disable rule if intentional
    │ │
    │ ├── "'variable' is defined but never used"
    │ │   └── DEAD CODE
    │ │  → Remove unused variable
    │ │  → Or prefix with _ if intentional
    │ │
    │ └── Other lint error
    │ └── Follow ESLint suggestion
    │
    └── Build error
        │
    ├── "Module not found"
    │ └── npm install missing package
        │
    └── Memory/timeout error
    └── Increase Node memory or optimize build
    

---

## 📊 ROOT CAUSE MAPPING: SYMPTOM → CAUSE → FIX

## Component Not Rendering

| Symptom | Possible Causes | How to Test | Fix |
| --------- | ----------------- | ------------- | -----  |
| Component blank | Data is undefined | console.log(data) | Initialize state properly |
| Component blank | Error thrown in render | Check console | Add error boundary |
| Component blank | Conditional hiding it | Check condition | Fix condition logic |
| Component flashing | Re-rendering loop | React DevTools Profiler | Fix useEffect deps |

## API Returning Wrong Data

| Symptom | Possible Causes | How to Test | Fix |
| --------- | ----------------- | ------------- | -----  |
| Empty response | No data in DB | Check DB directly | Add seed data |
| Wrong shape | Query is wrong | console.log query result | Fix Prisma query |
| Old data | Caching issue | Clear cache, hard refresh | Disable/configure cache |
| Partial data | Not including relations | Check include in query | Add include: { relation: true } |

## Authentication Issues

| Symptom | Possible Causes | How to Test | Fix |
| --------- | ----------------- | ------------- | -----  |
| Login fails | Wrong credentials logic | Log password check | Fix comparison |
| Session lost | Cookie not persisting | Check Application tab | Fix cookie settings |
| Protected page accessible | Middleware bypassed | Check middleware matcher | Fix middleware config |
| Token expired | Short expiration | Check token exp claim | Increase expiration |

## ✅ SECTION C: VERIFICATION PROTOCOLS

## After EVERY fix, verify it actually works

---

## 🔄 POST-FIX VERIFICATION CHECKLIST

## After Fixing ANY Bug

    â-¡ THE FIX ITSELF
    â-¡ Does the original issue no longer occur?
    â-¡ Test the exact steps that caused the bug
    â-¡ Test with same data that caused the bug
    
    â-¡ REGRESSION CHECK
    â-¡ Related features still work?
    â-¡ Other pages/components not broken?
    â-¡ Tests still pass?
    
    â-¡ EDGE CASES
    â-¡ Works with empty data?
    â-¡ Works with maximum data?
    â-¡ Works with special characters?
    â-¡ Works when logged out (if relevant)?
    
    â-¡ MULTIPLE BROWSERS/DEVICES (if UI change)
    â-¡ Chrome works?
    â-¡ Firefox works?
    â-¡ Safari works?
    â-¡ Mobile works?
    

---

## 🎯 "IT WORKS" CRITERIA BY FEATURE TYPE

## For a Form

    ✓ All fields accept input
    ✓ Validation shows errors for invalid input
    ✓ Submit button is disabled during submission
    ✓ Success message shown after submit
    ✓ Error message shown if submit fails
    ✓ Form clears or redirects after success
    ✓ Works on mobile
    

## For an API Endpoint

    ✓ Returns correct data for valid request
    ✓ Returns 400 for invalid input
    ✓ Returns 401 for unauthorized request
    ✓ Returns 404 for non-existent resource
    ✓ Returns 500 message (not stack trace) for server error
    ✓ Response time is acceptable (<500ms)
    

## For Authentication

    ✓ Can register new account
    ✓ Can login with valid credentials
    ✓ Cannot login with invalid credentials
    ✓ Session persists on page refresh
    ✓ Logout actually logs out
    ✓ Protected pages redirect to login
    ✓ Public pages accessible without login
    

## For a List/Table

    ✓ Shows loading state while fetching
    ✓ Shows empty state when no data
    ✓ Shows data when available
    ✓ Pagination works (if applicable)
    ✓ Sorting works (if applicable)
    ✓ Filtering works (if applicable)
    ✓ Delete removes item (if applicable)
    

---

## 🗺️ SECTION D: DEPENDENCY MAPS

## How everything connects in Next.js + Prisma stack

---

## 📦 FULL STACK FLOW

    USER ACTION
        │
        â-¼
    ┌─────────────────────────────────────────────────────────────┐
    │ FRONTEND (Next.js Pages/Components)  │
    │ ├── React Components (app/page.tsx, components/)  │
    │ ├── Client State (useState, useContext, Zustand)  │
    │ ├── Server Components (fetch directly)  │
    │ └── Client Components ('use client', fetch via API)  │
    └─────────────────────────────────────────────────────────────┘
        │
    │ HTTP Request
        â-¼
    ┌─────────────────────────────────────────────────────────────┐
    │ MIDDLEWARE (middleware.ts)  │
    │ ├── Authentication check  │
    │ ├── Redirect logic  │
    │ └── Request modification  │
    └─────────────────────────────────────────────────────────────┘
        │
    │ If allowed
        â-¼
    ┌─────────────────────────────────────────────────────────────┐
    │ API ROUTES (app/api/*/route.ts)  │
    │ ├── Request validation (Zod)  │
    │ ├── Business logic  │
    │ ├── Database operations (Prisma)  │
    │ └── Response formatting  │
    └─────────────────────────────────────────────────────────────┘
        │
    │ Prisma Query
        â-¼
    ┌─────────────────────────────────────────────────────────────┐
    │ PRISMA CLIENT  │
    │ ├── Generated from schema.prisma  │
    │ ├── Type-safe queries  │
    │ └── Connection pooling  │
    └─────────────────────────────────────────────────────────────┘
        │
    │ SQL Query
        â-¼
    ┌─────────────────────────────────────────────────────────────┐
    │ DATABASE (PostgreSQL/MySQL/SQLite)  │
    │ ├── Tables from Prisma migrations  │
    │ ├── Relations defined in schema  │
    │ └── Indexes for performance  │
    └─────────────────────────────────────────────────────────────┘
    

---

## 🔗 FILE DEPENDENCY MAP

    When you change THIS  Also check THESE
    ──────────────────────────────────────────────────────────
    schema.prisma →  prisma/migrations/
    All API routes using those models
    TypeScript interfaces
    Frontend components displaying data
    
    middleware.ts →  All protected routes
    Login/logout redirects
    API route access
    
    app/api/auth/route.ts →  Frontend login/logout forms
    Session handling
    Protected route checks
    Middleware auth logic
    
    .env →  .env.example
    Vercel environment
    CI/CD secrets
    Any code reading those vars
    
    package.json →  package-lock.json (npm install)
    Vercel build
    CI/CD pipeline
    
    next.config.js →  Build output
    Image handling
            Redirects/rewrites
    External packages
    
    tailwind.config.js →  All components using those classes
    Custom color/spacing usage
    
    tsconfig.json →  Path aliases
    Build target
    Type checking strictness
    

---

## 🔄 DATA FLOW PATTERNS

## Reading Data (GET)

    Page loads → useEffect/Server Component → fetch('/api/...')
    → API route → prisma.model.findMany() → SQL SELECT
    → Returns data → useState/Component renders
    

## Creating Data (POST)

    Form submit → fetch('/api/...', { method: 'POST', body })
    → API route → Validate input → prisma.model.create()
    → SQL INSERT → Returns created → UI updates/redirects
    

## Updating Data (PUT/PATCH)

    Edit form submit → fetch('/api/.../[id]', { method: 'PUT', body })
    → API route → Validate → prisma.model.update({ where: { id } })
    → SQL UPDATE → Returns updated → UI updates
    

## Deleting Data (DELETE)

    Delete button → fetch('/api/.../[id]', { method: 'DELETE' })
    → API route → Auth check → prisma.model.delete({ where: { id } })
    → SQL DELETE → Success response → Remove from UI
    

---

## ⚠️ COMMON BREAK POINTS

    WHERE THINGS TYPICALLY BREAK:
    │
    ├── Frontend → API
    │ ├── Wrong URL (typo, wrong method)
    │ ├── Missing auth token/cookie
    │ ├── Wrong request body shape
    │ └── CORS issues
    │
    ├── API → Prisma
    │ ├── Wrong model name
    │ ├── Missing required fields
    │ ├── Wrong relation handling
    │ └── Type mismatches
    │
    ├── Prisma → Database
    │ ├── Connection string wrong
    │ ├── Schema out of sync
    │ ├── Missing migrations
    │ └── Constraint violations
    │
    └── Environment
    ├── Missing env variables
    ├── Wrong env for environment (dev vs prod)
    └── Secrets not set in deployment
    

---

### CONTINUED: MORE BRAIN ACTIVATION PATTERNS

### This is your VACCINE 🩺 + INJECTION 💉 system

### Both preventive AND reactive approaches
