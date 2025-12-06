/**
 * Label Atom
 *
 * Form label component with editorial styling.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";

// ============================================
// TYPES
// ============================================

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
  variant?: "default" | "eyebrow";
}

// ============================================
// COMPONENT
// ============================================

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, variant = "default", ...props }, ref) => {
    const variants = {
      default: "text-xs font-bold uppercase text-text-secondary tracking-widest",
      eyebrow: "text-xs font-bold uppercase text-gold-500 tracking-ultra",
    };

    return (
      <label
        ref={ref}
        className={cn(
          "block mb-2",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-gold-500 ml-1" aria-label="required">*</span>}
      </label>
    );
  }
);

Label.displayName = "Label";
