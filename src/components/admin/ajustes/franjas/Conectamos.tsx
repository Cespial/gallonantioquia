"use client";

import type { PortadaConectamos } from "@/lib/ajustes/portada";
import { usarFranja } from "../usarFranja";
import CampoTexto from "../CampoTexto";
import ListaVinetas from "../ListaVinetas";
import PieFranja from "../PieFranja";

/** «Así conectamos Antioquia»: el titular de tres líneas y las dos listas de logros. */
export default function FranjaConectamos({
  inicial,
  hayHistorial,
}: {
  inicial: PortadaConectamos;
  hayHistorial: number;
}) {
  const f = usarFranja("portada.conectamos", inicial, hayHistorial);

  return (
    <section className="space-y-5">
      <CampoTexto
        id="conectamos-linea1"
        etiqueta="Titular, línea 1"
        valor={f.valor.linea1}
        max={30}
        alCambiar={(v) => f.fijar({ ...f.valor, linea1: v })}
      />
      <CampoTexto
        id="conectamos-linea2"
        etiqueta="Titular, línea 2"
        valor={f.valor.linea2}
        max={30}
        alCambiar={(v) => f.fijar({ ...f.valor, linea2: v })}
      />
      <CampoTexto
        id="conectamos-linea3"
        etiqueta="Titular, línea 3"
        valor={f.valor.linea3}
        max={30}
        alCambiar={(v) => f.fijar({ ...f.valor, linea3: v })}
      />
      <CampoTexto
        id="conectamos-frase"
        etiqueta="Frase"
        valor={f.valor.frase}
        max={160}
        multilinea
        ayuda="Pon entre dos asteriscos lo que va en negrita: **así**. Un salto de línea es un salto en escritorio."
        alCambiar={(v) => f.fijar({ ...f.valor, frase: v })}
      />
      <CampoTexto
        id="conectamos-parrafo"
        etiqueta="Párrafo"
        valor={f.valor.parrafo}
        max={500}
        multilinea
        alCambiar={(v) => f.fijar({ ...f.valor, parrafo: v })}
      />
      <CampoTexto
        id="conectamos-significa-titulo"
        etiqueta="Título de «Esto significa»"
        valor={f.valor.significaTitulo}
        max={80}
        alCambiar={(v) => f.fijar({ ...f.valor, significaTitulo: v })}
      />

      <div>
        <span className="block text-sm font-medium mb-2">Beneficios</span>
        <ListaVinetas
          valores={f.valor.significa}
          max={8}
          etiquetaAgregar="Agregar beneficio"
          alCambiar={(v) => f.fijar({ ...f.valor, significa: v })}
        />
      </div>

      <CampoTexto
        id="conectamos-logramos-titulo"
        etiqueta="Título de «Logramos»"
        valor={f.valor.logramosTitulo}
        max={80}
        alCambiar={(v) => f.fijar({ ...f.valor, logramosTitulo: v })}
      />
      <CampoTexto
        id="conectamos-logramos-bajada"
        etiqueta="Bajada de «Logramos»"
        valor={f.valor.logramosBajada}
        max={200}
        multilinea
        ayuda="Un salto de línea es un salto en escritorio."
        alCambiar={(v) => f.fijar({ ...f.valor, logramosBajada: v })}
      />

      <div>
        <span className="block text-sm font-medium mb-2">Obras recuperadas</span>
        <ListaVinetas
          valores={f.valor.recuperadas}
          max={6}
          etiquetaAgregar="Agregar obra recuperada"
          alCambiar={(v) => f.fijar({ ...f.valor, recuperadas: v })}
        />
      </div>

      <PieFranja
        clave="portada.conectamos"
        ancla="#a-paso-firme"
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
