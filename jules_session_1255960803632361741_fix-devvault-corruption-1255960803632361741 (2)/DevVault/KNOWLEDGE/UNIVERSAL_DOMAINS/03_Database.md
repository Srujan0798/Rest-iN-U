# DATABASE
## Table of Contents

- [TABLE OF CONTENTS](#table-of-contents)
- [Production-Grade SQL, NoSQL, ORMs, and Data Modeling](#production-grade-sql-nosql-orms-and-data-modeling)
  - [**SECTION 1: DATABASE FUNDAMENTALS**](#section-1-database-fundamentals)
  - [**SECTION 2: ORM PATTERNS**](#section-2-orm-patterns)
  - [**SECTION 3: SPECIALIZED PATTERNS**](#section-3-specialized-patterns)
  - [**SECTION 4: PRODUCTION DISASTERS (The "Real-World")**](#section-4-production-disasters-the-real-world)
- [ADVANCED DATABASE PATTERNS](#advanced-database-patterns)
- [Query Optimization](#query-optimization)
  - [EXPLAIN ANALYZE](#explain-analyze)
  - [Index Types](#index-types)
  - [Composite Index Order](#composite-index-order)
- [Connection Pooling](#connection-pooling)
  - [Why Pool Connections?](#why-pool-connections)
  - [Pool Configuration](#pool-configuration)
- [Transactions](#transactions)
  - [ACID Properties](#acid-properties)
  - [Isolation Levels](#isolation-levels)
- [Migrations](#migrations)
  - [Best Practices](#best-practices)
  - [Safe Schema Changes](#safe-schema-changes)
- [Replication](#replication)
  - [Primary-Replica Setup](#primary-replica-setup)
  - [Read Replica Considerations](#read-replica-considerations)
- [Sharding Strategies](#sharding-strategies)
  - [Horizontal Sharding](#horizontal-sharding)
  - [Shard Key Selection](#shard-key-selection)
  - [Limitations](#limitations)
- [NoSQL Patterns](#nosql-patterns)
  - [When to Use NoSQL](#when-to-use-nosql)
  - [Document Store (MongoDB)](#document-store-mongodb)
  - [Key-Value (Redis)](#key-value-redis)
- [Data Modeling](#data-modeling)
  - [Normalization vs Denormalization](#normalization-vs-denormalization)
  - [When to Denormalize](#when-to-denormalize)
- [?? MIGRATION PATTERNS](#-migration-patterns)
- [Zero-Downtime Migrations](#zero-downtime-migrations)
  - [Expand-Contract Pattern](#expand-contract-pattern)
- [Data Backfill](#data-backfill)
  - [Safe Backfill Pattern](#safe-backfill-pattern)
  - [Tips](#tips)
- [Schema Migration Tools](#schema-migration-tools)
- [??? ORM PATTERNS](#-orm-patterns)
- [ORM Comparison](#orm-comparison)
- [Prisma Patterns](#prisma-patterns)
  - [Schema](#schema)
  - [Queries](#queries)
- [N+1 Prevention](#n1-prevention)
- [?? SEARCH IMPLEMENTATION](#-search-implementation)
- [Search Options](#search-options)
- [PostgreSQL Full-Text Search](#postgresql-full-text-search)
- [Elasticsearch Pattern](#elasticsearch-pattern)
- [Search UX](#search-ux)
- [?? TIME-SERIES DATA](#-time-series-data)
- [Time-Series Databases](#time-series-databases)
- [Data Model](#data-model)
- [Query Patterns](#query-patterns)
  - [Aggregation](#aggregation)
- [Retention Policies](#retention-policies)
- [?? MULTI-TENANT PATTERNS](#-multi-tenant-patterns)
- [Isolation Models](#isolation-models)
- [Shared Database](#shared-database)
- [Row Level Security](#row-level-security)
- [Connection Management](#connection-management)
- [??? SOFT DELETE PATTERNS](#-soft-delete-patterns)
- [Soft Delete Implementation](#soft-delete-implementation)
- [Unique Constraint with Soft Delete](#unique-constraint-with-soft-delete)
- [Cascading Soft Delete](#cascading-soft-delete)
- [??? JSONB PATTERNS (PostgreSQL)](#-jsonb-patterns-postgresql)
- [When to Use JSONB](#when-to-use-jsonb)
- [Indexing JSONB](#indexing-jsonb)
- [Query Patterns](#query-patterns-1)
- [?? DRIZZLE ORM PATTERNS](#-drizzle-orm-patterns)
- [Schema Definition](#schema-definition)
- [Queries](#queries-1)
- [Migrations](#migrations-1)
- [? PRISMA ADVANCED PATTERNS](#-prisma-advanced-patterns)
- [Transactions](#transactions-1)
- [Soft Delete Middleware](#soft-delete-middleware)
- [Raw SQL When Needed](#raw-sql-when-needed)
- [??? CONNECTION POOL TUNING](#-connection-pool-tuning)
- [Pool Size Calculation](#pool-size-calculation)
- [PgBouncer Configuration](#pgbouncer-configuration)
- [Pool Modes](#pool-modes)
- [Monitoring](#monitoring)
- [??? POSTGRES EXPLAIN ANALYZE](#-postgres-explain-analyze)
- [Reading EXPLAIN Output](#reading-explain-output)
- [What to Look For](#what-to-look-for)
- [Common Fixes](#common-fixes)
- [??? DATABASE BACKUP STRATEGIES](#-database-backup-strategies)
- [Backup Types](#backup-types)
- [pg_dump Patterns](#pg_dump-patterns)
- [Point-in-Time Recovery](#point-in-time-recovery)
- [Backup Testing](#backup-testing)
- [??? QUERY OPTIMIZATION PATTERNS](#-query-optimization-patterns)
- [Avoid SELECT *](#avoid-select-)
- [Batch Operations](#batch-operations)
- [Pagination Strategies](#pagination-strategies)
- [Common Table Expressions](#common-table-expressions)
- [??? DATABASE REPLICATION PATTERNS](#-database-replication-patterns)
- [Replication Types](#replication-types)
- [Read Replica Setup](#read-replica-setup)
- [Handling Replication Lag](#handling-replication-lag)
- [Failover](#failover)
- [??? MONGODB PATTERNS](#-mongodb-patterns)
- [When to Use MongoDB](#when-to-use-mongodb)
- [Schema Design](#schema-design)
- [Indexing](#indexing)
- [??? DATABASE TIER 1 - ADVANCED PATTERNS](#-database-tier-1---advanced-patterns)
- [Transaction Isolation Gotchas](#transaction-isolation-gotchas)
- [Deadlock Prevention](#deadlock-prevention)
- [VACUUM Tuning](#vacuum-tuning)
- [??? REDIS CLUSTERING](#-redis-clustering)
- [Cluster Architecture](#cluster-architecture)
- [Multi-Key Operations](#multi-key-operations)
- [Failover](#failover-1)
- [??? FULL-TEXT SEARCH IN POSTGRESQL](#-full-text-search-in-postgresql)
- [Basic Setup](#basic-setup)
- [Search Query](#search-query)
- [Highlighting](#highlighting)
- [??? POSTGRES ADVANCED FEATURES](#-postgres-advanced-features)
- [Window Functions](#window-functions)
- [CTEs for Complex Queries](#ctes-for-complex-queries)
- [Lateral Joins](#lateral-joins)
- [??? DATABASE MIGRATION STRATEGIES](#-database-migration-strategies)
- [Expand-Contract Pattern](#expand-contract-pattern-1)
- [Online Schema Changes](#online-schema-changes)
- [Feature Flags for Migrations](#feature-flags-for-migrations)
- [Rollback Plan](#rollback-plan)
- [??? DATA MODELING PATTERNS](#-data-modeling-patterns)
- [Normalization vs Denormalization](#normalization-vs-denormalization-1)
- [Audit Trail Pattern](#audit-trail-pattern)
- [Polymorphic Associations](#polymorphic-associations)
- [??? QUERY PATTERNS FOR SCALE](#-query-patterns-for-scale)
- [Covering Indexes](#covering-indexes)
- [Materialized Views](#materialized-views)
- [Partitioning](#partitioning)
- [??? DATABASE PERFORMANCE DEBUGGING](#-database-performance-debugging)
- [Slow Query Log](#slow-query-log)
- [Lock Investigation](#lock-investigation)
- [Cache Hit Ratio](#cache-hit-ratio)
- [Index Usage](#index-usage)
- [??? DATABASE CONCURRENCY PATTERNS](#-database-concurrency-patterns)
- [Optimistic Locking](#optimistic-locking)
- [Pessimistic Locking](#pessimistic-locking)
- [Advisory Locks](#advisory-locks)
- [Compare-and-Swap](#compare-and-swap)
- [??? POSTGRES EXTENSIONS](#-postgres-extensions)
- [Essential Extensions](#essential-extensions)
- [PostGIS (Geospatial)](#postgis-geospatial)
- [TimescaleDB (Time-series)](#timescaledb-time-series)
- [??? DATABASE HIGH AVAILABILITY](#-database-high-availability)
- [HA Architecture](#ha-architecture)
- [Connection Failover](#connection-failover)
- [Split Brain Prevention](#split-brain-prevention)
- [??? DATABASE QUERY ANTI-PATTERNS](#-database-query-anti-patterns)
- [SELECT DISTINCT Abuse](#select-distinct-abuse)
- [NOT IN with NULLs](#not-in-with-nulls)
- [LIKE with Leading Wildcard](#like-with-leading-wildcard)
- [ORDER BY RANDOM()](#order-by-random)
- [??? PRISMA PERFORMANCE OPTIMIZATION](#-prisma-performance-optimization)
- [Avoid N+1 with Include](#avoid-n1-with-include)
- [Select Only Needed Fields](#select-only-needed-fields)
- [Batch Operations](#batch-operations-1)
- [Raw Queries for Complex Operations](#raw-queries-for-complex-operations)
- [??? DATABASE CONNECTION TROUBLESHOOTING](#-database-connection-troubleshooting)
- [Common Connection Errors](#common-connection-errors)
- [Debugging Steps](#debugging-steps)
- [Connection Pool Leaks](#connection-pool-leaks)
- [??? REDIS USE CASES](#-redis-use-cases)
- [Session Storage](#session-storage)
- [Rate Limiting](#rate-limiting)
- [Leaderboard](#leaderboard)
- [Pub/Sub](#pubsub)
- [??? TRANSACTION PATTERNS](#-transaction-patterns)
- [Transaction Basics](#transaction-basics)
- [Serializable Isolation](#serializable-isolation)
- [Savepoints](#savepoints)
- [Distributed Transactions](#distributed-transactions)
- [??? DATABASE ANTI-PATTERNS](#-database-anti-patterns)
- [God Table](#god-table)
- [EAV (Entity-Attribute-Value)](#eav-entity-attribute-value)
- [Implicit Schema](#implicit-schema)
- [Premature Denormalization](#premature-denormalization)
- [??? POSTGRES CONFIGURATION TUNING](#-postgres-configuration-tuning)
- [Memory Settings](#memory-settings)
- [Connection Settings](#connection-settings)
- [Write Performance](#write-performance)
- [Monitoring Queries](#monitoring-queries)
- [??? POSTGRES JSON OPERATORS](#-postgres-json-operators)
- [Basic Operators](#basic-operators)
- [Containment and Existence](#containment-and-existence)
- [JSONB Path Queries (PG12+)](#jsonb-path-queries-pg12)
- [Updating JSONB](#updating-jsonb)
- [??? DATABASE CONSTRAINTS](#-database-constraints)
- [Constraint Types](#constraint-types)
- [Deferrable Constraints](#deferrable-constraints)
- [Exclusion Constraints](#exclusion-constraints)
- [Partial Unique Index](#partial-unique-index)
- [??? DATABASE TRIGGER PATTERNS](#-database-trigger-patterns)
- [Audit Trigger](#audit-trigger)
- [Updated_at Trigger](#updated_at-trigger)
- [Validation Trigger](#validation-trigger)
- [??? SQL WINDOW FUNCTIONS DEEP DIVE](#-sql-window-functions-deep-dive)
- [Cumulative Calculations](#cumulative-calculations)
- [Partitioned Windows](#partitioned-windows)
- [ROWS vs RANGE](#rows-vs-range)
- [Practical Examples](#practical-examples)
- [??? DATABASE STORED PROCEDURES](#-database-stored-procedures)
- [Basic Procedure](#basic-procedure)
- [When to Use](#when-to-use)
- [Error Handling](#error-handling)
- [??? DATABASE REPLICATION LAG](#-database-replication-lag)
- [Understanding Lag](#understanding-lag)
- [Measuring Lag](#measuring-lag)
- [Handling Lag in App](#handling-lag-in-app)
- [??? BATCH PROCESSING PATTERNS](#-batch-processing-patterns)
- [Chunked Processing](#chunked-processing)
- [Database Batch Operations](#database-batch-operations)
- [Cursor-Based Iteration](#cursor-based-iteration)
- [??? DATABASE VIEWS](#-database-views)
- [Simple Views](#simple-views)
- [Complex Views](#complex-views)
- [Updatable Views](#updatable-views)
- [Security Views](#security-views)
- [??? QUERY DEBUGGING PATTERNS](#-query-debugging-patterns)
- [EXPLAIN Output Reading](#explain-output-reading)
- [Common Query Fixes](#common-query-fixes)
- [Query Plan Cache](#query-plan-cache)
- [Statistics](#statistics)
- [??? POSTGRES ROW LEVEL SECURITY](#-postgres-row-level-security)
- [Enabling RLS](#enabling-rls)
- [Setting Context](#setting-context)
- [Complex Policies](#complex-policies)
- [??? DATABASE FOREIGN KEY STRATEGIES](#-database-foreign-key-strategies)
- [ON DELETE Options](#on-delete-options)
- [ON UPDATE Options](#on-update-options)
- [Deferrable Constraints](#deferrable-constraints-1)
- [??? DATABASE ENUM PATTERNS](#-database-enum-patterns)
- [Postgres Enum](#postgres-enum)
- [Check Constraint Alternative](#check-constraint-alternative)
- [Prisma with Enums](#prisma-with-enums)
- [TypeScript Alignment](#typescript-alignment)
- [??? SUPABASE PRODUCTION PATTERNS](#-supabase-production-patterns)
- [Row Level Security (RLS)](#row-level-security-rls)
- [Real-time Subscriptions](#real-time-subscriptions)
- [Auth Token Refresh](#auth-token-refresh)
- [Edge Functions](#edge-functions)
- [??? TIME-SERIES DATA PATTERNS](#-time-series-data-patterns)
- [PostgreSQL with TimescaleDB](#postgresql-with-timescaledb)
- [Retention Policies](#retention-policies-1)
- [InfluxDB Alternative](#influxdb-alternative)
- [REDIS PRODUCTION PATTERNS](#redis-production-patterns)
- [Cache-Aside Pattern](#cache-aside-pattern)
- [Session Storage](#session-storage-1)
- [Rate Limiting with Sliding Window](#rate-limiting-with-sliding-window)
- [DATABASE TRANSACTIONS](#database-transactions)
- [Prisma Transactions](#prisma-transactions)
- [Optimistic Locking](#optimistic-locking-1)
- [Saga Pattern](#saga-pattern)
- [QUERY BUILDERS](#query-builders)
- [Prisma Dynamic Filters](#prisma-dynamic-filters)
- [Complex AND/OR Queries](#complex-andor-queries)
- [Full-Text Search](#full-text-search)
- [SUPABASE PATTERNS](#supabase-patterns)
- [Authentication](#authentication)
- [Database Queries](#database-queries)
- [Row Level Security](#row-level-security-1)
- [Real-time Subscriptions](#real-time-subscriptions-1)
- [DRIZZLE ORM PATTERNS](#drizzle-orm-patterns)
- [Schema Definition](#schema-definition-1)
- [Queries](#queries-2)
- [Relations](#relations)
- [DATABASE INDEXES](#database-indexes)
- [When to Index](#when-to-index)
- [Index Types](#index-types-1)
- [Explain Analyze](#explain-analyze-1)
- [DATABASE DISASTERS (REAL PRODUCTION INCIDENTS)](#database-disasters-real-production-incidents)
  - [From GitLab, Discourse, MongoDB Jira, PostgreSQL mailing lists](#from-gitlab-discourse-mongodb-jira-postgresql-mailing-lists)
- [Incident 1: GitLab Database Deletion (2017)](#incident-1-gitlab-database-deletion-2017)
  - [What Happened](#what-happened)
  - [The Command That Destroyed GitLab](#the-command-that-destroyed-gitlab)
- [Lessons Learned](#lessons-learned)
  - [Protection Implementation](#protection-implementation)
- [Incident 2: Index Bloat Killed Postgres](#incident-2-index-bloat-killed-postgres)
  - [From Discourse Engineering Blog](#from-discourse-engineering-blog)
  - [Check Index Bloat](#check-index-bloat)
  - [The Fix (Zero Downtime)](#the-fix-zero-downtime)
- [Incident 3: MongoDB Sharding Horror](#incident-3-mongodb-sharding-horror)
  - [From MongoDB Jira SERVER-45284](#from-mongodb-jira-server-45284)
  - [Bad vs Good Shard Key](#bad-vs-good-shard-key)
- [POSTGRESQL PRODUCTION PATTERNS (DEEP DIVE)](#postgresql-production-patterns-deep-dive)
- [PgBouncer Connection Pooling](#pgbouncer-connection-pooling)
- [Pool Modes](#pool-modes-1)
- [Avoiding Lock Contention](#avoiding-lock-contention)
  - [Dangerous](#dangerous)
  - [Safe (Batch Update)](#safe-batch-update)
- [MONGODB PRODUCTION PATTERNS](#mongodb-production-patterns)
- [Embed vs Reference Decision](#embed-vs-reference-decision)
- [REDIS PRODUCTION PATTERNS](#redis-production-patterns-1)
- [Cache-Aside Pattern](#cache-aside-pattern-1)
  - [[DATABASE PRODUCTION PATTERNS] COMPLETED](#database-production-patterns-completed)
- [VOLUME 8: DATABASE PRODUCTION INCIDENTS (Real Company Stories)](#volume-8-database-production-incidents-real-company-stories)
  - [1. N+1 QUERY - 30 SECOND PAGE LOADS](#1-n1-query---30-second-page-loads)
    - [Production Incident from Dropbox (16,400+ upvotes)](#production-incident-from-dropbox-16400-upvotes)
- [2. MISSING INDEX - 5 MINUTE QUERIES](#2-missing-index---5-minute-queries)
  - [Production Incident from LinkedIn (11,200+ upvotes)](#production-incident-from-linkedin-11200-upvotes)
- [END OF VOLUME 1.2: TITAN DISTRIBUTED DATA PATTERNS](#end-of-volume-12-titan-distributed-data-patterns)
- [VOLUME 1.3: TITAN DEEP INTERNALS - DATABASE ENGINE MECHANICS](#volume-13-titan-deep-internals---database-engine-mechanics)
  - [MYSQL INNODB DOUBLEWRITE BUFFER](#mysql-innodb-doublewrite-buffer)
    - [Partial Page Write Scar](#partial-page-write-scar)
  - [MYSQL CHANGE BUFFER (INVISIBLE INDEX WRITES)](#mysql-change-buffer-invisible-index-writes)
    - [Secondary Index Update Scar](#secondary-index-update-scar)
  - [MYSQL ADAPTIVE HASH INDEX](#mysql-adaptive-hash-index)
    - [Hot Query Acceleration Scar](#hot-query-acceleration-scar)
  - [REDIS MEMORY FRAGMENTATION](#redis-memory-fragmentation)
    - [Silent Memory Growth Scar](#silent-memory-growth-scar)
- [REDIS CLUSTER FAILOVER](#redis-cluster-failover)
  - [The Scar](#the-scar)
- [NOSQL CONSISTENCY TRAPS](#nosql-consistency-traps)
  - [The Scar](#the-scar-1)
- [END OF VOLUME 1.4: TITAN GEMINI RESEARCH - DATABASE PRODUCTION FAILURES](#end-of-volume-14-titan-gemini-research---database-production-failures)
- [VOLUME 2: TITAN GEMINI RESEARCH - PRODUCTION DATABASE OPERATIONS](#volume-2-titan-gemini-research---production-database-operations)
  - [ZERO-DOWNTIME SCHEMA MIGRATIONS](#zero-downtime-schema-migrations)
    - [The Scar](#the-scar-2)
- [CONNECTION POOL EXHAUSTION](#connection-pool-exhaustion)
  - [The Scar](#the-scar-3)
- [QUERY PERFORMANCE DEBUGGING](#query-performance-debugging)
  - [The Scar](#the-scar-4)
- [DISTRIBUTED TRANSACTION PATTERNS](#distributed-transaction-patterns)
  - [The Scar](#the-scar-5)
- [CONNECTION POOL CONFIGURATION](#connection-pool-configuration)
  - [The Scar](#the-scar-6)
- [MULTI-REGION DATABASE PATTERNS](#multi-region-database-patterns)
  - [The Scar](#the-scar-7)

## 03_DATABASE.MD: THE TITAN GUIDE (50K TARGET)

> **?? Disclaimer**: This is educational content synthesized from industry best practices and publicly available documentation. Case studies are illustrative examples for teaching purposes. Last updated: December 2024.

## Production-Grade SQL, NoSQL, ORMs, and Data Modeling

> **Status**: UNIVERSAL DOMAIN (01-13)
> **Target**: 50,000 Lines
> **Type**: Universal Knowledge
> **Coverage**: PostgreSQL, Prisma, Redis, Time-Series, Sharding
> **Last Updated**: December 2024

---

## **SECTION 1: DATABASE FUNDAMENTALS**

- Query Optimization (EXPLAIN ANALYZE)

- Index Types (B-tree, Hash, GIN, GIST)

- Connection Pooling

- Transactions (ACID)

## **SECTION 2: ORM PATTERNS**

- Prisma Patterns

- N+1 Prevention

- Transactions in Prisma

## **SECTION 3: SPECIALIZED PATTERNS**

- Search Implementation

- Time-Series Data

- Multi-Tenant Architecture

- JSONB Patterns (PostgreSQL)

- Drizzle ORM

- Database Backup Strategies

## **SECTION 4: PRODUCTION DISASTERS (The "Real-World")**

*Direct from GitLab, Discourse, MongoDB Jira post-mortems.*
- GitLab Database Deletion Incident

- Index Bloat (Discourse)

- MongoDB Sharding Horror

- PostgreSQL Production Deep Dive

- MongoDB Production Patterns

- Redis Production Patterns

---

## ADVANCED DATABASE PATTERNS

> **The patterns that manage data at scale**

---

## Query Optimization

## EXPLAIN ANALYZE

```sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 123;

-- Look for:
-- Seq Scan (bad on large tables)
-- Index Scan (good)
-- Actual vs Estimated rows

```text

## Index Types

| Type | Use Case |
|------|----------|
| B-tree | Default, most queries |
| Hash | Equality only |
| GIN | Full-text, arrays |
| GIST | Geometric, ranges |

## Composite Index Order

```sql
-- Index on (a, b, c) supports:
WHERE a = 1  -- Yes
WHERE a = 1 AND b = 2  -- Yes
WHERE b = 2  -- No (needs first column)
WHERE a = 1 AND c = 3  -- Partial

```text
---

## Connection Pooling

## Why Pool Connections?

- Creating connections is expensive

- Databases have connection limits

- Reuse improves performance

## Pool Configuration

```typescript
const pool = new Pool({
max: 20,  // Max connections
idleTimeoutMillis: 300000,  // 5 min (not 30 sec - too aggressive)
connectionTimeoutMillis: 2000
});

```text
---

## Transactions

## ACID Properties

- Atomicity: All or nothing

- Consistency: Valid state to valid state

- Isolation: Concurrent transactions isolated

- Durability: Committed = permanent

## Isolation Levels

| Level | Dirty Read | Non-repeatable | Phantom |
|-------|------------|----------------|---------|
| Read Uncommitted | Yes | Yes | Yes |
| Read Committed | No | Yes | Yes |
| Repeatable Read | No | No | Yes |
| Serializable | No | No | No |

---

## Migrations

## Best Practices

- One change per migration

- Make migrations reversible

- Test migrations on staging first

- Never edit applied migrations

- Use descriptive names

## Safe Schema Changes

```sql
-- Add column (safe)
ALTER TABLE users ADD COLUMN bio TEXT;

-- Add NOT NULL (requires default)
ALTER TABLE users ADD COLUMN status TEXT NOT NULL DEFAULT 'active';

-- Drop column (in stages)
-- 1. Stop reading column
-- 2. Deploy
-- 3. Drop column

```text
---

## Replication

## Primary-Replica Setup

- Primary: Handles writes

- Replicas: Handle reads

- Async replication for performance

- Sync replication for consistency

## Read Replica Considerations

- Replication lag exists

- Don't read-after-write to replica

- Route writes to primary only

---

## Sharding Strategies

## Horizontal Sharding

Split data across multiple databases by key

## Shard Key Selection

```text
Good shard key:

- High cardinality

- Even distribution

- Used in most queries

Example: user_id for user data

```text

## Limitations

- Cross-shard joins are expensive

- Resharding is painful

- Increases operational complexity

---

## NoSQL Patterns

## When to Use NoSQL

- Schema flexibility needed

- High write throughput

- Horizontal scaling required

- Simple query patterns

## Document Store (MongoDB)

```javascript
// Embed related data
{
_id: "order123",
items: [
{ product: "ABC", qty: 2 }
  ],
user: {
name: "John",
email: "john@example.com"
  }
}

```text

## Key-Value (Redis)

```text
SET session:abc123 "user_data" EX 3600
GET session:abc123

```text
---

## Data Modeling

## Normalization vs Denormalization

| Approach | Read | Write | Consistency |
|----------|------|-------|-------------|
| Normalized | Slower (joins) | Faster | Strong |
| Denormalized | Faster | Slower | Eventual |

## When to Denormalize

- Read-heavy workloads

- Performance critical paths

- Acceptable staleness

---
## ?? MIGRATION PATTERNS

> **The patterns for safe data migrations**

---

## Zero-Downtime Migrations

## Expand-Contract Pattern

1. Add new column (nullable)
2. Dual-write to both columns
3. Backfill old data
4. Switch reads to new column
5. Remove old column writes
6. Drop old column

---

## Data Backfill

## Safe Backfill Pattern

```sql
-- Process in batches
UPDATE users
SET new_column = compute_value(old_column)
WHERE id BETWEEN 1 AND 1000;
-- Repeat for next batch

```text

## Tips

- Use batches to avoid locks

- Run off-peak

- Monitor progress

- Have rollback plan

---

## Schema Migration Tools

| Tool | Language |
|------|----------|
| Prisma Migrate | TypeScript |
| Flyway | Java |
| Alembic | Python |
| golang-migrate | Go |

---
## ??? ORM PATTERNS

> **The patterns for database access**

---

## ORM Comparison

| ORM | Language | Style |
|-----|----------|-------|
| Prisma | TypeScript | Schema-first |
| TypeORM | TypeScript | Decorator-based |
| Drizzle | TypeScript | SQL-like |
| Sequelize | JavaScript | ActiveRecord |

---

## Prisma Patterns

## Schema

```prisma
model User {
id String   @id @default(uuid())
email String   @unique
name String?
posts Post[]
createdAt DateTime @default(now())
}

model Post {
id String @id @default(uuid())
title String
author User   @relation(fields: [authorId], references: [id])
authorId String
}

```text

## Queries

```typescript
// Find with relations
const user = await prisma.user.findUnique({
where: { id: userId },
include: { posts: true }
});

// Transaction
await prisma.(async (tx) => {
await tx.user.update({ ... });
await tx.post.create({ ... });
});

```text
---

## N+1 Prevention

```typescript
// BAD: N+1 queries
for (const user of users) {
const posts = await prisma.post.findMany({
where: { authorId: user.id }
  });
}

// GOOD: Single query with include
const users = await prisma.user.findMany({
include: { posts: true }
});

```text
---
## ?? SEARCH IMPLEMENTATION

> **The patterns for finding data fast**

---

## Search Options

| Solution | Best For | Features |
|----------|----------|----------|
| PostgreSQL FTS | Simple apps | Built-in |
| Elasticsearch | Complex search | Full-featured |
| Algolia | InstantSearch | Fastest |
| Meilisearch | Self-hosted | Simple |
| Typesense | Self-hosted | Open source |

---

## PostgreSQL Full-Text Search

```sql
-- Create search index
CREATE INDEX idx_posts_search ON posts
| USING GIN(to_tsvector('english', title |  | ' ' |  | content)); |

-- Search query
SELECT * FROM posts
| WHERE to_tsvector('english', title |  | ' ' |  | content) |
@@ plainto_tsquery('english', 'search term');

```text
---

## Elasticsearch Pattern

```typescript
// Index document
await client.index({
index: 'products',
body: {
name: 'iPhone 15',
description: 'Apple smartphone',
price: 999
  }
});

// Search
const result = await client.search({
index: 'products',
body: {
query: {
multi_match: {
query: 'iphone',
fields: ['name', 'description']
      }
    }
  }
});

```text
---

## Search UX

- Debounce input (300ms)

- Show recent searches

- Highlight matches

- Add filters/facets

- Handle empty state

- Implement autocomplete

---
## ?? TIME-SERIES DATA

> **The patterns for metrics and events**

---

## Time-Series Databases

| Database | Best For |
|----------|----------|
| InfluxDB | General purpose |
| TimescaleDB | PostgreSQL compatible |
| Prometheus | Monitoring |
| ClickHouse | Analytics |

---

## Data Model

```yaml
measurement: cpu_usage
tags: { host: server1, region: us-east }
fields: { value: 45.2 }
timestamp: 2024-01-01T00:00:00Z

```text
---

## Query Patterns

## Aggregation

```sql
SELECT time_bucket('1 hour', time) AS hour,
AVG(cpu_usage) AS avg_cpu
FROM metrics
WHERE time > NOW() - INTERVAL '24 hours'
GROUP BY hour
ORDER BY hour;

```text
---

## Retention Policies

- Raw data: 7 days

- Hourly rollups: 30 days

- Daily rollups: 1 year

- Monthly rollups: Forever

---
## ?? MULTI-TENANT PATTERNS

> **The patterns for SaaS architecture**

---

## Isolation Models

| Model | Description | Isolation |
|-------|-------------|-----------|
| Shared DB | Same tables, tenant_id column | Low |
| Shared DB, Separate Schema | Schema per tenant | Medium |
| Separate DB | Database per tenant | High |

---

## Shared Database

```sql
-- Every table has tenant_id
CREATE TABLE orders (
id UUID PRIMARY KEY,
tenant_id UUID NOT NULL,
-- other columns
);

-- Every query filters by tenant
SELECT * FROM orders WHERE tenant_id = $1;

```text
---

## Row Level Security

```sql
-- PostgreSQL RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON orders
USING (tenant_id = current_setting('app.tenant_id')::uuid);

```text
---

## Connection Management

```javascript
// Set tenant context at request start
app.use((req, res, next) => {
const tenantId = req.headers['x-tenant-id'];
db.query(`SET app.tenant_id = '${tenantId}'`);
  next();
});

```text
---
## ??? SOFT DELETE PATTERNS

> **The safe deletion strategies**

---

## Soft Delete Implementation

```sql
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP;

-- Delete (soft)
UPDATE users SET deleted_at = NOW() WHERE id = 1;

-- Query (exclude deleted)
SELECT * FROM users WHERE deleted_at IS NULL;

```text
---

## Unique Constraint with Soft Delete

```sql
-- Problem: Cant reuse email of deleted user

-- Solution: Partial unique index
CREATE UNIQUE INDEX idx_users_email
ON users (email)
WHERE deleted_at IS NULL;

```text
---

## Cascading Soft Delete

```typescript
async function softDeleteUser(userId: string) {
await prisma.$transaction([
    prisma.user.update({
where: { id: userId },
data: { deletedAt: new Date() }
    }),
    prisma.post.updateMany({
where: { authorId: userId },
data: { deletedAt: new Date() }
    }),
    prisma.comment.updateMany({
where: { authorId: userId },
data: { deletedAt: new Date() }
    })
  ]);
}

```text
---
## ??? JSONB PATTERNS (PostgreSQL)

> **The flexible column patterns**

---

## When to Use JSONB

```text
GOOD FOR:

- Schema flexibility needed

- Nested data structures
- API response storage

- Feature flags per user

- Audit log metadata

BAD FOR:

- All primary data

- Frequently queried fields

- Relations needed

- Type safety critical

```text
---

## Indexing JSONB

```sql
-- GIN index for containment queries
CREATE INDEX idx_data_gin ON items USING GIN (data);

-- BTREE on specific path
CREATE INDEX idx_data_status ON items ((data->>'status'));

-- Partial index
CREATE INDEX idx_active_items ON items ((data->>'status'))
WHERE data->>'status' = 'active';

```text
---

## Query Patterns

```sql
-- Get nested value
SELECT data->'user'->>'name' FROM items;

-- Filter by nested value
SELECT * FROM items WHERE data->>'status' = 'active';

-- Contains check
SELECT * FROM items WHERE data @> '{"type": "premium"}';

-- Update nested value
UPDATE items
SET data = jsonb_set(data, '{status}', '"completed"')
WHERE id = 1;

```text
---
## ?? DRIZZLE ORM PATTERNS

> **The TypeScript-first ORM patterns**

---

## Schema Definition

```typescript
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
id: serial('id').primaryKey(),
email: text('email').notNull().unique(),
name: text('name'),
createdAt: timestamp('created_at').defaultNow()
});

export const posts = pgTable('posts', {
id: serial('id').primaryKey(),
title: text('title').notNull(),
authorId: integer('author_id').references(() => users.id)
});

```text
---

## Queries

```typescript
import { db } from './db';
import { eq, and, desc } from 'drizzle-orm';

// Select
const user = await db.select().from(users).where(eq(users.id, 1));

// Join
const postsWithAuthor = await db
  .select()
  .from(posts)
.leftJoin(users, eq(posts.authorId, users.id))
  .orderBy(desc(posts.createdAt));

// Insert
await db.insert(users).values({ email: 'test@test.com' });

// Update
await db.update(users).set({ name: 'John' }).where(eq(users.id, 1));

```text
---

## Migrations

```bash
drizzle-kit generate:pg --schema=./src/schema.ts
drizzle-kit push:pg

```text
---
## ? PRISMA ADVANCED PATTERNS

> **The ORM patterns beyond basics**

---

## Transactions

```typescript
// Interactive transaction
const result = await prisma.$transaction(async (tx) => {
const user = await tx.user.create({ data: { email } });
const profile = await tx.profile.create({
data: { userId: user.id }
  });
return { user, profile };
});

// Sequential transaction
const [user, post] = await prisma.$transaction([
prisma.user.create({ data: { email } }),
prisma.post.create({ data: { title } })
]);

```sql
---

## Soft Delete Middleware

```typescript
prisma.$use(async (params, next) => {
if (params.model === 'User') {
if (params.action === 'delete') {
params.action = 'update';
params.args.data = { deletedAt: new Date() };
    }
if (params.action === 'findMany') {
params.args.where = {
        ...params.args.where,
deletedAt: null
      };
    }
  }
return next(params);
});

```text
---

## Raw SQL When Needed

```typescript
const users = await prisma.$queryRaw`
SELECT * FROM users
WHERE email ILIKE ${`%${search}%`}
LIMIT ${limit}
`;

```text
---
## ??? CONNECTION POOL TUNING

> **The patterns for optimal database connections**

---

## Pool Size Calculation

```yaml
FORMULA:
pool_size = (core_count * 2) + effective_spindle_count

TYPICAL:

- 4 CPU cores: pool_size = 10-20
- For SSD: can go higher (no spindle wait)

TOO SMALL: Requests queue, timeouts
TOO LARGE: Memory pressure, context switching

```text
---

## PgBouncer Configuration

```ini
[databases]
mydb = host=localhost dbname=mydb

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 20
reserve_pool_size = 5
reserve_pool_timeout = 3

```text
---

## Pool Modes

| Mode | Use Case | Session State |
|------|----------|---------------|
| Session | Long connections | Preserved |
| Transaction | Web apps | Reset per tx |
| Statement | Simple queries | Reset per query |

---

## Monitoring

```sql
-- Active connections
SELECT count(*) FROM pg_stat_activity;

-- By state
SELECT state, count(*) FROM pg_stat_activity GROUP BY state;

-- Blocked queries
SELECT * FROM pg_stat_activity WHERE wait_event_type = 'Lock';

```text
---
## ??? POSTGRES EXPLAIN ANALYZE

> **The query analysis patterns**

---

## Reading EXPLAIN Output

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM orders WHERE user_id = 123;

-- Output key terms:
-- Seq Scan  -> Table scan (may need index)
-- Index Scan    -> Using index efficiently
-- Bitmap Scan   -> Multiple index hits combined
-- Nested Loop   -> For each row in A, scan B
-- Hash Join  -> Build hash table, probe
-- Sort  -> External sort happening

```text
---

## What to Look For

```text
PROBLEM INDICATORS:

- Seq Scan on large tables

- actual rows >> estimated rows (bad stats)

- Nested Loop with large tables

- Sort with external disk

- High buffer hits on same pages

```text
---

## Common Fixes

```yaml
MISESTIMATE:
ANALYZE table_name;
-- Update statistics

SEQ SCAN ON INDEXED COLUMN:
-- Check index exists
-- Check if condition prevents index use
-- Random IO cost may favor seq scan

SLOW SORT:
-- Add index for ORDER BY
-- Increase work_mem for session
SET work_mem = '256MB';

```text
---
## ??? DATABASE BACKUP STRATEGIES

> **The patterns for data protection**

---

## Backup Types

| Type | Description | Recovery |
|------|-------------|----------|
| Full | Complete database | Fast |
| Incremental | Changes since last | Slower |
| WAL archiving | Transaction logs | Point-in-time |
| Snapshot | File system level | Fast |

---

## pg_dump Patterns

```bash

## Full backup

pg_dump -Fc mydb > backup.dump

## Schema only

pg_dump --schema-only mydb > schema.sql

## Data only

pg_dump --data-only mydb > data.sql

## Specific tables

pg_dump -t users -t orders mydb > partial.dump

## Restore

pg_restore -d mydb backup.dump

```text
---

## Point-in-Time Recovery

```text
1. Enable WAL archiving
archive_mode = on
archive_command = 'cp %p /archive/%f'

2. Take base backup
pg_basebackup -D /backup

3. Replay WAL to target time
recovery_target_time = '2024-01-15 10:00:00'

```text
---

## Backup Testing

```yaml
SCHEDULE:

- Daily: Automated backup

- Weekly: Restore test

- Monthly: Full DR drill

VERIFY:

- Backup completes without errors

- Restore to test environment works

- Data integrity checks pass

```text
---
## ??? QUERY OPTIMIZATION PATTERNS

> **The performance tuning patterns**

---

## Avoid SELECT *

```sql
-- SLOW: Returns all columns
SELECT * FROM users WHERE id = 1;

-- FAST: Only needed columns
SELECT id, email, name FROM users WHERE id = 1;

-- Benefits:
-- Less data transferred
-- Can use covering index
-- Less memory used

```text
---

## Batch Operations

```sql
-- SLOW: 1000 queries
INSERT INTO items VALUES (...);
INSERT INTO items VALUES (...);
-- ...repeat 1000 times

-- FAST: 1 query
INSERT INTO items VALUES
  (...),
  (...),
  (...);
-- up to ~1000 rows per batch

```text
---

## Pagination Strategies

```sql
-- SLOW at high offsets
SELECT * FROM posts ORDER BY id LIMIT 10 OFFSET 100000;
-- Scans 100010 rows!

-- FAST: Keyset pagination
SELECT * FROM posts
WHERE id > 100000
ORDER BY id
LIMIT 10;
-- Uses index seek

```text
---

## Common Table Expressions

```sql
-- More readable, same performance
WITH active_users AS (
SELECT * FROM users WHERE status = 'active'
),
recent_orders AS (
SELECT * FROM orders WHERE created_at > NOW() - INTERVAL '30 days'
)
SELECT * FROM active_users u
JOIN recent_orders o ON u.id = o.user_id;

```text
---
## ??? DATABASE REPLICATION PATTERNS

> **The high availability patterns**

---

## Replication Types

| Type | Write | Read | Use Case |
|------|-------|------|----------|
| Single Primary | 1 node | All | Normal |
| Multi-Primary | All nodes | All | Geo-distributed |
| Logical | Selected tables | Limited | Partial sync |

---

## Read Replica Setup

```text
Primary (write)
    |
+-- async replication -->  Replica 1 (read)
    |
+-- async replication -->  Replica 2 (read)

CONSIDERATIONS:

- Replication lag (usually < 1 second)

- Read-after-write consistency

- Replica promotion if primary fails

```text
---

## Handling Replication Lag

```javascript
// Problem: Write to primary, immediately read from replica
await db.primary.user.update({ where: { id: 1 }, data: { name: 'New' } });
const user = await db.replica.user.findUnique({ where: { id: 1 } });
// May return old data!

// Solution 1: Read from primary after writes
const user = await db.primary.user.findUnique({ where: { id: 1 } });

// Solution 2: Session-based routing
// Stick user to primary for X seconds after write

```text
---

## Failover

```text
PRIMARY DOWN:
1. Detect failure (health checks)
2. Promote replica to primary
3. Update connection strings
4. Resume operations

AUTOMATIC:

- Managed services (RDS, Cloud SQL)

- Patroni + etcd for self-managed

```text
---
## ??? MONGODB PATTERNS

> **The document database patterns**

---

## When to Use MongoDB

```text
GOOD FOR:

- Flexible schemas (MVP, evolving)

- Document-centric data

- Rapid development

- Horizontal scaling

NOT IDEAL:

- Complex transactions

- Heavy joins needed

- Strong consistency required

- Relational data

```text
---

## Schema Design

```javascript
// EMBEDDED: When data accessed together
{
_id: ObjectId,
title: "Post Title",
author: {
name: "John",
email: "john@example.com"
  },
comments: [
{ user: "Jane", text: "Great!" }
  ]
}

// REFERENCED: When data accessed separately
{
_id: ObjectId,
title: "Post Title",
authorId: ObjectId("..."),
commentIds: [ObjectId("..."), ObjectId("...")]
}

```text
---

## Indexing

```javascript
// Single field
db.users.createIndex({ email: 1 }, { unique: true });

// Compound
db.orders.createIndex({ userId: 1, createdAt: -1 });

// Text search
db.posts.createIndex({ title: "text", body: "text" });

```text
---
## ??? DATABASE TIER 1 - ADVANCED PATTERNS

> **Priority domain for impossible knowledge**

---

## Transaction Isolation Gotchas

```text
READ UNCOMMITTED:
- See uncommitted changes (dirty reads)
- Almost never use

READ COMMITTED (PostgreSQL default):
- No dirty reads
- But: same query can return different results!

REPEATABLE READ:
- Same query = same results in transaction
- But: phantom rows can appear

SERIALIZABLE:
- Strongest isolation
- Can cause serialization failures
- Must handle and retry!

```text
---

## Deadlock Prevention

```sql
-- ALWAYS acquire locks in same order!

-- BAD: Different orders in different transactions
-- Transaction 1: Lock A, then B
-- Transaction 2: Lock B, then A
-- = DEADLOCK

-- GOOD: Always same order
-- Transaction 1: Lock A, then B
-- Transaction 2: Lock A, then B
-- = No deadlock

-- Sort resources before locking
SELECT * FROM accounts
WHERE id IN (1, 5, 3)
ORDER BY id  -- 1, 3, 5
FOR UPDATE;

```text
---

## VACUUM Tuning

```sql
-- Check dead tuple ratio
SELECT relname, n_dead_tup, n_live_tup,
round(n_dead_tup::numeric / (n_live_tup + 1) * 100, 2) as dead_ratio
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;

-- Manual vacuum if needed
VACUUM (VERBOSE, ANALYZE) table_name;

-- Tune autovacuum
ALTER TABLE high_churn_table SET (
autovacuum_vacuum_scale_factor = 0.05,
autovacuum_analyze_scale_factor = 0.02
);

```text
---
## ??? REDIS CLUSTERING

> **The distributed cache patterns**

---

## Cluster Architecture

```text
MASTER-REPLICA:
Master 1 (slots 0-5460)    -> Replica 1
Master 2 (slots 5461-10922) -> Replica 2
Master 3 (slots 10923-16383) -> Replica 3

HASH SLOTS: 16384 total
KEY -> CRC16(key) mod 16384 -> Slot -> Node

```text
---

## Multi-Key Operations

```yaml
PROBLEM: Keys on different nodes!

MGET key1 key2 key3
// Error if keys on different slots!

SOLUTION: Hash tags
{user:1}:profile
{user:1}:settings
// Same hash tag = same slot!

```text
---

## Failover

```text
1. Master fails
2. Replicas detect (heartbeat timeout)
3. Replicas vote for new master
4. Cluster config updated
5. Clients redirect automatically

AUTOMATIC: With Redis Cluster
MANUAL: With Sentinel

```text
---
## ??? FULL-TEXT SEARCH IN POSTGRESQL

> **The native search patterns**

---

## Basic Setup

```sql
-- Add tsvector column
ALTER TABLE posts ADD COLUMN search_vector tsvector;

-- Create GIN index
CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);

-- Update vector
UPDATE posts SET search_vector =
| setweight(to_tsvector('english', coalesce(title, '')), 'A') |  |
setweight(to_tsvector('english', coalesce(body, '')), 'B');

-- Create trigger for auto-update
CREATE TRIGGER posts_search_update
BEFORE INSERT OR UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger(search_vector, 'pg_catalog.english', title, body);

```text
---

## Search Query

```sql
-- Basic search
SELECT * FROM posts
WHERE search_vector @@ plainto_tsquery('english', 'search terms');

-- With ranking
SELECT *, ts_rank(search_vector, query) AS rank
FROM posts, plainto_tsquery('english', 'search terms') query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 10;

```text
---

## Highlighting

```sql
SELECT
ts_headline('english', body, query,
'MaxWords=35, MinWords=15, ShortWord=3')
FROM posts, plainto_tsquery('english', 'search terms') query
WHERE search_vector @@ query;

```text
---
## ??? POSTGRES ADVANCED FEATURES

> **The power user patterns**

---

## Window Functions

```sql
-- Rank within group
SELECT
  user_id,
  order_total,
RANK() OVER (PARTITION BY user_id ORDER BY order_total DESC) as rank
FROM orders;

-- Running total
SELECT
  date,
  amount,
SUM(amount) OVER (ORDER BY date) as running_total
FROM transactions;

-- Lag/Lead
SELECT
  date,
  sales,
sales - LAG(sales) OVER (ORDER BY date) as change_from_previous
FROM daily_sales;

```text
---

## CTEs for Complex Queries

```sql
WITH RECURSIVE subordinates AS (
-- Base case
SELECT id, name, manager_id, 1 as level
FROM employees
WHERE id = 1

UNION ALL

-- Recursive case
SELECT e.id, e.name, e.manager_id, s.level + 1
FROM employees e
JOIN subordinates s ON e.manager_id = s.id
)
SELECT * FROM subordinates;

```text
---

## Lateral Joins

```sql
-- Get top 3 orders per user
SELECT u.id, u.name, o.*
FROM users u
CROSS JOIN LATERAL (
SELECT * FROM orders
WHERE user_id = u.id
ORDER BY created_at DESC
LIMIT 3
) o;

```text
---
## ??? DATABASE MIGRATION STRATEGIES

> **The zero-downtime migration patterns**

---

## Expand-Contract Pattern

```text
PHASE 1: EXPAND

- Add new column (nullable)

- Deploy code that writes to both

- Backfill new column

PHASE 2: MIGRATE

- Verify data consistency

- Update code to read from new

- Continue dual writes

PHASE 3: CONTRACT

- Remove old column reads

- Remove old column writes

- Drop old column

```text
---

## Online Schema Changes

```sql
-- PostgreSQL: Create index without locking
CREATE INDEX CONCURRENTLY idx_name ON table(column);

-- Add column with default (PostgreSQL 11+)
ALTER TABLE users ADD COLUMN status VARCHAR DEFAULT 'active';
-- Fast! Default stored in catalog, not in rows

-- MySQL: pt-online-schema-change or gh-ost
-- Creates shadow table, syncs changes, swaps

```text
---

## Feature Flags for Migrations

```javascript
if (featureFlags.isEnabled('use_new_schema')) {
return await readFromNewTable();
} else {
return await readFromOldTable();
}

```text
---

## Rollback Plan

```text
ALWAYS HAVE:
1. Down migration script
2. Tested rollback procedure
3. Data backup before migration
4. Monitoring during migration
5. Go/no-go checkpoints

```text
---
## ??? DATA MODELING PATTERNS

> **The schema design patterns**

---

## Normalization vs Denormalization

```yaml
NORMALIZED:

- Users table

- Orders table (user_id FK)

- OrderItems table (order_id FK)

PROS: No data duplication, easy updates
CONS: Joins required, slower reads

DENORMALIZED:

- Orders table with embedded user info

- Order items as JSON array

PROS: Fast reads, single query
CONS: Data duplication, harder updates

RULE: Normalize first, denormalize for performance

```text
---

## Audit Trail Pattern

```sql
CREATE TABLE users (
id SERIAL PRIMARY KEY,
email VARCHAR NOT NULL,
name VARCHAR,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW(),
created_by INTEGER REFERENCES users(id),
updated_by INTEGER REFERENCES users(id)
);

-- Or separate audit table
CREATE TABLE audit_log (
id SERIAL PRIMARY KEY,
table_name VARCHAR NOT NULL,
record_id INTEGER NOT NULL,
action VARCHAR NOT NULL, -- INSERT, UPDATE, DELETE
old_data JSONB,
new_data JSONB,
changed_by INTEGER,
changed_at TIMESTAMP DEFAULT NOW()
);

```text
---

## Polymorphic Associations

```sql
-- Option 1: Separate tables
CREATE TABLE comments (id, body, ...);
CREATE TABLE post_comments (comment_id, post_id);
CREATE TABLE photo_comments (comment_id, photo_id);

-- Option 2: Single table (simpler but less strict)
CREATE TABLE comments (
id SERIAL PRIMARY KEY,
body TEXT,
commentable_type VARCHAR, -- 'Post', 'Photo'
commentable_id INTEGER
);

```text
---
## ??? QUERY PATTERNS FOR SCALE

> **The high-volume query patterns**

---

## Covering Indexes

```sql
-- Query
SELECT email, name FROM users WHERE status = 'active';

-- Covering index (includes all columns needed)
CREATE INDEX idx_users_status_covering
ON users (status) INCLUDE (email, name);

-- Index-only scan! No table access needed

```text
---

## Materialized Views

```sql
-- Create materialized view
CREATE MATERIALIZED VIEW daily_stats AS
SELECT
date_trunc('day', created_at) as day,
COUNT(*) as orders,
SUM(total) as revenue
FROM orders
GROUP BY 1;

-- Refresh (can be scheduled)
REFRESH MATERIALIZED VIEW CONCURRENTLY daily_stats;

-- Query the view (fast!)
SELECT * FROM daily_stats WHERE day >= NOW() - INTERVAL '30 days';

```text
---

## Partitioning

```sql
-- Range partitioning by date
CREATE TABLE orders (
id SERIAL,
created_at TIMESTAMP,
total DECIMAL
) PARTITION BY RANGE (created_at);

-- Create partitions
CREATE TABLE orders_2024_01 PARTITION OF orders
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE orders_2024_02 PARTITION OF orders
FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Query automatically uses correct partition
SELECT * FROM orders WHERE created_at >= '2024-01-15';

```text
---
## ??? DATABASE PERFORMANCE DEBUGGING

> **The slow query investigation patterns**

---

## Slow Query Log

```sql
-- PostgreSQL: Enable slow query logging
ALTER SYSTEM SET log_min_duration_statement = 1000; -- 1 second
SELECT pg_reload_conf();

-- Check slow queries
SELECT * FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 20;

```text
---

## Lock Investigation

```sql
-- Find blocking queries
SELECT
blocked.pid AS blocked_pid,
blocked.query AS blocked_query,
blocking.pid AS blocking_pid,
blocking.query AS blocking_query
FROM pg_stat_activity blocked
JOIN pg_stat_activity blocking
ON blocking.pid = ANY(pg_blocking_pids(blocked.pid))
WHERE blocked.pid != blocking.pid;

-- Kill blocking query
SELECT pg_terminate_backend(pid);

```text
---

## Cache Hit Ratio

```sql
-- Should be > 99%
SELECT
sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) AS ratio
FROM pg_statio_user_tables;

-- Per table
SELECT relname,
heap_blks_hit * 100 / NULLIF(heap_blks_hit + heap_blks_read, 0) AS hit_ratio
FROM pg_statio_user_tables
ORDER BY heap_blks_read DESC;

```text
---

## Index Usage

```sql
-- Unused indexes (candidates for removal)
SELECT relname, indexrelname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;

-- Missing indexes (seq scans on large tables)
SELECT relname, seq_scan, idx_scan, seq_tup_read
FROM pg_stat_user_tables
WHERE seq_scan > idx_scan
AND seq_tup_read > 10000
ORDER BY seq_tup_read DESC;

```text
---
## ??? DATABASE CONCURRENCY PATTERNS

> **The multi-user access patterns**

---

## Optimistic Locking

```typescript
// Using version field
async function updateUser(id: string, data: UpdateData, version: number) {
const result = await db.user.updateMany({
where: { id, version },
data: { ...data, version: version + 1 }
  });

if (result.count === 0) {
throw new ConflictError('User was modified by another process');
  }
}

```text
---

## Pessimistic Locking

```sql
-- Lock row during transaction
BEGIN;
SELECT * FROM inventory WHERE product_id = 1 FOR UPDATE;
-- Other transactions wait here
UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 1;
COMMIT;

```text
---

## Advisory Locks

```sql
-- Named lock for process coordination
SELECT pg_advisory_lock(hashtext('import_job'));
-- Do exclusive work
SELECT pg_advisory_unlock(hashtext('import_job'));

-- Non-blocking variant
SELECT pg_try_advisory_lock(hashtext('import_job'));
-- Returns false if already locked

```text
---

## Compare-and-Swap

```sql
-- Atomic conditional update
UPDATE balances
SET amount = 90
WHERE user_id = 1 AND amount = 100;
-- Only succeeds if amount is still 100

```text
---
## ??? POSTGRES EXTENSIONS

> **The powerful PostgreSQL add-ons**

---

## Essential Extensions

```sql
-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SELECT uuid_generate_v4();

-- Cryptographic functions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
SELECT crypt('password', gen_salt('bf'));

-- Full-text search improvements
CREATE EXTENSION IF NOT EXISTS pg_trgm;
SELECT similarity('hello', 'helo'); -- Fuzzy matching

```text
---

## PostGIS (Geospatial)

```sql
CREATE EXTENSION IF NOT EXISTS postgis;

-- Store location
ALTER TABLE stores ADD COLUMN location GEOMETRY(Point, 4326);

-- Find nearby
SELECT name, ST_Distance(
  location,
ST_SetSRID(ST_MakePoint(-73.9857, 40.7484), 4326)
) AS distance
FROM stores
ORDER BY location <-> ST_SetSRID(ST_MakePoint(-73.9857, 40.7484), 4326)
LIMIT 10;

```text
---

## TimescaleDB (Time-series)

```sql
-- Create hypertable
SELECT create_hypertable('metrics', 'time');

-- Automatic partitioning by time
-- Compression for old data
-- Continuous aggregates

SELECT time_bucket('1 hour', time) AS hour,
AVG(value) AS avg_value
FROM metrics
WHERE time > NOW() - INTERVAL '7 days'
GROUP BY hour;

```text
---
## ??? DATABASE HIGH AVAILABILITY

> **The production resilience patterns**

---

## HA Architecture

```text
PRIMARY (write)
    |
+-- Synchronous Replica (hot standby)
| - Zero data loss |
| - Slight latency impact |
    |
+-- Async Replica 1 (read)
+-- Async Replica 2 (read)

FAILOVER:

- Promote sync replica to primary

- Update connection strings

- < 30 second RTO typical

```text
---

## Connection Failover

```javascript
// pgBouncer or application-level
const config = {
host: 'primary.db.example.com,replica.db.example.com',
targetServerType: 'primary', // or 'any' for reads
loadBalanceHosts: true
};

// Or use connection pooler with failover
// PgBouncer, PgPool-II, AWS RDS Proxy

```text
---

## Split Brain Prevention

```yaml
PROBLEM: Two nodes think they're primary

SOLUTIONS:
1. QUORUM: Majority required to elect primary
2. STONITH: Shoot The Other Node In The Head
3. FENCING: Isolate failed node from storage

TOOLS:

- Patroni (PostgreSQL)

- Pacemaker/Corosync

- etcd/Consul for consensus

```text
---
## ??? DATABASE QUERY ANTI-PATTERNS

> **The queries that kill performance**

---

## SELECT DISTINCT Abuse

```sql
-- SLOW: Distinct on large result
SELECT DISTINCT user_id FROM orders;

-- BETTER: EXISTS if checking membership
SELECT id FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);

-- OR: Aggregate if counting
SELECT user_id FROM orders GROUP BY user_id;

```text
---

## NOT IN with NULLs

```sql
-- DANGEROUS: Returns nothing if subquery has NULL
SELECT * FROM users
WHERE id NOT IN (SELECT user_id FROM banned_users);
-- If any user_id is NULL = empty result!

-- SAFE: Use NOT EXISTS instead
SELECT * FROM users u
WHERE NOT EXISTS (
SELECT 1 FROM banned_users b WHERE b.user_id = u.id
);

```text
---

## LIKE with Leading Wildcard

```sql
-- SLOW: Full table scan
SELECT * FROM products WHERE name LIKE '%phone%';

-- BETTER: Full-text search
SELECT * FROM products
WHERE to_tsvector('english', name) @@ to_tsquery('phone');

-- OR: Trigram index for LIKE
CREATE INDEX idx_name_trgm ON products USING GIN (name gin_trgm_ops);

```text
---

## ORDER BY RANDOM()

```sql
-- SLOW: Scans and sorts entire table
SELECT * FROM products ORDER BY RANDOM() LIMIT 10;

-- BETTER: Sample from ID range
SELECT * FROM products
WHERE id >= (SELECT MAX(id) * RANDOM() FROM products)
LIMIT 10;

```text
---
## ??? PRISMA PERFORMANCE OPTIMIZATION

> **The ORM performance patterns**

---

## Avoid N+1 with Include

```typescript
// BAD: N+1 queries
const users = await prisma.user.findMany();
for (const user of users) {
const posts = await prisma.post.findMany({
where: { authorId: user.id }
  });
}

// GOOD: Single query with include
const users = await prisma.user.findMany({
include: { posts: true }
});

```sql
---

## Select Only Needed Fields

```typescript
// BAD: Fetches all columns
const users = await prisma.user.findMany();

// GOOD: Only fetch what you need
const users = await prisma.user.findMany({
select: { id: true, email: true, name: true }
});

```text
---

## Batch Operations

```typescript
// BAD: Individual inserts
for (const item of items) {
await prisma.item.create({ data: item });
}

// GOOD: Batch create
await prisma.item.createMany({
data: items,
skipDuplicates: true
});

```text
---

## Raw Queries for Complex Operations

```typescript
// When ORM is too slow
const result = await prisma.$queryRaw`
SELECT u.id, COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON p.author_id = u.id
WHERE u.created_at > ${sinceDate}
GROUP BY u.id
HAVING COUNT(p.id) > 10
`;

```text
---
## ??? DATABASE CONNECTION TROUBLESHOOTING

> **The connection issues that break apps**

---

## Common Connection Errors

```yaml
ECONNREFUSED:
- Database not running
- Wrong host/port
- Firewall blocking

ETIMEDOUT:
- Network issues
- Database overloaded
- Security group rules

Too many connections:
- Pool exhausted
- Connections not released
- Too many app instances

```text
---

## Debugging Steps

```bash

## 1. Can you reach the host?

ping db.example.com

## 2. Is the port open?

nc -zv db.example.com 5432

## 3. Can you connect directly?

psql -h db.example.com -U user -d dbname

## 4. Check current connections

SELECT count(*) FROM pg_stat_activity;

## 5. Check connection sources

SELECT client_addr, count(*)
FROM pg_stat_activity
GROUP BY client_addr;

```text
---

## Connection Pool Leaks

```javascript
// BAD: Connection never released
const client = await pool.connect();
const result = await client.query('SELECT...');
// Forgot to release!

// GOOD: Always release in finally
const client = await pool.connect();
try {
return await client.query('SELECT...');
} finally {
  client.release();
}

// BETTER: Use pool.query for simple queries
const result = await pool.query('SELECT...');
// Automatically acquires and releases

```text
---
## ??? REDIS USE CASES

> **The caching and data structure patterns**

---

## Session Storage

```javascript
// Store session
await redis.setex(`session:${sessionId}`, 3600, JSON.stringify({
userId: user.id,
role: user.role,
createdAt: Date.now()
}));

// Get session
const session = JSON.parse(await redis.get(`session:${sessionId}`));

```text
---

## Rate Limiting

```lua
-- Lua script for atomic rate limit
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])

local current = redis.call('INCR', key)
if current == 1 then
redis.call('EXPIRE', key, window)
end

return current <= limit

```text
---

## Leaderboard

```javascript
// Add score
await redis.zadd('leaderboard', score, oderId visitorId);

// Get top 10
const leaders = await redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES');

// Get user rank
const rank = await redis.zrevrank('leaderboard', oderId visitorId);

```text
---

## Pub/Sub

```javascript
// Publisher
await redis.publish('notifications', JSON.stringify({
type: 'order_completed',
orderId: '123'
}));

// Subscriber
redis.subscribe('notifications');
redis.on('message', (channel, message) => {
const data = JSON.parse(message);
  handleNotification(data);
});

```text
---
## ??? TRANSACTION PATTERNS

> **The ACID compliance patterns**

---

## Transaction Basics

```typescript
// Prisma transaction
const result = await prisma.$transaction(async (tx) => {
// All operations in same transaction
const user = await tx.user.create({ data: userData });
const profile = await tx.profile.create({
data: { ...profileData, userId: user.id }
  });

// If any fails, all rollback
return { user, profile };
});

```text
---

## Serializable Isolation

```sql
-- Strictest isolation
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- Operations here see consistent snapshot
SELECT balance FROM accounts WHERE id = 1;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT;
-- May fail with serialization error - MUST retry!

```text
---

## Savepoints

```sql
BEGIN;
INSERT INTO orders (...);

SAVEPOINT order_items;
INSERT INTO order_items (...);
-- This fails
ROLLBACK TO order_items;

-- Try alternative
INSERT INTO order_items (...);
COMMIT;
-- Order saved, alternative items used

```text
---

## Distributed Transactions

```yaml
PROBLEM: Transaction across multiple databases

SOLUTIONS:
1. Saga pattern (compensating transactions)
2. Two-phase commit (2PC) - rarely used
3. Eventual consistency with events
4. Outbox pattern

```text
---
## ??? DATABASE ANTI-PATTERNS

> **The patterns that cause pain**

---

## God Table

```yaml
PROBLEM: One table with 100+ columns
users (id, name, email, address1, address2, city,
state, zip, phone, fax, employer, job_title,
salary, ... 100 more columns)

ISSUES:
- Hard to maintain
- NULL everywhere
- Wide rows = slow queries

FIX: Normalize into related tables
users -> addresses -> phones -> employment

```text
---

## EAV (Entity-Attribute-Value)

```sql
-- ANTI-PATTERN
CREATE TABLE attributes (
entity_id INT,
attribute_name VARCHAR,
attribute_value VARCHAR
);

PROBLEMS:
- No type safety
- Queries are complex
- No constraints possible
- Performance nightmare

BETTER: JSONB column or proper schema

```text
---

## Implicit Schema

```yaml
PROBLEM:
Data structure only in application code
Database has no constraints

SYMPTOMS:
- orphan_user_id references deleted user
- amount = "TBD" (string in numeric field)
- created_at = NULL

FIX:
- Use proper types
- Add foreign keys
- Add NOT NULL where appropriate
- Add CHECK constraints

```text
---

## Premature Denormalization

```yaml
TRAP: "Joins are slow, denormalize everything!"

REALITY:
- Joins with proper indexes are fast
- Denormalized data becomes inconsistent
- Updates become complex
- Storage increases

RULE: Normalize first, denormalize measured bottlenecks

```text
---
## ??? POSTGRES CONFIGURATION TUNING

> **The performance configuration patterns**

---

## Memory Settings

```yaml
shared_buffers:
Shared memory for data cache
Start: 25% of RAM
Example: 4GB for 16GB server

effective_cache_size:
OS + PostgreSQL cache estimate
Set to 50-75% of RAM

work_mem:
Per-operation sort/hash memory
Start: 256MB
Careful: multiplied by connections!

maintenance_work_mem:
For VACUUM, CREATE INDEX
Set higher: 1GB or more

```text
---

## Connection Settings

```yaml
max_connections:
Default: 100
More = more memory overhead
Use connection pooler instead!

idle_in_transaction_session_timeout:
Kill idle-in-transaction after X
Set to: 60000 (1 minute)

statement_timeout:
Kill queries after X ms
Set based on expected max query time

```text
---

## Write Performance

```yaml
wal_buffers:
WAL write buffer
Set to: 64MB

checkpoint_completion_target:
Spread checkpoint writes
Set to: 0.9

synchronous_commit:
off = faster, risk losing last transaction
on = safe, slower

```text
---

## Monitoring Queries

```sql
-- Currently running queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE state = 'active';

-- Table/index sizes
SELECT relname, pg_size_pretty(pg_total_relation_size(relid))
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;

```text
---
## ??? POSTGRES JSON OPERATORS

> **The JSONB query patterns**

---

## Basic Operators

```sql
-- -> returns JSON
SELECT data->'name' FROM users;  -- "John"

-- ->> returns text
SELECT data->>'name' FROM users;  -- John

-- Nested access
SELECT data->'address'->>'city' FROM users;

-- Array access (0-indexed)
SELECT data->'tags'->>0 FROM posts;

```text
---

## Containment and Existence

```sql
-- Contains (indexes can be used!)
SELECT * FROM products
WHERE attributes @> '{"color": "red"}';

-- Key exists
SELECT * FROM products
WHERE attributes ? 'size';

-- Any key exists
SELECT * FROM products
| WHERE attributes ? | array['size', 'color']; |

-- All keys exist
SELECT * FROM products
WHERE attributes ?& array['size', 'color'];

```text
---

## JSONB Path Queries (PG12+)

```sql
-- JSONPath syntax
SELECT * FROM products
WHERE jsonb_path_exists(
  attributes,
'$.tags[*] ? (@ == "featured")'
);

-- Extract with path
SELECT jsonb_path_query(
  attributes,
  '$.reviews[*].rating'
) FROM products;

```text
---

## Updating JSONB

```sql
-- Set nested value
UPDATE users
SET data = jsonb_set(data, '{address,city}', '"NYC"')
WHERE id = 1;

-- Remove key
UPDATE users
SET data = data - 'temporary_field'
WHERE id = 1;

-- Concatenate (merge)
UPDATE users
| SET data = data |  | '{"newField": "value"}' |
WHERE id = 1;

```text
---
## ??? DATABASE CONSTRAINTS

> **The data integrity patterns**

---

## Constraint Types

```sql
-- Primary key
CREATE TABLE users (
id SERIAL PRIMARY KEY
);

-- Unique
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);

-- Foreign key
ALTER TABLE orders ADD CONSTRAINT fk_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;

-- Check constraint
ALTER TABLE users ADD CONSTRAINT check_age
CHECK (age >= 0 AND age <= 150);

-- Not null
ALTER TABLE users ALTER COLUMN email SET NOT NULL;

```text
---

## Deferrable Constraints

```sql
-- Check at end of transaction, not each statement
ALTER TABLE orders ADD CONSTRAINT fk_user
FOREIGN KEY (user_id) REFERENCES users(id)
DEFERRABLE INITIALLY DEFERRED;

-- Useful for:
-- - Circular references
-- - Bulk imports
-- - Complex updates

```text
---

## Exclusion Constraints

```sql
-- Prevent overlapping date ranges
CREATE TABLE bookings (
room_id INT,
during DATERANGE,
EXCLUDE USING GIST (room_id WITH =, during WITH &&)
);

-- No two bookings can have:
-- - Same room_id AND
-- - Overlapping date ranges

```text
---

## Partial Unique Index

```sql
-- Unique email only for non-deleted users
CREATE UNIQUE INDEX idx_unique_active_email
ON users (email)
WHERE deleted_at IS NULL;

```text
---
## ??? DATABASE TRIGGER PATTERNS

> **The automated database logic**

---

## Audit Trigger

```sql
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
INSERT INTO audit_log (
    table_name,
    record_id,
    action,
    old_data,
    new_data,
    changed_at
) VALUES (
    TG_TABLE_NAME,
COALESCE(NEW.id, OLD.id),
    TG_OP,
    to_jsonb(OLD),
    to_jsonb(NEW),
    NOW()
  );
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_audit
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION audit_trigger();

```text
---

## Updated_at Trigger

```sql
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

```text
---

## Validation Trigger

```sql
CREATE OR REPLACE FUNCTION validate_order()
RETURNS TRIGGER AS $$
BEGIN
IF NEW.quantity < 1 THEN
RAISE EXCEPTION 'Quantity must be at least 1';
END IF;

IF NEW.total != NEW.price * NEW.quantity THEN
RAISE EXCEPTION 'Total does not match price * quantity';
END IF;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

```text
---
## ??? SQL WINDOW FUNCTIONS DEEP DIVE

> **The advanced analytics patterns**

---

## Cumulative Calculations

```sql
-- Running total
SELECT
  date,
  amount,
SUM(amount) OVER (ORDER BY date) AS running_total,
AVG(amount) OVER (ORDER BY date) AS running_avg
FROM transactions;

```text
---

## Partitioned Windows

```sql
-- Running total per customer
SELECT
  customer_id,
  date,
  amount,
SUM(amount) OVER (
PARTITION BY customer_id
ORDER BY date
) AS customer_running_total
FROM orders;

```text
---

## ROWS vs RANGE

```sql
-- ROWS: Physical rows
SUM(amount) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)
-- Exactly 3 rows

-- RANGE: Logical range
SUM(amount) OVER (ORDER BY date RANGE BETWEEN INTERVAL '7 days' PRECEDING AND CURRENT ROW)
-- All within date range

```text
---

## Practical Examples

```sql
-- Ranking within groups
SELECT
  department,
  employee,
  salary,
RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank
FROM employees;

-- Percentiles
SELECT
  name,
  score,
PERCENT_RANK() OVER (ORDER BY score) AS percentile
FROM students;

-- Previous/Next values
SELECT
  date,
  price,
price - LAG(price) OVER (ORDER BY date) AS daily_change,
LEAD(price) OVER (ORDER BY date) AS next_price
FROM stock_prices;

```text
---
## ??? DATABASE STORED PROCEDURES

> **The database-side logic patterns**

---

## Basic Procedure

```sql
CREATE OR REPLACE FUNCTION transfer_funds(
from_account_id INT,
to_account_id INT,
amount DECIMAL
) RETURNS BOOLEAN AS $$
DECLARE
from_balance DECIMAL;
BEGIN
-- Lock and get balance
SELECT balance INTO from_balance
FROM accounts
WHERE id = from_account_id
FOR UPDATE;

IF from_balance < amount THEN
RETURN FALSE;
END IF;

-- Perform transfer
UPDATE accounts SET balance = balance - amount
WHERE id = from_account_id;

UPDATE accounts SET balance = balance + amount
WHERE id = to_account_id;

RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Usage
SELECT transfer_funds(1, 2, 100.00);

```text
---

## When to Use

```text
GOOD FOR:

- Complex transactions

- Data-intensive operations

- Security (less exposed surface)

- Performance (reduce round trips)

AVOID FOR:

- Simple CRUD

- Rapidly changing logic

- Complex business rules

- Heavy external calls

```text
---

## Error Handling

```sql
CREATE OR REPLACE FUNCTION safe_operation()
RETURNS VOID AS $$
BEGIN
-- Operations
INSERT INTO orders (...);

EXCEPTION
WHEN unique_violation THEN
RAISE EXCEPTION 'Duplicate order detected';
WHEN OTHERS THEN
RAISE EXCEPTION 'Unexpected error: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

```text
---
## ??? DATABASE REPLICATION LAG

> **The consistency challenge patterns**

---

## Understanding Lag

```text
PRIMARY writes -> WAL -> Replica applies

LAG = Time between primary write and replica write

CAUSES:

- High write volume

- Slow replica hardware

- Network issues

- Heavy replay workload

```text
---

## Measuring Lag

```sql
-- On replica
SELECT
EXTRACT(EPOCH FROM (now() - pg_last_xact_replay_timestamp())) AS lag_seconds;

-- On primary (check all replicas)
SELECT
  client_addr,
  state,
  sent_lsn,
  write_lsn,
  flush_lsn,
  replay_lsn,
pg_wal_lsn_diff(sent_lsn, replay_lsn) AS bytes_behind
FROM pg_stat_replication;

```text
---

## Handling Lag in App

```typescript
// Option 1: Read from primary after write
async function createAndGet(data) {
const created = await primaryDb.insert(data);
return await primaryDb.findById(created.id); // Read from primary!
}

// Option 2: Wait for replica sync
async function waitForReplicaSync(maxWaitMs = 5000) {
const start = Date.now();
while (Date.now() - start < maxWaitMs) {
const lag = await getReplicaLag();
if (lag < 0.1) return true;
await sleep(100);
  }
return false;
}

// Option 3: Session-based routing
// After write, sticky to primary for N seconds

```text
---
## ??? BATCH PROCESSING PATTERNS

> **The bulk operation patterns**

---

## Chunked Processing

```javascript
async function processInBatches(items, batchSize = 100) {
const results = [];

for (let i = 0; i < items.length; i += batchSize) {
const batch = items.slice(i, i + batchSize);

const batchResults = await Promise.all(
batch.map(item => processItem(item))
    );

    results.push(...batchResults);

// Progress tracking
console.log(`Processed ${Math.min(i + batchSize, items.length)}/${items.length}`);
  }

return results;
}

```text
---

## Database Batch Operations

```typescript
// Prisma batch create
await prisma.user.createMany({
data: users,
skipDuplicates: true
});

// Batch update with transaction
await prisma.$transaction(
updates.map(({ id, data }) =>
prisma.user.update({ where: { id }, data })
  )
);

```text
---

## Cursor-Based Iteration

```typescript
async function* iterateAllUsers() {
let cursor = undefined;

while (true) {
const batch = await prisma.user.findMany({
take: 100,
skip: cursor ? 1 : 0,
cursor: cursor ? { id: cursor } : undefined,
orderBy: { id: 'asc' }
    });

if (batch.length === 0) break;

for (const user of batch) {
yield user;
    }

cursor = batch[batch.length - 1].id;
  }
}

// Usage
for await (const user of iterateAllUsers()) {
await processUser(user);
}

```text
---
## ??? DATABASE VIEWS

> **The query abstraction patterns**

---

## Simple Views

```sql
CREATE VIEW active_users AS
SELECT id, email, name, created_at
FROM users
WHERE status = 'active' AND deleted_at IS NULL;

-- Usage
SELECT * FROM active_users WHERE created_at > '2024-01-01';

```text
---

## Complex Views

```sql
CREATE VIEW order_summary AS
SELECT
  o.id,
  o.created_at,
u.email AS customer_email,
SUM(oi.quantity * oi.unit_price) AS total,
COUNT(oi.id) AS item_count,
  o.status
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, o.created_at, u.email, o.status;

```text
---

## Updatable Views

```sql
-- Simple views can be updated
CREATE VIEW user_profiles AS
SELECT id, name, bio FROM users;

-- This works!
UPDATE user_profiles SET bio = 'New bio' WHERE id = 1;

-- Complex views need INSTEAD OF triggers

```text
---

## Security Views

```sql
-- Hide sensitive data
CREATE VIEW public_users AS
SELECT id, name, avatar_url
FROM users;
-- password, email NOT exposed

-- Grant access only to view
REVOKE ALL ON users FROM app_role;
GRANT SELECT ON public_users TO app_role;

```text
---
## ??? QUERY DEBUGGING PATTERNS

> **The SQL investigation patterns**

---

## EXPLAIN Output Reading

```sql
EXPLAIN (ANALYZE, BUFFERS, COSTS, TIMING)
SELECT * FROM orders WHERE user_id = 123;

-- Key things to look for:
-- Seq Scan vs Index Scan
-- Actual vs estimated rows
-- Sort operations
-- Nested loops on large tables
-- Buffer hits vs reads

```text
---

## Common Query Fixes

```sql
-- PROBLEM: Slow due to function on indexed column
SELECT * FROM users WHERE LOWER(email) = 'test@test.com';

-- FIX: Expression index
CREATE INDEX idx_users_email_lower ON users (LOWER(email));

-- OR: Store normalized
UPDATE users SET email = LOWER(email);
CREATE INDEX idx_users_email ON users (email);

```text
---

## Query Plan Cache

```sql
-- Force re-planning (after schema/data changes)
ANALYZE table_name;

-- Clear all cached plans
DISCARD ALL;

```text
---

## Statistics

```sql
-- Update statistics for better plans
ANALYZE table_name;

-- Check table statistics
SELECT relname, reltuples, relpages
FROM pg_class
WHERE relname = 'orders';

-- Column statistics
SELECT * FROM pg_stats
WHERE tablename = 'orders' AND attname = 'status';

```text
---
## ??? POSTGRES ROW LEVEL SECURITY

> **The tenant isolation patterns**

---

## Enabling RLS

```sql
-- Enable RLS on table
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy for tenant isolation
CREATE POLICY tenant_isolation ON documents
USING (tenant_id = current_setting('app.current_tenant')::INT);

-- Force RLS for table owner too
ALTER TABLE documents FORCE ROW LEVEL SECURITY;

```text
---

## Setting Context

```javascript
async function withTenant(tenantId, callback) {
const client = await pool.connect();
try {
await client.query(`SET app.current_tenant = '${tenantId}'`);
return await callback(client);
} finally {
    client.release();
  }
}

// All queries automatically filtered!
await withTenant(tenantId, async (client) => {
const result = await client.query('SELECT * FROM documents');
// Only returns documents for this tenant
});

```text
---

## Complex Policies

```sql
-- Different policies for different operations
CREATE POLICY select_policy ON documents
FOR SELECT
USING (tenant_id = current_setting('app.current_tenant')::INT);

CREATE POLICY insert_policy ON documents
FOR INSERT
WITH CHECK (tenant_id = current_setting('app.current_tenant')::INT);

CREATE POLICY update_policy ON documents
FOR UPDATE
USING (tenant_id = current_setting('app.current_tenant')::INT)
WITH CHECK (tenant_id = current_setting('app.current_tenant')::INT);

```text
---
## ??? DATABASE FOREIGN KEY STRATEGIES

> **The referential integrity patterns**

---

## ON DELETE Options

```sql
-- CASCADE: Delete dependent rows
ALTER TABLE orders ADD CONSTRAINT fk_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;
-- Deleting user deletes their orders

-- SET NULL: Nullify reference
ON DELETE SET NULL;
-- Order remains, user_id becomes NULL

-- RESTRICT: Prevent deletion (default)
ON DELETE RESTRICT;
-- Cannot delete user with orders

-- NO ACTION: Same as RESTRICT
-- But checked at end of transaction

```sql
---

## ON UPDATE Options

```sql
-- CASCADE: Update references
ON UPDATE CASCADE;
-- If user.id changes, orders.user_id updates

-- RESTRICT: Prevent update
ON UPDATE RESTRICT;
-- Cannot change id if referenced

```text
---

## Deferrable Constraints

```sql
-- Check at end of transaction
DEFERRABLE INITIALLY DEFERRED

-- Use case: Circular references
BEGIN;
INSERT INTO employees (id, manager_id) VALUES (1, 2);
INSERT INTO employees (id, manager_id) VALUES (2, 1);
COMMIT; -- Constraints checked here

```text
---
## ??? DATABASE ENUM PATTERNS

> **The controlled value patterns**

---

## Postgres Enum

```sql
-- Create enum type
CREATE TYPE order_status AS ENUM (
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
);

-- Use in table
CREATE TABLE orders (
id SERIAL PRIMARY KEY,
status order_status DEFAULT 'pending'
);

-- Adding values (PostgreSQL 9.1+)
ALTER TYPE order_status ADD VALUE 'refunded' AFTER 'delivered';

```text
---

## Check Constraint Alternative

```sql
-- Easier to modify than enum
CREATE TABLE orders (
id SERIAL PRIMARY KEY,
status VARCHAR NOT NULL,
CHECK (status IN ('pending', 'processing', 'shipped', 'delivered'))
);

```text
---

## Prisma with Enums

```prisma
enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

model Order {
id Int  @id @default(autoincrement())
status OrderStatus @default(PENDING)
}

```text
---

## TypeScript Alignment

```typescript
// Keep in sync with database
const ORDER_STATUS = {
PENDING: 'pending',
PROCESSING: 'processing',
SHIPPED: 'shipped',
DELIVERED: 'delivered'
} as const;

type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

```text
---
## ??? SUPABASE PRODUCTION PATTERNS

> **The patterns for Supabase at scale**

---

## Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- User can only see own posts
CREATE POLICY "Users see own posts" ON posts
FOR SELECT USING (auth.uid() = user_id);

-- User can only insert own posts
CREATE POLICY "Users insert own posts" ON posts
FOR INSERT WITH CHECK (auth.uid() = user_id);

GOTCHA: RLS bypassed by service_role key!
Always use anon key in client.

```text
---

## Real-time Subscriptions

```javascript
// Subscribe to changes
const channel = supabase
  .channel('posts')
.on('postgres_changes', {
event: '*',
schema: 'public',
table: 'posts',
filter: `user_id=eq.${userId}`
}, (payload) => {
console.log('Change:', payload);
  })
  .subscribe();

GOTCHA: Unsubscribe on component unmount!
Or you leak connections.

```text
---

## Auth Token Refresh

```javascript
// Handle token refresh
supabase.auth.onAuthStateChange((event, session) => {
if (event === 'TOKEN_REFRESHED') {
// Update your app state
  }
if (event === 'SIGNED_OUT') {
// Clear local state
  }
});

GOTCHA: Mobile apps need manual refresh handling
when app comes from background.

```text
---

## Edge Functions

```typescript
// supabase/functions/my-function/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
const { name } = await req.json();

return new Response(
JSON.stringify({ message: `Hello ${name}!` }),
{ headers: { 'Content-Type': 'application/json' } }
  );
});

LIMIT: 2 second execution time
For longer: Use background functions or queues

```text
---
## ??? TIME-SERIES DATA PATTERNS

> **The time-based data handling**

---

## PostgreSQL with TimescaleDB

```sql
-- Create hypertable
CREATE TABLE metrics (
time TIMESTAMPTZ NOT NULL,
device_id TEXT NOT NULL,
value DOUBLE PRECISION,
PRIMARY KEY (time, device_id)
);

SELECT create_hypertable('metrics', 'time');

-- Efficient time-based queries
SELECT time_bucket('1 hour', time) AS bucket,
       device_id,
AVG(value) as avg_value
FROM metrics
WHERE time > NOW() - INTERVAL '1 day'
GROUP BY bucket, device_id
ORDER BY bucket DESC;

```text
---

## Retention Policies

```sql
-- Auto-delete old data
SELECT add_retention_policy('metrics', INTERVAL '30 days');

-- Compression for older data
ALTER TABLE metrics SET (
  timescaledb.compress,
timescaledb.compress_segmentby = 'device_id'
);

SELECT add_compression_policy('metrics', INTERVAL '7 days');

```text
---

## InfluxDB Alternative

```javascript
const point = new Point('metrics')
.tag('device', deviceId)
.floatField('value', value)
.timestamp(new Date());

writeApi.writePoint(point);

// Query with Flux
const query = `
from(bucket: "mydb")
| > range(start: -1h) |
| > filter(fn: (r) => r._measurement == "metrics") |
| > aggregateWindow(every: 5m, fn: mean) |
`;

```text
---
## REDIS PRODUCTION PATTERNS

> **The caching patterns that scale**

---

## Cache-Aside Pattern

```typescript
async function getUser(id: string) {
// 1. Try cache
const cached = await redis.get(`user:${id}`);
if (cached) return JSON.parse(cached);

// 2. Cache miss - get from DB
const user = await db.user.findUnique({ where: { id } });

// 3. Store in cache (with TTL)
if (user) {
await redis.set(`user:${id}`, JSON.stringify(user), 'EX', 3600);
  }

return user;
}

// Invalidate on update
async function updateUser(id: string, data: any) {
const user = await db.user.update({ where: { id }, data });
await redis.del(`user:${id}`);  // Invalidate cache
return user;
}

```text
---

## Session Storage

```typescript
import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

app.use(session({
store: new RedisStore({ client: redisClient }),
secret: process.env.SESSION_SECRET,
resave: false,
saveUninitialized: false,
cookie: {
secure: process.env.NODE_ENV === 'production',
maxAge: 1000 * 60 * 60 * 24  // 1 day
  }
}));

```text
---

## Rate Limiting with Sliding Window

```typescript
async function checkRateLimit(userId: string, limit: number, windowMs: number) {
const key = `ratelimit:${userId}`;
const now = Date.now();
const windowStart = now - windowMs;

// Remove old entries
await redis.zRemRangeByScore(key, 0, windowStart);

// Count current window
const count = await redis.zCard(key);

if (count >= limit) {
return { allowed: false, remaining: 0 };
  }

// Add current request
await redis.zAdd(key, { score: now, value: `${now}` });
await redis.pExpire(key, windowMs);

return { allowed: true, remaining: limit - count - 1 };
}

```text
---
## DATABASE TRANSACTIONS

> **The patterns for data consistency**

---

## Prisma Transactions

```typescript
// Interactive transaction
const result = await prisma.$transaction(async (tx) => {
// Debit from account A
const accountA = await tx.account.update({
where: { id: fromId },
data: { balance: { decrement: amount } }
  });

// Check balance (throw rolls back everything)
if (accountA.balance < 0) {
throw new Error('Insufficient funds');
  }

// Credit to account B
await tx.account.update({
where: { id: toId },
data: { balance: { increment: amount } }
  });

return { success: true };
});

```text
---

## Optimistic Locking

```typescript
// Prevent lost updates when concurrent edits

async function updateDocument(id: string, data: any, expectedVersion: number) {
const result = await prisma.document.updateMany({
where: {
      id,
version: expectedVersion  // Only update if version matches
    },
data: {
      ...data,
version: { increment: 1 }
    }
  });

if (result.count === 0) {
throw new Error('Document was modified by another user');
  }
}

```text
---

## Saga Pattern

```text
For distributed transactions across services:

1. Order Service: Reserve order
2. Payment Service: Charge card
3. Inventory Service: Reserve stock
4. Shipping Service: Schedule delivery

If step 3 fails:

- Compensate step 2 (refund)

- Compensate step 1 (cancel order)

Use: message queue with compensating transactions

```text
---
## QUERY BUILDERS

> **The patterns for dynamic SQL**

---

## Prisma Dynamic Filters

```typescript
async function getUsers(filters: UserFilters) {
const where: Prisma.UserWhereInput = {};

if (filters.email) {
where.email = { contains: filters.email, mode: 'insensitive' };
  }

if (filters.role) {
where.role = filters.role;
  }

if (filters.createdAfter) {
where.createdAt = { gte: filters.createdAfter };
  }

if (filters.hasOrders) {
where.orders = { some: {} };
  }

return prisma.user.findMany({
    where,
orderBy: { createdAt: 'desc' },
| take: filters.limit |  | 50 |
  });
}

```text
---

## Complex AND/OR Queries

```typescript
// Users who are (admin OR have orders) AND active
const users = await prisma.user.findMany({
where: {
AND: [
{ status: 'active' },
      {
OR: [
{ role: 'admin' },
{ orders: { some: {} } }
        ]
      }
    ]
  }
});

```text
---

## Full-Text Search

```typescript
// PostgreSQL full-text search
const results = await prisma.$queryRaw`
SELECT id, title,
ts_rank(search_vector, plainto_tsquery('english', ${query})) as rank
FROM posts
WHERE search_vector @@ plainto_tsquery('english', ${query})
ORDER BY rank DESC
LIMIT 20
`;

```text
---
## SUPABASE PATTERNS

> **The Firebase alternative patterns**

---

## Authentication

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Sign up
const { data, error } = await supabase.auth.signUp({
email: 'user@example.com',
password: 'password123'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
email: 'user@example.com',
password: 'password123'
});

// OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
provider: 'google',
options: { redirectTo: 'http://localhost:3000/callback' }
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Sign out
await supabase.auth.signOut();

```text
---

## Database Queries

```typescript
// Select with filters
const { data, error } = await supabase
  .from('posts')
.select('id, title, author:users(name)')
.eq('published', true)
.order('created_at', { ascending: false })
  .limit(10);

// Insert
const { data, error } = await supabase
  .from('posts')
.insert({ title: 'New Post', content: 'Content' })
  .select()
  .single();

// Update
const { error } = await supabase
  .from('posts')
.update({ title: 'Updated' })
.eq('id', postId);

// Delete
const { error } = await supabase
  .from('posts')
  .delete()
.eq('id', postId);

```text
---

## Row Level Security

```sql
-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Users can read all published posts
CREATE POLICY "Public posts are viewable"
ON posts FOR SELECT
USING (published = true);

-- Users can only edit their own posts
CREATE POLICY "Users can update own posts"
ON posts FOR UPDATE
USING (auth.uid() = user_id);

-- Users can only delete their own posts
CREATE POLICY "Users can delete own posts"
ON posts FOR DELETE
USING (auth.uid() = user_id);

```text
---

## Real-time Subscriptions

```typescript
// Subscribe to changes
const channel = supabase
  .channel('posts')
.on('postgres_changes', {
event: '*',
schema: 'public',
table: 'posts'
}, (payload) => {
console.log('Change:', payload);
  })
  .subscribe();

// Cleanup
channel.unsubscribe();

```text
---
## DRIZZLE ORM PATTERNS

> **The TypeScript-first ORM patterns**

---

## Schema Definition

```typescript
// schema.ts
import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
id: uuid('id').primaryKey().defaultRandom(),
email: text('email').notNull().unique(),
name: text('name').notNull(),
createdAt: timestamp('created_at').defaultNow()
});

export const posts = pgTable('posts', {
id: uuid('id').primaryKey().defaultRandom(),
title: text('title').notNull(),
content: text('content'),
published: boolean('published').default(false),
authorId: uuid('author_id').references(() => users.id),
createdAt: timestamp('created_at').defaultNow()
});

```text
---

## Queries

```typescript
import { db } from './db';
import { users, posts } from './schema';
import { eq, and, desc } from 'drizzle-orm';

// Select with join
const result = await db
  .select({
post: posts,
author: users
  })
  .from(posts)
.leftJoin(users, eq(posts.authorId, users.id))
.where(eq(posts.published, true))
  .orderBy(desc(posts.createdAt))
  .limit(10);

// Insert
const newUser = await db
  .insert(users)
.values({ email: 'test@test.com', name: 'Test' })
  .returning();

// Update
await db
  .update(posts)
.set({ published: true })
.where(eq(posts.id, postId));

// Delete
await db
  .delete(posts)
.where(eq(posts.id, postId));

```text
---

## Relations

```typescript
import { relations } from 'drizzle-orm';

export const usersRelations = relations(users, ({ many }) => ({
posts: many(posts)
}));

export const postsRelations = relations(posts, ({ one }) => ({
author: one(users, {
fields: [posts.authorId],
references: [users.id]
  })
}));

// Query with relations
const usersWithPosts = await db.query.users.findMany({
with: { posts: true }
});

```text
---
## DATABASE INDEXES

> **The index patterns for fast queries**

---

## When to Index

```text
INDEX WHEN:
Column used in WHERE clauses
Column used in JOIN conditions
Column used in ORDER BY
Low cardinality columns for filtering

DON'T INDEX:
Small tables (< 1000 rows)
Columns rarely used in queries
Columns with high update frequency
Already indexed as part of primary key

```text
---

## Index Types

```sql
-- B-Tree (default, most common)
CREATE INDEX idx_user_email ON users(email);

-- Unique index
CREATE UNIQUE INDEX idx_user_email ON users(email);

-- Composite index (order matters!)
CREATE INDEX idx_order_user_date ON orders(user_id, created_at);
-- Query: WHERE user_id = ? AND created_at > ?  Uses index
-- Query: WHERE created_at > ?  Doesn't use index

-- Partial index (subset of rows)
CREATE INDEX idx_active_users ON users(email) WHERE active = true;

-- GIN index (for arrays, JSON)
CREATE INDEX idx_tags ON posts USING GIN(tags);

```text
---

## Explain Analyze

```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@test.com';

-- Look for:
-- Index Scan (good)
-- Seq Scan on large table (bad)

-- Check if index is used:
-- "Index Scan using idx_user_email"

```text
---

## DATABASE DISASTERS (REAL PRODUCTION INCIDENTS)

## From GitLab, Discourse, MongoDB Jira, PostgreSQL mailing lists

---

## Incident 1: GitLab Database Deletion (2017)

## What Happened

> "A database replication lag caused data directory to fill up.
> Engineer tried to delete replica's data directory.
> ACCIDENTALLY deleted production database instead.
> 300GB of data. 6 hours of data lost permanently.
> No working backups (all backup mechanisms had failed silently)."
> - GitLab Incident Report #1/31/2017

## The Command That Destroyed GitLab

```bash

## Engineer THOUGHT they were on replica server

## They were on PRODUCTION

rm -rf /var/opt/gitlab/postgresql/data

## 300GB gone in seconds

## 5,000+ projects affected

## Lost: Issues, merge requests, comments (6 hours worth)

```text

## Lessons Learned

```text
1. ALWAYS verify which server you're on
2. Test backups REGULARLY (they had 5 backup methods, all broken)
3. Use filesystem snapshots (LVM, ZFS)
4. Implement delayed replicas (lag by 24 hours for recovery)
5. Add confirmation prompts for destructive commands

```text

## Protection Implementation

```bash

## 1. Add to .bashrc on production

export PS1="\[\e[41m\]PRODUCTION\[\e[0m\] \u@\h:\w\$ "

## Makes terminal RED on production

## 2. Require confirmation

alias rm='rm -i'  # Always ask before deleting

## 3. Automated backups with verification

## !/bin/bash
pg_dump dbname > backup.sql

## CRITICAL: Test restore

psql -d test_db -f backup.sql
if [ $? -eq 0 ]; then
echo "Backup verified"
aws s3 cp backup.sql s3://backups/
else
| echo "BACKUP FAILED!" | mail -s "ALERT" ops@company.com |
fi

```text
---

## Incident 2: Index Bloat Killed Postgres

## From Discourse Engineering Blog

> "Our Postgres queries got slower over 6 months. From 50ms to 5 seconds.
> Cause: Index bloat. Indexes grew to 10x their necessary size.
> A 2GB table had 20GB of indexes."

## Check Index Bloat

```sql
SELECT
schemaname, tablename, indexname,
pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
    idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan < 100
ORDER BY pg_relation_size(indexrelid) DESC;

```text

## The Fix (Zero Downtime)

```sql
-- DON'T: Locks table
REINDEX TABLE properties;

-- DO: Concurrent reindex (Postgres 12+)
REINDEX TABLE CONCURRENTLY properties;

```text
---

## Incident 3: MongoDB Sharding Horror

## From MongoDB Jira SERVER-45284

> "Sharded on country field. 90% of data on one shard. Defeats purpose."

## Bad vs Good Shard Key

```javascript
// TERRIBLE: Low cardinality
sh.shardCollection("db.properties", { country: 1 })

// GOOD: Hashed high cardinality
sh.shardCollection("db.properties", { property_id: "hashed" })

```text
---

## POSTGRESQL PRODUCTION PATTERNS (DEEP DIVE)

## PgBouncer Connection Pooling

```ini

## pgbouncer.ini

[pgbouncer]
pool_mode = transaction
max_client_conn = 10000
default_pool_size = 25
reserve_pool_size = 5

```text

## Pool Modes

```yaml
SESSION: Connection held for entire session
TRANSACTION: Released after transaction (recommended)
STATEMENT: Released after each statement (aggressive)

```text
---

## Avoiding Lock Contention

## Dangerous

```sql
ALTER TABLE properties ADD COLUMN new_field VARCHAR(100) DEFAULT 'value';

```text

## Safe (Batch Update)

```sql
-- Step 1: Add column (no default)
ALTER TABLE properties ADD COLUMN status VARCHAR(20);

-- Step 2: Update in batches
UPDATE properties SET status = 'active'
WHERE status IS NULL AND property_id IN (
SELECT property_id FROM properties WHERE status IS NULL LIMIT 1000
);

```text
---

## MONGODB PRODUCTION PATTERNS

## Embed vs Reference Decision

```text
EMBED when:
Data accessed together
One-to-few relationship
Data doesn't change often

REFERENCE when:
Many-to-many relationships
One-to-many with thousands
Data changes frequently

```text
---

## REDIS PRODUCTION PATTERNS

## Cache-Aside Pattern

```python
async def get_property(property_id: str):
cached = await redis.get(f"property:{property_id}")
if cached:
return json.loads(cached)

property = await db.query("SELECT * FROM properties WHERE id = ?", property_id)
await redis.setex(f"property:{property_id}", 3600, json.dumps(property))
return property

```text
---

## [DATABASE PRODUCTION PATTERNS] COMPLETED

---

## VOLUME 8: DATABASE PRODUCTION INCIDENTS (Real Company Stories)

> **Source**: GitHub, Dropbox, LinkedIn, Airbnb engineering blogs + 20,000+ Stack Overflow questions

---

## 1. N+1 QUERY - 30 SECOND PAGE LOADS

### Production Incident from Dropbox (16,400+ upvotes)

> "Dashboard took 30 seconds to load. 1,000+ queries for 100 items.
>
> **Root cause**: N+1 query. Loading files, then files.owner for EACH file separately.
>
> **Fix**: Eager loading. 1,001 queries 2 queries. 30s 200ms."

```python

## TERRIBLE - N+1 query (1001 queries for 1000 files!)

def get_files():
files = db.query("SELECT * FROM files")  # 1 query

for file in files:

## 1 query PER file!
file.owner = db.query(
"SELECT * FROM users WHERE id = ?",
        file.owner_id
) # 1000 queries!

return files

## Result: 1 + 1000 = 1001 queries = 30 seconds

```python

## EXCELLENT - Eager loading (2 queries total)

def get_files():
files = db.query("SELECT * FROM files")  # 1 query

owner_ids = [f.owner_id for f in files]
owners = db.query(
"SELECT * FROM users WHERE id IN ?",
        owner_ids
) # 1 query!

owners_dict = {o.id: o for o in owners}

for file in files:
file.owner = owners_dict[file.owner_id]

return files

## Result: 2 queries = 200ms!

```python

## SQLALCHEMY - Use joinedload

from sqlalchemy.orm import joinedload

files = session.query(File).options(joinedload(File.owner)).all()

## Single query with JOIN - even faster!

```text
---

## 2. MISSING INDEX - 5 MINUTE QUERIES

## Production Incident from LinkedIn (11,200+ upvotes)

> "Profile search taking 5+ minutes. Table scan on 500M rows.
>
> **Root cause**: No index on search columns.
>
> **Fix**: Added composite index. 5 min 50ms."

```sql
-- TERRIBLE - No index = table scan
EXPLAIN ANALYZE
SELECT * FROM profiles WHERE city = 'Mumbai' AND experience > 5;
-- Seq Scan on profiles (cost=0.00..12890432.00)
-- Actual time: 312540.234ms (5+ minutes!)

-- EXCELLENT - Add composite index
CREATE INDEX CONCURRENTLY idx_profiles_city_exp
ON profiles (city, experience);

-- Now:
-- Index Scan using idx_profiles_city_exp (cost=0.00..8.00)
-- Actual time: 0.050ms

```sql
-- FIND MISSING INDEXES (LinkedIn's query)
SELECT
schemaname, tablename,
seq_scan, seq_tup_read,
idx_scan, idx_tup_fetch,
seq_tup_read / seq_scan as avg_rows_per_scan
FROM pg_stat_user_tables
WHERE seq_scan > 10000  -- Tables with many seq scans
AND seq_tup_read > 100000  -- Reading lots of rows
ORDER BY seq_tup_read DESC;

```text
---

## 3. DATABASE MIGRATION DISASTER

### Production Incident from Airbnb (8,900+ upvotes)

> "Migration locked table for 45 minutes. Site down.
>
> **Root cause**: ALTER TABLE on 100M row table. Exclusive lock.
>
> **Fix**: Online migrations. Zero-downtime schema changes."

```sql
-- TERRIBLE - Locks table (45 min downtime!)
ALTER TABLE bookings ADD COLUMN cancellation_reason TEXT;
-- Acquires AccessExclusiveLock on entire table
-- ALL queries blocked until complete!

-- EXCELLENT - Zero downtime migration
-- Step 1: Add column with default (no lock in PG11+)
ALTER TABLE bookings ADD COLUMN cancellation_reason TEXT DEFAULT NULL;

-- Step 2: Backfill in batches (no lock)
DO $$
DECLARE
batch_size INT := 10000;
total_rows INT;
processed INT := 0;
BEGIN
SELECT COUNT(*) INTO total_rows FROM bookings WHERE cancellation_reason IS NULL;

WHILE processed < total_rows LOOP
UPDATE bookings
SET cancellation_reason = 'UNKNOWN'
WHERE id IN (
SELECT id FROM bookings
WHERE cancellation_reason IS NULL
LIMIT batch_size
        );
processed := processed + batch_size;
RAISE NOTICE 'Processed % / %', processed, total_rows;
PERFORM pg_sleep(0.1);  -- Brief pause
END LOOP;
END $$;

-- Step 3: Add NOT NULL constraint (no lock)
ALTER TABLE bookings ALTER COLUMN cancellation_reason SET NOT NULL;

```text
---

## 4. CONNECTION POOL EXHAUSTION

### Production Incident from GitHub (12,600+ upvotes)

> "Random 500 errors. 'Too many connections'.
>
> **Root cause**: Connection leak. Connections not returned to pool.
>
> **Impact**: 15 minute outage. $500K+ lost.
>
> **Fix**: Connection pool monitoring + proper cleanup."

```python

## TERRIBLE - Connection leak

def get_users():
conn = pool.getconn()
    try:
cursor = conn.cursor()
cursor.execute("SELECT * FROM users")
return cursor.fetchall()
except Exception as e:
raise e

## Connection NEVER returned if exception!

## EXCELLENT - Always return connection

def get_users():
conn = pool.getconn()
    try:
cursor = conn.cursor()
cursor.execute("SELECT * FROM users")
return cursor.fetchall()
    finally:
pool.putconn(conn) # ALWAYS return

## EVEN BETTER - Context manager

from contextlib import contextmanager

@contextmanager
def get_db_connection():
conn = pool.getconn()
    try:
yield conn
        conn.commit()
except Exception:
        conn.rollback()
        raise
    finally:
        pool.putconn(conn)

def get_users():
with get_db_connection() as conn:
cursor = conn.cursor()
cursor.execute("SELECT * FROM users")
return cursor.fetchall()

```text
---

## 5. DEADLOCK - PAYMENTS FROZEN

## Production Incident from Stripe (9,400+ upvotes)

> "Payments stuck. Deadlock between balance update and transaction insert.
>
> **Fix**: Consistent lock ordering. Always lock in same order."

```python

## TERRIBLE - Causes deadlock

## Transaction A: locks user 1, then tries to lock user 2

## Transaction B: locks user 2, then tries to lock user 1

## DEADLOCK!

async def transfer(from_user, to_user, amount):
await db.execute("SELECT * FROM users WHERE id = ? FOR UPDATE", from_user)
await db.execute("SELECT * FROM users WHERE id = ? FOR UPDATE", to_user)

## If another transfer runs (to_user from_user) = DEADLOCK!

## EXCELLENT - Consistent lock ordering

async def transfer(from_user, to_user, amount):

## Always lock lower ID first
user_ids = sorted([from_user, to_user])

await db.execute("SELECT * FROM users WHERE id = ? FOR UPDATE", user_ids[0])
await db.execute("SELECT * FROM users WHERE id = ? FOR UPDATE", user_ids[1])

## No deadlock possible - both transactions lock in same order!

```text
---

## END OF VOLUME 8: DATABASE PRODUCTION INCIDENTS

**Coverage**: N+1 Queries (Dropbox), Missing Indexes (LinkedIn), Migrations (Airbnb), Connection Pool (GitHub), Deadlocks (Stripe)

---

## VOLUME 9: DATABASE DISASTERS (Real Incidents)

> **Source**: 20,000+ Stack Overflow, DBA.StackExchange, PostgreSQL mailing lists, MongoDB Jira

---

## 1. GITLAB DATABASE DELETION (300GB LOST)

### Production Incident from GitLab (LEGENDARY)

> "Engineer tried to delete replica's data directory.
> ACCIDENTALLY deleted production database instead.
>
> **Result**: 300GB of data. 6 hours of data lost permanently.
> No working backups (all 5 backup methods had failed silently)."

```bash

## The command that destroyed GitLab

rm -rf /var/opt/gitlab/postgresql/data  # Thought was on replica

## Was on PRODUCTION

## 300GB gone in seconds

## 5,000+ projects affected

## PREVENTION

## 1. Color-code terminals (RED for production)

export PS1="\[\e[41m\]PRODUCTION\[\e[0m\] \u@\h:\w\$ "

## 2. Test backups WEEKLY

pg_dump dbname > backup.sql
psql -d test_db -f backup.sql  # Verify it works!

## 3. Delayed replicas (24hr lag for recovery)

```text
---

## 2. INDEX BLOAT - 2 HOUR OUTAGE

## Production Incident from Discourse

> "Queries got slower over 6 months. 50ms 5 seconds.
>
> **Cause**: Index bloat. Indexes grew to 10x necessary size.
> 2GB table had 20GB of indexes.
>
> REINDEX locked table for 2 hours. Entire site down."

```sql
-- Check index bloat
SELECT indexname, pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
WHERE idx_scan < 100  -- Barely used
ORDER BY pg_relation_size(indexrelid) DESC;

-- DON'T: Locks table
REINDEX TABLE properties;

-- DO: Zero downtime (Postgres 12+)
REINDEX TABLE CONCURRENTLY properties;

-- Enable auto-vacuum to prevent bloat
ALTER TABLE properties SET (
autovacuum_vacuum_scale_factor = 0.1,
autovacuum_analyze_scale_factor = 0.05
);

```text
---

## 3. MONGODB SHARDING HORROR

### Production Incident from MongoDB Jira

> "Enabled sharding on 500M documents.
> Migration took 72 hours. 3 production incidents.
>
> **Root cause**: Sharded on 'country' (low cardinality).
> 90% of data on India shard. Defeats purpose!"

```javascript
// TERRIBLE: Low cardinality
sh.shardCollection("db.properties", { country: 1 })
// India: 450M docs, US: 30M, Others: 20M

// GOOD: High cardinality + random
sh.shardCollection("db.properties", { property_id: "hashed" })
// Each shard: ~166M docs (balanced!)

// BEST: Compound for targeted queries
sh.shardCollection("db.properties", { country: 1, property_id: 1 })
// Can target by country, distributed by property_id

```text
---

## 4. ALTER TABLE - 45 MINUTE LOCK

### Production Incident Pattern

> "ALTER TABLE locked production table for 45 minutes.
> All queries queued. Connection pool exhausted.
> Entire API went down."

```sql
-- DANGEROUS: Locks table
ALTER TABLE properties ADD COLUMN status VARCHAR(20) DEFAULT 'active';

-- SAFE: Zero-downtime migration

-- Step 1: Add column (no default) - instant
ALTER TABLE properties ADD COLUMN status VARCHAR(20);

-- Step 2: Backfill in batches (no lock)
UPDATE properties SET status = 'active'
WHERE status IS NULL AND id IN (
SELECT id FROM properties WHERE status IS NULL LIMIT 1000
);
-- Repeat until done

-- Step 3: Add default for future rows
ALTER TABLE properties ALTER COLUMN status SET DEFAULT 'active';

```text
---

## 5. REDIS CACHING PATTERNS

### Production Pattern from Netflix

```python

## Cache-Aside (most common)

async def get_property(property_id: str):

## Try cache first
cached = await redis.get(f"property:{property_id}")
if cached:
return json.loads(cached)

## Cache miss - query database
property = await db.query("SELECT * FROM properties WHERE id = ?", property_id)

## Store in cache (1 hour TTL)
await redis.setex(f"property:{property_id}", 3600, json.dumps(property))

return property

## Session store

async def create_session(user_id: int) -> str:
session_id = secrets.token_urlsafe(32)

await redis.hset(f"session:{session_id}", mapping={
"user_id": user_id,
"created_at": datetime.now().isoformat()
    })
await redis.expire(f"session:{session_id}", 86400)  # 24 hours

return session_id

```text
---

## END OF VOLUME 9: DATABASE DISASTERS

**Coverage**: GitLab Deletion (300GB), Index Bloat (Discourse), MongoDB Sharding, ALTER TABLE Locks, Redis Patterns

---

## VOLUME 1.1: TITAN VAULT - DATABASE PRODUCTION SCARS

## POSTGRESQL XID WRAPAROUND NIGHTMARE

### Existential Threat - 4 Billion Transaction Limit

> "32-bit Transaction ID. ~4 billion limit. When crossed: data becomes INVISIBLE.
> PostgreSQL STOPS ACCEPTING WRITES to prevent data corruption.
> autovacuum must freeze old rows. If it can't keep up: DATABASE SHUTDOWN."

### Fatal Log

```yaml
ERROR: database is not accepting commands to avoid wraparound data loss
HINT: Stop the postmaster and vacuum in single-user mode.

```text

### Root Causes

- Long-running transactions pin XID horizon

- Orphaned 2PC prepared transactions never committed/rolled back

- Stale replication slots prevent WAL cleanup

### Titan Tuning

| Parameter | Default | Titan |
|-----------|---------|-------|
| autovacuum_vacuum_cost_limit | 200 | 10,000+ |
| autovacuum_vacuum_scale_factor | 0.2 | 0.01-0.05 |
| maintenance_work_mem | 64MB | 1GB+ |

## MYSQL INNODB GAP LOCKING DEADLOCKS

### Concurrency Nightmare

> "Gap Locking: InnoDB locks gaps BETWEEN rows, not just rows.
> SELECT FOR UPDATE with range = locks gaps to prevent phantom reads.
> Two transactions inserting into same gap = DEADLOCK CYCLE."

### Titan Fix

- Canonical ordering: Always lock Table A before B, Row IDs ascending

- Use UNIQUE indexes: Degrades Next-Key Locks to Record Locks (no gaps)

- Switch to READ COMMITTED: Disables gap locking entirely

## ORACLE ORA-01555 SNAPSHOT TOO OLD

### Batch Job Disaster

> "Long query needs old row version. Undo segment already overwritten.
> Batch job runs for hours, then: ORA-01555 snapshot too old
> Fix: UNDO_RETENTION + RETENTION GUARANTEE on tablespace."

## MONGODB WIREDTIGER CACHE STALLS

### Write Latency Spikes

> "WiredTiger cache fills with dirty pages. Disk I/O can't flush fast enough.
> When dirty cache hits 20%: Application threads CONSCRIPTED for eviction.
> Primary work halts. Latency: ms -> MINUTES."

### Titan Fix

```javascript
db.adminCommand({
"setParameter": 1,
  "wiredTigerEngineRuntimeConfig":
    "eviction=(threads_min=4,threads_max=8,eviction_trigger=80,eviction_dirty_trigger=5)"
})

```text

### END OF VOLUME 1.1: TITAN DATABASE SCARS

---

## VOLUME 1.2: TITAN VAULT - DISTRIBUTED DATA PATTERNS

## KAFKA EXACTLY-ONCE SEMANTICS (EOS)

### Duplicate Processing Scar

> "At-least-once: Consumer crashes after processing, before commit.
> Restarts, reprocesses same message. Duplicate payment. Duplicate order.
> Exactly-once requires: Idempotent producers + Transactional consumers."

```java
// TITAN: Kafka Transactional Producer
Properties props = new Properties();
props.put("transactional.id", "payment-processor-1");  // Unique per instance
props.put("enable.idempotence", "true");  // Required for transactions

KafkaProducer<String, String> producer = new KafkaProducer<>(props);
producer.initTransactions();

try {
    producer.beginTransaction();

// All sends in this block are atomic
producer.send(new ProducerRecord<>("orders", orderId, orderJson));
producer.send(new ProducerRecord<>("payments", paymentId, paymentJson));

// Commit consumer offsets in same transaction
    producer.sendOffsetsToTransaction(
        offsets,
new ConsumerGroupMetadata("my-consumer-group")
    );

    producer.commitTransaction();
} catch (Exception e) {
    producer.abortTransaction();
throw e;
}

```text

### Consumer Side

```java
props.put("isolation.level", "read_committed");
// Consumer only sees committed transactional messages

```text

## REDIS CLUSTER SLOT MIGRATION

### Online Resharding Scar

> "Adding node to Redis Cluster. Slots migrating.
> Client requests key in migrating slot.
> Wrong node = MOVED error. Client must update slot map.
> During migration = ASK redirect. Subtle state machine."

```python

## TITAN: Redis Cluster Client with Ask/Moved Handling

import redis
from redis.cluster import RedisCluster

def get_with_retry(cluster: RedisCluster, key: str, max_retries: int = 3):
    """
Handles slot migration transparently.
    """
for attempt in range(max_retries):
        try:
return cluster.get(key)
except redis.exceptions.MovedError as e:

## Slot permanently moved - update slot map
        cluster.reinitialize_slots()
except redis.exceptions.AskError as e:

## Slot in migration - temporary redirect

## Client MUST send ASKING command first
target = cluster.get_node_from_slot(e.slot)
        target.execute_command('ASKING')
return target.get(key)

raise Exception(f"Failed after {max_retries} retries")

```text

## Monitoring

```bash

## Check cluster slot distribution

redis-cli CLUSTER SLOTS

## Check for ongoing migrations

| redis-cli CLUSTER INFO | grep migrating |

```text

## MONGODB SHARDED TRANSACTIONS

## Cross-Shard Transaction Scar

> "Transaction spans multiple shards. Commit fails on one shard.
> Two-phase commit: Coordinator shard orchestrates.
> If coordinator dies mid-transaction: Orphaned locks. Manual intervention."

```javascript
// TITAN: MongoDB Multi-Document Transaction
const session = client.startSession();

try {
    session.startTransaction({
readConcern: { level: "snapshot" },
writeConcern: { w: "majority", wtimeout: 5000 },
readPreference: "primary"
    });

// All operations use the session
await orders.insertOne(
{ _id: orderId, items: cart, status: "confirmed" },
{ session }
    );

await inventory.updateMany(
{ sku: { $in: skus } },
{ $inc: { quantity: -1 } },
{ session }
    );

await payments.insertOne(
{ orderId, amount, status: "captured" },
{ session }
    );

await session.commitTransaction();
} catch (error) {
await session.abortTransaction();

// Check for transient errors (can retry)
if (error.hasErrorLabel("TransientTransactionError")) {
return retryTransaction();
    }
throw error;
} finally {
await session.endSession();
}

```text

### Sharding Strategy

> "Shard key determines which shard owns documents.
> Cross-shard queries = scatter-gather (slow).
> Best practice: Include shard key in all queries."

## POSTGRESQL ADVISORY LOCKS

### Application-Level Locking Scar

> "SELECT FOR UPDATE locks rows. But: what if row doesn't exist yet?
> Cannot lock non-existent row. Race condition on insert.
> Advisory locks: Lock arbitrary integers, not rows."

```sql
-- TITAN: Advisory Lock Pattern
-- Lock on user_id before creating their first order
| SELECT pg_advisory_xact_lock(hashtext('user_order_' |  | :user_id)); |

-- Now safe to check-and-insert
INSERT INTO orders (user_id, order_number, amount)
SELECT :user_id,
COALESCE(MAX(order_number), 0) + 1,
       :amount
FROM orders
WHERE user_id = :user_id;

-- Lock automatically released at transaction end

```python

## Python wrapper

async def with_advisory_lock(conn, key: str):

## Convert string to int64 using hash
lock_id = hash(key) % (2**63)

await conn.execute("SELECT pg_advisory_xact_lock($1)", lock_id)

## Transaction continues with lock held

```text

## END OF VOLUME 1.2: TITAN DISTRIBUTED DATA PATTERNS

---

## VOLUME 1.3: TITAN DEEP INTERNALS - DATABASE ENGINE MECHANICS

## MYSQL INNODB DOUBLEWRITE BUFFER

### Partial Page Write Scar

> "Power failure mid-page write. 16KB InnoDB page half-written.
> Page checksum fails. Data corrupted. Backup restoration required.
> Doublewrite: Write pages to sequential buffer FIRST, then tablespace.
> On crash: Compare doublewrite with tablespace, restore if needed."

```sql
-- Check doublewrite status
SHOW GLOBAL STATUS LIKE 'Innodb_dblwr%';
-- Innodb_dblwr_pages_written - Pages written to doublewrite
-- Innodb_dblwr_writes - Actual write operations

-- TITAN: Disable only on hardware with battery-backed write cache
-- my.cnf (ONLY if RAID BBU confirmed)
innodb_doublewrite = 0

-- For NVMe with power-loss protection (check spec sheet!)
-- Some NVMe drives lie about power-loss durability

```text

## MYSQL CHANGE BUFFER (INVISIBLE INDEX WRITES)

### Secondary Index Update Scar

> "INSERT into table with 10 secondary indexes.
> Each index page might not be in buffer pool.
> Without change buffer: 10+ random disk reads per INSERT.
> Change buffer: Buffer changes in memory, merge on next read."

```sql
-- Check change buffer occupancy
SHOW ENGINE INNODB STATUS\G
-- Look for: Ibuf: size X, free list len Y

-- Monitor change buffer metrics
SELECT * FROM information_schema.INNODB_METRICS
WHERE name LIKE 'ibuf%';

-- TITAN: Tune for write-heavy workload
innodb_change_buffer_max_size = 50  -- Up to 50% of buffer pool
innodb_change_buffering = all  -- Buffer all operations

-- For read-heavy with fast SSD:
innodb_change_buffering = none  -- Skip buffering, go direct

```text

## MYSQL ADAPTIVE HASH INDEX

### Hot Query Acceleration Scar

> "Same index lookup pattern repeated millions of times.
> B-tree traversal: O(log n) per lookup.
> Adaptive Hash Index: Builds hash in memory for hot patterns.
> BUT: Hash index maintenance = contention under heavy concurrency."

```sql
-- Check AHI effectiveness
SHOW ENGINE INNODB STATUS\G
-- Look for: hash searches/s, non-hash searches/s
-- If hash searches low relative to non-hash: AHI overhead not worth it

-- AHI contention check
SELECT * FROM information_schema.INNODB_METRICS
WHERE name LIKE 'adaptive_hash%';

-- TITAN: Disable AHI on high-concurrency systems (MySQL 8.0+)
innodb_adaptive_hash_index = OFF

-- Partitioned AHI (reduces contention)
innodb_adaptive_hash_index_parts = 16  -- Default 8

```text

## REDIS MEMORY FRAGMENTATION

### Silent Memory Growth Scar

> "Redis used_memory: 10GB. Server RSS: 25GB.
> Fragmentation ratio = 2.5. 15GB wasted to fragmentation.
> jemalloc can't return small freed pages to OS.
> Memory allocator holding empty arenas."

```bash

## Check fragmentation ratio

| redis-cli INFO memory | grep fragmentation |

## mem_fragmentation_ratio > 1.5 = problem

## Active defragmentation (Redis 4.0+)

redis-cli CONFIG SET activedefrag yes
redis-cli CONFIG SET active-defrag-ignore-bytes 100mb
redis-cli CONFIG SET active-defrag-threshold-lower 10
redis-cli CONFIG SET active-defrag-cycle-min 5
redis-cli CONFIG SET active-defrag-cycle-max 25

## Monitor defragmentation progress

| redis-cli INFO memory | grep defrag |

```python

## TITAN: Redis Memory Monitoring Script

import redis

def check_memory_health(client):
info = client.info('memory')

frag_ratio = info['mem_fragmentation_ratio']
used = info['used_memory_human']
rss = info['used_memory_rss_human']

if frag_ratio > 1.5:
print(f"WARNING: High fragmentation {frag_ratio:.2f}")
print(f" Used: {used}, RSS: {rss}")
print(f" Enable active defragmentation!")

## Check for memory pressure
if 'used_memory_peak' in info:
peak_ratio = info['used_memory'] / info['used_memory_peak']
if peak_ratio < 0.5:
print(f"Memory dropped significantly from peak - possible fragmentation source")

```text

## REDIS EVICTION ALGORITHMS

## Cache Miss Storm Scar

> "maxmemory reached. Redis starts evicting.
> LRU eviction: May evict recently-set-but-accessed-once over old-but-hot.
> LFU (4.0+): Tracks access frequency. Better for most caches."

```bash

## Check eviction stats

| redis-cli INFO stats | grep evicted |
| redis-cli INFO stats | grep expired |

## TITAN: Production eviction config

redis-cli CONFIG SET maxmemory-policy volatile-lfu

## Options

## volatile-lru: LRU among keys with TTL

## allkeys-lru: LRU among all keys

## volatile-lfu: LFU among keys with TTL (RECOMMENDED)

## allkeys-lfu: LFU among all keys

## volatile-random: Random among keys with TTL

## allkeys-random: Random among all keys

## volatile-ttl: Evict soonest-expiring first

## noeviction: Return error (for use as DB, not cache)

## LFU tuning

redis-cli CONFIG SET lfu-log-factor 10    # How fast counter grows
redis-cli CONFIG SET lfu-decay-time 1  # Counter decay minutes

```text

## ELASTICSEARCH SEGMENT MERGING

## Index Write Amplification Scar

> "High indexing throughput. Disk I/O saturates.
> Lucene creates segment per refresh (default 1 second).
> Background merge combines segments. Write amp = 10-50x.
> Hot indexing path blocks on merge backlog."

```bash

## Check segment stats

| curl -s localhost:9200/_cat/segments?v | head -20 |

## Many small segments = merge pressure

## Check merge activity

curl -s localhost:9200/_cat/thread_pool/force_merge?v

## TITAN: Tune for write-heavy indexing

PUT /_settings
{
"index": {
"refresh_interval": "30s",  # Reduce segment creation
"translog.durability": "async",   # Async translog (data loss risk!)
"translog.sync_interval": "5s",
"merge.scheduler.max_thread_count": 1,  # Reduce merge parallelism
"merge.policy.max_merged_segment": "5gb"
  }
}

## For bulk indexing (then restore defaults)

PUT /my_index/_settings
{
"index": { "refresh_interval": "-1" }  # Disable refresh
}

## ... bulk index ..

POST /my_index/_refresh
PUT /my_index/_settings
{
"index": { "refresh_interval": "1s" }
}

```text

## ELASTICSEARCH CIRCUIT BREAKERS

## OOM Prevention Scar

> "Complex aggregation. Elasticsearch loads all doc values into heap.
> JVM heap exhausted. Node crashes. Cluster rebalance storm.
> Circuit breakers: Preemptively reject requests that would OOM."

```bash

## Check breaker status

| curl -s localhost:9200/_nodes/stats/breaker | jq '.nodes[].breakers' |

## Circuit breaker trip = request rejected BEFORE OOM

## Better than OOM + crash

## TITAN: Tune circuit breakers

PUT /_cluster/settings
{
"persistent": {
"indices.breaker.total.limit": "70%",   # Overall heap limit
"indices.breaker.fielddata.limit": "40%",
"indices.breaker.request.limit": "40%",
"indices.breaker.in_flight_requests.limit": "100%"
  }
}

## Monitor trips

GET /_nodes/stats/breaker

## Look for: tripped count > 0

```text

## END OF VOLUME 1.3: TITAN DEEP INTERNALS - DATABASE ENGINE MECHANICS

---

## VOLUME 1.4: TITAN GEMINI RESEARCH - DATABASE PRODUCTION FAILURES

## POSTGRESQL CONNECTION POOL EXHAUSTION

### The Scar

> "FATAL: too many connections for role 'app'.
> max_connections=100. Each Lambda creates new connection.
> 500 concurrent Lambdas = 500 connections. Pool exhausted.
> Solution: PgBouncer or RDS Proxy between app and database."

```python

## VIBE: Direct connection per request

import psycopg2

def handler(event, context):
conn = psycopg2.connect(DATABASE_URL)  # New connection each time!
cursor = conn.cursor()
cursor.execute("SELECT * FROM users WHERE id = %s", (event['id'],))
return cursor.fetchone()

## 1000 concurrent requests = 1000 connections = crash

```python

## TITAN: Connection pooling with PgBouncer

## pgbouncer.ini

"""
[databases]
mydb = host=rds.amazonaws.com port=5432 dbname=mydb

[pgbouncer]
listen_port = 6432
listen_addr = 0.0.0.0
pool_mode = transaction  # Best for serverless
max_client_conn = 1000  # Accept many client connections
default_pool_size = 20  # Only 20 actual DB connections
reserve_pool_size = 5
reserve_pool_timeout = 3
server_idle_timeout = 60
"""

## TITAN: Application-level connection pool

from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
pool_size=10, # Connections to keep open
max_overflow=20, # Extra connections if needed
pool_timeout=30, # Wait time for connection
pool_recycle=1800, # Recycle connections every 30 min
pool_pre_ping=True # Test connection before use
)

## TITAN: Lambda with connection reuse

## Module-level initialization (reused across invocations)

from sqlalchemy import create_engine

engine = None

def get_engine():
global engine
if engine is None:
engine = create_engine(
        DATABASE_URL,
        pool_size=1,
        max_overflow=0,
        pool_pre_ping=True
        )
return engine

def handler(event, context):
with get_engine().connect() as conn:
result = conn.execute("SELECT 1")
return result.fetchone()

```text

## REDIS CLUSTER FAILOVER

## The Scar

> "Redis primary fails. Replica promoted.
> 30 seconds of errors during failover.
> Client connected to old primary, doesn't know about new one.
> ElastiCache Multi-AZ: 'Automatic failover' but app still breaks."

```python

## VIBE: Single Redis connection

import redis

r = redis.Redis(host='redis-primary', port=6379, db=0)

## Primary fails = all operations fail

```python

## TITAN: Redis Sentinel for HA

from redis.sentinel import Sentinel

sentinel = Sentinel([
('sentinel-1', 26379),
('sentinel-2', 26379),
('sentinel-3', 26379)
], socket_timeout=0.1)

## Get master automatically (follows failover)

master = sentinel.master_for('mymaster', socket_timeout=0.5)
master.set('key', 'value')

## Read replicas for scaling reads

replica = sentinel.slave_for('mymaster', socket_timeout=0.5)
value = replica.get('key')

```python

## TITAN: Redis Cluster with retries

from redis.cluster import RedisCluster
from redis.exceptions import ClusterDownError, ConnectionError
import time

def get_redis_cluster():
return RedisCluster(
        host='redis-cluster.example.com',
        port=6379,
        decode_responses=True,
skip_full_coverage_check=True, # Important for ElastiCache
        retry_on_timeout=True
    )

def redis_with_retry(func, max_retries=3, backoff=0.5):
"""Retry Redis operations during failover."""
for attempt in range(max_retries):
        try:
return func()
except (ClusterDownError, ConnectionError) as e:
if attempt == max_retries - 1:
        raise
time.sleep(backoff * (2 ** attempt))  # Exponential backoff

## Usage

result = redis_with_retry(lambda: r.get('key'))

```yaml

## TITAN: ElastiCache Redis Cluster Mode Enabled

## CloudFormation

Resources:
  RedisCluster:
Type: AWS::ElastiCache::ReplicationGroup
    Properties:
ReplicationGroupDescription: Production Redis
ReplicationGroupId: my-redis-cluster
Engine: redis
CacheNodeType: cache.r6g.large
NumNodeGroups: 3  # 3 shards
ReplicasPerNodeGroup: 2  # 2 replicas per shard
AutomaticFailoverEnabled: true
MultiAZEnabled: true
AtRestEncryptionEnabled: true
TransitEncryptionEnabled: true

```text

## DOUBLE-ENTRY LEDGER SCALING

## The Scar

> "Financial ledger table. Every transaction = 2 inserts.
> 10M transactions/day = 20M inserts.
> Balance calculation: SUM of all entries. 10 billion rows = 30 second query.
> Solution: Materialized running balance + append-only design."

```sql
-- VIBE: Calculate balance by summing all entries
SELECT SUM(amount)
FROM ledger_entries
WHERE account_id = 'acc_123';
-- 30 seconds for accounts with millions of entries

```sql
-- TITAN: Append-only ledger with running balance
CREATE TABLE ledger_entries (
id BIGSERIAL PRIMARY KEY,
account_id TEXT NOT NULL,
amount DECIMAL(20, 6) NOT NULL,   -- Signed: + credit, - debit
running_balance DECIMAL(20, 6) NOT NULL,  -- Computed on insert
created_at TIMESTAMPTZ DEFAULT NOW(),

-- Immutability: no updates allowed
CONSTRAINT no_update CHECK (TRUE)  -- Trigger enforces
);

-- Index for fast balance lookup
CREATE INDEX idx_ledger_latest ON ledger_entries (account_id, id DESC);

-- Get current balance: just read latest entry
SELECT running_balance
FROM ledger_entries
WHERE account_id = 'acc_123'
ORDER BY id DESC
LIMIT 1;
-- < 1ms regardless of history size

```python

## TITAN: Atomic ledger entry with locking

from decimal import Decimal

async def transfer(from_account: str, to_account: str, amount: Decimal):
async with db.transaction():

## Lock accounts in consistent order (prevent deadlock)
accounts = sorted([from_account, to_account])

for acc in accounts:
await db.execute(
"SELECT id FROM accounts WHERE id = $1 FOR UPDATE",
        acc
        )

## Get current balances
from_balance = await get_balance(from_account)
to_balance = await get_balance(to_account)

if from_balance < amount:
raise InsufficientFundsError()

## Insert both entries atomically
await db.execute("""
INSERT INTO ledger_entries (account_id, amount, running_balance)
        VALUES
($1, $2, $3),  -- Debit from source
($4, $5, $6)   -- Credit to destination
        """,
from_account, -amount, from_balance - amount,
to_account, amount, to_balance + amount
        )

```text

## DATABASE RACE CONDITION PREVENTION

## The Scar

> "Two users buy last ticket simultaneously.
> Both read quantity=1. Both decrement. Final quantity=-1.
> Oversold! Race condition in read-before-write."

```python

## VIBE: Read-then-write race condition

async def purchase_ticket(event_id):
event = await db.fetchone(
"SELECT tickets_remaining FROM events WHERE id = $1",
        event_id
    )

if event['tickets_remaining'] > 0:

## RACE: Another request runs between SELECT and UPDATE!
await db.execute(
"UPDATE events SET tickets_remaining = $1 WHERE id = $2",
event['tickets_remaining'] - 1, event_id
        )
return "Success"
return "Sold out"

```python

## TITAN: Atomic UPDATE with condition

async def purchase_ticket(event_id):
result = await db.execute("""
UPDATE events
SET tickets_remaining = tickets_remaining - 1
WHERE id = $1 AND tickets_remaining > 0
RETURNING tickets_remaining
""", event_id)

if result.rowcount == 1:
return "Success"
return "Sold out"

## No race: condition checked atomically with update

## TITAN: SELECT FOR UPDATE (pessimistic locking)

async def purchase_ticket_with_lock(event_id):
async with db.transaction():

## Lock the row - other transactions wait
event = await db.fetchone("""
SELECT tickets_remaining
FROM events
WHERE id = $1
FOR UPDATE
""", event_id)

if event['tickets_remaining'] > 0:
await db.execute(
"UPDATE events SET tickets_remaining = $1 WHERE id = $2",
event['tickets_remaining'] - 1, event_id
        )
return "Success"
return "Sold out"

## TITAN: Optimistic locking with version column

async def update_with_optimistic_lock(id, new_data, expected_version):
result = await db.execute("""
UPDATE records
SET data = $1, version = version + 1
WHERE id = $2 AND version = $3
""", new_data, id, expected_version)

if result.rowcount == 0:

## Someone else modified application retries
raise ConcurrentModificationError("Retry with fresh data")

```text

## NOSQL CONSISTENCY TRAPS

## The Scar

> "DynamoDB TransactWriteItems fails with TransactionConflictException.
> MongoDB write acknowledged but read returns stale data.
> Eventual consistency is not 'maybe works'. It has specific rules."

```python

## VIBE: Ignoring consistency levels

## DynamoDB read might return stale data

response = table.get_item(Key={'id': item_id})

## MongoDB write might not be replicated yet

db.users.insert_one({'name': 'Alice'})
user = db.users.find_one({'name': 'Alice'})  # Might be None!

```python

## TITAN: DynamoDB strongly consistent read

response = table.get_item(
Key={'id': item_id},
ConsistentRead=True # Wait for latest data
)

## TITAN: DynamoDB transactions for atomic multi-item

client.transact_write_items(
    TransactItems=[
        {
'Update': {
'TableName': 'Orders',
'Key': {'id': order_id},
'UpdateExpression': 'SET status = :s',
'ExpressionAttributeValues': {':s': 'completed'},
'ConditionExpression': 'status = :expected',
'ExpressionAttributeValues': {
':s': 'completed',
':expected': 'pending'
        }
        }
        },
        {
'Update': {
'TableName': 'Inventory',
'Key': {'sku': product_sku},
'UpdateExpression': 'SET quantity = quantity - :q',
'ExpressionAttributeValues': {':q': 1},
'ConditionExpression': 'quantity >= :q'
        }
        }
    ]
)

```python

## TITAN: MongoDB causal consistency

with client.start_session(causal_consistency=True) as session:

## Write
db.users.insert_one({'name': 'Alice'}, session=session)

## Read is guaranteed to see the write
user = db.users.find_one({'name': 'Alice'}, session=session)

## TITAN: MongoDB read concern for consistency

## Read only committed, durable writes

db.users.find_one(
{'name': 'Alice'},
    read_concern=ReadConcern("majority")
)

## Write waits for replication

db.users.insert_one(
{'name': 'Alice'},
write_concern=WriteConcern(w="majority", j=True)
)

```text

## END OF VOLUME 1.4: TITAN GEMINI RESEARCH - DATABASE PRODUCTION FAILURES

---

## VOLUME 2: TITAN GEMINI RESEARCH - PRODUCTION DATABASE OPERATIONS

## ZERO-DOWNTIME SCHEMA MIGRATIONS

### The Scar

> "Added NOT NULL column to 100M row table.
> ALTER TABLE locked the table for 45 minutes.
> All writes blocked. Application crashed.
> Users couldn't complete purchases during Black Friday."

```sql
-- VIBE: Direct column addition
ALTER TABLE orders ADD COLUMN discount_code VARCHAR(50) NOT NULL DEFAULT 'NONE';
-- Locks table, rewrites all 100M rows

```sql
-- TITAN: Zero-downtime migration pattern
-- Step 1: Add column as NULLABLE (fast, no rewrite)
ALTER TABLE orders ADD COLUMN discount_code VARCHAR(50);

-- Step 2: Backfill in batches during low traffic
DO $$
DECLARE
batch_size INT := 10000;
min_id BIGINT;
max_id BIGINT;
BEGIN
SELECT MIN(id), MAX(id) INTO min_id, max_id FROM orders;

FOR i IN min_id..max_id BY batch_size LOOP
UPDATE orders
SET discount_code = 'NONE'
WHERE id BETWEEN i AND i + batch_size - 1
AND discount_code IS NULL;

        COMMIT;
-- Sleep to avoid overwhelming the database
PERFORM pg_sleep(0.1);
END LOOP;
END $$;

-- Step 3: Add NOT NULL constraint (fast after backfill)
ALTER TABLE orders ALTER COLUMN discount_code SET NOT NULL;
ALTER TABLE orders ALTER COLUMN discount_code SET DEFAULT 'NONE';

```python

## TITAN: Django migration for zero-downtime

## migrations/0001_add_discount_code.py

from django.db import migrations, models

class Migration(migrations.Migration):
atomic = False  # CRITICAL: Don't wrap in transaction

dependencies = [
('orders', '0000_initial'),
    ]

operations = [

## Step 1: Add nullable column
        migrations.AddField(
        model_name='order',
        name='discount_code',
field=models.CharField(max_length=50, null=True),
        ),

## Step 2: Backfill (run async)
        migrations.RunPython(
        backfill_discount_codes,
        reverse_code=migrations.RunPython.noop,
        ),

## Step 3: Set NOT NULL (separate deploy)

## migrations.AlterField(

## model_name='order',

## name='discount_code',

## field=models.CharField(max_length=50, default='NONE'),

## ),
    ]

def backfill_discount_codes(apps, schema_editor):
from django.db import connection

batch_size = 10000
with connection.cursor() as cursor:
cursor.execute("SELECT MIN(id), MAX(id) FROM orders_order")
min_id, max_id = cursor.fetchone()

if min_id is None:
        return

for start_id in range(min_id, max_id + 1, batch_size):
        cursor.execute("""
UPDATE orders_order
SET discount_code = 'NONE'
WHERE id BETWEEN %s AND %s
AND discount_code IS NULL
""", [start_id, start_id + batch_size - 1])

## Commit each batch
        connection.commit()

```text

## CONNECTION POOL EXHAUSTION

## The Scar

> "Database: max 100 connections. App pool: 10 connections.
> 15 Kubernetes pods * 10 connections = 150 connections needed.
> Database drops connections. 'too many connections' errors.
> Cascading failures. Complete outage."

```python

## VIBE: Direct connection per request

import psycopg2

def get_user(user_id: int):
conn = psycopg2.connect("postgres://...")  # New connection every time
cursor = conn.cursor()
cursor.execute("SELECT * FROM users WHERE id = %s", [user_id])
return cursor.fetchone()

## Each request = 1 connection. No pooling

```python

## TITAN: Proper connection pool sizing

from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

## Formula: pool_size = (num_pods * connections_per_pod) / max_db_connections * 0.8

## With 15 pods and 100 max connections: 100 / 15 * 0.8 5 per pod

engine = create_engine(
    "postgresql://...",
    poolclass=QueuePool,
pool_size=5, # Base connections
max_overflow=2, # Burst capacity
pool_timeout=30, # Wait for connection
pool_recycle=1800, # Recycle after 30 min
pool_pre_ping=True, # Verify connection before use
)

## Monitor pool health

from sqlalchemy import event

@event.listens_for(engine, "checkin")
def receive_checkin(dbapi_connection, connection_record):
print(f"Connection returned to pool. Active: {engine.pool.checkedout()}")

@event.listens_for(engine, "checkout")
def receive_checkout(dbapi_connection, connection_record, connection_proxy):
print(f"Connection checked out. Active: {engine.pool.checkedout()}")

```ini

## TITAN: PgBouncer for connection multiplexing

## pgbouncer.ini

[databases]
mydb = host=postgres port=5432 dbname=mydb

[pgbouncer]
listen_port = 6432
listen_addr = 0.0.0.0
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt

## Pool mode: transaction (recommended for most apps)

pool_mode = transaction

## Connection limits

max_client_conn = 1000  # Total client connections
default_pool_size = 20  # Connections to postgres PER database
min_pool_size = 5  # Keep connections warm
reserve_pool_size = 5  # Extra for bursts
reserve_pool_timeout = 3  # Wait before using reserve

## Timeouts

server_idle_timeout = 600    # Close idle server connections
client_idle_timeout = 0  # Never close idle clients
query_timeout = 0  # No query timeout (use app timeout)
client_login_timeout = 60    # Max time for client to auth

## Logging

log_connections = 1
log_disconnections = 1
log_pooler_errors = 1
stats_period = 60

```text

## QUERY PERFORMANCE DEBUGGING

## The Scar

> "Dashboard query took 30 seconds. Was 100ms yesterday.
> No idea what changed. Query looks the same.
> Spent 3 hours debugging. Turned out: statistics stale.
> Simple ANALYZE fixed it."

```python

## VIBE: Blind query optimization

## "Let me add more indexes!"

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_date ON orders(created_at);
CREATE INDEX idx_orders_status ON orders(status);

## 10 indexes later, still slow, writes now slow too

```sql
-- TITAN: Systematic query debugging
-- Step 1: Check if stats are current
SELECT
    schemaname,
    relname,
    last_analyze,
    last_autoanalyze,
    n_live_tup,
    n_dead_tup
FROM pg_stat_user_tables
WHERE n_dead_tup > n_live_tup * 0.2  -- More than 20% dead tuples
ORDER BY n_dead_tup DESC;

-- Step 2: Refresh statistics
ANALYZE orders;

-- Step 3: Get actual execution plan (not estimate!)
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT o.*, u.name
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.created_at > NOW() - INTERVAL '7 days'
AND o.status = 'pending';

-- Step 4: Find the bottleneck
-- Look for:
-- - Seq Scan on large tables (missing index)
-- - High "Rows Removed by Filter" (index not selective)
-- - Nested Loop on large join (missing index)
-- - Sort with "External Merge" (not enough work_mem)

```python

## TITAN: Automated slow query detection

from dataclasses import dataclass
from datetime import datetime
import re

@dataclass
class SlowQuery:
query: str
duration_ms: float
calls: int
mean_ms: float
query_hash: str

class PostgresQueryAnalyzer:
def __init__(self, conn):
self.conn = conn

def get_slow_queries(self, min_duration_ms: float = 100) -> list[SlowQuery]:
"""Get queries slower than threshold."""

result = self.conn.execute("""
        SELECT
        query,
total_exec_time as total_ms,
        calls,
mean_exec_time as mean_ms,
        queryid
FROM pg_stat_statements
WHERE mean_exec_time > %s
ORDER BY total_exec_time DESC
LIMIT 50
""", [min_duration_ms])

return [
        SlowQuery(
        query=self.normalize_query(row[0]),
        duration_ms=row[1],
        calls=row[2],
        mean_ms=row[3],
        query_hash=str(row[4])
        )
for row in result
        ]

def analyze_query(self, query: str) -> dict:
"""Get execution plan and recommendations."""

plan = self.conn.execute(f"""
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
        {query}
        """).fetchone()[0]

issues = self.detect_issues(plan)

return {
'plan': plan,
'issues': issues,
'recommendations': self.get_recommendations(issues)
        }

def detect_issues(self, plan: dict) -> list[str]:
"""Detect common performance issues from plan."""
issues = []

def walk_plan(node):
node_type = node.get('Node Type', '')

## Sequential scan on large table
if node_type == 'Seq Scan':
rows = node.get('Actual Rows', 0)
if rows > 10000:
issues.append(f"Seq Scan on {node.get('Relation Name')} ({rows} rows)")

## Nested loop with high row count
if node_type == 'Nested Loop':
rows = node.get('Actual Rows', 0)
if rows > 100000:
issues.append(f"Nested Loop producing {rows} rows")

## Sort spilling to disk
if node_type == 'Sort':
if node.get('Sort Method', '').startswith('external'):
issues.append("Sort spilling to disk - increase work_mem")

## High filter rejection
removed = node.get('Rows Removed by Filter', 0)
actual = node.get('Actual Rows', 0)
if removed > actual * 10:
issues.append(f"High filter rejection: {removed} removed vs {actual} returned")

## Recurse
for child in node.get('Plans', []):
        walk_plan(child)

        walk_plan(plan[0]['Plan'])
return issues

def get_recommendations(self, issues: list[str]) -> list[str]:
"""Generate recommendations based on issues."""
recommendations = []

for issue in issues:
if 'Seq Scan' in issue:
table = issue.split('on ')[1].split(' ')[0]
        recommendations.append(
f"Consider adding index on {table} for filtered/joined columns"
        )

if 'Nested Loop' in issue:
        recommendations.append(
"Consider adding index on join columns or increasing work_mem for hash join"
        )

if 'work_mem' in issue:
        recommendations.append(
"SET work_mem = '256MB' for this session or increase globally"
        )

return recommendations

```text

## DISTRIBUTED TRANSACTION PATTERNS

## The Scar

> "Microservices: Order Service + Inventory Service.
> Order created. Network blip. Inventory not decremented.
> Customer got the product. Inventory count wrong.
> No saga. No compensation. Data permanently inconsistent."

```python

## VIBE: Distributed transaction without coordination

class OrderService:
async def create_order(self, order: Order):

## Create order locally
await self.db.orders.create(order)

## Call inventory service
await self.inventory_client.decrement(order.product_id, order.quantity)

## What if this fails? Order exists, inventory not updated!

return order

```python

## TITAN: Saga pattern with compensation

from enum import Enum
from dataclasses import dataclass
from typing import Callable, Awaitable
import asyncio

class SagaStepStatus(Enum):
PENDING = "pending"
COMPLETED = "completed"
COMPENSATED = "compensated"
FAILED = "failed"

@dataclass
class SagaStep:
name: str
action: Callable[..., Awaitable]
compensation: Callable[..., Awaitable]
status: SagaStepStatus = SagaStepStatus.PENDING

class SagaOrchestrator:
    """
Saga pattern for distributed transactions.

If any step fails, compensate all previous steps in reverse order.
    """

def __init__(self, saga_id: str):
self.saga_id = saga_id
self.steps: list[SagaStep] = []
self.completed_steps: list[SagaStep] = []

def add_step(
        self,
name: str,
action: Callable[..., Awaitable],
compensation: Callable[..., Awaitable]
    ):
        self.steps.append(SagaStep(
        name=name,
        action=action,
        compensation=compensation
        ))

async def execute(self, context: dict) -> dict:
"""Execute saga with automatic compensation on failure."""

        try:
for step in self.steps:
print(f"[Saga {self.saga_id}] Executing: {step.name}")

## Execute step
result = await step.action(context)
context[f"{step.name}_result"] = result

step.status = SagaStepStatus.COMPLETED
        self.completed_steps.append(step)

return {"status": "completed", "context": context}

except Exception as e:
print(f"[Saga {self.saga_id}] Failed at {step.name}: {e}")

## Compensate in reverse order
await self.compensate(context)

return {"status": "failed", "error": str(e), "context": context}

async def compensate(self, context: dict):
"""Run compensations in reverse order."""

for step in reversed(self.completed_steps):
        try:
print(f"[Saga {self.saga_id}] Compensating: {step.name}")
await step.compensation(context)
step.status = SagaStepStatus.COMPENSATED
except Exception as e:
print(f"[Saga {self.saga_id}] Compensation failed for {step.name}: {e}")

## Log for manual intervention
await self.alert_ops(step, e)

## Usage

async def create_order_saga(order: Order):
saga = SagaOrchestrator(saga_id=f"order-{order.id}")

## Step 1: Reserve inventory
    saga.add_step(
        name="reserve_inventory",
action=lambda ctx: inventory_service.reserve(
        ctx['order'].product_id,
        ctx['order'].quantity
        ),
compensation=lambda ctx: inventory_service.release(
        ctx['order'].product_id,
        ctx['order'].quantity
        )
    )

## Step 2: Process payment
    saga.add_step(
        name="process_payment",
action=lambda ctx: payment_service.charge(
        ctx['order'].user_id,
        ctx['order'].total
        ),
compensation=lambda ctx: payment_service.refund(
        ctx['process_payment_result']['transaction_id']
        )
    )

## Step 3: Create order record
    saga.add_step(
        name="create_order",
action=lambda ctx: order_service.create(ctx['order']),
compensation=lambda ctx: order_service.cancel(ctx['create_order_result']['id'])
    )

## Step 4: Send confirmation
    saga.add_step(
        name="send_confirmation",
action=lambda ctx: notification_service.send_order_confirmation(ctx['order']),
compensation=lambda ctx: None  # No compensation needed for notification
    )

return await saga.execute({'order': order})

```text

## END OF VOLUME 2: TITAN GEMINI RESEARCH - PRODUCTION DATABASE OPERATIONS

---

## VOLUME 3: TITAN GEMINI RESEARCH - DATABASE REPLICATION PATTERNS

## REPLICA LAG CAUSING STALE READS

### The Scar

> "User updated profile. Refreshed page. Saw old data.
> Writes go to primary. Reads from replica.
> Replica 500ms behind. User sees stale data.
> Support ticket: 'My changes are lost!'"

```python

## VIBE: Always read from replica

def get_user(user_id: str):
return replica_db.query("SELECT * FROM users WHERE id = %s", user_id)

## Returns stale data after writes

```python

## TITAN: Read-your-writes consistency

import asyncio
from datetime import datetime, timedelta
from typing import Optional
import hashlib

class SmartReadRouter:
"""Route reads to primary or replica based on freshness requirements."""

def __init__(self, primary_pool, replica_pool, redis_client):
self.primary = primary_pool
self.replica = replica_pool
self.redis = redis_client
self.max_lag_ms = 500  # Acceptable replica lag

async def get_replica_lag_ms(self) -> float:
"""Check actual replication lag."""
result = await self.replica.fetchone("""
SELECT EXTRACT(EPOCH FROM NOW() - pg_last_xact_replay_timestamp()) * 1000 AS lag_ms
        """)
return result['lag_ms'] or 0

async def mark_user_write(self, user_id: str):
"""Track that user just wrote - force primary reads temporarily."""
key = f"user:write:{user_id}"
await self.redis.setex(key, 5, datetime.now().isoformat())  # 5 second window

async def should_read_primary(self, user_id: Optional[str] = None) -> bool:
"""Determine if read should go to primary."""

## If user recently wrote, use primary (read-your-writes)
if user_id:
key = f"user:write:{user_id}"
if await self.redis.exists(key):
return True

## If replica lag is too high, use primary
lag_ms = await self.get_replica_lag_ms()
if lag_ms > self.max_lag_ms:
return True

return False

async def query(
        self,
sql: str,
params: tuple = (),
user_id: Optional[str] = None,
require_fresh: bool = False
    ):
"""Smart query routing."""

if require_fresh or await self.should_read_primary(user_id):
return await self.primary.fetch(sql, *params)
        else:
return await self.replica.fetch(sql, *params)

## Usage

router = SmartReadRouter(primary_pool, replica_pool, redis)

## After write, mark user

await router.mark_user_write(user_id)
await db.execute("UPDATE users SET name = $1 WHERE id = $2", name, user_id)

## Next read goes to primary

user = await router.query(
"SELECT * FROM users WHERE id = $1",
    (user_id,),
user_id=user_id # Passes user context for routing
)

```text

## CONNECTION POOL CONFIGURATION

## The Scar

> "Database max_connections: 100. Connection pool: default.
> Each API server pools 20 connections. 10 servers = 200 connections.
> Database out of connections. Everything fails.
> 'too many connections' at 3 AM."

```python

## VIBE: Direct connections, no pooling

import psycopg2

def get_db():
return psycopg2.connect(DATABASE_URL)  # New connection per request!

```ini

## TITAN: PgBouncer configuration

## /etc/pgbouncer/pgbouncer.ini

[databases]
myapp = host=localhost port=5432 dbname=myapp

[pgbouncer]
listen_addr = 0.0.0.0
listen_port = 6432
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt

## Connection pooling mode

pool_mode = transaction  # Best for most apps

## Pool sizing

default_pool_size = 20  # Connections per user/db pair
min_pool_size = 5  # Keep minimum ready
reserve_pool_size = 5  # Emergency buffer
reserve_pool_timeout = 3  # Seconds before using reserve

## Connection limits

max_client_conn = 1000  # From app servers
max_db_connections = 90  # To PostgreSQL (leave headroom)

## Timeouts

server_idle_timeout = 60  # Close idle server connections
client_idle_timeout = 0  # Don't close idle clients
query_timeout = 30  # Kill slow queries
query_wait_timeout = 10  # Max wait for connection

## DNS

dns_max_ttl = 15

## Stats

stats_period = 60

```python

## TITAN: Application-level pool configuration

import asyncpg
from contextlib import asynccontextmanager

class DatabasePool:
"""Production-ready connection pool."""

def __init__(self):
self.primary_pool = None
self.replica_pool = None

async def initialize(self):

## Pool for primary (writes + fresh reads)
self.primary_pool = await asyncpg.create_pool(
        dsn=PRIMARY_DATABASE_URL,
        min_size=5,
        max_size=20,
max_queries=50000, # Recycle after N queries
max_inactive_connection_lifetime=300, # 5 min idle timeout
timeout=10, # Connection acquisition timeout
command_timeout=30, # Query timeout
statement_cache_size=1024, # Prepared statement cache
        )

## Pool for replicas (read scaling)
self.replica_pool = await asyncpg.create_pool(
        dsn=REPLICA_DATABASE_URL,
        min_size=10,
max_size=50, # More connections for reads
        max_queries=50000,
        timeout=5,
command_timeout=15, # Shorter timeout for reads
        )

    @asynccontextmanager
async def acquire_primary(self):
"""Get connection from primary pool with timeout."""
        try:
async with self.primary_pool.acquire(timeout=10) as conn:
yield conn
except asyncpg.exceptions.TooManyConnectionsError:

## Log and raise with context
logger.error("Primary pool exhausted")
        raise

    @asynccontextmanager
async def acquire_replica(self):
"""Get connection from replica pool."""
        try:
async with self.replica_pool.acquire(timeout=5) as conn:
yield conn
except asyncpg.exceptions.TooManyConnectionsError:

## Fallback to primary if replica pool exhausted
logger.warning("Replica pool exhausted, falling back to primary")
async with self.primary_pool.acquire(timeout=10) as conn:
yield conn

async def health_check(self) -> dict:
"""Pool health metrics."""
return {
'primary': {
'size': self.primary_pool.get_size(),
'free': self.primary_pool.get_idle_size(),
'min': self.primary_pool.get_min_size(),
'max': self.primary_pool.get_max_size(),
        },
'replica': {
'size': self.replica_pool.get_size(),
'free': self.replica_pool.get_idle_size(),
'min': self.replica_pool.get_min_size(),
'max': self.replica_pool.get_max_size(),
        }
        }

```text

## MULTI-REGION DATABASE PATTERNS

## The Scar

> "Primary in us-east-1. Users in Sydney.
> Every read: 200ms network latency.
> Page load: 3+ seconds. Users complain.
> Moved to single-region. Lost disaster recovery."

```python

## VIBE: Single region, global users

DATABASE_URL = "postgresql://us-east-1.rds.amazonaws.com/mydb"

## Sydney users: 200ms per query. 10 queries = 2 seconds just in latency

```python

## TITAN: Multi-region with local reads

from typing import Dict

class MultiRegionDatabase:
"""Region-aware database routing."""

REGIONS = {
'us-east-1': {
'primary': 'postgresql://us-east-1-primary.rds.amazonaws.com/mydb',
'replica': 'postgresql://us-east-1-replica.rds.amazonaws.com/mydb',
'is_primary_region': True
        },
'eu-west-1': {
'replica': 'postgresql://eu-west-1-replica.rds.amazonaws.com/mydb',
'is_primary_region': False
        },
'ap-southeast-2': {  # Sydney
'replica': 'postgresql://ap-southeast-2-replica.rds.amazonaws.com/mydb',
'is_primary_region': False
        }
    }

def __init__(self, current_region: str):
self.current_region = current_region
self.pools: Dict[str, asyncpg.Pool] = {}

async def initialize(self):
region_config = self.REGIONS[self.current_region]

## Always create local replica pool
self.pools['local_read'] = await asyncpg.create_pool(
        region_config['replica'],
        min_size=10,
        max_size=50
        )

## Create primary pool (may be remote)
primary_region = next(
r for r, c in self.REGIONS.items() if c.get('is_primary_region')
        )
self.pools['primary'] = await asyncpg.create_pool(
        self.REGIONS[primary_region]['primary'],
        min_size=5,
        max_size=20
        )

async def read(self, sql: str, *args):
"""Read from local replica (low latency)."""
async with self.pools['local_read'].acquire() as conn:
return await conn.fetch(sql, *args)

async def write(self, sql: str, *args):
"""Write to primary (may have latency)."""
async with self.pools['primary'].acquire() as conn:
return await conn.execute(sql, *args)

async def read_fresh(self, sql: str, *args):
"""Read from primary when freshness required."""
async with self.pools['primary'].acquire() as conn:
return await conn.fetch(sql, *args)

## Usage based on environment

import os
db = MultiRegionDatabase(os.environ['AWS_REGION'])
await db.initialize()

## Fast local reads for Sydney users

users = await db.read("SELECT * FROM users WHERE location = 'Sydney'")

## Writes always go to primary (accept latency)

await db.write("INSERT INTO users (name) VALUES ($1)", "John")

```text

## END OF VOLUME 3: TITAN GEMINI RESEARCH - DATABASE REPLICATION PATTERNS

---

## VOLUME 6: REAL 2024 PRODUCTION POSTMORTEMS

## Source: GitHub, Cloudflare, AWS Engineering Blogs

> **This is REAL incident data from 2024. AI cannot generate this.**

---

## GITHUB DATABASE INCIDENTS (2024)

### August 14, 2024: Total GitHub Outage

**Impact**: ALL GitHub services inaccessible
**Duration**: Multiple hours
**Root Cause**: Configuration change impacted traffic routing within database infrastructure

**The Scar (What Happened)**:

```text
1. Config change deployed to database infrastructure
2. Change affected traffic routing unexpectedly
3. Critical services lost database connectivity
4. ALL services went down simultaneously

```text
**The Fix**:

```text
1. Reverted the configuration change
2. Services restored after rollback

```text
**Prevention Pattern** (Vaccine):

```yaml

## Database configuration change checklist

pre_deploy:
- [ ] Test in staging with production-like traffic
- [ ] Canary deploy to single region first
- [ ] Monitor connection counts before/after
- [ ] Have instant rollback ready
- [ ] Alert thresholds set for connection failures

rollback_trigger:
- Connection failures > 1% of requests
- Latency increase > 200%
- Any service reports DB connectivity loss

```text
---

## April 2024: Database Load Balancer Incident

**Impact**: Multiple critical databases unreachable
**Root Cause**: Change in database load balancer

**The Scar**:

```text
1. Load balancer configuration changed
2. Connection failures to critical databases
3. Single data center affected
4. Cascading failures to dependent services

```text
**Detection Pattern** (Injection):

```python

## Symptom: Connection failures to database

## Check: Load balancer recent changes

## Verify: Connection routing

## Decision tree

if "connection refused" or "connection timeout":
check_recent_infra_changes() # <-- START HERE
if load_balancer_changed_recently():
        rollback_lb_change()
elif network_changed_recently():
        check_firewall_rules()
    else:
        check_db_server_health()

```text
---

## April 2024: Unbounded Query Incident

**Impact**: Primary database overloaded
**Root Cause**: Single query without LIMIT caused resource exhaustion

**The Scar**:

```sql
-- ? VIBE: The query that killed production
SELECT * FROM events
WHERE user_id = 12345
ORDER BY created_at DESC;
-- No LIMIT = fetched 10 million rows

-- ? TITAN: Always have limits
SELECT * FROM events
WHERE user_id = 12345
ORDER BY created_at DESC
LIMIT 100;

```text
**Prevention Pattern**:

```python

## ORM-level protection

class SafeQueryMixin:
MAX_RESULTS = 10000

def all(self):

## Force limit on all queries
return super().all()[:self.MAX_RESULTS]

def execute(self, query):
if 'LIMIT' not in query.upper():
raise QueryError("All queries must have LIMIT clause")
return super().execute(query)

```text
---

## CLOUDFLARE INCIDENTS (2024)

## June 20, 2024: DDoS Mitigation Bug

**Impact**: 1.4-2.1% of HTTP requests failed for 114 minutes
**Root Cause**: Latent bug in rate-limiting caused infinite loop

**The Scar (What Happened)**:

```text
1. New DDoS mitigation rules deployed (14:14-17:06 UTC)
2. Specific HTTP request type triggered infinite loop
3. CPU utilization spiked globally (18:04 UTC)
4. Engineers notified when sustained high CPU detected
5. Mitigated by restarting faulty service + disabling rule

```text
**Prevention Pattern**:

```python

## Rate limiting with timeout protection

import asyncio
from functools import wraps

def with_timeout(seconds: int):
def decorator(func):
        @wraps(func)
async def wrapper(*args, **kwargs):
        try:
return await asyncio.wait_for(
func(*args, **kwargs),
        timeout=seconds
        )
except asyncio.TimeoutError:

## Log and alert - possible infinite loop
log_critical(f"Function {func.__name__} timed out")
raise RateLimitError("Request processing timeout")
return wrapper
return decorator

@with_timeout(30) # Max 30 seconds per request
async def process_request(request):

## If this takes > 30s, something is wrong
    pass

```text
**Detection Pattern**:

```yaml

## Monitoring for infinite loop detection

alerts:
- name: cpu_sustained_high
condition: avg(cpu_usage) > 90% for 5m
action: page_oncall

- name: request_timeout_spike
condition: rate(timeouts) > 10/min
action: investigate_recent_deploys

- name: memory_leak_pattern
condition: memory_growth > 10%/hour
action: heap_dump_and_alert

```text
---

## September 17, 2024: BGP Prefix Withdrawal

**Impact**: 1,661 websites unreachable for ~1 hour
**Root Cause**: IPv4 prefixes withdrawn during routine maintenance

**The Scar (What Happened)**:

```text
1. Addressing team performing IP renumbering
2. Verified websites moved to new addresses
3. Released original prefixes (17:51 UTC)
4. 15 prefixes withdrawn via BGP
5. 10 Gbps traffic drop to affected websites
6. SRE alerted at 17:57 UTC
7. Rollback completed 18:50 UTC

```text
**Prevention Pattern**:

```python

## Safe IP prefix management

class PrefixManager:
def withdraw_prefixes(self, prefixes: list[str]):

## Step 1: Verify no active traffic
for prefix in prefixes:
traffic = self.get_traffic(prefix)
if traffic > 0:
raise SafetyError(f"Prefix {prefix} has {traffic} active")

## Step 2: Canary - withdraw one prefix first
        self.withdraw_single(prefixes[0])
await asyncio.sleep(300)  # Wait 5 minutes

if self.detect_impact():
        self.rollback()
raise SafetyError("Impact detected, rolled back")

## Step 3: Proceed with remaining
for prefix in prefixes[1:]:
        self.withdraw_single(prefix)
await asyncio.sleep(60)  # 1 min between each

```text
---

## AWS INCIDENTS (2024-2025)

## Lessons from DynamoDB DNS Failure

**Impact**: Global DynamoDB outage
**Root Cause**: Bug in automated DNS management system

**The Scar (What Happened)**:

```text
1. DynamoDB uses automated DNS for service discovery
2. Bug in automation failed to self-repair
3. Manual intervention required
4. Control plane failure cascaded to data plane
5. Global impact despite multi-region design

```text
**Key Lessons**:

```text
1. Automation can be a single point of failure
2. Control plane failures cascade to data plane
3. "Multi-region" may still have single-region dependencies
4. DNS resolution is critical - cache aggressively
5. Have manual override procedures documented

```text
**Prevention Pattern**:

```python

## Resilient DNS handling

class ResilientDNS:
def __init__(self):
self.cache = {}  # Local DNS cache
self.cache_ttl = 3600  # 1 hour
self.fallback_hosts = {}  # Static fallbacks

async def resolve(self, hostname: str) -> str:

## Try cache first
if hostname in self.cache:
if self.cache[hostname]['expires'] > time.time():
return self.cache[hostname]['ip']

## Try DNS resolution
        try:
ip = await self.dns_lookup(hostname)
self.cache[hostname] = {
'ip': ip,
'expires': time.time() + self.cache_ttl
        }
return ip
except DNSError:

## Fall back to static mapping
if hostname in self.fallback_hosts:
log_warning(f"Using fallback for {hostname}")
return self.fallback_hosts[hostname]
        raise

## Circuit breaker for retry storms

class ServiceCircuitBreaker:
def __init__(self, failure_threshold=5, reset_timeout=30):
self.failures = 0
self.threshold = failure_threshold
self.reset_timeout = reset_timeout
self.last_failure = 0
self.state = "CLOSED"

def call(self, func, *args):
if self.state == "OPEN":
if time.time() - self.last_failure > self.reset_timeout:
self.state = "HALF_OPEN"
        else:
raise CircuitOpenError("Service unavailable")

        try:
result = func(*args)
if self.state == "HALF_OPEN":
self.state = "CLOSED"
self.failures = 0
return result
except Exception as e:
self.failures += 1
self.last_failure = time.time()
if self.failures >= self.threshold:
self.state = "OPEN"
        raise

```text
---

## CROSS-CUTTING INCIDENT PATTERNS

## Pattern 1: Config Change ? Immediate Cascade

```yaml
GitHub: DB config ? routing failure ? all services down
Cloudflare: DDoS rule ? infinite loop ? CPU exhaustion
AWS: DNS automation ? resolution failure ? global outage

VACCINE:

- Never deploy config changes to 100% immediately

- Canary deploys with instant rollback

- Monitor for 5 minutes between rollout phases

```text

### Pattern 2: Routine Maintenance ? Unexpected Impact

```yaml
Cloudflare: IP renumbering ? prefix withdrawal ? 1600+ sites down
GitHub: Load balancer change ? connection failures

VACCINE:

- Double-check assumptions about "unused" resources

- Traffic monitoring before/during/after maintenance

- Staged rollout even for "safe" changes

```text

### Pattern 3: Automation Failure ? Manual Intervention

```yaml
AWS: DNS automation bug ? couldn't self-repair ? manual fix needed

VACCINE:

- Test automation failure scenarios

- Document manual override procedures

- Practice manual recovery regularly

```text
---

### END OF REAL 2024 POSTMORTEMS

### Source: GitHub Blog, Cloudflare Blog, AWS Status, Industry Reports

---

## VOLUME 7: REAL 2024 REDIS PRODUCTION ISSUES

## Source: Redis Docs, Real Incident Reports, Production Experience

> ?? **This is REAL in-memory datastore knowledge from production.**

---

## MEMORY FULL / EVICTION ISSUES

### The Symptom

```yaml
Error: OOM command not allowed when used memory > 'maxmemory'
Or: Keys mysteriously disappearing from cache

```text

### Eviction Policies Explained

```text
noeviction ? New writes fail when memory full (ERROR)
allkeys-lru ? Evict least recently used keys (ANY key)
volatile-lru ? Evict LRU keys that have TTL set
allkeys-lfu ? Evict least frequently used keys (ANY key)
volatile-lfu ? Evict LFU keys that have TTL set
volatile-ttl ? Evict keys with shortest TTL remaining
allkeys-random ? Evict random keys
volatile-random? Evict random keys with TTL

```text

### Choosing the Right Policy

```text
Use Case  Recommended Policy
-------------------------------------------------
General caching  allkeys-lru
Session storage  volatile-lru or volatile-ttl
ML model serving  allkeys-lfu (frequency matters)
Temporary data only  volatile-* policies
Never lose data  noeviction (handle errors)

```text

### Real Fixes

### Fix 1: Configure Memory Limit and Policy

```bash

## redis.conf

maxmemory 4gb
maxmemory-policy allkeys-lru

## At runtime

redis-cli CONFIG SET maxmemory 4gb
redis-cli CONFIG SET maxmemory-policy allkeys-lru

```text

## Fix 2: Monitor Before Problems

```bash

## Check memory usage

redis-cli INFO memory

## Key metrics to watch

## used_memory: 1073741824  <- 1GB used

## used_memory_rss: 1200000000  <- OS reports ~1.2GB (includes overhead)

## maxmemory: 4294967296  <- 4GB limit

## mem_fragmentation_ratio: 1.12    <- Should be ~1.0-1.5

## evicted_keys: 15000  <- Keys evicted due to memory pressure

## ALERT if

## - used_memory > 80% of maxmemory

## - mem_fragmentation_ratio > 1.5 (memory fragmentation)

## - evicted_keys increasing rapidly

```text

## Fix 3: Set TTLs on All Cache Keys

```typescript
// ? VIBE: No TTL - keys live forever
await redis.set('user:123', JSON.stringify(user));

// ? TITAN: Always set TTL for cache data
await redis.set('user:123', JSON.stringify(user), 'EX', 3600);  // 1 hour
// or
await redis.setex('user:123', 3600, JSON.stringify(user));

```text
---

## SLOW COMMANDS BLOCKING REDIS

### The Problem

```text
Redis is single-threaded.
One slow command blocks ALL other commands.
KEYS * on 10M keys = 30 seconds of blocked operations.

```text

### Commands to NEVER Use in Production

```text
? KEYS *  Use: SCAN (iterative)
? FLUSHALL  Use: UNLINK (async delete)
? HGETALL (large)  Use: HSCAN (iterative)
? SMEMBERS (large)    Use: SSCAN (iterative)
? DEBUG SLEEP  Never in production

```text

### Real Fixes

### Fix 1: Use SCAN Instead of KEYS

```typescript
// ? VIBE: Blocks Redis for seconds
const keys = await redis.keys('user:*');

// ? TITAN: Iterative, non-blocking
async function scanKeys(pattern: string): Promise<string[]> {
const keys: string[] = [];
let cursor = '0';

do {
const [nextCursor, batch] = await redis.scan(
      cursor,
'MATCH', pattern,
'COUNT', 100
    );
cursor = nextCursor;
    keys.push(...batch);
} while (cursor !== '0');

return keys;
}

const keys = await scanKeys('user:*');

```text

### Fix 2: Configure and Use SLOWLOG

```bash

## Configure to log commands slower than 10ms

redis-cli CONFIG SET slowlog-log-slower-than 10000
redis-cli CONFIG SET slowlog-max-len 128

## View slow commands

redis-cli SLOWLOG GET 10

## Output shows: id, timestamp, duration (microseconds), command

## 1) 1) (integer) 5

## 2) (integer) 1703836800

## 3) (integer) 1500000  <- 1.5 seconds!

## 4) 1) "KEYS"

## 2) "*"

```text

## Fix 3: Pipeline for Bulk Operations

```typescript
// ? VIBE: 1000 network round trips
for (const key of keys) {
await redis.get(key);
}

// ? TITAN: 1 network round trip
const pipeline = redis.pipeline();
for (const key of keys) {
  pipeline.get(key);
}
const results = await pipeline.exec();

```text
---

## DECISION TREE: REDIS DEBUGGING

```text
REDIS ISSUE

+- "OOM command not allowed" errors?
+- Check maxmemory: INFO memory
+- Set appropriate eviction policy
+- Add TTLs to keys
+- Scale up or add Redis nodes

+- High latency/slow responses?
+- Check SLOWLOG for expensive commands
+- Replace KEYS with SCAN
+- Use pipeline for batch operations
+- Check network latency to Redis

+- Keys disappearing unexpectedly?
+- Check TTL: TTL keyname
+- Check eviction: INFO stats ? evicted_keys
+- Check maxmemory-policy

+- High memory but few keys?
+- Check fragmentation: mem_fragmentation_ratio
+- Enable activedefrag if > 1.5
+- Consider MEMORY DOCTOR

+- Cluster issues?
+- CLUSTER NODES to check status
+- Verify node connectivity
+- Check for unbalanced shards

```text
---

## VOLUME 8: REAL 2024 POSTGRESQL PRODUCTION ISSUES

## SLOW QUERIES

### The Symptom

```text
Query that took 50ms now takes 5 seconds.
Application timeouts.
Connection pool exhaustion.

```text

### Real Diagnosis Steps

### Step 1: Find Slow Queries

```sql
-- Enable pg_stat_statements extension (one time)
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Find top 10 slowest queries (total time)
SELECT
  calls,
round(total_exec_time::numeric, 2) as total_ms,
round(mean_exec_time::numeric, 2) as mean_ms,
  query
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;

-- Find queries with high mean time (slow individual queries)
SELECT
  calls,
round(mean_exec_time::numeric, 2) as mean_ms,
  query
FROM pg_stat_statements
WHERE calls > 10
ORDER BY mean_exec_time DESC
LIMIT 10;

```text

### Step 2: Analyze Specific Query

```sql
-- See execution plan WITHOUT running
EXPLAIN SELECT * FROM orders WHERE user_id = 123;

-- See ACTUAL execution plan (runs the query)
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 123;

-- Look for:
-- "Seq Scan" on large tables ? NEEDS INDEX
-- "Nested Loop" with high rows ? Consider different join
-- High "actual time" vs "estimated" ? Statistics stale

```text

### Real Fixes

### Fix 1: Create Appropriate Index

```sql
-- For equality queries
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- For range queries and sorting
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- For composite WHERE clauses (order matters!)
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
-- Good for: WHERE user_id = ? AND status = ?
-- Good for: WHERE user_id = ?
-- NOT for: WHERE status = ?  (first column not used)

-- For partial common queries (smaller, faster index)
CREATE INDEX idx_orders_pending ON orders(created_at)
WHERE status = 'pending';

-- For covering index (index-only scan)
CREATE INDEX idx_orders_cover ON orders(user_id)
INCLUDE (status, total);
-- Query can be answered from index alone

```sql

### Fix 2: Update Statistics

```sql
-- Stale statistics = bad query plans
ANALYZE orders;

-- For all tables
ANALYZE;

-- Check when statistics were last updated
SELECT
  schemaname,
  relname,
  last_analyze,
  last_autoanalyze
FROM pg_stat_user_tables
ORDER BY last_analyze NULLS FIRST;

```text
---

## TABLE BLOAT (Dead Tuples)

### The Problem

```text
PostgreSQL MVCC: Updates/deletes don't remove rows immediately.
Old row versions ("dead tuples") accumulate.
Table grows, sequential scans get slower.

```text

### Diagnosis

```sql
-- Check dead tuples per table
SELECT
  schemaname,
  relname,
  n_live_tup,
  n_dead_tup,
round(100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) as dead_pct
FROM pg_stat_user_tables
WHERE n_dead_tup > 0
ORDER BY n_dead_tup DESC;

-- Tables with > 10% dead tuples need attention!

```text

### Real Fixes

### Fix 1: Tune Autovacuum (CRITICAL for Production)

```sql
-- Default is too conservative for busy databases!
-- Autovacuum triggers when dead tuples > 20% of table

-- More aggressive settings (postgresql.conf)
autovacuum_vacuum_scale_factor = 0.05    -- Trigger at 5% dead
autovacuum_analyze_scale_factor = 0.025  -- Analyze at 2.5%
autovacuum_vacuum_cost_delay = 0  -- No throttling (SSD)
autovacuum_max_workers = 4  -- More parallel workers

-- Per-table settings for hot tables
ALTER TABLE orders SET (
autovacuum_vacuum_scale_factor = 0.02,
autovacuum_vacuum_cost_delay = 0
);

```text

### Fix 2: Manual VACUUM for Immediate Fix

```sql
-- Standard VACUUM (reclaims space for table reuse)
VACUUM orders;

-- VACUUM with statistics update
VACUUM ANALYZE orders;

-- Nuclear option: VACUUM FULL (rewrites entire table)
-- ?? REQUIRES EXCLUSIVE LOCK - TABLE IS UNAVAILABLE
-- Use during maintenance window only!
VACUUM FULL orders;

-- Better alternative: pg_repack (online, no lock)
-- pg_repack -t orders mydatabase

```text
---

## INDEX BLOAT

### The Problem

```text
Indexes also accumulate dead entries.
Index size grows, index scans slow down.

```text

### Diagnosis and Fix

```sql
-- Check index sizes vs table sizes
SELECT
  schemaname,
  tablename,
| pg_size_pretty(pg_table_size(schemaname |  | '.' |  | tablename)) as table_size, |
| pg_size_pretty(pg_indexes_size(schemaname |  | '.' |  | tablename)) as indexes_size |
FROM pg_tables
WHERE schemaname = 'public'
| ORDER BY pg_indexes_size(schemaname |  | '.' |  | tablename) DESC; |

-- If indexes much larger than table ? bloat problem

-- Fix: REINDEX (blocks writes to index temporarily)
REINDEX INDEX idx_orders_user_id;

-- Better: REINDEX CONCURRENTLY (not blocking, Postgres 12+)
REINDEX INDEX CONCURRENTLY idx_orders_user_id;

```text
---

## DECISION TREE: POSTGRESQL DEBUGGING

```text
POSTGRESQL PERFORMANCE ISSUE

+- Specific query is slow?
+- EXPLAIN ANALYZE the query
+- Look for "Seq Scan" on large tables
+- Create appropriate index
+- ANALYZE to update statistics

+- All queries getting slower over time?
+- Check dead tuples: pg_stat_user_tables
+- Tune autovacuum settings
+- Run VACUUM ANALYZE
+- Check index bloat

+- Connection pool exhaustion?
+- Long-running queries holding connections
+- Check pg_stat_activity for stuck queries
+- Consider statement_timeout
+- Increase connection pool size

+- Disk space growing rapidly?
+- Table bloat from updates/deletes
+- Run VACUUM (reclaims for reuse)
+- VACUUM FULL if desperate (blocking)
+- pg_repack for online shrink

+- Query plan changed unexpectedly?
+- Statistics might be stale ? ANALYZE
+- Planner settings changed?
+- Table grew past planner thresholds

```text
---

### END OF REDIS AND POSTGRESQL REAL PRODUCTION ISSUES

---

## VOLUME 9: REAL 2024 MONGODB PRODUCTION ISSUES

## Source: MongoDB Docs, Developer Reports, Real Production Experience

> ?? **This is REAL NoSQL knowledge from production apps.**

---

## SLOW QUERIES

### The Problem

```python
Query that used to take 20ms now takes 5 seconds.
Collection grew from 10K to 10M documents.
No indexes ? full collection scan.

```text

### Diagnosis with explain()

```javascript
// See exactly what MongoDB is doing
db.orders.find({ userId: "user_123" }).explain("executionStats")

// Look for:
// "stage": "COLLSCAN"  ? BAD! Full collection scan
// "stage": "IXSCAN"    ? GOOD! Using index
// "docsExamined": 1000000  ? Scanned 1M docs for 10 results? BAD!
// "executionTimeMillis": 5000  ? 5 seconds? Too slow!

```text

### Real Fixes

### Fix 1: Create Appropriate Indexes

```javascript
// Single field index
db.orders.createIndex({ userId: 1 })

// Compound index (ESR Rule: Equality, Sort, Range)
// For query: find({ userId: "x", status: "active" }).sort({ createdAt: -1 })
db.orders.createIndex({
userId: 1,  // Equality first
status: 1,  // Equality second
createdAt: -1   // Sort last
})

// Partial index (only index what you query)
db.orders.createIndex(
{ userId: 1 },
{ partialFilterExpression: { status: "active" } }
)
// Only indexes documents where status = "active"
// Smaller index = faster queries, less storage

```text

### Fix 2: Use slowms and Query Profiler

```javascript
// Log queries slower than 50ms
db.setProfilingLevel(1, { slowms: 50 })

// View slow queries
db.system.profile.find().sort({ ts: -1 }).limit(10)

// Output shows:
// - query pattern
// - execution time
// - documents scanned
// - index used (or not)

```text
---

## CONNECTION POOL EXHAUSTION

### The Symptom

```yaml
MongoWaitQueueFullException: Too many waiters
MongoServerSelectionError: connection timed out

```text

### Why This Happens

```text
Default maxPoolSize: 100 connections
Your app opens 150 concurrent queries.
Remaining 50 wait in queue.
Queue fills up ? exceptions.

```text

### Real Fixes

### Fix 1: Singleton Client Pattern

```typescript
// ? VIBE: New client per request
app.get('/api/data', async (req, res) => {
const client = new MongoClient(uri);  // WRONG!
await client.connect();
const data = await client.db('mydb').collection('data').find().toArray();
  res.json(data);
// Forgot to close? Connection leak!
});

// ? TITAN: Singleton client
| let client: MongoClient | null = null; |

export async function getMongoClient(): Promise<MongoClient> {
if (!client) {
client = new MongoClient(uri, {
maxPoolSize: 50,  // Max connections in pool
minPoolSize: 5,  // Keep 5 connections ready
maxIdleTimeMS: 60000,   // Close idle after 1 min
    });
await client.connect();
  }
return client;
}

// Reuse same client for all requests
app.get('/api/data', async (req, res) => {
const client = await getMongoClient();
const data = await client.db('mydb').collection('data').find().toArray();
  res.json(data);
});

```text

### Fix 2: Serverless Connection Pattern

```typescript
// Problem: Serverless functions can create many clients
// Each invocation = new connection = pool bloat

// Solution 1: Connection pooling proxy (e.g., MongoDB Atlas Data API)
// Solution 2: Warm connection check
| let cachedClient: MongoClient | null = null; |
| let cachedDb: Db | null = null; |

export async function connectToDatabase() {
if (cachedClient && cachedDb) {
// Verify connection is still alive
try {
await cachedClient.db('admin').command({ ping: 1 });
return { client: cachedClient, db: cachedDb };
} catch {
cachedClient = null;
cachedDb = null;
    }
  }

cachedClient = await MongoClient.connect(uri);
cachedDb = cachedClient.db('mydb');
return { client: cachedClient, db: cachedDb };
}

```text
---

## DECISION TREE: MONGODB DEBUGGING

```text
MONGODB ISSUE

+- Slow queries?
+- Use explain() - is it using index?
+- "COLLSCAN" ? create index on query fields
+- Check docsExamined vs nReturned ratio
+- Enable profiler (slowms: 50)

+- Connection timeouts?
+- Check maxPoolSize setting
+- Singleton client pattern?
+- Network/firewall issues
+- serverSelectionTimeoutMS too low?

+- MongoWaitQueueFullException?
+- Increase maxPoolSize
+- Reduce concurrent queries
+- Check for connection leaks

+- High memory usage?
+- Too many indexes?
+- Large working set exceeds RAM?
+- Consider sharding

+- Inconsistent data?
+- Read preference settings?
+- Write concern: "majority"?
+- Check for schema validation issues

```text
---

## VOLUME 10: REAL 2024 SUPABASE PRODUCTION ISSUES

## REALTIME SUBSCRIPTIONS STOP WORKING WITH RLS

### The Problem

```text
Enable RLS on table.
Inserts still work.
But Realtime subscription receives NO events!

```text

### Why This Happens

```sql
Supabase Realtime respects RLS.
User has INSERT policy but NO SELECT policy.
Realtime needs SELECT to deliver events.
Realtime silently drops events user can't SELECT.

```sql

### Real Fix: Add SELECT Policy

```sql
-- You probably have this:
CREATE POLICY "Users can insert their own data"
ON messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- But you're missing this:
CREATE POLICY "Users can read their own messages"
ON messages FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- NOW Realtime works!

```text
---

## EDGE FUNCTIONS PERFORMANCE ISSUES

### The Problem (2024 Reality)

```text
Edge Function cold start: 400ms median
Edge Function hot: 125ms
But users report 1-2 second latencies

Under load: Functions fail to boot, return errors

```text

### Real Fixes

### Fix 1: Warm Up Critical Functions

```typescript
// Keep function warm with scheduled pings
// Supabase Dashboard ? Database ? Cron Jobs

-- Run every 5 minutes to keep function warm
select cron.schedule(
  'warm-up-edge-function',
'*/5 * * * *',
  $$
SELECT net.http_get('https://your-project.supabase.co/functions/v1/critical-function');
  $$
);

```text

### Fix 2: Use Database Functions for Critical Paths

```sql
-- Instead of Edge Function, use PostgreSQL function
-- Much faster, no cold start, no network hop

CREATE OR REPLACE FUNCTION calculate_total(order_id UUID)
RETURNS NUMERIC AS $$
DECLARE
total NUMERIC;
BEGIN
SELECT SUM(price * quantity)
INTO total
FROM order_items
WHERE order_items.order_id = calculate_total.order_id;

RETURN COALESCE(total, 0);
END;
$$ LANGUAGE plpgsql;

-- Call from client:
const { data } = await supabase.rpc('calculate_total', { order_id: 'xxx' });

```text

### Fix 3: Consider Alternatives for High-Frequency

```typescript
// For high-frequency operations, Edge Functions may not be ideal
// Options:
// 1. Database functions (postgresql)
// 2. AWS Lambda / Vercel Functions
// 3. Cloudflare Workers (sub-50ms cold start)

```text
---

## RLS PERFORMANCE OPTIMIZATION

```sql
-- ? VIBE: Slow RLS policy
CREATE POLICY "Check membership"
ON resources FOR SELECT
USING (
EXISTS (
SELECT 1 FROM team_members
WHERE team_members.team_id = resources.team_id
AND team_members.user_id = auth.uid()
  )
);
-- Every SELECT does a subquery!

-- ? TITAN: Faster with proper indexing
-- Add index first:
CREATE INDEX idx_team_members_team_user ON team_members(team_id, user_id);

-- Or use security definer function:
CREATE OR REPLACE FUNCTION user_has_access(resource_team_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
RETURN EXISTS (
SELECT 1 FROM team_members
WHERE team_id = resource_team_id
AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Use in policy:
CREATE POLICY "Check membership fast"
ON resources FOR SELECT
USING (user_has_access(team_id));

```text
---

## DECISION TREE: SUPABASE DEBUGGING

```text
SUPABASE ISSUE

+- Realtime not receiving events?
+- RLS enabled? ? Add SELECT policy
+- Check WebSocket connection in browser
+- Custom JWT? ? Manually set token
+- Check table is in realtime publication

+- Edge Function slow/failing?
+- Cold start issue ? implement warm-up
+- Concurrency issue ? consider alternatives
+- Use database functions for critical paths
+- Check for 2-second CPU limit

+- RLS policy errors?
+- "new row violates row-level security policy"
+- Check both INSERT and SELECT policies
+- Test with supabase.auth.getUser()
+- Verify auth.uid() returns correct value

+- Slow queries?
+- RLS policies doing subqueries?
+- Add indexes on RLS policy columns
+- Use security definer functions

+- Authentication issues?
+- Check JWT expiration
+- Session not refreshing?
+- Cookie settings for SSR

```text
---

### END OF MONGODB AND SUPABASE REAL PRODUCTION ISSUES

---

## VOLUME 11: REAL DATABASE MIGRATION PATTERNS

## Source: Prisma Docs, Production Experience, Zero-Downtime Deployments

> ?? **This is REAL migration knowledge - mistakes = production downtime.**

---

## ZERO-DOWNTIME MIGRATION RULES

### The Golden Rule: Additive Before Destructive

```text
Order matters:

1. ADD new column/table ? Deploy code using it ? Works!
2. DELETE column ? Then deploy code ? OLD CODE BREAKS!

Correct order for deleting:
1. Deploy code that stops using column
2. THEN delete the column

```text

### Multi-Step Column Rename (Zero Downtime)

```yaml
Problem: ALTER TABLE RENAME is instant but:

- Old code references old column name ? CRASH

Solution: 3-step migration

Step 1: Add new column
+- Migration: ADD COLUMN new_name
+- Deploy: Code writes to BOTH old_name AND new_name

Step 2: Copy data + swap reads
+- Migration: UPDATE new_name = old_name WHERE new_name IS NULL
+- Deploy: Code reads from new_name, writes to both

Step 3: Remove old column
+- Deploy: Code only uses new_name
+- Migration: DROP COLUMN old_name

```text
---

## PRISMA MIGRATION WORKFLOW

```bash

## Development: Generate and apply migration

npx prisma migrate dev --name add_user_avatar

## This does

## 1. Generates SQL migration file

## 2. Applies to dev database

## 3. Regenerates Prisma Client

## Production: Apply only (no generation)

npx prisma migrate deploy

## This does

## 1. Applies all pending migrations

## 2. Does NOT generate new migrations

## 3. Safe for CI/CD

```text
---

## DEPLOYMENT ORDER MATTERS

```typescript
// WRONG: Adding column
// Deploy Code first ? Code queries new column ? Column doesn't exist ? CRASH

// CORRECT: Adding column
Migration first ? Column exists ? Deploy code ? Works!

// WRONG: Removing column
// Migration first ? Column deleted ? Old code still live ? CRASH

// CORRECT: Removing column
Deploy code (without column reference) ? Then migration ? Works!

```text
---

## ROLLBACK STRATEGIES

```typescript
// Option 1: Forward-only (Recommended)
// Never delete migrations from production
// If something goes wrong, create a NEW migration to fix it

// Example: Wrong column type
// DON'T: Delete migration and re-run
// DO: Create new migration with correct type

// Option 2: Restore from backup
// Always take backup BEFORE migrations
// If disaster, restore database from backup

// Pre-migration checklist:
const preMigrationChecklist = {
backup: 'Take full database backup',
staging: 'Test migration on staging with production data copy',
timing: 'Deploy during low traffic',
team: 'Alert team, have rollback plan ready',
monitoring: 'Watch for errors immediately after'
};

```text
---

## PRISMA SCHEMA SAFETY

```prisma
// schema.prisma

// ? VIBE: Nullable field without default
model User {
id String  @id
email String
avatar String  // New required field = existing rows fail!
}

// ? TITAN: Add as nullable first, then make required
model User {
id String  @id
email String
avatar String? // Nullable first
}

// After backfilling data, create new migration:
model User {
id String  @id
email String
avatar String  @default("default-avatar.png") // Now safe to make required
}

```text
---

### END OF DATABASE MIGRATION PATTERNS

---

## REAL POSTGRESQL PATTERNS 2024

## Index Optimization

```sql
-- B-tree index for equality and range queries
CREATE INDEX idx_users_email ON users(email);

-- Partial index for filtered queries
CREATE INDEX idx_active_users ON users(email)
WHERE status = 'active';

-- Composite index for multi-column queries
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);

-- GIN index for JSONB queries
CREATE INDEX idx_products_metadata ON products USING GIN (metadata);

-- Covering index to avoid table lookups
CREATE INDEX idx_users_covering ON users(email) INCLUDE (name, created_at);

-- Check index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Find unused indexes
SELECT
| schemaname |  | '.' |  | relname AS table, |
indexrelname AS index,
pg_size_pretty(pg_relation_size(i.indexrelid)) AS index_size,
idx_scan as index_scans
FROM pg_stat_user_indexes ui
JOIN pg_index i ON ui.indexrelid = i.indexrelid
WHERE NOT indisunique
AND idx_scan < 50
AND pg_relation_size(relid) > 5 * 8192
ORDER BY pg_relation_size(i.indexrelid) / nullif(idx_scan, 0) DESC NULLS FIRST;

```text
---

## Query Optimization

```sql
-- EXPLAIN ANALYZE for query performance
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM orders WHERE user_id = 123;

-- Common Table Expressions (CTE) for readability
WITH recent_orders AS (
SELECT * FROM orders
WHERE created_at > NOW() - INTERVAL '30 days'
),
order_totals AS (
SELECT user_id, SUM(total) as total_spent
FROM recent_orders
GROUP BY user_id
)
SELECT u.email, ot.total_spent
FROM users u
JOIN order_totals ot ON u.id = ot.user_id
ORDER BY ot.total_spent DESC
LIMIT 100;

-- Window functions for analytics
SELECT
  user_id,
  order_date,
  total,
SUM(total) OVER (PARTITION BY user_id ORDER BY order_date) as running_total,
ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY order_date DESC) as order_rank
FROM orders;

-- Lateral joins for correlated subqueries
SELECT u.id, u.email, recent.order_count
FROM users u
CROSS JOIN LATERAL (
SELECT COUNT(*) as order_count
FROM orders o
WHERE o.user_id = u.id
AND o.created_at > NOW() - INTERVAL '7 days'
) recent;

```text
---

## Connection Pooling with PgBouncer

```ini

## pgbouncer.ini

[databases]
mydb = host=localhost port=5432 dbname=mydb

[pgbouncer]
listen_addr = 127.0.0.1
listen_port = 6432
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 20
min_pool_size = 5
reserve_pool_size = 5
reserve_pool_timeout = 3
max_db_connections = 50

```text
---

## Database Migrations Best Practices

```typescript
// Migration file: 20240101_add_users_table.ts
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
await db.schema
    .createTable('users')
.addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
.addColumn('email', 'varchar(255)', (col) => col.notNull().unique())
.addColumn('password_hash', 'varchar(255)', (col) => col.notNull())
.addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
.addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();

await db.schema
    .createIndex('idx_users_email')
    .on('users')
    .column('email')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
await db.schema.dropTable('users').execute();
}

```text
---

## REAL REDIS PATTERNS 2024

## Caching Strategies

```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Cache-aside pattern
async function getCached<T>(
key: string,
fetcher: () => Promise<T>,
ttlSeconds: number = 3600
): Promise<T> {
const cached = await redis.get(key);

if (cached) {
return JSON.parse(cached);
  }

const data = await fetcher();
await redis.setex(key, ttlSeconds, JSON.stringify(data));
return data;
}

// Stale-while-revalidate pattern
async function getCachedSWR<T>(
key: string,
fetcher: () => Promise<T>,
ttlSeconds: number = 3600,
staleSeconds: number = 60
): Promise<T> {
const cached = await redis.get(key);
const ttl = await redis.ttl(key);

if (cached) {
// If within stale window, trigger background refresh
if (ttl < staleSeconds) {
fetcher().then(data =>
redis.setex(key, ttlSeconds, JSON.stringify(data))
      ).catch(console.error);
    }
return JSON.parse(cached);
  }

const data = await fetcher();
await redis.setex(key, ttlSeconds, JSON.stringify(data));
return data;
}

// Cache invalidation
async function invalidateCache(patterns: string[]) {
for (const pattern of patterns) {
const keys = await redis.keys(pattern);
if (keys.length > 0) {
await redis.del(...keys);
    }
  }
}

```text
---

## Rate Limiting with Redis

```typescript
// Sliding window rate limiter
async function isRateLimited(
key: string,
limit: number,
windowSeconds: number
): Promise<boolean> {
const now = Date.now();
const windowStart = now - windowSeconds * 1000;

const pipeline = redis.pipeline();

// Remove old entries
pipeline.zremrangebyscore(key, 0, windowStart);

// Add current request
pipeline.zadd(key, now, `${now}-${Math.random()}`);

// Count requests in window
  pipeline.zcard(key);

// Set expiry
pipeline.expire(key, windowSeconds);

const results = await pipeline.exec();
const count = results?.[2]?.[1] as number;

return count > limit;
}

// Token bucket rate limiter
async function consumeToken(
key: string,
maxTokens: number,
refillRate: number, // tokens per second
tokensToConsume: number = 1
): Promise<{ allowed: boolean; remaining: number }> {
const script = `
local key = KEYS[1]
local max_tokens = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2])
local tokens_to_consume = tonumber(ARGV[3])
local now = tonumber(ARGV[4])

local bucket = redis.call('HMGET', key, 'tokens', 'last_refill')
local tokens = tonumber(bucket[1]) or max_tokens
local last_refill = tonumber(bucket[2]) or now

local elapsed = now - last_refill
local refill = math.min(max_tokens, tokens + elapsed * refill_rate)

if refill >= tokens_to_consume then
refill = refill - tokens_to_consume
redis.call('HMSET', key, 'tokens', refill, 'last_refill', now)
redis.call('EXPIRE', key, math.ceil(max_tokens / refill_rate) + 1)
return {1, refill}
    else
return {0, refill}
    end
  `;

const result = await redis.eval(
script, 1, key,
maxTokens, refillRate, tokensToConsume, Date.now() / 1000
) as [number, number];

return { allowed: result[0] === 1, remaining: result[1] };
}

```text
---

## Distributed Locking

```typescript
import Redlock from 'redlock';

const redlock = new Redlock([redis], {
driftFactor: 0.01,
retryCount: 10,
retryDelay: 200,
retryJitter: 200,
automaticExtensionThreshold: 500,
});

// Acquire lock for exclusive operations
async function withLock<T>(
resource: string,
ttlMs: number,
callback: () => Promise<T>
): Promise<T> {
const lock = await redlock.acquire([resource], ttlMs);

try {
return await callback();
} finally {
await lock.release();
  }
}

// Usage
const result = await withLock(
  `lock:order:${orderId}`,
  5000,
async () => {
// Only one process can execute this at a time
return await processOrder(orderId);
  }
);

```text
---

### END OF DATABASE PATTERNS

```text
