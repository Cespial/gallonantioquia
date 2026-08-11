import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { listarPublicados, obtenerPublicado } from "@/lib/contenidos/cacheadas";
import { aProyecto } from "@/lib/contenidos/adaptadores";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const proyectos = await listarPublicados("proyecto");
  return proyectos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const fila = await obtenerPublicado("proyecto", params.slug);
  if (!fila) return { title: "Proyecto no encontrado" };

  return {
    title: `${fila.titulo} — Proyectos`,
    description: fila.resumen ?? undefined,
    openGraph: fila.imagenUrl ? { images: [{ url: fila.imagenUrl }] } : undefined,
  };
}

export default async function PaginaProyecto({ params }: Props) {
  const fila = await obtenerPublicado("proyecto", params.slug);
  if (!fila) notFound();

  const proyecto = aProyecto(fila);

  return (
    <article>
      <div className="relative h-64 lg:h-80">
        <Image
          src={proyecto.imagen}
          alt={fila.imagenAlt ?? ""}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-campana-profundo/55" />

        <div className="absolute inset-0 mx-auto flex max-w-[1400px] flex-col justify-end px-5 pb-8 lg:px-10">
          {proyecto.categoria && (
            <span className="inline-block w-fit rounded bg-campana-dorado px-3 py-1 font-campana text-[10px] font-bold uppercase tracking-wide text-white">
              {proyecto.categoria}
            </span>
          )}
          <h1 className="mt-3 font-campana text-3xl font-extrabold uppercase text-white lg:text-5xl">
            {proyecto.titulo}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-12 lg:px-10">
        <p className="font-campana text-lg font-semibold leading-snug text-campana-bosque">
          {proyecto.descripcion}
        </p>

        <div
          className="mt-6 font-campana text-[15px] leading-relaxed text-neutral-700 [&_p]:mb-4 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-campana-bosque [&_ul]:list-disc [&_ul]:pl-6 [&_a]:text-campana-hoja [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: proyecto.cuerpo }}
        />

        <Link
          href="/proyectos"
          className="mt-10 inline-block font-campana text-sm font-semibold text-campana-dorado"
        >
          ← Ver todos los proyectos
        </Link>
      </div>
    </article>
  );
}
