"use client";

import { useState } from "react";
import type { Medio } from "@/db/esquema";
import type { TodosLosAjustes } from "@/lib/ajustes";
import PestanaContacto from "./PestanaContacto";
import PestanaEstadoSitio from "./PestanaEstadoSitio";
import PestanaMenu from "./PestanaMenu";
import PestanaPortada from "./PestanaPortada";
import PestanaSobreMi from "./PestanaSobreMi";

/**
 * El editor solo ve las dos primeras. No es cosmética: `guardarAjuste`
 * rechaza en el servidor cualquier clave fuera de `CLAVES_DE_EDITOR`, y esta
 * lista existe para que no se le ofrezca lo que igual le van a negar.
 */
const PESTANAS_DE_EDITOR = ["Portada", "Contacto y redes"] as const;
const PESTANAS_DE_ADMIN = ["Estado del sitio", "Sobre mí", "Menú del sitio"] as const;
const PESTANAS = [...PESTANAS_DE_EDITOR, ...PESTANAS_DE_ADMIN] as const;

/**
 * Solo la tira de pestañas y quién ve cuál: cada pestaña vive en su archivo,
 * con su propio estado y su propio guardado. Cuando estaban todas aquí, un
 * archivo de 500 líneas compartía un único `valores` y un único mensaje de
 * error, y la portada —doce franjas— no cabía sin volverlo inmanejable.
 */
export default function PestanasAjustes({
  esAdmin,
  ajustes,
  medios,
  historial,
}: {
  esAdmin: boolean;
  ajustes: TodosLosAjustes;
  medios: Medio[];
  /** Cuántas versiones anteriores tiene cada clave, para el botón «Deshacer». */
  historial: Record<string, number>;
}) {
  const visibles = esAdmin ? PESTANAS : PESTANAS_DE_EDITOR;
  const [activa, setActiva] = useState<(typeof PESTANAS)[number]>("Portada");

  return (
    <div className="max-w-3xl">
      <div role="tablist" aria-label="Secciones de ajustes" className="flex flex-wrap gap-1 border-b border-borde mb-6">
        {visibles.map((pestana) => (
          <button
            key={pestana}
            role="tab"
            type="button"
            aria-selected={activa === pestana}
            onClick={() => setActiva(pestana)}
            className={`px-3 py-2 text-sm ${
              activa === pestana
                ? "border-b-2 border-verde-antioquia font-medium text-texto-principal"
                : "text-texto-secundario"
            }`}
          >
            {pestana}
          </button>
        ))}
      </div>

      {activa === "Portada" && (
        <PestanaPortada
          ajustes={ajustes}
          medios={medios}
          esAdmin={esAdmin}
          historial={historial}
        />
      )}
      {activa === "Contacto y redes" && <PestanaContacto ajustes={ajustes} />}
      {activa === "Estado del sitio" && <PestanaEstadoSitio ajustes={ajustes} />}
      {activa === "Sobre mí" && <PestanaSobreMi ajustes={ajustes} />}
      {activa === "Menú del sitio" && <PestanaMenu ajustes={ajustes} />}
    </div>
  );
}
