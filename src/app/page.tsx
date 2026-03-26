import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown, ArrowRight, Coffee } from "lucide-react";

import SectionWrapper from "@/components/layout/SectionWrapper";
import ArticleCard from "@/components/content/ArticleCard";
import AuthorCard from "@/components/content/AuthorCard";
import StatCounter from "@/components/content/StatCounter";
import NewsletterForm from "@/components/content/NewsletterForm";
import FadeIn from "@/components/animations/FadeIn";
import Button from "@/components/ui/Button";
import {
  featuredReflection,
  impactStats,
  stories,
  episodes,
  guestColumns,
  ideas,
} from "@/data/content";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Gallón Antioquia — Conversaciones para Antioquia",
  description:
    "Una plataforma de pensamiento, territorio y liderazgo para Antioquia. Historias, ideas, conversaciones y liderazgo regional.",
};

export default function Home() {
  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* 1. Hero Section                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative min-h-screen">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop"
            alt="Paisaje de Antioquia"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D3B0F]/90 via-[#0D3B0F]/60 to-[#0D3B0F]/30" />

        {/* Content */}
        <div className="flex items-center justify-center min-h-screen relative z-10 text-center px-4">
          <div>
            <p className="font-ui uppercase tracking-[0.15em] text-dorado-tierra text-sm mb-6">
              CONVERSACIONES PARA ANTIOQUIA
            </p>

            <h1 className="font-display text-hero text-white max-w-4xl mx-auto text-balance">
              Antioquia se construye escuchando, recorriendo y aprendiendo de su
              gente.
            </h1>

            <p className="font-body text-lg text-white/85 max-w-2xl mx-auto mt-6">
              Una plataforma de pensamiento, territorio y liderazgo para
              Antioquia. No un sitio político. Un lugar donde se encuentran
              historias, ideas, conversaciones y liderazgo regional.
            </p>

            <div className="mt-8 flex gap-4 justify-center flex-wrap">
              <Button variant="outline" href="/territorio-vivo" className="text-white">
                Explorar historias
              </Button>
              <Button
                variant="primary"
                href="/bitacora/lo-que-uno-aprende-cuando-escucha"
              >
                Última reflexión
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <ChevronDown className="w-6 h-6 text-white/60 animate-bounce" />
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2. Última reflexión                                                 */}
      {/* ------------------------------------------------------------------ */}
      <SectionWrapper>
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Left */}
            <div className="lg:col-span-3">
              <p className="font-ui uppercase tracking-label text-verde-antioquia text-xs font-semibold flex items-center gap-2">
                <span className="inline-block w-6 h-px bg-verde-antioquia" />
                BITÁCORA DE CAMINO
              </p>

              <h2 className="font-display text-page-title mt-3">
                {featuredReflection.title}
              </h2>

              <p className="font-body text-texto-secundario mt-4 text-lg leading-relaxed">
                {featuredReflection.excerpt}
              </p>

              <p className="font-ui text-sm text-texto-terciario mt-4">
                {formatDate(featuredReflection.date).full} &middot;{" "}
                {featuredReflection.readTime}
              </p>

              <Link
                href={`/bitacora/${featuredReflection.slug}`}
                className="link-underline font-heading font-semibold text-verde-antioquia mt-6 inline-block"
              >
                Leer reflexión &rarr;
              </Link>
            </div>

            {/* Right */}
            <div className="lg:col-span-2">
              <div className="rounded-card overflow-hidden">
                <img
                  src={featuredReflection.image}
                  alt={featuredReflection.title}
                  className="aspect-[4/5] object-cover w-full"
                />
              </div>
            </div>
          </div>
        </FadeIn>
      </SectionWrapper>

      {/* ------------------------------------------------------------------ */}
      {/* 3. Cifras de impacto (dark)                                         */}
      {/* ------------------------------------------------------------------ */}
      <SectionWrapper dark={true}>
        <h2 className="font-display text-section-title text-white text-center mb-12">
          Antioquia en movimiento
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          {impactStats.map((stat, index) => (
            <FadeIn key={stat.label} delay={index * 100}>
              <StatCounter
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            </FadeIn>
          ))}
        </div>

        <p className="font-ui text-xs text-white/50 text-center mt-12">
          Cifras de gestión como Secretario de Infraestructura de Antioquia y
          trayectoria acumulada.
        </p>
      </SectionWrapper>

      {/* ------------------------------------------------------------------ */}
      {/* 4. Territorio Vivo                                                  */}
      {/* ------------------------------------------------------------------ */}
      <SectionWrapper>
        <div className="flex justify-between items-end mb-10">
          <h2 className="font-display text-section-title">
            Historias que construyen a Antioquia
          </h2>
          <Link
            href="/territorio-vivo"
            className="hidden md:block font-heading text-sm text-verde-antioquia link-underline"
          >
            Ver todas las historias &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.slice(0, 3).map((story, index) => (
            <FadeIn key={story.slug} delay={index * 100}>
              <ArticleCard
                slug={story.slug}
                title={story.title}
                excerpt={story.excerpt}
                category={story.category}
                date={story.date}
                readTime={story.readTime}
                format={story.format}
                image={story.image}
                featured={story.featured}
              />
            </FadeIn>
          ))}
        </div>

        <div className="block md:hidden text-center mt-8">
          <Link
            href="/territorio-vivo"
            className="font-heading text-sm text-verde-antioquia link-underline"
          >
            Ver todas las historias &rarr;
          </Link>
        </div>
      </SectionWrapper>

      {/* ------------------------------------------------------------------ */}
      {/* 5. Un Café para Antioquia                                           */}
      {/* ------------------------------------------------------------------ */}
      <SectionWrapper className="bg-dorado-claro/30">
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left — Video thumbnail */}
            <div className="rounded-card overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=450&fit=crop"
                alt={episodes[0].title}
                className="aspect-video object-cover w-full"
              />
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-white ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right — Episode info */}
            <div>
              <Coffee className="text-dorado-tierra w-8 h-8" />

              <p className="font-ui uppercase tracking-label text-dorado-tierra text-xs font-semibold mt-2">
                Episodio 01
              </p>

              <h2 className="font-display text-subtitle mt-2">
                {episodes[0].title}
              </h2>

              <p className="font-ui text-sm text-texto-terciario mt-2">
                {episodes[0].guest} &mdash; {episodes[0].guestRole}
              </p>

              <p className="font-body text-texto-secundario mt-4">
                {episodes[0].description}
              </p>

              <div className="flex gap-4 mt-6 flex-wrap">
                <Button variant="primary" href="/un-cafe/1">
                  Ver entrevista
                </Button>
                <Button variant="outline" href="/un-cafe/1">
                  Escuchar podcast
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </SectionWrapper>

      {/* ------------------------------------------------------------------ */}
      {/* 6. Voces de Antioquia                                               */}
      {/* ------------------------------------------------------------------ */}
      <SectionWrapper>
        <h2 className="font-display text-section-title text-center mb-4">
          Voces de Antioquia
        </h2>
        <p className="font-body text-texto-secundario text-center mb-10">
          Un espacio abierto para los líderes que piensan el futuro del
          departamento.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guestColumns.slice(0, 2).map((column, index) => (
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

        <div className="text-center mt-8">
          <Link
            href="/voces"
            className="font-heading text-sm text-verde-antioquia link-underline"
          >
            Conocer todas las voces &rarr;
          </Link>
        </div>
      </SectionWrapper>

      {/* ------------------------------------------------------------------ */}
      {/* 7. Ideas para Antioquia                                             */}
      {/* ------------------------------------------------------------------ */}
      <SectionWrapper className="bg-verde-suave/50">
        <h2 className="font-display text-section-title mb-10">
          Ideas para Antioquia
        </h2>

        <div>
          {ideas.slice(0, 4).map((idea, index) => (
            <FadeIn key={idea.slug} delay={index * 100}>
              <Link
                href={`/antioquia-piensa/${idea.slug}`}
                className="flex gap-6 items-start py-6 border-b border-borde last:border-0 group"
              >
                <span className="font-display text-4xl md:text-5xl font-black text-dorado-tierra/30">
                  {idea.number}
                </span>
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-lg group-hover:text-verde-antioquia transition-colors">
                    {idea.title}
                  </h3>
                  <p className="font-body text-texto-secundario text-sm mt-1">
                    {idea.description}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-texto-terciario flex-shrink-0 mt-1 group-hover:text-verde-antioquia transition-colors" />
              </Link>
            </FadeIn>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/antioquia-piensa"
            className="font-heading text-sm text-verde-antioquia link-underline"
          >
            Explorar ideas &rarr;
          </Link>
        </div>
      </SectionWrapper>

      {/* ------------------------------------------------------------------ */}
      {/* 8. Newsletter CTA                                                   */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-verde-antioquia relative overflow-hidden noise-texture">
        <SectionWrapper>
          <div className="max-w-xl mx-auto text-center relative z-10">
            <h2 className="font-display text-section-title text-white">
              Carta para Antioquia
            </h2>
            <p className="font-body text-white/90 mt-4">
              Una carta mensual con reflexiones, historias, aprendizajes y
              conversaciones. Suscríbete.
            </p>
            <div className="mt-8">
              <NewsletterForm variant="dark" />
            </div>
          </div>
        </SectionWrapper>
      </div>
    </>
  );
}
