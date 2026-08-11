"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ConfigTipo } from "@/lib/admin/tipos";
import type { ContenidoConImagen } from "@/lib/contenidos/consultas";
import FilaContenido from "./FilaContenido";

export default function ListadoContenidos({
  config,
  filas,
  filtroEstado,
  busqueda,
}: {
  config: ConfigTipo;
  filas: ContenidoConImagen[];
  filtroEstado: string;
  busqueda: string;
}) {
  const router = useRouter();
  const ruta = usePathname();
  const [texto, setTexto] = useState(busqueda);
  const [error, setError] = useState("");

  /** Los filtros viven en la URL: así el listado se puede compartir y el
   *  botón de atrás del navegador hace lo que uno espera. */
  function navegar(cambios: { estado?: string; q?: string }) {
    const parametros = new URLSearchParams();
    const estado = cambios.estado ?? filtroEstado;
    const q = cambios.q ?? texto;

    if (estado) parametros.set("estado", estado);
    if (q.trim()) parametros.set("q", q.trim());

    const cadena = parametros.toString();
    router.replace(cadena ? `${ruta}?${cadena}` : ruta);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="grow max-w-xs">
          <label htmlFor="busqueda" className="block text-sm font-medium mb-1">
            Buscar por título
          </label>
          <input
            id="busqueda"
            type="search"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") navegar({ q: e.currentTarget.value });
            }}
            onBlur={(e) => navegar({ q: e.currentTarget.value })}
            className="w-full rounded-lg border border-borde px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="estado" className="block text-sm font-medium mb-1">
            Estado
          </label>
          <select
            id="estado"
            value={filtroEstado}
            onChange={(e) => navegar({ estado: e.target.value })}
            className="rounded-lg border border-borde px-3 py-2"
          >
            <option value="">Todo</option>
            <option value="publicado">Publicado</option>
            <option value="borrador">Borrador</option>
          </select>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      {filas.length === 0 ? (
        <p className="rounded-card border border-dashed border-borde p-8 text-center text-texto-secundario">
          {busqueda || filtroEstado
            ? "Ningún resultado con esos filtros."
            : `No hay ${config.plural} todavía. Crea ${config.articulo} ${config.singular} con el botón de arriba.`}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-borde text-left text-texto-secundario">
                <th scope="col" className="py-2 pr-4 font-medium">
                  Título
                </th>
                {config.taxonomia && (
                  <th scope="col" className="py-2 pr-4 font-medium">
                    {config.taxonomia.etiqueta}
                  </th>
                )}
                <th scope="col" className="py-2 pr-4 font-medium">
                  Fecha
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  Estado
                </th>
                {config.ordenPor === "orden" && (
                  <th scope="col" className="py-2 pr-4 font-medium">
                    Orden
                  </th>
                )}
                <th scope="col" className="py-2 font-medium">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filas.map((fila) => (
                <FilaContenido
                  key={fila.id}
                  config={config}
                  fila={fila}
                  onError={setError}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
