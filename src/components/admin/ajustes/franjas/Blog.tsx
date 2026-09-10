"use client";

import type { PortadaBlog } from "@/lib/ajustes/portada";
import { usarFranja } from "../usarFranja";
import CampoTexto from "../CampoTexto";
import PieFranja from "../PieFranja";

/** Blog Gallón: el párrafo que presenta las columnas. */
export default function FranjaBlog({
  inicial,
  hayHistorial,
}: {
  inicial: PortadaBlog;
  hayHistorial: number;
}) {
  const f = usarFranja("portada.blog", inicial, hayHistorial);

  return (
    <section className="space-y-5">
      <CampoTexto
        id="blog-parrafo"
        etiqueta="Párrafo"
        valor={f.valor.parrafo}
        max={500}
        multilinea
        alCambiar={(v) => f.fijar({ ...f.valor, parrafo: v })}
      />
      <PieFranja
        clave="portada.blog"
        ancla="#blog"
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
