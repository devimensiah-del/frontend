import React from "react";

export interface InfoItemProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

/**
 * InfoItem - Displays a labeled value with optional icon
 * Used in company detail pages and other info displays
 */
export function InfoItem({ label, value, icon }: InfoItemProps) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-text-tertiary mb-1">{label}</p>
      <p className="text-sm font-medium text-text-primary flex items-center gap-2">
        {icon}
        {value}
      </p>
    </div>
  );
}
