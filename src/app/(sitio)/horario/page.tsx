import type { Metadata } from "next";
import { Clock, MapPin } from "lucide-react";
import Link from "next/link";
import TituloPagina from "@/components/campana/TituloPagina";
import { listarPublicados } from "@/lib/contenidos/cacheadas";
import { aEvento } from "@/lib/contenidos/adaptadores";

export const metadata: Metadata = {
  title: "Horario Gallón — Agenda de la campaña",
  description: "Dónde y cuándo nos encontramos. Agenda de Gallón por los municipios de Antioquia.",
};

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function partes(iso: string) {
  const [anio, mes, dia] = iso.split("-").map(Number);
  return {
    mes: MESES[mes - 1] ?? "",
    dia: String(dia).padStart(2, "0"),
    semana: DIAS[new Date(anio, mes - 1, dia).getDay()],
    anio,
  };
}

export default async function PaginaHorario() {
  const todos = (await listarPublicados("evento")).map(aEvento);
  const hoy = new Date().toISOString().slice(0, 10);
  const proximos = todos.filter((e) => e.fecha >= hoy);
  const pasados = todos.filter((e) => e.fecha < hoy).reverse();

  return (
    <>
      <TituloPagina
        arriba="Horario"
        abajo="Gallón"
        descripcion="Dónde y cuándo nos encontramos. Si vas a asistir, avísanos y te esperamos."
      />

      <section className="mx-auto max-w-[1400px] px-5 py-14 lg:px-10">
        {proximos.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center font-campana text-neutral-500">
            No hay eventos programados por ahora. Vuelve pronto.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {proximos.map((evento) => {
              const { mes, dia, semana, anio } = partes(evento.fecha);
              return (
                <li
                  key={evento.slug}
                  className="rounded-2xl border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-md"
                >
                  <p className="inline-block overflow-hidden rounded-lg text-center leading-none">
                    <span className="block bg-campana-dorado px-3 py-1 font-campana text-[11px] font-bold uppercase text-white">
                      {mes} {anio}
                    </span>
                    <span className="block px-3 py-1.5 font-campana text-3xl font-extrabold text-campana-bosque">
                      {dia}
                    </span>
                  </p>

                  <h2 className="mt-4 font-campana text-xl font-bold text-neutral-900">
                    {evento.municipio || evento.titulo}
                  </h2>

                  <p className="mt-3 flex items-center gap-2 font-campana text-sm text-neutral-600">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    {semana} · {evento.hora}
                  </p>
                  <p className="mt-1.5 flex items-center gap-2 font-campana text-sm text-neutral-600">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    {evento.lugar}
                  </p>

                  <Link
                    href={evento.enlace || "/contacto"}
                    className="mt-5 inline-block rounded-full bg-campana-bosque px-5 py-2.5 font-campana text-[11px] font-bold uppercase tracking-wide text-white"
                  >
                    Quiero asistir
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {pasados.length > 0 && (
          <>
            <h2 className="mt-16 font-campana text-lg font-bold uppercase tracking-wide text-neutral-500">
              Ya nos vimos en
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {pasados.map((evento) => {
                const { mes, dia } = partes(evento.fecha);
                return (
                  <li
                    key={evento.slug}
                    className="rounded-full border border-neutral-200 px-4 py-1.5 font-campana text-sm text-neutral-600"
                  >
                    {evento.municipio} · {dia} {mes}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>
    </>
  );
}
