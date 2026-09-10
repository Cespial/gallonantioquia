"use client";

import { claseCampo } from "./comunes";

/**
 * Un campo de texto de franja, con el tope de caracteres a la vista.
 *
 * El contador avisa, no bloquea: escribir de más queda en rojo y el guardado
 * lo rechaza en el servidor (los topes viven en el esquema de la franja). Si
 * cortáramos el tecleo, pegar un párrafo largo para luego recortarlo sería
 * imposible, y el equipo edita así.
 */
export default function CampoTexto({
  id,
  etiqueta,
  valor,
  max,
  multilinea,
  ayuda,
  alCambiar,
}: {
  id: string;
  etiqueta: string;
  valor: string;
  max: number;
  multilinea?: boolean;
  ayuda?: string;
  alCambiar: (v: string) => void;
}) {
  const quedan = max - valor.length;
  const excedido = quedan < 0;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {etiqueta}
      </label>

      {multilinea ? (
        <textarea
          id={id}
          rows={3}
          value={valor}
          onChange={(e) => alCambiar(e.target.value)}
          aria-describedby={`${id}-cuenta`}
          className={claseCampo}
        />
      ) : (
        <input
          id={id}
          value={valor}
          onChange={(e) => alCambiar(e.target.value)}
          aria-describedby={`${id}-cuenta`}
          className={claseCampo}
        />
      )}

      {ayuda && <p className="mt-1 text-xs text-texto-terciario">{ayuda}</p>}

      <p
        id={`${id}-cuenta`}
        className={`mt-1 text-xs ${excedido ? "text-red-700" : "text-texto-terciario"}`}
      >
        {excedido
          ? `Te pasaste por ${-quedan} caracteres: así no se va a guardar.`
          : `Quedan ${quedan} caracteres.`}
      </p>
    </div>
  );
}
