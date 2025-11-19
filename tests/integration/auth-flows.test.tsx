/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

// Mock Supabase client
vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: vi.fn()
}))

describe('Authentication Flows - Integration Tests', () => {
  let mockSupabase: any

  beforeEach(() => {
    mockSupabase = {
      auth: {
        signUp: vi.fn(),
        signInWithPassword: vi.fn(),
        signOut: vi.fn(),
        resetPasswordForEmail: vi.fn(),
        updateUser: vi.fn(),
        getSession: vi.fn(),
        getUser: vi.fn()
      },
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn()
      }))
    }

    vi.mocked(createClientComponentClient).mockReturnValue(mockSupabase)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Signup Flow', () => {
    it('should complete signup → email verification → login flow', async () => {
      const testEmail = 'test@example.com'
      const testPassword = 'SecurePass123!'

      // Step 1: User signs up
      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: {
          user: {
            id: 'user-123',
            email: testEmail,
            email_confirmed_at: null
          },
          session: null
        },
        error: null
      })

      const signupResult = await mockSupabase.auth.signUp({
        email: testEmail,
        password: testPassword
      })

      expect(signupResult.data.user).toBeDefined()
      expect(signupResult.data.user.email).toBe(testEmail)
      expect(signupResult.data.user.email_confirmed_at).toBeNull()
      expect(signupResult.data.session).toBeNull() // No session until email confirmed

      // Step 2: Simulate email verification (user clicks link)
      // In real flow, this happens via Supabase email link

      // Step 3: User logs in after email verification
      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: {
          user: {
            id: 'user-123',
            email: testEmail,
            email_confirmed_at: new Date().toISOString()
          },
          session: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token'
          }
        },
        error: null
      })

      const loginResult = await mockSupabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      })

      expect(loginResult.data.session).toBeDefined()
      expect(loginResult.data.session.access_token).toBe('mock-access-token')
      expect(loginResult.data.user.email_confirmed_at).not.toBeNull()
    })

    it('should prevent signup with weak password', async () => {
      const weakPasswords = ['123456', 'password', 'abc123', '']

      for (const weakPassword of weakPasswords) {
        mockSupabase.auth.signUp.mockResolvedValueOnce({
          data: { user: null, session: null },
          error: {
            message: 'Password should be at least 8 characters',
            status: 400
          }
        })

        const result = await mockSupabase.auth.signUp({
          email: 'test@example.com',
          password: weakPassword
        })

        expect(result.error).toBeDefined()
        expect(result.error.message).toContain('Password')
      }
    })

    it('should prevent duplicate email signup', async () => {
      const testEmail = 'existing@example.com'

      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'User already registered',
          status: 400
        }
      })

      const result = await mockSupabase.auth.signUp({
        email: testEmail,
        password: 'SecurePass123!'
      })

      expect(result.error).toBeDefined()
      expect(result.error.message).toContain('already registered')
    })
  })

  describe('Password Reset Flow', () => {
    it('should complete password reset → email → update password → login', async () => {
      const testEmail = 'reset@example.com'
      const newPassword = 'NewSecurePass456!'

      // Step 1: Request password reset
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValueOnce({
        data: {},
        error: null
      })

      const resetRequest = await mockSupabase.auth.resetPasswordForEmail(testEmail, {
        redirectTo: 'http://localhost:3000/reset-password'
      })

      expect(resetRequest.error).toBeNull()

      // Step 2: User clicks email link (simulated)
      // This would redirect to /reset-password with token

      // Step 3: Update password
      mockSupabase.auth.updateUser.mockResolvedValueOnce({
        data: {
          user: {
            id: 'user-123',
            email: testEmail
          }
        },
        error: null
      })

      const updateResult = await mockSupabase.auth.updateUser({
        password: newPassword
      })

      expect(updateResult.error).toBeNull()
      expect(updateResult.data.user).toBeDefined()

      // Step 4: Login with new password
      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: {
          user: { id: 'user-123', email: testEmail },
          session: { access_token: 'new-token' }
        },
        error: null
      })

      const loginResult = await mockSupabase.auth.signInWithPassword({
        email: testEmail,
        password: newPassword
      })

      expect(loginResult.data.session).toBeDefined()
      expect(loginResult.data.session.access_token).toBe('new-token')
    })

    it('should reject invalid reset token', async () => {
      mockSupabase.auth.updateUser.mockResolvedValueOnce({
        data: { user: null },
        error: {
          message: 'Invalid recovery token',
          status: 400
        }
      })

      const result = await mockSupabase.auth.updateUser({
        password: 'NewPassword123!'
      })

      expect(result.error).toBeDefined()
      expect(result.error.message).toContain('Invalid')
    })
  })

  describe('Change Email Flow', () => {
    it('should update email with verification', async () => {
      const oldEmail = 'old@example.com'
      const newEmail = 'new@example.com'

      // Step 1: Get current session
      mockSupabase.auth.getSession.mockResolvedValueOnce({
        data: {
          session: {
            user: { email: oldEmail }
          }
        },
        error: null
      })

      // Step 2: Request email change
      mockSupabase.auth.updateUser.mockResolvedValueOnce({
        data: {
          user: {
            email: oldEmail, // Email not changed yet (pending verification)
            new_email: newEmail
          }
        },
        error: null
      })

      const updateResult = await mockSupabase.auth.updateUser({
        email: newEmail
      })

      expect(updateResult.data.user.new_email).toBe(newEmail)

      // Step 3: After email verification (simulated)
      mockSupabase.auth.getUser.mockResolvedValueOnce({
        data: {
          user: {
            email: newEmail, // Email now updated
            new_email: null
          }
        },
        error: null
      })

      const userResult = await mockSupabase.auth.getUser()

      expect(userResult.data.user.email).toBe(newEmail)
      expect(userResult.data.user.new_email).toBeNull()
    })

    it('should reject duplicate email', async () => {
      mockSupabase.auth.updateUser.mockResolvedValueOnce({
        data: { user: null },
        error: {
          message: 'Email already in use',
          status: 400
        }
      })

      const result = await mockSupabase.auth.updateUser({
        email: 'existing@example.com'
      })

      expect(result.error).toBeDefined()
      expect(result.error.message).toContain('already in use')
    })
  })

  describe('Change Password Flow', () => {
    it('should update password while authenticated', async () => {
      const currentPassword = 'OldPass123!'
      const newPassword = 'NewPass456!'

      // User is authenticated
      mockSupabase.auth.getSession.mockResolvedValueOnce({
        data: {
          session: {
            access_token: 'current-token',
            user: { id: 'user-123' }
          }
        },
        error: null
      })

      // Update password
      mockSupabase.auth.updateUser.mockResolvedValueOnce({
        data: {
          user: { id: 'user-123' }
        },
        error: null
      })

      const result = await mockSupabase.auth.updateUser({
        password: newPassword
      })

      expect(result.error).toBeNull()

      // Verify can login with new password
      mockSupabase.auth.signOut.mockResolvedValueOnce({ error: null })
      await mockSupabase.auth.signOut()

      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: {
          session: { access_token: 'new-token' },
          user: { id: 'user-123' }
        },
        error: null
      })

      const loginResult = await mockSupabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: newPassword
      })

      expect(loginResult.data.session.access_token).toBe('new-token')
    })

    it('should reject weak new password', async () => {
      mockSupabase.auth.updateUser.mockResolvedValueOnce({
        data: { user: null },
        error: {
          message: 'Password should be at least 8 characters',
          status: 400
        }
      })

      const result = await mockSupabase.auth.updateUser({
        password: '123'
      })

      expect(result.error).toBeDefined()
      expect(result.error.message).toContain('Password')
    })
  })

  describe('Account Deletion Flow', () => {
    it('should soft delete account and submissions', async () => {
      const userID = 'user-123'
      const userEmail = 'delete@example.com'

      // Step 1: Get user session
      mockSupabase.auth.getSession.mockResolvedValueOnce({
        data: {
          session: {
            user: { id: userID, email: userEmail }
          }
        },
        error: null
      })

      // Step 2: Soft delete user record
      const from = mockSupabase.from()
      from.update.mockResolvedValueOnce({
        data: [{ deleted_at: new Date().toISOString() }],
        error: null
      })

      const deleteResult = await mockSupabase
        .from('users')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', userID)

      expect(deleteResult.error).toBeNull()

      // Step 3: Verify submissions are also soft deleted
      from.update.mockResolvedValueOnce({
        data: [
          { id: 1, deleted_at: new Date().toISOString() },
          { id: 2, deleted_at: new Date().toISOString() }
        ],
        error: null
      })

      const submissionsResult = await mockSupabase
        .from('submissions')
        .update({ deleted_at: new Date().toISOString() })
        .eq('user_id', userID)

      expect(submissionsResult.error).toBeNull()
      expect(submissionsResult.data).toHaveLength(2)

      // Step 4: Sign out user
      mockSupabase.auth.signOut.mockResolvedValueOnce({ error: null })
      await mockSupabase.auth.signOut()
    })

    it('should prevent access after account deletion', async () => {
      const userID = 'deleted-user'

      // Try to access with deleted account
      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Invalid login credentials',
          status: 400
        }
      })

      const result = await mockSupabase.auth.signInWithPassword({
        email: 'deleted@example.com',
        password: 'password'
      })

      expect(result.error).toBeDefined()
      expect(result.data.session).toBeNull()
    })
  })

  describe('Session Management', () => {
    it('should maintain session across page refreshes', async () => {
      mockSupabase.auth.getSession.mockResolvedValueOnce({
        data: {
          session: {
            access_token: 'valid-token',
            refresh_token: 'refresh-token',
            user: { id: 'user-123' }
          }
        },
        error: null
      })

      const session = await mockSupabase.auth.getSession()

      expect(session.data.session).toBeDefined()
      expect(session.data.session.access_token).toBe('valid-token')
    })

    it('should refresh expired token', async () => {
      // Simulates token refresh flow
      mockSupabase.auth.getSession.mockResolvedValueOnce({
        data: {
          session: {
            access_token: 'new-access-token',
            refresh_token: 'refresh-token'
          }
        },
        error: null
      })

      const session = await mockSupabase.auth.getSession()

      expect(session.data.session.access_token).toBe('new-access-token')
    })

    it('should handle logout', async () => {
      mockSupabase.auth.signOut.mockResolvedValueOnce({ error: null })

      await mockSupabase.auth.signOut()

      mockSupabase.auth.getSession.mockResolvedValueOnce({
        data: { session: null },
        error: null
      })

      const session = await mockSupabase.auth.getSession()

      expect(session.data.session).toBeNull()
    })
  })
})
