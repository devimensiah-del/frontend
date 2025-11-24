import React from "react";
import { cn } from "@/lib/utils/cn";
import { ArrowDownRight } from "lucide-react";
import { Heading, Text } from "@/components/ui/Typography";

/* ============================================
   PROCESS STEP COMPONENT
   ============================================ */
interface ProcessStepProps {
  stepNumber: string;
  title: string;
  description: string;
}

export const ProcessStep: React.FC<ProcessStepProps> = ({ stepNumber, title, description }) => {
  return (
    <div className="p-12 hover:bg-surface-paper transition-colors group h-full">
      <div className="flex justify-between items-start mb-8">
        <span className="text-xs font-bold text-gold-500 border border-gold-500 px-2 py-1 rounded-full">
          PASSO {stepNumber}
        </span>
        <ArrowDownRight className="w-5 h-5 text-line group-hover:text-navy-900 transition-colors" />
      </div>
      <Heading as="h3" variant="subtitle" className="mb-4">{title}</Heading>
      <Text variant="small" className="leading-relaxed">
        {description}
      </Text>
    </div>
  );
};

/* ============================================
   METRIC CARD COMPONENT
   ============================================ */
interface MetricCardProps {
  value: string;
  label: string;
  highlight?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({ value, label, highlight = false }) => {
  return (
    <div className="flex-1 p-12 flex flex-col justify-end border-b border-white/10 last:border-0">
      <div className={cn("text-6xl font-light mb-2 font-heading", highlight ? "text-gold-500" : "text-white")}>
        {value}
      </div>
      <div className="text-xs uppercase tracking-[0.2em] text-gray-400">{label}</div>
    </div>
  );
};

/* ============================================
   TESTIMONIAL CARD COMPONENT
   ============================================ */
interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, role, company }) => {
  return (
    <div className="p-8 border border-line hover:bg-surface-paper transition-colors group h-full flex flex-col justify-between">
      <div className="mb-6">
        <p className="text-lg leading-relaxed text-text-primary italic">
          "{quote}"
        </p>
      </div>
      <div className="border-t border-line pt-6">
        <div className="font-medium text-navy-900 mb-1">{author}</div>
        <div className="text-xs uppercase tracking-[0.15em] text-text-secondary mb-1">
          {role}
        </div>
        <div className="text-xs uppercase tracking-[0.15em] text-gold-500">
          {company}
        </div>
      </div>
    </div>
  );
};

/* ============================================
   FOUNDER CARD COMPONENT
   ============================================ */
interface FounderCardProps {
  name: string;
  role: string;
  bio: string;
}

export const FounderCard: React.FC<FounderCardProps> = ({ name, role, bio }) => {
  return (
    <div className="grid lg:grid-cols-12 gap-8 border border-white/10 p-8 hover:bg-white/5 transition-colors">
      <div className="lg:col-span-4">
        <div className="mb-4">
          <Heading as="h3" className="text-lg font-medium text-white mb-2">{name}</Heading>
          <div className="text-xs uppercase tracking-[0.15em] text-gold-500">
            {role}
          </div>
        </div>
      </div>
      <div className="lg:col-span-8">
        <Text variant="light">
          {bio}
        </Text>
      </div>
    </div>
  );
};
