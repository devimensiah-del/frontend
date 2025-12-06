"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { macroApi, MACRO_CATEGORIES, type MacroIndicator } from "@/lib/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/state-components";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw, TrendingUp, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AdminMacroeconomiaPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [refreshingIndicator, setRefreshingIndicator] = React.useState<string | null>(null);

  // Fetch latest snapshot
  const { data: snapshotData, isLoading } = useQuery({
    queryKey: ["macroSnapshot"],
    queryFn: macroApi.getLatestSnapshot,
  });

  // Refresh all indicators
  const refreshAllMutation = useMutation({
    mutationFn: macroApi.refreshAll,
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Todos os indicadores foram atualizados." });
      queryClient.invalidateQueries({ queryKey: ["macroSnapshot"] });
    },
    onError: (error: Error) => {
      toast({ title: "Erro", description: error.message || "Falha ao atualizar indicadores.", variant: "destructive" });
    },
  });

  // Refresh single indicator
  const handleRefreshIndicator = async (code: string) => {
    setRefreshingIndicator(code);
    try {
      await macroApi.refreshIndicator(code);
      toast({ title: "Sucesso", description: `Indicador ${code} atualizado.` });
      queryClient.invalidateQueries({ queryKey: ["macroSnapshot"] });
    } catch (error: any) {
      toast({ title: "Erro", description: error.message || "Falha ao atualizar indicador.", variant: "destructive" });
    } finally {
      setRefreshingIndicator(null);
    }
  };

  if (isLoading) {
    return <LoadingState message="Carregando indicadores..." size="lg" />;
  }

  const snapshot = snapshotData?.snapshot;
  const indicators = snapshot?.indicators || {};

  // Group indicators by category
  const indicatorsByCategory = Object.entries(indicators).reduce((acc, [indicatorCode, indicator]) => {
    const category = indicator.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ ...indicator, code: indicatorCode });
    return acc;
  }, {} as Record<string, Array<MacroIndicator & { code: string }>>);

  // Sort categories by order
  const sortedCategories = Object.entries(MACRO_CATEGORIES)
    .sort((a, b) => a[1].order - b[1].order)
    .filter(([key]) => indicatorsByCategory[key]?.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Indicadores Macroeconômicos</h1>
          {snapshot && (
            <p className="text-gray-400">
              Última atualização: {format(new Date(snapshot.as_of), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          )}
        </div>
        <Button
          onClick={() => refreshAllMutation.mutate()}
          disabled={refreshAllMutation.isPending}
          className="bg-gold-600 hover:bg-gold-700 text-white"
        >
          {refreshAllMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Atualizando...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar Todos
            </>
          )}
        </Button>
      </div>

      <div className="space-y-8">
        {sortedCategories.map(([categoryKey, categoryInfo]) => (
          <div key={categoryKey}>
            <h2 className="text-xl font-semibold text-white mb-4">{categoryInfo.label}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {indicatorsByCategory[categoryKey].map((indicator) => (
                <Card key={`${categoryKey}-${indicator.code}`} className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white text-base mb-1">{indicator.name}</CardTitle>
                        <Badge variant="outline" className="text-xs bg-gray-800 border-gray-700 text-gray-400">
                          {indicator.code}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRefreshIndicator(indicator.code)}
                        disabled={refreshingIndicator === indicator.code}
                        className="text-gray-400 hover:text-white"
                      >
                        <RefreshCw
                          className={`w-4 h-4 ${refreshingIndicator === indicator.code ? "animate-spin" : ""}`}
                        />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-3xl font-bold text-white">
                        {indicator.value}
                        <span className="text-lg text-gray-400 ml-1">{indicator.unit}</span>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Data Efetiva:</span>
                        <span className="text-white">
                          {format(new Date(indicator.effective_date), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      </div>
                      {indicator.reference_period && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Período:</span>
                          <span className="text-white">{indicator.reference_period}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Fonte:</span>
                        <span className="text-white">{indicator.source_code}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {sortedCategories.length === 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="py-12 text-center">
            <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <div className="text-white font-medium mb-2">Nenhum indicador disponível</div>
            <p className="text-gray-400 text-sm mb-4">
              Clique em "Atualizar Todos" para buscar os indicadores mais recentes.
            </p>
            <Button
              onClick={() => refreshAllMutation.mutate()}
              disabled={refreshAllMutation.isPending}
              className="bg-gold-600 hover:bg-gold-700 text-white"
            >
              {refreshAllMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Buscar Indicadores
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
