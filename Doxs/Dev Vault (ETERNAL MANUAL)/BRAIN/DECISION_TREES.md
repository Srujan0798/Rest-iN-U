# 🌳 DECISION TREES

## Table of Contents

- [Table of Contents](#table-of-contents)
- [🖥️ FRONTEND DECISION TREES](#-frontend-decision-trees)
- [Tree: Page Not Loading / White Screen](#tree-page-not-loading-white-screen)
- [Tree: Undefined Property Error](#tree-undefined-property-error)
- [Tree: Hydration Mismatch](#tree-hydration-mismatch)
- [Tree: Infinite Render Loop](#tree-infinite-render-loop)
- [🔧 BACKEND DECISION TREES](#-backend-decision-trees)
- [Tree: API Returns 500 Error](#tree-api-returns-500-error)
- [Tree: Prisma Errors](#tree-prisma-errors)
- [Tree: API Returns 4XX Error](#tree-api-returns-4xx-error)
- [🗄️ DATABASE DECISION TREES](#-database-decision-trees)
- [Tree: Database Not Connecting](#tree-database-not-connecting)
- [Tree: Migration Issues](#tree-migration-issues)
- [🏗️ BUILD/DEPLOY DECISION TREES](#-builddeploy-decision-trees)
- [Tree: Build Failing](#tree-build-failing)
- [Tree: Deployment Failing](#tree-deployment-failing)
  - [CONTINUED: MORE DECISION TREES FOR](#continued-more-decision-trees-for)
- [🔐 AUTHENTICATION DECISION TREES](#-authentication-decision-trees)
- [Tree: Login Not Working](#tree-login-not-working)
- [Tree: Session/Token Issues](#tree-sessiontoken-issues)
- [Tree: OAuth Login Issues](#tree-oauth-login-issues)
- [📁 FILE UPLOAD DECISION TREES](#-file-upload-decision-trees)
- [Tree: File Upload Issues](#tree-file-upload-issues)
- [âš¡ REAL-TIME/WEBSOCKET DECISION TREES](#âš-real-timewebsocket-decision-trees)
- [Tree: WebSocket Not Connecting](#tree-websocket-not-connecting)
- [Tree: Real-time Updates Not Working](#tree-real-time-updates-not-working)
- [🔌 THIRD-PARTY API DECISION TREES](#-third-party-api-decision-trees)
- [Tree: External API Integration Issues](#tree-external-api-integration-issues)
- [📊 PERFORMANCE DECISION TREES](#-performance-decision-trees)
- [Tree: Slow Page Load](#tree-slow-page-load)
- [Tree: Slow API Response](#tree-slow-api-response)
- [Tree: Memory Issues](#tree-memory-issues)
  - [[TARGET: 10,000 LINES OF DECISION TREES]](#target-10000-lines-of-decision-trees)
  - [Current: ~1,100 lines - Expanding systematically](#current-1100-lines---expanding-systematically)
  - [Coverage: Frontend, Backend, Database, Deploy, Auth, Files, Real-time, APIs, Performance](#coverage-frontend-backend-database-deploy-auth-files-real-time-apis-performance)
  - [This is your DIAGNOSTIC BRAIN 🌳](#this-is-your-diagnostic-brain-)
  - [Follow the branches to find the root cause](#follow-the-branches-to-find-the-root-cause)
- [🎯 DEBUGGING DECISION TREE](#-debugging-decision-tree)
- [Application Not Responding](#application-not-responding)
- [Slow API Response](#slow-api-response)
- [Memory Growing](#memory-growing)
- [🔍 SEARCH DECISION TREE](#-search-decision-tree)
- [Search Solution Decision](#search-solution-decision)
- [Cache Decision Tree](#cache-decision-tree)
- [🎯 ARCHITECTURE DECISION TREE](#-architecture-decision-tree)
- [Monolith vs Microservices](#monolith-vs-microservices)
- [Database Selection](#database-selection)
- [Sync vs Async Communication](#sync-vs-async-communication)
- [🔥 TECH STACK DECISION TREE](#-tech-stack-decision-tree)
- [Frontend Framework Decision](#frontend-framework-decision)
- [Hosting Decision](#hosting-decision)
- [Database Decision](#database-decision)
- [🔥 DATABASE INDEX DECISION TREE](#-database-index-decision-tree)
- [Should I Create an Index?](#should-i-create-an-index)
- [Index Type Decision](#index-type-decision)
- [Composite Index Order](#composite-index-order)
- [🎯 CI/CD DECISION TREE](#-cicd-decision-tree)
- [When to Run Tests](#when-to-run-tests)
- [Deployment Strategy Decision](#deployment-strategy-decision)
- [Environment Promotion](#environment-promotion)

## 🖥️ FRONTEND DECISION TREES

---

## Tree: Page Not Loading / White Screen

```text
Page not loading?
│
├── Is there an error in browser console?
│   │
│   ├── YES → Read the error message
│   │   │
│   │   ├── "Cannot read properties of undefined"
│   │   │   └── GO TO: Undefined Property Tree
│   │   │
│   │   ├── "Hydration failed" / "Text content mismatch"
│   │   │   └── GO TO: Hydration Mismatch Tree
│   │   │
│   │   ├── "Maximum update depth exceeded"
│   │   │   └── GO TO: Infinite Loop Tree
│   │   │
│   │   ├── "Module not found"
│   │   │   └── GO TO: Import Error Tree
│   │   │
│   │   └── Other error
│   │       └── Google exact error message
│   │
│   └── NO → Check Network tab
│       │
│       ├── API calls failing?
│       │   └── GO TO: API Debug Tree
│       │
│       ├── API calls pending forever?
│       │   └── Server not responding
│       │       → Check if server is running
│       │       → Check correct URL
│       │
│       └── No API calls at all?
│           └── Page might not be reached
│               → Check URL routing
│               → Check middleware blocking

```text

---

## Tree: Undefined Property Error

```text
"Cannot read properties of undefined (reading 'X')"
│
├── What is undefined?
│   │
│   ├── Data from useState
│   │   └── STATE NOT INITIALIZED
│   │       FIX: useState([]) instead of useState()
│   │       FIX: useState({}) instead of useState()
│   │       FIX: useState(null) + null check
│   │
│   ├── Data from props
│   │   └── PARENT NOT PASSING PROP
│   │       FIX: Check parent component
│   │       FIX: Add default value
│   │       FIX: Add prop validation
│   │
│   ├── Data from API response
│   │   └── API RETURNED DIFFERENT SHAPE
│   │       FIX: Check Network tab for actual response
│   │       FIX: Handle loading state
│   │       FIX: Add optional chaining ?.
│   │
│   └── Nested property (a.b.c.d)
│       └── INTERMEDIATE IS UNDEFINED
│           FIX: Use optional chaining a?.b?.c?.d
│           FIX: Check each level separately

```text

---

## Tree: Hydration Mismatch

```text
"Hydration failed" / "Expected server HTML to contain..."
│
├── What's different between server and client?
│   │
│   ├── Date/Time values
│   │   └── SERVER TIME ≠ CLIENT TIME
│   │       FIX: Move to useEffect
│   │       FIX: Use suppressHydrationWarning
│   │       CODE:
│   │       const [date, setDate] = useState(null);
│   │       useEffect(() => {
│   │         setDate(new Date().toLocaleString());
│   │       }, []);
│   │
│   ├── Using window/localStorage/sessionStorage
│   │   └── DOESN'T EXIST ON SERVER
│   │       FIX: Check typeof window !== 'undefined'
│   │       FIX: Use useEffect for client-only code
│   │       FIX: Dynamic import with { ssr: false }
│   │
│   ├── Random values (Math.random, uuid)
│   │   └── DIFFERENT ON EACH RENDER
│   │       FIX: Generate once, store in state
│   │       FIX: Generate in useEffect
│   │       FIX: Use seed-based random
│   │
│   ├── User agent / browser detection
│   │   └── ONLY AVAILABLE ON CLIENT
│   │       FIX: Move to useEffect
│   │
│   └── Browser extension modifying DOM
│       └── NOT YOUR BUG
│           FIX: Add suppressHydrationWarning to body
│           FIX: Ignore if app works

```text

---

## Tree: Infinite Render Loop

```text
"Maximum update depth exceeded"
│
├── Where is the loop?
│   │
│   ├── useEffect without dependency array
│   │   └── RUNS EVERY RENDER
│   │       FIX: Add dependency array []
│   │       FIX: Add specific dependencies [x, y]
│   │
│   ├── useEffect with object/array in deps
│   │   └── OBJECT REFERENCE CHANGES EACH RENDER
│   │       FIX: Use useMemo to stabilize object
│   │       FIX: Use individual primitive deps
│   │       CODE:
│   │       const options = useMemo(() => ({ ... }), [deps]);
│   │
│   ├── setState called during render
│   │   └── RENDER → SET → RENDER → SET...
│   │       FIX: Move setState to useEffect
│   │       FIX: Use derived state instead
│   │       FIX: Compute value, don't store it
│   │
│   ├── Function in dependency array
│   │   └── FUNCTION RECREATED EACH RENDER
│   │       FIX: Use useCallback for the function
│   │       CODE:
│   │       const fn = useCallback(() => { ... }, [deps]);
│   │
│   └── Parent re-renders child infinitely
│       └── CHECK PARENT FOR ABOVE ISSUES

```text

---

## 🔧 BACKEND DECISION TREES

---

## Tree: API Returns 500 Error

```text
API returns 500 Internal Server Error?
│
├── Check server logs
│   │
│   ├── Error message visible?
│   │   │
│   │   ├── "Cannot read property of undefined"
│   │   │   └── GO TO: Backend Undefined Tree
│   │   │
│   │   ├── "PrismaClientKnownRequestError"
│   │   │   └── GO TO: Prisma Error Tree
│   │   │
│   │   ├── "ECONNREFUSED"
│   │   │   └── DATABASE CONNECTION FAILED
│   │   │       → Is database running?
│   │   │       → DATABASE_URL correct?
│   │   │       → Port/host correct?
│   │   │
│   │   ├── "TypeError" / "ReferenceError"
│   │   │   └── CODE BUG
│   │   │       → Check line number
│   │   │       → Fix the bug
│   │   │
│   │   └── No clear error
│   │       └── ADD TRY-CATCH LOGGING
│   │           CODE:
│   │           try { ... }
│   │           catch (e) { console.error(e); }
│   │
│   └── No server logs
│       └── Check if server is running correctly
│           → npm run dev working?
│           → No startup errors?

```text

---

## Tree: Prisma Errors

```text
Prisma error?
│
├── Read error code (P2XXX)
│   │
│   ├── P2002 - Unique constraint failed
│   │   └── DUPLICATE VALUE
│   │       → Record with same unique field exists
│   │       FIX: Check for existing before create
│   │       FIX: Use upsert instead
│   │       FIX: Handle error gracefully
│   │
│   ├── P2003 - Foreign key constraint failed
│   │   └── REFERENCED RECORD DOESN'T EXIST
│   │       → Creating with non-existent relation ID
│   │       → Deleting record that's referenced
│   │       FIX: Check related record exists first
│   │       FIX: Delete related records first
│   │       FIX: Use onDelete: Cascade in schema
│   │
│   ├── P2025 - Record not found
│   │   └── UPDATE/DELETE ON NON-EXISTENT RECORD
│   │       → ID doesn't exist in database
│   │       FIX: Use findUnique first to check
│   │       FIX: Handle not found case
│   │
│   ├── P2024 - Connection pool timeout
│   │   └── TOO MANY CONNECTIONS
│   │       → Serverless creating too many connections
│   │       FIX: Use connection pooler (Prisma Accelerate)
│   │       FIX: Check for connection leaks
│   │
│   └── "Cannot reach database"
│       └── CONNECTION STRING WRONG
│           → Check DATABASE_URL
│           → Check host, port, database name
│           → Check username, password

```text

---

## Tree: API Returns 4XX Error

```text
API returns 400/401/403/404?
│
├── 400 Bad Request
│   └── CLIENT SENDING INVALID DATA
│       → Check request body in Network tab
│       → Missing required fields?
│       → Wrong data types?
│       → Validation errors?
│
├── 401 Unauthorized
│   └── AUTHENTICATION FAILED
│       → Token missing?
│       → Token expired?
│       → Token format wrong?
│       → Cookie not sent? (credentials: 'include')
│
├── 403 Forbidden
│   └── AUTHORIZATION FAILED
│       → User authenticated but not allowed
│       → Role/permission issue
│       → Resource owned by different user
│
└── 404 Not Found
    │
    ├── API route doesn't exist
    │   → File in correct location? (app/api/x/route.ts)
    │   → Exported correct method? (GET, POST)
    │   → Dynamic param syntax correct? ([id])
    │
    └── Resource not found
        → ID doesn't exist in database
        → Record was deleted
        → Wrong ID being passed

```text

---

## 🗄️ DATABASE DECISION TREES

---

## Tree: Database Not Connecting

```text
"Can't reach database" / "ECONNREFUSED"?
│
├── Is database running?
│   │
│   ├── Local PostgreSQL
│   │   → brew services start postgresql (Mac)
│   │   → sudo systemctl start postgresql (Linux)
│   │   → Check Services app (Windows)
│   │
│   ├── Docker database
│   │   → docker ps (is container running?)
│   │   → docker logs [container] (any errors?)
│   │
│   └── Cloud database
│       → Check dashboard status
│       → Check IP whitelist includes you
│
├── Connection string correct?
│   │
│   ├── Host correct?
│   │   → localhost for local
│   │   → Container name for Docker
│   │   → Cloud URL for hosted
│   │
│   ├── Port correct?
│   │   → Default: 5432 (Postgres), 3306 (MySQL)
│   │   → Check if custom port set
│   │
│   ├── Database name exists?
│   │   → Connect with psql/CLI
│   │   → Create database if missing
│   │
│   └── Credentials correct?
│       → Username/password match?
│       → Special characters URL-encoded?
│
└── Firewall/network blocking?
    → Corporate firewall?
    → VPN interfering?
    → Cloud security groups?

```text

---

## Tree: Migration Issues

```text
Migration failing / Schema out of sync?
│
├── What's the error?
│   │
│   ├── "Migration failed to apply"
│   │   └── MIGRATION HAS ERROR
│   │       → Check migration SQL
│   │       → Manual fix in database
│   │       → prisma migrate resolve --applied
│   │
│   ├── "Database schema is not empty"
│   │   └── NEW DATABASE WITH EXISTING SCHEMA
│   │       → prisma migrate reset (dev only!)
│   │       → prisma db push (force sync)
│   │
│   ├── "Schema drift detected"
│   │   └── MANUAL DB CHANGES MADE
│   │       → prisma db pull (get current)
│   │       → Review differences
│   │       → Create migration to sync
│   │
│   └── "Relation X does not exist"
│       └── TABLE MISSING
│           → prisma migrate deploy (production)
│           → prisma migrate dev (development)
│
└── Type errors after schema change?
    └── PRISMA CLIENT OUT OF DATE
        → npx prisma generate
        → Restart TypeScript server

```text

---

## 🏗️ BUILD/DEPLOY DECISION TREES

---

## Tree: Build Failing

```text
Build fails?
│
├── TypeScript error
│   │
│   ├── "Property X does not exist on type Y"
│   │   → Check type definition
│   │   → Add missing property
│   │   → Use correct type
│   │
│   ├── "Type X is not assignable to type Y"
│   │   → Check what type is expected
│   │   → Convert/transform data
│   │   → Fix function parameters
│   │
│   ├── "Cannot find module"
│   │   → npm install missing package
│   │   → Check path aliases in tsconfig
│   │   → Check file actually exists
│   │
│   └── Other TS error
│       → Read error carefully
│       → Fix at line number shown
│
├── ESLint error
│   │
│   ├── "Missing dependency in useEffect"
│   │   → Add the dependency
│   │   → Or disable rule if intentional
│   │
│   ├── "Variable is defined but never used"
│   │   → Remove unused variable
│   │   → Prefix with _ if intentional
│   │
│   └── Other lint error
│       → Follow ESLint suggestion
│
└── Build process error
    │
    ├── Out of memory
    │   → NODE_OPTIONS='--max-old-space-size=4096'
    │   → Optimize build
    │
    └── Timeout
        → Check what's hanging
        → Split into smaller chunks

```text

---

## Tree: Deployment Failing

```text
Deployment to Vercel/Netlify/etc fails?
│
├── Build stage failing
│   └── GO TO: Build Failing Tree
│
├── Environment variables missing
│   └── CHECK DASHBOARD
│       → All required vars set?
│       → Production values (not dev)?
│       → Secrets properly set?
│
├── Database connection failing
│   │
│   ├── Connection string correct for production?
│   │
│   ├── Database accessible from deployment?
│   │   → IP whitelist
│   │   → Internal network restrictions
│   │
│   └── Using serverless?
│       → Need connection pooler
│       → Prisma Data Proxy / Accelerate
│
└── Runtime errors after deploy
    └── CHECK FUNCTION LOGS
        → Vercel: Project → Deployments → Functions
        → Look for error messages
        → Fix code, redeploy

```text

---

### CONTINUED: MORE DECISION TREES FOR

- Authentication flows
- File upload issues
- Real-time/WebSocket issues
- Third-party API integration
- Performance debugging

---

## 🔐 AUTHENTICATION DECISION TREES

---

## Tree: Login Not Working

```text
User can't log in?
│
├── What happens when they try?
│   │
│   ├── "Invalid credentials" error
│   │   │
│   │   ├── Wrong email?
│   │   │   → User typo
│   │   │   → Email case sensitivity issue
│   │   │
│   │   ├── Wrong password?
│   │   │   → Try password reset
│   │   │   → Check if recently changed
│   │   │
│   │   └── User doesn't exist?
│   │       → Check database directly
│   │       → Registration might have failed
│   │
│   ├── Form submits but nothing happens
│   │   │
│   │   ├── Check Network tab
│   │   │   → API call made?
│   │   │   → Response received?
│   │   │
│   │   ├── Check browser console
│   │   │   → JavaScript errors?
│   │   │   → Form validation errors?
│   │   │
│   │   └── Submit handler attached?
│   │       → onClick or onSubmit correct?
│   │
│   ├── Login succeeds but user not logged in
│   │   │
│   │   ├── Cookie/token not set
│   │   │   → Check Application → Cookies
│   │   │   → SameSite/Secure attributes
│   │   │   → httpOnly setting
│   │   │
│   │   ├── Session not persisted
│   │   │   → Check session storage
│   │   │   → Redis/database session?
│   │   │   → Session expiry immediate?
│   │   │
│   │   └── Redirect not happening
│   │       → Check redirect logic
│   │       → Middleware blocking?
│   │
│   └── CORS error
│       └── GO TO: CORS Error Tree

```text

---

## Tree: Session/Token Issues

```text
User keeps getting logged out?
│
├── When does it happen?
│   │
│   ├── After refresh
│   │   │
│   │   ├── Using sessionStorage?
│   │   │   → Clears on refresh/close
│   │   │   FIX: Use localStorage or cookies
│   │   │
│   │   ├── Token in memory only?
│   │   │   → State resets on refresh
│   │   │   FIX: Persist to localStorage/cookie
│   │   │
│   │   └── Cookie not persisting?
│   │       → Check expires/maxAge
│   │       → Check secure attribute (needs HTTPS)
│   │
│   ├── After some time
│   │   │
│   │   ├── Token expired?
│   │   │   → Check token expiry
│   │   │   → Implement refresh token
│   │   │
│   │   └── Session expired?
│   │       → Check session maxAge
│   │       → Implement rolling sessions
│   │
│   └── On specific pages
│       │
│       ├── Middleware rejecting?
│       │   → Check middleware matcher
│       │   → Check token validation logic
│       │
│       └── Cookie not sent?
│           → Different subdomain?
│           → credentials: 'include' missing?

```text

---

## Tree: OAuth Login Issues

```text
OAuth (Google/GitHub/etc) login failing?
│
├── What stage fails?
│   │
│   ├── "redirect_uri_mismatch" error
│   │   └── CALLBACK URL WRONG
│   │       → Check OAuth provider settings
│   │       → URL must EXACTLY match
│   │       → Include :port for dev
│   │       → Check http vs https
│   │
│   ├── Popup blocked / doesn't open
│   │   └── BROWSER SECURITY
│   │       → Must be triggered by user action
│   │       → addEventListener, not auto-popup
│   │
│   ├── Callback page error
│   │   │
│   │   ├── "state mismatch"
│   │   │   → State lost during redirect
│   │   │   → Cookie settings
│   │   │   → Try clearing cookies
│   │   │
│   │   ├── "code exchange failed"
│   │   │   → OAuth code expired (10 min)
│   │   │   → Wrong client secret
│   │   │   → Network issue to provider
│   │   │
│   │   └── "email already registered"
│   │       → Account linking issue
│   │       → User exists with different provider
│   │
│   └── User created but wrong data
│       → Check scope requested
│       → Check what provider returns
│       → Map provider data correctly

```text

---

## 📁 FILE UPLOAD DECISION TREES

---

## Tree: File Upload Issues

```text
File upload not working?
│
├── What happens?
│   │
│   ├── File selection doesn't work
│   │   │
│   │   ├── Input not visible?
│   │   │   → Check CSS (display, opacity)
│   │   │   → Label linked to input?
│   │   │
│   │   └── Accept attribute blocking?
│   │       → Check allowed file types
│   │       → MIME type correct?
│   │
│   ├── Upload starts but fails
│   │   │
│   │   ├── Check Network tab
│   │   │   │
│   │   │   ├── 413 Payload Too Large
│   │   │   │   → File too big
│   │   │   │   → Increase server limit
│   │   │   │   → Add client-side check
│   │   │   │
│   │   │   ├── 415 Unsupported Media Type
│   │   │   │   → File type not allowed
│   │   │   │   → Check server validation
│   │   │   │
│   │   │   ├── Timeout
│   │   │   │   → File too big
│   │   │   │   → Network slow
│   │   │   │   → Increase timeout
│   │   │   │
│   │   │   └── CORS error
│   │   │       → Direct upload to S3?
│   │   │       → Check bucket CORS config
│   │   │
│   │   └── FormData not sending correctly
│   │       → Don't set Content-Type manually
│   │       → Let browser set boundary
│   │       → Check FormData construction
│   │
│   ├── Upload succeeds but file corrupted
│   │   │
│   │   ├── Encoding issue
│   │   │   → Binary vs text handling
│   │   │   → Base64 encoding needed?
│   │   │
│   │   └── Partial upload
│   │       → Check file size matches
│   │       → Stream handling issue?
│   │
│   └── File uploaded but not accessible
│       │
│       ├── URL wrong
│       │   → Check stored URL
│       │   → Check public access
│       │
│       └── Permissions issue
│           → S3 bucket policy
│           → CloudStorage IAM
│           → File ACL settings

```text

---

## âš¡ REAL-TIME/WEBSOCKET DECISION TREES

---

## Tree: WebSocket Not Connecting

```text
WebSocket connection failing?
│
├── Check browser console
│   │
│   ├── "WebSocket connection failed"
│   │   │
│   │   ├── Wrong URL
│   │   │   → ws:// for HTTP, wss:// for HTTPS
│   │   │   → Correct port?
│   │   │   → Correct path?
│   │   │
│   │   ├── Server not running
│   │   │   → Check WebSocket server up
│   │   │   → Check logs for errors
│   │   │
│   │   └── Network blocking
│   │       → Firewall
│   │       → Corporate proxy
│   │       → Vercel/serverless (no WS support)
│   │
│   └── Connection opens then closes
│       │
│       ├── Server closing connection
│       │   → Auth failed?
│       │   → Rate limit?
│       │   → Check server logs
│       │
│       └── Timeout settings
│           → Ping/pong not working
│           → Connection timeout too short
│
├── Using serverless (Vercel/Netlify)?
│   └── WEBSOCKETS NOT SUPPORTED
│       → Use Pusher/Ably/Socket.io cloud
│       → Use Server-Sent Events instead
│       → Use polling as fallback
│
└── Works locally, fails in production
    │
    ├── wss:// required in production
    │   → Certificate issues?
    │
    └── Proxy/load balancer blocking
        → Configure proxy for WebSocket
        → Check Connection: Upgrade header

```text

---

## Tree: Real-time Updates Not Working

```text
Updates not appearing in real-time?
│
├── Connection established?
│   │
│   ├── Check WebSocket panel in DevTools
│   │   → Connection open?
│   │   → Messages being sent/received?
│   │
│   └── No connection
│       → GO TO: WebSocket Not Connecting Tree
│
├── Messages being sent but not received
│   │
│   ├── Check message format
│   │   → JSON stringify/parse correct?
│   │   → Event type matching?
│   │
│   ├── Check subscriptions
│   │   → Subscribed to correct channel/room?
│   │   → Join before listening?
│   │
│   └── Check server-side broadcast
│       → Message actually being sent?
│       → To correct room/clients?
│
└── Messages received but UI not updating
    │
    ├── State not updating
    │   → Check setState called
    │   → Check it's new reference
    │
    └── Component not subscribed
        → useEffect cleanup removing listener?
        → Correct event name?

```text

---

## 🔌 THIRD-PARTY API DECISION TREES

---

## Tree: External API Integration Issues

```text
Third-party API not working?
│
├── Getting error response
│   │
│   ├── 401 Unauthorized
│   │   →  API key correct?
│   │   → Header format correct?
│   │   → Key expired?
│   │   → Using right environment? (dev/prod)
│   │
│   ├── 403 Forbidden
│   │   → IP restricted?
│   │   → Scope/permissions limited?
│   │   → Account suspended?
│   │
│   ├── 429 Too Many Requests
│   │   → Rate limited
│   │   → Implement retry with backoff
│   │   → Cache responses
│   │   → Upgrade plan if needed
│   │
│   ├── 500/502/503 Server Error
│   │   → Their issue, not yours
│   │   → Check status page
│   │   → Retry later
│   │   → Fallback mechanism?
│   │
│   └── Response parsing error
│       → Check actual response (Network tab)
│       → API changed response format?
│       → Update your types/parsing
│
└── No response / timeout
    │
    ├── Network issue
    │   → Can you ping their domain?
    │   → Firewall blocking?
    │
    └── Timeout too short
        → Increase timeout
        → Add loading states

```text

---

## 📊 PERFORMANCE DECISION TREES

---

## Tree: Slow Page Load

```text
Page loading slowly?
│
├── Check Network tab → Waterfall
│   │
│   ├── Large JS bundle?
│   │   │
│   │   ├── Check bundle size
│   │   │   → Run: npx next build
│   │   │   → Look at "First Load JS" sizes
│   │   │
│   │   ├── Heavy dependencies?
│   │   │   → moment.js → use date-fns
│   │   │   → lodash → import individual functions
│   │   │   → Check npm package sizes
│   │   │
│   │   └── Not code-splitting?
│   │       → Use dynamic imports
│   │       → Route-based splitting
│   │       → Lazy load below-fold components
│   │
│   ├── Large images?
│   │   │
│   │   ├── Images not optimized
│   │   │   → Use next/image
│   │   │   → WebP format
│   │   │   → Proper sizes attribute
│   │   │
│   │   └── Too many images loading
│   │       → Lazy loading
│   │       → Priority for above-fold
│   │
│   └── Slow API calls
│       │
│       ├── API response slow
│       │   → GO TO: Slow API Tree
│       │
│       └── Too many API calls
│           → Batch requests
│           → Use GraphQL
│           → Cache responses
│
└── Check Performance tab → record load
    │
    ├── Long tasks blocking main thread
    │   → Move to Web Worker
    │   → Split into chunks
    │   → Use requestIdleCallback
    │
    └── Layout thrashing
        → Batch DOM reads and writes
        → Use CSS transforms instead
        → Virtual scrolling for long lists

```text

---

## Tree: Slow API Response

```text
API taking too long?
│
├── Profile where time is spent
│   │
│   ├── Database queries
│   │   │
│   │   ├── N+1 query problem?
│   │   │   → Use include/join instead of loops
│   │   │   → Check Prisma query log
│   │   │
│   │   ├── Missing indexes?
│   │   │   → Add indexes on WHERE columns
│   │   │   → Add indexes on JOIN columns
│   │   │   → Add indexes on ORDER BY columns
│   │   │
│   │   └── Query too complex?
│   │       → Split into smaller queries
│   │       → Denormalize for read performance
│   │       → Use materialized views
│   │
│   ├── External API calls in request
│   │   │
│   │   ├── Can parallelize?
│   │   │   → Use Promise.all
│   │   │
│   │   └── Can cache?
│   │       → Redis cache
│   │       → In-memory cache
│   │       → HTTP caching headers
│   │
│   └── Heavy computation
│       │
│       ├── Move to background job
│       │   → Queue for async processing
│       │   → Return job ID, poll for results
│       │
│       └── Cache computed results
│           → Recompute only when data changes
│
└── Cold start issue (serverless)
    │
    ├── First request slow, subsequent fast?
    │   → This is cold start
    │
    ├── Reduce bundle size
    │   → Fewer dependencies
    │   → Tree shaking
    │
    └── Use provisioned concurrency
        → Keep instances warm
        → Or warm with scheduled ping

```text

---

## Tree: Memory Issues

```text
App using too much memory / crash?
│
├── Memory leak symptoms
│   │
│   ├── Memory grows over time
│   │   │
│   │   ├── Event listeners not removed
│   │   │   → Add cleanup in useEffect return
│   │   │   → Check for addEventListener without removeEventListener
│   │   │
│   │   ├── Timers not cleared
│   │   │   → clearInterval in cleanup
│   │   │   → clearTimeout in cleanup
│   │   │
│   │   ├── Subscriptions not cancelled
│   │   │   → Unsubscribe in cleanup
│   │   │   → AbortController for fetch
│   │   │
│   │   └── Large arrays growing
│   │       → Implement pagination
│   │       → Limit stored data
│   │       → Clear old data
│   │
│   └── Memory spike then crash
│       │
│       ├── Loading too much data at once
│       │   → Paginate API responses
│       │   → Stream large files
│       │
│       └── Recursive operation
│           → Add depth limit
│           → Iterative vs recursive
│
└── How to debug
    │
    ├── Chrome DevTools → Memory tab
    │   → Take heap snapshots
    │   → Compare over time
    │   → Look for "Detached" elements
    │
    └── Look for patterns
        → What action causes growth?
        → What components are leaking?

```text

---

### [TARGET: 10,000 LINES OF DECISION TREES]

### Current: ~1,100 lines - Expanding systematically

### Coverage: Frontend, Backend, Database, Deploy, Auth, Files, Real-time, APIs, Performance

---

### This is your DIAGNOSTIC BRAIN 🌳

### Follow the branches to find the root cause

---

## 🎯 DEBUGGING DECISION TREE

> **Follow the path to root cause**

---

## Application Not Responding

```text
START: App not responding
  |
  +-> Check if process running?
      |
      +-> NO: Check logs for crash reason
| -> OOM? Increase memory, fix leak |
| -> Exception? Fix code |
| -> Killed? Check OOM killer, signals |
      |
      +-> YES: Check CPU usage
              |
              +-> HIGH CPU: Infinite loop? Hot code path?
| Profile with 0x or clinic |
              |
              +-> LOW CPU: Blocked on I/O?
                          Check connections, network
                          Check database locks
                          Check file system

```text

---

## Slow API Response

```text
START: API slow (>1s)
  |
  +-> Check single request or all?
      |
      +-> ALL SLOW: System-wide issue
| -> Check DB connection pool |
| -> Check external service |
| -> Check CPU/memory |
      |
      +-> SINGLE ENDPOINT:
          |
          +-> Add timing logs
| -> DB query slow? EXPLAIN ANALYZE |
| -> External API? Add timeout |
| -> CPU work? Consider async |
          |
          +-> N+1 query pattern?
              -> Add eager loading

```text

---

## Memory Growing

```text
START: Memory keeps increasing
  |
  +-> Restart fixes temporarily?
      |
      +-> YES: Memory leak
| -> Take heap snapshots |
| -> Compare over time |
| -> Find growing objects |
      |
      +-> NO: Legitimate growth
          -> Add memory limits
          -> Optimize data structures
          -> Add pagination

```text

---

## 🔍 SEARCH DECISION TREE

> **Choosing the right search solution**

---

## Search Solution Decision

```text
START: Need search functionality
  |
  +-> How many documents?
      |
      +-> < 10K: PostgreSQL Full-Text
| - Built-in |
| - Simple to maintain |
      |
      +-> 10K - 1M: Consider dedicated
      |   |
| +-> Need instant search? |
| +-> YES: Algolia (managed) |
| +-> NO: Elasticsearch/Meilisearch |
      |
      +-> > 1M: Elasticsearch cluster

          - Sharding
          - Dedicated resources
          - Ops expertise required

```text

---

## Cache Decision Tree

```text
START: Should I cache this?
  |
  +-> How often accessed?
      |
      +-> Rarely: Dont cache
      |
      +-> Frequently:
          |
          +-> How expensive to compute?
              |
              +-> Cheap: Maybe skip
              +-> Expensive: Cache it
                  |
                  +-> How often changes?
                      +-> Rarely: Long TTL
                      +-> Often: Short TTL + invalidation

```text

---

## 🎯 ARCHITECTURE DECISION TREE

> **Choosing the right architecture**

---

## Monolith vs Microservices

```text
START: New project architecture
  |
  +-> Team size?
      |
      +-> < 5 engineers: Monolith
| (Complexity not worth it) |
      |
      +-> 5-20 engineers:
| +-> Domain boundaries clear? |
| +-> NO: Monolith first |
| +-> YES: Consider modular monolith |
      |
      +-> > 20 engineers:
          +-> Independent team scaling needed?
              +-> YES: Microservices
              +-> NO: Modular monolith

```text

---

## Database Selection

```text
START: Choose database
  |
  +-> Data structure?
      |
      +-> Relational: PostgreSQL/MySQL
      |
      +-> Document: MongoDB
      |
      +-> Key-Value: Redis
      |
      +-> Time-Series: TimescaleDB
      |
      +-> Graph: Neo4j
      |
      +-> Search: Elasticsearch

```text

---

## Sync vs Async Communication

```text
START: How should services communicate?
  |
  +-> Need immediate response?
      |
      +-> YES: Sync (REST/gRPC)
| +-> Response time critical? |
| +-> YES: gRPC |
| +-> NO: REST |
      |
      +-> NO: Async (Queue/Events)
          +-> Need delivery guarantee?
              +-> YES: Queue (SQS/RabbitMQ)
              +-> NO: Pub/Sub (SNS/Kafka)

```text

---

## 🔥 TECH STACK DECISION TREE

> **Choosing the right tools**

---

## Frontend Framework Decision

```text
START: Choose frontend framework
  |
  +-> Need SSR/SEO?
      |
      +-> YES:
| +-> React ecosystem preferred? |
|  | +-> YES: Next.js |
|  | +-> NO: Nuxt (Vue) or SvelteKit |
      |
      +-> NO: SPA is fine
          +-> Team experience?
              +-> React: Vite + React
              +-> Vue: Vite + Vue
              +-> New team: Consider Svelte

```text

---

## Hosting Decision

```text
START: Where to host?
  |
  +-> What type of app?
      |
      +-> Static site: Vercel, Netlify, Cloudflare Pages
      |
      +-> Full-stack:
| +-> Serverless OK? |
| +-> YES: Vercel, AWS Lambda |
| +-> NO: Railway, Fly.io, AWS ECS |
      |
      +-> Need containers?
          +-> YES: Fly.io, Railway, AWS ECS
          +-> Kubernetes needed: AWS EKS, GKE

```text

---

## Database Decision

```text
START: Choose database
  |
  +-> Primary use case?
      |
      +-> General CRUD: PostgreSQL
      |
      +-> Document store: MongoDB
      |
      +-> Caching: Redis
      |
      +-> Search: Elasticsearch / Meilisearch
      |
      +-> Analytics: ClickHouse
      |
      +-> Graph data: Neo4j

```text

---

## 🔥 DATABASE INDEX DECISION TREE

> **When and how to create indexes**

---

## Should I Create an Index?

```text
START: Column used in WHERE/JOIN/ORDER BY?
  |
  +-> NO: Dont index
  |
  +-> YES:
      |
      +-> Table size > 10K rows?
          |
          +-> NO: Probably not needed
          |
          +-> YES: Check selectivity
              |
              +-> High selectivity (few matches)?
| -> GOOD candidate |
              |
              +-> Low selectivity (many matches)?
                  -> May not help

```text

---

## Index Type Decision

```text
QUERY TYPE -> INDEX TYPE

Equality (=, IN)    -> BTREE (default)
Range (<, >, BETWEEN) -> BTREE
Pattern (LIKE 'abc%') -> BTREE
Full text search    -> GIN with tsvector
JSON containment    -> GIN
Array contains      -> GIN
Spatial/Geo         -> GiST

```text

---

## Composite Index Order

```text
RULE: Most selective column first
      Unless range query involved

Query: WHERE status = 'active' AND user_id = 123
Index: (user_id, status) -- user_id more selective!

Query: WHERE date > '2024-01-01' AND user_id = 123
Index: (user_id, date) -- equality before range!

```text

---

## 🎯 CI/CD DECISION TREE

> **Choosing the right pipeline approach**

---

## When to Run Tests

```text
START: What changed?
  |
  +-> Code change in PR?
| -> Run all tests |
  |
  +-> Dependency update?
| -> Run all tests + security scan |
  |
  +-> Config change only?
| -> Run integration tests |
  |
  +-> Documentation only?
      -> Skip tests

```text

---

## Deployment Strategy Decision

```text
START: What kind of deployment?
  |
  +-> Can have downtime?
| -> Simple replace |
  |
  +-> Zero downtime needed?
      |
      +-> Easy rollback critical?
| -> Blue-green |
      |
      +-> Gradual rollout wanted?
| -> Canary |
      |
      +-> Simpler, less resources?
          -> Rolling update

```text

---

## Environment Promotion

```text
FLOW:
PR → dev → staging → production

GATES:
dev → staging: Tests pass
staging → production: QA sign-off + smoke test

```text

---
