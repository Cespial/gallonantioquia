import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import SectionWrapper from "@/components/layout/SectionWrapper";

export const metadata: Metadata = {
  title: "Terminos de uso",
  description:
    "Terminos y condiciones de uso del sitio Gallon Memorias.",
};

export default function TerminosPage() {
  return (
    <>
      <PageHero
        title="Terminos de uso"
        subtitle="Condiciones para el uso de este sitio."
        compact
      />
      <SectionWrapper>
        <div className="max-w-3xl mx-auto prose-custom">
          <p className="font-body text-texto-secundario leading-relaxed mb-6">
            Ultima actualizacion: abril 2026.
          </p>

          <h2 className="font-display text-2xl text-texto-principal mt-10 mb-4">
            1. Naturaleza del sitio
          </h2>
          <p className="font-body text-texto-secundario leading-relaxed mb-6">
            Gallon Memorias es un sitio editorial personal dedicado a columnas,
            reflexiones y conversaciones sobre Antioquia. No es una plataforma
            comercial ni presta servicios profesionales a traves de este medio.
          </p>

          <h2 className="font-display text-2xl text-texto-principal mt-10 mb-4">
            2. Propiedad intelectual
          </h2>
          <p className="font-body text-texto-secundario leading-relaxed mb-6">
            Todo el contenido publicado en este sitio &mdash; textos,
            fotografias, diseno y elementos graficos &mdash; es propiedad de su
            autor salvo que se indique lo contrario. Puedes citar fragmentos
            breves con la debida atribucion y enlace al articulo original. La
            reproduccion total sin autorizacion esta prohibida.
          </p>

          <h2 className="font-display text-2xl text-texto-principal mt-10 mb-4">
            3. Contenido de opinion
          </h2>
          <p className="font-body text-texto-secundario leading-relaxed mb-6">
            Las columnas y reflexiones publicadas representan opiniones
            personales del autor. No constituyen asesoria profesional de ningun
            tipo. Las entrevistas en la seccion Voces reflejan las opiniones de
            cada invitado.
          </p>

          <h2 className="font-display text-2xl text-texto-principal mt-10 mb-4">
            4. Enlaces externos
          </h2>
          <p className="font-body text-texto-secundario leading-relaxed mb-6">
            Este sitio puede contener enlaces a sitios de terceros. No somos
            responsables del contenido, politicas de privacidad ni practicas de
            dichos sitios externos.
          </p>

          <h2 className="font-display text-2xl text-texto-principal mt-10 mb-4">
            5. Modificaciones
          </h2>
          <p className="font-body text-texto-secundario leading-relaxed mb-6">
            Nos reservamos el derecho de modificar estos terminos en cualquier
            momento. Los cambios seran efectivos desde su publicacion en esta
            pagina.
          </p>
        </div>
      </SectionWrapper>
    </>
  );
}
