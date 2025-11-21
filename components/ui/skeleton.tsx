import React from "react";
import { cn } from "@/lib/utils/cn";

/* ============================================
   SKELETON COMPONENT - Loading Skeleton
   ============================================ */

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circle" | "rectangle";
  width?: string | number;
  height?: string | number;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = "rectangle", width, height, className, ...props }, ref) => {
    const variants = {
      text: "h-4 w-full",
      circle: "rounded-full w-12 h-12",
      rectangle: "w-full h-24",
    };

    const style: React.CSSProperties = {
      ...(width && { width: typeof width === "number" ? `${width}px` : width }),
      ...(height && { height: typeof height === "number" ? `${height}px` : height }),
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden bg-gray-200",
          "rounded-[var(--radius-sm)]",
          "before:absolute before:inset-0",
          "before:translate-x-[-100%]",
          "before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
          "before:animate-[shimmer_2s_infinite]",
          variants[variant],
          className
        )}
        style={style}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

/* Skeleton Text - Convenience component for text loading */
interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
}

export const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ lines = 3, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            className={cn(
              i === lines - 1 && "w-4/5" // Last line shorter
            )}
          />
        ))}
      </div>
    );
  }
);

SkeletonText.displayName = "SkeletonText";
