/**
 * Textarea Atom
 *
 * Multi-line text input component.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";

// ============================================
// TYPES
// ============================================

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  fullWidth?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

// ============================================
// COMPONENT
// ============================================

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error = false, fullWidth = false, resize = "vertical", ...props }, ref) => {
    const baseStyles = "bg-surface-paper border border-line min-h-[120px] px-4 py-3 text-sm transition-colors focus:outline-none focus:border-navy-900 disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-text-tertiary";

    const resizeStyles = {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize",
    };

    return (
      <textarea
        ref={ref}
        className={cn(
          baseStyles,
          error && "border-semantic-error focus:border-semantic-error",
          fullWidth && "w-full",
          resizeStyles[resize],
          "rounded-none",
          className
        )}
        aria-invalid={error}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
