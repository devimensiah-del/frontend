import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface StatsOverviewProps {
  totalSubmissions: number
  completedAnalyses: number
  pendingAnalyses: number
  failedAnalyses: number
}

export function StatsOverview({
  totalSubmissions,
  completedAnalyses,
  pendingAnalyses,
  failedAnalyses,
}: StatsOverviewProps) {
  const stats = [
    {
      label: 'Total de Submissões',
      value: totalSubmissions,
      icon: FileText,
      color: 'text-navy-900',
      bgColor: 'bg-navy-900/5',
    },
    {
      label: 'Análises Completas',
      value: completedAnalyses,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Em Processamento',
      value: pendingAnalyses,
      icon: Clock,
      color: 'text-gold-500',
      bgColor: 'bg-gold-500/10',
    },
    {
      label: 'Com Erro',
      value: failedAnalyses,
      icon: AlertCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="bg-white p-6 border border-line rounded-lg"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}
              >
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
