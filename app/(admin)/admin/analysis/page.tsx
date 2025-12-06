"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/state-components";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminAnalysisListPage() {
  const router = useRouter();

  // For now, redirect to submissions - analysis is managed per company
  React.useEffect(() => {
    router.push("/admin/companies");
  }, [router]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Análises</h1>
        <p className="text-gray-400">
          As análises são gerenciadas por empresa
        </p>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="py-12 text-center">
          <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <div className="text-white font-medium mb-2">Redirecionando...</div>
          <p className="text-gray-400 text-sm mb-4">
            As análises são gerenciadas na página de cada empresa.
          </p>
          <Button
            onClick={() => router.push("/admin/companies")}
            className="bg-gold-600 hover:bg-gold-700 text-white"
          >
            Ir para Empresas
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
