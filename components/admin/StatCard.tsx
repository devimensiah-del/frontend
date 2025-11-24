"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";
import { LucideIcon } from "lucide-react";

/* ============================================
   STAT CARD - Dashboard Quick Stats
   ============================================ */

interface StatCardProps {
  label: string;
  value: number;
  variant?: "default" | "warning" | "success" | "error";
  icon?: LucideIcon;
  trend?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  variant = "default",
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  const variants = {
    default: "border-line text-navy-900 bg-white",
    warning: "border-gold-500 bg-gold-500/5 text-gold-600",
    success: "border-green-500 bg-green-50 text-green-700",
    error: "border-red-500 bg-red-50 text-red-700",
  };

  return (
    <div
      className={cn(
        "border px-4 py-3 transition-all hover:shadow-sm",
        variants[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-2xl sm:text-3xl font-light font-heading">
            {value}
          </div>
          <div className="text-xs uppercase tracking-widest text-text-secondary mt-1">
            {label}
          </div>
          {trend && (
            <div className="text-xs text-text-tertiary mt-1">{trend}</div>
          )}
        </div>
        {Icon && (
          <Icon
            className={cn(
              "w-5 h-5 opacity-50",
              variant === "warning" && "text-gold-500",
              variant === "success" && "text-green-600",
              variant === "error" && "text-red-600"
            )}
          />
        )}
      </div>
    </div>
  );
}
