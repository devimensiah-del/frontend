import React from "react";
import { cn } from "@/lib/utils/cn";

/* ============================================
   INPUT COMPONENT - Editorial Form Input
   ============================================ */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "editorial" | "default";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant = "editorial", className, ...props }, ref) => {
    const variants = {
      editorial: "input-editorial",
      default: "input-editorial",
    };

    return (
      <input
        ref={ref}
        className={cn(
          variants[variant],
          // Focus visible styles
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--gold-500)] focus-visible:ring-offset-2",
          // Invalid state
          props["aria-invalid"] && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
