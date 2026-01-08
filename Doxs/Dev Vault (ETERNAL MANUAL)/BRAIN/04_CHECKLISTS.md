# CHECKLISTS

## Table of Contents

- [Table of Contents](#table-of-contents)
- [SECTION A: VACCINE CHECKLISTS (Preventive)](#section-a-vaccine-checklists-preventive)
- [DEPLOYMENT MASTER CHECKLIST](#deployment-master-checklist)
- [Check EVERY Time Before Deploying](#check-every-time-before-deploying)
- [CUTTING CHANGE CHECKLISTS](#cutting-change-checklists)
- [When You CHANGE Authentication System](#when-you-change-authentication-system)
- [When You CHANGE Database Schema](#when-you-change-database-schema)
- [When You ADD New API Route](#when-you-add-new-api-route)
- [When You ADD New Page Route](#when-you-add-new-page-route)
- [When You CHANGE: Environment Variables](#when-you-change-environment-variables)
- [SPECIFIC CHECKLISTS](#specific-checklists)
- [Next.js 14 App Router Checklist](#nextjs-14-app-router-checklist)
- [Prisma ORM Checklist](#prisma-orm-checklist)
- [Tailwind CSS Checklist](#tailwind-css-checklist)
- [QUICK REFERENCE CHECKLISTS](#quick-reference-checklists)
- [Before EVERY Commit](#before-every-commit)
- [Before EVERY PR](#before-every-pr)
- [Before EVERY Release](#before-every-release)
- [SECTION B: INJECTION CHECKLISTS (Post-Fix)](#section-b-injection-checklists-post-fix)
- [FIX VERIFICATION CHECKLIST](#fix-verification-checklist)
- [After Fixing Any Bug](#after-fixing-any-bug)
- [CRITERIA](#criteria)
- [Form Works When](#form-works-when)
- [API Endpoint Works When](#api-endpoint-works-when)
- [Authentication Works When](#authentication-works-when)
- [List Table Works When](#list-table-works-when)
  - [This is your SAFETY NET](#this-is-your-safety-net)
  - [Never forget what else to check](#never-forget-what-else-to-check)
- [SPECIFIC CHECKLISTS 2](#specific-checklists-2)
- [E-Commerce Feature Checklists](#e-commerce-feature-checklists)
  - [Adding Payment Integration](#adding-payment-integration)
  - [Adding Shopping Cart](#adding-shopping-cart)
- [User Management Checklists](#user-management-checklists)
  - [Adding User Profile](#adding-user-profile)
  - [Adding User Roles Permissions](#adding-user-roles-permissions)
- [Notification Checklists](#notification-checklists)
  - [Adding Email Notifications](#adding-email-notifications)
  - [Adding Push Notifications](#adding-push-notifications)
- [File Upload Checklists](#file-upload-checklists)
  - [Adding File Image Upload](#adding-file-image-upload)
- [Search Feature Checklists](#search-feature-checklists)
  - [Adding Search Functionality](#adding-search-functionality)
- [SECURITY CHECKLISTS](#security-checklists)
- [Authentication Security Checklist](#authentication-security-checklist)
- [API Security Checklist](#api-security-checklist)
- [Frontend Security Checklist](#frontend-security-checklist)
- [Data Security Checklist](#data-security-checklist)
- [DEPLOYMENT CHECKLISTS](#deployment-checklists)
- [Vercel Deployment Checklist](#vercel-deployment-checklist)
- [Docker Deployment Checklist](#docker-deployment-checklist)
- [CI CD Pipeline Checklist](#ci-cd-pipeline-checklist)
  - [[TARGET: 10,000 LINES OF CHECKLISTS]](#target-10000-lines-of-checklists)
  - [Current: ~700 lines - Expanding systematically](#current-700-lines---expanding-systematically)
  - [Coverage: E-commerce, User Management, Notifications, Files, Search, Security, Deployment](#coverage-e-commerce-user-management-notifications-files-search-security-deployment)
  - [This is your COMPREHENSIVE SAFETY NET](#this-is-your-comprehensive-safety-net)
  - [VACCINE for prevention, INJECTION for fixing](#vaccine-for-prevention-injection-for-fixing)
  - [Never forget what else to check 2](#never-forget-what-else-to-check-2)
- [PRODUCTION CHECKLISTS](#production-checklists)
- [Pre-Deploy Checklist](#pre-deploy-checklist)
- [New Service Checklist](#new-service-checklist)
- [Security Review Checklist](#security-review-checklist)
- [Post-Incident Checklist](#post-incident-checklist)
- [API SECURITY CHECKLIST 2](#api-security-checklist-2)
- [Authentication Checklist](#authentication-checklist)
- [JWT Checklist](#jwt-checklist)
- [Input Validation Checklist](#input-validation-checklist)
- [DATABASE MIGRATION CHECKLIST](#database-migration-checklist)
- [Pre-Migration](#pre-migration)
- [During Migration](#during-migration)
- [Safe Migration Patterns](#safe-migration-patterns)
- [Post-Migration](#post-migration)
- [CODE REVIEW CHECKLIST](#code-review-checklist)
- [Functionality](#functionality)
- [Security](#security)
- [Performance](#performance)
- [Maintainability](#maintainability)
- [Common Issues](#common-issues)
- [API SECURITY CHECKLIST 2 2](#api-security-checklist-2-2)

## SECTION A: VACCINE CHECKLISTS (Preventive)

---

## DEPLOYMENT MASTER CHECKLIST

## Check EVERY Time Before Deploying

ENVIRONMENT VARIABLES
All required vars set in production
DATABASE_URL is production URL
API keys are production (not test/dev)
Secrets are strong and unique
No localhost anywhere

    DATABASE
prisma migrate status shows no pending
Database is accessible
Connection pooling configured (if serverless)
Seed data applied (if needed)

    AUTHENTICATION
Auth secrets set and secure
Cookie settings correct (secure, httpOnly)
CORS origins include production domain
Session expiration configured

    BUILD
npm run build succeeds locally
No TypeScript errors
No ESLint errors/warnings
Bundle size acceptable

    TESTING
All tests pass
Critical flows tested manually
Mobile responsive verified
Forms submit correctly
Error states display properly

    SECURITY
No sensitive data in console.log
No API keys in frontend code
Rate limiting configured
Input validation on all endpoints

## CUTTING CHANGE CHECKLISTS

## When You CHANGE Authentication System

CHANGED AUTH? ALSO UPDATE:

    Frontend
Login component/page
Logout functionality
Auth context/provider
Protected route wrapper
Token/session storage logic

    Backend
Auth API routes
Middleware (middleware.ts)
Protected API routes
Session configuration

    Configuration
Environment variables
CORS settings
Cookie settings

    Tests
Auth flow tests
Protected route tests
Mock auth in other tests

    Documentation
Auth flow documented
ENV example updated

## When You CHANGE Database Schema

```text
CHANGED SCHEMA? ALSO UPDATE:

Prisma
Run: npx prisma migrate dev
Run: npx prisma generate
Update seed file if needed

TypeScript
Update/create DTO types
Update API response types
Update frontend interfaces

API Routes
Update create/update logic
Update select/include queries
Update validation schemas
Update response shapes

Frontend
Update forms
Update display components
Update type definitions

Tests
Update test fixtures
Update mock data
Add tests for new fields

```text

## When You ADD New API Route

```text
NEW API ROUTE? ENSURE IT HAS:

Request Handling
Correct HTTP method exported (GET, POST, etc.)
Input validation (Zod schema)
Request body parsing
Query parameter handling

Security
Authentication check (if protected)
Authorization check (if role-based)
Rate limiting (if public)
Input sanitization

Error Handling
Try-catch wrapper
Proper error responses
No stack traces in production
Logging for debugging

Response
Correct status codes
Consistent response shape
TypeScript types

Connected Updates
Frontend API function
Types for request/response
Tests for the endpoint

```text

## When You ADD New Page Route

NEW PAGE? ENSURE IT HAS:

    SEO
Title tag (metadata)
Meta description
OpenGraph tags (if shared)

    UX
Loading state
Error state
Empty state
Mobile responsive
Keyboard navigation

Error Handling
Error boundary
Try-catch for data fetching
Graceful degradation

    Security
Auth check (if protected)
Redirect for unauthorized

    Navigation
Link added to nav/menu
Breadcrumbs updated
Back navigation works

    Testing
Unit tests
E2E tests for critical paths

## When You CHANGE: Environment Variables

```text
CHANGED ENV VARS? ALSO UPDATE:

Documentation
.env.example updated
README updated

Deployment
Vercel/hosting dashboard
CI/CD secrets
Docker/container config

Local Dev
Team notified
.env.local on all machines

Validation
Runtime check for required vars
Type definitions for env

```text

## SPECIFIC CHECKLISTS

---

## Next.js 14 App Router Checklist

```text
FILE STRUCTURE
Apps in app/ directory
API routes in app/api/
Components in components/
Layout.tsx at root

ROUTING
page.tsx for each route
layout.tsx for shared layouts
loading.tsx for suspense
error.tsx for error handling
not-found.tsx for 404

DATA FETCHING
Server Components for static data
'use client' for interactive
Proper caching strategy
Revalidation configured

MIDDLEWARE
matcher configured correctly
Not matching static files
Auth logic working

```text

## Prisma ORM Checklist

```text
SCHEMA
All models have @id
Relations properly defined
Indexes on frequently queried fields
Enums for fixed values

CLIENT
npx prisma generate ran
Single client instance
Connection pooling (if needed)

MIGRATIONS
Migration files committed
No pending migrations
Production migrations applied

QUERIES
Using select to limit fields
Using include carefully
Transactions for multi-step
Error handling

```text

## Tailwind CSS Checklist

```text
CONFIGURATION
tailwind.config.js correct
Content paths include all files
Custom colors/fonts defined
Dark mode configured (if using)

USAGE
Responsive prefixes (sm:, md:, lg:)
Consistent spacing scale
Design tokens used
No conflicting styles

BUILD
PostCSS configured
Purging working (small bundle)
No unused styles

```text

## QUICK REFERENCE CHECKLISTS

## Before EVERY Commit

```bash
npm run lint    # No errors?
npm run build   # Builds?
npm run test    # Tests pass?
git diff  # Review changes

```text

## Before EVERY PR

```text
All commits atomic and meaningful
No console.log left behind
No TODO that blocks merge
Tests added for new code
Documentation updated
Self-reviewed the diff

```text

## Before EVERY Release

```text
All features complete
All bugs fixed
Performance acceptable
Security reviewed
Monitoring in place
Rollback plan ready

```text

## SECTION B: INJECTION CHECKLISTS (Post-Fix)

---

## FIX VERIFICATION CHECKLIST

## After Fixing Any Bug

```text
IMMEDIATE VERIFICATION
Original issue no longer occurs
Same steps that caused bug now work
Same data that caused bug now works

REGRESSION CHECK
Run all tests
Manually test related features
Check nothing else broke

EDGE CASES
Empty data
Maximum data
Special characters
Different user roles
Different browsers (if UI)

```text

## CRITERIA

## Form Works When

```text
All fields accept input
Validation shows errors correctly
Submit button state changes during submit
Success message appears
Error message appears if fails
Form resets or redirects after success
Works on mobile

```text

## API Endpoint Works When

```text
Returns correct data for valid request
Returns 400 for invalid input
Returns 401 for unauthenticated
Returns 403 for unauthorized
Returns 404 for not found
Returns user-friendly 500 error
Response time < 500ms

```text

## Authentication Works When

```text
Can register new account
Can login with valid credentials
Cannot login with invalid credentials
Session persists on refresh
Can logout
Protected pages redirect when not logged in
Token refresh works (if applicable)

```text

## List Table Works When

```text
Shows loading initially
Shows empty state when no data
Shows data correctly
Pagination works (if applicable)
Sorting works (if applicable)
Search/filter works (if applicable)
Actions (edit, delete) work

```text

### This is your SAFETY NET

### Never forget what else to check

---

## SPECIFIC CHECKLISTS 2

## E-Commerce Feature Checklists

### Adding Payment Integration

```text
STRIPE SETUP
Stripe account created
API keys in environment
Webhook endpoint created
Webhook secret in environment
Test mode enabled for dev

BACKEND
Payment intent creation route
Webhook handler for events
Order status update on success
Email confirmation trigger
Refund handling

FRONTEND
Stripe Elements integrated
Card validation
Loading state during payment
Success/error handling
Receipt/confirmation page

SECURITY
No card data stored locally
HTTPS only
Webhook signature verification
Idempotency keys used
PCI compliance reviewed

TESTING
Test card numbers work
Declined cards handled
3D Secure flow tested
Webhook replay tested
Refund flow tested

```text

### Adding Shopping Cart

```text
DATA MODEL
Cart storage (local/server)
Cart item structure
Price calculation logic
Inventory check

FRONTEND
Add to cart button
Cart icon with count
Cart sidebar/modal
Quantity controls
Remove item
Empty cart state
Persisted across sessions

CHECKOUT FLOW
Cart summary
Shipping options
Tax calculation
Discount codes
Order review
Payment step

EDGE CASES
Out of stock handling
Price change during session
Session expiry
Maximum quantity limits

```text

## User Management Checklists

### Adding User Profile

```text
DATA MODEL
Profile schema (name, avatar, bio)
Relation to User model
Optional vs required fields

BACKEND
GET profile route
UPDATE profile route
Avatar upload endpoint
Input validation

FRONTEND
Profile display page
Edit profile form
Avatar upload component
Loading states
Validation feedback

FEATURES
Change password
Change email (with verification)
Delete account
Export data (GDPR)

```text

### Adding User Roles Permissions

```text
DATA MODEL
Role enum in schema
Default role for new users
Permission matrix defined

BACKEND
Role check middleware
Permission check utilities
Admin routes protected
Audit logging for admin actions

FRONTEND
Role-based UI visibility
Admin dashboard (if admin)
Forbidden page

TESTING
Each role tested
Privilege escalation tested
Permission boundaries verified

```text

## Notification Checklists

### Adding Email Notifications

```text
PROVIDER SETUP
Email service (Resend, SendGrid, etc.)
API keys in environment
Sender domain verified
Template system chosen

BACKEND
Email utility function
Template rendering
Queue for async sending
Retry logic for failures
Unsubscribe handling

EMAILS TO IMPLEMENT
Welcome email
Password reset
Email verification
Order confirmation
Notification digests

TESTING
Dev mode sends to test address
Template rendering tested
Link generation correct
Unsubscribe works

COMPLIANCE
CAN-SPAM compliance
Unsubscribe link in all
Physical address included
Sender name clear

```text

### Adding Push Notifications

```text
SETUP
Web push or mobile push
Service worker for web
VAPID keys generated
Push permission UI

BACKEND
Subscription storage
Push sending utility
Batch sending for scale
Retry on failure

FRONTEND
Permission request
Subscription management
Notification preferences
In-app notification center

TESTING
Different browsers
Offline delivery
Click tracking

```text

## File Upload Checklists

### Adding File Image Upload

STORAGE SETUP
Storage provider (S3, Cloudinary, etc.)
Credentials in environment
Bucket/folder structure
CORS configured

    BACKEND
Upload endpoint
File type validation
File size limits
Virus scanning (if needed)
Presigned URLs (if direct upload)

    FRONTEND
File input component
Drag and drop
Preview before upload
Upload progress
Error handling
File type restrictions

    IMAGE-SPECIFIC
Resize on upload
Multiple sizes generated
Lazy loading
      Placeholder/blur

    SECURITY
No executable uploads
Content-Type validation
Authenticated uploads
Private bucket settings

## Search Feature Checklists

### Adding Search Functionality

SEARCH BACKEND
Search method chosen (DB, Elasticsearch, Algolia)
Indexing strategy
Full-text search enabled
Relevance tuning

    API
Search endpoint
      Pagination
      Filters
Sorting options
Debounced requests

    FRONTEND
Search input
      Autocomplete/suggestions
Results display
Loading state
No results state
Pagination controls

    PERFORMANCE
Index created on search fields
Response time < 200ms
Caching for common queries
Rate limiting

## SECURITY CHECKLISTS

---

## Authentication Security Checklist

```text
PASSWORD HANDLING
Hashing with bcrypt/argon2
Salt is unique per password
Never log passwords
Min length requirement (12+)
Common password check
Rate limiting on login

SESSION MANAGEMENT
Secure, httpOnly cookies
SameSite attribute set
Session expiration
Logout invalidates session
Session regeneration on login

TOKEN SECURITY
Short expiration
Refresh token rotation
Token revocation capability
No sensitive data in token

ACCOUNT SECURITY
Email verification required
Password reset secure
Reset tokens expire quickly
Account lockout after attempts
Security questions (optional)
2FA option available

```text

## API Security Checklist

```text
INPUT VALIDATION
All inputs validated
Type checking
Length limits
Format validation
SQL injection prevented (ORM)
XSS prevented (encoding)

AUTHENTICATION
Auth on all protected routes
Token validation on every request
No auth bypass possible
API key rotation plan

AUTHORIZATION
Resource ownership verified
Role checks implemented
No IDOR vulnerabilities
Least privilege principle

RATE LIMITING
Rate limiting enabled
Different limits per endpoint
IP-based + user-based
Graceful degradation

RESPONSE SECURITY
No stack traces in production
No sensitive data leaked
Proper error messages
Security headers set

```text

## Frontend Security Checklist

```text
XSS PREVENTION
User input escaped
dangerouslySetInnerHTML NOT used
CSP headers configured
No inline scripts

CSRF PREVENTION
CSRF tokens used (if cookies)
SameSite cookie attribute
Origin/Referer validation

SENSITIVE DATA
No secrets in frontend
API keys not exposed
No sensitive data in localStorage
Console.log cleaned

DEPENDENCIES
npm audit clean
No vulnerable packages
Lock file committed
Regular updates scheduled

```text

## Data Security Checklist

```text
IN TRANSIT
HTTPS everywhere
HSTS header set
TLS 1.2+ only
No mixed content

AT REST
Sensitive data encrypted
Encryption keys rotated
PII minimized
Data classified

BACKUP & RECOVERY
Backups automated
Backups encrypted
Restore tested
Recovery time objective set

COMPLIANCE
GDPR data export
Right to deletion
Data retention policy
Privacy policy updated

```text

## DEPLOYMENT CHECKLISTS

---

## Vercel Deployment Checklist

```text
PROJECT SETUP
Git repository connected
Build command correct
Output directory correct
Root directory correct

ENVIRONMENT
All env vars set
Production values (not dev)
Database URL points to prod
Secrets properly set

DOMAIN
Domain added
DNS configured
SSL certificate active
Redirects configured

OPTIMIZATION
Edge functions enabled
Image optimization on
ISR configured
Analytics enabled

MONITORING
Function logs accessible
Error tracking (Sentry)
Performance monitoring
Usage alerts set

```text

## Docker Deployment Checklist

```text
DOCKERFILE
Multi-stage build
Minimal base image
Non-root user
.dockerignore in place
Health check defined

COMPOSE
All services defined
Network configured
Volumes for persistence
Environment variables
Restart policies

SECURITY
No secrets in image
Images scanned
Tags pinned
Registry authenticated

PRODUCTION
Resource limits set
Logging configured
Monitoring enabled
Rollback plan ready

```text

## CI CD Pipeline Checklist

```text
BUILD STAGE
Dependencies cached
Lint runs
Type check runs
Tests run
Build succeeds

TEST STAGE
Unit tests pass
Integration tests pass
E2E tests pass
Coverage threshold met

SECURITY STAGE
Dependency audit
Secret scanning
SAST tools run

DEPLOY STAGE
Environment selected
Migrations run
Health check passes
Notifications sent

POST-DEPLOY
Smoke tests run
Monitoring verified
Rollback ready

```text

### [TARGET: 10,000 LINES OF CHECKLISTS]

### Current: ~700 lines - Expanding systematically

### Coverage: E-commerce, User Management, Notifications, Files, Search, Security, Deployment

---

### This is your COMPREHENSIVE SAFETY NET

### VACCINE for prevention, INJECTION for fixing

### Never forget what else to check 2

---

## PRODUCTION CHECKLISTS

> **Never miss critical steps**

---

## Pre-Deploy Checklist

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

## New Service Checklist

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

## Security Review Checklist

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

## Post-Incident Checklist

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

## API SECURITY CHECKLIST 2

> **Comprehensive API security review**

## Authentication Checklist

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

## JWT Checklist

```text
[ ] Algorithm explicitly specified
[ ] Short expiration time (15 min)
[ ] Refresh token rotation implemented
[ ] Signature validation working
[ ] Claims validated (iss, aud, exp)
[ ] Token invalidation possible
[ ] Sensitive data not in payload

```text

## Input Validation Checklist

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

## DATABASE MIGRATION CHECKLIST

> **Safe migration execution**

---

## Pre-Migration

```text
[ ] Tested on staging with production-like data
[ ] Backup taken
[ ] Rollback script ready
[ ] Off-peak timing planned
[ ] Team notified
[ ] Monitoring ready

```text

## During Migration

```text
[ ] Watch for lock wait timeouts
[ ] Monitor query performance
[ ] Check replication lag
[ ] Watch disk usage
[ ] Monitor connection count

```text

## Safe Migration Patterns

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

## Post-Migration

```text
[ ] Verify data integrity
[ ] Run smoke tests
[ ] Check query performance
[ ] Confirm no errors in logs
[ ] Update team

```text

---

## CODE REVIEW CHECKLIST

> **The review patterns that catch bugs**

---

## Functionality

```text
[ ] Does the code do what its supposed to?
[ ] Edge cases handled?
[ ] Error handling in place?
[ ] Happy path works?
[ ] Unhappy path works?

```text

## Security

```text
[ ] Input validated?
[ ] SQL injection prevented?
[ ] XSS prevented?
[ ] Authorization checked?
[ ] Secrets not exposed?
[ ] Rate limiting in place?

```text

## Performance

```text
[ ] N+1 queries avoided?
[ ] Large data paginated?
[ ] Unnecessary computation avoided?
[ ] Caching considered?
[ ] Indexes used properly?

```text

## Maintainability

```text
[ ] Code readable?
[ ] Functions small and focused?
[ ] Names descriptive?
[ ] Complex logic commented?
[ ] Tests included?
[ ] Documentation updated?

```text

## Common Issues

```text
[ ] No console.logs left
[ ] No debug code
[ ] No TODO without issue link
[ ] No sensitive data in logs
[ ] Lock file updated
[ ] Migration reversible

```text

## API SECURITY CHECKLIST 2 2

> **Comprehensive API security review**

---
