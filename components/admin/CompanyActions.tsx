"use client";

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCompaniesApi } from "@/lib/api/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/Textarea";
import { Sparkles, BarChart3, Plus, Loader2 } from "lucide-react";

interface CompanyActionsProps {
  companyId: string;
}

export function CompanyActions({ companyId }: CompanyActionsProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showChallengeDialog, setShowChallengeDialog] = React.useState(false);
  const [newChallenge, setNewChallenge] = React.useState("");

  const enrichMutation = useMutation({
    mutationFn: () => adminCompaniesApi.reEnrich(companyId),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Enriquecimento iniciado." });
      queryClient.invalidateQueries({ queryKey: ["adminCompany", companyId] });
    },
    onError: (error: Error) => {
      toast({ title: "Erro", description: error.message || "Falha ao enriquecer.", variant: "destructive" });
    },
  });

  const reAnalyzeMutation = useMutation({
    mutationFn: () => adminCompaniesApi.reAnalyze(companyId),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Análise iniciada com o último desafio." });
      queryClient.invalidateQueries({ queryKey: ["adminCompany", companyId] });
    },
    onError: (error: Error) => {
      toast({ title: "Erro", description: error.message || "Falha ao iniciar análise.", variant: "destructive" });
    },
  });

  const analyzeNewChallengeMutation = useMutation({
    mutationFn: (challenge: string) => adminCompaniesApi.analyzeWithNewChallenge(companyId, challenge),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Análise iniciada para o novo desafio." });
      queryClient.invalidateQueries({ queryKey: ["adminCompany", companyId] });
      setShowChallengeDialog(false);
      setNewChallenge("");
    },
    onError: (error: Error) => {
      toast({ title: "Erro", description: error.message || "Falha ao iniciar análise.", variant: "destructive" });
    },
  });

  const handleAnalyzeSubmit = () => {
    if (!newChallenge.trim()) {
      toast({ title: "Erro", description: "Por favor, insira um desafio de negócio.", variant: "destructive" });
      return;
    }
    analyzeNewChallengeMutation.mutate(newChallenge.trim());
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() => enrichMutation.mutate()}
          disabled={enrichMutation.isPending}
          className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
        >
          <Sparkles className={`w-4 h-4 mr-2 ${enrichMutation.isPending ? "animate-pulse" : ""}`} />
          Enriquecer
        </Button>

        <Button
          variant="outline"
          onClick={() => reAnalyzeMutation.mutate()}
          disabled={reAnalyzeMutation.isPending || analyzeNewChallengeMutation.isPending}
          className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
        >
          <BarChart3 className={`w-4 h-4 mr-2 ${reAnalyzeMutation.isPending ? "animate-pulse" : ""}`} />
          Analisar
        </Button>

        <Button
          variant="outline"
          onClick={() => setShowChallengeDialog(true)}
          disabled={reAnalyzeMutation.isPending || analyzeNewChallengeMutation.isPending}
          className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
        >
          <Plus className={`w-4 h-4 mr-2 ${analyzeNewChallengeMutation.isPending ? "animate-pulse" : ""}`} />
          Novo Desafio
        </Button>
      </div>

      <Dialog open={showChallengeDialog} onOpenChange={setShowChallengeDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Nova Análise Estratégica</DialogTitle>
            <DialogDescription className="text-gray-400">
              Descreva o desafio de negócio que será analisado. A análise será baseada nos dados enriquecidos da empresa.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Ex: Como expandir para o mercado internacional mantendo a qualidade do atendimento ao cliente?"
              value={newChallenge}
              onChange={(e) => setNewChallenge(e.target.value)}
              className="min-h-[120px] bg-gray-800 border-gray-700 text-white"
            />
            <p className="text-xs text-gray-500 mt-2">
              Seja específico sobre o desafio. Isso ajuda a IA a focar a análise nos pontos mais relevantes.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChallengeDialog(false)} className="bg-gray-800 border-gray-700 text-white">
              Cancelar
            </Button>
            <Button
              onClick={handleAnalyzeSubmit}
              disabled={analyzeNewChallengeMutation.isPending || !newChallenge.trim()}
              className="bg-gold-600 hover:bg-gold-700 text-white"
            >
              {analyzeNewChallengeMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Iniciando...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Iniciar Análise
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
