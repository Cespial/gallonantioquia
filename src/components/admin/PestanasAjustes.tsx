"use client";

import { useState, useTransition } from "react";
import type { Medio } from "@/db/esquema";
import type { TodosLosAjustes, ClaveAjuste, ValorDe } from "@/lib/ajustes";
import { guardarAjuste } from "@/lib/ajustes/acciones";
import ListaEditable from "./ListaEditable";
import SelectorImagen from "./SelectorImagen";

type Bitacora = { id: string; titulo: string };

const PESTANAS = [
  "Estado del sitio",
  "Portada",
  "Campaña",
  "Sobre mí",
  "Navegación y redes",
] as const;

export default function PestanasAjustes({
  ajustes,
  medios,
  bitacoras,
}: {
  ajustes: TodosLosAjustes;
  medios: Medio[];
  bitacoras: Bitacora[];
}) {
  const [activa, setActiva] = useState<(typeof PESTANAS)[number]>("Estado del sitio");
  const [valores, setValores] = useState(ajustes);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [pendiente, iniciar] = useTransition();

  function fijar<K extends ClaveAjuste>(clave: K, valor: ValorDe<K>) {
    setValores((previo) => ({ ...previo, [clave]: valor }));
  }

  /** Cada pestaña guarda solo sus claves, para no pisar lo que otro editó. */
  function guardar(claves: ClaveAjuste[]) {
    setMensaje("");
    setError("");

    iniciar(async () => {
      for (const clave of claves) {
        const r = await guardarAjuste(clave, valores[clave] as never);
        if (!r.ok) {
          setError(r.error);
          return;
        }
      }
      setMensaje("Guardado. El sitio ya muestra el cambio.");
    });
  }

  const claseCampo = "w-full rounded-lg border border-borde px-3 py-2";

  return (
    <div className="max-w-3xl">
      <div role="tablist" aria-label="Secciones de ajustes" className="flex flex-wrap gap-1 border-b border-borde mb-6">
        {PESTANAS.map((pestana) => (
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

      {error && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {mensaje && (
        <p role="status" className="mb-4 rounded-lg bg-verde-suave p-3 text-sm text-verde-antioquia">
          {mensaje}
        </p>
      )}

      {activa === "Estado del sitio" && (
        <section className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={valores["sitio.enConstruccion"]}
              onChange={(e) => fijar("sitio.enConstruccion", e.target.checked)}
            />
            <span className="font-medium">Modo construcción</span>
          </label>
          <p className="text-sm text-texto-secundario">
            Con el modo construcción encendido, los visitantes solo ven el mensaje de abajo. El
            resto del sitio queda oculto.
          </p>

          <div>
            <label htmlFor="mensaje" className="block text-sm font-medium mb-1">
              Mensaje que se muestra
            </label>
            <textarea
              id="mensaje"
              rows={3}
              value={valores["sitio.mensajeConstruccion"]}
              onChange={(e) => fijar("sitio.mensajeConstruccion", e.target.value)}
              className={claseCampo}
            />
          </div>

          <BotonGuardar
            pendiente={pendiente}
            onClick={() => guardar(["sitio.enConstruccion", "sitio.mensajeConstruccion"])}
          />
        </section>
      )}

      {activa === "Portada" && (
        <section className="space-y-6">
          <div>
            <label htmlFor="tituloHero" className="block text-sm font-medium mb-1">
              Título principal
            </label>
            <input
              id="tituloHero"
              value={valores["portada.tituloHero"]}
              onChange={(e) => fijar("portada.tituloHero", e.target.value)}
              className={claseCampo}
            />
          </div>

          <div>
            <label htmlFor="subtituloHero" className="block text-sm font-medium mb-1">
              Bajada
            </label>
            <textarea
              id="subtituloHero"
              rows={2}
              value={valores["portada.subtituloHero"]}
              onChange={(e) => fijar("portada.subtituloHero", e.target.value)}
              className={claseCampo}
            />
          </div>

          <div>
            <label htmlFor="reflexion" className="block text-sm font-medium mb-1">
              Reflexión destacada
            </label>
            <select
              id="reflexion"
              value={valores["portada.reflexionDestacada"] ?? ""}
              onChange={(e) => fijar("portada.reflexionDestacada", e.target.value || null)}
              className={claseCampo}
            >
              <option value="">Ninguna</option>
              {bitacoras.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.titulo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="block text-sm font-medium mb-2">Cifras de impacto</span>
            <ListaEditable
              campos={[
                { nombre: "valor", etiqueta: "Número", tipo: "numero" },
                { nombre: "sufijo", etiqueta: "Sufijo" },
                { nombre: "etiqueta", etiqueta: "Qué mide", tipo: "textarea" },
              ]}
              valores={valores["portada.cifras"] as { valor: number; sufijo: string; etiqueta: string }[]}
              alCambiar={(nuevos) => fijar("portada.cifras", nuevos)}
              etiquetaAgregar="Agregar cifra"
              filaNueva={() => ({ valor: 0, sufijo: "", etiqueta: "" })}
            />
          </div>

          <BotonGuardar
            pendiente={pendiente}
            onClick={() =>
              guardar([
                "portada.tituloHero",
                "portada.subtituloHero",
                "portada.reflexionDestacada",
                "portada.cifras",
              ])
            }
          />
        </section>
      )}

      {activa === "Campaña" && (
        <section className="space-y-6">
          <div>
            <label htmlFor="videoPerfil" className="block text-sm font-medium mb-1">
              Video de «Soy Horacio Gallón»
            </label>
            <input
              id="videoPerfil"
              value={valores["campana.videoPerfil"]}
              onChange={(e) => fijar("campana.videoPerfil", e.target.value)}
              placeholder="https://www.youtube.com/watch?v=…"
              className={claseCampo}
            />
            <p className="mt-1 text-xs text-texto-terciario">
              Pega el enlace tal como lo copias del navegador: sirve YouTube, youtu.be,
              un short o Vimeo. Mientras esté vacío, la portada muestra la pieza de
              campaña con el aviso «Video en camino».
            </p>
          </div>

          <div>
            <label htmlFor="podcast" className="block text-sm font-medium mb-1">
              Enlace del podcast
            </label>
            <input
              id="podcast"
              value={valores["campana.podcast"]}
              onChange={(e) => fijar("campana.podcast", e.target.value)}
              placeholder="https://www.youtube.com/@…"
              className={claseCampo}
            />
            <p className="mt-1 text-xs text-texto-terciario">
              Canal de YouTube, Spotify o donde vivan los episodios. Vacío = la sección
              dice que los primeros episodios vienen en camino.
            </p>
          </div>

          <div>
            <label htmlFor="subtituloHeroCampana" className="block text-sm font-medium mb-1">
              Bajada del hero
            </label>
            <textarea
              id="subtituloHeroCampana"
              rows={3}
              value={valores["campana.subtituloHero"]}
              onChange={(e) => fijar("campana.subtituloHero", e.target.value)}
              className={claseCampo}
            />
          </div>

          <div>
            <label htmlFor="frasePerfil" className="block text-sm font-medium mb-1">
              Frase dorada del perfil
            </label>
            <input
              id="frasePerfil"
              value={valores["campana.frasePerfil"]}
              onChange={(e) => fijar("campana.frasePerfil", e.target.value)}
              className={claseCampo}
            />
            <p className="mt-1 text-xs text-texto-terciario">
              Lo que va entre **dobles asteriscos** sale en negrita.
            </p>
          </div>

          <div>
            <label htmlFor="mensajeCierre" className="block text-sm font-medium mb-1">
              Mensaje de cierre (franja de cifras)
            </label>
            <textarea
              id="mensajeCierre"
              rows={3}
              value={valores["campana.mensajeCierre"]}
              onChange={(e) => fijar("campana.mensajeCierre", e.target.value)}
              className={claseCampo}
            />
          </div>

          <BotonGuardar
            pendiente={pendiente}
            onClick={() =>
              guardar([
                "campana.videoPerfil",
                "campana.podcast",
                "campana.subtituloHero",
                "campana.frasePerfil",
                "campana.mensajeCierre",
              ])
            }
          />
        </section>
      )}

      {activa === "Sobre mí" && (
        <section className="space-y-6">
          <div>
            <label htmlFor="sobreTexto" className="block text-sm font-medium mb-1">
              Texto
            </label>
            <textarea
              id="sobreTexto"
              rows={8}
              value={valores["sobre.texto"]}
              onChange={(e) => fijar("sobre.texto", e.target.value)}
              className={claseCampo}
            />
          </div>

          <div>
            <span className="block text-sm font-medium mb-2">Trayectoria</span>
            <ListaEditable
              campos={[
                { nombre: "anio", etiqueta: "Año" },
                { nombre: "titulo", etiqueta: "Cargo o hito" },
                { nombre: "descripcion", etiqueta: "Descripción", tipo: "textarea" },
              ]}
              valores={
                valores["sobre.trayectoria"] as {
                  anio: string;
                  titulo: string;
                  descripcion: string;
                }[]
              }
              alCambiar={(nuevos) => fijar("sobre.trayectoria", nuevos)}
              etiquetaAgregar="Agregar hito"
              filaNueva={() => ({ anio: "", titulo: "", descripcion: "" })}
            />
          </div>

          <BotonGuardar
            pendiente={pendiente}
            onClick={() => guardar(["sobre.texto", "sobre.trayectoria"])}
          />
        </section>
      )}

      {activa === "Navegación y redes" && (
        <section className="space-y-6">
          <div>
            <span className="block text-sm font-medium mb-2">Menú</span>
            <ListaEditable
              campos={[
                { nombre: "etiqueta", etiqueta: "Texto del enlace" },
                { nombre: "destino", etiqueta: "Dirección" },
                { nombre: "visible", etiqueta: "Visible", tipo: "checkbox" },
              ]}
              valores={
                valores["navegacion.menu"] as {
                  etiqueta: string;
                  destino: string;
                  visible: boolean;
                }[]
              }
              alCambiar={(nuevos) => fijar("navegacion.menu", nuevos)}
              etiquetaAgregar="Agregar enlace"
              filaNueva={() => ({ etiqueta: "", destino: "/", visible: true })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {(["x", "instagram", "youtube", "facebook", "tiktok"] as const).map((red) => (
              <div key={red}>
                <label htmlFor={`red-${red}`} className="block text-sm font-medium mb-1 capitalize">
                  {red === "x" ? "X (Twitter)" : red}
                </label>
                <input
                  id={`red-${red}`}
                  value={valores["navegacion.redes"][red]}
                  onChange={(e) =>
                    fijar("navegacion.redes", {
                      ...valores["navegacion.redes"],
                      [red]: e.target.value,
                    })
                  }
                  className={claseCampo}
                />
              </div>
            ))}
          </div>

          <BotonGuardar
            pendiente={pendiente}
            onClick={() => guardar(["navegacion.menu", "navegacion.redes"])}
          />
        </section>
      )}

      {activa === "Portada" && (
        <div className="mt-8 border-t border-borde pt-6">
          <SelectorImagen
            medios={medios}
            valor={medios.find((m) => m.url === valores["portada.imagenHero"])?.id ?? ""}
            esAdmin
            alCambiar={(id) => {
              const medio = medios.find((m) => m.id === id);
              fijar("portada.imagenHero", medio?.url ?? "");
            }}
          />
          <p className="mt-1 text-xs text-texto-terciario">
            Es la foto grande de la portada.
          </p>
          <BotonGuardar pendiente={pendiente} onClick={() => guardar(["portada.imagenHero"])} />
        </div>
      )}
    </div>
  );
}

function BotonGuardar({ pendiente, onClick }: { pendiente: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={pendiente}
      onClick={onClick}
      className="mt-4 rounded-lg bg-verde-antioquia px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
    >
      {pendiente ? "Guardando…" : "Guardar"}
    </button>
  );
}
