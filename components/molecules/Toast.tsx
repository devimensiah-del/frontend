/**
 * Toast Molecule
 *
 * Temporary notification message.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { IconButton } from "./IconButton";

// ============================================
// TYPES
// ============================================

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "error" | "warning" | "info";
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

// ============================================
// COMPONENT
// ============================================

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "info", message, action, onClose, ...props }, ref) => {
    const variants = {
      success: {
        icon: CheckCircle,
        bg: "bg-semantic-success-light border-semantic-success",
        text: "text-semantic-success-dark",
      },
      error: {
        icon: AlertCircle,
        bg: "bg-semantic-error-light border-semantic-error",
        text: "text-semantic-error-dark",
      },
      warning: {
        icon: AlertTriangle,
        bg: "bg-semantic-warning-light border-semantic-warning",
        text: "text-semantic-warning-dark",
      },
      info: {
        icon: Info,
        bg: "bg-semantic-info-light border-semantic-info",
        text: "text-semantic-info-dark",
      },
    };

    const { icon: Icon, bg, text } = variants[variant];

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-3 p-4 border-l-4 shadow-md max-w-md",
          bg,
          className
        )}
        role="alert"
        {...props}
      >
        <Icon className={cn("w-5 h-5 flex-shrink-0", text)} aria-hidden="true" />

        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-medium", text)}>{message}</p>
        </div>

        {action && (
          <button
            onClick={action.onClick}
            className={cn(
              "text-xs font-bold uppercase tracking-wider underline",
              text,
              "hover:opacity-80 transition-opacity"
            )}
          >
            {action.label}
          </button>
        )}

        {onClose && (
          <IconButton
            icon={X}
            label="Close notification"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className={text}
          />
        )}
      </div>
    );
  }
);

Toast.displayName = "Toast";
