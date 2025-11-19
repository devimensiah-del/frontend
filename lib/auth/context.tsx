'use client';

// Authentication Context Provider
// Manages user authentication state across the app using Backend Proxy

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as authApi from '@/lib/api/auth';
import { User } from '@/types';
import { isTestMode, getMockUser } from '@/lib/test-mode';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      if (isTestMode()) {
        // Mock user for test mode
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mockUser: any = getMockUser();
        if (mockUser) {
            // Map mock user to our User type if needed
            setUser({
                id: mockUser.id,
                email: mockUser.email || '',
                name: mockUser.user_metadata?.name || 'Test User',
                role: mockUser.user_metadata?.role || 'user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });
        }
        setLoading(false);
        return;
      }

      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        setToken(storedToken);
        try {
          const response = await authApi.getCurrentUser(storedToken);
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            // Token invalid or expired
            localStorage.removeItem(TOKEN_KEY);
            setToken(null);
          }
        } catch (error) {
          console.error('Auth init error:', error);
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (isTestMode()) {
      // ... mock logic ...
      return { error: null };
    }

    try {
      const response = await authApi.login(email, password);
      
      if (!response.success || !response.data) {
        return { error: response.error || 'Login failed' };
      }

      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      setUser(newUser);
      
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Login failed' };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (isTestMode()) {
      return { error: null };
    }

    try {
      const response = await authApi.signup({ email, password, name });

      if (!response.success || !response.data) {
        return { error: response.error || 'Signup failed' };
      }

      const { token: newToken, user: newUser } = response.data;

      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      setUser(newUser);

      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Signup failed' };
    }
  };

  const signOut = async () => {
    if (isTestMode()) {
      setUser(null);
      return;
    }

    if (token) {
      try {
        await authApi.logout(token);
      } catch (e) {
        console.error('Logout error:', e);
      }
    }

    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    router.push('/');
  };

  const refreshUser = async () => {
    if (token) {
      const response = await authApi.getCurrentUser(token);
      if (response.success && response.data) {
        setUser(response.data);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signIn,
        signUp,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook to require authentication
export function useRequireAuth(redirectTo = '/auth/login') {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  return { user, loading };
}

// Hook to require admin role
export function useRequireAdmin() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  return { user, loading };
}
