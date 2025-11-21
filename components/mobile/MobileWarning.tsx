/**
 * Mobile Warning Component
 * Shows informational message recommending desktop use for complex pages
 */

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/Typography";

interface MobileWarningProps {
  title?: string;
  message?: string;
  showContinueButton?: boolean;
  onContinue?: () => void;
}

export function MobileWarning({
  title = "Experiência Otimizada para Desktop",
  message = "Esta página possui funcionalidades complexas que funcionam melhor em telas maiores. Para a melhor experiência, recomendamos usar um computador ou tablet.",
  showContinueButton = true,
  onContinue,
}: MobileWarningProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-secondary">
      <Card className="max-w-md w-full p-8 text-center border-2 border-gold-500/20">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold-50 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gold-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Title */}
        <Heading as="h2" className="text-xl font-heading font-semibold text-navy-900 mb-4">
          {title}
        </Heading>

        {/* Message */}
        <Text className="text-text-secondary mb-6 leading-relaxed">
          {message}
        </Text>

        {/* Recommendations */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <Text variant="small" className="text-blue-900 font-medium mb-2">
            Recomendações:
          </Text>
          <ul className="text-left space-y-1">
            <li className="flex items-start gap-2 text-sm text-blue-800">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Use um computador desktop ou laptop
            </li>
            <li className="flex items-start gap-2 text-sm text-blue-800">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Resolução mínima recomendada: 1280px
            </li>
            <li className="flex items-start gap-2 text-sm text-blue-800">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Use Chrome, Firefox ou Safari atualizado
            </li>
          </ul>
        </div>

        {/* Continue Button (Optional) */}
        {showContinueButton && (
          <Button
            variant="outline"
            onClick={onContinue}
            className="w-full border-gold-500 text-gold-700 hover:bg-gold-50"
          >
            Continuar Mesmo Assim
          </Button>
        )}
      </Card>
    </div>
  );
}
