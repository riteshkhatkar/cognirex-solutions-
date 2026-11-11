import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8F7FC",
        foreground: "#1F1B2E",
        brand: {
          bg: "#F8F7FC",
          purple: {
            DEFAULT: "#7C3AED",
            hover: "#6D28D9",
            light: "#EEE8FA",
            subtle: "#F5F2FC",
          },
          yellow: {
            DEFAULT: "#FACC15",
            hover: "#EAB308",
            active: "#CA8A04",
          },
          text: "#1F1B2E",
          muted: "#6F6A7C",
          white: "#FFFFFF",
          border: "#E5E1ED",
          dark: "#1F1B2E",
        },
      },
      fontFamily: {
        heading: ["var(--font-sora)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      maxWidth: {
        site: "1200px",
      },
      boxShadow: {
        subtle: "0 2px 10px rgba(31, 27, 46, 0.04)",
        card: "0 4px 20px -2px rgba(31, 27, 46, 0.06)",
        "card-hover": "0 12px 30px -4px rgba(124, 58, 237, 0.12)",
        dropdown: "0 10px 30px rgba(31, 27, 46, 0.08)",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};

export default config;

