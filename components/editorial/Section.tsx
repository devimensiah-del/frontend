import React from "react";
import { cn } from "@/lib/utils/cn";

/* ============================================
   SECTION COMPONENT
   ============================================ */

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: "default" | "hero" | "dark" | "grid";
  fullWidth?: boolean;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, variant = "default", fullWidth: _fullWidth = false, children, ...props }, ref) => {
    const variants = {
      default: "bg-surface-white border-b border-grid",
      hero: "min-h-[80vh] border-b border-grid",
      dark: "bg-navy-900 text-white border-b border-grid",
      grid: "grid md:grid-cols-3 divide-x divide-line border-b border-grid bg-white",
    };

    return (
      <section
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      >
        {children}
      </section>
    );
  }
);
Section.displayName = "Section";

/* ============================================
   CONTAINER COMPONENT
   ============================================ */

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("p-12 lg:p-24", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Container.displayName = "Container";

/* ============================================
   SPLIT LAYOUT COMPONENT
   ============================================ */

interface SplitLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  leftClassName?: string;
  rightClassName?: string;
}

export const SplitLayout = React.forwardRef<HTMLDivElement, SplitLayoutProps>(
  ({ className, children, leftContent, rightContent, leftClassName, rightClassName, ...props }, ref) => {
    // If direct children are provided, render them. Otherwise use left/right content props.
    if (children) {
      return (
        <div
          ref={ref}
          className={cn("grid lg:grid-cols-12", className)}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn("grid lg:grid-cols-12", className)}
        {...props}
      >
        <div className={cn("lg:col-span-7 border-r border-grid", leftClassName)}>
          {leftContent}
        </div>
        <div className={cn("lg:col-span-5", rightClassName)}>
          {rightContent}
        </div>
      </div>
    );
  }
);
SplitLayout.displayName = "SplitLayout";
