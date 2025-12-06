/**
 * Checkbox Atom
 *
 * Custom checkbox component with checked state indicator.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import { Check } from "lucide-react";

// ============================================
// TYPES
// ============================================

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  error?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, error = false, checked, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          ref={ref}
          className="sr-only peer"
          checked={checked}
          aria-invalid={error}
          {...props}
        />
        <div
          className={cn(
            "w-5 h-5 border-2 border-line bg-surface-white transition-all cursor-pointer",
            "peer-checked:bg-navy-900 peer-checked:border-navy-900",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-gold-500 peer-focus-visible:ring-offset-2",
            "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
            error && "border-semantic-error peer-checked:border-semantic-error peer-checked:bg-semantic-error",
            className
          )}
        >
          {checked && (
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
