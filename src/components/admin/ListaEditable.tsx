"use client";

export interface CampoLista {
  nombre: string;
  etiqueta: string;
  tipo?: "texto" | "numero" | "textarea" | "checkbox";
}

/**
 * Cifras, trayectoria y menú son la misma interacción con distintos campos:
 * una lista de filas que se agrega, se edita, se reordena y se quita.
 */
export default function ListaEditable<T extends Record<string, unknown>>({
  campos,
  valores,
  alCambiar,
  etiquetaAgregar,
  filaNueva,
}: {
  campos: CampoLista[];
  valores: T[];
  alCambiar: (nuevos: T[]) => void;
  etiquetaAgregar: string;
  filaNueva: () => T;
}) {
  function editar(indice: number, nombre: string, valor: unknown) {
    alCambiar(valores.map((fila, i) => (i === indice ? { ...fila, [nombre]: valor } : fila)));
  }

  function mover(indice: number, salto: -1 | 1) {
    const destino = indice + salto;
    if (destino < 0 || destino >= valores.length) return;

    const copia = [...valores];
    [copia[indice], copia[destino]] = [copia[destino], copia[indice]];
    alCambiar(copia);
  }

  return (
    <div className="space-y-3">
      {valores.length === 0 && (
        <p className="text-sm text-texto-secundario">Todavía no hay nada en esta lista.</p>
      )}

      {valores.map((fila, indice) => (
        <div key={indice} className="rounded-card border border-borde p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {campos.map((campo) => {
              const id = `lista-${campo.nombre}-${indice}`;
              const valor = fila[campo.nombre];

              return (
                <div
                  key={campo.nombre}
                  className={campo.tipo === "textarea" ? "sm:col-span-2" : ""}
                >
                  <label htmlFor={id} className="block text-xs font-medium mb-1">
                    {campo.etiqueta}
                  </label>

                  {campo.tipo === "textarea" ? (
                    <textarea
                      id={id}
                      rows={2}
                      value={String(valor ?? "")}
                      onChange={(e) => editar(indice, campo.nombre, e.target.value)}
                      className="w-full rounded-lg border border-borde px-3 py-2 text-sm"
                    />
                  ) : campo.tipo === "checkbox" ? (
                    <input
                      id={id}
                      type="checkbox"
                      checked={Boolean(valor)}
                      onChange={(e) => editar(indice, campo.nombre, e.target.checked)}
                    />
                  ) : (
                    <input
                      id={id}
                      type={campo.tipo === "numero" ? "number" : "text"}
                      value={String(valor ?? "")}
                      onChange={(e) =>
                        editar(
                          indice,
                          campo.nombre,
                          campo.tipo === "numero" ? Number(e.target.value) : e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-borde px-3 py-2 text-sm"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-2 flex items-center gap-3 text-xs">
            <button
              type="button"
              onClick={() => mover(indice, -1)}
              disabled={indice === 0}
              className="text-texto-secundario disabled:opacity-40"
            >
              ↑ Subir
            </button>
            <button
              type="button"
              onClick={() => mover(indice, 1)}
              disabled={indice === valores.length - 1}
              className="text-texto-secundario disabled:opacity-40"
            >
              ↓ Bajar
            </button>
            <button
              type="button"
              onClick={() => alCambiar(valores.filter((_, i) => i !== indice))}
              className="ml-auto text-texto-secundario hover:text-red-700"
            >
              Quitar
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => alCambiar([...valores, filaNueva()])}
        className="rounded-lg border border-borde px-3 py-1.5 text-sm hover:border-verde-antioquia"
      >
        {etiquetaAgregar}
      </button>
    </div>
  );
}
