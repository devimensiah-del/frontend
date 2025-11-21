# E2E Tests

End-to-End tests for the Imensiah frontend application using Playwright.

## Quick Start

```bash
# Install dependencies (if not already installed)
npm install

# Install Playwright browsers
npx playwright install chromium

# Run all tests
npm run test:e2e

# Run tests with UI
npm run test:e2e:ui

# Run specific test file
npx playwright test tests/e2e/auth.spec.ts
```

## Test Files

- **auth.spec.ts** - Authentication flows (login, signup, password reset, access control)
- **submission.spec.ts** - Submission creation and management
- **admin-approval.spec.ts** - Admin War Room and approval workflows
- **dashboard.spec.ts** - User dashboard functionality
- **helpers.ts** - Reusable test utilities and helper functions

## Environment Variables

Create `.env.test` with:

```bash
PLAYWRIGHT_BASE_URL=http://localhost:3000
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=TestPassword123!
TEST_ADMIN_EMAIL=admin@example.com
TEST_ADMIN_PASSWORD=AdminPassword123!
```

## Common Commands

```bash
# Run tests in different modes
npm run test:e2e          # Headless (CI mode)
npm run test:e2e:ui       # Interactive UI
npm run test:e2e:headed   # See browser
npm run test:e2e:debug    # Debug mode

# View test report
npm run test:e2e:report

# Run specific tests
npx playwright test --grep "login"
npx playwright test tests/e2e/auth.spec.ts

# Run on different browsers
npx playwright test --project=chromium
npx playwright test --project=firefox
```

## Test Coverage

Total: **43 E2E tests** covering:
- ✅ Authentication (11 tests)
- ✅ Submission flows (9 tests)
- ✅ Admin workflows (11 tests)
- ✅ User dashboard (12 tests)

## Documentation

See [docs/TESTING.md](../../docs/TESTING.md) for comprehensive documentation including:
- Detailed test descriptions
- Writing new tests
- Best practices
- Troubleshooting guide
- CI/CD integration

## CI/CD

Tests run automatically on:
- Pull requests to main/master/develop
- Pushes to main/master/develop
- Manual workflow dispatch

See `.github/workflows/e2e-tests.yml` for workflow configuration.

## Need Help?

1. Check [docs/TESTING.md](../../docs/TESTING.md)
2. Review [Playwright documentation](https://playwright.dev)
3. Look at existing test examples
4. Ask the team
