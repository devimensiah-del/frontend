import React from "react";
import { cn } from "@/lib/utils/cn";

/* ============================================
   DISPLAY COMPONENT - For Hero & Stats
   ============================================ */

interface DisplayProps extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?: "hero" | "stat";
  children: React.ReactNode;
}

export const Display: React.FC<DisplayProps> = ({
  variant = "hero",
  className,
  children,
  ...props
}) => {
  const variants = {
    hero: "text-5xl lg:text-7xl font-medium leading-tight tracking-tight text-navy-900",
    stat: "text-6xl font-light font-heading text-navy-900",
  };

  return (
    <h1 className={cn(variants[variant], className)} {...props}>
      {children}
    </h1>
  );
};

/* ============================================
   HEADING COMPONENT
   ============================================ */

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  variant?: "section" | "title" | "subtitle";
  children: React.ReactNode;
}

export const Heading: React.FC<HeadingProps> = ({
  as: Tag = "h2",
  variant = "section",
  className,
  children,
  ...props
}) => {
  const variants = {
    section: "text-3xl lg:text-5xl font-medium text-navy-900 tracking-tight",
    title: "text-2xl font-medium text-navy-900 mb-2",
    subtitle: "text-xl font-medium text-navy-900",
  };

  return (
    <Tag className={cn(variants[variant], className)} {...props}>
      {children}
    </Tag>
  );
};

/* ============================================
   TEXT COMPONENT
   ============================================ */

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "body" | "small" | "large" | "lead" | "light";
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = "body",
  className,
  children,
  ...props
}) => {
  const variants = {
    body: "text-base leading-normal text-text-primary",
    small: "text-sm leading-normal text-text-secondary",
    large: "text-lg leading-relaxed text-text-primary",
    lead: "text-lg text-text-secondary leading-relaxed font-light",
    light: "text-base leading-relaxed text-gray-300", // For dark backgrounds
  };

  return (
    <p className={cn(variants[variant], className)} {...props}>
      {children}
    </p>
  );
};

/* ============================================
   LABEL COMPONENT - The Architectural Label
   ============================================ */

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
  variant?: "default" | "subheading";
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, variant = "default", ...props }, ref) => {
    const variants = {
      default: "label-editorial",
      subheading: "text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500",
    };
    
    return (
      <label ref={ref} className={cn(variants[variant], className)} {...props}>
        {children}
        {required && <span className="text-gold-500 ml-1">*</span>}
      </label>
    );
  }
);

Label.displayName = "Label";

/* ============================================
   EYEBROW COMPONENT - For Section Labels
   ============================================ */

interface EyebrowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Eyebrow: React.FC<EyebrowProps> = ({ className, children, ...props }) => {
  return (
    <div 
      className={cn("text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500", className)} 
      {...props}
    >
      {children}
    </div>
  );
};

/* ============================================
   BADGE COMPONENT - For Step Numbers
   ============================================ */

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "step" | "default";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className,
  ...props
}) => {
  const variants = {
    step: "badge-step",
    default: "text-xs font-bold px-2 py-1 border rounded-full",
  };

  return (
    <span className={cn(variants[variant], className)} {...props}>
      {children}
    </span>
  );
};
