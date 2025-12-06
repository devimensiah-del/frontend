/**
 * Grid Layout
 *
 * Responsive grid system.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";

// ============================================
// TYPES
// ============================================

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cols?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: "none" | "sm" | "md" | "lg";
}

// ============================================
// COMPONENT
// ============================================

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, children, cols = { base: 1, md: 2, lg: 3 }, gap = "md", ...props }, ref) => {
    const gapSizes = {
      none: "gap-0",
      sm: "gap-4",
      md: "gap-6",
      lg: "gap-8",
    };

    // Build grid columns classes
    const gridCols = [
      cols.base && `grid-cols-${cols.base}`,
      cols.sm && `sm:grid-cols-${cols.sm}`,
      cols.md && `md:grid-cols-${cols.md}`,
      cols.lg && `lg:grid-cols-${cols.lg}`,
      cols.xl && `xl:grid-cols-${cols.xl}`,
    ].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={cn(
          "grid",
          gridCols || "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
          gapSizes[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = "Grid";
