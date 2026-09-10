"use client";

import type { TodosLosAjustes } from "@/lib/ajustes";
import { usarPestana } from "./usarPestana";
import { Avisos, BotonGuardar, claseCampo } from "./comunes";

/** Correo, teléfono, WhatsApp y redes: lo que sale en el pie de todas las páginas. */
export default function PestanaContacto({ ajustes }: { ajustes: TodosLosAjustes }) {
  const { valores, fijar, guardar, mensaje, error, pendiente } = usarPestana(ajustes);

  return (
    <>
      <Avisos mensaje={mensaje} error={error} />

      <section className="space-y-6">
        <p className="rounded-lg bg-verde-suave p-3 text-sm text-verde-antioquia">
          Esto sale en el pie de todas las páginas y en el botón verde de WhatsApp que
          flota en la esquina. Revísalo bien: lo que quede aquí es a donde le va a
          escribir la gente.
        </p>

        <div>
          <label htmlFor="contactoEmail" className="block text-sm font-medium mb-1">
            Correo
          </label>
          <input
            id="contactoEmail"
            type="email"
            value={valores["contacto.email"]}
            onChange={(e) => fijar("contacto.email", e.target.value)}
            className={claseCampo}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contactoTelefono" className="block text-sm font-medium mb-1">
              Teléfono
            </label>
            <input
              id="contactoTelefono"
              value={valores["contacto.telefono"]}
              onChange={(e) => fijar("contacto.telefono", e.target.value)}
              placeholder="+57 300 000 0000"
              className={claseCampo}
            />
          </div>
          <div>
            <label htmlFor="contactoWhatsapp" className="block text-sm font-medium mb-1">
              WhatsApp
            </label>
            <input
              id="contactoWhatsapp"
              inputMode="numeric"
              value={valores["contacto.whatsapp"]}
              onChange={(e) => fijar("contacto.whatsapp", e.target.value)}
              placeholder="573000000000"
              className={claseCampo}
            />
            <p className="mt-1 text-xs text-texto-terciario">
              Solo números, con el 57 adelante y sin espacios ni signos. Déjalo en blanco
              para quitar el botón flotante del sitio.
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="contactoDireccion" className="block text-sm font-medium mb-1">
            Dirección
          </label>
          <input
            id="contactoDireccion"
            value={valores["contacto.direccion"]}
            onChange={(e) => fijar("contacto.direccion", e.target.value)}
            className={claseCampo}
          />
        </div>

        <div>
          <span className="block text-sm font-medium mb-2">Redes sociales</span>
          <p className="mb-3 text-xs text-texto-terciario">
            La dirección completa del perfil. La que quede en blanco no saca icono en el
            pie.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {(["instagram", "facebook", "x", "youtube", "tiktok"] as const).map((red) => (
              <div key={red}>
                <label
                  htmlFor={`red-${red}`}
                  className="block text-sm font-medium mb-1 capitalize"
                >
                  {red === "x" ? "X (Twitter)" : red}
                </label>
                <input
                  id={`red-${red}`}
                  value={valores["navegacion.redes"][red]}
                  onChange={(e) =>
                    fijar("navegacion.redes", {
                      ...valores["navegacion.redes"],
                      [red]: e.target.value,
                    })
                  }
                  placeholder="https://…"
                  className={claseCampo}
                />
              </div>
            ))}
          </div>
        </div>

        <BotonGuardar
          pendiente={pendiente}
          onClick={() =>
            guardar([
              "contacto.email",
              "contacto.telefono",
              "contacto.whatsapp",
              "contacto.direccion",
              "navegacion.redes",
            ])
          }
        />
      </section>
    </>
  );
}
