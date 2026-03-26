import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Coffee } from "lucide-react";

import SectionWrapper from "@/components/layout/SectionWrapper";
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

export const metadata: Metadata = {
  title: "Gallón Antioquia — Conversaciones para Antioquia",
  description:
    "Una plataforma de pensamiento, territorio y liderazgo para Antioquia. Historias, ideas, conversaciones y liderazgo regional.",
};

export default function Home() {
  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* 1. Premium Editorial Hero                                           */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative min-h-[90vh] flex flex-col lg:flex-row overflow-hidden bg-blanco-calido">
        {/* Left Side: Editorial Typography */}
        <div className="w-full lg:w-7/12 p-8 md:p-16 lg:p-24 flex flex-col justify-center relative z-10">
          <FadeIn>
            <p className="font-ui uppercase tracking-widest-editorial text-dorado-tierra text-xs mb-8 border-b border-dorado-tierra/30 pb-2 inline-block">
              VOL. 01 — TERRITORIO & LIDERAZGO
            </p>

            <h1 className="font-display text-[clamp(2.5rem,8vw,6rem)] leading-[0.9] text-texto-principal mb-8">
              Antioquia: <br />
              <span className="italic text-verde-antioquia">El Camino</span> <br />
              se hace al andar.
            </h1>

            <div className="max-w-lg">
              <p className="font-body text-xl text-texto-secundario leading-relaxed mb-10">
                Una plataforma de pensamiento para el departamento. Historias que conectan montañas, 
                ideas que transforman realidades y conversaciones que construyen futuro.
              </p>

              <div className="flex gap-6 items-center">
                <Button variant="primary" href="/territorio-vivo">
                  Explorar Bitácora
                </Button>
                <Link href="/sobre" className="font-ui text-sm uppercase tracking-label text-texto-terciario hover:text-verde-antioquia transition-colors">
                  El Proyecto &rarr;
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Right Side: Hero Image with Asymmetrical Mask */}
        <div className="w-full lg:w-5/12 relative min-h-[50vh] lg:min-h-full">
          <div className="absolute inset-0 bg-verde-antioquia/10 lg:clip-path-editorial">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=1600&fit=crop"
              alt="Montañas de Antioquia"
              className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out"
            />
          </div>
          {/* Floating Detail */}
          <div className="absolute bottom-12 -left-12 hidden xl:block bg-blanco-calido p-6 shadow-editorial border-editorial-thin max-w-xs animate-fade-up">
            <p className="font-display italic text-lg text-verde-antioquia">
              &quot;La infraestructura no es solo cemento, es la vena que une el corazón de los pueblos.&quot;
            </p>
            <p className="font-ui text-[10px] uppercase tracking-widest text-texto-terciario mt-4">
              — Luis Horacio Gallón
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2. Featured Reflection (Asymmetrical)                               */}
      {/* ------------------------------------------------------------------ */}
      <SectionWrapper className="bg-arena noise-texture">
        <FadeIn>
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Image with offset border */}
            <div className="w-full lg:w-5/12 relative">
              <div className="absolute -top-4 -left-4 w-full h-full border border-dorado-tierra/30 z-0" />
              <div className="relative z-10 overflow-hidden shadow-2xl">
                <img
                  src={featuredReflection.image}
                  alt={featuredReflection.title}
                  className="w-full aspect-[3/4] object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Content with Drop Cap */}
            <div className="w-full lg:w-7/12">
              <div className="border-editorial-double mb-8 w-24" />
              <p className="font-ui uppercase tracking-widest-editorial text-verde-antioquia text-xs mb-4">
                REFLEXIÓN DESTACADA
              </p>
              <h2 className="font-display text-page-title mb-8 leading-tight">
                {featuredReflection.title}
              </h2>
              <div className="drop-cap font-body text-xl text-texto-secundario leading-relaxed mb-8">
                {featuredReflection.excerpt}
              </div>
              <Link
                href={`/bitacora/${featuredReflection.slug}`}
                className="inline-flex items-center gap-2 bg-texto-principal text-blanco-calido px-8 py-4 rounded-full font-heading text-sm hover:bg-verde-antioquia transition-colors"
              >
                Seguir leyendo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </FadeIn>
      </SectionWrapper>

      {/* ------------------------------------------------------------------ */}
      {/* 3. Stats (Re-designed for Premium feel)                            */}
      {/* ------------------------------------------------------------------ */}
      <section className="grainy-dark py-24 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {impactStats.map((stat, index) => (
              <FadeIn key={stat.label} delay={index * 150} className="text-center md:text-left border-l border-white/10 pl-8">
                <StatCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                />
                <p className="font-ui text-[10px] uppercase tracking-widest text-white/40 mt-2">
                  GESTIÓN & TERRITORIO
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4. Stories (Asymmetrical Grid)                                      */}
      {/* ------------------------------------------------------------------ */}
      <SectionWrapper>
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
          <div>
            <h2 className="font-display text-5xl mb-2">Bitácora de Viaje</h2>
            <div className="h-1 w-20 bg-dorado-tierra" />
          </div>
          <Link
            href="/territorio-vivo"
            className="font-ui text-xs uppercase tracking-widest-editorial text-texto-terciario hover:text-verde-antioquia transition-colors"
          >
            Ver archivo completo / +24 Historias
          </Link>
        </div>

        {/* Asymmetrical Masonry-like Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Featured Large Story */}
          <div className="md:col-span-8">
            <FadeIn>
              <div className="group relative overflow-hidden bg-white border-editorial-thin shadow-sm hover:shadow-editorial transition-all duration-500">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-1/2 overflow-hidden">
                    <img 
                      src={stories[0].image} 
                      alt={stories[0].title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                    />
                  </div>
                  <div className="lg:w-1/2 p-10 flex flex-col justify-center">
                    <p className="font-ui text-[10px] uppercase tracking-widest text-dorado-tierra mb-4">Destacado en {stories[0].category}</p>
                    <h3 className="font-display text-3xl mb-4 group-hover:text-verde-antioquia transition-colors">{stories[0].title}</h3>
                    <p className="font-body text-texto-secundario text-sm mb-6 line-clamp-3">{stories[0].excerpt}</p>
                    <Link href={`/territorio-vivo/${stories[0].slug}`} className="font-ui text-xs uppercase tracking-label font-bold border-b-2 border-verde-antioquia pb-1 w-fit">Leer más</Link>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Small sidebar story */}
          <div className="md:col-span-4 flex flex-col gap-8">
            {stories.slice(1, 3).map((story, index) => (
              <FadeIn key={story.slug} delay={index * 200}>
                <div className="group border-b border-borde pb-6">
                  <p className="font-ui text-[10px] uppercase tracking-widest text-texto-terciario mb-2">{story.category}</p>
                  <h3 className="font-display text-xl group-hover:text-verde-antioquia transition-colors leading-snug">
                    {story.title}
                  </h3>
                  <Link href={`/territorio-vivo/${story.slug}`} className="mt-4 block font-ui text-[10px] uppercase tracking-widest text-verde-antioquia font-bold">Ver historia &rarr;</Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ------------------------------------------------------------------ */}
      {/* 5. Un Café para Antioquia (Overlapping Layout)                      */}
      {/* ------------------------------------------------------------------ */}
      <SectionWrapper className="bg-dorado-claro/20 overflow-hidden">
        <FadeIn>
          <div className="relative">
            {/* Background Text Accent */}
            <div className="absolute -top-12 -right-12 font-display text-[12rem] font-black text-dorado-tierra/5 select-none pointer-events-none">
              CAFÉ
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Image with Play Button */}
              <div className="lg:col-span-7 relative group">
                <div className="absolute inset-0 bg-verde-antioquia mix-blend-multiply opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-10" />
                <div className="aspect-video overflow-hidden border-editorial-thin shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200&h=675&fit=crop"
                    alt={episodes[0].title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                  />
                </div>
                {/* Floating Label */}
                <div className="absolute -bottom-6 -right-6 bg-verde-antioquia text-white p-8 rounded-full w-32 h-32 flex items-center justify-center z-20 shadow-xl group-hover:scale-110 transition-transform cursor-pointer">
                   <span className="font-ui text-xs font-bold tracking-widest text-center">VER AHORA</span>
                </div>
              </div>

              {/* Info */}
              <div className="lg:col-span-5 lg:pl-12">
                <div className="flex items-center gap-3 mb-6">
                  <Coffee className="text-dorado-tierra w-5 h-5" />
                  <span className="font-ui text-[10px] uppercase tracking-widest text-texto-terciario">EPISODIO DESTACADO — 01</span>
                </div>
                
                <h2 className="font-display text-4xl mb-6 leading-tight">
                  {episodes[0].title}
                </h2>

                <p className="font-ui text-sm text-verde-antioquia font-bold mb-6 italic">
                  Con {episodes[0].guest} &mdash; {episodes[0].guestRole}
                </p>

                <p className="font-body text-texto-secundario leading-relaxed mb-8">
                  {episodes[0].description}
                </p>

                <div className="flex gap-4">
                  <Button variant="outline" href="/un-cafe/1">Ver Entrevista</Button>
                  <Button variant="outline" href="/un-cafe" className="font-ui text-xs uppercase tracking-widest font-bold">Ver todos &rarr;</Button>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </SectionWrapper>

      {/* ------------------------------------------------------------------ */}
      {/* 6. Voces de Antioquia (Editorial Cards)                             */}
      {/* ------------------------------------------------------------------ */}
      <SectionWrapper>
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="font-ui text-[10px] uppercase tracking-widest-editorial text-dorado-tierra mb-4">COLUMNAS DE OPINIÓN</p>
          <h2 className="font-display text-5xl mb-6 italic text-balance">
            Voces que <span className="text-verde-antioquia not-italic font-black">piensan</span> el territorio.
          </h2>
          <div className="h-px w-24 bg-borde mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {guestColumns.slice(0, 2).map((column, index) => (
            <FadeIn key={column.slug} delay={index * 150}>
              <div className="relative group">
                {/* Numbering */}
                <span className="absolute -top-10 -left-6 font-display text-8xl font-black text-arena-dark/10 group-hover:text-verde-antioquia/5 transition-colors select-none">
                  0{index + 1}
                </span>
                
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
              </div>
            </FadeIn>
          ))}
        </div>
      </SectionWrapper>

      {/* ------------------------------------------------------------------ */}
      {/* 7. Ideas para Antioquia (Think Tank style)                         */}
      {/* ------------------------------------------------------------------ */}
      <SectionWrapper className="bg-oscuro text-white noise-texture">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <h2 className="font-display text-5xl mb-8 leading-tight">
              Ideas para <br />
              <span className="text-dorado-tierra italic">Antioquia</span>
            </h2>
            <p className="font-body text-white/60 mb-10 leading-relaxed">
              Propuestas concretas y visiones estratégicas para el desarrollo regional, la conectividad y la equidad social.
            </p>
            <Button variant="outline" href="/antioquia-piensa" className="border-white/20 text-white hover:bg-white hover:text-oscuro">
              Ver Proyecto Completo
            </Button>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-0">
            {ideas.slice(0, 4).map((idea, index) => (
              <FadeIn key={idea.slug} delay={index * 100}>
                <Link
                  href={`/antioquia-piensa/${idea.slug}`}
                  className="group flex gap-8 items-center py-10 border-b border-white/10 last:border-0"
                >
                  <span className="font-display text-2xl font-black text-white/20 group-hover:text-dorado-tierra transition-colors w-12">
                    {idea.number}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-xl group-hover:translate-x-2 transition-transform duration-300">
                      {idea.title}
                    </h3>
                  </div>
                  <ArrowRight className="w-6 h-6 text-white/20 group-hover:text-white transition-colors" />
                </Link>
              </FadeIn>
            ))}
          </div>
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
