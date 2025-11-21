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

  // Sign in
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.session) {
      const profile = await fetchUserProfile(data.session);
      setUser(profile);
    }

    return data;
  };

  // Sign up
  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
        // Email confirmation disabled - users can login immediately
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    // User can sign in immediately without email verification
    return data;
  };

  // Sign out
  const signOut = async () => {
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
