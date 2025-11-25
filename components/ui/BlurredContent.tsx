'use client';

import React from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils/cn';

interface BlurredContentProps {
  children: React.ReactNode;
  accessLevel: 'free' | 'partial' | 'locked';
  teaserMessage?: string;
  onUnlock?: () => void;
  className?: string;
  // For partial blur, render a preview
  previewContent?: React.ReactNode;
}

export function BlurredContent({
  children,
  accessLevel,
  teaserMessage = 'Desbloqueie a análise completa para ver este conteúdo.',
  onUnlock,
  className,
  previewContent,
}: BlurredContentProps) {
  // Free access - render normally
  if (accessLevel === 'free') {
    return <>{children}</>;
  }

  // Partial access - show preview + blurred rest
  if (accessLevel === 'partial') {
    return (
      <div className={cn('relative', className)}>
        {/* Preview content (visible) */}
        {previewContent && (
          <div className="mb-4">
            {previewContent}
          </div>
        )}

        {/* Blurred content */}
        <div className="relative">
          <div className="blur-sm select-none pointer-events-none opacity-60">
            {children}
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-white flex items-end justify-center pb-6">
            <UnlockBanner
              message={teaserMessage}
              onUnlock={onUnlock}
              variant="partial"
            />
          </div>
        </div>
      </div>
    );
  }

  // Locked access - full blur
  return (
    <div className={cn('relative min-h-[200px]', className)}>
      {/* Heavily blurred content */}
      <div className="blur-md select-none pointer-events-none opacity-40">
        {children}
      </div>

      {/* Full overlay with CTA */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/90 to-white flex items-center justify-center">
        <UnlockBanner
          message={teaserMessage}
          onUnlock={onUnlock}
          variant="locked"
        />
      </div>
    </div>
  );
}

interface UnlockBannerProps {
  message: string;
  onUnlock?: () => void;
  variant: 'partial' | 'locked';
}

function UnlockBanner({ message, onUnlock, variant }: UnlockBannerProps) {
  return (
    <div className={cn(
      'text-center p-6 rounded-xl max-w-md mx-auto',
      variant === 'locked'
        ? 'bg-gradient-to-br from-navy-50 to-gold-50 border border-navy-200 shadow-lg'
        : 'bg-white/95 border border-gray-200 shadow-md'
    )}>
      <div className={cn(
        'w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4',
        variant === 'locked'
          ? 'bg-gradient-to-br from-gold-400 to-gold-600'
          : 'bg-gray-100'
      )}>
        {variant === 'locked' ? (
          <Lock className="w-6 h-6 text-white" />
        ) : (
          <Sparkles className="w-6 h-6 text-gold-600" />
        )}
      </div>

      <h4 className={cn(
        'font-semibold mb-2',
        variant === 'locked' ? 'text-navy-900 text-lg' : 'text-gray-800'
      )}>
        {variant === 'locked' ? 'Conteúdo Premium' : 'Prévia Disponível'}
      </h4>

      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        {message}
      </p>

      <Button
        onClick={onUnlock}
        className={cn(
          'w-full',
          variant === 'locked'
            ? 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white shadow-md'
            : 'bg-navy-600 hover:bg-navy-700 text-white'
        )}
      >
        <Lock className="w-4 h-4 mr-2" />
        Desbloquear Análise Completa
      </Button>

      <p className="text-xs text-gray-500 mt-3">
        {variant === 'locked'
          ? 'Acesso a todos os 11 frameworks estratégicos'
          : 'Veja a análise detalhada deste framework'
        }
      </p>
    </div>
  );
}

// Simpler inline blur for partial field hiding
interface BlurredFieldProps {
  children: React.ReactNode;
  isVisible: boolean;
  className?: string;
}

export function BlurredField({ children, isVisible, className }: BlurredFieldProps) {
  if (isVisible) {
    return <>{children}</>;
  }

  return (
    <div className={cn('relative inline-block', className)}>
      <span className="blur-sm select-none pointer-events-none opacity-50">
        {children}
      </span>
    </div>
  );
}
