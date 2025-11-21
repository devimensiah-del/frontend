import React from "react";
import { cn } from "@/lib/utils/cn";

/* ============================================
   HEADING COMPONENT
   ============================================ */

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4";
  children: React.ReactNode;
}

export const Heading: React.FC<HeadingProps> = ({
  as: Tag = "h2",
  className,
  children,
  ...props
}) => {
  return (
    <Tag className={cn(className)} {...props}>
      {children}
    </Tag>
  );
};

/* ============================================
   TEXT COMPONENT
   ============================================ */

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "body" | "small" | "large";
  className?: string;
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
}

export const Label: React.FC<LabelProps> = ({
  className,
  children,
  required,
  ...props
}) => {
  return (
    <label className={cn("label-editorial", className)} {...props}>
      {children}
      {required && <span className="text-gold-500 ml-1">*</span>}
    </label>
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
