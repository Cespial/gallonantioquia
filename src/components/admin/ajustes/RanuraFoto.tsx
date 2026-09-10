"use client";

import type { Medio } from "@/db/esquema";
import type { Foto } from "@/lib/ajustes/foto";
import SelectorImagen from "../SelectorImagen";

/**
 * Una ranura de foto de la portada: qué se ve hoy, qué debería entrar ahí y el
 * selector de la biblioteca.
 *
 * `referencia` no es adorno: cada hueco de la portada tiene una forma —un
 * retrato recortado sobre transparente, un paisaje horizontal— y una foto con
 * la proporción equivocada se nota al instante en el sitio público. Decirlo
 * aquí evita tener que explicarlo por WhatsApp cada vez.
 *
 * La ranura guarda la instantánea completa (id, url, alt y medidas) para que
 * la portada pinte sin volver a consultar la biblioteca.
 */
export default function RanuraFoto({
  etiqueta,
  valor,
  referencia,
  medios,
  esAdmin,
  alCambiar,
}: {
  etiqueta: string;
  valor: Foto;
  referencia: string;
  medios: Medio[];
  esAdmin: boolean;
  alCambiar: (f: Foto) => void;
}) {
  // Las 13 fotos del diseño original se sembraron en la biblioteca (ver
  // `semilla-portada.ts`) pero la franja las guarda con `medioId` nulo, porque
  // su valor por defecto es anterior a la siembra. Sin este rescate por url,
  // el selector las daba por desconocidas: no mostraba la foto de hoy y el
  // botón decía «Elegir foto» en vez de «Cambiar». El texto de respaldo queda
  // solo para lo que de verdad no esté en la biblioteca.
  const seleccionada = valor.medioId ?? medios.find((m) => m.url === valor.url)?.id ?? "";

  return (
    <div className="rounded-card border border-borde p-3">
      <span className="block text-sm font-medium mb-2">{etiqueta}</span>

      <div className="flex items-start gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- panel interno */}
        <img
          src={valor.url}
          alt=""
          className="h-16 w-24 shrink-0 rounded object-cover bg-arena"
        />
        <div className="min-w-0 text-xs">
          <p className="text-texto-secundario">
            {valor.alt.trim() || "Sin descripción: la portada la necesita para los lectores de pantalla."}
          </p>
          <p className="mt-1 text-texto-terciario">{referencia}</p>
        </div>
      </div>

      <div className="mt-3">
        <SelectorImagen
          medios={medios}
          valor={seleccionada}
          esAdmin={esAdmin}
          etiqueta="Cambiar la foto"
          textoVacio="Foto original del diseño."
          permitirQuitar={false}
          alCambiar={(id) => {
            const medio = medios.find((m) => m.id === id);
            // Sin medio no hay nada que poner: la ranura no admite vacío —la
            // portada quedaría con un hueco—, así que se conserva la de hoy.
            if (!medio) return;
            alCambiar({
              medioId: medio.id,
              url: medio.url,
              alt: medio.alt ?? "",
              ancho: medio.ancho ?? null,
              alto: medio.alto ?? null,
            });
          }}
        />
      </div>
    </div>
  );
}
