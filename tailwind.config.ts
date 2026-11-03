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
        "midnight-blue": "#262D37",
        champagne: "#B39F84",
        "moss-green": "#2C3A2D",
        onyx: "#0C0C00",
        umber: "#2F251C",
        burgundy: "#672322",
        cream: "#F5F0E7",
        surface: "#FBF9F5",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F3EEE5",
        "surface-container": "#EAE4D9",
        "surface-container-high": "#E1D8CA",
        "surface-container-highest": "#ECE5D9",
        "on-surface": "#0C0C00",
        "on-surface-variant": "#4A453D",
        outline: "#7C7264",
        "outline-variant": "#CEC2B1",
        primary: "#262D37",
        "primary-dark": "#1C232B",
        "on-primary": "#FBF8F2",
        "primary-container": "#262D37",
        "on-primary-container": "#F8F4EA",
        secondary: "#672322",
        "secondary-dark": "#501B1B",
        "on-secondary": "#FFFFFF",
        "secondary-container": "#B39F84",
        "on-secondary-container": "#0C0C00",
        background: "#F5F0E7",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
        brand: ["var(--font-cormorant)", "Playfair Display", "serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
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
        soft: "0 2px 8px -2px rgba(38, 45, 55, 0.08)",
        modal: "0 10px 24px -4px rgba(12, 12, 0, 0.16)",
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
