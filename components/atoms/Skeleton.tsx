/**
 * Skeleton Atom
 *
 * Loading placeholder component.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";

// ============================================
// TYPES
// ============================================

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

// ============================================
// COMPONENT
// ============================================

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "rectangular", width, height, style, ...props }, ref) => {
    const variants = {
      text: "h-4 rounded-sm",
      circular: "rounded-full",
      rectangular: "rounded-none",
    };

    const combinedStyle: React.CSSProperties = {
      ...(width && { width: typeof width === "number" ? `${width}px` : width }),
      ...(height && { height: typeof height === "number" ? `${height}px` : height }),
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cn(
          "animate-pulse bg-line",
          variants[variant],
          className
        )}
        style={combinedStyle}
        role="status"
        aria-label="Loading"
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);

Skeleton.displayName = "Skeleton";
