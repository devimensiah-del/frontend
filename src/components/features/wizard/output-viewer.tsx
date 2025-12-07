'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface OutputViewerProps {
  frameworkCode: string
  output: Record<string, unknown>
  className?: string
}

/**
 * Renders framework output using appropriate visualizer
 * Maps framework codes to visualizer components
 */
export function OutputViewer({ frameworkCode, output, className }: OutputViewerProps) {
  // For now, render as formatted JSON
  // Will be replaced with specific framework visualizers
  const renderOutput = () => {
    switch (frameworkCode) {
      case 'pestel':
        return <PestelViewer data={output} />
      case 'swot':
        return <SwotViewer data={output} />
      case 'porter':
        return <PorterViewer data={output} />
      case 'tam_sam_som':
        return <TamViewer data={output} />
      case 'blue_ocean':
        return <BlueOceanViewer data={output} />
      case 'growth_hacking':
        return <GrowthLoopsViewer data={output} />
      case 'scenarios':
        return <ScenariosViewer data={output} />
      case 'okrs':
        return <OkrViewer data={output} />
      case 'bsc':
        return <BscViewer data={output} />
      case 'decision_matrix':
        return <DecisionMatrixViewer data={output} />
      case 'benchmarking':
        return <BenchmarkingViewer data={output} />
      default:
        return <GenericViewer data={output} />
    }
  }

  return (
    <div className={cn('bg-white border border-line p-6', className)}>
      {renderOutput()}
    </div>
  )
}

// Generic viewer for unknown frameworks
function GenericViewer({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="space-y-4">
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-2">
            {key.replace(/_/g, ' ')}
          </h4>
          <div className="text-sm">
            {typeof value === 'string' ? (
              <p>{value}</p>
            ) : Array.isArray(value) ? (
              <ul className="list-disc pl-4 space-y-1">
                {value.map((item, i) => (
                  <li key={i}>{typeof item === 'string' ? item : JSON.stringify(item)}</li>
                ))}
              </ul>
            ) : (
              <pre className="text-xs bg-surface-paper p-2 overflow-auto">
                {JSON.stringify(value, null, 2)}
              </pre>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// Placeholder visualizers - will be expanded
function PestelViewer({ data }: { data: Record<string, unknown> }) {
  const categories = ['political', 'economic', 'social', 'technological', 'environmental', 'legal']
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {categories.map((cat) => (
        <div key={cat} className="border border-line p-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-2">
            {cat.charAt(0).toUpperCase()}
          </h4>
          <ul className="text-sm space-y-1">
            {Array.isArray(data[cat]) &&
              (data[cat] as string[]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
      ))}
    </div>
  )
}

function SwotViewer({ data }: { data: Record<string, unknown> }) {
  const quadrants = [
    { key: 'strengths', label: 'Forças', color: 'bg-success-light' },
    { key: 'weaknesses', label: 'Fraquezas', color: 'bg-error-light' },
    { key: 'opportunities', label: 'Oportunidades', color: 'bg-info-light' },
    { key: 'threats', label: 'Ameaças', color: 'bg-warning-light' },
  ]
  return (
    <div className="grid grid-cols-2 gap-1">
      {quadrants.map((q) => (
        <div key={q.key} className={cn('p-4', q.color)}>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-2">{q.label}</h4>
          <ul className="text-sm space-y-1">
            {Array.isArray(data[q.key]) &&
              (data[q.key] as Array<{ content: string }>).map((item, i) => (
                <li key={i}>• {typeof item === 'string' ? item : item.content}</li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function PorterViewer({ data }: { data: Record<string, unknown> }) {
  return <GenericViewer data={data} />
}

function TamViewer({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {['tam', 'sam', 'som'].map((key, i) => (
        <div
          key={key}
          className="flex items-center justify-center text-center border border-gold-500 bg-gold-50"
          style={{
            width: `${100 - i * 25}%`,
            padding: '1rem',
          }}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
              {key.toUpperCase()}
            </span>
            <p className="text-sm mt-1">{data[key] as string}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function BlueOceanViewer({ data }: { data: Record<string, unknown> }) {
  const actions = ['eliminate', 'reduce', 'raise', 'create']
  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action) => (
        <div key={action} className="border border-line p-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-2">
            {action}
          </h4>
          <ul className="text-sm space-y-1">
            {Array.isArray(data[action]) &&
              (data[action] as string[]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
      ))}
    </div>
  )
}

function GrowthLoopsViewer({ data }: { data: Record<string, unknown> }) {
  return <GenericViewer data={data} />
}

function ScenariosViewer({ data }: { data: Record<string, unknown> }) {
  const scenarios = ['optimistic', 'realist', 'pessimistic']
  return (
    <div className="grid grid-cols-3 gap-4">
      {scenarios.map((key) => {
        const scenario = data[key] as Record<string, unknown> | undefined
        return (
          <div key={key} className="border border-line p-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-2">
              {key === 'optimistic' ? 'Otimista' : key === 'realist' ? 'Realista' : 'Pessimista'}
            </h4>
            {scenario && (
              <div className="text-sm">
                <p className="font-medium">{scenario.name as string}</p>
                <p className="text-text-secondary mt-1">{scenario.description as string}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function OkrViewer({ data }: { data: Record<string, unknown> }) {
  return <GenericViewer data={data} />
}

function BscViewer({ data }: { data: Record<string, unknown> }) {
  const perspectives = ['financial', 'customer', 'internal_processes', 'learning_growth']
  return (
    <div className="grid grid-cols-2 gap-4">
      {perspectives.map((key) => (
        <div key={key} className="border border-line p-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-2">
            {key.replace(/_/g, ' ')}
          </h4>
          <ul className="text-sm space-y-1">
            {Array.isArray(data[key]) &&
              (data[key] as string[]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
      ))}
    </div>
  )
}

function DecisionMatrixViewer({ data }: { data: Record<string, unknown> }) {
  return <GenericViewer data={data} />
}

function BenchmarkingViewer({ data }: { data: Record<string, unknown> }) {
  return <GenericViewer data={data} />
}
