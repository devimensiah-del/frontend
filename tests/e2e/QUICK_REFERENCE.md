# E2E Testing Quick Reference

## Run Tests

```bash
# All tests (headless)
npm run test:e2e

# Interactive UI mode
npm run test:e2e:ui

# See browser (headed)
npm run test:e2e:headed

# Debug mode
npm run test:e2e:debug

# Specific file
npx playwright test tests/e2e/auth.spec.ts

# Specific test
npx playwright test --grep "login"

# View report
npm run test:e2e:report
```

## Common Test Patterns

### Authentication
```typescript
import { login, signup, clearSession } from './helpers';

test('login test', async ({ page }) => {
  await login(page, 'test@example.com', 'password');
  expect(page.url()).toContain('/dashboard');
});
```

### Form Filling
```typescript
await page.fill('[data-testid="input-field"]', 'value');
await page.click('[data-testid="submit-button"]');
```

### Waiting
```typescript
// Wait for element
await expect(element).toBeVisible();

// Wait for navigation
await page.waitForURL(/dashboard/);

// Wait for network
await waitForNetworkIdle(page);

// Wait for toast
await waitForToast(page, 'Success');
```

### Assertions
```typescript
// Visibility
await expect(element).toBeVisible();
await expect(element).toBeHidden();

// Content
await expect(element).toContainText('text');
await expect(element).toHaveText('exact text');

// State
await expect(element).toBeEnabled();
await expect(element).toBeDisabled();

// URL
await expect(page).toHaveURL(/pattern/);
```

## Test Structure

```typescript
test.describe('Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
  });

  test('should do something', async ({ page }) => {
    // Arrange
    const data = generateTestSubmission();

    // Act
    await page.click('[data-testid="button"]');

    // Assert
    await expect(result).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    // Cleanup after each test
  });
});
```

## Selectors Priority

1. ✅ `[data-testid="element"]` - Best (stable)
2. ✅ `[role="button"]` - Good (semantic)
3. ✅ `text=Submit` - OK (for content)
4. ❌ `.class-name` - Avoid (fragile)

## Helper Functions

```typescript
// Auth
login(page, email, password)
signup(page, email, password, name, company)
clearSession(page)

// UI
waitForToast(page, text?)
waitForNetworkIdle(page)
fillSubmissionForm(page, data)
createSubmission(page, data)

// Utilities
generateTestEmail(prefix?)
generateTestSubmission()
takeScreenshot(page, name)
```

## Debug Tips

```bash
# Run with debug flag
npm run test:e2e:debug

# View traces
npx playwright show-trace trace.zip

# Generate traces
npx playwright test --trace on

# Slow mo (see actions)
npx playwright test --headed --slow-mo 1000

# Screenshots on failure (default)
# Videos on retry (default)
```

## Environment Variables

```bash
# .env.test
PLAYWRIGHT_BASE_URL=http://localhost:3000
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=TestPassword123!
TEST_ADMIN_EMAIL=admin@example.com
TEST_ADMIN_PASSWORD=AdminPassword123!
```

## Common Issues

### Element not found
```typescript
// Add timeout
await page.click('[data-testid="btn"]', { timeout: 10000 });

// Wait for element first
await page.waitForSelector('[data-testid="btn"]');
```

### Flaky tests
```typescript
// Use proper waits
await expect(element).toBeVisible();
// NOT: await page.waitForTimeout(2000);

// Wait for network
await waitForNetworkIdle(page);

// Increase timeout
test.setTimeout(60000);
```

### Authentication issues
```typescript
// Clear session before test
await clearSession(page);

// Wait for auth to be ready
await waitForAuthReady(page);
```

## CI/CD

Tests run on:
- PRs to main/master/develop
- Pushes to main/master/develop
- Manual dispatch

Results in GitHub Actions → Artifacts

## File Structure

```
tests/e2e/
├── fixtures/
│   └── test-data.ts        # Test data
├── auth.spec.ts            # Auth tests
├── submission.spec.ts      # Submission tests
├── admin-approval.spec.ts  # Admin tests
├── dashboard.spec.ts       # Dashboard tests
├── helpers.ts              # Utilities
├── setup.ts                # Global setup
└── README.md               # This file
```

## Resources

- [Full Documentation](../../docs/TESTING.md)
- [Playwright Docs](https://playwright.dev)
- [Test Data](./fixtures/test-data.ts)
- [Helper Functions](./helpers.ts)

## Need Help?

1. Check [TESTING.md](../../docs/TESTING.md)
2. Review [Playwright docs](https://playwright.dev)
3. Look at existing tests
4. Ask the team
