/**
 * Radio Atom
 *
 * Custom radio button component.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";

// ============================================
// TYPES
// ============================================

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  error?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, error = false, checked, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center">
        <input
          type="radio"
          ref={ref}
          className="sr-only peer"
          checked={checked}
          {...props}
        />
        <div
          className={cn(
            "w-5 h-5 rounded-full border-2 border-line bg-surface-white transition-all cursor-pointer flex items-center justify-center",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-gold-500 peer-focus-visible:ring-offset-2",
            "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
            error && "border-semantic-error",
            className
          )}
        >
          {checked && (
            <div className={cn(
              "w-2.5 h-2.5 rounded-full",
              error ? "bg-semantic-error" : "bg-navy-900"
            )} />
          )}
        </div>
      </div>
    );
  }
);

Radio.displayName = "Radio";
