import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clapperboard } from "lucide-react";
import MarcoVideo from "./MarcoVideo";
import { urlIncrustable } from "@/lib/campana/video";

const CARTEL = "/images/campana/portada-soy-gallon.webp";
const TITULO = "Soy Horacio Gallón";

/**
 * El video de «Soy Horacio Gallón», justo debajo de la semblanza.
 *
 * La franja es verde profundo y no crema: viene detrás de la banda verde del
 * perfil, así que el corte se lee como un escalón de la misma pieza y no como
 * una sección nueva, y un reproductor se ve mejor sobre oscuro.
 *
 * Mientras no haya URL cargada en el panel, la pieza de campaña hace de cartel
 * y el bloque anuncia que el video viene en camino. No se pinta un botón de
 * play que no reproduce nada.
 */
export default function VideoPerfil({ url }: { url: string }) {
  const incrustable = urlIncrustable(url);

  return (
    <section
      id="conoce-a-gallon"
      aria-labelledby="video-perfil-titulo"
      className="bg-campana-bosque"
    >
      <div className="mx-auto grid w-[min(83.125rem,100%_-_2.5rem)] items-center gap-9 py-12 lg:grid-cols-[1.32fr_1fr] lg:gap-12 lg:py-14">
        {/* Sin video, el marco toma la proporción de la pieza de campaña
            (1600 × 614) para que se vea entera: recortada a 16:9 perdía un
            tercio del ancho y el abrazo quedaba cortado por la mitad. Con
            video, manda el 16:9 del reproductor. */}
        <div
          className={`relative w-full overflow-hidden rounded-2xl bg-campana-profundo shadow-[0_1.5rem_3rem_rgba(0,0,0,0.35)] ring-1 ring-white/15 ${
            incrustable ? "aspect-video" : "aspect-[1600/614]"
          }`}
        >
          {incrustable ? (
            <MarcoVideo src={incrustable} cartel={CARTEL} titulo={TITULO} />
          ) : (
            <>
              <Image
                src={CARTEL}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
              {/* A la derecha: la pieza lleva el titular y la frase pegados al
                  flanco izquierdo, y en un móvil el marco mide 150 px de alto
                  —el aviso, puesto ahí, tapaba «sembrando una buena semilla». */}
              <p className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-campana-profundo/85 px-4 py-2 font-campana text-xs font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-sm lg:bottom-5 lg:right-5 lg:text-sm">
                <Clapperboard aria-hidden="true" className="h-4 w-4 text-campana-dorado" />
                Video en camino
              </p>
            </>
          )}
        </div>

        <div>
          <p className="font-campana text-sm font-bold uppercase tracking-[0.14em] text-campana-dorado lg:text-base">
            En sus propias palabras
          </p>
          <h3
            id="video-perfil-titulo"
            className="titular-sin-balance mt-3 font-campana text-2xl font-extrabold leading-[1.12] text-white sm:text-3xl lg:text-[2.35rem]"
          >
            Una hoja de vida no alcanza a contar un recorrido.
          </h3>

          <p className="mt-5 font-campana text-[0.95rem] leading-relaxed text-white/85 lg:text-[1.02rem]">
            Treinta años entre lo público y lo privado: concejal, alcalde, representante a
            la Cámara, director de la Agencia de Desarrollo Rural y secretario de
            Infraestructura de Antioquia.
          </p>
          <p className="mt-4 font-campana text-[0.95rem] leading-relaxed text-white/85 lg:text-[1.02rem]">
            Detrás de cada cargo hay municipios recorridos, obras destrabadas y gente
            escuchada en su propio pueblo. Eso no cabe en un renglón:{" "}
            {incrustable ? "aquí lo cuenta él mismo." : "pronto lo cuenta él mismo, aquí."}
          </p>

          <Link
            href="/quien-es-gallon"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-campana-dorado-boton px-7 py-3 font-campana text-sm font-bold uppercase tracking-[0.04em] text-campana-profundo transition-transform hover:scale-[1.03]"
          >
            Conoce su trayectoria
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
