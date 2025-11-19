'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface HeaderProps {
  transparent?: boolean
}

export function Header({ transparent = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b backdrop-blur-md transition-all',
        transparent
          ? 'bg-transparent border-transparent'
          : 'bg-background/95 border-border'
      )}
    >
      <nav className="container-responsive flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/imensiah-logo.png"
            alt="IMENSIAH"
            width={120}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/#sobre"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Sobre
          </Link>
          <Link
            href="/#como-funciona"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Como Funciona
          </Link>
          <Link
            href="/#beneficios"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Benefícios
          </Link>
          <Link
            href="/#faq"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            FAQ
          </Link>

          <div className="flex items-center space-x-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="secondary" size="sm" className="glow-accent">
                Começar Agora
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-foreground hover:text-accent"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container-responsive py-4 space-y-3">
            <Link
              href="/#sobre"
              className="block py-2 text-sm font-medium text-foreground/80 hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link
              href="/#como-funciona"
              className="block py-2 text-sm font-medium text-foreground/80 hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Como Funciona
            </Link>
            <Link
              href="/#beneficios"
              className="block py-2 text-sm font-medium text-foreground/80 hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Benefícios
            </Link>
            <Link
              href="/#faq"
              className="block py-2 text-sm font-medium text-foreground/80 hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>

            <div className="pt-4 space-y-2">
              <Link href="/auth/login" className="block">
                <Button variant="ghost" size="sm" className="w-full">
                  Entrar
                </Button>
              </Link>
              <Link href="/auth/signup" className="block">
                <Button variant="secondary" size="sm" className="w-full glow-accent">
                  Começar Agora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
