import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function Hero({ subtitulo }: { subtitulo: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-campana-profundo lg:h-[560px]">
      {/* Montañas de fondo, atenuadas para que el texto blanco no compita */}
      <Image
        src="/images/campana/hero-montanas.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-90 saturate-[1.35]"
      />
      {/* Dos velos: el multiply lleva la foto al verde monocromo del mockup y
          el degradado abre sitio al texto sobre el flanco izquierdo. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-campana-bosque/70 mix-blend-multiply"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-campana-profundo/90 via-campana-profundo/45 to-transparent"
      />

      <div className="relative mx-auto grid h-full max-w-[1400px] items-end gap-6 px-5 pt-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-4 lg:px-10 lg:pt-0">
        <div className="pb-10 lg:flex lg:h-full lg:flex-col lg:justify-center lg:pb-0">
          {/* El titular es el lockup de marca, no texto: su tipografía slab
              itálica es parte de la identidad y ninguna fuente web la imita. */}
          <h1>
            <Image
              src="/images/campana/lockup-hero.png"
              alt="A paso firme por Antioquia · Gallón Gobernador"
              width={1100}
              height={428}
              priority
              sizes="(max-width: 1024px) 88vw, 42vw"
              className="h-auto w-full max-w-[26rem] lg:max-w-[36rem]"
            />
          </h1>

          <p className="mt-5 max-w-md font-campana text-base font-semibold leading-snug text-white/95 sm:text-lg">
            {subtitulo}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
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

          <p className="mt-7 hidden items-center gap-2 font-campana text-xs text-white/70 lg:flex">
            <ChevronDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
            Desliza para descubrir
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[22rem] self-end lg:max-w-none">
          <Image
            src="/images/campana/gallon-hero.webp"
            alt="Horacio Gallón, candidato a la Gobernación de Antioquia"
            width={900}
            height={1258}
            priority
            sizes="(max-width: 1024px) 80vw, 42vw"
            className="h-auto w-full object-contain object-bottom lg:absolute lg:bottom-0 lg:left-1/2 lg:h-[600px] lg:w-auto lg:-translate-x-1/2"
          />
        </div>
      </div>
    </section>
  );
}
