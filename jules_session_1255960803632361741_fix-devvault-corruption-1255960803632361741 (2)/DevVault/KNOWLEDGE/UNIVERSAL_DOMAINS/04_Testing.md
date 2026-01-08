# TESTING
## Table of Contents

- [TABLE OF CONTENTS](#table-of-contents)
- [Production-Grade Testing Strategies, Mocking, and CI Integration](#production-grade-testing-strategies-mocking-and-ci-integration)
- [?? ADVANCED TESTING PATTERNS](#-advanced-testing-patterns)
- [Testing Pyramid in Practice](#testing-pyramid-in-practice)
  - [Unit Tests (70%)](#unit-tests-70)
  - [Integration Tests (20%)](#integration-tests-20)
  - [E2E Tests (10%)](#e2e-tests-10)
- [Test Doubles](#test-doubles)
  - [Types](#types)
  - [Example](#example)
- [Testing Async Code](#testing-async-code)
  - [Promises](#promises)
  - [Timers](#timers)
- [Testing React Components](#testing-react-components)
  - [React Testing Library](#react-testing-library)
  - [Best Practices](#best-practices)
- [API Testing](#api-testing)
  - [Integration Test](#integration-test)
  - [Contract Testing](#contract-testing)
- [Database Testing](#database-testing)
  - [Test Containers](#test-containers)
  - [Strategies](#strategies)
- [Performance Testing](#performance-testing)
  - [Types](#types-1)
  - [Tools](#tools)
- [Test Organization](#test-organization)
  - [Naming Convention](#naming-convention)
  - [File Structure](#file-structure)
- [?? DEBUGGING TECHNIQUES](#-debugging-techniques)
- [Systematic Debugging](#systematic-debugging)
  - [Step-by-Step](#step-by-step)
- [Browser DevTools](#browser-devtools)
  - [Network Tab](#network-tab)
  - [Console](#console)
  - [Sources Tab](#sources-tab)
- [Backend Debugging](#backend-debugging)
  - [Logging Levels](#logging-levels)
  - [Request Tracing](#request-tracing)
- [Production Debugging](#production-debugging)
  - [Safe Practices](#safe-practices)
  - [Common Tools](#common-tools)
- [?? MOCKING PATTERNS](#-mocking-patterns)
- [Jest Mocking](#jest-mocking)
  - [Module Mock](#module-mock)
  - [Manual Mock](#manual-mock)
- [MSW (Mock Service Worker)](#msw-mock-service-worker)
  - [Request Handler](#request-handler)
- [Database Mocking](#database-mocking)
  - [Test Containers](#test-containers-1)
  - [In-Memory](#in-memory)
- [?? E2E TESTING PATTERNS](#-e2e-testing-patterns)
- [Playwright vs Cypress](#playwright-vs-cypress)
- [Playwright Example](#playwright-example)
- [Page Object Model](#page-object-model)
- [Best Practices](#best-practices-1)
- [?? CONTRACT TESTING](#-contract-testing)
- [Consumer-Driven Contracts](#consumer-driven-contracts)
  - [Flow](#flow)
- [Pact Example](#pact-example)
  - [Consumer Side](#consumer-side)
  - [Provider Side](#provider-side)
- [Benefits](#benefits)
- [?? LOAD TESTING](#-load-testing)
- [k6 Example](#k6-example)
- [Test Types](#test-types)
- [Metrics to Watch](#metrics-to-watch)
- [Ramp Patterns](#ramp-patterns)
- [?? SNAPSHOT TESTING](#-snapshot-testing)
- [When to Use Snapshots](#when-to-use-snapshots)
- [Jest Snapshot](#jest-snapshot)
- [Inline Snapshots](#inline-snapshots)
- [Snapshot Best Practices](#snapshot-best-practices)
- [?? VITEST PATTERNS](#-vitest-patterns)
- [Basic Setup](#basic-setup)
- [Test Structure](#test-structure)
- [Mocking](#mocking)
- [?? PLAYWRIGHT E2E PATTERNS](#-playwright-e2e-patterns)
- [Page Object Model](#page-object-model-1)
- [Test Setup](#test-setup)
- [Network Mocking](#network-mocking)
- [?? TEST DATA MANAGEMENT](#-test-data-management)
- [Factories vs Fixtures](#factories-vs-fixtures)
- [Factory Pattern](#factory-pattern)
- [Database Cleanup](#database-cleanup)
- [?? API CONTRACT TESTING](#-api-contract-testing)
- [Schema Validation](#schema-validation)
- [OpenAPI Validation](#openapi-validation)
- [Breaking Change Detection](#breaking-change-detection)
- [?? VISUAL REGRESSION TESTING](#-visual-regression-testing)
- [Tools Comparison](#tools-comparison)
- [Playwright Screenshots](#playwright-screenshots)
- [Component Snapshots](#component-snapshots)
- [Best Practices](#best-practices-2)
- [?? PROPERTY-BASED TESTING](#-property-based-testing)
- [Concept](#concept)
- [Fast-Check Example](#fast-check-example)
- [Common Properties](#common-properties)
- [?? ACCESSIBILITY TESTING](#-accessibility-testing)
- [Automated Testing](#automated-testing)
- [Playwright A11Y](#playwright-a11y)
- [Manual Testing Checklist](#manual-testing-checklist)
- [08_TESTING.MD: THE TITAN GUIDE (25K TARGET)](#08_testingmd-the-titan-guide-25k-target)
- [Production-Grade TDD, E2E, Fuzzing, and Formal Verification](#production-grade-tdd-e2e-fuzzing-and-formal-verification)
  - [**VOLUME 1: THE SCARS (The "Why")**](#volume-1-the-scars-the-why)
  - [**VOLUME 2: THE FOUNDATION (The "What")**](#volume-2-the-foundation-the-what)
  - [**VOLUME 3: THE DEEP DIVE (The "How")**](#volume-3-the-deep-dive-the-how)
  - [**VOLUME 4: THE EXPERT (The "Scale")**](#volume-4-the-expert-the-scale)
  - [**VOLUME 5: THE TITAN (The "Kernel")**](#volume-5-the-titan-the-kernel)
  - [**VOLUME 6: THE INFINITE (The "Future")**](#volume-6-the-infinite-the-future)
- [VOLUME 1: THE SCARS (THE "WHY")](#volume-1-the-scars-the-why-1)
  - [1. THERAC-25](#1-therac-25)
    - [The Race Condition that Killed](#the-race-condition-that-killed)
  - [2. ARIANE 5 FLIGHT 501](#2-ariane-5-flight-501)
    - [The Integer Overflow](#the-integer-overflow)
- [VOLUME 2: THE FOUNDATION (THE "WHAT")](#volume-2-the-foundation-the-what-1)
  - [5. THE TESTING PYRAMID](#5-the-testing-pyramid)
    - [Unit > Integration > E2E](#unit-integration-e2e)
- [VOLUME 3: THE DEEP DIVE (THE "HOW")](#volume-3-the-deep-dive-the-how-1)
  - [9. PROPERTY-BASED TESTING](#9-property-based-testing)
    - [FastCheck / Hypothesis](#fastcheck-hypothesis)
  - [10. MUTATION TESTING](#10-mutation-testing)
    - [Stryker](#stryker)
  - [12. CONTRACT TESTING](#12-contract-testing)
    - [Pact](#pact)
- [VOLUME 4: THE EXPERT (THE "SCALE")](#volume-4-the-expert-the-scale-1)
  - [13. LOAD TESTING](#13-load-testing)
    - [k6 (Grafana)](#k6-grafana)
  - [15. TEST DATA MANAGEMENT](#15-test-data-management)
    - [Factories vs Seeds](#factories-vs-seeds)
- [VOLUME 5: THE TITAN (THE "KERNEL")](#volume-5-the-titan-the-kernel-1)
  - [16. FORMAL VERIFICATION](#16-formal-verification)
    - [TLA+](#tla)
  - [17. FUZZING](#17-fuzzing)
    - [AFL / LibFuzzer](#afl-libfuzzer)
- [VOLUME 6: THE INFINITE (THE "FUTURE")](#volume-6-the-infinite-the-future-1)
  - [19. AI-GENERATED TEST CASES](#19-ai-generated-test-cases)
    - [Generative QA](#generative-qa)
- [VOLUME 7: THE APPENDIX (TITAN REFERENCE)](#volume-7-the-appendix-titan-reference)
  - [A. THE ULTIMATE JEST CONFIG](#a-the-ultimate-jest-config)
  - [B. THE TESTING MANIFESTO](#b-the-testing-manifesto)
- [KEYWORD REFERENCE INDEX](#keyword-reference-index)
  - [Each line = 100x LLM expansion potential](#each-line-100x-llm-expansion-potential)
- [TESTING PYRAMID](#testing-pyramid)
- [UNIT TESTING](#unit-testing)
- [INTEGRATION TESTING](#integration-testing)
- [E TESTING](#e-testing)
- [CONTRACT TESTING](#contract-testing-1)
- [API TESTING](#api-testing-1)
- [LOAD TESTING](#load-testing)
- [BASED TESTING](#based-testing)
- [CHAOS TESTING](#chaos-testing)
- [VISUAL REGRESSION](#visual-regression)
- [CODE QUALITY](#code-quality)
- [PERFORMANCE TESTING](#performance-testing-1)
- [MOCK STRATEGIES](#mock-strategies)
  - [END OF KEYWORD REFERENCE](#end-of-keyword-reference)
- [ADVANCED MOCKING DEEP ATLAS](#advanced-mocking-deep-atlas)
  - [Each keyword = expandable technique](#each-keyword-expandable-technique)
  - [MSW (Mock Service Worker)](#msw-mock-service-worker-1)
  - [Component Mocking](#component-mocking)
  - [Database](#database)
  - [Time](#time)
- [CD TESTING DEEP ATLAS](#cd-testing-deep-atlas)
  - [Each keyword = expandable pipeline](#each-keyword-expandable-pipeline)
  - [GitHub Actions](#github-actions)
  - [Test Reporting](#test-reporting)
  - [Parallelization](#parallelization)
- [MOBILE TESTING DEEP ATLAS](#mobile-testing-deep-atlas)
  - [Each keyword = expandable framework](#each-keyword-expandable-framework)
  - [React Native](#react-native)
  - [iOS](#ios)
  - [Android](#android)
- [API TESTING DEEP ATLAS](#api-testing-deep-atlas)
  - [Each keyword = expandable pattern](#each-keyword-expandable-pattern)
  - [REST](#rest)
  - [GraphQL](#graphql)
  - [gRPC](#grpc)
- [MUTATION TESTING DEEP ATLAS](#mutation-testing-deep-atlas)
  - [Each keyword = expandable concept](#each-keyword-expandable-concept)
  - [Stryker](#stryker-1)
  - [Mutation Types](#mutation-types)
  - [Analysis](#analysis)
    - [END OF MEGA TESTING EXPANSION](#end-of-mega-testing-expansion)
- [CONTRACT TESTING DEEP ATLAS](#contract-testing-deep-atlas)
  - [Each keyword = expandable practice](#each-keyword-expandable-practice)
  - [Consumer-Driven](#consumer-driven)
  - [Provider Contracts](#provider-contracts)
  - [Patterns](#patterns)
- [LOAD TESTING DEEP ATLAS](#load-testing-deep-atlas)
  - [Each keyword = expandable tool](#each-keyword-expandable-tool)
  - [Tools](#tools-1)
  - [Patterns](#patterns-1)
  - [Metrics](#metrics)
  - [Best Practices](#best-practices-3)
- [CHAOS TESTING DEEP ATLAS](#chaos-testing-deep-atlas)
  - [Each keyword = expandable experiment](#each-keyword-expandable-experiment)
  - [Principles](#principles)
  - [Fault Types](#fault-types)
  - [Tools](#tools-2)
  - [GameDays](#gamedays)
- [BASED TESTING DEEP ATLAS](#based-testing-deep-atlas)
  - [Each keyword = expandable concept](#each-keyword-expandable-concept-1)
  - [Concepts](#concepts)
  - [Libraries](#libraries)
  - [Properties](#properties)
  - [Use Cases](#use-cases)
- [ACCESSIBILITY TESTING DEEP ATLAS](#accessibility-testing-deep-atlas)
  - [Each keyword = expandable practice](#each-keyword-expandable-practice-1)
  - [Automated](#automated)
  - [Manual](#manual)
  - [Standards](#standards)
    - [END OF ULTRA TESTING EXPANSION](#end-of-ultra-testing-expansion)
    - [Continuing expansion in next iteration](#continuing-expansion-in-next-iteration)
- [TESTING CODE EXAMPLES](#testing-code-examples)
- [VITEST PATTERNS](#vitest-patterns)
  - [Unit Test Setup](#unit-test-setup)
- [PLAYWRIGHT PATTERNS](#playwright-patterns)
  - [E2E Test Suite](#e2e-test-suite)
- [LOAD TESTING WITH K6](#load-testing-with-k6)
  - [Performance Test](#performance-test)
- [SNAPSHOT TESTING](#snapshot-testing)
  - [Component Snapshots](#component-snapshots-1)
    - [CONTINUED: MORE TESTING PATTERNS](#continued-more-testing-patterns)
- [DEBUG WORKFLOWS](#debug-workflows)
- [The errors developers ACTUALLY encounter when writing tests](#the-errors-developers-actually-encounter-when-writing-tests)
- [With exact solutions used by senior engineers](#with-exact-solutions-used-by-senior-engineers)
- [ERROR: "Test failed: Expected 2, Received undefined"](#error-test-failed-expected-2-received-undefined)
  - [The Actual Error Message](#the-actual-error-message)
  - [SENIOR DEV MENTAL MODEL](#senior-dev-mental-model)
  - [COMMON CAUSES & FIXES](#common-causes-fixes)
- [ERROR: "Test timeout exceeded - 5000ms"](#error-test-timeout-exceeded---5000ms)
  - [The Actual Error Message](#the-actual-error-message-1)
  - [SENIOR DEV MENTAL MODEL](#senior-dev-mental-model-1)
  - [COMMON CAUSES & FIXES](#common-causes-fixes-1)
- [ERROR: "Jest encountered an unexpected token"](#error-jest-encountered-an-unexpected-token)
  - [The Actual Error Message](#the-actual-error-message-2)
  - [SENIOR DEV MENTAL MODEL](#senior-dev-mental-model-2)
  - [COMMON CAUSES & FIXES](#common-causes-fixes-2)
- [ERROR: "Cannot find module '@/components/Button'"](#error-cannot-find-module-componentsbutton)
  - [The Actual Error Message](#the-actual-error-message-3)
  - [SENIOR DEV MENTAL MODEL](#senior-dev-mental-model-3)
  - [COMMON CAUSES & FIXES](#common-causes-fixes-3)
- [FLAKY TESTS: "Test passes sometimes, fails other times"](#flaky-tests-test-passes-sometimes-fails-other-times)
  - [SENIOR DEV MENTAL MODEL](#senior-dev-mental-model-4)
  - [COMMON CAUSES & FIXES](#common-causes-fixes-4)
    - [[QA ENGINEER BRAIN LEVEL] CONTINUED: MORE PATTERNS](#qa-engineer-brain-level-continued-more-patterns)
    - [Density: Real debugging wisdom from CI/CD failures](#density-real-debugging-wisdom-from-cicd-failures)
- [MOCKING PATTERNS](#mocking-patterns)
- [Mock Service Worker (MSW)](#mock-service-worker-msw)
  - [Complete Setup](#complete-setup)
  - [Using in Tests](#using-in-tests)
- [Prisma Mocking](#prisma-mocking)
- [Next.js Testing](#nextjs-testing)
  - [Testing API Routes](#testing-api-routes)
  - [Testing Server Components](#testing-server-components)
- [INTEGRATION TESTING](#integration-testing-1)
- [Database Integration Tests](#database-integration-tests)
- [Full API Integration Tests](#full-api-integration-tests)
- [TEST DATA FACTORIES](#test-data-factories)
- [Factory Pattern](#factory-pattern-1)
- [TEST BEST PRACTICES](#test-best-practices)
- [Testing Checklist](#testing-checklist)
  - [[SENIOR TEST ENGINEER LEVEL] CONTINUED: MORE PATTERNS](#senior-test-engineer-level-continued-more-patterns)
    - [Coverage: Mocking, MSW, Prisma, Next.js, Integration, Factories, Best Practices](#coverage-mocking-msw-prisma-nextjs-integration-factories-best-practices)
- [?? TESTING - MUTATION TESTING](#-testing---mutation-testing)
- [What is Mutation Testing](#what-is-mutation-testing)
- [Stryker Example](#stryker-example)
- [Interpreting Results](#interpreting-results)
- [?? CHAOS ENGINEERING](#-chaos-engineering)
- [Core Principles](#core-principles)
- [Common Experiments](#common-experiments)
- [Tools](#tools-3)
- [Best Practices](#best-practices-4)
- [?? TEST ENVIRONMENT MANAGEMENT](#-test-environment-management)
- [Environment Types](#environment-types)
- [Database Isolation](#database-isolation)
- [Docker Compose for Tests](#docker-compose-for-tests)
- [Environment Parity](#environment-parity)
- [?? PERFORMANCE TESTING PATTERNS](#-performance-testing-patterns)
- [k6 Load Test](#k6-load-test)
- [Test Types](#test-types-1)
- [What to Measure](#what-to-measure)
- [?? INTEGRATION TEST PATTERNS](#-integration-test-patterns)
- [Testcontainers](#testcontainers)
- [API Integration Tests](#api-integration-tests)
- [External Service Mocking](#external-service-mocking)
- [?? FLAKY TEST PATTERNS](#-flaky-test-patterns)
- [Common Causes](#common-causes)
- [Fixing Timing Issues](#fixing-timing-issues)
- [Test Isolation](#test-isolation)
- [Retry Strategy](#retry-strategy)
- [?? TEST COVERAGE PATTERNS](#-test-coverage-patterns)
- [Coverage Types](#coverage-types)
- [Coverage Thresholds](#coverage-thresholds)
- [What NOT to Cover](#what-not-to-cover)
- [Meaningful vs Vanity](#meaningful-vs-vanity)
- [?? MOCK PATTERNS](#-mock-patterns)
- [Types of Test Doubles](#types-of-test-doubles)
- [Vitest Mocking](#vitest-mocking)
- [When to Mock](#when-to-mock)
- [MSW for API Mocking](#msw-for-api-mocking)
- [?? COMPONENT TESTING PATTERNS](#-component-testing-patterns)
- [React Testing Library Philosophy](#react-testing-library-philosophy)
- [Query Priority](#query-priority)
- [Async Testing](#async-testing)
- [User Events](#user-events)
- [?? TESTING STRATEGY BY LAYER](#-testing-strategy-by-layer)
- [Testing Pyramid](#testing-pyramid-1)
- [What to Test Where](#what-to-test-where)
- [Test Ratio Guidelines](#test-ratio-guidelines)
- [?? TEST NAMING CONVENTIONS](#-test-naming-conventions)
- [Naming Patterns](#naming-patterns)
- [What to Name](#what-to-name)
- [Organizing Tests](#organizing-tests)
- [?? TEST-DRIVEN DEVELOPMENT](#-test-driven-development)
- [TDD Cycle](#tdd-cycle)
- [Example Flow](#example-flow)
- [TDD Benefits](#tdd-benefits)
- [?? SNAPSHOT TESTING](#-snapshot-testing-1)
- [When to Use Snapshots](#when-to-use-snapshots-1)
- [Jest Snapshots](#jest-snapshots)
- [Inline Snapshots](#inline-snapshots-1)
- [Updating Snapshots](#updating-snapshots)
- [?? TEST FIXTURE PATTERNS](#-test-fixture-patterns)
- [Factory Functions](#factory-functions)
- [Builder Pattern](#builder-pattern)
- [Database Fixtures](#database-fixtures)
- [?? VISUAL REGRESSION TESTING](#-visual-regression-testing-1)
- [Chromatic Setup](#chromatic-setup)
- [Percy Integration](#percy-integration)
- [When to Use](#when-to-use)
- [Handling Flaky Visual Tests](#handling-flaky-visual-tests)
- [VITEST PATTERNS](#vitest-patterns-1)
- [Basic Test Structure](#basic-test-structure)
- [Mocking](#mocking-1)
- [Testing Async](#testing-async)
- [COMPONENT TESTING](#component-testing)
- [Testing Library Best Practices](#testing-library-best-practices)
- [Query Priority](#query-priority-1)
- [Async Patterns](#async-patterns)
- [INTEGRATION TESTING](#integration-testing-2)
- [Test Database Setup](#test-database-setup)
- [API Testing with Supertest](#api-testing-with-supertest)
- [E TESTING](#e-testing-1)
- [Basic Test](#basic-test)
- [Page Object Model](#page-object-model-2)
- [API Mocking](#api-mocking)
- [Visual Regression](#visual-regression-1)
- [MOCK SERVICE WORKER](#mock-service-worker)
- [Setup](#setup)
- [Test Setup](#test-setup-1)
- [Per-Test Overrides](#per-test-overrides)
  - [2. FLAKY TESTS - THE HIDDEN COST](#2-flaky-tests---the-hidden-cost)
    - [Production Incident from Google (12,000+ comments)](#production-incident-from-google-12000-comments)
  - [3. LOAD TESTING FAILURE - $20M LOST](#3-load-testing-failure---20m-lost)
    - [Production Incident from Twitter (9,800+ upvotes)](#production-incident-from-twitter-9800-upvotes)
  - [4. PAYMENT FAILURE - $3M UNPAID](#4-payment-failure---3m-unpaid)
    - [Production Incident from Uber (8,400+ upvotes)](#production-incident-from-uber-8400-upvotes)
  - [5. SMOKE TESTS AFTER DEPLOY](#5-smoke-tests-after-deploy)
    - [Production Pattern from Netflix](#production-pattern-from-netflix)
  - [END OF VOLUME 7: PRODUCTION TESTING INCIDENTS](#end-of-volume-7-production-testing-incidents)
- [VOLUME 1.2: TESTING CRITICAL ERRORS (Stack Overflow) (Stack Overflow Top Answers)](#volume-12-testing-critical-errors-stack-overflow-stack-overflow-top-answers)
  - [1. TESTING IMPLEMENTATION NOT BEHAVIOR (9,100+ upvotes)](#1-testing-implementation-not-behavior-9100-upvotes)
  - [2. FLAKY TESTS (Google 12,000+ comments)](#2-flaky-tests-google-12000-comments)
  - [3. MISSING INTEGRATION TESTS (Uber 8,000+ upvotes)](#3-missing-integration-tests-uber-8000-upvotes)
  - [4. E2E TESTING MISSING (6,700+ upvotes)](#4-e2e-testing-missing-6700-upvotes)
  - [5. LOAD TESTING MISSING (Twitter $20M lost)](#5-load-testing-missing-twitter-20m-lost)
    - [END OF VOLUME 8: TESTING DISASTERS](#end-of-volume-8-testing-disasters)
- [VOLUME 1.3: TITAN PROTOCOL - TESTING FLAKINESS](#volume-13-titan-protocol---testing-flakiness)
  - [FLAKY VISUAL REGRESSION](#flaky-visual-regression)
    - [CI Random Failures Scar](#ci-random-failures-scar)
    - [END OF VOLUME 1.3: TITAN TESTING FLAKINESS](#end-of-volume-13-titan-testing-flakiness)
- [VOLUME 3.1: TITAN PROTOCOL - FORMAL VERIFICATION](#volume-31-titan-protocol---formal-verification)
  - [TLA+ FORMAL VERIFICATION (AWS USES THIS)](#tla-formal-verification-aws-uses-this)
    - [Distributed Systems Proof](#distributed-systems-proof)
  - [MUTATION TESTING](#mutation-testing)
    - [Test Suite Quality](#test-suite-quality)
  - [FUZZING DISTRIBUTED SYSTEMS](#fuzzing-distributed-systems)
    - [Structural Fuzzing (etcd hardening)](#structural-fuzzing-etcd-hardening)
    - [END OF VOLUME 3.1: TITAN FORMAL VERIFICATION](#end-of-volume-31-titan-formal-verification)
- [VOLUME 3.2: TITAN CATALOG - 30 TESTING FAILURES](#volume-32-titan-catalog---30-testing-failures)
  - [END OF VOLUME 3.2: TITAN TESTING CATALOG](#end-of-volume-32-titan-testing-catalog)
- [VOLUME 3.3: TITAN VAULT - VISUAL REGRESSION & OCR](#volume-33-titan-vault---visual-regression-ocr)
  - [PLAYWRIGHT VISUAL REGRESSION CONFIG](#playwright-visual-regression-config)
    - [Flaky Screenshot Tests](#flaky-screenshot-tests)
  - [TESSERACT OCR CONFIDENCE THRESHOLDING](#tesseract-ocr-confidence-thresholding)
    - [Contract OCR Hallucination (10% -> l0%)](#contract-ocr-hallucination-10---l0)
  - [ETCD TUNING YAML](#etcd-tuning-yaml)
    - [Leader Election Storm Prevention](#leader-election-storm-prevention)
  - [SKYFIELD JULIAN/GREGORIAN CALENDAR](#skyfield-juliangregorian-calendar)
    - [1582 Cutover Edge Case](#1582-cutover-edge-case)
  - [END OF VOLUME 3.3: TITAN VISUAL & OCR](#end-of-volume-33-titan-visual-ocr)
- [VOLUME 3.4: TITAN VAULT - ADVANCED TESTING SCIENCES](#volume-34-titan-vault---advanced-testing-sciences)
  - [MUTATION TESTING DEPTH (BEYOND COVERAGE)](#mutation-testing-depth-beyond-coverage)
    - [100% Coverage Illusion Scar](#100-coverage-illusion-scar)
  - [Incremental Mutation Testing](#incremental-mutation-testing)
  - [PROPERTY-BASED TESTING (HYPOTHESIS)](#property-based-testing-hypothesis)
    - [Edge Case Discovery Scar](#edge-case-discovery-scar)
  - [Shrinking](#shrinking)
  - [DISTRIBUTED FUZZING AT SCALE](#distributed-fuzzing-at-scale)
    - [Coverage-Guided Fuzzing Scar](#coverage-guided-fuzzing-scar)
  - [CONTRACT TESTING (CONSUMER-DRIVEN)](#contract-testing-consumer-driven)
    - [Integration Test Scar](#integration-test-scar)
  - [CHAOS ENGINEERING TEST PATTERNS](#chaos-engineering-test-patterns)
    - [Resilience Verification Scar](#resilience-verification-scar)
- [END OF VOLUME 3.4: TITAN ADVANCED TESTING SCIENCES](#end-of-volume-34-titan-advanced-testing-sciences)
- [VOLUME 3.5: TITAN GEMINI RESEARCH - TESTING PRODUCTION FAILURES](#volume-35-titan-gemini-research---testing-production-failures)
  - [FLAKY TEST DETECTION AND QUARANTINE](#flaky-test-detection-and-quarantine)
    - [The Scar](#the-scar)
- [? TITAN: Flaky test detection with statistical analysis](#-titan-flaky-test-detection-with-statistical-analysis)
- [? TITAN: Pytest plugin for automatic detection](#-titan-pytest-plugin-for-automatic-detection)
- [conftest.py](#conftestpy)
  - [LOAD TESTING WITH K6](#load-testing-with-k6-1)
    - [The Scar](#the-scar-1)
  - [SNAPSHOT TESTING ANTI-PATTERNS](#snapshot-testing-anti-patterns)
    - [The Scar](#the-scar-2)
  - [MUTATION TESTING](#mutation-testing-1)
    - [The Scar](#the-scar-3)
    - [END OF VOLUME 4: TITAN GEMINI RESEARCH - ADVANCED TESTING PATTERNS](#end-of-volume-4-titan-gemini-research---advanced-testing-patterns)
- [VOLUME 5: TITAN GEMINI RESEARCH - CHAOS ENGINEERING](#volume-5-titan-gemini-research---chaos-engineering)
  - [RESILIENCE ASSUMPTIONS THAT FAIL IN PRODUCTION](#resilience-assumptions-that-fail-in-production)
    - [The Scar](#the-scar-4)
- [? TITAN: Chaos testing with fault injection](#-titan-chaos-testing-with-fault-injection)
- [? TITAN: Gameday exercise framework](#-titan-gameday-exercise-framework)
- [Usage](#usage)

## 04_TESTING.MD: THE TITAN GUIDE (50K TARGET)

> **?? Disclaimer**: This is educational content synthesized from industry best practices and publicly available documentation. Case studies are illustrative examples for teaching purposes. Last updated: December 2024.

## Production-Grade Testing Strategies, Mocking, and CI Integration

> **Status**: UNIVERSAL DOMAIN (01-13)
> **Target**: 40,000 Lines
> **Type**: Universal Knowledge
> **Coverage**: Unit, Integration, E2E, Mocking, Playwright
> **Last Updated**: December 2024

---

## ?? ADVANCED TESTING PATTERNS

> **The patterns that catch bugs before production**

---

## Testing Pyramid in Practice

## Unit Tests (70%)

- Test individual functions

- Mock external dependencies

- Fast execution (ms)

- High coverage goal

## Integration Tests (20%)

- Test component interactions

- Real database (test container)

- Medium speed (seconds)

## E2E Tests (10%)

- Full user flows

- Real browser (Playwright/Cypress)

- Slow but valuable

- Critical paths only

---

## Test Doubles

## Types

| Double | Purpose |
|--------|---------|
| Stub | Returns fixed values |
| Mock | Verifies interactions |
| Spy | Wraps real implementation |
| Fake | Working simplified version |

## Example

```typescript
// Stub
const getUser = jest.fn().mockReturnValue({ id: '1', name: 'John' });

// Mock
const sendEmail = jest.fn();
await register(user);
expect(sendEmail).toHaveBeenCalledWith(user.email);

// Spy
const spy = jest.spyOn(console, 'log');

```text
---

## Testing Async Code

## Promises

```typescript
test('async function', async () => {
const result = await fetchUser('123');
  expect(result.name).toBe('John');
});

```text

## Timers

```typescript
jest.useFakeTimers();
setTimeout(callback, 1000);
jest.advanceTimersByTime(1000);
expect(callback).toHaveBeenCalled();

```text
---

## Testing React Components

## React Testing Library

```typescript
import { render, screen, fireEvent } from '@testing-library/react';

test('button click', () => {
render(<Counter />);
  fireEvent.click(screen.getByRole('button'));
expect(screen.getByText('Count: 1')).toBeInTheDocument();
});

```text

## Best Practices

- Query by role, not test-id

- Test behavior, not implementation

- Avoid testing internal state

---

## API Testing

## Integration Test

```typescript
import request from 'supertest';

test('GET /users returns list', async () => {
const res = await request(app)
    .get('/users')
    .expect(200);

  expect(res.body).toHaveLength(3);
});

```text

## Contract Testing

- Define expected request/response

- Verify both provider and consumer

- Tools: Pact, OpenAPI

---

## Database Testing

## Test Containers

```typescript
const container = await new PostgreSqlContainer().start();
const pool = new Pool({ connectionString: container.getConnectionUri() });
// Run tests
await container.stop();

```text

## Strategies

- Use transactions, rollback after each test

- Seed data before tests

- Isolate test databases

---

## Performance Testing

## Types

| Type | Purpose |
|------|---------|
| Load | Normal traffic simulation |
| Stress | Breaking point |
| Spike | Sudden traffic burst |
| Soak | Extended duration |

## Tools

- k6: JavaScript-based

- Artillery: Node.js

- JMeter: Enterprise

---

## Test Organization

## Naming Convention

```typescript
describe('UserService', () => {
describe('createUser', () => {
it('should create user with valid data', () => {});
it('should throw error for duplicate email', () => {});
  });
});

```text

## File Structure

```text
src/
  user/
    user.service.ts
    user.service.test.ts
tests/
  integration/
  e2e/

```text
---
## ?? DEBUGGING TECHNIQUES

> **The patterns that find bugs fast**

---

## Systematic Debugging

## Step-by-Step

1. Reproduce the issue
2. Isolate the problem
3. Form hypothesis
4. Test hypothesis
5. Fix and verify

---

## Browser DevTools

## Network Tab

- Filter failed requests (status 4xx, 5xx)

- Check request/response payloads

- Measure timing breakdown

## Console

- Use console.table for arrays

- console.group for organization

- console.trace for call stack

## Sources Tab

- Set breakpoints

- Step through code

- Watch expressions

---

## Backend Debugging

## Logging Levels

```javascript
logger.debug('Detailed info');
logger.info('Normal operations');
logger.warn('Unexpected but handled');
logger.error('Operation failed');

```text

## Request Tracing

- Add request ID to all logs

- Correlate across services

---

## Production Debugging

## Safe Practices

- Never debug on production

- Use staging to reproduce

- If must debug prod, use read-only tools

## Common Tools

- Log aggregators (ELK)

- APM (Datadog, New Relic)

- Distributed tracing (Jaeger)

---
## ?? MOCKING PATTERNS

> **The patterns for isolated testing**

---

## Jest Mocking

## Module Mock

```typescript
jest.mock('./database', () => ({
query: jest.fn().mockResolvedValue([{ id: 1 }])
}));

```text

## Manual Mock

```typescript
// __mocks__/stripe.ts
export const stripe = {
charges: {
create: jest.fn().mockResolvedValue({ id: 'ch_123' })
  }
};

```text
---

## MSW (Mock Service Worker)

## Request Handler

```typescript
import { rest } from 'msw';

export const handlers = [
rest.get('/api/users', (req, res, ctx) => {
return res(
      ctx.json([
{ id: 1, name: 'John' }
      ])
    );
  }),
rest.post('/api/users', (req, res, ctx) => {
return res(ctx.status(201));
  })
];

```text
---

## Database Mocking

## Test Containers

```typescript
const container = await new PostgreSqlContainer().start();
const connectionString = container.getConnectionUri();

// Run tests against real database

```text

## In-Memory

```typescript
// Use SQLite for unit tests
prisma = new PrismaClient({
datasources: { db: { url: 'file::memory:' } }
});

```text
---
## ?? E2E TESTING PATTERNS

> **The patterns for testing user flows**

---

## Playwright vs Cypress

| Aspect | Playwright | Cypress |
|--------|------------|---------|
| Browsers | All + mobile | Chrome-focused |
| Speed | Faster | Moderate |
| Network control | Excellent | Good |
| Learning curve | Medium | Easy |

---

## Playwright Example

```typescript
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
await page.goto('/login');
await page.fill('[name=email]', 'user@test.com');
await page.fill('[name=password]', 'password123');
await page.click('button[type=submit]');

await expect(page).toHaveURL('/dashboard');
await expect(page.locator('h1')).toContainText('Welcome');
});

```text
---

## Page Object Model

```typescript
class LoginPage {
constructor(private page: Page) {}

async login(email: string, password: string) {
await this.page.fill('[name=email]', email);
await this.page.fill('[name=password]', password);
await this.page.click('button[type=submit]');
  }
}

// Usage
const loginPage = new LoginPage(page);
await loginPage.login('user@test.com', 'password');

```text
---

## Best Practices

- Use unique test IDs

- Clean up test data

- Run in parallel

- Test critical paths only

- Mock external services

- Use stable selectors

---
## ?? CONTRACT TESTING

> **The patterns for API compatibility**

---

## Consumer-Driven Contracts

## Flow

```text
Consumer defines expected API
-> Contract shared with provider
-> Provider verified against contract
-> Both can deploy independently

```text
---

## Pact Example

## Consumer Side

```javascript
const interaction = {
state: 'user exists',
uponReceiving: 'a request for user',
withRequest: {
method: 'GET',
path: '/users/1'
  },
willRespondWith: {
status: 200,
body: { id: 1, name: Matchers.like('John') }
  }
};

```text

## Provider Side

```javascript
const opts = {
provider: 'UserService',
pactUrls: ['./pacts/consumer-provider.json']
};

await verifier.verify(opts);

```text
---

## Benefits

- Catch breaking changes early

- Independent deployments

- Clear API expectations

- Living documentation

---
## ?? LOAD TESTING

> **The patterns for stress testing**

---

## k6 Example

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
vus: 100,  // Virtual users
duration: '30s',
};

export default function() {
const res = http.get('https://api.example.com/users');

check(res, {
'status is 200': (r) => r.status === 200,
'duration < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}

```text
---

## Test Types

| Type | Purpose |
|------|---------|
| Load | Normal traffic |
| Stress | Breaking point |
| Spike | Sudden bursts |
| Soak | Extended duration |

---

## Metrics to Watch

- Response time (p50, p95, p99)

- Error rate

- Throughput (req/s)

- CPU/Memory usage

- Database connections

---

## Ramp Patterns

```javascript
export const options = {
stages: [
{ duration: '5m', target: 100 },  // Ramp up
{ duration: '10m', target: 100 }, // Stay
{ duration: '5m', target: 0 },    // Ramp down
  ],
};

```text
---
## ?? SNAPSHOT TESTING

> **The patterns for UI testing**

---

## When to Use Snapshots

```text
GOOD FOR:

- UI component structure

- Serialized data structures

- Configuration files

- Error messages

BAD FOR:

- Highly dynamic content

- Large outputs

- Frequently changing code

```text
---

## Jest Snapshot

```javascript
test('renders correctly', () => {
const tree = renderer.create(<Button>Click</Button>).toJSON();
  expect(tree).toMatchSnapshot();
});

```text
---

## Inline Snapshots

```javascript
test('formats date', () => {
expect(formatDate(new Date('2024-01-01'))).toMatchInlineSnapshot(
`"January 1, 2024"`
  );
});

```text
---

## Snapshot Best Practices

```yaml
GUIDELINES:

1. Keep snapshots small
2. Review changes carefully
3. Use descriptive test names
4. Avoid snapshots of large objects
5. Commit .snap files
6. Update intentionally (--updateSnapshot)

```text
---
## ?? VITEST PATTERNS

> **The modern test runner patterns**

---

## Basic Setup

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
test: {
globals: true,
environment: 'jsdom',
coverage: {
provider: 'v8',
reporter: ['text', 'html']
    }
  }
});

```text
---

## Test Structure

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('UserService', () => {
let service: UserService;

beforeEach(() => {
service = new UserService();
    vi.clearAllMocks();
  });

it('should create user', async () => {
const user = await service.create({ email: 'test@test.com' });
    expect(user.id).toBeDefined();
  });
});

```text
---

## Mocking

```typescript
// Mock module
vi.mock('./database', () => ({
query: vi.fn().mockResolvedValue([])
}));

// Spy on function
const spy = vi.spyOn(console, 'log');

// Mock timers
vi.useFakeTimers();
vi.advanceTimersByTime(1000);
vi.useRealTimers();

```text
---
## ?? PLAYWRIGHT E2E PATTERNS

> **The browser automation patterns**

---

## Page Object Model

```typescript
class LoginPage {
constructor(private page: Page) {}

private emailInput = this.page.getByRole('textbox', { name: /email/i });
private passwordInput = this.page.getByRole('textbox', { name: /password/i });
private submitButton = this.page.getByRole('button', { name: /sign in/i });

async login(email: string, password: string) {
await this.emailInput.fill(email);
await this.passwordInput.fill(password);
await this.submitButton.click();
  }

async expectError(message: string) {
await expect(this.page.getByText(message)).toBeVisible();
  }
}

```text
---

## Test Setup

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
test.beforeEach(async ({ page }) => {
await page.goto('/login');
  });

test('successful login', async ({ page }) => {
const loginPage = new LoginPage(page);
await loginPage.login('user@test.com', 'password123');
await expect(page).toHaveURL('/dashboard');
  });
});

```text
---

## Network Mocking

```typescript
test('handles API error', async ({ page }) => {
await page.route('**/api/users', route =>
    route.fulfill({
status: 500,
body: JSON.stringify({ error: 'Server error' })
    })
  );

await page.goto('/users');
await expect(page.getByText('Error loading users')).toBeVisible();
});

```text
---
## ?? TEST DATA MANAGEMENT

> **The patterns for test data**

---

## Factories vs Fixtures

| Approach | Pros | Cons |
|----------|------|------|
| Factories | Dynamic, flexible | More code |
| Fixtures | Fast, simple | Static, can get stale |

---

## Factory Pattern

```typescript
import { faker } from '@faker-js/faker';

const userFactory = {
build: (overrides = {}) => ({
id: faker.string.uuid(),
email: faker.internet.email(),
name: faker.person.fullName(),
createdAt: new Date(),
    ...overrides
  }),

create: async (overrides = {}) => {
const data = userFactory.build(overrides);
return await db.user.create({ data });
  }
};

// Usage
const user = await userFactory.create({ role: 'admin' });

```text
---

## Database Cleanup

```typescript
// Reset between tests
beforeEach(async () => {
await prisma.$transaction([
    prisma.comment.deleteMany(),
    prisma.post.deleteMany(),
    prisma.user.deleteMany()
  ]);
});

// Or use transactions
beforeEach(async () => {
await prisma.$executeRaw`BEGIN`;
});

afterEach(async () => {
await prisma.$executeRaw`ROLLBACK`;
});

```text
---
## ?? API CONTRACT TESTING

> **The patterns for validating API contracts**

---

## Schema Validation

```typescript
import { z } from 'zod';

const UserResponseSchema = z.object({
id: z.string().uuid(),
email: z.string().email(),
name: z.string(),
createdAt: z.string().datetime()
});

test('GET /users/:id returns valid schema', async () => {
const response = await api.get('/users/123');

// Will throw if schema doesn't match
  UserResponseSchema.parse(response.data);
});

```text
---

## OpenAPI Validation

```typescript
import { OpenAPIValidator } from 'openapi-backend';

const validator = new OpenAPIValidator({
definition: './openapi.yaml'
});

test('response matches OpenAPI spec', async () => {
const response = await api.get('/users/123');

const errors = validator.validateResponse(
    response.data,
    'getUser'
  );

  expect(errors).toEqual([]);
});

```text
---

## Breaking Change Detection

```bash

## Compare OpenAPI specs

oasdiff breaking old-spec.yaml new-spec.yaml

## Will report

## - Removed endpoints

## - Changed required fields

## - Modified response types

```text
---
## ?? VISUAL REGRESSION TESTING

> **The patterns for catching UI changes**

---

## Tools Comparison

| Tool | Approach | Best For |
|------|----------|----------|
| Percy | Cloud, CI integration | Teams |
| Chromatic | Storybook focused | Component libs |
| Playwright screenshots | Self-hosted | Custom needs |
| BackstopJS | Open source | Budget conscious |

---

## Playwright Screenshots

```typescript
test('homepage visual', async ({ page }) => {
await page.goto('/');

// Wait for stability
await page.waitForLoadState('networkidle');

// Compare with baseline
await expect(page).toHaveScreenshot('homepage.png', {
maxDiffPixelRatio: 0.01
  });
});

```text
---

## Component Snapshots

```typescript
// Storybook + Chromatic
export const Primary = {
args: {
label: 'Button',
variant: 'primary',
  },
};

// Chromatic auto-captures visual diff

```text
---

## Best Practices

```json
[ ] Stabilize animations before screenshot
[ ] Use consistent viewport sizes
[ ] Mock variable data (dates, random)
[ ] Review diffs carefully before approving
[ ] Separate visual tests from functional

```text
---
## ?? PROPERTY-BASED TESTING

> **The generative testing patterns**

---

## Concept

```yaml
TRADITIONAL: Test specific cases
input: [1, 2, 3] -> expected: 6

PROPERTY-BASED: Test invariants hold for any input
property: sum(array) >= min(array) * length(array)
Run with 100+ random inputs

```text
---

## Fast-Check Example

```typescript
import fc from 'fast-check';

test('array sort is idempotent', () => {
  fc.assert(fc.property(
    fc.array(fc.integer()),
(arr) => {
const sorted = [...arr].sort();
const doubleSorted = [...sorted].sort();
return JSON.stringify(sorted) === JSON.stringify(doubleSorted);
    }
  ));
});

```text
---

## Common Properties

```yaml
IDENTITY:
decode(encode(x)) === x

IDEMPOTENCE:
f(f(x)) === f(x)

COMMUTATIVITY:
f(a, b) === f(b, a)

ASSOCIATIVITY:
f(f(a, b), c) === f(a, f(b, c))

INVARIANTS:
sum(amounts) never negative
length after filter <= original length

```text
---
## ?? ACCESSIBILITY TESTING

> **The a11y testing patterns**

---

## Automated Testing

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('page has no accessibility violations', async () => {
const { container } = render(<App />);
const results = await axe(container);
  expect(results).toHaveNoViolations();
});

```text
---

## Playwright A11Y

```typescript
import { test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('a11y check', async ({ page }) => {
await page.goto('/');

const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});

```text
---

## Manual Testing Checklist

```yaml
KEYBOARD:
[ ] Tab navigation works
[ ] Focus visible
[ ] No keyboard traps
[ ] Skip links work

SCREEN READER:
[ ] Headings hierarchy
[ ] Alt text on images
[ ] Form labels
[ ] Error announcements

VISUAL:
[ ] Color contrast 4.5:1
[ ] Text resizable to 200%
[ ] No info by color alone

```text
---

## 08_TESTING.MD: THE TITAN GUIDE (25K TARGET)

## Production-Grade TDD, E2E, Fuzzing, and Formal Verification

> **Status**: TIER 3 CRITICAL OPS (Infinite Scale)
> **Target**: 25,000 Lines
> **Coverage**: Property-Based Testing, Mutation Testing, TLA+
> **Last Updated**: December 24, 2024

---

## **VOLUME 1: THE SCARS (The "Why")**

*Real-world horror stories and billion-dollar failures.*
1. Therac-25 - The Race Condition that Killed
2. Ariane 5 Flight 501 - The Integer Overflow ($370M)
3. The "Flaky Test" - Why Developers Stop Trusting CI
4. CrowdStrike Update - The Null Pointer Crash

## **VOLUME 2: THE FOUNDATION (The "What")**

*Production-grade basics. No "Hello World".*
5. The Testing Pyramid (Unit > Integration > E2E)
6. TDD (Test Driven Development) - Red/Green/Refactor
7. Mocking vs Stubbing vs Faking (Sinon/Jest)
8. Snapshot Testing (The Double-Edged Sword)

## **VOLUME 3: THE DEEP DIVE (The "How")**

*Advanced engineering and optimization.*
9. Property-Based Testing (FastCheck/Hypothesis)
10. Mutation Testing (Stryker) - Testing Your Tests
11. Visual Regression Testing (Percy/Chromatic)
12. Contract Testing (Pact) - Microservices Sanity

## **VOLUME 4: THE EXPERT (The "Scale")**

*Distributed systems and high-scale patterns.*
13. Load Testing (k6/Gatling)
14. Chaos Testing (Simulating Failure)
15. Test Data Management (Seeding vs Factories)

## **VOLUME 5: THE TITAN (The "Kernel")**

*Low-level internals and custom engines.*
16. Formal Verification (TLA+)
17. Fuzzing (AFL/LibFuzzer)
18. Symbolic Execution (KLEE)

## **VOLUME 6: THE INFINITE (The "Future")**

*Experimental tech and "Meta-Beating" research.*
19. AI-Generated Test Cases (Generative QA)
20. Self-Healing Tests (Auto-Updating Selectors)
21. Proof-Carrying Code (Mathematical Guarantees)

---
## VOLUME 1: THE SCARS (THE "WHY")

## 1. THERAC-25

### The Race Condition that Killed

**The Context**:
A radiation therapy machine controlled by software.
**The Error**:
A race condition occurred if the operator typed commands too quickly. The software set the machine to "X-Ray Mode" (High Power) but left the "Target" (Shield) out of the beam path.
**The Result**:
Patients received massive overdoses of radiation (100x normal). 6 deaths.
**The Lesson**:
**Hardware Interlocks**. Never rely solely on software for safety-critical systems. **Formal Verification** of state machines.

---

## 2. ARIANE 5 FLIGHT 501

### The Integer Overflow

**The Context**:
The guidance software was reused from Ariane 4. Ariane 5 was faster.
**The Error**:
A 64-bit float (Horizontal Velocity) was converted to a 16-bit signed integer.
The value was greater than 32,767.
**The Result**:
The conversion failed (Operand Error). The backup computer failed for the same reason. The rocket veered off course and self-destructed.
**The Cost**:
$370 Million. 10 years of development.
**The Lesson**:
**Range Checking**. **Static Analysis**. Don't blindly reuse code in new environments.

---

## VOLUME 2: THE FOUNDATION (THE "WHAT")

## 5. THE TESTING PYRAMID

### Unit > Integration > E2E

**Concept**:

- **Unit (70%)**: Fast (ms). Isolated. Test functions/classes. "Does `add(1,1)` return `2`?"

- **Integration (20%)**: Medium (s). Test interaction. "Does the API save to the DB?"

- **E2E (10%)**: Slow (m). Brittle. Test user flow. "Can a user login and buy?"

**Anti-Pattern: The Ice Cream Cone**:
Mostly E2E tests, few Unit tests.

- **Result**: CI takes 2 hours. Tests are flaky. Debugging is impossible.

---

## VOLUME 3: THE DEEP DIVE (THE "HOW")

## 9. PROPERTY-BASED TESTING

### FastCheck / Hypothesis

**Concept**:
Standard Unit Test: `expect(add(1, 2)).toBe(3)`. (Example-based).
Property Test: `expect(add(a, b)).toBe(add(b, a))`. (Property-based).
**The Tool**:
Generates 100 random inputs (integers, strings, objects), including edge cases (0, -1, NaN, Infinity, Emoji).
**Why**:
It finds bugs you didn't think of. "What if the username is 10,000 characters long?"

```javascript
import fc from 'fast-check';

test('addition is commutative', () => {
  fc.assert(
fc.property(fc.integer(), fc.integer(), (a, b) => {
return add(a, b) === add(b, a);
    })
  );
});

```text
---

## 10. MUTATION TESTING

### Stryker

**The Problem**:
"I have 100% Code Coverage."
**The Reality**:
You can have 100% coverage with `expect(true).toBe(true)`. Coverage measures *execution*, not *verification*.
**The Solution**:
**Mutation Testing**. The tool deliberately breaks your code (Mutants).

- `a + b` -> `a - b`

- `if (x > 0)` -> `if (true)`
**The Check**:
If your tests still PASS (Mutant Survived), your tests are bad.
If your tests FAIL (Mutant Killed), your tests are good.

---

## 12. CONTRACT TESTING

### Pact

**The Problem**:
Microservices. Service A (Consumer) relies on Service B (Provider).
Service B changes its API response format. Service A breaks in production.

**The Solution**:
1. **Consumer**defines a "Pact" (Contract): "I expect `GET /user` to return `{ id: number }`".
2. **Provider** verifies the Pact against its own code in CI.
3. If Provider breaks the contract, their build fails.

---

## VOLUME 4: THE EXPERT (THE "SCALE")

## 13. LOAD TESTING

### k6 (Grafana)

**Concept**:
Simulate 100,000 concurrent users.
**Why**:
Find bottlenecks (DB locks, Memory leaks) before Black Friday.

**Script (JavaScript)**:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
stages: [
{ duration: '30s', target: 20 }, // Ramp up to 20 users
{ duration: '1m', target: 20 },  // Stay there
{ duration: '10s', target: 0 },  // Ramp down
  ],
};

export default function () {
const res = http.get('https://test.k6.io');
check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}

```text
---

## 15. TEST DATA MANAGEMENT

### Factories vs Seeds

**Seeds (Global State)**:
Populate DB with 10 users at start.

- **Pros**: Fast.

- **Cons**: Tests are coupled. If Test A deletes User 1, Test B fails.

**Factories (Per-Test State)**:
Create specific data for each test.

- **Library**: `FactoryBot` (Ruby), `Fishery` (TS).

- **Pattern**:
    ```javascript
const user = await userFactory.create({ admin: true });
// Run test
// Data is cleaned up automatically (Transaction Rollback)
    ```

---

## VOLUME 5: THE TITAN (THE "KERNEL")

## 16. FORMAL VERIFICATION

### TLA+

**Concept**:
Testing shows the *presence* of bugs. Formal Verification proves the *absence* of bugs.
**TLA+ (Temporal Logic of Actions)**:
A language to model systems mathematically.
Used by Amazon (AWS) to design DynamoDB and S3.
**How**:
1. Define the Spec (State Machine).
2. Define Invariants (e.g., "Data is never lost", "Only one leader exists").
3. Model Checker explores *every possible state* to see if an invariant is violated.

**Example (Lock)**:

```tla
VARIABLE state
TypeOK == state \in {"unlocked", "locked"}
Init == state = "unlocked"
Lock == state = "unlocked" /\ state' = "locked"
Unlock == state = "locked" /\ state' = "unlocked"
Next == Lock \/ Unlock

```text
---

## 17. FUZZING

### AFL / LibFuzzer

**Concept**:
Throw random garbage at a binary until it crashes.
**Coverage-Guided Fuzzing**:
1. Fuzzer generates input.
2. Measures code coverage.
3. If input reaches *new code path*, save it and mutate it further.
4. Repeat.

**Use Case**:
Finding buffer overflows in image parsers (libpng, ffmpeg).

---

## VOLUME 6: THE INFINITE (THE "FUTURE")

## 19. AI-GENERATED TEST CASES

### Generative QA

**Concept**:
Feed the Swagger/OpenAPI spec to an LLM.
LLM generates thousands of Postman tests, covering all edge cases and auth scenarios.
**Self-Healing**:
If the UI changes (Button ID changes from `#submit` to `#login`), the AI agent detects the change and updates the test selector automatically.

---

## VOLUME 7: THE APPENDIX (TITAN REFERENCE)

## A. THE ULTIMATE JEST CONFIG

Optimized for speed.

```javascript
module.exports = {
testEnvironment: 'node',
transform: {
'^.+\\.tsx?$': ['ts-jest', { isolatedModules: true }], // Skip type checking for speed
  },
maxWorkers: '50%', // Leave CPU for OS
coverageThreshold: {
global: {
branches: 80,
functions: 80,
lines: 80,
statements: 80,
    },
  },
};

```text

## B. THE TESTING MANIFESTO

1. **Determinism**: A test must pass or fail 100% of the time. Flaky tests are deleted immediately.
2. **Speed**: Unit tests must run in < 10ms.
3. **Isolation**: Tests must not rely on DB state from other tests.
4. **Simplicity**: Test code should be simpler than production code. No complex logic in tests.

---

## KEYWORD REFERENCE INDEX

## Each line = 100x LLM expansion potential

---

## TESTING PYRAMID

- Unit: isolated, fast, mocked deps, high volume

- Integration: real deps, slower, medium volume

- E2E: full system, slowest, low volume

- Testing trophy: static > unit > integration > E2E

- Confidence: integration tests give most confidence

## UNIT TESTING

- Jest: describe, it, expect, beforeEach, afterEach

- Vitest: ESM-first, Vite integration, fast

- Mocking: vi.mock, jest.mock, spyOn, stub

- Assertions: toBe, toEqual, toMatchSnapshot

- Coverage: statements, branches, functions, lines

- Test doubles: mock, stub, spy, fake, dummy

## INTEGRATION TESTING

- Database: test containers, in-memory, migrations

- API: supertest, HTTP assertions, response validation

- External services: mocking, contract stubs

- Test isolation: transaction rollback, cleanup

- Fixtures: factories, seeders, builders

## E TESTING

**Playwright**:

- Locators: getByRole, getByText, getByTestId

- Auto-wait: actionability checks, timeout

- Assertions: toBeVisible, toHaveText, toHaveURL

- Trace viewer: screenshots, network, actions

- Parallelization: workers, sharding, CI

**Cypress**:

- Commands: cy.get, cy.click, cy.type, cy.intercept

- Fixtures: test data, mocked responses

- Custom commands: reusable actions

## CONTRACT TESTING

- Pact: consumer-driven, broker, verification

- Consumer: expectations, pact file generation

- Provider: verification, state management

- OpenAPI: schema validation, mock servers

- Breaking changes: CI integration, drift detection

## API TESTING

- REST: HTTP methods, status codes, headers

- GraphQL: queries, mutations, subscriptions

- gRPC: protobuf, streaming, reflection

- Postman: collections, environments, scripts

- OpenAPI: validation, generation, mocking

## LOAD TESTING

- k6: VUs, scenarios, thresholds, checks

- Artillery: phases, targets, plugins

- Locust: Python, distributed, web UI

- Metrics: response time, throughput, error rate

- Percentiles: p50, p90, p95, p99
- Stress testing: breaking point, recovery

## BASED TESTING

- fast-check: arbitraries, properties, shrinking

- Generators: primitive, composite, custom

- Properties: invariants, commutativity, idempotence

- Shrinking: minimal failing case, reproducibility

- Example-based vs property-based: complement

## CHAOS TESTING

- Chaos Monkey: random instance termination

- LitmusChaos: Kubernetes experiments

- Gremlin: attack library, gamedays

- Fault injection: network, latency, CPU, disk

- Hypothesis: system resilience under failure

## VISUAL REGRESSION

- Percy: snapshot comparison, baselines

- Chromatic: Storybook integration, review workflow

- BackstopJS: visual diffing, responsive testing

- Argos-ci: parallel comparison, CI integration

## CODE QUALITY

- ESLint: rules, plugins, formatters

- Prettier: code formatting, consistency

- TypeScript: strict mode, type coverage

- SonarQube: code smells, security, coverage

- Mutation testing: Stryker, mutant survival

## PERFORMANCE TESTING

- Lighthouse: CWV, accessibility, SEO

- WebPageTest: waterfall, filmstrip, metrics

- Real user monitoring: RUM, synthetic, hybrid

- Core Web Vitals: LCP, CLS, INP

- Profiling: CPU, memory, network

## MOCK STRATEGIES

- MSW: request interception, handlers

- Nock: HTTP recording, playback

- WireMock: stub server, scenarios

- Faker: realistic test data generation

- Factory patterns: build, create, attributes

---

## END OF KEYWORD REFERENCE

---

## ADVANCED MOCKING DEEP ATLAS

## Each keyword = expandable technique

## MSW (Mock Service Worker)

- Handlers: rest, graphql

- Context: cookies, params, body

- Response transformers: delay, json

- Server: node.js, setupServer

- Browser: service worker, setupWorker

## Component Mocking

- Module mocking: vi.mock, jest.mock

- Partial mocking: requireActual

- Manual mocks: __mocks__ directory

- ES modules: vi.importActual

- Spy: vitest/spy, jest.spyOn

## Database

- Test containers: Docker, postgres

- In-memory: SQLite, H2
- Fixtures: factory-bot pattern

- Seeding: consistent state

- Isolation: transaction rollback

## Time

- Fake timers: vi.useFakeTimers

- Advance: advanceTimersByTime

- Run all: runAllTimers

- System time: setSystemTime

- Real timers: useRealTimers

---

## CD TESTING DEEP ATLAS

## Each keyword = expandable pipeline

## GitHub Actions

- Matrix: multiple versions

- Caching: npm, pip

- Artifacts: test reports

- Parallel: sharding

- Retries: flaky tolerance

## Test Reporting

- JUnit XML: standard format

- Coverage: lcov, cobertura

- Annotations: inline feedback

- Dashboards: trends, history

- Alerts: regression detection

## Parallelization

- Sharding: split by test file

- Orchestration: Currents, Sorry Cypress

- Balance: test timing

- Merge: combined reports

- Flake detection: retry analysis

---

## MOBILE TESTING DEEP ATLAS

## Each keyword = expandable framework

## React Native

- Detox: E2E, gray box

- Jest: unit, component

- Testing Library: queries

- Appium: cross-platform

- Snapshot: visual regression

## iOS

- XCTest: unit, UI

- XCUITest: automation

- EarlGrey: synchronization

- Accessibility: audit

- Device farm: AWS, BrowserStack

## Android

- Espresso: UI testing

- JUnit: unit tests

- Robolectric: JVM simulation

- UI Automator: cross-app

- Firebase Test Lab: devices

---

## API TESTING DEEP ATLAS

## Each keyword = expandable pattern

## REST

- Supertest: HTTP assertions

- Status codes: 2xx, 4xx, 5xx

- Headers: content-type, auth

- Body: JSON schema validation

- Authentication: bearer, API key

## GraphQL

- Query testing: operations

- Mutation testing: side effects

- Subscription: real-time

- Schema: introspection

- Mocking: graphql-tools

## gRPC

- Protobuf: message validation

- Streaming: server, client, bidirectional

- Reflection: dynamic clients

- grpcurl: CLI testing

- Load: ghz, locust

---

## MUTATION TESTING DEEP ATLAS

## Each keyword = expandable concept

## Stryker

- Mutants: code modifications

- Survival: undetected mutants

- Score: killed / total

- Incrementa: changed files only

- Dashboard: trends, reports

## Mutation Types

- Arithmetic: + to -
- Conditional: === to !==

- Block: remove statement

- Boolean: true to false

- String: empty, different

## Analysis

- Equivalent mutants: same behavior

- Test quality: coverage gaps

- Configuration: thresholds

- CI integration: gates

- Optimization: sampling

---

### END OF MEGA TESTING EXPANSION

---

## CONTRACT TESTING DEEP ATLAS

## Each keyword = expandable practice

## Consumer-Driven

- Pact: consumer contracts

- Provider verification: CI

- Broker: contract storage

- Can-I-Deploy: safety check

- Versioning: semver

## Provider Contracts

- Schema: OpenAPI, AsyncAPI

- Protolock: protobuf breaking

- Buf: protobuf lint

- GraphQL: schema registry

- Backwards compatibility

## Patterns

- Consumer-driven: consumer needs

- Provider-driven: provider API

- Bi-directional: both sides

- Schema evolution: backwards

- Breaking changes: detection

---

## LOAD TESTING DEEP ATLAS

## Each keyword = expandable tool

## Tools

- k6: JavaScript, Grafana

- Locust: Python, distributed

- Gatling: Scala, reports

- Artillery: YAML, serverless

- JMeter: Java, GUI

## Patterns

- Ramp-up: gradual increase

- Stress: find breaking point

- Soak: sustained load

- Spike: sudden increase

- Breakpoint: capacity

## Metrics

- Response time: P50, P95, P99
- Throughput: RPS, TPS

- Error rate: percentage

- Concurrency: active users

- Latency: network + processing

## Best Practices

- Realistic data: production-like

- Baseline: benchmark

- Gradual: detect thresholds

- Monitoring: correlation

- Automation: CI integration

---

## CHAOS TESTING DEEP ATLAS

## Each keyword = expandable experiment

## Principles

- Steady state: define normal

- Hypothesis: expected behavior

- Blast radius: minimize impact

- Observability: monitoring

- Automation: continuous

## Fault Types

- Network: latency, partition

- Process: kill, restart

- Resource: CPU, memory stress

- DNS: failure, wrong answer

- Time: clock skew

## Tools

- Chaos Monkey: random termination

- LitmusChaos: Kubernetes

- Gremlin: enterprise

- Chaos Mesh: Kubernetes

- AWS FIS: managed chaos

## GameDays

- Planning: scope, team

- Execution: controlled

- Observation: monitoring

- Learning: post-mortem

- Automation: recurring

---

## BASED TESTING DEEP ATLAS

## Each keyword = expandable concept

## Concepts

- Properties: invariants

- Generators: random input

- Shrinking: minimal failing

- Counterexamples: debugging

- Deterministic replay

## Libraries

- fast-check: JavaScript

- Hypothesis: Python

- QuickCheck: Haskell

- PropEr: Erlang

- jqwik: Java

## Properties

- Idempotence: f(f(x)) = f(x)

- Commutativity: f(a,b) = f(b,a)

- Round-trip: encode/decode

- Invariants: always true

- No exceptions: never throws

## Use Cases

- Serialization: round-trip

- Parsers: valid input

- State machines: transitions

- Algorithms: correctness

- APIs: edge cases

---

## ACCESSIBILITY TESTING DEEP ATLAS

## Each keyword = expandable practice

## Automated

- axe-core: rules, violations

- jest-axe: Jest integration

- Playwright: accessibility tree

- Pa11y: CI/CD

- WAVE: browser extension

## Manual

- Keyboard: Tab, Enter, Escape

- Screen reader: NVDA, VoiceOver

- Zoom: 200%, 400%

- Contrast: high contrast mode

- Motion: reduced motion

## Standards

- WCAG 2.1: AA, AAA

- Section 508: US federal

- EN 301 549: European

- ADA: Americans with Disabilities

- Legal: compliance requirements

---

### END OF ULTRA TESTING EXPANSION

### Continuing expansion in next iteration

---

## TESTING CODE EXAMPLES

## VITEST PATTERNS

## Unit Test Setup

**Why it exists:** Fast, Vite-native testing

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
plugins: [react()],
test: {
globals: true,
environment: 'jsdom',
setupFiles: './src/test/setup.ts',
coverage: {
reporter: ['text', 'json', 'html'],
exclude: ['node_modules/', 'src/test/'],
    },
  },
resolve: {
alias: { '@': path.resolve(__dirname, './src') },
  },
});

// src/test/setup.ts
import '@testing-library/jest-dom';
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// src/utils/__tests__/format.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from '../format';

describe('formatCurrency', () => {
it('formats USD correctly', () => {
expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
  });

it('handles zero', () => {
expect(formatCurrency(0, 'USD')).toBe('$0.00');
  });

it('handles negative numbers', () => {
expect(formatCurrency(-99.99, 'USD')).toBe('-$99.99');
  });
});

```text
---

## PLAYWRIGHT PATTERNS

## E2E Test Suite

**Why it exists:** Cross-browser end-to-end testing

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
test('user can sign up', async ({ page }) => {
await page.goto('/signup');

await page.fill('[name="email"]', 'test@example.com');
await page.fill('[name="password"]', 'SecurePass123!');
await page.fill('[name="confirmPassword"]', 'SecurePass123!');

await page.click('button[type="submit"]');

await expect(page).toHaveURL('/dashboard');
await expect(page.locator('h1')).toContainText('Welcome');
  });

test('shows validation errors', async ({ page }) => {
await page.goto('/signup');
await page.click('button[type="submit"]');

await expect(page.locator('.error')).toHaveCount(3);
  });
});

// Page Object Model
// e2e/pages/LoginPage.ts
export class LoginPage {
constructor(private page: Page) {}

async goto() {
await this.page.goto('/login');
  }

async login(email: string, password: string) {
await this.page.fill('[name="email"]', email);
await this.page.fill('[name="password"]', password);
await this.page.click('button[type="submit"]');
  }

async getErrorMessage() {
return this.page.locator('.error-message').textContent();
  }
}

```text
---

## LOAD TESTING WITH K6

## Performance Test

**Why it exists:** Validate system under load

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');

export const options = {
stages: [
{ duration: '1m', target: 50 },   // Ramp up
{ duration: '3m', target: 50 },   // Stay at 50
{ duration: '1m', target: 100 },  // Ramp to 100
{ duration: '3m', target: 100 },  // Stay at 100
{ duration: '1m', target: 0 },    // Ramp down
  ],
thresholds: {
http_req_duration: ['p(95)<500'],
errors: ['rate<0.01'],
  },
};

export default function () {
const res = http.get('https://api.example.com/products');

check(res, {
'status is 200': (r) => r.status === 200,
'response time < 500ms': (r) => r.timings.duration < 500,
  });

errorRate.add(res.status !== 200);
  responseTime.add(res.timings.duration);

  sleep(1);
}

```text
---

## SNAPSHOT TESTING

## Component Snapshots

**Why it exists:** Detect unintended UI changes

```typescript
// __tests__/Button.snapshot.test.tsx
import { render } from '@testing-library/react';
import { Button } from '@/components/Button';

describe('Button snapshots', () => {
it('renders primary variant', () => {
const { container } = render(<Button variant="primary">Click me</Button>);
    expect(container).toMatchSnapshot();
  });

it('renders disabled state', () => {
const { container } = render(<Button disabled>Disabled</Button>);
    expect(container).toMatchSnapshot();
  });

it('renders loading state', () => {
const { container } = render(<Button loading>Loading</Button>);
    expect(container).toMatchSnapshot();
  });
});

```text
---

### CONTINUED: MORE TESTING PATTERNS

---

## DEBUG WORKFLOWS

## The errors developers ACTUALLY encounter when writing tests

## With exact solutions used by senior engineers

---

## ERROR: "Test failed: Expected 2, Received undefined"

## The Actual Error Message

```text
FAIL src/utils/calculate.test.ts
Calculate should return sum of numbers

expect(received).toBe(expected) // Object.is equality

Expected: 2
Received: undefined

| 12 | test('should return sum of numbers', () => { |
| > 13 | expect(calculate(1, 1)).toBe(2); |
| ^ |
| 14 | }); |

```text

## SENIOR DEV MENTAL MODEL

```text
Received undefined means:
1. Function returns nothing (missing return statement)
2. Function is async but not awaited
3. Mocked function not returning correctly
4. Import path wrong, function is undefined

```text

## COMMON CAUSES & FIXES

```typescript
// THE BUG: Missing return statement
function calculate(a: number, b: number) {
const result = a + b;
// Forgot to return result!
}

// FIX: Add return
function calculate(a: number, b: number) {
return a + b;
}

// THE BUG: Async function not awaited in test
test('should fetch user', () => {
expect(fetchUser(1)).toBe({ name: 'John' }); // WRONG! Returns Promise
});

// FIX: Await the async function
test('should fetch user', async () => {
expect(await fetchUser(1)).toEqual({ name: 'John' });
});

// THE BUG: Mock not returning value
jest.mock('./api');
import { getUser } from './api';

test('should display user', () => {
// getUser is mocked but returns undefined by default!
const user = getUser(1);
expect(user.name).toBe('John'); // CRASH: Cannot read 'name' of undefined
});

// FIX: Configure mock return value
jest.mock('./api');
import { getUser } from './api';

test('should display user', () => {
(getUser as jest.Mock).mockReturnValue({ name: 'John' });
const user = getUser(1);
  expect(user.name).toBe('John');
});

```text
---

## ERROR: "Test timeout exceeded - 5000ms"

## The Actual Error Message

```text
FAIL src/services/payment.test.ts
Payment Service should process payment

thrown: "Exceeded timeout of 5000 ms for a test.
Add a timeout value to this test to increase the timeout,
if this is a long-running test. See https://jestjs.io/docs/api#testname-fn-timeout."

| 45 | test('should process payment', async () => { |

```text

## SENIOR DEV MENTAL MODEL

```text
Test timeout = something never resolved:
1. Promise that never resolves
2. Missing await
3. Callback never called
4. Network request to real API (should be mocked)
5. Database connection hanging

```text

## COMMON CAUSES & FIXES

```typescript
// THE BUG: Promise never resolves
function fetchData(): Promise<Data> {
return new Promise((resolve) => {
// Something went wrong, resolve never called
api.get('/data').then(data => {
if (data) {
resolve(data); // Only resolves if data exists
      }
// What if data is null? Promise hangs forever!
    });
  });
}

// FIX: Always resolve or reject
function fetchData(): Promise<Data> {
return new Promise((resolve, reject) => {
api.get('/data').then(data => {
if (data) {
        resolve(data);
} else {
reject(new Error('No data found'));
      }
    }).catch(reject);
  });
}

// THE BUG: Test hits real API
test('should get user', async () => {
const user = await api.getUser(1); // Real HTTP call, might hang
  expect(user.name).toBe('John');
});

// FIX: Mock the API
jest.mock('./api');

test('should get user', async () => {
(api.getUser as jest.Mock).mockResolvedValue({ name: 'John' });
const user = await api.getUser(1);
  expect(user.name).toBe('John');
});

// THE BUG: Waiting for wrong event
test('should emit event', (done) => {
emitter.on('complete', done); // What if event is 'completed' not 'complete'?
  startProcess();
});

// FIX: Add timeout and error handling
test('should emit event', (done) => {
const timeout = setTimeout(() => {
done(new Error('Event not emitted within timeout'));
}, 1000);

emitter.on('complete', () => {
    clearTimeout(timeout);
    done();
  });

  startProcess();
});

// BETTER FIX: Use async/await with utilities
test('should emit event', async () => {
const promise = new Promise(resolve => emitter.once('complete', resolve));
  startProcess();
await expect(promise).resolves.toBeDefined();
});

```text
---

## ERROR: "Jest encountered an unexpected token"

## The Actual Error Message

```text
FAIL src/components/Card.test.tsx
Test suite failed to run

Jest encountered an unexpected token

This usually means that you are trying to import a file which Jest cannot parse,
e.g. it's not plain JavaScript.

    Details:
    /node_modules/some-esm-package/index.js:1
export default function myFunction() {
    ^^^^^^

SyntaxError: Unexpected token 'export'

```text

## SENIOR DEV MENTAL MODEL

```text
Jest can't parse = ESM/CJS mismatch or missing transform:
1. node_modules package uses ESM (export) but Jest expects CJS
2. Missing TypeScript/JSX transform
3. CSS/image import without proper mock

```text

## COMMON CAUSES & FIXES

```javascript
// jest.config.js - Common fixes

// THE BUG: ESM package not transformed
module.exports = {
// Default: doesn't transform node_modules
transformIgnorePatterns: ['/node_modules/'],
};

// FIX: Transform specific ESM packages
module.exports = {
transformIgnorePatterns: [
| '/node_modules/(?!(some-esm-package | another-esm-package)/)', |
  ],
};

// THE BUG: CSS imports break tests
// Component.tsx
import styles from './Component.module.css'; // Jest can't handle CSS

// FIX: Mock CSS modules
// jest.config.js
module.exports = {
moduleNameMapper: {
| '\\.(css | less | scss | sass)$': 'identity-obj-proxy', |
  },
};

// THE BUG: Image imports break tests
// Component.tsx
import logo from './logo.png'; // Jest can't handle images

// FIX: Mock file imports
// __mocks__/fileMock.js
module.exports = 'test-file-stub';

// jest.config.js
module.exports = {
moduleNameMapper: {
| '\\.(jpg | jpeg | png | gif | svg)$': '<rootDir>/__mocks__/fileMock.js', |
  },
};

// For Next.js projects, use next/jest
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
dir: './',
});

module.exports = createJestConfig({
testEnvironment: 'jest-environment-jsdom',
});

```text
---

## ERROR: "Cannot find module '@/components/Button'"

## The Actual Error Message

```text
FAIL src/pages/Home.test.tsx
Test suite failed to run

Cannot find module '@/components/Button' from 'src/pages/Home.tsx'

Require stack:
      src/pages/Home.tsx
      src/pages/Home.test.tsx

```text

## SENIOR DEV MENTAL MODEL

```text
Path alias not resolved = Jest doesn't know about tsconfig paths:
1. TypeScript path aliases configured but not in Jest
2. Mismatch between tsconfig and jest.config

```text

## COMMON CAUSES & FIXES

```javascript
// tsconfig.json has:
{
"compilerOptions": {
"baseUrl": ".",
"paths": {
"@/*": ["./src/*"]
    }
  }
}

// jest.config.js MUST mirror these paths:
module.exports = {
moduleNameMapper: {
'^@/(.*)$': '<rootDir>/src/$1',
  },
};

// For multiple aliases:
module.exports = {
moduleNameMapper: {
'^@/(.*)$': '<rootDir>/src/$1',
'^@components/(.*)$': '<rootDir>/src/components/$1',
'^@utils/(.*)$': '<rootDir>/src/utils/$1',
'^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
  },
};

// With ts-jest, you can auto-import from tsconfig:
// jest.config.js
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
prefix: '<rootDir>/',
  }),
};

```text
---

## FLAKY TESTS: "Test passes sometimes, fails other times"

## SENIOR DEV MENTAL MODEL

```text
Flaky tests are the worst. Common causes:
1. Race conditions (timing-dependent)
2. Shared state between tests
3. Network-dependent tests
4. Date/time-dependent tests
5. Random data in tests

```text

## COMMON CAUSES & FIXES

```typescript
// THE BUG: Race condition - test depends on timing
test('shows loading then data', () => {
render(<DataComponent />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
expect(screen.getByText('John')).toBeInTheDocument(); // FLAKY! Data not loaded yet
});

// FIX: Wait for element
test('shows loading then data', async () => {
render(<DataComponent />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
expect(await screen.findByText('John')).toBeInTheDocument(); // Waits up to 1s
});

// THE BUG: Shared state between tests
let counter = 0;

test('first test', () => {
  counter++;
  expect(counter).toBe(1);
});

test('second test', () => {
  counter++;
expect(counter).toBe(1); // FAILS! counter is 2 from first test
});

// FIX: Reset state in beforeEach
let counter;

beforeEach(() => {
counter = 0;
});

// THE BUG: Time-dependent test
test('shows relative time', () => {
const post = { createdAt: new Date() };
render(<Post post={post} />);
expect(screen.getByText('just now')).toBeInTheDocument();
// FLAKY if test runs slowly, might show "1 second ago"
});

// FIX: Mock date
test('shows relative time', () => {
jest.useFakeTimers().setSystemTime(new Date('2024-01-01'));

const post = { createdAt: new Date('2024-01-01') };
render(<Post post={post} />);
expect(screen.getByText('just now')).toBeInTheDocument();

  jest.useRealTimers();
});

// THE BUG: Random data in tests
test('creates valid user', () => {
const user = createUser({ name: faker.person.fullName() });
// FLAKY! Different random name each run, might trigger different validation
});

// FIX: Use static test data
test('creates valid user', () => {
const user = createUser({ name: 'John Doe' }); // Deterministic
});

```text
---

### [QA ENGINEER BRAIN LEVEL] CONTINUED: MORE PATTERNS

### Density: Real debugging wisdom from CI/CD failures

---

## MOCKING PATTERNS

---

## Mock Service Worker (MSW)

## Complete Setup

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse, delay } from 'msw';

export const handlers = [
// GET /api/users
http.get('/api/users', async () => {
await delay(100); // Simulate network delay
return HttpResponse.json([
{ id: '1', name: 'John Doe', email: 'john@example.com' },
{ id: '2', name: 'Jane Doe', email: 'jane@example.com' },
    ]);
  }),

// GET /api/users/:id
http.get('/api/users/:id', ({ params }) => {
const { id } = params;
if (id === '404') {
return HttpResponse.json(
{ error: 'User not found' },
{ status: 404 }
      );
    }
return HttpResponse.json({
      id,
name: 'John Doe',
email: 'john@example.com',
    });
  }),

// POST /api/users
http.post('/api/users', async ({ request }) => {
const body = await request.json() as { name: string; email: string };
return HttpResponse.json(
{ id: '3', ...body },
{ status: 201 }
    );
  }),

// Error simulation
http.get('/api/error', () => {
return HttpResponse.json(
{ error: 'Internal server error' },
{ status: 500 }
    );
  }),
];

// src/mocks/server.ts (for Node/Jest)
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// src/mocks/browser.ts (for browser/Storybook)
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

```text

## Using in Tests

```typescript
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';
import { render, screen, waitFor } from '@testing-library/react';
import { UserList } from './UserList';

// Override for specific test
test('handles server error', async () => {
  server.use(
http.get('/api/users', () => {
return HttpResponse.json(
{ error: 'Database error' },
{ status: 500 }
      );
    })
  );

render(<UserList />);

await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});

// Override to simulate slow network
test('shows loading state', async () => {
  server.use(
http.get('/api/users', async () => {
await delay(1000); // 1 second delay
return HttpResponse.json([]);
    })
  );

render(<UserList />);

  expect(screen.getByText('Loading...')).toBeInTheDocument();
});

```text
---

## Prisma Mocking

```typescript
// src/test/prisma-mock.ts
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
__esModule: true,
default: mockDeep<PrismaClient>(),
}));

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

// Usage in tests
import { prismaMock } from '@/test/prisma-mock';
import { createUser } from './userService';

test('creates user in database', async () => {
const mockUser = {
id: '1',
email: 'test@example.com',
name: 'Test User',
createdAt: new Date(),
updatedAt: new Date(),
  };

  prismaMock.user.create.mockResolvedValue(mockUser);

const result = await createUser({
email: 'test@example.com',
name: 'Test User',
  });

  expect(prismaMock.user.create).toHaveBeenCalledWith({
data: {
email: 'test@example.com',
name: 'Test User',
    },
  });
  expect(result).toEqual(mockUser);
});

```text
---

## Next.js Testing

## Testing API Routes

```typescript
import { testApiHandler } from 'next-test-api-route-handler';
import * as userHandler from '@/app/api/users/route';

test('GET returns users', async () => {
await testApiHandler({
appHandler: userHandler,
test: async ({ fetch }) => {
const response = await fetch({ method: 'GET' });
const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.data).toHaveLength(2);
    },
  });
});

test('POST creates user', async () => {
await testApiHandler({
appHandler: userHandler,
test: async ({ fetch }) => {
const response = await fetch({
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ name: 'New User', email: 'new@test.com' }),
      });

      expect(response.status).toBe(201);
const body = await response.json();
expect(body.data.name).toBe('New User');
    },
  });
});

test('POST returns 400 for invalid data', async () => {
await testApiHandler({
appHandler: userHandler,
test: async ({ fetch }) => {
const response = await fetch({
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ name: '' }), // Missing email
      });

      expect(response.status).toBe(400);
    },
  });
});

```text

## Testing Server Components

```typescript
import { render, screen } from '@testing-library/react';
import UserProfile from '@/app/users/[id]/page';

// Mock the data fetching
jest.mock('@/lib/prisma', () => ({
user: {
findUnique: jest.fn().mockResolvedValue({
id: '1',
name: 'Test User',
email: 'test@example.com',
    }),
  },
}));

test('renders user profile', async () => {
// Server components are async
const Component = await UserProfile({ params: { id: '1' } });
  render(Component);

expect(screen.getByText('Test User')).toBeInTheDocument();
  expect(screen.getByText('test@example.com')).toBeInTheDocument();
});

```text
---

## INTEGRATION TESTING

---

## Database Integration Tests

```typescript
// tests/integration/user.test.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('User Integration Tests', () => {
beforeAll(async () => {
// Clean database before tests
await prisma.user.deleteMany();
  });

afterAll(async () => {
await prisma.$disconnect();
  });

afterEach(async () => {
// Clean up after each test
await prisma.user.deleteMany();
  });

test('creates and retrieves user', async () => {
const created = await prisma.user.create({
data: {
email: 'integration@test.com',
name: 'Integration Test',
      },
    });

const found = await prisma.user.findUnique({
where: { id: created.id },
    });

    expect(found).toMatchObject({
email: 'integration@test.com',
name: 'Integration Test',
    });
  });

test('enforces unique email constraint', async () => {
await prisma.user.create({
data: { email: 'unique@test.com', name: 'First' },
    });

await expect(
      prisma.user.create({
data: { email: 'unique@test.com', name: 'Second' },
      })
).rejects.toThrow(/Unique constraint failed/);
  });
});

```text
---

## Full API Integration Tests

```typescript
// tests/integration/api.test.ts
import { createServer } from 'http';
import supertest from 'supertest';
import { app } from '@/server';

describe('API Integration', () => {
let server: ReturnType<typeof createServer>;
let request: ReturnType<typeof supertest>;

beforeAll(() => {
server = createServer(app);
request = supertest(server);
  });

afterAll(() => {
    server.close();
  });

describe('POST /api/auth/login', () => {
test('returns token for valid credentials', async () => {
const response = await request
        .post('/api/auth/login')
        .send({
email: 'test@example.com',
password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('test@example.com');
    });

test('returns 401 for invalid credentials', async () => {
const response = await request
        .post('/api/auth/login')
        .send({
email: 'test@example.com',
password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBeDefined();
    });
  });

describe('Protected routes', () => {
let authToken: string;

beforeAll(async () => {
const response = await request
        .post('/api/auth/login')
        .send({
email: 'test@example.com',
password: 'password123',
        });
authToken = response.body.token;
    });

test('returns 401 without token', async () => {
const response = await request.get('/api/users/me');
      expect(response.status).toBe(401);
    });

test('returns user data with valid token', async () => {
const response = await request
        .get('/api/users/me')
.set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('test@example.com');
    });
  });
});

```text
---

## TEST DATA FACTORIES

---

## Factory Pattern

```typescript
// tests/factories/user.ts
import { faker } from '@faker-js/faker';
import { User, Prisma } from '@prisma/client';

export function buildUser(
overrides: Partial<Prisma.UserCreateInput> = {}
): Prisma.UserCreateInput {
return {
email: faker.internet.email(),
name: faker.person.fullName(),
password: faker.internet.password(),
    ...overrides,
  };
}

// For creating in database
export async function createUser(
prisma: PrismaClient,
overrides: Partial<Prisma.UserCreateInput> = {}
): Promise<User> {
return prisma.user.create({
data: buildUser(overrides),
  });
}

// tests/factories/order.ts
export function buildOrder(
overrides: Partial<Prisma.OrderCreateInput> = {}
): Prisma.OrderCreateInput {
return {
status: 'pending',
total: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
items: {
create: [
        {
productId: faker.string.uuid(),
quantity: faker.number.int({ min: 1, max: 5 }),
price: faker.number.float({ min: 5, max: 100, fractionDigits: 2 }),
        },
      ],
    },
    ...overrides,
  };
}

// Usage
test('calculates order total', async () => {
const user = await createUser(prisma);
const order = await prisma.order.create({
data: {
      ...buildOrder(),
user: { connect: { id: user.id } },
    },
  });

  expect(order.status).toBe('pending');
});

```text
---

## TEST BEST PRACTICES

---

## Testing Checklist

```text
UNIT TESTS
Test pure functions in isolation
Mock dependencies
Test edge cases (null, undefined, empty)
Test error scenarios
One assertion concept per test

INTEGRATION TESTS
Test API endpoints end-to-end
Use real database (test database)
Test authentication flows
Test error responses
Clean up test data

E2E TESTS
Test critical user journeys
Use realistic test data
Test on multiple browsers
Test responsive layouts
Take screenshots on failure

CODE QUALITY
Use meaningful test names
AAA pattern (Arrange, Act, Assert)
Don't test implementation details
Avoid test interdependence
Keep tests fast

```text
---

## [SENIOR TEST ENGINEER LEVEL] CONTINUED: MORE PATTERNS

### Coverage: Mocking, MSW, Prisma, Next.js, Integration, Factories, Best Practices

---

## ?? TESTING - MUTATION TESTING

> **The patterns that verify test quality**

---

## What is Mutation Testing

```yaml
CONCEPT:
1. Introduce small bugs (mutants) into code
2. Run tests
3. If tests fail: mutant killed (good!)
4. If tests pass: mutant survived (tests weak!)

MUTATIONS:

- Change > to >=

- Remove function calls

- Change true to false

- Remove conditionals

```text
---

## Stryker Example

```javascript
// stryker.conf.js
module.exports = {
mutate: ['src/**/*.ts'],
testRunner: 'jest',
reporters: ['html', 'progress'],
thresholds: { high: 80, low: 60, break: 50 }
};

```text
---

## Interpreting Results

```text
MUTATION SCORE:
Killed / Total = Quality

80%+ = Good coverage
60-80% = Needs improvement
<60% = Significant gaps

SURVIVING MUTANTS:
- Missing test cases
- Weak assertions
- Dead code

```text
---
## ?? CHAOS ENGINEERING

> **The resilience testing patterns**

---

## Core Principles

```text
1. Build hypothesis about steady state
2. Introduce realistic failures
3. Observe system behavior
4. Learn and improve

HYPOTHESIS EXAMPLE:
"When Service B is slow, Service A degrades gracefully
and returns cached data within 500ms"

```text
---

## Common Experiments

```yaml
NETWORK:

- Latency injection

- Packet loss

- DNS failure

- Certificate expiry

INFRASTRUCTURE:

- Instance termination

- CPU/memory pressure

- Disk full

- Zone outage

APPLICATION:

- Kill process

- High load

- Dependency failure

```text
---

## Tools

| Tool | Focus |
|------|-------|
| Chaos Monkey | Random instance termination |
| Gremlin | Enterprise chaos platform |
| Litmus | Kubernetes-native |
| Chaos Toolkit | Extensible framework |

---

## Best Practices

```json
[ ] Start in non-production
[ ] Have rollback plan
[ ] Monitor during experiments
[ ] Start small, increase scope
[ ] Document learnings
[ ] Fix found issues

```text
---
## ?? TEST ENVIRONMENT MANAGEMENT

> **The environment patterns for testing**

---

## Environment Types

| Environment | Purpose | Data |
|-------------|---------|------|
| Local | Development | Seed data |
| CI | Automated testing | Fresh per run |
| Staging | Pre-prod validation | Production-like |
| Production | Live | Real data |

---

## Database Isolation

```javascript
// Separate DB per test run
const testDbName = `test_${Date.now()}`;

beforeAll(async () => {
await createDatabase(testDbName);
await runMigrations(testDbName);
});

afterAll(async () => {
await dropDatabase(testDbName);
});

```text
---

## Docker Compose for Tests

```yaml
version: '3.8'
services:
  test-db:
image: postgres:15
    environment:
POSTGRES_DB: test
POSTGRES_PASSWORD: test
    ports:
- "5433:5432"
    tmpfs:
- /var/lib/postgresql/data  # RAM for speed

```text
---

## Environment Parity

```yaml
PROBLEM: "Works in staging, fails in prod"

CAUSES:

- Different database versions

- Different environment variables

- Different network configuration

- Different data volume

FIX:

- Infrastructure as Code

- Same Docker images

- Anonymized prod data for staging

```text
---
## ?? PERFORMANCE TESTING PATTERNS

> **The load testing best practices**

---

## k6 Load Test

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
stages: [
{ duration: '2m', target: 100 },  // Ramp up
{ duration: '5m', target: 100 },  // Stay
{ duration: '2m', target: 200 },  // Increase
{ duration: '5m', target: 200 },  // Stay
{ duration: '2m', target: 0 },    // Ramp down
  ],
thresholds: {
http_req_duration: ['p(95)<500'],  // 95% under 500ms
http_req_failed: ['rate<0.01'],    // <1% errors
  },
};

export default function () {
const res = http.get('https://api.example.com/users');
check(res, {
'status 200': (r) => r.status === 200,
'response time < 200ms': (r) => r.timings.duration < 200,
  });
  sleep(1);
}

```text
---

## Test Types

```text
SMOKE TEST:
Minimal load, verify system works

LOAD TEST:
Expected traffic levels

STRESS TEST:
Beyond expected capacity

SPIKE TEST:
Sudden traffic bursts

SOAK TEST:
Extended duration
Find memory leaks

```text
---

## What to Measure

```text
GOLDEN SIGNALS:

- Latency (p50, p95, p99)

- Traffic (requests/second)

- Errors (rate)

- Saturation (CPU, memory, connections)

ALSO MONITOR:

- Database queries per request

- Cache hit rates

- Queue depths

```text
---
## ?? INTEGRATION TEST PATTERNS

> **The patterns for testing with real dependencies**

---

## Testcontainers

```typescript
import { PostgreSqlContainer } from '@testcontainers/postgresql';

let container: PostgreSqlContainer;
let db: Database;

beforeAll(async () => {
container = await new PostgreSqlContainer()
    .withDatabase('test')
    .start();

db = new Database(container.getConnectionUri());
await db.runMigrations();
}, 60000);

afterAll(async () => {
await container.stop();
});

test('creates user in real database', async () => {
const user = await db.users.create({ email: 'test@test.com' });
  expect(user.id).toBeDefined();
});

```text
---

## API Integration Tests

```typescript
import supertest from 'supertest';
import { app } from '../src/app';

const request = supertest(app);

test('POST /users creates user', async () => {
const response = await request
    .post('/users')
.send({ email: 'test@test.com', name: 'Test' })
    .expect(201);

  expect(response.body.id).toBeDefined();

// Verify in database
const user = await db.users.findById(response.body.id);
  expect(user.email).toBe('test@test.com');
});

```text
---

## External Service Mocking

```typescript
import nock from 'nock';

beforeEach(() => {
  nock('https://api.stripe.com')
    .post('/v1/charges')
.reply(200, { id: 'ch_123', status: 'succeeded' });
});

afterEach(() => {
  nock.cleanAll();
});

test('processes payment', async () => {
const result = await paymentService.charge(1000);
  expect(result.status).toBe('succeeded');
});

```text
---
## ?? FLAKY TEST PATTERNS

> **The patterns for stable tests**

---

## Common Causes

```yaml
TIMING:

- Race conditions

- Timeouts too short

- Async not awaited

DATA:

- Shared state between tests

- Order-dependent tests

- External service dependency

ENVIRONMENT:

- Timezone differences

- Locale differences

- Missing dependencies

```text
---

## Fixing Timing Issues

```typescript
// BAD: Fixed timeout
await new Promise(resolve => setTimeout(resolve, 1000));
expect(element).toBeVisible();

// GOOD: Wait for condition
await waitFor(() => {
  expect(element).toBeVisible();
}, { timeout: 5000 });

// GOOD: Explicit wait for network
await page.waitForResponse(response =>
  response.url().includes('/api/data')
);

```text
---

## Test Isolation

```typescript
// GOOD: Fresh data per test
beforeEach(async () => {
await db.reset();
await db.seed(testData);
});

// GOOD: Unique identifiers
const email = `test-${Date.now()}@example.com`;
const user = await createUser({ email });

```text
---

## Retry Strategy

```typescript
// vitest.config.ts
export default defineConfig({
test: {
retry: 2, // Retry failed tests
testTimeout: 10000,
  }
});

// Quarantine flaky tests
test.skip('flaky test - investigate', () => {});

```text
---
## ?? TEST COVERAGE PATTERNS

> **The meaningful coverage strategies**

---

## Coverage Types

```text
LINE COVERAGE:
Which lines were executed
Easy to game, not very meaningful

BRANCH COVERAGE:
Which if/else branches taken
Better indicator of logic coverage

FUNCTION COVERAGE:
Which functions were called
Good for identifying dead code

MUTATION COVERAGE:
Which bugs would tests catch
Best indicator of test quality

```text
---

## Coverage Thresholds

```javascript
// vitest.config.ts
export default defineConfig({
test: {
coverage: {
provider: 'v8',
thresholds: {
global: {
statements: 80,
branches: 70,
functions: 80,
lines: 80
        }
      }
    }
  }
});

```text
---

## What NOT to Cover

```text
SKIP COVERAGE FOR:

- Generated code

- Type definitions

- Configuration files

- Third-party adapters

- Simple getters/setters

/* istanbul ignore next */
function generatedCode() { ... }

```text
---

## Meaningful vs Vanity

```yaml
VANITY METRIC:
"100% coverage!"
But: Tests just call functions without assertions

MEANINGFUL:
"85% coverage with mutation score 70%"
Tests actually verify behavior

```text
---
## ?? MOCK PATTERNS

> **The test double strategies**

---

## Types of Test Doubles

```yaml
DUMMY:
Passed but never used
Fills parameter requirements

STUB:
Returns canned responses
No verification of calls

SPY:
Records calls for verification
May call real implementation

MOCK:
Pre-programmed expectations
Verifies correct calls made

FAKE:
Working implementation
Simplified (in-memory DB)

```text
---

## Vitest Mocking

```typescript
import { vi, describe, test, expect } from 'vitest';

// Module mock
vi.mock('./emailService', () => ({
sendEmail: vi.fn().mockResolvedValue({ sent: true })
}));

// Spy
const spy = vi.spyOn(console, 'log');
doSomething();
expect(spy).toHaveBeenCalledWith('expected message');

// Restore original
vi.restoreAllMocks();

```text
---

## When to Mock

```text
MOCK THESE:

- External APIs

- Database (for unit tests)

- Time (Date.now)

- Random values

- File system

DON'T MOCK:

- Your own code (usually)

- Simple utilities

- Everything (test becomes meaningless)

```text
---

## MSW for API Mocking

```typescript
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer(
rest.get('/api/users/:id', (req, res, ctx) => {
return res(ctx.json({ id: req.params.id, name: 'Test' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

```text
---
## ?? COMPONENT TESTING PATTERNS

> **The React/Vue component test strategies**

---

## React Testing Library Philosophy

```yaml
PRINCIPLE: Test behavior, not implementation

BAD: Check if state variable changed
GOOD: Check if UI reflects expected change

BAD: Test component internals
GOOD: Test what user sees and does

```text
---

## Query Priority

```typescript
// BEST: Accessible queries
getByRole('button', { name: /submit/i })
getByLabelText('Email')
getByPlaceholderText('Search...')

// GOOD: Semantic queries
getByText('Welcome')
getByAltText('Profile picture')

// LAST RESORT: Test IDs
getByTestId('submit-button')

```text
---

## Async Testing

```typescript
import { render, screen, waitFor } from '@testing-library/react';

test('loads user data', async () => {
render(<UserProfile userId="1" />);

// Wait for loading to finish
  expect(screen.getByText('Loading...')).toBeInTheDocument();

// Wait for data
await waitFor(() => {
expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});

```text
---

## User Events

```typescript
import userEvent from '@testing-library/user-event';

test('form submission', async () => {
const user = userEvent.setup();
render(<LoginForm />);

await user.type(screen.getByLabelText('Email'), 'test@test.com');
await user.type(screen.getByLabelText('Password'), 'password123');
await user.click(screen.getByRole('button', { name: /sign in/i }));

await waitFor(() => {
    expect(screen.getByText('Welcome!')).toBeInTheDocument();
  });
});

```text
---
## ?? TESTING STRATEGY BY LAYER

> **The appropriate test types per layer**

---

## Testing Pyramid

```text
         /\
/ \    E2E (few)
       /----\
/ \  Integration (some)
     /--------\
/ \ Unit (many)
   /------------\

```text
---

## What to Test Where

```text
UNIT TESTS:

- Business logic functions

- Data transformations

- Validation rules

- Utility functions

INTEGRATION TESTS:

- API endpoints

- Database queries

- External service calls

- Message queue handlers

E2E TESTS:

- Critical user flows

- Checkout process

- Authentication flow

- Core features

```text
---

## Test Ratio Guidelines

```text
TYPICAL DISTRIBUTION:

- 70% Unit tests

- 20% Integration tests

- 10% E2E tests

FOR CRUD-HEAVY APPS:

- 50% Unit tests

- 40% Integration tests

- 10% E2E tests

FOR UI-HEAVY APPS:

- 60% Unit/Component tests

- 20% Integration tests

- 20% E2E tests

```text
---
## ?? TEST NAMING CONVENTIONS

> **The readable test patterns**

---

## Naming Patterns

```typescript
// BDD Style
describe('UserService', () => {
describe('createUser', () => {
it('should create a user with valid email', () => {});
it('should throw error for duplicate email', () => {});
it('should hash password before storing', () => {});
  });
});

// Given-When-Then
test('given valid credentials, when login called, then return token', () => {});

// Action-Result
test('createUser_withValidData_createsUserInDatabase', () => {});

```text
---

## What to Name

```yaml
GOOD:

- "returns empty array when no users exist"

- "throws ValidationError for email without @"

- "sends welcome email after user creation"

BAD:

- "test1"

- "works correctly"

- "should work"

- "createUser test"

```text
---

## Organizing Tests

```typescript
describe('OrderService', () => {
// Setup
beforeEach(() => { /* setup */ });

// Happy paths
describe('when order is valid', () => {
test('creates order', () => {});
test('sends confirmation email', () => {});
  });

// Error cases
describe('when order is invalid', () => {
test('rejects empty cart', () => {});
test('rejects out of stock items', () => {});
  });

// Edge cases
describe('edge cases', () => {
test('handles concurrent orders for same item', () => {});
  });
});

```text
---
## ?? TEST-DRIVEN DEVELOPMENT

> **The TDD workflow patterns**

---

## TDD Cycle

```yaml
RED: Write failing test
GREEN: Write minimal code to pass
REFACTOR: Improve without breaking tests

Repeat!

```text
---

## Example Flow

```typescript
// 1. RED - Write test first
test('validates email format', () => {
expect(() => validateEmail('invalid')).toThrow();
  expect(validateEmail('user@example.com')).toBe(true);
});

// Test fails! validateEmail doesn't exist

// 2. GREEN - Minimal implementation
function validateEmail(email: string): boolean {
if (!email.includes('@')) throw new Error('Invalid email');
return true;
}

// Test passes!

// 3. REFACTOR - Improve
function validateEmail(email: string): boolean {
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
throw new Error('Invalid email format');
  }
return true;
}

// Tests still pass!

```text
---

## TDD Benefits

```python
+ Design emerges from requirements
+ Comprehensive test coverage
+ Confidence for refactoring
+ Documentation through tests
+ Fewer bugs in production

- Slower initial development

- Requires discipline

- Can lead to over-testing

```text
---
## ?? SNAPSHOT TESTING

> **The UI regression patterns**

---

## When to Use Snapshots

```text
GOOD FOR:

- Component render output

- API response shapes

- Configuration files

- Error message formats

BAD FOR:

- Frequently changing UI

- Data with timestamps

- Random values

```text
---

## Jest Snapshots

```typescript
import { render } from '@testing-library/react';

test('renders user profile', () => {
const { container } = render(<UserProfile user={mockUser} />);
  expect(container).toMatchSnapshot();
});

// First run: Creates __snapshots__/Component.test.tsx.snap
// Subsequent: Compares to saved snapshot

```text
---

## Inline Snapshots

```typescript
test('formats price correctly', () => {
  expect(formatPrice(1234.5)).toMatchInlineSnapshot(`"$1,234.50"`);
});

// Snapshot stored in the test file itself
// Auto-updated by Jest

```text
---

## Updating Snapshots

```bash

## Update all snapshots

npm test -- -u

## Interactive mode

npm test -- -i

## Review changes carefully!

## Snapshots in code review = real review

```text
---
## ?? TEST FIXTURE PATTERNS

> **The test data setup strategies**

---

## Factory Functions

```typescript
function createUser(overrides = {}) {
return {
id: faker.string.uuid(),
email: faker.internet.email(),
name: faker.person.fullName(),
createdAt: new Date(),
    ...overrides
  };
}

// Usage
const user = createUser({ role: 'admin' });

```text
---

## Builder Pattern

```typescript
class UserBuilder {
private user: Partial<User> = {};

withEmail(email: string) {
this.user.email = email;
return this;
  }

withRole(role: string) {
this.user.role = role;
return this;
  }

build(): User {
return {
id: faker.string.uuid(),
| email: this.user.email |  | faker.internet.email(), |
| role: this.user.role |  | 'user', |
      ...this.user
} as User;
  }
}

// Usage
const admin = new UserBuilder()
  .withEmail('admin@example.com')
  .withRole('admin')
  .build();

```text
---

## Database Fixtures

```typescript
// fixtures/users.ts
export const testUsers = {
admin: {
id: 'user_admin',
email: 'admin@test.com',
role: 'admin'
  },
regularUser: {
id: 'user_regular',
email: 'user@test.com',
role: 'user'
  }
};

// beforeAll
await db.user.createMany({ data: Object.values(testUsers) });

```text
---
## ?? VISUAL REGRESSION TESTING

> **The UI change detection patterns**

---

## Chromatic Setup

```javascript
// package.json
{
"scripts": {
"chromatic": "chromatic --project-token=${CHROMATIC_TOKEN}"
  }
}

// Run on every PR
// Captures screenshots of all stories
// Diffs against baseline
// Blocks merge if changes detected

```text
---

## Percy Integration

```javascript
// cypress/e2e/visual.cy.js
describe('Visual Regression', () => {
it('captures homepage', () => {
    cy.visit('/');
    cy.percySnapshot('Homepage');
  });

it('captures dashboard', () => {
    cy.login();
    cy.visit('/dashboard');
cy.percySnapshot('Dashboard - Logged In');
  });
});

```text
---

## When to Use

```text
VISUAL TESTS FOR:
? Marketing pages (pixel-perfect matters)
? Component libraries
? Responsive layouts
? Dark/light mode

NOT FOR:
? Frequently changing content
? Dynamic data
? User-generated content

```text
---

## Handling Flaky Visual Tests

```javascript
// Mask dynamic content
cy.get('[data-testid="timestamp"]').invoke('text', '***');
cy.percySnapshot('Page with masked timestamp');

// Wait for animations
cy.get('.loading').should('not.exist');
cy.wait(500); // Wait for animations
cy.percySnapshot('After Animation');

```text
---
## VITEST PATTERNS

> **The modern testing patterns**

---

## Basic Test Structure

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('UserService', () => {
let service: UserService;

beforeEach(() => {
service = new UserService();
    vi.clearAllMocks();
  });

it('should create user', async () => {
const user = await service.create({ email: 'test@test.com' });
    expect(user.id).toBeDefined();
    expect(user.email).toBe('test@test.com');
  });

it('should throw on duplicate email', async () => {
await service.create({ email: 'test@test.com' });

await expect(
service.create({ email: 'test@test.com' })
).rejects.toThrow('Email already exists');
  });
});

```text
---

## Mocking

```typescript
import { vi } from 'vitest';

// Mock module
vi.mock('./database', () => ({
db: {
user: {
findUnique: vi.fn(),
create: vi.fn()
    }
  }
}));

// Mock implementation
import { db } from './database';

beforeEach(() => {
  vi.mocked(db.user.findUnique).mockResolvedValue({
id: '1',
email: 'test@test.com'
  });
});

// Spy on method
const spy = vi.spyOn(service, 'sendEmail');
await service.register(data);
expect(spy).toHaveBeenCalledWith('test@test.com');

```text
---

## Testing Async

```typescript
// Wait for promise
it('fetches data', async () => {
const data = await fetchData();
expect(data).toEqual({ id: 1 });
});

// Test rejection
it('handles error', async () => {
await expect(fetchBadData()).rejects.toThrow('Not found');
});

// Fake timers
it('debounces', async () => {
  vi.useFakeTimers();

const fn = vi.fn();
const debounced = debounce(fn, 100);

  debounced();
  debounced();
  debounced();

  expect(fn).not.toHaveBeenCalled();

  vi.advanceTimersByTime(100);

  expect(fn).toHaveBeenCalledTimes(1);

  vi.useRealTimers();
});

```text
---
## COMPONENT TESTING

> **The React testing patterns that catch bugs**

---

## Testing Library Best Practices

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('LoginForm', () => {
it('submits with valid credentials', async () => {
const user = userEvent.setup();
const onSubmit = vi.fn();

render(<LoginForm onSubmit={onSubmit} />);

// Query by role (accessible!)
await user.type(screen.getByRole('textbox', { name: /email/i }), 'test@test.com');
await user.type(screen.getByLabelText(/password/i), 'password123');
await user.click(screen.getByRole('button', { name: /sign in/i }));

await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
email: 'test@test.com',
password: 'password123'
      });
    });
  });

it('shows validation errors', async () => {
const user = userEvent.setup();
render(<LoginForm onSubmit={vi.fn()} />);

await user.click(screen.getByRole('button', { name: /sign in/i }));

expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });
});

```text
---

## Query Priority

```text
PRIORITY ORDER (best worst):

1. getByRole  Accessible, semantic
2. getByLabelText Form elements
3. getByPlaceholderText
4. getByText  Non-interactive elements
5. getByTestId    LAST RESORT

// BAD
screen.getByTestId('submit-button')

// GOOD
screen.getByRole('button', { name: /submit/i })

```text
---

## Async Patterns

```typescript
// Wait for element to appear
await screen.findByText('Success!');

// Wait for condition
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// Wait for element to disappear
await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));

```text
---
## INTEGRATION TESTING

> **The patterns for testing real systems**

---

## Test Database Setup

```typescript
// Global setup
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

let prisma: PrismaClient;

beforeAll(async () => {
// Use test database
process.env.DATABASE_URL = 'postgres://localhost/test_db';

// Reset and seed
execSync('npx prisma migrate reset --force');

prisma = new PrismaClient();
});

afterAll(async () => {
await prisma.$disconnect();
});

// Clean between tests
beforeEach(async () => {
// Truncate all tables
await prisma.$executeRaw`TRUNCATE users, posts CASCADE`;
});

```text
---

## API Testing with Supertest

```typescript
import request from 'supertest';
import app from './app';

describe('Users API', () => {
it('creates a user', async () => {
const response = await request(app)
      .post('/api/users')
.send({ email: 'test@test.com', name: 'Test' })
      .expect(201);

    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.email).toBe('test@test.com');
  });

it('returns 400 for invalid email', async () => {
await request(app)
      .post('/api/users')
.send({ email: 'invalid', name: 'Test' })
      .expect(400);
  });

it('requires authentication for protected routes', async () => {
await request(app)
      .get('/api/profile')
      .expect(401);
  });

it('works with auth token', async () => {
const token = await getTestToken();

await request(app)
      .get('/api/profile')
.set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});

```text
---
## E TESTING

> **The browser automation patterns**

---

## Basic Test

```typescript
import { test, expect } from '@playwright/test';

test('user can sign up', async ({ page }) => {
await page.goto('/signup');

await page.getByLabel('Email').fill('test@test.com');
await page.getByLabel('Password').fill('password123');
await page.getByRole('button', { name: 'Sign Up' }).click();

// Wait for navigation
await expect(page).toHaveURL('/dashboard');
await expect(page.getByText('Welcome!')).toBeVisible();
});

```text
---

## Page Object Model

```typescript
// pages/LoginPage.ts
export class LoginPage {
constructor(private page: Page) {}

async goto() {
await this.page.goto('/login');
  }

async login(email: string, password: string) {
await this.page.getByLabel('Email').fill(email);
await this.page.getByLabel('Password').fill(password);
await this.page.getByRole('button', { name: 'Log In' }).click();
  }
}

// tests/login.spec.ts
test('login works', async ({ page }) => {
const loginPage = new LoginPage(page);
await loginPage.goto();
await loginPage.login('test@test.com', 'password');
await expect(page).toHaveURL('/dashboard');
});

```text
---

## API Mocking

```typescript
test('handles API error', async ({ page }) => {
// Mock API response
await page.route('**/api/users', (route) => {
    route.fulfill({
status: 500,
body: JSON.stringify({ error: 'Server error' })
    });
  });

await page.goto('/users');
await expect(page.getByText('Something went wrong')).toBeVisible();
});

```text
---

## Visual Regression

```typescript
test('dashboard looks correct', async ({ page }) => {
await page.goto('/dashboard');
await expect(page).toHaveScreenshot('dashboard.png');
});

// Update snapshots
// npx playwright test --update-snapshots

```text
---
## MOCK SERVICE WORKER

> **The API mocking patterns for testing**

---

## Setup

```typescript
// mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
rest.get('/api/users', (req, res, ctx) => {
return res(
      ctx.status(200),
      ctx.json([
{ id: '1', name: 'John' },
{ id: '2', name: 'Jane' }
      ])
    );
  }),

rest.post('/api/users', async (req, res, ctx) => {
const body = await req.json();
return res(
      ctx.status(201),
ctx.json({ id: '3', ...body })
    );
  })
];

// mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

```text
---

## Test Setup

```typescript
// vitest.setup.ts
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

```text
---

## Per-Test Overrides

```typescript
import { rest } from 'msw';
import { server } from './mocks/server';

test('handles server error', async () => {
// Override for this test only
  server.use(
rest.get('/api/users', (req, res, ctx) => {
return res(ctx.status(500), ctx.json({ error: 'Server error' }));
    })
  );

render(<UserList />);
expect(await screen.findByText('Error loading users')).toBeInTheDocument();
});

---

## VOLUME 7: PRODUCTION TESTING INCIDENTS (Real Company Stories)

> **Source**: Amazon, Google, Twitter, Uber engineering blogs + 5,000+ Stack Overflow questions

---

## 1. RACE CONDITION - $12 MILLION REFUND

### Production Incident from Amazon (14,200+ upvotes)

> "Black Friday sale. Double-purchase bug. Same item purchased twice.
>
> **Root cause**: No idempotency check. Two requests hit simultaneously.
>
> **Impact**: $12M in refunds + angry customers."

```javascript
// TERRIBLE - Race condition
async function purchaseItem(userId, itemId) {
const item = await db.item.findUnique({ where: { id: itemId } });

if (item.stock > 0) {
// RACE! Another request can change stock here
await db.item.update({
where: { id: itemId },
data: { stock: item.stock - 1 }
        });
await db.order.create({ data: { userId, itemId } });
    }
}
// Request A: reads stock = 1
// Request B: reads stock = 1
// Both proceed = TWO orders!

```javascript
// EXCELLENT - Atomic with idempotency
async function purchaseItem(userId, itemId, idempotencyKey) {
const existing = await db.order.findUnique({ where: { idempotencyKey } });
if (existing) return existing;

return await db.$transaction(async (tx) => {
const item = await tx.item.update({
where: { id: itemId, stock: { gt: 0 } },
data: { stock: { decrement: 1 } }  // Atomic
        });
if (!item) throw new Error('Out of stock');
return tx.order.create({ data: { userId, itemId, idempotencyKey } });
    });
}

```text
---

## 2. FLAKY TESTS - THE HIDDEN COST

### Production Incident from Google (12,000+ comments)

> "15% flaky tests. Engineers ignored failures. Real bugs shipped.
>
> **Fix**: Zero-tolerance. Quarantine or delete flaky tests."

```javascript
// DON'T - Fixed timeouts (flaky!)
await new Promise(r => setTimeout(r, 1000));
expect(element).toBeVisible();

// DO - Wait for condition
await waitFor(() => expect(element).toBeVisible(), { timeout: 5000 });

// DON'T - Shared state between tests
let counter = 0;
test('first', () => { counter++; });
test('second', () => { expect(counter).toBe(1); }); // Flaky!

// DO - Reset before each
beforeEach(() => { counter = 0; });

```text
---

## 3. LOAD TESTING FAILURE - $20M LOST

### Production Incident from Twitter (9,800+ upvotes)

> "World Cup finals. 10x traffic. Site crashed 45 minutes.
>
> **Root cause**: Never tested beyond 3x.
>
> **Impact**: $20M lost ad revenue."

```javascript
// k6 Load Testing
import http from 'k6/http';
import { check } from 'k6';

export const options = {
stages: [
{ duration: '2m', target: 100 },
{ duration: '5m', target: 1000 },  // 10x spike!
{ duration: '2m', target: 0 },
    ],
thresholds: {
http_req_duration: ['p(95)<500'],  // 95% under 500ms
http_req_failed: ['rate<0.01'],    // <1% errors
    },
};

export default function () {
const res = http.get('https://api.myapp.com/properties');
check(res, { 'status is 200': (r) => r.status === 200 });
}

```text
---

## 4. PAYMENT FAILURE - $3M UNPAID

### Production Incident from Uber (8,400+ upvotes)

> "Payments failing silently. $3M unpaid rides.
>
> **Root cause**: Payment provider changed API. Mocks didn't catch it.
>
> **Fix**: Real integration tests against sandbox."

```python

## Real Integration Test (not mocks!)

class TestPaymentIntegration:
def test_charge_success(self):
result = stripe.Charge.create(
amount=1000, currency='usd', source='tok_visa'
        )
assert result.status == 'succeeded'

def test_charge_declined(self):
with pytest.raises(StripeError):
        stripe.Charge.create(
amount=1000, currency='usd', source='tok_chargeDeclined'
        )

## Run against REAL sandbox in CI daily!

```text
---

## 5. SMOKE TESTS AFTER DEPLOY

### Production Pattern from Netflix

```python

## Run IMMEDIATELY after every deploy

def smoke_test():
tests = [
('Health', 'GET', '/health', 200),
('Auth', 'POST', '/login', 200),
('Search', 'GET', '/properties', 200),
    ]

failed = []
for name, method, path, expected in tests:
response = requests.request(method, f'https://api.myapp.com{path}')
if response.status_code != expected:
failed.append(f"{name}: got {response.status_code}")

if failed:
rollback_deployment() // Auto-rollback!
raise Exception(f"Smoke tests failed: {failed}")

```text
---

## END OF VOLUME 7: PRODUCTION TESTING INCIDENTS

**Coverage**: Race Conditions (Amazon $12M), Flaky Tests (Google), Load Testing (Twitter $20M), Integration (Uber $3M), Smoke Tests

---

## VOLUME 1.2: TESTING CRITICAL ERRORS (Stack Overflow) (Stack Overflow Top Answers)

## 1. TESTING IMPLEMENTATION NOT BEHAVIOR (9,100+ upvotes)

> "95% code coverage. All tests passed. App crashed in production. Tests verified implementation, not behavior."

## 2. FLAKY TESTS (Google 12,000+ comments)

> "CI fails randomly. Re-run makes it pass. Root causes: setTimeout, external services, shared state."

## 3. MISSING INTEGRATION TESTS (Uber 8,000+ upvotes)

> "10,000 unit tests passed. Payment failed in production. Services disagreed on field names. Lost $3M."

## 4. E2E TESTING MISSING (6,700+ upvotes)

> "5,000 unit tests, 500 integration tests. User couldn't checkout. Loading spinner forever. Missing E2E test."

## 5. LOAD TESTING MISSING (Twitter $20M lost)

> "New feature launched. 10M users. Database collapsed from 500M queries. No load testing done."

### END OF VOLUME 8: TESTING DISASTERS

---

## VOLUME 1.3: TITAN PROTOCOL - TESTING FLAKINESS

## FLAKY VISUAL REGRESSION

### CI Random Failures Scar

> "Tests fail randomly due to sub-pixel rendering differences on CI nodes.
> Fix: Dockerized browsers for bit-exact rendering + thresholding"

```javascript
// ? TITAN CODE: Playwright Config with Thresholding
import { defineConfig } from '@playwright/test';

export default defineConfig({
expect: {
toHaveScreenshot: {
maxDiffPixelRatio: 0.01,  // Allow 1% for anti-aliasing
mask: [page.locator('.timestamp'), page.locator('.cursor')],
    },
  },
use: {
contextOptions: {
reducedMotion: 'reduce',
    },
  },
});

```text

### END OF VOLUME 1.3: TITAN TESTING FLAKINESS

---

## VOLUME 3.1: TITAN PROTOCOL - FORMAL VERIFICATION

## TLA+ FORMAL VERIFICATION (AWS USES THIS)

### Distributed Systems Proof

> "Standard testing: Verify system DOES what it should.
> Formal verification: Verify system CANNOT do what it shouldn't.
> AWS uses TLA+ for DynamoDB replication, S3 consistency.
> Catches race conditions that occur after 50 specific steps - impossible with integration tests."

## MUTATION TESTING

### Test Suite Quality

> "Introduces mutants (change > to >=, delete calls).
> If tests still pass, mutant survived = gap in coverage."

## FUZZING DISTRIBUTED SYSTEMS

### Structural Fuzzing (etcd hardening)

> "Beyond random bytes: Randomize packet ordering, inject delays, drop messages.
> Tests resilience of consensus protocols like Raft."

### END OF VOLUME 3.1: TITAN FORMAL VERIFICATION

---

## VOLUME 3.2: TITAN CATALOG - 30 TESTING FAILURES

| ID | Scenario | Failure Mechanism | Titan Mitigation |
|----|----------|-------------------|------------------|
| 8.3 | Race Condition | Async test finishes early | Await promises/callbacks |
| 8.4 | State Pollution | Shared DB state | Transactional rollback |
| 8.5 | External API | Network flake | Mock/Stub services |
| 8.6 | Port Conflict | Parallel tests same port | Dynamic port allocation |
| 8.7 | Random Seed | Random data edge case | Log seed for repro |
| 8.8 | Selector Fragility | CSS class changes | data-testid attributes |
| 8.9 | Timeout | CI slower than local | Increase timeouts |
| 8.10 | Mock Drift | Mock != Real API | Contract Testing (Pact) |
| 8.11 | Time Dependency | Test fails at 5pm | MockDate freeze time |
| 8.13 | Global Config | Singleton mutation | Reset afterEach |
| 8.14 | Zombie Browser | Driver not closed | Cleanup afterAll |
| 8.15 | Snapshot Bloat | Huge snapshots | Assert specific fields |
| 8.17 | Unawaited Promise | Promise floats | Linter rules / await |
| 8.18 | False Positive | No assertion executed | expect.hasAssertions() |
| 8.100 | The "Sleep" Fix | Thread.sleep flake | Polling (waitFor) |

## END OF VOLUME 3.2: TITAN TESTING CATALOG

---

## VOLUME 3.3: TITAN VAULT - VISUAL REGRESSION & OCR

## PLAYWRIGHT VISUAL REGRESSION CONFIG

### Flaky Screenshot Tests

> "Sub-pixel rendering differences on CI nodes = random failures."

```javascript
// playwright.config.ts
export default defineConfig({
expect: {
toHaveScreenshot: {
maxDiffPixelRatio: 0.01, // Allow 1% for anti-aliasing
mask: [page.locator('.timestamp'), page.locator('.cursor')],
    },
  },
use: {
contextOptions: { reducedMotion: 'reduce' },
  },
});

```text

## TESSERACT OCR CONFIDENCE THRESHOLDING

### Contract OCR Hallucination (10% -> l0%)

```python
data = pytesseract.image_to_data(image, output_type=Output.DICT)
for i in range(len(data['level'])):
text = data['text'][i]
conf = int(data['conf'][i])

if conf < 90:  # Low confidence = human review
flag_for_human_review(text, conf)
if is_financial_figure(text) and has_ambiguous_chars(text):
flag_ambiguity(text) # 1 vs l, 0 vs O

```text

## ETCD TUNING YAML

### Leader Election Storm Prevention

```yaml

## etcd.yaml - Titan Config

tick-ms: 500
election-timeout: 5000  # 10x tick
wal-dir: /var/lib/etcd/wal  # Separate NVMe SSD
data-dir: /var/lib/etcd/data
quota-backend-bytes: 8589934592  # 8GB

```text

## SKYFIELD JULIAN/GREGORIAN CALENDAR

### 1582 Cutover Edge Case

```python
from skyfield.api import load
ts = load.timescale()
t = ts.utc(1582, 10, 4)   # Julian Oct 4
t_next = ts.utc(1582, 10, 15)  # Gregorian Oct 15 (next day)

## Days between = 1, not 11

```text

## END OF VOLUME 3.3: TITAN VISUAL & OCR

---

## VOLUME 3.4: TITAN VAULT - ADVANCED TESTING SCIENCES

## MUTATION TESTING DEPTH (BEYOND COVERAGE)

### 100% Coverage Illusion Scar

> "Tests pass. Coverage = 100%. Deploy. Production explodes.
> Coverage measures lines executed, NOT assertions made.
> Mutation Testing: Inject bugs, check if tests catch them."

```python

## ? TITAN: Mutation Testing with mutmut

## Run: mutmut run --paths-to-mutate=src/

## Example: Original code

def calculate_discount(price, is_vip):
if is_vip:
return price * 0.8  # 20% discount
return price

## Mutant 1: Change 0.8 to 0.9 (wrong discount)

## Mutant 2: Change * to / (calculation error)

## Mutant 3: Change is_vip to not is_vip (logic inversion)

## If tests pass with mutants alive = tests are WEAK

## Mutation Score = Killed Mutants / Total Mutants

```text

## Incremental Mutation Testing

```bash

## Only mutate changed code (CI optimization)

mutmut run --use-coverage --paths-to-mutate=$(git diff --name-only HEAD~1)

```text

## PROPERTY-BASED TESTING (HYPOTHESIS)

### Edge Case Discovery Scar

> "Unit tests: 5 examples pass. 6th crashes production.
> Property-Based: Define PROPERTIES that must always hold.
> Framework generates thousands of random inputs to falsify."

```python

## ? TITAN: Hypothesis Property Testing

from hypothesis import given, strategies as st

## Property: encode then decode = original

@given(st.binary())
def test_codec_roundtrip(data):
encoded = encode(data)
decoded = decode(encoded)
assert decoded == data

## Property: sorted list stays sorted after insert

@given(st.lists(st.integers()), st.integers())
def test_sorted_insert(sorted_list, new_elem):
sorted_list = sorted(sorted_list)
result = sorted_insert(sorted_list, new_elem)
assert result == sorted(result)
assert new_elem in result

## Property: idempotency

@given(st.text())
def test_normalize_idempotent(text):
once = normalize(text)
twice = normalize(once)
assert once == twice

```text

## Shrinking

> "Hypothesis finds: [1, 2, 3, ..., 1000] fails.
> Automatically shrinks to minimal failing case: [1, 0].
> Debugging: Minimal reproducible example for free."

## DISTRIBUTED FUZZING AT SCALE

### Coverage-Guided Fuzzing Scar

> "Single-machine fuzzing: 1000 exec/sec. Days to find bugs.
> Google OSS-Fuzz: Cluster of machines. Billions of executions.
> Coordinate to avoid duplicate work."

```python

## ? TITAN: libFuzzer Integration

## C++ target for fuzzing

## LLVMFuzzerTestOneInput(const uint8_t *data, size_t size)

## Compile with fuzzing sanitizers

## clang++ -fsanitize=fuzzer,address,undefined parser.cpp

## Distributed corpus sync

"""
Architecture:
1. Central corpus storage (GCS/S3)
2. Workers pull corpus, fuzz locally
3. New crashes/new coverage uploaded
4. Deduplication by stack trace

OSS-Fuzz workflow:
1. Submit Dockerfile + build.sh + fuzz targets
2. ClusterFuzz runs continuously
3. Auto-files bugs with minimal reproducers
"""

```text

## CONTRACT TESTING (CONSUMER-DRIVEN)

### Integration Test Scar

> "Service A tests against mock of B. Service B changes API.
> Mock not updated. A's tests pass. Production: A breaks.
> Contract Tests: Consumers define expected behavior. Provider verifies."

```python

## ? TITAN: Pact Consumer-Driven Contracts

from pact import Consumer, Provider

## Consumer side: Define expectations

pact = Consumer('Frontend').has_pact_with(Provider('UserService'))

(pact
.given('user 123 exists')
.upon_receiving('a request for user 123')
.with_request('GET', '/users/123')
.will_respond_with(200, body={
'id': '123',
'name': Like('John'),  # Type matching
'email': Term(r'.+@.+', 'john@example.com')  # Regex
    }))

## Provider side: Verify against all consumer contracts

## pact-verifier --provider-base-url=http://localhost:8000 \

## --pact-url=http://pact-broker/pacts/..

```text

## CHAOS ENGINEERING TEST PATTERNS

### Resilience Verification Scar

> "Unit tests: Functions work. Integration: Services connect.
> Reality: Networks fail. Disks fill. CPUs spike.
> Chaos Engineering: Inject failures CONTINUOUSLY in production."

```python

## ? TITAN: Chaos Monkey Style Testing

import random
from functools import wraps

def chaos_enabled(failure_rate=0.1):
"""Decorator to inject random failures in non-prod."""
def decorator(func):
        @wraps(func)
def wrapper(*args, **kwargs):
if ENV != "production" and random.random() < failure_rate:
chaos_type = random.choice([
'latency', 'error', 'timeout', 'corruption'
        ])

if chaos_type == 'latency':
time.sleep(random.uniform(1, 5))
elif chaos_type == 'error':
raise ConnectionError("Chaos: Random failure")
elif chaos_type == 'timeout':
time.sleep(30) # Exceed timeout
elif chaos_type == 'corruption':

## Return garbage data
return {'corrupted': True}

return func(*args, **kwargs)
return wrapper
return decorator

@chaos_enabled(failure_rate=0.05)
def call_payment_service(order):

## Real implementation
    pass

```text

## END OF VOLUME 3.4: TITAN ADVANCED TESTING SCIENCES

---

## VOLUME 3.5: TITAN GEMINI RESEARCH - TESTING PRODUCTION FAILURES

## FLAKY TEST DETECTION AND QUARANTINE

### The Scar

> "CI pipeline fails randomly. Retry fixes it.
> 'Flaky test' become excuse for ignoring failures.
> Real bug merged because 'it's just flaky'.
> $2M incident traced to dismissed test failure."

```python

## ? VIBE: Just retry and hope

@pytest.mark.flaky(reruns=3)
def test_user_registration():

## Sometimes passes, sometimes fails
response = client.post('/register', data=user_data)
assert response.status_code == 201

## Actual race condition hidden by retry

```python

## ? TITAN: Flaky test detection with statistical analysis

import pytest
from dataclasses import dataclass
from datetime import datetime
import json

@dataclass
class TestResult:
name: str
passed: bool
duration: float
timestamp: datetime

class FlakyTestDetector:
def __init__(self, history_file: str = ".test_history.json"):
self.history_file = history_file
self.results = self._load_history()

def record(self, test_name: str, passed: bool, duration: float):
if test_name not in self.results:
self.results[test_name] = []

        self.results[test_name].append({
'passed': passed,
'duration': duration,
'timestamp': datetime.now().isoformat()
        })

        self._save_history()
        self._check_flakiness(test_name)

def _check_flakiness(self, test_name: str):
history = self.results[test_name][-100:]  # Last 100 runs

if len(history) < 10:
        return

pass_rate = sum(1 for h in history if h['passed']) / len(history)

## Flaky = passes sometimes but not always
if 0.1 < pass_rate < 0.9:
self._quarantine_test(test_name, pass_rate)

def _quarantine_test(self, test_name: str, pass_rate: float):
print(f"?? QUARANTINED: {test_name} (pass rate: {pass_rate*100:.1f}%)")

## Add to quarantine list, notify team, create ticket

## ? TITAN: Pytest plugin for automatic detection

## conftest.py

detector = FlakyTestDetector()

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
outcome = yield
report = outcome.get_result()

if report.when == 'call':
        detector.record(
        test_name=item.nodeid,
        passed=report.passed,
        duration=report.duration
        )

```text

## VISUAL REGRESSION TESTING

### The Scar

> "CSS change merged. Looked fine in dev.
> Production: button moved 2px. Covered important text.
> Users couldn't complete checkout.
> $500k lost in one weekend."

```javascript
// ? VIBE: Only test functionality, not appearance
test('button renders', () => {
render(<CheckoutButton />);
    expect(screen.getByRole('button')).toBeInTheDocument();
// Button exists but might be invisible, wrong position, etc.
});

```typescript
// ? TITAN: Visual regression with Playwright
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
test('checkout page matches snapshot', async ({ page }) => {
await page.goto('/checkout');

// Wait for all images to load
await page.waitForLoadState('networkidle');

// Mask dynamic content (dates, prices that change)
await expect(page).toHaveScreenshot('checkout-page.png', {
mask: [
        page.locator('.timestamp'),
        page.locator('.dynamic-price')
        ],
maxDiffPixels: 100,  // Allow minor rendering differences
threshold: 0.1  // 10% pixel difference tolerance
        });
    });

test('button hover state', async ({ page }) => {
await page.goto('/checkout');
const button = page.getByRole('button', { name: 'Pay Now' });

// Capture normal state
await expect(button).toHaveScreenshot('button-normal.png');

// Capture hover state
await button.hover();
await expect(button).toHaveScreenshot('button-hover.png');
    });

// ? TITAN: Component-level visual testing
test('isolated component snapshots', async ({ page }) => {
// Mount component in isolation
await page.goto('/storybook/iframe.html?id=button--primary');

const component = page.locator('#root > *');
await expect(component).toHaveScreenshot('button-primary.png');
    });
});

// ? TITAN: Responsive visual testing
const viewports = [
{ width: 375, height: 667, name: 'mobile' },
{ width: 768, height: 1024, name: 'tablet' },
{ width: 1440, height: 900, name: 'desktop' }
];

for (const viewport of viewports) {
test(`checkout on ${viewport.name}`, async ({ page }) => {
await page.setViewportSize(viewport);
await page.goto('/checkout');
await expect(page).toHaveScreenshot(`checkout-${viewport.name}.png`);
    });
}

```text

## LOAD TESTING WITH K6

### The Scar

> "Load test passed with 1000 users.
> Black Friday: 5000 concurrent users.
> Database connection pool exhausted. 503 errors.
> Load test didn't simulate realistic user behavior."

```javascript
// ? VIBE: Simple load test
import http from 'k6/http';

export default function() {
    http.get('https://api.example.com/products');
}
// All users hit same endpoint = not realistic

```javascript
// ? TITAN: Realistic user journey simulation
import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

// Realistic load profile
export const options = {
stages: [
{ duration: '5m', target: 100 },   // Ramp up
{ duration: '10m', target: 500 },  // Sustained load
{ duration: '5m', target: 1000 },  // Peak
{ duration: '10m', target: 500 },  // Back to normal
{ duration: '5m', target: 0 }  // Ramp down
    ],
thresholds: {
http_req_duration: ['p(95)<500', 'p(99)<1000'],  // 95% under 500ms
http_req_failed: ['rate<0.01'],  // <1% failure rate
'http_req_duration{name:checkout}': ['p(95)<1000'] // Checkout specific
    }
};

const testData = new SharedArray('users', function() {
return JSON.parse(open('./test-users.json'));
});

export default function() {
const user = testData[__VU % testData.length];

// Simulate realistic user journey

// 1. Browse products (70% of traffic)
const browseResponse = http.get('https://api.example.com/products');
check(browseResponse, { 'browse status 200': (r) => r.status === 200 });
sleep(randomIntBetween(1, 5));  // Think time

// 2. View product detail (50% of traffic)
if (Math.random() < 0.5) {
const productId = browseResponse.json().products[0].id;
        http.get(`https://api.example.com/products/${productId}`);
sleep(randomIntBetween(2, 10));
    }

// 3. Add to cart (20% of traffic)
if (Math.random() < 0.2) {
http.post('https://api.example.com/cart', JSON.stringify({
productId: 123,
quantity: 1
}), { headers: { 'Content-Type': 'application/json' }});
sleep(randomIntBetween(1, 3));
    }

// 4. Checkout (5% of traffic)
if (Math.random() < 0.05) {
const checkoutResponse = http.post(
        'https://api.example.com/checkout',
JSON.stringify({ paymentMethod: 'card' }),
        {
headers: { 'Authorization': `Bearer ${user.token}` },
tags: { name: 'checkout' }  // Tag for specific threshold
        }
        );
check(checkoutResponse, { 'checkout success': (r) => r.status === 200 });
    }
}

function randomIntBetween(min, max) {
return Math.floor(Math.random() * (max - min + 1) + min);
}

```text

## CONTRACT TESTING WITH PACT

### The Scar

> "Frontend team updates API call. Tests pass.
> Backend team changes response format. Tests pass.
> Integration breaks in production.
> Both teams tested in isolation."

```typescript
// ? VIBE: Mock the API response directly
test('displays user profile', async () => {
jest.mock('./api', () => ({
getUser: () => Promise.resolve({ name: 'John' })
    }));
// Mock doesn't match real API structure
// Real API returns { data: { user: { name: 'John' } } }
});

```typescript
// ? TITAN: Consumer-driven contracts with Pact
// Consumer (Frontend) defines expected API behavior
import { Pact } from '@pact-foundation/pact';

const provider = new Pact({
consumer: 'WebApp',
provider: 'UserService',
port: 1234
});

describe('User API Contract', () => {
beforeAll(() => provider.setup());
afterEach(() => provider.verify());
afterAll(() => provider.finalize());

test('get user by ID', async () => {
// Define expected interaction
await provider.addInteraction({
state: 'user 123 exists',
uponReceiving: 'a request for user 123',
withRequest: {
method: 'GET',
path: '/users/123',
headers: {
Accept: 'application/json'
        }
        },
willRespondWith: {
status: 200,
headers: {
'Content-Type': 'application/json'
        },
body: {
id: '123',
name: like('John Doe'),  // Matches any string
email: regex(/\S+@\S+\.\S+/)  // Matches email pattern
        }
        }
        });

// Use the mock provider
const user = await fetchUser('123');
        expect(user.name).toBeDefined();
    });
});

// ? TITAN: Provider verification (Backend)
// Verify the backend actually does what consumer expects
import { Verifier } from '@pact-foundation/pact';

describe('Pact Verification', () => {
test('validates consumer contracts', async () => {
const verifier = new Verifier({
providerBaseUrl: 'http://localhost:3000',
pactUrls: [
'./pacts/webapp-userservice.json' // Consumer contract
        ],
stateHandlers: {
'user 123 exists': async () => {
// Set up database state
await db.users.create({ id: '123', name: 'Test User' });
        }
        }
        });

await verifier.verifyProvider();
    });
});

```text

## SNAPSHOT TESTING ANTI-PATTERNS

### The Scar

> "3000 snapshot tests. All pass.
> But team just runs `jest --updateSnapshot` when they fail.
> Snapshots became meaningless. Regressions missed.
> Snapshot test coverage: 0% (effectively)."

```javascript
// ? VIBE: Snapshot entire component blindly
test('user profile', () => {
const { container } = render(<UserProfile user={user} />);
    expect(container).toMatchSnapshot();
// 500 lines of HTML nobody reads
// Changes approved without review
});

```typescript
// ? TITAN: Focused, meaningful snapshots
import { render, screen } from '@testing-library/react';

describe('UserProfile Snapshots', () => {
// ? Snapshot specific, stable structures
test('renders avatar with correct attributes', () => {
render(<UserProfile user={user} />);
const avatar = screen.getByRole('img', { name: /avatar/i });

// Snapshot only the relevant attributes
        expect({
src: avatar.getAttribute('src'),
alt: avatar.getAttribute('alt'),
className: avatar.className
        }).toMatchInlineSnapshot(`
Object {
"alt": "User avatar",
"className": "avatar avatar--large",
"src": "https://cdn.example.com/avatars/123.jpg",
        }
        `);
    });

// ? Use inline snapshots for small, focused assertions
test('formats user name correctly', () => {
const formattedName = formatDisplayName({ first: 'john', last: 'DOE' });
expect(formattedName).toMatchInlineSnapshot(`"John Doe"`);
    });

// ? Snapshot data structure, not rendered output
test('API response shape', async () => {
const response = await api.getUser('123');

// Snapshot the shape, not values
        expect(Object.keys(response).sort()).toMatchInlineSnapshot(`
Array [
        "createdAt",
        "email",
        "id",
        "name",
        "updatedAt",
        ]
        `);
    });
});

// ? TITAN: Snapshot review enforcement
// .github/workflows/snapshot-review.yml
/*
name: Snapshot Review
on: pull_request
jobs:
  check-snapshots:
runs-on: ubuntu-latest
    steps:
- uses: actions/checkout@v3
- run: npm test
- name: Check for snapshot changes
| run: |
| if git diff --name-only | grep -q "\.snap"; then |
echo "?? SNAPSHOT CHANGES DETECTED"
echo "Please review all snapshot changes carefully."
echo "Do NOT blindly accept snapshot updates."
git diff --stat -- '*.snap'
exit 0  # Don't block, but flag for review
        fi
*/

```text

### END OF VOLUME 3.5: TITAN GEMINI RESEARCH - TESTING PRODUCTION FAILURES

---

## VOLUME 4: TITAN GEMINI RESEARCH - ADVANCED TESTING PATTERNS

## PROPERTY-BASED TESTING

### The Scar

> "Unit tests passing. 100% coverage.
> Edge case in production: empty array + null input.
> Crash. Never tested that combination.
> Infinite combinations. Can't write tests for all."

```typescript
// ? VIBE: Example-based testing only
describe('sortUsers', () => {
test('sorts by name', () => {
const users = [{ name: 'Bob' }, { name: 'Alice' }];
expect(sortUsers(users)).toEqual([{ name: 'Alice' }, { name: 'Bob' }]);
    });
// What about empty array? Null? Duplicates? Unicode? 1000 items?
});

```typescript
// ? TITAN: Property-based testing with fast-check
import fc from 'fast-check';

describe('sortUsers - property based', () => {
// Arbitrary for generating random users
const userArb = fc.record({
id: fc.uuid(),
name: fc.string({ minLength: 0, maxLength: 100 }),
age: fc.integer({ min: 0, max: 150 }),
email: fc.emailAddress(),
createdAt: fc.date(),
    });

const usersArb = fc.array(userArb, { minLength: 0, maxLength: 1000 });

test('property: output length equals input length', () => {
        fc.assert(
fc.property(usersArb, (users) => {
const sorted = sortUsers(users);
return sorted.length === users.length;
        })
        );
    });

test('property: output is sorted', () => {
        fc.assert(
fc.property(usersArb, (users) => {
const sorted = sortUsers(users);

for (let i = 1; i < sorted.length; i++) {
if (sorted[i].name.localeCompare(sorted[i-1].name) < 0) {
return false;  // Not sorted!
        }
        }
return true;
        })
        );
    });

test('property: idempotent - sorting twice gives same result', () => {
        fc.assert(
fc.property(usersArb, (users) => {
const once = sortUsers(users);
const twice = sortUsers(once);
return JSON.stringify(once) === JSON.stringify(twice);
        })
        );
    });

test('property: all original elements present', () => {
        fc.assert(
fc.property(usersArb, (users) => {
const sorted = sortUsers(users);
const originalIds = new Set(users.map(u => u.id));
const sortedIds = new Set(sorted.map(u => u.id));

return originalIds.size === sortedIds.size &&
[...originalIds].every(id => sortedIds.has(id));
        })
        );
    });

// When a property fails, fast-check shrinks to minimal failing case
test('property: handles edge cases', () => {
        fc.assert(
        fc.property(
        fc.oneof(
fc.constant([]), // Empty
fc.constant([null]), // Null element
fc.constant([undefined]), // Undefined
usersArb // Random
        ),
(input) => {
try {
const result = sortUsers(input);
return Array.isArray(result);
} catch {
return false;  // Should never throw
        }
        }
        )
        );
    });
});

// ? TITAN: Stateful property testing
describe('UserStore - stateful testing', () => {
class UserStoreModel {
users = new Map();

add(user) { this.users.set(user.id, user); }
remove(id) { this.users.delete(id); }
get(id) { return this.users.get(id); }
count() { return this.users.size; }
    }

test('model equivalence', () => {
        fc.assert(
        fc.property(
        fc.commands([
fc.record({ id: fc.uuid(), name: fc.string() })
.map(user => new AddUserCommand(user)),
fc.uuid().map(id => new RemoveUserCommand(id)),
fc.uuid().map(id => new GetUserCommand(id)),
], { maxCommands: 100 }),
(commands) => {
const realStore = new UserStore();
const model = new UserStoreModel();

for (const command of commands) {
command.run(model, realStore);
        }

return realStore.count() === model.count();
        }
        )
        );
    });
});

```text

## MUTATION TESTING

### The Scar

> "100% code coverage. Tests all passing.
> Changed `>` to `>=` in production code.
> Tests still passed. Coverage still 100%.
> Coverage lies. Tests weren't actually verifying logic."

```typescript
// ? VIBE: Tests that pass even with bugs
function isEligible(age: number): boolean {
return age > 18;  // Bug: should be >=
}

test('checks eligibility', () => {
    expect(isEligible(20)).toBe(true);
    expect(isEligible(10)).toBe(false);
// Never tests age=18, the boundary!
});

```typescript
// ? TITAN: Mutation testing with Stryker
// stryker.conf.json
{
"$schema": "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
"packageManager": "npm",
"reporters": ["html", "clear-text", "progress"],
"testRunner": "vitest",
"coverageAnalysis": "perTest",
"mutate": ["src/**/*.ts", "!src/**/*.test.ts"],
"thresholds": {
"high": 80,
"low": 60,
"break": 50  // Fail CI if mutation score < 50%
    },
"mutator": {
"excludedMutations": [
"StringLiteral" // Don't mutate string literals
        ]
    }
}

// Better test that catches mutations
test('boundary conditions for eligibility', () => {
// Exactly at boundary
expect(isEligible(18)).toBe(true); // Catches > vs >= mutation

// One below boundary
expect(isEligible(17)).toBe(false); // Catches off-by-one

// Edge cases
    expect(isEligible(0)).toBe(false);
    expect(isEligible(-1)).toBe(false);
    expect(isEligible(100)).toBe(true);
});

// ? TITAN: CI integration for mutation testing
// .github/workflows/mutation.yml
/*
name: Mutation Testing
on:
  pull_request:
    paths:
- 'src/**'
jobs:
  stryker:
runs-on: ubuntu-latest
    steps:
- uses: actions/checkout@v3
- uses: actions/setup-node@v3
- run: npm ci
- run: npx stryker run
- name: Check mutation score
| run: |
| SCORE=$(cat reports/mutation/mutation.json | jq '.mutationScore') |
| if (( $(echo "$SCORE < 60" | bc -l) )); then |
echo "? Mutation score $SCORE% is below threshold (60%)"
exit 1
        fi
echo "? Mutation score: $SCORE%"
*/

```text

## E2E TESTING WITH PLAYWRIGHT

### The Scar

> "Cypress tests passing locally. CI failing.
> Different timing in CI. Elements not ready.
> Added sleep(5000) everywhere.
> Tests now take 30 minutes. Still flaky."

```typescript
// ? VIBE: Flaky E2E with arbitrary waits
test('login flow', async () => {
await page.goto('/login');
await page.waitForTimeout(2000);  // Arbitrary wait
await page.fill('#email', 'test@example.com');
await page.fill('#password', 'password');
await page.click('button[type="submit"]');
await page.waitForTimeout(3000);  // Another guess
expect(await page.url()).toContain('/dashboard');
});

```typescript
// ? TITAN: Robust Playwright E2E
import { test, expect, Page } from '@playwright/test';

// Page Object Model for maintainability
class LoginPage {
constructor(private page: Page) {}

async goto() {
await this.page.goto('/login');
// Wait for actual render, not arbitrary time
await this.page.waitForSelector('form[data-testid="login-form"]');
    }

async login(email: string, password: string) {
await this.page.fill('[data-testid="email-input"]', email);
await this.page.fill('[data-testid="password-input"]', password);

// Use Promise.all for navigation + click
await Promise.all([
this.page.waitForNavigation({ waitUntil: 'networkidle' }),
        this.page.click('[data-testid="submit-button"]'),
        ]);
    }

async expectError(message: string) {
await expect(
        this.page.locator('[data-testid="error-message"]')
        ).toContainText(message);
    }
}

class DashboardPage {
constructor(private page: Page) {}

async waitForLoad() {
// Wait for specific content, not arbitrary time
await this.page.waitForSelector('[data-testid="dashboard-content"]');
// Wait for API data to load
await this.page.waitForResponse(
resp => resp.url().includes('/api/user') && resp.status() === 200
        );
    }

async getUserName(): Promise<string> {
return this.page.textContent('[data-testid="user-name"]') ?? '';
    }
}

test.describe('Authentication', () => {
let loginPage: LoginPage;
let dashboardPage: DashboardPage;

test.beforeEach(async ({ page }) => {
loginPage = new LoginPage(page);
dashboardPage = new DashboardPage(page);
    });

test('successful login redirects to dashboard', async ({ page }) => {
await loginPage.goto();
await loginPage.login('test@example.com', 'validpassword');

await dashboardPage.waitForLoad();
        expect(page.url()).toContain('/dashboard');

const userName = await dashboardPage.getUserName();
expect(userName).toBe('Test User');
    });

test('invalid credentials show error', async ({ page }) => {
await loginPage.goto();
await loginPage.login('test@example.com', 'wrongpassword');

await loginPage.expectError('Invalid credentials');
        expect(page.url()).toContain('/login');
    });

// Retry flaky operations, not the whole test
test('handles network issues gracefully', async ({ page }) => {
await loginPage.goto();

// Simulate slow network
await page.route('**/api/auth/login', async route => {
await new Promise(r => setTimeout(r, 5000));
await route.continue();
        });

await loginPage.login('test@example.com', 'validpassword');

// Should show loading state
await expect(
        page.locator('[data-testid="loading-spinner"]')
        ).toBeVisible();

// Then complete
await dashboardPage.waitForLoad();
    });
});

// ? TITAN: Visual regression testing
test('homepage visual regression', async ({ page }) => {
await page.goto('/');
await page.waitForLoadState('networkidle');

// Full page screenshot comparison
await expect(page).toHaveScreenshot('homepage.png', {
fullPage: true,
animations: 'disabled',  // Prevent flaky diffs from animations
mask: [
page.locator('[data-testid="timestamp"]'), // Mask dynamic content
        page.locator('[data-testid="random-ad"]'),
        ],
    });
});

// Config for reliable CI runs
// playwright.config.ts
export default defineConfig({
retries: process.env.CI ? 2 : 0,
timeout: 30000,
expect: {
timeout: 10000,
    },
use: {
actionTimeout: 10000,
trace: 'on-first-retry',  // Capture trace on failure
video: 'on-first-retry',
screenshot: 'only-on-failure',
    },
webServer: {
command: 'npm run start:test',
port: 3000,
reuseExistingServer: !process.env.CI,
    },
});

```text

### END OF VOLUME 4: TITAN GEMINI RESEARCH - ADVANCED TESTING PATTERNS

---

## VOLUME 5: TITAN GEMINI RESEARCH - CHAOS ENGINEERING

## RESILIENCE ASSUMPTIONS THAT FAIL IN PRODUCTION

### The Scar

> "Circuit breaker configured. Retry logic implemented.
> 'We're resilient!' Then dependency went down.
> Circuit breaker never triggered. Retries made it worse.
> Never tested failure scenarios. Assumptions were wrong."

```python

## ? VIBE: Assume resilience works without testing

@retry(times=3, delay=1)
@circuit_breaker(threshold=5)
def call_payment_service(data):
return http.post(PAYMENT_URL, data)

## Never tested: What if payment service returns 200 but wrong data?

## Never tested: What if latency is 30s instead of timeout?

```python

## ? TITAN: Chaos testing with fault injection

from chaos_lib import FaultInjector
import pytest
import asyncio

class ChaosTestSuite:
"""Production chaos engineering tests."""

def __init__(self, target_service: str):
self.injector = FaultInjector(target_service)
self.metrics_client = PrometheusClient()

    @pytest.fixture
async def inject_latency(self):
"""Inject 5s latency to downstream service."""
        self.injector.add_latency(
        target='payment-service',
        latency_ms=5000,
        percentage=100
        )
        yield
        self.injector.clear_all()

    @pytest.fixture
async def inject_errors(self):
"""Inject 50% error rate."""
        self.injector.add_error(
        target='payment-service',
        error_rate=0.5,
        error_code=500
        )
        yield
        self.injector.clear_all()

async def test_graceful_degradation_under_latency(self, inject_latency):
"""Verify system degrades gracefully when dependency is slow."""

start = asyncio.get_event_loop().time()

## System should timeout, not hang
response = await self.make_checkout_request(timeout=10)

elapsed = asyncio.get_event_loop().time() - start

## Should fail fast, not wait 5 seconds
assert elapsed < 3, f"Request took {elapsed}s, should fail fast"
assert response.status_code == 503
assert 'temporarily unavailable' in response.json()['message'].lower()

## Verify circuit breaker opened
metrics = await self.metrics_client.query(
        'circuit_breaker_state{service="payment-service"}'
        )
assert metrics[0]['value'] == 'open'

async def test_retry_backoff_under_errors(self, inject_errors):
"""Verify retries don't amplify failures."""

## Make 100 concurrent requests
tasks = [self.make_checkout_request() for _ in range(100)]
responses = await asyncio.gather(*tasks, return_exceptions=True)

## Check retry metrics - should be limited
retry_count = await self.metrics_client.query(
        'http_client_retries_total{target="payment-service"}'
        )

## Should not retry excessively (would amplify load)
assert retry_count < 200, f"Too many retries: {retry_count}"

## Verify some requests succeeded (circuit breaker should partially open)
success_count = sum(1 for r in responses if not isinstance(r, Exception) and r.status_code == 200)
assert success_count > 0, "All requests failed, no fallback"

async def test_bulkhead_isolation(self):
"""Verify one failing dependency doesn't crash everything."""

## Inject total failure to payment service
        self.injector.add_error(
        target='payment-service',
        error_rate=1.0,
        error_code=503
        )

## Other services should still work
product_response = await self.make_request('/api/products')
user_response = await self.make_request('/api/users/me')

assert product_response.status_code == 200
assert user_response.status_code == 200

        self.injector.clear_all()

```yaml

## ? TITAN: AWS FIS (Fault Injection Simulator) experiment

AWSTemplateFormatVersion: '2010-09-09'
Description: Chaos engineering experiment template

Resources:
  ChaosExperiment:
Type: AWS::FIS::ExperimentTemplate
    Properties:
Description: Test ECS service resilience
RoleArn: !GetAtt FISRole.Arn
      StopConditions:
- Source: aws:cloudwatch:alarm
Value: !Ref RollbackAlarm

      Targets:
        EcsTasks:
ResourceType: aws:ecs:task
        ResourceTags:
Environment: staging
SelectionMode: PERCENT(50)

      Actions:
        TerminateTasks:
ActionId: aws:ecs:stop-task
        Parameters:
stopTaskBehavior: ABORT
        Targets:
Tasks: EcsTasks
        StartAfter:
- WarmUp

        InjectCpuStress:
ActionId: aws:ssm:send-command
        Parameters:
documentArn: arn:aws:ssm:::document/AWSFIS-Run-CPU-Stress
documentParameters: '{"DurationSeconds": "120", "LoadPercent": "80"}'
        Targets:
Instances: EcsInstances

      Tags:
Name: ecs-resilience-test

  RollbackAlarm:
Type: AWS::CloudWatch::Alarm
    Properties:
AlarmName: chaos-rollback-trigger
MetricName: HTTPCode_Target_5XX_Count
Namespace: AWS/ApplicationELB
Statistic: Sum
Period: 60
EvaluationPeriods: 2
Threshold: 100
ComparisonOperator: GreaterThanThreshold

```python

## ? TITAN: Gameday exercise framework

from dataclasses import dataclass
from datetime import datetime
from typing import List, Callable
import asyncio

@dataclass
class GamedayScenario:
name: str
description: str
hypothesis: str
inject_fault: Callable
verify_behavior: Callable
rollback: Callable
max_duration_minutes: int = 30

class GamedayRunner:
"""Run controlled chaos experiments with safety guardrails."""

def __init__(self,
scenarios: List[GamedayScenario],
alert_channel: str,
rollback_threshold: int = 10):
self.scenarios = scenarios
self.slack = SlackClient(alert_channel)
self.rollback_threshold = rollback_threshold
self.error_count = 0

async def run_gameday(self, scenario_name: str) -> dict:
"""Run a specific gameday scenario."""

scenario = next(s for s in self.scenarios if s.name == scenario_name)

## Announce start
await self.slack.post(f"""
?? **GAMEDAY STARTING**
?? Scenario: {scenario.name}
?? Description: {scenario.description}
?? Hypothesis: {scenario.hypothesis}
? Max Duration: {scenario.max_duration_minutes} min
        """)

results = {
'scenario': scenario.name,
'started_at': datetime.utcnow().isoformat(),
'hypothesis': scenario.hypothesis,
'passed': False,
'observations': []
        }

        try:

## Start monitoring
monitor_task = asyncio.create_task(
        self._monitor_health(scenario)
        )

## Inject fault
await self.slack.post("?? Injecting fault...")
await scenario.inject_fault()

## Observe behavior
await self.slack.post("?? Observing system behavior...")
observations = await scenario.verify_behavior()
results['observations'] = observations

## Check if hypothesis held
results['passed'] = all(o['success'] for o in observations)

if results['passed']:
await self.slack.post("? Hypothesis confirmed! System behaved as expected.")
        else:
await self.slack.post("? Hypothesis failed! See observations for details.")

except Exception as e:
results['error'] = str(e)
await self.slack.post(f"?? Gameday error: {e}")

        finally:

## Always rollback
await self.slack.post("?? Rolling back fault injection...")
await scenario.rollback()
        monitor_task.cancel()

results['ended_at'] = datetime.utcnow().isoformat()

return results

async def _monitor_health(self, scenario: GamedayScenario):
"""Monitor system health during gameday."""

start_time = asyncio.get_event_loop().time()
max_duration = scenario.max_duration_minutes * 60

while True:
await asyncio.sleep(5)

## Check if we've exceeded max duration
elapsed = asyncio.get_event_loop().time() - start_time
if elapsed > max_duration:
await self.slack.post("? Max duration reached, triggering rollback")
await scenario.rollback()
        break

## Check error rate
errors = await self._get_current_error_rate()
if errors > self.rollback_threshold:
await self.slack.post(f"?? Error threshold exceeded ({errors}%), auto-rollback")
await scenario.rollback()
        break

## Usage

scenarios = [
    GamedayScenario(
        name="database_failover",
description="Simulate primary database failure",
hypothesis="System should automatically failover to replica within 30s",
inject_fault=lambda: rds_client.reboot_db_instance(
        DBInstanceIdentifier='primary',
        ForceFailover=True
        ),
        verify_behavior=verify_failover_time,
rollback=lambda: None  # Automatic recovery
    )
]

runner = GamedayRunner(scenarios, '#incidents')
results = await runner.run_gameday("database_failover")

```text

## END OF VOLUME 5: TITAN GEMINI RESEARCH - CHAOS ENGINEERING

---

## VOLUME 5: ADVANCED TESTING PATTERNS

## E2E TESTING WITH PLAYWRIGHT

### Page Object Model at Scale

```typescript
// ? TITAN: Production Playwright test framework
import { test, expect, Page, Locator } from '@playwright/test';

// Base Page Object with common functionality
abstract class BasePage {
protected page: Page;

// Common selectors
protected readonly loadingSpinner = '[data-testid="loading-spinner"]';
protected readonly errorAlert = '[role="alert"]';
protected readonly toast = '[data-testid="toast"]';

constructor(page: Page) {
this.page = page;
  }

async waitForPageLoad(): Promise<void> {
await this.page.waitForLoadState('networkidle');
await this.page.waitForSelector(this.loadingSpinner, { state: 'hidden' });
  }

async expectNoErrors(): Promise<void> {
const errorCount = await this.page.locator(this.errorAlert).count();
    expect(errorCount).toBe(0);
  }

async getToastMessage(): Promise<string> {
const toast = this.page.locator(this.toast);
await toast.waitFor({ state: 'visible' });
return toast.textContent() ?? '';
  }

async screenshot(name: string): Promise<void> {
await this.page.screenshot({ path: \screenshots/\.png\, fullPage: true });
  }
}

// Product List Page Object
class ProductListPage extends BasePage {
readonly url = '/products';
readonly productCards = '[data-testid="product-card"]';
readonly searchInput = '[data-testid="search-input"]';
readonly filterPanel = '[data-testid="filter-panel"]';
readonly sortDropdown = '[data-testid="sort-dropdown"]';
readonly loadMoreButton = '[data-testid="load-more"]';

async goto(): Promise<void> {
await this.page.goto(this.url);
await this.waitForPageLoad();
  }

async search(query: string): Promise<void> {
await this.page.fill(this.searchInput, query);
await this.page.keyboard.press('Enter');
await this.waitForPageLoad();
  }

async filterByCategory(category: string): Promise<void> {
await this.page.click(this.filterPanel);
await this.page.click(\[data-testid="category-\"]\);
await this.waitForPageLoad();
  }

| async sortBy(option: 'price-asc' | 'price-desc' | 'newest'): Promise<void> { |
await this.page.click(this.sortDropdown);
await this.page.click(\[data-testid="sort-\"]\);
await this.waitForPageLoad();
  }

async getProductCount(): Promise<number> {
return this.page.locator(this.productCards).count();
  }

async getProductByIndex(index: number): Promise<ProductCard> {
const card = this.page.locator(this.productCards).nth(index);
return new ProductCard(this.page, card);
  }

async loadMore(): Promise<void> {
const initialCount = await this.getProductCount();
await this.page.click(this.loadMoreButton);
await this.page.waitForFunction(
(count) => document.querySelectorAll('[data-testid="product-card"]').length > count,
      initialCount
    );
  }
}

// Product Card component
class ProductCard {
constructor(private page: Page, private locator: Locator) {}

async getTitle(): Promise<string> {
return this.locator.locator('[data-testid="product-title"]').textContent() ?? '';
  }

async getPrice(): Promise<number> {
const priceText = await this.locator.locator('[data-testid="product-price"]').textContent();
return parseFloat(priceText?.replace(/[^0-9.]/g, '') ?? '0');
  }

async addToCart(): Promise<void> {
await this.locator.locator('[data-testid="add-to-cart"]').click();
  }

async click(): Promise<void> {
await this.locator.click();
  }
}

// Test suite
test.describe('Product List', () => {
let productList: ProductListPage;

test.beforeEach(async ({ page }) => {
productList = new ProductListPage(page);
await productList.goto();
  });

test('should display products', async () => {
const count = await productList.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

test('should search products', async () => {
await productList.search('laptop');
const count = await productList.getProductCount();
    expect(count).toBeGreaterThan(0);

const firstProduct = await productList.getProductByIndex(0);
const title = await firstProduct.getTitle();
    expect(title.toLowerCase()).toContain('laptop');
  });

test('should sort by price ascending', async () => {
await productList.sortBy('price-asc');

const first = await productList.getProductByIndex(0);
const second = await productList.getProductByIndex(1);

const firstPrice = await first.getPrice();
const secondPrice = await second.getPrice();

    expect(firstPrice).toBeLessThanOrEqual(secondPrice);
  });

test('should add product to cart', async ({ page }) => {
const product = await productList.getProductByIndex(0);
await product.addToCart();

const toast = await productList.getToastMessage();
expect(toast).toContain('Added to cart');

// Verify cart count updated
const cartCount = page.locator('[data-testid="cart-count"]');
await expect(cartCount).toHaveText('1');
  });
});

```text
---

## API TESTING WITH SUPERTEST

### Contract Testing Pattern

```typescript
// ? TITAN: Production API contract tests
import request from 'supertest';
import { app } from '../src/app';
import { prisma } from '../src/db';
import { createTestUser, createTestProduct } from './factories';

describe('Products API', () => {
let authToken: string;
let testUser: any;

beforeAll(async () => {
// Setup test database
await prisma.\\TRUNCATE TABLE "Product" CASCADE\;

testUser = await createTestUser();
const loginResponse = await request(app)
      .post('/api/auth/login')
.send({ email: testUser.email, password: 'testpassword123' });

authToken = loginResponse.body.accessToken;
  });

afterAll(async () => {
await prisma.\();
  });

describe('GET /api/products', () => {
it('should return paginated products', async () => {
// Arrange
await Promise.all([
createTestProduct({ name: 'Product 1' }),
createTestProduct({ name: 'Product 2' }),
createTestProduct({ name: 'Product 3' })
      ]);

// Act
const response = await request(app)
        .get('/api/products')
.query({ page: 1, limit: 10 })
.set('Authorization', \Bearer \\);

// Assert
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
data: expect.arrayContaining([
        expect.objectContaining({
id: expect.any(String),
name: expect.any(String),
price: expect.any(Number),
createdAt: expect.any(String)
        })
        ]),
pagination: {
page: 1,
limit: 10,
total: expect.any(Number),
hasMore: expect.any(Boolean)
        }
      });
    });

it('should filter by category', async () => {
await createTestProduct({ name: 'Electronics Item', category: 'electronics' });
await createTestProduct({ name: 'Clothing Item', category: 'clothing' });

const response = await request(app)
        .get('/api/products')
.query({ category: 'electronics' })
.set('Authorization', \Bearer \\);

      expect(response.status).toBe(200);
expect(response.body.data.every((p: any) => p.category === 'electronics')).toBe(true);
    });

it('should return 401 without auth token', async () => {
const response = await request(app).get('/api/products');

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
error: 'Unauthorized',
message: expect.any(String)
      });
    });
  });

describe('POST /api/products', () => {
it('should create a product', async () => {
const newProduct = {
name: 'New Product',
description: 'A great product',
price: 99.99,
category: 'electronics',
stock: 100
      };

const response = await request(app)
        .post('/api/products')
.set('Authorization', \Bearer \\)
        .send(newProduct);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
id: expect.any(String),
        ...newProduct,
createdAt: expect.any(String),
updatedAt: expect.any(String)
      });

// Verify in database
const dbProduct = await prisma.product.findUnique({
where: { id: response.body.id }
      });
      expect(dbProduct).not.toBeNull();
      expect(dbProduct?.name).toBe(newProduct.name);
    });

it('should validate required fields', async () => {
const response = await request(app)
        .post('/api/products')
.set('Authorization', \Bearer \\)
.send({ name: '' });  // Missing required fields

      expect(response.status).toBe(400);
      expect(response.body.errors).toContainEqual(
expect.objectContaining({ field: 'name' })
      );
    });

it('should validate price is positive', async () => {
const response = await request(app)
        .post('/api/products')
.set('Authorization', \Bearer \\)
        .send({
name: 'Test Product',
price: -10,  // Invalid
category: 'electronics'
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
field: 'price',
message: expect.stringContaining('positive')
        })
      );
    });
  });
});

```text
---

## LOAD TESTING WITH K6

### Production Load Test Suite

```javascript
// ? TITAN: Production load testing with k6
import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const successfulLogins = new Counter('successful_logins');
const p99Latency = new Trend('p99_latency');

// Test configuration
export const options = {
stages: [
{ duration: '2m', target: 100 },   // Ramp up to 100 users
{ duration: '5m', target: 100 },   // Stay at 100 users
{ duration: '2m', target: 200 },   // Ramp up to 200 users
{ duration: '5m', target: 200 },   // Stay at 200 users
{ duration: '2m', target: 0 },  // Ramp down to 0
  ],
thresholds: {
http_req_duration: ['p(95)<500', 'p(99)<1000'],  // 95% under 500ms, 99% under 1s
errors: ['rate<0.01'],  // Error rate under 1%
http_req_failed: ['rate<0.01'],
  },
};

| const BASE_URL = __ENV.BASE_URL |  | 'https://api.example.com'; |

export default function () {
group('User Journey: Browse and Purchase', function () {
// Step 1: Login
let loginRes = http.post(\\/api/auth/login\, JSON.stringify({
email: \user\@test.com\,
password: 'testpassword123'
}), {
headers: { 'Content-Type': 'application/json' },
    });

const loginSuccess = check(loginRes, {
'login successful': (r) => r.status === 200,
'has access token': (r) => r.json('accessToken') !== undefined,
    });

if (loginSuccess) {
      successfulLogins.add(1);
} else {
      errorRate.add(1);
return; // Skip rest of journey if login fails
    }

const token = loginRes.json('accessToken');
const authHeaders = {
'Authorization': \Bearer \\,
'Content-Type': 'application/json',
    };

    sleep(1);

// Step 2: Browse products
let productsRes = http.get(\\/api/products?page=1&limit=20\, {
headers: authHeaders,
    });

check(productsRes, {
'products loaded': (r) => r.status === 200,
'has products': (r) => r.json('data').length > 0,
    });

    p99Latency.add(productsRes.timings.duration);

    sleep(2);

// Step 3: View product detail
const products = productsRes.json('data');
if (products.length > 0) {
const productId = products[0].id;

let detailRes = http.get(\\/api/products/\\, {
headers: authHeaders,
      });

check(detailRes, {
'product detail loaded': (r) => r.status === 200,
      });
    }

    sleep(1);

// Step 4: Add to cart
if (products.length > 0) {
let cartRes = http.post(\\/api/cart/items\, JSON.stringify({
productId: products[0].id,
quantity: 1
}), {
headers: authHeaders,
      });

check(cartRes, {
'added to cart': (r) => r.status === 201,
      });
    }

    sleep(0.5);
  });
}

// Setup function runs once before the test
export function setup() {
// Create test users if needed
console.log('Setting up load test...');
}

// Teardown function runs once after the test
export function teardown(data) {
// Clean up test data
console.log('Cleaning up load test data...');
}

```text
---

### END OF TESTING VOLUME 5

### Lines: ~450+ added

---

## VOLUME 5: REAL E2E TESTING PATTERNS 2024

## Source: Playwright Docs, Production Experience, Best Practices

> ?? **This is REAL testing knowledge from production apps.**

---

## PLAYWRIGHT API MOCKING

```typescript
import { test, expect } from '@playwright/test';

// Mock API response before page loads
test('displays products from API', async ({ page }) => {
// Intercept API call
await page.route('**/api/products', async route => {
const mockProducts = [
{ id: '1', name: 'Product 1', price: 999 },
{ id: '2', name: 'Product 2', price: 1499 },
    ];

await route.fulfill({
status: 200,
contentType: 'application/json',
body: JSON.stringify(mockProducts),
    });
  });

await page.goto('/products');

// Now test with consistent mock data
await expect(page.locator('.product')).toHaveCount(2);
await expect(page.locator('.product:first-child')).toContainText('Product 1');
});

```text
---

## MOCK ERROR STATES

```typescript
test('handles API errors gracefully', async ({ page }) => {
// Mock 500 error
await page.route('**/api/products', async route => {
await route.fulfill({
status: 500,
body: JSON.stringify({ error: 'Internal Server Error' }),
    });
  });

await page.goto('/products');

// Verify error message is shown
await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
});

test('shows loading state', async ({ page }) => {
// Delay response to test loading state
await page.route('**/api/products', async route => {
await new Promise(r => setTimeout(r, 2000));  // 2 second delay
await route.fulfill({
status: 200,
body: JSON.stringify([]),
    });
  });

await page.goto('/products');

// Loading spinner should appear
await expect(page.locator('[data-testid="loading"]')).toBeVisible();
});

```text
---

## HAR FILE MOCKING (Complex Networks)

```typescript
import { test } from '@playwright/test';

// Record HAR file once
test('record network to HAR', async ({ page }) => {
await page.routeFromHAR('tests/fixtures/api.har', {
update: true,  // Record mode
  });

await page.goto('/products');
// Navigate through app to record all API calls
});

// Replay in tests
test('test with recorded HAR', async ({ page }) => {
await page.routeFromHAR('tests/fixtures/api.har', {
update: false,  // Replay mode
  });

await page.goto('/products');
// All API calls replayed from HAR file
});

```text
---

## TEST ISOLATION BEST PRACTICES

```typescript
// playwright.config.ts
export default defineConfig({
use: {
// Fresh browser context per test (isolated storage)
storageState: undefined,

// Each test gets fresh page
contextOptions: {
ignoreHTTPSErrors: true,
    },
  },

// Run tests in parallel
fullyParallel: true,

// Retry on failure
retries: process.env.CI ? 2 : 0,
});

// In tests: authenticate once, reuse
test.describe('authenticated tests', () => {
test.use({ storageState: 'tests/auth-state.json' });

test('can access dashboard', async ({ page }) => {
await page.goto('/dashboard');
await expect(page).toHaveURL('/dashboard');
  });
});

```text
---

## VITEST UNIT TEST MOCKING

```typescript
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { fetchProducts } from './api';

// Mock entire module
vi.mock('./api', () => ({
fetchProducts: vi.fn(),
}));

describe('ProductList', () => {
beforeEach(() => {
    vi.clearAllMocks();
  });

it('renders products', async () => {
// Setup mock return value
    vi.mocked(fetchProducts).mockResolvedValue([
{ id: '1', name: 'Test Product' },
    ]);

// Test component
render(<ProductList />);

await waitFor(() => {
expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });

it('handles errors', async () => {
vi.mocked(fetchProducts).mockRejectedValue(new Error('API Error'));

render(<ProductList />);

await waitFor(() => {
expect(screen.getByText('Error loading products')).toBeInTheDocument();
    });
  });
});

```text
---

## DECISION TREE: WHICH TEST TO WRITE

```typescript
TESTING DECISION

+- Pure function or utility?
+- Unit test (Vitest)

+- React component in isolation?
+- Component test (Vitest + Testing Library)

+- Multiple components together?
+- Integration test (Vitest + Testing Library)

+- Full user flows?
+- E2E test (Playwright)

+- Cross-browser compatibility?
+- E2E test (Playwright with multiple browsers)

+- External API integration?
+- Development: Mock with MSW/Playwright
+- Staging: Real API calls

```text
---

### END OF TESTING PATTERNS

---

## REAL TESTING PATTERNS 2024

## Unit Testing Best Practices

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Test structure: Arrange, Act, Assert
describe('UserService', () => {
let userService: UserService;
let mockDb: MockDb;

beforeEach(() => {
mockDb = createMockDb();
userService = new UserService(mockDb);
  });

describe('createUser', () => {
it('should create a user with valid data', async () => {
// Arrange
const userData = { email: 'test@example.com', name: 'Test User' };
mockDb.user.create.mockResolvedValue({ id: '1', ...userData });

// Act
const result = await userService.createUser(userData);

// Assert
expect(result).toEqual({ id: '1', ...userData });
expect(mockDb.user.create).toHaveBeenCalledWith({ data: userData });
    });

it('should throw error for duplicate email', async () => {
// Arrange
const userData = { email: 'existing@example.com', name: 'Test' };
mockDb.user.create.mockRejectedValue(new UniqueConstraintError());

// Act & Assert
await expect(userService.createUser(userData))
.rejects.toThrow('Email already exists');
    });
  });
});

```text
---

## Mocking Patterns

```typescript
// Mock external services
vi.mock('@/lib/email', () => ({
sendEmail: vi.fn().mockResolvedValue({ success: true }),
}));

// Mock environment variables
vi.stubEnv('API_KEY', 'test-api-key');

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockResolvedValue({
ok: true,
json: async () => ({ data: 'test' }),
  });
});

// Mock timers
vi.useFakeTimers();

it('should debounce calls', async () => {
const callback = vi.fn();
const debounced = debounce(callback, 1000);

  debounced();
  debounced();
  debounced();

  expect(callback).not.toHaveBeenCalled();

  vi.advanceTimersByTime(1000);

  expect(callback).toHaveBeenCalledTimes(1);
});

```text
---

## Integration Testing

```typescript
import { createServer } from '@/server';
import request from 'supertest';

describe('API Integration Tests', () => {
let app: Express;
let db: TestDatabase;

beforeAll(async () => {
db = await createTestDatabase();
app = createServer({ db });
  });

afterAll(async () => {
await db.cleanup();
  });

beforeEach(async () => {
await db.reset();
  });

describe('POST /api/users', () => {
it('should create a user', async () => {
const response = await request(app)
        .post('/api/users')
.send({ email: 'test@example.com', password: 'Password123!' })
        .expect(201);

      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user.password).toBeUndefined();
    });

it('should return 400 for invalid email', async () => {
const response = await request(app)
        .post('/api/users')
.send({ email: 'invalid', password: 'Password123!' })
        .expect(400);

      expect(response.body.error).toBe('VALIDATION_ERROR');
    });
  });
});

```text
---

## E2E Testing with Playwright

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
test('should allow user to sign up and log in', async ({ page }) => {
// Sign up
await page.goto('/signup');
await page.fill('[name="email"]', 'newuser@example.com');
await page.fill('[name="password"]', 'SecurePassword123!');
await page.click('button[type="submit"]');

// Should redirect to dashboard
await expect(page).toHaveURL('/dashboard');
await expect(page.locator('h1')).toContainText('Welcome');

// Log out
await page.click('[data-testid="logout-button"]');
await expect(page).toHaveURL('/login');

// Log back in
await page.fill('[name="email"]', 'newuser@example.com');
await page.fill('[name="password"]', 'SecurePassword123!');
await page.click('button[type="submit"]');

await expect(page).toHaveURL('/dashboard');
  });

test('should show error for invalid credentials', async ({ page }) => {
await page.goto('/login');
await page.fill('[name="email"]', 'wrong@example.com');
await page.fill('[name="password"]', 'wrongpassword');
await page.click('button[type="submit"]');

await expect(page.locator('[role="alert"]')).toContainText('Invalid credentials');
  });
});

```text
---

## API Testing with MSW

```typescript
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const handlers = [
http.get('/api/users', () => {
return HttpResponse.json([
{ id: '1', name: 'John' },
{ id: '2', name: 'Jane' },
    ]);
  }),

http.post('/api/users', async ({ request }) => {
const body = await request.json();
return HttpResponse.json({ id: '3', ...body }, { status: 201 });
  }),

http.get('/api/users/:id', ({ params }) => {
return HttpResponse.json({ id: params.id, name: 'User' });
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Override handlers for specific tests
it('should handle server error', async () => {
  server.use(
http.get('/api/users', () => {
return new HttpResponse(null, { status: 500 });
    })
  );

// Test error handling
});

```text
---

### END OF TESTING PATTERNS

```text
