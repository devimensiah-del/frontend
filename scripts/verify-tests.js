#!/usr/bin/env node

/**
 * E2E Test Suite Verification Script
 * Verifies that all E2E test infrastructure is properly set up
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying E2E Test Suite Setup...\n');

const checks = [];

// Check files exist
const requiredFiles = [
  'playwright.config.ts',
  'tests/e2e/auth.spec.ts',
  'tests/e2e/submission.spec.ts',
  'tests/e2e/admin-approval.spec.ts',
  'tests/e2e/dashboard.spec.ts',
  'tests/e2e/helpers.ts',
  'tests/e2e/setup.ts',
  'tests/e2e/fixtures/test-data.ts',
  'tests/e2e/README.md',
  'tests/e2e/QUICK_REFERENCE.md',
  'docs/TESTING.md',
  '.env.test.example',
  '.github/workflows/e2e-tests.yml',
];

console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  const exists = fs.existsSync(filePath);
  checks.push({ name: file, passed: exists });
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Check package.json scripts
console.log('\n📜 Checking package.json scripts...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = [
  'test:e2e',
  'test:e2e:ui',
  'test:e2e:headed',
  'test:e2e:debug',
  'test:e2e:report',
];

requiredScripts.forEach(script => {
  const exists = !!packageJson.scripts[script];
  checks.push({ name: `script: ${script}`, passed: exists });
  console.log(`  ${exists ? '✅' : '❌'} ${script}`);
});

// Check Playwright dependency
console.log('\n📦 Checking dependencies...');
const hasPlaywright = !!packageJson.devDependencies['@playwright/test'];
checks.push({ name: '@playwright/test', passed: hasPlaywright });
console.log(`  ${hasPlaywright ? '✅' : '❌'} @playwright/test installed`);

// Check test count
console.log('\n🧪 Checking test files...');
let totalTests = 0;

const testFiles = [
  'tests/e2e/auth.spec.ts',
  'tests/e2e/submission.spec.ts',
  'tests/e2e/admin-approval.spec.ts',
  'tests/e2e/dashboard.spec.ts',
];

testFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const testMatches = content.match(/test\(/g) || [];
  const count = testMatches.length;
  totalTests += count;
  console.log(`  ✅ ${path.basename(file)}: ${count} tests`);
});

console.log(`  📊 Total: ${totalTests} tests`);
checks.push({ name: 'test count >= 40', passed: totalTests >= 40 });

// Summary
console.log('\n' + '='.repeat(50));
const passed = checks.filter(c => c.passed).length;
const failed = checks.filter(c => !c.passed).length;

console.log(`\n📊 Verification Summary:`);
console.log(`  ✅ Passed: ${passed}`);
console.log(`  ❌ Failed: ${failed}`);
console.log(`  📋 Total: ${checks.length}`);

if (failed === 0) {
  console.log('\n✨ All checks passed! E2E test suite is ready to use.');
  console.log('\n🚀 Quick Start:');
  console.log('  npm run test:e2e        # Run all tests');
  console.log('  npm run test:e2e:ui     # Interactive mode');
  console.log('  npm run test:e2e:headed # Watch tests run');
} else {
  console.log('\n⚠️  Some checks failed. Please review the output above.');
  process.exit(1);
}

console.log('\n📖 Documentation:');
console.log('  docs/TESTING.md                - Comprehensive guide');
console.log('  tests/e2e/README.md            - Quick start');
console.log('  tests/e2e/QUICK_REFERENCE.md   - Command reference');
console.log('');
