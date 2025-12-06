/**
 * Input Atom
 *
 * Base input component following the editorial aesthetic.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";

// ============================================
// TYPES
// ============================================

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  fullWidth?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error = false, fullWidth = false, ...props }, ref) => {
    const baseStyles = "bg-surface-paper border border-line h-12 px-4 text-sm transition-colors focus:outline-none focus:border-navy-900 disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-text-tertiary";

    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          baseStyles,
          error && "border-semantic-error focus:border-semantic-error",
          fullWidth && "w-full",
          "rounded-none",
          className
        )}
        aria-invalid={error}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
