'use client';

import React from 'react';
import { EyeOff, Eye, Unlock, Loader2 } from 'lucide-react';
import { Select, SelectOption } from '@/components/ui/Select';
import { cn } from '@/lib/utils';

export type VisibilityState = 'hidden' | 'blurred' | 'full';

interface ReportVisibilityDropdownProps {
  isVisibleToUser: boolean;
  isBlurred: boolean;
  isLoading?: boolean;
  onVisibilityChange: (state: VisibilityState) => void;
  size?: 'sm' | 'default';
  className?: string;
}

// Derive the visibility state from the two booleans
export function getVisibilityState(isVisibleToUser: boolean, isBlurred: boolean): VisibilityState {
  if (!isVisibleToUser) return 'hidden';
  if (isBlurred) return 'blurred';
  return 'full';
}

// Get display info for each state
const VISIBILITY_INFO: Record<VisibilityState, {
  label: string;
  icon: typeof EyeOff;
  bgColor: string;
  textColor: string;
}> = {
  hidden: {
    label: 'Oculto',
    icon: EyeOff,
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
  },
  blurred: {
    label: 'Preview',
    icon: Eye,
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
  },
  full: {
    label: 'Completo',
    icon: Unlock,
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
  },
};

export function ReportVisibilityDropdown({
  isVisibleToUser,
  isBlurred,
  isLoading = false,
  onVisibilityChange,
  size = 'default',
  className,
}: ReportVisibilityDropdownProps) {
  const currentState = getVisibilityState(isVisibleToUser, isBlurred);
  const currentInfo = VISIBILITY_INFO[currentState];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onVisibilityChange(event.target.value as VisibilityState);
  };

  const isSmall = size === 'sm';

  if (isLoading) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-md border',
          currentInfo.bgColor,
          currentInfo.textColor,
          isSmall ? 'h-7 px-2' : 'h-9 px-3',
          className
        )}
      >
        <Loader2 className={cn('animate-spin', isSmall ? 'w-3 h-3' : 'w-4 h-4')} />
      </div>
    );
  }

  return (
    <Select
      value={currentState}
      onChange={handleChange}
      disabled={isLoading}
      className={cn(
        'border transition-colors font-medium',
        currentInfo.bgColor,
        currentInfo.textColor,
        isSmall ? 'h-7 text-xs px-2 py-0' : 'h-9',
        className
      )}
    >
      <SelectOption value="hidden">Oculto</SelectOption>
      <SelectOption value="blurred">Preview (blur)</SelectOption>
      <SelectOption value="full">Completo</SelectOption>
    </Select>
  );
}

export default ReportVisibilityDropdown;
