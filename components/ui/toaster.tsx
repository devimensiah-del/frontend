'use client'

import * as React from "react"
import { Toast } from "./toast"
import { useToast } from "./use-toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  // Limit to maximum 3 visible toasts
  const visibleToasts = toasts.slice(0, 3)

  return (
    <div
      className="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-auto sm:bottom-0 sm:right-0 sm:flex-col md:max-w-[420px] pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      {visibleToasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onClose={() => dismiss(toast.id)}
          open={true}
        />
      ))}
    </div>
  )
}
