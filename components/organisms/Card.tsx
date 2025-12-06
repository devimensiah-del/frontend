/**
 * Card Organism
 *
 * Container component with header, body, and footer slots.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";

// ============================================
// TYPES
// ============================================

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "bordered" | "elevated";
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// ============================================
// COMPONENTS
// ============================================

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-white border border-line",
      bordered: "bg-surface-paper border border-line",
      elevated: "bg-white shadow-md",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-none overflow-hidden",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("p-6 border-b border-line", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("p-6", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardBody.displayName = "CardBody";

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("p-6 border-t border-line bg-surface-paper", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";
