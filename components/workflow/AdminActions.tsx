'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Share2 } from 'lucide-react';
import type { Analysis } from '@/types';

export interface AdminActionsProps {
  analysis: Analysis;
  isVisibleToUser: boolean;
  isBlurred: boolean;
  isTogglingBlur?: boolean;
  onToggleBlur?: () => void;
  onShareLink?: () => void;
  className?: string;
}

export function AdminActions({
  analysis,
  isVisibleToUser,
  isBlurred,
  isTogglingBlur = false,
  onToggleBlur,
  onShareLink,
  className,
}: AdminActionsProps) {
  // Only show blur toggle when analysis is approved AND visible to user (stage 6)
  const showBlurToggle = analysis.status === 'approved' && isVisibleToUser;

  // Show share button when released (approved AND visible)
  const isReleased = analysis.status === 'approved' && isVisibleToUser;

  // If no actions are available, don't render anything
  if (!showBlurToggle && !isReleased) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 ${className || ''}`}>
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mr-2">
        Ações Admin:
      </span>

      {/* Blur Toggle (Premium unlock) */}
      {showBlurToggle && onToggleBlur && (
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleBlur}
          disabled={isTogglingBlur}
          className={isBlurred
            ? "border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100"
            : "border-blue-400 bg-blue-50 text-blue-700 hover:bg-blue-100"
          }
          title={isBlurred ? 'Desbloquear análises premium' : 'Bloquear análises premium'}
        >
          {isTogglingBlur ? (
            <span className="w-4 h-4 mr-1.5 opacity-50">...</span>
          ) : isBlurred ? (
            <EyeOff className="w-4 h-4 mr-1.5 text-amber-600" />
          ) : (
            <Eye className="w-4 h-4 mr-1.5 text-blue-600" />
          )}
          {isBlurred ? 'Premium Bloqueado' : 'Premium Liberado'}
        </Button>
      )}

      {/* Share Link */}
      {isReleased && onShareLink && (
        <Button
          variant="outline"
          size="sm"
          onClick={onShareLink}
        >
          <Share2 className="w-4 h-4 mr-1.5 flex-shrink-0" />
          Copiar Link
        </Button>
      )}
    </div>
  );
}
