"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";
import { LucideIcon } from "lucide-react";

/**
 * NextActionCard - Card showing what user should expect next
 *
 * Displays upcoming action, estimated time, and optional CTA button.
 * Responsive card layout with icon, title, description, and estimated time.
 *
 * @example
 * ```tsx
 * <NextActionCard
 *   title="Próximo Passo"
 *   description="Aguardando conclusão da análise"
 *   eta="2-3 dias"
 *   icon={BarChart}
 * />
 * ```
 */

export interface NextActionCardProps {
  /** Card title */
  title: string;
  /** Action description */
  description: string;
  /** Estimated time or date */
  eta?: string;
  /** Lucide icon component */
  icon?: LucideIcon;
  /** Optional CTA button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Card variant */
  variant?: "default" | "info" | "success" | "warning";
  /** Additional CSS classes */
  className?: string;
}

export const NextActionCard: React.FC<NextActionCardProps> = ({
  title,
  description,
  eta,
  icon: Icon,
  action,
  variant = "default",
  className,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "info":
        return {
          bg: "bg-[var(--gold-light)]",
          border: "border-[var(--gold-500)]",
          iconColor: "text-[var(--gold-600)]",
        };
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-300",
          iconColor: "text-green-600",
        };
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-300",
          iconColor: "text-yellow-600",
        };
      default:
        return {
          bg: "bg-white",
          border: "border-[var(--line-color)]",
          iconColor: "text-[var(--navy-900)]",
        };
    }
  };

  const variantClasses = getVariantClasses();

  return (
    <div
      className={cn(
        "border rounded-[var(--radius-sm)] p-6 transition-all duration-300",
        "hover:shadow-md",
        variantClasses.bg,
        variantClasses.border,
        className
      )}
      role="article"
      aria-labelledby="next-action-title"
    >
      {/* Icon and Title */}
      <div className="flex items-start gap-4 mb-4">
        {Icon && (
          <div
            className={cn(
              "flex-shrink-0 w-12 h-12 rounded-[var(--radius-sm)]",
              "flex items-center justify-center",
              "bg-white/80 border border-[var(--line-color)]"
            )}
            role="img"
            aria-label={title}
          >
            <Icon className={cn("w-6 h-6", variantClasses.iconColor)} aria-hidden="true" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3
            id="next-action-title"
            className={cn(
              "font-heading font-bold uppercase text-[var(--text-sm)]",
              "tracking-[var(--tracking-wide)] text-[var(--navy-900)] mb-2"
            )}
          >
            {title}
          </h3>

          <p className="text-[var(--text-base)] text-[var(--text-primary)] leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Estimated Time */}
      {eta && (
        <div className="flex items-center gap-2 mb-4">
          <span
            className={cn(
              "font-heading font-bold uppercase text-[var(--text-xs)]",
              "tracking-[var(--tracking-widest)] text-[var(--text-secondary)]"
            )}
          >
            Estimativa:
          </span>
          <span className="text-[var(--text-sm)] text-[var(--text-primary)] font-medium">
            {eta}
          </span>
        </div>
      )}

      {/* Optional CTA Button */}
      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            "btn-architect w-full sm:w-auto",
            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--gold-500)]"
          )}
          type="button"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

NextActionCard.displayName = "NextActionCard";
