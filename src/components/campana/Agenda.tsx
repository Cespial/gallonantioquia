"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import type { EventoAgenda } from "@/types";

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

/**
 * La fecha llega como 'AAAA-MM-DD' y se parte a mano. `new Date("2026-10-24")`
 * la interpreta en UTC y en Colombia mostraría el día anterior.
 */
function partes(iso: string) {
  const [anio, mes, dia] = iso.split("-").map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  return { mes: MESES[mes - 1] ?? "", dia: String(dia).padStart(2, "0"), semana: DIAS[fecha.getDay()] };
}

export default function Agenda({ eventos }: { eventos: EventoAgenda[] }) {
  const pista = useRef<HTMLUListElement>(null);
  const [indice, setIndice] = useState(0);

  function desplazar(direccion: -1 | 1) {
    const lista = pista.current;
    if (!lista) return;

    const tarjeta = lista.querySelector("li");
    const paso = tarjeta ? tarjeta.getBoundingClientRect().width + 16 : 216;
    lista.scrollBy({ left: paso * direccion, behavior: "smooth" });
  }

  function alDesplazar() {
    const lista = pista.current;
    if (!lista) return;
    const tarjeta = lista.querySelector("li");
    const paso = tarjeta ? tarjeta.getBoundingClientRect().width + 16 : 216;
    setIndice(Math.round(lista.scrollLeft / paso));
  }

  return (
    <div className="bg-campana-hueso px-5 py-11 lg:px-12 lg:py-12">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-campana leading-none">
          <span className="block text-lg font-semibold uppercase tracking-wide text-campana-hoja">
            Horario
          </span>
          <span className="block text-3xl font-extrabold uppercase text-campana-bosque lg:text-[2.6rem]">
            Gallón
          </span>
        </h2>

        <Link
          href="/horario"
          className="flex shrink-0 items-center gap-1.5 font-campana text-xs text-neutral-600 hover:text-campana-bosque"
        >
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          Ver agenda completa
        </Link>
      </div>

      {eventos.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center font-campana text-sm text-neutral-500">
          Todavía no hay eventos publicados en la agenda.
        </p>
      ) : (
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => desplazar(-1)}
            aria-label="Ver eventos anteriores"
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-white hover:text-campana-bosque sm:flex"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <ul
            ref={pista}
            onScroll={alDesplazar}
            className="flex flex-1 snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {eventos.map((evento) => {
              const { mes, dia, semana } = partes(evento.fecha);
              return (
                <li
                  key={evento.slug}
                  className="w-[12.5rem] shrink-0 snap-start rounded-2xl border border-neutral-200 bg-white p-4"
                >
                  <p className="inline-block overflow-hidden rounded-lg text-center leading-none">
                    <span className="block bg-campana-dorado px-3 py-1 font-campana text-[11px] font-bold uppercase text-white">
                      {mes}
                    </span>
                    <span className="block px-3 py-1.5 font-campana text-3xl font-extrabold text-campana-bosque">
                      {dia}
                    </span>
                  </p>

                  <p className="mt-3 font-campana text-base font-bold text-neutral-800">
                    {evento.municipio || evento.titulo}
                  </p>

                  <p className="mt-2.5 flex items-center gap-2 font-campana text-xs text-neutral-600">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {semana} · {evento.hora}
                  </p>
                  <p className="mt-1.5 flex items-center gap-2 font-campana text-xs text-neutral-600">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {evento.lugar}
                  </p>

                  <Link
                    href={evento.enlace || "/contacto"}
                    className="mt-5 inline-flex items-center gap-1 font-campana text-[11px] font-bold uppercase tracking-wide text-campana-dorado hover:gap-2"
                  >
                    Asistir
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={() => desplazar(1)}
            aria-label="Ver eventos siguientes"
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-white hover:text-campana-bosque sm:flex"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}

      {eventos.length > 1 && (
        <ul className="mt-4 flex justify-center gap-2" aria-hidden="true">
          {eventos.map((evento, i) => (
            <li
              key={evento.slug}
              className={`h-1.5 rounded-full transition-all ${
                i === indice ? "w-5 bg-campana-bosque" : "w-1.5 bg-neutral-300"
              }`}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
