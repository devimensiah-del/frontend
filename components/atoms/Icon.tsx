/**
 * Icon Atom
 *
 * Wrapper for lucide-react icons with consistent sizing.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import type { LucideIcon } from "lucide-react";

// ============================================
// TYPES
// ============================================

export interface IconProps extends React.SVGAttributes<SVGElement> {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg" | "xl";
}

// ============================================
// COMPONENT
// ============================================

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, icon: IconComponent, size = "md", ...props }, ref) => {
    const sizes = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
      xl: "w-8 h-8",
    };

    return (
      <IconComponent
        ref={ref}
        className={cn(sizes[size], className)}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

Icon.displayName = "Icon";
