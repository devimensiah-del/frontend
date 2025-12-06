/**
 * StatDisplay Molecule
 *
 * Displays a metric value with label and optional trend.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

// ============================================
// TYPES
// ============================================

export interface StatDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  label: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  size?: "sm" | "md" | "lg";
  highlight?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export const StatDisplay = React.forwardRef<HTMLDivElement, StatDisplayProps>(
  ({ className, value, label, trend, trendValue, size = "md", highlight = false, ...props }, ref) => {
    const valueSizes = {
      sm: "text-2xl",
      md: "text-4xl",
      lg: "text-6xl",
    };

    const labelSizes = {
      sm: "text-[9px]",
      md: "text-xs",
      lg: "text-xs",
    };

    const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
    const trendColor = trend === "up" ? "text-semantic-success" : trend === "down" ? "text-semantic-error" : "text-text-tertiary";

    return (
      <div
        ref={ref}
        className={cn("flex flex-col", className)}
        {...props}
      >
        <div className={cn(
          "font-heading font-light mb-2",
          valueSizes[size],
          highlight ? "text-gold-500" : "text-navy-900"
        )}>
          {value}
        </div>

        <div className="flex items-center gap-2">
          <div className={cn(
            "uppercase tracking-widest font-bold",
            labelSizes[size],
            "text-text-tertiary"
          )}>
            {label}
          </div>

          {trend && trendValue && (
            <div className={cn("flex items-center gap-1 text-xs", trendColor)}>
              <TrendIcon className="w-3 h-3" aria-hidden="true" />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

StatDisplay.displayName = "StatDisplay";
