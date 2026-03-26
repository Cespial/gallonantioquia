import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import SectionWrapper from "@/components/layout/SectionWrapper";
import FadeIn from "@/components/animations/FadeIn";
import AuthorCard from "@/components/content/AuthorCard";
import PullQuote from "@/components/content/PullQuote";
import { guestColumns } from "@/data/content";

export const metadata: Metadata = {
  title: "Voces de Antioquia — Columnas invitadas",
  description:
    "Un espacio abierto para los lideres que piensan el futuro del departamento.",
};

export default function VocesPage() {
  const firstRow = guestColumns.slice(0, 2);
  const secondRow = guestColumns.slice(2, 4);
  const pullQuoteText = guestColumns[0]?.pullQuote;

  return (
    <>
      <PageHero
        title="Voces de Antioquia"
        subtitle="Un espacio abierto para los lideres que piensan el futuro del departamento."
      />

      <SectionWrapper>
        {/* First row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {firstRow.map((column, index) => (
            <FadeIn key={column.slug} delay={index * 100}>
              <AuthorCard
                authorName={column.authorName}
                authorRole={column.authorRole}
                authorCategory={column.authorCategory}
                authorImage={column.authorImage}
                title={column.title}
                excerpt={column.excerpt}
                date={column.date}
                slug={`/voces/${column.slug}`}
                pullQuote={column.pullQuote}
              />
            </FadeIn>
          ))}
        </div>

        {/* Pull quote between rows */}
        {pullQuoteText && (
          <FadeIn>
            <div className="my-8">
              <PullQuote
                quote={pullQuoteText}
                author={guestColumns[0].authorName}
              />
            </div>
          </FadeIn>
        )}

        {/* Second row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {secondRow.map((column, index) => (
            <FadeIn key={column.slug} delay={index * 100}>
              <AuthorCard
                authorName={column.authorName}
                authorRole={column.authorRole}
                authorCategory={column.authorCategory}
                authorImage={column.authorImage}
                title={column.title}
                excerpt={column.excerpt}
                date={column.date}
                slug={`/voces/${column.slug}`}
                pullQuote={column.pullQuote}
              />
            </FadeIn>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}
