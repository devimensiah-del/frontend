/**
 * Centralized error handling utilities
 * Provides consistent error formatting and logging
 */

export interface ErrorContext {
  component?: string;
  action?: string;
  data?: unknown;
}

export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500,
    public context?: ErrorContext
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 'VALIDATION_ERROR', 400, context);
    this.name = 'ValidationError';
  }
}

export class AuthError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 'AUTH_ERROR', 401, context);
    this.name = 'AuthError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 'NOT_FOUND', 404, context);
    this.name = 'NotFoundError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 'NETWORK_ERROR', 503, context);
    this.name = 'NetworkError';
  }
}

/**
 * Format error message for user display
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof AppError) {
    switch (error.code) {
      case 'VALIDATION_ERROR':
        return 'Verifique os dados inseridos e tente novamente.';
      case 'AUTH_ERROR':
        return 'Você precisa estar autenticado para realizar esta ação.';
      case 'NOT_FOUND':
        return 'O recurso solicitado não foi encontrado.';
      case 'NETWORK_ERROR':
        return 'Ocorreu um erro de conexão. Por favor, tente novamente.';
      default:
        return error.message || 'Um erro inesperado ocorreu. Tente novamente.';
    }
  }

  if (error instanceof Error) {
    return error.message || 'Um erro inesperado ocorreu.';
  }

  return 'Um erro inesperado ocorreu. Por favor, tente novamente.';
}

/**
 * Log error with context
 */
export function logError(
  error: unknown,
  context?: ErrorContext
): void {
  const timestamp = new Date().toISOString();

  if (process.env.NODE_ENV === 'development') {
    console.error('[ERROR]', timestamp, {
      error,
      context,
    });
  }

  if (process.env.NODE_ENV === 'production') {
    const errorData = {
      timestamp,
      message: error instanceof Error ? error.message : String(error),
      context,
      url: typeof window !== 'undefined' ? window.location.href : 'N/A',
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'N/A',
    };

    try {
      navigator.sendBeacon(
        '/api/logs/errors',
        JSON.stringify(errorData)
      );
    } catch (e) {
      console.error('Failed to send error to server:', e);
    }
  }
}

/**
 * Safely parse error response
 */
export function parseErrorResponse(error: unknown): {
  message: string;
  code: string;
  statusCode: number;
} {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
      statusCode: 500,
    };
  }

  return {
    message: String(error),
    code: 'UNKNOWN_ERROR',
    statusCode: 500,
  };
}
