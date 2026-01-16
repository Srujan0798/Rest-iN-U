
import { test, expect } from '@playwright/test';

test('verify astrology match page and chat widget', async ({ page }) => {
  // 1. Go to the Astrology Match Page
  await page.goto('/astrology/match');

  // 2. Verify Page Title
  await expect(page.getByText('Cosmic Property Match')).toBeVisible();

  // 3. Verify Form Fields
  await expect(page.getByLabel('Date of Birth')).toBeVisible();

  // 4. Fill Form
  await page.getByLabel('Date of Birth').fill('1990-01-01');
  await page.getByLabel('Time of Birth').fill('12:00');
  await page.getByLabel('Place of Birth').fill('New Delhi');
  await page.getByLabel('Construction/Foundation Date').fill('2023-01-01');

  // 5. Submit Form
  await page.getByRole('button', { name: 'Calculate Cosmic Compatibility' }).click();

  // 6. Verify Results appear (using mock or real response)
  // Wait for score to appear
  await expect(page.getByText('Cosmic Compatibility Score')).toBeVisible({ timeout: 10000 });

  // Take screenshot of results
  await page.screenshot({ path: 'frontend/tests/verification/astrology_match.png', fullPage: true });

  // 7. Verify Chat Widget
  const chatButton = page.locator('button.fixed.bottom-6.right-6');
  await expect(chatButton).toBeVisible();
  await chatButton.click();
  await expect(page.getByText('Rest-iN-U Support')).toBeVisible();
  await page.screenshot({ path: 'frontend/tests/verification/chat_widget.png' });
});
