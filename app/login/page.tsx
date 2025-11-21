import { Suspense } from "react";
import { Container } from "@/components/ui/Grid";
import { LoginForm } from "@/components/auth/LoginForm";

function LoginFormFallback() {
  return (
    <div className="max-w-md w-full bg-white p-12 border border-line shadow-sm">
      <div className="animate-pulse space-y-6">
        <div className="h-12 w-12 mx-auto bg-gray-200 rounded" />
        <div className="h-8 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Container className="min-h-screen flex items-center justify-center bg-surface-paper">
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </Container>
  );
}
