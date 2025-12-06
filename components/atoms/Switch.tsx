/**
 * Switch Atom
 *
 * Toggle switch component.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";

// ============================================
// TYPES
// ============================================

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  size?: "sm" | "md";
}

// ============================================
// COMPONENT
// ============================================

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, size = "md", checked, ...props }, ref) => {
    const sizes = {
      sm: {
        track: "w-9 h-5",
        thumb: "w-4 h-4",
        translate: "translate-x-4",
      },
      md: {
        track: "w-11 h-6",
        thumb: "w-5 h-5",
        translate: "translate-x-5",
      },
    };

    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          ref={ref}
          className="sr-only peer"
          role="switch"
          aria-checked={checked}
          checked={checked}
          {...props}
        />
        <div
          className={cn(
            "relative rounded-full bg-line transition-colors",
            "peer-checked:bg-navy-900",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-gold-500 peer-focus-visible:ring-offset-2",
            "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
            sizes[size].track,
            className
          )}
        >
          <div
            className={cn(
              "absolute top-0.5 left-0.5 bg-white rounded-full transition-transform",
              sizes[size].thumb,
              checked && sizes[size].translate
            )}
          />
        </div>
      </label>
    );
  }
);

Switch.displayName = "Switch";
