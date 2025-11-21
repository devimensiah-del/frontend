import React from "react";
import { cn } from "@/lib/utils/cn";

/* ============================================
   GRID LAYOUT COMPONENTS
   ============================================ */

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 12;
  divided?: boolean;
}

export const Grid: React.FC<GridProps> = ({
  children,
  cols = 1,
  divided = false,
  className,
  ...props
}) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    12: "lg:grid-cols-12",
  };

  return (
    <div
      className={cn(
        "grid",
        gridCols[cols],
        divided && "divide-x divide-line",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/* ============================================
   GRID COLUMN
   ============================================ */

interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  span?: number;
}

export const Col: React.FC<ColProps> = ({
  children,
  span,
  className,
  ...props
}) => {
  const colSpan = span ? `lg:col-span-${span}` : "";

  return (
    <div className={cn(colSpan, className)} {...props}>
      {children}
    </div>
  );
};

/* ============================================
   SECTION DIVIDER
   ============================================ */

interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  variant?: "horizontal" | "vertical";
}

export const Divider: React.FC<DividerProps> = ({
  variant = "horizontal",
  className,
  ...props
}) => {
  return <hr className={cn("border-grid", className)} {...props} />;
};

/* ============================================
   EDITORIAL CONTAINER
   ============================================ */

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn("grid-editorial", className)} {...props}>
      {children}
    </div>
  );
};
