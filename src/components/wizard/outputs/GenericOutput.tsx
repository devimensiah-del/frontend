/**
 * Generic Output Component
 * Fallback renderer for framework outputs
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface GenericOutputProps {
  title: string
  data: Record<string, unknown>
}

export function GenericOutput({ title, data }: GenericOutputProps) {
  const renderValue = (value: unknown): React.ReactNode => {
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc list-inside space-y-1">
          {value.map((item, idx) => (
            <li key={idx} className="text-sm">
              {typeof item === 'object' ? JSON.stringify(item) : String(item)}
            </li>
          ))}
        </ul>
      )
    }

    if (typeof value === 'object' && value !== null) {
      return (
        <div className="space-y-2 pl-4 border-l-2 border-muted">
          {Object.entries(value).map(([k, v]) => (
            <div key={k}>
              <p className="text-xs font-semibold text-muted-foreground uppercase">{k}</p>
              {renderValue(v)}
            </div>
          ))}
        </div>
      )
    }

    return <p className="text-sm">{String(value)}</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
      </div>

      <div className="space-y-4">
        {Object.entries(data).map(([key, value]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="text-base capitalize">
                {key.replace(/_/g, ' ')}
              </CardTitle>
            </CardHeader>
            <CardContent>{renderValue(value)}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
