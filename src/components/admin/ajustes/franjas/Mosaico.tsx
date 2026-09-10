"use client";

import type { Medio } from "@/db/esquema";
import type { PortadaMosaico } from "@/lib/ajustes/portada";
import { usarFranja } from "../usarFranja";
import RanuraFoto from "../RanuraFoto";
import PieFranja from "../PieFranja";

/** Las seis referencias del mosaico, en el orden en que ocupan sus huecos en la portada. */
const REFERENCIAS = [
  "Horizontal 3:2 (≈1100 × 730 px)",
  "Panorámica 3:1 (≈1000 × 320 px)",
  "Horizontal 3:2 (≈1100 × 730 px)",
  "Horizontal 16:9 (≈1000 × 720 px)",
  "Horizontal 2:1 (≈1000 × 560 px)",
  "Vertical 3:4 (≈900 × 1350 px)",
] as const;

/** Mosaico de obras: seis fotos, cada una con la proporción fija de su hueco en el diseño. */
export default function FranjaMosaico({
  inicial,
  medios,
  esAdmin,
  hayHistorial,
}: {
  inicial: PortadaMosaico;
  medios: Medio[];
  esAdmin: boolean;
  hayHistorial: number;
}) {
  const f = usarFranja("portada.mosaico", inicial, hayHistorial);

  return (
    <section className="space-y-5">
      {f.valor.fotos.map((foto, i) => (
        <RanuraFoto
          key={i}
          etiqueta={`Obra ${i + 1}`}
          valor={foto}
          medios={medios}
          esAdmin={esAdmin}
          referencia={REFERENCIAS[i]}
          alCambiar={(nueva) =>
            f.fijar({ ...f.valor, fotos: f.valor.fotos.map((x, j) => (j === i ? nueva : x)) })
          }
        />
      ))}

      <PieFranja
        clave="portada.mosaico"
        ancla="#por-antioquia"
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
