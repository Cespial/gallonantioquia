import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import TituloPagina from "@/components/campana/TituloPagina";
import { IconoEje } from "@/components/campana/iconos-eje";
import { listarPublicados, obtenerPublicado } from "@/lib/contenidos/cacheadas";
import { aEje } from "@/lib/contenidos/adaptadores";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const ejes = await listarPublicados("eje");
  return ejes.map((eje) => ({ slug: eje.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const fila = await obtenerPublicado("eje", params.slug);
  if (!fila) return { title: "Eje no encontrado" };

  return {
    title: `${fila.titulo} — Plan de Gobierno`,
    description: fila.resumen ?? undefined,
  };
}

export default async function PaginaEje({ params }: Props) {
  const fila = await obtenerPublicado("eje", params.slug);
  if (!fila) notFound();

  const eje = aEje(fila);

  return (
    <>
      <TituloPagina arriba="Plan de Gobierno" abajo={eje.titulo} tono="oscuro" />

      <article className="mx-auto max-w-3xl px-5 py-14 lg:px-10">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-campana-bosque">
          <IconoEje nombre={eje.icono} className="h-8 w-8 text-white" />
        </span>

        <p className="mt-6 font-campana text-lg font-semibold leading-snug text-campana-bosque">
          {eje.descripcion}
        </p>

        <div
          className="mt-6 font-campana text-[15px] leading-relaxed text-neutral-700 [&_p]:mb-4 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-campana-bosque [&_ul]:list-disc [&_ul]:pl-6 [&_a]:text-campana-hoja [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: eje.cuerpo }}
        />

        <Link
          href="/plan-de-gobierno"
          className="mt-10 inline-block font-campana text-sm font-semibold text-campana-dorado"
        >
          ← Ver todos los ejes
        </Link>
      </article>
    </>
  );
}
