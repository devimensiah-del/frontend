import React from "react";

interface DataGridProps {
  items: Record<string, any>;
}

export function DataGrid({ items }: DataGridProps) {
  const formatLabel = (key: string) => {
    // Convert snake_case or camelCase to Title Case with spaces
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Sim' : 'Não';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Object.entries(items).map(([key, value]) => (
        <div key={key} className="space-y-1">
          <dt className="text-xs font-medium text-text-secondary uppercase tracking-wider">
            {formatLabel(key)}
          </dt>
          <dd className="text-sm text-navy-900 font-medium break-words">
            {formatValue(value)}
          </dd>
        </div>
      ))}
    </div>
  );
}
