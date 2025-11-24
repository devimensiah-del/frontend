"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

/**
 * ProgressRing - Circular progress indicator
 *
 * SVG-based circular progress with percentage display.
 * Responsive sizing and customizable colors.
 *
 * @example
 * ```tsx
 * <ProgressRing percentage={75} size="md" color="gold" />
 * ```
 */

export interface ProgressRingProps {
  /** Progress percentage (0-100) */
  percentage: number;
  /** Ring size variant */
  size?: "sm" | "md" | "lg" | "xl";
  /** Ring color variant */
  color?: "gold" | "green" | "blue" | "red" | "gray";
  /** Show percentage text in center */
  showPercentage?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = "md",
  color = "gold",
  showPercentage = true,
  className,
}) => {
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  /**
   * Get size configurations
   */
  const getSizeConfig = () => {
    switch (size) {
      case "sm":
        return { dimension: 48, strokeWidth: 4, fontSize: "text-xs" };
      case "md":
        return { dimension: 80, strokeWidth: 6, fontSize: "text-sm" };
      case "lg":
        return { dimension: 120, strokeWidth: 8, fontSize: "text-base" };
      case "xl":
        return { dimension: 160, strokeWidth: 10, fontSize: "text-lg" };
      default:
        return { dimension: 80, strokeWidth: 6, fontSize: "text-sm" };
    }
  };

  /**
   * Get color values
   */
  const getColorConfig = () => {
    switch (color) {
      case "gold":
        return { stroke: "#B89E68", bg: "#EBE5D9" };
      case "green":
        return { stroke: "#16a34a", bg: "#dcfce7" };
      case "blue":
        return { stroke: "#3b82f6", bg: "#dbeafe" };
      case "red":
        return { stroke: "#dc2626", bg: "#fee2e2" };
      case "gray":
        return { stroke: "#71717a", bg: "#f4f4f5" };
      default:
        return { stroke: "#B89E68", bg: "#EBE5D9" };
    }
  };

  const { dimension, strokeWidth, fontSize } = getSizeConfig();
  const { stroke, bg } = getColorConfig();

  // Calculate circle properties
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedPercentage / 100) * circumference;
  const center = dimension / 2;

  return (
    <div
      className={cn("inline-flex items-center justify-center", className)}
      role="progressbar"
      aria-valuenow={clampedPercentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progresso: ${clampedPercentage}%`}
    >
      <svg width={dimension} height={dimension} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={bg}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.5s ease-in-out",
          }}
        />

        {/* Percentage Text */}
        {showPercentage && (
          <text
            x={center}
            y={center}
            textAnchor="middle"
            dy="0.3em"
            className={cn(
              "font-heading font-bold fill-[var(--navy-900)]",
              fontSize
            )}
            style={{ transform: "rotate(90deg)", transformOrigin: "center" }}
          >
            {Math.round(clampedPercentage)}%
          </text>
        )}
      </svg>
    </div>
  );
};

ProgressRing.displayName = "ProgressRing";
