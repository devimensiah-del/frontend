import React from "react";
import { cn } from "@/lib/utils/cn";

/* ============================================
   ALERT COMPONENT - Alert Messages
   ============================================ */

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error";
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = "info", dismissible = false, onDismiss, className, children, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true);

    const variants = {
      info: "bg-blue-50 border-blue-300 text-blue-900",
      success: "bg-green-50 border-green-300 text-green-900",
      warning: "bg-yellow-50 border-yellow-300 text-yellow-900",
      error: "bg-red-50 border-red-300 text-red-900",
    };

    const handleDismiss = () => {
      setIsVisible(false);
      if (onDismiss) {
        onDismiss();
      }
    };

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative p-4 border rounded-[var(--radius-sm)]",
          variants[variant],
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          <AlertIcon variant={variant} />
          <div className="flex-1">{children}</div>
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="ml-auto opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Dismiss alert"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = "Alert";

/* Alert Icon */
const AlertIcon = ({ variant }: { variant: AlertProps["variant"] }) => {
  const icons = {
    info: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
    success: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    warning: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    error: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  };

  return <div className="flex-shrink-0 mt-0.5">{icons[variant || "info"]}</div>;
};

/* Alert Title */
type AlertTitleProps = React.HTMLAttributes<HTMLHeadingElement>

export const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h5
        ref={ref}
        className={cn(
          "font-heading font-medium text-[var(--text-sm)] tracking-tight mb-1",
          className
        )}
        {...props}
      />
    );
  }
);

AlertTitle.displayName = "AlertTitle";

/* Alert Description */
type AlertDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>

export const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("text-[var(--text-sm)] opacity-90", className)}
        {...props}
      />
    );
  }
);

AlertDescription.displayName = "AlertDescription";
