import React from "react";
import { cn } from "@/lib/utils/cn";
import { createId } from "@/lib/utils/accessibility";
import { Label } from "./Typography";
import { Input } from "./Input";

/* ============================================
   FORM FIELD COMPONENT - Label + Input
   ============================================ */

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  helperText?: string;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, id, required, error, helperText, className, ...props }, ref) => {
    const errorId = error ? createId(`${id}-error`) : undefined;
    const helperId = helperText ? createId(`${id}-helper`) : undefined;
    const ariaDescribedBy = [errorId, helperId].filter(Boolean).join(' ');

    return (
      <div className={cn("space-y-2", className)}>
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
        <Input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy || undefined}
          aria-required={required}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs text-red-500 mt-1" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-xs text-text-tertiary mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";
