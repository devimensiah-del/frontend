/**
 * DropdownItem Molecule
 *
 * Single item in a dropdown menu with optional icon and badge.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import type { LucideIcon } from "lucide-react";
import { Badge } from "../atoms/Badge";

// ============================================
// TYPES
// ============================================

export interface DropdownItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  badge?: string;
  destructive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

// ============================================
// COMPONENT
// ============================================

export const DropdownItem = React.forwardRef<HTMLButtonElement, DropdownItemProps>(
  ({ className, icon: Icon, badge, destructive = false, disabled = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left transition-colors",
          "hover:bg-surface-paper focus:bg-surface-paper focus:outline-none",
          destructive ? "text-semantic-error hover:bg-semantic-error-light" : "text-text-primary",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className
        )}
        disabled={disabled}
        {...props}
      >
        {Icon && <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />}

        <span className="flex-1 min-w-0">{children}</span>

        {badge && (
          <Badge variant="default" size="sm">
            {badge}
          </Badge>
        )}
      </button>
    );
  }
);

DropdownItem.displayName = "DropdownItem";
