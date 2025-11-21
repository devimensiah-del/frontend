import * as React from "react"
import { cn } from "@/lib/utils/cn"

export interface ToastProps {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "default" | "destructive" | "success" | "error" | "warning" | "info"
  onClose?: () => void
  open?: boolean
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ id, title, description, variant = "default", onClose, open = true }, ref) => {
    const [isVisible, setIsVisible] = React.useState(open)
    const [isExiting, setIsExiting] = React.useState(false)

    React.useEffect(() => {
      setIsVisible(open)
    }, [open])

    const handleClose = () => {
      setIsExiting(true)
      setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, 300) // Match animation duration
    }

    if (!isVisible) return null

    const variantStyles = {
      default: {
        bg: "bg-white",
        border: "border-[var(--line-color)]",
        icon: null,
        iconColor: "",
        textColor: "text-[var(--text-primary)]",
        titleColor: "text-[var(--navy-900)]",
      },
      destructive: {
        bg: "bg-red-50",
        border: "border-red-300",
        icon: (
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        iconColor: "text-red-600",
        textColor: "text-red-800",
        titleColor: "text-red-900",
      },
      success: {
        bg: "bg-green-50",
        border: "border-green-300",
        icon: (
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        iconColor: "text-green-600",
        textColor: "text-green-800",
        titleColor: "text-green-900",
      },
      error: {
        bg: "bg-red-50",
        border: "border-red-300",
        icon: (
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        iconColor: "text-red-600",
        textColor: "text-red-800",
        titleColor: "text-red-900",
      },
      warning: {
        bg: "bg-yellow-50",
        border: "border-yellow-300",
        icon: (
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        ),
        iconColor: "text-yellow-600",
        textColor: "text-yellow-800",
        titleColor: "text-yellow-900",
      },
      info: {
        bg: "bg-blue-50",
        border: "border-blue-300",
        icon: (
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        iconColor: "text-blue-600",
        textColor: "text-blue-800",
        titleColor: "text-blue-900",
      },
    }

    const styles = variantStyles[variant]

    return (
      <div
        ref={ref}
        className={cn(
          "pointer-events-auto w-full max-w-md rounded-md border p-4 shadow-lg transition-all duration-300",
          styles.bg,
          styles.border,
          isExiting
            ? "animate-out fade-out slide-out-to-right-5"
            : "animate-in slide-in-from-right-5 fade-in"
        )}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="flex items-start space-x-3">
          {styles.icon && (
            <div className={cn("mt-0.5", styles.iconColor)}>{styles.icon}</div>
          )}
          <div className="flex-1 space-y-1">
            {title && (
              <div className={cn("text-sm font-semibold", styles.titleColor)}>
                {title}
              </div>
            )}
            {description && (
              <div className={cn("text-sm", styles.textColor)}>
                {description}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className={cn(
              "flex-shrink-0 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2",
              styles.iconColor
            )}
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    )
  }
)

Toast.displayName = "Toast"
