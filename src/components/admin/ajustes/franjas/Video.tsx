"use client";

import type { PortadaVideo } from "@/lib/ajustes/portada";
import { usarFranja } from "../usarFranja";
import CampoTexto from "../CampoTexto";
import PieFranja from "../PieFranja";

/**
 * «En sus propias palabras»: el texto que acompaña al video y el enlace.
 *
 * El enlace se pega tal como se copia del navegador; la portada lo traduce a
 * la URL que acepta el iframe.
 */
export default function FranjaVideo({
  inicial,
  hayHistorial,
}: {
  inicial: PortadaVideo;
  hayHistorial: number;
}) {
  const f = usarFranja("portada.video", inicial, hayHistorial);

  return (
    <section className="space-y-5">
      <CampoTexto
        id="video-antetitulo"
        etiqueta="Antetítulo"
        valor={f.valor.antetitulo}
        max={60}
        alCambiar={(v) => f.fijar({ ...f.valor, antetitulo: v })}
      />
      <CampoTexto
        id="video-titular"
        etiqueta="Titular"
        valor={f.valor.titular}
        max={120}
        multilinea
        alCambiar={(v) => f.fijar({ ...f.valor, titular: v })}
      />
      <CampoTexto
        id="video-parrafo1"
        etiqueta="Primer párrafo"
        valor={f.valor.parrafo1}
        max={400}
        multilinea
        alCambiar={(v) => f.fijar({ ...f.valor, parrafo1: v })}
      />
      <CampoTexto
        id="video-parrafo2"
        etiqueta="Segundo párrafo"
        valor={f.valor.parrafo2}
        max={400}
        multilinea
        alCambiar={(v) => f.fijar({ ...f.valor, parrafo2: v })}
      />
      <CampoTexto
        id="video-url"
        etiqueta="Enlace del video"
        valor={f.valor.url}
        max={300}
        ayuda="Pega el enlace tal como lo copias del navegador: sirve YouTube, youtu.be, un short o Vimeo. Mientras esté vacío, la portada muestra la pieza de campaña con el aviso «Video en camino»."
        alCambiar={(v) => f.fijar({ ...f.valor, url: v })}
      />
      <PieFranja
        clave="portada.video"
        ancla="#conoce-a-gallon"
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
