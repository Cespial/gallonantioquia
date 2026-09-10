"use client";

import type { Medio } from "@/db/esquema";
import type { PortadaEquipo } from "@/lib/ajustes/portada";
import { usarFranja } from "../usarFranja";
import RanuraFoto from "../RanuraFoto";
import PieFranja from "../PieFranja";

/** Foto de equipo: la imagen que enlaza con la franja de cifras. */
export default function FranjaEquipo({
  inicial,
  medios,
  esAdmin,
  hayHistorial,
}: {
  inicial: PortadaEquipo;
  medios: Medio[];
  esAdmin: boolean;
  hayHistorial: number;
}) {
  const f = usarFranja("portada.equipo", inicial, hayHistorial);

  return (
    <section className="space-y-5">
      <RanuraFoto
        etiqueta="Foto de equipo"
        valor={f.valor.foto}
        medios={medios}
        esAdmin={esAdmin}
        referencia="Horizontal, a sangre, ≈1280 × 975 px; la cara importa en el tercio superior porque la franja siguiente la recorta por abajo."
        alCambiar={(foto) => f.fijar({ ...f.valor, foto })}
      />
      <PieFranja
        clave="portada.equipo"
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
