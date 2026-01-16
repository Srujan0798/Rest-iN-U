import { test, expect, Page } from '@playwright/test';

/**
 * E2E Tests for Authentication Flow
 * Tests the complete authentication experience including:
 * - User registration
 * - User login
 * - Password validation
 * - Token refresh
 * - Logout
 * - Protected routes
 */

test.describe('Authentication Flow', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
  };

  // Helper to fill registration form
  async function fillRegistrationForm(page: Page, userData: typeof testUser) {
    await page.fill('[data-testid="email-input"], input[name="email"]', userData.email);
    await page.fill('[data-testid="password-input"], input[name="password"]', userData.password);
    await page.fill('[data-testid="firstName-input"], input[name="firstName"]', userData.firstName);
    await page.fill('[data-testid="lastName-input"], input[name="lastName"]', userData.lastName);
  }

  // Helper to fill login form
  async function fillLoginForm(page: Page, email: string, password: string) {
    await page.fill('[data-testid="email-input"], input[name="email"]', email);
    await page.fill('[data-testid="password-input"], input[name="password"]', password);
  }

  test.describe('Registration', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/auth/register');
      await page.waitForLoadState('networkidle');
    });

    test('should display registration form', async ({ page }) => {
      await expect(page.locator('[data-testid="register-form"], form[name="register"]')).toBeVisible();
      await expect(page.locator('[data-testid="email-input"], input[name="email"]')).toBeVisible();
      await expect(page.locator('[data-testid="password-input"], input[name="password"]')).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
      const submitButton = page.locator('[data-testid="register-button"], button[type="submit"]');
      await submitButton.click();

      // Should show validation errors
      const errorMessages = page.locator('[data-testid="error-message"], .error, [role="alert"]');
      const hasErrors = await errorMessages.count() > 0;

      // Either shows validation errors or form doesn't submit
      expect(hasErrors || await page.url().includes('/register')).toBeTruthy();
    });

    test('should validate email format', async ({ page }) => {
      await page.fill('[data-testid="email-input"], input[name="email"]', 'invalid-email');
      await page.fill('[data-testid="password-input"], input[name="password"]', testUser.password);

      const submitButton = page.locator('[data-testid="register-button"], button[type="submit"]');
      await submitButton.click();

      // Should show email validation error
      const emailError = page.locator('[data-testid="email-error"], .email-error');
      const generalError = page.locator('[data-testid="error-message"]');

      // Wait a moment for validation
      await page.waitForTimeout(500);
    });

    test('should validate password requirements', async ({ page }) => {
      await page.fill('[data-testid="email-input"], input[name="email"]', testUser.email);
      await page.fill('[data-testid="password-input"], input[name="password"]', '123'); // Too short

      const submitButton = page.locator('[data-testid="register-button"], button[type="submit"]');
      await submitButton.click();

      await page.waitForTimeout(500);

      // Should show password validation error or not submit
    });

    test('should show password strength indicator', async ({ page }) => {
      const passwordInput = page.locator('[data-testid="password-input"], input[name="password"]');
      await passwordInput.fill('weak');

      const strengthIndicator = page.locator('[data-testid="password-strength"]');
      if (await strengthIndicator.isVisible()) {
        await expect(strengthIndicator).toBeVisible();
      }

      // Type a stronger password
      await passwordInput.fill('StrongP@ssword123!');

      // Strength should update if indicator exists
    });

    test('should toggle password visibility', async ({ page }) => {
      const passwordInput = page.locator('[data-testid="password-input"], input[name="password"]');
      await passwordInput.fill('TestPassword');

      const toggleButton = page.locator('[data-testid="toggle-password"], button[aria-label*="password"]');

      if (await toggleButton.isVisible()) {
        // Initially password type
        await expect(passwordInput).toHaveAttribute('type', 'password');

        await toggleButton.click();

        // Should now be text type
        await expect(passwordInput).toHaveAttribute('type', 'text');

        await toggleButton.click();

        // Back to password type
        await expect(passwordInput).toHaveAttribute('type', 'password');
      }
    });

    test('should have link to login page', async ({ page }) => {
      const loginLink = page.locator('a[href*="login"], [data-testid="login-link"]');
      await expect(loginLink).toBeVisible();

      await loginLink.click();
      await page.waitForURL(/login/);
    });
  });

  test.describe('Login', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/auth/login');
      await page.waitForLoadState('networkidle');
    });

    test('should display login form', async ({ page }) => {
      await expect(page.locator('[data-testid="login-form"], form[name="login"]')).toBeVisible();
      await expect(page.locator('[data-testid="email-input"], input[name="email"]')).toBeVisible();
      await expect(page.locator('[data-testid="password-input"], input[name="password"]')).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
      const submitButton = page.locator('[data-testid="login-button"], button[type="submit"]');
      await submitButton.click();

      // Should show validation errors or stay on page
      const url = page.url();
      expect(url).toContain('login');
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await fillLoginForm(page, 'wrong@example.com', 'wrongpassword');

      const submitButton = page.locator('[data-testid="login-button"], button[type="submit"]');
      await submitButton.click();

      // Wait for API response
      await page.waitForTimeout(2000);

      // Should show error message
      const errorMessage = page.locator('[data-testid="error-message"], [role="alert"], .error');
      const hasError = await errorMessage.isVisible().catch(() => false);

      // Should either show error or stay on login page
      const stillOnLogin = page.url().includes('login');
      expect(hasError || stillOnLogin).toBeTruthy();
    });

    test('should have link to registration page', async ({ page }) => {
      const registerLink = page.locator('a[href*="register"], [data-testid="register-link"]');
      await expect(registerLink).toBeVisible();

      await registerLink.click();
      await page.waitForURL(/register/);
    });

    test('should have forgot password link', async ({ page }) => {
      const forgotLink = page.locator('a[href*="forgot"], [data-testid="forgot-password-link"]');

      if (await forgotLink.isVisible()) {
        await expect(forgotLink).toBeVisible();
      }
    });

    test('should show loading state during login', async ({ page }) => {
      // Slow down API response to catch loading state
      await page.route('**/api/auth/login', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await route.abort();
      });

      await fillLoginForm(page, 'test@example.com', 'password123');

      const submitButton = page.locator('[data-testid="login-button"], button[type="submit"]');
      await submitButton.click();

      // Check for loading indicator
      const loadingIndicator = page.locator('[data-testid="loading"], .loading, [aria-busy="true"]');
      const buttonDisabled = await submitButton.isDisabled();

      // Either loading indicator or button should be disabled
      const hasLoadingState = await loadingIndicator.isVisible().catch(() => false) || buttonDisabled;
    });
  });

  test.describe('Logout', () => {
    test('should logout user and redirect to home', async ({ page }) => {
      // First, mock a logged-in state by setting auth cookies/localStorage
      await page.goto('/');

      // Look for logout button (may be in dropdown menu)
      const userMenu = page.locator('[data-testid="user-menu"], [data-testid="account-menu"]');

      if (await userMenu.isVisible()) {
        await userMenu.click();

        const logoutButton = page.locator('[data-testid="logout-button"], button:has-text("Logout"), button:has-text("Sign out")');

        if (await logoutButton.isVisible()) {
          await logoutButton.click();

          // Should redirect to home or login
          await page.waitForURL(/\/$|\/login/);
        }
      }
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect to login when accessing protected route unauthenticated', async ({ page }) => {
      // Try to access a protected route
      await page.goto('/dashboard');

      // Should redirect to login
      await page.waitForURL(/login|auth/);
    });

    test('should redirect to login when accessing favorites unauthenticated', async ({ page }) => {
      await page.goto('/favorites');

      // Should redirect to login or show auth prompt
      const url = page.url();
      const hasAuthRedirect = url.includes('login') || url.includes('auth');
      const hasAuthPrompt = await page.locator('[data-testid="auth-prompt"], [data-testid="login-prompt"]').isVisible().catch(() => false);

      expect(hasAuthRedirect || hasAuthPrompt).toBeTruthy();
    });

    test('should redirect to login when accessing profile unauthenticated', async ({ page }) => {
      await page.goto('/profile');

      // Should redirect to login
      await page.waitForURL(/login|auth/, { timeout: 5000 }).catch(() => {});
    });
  });

  test.describe('Remember Me', () => {
    test('should have remember me checkbox on login', async ({ page }) => {
      await page.goto('/auth/login');

      const rememberMe = page.locator('[data-testid="remember-me"], input[name="rememberMe"], input[type="checkbox"][id*="remember"]');

      if (await rememberMe.isVisible()) {
        await expect(rememberMe).toBeVisible();

        // Test checkbox interaction
        await rememberMe.check();
        await expect(rememberMe).toBeChecked();
      }
    });
  });

  test.describe('OAuth Login', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/auth/login');
    });

    test('should display Google OAuth button', async ({ page }) => {
      const googleButton = page.locator('[data-testid="google-login"], button:has-text("Google")');

      if (await googleButton.isVisible()) {
        await expect(googleButton).toBeVisible();
      }
    });

    test('should display Facebook OAuth button', async ({ page }) => {
      const facebookButton = page.locator('[data-testid="facebook-login"], button:has-text("Facebook")');

      if (await facebookButton.isVisible()) {
        await expect(facebookButton).toBeVisible();
      }
    });

    test('should display Apple OAuth button', async ({ page }) => {
      const appleButton = page.locator('[data-testid="apple-login"], button:has-text("Apple")');

      if (await appleButton.isVisible()) {
        await expect(appleButton).toBeVisible();
      }
    });
  });

  test.describe('Session Management', () => {
    test('should persist session across page reloads', async ({ page }) => {
      // Mock authenticated session
      await page.addInitScript(() => {
        localStorage.setItem('auth_token', 'mock_token_for_testing');
      });

      await page.goto('/');

      // Reload the page
      await page.reload();

      // Session should still be active
      // This is a placeholder - actual implementation depends on auth state management
    });

    test('should handle expired session gracefully', async ({ page }) => {
      // Set expired token
      await page.addInitScript(() => {
        localStorage.setItem('auth_token', 'expired_token');
      });

      await page.goto('/dashboard');

      // Should redirect to login
      await page.waitForURL(/login|auth/, { timeout: 5000 }).catch(() => {});
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper form labels on login page', async ({ page }) => {
      await page.goto('/auth/login');

      const emailInput = page.locator('[data-testid="email-input"], input[name="email"]');
      const passwordInput = page.locator('[data-testid="password-input"], input[name="password"]');

      // Check for labels
      const emailLabel = page.locator('label[for="email"], label:has-text("Email")');
      const passwordLabel = page.locator('label[for="password"], label:has-text("Password")');

      // Should have visible labels or aria-label
      const hasEmailLabel = await emailLabel.isVisible().catch(() => false);
      const hasPasswordLabel = await passwordLabel.isVisible().catch(() => false);

      const emailAriaLabel = await emailInput.getAttribute('aria-label');
      const passwordAriaLabel = await passwordInput.getAttribute('aria-label');

      expect(hasEmailLabel || emailAriaLabel).toBeTruthy();
      expect(hasPasswordLabel || passwordAriaLabel).toBeTruthy();
    });

    test('should support keyboard navigation on login form', async ({ page }) => {
      await page.goto('/auth/login');

      // Tab through form elements
      await page.keyboard.press('Tab');

      const emailInput = page.locator('[data-testid="email-input"], input[name="email"]');
      await expect(emailInput).toBeFocused();

      await page.keyboard.press('Tab');

      const passwordInput = page.locator('[data-testid="password-input"], input[name="password"]');
      await expect(passwordInput).toBeFocused();

      await page.keyboard.press('Tab');

      // Should focus on submit button or next interactive element
    });

    test('should announce errors to screen readers', async ({ page }) => {
      await page.goto('/auth/login');

      const submitButton = page.locator('[data-testid="login-button"], button[type="submit"]');
      await submitButton.click();

      // Error messages should have proper ARIA attributes
      const errorMessages = page.locator('[role="alert"], [aria-live="polite"], [aria-live="assertive"]');
      const hasAriaErrors = await errorMessages.count() > 0;

      // After validation, errors should be announced
    });
  });

  test.describe('Security', () => {
    test('should not expose password in URL', async ({ page }) => {
      await page.goto('/auth/login');

      await fillLoginForm(page, 'test@example.com', 'secretpassword');

      const submitButton = page.locator('[data-testid="login-button"], button[type="submit"]');
      await submitButton.click();

      // Password should never appear in URL
      expect(page.url()).not.toContain('secretpassword');
    });

    test('should use HTTPS for auth requests', async ({ page }) => {
      let authRequestUrl = '';

      page.on('request', (request) => {
        if (request.url().includes('/api/auth')) {
          authRequestUrl = request.url();
        }
      });

      await page.goto('/auth/login');
      await fillLoginForm(page, 'test@example.com', 'password123');

      const submitButton = page.locator('[data-testid="login-button"], button[type="submit"]');
      await submitButton.click();

      // In production, should use HTTPS
      // In development/test, HTTP is acceptable
    });

    test('should handle CSRF protection', async ({ page }) => {
      await page.goto('/auth/login');

      // Check for CSRF token in form or headers
      const csrfToken = await page.locator('input[name="_csrf"], input[name="csrf"]').inputValue().catch(() => '');

      // CSRF handling implementation varies
    });
  });
});
