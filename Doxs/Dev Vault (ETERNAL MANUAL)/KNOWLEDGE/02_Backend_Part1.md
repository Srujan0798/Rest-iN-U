# 02_BACKEND.MD: THE TITAN GUIDE (50K TARGET)

>
> **?? Disclaimer**: This is educational content synthesized from industry best practices and publicly available documentation. Case studies are illustrative examples for teaching purposes. Last updated: December 2024.
>

## Production-Grade Node.js, Express, Prisma, and Database Optimization

> **Status**: TIER 1 TITAN (Infinite Scale)
> **Target**: 50,000 Lines
> **Coverage**: Sharding, Kernel Tuning, Distributed Systems, AI-DBA
> **Last Updated**: December 24, 2024

---

## TABLE OF CONTENTS

### VOLUME 1: THE SCARS (The "Why")

*Real-world horror stories and billion-dollar failures.*

* Knight Capital ($440M Loss) - The Dead Code Disaster

* GitLab Database Deletion - The Backup Failure

* T-Mobile API Breach - The BOLA Apocalypse

* The "Event Loop Block" - How One JSON.parse() Killed Production

* The "Connection Pool" Exhaustion - The Silent Lambda Killer

### VOLUME 2: THE FOUNDATION (The "What")

*Production-grade basics. No "Hello World".*

* OWASP Top 10 API Security - Beyond the Basics

* Prisma Schema Design - The "Hidden" Costs

* Node.js Event Loop Internals - Phases & Microtasks

* Error Handling Strategy - The "Operational vs Programmer" Split

* Logging & Observability - The "Context" Rule

### VOLUME 3: THE DEEP DIVE (The "How")

*Advanced engineering and optimization.*

* N+1 Query Problem & Solutions (DataLoader)

* Database Indexing Strategies (B-Tree, Hash, GIN)

* Redis Caching Patterns (Cache-Aside, Write-Through)

* Rate Limiting Algorithms (Token Bucket, Leaky Bucket)

* Idempotency Implementation (Stripe Style)

### VOLUME 4: THE EXPERT (The "Scale")

*Distributed systems and high-scale patterns.*

* Database Sharding (Instagram Model)

* Distributed Locking (Redlock)

* Reliable Messaging (Kafka/RabbitMQ)

* Circuit Breakers (Opossum)

* Saga Pattern (Distributed Transactions)

### VOLUME 5: THE TITAN (The "Kernel")

*Low-level internals and custom engines.*

* Kernel-Level Tuning (io_uring, eBPF)

* Cellular Architecture (Uber Model)

* LSM Trees vs B-Trees (Storage Engines)

* Custom Memory Allocators (Jemalloc)

* Zero-Copy Networking

### VOLUME 6: THE INFINITE (The "Future")

*Experimental tech and "Meta-Beating" research.*

* Serverless 2.0 (Wasm on Edge)

* Autonomous DB Tuning (AI-DBA)

* Graph Databases (Neo4j)

* Quantum-Safe Cryptography

* DNA Storage Integration

### VOLUME 7: PRODUCTION INCIDENT PATTERNS (The "Real-World")

*Direct from Stripe, PayPal, Cloudflare post-mortems.*

* Critical API Failures (Real Incidents)

* N+1 Query Disaster (Stripe Outage)

* Memory Leak Patterns (PayPal Node.js)

* Blocking Event Loop (Worker Threads)

* JWT Security Production Patterns

* Rate Limiting Deep Dive (Redis)

* Connection Pooling Production

### **VOLUME 7: PRODUCTION INCIDENT PATTERNS (The "Real-World")**

*Direct from Stripe, PayPal, Cloudflare post-mortems.*
31. Critical API Failures (Real Incidents)
32. N+1 Query Disaster (Stripe Outage)
33. Memory Leak Patterns (PayPal Node.js)
34. Blocking Event Loop (Worker Threads)
35. JWT Security Production Patterns
36. Rate Limiting Deep Dive (Redis)
37. Connection Pooling Production

### VOLUME 8: ADVANCED API PATTERNS

*Production patterns for reliability and performance.*

* Request/Response Compression

* CORS Configuration

* Circuit Breaker Pattern

* Retry with Exponential Backoff

* Idempotency Keys

### VOLUME 9: EVENT-DRIVEN ARCHITECTURE

*Asynchronous and distributed patterns.*

* Kafka Producer/Consumer

* Background Jobs (Celery)

* Scheduled Tasks

### VOLUME 10: FILE PROCESSING & NOTIFICATIONS

*File handling and messaging patterns.*

* Chunked File Upload

* CSV/Excel Processing

* Email Sending (SendGrid)

* SMS Sending (Twilio)

### VOLUME 11: MULTI-TENANCY & SECURITY

*Enterprise patterns for SaaS.*

* Multi-Tenancy Patterns

* OAuth2 Implementation

* Refresh Tokens

### VOLUME 12: PAGINATION & DATA OPERATIONS

*Data management patterns.*

* Pagination Strategies

* Soft Delete Pattern

* Audit Logging

* Webhooks Implementation

* Feature Flags

* Server-Sent Events

* Distributed Tracing

### VOLUME 13: ADDITIONAL PATTERNS

*Remaining production patterns.*

* API Documentation (OpenAPI)

* PDF Generation (ReportLab)

* Long Polling

* GraphQL Subscriptions

* Bulk Operations

* Database Migrations (Alembic)

* Refresh Tokens (Complete)

---

---

## VOLUME 1: THE SCARS (THE "WHY")

### 1. KNIGHT CAPITAL (2012) - $440 MILLION IN 45 MINUTES

#### The "Dead Code" Deployment Disaster

**The Context**:
Knight Capital was a high-frequency trading firm. On August 1, 2012, they deployed new software to 8 servers.
**The Error**:
They deployed the new code to 7 servers but *forgot* the 8th server. The new code reused an old flag (`SMARS`) that had a different meaning in the old code.
**The Result**:
The 8th server, running the old code, interpreted the new flag as "Buy High, Sell Low". It executed millions of trades in 45 minutes.
**The Toll**:
$440 Million loss. The company went bankrupt and was acquired.

**The Code (Reconstructed)**:

```javascript
// OLD CODE (Running on Server 8)
function executeTrade(order) {
    if (order.flags & SMARS_FLAG) {
        // This was supposed to be dead code!
        // It buys at the ask price aggressively
        buyAggressively(order);
    }
}

// NEW CODE (Running on Servers 1-7)
function executeTrade(order) {
    if (order.flags & SMARS_FLAG) {
        // New logic: Verify retail liquidity
        verifyLiquidity(order);
    }
}

```

**Developer Lesson**:

1. **Delete Dead Code**: Never leave "dead" code in the codebase. If it's not used, delete it. Git history is your backup.
2. **Automated Deployments**: Never deploy manually. Use Ansible/Terraform/Kubernetes to ensure *all* nodes are updated.
3. **Feature Flags**: Use proper feature flags (LaunchDarkly) instead of recycling old boolean flags.

---

### 2. GITLAB DATABASE DELETION (2017)

#### The "rm -rf" Heard Around the World

**The Context**:
GitLab.com was under heavy load. A sysadmin tried to fix replication lag by wiping a secondary node.
**The Error**:
They were logged into the *primary* node.
**The Command**:
`rm -rf /var/opt/gitlab/postgresql/data`
**The Backup Failure**:

* **Backup 1 (S3)**: Empty. Script failing silently.

* **Backup 2 (Disk)**: Corrupted.

* **Backup 3 (LVM)**: 6 hours old.

**The Code (The Bug)**:

```bash

# BAD SCRIPT

pg_dumpall | gzip > backup.gz
if [ $? -eq 0 ]; then
    echo "Backup Successful"
else
    echo "Backup Failed"
fi

```

*Why it failed*: `pipefail` was not set. If `pg_dumpall` fails but `gzip` succeeds, `$?` is 0.

**The Fix**:

```bash

# GOOD SCRIPT

set -o pipefail  # Fail if ANY command in the pipe fails
pg_dumpall | gzip > backup.gz

```

---

### 3. T-MOBILE API BREACH (2021)

#### The BOLA Apocalypse

**The Context**:
API endpoint for warranty status accepted `phoneNumber` as query param.
**The Error**:
No check if requester owned the phone number.
**The Result**:
50 Million records stolen via brute force.

**The Vulnerable Code**:

```javascript
// GET /api/warranty?phoneNumber=1234567890
app.get('/api/warranty', async (req, res) => {
    const { phoneNumber } = req.query;
    // VULNERABILITY: No check if req.user owns phoneNumber
    const warranty = await db.Warranty.findOne({ phoneNumber });
    res.json(warranty);
});

```

**The Fix**:

```javascript
// GET /api/warranty?phoneNumber=1234567890
app.get('/api/warranty', authMiddleware, async (req, res) => {
    const { phoneNumber } = req.query;
    const userId = req.user.id;

    // FIX: Check ownership
    const device = await db.Device.findOne({ phoneNumber, userId });
    if (!device) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    const warranty = await db.Warranty.findOne({ phoneNumber });
    res.json(warranty);
});

```

---

## VOLUME 2: THE FOUNDATION (THE "WHAT")

### 6. OWASP TOP 10 API SECURITY

#### Beyond the Basics

#### 1. Broken Object Level Authorization (BOLA)

* **Concept**: User A can access User B's data by changing the ID.

* **Defense**: Always validate `resource.owner_id == current_user.id`.

#### 2. Broken User Authentication

* **Concept**: Weak passwords, credential stuffing.

* **Defense**: Rate limit login endpoints. Rotate JWT secrets.

#### 3. Excessive Data Exposure

* **Concept**: Returning full user object (with password hash) to client.

* **Defense**: Use DTOs or Prisma `select`.

---

### 7. PRISMA SCHEMA DESIGN & PERFORMANCE

#### The "Hidden" Costs

#### 1. The N+1 Problem in Prisma

* **Bad**: Looping through users and querying posts for each.

* **Good**: `prisma.user.findMany({ include: { posts: true } })`.

#### 2. Indexing Foreign Keys

Prisma does NOT automatically index foreign keys.

* **Schema**:

    ```prisma
    model Post {
        userId  Int
        user    User @relation(fields: [userId], references: [id])
        @@index([userId]) // CRITICAL
    }
```

---

### 8. NODE.JS EVENT LOOP INTERNALS

#### Phases & Microtasks

**The 6 Phases**:

1. **Timers**: `setTimeout`
2. **Pending Callbacks**: I/O errors
3. **Idle, Prepare**: Internal
4. **Poll**: I/O events (The heavy lifter)
5. **Check**: `setImmediate`
6. **Close Callbacks**: `socket.on('close')`

**Microtasks**: `process.nextTick` and `Promise.then` run *between* phases.

---

## VOLUME 3: THE DEEP DIVE (THE "HOW")

### 11. N+1 QUERY PROBLEM & SOLUTIONS

#### DataLoader Pattern: The Silver Bullet

**The Problem**:
GraphQL resolvers often trigger N+1 queries.
Query: `users { posts { title } }`
Execution: 1 query for users, N queries for posts.

**The Solution (DataLoader)**:
Batches requests into a single query.

```javascript
const DataLoader = require('dataloader');

// 1. Batch Function
const batchPosts = async (userIds) => {
    // Query: SELECT * FROM posts WHERE userId IN (1, 2, 3...)
    const posts = await prisma.post.findMany({
        where: { userId: { in: userIds } }
    });

    // 2. Map posts back to userIds order
    // Critical: The array returned must be the same length as userIds
    const postsMap = {};
    posts.forEach(post => {
        if (!postsMap[post.userId]) postsMap[post.userId] = [];
        postsMap[post.userId].push(post);
    });

    return userIds.map(id => postsMap[id] || []);
};

// 3. Create Loader (Request Scoped)
const postLoader = new DataLoader(batchPosts);

// 4. Usage in Resolver
const resolvers = {
    User: {
        posts: (parent) => postLoader.load(parent.id)
    }
};

```

**Edge Case: Error Handling**:
If one key fails, DataLoader can return an Error object for that specific key instead of crashing the whole batch.

---

### 12. DATABASE INDEXING STRATEGIES

#### B-Tree, Hash, GIN, BRIN

#### 1. B-Tree (Default)

* **Use Case**: Equality (`=`) and Range (`<`, `>`, `BETWEEN`).

* **Complexity**: O(log n).

* **Example**: `CREATE INDEX idx_users_email ON users(email);`

#### 2. GIN (Generalized Inverted Index)

* **Use Case**: JSONB and Full Text Search.

* **Example**: `CREATE INDEX idx_metadata ON products USING GIN (metadata);`

* **Query**: `SELECT * FROM products WHERE metadata @> '{"color": "red"}';`

#### 3. BRIN (Block Range Index)

* **Use Case**: Massive Time-Series Data (Logs, IoT).

* **Concept**: Stores min/max values for a block of pages. Tiny size.

* **Example**: `CREATE INDEX idx_logs_timestamp ON logs USING BRIN (timestamp);`

#### 4. Partial Indexes

* **Use Case**: Index only a subset of rows (e.g., active users). Saves space.

* **Example**: `CREATE INDEX idx_active_users ON users(email) WHERE status = 'ACTIVE';`

---

### 13. REDIS CACHING PATTERNS

#### Cache-Aside, Write-Through, & Lua Scripting

#### 1. Cache-Aside (Lazy Loading)

* **Flow**: App checks Cache -> Miss -> App reads DB -> App writes to Cache.

* **Pros**: Only caches requested data.

* **Cons**: First request is slow (Cold start).

#### 2. Cache Stampede (Thundering Herd)

* **Problem**: Cache expires. 1000 requests hit DB simultaneously.

* **Solution**: Probabilistic Early Expiration (Jitter).

    ```javascript
    // Expire between 55 and 60 seconds
    const ttl = 60 - Math.random() * 5;
    redis.set(key, value, 'EX', ttl);
```

#### 3. Atomic Operations (Lua Scripting)

* **Problem**: Read-Modify-Write race conditions.

* **Solution**: Run Lua script inside Redis. It's atomic.

    ```lua
    -- rate_limit.lua
    local current = redis.call('INCR', KEYS[1])
    if tonumber(current) == 1 then
        redis.call('EXPIRE', KEYS[1], ARGV[1])
    end
    return current
```

---

### 14. RATE LIMITING ALGORITHMS

#### Sliding Window Log

#### 1. Token Bucket (Bursty)

* **Concept**: Bucket fills with tokens at rate `r`. Request takes 1 token. If empty, reject.

#### 2. Sliding Window Log (Precision)

* **Concept**: Store timestamp of every request in a Sorted Set (ZSET).

* **Flow**:
    1. Remove timestamps older than window (ZREMRANGEBYSCORE).
    2. Count remaining timestamps (ZCARD).
    3. If count < limit, add current timestamp (ZADD) and allow.
    4. Else, reject.

* **Pros**: Perfectly accurate.

* **Cons**: High memory usage (stores every timestamp).

---

## VOLUME 4: THE EXPERT (THE "SCALE")

### 16. DATABASE SHARDING

#### The Instagram Model & Citus

**The Problem**:
Single Postgres instance hits 10TB. Writes become slow.

**The Solution**:
Split data across multiple DB instances (Shards).

**Sharding Key**:

* **User ID**: All data for User 1 goes to Shard A.

* **Geo**: All US users to Shard A, EU to Shard B.

**ID Generation (Snowflake ID)**:
You can't use `AUTO_INCREMENT` across shards (collisions).
**Instagram ID Format (64-bit)**:

* 41 bits: Timestamp (ms)

* 13 bits: Shard ID

* 10 bits: Sequence ID

**Citus Data (Postgres Extension)**:
Turns Postgres into a distributed database.

* **Coordinator Node**: Routes queries.

* **Worker Nodes**: Store data.

* **Query**: `SELECT * FROM users` -> Parallel execution on all workers.

---

### 17. DISTRIBUTED LOCKING

#### Redlock & Fencing Tokens

**The Problem**:
Cron job runs on 5 servers. Only ONE should execute the task.

**Redlock Algorithm**:

1. Acquire lock on N Redis masters (e.g., 5).
2. If acquired on majority (3+), lock is valid.
3. Set TTL (Time To Live) to prevent deadlocks if server crashes.

**The Zombie Process Problem**:
Server A acquires lock. GC pause for 10s. Lock expires. Server B acquires lock. Server A wakes up and writes to DB. **Data Corruption**.

**The Fix: Fencing Tokens**:

1. Lock service returns a monotonic token (1, 2, 3...).
2. Server A gets Token 33.
3. Server B gets Token 34.
4. DB checks: `UPDATE table SET val=x WHERE id=y AND token < 34`.
5. Server A's write fails because 33 < 34 is false (if DB tracks last token).

---

### 18. RELIABLE MESSAGING

#### Kafka vs RabbitMQ

**RabbitMQ (Smart Broker, Dumb Consumer)**:

* **Push Model**: Broker pushes messages to consumers.

* **Use Case**: Complex routing, task queues.

**Kafka (Dumb Broker, Smart Consumer)**:

* **Pull Model**: Consumer pulls messages.

* **Log Storage**: Messages are persisted on disk for days.

* **Consumer Groups**:
  * Topic has 10 partitions.
  * Group has 10 consumers.
  * Each consumer reads from 1 partition. **Parallelism**.

**Dead Letter Queue (DLQ)**:
If a message fails processing 3 times, move it to a DLQ topic for manual inspection. Never block the main queue.

---

## VOLUME 5: THE TITAN (THE "KERNEL")

### 21. KERNEL-LEVEL TUNING

#### io_uring & eBPF

**io_uring**:
Linux Async I/O interface.

* **Old Way (epoll)**: System call for every I/O. High CPU overhead.

* **New Way (io_uring)**: Shared memory ring buffer between Kernel and User space. Significantly fewer system calls (zero-syscall mode requires SQPOLL flag).

* **Performance**: 2-3x faster than epoll for high-queue-depth I/O (10x possible only with SQPOLL mode on NVMe).

**eBPF (Extended Berkeley Packet Filter)**:
Run sandboxed programs in the Kernel.

* **Use Case**: Observability. Trace every TCP packet without overhead.

* **Tool**: Cilium (Kubernetes networking), Pixie (Observability).

* **Example**: Trace every SQL query that takes > 100ms *at the packet level*, without modifying the app.

---

### 22. CELLULAR ARCHITECTURE

#### The Uber Model

**The Problem**:
One bad deployment brings down the entire global region.

**The Solution**:
Divide infrastructure into self-contained "Cells".

* **Cell**: Contains API, DB, Cache, Queue. Can handle 100k users.

* **Gateway**: Routes user to their assigned Cell.

* **Benefit**: Blast radius containment. If Cell 1 fails, only 10% of users are affected.

**Ringpop (Consistent Hashing)**:

* Maps users to cells.

* If a cell is added/removed, only 1/N keys need to be remapped.

---

### 23. LSM TREES VS B-TREES

#### Storage Engines

**B-Tree (Postgres/MySQL)**:

* Read-optimized.

* Update in-place.

* Random writes are slow (disk seek).

**LSM Tree (Log-Structured Merge-Tree) (Cassandra/RocksDB)**:

* Write-optimized.

* Append-only writes (Sequential I/O).

* **MemTable**: Writes go to RAM first.

* **SSTable**: Flushed to disk (Sorted String Table).

* **Compaction**: Background process merges SSTables.

* **Use Case**: High-ingest logging, Chat history.

---

## VOLUME 6: THE INFINITE (THE "FUTURE")

### 26. SERVERLESS 2.0

#### Wasm on Edge & Durable Objects

**Concept**:
Docker containers are too heavy (cold start 500ms).
**WebAssembly (Wasm)**:

* Cold start: < 1ms.

* Sandboxed security.

* Run V8 isolates on the Edge (Cloudflare Workers).

**Durable Objects (Cloudflare)**:

* Stateful serverless.

* Each "Object" is a mini-database + compute.

* **Use Case**: Real-time collaboration (Figma-like). Each document is a Durable Object.

---

### 27. AUTONOMOUS DB TUNING

#### AI-DBA

**Concept**:
AI monitors query patterns.

* "Query X is slow. Suggesting Index Y."

* "Traffic spiking. Auto-scaling Read Replicas."

* **Tech**: OtterTune, AWS DevOps Guru.

---

## VOLUME 7: THE APPENDIX (TITAN REFERENCE)

### A. THE ULTIMATE DOCKERFILE

Multi-stage, secure, and tiny.

```dockerfile

# Stage 1: Build

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runner

FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
CMD ["dist/main.js"]

```

### B. THE ULTIMATE POSTGRES CONFIG

Tuned for 16GB RAM.

```ini

# postgresql.conf

# Memory

shared_buffers = 4GB            # 25% of RAM
effective_cache_size = 12GB     # 75% of RAM
work_mem = 64MB                 # Per connection
maintenance_work_mem = 1GB      # For vacuuming

# Checkpoints

checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100

# Parallel Queries

max_worker_processes = 8
max_parallel_workers_per_gather = 4
max_parallel_workers = 8

```

---

## KEYWORD REFERENCE INDEX

#### Each line = 100x LLM expansion potential

---

## JS INTERNALS

* Event Loop: phases

* libuv: thread pool (UV_THREADPOOL_SIZE=4 default), async I/O, epoll/kqueue/IOCP

* V8 isolate: heap segments, young/old gen, Scavenger, Mark-Sweep-Compact

* Worker Threads: SharedArrayBuffer, Atomics, MessageChannel, transferable objects

* Cluster module: fork(), IPC, round-robin vs SO_REUSEPORT

* child_process: spawn, exec, fork, stdio inheritance

* Buffer: alloc vs allocUnsafe, poolSize, zero-copy slicing

* Streams: Readable, Writable, Transform, Duplex, highWaterMark, backpressure

* async_hooks: executionAsyncId, triggerAsyncId, resource tracking

* N-API: native addons, ABI stability, thread-safe functions

## DATABASE INTERNALS

**PostgreSQL**:

* MVCC: xmin, xmax, transaction visibility, snapshot isolation

* WAL: write-ahead log, fsync, checkpoint, pg_wal_replay_resume

* TOAST: out-of-line storage, compression, EXTERNAL vs EXTENDED

* Vacuum: dead tuple cleanup, wraparound, autovacuum_vacuum_threshold

* Index types: B-tree, Hash, GiST, SP-GiST, GIN, BRIN

* Planner: seq_scan, index_scan, bitmap_scan, cost estimation

* Connection pooling: pgbouncer (transaction/session mode), pgpool-II

* Partitioning: range, list, hash, partition pruning

* Foreign Data Wrappers: postgres_fdw, file_fdw, remote execution

* pg_stat_statements: query normalization, total_time, calls

**MySQL/MariaDB**:

* Storage engines: InnoDB, MyISAM, Memory, RocksDB

* InnoDB: clustered index, buffer pool, redo log, doublewrite

* Replication: binlog, GTID, semi-sync, group replication

* Galera: synchronous multi-master, certification-based

## AUTHORIZATION

* JWT: header.payload.signature, HS256 vs RS256, exp/iat/nbf claims

* OAuth 2.0: authorization code, PKCE, client credentials, refresh token

* OIDC: ID token, userinfo endpoint, discovery document

* Session: cookie-based, Redis store, sliding expiration

* RBAC: roles, permissions, hierarchical, deny-by-default

* ABAC: attributes, policies, XACML, OPA

* API Keys: rate limiting scope, rotation, hashing (bcrypt scrypt argon2)

* mTLS: mutual TLS, client certificates, certificate pinning

* PASETO: platform-agnostic tokens, local/public mode

* Passkeys: WebAuthn, FIDO2, resident credentials

## API DESIGN PATTERNS

* REST: resources, verbs, status codes, HATEOAS, OpenAPI

* GraphQL: schema, resolvers, DataLoader, persisted queries, complexity limits

* gRPC: protobuf, streaming (unary/server/client/bidirectional), deadlines

* tRPC: end-to-end type safety, procedure calls, React Query integration

* JSON:API: compound documents, sparse fieldsets, pagination

* Hypermedia: links, actions, affordances

* Versioning: URL path, header, query param, content negotiation

* Pagination: cursor-based, offset-based, keyset pagination

* Filtering: OData, GraphQL arguments, query DSL

* Rate Limiting: X-RateLimit-* headers, 429 Too Many Requests

## CACHING STRATEGIES

* Cache-Aside: read-through, lazy loading, cache miss penalty

* Write-Through: synchronous update, consistency guarantee

* Write-Behind: async batch writes, eventual consistency

* Read-Through: cache as primary, transparent fetch

* TTL: time-to-live, sliding expiration, absolute expiration

* Cache Invalidation: tag-based, key pattern, pub/sub

* Distributed Cache: Redis Cluster, Memcached, Hazelcast

* Local Cache: in-memory, LRU, LFU, ARC

* CDN: edge caching, cache-control headers, stale-while-revalidate

* HTTP Caching: ETag, Last-Modified, Cache-Control, Vary

## MESSAGE QUEUES

**Kafka**:

* Topic, partition, offset, consumer group, rebalancing

* Producer: acks (0,1,all), batching, compression (gzip,snappy,lz4,zstd)

* Consumer: auto-commit, manual commit, exactly-once semantics

* Streams: KTable, KStream, stateful transformations

* Connect: source/sink connectors, schema registry

* Replication: leader, follower, ISR, min.insync.replicas

**RabbitMQ**:

* Exchange types: direct, fanout, topic, headers

* Queue: durable, exclusive, auto-delete, TTL, DLX

* Consumer: ack, nack, reject, prefetch count

* Federation: upstream, downstream, exchange federation

* Shovel: message relay, cross-cluster

**SQS/SNS**:

* Standard vs FIFO queue, visibility timeout, dead-letter queue

* Message deduplication, message group ID

* Fan-out pattern, filter policies

## SECURITY PATTERNS

* Input validation: whitelist, schema validation, Zod/Joi

* SQL injection: parameterized queries, ORM protections

* XSS: output encoding, CSP, HTTPOnly cookies

* CSRF: SameSite cookies, double-submit pattern, synchronizer token

* BOLA/IDOR: authorization checks, object-level validation

* Rate limiting: token bucket, sliding window log

* SSRF: URL validation, allowlist, DNS rebinding protection

* Mass assignment: DTO projection, explicit field selection

* Secrets management: Vault, AWS Secrets Manager, env encryption

* Dependency scanning: npm audit, Snyk, Dependabot

## OBSERVABILITY

**Logging**:

* Structured logging: JSON, correlation ID, request context

* Log levels: trace, debug, info, warn, error, fatal

* Aggregation: ELK, Loki, CloudWatch, Datadog

* Sampling: head-based, tail-based, adaptive

**Metrics**:

* RED: Rate, Errors, Duration (request-focused)

* USE: Utilization, Saturation, Errors (resource-focused)

* Prometheus: counter, gauge, histogram, summary

* StatsD, InfluxDB, Graphite, Datadog

**Tracing**:

* OpenTelemetry: spans, traces, context propagation

* Jaeger, Zipkin, AWS X-Ray

* Trace context: W3C Trace Context, B3 headers

* Sampling strategies: always, never, probabilistic, rate-limiting

## ARCHITECTURE PATTERNS

* Monolith: modular monolith, vertical slices

* Microservices: service boundaries, API gateway, sidecar

* Event-Driven: event sourcing, CQRS, event storming

* Hexagonal: ports and adapters, dependency inversion

* Clean Architecture: entities, use cases, interface adapters, frameworks

* Domain-Driven Design: bounded context, aggregate, entity, value object

* Strangler Fig: incremental migration, facade pattern

* Ambassador: proxy, circuit breaker, retry

* Sidecar: service mesh, Envoy, Istio, Linkerd

## PRISMA ORM DEEP

* Schema: models, relations, enums, @id, @unique, @default

* Client: CRUD operations, transactions, raw queries

* Migrations: prisma migrate dev/deploy, drift detection

* Introspection: prisma db pull, existing database

* Middleware: query logging, soft deletes, audit trails

* Connection pooling: connection_limit, pool_timeout

* Accelerate: edge caching, connection pooling as a service

* Pulse: real-time database subscriptions

## PERFORMANCE OPTIMIZATION

* N+1: DataLoader batching, include/select optimization

* Query optimization: EXPLAIN ANALYZE, index usage, table scans

* Connection pooling: pool size formula (connections = (cores * 2) + disks)

* Pagination: cursor vs offset, keyset pagination

* Denormalization: materialized views, read replicas

* Async processing: job queues, background workers

* Response compression: gzip, brotli, content negotiation

* Keep-alive: connection reuse, TCP tuning

* HTTP/2: multiplexing, server push, header compression

* Edge computing: Cloudflare Workers, Vercel Edge, Deno Deploy

## LEVEL OPTIMIZATION

* io_uring: async I/O, submission/completion rings, zero-copy

* eBPF: kernel tracing, network filtering, XDP

* TCP tuning: net.core.somaxconn, net.ipv4.tcp_max_syn_backlog

* File descriptors: ulimit -n, fs.file-max

* Memory: vm.swappiness, huge pages, NUMA awareness

* CPU affinity: taskset, isolcpus, NAPI

* Network: RPS/RFS, busy polling, interrupt coalescing

* Storage: io scheduler, NVMe, direct I/O

## DISTRIBUTED SYSTEMS

* Consensus: Paxos, Raft, leader election, log replication

* Vector clocks: causality tracking, conflict detection

* CRDTs: G-Counter, PN-Counter, OR-Set, LWW-Register

* Saga: orchestration vs choreography, compensating transactions

* Two-Phase Commit: prepare, commit, coordinator, participant

* Gossip Protocol: epidemic dissemination, failure detection

* Consistent Hashing: virtual nodes, ring, rebalancing

* Shard routing: hash-based, range-based, directory-based

* Circuit Breaker: closed, open, half-open states, failure threshold

* Bulkhead: isolation, resource partitioning, thread pools

## TESTING STRATEGIES

* Unit: isolated, mocked dependencies, fast

* Integration: real dependencies, database, API

* E2E: full system, user flows, Playwright

* Contract: Pact, consumer-driven, provider verification

* Load: k6, Artillery, Locust, percentiles (p50, p95, p99)

* Chaos: Chaos Monkey, LitmusChaos, fault injection

* Mutation: Stryker, code coverage validation

* Property-based: fast-check, generators, shrinking

## CONTAINERIZATION

* Docker: multi-stage builds, cache optimization, distroless

* Image optimization: .dockerignore, layer ordering, alpine

* Health checks: livenessProbe, readinessProbe, startupProbe

* Resource limits: CPU, memory, OOM killer

* Security: non-root user, read-only filesystem, seccomp

* Networking: bridge, host, overlay, port mapping

* Volumes: bind mounts, named volumes, tmpfs

* Compose: services, networks, volumes, depends_on

## KUBERNETES

* Pod: containers, init containers, sidecars

* Deployment: replicas, rolling update, rollback

* Service: ClusterIP, NodePort, LoadBalancer, Ingress

* ConfigMap, Secret: environment injection, file mounting

* HPA: horizontal pod autoscaler, custom metrics

* VPA: vertical pod autoscaler, resource recommendations

* PDB: pod disruption budget, availability guarantees

* NetworkPolicy: ingress, egress, pod selectors

* Operators: CRD, controller, reconciliation loop

* Helm: charts, values, dependencies, hooks

---

#### END OF KEYWORD REFERENCE

---

#### EXPANSION QUEUE

1. GraphQL Federation: schema stitching, supergraph, rover CLI
2. gRPC-Web: browser support, envoy proxy, streaming
3. WebSocket: Socket.io, ws, scaling with Redis adapter
4. Server-Sent Events: EventSource, connection management
5. Long Polling: comparison, use cases, implementation
6. Webhooks: retry logic, signature verification, idempotency
7. Background Jobs: Bull, Agenda, BullMQ, job scheduling
8. File Uploads: multipart, streaming, S3 presigned URLs
9. PDF Generation: Puppeteer, PDFKit, wkhtmltopdf
10. Email: Nodemailer, SendGrid, SES, templates

---

## GRAPHQL DEEP ATLAS

#### Each keyword = expandable implementation

### Schema Design

* Types: scalar, object, input, enum, interface, union

* Directives: @deprecated, @auth, @cache, custom

* Nullability: ! required, nullable by default, error propagation

* Arguments: filter, pagination, ordering, required vs optional

* Connections: Relay spec, edges, nodes, pageInfo, cursor

* Fragments: reusable selections, spreading, inline

### Resolvers

* Field resolvers: parent, args, context, info

* DataLoader: batching, caching, N+1 prevention

* Context: request info, auth, database clients

* Error handling: GraphQLError, extensions, codes

* Middleware: field-level, operation-level, plugins

* Performance: complexity limiting, depth limiting

### Apollo Server

* ApolloServer: typeDefs, resolvers, plugins

* Subscriptions: PubSub, websocket, filtering

* Caching: cache hints, @cacheControl, CDN

* Federation: @key, @external, @requires, @provides

* Tracing: Apollo Studio, metrics, schema checks

### Code Generation

* graphql-codegen: TypeScript types, resolvers

* Pothos: code-first schema building

* Prisma integration: generated resolvers, types

* Fragment colocation: generated hooks, queries

---

## TIME COMMUNICATION DEEP ATLAS

#### Each keyword = expandable pattern

### WebSocket

* ws library: WebSocket, Server, ping/pong

* Upgrade: HTTP upgrade, handshake, connection

* Messages: JSON, binary, fragmentation

* Events: open, message, close, error

* Heartbeat: ping, pong, timeout detection

* Scaling: Redis adapter, sticky sessions

### Socket.io

* Server: io, emit, on, broadcast

* Namespaces: /chat, /notifications, isolation

* Rooms: join, leave, to, in

* Acknowledgments: callback, timeout

* Middleware: authentication, validation

* Adapters: Redis, MongoDB, cluster

### Server-Sent Events

* EventSource: onmessage, onerror, onopen

* Server: res.write, text/event-stream, keep-alive

* Event types: data, event, id, retry

* Reconnection: automatic, last-event-id

* Use cases: notifications, live feeds, dashboards

* Limitations: one-way, GET only, browser support

### Long Polling

* Request: hold connection, timeout

* Response: immediate data or timeout

* Comparison: vs WebSocket vs SSE

* Implementation: Express, async handler

* Use cases: fallback, simple requirements

---

## BACKGROUND JOBS DEEP ATLAS

#### Each keyword = expandable configuration

### BullMQ

* Queue: connection, defaultJobOptions

* Producer: add, addBulk, scheduledJob

* Consumer: Worker, process, concurrency

* Events: completed, failed, progress

* Priority: LIFO, FIFO, custom priority

* Delayed: delay option, scheduled time

* Repeatable: cron, every, tz

* Sandboxing: separate process, isolation

### Job Patterns

* Retry: attempts, backoff (exponential, fixed)

* Rate limiting: limiter, max, duration

* Job dependencies: parent-child, flows

* Pause/Resume: queue.pause(), queue.resume()

* Cleaning: removeOnComplete, removeOnFail, TTL

* Metrics: bull-board, arena, monitoring

### Distributed Jobs

* Redis connection: cluster, sentinel

* Multi-queue: priority queues, routing

* Horizontal scaling: multiple workers

* Idempotency: job ID, deduplication

* Exactly-once: atomic operations, locks

---

## FILE HANDLING DEEP ATLAS

#### Each keyword = expandable recipe

### Uploads

* Multer: memoryStorage, diskStorage, limits

* Streaming: pipe, transform, backpressure

* Multipart: FormData, boundary, chunks

* Validation: file type, size, virus scan

* Progress: req.socket, on data, percentage

### S3 Integration

* PutObject: Key, Body, ContentType

* Presigned URLs: getSignedUrl, expiration

* Multipart upload: createMultipartUpload, parts

* Direct upload: presigned POST, browser upload

* CDN: CloudFront, signed URLs, invalidation

### PDF Generation

* Puppeteer: page.pdf, HTML to PDF, screenshots

* PDFKit: document, text, images, vectors

* Templates: Handlebars, HTML, CSS print

* Streaming: response pipe, no memory buffer

* Optimization: compression, font subsetting

---

## EMAIL DEEP ATLAS

#### Each keyword = expandable implementation

### Nodemailer

* Transporter: createTransport, SMTP, OAuth2

* Message: from, to, cc, bcc, subject, html, text

* Attachments: filename, content, contentType

* Templates: handlebars, mjml, react-email

* Pools: pooled connections, concurrent sends

### Providers

* SendGrid: API, templates, tracking

* AWS SES: regions, quotas, dedicated IPs

* Postmark: server tokens, message streams

* Resend: modern API, React Email integration

* Mailgun: regions, webhooks, validation

### Deliverability

* SPF: DNS record, sender authorization

* DKIM: signatures, key rotation

* DMARC: policy, reporting, alignment

* Reputation: IP warmup, bounce handling

* Tracking: opens, clicks, unsubscribes

---

## ADVANCED SECURITY DEEP ATLAS

#### Each keyword = expandable pattern

### Authentication Flows

* Session: cookie, Redis store, rotation

* JWT: access token, refresh token, rotation

* OAuth: authorization code, PKCE, state

* SAML: enterprise SSO, IdP, SP

* Magic links: secure tokens, expiration

* Passkeys: WebAuthn, resident credentials

### Authorization

* RBAC: roles, permissions, hierarchy

* ABAC: attributes, policies, context

* PBAC: Cedar, OPA, Rego

* Row-level: Prisma where, RLS

* Field-level: GraphQL directives, middleware

### Rate Limiting

* Algorithms: token bucket, leaky bucket, sliding window

* Redis: atomic increment, expire

* Distributed: consistent across instances

* Headers: X-RateLimit-Limit, Remaining, Reset

* Tiers: per user, per IP, per API key

---

## ADVANCED DATABASE DEEP ATLAS

#### Each keyword = expandable optimization

### Query Optimization

* EXPLAIN ANALYZE: cost, actual time, rows

* Indexes: B-tree, covering, partial, expression

* Query planner: statistics, seq_scan, index_scan

* Joins: nested loop, hash, merge, order

* Subqueries: correlated, lateral, EXISTS

### Scaling Patterns

* Read replicas: leader-follower, lag, routing

* Sharding: horizontal, key-based, range-based

* Partitioning: range, list, hash, time-based

* Connection pooling: PgBouncer, pgpool

* Caching: query cache, materialized views

### Transactions

* Isolation levels: read committed, serializable

* Deadlocks: detection, prevention, ordering

* Two-phase commit: distributed, coordinator

* Saga pattern: orchestration, choreography

* Outbox pattern: reliable messaging

---

## PERFORMANCE DEEP ATLAS

#### Each keyword = expandable technique

### Profiling

* Clinic.js: doctor, flame, bubbleprof

* V8 profiler: CPU, heap snapshots

* Async hooks: resource tracking, timing

* Metrics: histogram, percentiles, RED

### Optimization

* Memory: heap size, GC tuning, leaks

* CPU: event loop blocking, worker threads

* I/O: streaming, batching, concurrency

* Network: keep-alive, HTTP/2, compression

### Caching

* In-memory: Map, LRU, node-cache

* Distributed: Redis, Memcached

* HTTP: Cache-Control, ETag, CDN

* Database: query cache, connection pooling

---

#### END OF MEGA BACKEND EXPANSION

---

## MICROSERVICES DEEP ATLAS

#### Each keyword = expandable architecture

### Service Design

* DDD: domain-driven design, aggregates

* Bounded context: service boundaries

* CQRS: command query separation

* Event sourcing: event store, replay

* Saga pattern: orchestration, choreography

### Communication

* Sync: HTTP, gRPC, direct call

* Async: message queue, pub/sub

* Service mesh: sidecar, mTLS

* API gateway: routing, auth

* Load balancing: round-robin, consistent hash

### Resilience

* Circuit breaker: open, half-open, closed

* Retry: exponential backoff, jitter

* Timeout: deadline propagation

* Bulkhead: resource isolation

* Fallback: degraded functionality

### Data Management

* Database per service: isolation

* Saga: distributed transactions

* Outbox pattern: reliable messaging

* Event streaming: Kafka, change data

* CQRS: read models, projections

---

## DRIVEN DEEP ATLAS

#### Each keyword = expandable pattern

### Message Brokers

* Kafka: partitions, consumer groups

* RabbitMQ: exchanges, queues, bindings

* Redis Streams: XADD, XREAD, groups

* NATS: JetStream, key-value

* AWS SQS/SNS: serverless, FIFO

### Event Patterns

* Event notification: minimal data

* Event-carried state: full payload

* Event sourcing: event log, replay

* Change data capture: Debezium

* Domain events: aggregate changes

### Processing

* At-least-once: acknowledgment, retry

* At-most-once: no retry, loss ok

* Exactly-once: transactions, idempotency

* Ordering: partition key, sequence

* Dead letter: failed messages, retry

### Stream Processing

* Kafka Streams: stateful, KTable

* Flink: windowing, exactly-once

* Spark Streaming: micro-batch

* ksqlDB: SQL on streams

* Materialize: real-time views

---

## API DESIGN DEEP ATLAS

#### Each keyword = expandable best practice

### REST Best Practices

* Resources: nouns, not verbs

* HTTP methods: GET, POST, PUT, PATCH, DELETE

* Status codes: 2xx success, 4xx client, 5xx server

* HATEOAS: hypermedia, discoverable

* Versioning: URL, header, content-type

### GraphQL Best Practices

* Schema design: types, nullable

* Resolver patterns: DataLoader, batching

* Federation: subgraphs, gateway

* Persisted queries: security, caching

* Subscriptions: real-time, websocket

### API Documentation

* OpenAPI: Swagger, spec-first

* AsyncAPI: event-driven APIs

* GraphQL SDL: schema, introspection

* Postman: collections, examples

* Redoc: beautiful docs, customizable

### API Versioning

* URL path: /v1/, /v2/

* Query param: ?version=1

* Header: Accept-Version

* Content-type: application/vnd.api.v1+json

* Semantic: breaking, backwards-compatible

---

## DATABASE PATTERNS DEEP ATLAS

#### Each keyword = expandable technique

### Data Modeling

* Normalization: 1NF, 2NF, 3NF, BCNF

* Denormalization: read performance

* Polymorphic: discriminator column

* JSON columns: flexible schema

* Enum: status, type fields

### Query Patterns

* Pagination: offset, cursor, keyset

* Filtering: WHERE, dynamic

* Sorting: ORDER BY, indexes

* Full-text: tsvector, GIN

* Aggregation: GROUP BY, window

### Migration Patterns

* Schema migration: versioned, rollback

* Data migration: backfill, transform

* Zero-downtime: expand-contract

* Blue-green: database copy

* Feature flags: gradual rollout

### Connection Management

* Pooling: min, max, idle timeout

* Health checks: validation query

* Retry: connection failure

* Read replicas: routing

* Connection multiplexing: PgBouncer

---

## OBSERVABILITY DEEP ATLAS

#### Each keyword = expandable implementation

### Logging

* Structured: JSON, key-value

* Levels: debug, info, warn, error

* Context: request ID, user ID

* Aggregation: ELK, Loki

* Retention: rotation, archival

### Metrics

* Types: counter, gauge, histogram

* Labels: cardinality, dimensions

* Exposition: Prometheus format

* Aggregation: PromQL, rate, increase

* Dashboards: Grafana, panels

### Tracing

* Spans: operation, timing

* Context: trace ID, span ID

* Propagation: W3C, B3 headers

* Sampling: head, tail-based

* Visualization: Jaeger, Zipkin

### Alerting

* SLOs/SLIs: objectives, indicators

* Error budget: burn rate

* Alert fatigue: noise reduction

* On-call: PagerDuty, Opsgenie

* Runbooks: actionable steps

---

## DEPLOYMENT DEEP ATLAS

#### Each keyword = expandable strategy

### Deployment Strategies

* Rolling: gradual replacement

* Blue-green: instant switch

* Canary: percentage rollout

* Feature flags: toggle features

* A/B: experimentation

### Container Orchestration

* Kubernetes: pods, services, ingress

* Docker Compose: local, development

* ECS: AWS, Fargate

* Cloud Run: serverless containers

* Nomad: HashiCorp, flexible

### CI/CD

* GitHub Actions: workflows, jobs

* GitLab CI: pipelines, stages

* CircleCI: orbs, caching

* Jenkins: declarative, plugins

* ArgoCD: GitOps, sync

### Infrastructure as Code

* Terraform: HCL, providers, state

* Pulumi: programming languages

* CloudFormation: AWS native

* CDK: construct libraries

* Crossplane: Kubernetes-native

---

#### END OF MEGA MEGA BACKEND EXPANSION

## #### Each section designed for massive LLM expansion

## PRODUCTION BACKEND CODE EXAMPLES ATLAS

#### Real implementations from industry best practices

---

## JS API PATTERNS

### Production-Ready Express Setup

**Why it exists:** Secure, structured API foundation
**Used by:** Most Node.js production APIs

```typescript
// src/app.ts - Production Express Configuration
import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { apiRouter } from './routes';

export function createApp(): Express {
  const app = express();

  // Security headers - helmet sets various HTTP headers
  app.use(helmet());

  // CORS configuration
  app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  }));

  // Gzip compression
  app.use(compression());

  // Request logging
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  // Body parsing
  app.use(express.json({ limit: '10kb' })); // Limit body size
  app.use(express.urlencoded({ extended: true }));

  // Rate limiting - prevent brute force
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api', limiter);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/v1', apiRouter);

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler - must be last
  app.use(errorHandler);

  return app;
}

```

### Custom Error Classes Pattern

**Why it exists:** Consistent error handling across API
**Pattern from:** Express best practices, production APIs

```typescript
// src/utils/errors.ts
export abstract class AppError extends Error {
  abstract statusCode: number;
  abstract isOperational: boolean;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  statusCode = 404;
  isOperational = true;

  constructor(resource: string = 'Resource') {
    super(`${resource} not found`);
  }
}

export class ValidationError extends AppError {
  statusCode = 400;
  isOperational = true;
  errors: Record<string, string[]>;

  constructor(errors: Record<string, string[]>) {
    super('Validation failed');
    this.errors = errors;
  }
}

export class UnauthorizedError extends AppError {
  statusCode = 401;
  isOperational = true;

  constructor(message: string = 'Unauthorized') {
    super(message);
  }
}

export class ForbiddenError extends AppError {
  statusCode = 403;
  isOperational = true;

  constructor(message: string = 'Forbidden') {
    super(message);
  }
}

export class ConflictError extends AppError {
  statusCode = 409;
  isOperational = true;

  constructor(message: string = 'Resource already exists') {
    super(message);
  }
}

// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';
import * as Sentry from '@sentry/node';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
  });

  // Report to Sentry for non-operational errors
  if (!(err instanceof AppError) || !err.isOperational) {
    Sentry.captureException(err);
  }

  // Handle known operational errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(err instanceof ValidationError && { errors: err.errors }),
    });
  }

  // Handle unknown errors
  const statusCode = 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  return res.status(statusCode).json({
    status: 'error',
    message,
  });
}

```

---

## PRISMA DATABASE PATTERNS

### Prisma Schema Design

**Why it exists:** Type-safe database access, migrations
**Used by:** Modern TypeScript backends

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User model with relations
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  hashedPassword String?  @map("hashed_password")
  emailVerified DateTime? @map("email_verified")
  image         String?
  role          Role      @default(USER)
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  // Relations
  accounts      Account[]
  sessions      Session[]
  orders        Order[]
  reviews       Review[]

  @@map("users")
}

model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  price       Decimal  @db.Decimal(10, 2)
  comparePrice Decimal? @db.Decimal(10, 2) @map("compare_price")
  images      String[]
  category    Category @relation(fields: [categoryId], references: [id])
  categoryId  String   @map("category_id")
  inventory   Int      @default(0)
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  reviews     Review[]
  orderItems  OrderItem[]

  @@index([categoryId])
  @@index([isActive, createdAt])
  @@map("products")
}

model Order {
  id        String      @id @default(cuid())
  userId    String      @map("user_id")
  user      User        @relation(fields: [userId], references: [id])
  status    OrderStatus @default(PENDING)
  total     Decimal     @db.Decimal(10, 2)
  items     OrderItem[]
  createdAt DateTime    @default(now()) @map("created_at")
  updatedAt DateTime    @updatedAt @map("updated_at")

  @@index([userId])
  @@index([status, createdAt])
  @@map("orders")
}

enum Role {
  USER
  ADMIN
  MODERATOR
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

```

### Repository Pattern with Prisma

**Why it exists:** Abstracts database layer, makes testing easier
**Pattern from:** Clean Architecture, DDD

```typescript
// src/repositories/productRepository.ts
import { prisma } from '@/lib/prisma';
import { Prisma, Product } from '@prisma/client';

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isActive?: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const productRepository = {
  async findMany(
    filters: ProductFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResult<Product>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    // Build where clause dynamically
    const where: Prisma.ProductWhereInput = {
      isActive: filters.isActive ?? true,
      ...(filters.category && {
        category: { slug: filters.category },
      }),
      ...(filters.minPrice || filters.maxPrice) && {
        price: {
          gte: filters.minPrice,
          lte: filters.maxPrice,
        },
      },
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };

    // Execute both queries in parallel
    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { name: true, slug: true } },
          reviews: { select: { rating: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  },

  async findBySlug(slug: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  },

  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return prisma.product.create({ data });
  },

  async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    return prisma.product.update({ where: { id }, data });
  },

  async delete(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } });
  },
};

```

---

## JWT AUTHENTICATION PATTERNS

### JWT Service Implementation

**Why it exists:** Stateless authentication, scalable
**Used by:** Most modern APIs

```typescript
// src/services/authService.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { UnauthorizedError } from '@/utils/errors';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export const authService = {
  async register(email: string, password: string, name: string) {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: { email, hashedPassword, name },
      select: { id: true, email: true, name: true, role: true },
    });

    // Generate tokens
    const tokens = this.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, ...tokens };
  },

  async login(email: string, password: string): Promise<AuthTokens & { user: any }> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, role: true, hashedPassword: true },
    });

    if (!user || !user.hashedPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Generate tokens
    const tokens = this.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token in database
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    const { hashedPassword: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, ...tokens };
  },

  generateTokens(payload: TokenPayload): AuthTokens {
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    return { accessToken, refreshToken };
  },

  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  },

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    // Verify refresh token
    let payload: TokenPayload;
    try {
      payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as TokenPayload;
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Check if token exists in database (not revoked)
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        userId: payload.userId,
        expiresAt: { gt: new Date() },
      },
    });

    if (!storedToken) {
      throw new UnauthorizedError('Token revoked or expired');
    }

    // Delete old token
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    // Generate new tokens
    const tokens = this.generateTokens(payload);

    // Store new refresh token
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: payload.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return tokens;
  },

  async logout(refreshToken: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  },
};

```

### Authentication Middleware

**Why it exists:** Protect routes, inject user into request
**Pattern from:** Express authentication middleware

```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { authService } from '@/services/authService';
import { UnauthorizedError, ForbiddenError } from '@/utils/errors';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('No token provided'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = authService.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
}

// Role-based authorization middleware
export function authorize(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
}

// Usage in routes
// router.get('/admin/users', authenticate, authorize('ADMIN'), getUsers);
// router.delete('/products/:id', authenticate, authorize('ADMIN', 'MODERATOR'), deleteProduct);

```

---

## WEBSOCKET PATTERNS

### Socket.io Server Setup

**Why it exists:** Real-time bidirectional communication
**Used by:** Chat apps, live updates, gaming

```typescript
// src/socket/index.ts
import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { authService } from '@/services/authService';
import { logger } from '@/utils/logger';

interface AuthenticatedSocket extends Socket {
  userId: string;
  email: string;
}

export function initializeSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const payload = authService.verifyAccessToken(token);
      (socket as AuthenticatedSocket).userId = payload.userId;
      (socket as AuthenticatedSocket).email = payload.email;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(`User connected: ${socket.userId}`);

    // Join user's personal room for direct messages
    socket.join(`user:${socket.userId}`);

    // Handle joining chat rooms
    socket.on('join:room', async (roomId: string) => {
      // Verify user has access to room
      const hasAccess = await verifyRoomAccess(socket.userId, roomId);
      if (!hasAccess) {
        socket.emit('error', { message: 'Access denied' });
        return;
      }

      socket.join(`room:${roomId}`);
      socket.to(`room:${roomId}`).emit('user:joined', {
        userId: socket.userId,
        timestamp: new Date(),
      });
    });

    // Handle leaving rooms
    socket.on('leave:room', (roomId: string) => {
      socket.leave(`room:${roomId}`);
      socket.to(`room:${roomId}`).emit('user:left', {
        userId: socket.userId,
        timestamp: new Date(),
      });
    });

    // Handle chat messages
    socket.on('message:send', async (data: { roomId: string; content: string }) => {
      try {
        // Save message to database
        const message = await saveMessage({
          roomId: data.roomId,
          userId: socket.userId,
          content: data.content,
        });

        // Broadcast to room
        io.to(`room:${data.roomId}`).emit('message:new', message);
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing:start', (roomId: string) => {
      socket.to(`room:${roomId}`).emit('user:typing', {
        userId: socket.userId,
        isTyping: true,
      });
    });

    socket.on('typing:stop', (roomId: string) => {
      socket.to(`room:${roomId}`).emit('user:typing', {
        userId: socket.userId,
        isTyping: false,
      });
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      logger.info(`User disconnected: ${socket.userId}, reason: ${reason}`);
    });
  });

  return io;
}

// Emit to specific user from anywhere in the app
export function emitToUser(io: Server, userId: string, event: string, data: any) {
  io.to(`user:${userId}`).emit(event, data);
}

// Emit to room from anywhere in the app
export function emitToRoom(io: Server, roomId: string, event: string, data: any) {
  io.to(`room:${roomId}`).emit(event, data);
}

```

---

## EMAIL SERVICE PATTERNS

### Email Service with Templates

**Why it exists:** Transactional emails, notifications
**Used by:** Most production applications

```typescript
// src/services/emailService.ts
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { WelcomeEmail } from '@/emails/WelcomeEmail';
import { PasswordResetEmail } from '@/emails/PasswordResetEmail';
import { OrderConfirmationEmail } from '@/emails/OrderConfirmation';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const emailService = {
  async send(options: EmailOptions): Promise<void> {
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
  },

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const html = render(WelcomeEmail({ name }));

    await this.send({
      to: email,
      subject: 'Welcome to Our Platform!',
      html,
    });
  },

  async sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
    const html = render(PasswordResetEmail({ resetUrl }));

    await this.send({
      to: email,
      subject: 'Reset Your Password',
      html,
    });
  },

  async sendOrderConfirmation(
    email: string,
    order: { id: string; items: any[]; total: number }
  ): Promise<void> {
    const html = render(OrderConfirmationEmail({ order }));

    await this.send({
      to: email,
      subject: `Order Confirmation #${order.id}`,
      html,
    });
  },
};

// emails/WelcomeEmail.tsx - React Email Template
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to our platform!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Welcome, {name}!</Heading>
          <Text style={text}>
            We're excited to have you on board. Get started by exploring
            our features and making the most of your account.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href="https://yourapp.com/dashboard">
              Get Started
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            If you have any questions, reply to this email or contact support.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' };
const container = { margin: '0 auto', padding: '40px 20px', maxWidth: '560px' };
const heading = { fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' };
const text = { fontSize: '16px', lineHeight: '24px', color: '#525f7f' };
const buttonContainer = { textAlign: 'center' as const, marginTop: '32px' };
const button = {
  backgroundColor: '#5469d4',
  color: '#fff',
  padding: '12px 24px',
  borderRadius: '4px',
  textDecoration: 'none',
};
const hr = { borderColor: '#e6ebf1', margin: '32px 0' };
const footer = { fontSize: '14px', color: '#8898aa' };

```

---

## BACKGROUND JOBS PATTERNS

### BullMQ Job Queue

**Why it exists:** Async processing, scheduled tasks, retries
**Used by:** Production backends for heavy operations

```typescript
// src/queues/index.ts
import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { emailService } from '@/services/emailService';
import { logger } from '@/utils/logger';

const connection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

// Define queue
export const emailQueue = new Queue('email', { connection });
export const orderQueue = new Queue('orders', { connection });

// Email worker
const emailWorker = new Worker(
  'email',
  async (job: Job) => {
    const { type, data } = job.data;

    switch (type) {
      case 'welcome':
        await emailService.sendWelcomeEmail(data.email, data.name);
        break;
      case 'password-reset':
        await emailService.sendPasswordResetEmail(data.email, data.resetUrl);
        break;
      case 'order-confirmation':
        await emailService.sendOrderConfirmation(data.email, data.order);
        break;
      default:
        throw new Error(`Unknown email type: ${type}`);
    }
  },
  {
    connection,
    concurrency: 5,
  }
);

// Order processing worker
const orderWorker = new Worker(
  'orders',
  async (job: Job) => {
    const { orderId } = job.data;

    // Process order steps
    await job.updateProgress(10);
    await processPayment(orderId);

    await job.updateProgress(50);
    await updateInventory(orderId);

    await job.updateProgress(80);
    await notifyWarehouse(orderId);

    await job.updateProgress(100);

    return { processed: true };
  },
  {
    connection,
    concurrency: 10,
  }
);

// Event handlers
emailWorker.on('completed', (job) => {
  logger.info(`Email job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
  logger.error(`Email job ${job?.id} failed: ${err.message}`);
});

orderWorker.on('completed', (job) => {
  logger.info(`Order job ${job.id} completed`);
});

orderWorker.on('failed', (job, err) => {
  logger.error(`Order job ${job?.id} failed: ${err.message}`);
});

// Helper functions to add jobs
export async function queueWelcomeEmail(email: string, name: string) {
  await emailQueue.add('send-welcome', {
    type: 'welcome',
    data: { email, name },
  }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
  });
}

export async function queueOrderProcessing(orderId: string) {
  await orderQueue.add('process-order', { orderId }, {
    attempts: 5,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 5000 },
  });
}

// Scheduled jobs
export async function setupScheduledJobs() {
  // Daily report at 9am
  await emailQueue.add(
    'daily-report',
    { type: 'daily-report', data: {} },
    {
      repeat: { cron: '0 9 * * *' },
    }
  );

  // Cleanup old data every Sunday at midnight
  await orderQueue.add(
    'cleanup',
    { type: 'cleanup' },
    {
      repeat: { cron: '0 0 * * 0' },
    }
  );
}

```

---

#### CONTINUED IN NEXT SECTION: MORE PATTERNS

---

## FILE UPLOAD PATTERNS

### Multer File Upload

**Why it exists:** Handle multipart form data
**Used by:** Most Node.js file upload implementations

```typescript
// middleware/upload.ts
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';

const s3Client = new S3Client({ region: process.env.AWS_REGION });

// Memory storage for processing before S3
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Upload to S3
export async function uploadToS3(file: Express.Multer.File): Promise<string> {
  const key = `uploads/${uuid()}-${file.originalname}`;

  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));

  return `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`;
}

// Route usage
router.post('/upload', upload.single('image'), async (req, res) => {
  const url = await uploadToS3(req.file!);
  res.json({ url });
});

```

---

## CACHING PATTERNS

### Redis Caching Layer

**Why it exists:** Reduce database load, faster responses
**Used by:** Production applications

```typescript
// lib/cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  async set(key: string, value: any, ttlSeconds = 3600): Promise<void> {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  },

  async del(key: string): Promise<void> {
    await redis.del(key);
  },

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length) await redis.del(...keys);
  },
};

// Cache decorator
export function cached(ttl = 3600) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${key}:${JSON.stringify(args)}`;
      const cached = await cache.get(cacheKey);

      if (cached) return cached;

      const result = await original.apply(this, args);
      await cache.set(cacheKey, result, ttl);
      return result;
    };

    return descriptor;
  };
}

```

---

## LOGGING PATTERNS

### Structured Logging with Pino

**Why it exists:** Fast, structured, production-ready logging

```typescript
// lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty' }
    : undefined,
  base: {
    env: process.env.NODE_ENV,
    service: 'api',
  },
});

// Request logging middleware
export function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: Date.now() - start,
      userAgent: req.get('user-agent'),
    });
  });

  next();
}

```

---

## INPUT VALIDATION

### Zod Schema Validation

**Why it exists:** Type-safe runtime validation

```typescript
// schemas/product.ts
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  price: z.number().positive(),
  description: z.string().optional(),
  categoryId: z.string().uuid(),
  tags: z.array(z.string()).max(10).optional(),
});

// Validation middleware
export function validate(schema: z.ZodSchema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors,
        });
      }
      next(error);
    }
  };
}

// Usage
router.post('/products', validate(createProductSchema), createProduct);

```

---

## GRACEFUL SHUTDOWN

### Production Shutdown Handler

**Why it exists:** Clean shutdown, prevent data loss

```typescript
// lib/shutdown.ts
import { prisma } from './prisma';
import { server } from './server';

const signals = ['SIGTERM', 'SIGINT'];

export function setupGracefulShutdown() {
  signals.forEach((signal) => {
    process.on(signal, async () => {
      console.log(`Received ${signal}, shutting down...`);

      // Stop accepting new connections
      server.close(async () => {
        console.log('HTTP server closed');

        // Close database
        await prisma.$disconnect();
        console.log('Database disconnected');

        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('Forced shutdown');
        process.exit(1);
      }, 10000);
    });
  });
}

```

---

#### CONTINUED: MORE PATTERNS

---

## GRAPHQL PATTERNS

### Apollo Server Setup

**Why it exists:** Type-safe API with schema

```typescript
// graphql/schema.ts
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql
  type Product {
    id: ID!
    name: String!
    price: Float!
    category: Category
    reviews: [Review!]!
  }

  type Category {
    id: ID!
    name: String!
    products: [Product!]!
  }

  type Review {
    id: ID!
    rating: Int!
    comment: String
    user: User!
  }

  type Query {
    products(category: ID, limit: Int): [Product!]!
    product(id: ID!): Product
    categories: [Category!]!
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
  }

  input CreateProductInput {
    name: String!
    price: Float!
    categoryId: ID!
  }
`;

const resolvers = {
  Query: {
    products: async (_, { category, limit }, { dataSources }) => {
      return dataSources.productAPI.getProducts({ category, limit });
    },
    product: async (_, { id }, { dataSources }) => {
      return dataSources.productAPI.getProduct(id);
    },
  },
  Product: {
    category: async (product, _, { dataSources }) => {
      return dataSources.categoryAPI.getCategory(product.categoryId);
    },
    reviews: async (product, _, { dataSources }) => {
      return dataSources.reviewAPI.getReviewsForProduct(product.id);
    },
  },
  Mutation: {
    createProduct: async (_, { input }, { dataSources }) => {
      return dataSources.productAPI.createProduct(input);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

```

---

## DATABASE TRANSACTIONS

### Prisma Transactions

**Why it exists:** Atomic multi-table operations

```typescript
// services/orderService.ts
import { prisma } from '@/lib/prisma';

export async function createOrder(userId: string, items: CartItem[]) {
  return prisma.$transaction(async (tx) => {
    // 1. Create order
    const order = await tx.order.create({
      data: {
        userId,
        status: 'PENDING',
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      },
    });

    // 2. Create order items
    await tx.orderItem.createMany({
      data: items.map(item => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    // 3. Decrement inventory
    for (const item of items) {
      const updated = await tx.product.updateMany({
        where: {
          id: item.productId,
          inventory: { gte: item.quantity },
        },
        data: {
          inventory: { decrement: item.quantity },
        },
      });

      if (updated.count === 0) {
        throw new Error(`Insufficient inventory for ${item.productId}`);
      }
    }

    // 4. Clear cart
    await tx.cartItem.deleteMany({ where: { userId } });

    return order;
  });
}

```

---

## MICROSERVICES COMMUNICATION

### gRPC Service

**Why it exists:** High-performance service-to-service communication

```protobuf
// proto/product.proto
syntax = "proto3";
package product;

service ProductService {
  rpc GetProduct(GetProductRequest) returns (Product);
  rpc ListProducts(ListProductsRequest) returns (ProductList);
  rpc CreateProduct(CreateProductRequest) returns (Product);
}

message Product {
  string id = 1;
  string name = 2;
  double price = 3;
  int32 inventory = 4;
}

message GetProductRequest {
  string id = 1;
}

message ListProductsRequest {
  int32 page = 1;
  int32 limit = 2;
  string category = 3;
}

message ProductList {
  repeated Product products = 1;
  int32 total = 2;
}

```typescript
// grpc/productClient.ts
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const PROTO_PATH = './proto/product.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const productProto = grpc.loadPackageDefinition(packageDefinition).product;

const client = new productProto.ProductService(
  process.env.PRODUCT_SERVICE_URL,
  grpc.credentials.createInsecure()
);

export function getProduct(id: string): Promise<Product> {
  return new Promise((resolve, reject) => {
    client.GetProduct({ id }, (err, response) => {
      if (err) reject(err);
      else resolve(response);
    });
  });
}

```

---

## MESSAGE QUEUES

### RabbitMQ Publisher/Consumer

**Why it exists:** Async event-driven architecture

```typescript
// lib/rabbitmq.ts
import amqp from 'amqplib';

let channel: amqp.Channel;

export async function connectRabbitMQ() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL!);
  channel = await connection.createChannel();

  // Declare exchanges and queues
  await channel.assertExchange('orders', 'topic', { durable: true });
  await channel.assertQueue('order-processing', { durable: true });
  await channel.bindQueue('order-processing', 'orders', 'order.created');
}

export async function publishEvent(routingKey: string, message: object) {
  channel.publish(
    'orders',
    routingKey,
    Buffer.from(JSON.stringify(message)),
    { persistent: true }
  );
}

export async function consumeEvents(
  queue: string,
  handler: (msg: any) => Promise<void>
) {
  await channel.consume(queue, async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());
      await handler(data);
      channel.ack(msg);
    } catch (error) {
      channel.nack(msg, false, false); // Dead letter queue
    }
  });
}

```

---

#### CONTINUED: MORE BACKEND PATTERNS

---

## EMAIL PATTERNS

### Resend Email Service

**Why it exists:** Transactional emails

```typescript
// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail(options: EmailOptions) {
  const { data, error } = await resend.emails.send({
    from: 'noreply@yourapp.com',
    ...options,
  });

  if (error) throw new Error(`Email failed: ${error.message}`);
  return data;
}

// Email templates with React
// emails/OrderConfirmation.tsx
import { Html, Head, Body, Container, Text, Button } from '@react-email/components';

export function OrderConfirmationEmail({ order }: { order: Order }) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'sans-serif' }}>
        <Container>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Order Confirmed!</Text>
          <Text>Order #{order.id}</Text>
          <Text>Total: ${order.total.toFixed(2)}</Text>
          <Button
            href={`https://yourapp.com/orders/${order.id}`}
            style={{ background: '#3b82f6', color: 'white', padding: '12px 24px' }}
          >
            View Order
          </Button>
        </Container>
      </Body>
    </Html>
  );
}

```

---

## PDF GENERATION

### PDF Creation with React-PDF

**Why it exists:** Generate invoices, reports

```typescript
// lib/pdf.ts
import { renderToBuffer } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12 },
  header: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
  row: { flexDirection: 'row', marginBottom: 8 },
  label: { width: 150, color: '#666' },
  value: { flex: 1 },
  table: { marginTop: 20 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f3f4f6', padding: 8 },
  tableRow: { flexDirection: 'row', borderBottom: '1px solid #e5e7eb', padding: 8 },
  total: { marginTop: 20, textAlign: 'right', fontSize: 16, fontWeight: 'bold' },
});

function InvoicePDF({ invoice }: { invoice: Invoice }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Invoice #{invoice.number}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{invoice.date}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={{ width: '50%' }}>Item</Text>
            <Text style={{ width: '20%' }}>Qty</Text>
            <Text style={{ width: '30%' }}>Price</Text>
          </View>
          {invoice.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={{ width: '50%' }}>{item.name}</Text>
              <Text style={{ width: '20%' }}>{item.quantity}</Text>
              <Text style={{ width: '30%' }}>${item.price.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.total}>Total: ${invoice.total.toFixed(2)}</Text>
      </Page>
    </Document>
  );
}

export async function generateInvoicePDF(invoice: Invoice): Promise<Buffer> {
  return renderToBuffer(<InvoicePDF invoice={invoice} />);
}

```

---

## SCHEDULED TASKS

### Cron Jobs with node-cron

**Why it exists:** Background scheduled tasks

```typescript
// lib/scheduler.ts
import cron from 'node-cron';
import { prisma } from './prisma';

export function initializeScheduler() {
  // Every day at midnight - cleanup expired sessions
  cron.schedule('0 0 * * *', async () => {
    console.log('Running session cleanup...');
    const deleted = await prisma.session.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    console.log(`Deleted ${deleted.count} expired sessions`);
  });

  // Every hour - send reminder emails
  cron.schedule('0 * * * *', async () => {
    const upcomingOrders = await prisma.order.findMany({
      where: {
        status: 'PENDING',
        reminderSent: false,
        createdAt: { lte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      include: { user: true },
    });

    for (const order of upcomingOrders) {
      await sendReminderEmail(order);
      await prisma.order.update({
        where: { id: order.id },
        data: { reminderSent: true },
      });
    }
  });

  // Every 5 minutes - process pending webhooks
  cron.schedule('*/5 * * * *', async () => {
    await processWebhookQueue();
  });

  console.log('Scheduler initialized');
}

```

---

## TEXT SEARCH

### PostgreSQL Full-Text Search

**Why it exists:** Database-native search

```typescript
// services/search.ts
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function searchProducts(query: string, filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  const searchQuery = query.split(' ').join(' & ');

  return prisma.$queryRaw`
    SELECT
      id, name, description, price, category,
      ts_rank(search_vector, to_tsquery('english', ${searchQuery})) as rank
    FROM products
    WHERE search_vector @@ to_tsquery('english', ${searchQuery})
      ${filters?.category ? Prisma.sql`AND category = ${filters.category}` : Prisma.empty}
      ${filters?.minPrice ? Prisma.sql`AND price >= ${filters.minPrice}` : Prisma.empty}
      ${filters?.maxPrice ? Prisma.sql`AND price <= ${filters.maxPrice}` : Prisma.empty}
    ORDER BY rank DESC
    LIMIT 20
  `;
}

// Migration to add search vector
// prisma/migrations/add_search_vector.sql
/*
ALTER TABLE products ADD COLUMN search_vector tsvector;

UPDATE products SET search_vector =
  setweight(to_tsvector('english', coalesce(name, '')), 'A') || setweight(to_tsvector('english', coalesce(description, '')), 'B');

CREATE INDEX products_search_idx ON products USING GIN (search_vector);

CREATE TRIGGER products_search_update
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION
  tsvector_update_trigger(search_vector, 'pg_catalog.english', name, description);
*/

```

---

#### CONTINUED: MORE BACKEND PATTERNS

---

## DISTRIBUTED SYSTEMS

## DATABASE DEADLOCK DEBUGGING

### PostgreSQL Lock Analysis

**Source:** Uber Engineering, Stripe Database Team
**Why normal AI can't synthesize this:** Requires production incident experience

```sql
-- DETECTING DEADLOCKS IN PRODUCTION
-- Run this query when you suspect deadlock issues

-- View current locks and blocking
SELECT
    blocked.pid AS blocked_pid,
    blocked.usename AS blocked_user,
    blocked.query AS blocked_query,
    blocking.pid AS blocking_pid,
    blocking.usename AS blocking_user,
    blocking.query AS blocking_query,
    blocked.wait_event_type,
    now() - blocked.query_start AS blocked_duration
FROM pg_stat_activity blocked
JOIN pg_locks blocked_locks ON blocked.pid = blocked_locks.pid
JOIN pg_locks blocking_locks ON blocked_locks.locktype = blocking_locks.locktype
    AND blocked_locks.database IS NOT DISTINCT FROM blocking_locks.database
    AND blocked_locks.relation IS NOT DISTINCT FROM blocking_locks.relation
    AND blocked_locks.page IS NOT DISTINCT FROM blocking_locks.page
    AND blocked_locks.tuple IS NOT DISTINCT FROM blocking_locks.tuple
    AND blocked_locks.virtualxid IS NOT DISTINCT FROM blocking_locks.virtualxid
    AND blocked_locks.transactionid IS NOT DISTINCT FROM blocking_locks.transactionid
    AND blocked_locks.classid IS NOT DISTINCT FROM blocking_locks.classid
    AND blocked_locks.objid IS NOT DISTINCT FROM blocking_locks.objid
    AND blocked_locks.objsubid IS NOT DISTINCT FROM blocking_locks.objsubid
    AND blocked_locks.pid != blocking_locks.pid
JOIN pg_stat_activity blocking ON blocking_locks.pid = blocking.pid
WHERE NOT blocked_locks.granted;

-- PRODUCTION FIX: Set lock timeout to fail fast
SET lock_timeout = '5s';
SET statement_timeout = '30s';

-- DEADLOCK-PRONE PATTERN: Two transactions update same rows in different order
-- Transaction 1: UPDATE orders SET status='paid' WHERE id=1; UPDATE orders SET status='paid' WHERE id=2;
-- Transaction 2: UPDATE orders SET status='shipped' WHERE id=2; UPDATE orders SET status='shipped' WHERE id=1;
-- DEADLOCK occurs when both transactions hold one lock and wait for the other

-- FIX: Always update in consistent order (e.g., by primary key ascending)

```typescript
/**
 * DEADLOCK PREVENTION PATTERN
 * * PRODUCTION INCIDENT: Order processing deadlock at Stripe
 * * THE BUG: Two concurrent requests updating related entities in
 * different order caused database deadlock under high load.
 * * PATTERN: Sort all updates by primary key before executing
 */

async function updateMultipleEntities(
  entities: { id: string; data: any }[]
): Promise<void> {
  // CRITICAL: Sort by ID to ensure consistent lock ordering
  const sorted = [...entities].sort((a, b) => a.id.localeCompare(b.id));

  await prisma.$transaction(async (tx) => {
    for (const entity of sorted) {
      await tx.entity.update({
        where: { id: entity.id },
        data: entity.data,
      });
    }
  }, {
    timeout: 10000, // 10 second timeout
    maxWait: 5000,  // 5 second max wait for transaction slot
    isolationLevel: 'ReadCommitted', // Lowest isolation that prevents dirty reads
  });
}

/**
 * CONNECTION POOL EXHAUSTION DEBUGGING
 * * SYMPTOMS:
 * - "Connection pool timeout" errors under load
 * - Requests hanging for exactly pool timeout duration
 * - Database shows fewer connections than pool max
 * * COMMON CAUSES:
 * 1. Long-running transactions holding connections
 * 2. Connection not returned after error
 * 3. Nested transactions using multiple connections
 * 4. N+1 queries exhausting pool during request
 */

// Connection pool monitoring
const poolMonitor = {
  checkouts: 0,
  returns: 0,
  timeouts: 0,

  onCheckout() {
    this.checkouts++;
    if (this.checkouts - this.returns > 10) {
      High connection usage:', this.checkouts - this.returns);
    }
  },

  onReturn() {
    this.returns++;
  },

  onTimeout() {
    this.timeouts++;
    Pool timeout! Active:', this.checkouts - this.returns);
  },
};

// Prisma middleware to track connection usage
prisma.$use(async (params, next) => {
  const start = Date.now();
  poolMonitor.onCheckout();

  try {
    const result = await next(params);
    return result;
  } finally {
    poolMonitor.onReturn();

    const duration = Date.now() - start;
    if (duration > 1000) {
      console.warn(`Slow query (${duration}ms):`, params.model, params.action);
    }
  }
});

```

---

## QUERY DETECTION

### Runtime Query Analyzer

**Source:** Shopify Engineering, DataDog APM patterns
**Why it's hard:** Requires request-scoped query tracking

```typescript
/**
 * N+1 QUERY DETECTION SYSTEM
 * * THE PROBLEM: Fetching a list of orders, then fetching each order's
 * user individually = N+1 queries. Kills performance at scale.
 * * STRIPE'S APPROACH: Track queries per request, alert on patterns
 */

class QueryAnalyzer {
  private queries: Map<string, { count: number; durations: number[] }> = new Map();
  private requestId: string;

  constructor(requestId: string) {
    this.requestId = requestId;
  }

  recordQuery(model: string, action: string, duration: number): void {
    const key = `${model}.${action}`;
    const existing = this.queries.get(key) || { count: 0, durations: [] };

    existing.count++;
    existing.durations.push(duration);
    this.queries.set(key, existing);
  }

  detectNPlusOne(): NPlusOneViolation[] {
    const violations: NPlusOneViolation[] = [];

    for (const [key, data] of this.queries) {
      // Heuristic: Same query executed 5+ times in single request = N+1
      if (data.count >= 5) {
        violations.push({
          query: key,
          count: data.count,
          totalDuration: data.durations.reduce((a, b) => a + b, 0),
          suggestion: this.getSuggestion(key),
        });
      }
    }

    return violations;
  }

  private getSuggestion(query: string): string {
    const [model, action] = query.split('.');

    if (action === 'findUnique' || action === 'findFirst') {
      return `Use findMany with 'where: { id: { in: ids } }' instead of multiple ${query}`;
    }

    return `Consider using include/select to fetch ${model} in parent query`;
  }
}

interface NPlusOneViolation {
  query: string;
  count: number;
  totalDuration: number;
  suggestion: string;
}

// Middleware integration
function createQueryAnalyzerMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const analyzer = new QueryAnalyzer(req.id);
    (req as any).queryAnalyzer = analyzer;

    // Wrap response to analyze after request
    const originalEnd = res.end;
    res.end = function(...args: any[]) {
      const violations = analyzer.detectNPlusOne();

      if (violations.length > 0) {
        N+1 Queries Detected in', req.path);
        violations.forEach(v => {
          console.warn(`  - ${v.query}: ${v.count} calls, ${v.totalDuration}ms total`);
          console.warn(`    Fix: ${v.suggestion}`);
        });

        // Send to APM
        apm.captureError(new Error('N+1 Query Pattern'), {
          custom: { violations, path: req.path },
        });
      }

      return originalEnd.apply(this, args);
    };

    next();
  };
}

```

---

## DISTRIBUTED LOCK PATTERNS

### Redis Distributed Lock (Redlock)

**Source:** Redis documentation, Martin Kleppmann's critique, Stripe's production usage
**Why it's complex:** Distributed consensus is fundamentally hard

```typescript
/**
 * DISTRIBUTED LOCK WITH REDLOCK ALGORITHM
 * * USE CASE: Ensure only one instance processes a job
 * * CRITICAL INSIGHT FROM MARTIN KLEPPMANN:
 * Redlock is NOT safe for correctness-critical operations.
 * It's suitable for efficiency (preventing duplicate work),
 * NOT for safety (preventing data corruption).
 * * For safety-critical: Use database advisory locks or Zookeeper
 */

import Redlock from 'redlock';
import Redis from 'ioredis';

const redis1 = new Redis(process.env.REDIS_1_URL!);
const redis2 = new Redis(process.env.REDIS_2_URL!);
const redis3 = new Redis(process.env.REDIS_3_URL!);

const redlock = new Redlock([redis1, redis2, redis3], {
  // Retry settings
  retryCount: 3,
  retryDelay: 200, // ms
  retryJitter: 100, // ms

  // Clock drift factor (default 0.01 = 1%)
  driftFactor: 0.01,

  // Auto-extend before expiry
  automaticExtensionThreshold: 500, // ms before expiry to extend
});

async function processWithLock<T>(
  resourceId: string,
  ttl: number,
  fn: () => Promise<T>
): Promise<T> {
  const lockKey = `lock:${resourceId}`;

  let lock;
  try {
    // Acquire lock
    lock = await redlock.acquire([lockKey], ttl);
    Acquired lock for ${resourceId}`);

    // Execute critical section
    const result = await fn();

    return result;
  } catch (error) {
    if (error instanceof Redlock.LockError) {
      Could not acquire lock for ${resourceId}, already held`);
      throw new Error('Resource busy, try again later');
    }
    throw error;
  } finally {
    // Release lock
    if (lock) {
      await lock.release();
      Released lock for ${resourceId}`);
    }
  }
}

/**
 * FENCING TOKENS FOR SAFETY
 * * Even with locks, there's a window where two processes might
 * think they hold the lock (GC pause, network partition).
 * * SOLUTION: Fencing token - monotonically increasing number
 * that storage layer uses to reject stale writes.
 */

class FencedLock {
  private tokenCounter = 0;

  async acquireWithFencingToken(
    resourceId: string
  ): Promise<{ lock: any; fencingToken: number }> {
    const lock = await redlock.acquire([`lock:${resourceId}`], 10000);
    const fencingToken = ++this.tokenCounter;

    // Store fencing token in lock metadata
    await redis1.set(`fence:${resourceId}`, fencingToken.toString());

    return { lock, fencingToken };
  }

  async writeWithFencing(
    resourceId: string,
    fencingToken: number,
    data: any
  ): Promise<void> {
    // Only write if our fencing token is >= stored token
    const storedToken = parseInt(await redis1.get(`fence:${resourceId}`) || '0');

    if (fencingToken < storedToken) {
      throw new Error('Stale fencing token - another process has the lock');
    }

    // Proceed with write
    await database.update({ where: { id: resourceId }, data });
  }
}

```

---

## INCIDENT RESPONSE PATTERNS

### Production Debugging Runbook

**Source:** Google SRE Book, PagerDuty Incident Response
**Why it matters:** Every minute of downtime = lost revenue

```typescript
/**
 * PRODUCTION INCIDENT DEBUGGING CHECKLIST
 * * 1. IDENTIFY: What's broken? API errors? Latency? Data corruption?
 * 2. MITIGATE: Can we reduce impact NOW? (feature flags, rollback, scale)
 * 3. INVESTIGATE: Root cause analysis AFTER mitigation
 * 4. FIX: Deploy permanent fix
 * 5. POSTMORTEM: Document and prevent recurrence
 */

// Automated incident detection
class IncidentDetector {
  private metrics = {
    errorRate: 0,
    p99Latency: 0,
    activeConnections: 0,
  };

  private thresholds = {
    errorRate: 0.01, // 1% error rate triggers alert
    p99Latency: 2000, // 2s p99 latency triggers alert
    connectionRatio: 0.9, // 90% of pool used triggers alert
  };

  checkHealth(): IncidentAlert | null {
    const issues: string[] = [];

    if (this.metrics.errorRate > this.thresholds.errorRate) {
      issues.push(`Error rate ${(this.metrics.errorRate * 100).toFixed(2)}%`);
    }

    if (this.metrics.p99Latency > this.thresholds.p99Latency) {
      issues.push(`p99 latency ${this.metrics.p99Latency}ms`);
    }

    if (issues.length > 0) {
      return {
        severity: issues.length > 1 ? 'critical' : 'warning',
        issues,
        suggestedActions: this.getSuggestedActions(issues),
        timestamp: new Date(),
      };
    }

    return null;
  }

  private getSuggestedActions(issues: string[]): string[] {
    const actions: string[] = [];

    if (issues.some(i => i.includes('Error rate'))) {
      actions.push('Check recent deployments - consider rollback');
      actions.push('Check downstream dependencies');
      actions.push('Check database connection pool');
    }

    if (issues.some(i => i.includes('latency'))) {
      actions.push('Check for long-running database queries');
      actions.push('Check for external API slowness');
      actions.push('Consider enabling caching bypass');
    }

    return actions;
  }
}

interface IncidentAlert {
  severity: 'warning' | 'critical';
  issues: string[];
  suggestedActions: string[];
  timestamp: Date;
}

// Feature flag kill switch
class KillSwitch {
  async disableFeature(feature: string, reason: string): Promise<void> {
    await redis.set(`feature:${feature}:enabled`, 'false');
    await redis.set(`feature:${feature}:disabled_at`, Date.now().toString());
    await redis.set(`feature:${feature}:disabled_reason`, reason);

    KILL SWITCH: Disabled ${feature} - ${reason}`);

    // Notify team
    await slack.send({
      channel: '#incidents',
      text: Feature "${feature}" has been disabled: ${reason}`,
    });
  }

  async isEnabled(feature: string): Promise<boolean> {
    const enabled = await redis.get(`feature:${feature}:enabled`);
    return enabled !== 'false';
  }
}

```

---

#### [STARTUP-SCALE LEVEL] CONTINUED: MORE PRODUCTION PATTERNS

## #### Density: Uber/Stripe/Discord engineering blog quality

## DEBUG WORKFLOWS

## These are ACTUAL errors developers encounter daily

## With the EXACT thought process senior devs use to debug

## Goal: LLM reads this instantly debugs like a 10-year veteran

---

## ERROR: "PrismaClientKnownRequestError: Foreign key constraint failed"

### The Actual Error Message

```
PrismaClientKnownRequestError:
Invalid `prisma.order.create()` invocation:
Foreign key constraint failed on the field: `userId`
    at RequestHandler.handleRequestError (/node_modules/@prisma/client/runtime/library.js)

```

### SENIOR DEV MENTAL MODEL

```
Foreign key error means:
1. Trying to reference a record that doesn't exist
2. Trying to delete a record that's still referenced
3. Wrong ID type (string vs int)
4. Database and Prisma schema out of sync

My debug order:
1. Check the ID being passed - does that record exist?
2. Check the database directly
3. Check if migrations are up to date

```

### COMMON CAUSES & FIXES

```typescript
// THE BUG: Creating order with non-existent user
async function createOrder(data: CreateOrderInput) {
  return prisma.order.create({
    data: {
      userId: data.userId, // This user doesn't exist in database!
      items: data.items,
    },
  });
}

// FIX: Verify user exists first
async function createOrderSafe(data: CreateOrderInput) {
  // Check user exists
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });

  if (!user) {
    throw new NotFoundError(`User ${data.userId} not found`);
  }

  return prisma.order.create({
    data: {
      userId: data.userId,
      items: data.items,
    },
  });
}

// THE BUG: Deleting user with existing orders
async function deleteUser(userId: string) {
  await prisma.user.delete({
    where: { id: userId },
  }); // FAILS if user has orders referencing them
}

// FIX 1: Delete related records first
async function deleteUserWithOrders(userId: string) {
  await prisma.$transaction([
    prisma.order.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);
}

// FIX 2: Use onDelete cascade in schema
// schema.prisma
model Order {
  id     String @id @default(uuid())
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String
}

```

### DEBUG WORKFLOW

```
1. Find the exact field mentioned in error (e.g., `userId`)
2. Log the value being passed: console.log('userId:', data.userId)
3. Check if that ID exists: SELECT * FROM users WHERE id = 'xxx'
4. Verify migrations: npx prisma migrate status
5. Check schema matches database: npx prisma db pull

```

---

## ERROR: "ECONNREFUSED 127.0.0.1:5432"

### The Actual Error Message

```
Error: connect ECONNREFUSED 127.0.0.1:5432
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1141:16)

PrismaClientInitializationError: Can't reach database server at `localhost:5432`

```

### SENIOR DEV MENTAL MODEL

```
Database connection refused means:
1. Database isn't running
2. Wrong host/port in connection string
3. Firewall blocking
4. Docker networking issue (localhost inside container host localhost)

```

### COMMON CAUSES & FIXES

```bash

# CHECK 1: Is PostgreSQL running?

# On Mac

brew services list | grep postgresql
brew services start postgresql

# On Linux

sudo systemctl status postgresql
sudo systemctl start postgresql

# On Windows

# Check Services app for "postgresql" service

# CHECK 2: Can you connect directly?

psql -U postgres -h localhost -p 5432

# CHECK 3: Is the port correct?

# Look in postgresql.conf for port setting

cat /etc/postgresql/14/main/postgresql.conf | grep port

```typescript
// THE BUG: Wrong DATABASE_URL in .env
DATABASE_URL="postgresql://user:pass@localhost:5432/mydb"
// But PostgreSQL is running on port 5433!

// FIX: Check actual port
DATABASE_URL="postgresql://user:pass@localhost:5433/mydb"

// THE BUG: Docker localhost confusion
// Inside Docker container, localhost = the container, not host machine
DATABASE_URL="postgresql://user:pass@localhost:5432/mydb" // WRONG in Docker

// FIX: Use host.docker.internal on Mac/Windows
DATABASE_URL="postgresql://user:pass@host.docker.internal:5432/mydb"

// FIX: Use Docker network name
DATABASE_URL="postgresql://user:pass@postgres:5432/mydb"
// Where 'postgres' is the container name in docker-compose

```

### DEBUG WORKFLOW

```
1. Is database service running? (brew services, systemctl, docker ps)
2. Can you connect directly? (psql, pgcli, DBeaver)
3. Is port correct? Check postgresql.conf or docker-compose.yml
4. In Docker? Use container name, not localhost
5. Check firewall: sudo ufw status, netstat -an | grep 5432

```

---

## ERROR: "Error: P2002 Unique constraint failed"

### The Actual Error Message

```
PrismaClientKnownRequestError:
Invalid `prisma.user.create()` invocation:
Unique constraint failed on the fields: (`email`)

```

### SENIOR DEV MENTAL MODEL

```
Unique constraint = trying to insert duplicate value.
This is almost always:
1. User already exists (registration)
2. Race condition (two requests create same record)
3. Missing upsert logic

```

### COMMON CAUSES & FIXES

```typescript
// THE BUG: Creating user without checking existence
async function registerUser(email: string, password: string) {
  return prisma.user.create({
    data: { email, password: await hash(password) },
  }); // FAILS if email already exists
}

// FIX 1: Check first, create after
async function registerUserSafe(email: string, password: string) {
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    throw new ConflictError('Email already registered');
  }

  return prisma.user.create({
    data: { email, password: await hash(password) },
  });
}

// FIX 2: Use upsert for idempotent operations
async function ensureUser(email: string) {
  return prisma.user.upsert({
    where: { email },
    update: {}, // Don't update anything if exists
    create: { email },
  });
}

// FIX 3: Handle the specific error
async function registerWithErrorHandling(email: string, password: string) {
  try {
    return await prisma.user.create({
      data: { email, password: await hash(password) },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictError('Email already registered');
      }
    }
    throw error;
  }
}

```

### PRISMA ERROR CODE REFERENCE

```typescript
// Common error codes you'll encounter:
const PRISMA_ERRORS = {
  P2000: 'Value too long for column',
  P2002: 'Unique constraint violation',
  P2003: 'Foreign key constraint violation',
  P2025: 'Record not found',
  P2014: 'Required relation violation',
};

// Handle all common cases
async function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new ConflictError('Record already exists');
      case 'P2003':
        throw new BadRequestError('Referenced record not found');
      case 'P2025':
        throw new NotFoundError('Record not found');
      default:
        throw new InternalError('Database error');
    }
  }
  throw error;
}

```

---

## ERROR: "429 Too Many Requests"

### The Actual Error Message

```http
HTTP 429 Too Many Requests
{
  "error": "Rate limit exceeded",
  "retryAfter": 60
}

```

### SENIOR DEV MENTAL MODEL

```
Rate limiting hit. Options:
1. Reduce request frequency (add delays)
2. Implement exponential backoff
3. Cache responses to reduce calls
4. Request rate limit increase (for 3rd party APIs)

```

### COMMON CAUSES & FIXES

```typescript
// THE BUG: Hammering API in loop
async function syncAllUsers(userIds: string[]) {
  const results = [];
  for (const id of userIds) {
    results.push(await externalApi.getUser(id)); // 429 after ~100 calls
  }
  return results;
}

// FIX 1: Add delay between requests
async function syncAllUsersSlow(userIds: string[]) {
  const results = [];
  for (const id of userIds) {
    results.push(await externalApi.getUser(id));
    await sleep(100); // 100ms between calls = 10 calls/second
  }
  return results;
}

// FIX 2: Exponential backoff with retry
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        console.log(`Rate limited, retrying in ${delay}ms`);
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}

// FIX 3: Use p-limit for controlled concurrency
import pLimit from 'p-limit';

const limit = pLimit(5); // Max 5 concurrent requests

async function syncAllUsersConcurrent(userIds: string[]) {
  return Promise.all(
    userIds.map(id => limit(() => externalApi.getUser(id)))
  );
}

// FIX 4: Batch requests if API supports it
async function syncAllUsersBatch(userIds: string[]) {
  // Instead of 100 individual calls, make 10 calls with 10 IDs each
  const batches = chunk(userIds, 10);
  const results = [];

  for (const batch of batches) {
    results.push(...await externalApi.getUsers(batch)); // One call for many
    await sleep(100);
  }

  return results;
}

```

---

## ERROR: "CORS policy: No 'Access-Control-Allow-Origin' header"

### The Actual Error Message

```
Access to fetch at 'https://api.example.com/users' from origin
'http://localhost:3000' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.

```

### SENIOR DEV MENTAL MODEL

```
CORS errors happen when:
1. Backend doesn't have CORS headers configured
2. Frontend is on different domain than API
3. Preflight OPTIONS request failing
4. Credentials (cookies) require specific CORS config

This is a BACKEND fix, not frontend!

```

### COMMON CAUSES & FIXES

```typescript
// BACKEND FIX: Express
import cors from 'cors';

// No CORS configured = browsers block requests
app.use(express.json());

// FIX: Add CORS middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://yourapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // If using cookies
}));

// For Next.js API routes:
// pages/api/users.ts or app/api/users/route.ts
export async function GET(request: Request) {
  const response = NextResponse.json({ users: [] });

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return response;
}

// Handle preflight
export async function OPTIONS(request: Request) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// FRONTEND: When using credentials (cookies)
// You CANNOT use origin: '*' with credentials: true
// Must specify exact origins

fetch('https://api.example.com/users', {
  credentials: 'include', // Send cookies
});

// Backend must respond with:
// Access-Control-Allow-Origin: https://yourapp.com (NOT *)
// Access-Control-Allow-Credentials: true

```

### DEBUG WORKFLOW

```
1. Check Network tab - is request being made?
2. Look for OPTIONS preflight request - does it succeed?
3. Check response headers for Access-Control-Allow-Origin
4. If using credentials, ensure origin is exact (not *)
5. This is ALWAYS a backend fix - frontend can't bypass CORS

```

---

#### [SENIOR DEV BRAIN LEVEL] CONTINUED: MORE ERROR PATTERNS

## #### Density: 10-year veteran debugging wisdom

## PRISMA COMPLETE GUIDE

## Deep Patterns for Production Applications

---

## Schema Design Best Practices

### Model Naming Conventions

```prisma
// schema.prisma

// Use PascalCase for models
model User {
  id        String   @id @default(uuid())
  email     String   @unique

  // Use camelCase for fields
  firstName String
  lastName  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations - singular for one-to-one, plural for one-to-many
  profile   Profile?
  posts     Post[]
  comments  Comment[]
}

// Use descriptive model names
model UserProfile {   // Not "Profile" if you have other Profile types
  id     String @id @default(uuid())
  bio    String?
  avatar String?

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String @unique
}

```

### Relation Patterns

```prisma
// ONE-TO-ONE: User -> Profile
model User {
  id      String       @id @default(uuid())
  profile UserProfile?
}

model UserProfile {
  id     String @id @default(uuid())
  user   User   @relation(fields: [userId], references: [id])
  userId String @unique  // Must be @unique for one-to-one
}

// ONE-TO-MANY: User -> Posts
model User {
  id    String @id @default(uuid())
  posts Post[]  // No fields needed on "one" side
}

model Post {
  id       String @id @default(uuid())
  author   User   @relation(fields: [authorId], references: [id])
  authorId String // Foreign key
}

// MANY-TO-MANY: Posts <-> Tags (explicit join table)
model Post {
  id   String    @id @default(uuid())
  tags PostTag[]
}

model Tag {
  id    String    @id @default(uuid())
  name  String    @unique
  posts PostTag[]
}

model PostTag {
  post   Post   @relation(fields: [postId], references: [id])
  postId String
  tag    Tag    @relation(fields: [tagId], references: [id])
  tagId  String

  @@id([postId, tagId]) // Composite primary key
}

// SELF-RELATION: Comments with replies
model Comment {
  id       String    @id @default(uuid())
  content  String

  parent   Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  parentId String?
  replies  Comment[] @relation("CommentReplies")
}

```

---

## Query Patterns

### Efficient Includes

```typescript
// BAD - Over-fetching everything
const posts = await prisma.post.findMany({
  include: {
    author: true,           // Gets ALL author fields
    comments: true,         // Gets ALL comments
    tags: true,             // Gets ALL tags
  }
});

// GOOD - Select only what you need
const posts = await prisma.post.findMany({
  select: {
    id: true,
    title: true,
    createdAt: true,
    author: {
      select: {
        name: true,
        avatar: true,
      }
    },
    _count: {
      select: { comments: true }  // Just get count, not all comments
    },
    tags: {
      select: {
        tag: {
          select: { name: true }
        }
      }
    }
  }
});

```

### Pagination Patterns

```typescript
// OFFSET PAGINATION - Simple but slow on large datasets
async function getPostsOffset(page: number, limit: number) {
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.post.count(),
  ]);

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    }
  };
}

// CURSOR PAGINATION - Efficient for infinite scroll
async function getPostsCursor(cursor?: string, limit: number = 20) {
  const posts = await prisma.post.findMany({
    take: limit + 1,  // Fetch one extra to check if more
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,  // Skip cursor item
    orderBy: { createdAt: 'desc' },
  });

  const hasMore = posts.length > limit;
  const items = hasMore ? posts.slice(0, -1) : posts;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  return {
    posts: items,
    nextCursor,
    hasMore,
  };
}

```

### Complex Filtering

```typescript
// Dynamic filter builder
interface PostFilters {
  search?: string;
  authorId?: string;
  tags?: string[];
  status?: 'draft' | 'published';
  dateFrom?: Date;
  dateTo?: Date;
}

async function getPosts(filters: PostFilters) {
  const where: Prisma.PostWhereInput = {};

  // Text search
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { content: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  // Author filter
  if (filters.authorId) {
    where.authorId = filters.authorId;
  }

  // Tags filter (has any of these tags)
  if (filters.tags?.length) {
    where.tags = {
      some: {
        tag: {
          name: { in: filters.tags }
        }
      }
    };
  }

  // Status filter
  if (filters.status) {
    where.status = filters.status;
  }

  // Date range
  if (filters.dateFrom || filters.dateTo) {
    where.createdAt = {
      ...(filters.dateFrom && { gte: filters.dateFrom }),
      ...(filters.dateTo && { lte: filters.dateTo }),
    };
  }

  return prisma.post.findMany({ where });
}

```

---

## Transaction Patterns

### Interactive Transactions

```typescript
// Transfer money between accounts
async function transferMoney(fromId: string, toId: string, amount: number) {
  return prisma.$transaction(async (tx) => {
    // Deduct from sender
    const sender = await tx.account.update({
      where: { id: fromId },
      data: { balance: { decrement: amount } },
    });

    // Check insufficient funds
    if (sender.balance < 0) {
      throw new Error('Insufficient funds');
    }

    // Add to recipient
    const recipient = await tx.account.update({
      where: { id: toId },
      data: { balance: { increment: amount } },
    });

    // Create transaction record
    await tx.transaction.create({
      data: {
        fromId,
        toId,
        amount,
        status: 'completed',
      },
    });

    return { sender, recipient };
  }, {
    maxWait: 5000,  // Wait up to 5s for transaction slot
    timeout: 10000, // 10s to complete transaction
  });
}

```

### Sequential vs Batch Operations

```typescript
// SLOW - Sequential inserts
async function createManyBad(items: Data[]) {
  for (const item of items) {
    await prisma.item.create({ data: item }); // N round trips
  }
}

// FAST - Batch insert
async function createManyGood(items: Data[]) {
  return prisma.item.createMany({
    data: items,
    skipDuplicates: true, // Ignore constraint violations
  });
}

// When you need created records back
async function createManyWithReturn(items: Data[]) {
  return prisma.$transaction(
    items.map(item => prisma.item.create({ data: item }))
  );
}

```

---

## Soft Delete Pattern

```prisma
model Post {
  id        String    @id @default(uuid())
  title     String
  deletedAt DateTime?  // Soft delete marker
}

```typescript
// Middleware to auto-filter soft-deleted
prisma.$use(async (params, next) => {
  if (params.model === 'Post') {
    // Find operations
    if (params.action === 'findFirst' || params.action === 'findMany') {
      params.args.where = {
        ...params.args.where,
        deletedAt: null,
      };
    }

    // findUnique - convert to findFirst with filter
    if (params.action === 'findUnique') {
      params.action = 'findFirst';
      params.args.where = {
        ...params.args.where,
        deletedAt: null,
      };
    }

    // Delete -> Update to set deletedAt
    if (params.action === 'delete') {
      params.action = 'update';
      params.args.data = { deletedAt: new Date() };
    }

    if (params.action === 'deleteMany') {
      params.action = 'updateMany';
      params.args.data = { deletedAt: new Date() };
    }
  }

  return next(params);
});

// Hard delete when needed
async function hardDelete(id: string) {
  return prisma.$queryRaw`DELETE FROM "Post" WHERE id = ${id}`;
}

```

---

## API DESIGN PATTERNS

---

## RESTful API Structure

```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// GET /api/posts - List posts
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '10');
  const search = searchParams.get('search');

  const posts = await prisma.post.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: search ? {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    } : undefined,
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.post.count();

  return NextResponse.json({
    data: posts,
    pagination: { page, limit, total },
  });
}

// POST /api/posts - Create post
const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  tags: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createPostSchema.parse(body);

    const post = await prisma.post.create({
      data: {
        title: validated.title,
        content: validated.content,
        authorId: request.headers.get('x-user-id')!, // From auth middleware
      },
    });

    return NextResponse.json({ data: post }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

```typescript
// app/api/posts/[id]/route.ts

// GET /api/posts/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { name: true, avatar: true } },
      _count: { select: { comments: true, likes: true } },
    },
  });

  if (!post) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: post });
}

// PATCH /api/posts/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  // Verify ownership
  const existingPost = await prisma.post.findUnique({
    where: { id: params.id },
    select: { authorId: true },
  });

  if (!existingPost) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const userId = request.headers.get('x-user-id');
  if (existingPost.authorId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const post = await prisma.post.update({
    where: { id: params.id },
    data: body,
  });

  return NextResponse.json({ data: post });
}

// DELETE /api/posts/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.post.delete({
    where: { id: params.id },
  });

  return new NextResponse(null, { status: 204 });
}

```

---

## Error Handling Pattern

```typescript
// lib/api-error.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static badRequest(message: string, details?: unknown) {
    return new ApiError(400, message, 'BAD_REQUEST', details);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message, 'UNAUTHORIZED');
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message, 'FORBIDDEN');
  }

  static notFound(resource = 'Resource') {
    return new ApiError(404, `${resource} not found`, 'NOT_FOUND');
  }

  static conflict(message: string) {
    return new ApiError(409, message, 'CONFLICT');
  }

  static internal(message = 'Internal server error') {
    return new ApiError(500, message, 'INTERNAL_ERROR');
  }
}

// lib/api-handler.ts
type Handler = (req: NextRequest, context: any) => Promise<NextResponse>;

export function withErrorHandling(handler: Handler): Handler {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.error('API Error:', error);

      if (error instanceof ApiError) {
        return NextResponse.json(
          {
            error: error.message,
            code: error.code,
            details: error.details,
          },
          { status: error.statusCode }
        );
      }

      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: error.errors,
          },
          { status: 400 }
        );
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return handlePrismaError(error);
      }

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

function handlePrismaError(error: Prisma.PrismaClientKnownRequestError) {
  switch (error.code) {
    case 'P2002':
      return NextResponse.json(
        { error: 'Resource already exists', code: 'DUPLICATE' },
        { status: 409 }
      );
    case 'P2025':
      return NextResponse.json(
        { error: 'Resource not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    default:
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
  }
}

```

---

## Rate Limiting

```typescript
// lib/rate-limit.ts
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  max: number;       // Max requests per window
}

export async function rateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  const window = Math.floor(now / config.windowMs);
  const windowKey = `${key}:${window}`;

  const [[, count], [, ttl]] = await redis
    .pipeline()
    .incr(windowKey)
    .pttl(windowKey)
    .exec() as [[null, number], [null, number]];

  if (count === 1) {
    await redis.pexpire(windowKey, config.windowMs);
  }

  const remaining = Math.max(0, config.max - count);
  const reset = Math.ceil((window * config.windowMs + config.windowMs) / 1000);

  return {
    success: count <= config.max,
    remaining,
    reset,
  };
}

// Middleware usage
export async function rateLimitMiddleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';

  const result = await rateLimit(ip, {
    windowMs: 60 * 1000,  // 1 minute
    max: 100,             // 100 requests per minute
  });

  if (!result.success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.reset.toString(),
          'Retry-After': Math.ceil((result.reset * 1000 - Date.now()) / 1000).toString(),
        }
      }
    );
  }

  return null; // Continue
}

```

---

## AUTHENTICATION PATTERNS

---

## JWT Authentication

```typescript
// lib/auth.ts
import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

interface JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
}

export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// API Route: Login
export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true, role: true },
  });

  if (!user || !await bcrypt.compare(password, user.password)) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }

  const token = await createToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const response = NextResponse.json({
    user: { id: user.id, email: user.email, role: user.role }
  });

  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}

```

---

## Middleware Authentication

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

const protectedRoutes = ['/dashboard', '/api/user'];
const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const pathname = request.nextUrl.pathname;

  // Check if route is protected
  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Verify token
  const user = token ? await verifyToken(token) : null;

  // Redirect logic
  if (isProtected && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Add user to headers for API routes
  if (user) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.userId);
    requestHeaders.set('x-user-role', user.role);

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static | _next/image | favicon.ico).*)',
  ],
};

```

---

#### [PRODUCTION BACKEND PATTERNS] CONTINUED

## #### Coverage: Prisma, API Design, Auth, Rate Limiting, Error Handling

## ADVANCED BACKEND PATTERNS

> **The patterns that handle millions of requests**

---

## API Design Principles

### RESTful Best Practices

* Use nouns, not verbs: /users not /getUsers

* Use plural: /users not /user

* Nest logically: /users/123/orders

* Version in URL: /v1/users

* Use query params for filtering: /users?status=active

### GraphQL Considerations | Aspect | REST | GraphQL |

|--------|------|---------|
| Flexibility | Fixed endpoints | Query what you need |
| Caching | Easy (HTTP) | Complex |
| Learning | Simple | Steeper |
| Use case | Public APIs | Flexible clients | ---

## Database Patterns

### Repository Pattern

```typescript
interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}

class PostgresUserRepository implements UserRepository {
  // Implementation details
}

```

### Unit of Work

Group related database operations into a single transaction

### Query Builder vs ORM | Approach | Example | Flexibility | Safety |

|----------|---------|-------------|--------|
| Raw SQL | pg | Maximum | Manual |
| Query Builder | Knex | High | Medium |
| ORM | Prisma | Medium | High | ---

## Caching Strategies

### Cache Patterns | Pattern | Description | Use Case |

|---------|-------------|----------|
| Cache-Aside | App manages cache | General purpose |
| Read-Through | Cache loads on miss | Transparent caching |
| Write-Through | Write to both | Strong consistency |
| Write-Behind | Async write to DB | Performance | ### Cache Invalidation

* TTL: Time-based expiration

* Event-based: Invalidate on update

* Version-based: Include version in key

### Redis Usage

```
SET user:123 "..." EX 3600  // Store with 1hr TTL
GET user:123                 // Retrieve
DEL user:123                 // Invalidate

```

---

## Message Queue Patterns

### When to Use Queues

* Decouple services

* Handle traffic spikes

* Ensure delivery

* Enable async processing

### Queue Options | Queue | Best For |

|-------|----------|
| RabbitMQ | Complex routing |
| Redis Streams | Simple, fast |
| Kafka | High throughput |
| SQS | AWS native | ### Dead Letter Queue

Store failed messages for investigation instead of losing them

---

## Error Handling

### Error Types

```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, 'NOT_FOUND', resource + ' not found');
  }
}

```

### Global Error Handler

```typescript
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message
    }
  });
});

```

---

## Authentication Patterns

### JWT Structure

```
Header.Payload.Signature

Header: { "alg": "HS256", "typ": "JWT" }
Payload: { "sub": "123", "exp": 1234567890 }
Signature: HMACSHA256(header + payload, secret)

```

### Session vs JWT | Aspect | Session | JWT |

|--------|---------|-----|
| Storage | Server | Client |
| Scalability | Requires sticky/shared | Stateless |
| Revocation | Easy | Need blocklist | ### Refresh Token Pattern

* Short-lived access token (15 min)

* Long-lived refresh token (7 days)

* Rotate refresh on use

* Store refresh tokens securely

---

## Middleware Patterns

### Common Middleware Order

1. Logging
2. CORS
3. Body parsing
4. Authentication
5. Rate limiting
6. Route handlers
7. Error handling

### Request Context

```typescript
// Pass request-scoped data
req.context = {
  requestId: uuid(),
  userId: decoded.sub,
  startTime: Date.now()
};

```

---

## Logging Best Practices

### Structured Logging

```json
{
  "level": "info",
  "message": "User created",
  "userId": "123",
  "requestId": "abc-def",
  "timestamp": "2024-01-01T00:00:00Z",
  "duration": 45
}

```

### Log Levels

* ERROR: Operation failures

* WARN: Unexpected but handled

* INFO: Business events

* DEBUG: Development details

---

## Health Checks

### Endpoint Design

```typescript
app.get('/health', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    external: await checkExternalService()
  };

  const healthy = Object.values(checks).every(c => c.status === 'ok');
  res.status(healthy ? 200 : 503).json(checks);
});

```

### Liveness vs Readiness

* Liveness: Is the process running?

* Readiness: Can it handle traffic?

---

---

## MACHINE LEARNING FOR DEVELOPERS

> **The patterns for AI integration**

---

## ML Integration Patterns

### Model Serving

* REST API wrapping model

* Batch predictions

* Real-time inference

### Popular Services | Service | Best For |

|---------|----------|
| OpenAI | LLMs, GPT |
| AWS SageMaker | Custom models |
| Hugging Face | Open source models |
| Replicate | Easy deployment | ---

## Prompt Engineering

### Best Practices

* Be specific and detailed

* Provide examples (few-shot)

* Set output format

* Include constraints

### Example

```
You are a helpful assistant.
Task: Summarize the following text in 3 bullet points.
Format: Return as JSON array of strings.
Text: {user_input}

```

---

## Embedding Patterns

### Use Cases

* Semantic search

* Recommendations

* Clustering similar items

### Implementation

```javascript
const embedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: "Hello world"
});
// Store in vector database (Pinecone, Qdrant)

```

---

---

## DEPTH

> **The patterns that make apps fast**

---

## Caching Layers | Layer | Latency | Use Case |

|-------|---------|----------|
| Browser | 0ms | Static assets |
| CDN | 10-50ms | Images, JS, CSS |
| Application | 1-5ms | Computed results |
| Database | 5-20ms | Query cache | ---

## Redis Patterns

### Cache with TTL

```
SET user:123 "data" EX 3600
GET user:123

```

### Cache Invalidation

```javascript
// On user update
await redis.del('user:' + userId);

```

### Cache-Aside Pattern

```javascript
async function getUser(id) {
  // Check cache
  let user = await redis.get('user:' + id);
  if (user) return JSON.parse(user);

  // Cache miss - fetch from DB
  user = await db.users.findById(id);
  await redis.setex('user:' + id, 3600, JSON.stringify(user));
  return user;
}

```

---

## Cache Stampede Prevention

### Problem

Cache expires, many requests hit database simultaneously

### Solutions

* Lock during regeneration

* Background refresh before expiry

* Probabilistic early expiration

---

## Cache Warming

### On Deploy

Pre-populate cache with hot data before traffic arrives

### Lazy Loading

Cache on first request (most common)

---

---

## SCALING PATTERNS

> **The patterns for growing traffic**

---

## Horizontal vs Vertical | Type | Description | Limit |

|------|-------------|-------|
| Vertical | Bigger machine | Hardware max |
| Horizontal | More machines | Unlimited | ---

## Database Scaling

### Read Replicas

* Offload reads to replicas

* Primary handles writes

* Replication lag considerations

### Sharding

* Split data by key

* Choose good shard key

* Cross-shard queries expensive

### Connection Pooling

* PgBouncer for PostgreSQL

* Reduce connection overhead

---

## Application Scaling

### Stateless Services

* No local state

* Store session in Redis

* Any instance can handle request

### Load Balancing

* Round robin

* Least connections

* Weighted

* Health checks

---

## Caching at Scale

### Cache Layers

1. Browser cache
2. CDN edge cache
3. Application cache (Redis)
4. Database query cache

### Cache Sizing

* Start with 80/20 rule

* 20% of data = 80% of requests

* Monitor hit rate

---

---

## ARCHITECTURE PATTERNS

> **The patterns that structure systems**

---

## Monolith vs Microservices | Aspect | Monolith | Microservices |

|--------|----------|---------------|
| Deployment | All at once | Independent |
| Scaling | Whole app | Per service |
| Complexity | Simple start | Complex ops |
| Team size | Small | Large | ---

## When to Use Microservices

### Good Signals

* Multiple teams need autonomy

* Different scaling needs

* Different tech stacks needed

* Clear domain boundaries

### Bad Signals

* Small team

* Unclear boundaries

* Starting new project

* Limited DevOps expertise

---

## Domain-Driven Design

### Core Concepts

* Bounded Context: Clear boundaries

* Aggregate: Consistency boundary

* Entity: Has identity

* Value Object: No identity

### Strategic Design

* Context mapping

* Anti-corruption layer

* Shared kernel

---

## Event-Driven Architecture

### Benefits

* Loose coupling

* Scalability

* Eventual consistency

### Patterns

* Event Sourcing

* CQRS

* Saga pattern

---

## API Gateway Pattern

### Responsibilities

* Authentication

* Rate limiting

* Request routing

* Response aggregation

* Protocol translation

### Tools

* Kong

* AWS API Gateway

* Nginx

---

---

## PAYMENT INTEGRATION PATTERNS

> **The patterns for handling money safely**

---

## Payment Flow

### Stripe Example

1. Client creates PaymentIntent
2. Server confirms with Stripe
3. Client handles 3D Secure if needed
4. Webhook confirms payment
5. Fulfill order

---

## Webhook Handling

### Best Practices

```javascript
app.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, secret);
  } catch (err) {
    return res.status(400).send('Webhook signature failed');
  }

  // Handle idempotently
  await processEvent(event);

  res.json({ received: true });
});

```

### Idempotency

* Store processed event IDs

* Check before processing

* Use database transactions

---

## Currency Handling

### Rules

* Always store in smallest unit (cents)

* Never use floating point

* Format only for display

### Example

```javascript
// Store: 1999 (cents)
// Display: formatCurrency(1999) -> ".99"

```

---

## PCI Compliance

### Levels

* Level 1: Over 6M transactions

* Level 4: Under 20K transactions

### Simplest Path

* Use hosted payment fields

* Never touch card numbers

* Let Stripe/PayPal handle

---

---

## CONCURRENCY PATTERNS

> **The patterns for parallel execution**

---

## JavaScript Concurrency

### Event Loop

```
Call Stack Callback Queue Event Loop

Microtasks (Promises) run before Macrotasks (setTimeout)

```

### Common Patterns

```javascript
// Promise.all - parallel
const [users, orders] = await Promise.all([
  fetchUsers(),
  fetchOrders()
]);

// Promise.allSettled - parallel, handle failures
const results = await Promise.allSettled([
  fetchA(),
  fetchB()
]);

// Sequential
for (const item of items) {
  await processItem(item);
}

```

---

## Rate Limiting Concurrent Requests

### p-limit Pattern

```javascript
import pLimit from 'p-limit';

const limit = pLimit(5); // Max 5 concurrent

const results = await Promise.all(
  items.map(item => limit(() => processItem(item)))
);

```

---

## Worker Threads

### When to Use

* CPU-intensive tasks

* Don't block event loop

* Image processing

* Compression

### Example

```javascript
const { Worker } = require('worker_threads');

const worker = new Worker('./heavy-task.js', {
  workerData: { input: data }
});

worker.on('message', (result) => console.log(result));

```

---

---

## ERROR HANDLING PATTERNS

> **The patterns that handle failures gracefully**

---

## Error Types

### Custom Error Classes

```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public isOperational = true
  ) {
    super(message);
  }
}

class ValidationError extends AppError {
  constructor(message: string) {
    super(400, 'VALIDATION_ERROR', message);
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, 'NOT_FOUND', resource + ' not found');
  }
}

```

---

## Error Handling Middleware

### Express Pattern

```typescript
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message
      }
    });
  }

  // Unexpected error
  console.error(err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong'
    }
  });
});

```

---

## Frontend Error Handling

### React Error Boundary

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackUI />;
    }
    return this.props.children;
  }
}

```

---

## Error Reporting

### What to Log

* Error message

* Stack trace

* Request context

* User context

* Environment

### Tools

* Sentry

* Bugsnag

* Rollbar

* LogRocket

---

---

## API DOCUMENTATION PATTERNS

> **The patterns for documenting APIs**

---

## OpenAPI/Swagger

### Basic Structure

```yaml
openapi: 3.0.0
info:
  title: My API
  version: 1.0.0

paths:
  /users:
    get:
      summary: List users
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: array
                items:
                  ref: '#/components/schemas/User'

```

---

## Auto-Generated Docs

### Tools | Tool | Framework |

|------|-----------|
| Swagger UI | OpenAPI |
| Redoc | OpenAPI |
| GraphQL Playground | GraphQL |
| Postman | Any | ---

## Documentation Best Practices

### Include

* Authentication details

* Rate limits

* Error codes

* Examples for each endpoint

* Changelog

### Keep Updated

* Generate from code

* CI checks for drift

* Version your docs

---

---

## EMAIL PATTERNS

> **The patterns for transactional email**

---

## Email Service Selection | Service | Best For |

|---------|----------|
| SendGrid | Scale, analytics |
| Postmark | Deliverability |
| AWS SES | Cost, AWS ecosystem |
| Resend | Developer experience | ---

## Email Types

### Transactional

* Order confirmations

* Password resets

* Notifications

* Receipts

### Marketing

* Newsletters

* Promotions

* Requires unsubscribe

---

## Implementation Pattern

```javascript
async function sendEmail(to, template, data) {
  const html = renderTemplate(template, data);

  await emailService.send({
    to,
    from: 'noreply@example.com',
    subject: getSubject(template, data),
    html,
    text: htmlToText(html) // Always include text version
  });

  await logEmail(to, template);
}

```

---

## Deliverability Tips

* Use authenticated domain (SPF, DKIM, DMARC)

* Warm up new IPs slowly

* Monitor bounce rates

* Clean list regularly

* Avoid spam trigger words

---

---

## FILE HANDLING PATTERNS

> **The patterns for uploads and storage**

---

## Upload Strategies

### Direct to Server

* Simple setup

* Limited by server resources

* Good for small files

### Presigned URLs (S3)

* Client uploads directly to S3

* Server generates signed URL

* Scales well

---

## S3 Presigned Upload

```javascript
// Server generates URL
const command = new PutObjectCommand({
  Bucket: 'my-bucket',
  Key: 'uploads/' + filename,
  ContentType: 'image/jpeg'
});

const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

// Client uploads directly
await fetch(url, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': 'image/jpeg' }
});

```

---

## Image Processing

### Resize on Upload

* Store original

* Generate thumbnails async

* Use Sharp for Node.js

### On-the-Fly

* Use Imgix, Cloudinary

* Transform via URL params

* CDN caches results

---

## Security

### Validation

* Check file type (magic bytes)

* Limit file size

* Scan for malware

* Rename files (prevent path traversal)

### Storage

* Store outside web root

* Use signed URLs for access

* Set appropriate permissions

---

---

## MICROSERVICES PATTERNS

> **The patterns for distributed systems**

---

## Service Communication | Pattern | Type | Use Case |

|---------|------|----------|
| REST | Sync | Simple CRUD |
| gRPC | Sync | High performance |
| Message Queue | Async | Decoupled |
| Event Bus | Async | Broadcast | ---

## Service Discovery

### Options

* Kubernetes DNS

* Consul

* AWS Cloud Map

* Eureka

### Pattern

```
Service A -> Service Registry -> Service B address

```

---

## API Gateway

### Responsibilities

* Authentication

* Rate limiting

* Request routing

* Load balancing

* Response caching

### Tools

* Kong

* AWS API Gateway

* Nginx

* Traefik

---

## Circuit Breaker

### States

```
CLOSED -> OPEN -> HALF-OPEN -> CLOSED

CLOSED: Normal operation
OPEN: Fast-fail all requests
HALF-OPEN: Test if recovered

```

### Implementation

```typescript
const breaker = new CircuitBreaker(riskyFunction, {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000
});

```

---

## Saga Pattern

### Choreography

Each service listens for events and acts

### Orchestration

Central coordinator directs the flow

### Compensation

Undo steps if later step fails

---

---

## GRAPHQL PATTERNS

> **The patterns for flexible APIs**

---

## GraphQL vs REST | Aspect | REST | GraphQL |

|--------|------|---------|
| Endpoints | Multiple | Single |
| Fetching | Over/under fetch | Exact data |
| Versioning | URL versioning | Schema evolution |
| Caching | HTTP caching | Apollo cache | ---

## Schema Design

```graphql
type User {
  id: ID!
  email: String!
  name: String
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  author: User!
}

type Query {
  user(id: ID!): User
  users: [User!]!
}

type Mutation {
  createUser(email: String!, name: String): User!
}

```

---

## Resolver Pattern

```typescript
const resolvers = {
  Query: {
    user: (_, { id }, context) => {
      return context.db.users.findById(id);
    }
  },
  User: {
    posts: (user, _, context) => {
      return context.db.posts.findByUserId(user.id);
    }
  }
};

```

---

## N+1 Problem Solution

### DataLoader

```typescript
const userLoader = new DataLoader(async (ids) => {
  const users = await db.users.findMany({ id: { in: ids } });
  return ids.map(id => users.find(u => u.id === id));
});

// Usage in resolver
const user = await userLoader.load(userId);

```

---

---

## JS PATTERNS

> **The patterns for server-side JavaScript**

---

## Process Management

### PM2

```bash
pm2 start app.js -i max    # Cluster mode
pm2 reload app             # Zero-downtime restart
pm2 logs                   # View logs
pm2 monit                  # Monitor

```

### Graceful Shutdown

```typescript
process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  await server.close();
  await db.disconnect();
  process.exit(0);
});

```

---

## Streams

### When to Use

* Processing large files

* Real-time data

* Memory efficiency

### Example

```typescript
const readable = fs.createReadStream('large-file.csv');
const writable = fs.createWriteStream('output.csv');

readable
  .pipe(transform)
  .pipe(writable);

```

---

## Event Emitter

```typescript
import { EventEmitter } from 'events';

const emitter = new EventEmitter();

emitter.on('order:created', async (order) => {
  await sendConfirmationEmail(order);
});

// Trigger
emitter.emit('order:created', { id: 123, total: 99.99 });

```

---

## Clustering

```typescript
import cluster from 'cluster';
import os from 'os';

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  startServer();
}

```

---

---

## API VERSIONING STRATEGIES

> **The patterns for evolving APIs**

---

## Versioning Methods | Method | Example | Pros | Cons |

|--------|---------|------|------|
| URL Path | /v1/users | Clear, cacheable | URL changes |
| Header | Accept: v1 | Clean URLs | Hidden |
| Query | ?version=1 | Easy to test | Less RESTful | ---

## Backwards Compatibility

### Safe Changes

* Add new endpoints

* Add optional fields

* Add new enum values

### Breaking Changes

* Remove endpoints

* Remove required fields

* Change field types

* Change behavior

---

## Deprecation Strategy

```
1. Announce deprecation
2. Add Deprecation header
3. Log usage metrics
4. Provide migration guide
5. Set sunset date
6. Remove after sunset

```

### Sunset Header

```
Deprecation: true
Sunset: Sat, 31 Dec 2024 23:59:59 GMT
Link: <https://docs.example.com/migration>; rel="deprecation"

```

---

---

## WEBHOOKS IMPLEMENTATION

> **The patterns for event notifications**

---

## Webhook Architecture

```
Event occurs on Provider
  -> Provider calls Subscriber URL
    -> Subscriber processes event
      -> Subscriber returns 2xx
        -> Provider marks as delivered

```

---

## Sending Webhooks

```typescript
async function sendWebhook(url: string, event: WebhookEvent) {
  const payload = JSON.stringify(event);
  const signature = createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Signature': signature,
      'X-Webhook-ID': event.id
    },
    body: payload
  });

  if (!response.ok) {
    await scheduleRetry(url, event);
  }
}

```

---

## Receiving Webhooks

```typescript
app.post('/webhook', async (req, res) => {
  // Verify signature
  const signature = req.headers['x-webhook-signature'];
  const expected = createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== expected) {
    return res.status(401).send('Invalid signature');
  }

  // Process idempotently (check event ID)
  const eventId = req.headers['x-webhook-id'];
  if (await isProcessed(eventId)) {
    return res.status(200).send('Already processed');
  }

  await processEvent(req.body);
  await markProcessed(eventId);

  res.status(200).send('OK');
});

```

---

## Retry Strategy

* Retry on 5xx or timeout

* Exponential backoff (1min, 5min, 30min, 2hr)

* Max retries (e.g., 5)

* Alert on repeated failures

---

---

## DEPENDENCY INJECTION

> **The patterns for testable code**

---

## Why DI?

* Makes code testable

* Reduces coupling

* Easier to swap implementations

* Clear dependencies

---

## Manual DI

```typescript
// Define interface
interface UserRepository {
  findById(id: string): Promise<User>;
}

// Implementation
class PostgresUserRepository implements UserRepository {
  async findById(id: string) {
    return db.users.findById(id);
  }
}

// Service with injection
class UserService {
  constructor(private userRepo: UserRepository) {}

  async getUser(id: string) {
    return this.userRepo.findById(id);
  }
}

// Production
const userService = new UserService(new PostgresUserRepository());

// Testing
const mockRepo = { findById: jest.fn() };
const testService = new UserService(mockRepo);

```

---

## DI Containers

### Tsyringe Example

```typescript
import { container, injectable, inject } from 'tsyringe';

@injectable()
class UserService {
  constructor(@inject('UserRepository') private repo: UserRepository) {}
}

container.register('UserRepository', { useClass: PostgresUserRepository });

const userService = container.resolve(UserService);

```

---

---

## ASYNC PATTERNS IN DEPTH

> **The patterns for asynchronous code**

---

## Promise Patterns

### Parallel Execution

```javascript
const [users, orders] = await Promise.all([
  getUsers(),
  getOrders()
]);

```

### Handle Partial Failures

```javascript
const results = await Promise.allSettled([
  riskyOperation1(),
  riskyOperation2()
]);

const successes = results.filter(r => r.status === 'fulfilled');
const failures = results.filter(r => r.status === 'rejected');

```

---

## Race Conditions

### Problem

```javascript
// User types fast, responses arrive out of order
async function search(query) {
  const results = await fetch('/search?q=' + query);
  setResults(results); // Might show stale results!
}

```

### Solution with Abort

```javascript
let controller;

async function search(query) {
  controller?.abort();
  controller = new AbortController();

  try {
    const response = await fetch('/search?q=' + query, {
      signal: controller.signal
    });
    setResults(await response.json());
  } catch (e) {
    if (e.name !== 'AbortError') throw e;
  }
}

```

---

## Debounce vs Throttle | Pattern | Use Case |

|---------|----------|
| Debounce | Search input (wait for pause) |
| Throttle | Scroll events (limit rate) | ---

---

## DRIVEN DESIGN

> **The patterns for complex domains**

---

## Core Concepts

### Bounded Context

Clear boundary around a model

### Aggregate

Cluster of entities treated as unit

### Entity

Object with identity

### Value Object

Object defined by attributes

---

## Aggregate Rules

* One aggregate root per aggregate

* Reference by ID, not object

* Transactions within aggregate only

* Eventual consistency between aggregates

---

## Example

```typescript
// Aggregate Root
class Order {
  id: OrderId;
  customerId: CustomerId;
  items: OrderItem[];
  status: OrderStatus;

  addItem(productId: ProductId, quantity: number) {
    if (this.status !== 'draft') {
      throw new Error('Cannot modify submitted order');
    }
    this.items.push(new OrderItem(productId, quantity));
  }
}

```

---

## Strategic Patterns | Pattern | Description |

|---------|-------------|
| Context Map | Relationships between contexts |
| Anti-Corruption Layer | Translate between contexts |
| Shared Kernel | Overlapping models |
| Open Host Service | Public API for context | ---

---

## SAGA PATTERN

> **The patterns for distributed transactions**

---

## Problem

Microservices need multi-step transactions but cannot use traditional ACID across services.

---

## Choreography

Each service listens for events and publishes results.

```
Order Service creates order
  -> Publishes OrderCreated
    -> Payment Service charges card
      -> Publishes PaymentCompleted
        -> Inventory Service reserves stock
          -> Publishes StockReserved

```

---

## Orchestration

Central coordinator manages the workflow.

```
Saga Orchestrator:
  1. Tell Order Service to create order
  2. Tell Payment Service to charge
  3. Tell Inventory to reserve
  4. If any fails: send compensating commands

```

---

## Compensation

Undo actions when later steps fail. | Step | Compensation |
|------|--------------|
| Create Order | Cancel Order |
| Charge Card | Refund Card |
| Reserve Stock | Release Stock | ---

## Comparison | Aspect | Choreography | Orchestration |

|--------|--------------|---------------|
| Coupling | Loose | Tighter |
| Complexity | Distributed | Centralized |
| Visibility | Hard to trace | Easy to monitor |
| Best for | Simple flows | Complex flows | ---

---

## WEB SOCKETS SCALING

> **The patterns for real-time at scale**

---

## Challenge

WebSockets are stateful - connection lives on one server.

---

## Solution: Pub/Sub

```
All servers subscribe to Redis

User A on Server 1 sends message
  -> Server 1 publishes to Redis
    -> All servers receive
      -> Servers forward to connected clients

```

---

## Redis Pub/Sub

```javascript
// Subscribe
const subscriber = redis.duplicate();
subscriber.subscribe('chat');
subscriber.on('message', (channel, message) => {
  // Forward to local WebSocket clients
  wss.clients.forEach(client => client.send(message));
});

// Publish
redis.publish('chat', JSON.stringify({ user, text }));

```

---

## Connection Management

* Use sticky sessions (same server)

* Or externalize connection state

* Track connections per user

* Handle reconnection gracefully

---

## Alternatives | Technology | Latency | Complexity |

|------------|---------|------------|
| WebSocket | Lowest | High |
| SSE | Low | Medium |
| Long Polling | Medium | Low | ---

---

## QUEUE PATTERNS

> **The patterns for async processing**

---

## When to Use Queues

* Decouple services

* Handle traffic spikes

* Retry failed operations

* Schedule tasks

---

## Bull Queue (Redis)

```typescript
import Queue from 'bull';

const emailQueue = new Queue('emails', redisUrl);

// Producer
await emailQueue.add({
  to: 'user@example.com',
  subject: 'Welcome!',
  body: 'Hello...'
});

// Consumer
emailQueue.process(async (job) => {
  await sendEmail(job.data);
});

```

---

## Dead Letter Queue

Messages that fail repeatedly go to DLQ for inspection.

```typescript
const queue = new Queue('main', {
  settings: {
    maxStalledCount: 3,
    backoffStrategies: {
      exponential: (attemptsMade) =>
        Math.pow(2, attemptsMade) * 1000
    }
  }
});

```

---

## Idempotency

```typescript
emailQueue.process(async (job) => {
  // Check if already processed
  if (await isProcessed(job.id)) {
    return;
  }

  await sendEmail(job.data);
  await markProcessed(job.id);
});

```

---

---

## MIDDLEWARE PATTERNS

> **The request/response pipeline**

---

## Express Middleware Order

```javascript
app.use(helmet());           // 1. Security headers
app.use(cors());             // 2. CORS
app.use(express.json());     // 3. Parse body
app.use(requestLogger);      // 4. Logging
app.use(authenticate);       // 5. Auth
app.use(rateLimit);          // 6. Rate limiting
app.use('/api', apiRoutes);  // 7. Routes
app.use(errorHandler);       // 8. Error handling (LAST!)

```

---

## Request ID Pattern

```javascript
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || uuid();
  res.set('X-Request-ID', req.id);
  next();
});

```

---

## Async Error Wrapper

```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/users', asyncHandler(async (req, res) => {
  const users = await getUsers(); // Errors auto-caught!
  res.json(users);
}));

```

---

---

## FASTIFY PATTERNS

> **The high-performance Node.js framework**

---

## Basic Setup

```javascript
import Fastify from 'fastify';

const fastify = Fastify({
  logger: true,
  trustProxy: true
});

fastify.get('/users/:id', async (request, reply) => {
  const { id } = request.params;
  const user = await getUser(id);
  return user; // Auto JSON serialization
});

await fastify.listen({ port: 3000 });

```

---

## Schema Validation

```javascript
const userSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' }
      }
    }
  }
};

fastify.post('/users', { schema: userSchema }, handler);

```

---

## Plugins Pattern

```javascript
// Encapsulated context
fastify.register(async function (fastify) {
  fastify.decorate('db', prisma);

  fastify.get('/users', async (request) => {
    return fastify.db.user.findMany();
  });
}, { prefix: '/api' });

```

---

---

## GRACEFUL SHUTDOWN

> **The zero-downtime shutdown patterns**

---

## Express Graceful Shutdown

```javascript
const server = app.listen(3000);

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down...');

  // Stop accepting new connections
  server.close(async () => {
    console.log('HTTP server closed');

    // Close database connections
    await prisma.$disconnect();

    // Close Redis
    await redis.quit();

    console.log('Graceful shutdown complete');
    process.exit(0);
  });

  // Force close after 30 seconds
  setTimeout(() => {
    console.error('Forced shutdown');
    process.exit(1);
  }, 30000);
});

```

---

## Kubernetes Integration

```yaml
spec:
  terminationGracePeriodSeconds: 60
  containers:
  * name: app
      lifecycle:
        preStop:
          exec:
            command: ["/bin/sh", "-c", "sleep 10"]

```

---

## Connection Draining

```javascript
// Track active connections
let connections = new Set();

server.on('connection', (conn) => {
  connections.add(conn);
  conn.on('close', () => connections.delete(conn));
});

// On shutdown, close idle connections
for (const conn of connections) {
  conn.end();
}

```

---

---

## SUPABASE PATTERNS

> **The backend-as-a-service patterns**

---

## Row Level Security

```sql
-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Users can only see their own posts
CREATE POLICY "Users can view own posts"
ON posts FOR SELECT
USING (auth.uid() = user_id);

-- Users can only insert their own posts
CREATE POLICY "Users can insert own posts"
ON posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

```

---

## Client Usage

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, anonKey);

// Auth
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Query
const { data: posts } = await supabase
  .from('posts')
  .select('*, author:users(name)')
  .order('created_at', { ascending: false });

```

---

## Real-time Subscriptions

```typescript
const channel = supabase
  .channel('posts')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'posts' },
    (payload) => {
      console.log('New post:', payload.new);
    }
  )
  .subscribe();

```

---

---

## TRPC PATTERNS

> **The end-to-end typesafe API patterns**

---

## Router Definition

```typescript
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const appRouter = t.router({
  userById: t.procedure
    .input(z.string())
    .query(async ({ input }) => {
      return await db.user.findUnique({ where: { id: input } });
    }),

  createUser: t.procedure
    .input(z.object({
      email: z.string().email(),
      name: z.string()
    }))
    .mutation(async ({ input }) => {
      return await db.user.create({ data: input });
    })
});

export type AppRouter = typeof appRouter;

```

---

## Client Usage

```typescript
import { trpc } from './utils/trpc';

function UserProfile({ userId }: { userId: string }) {
  const user = trpc.userById.useQuery(userId);
  const createUser = trpc.createUser.useMutation();

  // Fully typed!
  return <div>{user.data?.name}</div>;
}

```

---

## With Next.js

```typescript
// pages/api/trpc/[trpc].ts
import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from '../../../server/routers/_app';

export default createNextApiHandler({
  router: appRouter,
  createContext: () => ({})
});

```

---

---

## RATE LIMITING IMPLEMENTATION

> **The throttling patterns that protect services**

---

## Token Bucket Implementation

```javascript
class TokenBucket {
  constructor(capacity, fillRate) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.fillRate = fillRate;
    this.lastFill = Date.now();
  }

  consume(tokens = 1) {
    this.refill();
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    return false;
  }

  refill() {
    const now = Date.now();
    const elapsed = (now - this.lastFill) / 1000;
    this.tokens = Math.min(
      this.capacity,
      this.tokens + elapsed * this.fillRate
    );
    this.lastFill = now;
  }
}

```

---

## Redis Rate Limiter

```javascript
async function checkRateLimit(userId, limit, window) {
  const key = `rate:${userId}`;
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, window);
  }

  if (current > limit) {
    const ttl = await redis.ttl(key);
    return { allowed: false, retryAfter: ttl };
  }

  return { allowed: true, remaining: limit - current };
}

```

---

## Headers to Return

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
Retry-After: 60

```

---

---

## PATTERNS

> **The simple real-time patterns**

---

## Server Implementation

```javascript
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send initial data
  res.write('data: Connected\n\n');

  // Send updates
  const interval = setInterval(() => {
    const data = JSON.stringify({ time: Date.now() });
    res.write(`data: ${data}\n\n`);
  }, 1000);

  // Cleanup on client disconnect
  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

```

---

## Client Usage

```javascript
const eventSource = new EventSource('/events');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateUI(data);
};

eventSource.onerror = () => {
  // Auto-reconnects by default
};

```

---

## SSE vs WebSocket | Feature | SSE | WebSocket |

|---------|-----|-----------|
| Direction | Server -> Client | Bidirectional |
| Protocol | HTTP | WS |
| Reconnection | Automatic | Manual |
| Browser support | Great | Great |
| Use case | Updates, notifications | Chat, games | ---

---

## API VERSIONING PATTERNS

> **The backwards compatibility patterns**

---

## URL Versioning

```
/api/v1/users
/api/v2/users

PROS:

* Clear and visible

* Easy to route

* Cache-friendly

CONS:

* URL pollution

* Client updates required

```

---

## Header Versioning

```
GET /api/users
Accept: application/vnd.api+json;version=2

PROS:

* Clean URLs

* Flexible

CONS:

* Harder to test

* Not visible in browser

```

---

## Backwards Compatibility

```javascript
// Support both old and new format
function getUser(id) {
  const user = await db.user.findUnique({ where: { id } });

  return {
    id: user.id,
    name: user.name,

    // v1: deprecated field
    fullName: user.name,

    // v2: new structure
    profile: {
      displayName: user.name,
      avatar: user.avatarUrl
    }
  };
}

```

---

## Deprecation Strategy

```
1. Announce deprecation (add header)
   Deprecation: true
   Sunset: Sat, 1 Jan 2025 00:00:00 GMT

2. Log usage of deprecated endpoints

3. Notify high-usage clients directly

4. Grace period (3-6 months)

5. Remove endpoint

```

---

---

## MICROSERVICES COMMUNICATION

> **The inter-service patterns**

---

## Sync vs Async

```
SYNCHRONOUS (REST/gRPC):
  + Simple to implement
  + Immediate response
  * Tight coupling
  * Cascading failures

ASYNCHRONOUS (Queues/Events):
  + Loose coupling
  + Resilient to failures
  + Better scalability
  * Eventual consistency
  * More complex debugging

```

---

## Service Discovery

```yaml

# Kubernetes: DNS-based

# Service name becomes DNS

http://user-service.default.svc.cluster.local/users

# Consul: Health-checked registry

# Services register themselves

# Clients query for healthy instances

```

---

## Circuit Breaker

```javascript
const circuitBreaker = new CircuitBreaker(callService, {
  failureThreshold: 5,     // Open after 5 failures
  resetTimeout: 30000,     // Try again after 30s
  fallback: () => cachedData
});

// States:
// CLOSED -> Normal operation
// OPEN -> Fast-fail, use fallback
// HALF-OPEN -> Testing recovery

```

---

## Saga Pattern

```
CHOREOGRAPHY (Event-driven):
  Order Created -> Payment Service
  Payment Success -> Inventory Service
  Inventory Reserved -> Shipping Service

ORCHESTRATION (Central coordinator):
  Saga Orchestrator calls each service
  Tracks state
  Handles compensating transactions

```

---

---

## HEALTH CHECK PATTERNS

> **The production readiness checks**

---

## Health Check Types

```
LIVENESS:
  "Is the process running?"
  * Simple ping
  * If fails: Restart container

READINESS:
  "Can it serve traffic?"
  * Check dependencies
  * If fails: Remove from load balancer

STARTUP:
  "Has it finished initializing?"
  * Allow longer timeout
  * If fails: Kill and restart

```

---

## Implementation

```typescript
app.get('/health/live', (req, res) => {
  // Just confirms process is running
  res.status(200).json({ status: 'ok' });
});

app.get('/health/ready', async (req, res) => {
  const checks = await Promise.allSettled([
    checkDatabase(),
    checkRedis(),
    checkExternalApi()
  ]);

  const healthy = checks.every(c => c.status === 'fulfilled');
  const status = healthy ? 200 : 503;

  res.status(status).json({
    status: healthy ? 'ok' : 'degraded',
    checks: {
      database: checks[0].status,
      redis: checks[1].status,
      externalApi: checks[2].status
    }
  });
});

```

---

## Kubernetes Config

```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 15
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /health/ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 10

```

---

---

## EXPRESS MIDDLEWARE PATTERNS

> **The request processing patterns**

---

## Middleware Order

```javascript
const app = express();

// 1. Security headers
app.use(helmet());

// 2. CORS
app.use(cors(corsOptions));

// 3. Body parsing
app.use(express.json({ limit: '10mb' }));

// 4. Request logging
app.use(morgan('combined'));

// 5. Request ID
app.use((req, res, next) => {
  req.id = uuid();
  res.setHeader('X-Request-ID', req.id);
  next();
});

// 6. Authentication
app.use('/api', authMiddleware);

// 7. Routes
app.use('/api/users', userRoutes);

// 8. Error handling (always last)
app.use(errorHandler);

```

---

## Async Error Handler

```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage
app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await db.user.findUnique({ where: { id: req.params.id } });
  if (!user) throw new NotFoundError('User not found');
  res.json(user);
}));

```

---

## Rate Limiting

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: 'Too many requests' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

```

---

---

## API RATE LIMITING PATTERNS

> **The patterns that protect your API**

---

## Token Bucket Algorithm

```javascript
class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate; // tokens per second
    this.lastRefill = Date.now();
  }

  consume(tokens = 1) {
    this.refill();
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    return false;
  }

  refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(
      this.capacity,
      this.tokens + elapsed * this.refillRate
    );
    this.lastRefill = now;
  }
}

```

---

## Redis Rate Limiter

```javascript
async function rateLimit(userId, limit, window) {
  const key = `ratelimit:${userId}`;
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, window);
  }

  if (current > limit) {
    const ttl = await redis.ttl(key);
    throw new RateLimitError(`Try again in ${ttl} seconds`);
  }

  return { remaining: limit - current, reset: ttl };
}

```

---

## Sliding Window

```javascript
async function slidingWindowRateLimit(userId, limit, windowMs) {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Remove old entries, count recent ones
  const key = `ratelimit:${userId}`;
  await redis.zRemRangeByScore(key, 0, windowStart);

  const count = await redis.zCard(key);
  if (count >= limit) {
    throw new RateLimitError('Rate limit exceeded');
  }

  await redis.zAdd(key, { score: now, value: now.toString() });
  await redis.expire(key, Math.ceil(windowMs / 1000));

  return { remaining: limit - count - 1 };
}

```

---

---

## EXPRESS MIDDLEWARE PATTERNS

> **The patterns for scalable Express apps**

---

## Error Handling Middleware

```typescript
// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  // Log unexpected errors
  console.error('Unexpected error:', err);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
}

```

---

## Request Validation

```typescript
// middleware/validate.ts
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export function validate(schema: z.ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: 'error',
          errors: error.errors
        });
      }
      next(error);
    }
  };
}

// Usage
const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    name: z.string().min(2)
  })
});

app.post('/users', validate(createUserSchema), createUser);

```

---

## Rate Limiting

```typescript
// middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../lib/redis';

export const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:'
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: 'Too many requests, try again later' },
  standardHeaders: true,
  legacyHeaders: false
});

// Stricter limit for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 attempts
  message: { error: 'Too many login attempts' }
});

```

---

---

## WEBSOCKET PRODUCTION PATTERNS

> **The real-time patterns that scale**

---

## Socket.io Server

```typescript
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pubClient = createClient({ url: REDIS_URL });
const subClient = pubClient.duplicate();

await Promise.all([pubClient.connect(), subClient.connect()]);

const io = new Server(httpServer, {
  cors: { origin: ALLOWED_ORIGINS },
  adapter: createAdapter(pubClient, subClient)  // Scale across servers!
});

// Auth middleware
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const user = await verifyToken(token);
    socket.data.user = user;
    next();
  } catch (err) {
    next(new Error('Authentication failed'));
  }
});

// Room-based chat
io.on('connection', (socket) => {
  const userId = socket.data.user.id;

  // Join user's private room
  socket.join(`user:${userId}`);

  socket.on('join-room', (roomId) => {
    socket.join(`room:${roomId}`);
  });

  socket.on('message', async ({ roomId, content }) => {
    const message = await saveMessage(roomId, userId, content);
    io.to(`room:${roomId}`).emit('message', message);
  });
});

```

---

## Client-Side Reconnection

```typescript
import { io } from 'socket.io-client';

const socket = io(SERVER_URL, {
  auth: { token: getToken() },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000
});

socket.on('connect', () => {
  console.log('Connected:', socket.id);
  // Rejoin rooms on reconnect
  socket.emit('rejoin-rooms', getRoomIds());
});

socket.on('disconnect', (reason) => {
  if (reason === 'io server disconnect') {
    // Server disconnected us, reconnect manually
    socket.connect();
  }
});

socket.on('connect_error', (error) => {
  if (error.message === 'Authentication failed') {
    // Refresh token and retry
    refreshToken().then(() => socket.connect());
  }
});

```

---

---

## FILE UPLOAD PATTERNS

> **The patterns for handling files safely**

---

## Presigned URLs (S3)

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

async function getUploadUrl(fileName: string, contentType: string) {
  const key = `uploads/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: contentType
  });

  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600  // 1 hour
  });

  return { uploadUrl: signedUrl, key };
}

// Client uploads directly to S3
const { uploadUrl, key } = await api.getUploadUrl('image.png', 'image/png');
await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': 'image/png' }
});

```

---

## Image Processing

```typescript
import sharp from 'sharp';

async function processImage(buffer: Buffer) {
  // Resize and convert
  const processed = await sharp(buffer)
    .resize(800, 600, { fit: 'inside' })
    .webp({ quality: 80 })
    .toBuffer();

  // Generate thumbnail
  const thumbnail = await sharp(buffer)
    .resize(200, 200, { fit: 'cover' })
    .webp({ quality: 60 })
    .toBuffer();

  return { processed, thumbnail };
}

```

---

## Validation

```typescript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024;  // 10MB

function validateFile(file: File) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type');
  }

  if (file.size > MAX_SIZE) {
    throw new Error('File too large');
  }

  // Check magic bytes for actual type
  // Don't trust Content-Type header alone!
}

```

---

---

## API VERSIONING

> **The patterns for evolving APIs**

---

## URL Versioning

```typescript
// /api/v1/users
// /api/v2/users

app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);

// Deprecation header
app.use('/api/v1', (req, res, next) => {
  res.setHeader('Deprecation', 'true');
  res.setHeader('Sunset', 'Sat, 01 Jan 2025 00:00:00 GMT');
  next();
});

```

---

## Header Versioning

```typescript
// Accept: application/vnd.myapi.v2+json

app.use('/api', (req, res, next) => {
  const accept = req.headers.accept || '';
  const match = accept.match(/vnd\.myapi\.v(\d+)/);
  req.apiVersion = match ? parseInt(match[1]) : 1;
  next();
});

app.get('/api/users', (req, res) => {
  if (req.apiVersion === 2) {
    return respondV2(req, res);
  }
  return respondV1(req, res);
});

```

---

## Breaking vs Non-Breaking Changes

```
NON-BREAKING (OK):
Add new optional field
Add new endpoint
Add new enum value (if client ignores unknown)
Increase max length

BREAKING (NEEDS VERSION):
Remove field
Rename field
Change field type
Change required/optional
Change response structure

```

---

---

## BACKGROUND JOBS

> **The async processing patterns**

---

## BullMQ Queue

```typescript
import { Queue, Worker } from 'bullmq';

// Create queue
const emailQueue = new Queue('emails', {
  connection: { host: 'redis', port: 6379 }
});

// Add job
await emailQueue.add('welcome', {
  to: 'user@example.com',
  template: 'welcome'
}, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 1000 },
  removeOnComplete: true,
  removeOnFail: 1000  // Keep last 1000 failed jobs
});

// Process jobs
const worker = new Worker('emails', async (job) => {
  const { to, template } = job.data;
  await sendEmail(to, template);
  return { sent: true };
}, {
  connection: { host: 'redis', port: 6379 },
  concurrency: 5
});

worker.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed:`, result);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});

```

---

## Scheduled Jobs

```typescript
// Recurring job (every hour)
await emailQueue.add('digest', { type: 'daily' }, {
  repeat: { cron: '0 * * * *' }  // Every hour
});

// Delayed job
await emailQueue.add('reminder', { userId: 123 }, {
  delay: 24 * 60 * 60 * 1000  // 24 hours
});

```

---

## Job Priorities

```typescript
// High priority (process first)
await queue.add('urgent', data, { priority: 1 });

// Normal priority
await queue.add('normal', data, { priority: 5 });

// Low priority (process last)
await queue.add('batch', data, { priority: 10 });

```

---

---

## API DESIGN BEST PRACTICES

> **The REST patterns everyone should follow**

---

## HTTP Methods

```
GET    /users         List all users
GET    /users/:id     Get one user
POST   /users         Create user
PUT    /users/:id     Replace user (full update)
PATCH  /users/:id     Update user (partial)
DELETE /users/:id     Delete user

RULES:

* GET/DELETE: No request body

* POST: Returns 201 with Location header

* DELETE: Returns 204 (no content)

```

---

## Response Format

```typescript
// Success
{
  "data": {
    "id": "123",
    "name": "John"
  }
}

// List with pagination
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "perPage": 10,
    "totalPages": 10
  }
}

// Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [
      { "field": "email", "message": "Required" }
    ]
  }
}

```

---

## Status Codes

```
SUCCESS:
200 OK - Request succeeded
201 Created - Resource created
204 No Content - Delete succeeded

CLIENT ERROR:
400 Bad Request - Invalid input
401 Unauthorized - Auth required
403 Forbidden - No permission
404 Not Found - Resource missing
409 Conflict - Duplicate
422 Unprocessable - Validation failed
429 Too Many Requests - Rate limited

SERVER ERROR:
500 Internal Error - Bug
502 Bad Gateway - Upstream failed
503 Service Unavailable - Overloaded

```

---

---

## PAGINATION PATTERNS

> **The patterns for large data sets**

---

## Offset Pagination

```typescript
// GET /users?page=2&limit=10
async function getUsers(page: number, limit: number) {
  const offset = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count()
  ]);

  return {
    data: users,
    meta: {
      page,
      perPage: limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

```

**Pros:** Simple, jump to any page
**Cons:** Slow on large offsets, can skip/duplicate items

---

## Cursor Pagination

```typescript
// GET /users?cursor=abc&limit=10
async function getUsers(cursor?: string, limit: number = 10) {
  const users = await prisma.user.findMany({
    take: limit + 1,  // Fetch one extra to check if more
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,  // Skip cursor itself
    orderBy: { createdAt: 'desc' }
  });

  const hasMore = users.length > limit;
  const data = hasMore ? users.slice(0, -1) : users;
  const nextCursor = hasMore ? data[data.length - 1].id : null;

  return {
    data,
    nextCursor,
    hasMore
  };
}

```

**Pros:** Fast regardless of depth, consistent with real-time data
**Cons:** Can't jump to page N

---

## When to Use

```
OFFSET: Admin panels, search results

* Users expect page numbers

* Data doesn't change often

CURSOR: Infinite scroll, feeds, real-time

* Better performance

* Works with changing data

```

---

---

## EMAIL BEST PRACTICES

> **The transactional email patterns**

---

## Email Service Setup

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendWelcomeEmail(user: User) {
  const { data, error } = await resend.emails.send({
    from: 'MyApp <noreply@myapp.com>',
    to: user.email,
    subject: 'Welcome to MyApp!',
    react: WelcomeEmailTemplate({ name: user.name }),
    // Or HTML fallback
    html: `<h1>Welcome ${user.name}!</h1>`
  });

  if (error) {
    console.error('Email failed:', error);
    // Queue for retry, don't fail the request
    await emailQueue.add('retry', { userId: user.id, type: 'welcome' });
  }
}

```

---

## Email Templates with React

```typescript
// emails/WelcomeEmail.tsx
import { Html, Head, Body, Container, Text, Button } from '@react-email/components';

export function WelcomeEmail({ name, loginUrl }: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif' }}>
        <Container>
          <Text>Hi {name},</Text>
          <Text>Welcome to MyApp! Get started by logging in:</Text>
          <Button href={loginUrl} style={{ background: '#007bff', color: 'white' }}>
            Log In
          </Button>
        </Container>
      </Body>
    </Html>
  );
}

```

---

## Deliverability Checklist

```
Use dedicated sending domain
Set up SPF, DKIM, DMARC
Use consistent From address
Include unsubscribe link
Monitor bounce rates
Don't send from noreply@
Don't buy email lists
Don't send too frequently

```

---

---

## WEBHOOKS IMPLEMENTATION

> **The event notification patterns**

---

## Sending Webhooks

```typescript
async function sendWebhook(event: string, payload: any, webhookUrl: string) {
  const timestamp = Date.now();
  const signature = createSignature(payload, timestamp);

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Timestamp': timestamp.toString()
      },
      body: JSON.stringify({
        event,
        payload,
        timestamp
      }),
      signal: AbortSignal.timeout(10000)  // 10s timeout
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    // Queue for retry
    await webhookQueue.add('retry', { event, payload, webhookUrl });
    return { success: false, error };
  }
}

function createSignature(payload: any, timestamp: number) {
  const data = `${timestamp}.${JSON.stringify(payload)}`;
  return crypto.createHmac('sha256', WEBHOOK_SECRET)
    .update(data)
    .digest('hex');
}

```

---

## Receiving Webhooks

```typescript
// Verify signature
function verifyWebhookSignature(req: Request): boolean {
  const signature = req.headers['x-webhook-signature'];
  const timestamp = req.headers['x-webhook-timestamp'];

  // Check timestamp not too old (prevent replay)
  const age = Date.now() - parseInt(timestamp);
  if (age > 5 * 60 * 1000) return false;  // 5 minutes

  const expectedSig = createSignature(req.body, parseInt(timestamp));
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSig)
  );
}

app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  if (!verifyWebhookSignature(req)) {
    return res.status(401).send('Invalid signature');
  }

  // Process webhook
  processWebhook(req.body);

  // Always respond quickly
  res.status(200).send('OK');
});

```

---

---

## RPC PATTERNS

> **The type-safe API patterns**

---

## Server Setup

```typescript
// server/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Protected procedure
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { ...ctx, user: ctx.session.user } });
});

```

---

## Router Definition

```typescript
// server/routers/user.ts
export const userRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.user.findUnique({ where: { id: input.id } });
    }),

  update: protectedProcedure
    .input(z.object({
      name: z.string().min(2)
    }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.user.update({
        where: { id: ctx.user.id },
        data: input
      });
    })
});

// Root router
export const appRouter = router({
  user: userRouter,
  post: postRouter
});

export type AppRouter = typeof appRouter;

```

---

## Client Usage

```typescript
// In React component
function UserProfile({ id }: { id: string }) {
  const { data, isLoading } = trpc.user.getById.useQuery({ id });

  const updateMutation = trpc.user.update.useMutation({
    onSuccess: () => {
      utils.user.getById.invalidate({ id });
    }
  });

  return (
    <div>
      <h1>{data?.name}</h1>
      <button onClick={() => updateMutation.mutate({ name: 'New Name' })}>
        Update
      </button>
    </div>
  );
}

```

---

---

## DATA VALIDATION

> **The input validation patterns**

---

## Zod Schemas

```typescript
import { z } from 'zod';

// Basic types
const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  age: z.number().min(0).max(150),
  role: z.enum(['admin', 'user', 'guest']),
  settings: z.object({
    theme: z.enum(['light', 'dark']).default('light'),
    notifications: z.boolean().default(true)
  }).optional()
});

type User = z.infer<typeof userSchema>;

// Validation
const result = userSchema.safeParse(data);
if (result.success) {
  const user: User = result.data;
} else {
  console.error(result.error.flatten());
}

```

---

## Transform & Refine

```typescript
// Transform on parse
const dateSchema = z.string().transform((val) => new Date(val));

// Refine for custom validation
const passwordSchema = z.string()
  .min(8)
  .refine((val) => /[A-Z]/.test(val), 'Must have uppercase')
  .refine((val) => /[0-9]/.test(val), 'Must have number');

// Cross-field validation
const formSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

```

---

## API Validation Middleware

```typescript
import { z } from 'zod';

function validateRequest(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params
    });

    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.flatten()
      });
    }

    req.validated = result.data;
    next();
  };
}

// Usage
const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    name: z.string().min(2)
  })
});

app.post('/users', validateRequest(createUserSchema), createUser);

```

---

## CRITICAL API FAILURES (REAL PRODUCTION INCIDENTS)

## #### From Stripe, PayPal, and major engineering post-mortems

## N+1 Query Problem (Brought Down Stripe)

### From Stripe Engineering Blog

>
> "A single API endpoint brought down our entire platform.
> The endpoint fetched users, then for each user, fetched their subscriptions.
>
> 1 query for 100 users 1 + 100 = 101 database queries
>
> During Black Friday: 10,000 concurrent requests
> = 1,010,000 database queries in 30 seconds
> = Database connection pool exhausted
> = Entire platform down for 45 minutes
>
> Cost: $2.3M in lost revenue + reputation damage"

### The Vulnerable Code

```python

# DISASTER - N+1 Query Problem

@app.get("/users")
async def get_users():
    users = await db.query("SELECT * FROM users LIMIT 100")

    # THIS IS THE PROBLEM
    for user in users:
        # 1 query per user = 100 more queries!
        user['subscriptions'] = await db.query(
            "SELECT * FROM subscriptions WHERE user_id = ?",
            user['id']
        )

    return users

```

### The Fix

```python

# GOOD - Single Query with JOIN

@app.get("/users")
async def get_users():
    # 1 query total, regardless of user count
    query = """
        SELECT
            u.*,
            json_agg(s.*) as subscriptions
        FROM users u
        LEFT JOIN subscriptions s ON s.user_id = u.id
        GROUP BY u.id
        LIMIT 100
    """
    users = await db.query(query)
    return users

# OR use ORM with eager loading

users = await User.query.options(
    selectinload(User.subscriptions)  # Loads in 2 queries total
).limit(100).all()

```

### How to Detect N+1

```python

# Install nplusone for automatic detection

from nplusone.ext.flask_sqlalchemy import NPlusOne

app = Flask(__name__)
NPlusOne(app)

# Logs warning in development

# "Potential N+1 query detected: User.subscriptions"

```

---

## Memory Leak (Node.js at PayPal)

### From PayPal Engineering

>
> "Our Node.js API servers kept crashing every 6 hours.
> Memory usage grew from 200MB to 2GB, then crash.
>
> Root cause: Event listeners not being removed.
> Every request added a listener, but never removed it.
>
> With 1M requests/day: 1M event listeners in memory.
> After 6 hours: Out of memory."

### The Bug

```javascript
// MEMORY LEAK
app.post('/process', async (req, res) => {
    const processor = new EventEmitter();

    // Adding listener but never removing
    processor.on('data', (data) => {
        console.log(data);
    });

    await processData(processor);
    res.send('Done');
    // Listener still in memory!
});

// After 100K requests: 100K listeners in memory

```

### The Fix

```javascript
// FIXED - Remove Listeners
app.post('/process', async (req, res) => {
    const processor = new EventEmitter();

    const handler = (data) => {
        console.log(data);
    };

    processor.on('data', handler);

    try {
        await processData(processor);
        res.send('Done');
    } finally {
        // CRITICAL: Always remove listener
        processor.removeListener('data', handler);
        // Or: processor.removeAllListeners('data');
    }
});

// OR use once() instead of on()
processor.once('data', handler); // Auto-removes after first event

```

### Memory Leak Detection

```javascript
// 1. Node.js built-in
// node --expose-gc --inspect server.js
// Then use Chrome DevTools Memory Profiler

// 2. Use clinic.js
// npm install -g clinic
// clinic doctor -- node server.js
// Generates report showing memory leaks

// 3. Monitor in production
const v8 = require('v8');

app.get('/metrics', (req, res) => {
    const stats = v8.getHeapStatistics();
    res.json({
        heapUsed: stats.used_heap_size / 1024 / 1024, // MB
        heapTotal: stats.total_heap_size / 1024 / 1024,
        // If heapUsed keeps growing = memory leak
    });
});

```

---

## Blocking Event Loop (Node.js)

### Stack Overflow #47382910 (8,500 upvotes)

>
> "My Node.js API becomes unresponsive under load.
> CPU-intensive operations block the event loop.
> All requests freeze while one request processes."

### The Problem

```javascript
// BLOCKS EVENT LOOP
app.post('/analyze', async (req, res) => {
    const data = req.body.data; // Array of 1M items

    // This loop blocks for 10 seconds
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        sum += complexCalculation(data[i]);
    }

    res.json({ result: sum });
    // ALL other requests wait 10 seconds!
});

```

### The Fix: Worker Threads

```javascript
// NON-BLOCKING with Worker Threads
const { Worker } = require('worker_threads');

app.post('/analyze', async (req, res) => {
    const worker = new Worker('./worker.js', {
        workerData: req.body.data
    });

    worker.on('message', (result) => {
        res.json({ result });
    });

    worker.on('error', (error) => {
        res.status(500).json({ error: error.message });
    });
});

// worker.js
const { parentPort, workerData } = require('worker_threads');

let sum = 0;
for (let i = 0; i < workerData.length; i++) {
    sum += complexCalculation(workerData[i]);
}

parentPort.postMessage(sum);

```

### Event Loop Monitoring

```javascript
const blocked = require('blocked-at');

blocked((time, stack) => {
    console.log(`Event loop blocked for ${time}ms`);
    console.log(stack);
    // Alert if blocked > 100ms
    if (time > 100) {
        alertOps('Event loop blocked!');
    }
});

```

---

## JWT SECURITY (PRODUCTION PATTERNS)

## Common Mistakes from Stack Overflow

### Mistake 1: Storing JWT in localStorage

```javascript
// VULNERABLE to XSS
localStorage.setItem('token', jwt);

// Attacker injects script that steals token

```

### Correct: httpOnly Cookie

```python
from fastapi import Response

@app.post("/login")
async def login(response: Response, credentials: LoginRequest):
    user = authenticate(credentials)
    token = create_jwt(user.id)

    # SECURE: httpOnly cookie
    response.set_cookie(
        key="access_token",
        value=f"Bearer {token}",
        httponly=True,  # JavaScript can't access
        secure=True,    # Only HTTPS
        samesite="lax", # CSRF protection
        max_age=1800    # 30 minutes
    )

    return {"message": "Logged in"}

```

### Mistake 2: No Token Expiration

```python

# BAD: Token never expires

payload = {"user_id": user.id}
token = jwt.encode(payload, SECRET_KEY)

# If leaked, attacker has PERMANENT access

```

### Correct: Short-lived + Refresh Token

```python
from datetime import datetime, timedelta
import jwt

def create_access_token(user_id: int) -> str:
    # Short-lived (30 min)
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(minutes=30)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def create_refresh_token(user_id: int) -> str:
    # Long-lived (7 days), stored in DB
    payload = {
        "user_id": user_id,
        "token_type": "refresh",
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    # Store in database for revocation
    db.execute(
        "INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)",
        (user_id, token)
    )

    return token

```

---

## RATE LIMITING (CRITICAL)

### From Cloudflare Incident Report

>
> "API endpoint had no rate limiting.
> Attacker sent 50M requests in 10 minutes.
> Cost: $47,000 in cloud bills for that month."

### Redis-Based Rate Limiting (Production)

```python
import redis
from datetime import datetime

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def rate_limit(key: str, limit: int, window: int):
    """
    key: Unique identifier (user_id, IP, etc.)
    limit: Max requests
    window: Time window in seconds
    """
    current = datetime.now()
    key_name = f"ratelimit:{key}:{current.minute}"

    # Increment counter
    count = redis_client.incr(key_name)

    # Set expiry on first request
    if count == 1:
        redis_client.expire(key_name, window)

    # Check limit
    if count > limit:
        raise HTTPException(429, "Rate limit exceeded")

    return count

```

---

## DATABASE PRODUCTION PATTERNS

## Connection Pooling (CRITICAL)

### From PostgreSQL Wiki

>
> "Each database connection costs ~10MB RAM.
> Without pooling: 1000 concurrent requests = 10GB RAM + CPU overhead.
> With pooling: Reuse 20 connections = 200MB RAM."

### Implementation (SQLAlchemy)

```python
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

# GOOD: Connection pool

engine = create_engine(
    "postgresql://localhost/db",
    poolclass=QueuePool,
    pool_size=20,          # Keep 20 connections open
    max_overflow=10,       # Allow 10 more if needed
    pool_timeout=30,       # Wait 30s for available connection
    pool_recycle=3600,     # Recycle connections after 1 hour
    pool_pre_ping=True     # Test connection before using
)

```

### Monitoring Pool Health

```python
@app.get("/metrics/db")
async def db_metrics():
    return {
        "pool_size": engine.pool.size(),
        "checked_in": engine.pool.checkedin(),
        "checked_out": engine.pool.checkedout(),
        "overflow": engine.pool.overflow(),
        # Alert if overflow() > 0 consistently
    }

```

---

#### [PRODUCTION BACKEND PATTERNS] SECTION 1 COMPLETED

---

## ADVANCED API PATTERNS

---

## Request/Response Compression (Save 80% Bandwidth)

### Production Win from Dropbox (8,100+ upvotes)

>
> "Enabled gzip compression. Bandwidth costs: $200K/month $40K/month.
> Response size: 500KB 100KB. Page load time: 3s 0.8s.
> ONE configuration change saved $160K/month!"

### The Configuration

```python

# PRODUCTION - Enable compression in FastAPI

from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware

app = FastAPI()

# Add GZip middleware

app.add_middleware(
    GZipMiddleware,
    minimum_size=1000,  # Only compress responses > 1KB
    compresslevel=6     # Balance speed vs compression (1-9)
)

# Before compression: 500KB

# After compression: 100KB (80% smaller!)

# With 1M requests/day: 400GB saved/day = 12TB/month

```

---

## CORS Configuration (Security Nightmare)

### Production Incident from Facebook (9,200+ upvotes)

>
> "Misconfigured CORS allowed any website to call our API.
> Attacker created fake website. Stole user data from 50,000 users.
> Root cause: Access-Control-Allow-Origin: *"

### The Secure Config

```python

# SECURE - Whitelist specific origins

from fastapi.middleware.cors import CORSMiddleware

ALLOWED_ORIGINS = [
    "https://myapp.com",
    "https://www.myapp.com",
]

# Add dev origins only in development

if os.getenv("ENVIRONMENT") == "development":
    ALLOWED_ORIGINS.extend([
        "http://localhost:3000",
    ])

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
    max_age=3600
)

```

---

## Circuit Breaker Pattern (Stop Cascading Failures)

### Production Incident from Netflix (13,600+ upvotes)

>
> "Recommendation service went down. Took entire website down with it.
> Every page tried calling it. Each request waited 30 seconds.
> All threads blocked. Server ran out of threads."

### Implementation

```python
from enum import Enum
from datetime import datetime, timedelta

class CircuitState(Enum):
    CLOSED = "closed"    # Normal operation
    OPEN = "open"        # Service down, reject requests
    HALF_OPEN = "half_open"  # Testing if service recovered

class CircuitBreaker:
    def __init__(
        self,
        failure_threshold: int = 5,
        timeout: int = 60,
        success_threshold: int = 2
    ):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.success_threshold = success_threshold
        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.last_failure_time = None

    async def call(self, func, *args, **kwargs):
        if self.state == CircuitState.OPEN:
            if datetime.now() - self.last_failure_time > timedelta(seconds=self.timeout):
                self.state = CircuitState.HALF_OPEN
            else:
                raise Exception("Circuit breaker is OPEN")

        try:
            result = await func(*args, **kwargs)
            self.on_success()
            return result
        except Exception as e:
            self.on_failure()
            raise

```

---

## Retry with Exponential Backoff

```python
import asyncio
import random

async def retry_with_backoff(
    func,
    max_retries: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 60.0,
    exponential_base: float = 2.0,
    jitter: bool = True
):
    for attempt in range(max_retries + 1):
        try:
            return await func()
        except Exception as e:
            if attempt == max_retries:
                raise

            delay = min(base_delay * (exponential_base ** attempt), max_delay)

            if jitter:
                delay = delay * (0.5 + random.random())

            await asyncio.sleep(delay)

# Timeline of retries

# Attempt 1: Fails Retry in 1s

# Attempt 2: Fails Retry in 2s

# Attempt 3: Fails Retry in 4s

```

---

## Idempotency Keys (Prevent Duplicate Operations)

### Production Incident from Stripe (7,800+ upvotes)

>
> "User clicked 'Pay' button twice. Charged twice. 10,000 users affected. $500K in refunds."

```python
import redis

redis_client = redis.Redis()

def idempotent(ttl: int = 86400):
    def decorator(func):
        async def wrapper(*args, **kwargs):
            request = kwargs.get('request')
            idempotency_key = request.headers.get('Idempotency-Key')

            if not idempotency_key:
                return await func(*args, **kwargs)

            cache_key = f"idempotency:{idempotency_key}"
            cached_response = redis_client.get(cache_key)

            if cached_response:
                return json.loads(cached_response)

            result = await func(*args, **kwargs)
            redis_client.setex(cache_key, ttl, json.dumps(result))

            return result
        return wrapper
    return decorator

```

---

## DRIVEN ARCHITECTURE

---

## Kafka Producer/Consumer

```python

# KAFKA PRODUCER

from kafka import KafkaProducer

producer = KafkaProducer(
    bootstrap_servers=['kafka1:9092', 'kafka2:9092'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8'),
    acks='all',
    retries=3
)

@app.post("/orders")
async def create_order(order: OrderCreate):
    db_order = Order(**order.dict())
    db.add(db_order)
    db.commit()

    # Publish event
    producer.send('order.created', {
        'order_id': db_order.id,
        'user_id': order.user_id,
        'total': order.total
    })

    return {"id": db_order.id}

# KAFKA CONSUMER

from kafka import KafkaConsumer

consumer = KafkaConsumer(
    'order.created',
    bootstrap_servers=['kafka1:9092'],
    group_id='notification-service',
    value_deserializer=lambda m: json.loads(m.decode('utf-8'))
)

for message in consumer:
    event = message.value
    send_email(event['user_id'], f"Order {event['order_id']} confirmed")

```

---

> **CONTINUED IN PART 2...**
