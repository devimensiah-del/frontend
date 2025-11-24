"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  FileText,
} from "lucide-react";

/* ============================================
   NEXT ACTION BADGE - Shows Required Action
   ============================================ */

export interface NextAction {
  label: string;
  description: string;
  type?: "required" | "pending" | "complete" | "info"; // Optional - defaults to "info"
}

interface NextActionBadgeProps extends NextAction {
  size?: "sm" | "md";
  showIcon?: boolean;
}

export function NextActionBadge({
  label,
  description,
  type = "info", // Default to "info" if not provided
  size = "md",
  showIcon = true,
}: NextActionBadgeProps) {
  const config = {
    required: {
      variant: "error" as const,
      icon: AlertCircle,
      iconColor: "text-red-600",
    },
    pending: {
      variant: "warning" as const,
      icon: Clock,
      iconColor: "text-yellow-600",
    },
    complete: {
      variant: "success" as const,
      icon: CheckCircle,
      iconColor: "text-green-600",
    },
    info: {
      variant: "default" as const,
      icon: FileText,
      iconColor: "text-gray-600",
    },
  };

  const { variant, icon: Icon, iconColor } = config[type];

  return (
    <div className="flex items-start gap-2">
      {showIcon && <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", iconColor)} />}
      <div>
        <Badge variant={variant} size={size}>
          {label}
        </Badge>
        {size === "md" && (
          <p className="text-xs text-text-secondary mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
