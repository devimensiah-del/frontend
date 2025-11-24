import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Building2, Globe } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/Typography";
import { StatusBadge } from "./StatusBadge";
import { Submission } from "@/lib/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/* ============================================
   SUBMISSION CARD COMPONENT
   ============================================ */

interface SubmissionCardProps {
  submission: Submission;
  isAdmin?: boolean;
}

export const SubmissionCard: React.FC<SubmissionCardProps> = ({ submission, isAdmin = false }) => {
  const enrichmentStatus = (submission as any).enrichmentStatus || (submission as any).enrichment_status;
  const analysisStatus = (submission as any).analysisStatus || (submission as any).analysis_status;

  return (
    <Link href={`/submissions/${submission.id}`} className="block group">
      <Card className="h-full hover:shadow-md transition-all duration-300 border-l-4 border-l-transparent hover:border-l-gold-500">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2 text-xs text-text-tertiary uppercase tracking-wider">
              <Calendar className="w-3 h-3" />
              {format(new Date(submission.createdAt), "d 'de' MMMM, yyyy", { locale: ptBR })}
            </div>
            <StatusBadge status={submission.status} />
          </div>
          <Heading as="h3" className="text-xl group-hover:text-gold-600 transition-colors">
            {submission.companyName}
          </Heading>
          <div className="mt-2 flex flex-wrap gap-2">
            {enrichmentStatus && <StatusBadge status={enrichmentStatus} type="enrichment" />}
            {analysisStatus && <StatusBadge status={analysisStatus} type="analysis" />}
          </div>
        </CardHeader>
        
        <CardContent className="pb-4 pt-0">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span>{submission.industry || "Indústria não informada"}</span>
            </div>
            {submission.website && (
              <div className="flex items-center gap-2 text-sm text-text-secondary truncate">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="truncate">{submission.website}</span>
              </div>
            )}
            <Text variant="small" className="line-clamp-2 mt-4 text-gray-500">
              {submission.businessChallenge}
            </Text>
          </div>
        </CardContent>

        <CardFooter className="pt-0 border-t-0">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-500 group-hover:translate-x-1 transition-transform">
            Ver Detalhes
            <ArrowRight className="w-3 h-3" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
