/**
 * Button Atom
 *
 * The foundational button component with multiple variants and sizes.
 * Follows the editorial aesthetic of the IMENSIAH platform.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";

// ============================================
// TYPES
// ============================================

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "architect" | "outline" | "ghost" | "destructive" | "link";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

// ============================================
// COMPONENT
// ============================================

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "architect", size = "md", loading = false, disabled, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-heading font-medium uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      architect: "bg-navy-900 text-white hover:bg-gold-500 hover:text-navy-900",
      outline: "border border-line bg-transparent hover:bg-white hover:text-gold-500",
      ghost: "hover:bg-surface-paper hover:text-gold-500",
      destructive: "bg-semantic-error text-white hover:bg-semantic-error-dark",
      link: "text-gold-500 underline-offset-4 hover:underline",
    };

    const sizes = {
      sm: "h-9 px-6 text-xs tracking-widest",
      md: "h-12 px-8 text-xs tracking-widest",
      lg: "h-14 px-10 text-sm tracking-wider",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          variant !== "link" && "rounded-none",
          className
        )}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
