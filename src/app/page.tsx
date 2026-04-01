import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import StatCounter from "@/components/content/StatCounter";
import NewsletterForm from "@/components/content/NewsletterForm";
import FadeIn from "@/components/animations/FadeIn";
import {
  featuredReflection,
  impactStats,
  stories,
  episodes,
  guestColumns,
  ideas,
} from "@/data/content";

export const metadata: Metadata = {
  title: "Gallón Antioquia — Conversaciones para Antioquia",
  description:
    "Una plataforma de pensamiento, territorio y liderazgo para Antioquia. Historias, ideas, conversaciones y liderazgo regional.",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Gallón Antioquia",
            url: "https://www.gallonantioquia.com",
            description:
              "Una plataforma de pensamiento, territorio y liderazgo para Antioquia.",
            author: {
              "@type": "Person",
              name: "Luis Horacio Gallón Arango",
              jobTitle:
                "Secretario de Infraestructura Física de Antioquia",
            },
          }),
        }}
      />

      {/* ================================================================== */}
      {/* 1. HERO — Full-bleed, candidato como protagonista absoluto         */}
      {/* ================================================================== */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background: video/image full-bleed */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/images/hero-gallon-montanas.jpg"
            className="w-full h-full object-cover"
          >
            <source src="/images/hero-gallon-video.mp4" type="video/mp4" />
            <img
              src="/images/hero-gallon-montanas.jpg"
              alt="Luis Horacio Gallón contemplando las montañas de Antioquia"
              className="w-full h-full object-cover"
            />
          </video>
          {/* Gradient overlay — heavy at bottom for text */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D3B0F] via-[#0D3B0F]/40 to-transparent" />
        </div>

        {/* Content — pinned to bottom-left */}
        <div className="relative z-10 min-h-screen flex flex-col justify-end px-6 md:px-16 lg:px-24 pb-16 md:pb-24">
          <FadeIn>
            <p className="font-ui uppercase tracking-[0.3em] text-dorado-tierra text-[10px] md:text-xs mb-6">
              Territorio &middot; Liderazgo &middot; Antioquia
            </p>

            <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-[0.85] tracking-tight text-white max-w-5xl">
              El camino<br />
              <span className="italic text-dorado-tierra">se hace</span><br />
              al andar.
            </h1>

            <div className="mt-10 flex flex-col sm:flex-row gap-8 items-start sm:items-center">
              <Link
                href="/territorio-vivo"
                className="group inline-flex items-center gap-3 font-ui text-sm uppercase tracking-[0.15em] text-white border-b border-white/30 pb-2 hover:border-dorado-tierra hover:text-dorado-tierra transition-all duration-300"
              >
                Explorar historias
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/sobre"
                className="font-ui text-sm uppercase tracking-[0.15em] text-white/50 hover:text-white transition-colors"
              >
                Conocer el proyecto
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/40" />
        </div>
      </section>

      {/* ================================================================== */}
      {/* 2. REFLEXIÓN — Magazine layout, borderless                         */}
      {/* ================================================================== */}
      <section className="py-24 md:py-32 lg:py-40">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0">
              {/* Text — narrow column for intimate reading */}
              <div className="lg:col-span-5 lg:pr-16 flex flex-col justify-center order-2 lg:order-1">
                <p className="font-ui uppercase tracking-[0.25em] text-dorado-tierra text-[10px] mb-8">
                  Reflexión destacada
                </p>

                <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] tracking-tight text-texto-principal mb-8">
                  {featuredReflection.title}
                </h2>

                <p className="font-body text-texto-secundario text-lg leading-relaxed mb-10">
                  {featuredReflection.excerpt}
                </p>

                <Link
                  href={`/bitacora/${featuredReflection.slug}`}
                  className="group inline-flex items-center gap-3 font-ui text-xs uppercase tracking-[0.15em] text-texto-principal border-b border-texto-principal/20 pb-2 hover:border-verde-antioquia hover:text-verde-antioquia transition-all duration-300 w-fit"
                >
                  Seguir leyendo
                  <span className="text-lg group-hover:translate-x-1 transition-transform">&#8594;</span>
                </Link>
              </div>

              {/* Image — full-bleed right */}
              <div className="lg:col-span-7 order-1 lg:order-2">
                <div className="relative overflow-hidden">
                  <img
                    src={featuredReflection.image}
                    alt={featuredReflection.title}
                    className="w-full aspect-[4/3] lg:aspect-[3/4] object-cover hover:scale-[1.02] transition-transform duration-1000"
                  />
                  {/* Subtle gradient for depth */}
                  <div className="absolute inset-0 bg-gradient-to-r from-arena/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 3. CIFRAS — Clean, massive numbers, map background                 */}
      {/* ================================================================== */}
      <section className="relative py-24 md:py-32 bg-[#0B3B24] text-white overflow-hidden">
        {/* Map background */}
        <div className="absolute inset-0 opacity-15">
          <img
            src="/images/fondo-mapa-antioquia.jpg"
            alt=""
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
          <FadeIn>
            <p className="font-ui uppercase tracking-[0.3em] text-dorado-tierra text-[10px] mb-4">
              Antioquia en cifras
            </p>
            <div className="h-px w-16 bg-dorado-tierra/40 mb-16" />
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-16 md:gap-y-20">
            {impactStats.map((stat, index) => (
              <FadeIn key={stat.label} delay={index * 100}>
                <div>
                  <StatCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    label={stat.label}
                  />
                  <p className="font-ui text-[9px] uppercase tracking-[0.2em] text-white/30 mt-3">
                    Gestión territorial
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <p className="font-ui text-[10px] text-white/25 mt-16 tracking-wide">
              Cifras de gestión como Secretario de Infraestructura de Antioquia y trayectoria acumulada.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 4. HISTORIAS — Borderless editorial grid                           */}
      {/* ================================================================== */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
          <FadeIn>
            <div className="flex justify-between items-end mb-16">
              <div>
                <p className="font-ui uppercase tracking-[0.25em] text-dorado-tierra text-[10px] mb-3">
                  Territorio vivo
                </p>
                <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] tracking-tight">
                  Historias
                </h2>
              </div>
              <Link
                href="/territorio-vivo"
                className="hidden md:inline-flex font-ui text-[10px] uppercase tracking-[0.2em] text-texto-terciario hover:text-verde-antioquia transition-colors"
              >
                Ver todas &#8594;
              </Link>
            </div>
          </FadeIn>

          {/* Featured story — full width, image dominant */}
          <FadeIn>
            <Link href={`/territorio-vivo/${stories[0].slug}`} className="group block mb-16">
              <div className="relative overflow-hidden">
                <img
                  src={stories[0].image}
                  alt={stories[0].title}
                  className="w-full aspect-[21/9] object-cover group-hover:scale-[1.02] transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D3B0F]/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 md:p-12">
                  <p className="font-ui uppercase tracking-[0.2em] text-dorado-tierra text-[10px] mb-3">
                    {stories[0].category}
                  </p>
                  <h3 className="font-display text-3xl md:text-4xl text-white leading-tight max-w-2xl">
                    {stories[0].title}
                  </h3>
                </div>
              </div>
            </Link>
          </FadeIn>

          {/* Secondary stories — minimal, text-only with thin separator */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {stories.slice(1, 4).map((story, index) => (
              <FadeIn key={story.slug} delay={index * 100}>
                <Link
                  href={`/territorio-vivo/${story.slug}`}
                  className="group block py-8 md:px-8 first:md:pl-0 last:md:pr-0 border-b md:border-b-0 md:border-r border-borde/50 last:border-0"
                >
                  <p className="font-ui uppercase tracking-[0.2em] text-texto-terciario text-[10px] mb-3">
                    {story.category}
                  </p>
                  <h3 className="font-display text-xl leading-snug group-hover:text-verde-antioquia transition-colors duration-300">
                    {story.title}
                  </h3>
                  <p className="font-body text-sm text-texto-terciario mt-3 line-clamp-2">
                    {story.excerpt}
                  </p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 5. UN CAFÉ — Clean, no collision, image + text separated           */}
      {/* ================================================================== */}
      <section className="py-24 md:py-32 border-t border-borde/50">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Image — clean, no overlapping buttons */}
              <div className="lg:col-span-7">
                <div className="relative overflow-hidden">
                  <img
                    src="/images/gallon-conversacion-rural.jpg"
                    alt={episodes[0].title}
                    className="w-full aspect-video object-cover"
                  />
                </div>
              </div>

              {/* Text — clean hierarchy */}
              <div className="lg:col-span-5">
                <p className="font-ui uppercase tracking-[0.25em] text-dorado-tierra text-[10px] mb-6">
                  Un café para Antioquia &middot; Ep. 01
                </p>

                <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[0.95] tracking-tight mb-6">
                  {episodes[0].title}
                </h2>

                <p className="font-body text-sm text-verde-antioquia mb-6">
                  Con {episodes[0].guest} &mdash; {episodes[0].guestRole}
                </p>

                <p className="font-body text-texto-secundario leading-relaxed mb-8">
                  {episodes[0].description}
                </p>

                <div className="flex flex-col sm:flex-row gap-6">
                  <Link
                    href="/un-cafe"
                    className="group inline-flex items-center gap-3 font-ui text-xs uppercase tracking-[0.15em] text-texto-principal border-b border-texto-principal/20 pb-2 hover:border-verde-antioquia hover:text-verde-antioquia transition-all duration-300"
                  >
                    Ver entrevista
                    <span className="group-hover:translate-x-1 transition-transform">&#8594;</span>
                  </Link>
                  <Link
                    href="/un-cafe"
                    className="font-ui text-xs uppercase tracking-[0.15em] text-texto-terciario hover:text-texto-principal transition-colors"
                  >
                    Todos los episodios
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 6. VOCES — Borderless, quote-driven, no cards                      */}
      {/* ================================================================== */}
      <section className="py-24 md:py-32 border-t border-borde/50">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
          <FadeIn>
            <p className="font-ui uppercase tracking-[0.25em] text-dorado-tierra text-[10px] mb-3">
              Columnas de opinión
            </p>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] tracking-tight mb-16">
              Voces de Antioquia
            </h2>
          </FadeIn>

          <div className="space-y-16 md:space-y-20">
            {guestColumns.slice(0, 2).map((column, index) => (
              <FadeIn key={column.slug} delay={index * 150}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  {/* Number */}
                  <div className="md:col-span-1">
                    <span className="font-display text-6xl md:text-7xl font-black text-borde/50 leading-none">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Author info */}
                  <div className="md:col-span-3">
                    <p className="font-heading font-bold text-sm text-texto-principal">
                      {column.authorName}
                    </p>
                    <p className="font-ui text-xs text-texto-terciario mt-1">
                      {column.authorRole}
                    </p>
                  </div>

                  {/* Quote — the protagonist */}
                  <div className="md:col-span-8">
                    {column.pullQuote && (
                      <blockquote className="font-display italic text-2xl md:text-3xl leading-snug text-texto-principal mb-6">
                        &ldquo;{column.pullQuote}&rdquo;
                      </blockquote>
                    )}
                    <p className="font-body text-texto-secundario text-sm leading-relaxed max-w-2xl">
                      {column.excerpt}
                    </p>
                  </div>
                </div>

                {index < 1 && (
                  <div className="h-px bg-borde/40 mt-16 md:mt-20" />
                )}
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="mt-16">
              <Link
                href="/voces"
                className="group inline-flex items-center gap-3 font-ui text-xs uppercase tracking-[0.15em] text-texto-principal border-b border-texto-principal/20 pb-2 hover:border-verde-antioquia hover:text-verde-antioquia transition-all duration-300"
              >
                Todas las voces
                <span className="group-hover:translate-x-1 transition-transform">&#8594;</span>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 7. IDEAS — Dark, clean, already minimal                            */}
      {/* ================================================================== */}
      <section className="relative py-24 md:py-32 bg-[#0B3B24] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <FadeIn>
                <p className="font-ui uppercase tracking-[0.25em] text-dorado-tierra text-[10px] mb-6">
                  Think tank
                </p>
                <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] tracking-tight mb-8">
                  Ideas para<br />
                  <span className="italic text-dorado-tierra">Antioquia</span>
                </h2>
                <p className="font-body text-white/50 leading-relaxed mb-10 text-sm">
                  Propuestas concretas y visiones estratégicas para el desarrollo
                  regional, la conectividad y la equidad social.
                </p>
                <Link
                  href="/antioquia-piensa"
                  className="group inline-flex items-center gap-3 font-ui text-xs uppercase tracking-[0.15em] text-white/60 border-b border-white/20 pb-2 hover:border-dorado-tierra hover:text-dorado-tierra transition-all duration-300"
                >
                  Ver proyecto completo
                  <span className="group-hover:translate-x-1 transition-transform">&#8594;</span>
                </Link>
              </FadeIn>
            </div>

            <div className="lg:col-span-8">
              {ideas.slice(0, 4).map((idea, index) => (
                <FadeIn key={idea.slug} delay={index * 100}>
                  <Link
                    href={`/antioquia-piensa/${idea.slug}`}
                    className="group flex gap-8 items-center py-8 border-b border-white/10 last:border-0"
                  >
                    <span className="font-display text-xl font-black text-white/15 group-hover:text-dorado-tierra transition-colors duration-300 w-10 shrink-0">
                      {idea.number}
                    </span>
                    <h3 className="font-heading font-bold text-lg group-hover:translate-x-2 transition-transform duration-300 flex-1">
                      {idea.title}
                    </h3>
                    <ArrowRight className="w-5 h-5 text-white/15 group-hover:text-white transition-colors shrink-0" />
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 8. NEWSLETTER — Cafetal background, clean                          */}
      {/* ================================================================== */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/fondo-cafetal.jpg"
            alt=""
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[#0B3B24]/85" />
        </div>

        <div className="relative z-10 max-w-xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="font-ui uppercase tracking-[0.3em] text-dorado-tierra text-[10px] mb-6">
              Newsletter mensual
            </p>
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-tight text-white mb-4">
              Carta para Antioquia
            </h2>
            <p className="font-body text-white/60 text-sm leading-relaxed mb-10">
              Reflexiones, historias, aprendizajes y conversaciones. Una vez al mes en tu correo.
            </p>
            <NewsletterForm variant="dark" />
          </FadeIn>
        </div>
      </section>
    </>
  );
}
