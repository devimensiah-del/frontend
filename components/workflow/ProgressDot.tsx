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
        'flex flex-col items-center gap-1 md:gap-2',
        className
      )}
    >
      {/* Dot - responsive sizing */}
      <button
        type="button"
        onClick={isClickable ? onClick : undefined}
        disabled={!isClickable}
        className={cn(
          'relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full transition-all duration-300',
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
        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
        {/* Stage number badge - responsive */}
        <span
          className={cn(
            'absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full text-[10px] sm:text-xs font-bold flex items-center justify-center',
            state === 'completed' && 'bg-green-700 text-white',
            state === 'current' && 'bg-blue-700 text-white',
            state === 'future' && 'bg-gray-400 text-white'
          )}
        >
          {stage}
        </span>
      </button>

      {/* Label - hidden on mobile, visible on sm+ */}
      <div className="text-center max-w-[60px] sm:max-w-[80px] md:max-w-[100px] hidden sm:block">
        <p
          className={cn(
            'text-[10px] sm:text-xs font-medium leading-tight truncate',
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
