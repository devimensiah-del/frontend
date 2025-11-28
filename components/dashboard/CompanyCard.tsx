import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Building2, Globe, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Heading, Text, Eyebrow } from "@/components/ui/Typography";
import { Company } from "@/lib/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/* ============================================
   COMPANY CARD COMPONENT
   Shows a company in the dashboard - click to view details
   ============================================ */

interface CompanyCardProps {
  company: Company;
  isAdmin?: boolean;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  isAdmin = false,
}) => {
  const href = isAdmin ? `/admin/companies/${company.id}` : `/companies/${company.id}`;

  return (
    <Link href={href}>
      <Card className="h-full border border-line hover:shadow-lg transition-all duration-300 hover:border-gold-500/30 relative overflow-hidden bg-white group cursor-pointer">
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
              {format(new Date(company.created_at), "d 'de' MMM, yyyy", { locale: ptBR })}
            </Eyebrow>
          </div>

          <Heading as="h3" variant="title" className="group-hover:text-gold-600 transition-colors mb-3">
            {company.name}
          </Heading>

          {company.legal_name && company.legal_name !== company.name && (
            <Text variant="small" className="text-text-tertiary">
              {company.legal_name}
            </Text>
          )}
        </CardHeader>

        <CardContent className="pb-6 pt-0 relative">
          <div className="space-y-3">
            {company.industry && (
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Building2 className="w-4 h-4 text-text-tertiary" />
                <span className="font-medium">{company.industry}</span>
              </div>
            )}
            {company.location && (
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <MapPin className="w-4 h-4 text-text-tertiary" />
                <span>{company.location}</span>
              </div>
            )}
            {company.website && (
              <div className="flex items-center gap-2 text-sm text-text-secondary truncate">
                <Globe className="w-4 h-4 text-text-tertiary" />
                <span className="truncate">{company.website}</span>
              </div>
            )}
            {company.value_proposition && (
              <div className="mt-4 pt-4 border-t border-line">
                <Text variant="small" className="line-clamp-2 text-text-secondary leading-relaxed">
                  {company.value_proposition}
                </Text>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-4 border-t border-line relative">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 group-hover:gap-3 transition-all">
            Ver Detalhes
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

/* ============================================
   ADMIN COMPANY CARD VARIANT
   Simple card for admin dashboard - click to view details
   ============================================ */

interface AdminCompanyCardProps {
  company: Company;
}

export const AdminCompanyCard: React.FC<AdminCompanyCardProps> = ({
  company,
}) => {
  return (
    <Link href={`/admin/companies/${company.id}`}>
      <Card className="h-full border border-line hover:shadow-lg transition-all duration-300 hover:border-gold-500/30 relative overflow-hidden bg-white group cursor-pointer">
        {/* Gold accent line that grows on hover */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />

        <CardHeader className="pb-4">
          <div className="flex justify-between items-start mb-4">
            <Eyebrow className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              {format(new Date(company.updated_at), "d 'de' MMM, yyyy", { locale: ptBR })}
            </Eyebrow>
          </div>

          <Heading as="h3" variant="title" className="group-hover:text-gold-600 transition-colors mb-2">
            {company.name}
          </Heading>

          {company.cnpj && (
            <Text variant="small" className="text-text-tertiary font-mono">
              CNPJ: {company.cnpj}
            </Text>
          )}
        </CardHeader>

        <CardContent className="pb-4 pt-0">
          <div className="space-y-2 text-sm">
            {company.industry && (
              <div className="flex items-center gap-2 text-text-secondary">
                <Building2 className="w-4 h-4 text-text-tertiary" />
                <span>{company.industry}</span>
              </div>
            )}
            {company.location && (
              <div className="flex items-center gap-2 text-text-secondary">
                <MapPin className="w-4 h-4 text-text-tertiary" />
                <span>{company.location}</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-4 border-t border-line">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 group-hover:gap-3 transition-all">
            Ver Detalhes
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CompanyCard;
