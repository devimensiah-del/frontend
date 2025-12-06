/**
 * Select Atom
 *
 * Native select dropdown component.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";

// ============================================
// TYPES
// ============================================

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  fullWidth?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error = false, fullWidth = false, children, ...props }, ref) => {
    return (
      <div className={cn("relative", fullWidth && "w-full")}>
        <select
          ref={ref}
          className={cn(
            "appearance-none bg-surface-paper border border-line h-12 px-4 pr-10 text-sm transition-colors",
            "focus:outline-none focus:border-navy-900",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "rounded-none cursor-pointer",
            error && "border-semantic-error focus:border-semantic-error",
            fullWidth && "w-full",
            className
          )}
          aria-invalid={error}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary pointer-events-none"
          aria-hidden="true"
        />
      </div>
    );
  }
);

Select.displayName = "Select";
