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
  title: "Gallón Memorias — Memorias de Antioquia",
  description:
    "Memorias, reflexiones y conversaciones sobre Antioquia. Columnas, historias, ideas y diálogos desde el territorio.",
};

/* -------------------------------------------------------------------------- */
/* Section grid data — the 6 entry-point cards from the PPTX mockup           */
/* -------------------------------------------------------------------------- */
const sectionGrid = [
  {
    title: "Columnas",
    subtitle: "Opinión en Al Poniente",
    href: "/columnas",
    image: "/images/gallon-entrevista-medellin.jpg",
  },
  {
    title: "Territorio Vivo",
    subtitle: "Historias de Antioquia",
    href: "/territorio-vivo",
    image: "/images/gallon-conversacion-rural.jpg",
  },
  {
    title: "Bitácora de Camino",
    subtitle: "Reflexiones personales",
    href: "/bitacora",
    image: "/images/gallon-retrato-montanas-portrait.jpg",
  },
  {
    title: "Antioquia Piensa",
    subtitle: "Ideas y Proyectos",
    href: "/antioquia-piensa",
    image: "/images/fondo-mapa-antioquia.jpg",
  },
  {
    title: "Un Café para Antioquia",
    subtitle: "Entrevistas y Diálogos",
    href: "/un-cafe",
    image: "/images/gallon-reunion-biblioteca.jpg",
  },
  {
    title: "Voces de Antioquia",
    subtitle: "Columnas Invitadas",
    href: "/voces",
    image: "/images/gallon-familia-grande.jpg",
  },
];

/* -------------------------------------------------------------------------- */
/* Quick nav — the 5-column bar from the PPTX mockup                          */
/* -------------------------------------------------------------------------- */
const quickNav = [
  { label: "Columna Inaugural", excerpt: "Las memorias que no quiero guardar en silencio", href: "/columnas/las-memorias-que-no-quiero-guardar-en-silencio" },
  { label: "Última Reflexión", excerpt: featuredReflection.title, href: `/bitacora/${featuredReflection.slug}` },
  { label: "Historia Destacada", excerpt: stories[0].title, href: `/territorio-vivo/${stories[0].slug}` },
  { label: "Entrevista", excerpt: episodes[0].title, href: "/un-cafe" },
  { label: "Ideas para el Futuro", excerpt: ideas[0].title, href: `/antioquia-piensa/${ideas[0].slug}` },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Gallón Memorias",
            url: "https://gallonantioquia.vercel.app",
            description:
              "Memorias, reflexiones y conversaciones sobre Antioquia.",
            author: {
              "@type": "Person",
              name: "Luis Horacio Gallón Arango",
              description: "Andino. Más de 35 años al servicio de Antioquia.",
            },
          }),
        }}
      />

      {/* ================================================================== */}
      {/* 1. HERO — Gallón + montañas + manifiesto                           */}
      {/* ================================================================== */}
      <section className="relative h-[100dvh] max-h-[100dvh] overflow-hidden -mt-[72px] md:-mt-[88px]">
        <div className="absolute inset-0">
          <img
            src="/images/gallon-retrato-obra-hd.jpg"
            alt="Horacio Gallón mirando de frente"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B3B24]/90 via-[#0B3B24]/25 to-transparent" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-16 lg:px-24 pb-20 md:pb-28">
          <FadeIn>
            <p className="font-ui uppercase tracking-[0.3em] text-dorado-tierra text-[10px] md:text-xs mb-4">
              Horacio Gallón
            </p>
            <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] tracking-tight text-white max-w-3xl mb-6">
              Las memorias que no quiero<br />
              <span className="italic text-dorado-tierra">guardar en silencio</span>
            </h1>
            <p className="font-body text-white/60 text-lg md:text-xl max-w-xl leading-relaxed mb-8">
              Mi historia. El camino que me trajo hasta aquí.
            </p>
            <Link
              href="/columnas/las-memorias-que-no-quiero-guardar-en-silencio"
              className="group inline-flex items-center gap-3 bg-dorado-tierra text-oscuro rounded-full px-6 py-3 font-heading font-bold text-sm hover:brightness-110 transition"
            >
              Leer columna
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 2. QUICK NAV — 5 columnas horizontales                             */}
      {/* ================================================================== */}
      <section className="bg-[#0B3B24] border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-white/10">
            {quickNav.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className={`group block px-4 md:px-5 py-5 md:py-6 hover:bg-white/5 transition-colors ${
                  index >= 4 ? "hidden md:block" : ""
                }`}
              >
                <p className="font-ui uppercase tracking-[0.15em] text-dorado-tierra text-[9px] md:text-[10px] mb-2">
                  {item.label}
                </p>
                <p className="font-display text-white text-sm md:text-base leading-snug line-clamp-2 group-hover:text-dorado-tierra transition-colors">
                  {item.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 3. GRID DE 6 SECCIONES — Portada de revista                        */}
      {/* ================================================================== */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {sectionGrid.map((section, index) => (
              <FadeIn key={section.href} delay={index * 80}>
                <Link
                  href={section.href}
                  className="group relative block aspect-[4/3] overflow-hidden"
                >
                  <img
                    src={section.image}
                    alt={section.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B3B24]/90 via-[#0B3B24]/30 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                    <h3 className="font-display text-xl md:text-2xl text-white leading-tight group-hover:text-dorado-tierra transition-colors">
                      {section.title}
                    </h3>
                    <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-white/60 mt-2">
                      {section.subtitle}
                    </p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 4. REFLEXIÓN DESTACADA — Contenido principal                       */}
      {/* ================================================================== */}
      <section className="py-16 md:py-24 border-t border-borde/50">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0">
              <div className="lg:col-span-5 lg:pr-16 flex flex-col justify-center order-2 lg:order-1">
                <p className="font-ui uppercase tracking-[0.25em] text-dorado-tierra text-[10px] mb-6">
                  Mis reflexiones
                </p>
                <h2 className="font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[0.95] tracking-tight text-texto-principal mb-6">
                  {featuredReflection.title}
                </h2>
                <p className="font-body text-texto-secundario text-base leading-relaxed mb-8">
                  {featuredReflection.excerpt}
                </p>
                <Link
                  href={`/bitacora/${featuredReflection.slug}`}
                  className="group inline-flex items-center gap-3 font-ui text-xs uppercase tracking-[0.15em] text-texto-principal border-b border-texto-principal/20 pb-2 hover:border-verde-antioquia hover:text-verde-antioquia transition-all duration-300 w-fit"
                >
                  Seguir leyendo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="lg:col-span-7 order-1 lg:order-2">
                <img
                  src={featuredReflection.image}
                  alt={featuredReflection.title}
                  className="w-full aspect-[4/3] lg:aspect-[3/4] object-cover"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 5. CIFRAS — Con mapa de fondo                                      */}
      {/* ================================================================== */}
      <section id="datos" className="relative py-24 md:py-32 bg-[#0B3B24] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img src="/images/fondo-mapa-antioquia.jpg" alt="" className="w-full h-full object-cover" aria-hidden="true" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
          <FadeIn>
            <p className="font-ui uppercase tracking-[0.3em] text-dorado-tierra text-[10px] mb-4">
              El camino en números
            </p>
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] tracking-tight text-white mb-16">
              Un camino de <span className="text-dorado-tierra italic">toda una vida</span>
            </h2>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-16 md:gap-y-20">
            {impactStats.map((stat, index) => (
              <FadeIn key={stat.label} delay={index * 100}>
                <StatCounter value={stat.value} suffix={stat.suffix} label={stat.label} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 5.5. PHOTO BAND — Full-width images                                */}
      {/* ================================================================== */}
      <section className="overflow-hidden">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-0">
          {[
            "/images/gallon-retrato-casco.jpg",
            "/images/gallon-conversacion-rural.jpg",
            "/images/gallon-tunel-moso.jpg",
            "/images/gallon-familia-intima.jpg",
            "/images/gallon-caminando-obra.jpg",
            "/images/gallon-pareja-futbol.jpg",
          ].map((src) => (
            <div key={src} className="aspect-square overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================== */}
      {/* 6. HISTORIAS — Destacada + lista                                    */}
      {/* ================================================================== */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
          <FadeIn>
            <div className="flex justify-between items-end mb-12">
              <div>
                <p className="font-ui uppercase tracking-[0.25em] text-dorado-tierra text-[10px] mb-3">Territorio Vivo</p>
                <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] tracking-tight">Historias</h2>
              </div>
              <Link href="/territorio-vivo" className="hidden md:inline-flex font-ui text-[10px] uppercase tracking-[0.2em] text-texto-terciario hover:text-verde-antioquia transition-colors">
                Ver todas &#8594;
              </Link>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-borde/50 overflow-hidden">
            {stories.slice(0, 3).map((story, index) => (
              <FadeIn key={story.slug} delay={index * 100}>
                <Link
                  href={`/territorio-vivo/${story.slug}`}
                  className="group block py-8 md:px-8 first:md:pl-0 last:md:pr-0 border-b md:border-b-0 md:border-r border-borde/50 last:border-0 overflow-hidden"
                >
                  <p className="font-ui uppercase tracking-[0.2em] text-dorado-tierra text-[10px] mb-3">{story.category}</p>
                  <h3 className="font-display text-lg leading-snug group-hover:text-verde-antioquia transition-colors">{story.title}</h3>
                  <p className="font-body text-sm text-texto-terciario mt-3 line-clamp-2">{story.excerpt}</p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 7. SOBRE HORACIO + PARTICIPA — Bottom bar                          */}
      {/* ================================================================== */}
      <section className="border-t border-borde/50 mb-12 md:mb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pt-3 md:pt-4">
            {/* Sobre Horacio */}
            <FadeIn>
              <Link href="/sobre" className="group relative block aspect-[16/9] overflow-hidden">
                <img
                  src="/images/gallon-retrato-obra-hd.jpg"
                  alt="Horacio Gallón"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B3B24]/90 via-[#0B3B24]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="font-display text-2xl text-white group-hover:text-dorado-tierra transition-colors">Mi historia</h3>
                  <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-white/60 mt-2">El camino que me trajo hasta aquí</p>
                </div>
              </Link>
            </FadeIn>

            {/* Participa */}
            <FadeIn delay={100}>
              <Link href="/participa" className="group relative block aspect-[16/9] overflow-hidden bg-arena">
                <div className="absolute inset-0 opacity-10">
                  <img src="/images/fondo-mapa-antioquia.jpg" alt="" className="w-full h-full object-cover" aria-hidden="true" />
                </div>
                <div className="relative h-full flex flex-col justify-center items-center text-center p-8">
                  <p className="font-ui uppercase tracking-[0.25em] text-dorado-tierra text-[10px] mb-4">Participa</p>
                  <h3 className="font-display text-2xl md:text-3xl text-texto-principal group-hover:text-verde-antioquia transition-colors mb-4">
                    Cuéntame tus ideas<br />
                    <span className="italic">para Antioquia</span>
                  </h3>
                  <span className="inline-flex items-center gap-2 font-ui text-xs uppercase tracking-[0.15em] text-texto-terciario group-hover:text-verde-antioquia transition-colors">
                    Participar <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 8. NEWSLETTER                                                       */}
      {/* ================================================================== */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/fondo-cafetal.jpg" alt="" className="w-full h-full object-cover" aria-hidden="true" />
          <div className="absolute inset-0 bg-[#0B3B24]/85" />
        </div>
        <div className="relative z-10 max-w-xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="font-ui uppercase tracking-[0.3em] text-dorado-tierra text-[10px] mb-6">Newsletter</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[0.95] tracking-tight text-white mb-4">
              Carta para Antioquia
            </h2>
            <p className="font-body text-white/60 text-sm leading-relaxed mb-8">
              Una vez al mes te escribo con reflexiones, historias y conversaciones sobre Antioquia.
            </p>
            <NewsletterForm variant="dark" />
          </FadeIn>
        </div>
      </section>
    </>
  );
}
