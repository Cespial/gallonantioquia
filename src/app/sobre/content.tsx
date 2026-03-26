"use client";

import {
  Building2,
  TreePine,
  Droplets,
  Coffee,
  Heart,
  PenLine,
} from "lucide-react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import TimelineItem from "@/components/content/TimelineItem";
import FadeIn from "@/components/animations/FadeIn";
import PullQuote from "@/components/content/PullQuote";
import { timelineEvents, bioLong, manifestoQuotes } from "@/data/content";

/* -------------------------------------------------------------------------- */
/*  Roles data                                                                */
/* -------------------------------------------------------------------------- */

const roles = [
  {
    icon: Building2,
    title: "Miembro de la Junta Directiva del Metro de Medellin",
  },
  {
    icon: TreePine,
    title: "Miembro del Consejo Directivo de Corantioquia",
  },
  {
    icon: Droplets,
    title: "Miembro del Consejo Directivo del Plan Departamental de Aguas",
  },
  {
    icon: Coffee,
    title: "Delegado de la Cooperativa de Caficultores de Andes",
  },
  {
    icon: Heart,
    title:
      "Presidente de la Junta Directiva del Centro de Bienestar del Anciano, Jardin",
  },
  {
    icon: PenLine,
    title: "Columnista en Al Poniente",
  },
];

/* -------------------------------------------------------------------------- */
/*  Helper: split bioLong into paragraphs                                     */
/* -------------------------------------------------------------------------- */

function splitBio(text: string): string[] {
  // Split at sentence boundaries to create readable paragraphs (~2-3 sentences each)
  const sentences = text.match(/[^.]+\./g) || [text];
  const paragraphs: string[] = [];
  let current = "";

  sentences.forEach((sentence, index) => {
    current += sentence.trim() + " ";
    // Create a new paragraph every 2-3 sentences
    if ((index + 1) % 3 === 0 || index === sentences.length - 1) {
      paragraphs.push(current.trim());
      current = "";
    }
  });

  return paragraphs;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function SobreContent() {
  const bioParagraphs = splitBio(bioLong);
  const midPoint = Math.floor(bioParagraphs.length / 2);

  return (
    <>
      {/* ================================================================== */}
      {/*  1. Hero personal section                                          */}
      {/* ================================================================== */}
      <section className="bg-oscuro-verde min-h-[60vh] flex items-center relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-4 py-20">
          {/* Photo */}
          <FadeIn direction="left">
            <div className="w-full max-w-md aspect-[3/4] rounded-card overflow-hidden mx-auto lg:mx-0">
              <img
                src="/images/gallon-retrato-casco.jpg"
                alt="Luis Horacio Gallon Arango"
                className="w-full h-full object-cover"
              />
            </div>
          </FadeIn>

          {/* Text */}
          <FadeIn direction="right">
            <div>
              <h1 className="font-display text-page-title text-white">
                Luis Horacio Gallon Arango
              </h1>
              <p className="font-body text-xl text-dorado-tierra mt-4">
                Hijo de Andes. Servidor publico. Constructor de caminos.
              </p>
              <p className="font-body text-white/80 mt-6 text-lg italic">
                &ldquo;{manifestoQuotes[0]}&rdquo;
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ================================================================== */}
      {/*  2. Bio narrativa                                                  */}
      {/* ================================================================== */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto prose-editorial">
          <FadeIn>
            {bioParagraphs.slice(0, midPoint).map((paragraph, index) => (
              <p
                key={index}
                className="font-body text-texto-secundario text-lg leading-relaxed mb-6"
              >
                {paragraph}
              </p>
            ))}
          </FadeIn>

          <FadeIn>
            <PullQuote quote={manifestoQuotes[1]} />
          </FadeIn>

          <FadeIn>
            {bioParagraphs.slice(midPoint).map((paragraph, index) => (
              <p
                key={index + midPoint}
                className="font-body text-texto-secundario text-lg leading-relaxed mb-6"
              >
                {paragraph}
              </p>
            ))}
          </FadeIn>
        </div>
      </SectionWrapper>

      {/* ================================================================== */}
      {/*  3. Linea de tiempo                                                */}
      {/* ================================================================== */}
      <SectionWrapper className="bg-verde-suave/50">
        <h2 className="font-display text-section-title text-center mb-12">
          Trayectoria
        </h2>

        <div className="max-w-3xl mx-auto">
          {timelineEvents.map((event, index) => (
            <FadeIn key={event.year + event.title} delay={index * 80}>
              <TimelineItem
                year={event.year}
                title={event.title}
                description={event.description}
                index={index}
                isLast={index === timelineEvents.length - 1}
              />
            </FadeIn>
          ))}
        </div>
      </SectionWrapper>

      {/* ================================================================== */}
      {/*  4. Otros roles                                                    */}
      {/* ================================================================== */}
      <SectionWrapper>
        <h2 className="font-display text-section-title mb-8">
          Otros roles destacados
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <FadeIn key={role.title} delay={index * 80}>
                <div className="bg-blanco-calido rounded-card p-5 border border-borde/50">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-verde-suave flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-verde-antioquia" />
                    </div>
                    <p className="font-heading font-semibold text-sm text-texto-principal leading-snug">
                      {role.title}
                    </p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </SectionWrapper>
    </>
  );
}
