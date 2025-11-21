/**
 * Test Setup and Teardown
 * Run before/after all tests to prepare test environment
 */

import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup - runs once before all tests
 */
export default async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting E2E test suite setup...');

  const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000';

  // Launch browser to check if app is running
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log(`📡 Checking if application is running at ${baseURL}...`);

    // Try to connect to the app
    const response = await page.goto(baseURL, {
      timeout: 30000,
      waitUntil: 'domcontentloaded',
    });

    if (!response || !response.ok()) {
      throw new Error(`Application not accessible at ${baseURL}`);
    }

    console.log('✅ Application is running and accessible');

    // Optional: Verify Supabase connection
    const hasSupabase = await page.evaluate(() => {
      return typeof (window as any).supabase !== 'undefined';
    }).catch(() => false);

    if (hasSupabase) {
      console.log('✅ Supabase client initialized');
    }

    // Optional: Setup test data (if needed)
    // await setupTestData();

    console.log('✅ E2E test suite setup complete');
  } catch (error) {
    console.error('❌ Failed to setup test environment:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

/**
 * Setup test data (optional)
 * Creates test users, submissions, etc.
 */
async function setupTestData() {
  console.log('📦 Setting up test data...');

  // Example: Create test users via API
  // const testUsers = [
  //   { email: 'test@example.com', password: 'TestPassword123!', role: 'user' },
  //   { email: 'admin@example.com', password: 'AdminPassword123!', role: 'admin' },
  // ];

  // for (const user of testUsers) {
  //   await createTestUser(user);
  // }

  console.log('✅ Test data setup complete');
}

/**
 * Global teardown - runs once after all tests
 */
export async function globalTeardown() {
  console.log('🧹 Cleaning up after E2E tests...');

  // Optional: Clean up test data
  // await cleanupTestData();

  console.log('✅ Cleanup complete');
}

/**
 * Cleanup test data (optional)
 */
async function cleanupTestData() {
  console.log('🗑️  Removing test data...');

  // Example: Delete test submissions, users, etc.
  // await deleteTestSubmissions();
  // await deleteTestUsers();

  console.log('✅ Test data cleaned up');
}
