'use client';

import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export type DotState = 'completed' | 'current' | 'future' | 'selected';

interface ProgressDotProps {
  stage: number;
  label: string;
  description: string;
  icon: LucideIcon;
  state: DotState;
  isSelected?: boolean;
  isClickable?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ProgressDot({
  stage,
  label,
  description,
  icon: Icon,
  state,
  isSelected = false,
  isClickable = false,
  onClick,
  className,
}: ProgressDotProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-2',
        className
      )}
    >
      {/* Dot */}
      <button
        type="button"
        onClick={isClickable ? onClick : undefined}
        disabled={!isClickable}
        className={cn(
          'relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300',
          'border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          // State-based colors
          state === 'completed' && 'bg-green-500 border-green-500 text-white',
          state === 'current' && 'bg-blue-500 border-blue-500 text-white',
          state === 'future' && 'bg-gray-200 border-gray-300 text-gray-400',
          // Selected ring overlay
          isSelected && 'ring-2 ring-offset-2 ring-gold-500',
          // Clickable cursor
          isClickable && 'cursor-pointer hover:scale-105',
          !isClickable && state !== 'current' && 'cursor-default'
        )}
        title={description}
      >
        <Icon className="w-5 h-5" />
        {/* Stage number badge */}
        <span
          className={cn(
            'absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center',
            state === 'completed' && 'bg-green-700 text-white',
            state === 'current' && 'bg-blue-700 text-white',
            state === 'future' && 'bg-gray-400 text-white'
          )}
        >
          {stage}
        </span>
      </button>

      {/* Label */}
      <div className="text-center max-w-[100px]">
        <p
          className={cn(
            'text-xs font-medium leading-tight',
            state === 'completed' && 'text-green-600',
            state === 'current' && 'text-blue-600',
            state === 'future' && 'text-gray-400'
          )}
        >
          {label}
        </p>
      </div>
    </div>
  );
}
