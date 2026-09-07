"use client";

import { useState, useTransition, type FormEvent } from "react";
import type { Usuario } from "@/db/esquema";
import {
  invitarUsuario,
  cambiarRol,
  cambiarEstado,
  restablecerPasswordDeUsuario,
} from "@/lib/auth/acciones";
import { LARGO_MINIMO_PASSWORD } from "@/lib/auth/reglas";

const FORMATO_FECHA = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function fecha(valor: Date | null): string {
  return valor ? FORMATO_FECHA.format(valor) : "Nunca";
}

export default function TablaUsuarios({
  filas,
  actorId,
}: {
  filas: Usuario[];
  actorId: string;
}) {
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [restableciendo, setRestableciendo] = useState<string | null>(null);
  const [temporal, setTemporal] = useState("");
  const [pendiente, iniciar] = useTransition();

  /** Toda acción pasa por aquí: un solo sitio donde mostrar el error. */
  function ejecutar(accion: () => Promise<{ ok: true } | { ok: false; error: string }>) {
    setError("");
    setAviso("");
    iniciar(async () => {
      const r = await accion();
      if (!r.ok) setError(r.error);
    });
  }

  /**
   * La salida para quien olvidó su contraseña: hasta ahora la única forma era
   * entrar a la base de datos a mano. La temporal que se escriba aquí muere en
   * el primer ingreso de la persona.
   *
   * El campo va en la fila y no en un `window.prompt`: el diálogo del navegador
   * no se puede leer con lector de pantalla, no se estiliza y hay contextos
   * donde Chrome sencillamente no lo muestra.
   */
  function restablecer(id: string, nombre: string) {
    setError("");
    setAviso("");
    iniciar(async () => {
      const r = await restablecerPasswordDeUsuario(id, temporal);
      if (r.ok) {
        setTemporal("");
        setRestableciendo(null);
        setAviso(
          `Contraseña de ${nombre} restablecida. Pásasela por un medio seguro: al entrar, ` +
            "el panel la obliga a cambiarla."
        );
      } else {
        setError(r.error);
      }
    });
  }

  function alInvitar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formulario = e.currentTarget;
    const datos = new FormData(formulario);

    setError("");
    setAviso("");
    iniciar(async () => {
      const r = await invitarUsuario(datos);
      if (r.ok) {
        formulario.reset();
        setAviso(
          "Cuenta creada. Pásale la contraseña por un medio seguro: al entrar, el panel " +
            "la obliga a cambiarla y desde ahí solo la sabe ella."
        );
      } else {
        setError(r.error);
      }
    });
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={alInvitar}
        className="rounded-card border border-borde p-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:items-end"
      >
        <div className="lg:col-span-1">
          <label htmlFor="nombre" className="block text-sm font-medium mb-1">
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            required
            className="w-full rounded-lg border border-borde px-3 py-2"
          />
        </div>

        <div className="lg:col-span-1">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-borde px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Contraseña inicial
          </label>
          <input
            id="password"
            name="password"
            type="text"
            required
            minLength={10}
            className="w-full rounded-lg border border-borde px-3 py-2"
          />
          <p className="mt-1 text-xs text-texto-terciario">
            Diez caracteres como mínimo. Es temporal: al primer ingreso el panel obliga a
            cambiarla.
          </p>
        </div>

        <div>
          <label htmlFor="rol" className="block text-sm font-medium mb-1">
            Rol
          </label>
          <select
            id="rol"
            name="rol"
            defaultValue="editor"
            className="w-full rounded-lg border border-borde px-3 py-2"
          >
            <option value="editor">Editor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={pendiente}
          className="rounded-lg bg-verde-antioquia px-4 py-2 font-medium text-white disabled:opacity-60"
        >
          Crear cuenta
        </button>
      </form>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      {aviso && (
        <p role="status" className="text-sm text-verde-antioquia">
          {aviso}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-borde text-left text-texto-secundario">
              <th scope="col" className="py-2 pr-4 font-medium">
                Nombre
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Correo
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Rol
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Último acceso
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Estado
              </th>
              <th scope="col" className="py-2 font-medium">
                Contraseña
              </th>
            </tr>
          </thead>
          <tbody>
            {filas.map((fila) => (
              <tr key={fila.id} className="border-b border-borde/60">
                <td className="py-3 pr-4">
                  {fila.nombre}
                  {fila.id === actorId && (
                    <span className="ml-2 text-xs text-texto-terciario">(tú)</span>
                  )}
                </td>
                <td className="py-3 pr-4 text-texto-secundario">{fila.email}</td>
                <td className="py-3 pr-4">
                  <label className="sr-only" htmlFor={`rol-${fila.id}`}>
                    Rol de {fila.nombre}
                  </label>
                  <select
                    id={`rol-${fila.id}`}
                    value={fila.rol}
                    disabled={pendiente}
                    onChange={(e) =>
                      ejecutar(() => cambiarRol(fila.id, e.target.value as "admin" | "editor"))
                    }
                    className="rounded-lg border border-borde px-2 py-1"
                  >
                    <option value="editor">Editor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </td>
                <td className="py-3 pr-4 text-texto-secundario">{fecha(fila.ultimoAcceso)}</td>
                <td className="py-3 pr-4">
                  <button
                    type="button"
                    disabled={pendiente}
                    onClick={() => ejecutar(() => cambiarEstado(fila.id, !fila.activo))}
                    className="rounded-lg border border-borde px-3 py-1 hover:border-verde-antioquia disabled:opacity-60"
                  >
                    {fila.activo ? "Desactivar" : "Reactivar"}
                  </button>
                  {!fila.activo && (
                    <span className="ml-2 text-xs text-texto-terciario">Sin acceso</span>
                  )}
                </td>
                <td className="py-3">
                  {fila.id === actorId ? (
                    <span className="text-xs text-texto-terciario">
                      La tuya se cambia en «Mi cuenta»
                    </span>
                  ) : (
                    <>
                      {restableciendo === fila.id ? (
                        <span className="flex flex-wrap items-center gap-2">
                          <label className="sr-only" htmlFor={`temporal-${fila.id}`}>
                            Contraseña temporal para {fila.nombre}
                          </label>
                          <input
                            id={`temporal-${fila.id}`}
                            type="text"
                            autoFocus
                            value={temporal}
                            minLength={LARGO_MINIMO_PASSWORD}
                            placeholder={`Mínimo ${LARGO_MINIMO_PASSWORD} caracteres`}
                            onChange={(e) => setTemporal(e.target.value)}
                            className="w-52 rounded-lg border border-borde px-2 py-1"
                          />
                          <button
                            type="button"
                            disabled={pendiente || temporal.length < LARGO_MINIMO_PASSWORD}
                            onClick={() => restablecer(fila.id, fila.nombre)}
                            className="rounded-lg bg-verde-antioquia px-3 py-1 text-white disabled:opacity-60"
                          >
                            Guardar
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRestableciendo(null);
                              setTemporal("");
                            }}
                            className="text-texto-secundario hover:text-texto-principal"
                          >
                            Cancelar
                          </button>
                        </span>
                      ) : (
                        <>
                          <button
                            type="button"
                            disabled={pendiente}
                            onClick={() => {
                              setRestableciendo(fila.id);
                              setTemporal("");
                            }}
                            className="rounded-lg border border-borde px-3 py-1 hover:border-verde-antioquia disabled:opacity-60"
                          >
                            Restablecer
                          </button>
                          {fila.debeCambiarPassword && (
                            <span className="ml-2 text-xs text-texto-terciario">Sin estrenar</span>
                          )}
                        </>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
