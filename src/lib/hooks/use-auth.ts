'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { authService } from '@/lib/services'

export function useLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (data) => {
      localStorage.setItem('auth_token', data.access_token)
      document.cookie = `sb-access-token=${data.access_token}; path=/; max-age=${data.expires_in}`
      queryClient.setQueryData(['auth', 'me'], { user: data.user })
      toast.success('Login realizado com sucesso')
      // Redirect admins to admin dashboard, users to user dashboard
      const isAdmin = data.user?.role === 'admin' || data.user?.role === 'super_admin'
      router.push(isAdmin ? '/admin/submissions' : '/dashboard')
    },
    onError: () => {
      toast.error('Falha no login. Verifique suas credenciais.')
    },
  })
}

export function useSignup() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { name: string; email: string; password: string }) =>
      authService.signup(data),
    onSuccess: (data) => {
      localStorage.setItem('auth_token', data.access_token)
      document.cookie = `sb-access-token=${data.access_token}; path=/; max-age=${data.expires_in}`
      queryClient.setQueryData(['auth', 'me'], { user: data.user })
      toast.success('Conta criada com sucesso')
      router.push('/dashboard')
    },
    onError: () => {
      toast.error('Falha ao criar conta. Tente novamente.')
    },
  })
}

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      localStorage.removeItem('auth_token')
      document.cookie = 'sb-access-token=; path=/; max-age=0'
      queryClient.clear()
      router.push('/')
    },
    onError: () => {
      // Still clear local state even on error
      localStorage.removeItem('auth_token')
      document.cookie = 'sb-access-token=; path=/; max-age=0'
      queryClient.clear()
      router.push('/')
    },
  })
}

export function useMe() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authService.getMe,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: () => {
      toast.success('Email de recuperação enviado')
    },
    onError: () => {
      toast.error('Falha ao enviar email de recuperação')
    },
  })
}

export function useResetPassword() {
  const router = useRouter()

  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authService.resetPassword(token, newPassword),
    onSuccess: () => {
      toast.success('Senha alterada com sucesso')
      router.push('/login')
    },
    onError: () => {
      toast.error('Falha ao alterar senha')
    },
  })
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string
      newPassword: string
    }) => authService.updatePassword(currentPassword, newPassword),
    onSuccess: () => {
      toast.success('Senha atualizada com sucesso')
    },
    onError: () => {
      toast.error('Falha ao atualizar senha')
    },
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { fullName?: string }) => authService.updateProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'me'], data)
      toast.success('Perfil atualizado')
    },
    onError: () => {
      toast.error('Falha ao atualizar perfil')
    },
  })
}
