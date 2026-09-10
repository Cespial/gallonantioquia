"use client";

import type { PortadaPodcast } from "@/lib/ajustes/portada";
import { usarFranja } from "../usarFranja";
import CampoTexto from "../CampoTexto";
import PieFranja from "../PieFranja";

/** Podcast: el párrafo de presentación y el enlace al canal o a la lista de episodios. */
export default function FranjaPodcast({
  inicial,
  hayHistorial,
}: {
  inicial: PortadaPodcast;
  hayHistorial: number;
}) {
  const f = usarFranja("portada.podcast", inicial, hayHistorial);

  return (
    <section className="space-y-5">
      <CampoTexto
        id="podcast-parrafo"
        etiqueta="Párrafo"
        valor={f.valor.parrafo}
        max={500}
        multilinea
        alCambiar={(v) => f.fijar({ ...f.valor, parrafo: v })}
      />
      <CampoTexto
        id="podcast-url"
        etiqueta="Enlace del podcast"
        valor={f.valor.url}
        max={500}
        ayuda="Pega el enlace del canal o de la lista de episodios. Mientras esté vacío, la portada dice «Primeros episodios en camino»."
        alCambiar={(v) => f.fijar({ ...f.valor, url: v })}
      />
      <PieFranja
        clave="portada.podcast"
        ancla="#podcast"
        pendiente={f.pendiente}
        hayHistorial={f.hayHistorial}
        alGuardar={f.guardar}
        alDeshacer={f.deshacer}
        alRestaurar={f.restaurar}
        mensaje={f.mensaje}
        error={f.error}
      />
    </section>
  );
}
