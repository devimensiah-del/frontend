'use client';

import React from 'react';
import { EyeOff, Eye, Globe, Lock, Unlock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportVisibilityControlsProps {
  isVisibleToUser: boolean;
  isPublic: boolean;
  isBlurred: boolean;
  isLoading?: boolean;
  onVisibilityChange: (visible: boolean) => void;
  onPublicChange: (isPublic: boolean) => void;
  onBlurChange: (blurred: boolean) => void;
  variant?: 'compact' | 'full';
  className?: string;
}

/**
 * 4-State Visibility Matrix Controls
 *
 * Three independent icon buttons that control:
 * 1. Visible (is_visible_to_user) - Whether the report is visible at all
 * 2. Public (is_public) - Whether access code works without login (only when visible)
 * 3. Blur (is_blurred) - Whether premium frameworks are blurred
 *
 * States:
 * - Hidden: visible=false (blur/public don't matter)
 * - Private Blurred: visible=true, public=false, blur=true
 * - Private Full: visible=true, public=false, blur=false
 * - Public Blurred: visible=true, public=true, blur=true
 * - Public Full: visible=true, public=true, blur=false
 */
export function ReportVisibilityControls({
  isVisibleToUser,
  isPublic,
  isBlurred,
  isLoading = false,
  onVisibilityChange,
  onPublicChange,
  onBlurChange,
  variant = 'compact',
  className,
}: ReportVisibilityControlsProps) {

  // Disable public and blur toggles when not visible
  const isPublicDisabled = !isVisibleToUser || isLoading;
  const isBlurDisabled = !isVisibleToUser || isLoading;

  if (variant === 'full') {
    return (
      <div className={cn('flex flex-col gap-3 p-4 bg-gray-50 rounded-lg border', className)}>
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <Loader2 className="w-3 h-3 animate-spin" />
            Atualizando...
          </div>
        )}

        {/* Visible Control */}
        <button
          onClick={() => !isLoading && onVisibilityChange(!isVisibleToUser)}
          disabled={isLoading}
          className={cn(
            'flex items-center gap-3 p-3 rounded-lg border transition-all text-left',
            isVisibleToUser
              ? 'bg-green-50 border-green-300 text-green-800'
              : 'bg-gray-100 border-gray-300 text-gray-600',
            isLoading && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isVisibleToUser ? (
            <Eye className="w-5 h-5 text-green-600" />
          ) : (
            <EyeOff className="w-5 h-5 text-gray-400" />
          )}
          <div className="flex-1">
            <div className="font-medium text-sm">
              {isVisibleToUser ? 'Visível' : 'Oculto'}
            </div>
            <div className="text-xs opacity-75">
              {isVisibleToUser ? 'Usuário pode ver o relatório' : 'Apenas admin pode ver'}
            </div>
          </div>
        </button>

        {/* Public Control */}
        <button
          onClick={() => !isPublicDisabled && onPublicChange(!isPublic)}
          disabled={isPublicDisabled}
          className={cn(
            'flex items-center gap-3 p-3 rounded-lg border transition-all text-left',
            !isVisibleToUser
              ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
              : isPublic
              ? 'bg-blue-50 border-blue-300 text-blue-800'
              : 'bg-gray-100 border-gray-300 text-gray-600',
            isLoading && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isPublic && isVisibleToUser ? (
            <Globe className="w-5 h-5 text-blue-600" />
          ) : (
            <Lock className="w-5 h-5 text-gray-400" />
          )}
          <div className="flex-1">
            <div className="font-medium text-sm">
              {isPublic ? 'Público' : 'Privado'}
            </div>
            <div className="text-xs opacity-75">
              {!isVisibleToUser
                ? 'Ative visibilidade primeiro'
                : isPublic
                ? 'Qualquer um com link acessa'
                : 'Requer login para acessar'}
            </div>
          </div>
        </button>

        {/* Blur Control */}
        <button
          onClick={() => !isBlurDisabled && onBlurChange(!isBlurred)}
          disabled={isBlurDisabled}
          className={cn(
            'flex items-center gap-3 p-3 rounded-lg border transition-all text-left',
            !isVisibleToUser
              ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
              : isBlurred
              ? 'bg-amber-50 border-amber-300 text-amber-800'
              : 'bg-green-50 border-green-300 text-green-800',
            isLoading && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isBlurred || !isVisibleToUser ? (
            <Lock className="w-5 h-5 text-amber-600" />
          ) : (
            <Unlock className="w-5 h-5 text-green-600" />
          )}
          <div className="flex-1">
            <div className="font-medium text-sm">
              {isBlurred ? 'Premium Blur' : 'Premium Full'}
            </div>
            <div className="text-xs opacity-75">
              {!isVisibleToUser
                ? 'Ative visibilidade primeiro'
                : isBlurred
                ? 'Seções premium borradas'
                : 'Todas seções visíveis'}
            </div>
          </div>
        </button>
      </div>
    );
  }

  // Compact variant - icon buttons with labels
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {isLoading && (
        <Loader2 className="w-3 h-3 animate-spin text-gray-400 mr-1" />
      )}

      {/* Visible Toggle */}
      <button
        onClick={() => !isLoading && onVisibilityChange(!isVisibleToUser)}
        disabled={isLoading}
        title={isVisibleToUser ? 'Visível para usuário' : 'Oculto (apenas admin)'}
        className={cn(
          'p-1.5 rounded transition-colors',
          isVisibleToUser
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
          isLoading && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isVisibleToUser ? (
          <Eye className="w-3.5 h-3.5" />
        ) : (
          <EyeOff className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Public Toggle */}
      <button
        onClick={() => !isPublicDisabled && onPublicChange(!isPublic)}
        disabled={isPublicDisabled}
        title={
          !isVisibleToUser
            ? 'Ative visibilidade primeiro'
            : isPublic
            ? 'Público (sem login)'
            : 'Privado (login necessário)'
        }
        className={cn(
          'p-1.5 rounded transition-colors',
          !isVisibleToUser
            ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
            : isPublic
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
          isLoading && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isPublic && isVisibleToUser ? (
          <Globe className="w-3.5 h-3.5" />
        ) : (
          <Lock className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Blur Toggle */}
      <button
        onClick={() => !isBlurDisabled && onBlurChange(!isBlurred)}
        disabled={isBlurDisabled}
        title={
          !isVisibleToUser
            ? 'Ative visibilidade primeiro'
            : isBlurred
            ? 'Premium bloqueado (blur)'
            : 'Premium liberado'
        }
        className={cn(
          'p-1.5 rounded transition-colors',
          !isVisibleToUser
            ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
            : isBlurred
            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            : 'bg-green-100 text-green-700 hover:bg-green-200',
          isLoading && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isBlurred || !isVisibleToUser ? (
          <Lock className="w-3.5 h-3.5" />
        ) : (
          <Unlock className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}

export default ReportVisibilityControls;
