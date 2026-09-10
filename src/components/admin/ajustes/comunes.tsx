"use client";

/**
 * Las tres piezas que repetían las pestañas cuando vivían todas en un solo
 * archivo. Se extraen aquí para que partirlas no las duplique cuatro veces ni
 * las deje divergir: el borde de un campo y el texto de un botón tienen que
 * verse igual en «Contacto y redes» que en «Menú del sitio».
 */

/** Mismo borde y espaciado para todo campo de texto del panel. */
export const claseCampo = "w-full rounded-lg border border-borde px-3 py-2";

/**
 * El resultado del último guardado. Va arriba del formulario, donde estaba
 * cuando las pestañas compartían estado, para que el aviso caiga en el mismo
 * sitio de siempre.
 */
export function Avisos({ mensaje, error }: { mensaje: string; error: string }) {
  return (
    <>
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
    </>
  );
}

export function BotonGuardar({ pendiente, onClick }: { pendiente: boolean; onClick: () => void }) {
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
