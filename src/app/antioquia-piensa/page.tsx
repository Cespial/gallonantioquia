import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import SectionWrapper from "@/components/layout/SectionWrapper";
import FadeIn from "@/components/animations/FadeIn";
import { ideas } from "@/data/content";

export const metadata: Metadata = {
  title: "Antioquia Piensa — Ideas y proyectos para el departamento",
  description:
    "Ideas y proyectos para el departamento que queremos construir.",
};

export default function AntioquiaPiensaPage() {
  return (
    <>
      <PageHero
        title="Antioquia Piensa"
        subtitle="Ideas y proyectos para el departamento que queremos construir."
      />

      <SectionWrapper>
        <div>
          {ideas.map((idea, index) => (
            <FadeIn key={idea.slug} delay={index * 100}>
              <Link href={`/antioquia-piensa/${idea.slug}`} className="block">
                <div
                  className={`flex gap-6 md:gap-10 items-start py-8 md:py-10 border-b border-borde ${
                    index === ideas.length - 1 ? "border-0" : ""
                  }`}
                >
                  {/* Number */}
                  <span className="font-display text-5xl md:text-6xl font-black text-dorado-tierra/20 leading-none min-w-[80px]">
                    {idea.number}
                  </span>

                  {/* Content */}
                  <div className="flex-1">
                    <h2 className="font-heading font-bold text-xl md:text-2xl hover:text-verde-antioquia transition">
                      {idea.title}
                    </h2>
                    <p className="font-body text-texto-secundario mt-2 text-lg">
                      {idea.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="text-texto-terciario hidden md:block self-center flex-shrink-0" />
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}
