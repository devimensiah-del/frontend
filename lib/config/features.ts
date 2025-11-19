/**
 * Feature Flags Configuration
 *
 * Centralized feature flag management for the IMENSIAH platform.
 * Enables/disables features without code changes.
 *
 * @module lib/config/features
 */

/**
 * Feature flag configuration object
 *
 * Usage:
 * ```typescript
 * import { features } from '@/lib/config/features';
 * if (features.guestSubmissions) { ... }
 * ```
 */
export const features = {
  /**
   * Allow guest users to submit forms without creating an account
   * When enabled, users can submit reports and optionally create account later
   * @default true
   */
  guestSubmissions: true,

  /**
   * Require payment before processing submission
   * When disabled, submissions are processed without payment (for testing/demos)
   * @default false - Temporarily disabled per requirements
   */
  requirePayment: false,

  /**
   * Enable Stripe payment integration
   * @default false - Temporarily disabled
   */
  stripeEnabled: false,

  /**
   * Enable real-time status updates via WebSocket
   * @default false
   */
  realtimeUpdates: false,

  /**
   * Enable advanced analytics dashboard
   * @default true
   */
  adminAnalytics: true,

  /**
   * Enable conflict detection UI in admin panel
   * @default true
   */
  conflictDetection: true,

  /**
   * Enable report sharing via email
   * @default true
   */
  reportSharing: true,

  /**
   * Show enrichment data quality scores
   * @default true
   */
  qualityScores: true,

  /**
   * Enable PDF download for reports
   * @default true
   */
  pdfDownload: true,

  /**
   * Maximum submissions per user (0 = unlimited)
   * @default 0
   */
  maxSubmissionsPerUser: 0,

  /**
   * Enable email notifications
   * @default true
   */
  emailNotifications: true,
} as const;

/**
 * Type for feature flags
 */
export type FeatureFlags = typeof features;

/**
 * Check if a feature is enabled
 *
 * @param featureName - Name of the feature to check
 * @returns Whether the feature is enabled
 *
 * @example
 * ```typescript
 * if (isFeatureEnabled('guestSubmissions')) {
 *   // Allow guest submission
 * }
 * ```
 */
export function isFeatureEnabled(featureName: keyof FeatureFlags): boolean {
  return Boolean(features[featureName]);
}

/**
 * Feature flag environment variable overrides
 * Allows runtime configuration via environment variables
 */
export function getFeatureFromEnv(featureName: keyof FeatureFlags): boolean {
  const envKey = `NEXT_PUBLIC_FEATURE_${featureName.toUpperCase()}`;
  const envValue = process.env[envKey];

  if (envValue === undefined) {
    return features[featureName] as boolean;
  }

  return envValue === 'true' || envValue === '1';
}
