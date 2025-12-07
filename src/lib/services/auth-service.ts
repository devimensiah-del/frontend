import api from '@/lib/api'
import type { AuthResponse, User } from '@/lib/types'

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', { email, password })
    return response.data
  },

  async signup(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/signup', {
      email: data.email,
      password: data.password,
      full_name: data.name,
    })
    return response.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/forgot-password', { email })
    return response.data
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/reset-password', {
      token,
      new_password: newPassword,
    })
    return response.data
  },

  async updatePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>('/auth/password', {
      current_password: currentPassword,
      new_password: newPassword,
    })
    return response.data
  },

  async getMe(): Promise<{ user: User }> {
    const response = await api.get<{ user: User }>('/auth/me')
    return response.data
  },

  async updateProfile(data: { fullName?: string }): Promise<{ user: User }> {
    const response = await api.put<{ user: User }>('/auth/profile', {
      full_name: data.fullName,
    })
    return response.data
  },
}
