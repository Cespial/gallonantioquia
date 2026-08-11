import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TituloPagina from "@/components/campana/TituloPagina";
import { IconoEje } from "@/components/campana/iconos-eje";
import { listarPublicados } from "@/lib/contenidos/cacheadas";
import { aEje } from "@/lib/contenidos/adaptadores";

export const metadata: Metadata = {
  title: "Plan de Gobierno — Gallón Gobernador",
  description: "Los ejes estratégicos con los que trabajaremos por Antioquia.",
};

export default async function PaginaPlan() {
  const ejes = (await listarPublicados("eje")).map(aEje);

  return (
    <>
      <TituloPagina
        arriba="Plan de"
        abajo="Gobierno"
        descripcion="Seis ejes construidos escuchando a las comunidades de las nueve subregiones."
        tono="oscuro"
      />

      <section className="mx-auto max-w-[1400px] px-5 py-14 lg:px-10">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ejes.map((eje) => (
            <li key={eje.slug}>
              <Link
                href={`/plan-de-gobierno/${eje.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-neutral-200 p-7 transition-colors hover:border-campana-hoja"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-campana-bosque transition-colors group-hover:bg-campana-hoja">
                  <IconoEje nombre={eje.icono} className="h-7 w-7 text-white" />
                </span>

                <h2 className="mt-5 font-campana text-xl font-bold text-campana-bosque">
                  {eje.titulo}
                </h2>
                <p className="mt-2 grow font-campana text-sm leading-relaxed text-neutral-600">
                  {eje.descripcion}
                </p>

                <span className="mt-5 inline-flex items-center gap-1 font-campana text-[11px] font-bold uppercase tracking-wide text-campana-dorado group-hover:gap-2">
                  Ver el eje
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
