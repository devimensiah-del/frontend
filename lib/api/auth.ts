/**
 * API Client - Authentication Module
 *
 * Handles all authentication-related API calls.
 *
 * @module lib/api/auth
 */

import { apiFetch } from './base';
import type { User, AuthResponse } from '@/types';

/**
 * Login with email and password
 *
 * @param email - User email
 * @param password - User password
 * @returns User data and auth token
 */
export async function login(email: string, password: string) {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Sign up new user
 *
 * @param data - User registration data
 * @returns User data and auth token
 */
export async function signup(data: {
  name: string;
  email: string;
  password: string;
}) {
  return apiFetch<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Request password reset email
 *
 * @param email - User email
 * @returns Success message
 */
export async function resetPassword(email: string) {
  return apiFetch<{ message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * Verify auth token validity
 *
 * @param token - Auth token to verify
 * @returns User data if valid
 */
export async function verifyToken(token: string) {
  return apiFetch<User>('/auth/verify', {
    method: 'GET',
    token,
  });
}

/**
 * Get current user profile
 *
 * @param token - Auth token
 * @returns User profile data
 */
export async function getCurrentUser(token: string) {
  return apiFetch<User>('/auth/me', {
    method: 'GET',
    token,
  });
}

/**
 * Logout (invalidate token on server)
 *
 * @param token - Auth token to invalidate
 * @returns Success message
 */
export async function logout(token: string) {
  // Since we use JWTs, server-side logout isn't strictly necessary unless we blacklist tokens.
  // For now, we just return success.
  return {
    success: true,
    data: { message: 'Logged out successfully' },
    message: 'Logged out successfully'
  };
}

/**
 * Update user profile
 *
 * @param data - Profile data to update
 * @param token - Auth token
 * @returns Updated user data
 */
export async function updateProfile(
  data: Partial<User>,
  token: string
) {
  return apiFetch<User>('/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
    token,
  });
}
