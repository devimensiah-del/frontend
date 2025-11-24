"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";
import { CheckCircle, Clock, AlertCircle, Info } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * StatusTimeline - Vertical event history timeline
 *
 * Displays chronological workflow events with color-coded icons.
 * Shows completed, in-progress, and pending states.
 *
 * @example
 * ```tsx
 * <StatusTimeline
 *   events={[
 *     { type: "success", title: "Recebido", timestamp: "2024-11-23T10:30:00Z", description: "Dados submetidos" },
 *     { type: "info", title: "Enriquecendo", timestamp: "2024-11-23T11:00:00Z", description: "Análise em andamento" }
 *   ]}
 * />
 * ```
 */

export type TimelineEventType = "success" | "info" | "warning" | "error" | "pending";

export interface TimelineEvent {
  /** Event type determining icon and color */
  type: TimelineEventType;
  /** Event title (e.g., "Recebido", "Análise completa") */
  title: string;
  /** ISO 8601 timestamp */
  timestamp: string;
  /** Optional detailed description */
  description?: string;
}

export interface StatusTimelineProps {
  /** Array of timeline events */
  events: TimelineEvent[];
  /** Additional CSS classes */
  className?: string;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ events, className }) => {
  /**
   * Get icon and color configuration for event type
   */
  const getEventConfig = (type: TimelineEventType) => {
    switch (type) {
      case "success":
        return {
          Icon: CheckCircle,
          iconColor: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-600",
        };
      case "info":
        return {
          Icon: Clock,
          iconColor: "text-[var(--gold-600)]",
          bgColor: "bg-[var(--gold-light)]",
          borderColor: "border-[var(--gold-600)]",
        };
      case "warning":
        return {
          Icon: AlertCircle,
          iconColor: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-600",
        };
      case "error":
        return {
          Icon: AlertCircle,
          iconColor: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-600",
        };
      case "pending":
        return {
          Icon: Info,
          iconColor: "text-gray-400",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-300",
        };
      default:
        return {
          Icon: Info,
          iconColor: "text-gray-400",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-300",
        };
    }
  };

  /**
   * Format timestamp for display
   */
  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return format(date, "d MMM HH:mm", { locale: ptBR });
    } catch {
      return timestamp;
    }
  };

  return (
    <div className={cn("space-y-6", className)} role="list" aria-label="Histórico de eventos">
      {events.map((event, index) => {
        const config = getEventConfig(event.type);
        const isLast = index === events.length - 1;

        return (
          <div key={index} className="relative" role="listitem">
            <div className="flex items-start gap-4">
              {/* Icon Node */}
              <div className="relative flex-shrink-0">
                <div
                  className={cn(
                    "w-10 h-10 rounded-[var(--radius-full)] flex items-center justify-center",
                    "border-2 transition-all duration-300",
                    config.bgColor,
                    config.borderColor
                  )}
                  role="img"
                  aria-label={`${event.type}: ${event.title}`}
                >
                  <config.Icon className={cn("w-5 h-5", config.iconColor)} aria-hidden="true" />
                </div>

                {/* Vertical Connector Line */}
                {!isLast && (
                  <div
                    className="absolute left-1/2 top-10 -ml-px w-0.5 h-full bg-[var(--line-color)]"
                    role="presentation"
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Event Content */}
              <div className="flex-1 min-w-0 pt-1">
                {/* Title and Timestamp */}
                <div className="flex flex-wrap items-baseline gap-2 mb-1">
                  <h4
                    className={cn(
                      "font-heading font-bold uppercase text-[var(--text-sm)]",
                      "tracking-[var(--tracking-wide)] text-[var(--navy-900)]"
                    )}
                  >
                    {event.title}
                  </h4>
                  <time
                    className="text-[var(--text-xs)] text-[var(--text-tertiary)]"
                    dateTime={event.timestamp}
                  >
                    {formatTimestamp(event.timestamp)}
                  </time>
                </div>

                {/* Description */}
                {event.description && (
                  <p className="text-[var(--text-sm)] text-[var(--text-secondary)] leading-relaxed">
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

StatusTimeline.displayName = "StatusTimeline";
