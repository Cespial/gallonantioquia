"use client";

import { useState, useTransition, type ChangeEvent, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import type { Medio } from "@/db/esquema";
import { procesarImagen } from "@/lib/medios/procesar-imagen";
import { validarArchivo } from "@/lib/medios/reglas";
import { actualizarAlt, borrarMedio } from "@/lib/medios/acciones";

function pesoLegible(bytes: number | null): string {
  if (!bytes) return "";
  const kb = bytes / 1024;
  return kb < 1024 ? `${Math.round(kb)} KB` : `${(kb / 1024).toFixed(1)} MB`;
}

export default function BibliotecaMedios({
  filas,
  esAdmin,
  alElegir,
}: {
  filas: Medio[];
  esAdmin: boolean;
  /** Cuando la biblioteca se abre desde el selector de portada. */
  alElegir?: (medio: Medio) => void;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [subiendo, setSubiendo] = useState(false);
  const [arrastrando, setArrastrando] = useState(false);
  const [pendiente, iniciar] = useTransition();

  async function subir(archivos: FileList | null) {
    if (!archivos?.length) return;

    setError("");
    setSubiendo(true);

    try {
      for (const archivo of Array.from(archivos)) {
        const revision = validarArchivo({ tipo: archivo.type, tamano: archivo.size });
        if (!revision.ok) {
          setError(`${archivo.name}: ${revision.error}`);
          continue;
        }

        // Se comprime en el navegador: lo que viaja es el WebP, no el original.
        const procesado = await procesarImagen(archivo);

        await upload(procesado.name, procesado, {
          access: "public",
          handleUploadUrl: "/api/medios/subir",
          clientPayload: archivo.name,
        });
      }

      router.refresh();
    } catch {
      setError("No se pudo subir la imagen. Revisa la conexión e intenta de nuevo.");
    } finally {
      setSubiendo(false);
    }
  }

  function alSoltar(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setArrastrando(false);
    void subir(e.dataTransfer.files);
  }

  return (
    <div className="space-y-6">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setArrastrando(true);
        }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={alSoltar}
        className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-card border-2 border-dashed p-8 text-center ${
          arrastrando ? "border-verde-antioquia bg-verde-suave" : "border-borde"
        }`}
      >
        <span className="font-medium text-texto-principal">
          {subiendo ? "Subiendo…" : "Arrastra las fotos aquí o haz clic para elegirlas"}
        </span>
        <span className="text-xs text-texto-terciario">
          JPG, PNG, WebP o AVIF, hasta 10 MB. Se achican y convierten solas antes de subir.
        </span>
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="sr-only"
          onChange={(e: ChangeEvent<HTMLInputElement>) => void subir(e.target.files)}
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      {filas.length === 0 ? (
        <p className="rounded-card border border-dashed border-borde p-8 text-center text-texto-secundario">
          Todavía no hay fotos.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filas.map((medio) => (
            <li key={medio.id} className="rounded-card border border-borde p-3">
              {/* eslint-disable-next-line @next/next/no-img-element -- el panel
                  es interno y las URL de Blob no están en remotePatterns */}
              <img
                src={medio.url}
                alt={medio.alt ?? ""}
                className="mb-2 h-40 w-full rounded object-cover bg-arena"
              />

              <p className="truncate text-sm font-medium" title={medio.nombre}>
                {medio.nombre}
              </p>
              <p className="text-xs text-texto-terciario">
                {medio.ancho && medio.alto ? `${medio.ancho}×${medio.alto} · ` : ""}
                {pesoLegible(medio.pesoBytes)}
              </p>

              <label className="mt-2 block text-xs font-medium">
                Descripción de la foto
                <input
                  defaultValue={medio.alt ?? ""}
                  placeholder="Qué se ve en la foto"
                  onBlur={(e) => {
                    const valor = e.target.value;
                    if (valor === (medio.alt ?? "")) return;
                    iniciar(async () => {
                      const r = await actualizarAlt(medio.id, valor);
                      if (!r.ok) setError(r.error);
                    });
                  }}
                  className="mt-1 w-full rounded border border-borde px-2 py-1 text-sm font-normal"
                />
              </label>

              <div className="mt-2 flex items-center justify-between">
                {alElegir ? (
                  <button
                    type="button"
                    onClick={() => alElegir(medio)}
                    className="text-sm font-medium text-verde-antioquia"
                  >
                    Usar esta
                  </button>
                ) : (
                  <span />
                )}

                {esAdmin && (
                  <button
                    type="button"
                    disabled={pendiente}
                    onClick={() =>
                      iniciar(async () => {
                        const r = await borrarMedio(medio.id);
                        if (!r.ok) setError(r.error);
                      })
                    }
                    className="text-sm text-texto-secundario hover:text-red-700 disabled:opacity-60"
                  >
                    Borrar
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
