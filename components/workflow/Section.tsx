'use client';

import { cn } from '@/lib/utils';

interface SectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Section({ title, icon, children, className }: SectionProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2 pb-2 border-b border-surface-border">
        {icon && <span className="text-gold-600">{icon}</span>}
        <h3 className="text-sm font-semibold text-navy-900 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div>{children}</div>
    </div>
  );
}
