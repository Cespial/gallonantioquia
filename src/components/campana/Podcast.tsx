import { ArrowUpRight, Mic } from "lucide-react";
import PortadaSeccion from "./PortadaSeccion";

/**
 * El podcast «A paso firme por Antioquia».
 *
 * Mientras no haya enlace cargado en el panel, la sección dice que los
 * episodios vienen en camino y no lista ninguno. En la base quedaron cuatro
 * episodios de relleno —invitadas y temas inventados para probar el panel— y
 * publicarlos sería poner en boca de gente real una conversación que nunca
 * ocurrió.
 */
export default function Podcast({ url }: { url: string }) {
  const enlace = url.trim();

  return (
    <section id="podcast" aria-labelledby="podcast-titulo" className="bg-white">
      <PortadaSeccion
        id="podcast-titulo"
        src="/images/campana/portada-podcast.webp"
        titulo="A paso firme por Antioquia — el podcast"
      />

      <div className="mx-auto grid w-[min(83.125rem,100%_-_2.5rem)] items-start gap-8 py-12 lg:grid-cols-[1fr_auto] lg:gap-14 lg:py-14">
        <div className="lg:max-w-[52rem]">
          <p className="titular-sin-balance font-campana text-2xl leading-[1.15] text-campana-dorado sm:text-3xl lg:text-[2.35rem]">
            Conversaciones de <strong className="font-bold">taza larga</strong>.
          </p>
          <p className="mt-5 font-campana text-[0.95rem] leading-[1.6] text-neutral-700 lg:mt-6 lg:text-[1rem]">
            Un podcast para sentarse a hablar sin afán: con quien conoce un territorio
            palmo a palmo, con quien lleva media vida en un oficio, con quien tiene una
            idea que a Antioquia le sirve. El mismo café de siempre, ahora grabado.
          </p>
        </div>

        {enlace ? (
          <a
            href={enlace}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-campana-dorado-boton px-7 py-3 font-campana text-sm font-bold uppercase tracking-[0.04em] text-campana-profundo transition-transform hover:scale-[1.03]"
          >
            Escuchar los episodios
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
        ) : (
          <p className="inline-flex shrink-0 items-center gap-2 rounded-full border border-campana-hoja/30 bg-campana-crema px-6 py-3 font-campana text-sm font-semibold uppercase tracking-[0.06em] text-campana-hoja">
            <Mic aria-hidden="true" className="h-4 w-4" />
            Primeros episodios en camino
          </p>
        )}
      </div>
    </section>
  );
}
