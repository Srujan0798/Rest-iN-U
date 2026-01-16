import { test, expect } from "@playwright/test";

test.describe("Property Search Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/estate");
  });

  test("should search for properties and display results", async ({ page }) => {
    // Find search input and enter search query
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill("Bangalore");

    // Click search button
    const searchButton = page.locator('[data-testid="search-button"]');
    await searchButton.click();

    // Wait for results to load
    await page.waitForSelector('[data-testid="property-card"]');

    // Verify results are displayed
    const propertyCards = page.locator('[data-testid="property-card"]');
    await expect(propertyCards).toHaveCount(20); // Default limit

    // Verify search query is maintained
    await expect(searchInput).toHaveValue("Bangalore");
  });

  test("should filter properties by price range", async ({ page }) => {
    // Apply price filter
    await page.click('[data-testid="filter-button"]');

    // Set minimum price
    await page.fill('[data-testid="min-price-input"]', "5000000");

    // Set maximum price
    await page.fill('[data-testid="max-price-input"]', "10000000");

    // Apply filters
    await page.click('[data-testid="apply-filters-button"]');

    // Wait for filtered results
    await page.waitForSelector('[data-testid="property-card"]');

    // Verify results are within price range
    const propertyCards = page.locator('[data-testid="property-card"]');
    const count = await propertyCards.count();

    if (count > 0) {
      // Check first few properties to ensure they're in range
      for (let i = 0; i < Math.min(count, 3); i++) {
        const card = propertyCards.nth(i);
        const priceText = await card
          .locator('[data-testid="property-price"]')
          .textContent();
        const price = parseInt(priceText?.replace(/[^0-9]/g, "") || "0");
        expect(price).toBeGreaterThanOrEqual(5000000);
        expect(price).toBeLessThanOrEqual(10000000);
      }
    }
  });

  test("should filter properties by property type", async ({ page }) => {
    // Apply property type filter
    await page.click('[data-testid="filter-button"]');

    // Select 'House' property type
    await page.selectOption('[data-testid="property-type-select"]', "HOUSE");

    // Apply filters
    await page.click('[data-testid="apply-filters-button"]');

    // Wait for filtered results
    await page.waitForSelector('[data-testid="property-card"]');

    // Verify all results are houses
    const propertyCards = page.locator('[data-testid="property-card"]');
    const count = await propertyCards.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const card = propertyCards.nth(i);
        const propertyType = await card
          .locator('[data-testid="property-type"]')
          .textContent();
        expect(propertyType?.toLowerCase()).toContain("house");
      }
    }
  });

  test("should paginate through results", async ({ page }) => {
    // Search with enough results to trigger pagination
    await page.fill('[data-testid="search-input"]', "House");
    await page.click('[data-testid="search-button"]');

    await page.waitForSelector('[data-testid="property-card"]');

    // Check if pagination is present
    const pagination = page.locator('[data-testid="pagination"]');
    if (await pagination.isVisible()) {
      // Click next page
      await page.click('[data-testid="next-page-button"]');

      // Wait for page to load
      await page.waitForLoadState("networkidle");

      // Verify URL has page parameter
      expect(page.url()).toContain("page=2");

      // Verify results are different from first page
      const propertyCards = page.locator('[data-testid="property-card"]');
      await expect(propertyCards).toHaveCount(20);
    }
  });

  test("should sort results by price", async ({ page }) => {
    // Search first to get results
    await page.fill('[data-testid="search-input"]', "Bangalore");
    await page.click('[data-testid="search-button"]');

    await page.waitForSelector('[data-testid="property-card"]');

    // Sort by price (low to high)
    await page.click('[data-testid="sort-dropdown"]');
    await page.click('[data-testid="sort-price-asc"]');

    await page.waitForLoadState("networkidle");

    // Verify price sorting
    const propertyCards = page.locator('[data-testid="property-card"]');
    const prices: number[] = [];

    for (let i = 0; i < Math.min(await propertyCards.count(), 5); i++) {
      const card = propertyCards.nth(i);
      const priceText = await card
        .locator('[data-testid="property-price"]')
        .textContent();
      const price = parseInt(priceText?.replace(/[^0-9]/g, "") || "0");
      prices.push(price);
    }

    // Verify prices are in ascending order
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });

  test("should clear filters", async ({ page }) => {
    // Apply some filters
    await page.click('[data-testid="filter-button"]');
    await page.fill('[data-testid="min-price-input"]', "5000000");
    await page.selectOption('[data-testid="property-type-select"]', "HOUSE");
    await page.click('[data-testid="apply-filters-button"]');

    await page.waitForSelector('[data-testid="property-card"]');

    // Clear filters
    await page.click('[data-testid="clear-filters-button"]');

    // Verify filters are cleared
    await expect(page.locator('[data-testid="min-price-input"]')).toHaveValue(
      "",
    );
    await expect(
      page.locator('[data-testid="property-type-select"]'),
    ).toHaveValue("");

    // Verify results update
    await page.waitForLoadState("networkidle");
    const propertyCards = page.locator('[data-testid="property-card"]');
    await expect(propertyCards).toHaveCount(20); // Should return to default results
  });

  test("should handle no results gracefully", async ({ page }) => {
    // Search for something that likely has no results
    await page.fill('[data-testid="search-input"]', "NonExistentProperty12345");
    await page.click('[data-testid="search-button"]');

    // Wait for no results message
    await page.waitForSelector('[data-testid="no-results"]', {
      timeout: 10000,
    });

    // Verify no results message is displayed
    await expect(page.locator('[data-testid="no-results"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="no-results-message"]'),
    ).toContainText("no properties found");

    // Verify suggestions are shown
    await expect(
      page.locator('[data-testid="search-suggestions"]'),
    ).toBeVisible();
  });

  test("should maintain search state in URL", async ({ page }) => {
    // Perform search with filters
    await page.fill('[data-testid="search-input"]', "Bangalore");
    await page.click('[data-testid="filter-button"]');
    await page.fill('[data-testid="min-price-input"]', "5000000");
    await page.click('[data-testid="apply-filters-button"]');

    await page.waitForSelector('[data-testid="property-card"]');

    // Verify URL contains search parameters
    expect(page.url()).toContain("query=Bangalore");
    expect(page.url()).toContain("minPrice=5000000");

    // Reload page
    await page.reload();

    // Verify search state is maintained
    await expect(page.locator('[data-testid="search-input"]')).toHaveValue(
      "Bangalore",
    );
    await expect(page.locator('[data-testid="min-price-input"]')).toHaveValue(
      "5000000",
    );
  });

  test("should handle keyboard navigation", async ({ page }) => {
    // Focus search input
    await page.focus('[data-testid="search-input"]');

    // Type search query
    await page.keyboard.type("Bangalore");

    // Press Enter to search
    await page.keyboard.press("Enter");

    // Wait for results
    await page.waitForSelector('[data-testid="property-card"]');

    // Tab through results
    await page.keyboard.press("Tab");

    // Verify focus moves to first property card
    const firstCard = page.locator('[data-testid="property-card"]').first();
    await expect(firstCard).toBeFocused();
  });

  test("should display property details when clicking a property", async ({
    page,
  }) => {
    // Search for properties
    await page.fill('[data-testid="search-input"]', "Bangalore");
    await page.click('[data-testid="search-button"]');

    await page.waitForSelector('[data-testid="property-card"]');

    // Click first property
    const firstCard = page.locator('[data-testid="property-card"]').first();
    await firstCard.click();

    // Wait for navigation to property detail page
    await page.waitForURL(/\/estate\/property\/.+/);

    // Verify property detail page elements
    await expect(page.locator('[data-testid="property-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="property-price"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="property-gallery"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="property-details"]'),
    ).toBeVisible();
  });

  test("should show loading states during search", async ({ page }) => {
    // Start search
    await page.fill('[data-testid="search-input"]', "Bangalore");
    await page.click('[data-testid="search-button"]');

    // Check for loading indicator
    await expect(page.locator('[data-testid="search-loading"]')).toBeVisible();

    // Wait for loading to complete
    await page.waitForSelector('[data-testid="property-card"]');
    await expect(
      page.locator('[data-testid="search-loading"]'),
    ).not.toBeVisible();
  });

  test("should handle search suggestions/autocomplete", async ({ page }) => {
    // Type partial search query
    await page.fill('[data-testid="search-input"]', "Bang");

    // Wait for suggestions to appear
    await page.waitForSelector('[data-testid="search-suggestions"]');

    // Verify suggestions are displayed
    const suggestions = page.locator('[data-testid="suggestion-item"]');
    expect(await suggestions.count()).toBeGreaterThan(0);

    // Click on first suggestion
    await suggestions.first().click();

    // Verify search input is updated
    await expect(page.locator('[data-testid="search-input"]')).toHaveValue(
      /Bangalore/,
    );
  });

  test("should handle advanced filters correctly", async ({ page }) => {
    // Open advanced filters
    await page.click('[data-testid="filter-button"]');

    // Verify advanced filter options are visible
    await expect(
      page.locator('[data-testid="advanced-filters"]'),
    ).toBeVisible();
    await expect(page.locator('[data-testid="city-filter"]')).toBeVisible();
    await expect(page.locator('[data-testid="bedrooms-filter"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="bathrooms-filter"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="square-feet-filter"]'),
    ).toBeVisible();

    // Apply multiple filters
    await page.fill('[data-testid="city-filter"]', "Bangalore");
    await page.selectOption('[data-testid="bedrooms-filter"]', "3");
    await page.fill('[data-testid="square-feet-filter"]', "2000");

    // Apply filters
    await page.click('[data-testid="apply-filters-button"]');

    // Wait for filtered results
    await page.waitForSelector('[data-testid="property-card"]');

    // Verify URL contains all filter parameters
    expect(page.url()).toContain("city=Bangalore");
    expect(page.url()).toContain("minBedrooms=3");
    expect(page.url()).toContain("minSquareFeet=2000");
  });

  test("should handle mobile responsive design", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size

    // Verify mobile layout
    await expect(
      page.locator('[data-testid="mobile-search-bar"]'),
    ).toBeVisible();

    // Perform search on mobile
    const searchInput = page.locator('[data-testid="mobile-search-input"]');
    await searchInput.fill("Bangalore");
    await page.click('[data-testid="mobile-search-button"]');

    await page.waitForSelector('[data-testid="mobile-property-card"]');

    // Verify mobile results layout
    const mobileCards = page.locator('[data-testid="mobile-property-card"]');
    await expect(mobileCards).toHaveCount(20);

    // Test mobile filter drawer
    await page.click('[data-testid="mobile-filter-button"]');
    await expect(
      page.locator('[data-testid="mobile-filter-drawer"]'),
    ).toBeVisible();
  });

  test("should handle error states gracefully", async ({ page }) => {
    // Mock network error
    await page.route("**/api/properties**", (route) => route.abort());

    // Perform search
    await page.fill('[data-testid="search-input"]', "Bangalore");
    await page.click('[data-testid="search-button"]');

    // Wait for error state
    await page.waitForSelector('[data-testid="search-error"]', {
      timeout: 10000,
    });

    // Verify error message is displayed
    await expect(page.locator('[data-testid="search-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText(
      "Failed to load properties",
    );

    // Verify retry button is present
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
  });

  test("should maintain scroll position on back navigation", async ({
    page,
  }) => {
    // Search and scroll down
    await page.fill('[data-testid="search-input"]', "Bangalore");
    await page.click('[data-testid="search-button"]');

    await page.waitForSelector('[data-testid="property-card"]');

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 1000));

    // Click on a property
    const firstCard = page.locator('[data-testid="property-card"]').first();
    await firstCard.click();

    await page.waitForURL(/\/estate\/property\/.+/);

    // Go back
    await page.goBack();

    // Wait for search results to load
    await page.waitForSelector('[data-testid="property-card"]');

    // Verify scroll position is maintained
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(500); // Should be near where we left off
  });

  test("should handle accessibility requirements", async ({ page }) => {
    // Check for proper ARIA labels
    await expect(page.locator('[data-testid="search-input"]')).toHaveAttribute(
      "aria-label",
    );
    await expect(page.locator('[data-testid="search-button"]')).toHaveAttribute(
      "aria-label",
    );

    // Test keyboard navigation
    await page.keyboard.press("Tab");
    await expect(page.locator('[data-testid="search-input"]')).toBeFocused();

    // Check color contrast (basic check)
    const searchButton = page.locator('[data-testid="search-button"]');
    const styles = await searchButton.evaluate((el: HTMLElement) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
      };
    });

    // Ensure button has visible text or aria-label
    await expect(searchButton).toHaveAttribute("aria-label");
  });
});
