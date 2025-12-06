/**
 * FormField Molecule
 *
 * Combines Label + Input/Textarea + Error message.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import { Label } from "../atoms/Label";
import { Input, InputProps } from "../atoms/Input";
import { Textarea, TextareaProps } from "../atoms/Textarea";

// ============================================
// TYPES
// ============================================

export interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  type?: "input" | "textarea";
  inputProps?: InputProps;
  textareaProps?: TextareaProps;
}

// ============================================
// COMPONENT
// ============================================

export const FormField = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  ({ label, error, hint, required, className, labelClassName, type = "input", inputProps, textareaProps }, ref) => {
    const id = inputProps?.id || textareaProps?.id || `field-${label.toLowerCase().replace(/\s+/g, "-")}`;
    const hasError = Boolean(error);

    return (
      <div className={cn("w-full", className)}>
        <Label
          htmlFor={id}
          required={required}
          className={labelClassName}
        >
          {label}
        </Label>

        {type === "input" ? (
          <Input
            ref={ref as React.Ref<HTMLInputElement>}
            id={id}
            error={hasError}
            fullWidth
            aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
            {...inputProps}
          />
        ) : (
          <Textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={id}
            error={hasError}
            fullWidth
            aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
            {...textareaProps}
          />
        )}

        {hint && !error && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-text-tertiary">
            {hint}
          </p>
        )}

        {error && (
          <p id={`${id}-error`} className="mt-1.5 text-xs text-semantic-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";
