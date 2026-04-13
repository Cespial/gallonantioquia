"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { columnas, columnaCategories } from "@/data/columnas";
import CategoryTag from "@/components/content/CategoryTag";
import PageHero from "@/components/layout/PageHero";
import SectionWrapper from "@/components/layout/SectionWrapper";
import FadeIn from "@/components/animations/FadeIn";
import { formatDate } from "@/lib/utils";

export default function ColumnasContent() {
  const [activeYear, setActiveYear] = useState("Todas");

  const filtered =
    activeYear === "Todas"
      ? columnas
      : columnas.filter((c) => c.date.startsWith(activeYear));

  return (
    <>
      <PageHero
        title="Columnas de Opini&oacute;n"
        subtitle="Reflexiones publicadas en Al Poniente sobre Antioquia, competitividad, infraestructura y sociedad."
        backgroundImage="/images/gallon-discurso.jpg"
      />

      <SectionWrapper>
        <div className="max-w-4xl mx-auto">
          {/* Year filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {columnaCategories.map((year) => (
              <CategoryTag
                key={year}
                label={year}
                active={activeYear === year}
                onClick={() => setActiveYear(year)}
              />
            ))}
          </div>

          {/* Article list */}
          {filtered.map((col, i) => {
            const { day, month } = formatDate(col.date);

            return (
              <FadeIn key={col.slug} delay={i * 80}>
                <Link
                  href={`/columnas/${col.slug}`}
                  className="group flex gap-6 items-start py-8 border-b border-borde"
                >
                  {/* Date block */}
                  <div className="flex-shrink-0 w-16 text-center">
                    <span className="block font-display text-4xl font-black text-dorado-tierra">
                      {day}
                    </span>
                    <span className="block font-ui text-sm uppercase tracking-label text-texto-terciario">
                      {month}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-heading font-bold text-xl text-texto-principal group-hover:text-verde-antioquia transition-colors duration-200">
                      {col.title}
                    </h2>
                    <p className="font-body text-texto-secundario mt-2 line-clamp-2">
                      {col.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-ui text-xs text-texto-terciario">
                        {col.readTime}
                      </span>
                      <span
                        aria-hidden="true"
                        className="w-1 h-1 rounded-full bg-texto-terciario/50"
                      />
                      <span className="font-ui text-xs text-dorado-tierra font-semibold">
                        Al Poniente
                      </span>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="hidden sm:block flex-shrink-0 relative w-48 h-32">
                    <Image
                      src={col.image}
                      alt={col.title}
                      fill
                      sizes="192px"
                      className="rounded-card object-cover"
                    />
                  </div>
                </Link>
              </FadeIn>
            );
          })}

          {filtered.length === 0 && (
            <p className="font-body text-texto-terciario text-center py-12">
              No hay columnas para este a&ntilde;o.
            </p>
          )}
        </div>
      </SectionWrapper>
    </>
  );
}
