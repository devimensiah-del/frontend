'use client';

import { cn } from '@/lib/utils';
import type { SWOTItem } from '@/lib/types';

interface SWOTQuadrantProps {
  title: string;
  items: string[] | SWOTItem[];
  color: 'green' | 'red' | 'blue' | 'yellow';
  className?: string;
}

const colorConfig = {
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    title: 'text-green-700',
    text: 'text-green-900',
    bullet: 'text-green-600',
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    title: 'text-red-700',
    text: 'text-red-900',
    bullet: 'text-red-600',
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    title: 'text-blue-700',
    text: 'text-blue-900',
    bullet: 'text-blue-600',
  },
  yellow: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    title: 'text-amber-700',
    text: 'text-amber-900',
    bullet: 'text-amber-600',
  },
};

export function SWOTQuadrant({ title, items, color, className }: SWOTQuadrantProps) {
  const colors = colorConfig[color];

  // Handle both string[] and SWOTItem[] formats
  const itemList = items.map((item) =>
    typeof item === 'string' ? { content: item, confidence: null, source: null } : item
  );

  return (
    <div
      className={cn(
        'p-4 rounded-lg border-2 h-full',
        colors.bg,
        colors.border,
        className
      )}
    >
      <h4 className={cn('text-sm font-semibold uppercase tracking-wider mb-3', colors.title)}>
        {title}
      </h4>

      {itemList.length === 0 ? (
        <p className="text-xs text-text-tertiary italic">Nenhum item identificado</p>
      ) : (
        <ul className="space-y-2">
          {itemList.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className={cn('mt-1 flex-shrink-0', colors.bullet)}>•</span>
              <div className="flex-1">
                <p className={cn('text-sm leading-relaxed', colors.text)}>
                  {item.content}
                </p>
                {item.confidence && (
                  <p className="text-xs text-text-secondary mt-1">
                    Confiança: {item.confidence}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 pt-3 border-t border-current/10">
        <p className="text-xs text-text-secondary">
          {itemList.length} {itemList.length === 1 ? 'item' : 'itens'}
        </p>
      </div>
    </div>
  );
}
