import React from "react";
import { cn } from "@/lib/utils/cn";
import { Spinner } from "@/components/ui/loading-indicator";

/* ============================================
   BUTTON COMPONENT - The Architect's Button
   ============================================ */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "architect" | "outline" | "default" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
  asChild?: boolean;
  isLoading?: boolean;
  "aria-label"?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "architect", size = "default", className, children, isLoading, disabled, asChild, ...props }, ref) => {
    const variants = {
      architect: "btn-architect",
      outline: "btn-outline",
      default: "btn-architect",
      ghost: "bg-transparent hover:bg-gray-100 text-gray-600 border-transparent",
    };

    const sizes = {
      default: "px-6 py-3 text-sm",
      sm: "px-4 py-2 text-xs",
      lg: "px-8 py-4 text-base",
      icon: "h-10 w-10 p-0",
    };

    const buttonClasses = cn(
      variants[variant],
      sizes[size],
      "inline-flex items-center justify-center",
      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--gold-500)] focus-visible:ring-offset-2",
      isLoading && "opacity-70 cursor-not-allowed",
      className
    );

    // Handle asChild - clone the child element with button styles
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
        className: cn(buttonClasses, (children as React.ReactElement<{ className?: string }>).props.className),
      });
    }

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner size={16} />
            <span className="ml-2">{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
