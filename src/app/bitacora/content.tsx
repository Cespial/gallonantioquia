"use client";

import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import SectionWrapper from "@/components/layout/SectionWrapper";
import CategoryTag from "@/components/content/CategoryTag";
import FadeIn from "@/components/animations/FadeIn";
import { blogPosts } from "@/data/content";
import { formatDate } from "@/lib/utils";

export default function BitacoraContent() {
  return (
    <>
      <PageHero
        title="Bit&aacute;cora de Camino"
        subtitle="Reflexiones de Horacio Gall&oacute;n sobre liderazgo, servicio p&uacute;blico y el camino que se hace al andar."
        backgroundImage="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=600&fit=crop"
      />

      <SectionWrapper>
        <div className="max-w-4xl mx-auto">
          {blogPosts.map((post, i) => {
            const { day, month } = formatDate(post.date);

            return (
              <FadeIn key={post.slug} delay={i * 100}>
                <Link
                  href={`/bitacora/${post.slug}`}
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
                    <CategoryTag label={post.tag} />
                    <h2 className="font-heading font-bold text-xl text-texto-principal mt-2 group-hover:text-verde-antioquia transition-colors duration-200">
                      {post.title}
                    </h2>
                    <p className="font-body text-texto-secundario mt-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <span className="font-ui text-xs text-texto-terciario mt-2 inline-block">
                      {post.readTime}
                    </span>
                  </div>

                  {/* Image */}
                  <div className="hidden sm:block flex-shrink-0">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="rounded-card w-48 h-32 object-cover"
                    />
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </SectionWrapper>
    </>
  );
}
