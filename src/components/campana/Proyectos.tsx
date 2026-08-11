import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProyectoDestacado } from "@/types";

/** Cada categoría del mockup tiene su color de etiqueta. */
const COLOR: Record<string, string> = {
  Infraestructura: "bg-campana-hoja",
  Educación: "bg-campana-bosque",
  Campo: "bg-[#3f7d34]",
  Salud: "bg-campana-profundo",
};

export default function Proyectos({ proyectos }: { proyectos: ProyectoDestacado[] }) {
  if (proyectos.length === 0) return null;

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-campana leading-none">
            <span className="block text-lg font-semibold uppercase tracking-wide text-campana-dorado">
              Proyectos
            </span>
            <span className="block text-3xl font-extrabold uppercase text-campana-bosque lg:text-[2.8rem]">
              Destacados
            </span>
          </h2>

          <Link
            href="/proyectos"
            className="shrink-0 font-campana text-xs text-neutral-600 hover:text-campana-bosque"
          >
            Ver todos los proyectos →
          </Link>
        </div>

        <ul className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {proyectos.map((proyecto) => (
            <li
              key={proyecto.slug}
              className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg"
            >
              <Link href={`/proyectos/${proyecto.slug}`} className="block">
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={proyecto.imagen}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  {proyecto.categoria && (
                    <span
                      className={`inline-block rounded px-2.5 py-1 font-campana text-[10px] font-bold uppercase tracking-wide text-white ${
                        COLOR[proyecto.categoria] ?? "bg-campana-bosque"
                      }`}
                    >
                      {proyecto.categoria}
                    </span>
                  )}

                  <h3 className="mt-3 font-campana text-[15px] font-bold leading-snug text-neutral-900">
                    {proyecto.titulo}
                  </h3>
                  <p className="mt-1.5 font-campana text-[13px] leading-snug text-neutral-600">
                    {proyecto.descripcion}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1 font-campana text-[11px] font-bold uppercase tracking-wide text-campana-hoja group-hover:gap-2">
                    Conocer más
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
