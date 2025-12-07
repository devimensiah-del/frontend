'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/services/auth-service'
import type { User } from '@/lib/types'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, fullName: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      const { user } = await authService.getMe()
      setUser(user)
    } catch {
      localStorage.removeItem('auth_token')
      document.cookie = 'sb-access-token=; path=/; max-age=0'
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password)
    localStorage.setItem('auth_token', response.access_token)
    document.cookie = `sb-access-token=${response.access_token}; path=/; max-age=${response.expires_in || 3600}`
    setUser(response.user)
    router.push('/dashboard')
  }

  const signup = async (email: string, password: string, fullName: string) => {
    const response = await authService.signup({ name: fullName, email, password })
    localStorage.setItem('auth_token', response.access_token)
    document.cookie = `sb-access-token=${response.access_token}; path=/; max-age=${response.expires_in || 3600}`
    setUser(response.user)
    router.push('/dashboard')
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch {
      // Continue with logout even if API call fails
    }
    localStorage.removeItem('auth_token')
    document.cookie = 'sb-access-token=; path=/; max-age=0'
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
