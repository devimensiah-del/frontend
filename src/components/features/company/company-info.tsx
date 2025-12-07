import { Building2, Globe, MapPin, Users, Briefcase } from 'lucide-react'
import type { Company } from '@/lib/types'

interface CompanyInfoProps {
  company: Company
}

export function CompanyInfo({ company }: CompanyInfoProps) {
  const infoItems = [
    { icon: Building2, label: 'Setor', value: company.industry },
    { icon: Globe, label: 'Website', value: company.website, isLink: true },
    { icon: MapPin, label: 'Localização', value: company.location || company.headquarters },
    { icon: Users, label: 'Tamanho', value: company.company_size || company.employees_range },
    { icon: Briefcase, label: 'Modelo de Negócio', value: company.business_model },
  ].filter((item) => item.value)

  return (
    <div className="bg-white border border-line rounded-lg p-6">
      <h2 className="text-lg font-semibold text-navy-900 mb-4">
        Informações da Empresa
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {infoItems.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-navy-900/5 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-navy-900" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                {item.isLink ? (
                  <a
                    href={item.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gold-500 hover:underline"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm text-navy-900">{item.value}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Enriched Data */}
      {company.value_proposition && (
        <div className="mt-6 pt-6 border-t border-line">
          <h3 className="text-sm font-semibold text-navy-900 mb-2">
            Proposta de Valor
          </h3>
          <p className="text-sm text-muted-foreground">{company.value_proposition}</p>
        </div>
      )}

      {company.strengths && company.strengths.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-navy-900 mb-2">Forças</h3>
          <div className="flex flex-wrap gap-2">
            {company.strengths.map((strength, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-green-500/10 text-green-600 text-xs rounded"
              >
                {strength}
              </span>
            ))}
          </div>
        </div>
      )}

      {company.competitors && company.competitors.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-navy-900 mb-2">
            Principais Concorrentes
          </h3>
          <div className="flex flex-wrap gap-2">
            {company.competitors.map((competitor, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-navy-900/5 text-navy-900 text-xs rounded"
              >
                {competitor}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
