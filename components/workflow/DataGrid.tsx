'use client';

import { cn } from '@/lib/utils';

interface DataGridItem {
  label: string;
  value: string | number | null | undefined;
}

interface DataGridProps {
  items: Record<string, any> | DataGridItem[];
  columns?: 1 | 2;
  className?: string;
}

export function DataGrid({ items, columns = 2, className }: DataGridProps) {
  // Convert object to array of items
  const gridItems: DataGridItem[] = Array.isArray(items)
    ? items
    : Object.entries(items).map(([key, value]) => ({
        label: formatLabel(key),
        value: formatValue(value),
      }));

  return (
    <div
      className={cn(
        'grid gap-4',
        {
          'grid-cols-1': columns === 1,
          'grid-cols-1 md:grid-cols-2': columns === 2,
        },
        className
      )}
    >
      {gridItems.map((item, index) => (
        <div key={index} className="space-y-1">
          <dt className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            {item.label}
          </dt>
          <dd
            className={cn(
              'text-sm',
              item.value ? 'text-navy-900' : 'text-text-tertiary italic'
            )}
          >
            {item.value || 'Não informado'}
          </dd>
        </div>
      ))}
    </div>
  );
}

function formatLabel(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function formatValue(value: any): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
  return String(value);
}
