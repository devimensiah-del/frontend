/**
 * Avatar Atom
 *
 * User avatar component with fallback initials.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";

// ============================================
// TYPES
// ============================================

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

// ============================================
// COMPONENT
// ============================================

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt = "", fallback = "?", size = "md", ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    const sizes = {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base",
      xl: "w-16 h-16 text-lg",
    };

    const showFallback = !src || imageError;

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center overflow-hidden bg-navy-900 text-white font-medium uppercase rounded-full",
          sizes[size],
          className
        )}
        {...props}
      >
        {showFallback ? (
          <span aria-label={alt || "User avatar"}>{fallback}</span>
        ) : (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";
