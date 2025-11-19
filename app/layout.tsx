import type { Metadata } from 'next'
import { Inter, Work_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { TestModeBanner } from '@/components/dev/test-mode-banner'
import { Header } from '@/components/layouts/header'
import { ErrorBoundary } from '@/components/error-boundary'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'IMENSIAH - Relatório Estratégico Completo em 24h',
  description: 'Instituto de Mérito e Notoriedade em Saúde, Inovação e Artes Humanitárias. Análise completa da sua empresa com IA em até 24 horas por apenas R$ 890.',
  keywords: ['análise empresarial', 'relatório estratégico', 'inteligência artificial', 'consultoria', 'IMENSIAH'],
  authors: [{ name: 'IMENSIAH' }],
  creator: 'IMENSIAH',
  publisher: 'IMENSIAH',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://imensiah.com.br',
    title: 'IMENSIAH - Relatório Estratégico Completo em 24h',
    description: 'Análise completa da sua empresa com IA em até 24 horas por apenas R$ 890.',
    siteName: 'IMENSIAH',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IMENSIAH - Relatório Estratégico Completo em 24h',
    description: 'Análise completa da sua empresa com IA em até 24 horas por apenas R$ 890.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${workSans.variable} font-sans antialiased min-h-screen`}>
        <ErrorBoundary>
          <Providers>
            <Header transparent />
            <TestModeBanner />
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}
