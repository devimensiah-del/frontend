import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

/* ============================================
   LOGO COMPONENT
   ============================================ */

interface LogoProps {
  className?: string;
  grayscale?: boolean;
  alt?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className,
  grayscale = false,
  alt = "IMENSIAH",
}) => {
  return (
    <div className={cn("relative inline-block", className)}>
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
