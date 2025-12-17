'use client'

import { FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getChallengeType, getCategoryInfo } from '@/lib/config/challenges'
import type { ChallengeCategory, ChallengeType } from '@/lib/types'

interface ChallengeContextCardProps {
  description: string
  category: string
  type: string
}

export function ChallengeContextCard({ description, category, type }: ChallengeContextCardProps) {
  const categoryInfo = getCategoryInfo(category as ChallengeCategory)
  const typeInfo = getChallengeType(type as ChallengeType)

  return (
    <div className="bg-white border border-line p-4 lg:p-6">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-line">
        <FileText className="w-4 h-4 text-gold-500" />
        <h2 className="text-sm font-medium uppercase tracking-wide text-navy-900">
          Desafio Original
        </h2>
      </div>

      <div className="space-y-4">
        {/* Category and Type Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-gold-600 border-gold-300 bg-gold-50">
            <span className="mr-1">{categoryInfo?.emoji || '📋'}</span>
            {categoryInfo?.label || category}
          </Badge>
          <Badge variant="outline" className="text-navy-600 border-navy-300 bg-navy-50">
            {typeInfo?.label || type}
          </Badge>
        </div>

        {/* Description */}
        <div className="bg-gray-50 border border-gray-200 rounded p-4">
          <p className="text-sm text-navy-800 whitespace-pre-wrap leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
