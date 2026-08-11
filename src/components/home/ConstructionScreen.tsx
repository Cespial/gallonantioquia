"use client";

import Image from "next/image";
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
        {/* Identidad de la campaña. Antes decía «Gallón Memorias», que era
            el sitio anterior; el logotipo se sirve desde public. */}
        <Image
          src="/images/campana/logo-gallon-blanco.png"
          alt="Gallón Gobernador"
          width={640}
          height={411}
          priority
          className="h-24 w-auto md:h-28"
        />

        <p className="mt-10 font-campana text-[10px] font-semibold uppercase tracking-[0.3em] text-campana-dorado md:text-xs">
          A paso firme por Antioquia
        </p>

        {/* Título principal */}
        <h1 className="mt-5 font-campana text-[clamp(2.2rem,5.5vw,3.8rem)] font-extrabold uppercase leading-[0.95] tracking-tight text-white">
          En construcci<span className="text-campana-dorado">ó</span>n
          <span className="construction-dots" aria-hidden="true">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </h1>

        {/* Divisor dorado */}
        <div className="mt-8 h-px w-16 bg-campana-dorado" />

        {/* Subtítulo */}
        <p className="mt-8 max-w-md font-campana text-base leading-relaxed text-white/70 md:text-lg">
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
