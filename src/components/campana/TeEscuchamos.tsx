"use client";

import { useState, useTransition, type FormEvent } from "react";
import Image from "next/image";
import { Send } from "lucide-react";
import { enviarPropuesta } from "@/lib/campana/acciones";

export default function TeEscuchamos({ municipios }: { municipios: string[] }) {
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [enviado, setEnviado] = useState(false);
  const [pendiente, iniciar] = useTransition();

  function alEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formulario = e.currentTarget;
    const datos = new FormData(formulario);

    setErrores({});
    iniciar(async () => {
      const r = await enviarPropuesta(datos);
      if (r.ok) {
        formulario.reset();
        setEnviado(true);
      } else {
        setErrores(r.errores);
      }
    });
  }

  const campo = (nombre: string) =>
    `w-full rounded-lg border bg-white px-4 py-3 font-campana text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-campana-dorado ${
      errores[nombre] ? "border-red-500" : "border-neutral-200"
    }`;

  return (
    <section className="relative isolate overflow-hidden bg-campana-bosque py-16 lg:py-20">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
        <div>
          <h2 className="font-campana leading-none">
            <span className="block text-lg font-semibold uppercase tracking-wide text-white/70">
              Te
            </span>
            <span className="block text-4xl font-extrabold uppercase text-white lg:text-[3.2rem]">
              Escuchamos
            </span>
          </h2>

          <div className="mt-6 flex items-start gap-5">
            <p className="max-w-[10rem] font-campana text-sm leading-snug text-white/85">
              Tu voz es fundamental para construir la Antioquia que soñamos.
            </p>
            <Image
              src="/images/campana/mapa-antioquia.png"
              alt=""
              aria-hidden="true"
              width={648}
              height={685}
              sizes="(max-width: 1024px) 40vw, 20vw"
              className="h-auto w-40 opacity-90 lg:w-56"
            />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-xl lg:p-8">
          {enviado ? (
            <div role="status" className="py-10 text-center">
              <p className="font-campana text-xl font-bold text-campana-bosque">
                Gracias, recibimos tu propuesta.
              </p>
              <p className="mt-2 font-campana text-sm text-neutral-600">
                El equipo la lee y te responde al correo que dejaste.
              </p>
              <button
                type="button"
                onClick={() => setEnviado(false)}
                className="mt-6 font-campana text-sm font-semibold text-campana-dorado underline"
              >
                Enviar otra
              </button>
            </div>
          ) : (
            <form onSubmit={alEnviar} className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="nombre" className="sr-only">
                  Nombre completo
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  required
                  placeholder="Nombre completo"
                  className={campo("nombre")}
                />
                {errores.nombre && (
                  <p role="alert" className="mt-1 font-campana text-xs text-red-600">
                    {errores.nombre}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="municipio" className="sr-only">
                  Municipio
                </label>
                <select id="municipio" name="municipio" defaultValue="" className={campo("municipio")}>
                  <option value="">Selecciona tu municipio</option>
                  {municipios.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="email" className="sr-only">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Correo electrónico"
                  className={campo("email")}
                />
                {errores.email && (
                  <p role="alert" className="mt-1 font-campana text-xs text-red-600">
                    {errores.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="telefono" className="sr-only">
                  Teléfono
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  placeholder="Teléfono"
                  className={campo("telefono")}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="mensaje" className="sr-only">
                  Tu propuesta
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={4}
                  required
                  placeholder="Cuéntanos tu propuesta, idea o solicitud…"
                  className={campo("mensaje")}
                />
                {errores.mensaje && (
                  <p role="alert" className="mt-1 font-campana text-xs text-red-600">
                    {errores.mensaje}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={pendiente}
                className="sm:col-span-2 flex items-center justify-center gap-2 rounded-lg bg-campana-bosque px-6 py-3.5 font-campana text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-campana-hoja disabled:opacity-60"
              >
                {pendiente ? "Enviando…" : "Enviar propuesta"}
                {!pendiente && <Send className="h-4 w-4" aria-hidden="true" />}
              </button>

              <p className="sm:col-span-2 font-campana text-[11px] leading-snug text-neutral-500">
                Al enviar autorizas al equipo de campaña a tratar tus datos para responderte,
                conforme a la Ley 1581 de 2012. Puedes pedir su eliminación escribiendo al
                correo de contacto.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
