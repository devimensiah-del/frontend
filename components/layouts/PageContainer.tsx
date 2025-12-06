/**
 * PageContainer Layout
 *
 * Page-level wrapper with max-width and responsive padding.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";

// ============================================
// TYPES
// ============================================

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "container" | "full";
  noPadding?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  ({ className, children, maxWidth = "container", noPadding = false, ...props }, ref) => {
    const maxWidths = {
      sm: "max-w-2xl",
      md: "max-w-4xl",
      lg: "max-w-6xl",
      xl: "max-w-7xl",
      container: "max-w-container",
      full: "max-w-full",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "w-full mx-auto",
          maxWidths[maxWidth],
          !noPadding && "px-6 md:px-12",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PageContainer.displayName = "PageContainer";
