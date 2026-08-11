import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import TituloPagina from "@/components/campana/TituloPagina";
import { listarPublicados } from "@/lib/contenidos/cacheadas";
import { aColumna } from "@/lib/contenidos/adaptadores";
import { leerAjustes } from "@/lib/ajustes/cacheadas";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Quién es Gallón — A paso firme por Antioquia",
  description:
    "Horacio Gallón: de Andes, en el suroeste antioqueño, al servicio público. Su trayectoria y sus publicaciones.",
};

const NOTAS = [
  "Nací en Andes, en el suroeste antioqueño.",
  "Hago parte de una familia donde la disciplina, el valor de la palabra y el compromiso de comunidad no se negocian.",
  "He recorrido Antioquia escuchando a sus comunidades, municipio por municipio.",
];

export default async function PaginaQuienEs() {
  const [ajustes, columnas] = await Promise.all([
    leerAjustes(),
    listarPublicados("columna"),
  ]);

  const trayectoria = ajustes["sobre.trayectoria"];
  const ultimas = columnas.slice(0, 3).map(aColumna);

  return (
    <>
      <TituloPagina
        arriba="Quién es"
        abajo="Horacio Gallón"
        descripcion={ajustes["campana.frasePerfil"]}
      />

      <section className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 lg:grid-cols-[1fr_1.2fr] lg:px-10">
        <Image
          src="/images/campana/gallon-familia.webp"
          alt="Horacio Gallón junto a su familia"
          width={900}
          height={788}
          sizes="(max-width: 1024px) 90vw, 40vw"
          className="h-auto w-full object-contain"
        />

        <div>
          <ul className="space-y-4">
            {NOTAS.map((nota) => (
              <li key={nota} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-campana-hoja"
                >
                  <Check className="h-3 w-3 text-campana-hoja" strokeWidth={3} />
                </span>
                <span className="font-campana text-[15px] leading-relaxed text-neutral-700">
                  {nota}
                </span>
              </li>
            ))}
          </ul>

          {ajustes["sobre.texto"] && (
            <p className="mt-6 whitespace-pre-line font-campana text-[15px] leading-relaxed text-neutral-700">
              {ajustes["sobre.texto"]}
            </p>
          )}
        </div>
      </section>

      {trayectoria.length > 0 && (
        <section className="bg-campana-hueso py-14">
          <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
            <h2 className="font-campana text-2xl font-extrabold uppercase text-campana-bosque">
              Trayectoria
            </h2>

            <ol className="mt-8 space-y-6 border-l-2 border-campana-dorado/40 pl-6">
              {trayectoria.map((hito) => (
                <li key={`${hito.anio}-${hito.titulo}`} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[1.9rem] top-1.5 h-3 w-3 rounded-full bg-campana-dorado"
                  />
                  <p className="font-campana text-sm font-bold text-campana-dorado">{hito.anio}</p>
                  <p className="font-campana text-lg font-bold text-campana-bosque">{hito.titulo}</p>
                  <p className="mt-1 font-campana text-sm leading-relaxed text-neutral-600">
                    {hito.descripcion}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {ultimas.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-5 py-14 lg:px-10">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-campana leading-none">
              <span className="block text-lg font-semibold uppercase tracking-wide text-campana-dorado">
                Sus
              </span>
              <span className="block text-3xl font-extrabold uppercase text-campana-bosque">
                Publicaciones
              </span>
            </h2>
            <Link
              href="/columnas"
              className="shrink-0 font-campana text-xs text-neutral-600 hover:text-campana-bosque"
            >
              Ver las {columnas.length} columnas →
            </Link>
          </div>

          <ul className="mt-8 grid gap-5 sm:grid-cols-3">
            {ultimas.map((columna) => (
              <li key={columna.slug}>
                <Link
                  href={`/columnas/${columna.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-neutral-200 p-6 transition-colors hover:border-campana-hoja"
                >
                  <p className="font-campana text-xs text-neutral-500">
                    {formatDate(columna.date).full}
                  </p>
                  <h3 className="mt-2 grow font-campana text-[15px] font-bold leading-snug text-campana-bosque">
                    {columna.title}
                  </h3>
                  <span className="mt-4 inline-flex items-center gap-1 font-campana text-[11px] font-bold uppercase tracking-wide text-campana-dorado group-hover:gap-2">
                    Leer
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
