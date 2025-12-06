/**
 * Section Layout
 *
 * Editorial section component with variants.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";

// ============================================
// TYPES
// ============================================

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: "default" | "hero" | "dark" | "grid" | "paper";
  noBorder?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, variant = "default", noBorder = false, children, ...props }, ref) => {
    const variants = {
      default: "bg-surface-white",
      hero: "min-h-[80vh]",
      dark: "bg-navy-900 text-white",
      grid: "grid md:grid-cols-3 divide-x divide-line bg-white",
      paper: "bg-surface-paper",
    };

    return (
      <section
        ref={ref}
        className={cn(
          variants[variant],
          !noBorder && "border-b border-line",
          className
        )}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = "Section";
