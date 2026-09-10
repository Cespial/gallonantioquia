"use client";

import type { TodosLosAjustes } from "@/lib/ajustes";
import ListaEditable from "../ListaEditable";
import { usarPestana } from "./usarPestana";
import { Avisos, BotonGuardar, claseCampo } from "./comunes";

/** La biografía y la trayectoria de /sobre-mi. Solo administradores. */
export default function PestanaSobreMi({ ajustes }: { ajustes: TodosLosAjustes }) {
  const { valores, fijar, guardar, mensaje, error, pendiente } = usarPestana(ajustes);

  return (
    <>
      <Avisos mensaje={mensaje} error={error} />

      <section className="space-y-6">
        <div>
          <label htmlFor="sobreTexto" className="block text-sm font-medium mb-1">
            Texto
          </label>
          <textarea
            id="sobreTexto"
            rows={8}
            value={valores["sobre.texto"]}
            onChange={(e) => fijar("sobre.texto", e.target.value)}
            className={claseCampo}
          />
        </div>

        <div>
          <span className="block text-sm font-medium mb-2">Trayectoria</span>
          <ListaEditable
            campos={[
              { nombre: "anio", etiqueta: "Año" },
              { nombre: "titulo", etiqueta: "Cargo o hito" },
              { nombre: "descripcion", etiqueta: "Descripción", tipo: "textarea" },
            ]}
            valores={
              valores["sobre.trayectoria"] as {
                anio: string;
                titulo: string;
                descripcion: string;
              }[]
            }
            alCambiar={(nuevos) => fijar("sobre.trayectoria", nuevos)}
            etiquetaAgregar="Agregar hito"
            filaNueva={() => ({ anio: "", titulo: "", descripcion: "" })}
          />
        </div>

        <BotonGuardar
          pendiente={pendiente}
          onClick={() => guardar(["sobre.texto", "sobre.trayectoria"])}
        />
      </section>
    </>
  );
}
