"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { ConfigTipo } from "@/lib/admin/tipos";
import type { ContenidoConImagen } from "@/lib/contenidos/consultas";
import {
  cambiarEstadoContenido,
  borrarContenido,
  reordenarContenido,
} from "@/lib/contenidos/acciones";

const FORMATO_FECHA = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

/** La fecha llega como 'AAAA-MM-DD'; se parte a mano para no correrla un día
 *  por la zona horaria, que es lo que hace `new Date("2026-01-10")`. */
function fechaLegible(iso: string): string {
  const [anio, mes, dia] = iso.split("-").map(Number);
  return FORMATO_FECHA.format(new Date(anio, mes - 1, dia));
}

export default function FilaContenido({
  config,
  fila,
  onError,
}: {
  config: ConfigTipo;
  fila: ContenidoConImagen;
  onError: (mensaje: string) => void;
}) {
  const [confirmando, setConfirmando] = useState(false);
  const [pendiente, iniciar] = useTransition();

  function ejecutar(accion: () => Promise<{ ok: true } | { ok: false; error: string }>) {
    iniciar(async () => {
      const r = await accion();
      if (!r.ok) onError(r.error);
    });
  }

  const publicado = fila.estado === "publicado";

  return (
    <tr className="border-b border-borde/60 align-top">
      <td className="py-3 pr-4">
        <Link
          href={`/admin/${config.rutaAdmin}/${fila.id}`}
          className="font-medium text-texto-principal hover:text-verde-antioquia"
        >
          {fila.titulo}
        </Link>
        {fila.destacado && (
          <span className="ml-2 text-xs text-dorado-tierra">Destacada</span>
        )}
        <p className="text-xs text-texto-terciario mt-0.5">/{fila.slug}</p>
      </td>

      {config.taxonomia && (
        <td className="py-3 pr-4 text-texto-secundario">{fila.categoria ?? "—"}</td>
      )}

      <td className="py-3 pr-4 text-texto-secundario whitespace-nowrap">
        {fechaLegible(fila.fecha)}
      </td>

      <td className="py-3 pr-4">
        <span
          className={
            publicado
              ? "rounded-full bg-verde-suave px-2 py-0.5 text-xs text-verde-antioquia"
              : "rounded-full bg-arena px-2 py-0.5 text-xs text-texto-secundario"
          }
        >
          {publicado ? "Publicada" : "Borrador"}
        </span>
      </td>

      {config.ordenPor === "orden" && (
        <td className="py-3 pr-4 whitespace-nowrap">
          <button
            type="button"
            aria-label={`Subir ${fila.titulo}`}
            disabled={pendiente}
            onClick={() => ejecutar(() => reordenarContenido(fila.id, "arriba"))}
            className="rounded border border-borde px-2 py-0.5 hover:border-verde-antioquia disabled:opacity-60"
          >
            ↑
          </button>
          <button
            type="button"
            aria-label={`Bajar ${fila.titulo}`}
            disabled={pendiente}
            onClick={() => ejecutar(() => reordenarContenido(fila.id, "abajo"))}
            className="ml-1 rounded border border-borde px-2 py-0.5 hover:border-verde-antioquia disabled:opacity-60"
          >
            ↓
          </button>
        </td>
      )}

      <td className="py-3 whitespace-nowrap">
        <Link
          href={`/admin/${config.rutaAdmin}/${fila.id}`}
          className="text-sm text-texto-secundario hover:text-verde-antioquia"
        >
          Editar
        </Link>

        <button
          type="button"
          disabled={pendiente}
          onClick={() =>
            ejecutar(() =>
              cambiarEstadoContenido(fila.id, publicado ? "borrador" : "publicado")
            )
          }
          className="ml-4 text-sm text-texto-secundario hover:text-verde-antioquia disabled:opacity-60"
        >
          {publicado ? "Despublicar" : "Publicar"}
        </button>

        {confirmando ? (
          // Confirmación en línea: `window.confirm` bloquea el hilo y deja la
          // pestaña sin responder mientras el diálogo está abierto.
          <span className="ml-4 inline-flex items-center gap-2 text-sm">
            <span className="text-texto-secundario">¿Seguro?</span>
            <button
              type="button"
              disabled={pendiente}
              onClick={() => ejecutar(() => borrarContenido(fila.id))}
              className="font-medium text-red-700 disabled:opacity-60"
            >
              Sí, borrar
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
            className="ml-4 text-sm text-texto-secundario hover:text-red-700"
          >
            Borrar
          </button>
        )}
      </td>
    </tr>
  );
}
