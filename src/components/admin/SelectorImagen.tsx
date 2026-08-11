"use client";

import { useState } from "react";
import type { Medio } from "@/db/esquema";
import BibliotecaMedios from "./BibliotecaMedios";

export default function SelectorImagen({
  medios,
  valor,
  esAdmin,
  alCambiar,
}: {
  medios: Medio[];
  valor: string;
  esAdmin: boolean;
  alCambiar: (id: string) => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const [aviso, setAviso] = useState("");

  const elegida = medios.find((m) => m.id === valor) ?? null;

  function elegir(medio: Medio) {
    // Sin descripción no se usa como portada: la foto termina en el sitio
    // público, donde el texto alternativo es lo único que recibe quien navega
    // con lector de pantalla.
    if (!medio.alt?.trim()) {
      setAviso("Esta foto necesita una descripción antes de usarse como portada.");
      return;
    }
    setAviso("");
    alCambiar(medio.id);
    setAbierto(false);
  }

  return (
    <div>
      <span className="block text-sm font-medium mb-1">Foto de portada</span>

      <div className="flex items-center gap-3">
        {elegida ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- panel interno */}
            <img
              src={elegida.url}
              alt={elegida.alt ?? ""}
              className="h-16 w-24 rounded object-cover bg-arena"
            />
            <div className="min-w-0">
              <p className="truncate text-sm">{elegida.nombre}</p>
              <button
                type="button"
                onClick={() => alCambiar("")}
                className="text-xs text-texto-secundario hover:text-red-700"
              >
                Quitar portada
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-texto-secundario">Sin portada.</p>
        )}

        <button
          type="button"
          onClick={() => setAbierto(true)}
          className="ml-auto rounded-lg border border-borde px-3 py-1.5 text-sm hover:border-verde-antioquia"
        >
          {elegida ? "Cambiar" : "Elegir foto"}
        </button>
      </div>

      {abierto && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Elegir foto de portada"
            className="w-full max-w-4xl rounded-card bg-white p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl">Elegir foto de portada</h2>
              <button
                type="button"
                onClick={() => {
                  setAbierto(false);
                  setAviso("");
                }}
                className="text-sm text-texto-secundario hover:text-verde-antioquia"
              >
                Cerrar
              </button>
            </div>

            {aviso && (
              <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {aviso}
              </p>
            )}

            <BibliotecaMedios filas={medios} esAdmin={esAdmin} alElegir={elegir} />
          </div>
        </div>
      )}
    </div>
  );
}
