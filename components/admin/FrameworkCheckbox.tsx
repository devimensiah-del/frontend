"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";
import { CheckCircle, Circle } from "lucide-react";

/* ============================================
   FRAMEWORK CHECKBOX - Shows Framework Completion
   ============================================ */

interface FrameworkCheckboxProps {
  name: string;
  completed: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export function FrameworkCheckbox({
  name,
  completed,
  onClick,
  disabled = false,
}: FrameworkCheckboxProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || !onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 border transition-all text-left",
        completed
          ? "bg-green-50 border-green-300 text-green-700"
          : "bg-gray-50 border-gray-200 text-text-secondary",
        onClick && !disabled && "hover:border-gold-500 cursor-pointer",
        disabled && "opacity-60 cursor-not-allowed"
      )}
    >
      {completed ? (
        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
      ) : (
        <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
      )}
      <span className="text-xs font-medium uppercase tracking-wider">
        {name}
      </span>
    </button>
  );
}
