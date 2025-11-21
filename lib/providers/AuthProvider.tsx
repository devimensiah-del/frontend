'use client';

/**
 * Authentication Provider
 * Hybrid approach: Supabase for auth, Backend API for data
 * - Supabase handles: signIn, signUp, signOut, password reset
 * - Backend API handles: user profile data, authorization
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/utils/supabase-client';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from backend API (not direct DB query)
  const fetchUserProfile = async (session: Session): Promise<User | null> => {
    try {
      // Get Supabase JWT token
      const token = session.access_token;

      // Call backend API with Supabase token for verification
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/auth/me`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.error('Failed to fetch user profile:', response.statusText);
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSupabaseUser(session?.user ?? null);

      if (session) {
        fetchUserProfile(session).then(setUser);
      }

      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setSupabaseUser(session?.user ?? null);

      if (session) {
        const profile = await fetchUserProfile(session);
        setUser(profile);
      } else {
        setUser(null);
      }

      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign in - Use backend proxy for authentication
  const signIn = async (email: string, password: string) => {
    try {
      // Call backend proxy instead of Supabase directly
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(errorData.message || 'Invalid credentials');
      }

      const data = await response.json();

      // Backend returns the Supabase session - extract token and user
      const token = data.access_token || data.token;
      if (!token) {
        throw new Error('No access token received');
      }

      // Save token to localStorage for API calls
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
      }

      // Set Supabase session manually for supabase.auth state
      if (data.user) {
        await supabase.auth.setSession({
          access_token: token,
          refresh_token: data.refresh_token || '',
        });
      }

      // Fetch user profile from backend
      const session = await supabase.auth.getSession();
      if (session.data.session) {
        const profile = await fetchUserProfile(session.data.session);
        setUser(profile);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Login failed');
    }
  };

  // Sign up - Use backend proxy
  const signUp = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, fullName: name }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Signup failed' }));
        throw new Error(errorData.message || 'Failed to create account');
      }

      const data = await response.json();

      // Save token and set session
      const token = data.access_token || data.token;
      if (token && typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
      }

      if (data.user && token) {
        await supabase.auth.setSession({
          access_token: token,
          refresh_token: data.refresh_token || '',
        });
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Signup failed');
    }
  };

  // Sign out
  const signOut = async () => {
    // Clear localStorage token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    setUser(null);
    setSupabaseUser(null);
    setSession(null);
  };

  // Send password reset email
  const sendPasswordReset = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  // Update password
  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  // Refetch user profile
  const refetch = async () => {
    if (session) {
      const profile = await fetchUserProfile(session);
      setUser(profile);
    }
  };

  const value: AuthContextType = {
    user,
    supabaseUser,
    session,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    sendPasswordReset,
    updatePassword,
    refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
