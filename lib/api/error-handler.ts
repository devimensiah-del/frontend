/**
 * API Error Handler
 * Handles HTTP errors and provides user-friendly messages in Portuguese
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Error messages in Portuguese for common HTTP status codes
 */
const ERROR_MESSAGES: Record<number, string> = {
  400: 'Requisição inválida. Verifique os dados enviados.',
  401: 'Você precisa estar autenticado para acessar este recurso.',
  403: 'Você não tem permissão para acessar este recurso.',
  404: 'Recurso não encontrado.',
  409: 'Conflito. Este recurso já existe.',
  422: 'Dados inválidos. Verifique os campos enviados.',
  429: 'Muitas requisições. Tente novamente em alguns instantes.',
  500: 'Erro interno do servidor. Tente novamente mais tarde.',
  502: 'Servidor temporariamente indisponível. Tente novamente.',
  503: 'Serviço temporariamente indisponível. Tente novamente.',
  504: 'Timeout na requisição. Tente novamente.',
};

/**
 * Handle HTTP response errors
 */
export async function handleApiError(response: Response): Promise<never> {
  let errorData: any;

  try {
    errorData = await response.json();
  } catch {
    // If response is not JSON, use default message
    errorData = {};
  }

  // Use backend error message if available, otherwise use default
  const message =
    errorData.error ||
    errorData.message ||
    ERROR_MESSAGES[response.status] ||
    'Erro desconhecido. Tente novamente.';

  throw new ApiError(
    message,
    response.status,
    errorData.code,
    errorData.details
  );
}

/**
 * Handle network errors (no response from server)
 */
export function handleNetworkError(error: unknown): never {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    throw new ApiError(
      'Erro de rede. Verifique sua conexão com a internet.',
      0,
      'NETWORK_ERROR'
    );
  }

  if (error instanceof ApiError) {
    throw error;
  }

  throw new ApiError(
    'Erro desconhecido. Tente novamente.',
    0,
    'UNKNOWN_ERROR',
    error
  );
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

/**
 * Check if error is a permission error
 */
export function isPermissionError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 403;
}

/**
 * Check if error is a not found error
 */
export function isNotFoundError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: unknown): boolean {
  return error instanceof ApiError && (error.status === 400 || error.status === 422);
}

/**
 * Get user-friendly error message from error object
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Erro desconhecido. Tente novamente.';
}
