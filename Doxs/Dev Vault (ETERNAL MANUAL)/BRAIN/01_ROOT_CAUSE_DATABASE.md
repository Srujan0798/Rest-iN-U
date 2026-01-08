# ROOT CAUSE DATABASE

## Table of Contents

- [Table of Contents](#table-of-contents)
- [HOW TO USE THIS DATABASE](#how-to-use-this-database)
- [FRONTEND ROOT CAUSES](#frontend-root-causes)
- [Symptom: Component Not Rendering](#symptom-component-not-rendering)
- [Symptom: Component Renders with Wrong Data](#symptom-component-renders-with-wrong-data)
- [Symptom: Component Re-renders Too Much](#symptom-component-re-renders-too-much)
- [Symptom: Form Not Submitting](#symptom-form-not-submitting)
- [Symptom: Styles Not Applying](#symptom-styles-not-applying)
- [BACKEND ROOT CAUSES](#backend-root-causes)
- [Symptom: API Returns 500 Error](#symptom-api-returns-500-error)
- [Symptom: API Returns Empty/Wrong Data](#symptom-api-returns-emptywrong-data)
- [Symptom: Authentication Not Working](#symptom-authentication-not-working)
- [Symptom: Route Returns 404](#symptom-route-returns-404)
- [DATABASE ROOT CAUSES](#database-root-causes)
- [Symptom: Can't Connect to Database](#symptom-cant-connect-to-database)
- [Symptom: Query Returns Error](#symptom-query-returns-error)
- [Symptom: Insert Fails](#symptom-insert-fails)
- [Symptom: Update Doesn't Persist](#symptom-update-doesnt-persist)
- [DEPLOY ROOT CAUSES](#deploy-root-causes)
- [Symptom: Build Fails](#symptom-build-fails)
- [Symptom: Works Locally, Fails in Production](#symptom-works-locally-fails-in-production)
- [Symptom: Performance Slow in Production](#symptom-performance-slow-in-production)
- [SECURITY ROOT CAUSES](#security-root-causes)
- [Symptom: CORS Error in Browser](#symptom-cors-error-in-browser)
- [Symptom: Authentication Bypassed](#symptom-authentication-bypassed)
- [Symptom: Data Leaking to Wrong User](#symptom-data-leaking-to-wrong-user)
- [QUICK LOOKUP TABLE](#quick-lookup-table)
- [By Error Message](#by-error-message)
  - [This is your DIAGNOSIS DATABASE](#this-is-your-diagnosis-database)
    - [Symptom Cause Test Fix](#symptom-cause-test-fix)
    - [No more guessing](#no-more-guessing)
- [EXTENDED ROOT CAUSE DATABASE](#extended-root-cause-database)
- [1000+ Error Patterns Across All Domains](#1000-error-patterns-across-all-domains)
- [REACT SPECIFIC ERRORS](#react-specific-errors)
- [Symptom: "Warning: Can't perform a React state update on an unmounted component"](#symptom-warning-cant-perform-a-react-state-update-on-an-unmounted-component)
  - [FIX PATTERN](#fix-pattern)
- [Symptom: "Too many re-renders. React limits the number of renders"](#symptom-too-many-re-renders-react-limits-the-number-of-renders)
  - [FIX PATTERN 2](#fix-pattern-2)
- [Symptom: "React has detected a change in the order of Hooks"](#symptom-react-has-detected-a-change-in-the-order-of-hooks)
  - [RULE](#rule)
- [Symptom: "Cannot update a component while rendering a different component"](#symptom-cannot-update-a-component-while-rendering-a-different-component)
- [Symptom: "Element type is invalid: expected a string or class/function"](#symptom-element-type-is-invalid-expected-a-string-or-classfunction)
  - [COMMON PATTERNS](#common-patterns)
- [JS SPECIFIC ERRORS](#js-specific-errors)
- [Symptom: "Error: Invariant: headers() expects to have requestAsyncStorage"](#symptom-error-invariant-headers-expects-to-have-requestasyncstorage)
- [Symptom: "Error: NEXT_REDIRECT"](#symptom-error-nextredirect)
  - [FIX PATTERN 3](#fix-pattern-3)
- [Symptom: "Error: Dynamic server usage: headers"](#symptom-error-dynamic-server-usage-headers)
- [Symptom: "Module not found: Can't resolve 'fs'"](#symptom-module-not-found-cant-resolve-fs)
  - [FIX PATTERN 4](#fix-pattern-4)
- [Symptom: "Error: Page changed from static to dynamic"](#symptom-error-page-changed-from-static-to-dynamic)
- [Symptom: "Unhandled Runtime Error: NotFoundError"](#symptom-unhandled-runtime-error-notfounderror)
- [TYPESCRIPT SPECIFIC ERRORS](#typescript-specific-errors)
- [Symptom: "Type 'X' is not assignable to type 'Y'"](#symptom-type-x-is-not-assignable-to-type-y)
  - [COMMON FIXES](#common-fixes)
- [Symptom: "Property 'X' does not exist on type 'Y'"](#symptom-property-x-does-not-exist-on-type-y)
- [Symptom: "Object is possibly 'undefined'"](#symptom-object-is-possibly-undefined)
  - [FIX PATTERNS](#fix-patterns)
- [Symptom: "Argument of type 'X' is not assignable to parameter"](#symptom-argument-of-type-x-is-not-assignable-to-parameter)
- [Symptom: "Cannot find module 'X' or its declarations"](#symptom-cannot-find-module-x-or-its-declarations)
- [PRISMA SPECIFIC ERRORS](#prisma-specific-errors)
- [Symptom: "PrismaClient is not configured to run in Vercel Edge Functions"](#symptom-prismaclient-is-not-configured-to-run-in-vercel-edge-functions)
  - [FIX](#fix)
- [Symptom: "Environment variable not found: DATABASE_URL"](#symptom-environment-variable-not-found-databaseurl)
- [Symptom: "Prisma has detected that this project was built on a different platform"](#symptom-prisma-has-detected-that-this-project-was-built-on-a-different-platform)
  - [FIX 2](#fix-2)
- [Symptom: "Unable to fit integer value X into an Int4"](#symptom-unable-to-fit-integer-value-x-into-an-int4)
  - [FIX 3](#fix-3)
- [Symptom: "Prepared statement already exists"](#symptom-prepared-statement-already-exists)
  - [FIX 4](#fix-4)
- [Symptom: "Transaction already closed"](#symptom-transaction-already-closed)
- [API INTEGRATION ERRORS](#api-integration-errors)
- [Symptom: "Network request failed"](#symptom-network-request-failed)
- [Symptom: "SyntaxError: Unexpected token < in JSON"](#symptom-syntaxerror-unexpected-token--in-json)
- [Symptom: "Failed to fetch" with no details](#symptom-failed-to-fetch-with-no-details)
- [STATE MANAGEMENT ERRORS](#state-management-errors)
- [Symptom: "Cannot read properties of undefined" in store/context](#symptom-cannot-read-properties-of-undefined-in-storecontext)
- [Symptom: Store not updating UI](#symptom-store-not-updating-ui)
  - [FIX (Zustand example)](#fix-zustand-example)
- [TAILWIND CSS ERRORS](#tailwind-css-errors)
- [Symptom: Tailwind classes not working](#symptom-tailwind-classes-not-working)
  - [FIX 5](#fix-5)
- [Symptom: Dark mode not switching](#symptom-dark-mode-not-switching)
- [AUTHENTICATION ERRORS](#authentication-errors)
- [Symptom: NextAuth "NEXTAUTH_SECRET" error](#symptom-nextauth-nextauthsecret-error)
  - [GENERATE SECRET](#generate-secret)
- [Symptom: "OAuthAccountNotLinked"](#symptom-oauthaccountnotlinked)
- [Symptom: Callback URL error in OAuth](#symptom-callback-url-error-in-oauth)
- [PERFORMANCE ISSUES](#performance-issues)
- [Symptom: Slow page load](#symptom-slow-page-load)
- [Symptom: Memory leak](#symptom-memory-leak)
- [RESPONSIVE ISSUES](#responsive-issues)
- [Symptom: Touch not working](#symptom-touch-not-working)
- [Symptom: Layout breaking on mobile](#symptom-layout-breaking-on-mobile)
  - [[TARGET: 50,000 LINES OF ROOT CAUSES]](#target-50000-lines-of-root-causes)
    - [Current: ~800 lines - Expanding systematically](#current-800-lines---expanding-systematically)
    - [Coverage: React, Next.js, TypeScript, Prisma, Auth, Performance, Mobile](#coverage-react-nextjs-typescript-prisma-auth-performance-mobile)
- [INDEX BY KEYWORD](#index-by-keyword)
- [TYPESCRIPT ERROR PATTERNS](#typescript-error-patterns)
- [TS2322: Type 'X' is not assignable to type 'Y'](#ts2322-type-x-is-not-assignable-to-type-y)
- [TS2339: Property 'X' does not exist on type 'Y'](#ts2339-property-x-does-not-exist-on-type-y)
- [TS2345: Argument type mismatch](#ts2345-argument-type-mismatch)
- [TS7006: Parameter implicitly has 'any' type](#ts7006-parameter-implicitly-has-any-type)
- [DEPLOYMENT ERROR PATTERNS](#deployment-error-patterns)
- [Vercel Build Fails](#vercel-build-fails)
- [Docker Build Fails](#docker-build-fails)
- [FIX: Multi-stage build](#fix-multi-stage-build)
- [CI/CD Pipeline Fails](#cicd-pipeline-fails)
- [ENVIRONMENT VARIABLE PATTERNS](#environment-variable-patterns)
- [ENV Not Working](#env-not-working)
- [NETWORK PATTERNS](#network-patterns)
- [CORS Errors](#cors-errors)
- [PERFORMANCE PATTERNS](#performance-patterns)
- [Slow Page Load](#slow-page-load)
- [Memory Leaks](#memory-leaks)
- [REAL PRODUCTION INCIDENTS (Sourced from Web)](#real-production-incidents-sourced-from-web)
  - [The EXACT Error](#the-exact-error)
  - [Real Incident Reports](#real-incident-reports)
  - [KEYWORDS that trigger this](#keywords-that-trigger-this)
  - [Real Fix From Production](#real-fix-from-production)
- [REACT HYDRATION MISMATCH: Text Content Does Not Match](#react-hydration-mismatch-text-content-does-not-match)
  - [The EXACT Error 2](#the-exact-error-2)
  - [Real Causes (from Next.js docs)](#real-causes-from-nextjs-docs)
  - [Real Fix From Next.js Docs](#real-fix-from-nextjs-docs)
- [VERCEL BUILD FAILS: ENOENT Case Sensitivity](#vercel-build-fails-enoent-case-sensitivity)
  - [The EXACT Error 3](#the-exact-error-3)
  - [Root Cause](#root-cause)
  - [Real Fix](#real-fix)
- [Check for case issues](#check-for-case-issues)
- [VERCEL "500 Internal Server Error" with No Logs](#vercel-500-internal-server-error-with-no-logs)
  - [The Pattern](#the-pattern)
  - [Real Causes](#real-causes)
  - [KEYWORDS that trigger this 2](#keywords-that-trigger-this-2)
  - [Real Fix 2](#real-fix-2)
- [NEXT.JS "Dynamic server usage" Error](#nextjs-dynamic-server-usage-error)
  - [The EXACT Error 4](#the-exact-error-4)
  - [KEYWORDS that trigger this 3](#keywords-that-trigger-this-3)
  - [Real Fix 3](#real-fix-3)
    - [[REAL DATA FROM WEB SOURCES]](#real-data-from-web-sources)
    - [Sources: GitHub Issues, Prisma Docs, Next.js Docs, Vercel Community](#sources-github-issues-prisma-docs-nextjs-docs-vercel-community)
    - [NOT AI-Generated - Actual production incident patterns](#not-ai-generated---actual-production-incident-patterns)
- [RECOGNITION KEYS INDEX](#recognition-keys-index)
- [COMPLETE PRISMA ERROR CODE DATABASE](#complete-prisma-error-code-database)
- [Connection Errors (P1xxx)](#connection-errors-p1xxx)
- [Query Errors (P2xxx)](#query-errors-p2xxx)
- [Prisma Accelerate/Pool Errors (P6xxx)](#prisma-acceleratepool-errors-p6xxx)
- [JS ERROR DATABASE](#js-error-database)
- [Common Next.js Production Errors](#common-nextjs-production-errors)
- [Performance Killers (from real web sources)](#performance-killers-from-real-web-sources)
  - [[SOURCED FROM REAL WEB DATA]](#sourced-from-real-web-data)
    - [Stack Overflow, Prisma Docs, LogRocket, Medium, GitHub Issues](#stack-overflow-prisma-docs-logrocket-medium-github-issues)
- [QUICK SEARCH INDEX](#quick-search-index)
- [TYPESCRIPT COMMON ERRORS (Web Sourced)](#typescript-common-errors-web-sourced)
- [Top TypeScript Production Errors](#top-typescript-production-errors)
- [tsconfig.json Critical Settings](#tsconfigjson-critical-settings)
- [VERCEL DEPLOYMENT ERRORS (Web Sourced)](#vercel-deployment-errors-web-sourced)
- [Common Vercel Build Failures](#common-vercel-build-failures)
- [Vercel Deployment Checklist](#vercel-deployment-checklist)
- [Quick Keyword Search Index](#quick-keyword-search-index)
  - [[REAL WEB-SOURCED DATA]](#real-web-sourced-data)
    - [Sources: Vercel Docs, TypeScript Docs, dev.to, Medium, Reddit 2024](#sources-vercel-docs-typescript-docs-devto-medium-reddit-2024)
- [REACT HOOKS COMMON ERRORS (Web Sourced)](#react-hooks-common-errors-web-sourced)
- [useState Errors](#usestate-errors)
- [useEffect Errors](#useeffect-errors)
- [Example Fixes](#example-fixes)
- [TAILWIND CSS COMMON ISSUES (Web Sourced)](#tailwind-css-common-issues-web-sourced)
- [Tailwind Not Working](#tailwind-not-working)
- [tailwind.config.js Critical Setup](#tailwindconfigjs-critical-setup)
- [Quick Keyword Search Index 2](#quick-keyword-search-index-2)
- [[REAL WEB-SOURCED DATA] 2](#real-web-sourced-data-2)
  - [Sources: Telerik, refine.dev, React.dev, tailwindcss.com, Stack Overflow 2024](#sources-telerik-refinedev-reactdev-tailwindcsscom-stack-overflow-2024)
- [POSTGRESQL COMMON ERRORS (Web Sourced)](#postgresql-common-errors-web-sourced)
- [Connection & Startup Errors](#connection--startup-errors)
- [Performance Errors](#performance-errors)
- [PostgreSQL Connection String Fix](#postgresql-connection-string-fix)
- [Standard PostgreSQL URL format](#standard-postgresql-url-format)
- [With SSL (production)](#with-ssl-production)
- [Connection pooling with Prisma](#connection-pooling-with-prisma)
- [NEXTAUTH / JWT COMMON ERRORS (Web Sourced)](#nextauth--jwt-common-errors-web-sourced)
- [Token & Session Errors](#token--session-errors)
- [Critical NextAuth Configuration](#critical-nextauth-configuration)
- [Environment Variables Checklist](#environment-variables-checklist)
- [REQUIRED for NextAuth](#required-for-nextauth)
- [For OAuth providers](#for-oauth-providers)
- [API DESIGN COMMON ISSUES (Web Sourced)](#api-design-common-issues-web-sourced)
- [REST API Issues](#rest-api-issues)
- [GraphQL Issues](#graphql-issues)
- [API Security Best Practices](#api-security-best-practices)
- [Quick Keyword Search Index 3](#quick-keyword-search-index-3)
- [[REAL WEB-SOURCED DATA] 2 2](#real-web-sourced-data-2-2)
  - [Sources: Percona, Clerk, Forbes, GraphQL docs, OWASP 2024](#sources-percona-clerk-forbes-graphql-docs-owasp-2024)
- [DOCKER COMMON ERRORS (Web Sourced)](#docker-common-errors-web-sourced)
- [Build & Deploy Errors](#build--deploy-errors)
- [Security Errors](#security-errors)
- [Production Dockerfile Best Practices](#production-dockerfile-best-practices)
- [PRODUCTION DOCKERFILE - Multi-stage, secure](#production-dockerfile---multi-stage-secure)
- [Security: Non-root user](#security-non-root-user)
- [Only copy what's needed](#only-copy-whats-needed)
- [Health check](#health-check)
- [CSS FLEXBOX & GRID ERRORS (Web Sourced)](#css-flexbox--grid-errors-web-sourced)
- [Flexbox Common Errors](#flexbox-common-errors)
- [Grid Common Errors](#grid-common-errors)
- [CSS Debug Quick Tips](#css-debug-quick-tips)
- [Quick Keyword Search Index 4](#quick-keyword-search-index-4)
  - [[REAL WEB-SOURCED DATA] 2 2 2](#real-web-sourced-data-2-2-2)
    - [Sources: Medium, tech-couch.com, Chrome DevTools, kombai.com 2024](#sources-medium-tech-couchcom-chrome-devtools-kombaicom-2024)
- [NPM / YARN / PNPM ERRORS (Web Sourced)](#npm--yarn--pnpm-errors-web-sourced)
- [npm Common Errors](#npm-common-errors)
- [yarn Common Errors](#yarn-common-errors)
- [pnpm Common Errors](#pnpm-common-errors)
- [Package Manager Quick Fixes](#package-manager-quick-fixes)
- [npm: Clear cache and reinstall](#npm-clear-cache-and-reinstall)
- [yarn: Clear cache and reinstall](#yarn-clear-cache-and-reinstall)
- [pnpm: Clear cache and reinstall](#pnpm-clear-cache-and-reinstall)
- [SUPABASE COMMON ERRORS (Web Sourced)](#supabase-common-errors-web-sourced)
- [Authentication Errors 2](#authentication-errors-2)
- [Database Errors](#database-errors)
- [Supabase Connection String](#supabase-connection-string)
- [Quick Keyword Search Index 5](#quick-keyword-search-index-5)
  - [[REAL WEB-SOURCED DATA] 3](#real-web-sourced-data-3)
    - [Sources: pnpm.io, yarnpkg.com, Supabase docs, Medium 2024](#sources-pnpmio-yarnpkgcom-supabase-docs-medium-2024)
- [THE IMPOSSIBLE PATTERNS](#the-impossible-patterns)
- [POSTMORTEM WISDOM](#postmortem-wisdom)
- [WHYS THAT MATTER](#whys-that-matter)
- [SENIOR DEV COMPRESSED WISDOM](#senior-dev-compressed-wisdom)
- [PATTERNS](#patterns)
- [THE DECISIONS THAT SHAPED PRODUCTION](#the-decisions-that-shaped-production)
- [FAILURE MODE CATALOG](#failure-mode-catalog)
- [SCALING TRUTHS](#scaling-truths)
- [THE COMPRESSION](#the-compression)
- [DECISION COMPRESSION ENGINE](#decision-compression-engine)
- [PATTERN: "It works locally but..."](#pattern-it-works-locally-but)
- [PATTERN: "It was working yesterday..."](#pattern-it-was-working-yesterday)
- [PATTERN: "It works once then fails..."](#pattern-it-works-once-then-fails)
- [PATTERN: "It randomly fails..."](#pattern-it-randomly-fails)
- [PATTERN: "It gets slower over time..."](#pattern-it-gets-slower-over-time)
  - [[24K GOLD DENSITY]](#24k-gold-density)
    - [From these patterns AI solves the impossible](#from-these-patterns-ai-solves-the-impossible)
- [THE PATTERNS THAT BROKE PRODUCTION](#the-patterns-that-broke-production)
- [CATASTROPHIC PATTERN: Flag Reuse](#catastrophic-pattern-flag-reuse)
- [CATASTROPHIC PATTERN: Missing Timeout](#catastrophic-pattern-missing-timeout)
- [CATASTROPHIC PATTERN: Single Point Control](#catastrophic-pattern-single-point-control)
- [DEBUGGING HEURISTICS (GOLD)](#debugging-heuristics-gold)
- [TECH DEBT DECISION MATRIX](#tech-debt-decision-matrix)
- [SCALE ARCHITECTURE TRUTHS](#scale-architecture-truths)
- [THE REAL COST OF DECISIONS](#the-real-cost-of-decisions)
- [THE IMPOSSIBLE DEBUGGING PATTERNS](#the-impossible-debugging-patterns)
- [PATTERN: "The test passes but prod fails"](#pattern-the-test-passes-but-prod-fails)
- [PATTERN: "It fails every 49.7 days"](#pattern-it-fails-every-497-days)
- [PATTERN: "Works on all machines except one"](#pattern-works-on-all-machines-except-one)
- [PATTERN: "Slow only on Tuesdays"](#pattern-slow-only-on-tuesdays)
- [PATTERN: "Random user can't login"](#pattern-random-user-cant-login)
- [PRODUCTION INTUITION RULES](#production-intuition-rules)
- [[24K GOLD: YEARS OF PAIN COMPRESSED]](#24k-gold-years-of-pain-compressed)
  - [Each line above saved a production outage](#each-line-above-saved-a-production-outage)
- [AI AGENT TRIBAL KNOWLEDGE](#ai-agent-tribal-knowledge)
- [AI HALLUCINATION PATTERNS](#ai-hallucination-patterns)
- [30% RULE (2024 Studies)](#30-rule-2024-studies)
- [PROMPT ENGINEERING FOR CODE (COMPRESSED)](#prompt-engineering-for-code-compressed)
- [THE VIBE CODING TRAP](#the-vibe-coding-trap)
- [SPECIFIC PATTERNS](#specific-patterns)
- [Cursor](#cursor)
- [Copilot](#copilot)
- [Replit AI](#replit-ai)
- [v0 / Vercel](#v0--vercel)
- [AI CODE REVIEW CHECKLIST](#ai-code-review-checklist)
- [EFFECTIVE VIBE CODING WORKFLOW](#effective-vibe-coding-workflow)
- [WHEN AI FAILS PATTERNS](#when-ai-fails-patterns)
- [[24K GOLD: AI AGENT TRIBAL KNOWLEDGE]](#24k-gold-ai-agent-tribal-knowledge)
  - [From these patterns Vibe coding that actually works](#from-these-patterns-vibe-coding-that-actually-works)
- [DATABASE QUERY TRIBAL KNOWLEDGE](#database-query-tribal-knowledge)
- [N+1 QUERY DEATH (The #1 ORM Killer)](#n1-query-death-the-1-orm-killer)
- [N+1 FIX PATTERNS (Per ORM)](#n1-fix-patterns-per-orm)
- [PATTERNS 2](#patterns-2)
- [QUERY OPTIMIZATION GOLD](#query-optimization-gold)
- [THE EXPLAIN MOMENT](#the-explain-moment)
- [CONNECTION POOL TRUTHS](#connection-pool-truths)
- [MIGRATION DISASTERS](#migration-disasters)
- [CACHING DECAY PATTERNS](#caching-decay-patterns)
- [[24K GOLD: DATABASE TRIBAL KNOWLEDGE]](#24k-gold-database-tribal-knowledge)
  - [Each pattern above saved a production incident](#each-pattern-above-saved-a-production-incident)
- [MICROSERVICES TRIBAL KNOWLEDGE](#microservices-tribal-knowledge)
- [PATTERNS 3](#patterns-3)
- [MICROSERVICES TRUTHS](#microservices-truths)
- [WHEN TO USE WHAT](#when-to-use-what)
- [FRONTEND PERFORMANCE TRIBAL KNOWLEDGE](#frontend-performance-tribal-knowledge)
- [CORE WEB VITALS (2024)](#core-web-vitals-2024)
- [PERFORMANCE KILLS](#performance-kills)
- [CRITICAL RENDERING PATH](#critical-rendering-path)
- [RATE LIMITING TRIBAL KNOWLEDGE](#rate-limiting-tribal-knowledge)
- [RATE LIMIT ALGORITHMS](#rate-limit-algorithms)
- [TOKEN BUCKET FORMULA](#token-bucket-formula)
- [RATE LIMIT DIMENSIONS](#rate-limit-dimensions)
- [RATE LIMIT RESPONSE](#rate-limit-response)
- [STATE MANAGEMENT TRIBAL KNOWLEDGE](#state-management-tribal-knowledge)
- [WHEN TO USE WHAT 2](#when-to-use-what-2)
- [ZUSTAND VS REDUX](#zustand-vs-redux)
- [PATTERNS 4](#patterns-4)
- [ZUSTAND PATTERNS](#zustand-patterns)
- [[24K GOLD: ARCHITECTURE + PERFORMANCE + STATE]](#24k-gold-architecture--performance--state)
  - [The impossible patterns, compressed](#the-impossible-patterns-compressed)
- [AUTHENTICATION TRIBAL KNOWLEDGE](#authentication-tribal-knowledge)
- [AUTH FLOW CHOICES](#auth-flow-choices)
- [JWT SECURITY TRUTHS](#jwt-security-truths)
- [SESSION COOKIE FLAGS](#session-cookie-flags)
- [PATTERNS 5](#patterns-5)
- [DEPLOYMENT TRIBAL KNOWLEDGE](#deployment-tribal-knowledge)
- [DEPLOYMENT STRATEGIES](#deployment-strategies)
- [GREEN TRUTHS](#green-truths)
- [CANARY TRUTHS](#canary-truths)
- [ROLLBACK CHECKLIST](#rollback-checklist)
- [ERROR HANDLING TRIBAL KNOWLEDGE](#error-handling-tribal-knowledge)
- [ASYNC ERROR PATTERNS](#async-error-patterns)
- [PATTERNS 6](#patterns-6)
- [ERROR RESPONSE PATTERN](#error-response-pattern)
- [TYPESCRIPT ERROR NARROWING](#typescript-error-narrowing)
- [[24K GOLD: AUTH + DEPLOY + ERROR HANDLING]](#24k-gold-auth--deploy--error-handling)
  - [The patterns that keep production alive](#the-patterns-that-keep-production-alive)
- [TESTING TRIBAL KNOWLEDGE](#testing-tribal-knowledge)
- [TESTING PYRAMID](#testing-pyramid)
- [WHEN TO USE WHAT 3](#when-to-use-what-3)
- [TESTING TRUTHS](#testing-truths)
- [WHAT TO TEST (PRIORITY ORDER)](#what-to-test-priority-order)
- [PATTERNS 7](#patterns-7)
- [OBSERVABILITY TRIBAL KNOWLEDGE](#observability-tribal-knowledge)
- [THREE PILLARS](#three-pillars)
- [STRUCTURED LOGGING PATTERN](#structured-logging-pattern)
- [LOG LEVELS TRUTHS](#log-levels-truths)
- [PATTERNS 8](#patterns-8)
- [WHAT TO MONITOR (GOLDEN SIGNALS)](#what-to-monitor-golden-signals)
- [TRACING PATTERN](#tracing-pattern)
- [[24K GOLD: TESTING + OBSERVABILITY]](#24k-gold-testing--observability)
  - [The patterns that make debugging possible](#the-patterns-that-make-debugging-possible)
- [GIT WORKFLOW TRIBAL KNOWLEDGE](#git-workflow-tribal-knowledge)
- [BRANCHING STRATEGY CHOICE](#branching-strategy-choice)
- [REBASE VS MERGE](#rebase-vs-merge)
- [GOOD: Rebase your feature on main before merge](#good-rebase-your-feature-on-main-before-merge)
- [BAD: Rebase shared branches](#bad-rebase-shared-branches)
- [CONFLICT PREVENTION](#conflict-prevention)
- [CONFLICT RESOLUTION](#conflict-resolution)
- [WEBSOCKET TRIBAL KNOWLEDGE](#websocket-tribal-knowledge)
- [WEBSOCKET SCALING TRUTHS](#websocket-scaling-truths)
- [WEBSOCKET PATTERNS](#websocket-patterns)
- [PATTERNS 9](#patterns-9)
- [CACHING TRIBAL KNOWLEDGE](#caching-tribal-knowledge)
- [CACHING PATTERNS](#caching-patterns)
- [REDIS COMMANDS YOU NEED](#redis-commands-you-need)
- [THUNDERING HERD PREVENTION](#thundering-herd-prevention)
- [CACHE INVALIDATION TRUTHS](#cache-invalidation-truths)
- [FILE UPLOAD TRIBAL KNOWLEDGE](#file-upload-tribal-knowledge)
- [LARGE FILE HANDLING](#large-file-handling)
- [FILE UPLOAD SECURITY](#file-upload-security)
- [UPLOAD SECURITY CHECKLIST](#upload-security-checklist)
- [CLOUD UPLOAD PATTERN](#cloud-upload-pattern)
- [[24K GOLD: GIT + WEBSOCKET + CACHE + FILES]](#24k-gold-git--websocket--cache--files)
  - [The patterns that prevent production disasters](#the-patterns-that-prevent-production-disasters)
- [API VERSIONING TRIBAL KNOWLEDGE](#api-versioning-tribal-knowledge)
- [VERSIONING STRATEGIES](#versioning-strategies)
- [SEMVER FOR APIs](#semver-for-apis)
- [WHAT IS A BREAKING CHANGE](#what-is-a-breaking-change)
- [DEPRECATION STRATEGY](#deprecation-strategy)
- [DATABASE MIGRATION TRIBAL KNOWLEDGE](#database-migration-tribal-knowledge)
- [CONTRACT PATTERN](#contract-pattern)
- [MIGRATION SAFETY RULES](#migration-safety-rules)
- [PATTERNS 10](#patterns-10)
- [SECRETS MANAGEMENT TRIBAL KNOWLEDGE](#secrets-management-tribal-knowledge)
- [ENV FILES ARE DANGEROUS](#env-files-are-dangerous)
- [SECRETS MANAGEMENT OPTIONS](#secrets-management-options)
- [SECRETS SECURITY CHECKLIST](#secrets-security-checklist)
- [WHAT TO DO IF SECRET LEAKED](#what-to-do-if-secret-leaked)
- [[24K GOLD: API + MIGRATION + SECRETS]](#24k-gold-api--migration--secrets)
  - [The patterns that prevent catastrophic failures](#the-patterns-that-prevent-catastrophic-failures)
- [PAGINATION TRIBAL KNOWLEDGE](#pagination-tribal-knowledge)
- [PAGINATION STRATEGIES](#pagination-strategies)
- [OFFSET VS CURSOR](#offset-vs-cursor)
- [CURSOR IMPLEMENTATION](#cursor-implementation)
- [INFINITE SCROLL TRUTHS](#infinite-scroll-truths)
- [IMAGE OPTIMIZATION TRIBAL KNOWLEDGE](#image-optimization-tribal-knowledge)
- [FORMAT CHOICE](#format-choice)
- [LAZY LOADING](#lazy-loading)
- [RESPONSIVE IMAGES](#responsive-images)
- [IMAGE OPTIMIZATION CHECKLIST](#image-optimization-checklist)
- [FORM VALIDATION TRIBAL KNOWLEDGE](#form-validation-tribal-knowledge)
- [VALIDATION LAYERS](#validation-layers)
- [ZOD SHARED VALIDATION](#zod-shared-validation)
- [PATTERNS 11](#patterns-11)
- [DEPENDENCY INJECTION TRIBAL KNOWLEDGE](#dependency-injection-tribal-knowledge)
- [DI PATTERNS](#di-patterns)
- [REACT CONTEXT DI](#react-context-di)
- [PATTERNS 12](#patterns-12)
- [WHEN TO USE DI](#when-to-use-di)
- [[24K GOLD: PAGINATION + IMAGES + VALIDATION + DI]](#24k-gold-pagination--images--validation--di)
  - [The patterns that make apps scalable and testable](#the-patterns-that-make-apps-scalable-and-testable)
- [CODE REVIEW TRIBAL KNOWLEDGE](#code-review-tribal-knowledge)
- [PR SIZE LAW](#pr-size-law)
- [WHAT TO CHECK FIRST](#what-to-check-first)
- [SECURITY REVIEW CHECKLIST](#security-review-checklist)
- [PERFORMANCE REVIEW CHECKLIST](#performance-review-checklist)
- [PATTERNS 13](#patterns-13)
- [MEMORY LEAK TRIBAL KNOWLEDGE](#memory-leak-tribal-knowledge)
- [REACT MEMORY LEAK CAUSES](#react-memory-leak-causes)
- [CLEANUP PATTERN](#cleanup-pattern)
- [DETECTION TECHNIQUES](#detection-techniques)
- [COMMON MISTAKES](#common-mistakes)
- [DATETIME TRIBAL KNOWLEDGE](#datetime-tribal-knowledge)
- [THE GOLDEN RULE](#the-golden-rule)
- [COMMON DATE BUGS](#common-date-bugs)
- [SAFE DATE PATTERNS](#safe-date-patterns)
- [TIMESTAMP TRAPS](#timestamp-traps)
- [DATABASE TIMEZONE RULE](#database-timezone-rule)
- [[24K GOLD: CODE REVIEW + MEMORY + DATETIME]](#24k-gold-code-review--memory--datetime)
  - [The patterns that prevent midnight production fires](#the-patterns-that-prevent-midnight-production-fires)
- [REGEX TRIBAL KNOWLEDGE](#regex-tribal-knowledge)
- [THE HIDDEN DDOS](#the-hidden-ddos)
- [SAFE REGEX PATTERNS](#safe-regex-patterns)
- [PREVENTION TECHNIQUES](#prevention-techniques)
- [REGEX SECURITY CHECKLIST](#regex-security-checklist)
- [RACE CONDITION TRIBAL KNOWLEDGE](#race-condition-tribal-knowledge)
- [RACE CONDITIONS IN JS](#race-conditions-in-js)
- [COMMON RACE PATTERNS](#common-race-patterns)
- [ABORTCONTROLLER PATTERN](#abortcontroller-pattern)
- [MUTEX PATTERN (JS)](#mutex-pattern-js)
- [UNICODE TRIBAL KNOWLEDGE](#unicode-tribal-knowledge)
- [FUNDAMENTALS](#fundamentals)
- [COMMON ENCODING BUGS](#common-encoding-bugs)
- [STRING LENGTH TRAPS](#string-length-traps)
- [PATTERNS 14](#patterns-14)
- [N CHECKLIST](#n-checklist)
- [[24K GOLD: REGEX + RACE CONDITIONS + UNICODE]](#24k-gold-regex--race-conditions--unicode)
  - [The patterns that handle edge cases globally](#the-patterns-that-handle-edge-cases-globally)
- [SSR HYDRATION TRIBAL KNOWLEDGE](#ssr-hydration-tribal-knowledge)
- [HYDRATION MISMATCH CAUSES](#hydration-mismatch-causes)
- [SAFE SSR PATTERNS](#safe-ssr-patterns)
- [DEBUGGING HYDRATION ERRORS](#debugging-hydration-errors)
- [COMMON INVALID HTML](#common-invalid-html)
- [MONOREPO TRIBAL KNOWLEDGE](#monorepo-tribal-knowledge)
- [PACKAGE MANAGER CHOICE](#package-manager-choice)
- [PNPM ADVANTAGE](#pnpm-advantage)
- [TURBOREPO PATTERNS](#turborepo-patterns)
- [PATTERNS 15](#patterns-15)
- [SERVERLESS COLD START TRIBAL KNOWLEDGE](#serverless-cold-start-tribal-knowledge)
- [COLD START CAUSES](#cold-start-causes)
- [COLD START OPTIMIZATION](#cold-start-optimization)
- [PACKAGE SIZE RULES](#package-size-rules)
- [COLD START NUMBERS](#cold-start-numbers)
- [GRAPHQL DATALOADER TRIBAL KNOWLEDGE](#graphql-dataloader-tribal-knowledge)
- [PROBLEM](#problem)
- [DATALOADER PATTERN](#dataloader-pattern)
- [DATALOADER RULES](#dataloader-rules)
- [GRAPHQL PERFORMANCE CHECKLIST](#graphql-performance-checklist)
- [[24K GOLD: SSR + MONOREPO + SERVERLESS + GRAPHQL]](#24k-gold-ssr--monorepo--serverless--graphql)
  - [The patterns that scale modern applications](#the-patterns-that-scale-modern-applications)
- [CORS TRIBAL KNOWLEDGE](#cors-tribal-knowledge)
- [CORS PREFLIGHT BASICS](#cors-preflight-basics)
- [REQUIRED CORS HEADERS](#required-cors-headers)
- [COMMON CORS ERRORS](#common-cors-errors)
- [CORS DEBUGGING](#cors-debugging)
- [TLS TRIBAL KNOWLEDGE](#tls-tribal-knowledge)
- [COMMON SSL ERRORS](#common-ssl-errors)
- [CERTIFICATE CHECKLIST](#certificate-checklist)
- [MIXED CONTENT](#mixed-content)
- [SSL DEBUGGING](#ssl-debugging)
- [DNS TRIBAL KNOWLEDGE](#dns-tribal-knowledge)
- [DNS PROPAGATION TRUTHS](#dns-propagation-truths)
- [TTL STRATEGY](#ttl-strategy)
- [DNS DEBUGGING COMMANDS](#dns-debugging-commands)
- [Check propagation globally](#check-propagation-globally)
- [Query specific DNS server](#query-specific-dns-server)
- [Trace full resolution path](#trace-full-resolution-path)
- [Check all records](#check-all-records)
- [Flush local cache (Windows)](#flush-local-cache-windows)
- [Flush local cache (macOS)](#flush-local-cache-macos)
- [DNS CHECKLIST](#dns-checklist)
- [[24K GOLD: CORS + SSL/TLS + DNS]](#24k-gold-cors--ssltls--dns)
  - [The patterns that fix network configuration nightmares](#the-patterns-that-fix-network-configuration-nightmares)
- [ENVIRONMENT CONFIG TRIBAL KNOWLEDGE](#environment-config-tribal-knowledge)
- [CONFIG](#config)
- [DOTENV FOR DEV ONLY](#dotenv-for-dev-only)
- [PRODUCTION SECRETS](#production-secrets)
- [ENV VALIDATION](#env-validation)
- [RETRY PATTERN TRIBAL KNOWLEDGE](#retry-pattern-tribal-knowledge)
- [WHEN TO RETRY](#when-to-retry)
- [EXPONENTIAL BACKOFF](#exponential-backoff)
- [CIRCUIT BREAKER](#circuit-breaker)
- [RESILIENCE CHECKLIST](#resilience-checklist)
- [BUNDLE OPTIMIZATION TRIBAL KNOWLEDGE](#bundle-optimization-tribal-knowledge)
- [TREE SHAKING REQUIREMENTS](#tree-shaking-requirements)
- [IMPORT PATTERNS](#import-patterns)
- [BUNDLE ANALYSIS](#bundle-analysis)
- [OPTIMIZATION CHECKLIST](#optimization-checklist)
- [RESPONSIVE DESIGN TRIBAL KNOWLEDGE](#responsive-design-tribal-knowledge)
- [FIRST APPROACH](#first-approach)
- [COMMON BREAKPOINTS](#common-breakpoints)
- [DEBUGGING MEDIA QUERIES](#debugging-media-queries)
- [PATTERNS 16](#patterns-16)
- [[24K GOLD: ENV CONFIG + RETRY + BUNDLE + RESPONSIVE]](#24k-gold-env-config--retry--bundle--responsive)
  - [The patterns that make apps work everywhere](#the-patterns-that-make-apps-work-everywhere)
- [LOGGING TRIBAL KNOWLEDGE](#logging-tribal-knowledge)
- [LOG LEVELS](#log-levels)
- [STRUCTURED LOGGING](#structured-logging)
- [WHAT TO LOG](#what-to-log)
- [CORRELATION IDS](#correlation-ids)
- [GIT REBASE TRIBAL KNOWLEDGE](#git-rebase-tribal-knowledge)
- [REBASE VS MERGE 2](#rebase-vs-merge-2)
- [REBASE CONFLICT RESOLUTION](#rebase-conflict-resolution)
- [Start rebase](#start-rebase)
- [Conflict! Git pauses](#conflict-git-pauses)
- [1. Fix conflicts in files](#1-fix-conflicts-in-files)
- [2. Stage fixed files](#2-stage-fixed-files)
- [3. Continue rebase](#3-continue-rebase)
- [Too messy? Abort](#too-messy-abort)
- [CONFLICT PREVENTION 2](#conflict-prevention-2)
- [INTERACTIVE REBASE POWER](#interactive-rebase-power)
- [Rebase last 5 commits interactively](#rebase-last-5-commits-interactively)
- [Commands](#commands)
- [pick   = use commit](#pick--use-commit)
- [squash = meld into previous](#squash--meld-into-previous)
- [edit   = stop to amend](#edit--stop-to-amend)
- [drop   = delete commit](#drop--delete-commit)
- [reword = change message](#reword--change-message)
- [REACT SERVER COMPONENTS TRIBAL KNOWLEDGE](#react-server-components-tribal-knowledge)
- [RSC VS SSR](#rsc-vs-ssr)
- [SERVER VS CLIENT](#server-vs-client)
- [STREAMING WITH SUSPENSE](#streaming-with-suspense)
- [PATTERNS 17](#patterns-17)
- [CONNECTION POOLING TRIBAL KNOWLEDGE](#connection-pooling-tribal-knowledge)
- [WHY POOLING](#why-pooling)
- [PGBOUNCER MODES](#pgbouncer-modes)
- [POOL SIZING](#pool-sizing)
- [POOLING CHECKLIST](#pooling-checklist)
- [[24K GOLD: LOGGING + GIT REBASE + RSC + CONNECTION POOLING]](#24k-gold-logging--git-rebase--rsc--connection-pooling)
  - [The patterns that scale teams and systems](#the-patterns-that-scale-teams-and-systems)
- [BROWSER STORAGE TRIBAL KNOWLEDGE](#browser-storage-tribal-knowledge)
- [STORAGE COMPARISON](#storage-comparison)
- [LOCALSTORAGE PATTERN](#localstorage-pattern)
- [PATTERNS 18](#patterns-18)
- [ACCESSIBILITY TRIBAL KNOWLEDGE](#accessibility-tribal-knowledge)
- [ARIA GOLDEN RULES](#aria-golden-rules)
- [ESSENTIAL ARIA](#essential-aria)
- [ACCESSIBILITY CHECKLIST](#accessibility-checklist)
- [EDGE CACHING TRIBAL KNOWLEDGE](#edge-caching-tribal-knowledge)
- [CONTROL HEADERS](#control-headers)
- [CDN CACHING STRATEGY](#cdn-caching-strategy)
- [PATTERNS 19](#patterns-19)
- [FEATURE FLAGS TRIBAL KNOWLEDGE](#feature-flags-tribal-knowledge)
- [FLAG TYPES](#flag-types)
- [PROGRESSIVE ROLLOUT](#progressive-rollout)
- [FLAG BEST PRACTICES](#flag-best-practices)
- [[24K GOLD: BROWSER STORAGE + ACCESSIBILITY + EDGE CACHING + FEATURE FLAGS]](#24k-gold-browser-storage--accessibility--edge-caching--feature-flags)
  - [The patterns that ship features safely](#the-patterns-that-ship-features-safely)
- [ERROR BOUNDARY TRIBAL KNOWLEDGE](#error-boundary-tribal-knowledge)
- [ERROR BOUNDARY BASICS](#error-boundary-basics)
- [WHAT ERROR BOUNDARIES CATCH](#what-error-boundaries-catch)
- [ERROR BOUNDARY PLACEMENT](#error-boundary-placement)
- [WEBSOCKET SCALING TRIBAL KNOWLEDGE](#websocket-scaling-tribal-knowledge)
- [SCALING STRATEGY](#scaling-strategy)
- [SUB PATTERN](#sub-pattern)
- [WEBSOCKET CHECKLIST](#websocket-checklist)
- [TYPESCRIPT STRICT MODE TRIBAL KNOWLEDGE](#typescript-strict-mode-tribal-knowledge)
- [TSCONFIG STRICT FLAGS](#tsconfig-strict-flags)
- [TYPE SAFETY PATTERNS](#type-safety-patterns)
- [PATTERNS 20](#patterns-20)
- [DATABASE INDEXING TRIBAL KNOWLEDGE](#database-indexing-tribal-knowledge)
- [INDEX BASICS](#index-basics)
- [WHAT TO INDEX](#what-to-index)
- [COMPOSITE INDEX RULES](#composite-index-rules)
- [INDEX DEBUGGING](#index-debugging)
- [[24K GOLD: ERROR BOUNDARIES + WEBSOCKET SCALING + TYPESCRIPT + INDEXING]](#24k-gold-error-boundaries--websocket-scaling--typescript--indexing)
  - [The patterns that prevent production disasters 2](#the-patterns-that-prevent-production-disasters-2)
- [RATE LIMITING TRIBAL KNOWLEDGE 2](#rate-limiting-tribal-knowledge-2)
- [ALGORITHM COMPARISON](#algorithm-comparison)
- [TOKEN BUCKET PATTERN](#token-bucket-pattern)
- [RATE LIMIT RESPONSE 2](#rate-limit-response-2)
- [AUTH TOKEN TRIBAL KNOWLEDGE](#auth-token-tribal-knowledge)
- [JWT VS SESSIONS](#jwt-vs-sessions)
- [JWT BEST PRACTICES](#jwt-best-practices)
- [REFRESH TOKEN ROTATION](#refresh-token-rotation)
- [DATABASE TRANSACTION TRIBAL KNOWLEDGE](#database-transaction-tribal-knowledge)
- [ACID PROPERTIES](#acid-properties)
- [ISOLATION LEVELS](#isolation-levels)
- [DEADLOCK PREVENTION](#deadlock-prevention)
- [E TESTING TRIBAL KNOWLEDGE](#e-testing-tribal-knowledge)
- [PLAYWRIGHT VS CYPRESS](#playwright-vs-cypress)
- [FLAKY TEST CAUSES](#flaky-test-causes)
- [FLAKY TEST FIXES](#flaky-test-fixes)
- [E TESTING CHECKLIST](#e-testing-checklist)
- [[24K GOLD: RATE LIMITING + AUTH TOKENS + DB TRANSACTIONS + E2E TESTING]](#24k-gold-rate-limiting--auth-tokens--db-transactions--e2e-testing)
  - [The patterns that secure and verify production apps](#the-patterns-that-secure-and-verify-production-apps)
- [DOCKER DEBUGGING TRIBAL KNOWLEDGE](#docker-debugging-tribal-knowledge)
- [ESSENTIAL DOCKER COMMANDS](#essential-docker-commands)
- [View running containers](#view-running-containers)
- [View ALL containers (including stopped)](#view-all-containers-including-stopped)
- [View logs](#view-logs)
- [Shell into running container](#shell-into-running-container)
- [Container resource usage](#container-resource-usage)
- [Detailed container info](#detailed-container-info)
- [T START](#t-start)
- [DOCKER LOGGING BEST PRACTICES](#docker-logging-best-practices)
- [REDIS CACHING TRIBAL KNOWLEDGE](#redis-caching-tribal-knowledge)
- [CACHING PATTERNS 2](#caching-patterns-2)
- [TTL GUIDELINES](#ttl-guidelines)
- [CACHE INVALIDATION](#cache-invalidation)
- [THUNDERING HERD PREVENTION 2](#thundering-herd-prevention-2)
- [REST API DESIGN TRIBAL KNOWLEDGE](#rest-api-design-tribal-knowledge)
- [VERSIONING STRATEGIES 2](#versioning-strategies-2)
- [PAGINATION PATTERNS](#pagination-patterns)
- [HTTP STATUS CODES](#http-status-codes)
- [ERROR RESPONSE FORMAT](#error-response-format)
- [SECURITY HEADERS TRIBAL KNOWLEDGE](#security-headers-tribal-knowledge)
- [ESSENTIAL SECURITY HEADERS](#essential-security-headers)
- [HTTPS enforcement](#https-enforcement)
- [Prevent clickjacking](#prevent-clickjacking)
- [XSS protection](#xss-protection)
- [Prevent MIME sniffing](#prevent-mime-sniffing)
- [Control referrer info](#control-referrer-info)
- [CSP (CONTENT SECURITY POLICY)](#csp-content-security-policy)
- [CSRF PROTECTION](#csrf-protection)
- [SECURITY CHECKLIST](#security-checklist)
- [[24K GOLD: DOCKER + REDIS + REST API + SECURITY HEADERS]](#24k-gold-docker--redis--rest-api--security-headers)
  - [The patterns that ship secure, fast, debuggable apps](#the-patterns-that-ship-secure-fast-debuggable-apps)
- [KUBERNETES DEBUGGING TRIBAL KNOWLEDGE](#kubernetes-debugging-tribal-knowledge)
- [POD DEBUGGING COMMANDS](#pod-debugging-commands)
- [View pod status](#view-pod-status)
- [Detailed pod info + events](#detailed-pod-info--events)
- [View pod logs](#view-pod-logs)
- [Previous crash logs](#previous-crash-logs)
- [Shell into running pod](#shell-into-running-pod)
- [Resource usage](#resource-usage)
- [CRASHLOOPBACKOFF CAUSES](#crashloopbackoff-causes)
- [S RESOURCE LIMITS](#s-resource-limits)
- [requests = guaranteed](#requests--guaranteed)
- [limits = maximum allowed](#limits--maximum-allowed)
- [OOMKilled = exceeded memory limit](#oomkilled--exceeded-memory-limit)
- [GRAPHQL TRIBAL KNOWLEDGE](#graphql-tribal-knowledge)
- [PROBLEM 2](#problem-2)
- [DATALOADER PATTERN 2](#dataloader-pattern-2)
- [GRAPHQL SECURITY](#graphql-security)
- [MONOREPO TRIBAL KNOWLEDGE 2](#monorepo-tribal-knowledge-2)
- [TOOL COMPARISON](#tool-comparison)
- [TURBOREPO SETUP](#turborepo-setup)
- [MONOREPO BEST PRACTICES](#monorepo-best-practices)
- [GIT BRANCHING TRIBAL KNOWLEDGE](#git-branching-tribal-knowledge)
- [BASED DEVELOPMENT](#based-development)
- [FEATURE BRANCHES](#feature-branches)
- [BRANCHING CHECKLIST](#branching-checklist)
- [[24K GOLD: KUBERNETES + GRAPHQL + MONOREPO + GIT BRANCHING]](#24k-gold-kubernetes--graphql--monorepo--git-branching)
  - [The patterns that scale teams and systems 2](#the-patterns-that-scale-teams-and-systems-2)
- [CD PIPELINE TRIBAL KNOWLEDGE](#cd-pipeline-tribal-knowledge)
- [GITHUB ACTIONS CACHING](#github-actions-caching)
- [KEY RULES](#key-rules)
- [- Include lockfile hash](#--include-lockfile-hash)
- [- Include runner.os](#--include-runneros)
- [- Use restore-keys for partial matches](#--use-restore-keys-for-partial-matches)
- [CD OPTIMIZATION](#cd-optimization)
- [MONITORING TRIBAL KNOWLEDGE](#monitoring-tribal-knowledge)
- [THREE PILLARS OF OBSERVABILITY](#three-pillars-of-observability)
- [SLO (SERVICE LEVEL OBJECTIVE)](#slo-service-level-objective)
- [ALERTING CHECKLIST](#alerting-checklist)
- [SERVERLESS TRIBAL KNOWLEDGE](#serverless-tribal-knowledge)
- [COLD START CAUSES 2](#cold-start-causes-2)
- [COLD START OPTIMIZATION 2](#cold-start-optimization-2)
- [LAMBDA BEST PRACTICES](#lambda-best-practices)
- [DATABASE MIGRATION TRIBAL KNOWLEDGE 2](#database-migration-tribal-knowledge-2)
- [CONTRACT PATTERN 2](#contract-pattern-2)
- [PATTERNS 21](#patterns-21)
- [MIGRATION CHECKLIST](#migration-checklist)
- [[24K GOLD: CI/CD + MONITORING + SERVERLESS + MIGRATIONS]](#24k-gold-cicd--monitoring--serverless--migrations)
  - [The patterns that ship and maintain production systems](#the-patterns-that-ship-and-maintain-production-systems)
- [CODE SPLITTING TRIBAL KNOWLEDGE](#code-splitting-tribal-knowledge)
- [REACT LAZY LOADING](#react-lazy-loading)
- [BASED SPLITTING](#based-splitting)
- [BUNDLE OPTIMIZATION CHECKLIST](#bundle-optimization-checklist)
- [DRIVEN ARCHITECTURE TRIBAL KNOWLEDGE](#driven-architecture-tribal-knowledge)
- [MESSAGE QUEUE COMPARISON](#message-queue-comparison)
- [DRIVEN PATTERNS](#driven-patterns)
- [MESSAGE QUEUE CHECKLIST](#message-queue-checklist)
- [API GATEWAY TRIBAL KNOWLEDGE](#api-gateway-tribal-knowledge)
- [GATEWAY RESPONSIBILITIES](#gateway-responsibilities)
- [KONG VS AWS API GATEWAY](#kong-vs-aws-api-gateway)
- [GATEWAY BEST PRACTICES](#gateway-best-practices)
- [ORM OPTIMIZATION TRIBAL KNOWLEDGE](#orm-optimization-tribal-knowledge)
- [QUERY PROBLEM](#query-problem)
- [PRISMA OPTIMIZATION](#prisma-optimization)
- [ORM CHECKLIST](#orm-checklist)
- [[24K GOLD: CODE SPLITTING + EVENT-DRIVEN + API GATEWAY + ORM]](#24k-gold-code-splitting--event-driven--api-gateway--orm)
  - [The patterns that make apps fast and scalable](#the-patterns-that-make-apps-fast-and-scalable)
- [REACT STATE MANAGEMENT TRIBAL KNOWLEDGE](#react-state-management-tribal-knowledge)
- [STATE LIBRARY COMPARISON](#state-library-comparison)
- [WHEN TO USE WHAT 4](#when-to-use-what-4)
- [STATE MANAGEMENT CHECKLIST](#state-management-checklist)
- [TESTING PYRAMID TRIBAL KNOWLEDGE](#testing-pyramid-tribal-knowledge)
- [THE TEST PYRAMID](#the-test-pyramid)
- [TEST TYPE COMPARISON](#test-type-comparison)
- [MOCKING BEST PRACTICES](#mocking-best-practices)
- [CORE WEB VITALS TRIBAL KNOWLEDGE](#core-web-vitals-tribal-knowledge)
- [METRICS](#metrics)
- [LCP OPTIMIZATION](#lcp-optimization)
- [CLS OPTIMIZATION](#cls-optimization)
- [INP OPTIMIZATION](#inp-optimization)
- [TYPESCRIPT GENERICS TRIBAL KNOWLEDGE](#typescript-generics-tribal-knowledge)
- [BASIC GENERICS](#basic-generics)
- [CONSTRAINTS AND KEYOF](#constraints-and-keyof)
- [ADVANCED TYPE PATTERNS](#advanced-type-patterns)
- [TYPESCRIPT CHECKLIST](#typescript-checklist)
- [[24K GOLD: STATE MANAGEMENT + TESTING + WEB VITALS + TYPESCRIPT]](#24k-gold-state-management--testing--web-vitals--typescript)
  - [The patterns that build quality React apps](#the-patterns-that-build-quality-react-apps)
- [BUILD TOOLS TRIBAL KNOWLEDGE](#build-tools-tribal-knowledge)
- [BUILD TOOL COMPARISON](#build-tool-comparison)
- [WHEN TO USE WHAT 5](#when-to-use-what-5)
- [BACKEND FRAMEWORKS TRIBAL KNOWLEDGE](#backend-frameworks-tribal-knowledge)
- [FRAMEWORK COMPARISON](#framework-comparison)
- [WHEN TO USE WHAT 6](#when-to-use-what-6)
- [DATABASE COMPARISON TRIBAL KNOWLEDGE](#database-comparison-tribal-knowledge)
- [POSTGRES VS MYSQL](#postgres-vs-mysql)
- [WHEN TO USE WHAT 7](#when-to-use-what-7)
- [CSS ARCHITECTURE TRIBAL KNOWLEDGE](#css-architecture-tribal-knowledge)
- [CSS APPROACH COMPARISON](#css-approach-comparison)
- [WHEN TO USE WHAT 8](#when-to-use-what-8)
- [CSS ARCHITECTURE CHECKLIST](#css-architecture-checklist)
- [[24K GOLD: BUILD TOOLS + BACKEND FRAMEWORKS + DATABASES + CSS]](#24k-gold-build-tools--backend-frameworks--databases--css)
  - [The patterns that choose the right stack](#the-patterns-that-choose-the-right-stack)
- [AUTHENTICATION TRIBAL KNOWLEDGE 2](#authentication-tribal-knowledge-2)
- [BEST PRACTICES](#best-practices)
- [TOKEN STORAGE](#token-storage)
- [COOKIE SECURITY FLAGS](#cookie-security-flags)
- [REACT HOOKS OPTIMIZATION TRIBAL KNOWLEDGE](#react-hooks-optimization-tribal-knowledge)
- [HOOK COMPARISON](#hook-comparison)
- [USECALLBACK PATTERN](#usecallback-pattern)
- [USEMEMO PATTERN](#usememo-pattern)
- [MEMOIZATION CHECKLIST](#memoization-checklist)
- [JS RSC TRIBAL KNOWLEDGE](#js-rsc-tribal-knowledge)
- [SERVER VS CLIENT COMPONENTS](#server-vs-client-components)
- [RSC DATA FETCHING](#rsc-data-fetching)
- [RSC COMPOSITION RULES](#rsc-composition-rules)
- [STREAMING WITH SUSPENSE 2](#streaming-with-suspense-2)
- [ERROR HANDLING TRIBAL KNOWLEDGE 2](#error-handling-tribal-knowledge-2)
- [ERROR BOUNDARY PATTERN](#error-boundary-pattern)
- [T CATCH](#t-catch)
- [PRODUCTION LOGGING CHECKLIST](#production-logging-checklist)
- [LOG LEVELS 2](#log-levels-2)
- [[24K GOLD: AUTH + REACT HOOKS + NEXT.JS RSC + ERROR HANDLING]](#24k-gold-auth--react-hooks--nextjs-rsc--error-handling)
  - [The patterns that build secure, fast, resilient apps](#the-patterns-that-build-secure-fast-resilient-apps)
- [AWAIT TRIBAL KNOWLEDGE](#await-tribal-knowledge)
- [PROMISE STATES](#promise-states)
- [AWAIT PATTERNS](#await-patterns)
- [ASYNC PITFALLS](#async-pitfalls)
- [ALL VS ALLSETTLED](#all-vs-allsettled)
- [API VERSIONING TRIBAL KNOWLEDGE 2](#api-versioning-tribal-knowledge-2)
- [VERSIONING METHODS](#versioning-methods)
- [BACKWARD COMPATIBILITY RULES](#backward-compatibility-rules)
- [DEPRECATION CHECKLIST](#deprecation-checklist)
- [INFRASTRUCTURE AS CODE TRIBAL KNOWLEDGE](#infrastructure-as-code-tribal-knowledge)
- [TOOL COMPARISON 2](#tool-comparison-2)
- [C BEST PRACTICES](#c-best-practices)
- [TERRAFORM PATTERNS](#terraform-patterns)
- [GOOD: Use modules](#good-use-modules)
- [GOOD: Remote state](#good-remote-state)
- [GIT CONFLICT RESOLUTION TRIBAL KNOWLEDGE](#git-conflict-resolution-tribal-knowledge)
- [CONFLICT PREVENTION 3](#conflict-prevention-3)
- [REBASE VS MERGE 3](#rebase-vs-merge-3)
- [CONFLICT RESOLUTION COMMANDS](#conflict-resolution-commands)
- [Choose your version](#choose-your-version)
- [Choose their version](#choose-their-version)
- [Use visual merge tool](#use-visual-merge-tool)
- [Auto-resolve recurring conflicts](#auto-resolve-recurring-conflicts)
- [[24K GOLD: ASYNC + API VERSIONING + IaC + GIT CONFLICTS]](#24k-gold-async--api-versioning--iac--git-conflicts)
  - [The patterns that handle complexity at scale](#the-patterns-that-handle-complexity-at-scale)
- [WEB SECURITY TRIBAL KNOWLEDGE](#web-security-tribal-knowledge)
- [XSS PREVENTION](#xss-prevention)
- [CSRF PREVENTION](#csrf-prevention)
- [SQL INJECTION PREVENTION](#sql-injection-prevention)
- [SECURITY HEADERS CHECKLIST](#security-headers-checklist)
- [REACT PROFILING TRIBAL KNOWLEDGE](#react-profiling-tribal-knowledge)
- [CHROME DEVTOOLS PERFORMANCE](#chrome-devtools-performance)
- [REACT DEVTOOLS PROFILER](#react-devtools-profiler)
- [PERFORMANCE OPTIMIZATION CHECKLIST](#performance-optimization-checklist)
- [MICROSERVICES COMMUNICATION TRIBAL KNOWLEDGE](#microservices-communication-tribal-knowledge)
- [GRPC VS REST](#grpc-vs-rest)
- [GRPC PATTERNS](#grpc-patterns)
- [SERVICE MESH BENEFITS](#service-mesh-benefits)
- [DATABASE SCALING TRIBAL KNOWLEDGE](#database-scaling-tribal-knowledge)
- [SHARDING VS REPLICATION](#sharding-vs-replication)
- [SHARDING STRATEGIES](#sharding-strategies)
- [REPLICATION STRATEGIES](#replication-strategies)
- [SCALING DECISION TREE](#scaling-decision-tree)
- [[24K GOLD: WEB SECURITY + REACT PROFILING + MICROSERVICES + DATABASE SCALING]](#24k-gold-web-security--react-profiling--microservices--database-scaling)
  - [The patterns that build secure, observable, scalable systems](#the-patterns-that-build-secure-observable-scalable-systems)
- [BROWSER DEVTOOLS TRIBAL KNOWLEDGE](#browser-devtools-tribal-knowledge)
- [NETWORK TAB ESSENTIALS](#network-tab-essentials)
- [DEBUGGING TECHNIQUES](#debugging-techniques)
- [DEVTOOLS SHORTCUTS](#devtools-shortcuts)
- [PWA TRIBAL KNOWLEDGE](#pwa-tribal-knowledge)
- [SERVICE WORKER LIFECYCLE](#service-worker-lifecycle)
- [CACHING STRATEGIES](#caching-strategies)
- [PWA CHECKLIST](#pwa-checklist)
- [FRONTEND ARCHITECTURE TRIBAL KNOWLEDGE](#frontend-architecture-tribal-knowledge)
- [ARCHITECTURE COMPARISON](#architecture-comparison)
- [FRONTEND PATTERNS](#frontend-patterns)
- [COMPONENT DESIGN PATTERNS](#component-design-patterns)
- [BACKEND PATTERNS TRIBAL KNOWLEDGE](#backend-patterns-tribal-knowledge)
- [LAYERED ARCHITECTURE](#layered-architecture)
- [REPOSITORY PATTERN](#repository-pattern)
- [SERVICE LAYER PATTERN](#service-layer-pattern)
- [PATTERN COMPARISON](#pattern-comparison)
- [[24K GOLD: DEVTOOLS + PWA + FRONTEND ARCHITECTURE + BACKEND PATTERNS]](#24k-gold-devtools--pwa--frontend-architecture--backend-patterns)
  - [The patterns that build full-stack expertise](#the-patterns-that-build-full-stack-expertise)
- [LOAD BALANCING TRIBAL KNOWLEDGE](#load-balancing-tribal-knowledge)
- [ALGORITHM COMPARISON 2](#algorithm-comparison-2)
- [ROUND ROBIN](#round-robin)
- [LEAST CONNECTIONS](#least-connections)
- [CONSISTENT HASHING](#consistent-hashing)
- [CDN TRIBAL KNOWLEDGE](#cdn-tribal-knowledge)
- [CACHE INVALIDATION STRATEGIES](#cache-invalidation-strategies)
- [CONTROL HEADERS 2](#control-headers-2)
- [Cache for 1 year (immutable assets)](#cache-for-1-year-immutable-assets)
- [Always revalidate (API responses)](#always-revalidate-api-responses)
- [Never cache (sensitive data)](#never-cache-sensitive-data)
- [CDN CHECKLIST](#cdn-checklist)
- [FORM VALIDATION TRIBAL KNOWLEDGE 2](#form-validation-tribal-knowledge-2)
- [DOUBLE VALIDATION RULE](#double-validation-rule)
- [VALIDATION ATTRIBUTES](#validation-attributes)
- [VALIDATION PATTERNS](#validation-patterns)
- [ERROR HANDLING CHECKLIST](#error-handling-checklist)
- [DISTRIBUTED TRACING TRIBAL KNOWLEDGE](#distributed-tracing-tribal-knowledge)
- [THREE PILLARS OF OBSERVABILITY 2](#three-pillars-of-observability-2)
- [TRACE CONCEPTS](#trace-concepts)
- [DISTRIBUTED TRACING TOOLS](#distributed-tracing-tools)
- [TRACING CHECKLIST](#tracing-checklist)
- [[24K GOLD: LOAD BALANCING + CDN + FORM VALIDATION + DISTRIBUTED TRACING]](#24k-gold-load-balancing--cdn--form-validation--distributed-tracing)
  - [The patterns that scale and debug production systems](#the-patterns-that-scale-and-debug-production-systems)
- [KUBERNETES TRIBAL KNOWLEDGE](#kubernetes-tribal-knowledge)
- [S CORE CONCEPTS](#s-core-concepts)
- [DEPLOYMENT STRATEGIES 2](#deployment-strategies-2)
- [ROLLING UPDATE](#rolling-update)
- [CANARY DEPLOYMENT](#canary-deployment)
- [HELM TRIBAL KNOWLEDGE](#helm-tribal-knowledge)
- [HELM CHART STRUCTURE](#helm-chart-structure)
- [HELM COMMANDS](#helm-commands)
- [Install](#install)
- [Upgrade](#upgrade)
- [Rollback](#rollback)
- [List releases](#list-releases)
- [Uninstall](#uninstall)
- [HELM BEST PRACTICES](#helm-best-practices)
- [CD TRIBAL KNOWLEDGE](#cd-tribal-knowledge)
- [GITHUB ACTIONS STRUCTURE](#github-actions-structure)
- [CD BEST PRACTICES](#cd-best-practices)
- [CACHING PATTERN](#caching-pattern)
- [DEPLOYMENT WORKFLOW](#deployment-workflow)
- [Production deployment with approval](#production-deployment-with-approval)
- [CD CHECKLIST](#cd-checklist)
- [[24K GOLD: KUBERNETES + HELM + CI/CD AUTOMATION]](#24k-gold-kubernetes--helm--cicd-automation)
  - [The patterns that deploy reliably at scale](#the-patterns-that-deploy-reliably-at-scale)
- [WEBSOCKET TRIBAL KNOWLEDGE 2](#websocket-tribal-knowledge-2)
- [WEBSOCKET VS HTTP](#websocket-vs-http)
- [SCALING WEBSOCKETS](#scaling-websockets)
- [WEBSOCKET BEST PRACTICES](#websocket-best-practices)
- [DATABASE INDEXING TRIBAL KNOWLEDGE 2](#database-indexing-tribal-knowledge-2)
- [INDEX TYPES](#index-types)
- [WHEN TO INDEX](#when-to-index)
- [EXPLAIN ANALYZE](#explain-analyze)
- [INDEXING CHECKLIST](#indexing-checklist)
- [REST API DESIGN TRIBAL KNOWLEDGE 2](#rest-api-design-tribal-knowledge-2)
- [HTTP METHOD SEMANTICS](#http-method-semantics)
- [IDEMPOTENCY PATTERN](#idempotency-pattern)
- [ERROR RESPONSE FORMAT 2](#error-response-format-2)
- [REST API CHECKLIST](#rest-api-checklist)
- [ENV VARS TRIBAL KNOWLEDGE](#env-vars-tribal-knowledge)
- [FACTOR CONFIG RULE](#factor-config-rule)
- [ENV VAR PATTERNS](#env-var-patterns)
- [Non-sensitive config](#non-sensitive-config)
- [Sensitive Use secret manager](#sensitive-use-secret-manager)
- [Store reference, not actual value](#store-reference-not-actual-value)
- [SECRET MANAGEMENT TOOLS](#secret-management-tools)
- [CONFIG CHECKLIST](#config-checklist)
- [[24K GOLD: WEBSOCKETS + DATABASE INDEXING + REST API + ENV VARS]](#24k-gold-websockets--database-indexing--rest-api--env-vars)
  - [The patterns that build production-ready applications](#the-patterns-that-build-production-ready-applications)
- [TYPESCRIPT STRICT MODE TRIBAL KNOWLEDGE 2](#typescript-strict-mode-tribal-knowledge-2)
- [STRICT MODE FLAGS](#strict-mode-flags)
- [NULL HANDLING OPERATORS](#null-handling-operators)
- [TYPE GUARD PATTERNS](#type-guard-patterns)
- [TYPESCRIPT CHECKLIST 2](#typescript-checklist-2)
- [REACT USEEFFECT TRIBAL KNOWLEDGE](#react-useeffect-tribal-knowledge)
- [USEEFFECT DEPENDENCY RULES](#useeffect-dependency-rules)
- [CLEANUP PATTERN 2](#cleanup-pattern-2)
- [COMMON USEEFFECT MISTAKES](#common-useeffect-mistakes)
- [USEEFFECT CHECKLIST](#useeffect-checklist)
- [JAVASCRIPT DEBUGGING TRIBAL KNOWLEDGE](#javascript-debugging-tribal-knowledge)
- [CONSOLE METHODS](#console-methods)
- [DEBUGGER STATEMENT](#debugger-statement)
- [DEBUGGING CHECKLIST](#debugging-checklist)
- [GIT COMMANDS TRIBAL KNOWLEDGE](#git-commands-tribal-knowledge)
- [ESSENTIAL COMMANDS](#essential-commands)
- [Status and log](#status-and-log)
- [Branching](#branching)
- [Stashing](#stashing)
- [Undoing](#undoing)
- [COMMIT BEST PRACTICES](#commit-best-practices)
- [GIT WORKFLOW](#git-workflow)
- [GIT CHECKLIST](#git-checklist)
- [[24K GOLD: TYPESCRIPT + REACT USEEFFECT + DEBUGGING + GIT]](#24k-gold-typescript--react-useeffect--debugging--git)
  - [The patterns that every developer must master](#the-patterns-that-every-developer-must-master)
- [JSON TRIBAL KNOWLEDGE](#json-tribal-knowledge)
- [DEPENDENCY TYPES](#dependency-types)
- [VERSION SYNTAX](#version-syntax)
- [NPM COMMANDS](#npm-commands)
- [NPM CHECKLIST](#npm-checklist)
- [CODE REVIEW TRIBAL KNOWLEDGE 2](#code-review-tribal-knowledge-2)
- [PR SIZE GUIDELINES](#pr-size-guidelines)
- [WHAT TO REVIEW](#what-to-review)
- [REVIEW FEEDBACK FORMAT](#review-feedback-format)
- [PERFORMANCE OPTIMIZATION TRIBAL KNOWLEDGE](#performance-optimization-tribal-knowledge)
- [FRONTEND PERFORMANCE](#frontend-performance)
- [BACKEND PERFORMANCE](#backend-performance)
- [PERFORMANCE METRICS](#performance-metrics)
- [PRODUCTION ERRORS TRIBAL KNOWLEDGE](#production-errors-tribal-knowledge)
- [COMMON PRODUCTION ERRORS](#common-production-errors)
- [INCIDENT RESPONSE](#incident-response)
- [PRODUCTION CHECKLIST](#production-checklist)
- [SESSION COMPLETE: BRAIN CROSSED 10%](#session-complete-brain-crossed-10)
- [This session added comprehensive 24K Gold tribal knowledge across](#this-session-added-comprehensive-24k-gold-tribal-knowledge-across)
  - [[24K GOLD DEV VAULT - BRAIN SECTION - 10%+ ACHIEVED]](#24k-gold-dev-vault---brain-section---10-achieved)
  - [The impossible knowledge that saves years of pain](#the-impossible-knowledge-that-saves-years-of-pain)
- [FILE UPLOAD SECURITY TRIBAL KNOWLEDGE](#file-upload-security-tribal-knowledge)
- [VALIDATION CHECKLIST](#validation-checklist)
- [FILE TYPE VALIDATION](#file-type-validation)
- [SECURE STORAGE PATTERN](#secure-storage-pattern)
- [PAGINATION TRIBAL KNOWLEDGE 2](#pagination-tribal-knowledge-2)
- [OFFSET VS CURSOR 2](#offset-vs-cursor-2)
- [OFFSET PAGINATION](#offset-pagination)
- [CURSOR PAGINATION](#cursor-pagination)
- [PAGINATION DECISION](#pagination-decision)
- [STRUCTURED LOGGING TRIBAL KNOWLEDGE](#structured-logging-tribal-knowledge)
- [STRUCTURED VS UNSTRUCTURED](#structured-vs-unstructured)
- [LOG LEVELS 3](#log-levels-3)
- [WHAT TO LOG 2](#what-to-log-2)
- [LOGGING CHECKLIST](#logging-checklist)
- [RESILIENCE PATTERNS TRIBAL KNOWLEDGE](#resilience-patterns-tribal-knowledge)
- [RETRY WITH EXPONENTIAL BACKOFF](#retry-with-exponential-backoff)
- [CIRCUIT BREAKER STATES](#circuit-breaker-states)
- [WHEN TO USE EACH](#when-to-use-each)
- [RESILIENCE CHECKLIST 2](#resilience-checklist-2)
- [[24K GOLD: FILE UPLOAD + PAGINATION + LOGGING + RESILIENCE]](#24k-gold-file-upload--pagination--logging--resilience)
  - [The patterns that build bulletproof systems](#the-patterns-that-build-bulletproof-systems)
- [DRIVEN ARCHITECTURE TRIBAL KNOWLEDGE 2](#driven-architecture-tribal-knowledge-2)
- [EDA CORE CONCEPTS](#eda-core-concepts)
- [EVENT VS COMMAND](#event-vs-command)
- [CQRS PATTERN](#cqrs-pattern)
- [EVENT SOURCING](#event-sourcing)
- [FEATURE FLAGS TRIBAL KNOWLEDGE 2](#feature-flags-tribal-knowledge-2)
- [FEATURE FLAG TYPES](#feature-flag-types)
- [PROGRESSIVE ROLLOUT 2](#progressive-rollout-2)
- [FEATURE FLAG CHECKLIST](#feature-flag-checklist)
- [DATABASE TRANSACTIONS TRIBAL KNOWLEDGE](#database-transactions-tribal-knowledge)
- [ACID PROPERTIES 2](#acid-properties-2)
- [ISOLATION LEVELS 2](#isolation-levels-2)
- [TRANSACTION CHECKLIST](#transaction-checklist)
- [VIDEO STREAMING TRIBAL KNOWLEDGE](#video-streaming-tribal-knowledge)
- [HLS VS DASH](#hls-vs-dash)
- [ADAPTIVE BITRATE STREAMING](#adaptive-bitrate-streaming)
- [BITRATE LADDER EXAMPLE](#bitrate-ladder-example)
- [STREAMING CHECKLIST](#streaming-checklist)
- [[24K GOLD: EVENT-DRIVEN + FEATURE FLAGS + TRANSACTIONS + STREAMING]](#24k-gold-event-driven--feature-flags--transactions--streaming)
  - [The patterns for modern distributed systems](#the-patterns-for-modern-distributed-systems)
- [API KEYS TRIBAL KNOWLEDGE](#api-keys-tribal-knowledge)
- [API KEY VS OAUTH](#api-key-vs-oauth)
- [API KEY BEST PRACTICES](#api-key-best-practices)
- [FLOWS](#flows)
- [TESTING STRATEGIES TRIBAL KNOWLEDGE](#testing-strategies-tribal-knowledge)
- [TESTING PYRAMID 2](#testing-pyramid-2)
- [TEST TYPES](#test-types)
- [TESTING CHECKLIST](#testing-checklist)
- [MOBILE DEVELOPMENT TRIBAL KNOWLEDGE](#mobile-development-tribal-knowledge)
- [PLATFORM OPTIONS](#platform-options)
- [MOBILE PERFORMANCE](#mobile-performance)
- [MOBILE CHECKLIST](#mobile-checklist)
- [SEARCH IMPLEMENTATION TRIBAL KNOWLEDGE](#search-implementation-tribal-knowledge)
- [SEARCH OPTIONS](#search-options)
- [SEARCH BEST PRACTICES](#search-best-practices)
- [ELASTICSEARCH BASICS](#elasticsearch-basics)
- [DESIGN SYSTEM TRIBAL KNOWLEDGE](#design-system-tribal-knowledge)
- [DESIGN TOKEN HIERARCHY](#design-token-hierarchy)
- [COMPONENT CATEGORIES](#component-categories)
- [DESIGN SYSTEM CHECKLIST](#design-system-checklist)
- [[24K GOLD: OAUTH + TESTING + MOBILE + SEARCH + DESIGN SYSTEMS]](#24k-gold-oauth--testing--mobile--search--design-systems)
  - [The patterns that complete the full-stack picture](#the-patterns-that-complete-the-full-stack-picture)
- [MONITORING AND ALERTING TRIBAL KNOWLEDGE](#monitoring-and-alerting-tribal-knowledge)
- [FOUR GOLDEN SIGNALS](#four-golden-signals)
- [ALERTING RULES](#alerting-rules)
- [MONITORING CHECKLIST](#monitoring-checklist)
- [TRIBAL KNOWLEDGE](#tribal-knowledge)
- [N BASICS](#n-basics)
- [N CHECKLIST 2](#n-checklist-2)
- [TRANSLATION KEY PATTERN](#translation-key-pattern)
- [DEBUGGING PRODUCTION TRIBAL KNOWLEDGE](#debugging-production-tribal-knowledge)
- [DEBUG CHECKLIST](#debug-checklist)
- [COMMON PRODUCTION ISSUES](#common-production-issues)
- [INCIDENT TIMELINE](#incident-timeline)
- [SYSTEM DESIGN TRIBAL KNOWLEDGE](#system-design-tribal-knowledge)
- [CAPACITY ESTIMATION](#capacity-estimation)
- [COMMON ARCHITECTURES](#common-architectures)
- [SCALING PATTERNS](#scaling-patterns)
- [SYSTEM DESIGN CHECKLIST](#system-design-checklist)
- [[24K GOLD: MONITORING + I18N + DEBUGGING + SYSTEM DESIGN]](#24k-gold-monitoring--i18n--debugging--system-design)
  - [The patterns that senior engineers know by heart](#the-patterns-that-senior-engineers-know-by-heart)
- [DOCUMENTATION TRIBAL KNOWLEDGE](#documentation-tribal-knowledge)
- [DOCUMENTATION TYPES](#documentation-types)
- [README TEMPLATE](#readme-template)
- [Project Name](#project-name)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Deployment](#deployment)
- [ADR (Architecture Decision Record)](#adr-architecture-decision-record)
- [ADR-001: Use PostgreSQL over MySQL](#adr-001-use-postgresql-over-mysql)
- [Status: Accepted](#status-accepted)
- [Context](#context)
- [Decision](#decision)
- [Consequences](#consequences)
- [RATE LIMITING TRIBAL KNOWLEDGE 3](#rate-limiting-tribal-knowledge-3)
- [RATE LIMITING ALGORITHMS](#rate-limiting-algorithms)
- [RATE LIMIT HEADERS](#rate-limit-headers)
- [RATE LIMIT CHECKLIST](#rate-limit-checklist)
- [CONCURRENCY TRIBAL KNOWLEDGE](#concurrency-tribal-knowledge)
- [CONCURRENCY ISSUES](#concurrency-issues)
- [CONCURRENCY SOLUTIONS](#concurrency-solutions)
- [CONCURRENCY CHECKLIST](#concurrency-checklist)
- [PAYMENT INTEGRATION TRIBAL KNOWLEDGE](#payment-integration-tribal-knowledge)
- [PAYMENT FLOW](#payment-flow)
- [PAYMENT CHECKLIST](#payment-checklist)
- [COMMON PAYMENT ISSUES](#common-payment-issues)
- [BACKGROUND JOBS TRIBAL KNOWLEDGE](#background-jobs-tribal-knowledge)
- [WHEN TO USE BACKGROUND JOBS](#when-to-use-background-jobs)
- [JOB QUEUE OPTIONS](#job-queue-options)
- [BACKGROUND JOB CHECKLIST](#background-job-checklist)
- [[24K GOLD: DOCUMENTATION + RATE LIMITING + CONCURRENCY + PAYMENTS + JOBS]](#24k-gold-documentation--rate-limiting--concurrency--payments--jobs)
  - [The patterns that handle enterprise requirements](#the-patterns-that-handle-enterprise-requirements)
- [NETWORKING TRIBAL KNOWLEDGE](#networking-tribal-knowledge)
- [HTTP STATUS CODES 2](#http-status-codes-2)
- [DNS BASICS](#dns-basics)
- [TCP VS UDP](#tcp-vs-udp)
- [[24K GOLD: NETWORKING FUNDAMENTALS]](#24k-gold-networking-fundamentals)
- [DEBUGGING PRODUCTION ISSUES](#debugging-production-issues)
- [Common Production Failures](#common-production-failures)
  - [Memory Leak](#memory-leak)
  - [Connection Pool Exhaustion](#connection-pool-exhaustion)
  - [Cascading Failure](#cascading-failure)
  - [Thundering Herd](#thundering-herd)
- [POSTGRES PERFORMANCE TUNING](#postgres-performance-tuning)
- [Query Analysis](#query-analysis)
  - [EXPLAIN ANALYZE 2](#explain-analyze-2)
- [Index Strategies](#index-strategies)
  - [B-tree (Default)](#b-tree-default)
  - [Composite Index](#composite-index)
  - [Partial Index](#partial-index)
- [Connection Pooling](#connection-pooling)
  - [PgBouncer Config](#pgbouncer-config)
- [Vacuum and Analyze](#vacuum-and-analyze)
- [REDIS PATTERNS](#redis-patterns)
- [Data Types](#data-types)
- [Common Patterns 2](#common-patterns-2)
  - [Cache with TTL](#cache-with-ttl)
  - [Rate Limiting](#rate-limiting)
  - [Session Storage](#session-storage)
  - [Pub/Sub](#pubsub)
  - [Leaderboard](#leaderboard)
- [SQL INJECTION PREVENTION 2](#sql-injection-prevention-2)
- [The Vulnerability](#the-vulnerability)
- [Prevention: Parameterized Queries](#prevention-parameterized-queries)
- [ORM Protection](#orm-protection)
- [Additional Measures](#additional-measures)
- [MIGRATION DISASTERS 2](#migration-disasters-2)
- [Common Mistakes 2](#common-mistakes-2)
  - [Adding NOT NULL without default](#adding-not-null-without-default)
  - [Changing column type](#changing-column-type)
  - [Large table migration](#large-table-migration)
- [Safe Migration Steps](#safe-migration-steps)
- [MEMORY LEAKS IN NODE.JS](#memory-leaks-in-nodejs)
- [Common Causes](#common-causes)
  - [N+1 Queries](#n1-queries)
  - [Missing Indexes](#missing-indexes)
  - [Synchronous Operations](#synchronous-operations)
  - [No Caching](#no-caching)
- [Detection](#detection)
- [REACT PERFORMANCE ISSUES](#react-performance-issues)
- [Unnecessary Re-renders](#unnecessary-re-renders)
  - [Problem: Parent re-render cascades](#problem-parent-re-render-cascades)
  - [Problem: Creating objects in render](#problem-creating-objects-in-render)
- [Large Lists](#large-lists)
- [Profiling](#profiling)
- [CORS ERRORS EXPLAINED](#cors-errors-explained)
- [Common Errors](#common-errors)
  - ["No Access-Control-Allow-Origin"](#no-access-control-allow-origin)
  - ["Preflight response fails"](#preflight-response-fails)
  - ["Credentials not supported"](#credentials-not-supported)
- [Debug Steps](#debug-steps)
- [DOCKER TROUBLESHOOTING](#docker-troubleshooting)
- [Container Wont Start](#container-wont-start)
  - [Check logs](#check-logs)
  - [Common causes 2](#common-causes-2)
- [Image Build Fails](#image-build-fails)
  - [Cache issues](#cache-issues)
  - [Wrong context](#wrong-context)
- [Container Running but App Not Working](#container-running-but-app-not-working)
  - [Shell into container](#shell-into-container)
  - [Check process](#check-process)
  - [Check networking](#check-networking)
- [Common Fixes 2](#common-fixes-2)
- [JWT VULNERABILITIES](#jwt-vulnerabilities)
- [Algorithm Confusion](#algorithm-confusion)
- [Weak Secrets](#weak-secrets)
- [No Expiration](#no-expiration)
- [Sensitive Data in Payload](#sensitive-data-in-payload)
- [Best Practices 2](#best-practices-2)
- [SLOW API RESPONSES](#slow-api-responses)
- [Common Causes 2 2](#common-causes-2-2)
  - [N+1 Queries 2](#n1-queries-2)
  - [Missing Indexes 2](#missing-indexes-2)
  - [Synchronous Operations 2](#synchronous-operations-2)
  - [No Caching 2](#no-caching-2)
- [CONFIGURATION MISTAKES](#configuration-mistakes)
- [Hardcoded Secrets](#hardcoded-secrets)
- [Missing Env Validation](#missing-env-validation)
- [Wrong Environment](#wrong-environment)
- [Sensitive Data in Logs](#sensitive-data-in-logs)
- [MONITORING GAPS](#monitoring-gaps)
- [What to Monitor](#what-to-monitor)
  - [Infrastructure](#infrastructure)
  - [Application](#application)
  - [Business](#business)
- [Alert Fatigue](#alert-fatigue)
- [Missing Traces](#missing-traces)
- [Dashboard Tips](#dashboard-tips)
- [PATTERNS 22](#patterns-22)
- [Flaky Tests](#flaky-tests)
- [Testing Implementation](#testing-implementation)
- [No Isolation](#no-isolation)
- [Mocking Wrong Layer](#mocking-wrong-layer)
- [NETWORK DEBUGGING](#network-debugging)
- [DNS Issues](#dns-issues)
- [Check DNS resolution](#check-dns-resolution)
- [Common issues](#common-issues)
- [- DNS propagation (TTL)](#--dns-propagation-ttl)
- [- Wrong DNS server](#--wrong-dns-server)
- [- DNS cache](#--dns-cache)
- [SSL/TLS Issues](#ssltls-issues)
- [Check certificate](#check-certificate)
- [Common issues 2](#common-issues-2)
- [- Certificate expired](#--certificate-expired)
- [- Wrong hostname](#--wrong-hostname)
- [- Incomplete chain](#--incomplete-chain)
- [- Self-signed in production](#--self-signed-in-production)
- [Timeout Root Causes](#timeout-root-causes)
- [Debugging Tools](#debugging-tools)
- [Test connectivity](#test-connectivity)
- [Check open ports](#check-open-ports)
- [Trace route](#trace-route)
- [Check local ports](#check-local-ports)
- [ULTRA DENSE](#ultra-dense)
- [PostgreSQL Silent Killers](#postgresql-silent-killers)
  - [Autovacuum Blocked by Long Transactions](#autovacuum-blocked-by-long-transactions)
  - [Prepared Statement Explosion](#prepared-statement-explosion)
  - [Integer Overflow at 2.1B Rows](#integer-overflow-at-21b-rows)
- [Node.js Deep Gotchas](#nodejs-deep-gotchas)
  - [Event Loop Starvation](#event-loop-starvation)
  - [Memory Leak via Console.log](#memory-leak-via-consolelog)
  - [DNS Resolution Caching](#dns-resolution-caching)
- [React Edge Cases](#react-edge-cases)
  - [State Update on Unmounted Component](#state-update-on-unmounted-component)
  - [useEffect Firing Twice (Strict Mode)](#useeffect-firing-twice-strict-mode)
  - [Closure Over Stale State](#closure-over-stale-state)
- [IMPOSSIBLE PATTERNS](#impossible-patterns)
- [Timezone Hell](#timezone-hell)
  - [UTC vs Local Murder](#utc-vs-local-murder)
  - [Daylight Saving Edge Case](#daylight-saving-edge-case)
- [Floating Point Crimes](#floating-point-crimes)
  - [Money Math Disaster](#money-math-disaster)
  - [JSON.stringify Loses Precision](#jsonstringify-loses-precision)
- [Encoding Nightmares](#encoding-nightmares)
  - [UTF-8 BOM Kills JSON Parse](#utf-8-bom-kills-json-parse)
  - [Base64 URL-Safe vs Standard](#base64-url-safe-vs-standard)
- [Concurrency Traps](#concurrency-traps)
  - [Database Optimistic Lock Lost Update](#database-optimistic-lock-lost-update)
  - [Redis INCR vs GET+SET Race](#redis-incr-vs-getset-race)
- [INFRASTRUCTURE LANDMINES](#infrastructure-landmines)
- [Kubernetes Secrets in Plain Text](#kubernetes-secrets-in-plain-text)
- [Docker Build Cache Invalidation](#docker-build-cache-invalidation)
- [WRONG: Any file change busts cache](#wrong-any-file-change-busts-cache)
- [RIGHT: Dependencies cached separately](#right-dependencies-cached-separately)
- [Load Balancer Sticky Sessions Break Deploys](#load-balancer-sticky-sessions-break-deploys)
- [AWS Lambda Cold Start Stack](#aws-lambda-cold-start-stack)
- [Rate Limit Headers Nobody Reads](#rate-limit-headers-nobody-reads)
- [SECURITY BLIND SPOTS](#security-blind-spots)
- [Mass Assignment Attack](#mass-assignment-attack)
- [Regex DoS (ReDoS)](#regex-dos-redos)
- [JWT None Algorithm Attack](#jwt-none-algorithm-attack)
- [GraphQL Depth Attack](#graphql-depth-attack)
- [ATTACK: Deeply nested query crashes server](#attack-deeply-nested-query-crashes-server)
- [SSRF via PDF Generation](#ssrf-via-pdf-generation)
- [Timing Attack on String Compare](#timing-attack-on-string-compare)
- [INTUITIVE FACTS](#intuitive-facts)
- ["More Indexes = Faster" IS WRONG](#more-indexes--faster-is-wrong)
- ["Async = Faster" IS WRONG](#async--faster-is-wrong)
- ["Caching Everything = Fast" IS WRONG](#caching-everything--fast-is-wrong)
- ["Connection Pooling Always Helps" IS WRONG](#connection-pooling-always-helps-is-wrong)
- ["Microservices = Better" IS WRONG](#microservices--better-is-wrong)
- [DEBUGGING IMPOSSIBLE BUGS](#debugging-impossible-bugs)
- [Works Locally, Fails in Production](#works-locally-fails-in-production)
- [Works Yesterday, Fails Today](#works-yesterday-fails-today)
- [Fails Randomly](#fails-randomly)
- [Error Message Lies](#error-message-lies)
- [SPECIFIC GOTCHAS](#specific-gotchas)
- [Node.js 18 Fetch](#nodejs-18-fetch)
- [React 18 Auto Batching](#react-18-auto-batching)
- [Next.js 13+ App Router](#nextjs-13-app-router)
- [TypeScript 5 Decorators](#typescript-5-decorators)
- [PostgreSQL 14+ Idle Transaction Timeout](#postgresql-14-idle-transaction-timeout)
- [PERFORMANCE NUMBERS TO MEMORIZE](#performance-numbers-to-memorize)
- [LATENCY COMPARISON](#latency-comparison)
- [BACK OF ENVELOPE](#back-of-envelope)
- [REQUEST BUDGET](#request-budget)
- [MEMORY MATH](#memory-math)
- [API DESIGN TRAPS](#api-design-traps)
- [Breaking Changes Hall of Shame](#breaking-changes-hall-of-shame)
- [Pagination Disasters](#pagination-disasters)
- [ID Design Mistakes](#id-design-mistakes)
- [Null vs Undefined vs Omitted](#null-vs-undefined-vs-omitted)
- [PATTERNS 23](#patterns-23)
- [EAV Pattern Disaster](#eav-pattern-disaster)
- [Soft Delete Gotcha](#soft-delete-gotcha)
- [JSON Column Abuse](#json-column-abuse)
- [Missing Partial Index](#missing-partial-index)
- [DEPLOYMENT NIGHTMARES](#deployment-nightmares)
- [Backward Compatibility Window](#backward-compatibility-window)
- [Database Migration Lock](#database-migration-lock)
- [Feature Flag Explosion](#feature-flag-explosion)
- [Zero Downtime Deploy Checklist](#zero-downtime-deploy-checklist)
- [DISTRIBUTED SYSTEMS HELL](#distributed-systems-hell)
- [Split Brain Scenario](#split-brain-scenario)
- [Clock Skew Disasters](#clock-skew-disasters)
- [Eventually Consistent Reads](#eventually-consistent-reads)
- [The Two Generals Problem](#the-two-generals-problem)
- [Thundering Herd 2](#thundering-herd-2)
- [HIDDEN PERFORMANCE KILLERS](#hidden-performance-killers)
- [DNS Resolution Per Request](#dns-resolution-per-request)
- [Connection Establishment Overhead](#connection-establishment-overhead)
- [GC Pause Spikes](#gc-pause-spikes)
- [Database Connection Pool Starvation](#database-connection-pool-starvation)
- [JSON Parse/Stringify Cost](#json-parsestringify-cost)
- [JAVASCRIPT QUIRKS THAT BITE](#javascript-quirks-that-bite)
- [Array Sort Mutates](#array-sort-mutates)
- [typeof null === 'object'](#typeof-null--object)
- [Array Holes](#array-holes)
- [parseInt Gotchas](#parseint-gotchas)
- [Implicit Type Coercion](#implicit-type-coercion)
- [Floating Point Comparison](#floating-point-comparison)
- [AUTH EDGE CASES](#auth-edge-cases)
- [Token Revocation Gap](#token-revocation-gap)
- [OAuth State Mismatch](#oauth-state-mismatch)
- [Password Reset Token Replay](#password-reset-token-replay)
- [Session Fixation](#session-fixation)
- [Insecure Remember Me](#insecure-remember-me)
- [INCIDENT RESPONSE PATTERNS](#incident-response-patterns)
- [Immediate Actions (First 5 Minutes)](#immediate-actions-first-5-minutes)
- [Mitigation Hierarchy](#mitigation-hierarchy)
- [Post-Incident Checklist](#post-incident-checklist)
- [Blameless Postmortem Format](#blameless-postmortem-format)
- [Incident Summary](#incident-summary)
- [Impact](#impact)
- [Timeline](#timeline)
- [Root Cause 2](#root-cause-2)
- [Action Items](#action-items)
- [ELASTICSEARCH GOTCHAS](#elasticsearch-gotchas)
- [Mapping Explosion](#mapping-explosion)
- [Refresh Interval vs Real-Time](#refresh-interval-vs-real-time)
- [Deep Pagination Disaster](#deep-pagination-disaster)
- [Analyzer Mismatch](#analyzer-mismatch)
- [KUBERNETES PRODUCTION ISSUES](#kubernetes-production-issues)
- [Resource Limits Gotcha](#resource-limits-gotcha)
- [Liveness Probe Suicide](#liveness-probe-suicide)
- [Pod Affinity Hell](#pod-affinity-hell)
- [ConfigMap Propagation Delay](#configmap-propagation-delay)
- [Service Mesh Latency](#service-mesh-latency)
- [CACHING TRAPS](#caching-traps)
- [Cache Key Collision](#cache-key-collision)
- [Negative Caching Poison](#negative-caching-poison)
- [Stale Read After Write](#stale-read-after-write)
- [Serialization Version Mismatch](#serialization-version-mismatch)
- [TTL Synchronization Storm](#ttl-synchronization-storm)
- [TYPESCRIPT SURPRISES](#typescript-surprises)
- [Type Narrowing Reset](#type-narrowing-reset)
- [Object.keys Returns string[]](#objectkeys-returns-string)
- [Excess Property Checking Workaround](#excess-property-checking-workaround)
- [Enums Are Not Type-Safe](#enums-are-not-type-safe)
- [Optional Chaining Precedence](#optional-chaining-precedence)
- [BUNDLER TRAPS](#bundler-traps)
- [Circular Dependency Crash](#circular-dependency-crash)
- [Tree Shaking Failure](#tree-shaking-failure)
- [Dev vs Prod Mismatch](#dev-vs-prod-mismatch)
- [CSS Ordering Issue](#css-ordering-issue)
- [Dynamic Import Path](#dynamic-import-path)
- [DOCKER IN PRODUCTION](#docker-in-production)
- [Alpine + Node.js DNS Issue](#alpine--nodejs-dns-issue)
- [Layer Ordering Performance](#layer-ordering-performance)
- [BAD: Any code change rebuilds npm install](#bad-any-code-change-rebuilds-npm-install)
- [GOOD: Dependencies cached separately](#good-dependencies-cached-separately)
- [EVEN BETTER: Multi-stage](#even-better-multi-stage)
- [Zombie Processes](#zombie-processes)
- [Build Args vs Env Vars](#build-args-vs-env-vars)
- [BUILD TIME: ARG](#build-time-arg)
- [RUN TIME: ENV](#run-time-env)
- [Cannot change without rebuild](#cannot-change-without-rebuild)
- [.dockerignore Forgotten](#dockerignore-forgotten)
- [CRYPTO MISTAKES](#crypto-mistakes)
- [ECB Mode Pattern Leak](#ecb-mode-pattern-leak)
- [IV Reuse Disaster](#iv-reuse-disaster)
- [Weak Random for Crypto](#weak-random-for-crypto)
- [Timing Attack on Comparison](#timing-attack-on-comparison)
- [Password Hash Too Fast](#password-hash-too-fast)
- [NETWORK EDGE CASES](#network-edge-cases)
- [TCP Keepalive vs HTTP Keepalive](#tcp-keepalive-vs-http-keepalive)
- [Load Balancer Connection Reuse](#load-balancer-connection-reuse)
- [NAT Timeout vs Keepalive](#nat-timeout-vs-keepalive)
- [TLS Cipher Mismatch](#tls-cipher-mismatch)
- [MTU Black Hole](#mtu-black-hole)
- [MICROSERVICES DISASTER PATTERNS](#microservices-disaster-patterns)
- [Distributed Monolith](#distributed-monolith)
- [Chatty Services](#chatty-services)
- [Distributed Transaction Fail](#distributed-transaction-fail)
- [Service Discovery Stale](#service-discovery-stale)
- [Correlated Failures](#correlated-failures)
- [WEBSOCKET PRODUCTION ISSUES](#websocket-production-issues)
- [Connection Limit Per Server](#connection-limit-per-server)
- [Ping/Pong Missed](#pingpong-missed)
- [Message Ordering Lost](#message-ordering-lost)
- [Reconnection Thunder](#reconnection-thunder)
- [Memory Per Connection](#memory-per-connection)
- [AUTHORIZATION EDGE CASES](#authorization-edge-cases)
- [Horizontal Privilege Escalation](#horizontal-privilege-escalation)
- [IDOR in File Paths](#idor-in-file-paths)
- [Insecure Direct Object Reference](#insecure-direct-object-reference)
- [Role Check At Wrong Layer](#role-check-at-wrong-layer)
- [JWT Role Cached](#jwt-role-cached)
- [LOGGING DISASTERS](#logging-disasters)
- [Log Missing When Needed](#log-missing-when-needed)
- [Log Explosion](#log-explosion)
- [PII in Logs](#pii-in-logs)
- [Timestamp Without Timezone](#timestamp-without-timezone)
- [Missing Request Context](#missing-request-context)
- [DATABASE LOCKING NIGHTMARES](#database-locking-nightmares)
- [Deadlock Spiral](#deadlock-spiral)
- [Gap Lock Surprise (MySQL InnoDB)](#gap-lock-surprise-mysql-innodb)
- [Advisory Lock Forgotten](#advisory-lock-forgotten)
- [Long Transaction Blocks Vacuum](#long-transaction-blocks-vacuum)
- [SELECT FOR UPDATE SKIP LOCKED](#select-for-update-skip-locked)
- [PAYMENT INTEGRATION TRAPS](#payment-integration-traps)
- [Double Charge on Retry](#double-charge-on-retry)
- [Webhook Verification Skip](#webhook-verification-skip)
- [Currency Decimal Trap](#currency-decimal-trap)
- [Webhook Ordering Assumptions](#webhook-ordering-assumptions)
- [Refund After Settlement](#refund-after-settlement)
- [AWAIT ANTIPATTERNS](#await-antipatterns)
- [Unhandled Promise Rejection](#unhandled-promise-rejection)
- [Await in Loop](#await-in-loop)
- [Try-Catch Misplacement](#try-catch-misplacement)
- [Returning Inside Finally](#returning-inside-finally)
- [Mixed Callbacks and Promises](#mixed-callbacks-and-promises)
- [HTTP CLIENT TRAPS](#http-client-traps)
- [Connection Pool Exhaustion 2](#connection-pool-exhaustion-2)
- [Axios vs Fetch Default Timeout](#axios-vs-fetch-default-timeout)
- [Response Body Not Consumed](#response-body-not-consumed)
- [Content-Length Mismatch](#content-length-mismatch)
- [Retry Idempotency](#retry-idempotency)
- [JS PRODUCTION GOTCHAS](#js-production-gotchas)
- [ISR Stale During Deploy](#isr-stale-during-deploy)
- [API Route Cold Start](#api-route-cold-start)
- [Hydration Mismatch](#hydration-mismatch)
- [getServerSideProps Blocking](#getserversideprops-blocking)
- [Image Optimization Limits](#image-optimization-limits)
- [PRODUCTION SECRETS MANAGEMENT](#production-secrets-management)
- [Env File Committed](#env-file-committed)
- [Secrets in Docker Image](#secrets-in-docker-image)
- [SECRET VISIBLE](#secret-visible)
- [Logging Secrets](#logging-secrets)
- [Hardcoded in Frontend](#hardcoded-in-frontend)
- [Rotation Without Downtime](#rotation-without-downtime)
- [QUEUE PROCESSING FAILURES](#queue-processing-failures)
- [Poison Message Loop](#poison-message-loop)
- [At-Least-Once Surprise](#at-least-once-surprise)
- [Job Priority Starvation](#job-priority-starvation)
- [Invisible Message After Crash](#invisible-message-after-crash)
- [Backpressure Ignored](#backpressure-ignored)
- [LINUX PRODUCTION ISSUES](#linux-production-issues)
- [File Descriptor Exhaustion](#file-descriptor-exhaustion)
- [OOM Killer](#oom-killer)
- [Ephemeral Port Exhaustion](#ephemeral-port-exhaustion)
- [Disk Full Silent Failures](#disk-full-silent-failures)
- [Clock Drift](#clock-drift)
- [CD PIPELINE DISASTERS](#cd-pipeline-disasters)
- [Cache Poisoning](#cache-poisoning)
- [Flaky Tests Block Deploy](#flaky-tests-block-deploy)
- [Parallel Job Race Conditions](#parallel-job-race-conditions)
- [Secret in Build Logs](#secret-in-build-logs)
- [Visible in CI logs](#visible-in-ci-logs)
- [Rollback Fails When Needed](#rollback-fails-when-needed)
- [FINAL IMPOSSIBLE KNOWLEDGE DUMP](#final-impossible-knowledge-dump)
- [Production Readiness Checklist](#production-readiness-checklist)
- [Debug Order for Unknown Issues](#debug-order-for-unknown-issues)
- [The Hierarchy of Debugging](#the-hierarchy-of-debugging)
- [Incident Severity Matrix](#incident-severity-matrix)
- [Experience Multipliers](#experience-multipliers)
- [RACE CONDITION FIXES](#race-condition-fixes)
- [Database Level Locks](#database-level-locks)
- [Application Level Locks](#application-level-locks)
- [Queue-Based Serialization](#queue-based-serialization)
- [AUTH STATE MACHINE](#auth-state-machine)
- [Authentication States](#authentication-states)
- [Implementation](#implementation)
- [ENVIRONMENT VARIABLE GOTCHAS](#environment-variable-gotchas)
- [Boolean Trap](#boolean-trap)
- [Missing Variable Silent Fail](#missing-variable-silent-fail)
- [Different in Docker](#different-in-docker)
- [Newline in Value](#newline-in-value)
- [.env file](#env-file)
- [Problem: Many parsers break on newlines](#problem-many-parsers-break-on-newlines)
- [DEPENDENCY UPGRADE DISASTERS](#dependency-upgrade-disasters)
- [Major Version Trap](#major-version-trap)
- [Transitive Dependency Nightmare](#transitive-dependency-nightmare)
- [Breaking in Minor Version](#breaking-in-minor-version)
- [Peer Dependency Hell](#peer-dependency-hell)
- [COMMON DEBUGGING COMMANDS](#common-debugging-commands)
- [Docker](#docker)
- [View logs 2](#view-logs-2)
- [Shell into container 2](#shell-into-container-2)
- [Inspect container](#inspect-container)
- [List processes](#list-processes)
- [View resource usage](#view-resource-usage)
- [Kubernetes](#kubernetes)
- [Pod logs](#pod-logs)
- [Previous pod logs](#previous-pod-logs)
- [Describe (events, status)](#describe-events-status)
- [Shell into pod](#shell-into-pod)
- [Port forward](#port-forward)
- [PostgreSQL](#postgresql)
- [TLS TROUBLESHOOTING](#tls-troubleshooting)
- [Common Certificate Errors](#common-certificate-errors)
- [Debug Commands](#debug-commands)
- [Check certificate details](#check-certificate-details)
- [View certificate chain](#view-certificate-chain)
- [Check expiry](#check-expiry)
- [Verify chain manually](#verify-chain-manually)
- [Certificate Order](#certificate-order)
- [DATABASE SHARDING MISTAKES](#database-sharding-mistakes)
- [Wrong Shard Key](#wrong-shard-key)
- [Cross-Shard Queries](#cross-shard-queries)
- [Resharding Nightmare](#resharding-nightmare)
- [DISTRIBUTED TRACING](#distributed-tracing)
- [Core Concepts](#core-concepts)
- [OpenTelemetry Setup](#opentelemetry-setup)
- [Best Practices 3](#best-practices-3)
- [LOAD BALANCING STRATEGIES](#load-balancing-strategies)
- [Algorithms](#algorithms)
- [Health Checks](#health-checks)
- [ALB health check](#alb-health-check)
- [Session Affinity](#session-affinity)
- [FEATURE FLAG PATTERNS](#feature-flag-patterns)
- [Flag Types 2](#flag-types-2)
- [Implementation 2](#implementation-2)
- [Flag Lifecycle](#flag-lifecycle)
- [EVENT SOURCING PATTERNS](#event-sourcing-patterns)
- [Core Concepts 2](#core-concepts-2)
- [Event Store Structure](#event-store-structure)
- [Projections](#projections)
- [Snapshots](#snapshots)
- [MEMORY LEAK DEBUGGING](#memory-leak-debugging)
- [Node.js Heap Snapshots](#nodejs-heap-snapshots)
- [Common Leak Patterns](#common-leak-patterns)
- [Detection 2](#detection-2)
- [Monitor RSS over time](#monitor-rss-over-time)
- [Force GC and check](#force-gc-and-check)
- [Use clinic.js](#use-clinicjs)
- [GRACEFUL DEGRADATION PATTERNS](#graceful-degradation-patterns)
- [Fallback Strategies](#fallback-strategies)
- [Feature Toggles for Degradation](#feature-toggles-for-degradation)
- [Load Shedding](#load-shedding)
- [API ERROR HANDLING](#api-error-handling)
- [Error Response Format 3](#error-response-format-3)
- [HTTP Status Codes 3](#http-status-codes-3)
- [Error Middleware](#error-middleware)
- [DEBUGGING IN PRODUCTION](#debugging-in-production)
- [Remote Debugging Checklist](#remote-debugging-checklist)
- [Dynamic Log Levels](#dynamic-log-levels)
- [Feature Flags for Debugging](#feature-flags-for-debugging)
- [WEBSOCKET PRODUCTION PATTERNS](#websocket-production-patterns)
- [Connection Management](#connection-management)
- [Scaling WebSockets 2](#scaling-websockets-2)
- [Reconnection Strategy](#reconnection-strategy)
- [CACHE INVALIDATION STRATEGIES 2](#cache-invalidation-strategies-2)
- [TTL-Based](#ttl-based)
- [Write-Through](#write-through)
- [Event-Driven Invalidation](#event-driven-invalidation)
- [Cache-Aside Pattern](#cache-aside-pattern)
- [ZERO DOWNTIME DEPLOYMENT](#zero-downtime-deployment)
- [Rolling Update 2](#rolling-update-2)
- [Kubernetes 2](#kubernetes-2)
- [Process](#process)
- [1. Start new pod (4 total)](#1-start-new-pod-4-total)
- [2. New pod healthy? Terminate old (3)](#2-new-pod-healthy-terminate-old-3)
- [3. Repeat until all replaced](#3-repeat-until-all-replaced)
- [Blue-Green](#blue-green)
- [Canary](#canary)
- [Database Considerations](#database-considerations)
- [TYPESCRIPT STRICT MODE PATTERNS](#typescript-strict-mode-patterns)
- [Strict Mode Options](#strict-mode-options)
- [Type Guards](#type-guards)
- [Zod for Runtime Validation](#zod-for-runtime-validation)
- [PRODUCTION MONITORING CHECKLIST](#production-monitoring-checklist)
- [Golden Signals](#golden-signals)
- [Alerting Rules 2](#alerting-rules-2)
- [Dashboard Essentials](#dashboard-essentials)
- [FINAL PRODUCTION WISDOM](#final-production-wisdom)
- [The 3 AM Rule](#the-3-am-rule)
- [Deployment Checklist](#deployment-checklist)
- [When Things Break](#when-things-break)
- [Career-Saving Facts](#career-saving-facts)
- [DEVELOPER TRUTH](#developer-truth)
- [SERVERLESS EDGE FUNCTION GOTCHAS](#serverless-edge-function-gotchas)
- [Cold Start Death Spiral](#cold-start-death-spiral)
- [Memory Limit Exceeded](#memory-limit-exceeded)
- [Timeout Trap](#timeout-trap)
- [Edge vs Serverless](#edge-vs-serverless)
- [JS PRODUCTION GOTCHAS 2](#js-production-gotchas-2)
- [Hydration Mismatch 2](#hydration-mismatch-2)
- [Dynamic Import Issues](#dynamic-import-issues)
- [Image Optimization Limits 2](#image-optimization-limits-2)
- [ISR Revalidation](#isr-revalidation)
- [PRISMA PRODUCTION PATTERNS](#prisma-production-patterns)
- [P2024 Connection Pool Exhaustion](#p2024-connection-pool-exhaustion)
- [N+1 Query Problem](#n1-query-problem)
- [Transaction Patterns](#transaction-patterns)
- [Soft Delete Pattern](#soft-delete-pattern)
- [TLS GOTCHAS](#tls-gotchas)
- [Certificate Expiry](#certificate-expiry)
- [Mixed Content 2](#mixed-content-2)
- [Certificate Chain Issues](#certificate-chain-issues)
- [HSTS Preload Trap](#hsts-preload-trap)
- [GRAPHQL GOTCHAS](#graphql-gotchas)
- [N+1 Problem](#n1-problem)
- [Over-fetching Auth](#over-fetching-auth)
- [Query Complexity](#query-complexity)
- [POSTGRES PERFORMANCE GOTCHAS](#postgres-performance-gotchas)
- [Missing Indexes 3](#missing-indexes-3)
- [Index Bloat](#index-bloat)
- [Lock Contention](#lock-contention)
- [Connection Exhaustion](#connection-exhaustion)
- [AWS LAMBDA GOTCHAS](#aws-lambda-gotchas)
- [Cold Start Hell](#cold-start-hell)
- [Timeout Trap 2](#timeout-trap-2)
- [Memory = CPU](#memory--cpu)
- [VPC Cold Start](#vpc-cold-start)
- [MONOREPO GOTCHAS](#monorepo-gotchas)
- [Dependency Hell](#dependency-hell)
- [Build Order](#build-order)
- [Circular Dependencies](#circular-dependencies)
- [Type Sharing](#type-sharing)
- [GOTCHAS](#gotchas)
- [Presigned URL Pitfalls](#presigned-url-pitfalls)
- [CORS Hell](#cors-hell)
- [Cost Optimization](#cost-optimization)
- [TERRAFORM GOTCHAS](#terraform-gotchas)
- [State Lock Timeout](#state-lock-timeout)
- [Count vs For_Each](#count-vs-foreach)
- [BAD: Count - index based (order matters)](#bad-count---index-based-order-matters)
- [Remove item from middle DESTROYS everything after it](#remove-item-from-middle-destroys-everything-after-it)
- [GOOD: for_each - key based (order doesn't matter)](#good-foreach---key-based-order-doesnt-matter)
- [Remove item only that item destroyed](#remove-item-only-that-item-destroyed)
- [Drift Detection](#drift-detection)
- [MEMORY LEAK DEBUGGING 2](#memory-leak-debugging-2)
- [Node.js Memory Leaks](#nodejs-memory-leaks)
- [Finding Leaks](#finding-leaks)
- [Common Fixes 2 2](#common-fixes-2-2)
- [DATABASE MIGRATIONS GOTCHAS](#database-migrations-gotchas)
- [Safe Migration Principles](#safe-migration-principles)
- [Adding NOT NULL Column](#adding-not-null-column)
- [Renaming Column](#renaming-column)
- [RDS PRODUCTION GOTCHAS](#rds-production-gotchas)
- [Connection Limits](#connection-limits)
- [Slow Queries](#slow-queries)
- [Failover Gotchas](#failover-gotchas)
- [NGINX GOTCHAS](#nginx-gotchas)
- [Client Max Body Size](#client-max-body-size)
- [nginx.conf](#nginxconf)
- [Per location](#per-location)
- [Proxy Headers](#proxy-headers)
- [WebSocket Upgrade](#websocket-upgrade)
- [Rate Limiting 2](#rate-limiting-2)
- [Define rate limit zone](#define-rate-limit-zone)
- [DOCKER NETWORKING](#docker-networking)
- [Bridge Network (Default)](#bridge-network-default)
- [docker-compose.yml](#docker-composeyml)
- [Containers on same network can reach each other by service name](#containers-on-same-network-can-reach-each-other-by-service-name)
- [app can connect to db:5432](#app-can-connect-to-db5432)
- [Host Network](#host-network)
- [Uses host's network directly (Linux only)](#uses-hosts-network-directly-linux-only)
- [No port mapping needed](#no-port-mapping-needed)
- [Common Issues 3](#common-issues-3)
- [DNS Resolution](#dns-resolution)
- [Within Docker network](#within-docker-network)
- [From host](#from-host)
- [AWAIT GOTCHAS](#await-gotchas)
- [Parallel vs Sequential](#parallel-vs-sequential)
- [Error Handling](#error-handling)
- [forEach Doesn't Wait](#foreach-doesnt-wait)
- [RATE LIMITING GOTCHAS](#rate-limiting-gotchas)
- [Client-Side Rate Limits](#client-side-rate-limits)
- [Distributed Rate Limiting](#distributed-rate-limiting)
- [Burst Handling](#burst-handling)
- [TLS GOTCHAS 2](#tls-gotchas-2)
- [Certificate Issues](#certificate-issues)
- [Mixed Content 3](#mixed-content-3)
- [HSTS](#hsts)
- [QUEUE PROCESSING GOTCHAS](#queue-processing-gotchas)
- [Duplicate Processing](#duplicate-processing)
- [Dead Letter Queue](#dead-letter-queue)
- [Memory Issues](#memory-issues)
- [PRISMA P2024: Connection Pool Exhaustion](#prisma-p2024-connection-pool-exhaustion)
  - [The EXACT Error 5](#the-exact-error-5)
  - [Real Incident Reports 2](#real-incident-reports-2)
  - [KEYWORDS that trigger this 4](#keywords-that-trigger-this-4)
  - [Real Fix From Production 2](#real-fix-from-production-2)
- [Authentication Errors 2 2](#authentication-errors-2-2)
- [SESSION COMPLETE: BRAIN CROSSED 10% 2](#session-complete-brain-crossed-10-2)
- [Common Mistakes 2 2](#common-mistakes-2-2)
  - [Adding NOT NULL without default 2](#adding-not-null-without-default-2)
  - [Changing column type 2](#changing-column-type-2)
  - [Large table migration 2](#large-table-migration-2)
- [Best Practices 2 2](#best-practices-2-2)
- [Cannot change without rebuild 2](#cannot-change-without-rebuild-2)
- [SECRET VISIBLE 2](#secret-visible-2)
- [Visible in CI logs 2](#visible-in-ci-logs-2)
- [Problem: Many parsers break on newlines 2](#problem-many-parsers-break-on-newlines-2)
- [Flag Types 2 2](#flag-types-2-2)
- [Error Response Format 2 2](#error-response-format-2-2)
- [HTTP Status Codes 2 2](#http-status-codes-2-2)
- [Scaling WebSockets 2 2](#scaling-websockets-2-2)
- [Rolling Update 2 2](#rolling-update-2-2)
- [Alerting Rules 2 2](#alerting-rules-2-2)
- [Mixed Content 2 2](#mixed-content-2-2)
- [Remove item from middle DESTROYS everything after it 2](#remove-item-from-middle-destroys-everything-after-it-2)
- [Common Issues 2 2](#common-issues-2-2)

## HOW TO USE THIS DATABASE

    
    1. Find your SYMPTOM in the list below
    1. Check possible CAUSES
    1. Run the TEST to confirm
    1. Apply the FIX
    

---

## FRONTEND ROOT CAUSES

---

## Symptom: Component Not Rendering

| Possible Cause | Test | Fix |
|----------------|------|-----|
| Data is undefined | `console.log(data)`before render | Initialize state:`useState([])` |
| Error thrown during render | Check browser console | Fix the error, add try-catch |
| Conditional hiding component | Check condition that controls `{condition && <Comp />}` | Fix condition logic |
| CSS hiding component | Inspect element check opacity, display, visibility | Fix CSS |
| Parent not rendering children | Check parent's `{children}`or child placement | Add`{children}` to parent |

---

## Symptom: Component Renders with Wrong Data

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| State not updated | `console.log(state)`in render | Check setState logic |
| Props not passed correctly | `console.log(props)` | Check parent passing correct props |
| Stale closure in useEffect | Compare value inside and outside useEffect | Add to dependency array |
| Data cached from old request | Hard refresh (Ctrl+Shift+R) | Clear cache or add cache-busting |
| Wrong API endpoint | Check Network tab | Fix URL |

## Symptom: Component Re-renders Too Much

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| Object/array in deps recreated | React DevTools Highlight updates | useMemo for objects, useCallback for functions |
| Parent re-renders unnecessarily | Check parent's re-render triggers | Memoize parent state changes |
| Context value changing | Check context provider value | Memoize context value |
| Missing React.memo | Check if pure component takes same props | Wrap with React.memo |

## Symptom: Form Not Submitting

| Possible Cause | Test | Fix |
|----------------|------|-----|
| Validation failing | Check validation errors state | Fix validation rules or input |
| Submit handler not attached | Log inside handler | Add `onSubmit={handleSubmit}` |
| Button type not submit | Inspect button element | Add `type="submit"` |
| Form action interfering | Check `<form action=...>` | Remove action or use`preventDefault` |
| Disabled state stuck | Check button `disabled` prop | Fix disabled condition |

---

## Symptom: Styles Not Applying

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| Tailwind class not purged | Check class in browser | Add file to tailwind.config content |
| CSS specificity overridden | Inspect element | Use more specific selector or !important |
| Dynamic class not applied | Log the class name | Ensure class construction is correct |
| Wrong file imported | Check import statement | Import correct CSS file |
| Browser caching old CSS | Hard refresh | Add cache-busting or build again |

## BACKEND ROOT CAUSES

---

## Symptom: API Returns 500 Error

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| Uncaught exception | Check server logs | Add try-catch, handle error |
| Database connection failed | Check DATABASE_URL | Fix connection string |
| Prisma query error | Check Prisma error code | Fix query or schema |
| Missing environment variable | `console.log(process.env.VAR)` | Add to .env |
| Type error in code | Check error stack trace | Fix type issue |

## Symptom: API Returns Empty/Wrong Data

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| Wrong query | Log Prisma query input | Fix where/select conditions |
| Data doesn't exist | Check database directly | Add data or handle empty case |
| Wrong model used | Check model name | Use correct model |
| Relations not included | Check response shape | Add`include: { relation: true }` |
| Filtering too strict | Log filter values | Relax or fix filter |

## Symptom: Authentication Not Working

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| Token not sent | Check request headers | Add token to Authorization header |
| Cookie not sent | Check Application Cookies | Use`credentials: 'include'` |
| Token expired | Decode token, check exp | Refresh token or re-login |
| Wrong secret used | Compare secrets | Use correct JWT_SECRET |
| Session not found | Check session storage | Fix session creation |

## Symptom: Route Returns 404

| Possible Cause | Test | Fix |
|----------------|------|-----|
| File not in correct location | Check app/api/x/route.ts exists | Move file to correct path |
| Method not exported | Check `export async function GET` | Export correct method |
| Dynamic route syntax wrong | Check `[id]` folder name | Use correct syntax |
| Middleware blocking | Check middleware matcher | Fix matcher pattern |
| Trailing slash issue | Try with/without trailing / | Configure next.config.js |

---

## DATABASE ROOT CAUSES

---

## Symptom: Can't Connect to Database

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| Database not running | Try`psql`connection | Start database service |
| Wrong host | Check DATABASE_URL host | Use localhost or container name |
| Wrong port | Check DATABASE_URL port | Use correct port (default 5432) |
| Wrong credentials | Check username/password | Fix credentials |
| Firewall blocking | telnet host port | Configure firewall |

## Symptom: Query Returns Error

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| P2002: Unique constraint | Check if value already exists | Check before insert, or use upsert |
| P2003: Foreign key | Check if related record exists | Create related record first |
| P2025: Record not found | Check if ID exists | Handle not found case |
| Schema mismatch | `prisma migrate status` | Run migrations |

## Symptom: Insert Fails

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| Missing required field | Check schema for required fields | Add required field to data |
| Duplicate unique value | Query for existing record | Check first or use upsert |
| Foreign key doesn't exist | Query for related record | Create related record first |
| Wrong data type | Check field types in schema | Convert data to correct type |

## Symptom: Update Doesn't Persist

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| Wrong where clause | Log the where condition | Fix ID or unique condition |
| Update data empty | Log the update data | Add fields to update |
| Transaction rolled back | Check for errors in transaction | Fix error causing rollback |
| Caching showing old data | Query directly after update | Disable caching or invalidate |

## DEPLOY ROOT CAUSES

---

## Symptom: Build Fails

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| TypeScript error | Read error message | Fix type issue at line |
| Module not found | Check import path | Install package or fix path |
| ESLint error | Read lint message | Fix lint issue |
| Environment variable missing | Check all process.env usages | Add to build environment |
| Out of memory | Increase NODE_OPTIONS | Use`--max-old-space-size=4096` |

## Symptom: Works Locally, Fails in Production

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| Env variables different | Compare local vs prod env | Add missing prod vars |
| Database not accessible | Test connection from prod | Configure firewall/whitelist |
| Different Node version | Check version in package.json | Match versions |
| Missing build step | Check build logs | Add missing build command |
| Serverless timeout | Check function logs | Optimize or increase timeout |

## Symptom: Performance Slow in Production

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| N+1 query problem | Check queries in logs | Use include/join, not loops |
| No caching | Check response headers | Add caching headers |
| Large bundle size | Run bundle analyzer | Split code, lazy load |
| Cold start | Check first request time | Keep-alive or optimize cold start |
| Too many database calls | Count queries per request | Batch or cache queries |

## SECURITY ROOT CAUSES

---

## Symptom: CORS Error in Browser

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| No CORS headers | Check response headers | Add Access-Control-Allow-Origin |
| Wrong origin allowed | Check allowed origins | Add correct origin |
| Credentials mode mismatch | Check credentials setting | Match frontend and backend |
| Preflight fails | Check OPTIONS response | Handle OPTIONS method |

## Symptom: Authentication Bypassed

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| Middleware not matching | Check matcher config | Fix matcher pattern |
| Auth check missing in API | Check route handler code | Add auth check |
| Token validation wrong | Test with invalid token | Fix validation logic |
| Public route misconfigured | Check route protection | Add to protected routes |

## Symptom: Data Leaking to Wrong User

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| Missing user filter in query | Check where clause | Add`userId`filter |
| Authorization check missing | Check access control code | Add ownership check |
| Caching per-user data globally | Check cache key | Make cache key user-specific |
| Session mixup | Check session logic | Fix session handling |

## QUICK LOOKUP TABLE

## By Error Message

| Error Contains | Go To |
|----------------|-------|
| "undefined" | Component Not Rendering Data undefined |
| "hydration" | Hydration Mismatch tree |
| "Maximum update depth" | Infinite Render Loop |
| "CORS" | CORS Error |
| "P2002" | Unique constraint violation |
| "P2003" | Foreign key violation |
| "P2025" | Record not found |
| "ECONNREFUSED" | Database connection failed |
| "404" | Route not found |
| "401" | Authentication not working |
| "403" | Authorization failed |
| "500" | Backend error - check logs |

---

### This is your DIAGNOSIS DATABASE

#### Symptom Cause Test Fix

#### No more guessing

---

## EXTENDED ROOT CAUSE DATABASE

## 1000+ Error Patterns Across All Domains

---

## REACT SPECIFIC ERRORS

---

## Symptom: "Warning: Can't perform a React state update on an unmounted component"

| Possible Cause | Test | Fix |
|----------------|------|-----|
| Async operation completes after unmount | Add console.log in cleanup | Add cleanup function in useEffect |
| Subscription not cleaned up | Check if cleanup returns | Return unsubscribe in useEffect |
| Timer not cleared | Check for setInterval/setTimeout | Clear in cleanup function |

### FIX PATTERN

    useEffect(() => {
    let isMounted = true;
    
    fetchData().then(data => {
    if (isMounted) setData(data);
      });
    
    return () => { isMounted = false };
    }, []);
    

---

## Symptom: "Too many re-renders. React limits the number of renders"

| Possible Cause | Test | Fix |
|----------------|------|-----|
| setState called directly in render | Search for setState outside useEffect | Move to useEffect or event handler |
| Infinite loop in useEffect | Check dependency array | Fix dependencies or add conditions |
| Event handler calling setState repeatedly | Log event handler calls | Debounce or add conditions |

### FIX PATTERN 2

    // BAD - setState in render
    function Bad({ items }) {
    setCount(items.length); // Infinite loop!
    return <div>{count}</div>;
    }
    
    // GOOD - Derived value
    function Good({ items }) {
    const count = items.length; // Just compute it
    return <div>{count}</div>;
    }
    

---

## Symptom: "React has detected a change in the order of Hooks"

| Possible Cause | Test | Fix |
|----------------|------|-----|
| Hook inside condition | Search for if/else around hooks | Move hook before condition |
| Hook inside loop | Check for hooks in map/forEach | Move hook outside loop |
| Early return before hooks | Check returns before hooks | Move hooks before returns |

### RULE

    // BAD
    function Bad({ show }) {
    if (!show) return null; // Early return before hook!
    const [state, setState] = useState();
    }
    
    // GOOD
    function Good({ show }) {
    const [state, setState] = useState(); // Hook first
    if (!show) return null;
    }
    

---

## Symptom: "Cannot update a component while rendering a different component"

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| Parent setState during child render | Add console.log to find caller | Move to useEffect |
| Context update during render | Check context provider | Memoize context value |
| Redux dispatch during render | Check for dispatch in render | Move to useEffect |

## Symptom: "Element type is invalid: expected a string or class/function"

| Possible Cause | Test | Fix |
|----------------|------|-----|
| Importing non-existent component | Check export from source file | Fix import/export |
| Default vs named export mismatch | Check export type | Match import style |
| Component undefined | console.log the component | Check import path |
| Circular dependency | Check import chain | Refactor to break cycle |

### COMMON PATTERNS

    // BAD - Named import for default export
    import { Button } from './Button'; // Button exports default
    
    // GOOD
    import Button from './Button';
    
    // BAD - Default import for named export
    import Button from './Button'; // Button uses export const Button
    
    // GOOD
    import { Button } from './Button';
    

---

## JS SPECIFIC ERRORS

---

## Symptom: "Error: Invariant: headers() expects to have requestAsyncStorage"

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| headers() called in client component | Check for 'use client' | Move to server component |
| headers() called at module level | Check where headers() is called | Move inside function |
| Dynamic function in static context | Check page static/dynamic | Add export const dynamic = 'force-dynamic' |

## Symptom: "Error: NEXT_REDIRECT"

| Possible Cause | Test | Fix |
|----------------|------|-----|
| redirect() called in try block | Check if redirect in try-catch | Move redirect outside try or rethrow |
| redirect() error caught | Check catch blocks | Check for NEXT_REDIRECT and rethrow |

### FIX PATTERN 3

    // BAD - redirect caught by catch
    try {
      redirect('/dashboard');
    } catch (e) {
    // redirect is an error, gets caught!
    }
    
    // GOOD
    try {
    // other code
    } catch (e) {
    if (e.message === 'NEXT_REDIRECT') throw e;
    // handle other errors
    }
    redirect('/dashboard');
    

---

## Symptom: "Error: Dynamic server usage: headers"

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| Using dynamic function in static page | Check page type | Add`export const dynamic = 'force-dynamic'` |
| cookies/headers in generateStaticParams | Check static generation | Remove dynamic functions |

## Symptom: "Module not found: Can't resolve 'fs'"

| Possible Cause | Test | Fix |
|----------------|------|-----|
| Server-only module in client | Check where module is imported | Move to API route or server component |
| Package uses Node APIs | Check package documentation | Use server-side only |

### FIX PATTERN 4

    // next.config.js - for edge cases
    module.exports = {
    webpack: (config, { isServer }) => {
    if (!isServer) {
    config.resolve.fallback = {
    fs: false,
    path: false,
          };
        }
    return config;
      },
    };
    

---

## Symptom: "Error: Page changed from static to dynamic"

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| Added dynamic function to static page | Check for cookies/headers usage | Remove or mark as dynamic |
| Inconsistent generateStaticParams | Check path generation | Return all expected paths |

## Symptom: "Unhandled Runtime Error: NotFoundError"

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| Dynamic import failed | Check import path | Fix import path |
| Component not exported | Check export statement | Add export |

## TYPESCRIPT SPECIFIC ERRORS

---

## Symptom: "Type 'X' is not assignable to type 'Y'"

| Possible Cause | Test | Fix |
|----------------|------|-----|
| Wrong property type | Check type definitions | Fix data or type |
| Missing property | Check required properties | Add missing property |
| Extra property | Check for strict typing | Remove extra or update type |
| Null not handled | Check for optional types | Add null check or optional |

### COMMON FIXES

    // Narrow the type
    if (data !== null) {
    // data is not null here
    }
    
    // Type assertion (use carefully)
    const value = data as ExpectedType;
    
    // Type guard
    function isUser(obj: any): obj is User {
    return 'id' in obj && 'email' in obj;
    }
    

---

## Symptom: "Property 'X' does not exist on type 'Y'"

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| Typo in property name | Check spelling | Fix typo |
| Property not defined | Check type definition | Add to interface |
| Using wrong type | Check variable type | Use correct type |
| Optional chaining needed | Check if property might not exist | Use obj?.prop |

## Symptom: "Object is possibly 'undefined'"

| Possible Cause | Test | Fix |
|----------------|------|-----|
| Optional value used without check | Check type definition | Add undefined check |
| Array access might be undefined | Check array bounds | Add existence check |

### FIX PATTERNS

    // Optional chaining
    const value = obj?.prop?.nested;
    
    // Nullish coalescing
    const value = obj?.prop ?? 'default';
    
    // Type guard
    if (obj !== undefined) {
    // obj is defined here
    }
    
    // Non-null assertion (use carefully)
    const value = obj!.prop;
    

---

## Symptom: "Argument of type 'X' is not assignable to parameter"

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| Passing wrong type | Check function signature | Transform data or fix type |
| Missing conversion | Check expected format | Convert data |

## Symptom: "Cannot find module 'X' or its declarations"

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| Package not installed | Check package.json | npm install package |
| Types not installed | Check for @types package | npm install -D @types/package |
| Path alias not configured | Check tsconfig paths | Add path mapping |
| Case sensitivity | Check exact file name | Fix casing |

## PRISMA SPECIFIC ERRORS

---

## Symptom: "PrismaClient is not configured to run in Vercel Edge Functions"

| Possible Cause | Test | Fix |
|----------------|------|-----|
| Using Prisma in edge runtime | Check runtime configuration | Use nodejs runtime or Prisma Edge |

### FIX

    // app/api/route.ts
    export const runtime = 'nodejs'; // Not 'edge'
    

---

## Symptom: "Environment variable not found: DATABASE_URL"

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| .env not loaded | Check .env file exists | Create .env file |
| Wrong env file | Check file name | Should be .env or .env.local |
| Not set in production | Check hosting platform | Add to environment variables |

## Symptom: "Prisma has detected that this project was built on a different platform"

| Possible Cause | Test | Fix |
|----------------|------|-----|
| Building on different OS | Check build environment | Regenerate client after build |
| Docker platform mismatch | Check Dockerfile | Add prisma generate to build |

### FIX 2

    // package.json
    {
    "scripts": {
    "postinstall": "prisma generate"
      }
    }
    

---

## Symptom: "Unable to fit integer value X into an Int4"

| Possible Cause | Test | Fix |
|----------------|------|-----|
| Number too large for Int | Check value size | Use BigInt in schema |

### FIX 3

    // schema.prisma
    model Order {
    amount BigInt  // Instead of Int
    }
    

---

## Symptom: "Prepared statement already exists"

| Possible Cause | Test | Fix |
|----------------|------|-----|
| Connection pool conflict | Check for multiple clients | Use singleton Prisma client |

### FIX 4

    // lib/prisma.ts
    import { PrismaClient } from '@prisma/client';
    
    const globalForPrisma = global as unknown as { prisma: PrismaClient };
    
    export const prisma =
    | globalForPrisma.prisma |  |
    new PrismaClient();
    
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
    

---

## Symptom: "Transaction already closed"

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| Async operation after transaction ends | Check transaction timing | Move all operations inside $transaction |
| Error causing early close | Check for errors | Handle errors properly |

## API INTEGRATION ERRORS

---

## Symptom: "Network request failed"

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| No internet connection | Check connectivity | Retry with offline detection |
| Server unreachable | Try URL in browser | Fix URL or server |
| DNS failure | Try different DNS | Fix DNS or use IP |
| Timeout | Increase timeout | Add proper timeout handling |

## Symptom: "SyntaxError: Unexpected token < in JSON"

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| HTML returned instead of JSON | Check response in Network tab | Server returned error page |
| 404 page returned | Check URL | Fix endpoint URL |
| Auth redirect returned | Check login status | Handle auth |

## Symptom: "Failed to fetch" with no details

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| CORS blocked | Check console for CORS | Add CORS headers |
| Mixed content (HTTP on HTTPS) | Check URLs | Use HTTPS |
| Ad blocker interfering | Disable extensions | Rename problematic routes |

## STATE MANAGEMENT ERRORS

---

## Symptom: "Cannot read properties of undefined" in store/context

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| Provider not wrapping | Check component tree | Add Provider higher |
| Initial state undefined | Check default value | Provide initial state |
| Async state not loaded | Check loading sequence | Add loading state |

## Symptom: Store not updating UI

| Possible Cause | Test | Fix |
|----------------|------|-----|
| Mutating state directly | Check for direct mutations | Create new object/array |
| Selector not reactive | Check selector dependencies | Use proper selectors |
| Component not subscribed | Check subscription | Use hooks correctly |

### FIX (Zustand example)

    // BAD - Direct mutation
    set(state => {
    state.items.push(item); // Direct mutation!
    return state;
    });
    
    // GOOD - New array
    set(state => ({
    items: [...state.items, item]
    }));
    

---

## TAILWIND CSS ERRORS

---

## Symptom: Tailwind classes not working

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| File not in content config | Check tailwind.config.js | Add file pattern |
| Class purged | Check production build | Use safelist for dynamic |
| Wrong class name | Check Tailwind docs | Fix class name |
| Conflicting styles | Inspect element | Use !important or specificity |

### FIX 5

// tailwind.config.js
module.exports = {
content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
      ],
safelist: [
        'bg-red-500',
        'bg-green-500',
// Dynamic classes that might be purged
      ],
    };

## Symptom: Dark mode not switching

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| Wrong dark mode strategy | Check config | Set darkMode: 'class' or 'media' |
| Class not applied to html | Check html element | Add dark class to html |
| CSS specificity | Inspect element | Check for overrides |

## AUTHENTICATION ERRORS

---

## Symptom: NextAuth "NEXTAUTH_SECRET" error

| Possible Cause | Test | Fix |
|----------------|------|-----|
| Secret not set | Check env | Add NEXTAUTH_SECRET |
| Secret too short | Check length | Use at least 32 chars |

### GENERATE SECRET

    openssl rand -base64 32
    

---

## Symptom: "OAuthAccountNotLinked"

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| Email already used with different provider | Check user table | Allow account linking |
| Strict linking policy | Check adapter | Enable flexible linking |

## Symptom: Callback URL error in OAuth

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| Wrong callback URL in provider | Check provider dashboard | Fix callback URL |
| Environment URLs wrong | Check NEXTAUTH_URL | Set correct URL |

## PERFORMANCE ISSUES

---

## Symptom: Slow page load

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| Large bundle | Run bundle analyzer | Code split, lazy load |
| No code splitting | Check build output | Use dynamic imports |
| Unoptimized images | Check Network tab | Use next/image |
| Too many API calls | Count requests | Batch or cache |
| Slow database | Profile queries | Add indexes, optimize |

## Symptom: Memory leak

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| Event listener not removed | Check cleanup | Remove in useEffect cleanup |
| Interval not cleared | Check for setInterval | Clear in cleanup |
| Large objects held | Profile memory | Release references |
| State growing unbounded | Check state size | Implement limits |

## RESPONSIVE ISSUES

---

## Symptom: Touch not working

| Possible Cause | Test | Fix |
| ---------------- | ------ | -----  |
| onClick not touch-friendly | Test on mobile | Add touch events |
| Element too small | Check tap target size | Min 44x44 pixels |
| Overlay blocking | Check z-index | Fix stacking context |

## Symptom: Layout breaking on mobile

| Possible Cause | Test | Fix |
|----------------|------|-----|
| Fixed width | Check for px widths | Use responsive units |
| No viewport meta | Check head | Add viewport meta |
| Absolute positioning | Check for absolute | Use relative/flex |

---

### [TARGET: 50,000 LINES OF ROOT CAUSES]

#### Current: ~800 lines - Expanding systematically

#### Coverage: React, Next.js, TypeScript, Prisma, Auth, Performance, Mobile

---

## INDEX BY KEYWORD

| Keyword | Go To Section |
| --------- | ---------------  |
| undefined | Component Not Rendering |
| hydration | NEXT.JS: Hydration errors |
| CORS | API Integration: CORS |
| P2002 | PRISMA: Unique constraint |
| P2003 | PRISMA: Foreign key |
| P2025 | PRISMA: Record not found |
| 500 | BACKEND: API Returns 500 |
| 404 | BACKEND: Route Returns 404 |
| TypeError | TYPESCRIPT: Type errors |
| Maximum update depth | React: Too many re-renders |
| Cannot find module | TYPESCRIPT: Module not found |
| state update on unmounted | React: Unmounted update |
| Invariant | NEXT.JS: Server function errors |
| token | AUTH: Token issues |
| NEXTAUTH | AUTH: NextAuth specific |

## TYPESCRIPT ERROR PATTERNS

---

## TS2322: Type 'X' is not assignable to type 'Y'

| Symptom | Cause | Test | Fix |
|---------|-------|------|-----|
| `Type 'string' is not assignable to type 'number'` | Wrong type passed | Check function signature | Use correct type or type assertion |
| `Type 'undefined' is not assignable`| Optional property used as required | Add null check |`value!`or`if (value) {}` |
| `Type '{ }' is not assignable to type 'Props'` | Missing required props | Check component props | Add all required props |
| `Type 'null' is not assignable` | strictNullChecks enabled | Check variable initialization | Handle null case or use`!` |

---

## TS2339: Property 'X' does not exist on type 'Y'

| Symptom | Cause | Test | Fix |
|---------|-------|------|-----|
| Property not on interface | Using undeclared property | Check interface definition | Add property to interface |
| `Property 'X' does not exist on type 'Y | Z'` | Union type narrowing needed | Check discriminant | Use type guard |
| Property after await | Type not inferred | Check return type | Add explicit type |

    // FIX: Type narrowing
    | function handle(value: string | number) { |
    if (typeof value === 'string') {
    value.toUpperCase(); // OK: TypeScript knows it's string
      }
    }
    
    // FIX: Type guard
    function isUser(obj: unknown): obj is User {
    return typeof obj === 'object' && obj !== null && 'id' in obj;
    }
    

---

## TS2345: Argument type mismatch

| Symptom | Cause | Test | Fix |
| --------- | ------- | ------ | -----  |
| Wrong argument type | Passing incorrect type | Check function params | Cast or convert type |
| Partial vs required | Using Partial for required params | Check interface | Use full interface |
| `Promise<T>`vs`T` | Missing await | Check async | Add await |

## TS7006: Parameter implicitly has 'any' type

| Symptom | Cause | Test | Fix |
| --------- | ------- | ------ | -----  |
| Event handler`(e) =>` | No type annotation | noImplicitAny enabled | Add type:`(e: MouseEvent)` |
| Callback parameter | Implicit any | Check function signature | Add explicit type |
| Map/filter callback | Array type unknown | Check array declaration | Type the array |

## DEPLOYMENT ERROR PATTERNS

---

## Vercel Build Fails

| Symptom | Cause | Test | Fix |
|---------|-------|------|-----|
| `ESLint: X errors` | Linting failures | Run`npm run lint` locally | Fix lint errors or disable rule |
| `Type error: X` | TypeScript strict mode | Run`npm run build` locally | Fix type errors |
| `Module not found: X`| Missing dependency | Check package.json |`npm install X` |
| `ENOENT: no such file` | Case sensitivity | Check file path casing | Match exact casing (Linux is case-sensitive) |
| `Cannot read properties of undefined` | Runtime error during build | Check getStaticProps | Handle edge cases |

---

## Docker Build Fails

| Symptom | Cause | Test | Fix |
|---------|-------|------|-----|
| `npm ERR! not found: git` | Using git dependencies | Check package.json | Use npm registry versions |
| `COPY failed: file not found` | Wrong path in Dockerfile | Check file paths | Use correct relative paths |
| `npm install failed` | Node version mismatch | Check node version | Match node version in FROM |
| `prisma generate` fails | No database URL | Check ENV in Dockerfile | Add DATABASE_URL for build |
| Image too large | Unoptimized layers | Check image size | Multi-stage build, .dockerignore |

    
    ## FIX: Multi-stage build
    
    FROM node:20-alpine AS builder
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci
    COPY . .
    RUN npm run build
    
    FROM node:20-alpine AS runner
    WORKDIR /app
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    CMD ["npm", "start"]
    

---

## CI/CD Pipeline Fails

| Symptom | Cause | Test | Fix |
| --------- | ------- | ------ | -----  |
| `Tests passed locally, fail in CI` | Environment difference | Check CI logs | Mock environment vars |
| `npm ci failed`| lockfile mismatch | Compare package-lock.json |`npm install`and commit lockfile |
| `EACCES: permission denied` | File permissions | Check chmod | Add file permission step |
| `Timeout waiting for X` | Service not ready | Check health checks | Add wait-for script |
| `Out of memory` | Large build | Check memory limit | Increase CI memory or optimize |

## ENVIRONMENT VARIABLE PATTERNS

---

## ENV Not Working

| Symptom | Cause | Test | Fix |
|---------|-------|------|-----|
| `undefined` at runtime | Missing NEXT_PUBLIC_ prefix | Check env var name | Add NEXT_PUBLIC_ for client |
| Works dev, fails prod | Not in Vercel/hosting | Check production ENV | Add to hosting dashboard |
| Empty string | Quotes in .env | Check .env syntax | Remove surrounding quotes |
| Wrong value | .env.local overriding | Check file precedence | Check all .env files |

    // Safe ENV access pattern
    function getEnvVar(key: string): string {
    const value = process.env[key];
    if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
      }
    return value;
    }
    
    const databaseUrl = getEnvVar('DATABASE_URL');
    

---

## NETWORK PATTERNS

---

## CORS Errors

| Symptom | Cause | Test | Fix |
|---------|-------|------|-----|
| `Access-Control-Allow-Origin missing` | No CORS headers | Check browser network tab | Add CORS middleware |
| `preflight` blocked | OPTIONS not handled | Check OPTIONS response | Add OPTIONS handler |
| `credentials`error | Wrong credentials mode | Check withCredentials | Set proper origin (not`*`) |
| Works in dev, fails prod | Different origins | Check production URLs | Update allowed origins |

    // Next.js API route CORS fix
    export async function GET(request: NextRequest) {
    const response = NextResponse.json({ data: 'test' });
    
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;
    }
    
    export async function OPTIONS() {
    return new NextResponse(null, {
    status: 204,
    headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }
    

---

## PERFORMANCE PATTERNS

---

## Slow Page Load

| Symptom | Cause | Test | Fix |
| --------- | ------- | ------ | -----  |
| High TTI (Time to Interactive) | Large JS bundle | Analyze with Lighthouse | Code split, lazy load |
| Slow LCP | Large images | Check image sizes | next/image, WebP |
| Layout shift (CLS) | Dynamic content | Check CLS score | Reserve space, priority hints |
| Slow API | N+1 queries | Check query count | Use Prisma include |

## Memory Leaks

| Symptom | Cause | Test | Fix |
|---------|-------|------|-----|
| Memory grows over time | Uncleared intervals | Memory profiler | Clear in useEffect cleanup |
| "Detached DOM elements" | Event listeners | Heap snapshot | Remove listeners on unmount |
| Large retained size | Closed-over variables | Check closures | Avoid large closures |
| WebSocket not closed | Missing cleanup | Monitor connections | Close on unmount |

    // FIX: Proper cleanup
    useEffect(() => {
    const interval = setInterval(() => {
    // do something
    }, 1000);
    
    const ws = new WebSocket('wss://...');
    
    return () => {
    clearInterval(interval); // Clean interval
    ws.close(); // Clean WebSocket
      };
    }, []);
    

---

## REAL PRODUCTION INCIDENTS (Sourced from Web)

> **These are REAL error patterns from actual production incidents, GitHub issues, and official documentation - NOT AI-generated patterns**## PRISMA P2024: Connection Pool Exhaustion**Source:**GitHub Issues #prisma, Prisma Documentation, Real production incidents

### The EXACT Error

    PrismaClientKnownRequestError:
Timed out fetching a new connection from the connection pool.
Please consider reducing the number of requests or increasing
the `connection_limit`parameter.
Error Code: P2024

### Real Incident Reports

-**GitHub Issue Pattern:**Workers hit P1001, web server hits P2024, server becomes unresponsive, requires restart
-**Prisma v6 Upgrade:**Users report connection pool exhaustion after upgrading, especially with`@prisma/adapter-mssql`-**Serverless flood:** Each Lambda/Vercel function has own pool, multiplied connections exhaust DB

### KEYWORDS that trigger this

    P2024
Timed out fetching
connection pool
    connection_limit
    pool_timeout
serverless connections
too many clients already

### Real Fix From Production

// CONNECTION STRING FIX (Prisma docs)
    DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=5&pool_timeout=10"

// SERVERLESS FIX: Use Prisma Accelerate or PgBouncer
// Don't create new PrismaClient every request
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

| export const prisma = globalForPrisma.prisma |  | new PrismaClient() |

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

## REACT HYDRATION MISMATCH: Text Content Does Not Match

**Source:** Next.js Official Docs, React.dev, Real Stack Overflow incidents

### The EXACT Error 2

    Unhandled Runtime Error
    Error: Text content does not match server-rendered HTML.
    Warning: Expected server HTML to contain a matching <div> in <p>.
    

### Real Causes (from Next.js docs)

1. **Date/Time** - Server time client time
1. **localStorage/window** - undefined on server
1. **Browser extensions** - GTM, Hotjar modify DOM
1. **CDN auto-minify** - Cloudflare strips whitespace
1. **Invalid HTML nesting** - `<div>`inside`<p>`### KEYWORDS that trigger this```text

hydration mismatch
text content does not match
server-rendered HTML
Expected server HTML
Minified React error #418
Minified React error #425

    
    ### Real Fix From Next.js Docs
    

// FIX 1: useEffect for client-only content
function ClientDate() {
const [date, setDate] = useState('')

useEffect(() => {
setDate(new Date().toLocaleDateString())
}, [])

return <span>{date}</span>
}

// FIX 2: Disable SSR for component
import dynamic from 'next/dynamic'

const ClientOnlyComponent = dynamic(
() => import('../components/ClientOnlyComponent'),
{ ssr: false }
)

// FIX 3: suppressHydrationWarning (last resort)
<time suppressHydrationWarning>
{new Date().toLocaleDateString()}
</time>

    
    ---
    
    ## VERCEL BUILD FAILS: ENOENT Case Sensitivity
    
    **Source:** Vercel Documentation, Real deployment issues
    
    ### The EXACT Error 3
    

Error: ENOENT: no such file or directory, open '/vercel/path0/components/Button.tsx'

Module not found: Can't resolve './Components/Button'

    
    ### Root Cause
    
    - **Windows/Mac:** Case-insensitive file system
    - **Linux (Vercel):** Case-SENSITIVE file system
    - Import says `./Components/Button`, file is `./components/Button`### KEYWORDS that trigger this```text
    ENOENT
    no such file or directory
    Module not found
    case sensitivity
    works locally fails vercel
    works on mac fails on linux
    

### Real Fix

    
    ## Check for case issues
    
    git config core.ignorecase false
    git rm -r --cached .
    git add .
    git commit -m "fix case sensitivity"
    

---

## VERCEL "500 Internal Server Error" with No Logs

**Source:** Vercel community, GitHub issues

### The Pattern

- Works in dev, 500 in production
- No error in Vercel logs
- API route returns 500

### Real Causes

1. **ENV variable missing** - Not added to Vercel dashboard
1. **Edge runtime + Node module** - Can't use `fs` in Edge
1. **Unserializable data** - `undefined` in getServerSideProps

### KEYWORDS that trigger this 2

    500 internal server error vercel
    no logs 500
    API route 500
    works locally 500 production
    

### Real Fix 2

    // FIX: Check all ENV vars at startup
    // app/api/health/route.ts
    export async function GET() {
    const missing = [];
    if (!process.env.DATABASE_URL) missing.push('DATABASE_URL');
    if (!process.env.NEXTAUTH_SECRET) missing.push('NEXTAUTH_SECRET');
    
    if (missing.length > 0) {
    return Response.json({
    error: 'Missing ENV vars',
          missing
    }, { status: 500 });
      }
    
    return Response.json({ status: 'ok' });
    }
    

---

## NEXT.JS "Dynamic server usage" Error

**Source:** Next.js 14 App Router, Real migration issues

### The EXACT Error 4

    Error: Dynamic server usage: cookies
    
    This page was configured to be statically generated,
    but it uses dynamic features like `cookies()`or`headers()`.
    

### KEYWORDS that trigger this 3

    Dynamic server usage
    cookies() headers()
    force-dynamic
    generateStaticParams
    static generation dynamic features
    

### Real Fix 3

    // FIX: Add dynamic export
    export const dynamic = 'force-dynamic'
    
    // OR use separate server/client components
    // page.tsx (server)
    async function Page() {
    // static content
    return <ClientPart />
    }
    
    // ClientPart.tsx (use client)
    'use client'
    // dynamic content with cookies etc
    

---

#### [REAL DATA FROM WEB SOURCES]

#### Sources: GitHub Issues, Prisma Docs, Next.js Docs, Vercel Community

#### NOT AI-Generated - Actual production incident patterns

---

## RECOGNITION KEYS INDEX

> **For AI: When you see these keywords, look up corresponding section**

| Keyword Pattern | Go To Section |
|-----------------|---------------|
| `P2024`, `connection pool`, `pool_timeout` | Prisma Connection Pool |
| `hydration`, `text content`, `#418`, `#425` | React Hydration |
| `ENOENT`, `case sensitivity`, `Module not found` | Vercel Case Sensitivity |
| `500 no logs`, `works locally fails prod` | Vercel 500 Error |
| `Dynamic server usage`, `force-dynamic` | Next.js Dynamic Usage |
| `NEXT_PUBLIC_`, `env undefined` | Environment Variables |

---

## COMPLETE PRISMA ERROR CODE DATABASE

**Source:** Prisma Official Documentation, GitHub Issues, Medium Articles

---

## Connection Errors (P1xxx)

| Code | Error Message | Keyword Trigger | Fix |
| ------ | --------------- | ----------------- | -----  |
| P1001 | Database server not reachable | `Can't reach database`, `Connection refused`, `ECONNREFUSED` | Check DATABASE_URL, firewall, DB is running |
| P1013 | Invalid database string | `Invalid database string`, `malformed` | Fix DATABASE_URL format in .env |
| P1014 | Missing underlying database model | `does not exist in the current database` | Run`npx prisma migrate deploy` |
| P1015 | Incompatible database version | `Your Prisma schema is using features` | Upgrade database or change features |
| P1016 | Incorrect number of parameters | `Raw query failed`, `parameter` | Check $queryRaw parameter count |
| P1017 | Connection closed by server | `Server has closed the connection` | Check DB server logs, connection timeout |

## Query Errors (P2xxx)

| Code | Error Message | Keyword Trigger | Fix |
| ------ | --------------- | ----------------- | -----  |
| P2002 | Unique constraint failed | `Unique constraint failed on the` | Check for duplicate values, add try/catch |
| P2003 | Foreign key constraint failed | `Foreign key constraint failed` | Ensure referenced record exists first |
| P2025 | Record not found | `Record to update not found`, `An operation failed` | Check if record exists before update/delete |

## Prisma Accelerate/Pool Errors (P6xxx)

| Code | Error Message | Keyword Trigger | Fix |
| ------ | --------------- | ----------------- | -----  |
| P6004 | Query timeout | `The global timeout of Prisma Accelerate has been exceeded` | Optimize query, increase timeout |
| P6008 | Engine start error | `Could not start query engine` | Check Prisma version, regenerate client |
| P6009 | Response size exceeded | `Response size limit exceeded` | Paginate results, use select |

## JS ERROR DATABASE

**Source:** Stack Overflow, LogRocket, Sentry.io, Next.js Docs

---

## Common Next.js Production Errors

| Error | Keyword Trigger | Root Cause | Fix |
| ------- | ----------------- | ------------ | -----  |
| Maximum call stack size exceeded | `Maximum call stack`, `RangeError`, `stack overflow` | Infinite recursion, circular reference | Check recursive functions, circular imports |
| Module not found | `Cannot find module`, `Module not found` | Wrong import path, server module on client | Check path casing, use dynamic import for server modules |
| Document is not defined | `document is not defined`, `window is not defined` | Using browser API on server | Wrap in useEffect or check typeof window |
| Server Component error omitted | `An error occurred in the Server Components render`, `digest:` | Error in RSC, message hidden | Return errors from server actions, don't throw |
| Hydration mismatch | `Text content does not match`, `#418`, `#425` | Server/client HTML differs | useEffect for dynamic content, suppressHydrationWarning |
| CORS error in API | `has been blocked by CORS policy` | No CORS headers on API route | Add Access-Control headers to response |
| Build fail swcMinify | `Failed to compile`, `swcMinify` | Incompatible dependency with SWC | Set swcMinify: false in next.config.js |

## Performance Killers (from real web sources)

| Issue | Keyword Trigger | Impact | Fix |
|-------|-----------------|--------|-----|
| No database indexes | `slow query`, `query timeout` | 10x-100x slower reads | Add index on WHERE/ORDER BY columns |
| Connection per request | `too many connections`, `P2024` | DB exhaustion | Use singleton PrismaClient |
| Full table fetch | `fetching all`, `memory` | Memory explosion | Use pagination, limit, select |
| Large bundles | `First Load JS`, `slow`, `bundle` | Slow page load | Dynamic import, tree shaking |
| No Image optimization | `LCP`, `large images` | Bad Core Web Vitals | Use next/image component |

---

### [SOURCED FROM REAL WEB DATA]

#### Stack Overflow, Prisma Docs, LogRocket, Medium, GitHub Issues

---

## QUICK SEARCH INDEX

> **Paste error Get section**

| If error contains... | Go to... |
|----------------------|----------|
| `P1`, `P2`, `P6` | Prisma Error Database |
| `Maximum call stack` | Next.js Recursion Error |
| `window is not defined` | Next.js Browser API Error |
| `CORS`, `Access-Control` | Next.js CORS Error |
| `digest:` | Next.js Server Component Error |
| `hydration`, `#418` | React Hydration Error |

---

## TYPESCRIPT COMMON ERRORS (Web Sourced)

**Source:** dev.to, Medium, TypeScript Official Docs, Stack Overflow 2024

---

## Top TypeScript Production Errors

| Error | Keyword Trigger | Root Cause | Fix |
|-------|-----------------|------------|-----|
| Overuse of `any`|`any type`, `implicit any` | Bypasses type-checking | Use`unknown`, explicit types |
| `strictNullChecks`disabled | `null`, `undefined`, `cannot read property of null` | Uncaught null values | Enable`strict: true` in tsconfig |
| Bad type assertions | `as any`, `as Type`, type assertion | Runtime mismatch | Use type guards, validate at runtime |
| No function return types | Implicit return | Silent failures | Add explicit return types |
| `Type 'X' is not assignable`|`TS2322`, `not assignable` | Type mismatch | Check types, use correct type |
| `Property does not exist`|`TS2339`, `does not exist on type` | Missing property | Add to interface or use type narrowing |

---

## tsconfig.json Critical Settings

    // PRODUCTION TSCONFIG - from TypeScript docs
    {
    "compilerOptions": {
    "strict": true,  // MUST ENABLE - catches most issues
    "noImplicitAny": true,  // No silent any
    "strictNullChecks": true,    // Catch null/undefined
    "noImplicitReturns": true,   // Catch missing returns
    "noUncheckedIndexedAccess": true,  // Array access might be undefined
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": true  // Faster builds
      }
    }
    

---

## VERCEL DEPLOYMENT ERRORS (Web Sourced)

**Source:** Vercel Docs, YouTube tutorials, Reddit r/nextjs, Medium 2024

---

## Common Vercel Build Failures

| Error | Keyword Trigger | Root Cause | Fix |
|-------|-----------------|------------|-----|
| Missing ENV vars | `undefined`, `Cannot read property`, `500 no logs` | ENV not in Vercel dashboard | Add to Project Settings Environment Variables |
| Unsupported Node | `syntax error`, `Unexpected token` | Wrong Node version | Add`"engines": {"node": ">=18"}` to package.json |
| Case sensitivity | `ENOENT`, `Module not found`, `works locally fails Vercel`| case mismatch |`git config core.ignorecase false` |
| Build timeout | `Build exceeded`, `timeout` | Large dependencies | Use pnpm, remove unused deps |
| ESLint errors | `ESLint: X errors`, `lint failed` | Strict lint on Vercel | Run`npm run lint` before deploy |
| Prisma init error | `PrismaClientInitializationError` | Prisma not generated | Add postinstall:`prisma generate` |

---

## Vercel Deployment Checklist

    All ENV vars added to Vercel dashboard
    NEXT_PUBLIC_ prefix for client-side ENVs
    npm run build passes locally
    npm run lint passes (no errors)
    File casing matches imports exactly
    Node version specified in package.json
    Prisma generates in postinstall
    No server-only code in client components
    

---

## Quick Keyword Search Index

| Keyword Pattern | Section |
| ----------------- | ---------  |
| `TS2322`, `not assignable` | TypeScript Type Mismatch |
| `TS2339`, `does not exist` | TypeScript Property Error |
| `strict: true`, `noImplicitAny` | TypeScript Config |
| `ENOENT`, `case sensitive` | Vercel Case Sensitivity |
| `PrismaClientInitializationError` | Vercel Prisma Error |
| `undefined`, `ENV`, `no logs` | Vercel ENV Variables |

### [REAL WEB-SOURCED DATA]

#### Sources: Vercel Docs, TypeScript Docs, dev.to, Medium, Reddit 2024

## REACT HOOKS COMMON ERRORS (Web Sourced)

**Source:** Telerik, refine.dev, dev.to, React.dev, Medium, Sentry 2024

---

## useState Errors

| Error | Keyword Trigger | Root Cause | Fix |
| ------- | ----------------- | ------------ | -----  |
| Direct state mutation | `push`, `splice`, state mutation | Modifying state directly | Use spread: `setState([...arr, new])` |
| Incorrect initialization | `Cannot read property`, `undefined` | Initial state doesn't match expected type | Initialize with correct type:`useState<User | null>(null)` |
| Stale state in async | `setState`wrong value | Async callback uses old state | Use functional update:`setState(prev => prev + 1)` |
| Nested object access crash | `Cannot read property of undefined` | Accessing nested props without checks | Use optional chaining:`user?.profile?.name` |

## useEffect Errors

| Error | Keyword Trigger | Root Cause | Fix |
| ------- | ----------------- | ------------ | -----  |
| Stale closures | `stale closure`, value not updating | Missing dependency in array | Add all dependencies to array |
| Infinite loop | `Maximum update depth`, infinite re-render | State update triggers effect that updates state | Check dependency array, use correct deps |
| Memory leak | `state update on unmounted` | No cleanup function | Return cleanup:`return () => clearInterval(id)` |
| Hooks in conditional | `Hooks must be called in same order` | Hook inside if/loop | Move hook above conditional |
| Async useEffect | `async function`, `Promise` | Making useEffect callback async | Define async function inside and call it |

## Example Fixes

    // WRONG: Direct mutation
    const [items, setItems] = useState([]);
    items.push(newItem); // BAD!
    setItems(items);
    
    // CORRECT: Create new array
    setItems([...items, newItem]);
    
    // WRONG: Stale closure
    useEffect(() => {
    const interval = setInterval(() => {
    console.log(count); // Always logs initial value!
    }, 1000);
    }, []);  // Missing count in deps
    
    // CORRECT: Add dependency
    useEffect(() => {
    const interval = setInterval(() => {
    console.log(count); // Always current value
    }, 1000);
    return () => clearInterval(interval);  // Cleanup!
    }, [count]);
    
    // WRONG: Async useEffect
    useEffect(async () => {  // ERROR!
    const data = await fetchData();
    }, []);
    
    // CORRECT: Async inside
    useEffect(() => {
    async function fetchData() {
    const data = await api.get('/');
        setData(data);
      }
      fetchData();
    }, []);
    

---

## TAILWIND CSS COMMON ISSUES (Web Sourced)

**Source:** javacodegeeks.com, tailwindcss.com, Stack Overflow, Reddit 2024

---

## Tailwind Not Working

| Issue | Keyword Trigger | Root Cause | Fix |
|-------|-----------------|------------|-----|
| Styles not applying | `tailwind not working`, `classes not applying` | Missing or wrong content config | Check`content` in tailwind.config.js |
| Works dev, fails prod | `styles missing production`, `purging` | Content paths not matching prod files | Add all file paths to content array |
| Missing directives | `@tailwind base`, no base styles | Directives not in CSS file | Add `@tailwind base/components/utilities` |
| Dynamic classes not working | `bg-${color}` not working | Tailwind purges dynamic classes | Use complete class names, add to safelist |
| Classes conflicting | `!important`, CSS not applying | Other CSS overriding Tailwind | Use `!`prefix:`!p-4` or check CSS order |

---

## tailwind.config.js Critical Setup

    // tailwind.config.js - MUST HAVE for Next.js
    module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    // ADD ALL PATHS WHERE YOU USE TAILWIND CLASSES
      ],
    theme: {
    extend: {},
      },
    plugins: [],
    };
    

/*globals.css - Required directives*/
@tailwind base;
@tailwind components;
@tailwind utilities;

    ---
    
    ## Quick Keyword Search Index 2
    
    | Keyword Pattern | Section |
    | ----------------- | ---------  |
    | `useState`, `push`, `splice` | React State Mutation |
    | `stale closure`, `old value` | React useEffect Deps |
    | `Maximum update depth` | React Infinite Loop |
    | `state update on unmounted` | React Memory Leak |
    | `tailwind not working` | Tailwind Content Config |
    | `styles missing production` | Tailwind Purging |
    
    ## [REAL WEB-SOURCED DATA] 2
    
    ### Sources: Telerik, refine.dev, React.dev, tailwindcss.com, Stack Overflow 2024
    
    ## POSTGRESQL COMMON ERRORS (Web Sourced)
    
    **Source:** Percona, site24x7, Medium, servbay.com, PostgreSQL Docs 2024
    
    ---
    
    ## Connection & Startup Errors
    
    | Error | Keyword Trigger | Root Cause | Fix |
    |-------|-----------------|------------|-----|
    | Connection refused | `ECONNREFUSED`, `connection refused`, `server not running` | PostgreSQL not running or wrong port | Check`service postgresql status`, verify port |
    | Permission denied | `permission denied for table`, `GRANT`| User lacks privileges |`GRANT SELECT, INSERT ON table TO user;` |
    | Disk full | `disk full`, `could not write`, `no space left` | Out of disk space | Check disk usage, clean old logs/backups |
    | Too many connections | `too many clients`, `sorry, too many clients` | Max connections exceeded | Increase`max_connections` or use connection pooling |
    
    ---
    
    ## Performance Errors
    
    | Error | Keyword Trigger | Root Cause | Fix |
    | ------- | ----------------- | ------------ | -----  |
    | Slow queries | `slow query`, `query timeout`, `PQueueLimit` | Missing indexes, inefficient query | Use`EXPLAIN ANALYZE`, add indexes |
    | High CPU | `high CPU postgres`, `autovacuum` | Bloated tables, bad autovacuum | Tune autovacuum, run`VACUUM ANALYZE` |
    | Out of memory | `out of memory`, `OOM killer` | work_mem too high, big queries | Reduce`work_mem`, optimize queries |
    | Replication lag | `replication lag`, `standby behind` | Slow replica, network issues | Check network, monitor`pg_stat_replication` |
    
    ## PostgreSQL Connection String Fix
    

## Standard PostgreSQL URL format

DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"

## With SSL (production)

DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"

## Connection pooling with Prisma

DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?connection_limit=5&pool_timeout=20"

    ---
    
    ## NEXTAUTH / JWT COMMON ERRORS (Web Sourced)
    
    **Source:** Clerk, getfishtank.com, Medium, Stack Overflow, NextAuth docs 2024
    
    ---
    
    ## Token & Session Errors
    
    | Error | Keyword Trigger | Root Cause | Fix |
    | ------- | ----------------- | ------------ | -----  |
    | Token expired | `jwt expired`, `token expired`, `session invalid` | JWT reached maxAge | Implement token refresh in jwt callback |
    | jwt.verify fails | `jwt malformed`, `invalid signature`, `jwt verification` | NextAuth encrypts, not just signs | Use`jose`library, not jsonwebtoken |
    | Session null | `getSession null`, `getServerSession null`, `session undefined` | NEXTAUTH_SECRET missing/mismatch | Ensure same secret in all environments |
    | Multi-tab race | `outdated token`, `token rotation`, multiple tabs | Token rotation race condition | Lock refresh requests, handle errors |
    
    ## Critical NextAuth Configuration
    

// auth.ts - Critical settings
export const authOptions: NextAuthOptions = {
secret: process.env.NEXTAUTH_SECRET, // MUST BE SAME IN ALL ENVS
session: {
strategy: "jwt",
maxAge: 30 *24*60* 60, // 30 days
  },
cookies: {
sessionToken: {
name: `next-auth.session-token`,
options: {
httpOnly: true,
sameSite: 'lax', // NOT 'strict' - causes cross-origin issues
path: '/',
secure: process.env.NODE_ENV === 'production',
      },
    },
  },
callbacks: {
async jwt({ token, user, account }) {
// Persist user data to token on first sign in
if (account && user) {
return {
        ...token,
accessToken: account.access_token,
refreshToken: account.refresh_token,
accessTokenExpires: account.expires_at * 1000,
        };
      }

// Return token if not expired
if (Date.now() < token.accessTokenExpires) {
return token;
      }

// Token expired - refresh it
return refreshAccessToken(token);
    },
  },
};

    ---
    
    ## Environment Variables Checklist
    

## REQUIRED for NextAuth

NEXTAUTH_URL=<<<<<<<https://your-domain.com>>>>>>> # Production URL
NEXTAUTH_SECRET=your-secret-here # SAME across all envs

## For OAuth providers

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_ID=
GITHUB_SECRET=

    ---
    
    ## API DESIGN COMMON ISSUES (Web Sourced)
    
    **Source:** Forbes, dev.to, Medium, GraphQL docs, OWASP 2024
    
    ---
    
    ## REST API Issues
    
    | Issue | Keyword Trigger | Root Cause | Fix |
    | ------- | ----------------- | ------------ | -----  |
    | Over-fetching | `too much data`, `bandwidth`, large response | Endpoint returns all fields | Add field selection, GraphQL |
    | Under-fetching | `multiple requests`, `N+1 API calls` | Need multiple endpoints | Add aggregated endpoints, embed related data |
    | No versioning | `breaking change`, `API version` | Changes break clients | Add`/v1/`, `/v2/`versioning |
    | Missing pagination | `timeout`, `memory`, large dataset | Returns all records | Add `?page=1&limit=20` |
    
    ## GraphQL Issues
    
    | Issue | Keyword Trigger | Root Cause | Fix |
    | ------- | ----------------- | ------------ | -----  |
    | N+1 queries | `N+1`, `slow resolver`, many DB calls | Each field triggers query | Use DataLoader for batching |
    | Query depth attack | `DoS`, `deeply nested`, timeout | Unlimited query depth | Add depth limiting middleware |
    | Caching hard | `cache miss`, `GraphQL cache` | Dynamic queries break cache | Use persisted queries, response caching |
    | Schema changes break | `breaking schema`, `field removed` | No deprecation strategy | Mark fields @deprecated first |
    
    ## API Security Best Practices
    

// API Route Security Checklist
export async function POST(req: Request) {
// 1. Rate limiting
const rateLimited = await checkRateLimit(req);
if (rateLimited) return new Response('Too Many Requests', { status: 429 });

// 2. Authentication
const session = await getServerSession(authOptions);
if (!session) return new Response('Unauthorized', { status: 401 });

// 3. Input validation
const body = await req.json();
const parsed = schema.safeParse(body);
if (!parsed.success) return new Response('Bad Request', { status: 400 });

// 4. Authorization
const hasAccess = await checkPermissions(session.user.id, parsed.data.resourceId);
if (!hasAccess) return new Response('Forbidden', { status: 403 });

// 5. Business logic
const result = await processRequest(parsed.data);

return Response.json(result);
}

    ---
    
    ## Quick Keyword Search Index 3
    
    | Keyword Pattern | Section |
    | ----------------- | ---------  |
    | `ECONNREFUSED`, `connection refused` | PostgreSQL Connection |
    | `too many clients` | PostgreSQL Max Connections |
    | `slow query`, `EXPLAIN` | PostgreSQL Performance |
    | `jwt expired`, `token expired` | NextAuth Token Expiry |
    | `getSession null`, `session undefined` | NextAuth Session |
    | `NEXTAUTH_SECRET` | NextAuth Configuration |
    | `N+1`, `over-fetching` | API Design Issues |
    
    ## [REAL WEB-SOURCED DATA] 2 2
    
    ### Sources: Percona, Clerk, Forbes, GraphQL docs, OWASP 2024
    
    ## DOCKER COMMON ERRORS (Web Sourced)
    
    **Source:** Medium, tech-couch.com, plainenglish.io, Docker Docs 2024
    
    ---
    
    ## Build & Deploy Errors
    
    | Error | Keyword Trigger | Root Cause | Fix |
    | ------- | ----------------- | ------------ | -----  |
    | Image too large | `large image`, `slow build`, `disk space` | Including dev deps, no multi-stage | Use multi-stage builds, Alpine base |
    | Can't connect to daemon | `Cannot connect to Docker daemon`, `docker.sock` | Daemon not running or no permission | Start Docker, add user to docker group |
    | No space left | `no space left on device`, `disk full`| Old images/containers accumulated |`docker system prune -a` |
    | Build cache issues | `stale cache`, `not using new code`| Cached layer not invalidated |`docker build --no-cache` |
    | Port already in use | `bind: address already in use`, `port conflict` | Another process using port | Kill process or use different port |
    
    ## Security Errors
    
    | Error | Keyword Trigger | Root Cause | Fix |
    | ------- | ----------------- | ------------ | -----  |
    | Running as root | `running as root`, `privilege escalation` | No USER in Dockerfile | Add`USER node`or non-root user |
    | Exposed secrets | `secrets in image`, `ENV contains password` | Secrets baked in image | Use Docker secrets, env vars at runtime |
    | Vuln image | `CVE`, `vulnerability`, `security scan` | Outdated base image | Update base image, scan with Trivy |
    
    ## Production Dockerfile Best Practices
    

## PRODUCTION DOCKERFILE - Multi-stage, secure

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

## Security: Non-root user

RUN addgroup --system app && adduser --system --ingroup app app
USER app

## Only copy what's needed

COPY --from=builder --chown=app:app /app/dist ./dist
COPY --from=builder --chown=app:app /app/node_modules ./node_modules

## Health check

HEALTHCHECK --interval=30s --timeout=3s \
| CMD wget --spider <<http://localhost:3000/health>> |  | exit 1 |

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main.js"]

    ---
    
    ## CSS FLEXBOX & GRID ERRORS (Web Sourced)
    
    **Source:** kombai.com, plainenglish.io, Chrome DevTools docs, Medium 2024
    
    ---
    
    ## Flexbox Common Errors
    
    | Error | Keyword Trigger | Root Cause | Fix |
    |-------|-----------------|------------|-----|
    | flex on wrong element | `display: flex not working` | Applied to items, not container | Apply`display: flex` to parent |
    | justify-content not working | `justify-content no effect` | Items fill all space, no room | Check`flex-grow`, set `flex: 0 1 auto` |
    | Items not centering vertically | `align-items not working`, `vertical center` | Container has no height | Set explicit height on container |
    | Items overflowing | `flex items overflow`, `not shrinking` | min-width: auto default | Set`min-width: 0` on flex items |
    | align-content vs align-items | `align-content not working`| Single line layout |`align-content`only works with`flex-wrap: wrap` |
    
    ---
    
    ## Grid Common Errors
    
    | Error | Keyword Trigger | Root Cause | Fix |
    |-------|-----------------|------------|-----|
    | Grid not working | `display: grid not working` | Missing on parent | Apply`display: grid` to container |
    | Items overlapping | `grid items overlap`, `z-index grid` | Same grid-area or row/column | Use explicit grid-area names |
    | Implicit rows too small | `grid rows auto`, `content cut off` | No`grid-auto-rows`set | Set`grid-auto-rows: minmax(100px, auto)` |
    | FR units not responsive | `1fr fixed`, `grid not flexible` | Fixed column mixed with 1fr | Use`minmax()` for flexible sizing |
    | Gap causing overflow | `grid gap overflow`, `scrollbar` | Explicit width + gap > container | Use`calc(100% - gap)` or fix sizing |
    
    ---
    
    ## CSS Debug Quick Tips
    

/*Debug: See all element boundaries*/

- { outline: 1px solid red !important; }

/*Debug: Highlight specific layout type*/
[style*="display: flex"] { outline: 2px solid blue !important; }
[style*="display: grid"] { outline: 2px solid green !important; }

    DevTools Tips:
    
    1. Elements > click element > see "flex" or "grid" badge
    1. Click badge to open layout editor
    1. Toggle grid/flex overlay to see lines
    1. Use Layout panel for detailed info
    

---

## Quick Keyword Search Index 4

| Keyword Pattern | Section |
| ----------------- | ---------  |
| `Cannot connect to Docker daemon` | Docker Daemon |
| `no space left on device` | Docker Disk Space |
| `running as root` | Docker Security |
| `multi-stage build` | Docker Best Practices |
| `display: flex not working` | Flexbox Container |
| `justify-content no effect` | Flexbox Space Distribution |
| `display: grid not working` | Grid Container |
| `grid items overlap` | Grid Placement |

### [REAL WEB-SOURCED DATA] 2 2 2

#### Sources: Medium, tech-couch.com, Chrome DevTools, kombai.com 2024

## NPM / YARN / PNPM ERRORS (Web Sourced)

**Source:** npmjs.com, yarnpkg.com, pnpm.io, Medium, nodesource.com 2024

---

## npm Common Errors

| Error | Keyword Trigger | Root Cause | Fix |
|-------|-----------------|------------|-----|
| Permission denied | `EACCES`, `permission denied`, `npm ERR!`| No write access to node_modules |`sudo npm install -g` or fix permissions |
| Module not found | `Cannot find module`, `MODULE_NOT_FOUND`| Missing dependency or bad path |`npm install`, check import paths |
| Out of memory | `JavaScript heap out of memory`| Large dependency tree |`NODE_OPTIONS="--max-old-space-size=4096"` |
| Version conflict | `ERESOLVE`, `peer dep conflict`| Conflicting versions |`npm install --legacy-peer-deps` |
| Registry error | `ETIMEDOUT`, `registry.npmjs.org` | Network or proxy issue | Check network, configure proxy |

---

## yarn Common Errors

| Error | Keyword Trigger | Root Cause | Fix |
| ------- | ----------------- | ------------ | -----  |
| Missing lockfile | `YN0020`, lockfile entry | package.json changed, no install | Run `yarn install`after changes |
| Peer dep issues | `YN0002`, peer dependency | Missing peer dependency | Install required peer deps |
| Incompatible deps | `YN0024`, workspace constraint | Version mismatch in workspace | Align versions in workspace |
| Missing fetcher | `YN0011`, no fetcher | Missing Yarn plugin | Install required plugin |

## pnpm Common Errors

| Error | Keyword Trigger | Root Cause | Fix |
| ------- | ----------------- | ------------ | -----  |
| Peer dep issues | `ERR_PNPM_PEER_DEP_ISSUES` | Unresolved peer deps | Install peer deps or use`--strict-peer-dependencies=false` |
| Outdated lockfile | `ERR_PNPM_OUTDATED_LOCKFILE` | Lockfile out of sync | Run`pnpm install` |
| Tarball integrity | `ERR_PNPM_TARBALL_INTEGRITY` | Corrupted package | Delete lockfile, reinstall |
| Unexpected store | `ERR_PNPM_UNEXPECTED_STORE`| node_modules linked to wrong store |`pnpm store prune`, reinstall |

## Package Manager Quick Fixes

    
    ## npm: Clear cache and reinstall
    
    npm cache clean --force
    rm -rf node_modules package-lock.json
    npm install
    
    ## yarn: Clear cache and reinstall
    
    yarn cache clean
    rm -rf node_modules yarn.lock
    yarn install
    
    ## pnpm: Clear cache and reinstall
    
    pnpm store prune
    rm -rf node_modules pnpm-lock.yaml
    pnpm install
    

---

## SUPABASE COMMON ERRORS (Web Sourced)

**Source:** Supabase docs, Medium, Stack Overflow, Reddit 2024

---

## Authentication Errors 2

| Error | Keyword Trigger | Root Cause | Fix |
| ------- | ----------------- | ------------ | -----  |
| Auth session missing | `AuthSessionMissingError`, session null | Email link pre-fetched by provider | Add CAPTCHA, use redirect button |
| Database error email link | `AuthApiError database error` | Misconfigured user table | Check auth schema, user table |
| 500 auth errors | `500`, auth, SMTP | SMTP misconfigured or DB constraint | Check SMTP settings, DB logs |
| Email not authorized | `Email address cannot be used` | No SMTP configured (2024 change) | Configure custom SMTP server |

## Database Errors

| Error | Keyword Trigger | Root Cause | Fix |
| ------- | ----------------- | ------------ | -----  |
| Too many connections | `too many connections`, `max client` | Serverless connection flood | Use Supavisor pooler, transaction mode |
| RLS policy violation | `violates row-level security` | Missing INSERT/UPDATE policy | Add permissive policy for action |
| Timeout/5xx | `timeout`, `5xx`, `504` | Under-provisioned compute | Upgrade compute, optimize queries |
| RLS performance | `slow RLS`, `policy timeout` | Complex RLS subqueries | Index policy columns, simplify queries |

## Supabase Connection String

// Standard connection (for server-side)
const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

// With service role (for admin ops - NEVER expose to client)
const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

// Common .env setup
    NEXT_PUBLIC_SUPABASE_URL=<<<<<<<https://xxx.supabase.co>>>>>>>
    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx // NEVER in NEXT_PUBLIC_

## Quick Keyword Search Index 5

| Keyword Pattern | Section |
| ----------------- | ---------  |
| `EACCES`, `permission denied npm` | npm Permissions |
| `ERR_PNPM_PEER_DEP_ISSUES` | pnpm Peer Deps |
| `YN0020`, `lockfile` | yarn Lockfile |
| `AuthSessionMissingError` | Supabase Auth |
| `too many connections supabase` | Supabase Pooling |
| `violates row-level security` | Supabase RLS |

### [REAL WEB-SOURCED DATA] 3

#### Sources: pnpm.io, yarnpkg.com, Supabase docs, Medium 2024

## THE IMPOSSIBLE PATTERNS

> **DENSE 24K GOLD - From these seeds, an LLM builds worlds**

---

## POSTMORTEM WISDOM

| LESSON | HIDDEN TRUTH | ARCHITECTURAL IMPLICATION |
| -------- | -------------- | ---------------------------  |
| Redundancy Resilience | Copies fail together | ISOLATE blast radius |
| Generous timeouts = Cascade | Requests pile, resources exhaust | Fail FAST < 3s |
| Autoscaling can kill | Scales into failing region | Add kill switches |
| Dependency you forgot | Least understood = outage source | Map ALL deps |
| Monitoring only uptime | Hides degradation until too late | Measure TRENDS |

## WHYS THAT MATTER

    
    1. WHY did it break? Find mechanism
    1. WHY wasn't it caught? Find detection gap
    1. WHY did fix take so long? Find observability gap
    1. WHY didn't we prevent? Find process gap
    1. WHY will it happen again? Find systemic pattern
    

---

## SENIOR DEV COMPRESSED WISDOM

| TRUTH | JUNIOR THINKS | SENIOR KNOWS |
| ------- | --------------- | --------------  |
| Done | PR merged | Stable 1 week in prod |
| Simple | Few features | Few dependencies |
| Fast | Quick code | Quick to understand |
| Clever | Complex solution | Obvious solution |
| Tested | All green | Tested FAILURE paths |
| Debugged | Found bug | Found SYSTEM flaw |

## PATTERNS

| NAME | SYMPTOM | THE REAL PROBLEM |
| ------ | --------- | ------------------  |
| Distributed Monolith | Microservices but coupled | Missing domain boundaries |
| Cache Everything | Fast but stale | No invalidation strategy |
| Event Soup | Everything async | Missing transaction boundaries |
| Magic Gateway | One service knows all | Create god service |
| Config Sprawl | ENVs everywhere | No source of truth |
| Log Blindness | GB of logs, no insight | Wrong granularity |

## THE DECISIONS THAT SHAPED PRODUCTION

| DECISION POINT | WRONG INTUITION | BATTLE-TESTED CHOICE |
| ---------------- | ----------------- | ----------------------  |
| Auth token storage | localStorage fast | httpOnly cookie |
| API error format | Include stack | Error code + message only |
| DB connection | Open when needed | Pool, singleton |
| Feature flags | Simple boolean | Context-aware rules |
| Rate limit | Per endpoint | Per user action time |
| Caching | Cache response | Cache BY user, BY time |
| Logging | Log everything | Log BUSINESS events |

## FAILURE MODE CATALOG

| MODE | LOOKS LIKE | ACTUALLY IS |
| ------ | ------------ | -------------  |
| Slow degradation | "Getting slower" | Memory leak / connection leak |
| Intermittent | "Sometimes fails" | Race condition / timing |
| Works locally | "Fine on my machine" | ENV / dep version / case sensitivity |
| Random errors | "Chaos" | Retry storm / thundering herd |
| Sudden death | "Just crashed" | OOM / disk full / connection exhaust |

## SCALING TRUTHS

    1 user works 100 users shows design flaws
    100 works 10K shows DB design flaws
    10K works 100K shows cache design flaws
    100K works 1M shows architecture flaws
    

---

## THE COMPRESSION

Each line above = hours/days of debugging.
LLM reads expands with context solves problem.
This is TRIBAL KNOWLEDGE - not in any doc.

---

## DECISION COMPRESSION ENGINE

> **For AI: Given situation Match pattern Apply decision**

---

## PATTERN: "It works locally but..."

    IF: works locally + fails deployed
    CHECK IN ORDER:
    
    1. ENV vars (NEXT_PUBLIC_ prefix?)
    1. Case sensitivity
    1. Build-time vs runtime (SSR/CSR boundary)
    1. Dependencies (devDeps in prod?)
    1. Secrets (not in .env.production?)
    

---

## PATTERN: "It was working yesterday..."

    IF: regression + no code changes
    CHECK IN ORDER:
    
    1. Dependency auto-update (^version)
    1. External API change
    1. Certificate expiry
    1. DB migration in other branch
    1. Env var changed by teammate
    

---

## PATTERN: "It works once then fails..."

    IF: first request OK + subsequent fail
    CHECK IN ORDER:
    
    1. Connection not released (pool exhaust)
    1. Cache poisoned on first call
    1. One-time token consumed
    1. Rate limit hit
    1. Singleton state corrupted
    

---

## PATTERN: "It randomly fails..."

    IF: intermittent + unpredictable
    CHECK IN ORDER:
    
    1. Race condition (async order)
    1. Timeout boundary (some requests slow)
    1. Memory pressure (GC pauses)
    1. Network partition (microservice)
    1. Third-party instability
    

---

## PATTERN: "It gets slower over time..."

    IF: degradation + cumulative
    CHECK IN ORDER:
    
    1. Memory leak (event listeners, closures)
    1. Connection leak (DB, HTTP)
    1. Log file growth
    1. Cache unbounded growth
    1. Goroutine/thread leak
    

---

### [24K GOLD DENSITY]

#### From these patterns AI solves the impossible

---

## THE PATTERNS THAT BROKE PRODUCTION

> **Real incidents Compressed lessons Never repeat**

---

## CATASTROPHIC PATTERN: Flag Reuse

    Knight Capital: $440M in 45 minutes
    CAUSE: Reused old software flag for new feature
    Old dead code activated + traded against market
    LESSON: Dead code = ticking bomb (DELETE IT)
    

---

## CATASTROPHIC PATTERN: Missing Timeout

    Amazon S3 Outage 2017: 4 hours, billions lost
    CAUSE: Billing script ran without limit, cascaded
    LESSON: Every batch job needs: timeout + pg limit + rollback
    

---

## CATASTROPHIC PATTERN: Single Point Control

    Cloudflare 2019: 30 minutes, global outage
    CAUSE: Single regex backtrack in WAF rule
    LESSON: Regex = execution bomb (use RE2, set limits)
    

---

## DEBUGGING HEURISTICS (GOLD)

| IF YOU SEE | CHECK FIRST | LIKELY CAUSE |
| ------------ | ------------- | --------------  |
| CPU 100% constantly | Single thread | Infinite loop / regex backtrack |
| Memory growing forever | Heap snapshot diff | Event listener leak / closure leak |
| Random 500s | Timing + logs | Race condition / connection pool |
| Slow then fast then slow | Metrics pattern | GC thrashing / cache eviction |
| Works dev, fails prod | Env diff | Secret missing / dep version |

## TECH DEBT DECISION MATRIX

| SITUATION | TAKE DEBT? | REASONING |
| ----------- | ------------ | -----------  |
| MVP to validate | YES | Speed > perfection, may pivot |
| Core auth/payment | NO | Security debt = existential risk |
| Scale 10x coming | NO | Debt compounds at scale |
| Team leaving | NO | Knowledge debt = permanent |
| Demo to investor | YES | Existence > elegance |
| Production feature | STRATEGIC | Planned payback < 3 sprints |

## SCALE ARCHITECTURE TRUTHS

    1-10 users: Monolith, one DB, one server
    10-1K: Still monolith, add Redis cache
    1K-100K: Vertical scale hits limit, time to split
    100K-1M: Microservices or die, async becomes critical
    1M+: Every decision from day 1 haunts you
    

---

## THE REAL COST OF DECISIONS

| DECISION | SEEMS LIKE | ACTUALLY COSTS |
| ---------- | ------------ | ----------------  |
| Skip tests | Save 20% time | 10x debugging later |
| Copy-paste code | Fast | N copies to maintain |
| Any external API | Easy integration | Entire team on-call for their outage |
| SQL in application | Flexible | Every dev = DBA |
| Log everything | Good visibility | $10K/month logging bill |
| Cache everything | Faster | Consistency hell |

## THE IMPOSSIBLE DEBUGGING PATTERNS

> **When Stack Overflow fails, this is what saved us**

---

## PATTERN: "The test passes but prod fails"

    CAUSE CHAIN:
    
    1. Test uses mock prod uses real service
    1. Mock returns fast real times out
    1. Race condition only visible under real latency
    FIX: Integration tests with REAL services, chaos
    

---

## PATTERN: "It fails every 49.7 days"

    CAUSE: 32-bit integer overflow (milliseconds timer)
    2^31 ms = 24.86 days 2 = 49.7 days
    FIX: Use 64-bit for all time tracking
    

---

## PATTERN: "Works on all machines except one"

    CAUSE CHAIN (check in order):
    
    1. Locale settings (date/number format)
    1. Timezone (server vs UTC)
    1. Filesystem (case, encoding)
    1. DNS resolver differences
    1. Hardware (ARM vs x86)
    

---

## PATTERN: "Slow only on Tuesdays"

    CAUSE: Cron job + traffic pattern
    
    - Backup cron runs Tuesday 2am
    - Wakes up at same time as Europe traffic
    - IO contention = slow for 2 hours
    FIX: Stagger crons, monitor overlap
    

---

## PATTERN: "Random user can't login"

    CAUSE CHAIN:
    
    1. UUID collision? (No, astronomically rare)
    1. Email case sensitivity? (YES - COMMON)
    User registered: John@email.com
    User logs in: john@email.com
    DB: case sensitive comparison fails
    FIX: Lowercase all emails at registration AND login
    

---

## PRODUCTION INTUITION RULES

    
    1. If it's random it's a race condition
    1. If it degrades something is leaking
    1. If it worked yesterday env/dep changed
    1. If only in prod missing env or latency-dependent
    1. If affects some users data-dependent (edge case)
    1. If correlated with time cron/batch/timezone
    1. If spiky thundering herd or cache stampede
    

---

## [24K GOLD: YEARS OF PAIN COMPRESSED]

### Each line above saved a production outage

---

## AI AGENT TRIBAL KNOWLEDGE

> **FOR AGENTIC CODERS: The patterns that make AI work FOR you, not against you**

---

## AI HALLUCINATION PATTERNS

| AI DOES THIS | WHY IT'S DANGEROUS | YOUR DEFENSE |
| -------------- | ------------------- | --------------  |
| Invents packages | Package doesn't exist, could be typosquat | Verify EVERY import exists in npm/pypi |
| Deprecated methods | Trained on old data | Check version docs, use latest API |
| Confident but wrong | Optimized to sound right | TEST EVERYTHING, trust nothing |
| Missing error handling | Optimizes happy path | Add try/catch, edge cases manually |
| Security holes | Doesn't understand attack vectors | Security review EVERY generated code |

## 30% RULE (2024 Studies)

    >30% of AI-generated code contains security vulnerabilities
    >Each AI iteration can INCREASE vulnerability rate
    >More iterations better code (can compound errors)
    

---

## PROMPT ENGINEERING FOR CODE (COMPRESSED)

| TECHNIQUE | WHAT TO DO | WHY IT WORKS |
| ----------- | ------------ | --------------  |
| PERSONA | "You are senior backend engineer" | Changes code quality/style |
| SPECIFIC | State language, framework, version | Reduces hallucination |
| FEW-SHOT | Give example of desired output | Model mimics pattern |
| DECOMPOSE | Break into function-by-function | Smaller = more accurate |
| GUARDRAILS | "Do NOT modify X, Y, Z" | Prevents unintended changes |
| LEADING | Start with "import", "SELECT" | Nudges correct syntax |

## THE VIBE CODING TRAP

| SEEMS LIKE | ACTUALLY COSTS |
| ------------ | ----------------  |
| Fast prototyping | Unmaintainable code in prod |
| Less learning needed | Skill atrophy (can't debug) |
| AI knows best | AI invents non-existent APIs |
| Iterate to fix | Compounds errors with each pass |
| Copy-paste works | Understanding is zero |

## SPECIFIC PATTERNS

## Cursor

    NETWORKING: VPN/proxy enable HTTP/1.1 fallback
    INDEXING: Large codebase fails silently
    CONTEXT: Multi-file loses track wrong suggestions
    

## Copilot

    EXCLUSIONS: Admin can block files stops working in those
    AUTH: Token expires seems broken but just re-auth
    CONTEXT: Only sees open files doesn't know project structure
    

## Replit AI

    GENERATE: No project context generic code
    CHAT: Better than generate use this mode
    TESTS: Unreliable test generation write manually
    

## v0 / Vercel

    STYLE: Great for UI weak on logic
    COPY: Looks right doesn't work in your stack
    DEPS: Assumes different versions check package.json
    

---

## AI CODE REVIEW CHECKLIST

    Does this import exist in npm/pypi?
    Is this method in the CURRENT version docs?
    Where is error handling?
    What happens with null/undefined input?
    What happens at edge cases (empty, max, 0)?
    Is there any hardcoded secret?
    Does this match existing project patterns?
    Can I explain what this does without AI?
    

---

## EFFECTIVE VIBE CODING WORKFLOW

    
    1. PLAN in natural language (what, not how)
    1. DECOMPOSE into small functions
    1. PROMPT with specificity (language, version, constraints)
    1. REVIEW every line AI generates
    1. TEST before accepting (run it!)
    1. UNDERSTAND before committing
    1. NEVER trust, always verify
    

---

## WHEN AI FAILS PATTERNS

| SYMPTOM | ROOT CAUSE | YOUR MOVE |
| --------- | ------------ | -----------  |
| Loops forever | AI logic error | Rewrite from scratch |
| Import not found | Hallucinated package | Search npm manually |
| Type mismatch | Wrong version assumed | Check actual types |
| Works but slow | Naive algorithm | Specify performance needs |
| Breaks other code | Lost context | Smaller scope, more guardrails |

## [24K GOLD: AI AGENT TRIBAL KNOWLEDGE]

### From these patterns Vibe coding that actually works

---

## DATABASE QUERY TRIBAL KNOWLEDGE

> **The patterns that save production databases from death**

---

## N+1 QUERY DEATH (The #1 ORM Killer)

    WHAT IT LOOKS LIKE:
    1 query: Get all users
    N queries: Get posts for each user (N = 1000 users = 1000 queries)
    
    WHY IT KILLS:
    
    - 1 user = fine
    - 100 users = slow
    - 1000 users = timeout
    - Connection pool exhausted crash
    
    DETECTION:
    
    - Slow page load but fast individual queries
    - Query log shows same pattern repeated
    - DB connections spike with load
    

---

## N+1 FIX PATTERNS (Per ORM)

| ORM | FIX PATTERN |
| ----- | -------------  |
| Prisma | `include: { posts: true }` |
| Sequelize | `include: [{ model: Post }]` |
| Django | `prefetch_related('posts')` |
| SQLAlchemy | `joinedload(User.posts)` |
| ActiveRecord | `includes(:posts)` |
| TypeORM | `relations: ['posts']` |

## PATTERNS 2

| ANTI-PATTERN | WHY IT'S BAD | FIX |
| -------------- | -------------- | -----  |
| Index on every column | Slows ALL writes | Only index WHERE/JOIN columns |
| Low selectivity index | Gender, bool = useless | Skip unless composite |
| Wrong composite order | `(status, id)`when query is`WHERE id` | Put filtered columns FIRST |
| Duplicate indexes | Same columns different names | Delete duplicates |
| Never rebuild | Fragmented = slow reads | Monthly maintenance |
| Giant VARCHAR index | Slow comparison | Use hash or prefix |
| No FK index | JOIN does full scan | ALWAYS index foreign keys |

## QUERY OPTIMIZATION GOLD

| WHAT YOU WRITE | WHY IT'S SLOW | WHAT TO WRITE |
| ---------------- | --------------- | ---------------  |
| `SELECT *` | Network + memory waste | Select only needed columns |
| `LIKE '%search%'` | Can't use index | Full-text search or prefix |
| `WHERE id = '123'`(string) | Type conversion = no index | Use correct type |
| `SELECT DISTINCT`everywhere | Often masks bad JOIN | Fix JOIN logic |
| Subquery in SELECT | Runs per row | Rewrite as JOIN |
| No LIMIT on dev query | Fetches millions | Always LIMIT |

## THE EXPLAIN MOMENT

    -- ALWAYS check EXPLAIN before shipping query
    EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'x@y.com';
    
    LOOK FOR:
    
    - Seq Scan on large table = MISSING INDEX
    - Nested Loop with high rows = N+1 pattern
    - Sort with high memory = needs ORDER BY index
    - Bitmap Heap Scan = index exists but not optimal
    

---

## CONNECTION POOL TRUTHS

    DEFAULT is almost always wrong for serverless
    
    FORMULA for connection_limit:
    (db_max_connections - reserved) / num_serverless_instances
    
    EXAMPLE:
    PostgreSQL max: 100
    Reserved for admin: 5
    Vercel instances: 10
    Per function: (100-5)/10 = 9 connections
    
    PRISMA ENV:
      DATABASE_URL="...?connection_limit=5&pool_timeout=20"
    

---

## MIGRATION DISASTERS

| WHAT YOU DO | WHAT HAPPENS | PREVENTION |
| ------------- | -------------- | ------------  |
| Add column NOT NULL | Table lock + backfill | Add nullable, then backfill, then constraint |
| Add index on prod | Locks table | CREATE INDEX CONCURRENTLY |
| Rename column | App breaks | Add new, copy data, deploy, drop old |
| Change column type | Data loss possible | Create new, migrate, drop old |
| Drop table | Irreversible | Rename first, drop after confirming |

## CACHING DECAY PATTERNS

    CACHE STAMPEDE:
    
    - Popular key expires
    - 1000 requests hit at same moment
    - All 1000 go to DB
    - DB dies
    
    FIX: Early expiry jitter + mutex lock on regenerate
    
    STALE CACHE:
    
    - Data updated
    - Cache not invalidated
    - Users see old data
    
    FIX: Write-through OR explicit invalidation on mutation
    

---

## [24K GOLD: DATABASE TRIBAL KNOWLEDGE]

### Each pattern above saved a production incident

---

## MICROSERVICES TRIBAL KNOWLEDGE

> **The patterns that separate working microservices from distributed disasters**

---

## PATTERNS 3

| ANTI-PATTERN | HOW IT LOOKS | WHY IT KILLS |
| -------------- | -------------- | --------------  |
| Distributed Monolith | Services but tight coupling | Worst of both worlds |
| Nanoservices | 100+ tiny services | Ops nightmare, network hell |
| Shared Database | Multiple services one DB | Can't deploy independently |
| Sync Everything | REST calls for everything | Cascading failures |
| No Observability | Can't trace requests | Debugging impossible |
| Chatty Services | 50 calls per request | Latency compounds, P99 explodes |

## MICROSERVICES TRUTHS

    RIGHT SIZE:
    Too big = monolith problems
    Too small = ops problems
    Right = 1 team owns, 1 domain, deploys weekly
    
    COMMUNICATION:
    Sync (REST/gRPC) = for queries, user-facing
    Async (Kafka/RabbitMQ) = for commands, eventual ok
    
    FAILURE:
    Assume every call fails
    Timeout < 3s, circuit breaker, retry with backoff
    

---

## WHEN TO USE WHAT

    BEM:
    
    - Traditional CSS
    - No build step wanted
    - Large teams, conventions
    
    CSS MODULES:
    
    - Scoped styles
    - Standard CSS syntax
    - Build-time processing
    
    TAILWIND:
    
    - Rapid prototyping
    - Utility-first
    - Design system enforcement
    
    STYLED COMPONENTS:
    
    - Dynamic theming
    - Component-scoped
    - Note: In maintenance mode (2024)
    

---

## FRONTEND PERFORMANCE TRIBAL KNOWLEDGE

> **The patterns that make users stay or leave**

---

## CORE WEB VITALS (2024)

| METRIC | WHAT | GOOD | BAD |
| -------- | ------ | ------ | -----  |
| LCP | Largest paint | < 2.5s | > 4s |
| INP | Interaction response | < 200ms | > 500ms |
| CLS | Layout shift | < 0.1 | > 0.25 |

## PERFORMANCE KILLS

| WHAT DEVS DO | WHY IT'S SLOW | FIX |
| -------------- | --------------- | -----  |
| `<script>`in head | Blocks parsing | defer or async |
| Massive bundle | Downloads forever | Code split |
| Unoptimized images | 2MB per image | WebP, AVIF, lazy load |
| No preload | Critical assets wait | `<link rel="preload">` |
| Third-party scripts | Can't control them | Load async, audit impact |
| CSS in JS runtime | Computes on render | Extract critical CSS |

## CRITICAL RENDERING PATH

    
    1. HTML DOM
    1. CSS CSSOM
    1. DOM + CSSOM Render Tree
    1. Layout Paint Composite
    
    BLOCK POINTS:
    
    - CSS blocks render (inline critical)
    - JS blocks parsing (defer/async)
    - Fonts block text (font-display: swap)
    

---

## RATE LIMITING TRIBAL KNOWLEDGE

> **The patterns that save your API and database**

## RATE LIMIT ALGORITHMS

| ALGORITHM | HOW IT WORKS | USE WHEN |
| ----------- | -------------- | ----------  |
| Fixed Window | Count per minute reset at 0s | Simple, some burst ok |
| Sliding Window | Rolling 60s window | Smooth, no cliff at reset |
| Token Bucket | Tokens refill, burst ok | API gateways, burst-friendly |
| Leaky Bucket | Fixed output rate | Traffic shaping, steady |

## TOKEN BUCKET FORMULA

    CAPACITY = max burst size
    REFILL_RATE = tokens per second (avg rate)
    
    EXAMPLE:
    Capacity: 100 tokens
    Refill: 10/sec
    
    Burst: 100 requests instant
    Sustained: 10/sec max
    Empty waits for refill
    

---

## RATE LIMIT DIMENSIONS

| DIMENSION | WHEN | WHY |
| ----------- | ------ | -----  |
| Per IP | Anonymous | Stop scraping |
| Per User | Authenticated | Fair usage |
| Per Endpoint | Resource-heavy | Protect expensive ops |
| Per Action | Login, password reset | Stop brute force |
| Global | Entire API | Protect infrastructure |

## RATE LIMIT RESPONSE

    // Always return these headers
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', resetTime);
    
    if (rateLimited) {
      res.status(429);
    res.setHeader('Retry-After', secondsUntilReset);
    return res.json({ error: 'Too many requests' });
    }
    

---

## STATE MANAGEMENT TRIBAL KNOWLEDGE

> **The patterns that prevent React re-render hell**

---

## WHEN TO USE WHAT 2

| SITUATION | USE | WHY |
| ----------- | ----- | -----  |
| Component state | useState | Local, simple |
| Sibling sharing | Lift state up | React pattern |
| Deep tree | Context or Zustand | Avoid prop drilling |
| Complex app | Redux Toolkit | Predictable, DevTools |
| Simple global | Zustand | Minimal boilerplate |

## ZUSTAND VS REDUX

| ASPECT | ZUSTAND | REDUX |
| -------- | --------- | -------  |
| Boilerplate | Minimal | More (even with RTK) |
| Learning | Easy | Steeper |
| Bundle size | ~1KB | ~10KB+ |
| DevTools | Via middleware | Native |
| Best for | Small-medium | Enterprise |

## PATTERNS 4

| ANTI-PATTERN | WHY IT'S BAD | FIX |
| -------------- | -------------- | -----  |
| Global for local | Unnecessary coupling | useState for local |
| Prop drilling 5+ levels | Maintenance hell | Context or store |
| Mutating state | React can't detect | Always spread/Immer |
| Store everything | Re-renders everywhere | Minimal store |
| Derived in store | Stale data | Compute on select |

## ZUSTAND PATTERNS

    // GOOD: Focused stores
    const useUserStore = create((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    }));
    
    const useCartStore = create((set) => ({
    items: [],
    addItem: (item) => set((s) => ({ items: [...s.items, item] })),
    }));
    
    // GOOD: Selector to prevent re-render
    const userName = useUserStore((s) => s.user?.name);
    
    // BAD: Selecting whole store
    const { user, cart, settings } = useStore();
    

---

## [24K GOLD: ARCHITECTURE + PERFORMANCE + STATE]

### The impossible patterns, compressed

---

## AUTHENTICATION TRIBAL KNOWLEDGE

> **The patterns that secure user identity**

---

## AUTH FLOW CHOICES

| FLOW | USE WHEN | WHY |
| ------ | ---------- | -----  |
| OAuth + PKCE | SPAs, mobile | No secrets in client |
| Session cookies | Traditional web | Simple, secure by default |
| JWT access + refresh | API-first | Stateless, scalable |
| Magic links | Low friction | No password to steal |

## JWT SECURITY TRUTHS

| RULE | WHY | CONSEQUENCE IF VIOLATED |
| ------ | ----- | -------------------------  |
| Short expiry (15-30min) | Limits breach window | Stolen token = prolonged access |
| Never store in localStorage | XSS reads it | Token theft via code injection |
| Validate ALL claims | iss, aud, exp | Accept forged tokens |
| Don't put PII in payload | Base64 encrypted | Expose user data |
| Use RS256 over HS256 | Asymmetric > symmetric | Secret compromise = all tokens forged |

## SESSION COOKIE FLAGS

    Set-Cookie: session=xxx;
    HttpOnly; // JS can't read
    Secure; // HTTPS only
    SameSite=Strict; // CSRF protection
      Path=/;
      Max-Age=3600;
    

---

## PATTERNS 5

| ANTI-PATTERN | WHY IT'S DANGEROUS | FIX |
| -------------- | ------------------- | -----  |
| Token in URL | Logged, leaked in referer | Authorization header |
| Long-lived tokens | Stolen = long damage | Short access + refresh |
| No refresh rotation | Reuse forever | Rotate on use |
| Implicit grant | Token in URL fragment | Auth code + PKCE |
| Custom crypto | Almost always broken | Use bcrypt, argon2 |

## DEPLOYMENT TRIBAL KNOWLEDGE

> **The patterns that prevent rollback nightmares**

---

## DEPLOYMENT STRATEGIES

| STRATEGY | HOW | ROLLBACK | USE WHEN |
| ---------- | ----- | ---------- | ----------  |
| Blue-Green | 2 envs, swap traffic | Instant | DBless or compatible schema |
| Canary | % traffic to new | Fast, partial | Need to validate in prod |
| Rolling | Instance by instance | Slower | Limited resources |
| Recreate | Kill old, start new | Downtime | Stateful, dev only |

## GREEN TRUTHS

    PROS:
    
    - Instant rollback (just swap back)
    - Full testing before live
    - Zero downtime
    
    CONS:
    
    - 2x infrastructure cost
    - Database migration complexity
    - Stateful apps need careful handling
    

---

## CANARY TRUTHS

    PROS:
    
    - Real traffic validation
    - Gradual rollout = limited blast radius
    - Can target specific user segments
    
    CONS:
    
    - Multiple versions running
    - Metrics comparison complexity
    - Feature flags needed
    

---

## ROLLBACK CHECKLIST

    Can you rollback database? (versioned migrations)
    Are feature flags in place?
    Is previous version still available?
    Can you route traffic back instantly?
    Is monitoring alerting on key metrics?
    Did you test rollback in staging?
    

---

## ERROR HANDLING TRIBAL KNOWLEDGE

> **The patterns that catch errors gracefully**

---

## ASYNC ERROR PATTERNS

    // BAD: Swallowed error
    async function bad() {
    try { await risky(); } catch (e) { } // Silent fail
    }
    
    // GOOD: Handle or rethrow
    async function good() {
    try {
    await risky();
    } catch (e) {
        logger.error(e);
    throw new AppError('Operation failed', { cause: e });
      }
    }
    
    // GOOD: Promise.allSettled for parallel
    const results = await Promise.allSettled([a(), b(), c()]);
    results.forEach(r => {
    if (r.status === 'rejected') logger.error(r.reason);
    });
    

---

## PATTERNS 6

| ANTI-PATTERN | WHY IT'S BAD | FIX |
| -------------- | -------------- | -----  |
| Empty catch | Silent failure | Log and rethrow |
| catch(e) console.log | Production blindness | Structured logging + alert |
| throw "string" | No stack trace | throw new Error() |
| Catch too broad | Hides different errors | Specific error types |
| No finally | Resources leak | Always cleanup |

## ERROR RESPONSE PATTERN

    // API Error Response
    {
    "error": {
    "code": "VALIDATION_ERROR",    // Machine readable
    "message": "Email is invalid", // Human readable
    "field": "email",  // Context
    "requestId": "abc123"  // For debugging
      }
    }
    
    // NEVER in production:
    // - Stack traces
    // - Internal paths
    // - Database errors
    // - Secret values
    

---

## TYPESCRIPT ERROR NARROWING

    // GOOD: Type guard
    function isApiError(e: unknown): e is ApiError {
    return e instanceof ApiError;
    }
    
    try {
    await fetch();
    } catch (e) {
    if (isApiError(e)) {
    // TypeScript knows e.code exists
    if (e.code === 404) return null;
      }
    throw e; // Rethrow unknown
    }
    

---

## [24K GOLD: AUTH + DEPLOY + ERROR HANDLING]

### The patterns that keep production alive

---

## TESTING TRIBAL KNOWLEDGE

> **The patterns that catch bugs before users do**

---

## TESTING PYRAMID

            /\
    / \
    / E2E\  (Few, slow, expensive)
             /------\
    / Integ \   (Some, medium speed)
           /----------\
    / Unit  \ (Many, fast, cheap)
         /_____________\
    

---

## WHEN TO USE WHAT 3

| TEST TYPE | USE WHEN | CATCHES |
| ----------- | ---------- | ---------  |
| Unit | Pure functions, logic | Algorithm bugs |
| Integration | Components together | Interface bugs |
| E2E | Critical user flows | Workflow bugs |

## TESTING TRUTHS

| MYTH | TRUTH |
| ------ | -------  |
| 100% coverage = safe | Coverage quality of tests |
| Unit tests catch all | Only catch what you test |
| E2E is slow | Worth it for critical paths |
| Mocks are always good | Over-mocking = false confidence |
| Skip tests for speed | Pay 10x later in debugging |

## WHAT TO TEST (PRIORITY ORDER)

    
    1. Business logic (money, auth, data integrity)
    1. Edge cases (null, empty, max, boundary)
    1. Integration points (API calls, DB queries)
    1. Error handling (what happens when X fails)
    1. Happy paths (basic functionality)
    

---

## PATTERNS 7

| ANTI-PATTERN | WHY IT'S BAD | FIX |
| -------------- | -------------- | -----  |
| Test implementation | Breaks on refactor | Test behavior, not code |
| Giant test file | Hard to maintain | Small, focused tests |
| Order-dependent | Flaky, unreliable | Each test independent |
| No assertions | Passes but verifies nothing | Assert expected outcome |
| Mock everything | False confidence | Mock only external systems |

## OBSERVABILITY TRIBAL KNOWLEDGE

> **The patterns that make debugging possible**

---

## THREE PILLARS

| PILLAR | WHAT | USE FOR |
| -------- | ------ | ---------  |
| Logs | Event records | Debugging, audit |
| Metrics | Numbers over time | Alerting, trends |
| Traces | Request journey | Performance, bottlenecks |

## STRUCTURED LOGGING PATTERN

    // BAD: Unstructured
    console.log(`User ${userId} bought ${item} for $${price}`);
    
    // GOOD: Structured JSON
    logger.info({
    event: 'purchase_completed',
    userId: 'xxx',
    itemId: 'yyy',
    price: 99.99,
    currency: 'USD',
    requestId: 'abc123',
    timestamp: new Date().toISOString()
    });
    

---

## LOG LEVELS TRUTHS

| LEVEL | USE FOR | EXAMPLE |
| ------- | --------- | ---------  |
| DEBUG | Dev only, verbose | Variable values |
| INFO | Normal operations | Request completed |
| WARN | Recoverable issues | Retry succeeded |
| ERROR | Failures, needs attention | Payment failed |
| FATAL | App can't continue | DB connection lost |

## PATTERNS 8

| ANTI-PATTERN | WHY IT'S BAD | FIX |
| -------------- | -------------- | -----  |
| Log PII | Privacy/legal risk | Redact or don't log |
| Log everything | Noise, storage cost | Log what matters |
| No correlation ID | Can't trace requests | Add requestId to all logs |
| Alert on every error | Alert fatigue | Alert on patterns, not events |
| Metrics no labels | Can't filter | Add service, endpoint labels |

## WHAT TO MONITOR (GOLDEN SIGNALS)

    
    1. LATENCY - How long requests take
    1. TRAFFIC - Requests per second
    1. ERRORS - Error rate percentage
    1. SATURATION - Resource usage %
    
    ALERT WHEN:
    
    - Latency P99 > threshold
    - Error rate > baseline
    - CPU/Memory > 85%
    - Connections near limit
    

---

## TRACING PATTERN

    Trace ID: abc123
    Service A (50ms)
    DB Query (40ms)
    Service B (100ms) BOTTLENECK
    External API (90ms)
    Service C (20ms)
    
    Total: 170ms
    Bottleneck: Service B External API
    

---

## [24K GOLD: TESTING + OBSERVABILITY]

### The patterns that make debugging possible

---

## GIT WORKFLOW TRIBAL KNOWLEDGE

> **The patterns that prevent merge hell**

---

## BRANCHING STRATEGY CHOICE

| TEAM SIZE | RELEASE CADENCE | STRATEGY |
| ----------- | ----------------- | ----------  |
| <5 devs | Continuous | Trunk-Based |
| 5-20 devs | Weekly | GitHub Flow |
| 20+ devs | Scheduled | GitFlow |
| Any | Multiple versions | GitFlow |

## REBASE VS MERGE

| SITUATION | USE | WHY |
| ----------- | ----- | -----  |
| Feature main | Merge | Preserve history |
| Sync feature from main | Rebase | Clean linear history |
| Shared branch | NEVER rebase | Breaks everyone's history |
| Personal cleanup | Interactive rebase | Squash before PR |

## GOOD: Rebase your feature on main before merge

git checkout feature
git rebase main
git checkout main
git merge --no-ff feature

## BAD: Rebase shared branches

git rebase main  # on shared branch = disaster

    
    ---
    
    ## CONFLICT PREVENTION
    
    1. Pull main into feature DAILY
    1. Keep branches SHORT-LIVED (1-3 days max)
    1. Small commits, small PRs
    1. Communicate about shared files
    1. Lock files if editing config
    
    ## CONFLICT RESOLUTION
    

Between markers:
<<<<<<< HEAD  = Your changes
======= = Separator
>>>>>>> branch   = Their changes

STEPS:

1. Understand both changes
1. Keep what makes sense
1. Remove ALL markers
1. git add <file>
1. git commit

    
    ---
    
    ## WEBSOCKET TRIBAL KNOWLEDGE
    
    > **The patterns that enable real-time communication**
    
    ---
    
    ## WEBSOCKET SCALING TRUTHS
    

PROBLEM: Stateful connections = hard to scale

SOLUTIONS:

1. Horizontal scale with sticky sessions
1. Pub/Sub for cross-server messaging
1. Redis for connection state
1. Kubernetes for auto-scaling

FORMULA:
Max connections = (Server memory - overhead) / per-connection memory
Example: (8GB - 2GB) / 1KB = 6 million connections theoretically
Reality: 10K-100K per server is realistic

    
    ---
    
    ## WEBSOCKET PATTERNS
    
    | PATTERN | WHAT | USE WHEN |
    | --------- | ------ | ----------  |
    | Pub/Sub | Broadcast via message broker | 10K+ connections |
    | Sticky Sessions | Route user to same server | State must persist |
    | Fallback | Long polling if WS fails | Enterprise firewalls |
    | Heartbeat | Ping/pong every 30s | Detect dead connections |
    
    ## PATTERNS 9
    
    | ANTI-PATTERN | WHY IT KILLS | FIX |
    | -------------- | -------------- | -----  |
    | No heartbeat | Zombie connections | Ping/pong + timeout |
    | Store state in memory only | Server restart = lost | Redis or similar |
    | No reconnection logic | Network blip = dead | Exponential backoff |
    | Send full data every time | Bandwidth waste | Send diffs only |
    
    ## CACHING TRIBAL KNOWLEDGE
    
    > **The patterns that make apps fast**
    
    ---
    
    ## CACHING PATTERNS
    
    | PATTERN | HOW | CONSISTENCY | USE WHEN |
    | --------- | ----- | ------------- | ----------  |
    | Cache-Aside | App checks cache, then DB | Eventual | Read-heavy |
    | Write-Through | Write to cache + DB together | Strong | Read + write |
    | Write-Behind | Write to cache, async to DB | Eventual | Write-heavy |
    | Read-Through | Cache fetches from DB | Eventual | Simplicity |
    
    ## REDIS COMMANDS YOU NEED
    

SET key value EX 3600  # Set with 1hr TTL
GET key  # Get value
DEL key  # Delete
SETEX key 3600 value  # Set + TTL atomic
SETNX key value  # Set if not exists (lock)
INCR counter  # Atomic increment

    
    ---
    
    ## THUNDERING HERD PREVENTION
    

// BAD: All requests hit DB on cache miss
// GOOD: Lock + single fetch + cache

async function getWithLock(key, fetchFn) {
const cached = await redis.get(key);
if (cached) return JSON.parse(cached);

// Acquire lock
const lock = await redis.set(`lock:${key}`, 1, 'NX', 'EX', 5);
if (!lock) {
await sleep(100);
return getWithLock(key, fetchFn); // Retry
  }

const data = await fetchFn();
await redis.setex(key, 3600, JSON.stringify(data));
await redis.del(`lock:${key}`);
return data;
}

    
    ---
    
    ## CACHE INVALIDATION TRUTHS
    

"There are only two hard things: cache invalidation and naming things"

PATTERNS:
TTL: Simple, eventually consistent
Event-based: On write, delete cache
Versioned keys: user:v2:123 instead of user:123

NEVER:
Assume cache = source of truth
Forget to invalidate on write
Use infinite TTL without plan

    
    ---
    
    ## FILE UPLOAD TRIBAL KNOWLEDGE
    
    > **The patterns that prevent upload disasters**
    
    ---
    
    ## LARGE FILE HANDLING
    

PROBLEM:
Large file = timeout, memory exhaustion

SOLUTION: CHUNKING

1. Client splits file into 5MB chunks
1. Upload chunks with index
1. Server stores chunks temporarily
1. Reassemble when all received
1. Verify checksum

    
    ---
    
    ## FILE UPLOAD SECURITY
    
    | ATTACK | HOW | PREVENTION |
    | -------- | ----- | ------------  |
    | Malicious file | Upload .exe disguised as .jpg | Check magic bytes, not extension |
    | Path traversal | ../../../etc/passwd | Sanitize filename, use UUID |
    | DoS | Upload 10GB file | Size limit, rate limit |
    | XSS | SVG with script | Sanitize SVG, CSP headers |
    
    ## UPLOAD SECURITY CHECKLIST
    

Whitelist allowed extensions
Check magic bytes (file signature)
Validate MIME type server-side
Limit file size (per file and total)
Rename to random UUID
Store OUTSIDE web root
Scan for malware
Use presigned URLs for cloud
Set non-executable permissions

    
    ---
    
    ## CLOUD UPLOAD PATTERN
    

WRONG:
Client Your server S3
(Server handles all bytes)

RIGHT:

1. Client requests presigned URL from server
1. Server returns URL (1 hour expiry)
1. Client uploads directly to S3
1. Client confirms to server
1. Server verifies file exists

    
    ---
    
    ## [24K GOLD: GIT + WEBSOCKET + CACHE + FILES]
    
    ### The patterns that prevent production disasters
    
    ---
    
    ## API VERSIONING TRIBAL KNOWLEDGE
    
    > **The patterns that prevent breaking your consumers**
    
    ## VERSIONING STRATEGIES
    
    | STRATEGY | WHERE | PROS | CONS |
    | ---------- | ------- | ------ | ------  |
    | URL Path | /api/v1/users | Easy, visible | URL fragmentation |
    | Header | X-API-Version: 1 | Clean URLs | Less discoverable |
    | Query Param | ?version=1 | Simple | Pollutes URL |
    | Accept Header | Accept: application/vnd.api+json;v=1 | RESTful | Complex |
    
    ## SEMVER FOR APIs
    

MAJOR.MINOR.PATCH

MAJOR: Breaking changes (removes field, changes type)
MINOR: Backward compatible additions (new field, new endpoint)
PATCH: Bug fixes, no API changes

    
    ---
    
    ## WHAT IS A BREAKING CHANGE
    
    | BREAKING | NON-BREAKING |
    | ------------- | -----------------  |
    | Remove field | Add optional field |
    | Change field type | Add new endpoint |
    | Rename field | Add optional parameter |
    | Remove endpoint | Deprecate (not remove) |
    | Change required params | Add default values |
    
    ## DEPRECATION STRATEGY
    

TIMELINE:

1. Announce deprecation (6+ months warning)
1. Add Sunset header: Sunset: Sat, 31 Dec 2025 23:59:59 GMT
1. Log usage of deprecated endpoints
1. Notify heavy users directly
1. Remove after sunset date

NEVER:

- Remove without warning
- Sunset in < 6 months for major APIs
- Ignore remaining traffic

    
    ---
    
    ## DATABASE MIGRATION TRIBAL KNOWLEDGE
    
    > **The patterns that change schemas safely**
    
    ---
    
    ## CONTRACT PATTERN
    
    FOR ZERO-DOWNTIME MIGRATIONS:
    
        EXPAND:
    
    1. Add new column (nullable)
    1. Deploy code that writes to BOTH old and new
    1. Backfill existing data
    
        CONTRACT:
    
    1. Deploy code that reads from new
    1. Stop writing to old
    1. Remove old column
    
    EXAMPLE: Rename column "name" "full_name"
    
    1. ALTER TABLE ADD full_name
    1. Deploy dual-write code
    1. UPDATE full_name = name WHERE full_name IS NULL
    1. Deploy read from full_name
    1. ALTER TABLE DROP name
    
    ## MIGRATION SAFETY RULES
    
    | SAFE | DANGEROUS |
    | --------- | --------------  |
    | Add nullable column | Add NOT NULL column |
    | Add index CONCURRENTLY | Add index (locks table) |
    | Add new table | Rename table |
    | Add default later | Add default on existing |
    | Backfill in batches | Backfill all at once |
    
    ## PATTERNS 10
    
    | ANTI-PATTERN | WHAT HAPPENS | PREVENTION |
    | -------------- | -------------- | ------------  |
    | Auto-migrate prod | Unexpected downtime | Manual review + staging |
    | No rollback plan | Stuck if fails | Test rollback first |
    | Big bang migration | Hours of downtime | Incremental steps |
    | Ignore data size | Lock timeout | Batch updates |
    
    ## SECRETS MANAGEMENT TRIBAL KNOWLEDGE
    
    > **The patterns that prevent credential leaks**
    
    ---
    
    ## ENV FILES ARE DANGEROUS
    

PROBLEMS:

- Plaintext on disk
- Easy to commit to Git
- No access control
- No audit log
- No rotation mechanism
- Visible in process env

USE .ENV FOR:

- Local development ONLY

NEVER USE FOR:

- Production secrets
- API keys
- Database passwords

    
    ---
    
    ## SECRETS MANAGEMENT OPTIONS
    
    | SOLUTION | BEST FOR | FEATURES |
    | ---------- | ---------- | ----------  |
    | HashiCorp Vault | Enterprise | Dynamic secrets, audit |
    | AWS Secrets Manager | AWS apps | Auto-rotation, IAM |
    | Google Secret Manager | GCP apps | Versioning, access control |
    | Azure Key Vault | Azure apps | HSM-backed |
    | Infisical | Self-hosted | Open source |
    
    ## SECRETS SECURITY CHECKLIST
    

Use secrets manager, not .env in prod
Never commit secrets to Git
Use pre-commit hooks to scan for secrets
Rotate secrets regularly
Use separate secrets per environment
Audit secret access
Encrypt in transit and at rest
Principle of least privilege
Don't log secrets
Use short-lived tokens where possible

    
    ---
    
    ## WHAT TO DO IF SECRET LEAKED
    

IMMEDIATELY:

1. Rotate the compromised secret NOW
1. Check audit logs for unauthorized access
1. Invalidate any tokens/sessions using that secret
1. Notify security team

THEN:

1. Scan Git history for other secrets
1. Review access controls
1. Conduct post-incident review
1. Update runbooks

    
    ---
    
    ## [24K GOLD: API + MIGRATION + SECRETS]
    
    ### The patterns that prevent catastrophic failures
    
    ---
    
    ## PAGINATION TRIBAL KNOWLEDGE
    
    > **The patterns that handle large datasets**
    
    ---
    
    ## PAGINATION STRATEGIES
    
    | STRATEGY | PROS | CONS | USE WHEN |
    | ---------- | ------ | ------ | ----------  |
    | Offset | Simple, jump to page | Slow at high offsets, data shift | Small datasets, admin |
    | Cursor | Fast, consistent | No page jump, complex | Large/dynamic data |
    | Keyset | Very fast, indexed | Forward only | Sorted by unique field |
    
    ## OFFSET VS CURSOR
    
    OFFSET (Page-based):
    SELECT *FROM posts ORDER BY id LIMIT 20 OFFSET 1000
    
    PROBLEM: DB scans 1000 rows to skip them
    SLOW: Gets slower as page increases
    DRIFT: If data changes, items duplicate or skip
    
    CURSOR (Seek-based):
    SELECT* FROM posts WHERE id > :lastId ORDER BY id LIMIT 20
    
    FAST: O(1) performance regardless of position
    STABLE: No duplicates even if data changes
    LIMITATION: Can't jump to arbitrary page
    
    ## CURSOR IMPLEMENTATION
    

// API Response
{
"data": [...],
"pagination": {
"cursor": "eyJpZCI6MTAwfQ==", // base64({"id":100})
"hasMore": true
  }
}

// Next Request
GET /api/posts?cursor=eyJpZCI6MTAwfQ==

// Server decodes cursor
const decoded = JSON.parse(atob(cursor)); // {id: 100}
// WHERE id > 100 ORDER BY id LIMIT 20

    
    ---
    
    ## INFINITE SCROLL TRUTHS
    

GOOD FOR:

- Social feeds
- Content browsing
- Mobile apps

BAD FOR:

- SEO (bots can't scroll)
- Finding specific item
- Bookmarking position

IMPLEMENTATION:

- Use cursor pagination backend
- IntersectionObserver to detect scroll
- Show "Load more" if JS disabled

    
    ---
    
    ## IMAGE OPTIMIZATION TRIBAL KNOWLEDGE
    
    > **The patterns that make pages load fast**
    
    ---
    
    ## FORMAT CHOICE
    
    | FORMAT | USE FOR | SIZE |
    | -------- | --------- | ------  |
    | WebP | Everything modern | 25-35% smaller than JPEG |
    | AVIF | Best compression | 50% smaller, newer |
    | JPEG | Photos, fallback | Universal support |
    | PNG | Transparency, lossless | Larger |
    | SVG | Icons, logos | Scalable, tiny |
    
    ## LAZY LOADING
    

<!-- GOOD: Native lazy loading -->
<img src="image.jpg" loading="lazy" alt="...">

<!-- BAD: Lazy load above-the-fold -->
<img src="hero.jpg" loading="lazy" alt="...">

<!-- GOOD: Prioritize hero image -->
<img src="hero.jpg" fetchpriority="high" alt="...">

    
    ---
    
    ## RESPONSIVE IMAGES
    
    <!-- srcset: Browser picks best size -->
        <img
          src="image-800.jpg"
          srcset="
    image-400.jpg 400w,
    image-800.jpg 800w,
    image-1200.jpg 1200w
          "
    sizes="(max-width: 600px) 400px, 800px"
          alt="..."
        >
    
    <!-- picture: Art direction -->
        <picture>
    <source srcset="image.webp" type="image/webp">
    <source srcset="image.avif" type="image/avif">
    <img src="image.jpg" alt="...">
        </picture>
    
    ## IMAGE OPTIMIZATION CHECKLIST
    

Use WebP/AVIF with JPEG fallback
Serve appropriate size for viewport
Lazy load below-the-fold images
Prioritize hero/LCP images
Add width/height to prevent CLS
Use CDN with image optimization
Compress without visible quality loss
Use blur placeholder for loading

    
    ---
    
    ## FORM VALIDATION TRIBAL KNOWLEDGE
    
    > **The patterns that validate user input**
    
    ---
    
    ## VALIDATION LAYERS
    

LAYER 1: HTML attributes (immediate)
<input required minlength="3" type="email">

LAYER 2: Client-side JS (UX)
Immediate feedback, prevent submit

LAYER 3: Server-side (SECURITY)
NEVER TRUST CLIENT
This is the ONLY real validation

    
    ---
    
    ## ZOD SHARED VALIDATION
    

// shared/schemas.ts
import { z } from 'zod';

export const UserSchema = z.object({
email: z.string().email(),
password: z.string().min(8),
name: z.string().min(2).max(50),
});

export type User = z.infer<typeof UserSchema>;

// Frontend: React Hook Form + Zod
const form = useForm<User>({
resolver: zodResolver(UserSchema)
});

// Backend: Same schema
const result = UserSchema.safeParse(req.body);
if (!result.success) {
return res.status(400).json({ errors: result.error });
}

    
    ---
    
    ## PATTERNS 11
    
    | ANTI-PATTERN | RISK | FIX |
    | -------------- | ------ | -----  |
    | Client-only validation | Bypass via curl/postman | Always validate server |
    | Different FE/BE schemas | Inconsistent errors | Share single schema |
    | Generic error messages | Poor UX | Field-specific errors |
    | Validate on blur only | Miss empty submits | Also validate on submit |
    | Trust content-type | Injection attacks | Validate actual content |
    
    ## DEPENDENCY INJECTION TRIBAL KNOWLEDGE
    
    > **The patterns that make testing possible**
    
    ---
    
    ## DI PATTERNS
    
    | PATTERN | HOW | USE WHEN |
    | --------- | ----- | ----------  |
    | Constructor | Pass deps to constructor | Classes |
    | Context | React Context API | React components |
    | Props | Pass as component props | Simple cases |
    | Container | InversifyJS, TSyringe | Large apps |
    
    ## REACT CONTEXT DI
    

// GOOD: Inject dependencies via context
const ServiceContext = createContext<ApiService>(null);

// Provider wraps app
<ServiceContext.Provider value={realApiService}>
<App />
</ServiceContext.Provider>

// Test with mock
<ServiceContext.Provider value={mockApiService}>
<Component />
</ServiceContext.Provider>

// Consumer
const api = useContext(ServiceContext);

    
    ---
    
    ## PATTERNS 12
    
    | ANTI-PATTERN | PROBLEM | FIX |
    | -------------- | --------- | -----  |
    | Direct imports | Can't mock | Inject via props/context |
    | Hardcoded `new` | Tight coupling | Factory or inject instance |
    | Global singletons | Testing nightmare | Scoped instances |
    | Over-engineering | Complexity | Only DI what you test |
    
    ## WHEN TO USE DI
    

USE DI FOR:

- API clients (mock in tests)
- Database connections
- External services
- Feature flags
- Logger instances

DON'T OVERCOMPLICATE:

- Small utils (just import)
- Pure functions (no side effects)
- Simple components

    
    ---
    
    ## [24K GOLD: PAGINATION + IMAGES + VALIDATION + DI]
    
    ### The patterns that make apps scalable and testable
    
    ---
    
    ## CODE REVIEW TRIBAL KNOWLEDGE
    
    > **The patterns that catch bugs before production**
    
    ## PR SIZE LAW
    

IDEAL: 200-400 lines
MAX: 500 lines

BIGGER =

- Slower reviews
- More missed bugs
- Harder to rollback

RULE: If PR > 500 lines, split it

    
    ---
    
    ## WHAT TO CHECK FIRST
    
    | PRIORITY | CHECK | WHY |
    | ---------- | ------- | -----  |
    | 1 | Security | Prevents breaches |
    | 2 | Correctness | Does it do what it should |
    | 3 | Edge cases | Handles null, empty, max |
    | 4 | Performance | N+1, memory, complexity |
    | 5 | Readability | Maintainability |
    
    ## SECURITY REVIEW CHECKLIST
    

Input validated/sanitized?
SQL parameterized (no string concat)?
No secrets in code?
Auth/authz on all endpoints?
Sensitive data not logged?
Dependencies up to date?
Error messages don't leak internals?

    
    ---
    
    ## PERFORMANCE REVIEW CHECKLIST
    

No N+1 queries?
Heavy operations not in loops?
Appropriate indexes used?
No unnecessary re-renders (React)?
Large data paginated?
Memoization where needed?
No blocking main thread?

    
    ---
    
    ## PATTERNS 13
    
    | ANTI-PATTERN | WHY BAD | FIX |
    | -------------- | --------- | -----  |
    | Rubber stamping | Bugs slip through | Check security first |
    | Nitpicking only | Miss important issues | Prioritize impact |
    | No context given | Reviewee confused | Explain why |
    | Too many rounds | Developer exhausted | Batch feedback |
    | Only negative | Demoralizing | Acknowledge good too |
    
    ## MEMORY LEAK TRIBAL KNOWLEDGE
    
    > **The patterns that prevent apps from crashing**
    
    ---
    
    ## REACT MEMORY LEAK CAUSES
    
    | CAUSE | WHY | FIX |
    | ------- | ----- | -----  |
    | Event listener not removed | Keeps ref to component | Remove in cleanup |
    | setInterval not cleared | Runs forever | clearInterval in cleanup |
    | Subscription not unsubscribed | Holds reference | Unsubscribe in cleanup |
    | API call completes after unmount | Updates dead component | AbortController |
    | Large closure captured | Holds old state | Break closure |
    
    ## CLEANUP PATTERN
    
    useEffect(() => {
    // Setup
    const controller = new AbortController();
    const timer = setInterval(() => {...}, 1000);
    window.addEventListener('resize', handler);
    
    // CLEANUP (runs on unmount)
    return () => {
    controller.abort(); // Cancel fetch
    clearInterval(timer); // Stop timer
    window.removeEventListener('resize', handler); // Remove listener
          };
    }, []);
    
    ## DETECTION TECHNIQUES
    

1. Chrome DevTools Memory tab
1. Take heap snapshot before/after
1. Compare: what's retained?

WARNING SIGNS:

- Memory grows without release
- "Detached DOM nodes" increasing
- Performance degrades over time

    
    ---
    
    ## COMMON MISTAKES
    

// BAD: Fetch without abort
useEffect(() => {
  fetch('/api').then(setData);
}, []); // No cleanup!

// GOOD: Fetch with abort
useEffect(() => {
const ctrl = new AbortController();
fetch('/api', { signal: ctrl.signal })
    .then(setData)
.catch(e => { if (e.name !== 'AbortError') throw e; });
return () => ctrl.abort();
}, []);

    
    ---
    
    ## DATETIME TRIBAL KNOWLEDGE
    
    > **The patterns that prevent "off-by-one day" bugs**
    
    ---
    
    ## THE GOLDEN RULE
    

STORE: UTC always
DISPLAY: Local timezone (on frontend)
NEVER: Mix them up

Backend: TZ=utc in environment
Database: TIMESTAMP WITH TIME ZONE (not without)
Frontend: new Date().toLocaleString()

    
    ---
    
    ## COMMON DATE BUGS
    
    | BUG | CAUSE | FIX |
    | ----- | ------- | -----  |
    | Off-by-one day | Date-only string parsed as UTC | Store full timestamp with Z |
    | Wrong timezone | Local vs UTC confusion | Always explicit Z in ISO |
    | DST issues | Clock changes | Use UTC, convert for display |
    | Comparison fails | Different timezones | Compare in UTC |
    
    ## SAFE DATE PATTERNS
    

// BAD: Ambiguous
new Date("2024-01-15")  // Is this UTC or local?

// GOOD: Explicit UTC
new Date("2024-01-15T00:00:00.000Z")

// GOOD: Store ISO strings
const isoString = new Date().toISOString();
// "2024-01-15T12:30:00.000Z"

// GOOD: Display local
new Date(isoString).toLocaleString()

    
    ---
    
    ## TIMESTAMP TRAPS
    

JavaScript: MILLISECONDS since epoch
Date.now() = 1705312200000

Unix/PHP: SECONDS since epoch
time() = 1705312200

CONVERSION:
JS Unix: Math.floor(Date.now() / 1000)
Unix JS: unixTimestamp * 1000

    
    ---
    
    ## DATABASE TIMEZONE RULE
    

-- GOOD: With timezone
CREATE TABLE events (
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BAD: Without timezone
CREATE TABLE events (
created_at TIMESTAMP  -- No TZ info!
);

    
    ---
    
    ## [24K GOLD: CODE REVIEW + MEMORY + DATETIME]
    
    ### The patterns that prevent midnight production fires
    
    ---
    
    ## REGEX TRIBAL KNOWLEDGE
    
    > **The patterns that prevent catastrophic backtracking**
    
    ---
    
    ## THE HIDDEN DDOS
    

ReDoS = Regular Expression Denial of Service

PROBLEM:
Bad regex + crafted input = exponential time
(a+)+b with "aaaaaaaaaaaaaaaaaa" = FREEZE

DANGER PATTERNS:
(a+)+ # Nested quantifiers
(.*)* # Nested star
| (a | aa)+  # Overlapping alternation |
.*foo.*bar # Greedy with multiple patterns

    
    ---
    
    ## SAFE REGEX PATTERNS
    
    | DANGEROUS | SAFE | WHY |
    |--------------|---------|-----|
    | `(a+)+`|`a+` | Remove nesting |
    | `(.*)*`|`.*` | Single quantifier |
    | `.*`|`[^x]*` | Specific char class |
    | `(a | aa)+`|`a+` | Non-overlapping |
    
    ---
    
    ## PREVENTION TECHNIQUES
    

1. ATOMIC GROUPS: (?>pattern)

Prevents backtracking once matched

1. POSSESSIVE QUANTIFIERS: ++, *+, ?+

Greedy but no backtracking

1. LAZY QUANTIFIERS: +?, *?, ??

Match minimum first

1. TIMEOUT

Set max execution time

1. USE RE2

No backtracking by design

    
    ---
    
    ## REGEX SECURITY CHECKLIST
    

Avoid nested quantifiers
Limit input length before regex
Set timeout for regex operations
Use specific char classes, not .*
Test with ReDoS checker tools
Consider RE2 for untrusted input

    
    ---
    
    ## RACE CONDITION TRIBAL KNOWLEDGE
    
    > **The patterns that prevent async chaos**
    
    ---
    
    ## RACE CONDITIONS IN JS
    

JS is single-threaded, BUT:

- async ops complete in any order
- Multiple fetches = race for state
- Click handlers while processing = conflict

SYMPTOMS:

- Intermittent bugs
- "Works sometimes"
- Stale data displaying
- Double submissions

    
    ---
    
    ## COMMON RACE PATTERNS
    
    | CASE | WHAT HAPPENS | FIX |
    | ------ | -------------- | -----  |
    | Fast typing outdated search | Slow response overwrites fast | AbortController |
    | Double click submit | Two orders created | Disable button after click |
    | Navigate away during fetch | State update on unmounted | Cancel on unmount |
    | Concurrent writes | Last write wins (wrong) | Optimistic locking |
    
    ## ABORTCONTROLLER PATTERN
    

// Cancel stale requests
function useSearch(query: string) {
useEffect(() => {
const controller = new AbortController();

fetch(`/api/search?q=${query}`, {
signal: controller.signal
    })
.then(res => res.json())
      .then(setResults)
.catch(e => {
if (e.name !== 'AbortError') throw e;
      });

return () => controller.abort();
}, [query]);
}

    
    ---
    
    ## MUTEX PATTERN (JS)
    

// Simple mutex with Promise
class Mutex {
private locked = false;
private queue: Array<() => void> = [];

async acquire(): Promise<() => void> {
return new Promise(resolve => {
const tryAcquire = () => {
if (!this.locked) {
this.locked = true;
resolve(() => {
this.locked = false;
        this.queue.shift()?.();
        });
} else {
        this.queue.push(tryAcquire);
        }
      };
      tryAcquire();
    });
  }
}

// Usage
const release = await mutex.acquire();
try {
await criticalOperation();
} finally {
  release();
}

    
    ---
    
    ## UNICODE TRIBAL KNOWLEDGE
    
    > **The patterns that prevent encoding nightmares**
    
    ---
    
    ## FUNDAMENTALS
    

ASCII: 1 byte per character (0-127)
UTF-8: 1-4 bytes per character

ALWAYS USE UTF-8:

- HTML: <meta charset="UTF-8">
- HTTP: Content-Type: text/html; charset=utf-8
- Database: CREATE DATABASE db CHARACTER SET utf8mb4
- Files: Save as UTF-8 without BOM

    
    ---
    
    ## COMMON ENCODING BUGS
    
    | BUG | SYMPTOM | CAUSE | FIX |
    | ----- | --------- | ------- | -----  |
    | Mojibake | instead of " | Encoding mismatch | Consistent UTF-8 |
    | Truncated text | becomes | Length by bytes not chars | Use string.length carefully |
    | DB corruption | ??? characters | Wrong DB charset | utf8mb4 in MySQL |
    | Form submission | Garbled text | Missing form accept-charset | Always UTF-8 |
    
    ## STRING LENGTH TRAPS
    

// DANGEROUS: Bytes vs characters
const emoji =
emoji.length; // 11 (JS counts code units!)
[...emoji].length; // 7 (still wrong for family emoji)

// SAFE: Use Intl.Segmenter for graphemes
const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
[...segmenter.segment(emoji)].length; // 1 (correct!)

    
    ---
    
    ## PATTERNS 14
    
    | ANTI-PATTERN | PROBLEM | FIX |
    | -------------- | --------- | -----  |
    | Hardcoded strings | Can't translate | Externalize to resource files |
    | String concatenation | Word order varies | Use template with placeholders |
    | Fixed-width UI | Text expands | Flexible layouts |
    | US date format | 01/02/03 = ? | Intl.DateTimeFormat |
    
    ## N CHECKLIST
    

[ ] Extract all strings to translation files
[ ] Use ICU message format for plurals
[ ] Never concatenate translated strings
[ ] Handle RTL layout (Arabic, Hebrew)
[ ] Format dates/numbers per locale
[ ] Test with long German strings
[ ] Use context for homonyms

    
    ---
    
    ## [24K GOLD: REGEX + RACE CONDITIONS + UNICODE]
    
    ### The patterns that handle edge cases globally
    
    ---
    
    ## SSR HYDRATION TRIBAL KNOWLEDGE
    
    > **The patterns that fix "server/client mismatch"**
    
    ---
    
    ## HYDRATION MISMATCH CAUSES
    
    | CAUSE | WHY | FIX |
    | ------- | ----- | -----  |
    | window/document access | Undefined on server | useEffect only |
    | Date.now() / Math.random() | Different each render | Stable values or useEffect |
    | localStorage access | Server has none | useEffect + state |
    | Invalid HTML nesting | p inside p, div inside p | Fix HTML structure |
    | Browser extensions | Modify DOM | Nothing (user issue) |
    
    ## SAFE SSR PATTERNS
    

// BAD: Crashes on server
const width = window.innerWidth;

// GOOD: Client-only with useEffect
const [width, setWidth] = useState(0);
useEffect(() => {
  setWidth(window.innerWidth);
}, []);

// GOOD: Dynamic import for client-only
const Chart = dynamic(() => import('./Chart'), { ssr: false });

    
    ---
    
    ## DEBUGGING HYDRATION ERRORS
    

1. View Page Source (Ctrl+U) see server HTML
1. Inspect Element see client DOM
1. DIFF them find mismatch

TOOLS:

- React DevTools
- Sentry Session Replay (shows HTML diff)
- React 19: throwOnHydrationMismatch flag

    
    ---
    
    ## COMMON INVALID HTML
    

<!-- BAD: These cause hydration errors -->
<p><div>...</div></p> <!-- div in p -->
<p><p>...</p></p> <!-- p in p -->
<a><a>...</a></a> <!-- a in a -->
<button><button>...</button></button>

<!-- GOOD: Valid nesting -->
<div><div>...</div></div>
<p><span>...</span></p>

    
    ---
    
    ## MONOREPO TRIBAL KNOWLEDGE
    
    > **The patterns that manage multiple packages**
    
    ---
    
    ## PACKAGE MANAGER CHOICE
    
    | MANAGER | BEST FOR | WHY |
    | --------- | ---------- | -----  |
    | pnpm | Large monorepos | Strict deps, disk efficient |
    | npm workspaces | Simple setups | Native, no install needed |
    | yarn | Legacy projects | Berry still maturing |
    
    ## PNPM ADVANTAGE
    

pnpm = STRICT + FAST + SMALL

STRICT:

- No phantom dependencies
- Can't import undeclared deps

FAST:

- Content-addressable storage
- Symlinks instead of copies

SMALL:

- One copy of each package version
- Saves 60%+ disk space

    
    ---
    
    ## TURBOREPO PATTERNS
    

WHAT: Build system for monorepos
WHY: Caching + parallel execution

KEY FEATURES:

- Local caching (skip unchanged)
- Remote caching (share with team)
- Parallel tasks
- Dependency-aware

SETUP:
pnpm add turbo -D -w
npx turbo run build --filter=./packages/*

    
    ---
    
    ## PATTERNS 15
    
    | ANTI-PATTERN | PROBLEM | FIX |
    | -------------- | --------- | -----  |
    | Different TS versions | Type conflicts | Shared tsconfig |
    | Circular dependencies | Build fails | Dependency graph |
    | No build caching | Slow CI | Turborepo/Nx |
    | Coupled releases | All or nothing | Independent versioning |
    
    ## SERVERLESS COLD START TRIBAL KNOWLEDGE
    
    > **The patterns that eliminate Lambda latency**
    
    ---
    
    ## COLD START CAUSES
    

WHAT HAPPENS:

1. AWS finds server
1. Downloads function code
1. Starts runtime
1. Runs init code
1. Runs handler

COLD = Steps 1-4 (~500ms-3s)
WARM = Step 5 only (~50ms)

    
    ---
    
    ## COLD START OPTIMIZATION
    
    | TECHNIQUE | IMPACT | EFFORT |
    | ----------- | -------- | --------  |
    | Smaller package | High | Low |
    | Increase memory | High | Low |
    | Provisioned concurrency | Very high | $$ |
    | Lightweight runtime | Medium | Medium |
    | Avoid VPC if possible | High | Low |
    
    ## PACKAGE SIZE RULES
    

GOAL: Under 10MB unzipped

TECHNIQUES:
Only import needed modules
Tree-shake unused code
Use Lambda Layers for shared deps
Minify/bundle with esbuild
Exclude dev dependencies

    
    ---
    
    ## COLD START NUMBERS
    

TYPICAL COLD START TIMES (2024):
Python: 100-300ms
Node.js: 100-300ms
Java: 500-2000ms (use SnapStart)
Go: 30-100ms (very fast)

WITH PROVISIONED CONCURRENCY:
~0ms (pre-warmed)

    
    ---
    
    ## GRAPHQL DATALOADER TRIBAL KNOWLEDGE
    
    > **The patterns that prevent N+1 queries**
    
    ---
    
    ## PROBLEM
    

PROBLEM:
Query 10 users 1 query
Each user fetch posts 10 queries
Total: 11 queries (should be 2)

SOLUTION: DataLoader

- Batches requests in single tick
- Caches within same request
- 1 query for users + 1 query for all posts

    
    ---
    
    ## DATALOADER PATTERN
    

const userLoader = new DataLoader(async (userIds) => {
// ONE query for ALL ids
const users = await db.users.findMany({
where: { id: { in: userIds } }
  });

// Return in same order as ids
return userIds.map(id => users.find(u => u.id === id));
});

// Usage in resolver
resolve: (parent) => userLoader.load(parent.userId)

    
    ---
    
    ## DATALOADER RULES
    

1. NEW INSTANCE PER REQUEST
- Prevents data leaking between users

1. RETURN IN ORDER
- batchFn([1,2,3]) [result1, result2, result3]

1. USE .load() NOT .loadMany()
- load() auto-batches in same tick

1. ONE LOADER PER ENTITY TYPE
- userLoader, postLoader, commentLoader

    
    ---
    
    ## GRAPHQL PERFORMANCE CHECKLIST
    

Use DataLoader for all relations
Create loaders per request
Index database on foreign keys
Monitor resolver timing
Set query complexity limits
Enable persisted queries
Cache at field level where safe

    
    ---
    
    ## [24K GOLD: SSR + MONOREPO + SERVERLESS + GRAPHQL]
    
    ### The patterns that scale modern applications
    
    ---
    
    ## CORS TRIBAL KNOWLEDGE
    
    > **The patterns that fix "blocked by CORS policy"**
    
    ---
    
    ## CORS PREFLIGHT BASICS
    

SIMPLE REQUESTS (no preflight):

- GET, HEAD, POST
- Only standard headers
- Content-Type: text/plain, form-data, x-www-form-urlencoded

COMPLEX REQUESTS (trigger preflight):

- PUT, DELETE, PATCH
- Custom headers (Authorization, X-Custom)
- Content-Type: application/json

Browser sends OPTIONS first

    
    ---
    
    ## REQUIRED CORS HEADERS
    

Access-Control-Allow-Origin: <<https://your-frontend.com>>
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true  # if using cookies
Access-Control-Max-Age: 86400  # cache preflight 24h

    
    ---
    
    ## COMMON CORS ERRORS
    
    | ERROR | CAUSE | FIX |
    | ------- | ------- | -----  |
    | Missing Allow-Origin | Server not sending header | Add CORS middleware |
    | Origin mismatch | http vs https | Exact origin match |
    | Multiple Allow-Origin | Header sent twice | Check all middleware |
    | Wildcard with credentials | *+ credentials = blocked | Specific origin |
    | OPTIONS not handled | Server returns 404/405 | Handle OPTIONS route |
    
    ## CORS DEBUGGING
    
    1. Network tab find OPTIONS request
    1. Check response headers
    1. Missing header = that's the problem
    
    TEST WITH CURL:
    curl -X OPTIONS <<<<<<https://api.example.com>>>>>> \
    -H "Origin: <<<<<<https://frontend.com">>>>>> \
    -H "Access-Control-Request-Method: POST" \
          -v
    
    ## TLS TRIBAL KNOWLEDGE
    
    > **The patterns that fix certificate errors**
    
    ---
    
    ## COMMON SSL ERRORS
    
    | ERROR | CAUSE | FIX |
    | ------- | ------- | -----  |
    | ERR_CERT_DATE_INVALID | Certificate expired | Renew cert |
    | ERR_CERT_COMMON_NAME | Domain mismatch | Get cert for correct domain |
    | ERR_CERT_AUTHORITY_INVALID | Self-signed or untrusted CA | Use trusted CA (Let's Encrypt) |
    | ERR_SSL_PROTOCOL_ERROR | TLS version mismatch | Use TLS 1.2+ |
    | ERR_CERT_REVOKED | Certificate revoked | Get new cert |
    
    ## CERTIFICATE CHECKLIST
    

Certificate not expired
Domain matches (incl. www)
Full chain installed (intermediate certs)
Strong cipher suites enabled
TLS 1.2 or 1.3 only
Auto-renewal configured
Monitor expiration (30 days warning)

    
    ---
    
    ## MIXED CONTENT
    

WHAT:
HTTPS page loading HTTP resources

TYPES:
Passive: images, videos (warning)
Active: scripts, CSS, iframes (BLOCKED)

FIX:

1. Update all URLs to https://
1. Use protocol-relative: //example.com/...
1. Add CSP: upgrade-insecure-requests

    
    ---
    
    ## SSL DEBUGGING
    

ONLINE TOOLS:

- SSL Labs (ssllabs.com/ssltest)
- Why No Padlock

COMMAND LINE:
openssl s_client -connect example.com:443

BROWSER:
Click padlock Certificate

    
    ---
    
    ## DNS TRIBAL KNOWLEDGE
    
    > **The patterns that fix propagation issues**
    
    ---
    
    ## DNS PROPAGATION TRUTHS
    

TYPICAL TIME: 5 minutes - 48 hours
AVERAGE: 2-4 hours

FACTORS:

- TTL of old record
- ISP caching
- Regional resolver caching

CANNOT SPEED UP:

- ISPs that ignore TTL
- Configured upstream resolvers

    
    ---
    
    ## TTL STRATEGY
    

BEFORE CHANGE:

1. Lower TTL to 300 (5 min) 24+ hours before
1. Wait for old TTL to expire

MAKE CHANGE:

1. Update DNS record
1. Propagates in ~5-10 min

AFTER CHANGE:

1. Raise TTL back to 3600+ (1h+)

    
    ---
    
    ## DNS DEBUGGING COMMANDS
    

## Check propagation globally

dig example.com +short

## Query specific DNS server

dig @8.8.8.8 example.com

## Trace full resolution path

dig +trace example.com

## Check all records

dig example.com ANY

## Flush local cache (Windows)

ipconfig /flushdns

## Flush local cache (macOS)

sudo killall -HUP mDNSResponder

    
    ---
    
    ## DNS CHECKLIST
    

TTL lowered before changes
All A/AAAA records updated
CNAME targets correct
MX records for email working
TXT records for verification
Tested from multiple locations
Cleared local DNS cache

    
    ---
    
    ## [24K GOLD: CORS + SSL/TLS + DNS]
    
    ### The patterns that fix network configuration nightmares
    
    ---
    
    ## ENVIRONMENT CONFIG TRIBAL KNOWLEDGE
    
    > **The patterns that prevent "works on my machine"**
    
    ---
    
    ## CONFIG
    

RULE: Store config in environment variables

WHY:

- Same code, different envs
- No secrets in code
- Easy to change without deploy

WHAT IS CONFIG:

- Database credentials
- API keys
- Feature flags
- Environment-specific URLs

    
    ---
    
    ## DOTENV FOR DEV ONLY
    

LOCAL DEV:
.env files (convenience)

PRODUCTION:
.env files (security risk)

WHY NOT IN PROD:

- Unencrypted on disk
- No access control
- No audit trail
- No secret rotation

    
    ---
    
    ## PRODUCTION SECRETS
    
    | SOLUTION | USE CASE |
    | ---------- | ----------  |
    | AWS Secrets Manager | AWS workloads |
    | HashiCorp Vault | Multi-cloud, on-prem |
    | Azure Key Vault | Azure workloads |
    | GCP Secret Manager | GCP workloads |
    | Infisical | Open source, self-host |
    
    ## ENV VALIDATION
    

// GOOD: Validate at startup with Zod
import { z } from 'zod';

const envSchema = z.object({
DATABASE_URL: z.string().url(),
API_KEY: z.string().min(10),
NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const env = envSchema.parse(process.env);
// Fails fast if missing/invalid

    
    ---
    
    ## RETRY PATTERN TRIBAL KNOWLEDGE
    
    > **The patterns that handle transient failures**
    
    ---
    
    ## WHEN TO RETRY
    

RETRY:

- 5xx server errors
- Timeouts
- Network errors (ECONNRESET)
- Rate limits (with backoff)

DON'T RETRY:

- 4xx client errors (except 429)
- Authentication failures
- Validation errors

    
    ---
    
    ## EXPONENTIAL BACKOFF
    

async function fetchWithRetry(url: string, maxRetries = 3) {
for (let attempt = 0; attempt < maxRetries; attempt++) {
try {
return await fetch(url);
} catch (error) {
if (attempt === maxRetries - 1) throw error;

// Exponential backoff with jitter
const delay = Math.min(1000 * 2 ** attempt, 30000);
const jitter = Math.random() * 1000;
await sleep(delay + jitter);
    }
  }
}

    
    ---
    
    ## CIRCUIT BREAKER
    

STATES:
CLOSED Normal operation, monitoring failures
OPEN Failing fast, not calling service
HALF-OPEN Testing if service recovered

TRANSITIONS:
CLOSED OPEN: Failure threshold exceeded
OPEN HALF-OPEN: Timeout elapsed
HALF-OPEN CLOSED: Test request succeeds
HALF-OPEN OPEN: Test request fails

    
    ---
    
    ## RESILIENCE CHECKLIST
    
    Retry with exponential backoff
    Add jitter to prevent thundering herd
    Set maximum retry attempts (3-5)
    Circuit breaker for persistent failures
    Timeout on all external calls
    Fallback/degraded response when down
    Monitor circuit breaker state
    
    ## BUNDLE OPTIMIZATION TRIBAL KNOWLEDGE
    
    > **The patterns that make apps load fast**
    
    ---
    
    ## TREE SHAKING REQUIREMENTS
    

MUST HAVE:

- ES6 modules (import/export)
- production mode
- sideEffects: false in package.json

BREAKS TREE SHAKING:

- CommonJS (require)
- Dynamic imports with variables
- Importing entire libraries

    
    ---
    
    ## IMPORT PATTERNS
    

// BAD: Imports entire library
import _ from 'lodash';
_.debounce(fn, 300);

// GOOD: Imports only what's needed
import debounce from 'lodash/debounce';
debounce(fn, 300);

// GOOD: Named imports (if tree-shakeable)
import { debounce } from 'lodash-es';

    
    ---
    
    ## BUNDLE ANALYSIS
    

TOOLS:

- webpack-bundle-analyzer
- source-map-explorer
- bundlephobia.com (check before install)

TARGETS:

- Initial bundle < 200KB (gzipped)
- Largest chunk < 500KB
- No duplicate dependencies

    
    ---
    
    ## OPTIMIZATION CHECKLIST
    

Use ES modules (import/export)
Set mode: 'production'
Configure sideEffects in package.json
Import specific functions, not whole libs
Code split routes (dynamic import)
Lazy load below-the-fold components
Analyze bundle regularly
Remove unused dependencies

    
    ---
    
    ## RESPONSIVE DESIGN TRIBAL KNOWLEDGE
    
    > **The patterns that work on every screen**
    
    ---
    
    ## FIRST APPROACH
    

/*GOOD: Mobile-first (min-width)*/
.container { padding: 1rem; }

@media (min-width: 768px) {
.container { padding: 2rem; }
}

@media (min-width: 1024px) {
.container { padding: 3rem; }
}

/*BAD: Desktop-first (max-width)*/
/*Leads to overrides and complexity*/

    
    ---
    
    ## COMMON BREAKPOINTS
    

/*Standard breakpoints (2024)*/
/*Mobile: default styles*/
/*Tablet:*/ @media (min-width: 768px) { }
/*Desktop:*/ @media (min-width: 1024px) { }
/*Large:*/ @media (min-width: 1280px) { }
/*XL:*/ @media (min-width: 1536px) { }

/*Bootstrap 5: 576, 768, 992, 1200, 1400*/
/*Tailwind: 640, 768, 1024, 1280, 1536*/

    
    ---
    
    ## DEBUGGING MEDIA QUERIES
    

/*Temporary debug helper*/
body::before {
content: 'Mobile';
position: fixed;
top: 0; left: 0;
background: red;
color: white;
z-index: 9999;
}

@media (min-width: 768px) {
body::before { content: 'Tablet'; background: blue; }
}

@media (min-width: 1024px) {
body::before { content: 'Desktop'; background: green; }
}

    
    ---
    
    ## PATTERNS 16
    
    | ANTI-PATTERN | PROBLEM | FIX |
    | -------------- | --------- | -----  |
    | Fixed widths | Breaks on small screens | Use max-width, % |
    | Mixing min/max-width | Confusion, overrides | Stick to one approach |
    | Too many breakpoints | Complex maintenance | Content-driven breaks |
    | Ignoring touch | Tiny tap targets | Min 44x44px touch areas |
    
    ## [24K GOLD: ENV CONFIG + RETRY + BUNDLE + RESPONSIVE]
    
    ### The patterns that make apps work everywhere
    
    ---
    
    ## LOGGING TRIBAL KNOWLEDGE
    
    > **The patterns that make debugging possible**
    
    ---
    
    ## LOG LEVELS
    
    FATAL: App cannot continue (shutdown)
    ERROR: Error occurred, operation failed
    WARN: Potential problem, recoverable
    INFO: Normal operations (default in prod)
    DEBUG: Detailed debugging (dev only)
    TRACE: Very detailed (never in prod)
    
    PRODUCTION: Only INFO and above
    DEVELOPMENT: DEBUG and above
    
    ## STRUCTURED LOGGING
    

// BAD: String concatenation
console.log('User ' + userId + ' created order ' + orderId);

// GOOD: Structured JSON
logger.info({
event: 'order_created',
userId: userId,
orderId: orderId,
amount: order.total
});

// Output: {"event":"order_created","userId":"123","orderId":"456",...}

    
    ---
    
    ## WHAT TO LOG
    
    DO LOG:
    Request received (method, path, requestId)
    Request completed (status, duration)
    Authentication events
    Business events (order, payment)
    Errors with stack traces
    External API calls
    
    DON'T LOG:
    Passwords, tokens, secrets
    Credit card numbers
    PII without masking
    Sensitive business data
    
    ## CORRELATION IDS
    

// Generate once per request
const requestId = crypto.randomUUID();

// Pass through all operations
logger.info({ requestId, event: 'request_start' });
await processOrder({ requestId });
logger.info({ requestId, event: 'request_end' });

// Find all logs for one request:
// grep "abc123" logs.json

    
    ---
    
    ## GIT REBASE TRIBAL KNOWLEDGE
    
    > **The patterns that keep history clean**
    
    ---
    
    ## REBASE VS MERGE 2
    
        MERGE:
    
    - Preserves full history
    - Creates merge commit
    - Safe for shared branches
    
        REBASE:
    
    - Linear history
    - Rewrites commits
    - NEVER on shared branches
    
    RULE: Rebase local, merge shared
    
    ## REBASE CONFLICT RESOLUTION
    

## Start rebase

git rebase main

## Conflict! Git pauses

## 1. Fix conflicts in files

## 2. Stage fixed files

git add <file>

## 3. Continue rebase

git rebase --continue

## Too messy? Abort

git rebase --abort

    
    ---
    
    ## CONFLICT PREVENTION 2
    
    Rebase frequently (daily)
    Keep branches short-lived
    Small, focused commits
    Communicate with team
    Pull before push
    Use feature flags for parallel work
    
    ## INTERACTIVE REBASE POWER
    

## Rebase last 5 commits interactively

git rebase -i HEAD~5

## Commands

## pick   = use commit

## squash = meld into previous

## edit   = stop to amend

## drop   = delete commit

## reword = change message

    
    ---
    
    ## REACT SERVER COMPONENTS TRIBAL KNOWLEDGE
    
    > **The patterns that reduce bundle size**
    
    ---
    
    ## RSC VS SSR
    

TRADITIONAL SSR:
Server renders HTML to client Hydrate ALL

REACT SERVER COMPONENTS:
Server renders HTML + RSC Payload Hydrate ONLY client parts

BENEFIT:

- Less JavaScript shipped
- No hydration for server parts
- Direct data access on server

    
    ---
    
    ## SERVER VS CLIENT
    

// Server Component (default in App Router)
// Can: fetch data, access DB, use secrets
// Cannot: useState, useEffect, onClick
async function ServerComponent() {
const data = await db.query(); // Direct DB access!
return <div>{data.title}</div>;
}

// Client Component
// Add 'use client' directive
'use client';
function ClientComponent() {
const [count, setCount] = useState(0);
return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

    
    ---
    
    ## STREAMING WITH SUSPENSE
    
    // Shell loads immediately
    // Slow data streams in later
    export default function Page() {
    return (
            <div>
    <Header />  {/*Immediate*/}
    <Suspense fallback={<Skeleton />}>
    <SlowDataComponent />  {/*Streamed later*/}
            </Suspense>
    <Footer />  {/*Immediate*/}
            </div>
          );
        }
    
    ## PATTERNS 17
    
    | ANTI-PATTERN | PROBLEM | FIX |
    | -------------- | --------- | -----  |
    | 'use client' everywhere | No RSC benefits | Default to server |
    | Huge client components | All code ships | Split client/server |
    | Passing functions to client | Can't serialize | Use server actions |
    | useState for server data | Unnecessary | Fetch on server |
    
    ## CONNECTION POOLING TRIBAL KNOWLEDGE
    
    > **The patterns that prevent connection exhaustion**
    
    ---
    
    ## WHY POOLING
    

WITHOUT POOLING:
Each request new DB connection
100 requests 100 connections
= DB MAX_CONNECTIONS exhausted
= "too many connections" errors

WITH POOLING:
Pool of 20 connections
100 requests reuse 20 connections
= DB stays healthy

    
    ---
    
    ## PGBOUNCER MODES
    
    | MODE | BEHAVIOR | USE WHEN |
    | ------ | ---------- | ----------  |
    | Session | Connection per client session | Need session features |
    | Transaction | Connection per transaction | High throughput, most apps |
    | Statement | Connection per statement | Very high throughput, no transactions |
    
    ## POOL SIZING
    

FORMULA (per server):
pool_size = (CPU cores * 2) + disks

EXAMPLE:
4 cores, 1 disk
pool_size = (4 * 2) + 1 = 9

CAUTION:
Too small = queuing, slow
Too large = DB overload, context switching

    
    ---
    
    ## POOLING CHECKLIST
    

Use connection pooler (PgBouncer, RDS Proxy)
Set appropriate pool size
Transaction mode for most apps
Close connections properly (try-finally)
Monitor waiting connections
Set connection timeout
Handle "no connections" gracefully

    
    ---
    
    ## [24K GOLD: LOGGING + GIT REBASE + RSC + CONNECTION POOLING]
    
    ### The patterns that scale teams and systems
    
    ---
    
    ## BROWSER STORAGE TRIBAL KNOWLEDGE
    
    > **The patterns that persist data client-side**
    
    ---
    
    ## STORAGE COMPARISON
    
    | STORAGE | LIMIT | PERSISTENCE | API | USE CASE |
    | --------- | ------- | ------------- | ----- | ----------  |
    | localStorage | 5-10MB | Permanent | Sync | User prefs, light cache |
    | sessionStorage | 5-10MB | Tab close | Sync | Form state, temp data |
    | IndexedDB | 100MB+ | Permanent | Async | Large data, offline apps |
    
    ## LOCALSTORAGE PATTERN
    

// GOOD: Wrapper with JSON handling
const storage = {
get: (key: string) => {
const item = localStorage.getItem(key);
return item ? JSON.parse(item) : null;
  },
set: (key: string, value: any) => {
localStorage.setItem(key, JSON.stringify(value));
  },
remove: (key: string) => localStorage.removeItem(key)
};

// Usage
storage.set('user', { id: 1, name: 'John' });
const user = storage.get('user');

    
    ---
    
    ## PATTERNS 18
    
    | ANTI-PATTERN | PROBLEM | FIX |
    | -------------- | --------- | -----  |
    | Sensitive data in localStorage | XSS can steal | Use httpOnly cookies |
    | No try-catch | Quota errors | Wrap in try-catch |
    | Storing too much | Sync API blocks UI | Use IndexedDB |
    | No expiry check | Stale data | Add timestamp |
    
    ## ACCESSIBILITY TRIBAL KNOWLEDGE
    
    > **The patterns that make apps usable by everyone**
    
    ---
    
    ## ARIA GOLDEN RULES
    

1. NO ARIA IS BETTER THAN BAD ARIA
- Wrong ARIA breaks assistive tech

1. USE SEMANTIC HTML FIRST
- <button> not <div role="button">
- <nav> not <div role="navigation">

1. ONLY ADD ARIA WHEN HTML ISN'T ENOUGH
- Custom widgets
- Dynamic content
- Complex interactions

    
    ---
    
    ## ESSENTIAL ARIA
    

<!-- Labeling -->
<button aria-label="Close
<input aria-labelledby="nameLabel" />

<!-- States -->
<button aria-pressed="true">Toggle</button>
<div aria-expanded="false">Accordion</div>

<!-- Live regions (dynamic content) -->
<div aria-live="polite">Status updated</div>
<div aria-live="assertive">Error occurred!</div>

    
    ---
    
    ## ACCESSIBILITY CHECKLIST
    

All images have alt text
Color contrast 4.5:1 minimum
Keyboard navigable (Tab, Enter, Escape)
Focus visible on all interactive elements
Form inputs have labels
Error messages are descriptive
Touch targets 44x44px minimum
Test with screen reader

    
    ---
    
    ## EDGE CACHING TRIBAL KNOWLEDGE
    
    > **The patterns that make sites fast globally**
    
    ---
    
    ## CONTROL HEADERS
    
    STATIC ASSETS (images, CSS, JS):
    Cache-Control: public, max-age=31536000, immutable
    
    DYNAMIC HTML:
    Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400
    
    NEVER CACHE:
    Cache-Control: no-store
    
        USER-SPECIFIC:
    Cache-Control: private, max-age=0
    
    ## CDN CACHING STRATEGY
    

TIER 1: Edge (closest to user)

- Static assets
- ISR pages
- API responses (short TTL)

TIER 2: Origin shield

- Reduces origin load
- Single point of cache

TIER 3: Origin server

- Generates dynamic content
- Only hit on cache miss

    
    ---
    
    ## PATTERNS 19
    
    | ANTI-PATTERN | PROBLEM | FIX |
    | -------------- | --------- | -----  |
    | Cache with cookies | Personalized content shared | Vary: Cookie |
    | No immutable | Asset re-validation | Add immutable |
    | Cache authenticated | Data leaks | Cache-Control: private |
    | Short TTL everywhere | Origin hammered | Longer TTL + revalidate |
    
    ## FEATURE FLAGS TRIBAL KNOWLEDGE
    
    > **The patterns that decouple deploy from release**
    
    ---
    
    ## FLAG TYPES
    

RELEASE FLAGS:

- Enable/disable new features
- Progressive rollout
- Remove after full launch

OPERATIONAL FLAGS:

- Kill switches
- Rate limiting
- Feature degradation
- Keep permanently

EXPERIMENT FLAGS:

- A/B testing
- User segmentation
- Data collection

    
    ---
    
    ## PROGRESSIVE ROLLOUT
    
    // Rollout strategy
    const rolloutConfig = {
    0: 'staff only',  // Day 1
    10: 'beta users',  // Day 3
    25: 'early adopters',   // Day 7
    50: 'half users',  // Day 10
    100: 'everyone',  // Day 14
        };
    
    // Usage
    if (featureFlags.isEnabled('new-checkout', user)) {
          renderNewCheckout();
    } else {
          renderLegacyCheckout();
        }
    
    ## FLAG BEST PRACTICES
    

Clean naming convention (enable-xyz, show-xyz)
Default to OFF for new flags
Document flag purpose and owner
Set expiry dates for temporary flags
Remove flags after full rollout
Kill switch for critical features
Audit flag changes

    
    ---
    
    ## [24K GOLD: BROWSER STORAGE + ACCESSIBILITY + EDGE CACHING + FEATURE FLAGS]
    
    ### The patterns that ship features safely
    
    ---
    
    ## ERROR BOUNDARY TRIBAL KNOWLEDGE
    
    > **The patterns that prevent blank screens**
    
    ---
    
    ## ERROR BOUNDARY BASICS
    

class ErrorBoundary extends React.Component {
state = { hasError: false };

static getDerivedStateFromError(error) {
return { hasError: true };
  }

componentDidCatch(error, errorInfo) {
// Log to error tracking (Sentry, etc.)
logErrorToService(error, errorInfo);
  }

render() {
if (this.state.hasError) {
return <FallbackUI />;
    }
return this.props.children;
  }
}

    
    ---
    
    ## WHAT ERROR BOUNDARIES CATCH
    

CATCHES:

- Render errors
- Lifecycle method errors
- Constructor errors in child tree

DOESN'T CATCH:

- Event handlers (use try-catch)
- Async code (use catch)
- Server-side rendering
- Errors in error boundary itself

    
    ---
    
    ## ERROR BOUNDARY PLACEMENT
    

LEVELS:

1. App level prevents white screen
1. Route level isolates page failures
1. Component level granular fallbacks

BEST PRACTICE:

- Multiple boundaries at different levels
- Route-level catches most issues
- Feature boundaries for critical widgets

    
    ---
    
    ## WEBSOCKET SCALING TRIBAL KNOWLEDGE
    
    > **The patterns that handle millions of connections**
    
    ---
    
    ## SCALING STRATEGY
    

VERTICAL (one server):
Max ~50K-100K connections
Limited by memory, CPU

HORIZONTAL (multiple servers):
connections (add servers)
Requires state coordination

PRODUCTION = Horizontal + Pub/Sub

    
    ---
    
    ## SUB PATTERN
    

CLIENT WebSocket Server 1 Message Broker (Redis)
CLIENT WebSocket Server 2 Message Broker (Redis)

HOW IT WORKS:

1. Client connects to any server
1. Server publishes messages to broker
1. All servers receive from broker
1. Each server sends to its clients

= Users on different servers can communicate

    
    ---
    
    ## WEBSOCKET CHECKLIST
    

Horizontal scaling with load balancer
Pub/Sub for cross-server messaging
Sticky sessions OR shared state
Heartbeat/ping mechanism
Reconnection logic with backoff
Connection limits per server
Graceful degradation when overloaded

    
    ---
    
    ## TYPESCRIPT STRICT MODE TRIBAL KNOWLEDGE
    
    > **The patterns that catch bugs at compile time**
    
    ## TSCONFIG STRICT FLAGS
    

{
"compilerOptions": {
"strict": true,  // Enable all strict checks
"noImplicitAny": true,   // No implicit any
"strictNullChecks": true, // null/undefined safety
"noUnusedLocals": true,  // Flag unused vars
"noUnusedParameters": true
  }
}

    
    ---
    
    ## TYPE SAFETY PATTERNS
    

// BAD: Using any
function process(data: any) {
return data.value; // No type checking!
}

// GOOD: Using unknown + type guard
function process(data: unknown) {
if (isValidData(data)) {
return data.value; // Type-safe!
  }
throw new Error('Invalid data');
}

// GOOD: Explicit types
interface User {
id: string;
name: string;
}
function getUser(id: string): Promise<User> { ... }

    
    ---
    
    ## PATTERNS 20
    
    | ANTI-PATTERN | PROBLEM | FIX |
    | -------------- | --------- | -----  |
    | any everywhere | No type safety | Use unknown + guards |
    | Type assertions (as) | Bypasses checks | Proper narrowing |
    | ! non-null assertion | Runtime errors | Handle null properly |
    | Ignoring compiler errors | Bugs in prod | Fix all errors |
    
    ## DATABASE INDEXING TRIBAL KNOWLEDGE
    
    > **The patterns that speed up queries**
    
    ---
    
    ## INDEX BASICS
    

INDEX = Sorted data structure for fast lookup

WITHOUT INDEX:
Full table scan O(n) SLOW

WITH INDEX:
B-tree lookup O(log n) FAST

TRADE-OFF:
Faster reads Slower writes (index updates)

    
    ---
    
    ## WHAT TO INDEX
    

INDEX THESE:

- Primary keys (automatic)
- Foreign keys (JOIN speed)
- WHERE clause columns
- ORDER BY columns
- Unique constraints

DON'T INDEX:

- Rarely queried columns
- Low cardinality (true/false)
- Frequently updated columns
- Tables with few rows

    
    ---
    
    ## COMPOSITE INDEX RULES
    

-- Composite index on (a, b, c)
CREATE INDEX idx_abc ON users (status, created_at, name);

-- Uses index (leftmost prefix)
WHERE status = 'active'
WHERE status = 'active' AND created_at > '2024-01-01'
WHERE status = 'active' AND created_at > '2024-01-01' AND name = 'John'

-- Doesn't use index (skips leftmost)
WHERE created_at > '2024-01-01'
WHERE name = 'John'

    
    ---
    
    ## INDEX DEBUGGING
    

-- Check if query uses index
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'x@y.com';

LOOK FOR:
"Index Scan" or "Index Only Scan"
"Seq Scan" on large tables

CHECK UNUSED INDEXES:
SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0;

    
    ---
    
    ## [24K GOLD: ERROR BOUNDARIES + WEBSOCKET SCALING + TYPESCRIPT + INDEXING]
    
    ### The patterns that prevent production disasters 2
    
    ---
    
    ## RATE LIMITING TRIBAL KNOWLEDGE 2
    
    > **The patterns that protect your API**
    
    ## ALGORITHM COMPARISON
    
    | ALGORITHM | BEST FOR | BURST HANDLING |
    | ----------- | ---------- | ----------------  |
    | Token Bucket | Most APIs | Allows bursts up to bucket size |
    | Sliding Window | Smooth limits | Even distribution, no edge bursts |
    | Fixed Window | Simple cases | Edge burst problem (2x at boundary) |
    | Leaky Bucket | Queue-based | Constant output rate |
    
    ## TOKEN BUCKET PATTERN
    

class TokenBucket {
tokens: number;
maxTokens: number;
refillRate: number; // tokens per second
lastRefill: number;

consume(): boolean {
    this.refill();
if (this.tokens >= 1) {
this.tokens -= 1;
return true; // Request allowed
    }
return false; // Rate limited
  }
}

// 100 requests/minute = 100 tokens, 1.67 refill/sec

    
    ---
    
    ## RATE LIMIT RESPONSE 2
    
    // Always return these headers
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', resetTime);
    
    if (rateLimited) {
          res.status(429);
    res.setHeader('Retry-After', secondsUntilReset);
    return res.json({ error: 'Too many requests' });
        }
    
    ## AUTH TOKEN TRIBAL KNOWLEDGE
    
    > **The patterns that secure user sessions**
    
    ---
    
    ## JWT VS SESSIONS
    
    | ASPECT | JWT | SESSIONS |
    | -------- | ----- | ----------  |
    | Storage | Client (stateless) | Server (stateful) |
    | Revocation | Hard (until expiry) | Easy (delete from DB) |
    | Scaling | Easy (no shared state) | Needs Redis/DB |
    | Size | Larger (payload) | Small (session ID) |
    
    ## JWT BEST PRACTICES
    

ACCESS TOKEN:

- Short-lived (15-60 minutes)
- Store in memory (not localStorage)
- Send via Authorization header
- Verify signature on EVERY request

REFRESH TOKEN:

- Long-lived (7-14 days)
- Store in HttpOnly + Secure cookie
- Rotate on every use
- Revocable server-side

    
    ---
    
    ## REFRESH TOKEN ROTATION
    

// When refreshing:
// 1. Verify old refresh token
// 2. Issue NEW access + refresh tokens
// 3. Invalidate old refresh token
// 4. Return both to client

// REUSE DETECTION:
// If invalidated token is used again:
// Someone stole it!
// Revoke ALL tokens for that user

    
    ---
    
    ## DATABASE TRANSACTION TRIBAL KNOWLEDGE
    
    > **The patterns that keep data consistent**
    
    ---
    
    ## ACID PROPERTIES
    

A - Atomicity:    All or nothing
C - Consistency:  Valid state to valid state
I - Isolation:    Concurrent txns don't interfere
D - Durability:   Committed = permanent

    
    ---
    
    ## ISOLATION LEVELS
    
    | LEVEL | DIRTY READ | NON-REPEATABLE | PHANTOM |
    | ------- | ------------ | ---------------- | ---------  |
    | Read Uncommitted | Yes | Yes | Yes |
    | Read Committed | No | Yes | Yes |
    | Repeatable Read | No | No | Yes |
    | Serializable | No | No | No |
    
    Default: Read Committed (Postgres)
    Repeatable Read (MySQL)
    
    Higher isolation = slower performance
    
    ## DEADLOCK PREVENTION
    

CAUSES:
TX1: Lock A, then lock B
TX2: Lock B, then lock A
  Deadlock!

PREVENT:

1. Lock in consistent order
1. Keep transactions short
1. Lock at lowest level needed
1. Set lock timeout
1. Implement retry with backoff

    
    ---
    
    ## E TESTING TRIBAL KNOWLEDGE
    
    > **The patterns that catch bugs before users do**
    
    ---
    
    ## PLAYWRIGHT VS CYPRESS
    
    | ASPECT | PLAYWRIGHT | CYPRESS |
    | -------- | ------------ | ---------  |
    | Architecture | CDP (outside browser) | Inside browser |
    | Multi-tab | Native support | No |
    | Languages | TS, JS, Python, .NET | JS only |
    | Parallelism | Native | Requires Cloud |
    | Speed | Faster | Fast |
    
    ## FLAKY TEST CAUSES
    

TIMING:

- Race conditions
- Async operations
- Animation delays

ENVIRONMENT:

- Network latency
- Server state
- External APIs

STATE:

- Test pollution
- Shared resources
- Unstable selectors

    
    ---
    
    ## FLAKY TEST FIXES
    

// BAD: Fixed wait
await page.waitForTimeout(3000);

// GOOD: Wait for condition
await page.waitForSelector('[data-test="result"]');

// GOOD: Wait for network idle
await page.waitForLoadState('networkidle');

// GOOD: Use data-testid
await page.click('[data-testid="submit-button"]');

    
    ---
    
    ## E TESTING CHECKLIST
    

Use stable selectors (data-testid)
Wait for conditions, not time
Mock external APIs
Isolate test state
Run in parallel (isolated)
Retry flaky tests (max 2)
Record videos on failure
Run in CI on every PR

    
    ---
    
    ## [24K GOLD: RATE LIMITING + AUTH TOKENS + DB TRANSACTIONS + E2E TESTING]
    
    ### The patterns that secure and verify production apps
    
    ---
    
    ## DOCKER DEBUGGING TRIBAL KNOWLEDGE
    
    > **The patterns that troubleshoot containers**
    
    ---
    
    ## ESSENTIAL DOCKER COMMANDS
    

## View running containers

docker ps

## View ALL containers (including stopped)

docker ps -a

## View logs

docker logs <container> --tail 100 -f

## Shell into running container

docker exec -it <container> bash  # or sh

## Container resource usage

docker stats

## Detailed container info

docker inspect <container>

    
    ---
    
    ## T START
    

CHECKLIST:
docker logs <container>
Check Dockerfile CMD/ENTRYPOINT
Verify image exists (docker images)
Check port conflicts
Check environment variables
Verify health check settings
Check disk space

    
    ---
    
    ## DOCKER LOGGING BEST PRACTICES
    

DO:

- Use JSON logging driver
- Centralize logs (ELK, Loki)
- Set log rotation (max-size, max-file)
- Include timestamps

DON'T:

- Write to files inside container
- Log to console without limits
- Log sensitive data

    
    ---
    
    ## REDIS CACHING TRIBAL KNOWLEDGE
    
    > **The patterns that make apps fast**
    
    ---
    
    ## CACHING PATTERNS 2
    
    | PATTERN | HOW | USE CASE |
    | --------- | ----- | ----------  |
    | Cache-Aside | App checks cache, fetches DB on miss | Most common |
    | Write-Through | Write to cache + DB together | Strong consistency |
    | Write-Behind | Write to cache, async to DB | High throughput |
    
    ## TTL GUIDELINES
    

VOLATILE (seconds):
Real-time data:  10-30s
Session data:  15-60min

STABLE (hours):
User profiles:  1-6h
Config data:  6-24h

STATIC (days):
Reference data:  1-7d
Rarely changes:  7-30d

RULE: Always set TTL, never infinite

    
    ---
    
    ## CACHE INVALIDATION
    

// On data update:
async function updateUser(id, data) {
// 1. Update database
await db.users.update(id, data);

// 2. Invalidate cache
await redis.del(`user:${id}`);

// DON'T update cache directly - leads to inconsistency
}

    
    ---
    
    ## THUNDERING HERD PREVENTION 2
    
    // BAD: All requests hit DB on cache miss
    // GOOD: Lock + single fetch + cache
    
    async function getWithLock(key, fetchFn) {
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);
    
    // Acquire lock
    const lock = await redis.set(`lock:${key}`, 1, 'NX', 'EX', 5);
    if (!lock) {
    await sleep(100);
    return getWithLock(key, fetchFn); // Retry
          }
    
    const data = await fetchFn();
    await redis.setex(key, 3600, JSON.stringify(data));
    await redis.del(`lock:${key}`);
    return data;
        }
    
    ## REST API DESIGN TRIBAL KNOWLEDGE
    
    > **The patterns that build clean APIs**
    
    ---
    
    ## VERSIONING STRATEGIES 2
    
    | METHOD | EXAMPLE | PROS | CONS |
    | -------- | --------- | ------ | ------  |
    | URL Path | `/v1/users` | Clear, cacheable | URL pollution |
    | Header | `X-API-Version: 1` | Clean URLs | Hidden |
    | Query | `/users?v=1` | Easy to add | Clutters params |
    
    RECOMMENDED: URL Path (/v1/)
    Most explicit, widely understood
    
    ## PAGINATION PATTERNS
    

// Offset-based (simple, common)
GET /users?page=2&limit=20

// Cursor-based (better for large datasets)
GET /users?cursor=abc123&limit=20

// Response should include:
{
data: [...],
meta: {
total: 1000,
page: 2,
limit: 20,
hasMore: true,
nextCursor: "def456"
  }
}

    
    ---
    
    ## HTTP STATUS CODES
    
    | CODE | MEANING | USE |
    |------|---------|-----|
    | 200 | OK | Success |
    | 201 | Created | POST success |
    | 204 | No Content | DELETE success |
    | 400 | Bad Request | Client error |
    | 401 | Unauthorized | Not logged in |
    | 403 | Forbidden | No permission |
    | 404 | Not Found | Resource missing |
    | 429 | Too Many | Rate limited |
    | 500 | Server Error | Our fault |
    | 503 | Unavailable | Overloaded |
    
    ---
    
    ## ERROR RESPONSE FORMAT
    

{
"error": {
"code": "VALIDATION_ERROR",
"message": "Invalid email format",
"details": [
{ "field": "email", "issue": "Must be valid email" }
    ],
"requestId": "abc-123",
"timestamp": "2024-01-01T00:00:00Z"
  }
}

    
    ---
    
    ## SECURITY HEADERS TRIBAL KNOWLEDGE
    
    > **The patterns that protect your app**
    
    ---
    
    ## ESSENTIAL SECURITY HEADERS
    

## HTTPS enforcement

Strict-Transport-Security: max-age=31536000; includeSubDomains

## Prevent clickjacking

Content-Security-Policy: frame-ancestors 'none'

## XSS protection

Content-Security-Policy: default-src 'self'; script-src 'self'

## Prevent MIME sniffing

X-Content-Type-Options: nosniff

## Control referrer info

Referrer-Policy: strict-origin-when-cross-origin

    
    ---
    
    ## CSP (CONTENT SECURITY POLICY)
    

BASIC:
Content-Security-Policy: default-src 'self'

STRICT:
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self';
connect-src 'self' <<https://api.example.com;>>
frame-ancestors 'none';

    
    ---
    
    ## CSRF PROTECTION
    

STRATEGIES:

1. CSRF tokens in forms
1. SameSite=Strict cookies
1. Double-submit cookie
1. Check Origin header

BEST PRACTICE:

- SameSite=Lax or Strict for all cookies
- CSRF token for state-changing requests
- Verify Origin/Referer header

    
    ---
    
    ## SECURITY CHECKLIST
    

HTTPS everywhere (HSTS enabled)
CSP header configured
SameSite cookies set
CSRF tokens for forms
No sensitive data in URLs
Input validation on server
Output encoding
Security headers tested

    
    ---
    
    ## [24K GOLD: DOCKER + REDIS + REST API + SECURITY HEADERS]
    
    ### The patterns that ship secure, fast, debuggable apps
    
    ---
    
    ## KUBERNETES DEBUGGING TRIBAL KNOWLEDGE
    
    > **The patterns that troubleshoot crashing pods**
    
    ---
    
    ## POD DEBUGGING COMMANDS
    

## View pod status

kubectl get pods

## Detailed pod info + events

kubectl describe pod <pod-name>

## View pod logs

kubectl logs <pod-name>

## Previous crash logs

kubectl logs -p <pod-name>

## Shell into running pod

kubectl exec -it <pod-name> -- sh

## Resource usage

kubectl top pods

    
    ---
    
    ## CRASHLOOPBACKOFF CAUSES
    

COMMON CAUSES:
Out of memory (OOMKilled)
Failed liveness probe
Image pull errors
Missing config/secrets
Application crash on startup
Port binding conflict

DIAGNOSIS:

1. kubectl describe pod <name>
1. Look at Events section
1. kubectl logs -p <name>
1. Check Last State + Reason

    
    ---
    
    ## S RESOURCE LIMITS
    
        resources:
          requests:
    memory: "128Mi"
    cpu: "250m"
          limits:
    memory: "512Mi"
    cpu: "1000m"
    
    ## requests = guaranteed
    
    ## limits = maximum allowed
    
    ## OOMKilled = exceeded memory limit
    

---

## GRAPHQL TRIBAL KNOWLEDGE

> **The patterns that make GraphQL fast and secure**

---

## PROBLEM 2

    PROBLEM:
Query 10 users 1 query
Each user fetch posts 10 queries
Total: 11 queries (should be 2)

SOLUTION: DataLoader

- Batches requests in single tick
- Caches within same request
- 1 query for users + 1 query for all posts

## DATALOADER PATTERN 2

const userLoader = new DataLoader(async (userIds) => {
// ONE query for ALL ids
const users = await db.users.findMany({
where: { id: { in: userIds } }
      });

// Return in same order as ids
return userIds.map(id => users.find(u => u.id === id));
    });

// Usage in resolver
resolve: (parent) => userLoader.load(parent.userId)

## GRAPHQL SECURITY

    PRODUCTION CHECKLIST:
    Disable introspection
    Query depth limiting (max 7-10)
    Query complexity/cost limiting
    Rate limiting per client
    Field-level authorization
    Validate all inputs
    Mask error details
    

---

## MONOREPO TRIBAL KNOWLEDGE 2

> **The patterns that manage multiple packages**

## TOOL COMPARISON

| TOOL | ROLE | KEY FEATURE |
| ------ | ------ | -------------  |
| pnpm | Package manager | Fast, saves disk space |
| Yarn | Package manager | Workspaces, good perf |
| Turborepo | Build system | Caching, parallelism |
| Nx | Build system | Affected commands |

## TURBOREPO SETUP

    monorepo/
    apps/
      web/
      api/
    packages/
      ui/
      shared/
    pnpm-workspace.yaml
    turbo.json
    package.json

## MONOREPO BEST PRACTICES

    DO:
    
    - Install deps where used
    - Shared deps in packages/
    - Use turbo for builds/tests
    - Pin dependency versions
    - Consistent naming
    
    DON'T:
    
    - Giant root package.json
    - Circular dependencies
    - Different versions of same dep
    - Skip CI caching
    

---

## GIT BRANCHING TRIBAL KNOWLEDGE

> **The patterns that manage code changes**

---

## BASED DEVELOPMENT

    main (always deployable)
    
    commit frequently
    short PRs (< 1 day)
    feature flags for WIP
    
    BEST FOR:
    
    - CI/CD teams
    - Fast iteration
    - Small to medium teams
    

---

## FEATURE BRANCHES

    main
    \ /
             feat/login
    
    PR + review
    
    BEST FOR:
    
    - Code review culture
    - Longer development cycles
    - Larger teams
    

---

## BRANCHING CHECKLIST

    Keep branches short-lived (< 1 week)
    Rebase frequently from main
    Small, focused PRs
    Delete merged branches
    Use conventional commits
    Protect main branch
    Require CI to pass
    Squash merge for clean history
    

---

## [24K GOLD: KUBERNETES + GRAPHQL + MONOREPO + GIT BRANCHING]

### The patterns that scale teams and systems 2

---

## CD PIPELINE TRIBAL KNOWLEDGE

> **The patterns that automate deployments**

---

## GITHUB ACTIONS CACHING

    
    - uses: actions/cache@v4
      with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    | restore-keys: |
    ${{ runner.os }}-node-
    
    ## KEY RULES
    
    ## - Include lockfile hash
    
    ## - Include runner.os
    
    ## - Use restore-keys for partial matches
    

---

## CD OPTIMIZATION

    SPEED TIPS:
    Cache dependencies (node_modules, .npm)
    Parallel jobs for independent tasks
    Skip unchanged (nx affected, turbo)
    Use self-hosted for heavy builds
    Docker layer caching
    
    CACHE LIMITS:
    
    - GitHub: 10GB per repo
    - Caches evicted after 7 days unused
    

---

## MONITORING TRIBAL KNOWLEDGE

> **The patterns that detect issues before users do**

---

## THREE PILLARS OF OBSERVABILITY

    METRICS:

- Numbers over time
- CPU, memory, request count
- Good for dashboards + alerts

    LOGS:

- Timestamped events
- Errors, requests, state changes
- Good for debugging

    TRACES:

- Request flow across services
- Latency breakdown
- Good for distributed systems

## SLO (SERVICE LEVEL OBJECTIVE)

    DEFINE:
    SLI = metric (e.g., 99.9% availability)
    SLO = target (e.g., 99.9% uptime)
    SLA = contract with consequences
    
    ERROR BUDGET:
    If SLO = 99.9%, error budget = 0.1%
    = 43 minutes/month of allowed downtime
    
    USE:
    Error budget exhausted focus on reliability
    Budget remaining ship features
    

---

## ALERTING CHECKLIST

    Alert on symptoms, not causes
    Include runbook link in alert
    Set severity levels (P1-P4)
    Avoid alert fatigue (too many alerts)
    PagerDuty/Opsgenie for escalation
    Alert on error budget burn rate
    

---

## SERVERLESS TRIBAL KNOWLEDGE

> **The patterns that optimize Lambda functions**

---

## COLD START CAUSES 2

WHAT HAPPENS:

1. AWS finds server
1. Downloads function code
1. Starts runtime
1. Runs init code
1. Runs handler

COLD = Steps 1-4 (~500ms-3s)
WARM = Step 5 only (~50ms)

## COLD START OPTIMIZATION 2

    DO:
Use lightweight runtimes (Node, Python)
Minimize package size
Initialize SDK outside handler
Use Provisioned Concurrency
Increase memory (more CPU)

    DON'T:
Use VPC unless required
Import entire AWS SDK
Heavy init code in handler

## LAMBDA BEST PRACTICES

    // BAD: Init inside handler
    export const handler = async () => {
    const db = await connectDB();
    // ...
    };
    
    // GOOD: Init outside handler (reused)
    const db = connectDB();
    export const handler = async () => {
    await db;
    // ...
    };
    

---

## DATABASE MIGRATION TRIBAL KNOWLEDGE 2

> **The patterns that change schemas safely**

## CONTRACT PATTERN 2

PHASE 1: EXPAND

- Add new column (nullable)
- App writes to both old + new
- Backfill new column
- Old app still works

PHASE 2: CONTRACT

- All apps use new column
- Drop old column
- App reads only new
- Zero downtime achieved

## PATTERNS 21

| ANTI-PATTERN | PROBLEM | FIX |
| -------------- | --------- | -----  |
| Add NOT NULL column | Breaks existing rows | Add nullable, then backfill |
| Rename column directly | App breaks | Expand-contract |
| Big bang migration | Downtime | Incremental changes |
| No rollback plan | Stuck on failure | Test rollback first |

## MIGRATION CHECKLIST

    BEFORE:
    Backup database
    Test migration locally
    Test rollback locally
    Review with DBA
    
    DURING:
    Run during low traffic
    Monitor performance
    Keep old schema working
    
    AFTER:
    Validate data integrity
    Remove deprecated code
    Document changes
    

---

## [24K GOLD: CI/CD + MONITORING + SERVERLESS + MIGRATIONS]

### The patterns that ship and maintain production systems

---

## CODE SPLITTING TRIBAL KNOWLEDGE

> **The patterns that make apps load fast**

---

## REACT LAZY LOADING

    // BAD: Import everything upfront
    import Dashboard from './Dashboard';
    
    // GOOD: Lazy load heavy components
    const Dashboard = React.lazy(() => import('./Dashboard'));
    
    // Wrap with Suspense
    <Suspense fallback={<Loading />}>
    <Dashboard />
    </Suspense>
    

---

## BASED SPLITTING

    // Split by route - most effective
    const Home = lazy(() => import('./pages/Home'));
    const Settings = lazy(() => import('./pages/Settings'));
    const Admin = lazy(() => import('./pages/Admin'));
    
    // Each route = separate bundle
    // User only downloads what they visit
    

---

## BUNDLE OPTIMIZATION CHECKLIST

    Analyze with webpack-bundle-analyzer
    Split routes with React.lazy
    Dynamic import heavy libraries
    Tree shake unused code
    Minify production bundles
    Use ES modules for tree shaking
    Lazy load below-the-fold content
    

---

## DRIVEN ARCHITECTURE TRIBAL KNOWLEDGE

> **The patterns that decouple systems**

---

## MESSAGE QUEUE COMPARISON

| TOOL | BEST FOR | ORDERING | THROUGHPUT |
| ------ | ---------- | ---------- | ------------  |
| Kafka | High volume, streaming | Per partition | Highest |
| RabbitMQ | Complex routing, tasks | Queue-level | High |
| SQS | AWS serverless | FIFO option | High |

## DRIVEN PATTERNS

    PUB/SUB:
    Producer Topic Multiple Consumers
    Use: Notifications, logging
    
    QUEUE:
    Producer Queue Single Consumer
    Use: Task processing
    
    EVENT SOURCING:
    Store all events, rebuild state
    Use: Audit, time travel
    

---

## MESSAGE QUEUE CHECKLIST

    Make events immutable
    Include correlation ID
    Handle duplicates (idempotency)
    Set up dead letter queue
    Monitor queue depth
    Retry with exponential backoff
    Schema versioning for events
    

---

## API GATEWAY TRIBAL KNOWLEDGE

> **The patterns that protect your APIs**

---

## GATEWAY RESPONSIBILITIES

    TRAFFIC:
    
    - Rate limiting
    - Load balancing
    - Request routing
    
    SECURITY:
    
    - Authentication
    - Authorization
    - SSL termination
    
    OBSERVABILITY:
    
    - Logging
    - Metrics
    - Tracing
    

---

## KONG VS AWS API GATEWAY

| FEATURE | KONG | AWS API GATEWAY |
| --------- | ------ | -----------------  |
| Deployment | Self-hosted/Cloud | AWS managed |
| Plugins | 100+ built-in | Lambda-based |
| Multi-cloud | Yes | AWS only |
| Cost | Self-managed | Pay per request |

## GATEWAY BEST PRACTICES

    Centralize auth at gateway
    Rate limit by API key/IP
    Use request/response validation
    Enable caching for reads
    Set timeouts for backends
    Log all requests for debugging
    Use WAF for additional security
    

---

## ORM OPTIMIZATION TRIBAL KNOWLEDGE

> **The patterns that make queries fast**

---

## QUERY PROBLEM

    PROBLEM:
    // 1 query for posts
    const posts = await db.posts.findMany();
    // N queries for each author
    posts.map(p => db.users.find(p.authorId));
    
    Total: 1 + N queries (SLOW!)
    
    SOLUTION: Eager load
    // 1 query with join
    const posts = await db.posts.findMany({
    include: { author: true }
      });
    
    Total: 1-2 queries (FAST!)
    

---

## PRISMA OPTIMIZATION

    // GOOD: Include related data
    await prisma.user.findMany({
    include: { posts: true }
    });
    
    // GOOD: Select only needed fields
    await prisma.user.findMany({
    select: { id: true, name: true }
    });
    
    // GOOD: Use relationLoadStrategy
    await prisma.user.findMany({
    include: { posts: true },
    relationLoadStrategy: 'join'
    });
    

---

## ORM CHECKLIST

    Use include/eager loading
    Select only needed fields
    Add indexes for WHERE/JOIN columns
    Profile queries (EXPLAIN ANALYZE)
    Use connection pooling
    Cache frequent reads
    Batch operations for writes
    

---

## [24K GOLD: CODE SPLITTING + EVENT-DRIVEN + API GATEWAY + ORM]

### The patterns that make apps fast and scalable

---

## REACT STATE MANAGEMENT TRIBAL KNOWLEDGE

> **The patterns that choose the right solution**

---

## STATE LIBRARY COMPARISON

| LIBRARY | SIZE | BEST FOR | STYLE |
| --------- | ------ | ---------- | -------  |
| Context | 0KB | Simple global state | Built-in |
| Zustand | ~4KB | Most apps | Centralized |
| Jotai | ~4KB | Fine-grained updates | Atomic |
| Redux Toolkit | ~15KB | Large/enterprise apps | Flux |

## WHEN TO USE WHAT 4

    CONTEXT:

- Theme, auth status
- Rarely changing global state
- Avoid for frequent updates

    ZUSTAND:

- Medium apps
- Simple API, minimal boilerplate
- Good performance

    JOTAI:

- Complex interdependent state
- Fine-grained reactivity
- TypeScript-heavy projects

    REDUX:

- Large teams
- Need time-travel debugging
- Complex middleware requirements

## STATE MANAGEMENT CHECKLIST

    Start with useState for local state
    Use Context for static globals
    Zustand/Jotai for shared dynamic state
    Avoid prop drilling (> 3 levels)
    Colocate state near usage
    Don't put everything in global state
    

---

## TESTING PYRAMID TRIBAL KNOWLEDGE

> **The patterns that catch bugs efficiently**

---

## THE TEST PYRAMID

    / E2E  \  Few, slow, expensive
           /----------\
    / Integration \  Some, medium speed
         /----------------\
    / Unit  \  Many, fast, cheap
    

---

## TEST TYPE COMPARISON

| TYPE | SPEED | COST | CATCHES |
| ------ | ------- | ------ | ---------  |
| Unit | Fast | Low | Logic bugs |
| Integration | Medium |  | API/DB issues |
| E2E | Slow |  | User flow bugs |

## MOCKING BEST PRACTICES

    DO:
    
    - Mock external APIs
    - Mock timers/dates
    - Isolate unit under test
    - Use dependency injection
    
    DON'T:
    
    - Mock everything
    - Mock implementation details
    - Over-mock in integration tests
    

---

## CORE WEB VITALS TRIBAL KNOWLEDGE

> **The patterns that make pages fast**

---

## METRICS

| METRIC | MEASURES | GOOD | NEEDS WORK |
|--------|----------|------|------------|
| LCP | Largest paint | < 2.5s | 2.5-4s |
| CLS | Visual stability | < 0.1 | 0.1-0.25 |
| INP | Interactivity | < 200ms | 200-500ms |

    INP replaced FID in March 2024!
    

---

## LCP OPTIMIZATION

    Optimize images (WebP, lazy load)
    Preload critical resources
    Use CDN
    Reduce TTFB
    Remove render-blocking JS/CSS
    

---

## CLS OPTIMIZATION

    Set width/height on images
    Reserve space for ads/embeds
    Use font-display: swap
    Avoid inserting content above fold
    Use CSS transform for animations
    

---

## INP OPTIMIZATION

    Break up long JS tasks
    Defer non-critical scripts
    Use Web Workers
    Reduce main thread work
    Lazy load below-fold content
    

---

## TYPESCRIPT GENERICS TRIBAL KNOWLEDGE

> **The patterns that make types flexible**

---

## BASIC GENERICS

    // Generic function
    function identity<T>(arg: T): T {
    return arg;
    }
    
    // Generic interface
    interface Response<T> {
    data: T;
    | error: string | null; |
    }
    

---

## CONSTRAINTS AND KEYOF

    // Constrain to objects with id
    function getId<T extends { id: string }>(obj: T): string {
    return obj.id;
    }
    
    // Keyof constraint
    function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
    }
    

---

## ADVANCED TYPE PATTERNS

    // Conditional types
    | type NonNullable<T> = T extends null | undefined ? never : T; |
    
    // infer keyword
    type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
    
    // Mapped types
    type Readonly<T> = { readonly [K in keyof T]: T[K] };
    

---

## TYPESCRIPT CHECKLIST

Use generics for reusable code
Constrain with extends when needed
Use conditional types for logic
Leverage utility types (Partial, Pick, Omit)
Prefer inference over explicit types
Use as const for literal types

## [24K GOLD: STATE MANAGEMENT + TESTING + WEB VITALS + TYPESCRIPT]

### The patterns that build quality React apps

---

## BUILD TOOLS TRIBAL KNOWLEDGE

> **The patterns that choose the right bundler**

---

## BUILD TOOL COMPARISON

| TOOL | SPEED | BEST FOR | LANGUAGE |
| ------ | ------- | ---------- | ----------  |
| Vite |  | Modern apps | JS + ESM |
| esbuild |  | Raw speed | Go |
| Webpack |  | Complex apps | JS |
| Turbopack |  | Next.js | Rust |

## WHEN TO USE WHAT 5

    VITE:

- New projects (React, Vue, Svelte)
- Fast dev server (ESM)
- Rollup for production

    WEBPACK:

- Legacy projects
- Need mature plugin ecosystem
- Complex customization

    TURBOPACK:

- Next.js 14+
- Maximum performance
- Enterprise scale

    ESBUILD:

- Pre-bundling (used by Vite)
- Extremely fast builds
- Limited plugins

## BACKEND FRAMEWORKS TRIBAL KNOWLEDGE

> **The patterns that choose the right Node.js framework**

---

## FRAMEWORK COMPARISON

| FRAMEWORK | PERF | STRUCTURE | TS SUPPORT |
| ----------- | ------ | ----------- | ------------  |
| Express |  | Minimal | Manual |
| Fastify |  | Plugin-based | Native |
| NestJS |  | Opinionated | Built-in |

## WHEN TO USE WHAT 6

    EXPRESS:

- Simple APIs
- Quick prototypes
- Huge middleware ecosystem

    FASTIFY:

- High performance needed
- Modern API design
- JSON schema validation

    NESTJS:

- Enterprise apps
- Microservices
- Large teams, TypeScript

## DATABASE COMPARISON TRIBAL KNOWLEDGE

> **The patterns that choose PostgreSQL vs MySQL**

---

## POSTGRES VS MYSQL

| ASPECT | POSTGRESQL | MYSQL |
| -------- | ------------ | -------  |
| Writes | Better |  |
| Reads |  | (simpler) |
| Complex queries |  |  |
| JSON support | JSONB (fast) | JSON |
| Concurrency | MVCC (excellent) | Good |

## WHEN TO USE WHAT 7

    POSTGRESQL:

- Complex queries
- Write-heavy workloads
- JSONB needed
- Data integrity critical

    MYSQL:

- Read-heavy apps
- Simpler queries
- Easier setup
- Wide hosting support

## CSS ARCHITECTURE TRIBAL KNOWLEDGE

> **The patterns that organize styles**

---

## CSS APPROACH COMPARISON

| APPROACH | SCOPING | PERF | DX |
| ---------- | --------- | ------ | -----  |
| BEM | Manual naming |  | Verbose |
| CSS Modules | Build-time |  | Good |
| Tailwind | Class-based |  | Fast dev |
| Styled Comp. | Runtime |  | Dynamic |

## WHEN TO USE WHAT 8

    BEM:

- Traditional CSS
- No build step wanted
- Large teams, conventions

CSS MODULES:

- Scoped styles
- Standard CSS syntax
- Build-time processing

    TAILWIND:

- Rapid prototyping
- Utility-first
- Design system enforcement

STYLED COMPONENTS:

- Dynamic theming
- Component-scoped
- Note: In maintenance mode (2024)

## CSS ARCHITECTURE CHECKLIST

    Choose one approach per project
    Use CSS variables for theming
    Mobile-first media queries
    Avoid !important
    PurgeCSS for Tailwind production
    Consider bundle size impact
    

---

## [24K GOLD: BUILD TOOLS + BACKEND FRAMEWORKS + DATABASES + CSS]

### The patterns that choose the right stack

---

## AUTHENTICATION TRIBAL KNOWLEDGE 2

> **The patterns that secure user identity**

## BEST PRACTICES

    MANDATORY:
    Use Authorization Code + PKCE
    Short-lived access tokens (15-30 min)
    Refresh token rotation
    HTTPS everywhere
    
    DEPRECATED (AVOID):
    Implicit Flow
    Password Grant (ROPC)
    Tokens in URL query params
    

---

## TOKEN STORAGE

| STORAGE | SECURITY | USE CASE |
| --------- | ---------- | ----------  |
| HttpOnly Cookie | Best | Refresh tokens |
| Memory (JS) | Good | Access tokens |
| localStorage | Weak (XSS) | Avoid for tokens |
| sessionStorage | Weak (XSS) | Avoid for tokens |

## COOKIE SECURITY FLAGS

    Set-Cookie: session=abc123;
    HttpOnly; // No JS access (XSS protection)
    Secure; // HTTPS only
    SameSite=Lax; // CSRF protection
      Path=/;
      Max-Age=3600;
    

---

## REACT HOOKS OPTIMIZATION TRIBAL KNOWLEDGE

> **The patterns that prevent re-renders**

---

## HOOK COMPARISON

| HOOK | MEMOIZES | USE FOR |
| ------ | ---------- | ---------  |
| useCallback | Functions | Passing to memo'd children |
| useMemo | Values | Expensive calculations |
| useRef | Refs | DOM access, timers |

## USECALLBACK PATTERN

    // BAD: New function every render
    <Child onClick={() => handleClick(id)} />
    
    // GOOD: Stable function reference
    const handleClick = useCallback(() => {
      doSomething(id);
    }, [id]);
    
    <Child onClick={handleClick} />
    

---

## USEMEMO PATTERN

    // BAD: Recalculates every render
    const sorted = items.sort((a, b) => a - b);
    
    // GOOD: Only recalculates when items change
    const sorted = useMemo(
    () => items.sort((a, b) => a - b),
      [items]
    );
    

---

## MEMOIZATION CHECKLIST

    USE WHEN:
    Passing functions to React.memo children
    Expensive computations
    Dependency in useEffect
    
    DON'T USE:
    Simple calculations
    Primitive values
    Every function (adds overhead)
    

---

## JS RSC TRIBAL KNOWLEDGE

> **The patterns that leverage Server Components**

---

## SERVER VS CLIENT COMPONENTS

| USE SERVER FOR | USE CLIENT FOR |
|----------------|----------------|
| Data fetching | Event handlers |
| DB access | useState/useEffect |
| Sensitive data | Browser APIs |
| Heavy deps | Interactivity |

    // Default = Server Component
    // Add 'use client' for Client Component
    

---

## RSC DATA FETCHING

    // GOOD: Fetch in Server Component
    async function Page() {
    const data = await db.posts.findMany();
    return <PostList posts={data} />;
    }
    
    // BAD: useEffect in Client Component
    // Creates waterfall, slower
    

---

## RSC COMPOSITION RULES

    Server can render Client Component
    Server can pass data to Client (serializable)
    Client cannot import Server Component
    Server can pass Server Component as prop to Client
    

---

## STREAMING WITH SUSPENSE 2

// loading.js - Route-level loading
export default function Loading() {
return <Skeleton />;
    }

// Suspense - Component-level loading
<Suspense fallback={<Skeleton />}>
<SlowComponent />
    </Suspense>

## ERROR HANDLING TRIBAL KNOWLEDGE 2

> **The patterns that catch errors gracefully**

## ERROR BOUNDARY PATTERN

    class ErrorBoundary extends React.Component {
    state = { hasError: false };
    
    static getDerivedStateFromError() {
    return { hasError: true };
      }
    
    componentDidCatch(error, info) {
    logError(error, info);
      }
    
    render() {
    if (this.state.hasError) {
    return <FallbackUI />;
        }
    return this.props.children;
      }
    }
    

---

## T CATCH

    Event handlers (use try-catch)
    Async code (use .catch or try-catch)
    Server-side rendering
    Errors in the boundary itself
    

---

## PRODUCTION LOGGING CHECKLIST

    LOG:
    Error type + message
    Stack trace
      Timestamp
    User context
    Correlation ID
    
    DON'T LOG:
      Passwords
    API keys
    PII (unless required)
    Full request bodies
    

---

## LOG LEVELS 2

| LEVEL | USE FOR |
| ------- | ---------  |
| DEBUG | Development only |
| INFO | Normal operations |
| WARN | Potential issues |
| ERROR | Failures (investigate) |
| FATAL | App crash (page someone) |

## [24K GOLD: AUTH + REACT HOOKS + NEXT.JS RSC + ERROR HANDLING]

### The patterns that build secure, fast, resilient apps

---

## AWAIT TRIBAL KNOWLEDGE

> **The patterns that handle asynchronous code**

---

## PROMISE STATES

    PENDING In progress
    FULFILLED Success (.then)
    REJECTED Failed (.catch)
    

---

## AWAIT PATTERNS

    // GOOD: Try-catch for errors
    async function fetchData() {
    try {
    const res = await fetch('/api/data');
    return await res.json();
    } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
      }
    }
    
    // GOOD: Parallel execution
    const [users, posts] = await Promise.all([
      fetchUsers(),
      fetchPosts()
    ]);
    

---

## ASYNC PITFALLS

    // BAD: Sequential when parallel is possible
    for (const id of ids) {
    await fetchItem(id); // SLOW!
    }
    
    // GOOD: Parallel fetch
    const items = await Promise.all(
    ids.map(id => fetchItem(id))
    );
    

---

## ALL VS ALLSETTLED

| METHOD | BEHAVIOR |
|--------|----------|
| Promise.all | Fails fast (one reject = all fail) |
| Promise.allSettled | Waits for all, returns results |

    Use allSettled when partial failure is OK
    

---

## API VERSIONING TRIBAL KNOWLEDGE 2

> **The patterns that evolve APIs safely**

## VERSIONING METHODS

| METHOD | EXAMPLE | PROS |
|--------|---------|------|
| URL Path | /api/v1/users | Simple, visible |
| Header | Accept-Version: v1 | Clean URLs |
| Query | ?version=1 | Easy to test |

    URL Path is most common and recommended
    

---

## BACKWARD COMPATIBILITY RULES

    SAFE CHANGES (non-breaking):
    Add new optional fields
    Add new endpoints
    Add nullable response fields
    
    BREAKING CHANGES (avoid):
    Remove fields
    Rename fields
    Change field types
    Change endpoint URLs
    

---

## DEPRECATION CHECKLIST

    Announce 6-12 months in advance
    Document migration path
    Provide upgrade guides
    Monitor old version usage
    Return deprecation headers
    Set clear end-of-life date
    

---

## INFRASTRUCTURE AS CODE TRIBAL KNOWLEDGE

> **The patterns that automate cloud resources**

---

## TOOL COMPARISON 2

| TOOL | LANGUAGE | BEST FOR |
| ------ | ---------- | ----------  |
| Terraform | HCL (declarative) | Multi-cloud |
| Pulumi | Real languages | Developers |
| AWS CDK | TypeScript/Python | AWS-only |

## C BEST PRACTICES

    Store in version control (Git)
    Use remote state (S3, Pulumi Cloud)
    Enable state locking
    Modularize infrastructure
    Use variables, not hardcoded values
    Never commit secrets
    Test in CI/CD pipeline
    Implement drift detection
    

---

## TERRAFORM PATTERNS

    
    ## GOOD: Use modules
    
    module "vpc" {
    source = "./modules/vpc"
    cidr = var.vpc_cidr
        }
    
    ## GOOD: Remote state
    
    terraform {
    backend "s3" {
    bucket = "tf-state-bucket"
    key = "prod/terraform.tfstate"
    region = "us-east-1"
      }
    }
    

---

## GIT CONFLICT RESOLUTION TRIBAL KNOWLEDGE

> **The patterns that resolve merge conflicts**

---

## CONFLICT PREVENTION 3

Small, frequent commits
Pull main often into feature branch
Communicate about shared files
Consistent code formatting

## REBASE VS MERGE 3

| APPROACH | HISTORY | USE WHEN |
| ---------- | --------- | ----------  |
| Merge | Preserves all | Shared branches |
| Rebase | Linear, clean | Private branches |

Never rebase shared branches!

## CONFLICT RESOLUTION COMMANDS

    
    ## Choose your version
    
    git checkout --ours file.js
    
    ## Choose their version
    
    git checkout --theirs file.js
    
    ## Use visual merge tool
    
    git mergetool
    
    ## Auto-resolve recurring conflicts
    
    git config rerere.enabled true
    

---

## [24K GOLD: ASYNC + API VERSIONING + IaC + GIT CONFLICTS]

### The patterns that handle complexity at scale

---

## WEB SECURITY TRIBAL KNOWLEDGE

> **The patterns that prevent attacks**

---

## XSS PREVENTION

    MUST DO:
    Sanitize all user input
    Encode output (HTML entities)
    Use Content Security Policy
    Set HttpOnly on cookies
    Avoid innerHTML
    
    CSP HEADER:
      Content-Security-Policy:
    default-src 'self';
    script-src 'self';
    

---

## CSRF PREVENTION

    MUST DO:
    Use anti-CSRF tokens
    Set SameSite=Lax on cookies
    Verify Origin/Referer headers
    Re-authenticate for sensitive actions
    

---

## SQL INJECTION PREVENTION

// BAD: String concatenation
const query =`SELECT *FROM users WHERE id = '${userId}'`;

// GOOD: Parameterized query
const query = 'SELECT* FROM users WHERE id = $1';
db.query(query, [userId]);

## SECURITY HEADERS CHECKLIST

    Content-Security-Policy
    X-Content-Type-Options: nosniff
    X-Frame-Options: DENY
    Strict-Transport-Security (HSTS)
    X-XSS-Protection: 1; mode=block
    

---

## REACT PROFILING TRIBAL KNOWLEDGE

> **The patterns that find performance issues**

---

## CHROME DEVTOOLS PERFORMANCE

    
    1. Open DevTools Performance tab
    1. Click Record
    1. Perform actions
    1. Stop recording
    1. Analyze flame chart
    
    LOOK FOR:
    
    - Long tasks (> 50ms)
    - Layout thrashing
    - Excessive renders
    

---

## REACT DEVTOOLS PROFILER

    
    1. Install React DevTools extension
    1. Open Profiler tab
    1. Click Record
    1. Interact with app
    1. Analyze component renders
    
    IDENTIFY:
    
    - Unnecessary re-renders
    - Slow components
    - Missing memoization
    

---

## PERFORMANCE OPTIMIZATION CHECKLIST

    Memoize with React.memo
    Use useCallback for functions
    Use useMemo for expensive calculations
    Virtualize long lists
    Lazy load components
    Code split routes
    Optimize images
    Avoid inline objects/functions
    

---

## MICROSERVICES COMMUNICATION TRIBAL KNOWLEDGE

> **The patterns that connect services**

---

## GRPC VS REST

| ASPECT | gRPC | REST |
| -------- | ------ | ------  |
| Protocol | HTTP/2 | HTTP/1.1 |
| Format | Protobuf (binary) | JSON (text) |
| Speed |  |  |
| Streaming | Bidirectional |  |
| Best for | Internal services | Public APIs |

## GRPC PATTERNS

    UNARY: Request Response (standard)
    SERVER: Request Stream of responses
    CLIENT: Stream of requests Response
    BIDI: Stream Stream (real-time)
    

---

## SERVICE MESH BENEFITS

    TRAFFIC:
    
    - Load balancing
    - Retries
    - Circuit breaking
    
    SECURITY:
    
    - Mutual TLS (mTLS)
    - Access policies
    
    OBSERVABILITY:
    
    - Distributed tracing
    - Metrics
    
    TOOLS: Istio, Linkerd, Kuma
    

---

## DATABASE SCALING TRIBAL KNOWLEDGE

> **The patterns that handle massive data**

---

## SHARDING VS REPLICATION

| STRATEGY | PURPOSE | SCALES |
|----------|---------|--------|
| Sharding | Split data | Writes |
| Replication | Copy data | Reads |

    Often used together for max scale
    

---

## SHARDING STRATEGIES

    RANGE-BASED:
    Users 1-1000 Shard A
    Users 1001-2000 Shard B
    Pro: Range queries easy
    Con: Hot spots if uneven
    
    HASH-BASED:
    hash(user_id) % N Shard
    Pro: Even distribution
    Con: Range queries hard
    

---

## REPLICATION STRATEGIES

    MASTER-SLAVE:
    Master Writes
    Slaves Reads
    Pro: Simple
    Con: Write bottleneck
    
    MASTER-MASTER:
    Both Reads + Writes
    Pro: High availability
    Con: Conflict resolution
    

---

## SCALING DECISION TREE

    Read bottleneck?
    Add read replicas
    
    Write bottleneck?
    Implement sharding
    
    Need high availability?
    Multiple replicas + failover
    
    Single query too slow?
    Add indexes, optimize query
    

---

## [24K GOLD: WEB SECURITY + REACT PROFILING + MICROSERVICES + DATABASE SCALING]

### The patterns that build secure, observable, scalable systems

---

## BROWSER DEVTOOLS TRIBAL KNOWLEDGE

> **The patterns that debug faster**

---

## NETWORK TAB ESSENTIALS

    INSPECT:
    
    - Status codes (200, 404, 500)
    - Response time
    - Payload size
    - Headers
    
    FILTER BY:
    
    - XHR (API calls)
    - JS/CSS (scripts)
    - Images
    - WebSocket
    

---

## DEBUGGING TECHNIQUES

    THROTTLING:
    Simulate slow connections (3G, offline)
    Test loading states
    
    BLOCK REQUESTS:
    Simulate CDN failure
    Test error states
    
    TIMING BREAKDOWN:
    
    - DNS Lookup
    - SSL Handshake
    - TTFB (Time to First Byte)
    - Content Download
    

---

## DEVTOOLS SHORTCUTS

    Copy as fetch:    Right-click request
    Copy as cURL:  Right-click request
    Preserve log:  Keep across navigates
    Disable cache:    Force fresh loads
    

---

## PWA TRIBAL KNOWLEDGE

> **The patterns that work offline**

---

## SERVICE WORKER LIFECYCLE

    INSTALL WAITING ACTIVATE FETCH
    
    1. Register service worker
    1. Cache critical assets (install)
    1. Clean old caches (activate)
    1. Intercept requests (fetch)
    

---

## CACHING STRATEGIES

| STRATEGY | DESCRIPTION | USE FOR |
| ---------- | ------------- | ---------  |
| Cache First | Cache Network | Static assets |
| Network First | Network Cache | Dynamic data |
| Stale While Revalidate | Cache + Background fetch | Balanced |

## PWA CHECKLIST

    Service worker registered
    Manifest.json configured
    App icons (192, 512)
    HTTPS required
    Offline fallback page
    Cache versioning
    Background sync
    Add to home screen
    

---

## FRONTEND ARCHITECTURE TRIBAL KNOWLEDGE

> **The patterns that scale UI**

---

## ARCHITECTURE COMPARISON

| PATTERN | SCALE | TEAMS | COMPLEXITY |
| --------- | ------- | ------- | ------------  |
| Monolith | Small | 1 | Low |
| Modular | Medium | 1-3 | Medium |
| Micro-frontend | Large | Many | High |

## FRONTEND PATTERNS

    MODULE FEDERATION:
    
    - Webpack 5 feature
    - Share deps at runtime
    - Deploy independently
    
    COMPOSITION:
    
    - Build-time (npm packages)
    - Run-time (iframes, web components)
    - Edge-side (SSR composition)
    

---

## COMPONENT DESIGN PATTERNS

    ATOMIC DESIGN:
    Atoms Molecules Organisms Templates Pages
    
    COMPOUND COMPONENTS:
    Parent passes context to children
    Flexible, composable APIs
    
    CONTAINER/PRESENTER:
    Container: Logic, state
    Presenter: Pure UI, props only
    

---

## BACKEND PATTERNS TRIBAL KNOWLEDGE

> **The patterns that organize server code**

---

## LAYERED ARCHITECTURE

    CONTROLLER LAYER:
    Handle HTTP requests
    Validate input
    Call service layer
    
    SERVICE LAYER:
    Business logic
    Orchestrate repositories
    Apply rules
    
    REPOSITORY LAYER:
    Data access
    CRUD operations
    Abstract database
    

---

## REPOSITORY PATTERN

    // Abstract data access from business logic
    interface UserRepository {
    findById(id: string): Promise<User>;
    save(user: User): Promise<void>;
    delete(id: string): Promise<void>;
    }
    
    // Implementation uses Prisma, TypeORM, etc.
    class PrismaUserRepository implements UserRepository {
    async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
      }
    }
    

---

## SERVICE LAYER PATTERN

    // Encapsulate business logic
    class UserService {
      constructor(
    private userRepo: UserRepository,
    private emailService: EmailService
    ) {}
    
    async registerUser(data: RegisterDTO) {
    // Business logic here
    const user = await this.userRepo.save(data);
    await this.emailService.sendWelcome(user);
    return user;
      }
    }
    

---

## PATTERN COMPARISON

| PATTERN | PURPOSE |
| --------- | ---------  |
| Repository | Abstract data access |
| Service | Business logic |
| Factory | Object creation |
| Singleton | Single instance |
| Observer | Event notifications |
| Strategy | Swappable algorithms |

## [24K GOLD: DEVTOOLS + PWA + FRONTEND ARCHITECTURE + BACKEND PATTERNS]

### The patterns that build full-stack expertise

---

## LOAD BALANCING TRIBAL KNOWLEDGE

> **The patterns that distribute traffic**

---

## ALGORITHM COMPARISON 2

| ALGORITHM | TYPE | USE WHEN |
| ----------- | ------ | ----------  |
| Round Robin | Static | Equal servers |
| Weighted RR | Static | Different capacities |
| Least Connections | Dynamic | Varying response times |
| Consistent Hashing | Dynamic | Session stickiness |

## ROUND ROBIN

    Request 1 Server A
    Request 2 Server B
    Request 3 Server C
    Request 4 Server A (cycle)
    
    Simple, but ignores server load
    

---

## LEAST CONNECTIONS

    Server A: 5 connections
    Server B: 3 connections
    Server C: 7 connections
    
    Next request Server B (fewest)
    
    Best for varying request durations
    

---

## CONSISTENT HASHING

    Use for: Session stickiness, caching
    
    Hash(user_id) Position on ring
    Traverse clockwise Find server
    
    BENEFIT: Add/remove servers = minimal redistribution
    

---

## CDN TRIBAL KNOWLEDGE

> **The patterns that cache at the edge**

---

## CACHE INVALIDATION STRATEGIES

| STRATEGY | DESCRIPTION | USE FOR |
| ---------- | ------------- | ---------  |
| TTL | Expire after time | Static assets |
| Event-driven | Purge on update | Dynamic content |
| Versioning | New filename each build | JS/CSS bundles |

## CONTROL HEADERS 2

## Cache for 1 year (immutable assets)

Cache-Control: public, max-age=31536000, immutable

## Always revalidate (API responses)

Cache-Control: no-cache, must-revalidate

## Never cache (sensitive data)

Cache-Control: no-store

    
    ---
    
    ## CDN CHECKLIST
    

Use versioned filenames (hash)
Set appropriate Cache-Control
Configure purge automation
Monitor cache hit ratio
Use Edge locations near users
Enable Brotli/Gzip compression

    
    ---
    
    ## FORM VALIDATION TRIBAL KNOWLEDGE 2
    
    > **The patterns that validate user input**
    
    ## DOUBLE VALIDATION RULE
    

CLIENT-SIDE:

- Fast feedback (UX)
- Can be bypassed!
- Use HTML5 attributes

SERVER-SIDE:

- Security (required!)
- Final authority
- Never trust client

    
    ---
    
    ## VALIDATION ATTRIBUTES
    

<input type="email" required>
<input type="tel" pattern="[0-9]{10}">
<input minlength="8" maxlength="50">
<input type="number" min="1" max="100">

    
    ---
    
    ## VALIDATION PATTERNS
    

// GOOD: Shared schema (Zod)
const userSchema = z.object({
email: z.string().email(),
password: z.string().min(8),
});

// Use on frontend AND backend

    
    ---
    
    ## ERROR HANDLING CHECKLIST
    

Show all errors at once
Display near relevant field
Clear, specific messages
Preserve user input
Don't disable submit button
Mark required fields

    
    ---
    
    ## DISTRIBUTED TRACING TRIBAL KNOWLEDGE
    
    > **The patterns that debug microservices**
    
    ---
    
    ## THREE PILLARS OF OBSERVABILITY 2
    
    LOGS: What happened (events)
    METRICS: How many/how much (counters)
    TRACES: Request path across services
    
    ## TRACE CONCEPTS
    

TRACE: End-to-end request journey
SPAN: Single unit of work
CONTEXT: Passed between services

Trace ID: abc123
Span: API Gateway (5ms)
Span: Auth Service (10ms)
Span: Database (50ms)

    
    ---
    
    ## DISTRIBUTED TRACING TOOLS
    
    | TOOL | TYPE | NOTES |
    | ------ | ------ | -------  |
    | OpenTelemetry | Standard | Vendor-neutral |
    | Jaeger | Open source | Popular, CNCF |
    | Zipkin | Open source | Simple |
    | Datadog | Commercial | Full platform |
    
    ## TRACING CHECKLIST
    

Use OpenTelemetry SDK
Propagate context headers
Sample appropriately (1-10%)
Add custom spans for critical paths
Correlate logs with trace IDs
Monitor latency percentiles

    
    ---
    
    ## [24K GOLD: LOAD BALANCING + CDN + FORM VALIDATION + DISTRIBUTED TRACING]
    
    ### The patterns that scale and debug production systems
    
    ---
    
    ## KUBERNETES TRIBAL KNOWLEDGE
    
    > **The patterns that orchestrate containers**
    
    ---
    
    ## S CORE CONCEPTS
    

POD: Smallest unit (1+ containers)
SERVICE: Stable network endpoint
DEPLOYMENT: Manages ReplicaSets
CONFIGMAP: Non-secret configuration
SECRET: Sensitive data (base64)
INGRESS: External HTTP routing

    
    ---
    
    ## DEPLOYMENT STRATEGIES 2
    
    | STRATEGY | DOWNTIME | ROLLBACK | RISK |
    | ---------- | ---------- | ---------- | ------  |
    | Recreate | Yes | Easy | High |
    | Rolling | No | Easy | Medium |
    | Blue-Green | No | Instant | Low |
    | Canary | No | Easy | Low |
    
    ## ROLLING UPDATE
    

spec:
  strategy:
type: RollingUpdate
    rollingUpdate:
maxUnavailable: 1
maxSurge: 1

    
    ---
    
    ## CANARY DEPLOYMENT
    

PHASE 1: Deploy new version to 10% of pods
PHASE 2: Monitor metrics, error rates
PHASE 3: Gradually increase to 100%
ROLLBACK: If issues, send all traffic to old

    
    ---
    
    ## HELM TRIBAL KNOWLEDGE
    
    > **The patterns that package K8s apps**
    
    ---
    
    ## HELM CHART STRUCTURE
    

mychart/
Chart.yaml # Metadata
values.yaml # Default config
templates/ # K8s manifests
    deployment.yaml
    service.yaml
    ingress.yaml

    
    ---
    
    ## HELM COMMANDS
    

## Install

helm install myapp ./mychart

## Upgrade

helm upgrade myapp ./mychart

## Rollback

helm rollback myapp 1

## List releases

helm list

## Uninstall

helm uninstall myapp

    
    ---
    
    ## HELM BEST PRACTICES
    

Use values.yaml for all config
Separate values per environment
Pin chart versions
Use helm lint before deploy
Store charts in registry
Never hardcode secrets

    
    ---
    
    ## CD TRIBAL KNOWLEDGE
    
    > **The patterns that automate deployment**
    
    ---
    
    ## GITHUB ACTIONS STRUCTURE
    

name: CI/CD
on: [push]
jobs:
  build:
runs-on: ubuntu-latest
    steps:

- uses: actions/checkout@v4
- uses: actions/setup-node@v4
- run: npm ci
- run: npm test

    
    ---
    
    ## CD BEST PRACTICES
    

SPEED:
Cache dependencies
Run jobs in parallel
Use matrix builds
Skip unchanged paths

SECURITY:
Use GitHub Secrets
Pin action versions (SHA)
Use OIDC for cloud auth
Read-only GITHUB_TOKEN

    
    ---
    
    ## CACHING PATTERN
    

- uses: actions/cache@v4

  with:
path: ~/.npm
key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
| restore-keys: |
${{ runner.os }}-npm-

    
    ---
    
    ## DEPLOYMENT WORKFLOW
    

## Production deployment with approval

deploy:
needs: build
runs-on: ubuntu-latest
environment: production  # Requires approval
  steps:

- name: Deploy

run: ./deploy.sh

    
    ---
    
    ## CD CHECKLIST
    

Fail fast (lint, test first)
Cache dependencies
Use reusable workflows
Separate build/deploy jobs
Require reviews for prod
Monitor pipeline metrics
Set timeout limits
Notify on failures

    
    ---
    
    ## [24K GOLD: KUBERNETES + HELM + CI/CD AUTOMATION]
    
    ### The patterns that deploy reliably at scale
    
    ---
    
    ## WEBSOCKET TRIBAL KNOWLEDGE 2
    
    > **The patterns that enable real-time communication**
    
    ## WEBSOCKET VS HTTP
    
    | ASPECT | WebSocket | HTTP |
    | -------- | ----------- | ------  |
    | Connection | Persistent | Request/Response |
    | Direction | Bidirectional | Client-initiated |
    | Overhead | Low (after handshake) | Headers each request |
    | Use case | Real-time, chat, gaming | REST APIs, pages |
    
    ## SCALING WEBSOCKETS
    

CHALLENGE: WebSockets are stateful

SOLUTION:

1. Use Pub/Sub (Redis) for cross-server messaging
1. Externalize state to shared store
1. Use sticky sessions or connection IDs
1. Deploy edge layer for connection handling

    
    ---
    
    ## WEBSOCKET BEST PRACTICES
    

Implement heartbeat/ping-pong
Handle reconnection gracefully
Buffer messages during disconnect
Use binary frames for hot paths
Implement backpressure
Set idle connection timeouts
Use load balancer with sticky sessions

    
    ---
    
    ## DATABASE INDEXING TRIBAL KNOWLEDGE 2
    
    > **The patterns that speed up queries**
    
    ## INDEX TYPES
    
    | TYPE | USE CASE | NOTES |
    | ------ | ---------- | -------  |
    | B-tree | Default, most queries | Balanced tree |
    | Hash | Equality lookups | No range queries |
    | Composite | Multi-column WHERE | Column order matters |
    | Covering | All cols in query | Avoids table lookup |
    | Partial | Filtered subset | Smaller, faster |
    
    ## WHEN TO INDEX
    

INDEX THESE COLUMNS:
WHERE clause filters
JOIN conditions
ORDER BY / GROUP BY
Foreign keys

DON'T OVER-INDEX:
Low cardinality (gender, boolean)
Rarely queried columns
Tables with heavy writes

    
    ---
    
    ## EXPLAIN ANALYZE
    

EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

LOOK FOR:
Index Scan (good)
Seq Scan on large tables (bad)
High actual rows vs estimated
Sort operations (possible index needed)

    
    ---
    
    ## INDEXING CHECKLIST
    

Index foreign keys
Use composite index for multi-column WHERE
Put most selective column first
Monitor slow query logs
Remove unused indexes
Rebuild fragmented indexes

    
    ---
    
    ## REST API DESIGN TRIBAL KNOWLEDGE 2
    
    >**The patterns that build clean APIs**
    
    ## HTTP METHOD SEMANTICS
    
    | METHOD | ACTION | IDEMPOTENT |
    | -------- | -------- | ------------  |
    | GET | Read | Yes |
    | POST | Create | No |
    | PUT | Replace | Yes |
    | PATCH | Partial update | Yes |
    | DELETE | Remove | Yes |
    
    ## IDEMPOTENCY PATTERN
    

PROBLEM:
Network retry Duplicate order

SOLUTION:
Client sends: Idempotency-Key: abc123
Server stores: { key: abc123, result: {...} }

If key exists Return stored result
If new Process and store result

    
    ---
    
    ## ERROR RESPONSE FORMAT 2
    
    {
    "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [
    { "field": "email", "issue": "Must be valid email" }
        ],
    "requestId": "abc-123",
    "timestamp": "2024-01-01T00:00:00Z"
      }
    }
    
    ## REST API CHECKLIST
    

Use plural nouns (/users not /user)
Version in URL (/v1/users)
Return proper status codes
Implement pagination
Document with OpenAPI/Swagger
Use idempotency keys for POST
Always validate input server-side

    
    ---
    
    ## ENV VARS TRIBAL KNOWLEDGE
    
    > **The patterns that configure apps (12-Factor)**
    
    ---
    
    ## FACTOR CONFIG RULE
    

SEPARATE CONFIG FROM CODE:
Environment variables
Config files (not committed)
Hardcoded values
Secrets in code

SAME BUILD ANY ENVIRONMENT

    
    ---
    
    ## ENV VAR PATTERNS
    

## Non-sensitive config

DATABASE_URL=postgres://localhost:5432/mydb
NODE_ENV=production
LOG_LEVEL=info

## Sensitive Use secret manager

## Store reference, not actual value

AWS_SECRET_ID=prod/api/db-password

    
    ---
    
    ## SECRET MANAGEMENT TOOLS
    
    | TOOL | PROVIDER | NOTES |
    | ------ | ---------- | -------  |
    | AWS Secrets Manager | AWS | Native AWS |
    | HashiCorp Vault | Any | Self-hosted option |
    | GCP Secret Manager | GCP | Native GCP |
    | Doppler | Any | Developer-friendly |
    | 1Password | Any | Team secrets |
    
    ## CONFIG CHECKLIST
    

Never commit .env files
Use .env.example as template
Secrets in secret manager (not env vars)
Different configs per environment
Validate required vars at startup
Use ConfigMaps/Secrets in K8s

    
    ---
    
    ## [24K GOLD: WEBSOCKETS + DATABASE INDEXING + REST API + ENV VARS]
    
    ### The patterns that build production-ready applications
    
    ---
    
    ## TYPESCRIPT STRICT MODE TRIBAL KNOWLEDGE 2
    
    > **The patterns that prevent null errors**
    
    ## STRICT MODE FLAGS
    

{
"compilerOptions": {
"strict": true,
"strictNullChecks": true,
"noImplicitAny": true,
"strictFunctionTypes": true
  }
}

    
    ---
    
    ## NULL HANDLING OPERATORS
    

// Optional chaining (?.)
const name = user?.profile?.name;

// Nullish coalescing (??)
const value = data ?? 'default';

// Non-null assertion (!)
const element = document.getElementById('app')!;
// Use sparingly! Only when you're 100% sure

// Type guard
if (user !== null) {
// user is now narrowed to non-null
}

    
    ---
    
    ## TYPE GUARD PATTERNS
    

// Type guard function
function isString(value: unknown): value is string {
return typeof value === 'string';
}

// In operator guard
if ('email' in user) {
// user has email property
}

// Discriminated union
type Result =
| { success: true; data: User } |
| { success: false; error: string }; |

    
    ---
    
    ## TYPESCRIPT CHECKLIST 2
    
    Enable strict mode
    Avoid 'any' type
    Use unknown for unknown data
    Define explicit return types
    Use discriminated unions
    Prefer interfaces for objects
    Use const assertions
    
    ## REACT USEEFFECT TRIBAL KNOWLEDGE
    
    > **The patterns that prevent memory leaks**
    
    ---
    
    ## USEEFFECT DEPENDENCY RULES
    

// Empty array = Run once on mount
useEffect(() => {
  initApp();
}, []);

// With deps = Run when deps change
useEffect(() => {
  fetchUser(userId);
}, [userId]);

// No array = Run EVERY render (usually wrong!)
useEffect(() => {
// This runs too often!
});

    
    ---
    
    ## CLEANUP PATTERN 2
    
    useEffect(() => {
    const controller = new AbortController();
    
    fetch('/api/data', { signal: controller.signal })
    .then(res => res.json())
        .then(setData);
    
    // CLEANUP: Abort on unmount
    return () => controller.abort();
    }, []);
    
    ## COMMON USEEFFECT MISTAKES
    

Missing dependency array Infinite loop
Object/array in deps New reference each render
No cleanup for subscriptions Memory leak
Setting state after unmount Warning

Use useCallback for function deps
Use useMemo for object deps
Use AbortController for fetch
Use cleanup for event listeners

    
    ---
    
    ## USEEFFECT CHECKLIST
    

Always include dependency array
Add cleanup for subscriptions
Abort pending fetches on unmount
Remove event listeners in cleanup
Clear intervals/timeouts
Cancel promises with AbortController

    
    ---
    
    ## JAVASCRIPT DEBUGGING TRIBAL KNOWLEDGE
    
    > **The patterns that find bugs faster**
    
    ---
    
    ## CONSOLE METHODS
    

console.log('Basic output');
console.table([{a:1}, {a:2}]);  // Table format
console.dir(object); // Object tree
console.time('label'); // Start timer
console.timeEnd('label'); // End timer
console.trace(); // Stack trace
console.group('Section'); // Group logs
console.groupEnd();

    
    ---
    
    ## DEBUGGER STATEMENT
    

function processData(data) {
debugger; // Pause here in DevTools
return data.map(x => x * 2);
}

    
    ---
    
    ## DEBUGGING CHECKLIST
    

Check console for errors first
Use debugger statement
Add breakpoints in DevTools
Inspect network requests
Check React DevTools (for React)
Verify state/props values
Use console.table for arrays
Check call stack

    
    ---
    
    ## GIT COMMANDS TRIBAL KNOWLEDGE
    
    > **The patterns for version control mastery**
    
    ---
    
    ## ESSENTIAL COMMANDS
    

## Status and log

git status
git log --oneline -10

## Branching

git checkout -b feature/new-branch
git branch -d branch-name

## Stashing

git stash
git stash pop
git stash list

## Undoing

git reset --soft HEAD~1  # Keep changes staged
git reset --hard HEAD~1  # Discard changes (dangerous!)
git checkout -- file.js  # Discard file changes

    
    ---
    
    ## COMMIT BEST PRACTICES
    

FORMAT:
type(scope): description

TYPES:
feat: New feature
fix: Bug fix
docs: Documentation
style: Formatting
refactor: Code restructuring
test: Adding tests
chore: Maintenance

EXAMPLE:
feat(auth): add password reset flow

    
    ---
    
    ## GIT WORKFLOW
    

1. git pull origin main
1. git checkout -b feature/xyz
1. (make changes)
1. git add .
1. git commit -m "feat(xyz): add feature"
1. git push origin feature/xyz
1. Create PR in GitHub
1. After merge: git checkout main && git pull

    
    ---
    
    ## GIT CHECKLIST
    

Pull before starting work
Use meaningful commit messages
Commit small, atomic changes
Never force push to shared branches
Review changes before committing
Use .gitignore properly
Delete merged branches

    
    ---
    
    ## [24K GOLD: TYPESCRIPT + REACT USEEFFECT + DEBUGGING + GIT]
    
    ### The patterns that every developer must master
    
    ---
    
    ## JSON TRIBAL KNOWLEDGE
    
    > **The patterns for dependency management**
    
    ---
    
    ## DEPENDENCY TYPES
    

{
"dependencies": {
// Production deps (shipped to users)
"react": "^18.2.0"
  },
"devDependencies": {
// Dev only (linters, bundlers, tests)
"eslint": "^8.0.0"
  },
"peerDependencies": {
// User must install (plugins)
"react": ">=17.0.0"
  }
}

    
    ---
    
    ## VERSION SYNTAX
    

"1.2.3" Exact version
"^1.2.3" Minor updates OK (1.x.x)
"~1.2.3" Patch updates OK (1.2.x)
"*" Any version (dangerous!)

    
    ---
    
    ## NPM COMMANDS
    

npm install  # Install all deps
npm install pkg  # Add to dependencies
npm install -D pkg    # Add to devDependencies
npm update  # Update within ranges
npm outdated  # Check for updates
npm audit  # Security check
npm audit fix  # Auto-fix vulnerabilities
npm ci  # Clean install (CI/CD)

    
    ---
    
    ## NPM CHECKLIST
    

Use package-lock.json
Use npm ci in CI/CD
Run npm audit regularly
Don't commit node_modules
Pin major versions (^)
Check licenses of deps
Remove unused packages

    
    ---
    
    ## CODE REVIEW TRIBAL KNOWLEDGE 2
    
    > **The patterns that improve code quality**
    
    ## PR SIZE GUIDELINES
    

| LINES CHANGED | REVIEW TIME | QUALITY |
|---------------|-------------|---------|
| < 50 lines | Quick | Best |
| 50-200 lines | Moderate | Good |
| 200-500 lines | Long | Risky |
| > 500 lines | Hours | Split it! |

    
    ---
    
    ## WHAT TO REVIEW
    

MUST CHECK:
Logic correctness
Edge cases handled
Error handling
Security (SQL injection, XSS)
Performance impacts
Tests added/updated

NICE TO CHECK:
Naming clarity
Code duplication
  Documentation

    
    ---
    
    ## REVIEW FEEDBACK FORMAT
    

GOOD: "Consider using early return here to
reduce nesting"

BAD: "This is wrong"

TYPES:
[Blocking] Must fix before merge
[Suggestion] Optional improvement
[Question] Clarification needed
[Nitpick] Style preference

    
    ---
    
    ## PERFORMANCE OPTIMIZATION TRIBAL KNOWLEDGE
    
    > **The patterns that make apps fast**
    
    ---
    
    ## FRONTEND PERFORMANCE
    

CRITICAL RENDERING PATH:
Minimize critical CSS
Defer non-critical JS
Lazy load images
Use WebP/AVIF formats

BUNDLE SIZE:
Code splitting
Tree shaking
Dynamic imports
Analyze with webpack-bundle-analyzer

    
    ---
    
    ## BACKEND PERFORMANCE
    

DATABASE:
Add indexes for queries
Use connection pooling
Avoid N+1 queries
Cache expensive queries

API:
  Pagination
Response compression
HTTP caching headers
Rate limiting

    
    ---
    
    ## PERFORMANCE METRICS
    

FRONTEND (Core Web Vitals):
LCP < 2.5s   (Largest Contentful Paint)
INP < 200ms  (Interaction to Next Paint)
CLS < 0.1    (Cumulative Layout Shift)

BACKEND:
p50 < 100ms  (Median response time)
p95 < 500ms  (95th percentile)
p99 < 1s  (99th percentile)

    
    ---
    
    ## PRODUCTION ERRORS TRIBAL KNOWLEDGE
    
    > **The patterns from real incidents**
    
    ---
    
    ## COMMON PRODUCTION ERRORS
    

1. MEMORY LEAK

Symptom: Gradual slowdown, crash
Cause: Unbounded cache, event listeners
Fix: Add cleanup, set limits

1. CONNECTION EXHAUSTION

Symptom: "Too many connections"
Cause: Not closing DB connections
Fix: Use connection pooling

1. CERTIFICATE EXPIRY

Symptom: HTTPS errors
Cause: Forgot to renew
Fix: Auto-renewal (Let's Encrypt)

1. DISK FULL

Symptom: Write failures
Cause: Unbounded logs
Fix: Log rotation, monitoring

    
    ---
    
    ## INCIDENT RESPONSE
    

1. DETECT:   Alerting fires
1. TRIAGE:   Assess impact
1. MITIGATE: Rollback / hotfix
1. RESOLVE:  Permanent fix
1. POSTMORTEM: Blameless analysis

    
    ---
    
    ## PRODUCTION CHECKLIST
    

BEFORE DEPLOY:
Run all tests
Review in staging
Check rollback plan
Notify team

AFTER DEPLOY:
Monitor error rates
Check performance metrics
Verify key flows work
Ready to rollback if needed

    
    ---
    
    ## SESSION COMPLETE: BRAIN CROSSED 10%
    
    ## This session added comprehensive 24K Gold tribal knowledge across
    
    - Build Tools & Frameworks
    - Authentication & Security
    - React & Next.js Patterns
    - Async Programming
    - Infrastructure as Code
    - Web Security (XSS, CSRF, SQL Injection)
    - Microservices & gRPC
    - Database Scaling & Indexing
    - DevOps (Kubernetes, Helm, CI/CD)
    - TypeScript Strict Mode
    - React Hooks Best Practices
    - Git Commands & Workflows
    - NPM & Dependency Management
    - Code Review Best Practices
    - Performance Optimization
    - Production Error Patterns
    
    ---
    
    ### [24K GOLD DEV VAULT - BRAIN SECTION - 10%+ ACHIEVED]
    
    ### The impossible knowledge that saves years of pain
    
    ---
    
    ## FILE UPLOAD SECURITY TRIBAL KNOWLEDGE
    
    > **The patterns that prevent malicious uploads**
    
    ---
    
    ## VALIDATION CHECKLIST
    

SERVER-SIDE (Required!):
Validate file type (magic bytes, not just extension)
Enforce file size limits
Sanitize/rename filenames
Scan for malware
Store outside web root

CLIENT-SIDE (UX only):
Accept attribute on input
Size check before upload
Progress indicator

    
    ---
    
    ## FILE TYPE VALIDATION
    

// BAD: Check extension only
const isValid = file.name.endsWith('.jpg');

// GOOD: Check magic bytes (file signature)
const buffer = await file.arrayBuffer();
const bytes = new Uint8Array(buffer.slice(0, 4));
const isJPEG = bytes[0] === 0xFF && bytes[1] === 0xD8;

    
    ---
    
    ## SECURE STORAGE PATTERN
    

1. Generate random filename (UUID)
1. Store original name in database
1. Save file outside web root (/uploads not /public)
1. Serve via signed URL or proxy endpoint
1. Set Content-Disposition header

    
    ---
    
    ## PAGINATION TRIBAL KNOWLEDGE 2
    
    > **The patterns that handle large datasets**
    
    ## OFFSET VS CURSOR 2
    
    | ASPECT | OFFSET | CURSOR |
    | -------- | -------- | --------  |
    | Performance | Degrades at depth | Constant O(1) |
    | Consistency | Data shift issues | Stable |
    | Random access | Jump to page 50 | Sequential only |
    | Use case | Admin dashboards | Infinite scroll |
    
    ## OFFSET PAGINATION
    

-- Simple but SLOW for large offsets
SELECT * FROM products
ORDER BY id
LIMIT 20 OFFSET 10000;

-- Database scans 10000 rows just to skip them!

    
    ---
    
    ## CURSOR PAGINATION
    

-- Fast at any depth
SELECT * FROM products
WHERE id > :last_seen_id
ORDER BY id
LIMIT 20;

-- Direct index lookup, no scanning!

    
    ---
    
    ## PAGINATION DECISION
    

Use OFFSET when:
< 10,000 total records
Users need page numbers
Data rarely changes

Use CURSOR when:
Large/growing datasets
Infinite scroll UI
Real-time feeds
Performance critical

    
    ---
    
    ## STRUCTURED LOGGING TRIBAL KNOWLEDGE
    
    > **The patterns that make logs searchable**
    
    ---
    
    ## STRUCTURED VS UNSTRUCTURED
    

UNSTRUCTURED:
"User 123 logged in from 192.168.1.1 at 2024-01-01"

STRUCTURED (JSON):
{
"event": "user_login",
"userId": "123",
"ip": "192.168.1.1",
"timestamp": "2024-01-01T00:00:00Z"
}

    
    ---
    
    ## LOG LEVELS 3
    
    FATAL: System unusable, immediate action
    ERROR: Operation failed, needs attention
    WARN: Unexpected but handled
    INFO: Normal operations (default in prod)
    DEBUG: Detailed troubleshooting
    TRACE: Very verbose (dev only)
    
    ## WHAT TO LOG 2
    
    ALWAYS LOG:
    Request ID (correlation)
    Timestamp (ISO 8601)
    User ID (if authenticated)
    Error messages and stack traces
    Important business events
    
    NEVER LOG:
      Passwords
    API keys / tokens
    Credit card numbers
    PII without consent
    
    ## LOGGING CHECKLIST
    

Use structured JSON format
Include correlation/request IDs
Set appropriate log levels
Centralize logs (ELK, Datadog)
Configure log rotation
Don't log sensitive data
Add context to errors

    
    ---
    
    ## RESILIENCE PATTERNS TRIBAL KNOWLEDGE
    
    > **The patterns that handle failure gracefully**
    
    ---
    
    ## RETRY WITH EXPONENTIAL BACKOFF
    

async function retryWithBackoff(fn, maxRetries = 3) {
for (let attempt = 0; attempt < maxRetries; attempt++) {
try {
return await fn();
} catch (error) {
if (attempt === maxRetries - 1) throw error;

// Exponential backoff: 1s, 2s, 4s...
const delay = Math.pow(2, attempt) * 1000;
// Add jitter to prevent thundering herd
const jitter = Math.random() * 1000;
await sleep(delay + jitter);
    }
  }
}

    
    ---
    
    ## CIRCUIT BREAKER STATES
    

CLOSED Requests pass through
(failures exceed threshold)
OPEN Requests fail immediately (fast fail)
(after timeout period)
HALF-OPEN Test requests allowed
(if successful)
CLOSED (recovered)

    
    ---
    
    ## WHEN TO USE EACH
    

RETRY:
Transient errors (network blip)
Idempotent operations
Short-lived issues

CIRCUIT BREAKER:
Downstream service is down
Prevent cascade failures
Protect resources

    
    ---
    
    ## RESILIENCE CHECKLIST 2
    
    Retry transient errors
    Use exponential backoff
    Add jitter to prevent thundering herd
    Set max retry limits
    Implement circuit breakers
    Add timeouts to all calls
    Log retry attempts
    Monitor failure rates
    
    ## [24K GOLD: FILE UPLOAD + PAGINATION + LOGGING + RESILIENCE]
    
    ### The patterns that build bulletproof systems
    
    ---
    
    ## DRIVEN ARCHITECTURE TRIBAL KNOWLEDGE 2
    
    > **The patterns that decouple systems**
    
    ## EDA CORE CONCEPTS
    

EVENT: Immutable fact that happened
PRODUCER: Publishes events
CONSUMER: Subscribes to events
BROKER: Routes events (Kafka, RabbitMQ)

Key: Producers don't know about consumers!

    
    ---
    
    ## EVENT VS COMMAND
    
    | TYPE | DIRECTION | EXAMPLE |
    | ------ | ----------- | ---------  |
    | Command | Please do X | CreateOrder |
    | Event | X happened | OrderCreated |
    
    ## CQRS PATTERN
    

COMMAND SIDE:
Write operations
Complex validation
Event store

QUERY SIDE:
Read operations
Optimized for reads
Materialized views

BENEFIT: Scale reads and writes independently

    
    ---
    
    ## EVENT SOURCING
    

Traditional: Store current state
Event Sourcing: Store all events

Events:

1. AccountCreated { id: 123 }
1. MoneyDeposited { amount: 100 }
1. MoneyWithdrawn { amount: 30 }

Current balance = Replay all events = 70

BENEFIT: Full audit trail, time travel

    
    ---
    
    ## FEATURE FLAGS TRIBAL KNOWLEDGE 2
    
    > **The patterns that decouple deploy from release**
    
    ## FEATURE FLAG TYPES
    
    | TYPE | LIFESPAN | USE CASE |
    | ------ | ---------- | ----------  |
    | Release | Short | New feature rollout |
    | Experiment | Medium | A/B testing |
    | Ops | Permanent | Kill switches |
    | Permission | Permanent | User entitlements |
    
    ## PROGRESSIVE ROLLOUT 2
    
    1. Deploy code with flag OFF
    1. Enable for 5 percent of users
    1. Monitor metrics, errors
    1. Expand to 25, 50, 100 percent
    1. If issues -> Instantly disable
    
    BENEFIT: Reduce blast radius of bugs
    
    ## FEATURE FLAG CHECKLIST
    

[ ] Use descriptive flag names
[ ] Set expiration dates
[ ] Log flag decisions
[ ] Remove old flags (tech debt!)
[ ] Test both ON and OFF states
[ ] Use centralized management
[ ] Define ownership per flag

    
    ---
    
    ## DATABASE TRANSACTIONS TRIBAL KNOWLEDGE
    
    > **The patterns that ensure data integrity**
    
    ---
    
    ## ACID PROPERTIES 2
    
    A - Atomicity:    All or nothing
    C - Consistency:  Valid state to valid state
    I - Isolation:    Concurrent txns don't interfere
    D - Durability:   Committed = permanent
    
    ## ISOLATION LEVELS 2
    
    | LEVEL | DIRTY READ | NON-REPEATABLE | PHANTOM |
    | ------- | ------------ | ---------------- | ---------  |
    | Read Uncommitted | Possible | Possible | Possible |
    | Read Committed | Prevented | Possible | Possible |
    | Repeatable Read | Prevented | Prevented | Possible |
    | Serializable | Prevented | Prevented | Prevented |
    
    ## TRANSACTION CHECKLIST
    

[ ] Choose appropriate isolation level
[ ] Keep transactions short
[ ] Use consistent lock ordering (prevent deadlock)
[ ] Handle deadlock retries
[ ] Use connection pooling
[ ] Commit or rollback explicitly
[ ] Monitor long-running transactions

    
    ---
    
    ## VIDEO STREAMING TRIBAL KNOWLEDGE
    
    > **The patterns that deliver smooth playback**
    
    ---
    
    ## HLS VS DASH
    
    | ASPECT | HLS | DASH |
    | -------- | ----- | ------  |
    | Creator | Apple | Industry standard |
    | Support | Universal | Most modern players |
    | Latency | Higher (can use LL-HLS) | Lower |
    | DRM | FairPlay | Widevine, PlayReady |
    
    ## ADAPTIVE BITRATE STREAMING
    

How it works:

1. Encode video at multiple bitrates
1. Divide into small segments (6 sec)
1. Client detects network speed
1. Client requests appropriate quality
1. Seamlessly switches as needed

BENEFIT: No buffering on slow connections!

    
    ---
    
    ## BITRATE LADDER EXAMPLE
    

| RESOLUTION | BITRATE | USE CASE |
|------------|---------|----------|
| 360p | 400 Kbps | Mobile 3G |
| 480p | 1000 Kbps | Mobile 4G |
| 720p | 2500 Kbps | Tablet/Laptop |
| 1080p | 5000 Kbps | Desktop |
| 4K | 15000 Kbps | Smart TV |

    
    ---
    
    ## STREAMING CHECKLIST
    

[ ] Use CDN for delivery
[ ] Provide multiple bitrates
[ ] Set segment duration (6s recommended)
[ ] Enable Low-Latency HLS for live
[ ] Use efficient codecs (H.264, HEVC, AV1)
[ ] Add DRM for premium content
[ ] Monitor buffering rates
[ ] Provide captions for accessibility

    
    ---
    
    ## [24K GOLD: EVENT-DRIVEN + FEATURE FLAGS + TRANSACTIONS + STREAMING]
    
    ### The patterns for modern distributed systems
    
    ---
    
    ## API KEYS TRIBAL KNOWLEDGE
    
    > **The patterns for secure API access**
    
    ---
    
    ## API KEY VS OAUTH
    
    | ASPECT | API Key | OAuth 2.0 |
    | -------- | --------- | -----------  |
    | Complexity | Simple | Complex |
    | User context | No | Yes |
    | Scopes | No | Yes |
    | Use case | Server-to-server | User authorization |
    
    ## API KEY BEST PRACTICES
    

[ ] Never expose in client-side code
[ ] Use environment variables
[ ] Rotate keys regularly
[ ] Set expiration dates
[ ] Implement rate limiting
[ ] Log all key usage
[ ] Use separate keys per environment

    
    ---
    
    ## FLOWS
    

Authorization Code: Web apps (safest)
PKCE: Mobile/SPA (no client secret)
Client Credentials: Server-to-server
Implicit: DEPRECATED (don't use!)

    
    ---
    
    ## TESTING STRATEGIES TRIBAL KNOWLEDGE
    
    > **The patterns that catch bugs early**
    
    ---
    
    ## TESTING PYRAMID 2
    
            /\
    / \
    / E2E\  (Few, slow, expensive)
             /------\
    / Integ \   (Some, medium speed)
           /----------\
    / Unit  \ (Many, fast, cheap)
         /_____________\
    
    ## TEST TYPES
    
    | TYPE | TESTS | SPEED | COVERAGE |
    | ------ | ------- | ------- | ----------  |
    | Unit | Functions | Fast | Logic |
    | Integration | Components | Medium | Interactions |
    | E2E | Full flows | Slow | User journeys |
    
    ## TESTING CHECKLIST
    

[ ] Aim for 80% unit test coverage
[ ] Test edge cases and error paths
[ ] Use mocks for external services
[ ] Run tests in CI/CD pipeline
[ ] Write tests before fixing bugs
[ ] Keep tests fast and isolated
[ ] Name tests descriptively

    
    ---
    
    ## MOBILE DEVELOPMENT TRIBAL KNOWLEDGE
    
    > **The patterns for iOS and Android**
    
    ---
    
    ## PLATFORM OPTIONS
    
    | FRAMEWORK | LANGUAGE | PERFORMANCE |
    | ----------- | ---------- | -------------  |
    | React Native | JavaScript | Good |
    | Flutter | Dart | Excellent |
    | Native | Swift/Kotlin | Best |
    | Capacitor | JS/Web | Good for web devs |
    
    ## MOBILE PERFORMANCE
    

[ ] Minimize bundle size
[ ] Lazy load screens
[ ] Optimize images (WebP)
[ ] Cache API responses
[ ] Use virtualized lists
[ ] Profile with Flipper/Xcode
[ ] Test on low-end devices

    
    ---
    
    ## MOBILE CHECKLIST
    

[ ] Handle offline state
[ ] Implement deep linking
[ ] Request permissions properly
[ ] Support dark mode
[ ] Optimize for notch/camera
[ ] Test on multiple devices
[ ] Plan for app store review

    
    ---
    
    ## SEARCH IMPLEMENTATION TRIBAL KNOWLEDGE
    
    > **The patterns for finding data fast**
    
    ---
    
    ## SEARCH OPTIONS
    
    | SOLUTION | USE CASE | FEATURES |
    | ---------- | ---------- | ----------  |
    | PostgreSQL FTS | Simple search | Built-in, good enough |
    | Elasticsearch | Complex search | Full-text, analytics |
    | Algolia | Instant search | Fast, managed |
    | Typesense | Self-hosted | Open source |
    
    ## SEARCH BEST PRACTICES
    

[ ] Debounce search input (300ms)
[ ] Implement autocomplete
[ ] Highlight matching terms
[ ] Add filters and facets
[ ] Track search analytics
[ ] Handle typos (fuzzy matching)
[ ] Index relevant fields only

    
    ---
    
    ## ELASTICSEARCH BASICS
    

INDEX: Like a database
DOCUMENT: Like a row (JSON)
MAPPING: Like a schema
QUERY: Search request

Index -> Type -> Document

    
    ---
    
    ## DESIGN SYSTEM TRIBAL KNOWLEDGE
    
    > **The patterns for consistent UI**
    
    ---
    
    ## DESIGN TOKEN HIERARCHY
    

PRIMITIVE: Blue-500 = #3B82F6
SEMANTIC: Primary = Blue-500
COMPONENT: Button-background = Primary

BENEFIT: Change one value, update everywhere

    
    ---
    
    ## COMPONENT CATEGORIES
    

ATOMS: Button, Input, Icon
MOLECULES: SearchBar, Card, MenuItem
ORGANISMS: Header, Sidebar, DataTable
TEMPLATES: DashboardLayout, AuthLayout
PAGES: HomePage, SettingsPage

    
    ---
    
    ## DESIGN SYSTEM CHECKLIST
    

[ ] Define color palette
[ ] Establish typography scale
[ ] Create spacing system (4px grid)
[ ] Document component props
[ ] Build in accessibility
[ ] Provide usage examples
[ ] Version the system

    
    ---
    
    ## [24K GOLD: OAUTH + TESTING + MOBILE + SEARCH + DESIGN SYSTEMS]
    
    ### The patterns that complete the full-stack picture
    
    ---
    
    ## MONITORING AND ALERTING TRIBAL KNOWLEDGE
    
    > **The patterns that detect issues before users do**
    
    ---
    
    ## FOUR GOLDEN SIGNALS
    

LATENCY: How long requests take
TRAFFIC: Requests per second
ERRORS: Error rate percentage
SATURATION: How full resources are

Monitor these for any service!

    
    ---
    
    ## ALERTING RULES
    

CRITICAL: Page on-call immediately

- Service down
- Error rate > 10%
- Latency p99 > 5s

WARNING: Notify but don't page

- Error rate > 1%
- Disk > 80%

INFO: Log for review

- Unusual patterns

    
    ---
    
    ## MONITORING CHECKLIST
    

[ ] Set up health check endpoints
[ ] Monitor the four golden signals
[ ] Create dashboards per service
[ ] Set actionable alerts (avoid noise)
[ ] Include runbooks with alerts
[ ] Track SLIs/SLOs
[ ] Monitor dependencies too

    
    ---
    
    ## TRIBAL KNOWLEDGE
    
    > **The patterns for global apps**
    
    ---
    
    ## N BASICS
    

I18N: Internationalization (code structure)
L10N: Localization (actual translations)

KEY CONCEPTS:

- Translation keys, not hardcoded strings
- Date/number formatting per locale
- RTL layout support
- Pluralization rules

    
    ---
    
    ## N CHECKLIST 2
    
    [ ] Extract all strings to translation files
    [ ] Use ICU message format for plurals
    [ ] Never concatenate translated strings
    [ ] Handle RTL layout (Arabic, Hebrew)
    [ ] Format dates/numbers per locale
    [ ] Test with long German strings
    [ ] Use context for homonyms
    
    ## TRANSLATION KEY PATTERN
    

// BAD: Concatenation
t('Hello') + ' ' + userName

// GOOD: Interpolation
t('greeting', { name: userName })
// "greeting": "Hello, {name}!"

// GOOD: Plurals
t('items', { count: 5 })
// "items": "{count, plural, one {# item} other {# items}}"

    
    ---
    
    ## DEBUGGING PRODUCTION TRIBAL KNOWLEDGE
    
    > **The patterns that find root causes fast**
    
    ---
    
    ## DEBUG CHECKLIST
    

1. Check logs for errors
1. Look at recent deployments
1. Compare metrics to baseline
1. Check downstream dependencies
1. Reproduce with same inputs
1. Bisect recent changes
1. Check for resource exhaustion

    
    ---
    
    ## COMMON PRODUCTION ISSUES
    

MEMORY LEAK:
Symptoms: Gradual slowdown, OOM
Debug: Memory profiler, heap dumps
Fix: Find growing objects

CONNECTION EXHAUSTION:
Symptoms: Connection timeouts
Debug: Check pool metrics
Fix: Increase pool, fix leaks

SLOW QUERIES:
Symptoms: High latency
Debug: Query logs, EXPLAIN
Fix: Add indexes, optimize

    
    ---
    
    ## INCIDENT TIMELINE
    

T+0: Alert fires
T+5: Acknowledge, start investigating
T+15: Identify probable cause
T+30: Implement mitigation
T+60: Confirm resolution
T+24h: Blameless postmortem

    
    ---
    
    ## SYSTEM DESIGN TRIBAL KNOWLEDGE
    
    > **The patterns for designing at scale**
    
    ---
    
    ## CAPACITY ESTIMATION
    

USERS: 1M daily active users (DAU)
READS: 10 reads/user/day = 10M reads
WRITES: 1 write/user/day = 1M writes
STORAGE: 1KB/write = 1GB/day = 365GB/year

Read:Write ratio = 10:1 -> Optimize for reads

    
    ---
    
    ## COMMON ARCHITECTURES
    

MONOLITH:
Single deployable unit
Good for: Small teams, MVPs

MICROSERVICES:
Independent services
Good for: Large teams, scaling

SERVERLESS:
Functions as a service
Good for: Event-driven, variable load

    
    ---
    
    ## SCALING PATTERNS
    

VERTICAL: Bigger machine (limited)
HORIZONTAL: More machines (preferred)
CACHING: Redis for hot data
SHARDING: Split data by key
REPLICATION: Multiple read replicas
CDN: Static assets at edge

    
    ---
    
    ## SYSTEM DESIGN CHECKLIST
    

[ ] Clarify requirements and constraints
[ ] Estimate capacity and scale
[ ] Design high-level architecture
[ ] Deep dive on critical components
[ ] Address bottlenecks
[ ] Plan for failure scenarios
[ ] Consider security and compliance

    
    ---
    
    ## [24K GOLD: MONITORING + I18N + DEBUGGING + SYSTEM DESIGN]
    
    ### The patterns that senior engineers know by heart
    
    ---
    
    ## DOCUMENTATION TRIBAL KNOWLEDGE
    
    > **The patterns that save future developers**
    
    ---
    
    ## DOCUMENTATION TYPES
    
    | TYPE | AUDIENCE | CONTENT |
    | ------ | ---------- | ---------  |
    | README | New developers | Quick start |
    | API Docs | Consumers | Endpoints, params |
    | Architecture | Team | Design decisions |
    | Runbooks | On-call | How to fix issues |
    | ADRs | Future team | Why decisions made |
    
    ## README TEMPLATE
    

## Project Name

One-line description

## Quick Start

1. Clone repo
1. Install deps
1. Run dev server

## Environment Variables

List required vars

## Testing

How to run tests

## Deployment

How to deploy

    
    ---
    
    ## ADR (Architecture Decision Record)
    

## ADR-001: Use PostgreSQL over MySQL

## Status: Accepted

## Context

Need to choose a database...

## Decision

Chose PostgreSQL because...

## Consequences

Pros: ...
Cons: ...

    
    ---
    
    ## RATE LIMITING TRIBAL KNOWLEDGE 3
    
    > **The patterns that protect APIs**
    
    ## RATE LIMITING ALGORITHMS
    
    | ALGORITHM | DESCRIPTION | PROS |
    | ----------- | ------------- | ------  |
    | Fixed Window | Count per time window | Simple |
    | Sliding Window | Rolling time window | Smoother |
    | Token Bucket | Refill tokens over time | Allows bursts |
    | Leaky Bucket | Fixed rate drain | Smooth output |
    
    ## RATE LIMIT HEADERS
    

X-RateLimit-Limit: 100
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1609459200
Retry-After: 60

Return 429 Too Many Requests when exceeded

    
    ---
    
    ## RATE LIMIT CHECKLIST
    

[ ] Set limits per user/API key
[ ] Use Redis for distributed tracking
[ ] Return clear rate limit headers
[ ] Include Retry-After header
[ ] Allow burst capacity
[ ] Treat authenticated users differently
[ ] Monitor and adjust limits

    
    ---
    
    ## CONCURRENCY TRIBAL KNOWLEDGE
    
    > **The patterns for parallel execution**
    
    ---
    
    ## CONCURRENCY ISSUES
    

RACE CONDITION:
Multiple threads modifying shared state
Result depends on execution order

DEADLOCK:
Threads waiting for each other forever
A waits for B, B waits for A

STARVATION:
Thread never gets access to resource

    
    ---
    
    ## CONCURRENCY SOLUTIONS
    

MUTEX/LOCK:
Only one thread at a time

SEMAPHORE:
Limited number of concurrent access

ATOMIC OPERATIONS:
Thread-safe primitives

MESSAGE PASSING:
No shared state (channels)

    
    ---
    
    ## CONCURRENCY CHECKLIST
    

[ ] Identify shared mutable state
[ ] Use immutable data when possible
[ ] Prefer message passing over locks
[ ] Keep critical sections short
[ ] Use consistent lock ordering
[ ] Test with race condition detectors
[ ] Consider async/await patterns

    
    ---
    
    ## PAYMENT INTEGRATION TRIBAL KNOWLEDGE
    
    > **The patterns for handling money**
    
    ---
    
    ## PAYMENT FLOW
    

1. Client submits payment intent
1. Server creates session (Stripe/PayPal)
1. Redirect to payment page
1. User enters card details
1. Webhook confirms payment
1. Update order status
1. Send confirmation email

    
    ---
    
    ## PAYMENT CHECKLIST
    

[ ] Never handle raw card numbers
[ ] Use webhooks, not client callbacks
[ ] Store payment IDs (not card data)
[ ] Handle duplicate webhooks idempotently
[ ] Implement refund logic
[ ] Test with test cards
[ ] Log all payment events
[ ] Handle currency correctly

    
    ---
    
    ## COMMON PAYMENT ISSUES
    

DOUBLE CHARGE:
Cause: Not idempotent
Fix: Use idempotency keys

MISSED WEBHOOK:
Cause: Server error during webhook
Fix: Implement retry logic, verify server

CURRENCY ERRORS:
Cause: Storing cents as dollars
Fix: Always use smallest unit (cents)

    
    ---
    
    ## BACKGROUND JOBS TRIBAL KNOWLEDGE
    
    > **The patterns for async processing**
    
    ---
    
    ## WHEN TO USE BACKGROUND JOBS
    

USE JOBS FOR:

- Email sending
- Image processing
- Report generation
- Data sync
- Scheduled tasks

DON'T BLOCK:

- API responses
- User interactions

    
    ---
    
    ## JOB QUEUE OPTIONS
    
    | SOLUTION | USE CASE |
    | ---------- | ----------  |
    | Redis + Bull | Node.js, simple |
    | Sidekiq | Ruby |
    | Celery | Python |
    | AWS SQS + Lambda | Serverless |
    
    ## BACKGROUND JOB CHECKLIST
    

[ ] Make jobs idempotent
[ ] Set appropriate timeouts
[ ] Implement retry with backoff
[ ] Add dead letter queue
[ ] Monitor job latency
[ ] Log job execution
[ ] Handle failures gracefully

    
    ---
    
    ## [24K GOLD: DOCUMENTATION + RATE LIMITING + CONCURRENCY + PAYMENTS + JOBS]
    
    ### The patterns that handle enterprise requirements
    
    ---
    
    ## NETWORKING TRIBAL KNOWLEDGE
    
    > **The patterns that move data**
    
    ---
    
    ## HTTP STATUS CODES 2
    
    | CODE | MEANING | USE |
    | ------ | --------- | -----  |
    | 200 | OK | Success |
    | 201 | Created | POST success |
    | 204 | No Content | DELETE success |
    | 400 | Bad Request | Client error |
    | 401 | Unauthorized | Not logged in |
    | 403 | Forbidden | No permission |
    | 404 | Not Found | Resource missing |
    | 429 | Too Many | Rate limited |
    | 500 | Server Error | Our fault |
    | 503 | Unavailable | Overloaded |
    
    ## DNS BASICS
    

A Record:    Domain -> IPv4
AAAA Record: Domain -> IPv6
CNAME: Domain -> Domain (alias)
MX: Mail server
TXT: Verification, SPF
TTL: Cache duration

    
    ---
    
    ## TCP VS UDP
    
    | ASPECT | TCP | UDP |
    | -------- | ----- | -----  |
    | Reliability | Guaranteed | Best effort |
    | Ordering | Preserved | Not guaranteed |
    | Speed | Slower | Faster |
    | Use case | Web, APIs | Gaming, video |
    
    ## [24K GOLD: NETWORKING FUNDAMENTALS]
    
    ---
    
    ## DEBUGGING PRODUCTION ISSUES
    
    > **The tribal knowledge from real incidents**
    
    ---
    
    ## Common Production Failures
    
    ### Memory Leak
    

Symptoms:

- Gradual performance degradation
- OOM crashes after hours/days

Investigation:

- Take heap snapshots over time
- Compare object counts

Common Causes:

- Growing arrays/caches without limits
- Event listeners not removed
- Closures holding references

    
    ---
    
    ### Connection Pool Exhaustion
    

Symptoms:

- "Connection timeout" errors
- Sudden failure under load

Investigation:

- Monitor active connections
- Check for connection leaks

Fixes:

- Use connection pooling
- Set connection timeouts
- Always release connections (finally block)

    
    ---
    
    ### Cascading Failure
    

Symptoms:

- One service failure brings down others
- Error propagation across system

Prevention:

- Circuit breakers
- Timeouts on all calls
- Bulkhead isolation
- Graceful degradation

    
    ---
    
    ### Thundering Herd
    

Symptoms:

- Cache key expires
- All servers hit database simultaneously

Prevention:

- Stagger TTLs with jitter
- Lock during cache regeneration
- Background cache refresh

    
    ---
    
    ## POSTGRES PERFORMANCE TUNING
    
    > **The patterns that make databases fly**
    
    ---
    
    ## Query Analysis
    
    ### EXPLAIN ANALYZE 2
    

EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders
WHERE user_id = 123
AND created_at > '2024-01-01';

-- Look for:
-- Seq Scan on large tables (needs index)
-- High actual rows vs estimated
-- Sort operations (consider index)

    
    ---
    
    ## Index Strategies
    
    ### B-tree (Default)
    

-- Most common, good for: =, <, >, BETWEEN
CREATE INDEX idx_orders_user ON orders(user_id);

    
    ### Composite Index
    

-- Column order matters!
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);

-- Supports: user_id queries
-- Supports: user_id AND created_at queries
-- Does NOT support: created_at only queries

    
    ### Partial Index
    

-- Index only relevant rows
CREATE INDEX idx_active_users ON users(email)
WHERE is_active = true;

    
    ---
    
    ## Connection Pooling
    
    ### PgBouncer Config
    

pool_mode = transaction
max_client_conn = 1000
default_pool_size = 20

    
    ---
    
    ## Vacuum and Analyze
    

-- Update statistics
ANALYZE orders;

-- Clean up dead tuples
VACUUM orders;

-- Autovacuum settings (postgresql.conf)
autovacuum_vacuum_scale_factor = 0.1
autovacuum_analyze_scale_factor = 0.05

    
    ---
    
    ## REDIS PATTERNS
    
    > **The patterns for in-memory data**
    
    ---
    
    ## Data Types
    
    | Type | Use Case |
    | ------ | ----------  |
    | String | Cache, counters |
    | Hash | Objects with fields |
    | List | Queues, recent items |
    | Set | Unique collections |
    | Sorted Set | Leaderboards, ranges |
    
    ## Common Patterns 2
    
    ### Cache with TTL
    

SET user:123 "json_data" EX 3600
GET user:123

    
    ### Rate Limiting
    

-- Sliding window rate limit
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])

local current = redis.call('INCR', key)
if current == 1 then
redis.call('EXPIRE', key, window)
end

return current <= limit

    
    ---
    
    ### Session Storage
    

HSET session:abc123 userId 456 role admin
EXPIRE session:abc123 86400
HGETALL session:abc123

    
    ---
    
    ### Pub/Sub
    

SUBSCRIBE chat:room1
PUBLISH chat:room1 "Hello everyone!"

    
    ---
    
    ### Leaderboard
    

ZADD leaderboard 1000 user:123
ZADD leaderboard 2500 user:456
ZREVRANGE leaderboard 0 9 WITHSCORES

    
    ---
    
    ## SQL INJECTION PREVENTION 2
    
    > **The tribal knowledge that prevents breaches**
    
    ## The Vulnerability
    

// VULNERABLE
const query = `SELECT * FROM users WHERE id = ${userId}`;

// Attacker inputs: 1; DROP TABLE users; --
// Result: SELECT * FROM users WHERE id = 1; DROP TABLE users; --

    
    ---
    
    ## Prevention: Parameterized Queries
    

// SAFE - Node.js pg
const result = await pool.query(
'SELECT * FROM users WHERE id = $1',
  [userId]
);

// SAFE - Prisma
await prisma.user.findUnique({ where: { id: userId } });

    
    ---
    
    ## ORM Protection
    
    Most ORMs protect by default:
    
    - Prisma - Safe
    - TypeORM - Safe with proper usage
    - Drizzle - Safe
    
    But raw queries can still be vulnerable!
    
    ---
    
    ## Additional Measures
    
    - Input validation
    - Least privilege DB user
    - Disable error messages in production
    - Use prepared statements
    - Regular security audits
    
    ---
    
    ## MIGRATION DISASTERS 2
    
    >**The tribal knowledge that prevents data loss**
    
    ## Common Mistakes 2
    
    ### Adding NOT NULL without default
    
    -- DISASTER: Fails if table has data
    ALTER TABLE users ADD COLUMN status TEXT NOT NULL;
    
    -- SAFE: Add with default
    ALTER TABLE users ADD COLUMN status TEXT NOT NULL DEFAULT 'active';
    
    ### Changing column type
    
    -- RISKY: May fail or lose data
    ALTER TABLE orders ALTER COLUMN price TYPE INTEGER;
    
    -- SAFE: Add new column, migrate, drop old
    ALTER TABLE orders ADD COLUMN price_cents INTEGER;
    UPDATE orders SET price_cents = price *100;
    ALTER TABLE orders DROP COLUMN price;
    
    ### Large table migration
    
    -- DANGEROUS: Locks table
    ALTER TABLE large_table ADD COLUMN new_col TEXT;
    
    -- SAFER: Create concurrently (PostgreSQL)
    CREATE INDEX CONCURRENTLY idx_new ON large_table(new_col);
    
    ## Safe Migration Steps
    
    1. Make backwards-compatible changes
    1. Deploy new code (handles both)
    1. Run migration
    1. Remove old code paths
    1. Clean up old columns
    
    ---
    
    ## MEMORY LEAKS IN NODE.JS
    
    > **The tribal knowledge that prevents OOMs**
    
    ---
    
    ## Common Causes
    
    ### N+1 Queries
    

// SLOW: 1 + N queries
const users = await User.findAll();
for (const user of users) {
user.posts = await Post.findByUserId(user.id);
}

// FAST: 1 query with join
const users = await User.findAll({ include: [Post] });

    
    ---
    
    ### Missing Indexes
    

-- Check for slow queries
SELECT * FROM pg_stat_statements
ORDER BY mean_time DESC LIMIT 10;

-- Add index
CREATE INDEX idx_posts_user_id ON posts(user_id);

    
    ---
    
    ### Synchronous Operations
    

// SLOW: Sequential
const user = await getUser(id);
const orders = await getOrders(id);
const products = await getProducts();

// FAST: Parallel
const [user, orders, products] = await Promise.all([
  getUser(id),
  getOrders(id),
  getProducts()
]);

    
    ---
    
    ### No Caching
    

// SLOW: DB hit every time
async function getConfig() {
return db.config.findFirst();
}

// FAST: Cache it
const cached = await redis.get('config');
if (cached) return JSON.parse(cached);
const config = await db.config.findFirst();
await redis.setex('config', 3600, JSON.stringify(config));
return config;

    
    ---
    
    ## Detection
    
    - Monitor memory over time
    - Use heapdump for snapshots
    - Compare object counts
    - Look for growing collections
    
    ## REACT PERFORMANCE ISSUES
    
    > **The tribal knowledge that prevents jank**
    
    ---
    
    ## Unnecessary Re-renders
    
    ### Problem: Parent re-render cascades
    

// PROBLEM: Button re-renders on every count change
function Parent() {
const [count, setCount] = useState(0);
return (
    <>
<Counter count={count} setCount={setCount} />
<ExpensiveChild /> // Re-renders every time!
    </>
  );
}

// FIX: Memoize
const ExpensiveChild = memo(() => {
// ...
});

    
    ---
    
    ### Problem: Creating objects in render
    

// PROBLEM: New object every render
<Child style={{ color: 'red' }} />

// FIX: Memoize or hoist
const style = useMemo(() => ({ color: 'red' }), []);
<Child style={style} />

    
    ---
    
    ## Large Lists
    

// PROBLEM: Renders 10000 items
{items.map(item => <Item key={item.id} />)}

// FIX: Virtualize
import { useVirtualizer } from '@tanstack/react-virtual';

    
    ---
    
    ## Profiling
    
    1. React DevTools Profiler
    1. Highlight Updates
    1. Check re-render counts
    1. Measure component mount time
    
    ---
    
    ## CORS ERRORS EXPLAINED
    
    > **The tribal knowledge that fixes blocked requests**
    
    ---
    
    ## Common Errors
    
    ### "No Access-Control-Allow-Origin"
    

Access to fetch at '<<https://api.example.com'>> from origin
'<<https://app.example.com'>> has been blocked by CORS policy

    
    **Cause**: Server not sending CORS headers
    **Fix**: Add CORS headers on server
    
    ---
    
    ### "Preflight response fails"
    

Response to preflight request doesnt pass access control check

    
    **Cause**: Server not handling OPTIONS
    **Fix**: Handle OPTIONS request, return proper headers
    
    ---
    
    ### "Credentials not supported"
    

The value of the 'Access-Control-Allow-Origin' header must not be '*'
when the credentials mode is 'include'

    
    **Cause**: Using wildcard with credentials
    **Fix**: Specify exact origin
    
    ---
    
    ## Debug Steps
    
    1. Check Network tab for OPTIONS request
    1. Verify response headers
    1. Check if credentials needed
    1. Confirm origin matches
    
    ---
    
    ## DOCKER TROUBLESHOOTING
    
    > **The tribal knowledge for container issues**
    
    ---
    
    ## Container Wont Start
    
    ### Check logs
    

docker logs container_name

    
    ### Common causes 2
    
    - Missing environment variables
    - Port already in use
    - Permission issues
    - Config file errors
    
    ---
    
    ## Image Build Fails
    
    ### Cache issues
    

docker build --no-cache .

    
    ### Wrong context
    
    Make sure Dockerfile can access needed files
    
    ---
    
    ## Container Running but App Not Working
    
    ### Shell into container
    

docker exec -it container_name sh

    
    ### Check process
    

ps aux

    
    ### Check networking
    

curl localhost:3000

    
    ---
    
    ## Common Fixes 2
    

// BAD: Global cache that grows forever
const cache = {};
function addToCache(key, value) {
cache[key] = value;  // Never cleaned!
}

// GOOD: Use LRU cache with max size
import LRU from 'lru-cache';
const cache = new LRU({ max: 500 });

// BAD: Event listener not removed
element.addEventListener('click', handler);
// Component unmounts, handler still attached!

// GOOD: Remove listener
useEffect(() => {
element.addEventListener('click', handler);
return () => element.removeEventListener('click', handler);
}, []);

    
    ---
    
    ## JWT VULNERABILITIES
    
    > **The tribal knowledge that prevents auth bypasses**
    
    ---
    
    ## Algorithm Confusion
    

// VULNERABLE: Accepts any algorithm
jwt.verify(token, secret);

// SAFE: Specify algorithm
jwt.verify(token, secret, { algorithms: ['HS256'] });

    
    Attacker can change algorithm from RS256 to HS256 and use public key as secret!
    
    ---
    
    ## Weak Secrets
    

// VULNERABLE
const secret = 'password123';

// SAFE
const secret = crypto.randomBytes(32).toString('hex');

    
    ---
    
    ## No Expiration
    

// VULNERABLE: Token lives forever
{ sub: userId }

// SAFE: Short expiration
{ sub: userId, exp: Math.floor(Date.now()/1000) + 900 }

    
    ---
    
    ## Sensitive Data in Payload
    

// VULNERABLE: Anyone can decode JWT
{ password: 'secret123' }

// SAFE: Only store identifiers
{ sub: userId, role: 'user' }

    
    ---
    
    ## Best Practices 2
    
    - Use short expiration (15 min)
    - Implement refresh token rotation
    - Store only necessary claims
    - Use RS256 for public verification
    - Validate all claims server-side
    
    ## SLOW API RESPONSES
    
    > **The tribal knowledge for performance debugging**
    
    ---
    
    ## Common Causes 2 2
    
    ### N+1 Queries 2
    
    // SLOW: 1 + N queries
    const users = await User.findAll();
    for (const user of users) {
    user.posts = await Post.findByUserId(user.id);
    }
    
    // FAST: 1 query with join
    const users = await User.findAll({ include: [Post] });
    
    ### Missing Indexes 2
    
    -- Check for slow queries
    SELECT *FROM pg_stat_statements
    ORDER BY mean_time DESC LIMIT 10;
    
    -- Add index
    CREATE INDEX idx_posts_user_id ON posts(user_id);
    
    ### Synchronous Operations 2
    
    // SLOW: Sequential
    const user = await getUser(id);
    const orders = await getOrders(id);
    const products = await getProducts();
    
    // FAST: Parallel
    const [user, orders, products] = await Promise.all([
      getUser(id),
      getOrders(id),
      getProducts()
    ]);
    
    ### No Caching 2
    
    // SLOW: DB hit every time
    async function getConfig() {
    return db.config.findFirst();
    }
    
    // FAST: Cache it
    const cached = await redis.get('config');
    if (cached) return JSON.parse(cached);
    const config = await db.config.findFirst();
    await redis.setex('config', 3600, JSON.stringify(config));
    return config;
    
    ## CONFIGURATION MISTAKES
    
    > **The tribal knowledge that prevents env disasters**
    
    ---
    
    ## Hardcoded Secrets
    

// DISASTER
const apiKey = 'sk_live_abc123';

// SAFE
const apiKey = process.env.API_KEY;

    
    ---
    
    ## Missing Env Validation
    

// PROBLEM: Silent failures
const dbUrl = process.env.DATABASE_URL; // undefined!

// SAFE: Validate at startup
import { z } from 'zod';

const envSchema = z.object({
DATABASE_URL: z.string().url(),
JWT_SECRET: z.string().min(32),
});

const env = envSchema.parse(process.env);

    
    ---
    
    ## Wrong Environment
    

// DISASTER: Prod config in test
if (isProduction) {
// Meant to check env variable, not constant
}

// SAFE: Explicit check
if (process.env.NODE_ENV === 'production') {
// ...
}

    
    ---
    
    ## Sensitive Data in Logs
    

// DISASTER: Logs passwords
logger.info('User login', { email, password });

// SAFE: Redact sensitive fields
logger.info('User login', { email, password: '[REDACTED]' });

    
    ---
    
    ## MONITORING GAPS
    
    > **The tribal knowledge for observability**
    
    ---
    
    ## What to Monitor
    
    ### Infrastructure
    
    - CPU, Memory, Disk
    - Network I/O
    - Instance count
    
    ### Application
    
    - Request rate
    - Error rate
    - Latency (p50, p95, p99)
    - Queue depth
    
    ### Business
    
    - Signups per hour
    - Orders per minute
    - Revenue
    
    ---
    
    ## Alert Fatigue
    

PROBLEM: Too many alerts, all ignored

FIX:

- Only alert on actionable issues
- Include runbook link
- Group related alerts
- Set appropriate thresholds

    
    ---
    
    ## Missing Traces
    

// PROBLEM: Cant correlate logs
logger.info('Order created');

// FIX: Add request ID
logger.info('Order created', {
requestId: req.id,
orderId: order.id,
userId: user.id
});

    
    ---
    
    ## Dashboard Tips
    
    - Put most critical metrics at top
    - Use time ranges consistently
    - Include annotations for deploys
    - Set up on-call rotation
    
    ---
    
    ## PATTERNS 22
    
    > **The tribal knowledge for better tests**
    
    ## Flaky Tests
    

// FLAKY: Depends on timing
await waitFor(() => expect(element).toBeVisible());

// STABLE: Wait for specific condition
await waitFor(() => expect(screen.getByText('Loaded')).toBeInTheDocument());

    
    ---
    
    ## Testing Implementation
    

// BAD: Tests internal state
expect(component.state.isLoading).toBe(false);

// GOOD: Tests behavior
expect(screen.getByText('Data loaded')).toBeInTheDocument();

    
    ---
    
    ## No Isolation
    

// BAD: Tests depend on each other
let testUser;
test('create user', () => { testUser = createUser(); });
test('delete user', () => { deleteUser(testUser); });

// GOOD: Each test independent
test('create and delete user', async () => {
const user = await createUser();
await deleteUser(user);
});

    
    ---
    
    ## Mocking Wrong Layer
    

// BAD: Mock implementation details
jest.mock('./userService');

// BETTER: Mock boundaries (API, DB)
const server = setupServer(
rest.get('/api/users', (req, res, ctx) => res(ctx.json([...])))
);

    
    ---
    
    ## NETWORK DEBUGGING
    
    > **The tribal knowledge for connectivity issues**
    
    ---
    
    ## DNS Issues
    

## Check DNS resolution

nslookup api.example.com
dig api.example.com

## Common issues

## - DNS propagation (TTL)

## - Wrong DNS server

## - DNS cache

    
    ---
    
    ## SSL/TLS Issues
    

## Check certificate

openssl s_client -connect api.example.com:443

## Common issues 2

## - Certificate expired

## - Wrong hostname

## - Incomplete chain

## - Self-signed in production

    
    ---
    
    ## Timeout Root Causes
    
    | Symptom | Likely Cause |
    | --------- | --------------  |
    | Connection timeout | Firewall / Network |
    | Read timeout | Server overloaded |
    | DNS timeout | DNS server issue |
    
    ## Debugging Tools
    

## Test connectivity

curl -v <<<<<<<https://api.example.com>>>>>>>

## Check open ports

nc -zv api.example.com 443

## Trace route

traceroute api.example.com

## Check local ports

| netstat -an | grep LISTEN |

    
    ---
    
    ## ULTRA DENSE
    
    > **Knowledge that ONLY comes from 3am incidents**
    
    ---
    
    ## PostgreSQL Silent Killers
    
    ### Autovacuum Blocked by Long Transactions
    

SYMPTOM: Table bloat grows, queries slow over weeks
ROOT CAUSE: Analytics query holding transaction open for hours
WHY LLMS MISS IT: Looks like index problem, is vacuum problem

FIX: Set idle_in_transaction_session_timeout = '10min'
DETECTION: SELECT * FROM pg_stat_activity WHERE state = 'idle in transaction'

    
    ### Prepared Statement Explosion
    

SYMPTOM: "FATAL: too many connections" despite low traffic
ROOT CAUSE: Each unique parameterized query creates prepared statement in pgbouncer
WHY ITS OBSCURE: Only happens with transaction pooling mode

FIX: Use statement pooling OR set prepared_statements = false

    
    ### Integer Overflow at 2.1B Rows
    

SYMPTOM: "ERROR: integer out of range"
ROOT CAUSE: Serial type is INTEGER, max 2,147,483,647
WHY DEVS MISS IT: Works for years, fails suddenly

FIX: ALTER COLUMN id TYPE BIGINT (requires careful migration)

    
    ---
    
    ## Node.js Deep Gotchas
    
    ### Event Loop Starvation
    

SYMPTOM: Health checks pass, but requests timeout
ROOT CAUSE: CPU-bound code blocks event loop
INVISIBLE BECAUSE: Process isnt crashing, just unresponsive

DETECTION:
blocked-at package
process._getActiveHandles().length

FIX: Move to worker threads OR use setImmediate to yield

    
    ### Memory Leak via Console.log
    

SYMPTOM: Memory grows in production, stable in dev
ROOT CAUSE: Console keeps references in some logging libs
OBSCURE BECAUSE: Nobody suspects console.log

FIX: Use proper logger (pino) that doesnt hold refs

    
    ### DNS Resolution Caching
    

SYMPTOM: App keeps hitting old IP after DNS change
ROOT CAUSE: Node caches DNS indefinitely by default
INVISIBLE: DNS TTL is ignored

FIX: Set dns.setDefaultResultOrder('ipv4first')
OR use lookup: false in http agent

    
    ---
    
    ## React Edge Cases
    
    ### State Update on Unmounted Component
    

SYMPTOM: "Cant update unmounted component" warning
REAL PROBLEM: Not the warning, its the missing cleanup
COMMON WRONG FIX: isMounted flag (antipattern!)

CORRECT FIX: AbortController for fetch
useEffect(() => {
const controller = new AbortController();
fetch(url, { signal: controller.signal });
return () => controller.abort();
}, []);

    
    ### useEffect Firing Twice (Strict Mode)
    

SYMPTOM: API called twice in development
CAUSE: React 18 Strict Mode intentionally double-invokes
WHY CONFUSING: Only happens in dev, not prod

NOT A BUG: Its checking your cleanup works
FIX: Make effects idempotent, not avoiding double-call

    
    ### Closure Over Stale State
    

// BROKEN: Always logs 0
const [count, setCount] = useState(0);
useEffect(() => {
const id = setInterval(() => console.log(count), 1000);
return () => clearInterval(id);
}, []); // Empty deps = closure captures initial count

// FIX: Use ref OR add count to deps

    
    ---
    
    ## IMPOSSIBLE PATTERNS
    
    > **The bugs that take WEEKS to find**
    
    ---
    
    ## Timezone Hell
    
    ### UTC vs Local Murder
    

SYMPTOM: Events appear on wrong day for some users
ROOT CAUSE: new Date() uses local time, stored as UTC, displayed wrong

THE TRAP:

- Dev machine: UTC-5
- Server: UTC
- User: UTC+9

= 3 different days for same moment

ONLY FIX: Store as UTC, convert at display time ALWAYS
NEVER: new Date().toDateString() for comparison

    
    ### Daylight Saving Edge Case
    

SYMPTOM: Scheduled job runs twice OR skips
WHEN: DST transition days only
ROOT CAUSE: 2:30 AM doesnt exist OR exists twice

FIX: Use UTC for all scheduling
NEVER: Schedule at 2:00-3:00 AM local time

    
    ---
    
    ## Floating Point Crimes
    
    ### Money Math Disaster
    

// WRONG: 0.1 + 0.2 = 0.30000000000000004
const total = 0.1 + 0.2; // NEVER for money!

// SILENT DATA CORRUPTION
// Accumulates over thousands of transactions

ONLY FIX: Store cents as integers
const totalCents = 10 + 20; // 30 cents
const display = (totalCents / 100).toFixed(2);

    
    ### JSON.stringify Loses Precision
    

// DISASTER: Large IDs corrupted
const id = 9007199254740993; // > MAX_SAFE_INTEGER
JSON.stringify({ id }); // "9007199254740992" WRONG!

FIX: Use string IDs for anything > 2^53

    
    ---
    
    ## Encoding Nightmares
    
    ### UTF-8 BOM Kills JSON Parse
    

SYMPTOM: "Unexpected token" parsing valid JSON
ROOT CAUSE: File has invisible BOM character at start
EDITORS HIDE IT: Looks completely normal

| DETECTION: hexdump -C file.json | head |
FIX: Save as UTF-8 without BOM

    
    ### Base64 URL-Safe vs Standard
    

SYMPTOM: Signature validation fails randomly
ROOT CAUSE: + and / in standard, - and _ in URL-safe
RANDOM BECAUSE: Only fails when content has those chars

ALWAYS: Be explicit about which encoding

    
    ---
    
    ## Concurrency Traps
    
    ### Database Optimistic Lock Lost Update
    

SYMPTOM: Inventory goes negative under load
ROOT CAUSE: Read-modify-write without locking

User A reads stock: 1
User B reads stock: 1
User A writes: 0
User B writes: 0 (should be -1, blocked!)

FIX: SELECT FOR UPDATE or version column check

    
    ### Redis INCR vs GET+SET Race
    

// BROKEN: Race condition
const count = await redis.get('count');
await redis.set('count', count + 1);

// SAFE: Atomic operation
await redis.incr('count');

    
    ---
    
    ## INFRASTRUCTURE LANDMINES
    
    > **The gotchas that break at 10x scale**
    
    ---
    
    ## Kubernetes Secrets in Plain Text
    

SYMPTOM: Security audit fails
WHAT DEVS THINK: Secrets are encrypted
REALITY: Base64 encoded, NOT encrypted!

| cat secret.yaml | base64 -d  # Readable! |

REAL FIX:

- Enable encryption at rest
- Use external secrets operator
- Never commit secrets to git

    
    ---
    
    ## Docker Build Cache Invalidation
    

SYMPTOM: Build takes 10 minutes, should be cached
ROOT CAUSE: COPY . . early in Dockerfile

## WRONG: Any file change busts cache

COPY . .
RUN npm install

## RIGHT: Dependencies cached separately

COPY package*.json ./
RUN npm install
COPY . .

    
    ---
    
    ## Load Balancer Sticky Sessions Break Deploys
    

SYMPTOM: Some users stuck on old version
ROOT CAUSE: Sticky sessions + rolling deploy
USER STUCK ON: Old pod until session expires

FIX OPTIONS:

- Externalize session state (Redis)
- Drain connections before pod termination
- Accept temporary inconsistency

    
    ---
    
    ## AWS Lambda Cold Start Stack
    

COLD START CONTRIBUTORS (additive):

- VPC: +1-5 seconds (worst offender)
- Package size: +100ms per 10MB
- Initialization code: varies
- Provisioned concurrency: eliminates cold start

OPTIMIZATIONS:

- Avoid VPC unless required
- Lazy-load dependencies
- Use provisioned concurrency for critical paths
- Keep handlers minimal

    
    ---
    
    ## Rate Limit Headers Nobody Reads
    

SYMPTOM: App gets rate limited, retries immediately
ROOT CAUSE: Ignoring Retry-After header

CORRECT HANDLING:
if (response.status === 429) {
const retryAfter = response.headers.get('Retry-After');
await sleep(parseInt(retryAfter) * 1000);
return retry();
}

    
    ---
    
    ## SECURITY BLIND SPOTS
    
    > **The vulnerabilities scanners miss**
    
    ---
    
    ## Mass Assignment Attack
    

// VULNERABLE: Accepts any field
app.put('/user', async (req, res) => {
await User.update(req.body);  // Can set isAdmin: true!
});

// SAFE: Whitelist fields
const { name, email } = req.body;
await User.update({ name, email });

    
    ---
    
    ## Regex DoS (ReDoS)
    

// VULNERABLE: Exponential backtracking
const regex = /^(a+)+$/;
regex.test('aaaaaaaaaaaaaaaaaaaaaaaaaaaaX'); // Hangs!

DETECTION: regex with nested quantifiers (a+)+
FIX: Use safe-regex package to validate patterns

    
    ---
    
    ## JWT None Algorithm Attack
    

// VULNERABLE: Accepts alg: none
jwt.verify(token, secret);

// Headers crafted by attacker:
{ "alg": "none", "typ": "JWT" }
// Signature ignored!

// SAFE: Specify algorithms
jwt.verify(token, secret, { algorithms: ['HS256'] });

    
    ---
    
    ## GraphQL Depth Attack
    

## ATTACK: Deeply nested query crashes server

query {
user {
friends {
friends {
friends {
friends { # 100 levels deep = exponential load
        }
        }
      }
    }
  }
}

FIX: graphql-depth-limit middleware

    
    ---
    
    ## SSRF via PDF Generation
    

// VULNERABLE: User controls URL in PDF
const pdf = await generatePDF(`<img src="${userUrl}">`);

// Attacker provides: <<http://169.254.169.254/latest/meta-data/>>
// PDF generator fetches AWS metadata!

FIX: URL whitelist, block internal ranges

    
    ---
    
    ## Timing Attack on String Compare
    

// VULNERABLE: Early exit reveals info
if (providedToken === secretToken) { ... }

// Attacker measures response time to guess characters

// SAFE: Constant time comparison
import { timingSafeEqual } from 'crypto';
const a = Buffer.from(providedToken);
const b = Buffer.from(secretToken);
if (a.length === b.length && timingSafeEqual(a, b)) { ... }

    
    ---
    
    ## INTUITIVE FACTS
    
    > **The knowledge that contradicts assumptions**
    
    ---
    
    ## "More Indexes = Faster" IS WRONG
    

REALITY: Each index slows writes
PRODUCTION IMPACT: 10 indexes = 10x write overhead

WORSE: Unused indexes still maintained
DETECTION: pg_stat_user_indexes unused_idx

RULE: Profile before adding, remove unused

    
    ---
    
    ## "Async = Faster" IS WRONG
    

// SLOWER: Async overhead for simple ops
await Promise.all(items.map(async i => i + 1));

// FASTER: Synchronous
items.map(i => i + 1);

ASYNC WINS: Only for I/O bound ops
SYNC WINS: CPU bound, small operations

    
    ---
    
    ## "Caching Everything = Fast" IS WRONG
    

CACHE OVERHEAD:

- Serialization cost
- Network round trip
- Memory pressure
- Invalidation complexity

DONT CACHE:

- Cheap computations
- Rarely accessed data
- Rapidly changing data
- User-specific when many users

CACHE MATH: Cache hit must be 10x faster than compute

    
    ---
    
    ## "Connection Pooling Always Helps" IS WRONG
    

SCENARIO THAT BREAKS:

- Pool size: 20
- DB max connections: 100
- Pods: 10
- 20 * 10 = 200 > 100 = CRASH

FIX: Pool size <= DB max / pod count
ALSO: Idle connections consume memory

    
    ---
    
    ## "Microservices = Better" IS WRONG
    

MICROSERVICES ADD:

- Network latency
- Deployment complexity
- Debugging difficulty
- Data consistency challenges
- Operational overhead

MONOLITH WINS WHEN:

- Team < 10 engineers
- Domain boundaries unclear
- Rapid iteration needed
- Limited DevOps expertise

    
    ---
    
    ## DEBUGGING IMPOSSIBLE BUGS
    
    > **The patterns when nothing makes sense**
    
    ---
    
    ## Works Locally, Fails in Production
    

CHECKLIST (in order of likelihood):

1. Environment variables missing/different
1. DNS/Network differences
1. File system permissions
1. Memory/CPU limits
1. Different package versions (check lock file!)
1. Time zone differences
1. Locale differences
1. SSL certificate issues
1. Load balancer behavior
1. Container vs native differences

    
    ---
    
    ## Works Yesterday, Fails Today
    

CHECKLIST:

1. What deploys happened? (check git, CI)
1. Infrastructure changes? (check Terraform)
1. Certificate expiry?
1. DNS record changes?
1. Third party API changes?
1. Data volume crossed threshold?
1. Scheduled jobs causing load?
1. Daylight saving time transition?

    
    ---
    
    ## Fails Randomly
    

USUALLY CONCURRENCY:

1. Race conditions
1. Deadlocks
1. Connection pool exhaustion
1. Memory pressure (GC pauses)
1. Network timeouts
1. External API rate limits
1. Load-dependent only

DEBUGGING:

- Increase logging around failure
- Add request IDs to trace
- Check timestamps for patterns
- Stress test to reproduce

    
    ---
    
    ## Error Message Lies
    

COMMON LIARS:

"Connection refused"
-> Often firewall, not service down

"Permission denied"
-> Often path wrong, not permissions

"Timeout"
-> Often DNS, not server slow

"Out of memory"
-> Often file descriptors, not RAM

"File not found"
-> Often working directory wrong

    
    ---
    
    ## SPECIFIC GOTCHAS
    
    > **The landmines in specific versions**
    
    ---
    
    ## Node.js 18 Fetch
    

NEW IN 18: Built-in fetch (finally!)
GOTCHA: Different from node-fetch

BREAKS:

- No agent option (different keepalive)
- Different timeout handling
- Response.body handling differs

MIGRATION: Check all fetch wrappers

    
    ---
    
    ## React 18 Auto Batching
    

CHANGED: All updates batched by default
BREAKS: Code relying on immediate state

// Pre-18: Each causes re-render
setA(1);
setB(2); // 2 renders

// React 18: Batched
setA(1);
setB(2); // 1 render

ESCAPE HATCH: flushSync() for immediate

    
    ---
    
    ## Next.js 13+ App Router
    

MASSIVE CHANGES:

- pages/ -> app/
- getServerSideProps -> Server Components
- API routes -> route.ts
- Client components explicit

MIGRATION TRAP: Mixing paradigms breaks

    
    ---
    
    ## TypeScript 5 Decorators
    

CHANGED: Standard decorators, not experimental
BREAKS: All existing experimentalDecorators code

OLD: function decorator(target, key, descriptor)
NEW: function decorator(value, context)

MIGRATION: Enable experimentalDecorators to keep old

    
    ---
    
    ## PostgreSQL 14+ Idle Transaction Timeout
    

NEW DEFAULT: No timeout (dangerous!)
PRODUCTION ISSUE: One bad query blocks vacuum

MUST SET:
idle_in_transaction_session_timeout = '5min'
statement_timeout = '30s'

    
    ---
    
    ## PERFORMANCE NUMBERS TO MEMORIZE
    
    > **The latency numbers every dev should know**
    
    ---
    
    ## LATENCY COMPARISON
    

L1 cache reference:  0.5 ns
L2 cache reference:  7 ns
Main memory reference:  100 ns
SSD random read:  150,000 ns (150 us)
HDD seek:  10,000,000 ns (10 ms)
Network round trip same datacenter: 500,000 ns (0.5 ms)
Network round trip cross-country:   150,000,000 ns (150 ms)

    
    ---
    
    ## BACK OF ENVELOPE
    

Reads per second per server:  10,000-50,000
Writes per second per server:  1,000-10,000
Redis ops per second:  100,000+
PostgreSQL rows scanned/sec:  millions
PostgreSQL rows returned/sec:  thousands matter

RULE: If > 1000 rows returned, paginate

    
    ---
    
    ## REQUEST BUDGET
    

Total request time target: 200ms

TYPICAL BREAKDOWN:

- DNS:  5ms (cached after first)
- TCP handshake: 10ms
- TLS handshake: 20ms
- Server processing: 100ms (your code)
- DB queries:    50ms (2-3 queries max)
- Response:  15ms

EVERY NETWORK CALL: Budget 10-50ms
EVERY DB QUERY:  Budget 5-20ms

    
    ---
    
    ## MEMORY MATH
    

JavaScript object overhead: ~80 bytes base
1M strings (100 chars each): ~200MB
1M objects (10 fields):  ~500MB
1M dates:  ~56MB

TRAP: Array of objects vs columnar
[{a,b,c}, {a,b,c}] > overhead
{a: [], b: [], c: []} < efficient

    
    ---
    
    ## API DESIGN TRAPS
    
    > **The decisions that haunt you forever**
    
    ---
    
    ## Breaking Changes Hall of Shame
    

SILENTLY BREAKING:

1. Changing null to empty array []

-> Client: if (response.items === null)
-> BREAKS

1. Changing field type

-> price: "10.00" to price: 10.00
-> BREAKS JSON parsing

1. Changing date format

-> "2024-01-01" to "2024-01-01T00:00:00Z"
-> BREAKS date parsing

1. Removing enum value

| -> status: "pending" | "active" | "archived" |
-> Remove "archived"
-> BREAKS old data display

    
    ---
    
    ## Pagination Disasters
    

OFFSET PAGINATION FAILURE:

Page 1: items 1-10
User deletes item 5
Page 2: items 10-19 (item 11 skipped!)

CURSOR PAGINATION:
after: "item_10_id"
Always correct, never skip

RULE: Use cursor for user-facing
Use offset only for admin/internal

    
    ---
    
    ## ID Design Mistakes
    

SEQUENTIAL IDs:

- Leak total count
- Predictable (security risk)
- Show creation order

UUID v4:

- No ordering
- Bad for database (random insert)
- Hard to debug

UUID v7 / ULID:

- Time-ordered (good for DB)
- No info leak
- Sortable

    
    ---
    
    ## Null vs Undefined vs Omitted
    

API CONTRACT NIGHTMARE:

{} vs {"name": null} vs {"name": undefined}

RULE: Pick one and document:

- Omitted: field not requested
- null: explicitly no value
- Never send undefined in JSON

PATCH TRAP:
PATCH {"name": null} -> clear name or error?
DOCUMENT THIS!

    
    ---
    
    ## PATTERNS 23
    
    > **The schemas that fail at scale**
    
    ## EAV Pattern Disaster
    

-- Entity-Attribute-Value (looks flexible, is nightmare)
CREATE TABLE attributes (
entity_id INT,
attribute_name VARCHAR,
attribute_value VARCHAR
);

PROBLEMS:

- No type safety
- Complex queries
- No referential integrity
- Terrible performance
- Hard to index

WHEN TO USE: Almost never
ALTERNATIVE: JSONB column in PostgreSQL

    
    ---
    
    ## Soft Delete Gotcha
    

-- Soft delete looks safe
UPDATE users SET deleted_at = NOW() WHERE id = 1;

TRAPS:

1. Unique constraint fails

-- Cant create new user with deleted email!

1. Foreign keys break

-- Orders still reference deleted user

1. Queries forget filter

-- SELECT * FROM users -- includes deleted!

BETTER: Archive table OR include deleted_at in unique
CREATE UNIQUE INDEX ON users (email) WHERE deleted_at IS NULL;

    
    ---
    
    ## JSON Column Abuse
    

-- Store everything as JSON (tempting, terrible)
CREATE TABLE orders (
id INT,
data JSONB
);

PROBLEMS:

- No schema validation
- No foreign keys
- Complex indexing
- Version mismatches
- Reporting nightmare

WHEN JSON IS OK:

- Truly schema-less data
- External API payloads
- Rarely queried fields

    
    ---
    
    ## Missing Partial Index
    

-- Full index on status column
CREATE INDEX idx_status ON orders(status);
-- 99% of orders are 'completed'
-- Index is mostly useless!

-- Partial index on active states only
CREATE INDEX idx_active ON orders(status)
WHERE status IN ('pending', 'processing');
-- Much smaller, much faster

    
    ---
    
    ## DEPLOYMENT NIGHTMARES
    
    > **The failures that happen at the worst time**
    
    ---
    
    ## Backward Compatibility Window
    

PRODUCTION REALITY:

Old pods: version N
New pods: version N+1
Both running during deploy: 5-10 minutes

BREAKS:

- Database column removed (old code uses it)
- API field removed (old frontend uses it)
- Message format changed (old consumers fail)

RULE: 2-phase deploy

1. Deploy code that handles both
1. Make breaking change
1. Remove old handling

    
    ---
    
    ## Database Migration Lock
    

DISASTER SCENARIO:

ALTER TABLE large_table ADD COLUMN x INT;
-- Locks entire table for minutes
-- All queries queue up
-- Timeouts cascade
-- Site down

FIX:
-- Add column as nullable
ALTER TABLE large_table ADD COLUMN x INT;

-- Later, add default (fast in PG 11+)
ALTER TABLE large_table ALTER COLUMN x SET DEFAULT 0;

-- Much later, backfill in batches
UPDATE large_table SET x = 0 WHERE x IS NULL LIMIT 1000;

    
    ---
    
    ## Feature Flag Explosion
    

TECHNICAL DEBT EXPLOSION:

Year 1: 10 flags, manageable
Year 2: 50 flags, confusing
Year 3: 200 flags, nightmare

SYMPTOMS:

- if (flagA && !flagB && flagC) ???
- Testing all combinations impossible
- Orphaned flags everywhere
- Nobody knows what flags do

RULE: Flag expiration dates
RULE: Flag ownership
RULE: Regular cleanup sprints

    
    ---
    
    ## Zero Downtime Deploy Checklist
    

PRE-DEPLOY:
[ ] Database migrations safe (no locks)?
[ ] New code handles old data?
[ ] Old code handles new data?
[ ] Health checks updated?
[ ] Rollback tested?

DURING DEPLOY:
[ ] Monitor error rates
[ ] Watch response times
[ ] Check database connections
[ ] Verify new pods healthy

POST-DEPLOY:
[ ] Smoke test critical paths
[ ] Check logs for new errors
[ ] Verify metrics normal
[ ] Hold for 15 mins before celebrating

    
    ---
    
    ## DISTRIBUTED SYSTEMS HELL
    
    > **The failures you cant reproduce locally**
    
    ---
    
    ## Split Brain Scenario
    

SETUP: 3-node cluster, network partition

Node A: Thinks its leader
Node B: Also thinks its leader
Node C: Isolated, cant vote

RESULT: Two leaders accept writes
Data diverges
Merge on recovery = nightmare

PREVENTION:

- Quorum requirements (majority)
- Fencing tokens
- Partition detection + read-only mode

    
    ---
    
    ## Clock Skew Disasters
    

ASSUMPTION: Server times are synchronized
REALITY: Up to seconds of drift possible

BREAKS:

- Event ordering
- Cache TTLs
- Token expiry
- Distributed locks

RULE: Never compare timestamps across machines
FIX: Use logical clocks (vector clocks, Lamport)

    
    ---
    
    ## Eventually Consistent Reads
    

SCENARIO:

1. User updates profile (goes to primary)
1. User refreshes page (reads from replica)
1. Old data shown! (replication lag)
1. User thinks update failed
1. User updates again
1. Duplicate updates!

FIXES:

- Read-your-writes consistency
- Sticky sessions to primary
- Show optimistic UI

    
    ---
    
    ## The Two Generals Problem
    

IMPOSSIBILITY THEOREM:

General A: "Attack at dawn?"
General B: "Acknowledged"
General A: "Did B get my message or ack?"
General B: "Did A get my ack?"

INFINITE LOOP: Neither can be certain

REAL IMPACT:

- You can NEVER guarantee both sides agree
- Design for idempotency
- Accept uncertainty

    
    ---
    
    ## Thundering Herd 2
    

SCENARIO:

1. Cache key expires
1. 1000 requests hit simultaneously
1. All 1000 hit database
1. Database overwhelmed
1. Cascade failure

PREVENTION:

- Cache stampede lock
- Probabilistic early expiration
- Background refresh before expiry
- Request coalescing

    
    ---
    
    ## HIDDEN PERFORMANCE KILLERS
    
    > **The bottlenecks that dont show in profiles**
    
    ---
    
    ## DNS Resolution Per Request
    

HIDDEN COST: 20-100ms per DNS lookup
DEFAULT BEHAVIOR: Node.js resolves every request

SYMPTOMS:

- High p99 latency
- Random slow requests
- Works fine under low load

FIX: DNS caching

- Use keepAlive connections
- Set dns.lookup caching
- Use IP addresses for internal services

    
    ---
    
    ## Connection Establishment Overhead
    

NEW TCP: 3-way handshake (1 RTT)
NEW TLS: 2 more round trips (2 RTT)
TOTAL: 3 round trips before first byte

100ms latency = 300ms just to connect!

FIX: Connection pooling + keep-alive
VERIFY: Check 'Connection: keep-alive' header

    
    ---
    
    ## GC Pause Spikes
    

SYMPTOM: Random p99 spikes to 500ms+
CAUSE: Garbage collector stop-the-world

INVISIBLE: Average looks fine
Maximum terrible

INVESTIGATION:
node --gc-trace app.js

FIX:

- Reduce object allocation
- Use object pools
- Consider incremental GC settings

    
    ---
    
    ## Database Connection Pool Starvation
    

SYMPTOM: Request timeout under load
HIDDEN ROOT CAUSE:

Pool: 10 connections
Slow query: 5 seconds
RPS: 3 requests/second

5 seconds * 3 RPS = 15 connections needed
10 available = WAITING

FIX:

- Optimize slow queries first
- Then increase pool
- Set connection timeout

    
    ---
    
    ## JSON Parse/Stringify Cost
    

HIDDEN CPU HOG:

const data = JSON.parse(largeString);
// 100MB string = ~1 second block!

EVERY REQUEST:

- Parse body
- Stringify response
- Stringify for cache

= Multiple parses per request

FIX:

- Stream parsing for large data
- Avoid re-serializing
- Use binary protocols for performance

    
    ---
    
    ## JAVASCRIPT QUIRKS THAT BITE
    
    > **The language gotchas that cause prod bugs**
    
    ---
    
    ## Array Sort Mutates
    

const original = [3, 1, 2];
const sorted = original.sort();
// original IS NOW [1, 2, 3]!
// sorted === original (same reference!)

FIX: const sorted = [...original].sort();

    
    ---
    
    ## typeof null === 'object'
    

function process(value) {
if (typeof value === 'object') {
return value.property; // CRASH if null!
  }
}

FIX: if (value && typeof value === 'object')

    
    ---
    
    ## Array Holes
    

const arr = [1, 2, 3];
delete arr[1];
console.log(arr); // [1, empty, 3]
console.log(arr.length); // 3!
arr.forEach(x => console.log(x)); // 1, 3 (skips hole!)
arr.map(x => x * 2); // [2, empty, 6]

    
    ---
    
    ## parseInt Gotchas
    

parseInt('08'); // 0 in old JS (octal)!
parseInt('1e10'); // 1 (stops at 'e')
parseInt(0.0000001); // 1 (converts to '1e-7', parses '1')

FIX: Number() or explicit radix

    
    ---
    
    ## Implicit Type Coercion
    

[] == false  // true
[] == ![]  // true (WTF)
{} + []  // 0 (block + array = number)
[] + {}  // '[object Object]'
{} + {}  // NaN

RULE: Always use === and !==

    
    ---
    
    ## Floating Point Comparison
    

0.1 + 0.2 === 0.3  // false!

FIX: Math.abs(a - b) < Number.EPSILON
OR: Use integer math for money

    
    ---
    
    ## AUTH EDGE CASES
    
    > **The scenarios devs never test**
    
    ---
    
    ## Token Revocation Gap
    

SCENARIO:

1. User logs in, gets JWT (1 hour expiry)
1. User changes password
1. Old JWT still valid for 59 minutes!
1. Attacker with stolen JWT has access

FIXES:

- Short token lifetime (15 min)
- Token versioning in payload
- Blacklist on logout
- Refresh token rotation

    
    ---
    
    ## OAuth State Mismatch
    

VULNERABILITY:

1. Attacker starts OAuth flow, gets code
1. Tricks victim into completing flow
1. Victim gets attackers account linked!

FIX: CSRF token in state parameter
VERIFY: state matches on callback

    
    ---
    
    ## Password Reset Token Replay
    

SCENARIO:

1. User requests password reset
1. Gets email with token
1. Clicks link, resets password
1. Token still valid!
1. Attacker with old email can reset again

FIX: Invalidate token on use
FIX: Single-use tokens
FIX: Token expires with password change

    
    ---
    
    ## Session Fixation
    

ATTACK:

1. Attacker visits site, gets session ID
1. Sends victim link with attacker session
1. Victim logs in with that session
1. Attacker now authenticated!

FIX: Regenerate session ID on login
FIX: Dont accept session ID from URL

    
    ---
    
    ## Insecure Remember Me
    

BAD: Cookie value = userID
(anyone can set any user!)

BAD: Cookie value = userID + hash
(hash with weak secret)

GOOD: Random token stored in DB
Invalidate all on password change
Store hashed in DB (like password)

    
    ---
    
    ## INCIDENT RESPONSE PATTERNS
    
    > **The playbooks from real outages**
    
    ---
    
    ## Immediate Actions (First 5 Minutes)
    

1. DONT PANIC
1. Check: Is it really broken?
- Try from different network
- Check status page
- Ask coworker to confirm

1. Communicate:
- "Investigating issue with X"
- Update every 15 min

1. Assess impact:
- Users affected?
- Data at risk?
- Revenue impact?

    
    ---
    
    ## Mitigation Hierarchy
    

FASTEST TO SLOWEST:

1. Kill switch / Feature flag OFF (seconds)
1. Scale up (minutes)
1. Rollback deploy (5 mins)
1. Restore from backup (30+ mins)
1. Fix forward (hours)

RULE: Mitigate first, investigate later
RULE: Rollback is not defeat

    
    ---
    
    ## Post-Incident Checklist
    

IMMEDIATE (within 24h):
[ ] Timeline documented
[ ] Root cause identified
[ ] Immediate fix verified

POSTMORTEM (within 1 week):
[ ] Blameless retrospective held
[ ] Action items assigned
[ ] Detection improvements identified
[ ] Communication reviewed

FOLLOW-UP (within 1 month):
[ ] Action items completed
[ ] Similar risks reviewed
[ ] Runbooks updated

    
    ---
    
    ## Blameless Postmortem Format
    

## Incident Summary

What happened in 1-2 sentences

## Impact

- Duration: X minutes
- Users affected: Y
- Revenue impact: $Z

## Timeline

- 14:00 - Deploy started
- 14:05 - Alerts fired
- 14:10 - On-call paged
- 14:15 - Rollback initiated
- 14:20 - Service restored

## Root Cause 2

Why it happened (not who)

## Action Items

[ ] Add monitoring for X (owner, due date)
[ ] Fix Y (owner, due date)

    
    ---
    
    ## ELASTICSEARCH GOTCHAS
    
    > **The hidden traps in search**
    
    ---
    
    ## Mapping Explosion
    

SYMPTOM: Cluster refuses writes, high memory
CAUSE: Dynamic mapping + user-controlled keys

// User submits: { "field_1": "a", "field_2": "b", ... "field_10000": "z" }
// Each field becomes a mapping
// 10000 users = 10 million mappings = DEAD

FIX:

- Disable dynamic mapping
- Use nested objects instead of dynamic keys
- Set index.mapping.total_fields.limit

    
    ---
    
    ## Refresh Interval vs Real-Time
    

EXPECTATION: Document indexed, immediately searchable
REALITY: Up to 1 second delay (refresh_interval)

VISIBLE BUG:

1. Create comment
1. Immediately search for it
1. Not found!

FIX:

- ?refresh=true on write (slow!)
- Set expectation in UI
- Use _id lookup instead of search

    
    ---
    
    ## Deep Pagination Disaster
    

QUERY: from: 10000, size: 10

INTERNAL: ES reads 10010 documents THEN skips 10000
COST: O(from + size) not O(size)

AT SCALE: from: 100000 = timeout/crash

FIX:

- search_after for deep pagination
- Limit from + size < 10000
- Use scroll API for exports

    
    ---
    
    ## Analyzer Mismatch
    

SYMPTOM: Exact terms dont match!

INDEX TIME: "iPhone 15" -> ["iphone", "15"]
SEARCH TIME: "iPhone15" -> ["iphone15"]

MISMATCH: No hit!

FIX: Ensure same analyzer for index and search
DEBUG: _analyze API to see tokens

    
    ---
    
    ## KUBERNETES PRODUCTION ISSUES
    
    > **The K8s problems that hit at 2am**
    
    ---
    
    ## Resource Limits Gotcha
    

SCENARIO:

limits:
memory: 512Mi
cpu: 500m

POD BEHAVIOR:

- Exceeds memory: KILLED (OOMKilled)
- Exceeds CPU: THROTTLED (not killed)

SUBTLE: CPU throttling looks like slow app
SYMPTOM: Response times spike, no errors

CHECK: kubectl top pods
FIX: Increase CPU limit or request

    
    ---
    
    ## Liveness Probe Suicide
    

BAD PROBE:

livenessProbe:
  httpGet:
path: /health
port: 3000
initialDelaySeconds: 5
periodSeconds: 5

PROBLEM: App takes 10 seconds to start
RESULT: Killed before ready, restart loop!

FIX: initialDelaySeconds > startup time
BETTER: Use startupProbe for slow starters

    
    ---
    
    ## Pod Affinity Hell
    

SYMPTOM: Pending pods, capacity available
CAUSE: Affinity rules unsatisfiable

COMMON TRAP:

- Require zone: us-east-1a
- Only us-east-1b has capacity

= Stuck forever

DEBUG: kubectl describe pod
LOOK FOR: "FailedScheduling"

    
    ---
    
    ## ConfigMap Propagation Delay
    

SCENARIO:

1. Update ConfigMap
1. Expect pods to use new config
1. Nothing happens!

REASON: Mounted ConfigMaps cached (TTL ~1 min)
WORSE: Pods dont auto-restart on change

FIX OPTIONS:

1. Restart pods manually
1. Use Reloader controller
1. Reference by hash in name

    
    ---
    
    ## Service Mesh Latency
    

HIDDEN COST:

Without mesh: Client -> Server
With mesh: Client -> Envoy -> Server -> Envoy -> Client

ADDED LATENCY: 2-5ms per hop
AT SCALE: 10 service calls = 50ms overhead

BEFORE ADOPTING:

- Measure baseline
- Consider if benefits > cost

    
    ---
    
    ## CACHING TRAPS
    
    > **The cache invalidation nightmares**
    
    ---
    
    ## Cache Key Collision
    

DISASTER SCENARIO:

cache.set(`user_${userId}`, userData);

// Different tenants, same userId!
// Tenant A sees Tenant B data!

FIX: Include all context in key
cache.set(`${tenantId}:user:${userId}`, userData);

    
    ---
    
    ## Negative Caching Poison
    

ATTACK:

1. Request nonexistent user_999999
1. Cache stores "null" with long TTL
1. User 999999 actually created
1. Cache serves null forever!

FIX:

- Short TTL for negative cache
- Invalidate on create
- Use separate keys for "does not exist"

    
    ---
    
    ## Stale Read After Write
    

SEQUENCE:

1. UPDATE database
1. DELETE cache
1. User immediately reads
1. Cache miss -> OLD value from replica!
1. Stale data cached again!

FIX:

- Read from primary after writes
- Cache-aside with write-through
- Accept eventual consistency

    
    ---
    
    ## Serialization Version Mismatch
    

SCENARIO:

v1: { name: "John" }
v2: { fullName: "John Doe" }

// Old cached data has "name"
// New code expects "fullName"
// CRASH!

FIX:

- Version in cache key
- Clear cache on deploy
- Backwards-compatible reads

    
    ---
    
    ## TTL Synchronization Storm
    

PROBLEM: All cache expires at same time

00:00 - Cache populated
01:00 - ALL keys expire
01:00 - ALL requests hit DB
01:00 - DB overloaded!

FIX: Random jitter on TTL
const ttl = BASE_TTL + random(0, JITTER);

    
    ---
    
    ## TYPESCRIPT SURPRISES
    
    > **The type system tricks that bite**
    
    ---
    
    ## Type Narrowing Reset
    

// BUG: Type narrowing lost in callback

| function process(value: string | null) { |
if (value === null) return;

// value is string here

setTimeout(() => {
// TypeScript thinks value might be null again!
// Because assignment could happen before callback
console.log(value.length); // Error in strict mode
}, 0);
}

FIX: const localValue = value; // Capture in const

    
    ---
    
    ## Object.keys Returns string[]
    

const obj = { a: 1, b: 2 } as const;
| const keys = Object.keys(obj); // string[], not ('a' | 'b')[] |

// THIS CRASHES if you trust types:
keys.forEach(k => console.log(obj[k])); // Error!

FIX: (Object.keys(obj) as (keyof typeof obj)[])
OR: Use Object.entries instead

    
    ---
    
    ## Excess Property Checking Workaround
    

interface User { name: string }

// Error: 'extra' does not exist
const user: User = { name: 'John', extra: true };

// No error! Fresh object check bypassed
const data = { name: 'John', extra: true };
const user2: User = data; // Works!

// Extra property silently included at runtime

    
    ---
    
    ## Enums Are Not Type-Safe
    

enum Status { Active = 0, Inactive = 1 }

function process(s: Status) {}

process(999); // No error! Any number accepted!

FIX: Use union types instead
| type Status = 'active' | 'inactive'; |

    
    ---
    
    ## Optional Chaining Precedence
    

// What you think:
obj.method?.()

// What happens with:
obj.method?.(arg).property
// Evaluates as: (obj.method?.(arg)).property
// NOT: obj.method?.((arg).property)

// If method returns undefined: Cannot read property of undefined!

FIX: Use parentheses or separate checks

    
    ---
    
    ## BUNDLER TRAPS
    
    > **The build issues that waste hours**
    
    ---
    
    ## Circular Dependency Crash
    

SYMPTOM: "Cannot read property of undefined"
But import clearly exists!

CAUSE: A imports B, B imports A
At runtime, one is undefined!

DEBUG: circular-dependency-plugin
FIX: Extract shared code to third module

    
    ---
    
    ## Tree Shaking Failure
    

EXPECTATION: Unused code removed
REALITY: Entire library included

CAUSES:

1. Side effects in module (import runs code)
1. Dynamic imports (import(variable))
1. Re-exports hiding dead code
1. CommonJS modules (no static analysis)

FIX: sideEffects: false in package.json
FIX: Use ESM imports

    
    ---
    
    ## Dev vs Prod Mismatch
    

WORKS IN DEV, BREAKS IN PROD:

1. Different chunking (code split differently)
1. Minified names (CSS classes change)
1. Missing env variables
1. Source paths different
1. Timing differences (no hot reload)

RULE: Test production build locally
npm run build && npm run preview

    
    ---
    
    ## CSS Ordering Issue
    

SYMPTOM: Styles work in dev, wrong in prod

CAUSE: CSS chunk order non-deterministic
a.css before b.css in dev
b.css before a.css in prod!

FIX:

- Higher specificity
- CSS Modules
- Explicit import order dependency

    
    ---
    
    ## Dynamic Import Path
    

// BROKEN: Cant be statically analyzed
const path = `./components/${name}`;
const Component = await import(path);

// Bundler doesnt know what to bundle!

// FIXED: Magic comment
const Component = await import(
/*webpackChunkName: "[request]"*/
  `./components/${name}`);```text

---

## DOCKER IN PRODUCTION

> **The container issues that break things**

---

## Alpine + Node.js DNS Issue

    
    SYMPTOM: DNS resolution fails randomly in Alpine
    CAUSE: Alpine uses musl libc, not glibc
    Different DNS resolver behavior
    
    DEBUG: Works in ubuntu, fails in alpine
    FIX:
    
    - Use node:20-slim (debian-based)
    - Set dns resolver options
    - RUN npm config set dns-result-order=ipv4first
    

---

## Layer Ordering Performance

    
    ## BAD: Any code change rebuilds npm install
    
    COPY . .
    RUN npm install
    
    ## GOOD: Dependencies cached separately
    
    COPY package*.json ./
    RUN npm install
    COPY . .
    
    ## EVEN BETTER: Multi-stage
    
    FROM node:20 AS deps
    COPY package*.json ./
    RUN npm ci
    
    FROM node:20
    COPY --from=deps /app/node_modules ./node_modules
    

---

## Zombie Processes

    
    SYMPTOM: Container memory grows forever
    CAUSE: Node.js doesnt forward signals to children
    
    // Spawned process becomes zombie
    exec('long-running-command');
    // Parent dies, child orphaned
    
    FIX:
    
    - Use --init flag (docker run --init)
    - Use dumb-init or tini as entrypoint
    - Handle SIGTERM properly
    

---

## Build Args vs Env Vars

    
    ## BUILD TIME: ARG
    
    ARG NODE_ENV
    RUN npm install # Uses ARG
    
    ## RUN TIME: ENV
    
    ENV API_URL=<<<<<<http://api>>>>>>
    CMD ["node", "index.js"] # Uses ENV
    
    COMMON MISTAKE:
    ARG API_URL  # Set at build time
    
    ## Cannot change without rebuild
    
    ## .dockerignore Forgotten
    

SYMPTOM: Build slow, context huge, secrets leaked

PROBLEM: Sending everything to daemon

- node_modules/
- .git/
- .env  # SECRETS!

.dockerignore MUST HAVE:
node_modules
.git
.env*
*.log
dist

    
    ---
    
    ## CRYPTO MISTAKES
    
    > **The cryptography errors that leak data**
    
    ---
    
    ## ECB Mode Pattern Leak
    

ECB encrypts blocks independently
Same plaintext -> Same ciphertext

VISIBLE IN:

- Images: Pattern still visible!
- Data: Identical blocks reveal structure

NEVER USE: AES-ECB for anything
ALWAYS USE: AES-GCM or AES-CBC with random IV

    
    ---
    
    ## IV Reuse Disaster
    

VULNERABILITY:

Same Key + Same IV = Predictable output

XOR attack can recover plaintext!

RULE: New random IV for every encryption
STORE: IV alongside ciphertext (not secret)

    
    ---
    
    ## Weak Random for Crypto
    

// INSECURE
Math.random() // Predictable!
Date.now() // Guessable!

// SECURE
crypto.randomBytes(32) // Node.js
crypto.getRandomValues() // Browser

RULE: If it affects security, use crypto random

    
    ---
    
    ## Timing Attack on Comparison
    

// VULNERABLE
if (userToken === secretToken) { ... }

// Attacker measures response time
// Correct characters = slightly slower comparison
// Character by character leak!

// SECURE
const a = Buffer.from(userToken);
const b = Buffer.from(secretToken);
crypto.timingSafeEqual(a, b);

    
    ---
    
    ## Password Hash Too Fast
    

// INSECURE: GPU can crack billions/second
crypto.createHash('sha256').update(password)

// SECURE: Intentionally slow
bcrypt.hash(password, 12);  // ~250ms
argon2.hash(password); // Configurable

RULE: Password hash MUST be slow

    
    ---
    
    ## NETWORK EDGE CASES
    
    > **The packet-level problems**
    
    ---
    
    ## TCP Keepalive vs HTTP Keepalive
    

DIFFERENT THINGS:

TCP Keepalive: OS-level, probes connection
HTTP Keep-Alive: Reuse connection for requests

COMMON CONFUSION:
"Keep-alive isnt working!"
Which one? Check both!

TCP: sysctl net.ipv4.tcp_keepalive_time
HTTP: Connection: keep-alive header

    
    ---
    
    ## Load Balancer Connection Reuse
    

SCENARIO:

LB -> Server A (connection pooled)
Server A dies
LB still sends to pooled connection
SILENT FAILURES

FIX:

- Health checks
- Connection timeouts
- Shorter keepalive

    
    ---
    
    ## NAT Timeout vs Keepalive
    

PROBLEM:

NAT gateway: Drops idle connections after X minutes
Server keepalive: Longer than X minutes
Client: Thinks connection alive
Server: Thinks connection alive
NAT: Connection forgotten!

RESULT: Silent black hole

FIX: Keepalive interval < NAT timeout
AWS NAT: 350 seconds

    
    ---
    
    ## TLS Cipher Mismatch
    

SYMPTOM: "No common cipher suites"

CAUSES:

1. Server only allows TLS 1.3
1. Client only supports TLS 1.2
1. Cipher suite intersection = empty

DEBUG:
openssl s_client -connect host:443 -tls1_2
openssl s_client -connect host:443 -tls1_3

    
    ---
    
    ## MTU Black Hole
    

SYMPTOM: Small requests work, large fail

CAUSE:

- Packet too big for network path
- ICMP "fragmentation needed" blocked
- Sender never knows to shrink packets

FIX:

- Test with different packet sizes
- Enable PMTUD (Path MTU Discovery)
- Reduce MSS if needed

    
    ---
    
    ## MICROSERVICES DISASTER PATTERNS
    
    > **The patterns that sink distributed systems**
    
    ---
    
    ## Distributed Monolith
    

SYMPTOMS:

- All services must deploy together
- Change to one breaks others
- Shared database
- Synchronous chains

YOU BUILT: Monolith with network calls
(worst of both worlds)

FIX: True service boundaries
Independent deployability
Async communication

    
    ---
    
    ## Chatty Services
    

PROBLEM:

For one user request:
Service A -> B (10ms)
Service B -> C (10ms)
Service C -> D (10ms)
Service A -> E (10ms)

TOTAL: 40ms network latency alone!

FIX:

- Batch calls
- Denormalize data
- Edge aggregation
- Async where possible

    
    ---
    
    ## Distributed Transaction Fail
    

ATTEMPT: Two-phase commit across services

Service A commits
Network fails
Service B rollback

RESULT: Inconsistent state!

REALITY: Distributed transactions dont work reliably

FIX:

- Saga pattern with compensation
- Eventual consistency
- Idempotent operations
- Accept partial success

    
    ---
    
    ## Service Discovery Stale
    

SCENARIO:

1. Service B instance dies
1. Discovery still lists it
1. Service A calls dead instance
1. Timeout + retry
1. Eventually hits healthy instance

USER EXPERIENCE: Random slow requests

FIX:

- Shorter TTL on discovery
- Health checks from client
- Circuit breaker per instance

    
    ---
    
    ## Correlated Failures
    

DISASTER:

Service A depends on B
Service B depends on C
C fails -> B calls timeout -> A calls timeout

ALL THREE APPEAR DOWN!

FIX:

- Timeouts on everything
- Circuit breakers
- Fallback responses
- Bulkhead isolation

    
    ---
    
    ## WEBSOCKET PRODUCTION ISSUES
    
    > **The real-time problems that only appear at scale**
    
    ---
    
    ## Connection Limit Per Server
    

LIMIT: ~65K connections per IP:port pair
REALITY: Memory runs out first (~30K typical)

SYMPTOM: New connections refused
CAUSE: File descriptor or memory exhaustion

CHECK: ulimit -n (file descriptors)
FIX: More servers, load balance connections

    
    ---
    
    ## Ping/Pong Missed
    

SCENARIO:

Browser: Thinks connection alive
Server: Connection dead (network change)
No traffic = nobody knows!

RESULT: Messages to dead connection = lost

FIX:

- Application-level ping/pong
- Both sides implement heartbeat
- Reconnection logic on client

    
    ---
    
    ## Message Ordering Lost
    

ASSUMPTION: Messages arrive in order
REALITY: With multiple servers, NO!

Server A sends msg1, msg2
Load balancer delivers msg2 first
Client gets wrong order!

FIX:

- Sequence numbers
- Client-side ordering
- Single server per session

    
    ---
    
    ## Reconnection Thunder
    

SCENARIO:

1. Server restarts
1. 10,000 clients reconnect simultaneously
1. Server overloaded immediately
1. Connections timeout
1. Retry -> MORE load
1. Cascade failure

FIX:

- Exponential backoff with jitter
- Connection rate limiting
- Graceful reconnection

    
    ---
    
    ## Memory Per Connection
    

EACH CONNECTION COSTS:

- Socket buffers: ~100KB
- Application state: varies
- Messages: unbounded!

10K connections * 100KB = 1GB minimum

UNBOUNDED DANGER:

- Slow client
- Messages queue
- Memory exhausts
- OOM crash

FIX: Per-connection message limits

    
    ---
    
    ## AUTHORIZATION EDGE CASES
    
    > **The permission checks everyone forgets**
    
    ---
    
    ## Horizontal Privilege Escalation
    

BAD:
GET /api/orders/123
// Only checks: is user logged in?
// Doesnt check: does user OWN order 123?

ATTACK:
User A: GET /api/orders/456  // User Bs order!

FIX:
const order = await getOrder(123);
if (order.userId !== currentUser.id) {
throw new ForbiddenError();
}

    
    ---
    
    ## IDOR in File Paths
    

BAD:
GET /files?path=user_1/doc.pdf

ATTACK:
GET /files?path=../user_2/doc.pdf  // Path traversal!
GET /files?path=user_2/doc.pdf  // Direct reference!

FIX:

- Dont use user input in paths
- Use opaque file IDs
- Verify ownership in DB

    
    ---
    
    ## Insecure Direct Object Reference
    

BAD:
DELETE /api/comments/789
// Checks: can user delete comments?
// Misses: can user delete THIS comment?

EVERY OPERATION must check:

1. Has permission for action type
1. Has permission for THIS resource

    
    ---
    
    ## Role Check At Wrong Layer
    

BAD:
// Only checked in UI
if (user.role === 'admin') {
  showDeleteButton();
}

// API has no check!
DELETE /api/users/123  // Anyone can call!

RULE: Authorization MUST be at API layer
UI is only for UX, not security

    
    ---
    
    ## JWT Role Cached
    

SCENARIO:

1. User gets JWT with role: "user"
1. Admin promotes to role: "admin"
1. User still has old JWT
1. JWT says "user" for next hour!

FIX:

- Short JWT lifetimes
- Fetch roles from DB on sensitive ops
- Immediate refresh mechanism

    
    ---
    
    ## LOGGING DISASTERS
    
    > **The observability fails that cost hours**
    
    ---
    
    ## Log Missing When Needed
    

DEBUG: Shows issue
INFO: Hides issue

PRODUCTION: INFO level
INCIDENT: Need DEBUG level
RESULT: Cant reproduce!

FIX:

- Critical paths: INFO level minimum
- Request IDs in all logs
- Dynamic log level changes
- Structured data over messages

    
    ---
    
    ## Log Explosion
    

SYMPTOM: 100GB logs per day, $$$$$

CAUSES:

- Logging in tight loops
- Full request/response bodies
- Verbose health checks
- Debug level in production

RULE: Log entries per request < 10
RULE: Never log in loops
RULE: Sample verbose logs

    
    ---
    
    ## PII in Logs
    

GDPR VIOLATION:

log.info("User registered", { email, password });

ALSO ILLEGAL:

- Credit card numbers
- Social security numbers
- Personal addresses
- Phone numbers

FIX: Redact at log source
Use log scrubbing
Audit log content

    
    ---
    
    ## Timestamp Without Timezone
    

LOG: 2024-01-15T10:00:00

SERVER: UTC
LOG VIEWER: Local time
CONFUSION: 5 hour gap in investigation!

FIX: Always include timezone
ISO 8601: 2024-01-15T10:00:00Z
Or: 2024-01-15T10:00:00+00:00

    
    ---
    
    ## Missing Request Context
    

BAD LOG:
"Database query failed"

GOOD LOG:
{
"msg": "Database query failed",
"requestId": "req-123",
"userId": "user-456",
"query": "findUser",
"duration": 5032,
"error": "timeout"
}

    
    ---
    
    ## DATABASE LOCKING NIGHTMARES
    
    > **The concurrency issues that break under load**
    
    ---
    
    ## Deadlock Spiral
    

Transaction A: Lock row 1, then lock row 2
Transaction B: Lock row 2, then lock row 1

BOTH WAITING FOREVER

DETECTION: Lock wait timeout exceeded
FIX: Always acquire locks in consistent order
Sort resources before locking

    
    ---
    
    ## Gap Lock Surprise (MySQL InnoDB)
    

QUERY: SELECT * FROM orders
WHERE status = 'pending'
FOR UPDATE;

LOCKS: Not just matching rows!
Locks GAPS between rows too!

RESULT: Inserts blocked unexpectedly

FIX: Precise WHERE clauses
Index on lock columns
Consider READ COMMITTED

    
    ---
    
    ## Advisory Lock Forgotten
    

PATTERN:
pg_advisory_lock(1234); // Acquired
// Process
// Exception thrown!
// Lock never released

CONNECTION HOLDS LOCK UNTIL CLOSED

FIX:
try {
  pg_advisory_lock(id);
// work
} finally {
  pg_advisory_unlock(id);
}

    
    ---
    
    ## Long Transaction Blocks Vacuum
    

SYMPTOM: Table size growing, queries slowing

Transaction started 2 hours ago
Holding onto old row versions
Vacuum cannot clean up!

DETECTION:
SELECT * FROM pg_stat_activity
WHERE state = 'idle in transaction';

FIX: statement_timeout, idle_in_transaction_timeout

    
    ---
    
    ## SELECT FOR UPDATE SKIP LOCKED
    

QUEUE PROCESSING TRAP:

Without SKIP LOCKED:
Worker 1: SELECT FOR UPDATE (gets row 1)
Worker 2: SELECT FOR UPDATE (WAITS on row 1!)

With SKIP LOCKED:
Worker 1: Gets row 1
Worker 2: Gets row 2 immediately!

ALWAYS USE for queue patterns:
SELECT * FROM jobs
WHERE status = 'pending'
FOR UPDATE SKIP LOCKED
LIMIT 1;

    
    ---
    
    ## PAYMENT INTEGRATION TRAPS
    
    > **The money bugs that cost real money**
    
    ---
    
    ## Double Charge on Retry
    

SCENARIO:

1. Charge request sent
1. Network timeout (charge succeeded!)
1. Code retries
1. Second charge succeeds
1. Customer charged twice

FIX: Idempotency keys (Stripe)
await stripe.charges.create({...}, {
idempotencyKey: `order-${orderId}`});```text

---

## Webhook Verification Skip

    BAD:
    app.post('/stripe-webhook', (req, res) => {
    processPayment(req.body); // Anyone can call this!
    });
    
    ATTACK: Attacker marks own order as paid!
    
    GOOD:
    const event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      webhookSecret
    );
    

---

## Currency Decimal Trap

    STORED: $10.00 as 10.00 (float)
    MATH: 10.00 * 3 = 29.9999999...
    SENT TO PAYMENT: $29.99
    CUSTOMER CHARGED: $29.99
    ORDER TOTAL: $30.00
    MISMATCH!
    
    FIX: Store and calculate in cents (integers)
    10.00 -> 1000 cents
    1000 * 3 = 3000 cents
    3000 -> $30.00
    

---

## Webhook Ordering Assumptions

    ASSUMPTION: Webhooks arrive in order
    
    charge.created (sent first)
    charge.succeeded (sent second)
    
    REALITY:
    charge.succeeded (arrives first)
    charge.created (arrives second)
    
    CODE BREAKS: "Charge doesn't exist yet!"
    
    FIX: Handle out-of-order events
    Create if not exists
    Idempotent handlers
    

---

## Refund After Settlement

    SCENARIO:
    Day 1: Charge created
    Day 3: Charge settled to bank
    Day 4: Refund requested
    
    PROBLEM: Refund returns LESS than charged
    (bank fees not refunded)
    
    USER ANGRY: "I paid $100, got back $97!"
    
    FIX: Document in refund policy
    Consider full refund from own funds
    

---

## AWAIT ANTIPATTERNS

> **The patterns that silently fail**

---

## Unhandled Promise Rejection

    // SILENT FAILURE
    async function process() {
    const data = await fetchData();
    // If this throws, nobody knows!
    }
    process(); // No await, no catch!
    
    // Application continues with corrupted state
    
    FIX:
    process().catch(console.error);
    // OR
    await process();
    // OR
    process.on('unhandledRejection', handler);
    

---

## Await in Loop

    // SLOW: Sequential execution
    for (const item of items) {
    await processItem(item); // Waits each time!
    }
    // 100 items * 100ms = 10 seconds!
    
    // FAST: Parallel
    await Promise.all(items.map(processItem));
    // 100ms total!
    
    // CONTROLLED: Limited concurrency
    import pLimit from 'p-limit';
    const limit = pLimit(5);
    await Promise.all(items.map(i => limit(() => processItem(i))));
    

---

## Try-Catch Misplacement

    // BROKEN: Catch doesnt cover async
    try {
      fetchData().then(process);
    } catch (e) {
    // NEVER CATCHES FETCH ERRORS!
    }
    
    // CORRECT
    try {
    await fetchData().then(process);
    } catch (e) {
    // Catches properly
    }
    

---

## Returning Inside Finally

    async function getValue() {
    try {
    return 'success';
    } finally {
    return 'finally'; // OVERWRITES!
      }
    }
    
    await getValue(); // 'finally' - NOT 'success'!
    

---

## Mixed Callbacks and Promises

    // BUG: Error lost
    function hybrid(callback) {
      doAsync()
    .then(result => callback(null, result))
    // Error never reaches callback!
    .catch(err => {/*swallowed!*/});
    }
    
    // FIX: Proper error forwarding
    function hybrid(callback) {
      doAsync()
    .then(result => callback(null, result))
    .catch(err => callback(err));
    }
    

---

## HTTP CLIENT TRAPS

> **The request failures that take hours to debug**

---

## Connection Pool Exhaustion 2

    SYMPTOM: Random timeouts under load
    
    CAUSE:
    
    - Default: 5 connections per host
    - 10 parallel requests
    - 5 wait for pool!
    
    // Node.js http
    const agent = new http.Agent({
    keepAlive: true,
    maxSockets: 50,  // Increase pool
    maxFreeSockets: 10,
    });
    

---

## Axios vs Fetch Default Timeout

    AXIOS: No timeout by default!
    Will wait forever
    
    FETCH: No timeout by default!
    Will wait forever
    
    BOTH NEED EXPLICIT TIMEOUT:
    
    // Axios
    axios.get(url, { timeout: 5000 });
    
    // Fetch
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);
    fetch(url, { signal: controller.signal });
    

---

## Response Body Not Consumed

    // LEAK: Response stream never read
    const response = await fetch(url);
    if (response.status !== 200) {
    return; // Body not consumed!
    }
    
    // Connection cant be reused
    // Pool exhaustion over time!
    
    FIX:
    if (response.status !== 200) {
    await response.text(); // Consume body
      return;
    }
    

---

## Content-Length Mismatch

    SYMPTOM: Partial data, truncation
    
    SERVER SAYS: Content-Length: 1000
    SERVER SENDS: 500 bytes
    
    CLIENT: May not notice!
    Depends on implementation
    
    FIX: Validate response body length
    Enable gzip (detects corruption)
    

---

## Retry Idempotency

    DANGEROUS:
    
    POST /orders  // Creates order
    Timeout
    Retry POST /orders  // CREATES DUPLICATE!
    
    SAFE TO RETRY:
    
    - GET, HEAD, OPTIONS (always)
    - PUT, DELETE (idempotent by design)
    - POST (only with idempotency key!)
    
    FIX:
    POST /orders
    Idempotency-Key: order-abc123
    

---

## JS PRODUCTION GOTCHAS

> **The patterns that break in production**

---

## ISR Stale During Deploy

    SCENARIO:
    
    1. ISR page cached with old content
    1. Deploy new version
    1. Cache still serves old page!
    1. Only refreshes after revalidate
    
    FIX:
    
    - On-demand revalidation
    - Purge CDN on deploy
    - Accept temporary staleness
    

---

## API Route Cold Start

    SYMPTOM: First API request slow
    
    CAUSE:
    
    - Serverless cold start
    - Database connection
    - Module loading
    
    MITIGATION:
    
    - Connection pooling
    - Warm-up endpoint
    - Edge runtime for fast routes
    

---

## Hydration Mismatch

    ERROR: Hydration failed because the initial UI
    does not match what was rendered on the server.
    
    COMMON CAUSES:
    
    1. Using Date.now() or Math.random()
    1. Browser-only APIs (localStorage, window)
    1. Different content for logged-in users
    1. CSS-in-JS libraries not configured
    
    FIX:
    // Wrap browser-only code
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);
    
    if (!isMounted) return null;
    return <ComponentUsingBrowserAPIs />;
    

---

## getServerSideProps Blocking

    SLOW PAGE:
    
    export async function getServerSideProps() {
    const user = await getUser();  // 100ms
    const products = await getProducts(); // 200ms
    const reviews = await getReviews();  // 150ms
    // TOTAL: 450ms (sequential!)
    }
    
    FAST PAGE:
    
    const [user, products, reviews] = await Promise.all([
      getUser(),
      getProducts(),
      getReviews()
    ]);
    // TOTAL: 200ms (parallel!)
    

---

## Image Optimization Limits

VERCEL LIMIT: 1000 images/month on free
SELF-HOSTED: Needs sharp, memory for resizing

SYMPTOMS:

- 429 errors
- Blurry images
- Timeouts

FIX:

- External image optimization (Cloudinary)
- Pre-generate sizes at build
- Increase Vercel plan

## PRODUCTION SECRETS MANAGEMENT

> **The credential handling that prevents breaches**

---

## Env File Committed

    DISASTER TIMELINE:
    
    1. .env committed to git
    1. Repo made public (or leaked)
    1. Secrets scraped by bots (minutes!)
    1. AWS bill: $50,000
    
    PREVENTION:
    
    - .gitignore: .env*
    - Pre-commit hook to check
    - Git history scrub if exposed
    

---

## Secrets in Docker Image

    BAD:
    ENV DATABASE_URL=postgres://user:pass@host
    
    IMAGE INSPECTION:
    | docker inspect image | grep DATABASE_URL |
    
    ## SECRET VISIBLE
    
    ALSO BAD: Build ARG for secrets
    
    FIX:
    
    - Runtime environment injection
    - Docker secrets
    - External secret manager
    
    ## Logging Secrets
    

COMMON ACCIDENTS:

console.log(config); // Includes API keys!
console.log(request); // Auth headers!
console.error(error); // Connection strings!

FIX:

- Redact sensitive fields
- Structured logging with filters
- Never log full objects

    
    ---
    
    ## Hardcoded in Frontend
    

VISIBLE:

const STRIPE_KEY = 'sk_live_abc123';

VIEW SOURCE: Anyone can see!
BUNDLE ANALYSIS: Easily extracted!

RULE: Public keys only in frontend
Secret keys: NEVER

    
    ---
    
    ## Rotation Without Downtime
    

CHALLENGE:

1. Generate new key
1. Deploy with new key
1. Old key still in use during rollout!
1. Invalidating old = downtime

FIX:

1. Deploy supporting BOTH keys
1. Switch to new key
1. Wait for all pods updated
1. Invalidate old key
1. Remove old key support

    
    ---
    
    ## QUEUE PROCESSING FAILURES
    
    > **The async job patterns that fail silently**
    
    ---
    
    ## Poison Message Loop
    

SCENARIO:

1. Message arrives
1. Processing throws
1. Message returned to queue
1. Immediately reprocessed
1. Throws again
1. INFINITE LOOP!

CPU: 100%
Other messages: BLOCKED

FIX:

- Dead letter queue after N retries
- Exponential backoff
- Error categorization (skip/retry)

    
    ---
    
    ## At-Least-Once Surprise
    

ASSUMPTION: Each message processed once
REALITY: At-least-once delivery!

CAUSES:

- Worker crashes after processing before ack
- Network issues
- Timeout before ack

RESULT: Duplicate processing

FIX: Idempotent handlers!

- Check if already processed
- Use unique message ID
- Dedupe in database

    
    ---
    
    ## Job Priority Starvation
    

SETUP:
High priority queue: 100 messages
Low priority queue: 10,000 messages

NAIVE APPROACH: Always check high first

PROBLEM: What if high priority never empty?
Low priority NEVER processed!

FIX:

- Weighted fair queuing
- Separate workers per priority
- Timeout on priority privilege

    
    ---
    
    ## Invisible Message After Crash
    

SCENARIO:

1. Worker takes message (invisible)
1. Worker crashes
1. Visibility timeout: 30 min
1. Message invisible for 30 min!
1. User waits 30 min for email!

FIX:

- Shorter visibility timeout
- Heartbeat to extend
- Dead letter quick for crashes

    
    ---
    
    ## Backpressure Ignored
    

PRODUCER: Adds 1000 jobs/sec
CONSUMER: Processes 100 jobs/sec

QUEUE GROWS: 10 million messages
MEMORY: Exhausted
SYSTEM: CRASH

FIX:

- Rate limit producers
- Queue length monitoring
- Backpressure signals
- Auto-scaling consumers

    
    ---
    
    ## LINUX PRODUCTION ISSUES
    
    > **The server-level problems that break apps**
    
    ---
    
    ## File Descriptor Exhaustion
    

SYMPTOM: "Too many open files"

PROCESS THINKS: Out of files
REALITY: Out of file descriptors

INCLUDES:

- Network sockets
- Database connections
- Open files
- Pipes

| CHECK: lsof -p <pid> | wc -l |
FIX: ulimit -n 65535
PERMANENT: /etc/security/limits.conf

    
    ---
    
    ## OOM Killer
    

SYMPTOM: Process randomly dies, no error log

CAUSE: Kernel killed it to free memory

| DETECTION: dmesg | grep -i "killed process" |

PREVENTION:

- Set memory limits in container
- Monitor memory usage
- Adjust OOM score: echo -17 > /proc/pid/oom_adj

    
    ---
    
    ## Ephemeral Port Exhaustion
    

SYMPTOM: "Cannot assign requested address"

CAUSE: Too many outbound connections
Ports 32768-60999 exhausted
TIME_WAIT takes 2 mins!

FIX:

- Connection pooling
- Reduce TIME_WAIT: sysctl net.ipv4.tcp_tw_reuse=1
- Increase range: net.ipv4.ip_local_port_range

    
    ---
    
    ## Disk Full Silent Failures
    

SCENARIO:

1. Log disk fills
1. App tries to log
1. Write fails silently
1. No logs during incident!

ALSO BREAKS:

- Database transactions
- File uploads
- Session storage

MONITORING: Alert at 80% disk
RESERVE: Leave 20% free always

    
    ---
    
    ## Clock Drift
    

SYMPTOM: Token validation fails, cache expires wrong

CAUSE: Server clock drifted

AT SCALE: Distributed systems confused
"This message from the future!"

FIX:

- NTP daemon always running
- Monitor clock skew
- Use chrony for VMs

    
    ---
    
    ## CD PIPELINE DISASTERS
    
    > **The deployment failures that break at the worst time**
    
    ---
    
    ## Cache Poisoning
    

SCENARIO:

1. Build fails, partially caches
1. Next build: uses poisoned cache
1. All builds fail mysteriously!

SYMPTOM: "Works on fresh build"

FIX:

- Cache key includes lockfile hash
- Clear cache on structural changes
- Version cache keys

    
    ---
    
    ## Flaky Tests Block Deploy
    

REALITY: Test passes 95% of time

AT SCALE: 100 tests, 95% each
95%^100 = 0.6% all pass!

RESULT: Pipeline almost never green

FIX:

- Quarantine flaky tests
- Retry mechanism
- Fix root cause (usually timing)

    
    ---
    
    ## Parallel Job Race Conditions
    

JOB A: Deploy to staging
JOB B: Run E2E tests

PROBLEM: B starts before A done!
SYMPTOMS: Random test failures

FIX:

- Explicit dependencies
- Wait for health check
- Sequential stages

    
    ---
    
    ## Secret in Build Logs
    

LEAK:
echo "Deploying with token: $SECRET"

## Visible in CI logs

ALSO LEAKING:

- Debug mode printing env
- Error messages with config
- npm install with token in URL

FIX:

- Secret masking in CI
- Never echo secrets
- Review log output

## Rollback Fails When Needed

    SCENARIO:
    
    1. Deploy breaks production
    1. "Just rollback!"
    1. Rollback includes DB migration
    1. Data incompatible with old code
    1. STUCK!
    
    FIX:
    
    - Backwards-compatible migrations
    - Database versioning
    - Tested rollback procedure
    - Feature flags for quick disable
    

---

## FINAL IMPOSSIBLE KNOWLEDGE DUMP

> **The patterns that separate seniors from juniors**

---

## Production Readiness Checklist

    BEFORE GO-LIVE:
    
    [ ] Health check endpoint
    [ ] Graceful shutdown handling
    [ ] Environment-based config
    [ ] Secrets not in code/logs
    [ ] Error handling + reporting
    [ ] Request logging with IDs
    [ ] Database connection pooling
    [ ] Timeout on all external calls
    [ ] Rate limiting on endpoints
    [ ] Input validation everywhere
    [ ] CORS configured correctly
    [ ] Security headers set
    [ ] SSL/TLS enforced
    [ ] Backup strategy tested
    [ ] Monitoring dashboard
    [ ] Alerting configured
    [ ] Runbook documented
    [ ] Load test completed
    [ ] Rollback plan ready
    

---

## Debug Order for Unknown Issues

    
    1. CAN YOU REPRODUCE?
    Yes -> Debug locally
    No -> Add logging, wait for next occurrence
    
    1. WHEN DID IT START?
    Recently -> Check recent deploys
    Always -> Deeper issue
    
    1. WHAT CHANGED?
    Code -> Git diff
    Infra -> Terraform diff
    Data -> Query for anomalies
    Traffic -> Load spike?
    
    1. WHO IS AFFECTED?
    Everyone -> Server-side issue
    Some users -> Client/network/data
    One user -> Their account/device
    
    1. ISOLATE VARIABLES
    Works in staging? -> Env diff
    Works for some? -> Data diff
    Works sometimes? -> Race condition
    

---

## The Hierarchy of Debugging

    FASTEST TO SLOWEST:
    
    1. Logs (seconds)
    1. Metrics (minutes)
    1. Add logging + wait (hours)
    1. Reproduce locally (hours)
    1. Add tracing (hours)
    1. Binary search git history (hours)
    1. Rubber duck explanation (helps!)
    1. Ask colleague (ego cost)
    1. Sleep on it (surprisingly effective)
    

---

## Incident Severity Matrix

    | Impact | Users | Response |
    |--------|-------|----------|
    | SEV1 | All users down | Immediate, all hands |
    | SEV2 | Major feature broken | Within 30 min |
    | SEV3 | Minor feature/subset | Within 4 hours |
    | SEV4 | Cosmetic/annoyance | Next business day |
    

---

## Experience Multipliers

    THINGS THAT MAKE YOU 10x:
    
    1. Master your tools (IDE, debugger, profiler)
    1. Read error messages COMPLETELY
    1. Check the obvious first
    1. Reproduce before fixing
    1. Understand the WHY not just WHAT
    1. Learn from every incident
    1. Write things down
    1. Ask questions early, not late
    

---

## RACE CONDITION FIXES

> **The concurrency bug patterns**

---

## Database Level Locks

    -- Pessimistic: Lock row during transaction
    SELECT * FROM products WHERE id = 1 FOR UPDATE;
    -- Other transactions wait
    
    -- Optimistic: Version checking
    UPDATE products
    SET quantity = quantity - 1, version = version + 1
    WHERE id = 1 AND version = 5;
    -- If 0 rows affected: conflict!
    

---

## Application Level Locks

    // Redis-based distributed lock
    async function acquireLock(key, ttl = 10000) {
    const lockKey = `lock:${key}`;
    const lockValue = crypto.randomUUID();
    
    const acquired = await redis.set(lockKey, lockValue, 'PX', ttl, 'NX');
    
    if (!acquired) return null;
    
    return {
    release: async () => {
    // Only release if we own it
    const current = await redis.get(lockKey);
    if (current === lockValue) {
    await redis.del(lockKey);
          }
        }
      };
    }
    

---

## Queue-Based Serialization

    // Process one at a time per user
    const queue = new Queue('user-actions');
    
    queue.process(async (job) => {
    // Jobs for same user processed serially
    await processAction(job.data);
    });
    
    // Add with user as group
    await queue.add(action, {
    group: { id: userId }
    });
    

---

## AUTH STATE MACHINE

> **The correct login/logout flow**

---

## Authentication States

    STATES:
    UNKNOWN -> Checking initial auth
    LOGGED_OUT -> No valid session
    LOGGING_IN -> Auth in progress
    LOGGED_IN -> Valid session
    LOGGING_OUT -> Logout in progress
    ERROR -> Auth failed
    
    TRANSITIONS:
      UNKNOWN:
    -> checkAuth() -> LOGGED_IN (has session)
    -> checkAuth() -> LOGGED_OUT (no session)
    
      LOGGED_OUT:
    -> login() -> LOGGING_IN
    
      LOGGING_IN:
    -> success -> LOGGED_IN
    -> failure -> ERROR
    
      LOGGED_IN:
    -> logout() -> LOGGING_OUT
    -> sessionExpired -> LOGGED_OUT
    
      ERROR:
    -> retry() -> LOGGING_IN
    -> dismiss() -> LOGGED_OUT
    

---

## Implementation

type AuthState =
| { status: 'unknown' } |
| { status: 'logged_out' } |
| { status: 'logging_in' } |
| { status: 'logged_in'; user: User } |
| { status: 'logging_out' } |
| { status: 'error'; error: Error }; |

function authReducer(state: AuthState, action: AuthAction): AuthState {
switch (action.type) {
case 'LOGIN_START':
return { status: 'logging_in' };
case 'LOGIN_SUCCESS':
return { status: 'logged_in', user: action.user };
case 'LOGIN_FAILURE':
return { status: 'error', error: action.error };
// ...
  }
}

## ENVIRONMENT VARIABLE GOTCHAS

> **The config mistakes that cause outages**

---

## Boolean Trap

    // WRONG: String comparison
    if (process.env.DEBUG) { // "false" is truthy!
    
    // RIGHT: Explicit check
    if (process.env.DEBUG === 'true') {
    
    // BETTER: Parse properly
    const debug = process.env.DEBUG === 'true'
    | | process.env.DEBUG === '1'; |
    

---

## Missing Variable Silent Fail

    // SILENT BUG:
    const dbUrl = process.env.DATABASE_URL;
    // undefined, but code continues!
    
    // FAIL FAST:
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error('DATABASE_URL is required');
    
    // BEST: Validation at startup
    import { z } from 'zod';
    const env = z.object({
    DATABASE_URL: z.string().url(),
    API_KEY: z.string().min(1)
    }).parse(process.env);
    

---

## Different in Docker

    LOCAL: .env file loaded
    DOCKER: .env file NOT in container!
    
    SYMPTOMS:
    
    - Works locally
    - Fails in container
    - "undefined" for all vars
    
    FIX:
    
    - docker-compose: env_file or environment
    - docker run: --env-file or -e
    

---

## Newline in Value

    
    ## .env file
    
    PRIVATE_KEY="-----BEGIN KEY-----
    fjsdfjsd
    -----END KEY-----"
    
    ## Problem: Many parsers break on newlines
    
    FIX: Base64 encode
    PRIVATE_KEY=LS0tLS1CRUdJTiBLRVktLS0tLQ==
    
    ## DEPENDENCY UPGRADE DISASTERS
    
    > **The upgrade patterns that break production**
    
    ---
    
    ## Major Version Trap
    

package.json: "lodash": "^4.0.0"

EXPECTATION: Only minor updates
REALITY: ^4.0.0 includes 4.17.21

MAJOR VERSION BREAKS:

- API changes
- Removed functions
- Different behavior

FIX:

- Lock files committed
- npm ci not npm install
- Test before deploy

    
    ---
    
    ## Transitive Dependency Nightmare
    

SCENARIO:

- You use library-a@2.0.0
- library-a depends on util@1.5.0
- util@1.6.0 released with bug
- npm install -> gets util@1.6.0
- YOUR app breaks!

FIX:

- Use npm ci
- Check npm audit
- Resolution overrides if needed

    
    ---
    
    ## Breaking in Minor Version
    

SEMANTIC VERSIONING ASSUMPTION:
Minor = backwards compatible

REALITY:

- Many libraries break in minor
- TypeScript types can break
- Behavioral changes

RULE:

- Read changelogs before upgrading
- Test thoroughly
- Upgrade one at a time

    
    ---
    
    ## Peer Dependency Hell
    

ERROR: npm WARN peer react@18 required

SCENARIO:

- Package A wants React 17
- Package B wants React 18
- Cant satisfy both!

FIX:

- Check compatibility before upgrading
- Use --legacy-peer-deps (temporary!)
- Wait for library updates

    
    ---
    
    ## COMMON DEBUGGING COMMANDS
    
    > **The commands that save hours**
    
    ---
    
    ## Docker
    

## View logs 2

docker logs -f container_name

## Shell into container 2

docker exec -it container_name sh

## Inspect container

docker inspect container_name

## List processes

docker top container_name

## View resource usage

docker stats

    
    ---
    
    ## Kubernetes
    
    spec:
    replicas: 3
      strategy:
    type: RollingUpdate
        rollingUpdate:
    maxUnavailable: 1
    maxSurge: 1
    
    ## Pod logs
    
    kubectl logs -f pod_name
    
    ## Previous pod logs
    
    kubectl logs pod_name --previous
    
    ## Describe (events, status)
    
    kubectl describe pod pod_name
    
    ## Shell into pod
    
    kubectl exec -it pod_name -- sh
    
    ## Port forward
    
    kubectl port-forward pod_name 3000:3000
    

---

## PostgreSQL

    -- Current queries
    SELECT * FROM pg_stat_activity;
    
    -- Long running queries
    SELECT pid, now() - pg_stat_activity.query_start AS duration, query
    FROM pg_stat_activity
    WHERE state = 'active' AND now() - query_start > interval '5 seconds';
    
    -- Kill query
    SELECT pg_cancel_backend(pid);
    SELECT pg_terminate_backend(pid);
    
    -- Table sizes
    SELECT relname, pg_size_pretty(pg_total_relation_size(relid))
    FROM pg_catalog.pg_statio_user_tables
    ORDER BY pg_total_relation_size(relid) DESC;
    

---

## TLS TROUBLESHOOTING

> **The certificate problems that cause outages**

---

## Common Certificate Errors

    ERR_CERT_DATE_INVALID
    -> Certificate expired
    -> Check expiry: openssl x509 -in cert.pem -noout -dates
    
    ERR_CERT_COMMON_NAME_INVALID
    -> Hostname mismatch
    -> Check CN and SANs match domain
    
    ERR_CERT_AUTHORITY_INVALID
    -> Self-signed or unknown CA
    -> Install intermediate certificates
    
    UNABLE_TO_VERIFY_LEAF_SIGNATURE
    -> Missing intermediate certificate
    -> Check certificate chain
    

---

## Debug Commands

    
    ## Check certificate details
    
    openssl s_client -connect example.com:443 -servername example.com
    
    ## View certificate chain
    
    openssl s_client -showcerts -connect example.com:443
    
    ## Check expiry
    
    | echo | openssl s_client -connect example.com:443 2>/dev/null | \ |
    openssl x509 -noout -dates
    
    ## Verify chain manually
    
    openssl verify -CAfile ca.pem -untrusted intermediate.pem cert.pem
    

---

## Certificate Order

    CORRECT ORDER in chain file:
    
    1. Your certificate (leaf)
    1. Intermediate certificate(s)
    1. Root certificate (optional)
    
    WRONG: Root first will fail!
    

---

## DATABASE SHARDING MISTAKES

> **The partitioning problems that hit at scale**

---

## Wrong Shard Key

    BAD KEY: auto-increment ID
    -> All recent writes to one shard
    -> Hot shard problem
    
    BAD KEY: country (for 90% US users)
    -> Uneven distribution
    
    GOOD KEY: user_id (uniform distribution)
    GOOD KEY: composite (tenant_id + timestamp)
    

---

## Cross-Shard Queries

    PROBLEM:
    SELECT * FROM orders WHERE created_at > '2024-01-01'
    
    If sharded by user_id: Query ALL shards!
    
    MITIGATION:
    
    - Design queries around shard key
    - Denormalize to avoid joins
    - Accept eventual consistency for analytics
    

---

## Resharding Nightmare

    STARTING: 4 shards
    GROWING: Need 8 shards
    PROBLEM:
    
    - Hash changes, data moves
    - Must copy while live
    - Hours of migration
    
    PREVENTION:
    
    - Start with more shards than needed
    - Use consistent hashing
    - Plan for growth
    

---

## DISTRIBUTED TRACING

> **The observability patterns for microservices**

---

## Core Concepts

    TRADITIONAL:
    Store current state
    UPDATE user SET balance = 100
    
    EVENT SOURCING:
    Store events that happened
    BalanceDebited { amount: 50 }
    BalanceCredited { amount: 150 }
    
    Current state = replay all events
    

---

## OpenTelemetry Setup

    import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
    import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
    import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
    
    const provider = new NodeTracerProvider();
    provider.addSpanProcessor(
    new SimpleSpanProcessor(new JaegerExporter())
    );
    provider.register();
    

---

## Best Practices 3

[ ] Add trace ID to all logs
[ ] Sample high-traffic endpoints
[ ] Include business context in spans
[ ] Set appropriate span names
[ ] Add error details to failed spans

## LOAD BALANCING STRATEGIES

> **The traffic distribution patterns**

---

## Algorithms

    ROUND ROBIN:
    Request 1 -> Server A
    Request 2 -> Server B
    Request 3 -> Server C
    Request 4 -> Server A
    Simple, even distribution
    
    WEIGHTED ROUND ROBIN:
    Server A (weight 3): Gets 3 requests
    Server B (weight 1): Gets 1 request
    For different server capacities
    
    LEAST CONNECTIONS:
    Route to server with fewest active connections
    Better for varying request durations
    
    IP HASH:
    Hash client IP to server
    Same client always hits same server
    Good for session affinity
    

---

## Health Checks

    
    ## ALB health check
    
    health_check:
    path: /health
    interval: 30
    timeout: 5
    healthy_threshold: 2
    unhealthy_threshold: 3
    

---

## Session Affinity

    STICKY SESSIONS:
    Cookie: AWSALB=xxx
    Same user -> same backend
    
    PROBLEMS:
    
    - Uneven load distribution
    - Rolling updates harder
    - Server failure loses state
    
    BETTER:
    
    - Externalize state (Redis)
    - JWT tokens (stateless)
    

---

## FEATURE FLAG PATTERNS

> **The controlled rollout patterns**

---

## Flag Types 2

RELEASE FLAGS:
Trunk-based development
Hide unfinished features
Short-lived (remove after launch)

EXPERIMENT FLAGS:
A/B testing
Measure impact
Data-driven decisions

OPS FLAGS:
Circuit breakers
Graceful degradation
Kill switches

PERMISSION FLAGS:
Feature entitlements
Premium features
Beta access

## Implementation 2

// Simple implementation
const flags = {
newCheckout: {
enabled: true,
percentage: 20,  // 20% of users
allowList: ['user_123', 'user_456']
  }
};

function isEnabled(flagName, userId) {
const flag = flags[flagName];
if (!flag.enabled) return false;
if (flag.allowList?.includes(userId)) return true;

// Percentage rollout (deterministic)
const hash = hashCode(userId + flagName);
return (hash % 100) < flag.percentage;
}

## Flag Lifecycle

    
    1. CREATE flag (disabled)
    1. ENABLE for internal users
    1. ROLLOUT to percentage
    1. INCREASE percentage gradually
    1. FULL rollout (100%)
    1. REMOVE flag from code
    1. DELETE flag definition
    

---

## EVENT SOURCING PATTERNS

> **The immutable event patterns**

---

## Core Concepts 2

TRADITIONAL:
Store current state
UPDATE user SET balance = 100

EVENT SOURCING:
Store events that happened
BalanceDebited { amount: 50 }
BalanceCredited { amount: 150 }

Current state = replay all events

## Event Store Structure

    CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    aggregate_id UUID NOT NULL,
    aggregate_type VARCHAR NOT NULL,
    event_type VARCHAR NOT NULL,
    event_data JSONB NOT NULL,
    metadata JSONB,
    version INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(aggregate_id, version)
    );
    
    -- Optimistic concurrency via version
    INSERT INTO events (aggregate_id, version, ...)
    VALUES (id, expected_version, ...);
    -- Fails if version already exists
    

---

## Projections

    EVENTS -> PROJECTION -> READ MODEL
    
    UserCreated { id, email }  -> users table
    UserNameChanged { id, name }  -> users table
    OrderPlaced { userId, ... }   -> orders table
    
    READ MODELS:
    
    - Optimized for queries
    - Can be rebuilt from events
    - Multiple projections per aggregate
    

---

## Snapshots

    PROBLEM: Millions of events = slow replay
    
    SOLUTION: Periodic snapshots
    Event 1-1000: Snapshot A (state at 1000)
    Event 1001-2000: Snapshot B
    
    REPLAY: Load snapshot + events since
    

---

## MEMORY LEAK DEBUGGING

> **The patterns for finding memory issues**

---

## Node.js Heap Snapshots

    // Take snapshot programmatically
    const v8 = require('v8');
    const fs = require('fs');
    
    function takeSnapshot() {
    const snapshotStream = v8.writeHeapSnapshot();
    console.log(`Heap snapshot written to ${snapshotStream}`);
    }
    
    // Take multiple snapshots over time
    // Compare in Chrome DevTools
    

---

## Common Leak Patterns

    // LEAK 1: Growing arrays
    const cache = [];
    app.get('/', (req, res) => {
    cache.push(req.body); // Never cleared!
    });
    
    // LEAK 2: Event listeners not removed
    setInterval(() => {
    emitter.on('data', handler); // Accumulates!
    }, 1000);
    
    // LEAK 3: Closures holding references
    function createHandler(bigData) {
    return function() {
    // bigData never garbage collected
        console.log('handling');
      };
    }
    

---

## Detection 2

## Monitor RSS over time

node --expose-gc app.js

## Force GC and check

global.gc();
console.log(process.memoryUsage().heapUsed);

## Use clinic.js

npx clinic doctor -- node app.js

    
    ---
    
    ## GRACEFUL DEGRADATION PATTERNS
    
    > **The resilience when things fail**
    
    ---
    
    ## Fallback Strategies
    

async function getProductRecommendations(userId) {
try {
// Primary: Personalized recommendations
return await recommendationService.getPersonalized(userId);
} catch (error) {
try {
// Fallback 1: Cached recommendations
return await cache.get(`recommendations:${userId}`);
} catch {
// Fallback 2: Generic popular items
return await cache.get('recommendations:popular');
    }
  }
}

    
    ---
    
    ## Feature Toggles for Degradation
    

const features = {
search: { enabled: true, fallback: 'basic' },
recommendations: { enabled: false, fallback: 'popular' },
realTimeUpdates: { enabled: true, fallback: 'poll' }
};

function getSearchResults(query) {
if (features.search.enabled) {
return elasticSearch.search(query);
} else {
// Basic database search
return db.products.findMany({
where: { name: { contains: query } }
    });
  }
}

    
    ---
    
    ## Load Shedding
    

const HIGH_LOAD_THRESHOLD = 0.8;

app.use((req, res, next) => {
const cpuLoad = os.loadavg()[0] / os.cpus().length;

if (cpuLoad > HIGH_LOAD_THRESHOLD) {
// Shed non-essential requests
if (req.path.startsWith('/api/analytics')) {
return res.status(503).json({
error: 'Service temporarily unavailable'
      });
    }
  }
  next();
});

    
    ---
    
    ## API ERROR HANDLING
    
    > **The production error patterns**
    
    ---
    
    ## Error Response Format 3
    
    interface ErrorResponse {
    error: {
    code: string;  // Machine-readable
    message: string;  // Human-readable
    details?: object;  // Additional context
    requestId: string;  // For support
    timestamp: string;  // When it happened
      };
    }
    
    // Example
    {
    "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
    "field": "email",
    "value": "not-an-email",
    "constraint": "email"
        },
    "requestId": "req-abc123",
    "timestamp": "2024-01-15T10:00:00Z"
      }
    }
    
    ## HTTP Status Codes 3
    
    400 Bad Request  - Client sent invalid data
    401 Unauthorized  - Authentication required
    403 Forbidden  - Authenticated but not allowed
    404 Not Found  - Resource doesn't exist
    409 Conflict  - State conflict (duplicate, etc)
    422 Unprocessable    - Validation failed
    429 Too Many  - Rate limited
    500 Internal Error   - Server bug
    502 Bad Gateway  - Upstream service failed
    503 Unavailable  - Temporarily down
    504 Gateway Timeout  - Upstream timeout
    
    ## Error Middleware
    

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
const requestId = req.id;

// Log full error internally
logger.error({ err, requestId });

// Return safe error to client
if (err instanceof ValidationError) {
return res.status(400).json(formatError(err, requestId));
  }

if (err instanceof NotFoundError) {
return res.status(404).json(formatError(err, requestId));
  }

// Generic error - don't leak internals
  res.status(500).json({
error: {
code: 'INTERNAL_ERROR',
message: 'An unexpected error occurred',
      requestId
    }
  });
});

    
    ---
    
    ## DEBUGGING IN PRODUCTION
    
    > **The patterns for investigating live issues**
    
    ---
    
    ## Remote Debugging Checklist
    

1. CHECK METRICS
- Error rate spike?
- Latency increase?
- Resource saturation?

1. CHECK LOGS
- Search by error code
- Filter by timeframe
- Look for patterns

1. CHECK RECENT CHANGES
- Deployments in last 24h?
- Config changes?
- Traffic patterns different?

1. CHECK DEPENDENCIES
- External service status?
- Database load?
- Network issues?

    
    ---
    
    ## Dynamic Log Levels
    

// Change log level without restart
const logLevel = new Map();

app.post('/admin/log-level', (req, res) => {
const { component, level } = req.body;
logLevel.set(component, level);
res.json({ success: true });
});

// In logging code
function shouldLog(component, level) {
| const configuredLevel = logLevel.get(component) |  | 'info'; |
return LEVELS[level] >= LEVELS[configuredLevel];
}

    
    ---
    
    ## Feature Flags for Debugging
    

// Enable verbose logging per request
app.use((req, res, next) => {
if (req.headers['x-debug-key'] === process.env.DEBUG_KEY) {
req.debug = true;
req.log = (...args) => console.log('[DEBUG]', ...args);
} else {
req.log = () => {};
  }
  next();
});

    
    ---
    
    ## WEBSOCKET PRODUCTION PATTERNS
    
    > **The real-time connection patterns**
    
    ---
    
    ## Connection Management
    

const connections = new Map();

wss.on('connection', (ws, req) => {
const userId = authenticateFromRequest(req);

// Store connection
connections.set(userId, ws);

ws.on('close', () => {
    connections.delete(userId);
  });

// Ping/pong for keepalive
ws.isAlive = true;
ws.on('pong', () => { ws.isAlive = true; });
});

// Check dead connections
setInterval(() => {
connections.forEach((ws, userId) => {
if (!ws.isAlive) {
      connections.delete(userId);
return ws.terminate();
    }
ws.isAlive = false;
    ws.ping();
  });
}, 30000);

    
    ---
    
    ## Scaling WebSockets 2
    
    PROBLEM: Multiple server instances
    
    SOLUTION: Redis Pub/Sub
    
    Server 1 <--> Redis <--> Server 2
    Clients Clients
    
    Each server:
    
    - Publishes messages to Redis
    - Subscribes to relevant channels
    - Forwards to local WebSocket clients
    
    ## Reconnection Strategy
    

class ReconnectingWebSocket {
constructor(url) {
this.url = url;
this.reconnectDelay = 1000;
this.maxDelay = 30000;
    this.connect();
  }

connect() {
this.ws = new WebSocket(this.url);

this.ws.onclose = () => {
setTimeout(() => {
this.reconnectDelay = Math.min(
this.reconnectDelay * 2,
        this.maxDelay
        );
        this.connect();
}, this.reconnectDelay);
    };

this.ws.onopen = () => {
this.reconnectDelay = 1000; // Reset on success
    };
  }
}

    
    ---
    
    ## CACHE INVALIDATION STRATEGIES 2
    
    >**The hardest problem in computer science**
    
    ## TTL-Based
    

// Simple: Expire after time
await redis.setex('user:1', 3600, JSON.stringify(user));

PROS:

- Simple to implement
- Eventual consistency guaranteed

CONS:

- Stale data until expiry
- Thundering herd on popular keys

    
    ---
    
    ## Write-Through
    

async function updateUser(id, data) {
// Update database
const user = await db.user.update({ where: { id }, data });

// Update cache immediately
await redis.setex(`user:${id}`, 3600, JSON.stringify(user));

return user;
}

PROS:

- Cache always fresh after writes
- No stale reads for updated data

CONS:

- Write latency increased
- Complex for multiple caches

    
    ---
    
    ## Event-Driven Invalidation
    

// On update
eventBus.emit('user.updated', { userId: id });

// Subscriber
eventBus.on('user.updated', async ({ userId }) => {
await redis.del(`user:${userId}`);
await redis.del(`user-permissions:${userId}`);
await redis.del(`user-sessions:${userId}`);
});

PROS:

- Decoupled invalidation
- Can invalidate related caches

CONS:

- Eventual consistency
- Need reliable event delivery

    
    ---
    
    ## Cache-Aside Pattern
    

async function getUser(id) {
// Check cache first
let user = await redis.get(`user:${id}`);
if (user) return JSON.parse(user);

// Miss: Load from database
user = await db.user.findUnique({ where: { id } });

// Populate cache
await redis.setex(`user:${id}`, 3600, JSON.stringify(user));

return user;
}

    
    ---
    
    ## ZERO DOWNTIME DEPLOYMENT
    
    > **The continuous delivery patterns**
    
    ---
    
    ## Rolling Update 2
    
    ## Kubernetes 2
    
    spec:
    replicas: 3
      strategy:
    type: RollingUpdate
        rollingUpdate:
    maxUnavailable: 1
    maxSurge: 1
    
    ## Process
    
    ## 1. Start new pod (4 total)
    
    ## 2. New pod healthy? Terminate old (3)
    
    ## 3. Repeat until all replaced
    

---

## Blue-Green

    BLUE (current): 100% traffic
    GREEN (new): 0% traffic
    
    Deploy to green
    Test green
    Switch traffic: BLUE 0%, GREEN 100%
    Keep blue as rollback
    

---

## Canary

    
    1. Deploy canary (1% traffic)
    1. Monitor metrics
    1. Increase to 10% if healthy
    1. Increase to 50% if healthy
    1. Full rollout to 100%
    1. Automatic rollback if error rate spikes
    

---

## Database Considerations

    RULE: Database changes must be backwards compatible
    
    1. Add nullable column (works with old code)
    1. Deploy new code (uses new column)
    1. Backfill data
    1. Make column required
    1. Remove old code paths
    1. Drop old columns
    

---

## TYPESCRIPT STRICT MODE PATTERNS

> **The type-safe coding patterns**

---

## Strict Mode Options

    {
    "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
      }
    }
    

---

## Type Guards

    // typeof
    | function process(value: string | number) { |
    if (typeof value === 'string') {
    return value.toUpperCase(); // string methods available
      }
    return value * 2; // number methods available
    }
    
    // in operator
    interface Dog { bark(): void; }
    interface Cat { meow(): void; }
    
    | function speak(pet: Dog | Cat) { |
    if ('bark' in pet) {
        pet.bark();
    } else {
        pet.meow();
      }
    }
    
    // Custom type guard
    function isUser(obj: unknown): obj is User {
    return typeof obj === 'object' && obj !== null && 'email' in obj;
    }
    

---

## Zod for Runtime Validation

    import { z } from 'zod';
    
    const UserSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    age: z.number().int().positive()
    });
    
    type User = z.infer<typeof UserSchema>;
    
    // Runtime validation + type inference
    const user = UserSchema.parse(unknownData);
    // user is now typed as User!
    

---

## PRODUCTION MONITORING CHECKLIST

> **The essential monitoring patterns**

---

## Golden Signals

    LATENCY:
    
    - P50, P95, P99 response times
    - By endpoint
    - Alert on degradation
    
    TRAFFIC:
    
    - Requests per second
    - By endpoint, status code
    - Compare to baseline
    
    ERRORS:
    
    - Error rate percentage
    - By type (4xx, 5xx)
    - Alert on spikes
    
    SATURATION:
    
    - CPU, memory, disk usage
    - Connection pool usage
    - Queue depths
    

---

## Alerting Rules 2

CRITICAL (Page immediately):

- Error rate > 5%
- P99 latency > 5s
- Service down

WARNING (Slack/ticket):

- Error rate > 1%
- P99 latency > 2s
- High CPU/memory

INFO (Dashboard only):

- Traffic anomalies
- Deployment events
- Dependency updates

## Dashboard Essentials

    [ ] Overview: Traffic, errors, latency
    [ ] Per-service: Resource usage, health
    [ ] Database: Queries, connections, replication
    [ ] External: API status, latency
    [ ] Business: Signups, orders, revenue
    [ ] Incidents: Active alerts, recent events
    

---

## FINAL PRODUCTION WISDOM

> **The lessons that save careers**

---

## The 3 AM Rule

    If a change can break production at 3 AM:
    
    1. Is there monitoring to detect it?
    1. Is there a runbook to fix it?
    1. Is there a rollback plan?
    
    If no to any: Dont deploy Friday evening.
    

---

## Deployment Checklist

    [ ] Tests pass locally
    [ ] CI/CD pipeline green
    [ ] Database migrations tested
    [ ] Feature flags configured
    [ ] Rollback plan documented
    [ ] Monitoring dashboards ready
    [ ] Alerts configured
    [ ] Team notified
    [ ] On-call aware
    

---

## When Things Break

    
    1. BREATHE
    1. Assess impact
    1. Communicate status
    1. Fix or rollback
    1. Monitor recovery
    1. Document incident
    1. Schedule postmortem
    1. Implement fixes
    

---

## Career-Saving Facts

    
    - Always have backups
    - Test your backups (or they dont exist)
    - Automate everything you do twice
    - Document while you remember
    - Push back on unreasonable timelines
    - Its okay to say "I dont know yet"
    - Production access should be audited
    - Never deploy drunk
    

---

## DEVELOPER TRUTH

> **The wisdom that LLMs cant generate**

"The best code is no code. The second best is code that someone else maintains."

---

## SERVERLESS EDGE FUNCTION GOTCHAS

> **The patterns that break at the edge**

---

## Cold Start Death Spiral

    PROBLEM: First request takes 5-10 seconds
    
    CAUSES:
    
    - Large bundle size
    - Too many dependencies
    - Database connection on cold start
    
    FIXES:
    
    1. Keep bundle under 1MB
    1. Use connection pooling (Prisma Data Proxy)
    1. Pre-warm with scheduled pings
    1. Split into smaller functions
    

---

## Memory Limit Exceeded

    SYMPTOM: Function crashes silently
    
    CAUSE: Exceeded 128MB/256MB limit
    
    FIX:
    
    1. Stream large files (dont load in memory)
    1. Paginate database queries
    1. Increase memory limit in config
    1. Move heavy processing to background
    

---

## Timeout Trap

    SYMPTOM: Function times out inconsistently
    
    CAUSE: Default timeout too short (3s)
    
    CHECK: Look for "Task timed out" in CloudWatch
    
    FIXES:
    
    1. Increase timeout (max 15 min for Lambda)
    1. Use Step Functions for long workflows
    1. Add timeouts to external calls
    
    // Always set timeout on external calls
    const response = await axios.get(url, {
    timeout: 5000  // 5 second timeout
    });
    

---

## Edge vs Serverless

    EDGE FUNCTION:
    
    - Location: CDN edge (fast)
    - Runtime: V8 (limited APIs)
    - No Node.js modules (fs, net, etc.)
    
    SERVERLESS:
    
    - Location: Single region
    - Runtime: Full Node.js
    - All APIs available
    

---

## JS PRODUCTION GOTCHAS 2

> **The patterns that break in production**

## Hydration Mismatch 2

ERROR: Hydration failed because the initial UI
does not match what was rendered on the server.

COMMON CAUSES:

1. Using Date.now() or Math.random()
1. Browser-only APIs (localStorage, window)
1. Different content for logged-in users
1. CSS-in-JS libraries not configured

FIX:
// Wrap browser-only code
const [isMounted, setIsMounted] = useState(false);
useEffect(() => setIsMounted(true), []);

if (!isMounted) return null;
return <ComponentUsingBrowserAPIs />;

## Dynamic Import Issues

    ERROR: Module not found (in production only)
    
    CAUSE: Dynamic import path not static
    
    // BAD - path resolved at runtime
    const Component = dynamic(() => import(`./components/${name}`));
    
    // GOOD - static path
    const ComponentA = dynamic(() => import('./components/A'));
    const ComponentB = dynamic(() => import('./components/B'));
    const components = { A: ComponentA, B: ComponentB };
    

---

## Image Optimization Limits 2

VERCEL LIMITS:

- Hobby: 1,000 images/month
- Pro: 5,000 images/month

SYMPTOMS:

- Images return 500 error
- Optimization disabled silently

FIX:

1. Use external CDN (Cloudinary)
1. Self-host images
1. Upgrade plan

## ISR Revalidation

    export async function getStaticProps() {
    const data = await fetchData();
    return {
    props: { data },
    revalidate: 60  // Revalidate every 60 seconds
      };
    }
    
    GOTCHA: First visitor after revalidation gets STALE page!
    The regeneration happens in background.
    
    For immediate update: Use on-demand revalidation
    await res.revalidate('/path');
    

---

## PRISMA PRODUCTION PATTERNS

> **The ORM patterns for scale**

---

## P2024 Connection Pool Exhaustion

    ERROR: Timed out fetching a new connection from the pool
    
    CAUSE: All connections in use, none available
    
    RECOGNITION KEYS:
    
    - P2024
    - connection pool
    - Timed out fetching
    
    FIX:
    
    1. Reduce connection limit
       DATABASE_URL="...?connection_limit=5"
    
    1. Use Prisma Data Proxy (serverless)
    datasource db {
    provider = "postgresql"
    url = env("DATABASE_URL")
    directUrl = env("DIRECT_URL")
       }
    
    1. Add connection pooler (PgBouncer)
    

---

## N+1 Query Problem

    // BAD - N+1 (1 query for users, N queries for posts)
    const users = await prisma.user.findMany();
    for (const user of users) {
    const posts = await prisma.post.findMany({
    where: { authorId: user.id }
      });
    }
    
    // GOOD - Single query with include
    const users = await prisma.user.findMany({
    include: { posts: true }
    });
    

---

## Transaction Patterns

    // Interactive transaction
    const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({ data: userData });
    const profile = await tx.profile.create({
    data: { ...profileData, userId: user.id }
      });
    return { user, profile };
    });
    
    // Sequential transaction (batch)
    const [user, post] = await prisma.$transaction([
    prisma.user.create({ data: userData }),
    prisma.post.create({ data: postData })
    ]);
    

---

## Soft Delete Pattern

    model Post {
    id Int  @id @default(autoincrement())
    title String
    deletedAt DateTime?
    }
    
    // middleware for auto-filtering
    prisma.$use(async (params, next) => {
    if (params.model === 'Post' && params.action === 'findMany') {
    params.args.where = {
          ...params.args.where,
    deletedAt: null
        };
      }
    return next(params);
    });
    

---

## TLS GOTCHAS

> **The HTTPS patterns that fail**

---

## Certificate Expiry

    SYMPTOM: NET::ERR_CERT_DATE_INVALID
    
    CAUSE: Certificate expired
    
    PREVENTION:
    
    1. Use auto-renewal (Let's Encrypt)
    1. Set up expiry monitoring
    1. Calendar reminder 30 days before
    
    CHECK EXPIRY:
    | echo | openssl s_client -connect example.com:443 2>/dev/null | \ |
    openssl x509 -noout -enddate
    

---

## Mixed Content 2

SYMPTOM: Some resources blocked in HTTPS

CAUSE: Loading HTTP resources on HTTPS page

FIX:

1. Use protocol-relative URLs: //example.com/image.jpg
1. Or always HTTPS: <<<<<<<https://example.com/image.jpg>>>>>>>
1. Add CSP header: upgrade-insecure-requests

<meta http-equiv="Content-Security-Policy"
      content="upgrade-insecure-requests">

## Certificate Chain Issues

    SYMPTOM: Works in browser, fails in API calls
    
    CAUSE: Intermediate certificate missing
    
    FIX:
    
    1. Include full chain in certificate file
    1. Order: Your cert Intermediate Root
    1. Verify: openssl s_client -connect host:443 -showcerts
    

---

## HSTS Preload Trap

    ONCE PRELOADED:
    
    - Cannot go back to HTTP
    - Takes months to remove
    - All subdomains forced to HTTPS
    
    BEFORE PRELOADING:
    [ ] All subdomains support HTTPS
    [ ] No plans to serve HTTP content
    [ ] Understand this is permanent
    

---

## GRAPHQL GOTCHAS

> **The patterns that break in production**

---

## N+1 Problem

    SYMPTOM: Slow GraphQL queries
    
    CAUSE: Each resolver makes separate DB call
    
    EXAMPLE:
    query {
    users {  # 1 query
    posts {  # N queries (one per user!)
    comments {  # N*M queries!
            author
          }
        }
      }
    }
    
    FIX: Use DataLoader
    
    const userLoader = new DataLoader(async (ids) => {
    const users = await db.user.findMany({
    where: { id: { in: ids } }
      });
    return ids.map(id => users.find(u => u.id === id));
    });
    
    // In resolver
    resolve: (post, args, { loaders }) => {
    return loaders.user.load(post.authorId);
    }
    

---

## Over-fetching Auth

    PROBLEM: Checking auth in every resolver = slow
    
    BEFORE:
    const resolvers = {
    Query: {
    users: (_, __, { user }) => {
    if (!user) throw new AuthError();  // Every query!
    return db.user.findMany();
        }
      }
    };
    
    AFTER: Use directive
    const typeDefs = `
    directive @auth on FIELD_DEFINITION
    
    type Query {
    users: [User!]! @auth
    publicPosts: [Post!]!  # No auth needed
      }
    `;
    
    // Auth handled at directive level once
    

---

## Query Complexity

    PROBLEM: Malicious deep queries
    
    query {
    users {
    friends {
    friends {
    friends {
    friends {  # Exponential!
            name
            }
            }
          }
        }
      }
    }
    
    FIX: Limit query depth/complexity
    
    import depthLimit from 'graphql-depth-limit';
    
    const server = new ApolloServer({
    validationRules: [depthLimit(5)]
    });
    

---

## POSTGRES PERFORMANCE GOTCHAS

> **The patterns that kill database performance**

---

## Missing Indexes 3

    SYMPTOM: Query takes 30 seconds
    
    CHECK:
    EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 123;
    
    OUTPUT:
    Seq Scan on orders  (cost=0..1000000)
    BAD! Full table scan
    
    FIX:
    CREATE INDEX CONCURRENTLY idx_orders_user
    ON orders(user_id);
    
    AFTER:
    Index Scan using idx_orders_user  (cost=0..10)
    GOOD! 1000x faster
    

---

## Index Bloat

    SYMPTOM: Index size growing, queries slowing
    
    CAUSE: High UPDATE/DELETE without VACUUM
    
    CHECK:
    SELECT pg_size_pretty(pg_relation_size('idx_name'));
    
    FIX:
    REINDEX INDEX CONCURRENTLY idx_name;
    -- Or schedule regular VACUUM
    

---

## Lock Contention

    SYMPTOM: Queries hang, transactions timeout
    
    CHECK:
    SELECT blocked_locks.pid AS blocked_pid,
    blocking_locks.pid AS blocking_pid
    FROM pg_catalog.pg_locks blocked_locks
    JOIN pg_catalog.pg_locks blocking_locks
    ON blocking_locks.locktype = blocked_locks.locktype;
    
    FIX:
    
    1. Use shorter transactions
    1. Use NOWAIT: SELECT FOR UPDATE NOWAIT
    1. Use advisory locks for app-level locking
    

---

## Connection Exhaustion

    SYMPTOM: "too many connections" error
    
    CAUSE: Connection pool too small or leaks
    
    CHECK:
    SELECT count(*) FROM pg_stat_activity;
    
    FIX:
    
    1. Use connection pooler (PgBouncer)
    1. Close connections properly
    1. Set connection timeout
    

---

## AWS LAMBDA GOTCHAS

> **The serverless patterns that bite you**

---

## Cold Start Hell

    SYMPTOM: First request takes 5+ seconds
    
    CAUSE: Lambda initializing new container
    
    FIXES:
    
    1. Provisioned Concurrency (costs $$)
    1. Keep functions small (< 50MB)
    1. Move init code outside handler
    1. Use SnapStart (Java)
    
    // BAD - Init inside handler
    export const handler = async () => {
    const db = await connectDB();  // Cold start hit!
    return db.query(...);
    };
    
    // GOOD - Init outside handler
    const db = connectDB();  // Runs once, reused
    export const handler = async () => {
    return (await db).query(...);
    };
    

---

## Timeout Trap 2

SYMPTOM: Function times out inconsistently

CAUSE: Default timeout too short (3s)

CHECK: Look for "Task timed out" in CloudWatch

FIXES:

1. Increase timeout (max 15 min for Lambda)
1. Use Step Functions for long workflows
1. Add timeouts to external calls

// Always set timeout on external calls
const response = await axios.get(url, {
timeout: 5000  // 5 second timeout
});

## Memory = CPU

    SECRET: Lambda CPU scales with memory
    
    128 MB = slow CPU
    1024 MB = 8x faster CPU
    Sometimes: More memory = faster = CHEAPER
    
    TEST: Same function at different memory levels
    
    - 128 MB: 10s execution = $0.002
    - 1024 MB: 1.5s execution = $0.0015 (cheaper!)
    

---

## VPC Cold Start

    SYMPTOM: 10-30 second cold starts
    
    CAUSE: Lambda in VPC needs ENI
    
    FIX: Use VPC Lambda only when necessary
    
    - Need RDS? Use RDS Proxy instead
    - Need internal service? Consider API Gateway private
    

---

## MONOREPO GOTCHAS

> **The patterns for multi-package repos**

---

## Dependency Hell

    SYMPTOM: "Cannot find module X" in production
    
    CAUSE: Hoisted dependencies not available
    
    FIX: Use workspace protocol
    
    // package.json
    {
    "dependencies": {
    "@myapp/shared": "workspace:*"  // Always use workspace version
      }
    }
    

---

## Build Order

    SYMPTOM: Build fails, "types not found"
    
    CAUSE: Packages built in wrong order
    
    FIX: Use Turborepo or Nx
    
    // turbo.json
    {
    "pipeline": {
    "build": {
    "dependsOn": ["^build"],  // Build dependencies first
    "outputs": ["dist/**"]
        }
      }
    }
    

---

## Circular Dependencies

    SYMPTOM: Maximum call stack or undefined imports
    
    CAUSE: A imports B, B imports A
    
    DETECTION:
    npx madge --circular src/
    
    FIX:
    
    1. Extract shared code to third package
    1. Use dependency injection
    1. Restructure imports
    

---

## Type Sharing

    // packages/shared/src/types.ts
    export interface User {
    id: string;
    email: string;
    }
    
    // packages/frontend/tsconfig.json
    {
    "compilerOptions": {
    "paths": {
    "@myapp/shared": ["../shared/src"]
        }
      },
    "references": [{ "path": "../shared" }]
    }
    

---

## GOTCHAS

> **The storage patterns that bite you**

---

## Presigned URL Pitfalls

    SYMPTOM: "SignatureDoesNotMatch" error
    
    CAUSE: Content-Type mismatch
    
    WHEN GENERATING:
    const command = new PutObjectCommand({
    ContentType: 'image/png'  // Must match upload!
    });
    
    WHEN UPLOADING:
    fetch(url, {
    headers: { 'Content-Type': 'image/png' }  // Must match!
    body: file
    });
    

---

## CORS Hell

    SYMPTOM: "No 'Access-Control-Allow-Origin' header"
    
    FIX: S3 CORS configuration
    {
    "CORSRules": [{
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["<https://myapp.com">],
    "ExposeHeaders": ["ETag"]
      }]
    }
    
    NOTE: Changes take 5-10 minutes to propagate!
    

---

## Cost Optimization

    PROBLEM: S3 costs exploding
    
    CHECKS:
    
    1. Are you using right storage class?
    - Frequent access Standard
    - Occasional Intelligent-Tiering
    - Rare Glacier
    
    1. Lifecycle rules enabled?
    - Delete after 30 days
    - Move to Glacier after 90 days
    
    1. Large file uploads?
    - Use multipart for files > 100MB
    - Abort incomplete multipart uploads
    
    COMMAND: aws s3api list-multipart-uploads --bucket BUCKET
    

---

## TERRAFORM GOTCHAS

> **The IaC patterns that cause outages**

---

## State Lock Timeout

    SYMPTOM: "Error acquiring the state lock"
    
    CAUSE: Previous run crashed, lock stuck
    
    FIX:
    terraform force-unlock LOCK_ID
    
    PREVENTION:
    
    - Use remote state with locking (S3 + DynamoDB)
    - Set timeout in backend config
    

---

## Count vs For_Each

    
    ## BAD: Count - index based (order matters)
    
    resource "aws_instance" "server" {
    count = length(var.names)
    name = var.names[count.index]
    }
    
    ## Remove item from middle DESTROYS everything after it
    
    ## GOOD: for_each - key based (order doesn't matter)
    
    resource "aws_instance" "server" {
    for_each = toset(var.names)
    name = each.value
    }
    
    ## Remove item only that item destroyed
    

---

## Drift Detection

    PROBLEM: Someone changed resource manually in console
    
    SYMPTOM: "Plan shows changes you didn't make"
    
    FIX:
    
    1. terraform refresh  # Update state from reality
    
    1. terraform plan  # See what actually differs
    
    1. Either:
    - Import: terraform import aws_s3_bucket.bucket bucket-name
    - Or let Terraform overwrite: terraform apply
    
    PREVENTION:
    
    - Lock down console access
    - Use CI/CD for all changes
    - Regular drift detection runs
    

---

## MEMORY LEAK DEBUGGING 2

> **The patterns for finding memory issues**

## Node.js Memory Leaks

    SYMPTOMS:
    
    - Memory usage grows over time
    - Process eventually crashes with OOM
    - Performance degrades
    
    COMMON CAUSES:
    
    1. Global variables accumulating data
    1. Event listeners not removed
    1. Closures holding references
    1. Timers not cleared
    

---

## Finding Leaks

    // Take heap snapshots
    const v8 = require('v8');
    const fs = require('fs');
    
    function dumpHeap() {
    const filename = `heap-${Date.now()}.heapsnapshot`;
    const snapshotStream = v8.writeHeapSnapshot(filename);
    console.log(`Heap snapshot written to ${snapshotStream}`);
    }
    
    // Monitor memory
    setInterval(() => {
    const used = process.memoryUsage();
      console.log({
    rss: Math.round(used.rss / 1024 / 1024) + 'MB',
    heap: Math.round(used.heapUsed / 1024 / 1024) + 'MB'
      });
    }, 10000);
    

---

## Common Fixes 2 2

// BAD: Global cache that grows forever
const cache = {};
function addToCache(key, value) {
cache[key] = value;  // Never cleaned!
}

// GOOD: Use LRU cache with max size
import LRU from 'lru-cache';
const cache = new LRU({ max: 500 });

// BAD: Event listener not removed
element.addEventListener('click', handler);
// Component unmounts, handler still attached!

// GOOD: Remove listener
useEffect(() => {
element.addEventListener('click', handler);
return () => element.removeEventListener('click', handler);
}, []);

## DATABASE MIGRATIONS GOTCHAS

> **The migration patterns that cause outages**

---

## Safe Migration Principles

    RULE 1: Always backwards compatible
    
    - Old code must work with new schema
    - Deploy schema, then deploy code
    
    RULE 2: No locks on big tables
    
    - Don't ALTER TABLE on millions of rows
    - Use pt-online-schema-change or gh-ost
    
    RULE 3: Small, atomic changes
    
    - One change per migration
    - Easy to rollback
    

---

## Adding NOT NULL Column

    -- BAD: Locks table, fails if data exists
    ALTER TABLE users ADD COLUMN status TEXT NOT NULL;
    
    -- GOOD: 3-step process
    -- Step 1: Add nullable column
    ALTER TABLE users ADD COLUMN status TEXT;
    
    -- Step 2: Backfill data
    UPDATE users SET status = 'active' WHERE status IS NULL;
    
    -- Step 3: Add constraint (after deploy)
    ALTER TABLE users ALTER COLUMN status SET NOT NULL;
    

---

## Renaming Column

    -- BAD: Breaks old code instantly
    ALTER TABLE users RENAME COLUMN name TO full_name;
    
    -- GOOD: 4-step process
    -- Step 1: Add new column
    ALTER TABLE users ADD COLUMN full_name TEXT;
    
    -- Step 2: Dual-write in code
    -- INSERT: write to both
    -- UPDATE: write to both
    -- SELECT: read from name (old)
    
    -- Step 3: Migrate data
    UPDATE users SET full_name = name WHERE full_name IS NULL;
    
    -- Step 4: Switch to reading new column
    -- Step 5: Drop old column (after full deploy)
    

---

## RDS PRODUCTION GOTCHAS

> **The AWS database traps**

---

## Connection Limits

    SYMPTOM: "too many connections" errors
    
    CAUSE: Lambda scaling = many connections
    
    FIX: Use RDS Proxy
    
    // Lambda handler
    import { RDSData } from '@aws-sdk/client-rds-data';
    
    // RDS Proxy handles connection pooling!
    const client = new RDSData({});
    

---

## Slow Queries

    SYMPTOM: Occasional query timeouts
    
    CHECK:
    
    1. Enable Performance Insights
    1. Check wait events:
    - IO:DataFileRead = need bigger instance
    - LWLock:BufferContent = need more memory
    - Lock:relation = app-level lock contention
    
    FIX:
    
    - Read replicas for read-heavy
    - Upgrade instance class
    - Better indexes
    

---

## Failover Gotchas

    SYMPTOM: App errors during failover
    
    CAUSE: DNS caching, connections not closed
    
    FIX:
    
    1. Use RDS Proxy (handles failover)
    1. Set DNS TTL low in app
    1. Implement connection retry logic
    
    // Connection retry
    const getConnection = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
    try {
    return await pool.getConnection();
    } catch (err) {
    if (i === retries - 1) throw err;
    await sleep(1000 * (i + 1));
        }
      }
    };
    

---

## NGINX GOTCHAS

> **The reverse proxy patterns**

---

## Client Max Body Size

    SYMPTOM: 413 Request Entity Too Large
    
    CAUSE: Default nginx limit is 1MB
    
    FIX:
    
    ## nginx.conf
    
    client_max_body_size 50M;
    
    ## Per location
    
    location /upload {
    client_max_body_size 100M;
    }
    

---

## Proxy Headers

    SYMPTOM: Backend sees wrong IP/protocol
    
    FIX: Forward headers
    location / {
    proxy_pass <http://backend;>
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    }
    

---

## WebSocket Upgrade

    SYMPTOM: WebSocket connections fail behind nginx
    
    FIX: Enable upgrade
    location /ws {
    proxy_pass <http://backend;>
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 86400;  # Long timeout for WS
    }
    

---

## Rate Limiting 2

    
    ## Define rate limit zone
    
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    server {
    location /api/ {
    limit_req zone=api burst=20 nodelay;
    limit_req_status 429;
    proxy_pass <http://backend;>
        }
    }
    

---

## DOCKER NETWORKING

> **The container communication patterns**

---

## Bridge Network (Default)

    
    ## docker-compose.yml
    
    services:
      app:
    build: .
        ports:
    
    - "3000:3000"
        networks:
    
    - mynetwork
    
      db:
    image: postgres:15
        networks:
    
    - mynetwork
    
    networks:
      mynetwork:
    driver: bridge
    

## Containers on same network can reach each other by service name

## app can connect to db:5432

    ---
    
    ## Host Network
    

## Uses host's network directly (Linux only)

    services:
      app:
network_mode: host

## No port mapping needed

    ---
    
    ## Common Issues 3
    
    SYMPTOM: Container can't reach other container
    
        CHECK:
    
    1. Same network? docker network inspect mynetwork
    1. Using service name? (not localhost)
    1. Container running? docker ps
    
    SYMPTOM: Host can't reach container
    
        CHECK:
    
    1. Port exposed? -p 3000:3000
    1. App binding to 0.0.0.0? (not 127.0.0.1)
    1. Firewall blocking?
    
    ## DNS Resolution
    

## Within Docker network

postgres://db:5432/mydb # Use service name

## From host

postgres://localhost:5432/mydb # Use localhost + mapped port

    ---
    
    ## AWAIT GOTCHAS
    
    > **The async patterns that cause bugs**
    
    ---
    
    ## Parallel vs Sequential
    

// BAD: Sequential (slow)
const user = await getUser(id);
const posts = await getPosts(id);
const comments = await getComments(id);
// Total: time(user) + time(posts) + time(comments)

// GOOD: Parallel (fast)
const [user, posts, comments] = await Promise.all([
  getUser(id),
  getPosts(id),
  getComments(id)
]);
// Total: max(time(user), time(posts), time(comments))

    ---
    
    ## Error Handling
    

// BAD: Missing error handling
async function getData() {
const data = await fetchData();  // If this throws, unhandled!
return data;
}

// GOOD: Try-catch
async function getData() {
try {
const data = await fetchData();
return data;
} catch (error) {
console.error('Failed to fetch:', error);
throw error;  // Re-throw or handle
  }
}

// For Promise.all - one failure = all fail
// Use Promise.allSettled for partial results
const results = await Promise.allSettled([
  fetchUser(),
  fetchPosts()
]);
// results = [{ status: 'fulfilled', value: user }, { status: 'rejected', reason: error }]

    ---
    
    ## forEach Doesn't Wait
    

// BAD: Doesn't work as expected
items.forEach(async (item) => {
await processItem(item);
});
console.log('Done'); // Logs before items are processed!

// GOOD: Use for...of
for (const item of items) {
await processItem(item);
}
console.log('Done'); // Actually done

// GOOD: Parallel processing
await Promise.all(items.map(item => processItem(item)));
console.log('Done');

    ---
    
    ## RATE LIMITING GOTCHAS
    
    > **The throttling patterns that fail**
    
    ---
    
    ## Client-Side Rate Limits
    

SYMPTOM: User gets infinite spinners

CAUSE: Client continues retrying on 429

FIX: Respect Retry-After header

    async function fetchWithRetry(url: string, retries = 3) {
    for (let i = 0; i < retries; i++) {
    const response = await fetch(url);
    
    if (response.status === 429) {
    | const retryAfter = response.headers.get('Retry-After') |  | '5'; |
    await sleep(parseInt(retryAfter) * 1000);
          continue;
        }
    
    return response;
      }
    throw new Error('Rate limited');
    }
    

---

## Distributed Rate Limiting

    SYMPTOM: Rate limit bypassed by hitting different servers
    
    CAUSE: Each server has own counter
    
    FIX: Use Redis for shared state
    

// Centralized in Redis
async function rateLimit(userId: string) {
const key = `ratelimit:${userId}`;
const count = await redis.incr(key);

if (count === 1) {
await redis.expire(key, 60);  // 1 minute window
  }

if (count > 100) {
throw new RateLimitError();
  }
}

    ---
    
    ## Burst Handling
    

PROBLEM: 100 req/min allows 100 in 1 second

SOLUTION: Token bucket or sliding window

// Token bucket: tokens refill gradually
// User has 10 tokens, uses 1 per request
// 1 token added every second
// Prevents bursts while allowing sustained load

    ---
    
    ## TLS GOTCHAS 2
    
    >**The HTTPS patterns that fail**
    
    ## Certificate Issues
    

SYMPTOM: "Your connection is not private"

CAUSES:

1. Expired certificate
1. Wrong domain on cert
1. Self-signed (not trusted)
1. Intermediate certs missing

CHECK:
openssl s_client -connect domain.com:443 -servername domain.com

FIX:

- Use Let's Encrypt for free certs
- Include full chain in server config
- Set up auto-renewal

    ---
    
    ## Mixed Content 3
    
    SYMPTOM: Some resources not loading on HTTPS
    
    CAUSE: HTTP resources on HTTPS page
    
        DETECTION:
    
    - Browser console shows "Mixed Content" errors
    
        FIX:
    // Use protocol-relative URLs
    <script src="//cdn.example.com/script.js"></script>
    
    // Or always HTTPS
    <script src="<<<<<<https://cdn.example.com/script.js">>>>>></script>>
    
    // CSP header to block insecure
    Content-Security-Policy: upgrade-insecure-requests
    
    ## HSTS
    

HTTP Strict Transport Security:

- Forces HTTPS for domain
- Browsers remember and auto-redirect

// Header
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

WARNING:

- Once set, can't easily undo
- All subdomains must support HTTPS
- Test with short max-age first

    ---
    
    ## QUEUE PROCESSING GOTCHAS
    
    > **The async job patterns that fail**
    
    ---
    
    ## Duplicate Processing
    

SYMPTOM: Same job processed multiple times

CAUSE: Worker crashed after processing but before ack

FIX: Make jobs idempotent

    // BAD: Not idempotent
    async function processOrder(job) {
    await chargeCard(job.data.amount);  // Might charge twice!
      job.ack();
    }
    
    // GOOD: Idempotent with check
    async function processOrder(job) {
    const { orderId } = job.data;
    
    // Check if already processed
    const order = await db.order.findUnique({ where: { id: orderId } });
    if (order.status === 'charged') {
    return job.ack();  // Already done
      }
    
    await chargeCard(order.amount);
    await db.order.update({
    where: { id: orderId },
    data: { status: 'charged' }
      });
    
      job.ack();
    }
    

---

## Dead Letter Queue

    SYMPTOM: Failed jobs disappear
    
    CAUSE: No retry or DLQ configured
    
    FIX: Configure DLQ
    

const queue = new Queue('orders', {
defaultJobOptions: {
attempts: 3,
backoff: {
type: 'exponential',
delay: 1000
    },
removeOnFail: {
count: 1000  // Keep last 1000 failed jobs
    }
  }
});

// Handle failed jobs
queue.on('failed', (job, err) => {
if (job.attemptsMade === 3) {
// Move to DLQ or alert
await deadLetterQueue.add('failed-order', job.data);
await alertOncall(`Job ${job.id} failed: ${err.message}`);
  }
});

    ---
    
    ## Memory Issues
    

SYMPTOM: Worker runs out of memory

CAUSE: Processing too many jobs concurrently

FIX: Limit concurrency and job size

    const worker = new Worker('heavy-jobs', processor, {
    concurrency: 5,  // Only 5 jobs at a time
    limiter: {
    max: 100,  // Max 100 jobs per minute
    duration: 60000
      }
    });
    

---

## PRISMA P2024: Connection Pool Exhaustion

**Source:** GitHub Issues #prisma, Prisma Documentation, Real production incidents

### The EXACT Error 5

    PrismaClientKnownRequestError:
    Timed out fetching a new connection from the connection pool.
    Please consider reducing the number of requests or increasing
    the `connection_limit` parameter.
    Error Code: P2024
    

### Real Incident Reports 2

- **GitHub Issue Pattern:** Workers hit P1001, web server hits P2024, server becomes unresponsive, requires restart
- **Prisma v6 Upgrade:** Users report connection pool exhaustion after upgrading, especially with `@prisma/adapter-mssql`
- **Serverless flood:** Each Lambda/Vercel function has own pool, multiplied connections exhaust DB

### KEYWORDS that trigger this 4

    P2024
    Timed out fetching
    connection pool
    connection_limit
    pool_timeout
    serverless connections
    too many clients already
    

### Real Fix From Production 2

    // CONNECTION STRING FIX (Prisma docs)
    DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=5&pool_timeout=10"
    
    // SERVERLESS FIX: Use Prisma Accelerate or PgBouncer
    // Don't create new PrismaClient every request
    // lib/prisma.ts
    import { PrismaClient } from '@prisma/client'
    
    const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
    
    | export const prisma = globalForPrisma.prisma |  | new PrismaClient() |
    
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
    

---

## Authentication Errors 2 2

| Error | Keyword Trigger | Root Cause | Fix |
|-------|-----------------|------------|-----|
| Auth session missing | `AuthSessionMissingError`, session null | Email link pre-fetched by provider | Add CAPTCHA, use redirect button |
| Database error email link | `AuthApiError database error` | Misconfigured user table | Check auth schema, user table |
| 500 auth errors | `500`, auth, SMTP | SMTP misconfigured or DB constraint | Check SMTP settings, DB logs |
| Email not authorized | `Email address cannot be used` | No SMTP configured (2024 change) | Configure custom SMTP server |

---

## SESSION COMPLETE: BRAIN CROSSED 10% 2

## Common Mistakes 2 2

### Adding NOT NULL without default 2

    -- DISASTER: Fails if table has data
    ALTER TABLE users ADD COLUMN status TEXT NOT NULL;
    
    -- SAFE: Add with default
    ALTER TABLE users ADD COLUMN status TEXT NOT NULL DEFAULT 'active';
    

---

### Changing column type 2

    -- RISKY: May fail or lose data
    ALTER TABLE orders ALTER COLUMN price TYPE INTEGER;
    
    -- SAFE: Add new column, migrate, drop old
    ALTER TABLE orders ADD COLUMN price_cents INTEGER;
    UPDATE orders SET price_cents = price * 100;
    ALTER TABLE orders DROP COLUMN price;
    

---

### Large table migration 2

    -- DANGEROUS: Locks table
    ALTER TABLE large_table ADD COLUMN new_col TEXT;
    
    -- SAFER: Create concurrently (PostgreSQL)
    CREATE INDEX CONCURRENTLY idx_new ON large_table(new_col);
    

---

## Best Practices 2 2

    [ ] Add trace ID to all logs
    [ ] Sample high-traffic endpoints
    [ ] Include business context in spans
    [ ] Set appropriate span names
    [ ] Add error details to failed spans
    

---

## Cannot change without rebuild 2

    
    ---
    
    ## SECRET VISIBLE 2
    
    ALSO BAD: Build ARG for secrets
    
    FIX:
    
    - Runtime environment injection
    - Docker secrets
    - External secret manager
    

---

## Visible in CI logs 2

ALSO LEAKING:

- Debug mode printing env
- Error messages with config
- npm install with token in URL

FIX:

- Secret masking in CI
- Never echo secrets
- Review log output

    
    ---
    
    ## Problem: Many parsers break on newlines 2
    
    FIX: Base64 encode
    PRIVATE_KEY=LS0tLS1CRUdJTiBLRVktLS0tLQ==
    

---

## Flag Types 2 2

    RELEASE FLAGS:
    Trunk-based development
    Hide unfinished features
    Short-lived (remove after launch)
    
    EXPERIMENT FLAGS:
    A/B testing
    Measure impact
    Data-driven decisions
    
    OPS FLAGS:
    Circuit breakers
    Graceful degradation
    Kill switches
    
    PERMISSION FLAGS:
    Feature entitlements
    Premium features
    Beta access
    

---

## Error Response Format 2 2

    interface ErrorResponse {
    error: {
    code: string;  // Machine-readable
    message: string;  // Human-readable
    details?: object;  // Additional context
    requestId: string;  // For support
    timestamp: string;  // When it happened
      };
    }
    
    // Example
    {
    "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
    "field": "email",
    "value": "not-an-email",
    "constraint": "email"
        },
    "requestId": "req-abc123",
    "timestamp": "2024-01-15T10:00:00Z"
      }
    }
    

---

## HTTP Status Codes 2 2

    400 Bad Request  - Client sent invalid data
    401 Unauthorized  - Authentication required
    403 Forbidden  - Authenticated but not allowed
    404 Not Found  - Resource doesn't exist
    409 Conflict  - State conflict (duplicate, etc)
    422 Unprocessable    - Validation failed
    429 Too Many  - Rate limited
    500 Internal Error   - Server bug
    502 Bad Gateway  - Upstream service failed
    503 Unavailable  - Temporarily down
    504 Gateway Timeout  - Upstream timeout
    

---

## Scaling WebSockets 2 2

    PROBLEM: Multiple server instances
    
    SOLUTION: Redis Pub/Sub
    
    Server 1 <--> Redis <--> Server 2
    | |
    Clients Clients
    
    Each server:
    
    - Publishes messages to Redis
    - Subscribes to relevant channels
    - Forwards to local WebSocket clients
    

---

## Rolling Update 2 2

    
    ## Alerting Rules 2 2
    

CRITICAL (Page immediately):

- Error rate > 5%
- P99 latency > 5s
- Service down

WARNING (Slack/ticket):

- Error rate > 1%
- P99 latency > 2s
- High CPU/memory

INFO (Dashboard only):

- Traffic anomalies
- Deployment events
- Dependency updates

    
    ---
    
    ## Mixed Content 2 2
    

SYMPTOM: Some resources not loading on HTTPS

CAUSE: HTTP resources on HTTPS page

DETECTION:

- Browser console shows "Mixed Content" errors

FIX:
// Use protocol-relative URLs
<script src="//cdn.example.com/script.js"></script>

// Or always HTTPS
<script src="<<https://cdn.example.com/script.js">>></script>

// CSP header to block insecure
Content-Security-Policy: upgrade-insecure-requests

    ---
    
    ## Remove item from middle DESTROYS everything after it 2
    
    ## Common Issues 2 2
    

SYMPTOM: Container can't reach other container

CHECK:

1. Same network? docker network inspect mynetwork
1. Using service name? (not localhost)
1. Container running? docker ps

SYMPTOM: Host can't reach container

CHECK:

1. Port exposed? -p 3000:3000
1. App binding to 0.0.0.0? (not 127.0.0.1)
1. Firewall blocking?

    ---
    
