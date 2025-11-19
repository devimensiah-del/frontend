#!/usr/bin/env node

/**
 * IMENSIAH Design System Compliance Checker
 *
 * This script validates that all components follow the design system rules:
 * - No hardcoded Tailwind colors (blue-500, teal-100, etc.)
 * - No inline styles
 * - Components import from @/lib/design
 *
 * Run: node scripts/check-design-compliance.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

// Forbidden color patterns (excluding semantic colors)
const FORBIDDEN_PATTERNS = [
  'text-blue-',
  'bg-blue-',
  'border-blue-',
  'text-teal-',
  'bg-teal-',
  'border-teal-',
  'text-purple-',
  'bg-purple-',
  'border-purple-',
  'text-cyan-',
  'bg-cyan-',
  'border-cyan-',
  'text-pink-',
  'bg-pink-',
  'border-pink-',
  'text-sky-',
  'bg-sky-',
  'border-sky-',
  'text-indigo-',
  'bg-indigo-',
  'border-indigo-',
  'text-violet-',
  'bg-violet-',
  'border-violet-',
];

// Allowed semantic patterns (only for status/alerts)
const SEMANTIC_ALLOWED = [
  'text-green-',
  'bg-green-',
  'text-red-',
  'bg-red-',
  'text-orange-',
  'bg-orange-',
  'text-yellow-',
  'bg-yellow-',
];

let violations = [];
let warnings = [];
let stats = {
  filesChecked: 0,
  violationsFound: 0,
  warningsFound: 0,
};

/**
 * Check a single file for design system violations
 */
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const fileViolations = [];
  const fileWarnings = [];

  // Check for hardcoded forbidden colors
  lines.forEach((line, index) => {
    FORBIDDEN_PATTERNS.forEach(pattern => {
      if (line.includes(pattern)) {
        fileViolations.push({
          file: filePath,
          line: index + 1,
          content: line.trim(),
          type: 'FORBIDDEN_COLOR',
          pattern,
        });
      }
    });

    // Check for inline styles
    if (line.includes('style={{')) {
      fileViolations.push({
        file: filePath,
        line: index + 1,
        content: line.trim(),
        type: 'INLINE_STYLE',
      });
    }

    // Check for arbitrary color values
    if (line.match(/text-\[#[0-9a-fA-F]{3,6}\]/) || line.match(/bg-\[#[0-9a-fA-F]{3,6}\]/)) {
      fileWarnings.push({
        file: filePath,
        line: index + 1,
        content: line.trim(),
        type: 'ARBITRARY_COLOR',
      });
    }
  });

  // Check if file imports from @/lib/design (only for component files)
  if (filePath.includes('/components/') && !content.includes('@/lib/design')) {
    fileWarnings.push({
      file: filePath,
      line: 1,
      content: 'File does not import from @/lib/design',
      type: 'MISSING_IMPORT',
    });
  }

  return { violations: fileViolations, warnings: fileWarnings };
}

/**
 * Recursively find all .tsx files in a directory
 */
function findTsxFiles(dir) {
  let results = [];
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and .next
      if (file !== 'node_modules' && file !== '.next') {
        results = results.concat(findTsxFiles(filePath));
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(filePath);
    }
  });

  return results;
}

/**
 * Print violations to console
 */
function printResults() {
  console.log('\n' + colors.bold + colors.cyan + '='.repeat(80) + colors.reset);
  console.log(colors.bold + colors.cyan + '  IMENSIAH Design System Compliance Report' + colors.reset);
  console.log(colors.bold + colors.cyan + '='.repeat(80) + colors.reset + '\n');

  // Print stats
  console.log(colors.bold + 'Statistics:' + colors.reset);
  console.log(`  Files checked: ${colors.cyan}${stats.filesChecked}${colors.reset}`);
  console.log(`  Violations found: ${stats.violationsFound > 0 ? colors.red : colors.green}${stats.violationsFound}${colors.reset}`);
  console.log(`  Warnings found: ${stats.warningsFound > 0 ? colors.yellow : colors.green}${stats.warningsFound}${colors.reset}\n`);

  // Print violations
  if (violations.length > 0) {
    console.log(colors.bold + colors.red + '❌ VIOLATIONS (Must Fix):' + colors.reset + '\n');

    violations.forEach(v => {
      console.log(colors.red + `  ${v.type}:` + colors.reset);
      console.log(`    File: ${colors.cyan}${v.file}:${v.line}${colors.reset}`);
      console.log(`    Content: ${colors.yellow}${v.content}${colors.reset}`);
      if (v.pattern) {
        console.log(`    Pattern: ${colors.magenta}${v.pattern}${colors.reset}`);
      }
      console.log('');
    });
  } else {
    console.log(colors.bold + colors.green + '✅ No violations found!' + colors.reset + '\n');
  }

  // Print warnings
  if (warnings.length > 0) {
    console.log(colors.bold + colors.yellow + '⚠️  WARNINGS (Should Review):' + colors.reset + '\n');

    warnings.forEach(w => {
      console.log(colors.yellow + `  ${w.type}:` + colors.reset);
      console.log(`    File: ${colors.cyan}${w.file}:${w.line}${colors.reset}`);
      console.log(`    Content: ${w.content}`);
      console.log('');
    });
  }

  // Print summary
  console.log(colors.bold + colors.cyan + '='.repeat(80) + colors.reset);

  if (violations.length === 0 && warnings.length === 0) {
    console.log(colors.bold + colors.green + '✅ All checks passed! Design system compliance verified.' + colors.reset);
  } else if (violations.length === 0) {
    console.log(colors.bold + colors.yellow + '⚠️  No violations, but some warnings to review.' + colors.reset);
  } else {
    console.log(colors.bold + colors.red + `❌ Found ${violations.length} violation(s). Please fix before committing.` + colors.reset);
  }

  console.log(colors.bold + colors.cyan + '='.repeat(80) + colors.reset + '\n');
}

/**
 * Main execution
 */
function main() {
  console.log(colors.bold + '\n🔍 Checking design system compliance...\n' + colors.reset);

  // Find all component files
  const componentsDir = path.join(__dirname, '..', 'components');
  const appDir = path.join(__dirname, '..', 'app');

  let files = [];
  if (fs.existsSync(componentsDir)) {
    files = files.concat(findTsxFiles(componentsDir));
  }
  if (fs.existsSync(appDir)) {
    files = files.concat(findTsxFiles(appDir));
  }

  // Check each file
  files.forEach(file => {
    stats.filesChecked++;
    const result = checkFile(file);

    if (result.violations.length > 0) {
      violations = violations.concat(result.violations);
      stats.violationsFound += result.violations.length;
    }

    if (result.warnings.length > 0) {
      warnings = warnings.concat(result.warnings);
      stats.warningsFound += result.warnings.length;
    }
  });

  // Print results
  printResults();

  // Exit with error code if violations found
  if (violations.length > 0) {
    process.exit(1);
  }
}

// Run the checker
main();
