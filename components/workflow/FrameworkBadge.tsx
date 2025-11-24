import React from "react";
import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface FrameworkBadgeProps {
  name: string;
  completed: boolean;
  icon: React.ReactNode;
}

export function FrameworkBadge({ name, completed, icon }: FrameworkBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 p-2 rounded border transition-colors",
        completed
          ? "bg-green-50 border-green-200 text-green-700"
          : "bg-gray-50 border-gray-200 text-gray-400 opacity-75"
      )}
    >
      <div className={cn("p-1 rounded-full flex-shrink-0", completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500")}>
        {icon}
      </div>
      <span className="text-xs font-medium truncate">{name}</span>
      {completed ? (
        <CheckCircle className="w-3 h-3 ml-auto flex-shrink-0 text-green-600" />
      ) : (
        <Circle className="w-3 h-3 ml-auto flex-shrink-0 opacity-50" />
      )}
    </div>
  );
}
