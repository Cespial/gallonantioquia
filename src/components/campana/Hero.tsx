import Image from "next/image";
import { Mouse } from "lucide-react";

/**
 * El hero es una composición gráfica, no un bloque de texto: fijado en píxeles
 * a los 1440 px del mockup, en una pantalla de 1728 o 1920 la franja se
 * ensancha pero la composición se queda igual y acaba flotando en mitad del
 * fondo.
 *
 * Por eso sus medidas van en `vw`, derivadas del mockup —dividir la medida a
 * 1440 px entre 14,4 da los `vw`— con `clamp` para no encogerse por debajo de
 * lo legible ni seguir creciendo más allá de 1920. Las clases van escritas
 * enteras a propósito: Tailwind no detecta nombres construidos por
 * interpolación.
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

      {/* El retrato se apoya en el 52,2% del ancho, como en el mockup, y crece
          con la ventana igual que el resto de la composición. */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="absolute -top-[1.4vw] left-[52.2%]">
          <Image
            src="/images/campana/gallon-pulgar.webp"
            alt="Horacio Gallón, candidato a la Gobernación de Antioquia"
            width={1200}
            height={1239}
            priority
            sizes="(max-width: 1024px) 70vw, 50vw"
            className="h-[clamp(37rem,51.6vw,61.9rem)] w-auto max-w-none object-contain"
          />
        </div>
      </div>

      <div className="relative grid min-h-[32rem] grid-cols-1 gap-6 px-5 pt-10 sm:min-h-[36rem] lg:min-h-[clamp(28rem,38.33vw,46rem)] lg:grid-cols-[57%_43%] lg:gap-0 lg:px-0 lg:pt-0">
        <div className="flex flex-col items-center justify-center pb-8 text-center lg:pb-[1.5vw] lg:pt-[4.4vw]">
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
              sizes="(max-width: 1024px) 88vw, 33vw"
              className="mx-auto h-auto w-full max-w-[22rem] sm:max-w-[26rem] lg:max-w-[clamp(20rem,32.1vw,38.5rem)]"
            />
            <span
              aria-hidden="true"
              className="mx-auto mt-3 block w-fit rounded-full bg-white px-6 py-1 font-campana text-[0.8rem] font-extrabold uppercase tracking-[0.06em] text-campana-selva sm:px-8 sm:text-[0.95rem] lg:mt-[0.85vw] lg:px-[2.5vw] lg:py-[0.4vw] lg:text-[clamp(0.95rem,1.39vw,1.67rem)]"
            >
              <span className="mr-2 align-[0.18em] text-[0.55em]">●</span>
              Horacio Gallón
              <span className="ml-2 align-[0.18em] text-[0.55em]">●</span>
            </span>
          </h1>

          <p className="mt-7 max-w-[26rem] font-campana text-[0.95rem] font-bold leading-snug text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)] sm:text-base lg:mt-[1.7vw] lg:max-w-[clamp(22rem,31.3vw,37.6rem)] lg:text-[clamp(0.95rem,1.244vw,1.49rem)]">
            <span className="mb-1 block text-2xl font-bold lg:text-[clamp(1.5rem,2.28vw,2.73rem)]">
              Antioquia
            </span>
            {subtitulo}
          </p>

          <p className="mt-8 hidden items-center gap-3 font-campana text-sm text-white/85 lg:mt-[2.5vw] lg:flex lg:text-[clamp(0.8rem,0.97vw,1.17rem)]">
            <Mouse
              className="h-[1.35em] w-[1.35em] animate-bounce [animation-duration:2.2s]"
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
