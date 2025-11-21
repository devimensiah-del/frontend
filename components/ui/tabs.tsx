import React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils/cn";

/* ============================================
   TABS COMPONENT - Tab Navigation
   ============================================ */

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-12 items-center justify-start",
      "border-b border-[var(--line-color)]",
      "bg-transparent",
      "w-full",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap",
      "px-6 py-3 h-full",
      "font-heading font-medium uppercase text-[var(--text-xs)]",
      "tracking-[var(--tracking-widest)]",
      "text-[var(--text-secondary)]",
      "border-b-2 border-transparent",
      "transition-all",
      "hover:text-[var(--navy-900)] hover:bg-[var(--surface-paper)]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy-900)]",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:border-[var(--navy-900)] data-[state=active]:text-[var(--navy-900)]",
      "data-[state=active]:bg-transparent",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy-900)]",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
