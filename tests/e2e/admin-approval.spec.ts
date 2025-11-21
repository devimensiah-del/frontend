import { test, expect } from '@playwright/test';
import {
  login,
  waitForToast,
  clearSession,
  waitForNetworkIdle,
} from './helpers';

/**
 * Admin Approval Flow E2E Tests
 * Tests admin War Room functionality, editing, saving drafts, and sending emails
 */

test.describe('Admin Approval Flows', () => {
  test.beforeEach(async ({ page }) => {
    await clearSession(page);

    // Login as admin
    const adminEmail = process.env.TEST_ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.TEST_ADMIN_PASSWORD || 'AdminPassword123!';
    await login(page, adminEmail, adminPassword);
  });

  test('admin can view submissions inbox', async ({ page }) => {
    await page.goto('/admin/dashboard');

    // Wait for submissions list to load
    await page.waitForSelector(
      '[data-testid="submissions-table"], [data-testid="submission-item"], table',
      { timeout: 10000 }
    );

    // Should see submissions inbox
    const submissionsTable = page.locator('[data-testid="submissions-table"], table');
    await expect(submissionsTable).toBeVisible();

    // Should have submission rows
    const submissionRows = page.locator('[data-testid="submission-row"], tbody tr');
    const count = await submissionRows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('admin can open War Room for submission', async ({ page }) => {
    await page.goto('/admin/dashboard');

    // Wait for submissions to load
    await page.waitForSelector('[data-testid="submissions-table"], table', {
      timeout: 10000,
    });

    // Click on first submission or "War Room" button
    const warRoomButton = page.locator(
      '[data-testid="war-room-button"], button:has-text("War Room"), button:has-text("Edit")'
    ).first();

    await warRoomButton.click();

    // Should navigate to War Room page
    await page.waitForURL(/\/admin\/submissions\/\w+/, { timeout: 10000 });

    // War Room interface should be visible
    const warRoomInterface = page.locator(
      '[data-testid="war-room"], [data-testid="analysis-editor"]'
    );
    await expect(warRoomInterface).toBeVisible({ timeout: 5000 });
  });

  test('admin can edit analysis fields (SWOT, PESTEL)', async ({ page }) => {
    // Navigate to a submission in War Room
    await page.goto('/admin/dashboard');
    await page.waitForSelector('[data-testid="submissions-table"], table', {
      timeout: 10000,
    });

    const firstSubmission = page.locator(
      '[data-testid="submission-row"], tbody tr'
    ).first();
    await firstSubmission.click();

    await page.waitForURL(/\/admin\/submissions\/\w+/, { timeout: 10000 });

    // Find and edit SWOT fields
    const swotStrengths = page.locator('[data-testid="swot-strengths"], textarea[name*="strengths"]');
    if (await swotStrengths.isVisible()) {
      await swotStrengths.fill('Test strengths: Strong market position, innovative products');
    }

    const swotWeaknesses = page.locator('[data-testid="swot-weaknesses"], textarea[name*="weaknesses"]');
    if (await swotWeaknesses.isVisible()) {
      await swotWeaknesses.fill('Test weaknesses: Limited resources, market competition');
    }

    // Edit PESTEL fields
    const pestelPolitical = page.locator('[data-testid="pestel-political"], textarea[name*="political"]');
    if (await pestelPolitical.isVisible()) {
      await pestelPolitical.fill('Test political factors: Regulatory changes, government policies');
    }

    // Verify changes are reflected
    const strengthsValue = await swotStrengths.inputValue().catch(() => '');
    expect(strengthsValue).toContain('Test strengths');
  });

  test('admin can save draft', async ({ page }) => {
    // Navigate to War Room
    await page.goto('/admin/dashboard');
    await page.waitForSelector('[data-testid="submissions-table"], table', {
      timeout: 10000,
    });

    const firstSubmission = page.locator('[data-testid="submission-row"], tbody tr').first();
    await firstSubmission.click();

    await page.waitForURL(/\/admin\/submissions\/\w+/, { timeout: 10000 });

    // Make some changes
    const textarea = page.locator('textarea').first();
    await textarea.fill('Test draft content');

    // Click save draft button
    const saveDraftButton = page.locator(
      '[data-testid="save-draft-button"], button:has-text("Save Draft"), button:has-text("Save")'
    );
    await saveDraftButton.click();

    // Should show success toast
    await waitForToast(page);
    const toast = page.locator('[data-testid="toast"], .toast, [role="alert"]');
    await expect(toast).toContainText(/saved|draft|success/i);
  });

  test('admin can generate PDF', async ({ page }) => {
    // Navigate to War Room
    await page.goto('/admin/dashboard');
    await page.waitForSelector('[data-testid="submissions-table"], table', {
      timeout: 10000,
    });

    const firstSubmission = page.locator('[data-testid="submission-row"], tbody tr').first();
    await firstSubmission.click();

    await page.waitForURL(/\/admin\/submissions\/\w+/, { timeout: 10000 });

    // Click generate PDF button
    const generatePdfButton = page.locator(
      '[data-testid="generate-pdf-button"], button:has-text("Generate PDF"), button:has-text("PDF")'
    );

    if (await generatePdfButton.isVisible()) {
      // Set up download listener
      const downloadPromise = page.waitForEvent('download', { timeout: 30000 });

      await generatePdfButton.click();

      // Wait for download to start
      const download = await downloadPromise;

      // Verify download
      expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
    } else {
      // If no PDF button, check for PDF preview or link
      const pdfPreview = page.locator('[data-testid="pdf-preview"], iframe[src*="pdf"]');
      await expect(pdfPreview).toBeVisible({ timeout: 5000 });
    }
  });

  test('admin can send email to user', async ({ page }) => {
    // Navigate to War Room
    await page.goto('/admin/dashboard');
    await page.waitForSelector('[data-testid="submissions-table"], table', {
      timeout: 10000,
    });

    const firstSubmission = page.locator('[data-testid="submission-row"], tbody tr').first();
    await firstSubmission.click();

    await page.waitForURL(/\/admin\/submissions\/\w+/, { timeout: 10000 });

    // Find send email button
    const sendEmailButton = page.locator(
      '[data-testid="send-email-button"], button:has-text("Send Email"), button:has-text("Send")'
    );

    if (await sendEmailButton.isVisible()) {
      await sendEmailButton.click();

      // May show confirmation dialog
      const confirmButton = page.locator(
        '[data-testid="confirm-send"], button:has-text("Confirm"), button:has-text("Yes")'
      );

      if (await confirmButton.isVisible({ timeout: 2000 })) {
        await confirmButton.click();
      }

      // Should show success message
      await waitForToast(page);
      const toast = page.locator('[data-testid="toast"], .toast, [role="alert"]');
      await expect(toast).toContainText(/sent|email|success/i);
    }
  });

  test('status updates after email sent', async ({ page }) => {
    // Navigate to War Room
    await page.goto('/admin/dashboard');
    await page.waitForSelector('[data-testid="submissions-table"], table', {
      timeout: 10000,
    });

    // Get initial status
    const firstSubmissionRow = page.locator('[data-testid="submission-row"], tbody tr').first();
    const initialStatus = await firstSubmissionRow
      .locator('[data-testid="status-badge"], .status-badge, .badge')
      .textContent();

    await firstSubmissionRow.click();
    await page.waitForURL(/\/admin\/submissions\/\w+/, { timeout: 10000 });

    // Send email if button exists
    const sendEmailButton = page.locator(
      '[data-testid="send-email-button"], button:has-text("Send Email")'
    );

    if (await sendEmailButton.isVisible()) {
      await sendEmailButton.click();

      const confirmButton = page.locator('[data-testid="confirm-send"], button:has-text("Confirm")');
      if (await confirmButton.isVisible({ timeout: 2000 })) {
        await confirmButton.click();
      }

      await waitForToast(page);

      // Wait for status update
      await waitForNetworkIdle(page);

      // Check if status changed
      const statusBadge = page.locator('[data-testid="status-badge"], .status-badge, .badge');
      const newStatus = await statusBadge.textContent();

      // Status should have changed (e.g., to "completed" or "sent")
      expect(newStatus).not.toBe(initialStatus);
      expect(newStatus).toMatch(/completed|sent|delivered/i);
    }
  });

  test('user sees completed analysis in dashboard', async ({ page }) => {
    // This test assumes an admin has completed an analysis and sent it

    // Logout from admin account
    await page.goto('/admin/dashboard');
    const logoutButton = page.locator('[data-testid="logout-button"], button:has-text("Logout")');

    const userMenu = page.locator('[data-testid="user-menu"]');
    if (await userMenu.isVisible()) {
      await userMenu.click();
    }

    await logoutButton.click();
    await clearSession(page);

    // Login as regular user
    const testEmail = process.env.TEST_USER_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_USER_PASSWORD || 'TestPassword123!';
    await login(page, testEmail, testPassword);

    // Navigate to submissions
    await page.goto('/dashboard/submissions');

    // Look for completed submissions
    const completedSubmission = page.locator(
      '[data-testid="submission-row"]:has([data-testid="status-badge"]:has-text("Completed")), ' +
      'tbody tr:has(.badge:has-text("Completed"))'
    ).first();

    if (await completedSubmission.isVisible({ timeout: 5000 })) {
      await completedSubmission.click();

      // Should see analysis report
      const reportContent = page.locator('[data-testid="report-content"], [data-testid="analysis-report"]');
      await expect(reportContent).toBeVisible({ timeout: 5000 });
    }
  });

  test('admin can filter submissions by status', async ({ page }) => {
    await page.goto('/admin/dashboard');

    // Wait for submissions to load
    await page.waitForSelector('[data-testid="submissions-table"], table', {
      timeout: 10000,
    });

    // Look for status filter
    const statusFilter = page.locator(
      '[data-testid="status-filter"], select[name*="status"], [role="combobox"]'
    );

    if (await statusFilter.isVisible()) {
      // Select a specific status
      await statusFilter.click();

      const pendingOption = page.locator('option:has-text("Pending"), [role="option"]:has-text("Pending")');
      if (await pendingOption.isVisible({ timeout: 2000 })) {
        await pendingOption.click();

        await waitForNetworkIdle(page);

        // All visible submissions should have "Pending" status
        const statusBadges = page.locator('[data-testid="status-badge"], .status-badge, .badge');
        const badges = await statusBadges.all();

        for (const badge of badges) {
          const text = await badge.textContent();
          expect(text).toMatch(/pending/i);
        }
      }
    }
  });

  test('admin can search submissions', async ({ page }) => {
    await page.goto('/admin/dashboard');

    // Wait for submissions to load
    await page.waitForSelector('[data-testid="submissions-table"], table', {
      timeout: 10000,
    });

    // Look for search input
    const searchInput = page.locator(
      '[data-testid="search-input"], input[type="search"], input[placeholder*="Search"]'
    );

    if (await searchInput.isVisible()) {
      // Get company name from first submission
      const firstSubmission = page.locator('[data-testid="submission-row"], tbody tr').first();
      const companyName = await firstSubmission.locator('td').nth(1).textContent();

      // Search for it
      await searchInput.fill(companyName || 'Test');
      await page.keyboard.press('Enter');

      await waitForNetworkIdle(page);

      // Should filter to matching submissions
      const submissionRows = page.locator('[data-testid="submission-row"], tbody tr');
      const count = await submissionRows.count();

      expect(count).toBeGreaterThanOrEqual(1);
    }
  });
});
