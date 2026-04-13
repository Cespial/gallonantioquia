import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import SectionWrapper from "@/components/layout/SectionWrapper";
import AuthorBioBox from "@/components/content/AuthorBioBox";
import ArticleNavigation from "@/components/content/ArticleNavigation";
import NewsletterCTA from "@/components/content/NewsletterCTA";
import { columnas } from "@/data/columnas";
import { columnasBodies } from "@/data/columnas-bodies";
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
  const body = columnasBodies[col.slug] || [];
  const hasBody = body.length > 0;

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
              {body.map((paragraph, i) => (
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

          <AuthorBioBox />

          <ArticleNavigation
            basePath="/columnas"
            prev={prevCol}
            next={nextCol}
          />

          <NewsletterCTA
            title="Recibe las columnas de Horacio"
            subtitle="Suscr&iacute;bete y recibir&aacute;s cada nueva columna directamente en tu correo."
          />
        </article>
      </SectionWrapper>
    </>
  );
}
