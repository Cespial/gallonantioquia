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

        // Campaña «A paso firme por Antioquia». Los valores salen de muestrear
        // el mockup entregado por el equipo, no de aproximar a ojo.
        campana: {
          profundo: "#1c321e", // pie de página y franja de cifras
          bosque: "#1d361f", // bloques verdes oscuros de sección
          selva: "#2d6034", // verde medio: mitad baja del perfil
          hoja: "#24813b", // acento vivo: antetítulos, panel interior, checks
          tinta: "#375231", // titulares oscuros sobre fondo claro
          dorado: "#e5a414", // texto y acentos dorados
          "dorado-boton": "#dda014", // relleno de los botones
          "dorado-claro": "#f0c04a",
          crema: "#fefdf1", // fondo del bloque de perfil
          hueso: "#fbfaf9", // fondo general suave
          nata: "#fffdf2", // fondo de «Sumamos esfuerzos»
          cresta: "#b81f1f", // el rojo del logotipo
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)"],
        heading: ["var(--font-myriad)"],
        body: ["var(--font-source-serif)"],
        ui: ["var(--font-myriad)"],
        brand: ["var(--font-jacked)"],
        accent: ["var(--font-thorce)"],
        sans: ["var(--font-myriad)"],
        // Tipografía de la campaña: una geométrica muy bold para los títulos,
        // como en el mockup, y la misma familia en pesos suaves para el texto.
        campana: ["var(--font-poppins)", "system-ui", "sans-serif"],
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
