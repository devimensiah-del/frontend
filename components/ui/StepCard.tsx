import React from "react";
import { cn } from "@/lib/utils/cn";
import { ArrowDownRight } from "lucide-react";
import { Badge } from "./Typography";

/* ============================================
   STEP CARD COMPONENT - How It Works Section
   ============================================ */

interface StepCardProps extends React.HTMLAttributes<HTMLDivElement> {
  number: string;
  title: string;
  description: string;
}

export const StepCard: React.FC<StepCardProps> = ({
  number,
  title,
  description,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "p-12 hover:bg-surface-paper transition-colors group",
        className
      )}
      {...props}
    >
      <div className="flex justify-between items-start mb-8">
        <Badge variant="step">PASSO {number}</Badge>
        <ArrowDownRight className="w-5 h-5 text-line group-hover:text-navy-900 transition-colors" />
      </div>
      <h3 className="text-xl font-medium mb-4">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">
        {description}
      </p>
    </div>
  );
};
