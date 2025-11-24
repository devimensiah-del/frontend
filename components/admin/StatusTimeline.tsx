"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";
import { CheckCircle, Circle, Clock } from "lucide-react";

/* ============================================
   STATUS TIMELINE - Processing Event Timeline
   ============================================ */

interface TimelineEvent {
  type: string;
  timestamp?: string;
  label: string;
}

interface StatusTimelineProps {
  events: TimelineEvent[];
}

export function StatusTimeline({ events }: StatusTimelineProps) {
  return (
    <div className="space-y-3">
      {events.map((event, index) => {
        const hasTimestamp = !!event.timestamp;
        const isLast = index === events.length - 1;

        return (
          <div key={`${event.type}-${index}`} className="flex gap-3">
            {/* Icon */}
            <div className="flex flex-col items-center">
              {hasTimestamp ? (
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              ) : (
                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
              {!isLast && (
                <div
                  className={cn(
                    "w-px h-6 mt-1",
                    hasTimestamp ? "bg-green-300" : "bg-gray-300"
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <div
                className={cn(
                  "text-sm font-medium",
                  hasTimestamp ? "text-navy-900" : "text-text-secondary"
                )}
              >
                {event.label}
              </div>
              {hasTimestamp && event.timestamp && (
                <div className="text-xs text-text-tertiary mt-1">
                  {formatTimestamp(event.timestamp)}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
