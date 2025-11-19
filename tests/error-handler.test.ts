/**
 * Tests for error handling system
 * These are example tests demonstrating error handling patterns
 */

import {
  AppError,
  ValidationError,
  AuthError,
  NotFoundError,
  NetworkError,
  getUserFriendlyMessage,
  logError,
  parseErrorResponse,
} from '@/lib/utils/error-handler';

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create error with message and code', () => {
      const error = new AppError(
        'Something went wrong',
        'CUSTOM_ERROR',
        500,
        { component: 'Test' }
      );

      expect(error.message).toBe('Something went wrong');
      expect(error.code).toBe('CUSTOM_ERROR');
      expect(error.statusCode).toBe(500);
      expect(error.context?.component).toBe('Test');
    });
  });

  describe('ValidationError', () => {
    it('should create validation error', () => {
      const error = new ValidationError('Email is invalid');

      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe('ValidationError');
    });
  });

  describe('AuthError', () => {
    it('should create auth error', () => {
      const error = new AuthError('Not authenticated');

      expect(error.code).toBe('AUTH_ERROR');
      expect(error.statusCode).toBe(401);
    });
  });

  describe('NotFoundError', () => {
    it('should create not found error', () => {
      const error = new NotFoundError('User not found');

      expect(error.code).toBe('NOT_FOUND');
      expect(error.statusCode).toBe(404);
    });
  });

  describe('NetworkError', () => {
    it('should create network error', () => {
      const error = new NetworkError('Connection failed');

      expect(error.code).toBe('NETWORK_ERROR');
      expect(error.statusCode).toBe(503);
    });
  });
});

describe('Error Handling Utilities', () => {
  describe('getUserFriendlyMessage', () => {
    it('should return validation error message', () => {
      const error = new ValidationError('Invalid data');
      const message = getUserFriendlyMessage(error);

      expect(message).toContain('dados');
    });

    it('should return auth error message', () => {
      const error = new AuthError('Unauthorized');
      const message = getUserFriendlyMessage(error);

      expect(message).toContain('autenticado');
    });

    it('should return not found error message', () => {
      const error = new NotFoundError('Not found');
      const message = getUserFriendlyMessage(error);

      expect(message).toContain('não foi encontrado');
    });

    it('should return network error message', () => {
      const error = new NetworkError('Network failed');
      const message = getUserFriendlyMessage(error);

      expect(message).toContain('conexão');
    });

    it('should handle generic Error', () => {
      const error = new Error('Generic error');
      const message = getUserFriendlyMessage(error);

      expect(message).toBe('Generic error');
    });

    it('should handle unknown error types', () => {
      const message = getUserFriendlyMessage('Unknown error');

      expect(message).toBe('Unknown error');
    });
  });

  describe('parseErrorResponse', () => {
    it('should parse AppError', () => {
      const error = new ValidationError('Invalid');
      const parsed = parseErrorResponse(error);

      expect(parsed.code).toBe('VALIDATION_ERROR');
      expect(parsed.statusCode).toBe(400);
      expect(parsed.message).toBe('Invalid');
    });

    it('should parse generic Error', () => {
      const error = new Error('Test error');
      const parsed = parseErrorResponse(error);

      expect(parsed.code).toBe('UNKNOWN_ERROR');
      expect(parsed.statusCode).toBe(500);
      expect(parsed.message).toBe('Test error');
    });

    it('should parse string error', () => {
      const parsed = parseErrorResponse('String error');

      expect(parsed.code).toBe('UNKNOWN_ERROR');
      expect(parsed.statusCode).toBe(500);
      expect(parsed.message).toBe('String error');
    });
  });

  describe('logError', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should log error in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new AppError('Test error', 'TEST_ERROR');
      logError(error, { component: 'Test' });

      expect(console.error).toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });
  });
});

describe('Error Handling Patterns', () => {
  it('should chain errors', () => {
    try {
      try {
        throw new Error('Original error');
      } catch (error) {
        throw new AppError(
          'Failed to process',
          'PROCESS_ERROR',
          500,
          { originalError: error }
        );
      }
    } catch (error) {
      expect(error instanceof AppError).toBe(true);
      expect((error as AppError).code).toBe('PROCESS_ERROR');
    }
  });

  it('should preserve error context', () => {
    const context = {
      component: 'MyComponent',
      action: 'fetchData',
      data: { userId: 123 },
    };

    const error = new AppError('Failed', 'FETCH_ERROR', 500, context);

    expect(error.context).toEqual(context);
    expect(error.context?.data).toEqual({ userId: 123 });
  });
});
