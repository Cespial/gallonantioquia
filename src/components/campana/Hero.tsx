import Image from "next/image";
import { Mouse } from "lucide-react";

export default function Hero({ subtitulo }: { subtitulo: string }) {
  return (
    <section
      id="inicio"
      aria-label="A paso firme por Antioquia"
      className="relative isolate overflow-hidden bg-campana-bosque"
    >
      {/* Cordillera antioqueña a sangre. El `priority` es deliberado: es la
          imagen que define el LCP de la portada. */}
      <Image
        src="/images/campana/panorama-cordillera.webp"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Dos velos: el primero asienta la foto en el verde de la marca, el
          segundo abre sitio al texto sobre el flanco izquierdo sin apagar el
          cielo de la derecha, donde va el retrato. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-campana-bosque/45 mix-blend-multiply"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent"
      />

      <div className="relative mx-auto grid min-h-[32rem] max-w-[1500px] grid-cols-1 gap-6 px-5 pt-10 sm:min-h-[36rem] lg:min-h-[34.5rem] lg:grid-cols-[57%_43%] lg:gap-0 lg:px-8 lg:pt-0">
        <div className="flex flex-col items-center justify-center pb-8 text-center lg:pb-14 lg:pt-16">
          {/* El titular es el lockup de marca, no texto: esa slab itálica es
              parte de la identidad y ninguna fuente web la imita. */}
          <h1 className="w-full">
            <span className="sr-only">
              A paso firme por Antioquia — Horacio Gallón
            </span>
            <Image
              src="/images/campana/lockup-titulo.webp"
              alt=""
              aria-hidden="true"
              width={1100}
              height={316}
              priority
              sizes="(max-width: 1024px) 88vw, 46vw"
              className="mx-auto h-auto w-full max-w-[22rem] sm:max-w-[26rem] lg:max-w-[34rem]"
            />
            <span
              aria-hidden="true"
              className="mx-auto mt-3 block w-fit rounded-full bg-white px-6 py-1.5 font-campana text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-campana-selva sm:px-8 sm:text-[0.95rem] lg:mt-4 lg:px-10 lg:text-[1.15rem]"
            >
              <span className="mr-2 align-[0.15em] text-[0.7em]">●</span>
              Horacio Gallón
              <span className="ml-2 align-[0.15em] text-[0.7em]">●</span>
            </span>
          </h1>

          <p className="mt-7 max-w-[26rem] font-campana text-[0.95rem] font-bold leading-snug text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)] sm:text-base lg:mt-9 lg:max-w-[30rem] lg:text-[1.05rem]">
            <span className="mb-1 block text-2xl font-bold lg:text-[1.9rem]">
              Antioquia
            </span>
            {subtitulo}
          </p>

          <p className="mt-8 hidden items-center gap-3 font-campana text-sm text-white/85 lg:mt-12 lg:flex">
            <Mouse
              className="h-5 w-5 animate-bounce [animation-duration:2.2s]"
              strokeWidth={1.6}
              aria-hidden="true"
            />
            Desliza para descubrir
          </p>
        </div>

        {/* El retrato se apoya en el borde inferior de la franja, como en el
            mockup: recortarlo por abajo es intencional. */}
        <div className="relative -mb-px flex items-end justify-center lg:justify-start">
          <Image
            src="/images/campana/gallon-pulgar.webp"
            alt="Horacio Gallón, candidato a la Gobernación de Antioquia"
            width={1200}
            height={1239}
            priority
            sizes="(max-width: 1024px) 70vw, 40vw"
            className="h-auto w-[16rem] max-w-none object-contain object-bottom sm:w-[20rem] lg:absolute lg:bottom-0 lg:left-1/2 lg:h-[33rem] lg:w-auto lg:-translate-x-1/2"
          />
        </div>
      </div>
    </section>
  );
}
