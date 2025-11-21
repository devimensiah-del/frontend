import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ============================================
         TYPOGRAPHY
         ============================================ */
      fontFamily: {
        heading: ["var(--font-heading)", ...fontFamily.sans],
        body: ["var(--font-body)", ...fontFamily.sans],
        sans: ["var(--font-body)", ...fontFamily.sans],
      },
      fontSize: {
        xs: "var(--text-xs)",
        sm: "var(--text-sm)",
        base: "var(--text-base)",
        lg: "var(--text-lg)",
        xl: "var(--text-xl)",
        "2xl": "var(--text-2xl)",
        "3xl": "var(--text-3xl)",
        "4xl": "var(--text-4xl)",
        "5xl": "var(--text-5xl)",
        "6xl": "var(--text-6xl)",
        "7xl": "var(--text-7xl)",
      },
      letterSpacing: {
        tight: "var(--tracking-tight)",
        normal: "var(--tracking-normal)",
        wide: "var(--tracking-wide)",
        wider: "var(--tracking-wider)",
        widest: "var(--tracking-widest)",
        ultra: "var(--tracking-ultra)",
      },
      lineHeight: {
        none: "var(--leading-none)",
        tight: "var(--leading-tight)",
        snug: "var(--leading-snug)",
        normal: "var(--leading-normal)",
        relaxed: "var(--leading-relaxed)",
      },

      /* ============================================
         COLORS
         ============================================ */
      colors: {
        navy: {
          900: "var(--navy-900)",
          800: "var(--navy-800)",
          700: "var(--navy-700)",
        },
        gold: {
          500: "var(--gold-500)",
          600: "var(--gold-600)",
          light: "var(--gold-light)",
        },
        surface: {
          paper: "var(--surface-paper)",
          white: "var(--surface-white)",
        },
        line: "var(--line-color)",
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
        },
      },

      /* ============================================
         BORDER RADIUS - Sharp Architectural Style
         ============================================ */
      borderRadius: {
        none: "var(--radius-none)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        DEFAULT: "var(--radius-none)", // Default to sharp corners
        full: "var(--radius-full)",
      },

      /* ============================================
         LAYOUT
         ============================================ */
      maxWidth: {
        editorial: "var(--container-max)",
      },

      /* ============================================
         SPACING & SIZING
         ============================================ */
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
      },

      /* ============================================
         ANIMATIONS
         ============================================ */
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
