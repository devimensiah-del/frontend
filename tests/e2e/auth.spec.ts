import { test, expect } from '@playwright/test';
import {
  login,
  signup,
  clearSession,
  generateTestEmail,
  waitForToast,
  waitForAuthReady,
} from './helpers';

/**
 * Authentication Flow E2E Tests
 * Tests user signup, login, password reset, and role-based access control
 */

test.describe('Authentication Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Clear session before each test
    await clearSession(page);
  });

  test('user can sign up with valid credentials', async ({ page }) => {
    const testEmail = generateTestEmail('signup');
    const password = 'TestPassword123!';
    const fullName = 'Test User';
    const companyName = 'Test Company';

    await signup(page, testEmail, password, fullName, companyName);

    // Check if redirected to dashboard or email verification
    const url = page.url();
    expect(url).toMatch(/\/(dashboard|verify-email)/);

    // If on dashboard, check for welcome message or user menu
    if (url.includes('dashboard')) {
      const userMenu = page.locator('[data-testid="user-menu"], [data-testid="user-profile"]');
      await expect(userMenu).toBeVisible({ timeout: 5000 });
    }
  });

  test('user cannot sign up with invalid email', async ({ page }) => {
    await page.goto('/signup');

    await page.fill('[data-testid="email-input"]', 'invalid-email');
    await page.fill('[data-testid="password-input"]', 'TestPassword123!');
    await page.fill('[data-testid="name-input"]', 'Test User');
    await page.click('[data-testid="signup-button"]');

    // Should show validation error
    const errorMessage = page.locator('[data-testid="error-message"], .error, [role="alert"]');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    await expect(errorMessage).toContainText(/email|invalid/i);
  });

  test('user can log in with valid credentials', async ({ page }) => {
    // For this test, we assume a test user exists
    // In a real scenario, you'd set up test data in beforeAll
    const testEmail = process.env.TEST_USER_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_USER_PASSWORD || 'TestPassword123!';

    await login(page, testEmail, testPassword);

    // Should redirect to dashboard
    expect(page.url()).toContain('/dashboard');

    // User menu should be visible
    const userMenu = page.locator('[data-testid="user-menu"], [data-testid="user-profile"]');
    await expect(userMenu).toBeVisible({ timeout: 5000 });
  });

  test('user cannot log in with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[data-testid="email-input"]', 'nonexistent@example.com');
    await page.fill('[data-testid="password-input"]', 'WrongPassword123!');
    await page.click('[data-testid="login-button"]');

    // Should show error message
    await waitForToast(page);
    const toast = page.locator('[data-testid="toast"], .toast, [role="alert"]');
    await expect(toast).toContainText(/invalid|incorrect|failed/i);
  });

  test('user is redirected to dashboard after successful login', async ({ page }) => {
    const testEmail = process.env.TEST_USER_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_USER_PASSWORD || 'TestPassword123!';

    await login(page, testEmail, testPassword);

    // Verify we're on dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
    expect(page.url()).toContain('/dashboard');

    // Dashboard content should be visible
    const dashboardContent = page.locator('h1, [data-testid="dashboard-header"]');
    await expect(dashboardContent).toBeVisible();
  });

  test('unauthenticated user is redirected to login', async ({ page }) => {
    // Try to access protected route without authentication
    await page.goto('/dashboard');

    // Should redirect to login
    await page.waitForURL(/\/login/, { timeout: 10000 });
    expect(page.url()).toContain('/login');
  });

  test('user can request password reset', async ({ page }) => {
    await page.goto('/login');

    // Click forgot password link
    const forgotPasswordLink = page.locator('[data-testid="forgot-password"], a:has-text("Forgot")');
    await forgotPasswordLink.click();

    // Should navigate to reset password page
    await page.waitForURL(/\/reset-password|\/forgot-password/, { timeout: 10000 });

    // Enter email and submit
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.click('[data-testid="reset-button"], button:has-text("Reset")');

    // Should show success message
    await waitForToast(page);
    const toast = page.locator('[data-testid="toast"], .toast, [role="alert"]');
    await expect(toast).toContainText(/sent|email|check/i);
  });

  test('admin role can access admin routes', async ({ page }) => {
    const adminEmail = process.env.TEST_ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.TEST_ADMIN_PASSWORD || 'AdminPassword123!';

    await login(page, adminEmail, adminPassword);

    // Try to access admin route
    await page.goto('/admin/dashboard');

    // Should not redirect, should show admin dashboard
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin');

    // Admin dashboard content should be visible
    const adminContent = page.locator('[data-testid="admin-dashboard"], h1:has-text("Admin")');
    await expect(adminContent).toBeVisible({ timeout: 5000 });
  });

  test('regular user cannot access admin routes', async ({ page }) => {
    const testEmail = process.env.TEST_USER_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_USER_PASSWORD || 'TestPassword123!';

    await login(page, testEmail, testPassword);

    // Try to access admin route
    await page.goto('/admin/dashboard');

    // Should redirect to dashboard or show access denied
    await page.waitForLoadState('networkidle');

    const url = page.url();
    const isRedirected = url.includes('/dashboard') && !url.includes('/admin');
    const hasAccessDenied = await page.locator(':has-text("Access Denied"), :has-text("Unauthorized")').isVisible();

    expect(isRedirected || hasAccessDenied).toBeTruthy();
  });

  test('user can log out', async ({ page }) => {
    const testEmail = process.env.TEST_USER_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_USER_PASSWORD || 'TestPassword123!';

    await login(page, testEmail, testPassword);

    // Find and click logout button
    const logoutButton = page.locator('[data-testid="logout-button"], button:has-text("Logout"), button:has-text("Sign Out")');

    // May need to open user menu first
    const userMenu = page.locator('[data-testid="user-menu"]');
    if (await userMenu.isVisible()) {
      await userMenu.click();
    }

    await logoutButton.click();

    // Should redirect to home or login
    await page.waitForURL(/\/(login|$)/, { timeout: 10000 });

    // Try to access dashboard - should redirect to login
    await page.goto('/dashboard');
    await page.waitForURL(/\/login/, { timeout: 10000 });
    expect(page.url()).toContain('/login');
  });

  test('session persists after page reload', async ({ page }) => {
    const testEmail = process.env.TEST_USER_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_USER_PASSWORD || 'TestPassword123!';

    await login(page, testEmail, testPassword);

    // Reload page
    await page.reload();
    await waitForAuthReady(page);

    // Should still be logged in
    const userMenu = page.locator('[data-testid="user-menu"], [data-testid="user-profile"]');
    await expect(userMenu).toBeVisible({ timeout: 5000 });
  });
});
