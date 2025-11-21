"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/badge';
import { useWorkflowCounts } from '@/lib/hooks/use-workflow-counts';

/* ============================================
   WORKFLOW PROGRESS COMPONENT
   Visual indicator of 3-stage workflow
   ============================================ */

interface WorkflowStage {
  stage: number;
  name: string;
  href: string;
  icon: string;
  description: string;
}

const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    stage: 1,
    name: 'Envios',
    href: '/admin/dashboard',
    icon: '📋',
    description: 'Revisar envios de clientes',
  },
  {
    stage: 2,
    name: 'Enriquecimento',
    href: '/admin/enriquecimento',
    icon: '✨',
    description: 'Editar dados enriquecidos',
  },
  {
    stage: 3,
    name: 'Análise',
    href: '/admin/submissions',
    icon: '📊',
    description: 'Criar relatórios estratégicos',
  },
];

export function WorkflowProgress() {
  const pathname = usePathname();
  const { data: counts, isLoading } = useWorkflowCounts();

  const getStageCount = (stage: number): number => {
    if (!counts) return 0;
    switch (stage) {
      case 1:
        return counts.stage1;
      case 2:
        return counts.stage2;
      case 3:
        return counts.stage3;
      default:
        return 0;
    }
  };

  const isActiveStage = (href: string): boolean => {
    return pathname === href;
  };

  return (
    <div className="space-y-2">
      {/* Workflow Stages */}
      {WORKFLOW_STAGES.map((stage, index) => {
        const isActive = isActiveStage(stage.href);
        const count = getStageCount(stage.stage);

        return (
          <div key={stage.stage}>
            <Link
              href={stage.href}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-gold-500/10 border border-gold-500/30 shadow-sm'
                  : 'hover:bg-navy-800/50 border border-transparent'
              )}
            >
              {/* Stage Number Circle */}
              <div
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full font-heading font-bold text-xs transition-colors',
                  isActive
                    ? 'bg-gold-500 text-navy-900'
                    : 'bg-navy-800 text-gray-400 group-hover:bg-navy-700 group-hover:text-white'
                )}
              >
                {stage.stage}
              </div>

              {/* Stage Icon & Name */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{stage.icon}</span>
                  <span
                    className={cn(
                      'font-heading font-bold text-xs uppercase tracking-widest truncate',
                      isActive ? 'text-gold-500' : 'text-gray-300 group-hover:text-white'
                    )}
                  >
                    {stage.name}
                  </span>
                </div>
                <div
                  className={cn(
                    'text-[10px] text-gray-500 mt-0.5 truncate',
                    isActive && 'text-gold-600/70'
                  )}
                >
                  {stage.description}
                </div>
              </div>

              {/* Count Badge */}
              <Badge
                variant={isActive ? 'gold' : 'default'}
                size="sm"
                className={cn(
                  'min-w-[28px] justify-center',
                  isLoading && 'opacity-50',
                  count === 0 && 'opacity-40'
                )}
              >
                {isLoading ? '...' : count}
              </Badge>
            </Link>

            {/* Connecting Line (except after last stage) */}
            {index < WORKFLOW_STAGES.length - 1 && (
              <div className="ml-7 h-3 w-0.5 bg-navy-800" />
            )}
          </div>
        );
      })}
    </div>
  );
}
