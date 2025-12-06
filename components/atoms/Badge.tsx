/**
 * Badge Atom
 *
 * Small status indicator or label component.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";

// ============================================
// TYPES
// ============================================

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "default" | "step" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
}

// ============================================
// COMPONENT
// ============================================

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, children, variant = "default", size = "md", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-bold uppercase tracking-widest";

    const variants = {
      default: "border border-line bg-transparent text-text-secondary",
      step: "border border-gold-500 bg-transparent text-gold-500",
      success: "border border-semantic-success bg-semantic-success-light text-semantic-success-dark",
      warning: "border border-semantic-warning bg-semantic-warning-light text-semantic-warning-dark",
      error: "border border-semantic-error bg-semantic-error-light text-semantic-error-dark",
      info: "border border-semantic-info bg-semantic-info-light text-semantic-info-dark",
    };

    const sizes = {
      sm: "text-[9px] px-1.5 py-0.5 rounded-full",
      md: "text-xs px-2 py-1 rounded-full",
    };

    return (
      <span
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
