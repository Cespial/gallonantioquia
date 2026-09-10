"use client";

import type { Medio } from "@/db/esquema";
import type { PortadaHero } from "@/lib/ajustes/portada";
import { usarFranja } from "../usarFranja";
import CampoTexto from "../CampoTexto";
import RanuraFoto from "../RanuraFoto";
import PieFranja from "../PieFranja";

/** Lo primero que se ve al entrar: la palabra grande, la bajada y las dos fotos. */
export default function FranjaHero({
  inicial,
  medios,
  esAdmin,
  hayHistorial,
}: {
  inicial: PortadaHero;
  medios: Medio[];
  esAdmin: boolean;
  hayHistorial: number;
}) {
  const f = usarFranja("portada.hero", inicial, hayHistorial);

  return (
    <section className="space-y-5">
      <CampoTexto
        id="hero-palabra"
        etiqueta="Palabra grande"
        valor={f.valor.palabra}
        max={30}
        alCambiar={(v) => f.fijar({ ...f.valor, palabra: v })}
      />
      <CampoTexto
        id="hero-subtitulo"
        etiqueta="Subtítulo"
        valor={f.valor.subtitulo}
        max={220}
        multilinea
        ayuda="Debajo de la palabra grande. Un salto de línea aquí es un salto en escritorio."
        alCambiar={(v) => f.fijar({ ...f.valor, subtitulo: v })}
      />
      <RanuraFoto
        etiqueta="Retrato"
        valor={f.valor.retrato}
        medios={medios}
        esAdmin={esAdmin}
        referencia="Persona recortada sobre fondo transparente (PNG o WebP con alfa), ≈1200 × 1240 px. Sin recorte, saldrá un rectángulo sobre el paisaje."
        alCambiar={(foto) => f.fijar({ ...f.valor, retrato: foto })}
      />
      <RanuraFoto
        etiqueta="Paisaje de fondo"
        valor={f.valor.fondo}
        medios={medios}
        esAdmin={esAdmin}
        referencia="Horizontal, ≥1920 × 1080 px. La portada le pone un velo verde encima."
        alCambiar={(foto) => f.fijar({ ...f.valor, fondo: foto })}
      />
      <PieFranja
        clave="portada.hero"
        ancla="#inicio"
        pendiente={f.pendiente}
        hayHistorial={f.hayHistorial}
        alGuardar={f.guardar}
        alDeshacer={f.deshacer}
        alRestaurar={f.restaurar}
        mensaje={f.mensaje}
        error={f.error}
      />
    </section>
  );
}
