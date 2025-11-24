import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Building2, Globe } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Heading, Text, Eyebrow } from "@/components/ui/Typography";
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

export const SubmissionCard: React.FC<SubmissionCardProps> = ({ submission, isAdmin: _isAdmin = false }) => {
  const enrichmentStatus = (submission as any).enrichmentStatus || (submission as any).enrichment_status;
  const analysisStatus = (submission as any).analysisStatus || (submission as any).analysis_status;

  return (
    <Link href={`/submissions/${submission.id}`} className="block group h-full">
      <Card className="h-full border border-line hover:shadow-lg transition-all duration-300 hover:border-gold-500/30 relative overflow-hidden bg-white">
        {/* Subtle background decoration */}
        <div
          className="absolute inset-0 opacity-[0.01] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Gold accent line that grows on hover */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />

        <CardHeader className="pb-4 relative">
          <div className="flex justify-between items-start mb-4">
            <Eyebrow className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              {format(new Date(submission.createdAt), "d 'de' MMM", { locale: ptBR })}
            </Eyebrow>
            <StatusBadge status={submission.status} />
          </div>

          <Heading as="h3" variant="title" className="group-hover:text-gold-600 transition-colors mb-3">
            {submission.companyName}
          </Heading>

          {(enrichmentStatus || analysisStatus) && (
            <div className="flex flex-wrap gap-2">
              {enrichmentStatus && <StatusBadge status={enrichmentStatus} type="enrichment" />}
              {analysisStatus && <StatusBadge status={analysisStatus} type="analysis" />}
            </div>
          )}
        </CardHeader>

        <CardContent className="pb-6 pt-0 relative">
          <div className="space-y-3">
            {submission.industry && (
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Building2 className="w-4 h-4 text-text-tertiary" />
                <span className="font-medium">{submission.industry}</span>
              </div>
            )}
            {submission.website && (
              <div className="flex items-center gap-2 text-sm text-text-secondary truncate">
                <Globe className="w-4 h-4 text-text-tertiary" />
                <span className="truncate">{submission.website}</span>
              </div>
            )}
            {submission.businessChallenge && (
              <div className="mt-4 pt-4 border-t border-line">
                <Text variant="small" className="line-clamp-3 text-text-secondary leading-relaxed">
                  {submission.businessChallenge}
                </Text>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-0 border-t-0 relative">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 group-hover:gap-3 transition-all">
            Ver Detalhes
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
