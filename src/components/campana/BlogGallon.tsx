import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PortadaSeccion from "./PortadaSeccion";
import { formatDate } from "@/lib/utils";

export type EntradaBlog = {
  slug: string;
  titulo: string;
  resumen: string;
  fecha: string;
  minutos: string;
};

/**
 * La puerta al blog desde la portada.
 *
 * Muestra las tres últimas columnas publicadas, no un resumen escrito a mano:
 * así la portada envejece sola cuando se publica una entrada nueva desde el
 * panel, sin que nadie tenga que acordarse de venir a cambiarla aquí.
 */
export default function BlogGallon({ entradas }: { entradas: EntradaBlog[] }) {
  return (
    <section id="blog" aria-labelledby="blog-titulo" className="bg-white">
      <PortadaSeccion
        id="blog-titulo"
        src="/images/campana/portada-blog.webp"
        titulo="Blog Gallón"
      />

      <div className="mx-auto w-[min(83.125rem,100%_-_2.5rem)] py-12 lg:py-14">
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-12">
          <div className="lg:max-w-[46rem]">
            <p className="titular-sin-balance font-campana text-2xl leading-[1.15] text-campana-dorado sm:text-3xl lg:text-[2.35rem]">
              Lo que pienso, <strong className="font-bold">escrito</strong>.
            </p>
            <p className="mt-5 font-campana text-[0.95rem] leading-[1.6] text-neutral-700 lg:mt-6 lg:text-[1rem]">
              Escribo para explicar decisiones, no para adornarlas. En estas columnas
              están las obras que destrabamos, los debates que dimos y las razones
              detrás de cada una: infraestructura, competitividad, territorio y la
              Antioquia que se construye a paso firme.
            </p>
          </div>

          {entradas.length > 0 && (
            <Link
              href="/columnas"
              className="mt-7 inline-flex shrink-0 items-center gap-2 rounded-full bg-campana-dorado-boton px-7 py-3 font-campana text-sm font-bold uppercase tracking-[0.04em] text-campana-profundo transition-transform hover:scale-[1.03] lg:mt-0"
            >
              Ver todas
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          )}
        </div>

        {entradas.length > 0 && (
          <ul className="mt-9 grid gap-5 md:grid-cols-3 lg:mt-10 lg:gap-6">
            {entradas.map((entrada) => (
              <li key={entrada.slug} className="flex">
                <Link
                  href={`/columnas/${entrada.slug}`}
                  className="group flex w-full flex-col rounded-2xl border border-campana-tinta/12 bg-campana-crema p-6 transition-shadow hover:shadow-[0_0.75rem_2rem_rgba(28,50,30,0.12)] lg:p-7"
                >
                  <p className="font-campana text-xs font-semibold uppercase tracking-[0.1em] text-campana-hoja">
                    {formatDate(entrada.fecha).full}
                    {entrada.minutos && (
                      <span className="text-neutral-500"> · {entrada.minutos}</span>
                    )}
                  </p>
                  <h3 className="titular-sin-balance mt-3 font-campana text-lg font-bold leading-[1.25] text-campana-tinta group-hover:text-campana-hoja lg:text-[1.28rem]">
                    {entrada.titulo}
                  </h3>
                  {entrada.resumen && (
                    <p className="mt-3 line-clamp-4 font-campana text-[0.9rem] leading-[1.55] text-neutral-600">
                      {entrada.resumen}
                    </p>
                  )}
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 font-campana text-sm font-semibold text-campana-hoja">
                    Leer
                    <ArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
