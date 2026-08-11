import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import SectionWrapper from "@/components/layout/SectionWrapper";

export const metadata: Metadata = {
  title: "Politica de privacidad",
  description:
    "Politica de privacidad de Gallon Memorias. Como tratamos tu informacion personal y datos de suscripcion.",
};

export default function PrivacidadPage() {
  return (
    <>
      <PageHero
        title="Politica de privacidad"
        subtitle="Como tratamos tu informacion personal."
        compact
      />
      <SectionWrapper>
        <div className="max-w-3xl mx-auto prose-custom">
          <p className="font-body text-texto-secundario leading-relaxed mb-6">
            Ultima actualizacion: abril 2026.
          </p>

          <h2 className="font-display text-2xl text-texto-principal mt-10 mb-4">
            1. Informacion que recopilamos
          </h2>
          <p className="font-body text-texto-secundario leading-relaxed mb-6">
            Gallon Memorias es un sitio editorial personal. Solo recopilamos la
            direccion de correo electronico que proporcionas voluntariamente al
            suscribirte a nuestro newsletter. No recopilamos datos de
            navegacion, ubicacion ni informacion financiera.
          </p>

          <h2 className="font-display text-2xl text-texto-principal mt-10 mb-4">
            2. Uso de la informacion
          </h2>
          <p className="font-body text-texto-secundario leading-relaxed mb-6">
            Tu correo electronico se utiliza exclusivamente para enviarte
            columnas, reflexiones y actualizaciones del sitio. No compartimos,
            vendemos ni cedemos tu informacion a terceros.
          </p>

          <h2 className="font-display text-2xl text-texto-principal mt-10 mb-4">
            3. Cookies y analitica
          </h2>
          <p className="font-body text-texto-secundario leading-relaxed mb-6">
            Este sitio puede utilizar cookies basicas de funcionamiento y
            herramientas de analitica anonima (como Vercel Analytics) para
            entender el trafico general. No se utilizan cookies de rastreo
            publicitario.
          </p>

          <h2 className="font-display text-2xl text-texto-principal mt-10 mb-4">
            4. Tus derechos
          </h2>
          <p className="font-body text-texto-secundario leading-relaxed mb-6">
            Puedes solicitar la eliminacion de tu correo electronico de nuestra
            lista en cualquier momento respondiendo a cualquier email del
            newsletter o escribiendonos directamente. Atenderemos tu solicitud
            en un plazo maximo de 10 dias habiles, conforme a la Ley 1581 de
            2012 de proteccion de datos personales de Colombia.
          </p>

          <h2 className="font-display text-2xl text-texto-principal mt-10 mb-4">
            5. Contacto
          </h2>
          <p className="font-body text-texto-secundario leading-relaxed mb-6">
            Para cualquier consulta relacionada con esta politica, puedes
            contactarnos a traves de nuestras redes sociales o respondiendo al
            newsletter.
          </p>
        </div>
      </SectionWrapper>
    </>
  );
}
