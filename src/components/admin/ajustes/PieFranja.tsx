"use client";

import { useState } from "react";
import type { ClavePortada } from "@/lib/ajustes/portada";
import { Avisos } from "./comunes";

/**
 * El pie de toda franja: guardar, deshacer, volver al diseño de lanzamiento y
 * un salto a ver el resultado en la portada.
 *
 * «Volver al original» pide confirmación en dos toques —como borrar un mensaje
 * o vaciar la papelera en el resto del panel— porque tira a la basura todo lo
 * que se haya escrito en esa franja, no solo el último cambio.
 */
export default function PieFranja({
  clave,
  ancla,
  pendiente,
  hayHistorial,
  alGuardar,
  alDeshacer,
  alRestaurar,
  mensaje,
  error,
}: {
  clave: ClavePortada;
  ancla: string;
  pendiente: boolean;
  hayHistorial: number;
  alGuardar: () => void;
  alDeshacer: () => void;
  alRestaurar: () => void;
  mensaje: string;
  error: string;
}) {
  const [confirmando, setConfirmando] = useState(false);
  // Los puntos de la clave no sirven dentro de un `id`: un selector CSS los lee
  // como clase y quien pruebe la pantalla no encontraría el botón.
  const idClave = clave.replace(/\./g, "-");

  return (
    <div className="mt-6 border-t border-borde pt-4">
      <Avisos mensaje={mensaje} error={error} />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <button
          id={`guardar-${idClave}`}
          type="button"
          disabled={pendiente}
          onClick={alGuardar}
          className="rounded-lg bg-verde-antioquia px-4 py-2 font-medium text-white disabled:opacity-60"
        >
          {pendiente ? "Guardando…" : "Guardar"}
        </button>

        <button
          type="button"
          disabled={pendiente || hayHistorial === 0}
          onClick={alDeshacer}
          className="rounded-lg border border-borde px-3 py-2 hover:border-verde-antioquia disabled:opacity-40"
        >
          Deshacer
        </button>

        {confirmando ? (
          <span className="inline-flex items-center gap-2">
            <span className="text-texto-secundario">¿Volver al diseño de lanzamiento?</span>
            <button
              type="button"
              disabled={pendiente}
              onClick={() => {
                setConfirmando(false);
                alRestaurar();
              }}
              className="font-medium text-red-700 disabled:opacity-60"
            >
              Sí, volver
            </button>
            <button
              type="button"
              onClick={() => setConfirmando(false)}
              className="text-texto-secundario"
            >
              Cancelar
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmando(true)}
            className="text-texto-secundario hover:text-red-700"
          >
            Volver al original
          </button>
        )}

        <a
          href={`/${ancla}`}
          target="_blank"
          rel="noreferrer"
          className="ml-auto text-verde-antioquia underline"
        >
          Ver la portada
        </a>
      </div>
    </div>
  );
}
