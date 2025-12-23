# 🛡️ SECURITY & COMPLIANCE - COMPLETE GUIDE
## Production-Grade Security, KYC/AML & Data Privacy

> **Based On**: OWASP Top 10 | GDPR/CCPA Requirements | Real Audit Findings  
> **Purpose**: Protect user data and ensure legal compliance  
> **Coverage**: Auth Security, KYC/AML, Data Encryption, Vulnerability Management

---

## 📋 TABLE OF CONTENTS

### PART 1: APPLICATION SECURITY
1. [OWASP Top 10 Mitigation](#owasp)
2. [JWT Security Best Practices](#jwt)
3. [Rate Limiting & DDoS Protection](#rate-limiting)

### PART 2: COMPLIANCE (KYC/AML)
4. [Identity Verification (Stripe/Onfido)](#kyc)
5. [Anti-Money Laundering Checks](#aml)
6. [Sanctions Screening](#sanctions)

### PART 3: DATA PRIVACY
7. [GDPR/CCPA Implementation](#gdpr)
8. [Data Encryption Strategy](#encryption)
9. [Data Deletion (Right to be Forgotten)](#deletion)

---

## PART 1: APPLICATION SECURITY

<a name="jwt"></a>
### 2. JWT Security Best Practices - Real Production Code

**PRODUCTION STORY**: We stored JWTs in LocalStorage. XSS attack stole them.
**FIX**: Store Access Token in memory, Refresh Token in **HttpOnly Cookie**.

```typescript
// File: backend/src/controllers/AuthController.ts

// Sending the token (Login)
res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,  // Prevent JS access (XSS protection)
    secure: true,    // HTTPS only
    sameSite: 'strict', // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

res.json({ accessToken: newAccessToken }); // Short lived (15 mins)
```

<a name="rate-limiting"></a>
### 3. Rate Limiting - Stopping Brute Force

**REALITY**: Bots will try to guess passwords.
**FIX**: Redis-based rate limiting.

```typescript
// File: backend/src/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

export const loginLimiter = rateLimit({
    store: new RedisStore({
        client: redisClient,
        prefix: 'rl:login:'
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per window
    message: 'Too many login attempts, please try again after 15 minutes'
});
```

---

## PART 2: COMPLIANCE (KYC/AML)

<a name="kyc"></a>
### 4. Identity Verification - Stripe Identity

**REQUIREMENT**: Real estate transactions > $10k require KYC (Know Your Customer).

```typescript
// File: backend/src/services/compliance/KYCService.ts
import Stripe from 'stripe';

class KYCService {
    async createVerificationSession(userId: string) {
        const session = await stripe.identity.verificationSessions.create({
            type: 'document',
            metadata: { user_id: userId },
            options: {
                document: {
                    require_matching_selfie: true, // Liveness check
                },
            },
        });
        return session.url;
    }

    async handleVerificationWebhook(event: Stripe.Event) {
        const session = event.data.object as Stripe.Identity.VerificationSession;
        if (session.status === 'verified') {
            await prisma.user.update({
                where: { id: session.metadata.user_id },
                data: { kyc_status: 'VERIFIED', kyc_verified_at: new Date() }
            });
        }
    }
}
```

---

## PART 3: DATA PRIVACY

<a name="deletion"></a>
### 9. Data Deletion (Right to be Forgotten)

**GDPR REQUIREMENT**: Users can request full data deletion.
**REALITY**: You can't delete *everything* (e.g., financial records must be kept for 7 years).

**Soft Delete vs Hard Delete**:
- **Transactions**: Keep for 7 years (Legal requirement).
- **Chat Logs**: Delete immediately.
- **Profile**: Anonymize (Replace name with "Deleted User").

```typescript
// File: backend/src/services/user/UserDeletionService.ts
async function deleteUser(userId: string) {
    // 1. Anonymize User Record
    await prisma.user.update({
        where: { id: userId },
        data: {
            name: 'Deleted User',
            email: `deleted_${userId}@restinu.com`,
            password_hash: 'DELETED',
            phone: null
        }
    });

    // 2. Delete Sensitive Data
    await prisma.chatMessage.deleteMany({ where: { sender_id: userId } });
    await prisma.searchHistory.deleteMany({ where: { user_id: userId } });

    // 3. Keep Transaction Logs (but unlink PII if possible)
    // Transactions are immutable
}
```

---

## REAL PRODUCTION ISSUES

### Issue #1: The "Admin" Role Escalation
**Scenario**: API endpoint `PUT /users/:id` allowed updating `role`.
**Attack**: User sent `{ "role": "ADMIN" }`.
**Fix**: Use DTOs (Data Transfer Objects) that strip sensitive fields before processing. Never blindly pass `req.body` to database.

### Issue #2: S3 Bucket Leaks
**Scenario**: User uploaded ID card for KYC. Bucket was public.
**Fix**: Enforce `Block Public Access` on all buckets. Use Presigned URLs for temporary access.

---

## QUICK REFERENCE

### Security Checklist
- [ ] HTTPS Everywhere
- [ ] HttpOnly Cookies for Tokens
- [ ] Rate Limiting on all APIs
- [ ] SQL Injection Protection (ORM/Prepared Statements)
- [ ] CSRF Protection
- [ ] Security Headers (Helmet.js)
- [ ] Dependency Scanning (npm audit)

**END OF GUIDE 19**
