/**
 * BlurredContent Component
 *
 * Wrapper that applies blur filter to premium content with paywall overlay.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import { Lock } from "lucide-react";

// ============================================
// TYPES
// ============================================

export interface BlurredContentProps {
  children: React.ReactNode;
  isBlurred?: boolean;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export const BlurredContent: React.FC<BlurredContentProps> = ({
  children,
  isBlurred = false,
  className,
}) => {
  if (!isBlurred) {
    return <>{children}</>;
  }

  return (
    <div className={cn("relative", className)}>
      {/* Blurred Content */}
      <div className="filter blur-md select-none pointer-events-none">
        {children}
      </div>

      {/* Paywall Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-surface-paper/80 backdrop-blur-sm">
        <div className="text-center p-8 max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500 rounded-full mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-navy-900 mb-2 uppercase tracking-wider">
            Conteúdo Premium
          </h3>
          <p className="text-sm text-text-secondary mb-4">
            Este framework está disponível apenas na versão completa do relatório.
          </p>
          <a
            href="mailto:contato@imensiah.com?subject=Solicitar%20Acesso%20Completo"
            className="inline-block bg-navy-900 text-white px-6 py-3 text-sm font-medium uppercase tracking-wider hover:bg-gold-500 hover:text-navy-900 transition-all"
          >
            Solicitar Acesso Completo
          </a>
        </div>
      </div>
    </div>
  );
};
