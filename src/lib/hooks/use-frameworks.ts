'use client'

import { useQuery } from '@tanstack/react-query'
import { frameworkService } from '@/lib/services'

export function useFrameworks() {
  return useQuery({
    queryKey: ['frameworks'],
    queryFn: frameworkService.list,
    staleTime: 30 * 60 * 1000, // 30 minutes (frameworks rarely change)
  })
}

export function useFramework(code: string) {
  return useQuery({
    queryKey: ['framework', code],
    queryFn: () => frameworkService.getByCode(code),
    enabled: !!code,
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

export function useFrameworkOrder() {
  return useQuery({
    queryKey: ['frameworks', 'order'],
    queryFn: frameworkService.getOrder,
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}
