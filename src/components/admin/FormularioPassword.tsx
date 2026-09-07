"use client";

import { useState, useTransition, type FormEvent } from "react";
import { cambiarMiPassword } from "@/lib/auth/acciones";
import { LARGO_MINIMO_PASSWORD } from "@/lib/auth/reglas";

export default function FormularioPassword({ obligatorio }: { obligatorio: boolean }) {
  const [error, setError] = useState("");
  const [listo, setListo] = useState(false);
  const [pendiente, iniciar] = useTransition();

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formulario = e.currentTarget;
    const datos = new FormData(formulario);
    setError("");
    setListo(false);

    iniciar(async () => {
      const r = await cambiarMiPassword(datos);
      if (r.ok) {
        formulario.reset();
        setListo(true);
        // Con el cambio obligatorio, la barra lateral y el resto del panel
        // estaban bloqueados: hay que repintar el layout para soltarlos.
        if (obligatorio) window.location.href = "/admin";
      } else {
        setError(r.error);
      }
    });
  }

  const campo = "w-full rounded-lg border border-borde px-3 py-2";

  return (
    <form onSubmit={enviar} className="max-w-md space-y-4">
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {listo && (
        <p role="status" className="rounded-lg bg-verde-suave p-3 text-sm text-verde-antioquia">
          Contraseña cambiada. La próxima vez entra con la nueva.
        </p>
      )}

      <div>
        <label htmlFor="actual" className="mb-1 block text-sm font-medium">
          Contraseña actual
        </label>
        <input
          id="actual"
          name="actual"
          type="password"
          required
          autoComplete="current-password"
          className={campo}
        />
      </div>

      <div>
        <label htmlFor="nueva" className="mb-1 block text-sm font-medium">
          Contraseña nueva
        </label>
        <input
          id="nueva"
          name="nueva"
          type="password"
          required
          minLength={LARGO_MINIMO_PASSWORD}
          autoComplete="new-password"
          className={campo}
        />
        <p className="mt-1 text-xs text-texto-terciario">
          Mínimo {LARGO_MINIMO_PASSWORD} caracteres. Que no sea una que uses en otro lado.
        </p>
      </div>

      <div>
        <label htmlFor="repetida" className="mb-1 block text-sm font-medium">
          Repite la contraseña nueva
        </label>
        <input
          id="repetida"
          name="repetida"
          type="password"
          required
          minLength={LARGO_MINIMO_PASSWORD}
          autoComplete="new-password"
          className={campo}
        />
      </div>

      <button
        type="submit"
        disabled={pendiente}
        className="rounded-lg bg-verde-antioquia px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {pendiente ? "Guardando…" : "Cambiar contraseña"}
      </button>
    </form>
  );
}
