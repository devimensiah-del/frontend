/**
 * API Client - Base Module
 *
 * Core fetch wrapper with error handling, authentication, and type safety.
 * All API modules use this base client.
 *
 * @module lib/api/base
 */

import type { ApiResponse } from '@/types';

/**
 * API base URL from environment variables
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Fetch options interface with optional token
 */
export interface FetchOptions extends RequestInit {
  token?: string;
}

/**
 * Base API fetch wrapper
 *
 * Handles:
 * - Authentication headers
 * - Error responses
 * - JSON parsing
 * - Type safety
 *
 * @param endpoint - API endpoint (e.g., '/api/v1/submissions')
 * @param options - Fetch options including optional auth token
 * @returns Typed API response
 *
 * @example
 * ```typescript
 * const response = await apiFetch<User>('/api/v1/auth/me', {
 *   token: 'abc123'
 * });
 *
 * if (response.success) {
 *   console.log(response.data);
 * } else {
 *   console.error(response.error);
 * }
 * ```
 */
export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { token, ...fetchOptions } = options;

  // Build headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    // Parse JSON response
    const data = await response.json().catch(() => ({}));

    // Handle error responses
    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || 'Request failed',
      };
    }

    // Success response
    return {
      success: true,
      data: (data.data || data) as T,
      message: data.message,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection and try again.',
    };
  }
}

/**
 * Get API base URL
 *
 * @returns Current API base URL
 */
export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

/**
 * Build full URL for images and assets
 *
 * @param path - Relative or absolute path
 * @returns Full URL
 *
 * @example
 * ```typescript
 * buildImageUrl('/uploads/logo.png') // 'http://api.com/uploads/logo.png'
 * buildImageUrl('https://cdn.com/image.png') // 'https://cdn.com/image.png'
 * ```
 */
export function buildImageUrl(path?: string): string {
  if (!path) return '/images/placeholder.png';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
}
