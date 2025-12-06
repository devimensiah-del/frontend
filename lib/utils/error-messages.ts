/**
 * Error Message Utilities
 *
 * Centralized error message handling for production-ready error display.
 * Maps technical errors to user-friendly Portuguese messages.
 */

/**
 * Get user-friendly error message from error object
 *
 * @param error - Error object or unknown error
 * @returns User-friendly error message in Portuguese
 */
export function getErrorMessage(error: unknown): string {
  // Handle Error instances
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Authentication errors
    if (message.includes('401') || message.includes('unauthorized') || message.includes('not authenticated')) {
      return 'Sua sessão expirou. Por favor, faça login novamente.';
    }

    // Authorization errors
    if (message.includes('403') || message.includes('forbidden') || message.includes('permission')) {
      return 'Você não tem permissão para acessar este recurso.';
    }

    // Not found errors
    if (message.includes('404') || message.includes('not found')) {
      return 'Recurso não encontrado.';
    }

    // Validation errors
    if (message.includes('invalid') || message.includes('validation')) {
      return 'Dados inválidos. Por favor, verifique os campos e tente novamente.';
    }

    // Network errors
    if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
      return 'Erro de conexão. Verifique sua internet e tente novamente.';
    }

    // Rate limiting
    if (message.includes('429') || message.includes('rate limit') || message.includes('too many')) {
      return 'Muitas tentativas. Por favor, aguarde alguns minutos e tente novamente.';
    }

    // Server errors
    if (message.includes('500') || message.includes('internal server') || message.includes('server error')) {
      return 'Erro no servidor. Nossa equipe já foi notificada. Tente novamente em alguns minutos.';
    }

    // Service unavailable
    if (message.includes('503') || message.includes('unavailable')) {
      return 'Serviço temporariamente indisponível. Tente novamente em alguns minutos.';
    }

    // Return original message if no mapping found (fallback)
    return error.message || 'Ocorreu um erro. Por favor, tente novamente.';
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle object with message property
  if (error && typeof error === 'object' && 'message' in error) {
    return getErrorMessage((error as any).message);
  }

  // Default fallback
  return 'Ocorreu um erro inesperado. Por favor, tente novamente.';
}

/**
 * Get error title based on error type
 *
 * @param error - Error object or unknown error
 * @returns Error title in Portuguese
 */
export function getErrorTitle(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('401') || message.includes('unauthorized')) {
      return 'Sessão Expirada';
    }

    if (message.includes('403') || message.includes('forbidden')) {
      return 'Acesso Negado';
    }

    if (message.includes('404') || message.includes('not found')) {
      return 'Não Encontrado';
    }

    if (message.includes('network') || message.includes('timeout')) {
      return 'Erro de Conexão';
    }

    if (message.includes('500') || message.includes('server error')) {
      return 'Erro no Servidor';
    }
  }

  return 'Erro';
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('network') || message.includes('fetch') || message.includes('timeout');
  }
  return false;
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('401') || message.includes('unauthorized') || message.includes('not authenticated');
  }
  return false;
}

/**
 * Check if error is an authorization error
 */
export function isPermissionError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('403') || message.includes('forbidden') || message.includes('permission');
  }
  return false;
}
