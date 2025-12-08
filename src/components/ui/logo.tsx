'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  variant?: 'default' | 'white'
  alt?: string
}

export function Logo({
  className,
  variant = 'default',
  alt = 'IMENSIAH',
}: LogoProps) {
  const logoSrc = variant === 'white'
    ? '/imensiah_logo_white.svg'
    : '/imensiah_logo.svg'

  return (
    <div className={cn('relative inline-block w-full h-full', className)}>
      <Image
        src={logoSrc}
        alt={alt}
        fill
        className="object-contain"
        priority
      />
    </div>
  )
}
