import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

// Manrope: Modern, geometric but human. Feels like a high-end magazine or architect's portfolio.
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["300", "400", "500", "600"], // Lighter weights feel more expensive
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "IMENSIAH | Estratégia Privada",
  description: "Consultoria de alto nível amplificada por inteligência artificial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${manrope.variable} ${inter.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <Providers>
            <LoadingIndicator />
            {children}
            <Toaster />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}