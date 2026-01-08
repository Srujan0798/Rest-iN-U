# DEPENDENCY MAPS

## TABLE OF CONTENTS

- [FULL STACK ARCHITECTURE MAP](#full-stack-architecture-map)
- [Next.js + Prisma + PostgreSQL Stack](#nextjs--prisma--postgresql-stack)

---
> **The Connection Engine: How Everything Links**
> Understand what breaks when you change something.
> Know what else needs updating.

---

## FULL STACK ARCHITECTURE MAP

## Next.js + Prisma + PostgreSQL Stack

```text

        USER/BROWSER

HTTP Request

NEXT.JS APPLICATION

        MIDDLEWARE
        (middleware.ts)
Authentication check
Route protection
Request modification

If allowed

PAGES/ROUTES API ROUTES
(app/page.tsx) (app/api/*/route.ts)

Server Input validation (Zod)
Client Business logic
Layouts Error handling
Response formatting

Prisma Query

PRISMA CLIENT

Generated from schema.prisma
Type-safe queries
Connection management

SQL Query

DATABASE (PostgreSQL)

Tables from migrations
Relations and constraints
Indexes for performance

```text

---

## FILE DEPENDENCY MAP

## When You Change X, Check These Files

```text
schema.prisma
REGENERATE
npx prisma generate
MIGRATE
npx prisma migrate dev
CHECK THESE FILES
app/api/**/*.ts (all API routes using changed models)
lib/db.ts (Prisma client)
types/*.ts (TypeScript interfaces)
prisma/seed.ts (if using seeding)
UPDATE THESE
Frontend components displaying the data
Forms creating/editing the data
Tests using the models

middleware.ts
AFFECTS
All routes matched by matcher config
Authentication flow
Redirect behavior
CHECK THESE FILES
app/login/page.tsx (redirect target)
lib/auth.ts (auth utilities)
.env (auth secrets)
TEST THESE
Protected routes redirect correctly
Public routes accessible
API routes auth works

.env / .env.local
ALSO UPDATE
  .env.example
Vercel/hosting environment
CI/CD secrets
Docker compose (if using)
CHECK THESE FILES
Any file doing process.env.VARIABLE
RESTART
Development server (picks up new env)

next.config.js
AFFECTS
Build process
Image handling
  Redirects/rewrites
Experimental features
CHECK THESE
Image components (domains)
Route handlers (rewrites)
Build output
RESTART
Development server

tailwind.config.js
AFFECTS
All Tailwind classes
Custom colors/fonts
Responsive breakpoints
CHECK THESE
Components using custom classes
Dark mode toggle (if theme change)
RESTART
Development server (maybe)

package.json
ALSO UPDATE
Run: npm install
CHECK THESE
Import statements using changed packages
Scripts that might break
CI/CD
Will run npm install on deploy

tsconfig.json
AFFECTS
Path aliases (@/...)
Type checking strictness
Build target
CHECK THESE
All imports using path aliases
jest.config.js (needs matching paths)
RESTART
TypeScript server (Ctrl+Shift+P Restart TS)

```text

---

## DATA FLOW MAPS

## CREATE Flow (POST)

```text
User Action: Submit Form

FRONTEND

1. Form collects data
2. Client-side validation
3. Submit handler triggers
4. Show loading state

fetch('/api/resource', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(formData)
 })

API ROUTE: app/api/resource/route.ts

export async function POST(req: Request) {
1. Parse request body
2. Validate with Zod
3. Auth check (if needed)
4. Business logic
5. Create in database
6. Return response
 }

PRISMA

await prisma.resource.create({
data: {
     ...validatedData,
userId: session.user.id  // relation
   }
 })

DATABASE

INSERT INTO resources (...)
Returns: created record with id

Response bubbles back up

FRONTEND

5. Hide loading state
6. Show success message
7. Update local state (add to list)
8. Or redirect to new page

```text

---

## READ Flow (GET)

```text
User Action: Navigate to Page

NEXT.JS ROUTING

Route matched Load page.tsx

SERVER COMPONENT  CLIENT COMPONENT
('use client')
Can fetch directly
at component level    Must use useEffect
or React Query

        fetch('/api/resource')

PRISMA QUERY
await prisma.resource.findMany({...})

DATA RETURNED

Server Component renders  Client receives JSON
with data  Updates state
Re-renders with data

```text

---

## COMMON BREAK POINT MAP

## Where Things Typically Break

```text

FRONTEND API

BREAK POINTS:
Wrong URL (typo, missing /api prefix)
Wrong HTTP method (GET vs POST)
Missing auth token/cookie
Request body wrong shape
CORS issues (different origins)
Network errors (server down)

DEBUG: Check Network tab in browser DevTools

API PRISMA

BREAK POINTS:
Wrong model name
Missing required fields
Wrong relation handling (connect vs create)
Type mismatches (string vs number)
Forgetting to await

DEBUG: Add console.log before Prisma call

PRISMA DATABASE

BREAK POINTS:
Connection string wrong
Database not running
Schema out of sync (missing migration)
Unique constraint violations
Foreign key violations
Connection pool exhausted

DEBUG: Check Prisma error code (P2XXX)

        ENVIRONMENT

BREAK POINTS:
Missing env variables
Wrong env for environment (dev URL in prod)
Secrets not set in deployment platform
.env file not loaded

DEBUG: console.log(process.env.VARIABLE)

```text

---

## COMPONENT RELATIONSHIP MAP

## Authentication Flow Dependencies

```text

AUTH COMPONENT MAP

middleware.ts

Uses: lib/auth.ts
Reads: session/token
Redirects to:

      app/login/page.tsx

Submits to

      app/api/auth/login

        Uses

      lib/auth.ts

bcrypt/argon2 (password)
JWT/iron-session (tokens)
Prisma (user lookup)

Database: users table

```text

## State Management Dependencies

```text

STATE FLOW MAP

Context/Store

AuthContext (user, login, logout)

Used by: ProtectedRoute
Used by: Navbar
Used by: UserProfile

ThemeContext (dark/light)

Used by: all components

DataContext (or React Query)

Used by: data-displaying components

```text

---

### This is your CONNECTION MAP

### Know what breaks when you change something

### Know what else needs updating

---

## TECHNOLOGY DEPENDENCY MAP

> **What breaks when X changes**

---

## Node.js Upgrade Impact

```text
Node.js Version Change
  |
+-> Native modules need rebuild
| - node-gyp based packages |
| - bcrypt, sharp, canvas |
  |
+-> V8 changes
| - New JS features |
| - Performance differences |
  |
+-> Built-in changes
| - fetch (18+) |
| - test runner (18+) |
| - watch mode (18+) |
  |
+-> npm version changes
- lockfile format

```text

---

## Database Change Impact

```text
PostgreSQL Upgrade
  |
+-> Query plan changes
| - May need retuning |
| - EXPLAIN ANALYZE all critical |
  |
+-> Extension compatibility
| - PostGIS, pg_trgm, etc |
  |
+-> Replication protocol
| - May need replica upgrade first |
  |
+-> Connection library
- pg, prisma versions

```text

---

## React Version Impact

```text
React Upgrade
  |
+-> 17 -> 18
| - Concurrent features |
| - Auto batching |
| - Strict mode double render |
  |
+-> Component changes
| - Third party libs compatibility |
| - Hook behavior changes |
  |
+-> Build tooling
- React refresh
- JSX transform

```text

---

## PACKAGE/LIBRARY DEPENDENCY MAP

> **What depends on what**

---

## React Ecosystem Dependencies

```text
React
  |
+-> React DOM (rendering)
  |
+-> React Router (routing)
| +-> history |
  |
+-> State Management
| +-> Redux Toolkit |
| | +-> immer |
| | +-> redux |
| +-> Zustand |
| +-> Jotai |
  |
+-> Data Fetching
+-> TanStack Query
+-> SWR
+-> RTK Query (in Redux Toolkit)

```text

---

## Backend Dependency Chain

```text
Express App
  |
+-> express
  |
+-> ORM
| +-> Prisma |
| | +-> prisma client |
| | +-> prisma migrate |
| +-> TypeORM |
| +-> Drizzle |
  |
+-> Validation
| +-> Zod |
| +-> Yup |
  |
+-> Auth
+-> passport
+-> jose (JWT)
+-> bcrypt

```text

---

## INFRASTRUCTURE DEPENDENCY MAP

> **What breaks when infrastructure changes**

---

## Load Balancer Changes

```text
Load Balancer
  |
+-> Health check settings
| - Too aggressive = pod thrashing |
| - Too lenient = bad pods get traffic |
  |
+-> Timeout settings
| - Should match application timeout |
  |
+-> SSL termination
| - Certificate expiry = outage |
  |
+-> Sticky sessions
- Affects deployments
- Affects scaling

```text

---

## DNS Changes

```text
DNS Record Change
  |
+-> TTL still cached
| - Old IP gets traffic |
| - Duration = TTL value |
  |
+-> Health checks
| - DNS failover timing |
  |
+-> CDN invalidation
| - May cache DNS separately |
  |
+-> Service discovery
- Internal DNS updates

```text

---

## Certificate Renewal

```text
SSL Certificate
  |
+-> Load balancer
| - Needs new cert |
  |
+-> CDN
| - Needs propagation |
  |
+-> Mobile apps
| - May have pinned certs |
  |
+-> Third-party integration
- Webhook verifiers

```text

---

## AWS SERVICE DEPENDENCY MAP

> **What breaks when AWS changes**

---

## Lambda Dependencies

```text
Lambda Function
  |
+-> IAM Role
| - Permission changes = access denied |
  |
+-> VPC (if configured)
| - Subnet CIDR = NAT issues |
| - Security Group = network blocked |
  |
+-> Environment Variables
| - Secrets rotation = breaks |
  |
+-> Package Layers
| - Version mismatch = runtime errors |
  |
+-> Triggers
- API Gateway = routing
- SQS = message delivery
- S3 = event notifications

```text

---

## RDS Dependencies

```text
RDS Instance
  |
+-> Security Group
| - Inbound rules = connection refused |
  |
+-> VPC Subnets
| - Availability zones |
  |
+-> Parameter Group
| - postgres.conf changes |
  |
+-> IAM Authentication
| - Role policies |
  |
+-> Secrets Manager
- Credential rotation

```text

---

## ECS Dependencies

```text
ECS Service
  |
+-> Task Definition
| - Container images = deploy failures |
| - Environment = config errors |
  |
+-> Service Discovery
| - DNS propagation delay |
  |
+-> Load Balancer
| - Health checks = deregistration |
| - Target group = routing |
  |
+-> Auto Scaling
- Metric alarms = scaling issues

```text

---

## MONOREPO DEPENDENCY MAP

> **What breaks when packages change**

---

## Shared Package Changes

```text
packages/shared-ui
  |
+-> apps/web (imports Button)
| -> Rebuild required |
  |
+-> apps/mobile (imports Button)
| -> Rebuild required |
  |
+-> packages/dashboard (imports Button)
-> Rebuild required
-> Consumers of dashboard also rebuild!

```text

---

## Version Sync Challenges

```text
PROBLEM:
- packages/utils@1.0.0
- apps/web uses utils@1.0.0
- apps/mobile uses utils@1.0.0
- Update utils to 2.0.0
- Both apps need update!

SOLUTION:
- Turborepo/Nx for orchestration
- Consistent versioning
- CI tests all affected packages

```text

---

## Breaking Change Flow

```text
1. Make change in shared package
2. Turborepo detects dependents
3. Type errors surface immediately
4. Fix all consumers before merge
5. Single atomic commit

```text

---
