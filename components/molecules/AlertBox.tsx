/**
 * AlertBox Molecule
 *
 * Contextual alert message with icon, title, and description.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

// ============================================
// TYPES
// ============================================

export interface AlertBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "error" | "warning" | "info";
  title?: string;
  children: React.ReactNode;
}

// ============================================
// COMPONENT
// ============================================

export const AlertBox = React.forwardRef<HTMLDivElement, AlertBoxProps>(
  ({ className, variant = "info", title, children, ...props }, ref) => {
    const variants = {
      success: {
        icon: CheckCircle,
        border: "border-semantic-success",
        bg: "bg-semantic-success-light",
        iconColor: "text-semantic-success",
        textColor: "text-semantic-success-dark",
      },
      error: {
        icon: AlertCircle,
        border: "border-semantic-error",
        bg: "bg-semantic-error-light",
        iconColor: "text-semantic-error",
        textColor: "text-semantic-error-dark",
      },
      warning: {
        icon: AlertTriangle,
        border: "border-semantic-warning",
        bg: "bg-semantic-warning-light",
        iconColor: "text-semantic-warning",
        textColor: "text-semantic-warning-dark",
      },
      info: {
        icon: Info,
        border: "border-semantic-info",
        bg: "bg-semantic-info-light",
        iconColor: "text-semantic-info",
        textColor: "text-semantic-info-dark",
      },
    };

    const { icon: Icon, border, bg, iconColor, textColor } = variants[variant];

    return (
      <div
        ref={ref}
        className={cn(
          "border-l-4 p-4",
          border,
          bg,
          className
        )}
        role="alert"
        {...props}
      >
        <div className="flex gap-3">
          <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", iconColor)} aria-hidden="true" />

          <div className="flex-1 min-w-0">
            {title && (
              <h3 className={cn("text-sm font-bold mb-1", textColor)}>
                {title}
              </h3>
            )}
            <div className={cn("text-sm", textColor)}>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

AlertBox.displayName = "AlertBox";
