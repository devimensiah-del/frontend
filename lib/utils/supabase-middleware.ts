/**
 * Supabase Middleware Helper
 * Utilities for authentication in Next.js middleware
 */

import { createClient } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Get authenticated user from request
 */
export async function getAuthUser(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase not configured - authentication disabled');
      return null;
    }

    // Try to get token from cookie or Authorization header
    const cookieToken = request.cookies.get('imensiah-auth-token')?.value;
    const authHeader = request.headers.get('Authorization');
    const headerToken = authHeader?.replace('Bearer ', '');

    const token = cookieToken || headerToken;

    if (!token) {
      return null;
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    // Get user
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error getting auth user:', error);
    return null;
  }
}

/**
 * Check if user has admin role
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return false;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userId)
      .single();

    return profile?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Validate session token
 */
export async function validateSessionToken(token: string): Promise<boolean> {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return false;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: { user }, error } = await supabase.auth.getUser(token);

    return !error && !!user;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
}
