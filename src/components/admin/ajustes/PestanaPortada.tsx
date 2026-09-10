"use client";

import { useState, type ComponentType } from "react";
import type { Medio } from "@/db/esquema";
import type { TodosLosAjustes } from "@/lib/ajustes";
import { FRANJAS, type ClavePortada } from "@/lib/ajustes/portada";
import FranjaHero from "./franjas/Hero";
import FranjaPerfil from "./franjas/Perfil";
import FranjaVideo from "./franjas/Video";
import FranjaConectamos from "./franjas/Conectamos";
import FranjaSumamos from "./franjas/Sumamos";
import FranjaMosaico from "./franjas/Mosaico";
import FranjaCaracter from "./franjas/Caracter";
import FranjaCafe from "./franjas/Cafe";
import FranjaBlog from "./franjas/Blog";
import FranjaPodcast from "./franjas/Podcast";
import FranjaEquipo from "./franjas/Equipo";
import FranjaCierre from "./franjas/Cierre";

/**
 * Lo que recibe el formulario de cualquier franja.
 *
 * `inicial` va como `any` a propósito: cada franja guarda una forma distinta
 * —el hero tiene fotos, carácter solo dos textos— y es cada formulario el que
 * la estrecha a su tipo en su propia firma. El mapa de abajo solo necesita
 * saber que todos se pintan igual.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PropsFranja = { inicial: any; medios: Medio[]; esAdmin: boolean; hayHistorial: number };

/** Las doce franjas de la portada, cada una con su formulario. */
const FORMULARIOS: Record<ClavePortada, ComponentType<PropsFranja>> = {
  "portada.hero": FranjaHero,
  "portada.perfil": FranjaPerfil,
  "portada.video": FranjaVideo,
  "portada.conectamos": FranjaConectamos,
  "portada.sumamos": FranjaSumamos,
  "portada.mosaico": FranjaMosaico,
  "portada.caracter": FranjaCaracter,
  "portada.cafe": FranjaCafe,
  "portada.blog": FranjaBlog,
  "portada.podcast": FranjaPodcast,
  "portada.equipo": FranjaEquipo,
  "portada.cierre": FranjaCierre,
};

/**
 * La portada, franja por franja, en el orden en que se ven al bajar por el
 * sitio. Cada franja es una sola clave de ajustes y se guarda entera: por eso
 * cada una tiene su propio Guardar, su propio Deshacer y su propio historial.
 */
export default function PestanaPortada({
  ajustes,
  medios,
  esAdmin,
  historial,
}: {
  ajustes: TodosLosAjustes;
  medios: Medio[];
  esAdmin: boolean;
  historial: Record<string, number>;
}) {
  const [activa, setActiva] = useState<ClavePortada>(FRANJAS[0].clave);
  const Formulario = FORMULARIOS[activa];

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <nav aria-label="Franjas de la portada" className="md:w-56 md:shrink-0">
        <ul className="space-y-1">
          {FRANJAS.map((franja) => (
            <li key={franja.clave}>
              <button
                type="button"
                aria-current={activa === franja.clave ? "true" : undefined}
                onClick={() => setActiva(franja.clave)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                  activa === franja.clave
                    ? "bg-verde-suave font-medium text-verde-antioquia"
                    : "text-texto-secundario hover:bg-arena"
                }`}
              >
                {franja.etiqueta}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-w-0 flex-1">
        {/* `key`: cambiar de franja tiene que estrenar el formulario, no
            heredar el estado del anterior. */}
        <Formulario
          key={activa}
          inicial={ajustes[activa]}
          medios={medios}
          esAdmin={esAdmin}
          hayHistorial={historial[activa] ?? 0}
        />
      </div>
    </div>
  );
}
