import type { Config } from "tailwindcss";
import {
  colors,
  spacing,
  fontSize,
  lineHeight,
  letterSpacing,
  fontFamily,
  borderRadius,
  boxShadow,
  animation,
  keyframes,
  container,
} from "./lib/design-system/tokens";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ...colors,
        // Semantic color aliases for components
        primary: colors.navy[900],
        secondary: colors.gold[500],
        accent: colors.gold[500],
        muted: colors.surface.paper,
        destructive: colors.semantic.error.DEFAULT,
        border: colors.surface.border,
        input: colors.surface.border,
        ring: colors.gold[500],
        background: colors.surface.paper,
        foreground: colors.text.primary,
      },
      spacing,
      fontSize,
      lineHeight,
      letterSpacing,
      fontFamily,
      borderRadius,
      boxShadow,
      animation,
      keyframes,
      maxWidth: {
        container: container.maxWidth,
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
  ],
};

export default config;
