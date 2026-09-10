"use client";

import type { TodosLosAjustes } from "@/lib/ajustes";
import ListaEditable from "../ListaEditable";
import { usarPestana } from "./usarPestana";
import { Avisos, BotonGuardar } from "./comunes";

/** Los enlaces del encabezado. Solo administradores. */
export default function PestanaMenu({ ajustes }: { ajustes: TodosLosAjustes }) {
  const { valores, fijar, guardar, mensaje, error, pendiente } = usarPestana(ajustes);

  return (
    <>
      <Avisos mensaje={mensaje} error={error} />

      <section className="space-y-6">
        <div>
          <span className="block text-sm font-medium mb-2">Menú</span>
          <ListaEditable
            campos={[
              { nombre: "etiqueta", etiqueta: "Texto del enlace" },
              { nombre: "destino", etiqueta: "Dirección" },
              { nombre: "visible", etiqueta: "Visible", tipo: "checkbox" },
            ]}
            valores={
              valores["navegacion.menu"] as {
                etiqueta: string;
                destino: string;
                visible: boolean;
              }[]
            }
            alCambiar={(nuevos) => fijar("navegacion.menu", nuevos)}
            etiquetaAgregar="Agregar enlace"
            filaNueva={() => ({ etiqueta: "", destino: "/", visible: true })}
          />
        </div>

        <BotonGuardar pendiente={pendiente} onClick={() => guardar(["navegacion.menu"])} />
      </section>
    </>
  );
}
