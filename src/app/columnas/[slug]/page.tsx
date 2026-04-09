import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import SectionWrapper from "@/components/layout/SectionWrapper";
import NewsletterForm from "@/components/content/NewsletterForm";
import Button from "@/components/ui/Button";
import { columnas } from "@/data/columnas";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return columnas.map((col) => ({ slug: col.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const col = columnas.find((c) => c.slug === slug);

  if (!col) {
    return { title: "Columna no encontrada" };
  }

  return {
    title: `${col.title} — Columnas de Opinión`,
    description: col.excerpt,
  };
}

export default async function ColumnaDetailPage({ params }: Props) {
  const { slug } = await params;
  const colIndex = columnas.findIndex((c) => c.slug === slug);

  if (colIndex === -1) {
    notFound();
  }

  const col = columnas[colIndex];
  const prevCol = colIndex > 0 ? columnas[colIndex - 1] : null;
  const nextCol =
    colIndex < columnas.length - 1 ? columnas[colIndex + 1] : null;
  const { full: dateFormatted } = formatDate(col.date);
  const hasBody = col.body.length > 0;

  return (
    <>
      <PageHero
        title={col.title}
        label="Columna de Opinión"
        backgroundImage={col.image}
        backgroundPosition={col.image.includes("gallon") ? "top" : "center"}
      />

      <SectionWrapper>
        <article className="max-w-3xl mx-auto">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <time className="font-ui text-sm text-texto-terciario">
              {dateFormatted}
            </time>
            <span
              aria-hidden="true"
              className="w-1 h-1 rounded-full bg-texto-terciario/50"
            />
            <span className="font-ui text-sm text-texto-terciario">
              {col.readTime}
            </span>
            <span
              aria-hidden="true"
              className="w-1 h-1 rounded-full bg-texto-terciario/50"
            />
            <span className="font-ui text-sm text-dorado-tierra font-semibold">
              Al Poniente
            </span>
          </div>

          {/* Article body */}
          {hasBody ? (
            <div className="prose-editorial">
              {col.body.map((paragraph, i) => (
                <p
                  key={i}
                  className="font-body text-texto-principal text-lg leading-relaxed mb-6"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <div className="prose-editorial">
              <p className="font-body text-texto-principal text-lg leading-relaxed mb-6">
                {col.excerpt}
              </p>
              <div className="mt-8 p-6 bg-verde-suave rounded-card border border-borde/50 text-center">
                <p className="font-body text-texto-secundario mb-4">
                  Lee la columna completa en Al Poniente.
                </p>
                <a
                  href={col.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-heading font-bold text-sm tracking-label uppercase bg-dorado-tierra text-oscuro hover:brightness-110 transition-all duration-300"
                >
                  Leer en Al Poniente
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* Source link (always shown) */}
          <div className="mt-8 flex items-center gap-2">
            <a
              href={col.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-ui text-sm text-verde-antioquia hover:underline transition-colors"
            >
              Publicado originalmente en Al Poniente
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Author box */}
          <div className="mt-12 p-6 bg-verde-suave rounded-card border border-borde/50">
            <h3 className="font-heading font-bold text-lg text-texto-principal mb-2">
              Sobre Horacio Gall&oacute;n
            </h3>
            <p className="font-body text-sm text-texto-secundario leading-relaxed mb-4">
              Hijo de Andes, Suroeste antioque&ntilde;o. M&aacute;s de tres
              d&eacute;cadas al servicio de Antioquia. Exalcalde, exrepresentante
              a la C&aacute;mara y columnista en Al Poniente.
            </p>
            <Button href="/sobre" variant="secondary" size="sm">
              Conocer m&aacute;s
            </Button>
          </div>

          {/* Prev / Next navigation */}
          <nav className="flex justify-between items-center mt-12 pt-8 border-t border-borde">
            {prevCol ? (
              <Link
                href={`/columnas/${prevCol.slug}`}
                className="group font-ui text-sm text-texto-secundario hover:text-verde-antioquia transition-colors"
              >
                <span className="block text-xs uppercase tracking-label text-texto-terciario mb-1">
                  Anterior
                </span>
                <span className="group-hover:underline">
                  &larr; {prevCol.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {nextCol ? (
              <Link
                href={`/columnas/${nextCol.slug}`}
                className="group font-ui text-sm text-texto-secundario hover:text-verde-antioquia transition-colors text-right"
              >
                <span className="block text-xs uppercase tracking-label text-texto-terciario mb-1">
                  Siguiente
                </span>
                <span className="group-hover:underline">
                  {nextCol.title} &rarr;
                </span>
              </Link>
            ) : (
              <div />
            )}
          </nav>

          {/* Newsletter CTA */}
          <div className="mt-16 p-8 bg-oscuro-verde rounded-card text-center">
            <h3 className="font-display text-2xl text-white mb-2">
              Recibe las columnas de Horacio
            </h3>
            <p className="font-body text-sm text-white/70 mb-6">
              Suscr&iacute;bete y recibir&aacute;s cada nueva columna
              directamente en tu correo.
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterForm variant="dark" />
            </div>
          </div>
        </article>
      </SectionWrapper>
    </>
  );
}
