"use client";

import { useEffect } from "react";

/**
 * Global Error Page
 *
 * Catches errors in the root layout.tsx
 * Must define its own <html> and <body> tags
 * Less frequently active than error.tsx
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console (in production, send to error tracking service)
    console.error("Global error caught:", error);

    // TODO: Log to error tracking service (Sentry, LogRocket, etc.)
    // Example: Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-[#F5F3ED] p-6">
          <div className="max-w-md w-full space-y-8 text-center">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-[#C9A959]/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-[#C9A959]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-3">
              <h1 className="text-3xl font-light text-[#1A1A1A] tracking-tight">
                Erro crítico
              </h1>
              <p className="text-[#4A4A4A] text-sm leading-relaxed">
                Encontramos um problema crítico no sistema. Estamos trabalhando
                para resolver. Por favor, tente novamente em alguns instantes.
              </p>
            </div>

            {/* Development Mode: Show Error Details */}
            {process.env.NODE_ENV === "development" && (
              <details className="text-left bg-red-50 border border-red-200 rounded-lg p-4">
                <summary className="cursor-pointer font-medium text-red-800 text-sm">
                  Detalhes do erro (apenas em desenvolvimento)
                </summary>
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-mono text-red-700 break-all">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-red-600">
                      Digest: {error.digest}
                    </p>
                  )}
                  {error.stack && (
                    <pre className="text-xs font-mono text-red-600 overflow-auto max-h-40 bg-white p-2 rounded">
                      {error.stack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={reset}
                className="w-full px-8 py-3 bg-[#1A1A1A] text-[#F5F3ED] text-sm font-light tracking-wide hover:bg-[#C9A959] transition-all duration-300"
              >
                Tentar Novamente
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="w-full px-8 py-3 border border-[#1A1A1A] text-[#1A1A1A] text-sm font-light tracking-wide hover:bg-[#1A1A1A] hover:text-[#F5F3ED] transition-all duration-300"
              >
                Voltar ao Início
              </button>
            </div>

            {/* Support Message */}
            <p className="text-xs text-[#757575]">
              Se o problema persistir, entre em contato com nosso suporte.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
