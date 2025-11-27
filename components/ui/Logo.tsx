import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

/* ============================================
   LOGO COMPONENT - Uses SVG logos
   Variants: default (navy/gold), white (all white)
   ============================================ */

interface LogoProps {
  className?: string;
  grayscale?: boolean;
  alt?: string;
  showText?: boolean; // For backward compatibility (ignored since logo includes text)
  variant?: 'default' | 'white';
}

export const Logo: React.FC<LogoProps> = ({
  className,
  grayscale = false,
  alt = "IMENSIAH",
  showText: _showText, // Ignored - logo always includes text
  variant = 'default',
}) => {
  const logoSrc = variant === 'white'
    ? '/imensiah_logo_white.svg'
    : '/imensiah_logo.svg';

  return (
    <div className={cn("relative inline-block w-full h-full", className)}>
      <Image
        src={logoSrc}
        alt={alt}
        fill
        className={cn("object-contain", grayscale && "grayscale opacity-50")}
        priority
      />
    </div>
  );
};
