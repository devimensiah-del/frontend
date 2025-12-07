'use client'

import { Building2, Calendar, MapPin, Briefcase } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ReportCoverProps {
  companyName: string
  industry?: string
  location?: string
  challenge?: string
  createdAt: string
}

export function ReportCover({
  companyName,
  industry,
  location,
  challenge,
  createdAt
}: ReportCoverProps) {
  return (
    <div className="bg-navy-900 text-white py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-medium uppercase tracking-[0.2em] text-gold-500 mb-4">
            Diagnóstico Estratégico Empresarial
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-medium mb-6">
            {companyName}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-300">
            {industry && (
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>{industry}</span>
              </div>
            )}

            {location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {format(new Date(createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </div>
          </div>
        </div>

        {challenge && (
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="bg-white/5 border border-white/10 p-6 md:p-8">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-gold-500 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-sm font-medium uppercase tracking-widest text-gold-500 mb-2">
                    Desafio de Negócio
                  </h2>
                  <p className="text-gray-200 leading-relaxed">
                    {challenge}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
