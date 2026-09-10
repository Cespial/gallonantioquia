"use client";

import type { TodosLosAjustes } from "@/lib/ajustes";
import { usarPestana } from "./usarPestana";
import { Avisos, BotonGuardar, claseCampo } from "./comunes";

/** Solo administradores: apagar el sitio es la palanca más grande del panel. */
export default function PestanaEstadoSitio({ ajustes }: { ajustes: TodosLosAjustes }) {
  const { valores, fijar, guardar, mensaje, error, pendiente } = usarPestana(ajustes);

  return (
    <>
      <Avisos mensaje={mensaje} error={error} />

      <section className="space-y-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={valores["sitio.enConstruccion"]}
            onChange={(e) => fijar("sitio.enConstruccion", e.target.checked)}
          />
          <span className="font-medium">Modo construcción</span>
        </label>
        <p className="text-sm text-texto-secundario">
          Con el modo construcción encendido, los visitantes solo ven el mensaje de abajo. El
          resto del sitio queda oculto.
        </p>

        <div>
          <label htmlFor="mensaje" className="block text-sm font-medium mb-1">
            Mensaje que se muestra
          </label>
          <textarea
            id="mensaje"
            rows={3}
            value={valores["sitio.mensajeConstruccion"]}
            onChange={(e) => fijar("sitio.mensajeConstruccion", e.target.value)}
            className={claseCampo}
          />
        </div>

        <BotonGuardar
          pendiente={pendiente}
          onClick={() => guardar(["sitio.enConstruccion", "sitio.mensajeConstruccion"])}
        />
      </section>
    </>
  );
}
