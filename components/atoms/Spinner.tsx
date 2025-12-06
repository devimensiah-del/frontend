/**
 * Spinner Atom
 *
 * Loading indicator component.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";

// ============================================
// TYPES
// ============================================

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  color?: "navy" | "gold" | "white";
}

// ============================================
// COMPONENT
// ============================================

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", color = "navy", ...props }, ref) => {
    const sizes = {
      sm: "w-4 h-4 border-2",
      md: "w-6 h-6 border-2",
      lg: "w-8 h-8 border-3",
    };

    const colors = {
      navy: "border-navy-900/20 border-t-navy-900",
      gold: "border-gold-500/20 border-t-gold-500",
      white: "border-white/20 border-t-white",
    };

    return (
      <div
        ref={ref}
        className={cn("inline-block animate-spin rounded-full", sizes[size], colors[color], className)}
        role="status"
        aria-label="Loading"
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);

Spinner.displayName = "Spinner";
