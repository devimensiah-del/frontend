interface FrameworkViewerProps {
  frameworkKey: string
  data: Record<string, unknown>
}

export function FrameworkViewer({ frameworkKey, data }: FrameworkViewerProps) {
  if (!data) {
    return (
      <div className="bg-white border border-line rounded-lg p-6 text-center">
        <p className="text-muted-foreground">
          Dados não disponíveis para este framework.
        </p>
      </div>
    )
  }

  // Render based on framework type
  return (
    <div className="bg-white border border-line rounded-lg p-6">
      <div className="prose prose-slate max-w-none">
        <RenderFrameworkContent frameworkKey={frameworkKey} data={data} />
      </div>
    </div>
  )
}

function RenderFrameworkContent({
  frameworkKey,
  data,
}: {
  frameworkKey: string
  data: Record<string, unknown>
}) {
  // Handle summary field if present
  const summary = data.summary as string | undefined

  return (
    <div className="space-y-6">
      {/* Main content based on framework */}
      {frameworkKey === 'pestel' && <PESTELView data={data} />}
      {frameworkKey === 'porter' && <PorterView data={data} />}
      {frameworkKey === 'swot' && <SWOTView data={data} />}
      {frameworkKey === 'tam_sam_som' && <TamSamSomView data={data} />}

      {/* Default view for other frameworks */}
      {!['pestel', 'porter', 'swot', 'tam_sam_som'].includes(frameworkKey) && (
        <GenericView data={data} />
      )}

      {/* Summary */}
      {summary && (
        <div className="mt-6 pt-6 border-t border-line">
          <h3 className="text-lg font-semibold text-navy-900 mb-2">Resumo</h3>
          <p className="text-muted-foreground">{summary}</p>
        </div>
      )}
    </div>
  )
}

function PESTELView({ data }: { data: Record<string, unknown> }) {
  const factors = ['political', 'economic', 'social', 'technological', 'environmental', 'legal']
  const labels: Record<string, string> = {
    political: 'Político',
    economic: 'Econômico',
    social: 'Social',
    technological: 'Tecnológico',
    environmental: 'Ambiental',
    legal: 'Legal',
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {factors.map((factor) => {
        const items = data[factor] as string[] | undefined
        if (!items || items.length === 0) return null
        return (
          <div key={factor} className="p-4 border border-line rounded-lg">
            <h4 className="font-semibold text-navy-900 mb-2">{labels[factor]}</h4>
            <ul className="space-y-1">
              {items.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-gold-500">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

function PorterView({ data }: { data: Record<string, unknown> }) {
  const forces = data.forces as Array<{
    force: string
    intensity: string
    description: string
  }> | undefined

  if (!forces) return <GenericView data={data} />

  return (
    <div className="space-y-4">
      {forces.map((force, i) => (
        <div key={i} className="p-4 border border-line rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-navy-900">{force.force}</h4>
            <span className="px-2 py-1 text-xs font-medium bg-gold-500/10 text-gold-500 rounded">
              {force.intensity}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{force.description}</p>
        </div>
      ))}
    </div>
  )
}

function SWOTView({ data }: { data: Record<string, unknown> }) {
  const quadrants = [
    { key: 'strengths', label: 'Forças', color: 'bg-green-500/10 text-green-600' },
    { key: 'weaknesses', label: 'Fraquezas', color: 'bg-red-500/10 text-red-600' },
    { key: 'opportunities', label: 'Oportunidades', color: 'bg-blue-500/10 text-blue-600' },
    { key: 'threats', label: 'Ameaças', color: 'bg-orange-500/10 text-orange-600' },
  ]

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {quadrants.map((quadrant) => {
        const items = data[quadrant.key] as Array<{
          content: string
          confidence?: string
          source?: string
        }> | string[] | undefined

        if (!items || items.length === 0) return null

        return (
          <div key={quadrant.key} className={`p-4 rounded-lg ${quadrant.color}`}>
            <h4 className="font-semibold mb-3">{quadrant.label}</h4>
            <ul className="space-y-2">
              {items.map((item, i) => (
                <li key={i} className="text-sm">
                  {typeof item === 'string' ? (
                    item
                  ) : (
                    <>
                      <p>{item.content}</p>
                      {item.confidence && (
                        <span className="text-xs opacity-70">
                          Confiança: {item.confidence}
                        </span>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

function TamSamSomView({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {['tam', 'sam', 'som'].map((key) => {
        const value = data[key] as string | undefined
        if (!value) return null
        return (
          <div key={key} className="p-6 border border-line rounded-lg text-center">
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              {key.toUpperCase()}
            </h4>
            <p className="text-2xl font-bold text-gold-500">{value}</p>
          </div>
        )
      })}
    </div>
  )
}

function GenericView({ data }: { data: Record<string, unknown> }) {
  // Filter out summary and render other fields
  const entries = Object.entries(data).filter(([key]) => key !== 'summary')

  return (
    <div className="space-y-4">
      {entries.map(([key, value]) => (
        <div key={key} className="p-4 border border-line rounded-lg">
          <h4 className="font-semibold text-navy-900 capitalize mb-2">
            {key.replace(/_/g, ' ')}
          </h4>
          <div className="text-sm text-muted-foreground">
            {typeof value === 'string' ? (
              <p>{value}</p>
            ) : Array.isArray(value) ? (
              <ul className="space-y-1">
                {value.map((item, i) => (
                  <li key={i}>
                    {typeof item === 'string' ? item : JSON.stringify(item)}
                  </li>
                ))}
              </ul>
            ) : (
              <pre className="text-xs overflow-auto">
                {JSON.stringify(value, null, 2)}
              </pre>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
