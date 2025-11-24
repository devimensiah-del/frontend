'use client';

import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataFieldProps {
  label: string;
  value?: string | null;
  icon?: React.ReactNode;
  link?: boolean;
  className?: string;
}

export function DataField({ label, value, icon, link, className }: DataFieldProps) {
  const displayValue = value || 'Não informado';
  const isEmpty = !value;

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center gap-2">
        {icon && <span className="text-gold-600">{icon}</span>}
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          {label}
        </label>
      </div>

      {link && !isEmpty ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gold-600 hover:text-gold-700 hover:underline flex items-center gap-1 group"
        >
          <span>{displayValue}</span>
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      ) : (
        <p className={cn(
          'text-sm leading-relaxed',
          isEmpty ? 'text-text-tertiary italic' : 'text-navy-900'
        )}>
          {displayValue}
        </p>
      )}
    </div>
  );
}
