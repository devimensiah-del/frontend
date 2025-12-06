/**
 * ToastContainer Organism
 *
 * Container for displaying toast notifications.
 */

"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

// ============================================
// TYPES
// ============================================

export interface ToastContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
  children: React.ReactNode;
}

// ============================================
// COMPONENT
// ============================================

export const ToastContainer = React.forwardRef<HTMLDivElement, ToastContainerProps>(
  ({ className, position = "top-right", children, ...props }, ref) => {
    const positions = {
      "top-right": "top-4 right-4",
      "top-left": "top-4 left-4",
      "bottom-right": "bottom-4 right-4",
      "bottom-left": "bottom-4 left-4",
      "top-center": "top-4 left-1/2 -translate-x-1/2",
      "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "fixed z-tooltip flex flex-col gap-2 pointer-events-none",
          positions[position],
          className
        )}
        role="region"
        aria-label="Notifications"
        {...props}
      >
        <div className="pointer-events-auto flex flex-col gap-2">
          {children}
        </div>
      </div>
    );
  }
);

ToastContainer.displayName = "ToastContainer";
