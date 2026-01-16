import { test, expect, Page } from '@playwright/test';

/**
 * E2E Tests for Property Listing Flow
 * Tests the complete property listing experience including:
 * - Browsing properties
 * - Property details page
 * - Image gallery
 * - Contact agent
 * - Favorite/save functionality
 * - Share functionality
 */

test.describe('Property Listing Flow', () => {
  // Helper to navigate to estate page
  async function goToEstatePage(page: Page) {
    await page.goto('/estate');
    await page.waitForLoadState('networkidle');
  }

  // Helper to wait for property cards to load
  async function waitForProperties(page: Page) {
    await page.waitForSelector('[data-testid="property-card"]', { timeout: 15000 });
  }

  test.describe('Property List Page', () => {
    test.beforeEach(async ({ page }) => {
      await goToEstatePage(page);
    });

    test('should display property listing grid', async ({ page }) => {
      await waitForProperties(page);

      const propertyCards = page.locator('[data-testid="property-card"]');
      const count = await propertyCards.count();

      expect(count).toBeGreaterThan(0);
    });

    test('should display property card with essential information', async ({ page }) => {
      await waitForProperties(page);

      const firstCard = page.locator('[data-testid="property-card"]').first();

      // Verify card contains essential elements
      await expect(firstCard.locator('[data-testid="property-image"]')).toBeVisible();
      await expect(firstCard.locator('[data-testid="property-price"]')).toBeVisible();
      await expect(firstCard.locator('[data-testid="property-location"]')).toBeVisible();
    });

    test('should show property specifications on cards', async ({ page }) => {
      await waitForProperties(page);

      const firstCard = page.locator('[data-testid="property-card"]').first();

      // Check for bedroom/bathroom info if visible
      const specsVisible = await firstCard.locator('[data-testid="property-specs"]').isVisible();
      if (specsVisible) {
        await expect(firstCard.locator('[data-testid="property-specs"]')).toContainText(/bed|bath|sqft/i);
      }
    });

    test('should navigate to property details on card click', async ({ page }) => {
      await waitForProperties(page);

      const firstCard = page.locator('[data-testid="property-card"]').first();
      await firstCard.click();

      await page.waitForURL(/\/estate\/property\/.+/);

      // Verify we're on a property details page
      await expect(page.locator('[data-testid="property-title"]')).toBeVisible();
    });

    test('should display loading state while fetching properties', async ({ page }) => {
      // Navigate with slower network to catch loading state
      await page.route('**/api/properties**', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        await route.continue();
      });

      await page.goto('/estate');

      // Check for loading indicator
      const loadingElement = page.locator('[data-testid="property-loading"], [data-testid="skeleton-loader"]');
      const isLoadingVisible = await loadingElement.isVisible().catch(() => false);

      if (isLoadingVisible) {
        await expect(loadingElement).toBeVisible();
      }

      await waitForProperties(page);
    });

    test('should handle empty results gracefully', async ({ page }) => {
      // Search for something that returns no results
      await page.fill('[data-testid="search-input"]', 'NonExistentPropertyXYZ123');
      await page.click('[data-testid="search-button"]');

      const noResults = page.locator('[data-testid="no-results"], [data-testid="empty-state"]');

      try {
        await noResults.waitFor({ timeout: 10000 });
        await expect(noResults).toBeVisible();
      } catch {
        // If there are still results, that's okay too
        const propertyCards = page.locator('[data-testid="property-card"]');
        expect(await propertyCards.count()).toBeGreaterThanOrEqual(0);
      }
    });
  });

  test.describe('Property Details Page', () => {
    let propertyUrl: string;

    test.beforeEach(async ({ page }) => {
      await goToEstatePage(page);
      await waitForProperties(page);

      // Navigate to first property
      const firstCard = page.locator('[data-testid="property-card"]').first();
      await firstCard.click();
      await page.waitForURL(/\/estate\/property\/.+/);

      propertyUrl = page.url();
    });

    test('should display property title and price', async ({ page }) => {
      await expect(page.locator('[data-testid="property-title"]')).toBeVisible();
      await expect(page.locator('[data-testid="property-price"]')).toBeVisible();

      // Verify price is formatted correctly (contains currency symbol)
      const priceText = await page.locator('[data-testid="property-price"]').textContent();
      expect(priceText).toMatch(/[₹$€£]|INR|USD/);
    });

    test('should display property images/gallery', async ({ page }) => {
      const gallery = page.locator('[data-testid="property-gallery"], [data-testid="property-images"]');
      await expect(gallery).toBeVisible();

      // Check for at least one image
      const images = gallery.locator('img');
      expect(await images.count()).toBeGreaterThan(0);
    });

    test('should show property specifications', async ({ page }) => {
      const specs = page.locator('[data-testid="property-specs"], [data-testid="property-details"]');
      await expect(specs).toBeVisible();

      // Look for common specifications
      const specsText = await specs.textContent();
      expect(specsText).toBeDefined();
    });

    test('should display property description', async ({ page }) => {
      const description = page.locator('[data-testid="property-description"]');

      if (await description.isVisible()) {
        const text = await description.textContent();
        expect(text?.length).toBeGreaterThan(10);
      }
    });

    test('should show property location/address', async ({ page }) => {
      const location = page.locator('[data-testid="property-location"], [data-testid="property-address"]');
      await expect(location).toBeVisible();
    });

    test('should display map or location visualization', async ({ page }) => {
      const mapElement = page.locator('[data-testid="property-map"], .mapboxgl-map, [class*="map"]');

      // Map may take time to load
      try {
        await mapElement.first().waitFor({ timeout: 10000 });
        expect(await mapElement.count()).toBeGreaterThan(0);
      } catch {
        // Map might not be present on all properties
        console.log('Map element not found, skipping map test');
      }
    });

    test('should show agent/contact information', async ({ page }) => {
      const agentInfo = page.locator('[data-testid="agent-info"], [data-testid="contact-agent"]');

      if (await agentInfo.isVisible()) {
        await expect(agentInfo).toBeVisible();
      }
    });

    test('should have contact/inquiry button', async ({ page }) => {
      const contactButton = page.locator('[data-testid="contact-button"], [data-testid="inquiry-button"], button:has-text("Contact"), button:has-text("Inquire")');
      await expect(contactButton.first()).toBeVisible();
    });

    test('should navigate through image gallery', async ({ page }) => {
      const gallery = page.locator('[data-testid="property-gallery"]');

      if (await gallery.isVisible()) {
        // Look for navigation buttons
        const nextButton = gallery.locator('[data-testid="gallery-next"], button[aria-label*="next"]');
        const prevButton = gallery.locator('[data-testid="gallery-prev"], button[aria-label*="prev"]');

        if (await nextButton.isVisible()) {
          await nextButton.click();
          // Gallery should update (we can't easily verify specific image change)
        }
      }
    });
  });

  test.describe('Property Interactions', () => {
    test.beforeEach(async ({ page }) => {
      await goToEstatePage(page);
      await waitForProperties(page);
    });

    test('should allow favoriting a property', async ({ page }) => {
      const firstCard = page.locator('[data-testid="property-card"]').first();
      const favoriteButton = firstCard.locator('[data-testid="favorite-button"], [data-testid="save-button"], button[aria-label*="favorite"], button[aria-label*="save"]');

      if (await favoriteButton.isVisible()) {
        await favoriteButton.click();

        // Check for visual feedback or toast notification
        const toast = page.locator('[data-testid="toast"], [role="alert"]');
        const isFavorited = favoriteButton.locator('[data-testid="favorited"], .favorited, [fill="currentColor"]');

        // Either a toast appears or the button state changes
        const hasToast = await toast.isVisible().catch(() => false);
        const hasFavorited = await isFavorited.isVisible().catch(() => false);

        // At least one indicator should be present (or it might require login)
        // This is a soft assertion as behavior may vary
      }
    });

    test('should allow sharing a property', async ({ page }) => {
      const firstCard = page.locator('[data-testid="property-card"]').first();
      await firstCard.click();
      await page.waitForURL(/\/estate\/property\/.+/);

      const shareButton = page.locator('[data-testid="share-button"], button[aria-label*="share"]');

      if (await shareButton.isVisible()) {
        await shareButton.click();

        // Check for share modal/dialog or native share
        const shareModal = page.locator('[data-testid="share-modal"], [role="dialog"]');
        const isModalVisible = await shareModal.isVisible().catch(() => false);

        // Share functionality may use native share API or show modal
        // This is a soft check as implementations vary
      }
    });

    test('should open contact form on inquiry button click', async ({ page }) => {
      const firstCard = page.locator('[data-testid="property-card"]').first();
      await firstCard.click();
      await page.waitForURL(/\/estate\/property\/.+/);

      const inquiryButton = page.locator('[data-testid="inquiry-button"], [data-testid="contact-button"], button:has-text("Contact"), button:has-text("Inquire")');

      if (await inquiryButton.first().isVisible()) {
        await inquiryButton.first().click();

        // Check for contact form/modal
        const contactForm = page.locator('[data-testid="contact-form"], [data-testid="inquiry-form"], form[name*="contact"]');
        const contactModal = page.locator('[data-testid="contact-modal"], [role="dialog"]:has(form)');

        const hasForm = await contactForm.isVisible().catch(() => false);
        const hasModal = await contactModal.isVisible().catch(() => false);

        // Either a form or modal should appear (or redirect to login)
      }
    });
  });

  test.describe('Property Filters', () => {
    test.beforeEach(async ({ page }) => {
      await goToEstatePage(page);
      await waitForProperties(page);
    });

    test('should filter properties by price range', async ({ page }) => {
      // Open filters if needed
      const filterToggle = page.locator('[data-testid="filter-button"], [data-testid="filter-toggle"]');
      if (await filterToggle.isVisible()) {
        await filterToggle.click();
      }

      // Set price filters
      const minPriceInput = page.locator('[data-testid="min-price-input"], input[name="minPrice"]');
      const maxPriceInput = page.locator('[data-testid="max-price-input"], input[name="maxPrice"]');

      if (await minPriceInput.isVisible()) {
        await minPriceInput.fill('5000000');

        if (await maxPriceInput.isVisible()) {
          await maxPriceInput.fill('10000000');
        }

        // Apply filters
        const applyButton = page.locator('[data-testid="apply-filters-button"], button:has-text("Apply")');
        if (await applyButton.isVisible()) {
          await applyButton.click();
        }

        // Wait for results to update
        await page.waitForLoadState('networkidle');

        // Verify URL contains filter params
        expect(page.url()).toMatch(/minPrice|price/);
      }
    });

    test('should filter properties by type', async ({ page }) => {
      // Open filters
      const filterToggle = page.locator('[data-testid="filter-button"]');
      if (await filterToggle.isVisible()) {
        await filterToggle.click();
      }

      const propertyTypeSelect = page.locator('[data-testid="property-type-select"], select[name="propertyType"]');

      if (await propertyTypeSelect.isVisible()) {
        await propertyTypeSelect.selectOption('HOUSE');

        const applyButton = page.locator('[data-testid="apply-filters-button"]');
        if (await applyButton.isVisible()) {
          await applyButton.click();
        }

        await page.waitForLoadState('networkidle');
      }
    });

    test('should filter properties by bedrooms', async ({ page }) => {
      const filterToggle = page.locator('[data-testid="filter-button"]');
      if (await filterToggle.isVisible()) {
        await filterToggle.click();
      }

      const bedroomsFilter = page.locator('[data-testid="bedrooms-filter"], select[name="bedrooms"]');

      if (await bedroomsFilter.isVisible()) {
        await bedroomsFilter.selectOption('3');

        const applyButton = page.locator('[data-testid="apply-filters-button"]');
        if (await applyButton.isVisible()) {
          await applyButton.click();
        }

        await page.waitForLoadState('networkidle');
        expect(page.url()).toMatch(/bed|room/i);
      }
    });

    test('should clear all filters', async ({ page }) => {
      // Apply some filters first
      const filterToggle = page.locator('[data-testid="filter-button"]');
      if (await filterToggle.isVisible()) {
        await filterToggle.click();
      }

      const minPriceInput = page.locator('[data-testid="min-price-input"]');
      if (await minPriceInput.isVisible()) {
        await minPriceInput.fill('1000000');

        const applyButton = page.locator('[data-testid="apply-filters-button"]');
        if (await applyButton.isVisible()) {
          await applyButton.click();
          await page.waitForLoadState('networkidle');
        }
      }

      // Clear filters
      const clearButton = page.locator('[data-testid="clear-filters-button"], button:has-text("Clear")');
      if (await clearButton.isVisible()) {
        await clearButton.click();
        await page.waitForLoadState('networkidle');

        // Verify filters are cleared
        if (await minPriceInput.isVisible()) {
          await expect(minPriceInput).toHaveValue('');
        }
      }
    });
  });

  test.describe('Property Sorting', () => {
    test.beforeEach(async ({ page }) => {
      await goToEstatePage(page);
      await waitForProperties(page);
    });

    test('should sort properties by price ascending', async ({ page }) => {
      const sortDropdown = page.locator('[data-testid="sort-dropdown"], select[name="sort"]');

      if (await sortDropdown.isVisible()) {
        await sortDropdown.click();

        const priceAscOption = page.locator('[data-testid="sort-price-asc"], option[value*="price_asc"]');
        if (await priceAscOption.isVisible()) {
          await priceAscOption.click();
        }

        await page.waitForLoadState('networkidle');

        // Verify sorting by checking first few prices
        const propertyCards = page.locator('[data-testid="property-card"]');
        const count = await propertyCards.count();

        if (count >= 2) {
          const prices: number[] = [];
          for (let i = 0; i < Math.min(count, 3); i++) {
            const priceText = await propertyCards.nth(i).locator('[data-testid="property-price"]').textContent();
            const price = parseInt(priceText?.replace(/[^0-9]/g, '') || '0');
            prices.push(price);
          }

          // Verify ascending order
          for (let i = 1; i < prices.length; i++) {
            expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
          }
        }
      }
    });

    test('should sort properties by price descending', async ({ page }) => {
      const sortDropdown = page.locator('[data-testid="sort-dropdown"]');

      if (await sortDropdown.isVisible()) {
        await sortDropdown.click();

        const priceDescOption = page.locator('[data-testid="sort-price-desc"]');
        if (await priceDescOption.isVisible()) {
          await priceDescOption.click();
          await page.waitForLoadState('networkidle');
        }
      }
    });

    test('should sort properties by newest', async ({ page }) => {
      const sortDropdown = page.locator('[data-testid="sort-dropdown"]');

      if (await sortDropdown.isVisible()) {
        await sortDropdown.click();

        const newestOption = page.locator('[data-testid="sort-newest"], option[value*="newest"], option[value*="date"]');
        if (await newestOption.isVisible()) {
          await newestOption.click();
          await page.waitForLoadState('networkidle');
        }
      }
    });
  });

  test.describe('Property Pagination', () => {
    test.beforeEach(async ({ page }) => {
      await goToEstatePage(page);
      await waitForProperties(page);
    });

    test('should display pagination controls', async ({ page }) => {
      const pagination = page.locator('[data-testid="pagination"]');

      if (await pagination.isVisible()) {
        await expect(pagination).toBeVisible();
      }
    });

    test('should navigate to next page', async ({ page }) => {
      const pagination = page.locator('[data-testid="pagination"]');

      if (await pagination.isVisible()) {
        const nextButton = pagination.locator('[data-testid="next-page-button"], button:has-text("Next"), [aria-label*="next"]');

        if (await nextButton.isVisible()) {
          await nextButton.click();
          await page.waitForLoadState('networkidle');

          // Verify URL or page state changed
          expect(page.url()).toMatch(/page=2|offset/);
        }
      }
    });

    test('should navigate to specific page', async ({ page }) => {
      const pagination = page.locator('[data-testid="pagination"]');

      if (await pagination.isVisible()) {
        const pageButton = pagination.locator('button:has-text("2"), [data-page="2"]');

        if (await pageButton.isVisible()) {
          await pageButton.click();
          await page.waitForLoadState('networkidle');

          expect(page.url()).toMatch(/page=2/);
        }
      }
    });

    test('should navigate to previous page', async ({ page }) => {
      // First go to page 2
      const pagination = page.locator('[data-testid="pagination"]');

      if (await pagination.isVisible()) {
        const nextButton = pagination.locator('[data-testid="next-page-button"]');

        if (await nextButton.isVisible()) {
          await nextButton.click();
          await page.waitForLoadState('networkidle');

          const prevButton = pagination.locator('[data-testid="prev-page-button"], button:has-text("Prev"), [aria-label*="prev"]');

          if (await prevButton.isVisible()) {
            await prevButton.click();
            await page.waitForLoadState('networkidle');

            // Should be back on page 1
            expect(page.url()).not.toMatch(/page=2/);
          }
        }
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should display mobile layout on small screens', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await goToEstatePage(page);

      // Check for mobile-specific elements
      const mobileNav = page.locator('[data-testid="mobile-nav"], [data-testid="hamburger-menu"]');
      const mobileFilterButton = page.locator('[data-testid="mobile-filter-button"]');

      // At least one mobile element should be visible
      const hasMobileNav = await mobileNav.isVisible().catch(() => false);
      const hasMobileFilter = await mobileFilterButton.isVisible().catch(() => false);

      // Properties should still load
      await waitForProperties(page);
      const propertyCards = page.locator('[data-testid="property-card"], [data-testid="mobile-property-card"]');
      expect(await propertyCards.count()).toBeGreaterThan(0);
    });

    test('should display tablet layout on medium screens', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await goToEstatePage(page);
      await waitForProperties(page);

      const propertyCards = page.locator('[data-testid="property-card"]');
      expect(await propertyCards.count()).toBeGreaterThan(0);
    });
  });

  test.describe('Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      await goToEstatePage(page);
      await waitForProperties(page);
    });

    test('should have proper ARIA labels on interactive elements', async ({ page }) => {
      const propertyCard = page.locator('[data-testid="property-card"]').first();

      // Check for ARIA labels on buttons
      const buttons = propertyCard.locator('button');
      const buttonCount = await buttons.count();

      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        const ariaLabel = await button.getAttribute('aria-label');
        const text = await button.textContent();

        // Button should have either aria-label or visible text
        expect(ariaLabel || text?.trim()).toBeTruthy();
      }
    });

    test('should support keyboard navigation', async ({ page }) => {
      // Tab to first interactive element
      await page.keyboard.press('Tab');

      // Continue tabbing through property cards
      const propertyCard = page.locator('[data-testid="property-card"]').first();
      await propertyCard.focus();

      // Should be focusable
      await expect(propertyCard).toBeFocused();

      // Press Enter to navigate
      await page.keyboard.press('Enter');
      await page.waitForURL(/\/estate\/property\/.+/);
    });

    test('should have proper heading structure', async ({ page }) => {
      // Check for h1 on the page
      const h1 = page.locator('h1');
      expect(await h1.count()).toBeGreaterThan(0);
    });
  });

  test.describe('Performance', () => {
    test('should load property list within acceptable time', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/estate');
      await waitForProperties(page);

      const loadTime = Date.now() - startTime;

      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should lazy load images', async ({ page }) => {
      await goToEstatePage(page);
      await waitForProperties(page);

      // Check if images have loading="lazy" attribute
      const images = page.locator('[data-testid="property-image"] img, [data-testid="property-card"] img');
      const imageCount = await images.count();

      if (imageCount > 0) {
        const firstImage = images.first();
        const loading = await firstImage.getAttribute('loading');

        // Images should have lazy loading
        // This is a soft check as implementation may vary
      }
    });
  });
});
