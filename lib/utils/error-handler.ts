/**
 * Error Handler Utility
 *
 * Centralized error handling utilities for API errors,
 * user-friendly messages, and error logging
 */

// Error types
export type ErrorType =
  | "validation"
  | "authentication"
  | "authorization"
  | "not_found"
  | "server"
  | "network"
  | "unknown";

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: unknown;
  statusCode?: number;
}

/**
 * Error messages in Portuguese
 */
const ERROR_MESSAGES: Record<ErrorType, string> = {
  validation: "Por favor, verifique os dados enviados e tente novamente.",
  authentication: "Sua sessão expirou. Por favor, faça login novamente.",
  authorization: "Você não tem permissão para acessar este recurso.",
  not_found: "O recurso solicitado não foi encontrado.",
  server: "Erro no servidor. Por favor, tente novamente mais tarde.",
  network: "Problema de conexão. Verifique sua internet e tente novamente.",
  unknown: "Ocorreu um erro inesperado. Por favor, tente novamente.",
};

/**
 * Get error type based on status code or error object
 */
export function getErrorType(error: unknown): ErrorType {
  // Network errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return "network";
  }

  // API errors with status codes
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status: number }).status;

    if (status === 400) return "validation";
    if (status === 401) return "authentication";
    if (status === 403) return "authorization";
    if (status === 404) return "not_found";
    if (status >= 500) return "server";
  }

  // Default to unknown
  return "unknown";
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  // If error has a message property
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    const message = (error as { message: string }).message;

    // Return custom message if it's user-friendly
    // Otherwise, return generic message based on error type
    if (message && !message.toLowerCase().includes("error")) {
      return message;
    }
  }

  // Get error type and return appropriate message
  const errorType = getErrorType(error);
  return ERROR_MESSAGES[errorType];
}

/**
 * Handle API errors and format them consistently
 */
export function handleApiError(error: unknown): AppError {
  const errorType = getErrorType(error);
  const message = getErrorMessage(error);

  const appError: AppError = {
    type: errorType,
    message,
    originalError: error,
  };

  // Extract status code if available
  if (typeof error === "object" && error !== null && "status" in error) {
    appError.statusCode = (error as { status: number }).status;
  }

  // Log the error
  logError(appError);

  return appError;
}

/**
 * Log error to console (in production, send to error tracking service)
 */
export function logError(error: AppError | unknown): void {
  // In development, log full error details
  if (process.env.NODE_ENV === "development") {
    console.error("[Error Handler]", {
      type: (error as AppError).type || "unknown",
      message: (error as AppError).message || "Unknown error",
      originalError: (error as AppError).originalError || error,
      timestamp: new Date().toISOString(),
    });
  } else {
    // In production, log minimal info to console
    console.error(
      "[Error]",
      (error as AppError).message || "An error occurred"
    );

    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // Example: Sentry.captureException(error);
  }
}

/**
 * Create a standardized error response for API routes
 */
export function createErrorResponse(
  error: unknown,
  defaultMessage = "Ocorreu um erro ao processar sua solicitação."
): { error: string; status: number } {
  const appError = handleApiError(error);

  return {
    error: appError.message || defaultMessage,
    status: appError.statusCode || 500,
  };
}

/**
 * Check if error is a specific type
 */
export function isErrorType(error: unknown, type: ErrorType): boolean {
  return getErrorType(error) === type;
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx)
      if (isErrorType(error, "validation") ||
          isErrorType(error, "authentication") ||
          isErrorType(error, "authorization") ||
          isErrorType(error, "not_found")) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      if (i < maxRetries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, delayMs * Math.pow(2, i))
        );
      }
    }
  }

  throw lastError;
}
