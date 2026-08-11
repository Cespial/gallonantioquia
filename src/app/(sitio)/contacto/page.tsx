import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import TituloPagina from "@/components/campana/TituloPagina";
import TeEscuchamos from "@/components/campana/TeEscuchamos";
import { leerAjustes } from "@/lib/ajustes/cacheadas";

export const metadata: Metadata = {
  title: "Contacto — Únete al equipo",
  description: "Escríbenos, súmate al equipo de campaña o cuéntanos tu propuesta.",
};

export default async function PaginaContacto() {
  const ajustes = await leerAjustes();

  const datos = [
    { icono: Mail, etiqueta: "Correo", valor: ajustes["contacto.email"], href: `mailto:${ajustes["contacto.email"]}` },
    { icono: Phone, etiqueta: "Teléfono", valor: ajustes["contacto.telefono"], href: `tel:${ajustes["contacto.telefono"].replace(/\s/g, "")}` },
    { icono: MapPin, etiqueta: "Dónde estamos", valor: ajustes["contacto.direccion"], href: null },
  ];

  return (
    <>
      <TituloPagina
        arriba="Únete al"
        abajo="Equipo"
        descripcion="Súmate a la campaña, propón, pregunta o invítanos a tu municipio."
      />

      <section className="mx-auto max-w-[1400px] px-5 py-14 lg:px-10">
        <ul className="grid gap-5 sm:grid-cols-3">
          {datos.map(({ icono: Icono, etiqueta, valor, href }) => (
            <li key={etiqueta} className="rounded-2xl border border-neutral-200 p-6">
              <Icono className="h-7 w-7 text-campana-hoja" strokeWidth={1.5} aria-hidden="true" />
              <p className="mt-4 font-campana text-xs font-bold uppercase tracking-wide text-neutral-500">
                {etiqueta}
              </p>
              {href ? (
                <a href={href} className="font-campana text-[15px] text-campana-bosque hover:underline">
                  {valor}
                </a>
              ) : (
                <p className="font-campana text-[15px] text-campana-bosque">{valor}</p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <TeEscuchamos municipios={ajustes["campana.municipios"]} />
    </>
  );
}
