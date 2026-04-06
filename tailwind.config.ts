import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:         "#0C0C0E",
        surface:    "#131315",
        surface2:   "#1A1A1D",
        surface3:   "#212124",
        border:     "#2C2C30",
        border2:    "#3A3A3E",
        accent:     "#F5A623",
        "accent-h": "#E8950F",
        text:       "#EFEFEF",
        "text-2":   "#8C8C90",
        "text-3":   "#4A4A50",
        green:      "#30D158",
      },
      fontFamily: {
        heading: ["var(--font-heading)"],
        body:    ["var(--font-body)"],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%":       { opacity: "0.4" },
        },
      },
      animation: {
        fadeUp: "fadeUp 1s cubic-bezier(0.16,1,0.3,1) both",
        pulse:  "pulse 2s ease-in-out infinite",
        spin:   "spin 0.4s cubic-bezier(0.36,0.07,0.19,0.97)",
      },
    },
  },
  plugins: [],
};

export default config;
