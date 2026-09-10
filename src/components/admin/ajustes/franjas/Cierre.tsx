"use client";

import type { Medio } from "@/db/esquema";
import type { PortadaCierre } from "@/lib/ajustes/portada";
import { usarFranja } from "../usarFranja";
import CampoTexto from "../CampoTexto";
import RanuraFoto from "../RanuraFoto";
import PieFranja from "../PieFranja";
import ListaEditable from "../../ListaEditable";

/** Cifras y cierre: los dos pictogramas, el mensaje final y el paisaje de fondo. */
export default function FranjaCierre({
  inicial,
  medios,
  esAdmin,
  hayHistorial,
}: {
  inicial: PortadaCierre;
  medios: Medio[];
  esAdmin: boolean;
  hayHistorial: number;
}) {
  const f = usarFranja("portada.cierre", inicial, hayHistorial);

  return (
    <section className="space-y-5">
      <div>
        <span className="block text-sm font-medium mb-2">Cifras</span>
        {/* Solo dos pictogramas caben en la franja (ver ICONOS en FranjaCifras.tsx del sitio
            público): un tercero no tiene dónde pintarse, por eso se apaga «Agregar» en 2. */}
        <ListaEditable
          campos={[
            { nombre: "valor", etiqueta: "Número", tipo: "numero" },
            { nombre: "sufijo", etiqueta: "Sufijo" },
            { nombre: "etiqueta", etiqueta: "Qué mide", tipo: "textarea" },
          ]}
          valores={f.valor.cifras}
          alCambiar={(v) => f.fijar({ ...f.valor, cifras: v })}
          etiquetaAgregar="Agregar cifra"
          agregarDeshabilitado={f.valor.cifras.length >= 2}
          filaNueva={() => ({ valor: 0, sufijo: "", etiqueta: "" })}
        />
      </div>

      <CampoTexto
        id="cierre-mensaje"
        etiqueta="Mensaje de cierre"
        valor={f.valor.mensaje}
        max={160}
        multilinea
        alCambiar={(v) => f.fijar({ ...f.valor, mensaje: v })}
      />

      <RanuraFoto
        etiqueta="Paisaje de fondo"
        valor={f.valor.fondo}
        medios={medios}
        esAdmin={esAdmin}
        referencia="Horizontal, ≥1920 × 1080 px. La franja le pone un velo verde oscuro encima."
        alCambiar={(foto) => f.fijar({ ...f.valor, fondo: foto })}
      />

      <PieFranja
        clave="portada.cierre"
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
