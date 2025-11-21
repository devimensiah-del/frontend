import React from "react";
import { cn } from "@/lib/utils/cn";

/* ============================================
   SELECT COMPONENT (Simplified)
   ============================================ */

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-12 w-full rounded-md border border-line bg-surface-paper px-3 py-2",
          "text-sm ring-offset-background",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";

export interface SelectOptionProps
  extends React.OptionHTMLAttributes<HTMLOptionElement> {
  children: React.ReactNode;
}

export const SelectOption: React.FC<SelectOptionProps> = ({
  children,
  ...props
}) => {
  return <option {...props}>{children}</option>;
};
