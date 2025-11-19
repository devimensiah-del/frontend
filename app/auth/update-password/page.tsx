'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Lock, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/auth/supabase';

interface PasswordStrength {
  score: number;
  message: string;
  color: string;
}

export default function UpdatePasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    message: '',
    color: 'text-gray-400',
  });

  // Check for recovery token on mount
  useEffect(() => {
    const checkRecoveryToken = async () => {
      try {
        // Get hash parameters from URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const type = hashParams.get('type');

        if (type === 'recovery' && accessToken) {
          // Valid recovery link
          setIsValidToken(true);
          toast({
            title: 'Link válido',
            description: 'Você pode criar uma nova senha',
          });
        } else {
          // No valid token
          setIsValidToken(false);
          toast({
            variant: 'destructive',
            title: 'Link inválido ou expirado',
            description: 'Solicite um novo link de recuperação',
          });
        }
      } catch (error) {
        console.error('Error checking recovery token:', error);
        setIsValidToken(false);
      } finally {
        setIsCheckingToken(false);
      }
    };

    checkRecoveryToken();
  }, [toast]);

  // Calculate password strength
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength({ score: 0, message: '', color: 'text-gray-400' });
      return;
    }

    let score = 0;
    let message = '';
    let color = 'text-red-500';

    // Length check
    if (newPassword.length >= 8) score++;
    if (newPassword.length >= 12) score++;

    // Character variety checks
    if (/[a-z]/.test(newPassword)) score++; // lowercase
    if (/[A-Z]/.test(newPassword)) score++; // uppercase
    if (/[0-9]/.test(newPassword)) score++; // numbers
    if (/[^a-zA-Z0-9]/.test(newPassword)) score++; // special chars

    // Determine strength message
    if (score <= 2) {
      message = 'Senha fraca';
      color = 'text-red-500';
    } else if (score <= 4) {
      message = 'Senha média';
      color = 'text-yellow-500';
    } else {
      message = 'Senha forte';
      color = 'text-green-500';
    }

    setPasswordStrength({ score, message, color });
  }, [newPassword]);

  // Validation checks
  const isPasswordValid = newPassword.length >= 8 &&
    /[a-z]/.test(newPassword) &&
    /[A-Z]/.test(newPassword) &&
    /[0-9]/.test(newPassword);

  const doPasswordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const isFormValid = isPasswordValid && doPasswordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      toast({
        variant: 'destructive',
        title: 'Senha inválida',
        description: 'Verifique os requisitos da senha',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Update password with Supabase
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw new Error(error.message);
      }

      // Success!
      toast({
        title: 'Senha atualizada!',
        description: 'Redirecionando para o dashboard...',
      });

      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Password update error:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar senha',
        description: error instanceof Error ? error.message : 'Tente novamente',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while checking token
  if (isCheckingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verificando link de recuperação...</p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Link Inválido</CardTitle>
              <CardDescription>
                Este link de recuperação é inválido ou expirou
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Links de recuperação expiram após 1 hora por segurança.
                Solicite um novo link de recuperação.
              </p>
              <Link href="/auth/reset-password" className="block">
                <Button className="w-full">
                  Solicitar Novo Link
                </Button>
              </Link>
              <Link href="/auth/login" className="block">
                <Button variant="outline" className="w-full">
                  Voltar para Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Valid token - show password update form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">IMENSIAH</h1>
          <p className="text-gray-600">Relatórios Estratégicos Inteligentes</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Nova Senha</CardTitle>
            <CardDescription>
              Crie uma senha forte para proteger sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password Field */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Password strength indicator */}
                {newPassword && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            passwordStrength.score <= 2
                              ? 'bg-red-500'
                              : passwordStrength.score <= 4
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${passwordStrength.color}`}>
                        {passwordStrength.message}
                      </span>
                    </div>
                  </div>
                )}
                {/* Password requirements */}
                <div className="text-xs space-y-1 text-gray-600">
                  <p className="font-semibold">Requisitos:</p>
                  <div className="space-y-0.5 ml-2">
                    <div className="flex items-center gap-1">
                      {newPassword.length >= 8 ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-gray-400" />
                      )}
                      <span>Mínimo 8 caracteres</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {/[A-Z]/.test(newPassword) ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-gray-400" />
                      )}
                      <span>Uma letra maiúscula</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {/[a-z]/.test(newPassword) ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-gray-400" />
                      )}
                      <span>Uma letra minúscula</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {/[0-9]/.test(newPassword) ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-gray-400" />
                      )}
                      <span>Um número</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Password match indicator */}
                {confirmPassword && (
                  <div className="flex items-center gap-1 text-xs">
                    {doPasswordsMatch ? (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-green-600">As senhas coincidem</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 text-red-500" />
                        <span className="text-red-600">As senhas não coincidem</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  'Atualizar Senha'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Additional info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Precisa de ajuda?</p>
          <a href="mailto:suporte@imensiah.com" className="text-blue-600 hover:underline">
            suporte@imensiah.com
          </a>
        </div>
      </div>
    </div>
  );
}
