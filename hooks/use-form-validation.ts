/**
 * Custom Hook - useFormValidation
 *
 * Provides real-time form validation with helpful feedback.
 * Works with React Hook Form and Zod schemas.
 *
 * @module hooks/use-form-validation
 */

'use client';

import { useState, useCallback } from 'react';
import {
  validateCorporateEmail,
  validateEmailDomainMatch,
  validateTextQuality,
  validateUrl,
  ValidationResult,
} from '@/lib/utils/validators';

/**
 * Field validation state
 */
interface FieldValidation {
  isValid: boolean;
  error?: string;
  warning?: string;
  isPristine: boolean;
}

/**
 * Form validation state
 */
interface FormValidation {
  fields: Record<string, FieldValidation>;
  isFormValid: boolean;
}

/**
 * Hook for enhanced form field validation with real-time feedback
 *
 * @returns Validation helpers and state
 *
 * @example
 * ```typescript
 * const {
 *   validateField,
 *   getFieldError,
 *   getFieldWarning,
 *   isFieldValid,
 *   clearField
 * } = useFormValidation();
 *
 * // In component
 * <Input
 *   onChange={(e) => validateField('email', e.target.value, 'email')}
 *   error={getFieldError('email')}
 * />
 * ```
 */
export function useFormValidation() {
  const [validation, setValidation] = useState<FormValidation>({
    fields: {},
    isFormValid: false,
  });

  /**
   * Validate a single field
   *
   * @param fieldName - Name of the field
   * @param value - Current value
   * @param type - Validation type
   * @param context - Additional context for validation (e.g., website for email match)
   */
  const validateField = useCallback(
    (
      fieldName: string,
      value: string,
      type: 'email' | 'url' | 'text' | 'custom',
      context?: Record<string, any>
    ) => {
      let result: ValidationResult = { isValid: true };

      // Skip validation for empty optional fields
      if (!value && !context?.required) {
        setValidation((prev) => ({
          ...prev,
          fields: {
            ...prev.fields,
            [fieldName]: {
              isValid: true,
              isPristine: false,
            },
          },
        }));
        return;
      }

      // Run appropriate validation
      switch (type) {
        case 'email':
          result = validateCorporateEmail(value);

          // Check domain match if website provided
          if (result.isValid && context?.website) {
            const matchResult = validateEmailDomainMatch(value, context.website);
            if (matchResult.warning) {
              result.warning = matchResult.warning;
            }
          }
          break;

        case 'url':
          result = validateUrl(value, context?.requireHttps);
          break;

        case 'text':
          result = validateTextQuality(
            value,
            context?.minLength || 0,
            context?.maxLength || 10000
          );
          break;

        default:
          break;
      }

      setValidation((prev) => ({
        ...prev,
        fields: {
          ...prev.fields,
          [fieldName]: {
            isValid: result.isValid,
            error: result.error,
            warning: result.warning,
            isPristine: false,
          },
        },
      }));
    },
    []
  );

  /**
   * Get error message for a field
   */
  const getFieldError = useCallback(
    (fieldName: string): string | undefined => {
      return validation.fields[fieldName]?.error;
    },
    [validation]
  );

  /**
   * Get warning message for a field
   */
  const getFieldWarning = useCallback(
    (fieldName: string): string | undefined => {
      return validation.fields[fieldName]?.warning;
    },
    [validation]
  );

  /**
   * Check if field is valid
   */
  const isFieldValid = useCallback(
    (fieldName: string): boolean => {
      return validation.fields[fieldName]?.isValid ?? true;
    },
    [validation]
  );

  /**
   * Check if field has been touched
   */
  const isFieldPristine = useCallback(
    (fieldName: string): boolean => {
      return validation.fields[fieldName]?.isPristine ?? true;
    },
    [validation]
  );

  /**
   * Clear validation for a field
   */
  const clearField = useCallback((fieldName: string) => {
    setValidation((prev) => {
      const { [fieldName]: removed, ...rest } = prev.fields;
      return {
        ...prev,
        fields: rest,
      };
    });
  }, []);

  /**
   * Clear all validation
   */
  const clearAll = useCallback(() => {
    setValidation({
      fields: {},
      isFormValid: false,
    });
  }, []);

  /**
   * Check if entire form is valid
   */
  const checkFormValidity = useCallback(() => {
    const allValid = Object.values(validation.fields).every(
      (field) => field.isValid
    );
    setValidation((prev) => ({ ...prev, isFormValid: allValid }));
    return allValid;
  }, [validation]);

  return {
    validateField,
    getFieldError,
    getFieldWarning,
    isFieldValid,
    isFieldPristine,
    clearField,
    clearAll,
    checkFormValidity,
    validation,
  };
}

/**
 * Hook for character count with visual feedback
 *
 * @param minLength - Minimum required characters
 * @param maxLength - Maximum allowed characters
 * @returns Character count state and helpers
 *
 * @example
 * ```typescript
 * const {
 *   count,
 *   isValid,
 *   getColorClass,
 *   getMessage
 * } = useCharacterCount(100, 800);
 * ```
 */
export function useCharacterCount(minLength: number, maxLength: number) {
  const [count, setCount] = useState(0);

  const isValid = count >= minLength && count <= maxLength;
  const isTooShort = count < minLength;
  const isTooLong = count > maxLength;

  /**
   * Get Tailwind color class based on count
   */
  const getColorClass = useCallback(() => {
    if (count < minLength) return 'text-red-500';
    if (count < minLength * 2) return 'text-yellow-600';
    if (count <= maxLength) return 'text-green-600';
    return 'text-red-500';
  }, [count, minLength, maxLength]);

  /**
   * Get helpful message for user
   */
  const getMessage = useCallback(() => {
    if (isTooShort) {
      return `Faltam ${minLength - count} caracteres para o mínimo`;
    }
    if (isTooLong) {
      return `${count - maxLength} caracteres acima do limite`;
    }
    if (count >= minLength && count < minLength * 2) {
      return 'Bom! Continue escrevendo';
    }
    if (count >= minLength * 2 && count <= maxLength) {
      return 'Ótimo! Descrição detalhada';
    }
    return '';
  }, [count, minLength, maxLength, isTooShort, isTooLong]);

  return {
    count,
    setCount,
    isValid,
    isTooShort,
    isTooLong,
    getColorClass,
    getMessage,
  };
}
