"use client";

import type { Medio } from "@/db/esquema";
import type { PortadaCafe } from "@/lib/ajustes/portada";
import { usarFranja } from "../usarFranja";
import ListaVinetas from "../ListaVinetas";
import RanuraFoto from "../RanuraFoto";
import PieFranja from "../PieFranja";

/** Café Gallón: los párrafos que presentan el café y las dos fotos del recorrido. */
export default function FranjaCafe({
  inicial,
  medios,
  esAdmin,
  hayHistorial,
}: {
  inicial: PortadaCafe;
  medios: Medio[];
  esAdmin: boolean;
  hayHistorial: number;
}) {
  const f = usarFranja("portada.cafe", inicial, hayHistorial);

  return (
    <section className="space-y-5">
      <div>
        <span className="block text-sm font-medium mb-1">Párrafos</span>
        <p className="mb-2 text-xs text-texto-terciario">
          Pon entre dos asteriscos lo que va en negrita: **así**.
        </p>
        <ListaVinetas
          valores={f.valor.parrafos}
          max={4}
          multilinea
          etiquetaAgregar="Agregar párrafo"
          alCambiar={(v) => f.fijar({ ...f.valor, parrafos: v })}
        />
      </div>

      <RanuraFoto
        etiqueta="Foto apaisada"
        valor={f.valor.fotos[0]}
        medios={medios}
        esAdmin={esAdmin}
        referencia="Horizontal 4:3 (≈1920 × 1440 px)"
        alCambiar={(foto) =>
          f.fijar({ ...f.valor, fotos: f.valor.fotos.map((x, j) => (j === 0 ? foto : x)) })
        }
      />
      <RanuraFoto
        etiqueta="Foto vertical"
        valor={f.valor.fotos[1]}
        medios={medios}
        esAdmin={esAdmin}
        referencia="Vertical 3:4 (≈1280 × 1180 px); se recorta al centro-derecha."
        alCambiar={(foto) =>
          f.fijar({ ...f.valor, fotos: f.valor.fotos.map((x, j) => (j === 1 ? foto : x)) })
        }
      />

      <PieFranja
        clave="portada.cafe"
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
