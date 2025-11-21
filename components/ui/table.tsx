import React from "react";
import { cn } from "@/lib/utils/cn";

/* ============================================
   TABLE COMPONENT - Data Table
   ============================================ */

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  striped?: boolean;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ striped = false, className, ...props }, ref) => {
    return (
      <div className="relative w-full overflow-auto">
        <table
          ref={ref}
          className={cn(
            "w-full caption-bottom text-[var(--text-sm)]",
            striped && "table-striped",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Table.displayName = "Table";

/* Table Header */
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "border-b border-[var(--line-color)] bg-[var(--surface-paper)]",
      className
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

/* Table Body */
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

/* Table Footer */
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-[var(--line-color)] bg-[var(--surface-paper)] font-medium",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

/* Table Row */
const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-[var(--line-color)] transition-colors",
      "hover:bg-[var(--surface-paper)]",
      "data-[state=selected]:bg-[var(--gold-light)]",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

/* Table Head Cell */
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle",
      "font-heading font-bold uppercase text-[var(--text-xs)]",
      "tracking-[var(--tracking-widest)] text-[var(--text-secondary)]",
      "[&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

/* Table Cell */
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

/* Table Caption */
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-[var(--text-sm)] text-[var(--text-secondary)]", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
