/**
 * Form Field Components
 *
 * Reusable form field components with consistent styling,
 * error handling, and accessibility features.
 *
 * @module components/forms/form-field
 */

'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/design';

/**
 * Base field props shared across all form fields
 */
interface BaseFieldProps {
  /** Field label text */
  label: string;
  /** Field name/id */
  name: string;
  /** Whether field is required */
  required?: boolean;
  /** Error message to display */
  error?: string;
  /** Warning message to display */
  warning?: string;
  /** Helper text to display below field */
  helperText?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Input Field Component
 *
 * Renders a text input with label, error handling, and validation feedback.
 *
 * @example
 * ```tsx
 * <InputField
 *   label="Email"
 *   name="email"
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   required
 *   error={emailError}
 * />
 * ```
 */
export interface InputFieldProps extends BaseFieldProps {
  type?: 'text' | 'email' | 'tel' | 'url' | 'number' | 'password';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  error,
  warning,
  helperText,
  className,
  disabled,
}: InputFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={cn(
          error && 'border-red-500 focus:ring-red-500',
          warning && 'border-yellow-500 focus:ring-yellow-500'
        )}
        aria-invalid={!!error}
        aria-describedby={
          error
            ? `${name}-error`
            : warning
            ? `${name}-warning`
            : helperText
            ? `${name}-helper`
            : undefined
        }
      />

      {/* Error message */}
      {error && (
        <div
          id={`${name}-error`}
          className="flex items-center gap-2 text-sm text-red-600"
          role="alert"
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Warning message */}
      {!error && warning && (
        <div
          id={`${name}-warning`}
          className="flex items-center gap-2 text-sm text-yellow-600"
        >
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>{warning}</span>
        </div>
      )}

      {/* Helper text */}
      {!error && !warning && helperText && (
        <p id={`${name}-helper`} className="text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}

/**
 * Textarea Field Component
 *
 * Renders a multi-line textarea with label and validation feedback.
 *
 * @example
 * ```tsx
 * <TextareaField
 *   label="Descreva seu desafio"
 *   name="challenge"
 *   value={challenge}
 *   onChange={(e) => setChallenge(e.target.value)}
 *   minLength={100}
 *   maxLength={800}
 *   required
 * />
 * ```
 */
export interface TextareaFieldProps extends BaseFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  minLength?: number;
  maxLength?: number;
  showCharCount?: boolean;
  disabled?: boolean;
}

export function TextareaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  minLength,
  maxLength,
  showCharCount = false,
  required,
  error,
  warning,
  helperText,
  className,
  disabled,
}: TextareaFieldProps) {
  const charCount = value.length;
  const isValid =
    (!minLength || charCount >= minLength) &&
    (!maxLength || charCount <= maxLength);

  const getCharCountColor = () => {
    if (minLength && charCount < minLength) return 'text-red-500';
    if (minLength && charCount < minLength * 2) return 'text-yellow-600';
    if (maxLength && charCount <= maxLength) return 'text-green-600';
    if (maxLength && charCount > maxLength) return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <Textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        minLength={minLength}
        maxLength={maxLength}
        required={required}
        disabled={disabled}
        className={cn(
          'resize-none',
          error && 'border-red-500 focus:ring-red-500',
          warning && 'border-yellow-500 focus:ring-yellow-500'
        )}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${name}-error` : helperText ? `${name}-helper` : undefined
        }
      />

      {/* Character count */}
      {showCharCount && maxLength && (
        <div className={cn('text-sm text-right font-medium', getCharCountColor())}>
          {charCount}/{maxLength}
          {minLength && charCount < minLength && ` (faltam ${minLength - charCount})`}
          {charCount >= (minLength || 0) && charCount <= maxLength && ' ✓'}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div
          id={`${name}-error`}
          className="flex items-center gap-2 text-sm text-red-600"
          role="alert"
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Warning message */}
      {!error && warning && (
        <div className="flex items-center gap-2 text-sm text-yellow-600">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>{warning}</span>
        </div>
      )}

      {/* Helper text */}
      {!error && !warning && helperText && (
        <p id={`${name}-helper`} className="text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}

/**
 * Select Field Component
 *
 * Renders a select dropdown with label and validation feedback.
 *
 * @example
 * ```tsx
 * <SelectField
 *   label="Setor"
 *   name="industry"
 *   value={industry}
 *   onValueChange={setIndustry}
 *   options={[
 *     { value: 'tecnologia', label: 'Tecnologia' },
 *     { value: 'saude', label: 'Saúde' }
 *   ]}
 *   required
 * />
 * ```
 */
export interface SelectFieldProps extends Omit<BaseFieldProps, 'name'> {
  name: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  disabled?: boolean;
}

export function SelectField({
  label,
  name,
  value,
  onValueChange,
  options,
  placeholder = 'Selecione...',
  required,
  error,
  warning,
  helperText,
  className,
  disabled,
}: SelectFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <Select
        value={value}
        onValueChange={onValueChange}
        required={required}
        disabled={disabled}
      >
        <SelectTrigger
          id={name}
          className={cn(
            error && 'border-red-500',
            warning && 'border-yellow-500'
          )}
          aria-invalid={!!error}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600" role="alert">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Warning message */}
      {!error && warning && (
        <div className="flex items-center gap-2 text-sm text-yellow-600">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>{warning}</span>
        </div>
      )}

      {/* Helper text */}
      {!error && !warning && helperText && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
