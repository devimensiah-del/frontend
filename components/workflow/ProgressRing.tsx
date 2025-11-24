'use client';

import { cn } from '@/lib/utils';

interface ProgressRingProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { width: 60, strokeWidth: 4, fontSize: 'text-xs' },
  md: { width: 80, strokeWidth: 6, fontSize: 'text-sm' },
  lg: { width: 120, strokeWidth: 8, fontSize: 'text-lg' },
};

export function ProgressRing({
  percentage,
  size = 'md',
  showLabel = true,
  className,
}: ProgressRingProps) {
  const config = sizeConfig[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('inline-flex items-center justify-center', className)}>
      <svg width={config.width} height={config.width} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          className="text-surface-border"
        />

        {/* Progress circle */}
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-gold-600 transition-all duration-500"
        />

        {/* Percentage text */}
        {showLabel && (
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy="0.3em"
            className={cn('font-semibold fill-navy-900 transform rotate-90', config.fontSize)}
            style={{ transformOrigin: 'center' }}
          >
            {Math.round(percentage)}%
          </text>
        )}
      </svg>
    </div>
  );
}
