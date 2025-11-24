import React from "react";
import { cn } from "@/lib/utils/cn";
import { SWOTItem } from "@/types";

interface SWOTQuadrantProps {
  title: string;
  items: SWOTItem[];
  color: "green" | "red" | "blue" | "yellow";
}

export function SWOTQuadrant({ title, items, color }: SWOTQuadrantProps) {
  const colorStyles = {
    green: "bg-green-50 border-green-200 text-green-900",
    red: "bg-red-50 border-red-200 text-red-900",
    blue: "bg-blue-50 border-blue-200 text-blue-900",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-900",
  };

  return (
    <div className={cn("p-4 rounded-lg border h-full", colorStyles[color])}>
      <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider opacity-90">{title}</h4>
      <ul className="space-y-2">
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <li key={index} className="text-sm leading-relaxed flex items-start gap-2">
              <span className="mt-2 w-1 h-1 rounded-full bg-current flex-shrink-0" />
              <span>{item.content}</span>
            </li>
          ))
        ) : (
          <li className="text-sm opacity-60 italic">Nenhum item registrado</li>
        )}
      </ul>
    </div>
  );
}
