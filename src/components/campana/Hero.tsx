import Image from "next/image";
import { Mouse } from "lucide-react";

/**
 * Las medidas del retrato salen de correlacionar el recorte contra el mockup,
 * no de calcularlas a ojo: a 1440 px la figura mide 720 × 743 y arranca 20 px
 * por encima del borde superior de la franja, así que se recorta por abajo.
 * Se fija por ALTO —no por ancho en `vw`— para que en pantallas anchas no
 * crezca hasta desbordar una franja que tiene el alto fijo.
 */
export default function Hero({ subtitulo }: { subtitulo: string }) {
  return (
    <section
      id="inicio"
      aria-label="A paso firme por Antioquia"
      className="relative isolate overflow-hidden bg-campana-bosque"
    >
      <Image
        src="/images/campana/panorama-cordillera.webp"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_62%]"
      />
      {/* Dos velos: el primero asienta la foto en el verde de la marca, el
          segundo abre sitio al texto sobre el flanco izquierdo. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-campana-bosque/45 mix-blend-multiply"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/28 to-black/5"
      />

      {/* El retrato se ancla a la sección, no al contenedor con canaletas: en
          el mockup sangra por el borde derecho de la ventana. */}
      <div className="pointer-events-none absolute -top-5 left-[52.2%] hidden lg:block">
        <Image
          src="/images/campana/gallon-pulgar.webp"
          alt="Horacio Gallón, candidato a la Gobernación de Antioquia"
          width={1200}
          height={1239}
          priority
          sizes="720px"
          className="h-[46.4rem] w-auto max-w-none object-contain"
        />
      </div>

      <div className="relative mx-auto grid min-h-[32rem] max-w-[1500px] grid-cols-1 gap-6 px-5 pt-10 sm:min-h-[36rem] lg:min-h-[34.5rem] lg:grid-cols-[57%_43%] lg:gap-0 lg:px-8 lg:pt-0">
        <div className="flex flex-col items-center justify-center pb-8 text-center lg:pb-6 lg:pt-16">
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
              sizes="(max-width: 1024px) 88vw, 470px"
              className="mx-auto h-auto w-full max-w-[22rem] sm:max-w-[26rem] lg:max-w-[28.9rem]"
            />
            <span
              aria-hidden="true"
              className="mx-auto mt-3 block w-fit rounded-full bg-white px-6 py-1 font-campana text-[0.8rem] font-extrabold uppercase tracking-[0.06em] text-campana-selva sm:px-8 sm:text-[0.95rem] lg:mt-3 lg:px-9 lg:py-1.5 lg:text-[1.25rem]"
            >
              <span className="mr-2 align-[0.18em] text-[0.55em]">●</span>
              Horacio Gallón
              <span className="ml-2 align-[0.18em] text-[0.55em]">●</span>
            </span>
          </h1>

          <p className="mt-7 max-w-[26rem] font-campana text-[0.95rem] font-bold leading-snug text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)] sm:text-base lg:mt-6 lg:max-w-[28.2rem] lg:text-[1.12rem]">
            <span className="mb-1 block text-2xl font-bold lg:text-[2.05rem]">
              Antioquia
            </span>
            {subtitulo}
          </p>

          <p className="mt-8 hidden items-center gap-3 font-campana text-sm text-white/85 lg:mt-9 lg:flex">
            <Mouse
              className="h-5 w-5 animate-bounce [animation-duration:2.2s]"
              strokeWidth={1.6}
              aria-hidden="true"
            />
            Desliza para descubrir
          </p>
        </div>

        {/* En móvil el retrato no puede flotar: entra en el flujo, bajo el
            titular, y se apoya en el borde inferior de la franja. */}
        <div className="relative -mb-px flex items-end justify-center lg:hidden">
          <Image
            src="/images/campana/gallon-pulgar.webp"
            alt="Horacio Gallón, candidato a la Gobernación de Antioquia"
            width={1200}
            height={1239}
            priority
            sizes="(max-width: 1024px) 70vw, 1px"
            className="h-auto w-[16rem] max-w-none object-contain object-bottom sm:w-[20rem]"
          />
        </div>
      </div>
    </section>
  );
}
