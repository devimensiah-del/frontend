/**
 * Stack Layout
 *
 * Vertical or horizontal spacing utility.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";

// ============================================
// TYPES
// ============================================

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  direction?: "vertical" | "horizontal";
  spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
}

// ============================================
// COMPONENT
// ============================================

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({
    className,
    children,
    direction = "vertical",
    spacing = "md",
    align = "stretch",
    justify = "start",
    ...props
  }, ref) => {
    const spacings = {
      none: "gap-0",
      xs: "gap-2",
      sm: "gap-4",
      md: "gap-6",
      lg: "gap-8",
      xl: "gap-12",
    };

    const alignments = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    };

    const justifications = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
    };

    const directions = {
      vertical: "flex-col",
      horizontal: "flex-row",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          directions[direction],
          spacings[spacing],
          alignments[align],
          justifications[justify],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Stack.displayName = "Stack";
