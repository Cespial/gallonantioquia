"use client";

import { useEffect } from "react";

/**
 * Pantalla de "En construcción..." a pantalla completa, en el estilo de Gallón.
 * Se monta como overlay fijo cubriendo header y footer para un splash limpio.
 *
 * Para QUITARLA y dejar la página normal: en `src/app/page.tsx` poner
 * `const UNDER_CONSTRUCTION = false;` (o eliminar el bloque). No hace falta
 * tocar este archivo ni el resto del sitio.
 */
export default function ConstructionScreen({ mensaje }: { mensaje: string }) {
  // Bloquea el scroll del fondo mientras se muestra el splash.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[#0B3B24] px-6 text-center">
      {/* Resplandor sutil de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 50% 35%, rgba(200,169,81,0.10) 0%, rgba(11,59,36,0) 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Wordmark de marca */}
        <div className="flex flex-col items-center">
          <div className="flex items-baseline gap-2">
            <span className="font-brand text-2xl tracking-wide text-white md:text-3xl">
              GALL
              <span className="relative inline-block">
                O
                <span
                  className="absolute -top-[0.32em] left-1/2 -translate-x-1/2 text-[1.1em] leading-none text-dorado-tierra"
                  style={{ fontFamily: "serif" }}
                >
                  &#769;
                </span>
              </span>
              N
            </span>
            <span className="font-brand text-2xl tracking-wide text-dorado-tierra md:text-3xl">
              MEMORIAS
            </span>
          </div>
          <span className="mt-1 font-accent text-[8px] uppercase tracking-[0.4em] text-white/40">
            Historias &amp; Reflexiones
          </span>
        </div>

        {/* Eyebrow */}
        <p className="mt-14 font-ui text-[10px] uppercase tracking-[0.3em] text-dorado-tierra md:text-xs">
          Memorias de Antioquia
        </p>

        {/* Título principal */}
        <h1 className="mt-5 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-tight text-white">
          En construcci<span className="italic text-dorado-tierra">ó</span>n
          <span className="construction-dots" aria-hidden="true">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </h1>

        {/* Divisor dorado */}
        <div className="mt-8 h-px w-16 bg-dorado-tierra" />

        {/* Subtítulo */}
        <p className="mt-8 max-w-md font-body text-base leading-relaxed text-white/55 md:text-lg">
          {mensaje}
        </p>
      </div>

      <style>{`
        .construction-dots span {
          display: inline-block;
          animation: constructionBlink 1.4s infinite both;
        }
        .construction-dots span:nth-child(2) { animation-delay: 0.2s; }
        .construction-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes constructionBlink {
          0%, 80%, 100% { opacity: 0.25; }
          40% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .construction-dots span { animation: none; opacity: 1; }
        }
      `}</style>
    </div>
  );
}
