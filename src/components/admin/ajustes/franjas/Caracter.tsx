"use client";

import type { PortadaCaracter } from "@/lib/ajustes/portada";
import { usarFranja } from "../usarFranja";
import CampoTexto from "../CampoTexto";
import PieFranja from "../PieFranja";

/** «Mi carácter»: el titular largo y la frase que cierra, antes de Café Gallón. */
export default function FranjaCaracter({
  inicial,
  hayHistorial,
}: {
  inicial: PortadaCaracter;
  hayHistorial: number;
}) {
  const f = usarFranja("portada.caracter", inicial, hayHistorial);

  return (
    <section className="space-y-5">
      <CampoTexto
        id="caracter-titular"
        etiqueta="Titular"
        valor={f.valor.titular}
        max={200}
        multilinea
        alCambiar={(v) => f.fijar({ ...f.valor, titular: v })}
      />
      <CampoTexto
        id="caracter-frase"
        etiqueta="Frase de cierre"
        valor={f.valor.frase}
        max={120}
        multilinea
        ayuda="Pon entre dos asteriscos lo que va en negrita: **así**. Un salto de línea es un salto en escritorio."
        alCambiar={(v) => f.fijar({ ...f.valor, frase: v })}
      />
      <PieFranja
        clave="portada.caracter"
        ancla="#cafe-gallon"
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
