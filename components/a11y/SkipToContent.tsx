"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Skip to Content Link
 * Accessibility feature for keyboard navigation
 * Hidden until focused, allows users to skip navigation
 */

interface SkipToContentProps {
  targetId?: string;
  label?: string;
  className?: string;
}

export function SkipToContent({
  targetId = "main-content",
  label = "Pular para o conteúdo principal",
  className,
}: SkipToContentProps) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        // Visually hidden by default
        "absolute -top-full left-0",
        "px-4 py-3",
        "bg-[var(--navy-900)] text-white",
        "font-heading font-bold text-[var(--text-sm)] uppercase tracking-widest",
        "rounded-[var(--radius-sm)]",
        // Visible on focus
        "focus:top-4 focus:left-4 focus:z-[100]",
        "focus:outline-none focus:ring-4 focus:ring-[var(--gold-500)]",
        "transition-all duration-200",
        className
      )}
    >
      {label}
    </a>
  );
}
