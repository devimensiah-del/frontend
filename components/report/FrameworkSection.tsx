/**
 * FrameworkSection Component
 *
 * Displays a framework analysis section with expandable/collapsible content.
 */

"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { ChevronDown, ChevronUp } from "lucide-react";

// ============================================
// TYPES
// ============================================

export interface FrameworkSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export const FrameworkSection: React.FC<FrameworkSectionProps> = ({
  title,
  children,
  defaultExpanded = false,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={cn("border-b border-line", className)}>
      {/* Header - Clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-surface-paper transition-colors"
        aria-expanded={isExpanded}
      >
        <h2 className="font-heading text-2xl font-bold text-navy-900 uppercase tracking-wider">
          {title}
        </h2>
        {isExpanded ? (
          <ChevronUp className="w-6 h-6 text-gold-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gold-500 flex-shrink-0" />
        )}
      </button>

      {/* Content - Expandable */}
      {isExpanded && (
        <div className="p-6 pt-0 bg-surface-white">
          {children}
        </div>
      )}
    </div>
  );
};
