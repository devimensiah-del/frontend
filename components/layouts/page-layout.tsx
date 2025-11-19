import { Header } from './header'
import { Footer } from './footer'

interface PageLayoutProps {
  children: React.ReactNode
  transparentHeader?: boolean
}

export function PageLayout({ children, transparentHeader = false }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header transparent={transparentHeader} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
