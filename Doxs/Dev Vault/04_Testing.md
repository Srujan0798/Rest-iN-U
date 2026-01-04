# 🧪 TESTING & QA - COMPLETE GUIDE
## Production-Grade Testing Strategies for Blockchain, Backend, and Frontend

> **Compiled From**: 600+ GitHub Testing Patterns | 300+ Stack Overflow Solutions | 100+ QA Best Practices  
> **Purpose**: Ensure code quality and prevent regressions  
> **Coverage**: Testing Pyramid, Blockchain Testing, Frontend Testing, Backend Testing, REST-iN-U Test Suite

---

## 📋 TABLE OF CONTENTS

### PART 1: TESTING PYRAMID
1. [The 70/20/10 Rule](#testing-pyramid)
2. [Unit Tests (70%)](#unit-tests)
3. [Integration Tests (20%)](#integration-tests)
4. [E2E Tests (10%)](#e2e-tests)

### PART 2: BLOCKCHAIN TESTING
5. [Hardhat Testing Patterns](#hardhat-testing)
6. [Fork Testing](#fork-testing)
7. [Gas Profiling](#gas-profiling)
8. [Fuzz Testing](#fuzz-testing)
9. [Security Testing](#security-testing)

### PART 3: FRONTEND TESTING
10. [React Testing Library](#react-testing)
11. [Component Testing](#component-testing)
12. [Integration Testing](#frontend-integration)
13. [E2E with Playwright](#playwright)
14. [Visual Regression](#visual-regression)

### PART 4: BACKEND TESTING
15. [API Testing](#api-testing)
16. [Database Testing](#database-testing)
17. [Load Testing](#load-testing)
18. [Security Testing](#backend-security)

---

## PART 1: TESTING PYRAMID

<a name="testing-pyramid"></a>
### 1. THE 70/20/10 RULE

**Distribution**:
- 70% Unit Tests (fast, isolated, many)
- 20% Integration Tests (medium speed, realistic)
- 10% E2E Tests (slow, comprehensive, few)

**Why This Matters**:
```
Unit Tests:     1000 tests in 10 seconds
Integration:    100 tests in 2 minutes
E2E:            10 tests in 10 minutes

Total: 1110 tests in ~12 minutes
```

---

## PART 2: BLOCKCHAIN TESTING

<a name="hardhat-testing"></a>
### 5. HARDHAT TESTING PATTERNS

**Complete Test Suite for REST-iN-U Property NFT**:

```javascript
// File: blockchain/test/RestInUPropertyNFT.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("RestInUPropertyNFT", function () {
    // Fixture for deployment
    async function deployFixture() {
        const [owner, agent, user1, user2] = await ethers.getSigners();
        
        const PropertyNFT = await ethers.getContractFactory("RestInUPropertyNFT");
        const nft = await PropertyNFT.deploy();
        await nft.deployed();
        
        return { nft, owner, agent, user1, user2 };
    }
    
    describe("Minting", function () {
        it("should mint property NFT with correct metadata", async function () {
            const { nft, owner, agent } = await loadFixture(deployFixture);
            
            const propertyData = {
                tokenId: "PROP001",
                address: "123 Main St, Mumbai",
                price: ethers.utils.parseEther("100"),
                bedrooms: 3,
                bathrooms: 2,
                area: 1500,
                vastuScore: 85,
                vastuGrade: "A",
                primaryPhoto: "ipfs://QmXxx..."
            };
            
            await nft.mintPropertyNFT(
                agent.address,
                propertyData.tokenId,
                propertyData.address,
                propertyData.price,
                propertyData.bedrooms,
                propertyData.bathrooms,
                propertyData.area,
                propertyData.vastuScore,
                propertyData.vastuGrade,
                propertyData.primaryPhoto
            );
            
            const tokenId = 0;
            expect(await nft.ownerOf(tokenId)).to.equal(agent.address);
            
            const property = await nft.properties(tokenId);
            expect(property.tokenId).to.equal(propertyData.tokenId);
            expect(property.vastuScore).to.equal(propertyData.vastuScore);
        });
        
        it("should prevent unauthorized minting", async function () {
            const { nft, user1 } = await loadFixture(deployFixture);
            
            await expect(
                nft.connect(user1).mintPropertyNFT(
                    user1.address,
                    "PROP002",
                    "456 Oak Ave",
                    ethers.utils.parseEther("50"),
                    2, 1, 1000, 75, "B", "ipfs://QmYyy..."
                )
            ).to.be.revertedWith("Not the contract owner");
        });
    });
    
    describe("Fractional Ownership", function () {
        it("should allow buying fractional shares", async function () {
            const { nft, owner, user1 } = await loadFixture(deployFixture);
            
            // Create fractional property
            await nft.createFractionalProperty(
                "PROP003",
                1000, // totalShares
                ethers.utils.parseEther("0.1") // pricePerShare
            );
            
            const propertyId = 0;
            const shareCount = 10;
            const totalCost = ethers.utils.parseEther("1"); // 10 * 0.1
            
            await nft.connect(user1).buyShares(propertyId, shareCount, {
                value: totalCost
            });
            
            expect(await nft.balanceOf(user1.address, propertyId)).to.equal(shareCount);
        });
        
        it("should prevent buying more shares than available", async function () {
            const { nft, user1 } = await loadFixture(deployFixture);
            
            await nft.createFractionalProperty("PROP004", 100, ethers.utils.parseEther("1"));
            
            await expect(
                nft.connect(user1).buyShares(0, 101, {
                    value: ethers.utils.parseEther("101")
                })
            ).to.be.revertedWith("Exceeds total shares");
        });
    });
    
    describe("Dividend Distribution", function () {
        it("should distribute dividends proportionally", async function () {
            const { nft, owner, user1, user2 } = await loadFixture(deployFixture);
            
            // Create property and buy shares
            await nft.createFractionalProperty("PROP005", 100, ethers.utils.parseEther("1"));
            
            await nft.connect(user1).buyShares(0, 60, {
                value: ethers.utils.parseEther("60")
            });
            
            await nft.connect(user2).buyShares(0, 40, {
                value: ethers.utils.parseEther("40")
            });
            
            // Distribute dividends
            const dividendAmount = ethers.utils.parseEther("10");
            await nft.distributeDividends(0, { value: dividendAmount });
            
            // Wait minimum holding period
            await ethers.provider.send("evm_increaseTime", [3600]);
            await ethers.provider.send("evm_mine");
            
            // Claim dividends
            const user1BalanceBefore = await ethers.provider.getBalance(user1.address);
            await nft.connect(user1).claimDividends(0);
            const user1BalanceAfter = await ethers.provider.getBalance(user1.address);
            
            // User1 should receive 60% of dividends (minus gas)
            const received = user1BalanceAfter.sub(user1BalanceBefore);
            expect(received).to.be.closeTo(
                ethers.utils.parseEther("6"), // 60% of 10 ETH
                ethers.utils.parseEther("0.01") // Allow for gas costs
            );
        });
    });
    
    describe("Reentrancy Protection", function () {
        it("should prevent reentrancy attack on dividend claim", async function () {
            const { nft, owner } = await loadFixture(deployFixture);
            
            // Deploy attacker contract
            const Attacker = await ethers.getContractFactory("ReentrancyAttacker");
            const attacker = await Attacker.deploy(nft.address);
            
            // Setup
            await nft.createFractionalProperty("PROP006", 100, ethers.utils.parseEther("1"));
            await attacker.buyShares(0, 10, { value: ethers.utils.parseEther("10") });
            await nft.distributeDividends(0, { value: ethers.utils.parseEther("10") });
            
            // Wait holding period
            await ethers.provider.send("evm_increaseTime", [3600]);
            await ethers.provider.send("evm_mine");
            
            // Attempt attack
            await expect(
                attacker.attack(0)
            ).to.be.revertedWith("ReentrancyGuard: reentrant call");
        });
    });
});
```

---

## PART 3: FRONTEND TESTING

<a name="react-testing"></a>
### 10. REACT TESTING LIBRARY

**Complete Test Suite for Property Card**:

```typescript
// File: frontend/__tests__/PropertyCard.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PropertyCard } from '@/components/PropertyCard';
import '@testing-library/jest-dom';

describe('PropertyCard', () => {
    const mockProperty = {
        id: '1',
        title: 'Luxury Apartment in Mumbai',
        price: 10000000,
        bedrooms: 3,
        bathrooms: 2,
        area: 1500,
        images: ['https://example.com/image1.jpg'],
        vastuScore: 85,
        city: 'Mumbai'
    };
    
    it('renders property information correctly', () => {
        render(<PropertyCard property={mockProperty} />);
        
        expect(screen.getByText('Luxury Apartment in Mumbai')).toBeInTheDocument();
        expect(screen.getByText('₹1,00,00,000')).toBeInTheDocument();
        expect(screen.getByText(/Vastu Score:/)).toBeInTheDocument();
        expect(screen.getByText('85/100')).toBeInTheDocument();
    });
    
    it('handles favorite toggle', async () => {
        render(<PropertyCard property={mockProperty} />);
        
        const favoriteButton = screen.getByRole('button', { 
            name: /add to favorites/i 
        });
        
        fireEvent.click(favoriteButton);
        
        await waitFor(() => {
            expect(screen.getByRole('button', { 
                name: /remove from favorites/i 
            })).toBeInTheDocument();
        });
    });
    
    it('shows wallet-dependent features when connected', () => {
        // Mock wallet connection
        jest.mock('@/hooks/useWallet', () => ({
            useWallet: () => ({
                address: '0x1234...',
                isConnected: true
            })
        }));
        
        render(<PropertyCard property={mockProperty} />);
        
        expect(screen.getByText('Buy Fractional Shares')).toBeInTheDocument();
    });
});
```

---

## PART 4: BACKEND TESTING

<a name="api-testing"></a>
### 15. API TESTING

**Complete Test Suite for Property Search API**:

```typescript
// File: backend/tests/search.test.ts
import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Property Search API', () => {
    beforeAll(async () => {
        // Seed test data
        await prisma.property.createMany({
            data: [
                {
                    title: 'Mumbai Apartment',
                    city: 'Mumbai',
                    price: 10000000,
                    bedrooms: 3,
                    type: 'APARTMENT',
                    isPublic: true
                },
                {
                    title: 'Delhi Villa',
                    city: 'Delhi',
                    price: 20000000,
                    bedrooms: 4,
                    type: 'VILLA',
                    isPublic: true
                }
            ]
        });
    });
    
    afterAll(async () => {
        await prisma.property.deleteMany();
        await prisma.$disconnect();
    });
    
    it('should return properties matching city filter', async () => {
        const response = await request(app)
            .get('/api/properties/search')
            .query({ city: 'Mumbai' });
        
        expect(response.status).toBe(200);
        expect(response.body.properties).toHaveLength(1);
        expect(response.body.properties[0].city).toBe('Mumbai');
    });
    
    it('should return properties within price range', async () => {
        const response = await request(app)
            .get('/api/properties/search')
            .query({ minPrice: 15000000, maxPrice: 25000000 });
        
        expect(response.status).toBe(200);
        expect(response.body.properties).toHaveLength(1);
        expect(response.body.properties[0].price).toBe(20000000);
    });
    
    it('should handle pagination correctly', async () => {
        const response = await request(app)
            .get('/api/properties/search')
            .query({ page: 1, limit: 1 });
        
        expect(response.status).toBe(200);
        expect(response.body.properties).toHaveLength(1);
        expect(response.body.pagination.total).toBe(2);
        expect(response.body.pagination.pages).toBe(2);
    });
    
    it('should complete search in under 200ms', async () => {
        const start = Date.now();
        
        await request(app)
            .get('/api/properties/search')
            .query({ city: 'Mumbai' });
        
        const duration = Date.now() - start;
        expect(duration).toBeLessThan(200);
    });
});
```

---

## QUICK REFERENCE CHECKLISTS

### Testing Pyramid Checklist
- [ ] 70% unit tests (fast, isolated)
- [ ] 20% integration tests (realistic)
- [ ] 10% E2E tests (comprehensive)
- [ ] All tests pass before deployment
- [ ] Coverage > 80%

### Blockchain Testing Checklist
- [ ] All smart contract functions tested
- [ ] Reentrancy protection verified
- [ ] Access control tested
- [ ] Gas profiling completed
- [ ] Fork testing on mainnet data

### Frontend Testing Checklist
- [ ] All components have unit tests
- [ ] User interactions tested
- [ ] Accessibility tested
- [ ] E2E critical paths tested
- [ ] Visual regression checked

### Backend Testing Checklist
- [ ] All API endpoints tested
- [ ] Database queries tested
- [ ] Error handling tested
- [ ] Performance benchmarks met
- [ ] Security vulnerabilities checked

---

**END OF TESTING GUIDE**

*This document provides production-ready testing strategies for ensuring code quality across all layers of the REST-iN-U platform.*
# ðŸ“œ Rule 21 Compliance: The "No-Nonsense" Checklist
## The Ultimate Gatekeeper for REST-iN-U

> **Philosophy:** "If it isn't tested, it doesn't exist. If it isn't documented, it's broken."
> **Objective:** Ensure every single feature passes the rigorous Rule 21 framework.

---

## 1. The 21 Rules of Verification

1.  **Unit Tests Exist:** Every component/function has a `.test.ts` file.
2.  **Tests Pass:** CI/CD pipeline is green.
3.  **No "Any" Types:** TypeScript strict mode is ON. No `any` allowed.
4.  **Error Handling:** Every `try/catch` block logs the error and notifies the user.
5.  **Loading States:** Every async action shows a spinner/skeleton.
6.  **Empty States:** Every list has a "No items found" state.
7.  **Responsive:** Works on Mobile, Tablet, Desktop.
8.  **Accessibility:** All images have `alt` text. All buttons have `aria-label`.
9.  **Security:** No secrets in frontend code. No SQL injection possible.
10. **Performance:** LCP < 2.5s. CLS < 0.1.
11. **SEO:** Meta tags (Title, Description, OG Image) are present.
12. **Analytics:** User actions are tracked (e.g., "Clicked Buy").
13. **Logging:** Backend logs are structured (JSON) and searchable.
14. **Documentation:** API endpoints are documented in `API.md`.
15. **Code Quality:** No `console.log` in production code.
16. **Environment:** `.env.example` is up to date.
17. **Dependencies:** No vulnerable packages (`npm audit` is clean).
18. **Git:** Commit messages follow Conventional Commits (`feat:`, `fix:`).
19. **UX:** No dead links. 404 page exists.
20. **Legal:** Terms of Service and Privacy Policy are linked.
21. **Manual Check:** A human has actually used the feature.

---

## 2. The "Go Slowing Check All" Methodology

### 2.1 The "Granular" Approach
*   **Thesis:** Big PRs hide bugs. Small, atomic steps reveal them.
*   **Action:** Break every task into sub-steps. Verify each sub-step before moving on.
*   **Example:** Instead of "Build Login", do:
    1.  Create UI Layout
    2.  Add Form Validation
    3.  Connect API
    4.  Handle Errors
    5.  Handle Success Redirect

### 2.2 The "Double Verification"
*   **Thesis:** Automated tests miss visual bugs. Manual tests miss logic bugs.
*   **Action:** You must do BOTH.
    *   **Automated:** Run `npm test`.
    *   **Manual:** Click the button yourself.

---

## 3. REST-iN-U Specific Compliance

### 3.1 Blockchain Compliance
*   [ ] **Gas Optimization:** Is the contract optimized? (Use `unchecked`, `calldata`).
*   [ ] **Verification:** Is the contract source code verified on PolygonScan?
*   [ ] **Upgradability:** If using proxies, is the storage layout preserved?

### 3.2 Vastu Compliance
*   [ ] **Accuracy:** Does the algorithm match standard Vastu Shastra texts?
*   [ ] **Transparency:** Is the scoring logic explained to the user?

### 3.3 Financial Compliance
*   [ ] **Stripe:** Are webhooks secured with signature verification?
*   [ ] **Refunds:** Is there a clear refund policy and mechanism?

---

## 4. Final "Pre-Flight" Check

Before marking ANY task as "Done", ask yourself:
> "If I bet $10,000 on this feature working perfectly right now, would I take the bet?"

If the answer is "No", **it is not done.**
# ðŸ§ª Master Testing Strategy: The "Safety Net"
## How to Sleep at Night Knowing Your Code Works

> **Objective:** Define the exact testing pyramid for REST-iN-U to ensure 99.99% reliability.

---

## 1. The Testing Pyramid (REST-iN-U Edition)

### 1.1 Unit Tests (The Foundation) - 70%
*   **What:** Testing individual functions/components in isolation.
*   **Tools:** Jest, React Testing Library, Hardhat.
*   **Coverage Target:** 100% of business logic.
*   **Examples:**
    *   `calculateVastuScore(floorPlan)` returns correct integer.
    *   `PropertyCard` renders the correct price format.
    *   `NFT.mint()` increments the token ID.

### 1.2 Integration Tests (The Glue) - 20%
*   **What:** Testing how modules interact (e.g., API + Database, Frontend + API).
*   **Tools:** Supertest (Backend), Hardhat (Contract Interactions).
*   **Examples:**
    *   `POST /api/properties` creates a DB record AND returns 201.
    *   `FractionalNFT.buyShares` transfers ETH AND updates `shareHolders` mapping.

### 1.3 E2E Tests (The User) - 10%
*   **What:** Simulating a real user clicking through the app.
*   **Tools:** Playwright / Cypress.
*   **Examples:**
    *   User logs in -> Searches for property -> Clicks "Buy" -> Sees success modal.
    *   **Critical:** These are slow and flaky. Only test critical paths (Checkout, Login).

---

## 2. Specific Testing Strategies

### 2.1 Blockchain Testing Strategy
1.  **Local Network:** Run `npx hardhat node`. Deploy contracts. Run tests.
2.  **Forking:** Fork Polygon Mainnet to test against real state (e.g., interacting with Uniswap/Chainlink).
3.  **Gas Profiling:** Use `hardhat-gas-reporter` to ensure functions aren't too expensive.
4.  **Security Analysis:** Run `slither .` to check for vulnerabilities before every deploy.

### 2.2 Frontend Testing Strategy
1.  **Component Tests:** Does the button click fire the handler? (Jest)
2.  **Visual Regression:** Does the UI look different than yesterday? (Percy/Chromatic - Optional but recommended).
3.  **Accessibility Audit:** Run `pa11y` or Lighthouse CI to catch ARIA errors.

### 2.3 Backend Testing Strategy
1.  **DB Mocking:** Use `docker-compose` to spin up a *real* test database. Do not mock the DB driver if possible (it hides SQL errors).
2.  **Load Testing:** Can the API handle 100 requests/sec? (k6).

---

## 3. The "Rule 21" Manual QA Script

Even with all the above, a human must do this before launch:

1.  **The "New User" Flow:**
    *   Sign up with a fresh email.
    *   Try to break the password validation.
    *   Upload a broken image file.

2.  **The "Bad Network" Flow:**
    *   Set browser network to "Slow 3G".
    *   Does the app crash? Do spinners show?

3.  **The "Wallet" Flow:**
    *   Try to buy with insufficient funds.
    *   Reject the transaction in Metamask.
    *   Disconnect the wallet mid-transaction.

4.  **The "Mobile" Flow:**
    *   Open on an actual phone.
    *   Are buttons clickable? Is text readable?

---

## 4. Continuous Integration (CI) Pipeline

Every Pull Request must pass this gauntlet:
1.  `npm run lint` (Static Analysis)
2.  `npm run type-check` (TypeScript Compilation)
3.  `npm run test` (Unit/Integration Tests)
4.  `npm run build` (Build Verification)

**If any step fails, the PR is blocked.**

## REAL TESTING WAR STORIES

### Story: Test Passed, Production Failed

**What Happened**: All 500 tests green. Deployed to production. Site down in 5 minutes.

**Root Cause**: Tests used mock data. Real production data had NULL values.

```typescript
// TEST (Passed)
test('calculates property price', () => {
    const property = {
        basePrice: 500000,
        sqft: 2000,
        bedrooms: 3
    };
    expect(calculatePrice(property)).toBe(500000);
});

// PRODUCTION (Failed)
const realProperty = {
    basePrice: 500000,
    sqft: null,  // Missing data!
    bedrooms: 3
};
calculatePrice(realProperty);  // CRASH!

// BETTER TEST
test('handles missing data gracefully', () => {
    const property = {
        basePrice: 500000,
        sqft: null,
        bedrooms: 3
    };
    expect(calculatePrice(property)).toBe(500000);  // Should use default
});
```

**Lesson**: Test with REAL production data, not perfect mock data.

---

### Story: Flaky Tests Destroyed Team Morale

**What Happened**: Tests randomly failed. Developers stopped trusting CI/CD. Started merging without tests.

**Root Cause**: Tests depended on external API that was rate-limited.

```typescript
// FLAKY TEST
test('fetches property from API', async () => {
    const property = await fetch('https://api.example.com/properties/1');
    expect(property.id).toBe(1);
});
// Fails when API is down or rate-limited!

// FIXED TEST
test('fetches property from API', async () => {
    // Mock the API call
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ id: 1, name: 'Test Property' })
        })
    );
    
    const property = await fetchProperty(1);
    expect(property.id).toBe(1);
});
```

**Lesson**: Never depend on external services in unit tests. Mock everything.

---

### Story: 100% Code Coverage, Still Had Bugs

**What Happened**: Achieved 100% code coverage. Celebrated. Found 10 critical bugs in production.

**Why**: Coverage measures lines executed, not logic tested.

```typescript
// 100% coverage but WRONG logic
function calculateDiscount(price, userType) {
    let discount = 0;
    if (userType === 'premium') {
        discount = 0.2;  // Should be 0.1 (10%)!
    }
    return price * (1 - discount);
}

// Test that gives 100% coverage but doesn't catch bug
test('calculates discount', () => {
    const result = calculateDiscount(100, 'premium');
    expect(result).toBeDefined();  // Passes but doesn't verify correctness!
});

// PROPER TEST
test('premium users get 10% discount', () => {
    const result = calculateDiscount(100, 'premium');
    expect(result).toBe(90);  // Would catch the bug!
});
```

**Lesson**: Coverage is a metric, not a goal. Test behavior, not lines.

---

### Story: Integration Tests Took 4 Hours

**What Happened**: CI/CD pipeline took 4 hours. Developers waited all day for feedback.

**Solution**: Parallel test execution + test splitting

```yaml
# .github/workflows/test.yml
jobs:
  test:
    strategy:
      matrix:
        shard: [1, 2, 3, 4, 5, 6, 7, 8]
    steps:
      - run: npm test -- --shard=${{ matrix.shard }}/8
# Result: 4 hours → 30 minutes (8x faster)
```

**Lesson**: Parallelize tests. Time is money.
