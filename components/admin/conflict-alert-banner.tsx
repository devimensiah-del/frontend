'use client';

import { DataConflict } from '@/types';
import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

interface ConflictAlertBannerProps {
  conflicts: DataConflict[];
}

export function ConflictAlertBanner({ conflicts }: ConflictAlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (conflicts.length === 0 || dismissed) {
    return null;
  }

  const highSeverityConflicts = conflicts.filter(c => c.severity === 'high');
  const mediumSeverityConflicts = conflicts.filter(c => c.severity === 'medium');

  return (
    <div className="mb-6 p-4 bg-red-50 border-2 border-red-400 rounded-lg shadow-lg animate-pulse">
      <div className="flex items-start gap-4">
        <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-red-900">
              Atenção: {conflicts.length} Conflito{conflicts.length > 1 ? 's' : ''} Detectado{conflicts.length > 1 ? 's' : ''}
            </h3>
            <button
              onClick={() => setDismissed(true)}
              className="text-red-600 hover:text-red-800 transition-colors"
              aria-label="Dismiss alert"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-red-800 mb-4">
            Dados conflitantes foram encontrados entre as informações fornecidas e os dados coletados.
            Revise cuidadosamente antes de aprovar.
          </p>

          {highSeverityConflicts.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-red-900 mb-2">Conflitos Críticos:</h4>
              <ul className="space-y-2">
                {highSeverityConflicts.map((conflict, idx) => (
                  <li key={idx} className="text-sm bg-white p-3 rounded border border-red-300">
                    <div className="font-medium text-red-900 mb-1">{conflict.field}</div>
                    <div className="text-gray-700">{conflict.description}</div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="font-semibold">Enviado:</span> {conflict.submitted_value}
                      </div>
                      <div>
                        <span className="font-semibold">Encontrado ({conflict.source}):</span> {conflict.enriched_value}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {mediumSeverityConflicts.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-red-900 mb-2">Conflitos Moderados:</h4>
              <ul className="space-y-2">
                {mediumSeverityConflicts.map((conflict, idx) => (
                  <li key={idx} className="text-sm bg-white p-3 rounded border border-yellow-300">
                    <div className="font-medium text-yellow-900 mb-1">{conflict.field}</div>
                    <div className="text-gray-700">{conflict.description}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
