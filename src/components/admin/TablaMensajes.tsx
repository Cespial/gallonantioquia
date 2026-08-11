"use client";

import { useState, useTransition } from "react";
import type { Mensaje } from "@/db/esquema";
import { marcarLeido, borrarMensaje } from "@/lib/campana/acciones-panel";

const FORMATO = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default function TablaMensajes({ filas }: { filas: Mensaje[] }) {
  const [error, setError] = useState("");
  const [confirmando, setConfirmando] = useState<string | null>(null);
  const [pendiente, iniciar] = useTransition();

  if (filas.length === 0) {
    return (
      <p className="rounded-card border border-dashed border-borde p-8 text-center text-texto-secundario">
        Todavía no ha llegado ninguna propuesta.
      </p>
    );
  }

  function ejecutar(accion: () => Promise<{ ok: true } | { ok: false; error: string }>) {
    setError("");
    iniciar(async () => {
      const r = await accion();
      if (!r.ok) setError(r.error);
    });
  }

  return (
    <div className="space-y-4">
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <ul className="space-y-3">
        {filas.map((fila) => (
          <li
            key={fila.id}
            className={`rounded-card border p-4 ${
              fila.leido ? "border-borde bg-white" : "border-verde-antioquia/40 bg-verde-suave/30"
            }`}
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-medium text-texto-principal">{fila.nombre}</span>
              <a href={`mailto:${fila.email}`} className="text-sm text-verde-antioquia underline">
                {fila.email}
              </a>
              {fila.telefono && (
                <span className="text-sm text-texto-secundario">{fila.telefono}</span>
              )}
              {fila.municipio && (
                <span className="rounded-full bg-arena px-2 py-0.5 text-xs text-texto-secundario">
                  {fila.municipio}
                </span>
              )}
              <span className="ml-auto text-xs text-texto-terciario">
                {FORMATO.format(fila.creadoEn)}
              </span>
            </div>

            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-texto-secundario">
              {fila.mensaje}
            </p>

            <div className="mt-3 flex items-center gap-4 text-sm">
              <button
                type="button"
                disabled={pendiente}
                onClick={() => ejecutar(() => marcarLeido(fila.id, !fila.leido))}
                className="text-texto-secundario hover:text-verde-antioquia disabled:opacity-60"
              >
                {fila.leido ? "Marcar sin leer" : "Marcar como leída"}
              </button>

              {confirmando === fila.id ? (
                <span className="inline-flex items-center gap-2">
                  <span className="text-texto-secundario">¿Borrar definitivamente?</span>
                  <button
                    type="button"
                    disabled={pendiente}
                    onClick={() => ejecutar(() => borrarMensaje(fila.id))}
                    className="font-medium text-red-700 disabled:opacity-60"
                  >
                    Sí, borrar
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmando(null)}
                    className="text-texto-secundario"
                  >
                    Cancelar
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmando(fila.id)}
                  className="text-texto-secundario hover:text-red-700"
                >
                  Borrar
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
