'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-line">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/images/landing/logo.png"
              alt="IMENSIAH"
              className="h-8 w-auto"
            />
          </Link>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild size="sm">
              <a href="#diagnostico">Diagnóstico Grátis</a>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}
