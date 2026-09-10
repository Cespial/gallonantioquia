"use client";

import type { Medio } from "@/db/esquema";
import type { PortadaPerfil } from "@/lib/ajustes/portada";
import { usarFranja } from "../usarFranja";
import CampoTexto from "../CampoTexto";
import ListaVinetas from "../ListaVinetas";
import RanuraFoto from "../RanuraFoto";
import PieFranja from "../PieFranja";

/** «Soy Horacio Gallón»: la presentación, en dos columnas de semblanza. */
export default function FranjaPerfil({
  inicial,
  medios,
  esAdmin,
  hayHistorial,
}: {
  inicial: PortadaPerfil;
  medios: Medio[];
  esAdmin: boolean;
  hayHistorial: number;
}) {
  const f = usarFranja("portada.perfil", inicial, hayHistorial);

  return (
    <section className="space-y-5">
      <CampoTexto
        id="perfil-antetitulo"
        etiqueta="Antetítulo"
        valor={f.valor.antetitulo}
        max={40}
        alCambiar={(v) => f.fijar({ ...f.valor, antetitulo: v })}
      />
      <CampoTexto
        id="perfil-nombre"
        etiqueta="Nombre grande"
        valor={f.valor.nombre}
        max={30}
        alCambiar={(v) => f.fijar({ ...f.valor, nombre: v })}
      />
      <CampoTexto
        id="perfil-frase"
        etiqueta="Frase dorada"
        valor={f.valor.frase}
        max={160}
        multilinea
        ayuda="Pon entre dos asteriscos lo que va en negrita: **así**. Un salto de línea es un salto en escritorio."
        alCambiar={(v) => f.fijar({ ...f.valor, frase: v })}
      />

      <div>
        <span className="block text-sm font-medium mb-2">Semblanza (columna clara)</span>
        <ListaVinetas
          valores={f.valor.semblanzaClara}
          max={4}
          multilinea
          etiquetaAgregar="Agregar párrafo"
          alCambiar={(v) => f.fijar({ ...f.valor, semblanzaClara: v })}
        />
      </div>

      <div>
        <span className="block text-sm font-medium mb-2">Semblanza (columna verde)</span>
        <ListaVinetas
          valores={f.valor.semblanzaVerde}
          max={4}
          multilinea
          etiquetaAgregar="Agregar párrafo"
          alCambiar={(v) => f.fijar({ ...f.valor, semblanzaVerde: v })}
        />
      </div>

      <RanuraFoto
        etiqueta="Foto del abrazo"
        valor={f.valor.abrazo}
        medios={medios}
        esAdmin={esAdmin}
        referencia="Persona recortada sobre fondo transparente (PNG o WebP con alfa), ≈1000 × 850 px. Sin recorte, saldrá un rectángulo sobre la banda."
        alCambiar={(foto) => f.fijar({ ...f.valor, abrazo: foto })}
      />

      <PieFranja
        clave="portada.perfil"
        ancla="#soy-gallon"
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
