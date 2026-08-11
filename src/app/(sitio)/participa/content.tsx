"use client";

import PageHero from "@/components/layout/PageHero";
import SectionWrapper from "@/components/layout/SectionWrapper";
import FadeIn from "@/components/animations/FadeIn";
import NewsletterForm from "@/components/content/NewsletterForm";

export default function ParticipaContent() {
  return (
    <>
      <PageHero
        title="Suscr&iacute;bete"
        subtitle="Recibe las reflexiones y columnas de Horacio directamente en tu correo."
        compact
      />

      <SectionWrapper>
        <div className="max-w-xl mx-auto text-center">
          <FadeIn>
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[0.95] tracking-tight text-texto-principal mb-4">
              Cartas para Antioquia
            </h2>
            <p className="font-body text-texto-secundario leading-relaxed mb-8">
              Una vez al mes te escribo con reflexiones, historias y
              conversaciones sobre Antioquia. Sin spam, solo lo que vale la pena
              compartir.
            </p>
            <NewsletterForm variant="light" />
            <p className="font-ui text-xs text-texto-terciario mt-6">
              Puedes cancelar tu suscripci&oacute;n en cualquier momento.
            </p>
          </FadeIn>
        </div>
      </SectionWrapper>
    </>
  );
}
