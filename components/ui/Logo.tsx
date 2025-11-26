import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

/* ============================================
   LOGO COMPONENT - Uses imensiah_logo.png
   ============================================ */

interface LogoProps {
  className?: string;
  grayscale?: boolean;
  alt?: string;
  showText?: boolean; // For backward compatibility (ignored since PNG includes text)
  variant?: 'default' | 'white'; // For backward compatibility (ignored for PNG)
}

export const Logo: React.FC<LogoProps> = ({
  className,
  grayscale = false,
  alt = "IMENSIAH",
  showText: _showText, // Ignored - PNG always includes text
  variant: _variant, // Ignored - PNG is always default variant
}) => {
  return (
    <div className={cn("relative inline-block w-full h-full", className)}>
      <Image
        src="/imensiah_logo.png"
        alt={alt}
        fill
        className={cn("object-contain", grayscale && "grayscale opacity-50")}
        priority
      />
    </div>
  );
};
