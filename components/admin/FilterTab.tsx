"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

/* ============================================
   FILTER TAB - Stage/Status Filter Button
   ============================================ */

interface FilterTabProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export function FilterTab({
  active,
  onClick,
  children,
  disabled = false,
}: FilterTabProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all whitespace-nowrap",
        "border focus:outline-none focus:ring-2 focus:ring-gold-500/50",
        active
          ? "bg-navy-900 text-white border-navy-900 shadow-sm"
          : "bg-white text-text-secondary border-line hover:bg-surface-paper hover:border-gold-500/30",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
}
