import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import containerQueries from "@tailwindcss/container-queries";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFF7E8",
        surface: "#fcf9f8",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f6f3f2",
        "surface-container": "#f0eded",
        "surface-container-high": "#eae7e7",
        "surface-container-highest": "#e5e2e1",
        "on-surface": "#1c1b1b",
        "on-surface-variant": "#504442",
        outline: "#827471",
        "outline-variant": "#d4c3bf",
        primary: "#4E342E",
        "primary-dark": "#361f1a",
        "on-primary": "#ffffff",
        "primary-container": "#4e342e",
        "on-primary-container": "#f3e9e6",
        secondary: "#C89B3C",
        "secondary-dark": "#a97f2a",
        "on-secondary": "#ffffff",
        "secondary-container": "#fcca66",
        "on-secondary-container": "#5d4200",
        background: "#FFF7E8",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
        brand: ["var(--font-cormorant)", "Playfair Display", "serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1.5rem",
      },
      spacing: {
        gutter: "24px",
        "margin-desktop": "40px",
        "margin-mobile": "20px",
        "section-gap": "80px",
      },
      maxWidth: {
        "container-max": "1200px",
      },
      boxShadow: {
        soft: "0 4px 12px -2px rgba(78, 52, 46, 0.10)",
        modal: "0 12px 24px -4px rgba(78, 52, 46, 0.16)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [forms, containerQueries],
};

export default config;
