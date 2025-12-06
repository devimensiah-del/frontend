/**
 * SearchInput Molecule
 *
 * Input with search icon and clear button.
 */

"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";
import { Search, X } from "lucide-react";
import { Input, InputProps } from "../atoms/Input";

// ============================================
// TYPES
// ============================================

export interface SearchInputProps extends Omit<InputProps, "type"> {
  onClear?: () => void;
  showClearButton?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onClear, showClearButton = true, ...props }, ref) => {
    const hasValue = Boolean(value && String(value).length > 0);

    return (
      <div className="relative w-full">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary pointer-events-none"
          aria-hidden="true"
        />

        <Input
          ref={ref}
          type="search"
          value={value}
          className={cn("pl-10", hasValue && showClearButton && "pr-10", className)}
          {...props}
        />

        {hasValue && showClearButton && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-navy-900 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
