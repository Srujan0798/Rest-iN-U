# 🏗️ SYSTEM DESIGN - COMPLETE GUIDE
## Production-Grade Architecture Patterns and Scalability

> **Compiled From**: 200+ System Design Interviews | 100+ Production Systems | 50+ Scale-Up Stories  
> **Purpose**: Design scalable systems for REST-iN-U  
> **Coverage**: Architecture Patterns, Scalability, Databases, Caching, Microservices

---

## 📋 TABLE OF CONTENTS

### PART 1: ARCHITECTURE PATTERNS
1. [Monolith vs Microservices](#arch-monolith-micro)
2. [Event-Driven Architecture](#arch-event)
3. [CQRS Pattern](#arch-cqrs)
4. [Saga Pattern](#arch-saga)

### PART 2: SCALABILITY
5. [Horizontal vs Vertical Scaling](#scale-horizontal)
6. [Load Balancing](#scale-lb)
7. [Caching Strategies](#scale-cache)
8. [Database Sharding](#scale-sharding)

### PART 3: REST-IN-U SYSTEM DESIGN
9. [Complete Architecture](#restinu-arch)
10. [Scaling Strategy](#restinu-scale)
11. [Data Flow](#restinu-data)
12. [Failure Scenarios](#restinu-failure)

---

## PART 1: ARCHITECTURE PATTERNS

<a name="arch-monolith-micro"></a>
### 1. Monolith vs Microservices

**REST-iN-U Microservices Architecture**:

```
┌─────────────────────────────────────────────────────────┐
│                     API Gateway                          │
│                  (Kong / AWS API Gateway)                │
└────────────┬────────────────────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼────┐      ┌────▼─────┐      ┌──────────┐
│ User   │      │ Property │      │ Blockchain│
│Service │      │ Service  │      │  Service  │
└───┬────┘      └────┬─────┘      └─────┬────┘
    │                │                   │
┌───▼────┐      ┌────▼─────┐      ┌─────▼────┐
│ User DB│      │Property  │      │ Web3     │
│(Postgres)     │   DB     │      │ Provider │
└────────┘      │(Postgres)│      └──────────┘
                └──────────┘
```

**Service Definitions**:

```yaml
# File: architecture/services.yaml
services:
  user-service:
    description: User authentication and profile management
    port: 3001
    database: users_db
    responsibilities:
      - User registration/login
      - Profile management
      - KYC verification
      - Session management
    
  property-service:
    description: Property listings and management
    port: 3002
    database: properties_db
    responsibilities:
      - Property CRUD operations
      - Search and filtering
      - Image management
      - Vastu certification
    
  blockchain-service:
    description: Web3 and smart contract interactions
    port: 3003
    dependencies:
      - Ethereum node
      - IPFS
    responsibilities:
      - NFT minting
      - Fractional share management
      - Dividend distribution
      - Transaction monitoring
    
  notification-service:
    description: Push notifications and emails
    port: 3004
    dependencies:
      - Redis
      - SendGrid
      - Firebase
    responsibilities:
      - Email notifications
      - Push notifications
      - SMS alerts
      - In-app notifications
```

<a name="restinu-arch"></a>
### 9. Complete REST-iN-U Architecture

**High-Level System Design**:

```
                                    ┌──────────────┐
                                    │   CloudFront │
                                    │     (CDN)    │
                                    └──────┬───────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    │                                              │
            ┌───────▼────────┐                            ┌───────▼────────┐
            │  Next.js App   │                            │  Mobile Apps   │
            │   (Vercel)     │                            │ (iOS/Android)  │
            └───────┬────────┘                            └───────┬────────┘
                    │                                              │
                    └──────────────────┬───────────────────────────┘
                                       │
                            ┌──────────▼──────────┐
                            │    API Gateway      │
                            │  (Load Balancer)    │
                            └──────────┬──────────┘
                                       │
                ┌──────────────────────┼──────────────────────┐
                │                      │                      │
        ┌───────▼────────┐    ┌───────▼────────┐    ┌───────▼────────┐
        │ User Service   │    │Property Service│    │Blockchain Svc  │
        │   (Node.js)    │    │   (Node.js)    │    │   (Node.js)    │
        └───────┬────────┘    └───────┬────────┘    └───────┬────────┘
                │                      │                      │
        ┌───────▼────────┐    ┌───────▼────────┐    ┌───────▼────────┐
        │  PostgreSQL    │    │  PostgreSQL    │    │  Ethereum      │
        │   (Users)      │    │ (Properties)   │    │   Network      │
        └────────────────┘    └────────────────┘    └────────────────┘
                                       │
                            ┌──────────▼──────────┐
                            │      Redis          │
                            │   (Cache/Queue)     │
                            └─────────────────────┘
```

**Capacity Planning**:

```
REST-iN-U Scale Estimates:

Users:
- Year 1: 10,000 active users
- Year 2: 100,000 active users
- Year 3: 1,000,000 active users

Properties:
- Year 1: 5,000 listings
- Year 2: 50,000 listings
- Year 3: 500,000 listings

Traffic:
- Peak: 1,000 requests/second
- Average: 100 requests/second
- Database queries: 5,000/second

Storage:
- Images: 10TB (Year 3)
- Database: 500GB (Year 3)
- Logs: 1TB/month

Infrastructure Requirements (Year 3):
- Application Servers: 20 instances
- Database: 5 read replicas
- Cache: 100GB Redis cluster
- CDN: 50TB/month transfer
```

<a name="scale-cache"></a>
### 7. Caching Strategies

**Multi-Level Caching for REST-iN-U**:

```typescript
// File: backend/src/cache/strategy.ts
import Redis from 'ioredis';

export class CacheStrategy {
    private redis: Redis;
    private localCache: Map<string, any>;
    
    constructor() {
        this.redis = new Redis(process.env.REDIS_URL);
        this.localCache = new Map();
    }
    
    async get(key: string): Promise<any> {
        // Level 1: Local memory cache
        if (this.localCache.has(key)) {
            return this.localCache.get(key);
        }
        
        // Level 2: Redis cache
        const cached = await this.redis.get(key);
        if (cached) {
            const value = JSON.parse(cached);
            this.localCache.set(key, value);
            return value;
        }
        
        return null;
    }
    
    async set(key: string, value: any, ttl: number = 3600): Promise<void> {
        // Set in both caches
        this.localCache.set(key, value);
        await this.redis.setex(key, ttl, JSON.stringify(value));
    }
    
    async invalidate(pattern: string): Promise<void> {
        // Clear local cache
        for (const key of this.localCache.keys()) {
            if (key.includes(pattern)) {
                this.localCache.delete(key);
            }
        }
        
        // Clear Redis cache
        const keys = await this.redis.keys(`*${pattern}*`);
        if (keys.length > 0) {
            await this.redis.del(...keys);
        }
    }
}
```

---

## QUICK REFERENCE

### System Design Checklist
- [ ] Architecture pattern chosen
- [ ] Scalability strategy defined
- [ ] Database design complete
- [ ] Caching strategy implemented
- [ ] Load balancing configured
- [ ] Monitoring setup
- [ ] Disaster recovery plan

### REST-iN-U Architecture Checklist
- [ ] Microservices defined
- [ ] API Gateway configured
- [ ] Database sharding strategy
- [ ] Caching layers implemented
- [ ] CDN for static assets
- [ ] Auto-scaling configured
- [ ] Monitoring dashboards

---

**END OF SYSTEM DESIGN GUIDE**

*This document provides production-ready system design patterns for scaling REST-iN-U.*

## SYSTEM DESIGN REAL-WORLD FAILURES

### Failure: Monolith Became Unmaintainable

**Story**: Single codebase grew to 500,000 lines. 50 developers. Every deploy broke something.

**Solution**: Gradual microservices migration

```
# Migration Strategy (Strangler Fig Pattern)
1. Identify bounded contexts
2. Extract one service at a time
3. Run both old + new in parallel
4. Gradually route traffic to new service
5. Deprecate old code

Timeline: 18 months for full migration
```

**Lesson**: Don't rewrite everything at once. Incremental migration.

---

### Failure: Database Became Bottleneck

**Story**: All services shared one PostgreSQL database. Couldn't scale.

**Solution**: Database per service + CQRS

```
Before (Single DB):
┌─────────┐
│ Service │ ──┐
└─────────┘   │
┌─────────┐   ├──► ┌──────────┐
│ Service │ ──┤    │PostgreSQL│
└─────────┘   │    └──────────┘
┌─────────┐   │
│ Service │ ──┘
└─────────┘

After (DB per Service):
┌─────────┐     ┌────┐
│ Service │ ──► │ DB │
└─────────┘     └────┘
┌─────────┐     ┌────┐
│ Service │ ──► │ DB │
└─────────┘     └────┘
┌─────────┐     ┌────┐
│ Service │ ──► │ DB │
└─────────┘     └────┘
```

---

### Failure: Cache Stampede Killed Database

**Story**: Cache expired. 10,000 requests hit database simultaneously. Database crashed.

**Solution**: Cache warming + stale-while-revalidate

```typescript
async function getProperty(id: string) {
    const cached = await redis.get(property:${id});
    
    if (cached) {
        const data = JSON.parse(cached);
        
        // If cache is about to expire, refresh in background
        const ttl = await redis.ttl(property:${id});
        if (ttl < 60) {  // Less than 1 minute left
            // Refresh in background, return stale data
            refreshPropertyCache(id);  // Async, no await
        }
        
        return data;
    }
    
    // Cache miss - fetch from DB
    const property = await db.property.findUnique({ where: { id } });
    await redis.setex(property:${id}, 3600, JSON.stringify(property));
    return property;
}
```

**Lesson**: Prevent thundering herd with smart caching.

---

### Failure: Circular Dependency Deadlock

**Story**: Service A calls Service B. Service B calls Service A. Deadlock. Both services down.

**Solution**: Async messaging + event-driven architecture

```
BAD (Synchronous):
Service A ──► Service B
    ▲             │
    └─────────────┘
    (Circular dependency!)

GOOD (Event-Driven):
Service A ──► Event Bus ──► Service B
    ▲                           │
    └───────── Event Bus ───────┘
    (No direct dependency)
```

**Lesson**: Use events to decouple services.

## DISTRIBUTED SYSTEMS PATTERNS

### The Saga Pattern (Handling Distributed Transactions)

**Scenario**: "Buy Property" action involves:
1. Charge Payment (Stripe Service)
2. Reserve Property (Property Service)
3. Generate Contract (Legal Service)
4. Email User (Notification Service)

**Failure**: Payment succeeds, but Property is already booked.
**Result**: User charged, no property. Inconsistent state.

**Solution**: Choreography-based Saga
1. **Payment Service**: Emits PaymentProcessed event.
2. **Property Service**: Listens. Tries to reserve. Fails. Emits ReservationFailed.
3. **Payment Service**: Listens to ReservationFailed. Executes **Compensating Transaction** (Refund).

**Lesson**: In microservices, you don't have ACID transactions. You have *Eventual Consistency* and *Compensations*.

---

### Idempotency: The Savior of Retries

**Scenario**: Network timeout. Client retries "Submit Order".
**Result**: User charged twice. Two contracts generated.

**The Fix**:
- Client generates UUID (idempotency-key) for every request.
- Server checks Redis: if (seen(key)) return cached_response.
- **Critical**: This check must happen *before* any side effects.

**Real World Note**: Stripe requires this. If you don't implement it, you *will* double-charge users during network blips.

---

### Rate Limiting Strategies

**Scenario**: Competitor scrapes your site. API crashes.

**Strategy 1: Token Bucket**
- Allow bursts (10 req/sec) but sustain average (2 req/sec).
- Good for normal user behavior.

**Strategy 2: Fixed Window**
- "1000 requests per hour".
- **Flaw**: Attacker sends 1000 requests at 10:59 and 1000 at 11:00. Server melts.

**Strategy 3: Sliding Window Log**
- Precise but expensive (stores timestamps).

**Production Choice**: Sliding Window Counter (Redis).
- Good balance of accuracy and memory usage.
- Use lua scripts in Redis to make check-and-decrement atomic.

