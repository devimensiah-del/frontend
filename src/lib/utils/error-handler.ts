import { AxiosError } from 'axios'

export interface AppError {
  code: string
  message: string
  title: string
}

export const ERROR_MESSAGES: Record<string, AppError> = {
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Por favor, faca login novamente.',
    title: 'Sessao expirada',
  },
  FORBIDDEN: {
    code: 'FORBIDDEN',
    message: 'Voce nao tem permissao para acessar este recurso.',
    title: 'Acesso negado',
  },
  NOT_FOUND: {
    code: 'NOT_FOUND',
    message: 'O recurso solicitado nao foi encontrado.',
    title: 'Nao encontrado',
  },
  RATE_LIMITED: {
    code: 'RATE_LIMITED',
    message: 'Muitas requisicoes. Aguarde um momento.',
    title: 'Limite excedido',
  },
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'Por favor, verifique os dados informados.',
    title: 'Erro de validacao',
  },
  SERVER_ERROR: {
    code: 'SERVER_ERROR',
    message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.',
    title: 'Erro interno',
  },
  NETWORK_ERROR: {
    code: 'NETWORK_ERROR',
    message: 'Falha na conexao. Verifique sua internet.',
    title: 'Erro de conexao',
  },
  UNKNOWN: {
    code: 'UNKNOWN',
    message: 'Ocorreu um erro inesperado.',
    title: 'Erro',
  },
}

export function getErrorMessage(error: unknown): AppError {
  // Handle Axios errors
  if (error instanceof AxiosError) {
    const status = error.response?.status
    const serverMessage = error.response?.data?.error || error.response?.data?.message

    switch (status) {
      case 401:
        return {
          ...ERROR_MESSAGES.UNAUTHORIZED,
          message: serverMessage || ERROR_MESSAGES.UNAUTHORIZED.message,
        }
      case 403:
        return {
          ...ERROR_MESSAGES.FORBIDDEN,
          message: serverMessage || ERROR_MESSAGES.FORBIDDEN.message,
        }
      case 404:
        return {
          ...ERROR_MESSAGES.NOT_FOUND,
          message: serverMessage || ERROR_MESSAGES.NOT_FOUND.message,
        }
      case 429:
        return {
          ...ERROR_MESSAGES.RATE_LIMITED,
          message: serverMessage || ERROR_MESSAGES.RATE_LIMITED.message,
        }
      case 400:
      case 422:
        return {
          ...ERROR_MESSAGES.VALIDATION_ERROR,
          message: serverMessage || ERROR_MESSAGES.VALIDATION_ERROR.message,
        }
      case 500:
      case 502:
      case 503:
        return {
          ...ERROR_MESSAGES.SERVER_ERROR,
          message: serverMessage || ERROR_MESSAGES.SERVER_ERROR.message,
        }
      default:
        if (!error.response) {
          return ERROR_MESSAGES.NETWORK_ERROR
        }
        return {
          ...ERROR_MESSAGES.UNKNOWN,
          message: serverMessage || ERROR_MESSAGES.UNKNOWN.message,
        }
    }
  }

  // Handle generic Error objects
  if (error instanceof Error) {
    return {
      code: 'ERROR',
      title: 'Erro',
      message: error.message || ERROR_MESSAGES.UNKNOWN.message,
    }
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      code: 'ERROR',
      title: 'Erro',
      message: error,
    }
  }

  return ERROR_MESSAGES.UNKNOWN
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return !error.response
  }
  return false
}

export function isAuthError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 401
  }
  return false
}
