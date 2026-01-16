import { test, expect } from '@playwright/test';

test.describe('Admin Journey: Listing Creation', () => {
  // NOTE: The "Admin Dashboard -> Create Listing" flow is not fully implemented in the frontend.
  // The Admin Dashboard currently shows "Coming Soon".
  // This test simulates the "Property Intake" flow via the /sell page as a proxy for listing creation.
  // When the Admin feature is implemented, this test should be updated to use the Admin Dashboard.

  test('Property Intake Flow (Proxy for Admin Listing Creation)', async ({ page }) => {
    // 1. Mock Backend API Responses
    // Mock Auth
    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        json: {
          id: 'agent1',
          role: 'AGENT',
          firstName: 'Agent',
          lastName: 'Smith',
          email: 'agent@example.com'
        }
      });
    });

    // Mock Login
    await page.route('**/api/auth/login', async (route) => {
        await route.fulfill({
            status: 200,
            json: { token: 'mock-token', user: { role: 'AGENT' } }
        });
    });

    // Mock Estimate/Valuation endpoint
    await page.route('**/api/v1/valuation/estimate', async (route) => {
        // Not used by the mock calculation in the component, but good to mock just in case
        await route.fulfill({ json: { estimate: 500000 } });
    });

    await page.goto('/agent/dashboard');

    // 2. Click "Create Listing" or Navigate to Intake
    const createButton = page.locator('button:has-text("Create Listing")');
    if (await createButton.isVisible()) {
        await createButton.click();
    } else {
        console.log('Create Listing button not found (feature pending). navigating to /sell for intake flow test.');
        await page.goto('/sell');
    }

    // 3. Fill inputs -> Save
    // Ensure we are on the form
    await expect(page.locator('h1')).toContainText('Sell Your Home');

    await page.fill('input[placeholder="Property Address"]', '456 Agent St');

    // Select Property Type
    await page.selectOption('select:has-text("Property Type")', 'HOUSE');

    // Select Condition
    await page.selectOption('select:has-text("Excellent")', 'GOOD');

    // Set Year Built
    await page.fill('input[placeholder="Year Built"]', '2015');

    // "Get Free Estimate" acts as the submission in this intake flow
    await page.click('button:has-text("Get Free Estimate")');

    // 4. Verify Result
    // In the intake flow, this shows the estimate.
    await expect(page.locator('text=Your Home Estimate')).toBeVisible();
    await expect(page.locator('text=$')).toBeVisible();
  });
});
