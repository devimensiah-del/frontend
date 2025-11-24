/**
 * Utility functions barrel export
 *
 * Note: workflow.ts, workflow-helpers.ts, and workflow-labels.ts have overlapping exports.
 * We export workflow.ts as the canonical source and avoid conflicts.
 */

export { cn } from './cn';
export * from './date';
export * from './status';
export * from './workflow'; // Main workflow utilities
export * from './icons';
export * from './mobile';
export * from './accessibility';
export * from './error-handler';

// Note: workflow-helpers.ts and workflow-labels.ts have conflicting exports with workflow.ts
// Import them directly when needed: import { ... } from '@/lib/utils/workflow-helpers'
