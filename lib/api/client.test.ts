/**
 * API Client Integration Tests
 *
 * Run with: npx ts-node --esm lib/api/client.test.ts
 *
 * Prerequisites:
 * - Backend running at http://localhost:8080
 * - Redis and Postgres connected
 */

// Simple test runner (no Jest dependency needed)
const API_BASE = 'http://localhost:8080/api/v1';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  response?: any;
}

const results: TestResult[] = [];

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    results.push({ name, passed: true });
    console.log(`✅ ${name}`);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    results.push({ name, passed: false, error: errorMsg });
    console.log(`❌ ${name}: ${errorMsg}`);
  }
}

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  return { status: response.status, ok: response.ok, data };
}

// ====================
// TESTS
// ====================

async function runTests() {
  console.log('\n🧪 API Client Integration Tests\n');
  console.log(`Testing against: ${API_BASE}\n`);

  // 1. Health Check
  await test('Health endpoint returns 200', async () => {
    const res = await fetch('http://localhost:8080/health');
    if (!res.ok) throw new Error(`Status: ${res.status}`);
  });

  // 2. Auth - Login (expect 401 with bad credentials)
  await test('Login rejects invalid credentials', async () => {
    const res = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'fake@test.com', password: 'wrong' }),
    });
    if (res.status !== 401 && res.status !== 400) {
      throw new Error(`Expected 401/400, got ${res.status}`);
    }
  });

  // 3. Auth - Login response has access_token field (not token)
  await test('Login response shape check (access_token field)', async () => {
    // This test verifies the API contract - we expect access_token in response
    // Even on error, the backend should return proper error shape
    const res = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', password: 'test' }),
    });
    // Either success with access_token or error with message
    if (res.ok && !res.data.access_token) {
      throw new Error('Success response missing access_token field');
    }
    // Check error shape
    if (!res.ok && !res.data.error && !res.data.message) {
      throw new Error('Error response missing error/message field');
    }
  });

  // 4. Protected endpoints return 401 without token
  await test('Protected endpoint /submissions requires auth', async () => {
    const res = await apiCall('/submissions');
    if (res.status !== 401) {
      throw new Error(`Expected 401, got ${res.status}`);
    }
  });

  await test('Protected endpoint /admin/submissions requires auth', async () => {
    const res = await apiCall('/admin/submissions');
    if (res.status !== 401) {
      throw new Error(`Expected 401, got ${res.status}`);
    }
  });

  // 5. Public submission endpoint (if available)
  await test('Public submission POST accepts request', async () => {
    const res = await apiCall('/submissions', {
      method: 'POST',
      body: JSON.stringify({
        companyName: 'Test Company',
        cnpj: '00.000.000/0000-00',
        industry: 'Technology',
        companySize: '10-50',
        strategicGoal: 'Growth',
        currentChallenges: 'Test challenge',
        competitivePosition: 'Leader',
      }),
    });
    // Should be 201 (created) or 401 (if auth required)
    if (res.status !== 201 && res.status !== 401) {
      throw new Error(`Expected 201 or 401, got ${res.status}: ${JSON.stringify(res.data)}`);
    }
  });

  // Print summary
  console.log('\n' + '='.repeat(50));
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

  if (failed > 0) {
    console.log('Failed tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.name}: ${r.error}`);
    });
  }
}

// Run
runTests().catch(console.error);
