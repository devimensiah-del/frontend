const pipelineSteps = [
  'PESTEL Analysis',
  "Porter's 5 Forces",
  'Benchmarking',
  'SWOT Validado',
  'TAM / SAM / SOM',
  'Blue Ocean',
  'Growth Loops',
  'Cenários Futuros',
  'Matriz de Decisão',
  'Plano 90 Dias',
  'Balanced Scorecard',
  'Risk Assessment',
]

const stats = [
  {
    value: '48h',
    label: 'Tempo de Entrega',
    desc: 'Redução de 95% no tempo de análise comparado a consultorias tradicionais.',
  },
  {
    value: '10x',
    label: 'ROI Estimado',
    desc: 'Decisões mais precisas evitam desperdícios e focam em alavancas de crescimento real.',
  },
  {
    value: '100%',
    label: 'Confidencialidade',
    desc: 'Dados anonimizados e tratados com rigor de compliance enterprise.',
  },
]

export function PipelineSection() {
  return (
    <section className="py-24 bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-medium text-white mb-4">
            Pipeline de Análise Estratégica
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-gray-400">
            Cada framework alimenta o próximo, criando um raciocínio estratégico
            cumulativo que reduz ruído e elimina vieses.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-16">
          {pipelineSteps.map((step, index) => (
            <div
              key={index}
              className="p-3 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-center"
            >
              <span className="text-white text-sm font-medium">{step}</span>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl font-bold text-gold-500 mb-2">
                {stat.value}
              </div>
              <div className="text-white font-medium mb-2">{stat.label}</div>
              <p className="text-gray-400 text-sm">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
