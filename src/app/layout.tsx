import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { QueryProvider, AuthProvider } from '@/lib/providers'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: {
    default: 'IMENSIAH | Inteligência Estratégica',
    template: '%s | IMENSIAH',
  },
  description: 'Transforme dados em decisões estratégicas em 48 horas. IA + Inteligência Humana.',
  openGraph: {
    title: 'IMENSIAH',
    description: 'Inteligência Estratégica Empresarial',
    url: 'https://imensiah.com',
    siteName: 'IMENSIAH',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-body`}>
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
        <Toaster
          position="top-right"
          richColors
          closeButton
        />
      </body>
    </html>
  )
}
