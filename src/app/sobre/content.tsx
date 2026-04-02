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
    title: "Miembro de la Junta Directiva del Metro de Medellín",
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
      "Presidente de la Junta Directiva del Centro de Bienestar del Anciano, Jardín",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Luis Horacio Gallón Arango",
            jobTitle: "Secretario de Infraestructura Física de Antioquia",
            birthDate: "1969-11-06",
            birthPlace: {
              "@type": "Place",
              name: "Andes, Antioquia, Colombia",
            },
            alumniOf: [
              { "@type": "CollegeOrUniversity", name: "Universidad Cooperativa de Colombia" },
              { "@type": "CollegeOrUniversity", name: "Universidad de Medellín" },
            ],
            sameAs: [
              "https://twitter.com/GallonHoracio",
              "https://instagram.com/gallonantioquia",
            ],
          }),
        }}
      />
      {/* ================================================================== */}
      {/*  1. Hero personal section                                          */}
      {/* ================================================================== */}
      <section className="bg-oscuro-verde min-h-[60vh] flex items-center relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-4 py-20">
          {/* Photo */}
          <FadeIn direction="left">
            <div className="w-full max-w-md aspect-[3/4] rounded-card overflow-hidden mx-auto lg:mx-0">
              <img
                src="/images/gallon-retrato-obra-hd.jpg"
                alt="Luis Horacio Gallón Arango"
                className="w-full h-full object-cover"
              />
            </div>
          </FadeIn>

          {/* Text */}
          <FadeIn direction="right">
            <div>
              <p className="font-ui uppercase tracking-[0.25em] text-dorado-tierra text-[10px] mb-4">
                Sobre mí
              </p>
              <h1 className="font-display text-page-title text-white">
                Horacio Gallón
              </h1>
              <p className="font-body text-xl text-white/70 mt-4 leading-relaxed">
                Nací en Andes. Llevo más de treinta años sirviendo a Antioquia. Y cada día estoy más convencido de que este departamento tiene todo para ser el mejor del país.
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
      {/*  2.5 Personal — La persona detrás del cargo                        */}
      {/* ================================================================== */}
      <SectionWrapper className="bg-dorado-claro/20">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="overflow-hidden rounded-card shadow-lg">
                <img
                  src="/images/gallon-pareja-futbol.jpg"
                  alt="Horacio Gallón y su esposa — un paisa de corazón"
                  className="w-full h-full object-cover aspect-[4/3]"
                />
              </div>
              <div>
                <p className="font-ui uppercase tracking-[0.25em] text-dorado-tierra text-[10px] mb-2">La persona</p>
                <h3 className="font-display text-subtitle mb-4">Más allá del cargo</h3>
                <p className="font-body text-texto-secundario leading-relaxed">
                  Soy hincha del fútbol, hijo de Andes, esposo, padre y abuelo. Cuando no estoy
                  recorriendo las vías del departamento, estoy con mi familia, con mi café y con
                  mis montañas. Al final del día, todo lo que hago es para que la gente de Antioquia
                  viva mejor.
                </p>
              </div>
            </div>
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
