/**
 * Hook for fetching and updating user profile
 * Includes authentication state management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, authApi } from '@/lib/api/client';
import { ApiError } from '@/lib/api/error-handler';
import type { User } from '@/types';

export interface UseProfileOptions {
  enabled?: boolean;
}

export function useProfile(userId?: string, options?: UseProfileOptions) {
  const queryClient = useQueryClient();

  // Fetch user profile
  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => userId ? userApi.getProfile() : authApi.getCurrentUser(),
    enabled: options?.enabled !== false,
    retry: 2,
    staleTime: 60000, // 1 minute
  });

  // Update profile
  const updateMutation = useMutation({
    mutationFn: (data: Partial<User>) => {
      if (!profile?.id) {
        throw new Error('Usuário não autenticado');
      }
      return userApi.updateProfile(data);
    },
    onSuccess: (updatedProfile) => {
      // Update cache
      queryClient.setQueryData(['profile', updatedProfile.id], updatedProfile);
      queryClient.setQueryData(['profile', undefined], updatedProfile);
    },
  });

  // Update password
  const updatePasswordMutation = useMutation({
    mutationFn: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
      authApi.updatePassword(oldPassword, newPassword),
  });

  return {
    profile,
    isLoading,
    error: error as ApiError | null,
    refetch,
    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error as ApiError | null,
    updatePassword: updatePasswordMutation.mutateAsync,
    isUpdatingPassword: updatePasswordMutation.isPending,
    updatePasswordError: updatePasswordMutation.error as ApiError | null,
  };
}

/**
 * Hook for authentication actions
 */
export function useAuth() {
  const queryClient = useQueryClient();

  // Login
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (user) => {
      // Set user in cache
      queryClient.setQueryData(['profile', undefined], user);
    },
  });

  // Signup
  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (user) => {
      // Set user in cache
      queryClient.setQueryData(['profile', undefined], user);
    },
  });

  // Logout
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear all cache
      queryClient.clear();
    },
  });

  // Forgot password
  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
  });

  // Reset password
  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
  });

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error as ApiError | null,
    signup: signupMutation.mutateAsync,
    isSigningUp: signupMutation.isPending,
    signupError: signupMutation.error as ApiError | null,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    isSendingReset: forgotPasswordMutation.isPending,
    forgotPasswordError: forgotPasswordMutation.error as ApiError | null,
    resetPassword: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,
    resetPasswordError: resetPasswordMutation.error as ApiError | null,
  };
}
