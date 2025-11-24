import React from "react";
import { cn } from "@/lib/utils/cn";

interface DataFieldProps {
  label: string;
  value?: React.ReactNode;
  icon?: React.ReactNode;
  link?: boolean;
  className?: string;
}

export function DataField({ label, value, icon, link, className }: DataFieldProps) {
  const displayValue =
    value !== undefined && value !== null && value !== "" ? value : "-";

  const renderValue = () => {
    if (link && typeof displayValue === "string") {
      return (
        <a
          href={displayValue}
          target="_blank"
          rel="noreferrer"
          className="text-primary underline underline-offset-4 break-all"
        >
          {displayValue}
        </a>
      );
    }
    return <span className="text-sm text-navy-900 break-words">{displayValue}</span>;
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border border-surface-border bg-surface-paper",
        className
      )}
    >
      {icon && <span className="text-text-secondary mt-0.5">{icon}</span>}
      <div className="space-y-1">
        {label && (
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            {label}
          </p>
        )}
        {renderValue()}
      </div>
    </div>
  );
}
