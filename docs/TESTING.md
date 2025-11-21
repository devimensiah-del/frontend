# E2E Testing Documentation

## Overview

This document covers the End-to-End (E2E) testing setup for the Imensiah frontend application using Playwright. Our E2E tests cover critical user flows including authentication, submission management, admin approval workflows, and dashboard functionality.

## Table of Contents

- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing New Tests](#writing-new-tests)
- [Test Coverage](#test-coverage)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Running Imensiah backend (or staging environment)

### Installation

Playwright and its dependencies are already installed. To set up browsers:

```bash
# Install Playwright browsers
npx playwright install

# Or install only Chromium (recommended for faster setup)
npx playwright install chromium
```

### Environment Setup

Create a `.env.test` file for test-specific environment variables:

```bash
# Test Environment Configuration
PLAYWRIGHT_BASE_URL=http://localhost:3000

# Test User Credentials
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=TestPassword123!
TEST_ADMIN_EMAIL=admin@example.com
TEST_ADMIN_PASSWORD=AdminPassword123!

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Running Tests

### Basic Commands

```bash
# Run all tests (headless mode)
npm run test:e2e

# Run tests with UI (interactive mode)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run tests in debug mode
npm run test:e2e:debug

# Run specific test file
npx playwright test tests/e2e/auth.spec.ts

# Run tests matching pattern
npx playwright test --grep "login"

# View test report
npm run test:e2e:report
```

### Advanced Options

```bash
# Run on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run tests in parallel (default)
npx playwright test --workers=4

# Run tests sequentially
npx playwright test --workers=1

# Update snapshots (if using visual regression)
npx playwright test --update-snapshots

# Generate test traces
npx playwright test --trace on
```

## Test Structure

### Directory Layout

```
tests/
└── e2e/
    ├── helpers.ts              # Reusable test utilities
    ├── auth.spec.ts            # Authentication flow tests
    ├── submission.spec.ts      # Submission creation tests
    ├── admin-approval.spec.ts  # Admin War Room tests
    └── dashboard.spec.ts       # User dashboard tests
```

### Test Files

#### 1. **auth.spec.ts** - Authentication Flows
- User signup with valid credentials
- User login/logout
- Password reset functionality
- Role-based access control (admin vs user)
- Session persistence
- Invalid credential handling

#### 2. **submission.spec.ts** - Submission Management
- Create submission from landing page
- Form validation (required fields, email format)
- Submission appears in user dashboard
- View submission details
- Track submission status
- Multiple submission creation

#### 3. **admin-approval.spec.ts** - Admin Workflows
- View submissions inbox
- Open War Room for submission
- Edit analysis fields (SWOT, PESTEL)
- Save draft functionality
- Generate PDF reports
- Send email to users
- Status updates after actions
- Filter and search submissions

#### 4. **dashboard.spec.ts** - User Dashboard
- View dashboard overview
- Navigate between sections
- Create new submissions
- Update profile information
- Change password
- View submission history
- Real-time updates
- Mobile responsiveness

### Helper Functions

Located in `tests/e2e/helpers.ts`:

```typescript
// Authentication helpers
login(page, email, password)
signup(page, email, password, fullName, companyName?)
clearSession(page)

// UI helpers
waitForToast(page, text?)
waitForNetworkIdle(page)
isInteractable(page, selector)

// Form helpers
fillSubmissionForm(page, data)
createSubmission(page, data)

// Mock helpers
mockApiResponses(page, mocks?)

// Utility helpers
generateTestEmail(prefix?)
generateTestSubmission()
takeScreenshot(page, name)
```

## Writing New Tests

### Test Template

```typescript
import { test, expect } from '@playwright/test';
import { login, waitForToast } from './helpers';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup code runs before each test
    await page.goto('/');
  });

  test('should perform expected action', async ({ page }) => {
    // Arrange: Set up test data and state
    const testData = { /* ... */ };

    // Act: Perform the action
    await page.click('[data-testid="action-button"]');

    // Assert: Verify expected outcome
    await expect(page.locator('[data-testid="result"]')).toBeVisible();
  });
});
```

### Best Practices for Writing Tests

1. **Use data-testid attributes** for stable selectors:
```typescript
// Good
await page.click('[data-testid="submit-button"]');

// Avoid
await page.click('.btn-primary.submit');
```

2. **Wait for elements properly**:
```typescript
// Good
await expect(element).toBeVisible({ timeout: 5000 });

// Avoid
await page.waitForTimeout(2000); // Flaky!
```

3. **Clean up test data**:
```typescript
test.afterEach(async ({ page }) => {
  await clearSession(page);
  // Delete test submissions if needed
});
```

4. **Use descriptive test names**:
```typescript
// Good
test('user can reset password with valid email');

// Avoid
test('test1');
```

5. **Keep tests independent**:
- Each test should work in isolation
- Don't rely on test execution order
- Clean up after each test

6. **Handle async operations**:
```typescript
// Wait for network requests to complete
await waitForNetworkIdle(page);

// Wait for specific requests
await page.waitForResponse(response =>
  response.url().includes('/api/submissions')
);
```

## Test Coverage

### Current Coverage

| Feature | Tests | Coverage |
|---------|-------|----------|
| Authentication | 11 tests | Full flow |
| Submission Creation | 9 tests | Happy + error paths |
| Admin Workflows | 11 tests | War Room + actions |
| User Dashboard | 12 tests | Navigation + updates |
| **Total** | **43 tests** | **Critical paths** |

### Coverage Goals

- ✅ All critical user journeys
- ✅ Error handling and validation
- ✅ Role-based access control
- ✅ Real-time updates
- ⏳ Performance testing
- ⏳ Accessibility testing
- ⏳ Visual regression testing

## CI/CD Integration

### GitHub Actions Workflow

The E2E tests run automatically on:
- Pull requests to main/master/develop
- Pushes to main/master/develop
- Manual workflow dispatch

### Workflow Configuration

See `.github/workflows/e2e-tests.yml` for complete configuration.

Key features:
- Runs on Ubuntu latest
- Installs Chromium only (fast)
- Builds and starts application
- Runs all E2E tests
- Uploads test results and screenshots
- Comments on PRs with test summary

### Required GitHub Secrets

Configure these secrets in your GitHub repository:

```
TEST_USER_EMAIL          # Test user credentials
TEST_USER_PASSWORD       # Test user password
TEST_ADMIN_EMAIL         # Admin user credentials
TEST_ADMIN_PASSWORD      # Admin password
NEXT_PUBLIC_SUPABASE_URL # Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY # Service role key
STAGING_URL (optional)   # Staging environment URL
```

### Viewing Test Results

After CI runs:
1. Go to Actions tab in GitHub
2. Click on the workflow run
3. Download artifacts:
   - `playwright-report` - HTML test report
   - `test-screenshots` - Failure screenshots

## Troubleshooting

### Common Issues

#### 1. Tests fail locally but pass in CI

**Cause**: Environment differences

**Solution**:
```bash
# Use the same environment variables as CI
cp .env.test.example .env.test
# Update with your test credentials
```

#### 2. Flaky tests (pass/fail randomly)

**Cause**: Timing issues, race conditions

**Solution**:
- Use proper wait conditions
- Avoid `waitForTimeout()`
- Use `waitForLoadState('networkidle')`
- Increase timeouts for slow operations

#### 3. "Element not found" errors

**Cause**: Selector issues or timing

**Solution**:
```typescript
// Add data-testid to component
<button data-testid="submit-button">Submit</button>

// Use in test
await page.click('[data-testid="submit-button"]');
```

#### 4. Authentication fails in tests

**Cause**: Invalid test credentials or session issues

**Solution**:
- Verify test users exist in database
- Clear session before each test
- Check Supabase configuration

#### 5. Tests timeout

**Cause**: Slow application or network requests

**Solution**:
```typescript
// Increase timeout for slow operations
test.setTimeout(60000); // 60 seconds

// Or per action
await page.click('[data-testid="button"]', { timeout: 30000 });
```

### Debug Mode

Run tests in debug mode to step through:

```bash
npm run test:e2e:debug
```

This opens Playwright Inspector where you can:
- Step through test actions
- Inspect elements
- View console logs
- Take screenshots

### Trace Viewer

Generate and view traces for failed tests:

```bash
# Run with trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

## Best Practices

### 1. Test Organization

- Group related tests in `describe` blocks
- Use descriptive test names
- Keep tests focused on one behavior
- Order tests logically (setup → action → assertion)

### 2. Selectors

Priority order:
1. `data-testid` attributes (most stable)
2. Accessibility attributes (`role`, `aria-label`)
3. Text content (for buttons/links)
4. CSS selectors (least stable)

### 3. Assertions

```typescript
// Visibility assertions
await expect(element).toBeVisible();
await expect(element).toBeHidden();

// Content assertions
await expect(element).toContainText('Expected text');
await expect(element).toHaveText('Exact text');

// State assertions
await expect(element).toBeEnabled();
await expect(element).toBeDisabled();
await expect(element).toBeChecked();

// URL assertions
await expect(page).toHaveURL(/dashboard/);
```

### 4. Performance

- Use `fullyParallel: true` in config (default)
- Run only necessary tests during development
- Use headed mode sparingly (slower)
- Mock external APIs when possible

### 5. Maintenance

- Update tests when UI changes
- Remove obsolete tests
- Refactor common patterns to helpers
- Keep test data fresh
- Review and update selectors regularly

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Testing Library Principles](https://testing-library.com/docs/guiding-principles)

## Support

For questions or issues with tests:
1. Check this documentation
2. Review Playwright docs
3. Check existing test examples
4. Ask in team chat
5. Create GitHub issue with test failure details

---

**Last Updated**: 2025-11-21
**Playwright Version**: 1.56.1
**Test Coverage**: 43 E2E tests covering critical user flows
