"use client";

import ListaEditable from "../ListaEditable";

/**
 * Las viñetas de una franja son una lista de textos sueltos, no de objetos.
 * `ListaEditable` sabe editar, reordenar y quitar filas con varios campos, así
 * que aquí solo se traduce `string[]` ⇄ `{ texto }[]` para reutilizarla.
 *
 * Los topes no son cosmética: cada esquema de franja exige entre 1 y N ítems
 * —una lista vacía o de más rompe la composición de la portada—, así que
 * agregar se apaga en el tope y quitar el último se ignora.
 */
export default function ListaVinetas({
  valores,
  max,
  etiquetaAgregar,
  alCambiar,
  multilinea,
}: {
  valores: string[];
  max: number;
  etiquetaAgregar: string;
  alCambiar: (v: string[]) => void;
  multilinea?: boolean;
}) {
  return (
    <ListaEditable
      campos={[
        { nombre: "texto", etiqueta: "Texto", tipo: multilinea ? "textarea" : "texto" },
      ]}
      valores={valores.map((texto) => ({ texto }))}
      alCambiar={(filas) => {
        // Quitar la última viñeta dejaría la franja fuera de su esquema y el
        // guardado la rechazaría sin que se vea por qué: mejor no dejarla ir.
        if (filas.length === 0) return;
        if (filas.length > max) return;
        alCambiar(filas.map((f) => f.texto));
      }}
      etiquetaAgregar={etiquetaAgregar}
      agregarDeshabilitado={valores.length >= max}
      filaNueva={() => ({ texto: "" })}
    />
  );
}
