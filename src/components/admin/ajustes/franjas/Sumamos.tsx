"use client";

import type { Medio } from "@/db/esquema";
import type { PortadaSumamos } from "@/lib/ajustes/portada";
import { usarFranja } from "../usarFranja";
import CampoTexto from "../CampoTexto";
import ListaVinetas from "../ListaVinetas";
import RanuraFoto from "../RanuraFoto";
import PieFranja from "../PieFranja";

/** «Sumamos esfuerzos»: las dos listas de logros —obras y emergencias— y el retrato que señala. */
export default function FranjaSumamos({
  inicial,
  medios,
  esAdmin,
  hayHistorial,
}: {
  inicial: PortadaSumamos;
  medios: Medio[];
  esAdmin: boolean;
  hayHistorial: number;
}) {
  const f = usarFranja("portada.sumamos", inicial, hayHistorial);

  return (
    <section className="space-y-5">
      <CampoTexto
        id="sumamos-titular1"
        etiqueta="Titular 1"
        valor={f.valor.titular1}
        max={120}
        multilinea
        ayuda="Un salto de línea es un salto en escritorio."
        alCambiar={(v) => f.fijar({ ...f.valor, titular1: v })}
      />
      <CampoTexto
        id="sumamos-bajada1"
        etiqueta="Bajada 1"
        valor={f.valor.bajada1}
        max={200}
        multilinea
        ayuda="Un salto de línea es un salto en escritorio."
        alCambiar={(v) => f.fijar({ ...f.valor, bajada1: v })}
      />

      <div>
        <span className="block text-sm font-medium mb-2">Obras estratégicas</span>
        <ListaVinetas
          valores={f.valor.obras}
          max={8}
          etiquetaAgregar="Agregar obra estratégica"
          alCambiar={(v) => f.fijar({ ...f.valor, obras: v })}
        />
      </div>

      <CampoTexto
        id="sumamos-titular2"
        etiqueta="Titular 2"
        valor={f.valor.titular2}
        max={120}
        multilinea
        alCambiar={(v) => f.fijar({ ...f.valor, titular2: v })}
      />
      <CampoTexto
        id="sumamos-bajada2"
        etiqueta="Bajada 2"
        valor={f.valor.bajada2}
        max={200}
        multilinea
        alCambiar={(v) => f.fijar({ ...f.valor, bajada2: v })}
      />

      <div>
        <span className="block text-sm font-medium mb-2">Frentes de emergencia</span>
        <ListaVinetas
          valores={f.valor.emergencias}
          max={10}
          etiquetaAgregar="Agregar frente de emergencia"
          alCambiar={(v) => f.fijar({ ...f.valor, emergencias: v })}
        />
      </div>

      <RanuraFoto
        etiqueta="Retrato que señala"
        valor={f.valor.retrato}
        medios={medios}
        esAdmin={esAdmin}
        referencia="Persona recortada sobre fondo transparente (PNG o WebP con alfa), ≈1400 × 1230 px. Sin recorte, saldrá un rectángulo sobre la crema."
        alCambiar={(foto) => f.fijar({ ...f.valor, retrato: foto })}
      />

      <PieFranja
        clave="portada.sumamos"
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
