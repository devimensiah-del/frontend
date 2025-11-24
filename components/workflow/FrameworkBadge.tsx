'use client';

import { CheckCircle, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FrameworkBadgeProps {
  name: string;
  completed: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function FrameworkBadge({ name, completed, icon, className }: FrameworkBadgeProps) {
  return (
    <Badge
      variant={completed ? 'default' : 'outline'}
      className={cn(
        'px-3 py-2 justify-start gap-2 transition-all',
        completed
          ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
          : 'bg-surface-paper text-text-tertiary border-surface-border',
        className
      )}
    >
      {completed ? (
        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
      ) : (
        <Circle className="w-3.5 h-3.5 flex-shrink-0" />
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="text-xs font-medium">{name}</span>
    </Badge>
  );
}
