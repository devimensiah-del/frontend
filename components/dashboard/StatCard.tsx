import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { LucideIcon } from "lucide-react";

/* ============================================
   STAT CARD COMPONENT
   ============================================ */

interface StatCardProps {
  label: string;
  value: number | string;
  variant?: "default" | "success" | "warning" | "error";
  icon?: LucideIcon;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  variant = "default",
  icon: Icon 
}) => {
  const variants = {
    default: "bg-white border-gray-200 text-navy-900",
    success: "bg-green-50 border-green-200 text-green-700",
    warning: "bg-amber-50 border-amber-200 text-amber-700",
    error: "bg-red-50 border-red-200 text-red-700",
  };

  const iconVariants = {
    default: "text-gray-400",
    success: "text-green-500",
    warning: "text-amber-500",
    error: "text-red-500",
  };

  return (
    <Card className={cn("border shadow-sm transition-all duration-200 hover:shadow-md", variants[variant])}>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">
            {label}
          </p>
          <div className="text-3xl font-heading font-light">
            {value}
          </div>
        </div>
        {Icon && (
          <div className={cn("p-3 rounded-full bg-white/50", iconVariants[variant])}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
