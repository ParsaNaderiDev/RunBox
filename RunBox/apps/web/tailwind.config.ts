import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        foreground: "var(--foreground)",
        background: "var(--background)",
        muted: "#1f2933",
        accent: "#10b981",
        highlight: "#38bdf8",
        terminal: {
          bg: "#0b1120",
          fg: "#f9fafb"
        }
      },
      boxShadow: {
        glow: "0 0 60px -15px rgba(16, 185, 129, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
