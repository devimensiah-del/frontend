/**
 * API Client - Admin Module
 *
 * Handles all admin-specific API calls including analytics,
 * dashboard stats, and admin operations.
 *
 * @module lib/api/admin
 */

import { apiFetch } from './base';
import type { DashboardStats, AdminAnalytics } from '@/types';

/**
 * Get admin dashboard statistics
 *
 * @param token - Admin auth token (required)
 * @returns Dashboard statistics
 */
export async function getAdminDashboard(token: string) {
  return apiFetch<DashboardStats>('/api/v1/admin/dashboard', {
    method: 'GET',
    token,
  });
}

/**
 * Get admin analytics data
 *
 * @param timeRange - Time range for analytics (7d, 30d, 90d, 1y)
 * @param token - Admin auth token (required)
 * @returns Detailed analytics data
 */
export async function getAdminAnalytics(
  timeRange: '7d' | '30d' | '90d' | '1y' = '30d',
  token: string
) {
  return apiFetch<AdminAnalytics>(
    `/api/v1/admin/analytics?range=${timeRange}`,
    {
      method: 'GET',
      token,
    }
  );
}

/**
 * Get enrichment performance metrics
 *
 * Shows success rates, latency, and costs for each data source.
 *
 * @param token - Admin auth token (required)
 * @returns Enrichment performance data
 */
export async function getEnrichmentPerformance(token: string) {
  return apiFetch<AdminAnalytics['enrichment_performance']>(
    '/api/v1/admin/enrichment/performance',
    {
      method: 'GET',
      token,
    }
  );
}

/**
 * Get system health status
 *
 * @param token - Admin auth token (required)
 * @returns System health metrics
 */
export async function getSystemHealth(token: string) {
  return apiFetch<{
    api: 'healthy' | 'degraded' | 'down';
    database: 'healthy' | 'degraded' | 'down';
    workers: 'healthy' | 'degraded' | 'down';
    queue_depth: number;
    avg_processing_time_ms: number;
  }>('/api/v1/admin/health', {
    method: 'GET',
    token,
  });
}
