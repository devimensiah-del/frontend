import type { Config } from "tailwindcss";

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
        // Navy palette
        navy: {
          50: "#F0F3F7",
          100: "#E1E7EF",
          200: "#C3CFE0",
          300: "#A5B7D0",
          400: "#879FC1",
          500: "#6987B1",
          600: "#4B6FA2",
          700: "#1F2937",
          800: "#162032",
          900: "#0A101D",
        },
        // Gold palette
        gold: {
          50: "#FAF8F3",
          100: "#F5F1E7",
          200: "#EBE5D9",
          300: "#D4C9AD",
          400: "#BDAD81",
          500: "#B89E68",
          600: "#A18852",
          700: "#8A723C",
        },
        // Surfaces
        surface: {
          paper: "#F7F6F4",
          white: "#FFFFFF",
          border: "#E5E0D6",
        },
        // Line color
        line: "#E5E0D6",
        // Text hierarchy
        text: {
          primary: "#111827",
          secondary: "#52525B",
          tertiary: "#71717A",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        sans: ["var(--font-body)", "sans-serif"],
      },
      fontSize: {
        xs: "0.625rem", // 10px
        sm: "0.875rem", // 14px
        base: "1rem", // 16px
        lg: "1.125rem", // 18px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
        "3xl": "1.875rem", // 30px
        "4xl": "2.25rem", // 36px
        "5xl": "3rem", // 48px
        "6xl": "3.75rem", // 60px
        "7xl": "4.5rem", // 72px
      },
      letterSpacing: {
        tight: "-0.025em",
        normal: "0em",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.15em",
        ultra: "0.2em",
      },
      lineHeight: {
        none: "1",
        tight: "1.1",
        snug: "1.375",
        normal: "1.5",
        relaxed: "1.625",
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        md: "4px",
        full: "9999px",
      },
      maxWidth: {
        container: "1400px",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
  ],
};

export default config;
