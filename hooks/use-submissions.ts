/**
 * Custom Hook - useSubmissions
 *
 * Manages submission data fetching, mutations, and caching with React Query.
 * Provides a consistent API for working with submissions throughout the app.
 *
 * @module hooks/use-submissions
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import type {
  Submission,
  SubmissionFormInput,
  SubmissionsFilters,
  PaginatedResponse,
} from '@/types';
import {
  getSubmissions,
  getSubmission,
  createSubmission,
  updateSubmission,
  updateSubmissionStatus,
  approveSubmission,
} from '@/lib/api/client';

/**
 * Hook for fetching paginated list of submissions
 *
 * @param filters - Optional filters for querying submissions
 * @returns React Query result with submissions data
 *
 * @example
 * ```typescript
 * const { data, isLoading, error } = useSubmissionsList({
 *   status: ['in_review'],
 *   page: 1,
 *   per_page: 10
 * });
 * ```
 */
export function useSubmissionsList(filters?: SubmissionsFilters) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['submissions', 'list', filters],
    queryFn: async () => {
      const response = await getSubmissions(filters, user?.token);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch submissions');
      }
      return response.data as PaginatedResponse<Submission>;
    },
    enabled: !!user,
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Hook for fetching a single submission by ID
 *
 * @param submissionId - Submission ID to fetch
 * @returns React Query result with submission data
 *
 * @example
 * ```typescript
 * const { data: submission, isLoading } = useSubmission('123');
 * ```
 */
export function useSubmission(submissionId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['submissions', 'detail', submissionId],
    queryFn: async () => {
      if (!submissionId) throw new Error('Submission ID required');

      const response = await getSubmission(submissionId, user?.token);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch submission');
      }
      return response.data as Submission;
    },
    enabled: !!submissionId && !!user,
    staleTime: 15000, // 15 seconds (shorter for real-time updates)
  });
}

/**
 * Hook for creating a new submission
 *
 * Automatically invalidates submission list cache on success.
 * Handles guest user submissions (no auth required).
 *
 * @returns React Query mutation for creating submission
 *
 * @example
 * ```typescript
 * const createMutation = useCreateSubmission();
 *
 * createMutation.mutate(formData, {
 *   onSuccess: (data) => {
 *     console.log('Created:', data.submission);
 *     window.location.href = data.checkout_url;
 *   }
 * });
 * ```
 */
export function useCreateSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SubmissionFormInput) => {
      const response = await createSubmission(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create submission');
      }
      return response.data as { submission: Submission; checkout_url: string };
    },
    onSuccess: () => {
      // Invalidate submissions list cache
      queryClient.invalidateQueries({ queryKey: ['submissions', 'list'] });
    },
  });
}

/**
 * Hook for updating a submission
 *
 * @returns React Query mutation for updating submission
 *
 * @example
 * ```typescript
 * const updateMutation = useUpdateSubmission();
 *
 * updateMutation.mutate({
 *   id: '123',
 *   data: { company_name: 'New Name' }
 * });
 * ```
 */
export function useUpdateSubmission() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Submission>;
    }) => {
      if (!user?.token) throw new Error('Authentication required');

      const response = await updateSubmission(id, data, user.token);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update submission');
      }
      return response.data as Submission;
    },
    onSuccess: (data) => {
      // Update cache for specific submission
      queryClient.setQueryData(['submissions', 'detail', data.id], data);
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: ['submissions', 'list'] });
    },
  });
}

/**
 * Hook for updating submission status
 *
 * @returns React Query mutation for status updates
 *
 * @example
 * ```typescript
 * const statusMutation = useUpdateSubmissionStatus();
 *
 * statusMutation.mutate({
 *   id: '123',
 *   status: 'approved'
 * });
 * ```
 */
export function useUpdateSubmissionStatus() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: Submission['status'];
    }) => {
      if (!user?.token) throw new Error('Authentication required');

      const response = await updateSubmissionStatus(id, status, user.token);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update status');
      }
      return response.data as Submission;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['submissions', 'detail', data.id], data);
      queryClient.invalidateQueries({ queryKey: ['submissions', 'list'] });
    },
  });
}

/**
 * Hook for approving a submission (admin only)
 *
 * @returns React Query mutation for approval
 *
 * @example
 * ```typescript
 * const approveMutation = useApproveSubmission();
 *
 * approveMutation.mutate('123', {
 *   onSuccess: () => {
 *     toast.success('Submission approved!');
 *   }
 * });
 * ```
 */
export function useApproveSubmission() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user?.token) throw new Error('Authentication required');

      const response = await approveSubmission(id, user.token);
      if (!response.success) {
        throw new Error(response.error || 'Failed to approve submission');
      }
      return response.data as Submission;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['submissions', 'detail', data.id], data);
      queryClient.invalidateQueries({ queryKey: ['submissions', 'list'] });
    },
  });
}
