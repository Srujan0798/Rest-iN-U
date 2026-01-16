# REST-iN-U Known Issues

> Last Updated: January 16, 2026

This document tracks known issues and technical debt that need to be addressed.

---

## Open Issues

### 1. User Routes Disabled
**Status**: 🔴 Open  
**Location**: `backend/src/server.ts:27-30`  
**Issue**: The `routes/users.ts` file has a schema mismatch with the current Prisma User model.

**Details**:
- The User model in Prisma has evolved with additional fields (KYC, astrology, wallet)
- The old user routes reference deprecated or missing fields
- Routes are commented out to prevent runtime errors

**Resolution Options**:
1. Rebuild `routes/users.ts` from scratch using current schema
2. Use auth routes for user profile management
3. Create a new `profile.ts` route with proper typing

**Priority**: Medium  
**Assignee**: TBD

---

### 2. TypeScript Strict Mode Disabled
**Status**: 🟡 In Progress (Configurable via STRICT_BUILD env var)  
**Location**: `frontend/next.config.js`  

**Details**:
- TypeScript errors are ignored during builds for development speed
- Production builds should use `STRICT_BUILD=true` environment variable

**Resolution**:
- Already implemented: Set `STRICT_BUILD=true` in CI/CD production environment
- Gradually fix TypeScript errors across codebase

**Priority**: Low  

---

### 3. ESLint Warnings Pending  
**Status**: 🟡 In Progress (Configurable via STRICT_BUILD env var)  
**Location**: `frontend/next.config.js`  

**Details**:
- ESLint warnings ignored during development builds
- Set `STRICT_BUILD=true` in production CI/CD

**Priority**: Low

---

## Resolved Issues

_No resolved issues yet._

---

## How to Add Issues

Add new issues using this format:

```markdown
### [Issue Number]. [Short Title]
**Status**: 🔴 Open | 🟡 In Progress | 🟢 Resolved  
**Location**: `path/to/file:line`  
**Issue**: One-line description

**Details**:
- Bullet points with more context

**Resolution Options**:
1. Option A
2. Option B

**Priority**: Critical | High | Medium | Low  
**Assignee**: Name or TBD
```
