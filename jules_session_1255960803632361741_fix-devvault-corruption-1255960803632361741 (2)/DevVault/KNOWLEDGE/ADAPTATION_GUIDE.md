# Dev Vault Adaptation Guide

> **Purpose**: This guide enables the Dev Vault to adapt to ANY project, transforming universal knowledge into project-specific intelligence.

---

## Adaptation Process

## Phase 1: Project Analysis

```text

Project → Tech Stack Detection → Domain Identification → Relevant Patterns

```text

### Steps

1. **Identify Tech Stack**

   * Frontend: React/Vue/Svelte/Angular/Vanilla

   * Backend: Node/Python/Go/Rust/Java

   * Database: PostgreSQL/MongoDB/MySQL/Redis

   * Hosting: Vercel/AWS/GCP/Azure/Cloudflare

2. **Identify Domains**

   * From 22 available domains, select relevant ones

   * Core domains (always needed): Frontend, Backend, Database, Testing, Security, DevOps

   * Specialized domains (project-specific): Choose from remaining 16

3. **Generate Project-Specific Vault**

   * Extract relevant patterns from universal vault

   * Add project-specific configurations

   * Create decision trees for this tech stack

## Phase 2: Environment Integration

```text

Universal Patterns → Tech Stack Mapping → Local Configuration → Verified Setup

```text

### Mapping Examples

| Universal Pattern | Next.js Implementation | FastAPI Implementation |

|-------------------|------------------------|------------------------|

| Auth middleware | `middleware.ts` + next-auth | `Depends()` + FastAPI-users |

| API routes | `app/api/[...]/route.ts` | `@router.get("/...")` |

| Database access | Prisma Client | SQLAlchemy + Alembic |

| Caching | ISR + Redis | Redis + FastAPI-cache |

| Validation | Zod schemas | Pydantic models |

## Phase 3: Checklist Generation

```text

Project Domains → Pre-deploy Checklist → Post-deploy Monitoring → Runbook

```text

### Auto-Generated Checklists

For **Next.js + Prisma + Vercel** project:

* [ ] Run `prisma generate` before build

* [ ] Check ISR cache invalidation

* [ ] Verify Edge Functions limits

* [ ] Test middleware chain order

* [ ] Validate environment variables

* [ ] Check Prisma connection pooling for serverless

For **FastAPI + PostgreSQL + AWS** project:

* [ ] Run Alembic migrations

* [ ] Check connection pool settings

* [ ] Verify Lambda cold start handling

* [ ] Test API Gateway timeouts

* [ ] Validate secrets in AWS Secrets Manager

* [ ] Check Pydantic model serialization

---

## Domain Adaptation Rules

## When to Add New Domain

Add a new domain when:

1. Project requires specialized knowledge not in existing 22 domains

2. The domain has at least 10+ patterns unique to it

3. The patterns cannot be merged into existing domains

## Domain Priority Tiers

### Tier 1: Always Include (Core)

* Frontend, Backend, Database, DevOps, Security, Testing

### Tier 2: Usually Include (Common)

* System Design, Cloud, Mobile

### Tier 3: Specialized (As Needed)

* Payments, Search, Real-time, ML/AI, Blockchain, IoT, VR/AR

### Tier 4: Niche (Rare)

* Climate, Legal Docs, Localization, Ancient Wisdom, Investment

---

## Vaccine System Integration

## Pre-Deployment Verification Protocol

### Step 1: Static Analysis

```bash

## TypeScript/JavaScript

npm run typecheck

npm run lint

npm run test

## Python

mypy .

ruff check .

pytest

```text

### Step 2: Cross-Cutting Verification

```text

If changed: AUTH

  → Verify: Protected routes

  → Verify: API middleware

  → Verify: Token refresh

  → Verify: Session handling

If changed: DATABASE_SCHEMA

  → Verify: Migrations

  → Verify: Seed data

  → Verify: Foreign keys

  → Verify: Indexes

If changed: API_ROUTES

  → Verify: Auth middleware

  → Verify: Rate limiting

  → Verify: Input validation

  → Verify: Error handling

```text

### Step 3: Pre-Deploy Checklist

```text

[ ] All tests pass

[ ] No TypeScript/lint errors

[ ] Environment variables set

[ ] Database migrations run

[ ] Secrets verified

[ ] Rollback plan ready

```text

---

## Injection System Integration

## Error Response Protocol

### Step 1: Symptom Matching

```text

Error: "ECONNREFUSED"

  → Database not running

  → Wrong host/port

  → Firewall blocking

  → Connection pool exhausted

Error: "Invalid token"

  → Token expired

  → Wrong algorithm

  → Secret mismatch

  → Token malformed

Error: "hydration mismatch"

  → Server/client state differ

  → Date/time issues

  → Dynamic content in SSR

  → Browser extensions

```text

### Step 2: Root Cause Investigation

```text

Symptom → Check logs → Check network → Check database → Check code

```text

### Step 3: Fix Application

```text

Root Cause → Pattern Match → Apply Fix → Verify → Document

```text

---

## LLM/Agent Integration Prompt

When an LLM/Agent receives this Dev Vault, it should:

```text

1. ANALYZE the project structure

2. IDENTIFY the tech stack

3. SELECT relevant domains from the 22 available

4. EXTRACT patterns applicable to this project

5. GENERATE project-specific checklists

6. CREATE decision trees for common errors

7. MONITOR for issues matching known patterns

8. APPLY fixes with verification protocols

```text

## Adaptation Prompt Template

```text

You are using Dev Vault for project: [PROJECT_NAME]

Tech Stack: [TECH_STACK]

Relevant Domains: [DOMAINS]

When you encounter errors:

1. Match symptoms to root cause patterns in Dev Vault

2. Apply the INJECTION fix

3. Verify with the test protocol

Before deployments:

1. Run the VACCINE checklist for this tech stack

2. Verify all cross-cutting concerns

3. Confirm rollback plan

```text

---

## For BRAIN Section

The BRAIN should adapt similarly:

1. Absorb universal decision trees

2. Map to project-specific technologies

3. Generate quick-reference flows for this project

4. Create project-specific root cause maps

---

*This guide ensures the Dev Vault transforms from universal knowledge to project-specific intelligence, making any LLM/Agent using it capable of senior developer-level troubleshooting.*
