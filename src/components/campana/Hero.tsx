import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function Hero({ subtitulo }: { subtitulo: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-campana-profundo">
      {/* Montañas de fondo, atenuadas para que el texto blanco no compita */}
      <Image
        src="/images/campana/hero-montanas.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-70"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-campana-profundo via-campana-profundo/85 to-campana-profundo/30"
      />

      <div className="relative mx-auto grid max-w-[1400px] items-end gap-8 px-5 pt-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-4 lg:px-10 lg:pt-16">
        <div className="pb-14 lg:pb-24">
          <p className="font-campana text-2xl font-bold uppercase leading-none tracking-tight text-white sm:text-3xl lg:text-[2.6rem]">
            A paso firme por
          </p>

          <h1 className="mt-1 font-campana text-[3.6rem] font-extrabold uppercase italic leading-[0.85] tracking-tight text-white sm:text-[5rem] lg:text-[7.2rem]">
            Antioquia
          </h1>

          <p className="mt-4 inline-flex rounded-full border-2 border-white/90 px-5 py-1.5 font-campana text-[11px] font-bold uppercase tracking-[0.28em] text-white sm:text-sm">
            · Gallón Gobernador ·
          </p>

          <p className="mt-7 max-w-md font-campana text-base font-semibold leading-snug text-white/95 sm:text-lg">
            {subtitulo}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/plan-de-gobierno"
              className="rounded-full bg-campana-dorado px-7 py-3.5 font-campana text-[13px] font-bold uppercase tracking-wide text-white transition-transform hover:scale-[1.03]"
            >
              Conoce el plan de gobierno
            </Link>
            <Link
              href="/horario"
              className="rounded-full border-2 border-white px-8 py-3.5 font-campana text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-campana-profundo"
            >
              Ver agenda
            </Link>
          </div>

          <p className="mt-10 hidden items-center gap-2 font-campana text-xs text-white/70 lg:flex">
            <ChevronDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
            Desliza para descubrir
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[26rem] lg:max-w-none">
          <Image
            src="/images/campana/gallon-hero.webp"
            alt="Horacio Gallón, candidato a la Gobernación de Antioquia"
            width={900}
            height={1258}
            priority
            sizes="(max-width: 1024px) 80vw, 42vw"
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}
