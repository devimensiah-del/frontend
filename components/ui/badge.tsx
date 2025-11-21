import React from "react";
import { cn } from "@/lib/utils/cn";

/* ============================================
   BADGE COMPONENT - Status Badge
   ============================================ */

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning" | "error" | "gold";
  size?: "sm" | "md" | "lg";
  "aria-label"?: string;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", size = "md", className, children, ...props }, ref) => {
    const variants = {
      default: "bg-gray-100 text-[var(--text-secondary)] border-gray-300",
      primary: "bg-[var(--navy-900)] text-white border-[var(--navy-900)]",
      success: "bg-green-50 text-green-700 border-green-300",
      warning: "bg-yellow-50 text-yellow-700 border-yellow-300",
      error: "bg-red-50 text-red-700 border-red-300",
      gold: "bg-[var(--gold-light)] text-[var(--gold-600)] border-[var(--gold-500)]",
    };

    const sizes = {
      sm: "text-[var(--text-xs)] px-2 py-0.5",
      md: "text-[var(--text-xs)] px-3 py-1",
      lg: "text-[var(--text-sm)] px-4 py-1.5",
    };

    return (
      <span
        ref={ref}
        role="status"
        className={cn(
          "inline-flex items-center justify-center",
          "font-heading font-bold uppercase",
          "border rounded-[var(--radius-full)]",
          "tracking-[var(--tracking-widest)]",
          "transition-colors",
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
