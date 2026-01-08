# Phase 1: Project Analysis

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Steps](#steps)
- [Phase 2: Environment Integration](#phase-2-environment-integration)
- [Mapping Examples](#mapping-examples)
- [Phase 3: Checklist Generation](#phase-3-checklist-generation)
- [Auto-Generated Checklists](#auto-generated-checklists)
- [When to Add New Domain](#when-to-add-new-domain)
- [Tier 1: Always Include (Core)](#tier-1-always-include-core)
- [Tier 2: Usually Include (Common)](#tier-2-usually-include-common)
- [Tier 3: Specialized (As Needed)](#tier-3-specialized-as-needed)
- [Tier 4: Niche (Rare)](#tier-4-niche-rare)
- [TypeScript/JavaScript](#typescriptjavascript)
- [Python](#python)
- [Step 2: Cross-Cutting Verification](#step-2-cross-cutting-verification)
- [Step 3: Pre-Deploy Checklist](#step-3-pre-deploy-checklist)
- [Step 1: Symptom Matching](#step-1-symptom-matching)
- [Step 2: Root Cause Investigation](#step-2-root-cause-investigation)
- [Step 3: Fix Application](#step-3-fix-application)
- [LLM/Agent Integration Prompt](#llmagent-integration-prompt)
- [Adaptation Prompt Template](#adaptation-prompt-template)
- [For BRAIN Section](#for-brain-section)

## Steps

1. **Identify Tech Stack**

- Frontend: React/Vue/Svelte/Angular/Vanilla

- Backend: Node/Python/Go/Rust/Java

- Database: PostgreSQL/MongoDB/MySQL/Redis

- Hosting: Vercel/AWS/GCP/Azure/Cloudflare

1. **Identify Domains**

- From 22 available domains, select relevant ones

- Core domains (always needed): Frontend, Backend, Database, Testing, Security, DevOps

- Specialized domains (project-specific): Choose from remaining 16

1. **Generate Project-Specific Vault**

- Extract relevant patterns from universal vault

- Add project-specific configurations

- Create decision trees for this tech stack

## Phase 2: Environment Integration

Universal Patterns → Tech Stack Mapping → Local Configuration → Verified Setup

## Mapping Examples

| Universal Pattern | Next.js Implementation | FastAPI Implementation |

| Auth middleware | `middleware.ts`+ next-auth | `Depends()`+ FastAPI-users |

| API routes | `app/api/[...]/route.ts` | `@router.get("/...")` |

| Database access | Prisma Client | SQLAlchemy + Alembic |

| Caching | ISR + Redis | Redis + FastAPI-cache |

| Validation | Zod schemas | Pydantic models |

## Phase 3: Checklist Generation

Project Domains → Pre-deploy Checklist → Post-deploy Monitoring → Runbook

## Auto-Generated Checklists

For **Next.js + Prisma + Vercel**project:

- [ ] Run`prisma generate` before build

- [ ] Check ISR cache invalidation

- [ ] Verify Edge Functions limits

- [ ] Test middleware chain order

- [ ] Validate environment variables

- [ ] Check Prisma connection pooling for serverless

For**FastAPI + PostgreSQL + AWS** project:

- [ ] Run Alembic migrations

- [ ] Check connection pool settings

- [ ] Verify Lambda cold start handling

- [ ] Test API Gateway timeouts

- [ ] Validate secrets in AWS Secrets Manager

- [ ] Check Pydantic model serialization

## When to Add New Domain

Add a new domain when:

1. Project requires specialized knowledge not in existing 22 domains

2. The domain has at least 10+ patterns unique to it

3. The patterns cannot be merged into existing domains

## Tier 1: Always Include (Core)

- Frontend, Backend, Database, DevOps, Security, Testing

## Tier 2: Usually Include (Common)

- System Design, Cloud, Mobile

## Tier 3: Specialized (As Needed)

- Payments, Search, Real-time, ML/AI, Blockchain, IoT, VR/AR

## Tier 4: Niche (Rare)

- Climate, Legal Docs, Localization, Ancient Wisdom, Investment

## TypeScript/JavaScript

npm run typecheck

npm run lint

npm run test

## Python

mypy .

ruff check .

    pytest

## Step 2: Cross-Cutting Verification

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

## Step 3: Pre-Deploy Checklist

[ ] All tests pass

[ ] No TypeScript/lint errors

[ ] Environment variables set

[ ] Database migrations run

[ ] Secrets verified

[ ] Rollback plan ready

## Step 1: Symptom Matching

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

## Step 2: Root Cause Investigation

Symptom → Check logs → Check network → Check database → Check code

## Step 3: Fix Application

Root Cause → Pattern Match → Apply Fix → Verify → Document

## LLM/Agent Integration Prompt

When an LLM/Agent receives this Dev Vault, it should:

1. ANALYZE the project structure

2. IDENTIFY the tech stack

3. SELECT relevant domains from the 22 available

4. EXTRACT patterns applicable to this project

5. GENERATE project-specific checklists

6. CREATE decision trees for common errors

7. MONITOR for issues matching known patterns

8. APPLY fixes with verification protocols

## Adaptation Prompt Template

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

## For BRAIN Section

The BRAIN should adapt similarly:

1. Absorb universal decision trees

2. Map to project-specific technologies

3. Generate quick-reference flows for this project

4. Create project-specific root cause maps

*This guide ensures the Dev Vault transforms from universal knowledge to project-specific intelligence, making any LLM/Agent using it capable of senior developer-level troubleshooting.*
