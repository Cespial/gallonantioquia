"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ConfigTipo } from "@/lib/admin/tipos";
import type { Contenido, Medio } from "@/db/esquema";
import { generarSlug } from "@/lib/admin/slug";
import { guardarContenido } from "@/lib/contenidos/acciones";
import EditorTexto from "./EditorTexto";
import CamposExtra from "./CamposExtra";
import SelectorImagen from "./SelectorImagen";

/** Hoy, en formato AAAA-MM-DD y en hora local, para estrenar el formulario. */
function hoy(): string {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

export default function FormularioContenido({
  config,
  contenido,
  medios,
  esAdmin,
}: {
  config: ConfigTipo;
  contenido: Contenido | null;
  medios: Medio[];
  esAdmin: boolean;
}) {
  const router = useRouter();
  const [pendiente, iniciar] = useTransition();
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [aviso, setAviso] = useState("");

  const [titulo, setTitulo] = useState(contenido?.titulo ?? "");
  const [slug, setSlug] = useState(contenido?.slug ?? "");
  // Mientras nadie toque el slug a mano, sigue al título. En un contenido ya
  // guardado no se toca: cambiarlo rompería el enlace que ya está publicado.
  const [slugManual, setSlugManual] = useState(Boolean(contenido));
  const [resumen, setResumen] = useState(contenido?.resumen ?? "");
  const [cuerpoHtml, setCuerpoHtml] = useState(contenido?.cuerpoHtml ?? "");
  const [fecha, setFecha] = useState(contenido?.fecha ?? hoy());
  const [categoria, setCategoria] = useState(contenido?.categoria ?? "");
  const [destacado, setDestacado] = useState(contenido?.destacado ?? false);
  const [orden, setOrden] = useState(String(contenido?.orden ?? 0));
  const [imagenId, setImagenId] = useState(contenido?.imagenId ?? "");
  const [extra, setExtra] = useState<Record<string, unknown>>(
    (contenido?.extra as Record<string, unknown>) ?? {}
  );

  const publicado = contenido?.estado === "publicado";

  function alCambiarTitulo(valor: string) {
    setTitulo(valor);
    if (!slugManual) setSlug(generarSlug(valor));
  }

  function guardar(estado: "borrador" | "publicado") {
    const datos = new FormData();
    datos.set("titulo", titulo);
    datos.set("slug", slug);
    datos.set("resumen", resumen);
    datos.set("cuerpoHtml", cuerpoHtml);
    datos.set("fecha", fecha);
    datos.set("categoria", categoria);
    datos.set("estado", estado);
    datos.set("destacado", String(destacado));
    datos.set("orden", orden);
    datos.set("imagenId", imagenId);
    datos.set("extra", JSON.stringify(extra));

    setErrores({});
    setAviso("");

    iniciar(async () => {
      const r = await guardarContenido(config.tipo, contenido?.id ?? null, datos);

      if (!r.ok) {
        setErrores(r.errores);
        return;
      }

      setAviso(estado === "publicado" ? "Publicado. Ya se ve en el sitio." : "Borrador guardado.");

      if (!contenido) {
        router.replace(`/admin/${config.rutaAdmin}/${r.id}`);
      }
      router.refresh();
    });
  }

  const claseCampo = (campo: string) =>
    `w-full rounded-lg border px-3 py-2 ${errores[campo] ? "border-red-700" : "border-borde"}`;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        guardar(publicado ? "publicado" : "borrador");
      }}
      className="max-w-3xl space-y-6"
    >
      {errores.general && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {errores.general}
        </p>
      )}
      {aviso && (
        <p role="status" className="rounded-lg bg-verde-suave p-3 text-sm text-verde-antioquia">
          {aviso}
        </p>
      )}

      <div>
        <label htmlFor="titulo" className="block text-sm font-medium mb-1">
          Título <span className="text-red-700">*</span>
        </label>
        <input
          id="titulo"
          value={titulo}
          onChange={(e) => alCambiarTitulo(e.target.value)}
          className={claseCampo("titulo")}
        />
        {errores.titulo && (
          <p role="alert" className="mt-1 text-xs text-red-700">
            {errores.titulo}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium mb-1">
          Dirección en el sitio
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-texto-terciario whitespace-nowrap">
            {config.rutaPublica}/
          </span>
          <input
            id="slug"
            value={slug}
            onChange={(e) => {
              setSlugManual(true);
              setSlug(e.target.value);
            }}
            className={claseCampo("slug")}
          />
        </div>
        <p className="mt-1 text-xs text-texto-terciario">
          Se arma solo con el título. Si ya está publicada, cambiarla rompe el enlace que
          circule por ahí.
        </p>
        {errores.slug && (
          <p role="alert" className="mt-1 text-xs text-red-700">
            {errores.slug}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="resumen" className="block text-sm font-medium mb-1">
          Resumen
        </label>
        <textarea
          id="resumen"
          rows={3}
          value={resumen}
          onChange={(e) => setResumen(e.target.value)}
          className={claseCampo("resumen")}
        />
        <p className="mt-1 text-xs text-texto-terciario">
          Es lo que se lee en los listados y al compartir el enlace. Hasta 600 caracteres.
        </p>
        {errores.resumen && (
          <p role="alert" className="mt-1 text-xs text-red-700">
            {errores.resumen}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fecha" className="block text-sm font-medium mb-1">
            Fecha <span className="text-red-700">*</span>
          </label>
          <input
            id="fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className={claseCampo("fecha")}
          />
          {errores.fecha && (
            <p role="alert" className="mt-1 text-xs text-red-700">
              {errores.fecha}
            </p>
          )}
        </div>

        {config.taxonomia && (
          <div>
            <label htmlFor="categoria" className="block text-sm font-medium mb-1">
              {config.taxonomia.etiqueta} <span className="text-red-700">*</span>
            </label>
            <select
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className={claseCampo("categoria")}
            >
              <option value="">Elige una opción</option>
              {config.taxonomia.valores.map((valor) => (
                <option key={valor} value={valor}>
                  {valor}
                </option>
              ))}
            </select>
            {errores.categoria && (
              <p role="alert" className="mt-1 text-xs text-red-700">
                {errores.categoria}
              </p>
            )}
          </div>
        )}

        {config.ordenPor === "orden" && (
          <div>
            <label htmlFor="orden" className="block text-sm font-medium mb-1">
              Posición
            </label>
            <input
              id="orden"
              type="number"
              min={0}
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className={claseCampo("orden")}
            />
            <p className="mt-1 text-xs text-texto-terciario">
              El número más bajo aparece primero.
            </p>
          </div>
        )}

        <div className="sm:col-span-2">
          <SelectorImagen
            medios={medios}
            valor={imagenId}
            esAdmin={esAdmin}
            alCambiar={setImagenId}
          />
          {errores.imagenId && (
            <p role="alert" className="mt-1 text-xs text-red-700">
              {errores.imagenId}
            </p>
          )}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={destacado}
          onChange={(e) => setDestacado(e.target.checked)}
        />
        Destacar en el sitio
      </label>

      <CamposExtra
        campos={config.camposExtra}
        valores={extra}
        errores={errores}
        alCambiar={(nombre, valor) => setExtra((previo) => ({ ...previo, [nombre]: valor }))}
      />

      {config.usaCuerpo && (
        <div>
          <span className="block text-sm font-medium mb-1">Cuerpo</span>
          <EditorTexto valorInicial={contenido?.cuerpoHtml ?? ""} alCambiar={setCuerpoHtml} />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-borde pt-4">
        <button
          type="button"
          disabled={pendiente}
          onClick={() => guardar("borrador")}
          className="rounded-lg border border-borde px-4 py-2 text-sm font-medium disabled:opacity-60"
        >
          Guardar borrador
        </button>

        <button
          type="button"
          disabled={pendiente}
          onClick={() => guardar(publicado ? "borrador" : "publicado")}
          className="rounded-lg bg-verde-antioquia px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {publicado ? "Despublicar" : "Publicar"}
        </button>

        {pendiente && <span className="text-sm text-texto-secundario">Guardando…</span>}
      </div>
    </form>
  );
}
