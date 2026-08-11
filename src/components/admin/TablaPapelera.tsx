"use client";

import { useState, useTransition } from "react";
import { TIPOS } from "@/lib/admin/tipos";
import type { ContenidoConImagen } from "@/lib/contenidos/consultas";
import { restaurarContenido } from "@/lib/contenidos/acciones";

const FORMATO_FECHA = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default function TablaPapelera({ filas }: { filas: ContenidoConImagen[] }) {
  const [error, setError] = useState("");
  const [pendiente, iniciar] = useTransition();

  if (filas.length === 0) {
    return (
      <p className="rounded-card border border-dashed border-borde p-8 text-center text-texto-secundario">
        La papelera está vacía.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-borde text-left text-texto-secundario">
              <th scope="col" className="py-2 pr-4 font-medium">
                Título
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Sección
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Se borró
              </th>
              <th scope="col" className="py-2 font-medium">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filas.map((fila) => (
              <tr key={fila.id} className="border-b border-borde/60">
                <td className="py-3 pr-4">
                  <span className="font-medium text-texto-principal">{fila.titulo}</span>
                  <p className="text-xs text-texto-terciario mt-0.5">/{fila.slug}</p>
                </td>
                <td className="py-3 pr-4 text-texto-secundario">{TIPOS[fila.tipo].etiqueta}</td>
                <td className="py-3 pr-4 text-texto-secundario whitespace-nowrap">
                  {fila.eliminadoEn ? FORMATO_FECHA.format(fila.eliminadoEn) : "—"}
                </td>
                <td className="py-3">
                  <button
                    type="button"
                    disabled={pendiente}
                    onClick={() =>
                      iniciar(async () => {
                        const r = await restaurarContenido(fila.id);
                        if (!r.ok) setError(r.error);
                      })
                    }
                    className="rounded-lg border border-borde px-3 py-1 hover:border-verde-antioquia disabled:opacity-60"
                  >
                    Restaurar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
