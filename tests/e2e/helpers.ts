import { Page, expect } from '@playwright/test';

/**
 * Test helper utilities for E2E tests
 * Provides reusable functions for common test operations
 */

/**
 * Login helper - logs in a user and waits for redirect to dashboard
 */
export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');

  await page.fill('[data-testid="email-input"]', email);
  await page.fill('[data-testid="password-input"]', password);
  await page.click('[data-testid="login-button"]');

  // Wait for navigation to dashboard or home
  await page.waitForURL(/\/(dashboard|admin)/, { timeout: 10000 });
}

/**
 * Signup helper - creates a new user account
 */
export async function signup(
  page: Page,
  email: string,
  password: string,
  fullName: string,
  companyName?: string
) {
  await page.goto('/signup');

  await page.fill('[data-testid="email-input"]', email);
  await page.fill('[data-testid="password-input"]', password);
  await page.fill('[data-testid="name-input"]', fullName);

  if (companyName) {
    await page.fill('[data-testid="company-input"]', companyName);
  }

  await page.click('[data-testid="signup-button"]');

  // Wait for successful signup (redirects to dashboard or shows verification message)
  await page.waitForURL(/\/(dashboard|verify-email)/, { timeout: 10000 });
}

/**
 * Wait for toast message to appear
 */
export async function waitForToast(page: Page, text?: string) {
  const toastLocator = page.locator('[data-testid="toast"], .toast, [role="alert"]');

  await expect(toastLocator).toBeVisible({ timeout: 5000 });

  if (text) {
    await expect(toastLocator).toContainText(text);
  }

  return toastLocator;
}

/**
 * Wait for toast to disappear
 */
export async function waitForToastToDisappear(page: Page) {
  const toastLocator = page.locator('[data-testid="toast"], .toast, [role="alert"]');
  await expect(toastLocator).toBeHidden({ timeout: 5000 });
}

/**
 * Fill submission form on landing page
 */
export async function fillSubmissionForm(page: Page, data: {
  companyName: string;
  industry: string;
  challenge: string;
  email?: string;
  phone?: string;
}) {
  await page.fill('[data-testid="company-name-input"]', data.companyName);
  await page.fill('[data-testid="industry-input"]', data.industry);
  await page.fill('[data-testid="challenge-input"]', data.challenge);

  if (data.email) {
    await page.fill('[data-testid="email-input"]', data.email);
  }

  if (data.phone) {
    await page.fill('[data-testid="phone-input"]', data.phone);
  }
}

/**
 * Create a test submission from the landing page
 */
export async function createSubmission(page: Page, data: {
  companyName: string;
  industry: string;
  challenge: string;
  email: string;
  phone?: string;
}) {
  await page.goto('/');

  // Scroll to submission form
  await page.locator('[data-testid="submission-form"]').scrollIntoViewIfNeeded();

  await fillSubmissionForm(page, data);

  // Submit form
  await page.click('[data-testid="submit-button"]');

  // Wait for success message
  await waitForToast(page, 'success');
}

/**
 * Mock API responses for testing
 */
export async function mockApiResponses(page: Page, mocks?: {
  submissions?: any[];
  submission?: any;
  user?: any;
}) {
  // Mock GET /api/submissions
  if (mocks?.submissions) {
    await page.route('**/api/submissions', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mocks.submissions),
      });
    });
  }

  // Mock GET /api/submissions/:id
  if (mocks?.submission) {
    await page.route('**/api/submissions/*', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mocks.submission),
        });
      } else {
        route.continue();
      }
    });
  }

  // Mock user endpoint
  if (mocks?.user) {
    await page.route('**/api/auth/user', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mocks.user),
      });
    });
  }
}

/**
 * Clear all cookies and local storage
 */
export async function clearSession(page: Page) {
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Wait for network idle
 */
export async function waitForNetworkIdle(page: Page) {
  await page.waitForLoadState('networkidle', { timeout: 10000 });
}

/**
 * Generate unique test email
 */
export function generateTestEmail(prefix: string = 'test'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}-${timestamp}-${random}@test.com`;
}

/**
 * Generate test submission data
 */
export function generateTestSubmission() {
  const timestamp = Date.now();
  return {
    companyName: `Test Company ${timestamp}`,
    industry: 'Technology',
    challenge: `Test business challenge ${timestamp}`,
    email: generateTestEmail('submission'),
    phone: '+1234567890',
  };
}

/**
 * Check if element is visible and enabled
 */
export async function isInteractable(page: Page, selector: string): Promise<boolean> {
  const element = page.locator(selector);

  try {
    await expect(element).toBeVisible({ timeout: 1000 });
    await expect(element).toBeEnabled({ timeout: 1000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Take a screenshot with a descriptive name
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({
    path: `test-results/screenshots/${name}-${Date.now()}.png`,
    fullPage: true,
  });
}

/**
 * Wait for Supabase auth to be ready
 */
export async function waitForAuthReady(page: Page) {
  await page.waitForFunction(() => {
    return typeof window !== 'undefined' &&
           (window as any).supabase !== undefined;
  }, { timeout: 5000 });
}
