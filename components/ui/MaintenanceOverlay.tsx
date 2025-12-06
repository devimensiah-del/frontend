"use client";

import React from "react";
import { useTranslations } from "@/lib/i18n/context";
import { Wrench } from "lucide-react";

/**
 * MaintenanceOverlay - Full-screen maintenance message
 *
 * Displays a centered, clear maintenance message.
 * Used when maintenance mode is enabled.
 */
export function MaintenanceOverlay() {
  const t = useTranslations();

  return (
    <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center mb-6">
          <Wrench className="w-8 h-8 text-gold-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-heading font-semibold text-navy-900 mb-4">
          {t("maintenance.title")}
        </h1>

        {/* Message */}
        <p className="text-base text-text-secondary leading-relaxed mb-8">
          {t("maintenance.message")}
        </p>

        {/* Status indicator */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy-900/5 rounded-full">
          <span className="w-2 h-2 bg-gold-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium uppercase tracking-wider text-navy-900">
            {t("maintenance.status")}
          </span>
        </div>
      </div>
    </div>
  );
}
