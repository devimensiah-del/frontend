'use client';

import { cn } from '@/lib/utils';

interface ProgressConnectorProps {
  isCompleted: boolean;
  className?: string;
}

export function ProgressConnector({ isCompleted, className }: ProgressConnectorProps) {
  return (
    <div
      className={cn(
        'flex-1 h-0.5 min-w-8 max-w-16 transition-colors duration-500',
        isCompleted ? 'bg-green-500' : 'bg-gray-300',
        className
      )}
    />
  );
}
