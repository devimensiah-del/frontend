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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  Trash2,
  ChevronRight,
  Eye,
  EyeOff,
  AlertTriangle,
  XCircle,
  ShieldAlert
} from 'lucide-react';

export default function DeleteAccountPage() {
  useRequireAuth();

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [userEmail, setUserEmail] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [password, setPassword] = useState('');
  const [confirmations, setConfirmations] = useState({
    dataLoss: false,
    noRecovery: false,
    finalDecision: false,
  });

  useEffect(() => {
    async function loadUserEmail() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    }
    loadUserEmail();
  }, []);

  const allConfirmationsChecked = Object.values(confirmations).every(v => v === true);
  const isDeleteConfirmed = confirmText === 'DELETE' && password.length > 0 && allConfirmationsChecked;

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isDeleteConfirmed) {
      toast.error('Por favor, complete todas as etapas de confirmação');
      return;
    }

    // Final confirmation dialog
    const finalConfirm = window.confirm(
      '⚠️ AVISO FINAL ⚠️\n\n' +
      'Isso excluirá permanentemente sua conta e TODOS os dados.\n\n' +
      'Esta ação NÃO PODE ser desfeita.\n\n' +
      'Clique em OK para prosseguir com a exclusão da conta.'
    );

    if (!finalConfirm) {
      return;
    }

    setLoading(true);

    try {
      // Get JWT token from Supabase session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        toast.error('Sessão expirada. Por favor, faça login novamente.');
        router.push('/auth/login');
        setLoading(false);
        return;
      }

      // Call backend API to delete account
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          reason: 'User requested account deletion',
          confirmation: 'DELETE',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific errors
        if (response.status === 400) {
          toast.error(data.error || 'Confirmação inválida. Deve ser "DELETE"');
        } else if (response.status === 401) {
          toast.error('Não autorizado. Por favor, faça login novamente.');
          router.push('/auth/login');
        } else {
          toast.error(data.error || 'Falha ao excluir a conta. Por favor, tente novamente.');
        }
        setLoading(false);
        return;
      }

      // Sign out the user
      await supabase.auth.signOut();

      // Show success message
      toast.success('Conta excluída com sucesso', {
        description: 'Sua conta e todos os dados associados foram permanentemente excluídos.',
        duration: 5000,
      });

      // Redirect to homepage
      setTimeout(() => {
        router.push('/');
      }, 2000);

    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast.error('Erro ao excluir conta. Por favor, tente novamente ou entre em contato com o suporte.');
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
        <span className="text-foreground">Delete Account</span>
      </div>

      {/* Warning Alert */}
      <Alert variant="destructive" className="mb-6">
        <ShieldAlert className="h-5 w-5" />
        <AlertTitle className="text-lg font-bold">Danger Zone</AlertTitle>
        <AlertDescription className="text-base">
          You are about to permanently delete your account. This action cannot be undone.
        </AlertDescription>
      </Alert>

      {/* Main Card */}
      <Card className="border-destructive">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <Trash2 className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-destructive">Delete Account</CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDeleteAccount} className="space-y-6">
            {/* Consequences Section */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                What will be deleted
              </h3>
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-destructive mt-0.5" />
                  <p className="text-sm">All your form submissions and responses</p>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-destructive mt-0.5" />
                  <p className="text-sm">All generated reports and analytics</p>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-destructive mt-0.5" />
                  <p className="text-sm">All saved templates and configurations</p>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-destructive mt-0.5" />
                  <p className="text-sm">Your account profile and settings</p>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-destructive mt-0.5" />
                  <p className="text-sm">All associated files and documents</p>
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Note:</strong> Billing history will be retained for legal and accounting purposes,
                  but will be anonymized after 90 days.
                </AlertDescription>
              </Alert>
            </div>

            {/* Confirmation Checkboxes */}
            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-semibold">Confirmations Required</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="dataLoss"
                    checked={confirmations.dataLoss}
                    onCheckedChange={(checked) =>
                      setConfirmations(prev => ({ ...prev, dataLoss: checked as boolean }))
                    }
                    disabled={loading}
                  />
                  <label htmlFor="dataLoss" className="text-sm leading-tight cursor-pointer">
                    I understand that all my data will be permanently deleted and cannot be recovered
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="noRecovery"
                    checked={confirmations.noRecovery}
                    onCheckedChange={(checked) =>
                      setConfirmations(prev => ({ ...prev, noRecovery: checked as boolean }))
                    }
                    disabled={loading}
                  />
                  <label htmlFor="noRecovery" className="text-sm leading-tight cursor-pointer">
                    I understand that this action is irreversible and my account cannot be restored
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="finalDecision"
                    checked={confirmations.finalDecision}
                    onCheckedChange={(checked) =>
                      setConfirmations(prev => ({ ...prev, finalDecision: checked as boolean }))
                    }
                    disabled={loading}
                  />
                  <label htmlFor="finalDecision" className="text-sm leading-tight cursor-pointer">
                    I have read and understood all consequences and wish to proceed with account deletion
                  </label>
                </div>
              </div>
            </div>

            {/* Type DELETE to Confirm */}
            <div className="space-y-2 pt-4 border-t">
              <Label htmlFor="confirmText">
                Type <span className="font-mono font-bold text-destructive">DELETE</span> to confirm
              </Label>
              <Input
                id="confirmText"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                placeholder="Type DELETE in capital letters"
                disabled={loading || !allConfirmationsChecked}
                className="font-mono"
                required
              />
              {confirmText && confirmText !== 'DELETE' && (
                <p className="text-sm text-destructive">
                  Please type DELETE exactly as shown
                </p>
              )}
            </div>

            {/* Password Verification */}
            <div className="space-y-2">
              <Label htmlFor="password">Enter Your Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password to confirm deletion"
                  disabled={loading || !allConfirmationsChecked}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Required for final security verification
              </p>
            </div>

            {/* Final Warning */}
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>This is your last chance!</strong> Once you click "Delete My Account",
                there is no going back. All your data will be permanently destroyed.
              </AlertDescription>
            </Alert>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="destructive"
                disabled={loading || !isDeleteConfirmed}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Deleting Account...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete My Account Forever
                  </>
                )}
              </Button>
              <Link href="/account/settings">
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </Link>
            </div>

            {/* Help Text */}
            <div className="text-sm text-muted-foreground pt-4 border-t">
              <p className="font-medium mb-2">Need help instead of deletion?</p>
              <p>
                If you are experiencing issues or have concerns, please{' '}
                <Link href="/support" className="text-primary hover:underline">
                  contact our support team
                </Link>
                {' '}before deleting your account. We may be able to help resolve your issues.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
