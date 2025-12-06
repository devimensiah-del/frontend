/**
 * WizardStep Component
 *
 * Container for individual wizard step content.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import { Card, CardHeader, CardBody } from "../organisms/Card";

// ============================================
// TYPES
// ============================================

export interface WizardStepProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export const WizardStep: React.FC<WizardStepProps> = ({
  title,
  description,
  children,
  className,
}) => {
  return (
    <Card className={cn("mb-6", className)}>
      <CardHeader>
        <h2 className="text-xl font-heading font-medium text-navy-900 uppercase tracking-wide">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">
            {description}
          </p>
        )}
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
};
