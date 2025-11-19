'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, Mail, FileText, Clock } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/payment/verify?session_id=${sessionId}`);
      if (!response.ok) throw new Error('Erro ao verificar pagamento');

      const data = await response.json();
      setOrderDetails(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <Loader2 className="w-8 h-8 animate-spin text-[hsl(195_100%_8%)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-gray-50 to-white p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Success Card */}
        <Card className="shadow-2xl border-2 border-green-200">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold text-green-900">
              Pagamento Confirmado!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-lg text-gray-700">
              Seu pagamento foi processado com sucesso. Nossa equipe já começou a trabalhar no seu
              relatório estratégico.
            </p>

            {/* Order Summary */}
            {orderDetails && (
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <h3 className="font-semibold text-gray-900 mb-4">Resumo do Pedido</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-600">Empresa:</div>
                  <div className="font-semibold text-right">{orderDetails.company_name}</div>

                  <div className="text-gray-600">Email:</div>
                  <div className="font-semibold text-right">{orderDetails.email}</div>

                  <div className="text-gray-600">Valor Pago:</div>
                  <div className="font-semibold text-right text-green-600">
                    R$ {orderDetails.amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>

                  <div className="text-gray-600">ID do Pedido:</div>
                  <div className="font-mono text-xs text-right">{orderDetails.submission_id}</div>
                </div>
              </div>
            )}

            {/* What Happens Next */}
            <div className="bg-[hsl(195_100%_8%)]/10 border border-[hsl(195_100%_8%)]/20 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-[hsl(195_100%_8%)] flex items-center gap-2">
                <Clock className="w-5 h-5" />
                O Que Acontece Agora?
              </h3>
              <ol className="space-y-3 text-sm text-[hsl(195_100%_8%)]/80">
                <li className="flex gap-3">
                  <span className="font-bold">1.</span>
                  <span>
                    <strong>Processamento Imediato:</strong> Nossa IA já está coletando dados de 15+ fontes públicas
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold">2.</span>
                  <span>
                    <strong>Análise Humana:</strong> Um analista experiente revisará e enriquecerá os dados
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold">3.</span>
                  <span>
                    <strong>Entrega em 24h:</strong> Você receberá um email quando o relatório estiver pronto
                  </span>
                </li>
              </ol>
            </div>

            {/* Email Confirmation */}
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <Mail className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <strong>Confirmação Enviada:</strong> Enviamos um email de confirmação para{' '}
                <span className="font-semibold">{orderDetails?.email || 'seu email'}</span>.
                Verifique sua caixa de entrada (e spam).
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <Button
                size="lg"
                className="w-full"
                onClick={() => router.push('/auth/signup')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Criar Conta para Acompanhar
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={() => router.push('/')}
              >
                Voltar para Página Inicial
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Create Account CTA */}
        <Card className="shadow-xl bg-gradient-to-r from-blue-600 to-[hsl(195_100%_8%)]/90 text-white">
          <CardContent className="pt-6 pb-6 text-center space-y-4">
            <h3 className="text-xl font-bold">Por Que Criar uma Conta?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-3xl mb-2">📊</div>
                <div className="font-semibold">Dashboard Completo</div>
                <div className="text-white/80">Acompanhe o status em tempo real</div>
              </div>
              <div>
                <div className="text-3xl mb-2">🔗</div>
                <div className="font-semibold">Compartilhamento</div>
                <div className="text-white/80">Compartilhe com sua equipe</div>
              </div>
              <div>
                <div className="text-3xl mb-2">📈</div>
                <div className="font-semibold">Histórico</div>
                <div className="text-white/80">Acesse relatórios anteriores</div>
              </div>
            </div>
            <Button
              size="lg"
              className="bg-white text-[hsl(195_100%_8%)] hover:bg-[hsl(195_100%_8%)]/10 mt-4"
              onClick={() => router.push('/auth/signup')}
            >
              Criar Conta Grátis
            </Button>
          </CardContent>
        </Card>

        {/* Support */}
        <div className="text-center text-sm text-gray-600">
          <p>Precisa de ajuda?</p>
          <p className="mt-2">
            <a href="mailto:suporte@imensiah.com" className="text-[hsl(195_100%_8%)] hover:underline font-semibold">
              suporte@imensiah.com
            </a>
            {' ou acesse nossa '}
            <Link href="/faq" className="text-[hsl(195_100%_8%)] hover:underline font-semibold">
              Central de Ajuda
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
