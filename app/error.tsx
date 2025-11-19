'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Algo deu errado
        </h2>

        <p className="text-gray-600 mb-6">
          Ocorreu um erro ao processar sua solicitação. Tente novamente.
        </p>

        {process.env.NODE_ENV === 'development' && error?.message && (
          <details className="text-left mb-4 p-4 bg-gray-100 rounded max-h-40 overflow-y-auto">
            <summary className="cursor-pointer font-semibold text-sm">
              Detalhes (dev only)
            </summary>
            <pre className="mt-2 text-xs whitespace-pre-wrap break-words">
              {error.message}
            </pre>
          </details>
        )}

        <button
          onClick={reset}
          className="w-full bg-[hsl(45_100%_55%)] text-[hsl(195_100%_8%)] px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition duration-200 mb-3"
        >
          Tentar Novamente
        </button>

        <a
          href="/"
          className="block text-[hsl(195_100%_8%)] hover:underline text-sm"
        >
          Voltar ao Início
        </a>
      </div>
    </div>
  );
}
