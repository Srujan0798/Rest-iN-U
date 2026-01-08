# ✅ CHECKLISTS

## Table of Contents

- [Table of Contents](#table-of-contents)
- [🩺 SECTION A: VACCINE CHECKLISTS (Preventive)](#-section-a-vaccine-checklists-preventive)
- [🚀 PRE-DEPLOYMENT MASTER CHECKLIST](#-pre-deployment-master-checklist)
- [Check EVERY Time Before Deploying](#check-every-time-before-deploying)
- [🔄 CROSS-CUTTING CHANGE CHECKLISTS](#-cross-cutting-change-checklists)
- [When You CHANGE Authentication System](#when-you-change-authentication-system)
- [When You CHANGE Database Schema](#when-you-change-database-schema)
- [When You ADD New API Route](#when-you-add-new-api-route)
- [When You ADD New Page Route](#when-you-add-new-page-route)
- [When You CHANGE: Environment Variables](#when-you-change-environment-variables)
- [🏗️ STACK-SPECIFIC CHECKLISTS](#-stack-specific-checklists)
- [Next.js 14 App Router Checklist](#nextjs-14-app-router-checklist)
- [Prisma ORM Checklist](#prisma-orm-checklist)
- [Tailwind CSS Checklist](#tailwind-css-checklist)
- [âš¡ QUICK REFERENCE CHECKLISTS](#âš-quick-reference-checklists)
- [Before EVERY Commit](#before-every-commit)
- [Before EVERY PR](#before-every-pr)
- [Before EVERY Release](#before-every-release)
- [💉 SECTION B: INJECTION CHECKLISTS (Post-Fix)](#-section-b-injection-checklists-post-fix)
- [🔄 POST-FIX VERIFICATION CHECKLIST](#-post-fix-verification-checklist)
- [After Fixing Any Bug](#after-fixing-any-bug)
- [✅ "IT WORKS" CRITERIA](#-it-works-criteria)
- [Form Works When](#form-works-when)
- [API Endpoint Works When](#api-endpoint-works-when)
- [Authentication Works When](#authentication-works-when)
- [List Table Works When](#list-table-works-when)
  - [This is your SAFETY NET ✅](#this-is-your-safety-net-)
  - [Never forget what else to check](#never-forget-what-else-to-check)
- [🔧 SECTION C: FEATURE-SPECIFIC CHECKLISTS](#-section-c-feature-specific-checklists)
- [🛒 E-Commerce Feature Checklists](#-e-commerce-feature-checklists)
  - [Adding Payment Integration](#adding-payment-integration)
  - [Adding Shopping Cart](#adding-shopping-cart)
- [👤 User Management Checklists](#-user-management-checklists)
  - [Adding User Profile](#adding-user-profile)
  - [Adding User Roles Permissions](#adding-user-roles-permissions)
- [📧 Notification Checklists](#-notification-checklists)
  - [Adding Email Notifications](#adding-email-notifications)
  - [Adding Push Notifications](#adding-push-notifications)
- [📁 File Upload Checklists](#-file-upload-checklists)
  - [Adding File Image Upload](#adding-file-image-upload)
- [🔍 Search Feature Checklists](#-search-feature-checklists)
  - [Adding Search Functionality](#adding-search-functionality)
- [🔐 SECTION D: SECURITY CHECKLISTS](#-section-d-security-checklists)
- [🔐 Authentication Security Checklist](#-authentication-security-checklist)
- [🛡️ API Security Checklist](#-api-security-checklist)
- [🌐 Frontend Security Checklist](#-frontend-security-checklist)
- [📊 Data Security Checklist](#-data-security-checklist)
- [🚀 SECTION E: DEPLOYMENT CHECKLISTS](#-section-e-deployment-checklists)
- [📦 Vercel Deployment Checklist](#-vercel-deployment-checklist)
- [🐳 Docker Deployment Checklist](#-docker-deployment-checklist)
- [⚙️ CI CD Pipeline Checklist](#-ci-cd-pipeline-checklist)
  - [[TARGET: 10,000 LINES OF CHECKLISTS]](#target-10000-lines-of-checklists)
  - [Current: ~700 lines - Expanding systematically](#current-700-lines---expanding-systematically)
  - [Coverage: E-commerce, User Management, Notifications, Files, Search, Security, Deployment](#coverage-e-commerce-user-management-notifications-files-search-security-deployment)
  - [This is your COMPREHENSIVE SAFETY NET ✅](#this-is-your-comprehensive-safety-net-)
  - [VACCINE for prevention, INJECTION for fixing](#vaccine-for-prevention-injection-for-fixing)
  - [Never forget what else to check 2](#never-forget-what-else-to-check-2)
- [✅ PRODUCTION CHECKLISTS](#-production-checklists)
- [Pre-Deploy Checklist](#pre-deploy-checklist)
- [New Service Checklist](#new-service-checklist)
- [Security Review Checklist](#security-review-checklist)
- [Post-Incident Checklist](#post-incident-checklist)
- [✅ API SECURITY CHECKLIST 2](#-api-security-checklist-2)
- [Authentication Checklist](#authentication-checklist)
- [JWT Checklist](#jwt-checklist)
- [Input Validation Checklist](#input-validation-checklist)
- [✅ DATABASE MIGRATION CHECKLIST](#-database-migration-checklist)
- [Pre-Migration](#pre-migration)
- [During Migration](#during-migration)
- [Safe Migration Patterns](#safe-migration-patterns)
- [Post-Migration](#post-migration)
- [✅ CODE REVIEW CHECKLIST](#-code-review-checklist)
- [Functionality](#functionality)
- [Security](#security)
- [Performance](#performance)
- [Maintainability](#maintainability)
- [Common Issues](#common-issues)

## 🩺 SECTION A: VACCINE CHECKLISTS (Preventive)

---

## 🚀 PRE-DEPLOYMENT MASTER CHECKLIST

## Check EVERY Time Before Deploying

    â-¡ ENVIRONMENT VARIABLES
    â-¡ All required vars set in production
    â-¡ DATABASE_URL is production URL
    â-¡ API keys are production (not test/dev)
    â-¡ Secrets are strong and unique
    â-¡ No localhost anywhere
    
    â-¡ DATABASE
    â-¡ prisma migrate status shows no pending
    â-¡ Database is accessible
    â-¡ Connection pooling configured (if serverless)
    â-¡ Seed data applied (if needed)
    
    â-¡ AUTHENTICATION
    â-¡ Auth secrets set and secure
    â-¡ Cookie settings correct (secure, httpOnly)
    â-¡ CORS origins include production domain
    â-¡ Session expiration configured
    
    â-¡ BUILD
    â-¡ npm run build succeeds locally
    â-¡ No TypeScript errors
    â-¡ No ESLint errors/warnings
    â-¡ Bundle size acceptable
    
    â-¡ TESTING
    â-¡ All tests pass
    â-¡ Critical flows tested manually
    â-¡ Mobile responsive verified
    â-¡ Forms submit correctly
    â-¡ Error states display properly
    
    â-¡ SECURITY
    â-¡ No sensitive data in console.log
    â-¡ No API keys in frontend code
    â-¡ Rate limiting configured
    â-¡ Input validation on all endpoints
    

## 🔄 CROSS-CUTTING CHANGE CHECKLISTS

## When You CHANGE Authentication System

    CHANGED AUTH? ALSO UPDATE:
    
    â-¡ Frontend
    â-¡ Login component/page
    â-¡ Logout functionality
    â-¡ Auth context/provider
    â-¡ Protected route wrapper
    â-¡ Token/session storage logic
    
    â-¡ Backend
    â-¡ Auth API routes
    â-¡ Middleware (middleware.ts)
    â-¡ Protected API routes
    â-¡ Session configuration
    
    â-¡ Configuration
    â-¡ Environment variables
    â-¡ CORS settings
    â-¡ Cookie settings
    
    â-¡ Tests
    â-¡ Auth flow tests
    â-¡ Protected route tests
    â-¡ Mock auth in other tests
    
    â-¡ Documentation
    â-¡ Auth flow documented
    â-¡ ENV example updated
    

## When You CHANGE Database Schema

    CHANGED SCHEMA? ALSO UPDATE:
    
    â-¡ Prisma
    â-¡ Run: npx prisma migrate dev
    â-¡ Run: npx prisma generate
    â-¡ Update seed file if needed
    
    â-¡ TypeScript
    â-¡ Update/create DTO types
    â-¡ Update API response types
    â-¡ Update frontend interfaces
    
    â-¡ API Routes
    â-¡ Update create/update logic
    â-¡ Update select/include queries
    â-¡ Update validation schemas
    â-¡ Update response shapes
    
    â-¡ Frontend
    â-¡ Update forms
    â-¡ Update display components
    â-¡ Update type definitions
    
    â-¡ Tests
    â-¡ Update test fixtures
    â-¡ Update mock data
    â-¡ Add tests for new fields
    

## When You ADD New API Route

    NEW API ROUTE? ENSURE IT HAS:
    
    â-¡ Request Handling
    â-¡ Correct HTTP method exported (GET, POST, etc.)
    â-¡ Input validation (Zod schema)
    â-¡ Request body parsing
    â-¡ Query parameter handling
    
    â-¡ Security
    â-¡ Authentication check (if protected)
    â-¡ Authorization check (if role-based)
    â-¡ Rate limiting (if public)
    â-¡ Input sanitization
    
    â-¡ Error Handling
    â-¡ Try-catch wrapper
    â-¡ Proper error responses
    â-¡ No stack traces in production
    â-¡ Logging for debugging
    
    â-¡ Response
    â-¡ Correct status codes
    â-¡ Consistent response shape
    â-¡ TypeScript types
    
    â-¡ Connected Updates
    â-¡ Frontend API function
    â-¡ Types for request/response
    â-¡ Tests for the endpoint
    

## When You ADD New Page Route

    NEW PAGE? ENSURE IT HAS:
    
    â-¡ SEO
    â-¡ Title tag (metadata)
    â-¡ Meta description
    â-¡ OpenGraph tags (if shared)
    
    â-¡ UX
    â-¡ Loading state
    â-¡ Error state
    â-¡ Empty state
    â-¡ Mobile responsive
    â-¡ Keyboard navigation
    
    â-¡ Error Handling
    â-¡ Error boundary
    â-¡ Try-catch for data fetching
    â-¡ Graceful degradation
    
    â-¡ Security
    â-¡ Auth check (if protected)
    â-¡ Redirect for unauthorized
    
    â-¡ Navigation
    â-¡ Link added to nav/menu
    â-¡ Breadcrumbs updated
    â-¡ Back navigation works
    
    â-¡ Testing
    â-¡ Unit tests
    â-¡ E2E tests for critical paths
    

## When You CHANGE: Environment Variables

    CHANGED ENV VARS? ALSO UPDATE:
    
    â-¡ Documentation
    â-¡ .env.example updated
    â-¡ README updated
    
    â-¡ Deployment
    â-¡ Vercel/hosting dashboard
    â-¡ CI/CD secrets
    â-¡ Docker/container config
    
    â-¡ Local Dev
    â-¡ Team notified
    â-¡ .env.local on all machines
    
    â-¡ Validation
    â-¡ Runtime check for required vars
    â-¡ Type definitions for env
    

## 🏗️ STACK-SPECIFIC CHECKLISTS

## Next.js 14 App Router Checklist

    â-¡ FILE STRUCTURE
    â-¡ Apps in app/ directory
    â-¡ API routes in app/api/
    â-¡ Components in components/
    â-¡ Layout.tsx at root
    
    â-¡ ROUTING
    â-¡ page.tsx for each route
    â-¡ layout.tsx for shared layouts
    â-¡ loading.tsx for suspense
    â-¡ error.tsx for error handling
    â-¡ not-found.tsx for 404
    
    â-¡ DATA FETCHING
    â-¡ Server Components for static data
    â-¡ 'use client' for interactive
    â-¡ Proper caching strategy
    â-¡ Revalidation configured
    
    â-¡ MIDDLEWARE
    â-¡ matcher configured correctly
    â-¡ Not matching static files
    â-¡ Auth logic working
    

## Prisma ORM Checklist

    â-¡ SCHEMA
    â-¡ All models have @id
    â-¡ Relations properly defined
    â-¡ Indexes on frequently queried fields
    â-¡ Enums for fixed values
    
    â-¡ CLIENT
    â-¡ npx prisma generate ran
    â-¡ Single client instance
    â-¡ Connection pooling (if needed)
    
    â-¡ MIGRATIONS
    â-¡ Migration files committed
    â-¡ No pending migrations
    â-¡ Production migrations applied
    
    â-¡ QUERIES
    â-¡ Using select to limit fields
    â-¡ Using include carefully
    â-¡ Transactions for multi-step
    â-¡ Error handling
    

## Tailwind CSS Checklist

    â-¡ CONFIGURATION
    â-¡ tailwind.config.js correct
    â-¡ Content paths include all files
    â-¡ Custom colors/fonts defined
    â-¡ Dark mode configured (if using)
    
    â-¡ USAGE
    â-¡ Responsive prefixes (sm:, md:, lg:)
    â-¡ Consistent spacing scale
    â-¡ Design tokens used
    â-¡ No conflicting styles
    
    â-¡ BUILD
    â-¡ PostCSS configured
    â-¡ Purging working (small bundle)
    â-¡ No unused styles
    

## âš¡ QUICK REFERENCE CHECKLISTS

## Before EVERY Commit

    â-¡ npm run lint    # No errors?
    â-¡ npm run build   # Builds?
    â-¡ npm run test    # Tests pass?
    â-¡ git diff  # Review changes
    

## Before EVERY PR

    â-¡ All commits atomic and meaningful
    â-¡ No console.log left behind
    â-¡ No TODO that blocks merge
    â-¡ Tests added for new code
    â-¡ Documentation updated
    â-¡ Self-reviewed the diff
    

## Before EVERY Release

    â-¡ All features complete
    â-¡ All bugs fixed
    â-¡ Performance acceptable
    â-¡ Security reviewed
    â-¡ Monitoring in place
    â-¡ Rollback plan ready
    

## 💉 SECTION B: INJECTION CHECKLISTS (Post-Fix)

---

## 🔄 POST-FIX VERIFICATION CHECKLIST

## After Fixing Any Bug

    â-¡ IMMEDIATE VERIFICATION
    â-¡ Original issue no longer occurs
    â-¡ Same steps that caused bug now work
    â-¡ Same data that caused bug now works
    
    â-¡ REGRESSION CHECK
    â-¡ Run all tests
    â-¡ Manually test related features
    â-¡ Check nothing else broke
    
    â-¡ EDGE CASES
    â-¡ Empty data
    â-¡ Maximum data
    â-¡ Special characters
    â-¡ Different user roles
    â-¡ Different browsers (if UI)
    

## ✅ "IT WORKS" CRITERIA

## Form Works When

    â-¡ All fields accept input
    â-¡ Validation shows errors correctly
    â-¡ Submit button state changes during submit
    â-¡ Success message appears
    â-¡ Error message appears if fails
    â-¡ Form resets or redirects after success
    â-¡ Works on mobile
    

## API Endpoint Works When

    â-¡ Returns correct data for valid request
    â-¡ Returns 400 for invalid input
    â-¡ Returns 401 for unauthenticated
    â-¡ Returns 403 for unauthorized
    â-¡ Returns 404 for not found
    â-¡ Returns user-friendly 500 error
    â-¡ Response time < 500ms
    

## Authentication Works When

    â-¡ Can register new account
    â-¡ Can login with valid credentials
    â-¡ Cannot login with invalid credentials
    â-¡ Session persists on refresh
    â-¡ Can logout
    â-¡ Protected pages redirect when not logged in
    â-¡ Token refresh works (if applicable)
    

## List Table Works When

    â-¡ Shows loading initially
    â-¡ Shows empty state when no data
    â-¡ Shows data correctly
    â-¡ Pagination works (if applicable)
    â-¡ Sorting works (if applicable)
    â-¡ Search/filter works (if applicable)
    â-¡ Actions (edit, delete) work
    

### This is your SAFETY NET ✅

### Never forget what else to check

---

## 🔧 SECTION C: FEATURE-SPECIFIC CHECKLISTS

---

## 🛒 E-Commerce Feature Checklists

### Adding Payment Integration

    â-¡ STRIPE SETUP
    â-¡ Stripe account created
    â-¡ API keys in environment
    â-¡ Webhook endpoint created
    â-¡ Webhook secret in environment
    â-¡ Test mode enabled for dev
    
    â-¡ BACKEND
    â-¡ Payment intent creation route
    â-¡ Webhook handler for events
    â-¡ Order status update on success
    â-¡ Email confirmation trigger
    â-¡ Refund handling
    
    â-¡ FRONTEND
    â-¡ Stripe Elements integrated
    â-¡ Card validation
    â-¡ Loading state during payment
    â-¡ Success/error handling
    â-¡ Receipt/confirmation page
    
    â-¡ SECURITY
    â-¡ No card data stored locally
    â-¡ HTTPS only
    â-¡ Webhook signature verification
    â-¡ Idempotency keys used
    â-¡ PCI compliance reviewed
    
    â-¡ TESTING
    â-¡ Test card numbers work
    â-¡ Declined cards handled
    â-¡ 3D Secure flow tested
    â-¡ Webhook replay tested
    â-¡ Refund flow tested
    

### Adding Shopping Cart

    â-¡ DATA MODEL
    â-¡ Cart storage (local/server)
    â-¡ Cart item structure
    â-¡ Price calculation logic
    â-¡ Inventory check
    
    â-¡ FRONTEND
    â-¡ Add to cart button
    â-¡ Cart icon with count
    â-¡ Cart sidebar/modal
    â-¡ Quantity controls
    â-¡ Remove item
    â-¡ Empty cart state
    â-¡ Persisted across sessions
    
    â-¡ CHECKOUT FLOW
    â-¡ Cart summary
    â-¡ Shipping options
    â-¡ Tax calculation
    â-¡ Discount codes
    â-¡ Order review
    â-¡ Payment step
    
    â-¡ EDGE CASES
    â-¡ Out of stock handling
    â-¡ Price change during session
    â-¡ Session expiry
    â-¡ Maximum quantity limits
    

## 👤 User Management Checklists

### Adding User Profile

    â-¡ DATA MODEL
    â-¡ Profile schema (name, avatar, bio)
    â-¡ Relation to User model
    â-¡ Optional vs required fields
    
    â-¡ BACKEND
    â-¡ GET profile route
    â-¡ UPDATE profile route
    â-¡ Avatar upload endpoint
    â-¡ Input validation
    
    â-¡ FRONTEND
    â-¡ Profile display page
    â-¡ Edit profile form
    â-¡ Avatar upload component
    â-¡ Loading states
    â-¡ Validation feedback
    
    â-¡ FEATURES
    â-¡ Change password
    â-¡ Change email (with verification)
    â-¡ Delete account
    â-¡ Export data (GDPR)
    

### Adding User Roles Permissions

    â-¡ DATA MODEL
    â-¡ Role enum in schema
    â-¡ Default role for new users
    â-¡ Permission matrix defined
    
    â-¡ BACKEND
    â-¡ Role check middleware
    â-¡ Permission check utilities
    â-¡ Admin routes protected
    â-¡ Audit logging for admin actions
    
    â-¡ FRONTEND
    â-¡ Role-based UI visibility
    â-¡ Admin dashboard (if admin)
    â-¡ Forbidden page
    
    â-¡ TESTING
    â-¡ Each role tested
    â-¡ Privilege escalation tested
    â-¡ Permission boundaries verified
    

## 📧 Notification Checklists

### Adding Email Notifications

    â-¡ PROVIDER SETUP
    â-¡ Email service (Resend, SendGrid, etc.)
    â-¡ API keys in environment
    â-¡ Sender domain verified
    â-¡ Template system chosen
    
    â-¡ BACKEND
    â-¡ Email utility function
    â-¡ Template rendering
    â-¡ Queue for async sending
    â-¡ Retry logic for failures
    â-¡ Unsubscribe handling
    
    â-¡ EMAILS TO IMPLEMENT
    â-¡ Welcome email
    â-¡ Password reset
    â-¡ Email verification
    â-¡ Order confirmation
    â-¡ Notification digests
    
    â-¡ TESTING
    â-¡ Dev mode sends to test address
    â-¡ Template rendering tested
    â-¡ Link generation correct
    â-¡ Unsubscribe works
    
    â-¡ COMPLIANCE
    â-¡ CAN-SPAM compliance
    â-¡ Unsubscribe link in all
    â-¡ Physical address included
    â-¡ Sender name clear
    

### Adding Push Notifications

    â-¡ SETUP
    â-¡ Web push or mobile push
    â-¡ Service worker for web
    â-¡ VAPID keys generated
    â-¡ Push permission UI
    
    â-¡ BACKEND
    â-¡ Subscription storage
    â-¡ Push sending utility
    â-¡ Batch sending for scale
    â-¡ Retry on failure
    
    â-¡ FRONTEND
    â-¡ Permission request
    â-¡ Subscription management
    â-¡ Notification preferences
    â-¡ In-app notification center
    
    â-¡ TESTING
    â-¡ Different browsers
    â-¡ Offline delivery
    â-¡ Click tracking
    

## 📁 File Upload Checklists

### Adding File Image Upload

    â-¡ STORAGE SETUP
    â-¡ Storage provider (S3, Cloudinary, etc.)
    â-¡ Credentials in environment
    â-¡ Bucket/folder structure
    â-¡ CORS configured
    
    â-¡ BACKEND
    â-¡ Upload endpoint
    â-¡ File type validation
    â-¡ File size limits
    â-¡ Virus scanning (if needed)
    â-¡ Presigned URLs (if direct upload)
    
    â-¡ FRONTEND
    â-¡ File input component
    â-¡ Drag and drop
    â-¡ Preview before upload
    â-¡ Upload progress
    â-¡ Error handling
    â-¡ File type restrictions
    
    â-¡ IMAGE-SPECIFIC
    â-¡ Resize on upload
    â-¡ Multiple sizes generated
    â-¡ Lazy loading
    â-¡ Placeholder/blur
    
    â-¡ SECURITY
    â-¡ No executable uploads
    â-¡ Content-Type validation
    â-¡ Authenticated uploads
    â-¡ Private bucket settings
    

## 🔍 Search Feature Checklists

### Adding Search Functionality

    â-¡ SEARCH BACKEND
    â-¡ Search method chosen (DB, Elasticsearch, Algolia)
    â-¡ Indexing strategy
    â-¡ Full-text search enabled
    â-¡ Relevance tuning
    
    â-¡ API
    â-¡ Search endpoint
    â-¡ Pagination
    â-¡ Filters
    â-¡ Sorting options
    â-¡ Debounced requests
    
    â-¡ FRONTEND
    â-¡ Search input
    â-¡ Autocomplete/suggestions
    â-¡ Results display
    â-¡ Loading state
    â-¡ No results state
    â-¡ Pagination controls
    
    â-¡ PERFORMANCE
    â-¡ Index created on search fields
    â-¡ Response time < 200ms
    â-¡ Caching for common queries
    â-¡ Rate limiting
    

## 🔐 SECTION D: SECURITY CHECKLISTS

---

## 🔐 Authentication Security Checklist

    â-¡ PASSWORD HANDLING
    â-¡ Hashing with bcrypt/argon2
    â-¡ Salt is unique per password
    â-¡ Never log passwords
    â-¡ Min length requirement (12+)
    â-¡ Common password check
    â-¡ Rate limiting on login
    
    â-¡ SESSION MANAGEMENT
    â-¡ Secure, httpOnly cookies
    â-¡ SameSite attribute set
    â-¡ Session expiration
    â-¡ Logout invalidates session
    â-¡ Session regeneration on login
    
    â-¡ TOKEN SECURITY
    â-¡ Short expiration
    â-¡ Refresh token rotation
    â-¡ Token revocation capability
    â-¡ No sensitive data in token
    
    â-¡ ACCOUNT SECURITY
    â-¡ Email verification required
    â-¡ Password reset secure
    â-¡ Reset tokens expire quickly
    â-¡ Account lockout after attempts
    â-¡ Security questions (optional)
    â-¡ 2FA option available
    

## 🛡️ API Security Checklist

    â-¡ INPUT VALIDATION
    â-¡ All inputs validated
    â-¡ Type checking
    â-¡ Length limits
    â-¡ Format validation
    â-¡ SQL injection prevented (ORM)
    â-¡ XSS prevented (encoding)
    
    â-¡ AUTHENTICATION
    â-¡ Auth on all protected routes
    â-¡ Token validation on every request
    â-¡ No auth bypass possible
    â-¡ API key rotation plan
    
    â-¡ AUTHORIZATION
    â-¡ Resource ownership verified
    â-¡ Role checks implemented
    â-¡ No IDOR vulnerabilities
    â-¡ Least privilege principle
    
    â-¡ RATE LIMITING
    â-¡ Rate limiting enabled
    â-¡ Different limits per endpoint
    â-¡ IP-based + user-based
    â-¡ Graceful degradation
    
    â-¡ RESPONSE SECURITY
    â-¡ No stack traces in production
    â-¡ No sensitive data leaked
    â-¡ Proper error messages
    â-¡ Security headers set
    

## 🌐 Frontend Security Checklist

    â-¡ XSS PREVENTION
    â-¡ User input escaped
    â-¡ dangerouslySetInnerHTML NOT used
    â-¡ CSP headers configured
    â-¡ No inline scripts
    
    â-¡ CSRF PREVENTION
    â-¡ CSRF tokens used (if cookies)
    â-¡ SameSite cookie attribute
    â-¡ Origin/Referer validation
    
    â-¡ SENSITIVE DATA
    â-¡ No secrets in frontend
    â-¡ API keys not exposed
    â-¡ No sensitive data in localStorage
    â-¡ Console.log cleaned
    
    â-¡ DEPENDENCIES
    â-¡ npm audit clean
    â-¡ No vulnerable packages
    â-¡ Lock file committed
    â-¡ Regular updates scheduled
    

## 📊 Data Security Checklist

    â-¡ IN TRANSIT
    â-¡ HTTPS everywhere
    â-¡ HSTS header set
    â-¡ TLS 1.2+ only
    â-¡ No mixed content
    
    â-¡ AT REST
    â-¡ Sensitive data encrypted
    â-¡ Encryption keys rotated
    â-¡ PII minimized
    â-¡ Data classified
    
    â-¡ BACKUP & RECOVERY
    â-¡ Backups automated
    â-¡ Backups encrypted
    â-¡ Restore tested
    â-¡ Recovery time objective set
    
    â-¡ COMPLIANCE
    â-¡ GDPR data export
    â-¡ Right to deletion
    â-¡ Data retention policy
    â-¡ Privacy policy updated
    

## 🚀 SECTION E: DEPLOYMENT CHECKLISTS

---

## 📦 Vercel Deployment Checklist

    â-¡ PROJECT SETUP
    â-¡ Git repository connected
    â-¡ Build command correct
    â-¡ Output directory correct
    â-¡ Root directory correct
    
    â-¡ ENVIRONMENT
    â-¡ All env vars set
    â-¡ Production values (not dev)
    â-¡ Database URL points to prod
    â-¡ Secrets properly set
    
    â-¡ DOMAIN
    â-¡ Domain added
    â-¡ DNS configured
    â-¡ SSL certificate active
    â-¡ Redirects configured
    
    â-¡ OPTIMIZATION
    â-¡ Edge functions enabled
    â-¡ Image optimization on
    â-¡ ISR configured
    â-¡ Analytics enabled
    
    â-¡ MONITORING
    â-¡ Function logs accessible
    â-¡ Error tracking (Sentry)
    â-¡ Performance monitoring
    â-¡ Usage alerts set
    

## 🐳 Docker Deployment Checklist

    â-¡ DOCKERFILE
    â-¡ Multi-stage build
    â-¡ Minimal base image
    â-¡ Non-root user
    â-¡ .dockerignore in place
    â-¡ Health check defined
    
    â-¡ COMPOSE
    â-¡ All services defined
    â-¡ Network configured
    â-¡ Volumes for persistence
    â-¡ Environment variables
    â-¡ Restart policies
    
    â-¡ SECURITY
    â-¡ No secrets in image
    â-¡ Images scanned
    â-¡ Tags pinned
    â-¡ Registry authenticated
    
    â-¡ PRODUCTION
    â-¡ Resource limits set
    â-¡ Logging configured
    â-¡ Monitoring enabled
    â-¡ Rollback plan ready
    

## ⚙️ CI CD Pipeline Checklist

    â-¡ BUILD STAGE
    â-¡ Dependencies cached
    â-¡ Lint runs
    â-¡ Type check runs
    â-¡ Tests run
    â-¡ Build succeeds
    
    â-¡ TEST STAGE
    â-¡ Unit tests pass
    â-¡ Integration tests pass
    â-¡ E2E tests pass
    â-¡ Coverage threshold met
    
    â-¡ SECURITY STAGE
    â-¡ Dependency audit
    â-¡ Secret scanning
    â-¡ SAST tools run
    
    â-¡ DEPLOY STAGE
    â-¡ Environment selected
    â-¡ Migrations run
    â-¡ Health check passes
    â-¡ Notifications sent
    
    â-¡ POST-DEPLOY
    â-¡ Smoke tests run
    â-¡ Monitoring verified
    â-¡ Rollback ready
    

### [TARGET: 10,000 LINES OF CHECKLISTS]

### Current: ~700 lines - Expanding systematically

### Coverage: E-commerce, User Management, Notifications, Files, Search, Security, Deployment

---

### This is your COMPREHENSIVE SAFETY NET ✅

### VACCINE for prevention, INJECTION for fixing

### Never forget what else to check 2

---

## ✅ PRODUCTION CHECKLISTS

> **Never miss critical steps**

---

## Pre-Deploy Checklist

    BEFORE DEPLOYING:
    
    [ ] All tests passing
    [ ] Migrations backwards compatible
    [ ] Feature flags in place
    [ ] Rollback tested
    [ ] Monitoring ready
    [ ] On-call aware
    [ ] Change log updated
    [ ] Dependencies audited
    

## New Service Checklist

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
    

## Security Review Checklist

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
    

## Post-Incident Checklist

    AFTER INCIDENT:
    
    [ ] Timeline documented
    [ ] Root cause identified
    [ ] Fix verified
    [ ] Monitoring added
    [ ] Runbook updated
    [ ] Team informed
    [ ] Postmortem scheduled
    [ ] Action items assigned
    

---

## ✅ API SECURITY CHECKLIST 2

> **Comprehensive API security review**

---

## Authentication Checklist

    [ ] HTTPS enforced everywhere
    [ ] Strong password requirements
    [ ] Rate limiting on auth endpoints
    [ ] Account lockout after failures
    [ ] Secure password reset flow
    [ ] MFA option available
    [ ] Session timeout configured
    [ ] Secure cookie settings (HttpOnly, Secure, SameSite)
    

## JWT Checklist

    [ ] Algorithm explicitly specified
    [ ] Short expiration time (15 min)
    [ ] Refresh token rotation implemented
    [ ] Signature validation working
    [ ] Claims validated (iss, aud, exp)
    [ ] Token invalidation possible
    [ ] Sensitive data not in payload
    

## Input Validation Checklist

    [ ] Schema validation on all inputs
    [ ] SQL injection prevented (parameterized)
    [ ] XSS inputs sanitized
    [ ] File upload validation
    [ ] Content-type validation
    [ ] Size limits enforced
    [ ] Character encoding handled
    

---

## ✅ DATABASE MIGRATION CHECKLIST

> **Safe migration execution**

---

## Pre-Migration

    [ ] Tested on staging with production-like data
    [ ] Backup taken
    [ ] Rollback script ready
    [ ] Off-peak timing planned
    [ ] Team notified
    [ ] Monitoring ready
    

## During Migration

    [ ] Watch for lock wait timeouts
    [ ] Monitor query performance
    [ ] Check replication lag
    [ ] Watch disk usage
    [ ] Monitor connection count
    

## Safe Migration Patterns

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
    

## Post-Migration

    [ ] Verify data integrity
    [ ] Run smoke tests
    [ ] Check query performance
    [ ] Confirm no errors in logs
    [ ] Update team
    

---

## ✅ CODE REVIEW CHECKLIST

> **The review patterns that catch bugs**

---

## Functionality

    [ ] Does the code do what its supposed to?
    [ ] Edge cases handled?
    [ ] Error handling in place?
    [ ] Happy path works?
    [ ] Unhappy path works?
    

## Security

    [ ] Input validated?
    [ ] SQL injection prevented?
    [ ] XSS prevented?
    [ ] Authorization checked?
    [ ] Secrets not exposed?
    [ ] Rate limiting in place?
    

## Performance

    [ ] N+1 queries avoided?
    [ ] Large data paginated?
    [ ] Unnecessary computation avoided?
    [ ] Caching considered?
    [ ] Indexes used properly?
    

## Maintainability

    [ ] Code readable?
    [ ] Functions small and focused?
    [ ] Names descriptive?
    [ ] Complex logic commented?
    [ ] Tests included?
    [ ] Documentation updated?
    

## Common Issues

    [ ] No console.logs left
    [ ] No debug code
    [ ] No TODO without issue link
    [ ] No sensitive data in logs
    [ ] Lock file updated
    [ ] Migration reversible
    
