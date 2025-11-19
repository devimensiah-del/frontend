'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/auth/supabase';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Mail, ChevronRight, Eye, EyeOff, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export default function ChangeEmailPage() {
  useRequireAuth();

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    async function loadCurrentEmail() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setCurrentEmail(user.email);
      }
    }
    loadCurrentEmail();
  }, []);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!newEmail || !confirmEmail) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (!isValidEmail(newEmail)) {
      toast.error('Por favor, insira um endereço de e-mail válido');
      return;
    }

    if (newEmail !== confirmEmail) {
      toast.error('Os endereços de e-mail não correspondem');
      return;
    }

    if (newEmail === currentEmail) {
      toast.error('O novo e-mail deve ser diferente do e-mail atual');
      return;
    }

    if (!password) {
      toast.error('Por favor, insira sua senha para verificação de segurança');
      return;
    }

    setLoading(true);

    try {
      // Get JWT token from Supabase session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        toast.error('Sessão expirada. Por favor, faça login novamente.');
        router.push('/auth/login');
        return;
      }

      // Call backend API to change email
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/change-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          new_email: newEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific errors
        if (response.status === 409) {
          toast.error('Este endereço de e-mail já está em uso');
        } else if (response.status === 400) {
          toast.error(data.error || 'Formato de e-mail inválido');
        } else if (response.status === 401) {
          toast.error('Não autorizado. Por favor, faça login novamente.');
          router.push('/auth/login');
        } else {
          toast.error(data.error || 'Falha ao atualizar o e-mail');
        }
        return;
      }

      // Show success message with instructions
      toast.success('E-mail de verificação enviado!', {
        description: `Por favor, verifique ${newEmail} e clique no link de verificação para concluir a alteração.`,
        duration: 8000,
      });

      // Clear form
      setNewEmail('');
      setConfirmEmail('');
      setPassword('');

      // Redirect after a delay
      setTimeout(() => {
        router.push('/account/settings');
      }, 2000);

    } catch (error: any) {
      console.error('Error updating email:', error);
      toast.error('Erro ao atualizar e-mail. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-12 px-4">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/account/settings" className="hover:text-foreground">
          Account Settings
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Change Email</span>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle>Change Email Address</CardTitle>
              <CardDescription>
                Update your email address for account access and notifications
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Email (Read-only) */}
            <div className="space-y-2">
              <Label>Current Email Address</Label>
              <Input
                type="email"
                value={currentEmail}
                disabled
                className="bg-muted"
              />
            </div>

            {/* New Email */}
            <div className="space-y-2">
              <Label htmlFor="newEmail">New Email Address</Label>
              <Input
                id="newEmail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter your new email address"
                disabled={loading}
                required
              />
              {newEmail && !isValidEmail(newEmail) && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  Please enter a valid email address
                </p>
              )}
              {newEmail && isValidEmail(newEmail) && (
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Valid email format
                </p>
              )}
            </div>

            {/* Confirm Email */}
            <div className="space-y-2">
              <Label htmlFor="confirmEmail">Confirm New Email Address</Label>
              <Input
                id="confirmEmail"
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder="Confirm your new email address"
                disabled={loading}
                required
              />
              {confirmEmail && newEmail !== confirmEmail && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  Email addresses do not match
                </p>
              )}
              {confirmEmail && newEmail === confirmEmail && isValidEmail(confirmEmail) && (
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Email addresses match
                </p>
              )}
            </div>

            {/* Password Verification */}
            <div className="space-y-2">
              <Label htmlFor="password">Current Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password to confirm"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Required for security verification
              </p>
            </div>

            {/* Important Notice */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> A verification email will be sent to your new email address.
                You must click the verification link before the change takes effect.
                Your current email will remain active until verification is complete.
              </AlertDescription>
            </Alert>

            {/* Information Alert */}
            <Alert>
              <AlertDescription>
                After verification, you will use your new email address to sign in.
                All notifications will be sent to the new email address.
              </AlertDescription>
            </Alert>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading || !isValidEmail(newEmail) || newEmail !== confirmEmail || !password}
                className="flex-1"
              >
                {loading ? 'Sending Verification...' : 'Send Verification Email'}
              </Button>
              <Link href="/account/settings">
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </Link>
            </div>

            {/* Help Text */}
            <div className="text-sm text-muted-foreground pt-4 border-t">
              <p className="font-medium mb-2">What happens next?</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>You will receive a verification email at {newEmail || 'your new email'}</li>
                <li>Click the verification link in that email</li>
                <li>Your email address will be updated automatically</li>
                <li>Use your new email to sign in on your next login</li>
              </ol>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
