import { LoginForm } from '@/components/features/auth/login-form'

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-navy-900 mb-2">
            Entrar na Plataforma
          </h1>
          <p className="text-muted-foreground">
            Acesse sua conta para gerenciar suas análises
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
