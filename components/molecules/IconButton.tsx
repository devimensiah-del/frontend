/**
 * IconButton Molecule
 *
 * Button with icon only (no text).
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import type { LucideIcon } from "lucide-react";

// ============================================
// TYPES
// ============================================

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string; // For accessibility
  variant?: "default" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

// ============================================
// COMPONENT
// ============================================

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon: IconComponent, label, variant = "default", size = "md", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      default: "bg-navy-900 text-white hover:bg-gold-500 hover:text-navy-900",
      ghost: "hover:bg-surface-paper hover:text-gold-500",
      destructive: "bg-semantic-error text-white hover:bg-semantic-error-dark",
    };

    const sizes = {
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-12 h-12",
    };

    const iconSizes = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          "rounded-none",
          className
        )}
        aria-label={label}
        {...props}
      >
        <IconComponent className={iconSizes[size]} aria-hidden="true" />
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
