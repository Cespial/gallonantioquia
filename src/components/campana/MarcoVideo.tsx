"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

/**
 * El reproductor no carga hasta que alguien lo pide.
 *
 * Un `<iframe>` de YouTube arrastra cerca de un megabyte de scripts y cookies
 * de terceros en cuanto se pinta, aunque el visitante nunca le dé al play. Como
 * el video vive en mitad de la portada y la mayoría de la gente pasa de largo,
 * aquí solo se muestra el cartel; el iframe se monta con el primer clic.
 */
export default function MarcoVideo({
  src,
  cartel,
  titulo,
}: {
  /** URL ya lista para incrustar (ver `lib/campana/video`). */
  src: string;
  cartel: string;
  titulo: string;
}) {
  const [reproduciendo, setReproduciendo] = useState(false);

  if (reproduciendo) {
    return (
      <iframe
        src={`${src}?autoplay=1&rel=0`}
        title={titulo}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setReproduciendo(true)}
      aria-label={`Reproducir: ${titulo}`}
      className="group absolute inset-0 h-full w-full"
    >
      {/* `contain`, no `cover`: el cartel es la pieza de campaña, de 1600 × 614,
          y recortarla al 16:9 del reproductor se lleva un tercio del ancho. En
          caja va entera, sobre el verde profundo del marco. */}
      <Image
        src={cartel}
        alt=""
        aria-hidden="true"
        fill
        sizes="(max-width: 1024px) 100vw, 60vw"
        className="object-contain"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-campana-profundo/25 transition-colors group-hover:bg-campana-profundo/10"
      />
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform group-hover:scale-110 lg:h-20 lg:w-20"
      >
        <Play className="ml-1 h-7 w-7 fill-campana-selva text-campana-selva lg:h-9 lg:w-9" />
      </span>
    </button>
  );
}
