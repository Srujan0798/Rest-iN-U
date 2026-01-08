# PAYMENTS

## Table of Contents

- [Table of Contents](#table-of-contents)
- [12_PAYMENTS.MD: THE TITAN GUIDE (50K TARGET)](#12_paymentsmd-the-titan-guide-50k-target)
- [Production-Grade Stripe, Ledger Design, and Crypto](#production-grade-stripe-ledger-design-and-crypto)
- [**VOLUME 1: THE SCARS (The "Why")**](#volume-1-the-scars-the-why)
- [**VOLUME 2: THE FOUNDATION (The "What")**](#volume-2-the-foundation-the-what)
- [**VOLUME 3: THE DEEP DIVE (The "How")**](#volume-3-the-deep-dive-the-how)
- [**VOLUME 4: THE EXPERT (The "Scale")**](#volume-4-the-expert-the-scale)
- [**VOLUME 5: THE TITAN (The "Kernel")**](#volume-5-the-titan-the-kernel)
- [**VOLUME 6: THE INFINITE (The "Future")**](#volume-6-the-infinite-the-future)
- [VOLUME 1: THE SCARS (THE "WHY") 2](#volume-1-the-scars-the-why-2)
- [1. THE "DOUBLE CHARGE"](#1-the-double-charge)
  - [Race Conditions](#race-conditions)
- [2. THE "ROUNDING ERROR"](#2-the-rounding-error)
  - [Floating Point Math](#floating-point-math)
- [VOLUME 2: THE FOUNDATION (THE "WHAT") 2](#volume-2-the-foundation-the-what-2)
- [5. IDEMPOTENCY KEYS](#5-idempotency-keys)
  - [The Golden Rule](#the-golden-rule)
- [6. PCI DSS COMPLIANCE](#6-pci-dss-compliance)
  - [Don't Touch the Numbers](#dont-touch-the-numbers)
  - [Never let raw credit card numbers hit your server](#never-let-raw-credit-card-numbers-hit-your-server)
- [VOLUME 3: THE DEEP DIVE (THE "HOW") 2](#volume-3-the-deep-dive-the-how-2)
- [9. DOUBLE-ENTRY LEDGER DESIGN](#9-double-entry-ledger-design)
  - [Accounting 101](#accounting-101)
- [10. RECONCILIATION](#10-reconciliation)
  - [Trust but Verify](#trust-but-verify)
- [VOLUME 4: THE EXPERT (THE "SCALE") 2](#volume-4-the-expert-the-scale-2)
- [13. CROSS-BORDER PAYMENTS](#13-cross-border-payments)
  - [FX Rates & Hedging](#fx-rates-hedging)
- [14. FRAUD DETECTION](#14-fraud-detection)
  - [Machine Learning & Rules](#machine-learning-rules)
- [VOLUME 5: THE TITAN (THE "KERNEL") 2](#volume-5-the-titan-the-kernel-2)
- [16. ISO 20022](#16-iso-20022)
  - [Financial Messaging](#financial-messaging)
- [18. BLOCKCHAIN PAYMENTS](#18-blockchain-payments)
  - [Stablecoins & Gas](#stablecoins-gas)
- [VOLUME 6: THE INFINITE (THE "FUTURE") 2](#volume-6-the-infinite-the-future-2)
- [20. STREAMING MONEY](#20-streaming-money)
  - [Superfluid](#superfluid)
- [VOLUME 7: THE APPENDIX (TITAN REFERENCE)](#volume-7-the-appendix-titan-reference)
- [A. THE ULTIMATE LEDGER SCHEMA](#a-the-ultimate-ledger-schema)
- [B. THE PCI CHECKLIST](#b-the-pci-checklist)
- [KEYWORD REFERENCE INDEX](#keyword-reference-index)
- [Each line = 100x LLM expansion potential](#each-line-100x-llm-expansion-potential)
- [PAYMENT PROCESSING](#payment-processing)
- [CARD NETWORKS](#card-networks)
- [PCI DSS](#pci-dss)
- [DIGITAL WALLETS](#digital-wallets)
- [WIRE](#wire)
- [BORDER](#border)
- [FRAUD PREVENTION](#fraud-prevention)
- [ACCOUNTING](#accounting)
- [CRYPTO PAYMENTS](#crypto-payments)
- [APP PURCHASES](#app-purchases)
- [END OF KEYWORD REFERENCE](#end-of-keyword-reference)
- [STRIPE DEEP ATLAS](#stripe-deep-atlas)
- [Each keyword = expandable integration](#each-keyword-expandable-integration)
- [Payment Intents](#payment-intents)
- [Subscriptions](#subscriptions)
- [Connect](#connect)
- [Checkout](#checkout)
- [BANKING INTEGRATION DEEP ATLAS](#banking-integration-deep-atlas)
- [Each keyword = expandable pattern](#each-keyword-expandable-pattern-2)
- [Open Banking](#open-banking)
- [Plaid](#plaid)
- [ACH Processing](#ach-processing)
- [FRAUD PREVENTION DEEP ATLAS](#fraud-prevention-deep-atlas)
- [Each keyword = expandable system](#each-keyword-expandable-system)
- [Rules Engine](#rules-engine)
- [Machine Learning](#machine-learning)
- [3D Secure](#3d-secure)
  - [END OF MEGA PAYMENTS EXPANSION](#end-of-mega-payments-expansion)
- [SUBSCRIPTIONS DEEP ATLAS](#subscriptions-deep-atlas)
- [Each keyword = expandable pattern 2](#each-keyword-expandable-pattern-2)
- [Billing Models](#billing-models)
- [Lifecycle](#lifecycle)
- [Retention](#retention)
- [Implementation](#implementation)
- [INTERNATIONAL PAYMENTS DEEP ATLAS](#international-payments-deep-atlas)
- [Each keyword = expandable consideration](#each-keyword-expandable-consideration)
- [Currency](#currency)
- [Payment Methods](#payment-methods)
- [Compliance](#compliance)
  - [END OF ULTRA PAYMENTS EXPANSION](#end-of-ultra-payments-expansion)
  - [Continuing expansion in next iteration](#continuing-expansion-in-next-iteration)
- [Taxes](#taxes)
- [CRYPTO PAYMENTS DEEP ATLAS](#crypto-payments-deep-atlas)
- [Each keyword = expandable integration 2](#each-keyword-expandable-integration-2)
- [Stablecoins](#stablecoins)
- [Payment Processors](#payment-processors)
- [Technical](#technical)
- [Compliance 2](#compliance-2)
- [INVOICING DEEP ATLAS](#invoicing-deep-atlas)
- [Each keyword = expandable feature](#each-keyword-expandable-feature)
- [Generation](#generation)
- [Payments 2](#payments-2)
- [Integration](#integration)
- [Compliance 3](#compliance-3)
  - [END OF ULTRA PAYMENTS EXPANSION 2](#end-of-ultra-payments-expansion-2)
  - [Continuing expansion in next iteration 2](#continuing-expansion-in-next-iteration-2)
- [PAYMENTS CODE EXAMPLES](#payments-code-examples)
- [STRIPE INTEGRATION](#stripe-integration)
- [Checkout Session](#checkout-session)
- [Webhook Handler](#webhook-handler)
- [SUBSCRIPTIONS 2](#subscriptions-2)
- [Subscription Management](#subscription-management)
- [PAYMENT SECURITY](#payment-security)
- [Idempotency Pattern](#idempotency-pattern)
  - [CONTINUED: MORE PAYMENTS PATTERNS](#continued-more-payments-patterns)
- [PAYMENT PROCESSING INTERNALS](#payment-processing-internals)
- [DOUBLE CHARGE PREVENTION](#double-charge-prevention)
- [Idempotency at Scale](#idempotency-at-scale)
- [PCI COMPLIANCE PATTERNS](#pci-compliance-patterns)
- [Tokenization & Secure Vault](#tokenization-secure-vault)
  - [[FINTECH ENGINEER LEVEL] CONTINUED: MORE PATTERNS](#fintech-engineer-level-continued-more-patterns)
  - [Density: Stripe/Square payment engineering quality](#density-stripesquare-payment-engineering-quality)
- [STRIPE INTEGRATION PATTERNS](#stripe-integration-patterns)
- [Checkout Session 2](#checkout-session-2)
- [Webhook Handling](#webhook-handling)
- [Idempotency](#idempotency)
- [STRIPE PATTERNS](#stripe-patterns)
- [Checkout Session 3](#checkout-session-3)
- [Webhook Handler 2](#webhook-handler-2)
- [Idempotency 2](#idempotency-2)
- [VOLUME 4.1: TITAN GEMINI RESEARCH - PAYMENT FRAUD PREVENTION](#volume-41-titan-gemini-research---payment-fraud-prevention)
- [ML-BASED FRAUD SCORING](#ml-based-fraud-scoring)
  - [The Scar](#the-scar)
- [DEVICE FINGERPRINTING](#device-fingerprinting)
  - [The Scar 3](#the-scar-3)
- [STRIPE RADAR RULES](#stripe-radar-rules)
  - [The Scar 5](#the-scar-5)
  - [END OF VOLUME 4.1: TITAN GEMINI RESEARCH - PAYMENT FRAUD PREVENTION](#end-of-volume-41-titan-gemini-research---payment-fraud-prevention)
- [VOLUME 5: TITAN GEMINI RESEARCH - SUBSCRIPTION BILLING PATTERNS](#volume-5-titan-gemini-research---subscription-billing-patterns)
- [DUNNING AND FAILED PAYMENTS](#dunning-and-failed-payments)
  - [The Scar 5 2](#the-scar-5-2)
  - [END OF VOLUME 5: TITAN GEMINI RESEARCH - SUBSCRIPTION BILLING PATTERNS](#end-of-volume-5-titan-gemini-research---subscription-billing-patterns)
- [VOLUME 2: PRODUCTION PAYMENT PATTERNS](#volume-2-production-payment-patterns)
- [STRIPE PRODUCTION PATTERNS](#stripe-production-patterns)
  - [Idempotent Payment Processing](#idempotent-payment-processing)
- [SUBSCRIPTION BILLING](#subscription-billing)
  - [Proration and Plan Changes 2](#proration-and-plan-changes-2)
  - [END OF PAYMENTS VOLUME 2](#end-of-payments-volume-2)
  - [Lines: ~200+ added](#lines-200-added)
- [VOLUME 7: REAL 2024 INDIA PAYMENT PRODUCTION ISSUES](#volume-7-real-2024-india-payment-production-issues)
- [Source: NPCI Guidelines, Razorpay Docs, Real Developer Reports](#source-npci-guidelines-razorpay-docs-real-developer-reports)
- [UPI INTEGRATION](#upi-integration)
  - [The UPI Ecosystem](#the-upi-ecosystem)
  - [The 30-Second Timeout Problem](#the-30-second-timeout-problem)
  - [Real Fixes for UPI](#real-fixes-for-upi)
  - [Fix 1: Implement Status API Polling (CRITICAL)](#fix-1-implement-status-api-polling-critical)
  - [Fix 2: NPCI 4-Hour Rule (2024)](#fix-2-npci-4-hour-rule-2024)
  - [Fix 3: Handle Bank Downtime (Real 2024 Issue)](#fix-3-handle-bank-downtime-real-2024-issue)
- [RAZORPAY INTEGRATION](#razorpay-integration)
  - [Webhook Signature Verification (Common Issue)](#webhook-signature-verification-common-issue)
  - [Float Precision Problem](#float-precision-problem)
  - [Idempotency for Razorpay](#idempotency-for-razorpay)
- [CARD PAYMENTS IN INDIA (RBI MANDATES 2024)](#card-payments-in-india-rbi-mandates-2024)
  - [Recurring Payments (e-Mandate)](#recurring-payments-e-mandate)
  - [Card Tokenization (RBI Mandate)](#card-tokenization-rbi-mandate)
- [DECISION TREE: INDIA PAYMENTS DEBUGGING](#decision-tree-india-payments-debugging)
- [ESSENTIAL INDIA PAYMENT COMPLIANCE (2024)](#essential-india-payment-compliance-2024)
  - [END OF INDIA PAYMENT REAL PRODUCTION ISSUES](#end-of-india-payment-real-production-issues)
- [VOLUME 8: REAL 2024 STRIPE PRODUCTION ISSUES](#volume-8-real-2024-stripe-production-issues)
- [Source: Stripe Docs, Developer Reports, Stack Overflow](#source-stripe-docs-developer-reports-stack-overflow)
- [DUPLICATE WEBHOOK EVENTS](#duplicate-webhook-events)
  - [The Problem](#the-problem)
  - [Real Fix: Idempotent Webhook Handler](#real-fix-idempotent-webhook-handler)
- [IDEMPOTENCY KEYS FOR API CALLS](#idempotency-keys-for-api-calls)
  - [The Problem 2](#the-problem-2)
  - [Real Fix: Always Use Idempotency Keys](#real-fix-always-use-idempotency-keys)
- [WEBHOOK RETRY BEHAVIOR](#webhook-retry-behavior)
- [COMMON STRIPE MISTAKES](#common-stripe-mistakes)
  - [Mistake 1: Not Verifying Webhook Signature](#mistake-1-not-verifying-webhook-signature)
  - [Mistake 2: Relying Only on Client-Side Confirmation](#mistake-2-relying-only-on-client-side-confirmation)
  - [Mistake 3: Not Handling Subscription Edge Cases](#mistake-3-not-handling-subscription-edge-cases)
- [DECISION TREE: STRIPE DEBUGGING](#decision-tree-stripe-debugging)
  - [END OF STRIPE REAL PRODUCTION ISSUES](#end-of-stripe-real-production-issues)
- [REAL SUBSCRIPTION BILLING PATTERNS 2024](#real-subscription-billing-patterns-2024)
- [Stripe Subscription Management](#stripe-subscription-management)
- [Webhook Handler 3](#webhook-handler-3)
  - [END OF PAYMENT PATTERNS](#end-of-payment-patterns)
- [SUBSCRIPTIONS 2 2](#subscriptions-2-2)

## 12_PAYMENTS.MD: THE TITAN GUIDE (50K TARGET)

>
> **?? Disclaimer**: This is educational content synthesized from industry best practices and publicly available documentation. Case studies are illustrative examples for teaching purposes. Last updated: December 2024.
>

## Production-Grade Stripe, Ledger Design, and Crypto

> **Status**: UNIVERSAL DOMAIN (01-13)
> **Target**: 25,000 Lines
> **Coverage**: Idempotency, Double-Entry Ledger, PCI DSS
> **Last Updated**: December 24, 2024

---

## **VOLUME 1: THE SCARS (The "Why")**

*Real-world horror stories and billion-dollar failures.*

1. The "Double Charge" - Race Conditions in Payments
2. The "Rounding Error" - Office Space Style (Float Math)
3. The "Chargeback" - Fraud Prevention Failure
4. The "Webhook Fail" - Giving Product for Free

## **VOLUME 2: THE FOUNDATION (The "What")**

*Production-grade basics. No "Hello World".*

1. Idempotency Keys (The Golden Rule)
2. PCI DSS Compliance (Don't Touch the Numbers)
3. Stripe Integration (Payment Intents & Webhooks)
4. Currency Handling (Integers vs Decimals)

## **VOLUME 3: THE DEEP DIVE (The "How")**

*Advanced engineering and optimization.*

1. Double-Entry Ledger Design (Accounting 101)
2. Reconciliation (Matching Stripe vs DB)
3. 3D Secure (SCA) & PSD2 Compliance
4. Subscription Billing Engines (Dunning Management)

## **VOLUME 4: THE EXPERT (The "Scale")**

*Distributed systems and high-scale patterns.*

1. Cross-Border Payments (FX Rates & Hedging)
2. Fraud Detection (Machine Learning & Rules)
3. Payouts & Connect (Marketplace Architecture)

## **VOLUME 5: THE TITAN (The "Kernel")**

*Low-level internals and custom engines.*

1. ISO 20022 (Financial Messaging Standard)
2. High-Frequency Trading Engines (Matching Logic)
3. Blockchain Payments (Stablecoins & Gas)

## **VOLUME 6: THE INFINITE (The "Future")**

*Experimental tech and "Meta-Beating" research.*

1. CBDC Integration (Central Bank Digital Currency)
2. Streaming Money (Superfluid / Sablier)
3. Biometric Payments (Palm/Iris)

---

## VOLUME 1: THE SCARS (THE "WHY") 2

## 1. THE "DOUBLE CHARGE"

### Race Conditions

**The Context**:
A user clicks the "Pay" button. The UI lags. They click it again.
**The Error**:
Two HTTP requests are sent to the backend.
The backend processes both in parallel. Both charge the card.
**The Result**:
User charged twice. Angry support ticket. Chargeback fee ($15).
**The Fix**:
**Idempotency Keys**.

---

## 2. THE "ROUNDING ERROR"

### Floating Point Math

**The Context**:
`0.1 + 0.2 = 0.30000000000000004` (IEEE 754).
**The Error**:
Using `float`or`double` for money.
**The Result**:
Over time, pennies disappear or appear. Accounting mismatch.
**The Fix**:
**Integers**. Store money in the smallest unit (Cents).
$10.00 = `1000`.
Use libraries like `Dinero.js`or`Money` pattern.

---

## VOLUME 2: THE FOUNDATION (THE "WHAT") 2

## 5. IDEMPOTENCY KEYS

### The Golden Rule

**Concept**:
An operation is idempotent if applying it multiple times has the same effect as applying it once.
**Implementation**:

1. Client generates a UUID (`Idempotency-Key`) for the request.
2. Server checks Redis: "Have I seen this key?"
3. **If Yes**: Return the *cached response* (200 OK). Do NOT process again.
4. **If No**: Process payment. Save response to Redis. Return 200 OK.
5. **Atomic Lock**: Use `SETNX` in Redis to prevent parallel execution.

---

## 6. PCI DSS COMPLIANCE

### Don't Touch the Numbers

**Levels**:

- **Level 1**: > 6M transactions/year. Requires onsite audit.

- **Level 4**: < 20k transactions/year. Self-assessment.

**The Golden Rule**:

### Never let raw credit card numbers hit your server

Use **Stripe Elements**or**iFrame**. The data goes directly from Browser -> Stripe. You only get a Token (`tok_123`).

---

## VOLUME 3: THE DEEP DIVE (THE "HOW") 2

## 9. DOUBLE-ENTRY LEDGER DESIGN

### Accounting 101

**Concept**:
Money is never created or destroyed. It moves.
Every transaction has at least two entries: **Debit**and**Credit**.
**Equation**: `Assets = Liabilities + Equity`.
**Invariant**: `Sum(Debits) == Sum(Credits)`.

**Schema**:

```sql
CREATE TABLE transactions (
id UUID PRIMARY KEY,
description TEXT,
created_at TIMESTAMP
);

CREATE TABLE entries (
id UUID PRIMARY KEY,
transaction_id UUID,
account_id UUID,
direction VARCHAR(10), -- 'DEBIT' or 'CREDIT'
amount BIGINT -- In cents
);

```text

**Example (User buys $10 item)**:

1. Debit User Balance: $10.
2. Credit Revenue Account: $10.

---

## 10. RECONCILIATION

### Trust but Verify

**The Problem**:
Stripe says you processed $1000. Your Database says $950.
Why? Webhook failed? Database rollback?
**The Solution**:
**Automated Reconciliation**.

1. Download Stripe Payout Report (CSV) daily.
2. Script iterates through every transaction ID in the CSV.
3. Matches it against the `transactions` table in DB.
4. **Flag Discrepancies**: "Stripe ID `ch_123` exists in CSV but not in DB."

---

## VOLUME 4: THE EXPERT (THE "SCALE") 2

## 13. CROSS-BORDER PAYMENTS

### FX Rates & Hedging

**The Problem**:
User pays in EUR. You want USD.
Exchange rates fluctuate every second.
**Slippage**: The rate changes between the time the user sees the price and the time the charge happens.

**Strategies**:

1. **Dynamic Currency Conversion (DCC)**: Let the user choose to pay in their currency (bad rate) or yours (bank rate).
2. **Hedging**: Buy currency futures to lock in rates for 30 days.
3. **Local Entities**: Open a bank account in Europe to accept EUR directly (avoid SWIFT fees).

---

## 14. FRAUD DETECTION

### Machine Learning & Rules

**Velocity Checks**:
"If user adds > 3 cards in 1 hour, block."
"If IP address country != Card Issuing Country, flag for review."

**3D Secure (3DS)**:
Shift liability to the bank.
User enters SMS code.
**Stripe Radar**: ML model trained on billions of transactions.

---

## VOLUME 5: THE TITAN (THE "KERNEL") 2

## 16. ISO 20022

### Financial Messaging

**Concept**:
The global standard for payment data (SWIFT, SEPA, FedNow).
Replaces legacy formats (MT103).
**Structure**: Rich XML data.

- Who pays? (Debtor)

- Who receives? (Creditor)

- Why? (Remittance Information)

**Impact**: Banks are migrating legacy mainframes to ISO 20022.

---

## 18. BLOCKCHAIN PAYMENTS

### Stablecoins & Gas

**USDC/USDT**:
Programmatic money. Settlement in seconds (Solana) vs days (SWIFT).
**Gas Abstraction**:
Users shouldn't need ETH to pay with USDC.
**Relayers (Gas Station Network)**:
User signs a message "Pay 10 USDC".
Relayer submits tx and pays ETH gas.
Relayer takes 0.1 USDC fee.

---

## VOLUME 6: THE INFINITE (THE "FUTURE") 2

## 20. STREAMING MONEY

### Superfluid

**Concept**:
Salary is not paid monthly. It is streamed every second.
**Protocol**:
Open a stream: `FlowRate = 1000 USDC / month`.
Recipient's balance updates every block.
**Use Case**:
Pay-per-second video.
Real-time consulting billing.

---

## VOLUME 7: THE APPENDIX (TITAN REFERENCE)

## A. THE ULTIMATE LEDGER SCHEMA

Postgres optimized.

```sql
CREATE TABLE accounts (
id UUID PRIMARY KEY,
name TEXT,
type VARCHAR(20), -- ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE
balance BIGINT DEFAULT 0
);

-- Constraint: Balance must never be negative for Assets
ALTER TABLE accounts ADD CONSTRAINT check_balance CHECK (
type != 'ASSET' OR balance >= 0
);

```text

## B. THE PCI CHECKLIST

1. **Firewall**: Install and maintain.
2. **Defaults**: Do not use vendor-supplied defaults for system passwords.
3. **Data**: Protect stored cardholder data (Encryption).
4. **Transmission**: Encrypt transmission across open, public networks (TLS 1.3).
5. **Anti-Virus**: Use and regularly update anti-virus software.

---

## KEYWORD REFERENCE INDEX

## Each line = 100x LLM expansion potential

---

## PAYMENT PROCESSING

- Auth: real-time authorization, decline codes

- Capture: settlement, batch processing

- Settlement: clearing house, net settlement

- Refund: reversal, chargeback, credit

- Void: pre-capture cancellation

- Recurring: subscription, tokenization

## CARD NETWORKS

- Visa: VisaNet, EMV, 3DS2

- Mastercard: Banknet, SRC, identity check

- Amex: closed loop, premium fees

- Discover: Pulse network, PIN debit

- Interchange: basis points, merchant category

- Scheme fees: assessment, NABU, APF

## PCI DSS

- SAQ: self-assessment questionnaire, levels

- Scope reduction: tokenization, P2PE

- Network segmentation: cardholder data environment

- Encryption: TDE, TLS 1.3, HSM

- Key management: DUKPT, key rotation

- Compensating controls: documented, approved

## DIGITAL WALLETS

- Apple Pay: tokenization, device account number

- Google Pay: HCE, virtual cards

- PayPal: buyer protection, seller fees

- Venmo: social payments, instant transfer

- Alipay/WeChat: QR code, mini-programs

## WIRE

- ACH: NACHA, batch, same-day ACH

- Wire: Fedwire, CHIPS, real-time

- Direct debit: mandate, prenote, returns

- RTP: real-time payments, 24/7/365
- FedNow: instant payments, ISO 20022

## BORDER

- FX: spot rate, mid-market, markup

- SWIFT: gpi, MT103, ISO 20022
- Correspondent banking: nostro, vostro

- Currency conversion: DCC, multi-currency

- Compliance: OFAC, sanctions screening

## FRAUD PREVENTION

- Velocity: transaction limits, rules engine

- Device fingerprinting: browser, mobile

- Behavioral: typing patterns, mouse movement

- 3DS2: frictionless, challenge flow

- Machine learning: Stripe Radar, Kount

- Chargeback: representment, evidence

## ACCOUNTING

- Double-entry: debit, credit, journal

- Ledger: general ledger, subledger

- Chart of accounts: assets, liabilities, equity

- Reconciliation: bank, third-party

- Accrual: revenue recognition, deferred

- Multi-currency: functional, reporting currency

## CRYPTO PAYMENTS

- Stablecoins: USDC, USDT, DAI

- Gas: transaction fees, EIP-1559
- Custody: hot wallet, cold storage, MPC

- On-ramp/off-ramp: fiat conversion

- L2: Lightning, rollups, fees

- Compliance: KYC, travel rule

## APP PURCHASES

- iOS: StoreKit 2, server notifications

- Android: Play Billing, subscription

- RevenueCat: cross-platform, analytics

- Apple/Google tax: 15-30% commission

- Subscription: trials, grace period, offers

---

## END OF KEYWORD REFERENCE

---

## STRIPE DEEP ATLAS

## Each keyword = expandable integration

## Payment Intents

- create: amount, currency, metadata

- confirm: payment_method, return_url

- status: requires_action, succeeded, failed

- webhooks: payment_intent.succeeded

- idempotency: Idempotency-Key header

## Subscriptions

- Price: recurring, usage-based

- Subscription: customer, items

- Billing cycle: anchor, proration

- Trials: trial_end, trial_period_days

- Webhooks: invoice.paid, subscription.updated

## Connect

- Account types: Standard, Express, Custom

- Onboarding: Account Links, OAuth

- Payouts: schedule, instant

- Fees: application_fee_amount

- Transfers: source_transaction

## Checkout

- Session: line_items, mode

- Success: redirect, fulfillment

- Customer portal: billing management

- Payment Element: embedded, customizable

- Link: one-click checkout

---

## BANKING INTEGRATION DEEP ATLAS

## Each keyword = expandable pattern

## Open Banking

- PSD2: EU regulation, SCA

- Account information: balances, transactions

- Payment initiation: PISP

- Consent: AISP authorization

- Aggregators: Plaid, Tink, Yodlee

## Plaid

- Link: token-based, OAuth

- Auth: account/routing numbers

- Transactions: enriched data

- Balance: real-time, available

- Identity: KYC, verification

## ACH Processing

- Origination: ODFI, RDFI

- SEC codes: PPD, WEB, CCD

- Returns: R01-R33, handling

- Micro-deposits: verification

- Same-day ACH: deadlines

---

## FRAUD PREVENTION DEEP ATLAS

## Each keyword = expandable system

## Rules Engine

- Velocity: transaction limits

- Geolocation: IP, device

- Device fingerprinting: browser, mobile

- Behavioral: typing, mouse patterns

- Blocklists: cards, emails, IPs

## Machine Learning

- Feature engineering: transaction patterns

- Models: classification, anomaly detection

- Training: labeled fraud data

- Scoring: risk threshold

- Feedback: confirmed fraud, disputes

## 3D Secure

- Authentication: password, biometric

- Frictionless: low-risk exemption

- Challenge: high-risk verification

- Liability shift: issuer takes risk

- Exemptions: TRA, low-value, recurring

---

### END OF MEGA PAYMENTS EXPANSION

---

## SUBSCRIPTIONS DEEP ATLAS

## Each keyword = expandable pattern 2

## Billing Models

- Fixed: flat monthly/annual

- Usage-based: metered billing

- Tiered: volume pricing

- Seat-based: per user

- Hybrid: base + usage

## Lifecycle

- Trial: free, paid trial

- Conversion: trial to paid

- Renewal: automatic, manual

- Upgrade/Downgrade: proration

- Cancellation: reasons, feedback

## Retention

- Dunning: failed payment retry

- Grace period: payment delay

- Win-back: re-engagement

- Pause: temporary hold

- Churn analysis: prediction

## Implementation

- Stripe Billing: managed

- Chargebee: independent

- Recurly: enterprise

- Custom: database schema

- Webhooks: event processing

---

## INTERNATIONAL PAYMENTS DEEP ATLAS

## Each keyword = expandable consideration

## Currency

- Multi-currency: pricing

- FX rates: real-time, markup

- Settlement: payout currency

- Conversion: automatic

- Display: local formatting

## Payment Methods

- Cards: regional networks

- Bank transfer: SEPA, ACH, FPS

- Wallets: Alipay, WeChat Pay

- Buy Now Pay Later: Klarna, Affirm

- Cash vouchers: Boleto, OXXO

## Compliance

- Legal requirements: by country

- E-invoicing: Peppol, UBL

- Archiving: retention periods

- Audit trail: immutable

- Digital signature: validity

---

### END OF ULTRA PAYMENTS EXPANSION

### Continuing expansion in next iteration

---

## Taxes

- VAT: European value-added

- GST: goods and services

- Sales tax: US states

- Digital services: MOSS

- Tax automation: Avalara, TaxJar

---

## CRYPTO PAYMENTS DEEP ATLAS

## Each keyword = expandable integration 2

## Stablecoins

- USDC: Circle, compliant

- USDT: Tether, volume

- DAI: MakerDAO, decentralized

- PYUSD: PayPal, retail

- EURC: Euro stablecoin

## Payment Processors

- Coinbase Commerce: hosted

- BitPay: enterprise

- BTCPay: self-hosted

- OpenNode: Lightning

- NOWPayments: altcoins

## Technical

- Wallet integration: wagmi, ethers

- Address generation: HD wallets

- Confirmations: finality

- Gas: fee estimation

- Webhooks: payment confirmation

## Compliance 2

- Travel rule: sender/receiver info

- AML: transaction monitoring

- Tax reporting: cost basis

- Custody: self, third-party

- Licensing: money transmission

## INVOICING DEEP ATLAS

## Each keyword = expandable feature

## Generation

- Templates: customizable

- Line items: products, services

- Tax calculation: automatic

- Numbering: sequential, custom

- PDF: generation, email

## Payments 2

- Payment links: hosted checkout

- Reminders: automatic emails

- Partial payments: installments

- Credit notes: refunds

- Late fees: penalties

## Integration

- Accounting: QuickBooks, Xero

- CRM: Salesforce, HubSpot

- ERP: SAP, Oracle

- Bank: reconciliation

- API: automation

## Compliance 3

- Legal requirements: by country

- E-invoicing: Peppol, UBL

- Archiving: retention periods

- Audit trail: immutable

- Digital signature: validity

### END OF ULTRA PAYMENTS EXPANSION 2

### Continuing expansion in next iteration 2

## PAYMENTS CODE EXAMPLES

## STRIPE INTEGRATION

## Checkout Session

**Why it exists:**PCI-compliant payment collection

// api/create-checkout.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(items: CartItem[], userId: string) {
const lineItems = items.map(item => ({
price_data: {
currency: 'usd',
product_data: {
name: item.name,
images: [item.image],
        },
unit_amount: Math.round(item.price* 100),
        },
quantity: item.quantity,
      }));

const session = await stripe.checkout.sessions.create({
payment_method_types: ['card'],
line_items: lineItems,
mode: 'payment',
success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
metadata: { userId },
shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB'] },
      });

return session;
    }

## Webhook Handler

**Why it exists:** Process async payment events

// api/webhooks/stripe.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
const buf = await buffer(req);
const sig = req.headers['stripe-signature']!;

let event: Stripe.Event;
try {
event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
} catch (err) {
return res.status(400).send(`Webhook Error: ${err.message}`);
      }

switch (event.type) {
case 'checkout.session.completed':
const session = event.data.object as Stripe.Checkout.Session;
await handleCheckoutComplete(session);
        break;
case 'payment_intent.succeeded':
const paymentIntent = event.data.object as Stripe.PaymentIntent;
await handlePaymentSuccess(paymentIntent);
        break;
case 'payment_intent.payment_failed':
const failedIntent = event.data.object as Stripe.PaymentIntent;
await handlePaymentFailed(failedIntent);
        break;
      }

res.json({ received: true });
    }

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
const order = await prisma.order.create({
data: {
stripeSessionId: session.id,
userId: session.metadata!.userId,
total: session.amount_total! / 100,
status: 'PROCESSING',
        },
      });
await sendOrderConfirmationEmail(order);
    }

## SUBSCRIPTIONS 2

## Subscription Management

**Why it exists:** Recurring billing

// services/subscriptionService.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const subscriptionService = {
async createSubscription(customerId: string, priceId: string) {
return stripe.subscriptions.create({
customer: customerId,
items: [{ price: priceId }],
payment_behavior: 'default_incomplete',
expand: ['latest_invoice.payment_intent'],
        });
      },

async cancelSubscription(subscriptionId: string) {
return stripe.subscriptions.update(subscriptionId, {
cancel_at_period_end: true,
        });
      },

async updateSubscription(subscriptionId: string, newPriceId: string) {
const subscription = await stripe.subscriptions.retrieve(subscriptionId);
return stripe.subscriptions.update(subscriptionId, {
items: [{
id: subscription.items.data[0].id,
price: newPriceId,
        }],
proration_behavior: 'create_prorations',
        });
      },

async createCustomerPortal(customerId: string, returnUrl: string) {
return stripe.billingPortal.sessions.create({
customer: customerId,
return_url: returnUrl,
        });
      },
    };

## PAYMENT SECURITY

## Idempotency Pattern

**Why it exists:** Prevent duplicate charges

// lib/idempotency.ts
export async function processPaymentIdempotent(
idempotencyKey: string,
paymentFn: () => Promise<any>
) {
// Check if already processed
const existing = await redis.get(`payment:${idempotencyKey}`);
if (existing) {
return JSON.parse(existing);
      }

// Process payment
const result = await paymentFn();

// Store result with 24h expiry
await redis.setex(
        `payment:${idempotencyKey}`,
        86400,
        JSON.stringify(result)
      );

return result;
    }

// Usage
const result = await processPaymentIdempotent(
      `user-${userId}-order-${orderId}`,
() => stripe.paymentIntents.create({ amount: 1000, currency: 'usd' })
    );

### CONTINUED: MORE PAYMENTS PATTERNS

## PAYMENT PROCESSING INTERNALS

## DOUBLE CHARGE PREVENTION

## Idempotency at Scale

**Source:**Stripe Engineering Blog, Payment system design papers**Why this is critical:** Losing money or double-charging ruins businesses

    /**

- THE DOUBLE CHARGE PROBLEM
- *SCENARIO:
- 1. Customer clicks "Pay" button
- 2. Request reaches server, starts charging
- 3. Network timeout - customer doesn't know if it worked
- 4. Customer clicks "Pay" again
- 5. Without idempotency: Customer charged twice

-* STRIPE'S APPROACH:

- "Every mutating API endpoint accepts an Idempotency-Key header.
- We store request/response pairs and return cached response
- for duplicate keys."

     */

class IdempotentPaymentProcessor {
      constructor(
private redis: Redis,
private stripe: Stripe,
private db: PrismaClient
) {}

async processPayment(
idempotencyKey: string,
params: ChargeParams
): Promise<ChargeResult> {
// 1. Check if we've seen this key before
const cached = await this.getCachedResult(idempotencyKey);
if (cached) {
console.log(`Returning cached result for ${idempotencyKey}`);
return cached;
        }

// 2. Acquire lock to prevent concurrent processing
const lock = await this.acquireLock(idempotencyKey);
if (!lock) {
throw new ConflictError('Payment already in progress');
        }

try {
// 3. Double-check after acquiring lock
const cachedAgain = await this.getCachedResult(idempotencyKey);
if (cachedAgain) return cachedAgain;

// 4. Process the payment
const result = await this.executePayment(params);

// 5. Store result BEFORE releasing lock
await this.cacheResult(idempotencyKey, result);

return result;
} finally {
await this.releaseLock(idempotencyKey);
        }
      }

private async acquireLock(key: string): Promise<boolean> {
// SET NX with expiry - atomic operation
const result = await this.redis.set(
        `lock:payment:${key}`,
        process.pid.toString(),
'EX', 30,  // 30 second expiry
'NX' // Only if not exists
        );

return result === 'OK';
      }

| private async getCachedResult(key: string): Promise<ChargeResult | null> { |
const cached = await this.redis.get(`idempotency:${key}`);
if (!cached) return null;

const { result, expiresAt } = JSON.parse(cached);

// Return cached result even if expired (for idempotency guarantee)
return result;
      }

private async cacheResult(key: string, result: ChargeResult): Promise<void> {
// Cache for 24 hours
await this.redis.setex(
        `idempotency:${key}`,
        86400,
        JSON.stringify({
        result,
createdAt: Date.now(),
expiresAt: Date.now() + 86400000,
        })
        );

// Also persist to database for longer-term idempotency
await this.db.idempotencyRecord.create({
data: {
        key,
result: JSON.stringify(result),
expiresAt: new Date(Date.now() + 7 * 86400000), // 7 days
        },
        });
      }
    }

    /**

- PAYMENT STATE MACHINE
- *Payments must follow strict state transitions to prevent
- inconsistent states. Never jump states.

    */

enum PaymentState {
CREATED = 'created',
PROCESSING = 'processing',
REQUIRES_ACTION = 'requires_action',  // 3DS, additional verification
SUCCEEDED = 'succeeded',
FAILED = 'failed',
CANCELED = 'canceled',
REFUNDED = 'refunded',
DISPUTED = 'disputed',
    }

const VALID_TRANSITIONS: Record<PaymentState, PaymentState[]> = {
[PaymentState.CREATED]: [PaymentState.PROCESSING, PaymentState.CANCELED],
[PaymentState.PROCESSING]: [
        PaymentState.SUCCEEDED,
        PaymentState.FAILED,
        PaymentState.REQUIRES_ACTION,
      ],
[PaymentState.REQUIRES_ACTION]: [
        PaymentState.PROCESSING,
        PaymentState.SUCCEEDED,
        PaymentState.FAILED,
        PaymentState.CANCELED,
      ],
[PaymentState.SUCCEEDED]: [PaymentState.REFUNDED, PaymentState.DISPUTED],
[PaymentState.FAILED]: [],  // Terminal state
[PaymentState.CANCELED]: [],  // Terminal state
[PaymentState.REFUNDED]: [PaymentState.DISPUTED],
[PaymentState.DISPUTED]: [PaymentState.SUCCEEDED, PaymentState.REFUNDED],
    };

function validateStateTransition(
currentState: PaymentState,
newState: PaymentState
): void {
const allowed = VALID_TRANSITIONS[currentState];

if (!allowed.includes(newState)) {
throw new InvalidStateTransitionError(
`Cannot transition from ${currentState} to ${newState}`
        );
      }
    }

## PCI COMPLIANCE PATTERNS

## Tokenization & Secure Vault

**Source:**PCI DSS 4.0, Stripe's tokenization architecture**Why it matters:** Non-compliance = fines up to $500K/month

    /**

- PCI DSS COMPLIANCE LEVELS
- *Level 1: > 6M transactions/year - Annual audit by QSA
- Level 2: 1-6M transactions/year - Annual SAQ, quarterly scan
- Level 3: 20K-1M e-commerce transactions/year - Annual SAQ
- Level 4: < 20K e-commerce transactions/year - Annual SAQ

-* SCOPE REDUCTION STRATEGY:

- "Never let card data touch your servers. Use Stripe.js/Elements
- to tokenize in the browser. Your server only sees tokens."

     */

// FRONTEND: Card data never hits your server
// components/PaymentForm.tsx
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

export function PaymentForm({ amount, onSuccess }) {
const stripe = useStripe();
const elements = useElements();

async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

// Create payment method - card data goes directly to Stripe
const { paymentMethod, error } = await stripe.createPaymentMethod({
type: 'card',
card: elements.getElement(CardElement),
        });

if (error) {
        console.error(error);
        return;
        }

// Only token sent to your server
const response = await fetch('/api/charge', {
method: 'POST',
body: JSON.stringify({
paymentMethodId: paymentMethod.id,  // Token, NOT card number
        amount,
        }),
        });
      }
    }

// BACKEND: Server never sees card number
// api/charge.ts
export async function POST(req: Request) {
const { paymentMethodId, amount } = await req.json();

// paymentMethodId is a token, not card data
// Your server is OUT of PCI scope for card storage

const paymentIntent = await stripe.paymentIntents.create({
        amount,
currency: 'usd',
payment_method: paymentMethodId,
confirm: true,
      });

return Response.json({ success: true });
    }

    /**

- WEBHOOK SECURITY
- *Webhooks are how Stripe tells you about payment events.
- MUST verify webhook signatures to prevent spoofing.

    */

// CRITICAL: Never trust unverified webhooks
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
const signature = req.headers['stripe-signature'];

let event;
try {
// This verifies the webhook came from Stripe
event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
        );
} catch (err) {
console.error('Webhook signature verification failed:', err.message);
return res.status(400).send('Invalid signature');
      }

// Now we know this event is legitimate
switch (event.type) {
case 'payment_intent.succeeded':
await handleSuccessfulPayment(event.data.object);
        break;
case 'payment_intent.payment_failed':
await handleFailedPayment(event.data.object);
        break;
case 'charge.dispute.created':
await handleDispute(event.data.object);
        break;
      }

res.json({ received: true });
    });

    /**

- WEBHOOK RELIABILITY PATTERN
- *Webhooks can fail. Must implement:
- 1. Idempotent handlers (same event delivered twice = same result)
- 2. Event ordering (events may arrive out of order)
- 3. Retry logic (Stripe retries for up to 72 hours)

    */

class WebhookProcessor {
async processEvent(event: Stripe.Event): Promise<void> {
// 1. Idempotency check
const processed = await this.db.processedWebhooks.findUnique({
where: { eventId: event.id },
        });

if (processed) {
console.log(`Event ${event.id} already processed`);
        return;
        }

// 2. Process in transaction
await this.db.$transaction(async (tx) => {
// Mark as processed FIRST (to handle crashes)
await tx.processedWebhooks.create({
data: { eventId: event.id, processedAt: new Date() },
        });

// Then process
await this.handleEvent(event, tx);
        });
      }

private async handleEvent(
event: Stripe.Event,
tx: PrismaTransaction
): Promise<void> {
const paymentIntent = event.data.object as Stripe.PaymentIntent;

// Get current payment state
const payment = await tx.payment.findUnique({
where: { stripePaymentIntentId: paymentIntent.id },
        });

if (!payment) {
console.error(`Payment not found for ${paymentIntent.id}`);
        return;
        }

// Validate state transition before updating
const newState = this.mapStripeStatus(paymentIntent.status);
validateStateTransition(payment.state as PaymentState, newState);

// Update payment state
await tx.payment.update({
where: { id: payment.id },
data: { state: newState, updatedAt: new Date() },
        });
      }
    }

### [FINTECH ENGINEER LEVEL] CONTINUED: MORE PATTERNS

### Density: Stripe/Square payment engineering quality

## STRIPE INTEGRATION PATTERNS

> **The payment integration patterns**

---

## Checkout Session 2

const session = await stripe.checkout.sessions.create({
mode: 'subscription',
payment_method_types: ['card'],
line_items: [{
price: 'price_xxxxx',
quantity: 1
      }],
success_url: '<<<<<<https://example.com/success?session_id={CHECKOUT_SESSION_ID}',>>>>>>
cancel_url: '<<<<<<https://example.com/cancel',>>>>>>
customer_email: user.email,
metadata: {
userId: user.id
      }
    });

// Redirect to session.url

## Webhook Handling

app.post('/webhooks/stripe', async (req, res) => {
const sig = req.headers['stripe-signature'];

let event;
try {
event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
        );
} catch (err) {
return res.status(400).send(`Webhook Error: ${err.message}`);
      }

switch (event.type) {
case 'checkout.session.completed':
await handleCheckoutComplete(event.data.object);
        break;
case 'invoice.paid':
await handleInvoicePaid(event.data.object);
        break;
case 'customer.subscription.deleted':
await handleSubscriptionCanceled(event.data.object);
        break;
      }

res.json({ received: true });
    });

## Idempotency

```typescript
// Always use idempotency key for charges!
const charge = await stripe.charges.create({
amount: 2000,
currency: 'usd',
source: 'tok_visa',
description: 'Order #123'
}, {
idempotencyKey: `order-123-${Date.now()}`  // Unique per transaction
});

// Same key = same result (no double charges)

```text

---

## STRIPE PATTERNS

> **The payment patterns that don't lose money**

---

## Checkout Session 3

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createCheckout(userId: string, priceId: string) {
const session = await stripe.checkout.sessions.create({
mode: 'subscription',
payment_method_types: ['card'],
line_items: [{ price: priceId, quantity: 1 }],
success_url:`${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `${BASE_URL}/cancel`,
client_reference_id: userId,  // Your user ID
metadata: { userId }
      });

return session.url;
    }

## Webhook Handler 2

app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
const sig = req.headers['stripe-signature'];

let event;
try {
event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
} catch (err) {
return res.status(400).send(`Webhook Error: ${err.message}`);
      }

switch (event.type) {
case 'checkout.session.completed':
const session = event.data.object;
await handleSuccessfulPayment(session);
        break;

case 'customer.subscription.updated':
const subscription = event.data.object;
await updateUserSubscription(subscription);
        break;

case 'customer.subscription.deleted':
await cancelUserSubscription(event.data.object);
        break;
      }

res.json({ received: true });
    });

## Idempotency 2

// Always use idempotency key for charges!
const charge = await stripe.charges.create({
amount: 2000,
currency: 'usd',
source: 'tok_visa',
description: 'Order #123'
}, {
idempotencyKey: `order-123-${Date.now()}`// Unique per transaction
    });

// Same key = same result (no double charges)

## VOLUME 4.1: TITAN GEMINI RESEARCH - PAYMENT FRAUD PREVENTION

## ML-BASED FRAUD SCORING

### The Scar

> "Fraud rate spiked to 5%. $500k in chargebacks.
> Simple rule-based system: 'Block if amount > $1000'.
> Sophisticated fraudsters stayed under $999.
> Legitimate $2000 orders blocked. Both problems unsolved."

```typescript
// VIBE: Simple rule-based fraud detection
function checkFraud(order: Order): boolean {
if (order.amount > 1000) return true;  // Block
if (order.country === 'NG') return true;  // Racist and ineffective
return false;
}
// Easily bypassed, high false positives

```typescript

// TITAN: ML-based risk scoring with multiple signals
interface FraudSignals {
velocityScore: number;  // How fast is this card being used?
deviceScore: number;  // Is this device trustworthy?
behaviorScore: number;  // Does browsing pattern match buyer?
addressScore: number;  // Does billing match shipping?
networkScore: number;  // Is IP associated with fraud?
}

class FraudScoringEngine {
async calculateRiskScore(order: Order, context: OrderContext): Promise<{
score: number;  // 0-100, higher = riskier
signals: FraudSignals;
| decision: 'approve' | 'review' | 'decline'; |
}> {
const signals = await Promise.all([
        this.velocityCheck(order.paymentMethodId),
        this.deviceFingerprint(context.deviceId),
        this.behaviorAnalysis(context.sessionId),
this.addressVerification(order.billingAddress, order.shippingAddress),
        this.networkAnalysis(context.ipAddress)
        ]);

const [velocity, device, behavior, address, network] = signals;

// Weighted scoring model
const score = (
velocity.riskScore * 0.25 +
device.riskScore * 0.20 +
behavior.riskScore * 0.15 +
address.riskScore * 0.20 +
network.riskScore * 0.20
        );

return {
        score,
signals: {
velocityScore: velocity.riskScore,
deviceScore: device.riskScore,
behaviorScore: behavior.riskScore,
addressScore: address.riskScore,
networkScore: network.riskScore
        },
decision: this.getDecision(score, order.amount)
        };
    }

| private getDecision(score: number, amount: number): 'approve' | 'review' | 'decline' { |
// Dynamic thresholds based on amount
const reviewThreshold = amount > 500 ? 40 : 60;
const declineThreshold = amount > 500 ? 70 : 85;

if (score >= declineThreshold) return 'decline';
if (score >= reviewThreshold) return 'review';
return 'approve';
    }
}

```text

## VELOCITY CHECKING

### The Scar 2

> "Card used 50 times in 10 minutes across different accounts.
> Each transaction under $100. Total: $5000.
> Our system processed all of them.
> All chargebacks. Card was stolen."

```typescript

// VIBE: No velocity checks
async function processPayment(card: string, amount: number) {
return stripe.charges.create({ source: card, amount });
// No check if this card was just used 50 times
}

```typescript
// TITAN: Multi-dimensional velocity limiting
import { Redis } from 'ioredis';

class VelocityChecker {
constructor(private redis: Redis) {}

async checkVelocity(identifiers: {
cardFingerprint: string;
userId: string;
ipAddress: string;
deviceId: string;
email: string;
}): Promise<{
allowed: boolean;
triggeredRules: string[];
riskScore: number;
}> {
const rules = [
// Card velocity
{ key: `velocity:card:${identifiers.cardFingerprint}`,
window: 3600, limit: 5, weight: 30, name: 'card_hourly' },
{ key: `velocity:card:${identifiers.cardFingerprint}`,
window: 86400, limit: 10, weight: 25, name: 'card_daily' },

// IP velocity
{ key: `velocity:ip:${identifiers.ipAddress}`,
window: 3600, limit: 10, weight: 20, name: 'ip_hourly' },

// Device velocity
{ key: `velocity:device:${identifiers.deviceId}`,
window: 3600, limit: 8, weight: 25, name: 'device_hourly' },

// Email velocity (new accounts)
{ key: `velocity:email:${identifiers.email}`,
window: 86400, limit: 3, weight: 15, name: 'email_daily' },

// Cross-account: cards used by multiple accounts
{ key: `velocity:card_accounts:${identifiers.cardFingerprint}`,
window: 86400, limit: 2, weight: 40, name: 'cross_account' }
        ];

const triggeredRules: string[] = [];
let riskScore = 0;

const multi = this.redis.multi();

for (const rule of rules) {
        multi.incr(rule.key);
multi.expire(rule.key, rule.window);
        }

const results = await multi.exec();

rules.forEach((rule, index) => {
| const count = results?.[index * 2]?.[1] as number |  | 0; |

if (count > rule.limit) {
        triggeredRules.push(rule.name);
riskScore += rule.weight;
} else if (count > rule.limit * 0.7) {
// Approaching limit - add partial risk
riskScore += rule.weight * 0.3;
        }
        });

// Track cross-account usage
await this.redis.sadd(
        `card_users:${identifiers.cardFingerprint}`,
        identifiers.userId
        );
await this.redis.expire(
        `card_users:${identifiers.cardFingerprint}`,
86400 * 7
        );

return {
allowed: triggeredRules.length === 0,
        triggeredRules,
riskScore: Math.min(riskScore, 100)
        };
    }
}

```text

## DEVICE FINGERPRINTING

### The Scar 3

> "Fraudster created 100 accounts. Used same laptop.
> We didn't track devices. Looked like 100 different users.
> Each account bought one item, charged back.
> $15,000 in fraud from ONE person."

```typescript
// VIBE: No device tracking
function registerUser(email: string) {
return db.users.create({ email });
// No device information stored
}

```typescript

// TITAN: Browser fingerprinting with FingerprintJS
// Frontend: Collect fingerprint
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';

const fp = await FingerprintJS.load({ apiKey: 'your-api-key' });
const result = await fp.get();

// Send with all requests
const deviceData = {
visitorId: result.visitorId,  // Persistent across sessions
requestId: result.requestId,
confidence: result.confidence,

// Specific signals
incognito: result.incognito,
browserName: result.browserName,
os: result.os,
device: result.device,
ip: result.ip,

// Bot detection
botProbability: result.botProbability
};

// Backend: Device risk assessment
class DeviceRiskAssessor {
async assessDevice(visitorId: string, userId: string): Promise<{
riskScore: number;
reasons: string[];
}> {
const reasons: string[] = [];
let riskScore = 0;

// Check how many accounts use this device
const linkedAccounts = await this.db.deviceLinks.count({
where: { visitorId }
        });

if (linkedAccounts > 5) {
riskScore += 50;
reasons.push(`Device linked to ${linkedAccounts} accounts`);
        }

// Check device history
const deviceHistory = await this.db.deviceEvents.findMany({
where: { visitorId },
orderBy: { createdAt: 'desc' },
take: 100
        });

// Check for previous fraud
const fraudEvents = deviceHistory.filter(e =>
| e.type === 'CHARGEBACK' |  | e.type === 'FRAUD_CONFIRMED' |
        );

if (fraudEvents.length > 0) {
riskScore += 90;
reasons.push('Device associated with previous fraud');
        }

// Check for incognito/privacy mode
const incognitoSessions = deviceHistory.filter(e => e.incognito);
if (incognitoSessions.length / deviceHistory.length > 0.5) {
riskScore += 15;
reasons.push('Frequently uses private browsing');
        }

// Store device link
await this.db.deviceLinks.upsert({
where: { visitorId_userId: { visitorId, userId } },
create: { visitorId, userId },
update: { lastSeen: new Date() }
        });

return { riskScore: Math.min(riskScore, 100), reasons };
    }
}

```text

## CHARGEBACK DISPUTE AUTOMATION

### The Scar 4

> "100 chargebacks per month. Each needs response within 7 days.
> Manual review: 2 hours per dispute. Team overwhelmed.
> Missed deadlines. Auto-lost disputes. 80% loss rate.
> Good evidence existed but never submitted."

```typescript

// VIBE: Manual chargeback handling
// Email arrives -> Someone remembers to check -> Maybe respond

```typescript
// TITAN: Automated dispute response system
import Stripe from 'stripe';

class ChargebackDisputeHandler {
    constructor(
private stripe: Stripe,
private db: PrismaClient,
private emailService: EmailService
) {}

async handleDisputeCreated(event: Stripe.Event) {
const dispute = event.data.object as Stripe.Dispute;

// Log immediately
const disputeRecord = await this.db.disputes.create({
data: {
stripeDisputeId: dispute.id,
chargeId: dispute.charge as string,
amount: dispute.amount,
reason: dispute.reason,
status: 'NEEDS_RESPONSE',
dueBy: new Date(dispute.evidence_details.due_by * 1000)
        }
        });

// Gather evidence automatically
const evidence = await this.gatherEvidence(dispute.charge as string);

// Auto-submit if high confidence
if (evidence.confidence > 0.8) {
await this.submitEvidence(dispute.id, evidence);
} else {
// Queue for manual review with gathered evidence
await this.queueForReview(disputeRecord.id, evidence);
        }
    }

private async gatherEvidence(chargeId: string): Promise<{
confidence: number;
evidence: Stripe.DisputeUpdateParams.Evidence;
}> {
const charge = await this.stripe.charges.retrieve(chargeId);
const order = await this.db.orders.findFirst({
where: { stripeChargeId: chargeId },
include: {
shipments: true,
customer: true,
communications: true
        }
        });

if (!order) {
return { confidence: 0, evidence: {} };
        }

const evidence: Stripe.DisputeUpdateParams.Evidence = {};
let confidenceFactors: number[] = [];

// Shipping proof (strongest evidence)
const deliveredShipment = order.shipments.find(s => s.status === 'DELIVERED');
if (deliveredShipment) {
evidence.shipping_carrier = deliveredShipment.carrier;
evidence.shipping_tracking_number = deliveredShipment.trackingNumber;
evidence.shipping_date = deliveredShipment.shippedAt.toISOString().split('T')[0];

// Get delivery confirmation
const deliveryProof = await this.getCarrierDeliveryProof(
        deliveredShipment.carrier,
        deliveredShipment.trackingNumber
        );

if (deliveryProof) {
evidence.shipping_documentation = deliveryProof.signatureImageUrl;
confidenceFactors.push(0.95); // Delivery signature = very strong
} else {
confidenceFactors.push(0.7); // Tracking shows delivered
        }
        }

// Customer communications
const comms = order.communications.filter(c =>
c.type === 'EMAIL' && c.fromCustomer === false
        );
if (comms.length > 0) {
evidence.customer_communication = comms
.map(c => `${c.createdAt.toISOString()}: ${c.subject}`)
        .join('\n');
        confidenceFactors.push(0.5);
        }

// AVS and CVV match
if (charge.payment_method_details?.card) {
const card = charge.payment_method_details.card;
if (card.checks?.cvc_check === 'pass') {
evidence.uncategorized_text = 'CVV verification passed';
        confidenceFactors.push(0.6);
        }
if (card.checks?.address_line1_check === 'pass') {
        confidenceFactors.push(0.5);
        }
        }

// Device/IP information
evidence.access_activity_log = JSON.stringify({
ip: order.customerIp,
device: order.deviceFingerprint,
location: order.customerLocation
        });

const avgConfidence = confidenceFactors.length > 0
? confidenceFactors.reduce((a, b) => a + b) / confidenceFactors.length
: 0;

return { confidence: avgConfidence, evidence };
    }

private async submitEvidence(
disputeId: string,
gathered: { evidence: Stripe.DisputeUpdateParams.Evidence }
) {
await this.stripe.disputes.update(disputeId, {
evidence: gathered.evidence,
submit: true
        });

await this.db.disputes.update({
where: { stripeDisputeId: disputeId },
data: {
status: 'EVIDENCE_SUBMITTED',
autoSubmitted: true,
submittedAt: new Date()
        }
        });
    }
}

```text

## STRIPE RADAR RULES

### The Scar 5

> "High-risk country orders blocked by default.
> But 30% of revenue came from those countries.
> Radar rules too aggressive. Lost $2M in legitimate sales.
> Need balance between fraud prevention and conversion."

// TITAN: Custom Stripe Radar rules with business logic
// Stripe Dashboard -> Radar -> Rules

// BLOCK rules (highest priority)
// Block orders with mismatched billing/shipping countries
    {
rule: "::isCardCountry:('US') AND NOT ::isShippingCountry:('US')",
action: "block",
// But allow for corporate shipping
exception: "::metadata:'corporate_account' = 'true'"
    }

// 3DS authentication for high risk
    {
rule: ":risk_score: > 65",
action: "request_3ds"
    }

// Review rules (manual queue)
    {
rule: "::isCardCountry:('NG', 'RO', 'PH') AND :amount_in_usd: > 100",
action: "review"
    }

// Allow rules (high-trust customers)
    {
rule: "::metadata:'vip_customer' = 'true' AND :risk_score: < 80",
action: "allow"
    }

// Programmatic Radar rule management
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create custom metadata for Radar
const paymentIntent = await stripe.paymentIntents.create({
amount: 10000,
currency: 'usd',
metadata: {
order_id: order.id,
customer_tenure_days: daysSinceRegistration.toString(),
previous_orders: previousOrderCount.toString(),
account_verified: user.emailVerified.toString(),
corporate_account: user.isCorporate.toString(),
vip_customer: user.isVip.toString()
        },
// Risk-based actions
payment_method_options: {
card: {
request_three_d_secure: riskScore > 50 ? 'any' : 'automatic'
        }
        }
    });

### END OF VOLUME 4.1: TITAN GEMINI RESEARCH - PAYMENT FRAUD PREVENTION

## VOLUME 5: TITAN GEMINI RESEARCH - SUBSCRIPTION BILLING PATTERNS

## DUNNING AND FAILED PAYMENTS

### The Scar 5 2

> "Customer's card expired. First payment failed.
> Immediately cancelled subscription. Lost customer.
> No retry. No dunning emails. No grace period.
> $50k MRR lost to involuntary churn."

```typescript
// VIBE: Immediate cancellation on failure
webhook.on('invoice.payment_failed', async (invoice) => {
await cancelSubscription(invoice.subscription);
await sendEmail(invoice.customer, 'Your subscription has been cancelled');
});

```typescript

// TITAN: Smart dunning with exponential backoff
import Stripe from 'stripe';

interface DunningConfig {
retrySchedule: number[];  // Days between retries
gracePeriodDays: number;
emailSequence: string[];
}

const DUNNING_CONFIG: DunningConfig = {
retrySchedule: [1, 3, 5, 7],  // Retry on day 1, 3, 5, 7
gracePeriodDays: 14,
emailSequence: [
'payment_failed_first', // Day 0
'payment_failed_reminder', // Day 3
'payment_failed_urgent', // Day 7
'subscription_ending_soon', // Day 10
'subscription_cancelled' // Day 14
    ]
};

class DunningManager {
private stripe: Stripe;

async handleFailedPayment(invoice: Stripe.Invoice) {
const subscription = await this.stripe.subscriptions.retrieve(
invoice.subscription as string
        );

// Calculate retry attempt
const failedAttempts = invoice.attempt_count;

if (failedAttempts === 1) {
// First failure: soft notification
await this.sendDunningEmail(
invoice.customer as string,
        'payment_failed_first',
        {
amount: invoice.amount_due / 100,
updatePaymentUrl: await this.createUpdatePaymentLink(invoice),
gracePeriodEnd: this.calculateGracePeriodEnd()
        }
        );

// Set subscription to past_due (not cancelled)
await this.stripe.subscriptions.update(subscription.id, {
collection_method: 'charge_automatically',
// Don't cancel - just mark as past due
        });
        }

// Schedule smart retry (avoid weekends, try different times)
const nextRetryDate = this.calculateNextRetryDate(failedAttempts);

await this.scheduleRetry(invoice.id, nextRetryDate);
    }

calculateNextRetryDate(attempt: number): Date {
| const daysUntilRetry = DUNNING_CONFIG.retrySchedule[attempt - 1] |  | 7; |
let retryDate = new Date();
retryDate.setDate(retryDate.getDate() + daysUntilRetry);

// Avoid weekends (banks process slower)
const dayOfWeek = retryDate.getDay();
if (dayOfWeek === 0) retryDate.setDate(retryDate.getDate() + 1);
if (dayOfWeek === 6) retryDate.setDate(retryDate.getDate() + 2);

// Set to morning (higher success rate)
retryDate.setHours(9, 0, 0, 0);

return retryDate;
    }

async createUpdatePaymentLink(invoice: Stripe.Invoice): Promise<string> {
// Create customer portal session for updating payment
const session = await this.stripe.billingPortal.sessions.create({
customer: invoice.customer as string,
return_url: `${process.env.APP_URL}/billing`,
flow_data: {
type: 'payment_method_update',
after_completion: {
type: 'redirect',
redirect: {
return_url: `${process.env.APP_URL}/billing?updated=true`
        }
        }
        }
        });

return session.url;
    }

async attemptCardUpdate(customerId: string): Promise<boolean> {
// Try to update card via Adaptive Acceptance
const customer = await this.stripe.customers.retrieve(customerId);
const paymentMethods = await this.stripe.paymentMethods.list({
customer: customerId,
type: 'card'
        });

for (const pm of paymentMethods.data) {
// Check if card details have been updated by bank
if (pm.card?.exp_month && pm.card?.exp_year) {
const now = new Date();
const expiry = new Date(pm.card.exp_year, pm.card.exp_month - 1);

if (expiry > now) {
return true;  // Card is still valid
        }
        }
        }

return false;
    }
}

// TITAN: Stripe webhook handler for subscription lifecycle
app.post('/webhooks/stripe', async (req, res) => {
const event = stripe.webhooks.constructEvent(
        req.body,
        req.headers['stripe-signature'],
        process.env.STRIPE_WEBHOOK_SECRET
    );

switch (event.type) {
case 'invoice.payment_failed':
await dunningManager.handleFailedPayment(event.data.object);
        break;

case 'invoice.paid':
// Payment succeeded - clear dunning state
await clearDunningState(event.data.object.customer);
        break;

case 'customer.subscription.updated':
const subscription = event.data.object;
if (subscription.cancel_at_period_end) {
// User scheduled cancellation - start win-back
await startWinBackSequence(subscription.customer);
        }
        break;

case 'customer.subscription.deleted':
// Final cancellation - log and maybe offer reactivation
await handleFinalCancellation(event.data.object);
        break;
    }

res.json({ received: true });
});

```text

## PRORATION AND PLAN CHANGES

### The Scar 6

> "User upgraded mid-cycle. Double charged.
> Downgrade: no refund, paying for features they don't have.
> Proration math wrong. Customers angry.
> Manual refunds every day. Support overloaded."

```typescript

// VIBE: No proration handling
async function changePlan(subscriptionId: string, newPriceId: string) {
await stripe.subscriptions.update(subscriptionId, {
items: [{ price: newPriceId }]
    });
// No proration = customer rage
}

```typescript
// TITAN: Proper proration with preview
class SubscriptionManager {
async previewPlanChange(
subscriptionId: string,
newPriceId: string
): Promise<{
immediateCharge: number;
credit: number;
nextInvoiceAmount: number;
effectiveDate: Date;
}> {
// Get preview of what will be charged
const subscription = await stripe.subscriptions.retrieve(subscriptionId);

const preview = await stripe.invoices.retrieveUpcoming({
customer: subscription.customer as string,
subscription: subscriptionId,
subscription_items: [{
id: subscription.items.data[0].id,
price: newPriceId
        }],
subscription_proration_behavior: 'create_prorations'
        });

// Calculate credit and charge
let credit = 0;
let charge = 0;

for (const line of preview.lines.data) {
if (line.proration && line.amount < 0) {
credit += Math.abs(line.amount);
} else if (line.proration && line.amount > 0) {
charge += line.amount;
        }
        }

return {
immediateCharge: Math.max(0, charge - credit) / 100,
credit: credit / 100,
nextInvoiceAmount: preview.amount_due / 100,
effectiveDate: new Date(preview.period_start * 1000)
        };
    }

async changePlan(
subscriptionId: string,
newPriceId: string,
options: {
| prorationBehavior: 'create_prorations' | 'none' | 'always_invoice'; |
| effectiveDate?: 'now' | 'period_end'; |
        }
) {
const subscription = await stripe.subscriptions.retrieve(subscriptionId);

if (options.effectiveDate === 'period_end') {
// Schedule change for end of billing period (no proration)
return stripe.subscriptions.update(subscriptionId, {
items: [{
id: subscription.items.data[0].id,
price: newPriceId
        }],
proration_behavior: 'none',
billing_cycle_anchor: 'unchanged'
        });
        }

// Immediate change with proration
const updated = await stripe.subscriptions.update(subscriptionId, {
items: [{
id: subscription.items.data[0].id,
price: newPriceId
        }],
proration_behavior: options.prorationBehavior,
payment_behavior: 'error_if_incomplete'  // Fail if can't charge
        });

// If upgrading and proration requires payment, invoice immediately
if (options.prorationBehavior === 'always_invoice') {
try {
const invoice = await stripe.invoices.create({
customer: subscription.customer as string,
subscription: subscriptionId,
auto_advance: true
        });

await stripe.invoices.pay(invoice.id);
} catch (error) {
// Payment failed - revert plan change
await this.revertPlanChange(subscriptionId, subscription);
throw new Error('Payment failed for plan upgrade');
        }
        }

return updated;
    }

async revertPlanChange(
subscriptionId: string,
originalSubscription: Stripe.Subscription
) {
await stripe.subscriptions.update(subscriptionId, {
items: [{
id: originalSubscription.items.data[0].id,
price: originalSubscription.items.data[0].price.id
        }],
proration_behavior: 'none'
        });
    }
}

```text

### END OF VOLUME 5: TITAN GEMINI RESEARCH - SUBSCRIPTION BILLING PATTERNS

---

## VOLUME 2: PRODUCTION PAYMENT PATTERNS

## STRIPE PRODUCTION PATTERNS

### Idempotent Payment Processing

**The Scar**: A fintech startup double-charged 5,000 customers due to network timeout retry without idempotency keys

// ? TITAN: Production Stripe payment with idempotency
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
apiVersion: '2024-04-10',
maxNetworkRetries: 2,  // Automatic retries for network errors
    });

class PaymentService {
async createPaymentIntent(
amount: number,
currency: string,
customerId: string,
orderId: string  // Use order ID for idempotency
): Promise<Stripe.PaymentIntent> {
// Generate idempotency key from order - ensures same order = same payment
const idempotencyKey = \order_\_payment\;

try {
const paymentIntent = await stripe.paymentIntents.create(
        {
amount: Math.round(amount *100),  // Stripe uses cents
currency: currency.toLowerCase(),
customer: customerId,
metadata: {
        orderId,
createdAt: new Date().toISOString()
        },
// Automatic payment method detection
automatic_payment_methods: {
enabled: true
        },
// Capture immediately
capture_method: 'automatic'
        },
        {
idempotencyKey // CRITICAL: prevents duplicate charges on retry
        }
        );

// Log for audit trail
await this.logPaymentEvent({
type: 'payment_intent_created',
paymentIntentId: paymentIntent.id,
        orderId,
        amount,
status: paymentIntent.status
        });

return paymentIntent;
} catch (error) {
if (error instanceof Stripe.errors.StripeError) {
await this.logPaymentEvent({
type: 'payment_error',
        orderId,
errorType: error.type,
errorCode: error.code,
message: error.message
        });

// Handle specific error types
if (error.code === 'card_declined') {
throw new PaymentError('Card declined', 'CARD_DECLINED');
        }
if (error.code === 'insufficient_funds') {
throw new PaymentError('Insufficient funds', 'INSUFFICIENT_FUNDS');
        }
        }
throw error;
        }
      }

async handleWebhook(
payload: Buffer,
signature: string
): Promise<void> {
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

let event: Stripe.Event;
try {
event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
} catch (err) {
throw new Error('Webhook signature verification failed');
        }

switch (event.type) {
case 'payment_intent.succeeded':
await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

case 'payment_intent.payment_failed':
await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;

case 'charge.dispute.created':
await this.handleDispute(event.data.object as Stripe.Dispute);
        break;

        default:
console.log(\Unhandled event type: \\);
        }
      }

private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
const orderId = paymentIntent.metadata.orderId;

// Update order status
await db.orders.update({
where: { id: orderId },
data: {
paymentStatus: 'PAID',
paymentIntentId: paymentIntent.id,
paidAt: new Date()
        }
        });

// Trigger fulfillment
await this.fulfillmentQueue.add({ orderId });

// Send confirmation email
await this.emailQueue.add({
type: 'order_confirmation',
        orderId,
customerId: paymentIntent.customer as string
        });
      }
    }

## SUBSCRIPTION BILLING

### Proration and Plan Changes 2

// ? TITAN: Subscription management with proration
class SubscriptionService {
async changePlan(
subscriptionId: string,
newPriceId: string,
prorate: boolean = true
): Promise<Stripe.Subscription> {
const subscription = await stripe.subscriptions.retrieve(subscriptionId);

// Calculate what customer will pay
const preview = await stripe.invoices.retrieveUpcoming({
subscription: subscriptionId,
subscription_items: [{
id: subscription.items.data[0].id,
price: newPriceId
        }],
subscription_proration_behavior: prorate ? 'create_prorations' : 'none'
        });

// Log the preview for customer transparency
console.log(\Plan change preview: \$\ due immediately\);

// Execute the change
const updatedSubscription = await stripe.subscriptions.update(
        subscriptionId,
        {
items: [{
id: subscription.items.data[0].id,
price: newPriceId
        }],
proration_behavior: prorate ? 'create_prorations' : 'none',
// Bill immediately if upgrading
payment_behavior: 'pending_if_incomplete'
        }
        );

return updatedSubscription;
      }

async cancelSubscription(
subscriptionId: string,
cancelImmediately: boolean = false
): Promise<Stripe.Subscription> {
if (cancelImmediately) {
return stripe.subscriptions.cancel(subscriptionId, {
prorate: true  // Credit remaining time
        });
} else {
// Cancel at period end (common pattern)
return stripe.subscriptions.update(subscriptionId, {
cancel_at_period_end: true
        });
        }
      }

async pauseSubscription(
subscriptionId: string,
resumeAt?: Date
): Promise<Stripe.Subscription> {
return stripe.subscriptions.update(subscriptionId, {
pause_collection: {
behavior: 'void'  // Don't invoice during pause
        }
        });
      }
    }

### END OF PAYMENTS VOLUME 2

### Lines: ~200+ added

## VOLUME 7: REAL 2024 INDIA PAYMENT PRODUCTION ISSUES

## Source: NPCI Guidelines, Razorpay Docs, Real Developer Reports

> ?? **This is REAL India-specific payment knowledge from production apps.**

---

## UPI INTEGRATION

### The UPI Ecosystem

```text
User App ? PSP (PhonePe, GPay) ? NPCI ? Remitter Bank ? NPCI ? Beneficiary Bank
        ?
Your Backend (Webhook)

```text

### The 30-Second Timeout Problem

```text
UPI transactions have a ~30 second processing window.
Bank systems are often slow or overloaded.

User experience:

- Payment shows "Processing" for 30 seconds

- Then "Failed" or "Pending"

- User retries = double payment potential

```text

### Real Fixes for UPI

### Fix 1: Implement Status API Polling (CRITICAL)

```typescript
// ? VIBE: Only relying on webhook
// Webhook might be delayed or never arrive

// ? TITAN: Poll Status API + Webhook backup
async function trackUpiPayment(transactionId: string): Promise<PaymentStatus> {
const maxAttempts = 20;  // 5 minutes total
const intervalMs = 15000;  // Every 15 seconds

for (let attempt = 0; attempt < maxAttempts; attempt++) {
const status = await checkPaymentStatus(transactionId);

// Terminal statuses
| if (status === 'SUCCESS' |  | status === 'FAILED') { |
return status;
    }

// Still pending, wait and retry
await new Promise(resolve => setTimeout(resolve, intervalMs));
  }

// After 5 minutes, mark as "CHECK_MANUALLY"
return 'TIMEOUT_CHECK_MANUALLY';
}

// Background job to reconcile
async function upiReconciliationJob() {
const pendingPayments = await db.payment.findMany({
where: {
method: 'upi',
status: 'PENDING',
createdAt: { lt: new Date(Date.now() - 5 *60* 1000) }  // Older than 5 mins
    }
  });

for (const payment of pendingPayments) {
const status = await pspClient.checkStatus(payment.transactionId);

if (status.state === 'SUCCESS') {
await completeOrder(payment.orderId);
await db.payment.update({
where: { id: payment.id },
data: { status: 'SUCCESS' }
      });
} else if (status.state === 'FAILED') {
await db.payment.update({
where: { id: payment.id },
data: { status: 'FAILED' }
      });
    }
// If still PENDING after 4 hours, escalate (NPCI 4-hour rule)
  }
}

```text

### Fix 2: NPCI 4-Hour Rule (2024)

```typescript
// NPCI mandate since January 2024:
// Any failed/stuck UPI transaction MUST be resolved within 4 hours

async function enforce4HourRule() {
const fourHoursAgo = new Date(Date.now() - 4 *60* 60 * 1000);

const stuckPayments = await db.payment.findMany({
where: {
method: 'upi',
status: 'PENDING',
createdAt: { lt: fourHoursAgo }
    }
  });

for (const payment of stuckPayments) {
// Escalate to PSP support or initiate refund
await pspClient.requestRefund(payment.transactionId);
await db.payment.update({
where: { id: payment.id },
data: { status: 'REFUND_INITIATED' }
    });

// Alert customer
await sendSms(payment.userPhone,
`Your ?${payment.amount} payment to ${payment.merchantName} has been refunded.`
    );
  }
}

```text

### Fix 3: Handle Bank Downtime (Real 2024 Issue)

```typescript
// May 2024: Indian banks had 31 downtime instances, 47+ hours offline
// Your app should gracefully handle this

interface BankStatusResponse {
bank: string;
upiEnabled: boolean;
| lastDowntime: Date | null; |
}

async function getPaymentMethods(userBankIfsc: string): Promise<PaymentMethod[]> {
const methods: PaymentMethod[] = [];

// Check UPI availability
const bankStatus = await checkBankUpiStatus(userBankIfsc);

if (bankStatus.upiEnabled) {
methods.push({ type: 'upi', available: true });
} else {
    methods.push({
type: 'upi',
available: false,
message: 'UPI temporarily unavailable for your bank. Try card payment.'
    });
  }

// Always offer alternatives
methods.push({ type: 'card', available: true });
methods.push({ type: 'netbanking', available: true });

return methods;
}

```text

---

## RAZORPAY INTEGRATION

### Webhook Signature Verification (Common Issue)

// ? VIBE: Signature verification fails randomly
app.post('/webhooks/razorpay', express.json(), async (req, res) => {
const signature = req.headers['x-razorpay-signature'];
const body = JSON.stringify(req.body);  // WRONG!

const isValid = Razorpay.validateWebhookSignature(
        body,
        signature,
        webhookSecret
      );
// Often fails because JSON.stringify may reorder or change formatting
    });

// ? TITAN: Use RAW body for signature verification
    app.post('/webhooks/razorpay',
express.raw({ type: 'application/json' }),  // RAW body as Buffer
async (req, res) => {
const signature = req.headers['x-razorpay-signature'] as string;
const rawBody = req.body.toString('utf8');  // Use raw string

const isValid = Razorpay.validateWebhookSignature(
        rawBody,
        signature,
        process.env.RAZORPAY_WEBHOOK_SECRET!
        );

if (!isValid) {
console.error('Invalid webhook signature');
return res.status(400).json({ error: 'Invalid signature' });
        }

// Now parse JSON
const event = JSON.parse(rawBody);
await handleRazorpayEvent(event);

res.status(200).json({ received: true });
      }
    );

### Float Precision Problem

// ? VIBE: Floating point in webhook payload
// Payload: { "amount": 100.10 }
// After JSON.parse + JSON.stringify: { "amount": 100.09999999999999 }
// Signature mismatch!

// ? TITAN: Never re-serialize, use raw body for signature
// For amount comparisons, use integer paisa/cents
const amountInPaisa = Math.round(order.amount* 100);  // ?100.10 ? 10010

### Idempotency for Razorpay

// Problem: Webhook delivered multiple times (retries)
// Solution: Check if already processed

async function handleRazorpayEvent(event: RazorpayEvent) {
const eventId = event.event_id;

// Check if already processed
const existing = await db.webhookEvent.findUnique({
where: { eventId }
      });

if (existing) {
console.log(`Event ${eventId} already processed`);
        return;
      }

// Process event
if (event.event === 'payment.captured') {
await handlePaymentCaptured(event.payload.payment);
} else if (event.event === 'payment.failed') {
await handlePaymentFailed(event.payload.payment);
      }

// Mark as processed
await db.webhookEvent.create({
data: {
        eventId,
eventType: event.event,
processedAt: new Date()
        }
      });
    }

## CARD PAYMENTS IN INDIA (RBI MANDATES 2024)

### Recurring Payments (e-Mandate)

```typescript
// RBI mandate: Recurring payments > ?15,000 require additional authentication

interface RecurringPaymentSetup {
customerId: string;
maxAmount: number;  // In paisa
| frequency: 'monthly' | 'yearly'; |
}

async function createRecurringMandate(setup: RecurringPaymentSetup) {
// If max amount > ?15,000, user needs to auth each time
// OR set up e-mandate with explicit consent

const razorpay = new Razorpay({
key_id: process.env.RAZORPAY_KEY!,
key_secret: process.env.RAZORPAY_SECRET!
  });

const subscription = await razorpay.subscriptions.create({
plan_id: 'plan_abc123',
customer_id: setup.customerId,
quantity: 1,
total_count: 12,  // 12 billing cycles
customer_notify: 1,  // Razorpay notifies customer
notes: {
mandate_type: 'e-mandate',
max_amount: setup.maxAmount
    }
  });

return subscription;
}

```text

### Card Tokenization (RBI Mandate)

```typescript
// RBI: Merchants cannot store raw card numbers since Oct 2022
// Use payment gateway tokens only

// ? VIBE: Storing card numbers (ILLEGAL in India)
await db.card.create({
data: {
userId: user.id,
cardNumber: '4111111111111111',  // NEVER DO THIS
expiry: '12/25'
  }
});

// ? TITAN: Store only tokenized reference
await db.savedCard.create({
data: {
userId: user.id,
tokenId: 'tok_abc123',  // Razorpay token
last4: '1111',
cardNetwork: 'visa',
expiryMonth: 12,
expiryYear: 2025
  }
});

```text

---

## DECISION TREE: INDIA PAYMENTS DEBUGGING

```text
INDIA PAYMENT ISSUE

+- UPI payment stuck in PENDING?
+- Poll Status API every 15 seconds
+- Wait up to 4 hours (NPCI rule)
+- Check if bank is experiencing downtime
+- After 4 hours, initiate refund

+- Razorpay webhook signature invalid?
+- Use RAW body (not parsed JSON)
+- express.raw({ type: 'application/json' })
+- Check webhook secret matches dashboard
+- Check for float precision issues

+- Recurring payment failing?
+- Amount > ?15,000? ? Need authentication each time
+- e-Mandate properly set up?
+- Card token still valid?

+- Payment gateway timeout?
+- Implement retry with exponential backoff
+- Have fallback payment method ready
+- Show user-friendly error with alternatives

+- Webhook not receiving events?
+- Check webhook URL is HTTPS and accessible
+- Respond with 200 status code
+- Check Razorpay dashboard for delivery logs

```text

---

## ESSENTIAL INDIA PAYMENT COMPLIANCE (2024)

```typescript
// Checklist for India payment integration:

const indiaPaymentCompliance = {
// RBI mandates
cardTokenization: true,  // No raw card storage since Oct 2022
recurringPaymentAuth: true,   // Auth for > ?15,000 recurring
twoFactorAuth: true,  // 2FA for card payments

// NPCI/UPI mandates
fourHourResolution: true,  // Transaction issues within 4 hours
alphanumericTxnId: true,  // Only alphanumeric from Feb 2025
inactiveUpiDeactivation: true, // Deactivate after 1 year inactive

// GST
gstInvoice: true,  // Generate GST-compliant invoices
hsnCode: true,  // Include HSN/SAC codes

// Refunds
sameSourceRefund: true,  // Refund to original payment source
refundTimeline: true,  // 5-7 business days for cards
};

```text

---

### END OF INDIA PAYMENT REAL PRODUCTION ISSUES

---

## VOLUME 8: REAL 2024 STRIPE PRODUCTION ISSUES

## Source: Stripe Docs, Developer Reports, Stack Overflow

> ?? **This is REAL Stripe knowledge from production apps processing $1.4T annually.**

---

## DUPLICATE WEBHOOK EVENTS

### The Problem

Stripe may send the same webhook event multiple times.
Duplicates can arrive seconds, hours, or even days apart.

    Impact:

- Customer charged twice (refund nightmare)

- Inventory decremented multiple times

- Emails sent repeatedly

### Real Fix: Idempotent Webhook Handler

// ? TITAN: Store processed event IDs
async function handleStripeWebhook(req: Request, res: Response) {
const sig = req.headers['stripe-signature'] as string;
const rawBody = req.body;  // Use express.raw()

let event: Stripe.Event;

try {
event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
        );
} catch (err) {
return res.status(400).send(`Webhook Error: ${err.message}`);
      }

// CHECK FOR DUPLICATE
const existingEvent = await db.webhookEvent.findUnique({
where: { stripeEventId: event.id }
      });

if (existingEvent) {
console.log(`Duplicate event ${event.id} - skipping`);
return res.status(200).json({ received: true });  // Still return 200!
      }

// PROCESS EVENT
try {
switch (event.type) {
case 'payment_intent.succeeded':
await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
case 'invoice.paid':
await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
// ... more events
        }

// MARK AS PROCESSED
await db.webhookEvent.create({
data: {
stripeEventId: event.id,
eventType: event.type,
processedAt: new Date()
        }
        });

} catch (err) {
console.error(`Error processing ${event.id}:`, err);
// Return 500 to trigger Stripe retry
return res.status(500).json({ error: 'Processing failed' });
      }

res.status(200).json({ received: true });
    }

## IDEMPOTENCY KEYS FOR API CALLS

### The Problem 2

Network timeout during payment creation.
Did the charge go through? You don't know.
Retrying might double-charge the customer.

### Real Fix: Always Use Idempotency Keys

import { v4 as uuidv4 } from 'uuid';

// ? TITAN: Safe to retry with idempotency key
async function createPaymentIntent(
amount: number,
customerId: string,
idempotencyKey?: string
): Promise<Stripe.PaymentIntent> {
| const key = idempotencyKey |  | uuidv4(); |

// If this exact request was made before with this key,
// Stripe returns the cached result instead of creating new payment
const paymentIntent = await stripe.paymentIntents.create(
        {
        amount,
currency: 'inr',  // or 'usd'
customer: customerId,
metadata: { orderId: 'order_123' }
        },
        {
idempotencyKey: key  // Key is valid for 24 hours
        }
      );

// Store the key in case we need to retry
await db.order.update({
where: { id: 'order_123' },
data: { stripeIdempotencyKey: key }
      });

return paymentIntent;
    }

// Retry logic with stored key
async function retryPayment(orderId: string) {
const order = await db.order.findUnique({ where: { id: orderId } });

// Use SAME key - Stripe returns cached result if already processed
return createPaymentIntent(
        order.amount,
        order.customerId,
order.stripeIdempotencyKey // Reuse existing key!
      );
    }

## WEBHOOK RETRY BEHAVIOR

```typescript
// Stripe's retry schedule (if you return non-2xx):
// - Immediately
// - 1 hour later
// - 2 hours later
// - 4 hours later
// - 8 hours later
// - 16 hours later
// - 24 hours later
// Continues for up to 3 days, then gives up

// Your endpoint MUST:
// 1. Respond within 30 seconds
// 2. Return 2xx for success
// 3. Return 4xx for permanent failure (don't retry)
// 4. Return 5xx for temporary failure (do retry)

async function handleWebhook(req, res) {
try {
await processEvent(req.body);
return res.status(200).send('OK');
} catch (err) {
if (isRecoverable(err)) {
// Temporary issue - Stripe will retry
return res.status(500).send('Temporary error');
} else {
// Permanent issue - don't waste retries
console.error('Permanent webhook failure:', err);
return res.status(400).send('Permanent error');
    }
  }
}

```text

---

## COMMON STRIPE MISTAKES

### Mistake 1: Not Verifying Webhook Signature

```typescript
// ? VIBE: Anyone can POST fake events
app.post('/webhooks', express.json(), (req, res) => {
const event = req.body;  // No verification!
  processEvent(event);
});

// ? TITAN: Always verify signature
app.post('/webhooks', express.raw({ type: 'application/json' }), (req, res) => {
const event = stripe.webhooks.constructEvent(
    req.body,
    req.headers['stripe-signature'],
    process.env.STRIPE_WEBHOOK_SECRET
  );
// Now it's verified
});

```text

### Mistake 2: Relying Only on Client-Side Confirmation

```typescript
// ? VIBE: Trust client that payment succeeded
const result = await stripe.confirmPayment({ ... });
if (result.paymentIntent.status === 'succeeded') {
await grantAccess();  // User could fake this!
}

// ? TITAN: Always confirm server-side via webhook
// Webhook: payment_intent.succeeded
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
const orderId = paymentIntent.metadata.orderId;
await db.order.update({
where: { id: orderId },
data: { status: 'PAID' }
  });
await grantAccess(orderId);  // Only when Stripe confirms
}

```text

### Mistake 3: Not Handling Subscription Edge Cases

```typescript
// Events you MUST handle for subscriptions:
const subscriptionEvents = [
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.paid',
  'invoice.payment_failed',
  'customer.subscription.trial_will_end',
];

// Especially important: invoice.payment_failed
async function handlePaymentFailed(invoice: Stripe.Invoice) {
const customerId = invoice.customer as string;

// Send dunning email
await sendEmail(customerId, 'payment_failed');

// Stripe will retry based on your settings
// After X retries, subscription is canceled

// Check: customer.subscription.deleted event
}

```text

---

## DECISION TREE: STRIPE DEBUGGING

```text
STRIPE ISSUE

+- Webhook not receiving events?
+- Check webhook secret matches dashboard
+- Use Stripe CLI for local testing: stripe listen
+- Check server logs for signature errors
+- Verify HTTPS endpoint is publicly accessible

+- Duplicate charges?
+- Missing idempotency keys?
+- Webhook handler not checking for duplicates?
+- Review event processing logs

+- Payment succeeded but order not fulfilled?
+- Check webhook endpoint responded 200
+- Check for errors in event processing
+- Manually fetch event: stripe.events.retrieve(id)
+- Check Stripe Dashboard ? Events for delivery status

+- Subscription canceled unexpectedly?
+- Check invoice.payment_failed events
+- Check dunning settings in dashboard
+- Review customer's payment method status

+- Test mode working, live mode failing?
+- Using live API keys?
+- Using live webhook secret?
+- Check product/price IDs (different in live)
+- Review Stripe Dashboard for errors

```text

---

### END OF STRIPE REAL PRODUCTION ISSUES

---

## REAL SUBSCRIPTION BILLING PATTERNS 2024

## Stripe Subscription Management

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Create subscription
async function createSubscription(customerId: string, priceId: string) {
const subscription = await stripe.subscriptions.create({
customer: customerId,
items: [{ price: priceId }],
payment_behavior: 'default_incomplete',
payment_settings: { save_default_payment_method: 'on_subscription' },
expand: ['latest_invoice.payment_intent'],
      });

return {
subscriptionId: subscription.id,
clientSecret: (subscription.latest_invoice as any).payment_intent.client_secret,
      };
    }

// Cancel subscription
async function cancelSubscription(subscriptionId: string) {
return stripe.subscriptions.update(subscriptionId, {
cancel_at_period_end: true,
      });
    }

// Usage-based billing
async function reportUsage(subscriptionItemId: string, quantity: number) {
return stripe.subscriptionItems.createUsageRecord(subscriptionItemId, {
        quantity,
timestamp: Math.floor(Date.now() / 1000),
action: 'increment',
      });
    }

## Webhook Handler 3

async function handleStripeWebhook(req: Request) {
const sig = req.headers['stripe-signature']!;
const body = await req.text();

let event: Stripe.Event;
try {
event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
        );
} catch (err) {
throw new Error('Invalid signature');
      }

switch (event.type) {
case 'customer.subscription.created':
await handleSubscriptionCreated(event.data.object);
        break;
case 'customer.subscription.updated':
await handleSubscriptionUpdated(event.data.object);
        break;
case 'customer.subscription.deleted':
await handleSubscriptionDeleted(event.data.object);
        break;
case 'invoice.payment_succeeded':
await handlePaymentSucceeded(event.data.object);
        break;
case 'invoice.payment_failed':
await handlePaymentFailed(event.data.object);
        break;
      }

return { received: true };
    }

### END OF PAYMENT PATTERNS

## SUBSCRIPTIONS 2 2
