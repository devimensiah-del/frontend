import React from "react";
import { cn } from "@/lib/utils/cn";
import { SWOTItem } from "@/types";
import { normalizeToArray } from "@/lib/utils/format";

interface SWOTQuadrantProps {
  title: string;
  items: SWOTItem[] | string[] | string;
  color: "green" | "red" | "blue" | "yellow";
}

export function SWOTQuadrant({ title, items, color }: SWOTQuadrantProps) {
  const colorStyles = {
    green: "bg-green-50 border-green-200 text-green-900",
    red: "bg-red-50 border-red-200 text-red-900",
    blue: "bg-blue-50 border-blue-200 text-blue-900",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-900",
  };

  // Normalize items - handle both SWOTItem[] with .content and plain strings/arrays
  const normalizedItems: string[] = React.useMemo(() => {
    if (!items) return [];

    // If it's an array of SWOTItem objects with .content property
    if (Array.isArray(items) && items.length > 0 && typeof items[0] === 'object' && 'content' in items[0]) {
      return (items as SWOTItem[]).map(item => item.content).filter(Boolean);
    }

    // Otherwise use normalizeToArray for strings or string arrays
    return normalizeToArray(items);
  }, [items]);

  return (
    <div className={cn("p-4 rounded-lg border h-full", colorStyles[color])}>
      <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider opacity-90">{title}</h4>
      <ul className="space-y-2">
        {normalizedItems.length > 0 ? (
          normalizedItems.map((content, index) => (
            <li key={index} className="text-sm leading-relaxed flex items-start gap-2">
              <span className="mt-2 w-1 h-1 rounded-full bg-current flex-shrink-0" />
              <span style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}>{content}</span>
            </li>
          ))
        ) : (
          <li className="text-sm opacity-60 italic">Nenhum item registrado</li>
        )}
      </ul>
    </div>
  );
}
