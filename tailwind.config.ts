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
        "verde-antioquia": "var(--verde-antioquia)",
        "verde-claro": "var(--verde-claro)",
        "verde-suave": "var(--verde-suave)",
        "dorado-tierra": "var(--dorado-tierra)",
        "dorado-claro": "var(--dorado-claro)",
        arena: "var(--arena)",
        "blanco-calido": "var(--blanco)",
        "texto-principal": "var(--texto-principal)",
        "texto-secundario": "var(--texto-secundario)",
        "texto-terciario": "var(--texto-terciario)",
        borde: "var(--borde)",
        oscuro: "var(--oscuro)",
        "oscuro-verde": "var(--oscuro-verde)",
      },
      fontFamily: {
        display: ["var(--font-playfair)"],
        heading: ["var(--font-myriad)"],
        body: ["var(--font-source-serif)"],
        ui: ["var(--font-myriad)"],
        brand: ["var(--font-jacked)"],
        accent: ["var(--font-thorce)"],
        sans: ["var(--font-myriad)"],
      },
      fontSize: {
        hero: ["clamp(2.5rem, 5vw, 4.5rem)", { lineHeight: "1.1", fontWeight: "900" }],
        "page-title": ["clamp(2rem, 4vw, 3.5rem)", { lineHeight: "1.15", fontWeight: "700" }],
        "section-title": ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.25", fontWeight: "700" }],
        subtitle: ["clamp(1.25rem, 2.5vw, 1.75rem)", { lineHeight: "1.3", fontWeight: "600" }],
      },
      borderRadius: {
        card: "12px",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "count-up": "countUp 2s ease-out forwards",
        "slide-down": "slideDown 0.3s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
