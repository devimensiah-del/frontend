import React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils/cn";

/* ============================================
   PROGRESS COMPONENT - Progress Bar
   ============================================ */

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "error";
  showValue?: boolean;
}

export const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, max = 100, variant = "default", showValue = false, ...props }, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variants = {
    default: "bg-[var(--navy-900)]",
    success: "bg-green-600",
    warning: "bg-yellow-600",
    error: "bg-red-600",
  };

  return (
    <div className="w-full">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-[var(--radius-full)]",
          "bg-[var(--line-color)]",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 transition-all",
            variants[variant]
          )}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </ProgressPrimitive.Root>
      {showValue && (
        <div className="mt-2 text-right">
          <span className="text-[var(--text-xs)] font-heading font-bold uppercase tracking-[var(--tracking-widest)] text-[var(--text-secondary)]">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
});

Progress.displayName = ProgressPrimitive.Root.displayName;

/* Linear Progress - Simplified variant */
interface LinearProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  variant?: "default" | "success" | "warning" | "error";
}

export const LinearProgress = React.forwardRef<HTMLDivElement, LinearProgressProps>(
  ({ className, value = 0, variant = "default", ...props }, ref) => {
    const percentage = Math.min(Math.max(value, 0), 100);

    const variants = {
      default: "bg-[var(--navy-900)]",
      success: "bg-green-600",
      warning: "bg-yellow-600",
      error: "bg-red-600",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-1 w-full overflow-hidden rounded-[var(--radius-full)]",
          "bg-[var(--line-color)]",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full transition-all duration-300 ease-in-out",
            variants[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);

LinearProgress.displayName = "LinearProgress";
