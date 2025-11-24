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
    default: "bg-white border-line text-navy-900 hover:bg-surface-paper",
    success: "bg-white border-line text-green-700 hover:bg-green-50/50",
    warning: "bg-white border-line text-amber-700 hover:bg-amber-50/50",
    error: "bg-white border-line text-red-700 hover:bg-red-50/50",
  };

  const iconVariants = {
    default: "text-navy-900/20",
    success: "text-green-500/30",
    warning: "text-amber-500/30",
    error: "text-red-500/30",
  };

  const valueVariants = {
    default: "text-navy-900",
    success: "text-green-700",
    warning: "text-amber-700",
    error: "text-red-700",
  };

  return (
    <Card className={cn(
      "border transition-all duration-300 hover:shadow-md group relative overflow-hidden",
      variants[variant]
    )}>
      {/* Background decoration - subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      <CardContent className="p-8 flex items-start justify-between relative">
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-tertiary mb-4">
            {label}
          </p>
          <div className={cn(
            "text-5xl font-heading font-light transition-colors",
            valueVariants[variant]
          )}>
            {value}
          </div>
        </div>
        {Icon && (
          <div className={cn(
            "transition-all duration-300 group-hover:scale-110",
            iconVariants[variant]
          )}>
            <Icon className="w-10 h-10" strokeWidth={1.5} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
