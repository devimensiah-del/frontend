/**
 * Modal Organism
 *
 * Dialog overlay component.
 */

"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";
import { X } from "lucide-react";
import { IconButton } from "../molecules/IconButton";

// ============================================
// TYPES
// ============================================

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ open, onClose, children, className, size = "md", showCloseButton = true }, ref) => {
    // Close on Escape key
    React.useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose();
        }
      };

      if (open) {
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }, [open, onClose]);

    if (!open) return null;

    const sizes = {
      sm: "max-w-md",
      md: "max-w-lg",
      lg: "max-w-2xl",
      xl: "max-w-4xl",
    };

    return (
      <div
        className="fixed inset-0 z-modal flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-navy-900/50 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Content */}
        <div
          ref={ref}
          className={cn(
            "relative bg-white shadow-xl w-full animate-fade-in",
            sizes[size],
            className
          )}
        >
          {showCloseButton && (
            <div className="absolute top-4 right-4 z-10">
              <IconButton
                icon={X}
                label="Close modal"
                variant="ghost"
                onClick={onClose}
              />
            </div>
          )}

          {children}
        </div>
      </div>
    );
  }
);

Modal.displayName = "Modal";
