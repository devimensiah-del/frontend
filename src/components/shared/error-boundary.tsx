'use client'

import * as React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <div className="p-4 bg-error-light mb-4">
            <AlertTriangle className="h-8 w-8 text-error" />
          </div>
          <h2 className="text-lg font-heading font-medium text-navy-900">
            Algo deu errado
          </h2>
          <p className="mt-2 text-sm text-text-secondary max-w-md">
            Ocorreu um erro inesperado. Por favor, tente novamente ou entre em
            contato com o suporte se o problema persistir.
          </p>
          {this.state.error && (
            <pre className="mt-4 p-4 bg-surface-paper border border-line text-xs text-left overflow-auto max-w-full">
              {this.state.error.message}
            </pre>
          )}
          <Button
            variant="architect"
            size="sm"
            className="mt-6"
            onClick={this.handleRetry}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

// Functional wrapper for use with React Query error boundaries
export function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error
  resetErrorBoundary: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="p-4 bg-error-light mb-4">
        <AlertTriangle className="h-8 w-8 text-error" />
      </div>
      <h2 className="text-lg font-heading font-medium text-navy-900">
        Algo deu errado
      </h2>
      <p className="mt-2 text-sm text-text-secondary max-w-md">
        {error.message || 'Ocorreu um erro inesperado.'}
      </p>
      <Button
        variant="architect"
        size="sm"
        className="mt-6"
        onClick={resetErrorBoundary}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Tentar novamente
      </Button>
    </div>
  )
}
