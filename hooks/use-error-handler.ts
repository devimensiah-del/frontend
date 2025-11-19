/**
 * Hook for handling errors in async operations
 * Provides consistent error handling across components
 */

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import {
  logError,
  getUserFriendlyMessage,
  type ErrorContext,
} from '@/lib/utils/error-handler';

interface UseErrorHandlerOptions {
  onError?: (error: unknown) => void;
  showToast?: boolean;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback(
    (err: unknown, context?: ErrorContext) => {
      const errorObj = err instanceof Error ? err : new Error(String(err));

      setError(errorObj);
      logError(err, context);

      if (options.showToast !== false) {
        const message = getUserFriendlyMessage(err);
        toast.error(message);
      }

      options.onError?.(err);
    },
    [options]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
    hasError: error !== null,
  };
}

/**
 * Hook for handling async operations with error handling
 */
interface UseAsyncOptions extends UseErrorHandlerOptions {
  onSuccess?: (data: unknown) => void;
}

export function useAsync<T>(
  asyncFn: () => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { error, handleError, clearError } = useErrorHandler(options);

  const execute = useCallback(async () => {
    clearError();
    setIsLoading(true);

    try {
      const result = await asyncFn();
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [asyncFn, handleError, clearError, options]);

  return {
    data,
    error,
    isLoading,
    execute,
    clearError,
  };
}
