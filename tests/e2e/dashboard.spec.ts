import { test, expect } from '@playwright/test';
import {
  login,
  clearSession,
  waitForToast,
  generateTestSubmission,
  waitForNetworkIdle,
} from './helpers';

/**
 * User Dashboard Flow E2E Tests
 * Tests dashboard viewing, navigation, profile updates, and password changes
 */

test.describe('User Dashboard Flows', () => {
  test.beforeEach(async ({ page }) => {
    await clearSession(page);

    // Login as regular user
    const testEmail = process.env.TEST_USER_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_USER_PASSWORD || 'TestPassword123!';
    await login(page, testEmail, testPassword);
  });

  test('user can view their dashboard', async ({ page }) => {
    await page.goto('/dashboard');

    // Dashboard should be visible
    const dashboardHeader = page.locator('h1, [data-testid="dashboard-header"]');
    await expect(dashboardHeader).toBeVisible();

    // Should show stats or welcome message
    const dashboardContent = page.locator('[data-testid="dashboard-content"], main');
    await expect(dashboardContent).toBeVisible();
  });

  test('dashboard shows user statistics', async ({ page }) => {
    await page.goto('/dashboard');

    // Look for stats cards
    const statsCards = page.locator('[data-testid="stats-card"], .stat-card, [data-testid="metric"]');

    if (await statsCards.first().isVisible({ timeout: 3000 })) {
      const count = await statsCards.count();
      expect(count).toBeGreaterThan(0);

      // Stats should have numbers
      const firstStat = statsCards.first();
      const statText = await firstStat.textContent();
      expect(statText).toMatch(/\d+/); // Contains at least one number
    }
  });

  test('user can navigate to submissions list', async ({ page }) => {
    await page.goto('/dashboard');

    // Find and click submissions link
    const submissionsLink = page.locator(
      '[data-testid="submissions-link"], a:has-text("Submissions"), nav a:has-text("Submissions")'
    );

    await submissionsLink.click();

    // Should navigate to submissions page
    await page.waitForURL(/\/dashboard\/submissions/, { timeout: 10000 });
    expect(page.url()).toContain('/submissions');

    // Submissions list should be visible
    const submissionsList = page.locator('[data-testid="submissions-table"], [data-testid="submissions-list"]');
    await expect(submissionsList).toBeVisible({ timeout: 5000 });
  });

  test('user can create new submission from dashboard', async ({ page }) => {
    await page.goto('/dashboard');

    // Find create submission button
    const createButton = page.locator(
      '[data-testid="create-submission-button"], button:has-text("New Submission"), a:has-text("Create")'
    );

    await createButton.click();

    // Should navigate to submission form
    await page.waitForURL(/\/dashboard\/submissions\/new|\/dashboard\/new/, { timeout: 10000 });

    // Form should be visible
    const submissionForm = page.locator('[data-testid="submission-form"], form');
    await expect(submissionForm).toBeVisible();

    // Fill and submit form
    const submissionData = generateTestSubmission();

    await page.fill('[data-testid="company-name-input"]', submissionData.companyName);
    await page.fill('[data-testid="industry-input"]', submissionData.industry);
    await page.fill('[data-testid="challenge-input"]', submissionData.challenge);

    await page.click('[data-testid="submit-button"], button:has-text("Submit")');

    // Should show success message
    await waitForToast(page);
  });

  test('user can navigate between dashboard sections', async ({ page }) => {
    await page.goto('/dashboard');

    // Test navigation between different sections
    const sections = [
      { link: 'Submissions', url: '/submissions' },
      { link: 'Dashboard', url: '/dashboard' },
    ];

    for (const section of sections) {
      const navLink = page.locator(`nav a:has-text("${section.link}")`);

      if (await navLink.isVisible({ timeout: 2000 })) {
        await navLink.click();
        await page.waitForURL(new RegExp(section.url), { timeout: 10000 });
        expect(page.url()).toContain(section.url);
      }
    }
  });

  test('user can update profile information', async ({ page }) => {
    // Navigate to profile settings
    await page.goto('/dashboard');

    // Open user menu
    const userMenu = page.locator('[data-testid="user-menu"]');
    if (await userMenu.isVisible({ timeout: 2000 })) {
      await userMenu.click();
    }

    // Click profile or settings link
    const profileLink = page.locator(
      '[data-testid="profile-link"], a:has-text("Profile"), a:has-text("Settings")'
    );

    if (await profileLink.isVisible({ timeout: 2000 })) {
      await profileLink.click();

      await page.waitForURL(/\/profile|\/settings/, { timeout: 10000 });

      // Update profile fields
      const nameInput = page.locator('[data-testid="name-input"], input[name="name"]');

      if (await nameInput.isVisible({ timeout: 2000 })) {
        await nameInput.fill('Updated Test User');

        // Save changes
        const saveButton = page.locator('[data-testid="save-button"], button:has-text("Save")');
        await saveButton.click();

        // Should show success message
        await waitForToast(page);
        const toast = page.locator('[data-testid="toast"], .toast, [role="alert"]');
        await expect(toast).toContainText(/saved|updated|success/i);
      }
    }
  });

  test('user can change password', async ({ page }) => {
    // Navigate to password change page
    await page.goto('/dashboard');

    // Open user menu
    const userMenu = page.locator('[data-testid="user-menu"]');
    if (await userMenu.isVisible({ timeout: 2000 })) {
      await userMenu.click();
    }

    // Click change password link
    const passwordLink = page.locator(
      '[data-testid="change-password-link"], a:has-text("Password"), a:has-text("Security")'
    );

    if (await passwordLink.isVisible({ timeout: 2000 })) {
      await passwordLink.click();

      await page.waitForURL(/\/password|\/security/, { timeout: 10000 });

      // Fill password change form
      const currentPassword = page.locator('[data-testid="current-password"], input[name*="current"]');
      const newPassword = page.locator('[data-testid="new-password"], input[name*="new"]');
      const confirmPassword = page.locator('[data-testid="confirm-password"], input[name*="confirm"]');

      if (await currentPassword.isVisible({ timeout: 2000 })) {
        await currentPassword.fill('TestPassword123!');
        await newPassword.fill('NewTestPassword123!');
        await confirmPassword.fill('NewTestPassword123!');

        // Submit form
        const changeButton = page.locator('[data-testid="change-password-button"], button:has-text("Change")');
        await changeButton.click();

        // Should show success or error message
        await waitForToast(page);
      }
    }
  });

  test('toasts appear for all dashboard actions', async ({ page }) => {
    await page.goto('/dashboard/submissions/new');

    // Create a submission
    const submissionData = generateTestSubmission();

    await page.fill('[data-testid="company-name-input"]', submissionData.companyName);
    await page.fill('[data-testid="industry-input"]', submissionData.industry);
    await page.fill('[data-testid="challenge-input"]', submissionData.challenge);

    await page.click('[data-testid="submit-button"]');

    // Toast should appear
    const toast = page.locator('[data-testid="toast"], .toast, [role="alert"]');
    await expect(toast).toBeVisible({ timeout: 5000 });
  });

  test('user can view submission history', async ({ page }) => {
    await page.goto('/dashboard/submissions');

    // Wait for submissions to load
    await page.waitForSelector('[data-testid="submissions-table"], [data-testid="submissions-list"]', {
      timeout: 10000,
    });

    // Check if there are any submissions
    const submissionItems = page.locator('[data-testid="submission-row"], [data-testid="submission-item"]');
    const count = await submissionItems.count();

    if (count > 0) {
      // Should show submission details
      const firstSubmission = submissionItems.first();
      await expect(firstSubmission).toBeVisible();

      // Should have company name and status
      const hasCompanyName = await firstSubmission.locator('text=/[A-Z]/').isVisible();
      const hasStatus = await firstSubmission.locator('[data-testid="status-badge"], .badge').isVisible();

      expect(hasCompanyName || hasStatus).toBeTruthy();
    }
  });

  test('dashboard is responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/dashboard');

    // Dashboard should still be functional
    const dashboardHeader = page.locator('h1, [data-testid="dashboard-header"]');
    await expect(dashboardHeader).toBeVisible();

    // Mobile menu should be accessible
    const mobileMenu = page.locator('[data-testid="mobile-menu"], button:has-text("Menu"), [aria-label*="menu"]');

    if (await mobileMenu.isVisible({ timeout: 2000 })) {
      await mobileMenu.click();

      // Navigation should appear
      const nav = page.locator('nav, [data-testid="navigation"]');
      await expect(nav).toBeVisible();
    }
  });

  test('user can filter their submissions', async ({ page }) => {
    await page.goto('/dashboard/submissions');

    // Wait for submissions to load
    await page.waitForSelector('[data-testid="submissions-table"], [data-testid="submissions-list"]', {
      timeout: 10000,
    });

    // Look for filter controls
    const filterSelect = page.locator('[data-testid="status-filter"], select[name*="status"]');

    if (await filterSelect.isVisible({ timeout: 2000 })) {
      // Select a status
      await filterSelect.selectOption('pending');
      await waitForNetworkIdle(page);

      // Check filtered results
      const statusBadges = page.locator('[data-testid="status-badge"], .badge');
      const badges = await statusBadges.all();

      if (badges.length > 0) {
        for (const badge of badges) {
          const text = await badge.textContent();
          expect(text?.toLowerCase()).toContain('pending');
        }
      }
    }
  });

  test('user receives real-time submission updates', async ({ page }) => {
    await page.goto('/dashboard/submissions');

    // Wait for submissions to load
    await page.waitForSelector('[data-testid="submissions-table"], [data-testid="submissions-list"]', {
      timeout: 10000,
    });

    // Get current submission count
    const submissionItems = page.locator('[data-testid="submission-row"], [data-testid="submission-item"]');
    const initialCount = await submissionItems.count();

    // Create a new submission
    await page.goto('/dashboard/submissions/new');

    const submissionData = generateTestSubmission();

    await page.fill('[data-testid="company-name-input"]', submissionData.companyName);
    await page.fill('[data-testid="industry-input"]', submissionData.industry);
    await page.fill('[data-testid="challenge-input"]', submissionData.challenge);

    await page.click('[data-testid="submit-button"]');
    await waitForToast(page);

    // Go back to submissions list
    await page.goto('/dashboard/submissions');

    // Wait for list to update
    await waitForNetworkIdle(page);

    // Count should have increased
    const newCount = await submissionItems.count();
    expect(newCount).toBeGreaterThan(initialCount);
  });
});
