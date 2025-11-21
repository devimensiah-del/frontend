import React from "react";
import { cn } from "@/lib/utils/cn";
import { createId } from "@/lib/utils/accessibility";
import { Label } from "./Typography";

/* ============================================
   FORM FIELD WRAPPER - Label + Custom Children
   Use this when you need custom input structures (e.g., input with button)
   ============================================ */

interface FormFieldWrapperProps {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  children: React.ReactNode;
}

export const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
  label,
  id,
  required,
  error,
  helperText,
  className,
  children,
}) => {
  const errorId = error ? createId(`${id}-error`) : undefined;
  const helperId = helperText ? createId(`${id}-helper`) : undefined;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {children}
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
};

FormFieldWrapper.displayName = "FormFieldWrapper";
