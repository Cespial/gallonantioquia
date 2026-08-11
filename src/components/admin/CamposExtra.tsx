"use client";

import type { CampoExtra } from "@/lib/admin/tipos";

type Valores = Record<string, unknown>;

export default function CamposExtra({
  campos,
  valores,
  errores,
  alCambiar,
}: {
  campos: CampoExtra[];
  valores: Valores;
  errores: Record<string, string>;
  alCambiar: (nombre: string, valor: unknown) => void;
}) {
  if (campos.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {campos.map((campo) => {
        const id = `extra-${campo.nombre}`;
        const error = errores[`extra.${campo.nombre}`];
        const valor = valores[campo.nombre];
        const clase = `w-full rounded-lg border px-3 py-2 ${
          error ? "border-red-700" : "border-borde"
        }`;

        return (
          <div key={campo.nombre} className={campo.control === "textarea" ? "sm:col-span-2" : ""}>
            <label htmlFor={id} className="block text-sm font-medium mb-1">
              {campo.etiqueta}
              {campo.obligatorio && <span className="text-red-700"> *</span>}
            </label>

            {campo.control === "textarea" ? (
              <textarea
                id={id}
                rows={3}
                value={String(valor ?? "")}
                onChange={(e) => alCambiar(campo.nombre, e.target.value)}
                className={clase}
              />
            ) : campo.control === "opcion" ? (
              <select
                id={id}
                value={String(valor ?? "")}
                onChange={(e) => alCambiar(campo.nombre, e.target.value)}
                className={clase}
              >
                <option value="">Elige una opción</option>
                {campo.opciones?.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            ) : campo.control === "multiple" ? (
              <fieldset id={id} className="flex flex-wrap gap-3 pt-1">
                <legend className="sr-only">{campo.etiqueta}</legend>
                {campo.opciones?.map((opcion) => {
                  const marcados = Array.isArray(valor) ? (valor as string[]) : [];
                  return (
                    <label key={opcion} className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={marcados.includes(opcion)}
                        onChange={(e) =>
                          alCambiar(
                            campo.nombre,
                            e.target.checked
                              ? [...marcados, opcion]
                              : marcados.filter((m) => m !== opcion)
                          )
                        }
                      />
                      {opcion}
                    </label>
                  );
                })}
              </fieldset>
            ) : (
              <input
                id={id}
                type={campo.control === "numero" ? "number" : campo.control === "url" ? "url" : "text"}
                value={String(valor ?? "")}
                onChange={(e) => alCambiar(campo.nombre, e.target.value)}
                className={clase}
              />
            )}

            {campo.ayuda && <p className="mt-1 text-xs text-texto-terciario">{campo.ayuda}</p>}
            {error && (
              <p role="alert" className="mt-1 text-xs text-red-700">
                {error}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
