import React from "react";

interface SectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function Section({ title, icon, children }: SectionProps) {
  return (
    <div className="space-y-4 mt-8 first:mt-0">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
        {icon && <div className="text-gold-600">{icon}</div>}
        <h3 className="font-semibold text-navy-900 text-lg">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}
